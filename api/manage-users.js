const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const OWNER = 'emerilansel-jpg';
const REPO = 'tenderstore-chatbot-demo';
const FILE_PATH = 'data/users.json';
const GITHUB_API = 'https://api.github.com';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        if (req.method === 'OPTIONS') return res.status(200).end();
          if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

            try {
                const fp = path.join(__dirname, '..', 'data', 'users.json');
                    let users = [];
                        if (fs.existsSync(fp)) {
                              users = JSON.parse(fs.readFileSync(fp, 'utf8'));
                                  }

                                      const { action } = req.body || {};
                                          const TOKEN = process.env.GITHUB_TOKEN;

                                              if (action === 'list') {
                                                    const sanitized = users.map(function(u) {
                                                            return { username: u.username, name: u.name, wa: u.wa, active: u.active, createdAt: u.createdAt };
                                                                  });
                                                                        return res.status(200).json(sanitized);
                                                                            }

                                                                                if (action === 'add') {
                                                                                      const { username, password, name, wa } = req.body;
                                                                                            if (!username || !password || !name) return res.status(400).json({ error: 'Missing required fields' });
                                                                                                  if (users.find(function(u) { return u.username === username; })) {
                                                                                                          return res.status(400).json({ error: 'Username already exists' });
                                                                                                                }
                                                                                                                      const hash = crypto.createHash('sha256').update(password).digest('hex');
                                                                                                                            users.push({ username, name, wa: wa || '', passwordHash: hash, active: true, createdAt: new Date().toISOString().slice(0, 10) });
                                                                                                                                  await saveUsers(users, TOKEN);
                                                                                                                                        return res.status(200).json({ success: true });
                                                                                                                                            }

                                                                                                                                                if (action === 'deactivate') {
                                                                                                                                                      const { username } = req.body;
                                                                                                                                                            const u = users.find(function(x) { return x.username === username; });
                                                                                                                                                                  if (!u) return res.status(404).json({ error: 'User not found' });
                                                                                                                                                                        u.active = false;
                                                                                                                                                                              await saveUsers(users, TOKEN);
                                                                                                                                                                                    return res.status(200).json({ success: true });
                                                                                                                                                                                        }

                                                                                                                                                                                            if (action === 'activate') {
                                                                                                                                                                                                  const { username } = req.body;
                                                                                                                                                                                                        const u = users.find(function(x) { return x.username === username; });
                                                                                                                                                                                                              if (!u) return res.status(404).json({ error: 'User not found' });
                                                                                                                                                                                                                    u.active = true;
                                                                                                                                                                                                                          await saveUsers(users, TOKEN);
                                                                                                                                                                                                                                return res.status(200).json({ success: true });
                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                        return res.status(400).json({ error: 'Unknown action' });
                                                                                                                                                                                                                                          } catch (err) {
                                                                                                                                                                                                                                              console.error('manage-users error:', err);
                                                                                                                                                                                                                                                  return res.status(500).json({ error: 'Server error: ' + err.message });
                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                    };

                                                                                                                                                                                                                                                    async function saveUsers(users, token) {
                                                                                                                                                                                                                                                      if (!token) throw new Error('No GITHUB_TOKEN');
                                                                                                                                                                                                                                                        const content = Buffer.from(JSON.stringify(users, null, 2)).toString('base64');
                                                                                                                                                                                                                                                          const getRes = await fetch(GITHUB_API + '/repos/' + OWNER + '/' + REPO + '/contents/' + FILE_PATH, {
                                                                                                                                                                                                                                                              headers: { Authorization: 'token ' + token, Accept: 'application/vnd.github.v3+json' }
                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                                  const fileData = await getRes.json();
                                                                                                                                                                                                                                                                    await fetch(GITHUB_API + '/repos/' + OWNER + '/' + REPO + '/contents/' + FILE_PATH, {
                                                                                                                                                                                                                                                                        method: 'PUT',
                                                                                                                                                                                                                                                                            headers: { Authorization: 'token ' + token, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
                                                                                                                                                                                                                                                                                body: JSON.stringify({ message: 'Update users', content: content, sha: fileData.sha })
                                                                                                                                                                                                                                                                                  });
                                                                                                                                                                                                                                                                                  }