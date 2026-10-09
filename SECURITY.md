# 🛡️ MediBridge AI — Security Policy & Threat Model

> **Status**: Verified Secure Hackathon Prototype  
> **Architecture**: 100% In-Browser Client-Side Execution (Zero Remote PHI Transmission)  
> **Compliance Alignment**: HIPAA / DISHA (Digital Information Security in Healthcare Act) Health Privacy Guidelines

---

## 1. Security Architecture Overview

MediBridge AI was purposefully architected as a **client-side, zero-backend, zero-database application**. By running 100% within the user's browser runtime:

1. **Zero Protected Health Information (PHI) In Transit or At Rest on Servers**:
   - Patient medical records, lab reports, discharge summaries, and symptoms are never uploaded to any remote server or stored in any cloud database.
   - Text parsing, morphological simplification, clinical abbreviation deconstruction, and checklist management execute entirely in local client memory (`window`, `DOM`, `localStorage`).

2. **No Secret Keys in Frontend Bundles**:
   - The application relies on open standards and public endpoints (OpenStreetMap Overpass API, Nominatim Geocoding, browser Web Speech Synthesis / Recognition, browser Geolocation API).
   - Live external endpoints do not require paid or proprietary API keys, eliminating key leakage or credential exposure in public repositories.
   - Optional LLM integration (Google Gemini) stores user-supplied API keys exclusively in the user's local `window.localStorage` and transmits requests directly via TLS 1.3 from the user's browser to Google's API endpoint, never proxying through an intermediary server.

---

## 2. Threat Modeling & Safeguards

| Threat Vector | Risk Level | Mitigation & Implementation Details |
|---|---|---|
| **Cross-Site Scripting (XSS)** | Critical | All dynamic text content is rendered using native `textContent`, DOM text nodes, or sanitized through `escapeHtml()` helper before insertion. Raw HTML from user document uploads or external OSM API responses is never evaluated via unchecked `innerHTML`. |
| **Geolocation Leakage / Tracking** | High | Device geolocation coordinates are requested **only upon explicit user click** (`#hospital-use-gps-btn`). No coordinates are sent to analytics, telemetry, or remote trackers. Coordinates are stored transiently in local JavaScript state and never persisted to cookies or `localStorage`. |
| **Fabricated Clinical Information** | Critical | The application maintains strict medical guardrails: non-diagnostic refusals for diagnostic inquiries, blocking of dosage alterations, prominent reference range variance warnings, and immediate red-flag triage escalations. |
| **Mislabeled Emergency Numbers** | High | All emergency phone numbers (112, 108, 104, 181, 14416) are verified official government dispatches. Hospital phone numbers are strictly partitioned into general lines and emergency casualty lines; when an emergency department direct number is missing in retrieved OSM data, MediBridge AI explicitly states: *"Emergency department direct line not available in retrieved data — dial 112 / 108"*. No numbers are fabricated. |
| **Denial of Service (Overpass API)** | Medium | Live Overpass API queries are safeguarded with `AbortController` 8-second timeouts, an in-memory `Map` query cache, and instant fallback to a resilient curated offline directory of 40+ apex tertiary hospitals across India and global hubs. |
| **Man-In-The-Middle (MITM)** | High | When deployed on GitHub Pages or local web servers, all external requests (OpenStreetMap, Nominatim, CDN scripts) enforce HTTPS / TLS 1.3 with strict Subresource Integrity where appropriate. |

---

## 3. Safe DOM & Content Security Practices

In `js/app.js` and `js/hospitals.js`:
- All user-supplied strings and OpenStreetMap tag values pass through:
  ```javascript
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  ```
- Links use `target="_blank" rel="noopener noreferrer"` to eliminate tabnabbing risks.
- `tel:` links are strictly sanitized via regex to only contain valid dialing digits and `+` prefix:
  ```javascript
  formatTelUri(phone) {
    if (!phone) return null;
    const cleaned = String(phone).replace(/[^\d+]/g, '');
    return cleaned.length >= 3 ? `tel:${cleaned}` : null;
  }
  ```

---

## 4. Privacy & Regulatory Compliance

- **HIPAA (Health Insurance Portability and Accountability Act)**: MediBridge AI does not collect or transmit Electronic Protected Health Information (ePHI) to covered entities or business associates.
- **DISHA (Digital Information Security in Healthcare Act - India)**: Ensures digital health data remains strictly under patient custody within the patient's local device.
- **GDPR Article 9 (Special Category Data)**: Health data processed locally under Article 9(2)(a) explicit user action, with zero cloud profiling or user tracking.

---

## 5. Vulnerability Reporting

If you identify a security issue or potential vulnerability in MediBridge AI:
1. Do not file public GitHub issues for security vulnerabilities.
2. Please document the proof-of-concept and reach out to the project maintainers directly via repository security advisories.
3. Vulnerabilities will be triaged and addressed within 48 hours during active hackathon evaluation.
