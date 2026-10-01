/* Portada (ES / EN) · blanco y negro, muy pocas palabras.
   La escena «el sistema» (scripts/v2/escena/sistema.js) cuenta las capas de D-Code al bajar:
   personas → procesos → datos → herramientas → IA → automatizaciones → el sistema (el logotipo).
   Las cifras comerciales NO se escriben aquí: las rellena build:precios desde
   precios.json (data-precio). El resto del contenido sale de producción. */
import { FLECHA } from "../plantilla.mjs";
import { seccionDemos } from "./demos-portada.mjs";

const C = {
  es: {
    meta: {
      titulo: "D-Code Partners | Automatización e IA para empresas",
      descripcion: "Unimos las herramientas y áreas de tu empresa en un solo sistema: automatizaciones, agentes de IA, integraciones y software a medida sobre tus datos. Madrid.",
    },
    h1: "Conectamos tu empresa en un solo sistema.",
    sub: "Lo hacemos con automatización, inteligencia artificial y software a medida.",
    cta: "Reservar una llamada", cta2: "Ver las demos",
    pista: "Mueve el ratón y baja para ver cómo se monta.",
    // La narrativa de la escena: cada capa del sistema, una frase que se entiende sola.
    capas: [
      ["Personas", "Todo empieza por las personas.", "Cada equipo trabaja a su manera, con sus hojas de cálculo, sus correos y sus prisas."],
      ["Procesos", "Su trabajo sigue unos procesos.", "Los dibujamos tal como son en tu empresa, no como dice el manual."],
      ["Datos", "Cada proceso genera datos.", "Hoy están repartidos. Los reunimos para que cada dato se escriba una sola vez."],
      ["Herramientas", "Tus herramientas se conectan entre sí.", "Tu CRM, tu facturación y tu web se pasan los datos sin que nadie los copie."],
      ["IA", "La inteligencia artificial lee y propone.", "Las decisiones importantes las sigue tomando una persona."],
      ["Automatizaciones", "Lo que se repite pasa a hacerse solo.", "El sistema trabaja en segundo plano y te avisa cuando algo necesita tu atención."],
      ["Sistema", "El resultado es un solo sistema: el tuyo.", "Lo construimos sobre tus datos y con las herramientas que ya usas."],
    ],
    capasNav: "Capas del sistema",
    escenaAlt: "Cientos de piezas sueltas forman personas, procesos, datos, herramientas, inteligencia artificial y automatizaciones, y al final se unen en el logotipo de D-Code.",
    bajar: "Desliza",
    cambios: {
      h2: "Así cambia el trabajo en tu empresa.",
      cols: ["Hoy", "Lo que hacemos", "Después"],
      filas: [
        ["/servicios/automatizaciones", "Automatizaciones", "Alguien repite cada semana las mismas tareas: copiar datos, mandar avisos y preparar informes.", "Automatizamos esas tareas con control de errores y un aviso cuando algo falla.", "El trabajo repetitivo se hace solo y tu equipo dedica ese tiempo a otras cosas."],
        ["/servicios/agentes-de-ia", "Agentes de IA", "Las mismas preguntas llegan por la web, el correo o WhatsApp, también fuera de horario.", "Instalamos un agente que responde con los datos de tu negocio y pasa a una persona lo delicado.", "Cada cliente recibe respuesta en segundos y todo queda registrado."],
        ["/servicios/integraciones", "Integraciones", "Tu CRM, tu facturación y tu web no se hablan, así que alguien copia los datos de una a otra.", "Conectamos esas herramientas con los permisos justos y un registro de cada envío.", "Cada dato se escribe una vez y aparece donde tiene que aparecer."],
        ["/servicios/sistemas-a-medida", "Sistemas a medida", "Ninguna herramienta del mercado encaja con la forma de trabajar de tu empresa.", "Construimos el sistema que hace ese trabajo, siguiendo un pedido real de principio a fin.", "Tienes una herramienta hecha para tu forma de trabajar, y es tuya."],
        ["/servicios/paginas-web", "Páginas web", "Tu web es un folleto: los formularios llegan a un correo y ahí se quedan.", "Hacemos tu web, o conectamos la que tienes, con tu CRM, tu agenda y tus sistemas.", "Cada contacto entra clasificado y cada cita cae directamente en la agenda."],
      ],
    },
    productos: {
      h2: "Esto es lo que instalamos en tu empresa.",
      filas: [
        ["finance", "/sistema-financiero", "D-Code Finance", "Lleva facturas, cobros, gastos y registro fiscal en un solo sitio."],
        ["os", "/precios#g-os", "D-Code OS", "Es la capa que conecta tus sistemas entre sí."],
        ["medida", "/servicios/sistemas-a-medida", "Sistemas a medida", "El trabajo que tu equipo repite cada semana pasa a hacerse solo."],
        ["agentes", "/servicios/agentes-de-ia", "Agentes de IA e integraciones", "Responden con los datos de tu empresa y conectan las herramientas que ya usas."],
      ],
      todos: "Ver precios y packs",
    },
    tocalo: {
      h2: "No te lo contamos. Tócalo.",
      sub: "Cuatro sistemas funcionando, con datos inventados.",
      alt: "Panel de D-Code Finance con datos inventados: cobrado, pendiente de cobro y vencido",
      demos: [["finance", "D-Code Finance"], ["comercial", "Comercial"], ["operaciones", "Operaciones"], ["atencion", "Atención al cliente"], ["os", "D-Code OS"]],
      aviso: "Demostración · empresas ficticias · ningún sistema real conectado.",
      cerrar: "Cerrar la demo", pantalla: "Mejor en un ordenador.",
    },
    fin: { h2: "Hablemos de tu empresa.", sub: "En una llamada de treinta minutos te diremos qué se puede automatizar.", cta: "Reservar una llamada", mas: [["/metodo", "Cómo trabajamos"], ["/que-hacemos", "Todo lo que hacemos"], ["/garantias", "Garantías"]] },
  },
  en: {
    meta: {
      titulo: "D-Code Partners | Automation and AI for companies",
      descripcion: "We join your company's tools and teams into one system: automations, AI agents, integrations and custom software on your own data. Madrid.",
    },
    h1: "We connect your company in one system.",
    sub: "We do it with automation, artificial intelligence and custom software.",
    cta: "Book a call", cta2: "See the demos",
    pista: "Move the mouse and scroll to watch it come together.",
    capas: [
      ["People", "It all starts with people.", "Every team works its own way, with its spreadsheets, its emails and its deadlines."],
      ["Processes", "Their work follows processes.", "We map them as they really are in your company, not as the manual says."],
      ["Data", "Every process produces data.", "Today it is scattered. We bring it together so each piece of data is written only once."],
      ["Tools", "Your tools start talking to each other.", "Your CRM, your invoicing and your website pass data along without anyone copying it."],
      ["AI", "Artificial intelligence reads and suggests.", "The important decisions are still made by a person."],
      ["Automation", "What repeats starts running on its own.", "The system works in the background and tells you when something needs your attention."],
      ["System", "The result is one system: yours.", "We build it on your data and with the tools you already use."],
    ],
    capasNav: "Layers of the system",
    escenaAlt: "Hundreds of loose pieces form people, processes, data, tools, artificial intelligence and automation, and finally come together into the D-Code logo.",
    bajar: "Scroll",
    cambios: {
      h2: "This is how work changes in your company.",
      cols: ["Today", "What we do", "After"],
      filas: [
        ["/servicios/automatizaciones", "Automation", "Someone repeats the same tasks every week: copying data, sending reminders and preparing reports.", "We automate those tasks, with error handling and an alert when something fails.", "Repetitive work runs on its own and your team spends that time on other things."],
        ["/servicios/agentes-de-ia", "AI agents", "The same questions arrive through the website, email or WhatsApp, also out of hours.", "We install an agent that answers with your business data and hands sensitive cases to a person.", "Every customer gets an answer in seconds and everything is logged."],
        ["/servicios/integraciones", "Integrations", "Your CRM, your invoicing and your website don't talk, so someone copies data between them.", "We connect those tools with the minimum permissions and a log of every transfer.", "Each piece of data is written once and shows up where it should."],
        ["/servicios/sistemas-a-medida", "Custom systems", "No tool on the market fits the way your company works.", "We build the system that does that work, following a real order from start to finish.", "You get a tool made for the way you work, and it is yours."],
        ["/servicios/paginas-web", "Websites", "Your website is a brochure: forms land in an inbox and stay there.", "We build your website, or connect the one you have, to your CRM, your calendar and your systems.", "Every contact arrives classified and every appointment goes straight into the calendar."],
      ],
    },
    productos: {
      h2: "What we install.",
      filas: [
        ["finance", "/sistema-financiero", "D-Code Finance", "Invoices, collections, expenses and tax records, in one place."],
        ["os", "/precios#g-os", "D-Code OS", "The layer that connects your systems."],
        ["medida", "/servicios/sistemas-a-medida", "Custom systems", "What your team repeats every week, done on its own."],
        ["agentes", "/servicios/agentes-de-ia", "AI agents and integrations", "They answer with your data and connect what you already use."],
      ],
      todos: "Pricing and packs",
    },
    tocalo: {
      h2: "Don't take our word for it. Try it.",
      sub: "Four systems running, with invented data.",
      alt: "D-Code Finance dashboard with invented data: collected, pending and overdue",
      demos: [["finance", "D-Code Finance"], ["comercial", "Sales"], ["operaciones", "Operations"], ["atencion", "Customer service"], ["os", "D-Code OS"]],
      aviso: "Demo · fictional companies · no real system connected.",
      cerrar: "Close the demo", pantalla: "Better on a computer.",
    },
    fin: { h2: "Let's talk.", sub: "Thirty minutes and you'll know what can be automated in your company.", cta: "Book a call", mas: [["/metodo", "How we work"], ["/que-hacemos", "Everything we build"], ["/garantias", "Guarantees"]] },
  },
};

