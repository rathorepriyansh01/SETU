# SETU --- Smart Emergency & Healthcare Resilience Platform

## Product Requirements Document (PRD)

**Version:** 2.0\
**Product Name:** SETU\
**Expansion:** Smart Emergency & Healthcare Resilience Platform\
**Primary Demo City:** bhopal, Madhya Pradesh, India\
**Product Type:** Hackathon-ready web platform\
**Status:** MVP + high-impact extensions

------------------------------------------------------------------------

# 1. Product Definition

### One-line product definition

**SETU is a live healthcare coordination platform that helps people find
the right hospital, helps dispatchers allocate emergency patients to
suitable hospitals and ambulances, and helps hospitals predict
capacity/resource shortages before they become critical.**

SETU combines two previously separate ideas into one system:

1.  **Emergency healthcare allocation**
2.  **Healthcare resource and supply-chain resilience**

The product keeps the original SETU emergency workflow while adding
hospital resource matching, medicine/oxygen inventory intelligence,
shortage forecasting and network redistribution.

------------------------------------------------------------------------

# 2. Core Problem

During an emergency, the nearest hospital is not always the most
suitable hospital.

A hospital may be nearby but: - ICU capacity may be nearly exhausted. -
Oxygen availability may be low. - Required specialist may be
unavailable. - Blood stock may not support the case. - Predicted patient
load may make the hospital unsuitable shortly after arrival. - Another
connected hospital may have spare capacity.

At the same time, hospitals can face supply shortages while another
hospital in the same network has excess inventory.

SETU connects these signals into one operational view.

------------------------------------------------------------------------

# 3. Core USP

## "Don't just find the nearest hospital. Find the right available capacity --- before the system reaches the limit."

### Emergency flow

**Emergency Request → Context Understanding → Resource Matching → Top 3
Options → Human Approval → Hospital Pre-alert → Ambulance Movement →
Arrival**

### Resilience flow

**Hospital Data → Capacity/Inventory Monitoring → Forecast → Risk Alert
→ Network Redistribution Suggestion → Human Approval**

### Patient resource flow

**Healthcare Requirement → AI Intent Understanding → Hospital Resource
Matching → Explainable Results**

------------------------------------------------------------------------

# 4. Goals

## Primary goals

-   Show hospital capacity and resource status in a single city-wide
    view.
-   Recommend suitable hospitals for emergency requests using
    transparent scoring.
-   Show why a hospital was recommended.
-   Suggest an available ambulance.
-   Send a hospital pre-alert before patient arrival.
-   Forecast near-future capacity/resource pressure.
-   Detect stale or abnormal hospital updates.
-   Predict medicine/oxygen stockout risk.
-   Identify cross-hospital redistribution opportunities.
-   Give health officers a network-level operational view.
-   Preserve human-in-the-loop decision making.

## Demo goals

A judge should understand the value within 30 seconds and see the
complete workflow within 3 minutes.

------------------------------------------------------------------------

# 5. Non-Goals

The MVP must NOT:

-   Diagnose diseases.
-   Replace doctors or emergency services.
-   Automatically dispatch an ambulance without human/system
    authorization.
-   Automatically transfer medicines or oxygen.
-   Claim real-time hospital data when the source is simulated.
-   Create fake clinical records.
-   Provide medical treatment instructions.
-   Build a full EHR.
-   Build payments/insurance.
-   Build telemedicine.
-   Build a driver mobile app.
-   Build real government integration.
-   Claim affiliation with any government body.
-   Expose private patient information.

------------------------------------------------------------------------

# 6. Target Users / Roles

SETU has four role-based experiences.

## 6.1 Public / Patient

Can: - View connected hospitals. - Search healthcare resources. - View
hospital availability. - Start an emergency request. - Select incident
type. - Share/select location. - Track the simulated emergency
request. - View ETA and hospital destination.

## 6.2 Dispatcher / Control Room

Can: - View incoming emergency requests. - See incident location and
severity. - View Top 3 hospital recommendations. - See recommendation
reasons. - See ambulance suggestions. - Override the recommendation. -
Assign hospital and ambulance. - Trigger hospital pre-alert. - Monitor
active emergencies. - View capacity and shortage alerts.

