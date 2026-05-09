// LOCAL FS — saves tenders.json + tenders_text.txt + backup, no GitHub
const { readJson, writeJson, writeText, exists } = require('../lib/datastore');

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

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  try {
    const { data } = req.body || {};
    if (!Array.isArray(data)) return res.status(400).json({ success: false, error: 'data must be array' });
    // Backup current
    if (await exists('tenders.json')) {
      const current = await readJson('tenders.json');
      await writeJson('tenders_backup.json', current);
    }
    // Write new tenders + text DB
    await writeJson('tenders.json', data);
    await writeText('tenders_text.txt', buildTextDatabase(data));
    return res.status(200).json({ success: true, count: data.length });
  } catch (err) {
    console.error('save-tenders error:', err);
    return res.status(500).json({ success: false, error: 'Server error: ' + err.message });
  }
};
