/* ==========================================================================
   DATOS SEO de dcodepartners.com · los aplica scripts/seo/seo.mjs
   --------------------------------------------------------------------------
   Aquí se decide, página a página, lo que Google lee: título, descripción,
   h1, nombre en la ruta de navegación y tipo de datos estructurados.
   Regla: nada inventado. Precios, canales y garantías son los que ya dice la
   web (precios.html). Sin reseñas, sin valoraciones, sin premios, sin dirección
   postal ni teléfono (no los publicamos: por eso no hay LocalBusiness).
   Las claves son rutas en español; "en" es su versión bajo /en.
   ========================================================================== */

export const SITIO = "https://dcodepartners.com";

export const EMPRESA = {
  nombre: "D-Code Partners",
  alias: "D-Code",
  // 512×512: Google pide un logo de al menos 112×112 (el anterior medía 120×101).
  logo: "/assets/web-app-manifest-512x512.png",
  email: "dcodedepartment@gmail.com",
  redes: ["https://www.instagram.com/d_codepartners/", "https://www.facebook.com/profile.php?id=61593223960437"],
  localidad: "Madrid",
  pais: "ES",
  fundadores: [
    { nombre: "Diego Siñeriz", enlace: "https://www.linkedin.com/in/diego-si%C3%B1eriz-b45319427/" },
    { nombre: "Dimitry Sosenko" },
  ],
  descripcion: {
    es: "Construimos el sistema que conecta tu empresa: automatización de procesos, agentes de IA, integraciones entre herramientas, software a medida y páginas web. Trabajamos desde Madrid para empresas de toda España.",
    en: "We build the system that connects your company: process automation, AI agents, integrations between tools, custom software and websites. Based in Madrid, working with companies across Spain.",
  },
  sabeDe: {
    es: ["Automatización de procesos empresariales", "Inteligencia artificial para empresas", "Agentes de IA", "Integración de herramientas empresariales", "Software a medida", "Páginas web conectadas con sistemas"],
    en: ["Business process automation", "Artificial intelligence for companies", "AI agents", "Business tool integration", "Custom software", "Websites connected to business systems"],
  },
  altImagen: {
    es: "D-Code Partners: automatización e inteligencia artificial para empresas",
    en: "D-Code Partners: automation and artificial intelligence for companies",
  },
};

/* tipo: datos estructurados propios de la página (además de WebPage + BreadcrumbList)
   nombre: cómo se llama en la ruta de navegación y, en los servicios, el nombre del servicio */
