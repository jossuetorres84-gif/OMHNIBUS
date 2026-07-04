module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método no permitido. Usa GET.' });
  }

  return res.status(200).json({
    name: 'ÓMHNIBUS',
    version: '1.2.0',
    lastUpdated: '2026-07-04',
    identity: 'ÓMHNIBUS es una capa de orquestación multi-agente: no es un solo modelo de lenguaje, sino un sistema que enruta cada instrucción hacia el motor de IA más adecuado (o varios a la vez en modo Council) y unifica el resultado bajo una sola identidad.',
    architecture: {
      frontend: 'HTML + Tailwind + JavaScript vanilla, sin frameworks. Corre en el navegador del usuario.',
      backend: 'Funciones serverless de Vercel (Node.js) en /api. Cada proveedor de IA tiene su propio endpoint: /api/gemini, /api/groq, /api/openrouter, /api/openai.',
      seguridad: 'Las API keys viven como variables de entorno en el servidor, nunca en el navegador ni en localStorage.',
      persistencia: 'El historial de chats y la memoria permanente del usuario se guardan en localStorage del navegador, no en una base de datos externa.'
    },
    engines: [
      { id: 'gemini', proveedor: 'Google', modelo: 'gemini-3.5-flash', rol: 'uso general, investigación y análisis extenso' },
      { id: 'groq', proveedor: 'Groq (varios modelos open-weight)', modelo: 'configurable (gpt-oss-120b, llama, qwen, etc.)', rol: 'velocidad, matemáticas, cálculo' },
      { id: 'openrouter', proveedor: 'OpenRouter (modelos gratuitos)', modelo: 'openrouter/free y variantes :free', rol: 'código y tareas técnicas' },
      { id: 'openai', proveedor: 'OpenAI', modelo: 'gpt-4o-mini', rol: 'disponible pero requiere billing activo del usuario' }
    ],
    modos: {
      auto: 'Router por palabras clave elige el motor según el tipo de instrucción.',
      manual: 'El usuario elige el motor directamente.',
      council: 'Varios motores responden en secuencia a la misma instrucción.'
    },
    fortalezas: [
      'Combina la velocidad de unos motores con la profundidad de otros según la tarea.',
      'No depende de un solo proveedor: si uno falla o se satura, los demás siguen funcionando.',
      'Memoria permanente configurable por el usuario, aplicada a todos los chats.',
      'Historial completo por chat: cada conversación mantiene su propio contexto.'
    ],
    limitaciones: [
      'El router automático usa reglas por palabras clave, no un clasificador de IA — puede equivocarse de motor en instrucciones ambiguas.',
      'No hay base de datos: si el usuario borra datos del navegador o cambia de dispositivo, se pierde el historial.',
      'En modo Council cada motor responde de forma independiente; solo ve el texto de los demás como contexto de lectura, no hay razonamiento compartido real.',
      'Depende de la disponibilidad y cuotas de cada proveedor externo (Gemini, Groq, OpenRouter, OpenAI).',
      'El backend no es visible desde el navegador por diseño (seguridad); este autodiagnóstico describe su comportamiento pero no expone código fuente del servidor.'
    ]
  });
};
