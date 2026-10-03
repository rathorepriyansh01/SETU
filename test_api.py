import urllib.request
import json

def test_endpoints():
    base = "http://localhost:8000/api"
    print("Testing SETU Backend REST Endpoints...")

    # 1. Health check
    req = urllib.request.urlopen(f"{base}/health")
    health = json.loads(req.read().decode())
    print("[OK] Health Check:", health)

    # 2. Hospitals List
    req = urllib.request.urlopen(f"{base}/hospitals")
    hospitals = json.loads(req.read().decode())
    print(f"[OK] Hospitals Count: {len(hospitals)} hospitals returned for Bhopal")
    for h in hospitals:
        print(f"   - {h['name']} ({h['type']}): Freshness = {h['freshness_status']}, Status = {h['status']}")

    # 3. AI Healthcare Search
    data = json.dumps({"query": "Mujhe aaj cardiologist chahiye"}).encode()
    req = urllib.request.Request(f"{base}/healthcare/search", data=data, headers={"Content-Type": "application/json"})
    search_res = json.loads(urllib.request.urlopen(req).read().decode())
    print("[OK] AI Intent Understanding:", search_res["understood_intent"])

    # 4. Emergency Creation & Recommendation Ranking
    em_data = json.dumps({
        "incident_type": "Accident",
        "severity": "Critical",
        "latitude": 23.2599,
        "longitude": 77.4126,
        "patient_count": 2,
        "patient_name": "Test Emergency Victim"
    }).encode()
    req = urllib.request.Request(f"{base}/emergency", data=em_data, headers={"Content-Type": "application/json"})
    em_res = json.loads(urllib.request.urlopen(req).read().decode())
    print(f"[OK] Emergency #{em_res['emergency_id']} Created.")
    print("[OK] Top 3 Recommendations:")
    for rec in em_res["top_3_recommendations"]:
        print(f"   Rank #{rec['rank']}: {rec['hospital_name']} (Score {rec['score']}) - Reasons: {rec['reasons']}")
    
    print("[OK] Nearest vs SETU Comparison:")
    print("   Nearest:", em_res["comparison"]["nearest_hospital"]["name"], f"({em_res['comparison']['nearest_hospital']['icu_available']} ICU free, {em_res['comparison']['nearest_hospital']['predicted_load_percent']}% load)")
    print("   SETU Recommended:", em_res["comparison"]["setu_recommendation"]["name"], f"({em_res['comparison']['setu_recommendation']['icu_available']} ICU free, {em_res['comparison']['setu_recommendation']['predicted_load_percent']}% load)")

    # 5. Mass-Casualty Simulation
    sim_data = json.dumps({"patient_count": 15, "critical_count": 5, "high_count": 6, "moderate_count": 4}).encode()
    req = urllib.request.Request(f"{base}/admin/simulation", data=sim_data, headers={"Content-Type": "application/json"})
    sim_res = json.loads(urllib.request.urlopen(req).read().decode())
    print("[OK] Mass-Casualty Simulation Summary:", sim_res["evaluation_metrics"]["summary"])

    print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_endpoints()
