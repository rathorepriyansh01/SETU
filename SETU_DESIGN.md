# SETU --- Smart Emergency & Healthcare Resilience Platform

## DESIGN.md

**Design version:** 2.0\
**Product:** SETU\
**Primary city:** bhopal\
**Design purpose:** UI/UX specification + Google Stitch master prompt +
implementation guidance

------------------------------------------------------------------------

# 1. Design Objective

Design SETU as a modern Indian healthcare operations platform that
feels:

-   Trustworthy
-   Clean
-   Fast
-   Professional
-   Accessible
-   Calm under pressure
-   Operational rather than decorative
-   Strong enough for a hackathon demo

SETU should look like a serious healthcare coordination product, not a
generic AI chatbot and not a government portal.

The design must make two ideas immediately obvious:

### Emergency

**Where is help available right now?**

### Resilience

**Where will capacity/resource pressure appear next?**

------------------------------------------------------------------------

# 2. Core Visual Story

The product should communicate:

``` text
PATIENT
Need help
   ↓
SETU understands the requirement
   ↓
Hospital + resource matching
   ↓
Emergency request
   ↓
Dispatcher
   ↓
Explainable Top 3
   ↓
Human decision
   ↓
Hospital pre-alert
   ↓
Ambulance
   ↓
Arrival

HOSPITAL
Capacity + inventory
   ↓
Forecast
   ↓
Risk alert
   ↓
Network imbalance
   ↓
Redistribution suggestion
   ↓
Human approval
```

------------------------------------------------------------------------

# 3. Application Shell

Use one shared application shell.

### Desktop

``` text
┌────────────────────────────────────────────────────────────┐
│ SETU logo   Network Status   Demo Network   EN | हिंदी    │
├───────────────┬────────────────────────────────────────────┤
│ Role Nav      │                                            │
│               │              Main Workspace                │
│ Public        │                                            │
│ Dispatcher    │                                            │
│ Hospital      │                                            │
│ Health Admin  │                                            │
│               │                                            │
│               │                                            │
└───────────────┴────────────────────────────────────────────┘
```

Do not create four unrelated websites.

All role screens must share: - Logo - Typography - Status system -
Header - Cards - Buttons - Alerts - Map style - Language switch

------------------------------------------------------------------------

# 4. Brand Direction

## Name

**SETU**

Subtitle:

**Smart Emergency & Healthcare Resilience**

Suggested tagline:

> **Connecting care. Predicting pressure.**

Alternative:

> **The right care, at the right capacity, at the right time.**

Use the short SETU name prominently.

------------------------------------------------------------------------

# 5. Color System

### Primary

Deep healthcare blue/teal.

Use for: - Header - Navigation - Primary actions - Active states

Suggested token:

``` text
--primary
```

### Success

Soft green.

Use for: - Available - Healthy - Accepted - Fresh - Safe capacity

### Warning

Amber.

Use for: - Limited - Low stock - Aging data - Attention required

### Critical

Red.

Use only for: - Emergency - Critical capacity - Severe alerts - Critical
stock

### Neutral

White, soft gray, blue-gray.

Avoid: - Neon - Cyberpunk colors - Excessive gradients - Dark-first
dashboards - Heavy glassmorphism

------------------------------------------------------------------------

# 6. Typography

Primary:

**Inter**

Hindi:

**Noto Sans Devanagari**

Rules: - Large readable numbers. - Short labels. - High contrast. -
Avoid tiny dashboard text. - Never rely only on color.

------------------------------------------------------------------------

# 7. Status Language

Every status must use both color and text.

``` text
● AVAILABLE
● LIMITED
● CRITICAL
● STALE
● OFFLINE
```

Never show a red/green dot without a label.

------------------------------------------------------------------------

# 8. Global Data Freshness

This is a signature SETU feature.

Every operational metric should have:

> **Updated 2 min ago**

or:

> **Last updated: 03 Oct 2026, 12:41 PM**

Status badge:

``` text
Fresh
Aging
Stale
Offline
```

For simulated values:

> **Simulated data**

or:

> **Demo Network**

The interface must never visually imply real-time data when it is
simulated.

------------------------------------------------------------------------

# 9. Public / Patient Screen