export const PAGINAS = {
  "/": {
    tipo: "inicio",
    es: { nombre: "Inicio", title: "Automatización e IA para empresas | D-Code Partners" },
    en: { nombre: "Home", title: "Automation and AI for companies | D-Code Partners" },
  },
  "/que-hacemos": {
    tipo: "servicios",
    es: { nombre: "Qué hacemos", title: "Automatización, IA, integraciones y software a medida | D-Code" },
    en: { nombre: "What we do", title: "Automation, AI, integrations and custom software | D-Code" },
  },

  // —— Servicios
  "/servicios/automatizaciones": {
    tipo: "servicio", precio: "#g-automatiza",
    es: {
      nombre: "Automatizaciones", servicio: "Automatización de procesos",
      h1: "Automatizamos los procesos que tu empresa repite cada semana.",
      description: "Automatizamos los procesos y tareas que tu empresa repite cada semana: se ejecutan solos, con control de errores y aviso si algo falla. Desde 390 €.",
    },
    en: {
      nombre: "Automations", servicio: "Process automation",
      h1: "We automate the processes your company repeats every week.",
      description: "We automate the processes and tasks your company repeats every week: they run on their own, with error handling and an alert when something fails. From €390.",
    },
  },
  "/servicios/agentes-de-ia": {
    tipo: "servicio",
    es: {
      nombre: "Chatbots y agentes de IA", servicio: "Agentes de IA y chatbots para empresas",
      title: "Agentes de IA para empresas, con los datos de tu negocio | D-Code",
      description: "Agentes de IA para empresas: atienden por web, WhatsApp o teléfono, responden con los datos de tu negocio y pasan la conversación a una persona cuando hace falta.",
    },
    en: {
      nombre: "Chatbots and AI agents", servicio: "AI agents and chatbots for companies",
      title: "AI agents for companies, on your business data | D-Code",
      h1: "Our AI agents answer from your data, not from what they make up.",
      description: "AI agents for companies: they answer on the web, WhatsApp or phone, reply from your business data and hand the conversation to a person when needed.",
    },
  },
  "/servicios/integraciones": {
    tipo: "servicio",
    es: {
      nombre: "Integraciones", servicio: "Integración de herramientas empresariales",
      title: "Integración de herramientas: CRM, ERP, correo y web | D-Code",
      h1: "Integramos tus herramientas para que cada dato se escriba una vez.",
      description: "Integramos tu CRM, tu ERP, tu web y tus hojas de cálculo para que compartan los datos, con permisos mínimos, reintentos si algo falla y registro de lo que pasó.",
    },
    en: {
      nombre: "Integrations", servicio: "Business tool integration",
      title: "Tool integrations: CRM, ERP, email and website | D-Code",
      h1: "We integrate your tools so data is entered only once.",
      description: "We integrate your CRM, ERP, website and spreadsheets so they share data, with minimum permissions, retries when something fails and a log of what happened.",
    },
  },
  "/servicios/paginas-web": {
    tipo: "servicio",
    es: {
      nombre: "Páginas web", servicio: "Páginas web conectadas con tus sistemas",
      h1: "Hacemos páginas web que trabajan con tus sistemas, no folletos.",
      description: "Hacemos tu web nueva, rehacemos la que tienes o conectamos la que ya funciona: el formulario entra en tu CRM, la cita cae en la agenda y todo queda a tu nombre.",
    },
    en: {
      nombre: "Websites", servicio: "Websites connected to your systems",
      h1: "We build websites that talk to your systems, not brochures.",
      description: "We build your new site, rebuild the one you have or connect the one that works: the form lands in your CRM, the booking in your calendar, and it is all yours.",
    },
  },
  "/servicios/sistemas-a-medida": {
    tipo: "servicio",
    es: {
      nombre: "Sistemas a medida", servicio: "Software y sistemas a medida",
      h1: "Construimos el software a medida que no se vende hecho.",
      description: "Miramos cómo trabaja tu empresa de verdad y construimos el software a medida que hace ese trabajo, por partes y con alcance y precio cerrados por escrito.",
    },
    en: {
      nombre: "Custom systems", servicio: "Custom software and systems",
      h1: "We build the custom software you cannot buy ready-made.",
      description: "We look at how your company really works and build the custom software that does that work, in stages, with scope and price agreed in writing.",
    },
  },

  // —— Por área
  "/departamentos/administracion": {
    tipo: "servicio",
    es: { nombre: "Administración", servicio: "Automatización administrativa", title: "Automatización administrativa: documentos y plazos | D-Code", h1: "Automatizamos la administración para tener tu empresa en orden." },
    en: { nombre: "Administration", servicio: "Administrative automation", title: "Admin automation: documents, deadlines and alerts | D-Code", h1: "We automate administration to keep your company in order." },
  },
  "/departamentos/clientes": {
    tipo: "servicio",
    es: { nombre: "Clientes", servicio: "Automatización del seguimiento de clientes", title: "Atención al cliente automatizada con IA | D-Code Partners", h1: "Automatizamos el seguimiento de clientes, del alta a la renovación." },
    en: { nombre: "Clients", servicio: "Client follow-up automation", h1: "We automate client follow-up, from onboarding to renewal." },
  },
  "/departamentos/comercial": {
    tipo: "servicio",
    es: { nombre: "Comercial", servicio: "Automatización de ventas y CRM", title: "Automatización de ventas y CRM para empresas | D-Code Partners", h1: "Automatizamos el seguimiento de ventas para no perder ninguna." },
    en: { nombre: "Sales", servicio: "Sales automation and CRM", title: "Sales automation and automated CRM for companies | D-Code", h1: "We automate your sales so none is lost to poor follow-up." },
  },
  "/departamentos/direccion": {
    tipo: "servicio",
    es: { nombre: "Dirección", servicio: "Panel de dirección con datos reales", title: "Panel de dirección con los datos reales de tu empresa | D-Code", h1: "Tu panel de dirección te da cada mañana una decisión clara." },
    en: { nombre: "Management", servicio: "Management dashboard on real data", h1: "Your management dashboard gives you one clear decision a day." },
  },
  "/departamentos/finanzas": {
    tipo: "servicio",
    es: { nombre: "Finanzas", servicio: "Automatización de facturación y cobros", h1: "Automatizamos la facturación y los cobros para que cobres antes." },
    en: { nombre: "Finance", servicio: "Invoicing and collections automation", h1: "We automate invoicing and collections so you get paid sooner." },
  },
  "/departamentos/marketing": {
    tipo: "servicio",
    es: { nombre: "Marketing", servicio: "Captación automatizada de clientes potenciales", h1: "Automatizamos la captación para que tu web traiga oportunidades." },
    en: { nombre: "Marketing", servicio: "Automated lead capture", h1: "We automate lead capture so your website keeps bringing business." },
  },
  "/departamentos/produccion": {
    tipo: "servicio",
    es: { nombre: "Operaciones", servicio: "Automatización de operaciones", h1: "Automatizamos tus operaciones para que cada trabajo cumpla su plazo." },
    en: { nombre: "Operations", servicio: "Operations automation", h1: "We automate your operations so every job meets its deadline." },
  },
  "/departamentos/soporte": {
    tipo: "servicio",
    es: { nombre: "Soporte", servicio: "Soporte automatizado con IA", h1: "Automatizamos el soporte para responder también fuera de horario." },
    en: { nombre: "Support", servicio: "Automated AI support", h1: "We automate support to reply fast, even after hours." },
  },

  // —— Producto
  "/sistema-financiero": {
    tipo: "software",
    es: { nombre: "D-Code Finance", h1: "D-Code Finance es el programa de facturación al que puedes preguntarle." },
    en: { nombre: "D-Code Finance", h1: "D-Code Finance is the invoicing software you can ask questions." },
  },

  // —— Empresa
  "/precios": {
    es: { nombre: "Precios", h1: "Estos son nuestros precios y lo que incluye cada uno." },
    en: { nombre: "Pricing", h1: "These are our prices and what each one includes." },
  },
  "/faq": {
    es: { nombre: "Preguntas frecuentes", title: "Preguntas frecuentes sobre automatización e IA | D-Code Partners", h1: "Estas son las preguntas más frecuentes antes de empezar." },
    en: { nombre: "FAQ", title: "FAQ on automation and AI for companies | D-Code Partners", h1: "These are the most frequent questions before getting started." },
  },
  "/diagnostico": {
    es: { nombre: "Diagnóstico gratuito", description: "Tres preguntas y una estimación con tus horas y tu coste por hora: cuánto trabajo repetitivo podría hacer un sistema en tu empresa. Sin datos personales." },
    en: { nombre: "Free assessment" },
  },
  "/contacto": { tipo: "contacto", es: { nombre: "Contacto" }, en: { nombre: "Contact" } },
  "/conocenos": { tipo: "quienes", es: { nombre: "Conócenos" }, en: { nombre: "About us" } },
  "/metodo": { es: { nombre: "Método" }, en: { nombre: "Method" } },
  "/garantias": { es: { nombre: "Garantías y proceso" }, en: { nombre: "Guarantees and process" } },
  "/casos-exito": { es: { nombre: "Casos internos" }, en: { nombre: "In-house cases" } },
  "/cambios-en-proceso": { es: { nombre: "Cambios en proceso" }, en: { nombre: "Changes in progress" } },

  // —— Blog
  "/blog": {
    tipo: "blog",
    es: { nombre: "Blog", title: "Blog de automatización e IA para empresas | D-Code Partners" },
    en: { nombre: "Blog", title: "Automation and AI blog for businesses | D-Code Partners" },
  },
  "/blog/que-es-la-automatizacion-con-ia": { tipo: "articulo", publicado: "2026-06-10", es: { seccion: "Fundamentos" }, en: { seccion: "Fundamentals" } },
  "/blog/automatizacion-vs-agentes-ia": { tipo: "articulo", publicado: "2026-06-24", es: { seccion: "Estrategia" }, en: { seccion: "Strategy" } },
  "/blog/procesos-que-puedes-automatizar-ya": { tipo: "articulo", publicado: "2026-07-08", es: { seccion: "Práctico" }, en: { seccion: "Practical" } },
  "/blog/automatizacion-para-pymes": { tipo: "articulo", publicado: "2026-10-02", es: { seccion: "Práctico" }, en: { seccion: "Practical" } },

  // —— Legal (el nombre sale del h1)
  "/aviso-legal": {}, "/privacidad": {}, "/cookies": {}, "/seguridad": {}, "/condiciones-contratacion": {}, "/acuerdo-encargado-tratamiento": {},
};

