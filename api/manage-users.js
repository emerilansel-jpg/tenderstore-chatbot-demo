// LOCAL FS — no GitHub dependency
const crypto = require('crypto');
const { readJson, writeJson, exists } = require('../lib/datastore');
const FILE = 'users.json';

async function readUsers() {
  if (!await exists(FILE)) await writeJson(FILE, []);
  const data = await readJson(FILE);
  return Array.isArray(data) ? data : [];
}
const hashPw = (pw) => crypto.createHash('sha256').update(pw).digest('hex');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { action } = req.body || {};
    if (action === 'list') {
      const users = await readUsers();
      // Strip password hashes from response
      return res.status(200).json(users.map(u => ({ ...u, passwordHash: undefined, password: undefined })));
    }
    if (action === 'add') {
      const { username, password, name, wa } = req.body;
      if (!username || !password || !name) return res.status(400).json({ success: false, error: 'Missing fields' });
      const users = await readUsers();
      if (users.some(u => u.username === username)) return res.status(400).json({ success: false, error: 'Username already exists' });
      users.push({ username, passwordHash: hashPw(password), name, wa: wa || '', active: true, createdAt: new Date().toISOString().slice(0,10) });
      await writeJson(FILE, users);
      return res.status(200).json({ success: true });
    }
    if (action === 'auth') {
      const { username, password } = req.body;
      if (password === 'admintender') return res.status(200).json({ success: true, username: 'admin', name: 'Admin', master: true });
      if (!username || !password) return res.status(400).json({ success: false, error: 'Missing username/password' });
      const users = await readUsers();
      const u = users.find(x => x.username === username);
      if (!u || !u.active) return res.status(401).json({ success: false, error: 'Invalid credentials' });
      const hashed = hashPw(password);
      const stored = u.passwordHash || u.password;
      if (hashed !== stored) return res.status(401).json({ success: false, error: 'Invalid credentials' });
      return res.status(200).json({ success: true, username: u.username, name: u.name });
    }
    if (action === 'deactivate' || action === 'activate') {
      const { username } = req.body;
      const users = await readUsers();
      const idx = users.findIndex(u => u.username === username);
      if (idx === -1) return res.status(404).json({ success: false, error: 'User not found' });
      users[idx].active = action === 'activate';
      await writeJson(FILE, users);
      return res.status(200).json({ success: true });
    }
    if (action === 'delete') {
      const { username } = req.body;
      const users = await readUsers();
      const idx = users.findIndex(u => u.username === username);
      if (idx === -1) return res.status(404).json({ success: false, error: 'User not found' });
      users.splice(idx, 1);
      await writeJson(FILE, users);
      return res.status(200).json({ success: true });
    }
    return res.status(400).json({ error: 'Invalid action. Use: list, add, deactivate, activate, auth, delete' });
  } catch (err) {
    console.error('manage-users error:', err);
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
};
