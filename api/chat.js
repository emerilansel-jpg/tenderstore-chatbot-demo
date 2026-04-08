const EXACT_QA = `
=== JAWABAN WAJIB YANG HARUS DIGUNAKAN PERSIS (IKUTI FORMAT INI) ===

PERTANYAAN 3: Ada tender apa saja hari ini? / semua tender / tender apa saja?
JAWABAN WAJIB:
Dalam sistem kami terdapat tender dalam 5 kategori:<br><br><ol class="reply-list"><li><strong>Drilling & Workover Well Service</strong><br>Contoh: Jasa Sewa Unit Perangkat Rig 550 Hp</li><li><strong>Seismic, Geotechnic, & Geophysics</strong><br>Contoh: Survei Seismik Offshore 2D Kandawulo</li><li><strong>Computer & IT</strong><br>Contoh: Sewa Perangkat Komputer Dan Server</li><li><strong>Marine Transportation</strong><br>Contoh: Provision of Swamp Barge No.1</li><li><strong>Man Power General Labour Outsourcing</strong><br>Contoh: Open Sourcing - Pengadaan Marketing Agency</li></ol>

PERTANYAAN 4: Apakah ada tender yang nilainya lebih dari 20 miliar? / tender nilai lebih 20 M?
JAWABAN WAJIB:
Ya, ada tender dengan nilai lebih dari 20 Miliar:<br><br><ol class="reply-list"><li><strong>Penyewaan & Pengoperasian Artificial Lift (Electrical Submersible Pump)</strong><br>Nilai: Rp 28 M<br>Milik: KSO PERTAMINA EP - FORMASI SUMATERA ENERGI</li><li><strong>Pekerjaan Jasa Lumpur Pemboran Lengkap Dengan Peralatan</strong><br>Nilai: Rp 25 M<br>Milik: PERTAMINA EP</li><li><strong>Jasa Penyediaan Dan Pengoperasian 1 Unit Rig Kapasitas 350 Hp</strong><br>Nilai: Rp 24 M<br>Milik: PERTAMINA - MEDCO E&P TOMORI SULAWESI</li><li><strong>Jasa Sewa Unit Perangkat Rig 550 Hp</strong><br>Nilai: Rp 23 M<br>Milik: PERTAMINA HULU ENERGI WEST MADURA OFFSHORE</li><li><strong>Jasa Penyemenan dan Stimulasi</strong><br>Nilai: Rp 22 M<br>Milik: BP BERAU LTD</li><li><strong>Jasa Electric Logging, Perforation dan Data Processing</strong><br>Nilai: Rp 21 M<br>Milik: KANGEAN ENERGY INDONESIA LTD</li></ol><br><span style="color:#93c5fd;font-style:italic;">Apakah anda ingin melihat tender yang lain?</span>

PERTANYAAN 5: Apakah ada tender Pertamina? / tender pertamina?
JAWABAN WAJIB:
Iya, ada beberapa tender Pertamina:<br><br><ol class="reply-list"><li><strong>Sewa Perangkat Komputer Dan Server</strong><br>Milik: JOB PERTAMINA - MEDCO E&P SIMENGGARIS<br>Kategori: Computer & IT</li><li><strong>Provision of Swamp Barge No.1</strong><br>Milik: PT PERTAMINA HULU MAHAKAM<br>Kategori: Marine Transportation</li><li><strong>Jasa Support Pekerjaan Issuing, Receiving, Serta Pengoperasian Angkutan Berat</strong><br>Milik: PERTAMINA EP<br>Kategori: Man Power</li><li><strong>Jasa Penyediaan Dan Pengoperasian 1 Unit Rig Kapasitas 350 Hp</strong><br>Milik: PERTAMINA - MEDCO E&P TOMORI SULAWESI<br>Kategori: Drilling</li><li><strong>Jasa Sewa Unit Perangkat Rig 550 Hp</strong><br>Milik: PERTAMINA HULU ENERGI WEST MADURA OFFSHORE<br>Kategori: Drilling</li></ol><br><span style="color:#93c5fd;font-style:italic;">Apakah anda ingin melanjutkan melihat detail tender tersebut?</span>
`;

