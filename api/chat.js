const EXACT_QA = `
=== JAWABAN YANG HARUS DIGUNAKAN PERSIS (WAJIB IKUTI FORMAT INI) ===

PERTANYAAN 1: Apakah ada tender drilling? / ada tender drilling?
JAWABAN WAJIB:
Ya, ada beberapa tender drilling:<br><br><ol class="reply-list"><li><strong>Pekerjaan Jasa Lumpur Pemboran Lengkap Dengan Peralatan</strong><br>Milik: PERTAMINA EP</li><li><strong>Penyediaan Dan Pengoperasian 1 Satu Unit Rig Kapasitas 350 HP</strong><br>Milik: PERTAMINA - MEDCO EP TOMORI SULAWESI</li><li><strong>Sewa Unit Perangkat Rig 550 HP</strong><br>Milik: PERTAMINA HULU ENERGI WEST MADURA OFFSHORE</li><li><strong>Jasa Penyemenan dan Stimulasi di Pertamina EP Zona 10</strong><br>Milik: BP BERAU LTD</li><li><strong>Jasa Electric Logging, Perforation dan Data Processing</strong><br>Milik: KANGEAN ENERGY INDONESIA LTD</li><li><strong>Oil Well Cement Class G</strong><br>Milik: INPEX MASELA</li></ol><br><span style="color:#93c5fd;font-style:italic;">Apakah Anda ingin melihat yang lainnya?</span>

PERTANYAAN 2: Apakah ada tender drilling pertamina? / tender drilling pertamina?
JAWABAN WAJIB:
Ya, ada tender drilling Pertamina:<br><br><ol class="reply-list"><li><strong>Jasa Lumpur Pemboran Lengkap Dengan Peralatan</strong><br>Milik: PERTAMINA EP</li><li><strong>Penyediaan Dan Pengoperasian 1 Satu Unit Rig Kapasitas 350 HP</strong><br>Milik: KSO PERTAMINA EP - FORMASI SUMATERA ENERGI</li><li><strong>Sewa Unit Perangkat Rig 550 HP</strong><br>Milik: PERTAMINA HULU ENERGI WEST MADURA OFFSHORE</li><li><strong>Pekerjaan Electric Wireline Logging</strong><br>Milik: Pertamina EP</li><li><strong>Jasa Sewa Perangkat RIG dengan Kapasitas 700 HP</strong><br>Milik: KSO PERTAMINA EP - FORMASI SUMATERA ENERGI</li><li><strong>Penyewaan Pengoperasian Artificial Lift Electrical Submersible Pump</strong><br>Milik: KSO PERTAMINA EP - FORMASI SUMATERA ENERGI</li></ol><br><span style="color:#93c5fd;font-style:italic;">Apakah Anda ingin melihat tender drilling Pertamina lainnya?</span>

PERTANYAAN 3: Ada tender apa saja hari ini? / semua tender / tender apa saja?
JAWABAN WAJIB:
Dalam sistem kami terdapat tender dalam 5 kategori:<br><br><ol class="reply-list"><li><strong>Drilling Workover Well Service</strong><br>Contoh: Jasa Sewa Unit Perangkat Rig 550 HP</li><li><strong>Seismic, Geotechnic, Geophysics</strong><br>Contoh: Survei Seismik Offshore 2D Kandawulo</li><li><strong>Computer &amp; IT</strong><br>Contoh: Sewa Perangkat Komputer Dan Server</li><li><strong>Marine Transportation</strong><br>Contoh: Provision of Swamp Barge No.1</li><li><strong>Man Power General Labour Outsourcing</strong><br>Contoh: Open Sourcing - Pengadaan Marketing Agency</li></ol><br><span style="color:#93c5fd;font-style:italic;">Apakah Anda ingin melihat detail per kategori?</span>

PERTANYAAN 4: Apakah ada tender yang nilainya lebih dari 20 miliar? / tender nilai lebih 20 M?
JAWABAN WAJIB:
Ya, ada tender dengan nilai lebih dari 20 Miliar:<br><br><ol class="reply-list"><li><strong>Jasa Lumpur Pemboran Lengkap Dengan Peralatan</strong><br>Nilai: Rp 25 M</li><li><strong>Penyediaan Dan Pengoperasian 1 Satu Unit Rig Kapasitas 350 HP</strong><br>Nilai: Rp 24 M</li><li><strong>Jasa Sewa Unit Perangkat Rig 550 HP</strong><br>Nilai: Rp 23 M</li><li><strong>Jasa Penyemenan dan Stimulasi</strong><br>Nilai: Rp 22 M</li><li><strong>Jasa Electric Logging, Perforation dan Data Processing</strong><br>Nilai: Rp 21 M</li></ol><br><span style="color:#93c5fd;font-style:italic;">Apakah Anda ingin melihat tender yang lain?</span>

PERTANYAAN 5: Apakah ada tender Pertamina? / tender pertamina?
JAWABAN WAJIB:
Iya, ada beberapa tender Pertamina:<br><br><ol class="reply-list"><li><strong>Sewa Perangkat Komputer Dan Server</strong><br>Milik: JOB PERTAMINA - MEDCO EP SIMENGGARIS</li><li><strong>Provision of Swamp Barge No.1</strong><br>Milik: PT PERTAMINA HULU MAHAKAM</li><li><strong>Jasa Support Pekerjaan Issuing, Receiving, Serta Pengoperasian Angkutan Berat</strong><br>Milik: Pertamina EP</li><li><strong>Jasa Penyediaan Dan Pengoperasian 1 Satu Unit Rig Kapasitas 350 HP</strong><br>Milik: PERTAMINA - MEDCO EP TOMORI SULAWESI</li><li><strong>Jasa Sewa Unit Perangkat Rig 550 HP</strong><br>Milik: PERTAMINA HULU ENERGI WEST MADURA OFFSHORE</li></ol><br><span style="color:#93c5fd;font-style:italic;">Apakah Anda ingin melanjutkan melihat detail tender tersebut?</span>
`;

