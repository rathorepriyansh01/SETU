import os
import json
import logging
from app.core.config import settings

logger = logging.getLogger("setu.ai")

class AIService:
    @staticmethod
    def understand_requirement(query: str) -> dict:
        """
        Uses Gemini to parse natural language healthcare queries (English/Hindi)
        into structured intent: department, service, urgency, emergency.
        Fallback to rule-based keyword matching if Gemini API key is unavailable.
        """
        prompt = f"""
You are SETU AI, a medical intent parsing engine.
Convert the user's healthcare search query into JSON matching this exact structure:
{{
  "department": "<Cardiology | Orthopedics | Neurology | Trauma | Pediatrics | General>",
  "service": "<Doctor Consultation | ICU | X-ray | Blood Test | Emergency Care>",
  "urgency": "<Immediate | Today | Scheduled>",
  "emergency": <true | false>
}}

Query: "{query}"

Respond ONLY with valid JSON, no markdown formatting or commentary.
"""
        if settings.GEMINI_API_KEY:
            try:
                from google import genai
                client = genai.Client(api_key=settings.GEMINI_API_KEY)
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt
                )
                text = response.text.strip()
                if text.startswith("```json"):
                    text = text.replace("```json", "").replace("```", "").strip()
                parsed = json.loads(text)
                return parsed
            except Exception as e:
                logger.warning(f"Gemini API call failed, falling back to rule-based parser: {e}")

        # Rule-based fallback parser (Fact-grounded, deterministic)
        q_lower = query.lower()

        dept = "General"
        if any(w in q_lower for w in ["heart", "cardio", "chest", "dil", "cardiologist"]):
            dept = "Cardiology"
        elif any(w in q_lower for w in ["bone", "ortho", "fracture", "haddi", "joint"]):
            dept = "Orthopedics"
        elif any(w in q_lower for w in ["brain", "neuro", "paralysis", "sir"]):
            dept = "Neurology"
        elif any(w in q_lower for w in ["child", "pediatric", "baccha", "kid"]):
            dept = "Pediatrics"
        elif any(w in q_lower for w in ["accident", "trauma", "bleeding", " चोट", "accident"]):
            dept = "Trauma"

        service = "Doctor Consultation"
        if any(w in q_lower for w in ["xray", "x-ray", "scan", "ct"]):
            service = "X-ray"
        elif any(w in q_lower for w in ["blood", "test", "khoon"]):
            service = "Blood Test"
        elif any(w in q_lower for w in ["icu", "ventilator", "critical"]):
            service = "ICU"
        elif any(w in q_lower for w in ["emergency", "urgent", "aapaat"]):
            service = "Emergency Care"

        urgency = "Today"
        if any(w in q_lower for w in ["now", "immediately", "urgent", "turant"]):
            urgency = "Immediate"

        is_emergency = "emergency" in q_lower or "trauma" in q_lower or urgency == "Immediate"

        return {
            "department": dept,
            "service": service,
            "urgency": urgency,
            "emergency": is_emergency
        }

    @staticmethod
    def explain_recommendation(hospital_name: str, score_details: dict) -> str:
        """
        Generate human-friendly explanation for why SETU recommended this hospital over others.
        """
        reasons = score_details.get("reasons", [])
        dist = score_details.get("distance_km", 0)
        icu = score_details.get("icu_available", 0)
        load = score_details.get("predicted_load_percent", 50)
        
        explanation = f"SETU recommended {hospital_name} because it offers the optimal balance of capacity and proximity ({dist} km away). "
        if icu > 0:
            explanation += f"It has {icu} free ICU beds and a manageable predicted 1-hour load of {load}%. "
        if reasons:
            explanation += "Key factors: " + ", ".join(reasons) + "."

        return explanation

    @staticmethod
    def explain_forecast(hospital_name: str, forecast_data: dict) -> str:
        """
        Explain capacity forecast trend in natural language.
        """
        risk = forecast_data.get("risk_level", "Low")
        time_to_crit = forecast_data.get("time_to_critical_hours")
        
        if risk in ["High", "Critical"] and time_to_crit:
            return f"{hospital_name} is projected to reach critical capacity in ~{time_to_crit} hours due to high incoming emergency volume and sustained ICU bed occupancy."
        return f"{hospital_name} maintains steady capacity with moderate projected bed utilization over the next 24 hours."

ai_service = AIService()