const precio = (k) => `<span class="precio-v" data-precio="${k}"></span><span class="precio-d" data-precio="${k}" data-precio-detalle></span>`;

export function inicio(lang) {
  const c = C[lang];
  const L = (r) => (lang === "en" ? (r === "/" ? "/en" : r.startsWith("#") ? r : "/en" + r) : r);
  const p = c.productos, t = c.tocalo, f = c.fin;
  return `
<section class="sistema" data-sistema aria-labelledby="h-inicio">
  <div class="sistema-fijo">
    <div class="sistema-luz" aria-hidden="true"></div>
    <canvas class="sistema-lienzo" data-sistema-lienzo role="img" aria-label="${c.escenaAlt}"></canvas>
    <picture><source srcset="/assets/v2/img/piezas/700/072.webp" media="(max-width: 760px)"><img class="sistema-poster" src="/assets/v2/img/piezas/1100/072.webp" alt="" width="1100" height="1100" loading="lazy" decoding="async"></picture>
    <div class="marco sistema-texto">
      <div class="capa capa--0 is-activa" data-capa="0">
        <h1 class="sistema-h1" id="h-inicio">${c.h1}</h1>
        <p class="lead">${c.sub}</p>
        <div class="acc"><a class="boton boton--principal" href="${L("/contacto")}">${c.cta} ${FLECHA}</a><a class="boton" href="#tocalo">${c.cta2}</a></div>
      </div>
      <ol class="capas" role="list">
        ${c.capas.map(([, h, d], i) => `<li class="capa" data-capa="${i + 1}"><h2 class="capa-t">${h}</h2><p class="lead">${d}</p>${i === c.capas.length - 1 ? `<div class="acc"><a class="boton boton--principal" href="${L("/contacto")}">${c.cta} ${FLECHA}</a><a class="boton" href="#tocalo">${c.cta2}</a></div>` : ""}</li>`).join("\n        ")}
      </ol>
      <p class="pista" aria-hidden="true"><i></i>${c.pista}</p>
    </div>
    <nav class="rail" aria-label="${c.capasNav}" data-rail>
      <ol role="list">${c.capas.map(([n], i) => `<li><button type="button" data-ir="${i + 1}"><span>${n}</span></button></li>`).join("")}</ol>
    </nav>
  </div>
</section>

<section class="bloque bloque--aire cambios" id="cambios" aria-labelledby="h-cambios">
  <div class="marco">
    <h2 class="h2 aparece" id="h-cambios">${c.cambios.h2}</h2>
    <div class="cambios-cab" aria-hidden="true"><span></span>${c.cambios.cols.map((t) => `<span class="rotulo">${t}</span>`).join("")}</div>
    <ul class="cambios-lista" role="list">
      ${c.cambios.filas.map(([r, n, a, b, d]) => `<li class="cambio"><a class="cambio-n" href="${L(r)}"><span class="cambio-marca" aria-hidden="true">${"<i></i>".repeat(9)}</span>${n} ${FLECHA}</a><p class="cambio-c"><span class="rotulo">${c.cambios.cols[0]}</span>${a}</p><p class="cambio-c"><span class="rotulo">${c.cambios.cols[1]}</span>${b}</p><p class="cambio-c cambio-c--fin"><span class="rotulo">${c.cambios.cols[2]}</span>${d}</p></li>`).join("\n      ")}
    </ul>
  </div>
</section>

<section class="bloque bloque--aire productos" id="productos" aria-labelledby="h-productos">
  <div class="marco">
    <h2 class="h2 aparece" id="h-productos">${p.h2}</h2>
    <ul class="lista" role="list">
      ${p.filas.map(([k, r, n, d], i) => `<li class="aparece" style="--i:${i}"><a class="fila" href="${L(r)}"><span class="fila-n">${n}</span><span class="fila-d">${d}</span><span class="fila-p">${precio(k)}</span><span class="fila-a" aria-hidden="true">${FLECHA}</span></a></li>`).join("\n      ")}
    </ul>
    <p class="nota peq aparece" data-precio-aviso></p>
    <p class="aparece"><a class="enlace" href="${L("/precios")}">${p.todos} ${FLECHA}</a></p>
  </div>
</section>

${seccionDemos(lang)}

<section class="bloque bloque--aire fin" id="hablemos" aria-labelledby="h-fin">
  <div class="marco">
    <h2 class="display aparece" id="h-fin">${f.h2}</h2>
    <p class="lead aparece" style="--i:1">${f.sub}</p>
    <div class="acc aparece" style="--i:2"><a class="boton boton--principal" href="${L("/contacto")}">${f.cta} ${FLECHA}</a></div>
    <ul class="fin-mas aparece" role="list" style="--i:3">${f.mas.map(([r, n]) => `<li><a class="enlace" href="${L(r)}">${n}</a></li>`).join("")}</ul>
  </div>
</section>`;
}

export const META = { es: C.es.meta, en: C.en.meta };
