/**
 * MediBridge AI - Medical Information Simplifier Engine
 * Converts complex clinical jargon into compassionate, plain-language patient guides
 */

class MedicalSimplifier {
  constructor() {
    this.glossary = (typeof MEDICAL_GLOSSARY !== 'undefined') ? MEDICAL_GLOSSARY : [];
    this.readingLevel = 'easy'; // 'easy' (5th grade), 'standard', 'detailed'
    this.speechSynth = window.speechSynthesis || null;
    this.currentUtterance = null;
  }

  setReadingLevel(level) {
    this.readingLevel = level;
  }

  /**
   * Find exact or partial match in glossary
   */
  findTermMatch(inputQuery) {
    if (!inputQuery) return null;
    const cleanQuery = inputQuery.trim().toLowerCase();

    // 1. Direct match on term or simpleName
    let match = this.glossary.find(item => 
      item.term.toLowerCase() === cleanQuery || 
      item.simpleName.toLowerCase() === cleanQuery
    );
    if (match) return match;

    // 2. Contains match
    match = this.glossary.find(item => 
      cleanQuery.includes(item.term.toLowerCase()) || 
      item.term.toLowerCase().includes(cleanQuery)
    );
    if (match) return match;

    // 3. Keyword heuristic search
    const keywords = [
      { key: "pressure", termName: "Hypertension" },
      { key: "bp", termName: "Hypertension" },
      { key: "heart attack", termName: "Myocardial Infarction" },
      { key: "coronary", termName: "Myocardial Infarction" },
      { key: "infarction", termName: "Myocardial Infarction" },
      { key: "sugar", termName: "HbA1c (Hemoglobin A1c)" },
      { key: "diabetes", termName: "HbA1c (Hemoglobin A1c)" },
      { key: "glucose", termName: "Postprandial Hyperglycemia" },
      { key: "prostate", termName: "Benign Prostatic Hyperplasia (BPH)" },
      { key: "breath", termName: "Dyspnea on Exertion" },
      { key: "dyspnea", termName: "Dyspnea on Exertion" },
      { key: "nerve", termName: "Neuropathy" },
      { key: "tingling", termName: "Neuropathy" },
      { key: "numbness", termName: "Neuropathy" },
      { key: "liver", termName: "Alanine Aminotransferase (ALT)" },
      { key: "alt", termName: "Alanine Aminotransferase (ALT)" },
      { key: "kidney", termName: "eGFR (Estimated Glomerular Filtration Rate)" },
      { key: "egfr", termName: "eGFR (Estimated Glomerular Filtration Rate)" },
      { key: "reflux", termName: "Gastroesophageal Reflux Disease (GERD)" },
      { key: "heartburn", termName: "Gastroesophageal Reflux Disease (GERD)" },
      { key: "artery", termName: "Atherosclerosis" },
      { key: "clogged", termName: "Atherosclerosis" },
      { key: "lung fluid", termName: "Pleural Effusion" }
    ];

    for (const kw of keywords) {
      if (cleanQuery.includes(kw.key)) {
        return this.glossary.find(g => g.term === kw.termName) || null;
      }
    }

    return null;
  }

  /**
   * General Clinical Rules Engine for free-form medical sentences
   */
  simplifyText(inputText) {
    if (!inputText || !inputText.trim()) {
      return null;
    }

    const trimmed = inputText.trim();
    const matchedTerm = this.findTermMatch(trimmed);

    if (matchedTerm) {
      return this.formatGlossaryResult(matchedTerm);
    }

    // If not a single matched glossary term, parse clinical phrases and keywords
    return this.generateCustomSimplification(trimmed);
  }

  formatGlossaryResult(item) {
    let plainMeaning = item.meaning;
    let analogy = item.analogy;
    let why = item.whyChecked;

    // Adapt to reading level
    if (this.readingLevel === 'easy') {
      plainMeaning = `In simple terms: ${plainMeaning.replace(/consistently/g, "always").replace(/peripheral/g, "outer").replace(/indicative/g, "showing")}`;
    } else if (this.readingLevel === 'detailed') {
      plainMeaning = `${plainMeaning} This is a clinical observation used by healthcare teams to evaluate health patterns and guide preventive care.`;
    }

    return {
      term: item.term,
      simpleName: item.simpleName,
      category: item.category,
      whatItMeans: plainMeaning,
      analogy: analogy,
      whyChecked: why,
      doctorQuestions: item.doctorQuestions,
      safetyNotice: "Educational summary only. A doctor considers this in the context of your complete health history."
    };
  }

