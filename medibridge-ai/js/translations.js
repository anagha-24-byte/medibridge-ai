/**
 * MediBridge AI - Multi-Language Dictionary & Translation Engine
 * Supports 12 global & regional languages with RTL support for Arabic
 */

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', native: '简体中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇧🇷', dir: 'ltr' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'tl', name: 'Tagalog', native: 'Tagalog', flag: '🇵🇭', dir: 'ltr' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳', dir: 'ltr' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', dir: 'ltr' }
];

const UI_TRANSLATIONS = {
  en: {
    appTitle: "MediBridge AI",
    appTagline: "Bridging complex medicine and everyday language",
    navHome: "Home",
    navSimplifier: "Medical Simplifier",
    navExplainer: "Document Explainer",
    navLanguage: "Language Hub",
    navAssistant: "Health Assistant",
    navSafety: "Safety & Privacy",
    
    // Safety Banner
    safetyBannerTitle: "Medical Safety & Privacy Guardrail",
    safetyBannerText: "MediBridge AI is strictly an educational accessibility tool. We NEVER diagnose illnesses or prescribe medications. In any medical emergency, dial your local emergency number (911 / 112 / 108) immediately.",
    safetyBannerDismiss: "I Understand",
    
    // Hero
    heroBadge: "Healthcare Equity & Health Literacy Assistant",
    heroTitle: "Understand Your Health in Plain, Compassionate Words",
    heroSubtitle: "Transform complex clinical jargon, confusing lab results, and hospital discharge instructions into easy-to-understand explanations in your own language — without replacing your doctor.",
    heroCtaSimplifier: "Simplify Medical Terms",
    heroCtaExplainer: "Explain a Medical Document",
    heroCtaAssistant: "Talk with Health Assistant",
    
    // Stat badges
    stat1Number: "9 in 10",
    stat1Label: "Adults struggle to understand clinical medical paperwork",
    stat2Number: "12+",
    stat2Label: "Languages supported for multi-generational families",
    stat3Number: "100%",
    stat3Label: "Client-side privacy — your health text stays on your device",
    stat4Number: "0",
    stat4Label: "Prescriptions or diagnoses — strictly educational safety",
    
    // Core features
    featuresHeading: "How MediBridge AI Empowers You",
    featuresSubheading: "Designed with safety, simplicity, and cultural accessibility at the center",
    feat1Title: "Medical Jargon Buster",
    feat1Desc: "Instantly translate intimidating clinical terms into 5th-grade plain language with everyday real-world analogies.",
    feat2Title: "Lab & Document Explainer",
    feat2Desc: "Upload or paste blood tests, discharge summaries, or radiology reports to get clear breakdowns and doctor question lists.",
    feat3Title: "12-Language Multilingual Hub",
    feat3Desc: "Translate any simplified explanation into your native language with side-by-side bilingual view for family visits.",
    feat4Title: "Safe Conversational Assistant",
    feat4Desc: "Ask health literacy questions safely. Strict refusal guardrails prevent unauthorized diagnosis or medication advice.",
    
    // Emergency Box
    emergencyTitle: "When to Seek Emergency Care Immediately",
    emergencyDesc: "Never use this or any AI tool if you are experiencing severe or life-threatening symptoms:",
    emergencyList: [
      "Crushing chest pain, pressure, or tightness spreading to arm or jaw",
      "Sudden severe shortness of breath or difficulty breathing",
      "Sudden weakness, facial drooping, or slurred speech (Signs of Stroke)",
      "Uncontrolled heavy bleeding or sudden loss of consciousness"
    ],
    emergencyCallBtn: "Call Emergency Services (112 / 911 / 108)",
    
    // Simplifier
    simplifierTitle: "Medical Information Simplifier",
    simplifierSubtitle: "Type a medical phrase or click a quick term below to convert clinical jargon into plain words.",
    quickTermsLabel: "Quick-select frequent medical terms:",
    inputPlaceholder: "Type or paste a medical term or statement here (e.g. 'Patient has asymptomatic essential hypertension with postprandial hyperglycemia')...",
    simplifyBtn: "Simplify in Plain English",
    readingLevelLabel: "Reading Level:",
    levelEasy: "Simple Everyday Words (Like I'm 10)",
    levelStandard: "Standard Patient Guide (Clear & Balanced)",
    levelDetailed: "Comprehensive Educational Reference",
    resultWhatItMeans: "What This Means in Plain Words",
    resultAnalogy: "Everyday Real-World Analogy",
    resultWhyChecked: "Why Doctors Check or Care About This",
    resultDoctorQuestions: "Questions to Ask Your Doctor",
    listenBtn: "Listen Aloud",
    copyBtn: "Copy Text",
    copiedMsg: "Copied to clipboard!",
    
    // Document Explainer
    explainerTitle: "Document & Report Explainer",
    explainerSubtitle: "Load a realistic clinical sample or paste your own lab test, radiology report, or discharge instructions.",
    sampleSelectorLabel: "Explore realistic sample documents:",
    loadSampleBtn: "Load Sample",
    uploadLabel: "Or drop / select a medical document file (.txt, .pdf, image preview):",
    uploadPlaceholder: "Paste your clinical report or discharge text here...",
    analyzeBtn: "Analyze & Explain Document",
    docSummaryTitle: "Executive Plain-Language Summary",
    keyFindingsTitle: "Key Test Findings & Reference Ranges",
    shorthandTitle: "Medical Shorthand & Abbreviations Decoded",
    questionsTitle: "Your Doctor Visit Discussion Checklist",
    exportPrintBtn: "Print / Export Summary",
    
    // Language Hub
    langHubTitle: "Language Selection & Bilingual View",
    langHubSubtitle: "Choose your preferred language. MediBridge adapts both the interface and the medical explanations.",
    selectLangPrompt: "Select your preferred primary language:",
    dualViewToggle: "Enable Bilingual Side-by-Side View (English + Your Language)",
    dualViewDesc: "Perfect for taking to doctors' appointments so you and English-speaking clinicians can read together.",
    
    // Assistant
    assistantTitle: "Educational Health Assistant",
    assistantSubtitle: "Ask health education questions, understand procedures, and prepare for doctor visits with built-in safety guardrails.",
    assistantDisclaimer: "Strict Guardrail: This assistant cannot diagnose diseases, predict medical outcomes, or prescribe medications.",
    samplePromptsLabel: "Try asking:",
    chatPlaceholder: "Ask a health literacy question (e.g., 'What does fasting glucose mean?')...",
    sendBtn: "Send",
    clearChatBtn: "Clear Chat",
    
    // Safety & Privacy Modal / Section
    safetyModalTitle: "Our Medical Safety & Privacy Pledge",
    safetyPillar1Title: "1. No Diagnosis & No Prescriptions",
    safetyPillar1Desc: "MediBridge AI is designed solely for health literacy. It empowers patients with clear communication tools for discussions with licensed physicians. It cannot replace clinical judgment.",
    safetyPillar2Title: "2. Zero-Retention Client Privacy",
    safetyPillar2Desc: "All document text and medical prompts run locally in your web browser. We do not store, profile, or sell your protected personal health information.",
    safetyPillar3Title: "3. Red-Flag Emergency Protocols",
    safetyPillar3Desc: "Our systems actively detect words related to cardiac, respiratory, or neurologic emergencies to direct users to emergency services without delay.",
    footerCopyright: "© 2026 MediBridge AI • Hackathon Prototype for Accessible Healthcare. Built for informational empowerment."
  },

  es: {
    appTitle: "MediBridge AI",
    appTagline: "Uniendo la medicina compleja con el lenguaje cotidiano",
    navHome: "Inicio",
    navSimplifier: "Simplificador Médico",
    navExplainer: "Explicador de Documentos",
    navLanguage: "Centro de Idiomas",
    navAssistant: "Asistente de Salud",
    navSafety: "Seguridad y Privacidad",
    safetyBannerTitle: "Seguridad Médica y Privacidad",
    safetyBannerText: "MediBridge AI es estrictamente una herramienta de accesibilidad educativa. NUNCA diagnosticamos enfermedades ni recetamos medicamentos. En caso de emergencia médica, llame a su número local de emergencias (911 / 112) de inmediato.",
    safetyBannerDismiss: "Entendido",
    heroBadge: "Asistente de Equidad y Alfabetización en Salud",
    heroTitle: "Comprenda su Salud en Palabras Claras y Compasivas",
    heroSubtitle: "Transforme la jerga clínica, resultados de laboratorio confusos e instrucciones de alta hospitalaria en explicaciones sencillas en su propio idioma — sin reemplazar a su médico.",
    heroCtaSimplifier: "Simplificar Términos Médicos",
    heroCtaExplainer: "Explicar un Documento Médico",
    heroCtaAssistant: "Hablar con el Asistente",
    stat1Number: "9 de cada 10",
    stat1Label: "Adultos tienen dificultades para entender los documentos clínicos",
    stat2Number: "12+",
    stat2Label: "Idiomas admitidos para familias multigeneracionales",
    stat3Number: "100%",
    stat3Label: "Privacidad en el navegador: su información médica no sale de su dispositivo",
    stat4Number: "0",
    stat4Label: "Recetas o diagnósticos — seguridad estrictamente educativa",
    featuresHeading: "Cómo le Ayuda MediBridge AI",
    featuresSubheading: "Diseñado con seguridad, simplicidad y accesibilidad cultural",
    feat1Title: "Traductor de Jerga Médica",
    feat1Desc: "Traduce al instante términos clínicos intimidantes a lenguaje sencillo con analogías de la vida real.",
    feat2Title: "Explicador de Laboratorio y Documentos",
    feat2Desc: "Cargue análisis de sangre o informes para obtener resúmenes claros y preguntas para su médico.",
    feat3Title: "Centro Multilingüe de 12 Idiomas",
    feat3Desc: "Traduzca cualquier explicación a su idioma materno con vista bilingüe para visitas médicas.",
    feat4Title: "Asistente Seguro de Salud",
    feat4Desc: "Haga preguntas con total tranquilidad gracias a filtros que rechazan diagnósticos o recetas.",
    emergencyTitle: "Cuándo Buscar Atención de Emergencia Inmediata",
    emergencyDesc: "Nunca utilice esta ni ninguna herramienta de IA si experimenta síntomas graves:",
    emergencyList: [
      "Dolor opresivo en el pecho o presión que se extiende al brazo o mandíbula",
      "Dificultad severa y repentina para respirar",
      "Debilidad repentina, caída facial o dificultad para hablar (Señales de ACV)",
      "Hemorragia abundante o pérdida repentina del conocimiento"
    ],
    emergencyCallBtn: "Llamar a Emergencias (911 / 112)",
    simplifierTitle: "Simplificador de Información Médica",
    simplifierSubtitle: "Escriba una frase médica o seleccione un término para convertirlo en palabras claras.",
    quickTermsLabel: "Términos médicos frecuentes:",
    inputPlaceholder: "Escriba o pegue un término o frase médica...",
    simplifyBtn: "Simplificar en Lenguaje Sencillo",
    readingLevelLabel: "Nivel de Lectura:",
    levelEasy: "Palabras Muy Simples (Para 10 años)",
    levelStandard: "Guía Estándar para Pacientes",
    levelDetailed: "Referencia Educativa Detallada",
    resultWhatItMeans: "Qué Significa en Palabras Simples",
    resultAnalogy: "Analogía de la Vida Cotidiana",
    resultWhyChecked: "Por Qué los Médicos lo Evalúan",
    resultDoctorQuestions: "Preguntas para su Médico",
    listenBtn: "Escuchar en Voz Alta",
    copyBtn: "Copiar Texto",
    copiedMsg: "¡Copiado al portapapeles!",
    explainerTitle: "Explicador de Documentos e Informes",
    explainerSubtitle: "Cargue un ejemplo clínico o pegue su propio análisis de sangre o informe.",
    sampleSelectorLabel: "Documentos de ejemplo realistas:",
    loadSampleBtn: "Cargar Ejemplo",
    uploadLabel: "O arrastre un archivo (.txt, .pdf, vista previa de imagen):",
    uploadPlaceholder: "Pegue aquí el texto de su informe o alta...",
    analyzeBtn: "Analizar y Explicar Documento",
    docSummaryTitle: "Resumen Ejecutivo en Lenguaje Sencillo",
    keyFindingsTitle: "Resultados Clave y Rangos de Referencia",
    shorthandTitle: "Abreviaturas Médicas Descifradas",
    questionsTitle: "Lista de Preguntas para la Visita Médica",
    exportPrintBtn: "Imprimir / Exportar Resumen",
    langHubTitle: "Selección de Idioma y Vista Bilingüe",
    langHubSubtitle: "Elija su idioma preferido. MediBridge adapta la interfaz y las explicaciones.",
    selectLangPrompt: "Seleccione su idioma principal:",
    dualViewToggle: "Activar Vista Bilingüe Lado a Lado (Inglés + Su Idioma)",
    dualViewDesc: "Ideal para llevar a la consulta médica para que usted y su doctor puedan leer juntos.",
    assistantTitle: "Asistente Educativo de Salud",
    assistantSubtitle: "Haga preguntas educativas y prepárese para consultas médicas con filtros de seguridad.",
    assistantDisclaimer: "Filtro de Seguridad: Este asistente no diagnostica ni receta medicamentos.",
    samplePromptsLabel: "Pruebe preguntar:",
    chatPlaceholder: "¿Qué significa la glucosa en ayunas?",
    sendBtn: "Enviar",
    clearChatBtn: "Borrar Chat",
    safetyModalTitle: "Nuestro Compromiso de Seguridad y Privacidad",
    safetyPillar1Title: "1. Cero Diagnósticos y Cero Recetas",
    safetyPillar1Desc: "MediBridge AI está diseñada para la comprensión y comunicación paciente-médico. No reemplaza a un profesional médico.",
    safetyPillar2Title: "2. Privacidad Total en el Navegador",
    safetyPillar2Desc: "Sus documentos se procesan en su propio navegador. No almacenamos ni vendemos su información médica.",
    safetyPillar3Title: "3. Protocolos de Emergencia",
    safetyPillar3Desc: "Detectamos señales de alerta médica y dirigimos a servicios de urgencia sin demora.",
    footerCopyright: "© 2026 MediBridge AI • Prototipo de Hackathon para la Accesibilidad en Salud."
  },

  hi: {
    appTitle: "मेडिब्रिज एआई (MediBridge AI)",
    appTagline: "जटिल चिकित्सा को सरल भाषा से जोड़ना",
    navHome: "होम",
    navSimplifier: "मेडिकल भाषा सरलकर्ता",
    navExplainer: "दस्तावेज़ विश्लेषक",
    navLanguage: "भाषा चयन",
    navAssistant: "स्वास्थ्य सहायक",
    navSafety: "सुरक्षा एवं गोपनीयता",
    safetyBannerTitle: "चिकित्सा सुरक्षा एवं गोपनीयता निर्देश",
    safetyBannerText: "मेडिब्रिज एआई केवल एक शैक्षिक सहायता उपकरण है। हम कभी भी किसी बीमारी का निदान (डायग्नोसिस) या दवाइयाँ (प्रिस्क्रिप्शन) नहीं लिखते। किसी भी आपात स्थिति में तुरंत 112 / 108 डायल करें।",
    safetyBannerDismiss: "मैं समझता/समझती हूँ",
    heroBadge: "स्वास्थ्य साक्षरता एवं समानता सहायक",
    heroTitle: "अपने स्वास्थ्य को सरल और समझ में आने वाले शब्दों में समझें",
    heroSubtitle: "कठिन मेडिकल शब्दों, लैब टेस्ट रिपोर्टों और डिस्चार्ज नोट्स को अपनी मातृभाषा में समझें — बिना किसी डॉक्टर का स्थान लिए।",
    heroCtaSimplifier: "मेडिकल शब्द सरल करें",
    heroCtaExplainer: "रिपोर्ट व पर्चा समझें",
    heroCtaAssistant: "स्वास्थ्य सहायक से बात करें",
    stat1Number: "10 में से 9",
    stat1Label: "वयस्कों को मेडिकल रिपोर्ट्स समझने में कठिनाई होती है",
    stat2Number: "12+",
    stat2Label: "भारतीय व वैश्विक भाषाओं का पूर्ण समर्थन",
    stat3Number: "100%",
    stat3Label: "ब्राउज़र गोपनीयता — आपकी रिपोर्ट आपके फ़ोन/कंप्यूटर में ही रहती है",
    stat4Number: "0",
    stat4Label: "दवा या डायग्नोसिस — केवल सुरक्षित शैक्षिक जानकारी",
    featuresHeading: "मेडिब्रिज एआई आपकी मदद कैसे करता है?",
    featuresSubheading: "सुरक्षा, सरलता और भाषा की सुगमता को ध्यान में रखकर निर्मित",
    feat1Title: "कठिन शब्दों का सरल अनुवाद",
    feat1Desc: "हाइपरटेंशन, एंजियोप्लास्टी जैसे कठिन शब्दों को रोज़मर्रा के उदाहरणों के साथ सरल बनाएं।",
    feat2Title: "लैब रिपोर्ट और पर्चा समझें",
    feat2Desc: "खून की जांच या एक्स-रे रिपोर्ट लोड करें और डॉक्टर से पूछने योग्य सवालों की सूची पाएं।",
    feat3Title: "12 भाषाओं में अनुवाद",
    feat3Desc: "किसी भी रिपोर्ट की व्याख्या अपनी भाषा में देखें और डॉक्टर को दिखाने के लिए द्विभाषी दृश्य का उपयोग करें।",
    feat4Title: "सुरक्षित बातचीत सहायक",
    feat4Desc: "स्वास्थ्य संबंधी सवाल पूछें। यह सहायक बीमारी की गलत सलाह या दवाइयों से सुरक्षित रखता है।",
    emergencyTitle: "तुरंत आपातकालीन चिकित्सा कब लें?",
    emergencyDesc: "गंभीर लक्षणों के समय कभी भी किसी एआई का इंतज़ार न करें:",
    emergencyList: [
      "सीने में तेज़ दर्द, दबाव या भारीपन जो हाथ या जबड़े तक फैले",
      "अचानक सांस लेने में बहुत कठिनाई होना",
      "चेहरे का टेढ़ा होना, आवाज़ लड़खड़ाना या हाथ-पैर सुन्न होना (स्ट्रोक के लक्षण)",
      "अत्यधिक रक्तस्राव या अचानक बेहोशी"
    ],
    emergencyCallBtn: "आपातकालीन नंबर पर कॉल करें (112 / 108)",
    simplifierTitle: "मेडिकल जानकारी सरलकर्ता",
    simplifierSubtitle: "कोई भी मेडिकल शब्द टाइप करें या नीचे दिए गए विकल्पों में से चुनें।",
    quickTermsLabel: "अक्सर पूछे जाने वाले शब्द:",
    inputPlaceholder: "यहाँ कोई मेडिकल शब्द या वाक्य लिखें (जैसे 'Hypertension', 'HbA1c')...",
    simplifyBtn: "सरल भाषा में समझाइए",
    readingLevelLabel: "पठन स्तर:",
    levelEasy: "बहुत सरल शब्द (10 वर्ष के बच्चे की तरह)",
    levelStandard: "सामान्य मरीज़ मार्गदर्शिका",
    levelDetailed: "विस्तृत शैक्षिक जानकारी",
    resultWhatItMeans: "सरल शब्दों में इसका क्या अर्थ है?",
    resultAnalogy: "रोज़मर्रा की ज़िंदगी का उदाहरण",
    resultWhyChecked: "डॉक्टर यह जांच क्यों करवाते हैं?",
    resultDoctorQuestions: "डॉक्टर से पूछने योग्य सवाल",
    listenBtn: "बोलकर सुनाएं",
    copyBtn: "कॉपी करें",
    copiedMsg: "कॉपी हो गया!",
    explainerTitle: "मेडिकल दस्तावेज़ और रिपोर्ट विश्लेषक",
    explainerSubtitle: "नमूना रिपोर्ट चुनें या अपनी लैब रिपोर्ट पेस्ट करें।",
    sampleSelectorLabel: "नमूना दस्तावेज़ चुनें:",
    loadSampleBtn: "नमूना लोड करें",
    uploadLabel: "या रिपोर्ट फ़ाइल चुनें (.txt, .pdf):",
    uploadPlaceholder: "अपनी मेडिकल रिपोर्ट का विवरण यहाँ पेस्ट करें...",
    analyzeBtn: "दस्तावेज़ का विश्लेषण करें",
    docSummaryTitle: "मुख्य सारांश (सरल शब्दों में)",
    keyFindingsTitle: "प्रमुख जांच परिणाम व सामान्य सीमाएँ",
    shorthandTitle: "मेडिकल शॉर्टकट और संक्षिप्त शब्द",
    questionsTitle: "डॉक्टर के पास ले जाने योग्य प्रश्नों की सूची",
    exportPrintBtn: "प्रिंट करें / सारांश सहेजें",
    langHubTitle: "भाषा चयन और द्विभाषी दृश्य",
    langHubSubtitle: "अपनी पसंदीदा भाषा चुनें। ऐप और व्याख्याएँ तुरंत बदल जाएँगी।",
    selectLangPrompt: "अपनी प्राथमिक भाषा चुनें:",
    dualViewToggle: "द्विभाषी दृश्य (अंग्रेजी + आपकी भाषा)",
    dualViewDesc: "डॉक्टर की मुलाक़ात के लिए उपयोगी ताकि आप और डॉक्टर दोनों समझ सकें।",
    assistantTitle: "शैक्षिक स्वास्थ्य सहायक",
    assistantSubtitle: "स्वास्थ्य साक्षरता संबंधी प्रश्न पूछें।",
    assistantDisclaimer: "सुरक्षा निर्देश: यह सहायक कोई बीमारी नहीं बताता और न ही दवा लिखता है।",
    samplePromptsLabel: "ये प्रश्न पूछ कर देखें:",
    chatPlaceholder: "स्वास्थ्य संबंधी कोई प्रश्न पूछें (उदा. 'फास्टिंग शुगर क्या है?')...",
    sendBtn: "पूछें",
    clearChatBtn: "चैट साफ़ करें",
    safetyModalTitle: "हमारा सुरक्षा एवं गोपनीयता संकल्प",
    safetyPillar1Title: "1. कोई बीमारी की पहचान या दवा नहीं",
    safetyPillar1Desc: "मेडिब्रिज एआई केवल मरीज़ और डॉक्टर के बीच संवाद को आसान बनाने के लिए है।",
    safetyPillar2Title: "2. पूर्ण डिवाइस गोपनीयता",
    safetyPillar2Desc: "आपकी कोई भी मेडिकल फ़ाइल हमारे सर्वर पर सेव नहीं होती।",
    safetyPillar3Title: "3. आपातकालीन सुरक्षा प्रोटोकॉल",
    safetyPillar3Desc: "गंभीर लक्षणों पर यह तुरंत एम्बुलेंस या आपातकालीन सहायता की सलाह देता है।",
    footerCopyright: "© 2026 MediBridge AI • स्वास्थ्य सुगमता हैकाथॉन प्रोटोटाइप।"
  },

  fr: {
    appTitle: "MediBridge AI",
    appTagline: "Rapprocher la médecine complexe du langage quotidien",
    navHome: "Accueil",
    navSimplifier: "Vulgarisateur Médical",
    navExplainer: "Analyseur de Documents",
    navLanguage: "Centre de Langues",
    navAssistant: "Assistant Santé",
    navSafety: "Sécurité & Confidentialité",
    safetyBannerTitle: "Garantie de Sécurité Médicale & Confidentialité",
    safetyBannerText: "MediBridge AI est strictement un outil pédagogique d'accessibilité. Nous ne posons JAMAIS de diagnostic et ne prescrivons AUCUN médicament. En cas d'urgence, composez immédiatement le 15 / 112 / 911.",
    safetyBannerDismiss: "J'ai compris",
    heroBadge: "Assistant d'Équité et de Littératie en Santé",
    heroTitle: "Comprenez Votre Santé en Termes Simples et Bienveillants",
    heroSubtitle: "Transformez le jargon clinique complexe, les résultats d'analyses et les comptes-rendus d'hospitalisation en explications claires dans votre langue — sans remplacer votre médecin.",
    heroCtaSimplifier: "Simplifier des Termes Médicaux",
    heroCtaExplainer: "Expliquer un Document Médical",
    heroCtaAssistant: "Parler avec l'Assistant",
    stat1Number: "9 sur 10",
    stat1Label: "Adultes éprouvent des difficultés à comprendre leurs documents médicaux",
    stat2Number: "12+",
    stat2Label: "Langues prises en charge pour les familles",
    stat3Number: "100%",
    stat3Label: "Confidentialité locale dans le navigateur — vos données restent chez vous",
    stat4Number: "0",
    stat4Label: "Diagnostic ou prescription — sécurité strictement pédagogique",
    featuresHeading: "Comment MediBridge AI Vous Aide",
    featuresSubheading: "Conçu avec la sécurité, la clarté et l'accessibilité culturelle au cœur",
    feat1Title: "Déchiffreur de Jargon Médical",
    feat1Desc: "Convertissez les termes cliniques ardus en explications simples avec analogies concrètes.",
    feat2Title: "Explicateur d'Analyses et Rapports",
    feat2Desc: "Importez vos prises de sang ou radiographies pour obtenir un bilan clair et des questions pour votre médecin.",
    feat3Title: "Centre Multilingue (12 Langues)",
    feat3Desc: "Traduisez n'importe quelle explication dans votre langue avec vue bilingue côte à côte.",
    feat4Title: "Assistant Santé Sécurisé",
    feat4Desc: "Posez vos questions de santé en toute sécurité grâce à des garde-fous stricts.",
    emergencyTitle: "Quand Consulter les Urgences Immédiatement",
    emergencyDesc: "N'utilisez jamais cet outil en présence de symptômes graves ou vitaux :",
    emergencyList: [
      "Douleur thoracique compressive irradiant vers le bras ou la mâchoire",
      "Difficulté respiratoire sévère et brutale",
      "Faiblesse brutale, visage affaissé ou trouble de la parole (Signes d'AVC)",
      "Saignement abondant non contrôlé ou perte de connaissance"
    ],
    emergencyCallBtn: "Appeler les Urgences (15 / 112 / 911)",
    simplifierTitle: "Simplificateur d'Informations Médicales",
    simplifierSubtitle: "Saisissez un terme ou sélectionnez-en un pour obtenir une explication claire.",
    quickTermsLabel: "Termes médicaux courants :",
    inputPlaceholder: "Tapez ou collez un terme médical ici...",
    simplifyBtn: "Simplifier en Langage Clair",
    readingLevelLabel: "Niveau de Lecture :",
    levelEasy: "Mots Très Simples (Comme pour un enfant)",
    levelStandard: "Guide Patient Standard",
    levelDetailed: "Référence Éducative Complète",
    resultWhatItMeans: "Ce que Cela Signifie en Termes Simples",
    resultAnalogy: "Analogie de la Vie Quotidienne",
    resultWhyChecked: "Pourquoi les Médecins Contrôlent Cela",
    resultDoctorQuestions: "Questions à Poser à Votre Médecin",
    listenBtn: "Écouter à Voix Haute",
    copyBtn: "Copier le Texte",
    copiedMsg: "Copié dans le presse-papiers !",
    explainerTitle: "Explicateur de Documents et Rapports",
    explainerSubtitle: "Chargez un échantillon réaliste ou collez vos propres résultats.",
    sampleSelectorLabel: "Documents d'exemple :",
    loadSampleBtn: "Charger l'Exemple",
    uploadLabel: "Ou déposez un fichier (.txt, .pdf, aperçu) :",
    uploadPlaceholder: "Collez votre rapport médical ici...",
    analyzeBtn: "Analyser et Expliquer le Document",
    docSummaryTitle: "Résumé Exécutif en Langage Clair",
    keyFindingsTitle: "Résultats Clés et Valeurs de Référence",
    shorthandTitle: "Abréviations Médicales Décryptées",
    questionsTitle: "Liste de Questions pour Votre Prochaine Consultation",
    exportPrintBtn: "Imprimer / Exporter le Résumé",
    langHubTitle: "Sélection de Langue & Vue Bilingue",
    langHubSubtitle: "Choisissez votre langue. MediBridge adapte l'interface et les explications.",
    selectLangPrompt: "Sélectionnez votre langue principale :",
    dualViewToggle: "Activer la Vue Bilingue Côte à Côte (Anglais + Votre Langue)",
    dualViewDesc: "Idéal pour les rendez-vous chez le médecin afin de lire ensemble.",
    assistantTitle: "Assistant Éducatif Santé",
    assistantSubtitle: "Posez vos questions de santé en toute sécurité.",
    assistantDisclaimer: "Garde-fou : Cet assistant ne pose aucun diagnostic et ne prescrit aucun médicament.",
    samplePromptsLabel: "Exemples de questions :",
    chatPlaceholder: "Posez une question (ex. 'Que signifie la glycémie à jeun ?')...",
    sendBtn: "Envoyer",
    clearChatBtn: "Effacer l'Historique",
    safetyModalTitle: "Notre Engagement de Sécurité et Confidentialité",
    safetyPillar1Title: "1. Zéro Diagnostic et Zéro Prescription",
    safetyPillar1Desc: "MediBridge AI améliore la communication patient-médecin mais ne remplace jamais un praticien.",
    safetyPillar2Title: "2. Confidentialité Locale Absolue",
    safetyPillar2Desc: "Vos documents ne sont jamais enregistrés sur des serveurs externes.",
    safetyPillar3Title: "3. Détection des Urgences",
    safetyPillar3Desc: "Les symptômes critiques sont immédiatement redirigés vers les services d'urgence.",
    footerCopyright: "© 2026 MediBridge AI • Prototype Hackathon pour l'Accessibilité en Santé."
  },

  zh: {
    appTitle: "MediBridge AI 智桥医疗",
    appTagline: "架起复杂医学与通俗语言之间的理解桥梁",
    navHome: "首页",
    navSimplifier: "医学术语通俗化",
    navExplainer: "医疗报告解读",
    navLanguage: "多语言中心",
    navAssistant: "健康科普助手",
    navSafety: "安全与隐私说明",
    safetyBannerTitle: "医疗安全与隐私保护守则",
    safetyBannerText: "MediBridge AI 纯属健康科普与无障碍辅助工具。本程序绝不诊断疾病，绝不开具处方药物。遇有紧急医疗状况，请立即拨打当地急救电话（120 / 911 / 112）。",
    safetyBannerDismiss: "我已了解",
    heroBadge: "健康素养与医疗普惠助手 • 黑客松原型",
    heroTitle: "用温暖通俗的日常语言，轻松读懂您的健康状况",
    heroSubtitle: "将复杂的医学术语、化验单数值和出院小结翻译为通俗易懂的语言，并支持多语言对照，帮助您更好地与主治医生交流。",
    heroCtaSimplifier: "通俗化医学术语",
    heroCtaExplainer: "解读医疗报告",
    heroCtaAssistant: "咨询健康科普助手",
    stat1Number: "9/10",
    stat1Label: "成年人在理解临床医学文书时感到困难",
    stat2Number: "12+",
    stat2Label: "支持全球主要语言与双语对照",
    stat3Number: "100%",
    stat3Label: "纯前端本地计算，健康数据不出您的设备",
    stat4Number: "0",
    stat4Label: "无诊断与处方，坚守医学安全红线",
    featuresHeading: "MediBridge AI 如何为您提供帮助",
    featuresSubheading: "以安全性、易懂性和跨语言无障碍为核心",
    feat1Title: "医学术语“通俗化破壁机”",
    feat1Desc: "将原发性高血压、心肌梗死等复杂专业词汇转化为生动的日常生活比喻。",
    feat2Title: "化验单与检查报告解读",
    feat2Desc: "解析血常规、生化、X光报告，提供指标解读与就诊提问清单。",
    feat3Title: "12 种语言及双语对照",
    feat3Desc: "支持中文与其他语言的并排对照，方便与不同语言背景的医生沟通。",
    feat4Title: "安全科普对话助手",
    feat4Desc: "严格内置诊断与处方拒绝护栏，普及医学常识，提供就医指导。",
    emergencyTitle: "何时必须立即就医？",
    emergencyDesc: "若出现以下危急症状，请切勿使用任何 AI 工具，立即呼叫急救：",
    emergencyList: [
      "剧烈胸痛、胸闷压迫感，并放射至左肩、手臂或下颌",
      "突发严重呼吸困难或窒息感",
      "突发单侧面瘫、肢体无力或言语不清（脑卒中征兆）",
      "无法控制的大出血或突发昏厥"
    ],
    emergencyCallBtn: "拨打急救电话 (120 / 911 / 112)",
    simplifierTitle: "医学术语通俗化工具",
    simplifierSubtitle: "输入医学术语或从下方常用词汇中选择，将其转化为通俗语言。",
    quickTermsLabel: "常用医学词汇：",
    inputPlaceholder: "在此输入或粘贴医学术语或诊断结论...",
    simplifyBtn: "通俗化解释",
    readingLevelLabel: "阅读难度：",
    levelEasy: "极为通俗（如同向10岁孩子解释）",
    levelStandard: "标准患者指南（平衡详实）",
    levelDetailed: "详细科普参考",
    resultWhatItMeans: "通俗大白话解读",
    resultAnalogy: "生活中的形象比喻",
    resultWhyChecked: "医生为什么关注这项检查",
    resultDoctorQuestions: "您可以向医生询问的问题",
    listenBtn: "语音朗读",
    copyBtn: "复制文本",
    copiedMsg: "已复制到剪贴板！",
    explainerTitle: "医疗文档与检验报告解读",
    explainerSubtitle: "选择预置的真实检查报告，或粘贴您自己的化验结果。",
    sampleSelectorLabel: "真实案例模板：",
    loadSampleBtn: "加载案例",
    uploadLabel: "或上传文档文件（.txt、.pdf、图片预览）：",
    uploadPlaceholder: "在此粘贴您的医学报告文本...",
    analyzeBtn: "分析并解读报告",
    docSummaryTitle: "通俗白话总结",
    keyFindingsTitle: "关键指标与参考范围",
    shorthandTitle: "医学缩写与简写破译",
    questionsTitle: "复诊随访提问清单",
    exportPrintBtn: "打印 / 导出摘要",
    langHubTitle: "语言选择与双语对照",
    langHubSubtitle: "选择您的母语。MediBridge 将同时适配界面与医疗解释。",
    selectLangPrompt: "选择主语言：",
    dualViewToggle: "开启中英文双语并排对照",
    dualViewDesc: "方便携带至医院，让患者与英语医生共同查阅。",
    assistantTitle: "健康科普智能助手",
    assistantSubtitle: "解答健康常识，协助准备就诊，内置医疗安全防护。",
    assistantDisclaimer: "安全红线：本助手不提供疾病诊断，不开具处方用药。",
    samplePromptsLabel: "试着提问：",
    chatPlaceholder: "提问健康科普问题（如：'空腹血糖偏高意味着什么？'）...",
    sendBtn: "发送",
    clearChatBtn: "清空对话",
    safetyModalTitle: "医疗安全与隐私保证声明",
    safetyPillar1Title: "1. 严禁诊断与处方",
    safetyPillar1Desc: "MediBridge AI 旨在提升医患沟通效率，绝不可代替执业医师的面对面临床诊断。",
    safetyPillar2Title: "2. 纯客户端隐私防护",
    safetyPillar2Desc: "您的医疗文本仅在您的浏览器中运行解析，不上传云端存储，不出售个人健康数据。",
    safetyPillar3Title: "3. 急症预警机制",
    safetyPillar3Desc: "检测到心脑血管等危急重症关键词时，将即刻优先提示紧急救治途径。",
    footerCopyright: "© 2026 MediBridge AI 智桥医疗 • 黑客松健康普惠原型项目。"
  },

  ar: {
    appTitle: "MediBridge AI (جسر الصحة)",
    appTagline: "تقريب المصطلحات الطبية المعقدة إلى اللغة البسيطة",
    navHome: "الرئيسية",
    navSimplifier: "مبسط المصطلحات",
    navExplainer: "مفسر التقارير الطبية",
    navLanguage: "مركز اللغات",
    navAssistant: "المساعد الصحي",
    navSafety: "السلامة والخصوصية",
    safetyBannerTitle: "تنبيه الأمان الطبي والخصوصية",
    safetyBannerText: "تطبيق MediBridge AI هو أداة تعليمية وتثقيفية بحتة. نحن لا نشخص الأمراض ولا نصف الأدوية بأي شكل. في الحالات الطارئة، اتصل فوراً برقم الطوارئ المحلي (911 / 112 / 997).",
    safetyBannerDismiss: "فهمت ذلك",
    heroBadge: "مساعد التثقيف الصحي والعدالة الطبية",
    heroTitle: "افهم حالتك الصحية بكلمات واضحة وبسيطة",
    heroSubtitle: "حوّل التقارير المخبرية المعقدة وملخصات الخروج من المستشفى إلى شرح سلس بلغتك الأم — دون استبدال دور طبيبك المعالج.",
    heroCtaSimplifier: "تبسيط المصطلحات الطبية",
    heroCtaExplainer: "تفسير تقرير طبي",
    heroCtaAssistant: "محادثة المساعد الصحي",
    stat1Number: "9 من 10",
    stat1Label: "بالغين يجدون صعوبة في فهم الأوراق والتقارير الطبية",
    stat2Number: "12+",
    stat2Label: "لغة مدعومة للعائلات متعدّدة اللغات",
    stat3Number: "100%",
    stat3Label: "خصوصية تامة داخل المتصفح — معلوماتك لا تغادر جهازك",
    stat4Number: "0",
    stat4Label: "تشخيصات أو وصفات دوائية — أمان تعليمي صارم",
    featuresHeading: "كيف يساعدك MediBridge AI",
    featuresSubheading: "مصمم مع وضع السلامة والوضوح والشمولية الثقافية في المقدمة",
    feat1Title: "مبسط المصطلحات الطبية",
    feat1Desc: "يحول المصطلحات المعقدة مثل ارتفاع ضغط الدم وتصلب الشرايين إلى لغة بسيطة مع أمثلة واقعية.",
    feat2Title: "مفسر الفحوصات والتقارير",
    feat2Desc: "حمّل تحاليل الدم أو تقارير الأشعة للحصول على ملخص واضح وقائمة أسئلة لطبيبك.",
    feat3Title: "مركز لغات متعدد (12 لغة)",
    feat3Desc: "شاهد الشرح بلغتك الأم مع إمكانية العرض الثنائي المشترك لزيارة الطبيب.",
    feat4Title: "مساعد صحي آمن",
    feat4Desc: "اطرح أسئلتك التثقيفية بثقة مع ضوابط تمنع تقديم تشخيصات أو أدوية.",
    emergencyTitle: "متى يجب طلب الطوارئ فوراً؟",
    emergencyDesc: "لا تستخدم هذا التطبيق مطلقاً إذا كنت تعاني من أعراض خطيرة تهدد الحياة:",
    emergencyList: [
      "ألم شديد أو ضغط ساحق في الصدر يمتد إلى الذراع أو الفك",
      "صعوبة حادة ومفاجئة في التنفس",
      "ضعف مفاجئ في جانب من الجسم أو تدلي الوجه أو صعوبة في النطق (علامات السكتة)",
      "نزيف حاد لا يمكن إيقافه أو فقدان مفاجئ للوعي"
    ],
    emergencyCallBtn: "الاتصال بالطوارئ (997 / 112 / 911)",
    simplifierTitle: "مبسط المعلومات الطبية",
    simplifierSubtitle: "اكتب مصطلحاً أو اختر من القائمة للحصول على شرح باللغة السهلة.",
    quickTermsLabel: "مصطلحات طبية شائعة:",
    inputPlaceholder: "اكتب أو الصق مصطلحاً أو تقريراً هنا...",
    simplifyBtn: "تبسيط بلغة واضحة",
    readingLevelLabel: "مستوى التبسيط:",
    levelEasy: "كلمات بسيطة جداً (مثل شرح لطفل)",
    levelStandard: "دليل المريض القياسي",
    levelDetailed: "مرجع تعليمي مفصل",
    resultWhatItMeans: "ماذا يعني ذلك بلغة سهلة؟",
    resultAnalogy: "تشبيه من الحياة اليومية",
    resultWhyChecked: "لماذا يفحص الأطباء هذا المؤشر؟",
    resultDoctorQuestions: "أسئلة مقترحة لطرحها على طبيبك",
    listenBtn: "استماع صوتي",
    copyBtn: "نسخ النص",
    copiedMsg: "تم النسخ إلى الحافظة!",
    explainerTitle: "مفسر الوثائق والتقارير الطبية",
    explainerSubtitle: "اختر نموذجاً واقعياً أو الصق تقريرك المخبري لتحليله.",
    sampleSelectorLabel: "نماذج تقارير حقيقية:",
    loadSampleBtn: "تحميل النموذج",
    uploadLabel: "أو اسحب ملف تقرير (.txt, .pdf):",
    uploadPlaceholder: "الصق نص التقرير الطبي هنا...",
    analyzeBtn: "تحليل وتفسير التقرير",
    docSummaryTitle: "الملخص التنفيذي باللغة البسيطة",
    keyFindingsTitle: "النتائج الرئيسية والنسب المرجعية",
    shorthandTitle: "فك رموز الاختصارات الطبية",
    questionsTitle: "قائمة أسئلة لزيارتك القادمة للطبيب",
    exportPrintBtn: "طباعة / تصدير التقرير",
    langHubTitle: "اختيار اللغة والعرض الثنائي",
    langHubSubtitle: "اختر لغتك المفضلة. يتكيف MediBridge فوراً في الواجهة والترجمة.",
    selectLangPrompt: "اختر لغتك الأساسية:",
    dualViewToggle: "تفعيل العرض الثنائي جنباً إلى جنب (الإنجليزية + لغتك)",
    dualViewDesc: "مثالي لأخذه إلى عيادة الطبيب ليقرأ الطبيب بالإنجليزية وتقرأ بلغتك.",
    assistantTitle: "المساعد الصحي التثقيفي",
    assistantSubtitle: "اسأل عن المفاهيم الطبية واستعد لمقابلة الطبيب بأمان تام.",
    assistantDisclaimer: "ضابط الأمان: لا يقدم المساعد أي تشخيص مرضي أو وصفات علاجية.",
    samplePromptsLabel: "جرب أن تسأل:",
    chatPlaceholder: "اسأل سؤالاً تثقيفياً (مثال: ماذا يعني ارتفاع السكر الصائم؟)...",
    sendBtn: "إرسال",
    clearChatBtn: "مسح المحادثة",
    safetyModalTitle: "ميثاق الأمان الطبي والخصوصية",
    safetyPillar1Title: "1. حظر تام للتشخيص والوصفات",
    safetyPillar1Desc: "صُمم MediBridge AI لرفع الوعي الصحي فقط ولا يحل محل الفحص الطبي المباشر.",
    safetyPillar2Title: "2. خصوصية محلية في المتصفح",
    safetyPillar2Desc: "تُعالج بياناتك محلياً في جهازك ولا يتم تخزينها أو بيعها.",
    safetyPillar3Title: "3. رصد الحالات الحرجة",
    safetyPillar3Desc: "يتم تحويل أي اشتباه في حالة طارئة إلى خدمات الإسعاف فوراً.",
    footerCopyright: "© 2026 MediBridge AI • نموذج هاكاثون للعدالة الصحية والتثقيف الطبي."
  }
};

