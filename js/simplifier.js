/**
 * MediBridge AI - Intelligent Medical Information Simplifier Engine
 * Features: 80+ Clinical Glossary Lookup, Latin/Greek Medical Morphology Deconstruction,
 * Conversational Query Extraction, Reading-Level Transformations, and Multilingual Support.
 */

class MedicalSimplifier {
  constructor() {
    this.glossary = (typeof MEDICAL_GLOSSARY !== 'undefined') ? MEDICAL_GLOSSARY : [];
    this.readingLevel = 'easy'; // 'easy' (5th Grade), 'standard', 'detailed'
    this.speechSynth = window.speechSynthesis || null;
    this.currentUtterance = null;

    // Medical Prefixes and Roots Dictionary (45+ clinical roots)
    this.prefixes = [
      { prefix: 'cardio', root: 'Heart', meaning: 'the heart and blood circulation' },
      { prefix: 'neuro', root: 'Brain / Nerves', meaning: 'the brain, nerves, and spinal cord' },
      { prefix: 'gastro', root: 'Stomach', meaning: 'the stomach and digestion' },
      { prefix: 'entero', root: 'Intestines', meaning: 'the small or large intestines' },
      { prefix: 'hepato', root: 'Liver', meaning: 'the liver' },
      { prefix: 'hepa', root: 'Liver', meaning: 'the liver' },
      { prefix: 'nephro', root: 'Kidney', meaning: 'the kidneys and filtration' },
      { prefix: 'reno', root: 'Kidney', meaning: 'the kidneys' },
      { prefix: 'pulmo', root: 'Lung', meaning: 'the lungs and respiration' },
      { prefix: 'pneumo', root: 'Lung / Air', meaning: 'the lungs and air passages' },
      { prefix: 'broncho', root: 'Airways', meaning: 'the bronchial breathing tubes' },
      { prefix: 'osteo', root: 'Bone', meaning: 'bones and skeletal structure' },
      { prefix: 'arthro', root: 'Joint', meaning: 'joints and cartilage' },
      { prefix: 'dermato', root: 'Skin', meaning: 'the skin and outer tissue' },
      { prefix: 'derm', root: 'Skin', meaning: 'the skin' },
      { prefix: 'myo', root: 'Muscle', meaning: 'muscle tissue' },
      { prefix: 'angio', root: 'Blood Vessel', meaning: 'blood vessels (arteries and veins)' },
      { prefix: 'vasculo', root: 'Blood Vessel', meaning: 'blood vessels' },
      { prefix: 'hemo', root: 'Blood', meaning: 'blood cells and circulation' },
      { prefix: 'hemato', root: 'Blood', meaning: 'blood' },
      { prefix: 'cholecyst', root: 'Gallbladder', meaning: 'the gallbladder' },
      { prefix: 'chole', root: 'Bile / Gallbladder', meaning: 'gallbladder and bile' },
      { prefix: 'pancreato', root: 'Pancreas', meaning: 'the pancreas' },
      { prefix: 'encephalo', root: 'Brain', meaning: 'the brain tissue' },
      { prefix: 'colo', root: 'Colon / Bowel', meaning: 'the large intestine' },
      { prefix: 'colono', root: 'Colon', meaning: 'the colon' },
      { prefix: 'cysto', root: 'Bladder', meaning: 'the urinary bladder' },
      { prefix: 'thyro', root: 'Thyroid', meaning: 'the thyroid gland' },
      { prefix: 'spleno', root: 'Spleen', meaning: 'the spleen' },
      { prefix: 'retino', root: 'Retina / Eye', meaning: 'the retina of the eye' },
      { prefix: 'laryngo', root: 'Voice Box', meaning: 'the larynx / vocal cords' },
      { prefix: 'pharyngo', root: 'Throat', meaning: 'the throat' },
      { prefix: 'rhino', root: 'Nose', meaning: 'the nose and nasal passages' },
      { prefix: 'oto', root: 'Ear', meaning: 'the ear and hearing' },
      { prefix: 'ophthalmo', root: 'Eye', meaning: 'the eye and vision' },
      { prefix: 'gingivo', root: 'Gums', meaning: 'the gums' },
      { prefix: 'phlebo', root: 'Vein', meaning: 'the veins' },
      { prefix: 'thrombo', root: 'Blood Clot', meaning: 'blood clotting' },
      { prefix: 'tachy', root: 'Fast / Rapid', meaning: 'abnormally fast or rapid' },
      { prefix: 'brady', root: 'Slow', meaning: 'abnormally slow' },
      { prefix: 'hyper', root: 'High / Excess', meaning: 'above normal or higher than target' },
      { prefix: 'hypo', root: 'Low / Deficient', meaning: 'below normal or lower than target' },
      { prefix: 'dys', root: 'Difficult / Painful', meaning: 'difficult, painful, or abnormal' },
      { prefix: 'glyco', root: 'Sugar / Glucose', meaning: 'blood sugar and energy' },
      { prefix: 'lipo', root: 'Fat / Lipid', meaning: 'body fats and cholesterol' }
    ];

    // Medical Suffixes Dictionary (25+ clinical endings)
    this.suffixes = [
      { suffix: 'itis', root: 'Inflammation', meaning: 'irritation, swelling, and redness of the tissue' },
      { suffix: 'megaly', root: 'Enlargement', meaning: 'abnormal enlargement or growing larger than normal size' },
      { suffix: 'pathy', root: 'Disorder / Condition', meaning: 'a disorder, disease, or damage to that structure' },
      { suffix: 'scopy', root: 'Visual Inspection', meaning: 'an examination using a tiny camera or viewing tube' },
      { suffix: 'ectomy', root: 'Surgical Removal', meaning: 'a surgical procedure to safely remove or take out that tissue' },
      { suffix: 'ostomy', root: 'Surgical Opening', meaning: 'creating an artificial opening for drainage or function' },
      { suffix: 'otomy', root: 'Surgical Incision', meaning: 'cutting into or making a surgical incision' },
      { suffix: 'algia', root: 'Pain / Aching', meaning: 'sharp, aching, or throbbing pain in that area' },
      { suffix: 'dynia', root: 'Pain', meaning: 'pain or severe discomfort' },
      { suffix: 'emia', root: 'In the Blood', meaning: 'a substance or condition present in the bloodstream' },
      { suffix: 'penia', root: 'Deficiency / Shortage', meaning: 'having an unusually low count or shortage of cells' },
      { suffix: 'cytosis', root: 'High Cell Count', meaning: 'having an elevated or high number of cells' },
      { suffix: 'oma', root: 'Tissue Growth / Tumor', meaning: 'a mass, cluster, or growth of cells' },
      { suffix: 'osis', root: 'Abnormal Condition', meaning: 'an ongoing or chronic condition affecting that tissue' },
      { suffix: 'iasis', root: 'Condition / Presence of', meaning: 'the presence or formation of abnormal matter' },
      { suffix: 'plasty', root: 'Surgical Repair', meaning: 'surgical repair, reconstruction, or replacement' },
      { suffix: 'stenosis', root: 'Narrowing', meaning: 'unusual narrowing or constriction of a passage' },
      { suffix: 'sclerosis', root: 'Hardening / Stiffening', meaning: 'abnormal hardening or loss of flexibility' },
      { suffix: 'pnea', root: 'Breathing', meaning: 'breathing pattern or respiration' },
      { suffix: 'uria', root: 'In the Urine', meaning: 'presence of a substance in the urine' },
      { suffix: 'gram', root: 'Recorded Test', meaning: 'a recorded test, tracing, or picture' },
      { suffix: 'graphy', root: 'Imaging Scan', meaning: 'an imaging technique or recorded scan' },
      { suffix: 'lysis', root: 'Breakdown / Dissolving', meaning: 'the breakdown, dissolution, or destruction of cells' },
      { suffix: 'paresis', root: 'Weakness', meaning: 'partial weakness or reduced muscle control' },
      { suffix: 'plegia', root: 'Paralysis', meaning: 'loss of movement or paralysis' }
    ];
  }

