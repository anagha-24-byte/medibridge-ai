/**
 * MediBridge AI - Backend API Integration & Unit Tests
 */

const { server, db } = require('./server');
const http = require('http');

const PORT = 8089;

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('Starting MediBridge AI Server Tests on port', PORT);
  await new Promise(r => server.listen(PORT, r));

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`[FAIL] ${name}:`, e.message);
      failed++;
    }
  }

  // 1. Health check
  await test('GET /api/health returns ok', async () => {
    const res = await request({ hostname: 'localhost', port: PORT, path: '/api/health', method: 'GET' });
    if (res.status !== 200 || res.data.status !== 'ok') throw new Error(`Status ${res.status}`);
  });

  // 2. Auth login validation
  await test('POST /api/auth/login rejects invalid mobile', async () => {
    const res = await request(
      { hostname: 'localhost', port: PORT, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { name: 'Dr. Test', mobile: '123' }
    );
    if (res.status !== 400 || res.data.error !== 'INVALID_MOBILE') throw new Error(`Expected 400, got ${res.status}`);
  });

  // 3. Auth login success
  let token = null;
  await test('POST /api/auth/login succeeds with valid name and mobile', async () => {
    const res = await request(
      { hostname: 'localhost', port: PORT, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { name: 'Anagha Student', mobile: '9876543210' }
    );
    if (res.status !== 200 || !res.data.token) throw new Error(`Login failed: ${JSON.stringify(res.data)}`);
    token = res.data.token;
  });

  // 4. Verify auth /me
  await test('GET /api/auth/me returns user profile', async () => {
    const res = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.status !== 200 || res.data.user.name !== 'Anagha Student') throw new Error('Auth check failed');
  });

  // 5. Document explainer rejects non-medical text
  await test('POST /api/document/explain rejects non-medical text', async () => {
    const res = await request(
      { hostname: 'localhost', port: PORT, path: '/api/document/explain', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { text: 'The quick brown fox jumps over the lazy dog. Today the weather is sunny.', documentName: 'random.txt' }
    );
    if (res.status !== 400 || res.data.error !== 'NON_MEDICAL_DOCUMENT') throw new Error(`Expected rejection for non-medical text, got ${res.status}`);
  });

  // 6. Blood test parser extracts parameters
  await test('POST /api/bloodtest extracts hemoglobin and glucose', async () => {
    const res = await request(
      { hostname: 'localhost', port: PORT, path: '/api/bloodtest', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { text: 'Patient Lab Report:\nFasting Blood Glucose: 125 mg/dL\nHemoglobin: 11.2 g/dL\nTotal Cholesterol: 210 mg/dL', documentName: 'report.txt' }
    );
    if (res.status !== 200 || res.data.extractedValues.length < 2) throw new Error('Blood test extraction failed');
  });

  // 7. Appointments CRUD
  let aptId = null;
  await test('POST /api/appointments creates appointment', async () => {
    const futureDate = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
    const res = await request(
      {
        hostname: 'localhost',
        port: PORT,
        path: '/api/appointments',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      },
      {
        hospitalName: 'Victoria Hospital (BMCRI)',
        hospitalAddress: 'Fort Road, Bengaluru',
        hospitalPhone: '+91-80-26701150',
        date: futureDate,
        time: '10:00',
        purpose: 'Routine consultation follow-up',
        reminderEnabled: true,
        reminderTime: '1_hour_before',
        status: 'Reminder Saved'
      }
    );
    if (res.status !== 201 || !res.data.appointment) throw new Error('Create appointment failed');
    aptId = res.data.appointment.id;
  });

  await test('GET /api/appointments retrieves saved appointments for user', async () => {
    const res = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/appointments',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.status !== 200 || res.data.appointments.length === 0) throw new Error('Get appointments failed');
  });

  await test('DELETE /api/appointments/:id deletes appointment', async () => {
    const res = await request({
      hostname: 'localhost',
      port: PORT,
      path: `/api/appointments/${aptId}`,
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.status !== 200) throw new Error('Delete appointment failed');
  });

  server.close();
  console.log(`\nTests completed: ${passed} passed, ${failed} failed.`);
}

if (require.main === module) {
  runTests();
}
