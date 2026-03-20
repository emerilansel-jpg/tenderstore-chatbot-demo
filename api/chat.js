const KNOWLEDGEBASE = `
TenderStore.id adalah Smart B2B Directory & Hard Selling Tool dari PT. Tender Indonesia.
CEO: Tito Loho. Berdiri sejak 2000, terintegrasi dengan Tender-Indonesia.com.

FITUR UTAMA:
1. Smart Directory - Direktori digital B2B, profil perusahaan tampil ke project engineer & pemilik proyek
2. Hard Selling Tool - Sistem otomatis mencocokkan produk/jasa ke calon pembeli via jaringan Tender-Indonesia.com

KEUNGGULAN:
- 75+ kategori industri, 2000+ perusahaan terdaftar, 24+ tahun pengalaman
- Terhubung langsung ke info tender aktif di Tender-Indonesia.com
- Promosi produk tampil di halaman detail tender yang relevan
- Calon pembeli bisa langsung kontak perusahaan Anda

KATEGORI INDUSTRI (75+): Agricultural Machinery, Air Cleaner System, Air Conditioner, Automation & Instrumentation, Catering, CCTV, Chemical, Cleaning Service, Cold Storage, Compressor, Computer & IT, Construction Civil & Steel Work, Construction Machinery, Construction Material, Conveyor, Cooling Tower, Crane, Drilling Oil Gas & Geothermal, Electrical, Elevator & Escalator, Environmental, Fire Fighting, Furniture & Interior, General Supplier, Generator & Power Supply, GPS, Heavy Equipment, HVAC, Hydraulic & Pneumatic, Industrial Gas, Insulation, IT & Telecommunication, Laboratory Equipment, Logistic, Manpower Supply, Marine & Offshore, Mechanical & Piping, Oil & Gas, Packaging, Paint & Coating, Pipe & Valve, Printing, Pump, Rental Equipment, Safety Equipment, Scaffolding, Steel, Survey, Tank, Tools, Transportation, Waste Management, Water Treatment, Welding, dan lainnya.

BENEFIT MEMBER:
- Profil perusahaan tampil di direktori TenderStore.id
- Produk/jasa dipromosikan ke pemilik proyek dan project engineer
- Terhubung dengan info tender terbaru dari Tender-Indonesia.com
- Hard Selling: sistem mencocokkan produk ke kebutuhan tender aktif
- Exposure ke ribuan calon pembeli B2B di seluruh Indonesia

INFO KONTAK:
- Telepon: +6221 6230 2979
- WhatsApp: +6281282248240
- Email: info@tender-Indonesia.com
- Alamat: Rukan Karang Anyar Permai Baru Blok C No. 21, Jakarta Pusat 10740
- PIC: Linagie (081539335217), Eka (0813-1576-9018)
- Website: https://tenderstore.id | https://tender-indonesia.com
`;

const SYSTEM_PROMPT = `Kamu adalah Asisten AI resmi TenderStore.id. Tugasmu menjawab pertanyaan calon klien dengan ramah, profesional, dan persuasif dalam Bahasa Indonesia.

Gunakan knowledgebase ini untuk menjawab:
${KNOWLEDGEBASE}

Aturan:
- Jawab dalam Bahasa Indonesia yang profesional
- Gunakan **bold** untuk poin penting
- Maksimal 200 kata per jawaban
- Jika ditanya di luar topik TenderStore, arahkan kembali ke layanan kami
- Selalu akhiri dengan ajakan untuk menghubungi tim kami jika ada pertanyaan lebih lanjut`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-6).filter(m => m.role && m.content),
    { role: 'user', content: message }
  ];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        max_tokens: 600,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ reply: 'Maaf, terjadi kesalahan API: ' + (data.error?.message || 'Unknown error') });
    }

    const reply = data.choices?.[0]?.message?.content || 'Maaf, tidak ada respons.';
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ reply: 'Maaf, terjadi gangguan koneksi. Silakan coba lagi.' });
  }
}
