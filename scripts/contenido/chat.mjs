/*
 * EL ASISTENTE SALUDA SEGÚN DÓNDE ESTÉS.
 *
 * Antes decía lo mismo en las 66 páginas: un saludo largo que enumeraba todo
 * lo que sabe hacer. Quien estaba mirando precios no necesita que le cuenten
 * qué es un agente de IA; necesita que le digan «puedo ayudarte a elegir».
 *
 * Las preguntas rápidas tienen que ser cosas que la web CONTESTE: el
 * asistente responde recuperando del contenido real del sitio, así que una
 * pregunta cuya respuesta no está escrita en ninguna página sale vacía.
 *
 * El orden importa: gana la primera ruta que encaje, así que lo específico
 * va antes que lo general.
 */

export const CONTEXTOS = [
  {
    ruta: /^\/precios$/,
    es: { hola: 'Estás en Precios. Puedo ayudarte a elegir qué te encaja y decirte qué incluye cada cosa.',
          rapidas: ['¿Qué plan de Finance me encaja?', '¿Qué incluye la implantación?', '¿Cómo se contrata hoy?'] },
    en: { hola: 'You are on Pricing. I can help you work out what fits and tell you what each thing includes.',
          rapidas: ['Which Finance plan fits me?', 'What does the setup include?', 'How do I buy it today?'] },
  },
  {
    ruta: /^\/que-hacemos$/,
    es: { hola: 'Aquí está todo lo que construimos. Dime a qué te dedicas y te digo por dónde empezaría yo.',
          rapidas: ['¿Qué hacéis exactamente?', 'Quiero una página web', 'Quiero automatizar algo que repetimos'] },
    en: { hola: 'This is everything we build. Tell me what you do and I will tell you where I would start.',
          rapidas: ['What exactly do you do?', 'I want a website', 'I want to automate something we repeat'] },
  },
  {
    ruta: /^\/sistema-financiero$/,
    es: { hola: 'Esto es D-Code Finance. Puedo contarte qué hace, qué no hace todavía y cuánto cuesta.',
          rapidas: ['¿Qué incluye Finance?', '¿Y lo de VERI*FACTU?', '¿Cuánto cuesta?'] },
    en: { hola: 'This is D-Code Finance. I can tell you what it does, what it does not do yet and what it costs.',
          rapidas: ['What does Finance include?', 'What about VERI*FACTU?', 'What does it cost?'] },
  },
  {
    ruta: /^\/contacto$/,
    es: { hola: 'Si prefieres no rellenar nada, cuéntamelo aquí y te digo qué haría falta.',
          rapidas: ['No sé por dónde empezar', '¿Cuánto costaría lo mío?', '¿Cuánto tardáis en implantarlo?'] },
    en: { hola: 'If you would rather not fill anything in, tell me here and I will tell you what you would need.',
          rapidas: ['I do not know where to start', 'What would mine cost?', 'How long does a rollout take?'] },
  },
  {
    ruta: /^\/cambios-en-proceso$/,
    es: { hola: 'Este tablero dice qué está listo y qué no. Pregúntame por cualquiera de los dos.',
          rapidas: ['¿Qué está funcionando ya?', '¿Qué falta por terminar?', '¿Cuándo estará la conciliación?'] },
    en: { hola: 'This board says what is ready and what is not. Ask me about either.',
          rapidas: ['What is already running?', 'What is still missing?', 'When will reconciliation be ready?'] },
  },
  {
    ruta: /^\/metodo$/,
    es: { hola: 'Este es cómo trabajamos. Si quieres, te lo resumo en tres frases.',
          rapidas: ['¿Cómo empieza un proyecto?', '¿Qué es el diagnóstico?', '¿Qué garantías dais?'] },
    en: { hola: 'This is how we work. If you like, I can sum it up in three sentences.',
          rapidas: ['How does a project start?', 'What is the diagnosis?', 'What guarantees do you give?'] },
  },
  {
    ruta: /^\/departamentos\//,
    es: { hola: 'Estás mirando un área concreta. Puedo contarte qué se construye aquí y qué cuesta.',
          rapidas: ['¿Qué se automatiza en esta área?', '¿Cuánto costaría?', '¿Cuánto se tarda?'] },
    en: { hola: 'You are looking at one area. I can tell you what gets built here and what it costs.',
          rapidas: ['What gets automated in this area?', 'What would it cost?', 'How long does it take?'] },
  },
  {
    ruta: /^\/servicios\//,
    es: { hola: 'Puedo contarte qué incluye esto, qué no y cuánto cuesta.',
          rapidas: ['¿Qué incluye exactamente?', '¿Cuánto cuesta?', '¿Con qué herramientas se conecta?'] },
    en: { hola: 'I can tell you what this includes, what it does not and what it costs.',
          rapidas: ['What exactly does it include?', 'What does it cost?', 'What tools does it connect to?'] },
  },
  {
    ruta: /^\/faq$/,
    es: { hola: 'Si tu duda no está en la lista, pregúntamela directamente.',
          rapidas: ['¿Cuánto cuesta empezar?', '¿Hay permanencia?', '¿De quién son los datos?'] },
    en: { hola: 'If your question is not on the list, just ask me.',
          rapidas: ['What does it cost to start?', 'Is there any lock-in?', 'Who owns the data?'] },
  },
  {
    ruta: /^\/blog/,
    es: { hola: 'Puedo resumirte cualquier artículo o llevarte a lo que estés buscando.',
          rapidas: ['Resúmeme esto', '¿Esto aplica a mi empresa?', '¿Qué haríais vosotros?'] },
    en: { hola: 'I can summarise any article or take you to what you are after.',
          rapidas: ['Summarise this for me', 'Does this apply to my company?', 'What would you do?'] },
  },
  {
    ruta: /^\/(privacidad|aviso-legal|cookies|seguridad|condiciones-contratacion|acuerdo-encargado-tratamiento)$/,
    es: { hola: 'Esto es la letra pequeña. Si prefieres, te lo explico en lenguaje normal.',
          rapidas: ['Explícamelo en corto', '¿Qué datos guardáis?', '¿Con quién se comparten?'] },
    en: { hola: 'This is the small print. If you prefer, I can explain it in plain language.',
          rapidas: ['Give me the short version', 'What data do you keep?', 'Who is it shared with?'] },
  },
  /* El último no lleva ruta: es el de la portada y el de todo lo demás. */
  {
    ruta: null,
    es: { hola: 'Hola. Dime a qué se dedica tu empresa y te digo qué construiríamos y cuánto costaría.',
          rapidas: ['¿Qué hacéis exactamente?', '¿Cuánto cuesta empezar?', 'Quiero ver una demo'] },
    en: { hola: 'Hello. Tell me what your company does and I will tell you what we would build and what it would cost.',
          rapidas: ['What exactly do you do?', 'What does it cost to start?', 'I want to see a demo'] },
  },
];

export const contextoDe = (ruta) =>
  CONTEXTOS.find((c) => c.ruta && c.ruta.test(ruta)) || CONTEXTOS[CONTEXTOS.length - 1];
