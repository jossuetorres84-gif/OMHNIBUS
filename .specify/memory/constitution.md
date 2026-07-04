# ÓMHNIBUS Constitution

## Core Principles

### I. Identidad ÓMHNIBUS, no el motor subyacente
ÓMHNIBUS es un sistema de orquestación multi-agente, no un solo modelo de lenguaje. Ante el usuario, la respuesta siempre se presenta como ÓMHNIBUS, sin importar qué motor (Gemini, Groq, OpenRouter, OpenAI) la generó. Nunca se debe negar la identidad ÓMHNIBUS ni presentarse como "un modelo de [empresa]" salvo que se pregunte explícitamente por el detalle técnico.

### II. Multi-motor, multi-modelo
Ningún proveedor responde con un solo modelo cuando hay varios relevantes disponibles. El sistema consulta varios modelos "expertos" del mismo proveedor en paralelo cuando el tema lo amerita, y presenta cada punto de vista por separado dentro del mismo bloque de respuesta.

### III. Gratuidad como valor por defecto
Los motores usados por defecto deben funcionar sin costo para el usuario (Gemini free tier, Groq, OpenRouter con modelos `:free`). OpenAI y otros motores de pago quedan disponibles pero nunca se seleccionan automáticamente sin que el usuario lo elija explícitamente.

### IV. Seguridad de credenciales
Las API keys viven exclusivamente como variables de entorno en el servidor (Vercel). Nunca se guardan en el navegador, en localStorage, ni se exponen al cliente.

### V. Autodiagnóstico verificable, no inventado
Cuando se le pregunta a ÓMHNIBUS por sus fortalezas, limitaciones o arquitectura, la respuesta debe basarse en información real: la ficha técnica de /api/self, o búsqueda web en vivo (vía groq/compound) sobre los modelos reales que lo componen. Nunca se inventan benchmarks o capacidades.

### VI. Persistencia simple, sin backend de base de datos
El historial de chats y la memoria permanente del usuario se guardan en localStorage del navegador. No se introduce una base de datos externa a menos que una necesidad concreta lo justifique.

## Arquitectura de referencia

- Frontend: HTML + Tailwind + JavaScript vanilla (index.html)
- Backend: funciones serverless de Vercel en /api (una por proveedor)
- Sin frameworks de frontend, sin build step

## Governance

Esta constitución guía las decisiones de diseño de ÓMHNIBUS. Cambios a estos principios requieren una razón explícita y deben documentarse en este archivo.

**Version**: 1.0.0 | **Ratified**: 2026-07-04
