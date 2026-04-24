module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const PROVIDERS = [
    {
      name: 'Gemini 2.5 Flash',
      url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      key: process.env.GEMINI_API_KEY || '',
      model: 'gemini-2.5-flash',
      source: 'chat.js (primary)'
    },
    {
      name: 'Gemma 4 31B',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      key: process.env.OPENROUTER_API_KEY || '',
      model: 'google/gemma-4-31b-it:free',
      source: 'parse-tenders.js + chat.js'
    },
    {
      name: 'Nemotron 3 Super',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      key: process.env.OPENROUTER_API_KEY || '',
      model: 'nvidia/nemotron-3-super-120b-a12b:free',
      source: 'parse-tenders.js + chat.js'
    },
    {
      name: 'Llama 3.3 70B',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      key: process.env.OPENROUTER_API_KEY || '',
      model: 'meta-llama/llama-3.3-70b-instruct:free',
      source: 'parse-tenders.js + chat.js'
    },
    {
      name: 'Qwen3 Coder',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      key: process.env.OPENROUTER_API_KEY || '',
      model: 'qwen/qwen3-coder:free',
      source: 'parse-tenders.js + chat.js'
    }
  ];

  const results = await Promise.all(PROVIDERS.map(async (provider) => {
    const start = Date.now();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(provider.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + provider.key,
          'HTTP-Referer': 'https://tenderstore-chatbot-demo.vercel.app',
        },
        body: JSON.stringify({
          model: provider.model,
          messages: [{ role: 'user', content: 'Say OK' }],
          max_tokens: 5,
          temperature: 0
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const latency = Date.now() - start;

      if (!response.ok) {
        return {
          name: provider.name,
          model: provider.model,
          source: provider.source,
          status: 'DOWN',
          httpCode: response.status,
          latencyMs: latency,
          error: 'HTTP ' + response.status
        };
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || '';

      return {
        name: provider.name,
        model: provider.model,
        source: provider.source,
        status: 'UP',
        httpCode: 200,
        latencyMs: latency,
        reply: reply.substring(0, 50)
      };
    } catch (e) {
      return {
        name: provider.name,
        model: provider.model,
        source: provider.source,
        status: 'DOWN',
        latencyMs: Date.now() - start,
        error: e.name === 'AbortError' ? 'timeout 8s' : e.message
      };
    }
  }));

  const alive = results.filter(r => r.status === 'UP').length;
  const dead = results.filter(r => r.status === 'DOWN').length;

  res.status(200).json({
    timestamp: new Date().toISOString(),
    summary: alive + '/' + results.length + ' providers UP',
    healthy: dead === 0,
    providers: results
  });
};