  setReadingLevel(level) {
    this.readingLevel = level;
  }

  /**
   * Clean conversational wrappers (e.g., "what is...", "explain...", "meaning of...")
   */
  cleanInputQuery(query) {
    if (!query) return '';
    let text = query.trim().toLowerCase();
    // Strip trailing punctuation
    text = text.replace(/[?!.'"“”]/g, '');
    // Strip common question starters
    text = text.replace(/^(what is|what are|what does|whats|what's|explain|define|describe|tell me about|meaning of|definition of|can you explain|please explain|what means)\s+/i, '');
    // Strip common clinical / patient intros
    text = text.replace(/^(doctor says i have|doctor told me i have|doctor said i have|i have been diagnosed with|diagnosed with|i have|patient has|results show|test shows|chart says|note says)\s+/i, '');
    // Strip trailing question verbs
    text = text.replace(/\s+(mean|means|meaning)\s*$/i, '');
    return text.trim();
  }

  /**
   * Search glossary using direct, fuzzy, token, and synonym keyword mappings
   */
  findTermMatch(inputQuery) {
    if (!inputQuery) return null;
    const clean = inputQuery.trim().toLowerCase();

    // 1. Direct exact match on term, simpleName, or aliases
    let match = this.glossary.find(item => {
      if (item.term.toLowerCase() === clean) return true;
      if (item.simpleName.toLowerCase() === clean) return true;
      if (item.aliases && item.aliases.some(a => a.toLowerCase() === clean)) return true;
      return false;
    });
    if (match) return match;

    // 2. Contains match (either way, min length 3 to avoid trivial substrings)
    if (clean.length >= 3) {
      match = this.glossary.find(item => {
        if (clean.includes(item.term.toLowerCase()) || item.term.toLowerCase().includes(clean)) return true;
        if (item.simpleName.toLowerCase().includes(clean) || clean.includes(item.simpleName.toLowerCase())) return true;
        if (item.aliases && item.aliases.some(a => clean.includes(a.toLowerCase()) || a.toLowerCase().includes(clean))) return true;
        return false;
      });
      if (match) return match;
    }

    // 3. Normalized tokens match (strips punctuation/parentheses)
    const normalizedInput = clean.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    match = this.glossary.find(item => {
      const normTerm = item.term.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
      const normSimple = item.simpleName.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
      if (normTerm.includes(normalizedInput) || (normTerm.length > 4 && normalizedInput.includes(normTerm))) return true;
      if (normSimple.includes(normalizedInput) || (normSimple.length > 4 && normalizedInput.includes(normSimple))) return true;
      if (item.aliases) {
        return item.aliases.some(a => {
          const normA = a.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
          return normA.includes(normalizedInput) || (normA.length > 4 && normalizedInput.includes(normA));
        });
      }
      return false;
    });
    if (match) return match;

    // 4. Clinical keyword and synonym mapping
    const keywordMap = [
      { keys: ['meaning of a word', 'meaning of word', 'meaning of the word', 'what is a medical word', 'medical term', 'medical word', 'terminology', 'jargon', 'how to read words'], term: 'Meaning of a Medical Word (Medical Terminology Guide)' },
      { keys: ['diabetes', 'diabetic', 'type 2', 'type 1', 'high sugar'], term: 'Diabetes Mellitus' },
      { keys: ['cancer', 'tumor', 'carcinoma', 'neoplasm', 'malignancy', 'oncology'], term: 'Cancer' },
      { keys: ['headache', 'head pain', 'migraine', 'throbbing head'], term: 'Headache' },
      { keys: ['fever', 'high temp', 'chills', 'pyrexia', 'febrile'], term: 'Fever' },
      { keys: ['cough', 'coughing', 'hack'], term: 'Cough' },
      { keys: ['chest pain', 'chest tightness', 'chest pressure', 'heart pain'], term: 'Chest Pain' },
      { keys: ['dizzy', 'dizziness', 'lightheaded', 'woozy', 'unsteady'], term: 'Dizziness' },
      { keys: ['fatigue', 'tiredness', 'exhaustion', 'low energy', 'sluggish'], term: 'Fatigue' },
      { keys: ['nausea', 'vomit', 'throwing up', 'upset stomach', 'queasy'], term: 'Nausea and Vomiting' },
      { keys: ['infection', 'infected', 'germs', 'bacterial infection', 'viral infection'], term: 'Infection' },
      { keys: ['inflammation', 'inflamed', 'swollen tissue'], term: 'Inflammation' },
      { keys: ['dehydration', 'dehydrated', 'lack of fluids', 'dry mouth'], term: 'Dehydration' },
      { keys: ['allergy', 'allergic', 'allergies', 'hives'], term: 'Allergy' },
      { keys: ['high blood pressure', 'high bp', 'hypertens', 'elevated bp'], term: 'Hypertension' },
      { keys: ['low blood pressure', 'low bp', 'hypotens'], term: 'Hypotension' },
      { keys: ['blood pressure', 'systolic', 'diastolic'], term: 'Blood Pressure' },
      { keys: ['heart attack', 'infarction', 'coronary occlusion', 'myocardial'], term: 'Myocardial Infarction' },
      { keys: ['fast heart', 'rapid pulse', 'tachycard', 'racing heart', 'palpitations'], term: 'Tachycardia' },
      { keys: ['slow heart', 'bradycard', 'slow pulse'], term: 'Bradycardia' },
      { keys: ['heart failure', 'congestive heart failure', 'chf'], term: 'Heart Failure' },
      { keys: ['irregular heart', 'arrhythm', 'afib', 'atrial fibrillation'], term: 'Arrhythmia' },
      { keys: ['enlarged heart', 'cardiomeg'], term: 'Cardiomegaly' },
      { keys: ['heart', 'cardiac function'], term: 'Heart' },
      { keys: ['lungs', 'breathing organ', 'pulmonary'], term: 'Lungs' },
      { keys: ['kidney', 'kidneys', 'renal function'], term: 'Kidneys' },
      { keys: ['liver', 'hepatic function'], term: 'Liver' },
      { keys: ['stomach', 'gut', 'belly', 'digestive'], term: 'Stomach' },
      { keys: ['brain', 'nervous system', 'neurology'], term: 'Brain' },
      { keys: ['blood', 'bloodstream', 'circulation'], term: 'Blood' },
      { keys: ['antibiotic', 'antibiotics', 'amoxicillin', 'penicillin'], term: 'Antibiotic' },
      { keys: ['prescription', 'medication', 'medicine', 'dosage', 'pills'], term: 'Prescription' },
      { keys: ['symptom', 'diagnosis'], term: 'Symptom vs Diagnosis' },
      { keys: ['normal', 'abnormal', 'test result', 'lab result', 'reference range'], term: 'Normal vs Abnormal Test Results' },
      { keys: ['clogged artery', 'arteriosclero', 'atherosclero', 'hardening of arter'], term: 'Atherosclerosis' },
      { keys: ['shortness of breath', 'breathless', 'dyspnea', 'winded'], term: 'Dyspnea on Exertion' },
      { keys: ['swelling', 'edema', 'fluid retention', 'water retention', 'swollen ankles', 'swollen legs'], term: 'Edema' },
      { keys: ['anemia', 'low iron', 'pale', 'low rbc', 'low hemoglobin'], term: 'Anemia' },
      { keys: ['blood clot in leg', 'dvt', 'deep vein'], term: 'Deep Vein Thrombosis (DVT)' },
      { keys: ['clot in lung', 'pulmonary embolism', 'pe'], term: 'Pulmonary Embolism (PE)' },
      { keys: ['fainting', 'passed out', 'blackout', 'syncope'], term: 'Syncope' },
      { keys: ['stroke', 'cva', 'brain clot', 'mini stroke', 'tia'], term: 'Stroke (Cerebrovascular Accident)' },
      { keys: ['blood sugar', 'glucose', 'a1c', 'hba1c'], term: 'HbA1c (Hemoglobin A1c)' },
      { keys: ['fasting sugar', 'fasting glucose', 'morning sugar'], term: 'Fasting Blood Glucose' },
      { keys: ['after meal', 'postprandial', 'sugar spike'], term: 'Postprandial Hyperglycemia' },
      { keys: ['low sugar', 'hypoglycem', 'sugar crash'], term: 'Hypoglycemia' },
      { keys: ['ketoacidosis', 'dka', 'ketones'], term: 'Diabetic Ketoacidosis (DKA)' },
      { keys: ['cholesterol', 'triglyceride', 'lipid', 'hyperlipid'], term: 'Hyperlipidemia' },
      { keys: ['kidney score', 'filtering', 'egfr', 'filtration rate'], term: 'eGFR (Estimated Glomerular Filtration Rate)' },
      { keys: ['creatinine'], term: 'Creatinine' },
      { keys: ['bun', 'blood urea'], term: 'Blood Urea Nitrogen (BUN)' },
      { keys: ['kidney stone', 'nephrolithi', 'renal calculi'], term: 'Nephrolithiasis (Kidney Stones)' },
      { keys: ['uti', 'urinary infection', 'bladder infection'], term: 'Urinary Tract Infection (UTI)' },
      { keys: ['blood in urine', 'hematuria', 'pink urine'], term: 'Hematuria' },
      { keys: ['protein in urine', 'proteinuria'], term: 'Proteinuria' },
      { keys: ['prostate', 'bph', 'enlarged prostate'], term: 'Benign Prostatic Hyperplasia (BPH)' },
      { keys: ['alt', 'liver enzyme', 'alanine'], term: 'Alanine Aminotransferase (ALT)' },
      { keys: ['ast', 'aspartate'], term: 'Aspartate Aminotransferase (AST)' },
      { keys: ['bilirubin', 'jaundice', 'yellow skin'], term: 'Bilirubin' },
      { keys: ['troponin', 'heart enzyme'], term: 'Troponin' },
      { keys: ['potassium', 'hypokalem', 'hyperkalem'], term: 'Potassium (Hypokalemia / Hyperkalemia)' },
      { keys: ['sodium', 'hyponatrem', 'hypernatrem'], term: 'Sodium (Hyponatremia / Hypernatremia)' },
      { keys: ['acid reflux', 'heartburn', 'gerd'], term: 'Gastroesophageal Reflux Disease (GERD)' },
      { keys: ['gastritis', 'stomach inflammation'], term: 'Gastritis' },
      { keys: ['stomach flu', 'food poisoning', 'gastroenteritis'], term: 'Gastroenteritis' },
      { keys: ['pancreas', 'pancreatit'], term: 'Pancreatitis' },
      { keys: ['gallbladder', 'cholecystit', 'gallstone'], term: 'Cholecystitis' },
      { keys: ['cirrhosis', 'liver scarring'], term: 'Cirrhosis' },
      { keys: ['endoscopy', 'camera down throat'], term: 'Endoscopy' },
      { keys: ['colonoscopy', 'colon camera'], term: 'Colonoscopy' },
      { keys: ['pneumonia', 'lung infection'], term: 'Pneumonia' },
      { keys: ['bronchitis', 'chest cold'], term: 'Bronchitis' },
      { keys: ['asthma', 'inhaler', 'wheezing'], term: 'Asthma' },
      { keys: ['sleep apnea', 'snoring apnea'], term: 'Sleep Apnea' },
      { keys: ['pleural effusion', 'fluid in lung'], term: 'Pleural Effusion' },
      { keys: ['atelectasis'], term: 'Atelectasis' },
      { keys: ['copd', 'emphysema'], term: 'Chronic Obstructive Pulmonary Disease (COPD)' },
      { keys: ['platelet', 'thrombocyto'], term: 'Thrombocytopenia' },
      { keys: ['white blood cells', 'leukocyto', 'high wbc'], term: 'Leukocytosis' },
      { keys: ['low white blood', 'leukopeni', 'low wbc'], term: 'Leukopenia' },
      { keys: ['sepsis', 'blood infection', 'septic'], term: 'Sepsis' },
      { keys: ['nerve pain', 'numbness', 'tingling', 'neuropath'], term: 'Neuropathy' },
      { keys: ['sciatica', 'leg nerve pain'], term: 'Sciatica' },
      { keys: ['pins and needles', 'paresthes'], term: 'Paresthesia' },
      { keys: ['joint pain', 'cartilage', 'osteoarth', 'arthritis'], term: 'Osteoarthritis' },
      { keys: ['weak bones', 'bone density', 'osteoporos'], term: 'Osteoporosis' },
      { keys: ['gout', 'uric acid', 'big toe pain'], term: 'Gout' },
      { keys: ['hypothyroid', 'underactive thyroid'], term: 'Hypothyroidism' },
      { keys: ['hyperthyroid', 'overactive thyroid'], term: 'Hyperthyroidism' },
      { keys: ['skin infection', 'cellulit'], term: 'Cellulitis' },
      { keys: ['skin rash', 'eczema', 'dermatit'], term: 'Dermatitis' },
      { keys: ['ekg', 'ecg', 'heart tracing'], term: 'Electrocardiogram (ECG / EKG)' },
      { keys: ['echo', 'heart ultrasound'], term: 'Echocardiogram' },
      { keys: ['ct scan', 'cat scan'], term: 'Computed Tomography (CT Scan)' },
      { keys: ['mri', 'mri scan'], term: 'Magnetic Resonance Imaging (MRI)' },
      { keys: ['biopsy', 'tissue test'], term: 'Biopsy' },
      { keys: ['benign', 'not cancer'], term: 'Benign' },
      { keys: ['malignant', 'cancerous'], term: 'Malignant' },
      { keys: ['metastasis', 'cancer spread'], term: 'Metastasis' },
      { keys: ['acute', 'chronic'], term: 'Acute vs Chronic' },
      { keys: ['prognosis', 'outlook', 'recovery chance'], term: 'Prognosis' },
      { keys: ['idiopathic', 'unknown cause'], term: 'Idiopathic' }
    ];

    for (const item of keywordMap) {
      if (item.keys.some(k => clean.includes(k))) {
        const found = this.glossary.find(g => g.term === item.term);
        if (found) return found;
      }
    }

    return null;
  }

  /**
   * Medical Morphology Deconstruction: breaks down Latin/Greek roots
   */
  deconstructMedicalWord(word) {
    if (!word) return null;
    const cleanWord = word.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord.length < 4) return null;

    let matchedPrefix = null;
    let matchedSuffix = null;

    // Look for matching prefix
    for (const p of this.prefixes) {
      if (cleanWord.startsWith(p.prefix)) {
        matchedPrefix = p;
        break;
      }
    }

    // Look for matching suffix
    for (const s of this.suffixes) {
      if (cleanWord.endsWith(s.suffix)) {
        matchedSuffix = s;
        break;
      }
    }

    if (!matchedPrefix && !matchedSuffix) {
      return null;
    }

    // Format clean readable title and plain definition
    let simpleTitle = "";
    let plainMeaning = "";
    let analogy = "";
    let why = "";
    let questions = [];

    if (matchedPrefix && matchedSuffix) {
      simpleTitle = `${matchedPrefix.root} ${matchedSuffix.root}`;
      plainMeaning = `This clinical term breaks down into: "${matchedPrefix.prefix}-" (referring to ${matchedPrefix.meaning}) and "-${matchedSuffix.suffix}" (meaning ${matchedSuffix.meaning}). In everyday words, it refers to ${matchedSuffix.meaning} involving your ${matchedPrefix.root.toLowerCase()}.`;
      analogy = `Think of it like an alert light on your car dashboard that points out which specific engine part (${matchedPrefix.root}) is experiencing an issue (${matchedSuffix.root}).`;
      why = `Healthcare teams use standard Greek and Latin root terminology to communicate clearly and specifically about which organ requires medical attention.`;
      questions = [
        `What is causing this ${matchedPrefix.root.toLowerCase()} condition?`,
        `What are the most effective treatments or lifestyle steps for this?`,
        `What symptoms should I monitor at home?`
      ];
    } else if (matchedSuffix) {
      simpleTitle = `Clinical Condition Ending in -${matchedSuffix.suffix} (${matchedSuffix.root})`;
      plainMeaning = `The ending "-${matchedSuffix.suffix}" means ${matchedSuffix.meaning}. In healthcare, it describes a medical situation involving ${matchedSuffix.root.toLowerCase()}.`;
      analogy = `Like a standardized label that tells doctors what type of process is happening in the body.`;
      why = `Used across healthcare systems globally to clearly define clinical observations.`;
      questions = [
        `What part of my body is this referring to?`,
        `Is this a temporary issue or something ongoing?`,
        `What is the best next step?`
      ];
    } else {
      simpleTitle = `Observation Involving the ${matchedPrefix.root}`;
      plainMeaning = `The prefix "${matchedPrefix.prefix}-" relates to ${matchedPrefix.meaning}. In healthcare, this observation relates to your ${matchedPrefix.root.toLowerCase()}.`;
      analogy = `Like an address on an envelope — the prefix tells your healthcare provider which organ system in the body is being evaluated.`;
      why = `Identifies the specific body system that the doctor is evaluating during your care.`;
      questions = [
        `How is my ${matchedPrefix.root.toLowerCase()} functioning overall?`,
        `Are there specific diagnostic tests we should do next?`,
        `What steps will support my recovery?`
      ];
    }

    return {
      term: word,
      simpleName: simpleTitle,
      category: matchedPrefix ? `${matchedPrefix.root} Care` : "Clinical Terminology",
      whatItMeans: plainMeaning,
      analogy: analogy,
      whyChecked: why,
      doctorQuestions: questions,
      safetyNotice: "Educational breakdown only. Always discuss findings with your physician."
    };
  }

  /**
   * Primary Simplifier Pipeline
   */
  simplifyText(inputText, targetLang = 'en') {
    if (!inputText || !inputText.trim()) {
      return null;
    }

    const rawInput = inputText.trim();
    const cleaned = this.cleanInputQuery(rawInput);

    // 1. Direct glossary match on cleaned query
    let matchedTerm = this.findTermMatch(cleaned);
    if (!matchedTerm && cleaned !== rawInput.toLowerCase()) {
      // Try on raw input as well
      matchedTerm = this.findTermMatch(rawInput);
    }

    if (matchedTerm) {
      return this.formatGlossaryResult(matchedTerm, targetLang);
    }

    // 2. Token-level scan: check if any individual word in the user's sentence matches glossary
    const words = cleaned.split(/[\s,;:]+/).filter(w => w.length > 2);
    for (const w of words) {
      const singleMatch = this.findTermMatch(w);
      if (singleMatch) {
        return this.formatGlossaryResult(singleMatch, targetLang);
      }
    }

    // 3. Scan for Latin/Greek medical roots in single or multi-word inputs
    for (const w of words) {
      const deconstructed = this.deconstructMedicalWord(w);
      if (deconstructed) {
        return this.formatCustomResult(deconstructed, targetLang);
      }
    }

    // 4. Multi-word clinical sentence analysis
    return this.generateMultiWordSimplification(rawInput, targetLang);
  }

  /**
   * Format glossary result with reading level and target language
   */
  formatGlossaryResult(item, targetLang = 'en') {
    let simpleName = item.simpleName;
    let plainMeaning = item.meaning;
    let analogy = item.analogy;
    let why = item.whyChecked;
    let questions = [...item.doctorQuestions];

    // Adapt to Reading Level (for English)
    if (targetLang === 'en') {
      if (this.readingLevel === 'easy') {
        plainMeaning = `In simple, everyday words: ${plainMeaning.replace(/consistently/gi, "always").replace(/peripheral/gi, "outer").replace(/indicative/gi, "showing").replace(/elevated/gi, "higher than usual").replace(/diminished/gi, "lower")}`;
      } else if (this.readingLevel === 'detailed') {
        plainMeaning = `${plainMeaning} Healthcare teams monitor this finding closely to understand underlying organ function, evaluate response to treatments, and support long-term preventive care.`;
      }
    }

    // Apply Multi-Language Translations if requested
    if (targetLang !== 'en') {
      if (typeof TRANSLATED_TERM_EXPLANATIONS !== 'undefined' && TRANSLATED_TERM_EXPLANATIONS[item.term] && TRANSLATED_TERM_EXPLANATIONS[item.term][targetLang]) {
        const trans = TRANSLATED_TERM_EXPLANATIONS[item.term][targetLang];
        simpleName = trans.simpleName || simpleName;
        plainMeaning = trans.meaning || plainMeaning;
        analogy = trans.analogy || analogy;
        why = trans.whyChecked || why;
        questions = trans.doctorQuestions || questions;
      } else {
        if (typeof TRANSLATION_CACHE !== 'undefined' && TRANSLATION_CACHE[item.term] && TRANSLATION_CACHE[item.term][targetLang]) {
          simpleName = TRANSLATION_CACHE[item.term][targetLang];
        }
        if (typeof translateText === 'function') {
          plainMeaning = translateText(plainMeaning, targetLang);
          analogy = translateText(analogy, targetLang);
          why = translateText(why, targetLang);
          questions = questions.map(q => translateText(q, targetLang));
        }
      }
    }

    return {
      term: item.term,
      simpleName: simpleName,
      commonName: simpleName,
      category: item.category,
      whatItMeans: plainMeaning,
      analogy: analogy,
      whyChecked: why,
      doctorQuestions: questions,
      safetyNotice: "Educational summary only. A doctor considers this in the context of your complete health history."
    };
  }

  /**
   * Format custom morphological result
   */
  formatCustomResult(item, targetLang = 'en') {
    let whatItMeans = item.whatItMeans;
    let analogy = item.analogy;
    let why = item.whyChecked;
    let simpleName = item.simpleName;
    let questions = [...item.doctorQuestions];

    if (targetLang !== 'en' && typeof translateText === 'function') {
      simpleName = translateText(simpleName, targetLang);
      whatItMeans = translateText(whatItMeans, targetLang);
      analogy = translateText(analogy, targetLang);
      why = translateText(why, targetLang);
      questions = questions.map(q => translateText(q, targetLang));
    }

    return {
      term: item.term,
      simpleName: simpleName,
      commonName: simpleName,
      category: item.category,
      whatItMeans: whatItMeans,
      analogy: analogy,
      whyChecked: why,
      doctorQuestions: questions,
      safetyNotice: "Educational summary only. Always consult your personal physician."
    };
  }

  /**
   * Multi-word clinical sentence analysis
   */
  generateMultiWordSimplification(text, targetLang = 'en') {
    const clinicalPatterns = [
      { regex: /\bhypertension\b/gi, title: "High Blood Pressure", explanation: "blood is pushing against artery walls with more force than normal" },
      { regex: /\bhypotension\b/gi, title: "Low Blood Pressure", explanation: "blood pressure is lower than target ranges" },
      { regex: /\bmyocardial infarction\b/gi, title: "Heart Attack", explanation: "temporary blockage of blood supply to heart muscle" },
      { regex: /\btachycardia\b/gi, title: "Fast Heart Rate", explanation: "heart is beating faster than 100 beats per minute" },
      { regex: /\bbradycardia\b/gi, title: "Slow Heart Rate", explanation: "heart is beating slower than 60 beats per minute" },
      { regex: /\bdyspnea\b/gi, title: "Shortness of Breath", explanation: "difficulty catching breath or labored breathing" },
      { regex: /\bedema\b/gi, title: "Fluid Swelling", explanation: "excess fluid trapped in body tissues" },
      { regex: /\banemia\b/gi, title: "Low Red Blood Cells", explanation: "lower oxygen-carrying red blood cells in circulation" },
      { regex: /\bpostprandial\b/gi, title: "After-Meal Timing", explanation: "occurring following food intake" },
      { regex: /\bhyperglycemia\b/gi, title: "High Blood Sugar", explanation: "glucose levels rising above target" },
      { regex: /\bhypoglycemia\b/gi, title: "Low Blood Sugar", explanation: "glucose levels falling below safe targets" },
      { regex: /\bhyperlipidemia\b/gi, title: "High Cholesterol", explanation: "elevated cholesterol and fats circulating in the blood" },
      { regex: /\bneuropathy\b/gi, title: "Nerve Tingling / Numbness", explanation: "irritation or altered sensation in peripheral nerves" },
      { regex: /\bbronchitis\b/gi, title: "Airway Swelling", explanation: "irritation and mucus in the bronchial breathing tubes" },
      { regex: /\bpneumonia\b/gi, title: "Lung Infection", explanation: "infection filling air sacs in the lung" },
      { regex: /\bcephalea\b|\bheadache\b/gi, title: "Head Pain", explanation: "headache or cranial discomfort" },
      { regex: /\bvertigo\b/gi, title: "Spinning Dizziness", explanation: "sensation that your surroundings are rotating" },
      { regex: /\bafebrile\b/gi, title: "No Fever", explanation: "normal body temperature" },
      { regex: /\bfebrile\b/gi, title: "Fever Present", explanation: "elevated body temperature above 100.4°F (38°C)" },
      { regex: /\bacute\b/gi, title: "Sudden / Short-Term", explanation: "recently developed and short-lasting" },
      { regex: /\bchronic\b/gi, title: "Ongoing / Long-Term", explanation: "developing slowly and lasting over months or years" },
      { regex: /\bcreatinine\b/gi, title: "Kidney Waste Marker", explanation: "substance filtered by healthy kidneys" },
      { regex: /\bgastritis\b/gi, title: "Stomach Irritation", explanation: "inflammation of the stomach lining" }
    ];

    const detected = [];
    for (const pat of clinicalPatterns) {
      if (pat.regex.test(text)) {
        detected.push(`<strong>${pat.title}</strong>: ${pat.explanation}`);
      }
    }

    let summaryText = "";
    let analogyText = "";
    let whyText = "Healthcare providers use standardized clinical terms to ensure doctors, nurses, specialists, and pharmacists share the exact same understanding of your treatment plan.";
    let doctorQuestions = [
      `Could you explain how "${text}" applies specifically to my current test results or care plan?`,
      "Are there specific lab values or symptoms related to this that we should monitor?",
      "What is the single most beneficial lifestyle or preventive step I should take?"
    ];

    if (detected.length > 0) {
      summaryText = `This medical statement contains the following key findings in plain English:<br><br>• ` + detected.join('<br>• ') + `<br><br>In summary, your doctor is recording these specific observations so your care team can keep your health monitored and coordinate effective treatment.`;
      analogyText = "Like a routine automotive inspection checklist — technical notes identify which specific systems are running smoothly and which need routine adjustments.";
    } else {
      summaryText = `You searched for: <strong>"${text}"</strong>.<br><br>In healthcare communication, medical terms typically describe one of four core areas:<br>• <strong>1. An Anatomical Organ or Structure</strong> (e.g. <em>Cardio-</em> for heart, <em>Gastro-</em> for stomach, <em>Neuro-</em> for nerves, <em>Pulmo-</em> for lungs)<br>• <strong>2. A Biological Process or Condition</strong> (e.g. <em>-itis</em> for inflammation, <em>-megaly</em> for enlargement, <em>-emia</em> for blood conditions)<br>• <strong>3. A Diagnostic or Lab Finding</strong> (such as blood pressure, glucose, creatinine, or cholesterol)<br>• <strong>4. A Symptom or Treatment</strong> (such as fever, edema, cough, or antibiotic therapy)<br><br>💡 <em>Tip: To see an immediate full breakdown, try clicking one of the popular terms below or enter specific conditions like <strong>Hypertension</strong>, <strong>Tachycardia</strong>, <strong>Edema</strong>, <strong>Diabetes</strong>, <strong>Headache</strong>, or <strong>Creatinine</strong>.</em>`;
      analogyText = "Understanding medical language is like learning traffic road signs — once you understand the basic symbols and root words, navigating your medical charts becomes intuitive and clear.";
    }

    if (targetLang !== 'en' && typeof translateText === 'function') {
      summaryText = translateText(summaryText, targetLang);
      analogyText = translateText(analogyText, targetLang);
      whyText = translateText(whyText, targetLang);
      doctorQuestions = doctorQuestions.map(q => translateText(q, targetLang));
    }

    const simpleName = detected.length > 0 ? (targetLang === 'en' ? "Clinical Statement Breakdown" : translateText("Clinical Statement Breakdown", targetLang)) : (targetLang === 'en' ? "Health Concept Exploration" : translateText("Health Concept Exploration", targetLang));

    return {
      term: text.length > 45 ? text.substring(0, 42) + "..." : text,
      simpleName: simpleName,
      commonName: simpleName,
      category: detected.length > 0 ? (targetLang === 'en' ? "Clinical Summary" : translateText("Clinical Summary", targetLang)) : (targetLang === 'en' ? "Health Literacy Guide" : translateText("Health Literacy Guide", targetLang)),
      whatItMeans: summaryText,
      analogy: analogyText,
      whyChecked: whyText,
      doctorQuestions: doctorQuestions,
      safetyNotice: "Educational summary only. Always consult your personal physician."
    };
  }

  /**
   * Text to speech playback
   */
  speakText(text, lang = 'en') {
    if (!this.speechSynth) {
      alert("Text-to-speech is not supported by your current browser.");
      return;
    }

    if (this.speechSynth.speaking) {
      this.speechSynth.cancel();
    }

    const cleanText = text.replace(/<[^>]*>/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    
    const langMap = {
      en: 'en-US',
      es: 'es-ES',
      hi: 'hi-IN',
      fr: 'fr-FR',
      zh: 'zh-CN',
      ar: 'ar-SA',
      bn: 'bn-IN',
      pt: 'pt-BR',
      de: 'de-DE',
      tl: 'fil-PH',
      vi: 'vi-VN',
      ta: 'ta-IN',
      kn: 'kn-IN',
      mr: 'mr-IN',
      te: 'te-IN'
    };
    utterance.lang = langMap[lang] || 'en-US';

    this.speechSynth.speak(utterance);
    this.currentUtterance = utterance;
  }

  stopSpeech() {
    if (this.speechSynth && this.speechSynth.speaking) {
      this.speechSynth.cancel();
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MedicalSimplifier };
}
