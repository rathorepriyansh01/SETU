from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.models import Hospital, EmergencyRequest, Recommendation, Ambulance, Assignment, PreAlert
from app.schemas.schemas import HospitalOut, SearchIn, IntentResultOut, EmergencyCreateIn, AmbulanceOut
from app.services.recommendation_service import RecommendationService
from app.services.ai_service import ai_service
from app.services.audit_service import audit_service
from app.websocket.connection_manager import manager

router = APIRouter(prefix="/api", tags=["Patient"])

@router.get("/hospitals", response_model=List[HospitalOut])
def list_hospitals(db: Session = Depends(get_db)):
    hospitals = db.query(Hospital).all()
    results = []
    for h in hospitals:
        freshness, _ = RecommendationService.get_data_freshness(h.last_updated)
        h_dict = HospitalOut.model_validate(h)
        h_dict.freshness_status = freshness
        results.append(h_dict)
    return results

@router.get("/hospitals/{id}", response_model=HospitalOut)
def get_hospital(id: int, db: Session = Depends(get_db)):
    h = db.query(Hospital).filter(Hospital.id == id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found")
    freshness, _ = RecommendationService.get_data_freshness(h.last_updated)
    res = HospitalOut.model_validate(h)
    res.freshness_status = freshness
    return res

@router.post("/healthcare/search", response_model=IntentResultOut)
def search_healthcare(req: SearchIn, db: Session = Depends(get_db)):
    intent = ai_service.understand_requirement(req.query)
    
    # Database resource matching
    dept_target = intent.get("department", "General")
    hospitals = db.query(Hospital).all()
    
    matched = []
    for h in hospitals:
        freshness, _ = RecommendationService.get_data_freshness(h.last_updated)
        h_out = HospitalOut.model_validate(h)
        h_out.freshness_status = freshness
        
        # Check department availability
        has_dept = any(d.name.lower() == dept_target.lower() and d.available for d in h.departments)
        if has_dept or dept_target == "General":
            matched.append(h_out)
            
    if not matched:
        matched = [HospitalOut.model_validate(h) for h in hospitals[:3]]
        
    ai_explanation = f"We understood your request for {intent.get('department')} ({intent.get('service')}). Below are the nearest hospitals with active departments and verified capacity."

    return {
        "query": req.query,
        "understood_intent": intent,
        "matching_hospitals": matched,
        "ai_explanation": ai_explanation
    }

@router.post("/emergency")
async def create_emergency(req: EmergencyCreateIn, db: Session = Depends(get_db)):
    emergency = EmergencyRequest(
        incident_type=req.incident_type,
        severity=req.severity,
        latitude=req.latitude,
        longitude=req.longitude,
        patient_count=req.patient_count,
        patient_name=req.patient_name,
        patient_contact=req.patient_contact,
        details=req.details,
        status="PENDING"
    )
    db.add(emergency)
    db.commit()
    db.refresh(emergency)

    # Automatically generate Top 3 Recommendations via backend deterministic logic
    top_3, comparison = RecommendationService.rank_hospitals_for_emergency(db, emergency)

    for rec in top_3:
        db_rec = Recommendation(
            emergency_id=emergency.id,
            hospital_id=rec["hospital_id"],
            rank=rec["rank"],
            score=rec["score"],
            reasons=rec["reasons"],
            distance_km=rec["distance_km"],
            eta_minutes=rec["eta_minutes"]
        )
        db.add(db_rec)
    db.commit()

    # Log audit event
    await audit_service.log_event(
        db,
        actor_role="PATIENT",
        event_type="EMERGENCY_CREATED",
        entity_id=str(emergency.id),
        metadata_json={
            "incident_type": req.incident_type,
            "severity": req.severity,
            "patient_count": req.patient_count,
            "top_3_generated": [r["hospital_name"] for r in top_3]
        }
    )

    # Broadcast websocket event
    await manager.broadcast({
        "type": "NEW_EMERGENCY",
        "data": {
            "id": emergency.id,
            "incident_type": emergency.incident_type,
            "severity": emergency.severity,
            "patient_count": emergency.patient_count,
            "latitude": emergency.latitude,
            "longitude": emergency.longitude,
            "created_at": emergency.created_at.isoformat()
        }
    })

    return {
        "emergency_id": emergency.id,
        "status": emergency.status,
        "message": "Emergency request submitted and added to dispatcher queue",
        "top_3_recommendations": top_3,
        "comparison": comparison
    }

@router.get("/emergency/{id}")
def track_emergency(id: int, db: Session = Depends(get_db)):
    emergency = db.query(EmergencyRequest).filter(EmergencyRequest.id == id).first()
    if not emergency:
        raise HTTPException(status_code=404, detail="Emergency request not found")

    assignment = emergency.assignment
    prealert = emergency.prealert

    assigned_hospital = assignment.hospital if assignment else None
    assigned_ambulance = assignment.ambulance if assignment else None

    # Calculate simulated ambulance trajectory if en route
    simulated_lat = assigned_ambulance.latitude if assigned_ambulance else emergency.latitude
    simulated_lng = assigned_ambulance.longitude if assigned_ambulance else emergency.longitude

    return {
        "id": emergency.id,
        "incident_type": emergency.incident_type,
        "severity": emergency.severity,
        "status": emergency.status,
        "patient_count": emergency.patient_count,
        "created_at": emergency.created_at,
        "destination_hospital": {
            "id": assigned_hospital.id,
            "name": assigned_hospital.name,
            "latitude": assigned_hospital.latitude,
            "longitude": assigned_hospital.longitude,
            "phone": assigned_hospital.phone
        } if assigned_hospital else None,
        "ambulance": {
            "id": assigned_ambulance.id,
            "identifier": assigned_ambulance.identifier,
            "latitude": simulated_lat,
            "longitude": simulated_lng,
            "equipment": assigned_ambulance.equipment,
            "phone": assigned_ambulance.phone
        } if assigned_ambulance else None,
        "eta_minutes": 7 if emergency.status in ["ASSIGNED", "PREALERT_ACCEPTED", "EN_ROUTE"] else 0
    }
