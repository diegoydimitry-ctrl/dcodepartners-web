#!/usr/bin/env node
/* ==========================================================================
   PORTADA «LA MÁQUINA» · genera el <main> de index.html y en/index.html
   --------------------------------------------------------------------------
   La portada es una película que se pasa con el scroll: una máquina de
   precisión que se monta, marcha, lee un documento y se cierra tras su tapa
   (assets/v2/js/maquina.js). Encima va el contenido de verdad, en HTML: lo
   que lee Google y lo que lee un lector de pantalla está aquí, no en el
   lienzo. Cada <section class="acto"> es un capítulo (data-acto = su número
   en el motor).

   La cabecera, el pie y el asistente de cada página no se tocan. Las demos y
   la lista de productos se conservan tal cual (scripts/v4/fragmentos/).
   Uso: node scripts/v4/portada.mjs
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const FRAG = path.join(RAIZ, "scripts/v4/fragmentos");
const FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
const IDS = ["inicio", "hoy", "sistema", "automatizacion", "inteligencia", "finance", "resultado", "tocalo", "hablemos"];

const T = {
  es: {
    p: "",
    hero: { marca: "D-Code Partners", h1: ["Sistemas inteligentes", "para empresas."], lead: "Tu empresa ya tiene todas las piezas: personas, procesos, datos y herramientas. Nosotros las conectamos en un solo sistema, con automatización e inteligencia artificial.", cta: "Reservar una llamada", cta2: "Ver cómo funciona", pista: "Desliza para montarla", carga: "Cargando la escena" },
    indice: "Capítulos",
    actos: ["Inicio", "Hoy", "El sistema", "La automatización", "La inteligencia", "D-Code Finance", "El resultado", "Pruébalo", "El tuyo"],
    hoy: {
      h2: "Hoy cada pieza de tu empresa trabaja por su cuenta.",
      lead: "El programa de facturas, la hoja de pedidos, el correo y los mensajes de los clientes funcionan, pero no se hablan entre sí. Alguien tiene que pasar los datos de un sitio a otro.",
      sueltas: ["La hoja de cálculo de pedidos", "Las facturas en PDF", "Los mensajes de los clientes", "La agenda de cada uno"],
      mano: "Mantén pulsado y mira cómo encajan", manoTactil: "Mantén el dedo y mira cómo encajan", arrastra: "Arrastra para mover las piezas",
    },
    sistema: {
      h2: "Nosotros las montamos en un solo sistema.",
      lead: "Colocamos cada área en su sitio y las unimos entre sí. Las ruedas azules son las conexiones que construimos: gracias a ellas, lo que pasa en ventas llega solo a operaciones, a finanzas y a dirección.",
      elige: "Elige un área para verla de cerca",
      areas: [
        ["Todas", "Cinco áreas y un motor en una sola máquina. Elige un área para ver qué cambia en ella.", "/que-hacemos", "Ver todo lo que hacemos", ""],
        ["Ventas", "Cada contacto queda registrado, tiene su seguimiento y recibe su propuesta en minutos.", "/departamentos/comercial", "Ver el área comercial", "ventas"],
        ["Clientes", "Cada cliente recibe respuesta rápida, también fuera de horario, y nadie se queda sin atender.", "/departamentos/soporte", "Ver el área de soporte", "clientes"],
        ["Operaciones", "Cada trabajo arranca solo al ganar un cliente y los retrasos se detectan antes de tiempo.", "/departamentos/produccion", "Ver el área de operaciones", "operaciones"],
        ["Finanzas", "La factura sale del presupuesto aceptado y los cobros pendientes se recuerdan solos.", "/departamentos/finanzas", "Ver el área de finanzas", "finanzas"],
        ["Dirección", "Cada mañana ves cómo va la empresa con los datos del día.", "/departamentos/direccion", "Ver el área de dirección", "direccion"],
      ],
      todas: "Ver todas", mas: [["/servicios/integraciones", "Integraciones"], ["/servicios/sistemas-a-medida", "Sistemas a medida"], ["/que-hacemos", "Todas las áreas"]],
    },
    auto: { h2: "Lo que se repite cada semana se hace solo.", lead: "Una vez montada, la máquina marcha sin que nadie la empuje. Los recordatorios, los informes y los avisos salen también cuando la oficina está cerrada. Si algo falla, te avisa.", hora: "03:12", pie: "Son las tres de la mañana y el trabajo sigue saliendo.", enlace: ["/servicios/automatizaciones", "Ver las automatizaciones"] },
    ia: { h2: "Y además entiende lo que le das.", lead: "Los agentes de IA leen cada documento y cada mensaje, sacan los datos y responden con la información de tu empresa. Las decisiones importantes las sigue tomando una persona.", enlace: ["/servicios/agentes-de-ia", "Ver los agentes de IA"], nota: "La lupa está leyendo una factura de ejemplo." },
    finance: {
      etiqueta: "D-Code Finance", h2: "Finance lee tus facturas y te responde con tus números.",
      lead: "Pásale una factura: la lee, la registra, programa el pago y avisa a dirección. Después puedes preguntarle por tus pagos, tus cobros y tu tesorería.",
      base: "Base imponible de la factura", ayuda: "Cambia la cifra y pruébalo con la tuya.",
      boton: "Pasar la factura por Finance", otra: "Repetir", registro: "Registro de la factura", vacio: "Todavía no hay nada registrado.", hecho: "Factura registrada. Nadie la ha tecleado.", accion: "Pago programado para el 28/10/2026 y aviso enviado a dirección.",
      campos: [["prov", "Proveedor", "Suministros Arce, S.L."], ["num", "Número", "F-2026/0412"], ["fecha", "Fecha", "28/09/2026"], ["base", "Base imponible", "1.240,00 €"], ["iva", "IVA 21 %", "260,40 €"], ["total", "Total", "1.500,40 €"], ["vence", "Vencimiento", "28/10/2026"]],
      pregunta: "Ahora pregúntale", preguntas: [["¿Qué pagos vencen en octubre?", "Uno: {total} a Suministros Arce, S.L., el 28 de octubre."], ["¿Cuánto IVA lleva esta factura?", "{iva}, el 21 % sobre una base de {base}."]],
      aviso: "Es un ejemplo con datos inventados. La lectura de facturas y las preguntas están en Finance con inteligencia.",
      enlace: ["/sistema-financiero", "Ver D-Code Finance"], demo: "Abrir la demo completa",
    },
    resultado: { h2: "Lo complejo queda dentro. Tú ves lo que importa.", lead: "Al terminar, tu empresa funciona como un solo sistema: cada dato entra una vez, cada tarea tiene su sitio y tú miras una sola pantalla.", instalamos: "Esto es lo que instalamos", garantias: [["/garantias", "Alcance y precio por escrito antes de empezar"], ["/garantias", "Sin permanencia"], ["/casos-exito", "Lo usamos antes en nuestra propia empresa"]] },
    tuyo: {
      h2: "¿Qué construimos para ti?", lead: "Escribe el nombre de tu empresa y marca lo que hoy no encaja. En una llamada de treinta minutos te decimos cómo lo montaríamos.",
      nombre: "El nombre de tu empresa", marcador: "Tu empresa", piezas: "¿Qué es lo que hoy no encaja?", opciones: ["Ventas", "Atención al cliente", "Operaciones", "Facturación y cobros", "Informes para dirección"],
      cta: "Reservar una llamada", privado: "Lo que escribas aquí solo se usa para rellenar el formulario de contacto.",
      mas: [["/metodo", "Cómo trabajamos"], ["/que-hacemos", "Todo lo que hacemos"], ["/garantias", "Garantías"], ["/diagnostico", "Diagnóstico gratuito"]], web: "Esta web también la hemos construido nosotros.", webEnlace: ["/servicios/paginas-web", "Queremos una así"],
      grabado: "CONSTRUIDO PARA",
    },
  },
  en: {
    p: "/en",
    hero: { marca: "D-Code Partners", h1: ["Intelligent systems", "for companies."], lead: "Your company already has all the parts: people, processes, data and tools. We connect them into one system, with automation and artificial intelligence.", cta: "Book a call", cta2: "See how it works", pista: "Scroll to assemble it", carga: "Loading the scene" },
    indice: "Chapters",
    actos: ["Start", "Today", "The system", "The automation", "The intelligence", "D-Code Finance", "The result", "Try it", "Yours"],
    hoy: {
      h2: "Today every part of your company works on its own.",
      lead: "The invoicing program, the orders spreadsheet, the email and the client messages all work, but they do not talk to each other. Someone has to move the data from one place to another.",
      sueltas: ["The orders spreadsheet", "The invoices in PDF", "The client messages", "Everyone's own calendar"],
      mano: "Press and hold to see them fit", manoTactil: "Touch and hold to see them fit", arrastra: "Drag to move the parts",
    },
    sistema: {
      h2: "We assemble them into one system.",
      lead: "We put each area in its place and join them together. The blue wheels are the connections we build: thanks to them, what happens in sales reaches operations, finance and management on its own.",
      elige: "Pick an area to see it up close",
      areas: [
        ["All", "Five areas and an engine in a single machine. Pick an area to see what changes in it.", "/en/que-hacemos", "See everything we do", ""],
        ["Sales", "Every contact is recorded, followed up and gets its proposal in minutes.", "/en/departamentos/comercial", "See the sales area", "ventas"],
        ["Clients", "Every client gets a fast reply, even after hours, and nobody is left unanswered.", "/en/departamentos/soporte", "See the support area", "clientes"],
        ["Operations", "Every job starts on its own when a client is won, and delays are caught early.", "/en/departamentos/produccion", "See the operations area", "operaciones"],
        ["Finance", "The invoice comes out of the accepted quote and pending payments are chased automatically.", "/en/departamentos/finanzas", "See the finance area", "finanzas"],
        ["Management", "Every morning you see how the company is doing, with the day's data.", "/en/departamentos/direccion", "See the management area", "direccion"],
      ],
      todas: "See all", mas: [["/en/servicios/integraciones", "Integrations"], ["/en/servicios/sistemas-a-medida", "Custom systems"], ["/en/que-hacemos", "All areas"]],
    },
    auto: { h2: "What repeats every week runs on its own.", lead: "Once assembled, the machine runs without anyone pushing it. Reminders, reports and alerts also go out when the office is closed. If something fails, it lets you know.", hora: "03:12", pie: "It is three in the morning and the work keeps moving.", enlace: ["/en/servicios/automatizaciones", "See the automations"] },
    ia: { h2: "And it understands what you give it.", lead: "AI agents read every document and every message, extract the data and reply with your company's information. The important decisions are still made by a person.", enlace: ["/en/servicios/agentes-de-ia", "See the AI agents"], nota: "The loupe is reading a sample invoice." },
    finance: {
      etiqueta: "D-Code Finance", h2: "Finance reads your invoices and answers with your numbers.",
      lead: "Hand it an invoice: it reads it, records it, schedules the payment and notifies management. Then you can ask about your payments, your collections and your cash flow.",
      base: "Net amount of the invoice", ayuda: "Change the figure and try it with your own.",
      boton: "Run the invoice through Finance", otra: "Repeat", registro: "Invoice record", vacio: "Nothing has been recorded yet.", hecho: "Invoice recorded. Nobody typed it in.", accion: "Payment scheduled for 28/10/2026 and management notified.",
      campos: [["prov", "Supplier", "Suministros Arce, S.L."], ["num", "Number", "F-2026/0412"], ["fecha", "Date", "28/09/2026"], ["base", "Net amount", "€1,240.00"], ["iva", "VAT 21%", "€260.40"], ["total", "Total", "€1,500.40"], ["vence", "Due date", "28/10/2026"]],
      pregunta: "Now ask it", preguntas: [["Which payments are due in October?", "One: {total} to Suministros Arce, S.L., on 28 October."], ["How much VAT is on this invoice?", "{iva}, 21% on a net amount of {base}."]],
      aviso: "This is an example with invented data. Invoice reading and questions are part of Finance with intelligence.",
      enlace: ["/en/sistema-financiero", "See D-Code Finance"], demo: "Open the full demo",
    },
    resultado: { h2: "The complexity stays inside. You see what matters.", lead: "When we finish, your company runs as one system: every piece of data comes in once, every task has its place and you look at a single screen.", instalamos: "This is what we install", garantias: [["/en/garantias", "Scope and price in writing before we start"], ["/en/garantias", "No lock-in"], ["/en/casos-exito", "We ran it in our own company first"]] },
    tuyo: {
      h2: "What shall we build for you?", lead: "Type your company's name and tick what does not fit today. On a thirty-minute call we will tell you how we would assemble it.",
      nombre: "Your company's name", marcador: "Your company", piezas: "What does not fit today?", opciones: ["Sales", "Customer service", "Operations", "Invoicing and collections", "Reports for management"],
      cta: "Book a call", privado: "What you type here is only used to fill in the contact form.",
      mas: [["/en/metodo", "How we work"], ["/en/que-hacemos", "Everything we do"], ["/en/garantias", "Guarantees"], ["/en/diagnostico", "Free assessment"]], web: "We built this website too.", webEnlace: ["/en/servicios/paginas-web", "We want one like it"],
      grabado: "BUILT FOR",
    },
  },
};

const num = (n) => String(n).padStart(2, "0");
const cab = (n, nombre) => `<p class="acto-n"><span>${num(n)}</span>${nombre}</p>`;
const enlace = ([href, t], clase = "enlace") => `<a class="${clase}" href="${href}">${t} ${FLECHA}</a>`;
const fmt = (s, f) => s.replace(/\{(\w+)\}/g, (_, k) => f[k]);

function principal(lang, frag) {
  const t = T[lang], p = t.p, f = t.finance, val = Object.fromEntries(f.campos.map(([k, , v]) => [k, v]));
  return `<main id="contenido" class="maq" data-maq data-grabado="${t.tuyo.grabado}">
<div class="maq-escena" aria-hidden="true"><canvas class="maq-lienzo" data-maq-lienzo></canvas><div class="maq-velo"></div><p class="maq-carga" data-maq-carga><span class="pixel"></span>${t.hero.carga}</p></div>
<nav class="maq-tira" aria-label="${t.indice}"><ol role="list">${t.actos.map((a, i) => `<li><a href="#${IDS[i]}" data-indice="${i}"><span>${num(i)}</span><b>${a}</b></a></li>`).join("")}</ol></nav>
<div class="maq-pulso" data-maq-pulso aria-hidden="true"><i></i></div>

<section class="acto acto--claro" id="inicio" data-acto="0" aria-labelledby="h-inicio">
  <div class="marco acto-in">
    <div class="claro-texto">
      <p class="etiqueta">${t.hero.marca}</p>
      <h1 class="display" id="h-inicio">${t.hero.h1.map((l) => `<span class="linea"><span>${l}</span></span>`).join(" ")}</h1>
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
      <ul class="sueltas" role="list" data-sueltas>${t.hoy.sueltas.map((d, i) => `<li data-suelta="${i}"><span>${d}</span></li>`).join("")}</ul>
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
        <div class="areas-pest" role="tablist" aria-labelledby="areas-t">${t.sistema.areas.map((a, i) => `<button type="button" role="tab" id="area-p-${i}" aria-controls="area-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-area="${i}" data-modulo="${a[4]}">${a[0]}</button>`).join("")}</div>
        ${t.sistema.areas.map((a, i) => `<div class="area" role="tabpanel" id="area-${i}" aria-labelledby="area-p-${i}"${i ? " hidden" : ""}><p>${a[1]}</p>${enlace([a[2], a[3]])}</div>`).join("\n        ")}
      </div>
      <ul class="acto-mas" role="list">${t.sistema.mas.map((m) => `<li>${enlace(m)}</li>`).join("")}</ul>
    </div>
    <ol class="modulos" role="list" aria-hidden="true" data-modulos>${t.sistema.areas.filter((a) => a[4]).map((a) => `<li data-modulo-i="${a[4]}"><span>${a[0]}</span></li>`).join("")}</ol>
  </div>
</section>

<section class="acto acto--auto" id="automatizacion" data-acto="3" aria-labelledby="h-auto">
  <div class="marco acto-in">
    <div class="acto-texto">
      ${cab(3, t.actos[3])}
      <h2 class="h2" id="h-auto">${t.auto.h2}</h2>
      <p class="lead">${t.auto.lead}</p>
      <p class="hora"><time>${t.auto.hora}</time><span>${t.auto.pie}</span></p>
      <p>${enlace(t.auto.enlace)}</p>
    </div>
  </div>
</section>

<section class="acto acto--ia" id="inteligencia" data-acto="4" aria-labelledby="h-ia">
  <div class="marco acto-in">
    <div class="acto-texto">
      ${cab(4, t.actos[4])}
      <h2 class="h2" id="h-ia">${t.ia.h2}</h2>
      <p class="lead">${t.ia.lead}</p>
      <p class="nota-pixel"><span class="pixel" aria-hidden="true"></span>${t.ia.nota}</p>
      <p>${enlace(t.ia.enlace)}</p>
    </div>
  </div>
</section>

<section class="acto acto--finance" id="finance" data-acto="5" aria-labelledby="h-finance">
  <div class="marco acto-in">
    <div class="acto-texto">
      <p class="acto-n"><span>${num(5)}</span>${f.etiqueta}</p>
      <h2 class="h2" id="h-finance">${f.h2}</h2>
      <p class="lead">${f.lead}</p>
      <div class="fz" data-fz data-fz-idioma="${lang}">
        <div class="fz-acc">
          <label class="fz-importe"><span>${f.base}</span><span class="fz-caja"><input type="text" inputmode="decimal" autocomplete="off" spellcheck="false" maxlength="10" value="${lang === "en" ? "1,240.00" : "1.240,00"}" data-fz-base aria-describedby="fz-ayuda"><i aria-hidden="true">€</i></span></label>
          <button type="button" class="boton boton--principal" data-fz-pasar>${f.boton} ${FLECHA}</button><button type="button" class="enlace" data-fz-otra hidden>${f.otra}</button>
        </div>
        <p class="peq fz-ayuda" id="fz-ayuda">${f.ayuda}</p>
        <div class="fz-registro" aria-live="polite">
          <p class="rotulo">${f.registro}</p>
          <dl class="fz-campos">${f.campos.map(([k, n, v]) => `<div data-fz-campo="${k}"><dt>${n}</dt><dd><span>${v}</span></dd></div>`).join("")}</dl>
          <p class="fz-vacio" data-fz-vacio>${f.vacio}</p>
          <p class="fz-hecho" data-fz-hecho hidden><span class="pixel" aria-hidden="true"></span>${f.hecho}</p>
          <p class="fz-hecho" data-fz-accion hidden><span class="pixel" aria-hidden="true"></span>${f.accion}</p>
        </div>
        <div class="fz-preguntas" data-fz-preguntas hidden>
          <p class="rotulo">${f.pregunta}</p>
          <div class="fz-botones">${f.preguntas.map(([q, a], i) => `<button type="button" class="fz-q" data-fz-q="${i}" data-fz-plantilla="${a.replace(/"/g, "&quot;")}" data-fz-r="${fmt(a, val).replace(/"/g, "&quot;")}">${q}</button>`).join("")}</div>
          <p class="fz-respuesta" data-fz-respuesta aria-live="polite"></p>
        </div>
      </div>
      <p class="nota peq">${f.aviso}</p>
      <ul class="acto-mas" role="list"><li>${enlace(f.enlace)}</li><li><button type="button" class="enlace" data-demo-abrir="finance">${f.demo} ${FLECHA}</button></li></ul>
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
      <div class="tuyo" data-tuyo>
        <label class="tuyo-nombre"><span class="rotulo">${t.tuyo.nombre}</span><input type="text" name="empresa" maxlength="26" autocomplete="organization" spellcheck="false" placeholder="${t.tuyo.marcador}" data-tuyo-nombre></label>
        <fieldset class="tuyo-piezas"><legend class="rotulo">${t.tuyo.piezas}</legend><div>${t.tuyo.opciones.map((o, i) => `<label><input type="checkbox" value="${o}" data-tuyo-pieza="${i}"><span>${o}</span></label>`).join("")}</div></fieldset>
        <div class="acc"><a class="boton boton--principal" href="${p}/contacto" data-tuyo-cta>${t.tuyo.cta} ${FLECHA}</a></div>
        <p class="peq tuyo-privado">${t.tuyo.privado}</p>
      </div>
      <ul class="fin-mas" role="list">${t.tuyo.mas.map(([h, x]) => `<li><a class="enlace" href="${h}">${x}</a></li>`).join("")}</ul>
      <p class="tuyo-web">${t.tuyo.web} ${enlace(t.tuyo.webEnlace)}</p>
    </div>
  </div>
</section>
</main>`;
}

for (const lang of ["es", "en"]) {
  const rel = lang === "en" ? "en/index.html" : "index.html";
  let s = fs.readFileSync(path.join(RAIZ, rel), "utf8");
  const i = s.indexOf("<main"), j = s.indexOf("</main>") + 7;
  const frag = {
    tocalo: fs.readFileSync(path.join(FRAG, `${lang}-tocalo.html`), "utf8").replace('<section class="bloque bloque--aire tocalo" id="tocalo"', '<section class="acto acto--demos bloque tocalo" id="tocalo" data-acto="7"').replace(/ aparece"/g, '"').replace(/class="h2 aparece"/, 'class="h2"'),
    productos: fs.readFileSync(path.join(FRAG, `${lang}-productos.html`), "utf8").replace(/class="aparece" style="--i:\d"/g, "").replace(/ aparece"/g, '"').replace(/<p class="aparece">/g, "<p>"),
  };
  s = s.slice(0, i) + principal(lang, frag) + s.slice(j);
  // hoja de estilos y código de la portada
  s = s.replace(/\/assets\/v2\/mundo\.css\?v=[0-9a-f]+/g, "/assets/v2/maquina.css?v=0000000000");
  if (!s.includes("/assets/v2/maquina.css")) s = s.replace(/(<link rel="stylesheet" href="\/assets\/v2\/inicio\.css\?v=[0-9a-f]+">)/, '$1\n<link rel="stylesheet" href="/assets/v2/maquina.css?v=0000000000">');
  if (!s.includes("/assets/v2/js/portada.js")) s = s.replace(/(<script type="module" src="\/assets\/v2\/js\/inicio\.js\?v=[0-9a-f]+"><\/script>)/, '$1\n<script type="module" src="/assets/v2/js/portada.js?v=0000000000"></script>');
  s = s.replace(/<html([^>]*)class="([^"]*)"/, (m, a, c) => `<html${a}class="${["es-maquina", ...c.split(/\s+/).filter((x) => x && x !== "es-mundo" && x !== "es-maquina")].join(" ")}"`);
  fs.writeFileSync(path.join(RAIZ, rel), s);
  console.log(`portada: ${rel} (${(principal(lang, frag).length / 1024).toFixed(1)} KB de <main>)`);
}
