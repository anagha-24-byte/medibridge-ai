/**
 * ==============================================================================
 * MediBridge AI - Dedicated Blood Test Analysis Engine
 * Extracts laboratory parameters (CBC, Glucose, Lipids, Liver, Kidney),
 * evaluates values against reference ranges, explains physiological meaning,
 * and formulates physician discussion questions.
 * ==============================================================================
 */

class BloodTestManager {
  constructor() {
    this.extractedValues = [];
    this.currentDocName = '';
  }

  /**
   * Validate medical blood test content
   */
  isBloodTestDocument(text) {
    if (!text || typeof text !== 'string') return false;
    const lower = text.toLowerCase();

    const bloodKeywords = [
      'hemoglobin', 'glucose', 'sugar', 'cholesterol', 'creatinine', 'platelet',
      'wbc', 'rbc', 'triglycerides', 'hba1c', 'egfr', 'leukocyte', 'serum',
      'blood test', 'lipid panel', 'complete blood count', 'cbc', 'metabolic panel',
      'fasting', 'bilirubin', 'alt', 'ast', 'sgot', 'sgpt'
    ];

    let hits = 0;
    for (const kw of bloodKeywords) {
      if (lower.includes(kw)) hits++;
      if (hits >= 2) return true;
    }
    return false;
  }

