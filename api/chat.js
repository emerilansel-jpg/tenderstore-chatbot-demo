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

Kategori Industri (75+): Agricultural Machinery, Air Cleaner System, Air Conditioner, Automation & Instrumentation, Catering Commercial & Industrial, CCTV, Chemical, Cleaning Service, Cold Storage, Compressor, Computer & IT, Construction Civil & Steel Work, Construction Machinery & Equipment, Construction Material, Conveyor, Cooling Tower, Corrosion Monitor & Control, Crane, Drilling (Oil Gas & Geothermal), Electrical Contractor, Electrical Repair Workshop, Elevator & Escalator, Engineering Consultant, Environmental & Waste Management, EPC, Fabrication, Fabrication Material, Financial Services, Fire Protection & Suppression, Forklift, Gas, Generator Set & Diesel/Gas Engine, Geotechnical & Geophysical Survey, Heavy Equipment, Industrial Equipment, ISP, Laboratory, Lamp & Lighting, Land Transportation Vehicle Rent, Logistic Service, Lubricant, Machining for Industry, Man Power Supply, Marine Contractor & Underwater Work, Marine Equipment, Mechanical Contractor, Mechanical Repair, Medical Supply, MICE, Mining Services & Equipment, Multimedia, Office Supply, Operation & Maintenance Plant, Packaging, Paint & Coating, Permit & License Service, Pipe Casing Tubing & Hose, Power Plant & Electrical Equipment, Printing Machine, Pump, Refractory, Safety Protection, Security Service & Equipment, Ship, Shipyard, Survey & Inspection, Telecommunication, Tools & Hardware, Uniform, Valve, Water & Waste Water Treatment, Water Heater, Welding Equipment, Wire Rope Rigging & Lifting

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body;
  const apiKey = process.env.KIMI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const messages = [
    {
      role: 'system',
      content: `Kamu adalah asisten AI resmi TenderStore.id. Jawab dalam Bahasa Indonesia yang profesional dan ramah. Gunakan knowledgebase berikut untuk menjawab pertanyaan:\n\n${KNOWLEDGEBASE}\n\nJika pertanyaan di luar topik TenderStore.id, arahkan kembali ke topik yang relevan. Selalu tawarkan bantuan lebih lanjut dan arahkan ke kontak jika user tertarik mendaftar.`
    },
    ...(history || []),
    { role: 'user', content: message }
  ];

  try {
    const response = await fetch('https://api.kimi.com/coding/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'kimi-k2.5',
        messages,
        max_tokens: 800,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error' });
    }

    return res.status(200).json({
      reply: data.choices[0].message.content
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to connect to AI service' });
  }
}
