from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import List, Optional
from app.database.database import get_db
from app.models.models import Hospital, HospitalCapacity, PreAlert, EmergencyRequest, Inventory, Alert
from app.schemas.schemas import CapacityUpdateIn, InventoryUpdateIn, HospitalCapacityOut, InventoryOut
from app.services.forecast_service import forecast_service
from app.services.supply_chain_service import supply_chain_service
from app.services.recommendation_service import RecommendationService
from app.services.audit_service import audit_service
from app.websocket.connection_manager import manager

router = APIRouter(prefix="/api/hospital", tags=["Hospital Admin"])

@router.get("/dashboard")
def get_hospital_dashboard(hospital_id: int = Query(1), db: Session = Depends(get_db)):
    hosp = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not hosp:
        raise HTTPException(status_code=404, detail="Hospital not found")

    freshness, _ = RecommendationService.get_data_freshness(hosp.last_updated)

    # Prealerts
    prealerts = db.query(PreAlert).filter(PreAlert.hospital_id == hospital_id).all()
    pending_prealerts = [p for p in prealerts if p.status == "PENDING"]

    # Inventory risks
    inv_analysis = supply_chain_service.analyze_inventory_stockouts(db, hospital_id)
    critical_inv = [i for i in inv_analysis if i["stockout_risk"] in ["Critical", "Low"]]

    # Forecast
    fc = forecast_service.calculate_hospital_forecast(hosp)

    # Resilience Card
    resilience = supply_chain_service.calculate_resource_resilience_card(hosp)

    return {
        "hospital_id": hosp.id,
        "hospital_name": hosp.name,
        "data_freshness": freshness,
        "last_updated": hosp.last_updated,
        "capacity": hosp.capacity,
        "pending_prealerts_count": len(pending_prealerts),
        "critical_inventory_count": len(critical_inv),
        "forecast": fc,
        "resilience": resilience
    }

@router.put("/capacity", response_model=HospitalCapacityOut)
async def update_capacity(req: CapacityUpdateIn, hospital_id: int = Query(1), db: Session = Depends(get_db)):
    hosp = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not hosp:
        raise HTTPException(status_code=404, detail="Hospital not found")

    cap = hosp.capacity
    if not cap:
        cap = HospitalCapacity(hospital_id=hosp.id)
        db.add(cap)

    if req.icu_total is not None: cap.icu_total = req.icu_total
    if req.icu_available is not None: cap.icu_available = req.icu_available
    if req.ward_total is not None: cap.ward_total = req.ward_total
    if req.ward_available is not None: cap.ward_available = req.ward_available
    if req.ventilators_total is not None: cap.ventilators_total = req.ventilators_total
    if req.ventilators_available is not None: cap.ventilators_available = req.ventilators_available
    if req.oxygen_level is not None: cap.oxygen_level = req.oxygen_level
    if req.blood_units is not None: cap.blood_units = req.blood_units

    now = datetime.now(timezone.utc)
    cap.last_updated = now
    hosp.last_updated = now

    db.commit()
    db.refresh(cap)

    # Log audit event
    await audit_service.log_event(
        db,
        actor_role="HOSPITAL_ADMIN",
        event_type="CAPACITY_UPDATED",
        entity_id=str(hosp.id),
        metadata_json={
            "hospital_name": hosp.name,
            "icu_available": cap.icu_available,
            "oxygen_level": cap.oxygen_level
        }
    )

    # Broadcast websocket update
    await manager.broadcast({
        "type": "CAPACITY_UPDATED",
        "data": {
            "hospital_id": hosp.id,
            "hospital_name": hosp.name,
            "icu_available": cap.icu_available,
            "oxygen_level": cap.oxygen_level,
            "last_updated": cap.last_updated.isoformat()
        }
    })

    return cap

