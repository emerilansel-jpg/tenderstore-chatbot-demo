const _fs = require('fs');
const _path = require('path');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  const results = { total: 0, pass: 0, fail: 0, tests: [] };

  function test(name, condition, detail) {
    results.total++;
    if (condition) { results.pass++; results.tests.push({ name, status: 'PASS' }); }
    else { results.fail++; results.tests.push({ name, status: 'FAIL', detail }); }
  }

  let tenders, tendersText;
  try {
    tenders = JSON.parse(_fs.readFileSync(_path.join(process.cwd(), 'data/tenders.json'), 'utf8'));
    tendersText = _fs.readFileSync(_path.join(process.cwd(), 'data/tenders_text.txt'), 'utf8');
  } catch (e) {
    return res.status(500).json({ error: 'Cannot load data files: ' + e.message });
  }

  test('tenders.json is array', Array.isArray(tenders), 'Not an array');
  test('tenders count > 0', tenders.length > 0, 'Empty');
  test('tenders_text.txt not empty', tendersText.length > 100, 'Too short');

  const reqFields = ['nama', 'milik', 'nilai', 'closing', 'lokasi', 'kategori', 'tanggal_pengumuman'];
  let missingFields = [];
  tenders.forEach((t, i) => {
    reqFields.forEach(f => {
      if (!t[f] || (typeof t[f] === 'string' && t[f].trim() === '')) {
        missingFields.push('#' + i + ': missing ' + f);
      }
    });
  });
  test('All tenders have required fields', missingFields.length === 0,
    missingFields.length + ' missing: ' + missingFields.slice(0, 5).join(', '));

  const names = tenders.map(t => t.nama.toLowerCase().trim());
  const dupes = names.filter((n, i) => names.indexOf(n) !== i);
  test('No duplicate tender names', dupes.length === 0,
    dupes.length + ' dupes: ' + dupes.slice(0, 3).join(', '));

  const badDates = tenders.filter(t => !/^\d{2}-[A-Z][a-z]{2}-\d{4}$/.test(t.tanggal_pengumuman));
  test('tanggal_pengumuman format valid', badDates.length === 0, badDates.length + ' bad dates');

  const textCats = (tendersText.match(/--- KATEGORI: (.+?) ---/g) || [])
    .map(c => c.replace(/--- KATEGORI: /, '').replace(/ ---/, ''));
  const jsonCats = [...new Set(tenders.map(t => t.kategori))];

  test('Text has categories', textCats.length > 0, 'No categories in text');
  test('JSON categories match text', jsonCats.every(c => textCats.includes(c)),
    'Missing in text: ' + jsonCats.filter(c => !textCats.includes(c)).join(', '));

  const textTenderCount = (tendersText.match(/^\d+\./gm) || []).length;
  test('Tender count matches', tenders.length === textTenderCount,
    'JSON: ' + tenders.length + ', Text: ' + textTenderCount);

  const diumumkanCount = (tendersText.match(/Diumumkan:/g) || []).length;
  test('Diumumkan in text file', diumumkanCount > 0, 'No Diumumkan fields');
  test('Diumumkan count matches tenders', diumumkanCount === tenders.length,
    'Diumumkan: ' + diumumkanCount + ', Tenders: ' + tenders.length);

  test('More than 5 categories', jsonCats.length > 5, 'Only ' + jsonCats.length);
  test('All 11+ categories present', jsonCats.length >= 11, 'Only ' + jsonCats.length + ': ' + jsonCats.join(', '));

  const testQueries = [
    { msg: 'halo', expect: 'Halo|Selamat|TenderStore', desc: 'Greeting' },
    { msg: 'ada tender apa saja', expect: 'kategori|Drilling|Marine', desc: 'Categories' },
    { msg: 'tender drilling', expect: 'Drilling|Rig|Pemboran', desc: 'Drilling' },
    { msg: 'tender pertamina', expect: 'PERTAMINA|Pertamina', desc: 'Company' },
  ];

  const baseUrl = 'https://' + req.headers.host;
  for (const q of testQueries) {
    try {
      const chatResp = await fetch(baseUrl + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q.msg })
      });
      const chatData = await chatResp.json();
      const reply = chatData.reply || chatData.error || '';
      const matches = new RegExp(q.expect, 'i').test(reply);
      test('Chat: ' + q.msg, matches, 'Got: ' + reply.substring(0, 80));
    } catch (e) {
      test('Chat: ' + q.msg, false, 'Error: ' + e.message);
    }
  }

  const today = new Date();
  const months = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
  let expired = 0, active = 0;
  tenders.forEach(t => {
    const m = t.closing.match(/(\d{2})-([A-Z][a-z]{2})-(\d{4})/);
    if (m) {
      const d = new Date(parseInt(m[3]), months[m[2]], parseInt(m[1]));
      if (d < today) expired++; else active++;
    }
  });
  test('Active tenders exist', active > 0, 'All expired!');

  results.summary = {
    tenderCount: tenders.length,
    categoryCount: jsonCats.length,
    categories: jsonCats,
    activeTenders: active,
    expiredTenders: expired,
    passRate: ((results.pass / results.total) * 100).toFixed(1) + '%'
  };
  results.verdict = results.fail > 0 ? 'FAIL' : 'PASS';
  return res.status(200).json(results);
};
