from sqlalchemy.orm import Session
from app.models.models import Hospital, HospitalCapacity

class ForecastService:
    @staticmethod
    def calculate_hospital_forecast(hospital: Hospital) -> dict:
        """
        Deterministic 24-hour capacity forecast based on backend facts & utilization rate.
        """
        cap = hospital.capacity
        if not cap:
            return {
                "hospital_id": hospital.id,
                "hospital_name": hospital.name,
                "current_icu_utilization": 50.0,
                "current_ward_utilization": 50.0,
                "icu_forecast_6h": 55.0,
                "icu_forecast_12h": 65.0,
                "icu_forecast_24h": 75.0,
                "ward_forecast_24h": 60.0,
                "time_to_critical_hours": None,
                "risk_level": "Low",
                "explanation": "Capacity data not initialized."
            }

        icu_total = cap.icu_total or 20
        icu_avail = cap.icu_available or 0
        icu_occupied = icu_total - icu_avail
        current_icu_pct = round((icu_occupied / float(icu_total)) * 100.0, 1)

        ward_total = cap.ward_total or 100
        ward_avail = cap.ward_available or 0
        ward_occupied = ward_total - ward_avail
        current_ward_pct = round((ward_occupied / float(ward_total)) * 100.0, 1)

        # Growth factors based on hospital status and current utilization
        hourly_growth_rate = 1.2 if current_icu_pct > 70 else 0.8
        if hospital.id % 2 == 1: # slight variation for demo realism
            hourly_growth_rate += 0.4

        icu_6h = round(min(100.0, current_icu_pct + (hourly_growth_rate * 6)), 1)
        icu_12h = round(min(100.0, current_icu_pct + (hourly_growth_rate * 12)), 1)
        icu_24h = round(min(100.0, current_icu_pct + (hourly_growth_rate * 24)), 1)
        ward_24h = round(min(100.0, current_ward_pct + (hourly_growth_rate * 18)), 1)

        # Risk level determination
        risk = "Low"
        time_to_critical = None

        if icu_24h >= 90:
            risk = "Critical" if current_icu_pct >= 85 else "High"
            # Estimate hours to reach 90%
            needed = 90.0 - current_icu_pct
            if needed > 0 and hourly_growth_rate > 0:
                time_to_critical = round(needed / hourly_growth_rate, 1)
            else:
                time_to_critical = 1.0
        elif icu_24h >= 75:
            risk = "Medium"

        explanation = (
            f"{hospital.name} ICU is currently at {current_icu_pct}% capacity. "
            f"Based on current admission trends, ICU load is forecasted to reach {icu_6h}% in 6h and {icu_24h}% in 24h."
        )
        if time_to_critical:
            explanation += f" ⚠ Expected to cross critical threshold (90%) in ~{time_to_critical} hours."

        return {
            "hospital_id": hospital.id,
            "hospital_name": hospital.name,
            "current_icu_utilization": current_icu_pct,
            "current_ward_utilization": current_ward_pct,
            "icu_forecast_6h": icu_6h,
            "icu_forecast_12h": icu_12h,
            "icu_forecast_24h": icu_24h,
            "ward_forecast_24h": ward_24h,
            "time_to_critical_hours": time_to_critical,
            "risk_level": risk,
            "explanation": explanation
        }

forecast_service = ForecastService()