## 6.3 Hospital Operator / Admin

Can: - Update capacity. - Update ICU/ward/ventilator/oxygen/blood
status. - Update specialist availability. - Update medicine inventory. -
Accept/reject/receive incoming emergency pre-alerts. - View capacity
forecast. - View stockout risks. - Review redistribution opportunities.

## 6.4 Health Officer / Network Admin

Can: - View city-wide analytics. - Monitor hospital pressure. - View
network resource imbalance. - Review redistribution recommendations. -
Approve/reject redistribution actions. - Run mass-casualty simulation. -
Compare SETU recommendation against nearest-hospital baseline. - Review
alert history and operational audit trail.

------------------------------------------------------------------------

# 7. Feature Set

## Feature 1 --- Live Hospital Map

Full-screen map for the public and dispatcher views.

Hospital markers use:

-   Green --- Available
-   Amber --- Limited
-   Red --- Critical/Full
-   Gray --- Stale/Offline

Every marker must include text status in addition to color.

Hospital popup/card: - Name - Hospital type - Status - ICU
availability - Ward availability - Oxygen status - Emergency support -
Relevant specialist/resource - Last updated - Route - Call/action

### Important data rule

The UI must clearly display:

**Demo Network / Simulated Capacity**

when capacity is simulated.

------------------------------------------------------------------------

# 8. Feature 2 --- Smart Healthcare Search

The patient can type natural language:

-   "Mujhe aaj cardiologist chahiye."
-   "I need an orthopedic doctor."
-   "Need X-ray."
-   "Need emergency care."

AI converts the request into structured intent:

``` text
department: Cardiology
service: Consultation
urgency: Today
emergency: false
```

AI must not diagnose.

Matching uses actual application/database data.

------------------------------------------------------------------------

# 9. Feature 3 --- Emergency Request

Emergency button:

**🚨 EMERGENCY**

Inputs: - Location - Incident type: - Accident - Heart - Breathing -
Pregnancy - Other - Severity: - Critical - High - Moderate - Patient
count - Optional blood group/resource requirement

The system creates an emergency request.

Patient sees:

**Request sent → Ambulance assigned → En route → Hospital arrival**

For demo, ambulance movement and patient status may be simulated.

------------------------------------------------------------------------

# 10. Feature 4 --- Explainable Hospital Recommendation

SETU returns Top 3 candidate hospitals.

Each recommendation contains:

-   Hospital name
-   ETA
-   Road distance
-   ICU availability
-   Ward availability
-   Oxygen status
-   Blood/resource match
-   Specialist availability
-   Predicted near-term load
-   Data freshness
-   Overall score
-   Human-readable reasons

Example:

> **2.1 km • ICU free: 3 • O+ compatible stock • Specialist on duty •
> Predicted load: 70% in 1 hour**

The score is not shown as the only explanation.

------------------------------------------------------------------------

# 11. Hospital Recommendation Logic

Baseline scoring:

``` text
score =
0.30 × distance_score
+ 0.25 × icu_capacity_score
+ 0.15 × oxygen_score
+ 0.10 × blood/resource_match
+ 0.10 × specialist_match
+ 0.10 × predicted_capacity_score
```

Additional safeguards:

-   Full hospitals receive a strong penalty.
-   Stale data receives a confidence penalty.
-   Critical emergency requests prioritize clinically relevant resources
    over distance alone.
-   Missing data is never silently treated as "available."
-   Dispatcher can override the recommendation.

The exact weights are configurable.

------------------------------------------------------------------------

# 12. Feature 5 --- Nearest-Hospital Baseline

SETU must maintain a baseline recommendation:

**Nearest suitable hospital**

and compare it against:

**SETU recommended hospital**

Evaluation fields: - Travel distance - ETA - Capacity at assignment -
Predicted capacity at arrival - Resource match - Number of avoided
full/critical assignments - Simulated response time

This gives a measurable hackathon evaluation.

