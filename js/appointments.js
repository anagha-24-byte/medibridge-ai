/**
 * ==============================================================================
 * MediBridge AI - Appointments & Reminders Engine
 * Complete workflow for scheduling, managing, and tracking hospital appointments,
 * setting reminders, and coordinating with the Nearby Hospitals directory.
 * 
 * CORE ACCURACY RULE: Distinguishes between:
 * - 'Confirmed' (real provider confirmation received)
 * - 'Request Submitted' (request logged, pending hospital response)
 * - 'Reminder Saved' (patient planner & reminder created, no hospital booking)
 * - 'Booking Unavailable' (hospital requires direct phone or walk-in)
 * ==============================================================================
 */

class AppointmentsManager {
  constructor() {
    this.appointments = [];
    this.selectedHospital = null;
    this.init();
  }

  async init() {
    await this.loadAppointments();
    this.setupReminderCheck();
  }

  getAuth() {
    return window.authManager || null;
  }

  /**
   * Load appointments from backend or local storage
   */
  async loadAppointments() {
    const auth = this.getAuth();
    if (auth && auth.isAuthenticated()) {
      try {
        const res = await fetch('/api/appointments', {
          method: 'GET',
          headers: auth.getAuthHeader()
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.appointments)) {
            this.appointments = json.appointments;
            this.renderAppointmentsList();
            return;
          }
        }
      } catch (e) {
        // Fall back to local storage
      }
    }

