const KNOWLEDGEBASE = `
TenderStore.id - Smart B2B Directory & Hard Selling Tool
Dikembangkan oleh PT. Tender Indonesia, dipimpin CEO Tito Loho.
Beroperasi sejak tahun 2000, terintegrasi dengan Tender-Indonesia.com.

Fitur Utama:
1. Smart Directory - Direktori digital B2B untuk promosi produk/jasa ke project engineer dan pemilik proyek
2. Hard Selling Tool - Mencocokkan produk/jasa Anda langsung ke calon pembeli potensial melalui jaringan Tender-Indonesia.com

Keunggulan:
- Terhubung langsung dengan Detail Tender di Tender-Indonesia.com
- 75+ kategori industri, 2000+ perusahaan, 24+ tahun pengalaman
- Promosi produk tampil di halaman detail tender yang relevan
- Calon pembeli bisa langsung menghubungi perusahaan Anda

Kategori Industri (75+): Agricultural Machinery, Air Cleaner System, Air Conditioner, Automation & Instrumentation, Catering Commercial & Industrial, CCTV, Chemical, Cleaning Service, Cold Storage, Compressor, Computer & IT, Construction Civil & Steel Work, Construction Machinery & Equipment, Construction Material, Conveyor, Cooling Tower, Corrosion Monitor & Control, Crane, Drilling (Oil Gas & Geothermal), Electrical Contractor, Electrical Repair Workshop, Elevator & Escalator, Environmental, Fire Fighting, Furniture & Interior, General Supplier, Generator & Power Supply, GPS, Heavy Equipment, HVAC, Hydraulic & Pneumatic, Industrial Gas, Insulation, IT & Telecommunication, Laboratory Equipment, Logistic, Manpower Supply, Marine & Offshore, Mechanical & Piping, Oil & Gas, Packaging, Paint & Coating, Pipe & Valve, Printing, Pump, Rental Equipment, Rubber & Plastic, Safety Equipment, Scaffolding, Steel, Survey, Tank, Tools, Transportation, Valve, Waste Management, Water Treatment, Welding, dan lainnya.

Benefit Member:
- Profil perusahaan tampil di direktori TenderStore.id
- Produk/jasa dipromosikan ke pemilik proyek dan project engineer
- Terhubung langsung dengan info tender terbaru dari Tender-Indonesia.com
- Hard Selling: sistem otomatis mencocokkan produk Anda dengan kebutuhan tender
- Exposure ke ribuan calon pembeli B2B di Indonesia

Kontak:
- Telepon: +6221 6230 2979
- WhatsApp: +6281282248240
- Email: info@tender-Indonesia.com
- Alamat: Rukan Karang Anyar Permai Baru Blok C No. 21, Jakarta Pusat 10740
- PIC: Linagie (081539335217), Eka (0813-1576-9018)
- Website: https://tenderstore.id
- Parent: https://tender-indonesia.com
`;

const SYSTEM_PROMPT = `Kamu adalah asisten AI resmi TenderStore.id. Jawab pertanyaan user berdasarkan knowledgebase berikut. Jawab dalam Bahasa Indonesia yang profesional dan ramah. Jika pertanyaan di luar topik, arahkan kembali ke layanan TenderStore.id. Gunakan format markdown untuk bold (**text**) pada poin penting. Jawab singkat dan padat, maksimal 200 kata.

Knowledgebase:
${KNOWLEDGEBASE}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history = [] } = req.body;

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-6),
    { role: 'user', content: message }
  ];

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://tenderstore-chatbot-demo.vercel.app',
        'X-Title': 'TenderStore.id AI Assistant'
      },
      body: JSON.stringify({
              model: 'google/gemini-2.0-flash-exp:free',
        messages: messages,
        max_tokens: 800,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ reply: 'Maaf, terjadi kesalahan: ' + (data.error.message || JSON.stringify(data.error)) });
    }

    const reply = data.choices?.[0]?.message?.content || 'Maaf, tidak ada respons dari AI.';
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ reply: 'Maaf, terjadi gangguan koneksi. Silakan coba lagi.' });
  }
}
