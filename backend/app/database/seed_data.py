from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from app.database.database import SessionLocal, engine, Base
from app.models.models import Hospital, HospitalCapacity, Department, Doctor, Inventory, Ambulance, User, Alert, RedistributionOpportunity, AuditEvent, EmergencyRequest, Recommendation, Assignment, PreAlert
from app.auth.security import hash_password

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(Hospital).first():
        print("Database already contains seed data.")
        db.close()
        return

    print("Seeding Bhopal Healthcare Network Data into SETU database...")
    now = datetime.now(timezone.utc)

    # 1. Hospitals in Bhopal
    hospitals_data = [
        {
            "id": 1,
            "name": "AIIMS Bhopal",
            "type": "Government Super-Specialty",
            "city": "Bhopal",
            "state": "Madhya Pradesh",
            "latitude": 23.2065,
            "longitude": 77.4589,
            "emergency_enabled": True,
            "status": "Available",
            "address": "Saket Nagar, Bhopal, MP 462020",
            "phone": "+91-755-2900000",
            "last_updated": now - timedelta(minutes=2)
        },
        {
            "id": 2,
            "name": "Hamidia Hospital (GMC Bhopal)",
            "type": "Government Tertiary",
            "city": "Bhopal",
            "state": "Madhya Pradesh",
            "latitude": 23.2575,
            "longitude": 77.3942,
            "emergency_enabled": True,
            "status": "Busy",
            "address": "Royal Market, Bhopal, MP 462001",
            "phone": "+91-755-2540500",
            "last_updated": now - timedelta(minutes=45) # Stale demo data
        },
        {
            "id": 3,
            "name": "Bansal Hospital",
            "type": "Private Multi-Specialty",
            "city": "Bhopal",
            "state": "Madhya Pradesh",
            "latitude": 23.1956,
            "longitude": 77.4265,
            "emergency_enabled": True,
            "status": "Available",
            "address": "Shahpura, Bhopal, MP 462039",
            "phone": "+91-755-4086000",
            "last_updated": now - timedelta(minutes=5)
        },
        {
            "id": 4,
            "name": "Chirayu Health City",
            "type": "Private Super-Specialty",
            "city": "Bhopal",
            "state": "Madhya Pradesh",
            "latitude": 23.2721,
            "longitude": 77.3489,
            "emergency_enabled": True,
            "status": "Available",
            "address": "Bairagarh, Bhopal-Indore Highway, Bhopal",
            "phone": "+91-755-6679000",
            "last_updated": now - timedelta(minutes=8)
        },
        {
            "id": 5,
            "name": "Peoples Hospital",
            "type": "Trust Teaching Hospital",
            "city": "Bhopal",
            "state": "Madhya Pradesh",
            "latitude": 23.2982,
            "longitude": 77.4190,
            "emergency_enabled": True,
            "status": "Available",
            "address": "Bhanpur, Bhopal, MP 462037",
            "phone": "+91-755-4005000",
            "last_updated": now - timedelta(minutes=12)
        }
    ]

    for h_data in hospitals_data:
        hosp = Hospital(**h_data)
        db.add(hosp)
    db.commit()

    # 2. Hospital Capacities
    capacities_data = [
        # AIIMS Bhopal (High capacity, good stock)
        HospitalCapacity(
            hospital_id=1, icu_total=30, icu_available=8, ward_total=150, ward_available=45,
            ventilators_total=15, ventilators_available=6, oxygen_level=92.0,
            blood_units={"O+": 25, "A+": 18, "B+": 20, "AB+": 8, "O-": 4},
            last_updated=now - timedelta(minutes=2)
        ),
        # Hamidia Hospital (High pressure! Only 1 ICU bed free, lower oxygen)
        HospitalCapacity(
            hospital_id=2, icu_total=25, icu_available=1, ward_total=120, ward_available=8,
            ventilators_total=12, ventilators_available=1, oxygen_level=42.0, # Low oxygen warning!
            blood_units={"O+": 5, "A+": 3, "B+": 4, "AB+": 1, "O-": 0},
            last_updated=now - timedelta(minutes=45)
        ),
        # Bansal Hospital (Healthy capacity)
        HospitalCapacity(
            hospital_id=3, icu_total=20, icu_available=6, ward_total=80, ward_available=28,
            ventilators_total=10, ventilators_available=4, oxygen_level=88.0,
            blood_units={"O+": 18, "A+": 14, "B+": 16, "AB+": 6, "O-": 2},
            last_updated=now - timedelta(minutes=5)
        ),
        # Chirayu Health City (Moderate capacity)
        HospitalCapacity(
            hospital_id=4, icu_total=25, icu_available=7, ward_total=100, ward_available=35,
            ventilators_total=10, ventilators_available=5, oxygen_level=90.0,
            blood_units={"O+": 20, "A+": 15, "B+": 18, "AB+": 5, "O-": 3},
            last_updated=now - timedelta(minutes=8)
        ),
        # Peoples Hospital (Healthy capacity & surplus inventory)
        HospitalCapacity(
            hospital_id=5, icu_total=20, icu_available=9, ward_total=90, ward_available=40,
            ventilators_total=8, ventilators_available=4, oxygen_level=85.0,
            blood_units={"O+": 30, "A+": 22, "B+": 25, "AB+": 10, "O-": 6},
            last_updated=now - timedelta(minutes=12)
        )
    ]
    db.add_all(capacities_data)
    db.commit()

    # 3. Departments & Doctors
    depts = [
        Department(hospital_id=1, name="Cardiology", available=True),
        Department(hospital_id=1, name="Orthopedics", available=True),
        Department(hospital_id=1, name="Trauma", available=True),
        Department(hospital_id=1, name="Neurology", available=True),
        Department(hospital_id=2, name="Trauma", available=True),
        Department(hospital_id=2, name="Cardiology", available=False), # Out of service
        Department(hospital_id=3, name="Cardiology", available=True),
        Department(hospital_id=3, name="Orthopedics", available=True),
        Department(hospital_id=4, name="Trauma", available=True),
        Department(hospital_id=5, name="General", available=True)
    ]
    db.add_all(depts)
    db.commit()

    docs = [
        Doctor(hospital_id=1, department_id=1, name="Dr. Rajesh Sharma", specialization="Senior Cardiologist", available=True),
        Doctor(hospital_id=1, department_id=2, name="Dr. Priya Verma", specialization="Orthopedic Surgeon", available=True),
        Doctor(hospital_id=2, department_id=5, name="Dr. Alok Gupta", specialization="Trauma Specialist", available=True),
        Doctor(hospital_id=3, department_id=7, name="Dr. Sunita Mehta", specialization="Cardiologist", available=True),
        Doctor(hospital_id=4, department_id=9, name="Dr. Vikram Singh", specialization="Critical Care Specialist", available=True)
    ]
    db.add_all(docs)
    db.commit()

    # 4. Inventories (Setting up Hosp A deficit & Hosp B surplus for Redistribution Opportunity)
    inventory_items = [
        # AIIMS Bhopal
        Inventory(hospital_id=1, item_name="Insulin", category="Medicine", current_stock=350, daily_consumption=25, reorder_threshold=50, unit="vials"),
        Inventory(hospital_id=1, item_name="Oxygen Cylinders", category="Gas", current_stock=120, daily_consumption=15, reorder_threshold=30, unit="cylinders"),

        # Hamidia Hospital (Low Insulin & Low Oxygen -> Deficit!)
        Inventory(hospital_id=2, item_name="Insulin", category="Medicine", current_stock=18, daily_consumption=8, reorder_threshold=40, unit="vials"), # ~2 days remaining
        Inventory(hospital_id=2, item_name="Oxygen Cylinders", category="Gas", current_stock=12, daily_consumption=10, reorder_threshold=25, unit="cylinders"),

        # Bansal Hospital
        Inventory(hospital_id=3, item_name="Insulin", category="Medicine", current_stock=200, daily_consumption=15, reorder_threshold=30, unit="vials"),
        Inventory(hospital_id=3, item_name="Paracetamol IV", category="Medicine", current_stock=500, daily_consumption=40, reorder_threshold=100, unit="bottles"),

        # Peoples Hospital (Surplus Insulin = 480 vials -> Surplus!)
        Inventory(hospital_id=5, item_name="Insulin", category="Medicine", current_stock=480, daily_consumption=12, reorder_threshold=50, unit="vials"),
        Inventory(hospital_id=5, item_name="Oxygen Cylinders", category="Gas", current_stock=150, daily_consumption=10, reorder_threshold=30, unit="cylinders")
    ]
    db.add_all(inventory_items)
    db.commit()

    # 5. Ambulances stationed around Bhopal
    ambulances_data = [
        Ambulance(identifier="AMB-BPL-101", latitude=23.2332, longitude=77.4343, status="AVAILABLE", equipment="ALS", phone="+91-9876543210"),
        Ambulance(identifier="AMB-BPL-102", latitude=23.1780, longitude=77.4198, status="AVAILABLE", equipment="BLS", phone="+91-9876543211"),
        Ambulance(identifier="AMB-BPL-103", latitude=23.2612, longitude=77.4010, status="AVAILABLE", equipment="ICU-on-wheels", phone="+91-9876543212"),
        Ambulance(identifier="AMB-BPL-104", latitude=23.2421, longitude=77.4650, status="AVAILABLE", equipment="ALS", phone="+91-9876543213"),
        Ambulance(identifier="AMB-BPL-105", latitude=23.2689, longitude=77.3712, status="AVAILABLE", equipment="BLS", phone="+91-9876543214")
    ]
    db.add_all(ambulances_data)
    db.commit()

    # 6. Default Demo Users
    demo_pass = hash_password("setu2026")
    users = [
        User(name="Rahul Patient", email="patient@setu.gov.in", password_hash=demo_pass, role="PATIENT"),
        User(name="Control Room Dispatcher", email="dispatcher@setu.gov.in", password_hash=demo_pass, role="DISPATCHER"),
        User(name="AIIMS Admin", email="admin.aiims@setu.gov.in", password_hash=demo_pass, role="HOSPITAL_ADMIN", hospital_id=1),
        User(name="Hamidia Admin", email="admin.hamidia@setu.gov.in", password_hash=demo_pass, role="HOSPITAL_ADMIN", hospital_id=2),
        User(name="Dr. S.K. Mishra (Health Officer)", email="officer@setu.gov.in", password_hash=demo_pass, role="HEALTH_OFFICER")
    ]
    db.add_all(users)
    db.commit()

    # 7. Initial Redistribution Opportunity
    opp = RedistributionOpportunity(
        source_hospital_id=5, # Peoples Hospital
        target_hospital_id=2, # Hamidia Hospital
        resource="Insulin",
        available_quantity=200,
        required_quantity=50,
        unit="vials",
        status="PROPOSED"
    )
    db.add(opp)
    db.commit()

    # 8. Initial Alerts
    alerts = [
        Alert(hospital_id=2, type="OXYGEN_LOW", severity="HIGH", message="Hamidia Hospital oxygen reserves dropped to 42%."),
        Alert(hospital_id=2, type="DATA_STALE", severity="MODERATE", message="Hamidia Hospital capacity metrics not updated for 45 minutes."),
        Alert(hospital_id=2, type="STOCKOUT_RISK", severity="HIGH", message="Insulin stockout projected in ~2.2 days at Hamidia Hospital.")
    ]
    db.add_all(alerts)
    db.commit()

    # 9. Initial Audit Event
    audit = AuditEvent(
        actor_role="SYSTEM",
        actor_id="INIT",
        event_type="SYSTEM_INITIALIZED",
        entity_id="BHOPAL_NETWORK",
        metadata_json={"city": "Bhopal", "hospitals_count": 5, "mode": "Demo Network"}
    )
    db.add(audit)
    db.commit()

    db.close()
    print("SETU Bhopal seed data created successfully!")

if __name__ == "__main__":
    seed_database()
