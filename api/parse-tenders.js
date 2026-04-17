module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Text is required' });

  const PROVIDERS = [
    { url: 'https://openrouter.ai/api/v1/chat/completions', model: 'qwen/qwen3.6-plus-preview:free', key: process.env.OPENROUTER_API_KEY },
    { url: 'https://openrouter.ai/api/v1/chat/completions', model: 'nvidia/nemotron-3-super-120b-a12b:free', key: process.env.OPENROUTER_API_KEY },
    { url: 'https://openrouter.ai/api/v1/chat/completions', model: 'stepfun/step-3.5-flash:free', key: process.env.OPENROUTER_API_KEY },
    { url: 'https://openrouter.ai/api/v1/chat/completions', model: 'arcee-ai/trinity-large-preview:free', key: process.env.OPENROUTER_API_KEY },
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
    "kategori": "Salah satu dari: Drilling & Workover Well Service, Seismic Geotechnic & Geophysics, Computer & IT, Marine Transportation, Man Power General Labour Outsourcing, Chemical & Industrial, Power & Energy, Construction & Infrastructure, Other"
  }
]

ATURAN:
- Nilai dalam format "Rp XX M" (Miliar) atau "Rp XX JT" (Juta)
- Closing date dalam format DD-MMM-YYYY (contoh: 13-Mar-2026)
- Nama perusahaan HURUF BESAR
- Kategori pilih yang paling cocok dari daftar di atas
- Jika ada info yang tidak jelas, isi dengan "N/A"
- HANYA output JSON array, jangan ada text tambahan sebelum atau sesudah JSON`;

  let lastError = '';
  for (const provider of PROVIDERS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(provider.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + provider.key,
          'HTTP-Referer': 'https://tenderstore-chatbot-demo.vercel.app',
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

      if (!response.ok) {
        lastError = provider.model + ': HTTP ' + response.status;
        continue;
      }
      const result = await response.json();
      const content = (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) || '';

      if (!content.trim()) {
        lastError = provider.model + ': empty response';
        continue;
      }

      // Extract JSON from response (handle markdown code blocks and thinking tags)
      let jsonStr = content;
      // Remove <think>...</think> blocks (some models add thinking)
      jsonStr = jsonStr.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      const jsonMatch = jsonStr.match(/\[[\s\S]*\]/);
      if (jsonMatch) jsonStr = jsonMatch[0];

      const data = JSON.parse(jsonStr);
      if (Array.isArray(data) && data.length > 0) {
        return res.status(200).json({ data: data });
      }
      lastError = provider.model + ': parsed but empty array';
    } catch (e) {
      lastError = provider.model + ': ' + (e.name === 'AbortError' ? 'timeout 15s' : e.message);
      continue;
    }
  }

  return res.status(500).json({ error: 'Gagal memproses text (' + lastError + '). Coba lagi atau periksa format input.' });
};
