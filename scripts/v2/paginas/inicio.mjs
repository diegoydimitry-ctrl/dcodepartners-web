/* Portada (ES / EN) · blanco y negro, muy pocas palabras.
   Las cifras comerciales NO se escriben aquí: las rellena build:precios desde
   precios.json (data-precio). El resto del contenido sale de producción. */
import { FLECHA } from "../plantilla.mjs";

const C = {
  es: {
    meta: {
      titulo: "D-Code Partners | Automatización e IA para empresas",
      descripcion: "Unimos las herramientas y áreas de tu empresa en un solo sistema: automatizaciones, agentes de IA, integraciones y software a medida sobre tus datos. Madrid.",
    },
    h1: "Tu empresa, en un solo sistema.",
    sub: "Automatización, IA y software a medida.",
    cta: "Hablemos", cta2: "Tócalo",
    capitulos: [
      ["Hoy, piezas sueltas.", "Ventas, clientes, facturas y operaciones. Cada una por su lado, y alguien copiando de una a otra."],
      ["Las unimos.", "Conectamos lo que ya usáis y automatizamos lo que se repite. El dato entra una vez."],
      ["Y le damos inteligencia.", "Agentes de IA que leen, responden y proponen. Lo importante lo decide una persona."],
    ],
    escenaAlt: "Las piezas del logotipo de D-Code, sueltas, se unen en un solo sistema; al final se enciende el píxel azul.",
    bajar: "Desliza",
    productos: {
      h2: "Lo que instalamos.",
      filas: [
        ["finance", "/sistema-financiero", "D-Code Finance", "Facturas, cobros, gastos y registro fiscal, en un sitio."],
        ["os", "/precios#g-os", "D-Code OS", "La capa que conecta tus sistemas."],
        ["medida", "/servicios/sistemas-a-medida", "Sistemas a medida", "Lo que tu equipo repite cada semana, hecho solo."],
        ["agentes", "/servicios/agentes-de-ia", "Agentes de IA e integraciones", "Contestan con tus datos y conectan lo que ya usáis."],
      ],
      todos: "Precios y packs",
    },
    tocalo: {
      h2: "No te lo contamos. Tócalo.",
      sub: "Cuatro sistemas funcionando, con datos inventados.",
      alt: "Panel de D-Code Finance con datos inventados: cobrado, pendiente de cobro y vencido",
      demos: [["finance", "D-Code Finance"], ["comercial", "Comercial"], ["operaciones", "Operaciones"], ["atencion", "Atención al cliente"], ["os", "D-Code OS"]],
      aviso: "Demostración · empresas ficticias · ningún sistema real conectado.",
      cerrar: "Cerrar la demo", pantalla: "Mejor en un ordenador.",
    },
    fin: { h2: "Hablemos.", sub: "Treinta minutos y sabrás qué se puede automatizar en tu empresa.", cta: "Reservar una llamada", mas: [["/metodo", "Cómo trabajamos"], ["/que-hacemos", "Todo lo que hacemos"], ["/garantias", "Garantías"]] },
  },
  en: {
    meta: {
      titulo: "D-Code Partners | Automation and AI for companies",
      descripcion: "We join your company's tools and teams into one system: automations, AI agents, integrations and custom software on your own data. Madrid.",
    },
    h1: "Your company, in one system.",
    sub: "Automation, AI and custom software.",
    cta: "Let's talk", cta2: "Try it",
    capitulos: [
      ["Today, loose pieces.", "Sales, customers, invoices and operations. Each on its own, and someone copying from one to the next."],
      ["We join them.", "We connect what you already use and automate what repeats. Data goes in once."],
      ["And give it intelligence.", "AI agents that read, answer and suggest. What matters is decided by a person."],
    ],
    escenaAlt: "The pieces of the D-Code logo, scattered, come together into one system; at the end the blue pixel lights up.",
    bajar: "Scroll",
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
<section class="piezas" data-piezas aria-labelledby="h-inicio">
  <div class="piezas-fijo">
    <div class="piezas-luz" aria-hidden="true"></div>
    <canvas class="piezas-lienzo" data-piezas-lienzo role="img" aria-label="${c.escenaAlt}"></canvas>
    <picture><source srcset="/assets/v2/img/piezas/700/072.webp" media="(max-width: 760px)"><img class="piezas-poster" data-piezas-poster src="/assets/v2/img/piezas/1100/072.webp" alt="" width="1100" height="1100" loading="lazy" decoding="async"></picture>
    <div class="marco piezas-texto">
      <div class="cap cap--0 is-activo" data-cap="0">
        <h1 class="display" id="h-inicio">${c.h1}</h1>
        <p class="lead">${c.sub}</p>
        <div class="acc"><a class="boton boton--principal" href="${L("/contacto")}">${c.cta} ${FLECHA}</a><a class="boton" href="#tocalo">${c.cta2}</a></div>
      </div>
      <ol class="caps" role="list">
        ${c.capitulos.map(([h, d], i) => `<li class="cap" data-cap="${i + 1}"><p class="cap-n dato">0${i + 1}</p><h2 class="h2">${h}</h2><p class="lead">${d}</p></li>`).join("\n        ")}
      </ol>
      <p class="bajar rotulo" aria-hidden="true">${c.bajar}<i></i></p>
    </div>
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

<section class="bloque bloque--aire tocalo" id="tocalo" aria-labelledby="h-tocalo">
  <div class="marco">
    <div class="tocalo-cab"><h2 class="h2 aparece" id="h-tocalo">${t.h2}</h2><p class="lead aparece" style="--i:1">${t.sub}</p></div>
    <button type="button" class="pantalla aparece" data-demo-abrir="finance" aria-label="${t.demos[0][1]}">
      <picture><source srcset="/assets/img/demos/finance-light-2800.webp" media="(min-width: 900px)"><img src="/assets/img/demos/finance-light-700.webp" alt="${t.alt}" width="1400" height="875" loading="lazy" decoding="async"></picture>
    </button>
    <ul class="demos" role="list">
      ${t.demos.map(([id, n]) => `<li><button type="button" class="demo" data-demo-abrir="${id}">${n} ${FLECHA}</button></li>`).join("")}
    </ul>
    <p class="rotulo tocalo-aviso">${t.aviso}</p>
    <dialog class="visor" data-visor aria-label="Demo">
      <div class="visor-cab"><p class="rotulo" data-visor-t></p><p class="rotulo visor-tel">${t.pantalla}</p><button type="button" class="ctrl" data-visor-cerrar aria-label="${t.cerrar}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
      <iframe data-visor-marco title="Demo"></iframe>
    </dialog>
  </div>
</section>

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
