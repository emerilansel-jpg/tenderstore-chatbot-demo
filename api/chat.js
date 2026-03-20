const RESPONSES = {
  about: {
    keywords: ['apa itu', 'tenderstore', 'tentang', 'penjelasan', 'siapa', 'what is'],
    reply: '**TenderStore.id** adalah Smart B2B Directory & Hard Selling Tool yang dikembangkan oleh **PT. Tender Indonesia**, dipimpin oleh CEO **Tito Loho**.\n\nBeroperasi sejak tahun 2000 dan terintegrasi dengan Tender-Indonesia.com, TenderStore.id memiliki **2 fitur utama**:\n\n1. **Smart Directory** - Direktori digital B2B untuk promosi produk/jasa ke project engineer dan pemilik proyek\n2. **Hard Selling Tool** - Mencocokkan produk/jasa Anda langsung ke calon pembeli potensial melalui jaringan Tender-Indonesia.com\n\nDengan **75+ kategori industri**, **2.000+ perusahaan**, dan **24+ tahun pengalaman**, kami adalah direktori B2B terlengkap di Indonesia.'
  },
  kategori: {
    keywords: ['kategori', 'industri', 'bidang', 'sektor', 'jenis'],
    reply: 'TenderStore.id mencakup **75+ kategori industri**, antara lain:\n\n- Agricultural Machinery\n- Air Cleaner System\n- Air Conditioner\n- Automation & Instrumentation\n- Catering Commercial & Industrial\n- Chemical\n- Civil Construction\n- Electrical\n- Fire Fighting\n- General Supplier\n- HVAC\n- IT & Telecommunication\n- Laboratory Equipment\n- Marine & Offshore\n- Mechanical & Piping\n- Oil & Gas\n- Safety Equipment\n- dan masih banyak lagi!\n\nSilakan kunjungi https://tenderstore.id untuk melihat daftar lengkap.'
  },
  benefit: {
    keywords: ['benefit', 'keuntungan', 'member', 'manfaat', 'keunggulan', 'kelebihan', 'kenapa'],
    reply: '**Keuntungan menjadi Member TenderStore.id:**\n\n1. Profil perusahaan tampil di direktori TenderStore.id\n2. Produk/jasa dipromosikan ke pemilik proyek dan project engineer\n3. Terhubung langsung dengan info tender terbaru dari Tender-Indonesia.com\n4. **Hard Selling**: sistem otomatis mencocokkan produk Anda dengan kebutuhan tender\n5. Exposure ke ribuan calon pembeli B2B di Indonesia\n\n**Keunggulan lainnya:**\n- Terhubung langsung dengan Detail Tender di Tender-Indonesia.com\n- 75+ kategori industri, 2000+ perusahaan, 24+ tahun pengalaman\n- Promosi produk tampil di halaman detail tender yang relevan\n- Calon pembeli bisa langsung menghubungi perusahaan Anda'
  },
  kontak: {
    keywords: ['kontak', 'hubungi', 'telepon', 'whatsapp', 'email', 'alamat', 'contact', 'wa'],
    reply: '**Hubungi Kami:**\n\n- Telepon: +6221 6230 2979\n- WhatsApp: +6281282248240\n- Email: info@tender-Indonesia.com\n- Alamat: Rukan Karang Anyar Permai Baru Blok C No. 21, Jakarta Pusat 10740\n\n**PIC:**\n- Linagie (081539335217)\n- Eka (0813-1576-9018)\n\n**Website:** https://tenderstore.id\n**Parent:** https://tender-indonesia.com'
  },
  harga: {
    keywords: ['harga', 'biaya', 'price', 'berapa', 'tarif', 'paket'],
    reply: 'Untuk informasi harga dan paket membership TenderStore.id, silakan hubungi tim kami secara langsung:\n\n- WhatsApp: +6281282248240\n- Telepon: +6221 6230 2979\n- Email: info@tender-Indonesia.com\n\nTim kami akan dengan senang hati memberikan penawaran terbaik sesuai kebutuhan bisnis Anda.'
  },
  fitur: {
    keywords: ['fitur', 'feature', 'smart directory', 'hard selling', 'fungsi', 'cara kerja'],
    reply: '**Fitur Utama TenderStore.id:**\n\n**1. Smart Directory**\nDirektori digital B2B untuk promosi produk/jasa ke project engineer dan pemilik proyek. Perusahaan Anda akan tampil di kategori industri yang relevan.\n\n**2. Hard Selling Tool**\nSistem cerdas yang mencocokkan produk/jasa Anda langsung ke calon pembeli potensial melalui jaringan Tender-Indonesia.com. Ketika ada tender yang sesuai dengan produk Anda, sistem otomatis menghubungkan Anda dengan pembeli.\n\nKedua fitur ini bekerja bersama untuk memaksimalkan exposure bisnis Anda di pasar B2B Indonesia.'
  },
  ceo: {
    keywords: ['ceo', 'tito', 'loho', 'pimpinan', 'founder', 'pendiri', 'direksi'],
    reply: 'TenderStore.id dipimpin oleh **CEO Tito Loho**. Beliau memimpin PT. Tender Indonesia yang telah beroperasi sejak tahun 2000, menjadikannya salah satu pelopor direktori B2B dan informasi tender di Indonesia dengan pengalaman lebih dari 24 tahun.'
  }
};

const DEFAULT_REPLY = 'Terima kasih atas pertanyaan Anda! Saya adalah asisten AI TenderStore.id yang siap membantu Anda.\n\nBerikut topik yang bisa saya bantu:\n- **Apa itu TenderStore.id** - Informasi tentang layanan kami\n- **Kategori Industri** - 75+ kategori yang tersedia\n- **Keuntungan Member** - Benefit bergabung\n- **Fitur Utama** - Smart Directory & Hard Selling\n- **Hubungi Kami** - Kontak dan alamat\n\nSilakan tanyakan topik di atas, atau hubungi tim kami di WhatsApp: +6281282248240 untuk pertanyaan lebih spesifik.';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const query = message.toLowerCase();

  let bestMatch = null;
  let bestScore = 0;

  for (const [key, data] of Object.entries(RESPONSES)) {
    let score = 0;
    for (const kw of data.keywords) {
      if (query.includes(kw)) score += kw.length;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = data.reply;
    }
  }

  // Simulate slight delay for natural feel
  await new Promise(r => setTimeout(r, 500 + Math.random() * 500));

  return res.status(200).json({
    reply: bestMatch || DEFAULT_REPLY
  });
}
