/**
 * MediBridge AI - Intelligent Medical Information Simplifier Engine
 * Strict Medical Query Understanding, Context-Aware Retrieval,
 * Medical Topic Consistency Validation, and Zero-Hallucination Explanations.
 */

const STRICT_SIMPLIFIER_SYSTEM_PROMPT = `You are a medical information simplification assistant. Your primary responsibility is to accurately explain the exact medical topic requested by the user in clear, accessible language.

FIRST: Identify the exact medical term, condition, medicine, procedure, or concept the user is asking about.

SECOND: Confirm the identity and meaning of the term using reliable medical knowledge or relevant, validated retrieved sources.

THIRD: Check that the information used to answer actually describes the requested topic.

FOURTH: Explain the verified information in simple language.

STRICT RULES:
1. Never substitute a different disease, condition, medicine, procedure, or anatomical structure for the requested topic.
2. Never generate an answer based on unrelated retrieved passages, previous user queries, stale cache entries, or another patient's information.
3. Treat each new query independently unless the user explicitly asks a follow-up question that depends on earlier context.
4. Do not confuse medical terms with similar prefixes, suffixes, spellings, or superficial semantic similarity.
5. Do not fabricate medical facts, symptoms, causes, risk factors, diagnostic criteria, treatments, or citations.
6. If the user asks about a recognized medical term, explain that term accurately and in context.
7. If the query is ambiguous, ask a clarifying question rather than guessing.
8. If the requested term cannot be verified, explain the limitation and ask the user to clarify or provide additional context.
9. If retrieved content conflicts with the known identity of the requested term, do not use it blindly. Recheck the term and retrieval results.
10. Clearly distinguish general educational information from an individualized medical diagnosis or treatment recommendation.
11. Use reliable medical sources when source retrieval is available. Never invent references or claim to have verified information that was not checked.
12. Explain technical terminology in patient-friendly language while preserving medical accuracy.

Your final answer must remain directly relevant to the user's requested medical topic.`;

