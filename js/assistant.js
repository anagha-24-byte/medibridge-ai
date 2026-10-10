/**
 * MediBridge AI - Conversational Health Assistant Engine
 * Full LLM Integration, Multi-Turn Context Memory, Clinical Guardrails & Evidence Retrieval
 */

const HEALTHCARE_SYSTEM_PROMPT = `You are a knowledgeable, empathetic, evidence-informed healthcare information assistant.

Your role is to help users understand symptoms, medical terminology, laboratory reports, diagnoses provided by their clinicians, medications, preventive health, and general wellness.

Communicate like a high-quality conversational AI: understand the question, reason carefully, explain concepts in depth when requested, maintain context across messages, and answer follow-up questions naturally.

Use clear, accessible language. Explain medical terminology when first introduced. Structure complex answers using headings, bullet points, comparisons, and examples where helpful.

Answer the specific question before providing additional context. Do not give vague, repetitive, generic disclaimers in place of a useful answer.

When information is insufficient, clearly state what is unknown and ask focused clarifying questions. Never invent patient details, medical histories, laboratory values, research findings, medication instructions, or citations.

Distinguish established medical information from possible explanations and areas of uncertainty.

You provide healthcare information, not a definitive medical diagnosis or a replacement for a qualified healthcare professional. Never claim certainty that the available evidence does not support.

For medication questions, explain general uses, precautions, and interactions only when supported by reliable information. Do not independently prescribe medicines, invent dosages, or instruct users to stop or change prescribed treatment.

For medical reports, interpret only the information actually available, respect the reference ranges and units provided, and explain relevant limitations.

For potentially life-threatening symptoms, prioritize urgent medical assistance and concise safety instructions rather than lengthy explanations or unnecessary questions.

Be respectful, nonjudgmental, empathetic, and responsive to the user's language and level of understanding.

Your goal is to help the user understand their health and make informed decisions, while communicating honestly about uncertainty and limitations.`;