------------------------------------------------------------------------

# 13. Feature 6 --- Ambulance Matching

Dispatcher sees available ambulances.

Each ambulance can contain: - Ambulance ID - Current location -
Availability - ETA to incident - Type: - Basic - Advanced -
Critical-care capable

Selection considers: - Distance to incident - Availability - Required
capability - ETA

For MVP/demo, movement is simulated.

------------------------------------------------------------------------

# 14. Feature 7 --- Hospital Pre-alert

After dispatcher assignment:

Hospital receives:

-   Emergency type
-   Patient count
-   Severity
-   ETA
-   Required resources
-   Ambulance ID
-   Suggested preparation

Hospital actions:

**Accept \| Reject \| Received**

If rejected: - Reason is captured. - Request returns to dispatcher. -
SETU recalculates alternatives.

------------------------------------------------------------------------

# 15. Feature 8 --- Capacity Forecast

Hospital capacity forecast for:

-   ICU
-   Ward beds
-   Ventilators
-   Oxygen
-   Emergency capacity

MVP forecasting: - Moving average - Linear trend - Demand rate

Example:

> **ICU capacity may reach critical level in \~3 hours.**

The system must show the underlying data used for the estimate.

Advanced forecasting models can be future scope.

------------------------------------------------------------------------

# 16. Feature 9 --- Medicine & Resource Inventory

Hospital operators can update:

-   Medicine name
-   Current stock
-   Daily consumption
-   Minimum safe stock
-   Last updated
-   Oxygen cylinders
-   Blood units
-   Other critical consumables

Status:

-   Healthy
-   Low
-   Critical

Example:

``` text
Insulin
Stock: 18
Daily use: 6
Minimum safe stock: 12
Risk: ~3 days
```

------------------------------------------------------------------------

# 17. Feature 10 --- Stockout Prediction

Basic deterministic calculation:

``` text
days_to_minimum =
(current_stock - minimum_safe_stock)
/
daily_consumption
```

Trend-adjusted prediction can be added later.

Example:

> Insulin may reach the minimum safe level in approximately 3 days at
> the current consumption rate.

AI is used to explain the result, not to invent the number.

------------------------------------------------------------------------

# 18. Feature 11 --- Network Redistribution

SETU compares hospitals.

Example:

``` text
Hospital A
Insulin: 18
Risk: 3 days

Hospital B
Insulin: 500
Consumption: Low
```

SETU generates:

> Potential redistribution opportunity: Hospital B has excess insulin
> while Hospital A has a projected shortage.

Admin action:

**Review Opportunity → Approve / Reject**

The system never automatically transfers stock.

------------------------------------------------------------------------

# 19. Feature 12 --- Resource Resilience Score

NEW FEATURE.

Each hospital gets a simple operational resilience indicator based on:

-   Critical capacity
-   Inventory health
-   Data freshness
-   Specialist availability
-   Oxygen availability
-   Surge exposure
-   Forecasted pressure

Example:

``` text
Hospital Resilience
████████░░ 82/100
```

This is an operational indicator, not a medical quality rating.

It helps the health officer identify hospitals needing attention.

------------------------------------------------------------------------

# 20. Feature 13 --- Data Freshness & Anomaly Center

NEW FEATURE.

Every operational value carries:

**Last updated: 2 min ago**

Freshness states:

-   Fresh
-   Aging
-   Stale
-   Offline

Example:

> ⚠ Aurobindo Hospital oxygen data has not been updated for 18 minutes.

Anomaly examples: - Capacity unchanged for unusually long period. -
Sudden large capacity jump. - Oxygen below threshold. - Inventory update
missing. - Hospital marked available despite stale critical-resource
data.

This prevents the interface from presenting old information as live.

------------------------------------------------------------------------

# 21. Feature 14 --- Mass Casualty Simulator

NEW FEATURE / DEMO POWER FEATURE.

Admin presses:

**Simulate Major Accident**

System generates a simulated surge: - 5--20 emergency patients -
Different severity levels - Ambulance requests - Capacity changes -
Hospital load increase

