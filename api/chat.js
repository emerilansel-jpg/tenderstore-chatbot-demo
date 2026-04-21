const EXACT_QA = `
=== JAWABAN WAJIB YANG HARUS DIGUNAKAN PERSIS (IKUTI FORMAT INI) ===

PERTANYAAN 3: Ada tender apa saja hari ini? / semua tender / tender apa saja? / kategori apa saja?
JAWABAN: JANGAN gunakan jawaban hardcoded. Hitung SEMUA kategori unik dari DATABASE TENDER di bawah (lihat semua baris "--- KATEGORI: xxx ---"). Tampilkan SEMUA kategori yang ada beserta contoh tender dan jumlah per kategori. Format HTML dengan <strong> untuk nama kategori.

PERTANYAAN 4: Apakah ada tender yang nilainya lebih dari 20 miliar? / tender nilai lebih 20 M?
JAWABAN WAJIB:
Ya, ada tender dengan nilai lebih dari 20 Miliar:<br><br><ol class="reply-list"><li><strong>Penyewaan & Pengoperasian Artificial Lift (Electrical Submersible Pump)</strong><br>Nilai: Rp 28 M<br>Milik: KSO PERTAMINA EP - FORMASI SUMATERA ENERGI</li><li><strong>Pekerjaan Jasa Lumpur Pemboran Lengkap Dengan Peralatan</strong><br>Nilai: Rp 25 M<br>Milik: PERTAMINA EP</li><li><strong>Jasa Penyediaan Dan Pengoperasian 1 Unit Rig Kapasitas 350 Hp</strong><br>Nilai: Rp 24 M<br>Milik: PERTAMINA - MEDCO E&P TOMORI SULAWESI</li><li><strong>Jasa Sewa Unit Perangkat Rig 550 Hp</strong><br>Nilai: Rp 23 M<br>Milik: PERTAMINA HULU ENERGI WEST MADURA OFFSHORE</li><li><strong>Jasa Penyemenan dan Stimulasi</strong><br>Nilai: Rp 22 M<br>Milik: BP BERAU LTD</li><li><strong>Jasa Electric Logging, Perforation dan Data Processing</strong><br>Nilai: Rp 21 M<br>Milik: KANGEAN ENERGY INDONESIA LTD</li></ol><br><span style="color:#93c5fd;font-style:italic;">Apakah anda ingin melihat tender yang lain?</span>
h
PERTANYAAN 5: Apakah ada tender Pertamina? / tender pertamina?
JAWABAN WAJIB:
Iya, ada beberapa tender Pertamina:<br><br><ol class="reply-list"><li><strong>Sewa Perangkat Komputer Dan Server</strong><br>Milik: JOB PERTAMINA - MEDCO E&P SIMENGGARIS<br>Kategori: Computer & IT</li><li><strong>Provision of Swamp Barge No.1</strong><br>Milik: PT PERTAMINA HULU MAHAKAM<br>Kategori: Marine Transportation</li><li><strong>Jasa Support Pekerjaan Issuing, Receiving, Serta Pengoperasian Angkutan Berat</strong><br>Milik: PERTAMINA EP<br>Kategori: Man Power</li><li><strong>Jasa Penyediaan Dan Pengoperasian 1 Unit Rig Kapasitas 350 Hp</strong><br>Milik: PERTAMINA - MEDCO E&P TOMORI SULAWESI<br>Kategori: Drilling</li><li><strong>Jasa Sewa Unit Perangkat Rig 550 Hp</strong><br>Milik: PERTAMINA HULU ENERGI WEST MADURA OFFSHORE<br>Kategori: Drilling</li></ol><br><span style="color:#93c5fd;font-style:italic;">Apakah anda ingin melanjutkan melihat detail tender tersebut?</span>
`;

const _fs = require('fs');
const _path = require('path');
let TENDER_DATABASE;
try {
  TENDER_DATABASE = _fs.readFileSync(_path.join(__dirname, '..', 'data', 'tenders_text.txt'), 'utf8');
} catch(e) {
  TENDER_DATABASE = '=== DATABASE TENDER LENGKAP ===\nTidak ada data tender.';
}

const SYSTEM_PROMPT = `Kamu adalah Asisten AI resmi TenderStore.id. Jawab dalam Bahasa Indonesia yang ramah dan profesional.

=== ATURAN ABSOLUT - TIDAK BOLEH DILANGGAR ===
KAMU HANYA BOLEH menggunakan data tender dari knowledge base yang ada di prompt ini.
DILARANG KERAS menggunakan data training AI, browsing internet, atau sumber eksternal apapun.
JANGAN PERNAH mengarang, membuat, atau menampilkan nama tender atau perusahaan baru yang tidak ada dalam knowledge base.
Jika tidak ada data tender yang relevan, gunakan respons FALLBACK yang sudah ditetapkan di bawah.
Ini adalah ATURAN MUTLAK yang tidak dapat dilanggar dalam kondisi apapun.
===

${EXACT_QA}
${TENDER_DATABASE}

=== INSTRUKSI UTAMA ===

=== ATURAN TANGGAL & KATEGORI (WAJIB) ===
1. Setiap tender memiliki field "Diumumkan:" = tanggal pengumuman (tanggal masuk ke sistem).
2. Ketika user bertanya "tender 15 April" atau "tender tanggal X", cari berdasarkan TANGGAL PENGUMUMAN (Diumumkan:), BUKAN Closing.
3. SELALU perhatikan TAHUN. "Tender April" berarti April TAHUN INI (2026), bukan April tahun lalu.
4. Jika user tanya "tender April" tanpa tahun, default ke tahun berjalan (2026).
5. Untuk pertanyaan kategori: hitung SEMUA kategori dari DATABASE, jangan hardcode jumlahnya.
6. Jangan tampilkan tender yang closing-nya sudah lewat KECUALI user secara spesifik menanyakan tahun lalu.

UNTUK PERTANYAAN TENTANG TENDER:
Gunakan PERSIS jawaban yang sudah ditulis di atas dalam bagian JAWABAN WAJIB.
JANGAN ubah nama tender, nama perusahaan, atau nilai.
Copy persis HTML-nya.

FORMAT WAJIB HTML (BUKAN MARKDOWN):
- Gunakan <strong>teks</strong> BUKAN **teks**
- Gunakan <ol class="reply-list"><li>...</li></ol> untuk daftar
- Gunakan <br><br> untuk jarak paragraf
- Gunakan <span style="color:#93c5fd;font-style:italic;">teks</span> untuk CTA penutup
- JANGAN PERNAH gunakan ** atau - bullet atau # heading

=== ATURAN FILTER KETAT & PEMAHAMAN KONTEKS (WAJIB DIPATUHI) ===
- Jika user menyebut BEBERAPA kata kunci, HANYA tampilkan tender yang cocok SEMUA kriteria (AND).
- PAHAMI KONTEKS: perusahaan + industri/kategori KEDUANYA harus cocok sekaligus.
- JIKA TIDAK ADA yang cocok SEMUA kriteria, WAJIB jawab tidak ditemukan.
- CONTOH WAJIB:
  * marine PLN = HARUS Marine Transportation DAN milik PLN. Tidak ada? jawab tidak ditemukan.
  * IT Pertamina = HARUS Computer dan IT DAN milik Pertamina. Tidak ada? jawab tidak ditemukan.
  * drilling Medco = HARUS Drilling DAN milik Medco. Tampilkan hanya yang cocok keduanya.
- JANGAN tampilkan tender dari kategori LAIN meskipun perusahaan cocok.
- JANGAN tampilkan tender dari perusahaan LAIN meskipun kategori cocok.

PEMETAAN KATA KUNCI KE KATEGORI:
- marine / kapal / barge / boat / tug / crew / harbour = Marine Transportation
- drilling / bor / rig / pemboran / workover / well service = Drilling Workover Well Service
- seismik / seismic / geoteknik / geophysics = Seismic Geotechnic Geophysics
- IT / komputer / software / server / network / DRC = Computer dan IT
- manpower / tenaga kerja / outsourcing / SDM / alih daya = Man Power

===
- Jika user menyebut BEBERAPA kata kunci (misal: drilling medco), HANYA tampilkan tender yang cocok dengan SEMUA kata kunci tersebut (logika AND, BUKAN OR).
- Contoh: tender drilling medco = harus drilling DAN medco. Jangan tampilkan tender drilling yang bukan milik Medco.
- Contoh: tender IT pertamina = harus kategori IT DAN milik Pertamina.
- Cocokkan kata kunci dengan SEMUA field: nama tender, pemilik/milik, kategori, deskripsi.
- Jika tidak ada tender yang cocok dengan SEMUA kata kunci, jawab bahwa tidak ditemukan tender yang sesuai. JANGAN tampilkan tender yang hanya cocok sebagian.
- DILARANG KERAS menampilkan tender yang tidak mengandung salah satu kata kunci yang disebutkan user.

ATURAN JAWABAN:
- Jawab SINGKAT & SKIMMER-FRIENDLY pakai list, bukan paragraf panjang
- Selalu akhiri dengan CTA (ajakan hubungi tim atau lihat lebih lanjut)
- Jika pertanyaan TIDAK ADA di database, gunakan fallback kontak di bawah
- DILARANG mengarang data tender yang tidak ada di atas

FALLBACK jika tidak ada di database:
Informasi tersebut belum tersedia di sistem kami saat ini
`;

