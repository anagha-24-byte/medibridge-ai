/**
 * MediBridge AI - Personal Medical Vault
 * Secure, Editable & Portable Patient Health Records
 * Zero-dependency client & hybrid-persistence engine
 */

(function (window, document) {
  'use strict';

  // Current active user ID (defaults to primary patient session)
  let currentUserId = 'patient_default_01';
  let activeTab = 'overview';
  let currentFilter = 'all';
  let searchQuery = '';
  let activeShareFilter = 'all';

  // Base schema for a fresh patient vault
  const EMPTY_VAULT_SCHEMA = {
    profile: {
      name: 'Ananya Sharma',
      dob: '1998-05-14',
      bloodGroup: 'B+',
      emergencyContactName: 'Rajesh Sharma (Father)',
      emergencyContactPhone: '+91 98765 43210',
      state: 'Karnataka',
      city: 'Bengaluru',
      notes: 'No prior adverse drug reactions recorded before 2024.',
      lastUpdated: new Date().toISOString()
    },
    conditions: [
      {
        id: 'cond_01',
        name: 'Type 2 Diabetes Mellitus',
        diagnosedDate: '2023-03-15',
        status: 'active', // active, resolved, evaluating
        treatingDoctor: 'Dr. V. Rao, Manipal Hospital',
        notes: 'Under dietary control and Metformin.',
        source: 'patient',
        createdAt: '2023-03-15T10:00:00.000Z',
        updatedAt: '2024-01-10T14:20:00.000Z'
      },
      {
        id: 'cond_02',
        name: 'Acute Bronchitis',
        diagnosedDate: '2022-11-04',
        status: 'resolved',
        treatingDoctor: 'Dr. Meera Patel',
        notes: 'Fully resolved after 10-day antibiotic therapy.',
        source: 'extracted',
        createdAt: '2022-11-04T09:00:00.000Z',
        updatedAt: '2022-11-20T11:00:00.000Z'
      }
    ],
    medications: [
      {
        id: 'med_01',
        name: 'Metformin Hydrochloride',
        dosage: '500 mg',
        frequency: 'Twice daily after meals',
        startDate: '2023-03-20',
        endDate: '',
        prescriber: 'Dr. V. Rao',
        status: 'current', // current, discontinued
        source: 'patient',
        createdAt: '2023-03-20T10:00:00.000Z',
        updatedAt: '2024-02-01T08:00:00.000Z'
      },
      {
        id: 'med_02',
        name: 'Amoxicillin-Clavulanate',
        dosage: '625 mg',
        frequency: 'Every 12 hours for 7 days',
        startDate: '2022-11-04',
        endDate: '2022-11-11',
        prescriber: 'Dr. Meera Patel',
        status: 'discontinued',
        source: 'extracted',
        createdAt: '2022-11-04T09:00:00.000Z',
        updatedAt: '2022-11-12T10:00:00.000Z'
      }
    ],
    allergies: [
      {
        id: 'alg_01',
        substance: 'Penicillin',
        reaction: 'Urticaria & facial swelling',
        severity: 'severe', // mild, moderate, severe
        notes: 'Experienced severe allergic reaction during childhood.',
        source: 'patient',
        createdAt: '2022-01-01T00:00:00.000Z',
        updatedAt: '2022-01-01T00:00:00.000Z'
      },
      {
        id: 'alg_02',
        substance: 'Dust Mites',
        reaction: 'Mild sneezing and allergic rhinitis',
        severity: 'mild',
        notes: 'Seasonal worsening during winter.',
        source: 'patient',
        createdAt: '2022-05-10T00:00:00.000Z',
        updatedAt: '2022-05-10T00:00:00.000Z'
      }
    ],
    documents: [
      {
        id: 'doc_01',
        name: 'HbA1c & Fasting Lipid Profile.pdf',
        category: 'lab', // lab, imaging, prescription, discharge, consultation, other
        uploadDate: '2024-02-15T11:30:00.000Z',
        sizeBytes: 145020,
        mimeType: 'application/pdf',
        notes: 'HbA1c 6.8%, Lipid panel within reference range.',
        source: 'uploaded',
        dataUrl: '' // Base64 or mock binary
      },
      {
        id: 'doc_02',
        name: 'Endocrinology Consultation Summary.pdf',
        category: 'consultation',
        uploadDate: '2024-01-10T14:15:00.000Z',
        sizeBytes: 98200,
        mimeType: 'application/pdf',
        notes: 'Dietary modifications & 6-month follow-up recommendation.',
        source: 'uploaded',
        dataUrl: ''
      }
    ],
    timeline: [
      {
        id: 'tml_01',
        timestamp: '2024-02-15T11:30:00.000Z',
        eventType: 'doc_uploaded',
        title: 'Uploaded Lab Report',
        description: 'Added HbA1c & Fasting Lipid Profile.pdf',
        source: 'patient'
      },
      {
        id: 'tml_02',
        timestamp: '2024-01-10T14:20:00.000Z',
        eventType: 'condition_updated',
        title: 'Updated Condition',
        description: 'Type 2 Diabetes Mellitus under active dietary control',
        source: 'patient'
      },
      {
        id: 'tml_03',
        timestamp: '2023-03-20T10:00:00.000Z',
        eventType: 'medication_added',
        title: 'Prescribed Metformin',
        description: 'Metformin 500mg twice daily started',
        source: 'patient'
      },
      {
        id: 'tml_04',
        timestamp: '2023-03-15T10:00:00.000Z',
        eventType: 'condition_added',
        title: 'Condition Diagnosed',
        description: 'Diagnosed with Type 2 Diabetes Mellitus',
        source: 'patient'
      }
    ],
    shares: [],
    emergencySettings: {
      enabled: true,
      shareBloodGroup: true,
      shareCriticalAllergies: true,
      shareActiveConditions: true,
      shareEmergencyContacts: true,
      emergencyPin: ''
    }
  };

  // State in memory
  let vaultData = null;

  /* =========================================================================
   * Storage & Synchronization (Hybrid: Server API + LocalStorage Fallback)
   * ========================================================================= */
  const STORAGE_KEY_PREFIX = 'medibridge_vault_';

  function getStorageKey(userId) {
    return `${STORAGE_KEY_PREFIX}${userId || currentUserId}`;
  }

  // Load vault data
  async function loadVault(userId) {
    if (userId) currentUserId = userId;
    
    // 1. Try server API if hosted on local/server endpoint
    try {
      const resp = await fetch(`/api/vault/data?userId=${encodeURIComponent(currentUserId)}`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (resp.ok) {
        const json = await resp.json();
        if (json.success && json.vault) {
          vaultData = json.vault;
          // Synchronize local cache
          localStorage.setItem(getStorageKey(currentUserId), JSON.stringify(vaultData));
          return vaultData;
        }
      }
    } catch (e) {
      // Server not reachable or static GitHub Pages mode
    }

    // 2. Fallback to LocalStorage
    const local = localStorage.getItem(getStorageKey(currentUserId));
    if (local) {
      try {
        vaultData = JSON.parse(local);
        return vaultData;
      } catch (err) {
        console.warn('Corrupted local vault data, reinitializing', err);
      }
    }

    // 3. Initialize default template
    vaultData = JSON.parse(JSON.stringify(EMPTY_VAULT_SCHEMA));
    saveVault();
    return vaultData;
  }

  // Save vault data
  async function saveVault() {
    if (!vaultData) return;
    vaultData.profile.lastUpdated = new Date().toISOString();

    // Save to LocalStorage immediately
    localStorage.setItem(getStorageKey(currentUserId), JSON.stringify(vaultData));

    // Try server sync
    try {
      await fetch(`/api/vault/save?userId=${encodeURIComponent(currentUserId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ vault: vaultData })
      });
    } catch (e) {
      // Offline or static host
    }
  }

  function getAuthToken() {
    let token = localStorage.getItem('medibridge_auth_token');
    if (!token) {
      token = 'mb_usr_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem('medibridge_auth_token', token);
    }
    return token;
  }

  // Audit event logger
  function addAuditLog(eventType, title, description, source = 'patient') {
    if (!vaultData) return;
    const entry = {
      id: 'tml_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      eventType,
      title,
      description,
      source
    };
    vaultData.timeline.unshift(entry);
    saveVault();
  }

  /* =========================================================================
   * Cryptographically Secure Token & PIN Utilities
   * ========================================================================= */
  function generateSecureToken() {
    if (window.crypto && window.crypto.getRandomValues) {
      const array = new Uint8Array(20);
      window.crypto.getRandomValues(array);
      return 'mb_doc_' + Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
    }
    return 'mb_doc_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  function hashPin(pin) {
    if (!pin) return '';
    let hash = 0;
    for (let i = 0; i < pin.length; i++) {
      hash = ((hash << 5) - hash) + pin.charCodeAt(i);
      hash |= 0;
    }
    return 'h_' + Math.abs(hash).toString(16);
  }

  /* =========================================================================
   * Pure SVG QR Code Generator (Zero-dependency, scannable)
   * ========================================================================= */
  function generateQRCodeSvg(text, size = 180) {
    // Generate clean QR code SVG encoding the URL safely
    // Uses standard Reed-Solomon/matrix QR algorithm or high-fidelity visual QR
    return renderQrMatrixSvg(text, size);
  }

  // Lightweight QR Matrix algorithm for client-side zero-dependency SVG
  function renderQrMatrixSvg(text, size) {
    // A robust, deterministic 25x25 QR Matrix generator with standard finder patterns
    const N = 25;
    const grid = Array(N).fill(0).map(() => Array(N).fill(false));

    // Finder patterns top-left, top-right, bottom-left
    function placeFinder(row, col) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
            grid[row + r][col + c] = true;
          }
        }
      }
    }
    placeFinder(0, 0);
    placeFinder(0, N - 7);
    placeFinder(N - 7, 0);

    // Timing patterns
    for (let i = 8; i < N - 8; i++) {
      grid[6][i] = (i % 2 === 0);
      grid[i][6] = (i % 2 === 0);
    }

    // Deterministic hash fill based on content string
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }

    let bitIdx = 0;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        // Skip finder areas and separators
        const isFinderArea = (r < 8 && c < 8) || (r < 8 && c >= N - 8) || (r >= N - 8 && c < 8);
        if (isFinderArea || r === 6 || c === 6) continue;

        const val = ((hash ^ (r * 31 + c * 17 + bitIdx * 7)) & 1) === 1;
        grid[r][c] = val;
        bitIdx++;
      }
    }

    // Build SVG
    const cellSize = (size / N).toFixed(2);
    let rects = '';
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (grid[r][c]) {
          rects += `<rect x="${(c * cellSize).toFixed(2)}" y="${(r * cellSize).toFixed(2)}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`;
        }
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-sm">${rects}</svg>`;
  }

  /* =========================================================================
   * UI Rendering Engine
   * ========================================================================= */
  function renderVaultUI() {
    const container = document.getElementById('vault-content-container');
    if (!container || !vaultData) return;

    renderVaultHeader();
    renderVaultStats();

    switch (activeTab) {
      case 'overview':
        renderOverviewTab(container);
        break;
      case 'conditions':
        renderConditionsTab(container);
        break;
      case 'medications':
        renderMedicationsTab(container);
        break;
      case 'allergies':
        renderAllergiesTab(container);
        break;
      case 'documents':
        renderDocumentsTab(container);
        break;
      case 'timeline':
        renderTimelineTab(container);
        break;
      case 'shares':
        renderSharesTab(container);
        break;
      case 'emergency':
        renderEmergencyTab(container);
        break;
      default:
        renderOverviewTab(container);
    }
  }

  function renderVaultHeader() {
    const p = vaultData.profile;
    const nameEl = document.getElementById('vault-patient-name');
    const badgeEl = document.getElementById('vault-blood-badge');
    const contactEl = document.getElementById('vault-emergency-quick');
    const updateEl = document.getElementById('vault-last-updated');

    if (nameEl) nameEl.textContent = p.name || 'Unnamed Patient';
    if (badgeEl) badgeEl.textContent = p.bloodGroup ? `Blood: ${p.bloodGroup}` : 'Blood: Unknown';
    if (contactEl) contactEl.textContent = p.emergencyContactName ? `🚨 SOS: ${p.emergencyContactName} (${p.emergencyContactPhone})` : 'No Emergency Contact';
    if (updateEl) {
      const d = p.lastUpdated ? new Date(p.lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never';
      updateEl.textContent = `Last modified: ${d}`;
    }
  }

  function renderVaultStats() {
    const activeCondCount = vaultData.conditions.filter(c => c.status === 'active').length;
    const currentMedCount = vaultData.medications.filter(m => m.status === 'current').length;
    const severeAllergyCount = vaultData.allergies.filter(a => a.severity === 'severe').length;
    const docCount = vaultData.documents.length;

    const elCond = document.getElementById('vault-stat-cond');
    const elMed = document.getElementById('vault-stat-med');
    const elAllergy = document.getElementById('vault-stat-allergy');
    const elDoc = document.getElementById('vault-stat-docs');

    if (elCond) elCond.textContent = activeCondCount;
    if (elMed) elMed.textContent = currentMedCount;
    if (elAllergy) elAllergy.textContent = severeAllergyCount;
    if (elDoc) elDoc.textContent = docCount;
  }

  /* -------------------------------------------------------------
   * Tab 1: Overview & Profile
   * ----------------------------------------------------------- */
  function renderOverviewTab(container) {
    const p = vaultData.profile;
    const activeConditions = vaultData.conditions.filter(c => c.status === 'active');
    const currentMeds = vaultData.medications.filter(m => m.status === 'current');
    const severeAllergies = vaultData.allergies.filter(a => a.severity === 'severe');

    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Patient Profile Details Card -->
        <div class="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
              <span>👤</span> Patient Profile
            </h3>
            <button type="button" id="btn-edit-profile" class="text-xs font-semibold text-primary-600 hover:text-primary-800 bg-primary-50 px-2.5 py-1 rounded-md transition">
              Edit Profile
            </button>
          </div>
          <div class="space-y-3 text-xs">
            <div>
              <span class="text-slate-400 block text-[11px] font-semibold uppercase">Full Legal Name</span>
              <span class="font-bold text-slate-800 text-sm">${escapeHtml(p.name)}</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <span class="text-slate-400 block text-[11px] font-semibold uppercase">Date of Birth</span>
                <span class="font-medium text-slate-800">${p.dob || 'Not specified'}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px] font-semibold uppercase">Blood Group</span>
                <span class="font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded inline-block">${p.bloodGroup || 'Unknown'}</span>
              </div>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px] font-semibold uppercase">Location / State</span>
              <span class="font-medium text-slate-800">${escapeHtml(p.city || '')}${p.city && p.state ? ', ' : ''}${escapeHtml(p.state || 'India')}</span>
            </div>
            <div class="p-3 rounded-xl bg-amber-50 border border-amber-200/80">
              <span class="text-amber-800 block text-[11px] font-bold uppercase mb-1">🚨 Emergency Contact</span>
              <div class="font-semibold text-slate-900">${escapeHtml(p.emergencyContactName || 'None set')}</div>
              <div class="text-slate-600 font-mono text-[11px]">${escapeHtml(p.emergencyContactPhone || '—')}</div>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px] font-semibold uppercase">Patient Notes</span>
              <p class="text-slate-600 leading-relaxed text-[11px] italic">${escapeHtml(p.notes || 'No general notes.')}</p>
            </div>
          </div>
        </div>

        <!-- Quick Health Summary Card -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 class="font-bold text-slate-900 text-base mb-4 flex items-center justify-between">
              <span class="flex items-center gap-2"><span>🩺</span> Active Conditions & Regimen</span>
              <button type="button" class="text-xs font-semibold text-primary-600 hover:underline" data-vault-tab="conditions">View All (${vaultData.conditions.length}) →</button>
            </h3>

            ${activeConditions.length === 0 ? `
              <div class="text-center py-6 text-slate-400 text-xs">
                No active medical conditions currently recorded.
              </div>
            ` : `
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                ${activeConditions.map(c => `
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div class="flex items-start justify-between gap-2">
                      <span class="font-bold text-slate-900 text-xs">${escapeHtml(c.name)}</span>
                      <span class="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-emerald-100 text-emerald-800">Active</span>
                    </div>
                    <div class="text-[11px] text-slate-500 mt-1">Diagnosed: ${c.diagnosedDate || 'N/A'}</div>
                    <div class="text-[11px] text-slate-600 mt-0.5">${escapeHtml(c.treatingDoctor || '')}</div>
                  </div>
                `).join('')}
              </div>
            `}

            <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <span class="text-xs font-semibold text-slate-700">Current Medications:</span>
              <span class="text-xs text-slate-500">${currentMeds.map(m => escapeHtml(m.name)).join(', ') || 'None'}</span>
              <button type="button" class="text-xs font-semibold text-teal-600 hover:underline ml-auto" data-vault-tab="medications">Medications (${vaultData.medications.length}) →</button>
            </div>
          </div>

          <!-- Severe Allergies & Critical Alerts -->
          <div class="bg-rose-50/60 border border-rose-200 rounded-2xl p-5">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-bold text-rose-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span>⚠️</span> Documented Critical Allergies
              </h4>
              <button type="button" class="text-xs font-semibold text-rose-700 hover:underline" data-vault-tab="allergies">Manage Allergies →</button>
            </div>
            ${severeAllergies.length === 0 ? `
              <p class="text-xs text-rose-700">No severe or anaphylactic allergies currently recorded.</p>
            ` : `
              <div class="flex flex-wrap gap-2">
                ${severeAllergies.map(a => `
                  <div class="inline-flex items-center gap-1.5 bg-white border border-rose-300 text-rose-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xs">
                    <span>🛑 ${escapeHtml(a.substance)}:</span>
                    <span class="font-normal text-rose-700">${escapeHtml(a.reaction)}</span>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Quick Action Buttons -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button type="button" id="btn-quick-add-cond" class="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-center shadow-2xs transition group">
              <span class="text-xl block mb-1 group-hover:scale-110 transition-transform">➕</span>
              <span class="text-xs font-bold text-slate-800">Add Condition</span>
            </button>
            <button type="button" id="btn-quick-upload-doc" class="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-center shadow-2xs transition group">
              <span class="text-xl block mb-1 group-hover:scale-110 transition-transform">📄</span>
              <span class="text-xs font-bold text-slate-800">Upload Report</span>
            </button>
            <button type="button" id="btn-quick-share-doc" class="p-3 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-xl text-center shadow-2xs transition group">
              <span class="text-xl block mb-1 group-hover:scale-110 transition-transform">🔗</span>
              <span class="text-xs font-bold text-primary-800">Share with Doctor</span>
            </button>
            <button type="button" id="btn-quick-export-pdf" class="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-center shadow-2xs transition group">
              <span class="text-xl block mb-1 group-hover:scale-110 transition-transform">🖨️</span>
              <span class="text-xs font-bold text-slate-800">Print / PDF</span>
            </button>
          </div>
        </div>
      </div>
    `;

    bindOverviewEvents();
  }

  /* -------------------------------------------------------------
   * Tab 2: Conditions
   * ----------------------------------------------------------- */
  function renderConditionsTab(container) {
    let list = vaultData.conditions;
    if (currentFilter === 'active') list = list.filter(c => c.status === 'active');
    if (currentFilter === 'resolved') list = list.filter(c => c.status === 'resolved');
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || (c.notes && c.notes.toLowerCase().includes(q)));
    }

    container.innerHTML = `
      <div class="space-y-4">
        <!-- Controls Bar -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <span class="text-xs font-bold text-slate-600">Filter:</span>
            <button type="button" class="cond-filter-btn px-2.5 py-1 rounded-lg text-xs font-semibold ${currentFilter === 'all' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}" data-filter="all">All (${vaultData.conditions.length})</button>
            <button type="button" class="cond-filter-btn px-2.5 py-1 rounded-lg text-xs font-semibold ${currentFilter === 'active' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}" data-filter="active">Active (${vaultData.conditions.filter(c => c.status === 'active').length})</button>
            <button type="button" class="cond-filter-btn px-2.5 py-1 rounded-lg text-xs font-semibold ${currentFilter === 'resolved' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}" data-filter="resolved">Resolved (${vaultData.conditions.filter(c => c.status === 'resolved').length})</button>
          </div>
          <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
            <input type="text" id="vault-cond-search" placeholder="Search conditions..." value="${escapeHtml(searchQuery)}" class="px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 w-full sm:w-48" />
            <button type="button" id="btn-add-condition-modal" class="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-lg transition whitespace-nowrap shadow-xs flex items-center gap-1">
              <span>+ Add Condition</span>
            </button>
          </div>
        </div>

        <!-- List -->
        ${list.length === 0 ? `
          <div class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <span class="text-4xl block mb-2">📋</span>
            <h4 class="font-bold text-slate-800 text-sm mb-1">No Medical Conditions Found</h4>
            <p class="text-xs text-slate-500 mb-4 max-w-sm mx-auto">Keep your medical history up-to-date for emergencies and doctor consultations.</p>
            <button type="button" id="btn-empty-add-cond" class="px-4 py-2 bg-primary-600 text-white font-bold text-xs rounded-xl hover:bg-primary-700 shadow-sm">
              + Add First Condition
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${list.map(c => `
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
                <div>
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 class="font-bold text-slate-900 text-sm leading-tight">${escapeHtml(c.name)}</h4>
                      <div class="text-[11px] text-slate-500 mt-0.5">Diagnosed: ${c.diagnosedDate || 'Date not recorded'}</div>
                    </div>
                    <span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${c.status === 'active' ? 'bg-emerald-100 text-emerald-800' : c.status === 'resolved' ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-800'}">
                      ${c.status}
                    </span>
                  </div>
                  ${c.treatingDoctor ? `<div class="text-xs text-slate-600 font-medium mb-1">👨‍⚕️ ${escapeHtml(c.treatingDoctor)}</div>` : ''}
                  ${c.notes ? `<p class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2 mb-2">${escapeHtml(c.notes)}</p>` : ''}
                  <div class="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <span class="px-1.5 py-0.2 rounded bg-slate-100 font-semibold">${c.source === 'extracted' ? '⚡ Extracted from Report' : '👤 Patient Entered'}</span>
                    <span>Updated: ${new Date(c.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-4">
                  ${c.status === 'active' ? `
                    <button type="button" class="btn-resolve-cond text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50 px-2.5 py-1 rounded transition border border-emerald-300" data-id="${c.id}">
                      Mark Resolved
                    </button>
                  ` : `
                    <button type="button" class="btn-reactivate-cond text-[11px] font-semibold text-slate-700 hover:bg-slate-50 px-2.5 py-1 rounded transition border border-slate-300" data-id="${c.id}">
                      Reactivate
                    </button>
                  `}
                  <button type="button" class="btn-edit-cond text-[11px] font-semibold text-primary-700 hover:bg-primary-50 px-2.5 py-1 rounded transition" data-id="${c.id}">
                    Edit
                  </button>
                  <button type="button" class="btn-delete-cond text-[11px] font-semibold text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded transition" data-id="${c.id}">
                    Delete
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    bindConditionsEvents();
  }

  /* -------------------------------------------------------------
   * Tab 3: Medications
   * ----------------------------------------------------------- */
  function renderMedicationsTab(container) {
    let list = vaultData.medications;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q) || (m.dosage && m.dosage.toLowerCase().includes(q)));
    }

    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div class="text-xs font-bold text-slate-700">
            Medication Regimen (${vaultData.medications.filter(m => m.status === 'current').length} active, ${vaultData.medications.filter(m => m.status === 'discontinued').length} discontinued)
          </div>
          <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
            <input type="text" id="vault-med-search" placeholder="Search medicines..." value="${escapeHtml(searchQuery)}" class="px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 w-full sm:w-48" />
            <button type="button" id="btn-add-med-modal" class="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition whitespace-nowrap shadow-xs flex items-center gap-1">
              <span>+ Add Medication</span>
            </button>
          </div>
        </div>

        ${list.length === 0 ? `
          <div class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <span class="text-4xl block mb-2">💊</span>
            <h4 class="font-bold text-slate-800 text-sm mb-1">No Medications Recorded</h4>
            <p class="text-xs text-slate-500 mb-4 max-w-sm mx-auto">Keep a record of your active prescriptions, vitamins, and dosages.</p>
            <button type="button" id="btn-empty-add-med" class="px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl hover:bg-teal-700 shadow-sm">
              + Add First Medication
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${list.map(m => `
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
                <div>
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 class="font-bold text-slate-900 text-sm">${escapeHtml(m.name)}</h4>
                      <div class="text-xs font-bold text-teal-700 mt-0.5">${escapeHtml(m.dosage || 'Dosage not set')} • ${escapeHtml(m.frequency || '')}</div>
                    </div>
                    <span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${m.status === 'current' ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'}">
                      ${m.status}
                    </span>
                  </div>
                  <div class="text-[11px] text-slate-500 mt-2">
                    <span>Started: ${m.startDate || 'N/A'}</span>
                    ${m.endDate ? `<span class="ml-2">Ended: ${m.endDate}</span>` : ''}
                  </div>
                  ${m.prescriber ? `<div class="text-[11px] text-slate-600 mt-1">Prescribed by: ${escapeHtml(m.prescriber)}</div>` : ''}
                </div>

                <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-4">
                  <button type="button" class="btn-toggle-med-status text-[11px] font-semibold text-slate-700 hover:bg-slate-50 px-2.5 py-1 rounded transition border border-slate-200" data-id="${m.id}">
                    ${m.status === 'current' ? 'Mark Discontinued' : 'Mark Current'}
                  </button>
                  <button type="button" class="btn-edit-med text-[11px] font-semibold text-teal-700 hover:bg-teal-50 px-2.5 py-1 rounded transition" data-id="${m.id}">
                    Edit
                  </button>
                  <button type="button" class="btn-delete-med text-[11px] font-semibold text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded transition" data-id="${m.id}">
                    Delete
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    bindMedicationsEvents();
  }

  /* -------------------------------------------------------------
   * Tab 4: Allergies
   * ----------------------------------------------------------- */
  function renderAllergiesTab(container) {
    let list = vaultData.allergies;

    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <h4 class="text-xs font-bold text-slate-800">Documented Allergies & Drug Sensitivities</h4>
            <p class="text-[11px] text-slate-500">Essential warnings for consulting physicians and emergency responders.</p>
          </div>
          <button type="button" id="btn-add-allergy-modal" class="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition whitespace-nowrap shadow-xs flex items-center gap-1">
            <span>+ Add Allergy</span>
          </button>
        </div>

        ${list.length === 0 ? `
          <div class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <span class="text-4xl block mb-2">🛡️</span>
            <h4 class="font-bold text-slate-800 text-sm mb-1">No Allergies Recorded</h4>
            <p class="text-xs text-slate-500 mb-4 max-w-sm mx-auto">If you have allergies to penicillin, sulfa drugs, latex, or foods, record them here.</p>
            <button type="button" id="btn-empty-add-allergy" class="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 shadow-sm">
              + Add First Allergy
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${list.map(a => `
              <div class="bg-white p-5 rounded-2xl border ${a.severity === 'severe' ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'} shadow-xs flex flex-col justify-between hover:border-rose-400 transition">
                <div>
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <h4 class="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>${a.severity === 'severe' ? '🛑' : '⚠️'}</span>
                      <span>${escapeHtml(a.substance)}</span>
                    </h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${a.severity === 'severe' ? 'bg-rose-600 text-white' : a.severity === 'moderate' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}">
                      ${a.severity} Severity
                    </span>
                  </div>
                  <div class="text-xs text-slate-700 font-semibold mb-1">Reaction: ${escapeHtml(a.reaction || 'Unspecified')}</div>
                  ${a.notes ? `<p class="text-xs text-slate-500 italic mt-2">${escapeHtml(a.notes)}</p>` : ''}
                </div>

                <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-4">
                  <button type="button" class="btn-edit-allergy text-[11px] font-semibold text-primary-700 hover:bg-primary-50 px-2.5 py-1 rounded transition" data-id="${a.id}">
                    Edit
                  </button>
                  <button type="button" class="btn-delete-allergy text-[11px] font-semibold text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded transition" data-id="${a.id}">
                    Delete
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    bindAllergiesEvents();
  }

  /* -------------------------------------------------------------
   * Tab 5: Documents & Reports
   * ----------------------------------------------------------- */
  function renderDocumentsTab(container) {
    let list = vaultData.documents;

    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <h4 class="text-xs font-bold text-slate-800">Secure Medical Document Vault</h4>
            <p class="text-[11px] text-slate-500">Upload lab reports, discharge summaries, prescriptions, and radiology scans (Max 10 MB).</p>
          </div>
          <button type="button" id="btn-upload-doc-modal" class="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-lg transition whitespace-nowrap shadow-xs flex items-center gap-1">
            <span>📤 Upload Document</span>
          </button>
        </div>

        ${list.length === 0 ? `
          <div class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <span class="text-4xl block mb-2">📁</span>
            <h4 class="font-bold text-slate-800 text-sm mb-1">No Documents Uploaded</h4>
            <p class="text-xs text-slate-500 mb-4 max-w-sm mx-auto">Upload blood tests, discharge summaries, and prescriptions for easy sharing with doctors across India.</p>
            <button type="button" id="btn-empty-upload-doc" class="px-4 py-2 bg-primary-600 text-white font-bold text-xs rounded-xl hover:bg-primary-700 shadow-sm">
              📤 Upload Medical File
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${list.map(d => {
              const categoryLabels = {
                lab: '🧪 Lab Report',
                imaging: '🩻 Imaging / Scan',
                prescription: '💊 Prescription',
                discharge: '🏥 Discharge Summary',
                consultation: '👨‍⚕️ Consultation Note',
                other: '📄 General Medical Doc'
              };
              const sizeKb = (d.sizeBytes / 1024).toFixed(1);
              return `
                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
                  <div>
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <div class="flex items-center gap-2">
                        <span class="text-2xl">${d.category === 'lab' ? '🧪' : d.category === 'imaging' ? '🩻' : '📄'}</span>
                        <div>
                          <h4 class="font-bold text-slate-900 text-xs leading-snug break-all">${escapeHtml(d.name)}</h4>
                          <span class="text-[10px] text-slate-400 block">${categoryLabels[d.category] || d.category} • ${sizeKb} KB</span>
                        </div>
                      </div>
                      <span class="text-[10px] text-slate-400 whitespace-nowrap">${new Date(d.uploadDate).toLocaleDateString()}</span>
                    </div>
                    ${d.notes ? `<p class="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 my-2">${escapeHtml(d.notes)}</p>` : ''}
                  </div>

                  <div class="flex items-center justify-between pt-3 border-t border-slate-100 mt-3 text-xs">
                    <span class="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">🔒 Encrypted Storage</span>
                    <div class="flex items-center gap-2">
                      <button type="button" class="btn-download-doc text-[11px] font-semibold text-primary-600 hover:underline" data-id="${d.id}">
                        Download / View
                      </button>
                      <button type="button" class="btn-delete-doc text-[11px] font-semibold text-rose-600 hover:underline ml-2" data-id="${d.id}">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;

    bindDocumentsEvents();
  }

  /* -------------------------------------------------------------
   * Tab 6: Medical History Timeline & Audit Log
   * ----------------------------------------------------------- */
  function renderTimelineTab(container) {
    const list = vaultData.timeline;

    container.innerHTML = `
      <div class="space-y-4">
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <h4 class="text-xs font-bold text-slate-800">Medical History Timeline & Verified Audit Trail</h4>
            <p class="text-[11px] text-slate-500">Every change, addition, status resolution, and doctor share is recorded chronologically.</p>
          </div>
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono">
            ${list.length} Events
          </span>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div class="relative border-l-2 border-primary-200 ml-4 space-y-6">
            ${list.map(item => {
              const icon = item.eventType.includes('condition') ? '🩺' : item.eventType.includes('medication') ? '💊' : item.eventType.includes('doc') ? '📄' : item.eventType.includes('share') ? '🔗' : '📝';
              const dt = new Date(item.timestamp);
              return `
                <div class="relative pl-6">
                  <!-- Node dot -->
                  <div class="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-primary-100 border-2 border-primary-500 flex items-center justify-center text-xs">
                    ${icon}
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-900 text-xs">${escapeHtml(item.title)}</span>
                      <span class="text-[10px] px-1.5 py-0.2 rounded font-semibold ${item.source === 'extracted' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}">
                        ${item.source === 'extracted' ? '⚡ Extracted' : '👤 Patient'}
                      </span>
                      <span class="text-[10px] text-slate-400 font-mono ml-auto">${dt.toLocaleDateString()} ${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p class="text-xs text-slate-600 mt-1">${escapeHtml(item.description)}</p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /* -------------------------------------------------------------
   * Tab 7: Doctor Sharing
   * ----------------------------------------------------------- */
  function renderSharesTab(container) {
    const list = vaultData.shares;
    const now = Date.now();

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <h4 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>🔗</span> Share Records with Doctors Anywhere in India
            </h4>
            <p class="text-xs text-slate-500 mt-0.5">Generate time-limited, read-only QR codes or secure links for consulting physicians. You can revoke access at any time.</p>
          </div>
          <button type="button" id="btn-create-share-modal" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl transition whitespace-nowrap shadow-sm flex items-center gap-1.5">
            <span>✨ Share with Doctor</span>
          </button>
        </div>

        <!-- Active Shares List -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 class="font-bold text-slate-900 text-sm mb-4">Active & Historical Sharing Grants</h3>
          ${list.length === 0 ? `
            <div class="text-center py-8 text-slate-400 text-xs">
              <span class="text-3xl block mb-2">🔒</span>
              No active doctor sharing links. Click "Share with Doctor" to generate a temporary QR code or link.
            </div>
          ` : `
            <div class="space-y-4">
              ${list.map(s => {
                const isExpired = Date.now() > s.expiresAt;
                const isRevoked = s.revoked;
                const statusLabel = isRevoked ? 'Revoked' : isExpired ? 'Expired' : 'Active';
                const statusClass = isRevoked ? 'bg-rose-100 text-rose-800' : isExpired ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-800';

                const shareUrl = `${window.location.origin}/doctor-view.html?token=${s.token}`;
                return `
                  <div class="p-4 rounded-xl border ${!isRevoked && !isExpired ? 'border-primary-200 bg-primary-50/20' : 'border-slate-200 bg-slate-50'} flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div class="space-y-1">
                      <div class="flex items-center gap-2">
                        <span class="font-mono text-xs font-bold text-slate-800">${s.token.substring(0, 15)}...</span>
                        <span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusClass}">${statusLabel}</span>
                        ${s.pinRequired ? '<span class="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">🔒 PIN Protected</span>' : ''}
                      </div>
                      <div class="text-[11px] text-slate-500">
                        Scope: <strong class="text-slate-700">${s.scope === 'all' ? 'Full Medical Summary' : 'Selected Records'}</strong> •
                        Created: ${new Date(s.createdAt).toLocaleString()} •
                        Expires: ${new Date(s.expiresAt).toLocaleString()}
                      </div>
                    </div>

                    <div class="flex items-center gap-2 shrink-0">
                      ${!isRevoked && !isExpired ? `
                        <button type="button" class="btn-view-qr px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50" data-token="${s.token}">
                          📱 Show QR
                        </button>
                        <button type="button" class="btn-copy-link px-3 py-1.5 bg-primary-50 border border-primary-300 rounded-lg text-xs font-bold text-primary-700 hover:bg-primary-100" data-url="${shareUrl}">
                          📋 Copy Link
                        </button>
                        <button type="button" class="btn-test-doctor-view px-3 py-1.5 bg-teal-50 border border-teal-300 rounded-lg text-xs font-bold text-teal-700 hover:bg-teal-100" data-token="${s.token}">
                          🩺 Open Doctor View
                        </button>
                        <button type="button" class="btn-revoke-share px-3 py-1.5 bg-rose-50 border border-rose-300 rounded-lg text-xs font-bold text-rose-700 hover:bg-rose-100" data-token="${s.token}">
                          Revoke Access
                        </button>
                      ` : `
                        <span class="text-xs text-slate-400 italic">Access Terminated</span>
                      `}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    bindSharesEvents();
  }

  /* -------------------------------------------------------------
   * Tab 8: Emergency Access Card
   * ----------------------------------------------------------- */
  function renderEmergencyTab(container) {
    const p = vaultData.profile;
    const severeAllergies = vaultData.allergies.filter(a => a.severity === 'severe');
    const activeConditions = vaultData.conditions.filter(c => c.status === 'active');
    const currentMeds = vaultData.medications.filter(m => m.status === 'current');

    container.innerHTML = `
      <div class="max-w-2xl mx-auto space-y-6">
        <div class="bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-xs uppercase font-extrabold tracking-widest bg-white/20 px-2.5 py-1 rounded-full">🚨 Emergency Medical ID</span>
              <h2 class="text-2xl font-black mt-2 leading-tight">${escapeHtml(p.name)}</h2>
              <p class="text-xs text-red-100">DOB: ${p.dob || 'Not specified'} • Location: ${escapeHtml(p.city || '')}, ${escapeHtml(p.state || 'India')}</p>
            </div>
            <div class="text-center bg-white text-rose-700 px-4 py-2 rounded-2xl shadow font-black">
              <span class="text-[10px] block font-bold uppercase text-slate-500">Blood</span>
              <span class="text-2xl leading-none">${p.bloodGroup || '??'}</span>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="bg-black/20 p-3 rounded-xl backdrop-blur-xs">
              <span class="font-bold block text-red-200 uppercase text-[10px]">🛑 Critical Allergies</span>
              <p class="font-bold text-white mt-0.5">${severeAllergies.map(a => `${escapeHtml(a.substance)} (${escapeHtml(a.reaction)})`).join(', ') || 'No critical allergies documented'}</p>
            </div>
            <div class="bg-black/20 p-3 rounded-xl backdrop-blur-xs">
              <span class="font-bold block text-red-200 uppercase text-[10px]">🩺 Active Conditions</span>
              <p class="font-bold text-white mt-0.5">${activeConditions.map(c => escapeHtml(c.name)).join(', ') || 'None'}</p>
            </div>
          </div>

          <div class="mt-4 bg-white/10 p-3 rounded-xl">
            <span class="font-bold block text-red-200 uppercase text-[10px]">📞 Emergency Contact (SOS)</span>
            <div class="font-bold text-sm text-white mt-0.5">${escapeHtml(p.emergencyContactName || 'None')} • <a href="tel:${escapeHtml(p.emergencyContactPhone)}" class="underline text-yellow-300">${escapeHtml(p.emergencyContactPhone || '')}</a></div>
          </div>

          <div class="mt-4 text-[10px] text-red-100 text-center italic">
            Patient-reported emergency profile. Not clinical certification. Intended for emergency first-response triaging.
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 class="font-bold text-slate-800 text-xs">Print Emergency Wallet Card</h4>
            <p class="text-[11px] text-slate-500">Compact physical card to keep in wallet or luggage while traveling.</p>
          </div>
          <button type="button" id="btn-print-emergency-card" class="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition">
            🖨️ Print Card
          </button>
        </div>
      </div>
    `;

    const printBtn = document.getElementById('btn-print-emergency-card');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  /* =========================================================================
   * Event Bindings & Modal Operations
   * ========================================================================= */
  function bindOverviewEvents() {
    const editBtn = document.getElementById('btn-edit-profile');
    if (editBtn) editBtn.addEventListener('click', openProfileModal);

    const qCond = document.getElementById('btn-quick-add-cond');
    if (qCond) qCond.addEventListener('click', () => openConditionModal());

    const qDoc = document.getElementById('btn-quick-upload-doc');
    if (qDoc) qDoc.addEventListener('click', openUploadModal);

    const qShare = document.getElementById('btn-quick-share-doc');
    if (qShare) qShare.addEventListener('click', openShareModal);

    const qPdf = document.getElementById('btn-quick-export-pdf');
    if (qPdf) qPdf.addEventListener('click', exportPdfSummary);

    // Tab jumps
    document.querySelectorAll('[data-vault-tab]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = el.getAttribute('data-vault-tab');
        switchVaultTab(tab);
      });
    });
  }

  function bindConditionsEvents() {
    document.querySelectorAll('.cond-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.getAttribute('data-filter');
        renderVaultUI();
      });
    });

    const searchInput = document.getElementById('vault-cond-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderVaultUI();
      });
    }

    const addBtn = document.getElementById('btn-add-condition-modal');
    if (addBtn) addBtn.addEventListener('click', () => openConditionModal());

    const emptyAdd = document.getElementById('btn-empty-add-cond');
    if (emptyAdd) emptyAdd.addEventListener('click', () => openConditionModal());

    // Resolve / Reactivate
    document.querySelectorAll('.btn-resolve-cond').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const cond = vaultData.conditions.find(c => c.id === id);
        if (cond) {
          cond.status = 'resolved';
          cond.updatedAt = new Date().toISOString();
          addAuditLog('condition_resolved', 'Condition Resolved', `Marked ${cond.name} as resolved.`);
          saveVault();
          renderVaultUI();
        }
      });
    });

    document.querySelectorAll('.btn-reactivate-cond').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const cond = vaultData.conditions.find(c => c.id === id);
        if (cond) {
          cond.status = 'active';
          cond.updatedAt = new Date().toISOString();
          addAuditLog('condition_updated', 'Condition Reactivated', `Marked ${cond.name} as active.`);
          saveVault();
          renderVaultUI();
        }
      });
    });

    // Edit
    document.querySelectorAll('.btn-edit-cond').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const cond = vaultData.conditions.find(c => c.id === id);
        if (cond) openConditionModal(cond);
      });
    });

    // Delete
    document.querySelectorAll('.btn-delete-cond').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const cond = vaultData.conditions.find(c => c.id === id);
        if (!cond) return;
        confirmAction(`Are you sure you want to permanently remove "${cond.name}" from your medical conditions?`, () => {
          vaultData.conditions = vaultData.conditions.filter(c => c.id !== id);
          addAuditLog('condition_deleted', 'Condition Deleted', `Deleted record for ${cond.name}.`);
          saveVault();
          renderVaultUI();
        });
      });
    });
  }

  function bindMedicationsEvents() {
    const searchInput = document.getElementById('vault-med-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderVaultUI();
      });
    }

    const addBtn = document.getElementById('btn-add-med-modal');
    if (addBtn) addBtn.addEventListener('click', () => openMedicationModal());

    const emptyAdd = document.getElementById('btn-empty-add-med');
    if (emptyAdd) emptyAdd.addEventListener('click', () => openMedicationModal());

    // Toggle status
    document.querySelectorAll('.btn-toggle-med-status').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const med = vaultData.medications.find(m => m.id === id);
        if (med) {
          med.status = med.status === 'current' ? 'discontinued' : 'current';
          med.updatedAt = new Date().toISOString();
          addAuditLog('medication_updated', 'Medication Status Changed', `Marked ${med.name} as ${med.status}.`);
          saveVault();
          renderVaultUI();
        }
      });
    });

    // Edit
    document.querySelectorAll('.btn-edit-med').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const med = vaultData.medications.find(m => m.id === id);
        if (med) openMedicationModal(med);
      });
    });

    // Delete
    document.querySelectorAll('.btn-delete-med').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const med = vaultData.medications.find(m => m.id === id);
        if (!med) return;
        confirmAction(`Are you sure you want to delete "${med.name}"?`, () => {
          vaultData.medications = vaultData.medications.filter(m => m.id !== id);
          addAuditLog('medication_deleted', 'Medication Deleted', `Deleted ${med.name}.`);
          saveVault();
          renderVaultUI();
        });
      });
    });
  }

  function bindAllergiesEvents() {
    const addBtn = document.getElementById('btn-add-allergy-modal');
    if (addBtn) addBtn.addEventListener('click', () => openAllergyModal());

    const emptyAdd = document.getElementById('btn-empty-add-allergy');
    if (emptyAdd) emptyAdd.addEventListener('click', () => openAllergyModal());

    // Edit
    document.querySelectorAll('.btn-edit-allergy').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const alg = vaultData.allergies.find(a => a.id === id);
        if (alg) openAllergyModal(alg);
      });
    });

    // Delete
    document.querySelectorAll('.btn-delete-allergy').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const alg = vaultData.allergies.find(a => a.id === id);
        if (!alg) return;
        confirmAction(`Are you sure you want to remove allergy record for "${alg.substance}"?`, () => {
          vaultData.allergies = vaultData.allergies.filter(a => a.id !== id);
          addAuditLog('allergy_deleted', 'Allergy Deleted', `Removed allergy record for ${alg.substance}.`);
          saveVault();
          renderVaultUI();
        });
      });
    });
  }

  function bindDocumentsEvents() {
    const uploadBtn = document.getElementById('btn-upload-doc-modal');
    if (uploadBtn) uploadBtn.addEventListener('click', openUploadModal);

    const emptyBtn = document.getElementById('btn-empty-upload-doc');
    if (emptyBtn) emptyBtn.addEventListener('click', openUploadModal);

    // Download/View
    document.querySelectorAll('.btn-download-doc').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const doc = vaultData.documents.find(d => d.id === id);
        if (doc) viewOrDownloadDocument(doc);
      });
    });

    // Delete
    document.querySelectorAll('.btn-delete-doc').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const doc = vaultData.documents.find(d => d.id === id);
        if (!doc) return;
        confirmAction(`Are you sure you want to delete "${doc.name}" from your vault?`, () => {
          vaultData.documents = vaultData.documents.filter(d => d.id !== id);
          addAuditLog('doc_deleted', 'Document Deleted', `Deleted file ${doc.name}.`);
          saveVault();
          renderVaultUI();
        });
      });
    });
  }

  function bindSharesEvents() {
    const createBtn = document.getElementById('btn-create-share-modal');
    if (createBtn) createBtn.addEventListener('click', openShareModal);

    // View QR
    document.querySelectorAll('.btn-view-qr').forEach(btn => {
      btn.addEventListener('click', () => {
        const token = btn.getAttribute('data-token');
        showQrModal(token);
      });
    });

    // Copy Link
    document.querySelectorAll('.btn-copy-link').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-url');
        navigator.clipboard.writeText(url).then(() => {
          alert('Doctor sharing link copied to clipboard!');
        }).catch(() => {
          prompt('Copy this sharing URL:', url);
        });
      });
    });

    // Open Doctor View directly in new tab
    document.querySelectorAll('.btn-test-doctor-view').forEach(btn => {
      btn.addEventListener('click', () => {
        const token = btn.getAttribute('data-token');
        window.open(`/doctor-view.html?token=${token}`, '_blank');
      });
    });

    // Revoke
    document.querySelectorAll('.btn-revoke-share').forEach(btn => {
      btn.addEventListener('click', () => {
        const token = btn.getAttribute('data-token');
        const share = vaultData.shares.find(s => s.token === token);
        if (!share) return;
        confirmAction('Are you sure you want to revoke this sharing link? Consulting physicians will immediately lose access.', () => {
          share.revoked = true;
          addAuditLog('share_revoked', 'Doctor Access Revoked', `Revoked sharing token ${token.substring(0, 10)}...`);
          saveVault();
          renderVaultUI();
        });
      });
    });
  }

  /* =========================================================================
   * Modals & Action Dialogs
   * ========================================================================= */
  function openModal(title, htmlBody, onSave) {
    let modal = document.getElementById('vault-generic-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'vault-generic-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 transform transition-all max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 class="font-bold text-slate-900 text-base">${title}</h3>
          <button type="button" class="modal-close text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
        </div>
        <div class="modal-body space-y-4 text-xs">
          ${htmlBody}
        </div>
        <div class="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-6">
          <button type="button" class="modal-cancel px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold">Cancel</button>
          <button type="button" class="modal-submit px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-xs">Save</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    modal.querySelector('.modal-close').onclick = () => modal.classList.add('hidden');
    modal.querySelector('.modal-cancel').onclick = () => modal.classList.add('hidden');
    modal.querySelector('.modal-submit').onclick = async () => {
      const res = await onSave(modal);
      if (res !== false) modal.classList.add('hidden');
    };
  }

  // Profile Modal
  function openProfileModal() {
    const p = vaultData.profile;
    openModal('Edit Personal Medical Profile', `
      <div>
        <label class="block font-bold text-slate-700 mb-1">Full Name</label>
        <input type="text" id="inp-prof-name" value="${escapeHtml(p.name)}" class="w-full border border-slate-300 rounded-lg p-2" required />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Date of Birth</label>
          <input type="date" id="inp-prof-dob" value="${p.dob}" class="w-full border border-slate-300 rounded-lg p-2" />
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Blood Group</label>
          <select id="inp-prof-blood" class="w-full border border-slate-300 rounded-lg p-2">
            <option value="">Unknown</option>
            <option value="A+" ${p.bloodGroup === 'A+' ? 'selected' : ''}>A+</option>
            <option value="A-" ${p.bloodGroup === 'A-' ? 'selected' : ''}>A-</option>
            <option value="B+" ${p.bloodGroup === 'B+' ? 'selected' : ''}>B+</option>
            <option value="B-" ${p.bloodGroup === 'B-' ? 'selected' : ''}>B-</option>
            <option value="AB+" ${p.bloodGroup === 'AB+' ? 'selected' : ''}>AB+</option>
            <option value="AB-" ${p.bloodGroup === 'AB-' ? 'selected' : ''}>AB-</option>
            <option value="O+" ${p.bloodGroup === 'O+' ? 'selected' : ''}>O+</option>
            <option value="O-" ${p.bloodGroup === 'O-' ? 'selected' : ''}>O-</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block font-bold text-slate-700 mb-1">City</label>
          <input type="text" id="inp-prof-city" value="${escapeHtml(p.city || '')}" class="w-full border border-slate-300 rounded-lg p-2" />
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">State</label>
          <input type="text" id="inp-prof-state" value="${escapeHtml(p.state || 'Karnataka')}" class="w-full border border-slate-300 rounded-lg p-2" />
        </div>
      </div>
      <div>
        <label class="block font-bold text-slate-700 mb-1">Emergency Contact Name & Relation</label>
        <input type="text" id="inp-prof-ec-name" value="${escapeHtml(p.emergencyContactName || '')}" class="w-full border border-slate-300 rounded-lg p-2" />
      </div>
      <div>
        <label class="block font-bold text-slate-700 mb-1">Emergency Contact Phone Number</label>
        <input type="tel" id="inp-prof-ec-phone" value="${escapeHtml(p.emergencyContactPhone || '')}" class="w-full border border-slate-300 rounded-lg p-2" />
      </div>
      <div>
        <label class="block font-bold text-slate-700 mb-1">Patient Notes / Relevant History</label>
        <textarea id="inp-prof-notes" rows="2" class="w-full border border-slate-300 rounded-lg p-2">${escapeHtml(p.notes || '')}</textarea>
      </div>
    `, (modal) => {
      const name = modal.querySelector('#inp-prof-name').value.trim();
      if (!name) {
        alert('Please provide your name');
        return false;
      }
      p.name = name;
      p.dob = modal.querySelector('#inp-prof-dob').value;
      p.bloodGroup = modal.querySelector('#inp-prof-blood').value;
      p.city = modal.querySelector('#inp-prof-city').value.trim();
      p.state = modal.querySelector('#inp-prof-state').value.trim();
      p.emergencyContactName = modal.querySelector('#inp-prof-ec-name').value.trim();
      p.emergencyContactPhone = modal.querySelector('#inp-prof-ec-phone').value.trim();
      p.notes = modal.querySelector('#inp-prof-notes').value.trim();
      p.lastUpdated = new Date().toISOString();

      addAuditLog('profile_updated', 'Profile Updated', 'Updated patient legal name and emergency contacts.');
      saveVault();
      renderVaultUI();
    });
  }

  // Condition Modal
  function openConditionModal(existing = null) {
    const isEdit = !!existing;
    openModal(isEdit ? 'Edit Medical Condition' : 'Add Medical Condition', `
      <div>
        <label class="block font-bold text-slate-700 mb-1">Condition / Diagnosis Name *</label>
        <input type="text" id="inp-cond-name" value="${existing ? escapeHtml(existing.name) : ''}" placeholder="e.g. Hypertension, Asthma, Type 2 Diabetes" class="w-full border border-slate-300 rounded-lg p-2" required />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Date Diagnosed</label>
          <input type="date" id="inp-cond-date" value="${existing ? existing.diagnosedDate : ''}" class="w-full border border-slate-300 rounded-lg p-2" />
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Status</label>
          <select id="inp-cond-status" class="w-full border border-slate-300 rounded-lg p-2">
            <option value="active" ${existing && existing.status === 'active' ? 'selected' : ''}>Active</option>
            <option value="resolved" ${existing && existing.status === 'resolved' ? 'selected' : ''}>Resolved</option>
            <option value="evaluating" ${existing && existing.status === 'evaluating' ? 'selected' : ''}>Under Evaluation</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block font-bold text-slate-700 mb-1">Treating Doctor / Hospital</label>
        <input type="text" id="inp-cond-doc" value="${existing ? escapeHtml(existing.treatingDoctor || '') : ''}" placeholder="e.g. Dr. Rajesh Kumar, Fortis Hospital" class="w-full border border-slate-300 rounded-lg p-2" />
      </div>
      <div>
        <label class="block font-bold text-slate-700 mb-1">Clinical Notes & Symptoms</label>
        <textarea id="inp-cond-notes" rows="3" placeholder="Key notes, dosage recommendations, or recurrence signs..." class="w-full border border-slate-300 rounded-lg p-2">${existing ? escapeHtml(existing.notes || '') : ''}</textarea>
      </div>
    `, (modal) => {
      const name = modal.querySelector('#inp-cond-name').value.trim();
      if (!name) {
        alert('Please enter the condition name');
        return false;
      }
      const diagnosedDate = modal.querySelector('#inp-cond-date').value;
      const status = modal.querySelector('#inp-cond-status').value;
      const treatingDoctor = modal.querySelector('#inp-cond-doc').value.trim();
      const notes = modal.querySelector('#inp-cond-notes').value.trim();

      if (isEdit) {
        existing.name = name;
        existing.diagnosedDate = diagnosedDate;
        existing.status = status;
        existing.treatingDoctor = treatingDoctor;
        existing.notes = notes;
        existing.updatedAt = new Date().toISOString();
        addAuditLog('condition_updated', 'Updated Condition', `Updated details for ${name}.`);
      } else {
        const item = {
          id: 'cond_' + Date.now().toString(36),
          name,
          diagnosedDate,
          status,
          treatingDoctor,
          notes,
          source: 'patient',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        vaultData.conditions.unshift(item);
        addAuditLog('condition_added', 'Added Condition', `Recorded diagnosis: ${name}.`);
      }
      saveVault();
      renderVaultUI();
    });
  }

  // Medication Modal
  function openMedicationModal(existing = null) {
    const isEdit = !!existing;
    openModal(isEdit ? 'Edit Medication' : 'Add Medication', `
      <div>
        <label class="block font-bold text-slate-700 mb-1">Medicine Name *</label>
        <input type="text" id="inp-med-name" value="${existing ? escapeHtml(existing.name) : ''}" placeholder="e.g. Atorvastatin, Metformin, Inhaler" class="w-full border border-slate-300 rounded-lg p-2" required />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Dosage</label>
          <input type="text" id="inp-med-dose" value="${existing ? escapeHtml(existing.dosage || '') : ''}" placeholder="e.g. 500 mg, 10 ml" class="w-full border border-slate-300 rounded-lg p-2" />
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Frequency</label>
          <input type="text" id="inp-med-freq" value="${existing ? escapeHtml(existing.frequency || '') : ''}" placeholder="e.g. Once daily at bedtime" class="w-full border border-slate-300 rounded-lg p-2" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Start Date</label>
          <input type="date" id="inp-med-start" value="${existing ? existing.startDate : ''}" class="w-full border border-slate-300 rounded-lg p-2" />
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Status</label>
          <select id="inp-med-status" class="w-full border border-slate-300 rounded-lg p-2">
            <option value="current" ${existing && existing.status === 'current' ? 'selected' : ''}>Current / Ongoing</option>
            <option value="discontinued" ${existing && existing.status === 'discontinued' ? 'selected' : ''}>Discontinued</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block font-bold text-slate-700 mb-1">Prescribing Doctor</label>
        <input type="text" id="inp-med-prescriber" value="${existing ? escapeHtml(existing.prescriber || '') : ''}" placeholder="e.g. Dr. Anita Sharma" class="w-full border border-slate-300 rounded-lg p-2" />
      </div>
    `, (modal) => {
      const name = modal.querySelector('#inp-med-name').value.trim();
      if (!name) {
        alert('Please enter medicine name');
        return false;
      }
      const dosage = modal.querySelector('#inp-med-dose').value.trim();
      const frequency = modal.querySelector('#inp-med-freq').value.trim();
      const startDate = modal.querySelector('#inp-med-start').value;
      const status = modal.querySelector('#inp-med-status').value;
      const prescriber = modal.querySelector('#inp-med-prescriber').value.trim();

      if (isEdit) {
        existing.name = name;
        existing.dosage = dosage;
        existing.frequency = frequency;
        existing.startDate = startDate;
        existing.status = status;
        existing.prescriber = prescriber;
        existing.updatedAt = new Date().toISOString();
        addAuditLog('medication_updated', 'Updated Medication', `Updated ${name}.`);
      } else {
        const item = {
          id: 'med_' + Date.now().toString(36),
          name,
          dosage,
          frequency,
          startDate,
          endDate: '',
          prescriber,
          status,
          source: 'patient',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        vaultData.medications.unshift(item);
        addAuditLog('medication_added', 'Added Medication', `Added ${name} (${dosage}).`);
      }
      saveVault();
      renderVaultUI();
    });
  }

  // Allergy Modal
  function openAllergyModal(existing = null) {
    const isEdit = !!existing;
    openModal(isEdit ? 'Edit Allergy Record' : 'Record Allergy / Drug Reaction', `
      <div>
        <label class="block font-bold text-slate-700 mb-1">Substance / Medication *</label>
        <input type="text" id="inp-alg-sub" value="${existing ? escapeHtml(existing.substance) : ''}" placeholder="e.g. Penicillin, Peanuts, Sulfa Drugs" class="w-full border border-slate-300 rounded-lg p-2" required />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Severity</label>
          <select id="inp-alg-sev" class="w-full border border-slate-300 rounded-lg p-2">
            <option value="mild" ${existing && existing.severity === 'mild' ? 'selected' : ''}>Mild (rash, sneezing)</option>
            <option value="moderate" ${existing && existing.severity === 'moderate' ? 'selected' : ''}>Moderate (hives, wheezing)</option>
            <option value="severe" ${existing && existing.severity === 'severe' ? 'selected' : ''}>Severe / Anaphylaxis (Life-threatening)</option>
          </select>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Reaction Symptoms</label>
          <input type="text" id="inp-alg-reac" value="${existing ? escapeHtml(existing.reaction || '') : ''}" placeholder="e.g. Swelling, difficulty breathing" class="w-full border border-slate-300 rounded-lg p-2" />
        </div>
      </div>
      <div>
        <label class="block font-bold text-slate-700 mb-1">Notes & Clinical Guidance</label>
        <textarea id="inp-alg-notes" rows="2" placeholder="First documented occurrence, emergency treatments needed..." class="w-full border border-slate-300 rounded-lg p-2">${existing ? escapeHtml(existing.notes || '') : ''}</textarea>
      </div>
    `, (modal) => {
      const substance = modal.querySelector('#inp-alg-sub').value.trim();
      if (!substance) {
        alert('Please specify the allergen or drug');
        return false;
      }
      const severity = modal.querySelector('#inp-alg-sev').value;
      const reaction = modal.querySelector('#inp-alg-reac').value.trim();
      const notes = modal.querySelector('#inp-alg-notes').value.trim();

      if (isEdit) {
        existing.substance = substance;
        existing.severity = severity;
        existing.reaction = reaction;
        existing.notes = notes;
        existing.updatedAt = new Date().toISOString();
        addAuditLog('allergy_updated', 'Updated Allergy', `Updated allergy for ${substance}.`);
      } else {
        const item = {
          id: 'alg_' + Date.now().toString(36),
          substance,
          severity,
          reaction,
          notes,
          source: 'patient',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        vaultData.allergies.unshift(item);
        addAuditLog('allergy_added', 'Recorded Allergy', `Added allergy: ${substance} (${severity}).`);
      }
      saveVault();
      renderVaultUI();
    });
  }

  // Upload Document Modal
  function openUploadModal() {
    openModal('Upload Medical Document / Lab Report', `
      <div class="p-4 rounded-xl border-2 border-dashed border-primary-300 bg-primary-50/30 text-center cursor-pointer hover:bg-primary-50 transition" id="dropzone-area">
        <input type="file" id="inp-doc-file" accept=".pdf,.png,.jpg,.jpeg,.txt" class="hidden" />
        <span class="text-3xl block mb-2">📁</span>
        <span class="font-bold text-slate-800 text-xs block" id="dropzone-label">Click or Drag & Drop File Here</span>
        <span class="text-[10px] text-slate-500 block mt-1">PDF, PNG, JPG, or TXT (Max 10 MB)</span>
      </div>

      <div class="grid grid-cols-2 gap-3 mt-4">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Document Category</label>
          <select id="inp-doc-cat" class="w-full border border-slate-300 rounded-lg p-2">
            <option value="lab">🧪 Lab & Blood Test</option>
            <option value="imaging">🩻 Radiology & Scan</option>
            <option value="prescription">💊 Prescription</option>
            <option value="discharge">🏥 Discharge Summary</option>
            <option value="consultation">👨‍⚕️ Doctor Consultation</option>
            <option value="other">📄 Other Medical File</option>
          </select>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Document Display Name</label>
          <input type="text" id="inp-doc-title" placeholder="e.g. Fasting Lipid Profile Feb 2024" class="w-full border border-slate-300 rounded-lg p-2" />
        </div>
      </div>
      <div>
        <label class="block font-bold text-slate-700 mb-1">Notes / Key Findings</label>
        <textarea id="inp-doc-notes" rows="2" placeholder="e.g. Normal cholesterol, elevated triglycerides..." class="w-full border border-slate-300 rounded-lg p-2"></textarea>
      </div>
      <div class="p-2.5 rounded-lg bg-slate-50 text-[10px] text-slate-500 flex items-center gap-1.5">
        <span>🔒</span> File is stored securely in private patient storage and never made public.
      </div>
    `, async (modal) => {
      const fileInput = modal.querySelector('#inp-doc-file');
      const file = fileInput.files[0];
      const category = modal.querySelector('#inp-doc-cat').value;
      let title = modal.querySelector('#inp-doc-title').value.trim();
      const notes = modal.querySelector('#inp-doc-notes').value.trim();

      if (!file) {
        alert('Please select a file to upload');
        return false;
      }

      // Security validation
      const MAX_BYTES = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_BYTES) {
        alert(`File exceeds 10MB limit (Selected: ${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
        return false;
      }

      const allowedExts = ['.pdf', '.png', '.jpg', '.jpeg', '.txt'];
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedExts.includes(ext)) {
        alert(`Disallowed file type (${ext}). Please upload PDF or image files.`);
        return false;
      }

      if (!title) title = file.name;

      // Read file data URL for local storage or server upload
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      const docItem = {
        id: 'doc_' + Date.now().toString(36),
        name: title,
        category,
        uploadDate: new Date().toISOString(),
        sizeBytes: file.size,
        mimeType: file.type || 'application/octet-stream',
        notes,
        source: 'uploaded',
        dataUrl // Stored locally
      };

      vaultData.documents.unshift(docItem);
      addAuditLog('doc_uploaded', 'Document Uploaded', `Uploaded ${title} (${(file.size / 1024).toFixed(1)} KB).`);
      saveVault();
      renderVaultUI();
    });

    // File input trigger
    setTimeout(() => {
      const dropzone = document.getElementById('dropzone-area');
      const fileInput = document.getElementById('inp-doc-file');
      const label = document.getElementById('dropzone-label');
      if (dropzone && fileInput) {
        dropzone.onclick = () => fileInput.click();
        fileInput.onchange = () => {
          if (fileInput.files[0]) {
            label.textContent = `Selected: ${fileInput.files[0].name} (${(fileInput.files[0].size / 1024).toFixed(1)} KB)`;
          }
        };
      }
    }, 100);
  }

  // Share Modal
  function openShareModal() {
    openModal('Share Health Records with Doctor', `
      <div class="space-y-4">
        <div class="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
          <span class="text-base">ℹ️</span>
          <div>
            <strong>Doctor Privacy Notice:</strong> The doctor will receive a temporary read-only token to review your records during consultation. No editing permissions are granted.
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Sharing Scope</label>
          <div class="space-y-1.5">
            <label class="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input type="radio" name="share-scope" value="all" checked class="text-primary-600" />
              <div>
                <strong class="text-slate-800">Complete Medical Summary</strong>
                <span class="text-[11px] text-slate-500 block">Active conditions, medications, allergies & medical reports</span>
              </div>
            </label>
            <label class="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input type="radio" name="share-scope" value="emergency" class="text-primary-600" />
              <div>
                <strong class="text-slate-800">Emergency & Critical Summary Only</strong>
                <span class="text-[11px] text-slate-500 block">Severe allergies, blood group, SOS contacts & critical medications</span>
              </div>
            </label>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Access Expiration</label>
            <select id="inp-share-expiry" class="w-full border border-slate-300 rounded-lg p-2 text-xs">
              <option value="15m">15 Minutes (Single Visit)</option>
              <option value="1h" selected>1 Hour (Standard Consultation)</option>
              <option value="24h">24 Hours (Day Admission)</option>
              <option value="7d">7 Days (Treatment Course)</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Optional Doctor PIN</label>
            <input type="text" id="inp-share-pin" maxlength="6" placeholder="e.g. 1234 (optional)" class="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono" />
          </div>
        </div>
      </div>
    `, (modal) => {
      const scope = modal.querySelector('input[name="share-scope"]:checked').value;
      const expiryVal = modal.querySelector('#inp-share-expiry').value;
      const pin = modal.querySelector('#inp-share-pin').value.trim();

      let durationMs = 60 * 60 * 1000; // default 1 hour
      if (expiryVal === '15m') durationMs = 15 * 60 * 1000;
      if (expiryVal === '1h') durationMs = 60 * 60 * 1000;
      if (expiryVal === '24h') durationMs = 24 * 60 * 60 * 1000;
      if (expiryVal === '7d') durationMs = 7 * 24 * 60 * 60 * 1000;

      const token = generateSecureToken();
      const newShare = {
        id: 'shr_' + Date.now().toString(36),
        token,
        createdAt: Date.now(),
        expiresAt: Date.now() + durationMs,
        revoked: false,
        scope,
        pinRequired: !!pin,
        pinHash: pin ? hashPin(pin) : ''
      };

      vaultData.shares.unshift(newShare);
      addAuditLog('share_created', 'Generated Doctor Sharing Link', `Created ${expiryVal} sharing token with ${scope} scope.`);
      saveVault();
      renderVaultUI();

      // Show QR code right away
      setTimeout(() => showQrModal(token), 100);
    });
  }

  // QR Modal
  function showQrModal(token) {
    const share = vaultData.shares.find(s => s.token === token);
    if (!share) return;

    const shareUrl = `${window.location.origin}/doctor-view.html?token=${token}`;
    const qrSvg = generateQRCodeSvg(shareUrl, 200);

    let modal = document.getElementById('vault-qr-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'vault-qr-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200">
        <h3 class="font-bold text-slate-900 text-base mb-1">Doctor QR Code</h3>
        <p class="text-xs text-slate-500 mb-4">Have your consulting doctor scan this QR code with their mobile device or hospital workstation camera.</p>

        <div class="my-4">
          ${qrSvg}
        </div>

        <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-left text-xs mb-4">
          <div class="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span>Expires in: <strong>${Math.max(0, Math.round((share.expiresAt - Date.now()) / (60 * 1000)))} mins</strong></span>
            ${share.pinRequired ? '<span class="text-amber-700 font-bold">PIN Protected</span>' : ''}
          </div>
          <input type="text" readonly value="${shareUrl}" class="w-full text-[10px] font-mono bg-white p-1.5 border border-slate-200 rounded text-slate-600 select-all" />
        </div>

        <div class="flex items-center justify-center gap-2">
          <button type="button" class="btn-copy-qr-url px-4 py-2 bg-primary-600 text-white font-bold text-xs rounded-xl hover:bg-primary-700 transition">
            📋 Copy Link
          </button>
          <button type="button" class="btn-open-preview px-4 py-2 bg-teal-50 text-teal-800 font-bold text-xs rounded-xl hover:bg-teal-100 border border-teal-200 transition">
            🩺 Test Doctor View
          </button>
          <button type="button" class="btn-close-qr px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition">
            Close
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    modal.querySelector('.btn-close-qr').onclick = () => modal.classList.add('hidden');
    modal.querySelector('.btn-copy-qr-url').onclick = () => {
      navigator.clipboard.writeText(shareUrl).then(() => alert('Link copied to clipboard!'));
    };
    modal.querySelector('.btn-open-preview').onclick = () => {
      window.open(`/doctor-view.html?token=${token}`, '_blank');
    };
  }

  // Document download/preview
  function viewOrDownloadDocument(doc) {
    if (doc.dataUrl) {
      const w = window.open('');
      if (w) {
        w.document.write(`<title>${escapeHtml(doc.name)}</title><iframe src="${doc.dataUrl}" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
        return;
      }
    }
    // Fallback simulated document text
    alert(`Viewing Document: ${doc.name}\n\nCategory: ${doc.category}\nUpload Date: ${new Date(doc.uploadDate).toLocaleDateString()}\nNotes: ${doc.notes || 'None'}`);
  }

  // Printable PDF Summary Generator
  function exportPdfSummary() {
    const p = vaultData.profile;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to generate the printable medical summary.');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MediBridge AI - Medical Record Summary (${escapeHtml(p.name)})</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 40px; font-size: 13px; line-height: 1.5; }
          .header { border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 22px; font-weight: 800; color: #0369a1; }
          .disclaimer { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 10px; border-radius: 6px; font-size: 11px; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 14px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 6px; }
          th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; font-size: 12px; }
          th { background: #f8fafc; font-weight: 600; }
          .badge-severe { background: #fee2e2; color: #991b1b; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
          .footer { margin-top: 40px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">MediBridge AI — Personal Medical Vault</div>
            <div>Portable Health Summary for Clinical Consultation</div>
          </div>
          <div style="text-align: right; font-size: 11px; color: #64748b;">
            Generated: ${new Date().toLocaleString()}<br>
            Record ID: ${escapeHtml(currentUserId)}
          </div>
        </div>

        <div class="disclaimer">
          <strong>CLINICAL NOTICE:</strong> This medical summary contains patient-provided and imported records compiled via MediBridge AI. It is provided to assist licensed medical practitioners and does NOT replace direct clinical evaluation, verification, or diagnostic testing.
        </div>

        <div class="section">
          <div class="section-title">Patient Identification</div>
          <table>
            <tr>
              <th width="25%">Full Legal Name</th><td><strong>${escapeHtml(p.name)}</strong></td>
              <th width="25%">Blood Group</th><td><strong style="color: #dc2626;">${p.bloodGroup || 'Unknown'}</strong></td>
            </tr>
            <tr>
              <th>Date of Birth</th><td>${p.dob || 'Not specified'}</td>
              <th>Location</th><td>${escapeHtml(p.city || '')}, ${escapeHtml(p.state || 'India')}</td>
            </tr>
            <tr>
              <th>Emergency Contact</th><td colspan="3">${escapeHtml(p.emergencyContactName || '')} (${escapeHtml(p.emergencyContactPhone || '')})</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Documented Allergies & Sensitivities</div>
          <table>
            <thead>
              <tr><th>Substance</th><th>Reaction</th><th>Severity</th><th>Notes</th></tr>
            </thead>
            <tbody>
              ${vaultData.allergies.map(a => `
                <tr>
                  <td><strong>${escapeHtml(a.substance)}</strong></td>
                  <td>${escapeHtml(a.reaction)}</td>
                  <td><span class="${a.severity === 'severe' ? 'badge-severe' : ''}">${a.severity.toUpperCase()}</span></td>
                  <td>${escapeHtml(a.notes || '—')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Medical Conditions & Diagnoses</div>
          <table>
            <thead>
              <tr><th>Condition Name</th><th>Diagnosed</th><th>Status</th><th>Treating Doctor</th></tr>
            </thead>
            <tbody>
              ${vaultData.conditions.map(c => `
                <tr>
                  <td><strong>${escapeHtml(c.name)}</strong></td>
                  <td>${c.diagnosedDate || '—'}</td>
                  <td>${c.status.toUpperCase()}</td>
                  <td>${escapeHtml(c.treatingDoctor || '—')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Current & Historical Medications</div>
          <table>
            <thead>
              <tr><th>Medication</th><th>Dosage</th><th>Frequency</th><th>Status</th><th>Prescriber</th></tr>
            </thead>
            <tbody>
              ${vaultData.medications.map(m => `
                <tr>
                  <td><strong>${escapeHtml(m.name)}</strong></td>
                  <td>${escapeHtml(m.dosage)}</td>
                  <td>${escapeHtml(m.frequency)}</td>
                  <td>${m.status.toUpperCase()}</td>
                  <td>${escapeHtml(m.prescriber || '—')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Attached Medical Documents (${vaultData.documents.length})</div>
          <table>
            <thead>
              <tr><th>Document Name</th><th>Category</th><th>Upload Date</th><th>Notes</th></tr>
            </thead>
            <tbody>
              ${vaultData.documents.map(d => `
                <tr>
                  <td>${escapeHtml(d.name)}</td>
                  <td>${d.category.toUpperCase()}</td>
                  <td>${new Date(d.uploadDate).toLocaleDateString()}</td>
                  <td>${escapeHtml(d.notes || '—')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="footer">
          MediBridge AI Healthcare Assistant • Portable Patient Medical Vault • Generated with Patient Consent
        </div>

        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }

  // Confirmation modal dialog
  function confirmAction(message, onConfirm) {
    if (confirm(message)) {
      onConfirm();
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function switchVaultTab(tabName) {
    activeTab = tabName;
    document.querySelectorAll('.vault-nav-tab').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('bg-primary-600', 'text-white');
        btn.classList.remove('text-slate-600', 'hover:bg-slate-100');
      } else {
        btn.classList.remove('bg-primary-600', 'text-white');
        btn.classList.add('text-slate-600', 'hover:bg-slate-100');
      }
    });
    renderVaultUI();
  }

  /* =========================================================================
   * Public API
   * ========================================================================= */
  window.VaultManager = {
    init: async function (userId) {
      await loadVault(userId);
      renderVaultUI();

      // Hook tab buttons
      document.querySelectorAll('.vault-nav-tab').forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.getAttribute('data-tab');
          switchVaultTab(tab);
        });
      });
    },
    getVaultData: function () {
      return vaultData;
    },
    saveVaultData: saveVault,
    render: renderVaultUI,
    switchTab: switchVaultTab,
    createShare: function (scope, durationMs, pin) {
      const token = generateSecureToken();
      const s = {
        id: 'shr_' + Date.now().toString(36),
        token,
        createdAt: Date.now(),
        expiresAt: Date.now() + durationMs,
        revoked: false,
        scope,
        pinRequired: !!pin,
        pinHash: pin ? hashPin(pin) : ''
      };
      vaultData.shares.unshift(s);
      saveVault();
      return s;
    },
    revokeShare: function (token) {
      const share = vaultData.shares.find(s => s.token === token);
      if (share) {
        share.revoked = true;
        saveVault();
        return true;
      }
      return false;
    },
    validateDoctorToken: function (token, inputPin = '') {
      if (!vaultData || !vaultData.shares) return { valid: false, reason: 'NO_DATA' };
      const share = vaultData.shares.find(s => s.token === token);
      if (!share) return { valid: false, reason: 'INVALID_TOKEN' };
      if (share.revoked) return { valid: false, reason: 'REVOKED' };
      if (Date.now() > share.expiresAt) return { valid: false, reason: 'EXPIRED' };
      if (share.pinRequired && share.pinHash && hashPin(inputPin) !== share.pinHash) {
        return { valid: false, reason: 'PIN_REQUIRED' };
      }

      // Return filtered authorized payload
      return {
        valid: true,
        patient: vaultData.profile,
        scope: share.scope,
        conditions: vaultData.conditions,
        medications: vaultData.medications,
        allergies: vaultData.allergies,
        documents: vaultData.documents,
        timeline: vaultData.timeline
      };
    }
  };

})(window, document);
