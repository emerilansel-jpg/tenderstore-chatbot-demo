// LOCAL FS — safe save with anti-wipe safeguards + history archive
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
  // Save snapshot to data/.history/ before overwriting
  const histDir = path.join(DATA_DIR, '.history');
  await fs.mkdir(histDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const histFile = path.join(histDir, 'tenders-' + ts + '.json');
  await fs.writeFile(histFile, JSON.stringify(currentData, null, 2));
  // Rotate: keep last 50
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
    const { data, force } = req.body || {};
    if (!Array.isArray(data)) return res.status(400).json({ success: false, error: 'data must be array' });
    if (data.length === 0 && !force) return res.status(400).json({ success: false, error: 'Empty array refused. Add ?force=true to override.' });

    // === ANTI-WIPE SAFEGUARD ===
    let currentCount = 0;
    let currentData = [];
    if (await exists('tenders.json')) {
      currentData = await readJson('tenders.json');
      currentCount = Array.isArray(currentData) ? currentData.length : 0;
    }
    const THRESHOLD = 0.5; // refuse if new < 50% of current
    if (currentCount >= 10 && data.length < currentCount * THRESHOLD && !force) {
      console.warn('[save-tenders] REFUSED: ' + data.length + ' < ' + Math.floor(currentCount * THRESHOLD) + ' (50% of ' + currentCount + ')');
      return res.status(409).json({
        success: false,
        error: 'BLOCKED: New count (' + data.length + ') is more than 50% smaller than current (' + currentCount + '). This is likely accidental. To force, send {"force":true} in body. Current data preserved.',
        currentCount: currentCount,
        newCount: data.length
      });
    }

    // === Archive history before overwrite ===
    if (currentCount > 0) {
      const hist = await archiveHistory(currentData);
      console.log('[save-tenders] history archived:', hist, '(' + currentCount + ' records)');
    }
    // Backup file (legacy)
    if (currentCount > 0) await writeJson('tenders_backup.json', currentData);

    // Write new
    await writeJson('tenders.json', data);
    await writeText('tenders_text.txt', buildTextDatabase(data));
    console.log('[save-tenders] SAVED ' + data.length + ' records (was ' + currentCount + ')');
    return res.status(200).json({ success: true, count: data.length, previousCount: currentCount });
  } catch (err) {
    console.error('save-tenders error:', err);
    return res.status(500).json({ success: false, error: 'Server error: ' + err.message });
  }
};
