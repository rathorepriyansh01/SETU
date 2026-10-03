# SETU — Smart Emergency & Healthcare Resilience Platform

> **Tagline:** *"Connecting care. Predicting pressure."*  
> **Primary Demo City:** Bhopal, Madhya Pradesh, India  
> **Core USP:** *"Don't just find the nearest hospital. Find the right available capacity before the system reaches the limit."*

---

## 📌 Project Overview & Problem Statement

During a medical emergency, the nearest hospital is not always the right hospital. A nearby facility may suffer from exhausted ICU beds, depleted oxygen reserves, or absent specialists, leading to critical delays and emergency overloads. At the same time, hospitals within the same city network may face medicine shortages while neighboring facilities hold excess inventory.

**SETU** combines two critical healthcare capabilities into one unified platform:
1. **Smart Emergency Healthcare Allocation:** Context-aware hospital matching that evaluates distance, real-time ICU availability, oxygen levels, specialist shifts, and 1-hour predicted load to recommend the optimal facility—preserving human dispatcher decision authority.
2. **Healthcare Resource & Supply-Chain Resilience:** Deterministic forecasting of bed capacity and medicine stockouts (<3 days remaining), paired with automated detection of network redistribution opportunities (transferring surplus stock from Hospital B to deficit Hospital A with Health Officer approval).

> ⚠️ **DATA TRANSPARENCY NOTICE:**  
> This platform runs on **Demo Network / Simulated Data** for the Bhopal healthcare grid (AIIMS Bhopal, Hamidia Hospital, Bansal Hospital, Chirayu Health City, Peoples Hospital). Operational values reflect backend calculations and simulated sensors.

---

## 🏛️ System Architecture

```text
                    SETU WEB PLATFORM
                            |
                 React + Vite Frontend
                            |
                 REST APIs & WebSockets
                            |
                 FastAPI Backend Engine
                            |
    +-----------------------+-----------------------+
    |                       |                       |
SQLAlchemy ORM          Gemini AI API          OSRM Map Services
    |
 SQLite DB
 (PostgreSQL-Ready)
    |
 +--+-----+-------------+-------------+-------------+
 |        |             |             |             |
Hospitals Capacity   Inventory   Emergency     Audit Events
  Grid     Metrics     Stockout    Requests      Trail & Logs
```

---

## 👥 Four Role-Based Experiences

1. **Public / Patient Experience (Mobile-First):**
   - Natural Language Healthcare Search ("Mujhe aaj cardiologist chahiye", "X-ray today").
   - AI Intent Understanding grounded in backend database facts.
   - Interactive Bhopal map showing hospitals colored by live status (Green = Available, Amber = Limited, Red = Critical).
   - Prominent **🚨 EMERGENCY** request CTA with 4-step live ambulance movement tracker.

2. **Dispatcher / Control Room Dashboard:**
   - Active emergency queue & interactive incident inspector.
   - **SETU Top 3 Hospital Recommendations Engine** with transparent score breakdowns.
   - **NEAREST VS SETU COMPARISON:** Side-by-side demonstration showing why distance alone fails when nearest hospital ICU load is critical.
   - Available ambulance fleet matching with ETAs.
   - Dispatcher action buttons ([ Assign Recommended ], [ Select Another ], [ Override ]).

3. **Hospital Admin Portal:**
   - Operational dashboard with **Data Freshness Indicators** (Fresh <15m, Aging 15-30m, Stale 30-60m, Offline >60m).
   - Live Capacity Update panel (ICU, Ward, Ventilators, Oxygen %, Blood units).
   - Incoming Emergency Pre-Alert notification card with [ Accept ], [ Reject ], and [ Patient Received ] actions.
   - 24-Hour Capacity Forecast chart & trend analysis.
   - Medicine & Oxygen Stockout risk prediction.

4. **Health Officer / Network Command Center:**
   - City-wide operational grid visibility (Bhopal network ICU load %, active emergencies, hospitals under pressure).
   - **Resource Resilience Cards** evaluating 6 readiness dimensions.
   - **Network Redistribution Opportunities:** Human approval workflow for transferring surplus inventory from Hospital B to Hospital A.
   - **Mass-Casualty Surge Simulator:** Runs 15-patient disaster scenario comparing Baseline Nearest allocation vs SETU capacity-weighted distribution.
   - **SETU vs Nearest Evaluation** metric dashboard.
   - Full operational **Audit Timeline** log.

---

## 🚀 Setup & Run Instructions

### Prerequisites
- Python 3.10+
- Node.js v18+ & npm

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtualenv (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server (Runs on http://localhost:8000)
uvicorn app.main:app --reload --port 8000
```
*Database will automatically initialize SQLite `setu.db` and seed Bhopal network hospitals on startup.*

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server (Runs on http://localhost:5173)
npm run dev
```

---

## 🔑 Demo Accounts

Use the Role Switcher dropdown in the header to jump between roles instantly, or log in with these credentials:

| Role | Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| **Public / Patient** | `patient@setu.gov.in` | `setu2026` | Public Search & Emergency Tracker |
| **Control Room Dispatcher** | `dispatcher@setu.gov.in` | `setu2026` | Emergency Queue & Top 3 Recommendations |
| **AIIMS Hospital Admin** | `admin.aiims@setu.gov.in` | `setu2026` | AIIMS Bhopal Capacity & Pre-alerts |
| **Hamidia Hospital Admin** | `admin.hamidia@setu.gov.in` | `setu2026` | Hamidia Hospital Capacity & Stockout |
| **Health Officer Admin** | `officer@setu.gov.in` | `setu2026` | Bhopal Network Command Center |

---

## 🎬 3-Minute Hackathon Demo Workflow

1. **Step 1:** Open SETU as **Health Officer**. View Bhopal Command Center—see Hamidia Hospital under capacity & oxygen pressure.
2. **Step 2:** Switch to **Public / Patient**. Submit a Critical Road Accident Emergency Request in Bhopal.
3. **Step 3:** Switch to **Dispatcher**. Open the incoming emergency.
4. **Step 4:** Inspect **NEAREST VS SETU**. Note that Nearest Hospital (Hamidia) is 1.2 km away but has 96% load and 1 free ICU. SETU recommends AIIMS Bhopal (2.1 km away) with 8 free ICUs and 92% oxygen.
5. **Step 5:** Dispatcher clicks **[ Assign Recommended ]** and selects Ambulance AMB-BPL-101.
6. **Step 6:** Switch to **Hospital Admin** (AIIMS Bhopal). Receive incoming Emergency Pre-alert. Click **[ Accept Pre-alert ]**.
7. **Step 7:** Switch to **Patient**. Observe live animated ambulance movement on Leaflet map. Click **[ Patient Received ]** on Hospital Admin.
8. **Step 8:** Switch to **Health Officer**. View **Redistribution Opportunity** (Peoples Hospital surplus Insulin -> Hamidia Hospital deficit). Click **[ Approve Stock Transfer ]**.
9. **Step 9:** Click **[ Start Simulation ]** on Mass-Casualty Surge Simulator. Demonstrate how SETU avoids 100% ICU overload across 15 simulated disaster victims.

---

## 📄 License & Compliance

Built for Hackathon Demonstration. Grounded strictly in backend calculation logic with AI interpretation via Google Gemini.