## Layout

Map-first design.

``` text
┌──────────────────────────────────────────────────────────┐
│ SETU                         Demo Network | English हिंदी │
├──────────────────────────────────────────────────────────┤
│                                                          │
│                     MAP                                  │
│                                                          │
│     🟢 Hospital A      🟠 Hospital B       🔴 Hospital C │
│                                                          │
│                                                          │
│ ┌──────────────────────────────────────────────┐         │
│ │ What healthcare help do you need?            │         │
│ │ "I need a cardiologist today"                │         │
│ │                                              │         │
│ │ [ Find Healthcare ]       [ 🚨 EMERGENCY ]   │         │
│ └──────────────────────────────────────────────┘         │
└──────────────────────────────────────────────────────────┘
```

### Hospital marker click

Show: - Hospital name - Status - ICU - Oxygen - Emergency support -
Relevant department - Last updated - Route - Call

------------------------------------------------------------------------

# 10. Public Search Experience

Search field:

> What healthcare help do you need?

Examples:

-   Orthopedic consultation
-   Cardiologist today
-   X-ray
-   Blood test
-   Emergency care

After search:

### "We understood"

``` text
Department
Cardiology

Service
Doctor Consultation

Urgency
Today
```

Keep this simple.

Do not expose raw AI JSON.

------------------------------------------------------------------------

# 11. Hospital Result Card

``` text
┌─────────────────────────────────────────────┐
│ City Hospital                   ● Available │
│                                             │
│ ✓ Cardiology                                │
│ ✓ Doctor available                          │
│ ✓ Consultation available                    │
│                                             │
│ 3.2 km • ETA 9 min                          │
│ ICU: 3 free • Oxygen: Good                   │
│                                             │
│ Updated 2 min ago                            │
│                                             │
│ [ View Hospital ] [ Route ]                 │
└─────────────────────────────────────────────┘
```

Emergency recommendation cards should add:

> **Why SETU recommends this**

with 3--5 concise reasons.

------------------------------------------------------------------------

# 12. Emergency CTA

Use a visually strong red CTA.

Text:

**🚨 EMERGENCY**

Do not make the whole application red.

Emergency modal:

``` text
Emergency Care

Your location
[ Use my location ]

Incident
○ Accident
○ Heart
○ Breathing
○ Pregnancy
○ Other

Severity
○ Critical
○ High
○ Moderate

Patients
[-] 1 [+]

[ Send Emergency Request ]
```

For demo, show:

> This is a simulated emergency workflow.

------------------------------------------------------------------------

# 13. Emergency Tracker

After submission:

``` text
✓ Request sent
    ↓
✓ Ambulance assigned
    ↓
● En route
    ↓
○ Hospital arrival
```

Show: - Ambulance ID - ETA - Destination - Current status

Map displays simulated ambulance movement.

------------------------------------------------------------------------

# 14. Dispatcher / Control Room

This is the strongest operational screen.

### Layout

``` text
┌───────────────┬───────────────────────────┬─────────────────┐
│ Emergency     │                           │ Selected        │
│ Queue         │          LIVE MAP         │ Request         │
│               │                           │                 │
│ #E104 Critical│  hospitals + ambulances   │ Incident        │
│ #E103 High    │                           │ Top 3           │
│ #E102 Medium  │                           │ hospitals       │
│               │                           │ Ambulance       │
└───────────────┴───────────────────────────┴─────────────────┘
```

------------------------------------------------------------------------

# 15. Dispatcher Emergency Card

``` text
Emergency #E104
Road Accident
Critical
2 patients
ETA needed: immediate

Location:
Vijay Nagar, Indore

Required:
ICU + oxygen

[ View Recommendation ]
```

------------------------------------------------------------------------

# 16. Top 3 Recommendation Cards

Each card:

``` text
#1  City Hospital
SETU Score: 86

ETA       8 min
Distance  2.1 km
ICU       3 free
Oxygen    Good
Specialist On duty
Predicted load 70% / 1h

Why SETU recommends:
✓ ICU available
✓ Short ETA
✓ Oxygen available
✓ Predicted capacity remains acceptable

[ Assign ]
```

Do not make the score the main story.

The reasons are more important.

