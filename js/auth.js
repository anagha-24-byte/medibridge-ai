/**
 * ==============================================================================
 * MediBridge AI - Authentication, Session & User History Controller
 * Handles user login with Name + Mobile number, session token management,
 * authorization headers, user history persistence, and privacy safeguards.
 * ==============================================================================
 */

class AuthManager {
  constructor() {
    this.token = localStorage.getItem('medibridge_auth_token') || null;
    this.user = JSON.parse(localStorage.getItem('medibridge_user_profile') || 'null');
    this.apiBase = window.location.origin; // Same origin when served by server
    this.isServerOnline = false;
    this.checkServerHealth();
  }

  async checkServerHealth() {
    try {
      const res = await fetch('/api/health', { method: 'GET' });
      if (res.ok) {
        this.isServerOnline = true;
      }
    } catch {
      this.isServerOnline = false;
    }
  }

  isAuthenticated() {
    return Boolean(this.user && this.user.name && this.user.mobile);
  }

  getAuthHeader() {
    return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
  }

  /**
   * Validate user input
   */
  validateInput(name, mobile) {
    const cleanName = (name || '').trim();
    const cleanMobile = (mobile || '').trim().replace(/[\s\-\(\)]/g, '');

    if (!cleanName || cleanName.length < 2 || cleanName.length > 50) {
      return { valid: false, error: 'Please enter a valid full name (at least 2 letters).' };
    }

    // Accept 10-15 digits with optional leading +
    const mobileRegex = /^(\+?[0-9]{10,15})$/;
    if (!cleanMobile || !mobileRegex.test(cleanMobile)) {
      return { valid: false, error: 'Please enter a valid 10-digit mobile number (e.g. 9876543210).' };
    }

    return { valid: true, cleanName, cleanMobile };
  }

  /**
   * Sign In User
   */
  async login(name, mobile) {
    const check = this.validateInput(name, mobile);
    if (!check.valid) {
      return { success: false, error: check.error };
    }

    // Try backend authentication
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: check.cleanName, mobile: check.cleanMobile })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          this.token = data.token;
          this.user = data.user;
          localStorage.setItem('medibridge_auth_token', this.token);
          localStorage.setItem('medibridge_user_profile', JSON.stringify(this.user));
          this.updateNavUI();
          return { success: true, user: this.user, verificationNote: data.verificationNote };
        }
      }
    } catch (e) {
      // Backend not running (static hosting / offline preview mode)
    }

    // Offline / Client-Side Fallback Session
    const offlineUser = {
      id: 'usr_local_' + Date.now(),
      name: check.cleanName,
      mobile: check.cleanMobile,
      createdAt: new Date().toISOString(),
      offlineMode: true
    };
    this.token = 'mb_sess_local_' + Date.now();
    this.user = offlineUser;
    localStorage.setItem('medibridge_auth_token', this.token);
    localStorage.setItem('medibridge_user_profile', JSON.stringify(this.user));
    this.updateNavUI();

    return {
      success: true,
      user: offlineUser,
      verificationNote: 'Signed in in client-side profile mode. (Connect backend server for multi-device sync).'
    };
  }

  /**
   * Sign Out
   */
  async logout() {
    if (this.token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: Object.assign({ 'Content-Type': 'application/json' }, this.getAuthHeader())
        });
      } catch {}
    }

    this.token = null;
    this.user = null;
    localStorage.removeItem('medibridge_auth_token');
    localStorage.removeItem('medibridge_user_profile');
    this.updateNavUI();
    return { success: true };
  }

  /**
   * Save Item to User History
   */
  async saveHistory(type, title, summary, data = {}) {
    if (!this.isAuthenticated()) return null;

    const historyItem = {
      id: 'hist_' + Date.now(),
      userId: this.user.id,
      type, // 'conversation' | 'document' | 'xray' | 'bloodtest'
      title,
      summary,
      data,
      timestamp: new Date().toISOString()
    };

    // Try backend
    try {
      const res = await fetch('/api/history', {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, this.getAuthHeader()),
        body: JSON.stringify(historyItem)
      });
      if (res.ok) {
        const json = await res.json();
        return json.item || historyItem;
      }
    } catch {}

    // Local fallback
    const key = `medibridge_hist_${this.user.id}`;
    const localHist = JSON.parse(localStorage.getItem(key) || '[]');
    localHist.unshift(historyItem);
    localStorage.setItem(key, JSON.stringify(localHist.slice(0, 50)));
    return historyItem;
  }

  /**
   * Get User History
   */
  async getHistory() {
    if (!this.isAuthenticated()) return [];

    try {
      const res = await fetch('/api/history', {
        method: 'GET',
        headers: this.getAuthHeader()
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.history)) {
          return json.history;
        }
      }
    } catch {}

    const key = `medibridge_hist_${this.user.id}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  /**
   * Delete History Item
   */
  async deleteHistory(itemId) {
    if (!this.isAuthenticated()) return false;

    try {
      const res = await fetch(`/api/history/${itemId}`, {
        method: 'DELETE',
        headers: this.getAuthHeader()
      });
      if (res.ok) return true;
    } catch {}

    const key = `medibridge_hist_${this.user.id}`;
    let localHist = JSON.parse(localStorage.getItem(key) || '[]');
    localHist = localHist.filter(h => h.id !== itemId);
    localStorage.setItem(key, JSON.stringify(localHist));
    return true;
  }

  /**
   * Clear All History
   */
  async clearAllHistory() {
    if (!this.isAuthenticated()) return false;

    try {
      const res = await fetch('/api/history', {
        method: 'DELETE',
        headers: this.getAuthHeader()
      });
      if (res.ok) return true;
    } catch {}

    const key = `medibridge_hist_${this.user.id}`;
    localStorage.removeItem(key);
    return true;
  }

  /**
   * Update Navigation Header UI for Auth State
   */
  updateNavUI() {
    const authBtn = document.getElementById('nav-auth-btn');
    const authUserPill = document.getElementById('nav-user-pill');
    const authUserName = document.getElementById('nav-user-name');

    if (!authBtn || !authUserPill) return;

    if (this.isAuthenticated()) {
      authBtn.classList.add('hidden');
      authUserPill.classList.remove('hidden');
      if (authUserName) {
        authUserName.textContent = this.user.name.split(' ')[0];
      }
    } else {
      authBtn.classList.remove('hidden');
      authUserPill.classList.add('hidden');
    }
  }
}

// Global instance
window.authManager = new AuthManager();