  /**
   * Parse blood test parameters deterministically
   */
  parseBloodParameters(text) {
    const catalog = [
      {
        id: 'fasting_glucose',
        name: 'Fasting Blood Glucose',
        regex: /(?:fasting(?:\s+blood)?\s+(?:glucose|sugar)|\bfbs\b|blood\s+glucose|\bglucose)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl|mmol\/l)?/i,
        unit: 'mg/dL',
        standardRange: '70 - 99 mg/dL',
        low: 70,
        high: 99,
        meaning: 'Circulating sugar in your bloodstream after overnight fasting. Key marker of metabolic health and insulin function.'
      },
      {
        id: 'hba1c',
        name: 'Hemoglobin A1c (HbA1c)',
        regex: /(?:glycated\s+hemoglobin|hba1c|a1c|glycohemoglobin)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(%|percent)?/i,
        unit: '%',
        standardRange: '< 5.7 %',
        low: 4.0,
        high: 5.6,
        meaning: 'Your average circulating blood sugar level over the last 2 to 3 months, measured by sugar-bonded red blood cells.'
      },
      {
        id: 'hemoglobin',
        name: 'Hemoglobin (Hb)',
        regex: /(?:hemoglobin|haemoglobin|hgb|hb)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(g\/dl|g\/l|gm%)?/i,
        unit: 'g/dL',
        standardRange: '12.0 - 15.5 g/dL',
        low: 12.0,
        high: 15.5,
        meaning: 'Vital iron-rich protein in red blood cells that carries oxygen from lungs throughout your body.'
      },
      {
        id: 'total_cholesterol',
        name: 'Total Cholesterol',
        regex: /(?:total\s+cholesterol|cholesterol\s+total|serum\s+cholesterol)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl|mmol\/l)?/i,
        unit: 'mg/dL',
        standardRange: '< 200 mg/dL',
        low: 100,
        high: 200,
        meaning: 'Total amount of circulating fats in your bloodstream, combining HDL, LDL, and VLDL components.'
      },
      {
        id: 'ldl',
        name: 'LDL Cholesterol ("Bad")',
        regex: /(?:ldl(?:\s+cholesterol)?|low\s+density\s+lipoprotein)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl|mmol\/l)?/i,
        unit: 'mg/dL',
        standardRange: '< 100 mg/dL',
        low: 50,
        high: 100,
        meaning: 'Lipoproteins that carry lipids through bloodstream. Excess levels over time can accumulate along artery walls.'
      },
      {
        id: 'hdl',
        name: 'HDL Cholesterol ("Good")',
        regex: /(?:hdl(?:\s+cholesterol)?|high\s+density\s+lipoprotein)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl|mmol\/l)?/i,
        unit: 'mg/dL',
        standardRange: '> 40 mg/dL',
        low: 40,
        high: 999,
        meaning: 'Protective lipoproteins that assist in carrying excess lipids back to the liver for metabolic clearance.'
      },
      {
        id: 'triglycerides',
        name: 'Triglycerides',
        regex: /(?:triglycerides|serum\s+triglycerides|\btg\b)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl|mmol\/l)?/i,
        unit: 'mg/dL',
        standardRange: '< 150 mg/dL',
        low: 30,
        high: 150,
        meaning: 'A type of fat circulating in the blood, stored from extra calories for energy reserves.'
      },
      {
        id: 'creatinine',
        name: 'Serum Creatinine',
        regex: /(?:serum\s+creatinine|creatinine|\bs\.?\s*creatinine)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl|umol\/l)?/i,
        unit: 'mg/dL',
        standardRange: '0.7 - 1.3 mg/dL',
        low: 0.7,
        high: 1.3,
        meaning: 'Metabolic waste filtered by kidneys. Serves as a vital indicator of healthy renal function.'
      },
      {
        id: 'egfr',
        name: 'Estimated GFR (eGFR)',
        regex: /(?:egfr|estimated\s+gfr|glomerular\s+filtration\s+rate)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(ml\/min|ml\/min\/1\.73m2)?/i,
        unit: 'mL/min',
        standardRange: '> 60 mL/min',
        low: 60,
        high: 999,
        meaning: 'Calculates the volume of blood filtered and purified by the kidneys every minute.'
      },
      {
        id: 'wbc',
        name: 'White Blood Cell Count (WBC)',
        regex: /(?:wbc(?:\s+count)?|white\s+blood\s+(?:cell\s+)?count|total\s+leukocyte\s+count|\btlc\b)\b[\s:]*([0-9]+(?:,[0-9]+)?(?:\.[0-9]+)?)\s*(\/mcL|\/uL|cells\/cumm|10\^3\/uL|\/cumm)?/i,
        unit: '/mcL',
        standardRange: '4,000 - 11,000 /mcL',
        low: 4000,
        high: 11000,
        meaning: 'Immune defense cells actively fighting bacterial infections, viruses, and inflammation.'
      },
      {
        id: 'platelets',
        name: 'Platelet Count',
        regex: /(?:platelet(?:\s+count)?|\bplt\b)\b[\s:]*([0-9]+(?:,[0-9]+)?(?:\.[0-9]+)?)\s*(\/mcL|\/uL|lakh\/cumm|10\^3\/uL|\/cumm)?/i,
        unit: '/mcL',
        standardRange: '150,000 - 450,000 /mcL',
        low: 150000,
        high: 450000,
        meaning: 'Cell fragments responsible for blood clotting and stopping bleeding from cuts.'
      }
    ];

    const results = [];
    const lines = text.split('\n');

    for (const item of catalog) {
      for (const line of lines) {
        const match = line.match(item.regex);
        if (match) {
          let numStr = match[1].replace(/,/g, '');
          let valNum = parseFloat(numStr);
          if (item.id === 'platelets' && valNum < 100) {
            valNum = valNum * 100000;
          }
          let unit = match[2] || item.unit;

          let flag = 'NORMAL';
          if (valNum > item.high) flag = 'HIGH';
          else if (valNum < item.low) flag = 'LOW';

          results.push({
            id: item.id,
            name: item.name,
            value: match[1],
            unit,
            referenceRange: item.standardRange,
            flag,
            meaning: item.meaning
          });
          break;
        }
      }
    }

    return results;
  }

  /**
   * Process blood test report
   */
  async processReport(text, documentName = 'Blood Test Report', saveToHistory = false) {
    if (!text || !text.trim()) {
      return {
        success: false,
        error: 'EMPTY_TEXT',
        message: 'Please provide or upload blood test report text.'
      };
    }

    if (!this.isBloodTestDocument(text)) {
      return {
        success: false,
        error: 'NOT_BLOOD_TEST',
        message: 'This document does not appear to contain blood test results. Please upload a laboratory report with blood test markers.'
      };
    }

    this.currentDocName = documentName;
    const auth = window.authManager || null;
    const authHeaders = auth && auth.isAuthenticated() ? auth.getAuthHeader() : {};

    // Try backend analysis first
    try {
      const res = await fetch('/api/bloodtest', {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders),
        body: JSON.stringify({
          text,
          documentName,
          saveToHistory
        })
      });

      if (res.ok) {
        const json = await res.json();
        this.extractedValues = json.extractedValues || [];
        return json;
      }
    } catch {}

    // Fallback: Deterministic extraction
    this.extractedValues = this.parseBloodParameters(text);

    return {
      success: true,
      documentName,
      extractedValues: this.extractedValues,
      summary: 'Report processed using MediBridge clinical catalog. Reference ranges vary across laboratories and biological factors.',
      provider: 'MediBridge Clinical Parameter Parser (Deterministic)'
    };
  }
}

// Global instance
window.bloodTestManager = new BloodTestManager();
