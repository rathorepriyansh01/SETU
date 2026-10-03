from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    type = Column(String, default="Government") # Government, Private, Trust
    city = Column(String, default="Bhopal")
    state = Column(String, default="Madhya Pradesh")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    emergency_enabled = Column(Boolean, default=True)
    status = Column(String, default="Available") # Available, Limited, Critical
    address = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    last_updated = Column(DateTime, default=utcnow, onupdate=utcnow)
    created_at = Column(DateTime, default=utcnow)

    # Relationships
    capacity = relationship("HospitalCapacity", back_populates="hospital", uselist=False, cascade="all, delete-orphan")
    departments = relationship("Department", back_populates="hospital", cascade="all, delete-orphan")
    doctors = relationship("Doctor", back_populates="hospital", cascade="all, delete-orphan")
    inventory = relationship("Inventory", back_populates="hospital", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="hospital", cascade="all, delete-orphan")
    users = relationship("User", back_populates="hospital")

class HospitalCapacity(Base):
    __tablename__ = "hospital_capacity"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False, unique=True)
    icu_total = Column(Integer, default=20)
    icu_available = Column(Integer, default=5)
    ward_total = Column(Integer, default=100)
    ward_available = Column(Integer, default=30)
    ventilators_total = Column(Integer, default=10)
    ventilators_available = Column(Integer, default=3)
    oxygen_level = Column(Float, default=85.0) # Percentage 0-100
    blood_units = Column(JSON, default=dict) # {"O+": 12, "A+": 8, "B+": 10, "AB+": 4, "O-": 2}
    last_updated = Column(DateTime, default=utcnow, onupdate=utcnow)

    hospital = relationship("Hospital", back_populates="capacity")

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False)
    name = Column(String, nullable=False) # Cardiology, Orthopedics, Neurology, Trauma, Pediatrics, General
    available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utcnow)

    hospital = relationship("Hospital", back_populates="departments")
    doctors = relationship("Doctor", back_populates="department")

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    name = Column(String, nullable=False)
    specialization = Column(String, nullable=False)
    available = Column(Boolean, default=True)
    shift_start = Column(String, default="08:00")
    shift_end = Column(String, default="20:00")

    hospital = relationship("Hospital", back_populates="doctors")
    department = relationship("Department", back_populates="doctors")

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False)
    item_name = Column(String, nullable=False) # Insulin, Paracetamol, Oxygen Cylinders, Atropine, IV Saline
    category = Column(String, default="Medicine") # Medicine, Consumable, Gas, Blood
    current_stock = Column(Float, default=100.0)
    daily_consumption = Column(Float, default=10.0)
    reorder_threshold = Column(Float, default=20.0)
    unit = Column(String, default="units") # units, cylinders, vials, liters
    last_updated = Column(DateTime, default=utcnow, onupdate=utcnow)

    hospital = relationship("Hospital", back_populates="inventory")

class EmergencyRequest(Base):
    __tablename__ = "emergency_requests"

    id = Column(Integer, primary_key=True, index=True)
    incident_type = Column(String, nullable=False) # Accident, Heart Attack, Respiratory, Trauma, Maternity, Other
    severity = Column(String, default="Critical") # Critical, High, Moderate
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    patient_count = Column(Integer, default=1)
    status = Column(String, default="PENDING") # PENDING, ASSIGNED, PREALERT_SENT, PREALERT_ACCEPTED, EN_ROUTE, ARRIVED, CANCELLED
    patient_name = Column(String, nullable=True, default="Anonymous Patient")
    patient_contact = Column(String, nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow)

    recommendations = relationship("Recommendation", back_populates="emergency", cascade="all, delete-orphan")
    assignment = relationship("Assignment", back_populates="emergency", uselist=False)
    prealert = relationship("PreAlert", back_populates="emergency", uselist=False)

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    emergency_id = Column(Integer, ForeignKey("emergency_requests.id"), nullable=False)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False)
    rank = Column(Integer, nullable=False) # 1, 2, 3
    score = Column(Float, nullable=False)
    reasons = Column(JSON, default=list) # List of bullet strings
    distance_km = Column(Float, default=0.0)
    eta_minutes = Column(Integer, default=0)
    created_at = Column(DateTime, default=utcnow)

    emergency = relationship("EmergencyRequest", back_populates="recommendations")
    hospital = relationship("Hospital")

