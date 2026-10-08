/**
 * MediBridge AI - Conversational Health Assistant Engine
 * Equipped with strict medical-safety guardrails, red-flag emergency detection, and speech accessibility
 */

class HealthAssistant {
  constructor() {
    this.chatHistory = [];
    this.speechSynth = window.speechSynthesis || null;
    this.recognition = null;
    this.isListening = false;
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

  /**
   * Evaluates user input against safety filters and generates appropriate response
   */
  async processMessage(userMessage, currentLanguage = 'en') {
    const cleanMsg = userMessage.trim();
    if (!cleanMsg) return null;

    // 1. Red-flag emergency detection (Highest priority)
    const emergencyCheck = this.checkEmergencySymptoms(cleanMsg);
    if (emergencyCheck.isEmergency) {
      return {
        type: 'emergency',
        safetyBadge: '🚨 URGENT MEDICAL ADVISORY',
        text: emergencyCheck.response,
        urgentAction: true
      };
    }

    // 2. Diagnostic refusal guardrail
    const diagnosisCheck = this.checkDiagnosticRequest(cleanMsg);
    if (diagnosisCheck.isDiagnostic) {
      return {
        type: 'guardrail_diagnosis',
        safetyBadge: '🛡️ Medical Safety Guardrail — Non-Diagnostic Policy',
        text: diagnosisCheck.response,
        urgentAction: false
      };
    }

    // 3. Prescription & Medication dosage refusal guardrail
    const prescriptionCheck = this.checkPrescriptionRequest(cleanMsg);
    if (prescriptionCheck.isPrescription) {
      return {
        type: 'guardrail_prescription',
        safetyBadge: '🛡️ Safety Guardrail — No Prescriptions or Dosages',
        text: prescriptionCheck.response,
        urgentAction: false
      };
    }

    // 4. Educational health literacy response
    const educationalResponse = this.generateEducationalResponse(cleanMsg);
    return {
      type: 'educational',
      safetyBadge: '💡 Health Literacy & Educational Guidance',
      text: educationalResponse,
      urgentAction: false
    };
  }

  /**
   * Check for emergency symptoms
   */
  checkEmergencySymptoms(text) {
    const lower = text.toLowerCase();
    const emergencyTriggers = [
      'chest pain', 'crushing chest', 'heart attack', 'chest pressure', 
      'difficulty breathing', 'severe shortness of breath', 'can\'t breathe',
      'face drooping', 'arm weakness', 'slurred speech', 'stroke',
      'coughing blood', 'vomiting blood', 'unconscious', 'fainted',
      'sudden loss of vision', 'severe allergic reaction', 'throat closing',
      'anaphylaxis', 'suicidal', 'kill myself', 'severe head injury'
    ];

    for (const trigger of emergencyTriggers) {
      if (lower.includes(trigger)) {
        return {
          isEmergency: true,
          response: `🚨 **IMMEDIATE MEDICAL ATTENTION REQUIRED**

You mentioned symptoms that may indicate a critical medical emergency (such as severe chest pain, acute breathing distress, or neurological warning signs).

**Please take immediate action:**
1. **Call emergency services immediately** (dial **911** in US/Canada, **112** in Europe, **108/112** in India, or your local emergency line).
2. **Go to the nearest emergency department** or ask someone nearby to assist you.
3. **Do not drive yourself** if you feel faint, dizzy, or breathless.
4. **Never delay medical care** to wait for an AI explanation or online response.

*MediBridge AI is strictly an educational tool and cannot handle medical crises.*`
        };
      }
    }

    return { isEmergency: false };
  }

  /**
   * Check if user is asking for a diagnosis
   */
  checkDiagnosticRequest(text) {
    const lower = text.toLowerCase();
    const diagnosticTriggers = [
      'do i have', 'diagnose me', 'what disease do i have', 'what illness is this',
      'is this cancer', 'do i have diabetes', 'tell me if i have', 'diagnose this',
      'what is wrong with me', 'do i have covid', 'is this a tumor'
    ];

    for (const trigger of diagnosticTriggers) {
      if (lower.includes(trigger)) {
        return {
          isDiagnostic: true,
          response: `🛡️ **Medical Safety Notice: Non-Diagnostic Policy**

MediBridge AI **cannot diagnose illnesses, determine diseases, or evaluate personal symptoms**. A proper medical diagnosis requires:
- A comprehensive in-person physical exam
- A review of your medical and family history
- Professional review of lab and diagnostic imaging tests by a licensed physician

**How I can help you safely:**
- I can explain what related medical terms or test results mean in everyday plain language.
- I can explain how the human body works generally.
- I can suggest clear, specific questions you can bring to your next doctor's appointment so you get the most out of your consultation.

*If you are concerned about new or worsening symptoms, please contact your primary healthcare provider.*`
        };
      }
    }

    return { isDiagnostic: false };
  }

  /**
   * Check if user is asking for a prescription or drug dosage
   */
  checkPrescriptionRequest(text) {
    const lower = text.toLowerCase();
    const prescriptionTriggers = [
      'how many mg should i take', 'what dose', 'how much should i take',
      'prescribe me', 'what medicine should i take', 'recommend an antibiotic',
      'can i take both', 'how many pills', 'can i take ibuprofen with',
      'prescribe a drug', 'give me a prescription'
    ];

    for (const trigger of prescriptionTriggers) {
      if (lower.includes(trigger)) {
        return {
          isPrescription: true,
          response: `🛡️ **Prescription Safety Guardrail: No Medication Advice**

MediBridge AI **cannot prescribe medications, adjust dosages, or recommend specific pharmaceutical treatments**.

Safe medication use depends on critical individual medical factors, including:
- Your exact kidney and liver function
- Your current list of prescriptions and supplements (to prevent drug-drug interactions)
- Your allergies, weight, and existing conditions

**What you should do instead:**
- Speak directly with your **licensed doctor** or your **neighborhood pharmacist**. Pharmacists are medication specialists and can answer questions about dosage and drug interactions for free.
- Never adjust prescription doses without your doctor's explicit instruction.

*I am happy to explain what a medication is commonly prescribed for in general, or explain directions written on an existing prescription label.*`
        };
      }
    }

    return { isPrescription: false };
  }

  /**
   * General Educational Responses for Health Literacy
   */
  generateEducationalResponse(text) {
    const lower = text.toLowerCase();

    // Fasting Glucose / Blood Sugar
    if (lower.includes('fasting glucose') || lower.includes('blood sugar') || lower.includes('glucose')) {
      return `🩸 **Understanding Fasting Blood Glucose in Plain English**

**What is it?**
Fasting blood glucose measures the concentration of sugar (glucose) in your bloodstream after you have not eaten for at least 8 to 12 hours (usually overnight).

**Why do doctors check it?**
- **Below 100 mg/dL:** Typically considered within the standard expected range.
- **100 to 125 mg/dL:** Often described as *impaired fasting glucose* or the *prediabetes range*. This means your body is taking slightly longer to move sugar from your blood into your cells.
- **126 mg/dL or higher on two separate tests:** Generally prompts your doctor to evaluate for diabetes.

**Everyday Analogy:**
Think of your blood like a delivery highway, and glucose like the packages of fuel for your muscles. Insulin is the delivery key that unlocks your cells' doors. When cells become slightly resistant to the key, packages linger on the highway a little longer.

**Questions you can ask your doctor:**
1. *"What is my personal target fasting blood sugar number?"*
2. *"Would small daily tweaks, like a 15-minute walk after meals, help improve my body's glucose handling?"*
3. *"Should we also check my HbA1c to see my 3-month average?"*`;
    }

    // High blood pressure / Hypertension
    if (lower.includes('blood pressure') || lower.includes('hypertension')) {
      return `❤️ **Understanding Blood Pressure & Preparing for Your Doctor Visit**

**What do the numbers mean?**
Blood pressure is measured in two numbers (e.g. 120 / 80 mmHg):
- **Systolic (Top number):** The pressure in your arteries when your heart muscle squeezes and pumps blood out.
- **Diastolic (Bottom number):** The pressure in your arteries when your heart relaxes between beats to fill with blood.

**Everyday Analogy:**
Think of your circulatory system like a garden hose. If the faucet is turned on too high for years, the hose walls experience constant stress. Keeping the pressure balanced protects your heart, kidneys, and brain.

**Smart Questions for Your Doctor:**
1. *"What was my blood pressure reading today, and is it where you'd like it to be?"*
2. *"Is a single high reading enough to worry about, or should I track it at home for a week first?"*
3. *"What dietary adjustments (like the low-sodium DASH eating plan) would support my cardiovascular health?"*`;
    }

    // MRI vs CT vs X-Ray
    if (lower.includes('mri') || lower.includes('scan') || lower.includes('x-ray') || lower.includes('imaging')) {
      return `🩻 **Understanding Medical Scans (X-Ray vs CT vs MRI)**

**1. X-Ray:**
- **Best for:** Dense structures like bones, joint spaces, and basic lung airspaces.
- **How it works:** Uses a small, controlled amount of radiation. Dense bones absorb rays and look bright white.

**2. CT Scan (Computed Tomography):**
- **Best for:** Detailed 3D cross-sections of internal organs, blood vessels, and trauma evaluations.
- **How it works:** A rotating X-ray machine takes dozens of slices that a computer stitches into a 3D view.

**3. MRI (Magnetic Resonance Imaging):**
- **Best for:** Soft tissues — brain tissue, spinal cord, ligaments, nerves, and cartilage.
- **How it works:** Uses powerful magnets and radio waves (NO radiation) to create finely detailed images of soft tissues.

**Questions for your doctor before an imaging scan:**
- *"Why is this specific type of scan the best choice for what we are investigating?"*
- *"Do I need to fast or stop any medications beforehand?"*
- *"If contrast dye is needed, will my kidney function be checked first?"*`;
    }

    // Generic vs Brand-name medicines
    if (lower.includes('generic') || lower.includes('brand name') || lower.includes('brand-name')) {
      return `💊 **Generic vs. Brand-Name Medications: What's the Difference?**

**Are they equally effective?**
Yes. By law (FDA and global regulatory bodies), a generic medication must contain the **exact same active pharmaceutical ingredient, strength, dosage form, and route of administration** as the brand-name version.

**What might differ?**
- **Inactive ingredients:** Fillers, colorings, flavorings, or tablet coatings may vary.
- **Appearance:** Size, color, and pill shape may look different because brand trademarks protect pill appearance.
- **Cost:** Generics are generally 80% to 85% less expensive because generic manufacturers didn't have to fund the original 10-year clinical trials.

**Questions for your pharmacist:**
- *"Is there a generic alternative for my prescription that works identically?"*
- *"Are there any inactive ingredients or dyes in this generic that I might be sensitive to?"*`;
    }

    // General default fallback health literacy response
    return `🩺 **Health Literacy Overview**

Thank you for your question about health terminology. 

**Key Principles for Understanding Medical Concepts:**
1. **Clinical Language is Shorthand:** Medical terms often sound scary because they stem from Latin or Greek roots (e.g., "-itis" means irritation or inflammation; "hyper-" means higher; "hypo-" means lower).
2. **Context is Everything:** A lab result or clinical finding is rarely meaningful on its own. Doctors evaluate your numbers alongside your symptoms, energy level, family background, and habits.
3. **Be an Empowered Partner in Your Care:** You always have the right to ask your healthcare provider: *"Could you explain that in plain words?"* and *"What does this mean for my daily life?"*

**Would you like me to:**
- Break down a specific medical term you've heard?
- Explain the purpose of a particular lab test or procedure?
- Help you generate a 5-question checklist to take to your next appointment?

*(Remember: MediBridge AI cannot diagnose illnesses or prescribe treatments.)*`;
  }

  /**
   * Text-to-speech for assistant messages
   */
  speak(text, lang = 'en-US') {
    if (!this.speechSynth) return;
    if (this.speechSynth.speaking) {
      this.speechSynth.cancel();
    }
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = lang;
    this.speechSynth.speak(utterance);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HealthAssistant };
}
