from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int
    name: str
    hospital_id: Optional[int] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "PATIENT"
    hospital_id: Optional[int] = None

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    hospital_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Hospital & Capacity Schemas
class HospitalCapacityOut(BaseModel):
    id: int
    hospital_id: int
    icu_total: int
    icu_available: int
    ward_total: int
    ward_available: int
    ventilators_total: int
    ventilators_available: int
    oxygen_level: float
    blood_units: Dict[str, int]
    last_updated: datetime

    class Config:
        from_attributes = True

class CapacityUpdateIn(BaseModel):
    icu_total: Optional[int] = None
    icu_available: Optional[int] = None
    ward_total: Optional[int] = None
    ward_available: Optional[int] = None
    ventilators_total: Optional[int] = None
    ventilators_available: Optional[int] = None
    oxygen_level: Optional[float] = None
    blood_units: Optional[Dict[str, int]] = None

class DepartmentOut(BaseModel):
    id: int
    name: str
    available: bool

    class Config:
        from_attributes = True

class DoctorOut(BaseModel):
    id: int
    name: str
    specialization: str
    available: bool
    shift_start: str
    shift_end: str

    class Config:
        from_attributes = True

class HospitalOut(BaseModel):
    id: int
    name: str
    type: str
    city: str
    state: str
    latitude: float
    longitude: float
    emergency_enabled: bool
    status: str
    address: Optional[str] = None
    phone: Optional[str] = None
    last_updated: datetime
    freshness_status: str = "Fresh" # Fresh, Aging, Stale, Offline
    capacity: Optional[HospitalCapacityOut] = None
    departments: List[DepartmentOut] = []
    doctors: List[DoctorOut] = []

    class Config:
        from_attributes = True

# Inventory Schemas
class InventoryOut(BaseModel):
    id: int
    hospital_id: int
    item_name: str
    category: str
    current_stock: float
    daily_consumption: float
    reorder_threshold: float
    unit: str
    days_remaining: float = 0.0
    stockout_risk: str = "Healthy" # Healthy, Low, Critical
    last_updated: datetime

    class Config:
        from_attributes = True

class InventoryUpdateIn(BaseModel):
    current_stock: Optional[float] = None
    daily_consumption: Optional[float] = None
    reorder_threshold: Optional[float] = None

# Emergency & Recommendation Schemas
class EmergencyCreateIn(BaseModel):
    incident_type: str # Accident, Heart, Breathing, Pregnancy, Trauma, Other
    severity: str # Critical, High, Moderate
    latitude: float
    longitude: float
    patient_count: int = 1
    patient_name: Optional[str] = "Anonymous"
    patient_contact: Optional[str] = None
    details: Optional[str] = None

class RecommendationOut(BaseModel):
    id: int
    emergency_id: int
    hospital_id: int
    hospital_name: str
    rank: int
    score: float
    reasons: List[str]
    distance_km: float
    eta_minutes: int
    icu_available: int
    oxygen_level: float
    predicted_load_percent: float
    data_freshness: str
    hospital: Optional[HospitalOut] = None

    class Config:
        from_attributes = True

class NearestVsSetuComparison(BaseModel):
    nearest_hospital: Dict[str, Any]
    setu_recommendation: Dict[str, Any]
    decision_reasoning: str

class AmbulanceOut(BaseModel):
    id: int
    identifier: str
    latitude: float
    longitude: float
    status: str
    equipment: str
    phone: str
    distance_km: float = 0.0
    eta_minutes: int = 0
    last_updated: datetime

    class Config:
        from_attributes = True

class AssignIn(BaseModel):
    emergency_id: int
    hospital_id: int
    ambulance_id: Optional[int] = None
    is_override: bool = False
    override_reason: Optional[str] = None

class PreAlertOut(BaseModel):
    id: int
    emergency_id: int
    hospital_id: int
    status: str
    rejection_reason: Optional[str] = None
    sent_at: datetime
    responded_at: Optional[datetime] = None
    emergency_details: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

# Forecast & Resilience
class CapacityForecastOut(BaseModel):
    hospital_id: int
    hospital_name: str
    current_icu_utilization: float
    current_ward_utilization: float
    icu_forecast_6h: float
    icu_forecast_12h: float
    icu_forecast_24h: float
    ward_forecast_24h: float
    time_to_critical_hours: Optional[float] = None
    risk_level: str # Low, Medium, High, Critical
    explanation: str

class ResilienceCardOut(BaseModel):
    hospital_id: int
    hospital_name: str
    resilience_score: int # 0 to 100
    capacity_health: str # Healthy, Warning, Critical
    inventory_health: str
    oxygen_health: str
    specialist_health: str
    forecast_pressure: str
    data_freshness: str
    overall_state: str # HEALTHY, ATTENTION REQUIRED, CRITICAL

# Search AI Schema
class SearchIn(BaseModel):
    query: str

class IntentResultOut(BaseModel):
    query: str
    understood_intent: Dict[str, Any] # {department, service, urgency, emergency}
    matching_hospitals: List[HospitalOut]
    ai_explanation: str

# Simulation & Redistribution
class SimulationIn(BaseModel):
    patient_count: int = 15
    critical_count: int = 5
    high_count: int = 6
    moderate_count: int = 4

class RedistributionOpportunityOut(BaseModel):
    id: int
    source_hospital_id: int
    source_hospital_name: str
    target_hospital_id: int
    target_hospital_name: str
    resource: str
    available_quantity: float
    required_quantity: float
    unit: str
    status: str
    created_at: datetime

class AuditEventOut(BaseModel):
    id: int
    actor_role: str
    actor_id: Optional[str] = None
    event_type: str
    entity_id: Optional[str] = None
    metadata_json: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True