/**
 * Multilingual Translation helper for dynamic outputs
 * Translates clinical simplifications and summaries into target languages
 */
const TRANSLATION_CACHE = {
  // Common terms translations cache for quick fallback
  "Hypertension": {
    es: "Presión Arterial Alta",
    hi: "उच्च रक्तचाप (हाई ब्लड प्रेशर)",
    fr: "Hypertension Artérielle (Haute Pression)",
    zh: "高血压",
    ar: "ارتفاع ضغط الدم",
    bn: "উচ্চ রক্তচাপ",
    pt: "Pressão Alta",
    de: "Bluthochdruck",
    tl: "Mataas na Presyon ng Dugo",
    vi: "Huyết áp cao",
    ta: "உயர் இரத்த அழுத்தம்"
  },
  "Myocardial Infarction": {
    es: "Ataque Cardíaco",
    hi: "दिल का दौरा (हार्ट अटैक)",
    fr: "Crise Cardiaque (Infarctus)",
    zh: "心肌梗死（心脏病发作）",
    ar: "نوبة قلبية (جلطة قلبية)",
    bn: "হার্ট অ্যাটাক",
    pt: "Ataque Cardíaco (Infarto)",
    de: "Herzinfarkt",
    tl: "Atake sa Puso",
    vi: "Cơn đau tim (Nhồi máu cơ tim)",
    ta: "மாரடைப்பு"
  },
  "Atherosclerosis": {
    es: "Endurecimiento u Obstrucción de Arterias",
    hi: "धमनियों में रुकावट या सख्त होना",
    fr: "Durcissement ou Obstruction des Artères",
    zh: "动脉粥样硬化（血管斑块硬化）",
    ar: "تصلب الشرايين",
    bn: "ধমনি শক্ত হওয়া বা জমাট বাঁধা",
    pt: "Endurecimento das Artérias",
    de: "Arterienverkalkung",
    tl: "Paninigas ng mga Ugat",
    vi: "Xơ vữa động mạch",
    ta: "இரத்தக் குழாய் தடிப்பு"
  },
  "Dyspnea on Exertion": {
    es: "Falta de Aire Durante el Esfuerzo",
    hi: "शारीरिक मेहनत करने पर सांस फूलना",
    fr: "Essoufflement à l'Effort",
    zh: "活动后气促 / 呼吸急促",
    ar: "ضيق التنفس عند بذل الجهد",
    bn: "পরিশ্রমের সময় শ্বাসকষ্ট",
    pt: "Falta de Ar no Esforço",
    de: "Atemnot bei Belastung",
    tl: "Hingal sa Pagkilos",
    vi: "Khó thở khi gắng sức",
    ta: "வேலை செய்யும்போது மூச்சுத்திணறல்"
  },
  "Benign Prostatic Hyperplasia (BPH)": {
    es: "Agrandamiento de Próstata No Canceroso",
    hi: "प्रोस्टेट ग्रंथि का सामान्य रूप से बढ़ना (गैर-कैंसर)",
    fr: "Hypertrophie Bénigne de la Prostate",
    zh: "良性前列腺增生（非癌症肥大）",
    ar: "تضخم البروستاتا الحميد (غير سرطاني)",
    bn: "প্রোস্টেট বৃদ্ধি (ক্যান্সার নয়)",
    pt: "Hiperplasia Prostática Benigna",
    de: "Gutartige Prostatavergrößerung",
    tl: "Paglaki ng Prostate (Hindi Kanser)",
    vi: "Phì đại tuyến tiền liệt lành tính",
    ta: "தீங்கற்ற புரோஸ்டேட் வீக்கம்"
  },
  "eGFR (Estimated Glomerular Filtration Rate)": {
    es: "Puntuación de Filtración del Riñón",
    hi: "गुर्दे (किडनी) की सफाई/फ़िल्टर करने की दर",
    fr: "Débit de Filtration Glomérulaire Estimé",
    zh: "肾脏过滤评分（估算肾小球滤过率）",
    ar: "معدل ترشيح الكلى المقدر",
    bn: "কিডনি ফিল্টারিং রেট",
    pt: "Taxa de Filtração dos Rins",
    de: "Nierenfiltrationsrate",
    tl: "Pagsasala ng Bato (Kidney Score)",
    vi: "Tốc độ lọc cầu thận ước tính",
    ta: "சிறுநீரக வடிகட்டுதல் விகிதம்"
  },
  "HbA1c (Hemoglobin A1c)": {
    es: "Promedio de Glucosa en Sangre de 3 Meses",
    hi: "पिछले 3 महीनों का औसत ब्लड शुगर",
    fr: "Moyenne de Glycémie sur 3 Mois (HbA1c)",
    zh: "糖化血红蛋白（近3个月平均血糖）",
    ar: "السكر التراكمي (معدل السكر لـ 3 أشهر)",
    bn: "৩ মাসের গড় রক্তের শর্করা",
    pt: "Hemoglobina Glicada (Média de 3 Meses)",
    de: "Langzeit-Blutzuckerwert (HbA1c)",
    tl: "3-Buwang Katamtamang Asukal sa Dugo",
    vi: "Chỉ số đường huyết trung bình 3 tháng",
    ta: "3 மாத சராசரி இரத்த சர்க்கரை அளவு"
  },
  "Neuropathy": {
    es: "Irritación o Daño en los Nervios",
    hi: "नसों की कमजोरी या झनझनाहट",
    fr: "Neuropathie (Irritation des Nerfs)",
    zh: "周围神经病变（神经麻木/刺痛）",
    ar: "اعتلال الأعصاب الطرفية",
    bn: "স্নায়ুর দুর্বলতা বা ঝিনঝিন",
    pt: "Neuropatia (Irritação nos Nervos)",
    de: "Nervenschädigung / Neuropathie",
    tl: "Pinsala sa Ugat / Pamamanhid",
    vi: "Bệnh thần kinh ngoại biên",
    ta: "நரம்பு எரிச்சல் / மரத்துப்போதல்"
  },
  "Alanine Aminotransferase (ALT)": {
    es: "Marcador Enzimático del Hígado",
    hi: "लिवर एंजाइम स्वास्थ्य संकेतक",
    fr: "Enzyme Hépatique (Santé du Foie)",
    zh: "谷丙转氨酶（肝脏健康指标）",
    ar: "إنزيم الكبد (ALT)",
    bn: "লিভার এনজাইম মার্কার",
    pt: "Enzima Hepática ALT",
    de: "Leberenzymwert (ALT)",
    tl: "Enzyme sa Atay (ALT)",
    vi: "Men gan ALT",
    ta: "கல்லீரல் என்சைம் ALT"
  },
  "Gastroesophageal Reflux Disease (GERD)": {
    es: "Reflujo Ácido Crónico / Acidez Estomacal",
    hi: "एसिड रिफ्लक्स / पेट का एसिड ऊपर आना",
    fr: "Reflux Gastro-Œsophagien (RGO)",
    zh: "胃食管反流病（胃酸反流/烧心）",
    ar: "ارتجاع المريء وحموضة المعدة",
    bn: "অ্যাসিড রিফ্লাক্স / গ্যাস্ট্রিক",
    pt: "Refluxo Gastroesofágico",
    de: "Refluxkrankheit (Sodbrennen)",
    tl: "Acid Reflux / Pangangasim",
    vi: "Trào ngược dạ dày thực quản",
    ta: "நெஞ்செரிச்சல் / அமில எதிர்ப்பாங்கு"
  },
  "Postprandial Hyperglycemia": {
    es: "Pico de Glucosa Después de Comer",
    hi: "भोजन के बाद ब्लड शुगर का बढ़ना",
    fr: "Hyperglycémie Post-Prandiale (Après Repas)",
    zh: "餐后高血糖（饭后血糖飙升）",
    ar: "ارتفاع السكر بعد الأكل",
    bn: "খাওয়ার পর রক্তের শর্করা বৃদ্ধি",
    pt: "Glicemia Alta Pós-Prandial",
    de: "Blutzuckeranstieg nach dem Essen",
    tl: "Mataas na Asukal Pagkatapos Kumain",
    vi: "Tăng đường huyết sau ăn",
    ta: "உணவுக்குப் பின் இரத்த சர்க்கரை உயர்வு"
  },
  "Pleural Effusion": {
    es: "Líquido Alrededor de los Pulmones",
    hi: "फेफड़ों के चारों ओर पानी जमा होना",
    fr: "Épanchement Pleural (Liquide autour du Poumon)",
    zh: "胸腔积液（肺周积水）",
    ar: "ارتشاح البلورا (سوائل حول الرئة)",
    bn: "ফুসফুসের চারপাশে তরল জমা",
    pt: "Derrame Pleural (Líquido nos Pulmões)",
    de: "Pleuraerguss (Wasser in der Lunge)",
    tl: "Tubig sa Paligid ng Baga",
    vi: "Tràn dịch màng phổi",
    ta: "நுரையீரலைச் சுற்றி நீர் கோர்த்தல்"
  }
};