/* Bloque «cuándo tiene sentido» de cada servicio: primero el problema, con las
   palabras de quien lo sufre, y después cómo se resuelve. Enlaza con el blog,
   los precios y el diagnóstico (enlazado interno contextual). */
const a = (href, t) => `<a href="${href}">${t}</a>`;
export const CUANDO = {
  "/servicios/automatizaciones": {
    es: {
      etiqueta: "Cuándo tiene sentido", h2: "Así sabes si tu empresa necesita automatizar procesos.",
      puntos: [
        ["Alguien copia los mismos datos de un programa a otro", "Si una persona pasa pedidos, facturas o contactos de una herramienta a otra, esa tarea puede hacerse sola y sin errores al teclear."],
        ["Hay tareas que solo salen si alguien se acuerda", "Los recordatorios de cobro, los seguimientos y los informes semanales que dependen de la memoria de una persona son los primeros candidatos."],
        ["El trabajo se para cuando falta una persona", "Si un proceso solo sabe hacerlo una persona, automatizarlo y dejarlo documentado evita que la empresa dependa de ella."],
      ],
      cierre: `No hace falta un gran proyecto para empezar: se empieza por una tarea concreta. Si quieres ejemplos, lee ${a("/blog/procesos-que-puedes-automatizar-ya", "cinco procesos que probablemente ya podrías automatizar")} o nuestra guía de ${a("/blog/automatizacion-para-pymes", "automatización para pymes")}, y calcula con el ${a("/diagnostico", "diagnóstico gratuito")} cuántas horas se van en trabajo repetitivo.`,
    },
    en: {
      etiqueta: "When it makes sense", h2: "This is how you know your company needs process automation.",
      puntos: [
        ["Someone copies the same data from one program to another", "If a person moves orders, invoices or contacts from one tool to another, that task can run on its own, with no typing errors."],
        ["Some tasks only happen if someone remembers", "Payment reminders, follow-ups and weekly reports that depend on one person's memory are the first candidates."],
        ["Work stops when one person is away", "If only one person knows how to run a process, automating and documenting it means the company no longer depends on them."],
      ],
      cierre: `You do not need a big project to begin: you start with one specific task. For examples, read ${a("/en/blog/procesos-que-puedes-automatizar-ya", "five processes you could probably automate right now")} or our guide to ${a("/en/blog/automatizacion-para-pymes", "automation for small businesses")}, and use the ${a("/en/diagnostico", "free assessment")} to estimate how many hours go into repetitive work.`,
    },
  },
  "/servicios/agentes-de-ia": {
    es: {
      etiqueta: "Cuándo tiene sentido", h2: "Así sabes si a tu empresa le conviene un agente de IA.",
      puntos: [
        ["Tu equipo responde siempre las mismas preguntas", "Horarios, precios, disponibilidad o el estado de un pedido. Un agente las contesta al momento y deja a tu equipo las consultas que necesitan criterio."],
        ["Se te escapan contactos fuera de horario", "Quien escribe por la noche o en fin de semana no siempre espera al lunes. El agente responde, recoge los datos y deja el contacto preparado para una persona."],
        ["No quieres un chatbot que se invente las respuestas", "Un agente de IA es un programa que conversa usando solo la información de tu negocio. Si la respuesta no está en tus datos, lo dice y pasa la conversación a una persona."],
      ],
      cierre: `Si dudas entre automatizar un proceso o poner un agente, lo explicamos en ${a("/blog/automatizacion-vs-agentes-ia", "automatización frente a agentes de IA")}. Los ${a("/precios#g-agentes", "precios de los agentes")} están publicados.`,
    },
    en: {
      etiqueta: "When it makes sense", h2: "This is how you know an AI agent suits your company.",
      puntos: [
        ["Your team keeps answering the same questions", "Opening hours, prices, availability or the status of an order. An agent answers them at once and leaves your team the queries that need judgment."],
        ["You lose contacts outside office hours", "Someone who writes at night or at the weekend will not always wait until Monday. The agent replies, collects the details and leaves the contact ready for a person."],
        ["You do not want a chatbot that makes things up", "An AI agent is a program that converses using only your business information. If the answer is not in your data, it says so and hands the conversation to a person."],
      ],
      cierre: `If you are unsure whether to automate a process or deploy an agent, we explain it in ${a("/en/blog/automatizacion-vs-agentes-ia", "automation vs. AI agents")}. The ${a("/en/precios#g-agentes", "prices for agents")} are published.`,
    },
  },
  "/servicios/integraciones": {
    es: {
      etiqueta: "Cuándo tiene sentido", h2: "Así sabes si necesitas integrar tus herramientas.",
      puntos: [
        ["El mismo dato se teclea dos o tres veces", "Un cliente se da de alta en el programa de ventas, luego en el de facturación y luego en una hoja de cálculo. Cada copia a mano es una ocasión de equivocarse."],
        ["Nadie sabe qué versión es la buena", "Cuando dos programas dicen cosas distintas del mismo cliente, el equipo pierde tiempo comprobando en lugar de trabajar."],
        ["No quieres cambiar de programas", "Integrar es conectar lo que ya usas —el CRM donde llevas a tus clientes, el ERP con el que gestionas la empresa, el correo, la web— para que se pasen los datos entre sí. No hay que sustituir nada."],
      ],
      cierre: `Las integraciones suelen ir junto a una ${a("/servicios/automatizaciones", "automatización de procesos")}: una mueve el dato y la otra hace algo con él. Lo contamos con ejemplos en ${a("/blog/automatizacion-para-pymes", "automatización para pymes")}.`,
    },
    en: {
      etiqueta: "When it makes sense", h2: "This is how you know you need to integrate your tools.",
      puntos: [
        ["The same data is typed two or three times", "A client is entered in the sales program, then in invoicing, then in a spreadsheet. Every manual copy is a chance to get it wrong."],
        ["Nobody knows which version is right", "When two programs say different things about the same client, the team spends time checking instead of working."],
        ["You do not want to change programs", "Integrating means connecting what you already use — the CRM where you track clients, the ERP you run the company on, email, the website — so they pass data to each other. Nothing has to be replaced."],
      ],
      cierre: `Integrations usually go together with ${a("/en/servicios/automatizaciones", "process automation")}: one moves the data and the other does something with it. We explain it with examples in ${a("/en/blog/automatizacion-para-pymes", "automation for small businesses")}.`,
    },
  },
  "/servicios/sistemas-a-medida": {
    es: {
      etiqueta: "Cuándo tiene sentido", h2: "Así sabes si te compensa un software a medida.",
      puntos: [
        ["Llevas la empresa con hojas de cálculo que ya no dan más de sí", "Funcionaron al principio, pero ahora hay versiones duplicadas, fórmulas que solo entiende una persona y datos que no cuadran."],
        ["Ningún programa encaja con tu forma de trabajar", "Has probado varios y siempre acabas adaptando la empresa al programa. Un sistema a medida hace lo contrario."],
        ["Tienes varios programas y ninguno ve el trabajo completo", "Cada uno resuelve su parte, pero nadie sigue un pedido desde que entra hasta que se cobra. Un sistema propio es el sitio por donde pasa todo."],
      ],
      cierre: `Antes de construir fijamos el alcance y el precio por escrito: puedes leer ${a("/metodo", "cómo trabajamos")} y ${a("/garantias", "qué garantizamos")}. Si solo necesitas conectar lo que ya tienes, quizá te baste con una ${a("/servicios/integraciones", "integración")}.`,
    },
    en: {
      etiqueta: "When it makes sense", h2: "This is how you know custom software is worth it.",
      puntos: [
        ["You run the company on spreadsheets that have reached their limit", "They worked at first, but now there are duplicate versions, formulas only one person understands and figures that do not add up."],
        ["No program fits the way you work", "You have tried several and always end up adapting the company to the program. A custom system does the opposite."],
        ["You have several programs and none sees the whole job", "Each one solves its part, but nobody follows an order from the moment it arrives until it is paid. Your own system is the place everything goes through."],
      ],
      cierre: `Before building, we set scope and price in writing: you can read ${a("/en/metodo", "how we work")} and ${a("/en/garantias", "what we guarantee")}. If you only need to connect what you already have, an ${a("/en/servicios/integraciones", "integration")} may be enough.`,
    },
  },
  "/servicios/paginas-web": {
    es: {
      etiqueta: "Cuándo tiene sentido", h2: "Así sabes si tu empresa necesita una web conectada.",
      puntos: [
        ["Los contactos de la web llegan a un correo que nadie mira a tiempo", "En una web conectada, cada formulario entra en tu sistema ya clasificado y avisa a quien tiene que atenderlo."],
        ["Las citas se piden por teléfono o por mensaje", "Si el cliente reserva desde la web y la cita cae directamente en tu agenda, nadie tiene que apuntarla después."],
        ["Tu web dice una cosa y tu negocio otra", "Cuando la web lee de tus sistemas, lo que enseña —el stock, por ejemplo— es lo que hay de verdad."],
      ],
      cierre: `Si quieres que la web además responda a quien entra, podemos añadirle un ${a("/servicios/agentes-de-ia", "agente de IA")}. Los ${a("/precios#g-webs", "precios de las páginas web")} están publicados.`,
    },
    en: {
      etiqueta: "When it makes sense", h2: "This is how you know your company needs a connected website.",
      puntos: [
        ["Website enquiries land in an inbox nobody checks in time", "On a connected site, every form enters your system already sorted and alerts the person who has to deal with it."],
        ["Appointments are booked by phone or message", "If the client books on the site and the appointment drops straight into your calendar, nobody has to write it down afterwards."],
        ["Your website says one thing and your business another", "When the site reads from your systems, what it shows — stock, for example — is what is really there."],
      ],
      cierre: `If you also want the site to answer visitors, we can add an ${a("/en/servicios/agentes-de-ia", "AI agent")}. The ${a("/en/precios#g-webs", "prices for websites")} are published.`,
    },
  },
};

