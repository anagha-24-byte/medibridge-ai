/**
 * MediBridge AI - Realistic Sample Medical Documents and Clinical Glossary
 * Comprehensive dataset covering 70+ major clinical terms, lab tests, and procedures
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
 * Expansive clinical glossary with 70+ terms
 */
const MEDICAL_GLOSSARY = [
  // Cardiovascular
  {
    term: "Hypertension",
    category: "Cardiovascular",
    simpleName: "High Blood Pressure",
    meaning: "The force of blood pushing outward against your blood vessel walls is consistently higher than healthy target levels.",
    analogy: "Imagine a garden hose with the water turned on too high for too long — over time, the extra pressure puts strain on the hose and the pump (your heart).",
    whyChecked: "Doctors check blood pressure because untreated high pressure can quietly damage your heart, kidneys, and blood vessels over many years without causing obvious early symptoms.",
    doctorQuestions: [
      "What is my personal target blood pressure reading?",
      "Can lifestyle changes like reducing salt help, or do I need medicine?",
      "How often should I measure my blood pressure at home?"
    ]
  },
  {
    term: "Hypotension",
    category: "Cardiovascular",
    simpleName: "Low Blood Pressure",
    meaning: "The pressure of blood circulating through your body is lower than usual, which can sometimes reduce blood flow to the brain and make you feel lightheaded.",
    analogy: "Like low water pressure in a garden hose — water still trickles through, but it may struggle to reach the top flowers on a tall trellis.",
    whyChecked: "Doctors check this to ensure your brain and organs are receiving enough oxygen-rich blood, especially when standing up quickly.",
    doctorQuestions: [
      "Are my dizzy spells related to low blood pressure when I stand up?",
      "Should I increase my water or fluid intake?",
      "Could any of my current medications be lowering my pressure too much?"
    ]
  },
  {
    term: "Tachycardia",
    category: "Cardiovascular",
    simpleName: "Fast Heart Rate (Over 100 Beats Per Minute)",
    meaning: "Your heart is beating significantly faster than the normal resting rate of 60 to 100 beats per minute.",
    analogy: "Like a car engine idling at high RPMs at a red light — it's working hard and using fuel quickly even when you aren't moving.",
    whyChecked: "Doctors check this because a fast heart rate can be caused by simple things like fever, caffeine, or dehydration, or by heart rhythm irregularities.",
    doctorQuestions: [
      "What is the most likely cause of my rapid heartbeat?",
      "Should I wear a Holter monitor to record my rhythm for 24 hours?",
      "What should I do if my heart suddenly starts racing at home?"
    ]
  },
  {
    term: "Bradycardia",
    category: "Cardiovascular",
    simpleName: "Slow Heart Rate (Under 60 Beats Per Minute)",
    meaning: "Your heart is beating slower than 60 beats per minute at rest.",
    analogy: "Like a bicycle pedaling in low gear — completely normal for well-trained athletes, but if you feel tired or dizzy, the bicycle might be moving too slowly.",
    whyChecked: "Doctors check if your brain is receiving enough blood flow, or if medications (like beta-blockers) are slowing the heart too much.",
    doctorQuestions: [
      "Is my slow heart rate safe for my current activity level?",
      "Could my medications be causing this slow pace?",
      "What symptoms would indicate that my heart rate is too low?"
    ]
  },
  {
    term: "Myocardial Infarction",
    category: "Cardiovascular",
    simpleName: "Heart Attack",
    meaning: "A sudden blockage in a coronary artery prevents oxygen-rich blood from reaching part of the heart muscle.",
    analogy: "Like a fuel line to an engine getting completely clogged — without fuel, that part of the engine stops running.",
    whyChecked: "Immediate medical identification and long-term prevention are vital to protect the heart muscle and save lives.",
    doctorQuestions: [
      "What steps can I take today to protect my cardiovascular health?",
      "What are the emergency warning signs my family should watch for?",
      "What physical activities and exercise are safe for my heart?"
    ]
  },
  {
    term: "Atherosclerosis",
    category: "Cardiovascular",
    simpleName: "Hardening or Clogging of Arteries",
    meaning: "Fats, cholesterol, and calcium build up into sticky plaques along the inner lining of your arteries, making them stiffer and narrower.",
    analogy: "Like mineral scale and rust gradually accumulating inside old metal plumbing pipes, reducing water flow.",
    whyChecked: "Catching plaque buildup early allows lifestyle changes and cholesterol medications to keep blood flowing smoothly.",
    doctorQuestions: [
      "What do my cholesterol and calcium numbers mean for my blood vessels?",
      "What dietary choices help prevent plaque buildup?",
      "Do I need an imaging test to check my artery health?"
    ]
  },
  {
    term: "Arrhythmia",
    category: "Cardiovascular",
    simpleName: "Irregular Heart Rhythm",
    meaning: "The electrical impulses that coordinate your heartbeats are not firing properly, causing it to beat too fast, too slow, or unevenly.",
    analogy: "Like a drummer playing out of tempo — sometimes skipping a beat or rushing ahead of the music.",
    whyChecked: "Doctors check rhythms with an ECG to ensure blood is pumped efficiently and to reduce the risk of blood clots.",
    doctorQuestions: [
      "What specific type of arrhythmia do I have (e.g. atrial fibrillation)?",
      "Do I need blood-thinning medication to prevent clots?",
      "What triggers, like stress or caffeine, should I avoid?"
    ]
  },
  {
    term: "Cardiomegaly",
    category: "Cardiovascular",
    simpleName: "Enlarged Heart",
    meaning: "The heart has grown larger than its normal size, usually because it has been working against chronic high pressure or weakened valves.",
    analogy: "Like an arm muscle getting thicker and heavier from lifting heavy weights every day — but in the heart, extra thickness makes it harder to pump flexibly.",
    whyChecked: "Seen on chest X-rays or echocardiograms to evaluate how hard the heart has been working over time.",
    doctorQuestions: [
      "What is causing my heart to work harder than normal?",
      "Is this enlargement treatable with blood pressure medication?",
      "What safe activity levels do you recommend?"
    ]
  },
  {
    term: "Ischemia",
    category: "Cardiovascular",
    simpleName: "Reduced Blood Flow and Oxygen",
    meaning: "An organ or muscle tissue is not receiving enough oxygenated blood, usually due to a narrowed or partially blocked blood vessel.",
    analogy: "Like kinking a garden hose so only a slow trickle of water reaches thirsty garden plants.",
    whyChecked: "Doctors investigate ischemia because restoring blood flow early prevents permanent tissue injury.",
    doctorQuestions: [
      "Which part of my body is experiencing reduced blood flow?",
      "Can this be improved with medication or do I need a procedure?",
      "What symptoms indicate I should seek emergency care?"
    ]
  },

  // Respiratory
  {
    term: "Dyspnea on Exertion",
    category: "Respiratory",
    simpleName: "Shortness of Breath During Activity",
    meaning: "Feeling breathless or struggling for air when performing routine physical movements like climbing stairs or carrying groceries.",
    analogy: "Feeling completely winded as if you just finished a sprint, even though you only walked across the room.",
    whyChecked: "Helps doctors determine whether the heart, lungs, or oxygen-carrying red blood cells need supportive treatment.",
    doctorQuestions: [
      "Is my breathlessness coming from my heart, my lungs, or my fitness level?",
      "Would a lung function test (spirometry) help diagnose the cause?",
      "What safe level of daily exercise should I aim for?"
    ]
  },
  {
    term: "Pneumonia",
    category: "Respiratory",
    simpleName: "Lung Infection",
    meaning: "An infection (viral or bacterial) causes the tiny air sacs (alveoli) in one or both lungs to become inflamed and fill with fluid or mucus.",
    analogy: "Like a kitchen sponge getting soaked with murky water instead of holding clean air.",
    whyChecked: "Doctors check chest X-rays to distinguish between a simple cold, bronchitis, and pneumonia to prescribe appropriate antibiotic or supportive care.",
    doctorQuestions: [
      "Is my pneumonia bacterial or viral?",
      "How many weeks should I expect it to take before my energy fully returns?",
      "Should I get the pneumonia vaccine once I recover?"
    ]
  },
  {
    term: "Asthma",
    category: "Respiratory",
    simpleName: "Chronic Airway Swelling and Spasm",
    meaning: "A chronic condition where breathing airways become inflamed, swollen, and narrow, often producing extra mucus in response to triggers.",
    analogy: "Like trying to breathe through a narrow coffee stirrer straw instead of a wide drinking straw.",
    whyChecked: "Proper inhaler treatment prevents sudden asthma attacks and keeps daily lung function strong.",
    doctorQuestions: [
      "What is the difference between my daily controller inhaler and my quick-relief inhaler?",
      "What environmental triggers should I watch out for?",
      "Do I have an up-to-date Asthma Action Plan?"
    ]
  },
  {
    term: "Pleural Effusion",
    category: "Respiratory",
    simpleName: "Fluid Around the Lungs",
    meaning: "An unusual buildup of fluid in the thin protective space between the outside of your lungs and your chest wall.",
    analogy: "Like a water balloon trapped between two sheets of plastic wrap surrounding a sponge — it takes up space and stops the sponge from expanding.",
    whyChecked: "Checked on chest X-rays to understand shortness of breath or follow up on heart failure, infections, or inflammation.",
    doctorQuestions: [
      "What underlying issue caused fluid to accumulate around my lungs?",
      "Does this fluid need to be drained or treated with medication?",
      "What sleeping positions will help me breathe more comfortably?"
    ]
  },
  {
    term: "Atelectasis",
    category: "Respiratory",
    simpleName: "Partial Lung Collapse / Air Sac Deflation",
    meaning: "A small section of the lung's tiny air sacs (alveoli) deflates or fails to expand fully, very common after surgery or shallow breathing.",
    analogy: "Like a cluster of small party balloons that didn't get puffed up all the way.",
    whyChecked: "Very common on hospital X-rays; deep breathing exercises and spirometry help pop the air sacs back open.",
    doctorQuestions: [
      "What deep-breathing exercises should I practice each hour?",
      "How often should I use the incentive spirometer breathing device?",
      "Will this resolve on its own as I walk around more?"
    ]
  },
  {
    term: "Chronic Obstructive Pulmonary Disease (COPD)",
    category: "Respiratory",
    simpleName: "Chronic Airflow Limitation",
    meaning: "A progressive lung condition (including chronic bronchitis and emphysema) that makes it difficult to empty air completely from the lungs.",
    analogy: "Like an old accordion that has lost some of its springiness — it's easy to pull air in, but takes extra effort to push it back out.",
    whyChecked: "Helps doctors tailor maintenance inhalers and pulmonary rehab to protect daily stamina.",
    doctorQuestions: [
      "What stage is my COPD, and how can we prevent flare-ups?",
      "Would pulmonary rehabilitation therapy help my walking endurance?",
      "Are there breathing techniques (like pursed-lip breathing) I should practice?"
    ]
  },

  // Metabolic & Diabetes
  {
    term: "HbA1c (Hemoglobin A1c)",
    category: "Endocrinology / Diabetes",
    simpleName: "3-Month Blood Sugar Average",
    meaning: "A test measuring what percentage of your red blood cells are coated with glucose, giving a clear picture of your average blood sugar over the past 90 days.",
    analogy: "A daily finger-prick test is like taking a snapshot of today's weather, while the HbA1c is a 3-month seasonal climate report.",
    whyChecked: "Standard test for diabetes: normal is below 5.7%; 5.7% to 6.4% indicates prediabetes; 6.5% or above indicates diabetes.",
    doctorQuestions: [
      "What is my personal target HbA1c number?",
      "What daily dietary swaps can help bring this number down?",
      "When should we re-test to check my progress?"
    ]
  },
  {
    term: "Postprandial Hyperglycemia",
    category: "Metabolism",
    simpleName: "High Blood Sugar After Eating",
    meaning: "Blood glucose rising significantly above target levels after consuming a meal, especially meals high in simple carbohydrates.",
    analogy: "Like a sudden rush of traffic entering a highway all at once because the toll booths (insulin) are processing cars too slowly.",
    whyChecked: "Helps tailor meal plans and medication timing so sugar levels remain steady throughout the day.",
    doctorQuestions: [
      "What should my target sugar level be 2 hours after meals?",
      "Would a gentle 15-minute walk after dinner help reduce this spike?",
      "Should I adjust the timing of my mealtime medications?"
    ]
  },
  {
    term: "Hypoglycemia",
    category: "Metabolism",
    simpleName: "Low Blood Sugar",
    meaning: "Blood sugar drops below healthy levels (typically under 70 mg/dL), causing shakiness, sweating, dizziness, confusion, or hunger.",
    analogy: "Like a smartphone battery dropping into the red 1% zone — apps slow down and the screen dims until it is plugged in.",
    whyChecked: "Important for patients on insulin or diabetes pills to recognize and treat promptly with fast-acting carbohydrates.",
    doctorQuestions: [
      "What fast-acting snacks should I carry with me in case of low sugar?",
      "Do we need to adjust my medication doses to prevent low sugar episodes?",
      "Should I teach my family how to use a rescue glucagon kit?"
    ]
  },
  {
    term: "Hyperlipidemia",
    category: "Metabolism",
    simpleName: "High Blood Fats & Cholesterol",
    meaning: "Elevated levels of fats (lipids), such as LDL cholesterol and triglycerides, circulating in your bloodstream.",
    analogy: "Like cooking broth that has too much grease floating on the surface — over time, the grease sticks to the sides of the pot.",
    whyChecked: "Lowering excess blood fats protects arteries from narrowing and significantly reduces heart attack risk.",
    doctorQuestions: [
      "Which specific fat levels (LDL or triglycerides) need the most attention?",
      "What foods should I increase or limit to improve my lipid panel?",
      "Do you recommend starting a cholesterol-lowering medication (statin)?"
    ]
  },

  // Renal & Urology
  {
    term: "eGFR (Estimated Glomerular Filtration Rate)",
    category: "Kidney Function",
    simpleName: "Kidney Filtering Efficiency Score",
    meaning: "A calculation based on blood creatinine that estimates how many milliliters of blood your kidneys are filtering clean each minute.",
    analogy: "Think of your kidneys as coffee filters. The eGFR is the efficiency score of how quickly and cleanly the filters are running.",
    whyChecked: "A number above 60 is generally considered good. Monitoring eGFR catches kidney stress early before you feel physical symptoms.",
    doctorQuestions: [
      "Is my kidney filtering score stable compared to last year's tests?",
      "Are any of my current prescriptions or over-the-counter painkillers (like NSAIDs) tough on the kidneys?",
      "How much water should I drink each day to support kidney health?"
    ]
  },
  {
    term: "Creatinine",
    category: "Kidney Function",
    simpleName: "Muscle Waste Kidney Marker",
    meaning: "A natural waste byproduct from normal muscle breakdown that healthy kidneys continuously filter out into your urine.",
    analogy: "Like household trash accumulating on the curb — if the trash piles up in the blood, the garbage truck (kidneys) is running behind schedule.",
    whyChecked: "Higher blood creatinine levels tell doctors that kidneys may be under strain or dehydration is present.",
    doctorQuestions: [
      "Could dehydration have contributed to this creatinine reading?",
      "What is my baseline creatinine level over the past few years?",
      "Do I need to adjust any medication doses based on this number?"
    ]
  },
  {
    term: "Benign Prostatic Hyperplasia (BPH)",
    category: "Urology",
    simpleName: "Non-Cancerous Enlarged Prostate",
    meaning: "The prostate gland naturally increases in size as men age. 'Benign' means it is not cancer, but it can gently pinch the urinary tube.",
    analogy: "Like a garden hose being gently squeezed from the outside by a growing plant, making water flow slower or harder to start.",
    whyChecked: "Checked to ensure nighttime urination frequency and urinary flow are managed comfortably and safely.",
    doctorQuestions: [
      "Are my symptoms mild enough for lifestyle changes, or do I need medication?",
      "Could any common cold or allergy medicines worsen my symptoms?",
      "When should I schedule my next prostate checkup?"
    ]
  },
  {
    term: "Proteinuria",
    category: "Kidney Function",
    simpleName: "Protein in the Urine",
    meaning: "Kidney filters are allowing tiny protein molecules (like albumin) to leak into the urine instead of keeping them in the blood.",
    analogy: "Like a kitchen strainer whose holes have stretched slightly, letting small pasta grains slip into the sink.",
    whyChecked: "An early sensitive indicator of kidney strain from high blood pressure or diabetes, treatable with kidney-protective medications.",
    doctorQuestions: [
      "Is the protein leak mild or significant?",
      "Would a blood pressure medication (like an ACE inhibitor) protect my kidneys from further leakage?",
      "Should we recheck with a 24-hour urine collection or spot test?"
    ]
  },

  // Hepatic & GI
  {
    term: "Alanine Aminotransferase (ALT)",
    category: "Liver Function",
    simpleName: "Liver Cell Health Enzyme",
    meaning: "An enzyme found mainly inside liver cells. When liver cells experience irritation or strain, they release extra ALT into the bloodstream.",
    analogy: "Like a smoke detector in a kitchen — a small chirp means the liver is working under some stress, not necessarily that there is an emergency.",
    whyChecked: "Mild elevations are very common from medications, diet, alcohol, fatty liver, or intense workouts.",
    doctorQuestions: [
      "Could any supplement or medication I take have caused this mild increase?",
      "Do I need an ultrasound or a follow-up test in a few months?",
      "What lifestyle changes best support liver health?"
    ]
  },
  {
    term: "Gastroesophageal Reflux Disease (GERD)",
    category: "Gastroenterology",
    simpleName: "Chronic Acid Reflux / Heartburn",
    meaning: "Stomach acid repeatedly washes backward into the esophagus (food pipe) because the muscular valve at the bottom of the pipe doesn't seal tightly.",
    analogy: "Like a one-way valve on a water bottle that leaks when tilted, allowing acidic liquid to splash up where it doesn't belong.",
    whyChecked: "Doctors treat GERD to relieve chest burning, protect esophageal tissue, and improve sleep quality.",
    doctorQuestions: [
      "Which foods or meal timings trigger acid backflow most often?",
      "Should I elevate the head of my bed at night?",
      "Are antacids suitable for short-term or long-term use in my case?"
    ]
  },
  {
    term: "Gastritis",
    category: "Gastroenterology",
    simpleName: "Stomach Lining Inflammation",
    meaning: "The protective mucus-lined stomach wall becomes irritated, inflamed, or eroded by acid, infection (H. pylori), or pain relievers.",
    analogy: "Like having a raw patch of sunburn on your skin, but located inside the inner wall of your stomach.",
    whyChecked: "Treating gastritis relieves upper belly ache, nausea, and prevents stomach ulcers from forming.",
    doctorQuestions: [
      "Should I be tested for H. pylori stomach bacteria?",
      "Should I stop taking aspirin or ibuprofen (NSAIDs)?",
      "What gentle foods should I eat while my stomach lining heals?"
    ]
  },
  {
    term: "Endoscopy",
    category: "Gastroenterology",
    simpleName: "Upper Digestive Camera Exam",
    meaning: "A procedure where a specialist gently passes a thin, flexible tube with a tiny light and camera down your throat to inspect the esophagus, stomach, and duodenum.",
    analogy: "Like sending a miniature camera on a flexible cable down a plumbing pipe to see exactly what is causing a leak or blockage.",
    whyChecked: "Allows doctors to directly visualize stomach irritation, ulcers, or reflux damage and take tiny painless tissue samples (biopsies).",
    doctorQuestions: [
      "Will I be asleep or sedated during the procedure?",
      "How many hours before the exam must I stop eating and drinking?",
      "When will I receive the findings and biopsy results?"
    ]
  },

  // Hematology & Oncology
  {
    term: "Anemia",
    category: "Hematology",
    simpleName: "Low Red Blood Cell Count",
    meaning: "Your blood has fewer red blood cells or lower hemoglobin than normal, meaning less oxygen is carried to your muscles and brain.",
    analogy: "Like having fewer delivery trucks on the road — packages (oxygen) take longer to reach all the homes in town, leaving you feeling tired.",
    whyChecked: "Explains fatigue, pale skin, cold hands, or dizziness; often caused by low iron, vitamin B12 deficiency, or blood loss.",
    doctorQuestions: [
      "What is causing my low red blood cell count (iron deficiency, vitamins, or something else)?",
      "Do I need an iron supplement, and how should I take it to avoid stomach upset?",
      "When should we recheck my blood counts?"
    ]
  },
  {
    term: "Thrombocytopenia",
    category: "Hematology",
    simpleName: "Low Blood Platelet Count",
    meaning: "A lower-than-normal number of platelets (the tiny cell fragments that stick together to form blood clots and stop bleeding).",
    analogy: "Like having fewer construction workers on duty to patch a leak in a dam — small cuts take longer to stop bleeding, and bruises form more easily.",
    whyChecked: "Doctors monitor platelets to ensure blood can clot safely before surgeries or when investigating easy bruising.",
    doctorQuestions: [
      "How low are my platelets compared to the normal range?",
      "Are there activities or medications (like aspirin) I should avoid to prevent bleeding?",
      "What signs of bleeding or unusual petechiae (pinpoint red spots) should I watch for?"
    ]
  },
  {
    term: "Biopsy",
    category: "Diagnostics / Pathology",
    simpleName: "Tissue Sample Examination",
    meaning: "A procedure where a doctor removes a tiny piece of tissue or fluid so a pathologist can examine the cells under a high-power microscope.",
    analogy: "Like taking a tiny pinch of soil from a large garden to test in a lab to find out exactly what minerals or nutrients are in the ground.",
    whyChecked: "The gold-standard diagnostic tool to determine whether an abnormal lump is harmless (benign) or requires targeted treatment (malignant).",
    doctorQuestions: [
      "How long will it take for the pathology lab to return the results?",
      "How was the sample collected, and how should I care for the site?",
      "Will we schedule an appointment to review the written pathology report together?"
    ]
  },
  {
    term: "Benign",
    category: "Pathology / Oncology",
    simpleName: "Non-Cancerous and Not Spreading",
    meaning: "A growth, tumor, or lump that is not cancer. It will not spread to other organs or invade surrounding tissues.",
    analogy: "Like an innocent freckle or mole — it may be present, but it stays where it is and won't attack neighboring skin.",
    whyChecked: "Provides reassuring confirmation that a lump or growth is safe, though it may occasionally be removed if it presses on a nerve.",
    doctorQuestions: [
      "Does this benign growth need to be removed or just monitored?",
      "Could it grow larger over time or cause physical symptoms?",
      "How often should we check it?"
    ]
  },
  {
    term: "Malignant",
    category: "Oncology",
    simpleName: "Cancerous Tissue",
    meaning: "Cells that are abnormal, divide uncontrollably, and have the potential to invade nearby tissues or spread throughout the body.",
    analogy: "Like invasive weeds in a flower bed that spread aggressive roots unless cleared out and treated.",
    whyChecked: "Accurate staging allows oncology teams to plan surgery, radiation, or targeted medications early.",
    doctorQuestions: [
      "What is the specific cell type and stage of this condition?",
      "What treatment options (surgery, medication, radiation) do you recommend?",
      "What is the timeline for starting our treatment plan?"
    ]
  },
  {
    term: "Metastasis",
    category: "Oncology",
    simpleName: "Spread to Other Areas",
    meaning: "Cancer cells have traveled from the original primary site where they started to another distant area of the body via blood or lymph vessels.",
    analogy: "Like dandelion seeds carried on the wind to take root in another corner of the lawn.",
    whyChecked: "Identified with PET or CT scans to guide full-body systemic therapies rather than localized surgery alone.",
    doctorQuestions: [
      "Where has the condition spread, and how does that change our treatment approach?",
      "What systemic therapies (like immunotherapy or targeted drugs) are available?",
      "What symptoms should I report to your team immediately?"
    ]
  },

  // Neurology
  {
    term: "Neuropathy",
    category: "Neurology",
    simpleName: "Peripheral Nerve Irritation / Numbness",
    meaning: "Damage or irritation to nerves outside the brain and spinal cord, often causing tingling, burning, numbness, or weakness in feet and hands.",
    analogy: "Like an electrical cord with frayed insulation — the signals can get fuzzy, static, or misinterpreted by the brain.",
    whyChecked: "Common in diabetes or vitamin deficiencies; catching it allows protective foot care to prevent unnoticed cuts or blisters.",
    doctorQuestions: [
      "What is the underlying cause of my nerve symptoms?",
      "What daily foot-care routine do you recommend to protect my feet?",
      "Are there supportive medications or vitamins that reduce nerve discomfort?"
    ]
  },
  {
    term: "Vertigo",
    category: "Neurology / ENT",
    simpleName: "Spinning Dizziness Sensation",
    meaning: "The false sensation that you or your surroundings are spinning, tilting, or whirling around you, usually caused by inner-ear balance crystals.",
    analogy: "Like stepping off a fast carnival merry-go-round when the ride has stopped, but your brain still feels like the world is rotating.",
    whyChecked: "Differentiates inner ear balance problems (like BPPV) from circulation or neurological causes.",
    doctorQuestions: [
      "Is my vertigo caused by inner-ear balance crystals or something else?",
      "Can a physical head-movement maneuver (like the Epley maneuver) fix this?",
      "What safe steps should I take at home to prevent falls during a dizzy spell?"
    ]
  },
  {
    term: "Cephalea",
    category: "Neurology",
    simpleName: "Headache / Head Pain",
    meaning: "Pain or discomfort anywhere in the head or neck region, ranging from tension tightness to vascular migraine throbbing.",
    analogy: "Like a tight rubber band wrapped around your forehead, or a bass drum rhythmically pulsing behind your temples.",
    whyChecked: "Evaluated to relieve discomfort and rule out acute spikes in blood pressure or sinus inflammation.",
    doctorQuestions: [
      "Is my headache tension-related, a migraine, or related to high blood pressure?",
      "What non-medication strategies (hydration, sleep, screen breaks) can help?",
      "What warning signs (like sudden 'thunderclap' severity) require emergency care?"
    ]
  },

  // General & Musculoskeletal
  {
    term: "Osteoarthritis",
    category: "Musculoskeletal",
    simpleName: "Wear-and-Tear Joint Stiffness",
    meaning: "The smooth, slippery cartilage cushioning the ends of bones wears down gradually over decades, causing joint stiffness and aching.",
    analogy: "Like the rubber tread on a car tire wearing smooth after many thousands of miles on the highway.",
    whyChecked: "Helps tailor gentle low-impact exercises (like swimming or cycling) and anti-inflammatory support to keep joints moving freely.",
    doctorQuestions: [
      "What low-impact exercises are best to protect my joints without causing pain?",
      "Would physical therapy or braces help support my movement?",
      "What over-the-counter pain relievers or topical gels are safest for daily use?"
    ]
  },
  {
    term: "Edema",
    category: "General Clinical",
    simpleName: "Fluid Swelling in Tissues",
    meaning: "Trapped fluid collects in your body's tissues, most frequently causing puffiness or swelling in feet, ankles, legs, or hands.",
    analogy: "Like a kitchen sponge that has absorbed too much water and stays heavy and plump until gently squeezed.",
    whyChecked: "Can be caused by sitting too long, medications, or reduced heart, kidney, or vein circulation.",
    doctorQuestions: [
      "What is causing fluid to pool in my ankles or legs?",
      "Would elevating my feet or wearing compression stockings help?",
      "Do I need a mild diuretic (water pill) to help clear excess fluid?"
    ]
  },
  {
    term: "Idiopathic",
    category: "Medical Terminology",
    simpleName: "Occurring Without an Obvious Known Cause",
    meaning: "A medical term used when an illness or symptom arises spontaneously and thorough testing does not pinpoint a single specific underlying trigger.",
    analogy: "Like a mystery squeak in a car dashboard — the car runs fine, all tests pass, but mechanics can't find the exact bolt causing the sound.",
    whyChecked: "Assures patients that serious known underlying conditions have been ruled out, even if the origin remains a mystery.",
    doctorQuestions: [
      "Since the cause is unknown, does that mean serious diseases were ruled out?",
      "How do we focus on treating my actual symptoms?",
      "Will we repeat tests in the future if symptoms change?"
    ]
  },
  {
    term: "Acute vs Chronic",
    category: "Medical Terminology",
    simpleName: "Sudden Short-Term vs. Long-Term Ongoing",
    meaning: "'Acute' means starting suddenly and lasting a short time (like a cold or sprained ankle). 'Chronic' means developing gradually and lasting for months or years (like high blood pressure or arthritis).",
    analogy: "An acute event is like a sudden thunderstorm that passes in an afternoon; a chronic condition is like living in a dry desert climate that requires daily hydration habits.",
    whyChecked: "Distinguishes whether immediate short-term treatment or ongoing lifestyle management is required.",
    doctorQuestions: [
      "Is my condition expected to resolve completely (acute) or need ongoing management (chronic)?",
      "What daily habits will best support my long-term well-being?",
      "How often should we review my care plan?"
    ]
  },
  {
    term: "Febrile vs Afebrile",
    category: "General Clinical",
    simpleName: "Having a Fever vs. Normal Body Temperature",
    meaning: "'Febrile' means having an elevated body temperature (fever, usually 100.4°F / 38°C or higher). 'Afebrile' means your body temperature is completely normal.",
    analogy: "Like an engine thermostat reading — 'febrile' means the engine is running hot, while 'afebrile' means normal operating temperature.",
    whyChecked: "Helps clinical teams determine whether your immune system is actively fighting an infection.",
    doctorQuestions: [
      "At what exact temperature should I contact your clinic or take a fever reducer?",
      "What is the best way to stay hydrated while running a fever?",
      "What additional symptoms alongside a fever should prompt urgent care?"
    ]
  },
  {
    term: "Prognosis",
    category: "Medical Terminology",
    simpleName: "Expected Future Health Outlook",
    meaning: "A doctor's professional judgment of the likely course, outcome, and recovery chances of an illness based on clinical evidence.",
    analogy: "Like a certified weather forecast — based on current satellite readings, it predicts whether sunshine or rain is ahead over the coming week.",
    whyChecked: "Gives patients clear, realistic expectations so they can make informed care and recovery decisions.",
    doctorQuestions: [
      "What is the typical recovery timeline for someone in my situation?",
      "What factors most improve my long-term outlook?",
      "What milestones will show that my recovery is on track?"
    ]
  },

  // Additional Cardiovascular & Vascular Terms
  {
    term: "Angina Pectoris",
    category: "Cardiovascular",
    simpleName: "Temporary Heart Chest Discomfort / Heart Strain",
    meaning: "Temporary chest tightness, pressure, or aching caused when the heart muscle briefly receives less blood and oxygen than it needs, usually during exertion or stress.",
    analogy: "Like a runner getting a muscle cramp in their calf when running up a steep hill because oxygen isn't reaching the muscle fast enough.",
    whyChecked: "An important warning signal that coronary arteries may have partial narrowing that needs medical evaluation and preventive care.",
    doctorQuestions: [
      "How can I tell the difference between temporary angina and an emergency heart attack?",
      "Should I have a stress test or heart catheterization?",
      "What quick-relief medication (like nitroglycerin) should I keep accessible?"
    ]
  },
  {
    term: "Heart Failure",
    category: "Cardiovascular",
    simpleName: "Reduced Heart Pumping Efficiency",
    meaning: "The heart muscle has become weakened or stiff over time, meaning it doesn't pump blood throughout the body as forcefully as it normally does. It does NOT mean the heart has stopped working.",
    analogy: "Like an older water sump pump that still operates faithfully every day, but moves water at a slower pace so fluid can back up in the basement (or body tissues) during heavy rains.",
    whyChecked: "Catching it allows medications (like ACE inhibitors and diuretics) and low-sodium diets to protect heart strength and prevent fluid buildup.",
    doctorQuestions: [
      "What is my ejection fraction (EF) percentage?",
      "What daily weight gain (e.g. 2–3 lbs in 24 hours) indicates fluid buildup?",
      "What daily sodium and fluid intake limit should I follow?"
    ]
  },
  {
    term: "Stroke (Cerebrovascular Accident)",
    category: "Neurology / Vascular",
    simpleName: "Interruption of Blood Flow to the Brain",
    meaning: "Blood flow to a part of the brain is suddenly cut off by a clot (ischemic stroke) or a leaking blood vessel (hemorrhagic stroke), depriving brain cells of oxygen.",
    analogy: "Like an electrical power outage in one neighborhood of a city — the lights and appliances in that district instantly turn off until power is restored.",
    whyChecked: "Emergency identification is crucial because rapid clot-busting treatments within the first few hours can reverse or minimize brain injury.",
    doctorQuestions: [
      "What caused the interruption of blood flow to my brain?",
      "What physical or speech therapy will help my neurological recovery?",
      "What medications will best prevent a future clot or stroke?"
    ]
  },
  {
    term: "Syncope",
    category: "Cardiovascular / Neurology",
    simpleName: "Fainting / Temporary Loss of Consciousness",
    meaning: "A temporary, brief loss of consciousness and muscle tone caused by a sudden, temporary drop in blood flow and oxygen to the brain, followed by rapid full recovery.",
    analogy: "Like a smartphone screen briefly dimming to sleep mode when the battery dips, then waking right back up as soon as plugged in.",
    whyChecked: "Evaluated to differentiate simple dehydration or prolonged standing (vasovagal fainting) from heart rhythm or valve issues.",
    doctorQuestions: [
      "Was my fainting caused by dehydration, low blood pressure, or a heart rhythm issue?",
      "What warning sensations (like tunnel vision or clammy sweat) indicate I should sit down immediately?",
      "Is it safe for me to drive right now?"
    ]
  },
  {
    term: "Deep Vein Thrombosis (DVT)",
    aliases: ["deep vein thrombosis", "dvt", "blood clot in leg", "deep venous thrombosis", "leg vein clot", "clot in leg"],
    category: "Vascular & Circulatory Care",
    simpleName: "Blood Clot in a Deep Vein (Usually Leg)",
    meaning: "A blood clot forms in one of the deep veins of your body, most frequently in the calf or thigh, causing localized swelling, warmth, redness, and pain.",
    analogy: "Like a clump of debris getting wedged inside an underground drainage pipe, causing water behind it to back up and swell.",
    whyChecked: "Urgent medical care is needed because a piece of the clot could break loose and travel to the lungs (pulmonary embolism).",
    doctorQuestions: [
      "How long will I need to take blood thinner (anticoagulant) medication?",
      "Should I wear graduated compression stockings during daily activities?",
      "What emergency symptoms (like sudden shortness of breath) require 911?"
    ]
  },
  {
    term: "Pulmonary Embolism (PE)",
    aliases: ["pulmonary embolism", "pe", "blood clot in lungs", "lung clot", "pulmonary embolus", "clot in lung", "pulmonary thromboembolism"],
    category: "Pulmonology & Vascular Care",
    simpleName: "Blood Clot Blockage in the Lungs",
    meaning: "A blood clot (usually originating in the deep leg veins) travels through the bloodstream and blocks one of the pulmonary arteries in the lungs, reducing oxygen exchange.",
    analogy: "Like a leaf getting sucked into the intake filter of a swimming pool pump, choking off the circulation of water through the filter.",
    whyChecked: "Emergency diagnosis and rapid treatment with blood thinners protect oxygen levels and prevent heart strain.",
    doctorQuestions: [
      "How is my lung recovery progressing, and how long will I stay on blood thinners?",
      "What follow-up scans will check if the clot has fully dissolved?",
      "What travel precautions (like moving around on long flights) should I follow?"
    ]
  },

  // Additional Respiratory Terms
  {
    term: "Bronchitis",
    category: "Respiratory",
    simpleName: "Inflammation of the Main Breathing Airways",
    meaning: "The large breathing tubes (bronchi) that carry air into your lungs become swollen, irritated, and produce excess mucus, usually following a viral cold.",
    analogy: "Like having a swollen, irritated throat, but located deeper down inside the breathing pipes of your chest.",
    whyChecked: "Helps doctors determine whether the cough is from an upper airway virus (which does not need antibiotics) or pneumonia.",
    doctorQuestions: [
      "Is my bronchitis viral (meaning antibiotics won't help) or bacterial?",
      "What cough relief or honey/steam remedies will help me rest comfortably at night?",
      "How long is a post-bronchitis lingering cough considered normal?"
    ]
  },
  {
    term: "Sleep Apnea",
    category: "Respiratory / Sleep",
    simpleName: "Repeated Breathing Pauses During Sleep",
    meaning: "A condition where breathing repeatedly stops and starts through the night, usually because the throat muscles relax and temporarily block the airway (obstructive sleep apnea).",
    analogy: "Like a flexible garden hose getting pinched shut periodically so water flow stops for a few seconds before suddenly sputtering back on.",
    whyChecked: "Untreated sleep apnea starves the heart and brain of nighttime oxygen, leading to daytime exhaustion, high blood pressure, and heart strain.",
    doctorQuestions: [
      "Would an overnight home sleep study confirm the severity of my apnea?",
      "Would a CPAP (continuous positive airway pressure) machine restore my energy?",
      "Can sleeping on my side or weight loss reduce airway collapse?"
    ]
  },

  // Additional Metabolic & Lab Terms
  {
    term: "Fasting Blood Glucose",
    category: "Endocrinology / Diabetes",
    simpleName: "Morning Blood Sugar Level (Before Eating)",
    meaning: "A blood test measuring the concentration of glucose circulating in your bloodstream after you have had nothing to eat or drink (except water) for at least 8 to 12 hours.",
    analogy: "Like checking the resting fuel level in your car's fuel tank in the morning before turning the ignition key.",
    whyChecked: "Normal is under 100 mg/dL; 100–125 mg/dL indicates prediabetes; 126 mg/dL or above on two separate tests indicates diabetes.",
    doctorQuestions: [
      "Where does my fasting number fall on the prediabetes/diabetes scale?",
      "What dietary changes will help keep my morning glucose steady?",
      "How often should I test my blood sugar?"
    ]
  },
  {
    term: "Diabetic Ketoacidosis (DKA)",
    category: "Endocrinology / Diabetes",
    simpleName: "Dangerous Acid Buildup from Severe High Blood Sugar",
    meaning: "A severe complication of diabetes that occurs when the body lacks enough insulin to turn sugar into energy, forcing it to burn fat too fast, creating toxic acids called ketones.",
    analogy: "Like trying to heat a home by burning green wet wood because heating oil ran out — lots of toxic smoke and soot (acid) fills the rooms.",
    whyChecked: "Requires prompt emergency hospital treatment with IV fluids and insulin to normalize body chemistry safely.",
    doctorQuestions: [
      "What caused my insulin balance to slip into ketone production?",
      "How should I test for ketones in my urine when I feel sick?",
      "What sick-day diabetes rules should I follow in the future?"
    ]
  },
  {
    term: "Troponin",
    category: "Laboratory / Cardiology",
    simpleName: "Heart Muscle Strain / Injury Protein Marker",
    meaning: "A specific protein found inside heart muscle cells. When heart muscle cells experience severe stress, oxygen deprivation, or injury, troponin leaks into the bloodstream.",
    analogy: "Like oil leaking onto the driveway under a car engine — seeing oil on the pavement proves an engine seal has been stressed.",
    whyChecked: "The key blood test doctors check in the emergency room to confirm or rule out a heart attack.",
    doctorQuestions: [
      "Are my troponin levels normal, slightly elevated, or trending upward?",
      "Was my troponin elevation caused by a heart attack or other cardiac strain?",
      "What further heart imaging (like an angiogram) is necessary?"
    ]
  },
  {
    term: "Blood Urea Nitrogen (BUN)",
    category: "Laboratory / Nephrology",
    simpleName: "Kidney Waste Filtration Marker",
    meaning: "A blood test measuring the amount of urea nitrogen — a normal waste product created when your liver breaks down protein — that remains in your bloodstream.",
    analogy: "Like checking how full the recycling bin is inside your home — if it fills up faster than you take it to the curb, waste backs up.",
    whyChecked: "Helps doctors evaluate kidney filtration efficiency and check for dehydration (dehydration often causes BUN to rise sharply).",
    doctorQuestions: [
      "Is my BUN level elevated due to dehydration or changes in kidney filtration?",
      "How does my BUN number compare to my creatinine level (BUN/creatinine ratio)?",
      "How much water should I drink daily to support healthy kidney filtration?"
    ]
  },
  {
    term: "Aspartate Aminotransferase (AST)",
    category: "Laboratory / Hepatology",
    simpleName: "Liver and Muscle Cell Enzyme",
    meaning: "An enzyme found inside liver, heart, and skeletal muscle cells. When these cells are irritated or damaged, AST leaks into the bloodstream.",
    analogy: "Like packing peanuts escaping from a shipping box when the outer cardboard gets damaged.",
    whyChecked: "Checked alongside ALT to evaluate liver health, alcohol impact, fatty liver changes, or muscle recovery.",
    doctorQuestions: [
      "What is causing my AST to be elevated?",
      "How does my AST compare to my ALT liver enzyme score?",
      "Could any of my current medications, supplements, or workouts be influencing this result?"
    ]
  },
  {
    term: "Bilirubin",
    category: "Laboratory / Hepatology",
    simpleName: "Liver Yellow Pigment / Bile Marker",
    meaning: "A yellow substance created when your body naturally recycles old red blood cells. The liver filters bilirubin out of the blood and moves it into bile.",
    analogy: "Like sawdust generated in a woodworking shop — if the vacuum system (liver) clogs, yellow sawdust accumulates everywhere.",
    whyChecked: "High levels cause yellowing of the skin and eyes (jaundice) and indicate liver stress, gallbladder blockage, or accelerated red cell breakdown.",
    doctorQuestions: [
      "Why is my bilirubin level elevated?",
      "Is the issue related to liver processing or a blockage in the gallbladder ducts?",
      "Do I need an ultrasound of my liver and gallbladder?"
    ]
  },
  {
    term: "Potassium (Hypokalemia / Hyperkalemia)",
    category: "Laboratory / Electrolytes",
    simpleName: "Essential Heart and Muscle Electrolyte Level",
    meaning: "A vital mineral and electrolyte that carries electrical charges in your body. It controls how your nerves fire and how your heart muscle beats. 'Hypokalemia' means too low; 'Hyperkalemia' means too high.",
    analogy: "Like the exact spark plug gap setting in a car engine — if the spark is too weak or too intense, the engine rhythm misfires.",
    whyChecked: "Doctors closely monitor potassium because abnormal levels can cause dangerous heart rhythm irregularities or muscle weakness.",
    doctorQuestions: [
      "Is my potassium level in the safe target zone (typically 3.5 to 5.0 mEq/L)?",
      "Are my blood pressure medications or diuretics affecting my potassium balance?",
      "Should I adjust high-potassium foods (like bananas, potatoes, and spinach) in my diet?"
    ]
  },
  {
    term: "Sodium (Hyponatremia / Hypernatremia)",
    category: "Laboratory / Electrolytes",
    simpleName: "Body Water and Salt Balance Level",
    meaning: "A crucial mineral that regulates the amount of water in and around your body cells and helps nerves and muscles communicate. 'Hyponatremia' means too low; 'Hypernatremia' means too high.",
    analogy: "Like the salinity of water in an aquarium — the precise salt level keeps the cells healthy and prevents them from shrinking or swelling with too much water.",
    whyChecked: "Low sodium can cause brain fog, confusion, headaches, and weakness; high sodium usually reflects severe dehydration.",
    doctorQuestions: [
      "Is my sodium level low due to excess water intake, medications, or kidney handling?",
      "What is the safe rate to normalize my sodium level?",
      "What symptoms of low sodium should I look out for at home?"
    ]
  },

  // Additional Renal & Urinary Terms
  {
    term: "Nephrolithiasis (Kidney Stones)",
    category: "Nephrology / Urology",
    simpleName: "Kidney Stones (Mineral Crystals)",
    meaning: "Hard deposits of minerals and acid salts that clump together in concentrated urine inside the kidneys and can cause sharp back or flank pain as they pass through the urinary tract.",
    analogy: "Like tiny pebbles forming in a garden fountain pipe when mineral-rich hard water dries out and crystallizes.",
    whyChecked: "Doctors evaluate stones with imaging and urine tests to relieve pain, check for urinary tract blockages, and prevent future stone formation.",
    doctorQuestions: [
      "What type of kidney stone did I produce (calcium oxalate, uric acid, or infection-related)?",
      "Is the stone small enough to pass on its own with hydration, or do I need a sound-wave procedure (lithotripsy)?",
      "How much water should I drink daily to prevent new stones?"
    ]
  },
  {
    term: "Urinary Tract Infection (UTI)",
    category: "Urology / Infectious Disease",
    simpleName: "Bladder / Urinary Tract Bacterial Infection",
    meaning: "Bacteria enter the urinary tract (usually the bladder), causing irritation that produces a burning sensation during urination, frequent urgent urges to urinate, and cloudy urine.",
    analogy: "Like unwanted weeds sprouting along the edge of a garden path, causing irritation until cleared away.",
    whyChecked: "Diagnosed with a quick urine dipstick and treated with targeted antibiotics to resolve uncomfortable symptoms and prevent bacteria from spreading up into the kidneys.",
    doctorQuestions: [
      "What bacteria was found in my urine culture, and is this antibiotic the most effective match?",
      "How many days should I continue my antibiotic prescription?",
      "What preventive habits (like hydration and voiding habits) prevent recurring UTIs?"
    ]
  },
  {
    term: "Hematuria",
    category: "Nephrology / Urology",
    simpleName: "Presence of Blood in Urine",
    meaning: "Red blood cells are present in your urine. It can be visible to the naked eye (gross hematuria, making urine pink or tea-colored) or only detectable under a microscope (microscopic hematuria).",
    analogy: "Like a tiny tear in a tea bag letting a few tea leaves slip through into the hot water cup.",
    whyChecked: "Doctors investigate blood in the urine to rule out UTIs, kidney stones, vigorous exercise effects, or bladder irritation.",
    doctorQuestions: [
      "Is my hematuria microscopic or visible to the eye?",
      "What is the most probable cause (infection, stone, medication, or prostate)?",
      "Do I need an imaging test (like an ultrasound or CT scan) to examine my kidneys and bladder?"
    ]
  },

  // Additional Gastrointestinal Terms
  {
    term: "Gastroenteritis",
    category: "Gastroenterology / Infectious Disease",
    simpleName: "Stomach and Intestinal Infection ('Stomach Flu')",
    meaning: "Inflammation of the lining of the stomach and intestines, usually caused by a viral or bacterial bug, leading to watery diarrhea, nausea, vomiting, and abdominal cramping.",
    analogy: "Like a flash flood rushing through a riverbed — the digestive system pushes everything through quickly to flush out the irritating bug.",
    whyChecked: "Clinical care focuses on preventing dehydration and replenishing lost fluids and electrolytes while the body clears the infection.",
    doctorQuestions: [
      "What oral rehydration electrolyte drinks are best while my stomach recovers?",
      "When can I safely reintroduce bland solid foods (the BRAT diet: bananas, rice, applesauce, toast)?",
      "What signs of dehydration (like dark urine, dry mouth, or dizziness) should prompt urgent medical attention?"
    ]
  },
  {
    term: "Pancreatitis",
    category: "Gastroenterology",
    simpleName: "Inflammation of the Pancreas",
    meaning: "The pancreas — the gland behind your stomach that produces digestive enzymes and insulin — becomes inflamed, causing sharp upper abdominal pain that often radiates to the back.",
    analogy: "Like a sprinkler system that activates while still inside its storage shed, soaking the equipment before reaching the lawn.",
    whyChecked: "Requires medical observation, bowel rest, IV hydration, and pain relief to allow the pancreas to calm down and prevent complications.",
    doctorQuestions: [
      "What triggered this episode of pancreatitis (such as gallstones, alcohol, or medications)?",
      "Do I need an ultrasound to check for gallstones blocking the pancreatic duct?",
      "What low-fat dietary plan should I follow as my digestion recovers?"
    ]
  },
  {
    term: "Cholecystitis",
    category: "Gastroenterology",
    simpleName: "Gallbladder Inflammation / Gallstone Blockage",
    meaning: "Inflammation and swelling of the gallbladder, almost always caused by a gallstone getting stuck in the cystic duct and blocking the normal outflow of bile.",
    analogy: "Like a cork getting stuck in the spout of an oil bottle — pressure builds up inside the bottle because fluid cannot exit.",
    whyChecked: "Doctors check with an ultrasound to relieve severe upper right abdominal pain and decide whether surgical removal (cholecystectomy) is appropriate.",
    doctorQuestions: [
      "Is my gallbladder inflammation caused by gallstones?",
      "Do you recommend a minimally invasive surgical removal (laparoscopic cholecystectomy)?",
      "What foods (especially high-fat meals) should I avoid in the meantime?"
    ]
  },
  {
    term: "Cirrhosis",
    category: "Gastroenterology / Hepatology",
    simpleName: "Chronic Liver Tissue Scarring",
    meaning: "A late stage of progressive liver scarring (fibrosis) where healthy liver cells are gradually replaced by tough scar tissue, hindering the liver's ability to filter toxins and produce proteins.",
    analogy: "Like a smooth kitchen sponge gradually turning into hardened leather — it loses its softness and ability to soak up and filter water.",
    whyChecked: "Detecting and slowing cirrhosis allows doctors to prevent complications (like fluid swelling, jaundice, or bleeding veins) and protect remaining healthy liver function.",
    doctorQuestions: [
      "What stage is my liver scarring, and how can we halt further progression?",
      "What medications or over-the-counter pain relievers (like acetaminophen) must I avoid to protect my liver?",
      "How often should I have an ultrasound screening to monitor my liver?"
    ]
  },
  {
    term: "Colonoscopy",
    category: "Gastroenterology / Diagnostics",
    simpleName: "Camera Examination of the Large Intestine / Colon",
    meaning: "A routine preventive procedure where a doctor gently guides a thin, flexible tube equipped with a tiny camera through your colon to inspect the lining and remove small polyps before they can ever become cancerous.",
    analogy: "Like a home inspector taking a high-definition video camera through every room and hallway of a house to spot and fix tiny plaster cracks early.",
    whyChecked: "The number-one proven screening tool to prevent colorectal cancer by finding and safely removing precancerous polyps during the procedure.",
    doctorQuestions: [
      "Were any polyps found during my colonoscopy, and what were the pathology findings?",
      "How was the quality of my bowel preparation during the exam?",
      "In how many years should I schedule my next follow-up screening colonoscopy?"
    ]
  },

  // Additional Hematology, Infection & Immune Terms
  {
    term: "Leukocytosis",
    category: "Hematology / Infectious Disease",
    simpleName: "Elevated White Blood Cell Count",
    meaning: "A higher-than-normal count of white blood cells (leukocytes) in the bloodstream, indicating that your body's immune defense system is actively mobilized.",
    analogy: "Like a fire station dispatching all its fire engines and firefighters to respond to an emergency alarm in town.",
    whyChecked: "Doctors use this to verify whether the body is fighting an active bacterial or viral infection, inflammation, or physical trauma.",
    doctorQuestions: [
      "How elevated is my white blood cell count compared to the standard reference range?",
      "Is the high count pointing to a specific bacterial infection or general inflammation?",
      "When should we recheck my complete blood count (CBC) to ensure levels have normalized?"
    ]
  },
  {
    term: "Leukopenia",
    category: "Hematology / Immunology",
    simpleName: "Low White Blood Cell Count",
    meaning: "A lower-than-normal count of white blood cells circulating in your blood, which can temporarily reduce your immune system's strength in defending against infections.",
    analogy: "Like having fewer security guards stationed at the entrance gates — you need to take extra precautions to keep out unwanted germs.",
    whyChecked: "Monitored during chemotherapy, viral illnesses, or autoimmune conditions to protect patients from opportunistic infections.",
    doctorQuestions: [
      "What is causing my white blood cell count to be lower than normal?",
      "What everyday hygiene and infection prevention precautions (like masking and food safety) should I take?",
      "What temperature threshold counts as an urgent medical emergency for someone with a low count?"
    ]
  },
  {
    term: "Sepsis",
    category: "Critical Care / Infectious Disease",
    simpleName: "Severe Whole-Body Response to Infection",
    meaning: "A life-threatening medical emergency caused by the body's immune system overreacting to an infection, triggering widespread inflammation that can damage tissues and organs.",
    analogy: "Like an automatic fire suppression system that sprays so much water everywhere that the water itself begins damaging the building's walls and electrical systems.",
    whyChecked: "Requires immediate emergency hospital care with rapid IV antibiotics and fluids to protect blood pressure and organ function.",
    doctorQuestions: [
      "Where did the initial infection originate (lungs, urinary tract, abdomen, skin)?",
      "How are my vital signs and organ filtration scores recovering?",
      "What follow-up appointments and physical recovery milestones should I plan for at home?"
    ]
  },

  // Additional Musculoskeletal, Endocrine & Neurological Terms
  {
    term: "Osteoporosis",
    category: "Musculoskeletal / Endocrinology",
    simpleName: "Thin, Porous, Weakened Bones",
    meaning: "A condition where bones lose density and structural strength, becoming porous and fragile, which significantly increases the risk of bone fractures from minor bumps or falls.",
    analogy: "Like a sturdy wooden deck post that gradually becomes hollowed out by termites — it looks fine from the outside, but cannot bear heavy loads without splintering.",
    whyChecked: "Measured with a painless DEXA bone density scan so doctors can recommend calcium, vitamin D, and bone-strengthening treatments before a fracture occurs.",
    doctorQuestions: [
      "What is my T-score from my bone density (DEXA) scan?",
      "What weight-bearing exercises and balance training will safely strengthen my bones and prevent falls?",
      "Should I take a bone-protecting medication (like a bisphosphonate) or calcium and vitamin D supplements?"
    ]
  },
  {
    term: "Gout",
    category: "Rheumatology / Musculoskeletal",
    simpleName: "Uric Acid Crystal Joint Inflammation",
    meaning: "A painful form of inflammatory arthritis where excess uric acid in the blood crystallizes into sharp microscopic needles that settle inside a joint (most often the big toe), causing sudden severe pain, swelling, and redness.",
    analogy: "Like tiny grains of sharp crushed glass getting trapped inside the hinge of a door — every slight movement causes intense friction and pain.",
    whyChecked: "Doctors check uric acid blood levels to provide fast pain relief during flare-ups and prescribe long-term uric acid-lowering medications to prevent joint damage.",
    doctorQuestions: [
      "What is my current blood uric acid level?",
      "What dietary choices (like limiting red meat, shellfish, and alcohol) will help keep uric acid low?",
      "What medication plan do we have for sudden flares versus long-term prevention?"
    ]
  },
  {
    term: "Sciatica",
    category: "Neurology / Orthopedics",
    simpleName: "Nerve Pain Radiating Down the Leg",
    meaning: "Pain, numbness, or tingling that originates in the lower back and radiates down through the buttock and along the back of the leg, caused by compression or irritation of the sciatic nerve.",
    analogy: "Like a garden hose getting stepped on in the garage — the pressure point is at the tap, but the water stoppage and tension are felt all the way down at the garden nozzle.",
    whyChecked: "Evaluated to pinpoint whether a herniated disc or muscle tightness is pinching the nerve and guide physical therapy and non-surgical relief.",
    doctorQuestions: [
      "What is pinching or irritating my sciatic nerve (such as a disc herniation or spinal stenosis)?",
      "What physical therapy stretches and core-strengthening exercises are safest?",
      "What red-flag symptoms (like loss of bladder or bowel control, known as Cauda Equina) require immediate emergency care?"
    ]
  },
  {
    term: "Paresthesia",
    category: "Neurology",
    simpleName: "Pins and Needles / Numbness Sensation",
    meaning: "An abnormal tingling, prickling, 'pins and needles', or numbness sensation on the skin, typically felt in the hands, arms, legs, or feet without an external physical cause.",
    analogy: "Like static noise or snow fuzz appearing on a TV screen when the cable antenna connection is loose or slightly pinched.",
    whyChecked: "Helps doctors determine whether a nerve is temporarily compressed (like your foot falling asleep) or if there is underlying vitamin B12 deficiency or nerve irritation.",
    doctorQuestions: [
      "Is my pins-and-needles sensation temporary or related to an underlying nerve condition?",
      "Should we check my vitamin B12, thyroid, or blood sugar levels?",
      "What daily posture adjustments will relieve pressure on my nerves?"
    ]
  },
  {
    term: "Hypothyroidism",
    category: "Endocrinology",
    simpleName: "Underactive Thyroid Gland / Slow Metabolism",
    meaning: "The butterfly-shaped thyroid gland in your neck does not produce enough thyroid hormones, causing your body's overall metabolism to slow down, leading to fatigue, weight gain, feeling cold, and dry skin.",
    analogy: "Like a home thermostat set too low — the furnace runs on low power, so the rooms stay chilly and everything runs sluggishly.",
    whyChecked: "Diagnosed with a simple TSH (Thyroid Stimulating Hormone) blood test and easily treated with a daily thyroid hormone replacement pill (levothyroxine).",
    doctorQuestions: [
      "What was my TSH lab result, and what is our target range?",
      "How should I take my thyroid medication (e.g. on an empty stomach with a full glass of water)?",
      "How many weeks before we recheck my blood to see if my energy has returned?"
    ]
  },
  {
    term: "Hyperthyroidism",
    category: "Endocrinology",
    simpleName: "Overactive Thyroid Gland / Accelerated Metabolism",
    meaning: "The thyroid gland produces too much thyroid hormone, accelerating your body's metabolism and causing symptoms like a rapid heart rate, unintended weight loss, nervousness, tremors, and heat intolerance.",
    analogy: "Like a car engine stuck with the accelerator pedal pushed down — the engine runs at very high RPMs, burning through fuel rapidly and heating up.",
    whyChecked: "Identified with thyroid lab panels so doctors can calm thyroid hormone production and protect heart rhythm and bone health.",
    doctorQuestions: [
      "What is causing my thyroid to overproduce hormones (such as Graves' disease or thyroid nodules)?",
      "What medication (like methimazole or beta-blockers) will help stabilize my heart rate and hormone levels?",
      "What symptoms should I monitor at home while my treatment takes effect?"
    ]
  },

  // Additional Diagnostic & Imaging Procedures
  {
    term: "Electrocardiogram (ECG / EKG)",
    category: "Diagnostics / Cardiology",
    simpleName: "Heart Electrical Rhythm Tracing Test",
    meaning: "A quick, painless, non-invasive test where small adhesive sensor patches are placed on your chest, arms, and legs to record the electrical signals that trigger your heartbeats.",
    analogy: "Like an electrical diagram or blueprint tracing the electrical wiring of a house to verify that switches and fuses are firing smoothly.",
    whyChecked: "The essential initial tool doctors use to check heart rate, detect irregular rhythms (arrhythmias), and identify signs of past or present heart strain.",
    doctorQuestions: [
      "Did my ECG tracing show a normal sinus rhythm or any irregularities?",
      "Were there any signs of previous heart strain or thick heart muscle?",
      "Do my symptoms suggest I should wear a 24-hour portable monitor (Holter monitor)?"
    ]
  },
  {
    term: "Echocardiogram",
    category: "Diagnostics / Cardiology",
    simpleName: "Heart Ultrasound Scan",
    meaning: "A painless diagnostic imaging test that uses high-frequency sound waves (ultrasound) to create live, moving pictures of your heart's chambers, valves, and pumping action.",
    analogy: "Like using naval sonar to map an underwater structure — sound waves bounce back to construct a detailed moving 3D movie of the heart in motion.",
    whyChecked: "Allows doctors to measure your heart's ejection fraction (pumping strength), inspect heart valves for leaks or stiffness, and check heart chamber dimensions.",
    doctorQuestions: [
      "What is my heart's ejection fraction (EF) percentage, and is it normal?",
      "Are all four of my heart valves opening and closing tightly without leaking?",
      "How do these ultrasound findings guide my care plan?"
    ]
  },
  {
    term: "Computed Tomography (CT Scan)",
    category: "Diagnostics / Radiology",
    simpleName: "3D Cross-Sectional X-Ray Scan",
    meaning: "A sophisticated diagnostic imaging scan that combines multiple X-ray measurements taken from different angles to create cross-sectional, 3D slice images of bones, blood vessels, and soft tissues inside your body.",
    analogy: "Like looking at a whole loaf of bread versus looking at individual thin slices one by one to inspect every detail inside.",
    whyChecked: "Provides far more detail than a standard flat 2D X-ray to evaluate abdominal organs, chest structures, blood vessels, or head injuries.",
    doctorQuestions: [
      "What specific findings were identified on my CT scan slices?",
      "Was IV contrast dye used, and should I drink extra water to flush it out?",
      "What do these imaging findings mean for my treatment plan?"
    ]
  },
  {
    term: "Magnetic Resonance Imaging (MRI)",
    category: "Diagnostics / Radiology",
    simpleName: "Magnetic Soft-Tissue Detailed Body Scan",
    meaning: "A painless diagnostic imaging technique that uses a powerful magnetic field and radio waves to generate remarkably detailed pictures of organs and soft tissues (like the brain, spinal cord, ligaments, and cartilage) without using any X-ray radiation.",
    analogy: "Like tuning a super-sensitive radio receiver to listen to the natural magnetic signals of your body's water molecules to draw an ultra-sharp high-definition portrait.",
    whyChecked: "The best imaging tool for examining soft tissues, the brain, the spinal cord, and joint cartilage that ordinary X-rays cannot clearly visualize.",
    doctorQuestions: [
      "What did the MRI reveal about my soft tissues, nerves, or joints?",
      "Does the imaging show an issue that can be treated with physical therapy, or is a specialist consultation indicated?",
      "Will I receive a copy of the radiologist's written impression report?"
    ]
  },

  // Everyday Symptoms, Health Concepts & Organ Guides
  {
    term: "Meaning of a Medical Word (Medical Terminology Guide)",
    aliases: ["meaning of a word", "word", "medical word", "medical term", "medical terms", "jargon", "terminology", "meaning of word", "medical meaning"],
    category: "Health Literacy Guide",
    simpleName: "How to Understand Any Medical Word in Plain English",
    meaning: "Medical words are built like Lego blocks: a root that names the body part (like 'cardio' for heart or 'gastro' for stomach) plus a prefix or suffix that describes what is happening (like '-itis' for inflammation or '-megaly' for enlargement). Understanding these parts unlocks the true meaning of your medical records.",
    analogy: "Like learning root words in any language — once you know that 'aqua' means water, words like aquarium, aquatic, and aqueduct all make instant sense.",
    whyChecked: "Doctors use standard medical terminology to ensure absolute clarity across hospitals, clinics, and pharmacies so every clinician understands your health status.",
    doctorQuestions: [
      "Could you explain what this specific medical term means for my daily activities?",
      "Are there written educational materials or handouts about this term?",
      "What is the single most important health action I should take next?"
    ]
  },
  {
    term: "Diabetes Mellitus",
    aliases: ["diabetes", "type 2 diabetes", "type 1 diabetes", "high blood sugar", "sugar disease", "diabetic"],
    category: "Endocrinology / Metabolic",
    simpleName: "High Blood Sugar / Insulin Imbalance",
    meaning: "A chronic condition where the body either does not make enough insulin or cannot effectively use the insulin it makes, causing sugar (glucose) to build up in the bloodstream instead of fueling your cells.",
    analogy: "Think of insulin as a key that unlocks the front doors of your cells so energy (sugar) can enter. In diabetes, you either have too few keys or the locks are rusty, so sugar piles up on the street (your bloodstream).",
    whyChecked: "Managing blood sugar protects your blood vessels, heart, eyes, kidneys, and nerves from long-term wear and tear.",
    doctorQuestions: [
      "What is my personal target blood sugar range before and after meals?",
      "What dietary swaps and daily physical habits will best support my insulin sensitivity?",
      "How often should we check my HbA1c 3-month average score?"
    ]
  },
  {
    term: "Cancer",
    aliases: ["cancer", "tumor", "carcinoma", "neoplasm", "malignancy", "malignant growth"],
    category: "Oncology",
    simpleName: "Abnormal Cell Growth / Oncology Condition",
    meaning: "A broad term for conditions where abnormal cells divide and multiply without normal biological controls, potentially forming tumors or spreading to nearby tissues.",
    analogy: "Like aggressive weeds growing in a garden bed that crowd out healthy flowers unless identified early and carefully treated.",
    whyChecked: "Early detection through screenings (like mammograms, colonoscopies, or skin checks) allows curative treatment before cells spread.",
    doctorQuestions: [
      "What is the exact type, stage, and location of these cells?",
      "What are the recommended treatment paths (surgery, chemotherapy, radiation, or immunotherapy)?",
      "What is our step-by-step timeline for starting care?"
    ]
  },
  {
    term: "Headache",
    aliases: ["headache", "head pain", "migraine", "cephalea", "tension headache", "cluster headache"],
    category: "Neurology",
    simpleName: "Pain or Pressure in the Head or Neck",
    meaning: "Discomfort or pain occurring anywhere in the head or upper neck region, most commonly caused by muscle tension, stress, dehydration, lack of sleep, or migraine nerve sensitivity.",
    analogy: "Like a tight headband or heavy helmet squeezing your temples, or a bass drum rhythmically pulsing behind your forehead.",
    whyChecked: "Doctors evaluate headaches to relieve discomfort and rule out sudden spikes in blood pressure, sinus pressure, or neurological causes.",
    doctorQuestions: [
      "Is my headache tension-related, a vascular migraine, or linked to blood pressure or stress?",
      "What non-medication strategies (hydration, sleep schedule, screen breaks) will prevent recurring episodes?",
      "What red-flag signs (like sudden 'worst headache of life' severity) require emergency medical evaluation?"
    ]
  },
  {
    term: "Fever",
    aliases: ["fever", "high temperature", "febrile", "pyrexia", "chills", "elevated temperature"],
    category: "General Clinical",
    simpleName: "Elevated Body Temperature (Above 100.4°F / 38°C)",
    meaning: "A temporary increase in your body's internal thermostat, usually triggered by your immune system to make the body hotter and more hostile to invading bacteria or viruses.",
    analogy: "Like cranking up the home furnace to drive out cold drafts — your body generates heat to help immune cells fight off germs faster.",
    whyChecked: "Shows doctors that your immune system is actively fighting an infection and guides whether antibiotics, antiviral medications, or rest and fluids are needed.",
    doctorQuestions: [
      "At what temperature reading should I contact the clinic or take an over-the-counter fever reducer?",
      "What is the best hydration and resting plan while my temperature normalizes?",
      "What other symptoms alongside a fever should prompt emergency care?"
    ]
  },
  {
    term: "Cough",
    aliases: ["cough", "coughing", "persistent cough", "dry cough", "hacking cough", "wet cough"],
    category: "Respiratory",
    simpleName: "Airway Clearing Reflex",
    meaning: "A natural defensive reflex where your body forcefully expels air from your lungs to clear irritants, mucus, dust, or foreign particles from your breathing tubes.",
    analogy: "Like a windshield wiper clearing away rain and leaves so the driver has a completely clear view through the glass.",
    whyChecked: "Differentiates between common viral colds, allergies, asthma, acid reflux, and deeper lung infections like pneumonia or bronchitis.",
    doctorQuestions: [
      "Is my cough coming from an upper airway virus, allergies, or deeper chest inflammation?",
      "Would honey, warm steam, or an inhaler provide safe comfort at night?",
      "At what point does a lingering cough require an X-ray evaluation?"
    ]
  },
  {
    term: "Chest Pain",
    aliases: ["chest pain", "angina", "chest pressure", "chest tightness", "heart pain", "crushing chest pain"],
    category: "Cardiology / Emergency Care",
    simpleName: "Discomfort, Tightness, or Pressure in the Chest",
    meaning: "Pain, pressure, aching, or burning felt anywhere between the neck and upper abdomen. It can originate from the heart, lungs, esophagus (acid reflux), or chest wall muscles.",
    analogy: "Like an urgent smoke detector alarm sounding in your house — you must check it immediately to determine whether it's a real fire or just burnt toast.",
    whyChecked: "Always evaluated urgently by healthcare providers to rule out emergency cardiac events (heart attack) and provide safe, targeted relief.",
    doctorQuestions: [
      "Was my chest discomfort caused by my heart, my esophagus, or chest wall muscles?",
      "What warning symptoms (like pain radiating to arm or jaw, or shortness of breath) require calling 911?",
      "What cardiac tests (like an ECG or troponin blood test) verify my heart health?"
    ]
  },
  {
    term: "Dizziness",
    aliases: ["dizziness", "dizzy", "lightheaded", "lightheadedness", "vertigo", "feeling faint", "unsteady", "woozy"],
    category: "Neurology / Cardiovascular",
    simpleName: "Unsteadiness, Lightheadedness, or Spinning Sensation",
    meaning: "An altered sense of spatial balance where you feel lightheaded, woozy, unsteady on your feet, or sense that your surroundings are spinning around you.",
    analogy: "Like being on a boat rocking on gentle waves — your brain is receiving slightly mismatched balance signals from your inner ears, eyes, and blood pressure.",
    whyChecked: "Helps doctors determine whether the sensation is due to dehydration, low blood pressure when standing, inner ear balance crystals, or medication side effects.",
    doctorQuestions: [
      "Is my dizziness related to low blood pressure, dehydration, or an inner-ear issue?",
      "Could any of my current medications be contributing to lightheadedness?",
      "What safe steps should I take at home to prevent falls during a dizzy spell?"
    ]
  },
  {
    term: "Fatigue",
    aliases: ["fatigue", "exhaustion", "tiredness", "chronic fatigue", "low energy", "lethargy", "sluggishness"],
    category: "General Clinical",
    simpleName: "Ongoing Physical or Mental Exhaustion",
    meaning: "An overwhelming sense of persistent tiredness, weakness, and lack of energy that does not go away after resting or getting a full night of sleep.",
    analogy: "Like a smartphone whose battery drains down to 5% after just a few minutes of use, no matter how long it sat on the charger overnight.",
    whyChecked: "Common signal investigated by doctors with blood tests to uncover treatable root causes like anemia, thyroid changes, vitamin D/B12 shortages, or sleep apnea.",
    doctorQuestions: [
      "What blood tests (like thyroid, iron, and complete blood count) can pinpoint the cause of my fatigue?",
      "Could a sleep study help evaluate my nighttime breathing and sleep quality?",
      "What daily lifestyle adjustments will best restore my natural stamina?"
    ]
  },
  {
    term: "Nausea and Vomiting",
    aliases: ["nausea", "vomiting", "throwing up", "upset stomach", "sick to stomach", "emesis"],
    category: "Gastroenterology",
    simpleName: "Stomach Queasiness and Throwing Up",
    meaning: "Nausea is the uneasy queasiness in your stomach that signals you might throw up; vomiting is the body's physical reflex of forcefully expelling stomach contents through the mouth.",
    analogy: "Like an automatic emergency purge button on an appliance — when the stomach detects an irritating bug, toxin, or motion imbalance, it ejects the contents to protect you.",
    whyChecked: "Doctors evaluate this to prevent dehydration and determine whether it is caused by a stomach virus, food intolerance, medication reaction, or inner ear issue.",
    doctorQuestions: [
      "What is the most likely cause of my stomach queasiness?",
      "What oral rehydration fluids and electrolyte sips will stay down best?",
      "What warning signs (like inability to keep water down for 24 hours) mean I should visit the clinic?"
    ]
  },
  {
    term: "Infection",
    aliases: ["infection", "bacterial infection", "viral infection", "germs", "contagion", "infectious"],
    category: "Infectious Disease",
    simpleName: "Invasion of the Body by Germs (Bacteria, Viruses, or Fungi)",
    meaning: "Harmful microorganisms (like bacteria, viruses, or fungi) enter your body tissues, multiply, and trigger an active immune defense response such as fever, swelling, or redness.",
    analogy: "Like uninvited intruders sneaking into a secure building — the building's alarm system (your immune system) goes off to surround and eliminate them.",
    whyChecked: "Crucial to distinguish between viral infections (which clear with rest and fluids) and bacterial infections (which respond to targeted antibiotics).",
    doctorQuestions: [
      "Is my infection viral or bacterial?",
      "Do I need an antibiotic prescription, or will supportive home care clear this?",
      "How long is this condition contagious to others?"
    ]
  },
  {
    term: "Inflammation",
    aliases: ["inflammation", "swelling", "inflamed", "tissue irritation", "inflammatory response"],
    category: "General Clinical / Immunology",
    simpleName: "Body Defense Reaction: Redness, Heat, and Swelling",
    meaning: "Your immune system's natural healing response to injury, infection, or irritation, where blood vessels widen to send protective white blood cells and fluid to repair tissue.",
    analogy: "Like emergency road crews setting up orange traffic cones and detour signs around a damaged roadway to complete urgent paving repairs.",
    whyChecked: "Acute inflammation is healthy and heals cuts; chronic long-term inflammation is monitored because it can stress blood vessels and joints.",
    doctorQuestions: [
      "What triggered this inflammation in my body?",
      "What anti-inflammatory measures (ice, gentle movement, dietary adjustments) are most effective?",
      "How long should I expect the swelling to take to fully resolve?"
    ]
  },
  {
    term: "Dehydration",
    aliases: ["dehydration", "dehydrated", "lack of fluids", "fluid loss", "low fluid"],
    category: "General Clinical",
    simpleName: "Shortage of Water in the Body",
    meaning: "A state where your body loses more water and essential electrolytes through sweat, urination, fever, or vomiting than you take in through drinking fluids.",
    analogy: "Like a dried-out potted houseplant whose leaves droop and soil shrinks until given a thorough watering.",
    whyChecked: "Dehydration strains the kidneys, drops blood pressure, accelerates heart rate, and causes headaches and fatigue.",
    doctorQuestions: [
      "What is my personal target daily water intake (in ounces or liters)?",
      "Should I use an electrolyte solution rather than plain tap water?",
      "What signs (like dark amber urine or dry lips) indicate I need more hydration?"
    ]
  },
  {
    term: "Allergy",
    aliases: ["allergy", "allergies", "allergic reaction", "hives", "anaphylaxis", "allergic"],
    category: "Immunology",
    simpleName: "Immune System Overreaction to a Harmless Substance",
    meaning: "A condition where your immune system mistakenly identifies a harmless substance (like pollen, pet dander, peanuts, or penicillin) as a dangerous threat, releasing histamine that causes sneezing, itching, hives, or swelling.",
    analogy: "Like a home security alarm that triggers a loud siren whenever an innocent butterfly flutters past the front window.",
    whyChecked: "Identified to help patients avoid triggers and provide antihistamines or emergency auto-injectors (EpiPens) for safety.",
    doctorQuestions: [
      "What specific allergen triggered my reaction?",
      "Do I need an allergy blood test or skin prick panel?",
      "Should I carry an emergency epinephrine auto-injector (EpiPen)?"
    ]
  },
  {
    term: "Blood Pressure",
    aliases: ["blood pressure", "bp", "systolic", "diastolic", "pressure reading"],
    category: "Cardiovascular",
    simpleName: "Force of Circulating Blood in Your Arteries",
    meaning: "The measurement of the physical pressure blood exerts against artery walls as your heart pumps it throughout the body. Recorded as two numbers: systolic (top / during a heartbeat) over diastolic (bottom / resting between beats).",
    analogy: "Like water pressure gauge readings on your home plumbing pipes — you want the pressure strong enough to reach the second floor, but not so high that joints burst.",
    whyChecked: "Healthy target is around 120/80 mmHg. Keeping blood pressure in a healthy zone prevents strokes, heart attacks, and kidney strain.",
    doctorQuestions: [
      "What was my exact blood pressure reading today?",
      "What is my personal healthy target blood pressure number?",
      "How often should I measure and record my blood pressure at home?"
    ]
  },
  {
    term: "Heart",
    aliases: ["heart", "cardiac", "cardiovascular", "heart function", "heart health"],
    category: "Cardiovascular",
    simpleName: "The Muscular Pump of Your Circulatory System",
    meaning: "The muscular organ located in the center of your chest that contracts rhythmically about 100,000 times a day to pump oxygen-rich blood and vital nutrients to every cell in your body.",
    analogy: "Like the central water pump of a municipal utility plant — operating 24 hours a day without stopping to maintain constant flow throughout city pipelines.",
    whyChecked: "Doctors check heart sounds with a stethoscope and review ECG tracings to ensure your heart muscle, valves, and electrical rhythm are operating efficiently.",
    doctorQuestions: [
      "How is my heart rhythm, rate, and pumping strength performing overall?",
      "What heart-healthy daily habits (diet, walking, stress relief) do you recommend for me?",
      "What routine cardiovascular screenings should we schedule?"
    ]
  },
  {
    term: "Lungs",
    aliases: ["lungs", "lung", "pulmonary", "respiratory", "breathing", "respiratory system"],
    category: "Pulmonology",
    simpleName: "The Oxygen Exchange Organs of Your Body",
    meaning: "A pair of spongy, air-filled organs located in your chest that extract fresh oxygen from the air you breathe in and transfer it into your bloodstream, while clearing out carbon dioxide waste as you exhale.",
    analogy: "Like specialized bellows that expand and contract smoothly with every breath to feed fresh oxygen into your body's energy furnace.",
    whyChecked: "Doctors listen with a stethoscope to check for wheezing, crackles, or fluid, and use chest X-rays to ensure lungs are clear of pneumonia or congestion.",
    doctorQuestions: [
      "Did you hear any crackles, wheezing, or fluid sounds when listening to my lungs?",
      "What is my blood oxygen saturation percentage (SpO2)?",
      "What breathing exercises or clean-air habits will keep my lungs strongest?"
    ]
  },
  {
    term: "Kidneys",
    aliases: ["kidneys", "kidney", "renal", "kidney filtration", "renal function"],
    category: "Nephrology",
    simpleName: "The Body's Natural Blood Cleaning and Filtration Organs",
    meaning: "Two bean-shaped organs located in your lower back that filter approximately 50 gallons of blood every day to remove metabolic wastes, balance water and electrolytes (salt and potassium), and produce urine.",
    analogy: "Like an ultra-fine water filtration unit in a home kitchen — purifying circulating water and routing wastes directly down the drain.",
    whyChecked: "Evaluated through blood tests (eGFR, creatinine, BUN) and urine tests to protect kidney filtering strength over your lifetime.",
    doctorQuestions: [
      "What do my creatinine and eGFR scores show about my kidney filtering efficiency?",
      "Are any of my daily medications or over-the-counter pain relievers (like ibuprofen) hard on the kidneys?",
      "How much water should I drink each day to support healthy kidney filtration?"
    ]
  },
  {
    term: "Liver",
    aliases: ["liver", "hepatic", "liver function", "liver enzymes", "hepatic system"],
    category: "Hepatology",
    simpleName: "The Body's Chemical Processing and Detoxification Center",
    meaning: "The large organ located in the upper right side of your abdomen that performs over 500 vital functions, including filtering toxins from the blood, processing medications, producing bile for digestion, and storing energy.",
    analogy: "Like a high-tech chemical recycling and processing plant that purifies incoming goods, packages energy for later, and safely neutralizes harmful byproducts.",
    whyChecked: "Doctors check liver enzymes (ALT, AST, bilirubin) on routine blood panels to monitor liver health and evaluate response to medications.",
    doctorQuestions: [
      "Are my liver enzyme numbers (ALT, AST) within the normal target range?",
      "What dietary choices help protect liver health and prevent fatty liver changes?",
      "Are all my current medications and supplements safe for my liver?"
    ]
  },
  {
    term: "Stomach",
    aliases: ["stomach", "gut", "digestive", "gastrointestinal", "belly", "digestive system"],
    category: "Gastroenterology",
    simpleName: "The Digestive Acid and Food Breakdown Organ",
    meaning: "The muscular, hollow organ in your upper abdomen that receives food from your esophagus, secretes powerful gastric acid and digestive enzymes, and churns food into a liquid mixture ready for intestinal absorption.",
    analogy: "Like a heavy-duty food processor with built-in warming and acid-dissolving cycles that turns whole meals into a smooth soup for your body to absorb.",
    whyChecked: "Evaluated to relieve heartburn, indigestion, gastritis, or ulcers, ensuring comfortable digestion and proper nutrient absorption.",
    doctorQuestions: [
      "What is causing my stomach discomfort or indigestion?",
      "What foods, spices, or meal timings should I adjust to reduce stomach acid irritation?",
      "Would a mild antacid or coating medication help protect my stomach lining?"
    ]
  },
  {
    term: "Brain",
    aliases: ["brain", "nervous system", "neurological", "cognitive", "central nervous system"],
    category: "Neurology",
    simpleName: "The Command and Control Center of Your Body",
    meaning: "The complex organ inside your head that coordinates all body functions, processes sensations from your five senses, controls thoughts and memories, regulates emotions, and directs all physical movements.",
    analogy: "Like the central processing unit (CPU) and operating system of a supercomputer — managing all incoming data and sending instructions to every component.",
    whyChecked: "Doctors evaluate reflexes, memory, speech, and balance during neurological exams to verify healthy nerve communication.",
    doctorQuestions: [
      "What do my neurological exam findings and reflexes show about my brain health?",
      "What daily habits (sleep, mental exercises, physical activity) support long-term brain health?",
      "What changes in memory or balance should prompt a specialist review?"
    ]
  },
  {
    term: "Blood",
    aliases: ["blood", "hematology", "circulation", "bloodstream", "blood cells"],
    category: "Hematology",
    simpleName: "The Fluid Transportation System of Your Body",
    meaning: "The specialized fluid circulating through your heart and blood vessels, made of plasma carrying red blood cells (transporting oxygen), white blood cells (fighting infections), and platelets (stopping bleeding).",
    analogy: "Like a busy river highway flowing through a city, carrying delivery boats (oxygen), emergency patrol boats (immune cells), and repair crews (platelets).",
    whyChecked: "A complete blood count (CBC) is the foundational test doctors use to check oxygen levels, immune readiness, and clotting safety.",
    doctorQuestions: [
      "Are my red blood cell, white blood cell, and platelet counts within the normal reference range?",
      "What do my blood numbers indicate about my immune readiness and oxygen delivery?",
      "When is my next routine complete blood count recommended?"
    ]
  },
  {
    term: "Antibiotic",
    aliases: ["antibiotic", "antibiotics", "antibacterial", "amoxicillin", "penicillin", "azithromycin"],
    category: "Pharmacology",
    simpleName: "Medication That Kills or Slows Down Bacteria",
    meaning: "A type of medication used specifically to treat bacterial infections by killing bacteria or stopping them from multiplying. Antibiotics have ZERO effect against viruses like the common cold, flu, or COVID-19.",
    analogy: "Like a targeted weed killer designed specifically to clear invasive weeds without harming the grass — it only works on its intended target (bacteria).",
    whyChecked: "Prescribed carefully by doctors only when a bacterial infection is confirmed, to ensure it works effectively and prevent antibiotic resistance.",
    doctorQuestions: [
      "Is an antibiotic truly necessary for my condition, or is this caused by a virus?",
      "Should I take this medication with food or on an empty stomach?",
      "How important is it that I finish every single day of the prescribed course?"
    ]
  },
  {
    term: "Prescription",
    aliases: ["prescription", "medication", "medicine", "rx", "dosage", "drug therapy"],
    category: "Pharmacy / Clinical Care",
    simpleName: "Doctor-Directed Medication Instructions",
    meaning: "A written order from a licensed healthcare provider authorizing a patient to receive a specific medicine, detailing the exact dosage, frequency (e.g. twice daily), duration, and safety precautions.",
    analogy: "Like a precision recipe created by a chef tailored specifically for your dietary needs — following the exact measurements produces the best result.",
    whyChecked: "Reviewed at every doctor visit to prevent drug interactions, ensure safe dosing, and confirm the medicine is achieving its therapeutic goal.",
    doctorQuestions: [
      "What is the exact purpose of this prescription, and how does it help my condition?",
      "What common side effects should I watch for, and what should I do if they occur?",
      "How long do you expect I will need to take this medication?"
    ]
  },
  {
    term: "Symptom vs Diagnosis",
    aliases: ["symptom", "diagnosis", "condition", "clinical diagnosis", "difference between symptom and diagnosis"],
    category: "Clinical Terminology",
    simpleName: "What You Feel (Symptom) vs. What Causes It (Diagnosis)",
    meaning: "A 'symptom' is a physical sensation you feel and report (like a headache, fever, or cough). A 'diagnosis' is the doctor's identification of the medical condition causing those symptoms (like a migraine, flu, or asthma).",
    analogy: "A symptom is like smoke rising in the distance; the diagnosis is identifying whether the smoke comes from a campfire, a chimney, or a forest fire.",
    whyChecked: "Doctors listen carefully to your symptoms, perform exams, and run tests to reach the correct underlying diagnosis.",
    doctorQuestions: [
      "What underlying diagnosis is causing the symptoms I've been feeling?",
      "What tests confirm this diagnosis?",
      "What is the difference between treating my symptoms and treating the root cause?"
    ]
  },
  {
    term: "Normal vs Abnormal Test Results",
    aliases: ["normal", "abnormal", "positive result", "negative result", "test result", "lab result", "within normal limits", "out of range"],
    category: "Laboratory / Diagnostics",
    simpleName: "Understanding Reference Ranges on Lab Reports",
    meaning: "A 'normal' result falls within the expected healthy reference range established for most people. An 'abnormal' result is slightly higher or lower than the reference range, signaling that your care team should take a closer look.",
    analogy: "Like the green safe zone on a tire pressure gauge — small fluctuations are normal, but being outside the green line indicates it's time for a routine adjustment.",
    whyChecked: "Doctors evaluate test results in the context of your complete health story — a single slightly high or low number often has a simple, temporary explanation.",
    doctorQuestions: [
      "Which specific lab results were outside the standard reference range?",
      "Is this abnormal score mild and temporary, or does it require medication or lifestyle changes?",
      "When should we repeat this test to check if the numbers have normalized?"
    ]
  },

  // Ophthalmology / Vision Care & Refractive Errors
  {
    term: "Hypermetropia",
    aliases: ["hypermetropia", "hyperopia", "farsightedness", "long-sightedness", "far-sightedness", "hypermetropic", "farsighted"],
    category: "Ophthalmology / Vision Care",
    simpleName: "Farsightedness (Difficulty Seeing Nearby Objects Clearly)",
    meaning: "Farsightedness (hypermetropia) is a very common refractive error of the eye where distant objects are seen more clearly than near objects. It occurs when light rays entering the eye focus behind the retina instead of directly on its light-sensitive surface.",
    analogy: "Like a projector screen positioned slightly too close to the projector — the sharp picture is cast on the wall behind the screen, making the image on the screen look soft and out of focus until adjusted with a plus lens.",
    whyChecked: "Diagnosed by optometrists and ophthalmologists during visual acuity tests and refraction exams to prescribe convex (+) corrective lenses, relieve chronic eye strain, and eliminate reading headaches.",
    causes: "The eyeball is structurally slightly shorter than average from front to back, or the cornea (clear front window of the eye) has too little curvature.",
    symptoms: "Eyestrain, aching or burning sensation around the eyes, frontal headaches after reading or close computer work, and blurred vision when focusing on nearby text.",
    diagnosis: "Comprehensive dilated eye exam, visual acuity chart, and phoropter refraction assessment.",
    treatmentOverview: "Prescription eyeglasses with convex lenses (+ diopters), contact lenses, or refractive surgery (such as LASIK or PRK) in suitable adults.",
    whenToSeekCare: "Schedule an eye appointment if you experience frequent eyestrain, headaches after reading, or difficulty focusing on nearby tasks.",
    sourceReferences: "National Eye Institute (NEI), MedlinePlus, American Academy of Ophthalmology (AAO)",
    doctorQuestions: [
      "What diopter prescription strength do I need for reading and near computer work?",
      "Will wearing corrective eyeglasses prevent my near vision from getting worse?",
      "Can applying the 20-20-20 rule (looking 20 feet away every 20 minutes) reduce my reading eyestrain?"
    ]
  },
  {
    term: "Hyperopia",
    aliases: ["hyperopia", "hypermetropia", "farsightedness", "long-sightedness", "far sightedness"],
    category: "Ophthalmology / Vision Care",
    simpleName: "Farsightedness (Hypermetropia)",
    meaning: "Hyperopia is the clinical term interchangeable with hypermetropia, describing a common optical condition where light rays focus behind the retina, causing close-up tasks to appear blurred or tire the eyes.",
    analogy: "Like camera autofocus struggling to lock onto a book held right up close because the lens cannot flex enough without an optical booster.",
    whyChecked: "Evaluated routinely in children and adults to ensure clear binocular vision and prevent eye fatigue.",
    causes: "Shorter axial length of the globe or flatter corneal curvature.",
    symptoms: "Fatigue, headache, blurriness during near tasks.",
    diagnosis: "Retinoscopy and subjective refraction testing.",
    treatmentOverview: "Convex eyeglasses, contact lenses, refractive surgery.",
    whenToSeekCare: "See an eye care specialist if near vision is blurred or causes headaches.",
    sourceReferences: "National Eye Institute (NEI), MedlinePlus",
    doctorQuestions: [
      "Do I need to wear glasses all day or only while reading and using screens?",
      "How frequently should I schedule follow-up vision checks?"
    ]
  },
  {
    term: "Myopia",
    aliases: ["myopia", "nearsightedness", "short-sightedness", "near-sightedness", "myopic", "nearsighted"],
    category: "Ophthalmology / Vision Care",
    simpleName: "Nearsightedness (Difficulty Seeing Distant Objects Clearly)",
    meaning: "Nearsightedness (myopia) is a common refractive error where close objects appear sharp and clear, but distant objects (like road signs, classroom boards, or TV screens) appear blurry and out of focus because light focuses in front of the retina.",
    analogy: "Like a projector focusing its sharp image in the air several inches in front of the screen rather than crisp on the screen surface.",
    whyChecked: "Diagnosed by eye doctors to prescribe concave (-) lenses, optimize distance visual acuity, and monitor progressive axial elongation.",
    causes: "The eyeball is slightly too long from front to back, or the cornea is curved too steeply.",
    symptoms: "Squinting to see road signs, headaches from eye fatigue, blurred distant vision, needing to sit closer to television or board.",
    diagnosis: "Snellen eye chart visual acuity test and objective refraction.",
    treatmentOverview: "Concave eyeglasses (- diopters), contact lenses, orthokeratology, or refractive surgery (LASIK / SMILE) in adults.",
    whenToSeekCare: "Schedule an eye examination if you notice difficulty reading signs while driving or find yourself squinting at distances.",
    sourceReferences: "National Eye Institute (NEI), American Optometric Association (AOA), MedlinePlus",
    doctorQuestions: [
      "What is my current prescription power (- diopters), and has it changed since my last visit?",
      "Can spending more time outdoors in natural light slow down myopia progression?",
      "Am I a good candidate for contact lenses or laser vision correction?"
    ]
  },
  {
    term: "Astigmatism",
    aliases: ["astigmatism", "corneal astigmatism", "irregular cornea curvature", "cylinder power", "cylindrical refractive error", "astigmatic"],
    category: "Ophthalmology / Vision Care",
    simpleName: "Irregular Cornea Curvature (Blurry Vision at All Distances)",
    meaning: "An optical imperfection in which the clear front surface of the eye (cornea) or the crystalline lens has an irregular, oblong curvature — shaped more like a football than a round basketball — causing blurred or stretched vision at all distances.",
    analogy: "Looking through the curved, wavy glass of an antique bottle where straight lines appear slightly stretched, tilted, or doubled.",
    whyChecked: "Identified with keratometry and corneal topography to prescribe specialized toric lenses with cylinder and axis correction.",
    causes: "Uneven curvature of the cornea or intraocular lens, often inherited or occurring naturally alongside myopia or hyperopia.",
    symptoms: "Blurry or distorted vision at both near and far distances, eyestrain, squinting, difficulty seeing clearly during night driving.",
    diagnosis: "Phoropter refraction, keratometry, and corneal topography mapping.",
    treatmentOverview: "Toric eyeglasses or contact lenses, rigid gas permeable lenses, or refractive surgery.",
    whenToSeekCare: "Visit an optometrist if you experience blurred or ghosted outlines around letters at any distance.",
    sourceReferences: "National Eye Institute (NEI), MedlinePlus",
    doctorQuestions: [
      "What are the cylinder and axis numbers on my prescription indicating my astigmatism?",
      "Would toric soft contact lenses provide clear, stable vision for my daily activities?"
    ]
  },
  {
    term: "Presbyopia",
    aliases: ["presbyopia", "age-related reading vision loss", "reading glasses power", "presbyopic"],
    category: "Ophthalmology / Vision Care",
    simpleName: "Age-Related Loss of Close Focusing Power",
    meaning: "The gradual, natural loss of the eye's ability to focus actively on nearby objects as part of the aging process, typically becoming noticeable in the early to mid-40s as the natural crystalline lens inside the eye becomes firmer and less flexible.",
    analogy: "Like an old camera lens whose zoom ring has stiffened over time — it still takes clear panoramic photos of the landscape, but struggles to zoom into micro close-ups.",
    whyChecked: "Routinely diagnosed during middle-age eye exams to prescribe reading glasses, bifocals, or progressive lenses.",
    causes: "Natural stiffening and reduced elasticity of the crystalline lens and ciliary muscles inside the eye.",
    symptoms: "Holding reading material at arm's length to focus, eyestrain or fatigue after close work, headaches when reading fine print in dim light.",
    diagnosis: "Standard near-vision reading acuity chart testing.",
    treatmentOverview: "Over-the-counter or prescription reading glasses, bifocal or progressive lenses, multifocal contact lenses.",
    whenToSeekCare: "Consult an eye doctor when you find yourself holding your phone or books farther away to read them clearly.",
    sourceReferences: "National Eye Institute (NEI), Mayo Clinic, MedlinePlus",
    doctorQuestions: [
      "Would progressive lenses or separate reading glasses work best for my daily work?",
      "How frequently should I expect my reading prescription to increase as I age?"
    ]
  },
  {
    term: "Cataract",
    aliases: ["cataract", "cataracts", "cloudy eye lens", "lens opacification"],
    category: "Ophthalmology / Vision Care",
    simpleName: "Clouding of the Eye's Natural Lens",
    meaning: "A common condition where the clear, natural lens inside the eye becomes cloudy or yellowish over time, preventing light from passing cleanly to the retina, resulting in hazy, foggy, or dimmer vision.",
    analogy: "Like looking out through a frosty, fogged-up bathroom window on a cold morning — shapes and lights still come through, but fine details and colors look faded and cloudy.",
    whyChecked: "Ophthalmologists check with a slit-lamp biomicroscope to measure lens clarity and determine if surgical lens replacement is needed.",
    causes: "Aging, UV light exposure, diabetes, smoking, corticosteroid use, or prior eye trauma.",
    symptoms: "Painless gradual clouding of vision, increased glare and halos around headlights at night, faded color perception, needing brighter light to read.",
    diagnosis: "Slit-lamp examination, visual acuity test, and dilated retinal exam.",
    treatmentOverview: "Updated eyeglasses in early stages; safe, standard outpatient cataract surgery with artificial intraocular lens (IOL) implantation when vision impairs daily tasks.",
    whenToSeekCare: "Seek care if blurred vision or night driving glare interferes with your normal driving, reading, or daily independence.",
    sourceReferences: "National Eye Institute (NEI), American Academy of Ophthalmology (AAO), MedlinePlus",
    doctorQuestions: [
      "Is my cataract mild enough to manage with brighter reading lights and stronger glasses, or is surgery appropriate?",
      "What types of intraocular replacement lenses (monofocal, toric, multifocal) are suitable for my eyes?"
    ]
  },
  {
    term: "Glaucoma",
    aliases: ["glaucoma", "high eye pressure", "ocular hypertension", "optic nerve damage"],
    category: "Ophthalmology / Vision Care",
    simpleName: "Optic Nerve Condition Usually Caused by High Fluid Pressure in the Eye",
    meaning: "A group of eye diseases that cause progressive damage to the optic nerve (the cable carrying visual signals from the eye to the brain), most often related to elevated intraocular fluid pressure (IOP). It is often called the 'silent thief of sight' because early stages cause no pain or warning signs.",
    analogy: "Like high water pressure inside a delicate pipe system slowly compressing and damaging the sensitive electrical wiring running right beside the pipe.",
    whyChecked: "Tested during routine eye exams using tonometry (eye pressure measurement) and optical coherence tomography (OCT) to detect and protect the optic nerve before permanent peripheral vision is lost.",
    causes: "Imbalance between fluid production and drainage through the eye's trabecular meshwork, resulting in buildup of fluid pressure.",
    symptoms: "Usually zero early symptoms in open-angle glaucoma; gradual loss of peripheral (side) vision; acute angle-closure causes sudden severe eye pain, nausea, and halos around lights.",
    diagnosis: "Tonometry (eye pressure), gonioscopy (drainage angle exam), visual field test, and OCT optic nerve scan.",
    treatmentOverview: "Daily prescription pressure-lowering eye drops, laser trabeculoplasty, or minimally invasive glaucoma surgery (MIGS) to protect existing vision.",
    whenToSeekCare: "Routine screening is critical every 1–2 years; sudden eye pain with nausea and rainbow halos requires emergency medical evaluation.",
    sourceReferences: "National Eye Institute (NEI), Glaucoma Research Foundation, MedlinePlus",
    doctorQuestions: [
      "What is my target eye pressure (IOP), and are my current eye drops keeping it stable?",
      "How often do I need a visual field test and OCT optic nerve scan to verify that my vision is protected?"
    ]
  },

  // Endocrinology & Metabolic Conditions
  {
    term: "Hypoglycemia",
    aliases: ["hypoglycemia", "low blood sugar", "low glucose", "sugar crash", "hypoglycemic"],
    category: "Endocrinology / Metabolism",
    simpleName: "Low Blood Sugar (Below 70 mg/dL)",
    meaning: "A clinical condition where the concentration of glucose circulating in the bloodstream falls below healthy levels (typically defined as less than 70 mg/dL), leaving body cells and the brain without their primary energy source.",
    analogy: "Like your car's fuel tank running on empty while driving on the highway — the engine begins sputtering, hesitating, and threatens to stall unless rapidly refueled.",
    whyChecked: "Monitored closely in patients taking diabetes medications (especially insulin or sulfonylureas) to prevent dangerous drops in consciousness.",
    causes: "Taking too much diabetes medicine or insulin, skipping or delaying a meal, unusual heavy physical exertion, or excessive alcohol.",
    symptoms: "Shakiness, rapid heartbeat, cold sweating, dizziness, sudden hunger, confusion, irritability, and blurred vision.",
    diagnosis: "Immediate capillary fingerstick blood glucose measurement (< 70 mg/dL).",
    treatmentOverview: "The 'Rule of 15': Consume 15 grams of fast-acting carbohydrates (4 oz juice, 3–4 glucose tablets), recheck glucose in 15 minutes, repeat if still low. Severe episodes require prescription glucagon.",
    whenToSeekCare: "Seek immediate emergency care (call 112 / 108 / 911) if confusion worsens, the patient cannot safely swallow, or a seizure occurs.",
    sourceReferences: "American Diabetes Association (ADA), National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK), MedlinePlus",
    doctorQuestions: [
      "What is my personal low blood sugar threshold, and should my medication doses be adjusted?",
      "Do I need an emergency glucagon nasal spray or autoinjector prescribed for my family to keep on hand?"
    ]
  },
  {
    term: "Hyperglycemia",
    aliases: ["hyperglycemia", "high blood sugar", "high glucose", "elevated blood sugar", "hyperglycemic"],
    category: "Endocrinology / Metabolism",
    simpleName: "High Blood Sugar (Above Normal Targets)",
    meaning: "A state where an abnormally high concentration of glucose circulates in the blood plasma, commonly occurring in diabetes when the body produces insufficient insulin or cells resist insulin's actions.",
    analogy: "Like syrup being poured into a car's cooling lines instead of clean water — the thickened, sugary fluid flows sluggishly and slowly damages sensitive pipes and filters over time.",
    whyChecked: "Tested routinely with fasting blood sugar and HbA1c to prevent long-term damage to blood vessels, kidneys, nerves, and retinas.",
    causes: "Insufficient diabetes medication, high-carbohydrate meals, illness or infection, psychological stress, or physical inactivity.",
    symptoms: "Frequent urination (polyuria), unquenchable thirst (polydipsia), dry mouth, unexplained fatigue, and blurred vision.",
    diagnosis: "Fasting plasma glucose (≥ 126 mg/dL), postprandial glucose (> 180–200 mg/dL), or elevated HbA1c (≥ 6.5%).",
    treatmentOverview: "Dietary adjustments, increased water hydration, regular physical activity, and doctor-prescribed diabetes medications (like metformin or insulin).",
    whenToSeekCare: "Contact your doctor if blood sugar stays consistently high above 240 mg/dL or if you develop fruity breath, nausea, or deep breathing (signs of DKA).",
    sourceReferences: "American Diabetes Association (ADA), CDC Diabetes Resources, MedlinePlus",
    doctorQuestions: [
      "What are my daily target blood sugar ranges before and after meals?",
      "What adjustments should I make to my diet and exercise plan to keep my levels steady?"
    ]
  }
];