/**
 * Translate general sentences into the selected language
 */
function translateText(text, targetLang) {
  if (!text || targetLang === 'en') return text;
  
  // If target language is supported in our UI_TRANSLATIONS dictionary, return if matching key
  if (UI_TRANSLATIONS[targetLang] && UI_TRANSLATIONS[targetLang][text]) {
    return UI_TRANSLATIONS[targetLang][text];
  }
  
  // Check exact glossary term match
  if (TRANSLATION_CACHE[text] && TRANSLATION_CACHE[text][targetLang]) {
    return TRANSLATION_CACHE[text][targetLang];
  }

  // Pre-compiled multi-language templates for sample documents
  if (targetLang === 'es') {
    return translateToSpanish(text);
  } else if (targetLang === 'hi') {
    return translateToHindi(text);
  } else if (targetLang === 'fr') {
    return translateToFrench(text);
  } else if (targetLang === 'zh') {
    return translateToChinese(text);
  } else if (targetLang === 'ar') {
    return translateToArabic(text);
  }

  // Fallback: return original text with language tag
  return text;
}

function translateToSpanish(text) {
  return text
    .replace(/What This Means in Plain Words/gi, "Qué significa en palabras simples")
    .replace(/Everyday Real-World Analogy/gi, "Analogía de la vida cotidiana")
    .replace(/Why Doctors Check or Care About This/gi, "Por qué los médicos revisan esto")
    .replace(/Questions to Ask Your Doctor/gi, "Preguntas para hacerle a su médico")
    .replace(/High Blood Pressure/gi, "Presión arterial alta")
    .replace(/Heart Attack/gi, "Ataque cardíaco")
    .replace(/blood sugar/gi, "azúcar en sangre")
    .replace(/cholesterol/gi, "colesterol")
    .replace(/kidney/gi, "riñón")
    .replace(/liver/gi, "hígado")
    .replace(/Within Expected Range/gi, "Dentro del rango esperado")
    .replace(/Higher than Usual - Discuss with Doctor/gi, "Más alto de lo habitual - Consultar con el médico")
    .replace(/Lower than Usual - Discuss with Doctor/gi, "Más bajo de lo habitual - Consultar con el médico")
    .replace(/Normal/gi, "Normal");
}

