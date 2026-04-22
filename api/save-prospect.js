module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  var { nama, whatsapp } = req.body;
  if (!nama || !whatsapp) return res.status(400).json({ error: 'Nama dan WhatsApp wajib diisi' });

  // Normalize WhatsApp number
  whatsapp = whatsapp.replace(/[^0-9+]/g, '');
  if (whatsapp.length < 8) return res.status(400).json({ error: 'Nomor WhatsApp tidak valid' });

  var GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) return res.status(500).json({ error: 'GITHUB_TOKEN not configured' });

  var REPO = 'emerilansel-jpg/tenderstore-chatbot-demo';
  var FILE_PATH = 'data/prospects.json';
  var API_URL = 'https://api.github.com/repos/' + REPO + '/contents/' + FILE_PATH;

  try {
    // 1. Get current prospects
    var prospects = [];
    var sha = null;

    try {
      var getResp = await fetch(API_URL, {
        headers: { 'Authorization': 'token ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json' }
      });
      if (getResp.ok) {
        var fileInfo = await getResp.json();
        sha = fileInfo.sha;
        var content = Buffer.from(fileInfo.content, 'base64').toString('utf8');
        prospects = JSON.parse(content);
      }
    } catch (e) { /* file might not exist yet */ }

    // 2. Check for duplicate (by WhatsApp number)
    var isDuplicate = prospects.some(function(p) {
      return p.whatsapp.replace(/[^0-9]/g, '') === whatsapp.replace(/[^0-9]/g, '');
    });

    if (!isDuplicate) {
      // 3. Add new prospect
      var now = new Date();
      var dd = String(now.getDate()).padStart(2, '0');
      var mm = String(now.getMonth() + 1).padStart(2, '0');
      var yyyy = now.getFullYear();
      var hh = String(now.getHours()).padStart(2, '0');
      var min = String(now.getMinutes()).padStart(2, '0');

      prospects.push({
        nama: nama.trim(),
        whatsapp: whatsapp,
        tanggal: dd + '-' + mm + '-' + yyyy + ' ' + hh + ':' + min
      });

      // 4. Save to GitHub
      var newContent = Buffer.from(JSON.stringify(prospects, null, 2)).toString('base64');
      var body = {
        message: 'Add prospect: ' + nama.trim(),
        content: newContent,
        branch: 'main'
      };
      if (sha) body.sha = sha;

      var putResp = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Authorization': 'token ' + GITHUB_TOKEN,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!putResp.ok) {
        var errText = await putResp.text();
        return res.status(500).json({ error: 'GitHub save failed: ' + putResp.status });
      }
    }

    return res.status(200).json({ success: true, duplicate: isDuplicate, total: prospects.length });

  } catch (e) {
    return res.status(500).json({ error: 'Server error: ' + e.message });
  }
};
