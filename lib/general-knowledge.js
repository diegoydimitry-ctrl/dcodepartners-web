/**
 * Glosario técnico general: automatización, IA y las herramientas que un
 * cliente potencial pregunta a menudo (ChatGPT, n8n, RAG, CRM...). No es
 * contenido de D-Code Partners — son hechos generales, verificados y
 * redactados a mano (no extraídos de la web), para que el asistente pueda
 * responder como un asesor que conoce el sector, no solo un buscador sobre
 * el propio sitio. Nunca afirma que D-Code usa o integra una herramienta
 * concreta a menos que la propia web lo diga — eso vendría de
 * knowledge-base.json, no de aquí.
 *
 * Cada entrada se indexa igual que un fragmento de página, con pageUrl:
 * null (no hay una URL real que citar) y una lista de sinónimos para que
 * el usuario pueda preguntar "qué es make" o "para qué sirve zapier" y
 * encontrarlo.
 */
module.exports = [
  {
    heading: 'Automatización empresarial',
    aliases: ['automatizacion', 'automatizacion empresarial', 'que es automatizar'],
    text: 'Automatizar es dejar que un sistema haga, sin intervención humana, tareas repetitivas que hoy hace una persona a mano: mover datos entre programas, responder mensajes, generar documentos o avisar cuando pasa algo. El objetivo no es eliminar personas, sino liberar su tiempo para trabajo que sí necesita criterio humano.',
  },
  {
    heading: 'Inteligencia artificial',
    aliases: ['inteligencia artificial', 'que es la ia', 'ia'],
    text: 'La inteligencia artificial son sistemas capaces de realizar tareas que normalmente requieren razonamiento humano: entender lenguaje, tomar decisiones con datos, o generar contenido. En el mundo empresarial se usa sobre todo para automatizar procesos y para atender a clientes de forma conversacional.',
  },
  {
    heading: 'Agentes de IA',
    aliases: ['agente de ia', 'agentes ia', 'que es un agente'],
    text: 'Un agente de IA es un sistema que mantiene una conversación con una persona, entiende lo que necesita y actúa en consecuencia: responde, consulta datos o deriva a un humano cuando hace falta. Se diferencia de un chatbot tradicional en que no sigue un guion fijo, sino que entiende lenguaje natural y se adapta al contexto.',
  },
  {
    heading: 'ChatGPT',
    aliases: ['chatgpt', 'gpt'],
    text: 'ChatGPT es el asistente conversacional de OpenAI, basado en sus modelos GPT. Es de los más conocidos por el gran público para tareas de texto, programación e investigación.',
  },
  {
    heading: 'Claude',
    aliases: ['claude', 'claude ia'],
    text: 'Claude es el asistente de IA de Anthropic, conocido por su capacidad de razonamiento y por seguir instrucciones complejas con cuidado. Se usa tanto en su app como integrado en productos de terceros a través de su API.',
  },
  {
    heading: 'Gemini',
    aliases: ['gemini', 'google gemini'],
    text: 'Gemini es la familia de modelos de IA de Google, integrada en su buscador, Gmail, Workspace y Android. Compite directamente con ChatGPT y Claude en tareas de texto, imagen y razonamiento.',
  },
  {
    heading: 'Microsoft Copilot',
    aliases: ['copilot', 'microsoft copilot'],
    text: 'Copilot es el asistente de IA de Microsoft, integrado en Word, Excel, Outlook, Teams y Windows. Ayuda a redactar, resumir, analizar datos y automatizar tareas dentro del ecosistema Microsoft 365.',
  },
  {
    heading: 'n8n',
    aliases: ['n8n'],
    text: 'n8n es una herramienta de automatización de flujos de trabajo, de código abierto, que conecta aplicaciones entre sí sin necesidad de programar cada integración desde cero. Es habitual en empresas que quieren automatizar procesos con control total sobre dónde se alojan sus datos.',
  },
  {
    heading: 'Make',
    aliases: ['make', 'make.com', 'integromat'],
    text: 'Make (antes Integromat) es una plataforma visual para automatizar tareas entre aplicaciones: por ejemplo, que un formulario nuevo cree automáticamente un contacto en el CRM y avise por Slack. Es una de las herramientas de automatización sin código más usadas.',
  },
  {
    heading: 'Zapier',
    aliases: ['zapier'],
    text: 'Zapier es una plataforma que conecta miles de aplicaciones para automatizar tareas repetitivas sin programar, mediante reglas del tipo "cuando pase X, haz Y". Es una de las herramientas de automatización más extendidas por su sencillez.',
  },
  {
    heading: 'APIs',
    aliases: ['api', 'apis', 'que es una api'],
    text: 'Una API es la forma en que dos programas se comunican entre sí de forma automática, sin intervención humana. Es lo que permite, por ejemplo, que un sistema de automatización lea o escriba datos directamente en tu CRM.',
  },
  {
    heading: 'CRM',
    aliases: ['crm', 'que es un crm'],
    text: 'Un CRM es el sistema donde una empresa gestiona su relación con clientes: contactos, oportunidades de venta, historial de interacciones. HubSpot, Salesforce, Pipedrive u Odoo son ejemplos habituales.',
  },
  {
    heading: 'ERP',
    aliases: ['erp', 'que es un erp'],
    text: 'Un ERP es el sistema de gestión que centraliza los procesos internos de una empresa: facturación, inventario, contabilidad, recursos humanos. Suele ser el sistema "de verdad" al que conviene conectar cualquier automatización para que los datos no se dupliquen a mano.',
  },
  {
    heading: 'WhatsApp Business',
    aliases: ['whatsapp business', 'api de whatsapp'],
    text: 'WhatsApp Business (y su API) permite a una empresa responder, automatizar y gestionar conversaciones de clientes en WhatsApp de forma profesional, incluyendo respuestas automáticas y agentes de IA conectados al canal.',
  },
  {
    heading: 'Automatización de ventas',
    aliases: ['automatizacion de ventas', 'automatizar ventas'],
    text: 'Automatizar ventas suele significar que los leads entran solos en el CRM, se cualifican automáticamente y el equipo comercial solo dedica tiempo a las oportunidades que de verdad merecen una llamada, en vez de perseguir manualmente cada contacto.',
  },
  {
    heading: 'Atención al cliente automatizada',
    aliases: ['atencion al cliente automatizada', 'automatizar atencion al cliente'],
    text: 'La atención al cliente automatizada usa agentes de IA para responder al instante en cualquier canal (web, WhatsApp, email), resolver las consultas repetitivas por sí solos y derivar a una persona solo cuando de verdad hace falta criterio humano.',
  },
  {
    heading: 'Pipeline de ventas',
    aliases: ['pipeline', 'pipeline de ventas', 'embudo de ventas'],
    text: 'Un pipeline (o embudo) de ventas son las etapas por las que pasa un cliente potencial desde el primer contacto hasta la venta cerrada. Automatizarlo suele significar que cada lead avanza de etapa solo, con recordatorios y acciones automáticas en el camino.',
  },
  {
    heading: 'Generación de leads',
    aliases: ['generacion de leads', 'leads'],
    text: 'Generar leads es captar contactos de clientes potenciales interesados en tu producto o servicio. La IA puede ayudar tanto a captarlos (agentes conversacionales que cualifican visitantes) como a gestionarlos (automatización que los registra y prioriza sin intervención manual).',
  },
  {
    heading: 'RAG (Retrieval-Augmented Generation)',
    aliases: ['rag', 'retrieval augmented generation'],
    text: 'RAG es una técnica que combina un modelo de IA con una base de conocimiento propia: antes de responder, el sistema busca la información relevante en tus documentos reales y la usa como contexto. Así la IA responde con datos verificados de tu empresa en lugar de inventar.',
  },
  {
    heading: 'MCP (Model Context Protocol)',
    aliases: ['mcp', 'model context protocol'],
    text: 'MCP es un estándar abierto que permite que un modelo de IA se conecte de forma segura a herramientas y datos externos (archivos, bases de datos, otras aplicaciones) de manera uniforme, en vez de necesitar una integración distinta para cada una.',
  },
  {
    heading: 'IA generativa',
    aliases: ['ia generativa', 'inteligencia artificial generativa'],
    text: 'La IA generativa es la que crea contenido nuevo (texto, imágenes, código, voz) a partir de lo que se le pide, en lugar de solo clasificar o predecir. ChatGPT, Claude y Gemini son ejemplos de IA generativa de texto.',
  },
  {
    heading: 'LLM (modelo de lenguaje)',
    aliases: ['llm', 'modelo de lenguaje', 'large language model'],
    text: 'Un LLM (large language model) es el tipo de modelo de IA entrenado con enormes cantidades de texto que entiende y genera lenguaje natural. Es la tecnología detrás de ChatGPT, Claude, Gemini y la mayoría de agentes conversacionales actuales.',
  },
  {
    heading: 'OpenAI',
    aliases: ['openai'],
    text: 'OpenAI es la empresa que desarrolla ChatGPT y los modelos GPT, uno de los principales proveedores de inteligencia artificial generativa a nivel mundial.',
  },
  {
    heading: 'Anthropic',
    aliases: ['anthropic'],
    text: 'Anthropic es la empresa que desarrolla los modelos Claude, con un enfoque particular en la seguridad y fiabilidad de la IA.',
  },
  {
    heading: 'Google AI',
    aliases: ['google ai', 'google deepmind'],
    text: 'Google AI (junto con Google DeepMind) desarrolla los modelos Gemini y la infraestructura de inteligencia artificial integrada en los productos de Google, desde el buscador hasta Workspace.',
  },
  {
    heading: 'AWS',
    aliases: ['aws', 'amazon web services'],
    text: 'AWS (Amazon Web Services) es la plataforma de servicios en la nube de Amazon: servidores, bases de datos, almacenamiento e infraestructura de IA sobre la que se construyen muchas aplicaciones y automatizaciones empresariales.',
  },
  {
    heading: 'Azure',
    aliases: ['azure', 'microsoft azure'],
    text: 'Azure es la plataforma de servicios en la nube de Microsoft, muy usada en empresas que ya trabajan con el ecosistema Microsoft (Office 365, Teams, Dynamics) para alojar aplicaciones, datos e integraciones de IA.',
  },
  {
    heading: 'Cloudflare',
    aliases: ['cloudflare'],
    text: 'Cloudflare es un proveedor de infraestructura web: protege sitios contra ataques, acelera su carga y ofrece servicios en la nube. Este mismo sitio usa Cloudflare para protegerse.',
  },
];
