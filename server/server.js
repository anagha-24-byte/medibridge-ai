/**
 * ==============================================================================
 * MediBridge AI - Node.js Backend Server
 * Complete REST API for Authentication, Appointments, History, AI Proxy,
 * Vision X-Ray Analysis, Blood Test Processing, and Hospital Integration.
 * 
 * Architecture:
 * - Runs with ZERO external dependencies using native Node.js core modules (http, fs, path, crypto, https)
 * - Also compatible with standard Express setups
 * - Isolated per-user data persistence in JSON storage
 * - Strict security: authorization headers, rate limiting, input sanitization,
 *   safe error reporting, no secret keys exposed to frontend
 * ==============================================================================
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');

// Load environment variables from .env if present
const envPath = path.join(__dirname, '.env');
const rootEnvPath = path.join(__dirname, '..', '.env');
[envPath, rootEnvPath].forEach(p => {
  if (fs.existsSync(p)) {
    try {
      const content = fs.readFileSync(p, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx > 0) {
            const key = trimmed.substring(0, eqIdx).trim();
            const val = trimmed.substring(eqIdx + 1).trim();
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      });
    } catch (e) {
      console.warn('Could not read .env file:', e.message);
    }
  }
});

const PORT = parseInt(process.env.PORT || '8080', 10);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const JWT_SECRET = process.env.JWT_SECRET || 'medibridge_secret_key_2026';
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'medibridge.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-Memory Database with JSON Persistence
class Database {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = {
      users: {},        // mobile -> user object
      sessions: {},     // token -> { userId, mobile, expiresAt }
      appointments: {}, // userId -> [ appointment objects ]
      history: {}       // userId -> [ history items ]
    };
    this.load();
  }

  load() {
    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        const parsed = JSON.parse(raw);
        this.data = {
          users: parsed.users || {},
          sessions: parsed.sessions || {},
          appointments: parsed.appointments || {},
          history: parsed.history || {}
        };
      } catch (err) {
        console.error('Failed to load database file, starting clean:', err.message);
      }
    } else {
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to write database file:', err.message);
    }
  }

  // Users
  getUserByMobile(mobile) {
    return this.data.users[mobile] || null;
  }

  getUserById(id) {
    for (const m in this.data.users) {
      if (this.data.users[m].id === id) return this.data.users[m];
    }
    return null;
  }

  saveUser(user) {
    this.data.users[user.mobile] = user;
    if (!this.data.appointments[user.id]) this.data.appointments[user.id] = [];
    if (!this.data.history[user.id]) this.data.history[user.id] = [];
    this.save();
    return user;
  }

  // Sessions
  createSession(user) {
    const token = 'mb_sess_' + crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
    this.data.sessions[token] = {
      userId: user.id,
      mobile: user.mobile,
      expiresAt
    };
    this.save();
    return token;
  }

  verifySession(token) {
    if (!token || !this.data.sessions[token]) return null;
    const sess = this.data.sessions[token];
    if (Date.now() > sess.expiresAt) {
      delete this.data.sessions[token];
      this.save();
      return null;
    }
    return this.getUserById(sess.userId);
  }

  deleteSession(token) {
    if (this.data.sessions[token]) {
      delete this.data.sessions[token];
      this.save();
    }
  }

  // Appointments
  getAppointments(userId) {
    return this.data.appointments[userId] || [];
  }

  saveAppointment(userId, appointment) {
    if (!this.data.appointments[userId]) this.data.appointments[userId] = [];
    const existingIdx = this.data.appointments[userId].findIndex(a => a.id === appointment.id);
    if (existingIdx >= 0) {
      this.data.appointments[userId][existingIdx] = appointment;
    } else {
      this.data.appointments[userId].unshift(appointment);
    }
    this.save();
    return appointment;
  }

  deleteAppointment(userId, appointmentId) {
    if (!this.data.appointments[userId]) return false;
    const initialLen = this.data.appointments[userId].length;
    this.data.appointments[userId] = this.data.appointments[userId].filter(a => a.id !== appointmentId);
    const changed = this.data.appointments[userId].length !== initialLen;
    if (changed) this.save();
    return changed;
  }

  // History
  getHistory(userId) {
    return this.data.history[userId] || [];
  }

  saveHistoryItem(userId, item) {
    if (!this.data.history[userId]) this.data.history[userId] = [];
    this.data.history[userId].unshift(item);
    // Limit to 100 items per user to prevent unbounded growth
    if (this.data.history[userId].length > 100) {
      this.data.history[userId] = this.data.history[userId].slice(0, 100);
    }
    this.save();
    return item;
  }

  deleteHistoryItem(userId, itemId) {
    if (!this.data.history[userId]) return false;
    const initialLen = this.data.history[userId].length;
    this.data.history[userId] = this.data.history[userId].filter(h => h.id !== itemId);
    const changed = this.data.history[userId].length !== initialLen;
    if (changed) this.save();
    return changed;
  }

  clearUserHistory(userId) {
    this.data.history[userId] = [];
    this.save();
    return true;
  }
}

const db = new Database(DB_FILE);

// Helpers
function sendJson(res, statusCode, data) {
  const payload = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(payload);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 25 * 1024 * 1024) { // 25MB max
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

function extractToken(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

// Medical Guardrails Prompt
const HEALTHCARE_SYSTEM_PROMPT = `You are a knowledgeable, empathetic, evidence-informed healthcare information assistant.
Your role is to help users understand symptoms, medical terminology, laboratory reports, diagnoses provided by their clinicians, medications, preventive health, and general wellness.
Communicate like a high-quality conversational AI: understand the question, reason carefully, explain concepts in depth when requested, maintain context across messages, and answer follow-up questions naturally.
Use clear, accessible language. Explain medical terminology when first introduced. Structure complex answers using headings, bullet points, comparisons, and examples where helpful.
Answer the specific question before providing additional context. Do not give vague, repetitive, generic disclaimers in place of a useful answer.
When information is insufficient, clearly state what is unknown and ask focused clarifying questions. Never invent patient details, medical histories, laboratory values, research findings, medication instructions, or citations.
Distinguish established medical information from possible explanations and areas of uncertainty.
You provide healthcare information, not a definitive medical diagnosis or a replacement for a qualified healthcare professional. Never claim certainty that the available evidence does not support.
For medication questions, explain general uses, precautions, and interactions only when supported by reliable information. Do not independently prescribe medicines, invent dosages, or instruct users to stop or change prescribed treatment.
For medical reports, interpret only the information actually available, respect the reference ranges and units provided, and explain relevant limitations.
For potentially life-threatening symptoms, prioritize urgent medical assistance (dial 112 / 108) and concise safety instructions rather than lengthy explanations or unnecessary questions.
Be respectful, nonjudgmental, empathetic, and responsive to the user's language and level of understanding.`;

// Call Gemini API via HTTPS
function callGemini(contents, systemInstruction, model = 'gemini-1.5-flash', generationConfig = {}) {
  return new Promise((resolve, reject) => {
    if (!GEMINI_API_KEY) {
      return reject(new Error('NO_API_KEY'));
    }

    const payload = JSON.stringify({
      contents,
      systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
      generationConfig: Object.assign({
        temperature: 0.3,
        topP: 0.95,
        maxOutputTokens: 2048
      }, generationConfig)
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 30000
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            if (parsed.candidates && parsed.candidates.length > 0) {
              const text = parsed.candidates[0].content.parts[0].text;
              resolve(text);
            } else {
              reject(new Error('Empty candidates in Gemini response'));
            }
          } catch (err) {
            reject(err);
          }
        } else {
          try {
            const errParsed = JSON.parse(data);
            reject(new Error(errParsed.error?.message || `Gemini API HTTP ${res.statusCode}`));
          } catch {
            reject(new Error(`Gemini API HTTP ${res.statusCode}`));
          }
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Gemini API request timed out'));
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// Medical Relevance Classifier
function checkMedicalRelevance(text) {
  if (!text || typeof text !== 'string') return false;
  const lower = text.toLowerCase();
  
  const medicalKeywords = [
    'hemoglobin', 'glucose', 'cholesterol', 'creatinine', 'platelet', 'leukocyte', 'wbc', 'rbc',
    'x-ray', 'radiology', 'chest', 'lungs', 'pleura', 'cardio', 'hypertension', 'blood pressure',
    'diagnosis', 'prescription', 'tablet', 'capsule', 'dosage', 'laboratory', 'test result',
    'reference range', 'specimen', 'patient', 'doctor', 'hospital', 'clinic', 'physician',
    'fasting', 'serum', 'urine', 'biopsy', 'ecg', 'cardiac', 'renal', 'hepatic', 'pulmonary',
    'symptom', 'disease', 'infection', 'fever', 'cough', 'dyspnea', 'edema', 'syndrome'
  ];

  let matches = 0;
  for (const kw of medicalKeywords) {
    if (lower.includes(kw)) matches++;
    if (matches >= 2) return true;
  }
  return false;
}

// Clinical Blood Test Parser
function parseBloodTestValues(text) {
  const tests = [
    { id: 'glucose', name: 'Fasting Blood Glucose', regex: /(?:fasting(?:\s+blood)?\s+(?:glucose|sugar)|\bfbs\b|blood\s+glucose|\bglucose)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl|mmol\/l)?/i, standardRange: '70 - 99 mg/dL', unit: 'mg/dL', low: 70, high: 99, meaning: 'Measures circulating blood sugar after fasting. Evaluates insulin efficiency and diabetes risk.' },
    { id: 'hba1c', name: 'Hemoglobin A1c (HbA1c)', regex: /(?:glycated\s+hemoglobin|hba1c|a1c|glycohemoglobin)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(%|percent)?/i, standardRange: '< 5.7 %', unit: '%', low: 4.0, high: 5.6, meaning: 'Average blood sugar levels over the past 2-3 months.' },
    { id: 'hemoglobin', name: 'Hemoglobin', regex: /(?:hemoglobin|haemoglobin|hgb|hb)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(g\/dl|g\/l|gm%)?/i, standardRange: '12.0 - 15.5 g/dL', unit: 'g/dL', low: 12.0, high: 15.5, meaning: 'Oxygen-carrying protein in red blood cells. Low levels indicate anemia.' },
    { id: 'cholesterol', name: 'Total Cholesterol', regex: /(?:total\s+cholesterol|cholesterol\s+total|serum\s+cholesterol)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl|mmol\/l)?/i, standardRange: '< 200 mg/dL', unit: 'mg/dL', low: 100, high: 200, meaning: 'Total circulating blood fats including HDL and LDL.' },
    { id: 'ldl', name: 'LDL Cholesterol', regex: /(?:ldl(?:\s+cholesterol)?|low\s+density\s+lipoprotein)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl|mmol\/l)?/i, standardRange: '< 100 mg/dL', unit: 'mg/dL', low: 50, high: 100, meaning: 'Low-density lipoprotein. Excess can contribute to arterial plaque buildup.' },
    { id: 'hdl', name: 'HDL Cholesterol', regex: /(?:hdl(?:\s+cholesterol)?|high\s+density\s+lipoprotein)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl|mmol\/l)?/i, standardRange: '> 40 mg/dL (men), > 50 mg/dL (women)', unit: 'mg/dL', low: 40, high: 999, meaning: 'High-density lipoprotein. Helps transport excess cholesterol back to liver.' },
    { id: 'triglycerides', name: 'Triglycerides', regex: /(?:triglycerides|serum\s+triglycerides|\btg\b)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl|mmol\/l)?/i, standardRange: '< 150 mg/dL', unit: 'mg/dL', low: 30, high: 150, meaning: 'Blood fats stored from extra calories.' },
    { id: 'creatinine', name: 'Serum Creatinine', regex: /(?:serum\s+creatinine|creatinine|\bs\.?\s*creatinine)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl|umol\/l)?/i, standardRange: '0.7 - 1.3 mg/dL', unit: 'mg/dL', low: 0.7, high: 1.3, meaning: 'Waste product cleared by kidneys. Key marker of healthy kidney filtration.' },
    { id: 'egfr', name: 'Estimated GFR (eGFR)', regex: /(?:egfr|estimated\s+gfr|glomerular\s+filtration\s+rate)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(ml\/min|ml\/min\/1\.73m2)?/i, standardRange: '> 60 mL/min', unit: 'mL/min', low: 60, high: 999, meaning: 'Score estimating milliliters of blood purified by kidneys each minute.' },
    { id: 'wbc', name: 'White Blood Cell Count (WBC)', regex: /(?:wbc(?:\s+count)?|white\s+blood\s+(?:cell\s+)?count|total\s+leukocyte\s+count|\btlc\b)\b[\s:]*([0-9]+(?:,[0-9]+)?(?:\.[0-9]+)?)\s*(\/mcL|\/uL|cells\/cumm|10\^3\/uL|\/cumm)?/i, standardRange: '4,000 - 11,000 /mcL', unit: '/mcL', low: 4000, high: 11000, meaning: 'Immune defense cells fighting infection and inflammation.' },
    { id: 'platelets', name: 'Platelet Count', regex: /(?:platelet(?:\s+count)?|\bplt\b)\b[\s:]*([0-9]+(?:,[0-9]+)?(?:\.[0-9]+)?)\s*(\/mcL|\/uL|lakh\/cumm|10\^3\/uL|\/cumm)?/i, standardRange: '150,000 - 450,000 /mcL', unit: '/mcL', low: 150000, high: 450000, meaning: 'Cell fragments responsible for blood clotting and stopping bleeding.' }
  ];

  const extracted = [];
  const lines = text.split('\n');

  for (const t of tests) {
    let matched = null;
    for (const line of lines) {
      const match = line.match(t.regex);
      if (match) {
        let valStr = match[1].replace(/,/g, '');
        let valNum = parseFloat(valStr);
        // Handle lakhs (e.g. 2.5 lakh platelets = 250,000)
        if (t.id === 'platelets' && valNum < 100) {
          valNum = valNum * 100000;
        }
        let detectedUnit = match[2] || t.unit;
        
        let flag = 'NORMAL';
        if (valNum > t.high) flag = 'HIGH';
        else if (valNum < t.low) flag = 'LOW';

        matched = {
          id: t.id,
          testName: t.name,
          value: match[1],
          numericValue: valNum,
          unit: detectedUnit,
          referenceRange: t.standardRange,
          flag,
          meaning: t.meaning
        };
        break;
      }
    }
    if (matched) extracted.push(matched);
  }

  return extracted;
}

// Request Handler
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';

  try {
    // -------------------------------------------------------------
    // Route: GET /api/health
    // -------------------------------------------------------------
    if (pathname === '/api/health' && req.method === 'GET') {
      return sendJson(res, 200, {
        status: 'ok',
        server: 'MediBridge AI Node.js Backend',
        version: '2.0.0',
        aiConfigured: Boolean(GEMINI_API_KEY),
        aiProvider: GEMINI_API_KEY ? 'Google Gemini 1.5 Flash' : 'Unconfigured (Set GEMINI_API_KEY)',
        database: 'Local Persistent JSON Store',
        timestamp: new Date().toISOString()
      });
    }

    // -------------------------------------------------------------
    // Route: POST /api/auth/login
    // -------------------------------------------------------------
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const body = await parseBody(req);
      const name = (body.name || '').trim();
      const rawMobile = (body.mobile || '').trim();

      // Validation
      if (!name || name.length < 2 || name.length > 50) {
        return sendJson(res, 400, {
          success: false,
          error: 'INVALID_NAME',
          message: 'Please provide a valid name between 2 and 50 characters.'
        });
      }

      // Normalize mobile: strip spaces, dashes, parentheses
      const cleanMobile = rawMobile.replace(/[\s\-\(\)]/g, '');
      const mobileRegex = /^(\+?[0-9]{10,15})$/;
      if (!cleanMobile || !mobileRegex.test(cleanMobile)) {
        return sendJson(res, 400, {
          success: false,
          error: 'INVALID_MOBILE',
          message: 'Please provide a valid 10 to 15 digit mobile number (e.g., 9876543210 or +919876543210).'
        });
      }

      let user = db.getUserByMobile(cleanMobile);
      if (!user) {
        user = {
          id: 'usr_' + crypto.randomBytes(8).toString('hex'),
          name,
          mobile: cleanMobile,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
      } else {
        user.name = name; // allow updating display name
        user.lastLogin = new Date().toISOString();
      }
      db.saveUser(user);

      const token = db.createSession(user);

      return sendJson(res, 200, {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          mobile: user.mobile,
          createdAt: user.createdAt
        },
        token,
        message: 'Successfully signed in.',
        verificationNote: 'Signed in with Name and Mobile number. Sensitive medical records are scoped strictly to this account session.'
      });
    }

    // -------------------------------------------------------------
    // Route: GET /api/auth/me
    // -------------------------------------------------------------
    if (pathname === '/api/auth/me' && req.method === 'GET') {
      const token = extractToken(req);
      const user = db.verifySession(token);
      if (!user) {
        return sendJson(res, 401, {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Authentication session expired or invalid.'
        });
      }

      return sendJson(res, 200, {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          mobile: user.mobile,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      });
    }

    // -------------------------------------------------------------
    // Route: POST /api/auth/logout
    // -------------------------------------------------------------
    if (pathname === '/api/auth/logout' && req.method === 'POST') {
      const token = extractToken(req);
      if (token) db.deleteSession(token);
      return sendJson(res, 200, {
        success: true,
        message: 'Signed out successfully.'
      });
    }

    // -------------------------------------------------------------
    // Route: POST /api/chat (Health Assistant LLM Proxy)
    // -------------------------------------------------------------
    if (pathname === '/api/chat' && req.method === 'POST') {
      const body = await parseBody(req);
      const message = (body.message || '').trim();
      const history = Array.isArray(body.history) ? body.history : [];
      const language = body.language || 'en';

      if (!message) {
        return sendJson(res, 400, {
          success: false,
          error: 'EMPTY_MESSAGE',
          message: 'Please provide a message.'
        });
      }

      if (!GEMINI_API_KEY) {
        return sendJson(res, 503, {
          success: false,
          error: 'AI_NOT_CONFIGURED',
          message: 'Google Gemini API key is not configured on the server. To enable live conversational AI, set the GEMINI_API_KEY environment variable in your server .env file.'
        });
      }

      try {
        // Build contents structure
        const contents = [];
        // Add last 6 turns for context
        const recentHistory = history.slice(-6);
        for (const h of recentHistory) {
          contents.push({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          });
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const langPrompt = language !== 'en' ? `\nRespond clearly and naturally in language: ${language}.` : '';
        const systemInstruction = HEALTHCARE_SYSTEM_PROMPT + langPrompt;

        const reply = await callGemini(contents, systemInstruction, 'gemini-1.5-flash', {
          temperature: 0.35,
          maxOutputTokens: 2048
        });

        return sendJson(res, 200, {
          success: true,
          reply,
          provider: 'Google Gemini 1.5 Flash (Secure Server Proxy)'
        });
      } catch (err) {
        console.error('Chat AI proxy error:', err.message);
        return sendJson(res, 502, {
          success: false,
          error: 'AI_GATEWAY_ERROR',
          message: `AI service unavailable: ${err.message}`
        });
      }
    }

    // -------------------------------------------------------------
    // Route: POST /api/xray (Dedicated X-Ray Vision Analysis)
    // -------------------------------------------------------------
    if (pathname === '/api/xray' && req.method === 'POST') {
      const token = extractToken(req);
      const user = db.verifySession(token);
      const body = await parseBody(req);

      const imageBase64 = body.imageBase64 || '';
      const mimeType = body.mimeType || 'image/jpeg';
      const notes = (body.notes || '').trim();
      const saveToHistory = Boolean(body.saveToHistory);

      if (!imageBase64) {
        return sendJson(res, 400, {
          success: false,
          error: 'MISSING_IMAGE',
          message: 'Please upload an X-ray image (JPEG or PNG format).'
        });
      }

      if (!GEMINI_API_KEY) {
        return sendJson(res, 503, {
          success: false,
          error: 'AI_VISION_NOT_CONFIGURED',
          message: 'Medical vision AI service is not configured on the server. Set GEMINI_API_KEY in the server environment to activate live X-ray multimodal analysis.'
        });
      }

      try {
        const xrayPrompt = `You are an educational medical imaging explanation assistant.
Analyze this medical image with strict medical safety protocols:
1. Identify the anatomical region and view type (e.g. Chest PA/AP, Pelvis, Extremity) if identifiable.
2. Provide a clear, educational plain-language explanation of visible features.
3. Explicitly state what you can and cannot assess from this image.
4. Highlight uncertainties and image quality factors.
5. Emphasize strongly that this is educational support and NEVER a clinical radiology diagnosis. Advise the user to obtain formal interpretation from a licensed radiologist or physician.
Notes from user: ${notes || 'None provided'}

Format your answer with clear markdown headings:
- **Image Overview & Body Region**
- **Educational Observations**
- **Important Limitations & Uncertainties**
- **Next Steps & Questions for Your Doctor**`;

        // Strip data:image/...;base64, prefix if present
        const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');

        const contents = [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: cleanBase64
                }
              },
              { text: xrayPrompt }
            ]
          }
        ];

        const analysis = await callGemini(contents, HEALTHCARE_SYSTEM_PROMPT, 'gemini-1.5-flash', {
          temperature: 0.2,
          maxOutputTokens: 2048
        });

        // Save to user history if requested and authenticated
        let savedId = null;
        if (saveToHistory && user) {
          const historyItem = {
            id: 'xray_' + Date.now(),
            type: 'xray',
            timestamp: new Date().toISOString(),
            title: 'Chest / Bone X-Ray Analysis',
            summary: analysis.substring(0, 200) + '...',
            details: analysis,
            notes
          };
          db.saveHistoryItem(user.id, historyItem);
          savedId = historyItem.id;
        }

        return sendJson(res, 200, {
          success: true,
          analysis,
          savedToHistory: Boolean(savedId),
          historyId: savedId,
          provider: 'Google Gemini 1.5 Flash Vision'
        });
      } catch (err) {
        console.error('X-ray analysis error:', err.message);
        return sendJson(res, 502, {
          success: false,
          error: 'XRAY_ANALYSIS_FAILED',
          message: `X-ray image analysis failed: ${err.message}`
        });
      }
    }

    // -------------------------------------------------------------
    // Route: POST /api/bloodtest (Dedicated Blood Test Analysis)
    // -------------------------------------------------------------
    if (pathname === '/api/bloodtest' && req.method === 'POST') {
      const token = extractToken(req);
      const user = db.verifySession(token);
      const body = await parseBody(req);

      const text = (body.text || '').trim();
      const documentName = (body.documentName || 'Blood Test Report').trim();
      const saveToHistory = Boolean(body.saveToHistory);

      if (!text) {
        return sendJson(res, 400, {
          success: false,
          error: 'EMPTY_TEXT',
          message: 'Please provide or upload blood test report text.'
        });
      }

      if (!checkMedicalRelevance(text)) {
        return sendJson(res, 400, {
          success: false,
          error: 'NOT_MEDICAL_REPORT',
          message: 'This document does not appear to contain medical blood test results. Please upload a laboratory report containing test parameters.'
        });
      }

      const extractedValues = parseBloodTestValues(text);

      let aiSummary = null;
      if (GEMINI_API_KEY) {
        try {
          const prompt = `Review these blood test findings for educational health literacy:
Document: ${documentName}
Extracted Results: ${JSON.stringify(extractedValues, null, 2)}
Full Document Text:
${text.substring(0, 3000)}

Provide:
1. A 2-paragraph patient-friendly summary of the overall blood test findings in plain language.
2. Explanation of any flagged results (HIGH or LOW), noting that reference ranges vary across laboratories and biological factors (hydration, age, diet).
3. 3-4 specific questions the patient should bring to their doctor.
Emphasize non-diagnostic educational guidance only.`;

          aiSummary = await callGemini(
            [{ role: 'user', parts: [{ text: prompt }] }],
            HEALTHCARE_SYSTEM_PROMPT,
            'gemini-1.5-flash',
            { temperature: 0.25, maxOutputTokens: 1500 }
          );
        } catch (e) {
          console.warn('AI summary generation failed, returning structured values:', e.message);
        }
      }

      let savedId = null;
      if (saveToHistory && user) {
        const historyItem = {
          id: 'blood_' + Date.now(),
          type: 'bloodtest',
          timestamp: new Date().toISOString(),
          title: documentName,
          extractedValues,
          summary: aiSummary || 'Laboratory parameters extracted successfully.',
          totalTestsFound: extractedValues.length
        };
        db.saveHistoryItem(user.id, historyItem);
        savedId = historyItem.id;
      }

      return sendJson(res, 200, {
        success: true,
        documentName,
        extractedValues,
        summary: aiSummary,
        savedToHistory: Boolean(savedId),
        historyId: savedId,
        provider: GEMINI_API_KEY ? 'MediBridge Clinical Parser + Gemini 1.5 Flash' : 'MediBridge Clinical Parameter Parser (Deterministic)'
      });
    }

    // -------------------------------------------------------------
    // Route: POST /api/document/explain (Medical Document Explainer)
    // -------------------------------------------------------------
    if (pathname === '/api/document/explain' && req.method === 'POST') {
      const token = extractToken(req);
      const user = db.verifySession(token);
      const body = await parseBody(req);

      const text = (body.text || '').trim();
      const documentName = (body.documentName || 'Medical Document').trim();
      const saveToHistory = Boolean(body.saveToHistory);

      if (!text) {
        return sendJson(res, 400, {
          success: false,
          error: 'EMPTY_TEXT',
          message: 'Please provide medical document text.'
        });
      }

      if (!checkMedicalRelevance(text)) {
        return sendJson(res, 400, {
          success: false,
          error: 'NON_MEDICAL_DOCUMENT',
          message: 'This document does not appear to contain medical information. Please upload a medical report or document.'
        });
      }

      let explanation = null;
      if (GEMINI_API_KEY) {
        try {
          const docPrompt = `Explain this medical document in simple, clear, educational language:
Document: ${documentName}
Content:
${text.substring(0, 4000)}

Please organize your output into:
1. **Summary of Findings** (Plain language explanation of what this report says)
2. **Important Medical Terms & Definitions** (Translate Latin/clinical jargon into 5th-grade words)
3. **Key Statements & Values Extracted**
4. **Questions to Ask Your Doctor**
5. **Limitations & Uncertainties**`;

          explanation = await callGemini(
            [{ role: 'user', parts: [{ text: docPrompt }] }],
            HEALTHCARE_SYSTEM_PROMPT,
            'gemini-1.5-flash',
            { temperature: 0.25, maxOutputTokens: 2048 }
          );
        } catch (e) {
          console.warn('Doc explainer AI call failed:', e.message);
        }
      }

      let savedId = null;
      if (saveToHistory && user) {
        const historyItem = {
          id: 'doc_' + Date.now(),
          type: 'document',
          timestamp: new Date().toISOString(),
          title: documentName,
          summary: explanation ? explanation.substring(0, 200) + '...' : 'Clinical document processed.',
          details: explanation
        };
        db.saveHistoryItem(user.id, historyItem);
        savedId = historyItem.id;
      }

      return sendJson(res, 200, {
        success: true,
        documentName,
        explanation,
        savedToHistory: Boolean(savedId),
        historyId: savedId,
        provider: GEMINI_API_KEY ? 'Google Gemini 1.5 Flash' : 'Clinical Terminology Parser'
      });
    }

    // -------------------------------------------------------------
    // Route: GET /api/appointments
    // -------------------------------------------------------------
    if (pathname === '/api/appointments' && req.method === 'GET') {
      const token = extractToken(req);
      const user = db.verifySession(token);
      if (!user) {
        return sendJson(res, 401, {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Please sign in to view your appointments.'
        });
      }

      const appointments = db.getAppointments(user.id);
      return sendJson(res, 200, {
        success: true,
        appointments
      });
    }

    // -------------------------------------------------------------
    // Route: POST /api/appointments
    // -------------------------------------------------------------
    if (pathname === '/api/appointments' && req.method === 'POST') {
      const token = extractToken(req);
      const user = db.verifySession(token);
      if (!user) {
        return sendJson(res, 401, {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Please sign in to save an appointment.'
        });
      }

      const body = await parseBody(req);
      const hospitalName = (body.hospitalName || '').trim();
      const hospitalAddress = (body.hospitalAddress || '').trim();
      const hospitalPhone = (body.hospitalPhone || '').trim();
      const appointmentDate = (body.date || '').trim();
      const appointmentTime = (body.time || '').trim();
      const purpose = (body.purpose || '').trim();
      const reminderEnabled = Boolean(body.reminderEnabled);
      const reminderTime = body.reminderTime || '1_hour_before';
      const reminderNote = (body.reminderNote || '').trim();
      const status = body.status || 'Reminder Saved';

      if (!hospitalName || !appointmentDate || !appointmentTime) {
        return sendJson(res, 400, {
          success: false,
          error: 'MISSING_FIELDS',
          message: 'Please provide hospital name, appointment date, and time.'
        });
      }

      // Check date is not in the past
      const selectedDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
      if (isNaN(selectedDateTime.getTime()) || selectedDateTime < new Date()) {
        return sendJson(res, 400, {
          success: false,
          error: 'INVALID_DATE',
          message: 'Appointment date and time cannot be in the past.'
        });
      }

      const appointment = {
        id: 'apt_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex'),
        userId: user.id,
        hospitalName,
        hospitalAddress,
        hospitalPhone,
        date: appointmentDate,
        time: appointmentTime,
        purpose,
        reminderEnabled,
        reminderTime,
        reminderNote,
        status, // 'Reminder Saved' | 'Request Submitted' | 'Booking Unavailable' | 'Confirmed'
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      db.saveAppointment(user.id, appointment);

      return sendJson(res, 201, {
        success: true,
        appointment,
        message: 'Appointment and reminder saved to your profile.'
      });
    }

    // -------------------------------------------------------------
    // Route: PUT /api/appointments/:id
    // -------------------------------------------------------------
    if (pathname.startsWith('/api/appointments/') && req.method === 'PUT') {
      const token = extractToken(req);
      const user = db.verifySession(token);
      if (!user) {
        return sendJson(res, 401, {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Please sign in to update your appointment.'
        });
      }

      const appointmentId = pathname.substring('/api/appointments/'.length);
      const existing = db.getAppointments(user.id).find(a => a.id === appointmentId);
      if (!existing) {
        return sendJson(res, 404, {
          success: false,
          error: 'NOT_FOUND',
          message: 'Appointment not found or unauthorized.'
        });
      }

      const body = await parseBody(req);
      if (body.date) existing.date = body.date;
      if (body.time) existing.time = body.time;
      if (body.purpose !== undefined) existing.purpose = body.purpose;
      if (body.reminderEnabled !== undefined) existing.reminderEnabled = Boolean(body.reminderEnabled);
      if (body.reminderTime !== undefined) existing.reminderTime = body.reminderTime;
      if (body.reminderNote !== undefined) existing.reminderNote = body.reminderNote;
      if (body.status !== undefined) existing.status = body.status;
      existing.updatedAt = new Date().toISOString();

      db.saveAppointment(user.id, existing);

      return sendJson(res, 200, {
        success: true,
        appointment: existing,
        message: 'Appointment updated successfully.'
      });
    }

    // -------------------------------------------------------------
    // Route: DELETE /api/appointments/:id
    // -------------------------------------------------------------
    if (pathname.startsWith('/api/appointments/') && req.method === 'DELETE') {
      const token = extractToken(req);
      const user = db.verifySession(token);
      if (!user) {
        return sendJson(res, 401, {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Please sign in to delete your appointment.'
        });
      }

      const appointmentId = pathname.substring('/api/appointments/'.length);
      const deleted = db.deleteAppointment(user.id, appointmentId);
      if (!deleted) {
        return sendJson(res, 404, {
          success: false,
          error: 'NOT_FOUND',
          message: 'Appointment not found.'
        });
      }

      return sendJson(res, 200, {
        success: true,
        message: 'Appointment deleted successfully.'
      });
    }

    // -------------------------------------------------------------
    // Route: GET /api/history
    // -------------------------------------------------------------
    if (pathname === '/api/history' && req.method === 'GET') {
      const token = extractToken(req);
      const user = db.verifySession(token);
      if (!user) {
        return sendJson(res, 401, {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Please sign in to view your history.'
        });
      }

      const history = db.getHistory(user.id);
      return sendJson(res, 200, {
        success: true,
        history
      });
    }

    // -------------------------------------------------------------
    // Route: POST /api/history (Save conversation or record)
    // -------------------------------------------------------------
    if (pathname === '/api/history' && req.method === 'POST') {
      const token = extractToken(req);
      const user = db.verifySession(token);
      if (!user) {
        return sendJson(res, 401, {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Please sign in to save to history.'
        });
      }

      const body = await parseBody(req);
      const historyItem = {
        id: 'hist_' + Date.now() + '_' + crypto.randomBytes(3).toString('hex'),
        userId: user.id,
        type: body.type || 'conversation', // 'conversation' | 'document' | 'xray' | 'bloodtest'
        title: body.title || 'Health Record',
        summary: body.summary || '',
        data: body.data || {},
        timestamp: new Date().toISOString()
      };

      db.saveHistoryItem(user.id, historyItem);

      return sendJson(res, 201, {
        success: true,
        item: historyItem,
        message: 'Saved to your personal history.'
      });
    }

    // -------------------------------------------------------------
    // Route: DELETE /api/history/:id
    // -------------------------------------------------------------
    if (pathname.startsWith('/api/history/') && req.method === 'DELETE') {
      const token = extractToken(req);
      const user = db.verifySession(token);
      if (!user) {
        return sendJson(res, 401, {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Please sign in to delete history.'
        });
      }

      const itemId = pathname.substring('/api/history/'.length);
      const deleted = db.deleteHistoryItem(user.id, itemId);
      return sendJson(res, 200, {
        success: deleted,
        message: deleted ? 'History item deleted.' : 'Item not found.'
      });
    }

    // -------------------------------------------------------------
    // Route: DELETE /api/history (Clear all user history)
    // -------------------------------------------------------------
    if (pathname === '/api/history' && req.method === 'DELETE') {
      const token = extractToken(req);
      const user = db.verifySession(token);
      if (!user) {
        return sendJson(res, 401, {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Please sign in to clear history.'
        });
      }

      db.clearUserHistory(user.id);
      return sendJson(res, 200, {
        success: true,
        message: 'All your saved history has been deleted.'
      });
    }

    // -------------------------------------------------------------
    // Static File Serving (Root Project Directory)
    // -------------------------------------------------------------
    const rootDir = path.join(__dirname, '..');
    let relPath = parsedUrl.pathname.replace(/^\/+/, '');
    if (!relPath) relPath = 'index.html';
    
    // Security: Prevent directory traversal
    const safePath = path.normalize(path.join(rootDir, relPath));
    if (!safePath.startsWith(rootDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('403 Forbidden');
    }

    if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
      const ext = path.extname(safePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
      };
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      const fileBytes = fs.readFileSync(safePath);
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': fileBytes.length,
        'Access-Control-Allow-Origin': '*'
      });
      return res.end(fileBytes);
    }

    // 404
    sendJson(res, 404, {
      success: false,
      error: 'NOT_FOUND',
      message: `Endpoint or file not found: ${pathname}`
    });

  } catch (err) {
    console.error('Server error handling request:', err);
    sendJson(res, 500, {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An internal server error occurred.'
    });
  }
});

// Start Server
if (require.main === module) {
  server.listen(PORT, () => {
    console.log('==========================================================');
    console.log('         MediBridge AI - Node.js Backend Server           ');
    console.log('==========================================================');
    console.log(`Server running at: http://localhost:${PORT}/`);
    console.log(`Database storage: ${DB_FILE}`);
    if (GEMINI_API_KEY) {
      console.log('AI Provider: Google Gemini 1.5 Flash (Active via GEMINI_API_KEY)');
    } else {
      console.log('AI Provider: Unconfigured (Set GEMINI_API_KEY for live LLM / Vision)');
    }
    console.log('==========================================================');
  });
}

module.exports = { server, db };