/**
 * Verified State-Specific Emergency Helplines & Healthcare Resources
 * Covers major Indian states with official 24x7 government services, public hospitals, and schemes
 */
const STATE_EMERGENCY_DATA = {
  karnataka: {
    stateCode: 'KA',
    stateName: 'Karnataka',
    nativeName: 'ಕರ್ನಾಟಕ',
    ambulance: '108',
    ambulanceLabel: 'Arogya Kavacha (108 Ambulance)',
    healthHelpline: '104',
    healthHelplineLabel: 'Arogya Vani (104 Tele-Health Advisory)',
    nationalEmergency: '112',
    womenHelpline: '181',
    mentalHealth: '14416',
    mentalHealthLabel: 'Tele-MANAS Karnataka (14416 / 1800-891-4416)',
    poisonHelpline: '1800-425-1213',
    publicHospitals: [
      { name: 'Victoria Hospital (BMCRI)', city: 'Bengaluru', phone: '080-26701150', type: 'Tertiary Government Hospital', emergency: '24x7 Trauma & Emergency' },
      { name: 'Bowring and Lady Curzon Hospital', city: 'Bengaluru', phone: '080-25591325', type: 'Government Hospital', emergency: '24x7 Casualty' },
      { name: 'NIMHANS (Mental Health & Neuro Sciences)', city: 'Bengaluru', phone: '080-26995000', type: 'National Institute', emergency: '24x7 Neuro-Casualty' },
      { name: 'KIMS Hospital', city: 'Hubballi', phone: '0836-2370057', type: 'Government Medical College Hospital', emergency: '24x7 Emergency Ward' },
      { name: 'K.R. Hospital (MMCRI)', city: 'Mysuru', phone: '0821-2520512', type: 'District Teaching Hospital', emergency: '24x7 Casualty' }
    ],
    officialSchemes: [
      { name: 'Arogya Karnataka (SAST)', url: 'https://arogya.karnataka.gov.in', description: 'Universal healthcare coverage for state residents' },
      { name: 'Ayushman Bharat PM-JAY', url: 'https://pmjay.gov.in', description: 'National cashless health insurance scheme up to ₹5 Lakh' },
      { name: 'eSanjeevani Teleconsultation', url: 'https://esanjeevani.mohfw.gov.in', description: 'Free online OPD doctor consultations' }
    ]
  },
  maharashtra: {
    stateCode: 'MH',
    stateName: 'Maharashtra',
    nativeName: 'महाराष्ट्र',
    ambulance: '108',
    ambulanceLabel: 'MEMS (108 Emergency Ambulance)',
    healthHelpline: '104',
    healthHelplineLabel: 'Maharashtra Health Helpline (104)',
    nationalEmergency: '112',
    womenHelpline: '181',
    mentalHealth: '14416',
    mentalHealthLabel: 'Tele-MANAS Maharashtra (14416)',
    poisonHelpline: '022-24107000',
    publicHospitals: [
      { name: 'KEM Hospital & Seth G.S. Medical College', city: 'Mumbai', phone: '022-24107000', type: 'Municipal Tertiary Hospital', emergency: '24x7 Emergency & Trauma' },
      { name: 'Sir J.J. Group of Hospitals', city: 'Mumbai', phone: '022-23735555', type: 'State Government Teaching Hospital', emergency: '24x7 Emergency Casualty' },
      { name: 'Lokmanya Tilak Municipal General Hospital (Sion)', city: 'Mumbai', phone: '022-24076381', type: 'Tertiary Trauma Center', emergency: '24x7 Level-1 Trauma' },
      { name: 'Sassoon General Hospital (BJ Medical College)', city: 'Pune', phone: '020-26128000', type: 'Government General Hospital', emergency: '24x7 Casualty Ward' },
      { name: 'Government Medical College & Hospital', city: 'Nagpur', phone: '0712-2744671', type: 'Government Medical College', emergency: '24x7 Emergency Care' }
    ],
    officialSchemes: [
      { name: 'Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)', url: 'https://www.jeevandayee.gov.in', description: 'State flagship cashless health assurance scheme' },
      { name: 'Ayushman Bharat PM-JAY', url: 'https://pmjay.gov.in', description: 'National health insurance up to ₹5 Lakh/family' },
      { name: 'eSanjeevani Teleconsultation', url: 'https://esanjeevani.mohfw.gov.in', description: 'Official government teleconsultation portal' }
    ]
  },
  andhra_pradesh: {
    stateCode: 'AP',
    stateName: 'Andhra Pradesh',
    nativeName: 'ఆంధ్రప్రదేశ్',
    ambulance: '108',
    ambulanceLabel: '108 Emergency Ambulance Services',
    healthHelpline: '104',
    healthHelplineLabel: '104 Health Advisory Helpline',
    nationalEmergency: '112',
    womenHelpline: '181',
    mentalHealth: '14416',
    mentalHealthLabel: 'Tele-MANAS AP (14416)',
    poisonHelpline: '1800-116-117',
    publicHospitals: [
      { name: 'King George Hospital (Andhra Medical College)', city: 'Visakhapatnam', phone: '0891-2564891', type: 'Government Teaching Hospital', emergency: '24x7 Casualty & Trauma' },
      { name: 'Government General Hospital (GGH)', city: 'Guntur', phone: '0863-2224101', type: 'Government Tertiary Hospital', emergency: '24x7 Emergency Department' },
      { name: 'SVIMS (Sri Venkateswara Institute of Medical Sciences)', city: 'Tirupati', phone: '0877-2287777', type: 'Autonomous Tertiary Care', emergency: '24x7 Emergency Services' },
      { name: 'Government General Hospital', city: 'Kurnool', phone: '08518-255301', type: 'District Medical Hospital', emergency: '24x7 Casualty' }
    ],
    officialSchemes: [
      { name: 'Dr. YSR Aarogyasri Scheme', url: 'https://ysraarogyasri.ap.gov.in', description: 'Comprehensive cashless healthcare for eligible AP residents' },
      { name: 'Ayushman Bharat PM-JAY', url: 'https://pmjay.gov.in', description: 'National cashless coverage up to ₹5 Lakh' },
      { name: 'eSanjeevani Teleconsultation', url: 'https://esanjeevani.mohfw.gov.in', description: 'Free government tele-OPD medical consultations' }
    ]
  },
  telangana: {
    stateCode: 'TG',
    stateName: 'Telangana',
    nativeName: 'తెలంగాణ',
    ambulance: '108',
    ambulanceLabel: '108 Emergency Response Service',
    healthHelpline: '104',
    healthHelplineLabel: '104 Fixed Day Health Helpline',
    nationalEmergency: '112',
    womenHelpline: '181',
    mentalHealth: '14416',
    mentalHealthLabel: 'Tele-MANAS Telangana (14416)',
    poisonHelpline: '040-23465000',
    publicHospitals: [
      { name: 'Osmania General Hospital', city: 'Hyderabad', phone: '040-24600121', type: 'Government General Hospital', emergency: '24x7 Trauma & Casualty' },
      { name: 'Gandhi Hospital & Medical College', city: 'Secunderabad', phone: '040-27505566', type: 'Premier Government Hospital', emergency: '24x7 Emergency Services' },
      { name: 'Nizam\'s Institute of Medical Sciences (NIMS)', city: 'Hyderabad', phone: '040-23489000', type: 'Autonomous Super Specialty', emergency: '24x7 Acute Medical Care' },
      { name: 'MGM Hospital', city: 'Warangal', phone: '0870-2441201', type: 'Government Teaching Hospital', emergency: '24x7 Casualty Department' }
    ],
    officialSchemes: [
      { name: 'Aarogyasri Telangana Health Scheme', url: 'https://aarogyasri.telangana.gov.in', description: 'Cashless treatment for catastrophic illnesses' },
      { name: 'Ayushman Bharat PM-JAY', url: 'https://pmjay.gov.in', description: 'National health protection scheme' },
      { name: 'eSanjeevani Teleconsultation', url: 'https://esanjeevani.mohfw.gov.in', description: 'Online consultations with verified government doctors' }
    ]
  },
  tamil_nadu: {
    stateCode: 'TN',
    stateName: 'Tamil Nadu',
    nativeName: 'தமிழ்நாடு',
    ambulance: '108',
    ambulanceLabel: 'GVK EMRI (108 Ambulance)',
    healthHelpline: '104',
    healthHelplineLabel: '104 Health Helpline (24x7 Medical Advisory)',
    nationalEmergency: '112',
    womenHelpline: '181',
    mentalHealth: '14416',
    mentalHealthLabel: 'Tele-MANAS TN (14416) / Sneha (044-24640050)',
    poisonHelpline: '044-25305111',
    publicHospitals: [
      { name: 'Rajiv Gandhi Government General Hospital (MMC)', city: 'Chennai', phone: '044-25305000', type: 'State Premier Hospital', emergency: '24x7 Level-1 Trauma' },
      { name: 'Government Stanley Medical College Hospital', city: 'Chennai', phone: '044-25280900', type: 'Tertiary Teaching Hospital', emergency: '24x7 Casualty & Trauma' },
      { name: 'Government Rajaji Hospital', city: 'Madurai', phone: '0452-2532535', type: 'Major Government Referral Hospital', emergency: '24x7 Emergency Care' },
      { name: 'Coimbatore Medical College Hospital', city: 'Coimbatore', phone: '0422-2301393', type: 'Government Medical College Hospital', emergency: '24x7 Casualty' }
    ],
    officialSchemes: [
      { name: 'Chief Minister\'s Comprehensive Health Insurance (CMCHIS)', url: 'https://www.cmchistn.com', description: 'Cashless hospital care up to ₹5 Lakh per year' },
      { name: 'Innuyir Kaappom - Nammai Kaakkum 48', url: 'https://tnhealth.tn.gov.in', description: 'Emergency treatment for first 48 hours for road accidents' },
      { name: 'eSanjeevani Teleconsultation', url: 'https://esanjeevani.mohfw.gov.in', description: 'National telemedicine service' }
    ]
  },
  kerala: {
    stateCode: 'KL',
    stateName: 'Kerala',
    nativeName: 'കേരളം',
    ambulance: '108',
    ambulanceLabel: 'Kaniv 108 Ambulance Services',
    healthHelpline: '1056',
    healthHelplineLabel: 'DISHA Health Helpline (1056 / 0471-2552056)',
    nationalEmergency: '112',
    womenHelpline: '181',
    mentalHealth: '14416',
    mentalHealthLabel: 'Tele-MANAS Kerala (14416)',
    poisonHelpline: '0484-2801234',
    publicHospitals: [
      { name: 'Government Medical College Hospital', city: 'Thiruvananthapuram', phone: '0471-2528300', type: 'Premier Government Medical College', emergency: '24x7 Emergency & Trauma' },
      { name: 'Government Medical College Hospital', city: 'Kozhikode', phone: '0495-2350216', type: 'Government Tertiary Hospital', emergency: '24x7 Emergency Services' },
      { name: 'Government Medical College Hospital', city: 'Kottayam', phone: '0481-2597284', type: 'Teaching Government Hospital', emergency: '24x7 Casualty' },
      { name: 'General Hospital', city: 'Ernakulam', phone: '0484-2361251', type: 'NABH Accredited District Hospital', emergency: '24x7 Casualty Ward' }
    ],
    officialSchemes: [
      { name: 'Karunya Arogya Suraksha Padhathi (KASP)', url: 'https://sha.kerala.gov.in', description: 'Cashless healthcare scheme covering up to ₹5 Lakh' },
      { name: 'Aardram Mission Public Health', url: 'https://dhs.kerala.gov.in', description: 'Family Health Centers and primary care transformation' },
      { name: 'eSanjeevani Teleconsultation', url: 'https://esanjeevani.mohfw.gov.in', description: 'Direct doctor consultation online' }
    ]
  },
  delhi: {
    stateCode: 'DL',
    stateName: 'Delhi (NCT)',
    nativeName: 'दिल्ली',
    ambulance: '102',
    ambulanceLabel: 'CATS Ambulance (102 / 108)',
    healthHelpline: '104',
    healthHelplineLabel: 'Delhi Health Information Helpline (104)',
    nationalEmergency: '112',
    womenHelpline: '181',
    mentalHealth: '14416',
    mentalHealthLabel: 'Tele-MANAS Delhi (14416)',
    poisonHelpline: '011-26589391',
    publicHospitals: [
      { name: 'AIIMS (All India Institute of Medical Sciences)', city: 'New Delhi', phone: '011-26588500', type: 'National Premier Institute', emergency: '24x7 Emergency Medicine' },
      { name: 'Safdarjung Hospital', city: 'New Delhi', phone: '011-26165060', type: 'Central Government Hospital', emergency: '24x7 Emergency & Trauma Center' },
      { name: 'Lok Nayak Hospital (LNJP - MAMC)', city: 'New Delhi', phone: '011-23233000', type: 'Delhi Govt Premier Hospital', emergency: '24x7 Casualty Department' },
      { name: 'Dr. Ram Manohar Lohia Hospital (RML)', city: 'New Delhi', phone: '011-23365525', type: 'Central Government Hospital', emergency: '24x7 Emergency Services' }
    ],
    officialSchemes: [
      { name: 'Delhi Arogya Kosh (DAK)', url: 'https://health.delhigovt.nic.in', description: 'Financial assistance for treatment, diagnostics, and surgeries' },
      { name: 'Aam Aadmi Mohalla Clinics', url: 'https://delhi.gov.in', description: 'Free primary healthcare and diagnostic testing' },
      { name: 'eSanjeevani Teleconsultation', url: 'https://esanjeevani.mohfw.gov.in', description: 'National telemedicine service' }
    ]
  },
  gujarat: {
    stateCode: 'GJ',
    stateName: 'Gujarat',
    nativeName: 'ગુજરાત',
    ambulance: '108',
    ambulanceLabel: 'GVK EMRI (108 Ambulance Services)',
    healthHelpline: '104',
    healthHelplineLabel: '104 Health Advisory Helpline',
    nationalEmergency: '112',
    womenHelpline: '181',
    mentalHealth: '14416',
    mentalHealthLabel: 'Tele-MANAS Gujarat (14416)',
    poisonHelpline: '1800-116-117',
    publicHospitals: [
      { name: 'Civil Hospital (BJ Medical College)', city: 'Ahmedabad', phone: '079-22683721', type: 'Asia\'s Largest Civil Hospital', emergency: '24x7 Trauma & Emergency Center' },
      { name: 'New Civil Hospital', city: 'Surat', phone: '0261-2244456', type: 'Government Teaching Hospital', emergency: '24x7 Casualty Department' },
      { name: 'Sir Sayajirao General Hospital (SSG)', city: 'Vadodara', phone: '0265-2424848', type: 'Government Tertiary Hospital', emergency: '24x7 Emergency Services' },
      { name: 'PDU Government Medical College Hospital', city: 'Rajkot', phone: '0281-2454151', type: 'District Medical College Hospital', emergency: '24x7 Casualty' }
    ],
    officialSchemes: [
      { name: 'Mukhyamantri Amrutam (MA) & PM-JAY', url: 'https://gujhealth.gujarat.gov.in', description: 'Tertiary cashless healthcare up to ₹10 Lakh' },
      { name: 'Ayushman Bharat PM-JAY', url: 'https://pmjay.gov.in', description: 'National health insurance scheme' },
      { name: 'eSanjeevani Teleconsultation', url: 'https://esanjeevani.mohfw.gov.in', description: 'Online consultations with government doctors' }
    ]
  },
  west_bengal: {
    stateCode: 'WB',
    stateName: 'West Bengal',
    nativeName: 'পশ্চিমবঙ্গ',
    ambulance: '108',
    ambulanceLabel: '108 / 102 Emergency Ambulance',
    healthHelpline: '1800-345-3261',
    healthHelplineLabel: 'Swasthya Ingit Helpline (1800-345-3261 / 104)',
    nationalEmergency: '112',
    womenHelpline: '181',
    mentalHealth: '14416',
    mentalHealthLabel: 'Tele-MANAS WB (14416)',
    poisonHelpline: '1800-116-117',
    publicHospitals: [
      { name: 'IPGMER & SSKM Hospital', city: 'Kolkata', phone: '033-22231589', type: 'State Premier Referral Hospital', emergency: '24x7 Level-1 Trauma' },
      { name: 'Medical College and Hospital', city: 'Kolkata', phone: '033-22551621', type: 'Historic Government Medical College', emergency: '24x7 Emergency Services' },
      { name: 'Nil Ratan Sircar Medical College (NRS)', city: 'Kolkata', phone: '033-22860033', type: 'Government Teaching Hospital', emergency: '24x7 Emergency Department' },
      { name: 'North Bengal Medical College Hospital', city: 'Siliguri', phone: '0353-2585461', type: 'Regional Teaching Hospital', emergency: '24x7 Casualty' }
    ],
    officialSchemes: [
      { name: 'Swasthya Sathi Scheme', url: 'https://swasthyasathi.gov.in', description: 'Cashless smart-card health cover up to ₹5 Lakh/family' },
      { name: 'Swasthya Ingit Telemedicine', url: 'https://www.wbhealth.gov.in', description: 'State telemedicine consultation service' },
      { name: 'eSanjeevani Teleconsultation', url: 'https://esanjeevani.mohfw.gov.in', description: 'National telemedicine consultation portal' }
    ]
  },
  all_india: {
    stateCode: 'IN',
    stateName: 'All India (National Directory)',
    nativeName: 'National (India)',
    ambulance: '108',
    ambulanceLabel: 'National Ambulance Service (108)',
    healthHelpline: '104',
    healthHelplineLabel: 'National Health Helpline (104)',
    nationalEmergency: '112',
    womenHelpline: '181',
    mentalHealth: '14416',
    mentalHealthLabel: 'Tele-MANAS National Mental Health (14416 / 1800-891-4416)',
    poisonHelpline: '1800-116-117',
    publicHospitals: [
      { name: 'AIIMS New Delhi', city: 'New Delhi', phone: '011-26588500', type: 'National Apex Institute', emergency: '24x7 Emergency & Trauma' },
      { name: 'PGIMER', city: 'Chandigarh', phone: '0172-2746018', type: 'Premier Medical Research Institute', emergency: '24x7 Emergency OPD' },
      { name: 'JIPMER', city: 'Puducherry', phone: '0413-2272380', type: 'Institute of National Importance', emergency: '24x7 Emergency & Trauma' },
      { name: 'Victoria Hospital (BMCRI)', city: 'Bengaluru', phone: '080-26701150', type: 'Tertiary Government Hospital', emergency: '24x7 Trauma' },
      { name: 'KEM Hospital', city: 'Mumbai', phone: '022-24107000', type: 'Tertiary Teaching Hospital', emergency: '24x7 Trauma Center' }
    ],
    officialSchemes: [
      { name: 'Ayushman Bharat PM-JAY', url: 'https://pmjay.gov.in', description: 'World\'s largest government-funded health assurance scheme' },
      { name: 'eSanjeevani National Teleconsultation', url: 'https://esanjeevani.mohfw.gov.in', description: 'Ministry of Health 24x7 free tele-consultations' },
      { name: 'National Health Portal (NHP)', url: 'https://www.nhp.gov.in', description: 'Official healthcare directory and health wellness portal' },
      { name: 'e-Raktkosh Blood Bank Network', url: 'https://eraktkosh.in', description: 'National live blood stock directory' }
    ]
  },
  international: {
    stateCode: 'INTL',
    stateName: 'International / Global',
    nativeName: 'International (US/UK/EU)',
    ambulance: '911',
    ambulanceLabel: 'Emergency Services (911 in US/Canada)',
    healthHelpline: '111',
    healthHelplineLabel: 'Non-Emergency Health Advice (111 in UK / 811 in Canada)',
    nationalEmergency: '112',
    womenHelpline: '1-800-799-7233',
    mentalHealth: '988',
    mentalHealthLabel: 'Suicide & Crisis Lifeline (988 in US/Canada)',
    poisonHelpline: '1-800-222-1222',
    publicHospitals: [
      { name: 'Emergency Medical Services (US/Canada)', city: 'Nationwide', phone: '911', type: 'Immediate Emergency Response', emergency: 'Dial 911 immediately' },
      { name: 'NHS Emergency (UK)', city: 'UK Nationwide', phone: '999', type: 'National Health Service', emergency: 'Dial 999 for emergencies / 111 for advice' },
      { name: 'European Emergency Number', city: 'EU Nations', phone: '112', type: 'EU Pan-European Emergency', emergency: 'Dial 112 from any phone' }
    ],
    officialSchemes: [
      { name: 'World Health Organization (WHO)', url: 'https://www.who.int', description: 'Global public health guidance and alerts' },
      { name: 'CDC Health Resources', url: 'https://www.cdc.gov', description: 'Public health information and guidance' }
    ]
  }
};

// Aliases for seamless form bindings
STATE_EMERGENCY_DATA['national_india'] = STATE_EMERGENCY_DATA['all_india'];
STATE_EMERGENCY_DATA['international_us'] = STATE_EMERGENCY_DATA['international'];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SAMPLE_DOCUMENTS, MEDICAL_GLOSSARY, STATE_EMERGENCY_DATA };
}