------------------------------------------------------------------------

# 17. Nearest vs SETU Comparison

Add a compact comparison drawer:

``` text
Nearest Hospital
ETA: 5 min
ICU: 1 free
Predicted load: 96%
Risk: High

SETU Recommendation
ETA: 8 min
ICU: 3 free
Predicted load: 70%
Risk: Lower
```

Label:

**Decision support --- dispatcher decides**

This directly demonstrates the product USP.

------------------------------------------------------------------------

# 18. Ambulance Panel

``` text
Available Ambulances

A-12
Advanced
2.4 km
ETA 5 min
● Available

A-08
Basic
3.1 km
ETA 7 min
● Available

A-19
Critical Care
4.0 km
ETA 8 min
● Available

[ Assign A-12 ]
```

------------------------------------------------------------------------

# 19. Hospital Pre-alert UI

When dispatcher assigns:

``` text
INCOMING EMERGENCY

Road accident
Critical
2 patients
ETA: 7 min

Required:
ICU
Oxygen

Ambulance:
A-12

[ ACCEPT ] [ REJECT ]
```

After arrival:

**\[ RECEIVED \]**

------------------------------------------------------------------------

# 20. Hospital Dashboard

Header:

``` text
City Hospital
Hospital Operator

● Network connected
Updated 1 min ago
```

Top cards:

``` text
ICU       3 free
Ward      24 free
Oxygen    74%
Critical  2 alerts
```

Second row:

``` text
Incoming Emergency
Pre-alerts
Inventory Risk
Forecast
```

------------------------------------------------------------------------

# 21. Hospital Capacity Editor

Simple form:

``` text
ICU beds
Total [ 30 ]
Available [ 3 ]

Ward beds
Total [ 120 ]
Available [ 24 ]

Ventilators
Total [ 12 ]
Available [ 5 ]

Oxygen
[ 74% ]

Specialist on duty
[ Cardiology ✓ ]
[ Orthopedics ✓ ]

[ Update Capacity ]
```

Show:

> Last updated just now

------------------------------------------------------------------------

# 22. Forecast Section

Title:

**Next 24 Hours**

Use simple line/area charts.

Example:

``` text
ICU Utilization

100% |                    ●
 80% |              ●
 60% |        ●
 40% |  ●
     +-------------------------
       Now   +6h   +12h  +24h
```

Alert:

> ⚠ ICU may reach critical capacity in approximately 3 hours.

------------------------------------------------------------------------

# 23. Inventory Screen

Table:

  Medicine        Stock   Daily use Status     Risk
  ------------- ------- ----------- ---------- ----------
  Paracetamol      1200         100 Healthy    ---
  Amoxicillin       120          40 Low        \~3 days
  Insulin            18           6 Critical   \~3 days

Each row: - Last updated - Edit - View analysis

------------------------------------------------------------------------

# 24. AI Supply Chain Insights

Section title:

**AI Supply Chain Insights**

### Stockout card

``` text
⚠ Stockout Risk

Insulin may reach minimum safe stock
in approximately 3 days.

Stock       18 units
Daily use    6 units/day

Why?
Consumption is currently high relative
to available stock.

[ View Analysis ]
```

### Important

The calculated number comes from application logic.

AI explains it.

------------------------------------------------------------------------

# 25. Redistribution Opportunity

Visually connect hospitals.

``` text
Hospital A                         Hospital B
18 insulin                         500 insulin
Risk: 3 days                       Excess

       SHORTAGE  ───────────────→  EXCESS

Potential opportunity

[ Review Opportunity ]
```

Do not use:

**Transfer Now**

Use:

**Review Opportunity**

------------------------------------------------------------------------

# 26. Health Officer Command Center

Top metrics:

``` text
Active Emergencies     4
Hospitals Under Pressure 3
Critical Alerts        6
Redistribution Ops     2
Avg Response           9.4 min
```

Main sections: 1. Live network map 2. Hospital pressure 3. Capacity
forecast alerts 4. Supply-chain alerts 5. Redistribution opportunities
6. Simulation controls 7. Evaluation panel

------------------------------------------------------------------------

# 27. Hospital Pressure View

Use compact bars:

