const ALLOWED_MODELS = [
  'openrouter/free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'deepseek/deepseek-r1:free'
];

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  const { messages, system, model } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Falta el campo "messages" (array) en el body.' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'OPENROUTER_API_KEY no está configurada en el servidor. Añádela en Vercel > Settings > Environment Variables.'
    });
  }

  const selectedModel = ALLOWED_MODELS.includes(model) ? model : 'openrouter/free';
  const finalMessages = system ? [{ role: 'system', content: system }, ...messages] : messages;

  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://omhnibus.vercel.app',
        'X-Title': 'ÓMHNIBUS'
      },
      body: JSON.stringify({ model: selectedModel, messages: finalMessages })
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
