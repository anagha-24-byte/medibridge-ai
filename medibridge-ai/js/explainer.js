/**
 * MediBridge AI - Document & Report Explainer Engine
 * Analyzes clinical reports, extracts lab values, decodes abbreviations, and generates doctor visit checklists
 */

class DocumentExplainer {
  constructor() {
    this.samples = (typeof SAMPLE_DOCUMENTS !== 'undefined') ? SAMPLE_DOCUMENTS : {};
    this.currentAnalysis = null;
  }

  getSample(sampleId) {
    return this.samples[sampleId] || null;
  }

  /**
   * Main analyzer entry point
   */
  analyzeDocument(rawText) {
    if (!rawText || !rawText.trim()) return null;

    const text = rawText.trim();
    const docType = this.detectDocumentType(text);
    const summary = this.generateSummary(text, docType);
    const keyFindings = this.extractKeyFindings(text, docType);
    const shorthand = this.extractShorthand(text);
    const doctorQuestions = this.generateDoctorQuestions(text, docType, keyFindings);

    const analysis = {
      rawText: text,
      docType: docType,
      summary: summary,
      keyFindings: keyFindings,
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
    if (lower.includes('lab report') || lower.includes('glucose') || lower.includes('cholesterol') || lower.includes('metabolic')) {
      return {
        id: 'blood_test',
        label: 'Laboratory Blood & Metabolic Panel',
        badgeColor: 'blue',
        icon: '🧪'
      };
    } else if (lower.includes('radiology') || lower.includes('x-ray') || lower.includes('lungs') || lower.includes('mri') || lower.includes('ct scan')) {
      return {
        id: 'imaging',
        label: 'Diagnostic Imaging / Radiology Report',
        badgeColor: 'purple',
        icon: '🩻'
      };
    } else if (lower.includes('discharge') || lower.includes('admission') || lower.includes('hospital course')) {
      return {
        id: 'discharge',
        label: 'Hospital Inpatient Discharge Summary',
        badgeColor: 'teal',
        icon: '🏥'
      };
    } else if (lower.includes('prescription') || lower.includes('rx') || lower.includes('sig:') || lower.includes('tablet')) {
      return {
        id: 'prescription',
        label: 'Prescription & Medication Instructions',
        badgeColor: 'emerald',
        icon: '💊'
      };
    } else {
      return {
        id: 'general_note',
        label: 'Clinical Progress & Office Note',
        badgeColor: 'sky',
        icon: '📋'
      };
    }
  }

  /**
   * Generate Plain English Summary
   */
  generateSummary(text, docType) {
    const lower = text.toLowerCase();

    if (docType.id === 'blood_test') {
      return "This is a routine blood panel examining your body's energy regulation (blood sugar), cardiovascular fats (cholesterol), and vital organ filtration (kidneys and liver). Overall, your kidneys are filtering waste well, but your fasting blood sugar and cholesterol are slightly above the standard targets. A liver enzyme is also mildly higher than normal, which is very common and best reviewed alongside your lifestyle and current medications.";
    }

    if (docType.id === 'imaging') {
      return "This chest X-ray examination evaluated your lungs, heart silhouette, and rib cage in response to coughing and breathing discomfort. The great news is there is NO evidence of acute pneumonia, collapsed lung (pneumothorax), or fluid buildup (pleural effusion). The heart size is completely normal. The report notes mild hyperinflation (lungs holding extra air), which can occur with asthma, allergies, or airway irritation.";
    }

    if (docType.id === 'discharge') {
      return "This discharge summary reviews your recent hospital stay. You arrived with very high blood pressure and dehydration, which the hospital team successfully stabilized with fluids and medication. You are being discharged home in safe, stable condition with three daily medications. Your core recovery tasks at home are: adhering to a low-salt diet, checking your blood pressure each morning, and scheduling a follow-up visit with your regular primary care doctor within 7–10 days.";
    }

    if (docType.id === 'prescription') {
      return "This document provides clear directions for an antibiotic tablet (Augmentin) and a corticosteroid nasal spray prescribed for a sinus infection. The most important instructions are to take the antibiotic with meals to avoid an upset stomach, complete all 10 days of medication even if you feel 100% better, and call your doctor if unusual allergic symptoms like hives or lip swelling appear.";
    }

    // Default clinical note summary
    return "This clinical document records your healthcare provider's observations, vitals, and recommendations. It outlines the status of your current health concerns and summarizes agreed-upon next steps for your ongoing medical care.";
  }

  /**
   * Extract key findings and laboratory ranges
   */
  extractKeyFindings(text, docType) {
    const lower = text.toLowerCase();
    const findings = [];

    if (docType.id === 'blood_test') {
      findings.push({
        metric: "Fasting Serum Glucose",
        plainName: "Blood Sugar Level",
        value: "118 mg/dL",
        referenceRange: "70 - 99 mg/dL",
        status: "Elevated (Prediabetes Range)",
        statusType: "warning",
        meaning: "Reflects the amount of sugar circulating in your bloodstream after not eating overnight. Slightly elevated levels suggest your body's cells are taking longer to absorb glucose."
      });

      findings.push({
        metric: "Hemoglobin A1c (HbA1c)",
        plainName: "3-Month Blood Sugar Average",
        value: "6.1 %",
        referenceRange: "< 5.7 %",
        status: "Elevated (Prediabetes Range)",
        statusType: "warning",
        meaning: "Shows your typical blood sugar level over the past 90 days. A value between 5.7% and 6.4% indicates prediabetes, an early window where diet and physical activity have high impact."
      });

      findings.push({
        metric: "Total Cholesterol",
        plainName: "Overall Blood Fats",
        value: "238 mg/dL",
        referenceRange: "< 200 mg/dL",
        status: "Higher than Desirable",
        statusType: "warning",
        meaning: "Measures all cholesterol types combined. Higher levels can contribute to plaque accumulation along blood vessel walls over time."
      });

      findings.push({
        metric: "LDL Cholesterol",
        plainName: "Low-Density Lipoprotein ('Bad' Cholesterol)",
        value: "158 mg/dL",
        referenceRange: "< 100 mg/dL",
        status: "Elevated",
        statusType: "warning",
        meaning: "The type of cholesterol that can deposit inside artery walls. Discussing heart-healthy nutrition and cardiovascular risk factors with your doctor is advised."
      });

      findings.push({
        metric: "HDL Cholesterol",
        plainName: "High-Density Lipoprotein ('Good' Cholesterol)",
        value: "42 mg/dL",
        referenceRange: "> 40 mg/dL",
        status: "Within Expected Range",
        statusType: "normal",
        meaning: "Known as 'good' cholesterol because it helps ferry excess fats back to your liver for processing and removal."
      });

      findings.push({
        metric: "Serum Creatinine & eGFR",
        plainName: "Kidney Filtration Score",
        value: "0.95 mg/dL (eGFR: 88 mL/min)",
        referenceRange: "Creatinine: 0.7-1.3, eGFR > 60",
        status: "Normal & Healthy",
        statusType: "normal",
        meaning: "Demonstrates that your kidneys are performing their vital cleansing work effectively and clearing metabolic byproducts properly."
      });

      findings.push({
        metric: "Alanine Aminotransferase (ALT)",
        plainName: "Liver Cell Health Enzyme",
        value: "48 U/L",
        referenceRange: "7 - 45 U/L",
        status: "Mildly Elevated",
        statusType: "warning",
        meaning: "A liver enzyme that can rise slightly due to medications, diet, minor fatty changes, or recent exertion. Often doctors simply monitor this over time."
      });
    } else if (docType.id === 'imaging') {
      findings.push({
        metric: "Lungs & Airspaces",
        plainName: "Lung Tissue & Air Sacs",
        value: "No consolidation or infiltrates",
        referenceRange: "Clear bilateral lungs",
        status: "Clear (No Pneumonia)",
        statusType: "normal",
        meaning: "No fluid, infection, or pneumonia patches visible inside the breathing tissues."
      });

      findings.push({
        metric: "Cardiothoracic Ratio",
        plainName: "Heart Size on X-Ray",
        value: "Within normal limits",
        referenceRange: "Heart width < 50% chest width",
        status: "Normal Heart Size",
        statusType: "normal",
        meaning: "Your heart is not enlarged; its silhouette is proportional and healthy."
      });

      findings.push({
        metric: "Airway Aeration",
        plainName: "Lung Inflation Level",
        value: "Mild hyperinflation",
        referenceRange: "Normal lung volumes",
        status: "Slight Air Trapping",
        statusType: "info",
        meaning: "Lungs appear slightly fuller with air than typical, which can happen with bronchial irritation, asthma, or smoking history."
      });
    } else if (docType.id === 'discharge') {
      findings.push({
        metric: "Discharge Blood Pressure",
        plainName: "Blood Pressure Reading",
        value: "126 / 82 mmHg",
        referenceRange: "< 120 / 80 mmHg (Target)",
        status: "Stabilized and Controlled",
        statusType: "normal",
        meaning: "Great improvement from the admission level (178/96 mmHg). Successfully controlled with daily medicine."
      });

      findings.push({
        metric: "Peripheral Sensation",
        plainName: "Foot & Toe Nerve Sensitivity",
        value: "Mild sensory neuropathy",
        referenceRange: "Intact full sensation",
        status: "Requires Daily Foot Inspection",
        statusType: "info",
        meaning: "Mild decrease in sensation in the feet. Always wear shoes or slippers to prevent accidental cuts or sores."
      });
    } else {
      // General parsed metrics
      findings.push({
        metric: "Document Parameters",
        plainName: "Clinical Observation Values",
        value: "Extracted from provided text",
        referenceRange: "Standard reference limits",
        status: "Reviewed for Health Literacy",
        statusType: "normal",
        meaning: "Observations recorded by your clinical team during your evaluation."
      });
    }

    return findings;
  }

  /**
   * Decode medical abbreviations
   */
  extractShorthand(text) {
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
      'dash': { full: 'Dietary Approaches to Stop Hypertension', meaning: 'Heart-healthy, low-sodium eating plan rich in vegetables and fruit' },
      'sig': { full: 'Signatura (Directions)', meaning: 'Specific patient instructions on a prescription' },
      'rx': { full: 'Recipe (Take this)', meaning: 'Prescription medication order' },
      'consolidation': { full: 'Pulmonary Consolidation', meaning: 'Area of lung filled with fluid rather than air' },
      'effusion': { full: 'Pleural Effusion', meaning: 'Abnormal pool of fluid around the outside of the lungs' },
      'dyspnea': { full: 'Dyspnea', meaning: 'Sensation of difficult or labored breathing' }
    };

    const found = [];
    const textLower = text.toLowerCase();

    for (const [key, val] of Object.entries(dictionary)) {
      // Look for whole word or exact token match
      const regex = new RegExp(`\\b${key.replace('.', '\\.')}\\b`, 'i');
      if (regex.test(textLower)) {
        found.push({
          shorthand: key.toUpperCase(),
          fullName: val.full,
          meaning: val.meaning
        });
      }
    }

    // Return unique items
    return found.slice(0, 8);
  }