``` text
City Hospital      █████████░ 91%  CRITICAL
Metro Hospital     ███████░░░ 71%  LIMITED
Care Hospital      █████░░░░░ 48%  AVAILABLE
```

This is operational pressure, not a hospital quality ranking.

------------------------------------------------------------------------

# 28. Data Freshness Center

New visual component:

``` text
Data Health

City Hospital      ● Fresh      2 min
Metro Hospital     ● Fresh      4 min
Care Hospital      ● Aging      11 min
Aurobindo Hospital ● Stale      18 min
```

Alert:

> Aurobindo Hospital capacity data is stale. Recommendations using this
> hospital have reduced confidence.

------------------------------------------------------------------------

# 29. Resource Resilience Card

New component:

``` text
Operational Resilience

City Hospital

████████░░ 82

Capacity      Good
Inventory     Good
Data freshness Good
Oxygen        Good
Surge risk    Moderate
```

Do not call this a "hospital quality score."

It represents operational readiness for the connected demo network.

------------------------------------------------------------------------

# 30. Mass-Casualty Simulation

Admin button:

**Simulate Major Accident**

Confirmation modal:

``` text
Simulated Scenario

15 emergency patients
5 critical
6 high
4 moderate

Run network simulation?

[ Start Simulation ]
```

After start:

``` text
BEFORE
Hospital A  72%
Hospital B  61%
Hospital C  48%

SURGE

AFTER SETU ALLOCATION
Hospital A  84%
Hospital B  76%
Hospital C  67%

Critical overload avoided: 2
```

Show animated but subtle transitions.

------------------------------------------------------------------------

# 31. Audit Trail

New component:

``` text
Operational Timeline

12:41 Emergency #E104 created
12:42 Top 3 generated
12:42 Dispatcher selected Hospital B
12:43 Pre-alert accepted
12:44 Ambulance A-12 en route
12:51 Patient received
```

Use timeline icons and timestamps.

------------------------------------------------------------------------

# 32. Navigation

### Public

``` text
Home
Find Healthcare
Hospitals
Emergency
```

### Dispatcher

``` text
Control Room
Emergency Queue
Hospitals
Alerts
```

### Hospital

``` text
Dashboard
Capacity
Incoming
Inventory
Forecast
Insights
```

### Health Officer

``` text
Command Center
Network
Alerts
Redistribution
Simulation
Evaluation
```

Keep role navigation contextual.

------------------------------------------------------------------------

# 33. Responsive Design

## Mobile public

``` text
Header
↓
Search
↓
Emergency
↓
Map
↓
Hospital cards
↓
Hospital details
```

Emergency CTA should remain easy to reach.

## Mobile operations

Use stacked cards instead of dense tables.

Dispatcher: - Queue - Request - Recommendation - Ambulance - Assign

Hospital: - Capacity cards - Pre-alert - Inventory cards - Forecast

------------------------------------------------------------------------

# 34. Component System

Reusable components:

-   AppShell
-   Header
-   RoleNavigation
-   StatusBadge
-   FreshnessBadge
-   HospitalMarker
-   HospitalCard
-   HospitalDetail
-   SearchBox
-   IntentCard
-   EmergencyModal
-   EmergencyTracker
-   RecommendationCard
-   ReasonList
-   AmbulanceCard
-   PreAlertCard
-   CapacityCard
-   ForecastChart
-   InventoryTable
-   InventoryCard
-   StockoutCard
-   RedistributionCard
-   ResilienceCard
-   AlertCard
-   AuditTimeline
-   SimulationPanel
-   EvaluationCard
-   LanguageSwitcher

------------------------------------------------------------------------

# 35. Charts

Use charts only when they answer an operational question.

Required: - ICU forecast - Ward forecast - Inventory trend - Network
utilization - Emergency response trend - SETU vs nearest baseline

Avoid decorative charts.

------------------------------------------------------------------------

# 36. Icons

Use Lucide icons consistently.

Examples: - Hospital - MapPin - Ambulance - Siren - Activity - Bed -
Wind - Droplets - Pill - AlertTriangle - Clock - Route - Shield -
ArrowRight - Languages

Avoid emoji as the primary icon system.

------------------------------------------------------------------------

# 37. Animation