class Ambulance(Base):
    __tablename__ = "ambulances"

    id = Column(Integer, primary_key=True, index=True)
    identifier = Column(String, nullable=False, unique=True) # e.g. AMB-BPL-101
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    status = Column(String, default="AVAILABLE") # AVAILABLE, ASSIGNED, EN_ROUTE, MAINTENANCE
    equipment = Column(String, default="ALS") # ALS (Advanced Life Support), BLS, ICU-on-wheels
    phone = Column(String, default="+91-9876543210")
    last_updated = Column(DateTime, default=utcnow, onupdate=utcnow)

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    emergency_id = Column(Integer, ForeignKey("emergency_requests.id"), nullable=False, unique=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False)
    ambulance_id = Column(Integer, ForeignKey("ambulances.id"), nullable=True)
    assigned_by = Column(String, default="DISPATCHER") # Role / User Name
    status = Column(String, default="ASSIGNED")
    created_at = Column(DateTime, default=utcnow)

    emergency = relationship("EmergencyRequest", back_populates="assignment")
    hospital = relationship("Hospital")
    ambulance = relationship("Ambulance")

class PreAlert(Base):
    __tablename__ = "prealerts"

    id = Column(Integer, primary_key=True, index=True)
    emergency_id = Column(Integer, ForeignKey("emergency_requests.id"), nullable=False, unique=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False)
    status = Column(String, default="PENDING") # PENDING, ACCEPTED, REJECTED, RECEIVED
    rejection_reason = Column(String, nullable=True)
    sent_at = Column(DateTime, default=utcnow)
    responded_at = Column(DateTime, nullable=True)

    emergency = relationship("EmergencyRequest", back_populates="prealert")
    hospital = relationship("Hospital")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=True)
    type = Column(String, nullable=False) # CAPACITY_CRITICAL, OXYGEN_LOW, STOCKOUT_RISK, DATA_STALE
    severity = Column(String, default="HIGH") # CRITICAL, HIGH, MODERATE
    message = Column(Text, nullable=False)
    status = Column(String, default="ACTIVE") # ACTIVE, RESOLVED
    created_at = Column(DateTime, default=utcnow)

    hospital = relationship("Hospital", back_populates="alerts")

class RedistributionOpportunity(Base):
    __tablename__ = "redistribution_opportunities"

    id = Column(Integer, primary_key=True, index=True)
    source_hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False)
    target_hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False)
    resource = Column(String, nullable=False) # e.g. Insulin, Oxygen Cylinders, Atropine
    available_quantity = Column(Float, nullable=False)
    required_quantity = Column(Float, nullable=False)
    unit = Column(String, default="units")
    status = Column(String, default="PROPOSED") # PROPOSED, APPROVED, REJECTED, COMPLETED
    created_at = Column(DateTime, default=utcnow)

    source_hospital = relationship("Hospital", foreign_keys=[source_hospital_id])
    target_hospital = relationship("Hospital", foreign_keys=[target_hospital_id])

class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(Integer, primary_key=True, index=True)
    actor_role = Column(String, nullable=False) # PATIENT, DISPATCHER, HOSPITAL_ADMIN, HEALTH_OFFICER, SYSTEM
    actor_id = Column(String, nullable=True)
    event_type = Column(String, nullable=False) # EMERGENCY_CREATED, RECOMMENDATION_GENERATED, DISPATCHER_OVERRIDE, HOSPITAL_ASSIGNED, PREALERT_SENT, PREALERT_ACCEPTED, PREALERT_REJECTED, AMBULANCE_DISPATCHED, REDISTRIBUTION_APPROVED, SIMULATION_RUN
    entity_id = Column(String, nullable=True)
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=utcnow)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="PATIENT") # PATIENT, DISPATCHER, HOSPITAL_ADMIN, HEALTH_OFFICER
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=True)
    created_at = Column(DateTime, default=utcnow)

    hospital = relationship("Hospital", back_populates="users")
