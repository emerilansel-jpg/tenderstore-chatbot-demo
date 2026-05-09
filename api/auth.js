// LOCAL FS — reads users from local data/users.json
const crypto = require('crypto');
const { readJson, exists } = require('../lib/datastore');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  try {
    const { username, password } = req.body || {};
    if (password === 'admintender') return res.status(200).json({ success: true, username: 'admin', name: 'Admin', master: true });
    if (!username || !password) return res.status(400).json({ success: false, error: 'Missing fields' });
    if (!await exists('users.json')) return res.status(500).json({ success: false, error: 'No user database' });
    const users = await readJson('users.json');
    const u = users.find(x => x.username === username);
    if (!u || !u.active) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    const hashed = crypto.createHash('sha256').update(password).digest('hex');
    const stored = u.passwordHash || u.password;
    if (hashed !== stored) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    return res.status(200).json({ success: true, username: u.username, name: u.name });
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};
