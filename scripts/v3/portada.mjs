#!/usr/bin/env node
/* ==========================================================================
   PORTADA «EL MUNDO» · genera el <main> de index.html y en/index.html
   --------------------------------------------------------------------------
   La portada es una sala en 3D (assets/v2/js/mundo.js) y, encima, el contenido
   de siempre en HTML: lo que lee Google y lo que lee un lector de pantalla
   está aquí, no en el lienzo. Cada <section class="acto"> es un capítulo del
   mundo (data-acto = su número en el motor).

   La cabecera, el pie y el asistente de cada página no se tocan. Las demos y
   la lista de productos se conservan tal cual (scripts/v3/fragmentos/).
   Uso: node scripts/v3/portada.mjs
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const FRAG = path.join(RAIZ, "scripts/v3/fragmentos");
const FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';

const T = {
  es: {
    p: "",
    hero: { marca: "D-Code Partners", h1: "Sistemas inteligentes para empresas.", lead: "Conectamos a tus personas, tus procesos, tus datos y tus herramientas en un solo sistema, con automatización e inteligencia artificial.", cta: "Reservar una llamada", cta2: "Ver cómo funciona", pista: "Desliza" },
    indice: "Capítulos",
    actos: ["Inicio", "Hoy", "La conexión", "La inteligencia", "La automatización", "D-Code Finance", "El resultado", "Pruébalo", "El tuyo"],
    hoy: {
      h2: "Hoy el trabajo de tu empresa va por su lado.",
      lead: "Ventas, clientes, facturas y operaciones se llevan en sitios distintos, y alguien tiene que copiar los datos de uno a otro.",
      dolores: ["El presupuesto que nadie llegó a enviar.", "La factura que se tecleó a mano dos veces.", "El mensaje de un cliente que sigue sin respuesta.", "La hoja de cálculo que solo entiende una persona."],
      mano: "Mantén pulsado para poner orden", manoTactil: "Mantén el dedo para poner orden",
    },
    sistema: {
      h2: "Nosotros lo conectamos en un solo sistema.",
      lead: "Unimos las herramientas que ya usas para que cada dato se escriba una sola vez y el trabajo pase solo de un área a otra.",
      elige: "Elige un área para ver qué cambia",
      areas: [
        ["Ventas", "Cada contacto queda registrado, tiene su seguimiento y recibe su propuesta en minutos.", "/departamentos/comercial", "Ver el área comercial"],
        ["Clientes", "Cada cliente recibe respuesta rápida, también fuera de horario, y nadie se queda sin atender.", "/departamentos/soporte", "Ver el área de soporte"],
        ["Operaciones", "Cada trabajo arranca solo al ganar un cliente y los retrasos se detectan antes de tiempo.", "/departamentos/produccion", "Ver el área de operaciones"],
        ["Finanzas", "La factura sale del presupuesto aceptado y los cobros pendientes se recuerdan solos.", "/departamentos/finanzas", "Ver el área de finanzas"],
        ["Dirección", "Cada mañana ves cómo va la empresa con los datos del día.", "/departamentos/direccion", "Ver el área de dirección"],
      ],
      mas: [["/servicios/integraciones", "Integraciones"], ["/servicios/sistemas-a-medida", "Sistemas a medida"], ["/que-hacemos", "Todas las áreas"]],
      leyenda: ["Entra desordenado", "El sistema lo lee", "Sale clasificado"],
    },
    ia: { h2: "Después le añadimos inteligencia artificial.", lead: "Los agentes de IA leen cada documento y cada mensaje, lo clasifican y responden con los datos de tu empresa. Las decisiones importantes las toma una persona.", enlace: ["/servicios/agentes-de-ia", "Ver los agentes de IA"], nota: "El píxel azul marca lo que ya ha pasado por el sistema." },
    auto: { h2: "Lo que se repite cada semana se hace solo.", lead: "El sistema trabaja también cuando no hay nadie en la oficina. Si algo falla, te avisa.", hora: "03:12", pie: "Son las tres de la mañana y el trabajo sigue saliendo.", enlace: ["/servicios/automatizaciones", "Ver las automatizaciones"] },
    finance: {
      etiqueta: "D-Code Finance", h2: "Finance lee tus facturas y te responde con tus números.",
      lead: "Le pasas la factura de un proveedor y el sistema la registra sola. Después puedes preguntarle por tus pagos, tus cobros y tu tesorería.",
      boton: "Pasar la factura por Finance", otra: "Repetir", registro: "Registro de la factura", vacio: "Todavía no hay nada registrado.", hecho: "Factura registrada. Nadie la ha tecleado.",
      campos: [["prov", "Proveedor", "Suministros Arce, S.L."], ["num", "Número", "F-2026/0412"], ["fecha", "Fecha", "28/09/2026"], ["base", "Base imponible", "1.240,00 €"], ["iva", "IVA 21 %", "260,40 €"], ["total", "Total", "1.500,40 €"], ["vence", "Vencimiento", "28/10/2026"]],
      pregunta: "Ahora pregúntale", preguntas: [["¿Qué pagos vencen en octubre?", "Uno: 1.500,40 € a Suministros Arce, S.L., el 28 de octubre."], ["¿Cuánto IVA lleva esta factura?", "260,40 €, el 21 % sobre una base de 1.240,00 €."]],
      aviso: "Es un ejemplo con datos inventados. La lectura de facturas y las preguntas están en Finance con inteligencia.",
      enlace: ["/sistema-financiero", "Ver D-Code Finance"], demo: "Abrir la demo completa",
    },
    resultado: { h2: "Tu empresa funciona como un solo sistema.", lead: "Cada dato entra una vez, cada tarea tiene su sitio y tú ves el conjunto.", instalamos: "Esto es lo que instalamos", garantias: [["/garantias", "Alcance y precio por escrito antes de empezar"], ["/garantias", "Sin permanencia"], ["/casos-exito", "Lo usamos antes en nuestra propia empresa"]] },
    tuyo: { h2: "Construyamos el tuyo.", lead: "En una llamada de treinta minutos te diremos qué se puede automatizar en tu empresa.", cta: "Reservar una llamada", mas: [["/metodo", "Cómo trabajamos"], ["/que-hacemos", "Todo lo que hacemos"], ["/garantias", "Garantías"], ["/diagnostico", "Diagnóstico gratuito"]], web: "Esta web también la hemos construido nosotros.", webEnlace: ["/servicios/paginas-web", "Queremos una así"] },
  },
  en: {
    p: "/en",
    hero: { marca: "D-Code Partners", h1: "Intelligent systems for companies.", lead: "We connect your people, your processes, your data and your tools into one system, with automation and artificial intelligence.", cta: "Book a call", cta2: "See how it works", pista: "Scroll" },
    indice: "Chapters",
    actos: ["Start", "Today", "The connection", "The intelligence", "The automation", "D-Code Finance", "The result", "Try it", "Yours"],
    hoy: {
      h2: "Today your company's work goes its own way.",
      lead: "Sales, clients, invoices and operations live in different places, and someone has to copy the data from one to another.",
      dolores: ["The quote nobody got round to sending.", "The invoice that was typed in by hand twice.", "The client message that is still unanswered.", "The spreadsheet only one person understands."],
      mano: "Press and hold to bring order", manoTactil: "Touch and hold to bring order",
    },
    sistema: {
      h2: "We connect it all into one system.",
      lead: "We join the tools you already use so every piece of data is entered only once and work moves from one area to the next on its own.",
      elige: "Pick an area to see what changes",
      areas: [
        ["Sales", "Every contact is recorded, followed up and gets its proposal in minutes.", "/en/departamentos/comercial", "See the sales area"],
        ["Clients", "Every client gets a fast reply, even after hours, and nobody is left unanswered.", "/en/departamentos/soporte", "See the support area"],
        ["Operations", "Every job starts on its own when a client is won, and delays are caught early.", "/en/departamentos/produccion", "See the operations area"],
        ["Finance", "The invoice comes out of the accepted quote and pending payments are chased automatically.", "/en/departamentos/finanzas", "See the finance area"],
        ["Management", "Every morning you see how the company is doing, with the day's data.", "/en/departamentos/direccion", "See the management area"],
      ],
      mas: [["/en/servicios/integraciones", "Integrations"], ["/en/servicios/sistemas-a-medida", "Custom systems"], ["/en/que-hacemos", "All areas"]],
      leyenda: ["It arrives in a mess", "The system reads it", "It leaves sorted"],
    },
    ia: { h2: "Then we add artificial intelligence.", lead: "AI agents read every document and every message, classify it and reply using your company's data. The important decisions are made by a person.", enlace: ["/en/servicios/agentes-de-ia", "See the AI agents"], nota: "The blue pixel marks what has already been through the system." },
    auto: { h2: "What repeats every week runs on its own.", lead: "The system keeps working when nobody is in the office. If something fails, it lets you know.", hora: "03:12", pie: "It is three in the morning and the work keeps moving.", enlace: ["/en/servicios/automatizaciones", "See the automations"] },
    finance: {
      etiqueta: "D-Code Finance", h2: "Finance reads your invoices and answers with your numbers.",
      lead: "You hand it a supplier invoice and the system records it on its own. Then you can ask about your payments, your collections and your cash flow.",
      boton: "Run the invoice through Finance", otra: "Repeat", registro: "Invoice record", vacio: "Nothing has been recorded yet.", hecho: "Invoice recorded. Nobody typed it in.",
      campos: [["prov", "Supplier", "Suministros Arce, S.L."], ["num", "Number", "F-2026/0412"], ["fecha", "Date", "28/09/2026"], ["base", "Net amount", "€1,240.00"], ["iva", "VAT 21%", "€260.40"], ["total", "Total", "€1,500.40"], ["vence", "Due date", "28/10/2026"]],
      pregunta: "Now ask it", preguntas: [["Which payments are due in October?", "One: €1,500.40 to Suministros Arce, S.L., on 28 October."], ["How much VAT is on this invoice?", "€260.40, 21% on a net amount of €1,240.00."]],
      aviso: "This is an example with invented data. Invoice reading and questions are part of Finance with intelligence.",
      enlace: ["/en/sistema-financiero", "See D-Code Finance"], demo: "Open the full demo",
    },
    resultado: { h2: "Your company runs as one system.", lead: "Every piece of data comes in once, every task has its place and you see the whole picture.", instalamos: "This is what we install", garantias: [["/en/garantias", "Scope and price in writing before we start"], ["/en/garantias", "No lock-in"], ["/en/casos-exito", "We ran it in our own company first"]] },
    tuyo: { h2: "Let's build yours.", lead: "On a thirty-minute call we will tell you what can be automated in your company.", cta: "Book a call", mas: [["/en/metodo", "How we work"], ["/en/que-hacemos", "Everything we do"], ["/en/garantias", "Guarantees"], ["/en/diagnostico", "Free assessment"]], web: "We built this website too.", webEnlace: ["/en/servicios/paginas-web", "We want one like it"] },
  },
};

const num = (n) => String(n).padStart(2, "0");
const cab = (n, nombre) => `<p class="acto-n"><span>${num(n)}</span>${nombre}</p>`;
const enlace = ([href, t], clase = "enlace") => `<a class="${clase}" href="${href}">${t} ${FLECHA}</a>`;

function principal(lang, frag) {
  const t = T[lang], p = t.p;
  return `<main id="contenido" class="mundo" data-mundo>
<div class="mundo-escena" aria-hidden="true"><canvas class="mundo-lienzo" data-mundo-lienzo></canvas><div class="mundo-velo"></div><div class="mundo-grano"></div></div>
<nav class="mundo-indice" aria-label="${t.indice}"><ol role="list">${t.actos.map((a, i) => `<li><a href="#${["inicio", "hoy", "sistema", "inteligencia", "automatizacion", "finance", "resultado", "tocalo", "hablemos"][i]}" data-indice="${i}"><span>${num(i)}</span><b>${a}</b></a></li>`).join("")}</ol></nav>

<section class="acto acto--claro" id="inicio" data-acto="0" aria-labelledby="h-inicio">
  <div class="marco acto-in">
    <div class="claro-texto">
      <p class="etiqueta">${t.hero.marca}</p>
      <h1 class="display" id="h-inicio">${t.hero.h1}</h1>
      <p class="lead">${t.hero.lead}</p>
      <div class="acc"><a class="boton boton--principal" href="${p}/contacto">${t.hero.cta} ${FLECHA}</a><a class="boton" href="#hoy">${t.hero.cta2}</a></div>
    </div>
    <p class="claro-pista" aria-hidden="true"><span></span>${t.hero.pista}</p>
  </div>
</section>

<section class="acto acto--hoy" id="hoy" data-acto="1" aria-labelledby="h-hoy">
  <div class="marco acto-in">
    <div class="acto-texto">
      ${cab(1, t.actos[1])}
      <h2 class="h2" id="h-hoy">${t.hoy.h2}</h2>
      <p class="lead">${t.hoy.lead}</p>
      <ol class="dolores" role="list" data-dolores>${t.hoy.dolores.map((d, i) => `<li data-dolor="${i}"><span>${d}</span></li>`).join("")}</ol>
      <p class="mano" data-mano aria-hidden="true"><span class="mano-p"></span><span data-mano-raton>${t.hoy.mano}</span><span data-mano-tactil>${t.hoy.manoTactil}</span></p>
    </div>
  </div>
</section>

<section class="acto acto--sistema" id="sistema" data-acto="2" aria-labelledby="h-sistema">
  <div class="marco acto-in">
    <div class="acto-texto">
      ${cab(2, t.actos[2])}
      <h2 class="h2" id="h-sistema">${t.sistema.h2}</h2>
      <p class="lead">${t.sistema.lead}</p>
      <div class="areas" data-areas>
        <p class="rotulo" id="areas-t">${t.sistema.elige}</p>
        <div class="areas-pest" role="tablist" aria-labelledby="areas-t">${t.sistema.areas.map((a, i) => `<button type="button" role="tab" id="area-p-${i}" aria-controls="area-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-area="${i}">${a[0]}</button>`).join("")}</div>
        ${t.sistema.areas.map((a, i) => `<div class="area" role="tabpanel" id="area-${i}" aria-labelledby="area-p-${i}"${i ? " hidden" : ""}><p>${a[1]}</p>${enlace([a[2], a[3]])}</div>`).join("\n        ")}
      </div>
      <ul class="acto-mas" role="list">${t.sistema.mas.map((m) => `<li>${enlace(m)}</li>`).join("")}</ul>
    </div>
    <ol class="leyenda" role="list" aria-hidden="true" data-leyenda>${t.sistema.leyenda.map((l, i) => `<li data-leyenda-i="${i}"><span>${l}</span></li>`).join("")}</ol>
  </div>
</section>

<section class="acto acto--ia" id="inteligencia" data-acto="3" aria-labelledby="h-ia">
  <div class="marco acto-in">
    <div class="acto-texto">
      ${cab(3, t.actos[3])}
      <h2 class="h2" id="h-ia">${t.ia.h2}</h2>
      <p class="lead">${t.ia.lead}</p>
      <p class="nota-pixel"><span class="pixel" aria-hidden="true"></span>${t.ia.nota}</p>
      <p>${enlace(t.ia.enlace)}</p>
    </div>
  </div>
</section>

<section class="acto acto--auto" id="automatizacion" data-acto="4" aria-labelledby="h-auto">
  <div class="marco acto-in">
    <div class="acto-texto">
      ${cab(4, t.actos[4])}
      <h2 class="h2" id="h-auto">${t.auto.h2}</h2>
      <p class="lead">${t.auto.lead}</p>
      <p class="hora"><time>${t.auto.hora}</time><span>${t.auto.pie}</span></p>
      <p>${enlace(t.auto.enlace)}</p>
    </div>
  </div>
</section>

<section class="acto acto--finance" id="finance" data-acto="5" aria-labelledby="h-finance">
  <div class="marco acto-in">
    <div class="acto-texto">
      <p class="acto-n"><span>${num(5)}</span>${t.finance.etiqueta}</p>
      <h2 class="h2" id="h-finance">${t.finance.h2}</h2>
      <p class="lead">${t.finance.lead}</p>
      <div class="fz" data-fz>
        <div class="fz-acc"><button type="button" class="boton boton--principal" data-fz-pasar>${t.finance.boton} ${FLECHA}</button><button type="button" class="enlace" data-fz-otra hidden>${t.finance.otra}</button></div>
        <div class="fz-registro" aria-live="polite">
          <p class="rotulo">${t.finance.registro}</p>
          <p class="fz-vacio" data-fz-vacio>${t.finance.vacio}</p>
          <dl class="fz-campos">${t.finance.campos.map(([k, n, v]) => `<div data-fz-campo="${k}"><dt>${n}</dt><dd><span>${v}</span></dd></div>`).join("")}</dl>
          <p class="fz-hecho" data-fz-hecho hidden><span class="pixel" aria-hidden="true"></span>${t.finance.hecho}</p>
        </div>
        <div class="fz-preguntas" data-fz-preguntas hidden>
          <p class="rotulo">${t.finance.pregunta}</p>
          <div class="fz-botones">${t.finance.preguntas.map(([q, a], i) => `<button type="button" class="fz-q" data-fz-q="${i}" data-fz-r="${a.replace(/"/g, "&quot;")}">${q}</button>`).join("")}</div>
          <p class="fz-respuesta" data-fz-respuesta aria-live="polite"></p>
        </div>
      </div>
      <p class="nota peq">${t.finance.aviso}</p>
      <ul class="acto-mas" role="list"><li>${enlace(t.finance.enlace)}</li><li><button type="button" class="enlace" data-demo-abrir="finance">${t.finance.demo} ${FLECHA}</button></li></ul>
    </div>
  </div>
</section>

<section class="acto acto--resultado productos" id="resultado" data-acto="6" aria-labelledby="h-resultado">
  <div class="marco acto-in">
    <div class="acto-texto acto-texto--ancho">
      ${cab(6, t.actos[6])}
      <h2 class="h2" id="h-resultado">${t.resultado.h2}</h2>
      <p class="lead">${t.resultado.lead}</p>
      <div id="productos">
        <p class="rotulo" id="h-productos">${t.resultado.instalamos}</p>
        ${frag.productos}
      </div>
      <ul class="garantias" role="list">${t.resultado.garantias.map(([h, x]) => `<li><a href="${h}"><span class="pixel" aria-hidden="true"></span>${x}</a></li>`).join("")}</ul>
    </div>
  </div>
</section>

${frag.tocalo}

<section class="acto acto--tuyo fin" id="hablemos" data-acto="8" aria-labelledby="h-fin">
  <div class="marco acto-in">
    <div class="acto-texto">
      ${cab(8, t.actos[8])}
      <h2 class="display" id="h-fin">${t.tuyo.h2}</h2>
      <p class="lead">${t.tuyo.lead}</p>
      <div class="acc"><a class="boton boton--principal" href="${p}/contacto">${t.tuyo.cta} ${FLECHA}</a></div>
      <ul class="fin-mas" role="list">${t.tuyo.mas.map(([h, x]) => `<li><a class="enlace" href="${h}">${x}</a></li>`).join("")}</ul>
      <p class="tuyo-web">${t.tuyo.web} ${enlace(t.tuyo.webEnlace)}</p>
    </div>
  </div>
</section>
</main>`;
}

fs.mkdirSync(FRAG, { recursive: true });
for (const lang of ["es", "en"]) {
  const rel = lang === "en" ? "en/index.html" : "index.html";
  let s = fs.readFileSync(path.join(RAIZ, rel), "utf8");
  const i = s.indexOf("<main"), j = s.indexOf("</main>") + 7;
  const m = s.slice(i, j);
  // las demos y la lista de productos se guardan la primera vez y ya no se pierden
  const fTocalo = path.join(FRAG, `${lang}-tocalo.html`), fProd = path.join(FRAG, `${lang}-productos.html`);
  if (!fs.existsSync(fTocalo)) { const a = m.indexOf('<section class="bloque bloque--aire tocalo"'), b = m.indexOf("</section>", m.indexOf("</dialog>", a)) + 10; if (a < 0) throw new Error(rel + ": no encuentro las demos"); fs.writeFileSync(fTocalo, m.slice(a, b)); }
  if (!fs.existsSync(fProd)) { const a = m.indexOf('<ul class="lista" role="list">'), b = m.indexOf("</div>", m.indexOf("data-precio-aviso", a)); if (a < 0) throw new Error(rel + ": no encuentro los productos"); fs.writeFileSync(fProd, m.slice(a, b).trim()); }
  const frag = {
    tocalo: fs.readFileSync(fTocalo, "utf8").replace('<section class="bloque bloque--aire tocalo" id="tocalo"', '<section class="acto acto--demos bloque tocalo" id="tocalo" data-acto="7"').replace(/ aparece"/g, '"').replace(/class="h2 aparece"/, 'class="h2"'),
    productos: fs.readFileSync(fProd, "utf8").replace(/class="aparece" style="--i:\d"/g, "").replace(/ aparece"/g, '"').replace(/<p class="aparece">/g, "<p>"),
  };
  s = s.slice(0, i) + principal(lang, frag) + s.slice(j);
  // hoja de estilos y código de la portada
  if (!s.includes("/assets/v2/mundo.css")) s = s.replace(/(<link rel="stylesheet" href="\/assets\/v2\/inicio\.css\?v=[0-9a-f]+">)/, '$1\n<link rel="stylesheet" href="/assets/v2/mundo.css?v=0000000000">');
  if (!s.includes("/assets/v2/js/portada.js")) s = s.replace(/(<script type="module" src="\/assets\/v2\/js\/inicio\.js\?v=[0-9a-f]+"><\/script>)/, '$1\n<script type="module" src="/assets/v2/js/portada.js?v=0000000000"></script>');
  s = s.replace(/<link rel="modulepreload"[^>]*piezas3d[^>]*>\n?/g, "").replace(/<link rel="preload"[^>]*img\/piezas[^>]*>\n?/g, "");
  if (!/<html[^>]*es-mundo/.test(s)) s = s.replace(/<html([^>]*)class="/, '<html$1class="es-mundo ');
  fs.writeFileSync(path.join(RAIZ, rel), s);
  console.log(`portada: ${rel} (${(principal(lang, frag).length / 1024).toFixed(1)} KB de <main>)`);
}
