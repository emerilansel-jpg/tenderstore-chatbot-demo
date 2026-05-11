// LOCAL FS — APPEND mode (default) + REPLACE mode (explicit) + anti-wipe + history
const path = require('path');
const fs = require('fs').promises;
const { readJson, writeJson, writeText, exists, DATA_DIR } = require('../lib/datastore');

function normalizeMonth(dateStr) {
  if (!dateStr) return dateStr;
  const map = { '-may-': '-mei-', '-aug-': '-agu-', '-oct-': '-okt-', '-dec-': '-des-' };
  let s = dateStr.toLowerCase();
  Object.keys(map).forEach(k => { s = s.replace(k, map[k]); });
  return dateStr.substring(0, dateStr.indexOf('-')) + s.substring(s.indexOf('-'));
}
function buildTextDatabase(data) {
  const cats = {};
  data.forEach(item => {
    const cat = (item.kategori || 'Lainnya').toUpperCase();
    if (!cats[cat]) cats[cat] = [];
    cats[cat].push(item);
  });
  const lines = [];
  lines.push('=== DATABASE TENDER LENGKAP (HANYA REFERENSI INI YANG BOLEH DIGUNAKAN) ===');
  lines.push('');
  let num = 1;
  Object.keys(cats).forEach(cat => {
    lines.push('--- KATEGORI: ' + cat + ' ---');
    cats[cat].forEach(t => {
      lines.push(num + '. Nama: ' + t.nama);
      lines.push('   Milik: ' + t.milik + ' | Nilai: ' + t.nilai + ' | Closing: ' + normalizeMonth(t.closing) + ' | Lokasi: ' + t.lokasi + ' | Diumumkan: ' + (t.tanggal_pengumuman || 'N/A'));
      lines.push('');
      num++;
    });
  });
  return lines.join('\n');
}
async function archiveHistory(currentData) {
  const histDir = path.join(DATA_DIR, '.history');
  await fs.mkdir(histDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const histFile = path.join(histDir, 'tenders-' + ts + '.json');
  await fs.writeFile(histFile, JSON.stringify(currentData, null, 2));
  try {
    const files = (await fs.readdir(histDir)).filter(f => f.startsWith('tenders-')).sort();
    if (files.length > 50) {
      for (const f of files.slice(0, files.length - 50)) await fs.unlink(path.join(histDir, f));
    }
  } catch(e) {}
  return histFile;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  try {
    const { data, replace, force } = req.body || {};
    if (!Array.isArray(data)) return res.status(400).json({ success: false, error: 'data must be array' });
    if (data.length === 0 && !force) return res.status(400).json({ success: false, error: 'Empty array refused.' });

    // Read current
    let currentData = [];
    if (await exists('tenders.json')) {
      const cur = await readJson('tenders.json');
      if (Array.isArray(cur)) currentData = cur;
    }
    const currentCount = currentData.length;

    let finalData;
    let mode;
    if (replace === true) {
      // === REPLACE MODE ===
      mode = 'replace';
      // Anti-wipe guard
      if (currentCount >= 10 && data.length < currentCount * 0.5 && !force) {
        return res.status(409).json({
          success: false,
          error: 'BLOCKED REPLACE: New count (' + data.length + ') is more than 50% smaller than current (' + currentCount + '). Use APPEND mode (default) for adding new tenders, or send {"replace":true,"force":true} to force replace.',
          currentCount: currentCount,
          newCount: data.length,
          hint: 'Did you mean to append? Default mode is APPEND. Only use replace:true for full re-import.'
        });
      }
      finalData = data;
    } else {
      // === APPEND MODE (default) ===
      mode = 'append';
      // Dedup by nama (case-insensitive, trimmed)
      const existingNames = new Set(currentData.map(t => (t.nama || '').trim().toLowerCase()));
      const newItems = [];
      const skipped = [];
      for (const item of data) {
        const key = (item.nama || '').trim().toLowerCase();
        if (existingNames.has(key)) { skipped.push(item.nama); continue; }
        newItems.push(item);
        existingNames.add(key);
      }
      finalData = [...currentData, ...newItems];
      console.log('[save-tenders] APPEND: +' + newItems.length + ' new, ' + skipped.length + ' duplicates skipped');
      // If everything was duplicate
      if (newItems.length === 0) {
        return res.status(200).json({ success: true, count: currentCount, added: 0, skipped: skipped.length, message: 'All ' + data.length + ' items already exist (duplicate nama).' });
      }
    }

    // Archive history + legacy backup
    if (currentCount > 0) {
      await archiveHistory(currentData);
      await writeJson('tenders_backup.json', currentData);
    }

    // Write
    await writeJson('tenders.json', finalData);
    await writeText('tenders_text.txt', buildTextDatabase(finalData));
    console.log('[save-tenders] SAVED ' + finalData.length + ' records (was ' + currentCount + ', mode=' + mode + ')');
    return res.status(200).json({
      success: true,
      count: finalData.length,
      previousCount: currentCount,
      mode: mode,
      added: mode === 'append' ? finalData.length - currentCount : null
    });
  } catch (err) {
    console.error('save-tenders error:', err);
    return res.status(500).json({ success: false, error: 'Server error: ' + err.message });
  }
};