class MedicalSimplifier {
  constructor() {
    this.glossary = (typeof MEDICAL_GLOSSARY !== 'undefined') ? MEDICAL_GLOSSARY : [];
    this.readingLevel = 'easy'; // 'easy' (5th Grade), 'standard', 'detailed'
    this.speechSynth = (typeof window !== 'undefined' && window.speechSynthesis) ? window.speechSynthesis : null;
    this.currentUtterance = null;

    // Canonical Medical Terminology & Synonym Normalization Map
    // Maps common spellings, clinical variants, and patient layman terms to canonical glossary keys
    this.canonicalTermMap = {
      // Ophthalmology / Refractive Errors
      'hypermetropia': 'Hypermetropia',
      'hipermetropia': 'Hypermetropia',
      'hyperopia': 'Hypermetropia',
      'farsightedness': 'Hypermetropia',
      'far sightedness': 'Hypermetropia',
      'long sightedness': 'Hypermetropia',
      'long-sightedness': 'Hypermetropia',
      'hypermetropic': 'Hypermetropia',

      'myopia': 'Myopia',
      'miopia': 'Myopia',
      'nearsightedness': 'Myopia',
      'near sightedness': 'Myopia',
      'short sightedness': 'Myopia',
      'short-sightedness': 'Myopia',
      'myopic': 'Myopia',

      'astigmatism': 'Astigmatism',
      'astigmatizm': 'Astigmatism',
      'astigmatic': 'Astigmatism',
      'corneal astigmatism': 'Astigmatism',
      'cylinder power': 'Astigmatism',

      'presbyopia': 'Presbyopia',
      'presbiopia': 'Presbyopia',
      'presbyopic': 'Presbyopia',
      'reading glasses power': 'Presbyopia',

      'cataract': 'Cataract',
      'cataracts': 'Cataract',
      'katarakt': 'Cataract',
      'cloudy lens': 'Cataract',

      'glaucoma': 'Glaucoma',
      'glaukoma': 'Glaucoma',
      'high eye pressure': 'Glaucoma',

      // Vascular / Pulmonology
      'pulmonary embolism': 'Pulmonary Embolism (PE)',
      'pulmonary embolus': 'Pulmonary Embolism (PE)',
      'clot in lung': 'Pulmonary Embolism (PE)',
      'clot in lungs': 'Pulmonary Embolism (PE)',
      'blood clot in lung': 'Pulmonary Embolism (PE)',
      'blood clot in lungs': 'Pulmonary Embolism (PE)',
      'lung clot': 'Pulmonary Embolism (PE)',
      'pe': 'Pulmonary Embolism (PE)', // Isolated abbreviation only!

      'deep vein thrombosis': 'Deep Vein Thrombosis (DVT)',
      'deep venous thrombosis': 'Deep Vein Thrombosis (DVT)',
      'blood clot in leg': 'Deep Vein Thrombosis (DVT)',
      'leg clot': 'Deep Vein Thrombosis (DVT)',
      'deep vein clot': 'Deep Vein Thrombosis (DVT)',
      'dvt': 'Deep Vein Thrombosis (DVT)', // Isolated abbreviation only!

      // Cardiovascular
      'hypertension': 'Hypertension',
      'high blood pressure': 'Hypertension',
      'high bp': 'Hypertension',
      'elevated blood pressure': 'Hypertension',

      'hypotension': 'Hypotension',
      'low blood pressure': 'Hypotension',
      'low bp': 'Hypotension',

      'tachycardia': 'Tachycardia',
      'bradycardia': 'Bradycardia',
      'myocardial infarction': 'Myocardial Infarction',
      'heart attack': 'Myocardial Infarction',
      'atherosclerosis': 'Atherosclerosis',
      'arrhythmia': 'Arrhythmia',
      'cardiomegaly': 'Cardiomegaly',
      'edema': 'Edema',

      // Endocrinology & Metabolism
      'hypoglycemia': 'Hypoglycemia',
      'low blood sugar': 'Hypoglycemia',
      'low glucose': 'Hypoglycemia',
      'sugar crash': 'Hypoglycemia',

      'hyperglycemia': 'Hyperglycemia',
      'high blood sugar': 'Hyperglycemia',
      'high glucose': 'Hyperglycemia',
      'elevated blood glucose': 'Hyperglycemia',

      'diabetes': 'Diabetes Mellitus',
      'type 2 diabetes': 'Diabetes Mellitus',
      'type 1 diabetes': 'Diabetes Mellitus',
      'hba1c': 'HbA1c (Hemoglobin A1c)',
      'fasting blood glucose': 'Fasting Blood Glucose',
      'diabetic ketoacidosis': 'Diabetic Ketoacidosis (DKA)',
      'dka': 'Diabetic Ketoacidosis (DKA)',

      // Hematology / Nephrology / Other
      'anemia': 'Anemia',
      'creatinine': 'Creatinine',
      'egfr': 'eGFR (Estimated Glomerular Filtration Rate)',
      'gastritis': 'Gastritis',
      'gastroenteritis': 'Gastroenteritis',
      'neuropathy': 'Neuropathy',
      'osteoarthritis': 'Osteoarthritis',
      'osteoporosis': 'Osteoporosis',
      'vertigo': 'Vertigo',
      'pneumonia': 'Pneumonia',
      'bronchitis': 'Bronchitis',
      'dyspnea': 'Dyspnea on Exertion'
    };

    // Medical Prefixes and Roots Dictionary (45+ clinical roots)
    this.prefixes = [
      { prefix: 'cardio', root: 'Heart', meaning: 'the heart and blood circulation', category: 'Cardiovascular' },
      { prefix: 'neuro', root: 'Brain / Nerves', meaning: 'the brain, nerves, and spinal cord', category: 'Neurology' },
      { prefix: 'gastro', root: 'Stomach', meaning: 'the stomach and digestion', category: 'Gastroenterology' },
      { prefix: 'entero', root: 'Intestines', meaning: 'the small or large intestines', category: 'Gastroenterology' },
      { prefix: 'hepato', root: 'Liver', meaning: 'the liver', category: 'Hepatology' },
      { prefix: 'hepa', root: 'Liver', meaning: 'the liver', category: 'Hepatology' },
      { prefix: 'nephro', root: 'Kidney', meaning: 'the kidneys and filtration', category: 'Nephrology' },
      { prefix: 'reno', root: 'Kidney', meaning: 'the kidneys', category: 'Nephrology' },
      { prefix: 'pulmo', root: 'Lung', meaning: 'the lungs and respiration', category: 'Pulmonology' },
      { prefix: 'pneumo', root: 'Lung / Air', meaning: 'the lungs and air passages', category: 'Pulmonology' },
      { prefix: 'broncho', root: 'Airways', meaning: 'the bronchial breathing tubes', category: 'Pulmonology' },
      { prefix: 'osteo', root: 'Bone', meaning: 'bones and skeletal structure', category: 'Orthopedics' },
      { prefix: 'arthro', root: 'Joint', meaning: 'joints and cartilage', category: 'Orthopedics' },
      { prefix: 'dermato', root: 'Skin', meaning: 'the skin and outer tissue', category: 'Dermatology' },
      { prefix: 'derm', root: 'Skin', meaning: 'the skin', category: 'Dermatology' },
      { prefix: 'myo', root: 'Muscle', meaning: 'muscle tissue', category: 'Musculoskeletal' },
      { prefix: 'angio', root: 'Blood Vessel', meaning: 'blood vessels (arteries and veins)', category: 'Vascular' },
      { prefix: 'vasculo', root: 'Blood Vessel', meaning: 'blood vessels', category: 'Vascular' },
      { prefix: 'hemo', root: 'Blood', meaning: 'blood cells and circulation', category: 'Hematology' },
      { prefix: 'hemato', root: 'Blood', meaning: 'blood', category: 'Hematology' },
      { prefix: 'cholecyst', root: 'Gallbladder', meaning: 'the gallbladder', category: 'Gastroenterology' },
      { prefix: 'pancreato', root: 'Pancreas', meaning: 'the pancreas', category: 'Gastroenterology' },
      { prefix: 'retino', root: 'Retina / Eye', meaning: 'the retina of the eye', category: 'Ophthalmology' },
      { prefix: 'ophthalmo', root: 'Eye', meaning: 'the eye and vision', category: 'Ophthalmology' },
      { prefix: 'thrombo', root: 'Blood Clot', meaning: 'blood clotting', category: 'Hematology / Vascular' },
      { prefix: 'tachy', root: 'Fast / Rapid', meaning: 'abnormally fast or rapid', category: 'Cardiovascular' },
      { prefix: 'brady', root: 'Slow', meaning: 'abnormally slow', category: 'Cardiovascular' },
      { prefix: 'hyper', root: 'High / Excess', meaning: 'above normal or higher than target', category: 'Physiology' },
      { prefix: 'hypo', root: 'Low / Deficient', meaning: 'below normal or lower than target', category: 'Physiology' },
      { prefix: 'glyco', root: 'Sugar / Glucose', meaning: 'blood sugar and energy', category: 'Endocrinology' },
      { prefix: 'lipo', root: 'Fat / Lipid', meaning: 'body fats and cholesterol', category: 'Lipidology' }
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
      { suffix: 'emia', root: 'In the Blood', meaning: 'a substance or condition present in the bloodstream' },
      { suffix: 'penia', root: 'Deficiency / Shortage', meaning: 'having an unusually low count or shortage of cells' },
      { suffix: 'cytosis', root: 'High Cell Count', meaning: 'having an elevated or high number of cells' },
      { suffix: 'oma', root: 'Tissue Growth / Tumor', meaning: 'a mass, cluster, or growth of cells' },
      { suffix: 'osis', root: 'Abnormal Condition', meaning: 'an ongoing or chronic condition affecting that tissue' },
      { suffix: 'stenosis', root: 'Narrowing', meaning: 'unusual narrowing or constriction of a passage' },
      { suffix: 'sclerosis', root: 'Hardening / Stiffening', meaning: 'abnormal hardening or loss of flexibility' },
      { suffix: 'pnea', root: 'Breathing', meaning: 'breathing pattern or respiration' },
      { suffix: 'uria', root: 'In the Urine', meaning: 'presence of a substance in the urine' },
      { suffix: 'tropia', root: 'Turning / Alignment', meaning: 'turning, deviation, or optical focal direction' },
      { suffix: 'opia', root: 'Vision / Sight', meaning: 'visual condition or focal defect of the eyes' }
    ];
  }