class HealthAssistant {
  constructor() {
    this.chatHistory = []; // Array of { role: 'user' | 'assistant', text: string }
    this.speechSynth = window.speechSynthesis || null;
    this.recognition = null;
    this.activeTopic = null; // Tracks active medical subject (e.g. 'hemoglobin', 'hypertension')
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    }
  }

  resetChat() {
    this.chatHistory = [];
    this.activeTopic = null;
  }

  getWelcomeMessage(lang = 'en') {
    const welcomeMessages = {
      en: "Hello! I am your **MediBridge Health Assistant**, a context-aware conversational AI. I can explain medical terms, interpret lab test results, answer follow-up health questions in detail, and help you prepare for doctor visits.\n\n*Safety Notice:* I provide healthcare education and cannot offer a personal medical diagnosis or prescribe medications. In an emergency, call **112** or **108** immediately.",
      hi: "नमस्ते! मैं आपका **मेडिब्रिज स्वास्थ्य सहायक** हूँ। मैं चिकित्सा शब्दों को सरल कर सकता हूँ, लैब टेस्ट समझा सकता हूँ और स्वास्थ्य संबंधी सवालों के विस्तृत जवाब दे सकता हूँ।\n\n*सुरक्षा निर्देश:* आपात स्थिति में तुरंत **112 / 108** पर कॉल करें।",
      kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ **ಮೆಡಿಬ್ರಿಡ್ಜ್ ಆರೋಗ್ಯ ಸಹಾಯಕ (MediBridge Health Assistant)**. ನಾನು ವೈದ್ಯಕೀಯ ಪದಗಳನ್ನು, ಲ್ಯಾಬ್ ವರದಿಗಳನ್ನು ವಿವರವಾಗಿ ವಿವರಿಸಬಲ್ಲೆ ಮತ್ತು ನಿಮ್ಮ ಆರೋಗ್ಯ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಬಲ್ಲೆ.\n\n*ಸುರಕ್ಷತಾ ಸೂಚನೆ:* ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ತಕ್ಷಣವೇ **112 ಅಥವಾ 108** ಗೆ ಕರೆ ಮಾಡಿ.",
      mr: "नमस्कार! मी तुमचा **मेडिब्रिज आरोग्य सहाय्यक (MediBridge Health Assistant)** आहे. मी कठीण वैद्यकीय संज्ञा, लॅब रिपोर्ट्स सविस्तर समजावून सांगू शकतो.\n\n*सुरक्षा नियम:* आणीबाणीच्या परिस्थितीत त्वरित **112 किंवा 108** वर संपर्क साधा.",
      te: "నమస్కారం! నేను మీ **మెడిబ్రిడ్జ్ హెల్త్ అసిస్టెంట్ (MediBridge Health Assistant)**. నేను సంక్లిష్టమైన వైద్య పదాలను, ల్యాబ్ నివేదికలను వివరంగా వివరించగలను.\n\n*భద్రతా మార్గదర్శకం:* అత్యవసర పరిస్థితిలో వెంటనే **112 లేదా 108** కు కాల్ చేయండి."
    };
    return welcomeMessages[lang] || welcomeMessages['en'];
  }

  /**
   * Main conversational dispatch:
   * 1. Red-flag emergency triage check
   * 2. Diagnostic refusal guardrail
   * 3. Prescription dosage guardrail
   * 4. Multi-turn context resolution
   * 5. Real LLM invocation via backend /api/chat or Gemini API
   * 6. Clinical reasoning engine fallback
   */
  async processMessage(userMessage, currentLanguage = 'en', userApiKey = '', currentDocContext = null) {
    const cleanMsg = userMessage.trim();
    if (!cleanMsg) return null;

    // 1. Red-flag emergency detection (Highest priority)
    const emergencyCheck = this.checkEmergencySymptoms(cleanMsg);
    if (emergencyCheck.isEmergency) {
      let respText = emergencyCheck.response;
      if (currentLanguage !== 'en' && typeof translateText === 'function') {
        respText = translateText(respText, currentLanguage);
      }
      this.chatHistory.push({ role: 'user', text: cleanMsg });
      this.chatHistory.push({ role: 'assistant', text: respText });
      return {
        type: 'emergency',
        safetyBadge: currentLanguage === 'en' ? '🚨 URGENT MEDICAL ADVISORY' : translateText('🚨 URGENT MEDICAL ADVISORY', currentLanguage),
        text: respText,
        urgentAction: true,
        followUps: ["How to call 112 / 108 right now", "Emergency first-aid guidance"]
      };
    }

    // 2. Diagnostic refusal guardrail
    const diagnosisCheck = this.checkDiagnosticRequest(cleanMsg);
    if (diagnosisCheck.isDiagnostic) {
      let respText = diagnosisCheck.response;
      if (currentLanguage !== 'en' && typeof translateText === 'function') {
        respText = translateText(respText, currentLanguage);
      }
      this.chatHistory.push({ role: 'user', text: cleanMsg });
      this.chatHistory.push({ role: 'assistant', text: respText });
      return {
        type: 'guardrail_diagnosis',
        safetyBadge: currentLanguage === 'en' ? '🛡️ Medical Safety Guardrail — Non-Diagnostic Policy' : translateText('🛡️ Medical Safety Guardrail — Non-Diagnostic Policy', currentLanguage),
        text: respText,
        urgentAction: false,
        followUps: ["What questions should I ask my doctor?", "What tests typically evaluate these symptoms?"]
      };
    }

    // 3. Prescription & Medication dosage refusal guardrail
    const prescriptionCheck = this.checkPrescriptionRequest(cleanMsg);
    if (prescriptionCheck.isPrescription) {
      let respText = prescriptionCheck.response;
      if (currentLanguage !== 'en' && typeof translateText === 'function') {
        respText = translateText(respText, currentLanguage);
      }
      this.chatHistory.push({ role: 'user', text: cleanMsg });
      this.chatHistory.push({ role: 'assistant', text: respText });
      return {
        type: 'guardrail_prescription',
        safetyBadge: currentLanguage === 'en' ? '🛡️ Safety Guardrail — No Prescriptions or Dosages' : translateText('🛡️ Safety Guardrail — No Prescriptions or Dosages', currentLanguage),
        text: respText,
        urgentAction: false,
        followUps: ["How to ask my pharmacist about this medicine", "General common uses for this drug class"]
      };
    }

    // Detect and update active conversational topic
    this.updateActiveTopic(cleanMsg);

    // 4. Multi-turn LLM generation attempt (Server Backend or Direct API)
    let aiResponse = null;
    let providerLabel = null;

    // Try Backend Server Proxy first (/api/chat)
    let aiUnconfigured = false;
    try {
      const serverRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanMsg,
          history: this.chatHistory.slice(-8),
          systemInstruction: HEALTHCARE_SYSTEM_PROMPT,
          clientApiKey: userApiKey || ''
        })
      });

      if (serverRes.ok) {
        const data = await serverRes.json();
        if (data.success && data.reply) {
          aiResponse = data.reply;
          providerLabel = data.provider || "Google Gemini 1.5 Flash (Live Server Proxy)";
        }
      } else if (serverRes.status === 503) {
        const errData = await serverRes.json().catch(() => ({}));
        if (errData.error === 'AI_NOT_CONFIGURED') {
          aiUnconfigured = true;
        }
      }
    } catch (e) {
      // Backend server not listening (static mode / file://)
    }

    // If backend proxy didn't answer, try direct Gemini API if client API key is provided
    if (!aiResponse && userApiKey) {
      try {
        aiResponse = await this.callGeminiDirect(cleanMsg, userApiKey, currentDocContext);
        if (aiResponse) {
          providerLabel = "Google Gemini 1.5 Flash (Direct API)";
        }
      } catch (err) {
        console.warn("Direct Gemini API error:", err);
      }
    }

    // 5. Intelligent Multi-Turn Clinical Knowledge Engine Fallback
    if (!aiResponse) {
      const offlineReply = this.generateDetailedConversationalResponse(cleanMsg, currentDocContext);
      if (aiUnconfigured) {
        aiResponse = `> ⚠️ **Notice**: Google Gemini API key is not configured on the server. Set \`GEMINI_API_KEY\` in your \`.env\` file for live LLM responses.\n\n${offlineReply}`;
        providerLabel = "MediBridge Clinical Engine (Offline / Deterministic Fallback)";
      } else {
        aiResponse = offlineReply;
        providerLabel = "MediBridge Clinical Intelligence Engine (Offline / Multi-Turn)";
      }
    }

    if (currentLanguage !== 'en' && typeof translateText === 'function') {
      aiResponse = translateText(aiResponse, currentLanguage);
    }

    // Save to multi-turn conversation memory
    this.chatHistory.push({ role: 'user', text: cleanMsg });
    this.chatHistory.push({ role: 'assistant', text: aiResponse });

    // Save to user history if logged in
    if (window.authManager && window.authManager.isAuthenticated()) {
      window.authManager.saveHistory('conversation', 'Health Assistant Consultation', cleanMsg, { reply: aiResponse });
    }

    // Generate dynamic suggested follow-ups
    const followUps = this.generateFollowUpSuggestions(cleanMsg, this.activeTopic);
    // Add hospital discovery follow-up
    if (!followUps.includes("🏥 Find nearby hospitals & plan appointment")) {
      followUps.unshift("🏥 Find nearby hospitals & plan appointment");
    }

    return {
      type: 'conversational_ai',
      safetyBadge: `💡 ${providerLabel}`,
      text: aiResponse,
      urgentAction: false,
      followUps: followUps,
      offerHospitalAssistance: true
    };
  }

  /**
   * Direct Gemini API Call with multi-turn history and system instructions
   */
  async callGeminiDirect(message, apiKey, docContext = null) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const contents = [];
    // Append conversation history
    this.chatHistory.slice(-6).forEach(h => {
      contents.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      });
    });

    let augmentedMessage = message;
    if (docContext && docContext.summary) {
      augmentedMessage += `\n\n[Active Patient Document Context: Type: ${docContext.docType?.label}. Extracted Summary: ${docContext.summary}]`;
    }

    contents.push({
      role: 'user',
      parts: [{ text: augmentedMessage }]
    });

    const body = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: HEALTHCARE_SYSTEM_PROMPT }]
      },
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2048,
        topP: 0.95
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    return null;
  }

  /**
   * Tracks active topic to resolve follow-up pronouns ("it", "that", "this")
   */
  updateActiveTopic(msg) {
    const lower = msg.toLowerCase();
    const topics = [
      { key: 'hemoglobin', keywords: ['hemoglobin', 'haemoglobin', 'hgb', 'hb', 'anemia', 'red blood'] },
      { key: 'blood_pressure', keywords: ['blood pressure', 'hypertension', 'systolic', 'diastolic', 'bp'] },
      { key: 'glucose', keywords: ['glucose', 'sugar', 'fbs', 'hba1c', 'diabetes', 'prediabetes'] },
      { key: 'cholesterol', keywords: ['cholesterol', 'lipid', 'ldl', 'hdl', 'triglycerides'] },
      { key: 'creatinine', keywords: ['creatinine', 'egfr', 'kidney', 'renal', 'kidney function'] },
      { key: 'platelets', keywords: ['platelet', 'platelets', 'clotting', 'thrombocyte'] },
      { key: 'imaging', keywords: ['mri', 'ct scan', 'x-ray', 'xray', 'ultrasound', 'radiology'] },
      { key: 'medication', keywords: ['generic', 'brand name', 'antibiotic', 'medication', 'side effect'] }
    ];

    for (const t of topics) {
      if (t.keywords.some(k => lower.includes(k))) {
        this.activeTopic = t.key;
        return;
      }
    }
  }

  /**
   * Generates comprehensive, evidence-informed answers with the 8-part clinical structure
   */
  generateDetailedConversationalResponse(msg, docContext = null) {
    const lower = msg.toLowerCase();
    const topic = this.activeTopic;

    // Is user asking about low levels of the active topic?
    const isLowQuestion = lower.includes('low') || lower.includes('drops') || lower.includes('deficiency') || lower.includes('decrease');
    // Is user asking about high levels?
    const isHighQuestion = lower.includes('high') || lower.includes('elevated') || lower.includes('rises') || lower.includes('increase');
    // Is user asking about diet or foods?
    const isFoodQuestion = lower.includes('food') || lower.includes('diet') || lower.includes('eat') || lower.includes('nutrition');

    // 1. HEMOGLOBIN TOPIC
    if (topic === 'hemoglobin' || lower.includes('hemoglobin') || lower.includes('haemoglobin')) {
      if (isLowQuestion) {
        return `### 1. Direct Answer
When **hemoglobin levels drop below standard reference ranges** (typically below 13.5 g/dL in adult men or 12.0 g/dL in non-pregnant adult women), the condition is clinically referred to as **anemia**.

### 2. Detailed Explanation
Hemoglobin is the iron-containing protein inside your red blood cells that picks up oxygen in your lungs and carries it to your brain, muscles, and vital organs. When hemoglobin is low, your body's tissues do not receive enough oxygen to function at their optimal energy level.

### 3. Common Symptoms of Low Hemoglobin
* Persistent fatigue and lack of energy
* Shortness of breath during routine activities (e.g., climbing stairs)
* Pale skin, nail beds, or inside of lower eyelids
* Dizziness, lightheadedness, or cold hands and feet
* Fast or irregular heartbeat (palpitations) as the heart works harder to pump oxygen

### 4. Possible Contributing Causes
* **Nutritional deficiencies:** Insufficient iron, vitamin B12, or folate in the diet.
* **Blood loss:** Heavy menstrual bleeding, gastrointestinal bleeding (such as from ulcers or hemorrhoids).
* **Decreased production:** Kidney disease (reduced erythropoietin), chronic inflammation, or bone marrow conditions.

### 5. Practical Next Steps & What You Can Do
* Request a complete blood count (CBC) with **Serum Ferritin** and **Iron Studies** to pinpoint the exact root cause.
* Do not self-prescribe high-dose iron supplements without testing, as excess iron can accumulate in organs.

### 6. When to Seek Medical Attention
* Seek immediate emergency care (dial 112 / 108) if you experience chest pain, sudden severe shortness of breath, or fainting.

### 7. Reliable Sources & References
* [World Health Organization (WHO) — Anaemia Guidelines](https://www.who.int/health-topics/anaemia)
* [National Institutes of Health (NIH) — Iron-Deficiency Anemia](https://www.nhlbi.nih.gov/health/anemia/iron-deficiency-anemia)`;
      }

      if (isFoodQuestion) {
        return `### 1. Direct Answer
To help support healthy hemoglobin production, you should focus on **iron-rich foods**, **vitamin C** (which boosts iron absorption), and **vitamin B12 and folate**.

### 2. Key Dietary Sources
* **Heme Iron (Easily absorbed by the body):** Lean poultry, fish, eggs.
* **Non-Heme Iron (Plant-based sources):** Spinach, fenugreek (methi), lentils (dal), chickpeas, beans, tofu, pumpkin seeds, and fortified cereals.
* **Vitamin C Enhancers:** Citrus fruits (oranges, lemons), amla (Indian gooseberry), bell peppers, tomatoes, and guava. Eating these alongside iron-rich plant foods triples iron absorption.
* **Folate & Vitamin B12 Sources:** Leafy greens, dairy products, eggs, legumes.

### 3. Foods to Avoid Pairing with Iron
* **Tannins & Polyphenols in Tea and Coffee:** Drinking tea or coffee immediately with meals significantly reduces iron absorption. Wait at least 1 hour after eating before having tea.
* **High Calcium Foods:** Very large amounts of calcium taken at the exact same moment can compete with iron absorption.

### 4. Important Clinical Context
While diet supports gradual recovery in mild nutritional anemia, underlying blood loss or malabsorption requires clinical evaluation. Always confirm the cause with your physician before relying solely on diet.

### 5. Reliable Sources
* [MedlinePlus (National Library of Medicine) — Iron in Diet](https://medlineplus.gov/ency/article/002422.htm)
* [Harvard T.H. Chan School of Public Health — Iron](https://www.hsph.harvard.edu/nutritionsource/iron/)`;
      }

      return `### 1. Direct Answer
**Hemoglobin** (often abbreviated as **Hb** or **Hgb**) is the vital protein molecules contained inside your red blood cells responsible for transporting oxygen throughout your entire body.

### 2. Detailed Explanation
Every single cell in your body needs oxygen to create energy. When you inhale, oxygen passes into your blood and binds tightly to hemoglobin molecules in your lungs. Red blood cells then travel through arteries to deliver that oxygen to your brain, heart, muscles, and tissues, returning with carbon dioxide to be exhaled.

### 3. Understanding Reference Ranges
* **Adult Men:** Typically **13.5 to 17.5 g/dL**
* **Adult Women (Non-pregnant):** Typically **12.0 to 15.5 g/dL**
*(Note: Reference ranges vary slightly between testing laboratories and geographic elevations.)*

### 4. Why It Matters
* **Low Hemoglobin (Anemia):** Causes reduced oxygen delivery, leading to fatigue, pale skin, cold extremities, and shortness of breath.
* **High Hemoglobin (Polycythemia):** Causes blood to become thicker, which can occur in dehydration, smoking, high altitudes, or chronic lung conditions.

### 5. Questions for Your Doctor
1. *"Is my hemoglobin number where you expect it to be for my age and lifestyle?"*
2. *"Should we test my ferritin or vitamin B12 levels to get a complete picture?"*

### 6. Reliable Sources
* [National Institutes of Health (NIH) — Hemoglobin Test](https://medlineplus.gov/lab-tests/hemoglobin-test/)
* [Cleveland Clinic — Hemoglobin Function & Levels](https://my.clevelandclinic.org/health/diagnostics/17797-hemoglobin-test)`;
    }

    // 2. BLOOD PRESSURE TOPIC
    if (topic === 'blood_pressure' || lower.includes('blood pressure') || lower.includes('hypertension')) {
      return `### 1. Direct Answer
**Blood pressure** is the measurement of the force that circulating blood exerts against the walls of your arteries as your heart pumps it around your body.

### 2. What Do the Numbers Mean?
Blood pressure is always reported as two numbers (e.g., **120 / 80 mmHg**):
* **Systolic (Top number):** The peak pressure when your heart muscle contracts and pumps blood into arteries.
* **Diastolic (Bottom number):** The resting pressure between beats when your heart muscle relaxes to fill with blood.

### 3. Clinical Categories (AHA / Indian Guidelines)
* **Normal:** Below 120 / 80 mmHg
* **Elevated:** Systolic 120–129 AND Diastolic < 80 mmHg
* **Stage 1 Hypertension:** Systolic 130–139 OR Diastolic 80–89 mmHg
* **Stage 2 Hypertension:** Systolic ≥ 140 OR Diastolic ≥ 90 mmHg

### 4. Everyday Analogy
Think of your circulatory system like a garden hose. If the water faucet is opened too high for years, the hose walls experience constant pressure stress. Over time, that strain causes wear and tear on your blood vessels, heart, and kidneys.

### 5. Practical Lifestyle Steps
* **DASH Diet:** Emphasize fruits, vegetables, whole grains, and lean proteins while lowering sodium to under 2,000 mg/day.
* **Regular Movement:** 30 minutes of brisk walking 5 days a week.
* **Home Blood Pressure Log:** Take readings seated quietly for 5 minutes morning and evening for 7 days before your appointment.

### 6. When to Seek Immediate Attention
* If blood pressure exceeds **180/120 mmHg** accompanied by chest pain, shortness of breath, blurry vision, or numbness, call **112 / 108** immediately (Hypertensive Emergency).

### 7. Reliable Sources
* [World Health Organization (WHO) — Hypertension](https://www.who.int/news-room/fact-sheets/detail/hypertension)
* [American Heart Association — Understanding Blood Pressure Readings](https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings)`;
    }

    // 3. FASTING GLUCOSE / DIABETES TOPIC
    if (topic === 'glucose' || lower.includes('glucose') || lower.includes('blood sugar') || lower.includes('hba1c')) {
      return `### 1. Direct Answer
**Fasting blood glucose** measures the concentration of sugar (glucose) in your bloodstream after you have fasted (consumed no food or drinks other than water) for at least 8 to 12 hours.

### 2. Standard Reference Targets
* **Normal / Expected:** **70 to 99 mg/dL**
* **Prediabetes Range (Impaired Fasting Glucose):** **100 to 125 mg/dL**
* **Diabetes Range:** **126 mg/dL or higher** on two separate laboratory occasions

### 3. Why It Matters
Glucose is your body's primary fuel source. When you eat, carbohydrates convert to glucose. Insulin, a hormone made by your pancreas, acts like a key that unlocks your body's cells to let glucose enter and be used for energy. When cells become resistant to insulin, glucose remains circulating in the bloodstream.

### 4. Practical Actions You Can Take
* **Combine with HbA1c:** While fasting glucose shows a snapshot of one morning, an **HbA1c test** reveals your 90-day average.
* **Post-Meal Walks:** A gentle 10 to 15-minute walk after lunch and dinner significantly lowers peak glucose levels.
* **Pair Carbs with Protein/Fiber:** Avoid naked carbohydrates; adding fiber or healthy fats slows gastric absorption.

### 5. Questions for Your Doctor
1. *"What is my personal target fasting glucose number?"*
2. *"Would an HbA1c test give us a clearer picture of my blood sugar stability over time?"*

### 6. Reliable Sources
* [CDC — Diabetes and Prediabetes Testing](https://www.cdc.gov/diabetes/basics/getting-tested.html)
* [American Diabetes Association (ADA) — Diagnosis Guidelines](https://diabetes.org/about-diabetes/diagnosis)`;
    }

    // 4. CHOLESTEROL / LIPID PANEL
    if (topic === 'cholesterol' || lower.includes('cholesterol') || lower.includes('triglyceride')) {
      return `### 1. Direct Answer
A **lipid profile** measures circulating fats in your blood to evaluate your long-term cardiovascular health and arterial blood flow.

### 2. The Four Key Numbers Explained
* **Total Cholesterol:** The total amount of circulating cholesterol (desirable is typically below **200 mg/dL**).
* **LDL ('Bad' Cholesterol):** Particles that can form fatty plaque deposits inside artery walls (target is typically below **100 mg/dL**).
* **HDL ('Good' Cholesterol):** Protective particles that ferry excess cholesterol back to your liver for removal (desirable is above **40–50 mg/dL**).
* **Triglycerides:** Fats stored from unused calories; elevated levels often correlate with refined sugar intake or alcohol (desirable is below **150 mg/dL**).

### 3. Practical Steps
* Increase soluble fiber: Oats, beans, chia seeds, and fruits bind cholesterol in your digestive tract and help eliminate it naturally.
* Replace trans-fats and saturated fats with heart-healthy monounsaturated oils (olive oil, mustard oil in moderation).

### 4. Reliable Sources
* [National Heart, Lung, and Blood Institute (NHLBI) — High Blood Cholesterol](https://www.nhlbi.nih.gov/health/blood-cholesterol)
* [MedlinePlus — Cholesterol Levels](https://medlineplus.gov/cholesterollevel.html)`;
    }

    // 5. CONTEXTUAL DOCUMENT INQUIRY
    if (docContext && (lower.includes('my report') || lower.includes('this report') || lower.includes('my test') || lower.includes('my document'))) {
      const summaryText = docContext.summary || "Document parsed";
      const findingsCount = docContext.keyFindings?.length || 0;
      return `### 1. Direct Review of Your Uploaded Report
Based on your active document (**${docContext.docType?.label || 'Clinical Document'}**), the system has verified **${findingsCount} laboratory parameters**.

### 2. Summary of Verified Findings
${summaryText}

### 3. What You Should Focus on with Your Doctor
* Review any items flagged as elevated or out-of-range.
* Compare these numbers with your previous testing history to observe the direction of trends.

### 4. Disclaimer
*MediBridge AI interprets only verified text extracted directly from your document. Please review these findings with your primary physician.*`;
    }

    // GENERAL COMPREHENSIVE HEALTH LITERACY RESPONSE
    return `### 1. Overview & Core Concept
Understanding your health metrics and clinical documents is one of the most effective ways to become an active partner in your healthcare.

### 2. Detailed Medical Context
Medical terminology frequently sounds intimidating because it relies heavily on Latin and Greek roots:
* **"-itis"** indicates irritation or inflammation (e.g. *bronchitis*, *arthritis*).
* **"Hyper-"** indicates above normal levels (e.g. *hypertension*, *hyperglycemia*).
* **"Hypo-"** indicates below normal levels (e.g. *hypothyroidism*, *hypotension*).
* **"-megaly"** indicates enlargement (e.g. *cardiomegaly*).

### 3. How to Interpret Laboratory Ranges
Isolated lab values rarely tell the whole story. Your physician interprets numbers in the context of:
* Your physical symptoms and daily energy levels
* Your age, biological baseline, and medications
* Comparative trends from previous blood panels over 6 to 12 months

### 4. Smart Next Steps
* Ask me about any specific test, symptom, or abbreviation (e.g. *Hemoglobin*, *Fasting Glucose*, *eGFR*, *b.i.d.*).
* Upload your clinical report in the **Document Explainer** to extract verified findings.
* Add questions directly into your **Patient Action Checklist** before your next clinic appointment.

### 5. Reliable Reference Resources
* [MedlinePlus — U.S. National Library of Medicine](https://medlineplus.gov/)
* [World Health Organization (WHO) Health Topics](https://www.who.int/health-topics)`;
  }

  /**
   * Generates dynamic follow-up prompt suggestions
   */
  generateFollowUpSuggestions(userMsg, topic) {
    if (topic === 'hemoglobin') {
      return [
        "What happens if hemoglobin is low?",
        "What foods can help increase hemoglobin?",
        "What is the difference between iron and hemoglobin?"
      ];
    } else if (topic === 'blood_pressure') {
      return [
        "What is the difference between systolic and diastolic?",
        "What foods or habits help lower blood pressure?",
        "What questions should I ask my doctor about hypertension?"
      ];
    } else if (topic === 'glucose') {
      return [
        "What is the difference between fasting glucose and HbA1c?",
        "What are common symptoms of high blood sugar?",
        "How does exercise impact insulin resistance?"
      ];
    } else if (topic === 'cholesterol') {
      return [
        "What is the difference between LDL and HDL?",
        "What lifestyle habits reduce triglycerides?",
        "When do doctors recommend statin medications?"
      ];
    }
    return [
      "What is hemoglobin and why does it matter?",
      "What does fasting blood glucose mean?",
      "What should I ask my doctor during a checkup?"
    ];
  }

  /**
   * Check for life-threatening emergency symptoms
   */
  checkEmergencySymptoms(text) {
    const lower = text.toLowerCase();
    const emergencyTriggers = [
      'chest pain', 'crushing chest', 'heart attack', 'chest pressure', 
      'difficulty breathing', 'severe shortness of breath', 'can\'t breathe',
      'face drooping', 'arm weakness', 'slurred speech', 'stroke',
      'sudden vision loss', 'coughing up blood', 'severe bleeding',
      'unconscious', 'fainted and won\'t wake up', 'anaphylaxis'
    ];

    for (const trigger of emergencyTriggers) {
      if (lower.includes(trigger)) {
        return {
          isEmergency: true,
          response: `🚨 **IMMEDIATE EMERGENCY ACTION REQUIRED**

If you or someone nearby is experiencing **${trigger}**, call emergency services immediately:

* **India (Ambulance):** Dial **108**
* **India (Unified Emergency):** Dial **112**
* **United States / Canada:** Dial **911**
* **United Kingdom:** Dial **999**

**DO NOT wait to read explanations, research symptoms, or wait for replies.**
* Sit down in a safe, resting position.
* Unlock your front door if you are alone so responders can enter.
* Stay on the phone with the emergency dispatcher and follow their directions.`
        };
      }
    }
    return { isEmergency: false };
  }

  /**
  * Check if user is asking for a medical diagnosis
  */
  checkDiagnosticRequest(text) {
    const diagnosticPatterns = [
      /\b(?:diagnose\s+(?:me|my|this|if)|can\s+you\s+diagnose)\b/i,
      /\b(?:what\s+disease\s+do\s+i\s+have|what\s+illness\s+do\s+i\s+have|do\s+i\s+have\s+(?:cancer|diabetes|shingles|covid|stroke|heart\s+attack))\b/i,
      /\b(?:tell\s+me\s+if\s+i\s+have|is\s+this\s+(?:cancer|a\s+tumor|infection))\b/i
    ];

    if (diagnosticPatterns.some(p => p.test(text))) {
      return {
        isDiagnostic: true,
        response: `🛡️ **Medical Safety Guardrail: Non-Diagnostic Policy**

MediBridge AI **cannot provide a personal medical diagnosis**.

**Why only a licensed physician can diagnose:**
A safe medical diagnosis requires:
1. Physical examination (listening to heart/lungs, palpation, neurological reflexes)
2. Comprehensive clinical history and review of systems
3. Certified laboratory panels and diagnostic imaging evaluated in clinical context

**What I can do instead:**
* Explain the medical terms and typical diagnostic tests doctors use to evaluate these symptoms.
* Help you prepare a clear list of questions to discuss with your doctor.

*Please schedule an in-person assessment with your primary care physician or visit an urgent care center.*`
      };
    }
    return { isDiagnostic: false };
  }

  /**
   * Check if user is asking for a prescription or drug dosage
   */
  checkPrescriptionRequest(text) {
    const prescriptionPatterns = [
      /\b(?:how\s+many\s+(?:mg|milligrams|grams|ml|pills|tablets|capsules)|what\s+(?:dose|dosage)|how\s+much)\b.*(?:take|consume|use|drink|need)/i,
      /\b(?:prescribe\s+(?:me|a|some)|what\s+antibiotic\s+should\s+i\s+take|recommend\s+an\s+antibiotic|give\s+me\s+a\s+prescription)\b/i,
      /\b(?:amoxicillin|azithromycin|ciprofloxacin|ibuprofen|paracetamol|metformin|antibiotic)\b.*(?:dose|dosage|how\s+many|how\s+much)/i,
      /\b(?:dose|dosage|how\s+many\s+(?:mg|milligrams|grams|pills)|how\s+much)\b.*(?:amoxicillin|azithromycin|ciprofloxacin|ibuprofen|paracetamol|metformin|antibiotic|medicine|medication)/i
    ];

    if (prescriptionPatterns.some(p => p.test(text))) {
      return {
        isPrescription: true,
        response: `🛡️ **Prescription Safety Guardrail: No Medication Advice**

MediBridge AI **cannot prescribe medications, calculate dosages, or recommend specific drug regimens**.

**Why medication dosing requires a licensed healthcare provider:**
Safe dosing depends on critical individual physiological variables:
* Kidney and liver clearance function (eGFR, ALT/AST)
* Your exact weight, age, and medical history
* Potential drug-drug interactions with other prescriptions and supplements
* Known pharmaceutical allergies

**What you should do instead:**
* Speak directly with your **treating physician** or your **licensed neighborhood pharmacist**. Pharmacists are medication specialists who can review your active medications and recommend safe over-the-counter options for free.
* Never stop or adjust prescription dosages without your doctor's explicit direction.`
      };
    }
    return { isPrescription: false };
  }

  /**
   * Text-to-speech for assistant messages
   */
  speak(text, lang = 'en') {
    if (!this.speechSynth) return;
    if (this.speechSynth.speaking) {
      this.speechSynth.cancel();
    }
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    
    const langMap = {
      en: 'en-US', es: 'es-ES', hi: 'hi-IN', fr: 'fr-FR',
      zh: 'zh-CN', ar: 'ar-SA', bn: 'bn-IN', pt: 'pt-BR',
      de: 'de-DE', tl: 'fil-PH', vi: 'vi-VN', ta: 'ta-IN',
      kn: 'kn-IN', mr: 'mr-IN', te: 'te-IN'
    };
    utterance.lang = langMap[lang] || 'en-US';
    this.speechSynth.speak(utterance);
  }
}

if (typeof window !== 'undefined') {
  window.HealthAssistant = HealthAssistant;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HealthAssistant, HEALTHCARE_SYSTEM_PROMPT };
}