SETU recalculates: - Hospital allocation - Ambulance assignment -
Capacity alerts - Redistribution opportunities

The screen shows:

**Before → Surge → SETU Allocation → Network Result**

------------------------------------------------------------------------

# 22. Feature 15 --- AI Explanation Layer

Gemini may be used for:

1.  Natural-language requirement understanding.
2.  Recommendation explanation.
3.  Forecast explanation.
4.  Supply-chain insight explanation.
5.  Admin summary.

Gemini must NOT: - Diagnose. - Invent availability. - Invent stock. -
Invent doctors. - Override database facts. - Make autonomous medical
decisions.

### Source of truth

**Database = factual healthcare data**

**Application logic = calculations**

**AI = interpretation/explanation**

------------------------------------------------------------------------

# 23. Feature 16 --- Bilingual Interface

Languages:

**English \| हिंदी**

Both public and operational screens should support language switching.

Use: - Inter - Noto Sans Devanagari

------------------------------------------------------------------------

# 24. Feature 17 --- Operational Audit Trail

NEW FEATURE.

Record major actions:

-   Emergency created
-   Recommendation generated
-   Dispatcher override
-   Hospital assigned
-   Pre-alert sent
-   Hospital accepted/rejected
-   Ambulance status changed
-   Redistribution approved/rejected
-   Simulation started

Example:

``` text
12:41 — Emergency #E104 created
12:42 — SETU generated Top 3
12:42 — Dispatcher selected Hospital B
12:43 — Hospital B accepted
12:44 — Ambulance A12 en route
```

This improves transparency and demo credibility.

------------------------------------------------------------------------

# 25. Feature 18 --- Network Command Center

The Health Officer dashboard combines:

### Live status

-   Active emergencies
-   Hospitals under pressure
-   ICU pressure
-   Oxygen alerts
-   Inventory alerts

### Network analytics

-   Average response time
-   Bed utilization
-   Emergency assignments
-   Hospital pressure
-   Stockout risks
-   Redistribution opportunities

### Actions

-   Review alert
-   Review redistribution
-   Run simulation

------------------------------------------------------------------------

# 26. Core User Flow --- Public

``` text
Open SETU
    ↓
View hospital map
    ↓
Search healthcare need OR press EMERGENCY
    ↓
Select requirement/location
    ↓
SETU finds suitable hospitals
    ↓
View reasons + ETA + resources
    ↓
For emergency: request enters dispatcher
    ↓
Dispatcher assigns
    ↓
Hospital pre-alert
    ↓
Ambulance movement
    ↓
Hospital arrival
```

------------------------------------------------------------------------

# 27. Core User Flow --- Dispatcher

``` text
Emergency queue
      ↓
Select request
      ↓
View incident details
      ↓
SETU Top 3 hospitals
      ↓
View explanation + ETA + capacity
      ↓
View ambulance options
      ↓
Accept recommendation OR override
      ↓
Assign
      ↓
Hospital pre-alert
      ↓
Monitor
```

------------------------------------------------------------------------

# 28. Core User Flow --- Hospital

``` text
Hospital login
      ↓
Dashboard
      ↓
Update capacity/resources
      ↓
View incoming pre-alert
      ↓
Accept / Reject
      ↓
Prepare resources
      ↓
Received
      ↓
View forecast + inventory risks
      ↓
Review redistribution opportunities
```

------------------------------------------------------------------------

# 29. Core User Flow --- Health Officer

``` text
Command Center
      ↓
City-wide pressure
      ↓
Forecast alerts
      ↓
Inventory risks
      ↓
Redistribution suggestions
      ↓
Approve / Reject
      ↓
Run mass-casualty simulation
      ↓
Compare before/after
```

------------------------------------------------------------------------

# 30. Data Model

Recommended FastAPI + SQLAlchemy database tables (SQLite for MVP, PostgreSQL-ready):

## hospitals

``` text
id
name
type
city
state
latitude
longitude
emergency_enabled
status
last_updated
created_at
```

## hospital_capacity

