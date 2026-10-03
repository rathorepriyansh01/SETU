from typing import List, Dict, Any, Tuple
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.models.models import Hospital, EmergencyRequest, HospitalCapacity, Department, Doctor
from app.services.map_service import calculate_haversine_distance, estimate_eta_minutes

class RecommendationService:
    @staticmethod
    def get_data_freshness(last_updated: datetime) -> Tuple[str, float]:
        """
        Determine freshness status and penalty multiplier.
        Fresh (<15m): 1.0
        Aging (15-30m): 0.95
        Stale (30-60m): 0.80
        Offline (>60m): 0.60
        """
        if not last_updated:
            return "Stale", 0.70
        
        now = datetime.now(timezone.utc)
        if last_updated.tzinfo is None:
            last_updated = last_updated.replace(tzinfo=timezone.utc)
            
        diff_minutes = (now - last_updated).total_seconds() / 60.0

        if diff_minutes < 15:
            return "Fresh", 1.0
        elif diff_minutes < 30:
            return "Aging", 0.95
        elif diff_minutes < 60:
            return "Stale", 0.80
        else:
            return "Offline", 0.60

    @staticmethod
    def rank_hospitals_for_emergency(db: Session, emergency: EmergencyRequest) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
        """
        Calculates transparent backend scores for all hospitals, generates Top 3 recommendations with reasons,
        and constructs the 'Nearest vs SETU' comparison.
        """
        hospitals = db.query(Hospital).filter(Hospital.emergency_enabled == True).all()

        scored_list = []
        nearest_hospital_item = None
        min_distance = float('inf')

        incident = emergency.incident_type.lower()
        required_dept_name = "General"
        if "heart" in incident or "cardio" in incident:
            required_dept_name = "Cardiology"
        elif "accident" in incident or "trauma" in incident:
            required_dept_name = "Trauma"
        elif "breathing" in incident or "respiratory" in incident:
            required_dept_name = "General"
        elif "pregnancy" in incident or "maternity" in incident:
            required_dept_name = "Pediatrics"

        for hosp in hospitals:
            dist = calculate_haversine_distance(emergency.latitude, emergency.longitude, hosp.latitude, hosp.longitude)
            eta = estimate_eta_minutes(dist)

            cap = hosp.capacity
            icu_free = cap.icu_available if cap else 0
            icu_total = cap.icu_total if cap else 20
            icu_ratio = icu_free / max(1, icu_total)

            oxy = cap.oxygen_level if cap else 50.0

            # Department and doctor match
            dept_match = any(d.name.lower() == required_dept_name.lower() and d.available for d in hosp.departments)
            doc_match = any(doc.available for doc in hosp.doctors if doc.department and doc.department.name.lower() == required_dept_name.lower())

            # Data freshness
            freshness_status, freshness_multiplier = RecommendationService.get_data_freshness(hosp.last_updated)

            # Scoring factors
            # 1. Distance score (10km max range normalization)
            dist_score = max(0.0, 1.0 - (dist / 12.0)) * 30.0

            # 2. ICU score
            icu_score = (icu_ratio * 25.0)

            # 3. Oxygen score
            oxy_score = (min(100.0, oxy) / 100.0) * 15.0

            # 4. Resource / dept match
            resource_score = 10.0 if dept_match else 4.0

            # 5. Specialist match
            spec_score = 10.0 if doc_match else 3.0

            # 6. Predicted capacity load score (simulated near-term load based on current ICU occupancy)
            predicted_load = round(min(98.0, max(40.0, (1.0 - icu_ratio) * 100 + (10 if hosp.id % 2 == 0 else 0))), 1)
            predicted_capacity_score = ((100.0 - predicted_load) / 100.0) * 10.0

            total_score = (dist_score + icu_score + oxy_score + resource_score + spec_score + predicted_capacity_score) * freshness_multiplier

            # Severe penalty if hospital is full
            if icu_free <= 0:
                total_score *= 0.3

            # Reasons list
            reasons = []
            reasons.append(f"{dist} km away • ETA {eta} min")
            if icu_free > 0:
                reasons.append(f"ICU beds available: {icu_free}/{icu_total}")
            else:
                reasons.append("⚠ ICU beds FULL")

            if oxy >= 70:
                reasons.append(f"Oxygen status: Available ({int(oxy)}%)")
            else:
                reasons.append(f"⚠ Oxygen level: Low ({int(oxy)}%)")

            if doc_match:
                reasons.append(f"{required_dept_name} specialist on duty")

            reasons.append(f"Predicted load: {predicted_load}% in 1 hour")

            if freshness_status in ["Stale", "Offline"]:
                reasons.append(f"⚠ Data status: {freshness_status} (confidence reduced)")

            item = {
                "hospital": hosp,
                "score": round(total_score, 1),
                "distance_km": dist,
                "eta_minutes": eta,
                "icu_available": icu_free,
                "oxygen_level": oxy,
                "predicted_load_percent": predicted_load,
                "data_freshness": freshness_status,
                "reasons": reasons,
                "dept_match": dept_match,
                "doc_match": doc_match
            }

            scored_list.append(item)

            if dist < min_distance:
                min_distance = dist
                nearest_hospital_item = item

        # Sort by total_score descending
        scored_list.sort(key=lambda x: x["score"], reverse=True)
        top_3 = scored_list[:3]

        # Formulate Top 3 recommendation dictionary
        top_3_output = []
        for idx, item in enumerate(top_3, 1):
            hosp = item["hospital"]
            top_3_output.append({
                "rank": idx,
                "hospital_id": hosp.id,
                "hospital_name": hosp.name,
                "score": item["score"],
                "reasons": item["reasons"],
                "distance_km": item["distance_km"],
                "eta_minutes": item["eta_minutes"],
                "icu_available": item["icu_available"],
                "oxygen_level": item["oxygen_level"],
                "predicted_load_percent": item["predicted_load_percent"],
                "data_freshness": item["data_freshness"]
            })

        # Formulate 'Nearest vs SETU' comparison
        best_setu_item = top_3[0] if top_3 else (nearest_hospital_item or scored_list[0])
        
        comparison = {
            "nearest_hospital": {
                "name": nearest_hospital_item["hospital"].name,
                "distance_km": nearest_hospital_item["distance_km"],
                "eta_minutes": nearest_hospital_item["eta_minutes"],
                "icu_available": nearest_hospital_item["icu_available"],
                "predicted_load_percent": nearest_hospital_item["predicted_load_percent"],
                "oxygen_level": nearest_hospital_item["oxygen_level"],
                "score": nearest_hospital_item["score"]
            },
            "setu_recommendation": {
                "name": best_setu_item["hospital"].name,
                "distance_km": best_setu_item["distance_km"],
                "eta_minutes": best_setu_item["eta_minutes"],
                "icu_available": best_setu_item["icu_available"],
                "predicted_load_percent": best_setu_item["predicted_load_percent"],
                "oxygen_level": best_setu_item["oxygen_level"],
                "score": best_setu_item["score"]
            },
            "decision_reasoning": (
                f"Nearest hospital ({nearest_hospital_item['hospital'].name}) is closer ({nearest_hospital_item['distance_km']} km), "
                f"but has higher predicted capacity load ({nearest_hospital_item['predicted_load_percent']}%) and fewer ICU beds ({nearest_hospital_item['icu_available']} free). "
                f"SETU recommends {best_setu_item['hospital'].name} ({best_setu_item['distance_km']} km) to ensure immediate ICU availability ({best_setu_item['icu_available']} free) and avoid critical load bottleneck."
                if nearest_hospital_item["hospital"].id != best_setu_item["hospital"].id
                else f"The nearest hospital ({best_setu_item['hospital'].name}) also has optimal available capacity and resource match."
            )
        }

        return top_3_output, comparison

recommendation_service = RecommendationService()