Use subtle motion:

-   Hospital marker status change
-   Ambulance movement
-   Card update
-   Forecast transition
-   Alert entrance
-   Button hover

Avoid: - Particle backgrounds - 3D AI brains - Huge transitions - Neon
glow - Excessive pulsing

The emergency screen can use one restrained pulse on the emergency
indicator.

------------------------------------------------------------------------

# 38. Accessibility

Must have: - Text + color status - High contrast - Keyboard support -
Large touch targets - Readable numbers - Hindi support - Simple
language - Screen-reader labels for controls - Clear error messages

------------------------------------------------------------------------

# 39. Error / Empty / Loading States

### Loading

Use skeleton cards.

### Empty

> No active emergencies.

### Error

> We couldn't load the latest hospital data. Try again.

### Stale

> This hospital's data is older than the freshness threshold.

Never expose raw API/database errors.

------------------------------------------------------------------------

# 40. Demo Data Treatment

A persistent header badge:

**DEMO NETWORK**

Tooltip:

> Capacity, inventory and ambulance movement are simulated for
> demonstration. Hospital locations/routes may use external map data.

Do not use fake government logos or affiliations.

------------------------------------------------------------------------

# 41. Screen Inventory

SETU should have these primary screens.

## Public

1.  Landing + Map
2.  Healthcare Search
3.  Hospital Results
4.  Hospital Details
5.  Emergency Request
6.  Emergency Tracker

## Dispatcher

7.  Control Room
8.  Emergency Detail
9.  Recommendation Comparison
10. Assignment / Active Emergency

## Hospital

11. Hospital Dashboard
12. Capacity Update
13. Incoming Pre-alert
14. Inventory
15. Forecast
16. Supply-chain Insights

## Health Officer

17. Command Center
18. Alerts
19. Redistribution Opportunity
20. Mass-casualty Simulation
21. Evaluation / SETU vs Nearest

## Shared

22. Login / Role access
23. Error state
24. Mobile variants

------------------------------------------------------------------------

# 42. Stitch Master Prompt

Use this prompt in Google Stitch:

> Design a modern Indian healthcare operations platform called **SETU
> --- Smart Emergency & Healthcare Resilience**.
>
> SETU connects patients, emergency dispatchers, hospitals and health
> officers through one shared healthcare network. The core experience is
> not a chatbot. It is a live operational platform for hospital
> capacity, emergency allocation, ambulance coordination, healthcare
> resource matching, forecasting and supply-chain resilience.
>
> Create a bright, trustworthy healthcare SaaS design using deep
> blue/teal as the primary color, soft green for available/healthy
> states, amber for limited/warning states and red only for
> emergency/critical states. Use white and light neutral backgrounds.
> Avoid neon colors, dark futuristic dashboards, excessive gradients,
> glassmorphism, 3D graphics and decorative AI visuals.
>
> Use **Inter** for English and **Noto Sans Devanagari** for Hindi.
> Include a visible **English \| हिंदी** language switcher.
>
> Every operational value must show a freshness indicator such as
> **Updated 2 min ago**, with Fresh/Aging/Stale/Offline states. Clearly
> show a **Demo Network / Simulated Data** badge because capacity,
> inventory and ambulance movement are simulated for the hackathon
> unless connected to a real integration.
>
> Create four role-based experiences within one consistent application
> shell:
>
> **1. Public / Patient:** map-first Indore hospital view,
> green/amber/red hospital markers, hospital detail cards, healthcare
> search, natural-language requirement input, AI-understood requirement
> card, hospital matching, emergency button, emergency request form and
> emergency tracker.
>
> **2. Dispatcher / Control Room:** emergency queue, live map, selected
> incident panel, Top 3 SETU hospital recommendations, ETA, ICU, oxygen,
> blood/resource match, specialist availability, predicted near-term
> load, explainable recommendation reasons, ambulance suggestions,
> assign button and dispatcher override.
>
> **3. Hospital:** capacity dashboard,
> ICU/ward/ventilator/oxygen/specialist update form, incoming emergency
> pre-alert, Accept/Reject/Received actions, 24-hour capacity forecast,
> medicine inventory, stockout risk and redistribution opportunity.
>
> **4. Health Officer / Network Admin:** city-wide command center,
> active emergencies, hospital pressure, utilization, critical alerts,
> data freshness, resource resilience indicators, redistribution
> opportunities, audit timeline, mass-casualty simulation and
> SETU-vs-nearest-hospital evaluation.
>
> Make the recommendation UI explain **why** SETU selected a hospital
> rather than only showing a score. Example reasons: "2.1 km, ICU free:
> 3, oxygen available, specialist on duty, predicted load 70% in 1
> hour." Add a compact **Nearest vs SETU** comparison so judges can see
> why nearest-hospital routing may not be sufficient.
>
> Add these new high-impact product components:
>
> -   **Resource Resilience Card** showing operational readiness based
>     on capacity, inventory, oxygen, specialist coverage, forecast
>     pressure and data freshness.
> -   **Data Freshness & Anomaly Center** showing stale hospital data
>     and confidence reduction.
> -   **Mass-Casualty Simulation** that creates a simulated surge and
>     visually shows load balancing.
> -   **Operational Audit Timeline** showing emergency creation,
>     recommendation, dispatcher decision, pre-alert, ambulance movement
>     and hospital receipt.
> -   **Network Supply Intelligence** showing shortage at one hospital
>     and excess inventory at another, with a human approval action
>     called "Review Opportunity."
>
> The UI must preserve human-in-the-loop control. Use language such as
> **Decision support --- dispatcher decides** and **Review
> Opportunity**, never autonomous medical decision language.
>
> Create polished desktop layouts for hackathon presentation and
> responsive mobile layouts for the public patient experience.
>
> Use reusable cards, tables, badges, alerts, maps, timelines and simple
> charts. Avoid unnecessary navigation and decorative content.
>
> Primary demo story:
>
> "Hospital ICU is predicted to become critical → patient submits road
> accident emergency → dispatcher sees Top 3 → nearest hospital is not
> selected because predicted capacity is too high → dispatcher assigns
> another hospital and ambulance → hospital accepts pre-alert →
> ambulance moves on map → health officer sees analytics → medicine
> shortage is predicted → another hospital has excess stock →
> redistribution opportunity is reviewed → mass-casualty simulation
> demonstrates network resilience."
>
> The design must communicate the SETU value proposition within 30
> seconds:
>
> **"SETU connects the right patient to the right available capacity
> today, while helping the healthcare network prepare for shortages
> tomorrow."**
>
> Do not design telemedicine, EHR, insurance, payments, patient
> medical-history systems, autonomous diagnosis, fake government
> branding or unrelated AI chatbot screens.

------------------------------------------------------------------------

# 43. Implementation Rules

## Technical implementation stack

- **Frontend:** React + Vite + JavaScript (ES6+) + Tailwind CSS
- **Backend:** FastAPI + Python
- **Database:** SQLite for the MVP using SQLAlchemy; PostgreSQL can be adopted for production
- **Authentication:** FastAPI JWT-based authentication with role-based access
- **Realtime:** FastAPI WebSockets or Server-Sent Events
- **AI:** Gemini accessed only through FastAPI server-side endpoints
- **Maps:** Leaflet + OpenStreetMap + OSRM for the demo


After Stitch design generation:

-   Implement faithfully in React + Vite.
-   Use React + JavaScript + Tailwind.
-   Use reusable components.
-   Keep design tokens centralized.
-   Keep backend logic outside UI components.
-   Use the FastAPI API and database as the factual source of truth.
-   Use secure FastAPI server-side calls for Gemini.
-   Never expose Gemini keys.
-   Use deterministic calculations for scores and forecasts.
-   Use AI for interpretation/explanation.
-   Never create fake operational values merely to make a dashboard look
    impressive.

------------------------------------------------------------------------

# 44. Final Design Philosophy

SETU should feel like:

> **A calm command bridge for a healthcare network.**

The visual hierarchy is:

**Emergency → Capacity → Recommendation → Human Decision → Coordination
→ Forecast → Resilience**

The product should be:

> **Simple enough for a patient. Fast enough for a dispatcher. Useful
> enough for a hospital operator. Clear enough for a health officer.
> Impressive enough for a hackathon judge.**