``` text
id
hospital_id
icu_total
icu_available
ward_total
ward_available
ventilator_total
ventilator_available
oxygen_percent
blood_units
last_updated
```

## departments

``` text
id
hospital_id
name
available
last_updated
```

## doctors

``` text
id
hospital_id
department_id
name
specialization
available
last_updated
```

## medicines

``` text
id
name
unit
```

## hospital_inventory

``` text
id
hospital_id
medicine_id
current_stock
daily_consumption
minimum_stock
last_updated
```

## ambulances

``` text
id
vehicle_code
type
latitude
longitude
status
eta
last_updated
```

## emergency_requests

``` text
id
incident_type
severity
patient_count
latitude
longitude
required_resources
status
created_at
```

## recommendations

``` text
id
request_id
hospital_id
score
distance
eta
reason_json
created_at
```

## assignments

``` text
id
request_id
hospital_id
ambulance_id
dispatcher_id
override
status
created_at
```

## alerts

``` text
id
hospital_id
alert_type
severity
message
source
status
created_at
```

## redistribution_opportunities

``` text
id
source_hospital_id
target_hospital_id
resource_type
quantity_suggested
reason
status
created_at
```

## audit_events

``` text
id
actor_role
actor_id
event_type
entity_id
metadata
created_at
```

------------------------------------------------------------------------

# 31. Technology Stack

## Frontend

-   React
-   JavaScript (ES6+)
-   Vite
-   Tailwind CSS
-   shadcn/ui
-   Lucide icons
-   Recharts

## Backend / Data

Preferred production-like architecture:

-   FastAPI
-   Python
-   SQLAlchemy
-   SQLite for MVP (PostgreSQL-ready)
-   JWT-based authentication
-   WebSockets / Server-Sent Events for live updates

FastAPI is the primary backend for the entire application. It handles REST APIs, authentication, business logic, scoring, forecasting, simulation, database access and secure Gemini calls.

## AI

-   Gemini through secure FastAPI server-side endpoints

## Maps

Preferred: - Leaflet - OpenStreetMap - OSRM for demo routing

Alternative: - Google Maps / Routes API

## Deployment

-   Vercel for the React frontend
-   Render or Railway for the FastAPI backend
-   SQLite for MVP; PostgreSQL can be used for production

------------------------------------------------------------------------

# 32. Architecture

``` text
                       SETU WEB APP
                            |
        +-------------------+-------------------+
        |                   |                   |
     Patient            Dispatcher          Hospital
        |                   |                   |
        +-------------------+-------------------+
                            |
                       React + Vite UI
                            |
                         FastAPI
                            |
          +-----------------+-----------------+
          |                 |                 |
      Database          Gemini API        Map/Route
   SQLite/Postgres      Server-side        Services
          |
   Hospitals / Capacity
   Inventory / Doctors
   Requests / Alerts
   Ambulances / Audit
```

------------------------------------------------------------------------

# 33. Real vs Simulated Data

  Component                 MVP Status
  ------------------------- -------------------------------------
  Hospital names/location   Real OSM data where available
  Map tiles                 Real
  Road route/ETA            Real API where available
  Bed/ICU capacity          Simulated/demo
  Oxygen                    Simulated/demo
  Blood stock               Simulated/demo
  Medicine inventory        Simulated/demo
  Forecast logic            Real application logic on demo data
  Recommendation scoring    Real deterministic logic
  Ambulance GPS             Simulated
  Hospital pre-alert        Demo application event
  Mass-casualty scenario    Simulated

Always display:

**Demo Network / Simulated Hospital Data**

unless a real integration exists.

------------------------------------------------------------------------

# 34. Security & Privacy

-   Use FastAPI JWT authentication.
-   Use role-based authorization.
-   Hospital admins can update only their own hospital data.
-   Never expose AI API keys in the browser.
-   Do not store unnecessary patient medical history.
-   Avoid personally identifiable data in the demo.
-   Use synthetic emergency patient records.
-   Keep audit logs for operational actions.

------------------------------------------------------------------------

# 35. Success Criteria

## Public

