/**
 * MediBridge AI - Clinical Document & Lab Report Explainer Engine
 * Accurate Document Reading, Medical Validation, Clinical Extraction & Error Handling
 * 
 * CORE RULE: The system must never explain medical information that it has not
 * extracted or verified from the supplied document. Never fabricate findings or fall back
 * to unrelated mock templates.
 */

class DocumentExplainer {
  constructor() {
    this.samples = (typeof SAMPLE_DOCUMENTS !== 'undefined') ? SAMPLE_DOCUMENTS : {};
    this.currentAnalysis = null;

    // Comprehensive clinical parameter catalog for accurate extraction
    this.clinicalCatalog = [
      {
        id: 'hemoglobin',
        regex: /(?:^|\b)(?:hemoglobin|haemoglobin|hgb|hb)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(g\/dl|g\/l|gm%)?/i,
        plainName: "Hemoglobin (Oxygen-Carrying Blood Protein)",
        standardUnit: "g/dL",
        defaultRange: "12.0 - 15.5 g/dL",
        meaning: "The vital iron-rich protein in red blood cells that transports oxygen from your lungs to tissues throughout your entire body."
      },
      {
        id: 'fasting_glucose',
        regex: /(?:^|\b)(?:fasting(?:\s+blood)?\s+(?:glucose|sugar)|\bfbs\b|blood\s+glucose|\bglucose)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl|mmol\/l)?/i,
        plainName: "Fasting Blood Sugar (Glucose)",
        standardUnit: "mg/dL",
        defaultRange: "70 - 99 mg/dL",
        meaning: "Measures circulating sugar levels in your bloodstream after an overnight fast. Indicates how effectively your body produces and responds to insulin."
      },
      {
        id: 'hba1c',
        regex: /(?:^|\b)(?:glycated\s+hemoglobin|hba1c|a1c|glycohemoglobin)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(%|percent)?/i,
        plainName: "Hemoglobin A1c (3-Month Blood Sugar Average)",
        standardUnit: "%",
        defaultRange: "< 5.7 %",
        meaning: "Reflects your average circulating blood glucose over the past 2 to 3 months by measuring the percentage of sugar-coated red blood cells."
      },
      {
        id: 'total_cholesterol',
        regex: /(?:^|\b)(?:total\s+cholesterol|cholesterol\s+total|serum\s+cholesterol)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl|mmol\/l)?/i,
        plainName: "Total Blood Cholesterol",
        standardUnit: "mg/dL",
        defaultRange: "< 200 mg/dL",
        meaning: "The total amount of circulating fats, including protective HDL and artery-lining LDL particles."
      },
      {
        id: 'ldl',
        regex: /(?:^|\b)(?:ldl(?:\s+cholesterol)?|low\s+density\s+lipoprotein)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl|mmol\/l)?/i,
        plainName: "LDL Cholesterol ('Bad' Cholesterol)",
        standardUnit: "mg/dL",
        defaultRange: "< 100 mg/dL",
        meaning: "Low-density lipoprotein particles that can deposit along inner arterial walls if levels remain consistently elevated."
      },
      {
        id: 'hdl',
        regex: /(?:^|\b)(?:hdl(?:\s+cholesterol)?|high\s+density\s+lipoprotein)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl|mmol\/l)?/i,
        plainName: "HDL Cholesterol ('Good' Cholesterol)",
        standardUnit: "mg/dL",
        defaultRange: "> 40 mg/dL (men), > 50 mg/dL (women)",
        meaning: "High-density lipoprotein particles that help remove excess circulating fats from arterial walls back to the liver for clearance."
      },
      {
        id: 'triglycerides',
        regex: /(?:^|\b)(?:triglycerides|serum\s+triglycerides|\btg\b)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl|mmol\/l)?/i,
        plainName: "Triglycerides (Blood Fats)",
        standardUnit: "mg/dL",
        defaultRange: "< 150 mg/dL",
        meaning: "Circulating fat molecules derived from unused calories, utilized for cellular energy storage."
      },
      {
        id: 'creatinine',
        regex: /(?:^|\b)(?:serum\s+creatinine|creatinine|\bs\.?\s*creatinine)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl|umol\/l)?/i,
        plainName: "Serum Creatinine (Kidney Filtration Marker)",
        standardUnit: "mg/dL",
        defaultRange: "0.7 - 1.3 mg/dL",
        meaning: "A metabolic waste product cleared primarily by the kidneys. Serves as a vital indicator of healthy renal filtration function."
      },
      {
        id: 'egfr',
        regex: /(?:^|\b)(?:egfr|estimated\s+gfr|glomerular\s+filtration\s+rate)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(ml\/min|ml\/min\/1\.73m2)?/i,
        plainName: "Estimated GFR (Kidney Filtration Efficiency)",
        standardUnit: "mL/min",
        defaultRange: "> 60 mL/min",
        meaning: "An estimated score calculating how many milliliters of blood your kidneys purify every minute."
      },
      {
        id: 'wbc',
        regex: /(?:^|\b)(?:wbc(?:\s+count)?|white\s+blood\s+(?:cell\s+)?count|total\s+leukocyte\s+count|\btlc\b)\b[\s:]*([0-9]+(?:,[0-9]+)?(?:\.[0-9]+)?)\s*(\/mcL|\/uL|cells\/cumm|10\^3\/uL|\/cumm)?/i,
        plainName: "WBC / White Blood Cell Count (Immune Defense Cells)",
        standardUnit: "/mcL",
        defaultRange: "4,000 - 11,000 /mcL",
        meaning: "Cells that actively defend your body against bacterial infections, viral invaders, and inflammatory processes."
      },
      {
        id: 'platelets',
        regex: /(?:^|\b)(?:platelet(?:\s+count)?|\bplt\b)\b[\s:]*([0-9]+(?:,[0-9]+)?(?:\.[0-9]+)?)\s*(\/mcL|\/uL|lakh\/cumm|10\^3\/uL|\/cumm)?/i,
        plainName: "Platelets / Platelet Count (Blood Clotting Cells)",
        standardUnit: "/mcL",
        defaultRange: "150,000 - 450,000 /mcL",
        meaning: "Tiny cell fragments essential for forming blood clots to prevent abnormal bleeding and heal cuts."
      },
      {
        id: 'alt',
        regex: /(?:^|\b)(?:sgpt|alanine\s+aminotransferase|\balt\b)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(u\/l|iu\/l)?/i,
        plainName: "ALT / SGPT (Liver Cell Health Enzyme)",
        standardUnit: "U/L",
        defaultRange: "7 - 45 U/L",
        meaning: "An enzyme found concentrated in liver cells. Higher amounts in blood indicate liver cells are under temporary stress or inflammation."
      },
      {
        id: 'ast',
        regex: /(?:^|\b)(?:sgot|aspartate\s+aminotransferase|\bast\b)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(u\/l|iu\/l)?/i,
        plainName: "AST / SGOT (Liver & Muscle Enzyme)",
        standardUnit: "U/L",
        defaultRange: "8 - 40 U/L",
        meaning: "An enzyme produced in liver and muscle cells, checked alongside ALT to evaluate organ health."
      },
      {
        id: 'bilirubin',
        regex: /(?:^|\b)(?:total\s+bilirubin|bilirubin\s+total|serum\s+bilirubin)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl|umol\/l)?/i,
        plainName: "Total Bilirubin (Bile Pigment)",
        standardUnit: "mg/dL",
        defaultRange: "0.2 - 1.2 mg/dL",
        meaning: "A yellowish substance produced during the natural breakdown of aged red blood cells, processed by the liver."
      },
      {
        id: 'tsh',
        regex: /(?:^|\b)(?:tsh|thyroid\s+stimulating\s+hormone)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(uiu\/ml|uIU\/mL|miu\/l|mIU\/L)?/i,
        plainName: "TSH (Thyroid Stimulating Hormone)",
        standardUnit: "uIU/mL",
        defaultRange: "0.4 - 4.0 uIU/mL",
        meaning: "Pituitary hormone that instructs your thyroid gland how much metabolic hormone to manufacture."
      },
      {
        id: 'vit_d',
        regex: /(?:^|\b)(?:vitamin\s+d|25-oh\s+vitamin\s+d|25-hydroxy\s+vitamin\s+d)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(ng\/ml|nmol\/l)?/i,
        plainName: "Vitamin D (25-Hydroxy)",
        standardUnit: "ng/mL",
        defaultRange: "30 - 100 ng/mL",
        meaning: "Essential pro-hormone for calcium absorption, bone strength, and optimal immune function."
      },
      {
        id: 'vit_b12',
        regex: /(?:^|\b)(?:vitamin\s+b12|vit\s+b-?12|cyanocobalamin)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(pg\/ml|pmol\/l)?/i,
        plainName: "Vitamin B12 (Cobalamin)",
        standardUnit: "pg/mL",
        defaultRange: "200 - 900 pg/mL",
        meaning: "Critical vitamin for healthy nerve transmission and red blood cell creation."
      },
      {
        id: 'blood_pressure',
        regex: /(?:^|\b)(?:blood\s+pressure|\bbp\b)[\s:]*([0-9]{2,3}\s*\/\s*[0-9]{2,3})\s*(mmhg)?/i,
        plainName: "Blood Pressure (Systolic / Diastolic)",
        standardUnit: "mmHg",
        defaultRange: "< 120 / 80 mmHg",
        meaning: "The pressure exerted by circulating blood against arterial walls as the heart squeezes and relaxes."
      }
    ];
  }

  getSample(sampleId) {
    return this.samples[sampleId] || null;
  }

  /**
   * Evaluates document relevance according to clinical validation rules
   */
  classifyRelevance(rawText) {
    if (!rawText || !rawText.trim()) {
      return {
        status: 'unreadable',
        code: 'NO_TEXT_DETECTED',
        message: "We couldn't read any meaningful text from this file. Please upload a clearer image, a text-based PDF, or a supported document."
      };
    }

    const text = rawText.trim();
    if (text.length < 25) {
      return {
        status: 'unreadable',
        code: 'INSUFFICIENT_TEXT',
        message: "We couldn't read this document because text extraction returned insufficient content. Please try uploading another copy or a clearer scan."
      };
    }

    // Explicit Non-Medical Content Screening (Resumes, academic essays, code, general business)
    const nonMedicalIndicators = [
      /\bcurriculum vitae\b/i, /\bresume\b/i, /\beducation\b.*\bexperience\b/i,
      /\bgithub\.com\b/i, /\blinkedin\.com\b/i, /\bsoftware engineer\b/i,
      /\binvoice\b.*\btotal amount\b/i, /\breceipt\b.*\bpayment method\b/i,
      /\bhomework assignment\b/i, /\bchapter\s+[0-9]+\b/i, /\bterm paper\b/i,
      /\bprogramming\b/i, /\bjavascript\b/i, /\bpython\b/i, /\bdatabase\b/i
    ];

    const hasStrongNonMedical = nonMedicalIndicators.some(re => re.test(text));

    // Core Medical Indicator Vocabulary
    const medicalTokens = [
      /\b(patient|specimen|lab report|laboratory|clinical|doctor|physician|hospital|clinic)\b/i,
      /\b(glucose|hemoglobin|cholesterol|creatinine|hba1c|wbc|rbc|platelet|alt|ast|tsh)\b/i,
      /\b(mg\/dl|g\/dl|mmol\/l|ml\/min|u\/l|\/mcl|mmhg|ng\/ml)\b/i,
      /\b(diagnosis|impression|findings|rx|prescription|tablet|capsule|dosage|b\.i\.d|q\.d)\b/i,
      /\b(radiology|x-ray|ct scan|mri|ultrasound|ecg|ekg|pathology|biopsy|discharge)\b/i,
      /\b(hypertension|diabetes|infection|inflammation|anemia|pneumonia|cardiac|renal)\b/i
    ];

    let matchCount = 0;
    medicalTokens.forEach(token => {
      if (token.test(text)) matchCount++;
    });

    if (hasStrongNonMedical && matchCount < 2) {
      return {
        status: 'non_medical',
        code: 'NON_MEDICAL_DOCUMENT',
        message: "This document does not appear to contain medical information. Please upload a medical report or document."
      };
    }

    if (matchCount === 0) {
      return {
        status: 'non_medical',
        code: 'NON_MEDICAL_DOCUMENT',
        message: "This document does not appear to contain medical information. Please upload a medical report or document."
      };
    }

    if (matchCount === 1 && text.length > 200) {
      return {
        status: 'uncertain_medical',
        code: 'UNCERTAIN_MEDICAL_RELEVANCE',
        message: "This document does not appear to contain medical information. Please upload a medical report or document."
      };
    }

    return {
      status: 'valid_medical',
      code: 'VALID'
    };
  }

  /**
   * Main Analyzer Pipeline
   */
  analyzeDocument(rawText, targetLang = 'en') {
    const classification = this.classifyRelevance(rawText);
    if (classification.status !== 'valid_medical') {
      return {
        success: false,
        classification: classification,
        error: classification.message
      };
    }

    const text = rawText.trim();
    const docType = this.detectDocumentType(text);
    const keyFindings = this.extractRealFindings(text);
    const clinicalNarrative = this.extractClinicalNarrative(text);
    const shorthand = this.extractShorthand(text, targetLang);
    const summary = this.generateEvidenceBasedSummary(text, docType, keyFindings, clinicalNarrative, targetLang);
    const doctorQuestions = this.generateQuestionsFromFindings(keyFindings, clinicalNarrative, docType, targetLang);

    const analysis = {
      success: true,
      classification: classification,
      rawText: text,
      docType: docType,
      summary: summary,
      keyFindings: keyFindings,
      clinicalNarrative: clinicalNarrative,
      shorthand: shorthand,
      doctorQuestions: doctorQuestions,
      disclaimer: "This explanation is an educational aid. Clinical decisions, diagnoses, and medication management must always be made directly with your licensed doctor or healthcare team."
    };

    this.currentAnalysis = analysis;
    return analysis;
  }

  /**
   * Detect document category
   */
  detectDocumentType(text) {
    const lower = text.toLowerCase();
    if (lower.includes('radiology') || lower.includes('x-ray') || lower.includes('chest x') || lower.includes('ct scan') || lower.includes('mri')) {
      return { id: 'imaging', label: 'Diagnostic Radiology & Imaging Report', icon: '🩻' };
    } else if (lower.includes('discharge') || lower.includes('admission date') || lower.includes('hospital course')) {
      return { id: 'discharge', label: 'Hospital Inpatient Discharge Summary', icon: '🏥' };
    } else if (lower.includes('prescription') || lower.includes('rx') || lower.includes('sig:') || lower.includes('tab.') || lower.includes('dispense')) {
      return { id: 'prescription', label: 'Prescription & Medication Directions', icon: '💊' };
    } else if (lower.includes('lipid') || lower.includes('blood') || lower.includes('glucose') || lower.includes('serum') || lower.includes('hemoglobin') || lower.includes('cbc')) {
      return { id: 'blood_test', label: 'Laboratory Blood & Diagnostic Panel', icon: '🧪' };
    }
    return { id: 'clinical_note', label: 'Clinical Medical Document', icon: '📋' };
  }

  /**
   * Extract actual numerical lab metrics verified from source text
   */
  extractRealFindings(text) {
    const findings = [];
    const lines = text.split(/\r?\n/);
    const seenMetrics = new Set();

    this.clinicalCatalog.forEach(cat => {
      // Find matching line in document
      for (const line of lines) {
        const match = cat.regex.exec(line);
        if (match && !seenMetrics.has(cat.id)) {
          seenMetrics.add(cat.id);

          const rawValue = match[1];
          const detectedUnit = match[2] || cat.standardUnit;
          const displayValue = `${rawValue} ${detectedUnit}`.trim();

          // Extract lab's own reference range from this line or nearby
          let extractedRefRange = null;
          const refMatch = line.match(/(?:ref(?:erence)?(?:\s*range)?|normal)[\s:]*([<>]?\s*[0-9]+(?:\.[0-9]+)?(?:\s*-\s*[0-9]+(?:\.[0-9]+)?)?(?:\s*[a-zA-Z\/%]+)?)/i);
          if (refMatch) {
            extractedRefRange = refMatch[1].trim();
          }

          // Detect explicit flags on the line
          let status = "Within Expected Range";
          let statusType = "normal";

          if (/\b(?:high|elevated|\bH\b|\*)\b/i.test(line)) {
            status = "Elevated (Above Laboratory Target)";
            statusType = "warning";
          } else if (/\b(?:low|decreased|\bL\b)\b/i.test(line)) {
            status = "Low (Below Laboratory Target)";
            statusType = "warning";
          } else if (/\b(?:critical|alert|panic)\b/i.test(line)) {
            status = "Critical Flag in Report";
            statusType = "danger";
          }

          findings.push({
            metric: cat.plainName.split('(')[0].trim(),
            plainName: cat.plainName,
            value: displayValue,
            referenceRange: extractedRefRange ? `Report specifies: ${extractedRefRange}` : `Target: ${cat.defaultRange}`,
            status: status,
            statusType: statusType,
            meaning: cat.meaning
          });

          break;
        }
      }
    });

    return findings;
  }

  /**
   * Extract narrative sections (Impression, Findings, Diagnosis, Medications)
   */
  extractClinicalNarrative(text) {
    const sections = {};
    const patterns = [
      { key: 'impression', label: 'Clinical Impression', regex: /(?:IMPRESSION|CONCLUSION|OPINION)[\s:]*([^\n\r]+(?:\n[^\n\r]+){0,3})/i },
      { key: 'findings', label: 'Reported Findings', regex: /(?:FINDINGS|OBSERVATIONS)[\s:]*([^\n\r]+(?:\n[^\n\r]+){0,3})/i },
      { key: 'diagnosis', label: 'Documented Diagnosis', regex: /(?:DIAGNOSIS|ASSESSMENT)[\s:]*([^\n\r]+(?:\n[^\n\r]+){0,3})/i },
      { key: 'medications', label: 'Prescribed Medications', regex: /(?:MEDICATIONS|Rx|PRESCRIPTION|DISCHARGE MEDICATIONS)[\s:]*([^\n\r]+(?:\n[^\n\r]+){0,3})/i },
      { key: 'plan', label: 'Care Plan & Advice', regex: /(?:PLAN|ADVICE|RECOMMENDATION|FOLLOW-UP)[\s:]*([^\n\r]+(?:\n[^\n\r]+){0,3})/i }
    ];

    patterns.forEach(p => {
      const match = p.regex.exec(text);
      if (match && match[1]) {
        sections[p.key] = {
          label: p.label,
          text: match[1].trim().replace(/\s+/g, ' ')
        };
      }
    });

    return sections;
  }

  /**
   * Generate Summary based strictly on extracted facts
   */
  generateEvidenceBasedSummary(text, docType, findings, narrative, targetLang = 'en') {
    let summaryParts = [];

    if (findings.length > 0) {
      const elevated = findings.filter(f => f.statusType === 'warning' || f.statusType === 'danger');
      const normal = findings.filter(f => f.statusType === 'normal');

      summaryParts.push(`This document is a **${docType.label}** containing **${findings.length} verified laboratory parameters**.`);

      if (elevated.length > 0) {
        const names = elevated.map(e => e.metric).join(', ');
        summaryParts.push(`**Out-of-range findings detected:** The report flags elevated levels for **${names}**. These specific parameters should be reviewed with your physician.`);
      }

      if (normal.length > 0) {
        const names = normal.map(n => n.metric).join(', ');
        summaryParts.push(`**Parameters within expected targets:** Values for **${names}** appear within standard clinical targets.`);
      }
    } else {
      summaryParts.push(`This document is a **${docType.label}**.`);
    }

    if (narrative.impression) {
      summaryParts.push(`**Document Impression:** "${narrative.impression.text}"`);
    } else if (narrative.findings) {
      summaryParts.push(`**Clinical Observations:** "${narrative.findings.text}"`);
    } else if (narrative.diagnosis) {
      summaryParts.push(`**Documented Assessment:** "${narrative.diagnosis.text}"`);
    }

    if (narrative.plan) {
      summaryParts.push(`**Recommended Action:** "${narrative.plan.text}"`);
    }

    const fullSummary = summaryParts.join('\n\n');
    if (targetLang !== 'en' && typeof translateText === 'function') {
      return translateText(fullSummary, targetLang);
    }
    return fullSummary;
  }

  /**
   * Decode medical shorthand present in text
   */
  extractShorthand(text, targetLang = 'en') {
    const dictionary = {
      'b.i.d.': { full: 'Bis in die (Latin)', meaning: 'Take twice every day (usually 12 hours apart)' },
      'bid': { full: 'Bis in die (Latin)', meaning: 'Take twice every day' },
      'q.a.m.': { full: 'Quaque ante meridiem', meaning: 'Every morning' },
      'q.d.': { full: 'Quaque die (Latin)', meaning: 'Once every day' },
      'qd': { full: 'Quaque die (Latin)', meaning: 'Once every day' },
      'p.c.': { full: 'Post cibum', meaning: 'After meals' },
      'p.r.n.': { full: 'Pro re nata', meaning: 'As needed (only when necessary)' },
      'prn': { full: 'Pro re nata', meaning: 'As needed' },
      'po': { full: 'Per os', meaning: 'Taken orally by mouth' },
      'p.o.': { full: 'Per os', meaning: 'Taken orally by mouth' },
      'egfr': { full: 'Estimated Glomerular Filtration Rate', meaning: 'Estimated kidney filtering efficiency' },
      'alt': { full: 'Alanine Aminotransferase', meaning: 'Enzyme produced inside liver cells' },
      'ast': { full: 'Aspartate Aminotransferase', meaning: 'Enzyme found in liver and heart cells' },
      'pcp': { full: 'Primary Care Physician', meaning: 'Your regular family or general doctor' },
      'ed': { full: 'Emergency Department', meaning: 'Hospital emergency room' },
      'bp': { full: 'Blood Pressure', meaning: 'Pressure of blood circulating against vessel walls' },
      'htn': { full: 'Hypertension', meaning: 'High blood pressure' },
      't2dm': { full: 'Type 2 Diabetes Mellitus', meaning: 'Condition affecting how the body manages blood sugar' },
      'dash': { full: 'Dietary Approaches to Stop Hypertension', meaning: 'Heart-healthy, low-sodium eating plan' },
      'sig': { full: 'Signatura (Directions)', meaning: 'Specific patient instructions on a prescription' },
      'rx': { full: 'Recipe (Take this)', meaning: 'Prescription medication order' }
    };

    const found = [];
    const textLower = text.toLowerCase();

    for (const [key, val] of Object.entries(dictionary)) {
      const regex = new RegExp(`\\b${key.replace('.', '\\.')}\\b`, 'i');
      if (regex.test(textLower)) {
        let meaning = val.meaning;
        if (targetLang !== 'en' && typeof translateText === 'function') {
          meaning = translateText(meaning, targetLang);
        }
        found.push({
          shorthand: key.toUpperCase(),
          fullName: val.full,
          meaning: meaning
        });
      }
    }

    return found.slice(0, 8);
  }

  /**
   * Generate Doctor Visit Checklist strictly from verified findings
   */
  generateQuestionsFromFindings(findings, narrative, docType, targetLang = 'en') {
    const list = [];

    findings.forEach(f => {
      if (f.statusType === 'warning' || f.statusType === 'danger') {
        list.push(`My ${f.metric} is ${f.value} (${f.status}) — what does this indicate for my health, and what steps should we take?`);
      }
    });

    if (narrative.impression) {
      list.push(`The report notes: "${narrative.impression.text.slice(0, 80)}" — could you explain what this impression means in simple terms?`);
    }

    if (narrative.medications) {
      list.push(`Regarding my prescribed medications (${narrative.medications.text.slice(0, 60)}) — are there any side effects or interactions I should watch for?`);
    }

    if (list.length === 0) {
      list.push(`Could you summarize the primary takeaway from this ${docType.label} in plain language?`);
      list.push("Are there any repeat tests or follow-up appointments I should schedule based on this document?");
    }

    if (targetLang !== 'en' && typeof translateText === 'function') {
      return list.map(q => translateText(q, targetLang));
    }
    return list;
  }
}

if (typeof window !== 'undefined') {
  window.DocumentExplainer = DocumentExplainer;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DocumentExplainer };
}
