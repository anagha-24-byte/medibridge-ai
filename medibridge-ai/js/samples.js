/**
 * MediBridge AI - Realistic Sample Medical Documents and Glossary
 * Hackathon Prototype Dataset
 */

const SAMPLE_DOCUMENTS = {
  blood_panel: {
    id: "blood_panel",
    title: "Comprehensive Metabolic & Lipid Blood Panel",
    category: "Laboratory Test Report",
    date: "October 04, 2026",
    facility: "Metro General Health Diagnostics",
    rawText: `PATIENT LAB REPORT: COMPREHENSIVE METABOLIC & LIPID PROFILE
Collection Date: 10/04/2026 | Fasting: Yes (12 hours) | Specimen: Serum

TEST NAME                     RESULT        REFERENCE RANGE    STATUS
-------------------------------------------------------------------------
Fasting Serum Glucose         118 mg/dL     70 - 99 mg/dL      HIGH
Hemoglobin A1c (HbA1c)        6.1 %         < 5.7 %            HIGH
Total Cholesterol             238 mg/dL     < 200 mg/dL        HIGH
HDL Cholesterol ("Good")      42 mg/dL      > 40 mg/dL         NORMAL
LDL Cholesterol ("Bad")       158 mg/dL     < 100 mg/dL        HIGH
Serum Triglycerides           192 mg/dL     < 150 mg/dL        HIGH
Serum Creatinine              0.95 mg/dL    0.70 - 1.30 mg/dL  NORMAL
Estimated GFR (eGFR)          88 mL/min     > 60 mL/min        NORMAL
Alanine Aminotransferase(ALT) 48 U/L        7 - 45 U/L         HIGH
Aspartate Aminotransferase    32 U/L        8 - 40 U/L         NORMAL
Total Bilirubin               0.8 mg/dL     0.1 - 1.2 mg/dL    NORMAL

CLINICAL NOTES:
Elevated fasting glucose and HbA1c indicative of impaired fasting glycemia (prediabetes range). 
Moderate hyperlipidemia with elevated LDL and triglycerides. 
Hepatic transaminases reveal mild ALT elevation; consider clinical correlation with BMI, diet, or medications. 
Renal function parameters within expected normal physiological limits.`,
    tags: ["Blood Test", "Cholesterol", "Blood Sugar", "Liver & Kidney"],
    summaryPreview: "Routine blood test showing slightly high blood sugar and cholesterol, with normal kidney function and a mildly elevated liver enzyme."
  },

  radiology_xray: {
    id: "radiology_xray",
    title: "Chest X-Ray Diagnostic Radiology Report",
    category: "Imaging & Radiology",
    date: "September 28, 2026",
    facility: "Valley Imaging Center",
    rawText: `DIAGNOSTIC RADIOLOGY REPORT: CHEST (PA AND LATERAL VIEWS)
Exam Date: 09/28/2026 | Referring Physician: Dr. Sarah Vance, MD

CLINICAL INDICATION:
52-year-old patient with persistent non-productive cough and mild dyspnea on exertion for 3 weeks. Denies hemoptysis or fever.

COMPARISON:
No prior imaging available for comparison.

FINDINGS:
1. Lungs: Clear bilaterally. There is no focal airspace consolidation, lobar collapse, or suspicious pulmonary nodule. 
2. Pleura: No pleural effusion or evidence of pneumothorax.
3. Mediastinum & Heart: Cardiomediastinal silhouette and cardiothoracic ratio are within normal limits. No mediastinal lymphadenopathy.
4. Diaphragm: Both hemidiaphragms demonstrate normal contour and costophrenic angles are sharp. Mild flattening of bilateral hemidiaphragms noted.
5. Osseous Structures: Intact thoracic skeleton with mild degenerative spondylosis of the mid-thoracic spine, non-acute.

IMPRESSION:
1. No acute cardiopulmonary abnormality or pneumonia identified.
2. Mild hyperinflation and diaphragmatic flattening may correlate with early or mild reactive airway changes / smoking history. 
Clinical correlation recommended.`,
    tags: ["X-Ray", "Lungs", "Chest", "Radiology"],
    summaryPreview: "Chest imaging report showing no pneumonia, no fluid, and a normal heart size, with mild signs of airway irritation."
  },

  discharge_summary: {
    id: "discharge_summary",
    title: "Hospital Discharge Summary & Plan",
    category: "Clinical Inpatient Summary",
    date: "October 02, 2026",
    facility: "St. Jude Community Hospital",
    rawText: `HOSPITAL DISCHARGE SUMMARY
Admission Date: 09/30/2026 | Discharge Date: 10/02/2026
Attending Physician: Dr. K. Patel, MD, Internal Medicine

PRIMARY DISCHARGE DIAGNOSES:
1. Essential Hypertension, uncontrolled on admission, now stabilized
2. Type 2 Diabetes Mellitus with mild sensory peripheral neuropathy
3. Mild Dehydration (resolved)

HOSPITAL COURSE SUMMARY:
Patient presented to ED with cephalea and systolic BP of 178/96 mmHg. IV saline hydration and oral antihypertensive medication titration initiated. Serum electrolytes stabilized. Blood pressure at discharge improved to 126/82 mmHg. Patient ambulating comfortably without assistance.

DISCHARGE MEDICATIONS:
- Lisinopril 10 mg PO once daily (q.a.m.)
- Metformin 500 mg PO twice daily (b.i.d.) with meals
- Aspirin 81 mg PO once daily (q.d.)

DISCHARGE INSTRUCTIONS & DIET:
- Adhere strictly to low-sodium (<2,000 mg/day) DASH diet.
- Self-monitor blood pressure daily in the morning and maintain a written log.
- Check capillary blood glucose before breakfast and 2 hours postprandial.
- Avoid walking barefoot due to reduced peripheral sensation.
- Follow up with Primary Care Physician (PCP) within 7–10 days.

URGENT RETURN PRECAUTIONS:
Return to ED or seek immediate emergency care if experiencing chest pressure, acute dyspnea, facial numbness, sudden visual disturbances, or systolic BP exceeding 180 mmHg.`,
    tags: ["Discharge", "Hypertension", "Diabetes", "Medications"],
    summaryPreview: "Hospital summary explaining that high blood pressure and dehydration have been stabilized, with clear daily home care and medication steps."
  },

  prescription_guide: {
    id: "prescription_guide",
    title: "Outpatient Prescription & Pharmacy Directions",
    category: "Pharmacy Label & Prescription",
    date: "October 06, 2026",
    facility: "CareFirst Outpatient Pharmacy",
    rawText: `OUTPATIENT PRESCRIPTION INSTRUCTIONS
Prescribed for: Acute Maxillary Sinusitis | Prescriber: Dr. Elena Rostova

Rx 1: AMOXICILLIN-CLAVULANATE (Augmentin) 875 mg / 125 mg Oral Tablet
SIG: Take 1 tablet by mouth (PO) every 12 hours (b.i.d.) with a meal or snack for 10 days.
Quantity: 20 Tablets | Refills: 0
INSTRUCTIONS: 
- Take with food to minimize gastrointestinal upset or nausea.
- Complete the full 10-day course even if your symptoms improve sooner. Stopping early may cause bacteria to return.
- Stay well hydrated throughout the treatment course.

Rx 2: FLUTICASONE PROPIONATE 50 mcg/actuation Nasal Spray
SIG: 2 sprays in each nostril once daily (q.d.) in the morning.
Quantity: 1 bottle (16 g) | Refills: 2
INSTRUCTIONS:
- Blow nose gently before using. Shake gently. Aim slightly outward away from the center of your nasal septum.

SAFETY & ALLERGY WARNING:
Seek emergency medical attention immediately if you experience hives (urticaria), facial or lip swelling (angioedema), or difficulty breathing. Contact your prescribing physician if severe watery diarrhea develops.`,
    tags: ["Prescription", "Antibiotics", "Medication Guide", "Pharmacy"],
    summaryPreview: "Prescription directions for an antibiotic and nasal spray, detailing how to take them with meals and what warning signs to watch for."
  }
};

