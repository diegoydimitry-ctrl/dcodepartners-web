#!/usr/bin/env node
/* ==========================================================================
   PORTADA «EL BANCO DE TRABAJO» · genera el <main> de index.html y en/index.html
   --------------------------------------------------------------------------
   La portada es una sola escena fotografiada (imágenes hechas con trazado de
   rayos, scripts/v7/escena.py) que se recorre con el scroll: un teléfono, una
   tableta con las tareas, una factura y un portátil, cada uno por su lado, que
   encajan en una base y pasan a compartir los mismos datos
   (assets/v2/img/escena/). Encima va el contenido de verdad, en HTML: lo
   que lee Google y lo que lee un lector de pantalla está aquí, no en el
   lienzo. Cada <section class="acto"> es un capítulo (data-acto = su número
   en el motor).

   La cabecera, el pie y el asistente de cada página no se tocan. Las demos y
   la lista de productos se conservan tal cual (scripts/v7/fragmentos/).
   Uso: node scripts/v7/portada.mjs
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const FRAG = path.join(RAIZ, "scripts/v7/fragmentos");
const FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
const IDS = ["inicio", "hoy", "sistema", "automatizacion", "inteligencia", "finance", "resultado", "tocalo", "hablemos"];

const T = {
  es: {
    p: "",
    hero: { marca: "D-Code Partners", h1: ["Sistemas inteligentes", "para empresas."], lead: "Tu empresa ya tiene el teléfono, las tareas, las facturas y los programas. Nosotros los conectamos para que trabajen como un solo sistema, con automatización e inteligencia artificial.", cta: "Reservar una llamada", cta2: "Ver cómo funciona", pista: "Desliza para conectarlo", carga: "Cargando la escena" },
    indice: "Capítulos", ejemplo: "Lo que se ve en las pantallas es un ejemplo con datos inventados.",
    actos: ["Inicio", "Hoy", "El sistema", "La automatización", "La inteligencia", "D-Code Finance", "El resultado", "Pruébalo", "El tuyo"],
    hoy: {
      h2: "Hoy cada herramienta de tu empresa trabaja por su cuenta.",
      lead: "El teléfono, la lista de tareas, la hoja de cálculo y la factura funcionan, pero no se hablan entre sí. Alguien tiene que pasar los datos de un sitio a otro.",
      sueltas: ["En el teléfono hay tres mensajes sin responder.", "En la lista, tres tareas siguen sin asignar.", "La factura del proveedor está sin registrar.", "Alguien la está tecleando a mano en una hoja de cálculo."],
      mano: "Mantén pulsado y mira cómo se conectan", manoTactil: "Mantén el dedo y mira cómo se conectan",
    },
    sistema: {
      h2: "Nosotros las conectamos en un solo sistema.",
      lead: "Cada cosa tiene su sitio y todas comparten los mismos datos. Lo que entra por una llega a las demás sin que nadie lo copie.",
      elige: "Elige una parte para verla de cerca",
      areas: [
        ["Todo", "Son cuatro partes sobre una misma base. Elige una para ver qué cambia en ella.", "/que-hacemos", "Ver todo lo que hacemos", ""],
        ["Personas", "Cada persona recibe en su teléfono el aviso que le toca, en el momento en que ocurre.", "/que-hacemos", "Ver las áreas de la empresa", "personas"],
        ["Procesos", "Cada tarea empieza cuando termina la anterior y queda apuntada sin que nadie la marque.", "/servicios/automatizaciones", "Ver las automatizaciones", "procesos"],
        ["Herramientas", "Los programas que ya usas se conectan entre sí y dejan de ser islas.", "/servicios/integraciones", "Ver las integraciones", "herramientas"],
        ["Datos", "Cada dato se registra una sola vez y queda disponible para todos los demás.", "/servicios/sistemas-a-medida", "Ver los sistemas a medida", "datos"],
      ],
      todas: "Ver todas", mas: [["/servicios/integraciones", "Integraciones"], ["/servicios/sistemas-a-medida", "Sistemas a medida"], ["/que-hacemos", "Todas las áreas"]],
    },
    auto: { h2: "Lo que se repite cada semana se hace solo.", lead: "Entra la factura y, sin que nadie haga nada, las tres tareas pasan a hechas y el teléfono avisa a quien corresponde. Los recordatorios, los informes y los avisos salen también cuando la oficina está cerrada.", hora: "", pie: "", enlace: ["/servicios/automatizaciones", "Ver las automatizaciones"] },
    ia: { h2: "Y además entiende lo que le das.", lead: "Los agentes de IA leen cada documento y cada mensaje que entra, sacan los datos y responden con la información de tu empresa. Las decisiones importantes las sigue tomando una persona.", enlace: ["/servicios/agentes-de-ia", "Ver los agentes de IA"], nota: "La línea azul está leyendo una factura de ejemplo." },
    finance: {
      etiqueta: "D-Code Finance", h2: "Finance lee tus facturas y te responde con tus números.",
      lead: "Pásale una factura: la lee, la registra, programa el pago y avisa a dirección. Después puedes preguntarle por tus pagos, tus cobros y tu tesorería.",
      base: "Base imponible de la factura", ayuda: "Cambia la cifra y pruébalo con la tuya. El registro aparece en la pantalla del portátil.",
      boton: "Pasar la factura por Finance", otra: "Repetir", registro: "Registro de la factura", vacio: "Todavía no hay nada registrado.", hecho: "Factura registrada. Nadie la ha tecleado.", accion: "Pago programado para el 28/10/2026 y aviso enviado a dirección.",
      campos: [["prov", "Proveedor", "Suministros Arce, S.L."], ["num", "Número", "F-2026/0412"], ["fecha", "Fecha", "28/09/2026"], ["base", "Base imponible", "1.240,00 €"], ["iva", "IVA 21 %", "260,40 €"], ["total", "Total", "1.500,40 €"], ["vence", "Vencimiento", "28/10/2026"]],
      pregunta: "Ahora pregúntale", preguntas: [["¿Qué pagos vencen en octubre?", "Uno: {total} a Suministros Arce, S.L., el 28 de octubre."], ["¿Cuánto IVA lleva esta factura?", "{iva}, el 21 % sobre una base de {base}."]],
      aviso: "Es un ejemplo con datos inventados. La lectura de facturas y las preguntas están en Finance con inteligencia.",
      enlace: ["/sistema-financiero", "Ver D-Code Finance"], demo: "Abrir la demo completa",
    },
    resultado: { h2: "Lo complejo queda dentro. Tú ves lo que importa.", lead: "Al terminar, tu empresa funciona como un solo sistema: cada dato entra una vez, cada tarea tiene su sitio y tú miras una sola pantalla.", instalamos: "Esto es lo que instalamos", garantias: [["/garantias", "Alcance y precio por escrito antes de empezar"], ["/garantias", "Sin permanencia"], ["/casos-exito", "Lo usamos antes en nuestra propia empresa"]] },
    tuyo: {
      h2: "¿Qué construimos para ti?", lead: "Escribe el nombre de tu empresa y míralo en la placa de la base. Marca lo que hoy no encaja y en una llamada de treinta minutos te decimos cómo lo conectaríamos.",
      nombre: "El nombre de tu empresa", marcador: "Tu empresa", piezas: "¿Qué es lo que hoy no encaja?", opciones: ["Ventas", "Atención al cliente", "Operaciones", "Facturación y cobros", "Informes para dirección"],
      cta: "Reservar una llamada", privado: "Lo que escribas aquí solo se usa para rellenar el formulario de contacto.",
      mas: [["/metodo", "Cómo trabajamos"], ["/que-hacemos", "Todo lo que hacemos"], ["/garantias", "Garantías"], ["/diagnostico", "Diagnóstico gratuito"]], web: "Esta web también la hemos construido nosotros.", webEnlace: ["/servicios/paginas-web", "Queremos una así"],
      grabado: "CONECTADO PARA",
    },
  },
  en: {
    p: "/en",
    hero: { marca: "D-Code Partners", h1: ["Intelligent systems", "for companies."], lead: "Your company already has the phone, the tasks, the invoices and the programs. We connect them so they work as one system, with automation and artificial intelligence.", cta: "Book a call", cta2: "See how it works", pista: "Scroll to connect it", carga: "Loading the scene" },
    indice: "Chapters", ejemplo: "What you see on the screens is an example with invented data.",
    actos: ["Start", "Today", "The system", "The automation", "The intelligence", "D-Code Finance", "The result", "Try it", "Yours"],
    hoy: {
      h2: "Today every tool in your company works on its own.",
      lead: "The phone, the task list, the spreadsheet and the invoice all work, but they do not talk to each other. Someone has to move the data from one place to another.",
      sueltas: ["There are three unanswered messages on the phone.", "Three tasks on the list are still unassigned.", "The supplier's invoice has not been recorded.", "Someone is typing it by hand into a spreadsheet."],
      mano: "Press and hold to see them connect", manoTactil: "Touch and hold to see them connect",
    },
    sistema: {
      h2: "We connect them into one system.",
      lead: "Everything has its place and they all share the same data. What comes in through one reaches the others without anyone copying it.",
      elige: "Pick a part to see it up close",
      areas: [
        ["All", "Four parts on a single base. Pick one to see what changes in it.", "/en/que-hacemos", "See everything we do", ""],
        ["People", "Each person gets the alert meant for them on their phone, the moment it happens.", "/en/que-hacemos", "See the company areas", "personas"],
        ["Processes", "Each task starts when the previous one ends and is ticked off without anyone marking it.", "/en/servicios/automatizaciones", "See the automations", "procesos"],
        ["Tools", "The programs you already use connect to each other and stop being islands.", "/en/servicios/integraciones", "See the integrations", "herramientas"],
        ["Data", "Each piece of data is recorded once and stays available to everyone else.", "/en/servicios/sistemas-a-medida", "See the custom systems", "datos"],
      ],
      todas: "See all", mas: [["/en/servicios/integraciones", "Integrations"], ["/en/servicios/sistemas-a-medida", "Custom systems"], ["/en/que-hacemos", "All areas"]],
    },
    auto: { h2: "What repeats every week runs on its own.", lead: "The invoice comes in and, without anyone doing anything, the three tasks move to done and the phone alerts whoever needs to know. Reminders, reports and alerts also go out when the office is closed.", hora: "", pie: "", enlace: ["/en/servicios/automatizaciones", "See the automations"] },
    ia: { h2: "And it understands what you give it.", lead: "AI agents read every document and every message that comes in, extract the data and reply with your company's information. The important decisions are still made by a person.", enlace: ["/en/servicios/agentes-de-ia", "See the AI agents"], nota: "The blue line is reading a sample invoice." },
    finance: {
      etiqueta: "D-Code Finance", h2: "Finance reads your invoices and answers with your numbers.",
      lead: "Hand it an invoice: it reads it, records it, schedules the payment and notifies management. Then you can ask about your payments, your collections and your cash flow.",
      base: "Net amount of the invoice", ayuda: "Change the figure and try it with your own. The record appears on the laptop screen.",
      boton: "Run the invoice through Finance", otra: "Repeat", registro: "Invoice record", vacio: "Nothing has been recorded yet.", hecho: "Invoice recorded. Nobody typed it in.", accion: "Payment scheduled for 28/10/2026 and management notified.",
      campos: [["prov", "Supplier", "Suministros Arce, S.L."], ["num", "Number", "F-2026/0412"], ["fecha", "Date", "28/09/2026"], ["base", "Net amount", "€1,240.00"], ["iva", "VAT 21%", "€260.40"], ["total", "Total", "€1,500.40"], ["vence", "Due date", "28/10/2026"]],
      pregunta: "Now ask it", preguntas: [["Which payments are due in October?", "One: {total} to Suministros Arce, S.L., on 28 October."], ["How much VAT is on this invoice?", "{iva}, 21% on a net amount of {base}."]],
      aviso: "This is an example with invented data. Invoice reading and questions are part of Finance with intelligence.",
      enlace: ["/en/sistema-financiero", "See D-Code Finance"], demo: "Open the full demo",
    },
    resultado: { h2: "The complexity stays inside. You see what matters.", lead: "When we finish, your company runs as one system: every piece of data comes in once, every task has its place and you look at a single screen.", instalamos: "This is what we install", garantias: [["/en/garantias", "Scope and price in writing before we start"], ["/en/garantias", "No lock-in"], ["/en/casos-exito", "We ran it in our own company first"]] },
    tuyo: {
      h2: "What shall we build for you?", lead: "Type your company's name and see it on the plate of the base. Tick what does not fit today and on a thirty-minute call we will tell you how we would connect it.",
      nombre: "Your company's name", marcador: "Your company", piezas: "What does not fit today?", opciones: ["Sales", "Customer service", "Operations", "Invoicing and collections", "Reports for management"],
      cta: "Book a call", privado: "What you type here is only used to fill in the contact form.",
      mas: [["/en/metodo", "How we work"], ["/en/que-hacemos", "Everything we do"], ["/en/garantias", "Guarantees"], ["/en/diagnostico", "Free assessment"]], web: "We built this website too.", webEnlace: ["/en/servicios/paginas-web", "We want one like it"],
      grabado: "CONNECTED FOR",
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
<div class="maq-escena" aria-hidden="true"><div class="esc-plano" data-esc-plano><canvas class="maq-lienzo" data-maq-lienzo></canvas>
  <div class="esc-sobre esc-sobre--pantalla" data-sobre="pantalla"><div class="esc-fz"><p class="esc-fz-t">${f.registro}</p><dl>${f.campos.map(([k, n, v]) => `<div data-esc-campo="${k}"><dt>${n}</dt><dd>${v}</dd></div>`).join("")}</dl><p class="esc-fz-h" data-esc-hecho><span></span>${f.hecho}</p><p class="esc-fz-h" data-esc-accion><span></span>${f.accion}</p></div></div>
  <div class="esc-foco" data-esc-foco></div>
  <div class="esc-sobre esc-sobre--chapa" data-sobre="chapa"><p><small data-esc-rotulo>${t.tuyo.grabado}</small><b data-esc-nombre>${t.tuyo.marcador.toUpperCase()}</b></p></div>
</div><div class="maq-velo"></div><p class="maq-carga" data-maq-carga><span class="pixel"></span>${t.hero.carga}</p></div>
<nav class="maq-tira" aria-label="${t.indice}"><ol role="list">${t.actos.map((a, i) => `<li><a href="#${IDS[i]}" data-indice="${i}"><span>${num(i)}</span><b>${a}</b></a></li>`).join("")}</ol></nav>

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
      <ul class="sueltas" role="list">${t.hoy.sueltas.map((d) => `<li><span>${d}</span></li>`).join("")}</ul>
      <p class="nota peq">${t.ejemplo}</p>
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
    <ol class="modulos" role="list" aria-hidden="true" data-modulos>${t.sistema.areas.filter((a) => a[4]).map((a, i) => `<li data-modulo-i="${a[4]}"><button type="button" tabindex="-1" data-modulo-b="${i + 1}"><i></i>${a[0]}</button></li>`).join("")}</ol>
  </div>
</section>

<section class="acto acto--auto" id="automatizacion" data-acto="3" aria-labelledby="h-auto">
  <div class="marco acto-in">
    <div class="acto-texto">
      ${cab(3, t.actos[3])}
      <h2 class="h2" id="h-auto">${t.auto.h2}</h2>
      <p class="lead">${t.auto.lead}</p>
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
  s = s.replace(/<link rel="stylesheet" href="\/assets\/v2\/salto\.css\?v=[0-9a-f]+">\n?/g, "").replace(/\/assets\/v2\/(mundo|maquina|sistema)\.css\?v=[0-9a-f]+/g, "/assets/v2/escena.css?v=0000000000");
  if (!s.includes("/assets/v2/escena.css")) s = s.replace(/(<link rel="stylesheet" href="\/assets\/v2\/inicio\.css\?v=[0-9a-f]+">)/, '$1\n<link rel="stylesheet" href="/assets/v2/escena.css?v=0000000000">');
  if (!s.includes("/assets/v2/js/portada.js")) s = s.replace(/(<script type="module" src="\/assets\/v2\/js\/inicio\.js\?v=[0-9a-f]+"><\/script>)/, '$1\n<script type="module" src="/assets/v2/js/portada.js?v=0000000000"></script>');
  // la primera fotografía se pide desde el principio (la de escritorio o la del móvil, según la pantalla)
  s = s.replace(/<link rel="preload" as="image" href="\/assets\/v2\/img\/(maquina|sistema|escena)\/[^>]+>\n?/g, "");
  s = s.replace("</head>", `<link rel="preload" as="image" href="/assets/v2/img/escena/h-0.webp?v=0000000000" type="image/webp" media="(min-width: 861px) and (min-aspect-ratio: 21/20)" fetchpriority="high">\n<link rel="preload" as="image" href="/assets/v2/img/escena/v-0.webp?v=0000000000" type="image/webp" media="(max-width: 860px), (max-aspect-ratio: 21/20)" fetchpriority="high">\n</head>`);
  s = s.replace(/<html([^>]*)class="([^"]*)"/, (m, a, c) => `<html${a}class="${["es-escena", ...c.split(/\s+/).filter((x) => x && !["es-mundo", "es-maquina", "es-salto", "es-sistema", "es-escena"].includes(x))].join(" ")}"`);
  fs.writeFileSync(path.join(RAIZ, rel), s);
  console.log(`portada: ${rel} (${(principal(lang, frag).length / 1024).toFixed(1)} KB de <main>)`);
}
