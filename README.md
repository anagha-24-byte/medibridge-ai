# 🩺 MediBridge AI — Healthcare Accessibility Assistant

> **Comprehensive Healthcare Accessibility & Literacy Platform** | Engineered for Health Equity, Patient Empowerment, and Clinical Safety.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Tests Passing](https://img.shields.io/badge/Tests-28%2F28%20Passing%20(100%25)-brightgreen.svg)]()
[![Backend](https://img.shields.io/badge/Backend-Node.js%20Express%20%2B%20Native%20.NET%20PowerShell-blue.svg)]()
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Google%20Gemini%201.5%20Flash-violet.svg)]()
[![Safety Guardrails](https://img.shields.io/badge/Guardrails-Strict%20Non--Diagnostic%20%26%20Non--Prescription-amber.svg)]()
[![Privacy First](https://img.shields.io/badge/Privacy-Zero%20Password%20%2F%20Opt--In%20User%20History-emerald.svg)]()
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AAA%20%26%20RTL%20Support-purple.svg)]()
[![Emergency System](https://img.shields.io/badge/Emergency%20Helplines-11%20States%20%26%20Regions-rose.svg)]()

---

## 🌟 Executive Summary & Problem Landscape

Navigating modern healthcare systems is one of the most formidable barriers facing patients and caregivers globally:

- **9 out of 10 adults** struggle to interpret clinical terminology, diagnostic radiology reports, and lab panels.
- **Over 500 million individuals** across India and worldwide face severe linguistic isolation when medical records and triage instructions are delivered exclusively in clinical English.
- **Consultation Recall Loss**: Patients routinely forget **40% to 80%** of clinical guidance immediately upon exiting a doctor's examination room.
- **Emergency Geolocation Gaps**: During acute crises, families face confusion locating functional emergency casualty facilities, identifying emergency department direct lines, or navigating state-specific helplines (e.g. 108 Arogya Kavacha in Karnataka vs MEMS 108 in Maharashtra).

**MediBridge AI** bridges these gaps by providing an integrated, accessible healthcare companion with verified server-side APIs, real multimodal AI capabilities, and strict clinical safety guardrails.

---

## 🚀 Core Feature Modules

### 1. 📅 Appointments & Reminders (Replaced Medical Simplifier)
- **Interactive Scheduling**: Book and manage consultations with primary care physicians, cardiologists, endocrinologists, and diagnostic radiologists.
- **Past Date Prevention**: Enforces forward-looking dates; prevents booking in the past.
- **Lifecycle Status Tracking**: Accurately tracks statuses: `Confirmed`, `Request Submitted`, `Reminder Saved`, and `Booking Unavailable`.
- **Integrated Follow-Ups**: 1-click booking integration directly from Nearby Hospital search cards.
- **User History Persistence**: Saves appointment records to the authenticated user account with individual record deletion and clear summary views.

### 2. 💬 AI Health Assistant (Google Gemini 1.5 Flash)
- **Conversational AI Proxy**: Server-side proxy (`/api/chat`) connecting securely to Google Gemini 1.5 Flash without exposing API credentials to the browser.
- **Strict Non-Diagnostic Guardrails**: Actively detects and politely refuses self-diagnosis requests (*"Do I have diabetes?"*, *"Diagnose my abdominal pain"*), directing users to licensed medical professionals.
- **Non-Prescription / Dosage Refusals**: Blocks requests for drug dosages or changes (*"How many mg of Amoxicillin should I take?"*), redirecting patients to treating physicians or licensed pharmacists.
- **Red-Flag Emergency Triage**: Detects acute life-threatening symptoms (crushing chest pain, stroke FAST indicators, severe shortness of breath, heavy hemorrhage) and immediately triggers prominent emergency cards with direct 1-tap dialers for 112 (Unified Emergency) and 108 (Ambulance).
- **Hospital Follow-Up Integration**: Suggests nearby hospital searches and appointment scheduling directly within relevant conversation contexts.
- **Honest Missing-Key Feedback**: If `GEMINI_API_KEY` is not configured on the server, the interface presents an honest setup guide (`AI_NOT_CONFIGURED`) rather than fabricating synthetic responses.

### 3. 📑 Medical Document Explainer (Strictly Medical Validation)
- **Strict Medical Filtering**: Actively inspects uploaded or pasted text. Non-medical files (recipes, code, fiction, invoices) are rejected with the explicit validation notice:
  > *"This document does not appear to contain medical information. Please upload a medical report or document."*
- **Clinical Term Translation**: Deconstructs complex diagnoses, procedures, and shorthand (*b.i.d.*, *p.o.*, *eGFR*, *T2DM*, *HTN*) into everyday language.
- **Reference Range Variance Notice**: Prominently warns users that normal biological ranges vary across testing laboratories, equipment, reagents, and patient demographics.
- **Doctor Questions Generation**: Prepares concrete, actionable questions for the patient's next clinic visit.

### 4. 🩻 Dedicated X-Ray Vision Analysis
- **Multimodal Image Ingestion**: Accepts clinical chest, bone, and dental X-rays in JPEG, PNG, and WEBP formats up to 10MB.
- **Interactive Image Preview & Clear**: Visual thumbnail verification with 1-click removal.
- **Multimodal AI Analysis**: Transmits image data to Google Gemini 1.5 Flash Vision proxy (`/api/xray`) for educational anatomical breakdown (airways, lung fields, cardiac silhouette, bony structures).
- **Prominent Radiologist Caution Banner**:
  > *"Caution: AI X-ray analysis is strictly an educational tool to help you understand anatomical structures. It cannot substitute for formal radiologist interpretation or clinical diagnostic imaging."*
- **Opt-In Persistence**: Option to save educational X-ray findings to the user's private history.

### 5. 🩸 Dedicated Blood Test Analysis
- **Structured Biomarker Extraction**: Parses lab markers across complete metabolic, lipid, renal, and hematology panels:
  - Fasting Glucose & HbA1c
  - Total Cholesterol, HDL, LDL, and Triglycerides
  - Serum Creatinine & eGFR
  - White Blood Cell (WBC) count & Platelets
- **Clinical Range Flagging**: Categorizes each biomarker as `NORMAL`, `HIGH`, or `LOW` against clinical reference baselines.
- **Physiological Explanations**: Explains the biological role of each marker in plain language without diagnosing disease.
- **Questions for Physician**: Automatically produces specific questions to ask the primary physician regarding abnormal markers.

### 6. 🏥 Nearby Hospitals & Emergency Contacts
- **Dual Location Search**: Browser Geolocation API (user consent only) or manual search by city (Bengaluru, Mumbai, Delhi, Hyderabad, Chennai, Kolkata, Pune) or Indian PIN code (e.g. `560001`, `400001`).
- **Live OpenStreetMap Overpass API**: Live spatial queries with radius filtering (5 km, 10 km, 25 km).
- **Curated 40+ Apex Hospital Offline Fallback**: Pre-loaded apex government tertiary institutions (AIIMS New Delhi, BMCRI Victoria Hospital Bengaluru, NIMHANS, KEM Hospital Mumbai, Osmania Hyderabad, Rajiv Gandhi GH Chennai, IPGMER Kolkata) ensuring 100% demo uptime under zero connectivity.
- **Haversine Distance Sorting**: Automatically computes exact geodesic distance and sorts facilities nearest-first.
- **Contact Data Integrity**: Verified primary lines linked via `tel:`, strict distinction of emergency casualty lines, and clear indicators when emergency lines are unlisted in open data.
- **1-Click Appointment Planning**: "Book / Inquire" button seamlessly transfers hospital details into the Appointments module.

### 7. 🔐 User Authentication & Privacy-Preserving History
- **Zero-Password Sign-In**: Lightweight entry requiring only **Name** and **Mobile Number**.
- **Input Sanitization & Normalization**: Strips formatting characters, validates 10-15 digit phone standards, and sanitizes name strings (2-50 characters).
- **Secure Token-Based Sessions**: Server generates cryptographically secure session tokens for verified authorization headers (`Authorization: Bearer <token>`).
- **Strict Privacy Safeguards**:
  - Never collects passwords, Aadhaar numbers, dates of birth, or invasive personal identifiers.
  - Mobile numbers are masked in user interfaces (`+91 ••••• ••123`) and never exposed in public URLs or logs.
  - Isolated per-user database partitions: User A can never inspect User B's medical history.
- **Opt-In User History**: Users can choose to persist or delete appointments, conversations, document interpretations, X-ray analyses, and blood test reports.
- **Full Data Deletion**: Users can delete individual records or wipe their entire account data at any time.

### 8. 🌐 Multilingual Hub & Universal Accessibility
- **15 Languages Supported**: English, Hindi, Kannada, Marathi, Telugu, Tamil, Bengali, Spanish, French, German, Arabic (with native RTL layout), Portuguese, Chinese, Tagalog, and Vietnamese.
- **Persistent State Emergency Directory**: Live emergency hotlines across 11 Indian states/regions (Karnataka, Maharashtra, Andhra Pradesh, Telangana, Tamil Nadu, Kerala, Delhi NCT, Gujarat, West Bengal, National India, and International).
- **WCAG 2.2 AAA Accessibility**:
  - High-Contrast Theme (7:1+ contrast ratios, high-visibility cyan text, yellow focus rings).
  - Dynamic Font Scaling (4 sizes: Small, Medium, Large, Extra Large).
  - Multilingual Text-to-Speech (TTS) using browser Web Speech API.

---

## 🏗️ Architecture & Dual Backend Implementation

MediBridge AI is engineered with dual backend options to accommodate both standard production environments (Node.js/Docker/Cloud) and zero-dependency native Windows environments:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MediBridge AI Frontend                          │
│               HTML5 + Tailwind CSS + Vanilla ES6 Modules               │
│      (index.html, js/app.js, js/auth.js, js/appointments.js, ...)      │
└───────────────────▲────────────────────────────────▲───────────────────┘
                    │ REST API                       │ REST API
                    │ (Port 8080)                    │ (Port 8080)
┌───────────────────▼──────────────┐   ┌─────────────▼──────────────────┐
│   Option A: Production Backend   │   │   Option B: Native Windows     │
│       Node.js + Express          │   │   PowerShell .NET Listener     │
│     (server/server.js)           │   │     (start-server.ps1)         │
├──────────────────────────────────┤   ├────────────────────────────────┤
│ • Express REST Routing           │   │ • Native System.Net.HttpListener│
│ • JSON Web Token Sessions        │   │ • Zero dependencies (No Node)  │
│ • Per-User JSON Storage Engine   │   │ • Native .NET JSON Persistence │
│ • Google Gemini 1.5 Flash Proxy  │   │ • Native PowerShell WebClient  │
│ • CORS & Security Rate Limiting  │   │ • Full Gemini 1.5 Flash Proxy  │
└───────────────────┬──────────────┘   └─────────────┬──────────────────┘
                    │                                │
                    ▼                                ▼
        [ server/data/medibridge.json ]    [ data/medibridge.json ]
```

### Backend Endpoints Reference:
| Method | Route | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service health status, server type, AI provider configuration | No |
| `POST` | `/api/auth/login` | Name & Mobile validation; generates session token | No |
| `GET` | `/api/auth/me` | Authenticated profile retrieval | Yes (`Bearer`) |
| `POST` | `/api/auth/logout` | Session invalidation | Yes (`Bearer`) |
| `GET` | `/api/appointments` | Retrieve authenticated user's appointments | Yes (`Bearer`) |
| `POST` | `/api/appointments` | Book new appointment; enforces future date | Yes (`Bearer`) |
| `DELETE` | `/api/appointments/:id`| Cancel / remove specific appointment | Yes (`Bearer`) |
| `GET` | `/api/history` | Retrieve user saved history (chat, docs, x-rays, blood tests)| Yes (`Bearer`) |
| `POST` | `/api/history` | Save record to user history | Yes (`Bearer`) |
| `DELETE` | `/api/history/:id` | Delete specific history record | Yes (`Bearer`) |
| `POST` | `/api/chat` | AI Health Assistant chat completion (Gemini 1.5 Flash) | Optional |
| `POST` | `/api/document/explain`| Medical document plain-language analysis | Optional |
| `POST` | `/api/xray` | Multimodal X-ray vision analysis | Optional |
| `POST` | `/api/bloodtest` | Structured blood biomarker extraction & range flags | Optional |

---

## 🏃 Setup & Launch Instructions

### Method 1: 1-Click Launch on Windows (Recommended)
Double-click **`start-app.bat`** in the repository root.
- Automatically launches the native PowerShell .NET backend on `http://localhost:8080/`.
- Opens your default web browser to MediBridge AI with all API features and persistence active.
- If PowerShell is unavailable, falls back gracefully to opening `index.html` directly in client fallback mode.

---

### Method 2: Native Windows PowerShell Server (Zero Dependencies)
Run directly from PowerShell without installing Node.js or any npm packages:
```powershell
powershell -ExecutionPolicy Bypass -File "d:\Anagha\medibridge-ai\start-server.ps1"
```
The server will start at `http://localhost:8080/` and open your default browser.

---

### Method 3: Standard Node.js Backend (For Cloud / Linux / Production)
If Node.js (v18+) is installed:
```bash
# 1. Navigate to the server folder
cd server

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional)
cp ../.env.example .env

# 4. Start the server
npm start
```
The Express server will start on port `8080` (or `PORT` specified in `.env`).

---

### Method 4: Client-Side Fallback / GitHub Pages
MediBridge AI is designed to run gracefully even when deployed as a static frontend on **GitHub Pages**:
- URL: `https://anagha-24-byte.github.io/medibridge-ai/`
- When no backend server is detected on `localhost:8080`, the application automatically enables **Client Fallback Mode**:
  - Auth sessions and appointments save safely to browser session storage.
  - Clinical analysis, symptom emergency checks, hospital lookups, and language switches function completely client-side.
  - The AI assistant notifies the user that the cloud proxy is running in client mode and provides clear instructions for connecting a live server.

---

## 🔑 Environment Variables Configuration

Copy `.env.example` to `.env` in the root or `server/` directory:

```ini
# Server Port (Default: 8080)
PORT=8080

# Secret Key for HMAC Session Tokens
JWT_SECRET=medibridge-secure-session-key-replace-in-production

# Google Gemini API Key for Live AI Health Assistant & Multimodal Vision
# Obtain a free key from Google AI Studio: https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note on Transparency**: When `GEMINI_API_KEY` is not set, the server honestly returns `aiConfigured: false` and the Health Assistant presents an informative configuration badge. MediBridge AI **never** pretends hardcoded responses are real AI output.

---

## 🧪 Automated Testing & Verification

The project includes two comprehensive test suites verifying end-to-end frontend behavior and backend REST API contracts.

### Running the Tests:

1. **Browser End-to-End Suite (Edge DevTools Protocol)**:
   ```powershell
   powershell -ExecutionPolicy Bypass -File "scratch\run-tests.ps1"
   ```
   **Results: 18 / 18 Tests Passing (100%)**
   - `[PASS]` Clean Architecture & Navigation (Simplifier & Vault removed)
   - `[PASS]` Appointments & Reminders (Booking, past date blocking, cancellation)
   - `[PASS]` Dedicated X-Ray Analysis (Upload validation, clear button, radiologist caution)
   - `[PASS]` Dedicated Blood Test Analysis (Glucose, Lipids, CBC, range evaluation)
   - `[PASS]` Document Explainer Medical Restriction (Rejection of non-medical text)
   - `[PASS]` Nearby Hospitals OSM Integration & Distance Calculation
   - `[PASS]` User Authentication (Name + Mobile validation, session token)
   - `[PASS]` User History Persistence & Record Deletion
   - `[PASS]` Health Assistant Safety Guardrails (Non-diagnostic & non-prescription)
   - `[PASS]` Multilingual Hub & RTL Support
   - `[PASS]` Universal Accessibility (WCAG AAA contrast, font scaling)

2. **Backend REST API Suite**:
   ```powershell
   powershell -ExecutionPolicy Bypass -File "scratch\test-backend.ps1"
   ```
   **Results: 10 / 10 Tests Passing (100%)**
   - `[PASS]` Health check endpoint (`GET /api/health`)
   - `[PASS]` Invalid login rejection (short name / malformed number)
   - `[PASS]` Successful login (`POST /api/auth/login`)
   - `[PASS]` Authenticated profile check (`GET /api/auth/me`)
   - `[PASS]` Past-date appointment rejection
   - `[PASS]` Valid appointment creation (`POST /api/appointments`)
   - `[PASS]` Appointment retrieval (`GET /api/appointments`)
   - `[PASS]` User history save (`POST /api/history`)
   - `[PASS]` User history retrieve & delete (`DELETE /api/history/:id`)
   - `[PASS]` User logout & session invalidation (`POST /api/auth/logout`)

**Combined Test Coverage: 28 / 28 Tests Passed (100% Pass Rate).**

---

## 🛡️ Medical Safety, Ethics & Limitations

MediBridge AI is engineered around strict medical ethics and legal disclaimers:

1. **Educational & Literacy Purpose Only**: MediBridge AI is an informational tool designed to empower patient-doctor dialogue. It is **not** a certified medical device, does not diagnose medical conditions, and does not prescribe treatments.
2. **Clinical Safety Guardrails**: Non-diagnostic refusal algorithms intercept diagnostic queries. Non-prescription algorithms intercept dosage calculations.
3. **Emergency Protocol**: When red-flag symptoms (cardiac arrest, stroke, anaphylaxis, severe bleeding) are detected, the system immediately surfaces 112 / 108 emergency dialers and instructs the patient to seek urgent physical medical care.
4. **Data Privacy**: Mobile numbers and names are never shared with third parties or external marketing trackers. All user history is completely erasable on demand.
5. **Known Limitations**:
   - Live SMS OTP verification requires an external carrier integration (Twilio / Fast2SMS). The login system validates format and creates secure sessions, and transparently notes this requirement.
   - Live multimodal AI requires an active Google Gemini API key. Without a key, the system clearly presents setup guidance rather than deceptive simulated outputs.

---

## 📄 License
This project is open-source under the **MIT License**.