const COMPANY_INFO = `
=== TENTANG PT. TENDER INDONESIA ===
PT. Tender Indonesia (www.Tender-Indonesia.com) adalah perusahaan penyedia informasi tender/proyek terlengkap di Indonesia.
Berdiri sejak tahun 2000 di Jakarta. Tagline: "Mitra strategi anda untuk sukses mendapatkan proyek."
CEO & President Director: Tito Loho
Terdapat 82 jenis kategori tender proyek.

=== TENDERSTORE.ID ===
TenderStore.id adalah Smart B2B Directory & Hard Selling Tool dari PT. Tender Indonesia.
KEUNGGULAN: 75+ kategori industri, 2000+ perusahaan terdaftar, 24+ tahun pengalaman
MEMBERSHIP: Biaya Rp. 11,9 Juta/Tahun (Incl PPN)

=== KONTAK ===
Telepon: (021) 6230 2979
WhatsApp: 0812-8224-8240
Email: info@tender-indonesia.com
`;

const SYSTEM_PROMPT = `Kamu adalah Asisten AI resmi TenderStore.id. Jawab dalam Bahasa Indonesia yang ramah dan profesional.

${EXACT_QA}

${COMPANY_INFO}

=== INSTRUKSI UTAMA ===
UNTUK PERTANYAAN TENTANG TENDER: Gunakan PERSIS jawaban yang sudah ditulis di atas dalam bagian JAWABAN WAJIB. JANGAN ubah nama tender, nama perusahaan, atau nilai. Copy persis HTML-nya.

FORMAT WAJIB HTML (BUKAN MARKDOWN):
- Gunakan <strong>teks</strong> BUKAN **teks**
- Gunakan <ol class="reply-list"><li>...</li></ol> untuk daftar
- Gunakan <br><br> untuk jarak paragraf
- Gunakan <span style="color:#93c5fd;font-style:italic;">teks</span> untuk CTA penutup
- JANGAN PERNAH gunakan ** atau - bullet atau # heading


=== ATURAN FILTER KETAT (WAJIB DIPATUHI) ===
- Jika user menyebut BEBERAPA kata kunci (misal: drilling medco), HANYA tampilkan tender yang cocok dengan SEMUA kata kunci tersebut (logika AND, BUKAN OR).
- Contoh: tender drilling medco = harus drilling DAN medco. Jangan tampilkan tender drilling yang bukan milik Medco.
- Contoh: tender IT pertamina = harus kategori IT DAN milik Pertamina.
- Cocokkan kata kunci dengan SEMUA field: nama tender, pemilik/milik, kategori, deskripsi.
- Jika tidak ada tender yang cocok dengan SEMUA kata kunci, jawab bahwa tidak ditemukan tender yang sesuai. JANGAN tampilkan tender yang hanya cocok sebagian.
- DILARANG KERAS menampilkan tender yang tidak mengandung salah satu kata kunci yang disebutkan user.

ATURAN JAWABAN:
- Jawab SINGKAT & SKIMMER-FRIENDLY ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ pakai list, bukan paragraf panjang
- Selalu akhiri dengan CTA (ajakan hubungi tim atau lihat lebih lanjut)
- Jika pertanyaan TIDAK ADA di database, gunakan fallback kontak di bawah
- DILARANG mengarang data tender yang tidak ada di atas

FALLBACK jika tidak ada di database:
Informasi tersebut belum tersedia di sistem kami saat ini ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ tapi <strong>tim TenderStore.id siap membantu Anda</strong>.<br><br><ul class="reply-list"><li>ÃÂÃÂÃÂÃÂ°ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ² <strong>WhatsApp:</strong> <a href="https://wa.me/6281282248240" target="_blank" style="color:#34d399;">0812-8224-8240</a></li><li>ÃÂÃÂÃÂÃÂ°ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ§ <strong>Email:</strong> info@tender-indonesia.com</li><li>ÃÂÃÂÃÂÃÂ°ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ <strong>Telepon:</strong> (021) 6230 2979</li></ul><br><span style="color:#93c5fd;font-style:italic;">Tim kami siap bantu dalam waktu singkat! ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¡</span>`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  
    // Dynamic keyword filter - extract user keywords and enforce strict AND matching
    const stopWords = ['ada','apa','tender','yang','dari','untuk','dengan','apakah','saya','mau','cari','lihat','tampilkan','bisa','tolong','minta','ini','itu','di','ke','dan','atau','the','is','are','have','has','do','does','can','please','show','me','all','any','what','which'];
    const userWords = message.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const filterWords = userWords.filter(w => !stopWords.includes(w));
    const keywordFilter = filterWords.length > 1 
      ? '\n\n=== INSTRUKSI FILTER WAJIB ===\nUser menyebut keyword spesifik: [' + filterWords.join(', ') + ']. Kamu WAJIB:\n1. HANYA tampilkan tender yang mengandung SEMUA keyword tersebut (di nama tender, pemilik, atau deskripsi).\n2. JANGAN PERNAH tampilkan tender yang TIDAK mengandung salah satu keyword di atas.\n3. Jika tidak ada tender yang cocok SEMUA keyword, jawab: Maaf, tidak ditemukan tender yang cocok dengan semua kriteria tersebut.\n4. Ini adalah aturan MUTLAK yang tidak boleh dilanggar.'
      : '';
    