/* Enlaces dentro del texto de los artículos: [texto actual, texto con enlace].
   Se aplica una sola vez (si el segundo ya está, no se toca). */
export const ENLACES = {
  "blog/que-es-la-automatizacion-con-ia.html": [
    ["Por eso cualquier proyecto serio empieza por un diagnóstico, no por instalar herramientas.</p>", `Por eso cualquier proyecto serio empieza por un diagnóstico, no por instalar herramientas. Puedes hacerte una primera idea con nuestro ${a("/diagnostico", "diagnóstico gratuito")}, que te da una estimación con tres preguntas, o ver cómo planteamos la ${a("/servicios/automatizaciones", "automatización de procesos")}.</p>`],
  ],
  "blog/automatizacion-vs-agentes-ia.html": [
    ["probablemente necesitas un <strong>agente de IA</strong>.", `probablemente necesitas un ${a("/servicios/agentes-de-ia", "<strong>agente de IA</strong>")}.`],
    ["probablemente necesitas <strong>automatización de procesos</strong>.", `probablemente necesitas ${a("/servicios/automatizaciones", "<strong>automatización de procesos</strong>")}.`],
    ["compartan datos entre sí a través de integraciones.", `compartan datos entre sí a través de ${a("/servicios/integraciones", "integraciones")}.`],
  ],
  "blog/procesos-que-puedes-automatizar-ya.html": [
    ["con un agente que las resuelva al instante", `con un ${a("/servicios/agentes-de-ia", "agente de IA")} que las resuelva al instante`],
    ["Los recordatorios y seguimientos comerciales son", `Los recordatorios y ${a("/departamentos/comercial", "seguimientos comerciales")} son`],
    ["porque \"siempre se han hecho así\".</p>", `porque "siempre se han hecho así". Nuestro ${a("/diagnostico", "diagnóstico gratuito")} te da una primera estimación en tres preguntas.</p>`],
  ],
  "en/blog/que-es-la-automatizacion-con-ia.html": [
    ["That's why any serious project starts with a diagnosis, not with installing tools.</p>", `That's why any serious project starts with a diagnosis, not with installing tools. You can get a first idea with our ${a("/en/diagnostico", "free assessment")}, which gives you an estimate from three questions, or see how we approach ${a("/en/servicios/automatizaciones", "process automation")}.</p>`],
  ],
  "en/blog/automatizacion-vs-agentes-ia.html": [
    ["you probably need an <strong>AI agent</strong>.", `you probably need an ${a("/en/servicios/agentes-de-ia", "<strong>AI agent</strong>")}.`],
    ["you probably need <strong>process automation</strong>.", `you probably need ${a("/en/servicios/automatizaciones", "<strong>process automation</strong>")}.`],
    ["share data with each other through integrations.", `share data with each other through ${a("/en/servicios/integraciones", "integrations")}.`],
  ],
  "en/blog/procesos-que-puedes-automatizar-ya.html": [
    ["with an agent that resolves them instantly", `with an ${a("/en/servicios/agentes-de-ia", "AI agent")} that resolves them instantly`],
    ["Sales reminders and follow-ups are", `Sales reminders and ${a("/en/departamentos/comercial", "follow-ups")} are`],
    ["they're just \"how it's always been done.\"</p>", `they're just "how it's always been done." Our ${a("/en/diagnostico", "free assessment")} gives you a first estimate from three questions.</p>`],
  ],
};

/* Enlace al diagnóstico gratuito en el pie de todas las páginas (antes solo lo enlazaban 3). */
export const PIE = {
  es: { antes: '<li><a href="/contacto">Contacto</a></li>', nuevo: '<li><a href="/diagnostico">Diagnóstico gratuito</a></li>' },
  en: { antes: '<li><a href="/en/contacto">Contact</a></li>', nuevo: '<li><a href="/en/diagnostico">Free assessment</a></li>' },
};
