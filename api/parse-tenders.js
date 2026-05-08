module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Text is required' });

  const PROVIDERS = [
    { url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', model: 'gemini-2.5-flash', key: process.env.GEMINI_API_KEY },
    { url: 'https://openrouter.ai/api/v1/chat/completions', model: 'google/gemma-4-31b-it:free', key: process.env.OPENROUTER_API_KEY },
    { url: 'https://openrouter.ai/api/v1/chat/completions', model: 'nvidia/nemotron-3-super-120b-a12b:free', key: process.env.OPENROUTER_API_KEY },
    { url: 'https://openrouter.ai/api/v1/chat/completions', model: 'meta-llama/llama-3.3-70b-instruct:free', key: process.env.OPENROUTER_API_KEY },
    { url: 'https://openrouter.ai/api/v1/chat/completions', model: 'qwen/qwen3-coder:free', key: process.env.OPENROUTER_API_KEY },
  ];

  const systemPrompt = `Kamu adalah parser data tender Indonesia. Tugasmu:
1. Baca text mentah yang diberikan user
2. Ekstrak setiap tender yang ditemukan
3. Output HANYA JSON array, tanpa text lain

Format output WAJIB (JSON array):
[
  {
    "nama": "Nama lengkap tender",
    "milik": "NAMA PERUSAHAAN (huruf besar)",
    "nilai": "Rp XX M",
    "closing": "DD-MMM-YYYY",
    "lokasi": "Kota - Provinsi",
    "kategori": "Pilih dari daftar resmi: CHEMICAL & INDUSTRIAL GAS, DRILLING & WORKOVER WELL SERVICE, EPC (Engineering Procurement Construction), FABRICATION & MECHANICAL CONSTRUCTION, INDUSTRIAL MACHINE PART & CONSUMABLE, KOMPUTER IT, MAN POWER GENERAL LABOUR OUTSOURCING, MARINE CONTRACTOR & UNDERWATER WORK, MARINE TRANSPORTATION, PIPE CASING TUBING & HOSE, SURVEY & INSPECTION, VALVE. Jika tidak cocok dengan daftar, buat nama kategori baru yang deskriptif (JANGAN gunakan Other)"
  }
]

ATURAN:
- Nilai dalam format "Rp XX M" (Miliar) atau "Rp XX JT" (Juta)
- Closing date dalam format DD-MMM-YYYY (contoh: 13-Mar-2026)
- Nama perusahaan HURUF BESAR
- Kategori WAJIB pilih dari daftar resmi 12 kategori. Jika benar-benar tidak cocok, buat kategori baru yang spesifik (JANGAN PERNAH gunakan Other)
- Jika ada info yang tidak jelas, isi dengan "N/A"
- HANYA output JSON array, jangan ada text tambahan sebelum atau sesudah JSON`;

  const errors = [];
  const _sleep = function(ms){ return new Promise(function(r){ setTimeout(r, ms); }); };
  for (const provider of PROVIDERS) {
    if (!provider.key) { errors.push(provider.model + ': no API key'); continue; }
    let response = null;
    let attempt = 0;
    let aborted = false;
    while (attempt < 2) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        response = await fetch(provider.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + provider.key,
            'HTTP-Referer': 'https://aitenderindonesia.com',
          },
          body: JSON.stringify({
            model: provider.model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: 'Parse data tender berikut:\n\n' + text.substring(0, 8000) }
            ],
            temperature: 0.1,
            max_tokens: 4000,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (response.status === 429 && attempt === 0) {
          attempt++;
          await _sleep(800 + Math.floor(Math.random()*400));
          continue;
        }
        break;
      } catch (e) {
        aborted = true;
        errors.push(provider.model + ': ' + (e.name === 'AbortError' ? 'timeout 15s' : e.message));
        break;
      }
    }
    if (aborted || !response) continue;
    try {
      if (!response.ok) {
        errors.push(provider.model + ': HTTP ' + response.status);
        continue;
      }
      const result = await response.json();
      const content = (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) || '';

      if (!content.trim()) {
        errors.push(provider.model + ': empty response');
        continue;
      }

      let jsonStr = content;
      jsonStr = jsonStr.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      const jsonMatch = jsonStr.match(/\[[\s\S]*\]/);
      if (jsonMatch) jsonStr = jsonMatch[0];

      const data = JSON.parse(jsonStr);
      const _today = new Date();
      const _months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const _tglPengumuman = _today.getDate().toString().padStart(2,'0') + '-' + _months[_today.getMonth()] + '-' + _today.getFullYear();
      data.forEach(function(item) { if(!item.tanggal_pengumuman) item.tanggal_pengumuman = _tglPengumuman; if(item.kategori) item.kategori = item.kategori.toUpperCase(); });
      if (Array.isArray(data) && data.length > 0) {
        return res.status(200).json({ data: data });
      }
      errors.push(provider.model + ': parsed but empty array');
    } catch (e) {
      errors.push(provider.model + ': ' + (e.name === 'AbortError' ? 'timeout 15s' : e.message));
      continue;
    }
  }

  const _summary = errors.length ? errors.join(' | ') : 'all providers unavailable';
  return res.status(500).json({ error: 'Gagal memproses text. Semua provider AI gagal: ' + _summary + '. Coba lagi dalam 1-2 menit (rate limit) atau periksa format input.' });
};
