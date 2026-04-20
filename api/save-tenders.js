module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { data, forceOverwrite } = req.body;
  if (!Array.isArray(data)) return res.status(400).json({ error: 'Data must be an array' });

  // === DELETION PROTECTION ===
  // NEVER allow saving empty data
  if (data.length === 0) {
    return res.status(400).json({
      error: 'DILARANG: Tidak boleh menyimpan database kosong. Data tender tidak boleh dihapus.',
      protection: true
    });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) return res.status(500).json({ error: 'GITHUB_TOKEN belum di-set di Vercel environment variables. Hubungi admin.' });

  const REPO = 'emerilansel-jpg/tenderstore-chatbot-demo';
  const FILE_PATH = 'data/tenders.json';
  const API_URL = 'https://api.github.com/repos/' + REPO + '/contents/' + FILE_PATH;

  try {
    // 1. Get current file SHA and content (needed for protection check)
    let sha = null;
    let currentCount = 0;
    try {
      const getResp = await fetch(API_URL, {
        headers: { 'Authorization': 'token ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json' }
      });
      if (getResp.ok) {
        const fileInfo = await getResp.json();
        sha = fileInfo.sha;
        // Decode current content to check count
        try {
          const currentContent = Buffer.from(fileInfo.content, 'base64').toString('utf8');
          const currentData = JSON.parse(currentContent);
          currentCount = Array.isArray(currentData) ? currentData.length : 0;
        } catch (e) { /* parse error, treat as 0 */ }
      }
    } catch (e) { /* file might not exist yet */ }

    // === DATA LOSS PROTECTION ===
    // If new data has FEWER items than current, block unless forceOverwrite flag is set
    if (currentCount > 0 && data.length < currentCount) {
      var loss = currentCount - data.length;
      var lossPercent = Math.round((loss / currentCount) * 100);

      if (!forceOverwrite) {
        return res.status(400).json({
          error: 'PERINGATAN: Data akan berkurang dari ' + currentCount + ' menjadi ' + data.length + ' tender (' + loss + ' tender hilang, -' + lossPercent + '%). Jika yakin, kirim ulang dengan forceOverwrite:true.',
          protection: true,
          currentCount: currentCount,
          newCount: data.length,
          loss: loss
        });
      }

      // Even with forceOverwrite, NEVER allow more than 50% loss in single save
      if (lossPercent > 50) {
        return res.status(400).json({
          error: 'DILARANG: Tidak boleh menghapus lebih dari 50% data sekaligus. Saat ini: ' + currentCount + ', akan menjadi: ' + data.length + '. Hubungi developer.',
          protection: true
        });
      }
    }

    // 2. BACKUP: Save current data to backup file before overwriting
    if (sha && currentCount > 0) {
      const backupPath = 'data/tenders_backup.json';
      const backupApiUrl = 'https://api.github.com/repos/' + REPO + '/contents/' + backupPath;
      try {
        let backupSha = null;
        const getBkResp = await fetch(backupApiUrl, {
          headers: { 'Authorization': 'token ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json' }
        });
        if (getBkResp.ok) {
          const bkInfo = await getBkResp.json();
          backupSha = bkInfo.sha;
        }
        // Get current content for backup
        const getCurrentResp = await fetch(API_URL, {
          headers: { 'Authorization': 'token ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json' }
        });
        if (getCurrentResp.ok) {
          const currentFileInfo = await getCurrentResp.json();
          const backupBody = {
            message: 'Auto-backup before save (' + currentCount + ' tenders) - ' + new Date().toISOString().slice(0,16),
            content: currentFileInfo.content,
            branch: 'main'
          };
          if (backupSha) backupBody.sha = backupSha;
          await fetch(backupApiUrl, {
            method: 'PUT',
            headers: { 'Authorization': 'token ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
            body: JSON.stringify(backupBody)
          });
        }
      } catch (e) { console.error('Backup failed:', e.message); }
    }

    // 3. Save main tenders.json
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    const body = {
      message: 'Update tender database via admin panel (' + data.length + ' tenders)',
      content: content,
      branch: 'main'
    };
    if (sha) body.sha = sha;

    const putResp = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Authorization': 'token ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!putResp.ok) {
      const errBody = await putResp.text();
      if (putResp.status === 409) {
        return res.status(409).json({
          error: 'KONFLIK: Data telah diubah oleh orang lain. Refresh halaman dan coba lagi.',
          conflict: true
        });
      }
      return res.status(500).json({ error: 'GitHub API error: ' + putResp.status + ' - ' + errBody.substring(0, 200) });
    }

    // 4. Update text database for chat.js
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
      headers: { 'Authorization': 'token ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
      body: JSON.stringify(textBody)
    });

    return res.status(200).json({ success: true, count: data.length, previousCount: currentCount });

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