function translateToHindi(text) {
  return text
    .replace(/What This Means in Plain Words/gi, "सरल शब्दों में इसका अर्थ")
    .replace(/Everyday Real-World Analogy/gi, "रोज़मर्रा का उदाहरण")
    .replace(/Why Doctors Check or Care About This/gi, "डॉक्टर यह जांच क्यों करते हैं")
    .replace(/Questions to Ask Your Doctor/gi, "डॉक्टर से पूछने योग्य सवाल")
    .replace(/High Blood Pressure/gi, "उच्च रक्तचाप (हाई बीपी)")
    .replace(/Heart Attack/gi, "दिल का दौरा")
    .replace(/blood sugar/gi, "ब्लड शुगर")
    .replace(/cholesterol/gi, "कोलेस्ट्रॉल")
    .replace(/kidney/gi, "गुर्दा (किडनी)")
    .replace(/liver/gi, "लिवर")
    .replace(/Within Expected Range/gi, "सामान्य सीमा के भीतर")
    .replace(/Higher than Usual - Discuss with Doctor/gi, "सामान्य से अधिक - डॉक्टर से चर्चा करें")
    .replace(/Lower than Usual - Discuss with Doctor/gi, "सामान्य से कम - डॉक्टर से चर्चा करें")
    .replace(/Normal/gi, "सामान्य");
}

