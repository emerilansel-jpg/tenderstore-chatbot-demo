module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { data: rawData, forceOverwrite, appendOnly } = req.body;
  if (!Array.isArray(rawData)) return res.status(400).json({ error: 'Data must be an array' });

  let data = rawData;

  // === DELETION PROTECTION ===
  if (data.length === 0 && !appendOnly) {
    return res.status(400).json({
      error: 'DILARANG: Tidak boleh menyimpan database kosong. Data tender tidak boleh dihapus.',
      protection: true
    });
  }

  // Normalize all categories to UPPERCASE
  data.forEach(function(item) { if (item.kategori) item.kategori = item.kategori.toUpperCase(); });

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) return res.status(500).json({ error: 'GITHUB_TOKEN belum di-set di Vercel environment variables. Hubungi admin.' });

  const REPO = 'emerilansel-jpg/tenderstore-chatbot-demo';
  const FILE_PATH = 'data/tenders.json';
  const API_URL = 'https://api.github.com/repos/' + REPO + '/contents/' + FILE_PATH;

  try {
    let sha = null;
    let currentCount = 0;
    let existingItems = [];
    try {
      const getResp = await fetch(API_URL, {
        headers: { 'Authorization': 'token ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json' }
      });
      if (getResp.ok) {
        const fileInfo = await getResp.json();
        sha = fileInfo.sha;
        try {
          const currentContent = Buffer.from(fileInfo.content, 'base64').toString('utf8');
          existingItems = JSON.parse(currentContent);
          currentCount = Array.isArray(existingItems) ? existingItems.length : 0;
        } catch (e) { existingItems = []; }
      }
    } catch (e) {}

    if (appendOnly) {
      // Dedup by composite key: nama + closing date
      // nama-only caused false duplicates (same title, different year/scope)
      const existingKeys = new Set(existingItems.map(function(t) {
        return (t.nama || '').toLowerCase().trim() + '|' + (t.closing || '').toLowerCase().trim();
      }));
      const dedupedNew = data.filter(function(t) {
        var key = (t.nama || '').toLowerCase().trim() + '|' + (t.closing || '').toLowerCase().trim();
        return !existingKeys.has(key);
      });
      const skipped = data.length - dedupedNew.length;
      data = existingItems.concat(dedupedNew);
      data.forEach(function(item) { if (item.kategori) item.kategori = item.kategori.toUpperCase(); });
      if (dedupedNew.length === 0) {
        return res.status(200).json({ success: true, count: currentCount, added: 0, skipped: skipped });
      }
    } else {
      if (currentCount > 0 && data.length < currentCount) {
        var loss = currentCount - data.length;
        var lossPercent = Math.round((loss / currentCount) * 100);
        if (!forceOverwrite) {
          return res.status(400).json({
            error: 'PERINGATAN: Data akan berkurang dari ' + currentCount + ' menjadi ' + data.length + ' tender (' + loss + ' tender hilang, -' + lossPercent + '%). Jika yakin, kirim ulang dengan forceOverwrite:true.',
            protection: true, currentCount: currentCount, newCount: data.length, loss: loss
          });
        }
        if (lossPercent > 50) {
          return res.status(400).json({
            error: 'DILARANG: Tidak boleh menghapus lebih dari 50% data sekaligus. Saat ini: ' + currentCount + ', akan menjadi: ' + data.length + '. Hubungi developer.',
            protection: true
          });
        }
      }
    }

    if (sha && currentCount > 0) {
      const backupPath = 'data/tenders_backup.json';
      const backupApiUrl = 'https://api.github.com/repos/' + REPO + '/contents/' + backupPath;
      try {
        let backupSha = null;
        const getBkResp = await fetch(backupApiUrl, { headers: { 'Authorization': 'token ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json' } });
        if (getBkResp.ok) { backupSha = (await getBkResp.json()).sha; }
        const getCurrentResp = await fetch(API_URL, { headers: { 'Authorization': 'token ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json' } });
        if (getCurrentResp.ok) {
          const currentFileInfo = await getCurrentResp.json();
          const backupBody = { message: 'Auto-backup before save (' + currentCount + ' tenders) - ' + new Date().toISOString().slice(0,16), content: currentFileInfo.content, branch: 'main' };
          if (backupSha) backupBody.sha = backupSha;
          await fetch(backupApiUrl, { method: 'PUT', headers: { 'Authorization': 'token ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' }, body: JSON.stringify(backupBody) });
        }
      } catch (e) { console.error('Backup failed:', e.message); }
    }

    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    const body = { message: (appendOnly ? 'Append ' + (data.length - currentCount) + ' new tenders' : 'Update') + ' via admin panel (' + data.length + ' total)', content: content, branch: 'main' };
    if (sha) body.sha = sha;
    const putResp = await fetch(API_URL, { method: 'PUT', headers: { 'Authorization': 'token ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!putResp.ok) {
      const errBody = await putResp.text();
      if (putResp.status === 409) return res.status(409).json({ error: 'KONFLIK: Data telah diubah oleh orang lain. Refresh halaman dan coba lagi.', conflict: true });
      return res.status(500).json({ error: 'GitHub API error: ' + putResp.status + ' - ' + errBody.substring(0, 200) });
    }

    const textContent = buildTextDatabase(data);
    const textFilePath = 'data/tenders_text.txt';
    const textApiUrl = 'https://api.github.com/repos/' + REPO + '/contents/' + textFilePath;
    let textSha = null;
    try {
      const getTextResp = await fetch(textApiUrl, { headers: { 'Authorization': 'token ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json' } });
      if (getTextResp.ok) { textSha = (await getTextResp.json()).sha; }
    } catch (e) {}
    const textBody = { message: 'Update tender text database (' + data.length + ' tenders)', content: Buffer.from(textContent).toString('base64'), branch: 'main' };
    if (textSha) textBody.sha = textSha;
    await fetch(textApiUrl, { method: 'PUT', headers: { 'Authorization': 'token ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' }, body: JSON.stringify(textBody) });

    return res.status(200).json({ success: true, count: data.length, previousCount: currentCount, added: appendOnly ? (data.length - currentCount) : undefined });
  } catch (e) {
    return res.status(500).json({ error: 'Server error: ' + e.message });
  }
};

function normalizeMonth(dateStr) {
  if (!dateStr) return dateStr;
  var map = { '-may-': '-mei-', '-aug-': '-agu-', '-oct-': '-okt-', '-dec-': '-des-' };
  var s = dateStr.toLowerCase();
  Object.keys(map).forEach(function(k) { s = s.replace(k, map[k]); });
  return dateStr.substring(0, dateStr.indexOf('-')) + s.substring(s.indexOf('-'));
}

function buildTextDatabase(data) {
  const cats = {};
  data.forEach(function(item) {
    var cat = (item.kategori || 'Lainnya').toUpperCase();
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