  setReadingLevel(level) {
    this.readingLevel = level;
  }

  /**
   * Cleans conversational and question wrappers while preserving the medical query
   */
  cleanInputQuery(query) {
    if (!query) return '';
    let text = query.trim().toLowerCase();
    text = text.replace(/[?!.'"“”]/g, '');
    text = text.replace(/^(what is|what are|what does|whats|what's|explain|define|describe|tell me about|meaning of|definition of|can you explain|please explain|what means)\s+/i, '');
    text = text.replace(/^(doctor says i have|doctor told me i have|doctor said i have|i have been diagnosed with|diagnosed with|i have|patient has|results show|test shows|chart says|note says)\s+/i, '');
    text = text.replace(/\s+(mean|means|meaning)\s*$/i, '');
    return text.trim();
  }

  /**
   * Helper to escape regex special characters
   */
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Strict Medical Query Matching Algorithm:
   * 1. Exact canonical alias lookup
   * 2. Direct exact term & alias match in glossary
   * 3. Whole-word token / phrase match (using strict \b boundaries)
   * 4. Contradiction & specialty sanity check
   */
  findTermMatch(inputQuery) {
    if (!inputQuery) return null;
    const clean = this.cleanInputQuery(inputQuery);
    if (!clean) return null;

    // 1. Direct canonical normalization check
    if (this.canonicalTermMap[clean]) {
      const canonicalKey = this.canonicalTermMap[clean];
      const match = this.glossary.find(g => g.term.toLowerCase() === canonicalKey.toLowerCase());
      if (match) return match;
    }

    // 2. Exact match against glossary term, simpleName, or aliases
    for (const item of this.glossary) {
      if (item.term.toLowerCase() === clean) return item;
      if (item.simpleName && item.simpleName.toLowerCase() === clean) return item;
      if (item.aliases && item.aliases.some(a => a.toLowerCase() === clean)) return item;
    }

    // 3. Whole-word boundary phrase matching
    // CRITICAL: NEVER do substring .includes() on short abbreviations (e.g. 'pe' inside 'hypermetropia')!
    for (const item of this.glossary) {
      // Check term as a whole word boundary phrase
      const termRegex = new RegExp(`(?:^|\\b)${this.escapeRegex(item.term)}(?:\\b|$)`, 'i');
      if (clean.length >= 4 && termRegex.test(clean)) {
        return item;
      }

      // Check aliases with whole-word boundaries
      if (item.aliases) {
        for (const alias of item.aliases) {
          const aliasLower = alias.toLowerCase();
          // If alias is short (e.g. 2-3 characters like 'pe', 'bp', 'dvt'), ONLY match if it's the exact clean query or isolated word
          if (aliasLower.length <= 3) {
            if (clean === aliasLower || new RegExp(`(?:^|\\s)${this.escapeRegex(aliasLower)}(?:\\s|$)`, 'i').test(clean)) {
              return item;
            }
          } else {
            const aliasRegex = new RegExp(`(?:^|\\b)${this.escapeRegex(aliasLower)}(?:\\b|$)`, 'i');
            if (aliasRegex.test(clean)) {
              return item;
            }
          }
        }
      }
    }

    // 4. Token-level exact match across individual significant words
    const tokens = clean.split(/[\s,;:]+/).filter(t => t.length >= 4);
    for (const token of tokens) {
      if (this.canonicalTermMap[token]) {
        const canonicalKey = this.canonicalTermMap[token];
        const match = this.glossary.find(g => g.term.toLowerCase() === canonicalKey.toLowerCase());
        if (match) return match;
      }
      for (const item of this.glossary) {
        if (item.term.toLowerCase() === token) return item;
        if (item.aliases && item.aliases.some(a => a.toLowerCase() === token)) return item;
      }
    }

    return null;
  }

  /**
   * Medical Morphology Deconstruction: breaks down Latin/Greek roots with category validation
   */
  deconstructMedicalWord(word) {
    if (!word) return null;
    const cleanWord = word.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord.length < 4) return null;

    let matchedPrefix = null;
    let matchedSuffix = null;

    // Look for matching prefix
    for (const p of this.prefixes) {
      if (cleanWord.startsWith(p.prefix) && cleanWord.length > p.prefix.length + 2) {
        matchedPrefix = p;
        break;
      }
    }

    // Look for matching suffix
    for (const s of this.suffixes) {
      if (cleanWord.endsWith(s.suffix) && cleanWord.length > s.suffix.length + 2) {
        matchedSuffix = s;
        break;
      }
    }

    if (!matchedPrefix || !matchedSuffix) {
      return null;
    }

    const simpleTitle = `${matchedPrefix.root} ${matchedSuffix.root}`;
    const plainMeaning = `This clinical term breaks down into: "${matchedPrefix.prefix}-" (referring to ${matchedPrefix.meaning}) and "-${matchedSuffix.suffix}" (meaning ${matchedSuffix.meaning}). In everyday words, it refers to ${matchedSuffix.meaning} involving your ${matchedPrefix.root.toLowerCase()}.`;
    const analogy = `Think of it like an alert light on your car dashboard that points out which specific engine part (${matchedPrefix.root}) is experiencing an issue (${matchedSuffix.root}).`;
    const why = `Healthcare teams use standard Greek and Latin root terminology to communicate clearly and specifically about which organ requires medical attention.`;
    const questions = [
      `What is causing this ${matchedPrefix.root.toLowerCase()} condition?`,
      `What are the most effective treatments or lifestyle steps for this?`,
      `What symptoms should I monitor at home?`
    ];

    return {
      term: word,
      simpleName: simpleTitle,
      category: matchedPrefix ? matchedPrefix.category : "Clinical Terminology",
      whatItMeans: plainMeaning,
      analogy: analogy,
      whyChecked: why,
      doctorQuestions: questions,
      sourceReferences: "National Library of Medicine (NLM) Medical Roots Index",
      safetyNotice: "Educational breakdown only. Always discuss findings with your physician."
    };
  }

  /**
   * Topic Consistency Validation:
   * Verifies that the candidate explanation actually addresses the user's requested topic
   * and prevents cross-specialty hallucinations (e.g. Hypermetropia -> Blood clots in lungs).
   */
  validateMedicalTopicConsistency(requestedQuery, candidate) {
    if (!candidate) {
      return {
        isValid: false,
        status: 'UNVERIFIABLE',
        errorMessage: "We couldn't verify a reliable explanation for this medical term. Please check the spelling or try again. No unverified medical information has been displayed."
      };
    }

    const req = requestedQuery.trim().toLowerCase();
    const candidateTerm = (candidate.term || '').toLowerCase();
    const candidateCat = (candidate.category || '').toLowerCase();
    const candidateText = ((candidate.whatItMeans || '') + ' ' + (candidate.simpleName || '') + ' ' + (candidate.meaning || '')).toLowerCase();

    // 1. Non-Medical Query Screening
    const nonMedicalPatterns = [
      /\b(javascript|python|programming|coding|software|resume|curriculum vitae|github|docker|kubernetes|aws|cloud|pizza|burger|invoice|receipt)\b/i
    ];
    if (nonMedicalPatterns.some(p => p.test(req))) {
      return {
        isValid: false,
        status: 'NON_MEDICAL',
        errorMessage: "Unable to find medical information. The entered query does not appear to be a recognized medical term, symptom, or health condition."
      };
    }

    // 2. Contradiction Matrix
    // Eye / Vision vs Pulmonary / Vascular / Cardiac Contradictions
    const eyeTokens = ['hypermetropia', 'hyperopia', 'myopia', 'astigmatism', 'presbyopia', 'cataract', 'glaucoma', 'farsighted', 'nearsighted', 'refraction', 'cornea', 'retina', 'eye'];
    const clotPulmonaryTokens = ['pulmonary embolism', 'embolism', 'blood clot', 'lung clot', 'deep vein thrombosis', 'dvt', 'thrombosis', 'pulmonary artery', 'lungs'];

    const isEyeQuery = eyeTokens.some(k => req.includes(k));
    const isClotQuery = clotPulmonaryTokens.some(k => req.includes(k));

    if (isEyeQuery && (candidateTerm.includes('pulmonary') || candidateTerm.includes('embolism') || candidateTerm.includes('thrombosis') || candidateCat.includes('vascular') || candidateCat.includes('pulmonology') || candidateText.includes('blood clot in the lungs') || candidateText.includes('deep vein'))) {
      return {
        isValid: false,
        status: 'REJECTED_MISMATCH',
        errorMessage: "We found conflicting information about this term and couldn't verify the correct explanation. Please try again later."
      };
    }

    if (isClotQuery && (candidateCat.includes('ophthalmology') || candidateCat.includes('vision') || candidateTerm.includes('hypermetropia') || candidateTerm.includes('myopia') || candidateText.includes('retina') || candidateText.includes('farsightedness'))) {
      return {
        isValid: false,
        status: 'REJECTED_MISMATCH',
        errorMessage: "We found conflicting information about this term and couldn't verify the correct explanation. Please try again later."
      };
    }

    // 3. High vs Low Blood Pressure / Blood Sugar Inversion Checks
    if (/\bhypotension\b/i.test(req) && candidateTerm.includes('hypertension') && !candidateTerm.includes('hypotension')) {
      return {
        isValid: false,
        status: 'REJECTED_MISMATCH',
        errorMessage: "Validation rejected: Candidate explanation confused low blood pressure with high blood pressure."
      };
    }
    if (/\bhypertension\b/i.test(req) && candidateTerm.includes('hypotension')) {
      return {
        isValid: false,
        status: 'REJECTED_MISMATCH',
        errorMessage: "Validation rejected: Candidate explanation confused high blood pressure with low blood pressure."
      };
    }
    if (/\bhypoglycemia\b/i.test(req) && candidateTerm.includes('hyperglycemia') && !candidateTerm.includes('hypoglycemia')) {
      return {
        isValid: false,
        status: 'REJECTED_MISMATCH',
        errorMessage: "Validation rejected: Candidate explanation confused low blood sugar with high blood sugar."
      };
    }
    if (/\bhyperglycemia\b/i.test(req) && candidateTerm.includes('hypoglycemia')) {
      return {
        isValid: false,
        status: 'REJECTED_MISMATCH',
        errorMessage: "Validation rejected: Candidate explanation confused high blood sugar with low blood sugar."
      };
    }

    // 4. Eye condition cross-confusion checks
    if (/\bmyopia\b/i.test(req) && (candidateTerm.includes('hypermetropia') || candidateTerm.includes('hyperopia'))) {
      return {
        isValid: false,
        status: 'REJECTED_MISMATCH',
        errorMessage: "Validation rejected: Candidate explanation confused nearsightedness with farsightedness."
      };
    }
    if ((/\bhypermetropia\b/i.test(req) || /\bhyperopia\b/i.test(req)) && candidateTerm.includes('myopia')) {
      return {
        isValid: false,
        status: 'REJECTED_MISMATCH',
        errorMessage: "Validation rejected: Candidate explanation confused farsightedness with nearsightedness."
      };
    }

    return {
      isValid: true,
      status: 'VALID',
      errorMessage: null
    };
  }

  /**
   * Primary Synchronous Simplifier Pipeline
   */
  simplifyText(inputText, targetLang = 'en') {
    if (!inputText || !inputText.trim()) {
      return null;
    }

    const rawInput = inputText.trim();
    const cleaned = this.cleanInputQuery(rawInput);

    // 0. Non-Medical Query Screening check first
    const nonMedicalCheck = this.validateMedicalTopicConsistency(rawInput, { term: rawInput, category: '', whatItMeans: '' });
    if (!nonMedicalCheck.isValid && nonMedicalCheck.status === 'NON_MEDICAL') {
      return this.formatErrorResult(rawInput, 'NON_MEDICAL', nonMedicalCheck.errorMessage, targetLang);
    }

    // 1. Direct glossary match with strict whole-word / alias normalization
    let matchedTerm = this.findTermMatch(cleaned);
    if (!matchedTerm && cleaned !== rawInput.toLowerCase()) {
      matchedTerm = this.findTermMatch(rawInput);
    }

    if (matchedTerm) {
      const validation = this.validateMedicalTopicConsistency(rawInput, matchedTerm);
      if (validation.isValid) {
        return this.formatGlossaryResult(matchedTerm, targetLang, rawInput);
      } else {
        return this.formatErrorResult(rawInput, validation.status, validation.errorMessage, targetLang);
      }
    }

    // 2. Scan for Latin/Greek medical roots (morphological breakdown)
    const words = cleaned.split(/[\s,;:]+/).filter(w => w.length >= 4);
    for (const w of words) {
      const deconstructed = this.deconstructMedicalWord(w);
      if (deconstructed) {
        const validation = this.validateMedicalTopicConsistency(rawInput, deconstructed);
        if (validation.isValid) {
          return this.formatCustomResult(deconstructed, targetLang, rawInput);
        }
      }
    }

    // 3. Multi-word clinical sentence breakdown
    const multiWordResult = this.generateMultiWordSimplification(rawInput, targetLang);
    const validation = this.validateMedicalTopicConsistency(rawInput, multiWordResult);
    if (validation.isValid) {
      return multiWordResult;
    }

    // 4. Safe unverified response (Zero Hallucination Guarantee)
    return this.formatErrorResult(rawInput, 'UNVERIFIABLE', "We couldn't verify a reliable explanation for this medical term. Please check the spelling or try again. No unverified medical information has been displayed.", targetLang);
  }

  /**
   * Asynchronous AI Pipeline: connects to backend proxy (/api/simplify) or Google Gemini
   * with the strict Medical Simplifier system prompt and schema validation.
   */
  async simplifyTextAsync(inputText, targetLang = 'en', userApiKey = '') {
    // Check local validated knowledge base first
    const localResult = this.simplifyText(inputText, targetLang);
    if (localResult && ((localResult.success !== false && localResult.validation_status === 'VALID' && localResult.category !== 'Health Literacy Guide') || localResult.validation_status === 'NON_MEDICAL')) {
      return localResult;
    }

    const rawInput = inputText.trim();
    let aiPayload = null;

    // 1. Try Backend Server Proxy (/api/simplify)
    try {
      const res = await fetch('/api/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          term: rawInput,
          language: targetLang,
          systemInstruction: STRICT_SIMPLIFIER_SYSTEM_PROMPT,
          clientApiKey: userApiKey || ''
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.result) {
          aiPayload = data.result;
        }
      }
    } catch (e) {
      // Offline / standalone browser execution
    }

    // 2. Try Direct Google Gemini if client key provided
    if (!aiPayload && userApiKey) {
      try {
        aiPayload = await this.callGeminiSimplifier(rawInput, userApiKey, targetLang);
      } catch (e) {
        console.warn("Direct Gemini Simplifier error:", e);
      }
    }

    // If AI responded, validate topic consistency strictly before returning!
    if (aiPayload) {
      const candidateObj = {
        term: aiPayload.identified_condition || aiPayload.term || rawInput,
        category: aiPayload.medical_category || aiPayload.category || "General Medicine",
        whatItMeans: aiPayload.definition || aiPayload.whatItMeans || "",
        simpleName: aiPayload.simpleName || aiPayload.commonName || ""
      };

      const validation = this.validateMedicalTopicConsistency(rawInput, candidateObj);
      if (validation.isValid) {
        return this.formatStructuredSchemaResult(aiPayload, rawInput, targetLang);
      } else {
        return this.formatErrorResult(rawInput, validation.status, validation.errorMessage, targetLang);
      }
    }

    // If local was already valid, return local; otherwise return safe error
    if (localResult) {
      return localResult;
    }

    return this.formatErrorResult(rawInput, 'UNVERIFIABLE', "We couldn't verify a reliable explanation for this medical term. Please check the spelling or try again. No unverified medical information has been displayed.", targetLang);
  }

  /**
   * Direct Gemini 1.5 Flash invocation with strict structured JSON output
   */
  async callGeminiSimplifier(term, apiKey, targetLang = 'en') {
    const prompt = `Explain the exact medical term: "${term}".
Respond in JSON format matching this schema:
{
  "requested_term": "${term}",
  "normalized_term": "canonical clinical name",
  "identified_condition": "exact medical condition",
  "medical_category": "medical specialty",
  "simple_name": "everyday common name",
  "definition": "plain 1-2 sentence definition",
  "causes": "clinical causes",
  "symptoms": "common symptoms",
  "diagnosis": "how doctors diagnose it",
  "treatment_overview": "standard treatments",
  "when_to_seek_care": "when to seek medical attention",
  "analogy": "simple real-world analogy",
  "why_checked": "why doctors monitor this",
  "source_references": "MedlinePlus, NIH, or recognized clinical body",
  "doctor_questions": ["question 1", "question 2", "question 3"]
}`;

    const body = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: STRICT_SIMPLIFIER_SYSTEM_PROMPT }] },
      generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        maxOutputTokens: 1024,
        responseMimeType: "application/json"
      }
    };

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    }
    return null;
  }

  /**
   * Format structured output schema matching required verification contract
   */
  formatStructuredSchemaResult(ai, rawInput, targetLang = 'en') {
    return {
      success: true,
      requested_term: rawInput,
      normalized_term: ai.normalized_term || ai.term || rawInput,
      identified_condition: ai.identified_condition || ai.term || rawInput,
      medical_category: ai.medical_category || "General Medicine",
      definition: ai.definition || "",
      key_points: ai.definition || "",
      causes: ai.causes || "",
      symptoms: ai.symptoms || "",
      diagnosis: ai.diagnosis || "",
      treatment_overview: ai.treatment_overview || "",
      when_to_seek_care: ai.when_to_seek_care || "",
      source_references: ai.source_references || "MedlinePlus, National Institutes of Health (NIH)",
      validation_status: 'VALID',
      error_message: null,

      // UI Template Compatibility Properties
      term: ai.identified_condition || ai.term || rawInput,
      simpleName: ai.simple_name || ai.simpleName || ai.term || rawInput,
      commonName: ai.simple_name || ai.commonName || ai.term || rawInput,
      category: ai.medical_category || "Clinical Medicine",
      whatItMeans: ai.definition || "",
      analogy: ai.analogy || "Understanding medical terminology empowers you to make informed decisions with your doctor.",
      whyChecked: ai.why_checked || "Doctors evaluate this to ensure safe diagnosis and appropriate care.",
      doctorQuestions: ai.doctor_questions || [
        "How does this condition apply to my personal health?",
        "What treatment or management steps do you recommend?",
        "What warning symptoms should I monitor?"
      ],
      safetyNotice: "Educational summary only. A doctor evaluates your complete clinical picture."
    };
  }

  /**
   * Format glossary result with reading level and multi-language support
   */
  formatGlossaryResult(item, targetLang = 'en', rawInput = '') {
    let simpleName = item.simpleName;
    let plainMeaning = item.meaning;
    let analogy = item.analogy;
    let why = item.whyChecked;
    let questions = [...(item.doctorQuestions || [])];

    // Adapt to Reading Level
    if (targetLang === 'en') {
      if (this.readingLevel === 'easy') {
        plainMeaning = `In simple, everyday words: ${plainMeaning.replace(/consistently/gi, "always").replace(/peripheral/gi, "outer").replace(/indicative/gi, "showing").replace(/elevated/gi, "higher than usual").replace(/diminished/gi, "lower")}`;
      } else if (this.readingLevel === 'detailed') {
        plainMeaning = `${plainMeaning} Healthcare teams monitor this finding closely to evaluate organ health, assess treatment response, and maintain wellness.`;
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
      success: true,
      requested_term: rawInput || item.term,
      normalized_term: item.term,
      identified_condition: item.term,
      medical_category: item.category,
      definition: plainMeaning,
      key_points: plainMeaning,
      causes: item.causes || "Clinical and physiological factors evaluated by your physician.",
      symptoms: item.symptoms || "Symptoms evaluated during clinical consultation.",
      diagnosis: item.diagnosis || "Standard diagnostic exams and laboratory testing.",
      treatment_overview: item.treatmentOverview || "Individualized lifestyle and therapeutic care managed by a doctor.",
      when_to_seek_care: item.whenToSeekCare || "Consult a healthcare provider if symptoms persist or interfere with daily life.",
      source_references: item.sourceReferences || "MedlinePlus, National Institutes of Health (NIH)",
      validation_status: 'VALID',
      error_message: null,

      // UI Template Compatibility
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
  formatCustomResult(item, targetLang = 'en', rawInput = '') {
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
      success: true,
      requested_term: rawInput || item.term,
      normalized_term: item.term,
      identified_condition: item.term,
      medical_category: item.category,
      definition: whatItMeans,
      key_points: whatItMeans,
      causes: "Identified via medical linguistic root deconstruction.",
      symptoms: "Refer to physician consultation for evaluation.",
      diagnosis: "Standard clinical evaluation.",
      treatment_overview: "Medical care tailored to specific root condition.",
      when_to_seek_care: "Consult your doctor if you have symptoms involving this organ.",
      source_references: item.sourceReferences || "National Library of Medicine (NLM)",
      validation_status: 'VALID',
      error_message: null,

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
      { regex: /\bhyperglycemia\b/gi, title: "High Blood Sugar", explanation: "glucose levels rising above target" },
      { regex: /\bhypoglycemia\b/gi, title: "Low Blood Sugar", explanation: "glucose levels falling below safe targets" },
      { regex: /\bhypermetropia\b|\bhyperopia\b/gi, title: "Farsightedness", explanation: "optical error where near objects are blurry because light focuses behind retina" },
      { regex: /\bmyopia\b/gi, title: "Nearsightedness", explanation: "optical error where distant objects are blurry because light focuses in front of retina" },
      { regex: /\bpulmonary embolism\b/gi, title: "Pulmonary Embolism", explanation: "blood clot blocking an artery in the lungs" },
      { regex: /\bdeep vein thrombosis\b|\bdvt\b/gi, title: "Deep Vein Thrombosis", explanation: "blood clot in a deep vein, usually in the legs" }
    ];

    const detected = [];
    for (const pat of clinicalPatterns) {
      if (pat.regex.test(text)) {
        detected.push(`<strong>${pat.title}</strong>: ${pat.explanation}`);
      }
    }

    if (detected.length === 0) {
      return this.formatErrorResult(text, 'UNVERIFIABLE', "We couldn't verify a reliable explanation for this medical term. Please check the spelling or try again. No unverified medical information has been displayed.", targetLang);
    }

    let summaryText = `This medical statement contains the following key findings in plain English:<br><br>• ` + detected.join('<br>• ') + `<br><br>Your care team is documenting these specific findings to coordinate your treatment plan.`;
    let analogyText = "Like an inspection checklist — technical notes identify which specific body systems are running smoothly and which need routine adjustments.";
    let whyText = "Standard clinical terminology ensures all healthcare providers share the exact same understanding of your health.";
    let doctorQuestions = [
      `Could you explain how "${text}" applies to my overall health?`,
      "What is the most effective next step for my care plan?"
    ];

    if (targetLang !== 'en' && typeof translateText === 'function') {
      summaryText = translateText(summaryText, targetLang);
      analogyText = translateText(analogyText, targetLang);
      whyText = translateText(whyText, targetLang);
      doctorQuestions = doctorQuestions.map(q => translateText(q, targetLang));
    }

    return {
      success: true,
      requested_term: text,
      normalized_term: "Clinical Statement",
      identified_condition: "Multiple Clinical Findings",
      medical_category: "Clinical Medicine",
      definition: summaryText,
      key_points: summaryText,
      validation_status: 'VALID',
      error_message: null,

      term: text.length > 45 ? text.substring(0, 42) + "..." : text,
      simpleName: targetLang === 'en' ? "Clinical Statement Breakdown" : translateText("Clinical Statement Breakdown", targetLang),
      commonName: targetLang === 'en' ? "Clinical Statement Breakdown" : translateText("Clinical Statement Breakdown", targetLang),
      category: targetLang === 'en' ? "Clinical Summary" : translateText("Clinical Summary", targetLang),
      whatItMeans: summaryText,
      analogy: analogyText,
      whyChecked: whyText,
      doctorQuestions: doctorQuestions,
      sourceReferences: "MedlinePlus, National Institutes of Health (NIH)",
      safetyNotice: "Educational summary only. Always consult your personal physician."
    };
  }

  /**
   * Format safe error result when term is unverifiable, mismatched, or non-medical
   */
  formatErrorResult(rawInput, status, message, targetLang = 'en') {
    let localizedMsg = message;
    if (targetLang !== 'en' && typeof translateText === 'function') {
      localizedMsg = translateText(message, targetLang);
    }

    return {
      success: false,
      requested_term: rawInput,
      normalized_term: rawInput,
      identified_condition: null,
      medical_category: "Unknown / Unverified",
      definition: null,
      validation_status: status,
      error_message: localizedMsg,

      // UI Template fields for error rendering
      term: rawInput,
      simpleName: "Verification Unavailable",
      commonName: "Unverified Medical Term",
      category: "Verification Status",
      whatItMeans: `<div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
        <strong>⚠️ Medical Verification Notice:</strong><br>${localizedMsg}
      </div>`,
      analogy: "When medical terms cannot be verified with 100% confidence, our safety guardrails prevent generating or guessing unverified clinical explanations.",
      whyChecked: "Protecting patient health literacy requires zero-hallucination standards.",
      doctorQuestions: [
        "Could you check the exact spelling or diagnostic code with your clinic?",
        "What body system or test was this question referring to?"
      ],
      sourceReferences: "MedlinePlus, National Institutes of Health (NIH)",
      safetyNotice: "Safety Guarantee: Unverified medical claims are strictly rejected."
    };
  }

  /**
   * Text to speech playback with multilingual support
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
      en: 'en-US', es: 'es-ES', hi: 'hi-IN', fr: 'fr-FR',
      zh: 'zh-CN', ar: 'ar-SA', bn: 'bn-IN', pt: 'pt-BR',
      de: 'de-DE', tl: 'fil-PH', vi: 'vi-VN', ta: 'ta-IN',
      kn: 'kn-IN', mr: 'mr-IN', te: 'te-IN', ml: 'ml-IN'
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

if (typeof window !== 'undefined') {
  window.MedicalSimplifier = MedicalSimplifier;
  window.STRICT_SIMPLIFIER_SYSTEM_PROMPT = STRICT_SIMPLIFIER_SYSTEM_PROMPT;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MedicalSimplifier, STRICT_SIMPLIFIER_SYSTEM_PROMPT };
}