  generateCustomSimplification(text) {
    const medicalReplacements = [
      { regex: /\bhypertension\b/gi, replacement: "high blood pressure" },
      { regex: /\bhypotension\b/gi, replacement: "low blood pressure" },
      { regex: /\bmyocardial infarction\b/gi, replacement: "heart attack" },
      { regex: /\bdyspnea\b/gi, replacement: "shortness of breath" },
      { regex: /\btachycardia\b/gi, replacement: "fast heart rate" },
      { regex: /\bbradycardia\b/gi, replacement: "slow heart rate" },
      { regex: /\bedema\b/gi, replacement: "swelling from trapped fluid" },
      { regex: /\bidiopathic\b/gi, replacement: "without a known cause" },
      { regex: /\bneoplasm\b/gi, replacement: "unusual growth of tissue" },
      { regex: /\bbenign\b/gi, replacement: "not cancerous" },
      { regex: /\bmalignant\b/gi, replacement: "cancerous" },
      { regex: /\bprn\b/gi, replacement: "as needed" },
      { regex: /\bpostprandial\b/gi, replacement: "after a meal" },
      { regex: /\bhyperglycemia\b/gi, replacement: "high blood sugar" },
      { regex: /\bhypoglycemia\b/gi, replacement: "low blood sugar" },
      { regex: /\batelectasis\b/gi, replacement: "partial lung collapse or air sacs not fully expanding" },
      { regex: /\bconsolidation\b/gi, replacement: "fluid or inflammation filling part of the lung" },
      { regex: /\bhyperlipidemia\b/gi, replacement: "high cholesterol and fat in the blood" },
      { regex: /\bnephropathy\b/gi, replacement: "kidney health changes" },
      { regex: /\bneuropathy\b/gi, replacement: "nerve irritation or numbness" },
      { regex: /\bcephalea\b/gi, replacement: "headache" },
      { regex: /\bambulatory\b/gi, replacement: "able to walk" }
    ];

    let simplifiedSentence = text;
    const detectedKeywords = [];

    for (const rep of medicalReplacements) {
      if (rep.regex.test(simplifiedSentence)) {
        detectedKeywords.push(rep.replacement);
        simplifiedSentence = simplifiedSentence.replace(rep.regex, `<strong>${rep.replacement}</strong>`);
      }
    }

    return {
      term: text.length > 50 ? text.substring(0, 47) + "..." : text,
      simpleName: "Clinical Statement Breakdown",
      category: "General Medical Translation",
      whatItMeans: `Here is the sentence broken down in everyday English: "${simplifiedSentence}". When doctors write notes like this, they use technical shorthand to document observations efficiently.`,
      analogy: "Reading a medical chart is like reading an airplane flight log — the shorthand seems dense, but it's just describing routine observations in standardized codes.",
      whyChecked: "Healthcare providers record these clinical descriptions so all members of your care team (nurses, specialists, pharmacists) stay on the exact same page.",
      doctorQuestions: [
        "Could you explain how this note relates to how I'm feeling day-to-day?",
        "Are any of these findings temporary, or do they require long-term monitoring?",
        "What is the most important next step for me to take?"
      ],
      safetyNotice: "Informational breakdown only. Always review doctor notes directly with your treating clinician."
    };
  }

  /**
   * Text to speech playback
   */
  speakText(text, lang = 'en-US') {
    if (!this.speechSynth) {
      alert("Text-to-speech is not supported by your current browser.");
      return;
    }

    if (this.speechSynth.speaking) {
      this.speechSynth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Slightly slower, calm speaking rate for healthcare clarity
    utterance.pitch = 1.0;
    
    // Match language tag
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
      ta: 'ta-IN'
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
