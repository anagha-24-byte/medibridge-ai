/**
 * ==============================================================================
 * MediBridge AI - Main Application Controller
 * Handles Navigation, State, Authentication, Appointments, X-Ray, Blood Tests,
 * Document Explainer, Health Assistant, Nearby Hospitals, Language Hub, and WCAG Accessibility.
 * ==============================================================================
 */

function initMediBridgeApp() {
  // Core Modules
  const auth = window.authManager;
  const appointments = window.appointmentsManager;
  const xray = window.xrayManager;
  const bloodTest = window.bloodTestManager;
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
    selectedRegion: localStorage.getItem('medibridge_selected_region') || 'karnataka',
    highContrast: localStorage.getItem('medibridge_high_contrast') === 'true',
    fontScale: localStorage.getItem('medibridge_font_scale') || 'md',
    checklistFilter: 'all',
    checklistItems: JSON.parse(localStorage.getItem('medibridge_checklist_items') || 'null') || defaultChecklistItems
  };

  // DOM Elements - General
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

  // Accessibility
  const fontSizeDecBtn = document.getElementById('font-size-dec');
  const fontSizeIncBtn = document.getElementById('font-size-inc');
  const toggleContrastBtn = document.getElementById('toggle-contrast-btn');

  // Auth & Profile Elements
  const navAuthBtn = document.getElementById('nav-auth-btn');
  const navUserPill = document.getElementById('nav-user-pill');
  const navUserName = document.getElementById('nav-user-name');
  const loginModal = document.getElementById('login-modal');
  const closeLoginModalBtn = document.getElementById('close-login-modal-btn');
  const loginForm = document.getElementById('login-form');
  const loginNameInput = document.getElementById('login-name-input');
  const loginMobileInput = document.getElementById('login-mobile-input');
  const loginErrorText = document.getElementById('login-error-text');
  const historyModal = document.getElementById('history-modal');
  const closeHistoryModalBtn = document.getElementById('close-history-modal-btn');
  const historyUserInfo = document.getElementById('history-user-info');
  const historyItemsContainer = document.getElementById('history-items-container');
  const clearAllHistoryBtn = document.getElementById('clear-all-history-btn');
  const logoutBtn = document.getElementById('logout-btn');

  // Appointments Elements
  const appointmentForm = document.getElementById('appointment-form');
  const apptHospitalName = document.getElementById('appt-hospital-name');
  const apptHospitalAddress = document.getElementById('appt-hospital-address');
  const apptHospitalPhone = document.getElementById('appt-hospital-phone');
  const apptDate = document.getElementById('appt-date');
  const apptTime = document.getElementById('appt-time');
  const apptPurpose = document.getElementById('appt-purpose');
  const apptReminderToggle = document.getElementById('appt-reminder-toggle');
  const apptReminderInterval = document.getElementById('appt-reminder-interval');
  const apptReminderNote = document.getElementById('appt-reminder-note');

  // Explainer Elements
  const samplePillsContainer = document.getElementById('sample-pills-container');
  const explainerTextarea = document.getElementById('explainer-textarea');
  const analyzeDocBtn = document.getElementById('analyze-doc-btn');
  const clearDocBtn = document.getElementById('clear-doc-btn');
  const explainerDropzone = document.getElementById('explainer-dropzone');
  const explainerFileInput = document.getElementById('explainer-file-input');
  const explainerResultsArea = document.getElementById('explainer-results-area');
  const explainerErrorCard = document.getElementById('explainer-error-card');
  const explainerErrorMessage = document.getElementById('explainer-error-message');
  const explainerTrySampleBtn = document.getElementById('explainer-try-sample-btn');
  const explainerReuploadBtn = document.getElementById('explainer-reupload-btn');
  const explainerSaveHistoryChk = document.getElementById('explainer-save-history-chk');

  // X-Ray Elements
  const xrayDropzone = document.getElementById('xray-dropzone');
  const xrayFileInput = document.getElementById('xray-file-input');
  const xrayPreviewContainer = document.getElementById('xray-preview-container');
  const xrayPreviewImg = document.getElementById('xray-preview-img');
  const xrayFilename = document.getElementById('xray-filename');
  const xrayRemoveBtn = document.getElementById('xray-remove-btn');
  const xrayNotesInput = document.getElementById('xray-notes-input');
  const xraySaveHistoryChk = document.getElementById('xray-save-history-chk');
  const analyzeXrayBtn = document.getElementById('analyze-xray-btn');
  const xrayResultsCard = document.getElementById('xray-results-card');
  const xrayAnalysisContent = document.getElementById('xray-analysis-content');
  const xrayProviderBadge = document.getElementById('xray-provider-badge');

  // Blood Test Elements
  const bloodSampleMetabolicBtn = document.getElementById('blood-sample-metabolic-btn');
  const bloodtestTextarea = document.getElementById('bloodtest-textarea');
  const clearBloodtestBtn = document.getElementById('clear-bloodtest-btn');
  const analyzeBloodtestBtn = document.getElementById('analyze-bloodtest-btn');
  const bloodtestSaveHistoryChk = document.getElementById('bloodtest-save-history-chk');
  const bloodtestErrorCard = document.getElementById('bloodtest-error-card');
  const bloodtestErrorMessage = document.getElementById('bloodtest-error-message');
  const bloodtestResultsCard = document.getElementById('bloodtest-results-card');
  const bloodtestTableBody = document.getElementById('bloodtest-table-body');
  const bloodtestMeaningsContainer = document.getElementById('bloodtest-meanings-container');
  const bloodtestQuestionsList = document.getElementById('bloodtest-questions-list');

  // Hospitals Elements
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
  const hospitalCardsGrid = document.getElementById('hospital-cards-grid');
  const hospitalEmptyState = document.getElementById('hospital-empty-state');
  const hospitalRetryExpandBtn = document.getElementById('hospital-retry-expand-btn');
  const hospitalErrorState = document.getElementById('hospital-error-state');
  const hospitalErrorDesc = document.getElementById('hospital-error-desc');
  const hospitalErrorRetryBtn = document.getElementById('hospital-error-retry-btn');

  // Assistant Elements
  const chatMessagesContainer = document.getElementById('chat-messages-container');
  const chatUserInput = document.getElementById('chat-user-input');
  const sendChatBtn = document.getElementById('send-chat-btn');
  const voiceChatBtn = document.getElementById('voice-chat-btn');
  const clearChatBtn = document.getElementById('clear-chat-btn');
  const assistantSaveChatBtn = document.getElementById('assistant-save-chat-btn');
  const promptPills = document.querySelectorAll('.prompt-pill');

  // Checklist Elements
  const checklistItemsContainer = document.getElementById('checklist-items-container');
  const checklistNewInput = document.getElementById('checklist-new-input');
  const checklistCategorySelect = document.getElementById('checklist-category-select');
  const addChecklistItemBtn = document.getElementById('add-checklist-item-btn');
  const printChecklistBtn = document.getElementById('print-checklist-btn');

  // Region & Helplines
  const bannerStateSelect = document.getElementById('banner-state-select');
  const homeStateSelect = document.getElementById('home-state-select');
  const navigatorStateSelect = document.getElementById('navigator-state-select');
  const bannerEmergencyHotlines = document.getElementById('banner-emergency-hotlines');
  const homeStateHelplines = document.getElementById('home-state-helplines');
  const navigatorHelplineGrid = document.getElementById('navigator-helpline-grid');
  const navigatorHospitalsGrid = document.getElementById('navigator-hospitals-grid');
  const navigatorSchemesGrid = document.getElementById('navigator-schemes-grid');

  // Languages
  const languageCardsGrid = document.getElementById('language-cards-grid');
  const bilingualModeToggle = document.getElementById('bilingual-mode-toggle');

  // Helper: Toast Notifications
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast-show';
    setTimeout(() => {
      toast.className = 'hidden';
    }, 3200);
  }
  window.showAppToast = showToast;

  /* -------------------------------------------------------------
   * 1. Navigation & Section Router
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

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  window.navigateToSection = navigateTo;

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      navigateTo(target);
    });
  });

  document.querySelectorAll('[data-jump]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-jump');
      navigateTo(target);
    });
  });

  /* -------------------------------------------------------------
   * 2. Authentication & User Profile Management
   * ----------------------------------------------------------- */
  function updateAuthNavUI() {
    if (auth.isAuthenticated()) {
      navAuthBtn.classList.add('hidden');
      navUserPill.classList.remove('hidden');
      navUserName.textContent = auth.user.name.split(' ')[0];
    } else {
      navAuthBtn.classList.remove('hidden');
      navUserPill.classList.add('hidden');
    }
  }
  updateAuthNavUI();

  if (navAuthBtn) {
    navAuthBtn.addEventListener('click', () => {
      loginErrorText.classList.add('hidden');
      loginModal.classList.remove('hidden');
    });
  }

  if (closeLoginModalBtn) {
    closeLoginModalBtn.addEventListener('click', () => {
      loginModal.classList.add('hidden');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = loginNameInput.value.trim();
      const mobile = loginMobileInput.value.trim();

      const result = await auth.login(name, mobile);
      if (result.success) {
        loginModal.classList.add('hidden');
        updateAuthNavUI();
        appointments.loadAppointments();
        showToast(`Welcome, ${result.user.name}!`);
      } else {
        loginErrorText.textContent = result.error || 'Failed to sign in.';
        loginErrorText.classList.remove('hidden');
      }
    });
  }

  // Open User History Modal
  if (navUserPill) {
    navUserPill.addEventListener('click', async () => {
      if (!auth.isAuthenticated()) return;
      historyUserInfo.textContent = `Logged in: ${auth.user.name} (${auth.user.mobile})`;
      historyModal.classList.remove('hidden');
      await renderHistoryItems();
    });
  }

  if (closeHistoryModalBtn) {
    closeHistoryModalBtn.addEventListener('click', () => {
      historyModal.classList.add('hidden');
    });
  }

  async function renderHistoryItems() {
    if (!historyItemsContainer) return;
    historyItemsContainer.innerHTML = '<div class="py-6 text-center text-xs text-slate-400">Loading saved records...</div>';

    const items = await auth.getHistory();
    if (!items || items.length === 0) {
      historyItemsContainer.innerHTML = `
        <div class="py-8 text-center space-y-2 text-slate-500 text-xs">
          <div class="text-2xl">📁</div>
          <p class="font-bold">No saved health records yet.</p>
          <p class="text-[11px] text-slate-400">Save conversations, document explanations, or X-rays to revisit them here.</p>
        </div>
      `;
      return;
    }

    historyItemsContainer.innerHTML = items.map(it => {
      let icon = '📋';
      if (it.type === 'conversation') icon = '💬';
      if (it.type === 'xray') icon = '🩻';
      if (it.type === 'bloodtest') icon = '🩸';
      if (it.type === 'document') icon = '📑';

      const dateStr = new Date(it.timestamp).toLocaleString();
      return `
        <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-3 text-xs">
          <div class="space-y-1">
            <div class="flex items-center gap-1.5 font-bold text-slate-900">
              <span>${icon}</span>
              <span>${escapeHtml(it.title || 'Health Record')}</span>
              <span class="text-[10px] text-slate-400 font-normal">(${dateStr})</span>
            </div>
            <p class="text-[11px] text-slate-600 leading-snug line-clamp-2">${escapeHtml(it.summary || '')}</p>
          </div>
          <button type="button" class="delete-history-btn text-red-600 hover:text-red-800 text-[11px] font-semibold shrink-0" data-id="${it.id}">
            Delete
          </button>
        </div>
      `;
    }).join('');

    historyItemsContainer.querySelectorAll('.delete-history-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        await auth.deleteHistory(id);
        renderHistoryItems();
        showToast('Record deleted.');
      });
    });
  }

  if (clearAllHistoryBtn) {
    clearAllHistoryBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete all saved history? This cannot be undone.')) {
        await auth.clearAllHistory();
        renderHistoryItems();
        showToast('All history cleared.');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await auth.logout();
      historyModal.classList.add('hidden');
      updateAuthNavUI();
      appointments.loadAppointments();
      showToast('Signed out successfully.');
    });
  }

  /* -------------------------------------------------------------
   * 3. Appointments & Reminders
   * ----------------------------------------------------------- */
  // Set date picker minimum to today's date
  if (apptDate) {
    const today = new Date().toISOString().split('T')[0];
    apptDate.min = today;
  }

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const newApptData = {
        hospitalName: apptHospitalName.value.trim(),
        hospitalAddress: apptHospitalAddress.value.trim(),
        hospitalPhone: apptHospitalPhone.value.trim(),
        date: apptDate.value,
        time: apptTime.value,
        purpose: apptPurpose.value.trim(),
        reminderEnabled: apptReminderToggle.checked,
        reminderTime: apptReminderInterval.value,
        reminderNote: apptReminderNote.value.trim()
      };

      const result = await appointments.createAppointment(newApptData);
      if (result.success) {
        showToast('Appointment and reminder saved!');
        appointmentForm.reset();
        if (apptDate) apptDate.min = new Date().toISOString().split('T')[0];
      } else {
        alert(result.error || 'Failed to schedule appointment.');
      }
    });
  }

  /* -------------------------------------------------------------
   * 4. Medical Document Explainer
   * ----------------------------------------------------------- */
  function renderSampleDocumentPills() {
    if (!samplePillsContainer) return;
    samplePillsContainer.innerHTML = '';

    const availableSamples = [
      { id: 'blood_panel', label: 'Comprehensive Blood Panel', icon: '🧪' },
      { id: 'radiology_xray', label: 'Chest X-Ray Diagnostic Report', icon: '🩻' },
      { id: 'discharge_summary', label: 'Hospital Discharge Summary', icon: '🏥' },
      { id: 'prescription_directions', label: 'Outpatient Prescription Directions', icon: '💊' }
    ];

    availableSamples.forEach(s => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold hover:border-teal-400 hover:bg-teal-50 hover:text-teal-900 transition flex items-center gap-1.5 shadow-2xs';
      btn.innerHTML = `<span>${s.icon}</span> <span>${s.label}</span>`;
      btn.addEventListener('click', () => {
        const sampleDoc = explainer.getSample(s.id);
        if (sampleDoc && explainerTextarea) {
          explainerTextarea.value = sampleDoc.rawText;
          analyzeCurrentDocument();
        }
      });
      samplePillsContainer.appendChild(btn);
    });
  }
  renderSampleDocumentPills();

  if (explainerDropzone && explainerFileInput) {
    explainerDropzone.addEventListener('click', () => explainerFileInput.click());
    
    explainerDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      explainerDropzone.classList.add('border-teal-500', 'bg-teal-50/50');
    });

    explainerDropzone.addEventListener('dragleave', () => {
      explainerDropzone.classList.remove('border-teal-500', 'bg-teal-50/50');
    });

    explainerDropzone.addEventListener('drop', async (e) => {
      e.preventDefault();
      explainerDropzone.classList.remove('border-teal-500', 'bg-teal-50/50');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleExplainerFile(e.dataTransfer.files[0]);
      }
    });

    explainerFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleExplainerFile(e.target.files[0]);
      }
    });
  }

  async function handleExplainerFile(file) {
    if (file.type === 'application/pdf') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map(item => item.str).join(' ') + '\n';
        }
        explainerTextarea.value = fullText;
        analyzeCurrentDocument();
      } catch (err) {
        alert('Could not read text from this PDF file. Please ensure it is not password-protected.');
      }
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        explainerTextarea.value = e.target.result;
        analyzeCurrentDocument();
      };
      reader.readAsText(file);
    }
  }

  async function analyzeCurrentDocument() {
    const text = (explainerTextarea.value || '').trim();
    if (!text) {
      showToast('Please enter or upload document text first.');
      return;
    }

    if (explainerErrorCard) explainerErrorCard.classList.add('hidden');
    if (explainerResultsArea) explainerResultsArea.classList.add('hidden');

    const result = explainer.analyzeDocument(text, state.currentLanguage);
    if (!result.success) {
      if (explainerErrorCard && explainerErrorMessage) {
        explainerErrorMessage.textContent = result.error;
        explainerErrorCard.classList.remove('hidden');
      }
      return;
    }

    // Save to history if checked
    if (explainerSaveHistoryChk && explainerSaveHistoryChk.checked && auth.isAuthenticated()) {
      auth.saveHistory('document', result.docType?.label || 'Medical Document', result.summary?.overview || text.substring(0, 150));
    }

    renderExplainerResults(result);
  }

  function renderExplainerResults(analysis) {
    if (!explainerResultsArea) return;
    explainerResultsArea.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6';

    let findingsHtml = '';
    if (analysis.keyFindings && analysis.keyFindings.length > 0) {
      findingsHtml = `
        <div class="space-y-3">
          <h4 class="font-bold text-slate-900 text-sm">Extracted Findings & Lab Targets</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${analysis.keyFindings.map(f => `
              <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-xs text-slate-800">${escapeHtml(f.metric)}</span>
                  <span class="text-xs font-black ${f.statusType === 'warning' ? 'text-amber-600' : 'text-emerald-700'}">${escapeHtml(f.value)}</span>
                </div>
                <div class="text-[11px] text-slate-500">${escapeHtml(f.referenceRange)}</div>
                <div class="text-[11px] text-slate-600 leading-snug">${escapeHtml(f.meaning)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <div class="flex items-center gap-2">
          <span class="text-2xl">${analysis.docType?.icon || '📑'}</span>
          <div>
            <h3 class="font-bold text-slate-900 text-base">${escapeHtml(analysis.docType?.label || 'Clinical Report')}</h3>
            <span class="text-xs text-slate-500">Verified Medical Content</span>
          </div>
        </div>
        <button type="button" onclick="window.print()" class="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition">
          🖨️ Print
        </button>
      </div>

      <div class="space-y-2">
        <h4 class="font-bold text-slate-900 text-sm">Plain-Language Summary</h4>
        <p class="text-xs md:text-sm text-slate-700 leading-relaxed">${escapeHtml(analysis.summary?.overview || '')}</p>
      </div>

      ${findingsHtml}

      <div class="p-4 rounded-xl bg-teal-50 border border-teal-200 space-y-2">
        <h4 class="font-bold text-teal-900 text-xs flex items-center gap-1.5">
          <span>💬</span> <span>Questions for Your Doctor:</span>
        </h4>
        <ul class="text-xs text-teal-800 list-disc list-inside space-y-1">
          ${(analysis.doctorQuestions || []).map(q => `<li>${escapeHtml(q)}</li>`).join('')}
        </ul>
      </div>

      <div class="p-3.5 rounded-xl bg-slate-100 text-slate-500 text-[11px] leading-relaxed">
        <strong>Reference Range Notice:</strong> Reference ranges differ across laboratories and equipment. Values outside standard thresholds must be evaluated by your physician in full clinical context.
      </div>
    `;

    explainerResultsArea.appendChild(card);
    explainerResultsArea.classList.remove('hidden');
  }

  if (analyzeDocBtn) analyzeDocBtn.addEventListener('click', analyzeCurrentDocument);
  if (clearDocBtn) clearDocBtn.addEventListener('click', () => {
    explainerTextarea.value = '';
    if (explainerResultsArea) explainerResultsArea.classList.add('hidden');
    if (explainerErrorCard) explainerErrorCard.classList.add('hidden');
  });

  /* -------------------------------------------------------------
   * 5. Dedicated X-Ray Analysis
   * ----------------------------------------------------------- */
  if (xrayDropzone && xrayFileInput) {
    xrayDropzone.addEventListener('click', () => xrayFileInput.click());

    xrayDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      xrayDropzone.classList.add('border-indigo-500', 'bg-indigo-50/50');
    });

    xrayDropzone.addEventListener('dragleave', () => {
      xrayDropzone.classList.remove('border-indigo-500', 'bg-indigo-50/50');
    });

    xrayDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      xrayDropzone.classList.remove('border-indigo-500', 'bg-indigo-50/50');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleXrayFile(e.dataTransfer.files[0]);
      }
    });

    xrayFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleXrayFile(e.target.files[0]);
      }
    });
  }

  async function handleXrayFile(file) {
    const val = xray.validateImageFile(file);
    if (!val.valid) {
      alert(val.error);
      return;
    }

    const base64 = await xray.loadImageFile(file);
    xrayPreviewImg.src = base64;
    xrayFilename.textContent = file.name;
    xrayDropzone.classList.add('hidden');
    xrayPreviewContainer.classList.remove('hidden');
  }

  if (xrayRemoveBtn) {
    xrayRemoveBtn.addEventListener('click', () => {
      xray.clearImage();
      xrayPreviewContainer.classList.add('hidden');
      xrayDropzone.classList.remove('hidden');
      if (xrayResultsCard) xrayResultsCard.classList.add('hidden');
    });
  }

  if (analyzeXrayBtn) {
    analyzeXrayBtn.addEventListener('click', async () => {
      if (!xray.currentImageBase64) {
        showToast('Please upload an X-ray image first.');
        return;
      }

      analyzeXrayBtn.disabled = true;
      analyzeXrayBtn.innerHTML = '<span class="animate-spin mr-1">⏳</span> Analyzing Image...';

      const notes = xrayNotesInput ? xrayNotesInput.value : '';
      const saveHist = xraySaveHistoryChk ? xraySaveHistoryChk.checked : false;

      const result = await xray.analyzeXray(notes, saveHist);
      analyzeXrayBtn.disabled = false;
      analyzeXrayBtn.innerHTML = '<span>🩻</span> <span>Analyze X-Ray Image</span>';

      if (!result.success) {
        alert(result.message || 'X-ray analysis failed.');
        return;
      }

      if (xrayAnalysisContent) {
        xrayAnalysisContent.innerHTML = formatMarkdown(result.analysis);
      }
      if (xrayProviderBadge && result.provider) {
        xrayProviderBadge.textContent = result.provider;
      }
      if (xrayResultsCard) {
        xrayResultsCard.classList.remove('hidden');
      }
    });
  }

  /* -------------------------------------------------------------
   * 6. Dedicated Blood Test Analysis
   * ----------------------------------------------------------- */
  if (bloodSampleMetabolicBtn) {
    bloodSampleMetabolicBtn.addEventListener('click', () => {
      const sample = explainer.getSample('blood_panel');
      if (sample && bloodtestTextarea) {
        bloodtestTextarea.value = sample.rawText;
        analyzeBloodTest();
      }
    });
  }

  async function analyzeBloodTest() {
    const text = (bloodtestTextarea.value || '').trim();
    if (!text) {
      showToast('Please paste or enter blood test report text.');
      return;
    }

    if (bloodtestErrorCard) bloodtestErrorCard.classList.add('hidden');
    if (bloodtestResultsCard) bloodtestResultsCard.classList.add('hidden');

    analyzeBloodtestBtn.disabled = true;
    analyzeBloodtestBtn.innerHTML = '<span class="animate-spin mr-1">⏳</span> Processing...';

    const saveHist = bloodtestSaveHistoryChk ? bloodtestSaveHistoryChk.checked : false;
    const result = await bloodTest.processReport(text, 'Blood Test Panel', saveHist);

    analyzeBloodtestBtn.disabled = false;
    analyzeBloodtestBtn.innerHTML = '<span>🩸</span> <span>Analyze Blood Test</span>';

    if (!result.success) {
      if (bloodtestErrorCard && bloodtestErrorMessage) {
        bloodtestErrorMessage.textContent = result.message;
        bloodtestErrorCard.classList.remove('hidden');
      }
      return;
    }

    renderBloodTestResults(result);
  }

  function renderBloodTestResults(result) {
    if (!bloodtestResultsCard || !bloodtestTableBody) return;

    const values = result.extractedValues || [];
    if (values.length === 0) {
      bloodtestTableBody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-slate-500">No matching standard blood test parameters found.</td></tr>`;
    } else {
      bloodtestTableBody.innerHTML = values.map(v => {
        let flagBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">NORMAL</span>';
        if (v.flag === 'HIGH') flagBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">ELEVATED</span>';
        if (v.flag === 'LOW') flagBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">LOW</span>';

        return `
          <tr class="hover:bg-slate-50/50">
            <td class="p-3 font-bold text-slate-900">${escapeHtml(v.name || v.testName)}</td>
            <td class="p-3 font-semibold text-slate-800">${escapeHtml(v.value)} ${escapeHtml(v.unit || '')}</td>
            <td class="p-3 text-slate-600">${escapeHtml(v.referenceRange)}</td>
            <td class="p-3">${flagBadge}</td>
          </tr>
        `;
      }).join('');
    }

    if (bloodtestMeaningsContainer) {
      bloodtestMeaningsContainer.innerHTML = values.map(v => `
        <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs space-y-1">
          <div class="font-bold text-slate-900">${escapeHtml(v.name || v.testName)}</div>
          <p class="text-slate-600 leading-snug">${escapeHtml(v.meaning)}</p>
        </div>
      `).join('');
    }

    if (bloodtestQuestionsList) {
      bloodtestQuestionsList.innerHTML = `
        <li>Are any elevated or low values significant given my overall health history?</li>
        <li>Should this lab test be repeated in 3 to 6 months to check for trends?</li>
        <li>Do any current medications, dietary habits, or hydration levels influence these results?</li>
      `;
    }

    bloodtestResultsCard.classList.remove('hidden');
  }

  if (analyzeBloodtestBtn) analyzeBloodtestBtn.addEventListener('click', analyzeBloodTest);
  if (clearBloodtestBtn) clearBloodtestBtn.addEventListener('click', () => {
    bloodtestTextarea.value = '';
    if (bloodtestResultsCard) bloodtestResultsCard.classList.add('hidden');
    if (bloodtestErrorCard) bloodtestErrorCard.classList.add('hidden');
  });

  /* -------------------------------------------------------------
   * 7. Nearby Hospitals Engine
   * ----------------------------------------------------------- */
  async function searchHospitalsByLocation(lat, lon, label, source) {
    if (!hospitalCardsGrid) return;

    if (hospitalLoadingState) hospitalLoadingState.classList.remove('hidden');
    if (hospitalCardsGrid) hospitalCardsGrid.innerHTML = '';
    if (hospitalEmptyState) hospitalEmptyState.classList.add('hidden');
    if (hospitalErrorState) hospitalErrorState.classList.add('hidden');
    if (hospitalResultsHeader) hospitalResultsHeader.classList.add('hidden');

    if (hospitalActiveLocationBanner && hospitalActiveTargetText) {
      hospitalActiveTargetText.textContent = label;
      if (hospitalActiveSourceBadge) hospitalActiveSourceBadge.textContent = source;
      hospitalActiveLocationBanner.classList.remove('hidden');
    }

    const radiusKm = parseInt(hospitalRadiusSelect ? hospitalRadiusSelect.value : '10', 10);

    try {
      const results = await hospitalManager.getNearbyHospitals(lat, lon, radiusKm);
      if (hospitalLoadingState) hospitalLoadingState.classList.add('hidden');

      if (!results || results.length === 0) {
        if (hospitalEmptyState) hospitalEmptyState.classList.remove('hidden');
        return;
      }

      if (hospitalResultsHeader && hospitalCountBadge) {
        hospitalCountBadge.textContent = results.length;
        hospitalResultsHeader.classList.remove('hidden');
      }

      hospitalCardsGrid.innerHTML = results.map(h => {
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`;
        return `
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-rose-400 hover:shadow-sm transition flex flex-col justify-between space-y-4">
            <div class="space-y-1.5">
              <div class="flex items-start justify-between gap-2">
                <h4 class="font-bold text-slate-900 text-sm leading-tight">${escapeHtml(h.name)}</h4>
                ${h.distance ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">~${h.distance} km</span>` : ''}
              </div>
              <p class="text-xs text-slate-500">${escapeHtml(h.category || 'Hospital')}</p>
              <p class="text-[11px] text-slate-600 leading-snug">📍 ${escapeHtml(h.address || 'Address not listed')}</p>
            </div>

            <div class="space-y-2 pt-2 border-t border-slate-100 text-xs">
              ${h.phone ? `
                <div class="flex items-center justify-between">
                  <span class="text-slate-500 text-[11px]">Contact:</span>
                  <a href="tel:${escapeHtml(h.phone)}" class="text-emerald-700 font-bold hover:underline">📞 ${escapeHtml(h.phone)}</a>
                </div>
              ` : '<div class="text-[11px] text-slate-400 italic">Direct phone not in directory</div>'}

              <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition">
                  🗺️ Directions
                </a>
                <button type="button" class="plan-hosp-appt-btn px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs" data-hosp='${JSON.stringify({ name: h.name, address: h.address, phone: h.phone }).replace(/'/g, "&apos;")}'>
                  📅 Plan Appointment
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Attach appointment planner buttons
      hospitalCardsGrid.querySelectorAll('.plan-hosp-appt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          try {
            const raw = e.currentTarget.getAttribute('data-hosp');
            const hospObj = JSON.parse(raw);
            appointments.selectHospitalForAppointment(hospObj);
          } catch (err) {
            console.error('Failed to parse hospital data:', err);
          }
        });
      });

    } catch (err) {
      if (hospitalLoadingState) hospitalLoadingState.classList.add('hidden');
      if (hospitalErrorState) {
        hospitalErrorState.classList.remove('hidden');
        if (hospitalErrorDesc) hospitalErrorDesc.textContent = err.message;
      }
    }
  }

  // GPS Geolocation Button
  if (hospitalUseGpsBtn) {
    hospitalUseGpsBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
      }

      hospitalGpsLabel.textContent = 'Acquiring GPS coordinates...';
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          hospitalGpsLabel.textContent = 'Use My Current Location';
          searchHospitalsByLocation(pos.coords.latitude, pos.coords.longitude, 'Current GPS Location', 'Browser Geolocation API');
        },
        (err) => {
          hospitalGpsLabel.textContent = 'Use My Current Location';
          alert(`Location permission denied or timed out (${err.message}). Please use manual city search below.`);
        },
        { timeout: 10000, enableHighAccuracy: false }
      );
    });
  }

  // Manual City / PIN search
  if (hospitalManualSearchBtn) {
    hospitalManualSearchBtn.addEventListener('click', async () => {
      const query = (hospitalManualInput.value || '').trim();
      if (!query) {
        showToast('Please enter a city or postal PIN code.');
        return;
      }

      hospitalManualSearchBtn.disabled = true;
      hospitalManualSearchBtn.textContent = 'Searching...';

      const loc = await hospitalManager.resolveLocationQuery(query);
      hospitalManualSearchBtn.disabled = false;
      hospitalManualSearchBtn.textContent = 'Search';

      if (!loc) {
        alert(`Could not resolve location "${query}". Please check the spelling or try a major city.`);
        return;
      }

      searchHospitalsByLocation(loc.lat, loc.lon, loc.name, loc.source);
    });
  }

  // Quick Preset Chips
  hospitalPresetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const city = chip.getAttribute('data-city');
      if (hospitalManualInput) hospitalManualInput.value = city;
      if (hospitalManualSearchBtn) hospitalManualSearchBtn.click();
    });
  });

  /* -------------------------------------------------------------
   * 8. Conversational Health Assistant
   * ----------------------------------------------------------- */
  function appendChatMessage(role, text, offerHospital = false) {
    if (!chatMessagesContainer) return;

    const isUser = (role === 'user');
    const msgDiv = document.createElement('div');
    msgDiv.className = `flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`;

    const formattedContent = formatMarkdown(text);

    let hospitalFollowUpHtml = '';
    if (!isUser && offerHospital) {
      hospitalFollowUpHtml = `
        <div class="mt-3 p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>Would you like help finding a nearby hospital or planning an appointment?</span>
          <button type="button" class="chat-find-hosp-btn px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-2xs whitespace-nowrap self-start sm:self-auto">
            🏥 Find Hospitals
          </button>
        </div>
      `;
    }

    msgDiv.innerHTML = `
      <div class="max-w-[85%] rounded-2xl p-4 text-xs md:text-sm ${
        isUser 
          ? 'bg-primary-600 text-white shadow-xs' 
          : 'bg-slate-50 border border-slate-200 text-slate-800 shadow-2xs'
      }">
        <div class="leading-relaxed chat-markdown-content">${formattedContent}</div>
        ${hospitalFollowUpHtml}
      </div>
    `;

    chatMessagesContainer.appendChild(msgDiv);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

    // Attach hospital follow-up button listener
    const hospBtn = msgDiv.querySelector('.chat-find-hosp-btn');
    if (hospBtn) {
      hospBtn.addEventListener('click', () => {
        navigateTo('hospitals');
      });
    }
  }

  async function handleUserChatMessage() {
    const text = (chatUserInput.value || '').trim();
    if (!text) return;

    appendChatMessage('user', text);
    chatUserInput.value = '';

    // Typing feedback
    const typingId = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = typingId;
    typingDiv.className = 'flex gap-2 items-center text-xs text-slate-400 p-2 italic';
    typingDiv.innerHTML = '<span class="animate-pulse">● ● ●</span> Generating evidence-based response...';
    chatMessagesContainer.appendChild(typingDiv);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

    const response = await assistant.processMessage(text, state.currentLanguage, state.apiKey);

    const el = document.getElementById(typingId);
    if (el) el.remove();

    if (response) {
      appendChatMessage('assistant', response.text, response.offerHospitalAssistance);
    }
  }

  if (sendChatBtn) sendChatBtn.addEventListener('click', handleUserChatMessage);
  if (chatUserInput) {
    chatUserInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleUserChatMessage();
    });
  }

  promptPills.forEach(pill => {
    pill.addEventListener('click', () => {
      if (chatUserInput) {
        chatUserInput.value = pill.textContent.trim();
        handleUserChatMessage();
      }
    });
  });

  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', () => {
      assistant.resetChat();
      chatMessagesContainer.innerHTML = '';
      appendChatMessage('assistant', assistant.getWelcomeMessage(state.currentLanguage));
    });
  }

  if (assistantSaveChatBtn) {
    assistantSaveChatBtn.addEventListener('click', () => {
      if (!auth.isAuthenticated()) {
        showToast('Please sign in to save your chat history.');
        loginModal.classList.remove('hidden');
        return;
      }
      auth.saveHistory('conversation', 'Health Assistant Consultation', 'Conversation saved from Health Assistant.');
      showToast('Conversation saved to your profile!');
    });
  }

  // Voice Chat
  if (voiceChatBtn && assistant.recognition) {
    voiceChatBtn.addEventListener('click', () => {
      try {
        assistant.recognition.start();
        voiceChatBtn.classList.add('bg-rose-100', 'text-rose-700');
        assistant.recognition.onresult = (e) => {
          chatUserInput.value = e.results[0][0].transcript;
          voiceChatBtn.classList.remove('bg-rose-100', 'text-rose-700');
        };
        assistant.recognition.onerror = () => {
          voiceChatBtn.classList.remove('bg-rose-100', 'text-rose-700');
        };
      } catch {}
    });
  }

  // Welcome message in chat
  appendChatMessage('assistant', assistant.getWelcomeMessage(state.currentLanguage));

  /* -------------------------------------------------------------
   * 9. Doctor Action Checklist
   * ----------------------------------------------------------- */
  function renderChecklist() {
    if (!checklistItemsContainer) return;
    checklistItemsContainer.innerHTML = '';

    state.checklistItems.forEach(item => {
      const div = document.createElement('div');
      div.className = 'p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs';
      div.innerHTML = `
        <div class="flex items-center gap-2.5">
          <input type="checkbox" ${item.completed ? 'checked' : ''} class="checklist-toggle w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" data-id="${item.id}">
          <span class="${item.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}">${escapeHtml(item.text)}</span>
        </div>
        <button type="button" class="delete-checklist-btn text-red-500 hover:text-red-700 font-bold text-xs" data-id="${item.id}">✕</button>
      `;
      checklistItemsContainer.appendChild(div);
    });

    checklistItemsContainer.querySelectorAll('.checklist-toggle').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'), 10);
        const it = state.checklistItems.find(i => i.id === id);
        if (it) {
          it.completed = e.target.checked;
          localStorage.setItem('medibridge_checklist_items', JSON.stringify(state.checklistItems));
          renderChecklist();
        }
      });
    });

    checklistItemsContainer.querySelectorAll('.delete-checklist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'), 10);
        state.checklistItems = state.checklistItems.filter(i => i.id !== id);
        localStorage.setItem('medibridge_checklist_items', JSON.stringify(state.checklistItems));
        renderChecklist();
      });
    });
  }
  renderChecklist();

  if (addChecklistItemBtn && checklistNewInput) {
    addChecklistItemBtn.addEventListener('click', () => {
      const text = checklistNewInput.value.trim();
      if (!text) return;
      state.checklistItems.push({
        id: Date.now(),
        text,
        category: checklistCategorySelect ? checklistCategorySelect.value : 'doctor',
        completed: false
      });
      localStorage.setItem('medibridge_checklist_items', JSON.stringify(state.checklistItems));
      checklistNewInput.value = '';
      renderChecklist();
      showToast('Item added to checklist.');
    });
  }

  if (printChecklistBtn) {
    printChecklistBtn.addEventListener('click', () => window.print());
  }

  /* -------------------------------------------------------------
   * 10. Language Hub & Localization
   * ----------------------------------------------------------- */
  function renderLanguageHub() {
    if (!languageCardsGrid) return;
    languageCardsGrid.innerHTML = '';

    SUPPORTED_LANGUAGES.forEach(lang => {
      const isCurrent = (lang.code === state.currentLanguage);
      const card = document.createElement('div');
      card.className = `p-4 rounded-xl border cursor-pointer transition ${
        isCurrent ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-400' : 'bg-white border-slate-200 hover:border-primary-300'
      }`;
      card.innerHTML = `
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-2xl">${lang.flag}</span>
          ${isCurrent ? '<span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary-100 text-primary-800">Active</span>' : ''}
        </div>
        <div class="font-bold text-slate-800 text-sm">${lang.native}</div>
        <div class="text-[11px] text-slate-500">${lang.name}</div>
      `;
      card.addEventListener('click', () => setLanguage(lang.code));
      languageCardsGrid.appendChild(card);
    });
  }
  renderLanguageHub();

  function setLanguage(langCode) {
    state.currentLanguage = langCode;
    if (globalLangSelect) globalLangSelect.value = langCode;

    // RTL support for Arabic
    if (langCode === 'ar') {
      document.body.classList.add('rtl-layout');
    } else {
      document.body.classList.remove('rtl-layout');
    }

    // Apply translations to UI elements
    const translations = (typeof UI_TRANSLATIONS !== 'undefined' && UI_TRANSLATIONS[langCode]) 
      ? UI_TRANSLATIONS[langCode] 
      : UI_TRANSLATIONS['en'];

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations && translations[key]) {
        el.textContent = translations[key];
      }
    });

    renderLanguageHub();
    showToast(`Language switched to ${langCode.toUpperCase()}`);
  }

  if (globalLangSelect) {
    globalLangSelect.addEventListener('change', (e) => setLanguage(e.target.value));
  }

  /* -------------------------------------------------------------
   * 11. Regional Hotlines & Safety Modal
   * ----------------------------------------------------------- */
  const REGIONAL_HOTLINES = {
    karnataka: [
      { name: "Arogya Kavacha", number: "108", type: "Ambulance" },
      { name: "Arogyavani", number: "104", type: "Advisory" },
      { name: "Unified Emergency", number: "112", type: "Police / Fire / EMS" }
    ],
    maharashtra: [
      { name: "MEMS Ambulance", number: "108", type: "Ambulance" },
      { name: "Health Advisory", number: "104", type: "Advisory" },
      { name: "Unified Emergency", number: "112", type: "Emergency" }
    ],
    delhi: [
      { name: "CATS Ambulance", number: "102", type: "Ambulance" },
      { name: "Delhi Emergency", number: "112", type: "Unified Dispatch" }
    ],
    national_india: [
      { name: "National Ambulance", number: "108", type: "Ambulance" },
      { name: "Tele-MANAS (Mental Health)", number: "14416", type: "Helpline" },
      { name: "National Emergency", number: "112", type: "Unified Dispatch" }
    ]
  };

  function renderRegionHelplines(regionKey) {
    const list = REGIONAL_HOTLINES[regionKey] || REGIONAL_HOTLINES['karnataka'];

    if (bannerEmergencyHotlines) {
      bannerEmergencyHotlines.innerHTML = list.map(h => `
        <a href="tel:${h.number}" class="bg-amber-600/40 hover:bg-amber-600/60 px-2 py-0.5 rounded font-bold text-slate-950 transition">
          📞 ${h.name} (${h.number})
        </a>
      `).join('');
    }

    if (homeStateHelplines) {
      homeStateHelplines.innerHTML = list.map(h => `
        <a href="tel:${h.number}" class="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg text-xs font-bold transition flex items-center gap-1">
          <span>📞</span> <span>${h.name}: ${h.number}</span>
        </a>
      `).join('');
    }
  }
  renderRegionHelplines('karnataka');

  if (bannerStateSelect) {
    bannerStateSelect.addEventListener('change', (e) => renderRegionHelplines(e.target.value));
  }
  if (homeStateSelect) {
    homeStateSelect.addEventListener('change', (e) => renderRegionHelplines(e.target.value));
  }

  // Safety Modal
  openSafetyModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (safetyModal) safetyModal.classList.remove('hidden');
    });
  });
  if (closeSafetyModalBtn) {
    closeSafetyModalBtn.addEventListener('click', () => {
      if (safetyModal) safetyModal.classList.add('hidden');
    });
  }

  // Dismiss Banner
  if (dismissBannerBtn && safetyBanner) {
    dismissBannerBtn.addEventListener('click', () => {
      safetyBanner.classList.add('hidden');
    });
  }

  // Settings Modal & Backend Health Check
  if (openSettingsBtn && settingsModal) {
    openSettingsBtn.addEventListener('click', async () => {
      settingsModal.classList.remove('hidden');
      const statusEl = document.getElementById('settings-backend-status');
      if (statusEl) {
        statusEl.textContent = 'Checking /api/health...';
        try {
          const res = await fetch('/api/health');
          if (res.ok) {
            const data = await res.json();
            statusEl.innerHTML = `🟢 <strong>Online</strong>: ${data.server} (AI: ${data.aiProvider})`;
          } else {
            statusEl.innerHTML = `🟡 <strong>Server responded with HTTP ${res.status}</strong>`;
          }
        } catch {
          statusEl.innerHTML = `⚪ <strong>Offline / Standalone</strong> (Static preview mode)`;
        }
      }
    });
  }
  if (closeSettingsBtn && settingsModal) {
    closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
  }
  if (saveApiKeyBtn && apiKeyInput) {
    saveApiKeyBtn.addEventListener('click', () => {
      const key = apiKeyInput.value.trim();
      state.apiKey = key;
      localStorage.setItem('medibridge_gemini_api_key', key);
      settingsModal.classList.add('hidden');
      showToast('Settings saved.');
    });
  }

  /* -------------------------------------------------------------
   * 12. Accessibility: Font Scaling & High Contrast
   * ----------------------------------------------------------- */
  let fontScaleStep = 0;
  if (fontSizeIncBtn) {
    fontSizeIncBtn.addEventListener('click', () => {
      if (fontScaleStep < 2) {
        fontScaleStep++;
        document.documentElement.style.fontSize = `${100 + fontScaleStep * 10}%`;
        showToast(`Text size increased (${100 + fontScaleStep * 10}%)`);
      }
    });
  }
  if (fontSizeDecBtn) {
    fontSizeDecBtn.addEventListener('click', () => {
      if (fontScaleStep > -1) {
        fontScaleStep--;
        document.documentElement.style.fontSize = `${100 + fontScaleStep * 10}%`;
        showToast(`Text size decreased (${100 + fontScaleStep * 10}%)`);
      }
    });
  }
  if (toggleContrastBtn) {
    toggleContrastBtn.addEventListener('click', () => {
      state.highContrast = !state.highContrast;
      document.body.classList.toggle('high-contrast', state.highContrast);
      localStorage.setItem('medibridge_high_contrast', state.highContrast ? 'true' : 'false');
      showToast(state.highContrast ? 'WCAG AAA High Contrast Enabled' : 'Normal Contrast Restored');
    });
  }
  if (state.highContrast) {
    document.body.classList.add('high-contrast');
  }

  // Pre-load initial appointments
  appointments.loadAppointments();
}

// Format Simple Markdown for Chat & AI Output
function formatMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/^### (.*$)/gim, '<h4 class="font-bold text-slate-900 text-sm mt-3 mb-1">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 class="font-bold text-slate-900 text-base mt-4 mb-2">$1</h3>')
    .replace(/^# (.*$)/gim, '<h2 class="font-black text-slate-900 text-lg mt-4 mb-2">$1</h2>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code class="bg-slate-200 px-1 py-0.5 rounded text-[11px] font-mono">$1</code>')
    .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n/gim, '<br>');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Auto-run on DOM load
document.addEventListener('DOMContentLoaded', initMediBridgeApp);