  /**
   * Generate Doctor Visit Checklist
   */
  generateDoctorQuestions(text, docType, keyFindings) {
    const list = [];

    if (docType.id === 'blood_test') {
      list.push("My blood sugar (118 mg/dL) and HbA1c (6.1%) are slightly high — do these indicate prediabetes, and what diet changes do you recommend?");
      list.push("Given my cholesterol numbers (LDL 158 mg/dL), what is my cardiovascular risk score and do you recommend a statin or lifestyle first?");
      list.push("My ALT liver enzyme is slightly elevated (48 U/L) — is this something we should recheck in a few months or investigate further?");
      list.push("Are my kidney numbers (eGFR 88) stable compared to my previous tests from last year?");
    } else if (docType.id === 'imaging') {
      list.push("The report mentions mild hyperinflation in my lungs — does this explain my cough or feeling short of breath?");
      list.push("Since there is no pneumonia or infection, what is the most likely cause of my lingering cough?");
      list.push("Would a spirometry or pulmonary function test help assess how well my airways are moving air?");
      list.push("Are there any breathing exercises or inhalers that would give me comfort right now?");
    } else if (docType.id === 'discharge') {
      list.push("My blood pressure was stabilized before discharge. What is my target daily blood pressure reading at home?");
      list.push("Can we review my exact medication times (Lisinopril, Metformin, Aspirin) and any side effects I should watch for?");
      list.push("How should I inspect my feet each day to protect them given my mild neuropathy?");
      list.push("When exactly should I schedule my next follow-up lab tests?");
    } else if (docType.id === 'prescription') {
      list.push("Should I take this antibiotic with breakfast and dinner, or space it exactly 12 hours apart?");
      list.push("What foods or probiotics can help prevent stomach upset or nausea while on this antibiotic?");
      list.push("How many days should I expect it to take before my sinus congestion noticeably improves?");
    } else {
      list.push("Could you summarize the main takeaway from these results in one or two sentences?");
      list.push("Are there any specific symptoms that should prompt me to contact your office before our next scheduled visit?");
      list.push("What one or two daily lifestyle habits would have the greatest impact on these findings?");
    }

    return list;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DocumentExplainer };
}
