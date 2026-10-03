from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from app.database.database import get_db
from app.models.models import EmergencyRequest, Recommendation, Ambulance, Assignment, PreAlert, Hospital
from app.schemas.schemas import AssignIn, AmbulanceOut
from app.services.recommendation_service import RecommendationService
from app.services.map_service import calculate_haversine_distance, estimate_eta_minutes
from app.services.audit_service import audit_service
from app.websocket.connection_manager import manager

router = APIRouter(prefix="/api/dispatcher", tags=["Dispatcher"])

@router.get("/emergencies")
def list_dispatcher_emergencies(db: Session = Depends(get_db)):
    emergencies = db.query(EmergencyRequest).order_by(EmergencyRequest.created_at.desc()).all()
    results = []
    for em in emergencies:
        rec_count = len(em.recommendations)
        results.append({
            "id": em.id,
            "incident_type": em.incident_type,
            "severity": em.severity,
            "latitude": em.latitude,
            "longitude": em.longitude,
            "patient_count": em.patient_count,
            "status": em.status,
            "created_at": em.created_at,
            "has_assignment": em.assignment is not None,
            "assigned_hospital_name": em.assignment.hospital.name if em.assignment else None,
            "assigned_ambulance_code": em.assignment.ambulance.identifier if (em.assignment and em.assignment.ambulance) else None
        })
    return results

@router.get("/emergencies/{id}")
def get_dispatcher_emergency_detail(id: int, db: Session = Depends(get_db)):
    em = db.query(EmergencyRequest).filter(EmergencyRequest.id == id).first()
    if not em:
        raise HTTPException(status_code=404, detail="Emergency request not found")

    top_3, comparison = RecommendationService.rank_hospitals_for_emergency(db, em)

    return {
        "emergency": em,
        "top_3_recommendations": top_3,
        "comparison": comparison,
        "assignment": em.assignment,
        "prealert": em.prealert
    }

@router.get("/recommendations/{emergency_id}")
def get_recommendations(emergency_id: int, db: Session = Depends(get_db)):
    em = db.query(EmergencyRequest).filter(EmergencyRequest.id == emergency_id).first()
    if not em:
        raise HTTPException(status_code=404, detail="Emergency not found")
    top_3, comparison = RecommendationService.rank_hospitals_for_emergency(db, em)
    return {
        "emergency_id": emergency_id,
        "top_3": top_3,
        "comparison": comparison
    }

@router.get("/ambulances", response_model=List[AmbulanceOut])
def list_ambulances(
    lat: Optional[float] = Query(None),
    lng: Optional[float] = Query(None),
    db: Session = Depends(get_db)
):
    ambulances = db.query(Ambulance).all()
    results = []
    for amb in ambulances:
        dist = 0.0
        eta = 0
        if lat is not None and lng is not None:
            dist = calculate_haversine_distance(lat, lng, amb.latitude, amb.longitude)
            eta = estimate_eta_minutes(dist)

        amb_out = AmbulanceOut.model_validate(amb)
        amb_out.distance_km = dist
        amb_out.eta_minutes = eta
        results.append(amb_out)

    results.sort(key=lambda x: x.distance_km if (lat and lng) else x.id)
    return results

@router.post("/assign")
async def assign_emergency(req: AssignIn, db: Session = Depends(get_db)):
    em = db.query(EmergencyRequest).filter(EmergencyRequest.id == req.emergency_id).first()
    if not em:
        raise HTTPException(status_code=404, detail="Emergency request not found")

    hosp = db.query(Hospital).filter(Hospital.id == req.hospital_id).first()
    if not hosp:
        raise HTTPException(status_code=404, detail="Hospital not found")

    amb = None
    if req.ambulance_id:
        amb = db.query(Ambulance).filter(Ambulance.id == req.ambulance_id).first()
        if amb:
            amb.status = "ASSIGNED"

    # Create or update assignment
    existing_assign = db.query(Assignment).filter(Assignment.emergency_id == em.id).first()
    if existing_assign:
        existing_assign.hospital_id = hosp.id
        existing_assign.ambulance_id = amb.id if amb else None
        existing_assign.assigned_by = "DISPATCHER"
    else:
        assign = Assignment(
            emergency_id=em.id,
            hospital_id=hosp.id,
            ambulance_id=amb.id if amb else None,
            assigned_by="DISPATCHER",
            status="ASSIGNED"
        )
        db.add(assign)

    # Create or update Pre-Alert
    existing_prealert = db.query(PreAlert).filter(PreAlert.emergency_id == em.id).first()
    if existing_prealert:
        existing_prealert.hospital_id = hosp.id
        existing_prealert.status = "PENDING"
        existing_prealert.sent_at = datetime.now(timezone.utc)
    else:
        prealert = PreAlert(
            emergency_id=em.id,
            hospital_id=hosp.id,
            status="PENDING"
        )
        db.add(prealert)

    em.status = "ASSIGNED"
    db.commit()

    # Log audit event
    event_type = "DISPATCHER_OVERRIDE" if req.is_override else "HOSPITAL_ASSIGNED"
    await audit_service.log_event(
        db,
        actor_role="DISPATCHER",
        event_type=event_type,
        entity_id=str(em.id),
        metadata_json={
            "hospital_id": hosp.id,
            "hospital_name": hosp.name,
            "ambulance_id": amb.id if amb else None,
            "is_override": req.is_override,
            "override_reason": req.override_reason
        }
    )

    # Broadcast websocket event to Hospital Admin
    await manager.broadcast({
        "type": "PREALERT_CREATED",
        "data": {
            "emergency_id": em.id,
            "hospital_id": hosp.id,
            "hospital_name": hosp.name,
            "incident_type": em.incident_type,
            "severity": em.severity,
            "patient_count": em.patient_count,
            "ambulance_code": amb.identifier if amb else "N/A"
        }
    })

    return {
        "status": "SUCCESS",
        "message": f"Assigned Hospital {hosp.name} and Ambulance {amb.identifier if amb else 'N/A'}",
        "emergency_id": em.id
    }