    // Local storage fallback
    const local = localStorage.getItem('medibridge_appointments');
    this.appointments = local ? JSON.parse(local) : [];
    this.renderAppointmentsList();
  }

  /**
   * Save an appointment
   */
  async createAppointment(data) {
    const auth = this.getAuth();
    const now = new Date();
    const apptDate = new Date(`${data.date}T${data.time}`);

    if (isNaN(apptDate.getTime()) || apptDate < now) {
      return { success: false, error: 'Appointment date and time cannot be in the past.' };
    }

    // Default status if hospital does not provide real-time API
    const status = data.status || 'Reminder Saved';

    const newAppt = {
      id: 'apt_' + Date.now(),
      hospitalName: data.hospitalName,
      hospitalAddress: data.hospitalAddress || 'Address not specified',
      hospitalPhone: data.hospitalPhone || '',
      date: data.date,
      time: data.time,
      purpose: data.purpose || 'General Consultation',
      reminderEnabled: Boolean(data.reminderEnabled),
      reminderTime: data.reminderTime || '1_hour_before',
      reminderNote: data.reminderNote || '',
      status: status,
      createdAt: new Date().toISOString()
    };

    // Try backend
    if (auth && auth.isAuthenticated()) {
      try {
        const res = await fetch('/api/appointments', {
          method: 'POST',
          headers: Object.assign({ 'Content-Type': 'application/json' }, auth.getAuthHeader()),
          body: JSON.stringify(newAppt)
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.appointment) {
            this.appointments.unshift(json.appointment);
            this.saveLocalBackup();
            this.renderAppointmentsList();
            return { success: true, appointment: json.appointment };
          }
        }
      } catch {}
    }

    // Offline / Local save
    this.appointments.unshift(newAppt);
    this.saveLocalBackup();
    this.renderAppointmentsList();
    return { success: true, appointment: newAppt };
  }

  /**
   * Update / Reschedule appointment
   */
  async updateAppointment(id, updates) {
    const auth = this.getAuth();
    const idx = this.appointments.findIndex(a => a.id === id);
    if (idx === -1) return { success: false, error: 'Appointment not found' };

    const updated = Object.assign({}, this.appointments[idx], updates, {
      updatedAt: new Date().toISOString()
    });

    if (auth && auth.isAuthenticated()) {
      try {
        const res = await fetch(`/api/appointments/${id}`, {
          method: 'PUT',
          headers: Object.assign({ 'Content-Type': 'application/json' }, auth.getAuthHeader()),
          body: JSON.stringify(updates)
        });
        if (res.ok) {
          this.appointments[idx] = updated;
          this.saveLocalBackup();
          this.renderAppointmentsList();
          return { success: true, appointment: updated };
        }
      } catch {}
    }

    this.appointments[idx] = updated;
    this.saveLocalBackup();
    this.renderAppointmentsList();
    return { success: true, appointment: updated };
  }

  /**
   * Delete an appointment
   */
  async deleteAppointment(id) {
    const auth = this.getAuth();
    if (auth && auth.isAuthenticated()) {
      try {
        await fetch(`/api/appointments/${id}`, {
          method: 'DELETE',
          headers: auth.getAuthHeader()
        });
      } catch {}
    }

    this.appointments = this.appointments.filter(a => a.id !== id);
    this.saveLocalBackup();
    this.renderAppointmentsList();
    return { success: true };
  }

  saveLocalBackup() {
    localStorage.setItem('medibridge_appointments', JSON.stringify(this.appointments));
  }

  /**
   * Check browser reminders periodically
   */
  setupReminderCheck() {
    if ('Notification' in window && Notification.permission === 'default') {
      // Permission can be requested when user toggles reminder
    }

    // Check every minute
    setInterval(() => {
      this.checkDueReminders();
    }, 60000);
  }

  checkDueReminders() {
    const now = new Date();
    this.appointments.forEach(apt => {
      if (!apt.reminderEnabled || apt.notified) return;

      const apptDate = new Date(`${apt.date}T${apt.time}`);
      const diffMs = apptDate - now;
      const diffMinutes = Math.floor(diffMs / 60000);

      let thresholdMinutes = 60;
      if (apt.reminderTime === '15_min_before') thresholdMinutes = 15;
      if (apt.reminderTime === '3_hours_before') thresholdMinutes = 180;
      if (apt.reminderTime === '1_day_before') thresholdMinutes = 1440;

      if (diffMinutes <= thresholdMinutes && diffMinutes >= 0) {
        apt.notified = true;
        this.saveLocalBackup();
        this.triggerNotification(apt);
      }
    });
  }

  triggerNotification(apt) {
    const title = `MediBridge Reminder: ${apt.hospitalName}`;
    const body = `Your appointment is scheduled for ${apt.date} at ${apt.time}. Notes: ${apt.purpose || 'Routine checkup'}`;

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: 'assets/favicon.ico' });
    }

    if (window.showAppToast) {
      window.showAppToast(`⏰ Reminder: Appointment at ${apt.hospitalName} at ${apt.time}`);
    }
  }

  /**
   * Pre-fill appointment from hospital selection
   */
  selectHospitalForAppointment(hospital) {
    this.selectedHospital = hospital;
    const nameInput = document.getElementById('appt-hospital-name');
    const addressInput = document.getElementById('appt-hospital-address');
    const phoneInput = document.getElementById('appt-hospital-phone');

    if (nameInput) nameInput.value = hospital.name || '';
    if (addressInput) addressInput.value = hospital.address || '';
    if (phoneInput) phoneInput.value = hospital.phone || '';

    // Switch to appointments section
    if (window.navigateToSection) {
      window.navigateToSection('appointments');
    }

    if (window.showAppToast) {
      window.showAppToast(`Selected: ${hospital.name}`);
    }
  }

  /**
   * Render Appointments List UI
   */
  renderAppointmentsList() {
    const listEl = document.getElementById('appointments-list-container');
    const emptyEl = document.getElementById('appointments-empty-state');
    if (!listEl) return;

    if (this.appointments.length === 0) {
      listEl.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('hidden');
      return;
    }

    if (emptyEl) emptyEl.classList.add('hidden');

    const now = new Date();

    const html = this.appointments.map(apt => {
      const apptDate = new Date(`${apt.date}T${apt.time}`);
      const isPast = isNaN(apptDate.getTime()) ? false : (apptDate < now);

      // Status pill styling
      let statusBadge = '';
      switch (apt.status) {
        case 'Confirmed':
          statusBadge = '<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">✅ Confirmed</span>';
          break;
        case 'Request Submitted':
          statusBadge = '<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">⏳ Request Submitted</span>';
          break;
        case 'Booking Unavailable':
          statusBadge = '<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">⚠️ Call / Walk-In Only</span>';
          break;
        default:
          statusBadge = '<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200">📌 Reminder Saved</span>';
      }

      return `
        <div class="p-4 rounded-xl border ${isPast ? 'bg-slate-50/70 border-slate-200 opacity-80' : 'bg-white border-slate-200 shadow-2xs hover:border-teal-300'} transition flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="font-bold text-slate-900 text-sm">${escapeHtml(apt.hospitalName)}</h4>
              ${statusBadge}
              ${isPast ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 text-slate-700">Past</span>' : ''}
            </div>
            <p class="text-xs text-slate-500 flex items-center gap-2">
              <span>📅 <strong>${escapeHtml(apt.date)}</strong> at <strong>${escapeHtml(apt.time)}</strong></span>
              ${apt.reminderEnabled ? '<span class="text-teal-700 font-medium">🔔 Reminder Active</span>' : ''}
            </p>
            <p class="text-xs text-slate-600">${escapeHtml(apt.purpose || 'Routine Consultation')}</p>
            ${apt.hospitalPhone ? `
              <p class="text-xs text-slate-500">
                📞 Tel: <a href="tel:${escapeHtml(apt.hospitalPhone)}" class="text-teal-700 hover:underline font-medium">${escapeHtml(apt.hospitalPhone)}</a>
              </p>
            ` : ''}
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button type="button" class="cancel-appt-btn px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold transition" data-id="${apt.id}">
              Delete Record
            </button>
          </div>
        </div>
      `;
    }).join('');

    listEl.innerHTML = html;

    // Attach delete listeners
    listEl.querySelectorAll('.cancel-appt-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this appointment record?')) {
          await this.deleteAppointment(id);
          if (window.showAppToast) window.showAppToast('Appointment deleted.');
        }
      });
    });
  }
}

// Global instance
window.appointmentsManager = new AppointmentsManager();