@router.get("/prealerts")
def list_prealerts(hospital_id: int = Query(1), db: Session = Depends(get_db)):
    prealerts = db.query(PreAlert).filter(PreAlert.hospital_id == hospital_id).order_by(PreAlert.sent_at.desc()).all()
    results = []
    for p in prealerts:
        em = p.emergency
        results.append({
            "id": p.id,
            "emergency_id": p.emergency_id,
            "incident_type": em.incident_type,
            "severity": em.severity,
            "patient_count": em.patient_count,
            "details": em.details,
            "status": p.status,
            "sent_at": p.sent_at,
            "responded_at": p.responded_at,
            "rejection_reason": p.rejection_reason,
            "ambulance_code": em.assignment.ambulance.identifier if (em.assignment and em.assignment.ambulance) else "N/A"
        })
    return results

@router.post("/prealerts/{id}/accept")
async def accept_prealert(id: int, db: Session = Depends(get_db)):
    pre = db.query(PreAlert).filter(PreAlert.id == id).first()
    if not pre:
        raise HTTPException(status_code=404, detail="PreAlert not found")
    pre.status = "ACCEPTED"
    pre.responded_at = datetime.now(timezone.utc)
    if pre.emergency:
        pre.emergency.status = "PREALERT_ACCEPTED"
    db.commit()

    await audit_service.log_event(
        db,
        actor_role="HOSPITAL_ADMIN",
        event_type="PREALERT_ACCEPTED",
        entity_id=str(pre.emergency_id),
        metadata_json={"hospital_id": pre.hospital_id, "hospital_name": pre.hospital.name}
    )

    await manager.broadcast({
        "type": "PREALERT_ACCEPTED",
        "data": {"emergency_id": pre.emergency_id, "hospital_id": pre.hospital_id}
    })
    return {"status": "SUCCESS", "message": "Pre-alert accepted"}

@router.post("/prealerts/{id}/reject")
async def reject_prealert(id: int, reason: str = Query("No available ICU bed"), db: Session = Depends(get_db)):
    pre = db.query(PreAlert).filter(PreAlert.id == id).first()
    if not pre:
        raise HTTPException(status_code=404, detail="PreAlert not found")
    pre.status = "REJECTED"
    pre.rejection_reason = reason
    pre.responded_at = datetime.now(timezone.utc)
    if pre.emergency:
        pre.emergency.status = "PREALERT_REJECTED"
    db.commit()

    await audit_service.log_event(
        db,
        actor_role="HOSPITAL_ADMIN",
        event_type="PREALERT_REJECTED",
        entity_id=str(pre.emergency_id),
        metadata_json={"hospital_id": pre.hospital_id, "reason": reason}
    )

    await manager.broadcast({
        "type": "PREALERT_REJECTED",
        "data": {"emergency_id": pre.emergency_id, "hospital_id": pre.hospital_id, "reason": reason}
    })
    return {"status": "REJECTED", "message": "Pre-alert rejected, dispatcher notified"}

@router.post("/prealerts/{id}/received")
async def patient_received(id: int, db: Session = Depends(get_db)):
    pre = db.query(PreAlert).filter(PreAlert.id == id).first()
    if not pre:
        raise HTTPException(status_code=404, detail="PreAlert not found")
    pre.status = "RECEIVED"
    if pre.emergency:
        pre.emergency.status = "ARRIVED"

    # Decrement 1 ICU bed upon arrival if available
    cap = pre.hospital.capacity
    if cap and cap.icu_available > 0:
        cap.icu_available -= 1

    db.commit()

    await audit_service.log_event(
        db,
        actor_role="HOSPITAL_ADMIN",
        event_type="PATIENT_RECEIVED",
        entity_id=str(pre.emergency_id),
        metadata_json={"hospital_id": pre.hospital_id}
    )

    await manager.broadcast({
        "type": "PATIENT_RECEIVED",
        "data": {"emergency_id": pre.emergency_id, "hospital_id": pre.hospital_id}
    })
    return {"status": "SUCCESS", "message": "Patient received at hospital"}

@router.get("/inventory", response_model=List[InventoryOut])
def list_inventory(hospital_id: int = Query(1), db: Session = Depends(get_db)):
    return supply_chain_service.analyze_inventory_stockouts(db, hospital_id)

@router.get("/forecast")
def get_forecast(hospital_id: int = Query(1), db: Session = Depends(get_db)):
    hosp = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not hosp:
        raise HTTPException(status_code=404, detail="Hospital not found")
    return forecast_service.calculate_hospital_forecast(hosp)