function expandCategory(kw){
const m={
'marine':['marine','kapal','barge','boat','tug','lct','crew','utility','harbour','swamp','vessel'],
'kapal':['kapal','barge','boat','tug','lct','vessel','marine','harbour'],
'barge':['barge','swamp'],'boat':['boat','crew','utility'],'tug':['tug','harbour'],'lct':['lct','landing craft'],
'drilling':['drilling','workover','rig','bor','pemboran','sumuran','wireline','logging','penyemenan','cementing','cement','artificial','submersible','pump','esp','stimulasi','well service','perforation'],
'bor':['bor','pemboran','drilling','rig'],'pemboran':['pemboran','bor','drilling','rig','wireline','logging','cementing'],'vessel':['vessel','marine','kapal','barge','lct','swamp','tug'],'rig':['rig','drilling','workover'],'workover':['workover','drilling','rig'],
'seismik':['seismik','seismic','survei','geoid','geoteknik','geotechnic','geophysics','geophysic','study','modeling'],'seismic':['seismic','seismik','survei','geoid','geoteknik','geotechnic','geophysics','geophysic','study','modeling'],
'geoteknik':['geoteknik','geotechnic','geoid','geophysics','seismik','seismic','survei','study','modeling'],'geotechnic':['geotechnic','geoteknik','geoid','geophysics','seismik','seismic','survei','study','modeling'],
'it':['computer','komputer','software','server','network','aplikasi','managed','license','co-location','drc','development','disaster recovery'],
'komputer':['komputer','computer','server','software'],'server':['server','komputer','network','drc'],
'drc':['drc','disaster recovery','co-location'],
'manpower':['manpower','tenaga kerja','outsourcing','sdm','alih daya','tndk','administrasi','kearsipan','naskah','marketing agency','jasa tenaga','agency','support','business','trm','resources','angkutan','issuing','receiving','handling','material','stockpile'],'outsourcing':['outsourcing','manpower','alih daya','support','business','trm','resources','angkutan','issuing','receiving','handling'],'tndk':['tndk','administrasi','kearsipan','naskah dinas','tata naskah','man power','outsourcing'],

    'valve':['valve','pneumatic','shut down','drain'],
    'pipe':['pipe','casing','tubing','hose','octg','tubular'],
    'fabrication':['fabrication','mechanical','scaffolding','construction'],
    'chemical':['chemical','industrial gas','cooling tower','industrial'],
    'survey':['survey','inspection','heliport','evaluasi'],
    'komputer':['komputer','laptop','programmer','monitoring','it'],
  };
return m[kw]||[kw];
}

