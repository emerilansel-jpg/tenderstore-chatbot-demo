// LOCAL FS — saves prospects to data/prospects.json (append-only)
const { readJson, writeJson, exists } = require('../lib/datastore');
const FILE = 'prospects.json';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  try {
    const { name, wa, source } = req.body || {};
    if (!name || !wa) return res.status(400).json({ success: false, error: 'Missing name or wa' });
    if (!await exists(FILE)) await writeJson(FILE, []);
    const list = await readJson(FILE);
    const arr = Array.isArray(list) ? list : [];
    arr.push({ name, wa, source: source || 'web', createdAt: new Date().toISOString() });
    await writeJson(FILE, arr);
    return res.status(200).json({ success: true, total: arr.length });
  } catch (err) {
    console.error('save-prospect error:', err);
    return res.status(500).json({ success: false, error: 'Server error: ' + err.message });
  }
};
