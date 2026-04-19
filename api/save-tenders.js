module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { data } = req.body;
  if (!Array.isArray(data)) return res.status(400).json({ error: 'Data must be an array' });

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) return res.status(500).json({ error: 'GITHUB_TOKEN belum di-set di Vercel environment variables. Hubungi admin.' });

  const REPO = 'emerilansel-jpg/tenderstore-chatbot-demo';
  const FILE_PATH = 'data/tenders.json';
  const API_URL = 'https://api.github.com/repos/' + REPO + '/contents/' + FILE_PATH;

  try {
    // 1. Get current file SHA (needed for update)
    let sha = null;
    try {
      const getResp = await fetch(API_URL, {
        headers: { 'Authorization': 'token ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json' }
      });
      if (getResp.ok) {
        const fileInfo = await getResp.json();
        sha = fileInfo.sha;
      }
    } catch (e) { /* file might not exist yet, that's ok */ }

    // 2. Create/update file
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    const body = {
      message: 'Update tender database via admin panel (' + data.length + ' tenders)',
      content: content,
      branch: 'main'
    };
    if (sha) body.sha = sha;

    const putResp = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Authorization': 'token ' + GITHUB_TOKEN,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!putResp.ok) {
      const errBody = await putResp.text();
      return res.status(500).json({ error: 'GitHub API error: ' + putResp.status + ' - ' + errBody.substring(0, 200) });
    }

    // 3. Also update the TENDER_DATABASE text format for chat.js
    const textContent = buildTextDatabase(data);
    const textFilePath = 'data/tenders_text.txt';
    const textApiUrl = 'https://api.github.com/repos/' + REPO + '/contents/' + textFilePath;

    let textSha = null;
    try {
      const getTextResp = await fetch(textApiUrl, {
        headers: { 'Authorization': 'token ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json' }
      });
      if (getTextResp.ok) {
        const textInfo = await getTextResp.json();
        textSha = textInfo.sha;
      }
    } catch (e) { }

    const textBody = {
      message: 'Update tender text database (' + data.length + ' tenders)',
      content: Buffer.from(textContent).toString('base64'),
      branch: 'main'
    };
    if (textSha) textBody.sha = textSha;

    await fetch(textApiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': 'token ' + GITHUB_TOKEN,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(textBody)
    });

    return res.status(200).json({ success: true, count: data.length });

  } catch (e) {
    return res.status(500).json({ error: 'Server error: ' + e.message });
  }
};

function normalizeMonth(dateStr) {
  if (!dateStr) return dateStr;
  var map = {'-may-':'-mei-','-aug-':'-agu-','-oct-':'-okt-','-dec-':'-des-'};
  var s = dateStr.toLowerCase();
  Object.keys(map).forEach(function(k){ s = s.replace(k, map[k]); });
  return dateStr.substring(0, dateStr.indexOf('-')) + s.substring(s.indexOf('-'));
}

function buildTextDatabase(data) {
  const cats = {};
  data.forEach(function(item) {
    var cat = item.kategori || 'Lainnya';
    if (!cats[cat]) cats[cat] = [];
    cats[cat].push(item);
  });

  var lines = [];
  lines.push('=== DATABASE TENDER LENGKAP (HANYA REFERENSI INI YANG BOLEH DIGUNAKAN) ===');
  lines.push('');
  var num = 1;
  Object.keys(cats).forEach(function(cat) {
    lines.push('--- KATEGORI: ' + cat + ' ---');
    cats[cat].forEach(function(t) {
      lines.push(num + '. Nama: ' + t.nama);
      lines.push('   Milik: ' + t.milik + ' | Nilai: ' + t.nilai + ' | Closing: ' + normalizeMonth(t.closing) + ' | Lokasi: ' + t.lokasi + ' | Diumumkan: ' + (t.tanggal_pengumuman || 'N/A'));
      lines.push('');
      num++;
    });
  });

  return lines.join('\n');
}