-   [ ] Map loads.
-   [ ] Hospital status visible.
-   [ ] Last updated visible.
-   [ ] Healthcare search works.
-   [ ] Emergency request works.
-   [ ] Tracker updates.

## Dispatcher

-   [ ] Queue visible.
-   [ ] Top 3 recommendations generated.
-   [ ] Reasons visible.
-   [ ] Ambulance suggestion visible.
-   [ ] Override works.
-   [ ] Assignment works.
-   [ ] Pre-alert triggered.

## Hospital

-   [ ] Capacity update works.
-   [ ] Pre-alert visible.
-   [ ] Accept/reject/received works.
-   [ ] Forecast visible.
-   [ ] Inventory visible.
-   [ ] Stockout risk visible.

## Admin

-   [ ] City analytics visible.
-   [ ] Alerts visible.
-   [ ] Redistribution suggestion visible.
-   [ ] Approval workflow works.
-   [ ] Accident simulation works.
-   [ ] Before/after comparison visible.

------------------------------------------------------------------------

# 36. Hackathon Demo Script

### Scene 1 --- Live network

Open SETU.

Show: - Indore map - Green/amber/red hospitals - Last updated - Demo
Network badge

### Scene 2 --- Predictive alert

Open Hospital/Command Center.

Show:

> ICU capacity may reach critical level in \~3 hours.

Then show the forecast chart.

### Scene 3 --- Emergency

Public screen:

**Emergency → Road Accident → Critical → Location**

Submit.

### Scene 4 --- Dispatcher

Open request.

Show: - Top 3 - ETA - ICU - Oxygen - Specialist - Predicted load

Say:

> "Nearest is not automatically selected. SETU checks current and
> near-future capacity."

### Scene 5 --- Human decision

Dispatcher selects/overrides recommendation.

Assign ambulance.

### Scene 6 --- Hospital

Hospital receives:

> Incoming critical patient --- ETA 7 min

Accept.

### Scene 7 --- Movement

Show simulated ambulance movement.

### Scene 8 --- Supply resilience

Show:

> Insulin shortage risk: \~3 days

Then:

> Hospital B has excess inventory.

Review opportunity.

### Scene 9 --- Mass casualty

Admin:

**Simulate Major Accident**

Show: - Load spike - Reallocation - New alerts - Hospital balancing

### Scene 10 --- Evaluation

Show:

**SETU vs Nearest Hospital**

Compare: - ETA - Capacity at arrival - Resource match - Full-hospital
assignments avoided

------------------------------------------------------------------------

# 37. Evaluation Metrics

## Emergency allocation

-   Average ETA
-   Average travel distance
-   Resource match rate
-   Percentage of assignments to critical/full hospitals
-   Dispatcher override rate
-   Hospital acceptance rate

## Resilience

-   Stockout alerts detected
-   Forecast lead time
-   Redistribution opportunities identified
-   Critical resource imbalance
-   Capacity utilization

## Baseline comparison

Compare SETU against nearest-hospital routing using the same simulated
scenarios.

------------------------------------------------------------------------

# 38. Product Principles

1.  **Data before AI**
2.  **Explain before recommend**
3.  **Human before automation**
4.  **Freshness before confidence**
5.  **Forecast before shortage**
6.  **Network before isolated hospital**
7.  **Demo transparency before fake realism**

------------------------------------------------------------------------

# 39. Future Scope

Not required for MVP:

-   Real hospital HIS integration
-   HL7/FHIR integration
-   Real ambulance GPS
-   IoT oxygen sensors
-   Blood-bank network
-   Supplier reliability prediction
-   Cold-chain monitoring
-   District/state-level network
-   Advanced time-series models
-   Real government/public-health APIs
-   Driver application
-   Real WhatsApp/SMS integrations

------------------------------------------------------------------------

# 40. Final Product Statement

> **SETU is an AI-assisted healthcare coordination and resilience
> platform that connects patients, emergency dispatchers, hospitals and
> health officers on one operational network --- helping allocate
> emergencies intelligently today while predicting resource shortages
> for tomorrow.**