/* Helper: format a single tender item as HTML list item with date */
function fmtItem(f){
  return '<li><strong>'+f.nama+'</strong><br>Milik: '+f.milik+'<br>Nilai: '+f.nilai+'<br>Tanggal Closing: '+f.closing+'<br>Lokasi: '+f.lokasi+(f.tanggal_pengumuman ? '<br>Diumumkan: '+f.tanggal_pengumuman : '')+'</li>';
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body;
  if (message && message.length > 2000) { return res.status(400).json({ error: "Message too long (max 2000 chars)" }); }
  const page = parseInt(req.body.page) || 1;
  const PAGE_SIZE = 10;
  const history = req.body.history || req.body.conversationHistory || [];
  if (!message) return res.status(400).json({ error: 'Message required' });

  // === EARLY DATE/VALUE FAST PATH (date/value queries bypass LLM) ===
  {
    var _fpQl = message.toLowerCase();
    if (/\b(jan(?:uari)?|feb(?:ruari)?|mar(?:et)?|apr(?:il)?|mei|jun(?:i)?|jul(?:i)?|agu(?:stus)?|sep(?:tember)?|okt(?:ober)?|nov(?:ember)?|des(?:ember)?|closing|lebih|kurang|miliar|juta)\b|ke\s+atas|ke\s+bawah|di\s+atas|di\s+bawah|dibawah|dibwah|diatas|\d+\s*m\b/.test(_fpQl)) {
      try {
        var _fpDF = null, _fpVF = null;
        var _fpMon = {jan:1,januari:1,feb:2,februari:2,mar:3,maret:3,apr:4,april:4,mei:5,may:5,jun:6,juni:6,jul:7,juli:7,agu:8,agustus:8,aug:8,sep:9,september:9,okt:10,oktober:10,oct:10,nov:11,november:11,des:12,desember:12,dec:12};
        var _fpDm = _fpQl.match(/\b(jan(?:uari)?|feb(?:ruari)?|mar(?:et)?|apr(?:il)?|mei|jun(?:i)?|jul(?:i)?|agu(?:stus)?|sep(?:tember)?|okt(?:ober)?|nov(?:ember)?|des(?:ember)?)\b/);
        if (_fpDm) { _fpDF = {month:_fpDm[1]}; var _fpYr = _fpQl.match(/\b(20\d{2})\b/); if (_fpYr) _fpDF.year = +_fpYr[1]; }
        var _fpVOp = /lebih\s+dari|melebihi|di\s+atas|ke\s+atas|diatas/.test(_fpQl) ? 'gt' : /kurang\s+dari|di\s+bawah|ke\s+bawah|dibawah|dibwah/.test(_fpQl) ? 'lt' : /\blebih\b/.test(_fpQl) ? 'gt' : /\bkurang\b/.test(_fpQl) ? 'lt' : null;
        var _fpVN = _fpQl.match(/\b(\d+(?:[.,]\d+)?)\s*(miliar|milyar|juta|m)\b/);
        if (_fpVOp && _fpVN) { var _fpAmt=parseFloat(_fpVN[1].replace(',','.')); if(/juta/.test(_fpVN[2])) _fpAmt/=1000; _fpVF={op:_fpVOp,amount:_fpAmt}; }
        if (_fpDF || _fpVF) {
          var _fpLines = TENDER_DATABASE.split('\n'), _fpCat = '', _fpRes = [], _fpEnt = null;
          for (var _fpi = 0; _fpi < _fpLines.length; _fpi++) {
            var _fpLn = _fpLines[_fpi];
            var _fpKh = _fpLn.match(/---\s*KATEGORI:\s*(.+?)\s*---/i);
            if (_fpKh) { _fpCat = _fpKh[1].trim(); _fpEnt = null; continue; }
            var _fpNm = _fpLn.match(/^\s*\d+\.\s+(.+)/);
            if (_fpNm) { _fpEnt = {nama:_fpNm[1].trim(), cat:_fpCat, nilai:null, closing:null}; continue; }
            if (_fpEnt && _fpLn.indexOf('|') >= 0) {
              var _fpPts = _fpLn.split('|');
              for (var _fpj = 0; _fpj < _fpPts.length; _fpj++) {
                var _fpP = _fpPts[_fpj];
                var _fpCv = _fpP.match(/Closing:\s*(\d{1,2})[-\/](\w+)[-\/](\d{4})/i);
                if (_fpCv) _fpEnt.closing = {d:+_fpCv[1], m:_fpCv[2].toLowerCase().substr(0,3), y:+_fpCv[3]};
                var _fpVv = _fpP.match(/Nilai:\s*Rp\s*([\d.,]+)\s*(M|JT)/i);
            if (_fpVv) { _fpEnt.nilai = parseFloat(_fpVv[1].replace(',','.')); if(/jt/i.test(_fpVv[2])) _fpEnt.nilai /= 1000; }
              }
            }
            if (_fpLn.trim() === '' && _fpEnt && _fpEnt.nama) {
              var _fpOk = true;
              if (_fpDF) {
                if (!_fpEnt.closing) { _fpOk = false; }
                else {
                  var _fpEm = _fpMon[_fpEnt.closing.m]||0, _fpFm = _fpMon[_fpDF.month]||0;
                  if (_fpFm && _fpEm && _fpEm !== _fpFm) _fpOk = false;
                  if (_fpOk && _fpDF.year && _fpEnt.closing.y !== _fpDF.year) _fpOk = false;
                }
              }
              if (_fpOk && _fpVF) {
                if (_fpEnt.nilai === null) { _fpOk = false; }
                else {
                  if (_fpVF.op === 'gt' && !(_fpEnt.nilai > _fpVF.amount)) _fpOk = false;
                  if (_fpVF.op === 'lt' && !(_fpEnt.nilai < _fpVF.amount)) _fpOk = false;
                }
              }
              if (_fpOk) _fpRes.push({nama:_fpEnt.nama, cat:_fpEnt.cat, nilai:_fpEnt.nilai, nilaiStr:(_fpEnt.nilai!==null?(_fpEnt.nilai>=1?_fpEnt.nilai+' M':Math.round(_fpEnt.nilai*1000)+' JT'):'N/A'), closing:_fpEnt.closing});
              _fpEnt = null;
            }
          }
          if (_fpEnt && _fpEnt.nama) {
            var _fpOk2 = true;
            if (_fpDF) {
              if (!_fpEnt.closing) { _fpOk2 = false; }
              else {
                var _fpEm2 = _fpMon[_fpEnt.closing.m]||0, _fpFm2 = _fpMon[_fpDF.month]||0;
                if (_fpFm2 && _fpEm2 && _fpEm2 !== _fpFm2) _fpOk2 = false;
                if (_fpOk2 && _fpDF.year && _fpEnt.closing.y !== _fpDF.year) _fpOk2 = false;
              }
            }
            if (_fpOk2 && _fpVF) {
              if (_fpEnt.nilai === null) { _fpOk2 = false; }
              else {
                if (_fpVF.op === 'gt' && !(_fpEnt.nilai > _fpVF.amount)) _fpOk2 = false;
                if (_fpVF.op === 'lt' && !(_fpEnt.nilai < _fpVF.amount)) _fpOk2 = false;
              }
            }
            if (_fpOk2) _fpRes.push({nama:_fpEnt.nama, cat:_fpEnt.cat, nilai:_fpEnt.nilai, nilaiStr:(_fpEnt.nilai!==null?(_fpEnt.nilai>=1?_fpEnt.nilai+' M':Math.round(_fpEnt.nilai*1000)+' JT'):'N/A'), closing:_fpEnt.closing});
          }
          var _fpStopW = ['ada','apa','tender','yang','dari','untuk','dengan','apakah','saya','mau','cari','lihat','tampilkan','bisa','tolong','minta','ini','itu','di','ke','dan','atau','kalo','kalau','gak','ga','dong','sih','nih','yah','lah','deh','aja','saja','juga','ya','tidak','bukan','semua','beberapa','lain','lainnya','sama','seperti','antara','berapa','total','jumlah','hitung','banyak'];
var _fpDateW = /^(jan(?:uari)?|feb(?:ruari)?|mar(?:et)?|apr(?:il)?|mei|jun(?:i)?|jul(?:i)?|agu(?:stus)?|sep(?:tember)?|okt(?:ober)?|nov(?:ember)?|des(?:ember)?|closing|lebih|kurang|nilai|bulan|atas|bawah|dibawah|dibwah|diatas|melebihi|tender|dari|miliar|milyar|juta|triliun|rupiah|rp)$|^\d/i;
var _fpKw = _fpQl.split(/\s+/).map(function(w){return w.replace(/[^a-z0-9\/]/g,'');}).filter(function(w){return w.length>1 && _fpStopW.indexOf(w)<0 && !_fpDateW.test(w);});
if (_fpKw.length > 0) { _fpRes = _fpRes.filter(function(t){ var _nm = t.nama.toLowerCase() + ' ' + t.cat.toLowerCase(); return _fpKw.every(function(kw){ return _nm.indexOf(kw) >= 0; }); }); }
var _fpDesc = ''; var _fpMonNames = {1:'Januari',2:'Februari',3:'Maret',4:'April',5:'Mei',6:'Juni',7:'Juli',8:'Agustus',9:'September',10:'Oktober',11:'November',12:'Desember'}; if (_fpKw && _fpKw.length > 0) _fpDesc += ' keyword <strong>' + _fpKw.join(' ').toUpperCase() + '</strong>'; if (_fpDF) { var _fpFmN = _fpMon[_fpDF.month]||0; _fpDesc += (_fpDesc?' di bulan ':' bulan ') + '<strong>' + (_fpMonNames[_fpFmN]||_fpDF.month) + '</strong>'; } if (_fpVF) _fpDesc += (_fpDesc?' dengan ':' ') + 'nilai <strong>' + (_fpVF.op==='gt'?'di atas':'di bawah') + ' ' + _fpVF.amount + ' Miliar</strong>'; if (!_fpDesc) _fpDesc = ' sesuai filter';
if (_fpRes.length > 0) {
            var _fpBody = _fpRes.slice(0,15).map(function(it,i){ return '<br><strong>'+(i+1)+'. '+it.nama+'</strong> | '+it.cat+(it.nilaiStr&&it.nilaiStr!=='N/A'?' | Nilai: Rp '+it.nilaiStr:'')+(it.closing?' | Closing: '+it.closing.d+'-'+it.closing.m+'-'+it.closing.y:''); }).join('<br>\n');
            return res.json({reply:'Ditemukan <strong>'+_fpRes.length+' tender</strong>'+_fpDesc+':\n'+_fpBody});
          } else {
            return res.json({reply:'Tidak ditemukan tender'+_fpDesc+'. Coba gunakan kata kunci yang berbeda.'});
          }
        }
      } catch(_fpE) { /* fallthrough to normal processing */ }
    }
  }

  // === DIRECT VALUE FILTER (bypass LLM for nilai/miliar queries) ===
  const _vqMatch = message.match(/(\d+)\s*(miliar|milyar)/i);
  try {
  if (_vqMatch || /miliar|milyar/i.test(message)) {
    const _threshold = _vqMatch ? parseInt(_vqMatch[1]) : 20;
    const _dbLines = TENDER_DATABASE.split('\n');
    const _valTenders = [];
    for (let _vi = 0; _vi < _dbLines.length; _vi++) {
      const _vm = _dbLines[_vi].match(/Nilai: Rp (\d+\.?\d*) M/);
      if (_vm && parseFloat(_vm[1]) > _threshold) {
        const _nm = _dbLines[_vi-1] ? _dbLines[_vi-1].match(/^\s*\d+\.\s+(.+)/) : null;
        const _tName = _nm ? _nm[1].trim() : '';
        const _mkM = _dbLines[_vi].match(/Milik: ([^|]+)/);
        var _milik = _mkM ? _mkM[1].trim() : '';
        var _clM = _dbLines[_vi].match(/Closing: ([^|]+)/);
        var _close = _clM ? _clM[1].trim() : '';
        var _lkM = _dbLines[_vi].match(/Lokasi: (.+)/);
        var _lok = _lkM ? _lkM[1].trim() : '';
        _valTenders.push({name:_tName, val:parseFloat(_vm[1]), milik:_milik, close:_close, lok:_lok});
      }
    }
    var _wantsCount = /\b(berapa|total|jumlah|hitung|banyak|banyaknya)\b/i.test(message);
    if (_valTenders.length > 0) {
      _valTenders.sort((a,b) => b.val - a.val);
  var _wantsCount = /\b(berapa|total|jumlah|hitung|banyak|banyaknya)\b/i.test(message);
      if (_wantsCount && _valTenders.length > 3) {
        var _sample = _valTenders.slice(0,3);
        var _vReply = 'Total ada <strong>' + _valTenders.length + ' tender</strong> dengan nilai lebih dari ' + _threshold + ' Miliar. Berikut 3 contoh:<br><br><ol class="reply-list">';
        _sample.forEach(t => { _vReply += '<li><strong>' + t.name + '</strong><br>Milik: ' + t.milik + ' | Nilai: Rp ' + t.val + ' M | Tanggal Closing: ' + t.close + ' | Lokasi: ' + t.lok + '</li>'; });
        _vReply += '</ol><br>Ketik <strong>"lihat semua tender nilai > ' + _threshold + ' miliar"</strong> untuk daftar lengkap.';
        return res.status(200).json({ reply: _vReply });
      } else {
        /* Paginate value filter results */
        var _vTotal = _valTenders.length;
        var _vStart = (page - 1) * PAGE_SIZE;
        var _vEnd = Math.min(_vStart + PAGE_SIZE, _vTotal);
        var _vPage = _valTenders.slice(_vStart, _vEnd);
        var _vHasMore = _vEnd < _vTotal;
        var _vReply = 'Ya, ada ' + _vTotal + ' tender dengan nilai lebih dari ' + _threshold + ' Miliar:<br><br><ol class="reply-list" start="' + (_vStart+1) + '">';
        _vPage.forEach(t => { _vReply += '<li><strong>' + t.name + '</strong><br>Milik: ' + t.milik + ' | Nilai: Rp ' + t.val + ' M | Tanggal Closing: ' + t.close + ' | Lokasi: ' + t.lok + '</li>'; });
        _vReply += '</ol>';
        if (_vHasMore) {
          _vReply += '<br><span style="color:#93c5fd;font-style:italic;">Menampilkan ' + (_vStart+1) + '-' + _vEnd + ' dari ' + _vTotal + ' tender. Ketik <strong>ya</strong> untuk melihat selanjutnya.</span>';
        }
        return res.status(200).json({ reply: _vReply, pagination: { page: page, total: _vTotal, hasMore: _vHasMore } });
      }
    }
  }
  } catch(_dvfErr) { /* DVF fallback */ }

  // Dynamic keyword filter
  var stopWords = ['ada','apa','tender','yang','dari','untuk','dengan','apakah','saya','mau','cari','lihat','tampilkan','bisa','tolong','minta','ini','itu','di','ke','dan','atau','the','is','are','have','has','do','does','can','please','show','me','all','any','what','which','kalo','kalau','gak','ga','gaa','dong','sih','nih','yah','lah','deh','aja','saja','juga','lebih','kurang','besar','kecil','nilai','harga','biaya','ya','tidak','bukan','semua','beberapa','lain','lainnya','sama','seperti','antara','dalam','pada','akan','sudah','belum','punya','paling','sangat','sekali','only','just','find','list','get','tell','about','punya','berikan','kasih', 'iya','yep','oke','okay','nah','tapi','koq','kok','cuma','doang','hanya','satu','dua','tiga','empat','lima','bilang','bilangnya','katanya','kata','emang','memang','padahal','soalnya','karena','kenapa','gimana','bagaimana','wah','waduh','lho','loh','toh','masa','mosok','harusnya','seharusnya','ingin','want','more','lagi','banyak','sedikit','dikit','berapa','mana','siapa','kapan','dimana','kemana','ngapa','coba','perlu','harus','jangan','boleh','gapapa','ngga','nggak','baik','bagus','jelek','benar','bener','salah','wrong','right','nyatanya','ternyata','rupanya','ulang','ulangi','cek','check','liat','tampil','tunjukkan','tunjukin','muncul','keluar','ngaco','benaran','beneran','betul','mengapa','tunjuk','kenapa', 'bukannya','jadi','khan','nya','tuh','gitu','gini','kayak','kayaknya','sepertinya','maksudnya','memangnya','makanya','jadinya','terus','trus','berapa','total','jumlah','hitung','banyak','banyaknya','lalu','kemudian','setelah','sebelum','eh','hmm','ok','yoi','yap','ayo','ayok','serius','cuman','kok','oh','ah','harusnya','katanya','udah','udahan','namanya','halo','hai','hello','hey','terima','closing','date','deadline','tanggal','tendernya','perusahaannya','nilainya','harganya','totalnya','jumlahnya','informasi','infonya','detail','detil','selamat','pagi','siang','sore','malam','datanya','tersedia','masih','sisa','sisanya','berikutnya','selanjutnya','dong','ga','pak','jenis','kategori','hari','saat','list','carikan','tunjukkan','lagi','lainnya','lain','tau','info','miliar','milyar','juta','ribu','billion','million','rupiah','rp','idr'];
  var preserveShort = ['it', 'ip', 'bp', 'ep'];
  var userWords = message.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z0-9]/g, '')).filter(w => w.length > 2 || preserveShort.includes(w));
  var filterWords = userWords.filter(w => !stopWords.includes(w) && (w.length > 2 || preserveShort.includes(w)));
    var _wantsCount = /\b(berapa|total|jumlah|hitung|banyak|banyaknya)\b/i.test(message);
  // Strip date/month/year/value terms to prevent false category matches
  var _dateFwExclude = /^(januari|jan|februari|feb|maret|mar|april|apr|mei|juni|jun|juli|jul|agustus|agus|agu|agt|september|sep|oktober|okt|november|nov|desember|des|tgl|tanggal|lebih|kurang|nilai|bulan|atas|bawah|dibawah|dibwah|diatas|melebihi|closing|tender|dari|miliar|juta|triliun|rupiah|rp|proyek|katagori|daftar|apakah|macam|tipe|ragam)$|^\d/i;
  filterWords = filterWords.filter(function(w){ return !_dateFwExclude.test(w); });

  var _wantsAll = /\b(semua|seluruh)\b/.test(message.toLowerCase()) && filterWords.length === 0;
  var _wantsCategories = /\b(apa saja|apa aja|semua kategori|kategori apa|tender apa|apakah ada tender)\b/.test(message.toLowerCase()) && filterWords.length === 0;
  var _wantsContinuation = /\b(lainnya|lagi|selanjutnya|berikutnya|sisanya)\b/i.test(message) && history.length > 0 && filterWords.length === 0;
  
  var _contCategory = '';
  if (_wantsContinuation) {
    var lastAsst = [...history].reverse().find(m => m.role === 'assistant');
    if (lastAsst) {
      var h = lastAsst.content.toLowerCase();
      if (h.includes('drilling') || h.includes('pemboran') || h.includes('rig')) _contCategory = 'drilling';
      else if (h.includes('marine') || h.includes('kapal') || h.includes('transportation')) _contCategory = 'marine';
      else if (h.includes('seismic') || h.includes('seismik')) _contCategory = 'seismic';
      else if (h.includes('computer') || h.includes('software')) _contCategory = 'computer';
      else if (h.includes('man power') || h.includes('manpower')) _contCategory = 'man power';
    }
  }

  // CONTEXT RECOVERY: if filterWords empty, recover last search from history
  if (filterWords.length === 0 && !_wantsAll && !_wantsCategories && !_wantsContinuation) {
    var _msgHist = history || [];
    for (var _hi = _msgHist.length - 1; _hi >= 0; _hi--) {
      if (_msgHist[_hi].role === 'user') {
        var _hw = _msgHist[_hi].content.toLowerCase().split(/\s+/).map(w=>w.replace(/[^a-z0-9]/g,'')).filter(w=>w.length>2||preserveShort.includes(w));
        var _hf = _hw.filter(w=>!stopWords.includes(w));
        if (_hf.length > 0) { filterWords = _hf; break; }
      }
    }

    // Greeting handler
    var _isGreeting = /^(halo|hai|hello|hey|hi|selamat\s+(pagi|siang|sore|malam))[!?.\s]*$/i.test(message.trim());
    if (_isGreeting) {
      return res.json({ reply: 'Halo! Selamat datang di TenderStore.id. Saya siap membantu Anda mencari tender.<br><br>Silakan sebutkan kategori (contoh: <strong>drilling</strong>, <strong>marine</strong>, <strong>IT</strong>) atau nama perusahaan (contoh: <strong>Pertamina</strong>, <strong>PLN</strong>, <strong>BP</strong>) untuk memulai pencarian.' });
    }

    // Pure count handler
    if (_wantsCount && filterWords.length === 0) {
    try {
      const _ch = TENDER_DATABASE.match(/--- KATEGORI: (.+?) ---/g) || [];
      const _cl = _ch.map(function(h){ return h.replace(/--- KATEGORI: /, '').replace(/ ---/, ''); });
      const _te = (TENDER_DATABASE.match(/^\d+\.\s+\S/gm) || []).length;
      var _cc = {};
      var _curC = '';
      TENDER_DATABASE.split('\n').forEach(function(l){
        var cm = l.match(/--- KATEGORI: (.+?) ---/);
        if (cm) _curC = cm[1];
        if (/^\d+\.\s+\S/.test(l)) _cc[_curC] = (_cc[_curC] || 0) + 1;
      });
      var _chtml = 'Saat ini tersedia total <strong>' + _te + ' tender</strong> dalam ' + _cl.length + ' kategori di database kami:<br><br><ol class="reply-list">';
      _cl.forEach(function(cat){ _chtml += '<li><strong>' + cat + '</strong> (' + (_cc[cat] || 0) + ' tender)</li>'; });
      _chtml += '</ol><br><span style="color:#93c5fd;font-style:italic;">Ketik nama kategori atau perusahaan untuk melihat detail tender.</span>';
      return res.json({ reply: _chtml });
    } catch(_countErr) {
      console.error("Count handler error:", _countErr);
      return res.json({ reply: "Saat ini tersedia beberapa kategori tender. Silahkan tanyakan kategori spesifik seperti: Drilling, Marine, IT, Valve, Pipe, Chemical, Survey, Fabrication, Electrical, Mechanical, Civil, atau Komputer IT." });
    }
    }

    const _hasDV = /\b(jan(?:uari)?|feb(?:ruari)?|mar(?:et)?|apr(?:il)?|mei|jun(?:i)?|jul(?:i)?|agu(?:stus)?|sep(?:tember)?|okt(?:ober)?|nov(?:ember)?|des(?:ember)?|closing|lebih|kurang|miliar|juta)\b|ke\s+atas|ke\s+bawah|di\s+atas|di\s+bawah|dibawah|dibwah|diatas|\d+\s*m\b/i.test(userWords.join(' '));
    // Edge case guard: minimal/empty inputs
    if (!message || message.trim().length === 0 || /^[\s\?\!\d\.]+$/.test(message.trim())) {
      return res.json({ reply: "Silahkan bertanya tentang tender yang tersedia. Contoh: tender drilling, tender marine, tender IT, atau sebutkan nama perusahaan seperti Pertamina, PLN, BP." });
    }
    if (filterWords.length === 0 && !_hasDV) {
      return res.json({ reply: 'Untuk membantu pencarian tender, silakan sebutkan kategori (contoh: drilling, marine, IT) atau nama perusahaan (contoh: Pertamina, PLN, BP).' });
    }
  }

  const _tdU = TENDER_DATABASE.toUpperCase();
  const _mR = /MILIK:\s*([^\n|<]+)/g;
  let _mM; const _aM = [];
  while ((_mM = _mR.exec(_tdU)) !== null) _aM.push(_mM[1].trim());

  const companyKwsG = filterWords.filter(kw => _aM.some(ml => { try { return new RegExp('\\b'+kw+'\\b','i').test(ml); } catch(e) { return ml.includes(kw.toUpperCase()); } }));
  const categoryKwsG = filterWords.filter(kw => !companyKwsG.includes(kw));

  const _catNameMap = {
    'marine':'Marine Transportation','kapal':'Marine Transportation','barge':'Marine Transportation',
    'boat':'Marine Transportation','tug':'Marine Transportation','vessel':'Marine Transportation',
    'lct':'Marine Transportation','crew':'Marine Transportation','harbour':'Marine Transportation',
    'drilling':'Drilling Workover Well Service','bor':'Drilling Workover Well Service',
    'rig':'Drilling Workover Well Service','workover':'Drilling Workover Well Service',
    'pemboran':'Drilling Workover Well Service','wireline':'Drilling Workover Well Service',
    'logging':'Drilling Workover Well Service','cementing':'Drilling Workover Well Service',
    'seismak':'Seismic Geotechnic Geophysics','seismic':'Seismic Geotechnic Geophysics',
    'geoteknik':'Seismic Geotechnic Geophysics','geotechnic':'Seismic Geotechnic Geophysics',
    'it':'Computer dan IT','komputer':'Computer dan IT','server':'Computer dan IT',
    'software':'Computer dan IT','network':'Computer dan IT','drc':'Computer dan IT',
    'manpower':'Man Power','outsourcing':'Man Power','tenaga':'Man Power','sdm':'Man Power','tndk':'Man Power','administrasi':'Man Power','kearsipan':'Man Power',
  
    'valve':'VALVE','pneumatic':'VALVE',
    'pipe':'PIPE CASING TUBING & HOSE','casing':'PIPE CASING TUBING & HOSE','tubing':'PIPE CASING TUBING & HOSE','hose':'PIPE CASING TUBING & HOSE','octg':'PIPE CASING TUBING & HOSE','piping':'PIPE CASING TUBING & HOSE',
    'fabrication':'FABRICATION & MECHANICAL CONSTRUCTION','scaffolding':'FABRICATION & MECHANICAL CONSTRUCTION','mechanical':'FABRICATION & MECHANICAL CONSTRUCTION',
    'chemical':'Chemical & Industrial Gas','cooling':'Chemical & Industrial Gas','solvent':'Chemical & Industrial Gas',
    'survey':'Survey & Inspection','heliport':'Survey & Inspection','inspection':'Survey & Inspection','topografi':'Survey & Inspection',
    'komputer':'KOMPUTER IT','laptop':'KOMPUTER IT','programmer':'KOMPUTER IT',
  };

  const _catNames = [...new Set(categoryKwsG.map(k => _catNameMap[k.toLowerCase()]).filter(Boolean))];
  const _cd = companyKwsG.length > 0 ? ' Perusahaan:[' + companyKwsG.join(',') + '].' : '';
  const _kd = _catNames.length > 0 ? ' Kategori: ' + _catNames.join(' / ') + '. Tampilkan SEMUA tender dalam kategori ini tanpa terkecuali.' : (categoryKwsG.length > 0 ? ' Kategori:[' + categoryKwsG.join(',') + '].' : '')

  const keywordFilter = _wantsCategories
    ? '\n\n=== INSTRUKSI ===\nUser bertanya ada tender/kategori apa saja. Tampilkan ringkasan semua kategori yang tersedia berikut 1 contoh tender per kategori. Format: Kategori X (N tender): [nama tender contoh]. Sebutkan semua kategori yang ada.'
    : _wantsAll
    ? '\n\n=== INSTRUKSI ===\nUser ingin melihat SEMUA tender. Tampilkan seluruh tender dalam database diurutkan per kategori. Jangan filter perusahaan atau kategori apapun.'
    : _wantsContinuation
    ? '\n\n=== INSTRUKSI ===\nUser bertanya tentang tender lainnya. Tampilkan SEMUA tender untuk kategori ' + (_contCategory || 'yang sebelumnya dicari') + '. Jangan batasi jumlah tender. Jangan tambahkan kalimat tawaran seperti "apakah ingin melihat lainnya".'
    : filterWords.length >= 1
    ? '\n\n=== INSTRUKSI FILTER WAJIB ===\nKeyword:[' + filterWords.join(',') + '].' + _cd + _kd
      + '\n0. PENTING: ABAIKAN jumlah/daftar tender di bagian contoh jawaban atas. Selalu hitung ulang langsung dari TENDER_DATABASE dan tampilkan SEMUA tender yang cocok, jangan batasi.'
      + '\n1. HANYA tampilkan tender cocok SEMUA kriteria (perusahaan DAN kategori sekaligus).'
      + '\n2. marine PLN = Marine Transportation DAN milik PLN. Tidak ada? jawab tidak ditemukan.'
      + '\n3. JANGAN tampilkan tender kategori lain meskipun perusahaan cocok.'
      + '\n4. JANGAN tampilkan tender perusahaan lain meskipun kategori cocok.'
      + '\n5. Tidak cocok semua? Jawab: Maaf tidak ditemukan tender [kriteria] dalam database kami.'
      + '\n6. Jika HANYA Perusahaan disebutkan (tanpa kategori), tampilkan SEMUA tender dari perusahaan tsb apapun kategorinya.'
      + '\n7. PENTING: Tampilkan SEMUA tender yang cocok tanpa membatasi jumlah.'
      + '\n8. JANGAN tambahkan kalimat tawaran seperti \'apakah ingin melihat lainnya\' atau \'mau saya tampilkan lebih banyak\'. Tampilkan semuanya langsung.'
    : '';

  // === DB-DIRECT: Bypass LLM for category/company queries ===
  if (companyKwsG.length > 0 || categoryKwsG.length > 0) {
    const _ln = TENDER_DATABASE.split('\n'); let _dc = ''; const _dbItems = []; let _ce = null;
    for (const _l of _ln) {
      const _ch = _l.match(/---\s*KATEGORI:\s*(.+?)\s*---/i);
      if (_ch) { _dc = _ch[1].trim().toLowerCase(); _ce = null; continue; }
      const _nm = _l.match(/^\d+\.\s+(.+)/);
      if (_nm) { _ce = {nama:_nm[1].trim(), cat:_dc, milik:'', nilai:'', closing:'', lokasi:''}; continue; }
      if (_ce && _l.includes('Milik:')) {
        const _ps = _l.split('|').map(s=>s.trim());
        _ce.milik = (_ps[0].match(/Milik:\s*(.+)/i)||[])[1]||'';
        for(const _p of _ps){
          if(_p.match(/^Nilai:/i)) _ce.nilai=_p.replace(/^Nilai:\s*/i,'');
          if(_p.match(/^Closing:/i)) _ce.closing=_p.replace(/^Closing:\s*/i,'');
          if(_p.match(/^Lokasi:/i)) _ce.lokasi=_p.replace(/^Lokasi:\s*/i,'');
        }
        const _el = (_ce.cat+' '+_ce.nama+' '+_ce.milik).toLowerCase();
        const compOk = companyKwsG.length===0 || companyKwsG.every(kw => { try { return new RegExp('\\b'+kw+'\\b','i').test(_el); } catch(e) { return _el.includes(kw.toLowerCase()); }});
        const catOk = categoryKwsG.length===0 || categoryKwsG.every(kw => {
          const ecMatch = expandCategory(kw).some(t => { try { return new RegExp(t,'i').test(_ce.cat); } catch(e) { return _ce.cat.includes(t); } });
          if (ecMatch) return true;
          const mc=(_catNameMap[kw]||'').toLowerCase(); if(!mc) return false;
          const fw=mc.split(/[\s&,]+/)[0]; return fw.length>2 && _ce.cat.includes(fw);
        });
        if (compOk && catOk) _dbItems.push({..._ce});
        _ce = null;
      }
    }

    if (_dbItems.length > 0) {
      const _cL = companyKwsG.length>0 ? ' dari <strong>'+companyKwsG.map(k=>k.toUpperCase()).join('/')+'</strong>' : '';
      const _kL = categoryKwsG.length>0 ? ' kategori <strong>'+categoryKwsG.map(k=>k.charAt(0).toUpperCase()+k.slice(1)).join('/')+'</strong>' : '';

      if (_wantsCount && _dbItems.length > 3) {
        return res.json({ reply: 'Total ada <strong>' + _dbItems.length + ' tender</strong>'+_cL+_kL+'. Berikut 3 contoh:<br><br><ol class="reply-list">' + _dbItems.slice(0,3).map(fmtItem).join('') + '</ol><br>Ketik <strong>"'+( categoryKwsG.length > 0 ? 'tender '+categoryKwsG[0] : companyKwsG.length > 0 ? 'tender '+companyKwsG[0] : 'lihat semua')+'"</strong> untuk melihat daftar lengkap.' });
      } else {
        /* Paginate DB-DIRECT results */
        const _totalItems = _dbItems.length;
        const _startIdx = (page - 1) * PAGE_SIZE;
        const _endIdx = Math.min(_startIdx + PAGE_SIZE, _totalItems);
        const _pageItems = _dbItems.slice(_startIdx, _endIdx);
        const _hasMore = _endIdx < _totalItems;
        let _pReply = 'Ya, ada '+_totalItems+' tender'+_cL+_kL+':<br><br><ol class="reply-list" start="'+(_startIdx+1)+'">'
          +_pageItems.map(fmtItem).join('')+'</ol>';
        if (_hasMore) {
          _pReply += '<br><span style="color:#93c5fd;font-style:italic;">Menampilkan '+(_startIdx+1)+'-'+_endIdx+' dari '+_totalItems+' tender. Ketik <strong>ya</strong> untuk melihat selanjutnya.</span>';
        } else if (page > 1) {
          _pReply += '<br><span style="color:#93c5fd;font-style:italic;">Semua '+_totalItems+' tender telah ditampilkan.</span>';
        } else {
          _pReply += '<br><span style="color:#93c5fd;font-style:italic;">Apakah ada yang ingin Anda tanyakan lebih lanjut?</span>';
        }
        return res.json({ reply: _pReply, pagination: { page: page, total: _totalItems, hasMore: _hasMore } });
      }
    } else {
      const cD=companyKwsG.length>0?' dari <strong>'+companyKwsG.map(k=>k.toUpperCase()).join('/')+'</strong>':'';
      const kD=categoryKwsG.length>0?' kategori <strong>'+categoryKwsG.join(', ')+'</strong>':'';
      return res.json({ reply: 'Maaf, tidak ditemukan tender'+kD+cD+' dalam database kami.<br><br><span style="color:#93c5fd;font-style:italic;">Coba ketik kategori lain: drilling, marine, IT, seismic, atau man power.</span>' });
    }
  }

  // === DATE/VALUE DIRECT HANDLER ===
  if (!companyKwsG.length && !categoryKwsG.length) {
    try {
      var _dvDFn = parseDateFilter(userWords.join(' '));
      var _dvVFn = parseValueFilter(userWords.join(' '));
      if (_dvDFn || _dvVFn) {
        var _dvLn = TENDER_DATABASE.split('\n');
        var _dvDc = ''; var _dvIts = []; var _dvCe = null;
        for (var _dvi = 0; _dvi < _dvLn.length; _dvi++) {
          var _dvL = _dvLn[_dvi];
          var _dvCh = _dvL.match(/---\s*KATEGORI:\s*(.+?)\s*---/i);
          if (_dvCh) { _dvDc = _dvCh[1].trim().toLowerCase(); _dvCe = null; continue; }
          var _dvNm = _dvL.match(/^\d+\.\s+(.+)/);
          if (_dvNm) { _dvCe = {nama:_dvNm[1].trim(),cat:_dvDc,milik:'',nilai:'',closing:'',lokasi:''}; continue; }
          if (_dvCe) {
            var _dvCl = _dvL.match(/Closing[^:]*:\s*(.+)/i); if (_dvCl) _dvCe.closing = _dvCl[1].trim();
            var _dvVl = _dvL.match(/Nilai[^:]*:\s*(.+)/i); if (_dvVl) _dvCe.nilai = _dvVl[1].trim();
            var _dvMl = _dvL.match(/Milik[^:]*:\s*(.+)/i); if (_dvMl) _dvCe.milik = _dvMl[1].trim();
            if (_dvL.trim() === '' && _dvCe.nama) {
              if ((!_dvDFn || _dateOk(_dvCe,_dvDFn)) && (!_dvVFn || _valueOk(_dvCe,_dvVFn))) _dvIts.push({..._dvCe});
              _dvCe = null;
            }
          }
        }
        if (_dvCe && _dvCe.nama && (!_dvDFn || _dateOk(_dvCe,_dvDFn)) && (!_dvVFn || _valueOk(_dvCe,_dvVFn))) _dvIts.push({..._dvCe});
        if (_dvIts.length > 0) {
          const _dvBody = _dvIts.slice(0,10).map((it,i) => '<br><strong>'+(i+1)+'. '+it.nama+'</strong> | '+it.cat+(it.nilai?' | Nilai: '+it.nilai:'')+(it.closing?' | Closing: '+it.closing:'')).join('\n');
          return res.json({ reply: 'Ditemukan <strong>'+_dvIts.length+' tender</strong>:\n'+_dvBody });
        } else {
          return res.json({ reply: 'Tidak ditemukan tender sesuai filter tanggal/nilai Anda.' });
        }
      }
    } catch(_dvErr) { /* fallback to LLM */ }
  }
  // === END DB-DIRECT ===

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT + keywordFilter },
    ...history.slice(-6).filter(m => m.role && m.content),
    { role: 'user', content: message }
  ];

  try {
    const PROVIDERS = [
      { name: 'Gemini', url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', key: process.env.GEMINI_API_KEY || '', model: 'gemini-2.5-flash', max_tokens: 3000, temperature: 0.1 },
      { name: 'Qwen 3.6 Plus', url: 'https://openrouter.ai/api/v1/chat/completions', key: process.env.OPENROUTER_API_KEY || '', model: 'qwen/qwen3.6-plus-preview:free', max_tokens: 3000, temperature: 0.1 },
      { name: 'Nemotron 3 Super', url: 'https://openrouter.ai/api/v1/chat/completions', key: process.env.OPENROUTER_API_KEY || '', model: 'nvidia/nemotron-3-super-120b-a12b:free', max_tokens: 3000, temperature: 0.1 },
      { name: 'Step 3.5 Flash', url: 'https://openrouter.ai/api/v1/chat/completions', key: process.env.OPENROUTER_API_KEY || '', model: 'stepfun/step-3.5-flash:free', max_tokens: 3000, temperature: 0.1 },
      { name: 'Trinity Large', url: 'https://openrouter.ai/api/v1/chat/completions', key: process.env.OPENROUTER_API_KEY || '', model: 'arcee-ai/trinity-large-preview:free', max_tokens: 3000, temperature: 0.1 }
    ];

    let lastError = null; let data = null;
    const PROVIDER_TIMEOUT = 8000;

    for (const provider of PROVIDERS) {
      if (!provider.key) { lastError = provider.name + ': no API key'; continue; }
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT);
        const response = await fetch(provider.url, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + provider.key, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: provider.model, messages, max_tokens: provider.max_tokens, temperature: provider.temperature }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        const d = await response.json();
        if (!response.ok) { console.error(provider.name + ' error:', response.status); lastError = provider.name + ' error ' + response.status; continue; }
        if (d.choices && d.choices[0] && d.choices[0].message) { data = d; var _finishReason = (d.choices[0] && d.choices[0].finish_reason) || 'stop'; console.log('Success with ' + provider.name); break; }
      } catch (providerErr) {
        const isTimeout = providerErr.name === 'AbortError';
        lastError = provider.name + (isTimeout ? ': timeout ' + PROVIDER_TIMEOUT + 'ms' : ': ' + providerErr.message);
        console.log(lastError + ' \u2014 trying next provider...');
        continue;
      }
    }

    if (!data) { return res.status(200).json({ reply: 'Mohon maaf, sistem sedang sibuk saat ini. Silakan coba lagi dalam beberapa saat, atau ketik kategori tender yang Anda cari (contoh: <strong>drilling</strong>, <strong>marine</strong>, <strong>IT</strong>).' }); }

    let reply = data.choices?.[0]?.message?.content || 'Maaf, tidak ada respons.';
    if (typeof _finishReason !== 'undefined' && _finishReason === 'length') {
      reply += '<br><br><em>\u26A0\uFE0F Jawaban terpotong karena terlalu panjang. Ketik <strong>"lanjutkan"</strong> untuk melihat sisanya.</em>';
    }

    // Safety net: markdown to HTML
    reply = reply
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^[\*\-] (.+)$/gm, '<li>$1</li>');

    // === KB STRICT VALIDATION ===
    const kbSrc = (EXACT_QA + TENDER_DATABASE + SYSTEM_PROMPT).toUpperCase();
    const kbCompanies = new Set();
    const kbRe = /MILIK\s*:\s*([^\n<]{4,})/g;
    let kbM;
    while ((kbM = kbRe.exec(kbSrc)) !== null) {
      const name = kbM[1].trim().split(/[<\n]/)[0].trim().toUpperCase();
      if (name.length >= 4) kbCompanies.add(name.substring(0, 20));
    }

    if (kbCompanies.size > 0 && reply.includes('<li>')) {
      const kbParts = reply.split(/(?=<li>)/i);
      const kbIntro = kbParts[0];
      const kbItems = kbParts.slice(1);
      const kbValidItems = kbItems.filter(item => {
        const iu = item.toUpperCase();
        const mi = iu.indexOf('MILIK');
        if (mi < 0) return true;
        const afterMilik = iu.substring(mi + 5).replace(/^[\s:]+/, '');
        const itemCompany = afterMilik.split(/[<\n]/)[0].trim().toUpperCase().substring(0, 20);
        return Array.from(kbCompanies).some(kbCo => {
          const shorter = Math.min(itemCompany.length, kbCo.length, 8);
          return shorter >= 4 && itemCompany.substring(0, shorter) === kbCo.substring(0, shorter);
        });
      });

      if (kbItems.length > 0 && kbValidItems.length === 0) {
        reply = 'Maaf, data tender tersebut tidak tersedia dalam database kami. Silakan hubungi tim TenderStore untuk informasi lebih lanjut.';
      } else if (kbValidItems.length < kbItems.length) {
        reply = kbIntro + kbValidItems.join('');
      }
    }

    // Post-processing: keyword filter
    if (filterWords.length >= 1) {
      let mainReply = reply; let ctaText = "";
      const ctaMatch = reply.match(/(<br>\s*)*(<em>.*<\/em>|Apakah\s+Anda\s+ingin.*$)/is);
      if (ctaMatch) { const ctaIdx = reply.indexOf(ctaMatch[0]); mainReply = reply.substring(0, ctaIdx); ctaText = reply.substring(ctaIdx); }

      let items = []; let intro = "";
      if (mainReply.includes("<li>")) { const parts = mainReply.split(/(?=<li>)/i); intro = parts[0]; items = parts.slice(1); }
      else if (/\d+\.\s/.test(mainReply)) { const parts = mainReply.split(/(?=\d+\.\s)/); intro = parts[0]; items = parts.slice(1); }

      let _dbNeeded = false;
      let _cKws = companyKwsG, _kKws = filterWords.filter(kw => !companyKwsG.includes(kw));

      if (items.length > 0) {
        const _cL = filterWords.filter(kw => { const kl=kw.toLowerCase(); return items.some(it=>{const li=it.toLowerCase();const mi=li.indexOf('milik');return mi>=0&&li.substring(mi).includes(kl);});});
        _cKws = companyKwsG.length > 0 ? companyKwsG : _cL;
        _kKws = filterWords.filter(kw => !_cKws.includes(kw));

        
function parseDateFilter(q) {
  var ql = q.toLowerCase();
  var mm = {'januari':'Jan','jan':'Jan','februari':'Feb','feb':'Feb','maret':'Mar','mar':'Mar','april':'Apr','apr':'Apr','mei':'May','may':'May','juni':'Jun','jun':'Jun','juli':'Jul','jul':'Jul','agustus':'Aug','agus':'Aug','agt':'Aug','aug':'Aug','september':'Sep','sep':'Sep','oktober':'Oct','okt':'Oct','oct':'Oct','november':'Nov','nov':'Nov','desember':'Dec','des':'Dec','dec':'Dec'};
  var r = {day:null,month:null,year:null};
  var m1 = ql.match(/(\d{1,2})\s+(januari|februari|maret|april|mei|juni|juli|agustus|agus|agu|agt|september|oktober|november|desember|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|okt|des)\s*(\d{4})?/i);
  if (m1) { r.day=parseInt(m1[1]); r.month=mm[m1[2].toLowerCase()]||m1[2]; if(m1[3])r.year=parseInt(m1[3]); return r; }
  var m2 = ql.match(/(januari|februari|maret|april|mei|juni|juli|agustus|agus|agu|agt|september|oktober|november|desember|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|okt|des)\s+(\d{4})/i);
  if (m2) { r.month=mm[m2[1].toLowerCase()]||m2[1]; r.year=parseInt(m2[2]); return r; }
  var m3 = ql.match(/(januari|februari|maret|april|mei|juni|juli|agustus|agus|agu|agt|september|oktober|november|desember|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|okt|des)/i);
  if (m3) { r.month=mm[m3[1].toLowerCase()]||m3[1]; return r; }
  return null;
}
function parseValueFilter(q) {
  var ql = q.toLowerCase();
  var op = null;
  if (/lebih dari|di atas|lebih besar|melebihi/.test(ql)) op = 'gt';
  else if (/lebih/.test(ql)) op = 'gt';
  else if (/kurang dari|di bawah/.test(ql)) op = 'lt';
  var nm = ql.match(/(\d+(?:[.,]\d+)?)\s*(miliar|milyar|juta)/);
  if (!nm || !op) return null;
  var amount = parseFloat(nm[1].replace(',','.'));
  if (/juta/.test(nm[2])) amount = amount / 1000;
  return {op:op, amount:amount};
}
function _dateOk(entry, df) {
  var monMap = {Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};
  var day, mon, year;
  if (typeof entry === 'string') {
    var m = entry.match(/(\d{1,2})[\s\-]+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-]+(\d{4})/i);
    if (!m) return true;
    day=parseInt(m[1]); mon=m[2].substring(0,3); year=parseInt(m[3]);
  } else {
    var cls = (entry.closing||entry.deadline||'');
    if (!cls) return true;
    var p = cls.match(/(\d{1,2})[\s\-]+(\w+)[\s\-]+(\d{4})/);
    if (!p) return true;
    day=parseInt(p[1]); mon=p[2].substring(0,3); year=parseInt(p[3]);
  }
  if (df.day && df.day !== day) return false;
  if (df.month) { var em=monMap[mon]||0, fm=monMap[df.month]||0; if(fm && em!==fm) return false; }
  if (df.year && df.year !== year) return false;
  return true;
}
function _valueOk(entry, vf) {
  var val;
  if (typeof entry === 'string') {
    var m = entry.match(/Nilai[^:]*:\s*Rp\s*([\d.,]+)\s*M/i) || entry.match(/Rp\s*([\d.,]+)\s*M/i);
    if (!m) return true;
    val = parseFloat(m[1].replace(',','.'));
  } else {
    val = parseFloat((entry.nilai||'0').replace(/[^0-9.]/g,''))||0;
  }
  if (vf.op==='gt') return val > vf.amount;
  if (vf.op==='lt') return val < vf.amount;
  return true;
}
var _dateFilter = parseDateFilter(userWords.join(' '));
var _valueFilter = parseValueFilter(userWords.join(' '));
const filtered = items.filter(item => {
          const il = item.toLowerCase();
          if (il.includes('apakah anda ingin')) return false;
          const compOk = _cKws.length===0||_cKws.every(kw=>{try{return new RegExp('\\b'+kw+'\\b','i').test(il);}catch(e){return il.includes(kw.toLowerCase());}});
          const catOk = _kKws.length===0||_kKws.every(kw=>{const terms=expandCategory(kw);return terms.some(t=>{try{return new RegExp(t,'i').test(il);}catch(e){return il.includes(t);}});});
            if (_dateFilter && !_dateOk(item,_dateFilter)) return false;
  if (_valueFilter && !_valueOk(item,_valueFilter)) return false;
  return compOk && catOk;
        });

        if (filtered.length > 0) {
          const _cLabel = _cKws.length > 0 ? ' dari <strong>' + _cKws.map(k=>k.toUpperCase()).join('/') + '</strong>' : '';
          const _kLabel = _kKws.length > 0 ? ' ' + _kKws[0].toUpperCase() : '';
          const _count = filtered.length;
          const _stdIntro = _count === 1 ? 'Ya, ada 1 tender' + _kLabel + _cLabel + ':<br><br>' : 'Ya, ada ' + _count + ' tender' + _kLabel + _cLabel + ':<br><br>';
          if (_wantsCount || _cKws.length > 0 || _kKws.length > 0) { _dbNeeded = true; }
          else { reply = _stdIntro + '<ol class="reply-list">' + filtered.join('') + '</ol>' + ctaText; }
        } else { _dbNeeded = true; }
      } else { _dbNeeded = true; }

      if (_dbNeeded && (_cKws.length > 0 || _kKws.length > 0)) {
        const _ln2=TENDER_DATABASE.split('\n'); let _dc='';const _db2=[];let _ce=null;
        for (const _l of _ln2) {
          const _ch=_l.match(/---\s*KATEGORI:\s*(.+?)\s*---/i);
          if (_ch){_dc=_ch[1].trim().toLowerCase();_ce=null;continue;}
          const _nm=_l.match(/^\d+\.\s+(.+)/);
          if (_nm){_ce={nama:_nm[1].trim(),cat:_dc,milik:'',nilai:'',closing:'',lokasi:''};continue;}
          if (_ce&&_l.includes('Milik:')){
            const _ps=_l.split('|').map(s=>s.trim());
            _ce.milik=(_ps[0].match(/Milik:\s*(.+)/i)||[])[1]||'';
            for(const _p of _ps){
              if(_p.match(/^Nilai:/i))_ce.nilai=_p.replace(/^Nilai:\s*/i,'');
              if(_p.match(/^Closing:/i))_ce.closing=_p.replace(/^Closing:\s*/i,'');
              if(_p.match(/^Lokasi:/i))_ce.lokasi=_p.replace(/^Lokasi:\s*/i,'');
            }
            const _el2=(_ce.cat+' '+_ce.nama+' '+_ce.milik).toLowerCase();
            if(_cKws.length===0||_cKws.every(kw=>{try{return new RegExp('\\b'+kw+'\\b','i').test(_el2);}catch(e){return _el2.includes(kw.toLowerCase());}})){
              if(_kKws.length===0||_kKws.every(kw=>{const ts=expandCategory(kw);return ts.some(t=>{try{return new RegExp(t,'i').test(_el2);}catch(e){return _el2.includes(t);}});}))_db2.push({..._ce});
            }
            _ce=null;
          }
        }

        if (_db2.length > 0) {
          const _cl2=_cKws.length>0?' dari <strong>'+_cKws.map(k=>k.toUpperCase()).join('/')+'</strong>':'';
          if (_wantsCount && _db2.length > 3) {
            reply = 'Total ada <strong>' + _db2.length + ' tender</strong>' + _cl2 + '. Berikut 3 contoh:<br><br><ol class="reply-list">'
              + _db2.slice(0,3).map(fmtItem).join('')
              + '</ol><br>Ketik <strong>"' + (_kKws.length > 0 ? 'tender ' + _kKws[0] : _cKws.length > 0 ? 'tender ' + _cKws[0] : 'lihat semua') + '"</strong> untuk melihat daftar lengkap.' + ctaText;
          } else {
            /* Paginate post-processing results */
            const _ppTotal = _db2.length;
            const _ppStart = (page - 1) * PAGE_SIZE;
            const _ppEnd = Math.min(_ppStart + PAGE_SIZE, _ppTotal);
            const _ppPage = _db2.slice(_ppStart, _ppEnd);
            const _ppHasMore = _ppEnd < _ppTotal;
            reply = 'Ya, ada '+_ppTotal+' tender'+_cl2+':<br><br><ol class="reply-list" start="'+(_ppStart+1)+'">'
              +_ppPage.map(fmtItem).join('')+'</ol>';
            if (_ppHasMore) {
              reply += '<br><span style="color:#93c5fd;font-style:italic;">Menampilkan '+(_ppStart+1)+'-'+_ppEnd+' dari '+_ppTotal+' tender. Ketik <strong>ya</strong> untuk melihat selanjutnya.</span>';
            } else if (page > 1) {
              reply += '<br><span style="color:#93c5fd;font-style:italic;">Semua '+_ppTotal+' tender telah ditampilkan.</span>';
            } else {
              reply += '<br><span style="color:#93c5fd;font-style:italic;">Apakah ada yang ingin Anda tanyakan lebih lanjut?</span>';
            }
            return res.status(200).json({ reply, pagination: { page: page, total: _ppTotal, hasMore: _ppHasMore } });
          }
        } else {
          const cD=_cKws.length>0?' dari <strong>'+_cKws.map(k=>k.toUpperCase()).join('/')+'</strong>':'';
          const kD=_kKws.length>0?' kategori <strong>'+_kKws.join(', ')+'</strong>':'';
          reply='Maaf, tidak ditemukan tender'+kD+cD+' dalam database kami.';
          const _suggestBtns = [
            ['Drilling & Workover','tender drilling'],['Seismak & Geofisika','tender seismik'],
            ['Komputer & IT','tender komputer IT'],['Marine Transportation','tender marine transportation'],
            ['ManPower & Outsourcing','tender manpower'],['Nilai > 20 Miliar','Ada tender nilainya > 20 miliar?'],
            ['Semua Tender','Ada tender apa saja hari ini?']
          ];
          let _sgHtml = '<br><br><b>Mungkin yang Anda cari?</b><div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">';
          _suggestBtns.forEach(([label, query]) => {
            _sgHtml += '<button onclick="quickAsk(\'' + query.replace(/'/g,"\\'") + '\')" style="background:#2563eb;color:#fff;border:none;border-radius:20px;padding:8px 16px;cursor:pointer;font-size:13px;">' + label + '</button>';
          });
          _sgHtml += '</div>';
          reply += _sgHtml;
        }
      }
    }

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Handler error:', err.message, err.stack);
    return res.status(500).json({ reply: 'Handler error: ' + err.message });
  }
}
