const https = require('https');

const API_KEY = '75f4cb7043c463bdbe9eb0644a0c5bb6';

function request(method, hostname, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname,
      path,
      method,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };
    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        console.log(`\n[${method} https://${hostname}${path}] Status: ${res.statusCode}`);
        try { console.log(JSON.stringify(JSON.parse(raw), null, 2)); }
        catch { console.log(raw); }
        resolve({ status: res.statusCode, body: raw });
      });
    });
    req.on('error', e => { console.error('Error:', e.message); resolve(null); });
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  console.log('=== Testing kie.ai API ===\n');

  // Try common API base URLs
  const endpoints = [
    ['api.kie.ai', '/v1/models'],
    ['api.kie.ai', '/v1/video/models'],
    ['api.kie.ai', '/v1/'],
    ['kie.ai', '/api/v1/models'],
    ['api.kie.ai', '/v1/tasks'],
  ];

  for (const [host, path] of endpoints) {
    await request('GET', host, path, null);
  }
}

main();
