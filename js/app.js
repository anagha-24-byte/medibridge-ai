/**
 * MediBridge AI - Main Application Controller
 * Handles Navigation, Global State, Language Switching, Events, and UI Rendering
 */

function initMediBridgeApp() {
  // Initialize core modules
  const simplifier = new MedicalSimplifier();
  const explainer = new DocumentExplainer();
  const assistant = new HealthAssistant();
  const hospitalManager = new NearbyHospitalsManager();

  // Application State
  const defaultChecklistItems = [
    { id: 1, text: "Clarify with doctor whether high blood pressure is affected by current salt intake", category: "doctor", completed: false },
    { id: 2, text: "Ask if fasting blood glucose should be rechecked in 3 months", category: "tasks", completed: false },
    { id: 3, text: "Confirm if generic medication is bioequivalent to brand-name", category: "terms", completed: false },
    { id: 4, text: "Bring previous lipid panel printout to the appointment", category: "notes", completed: false }
  ];

  const state = {
    currentSection: 'home',
    currentLanguage: 'en',
    bilingualMode: false,
    apiKey: localStorage.getItem('medibridge_gemini_api_key') || '',
    readingLevel: 'easy',
    lastSimplifiedQuery: 'Hypertension',
    hasUserChatted: false,
    selectedRegion: localStorage.getItem('medibridge_selected_region') || 'karnataka',
    highContrast: localStorage.getItem('medibridge_high_contrast') === 'true',
    fontScale: localStorage.getItem('medibridge_font_scale') || 'md',
    checklistFilter: 'all',
    currentSimplifierQuestions: [],
    currentDocQuestions: [],
    checklistItems: JSON.parse(localStorage.getItem('medibridge_checklist_items') || 'null') || defaultChecklistItems
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

  // State & Region Emergency Selectors
  const bannerStateSelect = document.getElementById('banner-state-select');
  const homeStateSelect = document.getElementById('home-state-select');
  const navigatorStateSelect = document.getElementById('navigator-state-select');
  const bannerEmergencyHotlines = document.getElementById('banner-emergency-hotlines');
  const homeStateHelplines = document.getElementById('home-state-helplines');
  const navigatorHelplineGrid = document.getElementById('navigator-helpline-grid');
  const navigatorHospitalsGrid = document.getElementById('navigator-hospitals-grid');
  const navigatorSchemesGrid = document.getElementById('navigator-schemes-grid');
  const navigatorRegionTitle = document.getElementById('navigator-region-title');
  const detectLocationBtn = document.getElementById('detect-location-btn');

  // Accessibility Controls
  const fontSizeDecBtn = document.getElementById('font-size-dec');
  const fontSizeIncBtn = document.getElementById('font-size-inc');
  const toggleContrastBtn = document.getElementById('toggle-contrast-btn');

  // Simplifier Elements
  const simplifierInput = document.getElementById('simplifier-input');
  const simplifyBtn = document.getElementById('simplify-btn');
  const quickTermsContainer = document.getElementById('quick-terms-container');
  const readingLevelBtns = document.querySelectorAll('.reading-level-btn');
  const simplifierResultCard = document.getElementById('simplifier-result-card');
  const simplifierEmptyState = document.getElementById('simplifier-empty-state');
  const listenSimplifierBtn = document.getElementById('listen-simplifier-btn');
  const copySimplifierBtn = document.getElementById('copy-simplifier-btn');
  const clearSimplifierBtn = document.getElementById('clear-simplifier-btn');
  const voiceSimplifierBtn = document.getElementById('voice-simplifier-btn');
  const addToChecklistSimplifierBtn = document.getElementById('add-to-checklist-simplifier-btn');
  const resultOriginalComparison = document.getElementById('result-original-comparison');

  // Explainer Elements
  const samplePillsContainer = document.getElementById('sample-pills-container');
  const explainerTextarea = document.getElementById('explainer-textarea');
  const analyzeDocBtn = document.getElementById('analyze-doc-btn');
  const clearDocBtn = document.getElementById('clear-doc-btn');
  const addToChecklistDocBtn = document.getElementById('add-to-checklist-doc-btn');
  const explainerDropzone = document.getElementById('explainer-dropzone');
  const explainerFileInput = document.getElementById('explainer-file-input');
  const explainerResultsArea = document.getElementById('explainer-results-area');
  const explainerErrorCard = document.getElementById('explainer-error-card');
  const explainerErrorTitle = document.getElementById('explainer-error-title');
  const explainerErrorMessage = document.getElementById('explainer-error-message');
  const explainerTrySampleBtn = document.getElementById('explainer-try-sample-btn');
  const explainerReuploadBtn = document.getElementById('explainer-reupload-btn');
  const printDocBtn = document.getElementById('print-doc-btn');

  // Language Hub Elements
  const languageCardsGrid = document.getElementById('language-cards-grid');
  const bilingualToggle = document.getElementById('bilingual-toggle');

  // Action Checklist Elements
  const checklistItemsContainer = document.getElementById('checklist-items-container');
  const newChecklistText = document.getElementById('new-checklist-text');
  const newChecklistCategory = document.getElementById('new-checklist-category');
  const addChecklistBtn = document.getElementById('add-checklist-btn');
  const checklistFilterBtns = document.querySelectorAll('.checklist-filter-btn');
  const countAllSpan = document.getElementById('count-all');
  const checklistProgressText = document.getElementById('checklist-progress-text');
  const clearCompletedChecklistBtn = document.getElementById('clear-completed-checklist-btn');
  const resetDefaultChecklistBtn = document.getElementById('reset-default-checklist-btn');
  const printChecklistBtn = document.getElementById('print-checklist-btn');
  const exportChecklistBtn = document.getElementById('export-checklist-btn');

  // Assistant Elements
  const chatMessagesContainer = document.getElementById('chat-messages-container');
  const chatInput = document.getElementById('chat-input');
  const sendChatBtn = document.getElementById('send-chat-btn');
  const clearChatBtn = document.getElementById('clear-chat-btn');
  const newChatBtn = document.getElementById('new-chat-btn');
  const voiceInputBtn = document.getElementById('voice-input-btn');
  const promptPills = document.querySelectorAll('.prompt-pill');

  // Nearby Hospitals Elements
  const hospitalUseGpsBtn = document.getElementById('hospital-use-gps-btn');
  const hospitalGpsIcon = document.getElementById('hospital-gps-icon');
  const hospitalGpsLabel = document.getElementById('hospital-gps-label');
  const hospitalManualInput = document.getElementById('hospital-manual-input');
  const hospitalManualSearchBtn = document.getElementById('hospital-manual-search-btn');
  const hospitalPresetChips = document.querySelectorAll('.hospital-preset-chip');
  const hospitalRadiusSelect = document.getElementById('hospital-radius-select');
  const hospitalActiveLocationBanner = document.getElementById('hospital-active-location-banner');
  const hospitalActiveTargetText = document.getElementById('hospital-active-target-text');
  const hospitalActiveSourceBadge = document.getElementById('hospital-active-source-badge');
  const hospitalLoadingState = document.getElementById('hospital-loading-state');
  const hospitalResultsHeader = document.getElementById('hospital-results-header');
  const hospitalCountBadge = document.getElementById('hospital-count-badge');
  const hospitalDistanceModeText = document.getElementById('hospital-distance-mode-text');
  const hospitalCardsGrid = document.getElementById('hospital-cards-grid');
  const hospitalEmptyState = document.getElementById('hospital-empty-state');
  const hospitalRetryExpandBtn = document.getElementById('hospital-retry-expand-btn');
  const hospitalErrorState = document.getElementById('hospital-error-state');
  const hospitalErrorTitle = document.getElementById('hospital-error-title');
  const hospitalErrorDesc = document.getElementById('hospital-error-desc');
  const hospitalErrorRetryBtn = document.getElementById('hospital-error-retry-btn');

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

    // If navigating to Nearby Hospitals for the first time, auto-populate with the user's selected region
    if (sectionId === 'hospitals' && !lastHospitalSearchQuery) {
      const regionCityMap = {
        karnataka: 'Bengaluru',
        maharashtra: 'Mumbai',
        delhi: 'Delhi',
        telangana: 'Hyderabad',
        tamil_nadu: 'Chennai',
        west_bengal: 'Kolkata',
        gujarat: 'Ahmedabad',
        kerala: 'Kochi',
        uttar_pradesh: 'Lucknow'
      };
      const initialCity = regionCityMap[state.selectedRegion] || 'Bengaluru';
      if (hospitalManualInput && !hospitalManualInput.value) {
        hospitalManualInput.value = initialCity;
      }
      handleManualHospitalSearch();
    }
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
   * 3.5 Regional Emergency & Healthcare Directory System
   * ----------------------------------------------------------- */
  function getRegionData(regionKey) {
    if (typeof STATE_EMERGENCY_DATA !== 'undefined' && STATE_EMERGENCY_DATA[regionKey]) {
      return STATE_EMERGENCY_DATA[regionKey];
    }
    return (typeof STATE_EMERGENCY_DATA !== 'undefined') ? STATE_EMERGENCY_DATA['national_india'] : null;
  }

  function setRegion(regionKey) {
    if (!regionKey) regionKey = 'karnataka';
    state.selectedRegion = regionKey;
    localStorage.setItem('medibridge_selected_region', regionKey);

    // Sync all dropdowns
    if (bannerStateSelect) bannerStateSelect.value = regionKey;
    if (homeStateSelect) homeStateSelect.value = regionKey;
    if (navigatorStateSelect) navigatorStateSelect.value = regionKey;

    renderRegionData();
  }

  function renderRegionData() {
    const data = getRegionData(state.selectedRegion);
    if (!data) return;

    // 1. Render Banner Emergency Hotlines
    if (bannerEmergencyHotlines) {
      bannerEmergencyHotlines.innerHTML = `
        <a href="tel:${data.ambulance}" class="bg-red-700 hover:bg-red-800 text-white px-2 py-0.5 rounded font-bold transition flex items-center gap-1 shadow-2xs" title="${data.ambulanceLabel || 'Ambulance'}">
          <span>🚑</span> <span>${data.ambulance}</span>
        </a>
        <a href="tel:${data.healthHelpline}" class="bg-amber-700 hover:bg-amber-800 text-white px-2 py-0.5 rounded font-bold transition flex items-center gap-1 shadow-2xs" title="${data.healthHelplineLabel || 'Health Advisory'}">
          <span>🩺</span> <span>${data.healthHelpline}</span>
        </a>
        <a href="tel:${data.nationalEmergency || '112'}" class="bg-slate-800 hover:bg-slate-900 text-white px-2 py-0.5 rounded font-bold transition flex items-center gap-1 shadow-2xs" title="Emergency">
          <span>🚨</span> <span>${data.nationalEmergency || '112'}</span>
        </a>
      `;
    }

    // 2. Render Home Emergency Card Helplines
    if (homeStateHelplines) {
      homeStateHelplines.innerHTML = '';
      const helplines = [
        { icon: '🚑', label: data.ambulanceLabel || `Ambulance (${data.ambulance})`, num: data.ambulance, desc: '24x7 Emergency Medical Dispatch', color: 'bg-red-600 hover:bg-red-700 text-white' },
        { icon: '🩺', label: data.healthHelplineLabel || `Health Advisory (${data.healthHelpline})`, num: data.healthHelpline, desc: '24x7 Medical Advisory & Triage', color: 'bg-teal-600 hover:bg-teal-700 text-white' },
        { icon: '🚨', label: data.nationalEmergency === '911' ? 'Emergency (911)' : `National Emergency (${data.nationalEmergency || '112'})`, num: data.nationalEmergency || '112', desc: 'Police, Fire & Unified Emergency', color: 'bg-slate-800 hover:bg-slate-900 text-white' },
        { icon: '🧠', label: data.mentalHealthLabel || `Mental Health (${data.mentalHealth || '14416'})`, num: data.mentalHealth || '14416', desc: '24x7 Toll-Free Psychological Counseling', color: 'bg-indigo-600 hover:bg-indigo-700 text-white' }
      ];

      helplines.forEach(h => {
        const a = document.createElement('a');
        a.href = `tel:${h.num}`;
        a.className = `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-2xs ${h.color}`;
        a.innerHTML = `<span>${h.icon}</span> <span>${h.label}</span>`;
        a.title = `${h.label}: ${h.desc}`;
        homeStateHelplines.appendChild(a);
      });
    }

    // 3. Render Healthcare Access Navigator Section
    if (navigatorRegionTitle) {
      navigatorRegionTitle.textContent = `Regional Healthcare Resources & Directory — ${data.stateName} (${data.nativeName})`;
    }

    if (navigatorHelplineGrid) {
      navigatorHelplineGrid.innerHTML = '';
      const navHelplines = [
        { label: data.ambulanceLabel || 'Emergency Ambulance', num: data.ambulance, desc: '24x7 Rapid Medical Dispatch', badge: 'Ambulance' },
        { label: data.healthHelplineLabel || 'State Health Helpline', num: data.healthHelpline, desc: '24x7 Free Doctor Advice & Triage', badge: 'Medical Advisory' },
        { label: data.nationalEmergency === '911' ? 'National Emergency Dispatch' : 'Unified National Emergency (112)', num: data.nationalEmergency || '112', desc: 'Police, Fire, Ambulance Dispatch', badge: 'Police & Fire' },
        { label: "Women's Safety & Crisis Helpline", num: data.womenHelpline || '181', desc: '24x7 Crisis Support & Counseling', badge: 'Women Safety' },
        { label: data.mentalHealthLabel || 'Tele-MANAS Mental Health', num: data.mentalHealth || '14416', desc: '24x7 Free Psychiatric Support', badge: 'Mental Health' },
        { label: 'Poison Information Center', num: data.poisonHelpline || '1800-116-117', desc: '24x7 Clinical Toxicological Guidance', badge: 'Toxicology' }
      ];

      navHelplines.forEach(val => {
        const card = document.createElement('div');
        card.className = 'p-3 rounded-xl bg-white border border-red-200/80 shadow-2xs flex items-center justify-between gap-3';
        card.innerHTML = `
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-slate-800 text-xs">${val.label}</span>
              <span class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-800">${val.badge}</span>
            </div>
            <div class="text-[11px] text-slate-500 mt-0.5">${val.desc}</div>
          </div>
          <a href="tel:${val.num.replace(/[^0-9]/g, '')}" class="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs transition shrink-0 flex items-center gap-1 shadow-2xs">
            <span>📞</span> <span>${val.num}</span>
          </a>
        `;
        navigatorHelplineGrid.appendChild(card);
      });
    }

    if (navigatorHospitalsGrid) {
      navigatorHospitalsGrid.innerHTML = '';
      if (!data.publicHospitals || data.publicHospitals.length === 0) {
        navigatorHospitalsGrid.innerHTML = '<p class="text-xs text-slate-500 italic col-span-2">No regional public hospitals listed for this selection.</p>';
      } else {
        data.publicHospitals.forEach(hosp => {
          const card = document.createElement('div');
          card.className = 'p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-primary-300 transition space-y-2';
          card.innerHTML = `
            <div class="flex items-start justify-between gap-2">
              <div>
                <h4 class="font-bold text-slate-900 text-sm">${hosp.name}</h4>
                <div class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <span>📍</span> <span>${hosp.city}</span> • <span class="text-slate-600">${hosp.type || 'Government Hospital'}</span>
                </div>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">✓ Public Apex</span>
            </div>
            <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span class="text-slate-500 text-[11px]">Emergency: ${hosp.emergency}</span>
              <a href="tel:${hosp.phone.replace(/[^0-9]/g, '')}" class="text-primary-700 font-bold hover:underline flex items-center gap-1">
                <span>📞</span> <span>${hosp.phone}</span>
              </a>
            </div>
          `;
          navigatorHospitalsGrid.appendChild(card);
        });
      }
    }

    if (navigatorSchemesGrid) {
      navigatorSchemesGrid.innerHTML = '';
      if (!data.officialSchemes || data.officialSchemes.length === 0) {
        navigatorSchemesGrid.innerHTML = '<p class="text-xs text-slate-500 italic col-span-2">No official schemes configured for this selection.</p>';
      } else {
        data.officialSchemes.forEach(sc => {
          const card = document.createElement('div');
          card.className = 'p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-2';
          card.innerHTML = `
            <div>
              <div class="font-bold text-slate-900 text-xs">${sc.name}</div>
              <p class="text-xs text-slate-600 mt-0.5">${sc.description}</p>
            </div>
            <div class="pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <span class="text-[10px] font-semibold text-slate-500">Official Portal</span>
              <a href="${sc.url}" target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-primary-700 hover:text-primary-800 hover:underline flex items-center gap-1">
                <span>🔗 Visit Portal →</span>
              </a>
            </div>
          `;
          navigatorSchemesGrid.appendChild(card);
        });
      }
    }
  }

  // Event listeners for state dropdowns
  [bannerStateSelect, homeStateSelect, navigatorStateSelect].forEach(selectEl => {
    if (selectEl) {
      selectEl.addEventListener('change', (e) => {
        setRegion(e.target.value);
        showToast(`Emergency region updated to ${getRegionData(e.target.value).stateName}`);
      });
    }
  });

  // Geolocation detection button
  if (detectLocationBtn) {
    detectLocationBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        showToast("Geolocation is not supported by your browser.");
        return;
      }
      showToast("Detecting your region via GPS coordinates...");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          let detected = 'national_india';

          // Bounding box heuristic for Indian states
          if (lat >= 11.5 && lat <= 18.5 && lon >= 74.0 && lon <= 78.6) detected = 'karnataka';
          else if (lat >= 15.6 && lat <= 22.0 && lon >= 72.6 && lon <= 80.9) detected = 'maharashtra';
          else if (lat >= 12.6 && lat <= 19.1 && lon >= 76.7 && lon <= 84.8) detected = 'andhra_pradesh';
          else if (lat >= 15.8 && lat <= 19.9 && lon >= 77.2 && lon <= 81.8) detected = 'telangana';
          else if (lat >= 8.0 && lat <= 13.5 && lon >= 76.2 && lon <= 80.3) detected = 'tamil_nadu';
          else if (lat >= 8.2 && lat <= 12.8 && lon >= 74.8 && lon <= 77.5) detected = 'kerala';
          else if (lat >= 28.3 && lat <= 28.9 && lon >= 76.8 && lon <= 77.4) detected = 'delhi';
          else if (lat >= 20.1 && lat <= 24.7 && lon >= 68.1 && lon <= 74.5) detected = 'gujarat';
          else if (lat >= 21.5 && lat <= 27.2 && lon >= 85.8 && lon <= 89.9) detected = 'west_bengal';
          else if (lat >= 24.0 && lat <= 50.0 && lon <= -65.0 && lon >= -125.0) detected = 'international_us';

          setRegion(detected);
          showToast(`📍 Detected Region: ${getRegionData(detected).stateName}`);
        },
        (err) => {
          console.warn("Geolocation denied or error:", err);
          showToast("Location access unavailable. Defaulted to manual region selector.");
        },
        { timeout: 7000 }
      );
    });
  }

  /* -------------------------------------------------------------
   * 3.6 Patient Action Checklist Controller
   * ----------------------------------------------------------- */
  function saveChecklist() {
    localStorage.setItem('medibridge_checklist_items', JSON.stringify(state.checklistItems));
    renderChecklist();
  }

  function renderChecklist() {
    if (!checklistItemsContainer) return;
    checklistItemsContainer.innerHTML = '';

    const items = state.checklistItems;
    const filter = state.checklistFilter;
    const filtered = filter === 'all' ? items : items.filter(it => it.category === filter);

    const completedCount = items.filter(it => it.completed).length;
    if (checklistProgressText) {
      checklistProgressText.textContent = `${completedCount} of ${items.length} completed`;
    }
    if (countAllSpan) {
      countAllSpan.textContent = items.length;
    }

    // Update active filter button styling
    checklistFilterBtns.forEach(btn => {
      const bFilter = btn.getAttribute('data-filter');
      if (bFilter === filter) {
        btn.className = 'checklist-filter-btn px-2.5 py-1 rounded-lg font-semibold bg-primary-600 text-white text-xs';
      } else {
        btn.className = 'checklist-filter-btn px-2.5 py-1 rounded-lg font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs';
      }
    });

    if (filtered.length === 0) {
      checklistItemsContainer.innerHTML = `
        <div class="text-center py-10 px-4 bg-white rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
          No items found in this category. Add a new item above!
        </div>
      `;
      return;
    }

    const categoryBadges = {
      doctor: { label: '💬 Question for Doctor', class: 'badge-doctor' },
      terms: { label: '📖 Term to Clarify', class: 'badge-terms' },
      tasks: { label: '✅ Follow-up Task', class: 'badge-tasks' },
      notes: { label: '📝 Caregiver Note', class: 'badge-notes' }
    };

    filtered.forEach(item => {
      const badge = categoryBadges[item.category] || categoryBadges['doctor'];
      const row = document.createElement('div');
      row.className = `checklist-item p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-start justify-between gap-3 ${
        item.completed ? 'is-completed' : ''
      }`;

      row.innerHTML = `
        <div class="flex items-start gap-3 flex-grow">
          <input type="checkbox" id="chk-item-${item.id}" ${item.completed ? 'checked' : ''} class="mt-1 rounded text-primary-600 focus:ring-primary-500 cursor-pointer">
          <div class="flex-grow">
            <span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded ${badge.class} mb-1">${badge.label}</span>
            <label for="chk-item-${item.id}" class="checklist-title block text-xs sm:text-sm text-slate-800 leading-snug cursor-pointer select-none">${item.text}</label>
          </div>
        </div>
        <button type="button" class="delete-chk-btn p-1.5 text-slate-400 hover:text-red-600 transition text-xs shrink-0" title="Delete item">
          ✕
        </button>
      `;

      // Checkbox toggle
      const chkInput = row.querySelector(`#chk-item-${item.id}`);
      chkInput.addEventListener('change', () => {
        item.completed = chkInput.checked;
        saveChecklist();
      });

      // Delete button
      const delBtn = row.querySelector('.delete-chk-btn');
      delBtn.addEventListener('click', () => {
        state.checklistItems = state.checklistItems.filter(i => i.id !== item.id);
        saveChecklist();
        showToast("Item removed from checklist.");
      });

      checklistItemsContainer.appendChild(row);
    });
  }

  // Filter buttons click
  checklistFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      state.checklistFilter = btn.getAttribute('data-filter');
      renderChecklist();
    });
  });

  // Add Item
  if (addChecklistBtn && newChecklistText && newChecklistCategory) {
    addChecklistBtn.addEventListener('click', () => {
      const text = newChecklistText.value.trim();
      if (!text) {
        showToast("Please type a question or task first.");
        return;
      }
      const newItem = {
        id: Date.now(),
        text: text,
        category: newChecklistCategory.value,
        completed: false
      };
      state.checklistItems.unshift(newItem);
      newChecklistText.value = '';
      saveChecklist();
      showToast("Added to your action checklist!");
    });

    newChecklistText.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        addChecklistBtn.click();
      }
    });
  }

  // Clear completed
  if (clearCompletedChecklistBtn) {
    clearCompletedChecklistBtn.addEventListener('click', () => {
      const beforeLen = state.checklistItems.length;
      state.checklistItems = state.checklistItems.filter(it => !it.completed);
      if (state.checklistItems.length === beforeLen) {
        showToast("No completed items to clear.");
        return;
      }
      saveChecklist();
      showToast("Cleared completed checklist items.");
    });
  }

  // Reset defaults
  if (resetDefaultChecklistBtn) {
    resetDefaultChecklistBtn.addEventListener('click', () => {
      state.checklistItems = JSON.parse(JSON.stringify(defaultChecklistItems));
      saveChecklist();
      showToast("Checklist reset to default examples.");
    });
  }

  // Print checklist
  if (printChecklistBtn) {
    printChecklistBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Export checklist to plain text file
  if (exportChecklistBtn) {
    exportChecklistBtn.addEventListener('click', () => {
      const lines = [
        "===========================================================",
        "MEDIBRIDGE AI — PATIENT DOCTOR-VISIT CHECKLIST",
        "Generated for Educational Preparation and Consultation",
        `Date: ${new Date().toLocaleDateString()}`,
        "===========================================================\n"
      ];

      state.checklistItems.forEach((it, idx) => {
        const mark = it.completed ? "[X]" : "[ ]";
        lines.push(`${idx + 1}. ${mark} [${it.category.toUpperCase()}] ${it.text}`);
      });

      lines.push("\nDisclaimer: This checklist is educational and does not constitute medical advice.");
      const blob = new Blob([lines.join("\n")], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MediBridge_Doctor_Visit_Checklist_${new Date().toISOString().slice(0, 10)}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      showToast("Checklist exported as text file!");
    });
  }

  // Import questions from Simplifier into Checklist
  if (addToChecklistSimplifierBtn) {
    addToChecklistSimplifierBtn.addEventListener('click', () => {
      if (!state.currentSimplifierQuestions || state.currentSimplifierQuestions.length === 0) {
        showToast("No questions available to add.");
        return;
      }
      let added = 0;
      state.currentSimplifierQuestions.forEach(q => {
        const exists = state.checklistItems.some(it => it.text.toLowerCase() === q.toLowerCase());
        if (!exists) {
          state.checklistItems.push({
            id: Date.now() + Math.random(),
            text: q,
            category: 'doctor',
            completed: false
          });
          added++;
        }
      });
      saveChecklist();
      showToast(`Added ${added} question(s) to Doctor Checklist! Click 'Checklist' to review.`);
    });
  }

  // Import questions from Document Explainer into Checklist
  if (addToChecklistDocBtn) {
    addToChecklistDocBtn.addEventListener('click', () => {
      if (!state.currentDocQuestions || state.currentDocQuestions.length === 0) {
        showToast("No document questions available to add.");
        return;
      }
      let added = 0;
      state.currentDocQuestions.forEach(q => {
        const exists = state.checklistItems.some(it => it.text.toLowerCase() === q.toLowerCase());
        if (!exists) {
          state.checklistItems.push({
            id: Date.now() + Math.random(),
            text: q,
            category: 'doctor',
            completed: false
          });
          added++;
        }
      });
      saveChecklist();
      showToast(`Imported ${added} document question(s) to Doctor Checklist!`);
    });
  }

  /* -------------------------------------------------------------
   * 3.65 Nearby Hospitals & Emergency Contacts Controller
   * ----------------------------------------------------------- */
  let lastHospitalSearchQuery = null;

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async function executeHospitalSearch(lat, lon, locationLabel, sourceLabel) {
    if (!hospitalCardsGrid) return;

    lastHospitalSearchQuery = { lat, lon, locationLabel, sourceLabel };

    // Update active target banner
    if (hospitalActiveLocationBanner && hospitalActiveTargetText) {
      hospitalActiveTargetText.textContent = locationLabel || `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
      if (hospitalActiveSourceBadge) {
        hospitalActiveSourceBadge.textContent = sourceLabel || 'Selected Coordinates';
      }
      hospitalActiveLocationBanner.classList.remove('hidden');
    }

    // Reset UI states
    if (hospitalLoadingState) hospitalLoadingState.classList.remove('hidden');
    if (hospitalResultsHeader) hospitalResultsHeader.classList.add('hidden');
    if (hospitalEmptyState) hospitalEmptyState.classList.add('hidden');
    if (hospitalErrorState) hospitalErrorState.classList.add('hidden');
    hospitalCardsGrid.innerHTML = '';

    try {
      const radius = hospitalManager.searchRadiusKm || 5;
      const results = await hospitalManager.searchHospitals(lat, lon, radius);

      if (hospitalLoadingState) hospitalLoadingState.classList.add('hidden');

      if (!results || results.length === 0) {
        if (hospitalEmptyState) hospitalEmptyState.classList.remove('hidden');
        return;
      }

      // Show results header
      if (hospitalResultsHeader) {
        hospitalResultsHeader.classList.remove('hidden');
        if (hospitalCountBadge) {
          hospitalCountBadge.textContent = `${results.length} Verified Hospital${results.length === 1 ? '' : 's'} Found`;
        }
        if (hospitalDistanceModeText) {
          const usedRad = hospitalManager.effectiveRadiusUsed || radius;
          if (usedRad > radius) {
            hospitalDistanceModeText.textContent = `Within ${usedRad} km (auto-expanded to locate nearest facilities) • Sorted by distance`;
          } else {
            hospitalDistanceModeText.textContent = `Within ${radius} km • Sorted by distance`;
          }
        }
      }

      // Render hospital cards safely
      results.forEach(hosp => {
        const card = document.createElement('div');
        card.className = 'hospital-card p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-rose-300 hover:shadow-md transition flex flex-col justify-between space-y-3';

        const directionsUrl = hospitalManager.getDirectionsUrl(hosp.lat, hosp.lon, lat, lon);
        const telUri = hospitalManager.formatTelUri(hosp.phone);
        const emergTelUri = hospitalManager.formatTelUri(hosp.emergencyPhone);

        // Header block
        const topRow = document.createElement('div');
        topRow.className = 'flex items-start justify-between gap-3';
        topRow.innerHTML = `
          <div>
            <span class="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 mb-1">
              ${escapeHtml(hosp.category || 'Hospital')}
            </span>
            <h4 class="hospital-name font-extrabold text-slate-900 text-base leading-snug">${escapeHtml(hosp.name)}</h4>
            <div class="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>📍</span> <span>${escapeHtml(hosp.address || hosp.city || 'Address available')}</span>
            </div>
          </div>
          <div class="shrink-0 text-right">
            <span class="hospital-distance inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-extrabold text-xs">
              ~${hosp.distance != null ? hosp.distance : '?'} km
            </span>
            <div class="text-[10px] text-slate-400 mt-0.5">approx.</div>
          </div>
        `;
        card.appendChild(topRow);

        // Specialties or description
        if (hosp.specialties) {
          const specEl = document.createElement('p');
          specEl.className = 'text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100';
          specEl.textContent = hosp.specialties;
          card.appendChild(specEl);
        }

        // Contact info block
        const contactBlock = document.createElement('div');
        contactBlock.className = 'space-y-2 pt-2 border-t border-slate-100 text-xs';

        // Primary phone
        if (telUri && hosp.phone) {
          const phoneRow = document.createElement('div');
          phoneRow.className = 'flex items-center justify-between gap-2';
          phoneRow.innerHTML = `
            <span class="text-slate-600 font-medium">Main Contact:</span>
            <a href="${telUri}" class="hospital-call-btn px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1 shadow-2xs" title="Call Hospital">
              <span>📞</span> <span>${escapeHtml(hosp.phone)}</span>
            </a>
          `;
          contactBlock.appendChild(phoneRow);
        } else {
          const noPhoneRow = document.createElement('div');
          noPhoneRow.className = 'text-slate-400 italic text-[11px]';
          noPhoneRow.textContent = 'Contact number not available in retrieved data';
          contactBlock.appendChild(noPhoneRow);
        }

        // Emergency department line
        if (emergTelUri && hosp.emergencyPhone) {
          const emergRow = document.createElement('div');
          emergRow.className = 'flex items-center justify-between gap-2 bg-red-50 p-2 rounded-xl border border-red-200 text-red-950';
          emergRow.innerHTML = `
            <div class="flex items-center gap-1.5 font-bold text-[11px]">
              <span>🚨</span> <span>Emergency Dept:</span>
            </div>
            <a href="${emergTelUri}" class="hospital-emergency-btn px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs transition flex items-center gap-1 shadow-2xs">
              <span>📞</span> <span>Call Emergency</span>
            </a>
          `;
          contactBlock.appendChild(emergRow);
        } else {
          const noEmergRow = document.createElement('div');
          noEmergRow.className = 'text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-200';
          noEmergRow.textContent = 'Emergency department direct line not available in retrieved data — dial 112 / 108';
          contactBlock.appendChild(noEmergRow);
        }

        card.appendChild(contactBlock);

        // Actions & Source footer
        const footerRow = document.createElement('div');
        footerRow.className = 'pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs';
        
        let websiteBtnHtml = '';
        if (hosp.website) {
          websiteBtnHtml = `<a href="${escapeHtml(hosp.website)}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-primary-700 hover:underline flex items-center gap-1"><span>🌐</span> <span>Website</span></a>`;
        }

        footerRow.innerHTML = `
          <div class="flex items-center gap-3">
            <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" class="hospital-directions-btn px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 transition">
              <span>🗺️</span> <span>Directions</span>
            </a>
            ${websiteBtnHtml}
          </div>
          <span class="text-[10px] text-slate-400" title="Data source">${escapeHtml(hosp.source || 'OpenStreetMap')}</span>
        `;
        card.appendChild(footerRow);

        hospitalCardsGrid.appendChild(card);
      });

    } catch (err) {
      console.error('Hospital search error:', err);
      if (hospitalLoadingState) hospitalLoadingState.classList.add('hidden');
      if (hospitalErrorState) {
        hospitalErrorState.classList.remove('hidden');
        if (hospitalErrorDesc) {
          hospitalErrorDesc.textContent = `Search failed: ${err.message || 'Network error'}. Please try selecting a city from quick presets.`;
        }
      }
    }
  }

  // 1. Geolocation GPS Button
  if (hospitalUseGpsBtn) {
    hospitalUseGpsBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        showToast("Geolocation is not supported by your browser. Please enter your location manually.");
        return;
      }

      if (hospitalGpsIcon) hospitalGpsIcon.textContent = '⏳';
      if (hospitalGpsLabel) hospitalGpsLabel.textContent = 'Acquiring GPS...';

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (hospitalGpsIcon) hospitalGpsIcon.textContent = '📍';
          if (hospitalGpsLabel) hospitalGpsLabel.textContent = 'Use My Current Location';
          showToast("Location acquired. Searching nearby hospitals...");
          executeHospitalSearch(
            pos.coords.latitude,
            pos.coords.longitude,
            `Your Location (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`,
            'Device Geolocation API'
          );
        },
        async (err) => {
          let msg = "Device location unavailable. Attempting network IP lookup...";
          showToast(msg);
          
          try {
            if (hospitalGpsLabel) hospitalGpsLabel.textContent = 'Checking network IP...';
            const controller = new AbortController();
            const tid = setTimeout(() => controller.abort(), 4000);
            const r = await fetch('https://ipwho.is/', { signal: controller.signal });
            clearTimeout(tid);

            if (r.ok) {
              const data = await r.json();
              if (data && data.latitude && data.longitude) {
                if (hospitalGpsIcon) hospitalGpsIcon.textContent = '📍';
                if (hospitalGpsLabel) hospitalGpsLabel.textContent = 'Use My Current Location';
                showToast(`Location (${data.city || 'Local area'}, ${data.region || ''}) acquired via network. Finding nearby hospitals...`);
                executeHospitalSearch(
                  data.latitude,
                  data.longitude,
                  `${data.city || 'Your Area'}, ${data.region || 'Local'} (via Network IP)`,
                  'Network IP Location'
                );
                return;
              }
            }
          } catch (e) {
            console.warn('IP fallback bypassed:', e);
          }

          if (hospitalGpsIcon) hospitalGpsIcon.textContent = '📍';
          if (hospitalGpsLabel) hospitalGpsLabel.textContent = 'Use My Current Location';

          let failMsg = "Unable to retrieve device location. Please enter your city or PIN code manually below.";
          if (err.code === 1) {
            failMsg = "Location permission denied. Please enter your city or PIN code manually below.";
          }
          showToast(failMsg);
          if (hospitalErrorState && hospitalErrorDesc) {
            hospitalErrorState.classList.remove('hidden');
            hospitalErrorDesc.textContent = failMsg;
          }
        },
        { timeout: 7000, enableHighAccuracy: false }
      );
    });
  }

  // 2. Manual Search Button & Enter Key
  async function handleManualHospitalSearch() {
    if (!hospitalManualInput) return;
    const query = hospitalManualInput.value.trim();
    if (!query) {
      showToast("Please enter a city, area, or PIN code to search.");
      return;
    }

    showToast(`Locating "${query}"...`);
    const geo = await hospitalManager.geocodeQuery(query);
    if (geo) {
      executeHospitalSearch(geo.lat, geo.lon, geo.name, geo.source);
    } else {
      showToast(`Could not locate "${query}". Try searching a major city or PIN code.`);
      if (hospitalErrorState && hospitalErrorDesc) {
        hospitalErrorState.classList.remove('hidden');
        hospitalErrorDesc.textContent = `Could not find coordinates for "${query}". Try searching for Bengaluru, Mumbai, Delhi, or a 6-digit PIN code.`;
      }
    }
  }

  if (hospitalManualSearchBtn) {
    hospitalManualSearchBtn.addEventListener('click', handleManualHospitalSearch);
  }

  if (hospitalManualInput) {
    hospitalManualInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleManualHospitalSearch();
      }
    });
  }

  // 3. Preset City Chips
  hospitalPresetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      if (hospitalManualInput) hospitalManualInput.value = q;
      handleManualHospitalSearch();
    });
  });

  // 4. Radius Selector
  if (hospitalRadiusSelect) {
    hospitalRadiusSelect.addEventListener('change', (e) => {
      const newRadius = parseInt(e.target.value, 10) || 5;
      hospitalManager.searchRadiusKm = newRadius;
      if (lastHospitalSearchQuery) {
        executeHospitalSearch(
          lastHospitalSearchQuery.lat,
          lastHospitalSearchQuery.lon,
          lastHospitalSearchQuery.locationLabel,
          lastHospitalSearchQuery.sourceLabel
        );
      }
    });
  }

  // 5. Expand Radius Button in Empty State
  if (hospitalRetryExpandBtn) {
    hospitalRetryExpandBtn.addEventListener('click', () => {
      if (hospitalRadiusSelect) hospitalRadiusSelect.value = "25";
      hospitalManager.searchRadiusKm = 25;
      if (lastHospitalSearchQuery) {
        executeHospitalSearch(
          lastHospitalSearchQuery.lat,
          lastHospitalSearchQuery.lon,
          lastHospitalSearchQuery.locationLabel,
          lastHospitalSearchQuery.sourceLabel
        );
      }
    });
  }

  // 6. Retry Button in Error State
  if (hospitalErrorRetryBtn) {
    hospitalErrorRetryBtn.addEventListener('click', () => {
      if (lastHospitalSearchQuery) {
        executeHospitalSearch(
          lastHospitalSearchQuery.lat,
          lastHospitalSearchQuery.lon,
          lastHospitalSearchQuery.locationLabel,
          lastHospitalSearchQuery.sourceLabel
        );
      } else {
        handleManualHospitalSearch();
      }
    });
  }

  /* -------------------------------------------------------------
   * 3.7 Accessibility Controls (Font Scaling & High Contrast)
   * ----------------------------------------------------------- */
  function applyFontScale(scale) {
    state.fontScale = scale;
    localStorage.setItem('medibridge_font_scale', scale);
    document.body.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg', 'font-scale-xl');
    document.body.classList.add(`font-scale-${scale}`);
  }

  const fontScales = ['sm', 'md', 'lg', 'xl'];
  if (fontSizeDecBtn) {
    fontSizeDecBtn.addEventListener('click', () => {
      const currIdx = fontScales.indexOf(state.fontScale);
      if (currIdx > 0) {
        applyFontScale(fontScales[currIdx - 1]);
        showToast(`Text size: ${fontScales[currIdx - 1].toUpperCase()}`);
      }
    });
  }

  if (fontSizeIncBtn) {
    fontSizeIncBtn.addEventListener('click', () => {
      const currIdx = fontScales.indexOf(state.fontScale);
      if (currIdx < fontScales.length - 1) {
        applyFontScale(fontScales[currIdx + 1]);
        showToast(`Text size: ${fontScales[currIdx + 1].toUpperCase()}`);
      }
    });
  }

  function applyHighContrast(enabled) {
    state.highContrast = enabled;
    localStorage.setItem('medibridge_high_contrast', enabled);
    if (enabled) {
      document.body.classList.add('high-contrast-mode');
      if (toggleContrastBtn) toggleContrastBtn.textContent = '☀️';
    } else {
      document.body.classList.remove('high-contrast-mode');
      if (toggleContrastBtn) toggleContrastBtn.textContent = '🌓';
    }
  }

  if (toggleContrastBtn) {
    toggleContrastBtn.addEventListener('click', () => {
      applyHighContrast(!state.highContrast);
      showToast(state.highContrast ? "High Contrast Mode Enabled (WCAG AAA)" : "Standard Contrast Mode");
    });
  }

  /* -------------------------------------------------------------
   * 4. Multi-Language System
   * ----------------------------------------------------------- */
  function setLanguage(langCode) {
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === langCode) || SUPPORTED_LANGUAGES[0];
    state.currentLanguage = langCode;

    // Synchronize the header select element
    if (globalLangSelect) {
      globalLangSelect.value = langCode;
    }

    // Set HTML lang attribute
    document.documentElement.setAttribute('lang', langCode);

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
      if (translations && translations[key]) {
        el.textContent = translations[key];
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations && translations[key]) {
        el.placeholder = translations[key];
      }
    });

    // Re-render Quick Terms with localized names
    renderQuickTerms();

    // Re-render Sample Document buttons with localized labels
    renderSampleDocumentPills();

    // Re-render Language Hub Cards to show active status
    renderLanguageHubCards();

    // Re-render Regional emergency helplines & checklist
    renderRegionData();
    renderChecklist();

    // If a simplifier result is currently visible, refresh it in the new language!
    if (simplifierResultCard && !simplifierResultCard.classList.contains('hidden')) {
      performSimplification(state.lastSimplifiedQuery);
    }

    // If an explainer result is currently visible, refresh it in the new language!
    if (explainerResultsArea && !explainerResultsArea.classList.contains('hidden')) {
      analyzeCurrentDocument();
    }

    // Update Chat Welcome Message if user hasn't started a custom chat yet
    if (!state.hasUserChatted && chatMessagesContainer) {
      chatMessagesContainer.innerHTML = '';
      appendChatMessage('assistant', assistant.getWelcomeMessage(langCode));
    }

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
      // Refresh visible views
      if (simplifierResultCard && !simplifierResultCard.classList.contains('hidden')) {
        performSimplification(state.lastSimplifiedQuery);
      }
      if (explainerResultsArea && !explainerResultsArea.classList.contains('hidden')) {
        analyzeCurrentDocument();
      }
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
      "Tachycardia",
      "Bradycardia",
      "Edema",
      "Cardiomegaly",
      "Anemia",
      "Gastritis",
      "Gastroenteritis",
      "Myocardial Infarction",
      "Dyspnea on Exertion",
      "HbA1c (Hemoglobin A1c)",
      "Creatinine",
      "Neuropathy",
      "Osteoarthritis",
      "Vertigo",
      "Deep Vein Thrombosis (DVT)"
    ];

    popularTerms.forEach(term => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700 hover:bg-primary-100 hover:text-primary-800 transition-colors border border-slate-200';
      
      const localizedName = (state.currentLanguage !== 'en' && typeof TRANSLATION_CACHE !== 'undefined' && TRANSLATION_CACHE[term] && TRANSLATION_CACHE[term][state.currentLanguage])
        ? `${TRANSLATION_CACHE[term][state.currentLanguage]}`
        : term;

      chip.textContent = localizedName;
      chip.title = term;
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

    state.lastSimplifiedQuery = query;
    const result = simplifier.simplifyText(query, state.currentLanguage);
    if (!result) return;

    if (simplifierEmptyState) simplifierEmptyState.classList.add('hidden');
    if (simplifierResultCard) {
      simplifierResultCard.classList.remove('hidden');
      simplifierResultCard.classList.add('fade-in');
    }

    // Preserve and display original input
    if (resultOriginalComparison) {
      resultOriginalComparison.textContent = query;
    }

    // Cache current questions for Checklist integration
    state.currentSimplifierQuestions = result.doctorQuestions || [];

    // Render result card contents
    document.getElementById('result-term-title').textContent = result.term;
    document.getElementById('result-simple-name').textContent = result.simpleName;
    document.getElementById('result-category-badge').textContent = result.category;
    document.getElementById('result-what-it-means').innerHTML = result.whatItMeans;
    document.getElementById('result-analogy').textContent = result.analogy;
    document.getElementById('result-why-checked').textContent = result.whyChecked;

    const commonNameBadge = document.getElementById('result-common-name-badge');
    if (commonNameBadge) {
      commonNameBadge.textContent = result.commonName || result.simpleName;
    }

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

    // Bilingual mode card
    const bilingualBlock = document.getElementById('simplifier-bilingual-block');
    if (bilingualBlock) {
      if (state.bilingualMode && state.currentLanguage !== 'en') {
        bilingualBlock.classList.remove('hidden');
        const langObj = SUPPORTED_LANGUAGES.find(l => l.code === state.currentLanguage) || { native: state.currentLanguage };
        document.getElementById('bilingual-lang-name').textContent = "English Original Reference";
        const englishResult = simplifier.simplifyText(query, 'en');
        document.getElementById('bilingual-translated-text').textContent = englishResult ? englishResult.whatItMeans : "";
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

  if (clearSimplifierBtn) {
    clearSimplifierBtn.addEventListener('click', () => {
      if (simplifierInput) simplifierInput.value = '';
      if (simplifierResultCard) simplifierResultCard.classList.add('hidden');
      if (simplifierEmptyState) simplifierEmptyState.classList.remove('hidden');
      showToast("Simplifier reset.");
    });
  }

  if (voiceSimplifierBtn && assistant.recognition) {
    voiceSimplifierBtn.addEventListener('click', () => {
      try {
        const recognition = assistant.recognition;
        recognition.onstart = () => {
          voiceSimplifierBtn.classList.add('bg-red-500', 'text-white', 'animate-pulse');
          showToast("Listening... speak your medical term.");
        };
        recognition.onresult = (e) => {
          const spoken = e.results[0][0].transcript;
          if (simplifierInput) simplifierInput.value = spoken;
          performSimplification(spoken);
        };
        recognition.onend = () => {
          voiceSimplifierBtn.classList.remove('bg-red-500', 'text-white', 'animate-pulse');
        };
        recognition.start();
      } catch (err) {
        console.warn("Speech recognition error:", err);
      }
    });
  } else if (voiceSimplifierBtn) {
    voiceSimplifierBtn.title = "Voice recognition not supported in this browser";
    voiceSimplifierBtn.classList.add('opacity-40');
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

    const sampleLabels = {
      blood_panel: {
        en: 'Blood & Metabolic Panel',
        es: 'Análisis de Sangre y Perfil Metabólico',
        hi: 'रक्त व मेटाबॉलिक पैनल',
        bn: 'রক্ত ও মেটাবলিক প্যানেল',
        fr: 'Bilan Sanguin & Métabolique',
        zh: '血液生化及血脂全套',
        ar: 'تحليل الدم والتمثيل الغذائي',
        de: 'Blutbild & Stoffwechselprofil',
        pt: 'Exame de Sangue e Perfil Metabólico',
        tl: 'Pagsusuri sa Dugo at Metabolic',
        vi: 'Xét nghiệm máu & Chuyển hóa',
        ta: 'இரத்தப் பரிசோதனை அறிக்கை',
        kn: 'ರಕ್ತ ಮತ್ತು ಚಯಾಪಚಯ ಪರೀಕ್ಷಾ ವರದಿ',
        mr: 'रक्त व चयापचय तपासणी अहवाल',
        te: 'రక్త మరియు జీవక్రియ పరీక్ష నివేదిక'
      },
      radiology_xray: {
        en: 'Chest X-Ray Report',
        es: 'Informe de Radiografía de Tórax',
        hi: 'छाती का एक्स-रे रिपोर्ट',
        bn: 'বুকের এক্স-রে রিপোর্ট',
        fr: 'Rapport de Radiographie Thoracique',
        zh: '胸部X光放射报告',
        ar: 'تقرير أشعة الصدر',
        de: 'Thorax-Röntgenbefund',
        pt: 'Laudo de Raio-X do Tórax',
        tl: 'Ulat ng Chest X-Ray',
        vi: 'Kết quả X-quang phổi',
        ta: 'மார்பு எக்ஸ்-ரே அறிக்கை',
        kn: 'ಎದೆ ಎಕ್ಸ್-ರೇ ವರದಿ',
        mr: 'छातीचा एक्स-रे अहवाल',
        te: 'ఛాతీ ఎక్స్-రే నివేదిక'
      },
      discharge_summary: {
        en: 'Hospital Discharge Summary',
        es: 'Resumen de Alta Hospitalaria',
        hi: 'अस्पताल डिस्चार्ज सारांश',
        bn: 'হাসপাতাল ডিসচার্জ সামারি',
        fr: 'Compte-rendu d\'Hospitalisation',
        zh: '出院小结及医嘱',
        ar: 'ملخص الخروج من المستشفى',
        de: 'Krankenhaus-Entlassungsbrief',
        pt: 'Resumo de Alta Hospitalar',
        tl: 'Buod ng Paglabas sa Ospital',
        vi: 'Tóm tắt xuất viện',
        ta: 'டிஸ்சார்ஜ் சுருக்கம்',
        kn: 'ಆಸ್ಪತ್ರೆ ಡಿಸ್ಚಾರ್ಜ್ ಸಾರಾಂಶ',
        mr: 'हॉस्पिटल डिस्चार्ज सारांश',
        te: 'ఆసుపత్రి డిశ్చార్జ్ సారాంశం'
      },
      prescription_guide: {
        en: 'Prescription & Directions',
        es: 'Receta e Instrucciones',
        hi: 'दवा का पर्चा व निर्देश',
        bn: 'প্রেসক্রিপশন ও নির্দেশনা',
        fr: 'Ordonnance & Posologie',
        zh: '处方用药指导',
        ar: 'الوصفة الطبية والتعليمات',
        de: 'Rezept & Einnahmehinweise',
        pt: 'Receita e Instruções',
        tl: 'Reseta at mga Tagubilin',
        vi: 'Đơn thuốc & Hướng dẫn',
        ta: 'மருந்துச் சீட்டு வழிகாட்டி',
        kn: 'ಔಷಧಿ ಚೀಟಿ ಮತ್ತು ಸೂಚನೆಗಳು',
        mr: 'औषधोपचार आणि सूचना',
        te: 'మందుల ప్రిస్క్రిప్షన్ మరియు సూచనలు'
      }
    };

    const samples = [
      { id: 'blood_panel', icon: '🧪' },
      { id: 'radiology_xray', icon: '🩻' },
      { id: 'discharge_summary', icon: '🏥' },
      { id: 'prescription_guide', icon: '💊' }
    ];

    samples.forEach(s => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 text-slate-700 transition border border-slate-200 flex items-center gap-1.5';
      const label = (sampleLabels[s.id] && sampleLabels[s.id][state.currentLanguage]) || sampleLabels[s.id]['en'];
      btn.innerHTML = `<span>${s.icon}</span> <span>${label}</span>`;
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

    const analysis = explainer.analyzeDocument(rawText, state.currentLanguage);
    if (!analysis) return;

    if (!analysis.success) {
      if (explainerResultsArea) explainerResultsArea.classList.add('hidden');
      if (explainerErrorCard) {
        explainerErrorCard.classList.remove('hidden');
        if (explainerErrorTitle) {
          explainerErrorTitle.textContent = (analysis.classification && analysis.classification.status === 'unreadable')
            ? "Document Text Unreadable"
            : "Medical Content Not Detected";
        }
        if (explainerErrorMessage) {
          explainerErrorMessage.textContent = analysis.error;
        }
        explainerErrorCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      showToast(analysis.error, 4500);
      return;
    }

    // Success! Hide error card and show results
    if (explainerErrorCard) explainerErrorCard.classList.add('hidden');
    if (explainerResultsArea) {
      explainerResultsArea.classList.remove('hidden');
      explainerResultsArea.classList.add('fade-in');
    }

    // Render Type Badge & Summary
    document.getElementById('doc-badge-icon').textContent = analysis.docType.icon;
    document.getElementById('doc-badge-title').textContent = analysis.docType.label;
    document.getElementById('doc-plain-summary').innerHTML = formatMarkdownText(analysis.summary);

    // Render Key Findings or Clinical Narrative
    const findingsList = document.getElementById('doc-key-findings-list');
    if (findingsList) {
      findingsList.innerHTML = '';
      if (analysis.keyFindings && analysis.keyFindings.length > 0) {
        analysis.keyFindings.forEach(item => {
          const badgeColorClass = 
            item.statusType === 'warning' ? 'bg-amber-100 text-amber-800 border-amber-200' :
            item.statusType === 'normal' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
            item.statusType === 'danger' ? 'bg-rose-100 text-rose-800 border-rose-200' :
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
      } else if (analysis.clinicalNarrative && Object.keys(analysis.clinicalNarrative).length > 0) {
        Object.values(analysis.clinicalNarrative).forEach(narrative => {
          const row = document.createElement('div');
          row.className = 'p-3.5 rounded-lg border border-teal-100 bg-teal-50/50 hover:bg-white transition shadow-sm';
          row.innerHTML = `
            <div class="font-bold text-teal-900 text-sm mb-1">${narrative.label}</div>
            <p class="text-xs text-slate-700 leading-relaxed">${narrative.text}</p>
          `;
          findingsList.appendChild(row);
        });
      } else {
        findingsList.innerHTML = '<p class="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">No specific lab numbers or structured impression sections detected. Review the executive summary above.</p>';
      }
    }

    // Render Shorthand / Abbreviations
    const shorthandList = document.getElementById('doc-shorthand-list');
    if (shorthandList) {
      shorthandList.innerHTML = '';
      if (!analysis.shorthand || analysis.shorthand.length === 0) {
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
        document.getElementById('doc-bilingual-lang-name').textContent = "English Original Reference";
        const englishAnalysis = explainer.analyzeDocument(rawText, 'en');
        document.getElementById('doc-bilingual-summary').innerHTML = englishAnalysis ? formatMarkdownText(englishAnalysis.summary) : "";
      } else {
        docBilingualBlock.classList.add('hidden');
      }
    }

    // Cache current questions for Checklist integration
    state.currentDocQuestions = analysis.doctorQuestions || [];

    // Scroll smoothly to results
    explainerResultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast("Document analysis complete!");
  }

  if (analyzeDocBtn) {
    analyzeDocBtn.addEventListener('click', analyzeCurrentDocument);
  }

  if (clearDocBtn) {
    clearDocBtn.addEventListener('click', () => {
      if (explainerTextarea) explainerTextarea.value = '';
      if (explainerResultsArea) explainerResultsArea.classList.add('hidden');
      if (explainerErrorCard) explainerErrorCard.classList.add('hidden');
      showToast("Document cleared.");
    });
  }

  if (explainerTrySampleBtn) {
    explainerTrySampleBtn.addEventListener('click', () => {
      loadSampleDocument('blood_panel');
    });
  }

  if (explainerReuploadBtn && explainerFileInput) {
    explainerReuploadBtn.addEventListener('click', () => {
      explainerFileInput.click();
    });
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

  async function handleUploadedFile(file) {
    if (!file) return;

    // Check size limit: 15MB
    if (file.size > 15 * 1024 * 1024) {
      showToast("File exceeds 15MB limit. Please upload a smaller file or paste text.", 4000);
      if (explainerErrorCard && explainerErrorMessage) {
        explainerErrorCard.classList.remove('hidden');
        explainerErrorMessage.textContent = "The uploaded file exceeds the 15MB size limit. Please upload a smaller document.";
      }
      return;
    }

    showToast(`Reading file: ${file.name}`);

    // Text file (.txt, .csv, .md, text/*)
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.csv') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (explainerTextarea) {
          explainerTextarea.value = e.target.result;
          analyzeCurrentDocument();
        }
      };
      reader.onerror = () => {
        showToast("Error reading text file.", 3000);
      };
      reader.readAsText(file);
      return;
    }

    // PDF files
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      try {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          const arrayBuffer = await file.arrayBuffer();
          const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          let extractedText = '';

          for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageStr = textContent.items.map(item => item.str).join(' ');
            extractedText += pageStr + '\n';
          }

          if (extractedText.trim().length >= 25) {
            explainerTextarea.value = extractedText.trim();
            analyzeCurrentDocument();
            return;
          }
        }
      } catch (pdfErr) {
        console.warn("PDF extraction note:", pdfErr);
      }

      // If text extraction yielded no readable text (e.g. scanned image PDF without embedded text)
      if (explainerTextarea) explainerTextarea.value = '';
      if (explainerResultsArea) explainerResultsArea.classList.add('hidden');
      if (explainerErrorCard) {
        explainerErrorCard.classList.remove('hidden');
        if (explainerErrorTitle) explainerErrorTitle.textContent = "Scanned Image PDF Detected";
        if (explainerErrorMessage) explainerErrorMessage.textContent = "We couldn't extract text from this PDF because it appears to be a scanned image without an embedded text layer. Please copy and paste the report text into the box, or click 'Try a Sample Lab Report' below.";
      }
      showToast("Scanned PDF detected without readable text layer.", 4500);
      return;
    }

    // Image files (image/*)
    if (file.type.startsWith('image/')) {
      if (explainerTextarea) explainerTextarea.value = '';
      if (explainerResultsArea) explainerResultsArea.classList.add('hidden');
      if (explainerErrorCard) {
        explainerErrorCard.classList.remove('hidden');
        if (explainerErrorTitle) explainerErrorTitle.textContent = "Image Document Uploaded";
        if (explainerErrorMessage) explainerErrorMessage.textContent = "Local browser OCR is unavailable offline. For accurate analysis, please paste the printed report text directly into the box, or test with one of the sample reports below.";
      }
      showToast("Please copy and paste the report text for analysis.", 4000);
      return;
    }

    // Fallback for unknown binary file types
    if (explainerErrorCard) {
      explainerErrorCard.classList.remove('hidden');
      if (explainerErrorTitle) explainerErrorTitle.textContent = "Unsupported File Format";
      if (explainerErrorMessage) explainerErrorMessage.textContent = "Please upload a supported document (.txt, text PDF, or clinical document) or paste the text directly.";
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
  function appendChatMessage(sender, text, safetyBadge = null, urgent = false, followUps = []) {
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

      const followUpHtml = (followUps && followUps.length > 0)
        ? `
          <div class="mt-3 pt-2.5 border-t border-slate-100">
            <span class="text-[11px] font-semibold text-slate-500 block mb-1.5">Suggested Follow-Up Questions:</span>
            <div class="flex flex-wrap gap-1.5">
              ${followUps.map(f => `<button type="button" class="assistant-followup-pill text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-primary-50 hover:text-primary-800 hover:border-primary-300 text-slate-700 transition border border-slate-200 text-left">${escapeHtml(f)}</button>`).join('')}
            </div>
          </div>
        `
        : '';

      bubbleContent = `
        <div class="max-w-[90%] md:max-w-[80%] ${
          urgent ? 'bg-red-50/90 border-2 border-red-300' : 'bg-white border border-slate-200'
        } rounded-2xl rounded-tl-none p-4 text-sm text-slate-800 shadow-sm leading-relaxed">
          ${badgeHtml}
          <div class="chat-markdown-content">${formatMarkdownText(text)}</div>
          ${followUpHtml}
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
      // Follow-up suggestion pills
      messageDiv.querySelectorAll('.assistant-followup-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          handleSendChatMessage(pill.textContent.trim());
        });
      });
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

    state.hasUserChatted = true;
    if (chatInput) {
      chatInput.value = '';
      chatInput.style.height = 'auto';
    }

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
    const docContext = (explainer && explainer.currentAnalysis && explainer.currentAnalysis.rawText)
      ? explainer.currentAnalysis.rawText
      : null;

    setTimeout(async () => {
      const indicator = document.getElementById(typingId);
      if (indicator) indicator.remove();

      const response = await assistant.processMessage(text, state.currentLanguage, state.apiKey, docContext);
      if (response) {
        appendChatMessage('assistant', response.text, response.safetyBadge, response.urgentAction, response.followUps);
      }
    }, 450);
  }

  if (sendChatBtn) {
    sendChatBtn.addEventListener('click', () => handleSendChatMessage());
  }

  if (chatInput) {
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    });

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendChatMessage();
      }
    });
  }

  if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
      assistant.resetChat();
      if (chatMessagesContainer) {
        chatMessagesContainer.innerHTML = '';
        state.hasUserChatted = false;
        appendChatMessage('assistant', assistant.getWelcomeMessage(state.currentLanguage));
      }
      showToast("Started a new conversation session.");
    });
  }

  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', () => {
      assistant.resetChat();
      if (chatMessagesContainer) {
        chatMessagesContainer.innerHTML = '';
        state.hasUserChatted = false;
        appendChatMessage('assistant', assistant.getWelcomeMessage(state.currentLanguage));
      }
      showToast("Conversation cleared.");
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
  applyFontScale(state.fontScale);
  applyHighContrast(state.highContrast);
  setRegion(state.selectedRegion);
  renderChecklist();
  renderQuickTerms();
  renderSampleDocumentPills();
  renderLanguageHubCards();
  setLanguage(state.currentLanguage);

  // Load initial welcome chat message
  if (chatMessagesContainer && chatMessagesContainer.children.length === 0) {
    appendChatMessage('assistant', assistant.getWelcomeMessage(state.currentLanguage));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMediBridgeApp);
} else {
  initMediBridgeApp();
}