/**
 * Glossary of clinical terms for instant lookup & search
 */
const MEDICAL_GLOSSARY = [
  {
    term: "Hypertension",
    category: "Cardiovascular",
    simpleName: "High Blood Pressure",
    meaning: "The force of blood pushing against the walls of your blood vessels is consistently too high.",
    analogy: "Imagine a garden hose with water turned on too high for too long — over time, the extra pressure puts strain on the hose and the pump (your heart).",
    whyChecked: "Doctors check blood pressure because untreated high pressure can quietly damage your heart, kidneys, and brain over many years without obvious symptoms.",
    doctorQuestions: [
      "What is my target blood pressure number?",
      "Can lifestyle changes like reducing salt help, or do I need medicine?",
      "How often should I check my pressure at home?"
    ]
  },
  {
    term: "Benign Prostatic Hyperplasia (BPH)",
    category: "Urology",
    simpleName: "Non-Cancerous Enlarged Prostate",
    meaning: "'Benign' means not cancerous. The prostate gland simply gets larger as men age, which can press against the urinary tube.",
    analogy: "Like a garden hose being gently pinched from the outside by a growing plant, making water flow slower or harder to start.",
    whyChecked: "Doctors check this to make sure urinary symptoms (like waking up frequently at night to urinate) are managed comfortably and not caused by infection or other conditions.",
    doctorQuestions: [
      "Are my symptoms mild enough for lifestyle changes, or do I need treatment?",
      "Could any over-the-counter medicines worsen my symptoms?",
      "When should I schedule my next check-up?"
    ]
  },
  {
    term: "Myocardial Infarction",
    category: "Cardiovascular",
    simpleName: "Heart Attack",
    meaning: "Part of the heart muscle does not get enough oxygen-rich blood, usually because a blood vessel supplying it becomes blocked.",
    analogy: "Like a fuel line to an engine getting clogged — without fuel, the engine stops running properly.",
    whyChecked: "Emergency identification and prevention are critical to protect heart muscle health.",
    doctorQuestions: [
      "What steps can I take to protect my heart health?",
      "What are the emergency warning signs I should teach my family?",
      "What cardiac rehabilitation or exercise routine is safe for me?"
    ]
  },
  {
    term: "Dyspnea on Exertion",
    category: "Respiratory",
    simpleName: "Shortness of Breath During Activity",
    meaning: "Feeling out of breath or struggling to breathe when doing physical activities like walking up stairs or carrying groceries.",
    analogy: "Feeling winded like you just sprinted a race, even though you only walked across the room.",
    whyChecked: "Helps doctors determine if the heart, lungs, or red blood cells (oxygen carriers) need evaluation or support.",
    doctorQuestions: [
      "Could my shortness of breath be related to my heart, lungs, or stamina?",
      "What safe activity level do you recommend?",
      "At what point should I call the clinic or seek urgent care?"
    ]
  },
  {
    term: "Atherosclerosis",
    category: "Cardiovascular",
    simpleName: "Hardening or Clogging of Arteries",
    meaning: "Fats, cholesterol, and other substances form sticky plaques on the inner walls of your arteries, making them narrower and stiffer.",
    analogy: "Like old plumbing pipes getting coated with mineral buildup and rust on the inside, slowing down water flow.",
    whyChecked: "Detecting risk factors early allows doctors and patients to prevent heart attacks or strokes through diet, exercise, and targeted medications.",
    doctorQuestions: [
      "What do my cholesterol and calcium numbers mean for my blood vessels?",
      "What foods help keep artery walls healthy?",
      "Do I need any specialized cardiovascular screening?"
    ]
  },
  {
    term: "eGFR (Estimated Glomerular Filtration Rate)",
    category: "Kidney Function",
    simpleName: "Kidney Filtering Score",
    meaning: "A blood test calculation that estimates how well your kidneys are filtering waste products from your blood each minute.",
    analogy: "Think of your kidneys as coffee filters. The eGFR is the efficiency score of how quickly and cleanly the filters are working.",
    whyChecked: "A number above 60 is generally considered good. Monitoring eGFR helps catch kidney stress early before you feel any physical symptoms.",
    doctorQuestions: [
      "Is my kidney filtering score stable compared to previous tests?",
      "Are any of my current medications tough on the kidneys?",
      "How much water should I be drinking each day?"
    ]
  },
  {
    term: "HbA1c (Hemoglobin A1c)",
    category: "Endocrinology / Diabetes",
    simpleName: "3-Month Blood Sugar Average",
    meaning: "A test measuring what percentage of your red blood cells are coated with sugar, giving a reliable picture of your average blood sugar over the last 90 days.",
    analogy: "A daily finger-prick is like taking a single photograph of the weather today, while the HbA1c is a 3-month weather report video.",
    whyChecked: "Standard diagnostic and monitoring test for diabetes and prediabetes. Normal is below 5.7%; 5.7% to 6.4% indicates prediabetes; 6.5% or above indicates diabetes.",
    doctorQuestions: [
      "What is my personal target HbA1c range?",
      "What daily dietary swaps can help bring this number down?",
      "When should we re-test to see my progress?"
    ]
  },
  {
    term: "Neuropathy",
    category: "Neurology",
    simpleName: "Nerve Irritation or Nerve Damage",
    meaning: "Damage or irritation to peripheral nerves outside the brain and spine, frequently causing tingling, numbness, burning, or pins-and-needles in feet or hands.",
    analogy: "Like a telephone wire with a frayed coating — signals get static, delayed, or misunderstood by your brain.",
    whyChecked: "Common complication of prolonged high blood sugar or vitamin deficiencies; checking allows early protective foot care to prevent unnoticed injuries.",
    doctorQuestions: [
      "What is the underlying cause of my nerve symptoms?",
      "What steps should I take daily to protect my feet from cuts or blisters?",
      "Are there supportive therapies or vitamins that could help?"
    ]
  },
  {
    term: "Alanine Aminotransferase (ALT)",
    category: "Liver Function",
    simpleName: "Liver Enzyme Health Marker",
    meaning: "An enzyme found mainly inside liver cells. When liver cells are stressed or irritated, they release extra ALT into the bloodstream.",
    analogy: "Like a smoke detector in a kitchen — a small chirp means the liver is working under some stress, not necessarily that the house is on fire.",
    whyChecked: "Checked during blood tests to evaluate liver health. Mild rises can be caused by medications, alcohol, fatty liver, or intense workouts.",
    doctorQuestions: [
      "Could any medication, supplement, or recent illness have caused this slight increase?",
      "Do I need an ultrasound or a repeat blood test in a few weeks?",
      "What lifestyle changes best support liver health?"
    ]
  },
  {
    term: "Gastroesophageal Reflux Disease (GERD)",
    category: "Gastroenterology",
    simpleName: "Chronic Acid Reflux / Heartburn",
    meaning: "Stomach acid repeatedly flows backward into the esophagus (the tube connecting your mouth and stomach) because the muscular valve does not close tightly.",
    analogy: "Like a one-way valve on a water bottle that leaks when tilted, allowing acidic liquid to splash up where it doesn't belong.",
    whyChecked: "Doctors check and manage GERD to relieve discomfort, protect esophageal tissue, and prevent sleep disruptions.",
    doctorQuestions: [
      "Which foods or meal timings trigger acid backflow most often?",
      "Should I elevate the head of my bed at night?",
      "Are antacids suitable for short-term or long-term use in my case?"
    ]
  },
  {
    term: "Postprandial Hyperglycemia",
    category: "Metabolism",
    simpleName: "High Blood Sugar After Eating",
    meaning: "'Postprandial' means after a meal, and 'hyperglycemia' means high blood sugar. It refers to blood glucose spiking above normal levels after eating.",
    analogy: "Like a sudden surge of traffic entering a highway all at once because the toll booths (insulin) are processing cars too slowly.",
    whyChecked: "Helps tailor meal plans, carbohydrate intake, and diabetes medications so sugar levels remain steady throughout the day.",
    doctorQuestions: [
      "What should my target blood sugar be two hours after meals?",
      "Would a gentle walk after dinner help lower this spike?",
      "Do I need to adjust the timing of my meals or medications?"
    ]
  },
  {
    term: "Pleural Effusion",
    category: "Pulmonary",
    simpleName: "Fluid Around the Lungs",
    meaning: "An unusual buildup of fluid in the thin space (pleural cavity) between the outer surface of the lungs and the inner chest wall.",
    analogy: "Like a water balloon trapped between two layers of plastic wrap surrounding a sponge — the fluid takes up room, making it harder for the sponge to expand.",
    whyChecked: "Checked on chest X-rays to understand shortness of breath or follow up on infections, heart conditions, or inflammation.",
    doctorQuestions: [
      "What is causing fluid to collect around my lungs?",
      "Does the fluid need to be drained or treated with medication?",
      "What breathing exercises or positions are safe for me?"
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SAMPLE_DOCUMENTS, MEDICAL_GLOSSARY };
}
