/**
 * ==============================================================================
 * MediBridge AI - Dedicated X-Ray Analysis Engine
 * Handles medical X-ray image upload, validation, preview, multimodal AI submission,
 * strict non-diagnostic educational reporting, and optional history persistence.
 * ==============================================================================
 */

class XrayAnalysisManager {
  constructor() {
    this.currentImageBase64 = null;
    this.currentMimeType = null;
    this.currentFileName = null;
    this.isProcessing = false;
  }

  /**
   * Validate image file
   */
  validateImageFile(file) {
    if (!file) return { valid: false, error: 'No file selected.' };

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Please upload a valid image file in JPEG or PNG format. (DICOM files require dedicated PACS viewer).'
      };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Image file is too large. Please upload an image under 10MB.'
      };
    }

    return { valid: true };
  }

  /**
   * Load image file to base64
   */
  loadImageFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.currentImageBase64 = e.target.result;
        this.currentMimeType = file.type;
        this.currentFileName = file.name;
        resolve(this.currentImageBase64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Clear loaded image
   */
  clearImage() {
    this.currentImageBase64 = null;
    this.currentMimeType = null;
    this.currentFileName = null;
  }

  /**
   * Submit to backend or execute client fallback
   */
  async analyzeXray(notes = '', saveToHistory = false) {
    if (!this.currentImageBase64) {
      return {
        success: false,
        error: 'NO_IMAGE',
        message: 'Please upload an X-ray image to begin analysis.'
      };
    }

    this.isProcessing = true;

    // Check if user has an auth token
    const auth = window.authManager || null;
    const authHeaders = auth && auth.isAuthenticated() ? auth.getAuthHeader() : {};

    try {
      const res = await fetch('/api/xray', {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders),
        body: JSON.stringify({
          imageBase64: this.currentImageBase64,
          mimeType: this.currentMimeType,
          notes,
          saveToHistory
        })
      });

      this.isProcessing = false;

      if (res.ok) {
        const json = await res.json();
        return json;
      } else {
        const errJson = await res.json().catch(() => ({}));
        if (errJson.error === 'AI_VISION_NOT_CONFIGURED') {
          return {
            success: false,
            error: 'AI_VISION_NOT_CONFIGURED',
            message: 'Live multimodal vision model is not configured on the server. Please configure GEMINI_API_KEY to activate real-time X-ray computer vision analysis.'
          };
        }
        return {
          success: false,
          error: errJson.error || 'SERVER_ERROR',
          message: errJson.message || 'Image analysis service failed to process the request.'
        };
      }
    } catch (e) {
      this.isProcessing = false;
      // Backend not running (static mode)
      return {
        success: false,
        error: 'BACKEND_OFFLINE',
        message: 'The AI backend server is not reachable. To use X-ray computer vision analysis, run start-server.ps1 or node server/server.js.'
      };
    }
  }
}

// Global instance
window.xrayManager = new XrayAnalysisManager();
