import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database.database import Base
from app.models.models import Hospital, HospitalCapacity, Department, Doctor, EmergencyRequest
from app.services.recommendation_service import recommendation_service
from app.services.forecast_service import forecast_service
from app.services.simulation_service import simulation_service

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()

def test_recommendation_scoring_prefers_capacity(db_session):
    # Setup Hospital A (Nearest: 1.0 km, but ICU is FULL 0 free, high overload)
    hosp_a = Hospital(id=1, name="Nearest Hospital A", latitude=23.25, longitude=77.40, emergency_enabled=True)
    cap_a = HospitalCapacity(hospital_id=1, icu_total=10, icu_available=0, oxygen_level=30.0)
    
    # Setup Hospital B (SETU Rec: 2.5 km, 5 ICU free, high oxygen)
    hosp_b = Hospital(id=2, name="SETU Rec Hospital B", latitude=23.27, longitude=77.42, emergency_enabled=True)
    cap_b = HospitalCapacity(hospital_id=2, icu_total=10, icu_available=5, oxygen_level=90.0)

    db_session.add_all([hosp_a, hosp_b, cap_a, cap_b])
    db_session.commit()

    em = EmergencyRequest(id=1, incident_type="Heart Attack", severity="Critical", latitude=23.24, longitude=77.40)
    top_3, comparison = recommendation_service.rank_hospitals_for_emergency(db_session, em)

    # Top recommended hospital should be Hospital B (due to capacity penalty on Hospital A)
    assert top_3[0]["hospital_id"] == 2
    assert comparison["nearest_hospital"]["name"] == "Nearest Hospital A"
    assert comparison["setu_recommendation"]["name"] == "SETU Rec Hospital B"

def test_simulation_engine_reduces_overload(db_session):
    hosp_a = Hospital(id=1, name="Hospital A", latitude=23.25, longitude=77.40, emergency_enabled=True)
    cap_a = HospitalCapacity(hospital_id=1, icu_total=10, icu_available=2)
    hosp_b = Hospital(id=2, name="Hospital B", latitude=23.27, longitude=77.42, emergency_enabled=True)
    cap_b = HospitalCapacity(hospital_id=2, icu_total=20, icu_available=15)

    db_session.add_all([hosp_a, hosp_b, cap_a, cap_b])
    db_session.commit()

    res = simulation_service.run_mass_casualty_simulation(db_session, patient_count=10, critical_count=4)
    assert "baseline_nearest" in res
    assert "setu_allocation" in res
    assert res["evaluation_metrics"]["overload_avoided"] >= 0
