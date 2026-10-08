# 🩺 MediBridge AI - Healthcare Accessibility Assistant

> **Hackathon Prototype** | Built for Healthcare Equity, Health Literacy, and Patient Empowerment.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Client--Side-emerald.svg)]()
[![Safety Guardrails](https://img.shields.io/badge/Guardrails-Non--Diagnostic%20Strict-amber.svg)]()
[![Languages](https://img.shields.io/badge/Languages-12%20Global%20%26%20Regional-indigo.svg)]()

---

## 🌟 Overview & Problem Statement

**Health literacy is a fundamental barrier to equitable medical care.**
- **9 out of 10 adults** struggle to navigate complex clinical terminology, lab reports, and discharge summaries.
- Over **25 million individuals in the US** and hundreds of millions worldwide have Limited English Proficiency (LEP).
- Patients frequently leave doctor appointments feeling confused, anxious, or unable to comply with instructions due to medical jargon.

**MediBridge AI** bridges this divide by translating confusing clinical jargon, lab test panels, and discharge papers into compassionate, 5th-grade plain language with real-world analogies — in **12+ languages** — while enforcing strict medical safety guardrails.

---

## 🛡️ Medical Safety & Ethical Guardrails

MediBridge AI is designed from the ground up to **empower doctor-patient discussions, never replace them**:

1. **Strictly Non-Diagnostic**:
   - The system actively detects diagnostic queries (e.g., *"Do I have cancer?"*, *"Diagnose this rash"*).
   - It issues a compassionate refusal and explains why only a licensed doctor with physical examination and complete history can diagnose illnesses.
2. **Zero Prescription / Dosage Advice**:
   - The assistant blocks requests for drug prescriptions or dosage adjustments (e.g., *"How many mg should I take?"*).
   - It redirects the user to their prescribing physician or neighborhood pharmacist.
3. **Red-Flag Emergency Escalation**:
   - Built-in detection for emergency symptoms (crushing chest pain, signs of stroke [FAST], acute shortness of breath, severe hemorrhage).
   - Immediately alerts the user with high-visibility guidance to dial **911 / 112 / 108** or go to an Emergency Department immediately.
4. **100% Client-Side Privacy Guarantee**:
   - All document analysis, OCR parsing, and jargon simplification run directly inside the patient's web browser.
   - Zero sensitive Protected Health Information (PHI) is transmitted or stored on remote servers.

---

## 🚀 Key Features & Sections

### 1. 🏠 Home
- Welcoming hero section with clear value proposition and impact metrics.
- One-click navigation to all core accessibility tools.
- Emergency Red-Flag Protocol Box highlighting life-threatening symptoms and direct emergency call buttons.
- Medical Safety & Ethics commitments.

### 2. 📖 Medical Information Simplifier
- **Jargon Buster**: Turn intimidating terms like *Hypertension*, *Atherosclerosis*, *Dyspnea on Exertion*, and *Benign Prostatic Hyperplasia* into plain English.
- **Everyday Real-World Analogies**: Explains complex bodily processes with relatable metaphors (e.g., garden hose pressure, clogged plumbing, air filters).
- **Reading Level Controls**: Switch between:
  - *5th Grade / Simple Plain Words (Like I'm 10)*
  - *Standard Patient Guide*
  - *Detailed Educational Reference*
- **Speech Synthesis (Listen Aloud)**: Web Speech API reads the explanation to the user.
- **Doctor Discussion Prompts**: Curates questions the patient can ask their physician.

### 3. 📑 Document & Report Explainer
- **Realistic Clinical Presets**:
  - *Comprehensive Metabolic & Lipid Blood Panel* (Glucose, HbA1c, Cholesterol, eGFR, ALT)
  - *Chest X-Ray Diagnostic Radiology Report* (Airway aeration, hyperinflation, cardiothoracic ratio)
  - *Hospital Inpatient Discharge Summary* (Hypertension urgency, diabetes, DASH diet instructions)
  - *Outpatient Prescription & Pharmacy Directions* (Augmentin antibiotic regimen & warning signs)
- **Document Uploader**: Drag-and-drop or select files (`.txt`, simulated OCR for images/PDFs).
- **Executive Plain-Language Summary**: High-level overview of the document's purpose.
- **Key Findings Table**: Color-coded badges (*Normal*, *Elevated / Review with Doctor*, *Informational*) contextualizing numbers with expected reference ranges.
- **Medical Shorthand Decoder**: Decodes clinical abbreviations (*b.i.d.*, *q.a.m.*, *p.c.*, *PO*, *eGFR*, *PCP*, *HTN*, *T2DM*).
- **Doctor Visit Checklist**: Interactive checklist of questions tailored to the document that users can check off and print.
- **Print / Export Summary**: Formatted clinical handout stylesheet for physical appointments.

### 4. 🌐 Multi-Language Selection Hub
- Full interface and medical explanation translation across **12 languages**:
  - 🇺🇸 English (`en`)
  - 🇪🇸 Spanish / Español (`es`)
  - 🇮🇳 Hindi / हिन्दी (`hi`)
  - 🇫🇷 French / Français (`fr`)
  - 🇨🇳 Simplified Chinese / 简体中文 (`zh`)
  - 🇸🇦 Arabic / العربية (`ar` - with full RTL layout support!)
  - 🇧🇩 Bengali / বাংলা (`bn`)
  - 🇧🇷 Portuguese / Português (`pt`)
  - 🇩🇪 German / Deutsch (`de`)
  - 🇵🇭 Tagalog / Filipino (`tl`)
  - 🇻🇳 Vietnamese / Tiếng Việt (`vi`)
  - 🇮🇳 Tamil / தமிழ் (`ta`)
- **Bilingual Side-by-Side Mode**: Displays explanations in English alongside the patient's native language, enabling immigrant families and English-speaking clinicians to review notes together.

### 5. 💬 Health Assistant (Conversational AI)
- Conversational chat assistant focused on health literacy, procedural explanations, and appointment preparation.
- Safety Guardrail Engine:
  - Blocks diagnostic queries with friendly safety refusals.
  - Blocks prescription and drug dosage queries.
  - Flags urgent symptoms with emergency alerts.
- Voice input microphone (Web Speech Recognition API).
- Text-to-speech voice playback for every response.
- Quick starter prompt chips for instant demonstration.

---

## 🛠️ Technology Stack (Zero-Dependency & Easy to Run)

The application was purposefully engineered with a **zero-dependency, modern web stack** so hackathon judges and users can run it instantly on any system without `npm install` failures or version conflicts:

- **Frontend**: HTML5, Modern CSS3, JavaScript (ES6+ modular architecture).
- **Styling**: Tailwind CSS (via CDN) + Custom clinical stylesheet (`css/styles.css`).
- **Typography**: Google Fonts (Plus Jakarta Sans).
- **Accessibility APIs**: Web Speech Synthesis API (Audio playback) & Web Speech Recognition API (Microphone dictation).
- **Local Runtimes**: Zero install required! Opens in Microsoft Edge, Google Chrome, Mozilla Firefox, or Safari.

---

## 🏃 Exactly How to Run the Application

You can run MediBridge AI locally using any of the three simple methods below:

### Method 1: Direct 1-Click Launch (Easiest)
1. Open the project folder: `d:\Anagha\medibridge-ai\`
2. Double-click **`start-app.bat`** (or simply double-click **`index.html`**).
3. The app will immediately open in your default web browser!

---

### Method 2: Open Directly from PowerShell or Terminal
Open Windows PowerShell, navigate to the folder, and run:
```powershell
Start-Process "d:\Anagha\medibridge-ai\index.html"
```

---

### Method 3: Run as a Local Web Server (Optional)
If you prefer running via `http://localhost:8080/`, MediBridge AI includes a zero-dependency PowerShell server script utilizing Windows' native `.NET HttpListener`:

```powershell
powershell -ExecutionPolicy Bypass -File "d:\Anagha\medibridge-ai\start-server.ps1"
```
The server will start on `http://localhost:8080/` and open your browser automatically.

---

## 🎬 Recommended Hackathon Demo Walkthrough

When presenting to judges, follow this 3-minute sequence:

1. **Introduction & Value (Home)**:
   - Point out the mission statement, 4 key pillars, and the prominent **Medical Safety & Emergency Banner**.
2. **Medical Jargon Buster (Simplifier)**:
   - Click on the `Hypertension` chip or type *"Patient presents with postprandial hyperglycemia"*.
   - Toggle the reading level between **"5th Grade"** and **"Standard Guide"**.
   - Click **"Listen Aloud"** to demonstrate accessibility for visually impaired or elderly patients.
   - Point out the **Everyday Analogy** and the **Questions for Your Doctor**.
3. **Clinical Document Decoder (Explainer)**:
   - Click the **"Blood & Metabolic Panel"** or **"Hospital Discharge Summary"** preset button.
   - Click **"Analyze & Explain Document"**.
   - Show the extracted key metrics with reference ranges and warning badges.
   - Show decoded shorthand (*b.i.d.*, *q.a.m.*, *eGFR*).
   - Show the interactive **Doctor Visit Discussion Checklist** and click **"Print / Export Summary"**.
4. **Multilingual Access (Language Hub)**:
   - Switch language to **Español** or **हिन्दी** or **العربية** (watch the smooth layout flip to RTL!).
   - Toggle **"Bilingual Side-by-Side View"** to demonstrate family-clinician collaborative reading.
5. **Safety Guardrail Testing (Health Assistant)**:
   - Click the prompt chip: `🚨 Chest pain emergency` → Watch the assistant trigger the red emergency protocol without diagnosing.
   - Click the prompt chip: `🛡️ Diagnose my rash` → Watch the assistant politely refuse diagnosis and provide safe educational guidance instead.
   - Click the prompt chip: `🛡️ How many mg to take` → Watch the assistant refuse prescription dosage advice and redirect to a pharmacist.

---

## 🔒 Privacy & HIPAA Considerations

MediBridge AI does not collect, track, or transmit patient identifiable data. All document processing takes place client-side in the user's browser runtime. For production healthcare deployments, MediBridge AI can be configured with on-premise HIPAA-compliant LLM endpoints or private enterprise API keys.

---

## 📄 License
This project is licensed under the MIT License - open for educational and hackathon usage.
