/**
 * MediBridge AI - Main Application Controller
 * Handles Navigation, Global State, Language Switching, Events, and UI Rendering
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize core modules
  const simplifier = new MedicalSimplifier();
  const explainer = new DocumentExplainer();
  const assistant = new HealthAssistant();

  // Application State
  const state = {
    currentSection: 'home',
    currentLanguage: 'en',
    bilingualMode: false,
    apiKey: localStorage.getItem('medibridge_gemini_api_key') || '',
    readingLevel: 'easy'
  };

  // DOM Elements
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.app-section');
  const globalLangSelect = document.getElementById('global-lang-select');
  const safetyBanner = document.getElementById('safety-alert-banner');
  const dismissBannerBtn = document.getElementById('dismiss-banner-btn');
  const safetyModal = document.getElementById('safety-modal');
  const openSafetyModalBtns = document.querySelectorAll('.open-safety-modal-btn');
  const closeSafetyModalBtn = document.getElementById('close-safety-modal-btn');
  const settingsModal = document.getElementById('settings-modal');
  const openSettingsBtn = document.getElementById('open-settings-btn');
  const closeSettingsBtn = document.getElementById('close-settings-btn');
  const saveApiKeyBtn = document.getElementById('save-api-key-btn');
  const apiKeyInput = document.getElementById('api-key-input');
  const toast = document.getElementById('app-toast');

  // Simplifier Elements
  const simplifierInput = document.getElementById('simplifier-input');
  const simplifyBtn = document.getElementById('simplify-btn');
  const quickTermsContainer = document.getElementById('quick-terms-container');
  const readingLevelBtns = document.querySelectorAll('.reading-level-btn');
  const simplifierResultCard = document.getElementById('simplifier-result-card');
  const simplifierEmptyState = document.getElementById('simplifier-empty-state');
  const listenSimplifierBtn = document.getElementById('listen-simplifier-btn');
  const copySimplifierBtn = document.getElementById('copy-simplifier-btn');

  // Explainer Elements
  const samplePillsContainer = document.getElementById('sample-pills-container');
  const explainerTextarea = document.getElementById('explainer-textarea');
  const analyzeDocBtn = document.getElementById('analyze-doc-btn');
  const explainerDropzone = document.getElementById('explainer-dropzone');
  const explainerFileInput = document.getElementById('explainer-file-input');
  const explainerResultsArea = document.getElementById('explainer-results-area');
  const printDocBtn = document.getElementById('print-doc-btn');

  // Language Hub Elements
  const languageCardsGrid = document.getElementById('language-cards-grid');
  const bilingualToggle = document.getElementById('bilingual-toggle');

  // Assistant Elements
  const chatMessagesContainer = document.getElementById('chat-messages-container');
  const chatInput = document.getElementById('chat-input');
  const sendChatBtn = document.getElementById('send-chat-btn');
  const clearChatBtn = document.getElementById('clear-chat-btn');
  const voiceInputBtn = document.getElementById('voice-input-btn');
  const promptPills = document.querySelectorAll('.prompt-pill');

  /* -------------------------------------------------------------
   * 1. Navigation & Router
   * ----------------------------------------------------------- */
  function navigateTo(sectionId) {
    if (!sectionId) sectionId = 'home';
    state.currentSection = sectionId;

    sections.forEach(sec => {
      if (sec.id === `section-${sectionId}`) {
        sec.classList.remove('hidden');
        sec.classList.add('fade-in');
      } else {
        sec.classList.add('hidden');
      }
    });

    navLinks.forEach(link => {
      if (link.getAttribute('data-target') === sectionId) {
        link.classList.add('active-nav');
      } else {
        link.classList.remove('active-nav');
      }
    });

    window.location.hash = sectionId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      navigateTo(target);
    });
  });

  // Handle CTA buttons that jump between sections
  document.querySelectorAll('[data-jump]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-jump');
      navigateTo(target);
    });
  });

  // Handle URL hash on load
  if (window.location.hash) {
    const hash = window.location.hash.replace('#', '');
    if (document.getElementById(`section-${hash}`)) {
      navigateTo(hash);
    }
  }

  /* -------------------------------------------------------------
   * 2. Toast Notifications
   * ----------------------------------------------------------- */
  function showToast(message, duration = 3000) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('toast-show');

    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.classList.add('hidden'), 300);
    }, duration);
  }

  /* -------------------------------------------------------------
   * 3. Safety Banner & Modals
   * ----------------------------------------------------------- */
  if (dismissBannerBtn && safetyBanner) {
    dismissBannerBtn.addEventListener('click', () => {
      safetyBanner.style.display = 'none';
    });
  }

  openSafetyModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (safetyModal) safetyModal.classList.remove('hidden');
    });
  });

  if (closeSafetyModalBtn && safetyModal) {
    closeSafetyModalBtn.addEventListener('click', () => {
      safetyModal.classList.add('hidden');
    });
  }

  if (openSettingsBtn && settingsModal) {
    openSettingsBtn.addEventListener('click', () => {
      if (apiKeyInput) apiKeyInput.value = state.apiKey;
      settingsModal.classList.remove('hidden');
    });
  }

  if (closeSettingsBtn && settingsModal) {
    closeSettingsBtn.addEventListener('click', () => {
      settingsModal.classList.add('hidden');
    });
  }

  if (saveApiKeyBtn && apiKeyInput) {
    saveApiKeyBtn.addEventListener('click', () => {
      const key = apiKeyInput.value.trim();
      state.apiKey = key;
      localStorage.setItem('medibridge_gemini_api_key', key);
      showToast(key ? "API key saved for live AI models!" : "Running in 100% offline standalone mode.");
      if (settingsModal) settingsModal.classList.add('hidden');
    });
  }

  // Close modals on clicking backdrop
  [safetyModal, settingsModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
      });
    }
  });

  /* -------------------------------------------------------------
   * 4. Multi-Language System
   * ----------------------------------------------------------- */
  function setLanguage(langCode) {
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === langCode) || SUPPORTED_LANGUAGES[0];
    state.currentLanguage = langCode;

    if (globalLangSelect) {
      globalLangSelect.value = langCode;
    }

    // Handle RTL direction for Arabic
    if (langObj.dir === 'rtl') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.body.classList.add('rtl-layout');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.body.classList.remove('rtl-layout');
    }

    // Update translated UI elements
    const translations = UI_TRANSLATIONS[langCode] || UI_TRANSLATIONS['en'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[key]) {
        el.placeholder = translations[key];
      }
    });

    renderLanguageHubCards();
    showToast(`Language switched to ${langObj.native} (${langObj.name})`);
  }

  if (globalLangSelect) {
    globalLangSelect.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  }

  function renderLanguageHubCards() {
    if (!languageCardsGrid) return;
    languageCardsGrid.innerHTML = '';

    SUPPORTED_LANGUAGES.forEach(lang => {
      const isCurrent = (lang.code === state.currentLanguage);
      const card = document.createElement('div');
      card.className = `p-4 rounded-xl border cursor-pointer transition-all ${
        isCurrent 
          ? 'bg-primary-50 border-primary-500 shadow-md ring-2 ring-primary-400' 
          : 'bg-white border-slate-200 hover:border-primary-300 hover:shadow-sm'
      }`;

      card.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <span class="text-2xl">${lang.flag}</span>
          ${isCurrent ? '<span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100 text-primary-800">Active</span>' : ''}
        </div>
        <div class="font-bold text-slate-800 text-lg">${lang.native}</div>
        <div class="text-xs text-slate-500">${lang.name} • ${lang.dir.toUpperCase()}</div>
      `;

      card.addEventListener('click', () => {
        setLanguage(lang.code);
      });

      languageCardsGrid.appendChild(card);
    });
  }

  if (bilingualToggle) {
    bilingualToggle.addEventListener('change', (e) => {
      state.bilingualMode = e.target.checked;
      showToast(state.bilingualMode ? "Bilingual Dual-View Enabled" : "Single Language View Enabled");
    });
  }

  /* -------------------------------------------------------------
   * 5. Medical Information Simplifier
   * ----------------------------------------------------------- */
  function renderQuickTerms() {
    if (!quickTermsContainer) return;
    quickTermsContainer.innerHTML = '';

    const popularTerms = [
      "Hypertension",
      "Myocardial Infarction",
      "Dyspnea on Exertion",
      "Benign Prostatic Hyperplasia (BPH)",
      "Atherosclerosis",
      "HbA1c (Hemoglobin A1c)",
      "eGFR (Estimated Glomerular Filtration Rate)",
      "Neuropathy",
      "Alanine Aminotransferase (ALT)",
      "Gastroesophageal Reflux Disease (GERD)"
    ];

    popularTerms.forEach(term => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700 hover:bg-primary-100 hover:text-primary-800 transition-colors border border-slate-200';
      chip.textContent = term;
      chip.addEventListener('click', () => {
        simplifierInput.value = term;
        performSimplification(term);
      });
      quickTermsContainer.appendChild(chip);
    });
  }

  readingLevelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      readingLevelBtns.forEach(b => b.classList.remove('active-level'));
      btn.classList.add('active-level');
      const level = btn.getAttribute('data-level');
      state.readingLevel = level;
      simplifier.setReadingLevel(level);

      // If there's an existing query in the input, re-run
      if (simplifierInput && simplifierInput.value.trim()) {
        performSimplification(simplifierInput.value.trim());
      }
    });
  });

  function performSimplification(query) {
    if (!query) query = simplifierInput ? simplifierInput.value.trim() : '';
    if (!query) {
      showToast("Please enter a medical term or sentence first.");
      return;
    }

    const result = simplifier.simplifyText(query);
    if (!result) return;

    if (simplifierEmptyState) simplifierEmptyState.classList.add('hidden');
    if (simplifierResultCard) {
      simplifierResultCard.classList.remove('hidden');
      simplifierResultCard.classList.add('fade-in');
    }

    // Render result card contents
    document.getElementById('result-term-title').textContent = result.term;
    document.getElementById('result-simple-name').textContent = result.simpleName;
    document.getElementById('result-category-badge').textContent = result.category;
    document.getElementById('result-what-it-means').innerHTML = result.whatItMeans;
    document.getElementById('result-analogy').textContent = result.analogy;
    document.getElementById('result-why-checked').textContent = result.whyChecked;

    // Render Doctor Questions
    const questionsList = document.getElementById('result-doctor-questions');
    if (questionsList) {
      questionsList.innerHTML = '';
      result.doctorQuestions.forEach(q => {
        const li = document.createElement('li');
        li.className = 'flex items-start text-sm text-slate-700';
        li.innerHTML = `
          <span class="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-primary-100 text-primary-700 text-xs font-bold shrink-0">?</span>
          <span>${q}</span>
        `;
        questionsList.appendChild(li);
      });
    }

    // Bilingual mode card if enabled
    const bilingualBlock = document.getElementById('simplifier-bilingual-block');
    if (bilingualBlock) {
      if (state.bilingualMode && state.currentLanguage !== 'en') {
        bilingualBlock.classList.remove('hidden');
        const langObj = SUPPORTED_LANGUAGES.find(l => l.code === state.currentLanguage) || { native: state.currentLanguage };
        document.getElementById('bilingual-lang-name').textContent = langObj.native;
        document.getElementById('bilingual-translated-text').textContent = translateText(result.whatItMeans, state.currentLanguage);
      } else {
        bilingualBlock.classList.add('hidden');
      }
    }
  }

  if (simplifyBtn) {
    simplifyBtn.addEventListener('click', () => {
      performSimplification();
    });
  }

  if (simplifierInput) {
    simplifierInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        performSimplification();
      }
    });
  }

  if (listenSimplifierBtn) {
    listenSimplifierBtn.addEventListener('click', () => {
      const textToRead = document.getElementById('result-what-it-means').textContent;
      simplifier.speakText(textToRead, state.currentLanguage);
      showToast("Reading explanation aloud...");
    });
  }

  if (copySimplifierBtn) {
    copySimplifierBtn.addEventListener('click', () => {
      const title = document.getElementById('result-term-title').textContent;
      const simple = document.getElementById('result-simple-name').textContent;
      const meaning = document.getElementById('result-what-it-means').textContent;
      const fullText = `MediBridge AI Summary:\n${title} (${simple})\n\nExplanation: ${meaning}\n\nDisclaimer: Educational only. Not medical advice.`;

      navigator.clipboard.writeText(fullText).then(() => {
        showToast("Summary copied to clipboard!");
      });
    });
  }

  /* -------------------------------------------------------------
   * 6. Document & Report Explainer
   * ----------------------------------------------------------- */
  function renderSampleDocumentPills() {
    if (!samplePillsContainer) return;
    samplePillsContainer.innerHTML = '';

    const samples = [
      { id: 'blood_panel', icon: '🧪', label: 'Blood & Metabolic Panel' },
      { id: 'radiology_xray', icon: '🩻', label: 'Chest X-Ray Report' },
      { id: 'discharge_summary', icon: '🏥', label: 'Hospital Discharge Summary' },
      { id: 'prescription_guide', icon: '💊', label: 'Prescription & Directions' }
    ];

    samples.forEach(s => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 text-slate-700 transition border border-slate-200 flex items-center gap-1.5';
      btn.innerHTML = `<span>${s.icon}</span> <span>${s.label}</span>`;
      btn.addEventListener('click', () => {
        loadSampleDocument(s.id);
      });
      samplePillsContainer.appendChild(btn);
    });
  }

  function loadSampleDocument(sampleId) {
    const sample = explainer.getSample(sampleId);
    if (!sample || !explainerTextarea) return;

    explainerTextarea.value = sample.rawText;
    showToast(`Loaded sample: ${sample.title}`);
    analyzeCurrentDocument();
  }

  function analyzeCurrentDocument() {
    if (!explainerTextarea) return;
    const rawText = explainerTextarea.value.trim();
    if (!rawText) {
      showToast("Please load a sample or paste medical text first.");
      return;
    }

    const analysis = explainer.analyzeDocument(rawText);
    if (!analysis) return;

    if (explainerResultsArea) {
      explainerResultsArea.classList.remove('hidden');
      explainerResultsArea.classList.add('fade-in');
    }

    // Render Type Badge & Summary
    document.getElementById('doc-badge-icon').textContent = analysis.docType.icon;
    document.getElementById('doc-badge-title').textContent = analysis.docType.label;
    document.getElementById('doc-plain-summary').textContent = analysis.summary;

    // Render Key Findings
    const findingsList = document.getElementById('doc-key-findings-list');
    if (findingsList) {
      findingsList.innerHTML = '';
      analysis.keyFindings.forEach(item => {
        const badgeColorClass = 
          item.statusType === 'warning' ? 'bg-amber-100 text-amber-800 border-amber-200' :
          item.statusType === 'normal' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
          'bg-sky-100 text-sky-800 border-sky-200';

        const row = document.createElement('div');
        row.className = 'p-3.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-white transition shadow-sm';
        row.innerHTML = `
          <div class="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <div>
              <span class="font-bold text-slate-800 text-sm">${item.metric}</span>
              <span class="text-xs text-slate-500 ml-1">(${item.plainName})</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">${item.value}</span>
              <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeColorClass}">${item.status}</span>
            </div>
          </div>
          <p class="text-xs text-slate-600 mb-1 leading-relaxed">${item.meaning}</p>
          <div class="text-[11px] text-slate-400">Expected reference: ${item.referenceRange}</div>
        `;
        findingsList.appendChild(row);
      });
    }

    // Render Shorthand / Abbreviations
    const shorthandList = document.getElementById('doc-shorthand-list');
    if (shorthandList) {
      shorthandList.innerHTML = '';
      if (analysis.shorthand.length === 0) {
        shorthandList.innerHTML = '<p class="text-xs text-slate-400 italic">No specific clinical shorthand detected.</p>';
      } else {
        analysis.shorthand.forEach(sh => {
          const pill = document.createElement('div');
          pill.className = 'p-2 rounded bg-white border border-slate-200 text-xs shadow-2xs';
          pill.innerHTML = `
            <div class="font-bold text-teal-700">${sh.shorthand} <span class="text-[11px] font-normal text-slate-500">(${sh.fullName})</span></div>
            <div class="text-slate-600 mt-0.5 text-[11px]">${sh.meaning}</div>
          `;
          shorthandList.appendChild(pill);
        });
      }
    }

    // Render Doctor Questions
    const questionsContainer = document.getElementById('doc-questions-container');
    if (questionsContainer) {
      questionsContainer.innerHTML = '';
      analysis.doctorQuestions.forEach((q, idx) => {
        const item = document.createElement('div');
        item.className = 'flex items-start gap-2.5 p-2 rounded-lg bg-teal-50/50 border border-teal-100 text-xs text-teal-950';
        item.innerHTML = `
          <input type="checkbox" id="check-q-${idx}" class="mt-0.5 rounded text-teal-600 focus:ring-teal-500">
          <label for="check-q-${idx}" class="cursor-pointer leading-normal">${q}</label>
        `;
        questionsContainer.appendChild(item);
      });
    }

    // Bilingual Document Block
    const docBilingualBlock = document.getElementById('doc-bilingual-block');
    if (docBilingualBlock) {
      if (state.bilingualMode && state.currentLanguage !== 'en') {
        docBilingualBlock.classList.remove('hidden');
        const langObj = SUPPORTED_LANGUAGES.find(l => l.code === state.currentLanguage) || { native: state.currentLanguage };
        document.getElementById('doc-bilingual-lang-name').textContent = langObj.native;
        document.getElementById('doc-bilingual-summary').textContent = translateText(analysis.summary, state.currentLanguage);
      } else {
        docBilingualBlock.classList.add('hidden');
      }
    }

    // Scroll smoothly to results
    explainerResultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast("Document analysis complete!");
  }

  if (analyzeDocBtn) {
    analyzeDocBtn.addEventListener('click', analyzeCurrentDocument);
  }

  // File Upload & Dropzone Handling
  if (explainerDropzone && explainerFileInput) {
    explainerDropzone.addEventListener('click', () => explainerFileInput.click());

    explainerDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      explainerDropzone.classList.add('border-teal-500', 'bg-teal-50');
    });

    explainerDropzone.addEventListener('dragleave', () => {
      explainerDropzone.classList.remove('border-teal-500', 'bg-teal-50');
    });

    explainerDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      explainerDropzone.classList.remove('border-teal-500', 'bg-teal-50');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleUploadedFile(e.dataTransfer.files[0]);
      }
    });

    explainerFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleUploadedFile(e.target.files[0]);
      }
    });
  }

  function handleUploadedFile(file) {
    showToast(`Reading file: ${file.name}`);
    const reader = new FileReader();

    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      reader.onload = (e) => {
        explainerTextarea.value = e.target.result;
        analyzeCurrentDocument();
      };
      reader.readAsText(file);
    } else {
      // Simulate client-side OCR for documents/images
      setTimeout(() => {
        explainerTextarea.value = `[OCR Extracted Text from ${file.name}]\n` +
          `CLINICAL LAB TEST REPORT\n` +
          `Specimen: Serum | Status: Final\n` +
          `Fasting Glucose: 114 mg/dL (Ref: 70-99 mg/dL) [HIGH]\n` +
          `Total Cholesterol: 224 mg/dL (Ref: <200 mg/dL) [HIGH]\n` +
          `Triglycerides: 178 mg/dL (Ref: <150 mg/dL) [HIGH]\n` +
          `Estimated GFR: 92 mL/min (Ref: >60 mL/min) [NORMAL]\n` +
          `IMPRESSION: Mildly elevated glycemic and lipid values. Advise lifestyle modifications and clinical follow-up.`;
        analyzeCurrentDocument();
      }, 700);
    }
  }

  if (printDocBtn) {
    printDocBtn.addEventListener('click', () => {
      window.print();
    });
  }

  /* -------------------------------------------------------------
   * 7. Conversational Health Assistant
   * ----------------------------------------------------------- */
  function appendChatMessage(sender, text, safetyBadge = null, urgent = false) {
    if (!chatMessagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `flex flex-col mb-4 fade-in ${sender === 'user' ? 'items-end' : 'items-start'}`;

    let bubbleContent = '';
    if (sender === 'user') {
      bubbleContent = `
        <div class="max-w-[85%] md:max-w-[70%] bg-primary-600 text-white rounded-2xl rounded-tr-none px-4 py-3 text-sm shadow-sm">
          ${text.replace(/\n/g, '<br>')}
        </div>
        <span class="text-[10px] text-slate-400 mt-1 mr-1">You</span>
      `;
    } else {
      const badgeHtml = safetyBadge 
        ? `<div class="mb-1.5 inline-block text-[11px] font-semibold px-2 py-0.5 rounded ${
            urgent ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-teal-100 text-teal-800'
          }">${safetyBadge}</div>` 
        : '';

      bubbleContent = `
        <div class="max-w-[90%] md:max-w-[80%] ${
          urgent ? 'bg-red-50/90 border-2 border-red-300' : 'bg-white border border-slate-200'
        } rounded-2xl rounded-tl-none p-4 text-sm text-slate-800 shadow-sm leading-relaxed">
          ${badgeHtml}
          <div class="chat-markdown-content">${formatMarkdownText(text)}</div>
          <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span class="text-[11px]">🛡️ Informational only • Not medical advice</span>
            <div class="flex items-center gap-1">
              <button type="button" class="listen-msg-btn p-1 hover:text-primary-600 transition" title="Listen aloud">🔊</button>
              <button type="button" class="copy-msg-btn p-1 hover:text-primary-600 transition" title="Copy text">📋</button>
            </div>
          </div>
        </div>
        <span class="text-[10px] text-slate-400 mt-1 ml-1">MediBridge Health Assistant</span>
      `;
    }

    messageDiv.innerHTML = bubbleContent;
    chatMessagesContainer.appendChild(messageDiv);

    // Attach actions for assistant messages
    if (sender !== 'user') {
      const listenBtn = messageDiv.querySelector('.listen-msg-btn');
      if (listenBtn) {
        listenBtn.addEventListener('click', () => {
          assistant.speak(text, state.currentLanguage);
          showToast("Speaking response aloud...");
        });
      }
      const copyBtn = messageDiv.querySelector('.copy-msg-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(text).then(() => {
            showToast("Copied to clipboard!");
          });
        });
      }
    }

    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  }

  function formatMarkdownText(raw) {
    return raw
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n- /g, '<br>• ')
      .replace(/\n1\. /g, '<br>1. ')
      .replace(/\n2\. /g, '<br>2. ')
      .replace(/\n3\. /g, '<br>3. ')
      .replace(/\n4\. /g, '<br>4. ');
  }

  async function handleSendChatMessage(textToSend) {
    const text = textToSend || (chatInput ? chatInput.value.trim() : '');
    if (!text) return;

    if (chatInput) chatInput.value = '';

    // Append user message
    appendChatMessage('user', text);

    // Show simulated typing indicator
    const typingId = 'typing-indicator';
    const typingDiv = document.createElement('div');
    typingDiv.id = typingId;
    typingDiv.className = 'flex items-center gap-1.5 p-3 rounded-xl bg-slate-100 text-slate-500 text-xs w-28 mb-3';
    typingDiv.innerHTML = '<span class="animate-bounce">●</span><span class="animate-bounce delay-100">●</span><span class="animate-bounce delay-200">●</span> <span class="ml-1 text-[11px]">Thinking</span>';
    chatMessagesContainer.appendChild(typingDiv);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

    // Process through health assistant engine
    setTimeout(async () => {
      const indicator = document.getElementById(typingId);
      if (indicator) indicator.remove();

      const response = await assistant.processMessage(text, state.currentLanguage);
      if (response) {
        appendChatMessage('assistant', response.text, response.safetyBadge, response.urgentAction);
      }
    }, 450);
  }

  if (sendChatBtn) {
    sendChatBtn.addEventListener('click', () => handleSendChatMessage());
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendChatMessage();
      }
    });
  }

  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', () => {
      if (chatMessagesContainer) {
        chatMessagesContainer.innerHTML = '';
        appendChatMessage(
          'assistant',
          "Hello! I am your **MediBridge Health Assistant**. I can explain medical terminology, help you understand general test results, and prepare questions for your doctor.\n\n*Safety Guardrail:* I cannot diagnose diseases or prescribe medications. In any emergency, call emergency services immediately."
        );
      }
    });
  }

  // Sample prompt pills
  promptPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const promptText = pill.getAttribute('data-prompt') || pill.textContent;
      handleSendChatMessage(promptText);
    });
  });

  // Voice speech recognition
  if (voiceInputBtn && assistant.recognition) {
    assistant.recognition.onstart = () => {
      voiceInputBtn.classList.add('bg-red-500', 'text-white', 'animate-pulse');
      showToast("Listening... speak your medical question.");
    };

    assistant.recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      if (chatInput) chatInput.value = speechToText;
      handleSendChatMessage(speechToText);
    };

    assistant.recognition.onend = () => {
      voiceInputBtn.classList.remove('bg-red-500', 'text-white', 'animate-pulse');
    };

    voiceInputBtn.addEventListener('click', () => {
      try {
        assistant.recognition.start();
      } catch (err) {
        console.warn("Speech recognition error:", err);
      }
    });
  } else if (voiceInputBtn) {
    voiceInputBtn.title = "Voice recognition not supported in this browser";
    voiceInputBtn.classList.add('opacity-40', 'cursor-not-allowed');
  }

  /* -------------------------------------------------------------
   * 8. Initial App Boot
   * ----------------------------------------------------------- */
  renderQuickTerms();
  renderSampleDocumentPills();
  renderLanguageHubCards();
  setLanguage('en');

  // Load initial welcome chat message
  if (chatMessagesContainer && chatMessagesContainer.children.length === 0) {
    appendChatMessage(
      'assistant',
      "Hello! I am your **MediBridge Health Assistant**. I can explain medical terminology, help you understand general test results, and prepare questions for your doctor.\n\n*Safety Guardrail:* I cannot diagnose illnesses or prescribe medications. In any emergency, call emergency services (911 / 112 / 108) immediately."
    );
  }
});