function translateToFrench(text) {
  return text
    .replace(/What This Means in Plain Words/gi, "Ce que cela signifie en termes simples")
    .replace(/Everyday Real-World Analogy/gi, "Analogie du quotidien")
    .replace(/Why Doctors Check or Care About This/gi, "Pourquoi les médecins vérifient cela")
    .replace(/Questions to Ask Your Doctor/gi, "Questions à poser à votre médecin")
    .replace(/High Blood Pressure/gi, "Hypertension artérielle")
    .replace(/Within Expected Range/gi, "Dans les limites normales")
    .replace(/Higher than Usual - Discuss with Doctor/gi, "Plus élevé que la normale - À aborder avec le médecin")
    .replace(/Normal/gi, "Normal");
}

function translateToChinese(text) {
  return text
    .replace(/What This Means in Plain Words/gi, "通俗白话解读")
    .replace(/Everyday Real-World Analogy/gi, "生活形象比喻")
    .replace(/Why Doctors Check or Care About This/gi, "医生为什么关注此项")
    .replace(/Questions to Ask Your Doctor/gi, "您可以询问医生的问题")
    .replace(/High Blood Pressure/gi, "高血压")
    .replace(/Within Expected Range/gi, "在正常参考范围内")
    .replace(/Higher than Usual - Discuss with Doctor/gi, "高于常规指标 - 建议与医生讨论")
    .replace(/Normal/gi, "正常");
}

function translateToArabic(text) {
  return text
    .replace(/What This Means in Plain Words/gi, "ماذا يعني ذلك بلغة سهلة")
    .replace(/Everyday Real-World Analogy/gi, "تشبيه من الحياة اليومية")
    .replace(/Why Doctors Check or Care About This/gi, "لماذا يهتم الأطباء بفحص ذلك")
    .replace(/Questions to Ask Your Doctor/gi, "أسئلة مقترحة لطرحها على طبيبك")
    .replace(/High Blood Pressure/gi, "ارتفاع ضغط الدم")
    .replace(/Within Expected Range/gi, "ضمن المعدل الطبيعي")
    .replace(/Higher than Usual - Discuss with Doctor/gi, "أعلى من المعدل - ناقشه مع الطبيب")
    .replace(/Normal/gi, "طبيعي");
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SUPPORTED_LANGUAGES, UI_TRANSLATIONS, TRANSLATION_CACHE, translateText };
}