const messages = [
    { role: 'system', content: SYSTEM_PROMPT + keywordFilter },
    ...history.slice(-6).filter(m => m.role && m.content),
    { role: 'user', content: message }
  ];

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct',
        messages,
        max_tokens: 600,
        temperature: 0.1
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ reply: 'Maaf, terjadi kesalahan. Silakan hubungi tim kami di WhatsApp 0812-8224-8240.' });
    }

    let reply = data.choices?.[0]?.message?.content || 'Maaf, tidak ada respons.';

    // Safety net: paksa konversi markdown ke HTML
    reply = reply
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^[\*\-] (.+)$/gm, '<li>$1</li>');

    // Post-processing: remove tender items not matching ALL user keywords
    if (filterWords.length > 1) {
      // First, separate CTA/question text from the main content
      let mainReply = reply;
      let ctaText = "";
      // Remove trailing CTA like "Apakah Anda ingin..." or <em>...</em>
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
      if (items.length > 0) {
        // Detect company keywords (appear in Milik fields)
        const companyKws = filterWords.filter(kw => {
          const kwl = kw.toLowerCase();
          return items.some(it => {
            const lower = it.toLowerCase();
            const milikIdx = lower.indexOf("milik");
            return milikIdx >= 0 && lower.substring(milikIdx).includes(kwl);
          });
        });
        const mustMatch = companyKws.length > 0 ? companyKws : filterWords;
        const filtered = items.filter(item => {
          const il = item.toLowerCase();
          return mustMatch.every(kw => il.includes(kw.toLowerCase()));
        });
        if (filtered.length === 0) {
          reply = 'Maaf, tidak ditemukan tender yang cocok dengan semua kriteria: <strong>' + filterWords.join(', ') + '</strong>.';
        } else {
          reply = intro + filtered.join('') + ctaText;
        }
      }
    }

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ reply: 'Maaf, terjadi gangguan. Silakan hubungi WhatsApp 0812-8224-8240.' });
  }
}
