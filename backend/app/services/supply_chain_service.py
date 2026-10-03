from typing import List, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.models.models import Hospital, Inventory, HospitalCapacity, RedistributionOpportunity
from app.services.recommendation_service import RecommendationService

class SupplyChainService:
    @staticmethod
    def analyze_inventory_stockouts(db: Session, hospital_id: int = None) -> List[Dict[str, Any]]:
        """
        Calculates days remaining and stockout risk for hospital items.
        Formula: days_remaining = max(0, current_stock / daily_consumption)
        """
        query = db.query(Inventory)
        if hospital_id:
            query = query.filter(Inventory.hospital_id == hospital_id)
        
        items = query.all()
        results = []
        for item in items:
            daily_use = max(0.1, item.daily_consumption)
            days_rem = round(item.current_stock / daily_use, 1)

            risk = "Healthy"
            if days_rem <= 2.0 or item.current_stock <= item.reorder_threshold:
                risk = "Critical"
            elif days_rem <= 5.0:
                risk = "Low"

            results.append({
                "id": item.id,
                "hospital_id": item.hospital_id,
                "hospital_name": item.hospital.name if item.hospital else "Unknown",
                "item_name": item.item_name,
                "category": item.category,
                "current_stock": item.current_stock,
                "daily_consumption": item.daily_consumption,
                "reorder_threshold": item.reorder_threshold,
                "unit": item.unit,
                "days_remaining": days_rem,
                "stockout_risk": risk,
                "last_updated": item.last_updated
            })
        return results

    @staticmethod
    def detect_redistribution_opportunities(db: Session) -> List[RedistributionOpportunity]:
        """
        Scans all hospitals for supply imbalances (Deficit at Hosp A + Surplus at Hosp B).
        Generates or returns existing Redistribution Opportunities.
        """
        hospitals = db.query(Hospital).all()
        # Fetch items
        all_inventory = db.query(Inventory).all()

        # Group inventory by item_name
        by_item: Dict[str, List[Inventory]] = {}
        for inv in all_inventory:
            by_item.setdefault(inv.item_name, []).append(inv)

        created_opps = []

        for item_name, inv_list in by_item.items():
            deficits = []
            surpluses = []

            for inv in inv_list:
                daily_use = max(0.1, inv.daily_consumption)
                days_rem = inv.current_stock / daily_use
                if days_rem <= 4.0 or inv.current_stock <= inv.reorder_threshold:
                    deficits.append((inv, round((inv.reorder_threshold * 2) - inv.current_stock, 1)))
                elif days_rem >= 12.0 and inv.current_stock > (inv.reorder_threshold * 3):
                    surplus_qty = round(inv.current_stock - (inv.reorder_threshold * 2), 1)
                    surpluses.append((inv, surplus_qty))

            for def_inv, def_qty in deficits:
                for sur_inv, sur_qty in surpluses:
                    if def_inv.hospital_id != sur_inv.hospital_id and sur_qty > 10:
                        # Check if already exists in DB
                        existing = db.query(RedistributionOpportunity).filter(
                            RedistributionOpportunity.source_hospital_id == sur_inv.hospital_id,
                            RedistributionOpportunity.target_hospital_id == def_inv.hospital_id,
                            RedistributionOpportunity.resource == item_name,
                            RedistributionOpportunity.status == "PROPOSED"
                        ).first()

                        if not existing:
                            transfer_qty = min(def_qty, sur_qty)
                            new_opp = RedistributionOpportunity(
                                source_hospital_id=sur_inv.hospital_id,
                                target_hospital_id=def_inv.hospital_id,
                                resource=item_name,
                                available_quantity=sur_qty,
                                required_quantity=transfer_qty,
                                unit=def_inv.unit,
                                status="PROPOSED"
                            )
                            db.add(new_opp)
                            db.commit()
                            db.refresh(new_opp)
                            created_opps.append(new_opp)

        return db.query(RedistributionOpportunity).all()

    @staticmethod
    def calculate_resource_resilience_card(hospital: Hospital) -> dict:
        """
        Calculates Resource Resilience Score (0-100) and multi-factor operational readiness status.
        """
        cap = hospital.capacity
        freshness, _ = RecommendationService.get_data_freshness(hospital.last_updated)

        icu_pct = 50.0
        if cap and cap.icu_total > 0:
            icu_pct = (cap.icu_total - cap.icu_available) / float(cap.icu_total) * 100.0

        cap_health = "Healthy"
        if icu_pct >= 85:
            cap_health = "Critical"
        elif icu_pct >= 70:
            cap_health = "Warning"

        oxy_val = cap.oxygen_level if cap else 80.0
        oxy_health = "Healthy"
        if oxy_val < 50:
            oxy_health = "Critical"
        elif oxy_val < 70:
            oxy_health = "Warning"

        spec_health = "Healthy" if hospital.doctors and len(hospital.doctors) >= 2 else "Warning"
        inv_health = "Healthy" # Default unless low inventory found

        # Resilience score math (100 max)
        score = 100
        if cap_health == "Warning": score -= 15
        elif cap_health == "Critical": score -= 35

        if oxy_health == "Warning": score -= 15
        elif oxy_health == "Critical": score -= 30

        if freshness in ["Stale", "Offline"]: score -= 20
        elif freshness == "Aging": score -= 5

        score = max(10, min(100, score))

        overall = "HEALTHY"
        if score < 60:
            overall = "CRITICAL"
        elif score < 85:
            overall = "ATTENTION REQUIRED"

        return {
            "hospital_id": hospital.id,
            "hospital_name": hospital.name,
            "resilience_score": score,
            "capacity_health": cap_health,
            "inventory_health": inv_health,
            "oxygen_health": oxy_health,
            "specialist_health": spec_health,
            "forecast_pressure": "Warning" if icu_pct > 75 else "Healthy",
            "data_freshness": freshness,
            "overall_state": overall
        }

supply_chain_service = SupplyChainService()
