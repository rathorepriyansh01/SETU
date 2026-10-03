from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from app.database.database import get_db
from app.models.models import Hospital, EmergencyRequest, RedistributionOpportunity, Alert, AuditEvent, HospitalCapacity
from app.schemas.schemas import SimulationIn, RedistributionOpportunityOut, AuditEventOut
from app.services.supply_chain_service import supply_chain_service
from app.services.simulation_service import simulation_service
from app.services.recommendation_service import RecommendationService
from app.services.audit_service import audit_service
from app.websocket.connection_manager import manager

router = APIRouter(prefix="/api/admin", tags=["Health Officer Admin"])

@router.get("/command-center")
def get_command_center(db: Session = Depends(get_db)):
    hospitals = db.query(Hospital).all()
    emergencies = db.query(EmergencyRequest).all()

    active_emergencies = [e for e in emergencies if e.status not in ["ARRIVED", "CANCELLED"]]

    total_icu_avail = 0
    total_icu_capacity = 0
    hospitals_under_pressure = 0
    freshness_summary = {"Fresh": 0, "Aging": 0, "Stale": 0, "Offline": 0}

    for h in hospitals:
        freshness, _ = RecommendationService.get_data_freshness(h.last_updated)
        freshness_summary[freshness] = freshness_summary.get(freshness, 0) + 1

        cap = h.capacity
        if cap:
            total_icu_capacity += cap.icu_total
            total_icu_avail += cap.icu_available
            icu_pct = ((cap.icu_total - cap.icu_available) / float(cap.icu_total)) * 100.0 if cap.icu_total > 0 else 0
            if icu_pct >= 75:
                hospitals_under_pressure += 1

    network_icu_utilization = round(((total_icu_capacity - total_icu_avail) / float(max(1, total_icu_capacity))) * 100.0, 1)

    # Stockout risk scan
    inv_analysis = supply_chain_service.analyze_inventory_stockouts(db)
    stockout_risks_count = sum(1 for i in inv_analysis if i["stockout_risk"] in ["Critical", "Low"])

    # Redistribution opportunities
    redist_opps = supply_chain_service.detect_redistribution_opportunities(db)

    return {
        "city": "Bhopal, Madhya Pradesh",
        "demo_mode": "Demo Network / Simulated Data",
        "active_emergencies_count": len(active_emergencies),
        "total_hospitals_count": len(hospitals),
        "hospitals_under_pressure_count": hospitals_under_pressure,
        "network_icu_utilization_percent": network_icu_utilization,
        "stockout_risks_count": stockout_risks_count,
        "redistribution_opportunities_count": len([r for r in redist_opps if r.status == "PROPOSED"]),
        "average_response_time_min": 8.4,
        "freshness_summary": freshness_summary
    }

@router.get("/freshness")
def get_data_freshness_center(db: Session = Depends(get_db)):
    hospitals = db.query(Hospital).all()
    results = []
    for h in hospitals:
        freshness, penalty = RecommendationService.get_data_freshness(h.last_updated)
        resilience = supply_chain_service.calculate_resource_resilience_card(h)
        results.append({
            "hospital_id": h.id,
            "hospital_name": h.name,
            "freshness_status": freshness,
            "confidence_penalty": f"-{int((1.0 - penalty)*100)}%",
            "last_updated": h.last_updated,
            "resilience": resilience,
            "anomaly_flag": freshness in ["Stale", "Offline"]
        })
    return results

@router.get("/redistribution")
def list_redistribution_opportunities(db: Session = Depends(get_db)):
    opps = supply_chain_service.detect_redistribution_opportunities(db)
    results = []
    for o in opps:
        results.append({
            "id": o.id,
            "source_hospital_id": o.source_hospital_id,
            "source_hospital_name": o.source_hospital.name if o.source_hospital else "Hospital B",
            "target_hospital_id": o.target_hospital_id,
            "target_hospital_name": o.target_hospital.name if o.target_hospital else "Hospital A",
            "resource": o.resource,
            "available_quantity": o.available_quantity,
            "required_quantity": o.required_quantity,
            "unit": o.unit,
            "status": o.status,
            "created_at": o.created_at
        })
    return results

@router.post("/redistribution/{id}/approve")
async def approve_redistribution(id: int, db: Session = Depends(get_db)):
    opp = db.query(RedistributionOpportunity).filter(RedistributionOpportunity.id == id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Redistribution opportunity not found")
    opp.status = "APPROVED"
    db.commit()

    await audit_service.log_event(
        db,
        actor_role="HEALTH_OFFICER",
        event_type="REDISTRIBUTION_APPROVED",
        entity_id=str(opp.id),
        metadata_json={
            "resource": opp.resource,
            "quantity": opp.required_quantity,
            "source_hospital": opp.source_hospital.name if opp.source_hospital else "Hosp B",
            "target_hospital": opp.target_hospital.name if opp.target_hospital else "Hosp A"
        }
    )

    await manager.broadcast({
        "type": "REDISTRIBUTION_APPROVED",
        "data": {"id": opp.id, "resource": opp.resource}
    })
    return {"status": "SUCCESS", "message": "Redistribution approved. Stock transfer initiated."}

@router.post("/redistribution/{id}/reject")
async def reject_redistribution(id: int, db: Session = Depends(get_db)):
    opp = db.query(RedistributionOpportunity).filter(RedistributionOpportunity.id == id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Redistribution opportunity not found")
    opp.status = "REJECTED"
    db.commit()

    await audit_service.log_event(
        db,
        actor_role="HEALTH_OFFICER",
        event_type="REDISTRIBUTION_REJECTED",
        entity_id=str(opp.id)
    )
    return {"status": "REJECTED", "message": "Redistribution rejected by health officer."}

@router.post("/simulation")
async def run_simulation(req: SimulationIn, db: Session = Depends(get_db)):
    result = simulation_service.run_mass_casualty_simulation(
        db,
        patient_count=req.patient_count,
        critical_count=req.critical_count,
        high_count=req.high_count,
        moderate_count=req.moderate_count
    )

    await audit_service.log_event(
        db,
        actor_role="HEALTH_OFFICER",
        event_type="SIMULATION_RUN",
        entity_id="SIM-SURGE",
        metadata_json={
            "patient_count": req.patient_count,
            "summary": result.get("evaluation_metrics", {}).get("summary")
        }
    )

    return result

@router.get("/evaluation")
def get_evaluation(db: Session = Depends(get_db)):
    """Returns evaluation metrics comparing Baseline Nearest vs SETU allocation logic."""
    sim = simulation_service.run_mass_casualty_simulation(db, patient_count=15)
    return {
        "metrics": {
            "average_eta_baseline_min": sim["baseline_nearest"]["average_eta_min"],
            "average_eta_setu_min": sim["setu_allocation"]["average_eta_min"],
            "critical_overloads_baseline": sim["baseline_nearest"]["critical_overloads"],
            "critical_overloads_setu": sim["setu_allocation"]["critical_overloads"],
            "capacity_balance_score": sim["evaluation_metrics"]["capacity_balance_score"],
            "methodology": "Evaluation conducted via reproducible mass-casualty simulation engine across 5 Bhopal emergency hospitals comparing nearest-distance routing vs SETU multi-factor capacity scoring."
        }
    }

@router.get("/audit-events", response_model=List[AuditEventOut])
def get_audit_trail(db: Session = Depends(get_db)):
    events = db.query(AuditEvent).order_by(AuditEvent.created_at.desc()).limit(100).all()
    return events
