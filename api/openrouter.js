// OpenRouter ofrece modelos 100% gratis (sufijo :free), sin tarjeta de crédito.
// "openrouter/free" es un router que elige automáticamente entre los modelos
// gratuitos disponibles — así nunca se rompe si un modelo específico deja de
// ser gratis (esto cambia con frecuencia en OpenRouter).

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

  const selectedModel = ALLOWED_MODELS.includes(model) ? model : 'openrouter/free';

  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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
