// OpenRouter da acceso a un solo endpoint con muchísimos modelos (GPT, Claude, Gemini,
// Llama, Qwen, DeepSeek, etc.) usando UNA sola key: OPENROUTER_API_KEY.
// Verifica los slugs exactos en https://openrouter.ai/models porque OpenRouter
// actualiza/retira modelos con frecuencia.

const ALLOWED_MODELS = [
  'openai/gpt-4o-mini',
  'anthropic/claude-3.5-sonnet',
  'google/gemini-2.0-flash-001',
  'meta-llama/llama-3.3-70b-instruct',
  'qwen/qwen-2.5-coder-32b-instruct',
  'deepseek/deepseek-chat'
];

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  const { prompt, model } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Falta el campo "prompt" en el body.' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'OPENROUTER_API_KEY no está configurada en el servidor. Añádela en Vercel > Settings > Environment Variables.'
    });
  }

  const selectedModel = ALLOWED_MODELS.includes(model) ? model : 'openai/gpt-4o-mini';

  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        // OpenRouter recomienda estos headers para atribución/rankings, no son obligatorios
        // pero evitan que te limiten. Cambia el valor por tu dominio real.
        'HTTP-Referer': 'https://omhnibus.vercel.app',
        'X-Title': 'ÓMHNIBUS'
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: (data && data.error && data.error.message) || 'Error desconocido de OpenRouter.'
      });
    }

    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(502).json({ error: 'OpenRouter respondió sin texto utilizable.', raw: data });
    }

    return res.status(200).json({ text, model: selectedModel });
  } catch (err) {
    return res.status(500).json({ error: 'Error de conexión con OpenRouter: ' + err.message });
  }
};