const TENDER_DATABASE = `
=== DATABASE TENDER LENGKAP (HANYA REFERENSI INI YANG BOLEH DIGUNAKAN) ===

--- KATEGORI: Drilling & Workover Well Service ---
1. Nama: Pekerjaan Jasa Lumpur Pemboran Lengkap Dengan Peralatan, Material Dan Personel Untuk Wilayah Jatibarang Zona 7
   Milik: PERTAMINA EP | Nilai: Rp 25 M | Closing: 13-Mar-2026 | Lokasi: Cirebon - Jawa Barat

2. Nama: Jasa Penyediaan Dan Pengoperasian 1 (Satu) Unit Rig Kapasitas 350 Hp Beserta Tenaga Kerja Dan Peralatan Untuk Workover Dan Well Services
   Milik: PERTAMINA - MEDCO E&P TOMORI SULAWESI | Nilai: Rp 24 M | Closing: 12-Mar-2026 | Lokasi: Prabumulih - Sumatera Selatan

3. Nama: Jasa Sewa Unit Perangkat Rig 550 Hp Tambahan Untuk Pekerjaan Sumuran Di Pt Pertamina Ep Zona 7
   Milik: PERTAMINA HULU ENERGI WEST MADURA OFFSHORE | Nilai: Rp 23 M | Closing: 12-Mar-2026 | Lokasi: Cirebon - Jawa Barat

4. Nama: Jasa Penyemenan dan Stimulasi di Pertamina EP Zona 10
   Milik: BP BERAU LTD | Nilai: Rp 22 M | Closing: 09-Mar-2026 | Lokasi: Jakarta Selatan - DKI Jakarta

5. Nama: Jasa Electric Logging, Perforation dan Data Processing (EWLPP) untuk Pekerjaan Well Intervention PT Pertamina EP Zona 7
   Milik: KANGEAN ENERGY INDONESIA LTD | Nilai: Rp 21 M | Closing: 06-Mar-2026 | Lokasi: Jakarta Selatan - DKI Jakarta

6. Nama: Call of Order (COO) Oil Well Cement Class G di Wilayah Kerja PEP Regional 3
   Milik: INPEX MASELA | Nilai: Rp 20 M | Closing: 06-Mar-2026 | Lokasi: Jakarta Selatan - DKI Jakarta

7. Nama: Pekerjaan Electric Wireline Logging, Data Processing dan Interpretation (EWLDPI) Sumur Eksplorasi PT Pertamina EP Regional 2 Tahun 2026-2028
   Milik: PERTAMINA EP | Nilai: Rp 19 M | Closing: 06-Mar-2026 | Lokasi: Jakarta Selatan - DKI Jakarta

8. Nama: Jasa Sewa Perangkat RIG dengan Kapasitas 700 HP sampai 750 HP
   Milik: KSO PERTAMINA EP - FORMASI SUMATERA ENERGI | Nilai: Rp 18 M | Closing: 13-Mar-2026 | Lokasi: Jakarta Selatan - DKI Jakarta

9. Nama: Penyewaan & Pengoperasian Artificial Lift (Electrical Submersible Pump) Lengkap Dengan Fasilitas Dan Sarana Pendukungnya
   Milik: KSO PERTAMINA EP - FORMASI SUMATERA ENERGI | Nilai: Rp 28 M | Closing: 22-Jan-2025 | Lokasi: Jakarta Selatan - DKI Jakarta

10. Nama: Jasa Sewa Perangkat RIG dengan Kapasitas 250 HP
    Milik: KSO PERTAMINA EP - FORMASI SUMATERA ENERGI | Nilai: Rp 17 M | Closing: 30-Oct-2025 | Lokasi: Jakarta Selatan - DKI Jakarta

--- KATEGORI: Seismic, Geotechnic, & Geophysics ---
11. Nama: Survei Seismik Offshore 2D Kandawulo
    Milik: PERTAMINA HULU ENERGI | Nilai: Rp 15 M | Closing: 30-Oct-2025 | Lokasi: Jakarta Selatan - DKI Jakarta

12. Nama: Survei Seismik Offshore 3D Kandawulo
    Milik: PERTAMINA HULU ENERGI | Nilai: Rp 16 M | Closing: 13-Mar-2025 | Lokasi: Jakarta Selatan - DKI Jakarta

13. Nama: Survei Seismik Offshore 2D SE Java
    Milik: PERTAMINA HULU ENERGI | Nilai: Rp 14 M | Closing: 27-Mar-2025 | Lokasi: Jakarta Selatan - DKI Jakarta

14. Nama: Study Local Geoid Modeling Jabung Block
    Milik: PETROCHINA INTERNATIONAL JABUNG LTD | Nilai: Rp 5 M | Closing: 25-Mar-2026 | Lokasi: Jakarta Selatan - DKI Jakarta

--- KATEGORI: Computer & IT ---
15. Nama: Sewa Perangkat Komputer Dan Server Untuk Job P-Meps
    Milik: JOB PERTAMINA - MEDCO E&P SIMENGGARIS | Nilai: Rp 10 M | Closing: 27-Nov-2025 | Lokasi: Nunukan - Kalimantan Timur

16. Nama: Jasa Pembuatan Application Development Services
    Milik: JOB PERTAMINA - MEDCO E&P SIMENGGARIS | Nilai: Rp 6 M | Closing: 04-Jul-2025 | Lokasi: Nunukan - Kalimantan Timur

17. Nama: License Software Utility Untuk Kebutuhan Operasional Perusahaan Job Pmeps
    Milik: JOB PERTAMINA - MEDCO E&P SIMENGGARIS | Nilai: Rp 3 M | Closing: 20-Jun-2025 | Lokasi: Nunukan - Kalimantan Timur

18. Nama: Jasa Managed Network Device dan IT Support
    Milik: JOB PERTAMINA - MEDCO E&P SIMENGGARIS | Nilai: Rp 7 M | Closing: 27-May-2025 | Lokasi: Nunukan - Kalimantan Timur

19. Nama: Pengadaan Penyediaan Layanan Co-Location Disaster Recovery Center (DRC) Tahun 2026
    Milik: PLNE (PRIMA LAYANAN NASIONAL ENJINIRING) | Nilai: Rp 6.5 M | Closing: 04-Apr-2026 | Lokasi: Jakarta Selatan - DKI Jakarta

20. Nama: Jasa Managed Network Device dan IT Support (2025)
    Milik: JOB PERTAMINA - MEDCO E&P SIMENGGARIS | Nilai: Rp 4 M | Closing: 16-Apr-2025 | Lokasi: Nunukan - Kalimantan Timur

--- KATEGORI: Marine Transportation ---
21. Nama: Provision of Swamp Barge No.1
    Milik: PT PERTAMINA HULU MAHAKAM | Nilai: Rp 17 M | Closing: 31-Mar-2026 | Lokasi: Jakarta Selatan - DKI Jakarta

22. Nama: Penyediaan dan Pengoperasian Landing Craft Tank (LCT) Untuk Mendukung Kegiatan Operasi Produksi di Pertamina Field Pangkalan Susu
    Milik: PERTAMINA EP | Nilai: Rp 8 M | Closing: 16-Mar-2026 | Lokasi: Kotabaru - Kalimantan Selatan

23. Nama: Jasa Sewa 1 (Satu) Unit Crew Boat - Unit B
    Milik: PERTAMINA HULU ENERGI WEST MADURA OFFSHORE | Nilai: Rp 16 M | Closing: 23-Jun-2025 | Lokasi: Jakarta Selatan - DKI Jakarta

24. Nama: Penyediaan Jasa Sewa Kapal Harbour Tug
    Milik: PERTAMINA HULU ENERGI WEST MADURA OFFSHORE | Nilai: Rp 14 M | Closing: 03-Mar-2026 | Lokasi: Jakarta Selatan - DKI Jakarta

25. Nama: Rental Of Utility Boat to Support PHE OSES
    Milik: PERTAMINA HULU ENERGI OFFSHORE SOUTHEAST SUMATRA (PHE OSES) | Nilai: Rp 19 M | Closing: 10-Mar-2026 | Lokasi: Jakarta Selatan - DKI Jakarta

--- KATEGORI: Man Power General Labour Outsourcing ---
26. Nama: Penyediaan Jasa Tenaga Kerja Penunjang Untuk Membantu Pekerjaan Administrasi Wilayah Kerja PT Pertamina EP Pangkalan Susu Field
    Milik: PERTAMINA EP | Nilai: Rp 10 M | Closing: 01-Apr-2026 | Lokasi: Kotabaru - Kalimantan Selatan

27. Nama: Pekerjaan Pelaksanaan Kegiatan Penunjang Administrasi Tata Naskah Dinas Dan Kearsipan (TNDK) PT PLN (Persero) Unit Induk Distribusi Bali
    Milik: PLN (PERSERO) DISTRIBUSI BALI | Nilai: Rp 5 M | Closing: 30-Mar-2026 | Lokasi: Denpasar - Bali

28. Nama: Open Sourcing - Pengadaan Marketing Agency Pt Garuda Indonesia (Persero) Tbk
    Milik: PT GARUDA INDONESIA | Nilai: Rp 15 M | Closing: 27-Mar-2026 | Lokasi: Tangerang - Banten

29. Nama: Tangguh Total Resources Management (TRM) - Business Support Services
    Milik: BP BERAU LTD | Nilai: Rp 18 M | Closing: 02-Apr-2026 | Lokasi: Teluk Bintuni - Papua Barat

30. Nama: Jasa Support Pekerjaan Issuing, Receiving, Serta Pengoperasian Angkutan Berat Dan Angkutan Ringan Selama 24 Bulan Di PT Pertamina EP Zona 1 Field Rantau
    Milik: PERTAMINA EP | Nilai: Rp 8 M | Closing: 27-Mar-2026 | Lokasi: Kotabaru - Kalimantan Selatan

31. Nama: Pengadaan Jasa Tenaga Alih Daya (TAD) Pekerjaan Re Handling Material Stockpile Dan SHP
    Milik: PT TIMAH LOGISTIK | Nilai: Rp 1 M | Closing: 26-Mar-2026 | Lokasi: Pangkal Pinang - Kepulauan Babel
`;
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
UNTUK PERTANYAAN TENTANG TENDER: Gunakan PERSIS jawaban yang sudah ditulis di atas dalam bagian JAWABAN WAJIB. JANGAN ubah nama tender, nama perusahaan, atau nilai. Copy persis HTML-nya.

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
Informasi tersebut belum tersedia di sistem kami saat ini `;


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
    'manpower':['manpower','tenaga kerja','outsourcing','sdm','alih daya','tndk','administrasi','kearsipan','naskah','marketing agency','jasa tenaga','agency','support','business','trm','resources','angkutan','issuing','receiving','handling','material','stockpile'],'outsourcing':['outsourcing','manpower','alih daya','support','business','trm','resources','angkutan','issuing','receiving','handling'],'tndk':['tndk','administrasi','kearsipan','naskah dinas','tata naskah','man power','outsourcing']
  };
  return m[kw]||[kw];
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body;
    const history = req.body.history || req.body.conversationHistory || [];
  if (!message) return res.status(400).json({ error: 'Message required' });

  // === DIRECT VALUE FILTER (bypass LLM for nilai/miliar queries) ===
  const _vqMatch = message.match(/(\d+)\s*(miliar|milyar)/i);
  if (_vqMatch || /miliar|milyar/i.test(message)) {
    const _threshold = _vqMatch ? parseInt(_vqMatch[1]) : 20;
    const _dbLines = TENDER_DATABASE.split('\n');
    const _valTenders = [];
    for (let _vi = 0; _vi < _dbLines.length; _vi++) {
      const _vm = _dbLines[_vi].match(/Nilai: Rp (\d+\.?\d*) M/);
      if (_vm && parseFloat(_vm[1]) > _threshold) {
        const _nm = _dbLines[_vi-1] ? _dbLines[_vi-1].match(/Nama: (.+)/) : null;
        const _tName = _nm ? _nm[1].trim() : '';
        const _mkM = _dbLines[_vi].match(/Milik: ([^|]+)/);
        const _milik = _mkM ? _mkM[1].trim() : '';
        const _clM = _dbLines[_vi].match(/Closing: ([^|]+)/);
        const _close = _clM ? _clM[1].trim() : '';
        const _lkM = _dbLines[_vi].match(/Lokasi: (.+)/);
        const _lok = _lkM ? _lkM[1].trim() : '';
        _valTenders.push({name:_tName, val:parseFloat(_vm[1]), milik:_milik, close:_close, lok:_lok});
      }
    }
    if (_valTenders.length > 0) {
      _valTenders.sort((a,b) => b.val - a.val);
      if (_wantsCount && _valTenders.length > 3) {
        const _sample = _valTenders.slice(0,3);
        let _vReply = 'Total ada <strong>' + _valTenders.length + ' tender</strong> dengan nilai lebih dari ' + _threshold + ' Miliar. Berikut 3 contoh:<br><br><ol class="reply-list">';
        _sample.forEach(t => {
          _vReply += '<li><strong>' + t.name + '</strong><br>Milik: ' + t.milik + ' | Nilai: Rp ' + t.val + ' M | Closing: ' + t.close + ' | Lokasi: ' + t.lok + '</li>';
        });
        _vReply += '</ol><br>Ketik <strong>"lihat semua tender nilai > ' + _threshold + ' miliar"</strong> untuk daftar lengkap.';
        return res.status(200).json({ reply: _vReply });
      } else {
        let _vReply = 'Ya, ada ' + _valTenders.length + ' tender dengan nilai lebih dari ' + _threshold + ' Miliar:<br><br><ol class="reply-list">';
        _valTenders.forEach(t => {
          _vReply += '<li><strong>' + t.name + '</strong><br>Milik: ' + t.milik + ' | Nilai: Rp ' + t.val + ' M | Closing: ' + t.close + ' | Lokasi: ' + t.lok + '</li>';
        });
        _vReply += '</ol>';
        return res.status(200).json({ reply: _vReply });
      }
    }
  }

  
    // Dynamic keyword filter - extract user keywords and enforce strict AND matching
    const stopWords = ['ada','apa','tender','yang','dari','untuk','dengan','apakah','saya','mau','cari','lihat','tampilkan','bisa','tolong','minta','ini','itu','di','ke','dan','atau','the','is','are','have','has','do','does','can','please','show','me','all','any','what','which','kalo','kalau','gak','ga','gaa','dong','sih','nih','yah','lah','deh','aja','saja','juga','lebih','kurang','besar','kecil','nilai','harga','biaya','ya','tidak','bukan','semua','beberapa','lain','lainnya','sama','seperti','antara','dalam','pada','akan','sudah','belum','punya','paling','sangat','sekali','only','just','find','list','get','tell','about','punya','berikan','kasih',
      'iya','yep','oke','okay','nah','tapi','koq','kok','cuma','doang','hanya','satu','dua','tiga','empat','lima','bilang','bilangnya','katanya','kata','emang','memang','padahal','soalnya','karena','kenapa','gimana','bagaimana','wah','waduh','lho','loh','toh','masa','mosok','harusnya','seharusnya','ingin','want','more','lagi','banyak','sedikit','dikit','berapa','mana','siapa','kapan','dimana','kemana','ngapa','coba','perlu','harus','jangan','boleh','gapapa','ngga','nggak','baik','bagus','jelek','benar','bener','salah','wrong','right','nyatanya','ternyata','rupanya','ulang','ulangi','cek','check','liat','tampil','tunjukkan','tunjukin','muncul','keluar','ngaco','benaran','beneran','betul','mengapa','tunjuk','kenapa',
      'bukannya','jadi','khan','nya','tuh','gitu','gini','kayak','kayaknya','sepertinya','maksudnya','memangnya','makanya','jadinya','terus','trus','berapa','total','jumlah','hitung','banyak','banyaknya','lalu','kemudian','setelah','sebelum','eh','hmm','ok','yoi','yap','ayo','ayok','serius','cuman','kok','oh','ah','harusnya','katanya','udah','udahan','namanya','halo','hai','hello','hey','terima','closing','date','deadline','tanggal','tendernya','perusahaannya','nilainya','harganya','informasi','infonya','detail','detil','selamat','pagi','siang','sore','malam','datanya','tersedia','masih','sisa','sisanya','berikutnya','selanjutnya','dong','ga','pak','jenis','kategori','hari','saat','list','carikan','tunjukkan','lagi','lainnya','lain','tau','info','miliar','milyar','juta','ribu','billion','million','rupiah','rp','idr'];
        const preserveShort = ['it', 'ip'];
    const userWords = message.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z0-9]/g, '')).filter(w => w.length > 2 || preserveShort.includes(w));
    let filterWords = userWords.filter(w => !stopWords.includes(w) && (w.length > 2 || preserveShort.includes(w)));
    const _wantsAll = /\b(semua|seluruh)\b/.test(message.toLowerCase()) && filterWords.length === 0;
  const _wantsCategories = /\b(apa saja|apa aja|semua kategori|kategori apa|tender apa)\b/.test(message.toLowerCase()) && filterWords.length === 0;
  const _wantsContinuation = /\b(lainnya|lagi|selanjutnya|berikutnya|sisanya)\b/i.test(message) && history.length > 0 && filterWords.length === 0;
  const _wantsCount = /\b(berapa|total|jumlah|hitung|banyak|banyaknya)\b/i.test(message);
  let _contCategory = '';
  if (_wantsContinuation) {
    const lastAsst = [...history].reverse().find(m => m.role === 'assistant');
    if (lastAsst) {
      const h = lastAsst.content.toLowerCase();
      if (h.includes('drilling') || h.includes('pemboran') || h.includes('rig')) _contCategory = 'drilling';
      else if (h.includes('marine') || h.includes('kapal') || h.includes('transportation')) _contCategory = 'marine';
      else if (h.includes('seismic') || h.includes('seismik')) _contCategory = 'seismic';
      else if (h.includes('computer') || h.includes('software')) _contCategory = 'computer';
      else if (h.includes('man power') || h.includes('manpower')) _contCategory = 'man power';
    }
  }
    // CONTEXT RECOVERY: if filterWords empty (conversational), recover last search from history
    if (filterWords.length === 0 && !_wantsAll && !_wantsCategories && !_wantsContinuation) {
      const _msgHist = history || [];
      for (let _hi = _msgHist.length - 1; _hi >= 0; _hi--) {
        if (_msgHist[_hi].role === 'user') {
          const _hw = _msgHist[_hi].content.toLowerCase().split(/\s+/).map(w=>w.replace(/[^a-z0-9]/g,'')).filter(w=>w.length>2||preserveShort.includes(w));
          const _hf = _hw.filter(w=>!stopWords.includes(w));
          if (_hf.length > 0) { filterWords = _hf; break; }
        }
      }
      if (filterWords.length === 0) {
        return res.json({ reply: 'Untuk membantu pencarian tender, silakan sebutkan kategori (contoh: drilling, marine, IT) atau nama perusahaan (contoh: Pertamina, PLN, BP).' });
      }
    }
    const _tdU = TENDER_DATABASE.toUpperCase();
    const _mR = /MILIK:\s*([^\n|<]+)/g; let _mM; const _aM = [];
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
      'seismik':'Seismic Geotechnic Geophysics','seismic':'Seismic Geotechnic Geophysics',
      'geoteknik':'Seismic Geotechnic Geophysics','geotechnic':'Seismic Geotechnic Geophysics',
      'it':'Computer dan IT','komputer':'Computer dan IT','server':'Computer dan IT',
      'software':'Computer dan IT','network':'Computer dan IT','drc':'Computer dan IT',
      'manpower':'Man Power','outsourcing':'Man Power','tenaga':'Man Power','sdm':'Man Power','tndk':'Man Power','administrasi':'Man Power','kearsipan':'Man Power'
    };
    const _catNames = [...new Set(categoryKwsG.map(k => _catNameMap[k.toLowerCase()]).filter(Boolean))];
    const _cd = companyKwsG.length > 0 ? ' Perusahaan:[' + companyKwsG.join(',') + '].' : '';
    const _kd = _catNames.length > 0 ? ' Kategori: ' + _catNames.join(' / ') + '. Tampilkan SEMUA tender dalam kategori ini tanpa terkecuali.' : (categoryKwsG.length > 0 ? ' Kategori:[' + categoryKwsG.join(',') + '].' : '')
    const keywordFilter = _wantsCategories
      ? '\n\n=== INSTRUKSI ===\nUser bertanya ada tender/kategori apa saja. Tampilkan ringkasan semua kategori yang tersedia berikut 1 contoh tender per kategori. Format: Kategori X (N tender): [nama tender contoh]. Sebutkan semua 5 kategori.'
      : _wantsAll
      ? '\n\n=== INSTRUKSI ===\nUser ingin melihat SEMUA tender. Tampilkan seluruh tender dalam database diurutkan per kategori. Jangan filter perusahaan atau kategori apapun.'
      : _wantsContinuation
      ? '\n\n=== INSTRUKSI ===\nUser bertanya tentang tender lainnya. Tampilkan SEMUA tender untuk kategori ' + (_contCategory || 'yang sebelumnya dicari') + '. Jangan batasi jumlah tender. Jangan tambahkan kalimat tawaran seperti "apakah ingin melihat lainnya".'
      : filterWords.length >= 1
      ? '\n\n=== INSTRUKSI FILTER WAJIB ===\nKeyword:[' + filterWords.join(',') + '].' + _cd + _kd +
        '\n0. PENTING: ABAIKAN jumlah/daftar tender di bagian contoh jawaban atas. Selalu hitung ulang langsung dari TENDER_DATABASE dan tampilkan SEMUA tender yang cocok, jangan batasi.' +
        '\n1. HANYA tampilkan tender cocok SEMUA kriteria (perusahaan DAN kategori sekaligus).' +
        '\n2. marine PLN = Marine Transportation DAN milik PLN. Tidak ada? jawab tidak ditemukan.' +
        '\n3. JANGAN tampilkan tender kategori lain meskipun perusahaan cocok.' +
        '\n4. JANGAN tampilkan tender perusahaan lain meskipun kategori cocok.' +
        '\n5. Tidak cocok semua? Jawab: Maaf tidak ditemukan tender [kriteria] dalam database kami.' +
        '\n6. Jika HANYA Perusahaan disebutkan (tanpa kategori), tampilkan SEMUA tender dari perusahaan tsb apapun kategorinya.' +
        '\n7. PENTING: Tampilkan SEMUA tender yang cocok tanpa membatasi jumlah.' +
        '\n8. JANGAN tambahkan kalimat tawaran seperti \'apakah ingin melihat lainnya\' atau \'mau saya tampilkan lebih banyak\'. Tampilkan semuanya langsung.'
      : '';
const messages = [
    { role: 'system', content: SYSTEM_PROMPT + keywordFilter },
    ...history.slice(-6).filter(m => m.role && m.content),
    { role: 'user', content: message }
  ];

  try {
    // === MULTI-PROVIDER: Gemini (primary) -> OpenRouter fallbacks ===
    const PROVIDERS = [
      {
        name: 'Gemini',
        url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
        key: process.env.GEMINI_API_KEY || '',
        model: 'gemini-2.5-flash',
        max_tokens: 3000,
        temperature: 0.1
      },
      {
        name: 'Qwen 3.6 Plus',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        key: process.env.OPENROUTER_API_KEY || '',
        model: 'qwen/qwen3.6-plus-preview:free',
        max_tokens: 3000,
        temperature: 0.1
      },
      {
        name: 'Nemotron 3 Super',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        key: process.env.OPENROUTER_API_KEY || '',
        model: 'nvidia/nemotron-3-super-120b-a12b:free',
        max_tokens: 3000,
        temperature: 0.1
      },
      {
        name: 'Step 3.5 Flash',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        key: process.env.OPENROUTER_API_KEY || '',
        model: 'stepfun/step-3.5-flash:free',
        max_tokens: 3000,
        temperature: 0.1
      },
      {
        name: 'Trinity Large',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        key: process.env.OPENROUTER_API_KEY || '',
        model: 'arcee-ai/trinity-large-preview:free',
        max_tokens: 3000,
        temperature: 0.1
      }
    ];

    let lastError = null;
    let data = null;

    for (const provider of PROVIDERS) {
      if (!provider.key) { lastError = provider.name + ': no API key'; continue; }
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT);
        const response = await fetch(provider.url, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + provider.key,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: provider.model,
            messages,
            max_tokens: provider.max_tokens,
            temperature: provider.temperature
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        const d = await response.json();
        if (!response.ok) {
          console.error(provider.name + ' error:', response.status);
          lastError = provider.name + ' error ' + response.status;
          continue;
        }
        if (d.choices && d.choices[0] && d.choices[0].message) {
          data = d;
          var _finishReason = (d.choices[0] && d.choices[0].finish_reason) || 'stop';
          console.log('Success with ' + provider.name);
          break;
        }
      } catch (providerErr) {
        const isTimeout = providerErr.name === 'AbortError';
        lastError = provider.name + (isTimeout ? ': timeout ' + PROVIDER_TIMEOUT + 'ms' : ': ' + providerErr.message);
        console.log(lastError + ' \u2014 trying next provider...');
        continue;
      }
    }

    if (!data) {
      return res.status(500).json({ reply: 'Semua provider sedang bermasalah. ' + (lastError || '') });
    }
    let reply = data.choices?.[0]?.message?.content || 'Maaf, tidak ada respons.';
    if (typeof _finishReason !== 'undefined' && _finishReason === 'length') {
      reply += '<br><br><em>\u26A0\uFE0F Jawaban terpotong karena terlalu panjang. Ketik <strong>"lanjutkan"</strong> untuk melihat sisanya.</em>';
    }

    // Safety net: paksa konversi markdown ke HTML
    reply = reply
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^[\*\-] (.+)$/gm, '<li>$1</li>');

    // === KB STRICT VALIDATION: Remove hallucinated items ===
  // Build whitelist of known company names from knowledge base
  const kbSrc = (EXACT_QA + TENDER_DATABASE + SYSTEM_PROMPT).toUpperCase();
  const kbCompanies = new Set();
  const kbRe = /MILIK\s*:\s*([^\n<]{4,})/g;
  let kbM;
  while ((kbM = kbRe.exec(kbSrc)) !== null) {
    const name = kbM[1].trim().split(/[<\n]/)[0].trim().toUpperCase();
    if (name.length >= 4) kbCompanies.add(name.substring(0, 20));
  }
  // Validate each <li> item against KB whitelist
  if (kbCompanies.size > 0 && reply.includes('<li>')) {
    const kbParts = reply.split(/(?=<li>)/i);
    const kbIntro = kbParts[0];
    const kbItems = kbParts.slice(1);
    const kbValidItems = kbItems.filter(item => {
      const iu = item.toUpperCase();
      const mi = iu.indexOf('MILIK');
      if (mi < 0) return true; // no Milik field, pass through
      const afterMilik = iu.substring(mi + 5).replace(/^[\s:]+/, '');
      const itemCompany = afterMilik.split(/[<\n]/)[0].trim().toUpperCase().substring(0, 20);
      // Check if any KB company name starts with same prefix as item company
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

  // Post-processing: remove tender items not matching user keywords
    if (filterWords.length >= 1) {
      // Separate CTA/question text from main content
      let mainReply = reply;
      let ctaText = "";
      const ctaMatch = reply.match(/(<br>\s*)*(<em>.*<\/em>|Apakah\s+Anda\s+ingin.*$)/is);
      if (ctaMatch) {
        const ctaIdx = reply.indexOf(ctaMatch[0]);
        mainReply = reply.substring(0, ctaIdx);
        ctaText = reply.substring(ctaIdx);
      }
      // Split main content by <li> or numbered patterns
      let items = [];
      let intro = "";
      if (mainReply.includes("<li>")) {
        const parts = mainReply.split(/(?=<li>)/i);
        intro = parts[0];
        items = parts.slice(1);
      } else if (/\d+\.\s/.test(mainReply)) {
        const parts = mainReply.split(/(?=\d+\.\s)/);
        intro = parts[0];
        items = parts.slice(1);
      }
          let _dbNeeded = false;
            let _cKws = companyKwsG, _kKws = filterWords.filter(kw => !companyKwsG.includes(kw));
            if (items.length > 0) {
              const _cL = filterWords.filter(kw => { const kl=kw.toLowerCase(); return items.some(it=>{const li=it.toLowerCase();const mi=li.indexOf('milik');return mi>=0&&li.substring(mi).includes(kl);});});
              _cKws = companyKwsG.length > 0 ? companyKwsG : _cL;
              _kKws = filterWords.filter(kw => !_cKws.includes(kw));
              const filtered = items.filter(item => {
                const il = item.toLowerCase();
                if (il.includes('apakah anda ingin')) return false;
                const compOk = _cKws.length===0||_cKws.every(kw=>{try{return new RegExp('\\b'+kw+'\\b','i').test(il);}catch(e){return il.includes(kw.toLowerCase());}});
                const catOk = _kKws.length===0||_kKws.every(kw=>{const terms=expandCategory(kw);return terms.some(t=>{try{return new RegExp(t,'i').test(il);}catch(e){return il.includes(t);}});});
                return compOk && catOk;
              });
              if (filtered.length > 0) {
        // INSPECTION: validate count accuracy + build standardized intro
        const _cLabel = _cKws.length > 0 ? ' dari <strong>' + _cKws.map(k=>k.toUpperCase()).join('/') + '</strong>' : '';
        const _kLabel = _kKws.length > 0 ? ' ' + _kKws[0].toUpperCase() : '';
        const _count = filtered.length;
        const _stdIntro = _count === 1
          ? 'Ya, ada 1 tender' + _kLabel + _cLabel + ':<br><br>'
          : 'Ya, ada ' + _count + ' tender' + _kLabel + _cLabel + ':<br><br>';
              if (_wantsCount || _cKws.length > 0) {
                        _dbNeeded = true;
              } else {
                reply = _stdIntro + '<ol class="reply-list">' + filtered.join('') + '</ol>' + ctaText;
              }
      }
              else { _dbNeeded = true; }
            } else { _dbNeeded = true; }
            if (_dbNeeded && (_cKws.length > 0 || _kKws.length > 0)) {
              const _ln2=TENDER_DATABASE.split('\n');
              let _dc='';const _db2=[];let _ce=null;
              for (const _l of _ln2) {
                const _ch=_l.match(/---\s*KATEGORI:\s*(.+?)\s*---/i);
                if (_ch){_dc=_ch[1].trim().toLowerCase();_ce=null;continue;}
                const _nm=_l.match(/^\d+\.\s+Nama:\s*(.+)/i);
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
                  const _ml2=_ce.milik.toLowerCase();
                  if(_cKws.length===0||_cKws.every(kw=>{try{return new RegExp('\\b'+kw+'\\b','i').test(_el2);}catch(e){return _el2.includes(kw.toLowerCase());}})){
                    if(_kKws.length===0||_kKws.every(kw=>{const ts=expandCategory(kw);return ts.some(t=>{try{return new RegExp(t,'i').test(_el2);}catch(e){return _el2.includes(t);}});}))_db2.push({..._ce});
                  }
                  _ce=null;
                }
              }
              if (_db2.length > 0) {
                const _cl2=_cKws.length>0?' dari <strong>'+_cKws.map(k=>k.toUpperCase()).join('/')+'</strong>':'';
        if (_wantsCount && _db2.length > 3) {
          reply = 'Total ada <strong>' + _db2.length + ' tender</strong>' + _cl2 + '. Berikut 3 contoh:<br><br><ol class="reply-list">' + _db2.slice(0,3).map(f=>'<li><strong>'+f.nama+'</strong><br>Milik: '+f.milik+'<br>Nilai: '+f.nilai+'<br>Closing: '+f.closing+'<br>Lokasi: '+f.lokasi+'</li>').join('') + '</ol><br>Ketik <strong>"lihat semua"</strong> untuk melihat daftar lengkap.' + ctaText;
        } else {
          reply='Ya, ada tender'+_cl2+':<br><br><ol class="reply-list">'+_db2.map(f=>'<li><strong>'+f.nama+'</strong><br>Milik: '+f.milik+'<br>Nilai: '+f.nilai+'<br>Closing: '+f.closing+'<br>Lokasi: '+f.lokasi+'</li>').join('')+'</ol><br><span style="color:#93c5fd;font-style:italic;">Apakah ada yang ingin Anda tanyakan lebih lanjut?</span>';
        }
              } else {
                const cD=_cKws.length>0?' dari <strong>'+_cKws.map(k=>k.toUpperCase()).join('/')+'</strong>':'';
                const kD=_kKws.length>0?' kategori <strong>'+_kKws.join(', ')+'</strong>':'';
                reply='Maaf, tidak ditemukan tender'+kD+cD+' dalam database kami.';

        // === SUGGESTION BUTTONS (when no results found) ===
        const _suggestBtns = [
          ['Drilling & Workover','tender drilling'],
          ['Seismik & Geofisika','tender seismik'],
          ['Komputer & IT','tender komputer IT'],
          ['Marine Transportation','tender marine transportation'],
          ['ManPower & Outsourcing','tender manpower'],
          ['Nilai > 20 Miliar','Ada tender nilainya > 20 miliar?'],
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
