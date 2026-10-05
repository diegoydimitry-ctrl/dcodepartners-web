#!/usr/bin/env node
/* ==========================================================================
   PORTADA «EL CONJUNTO» · genera el <main> de index.html y en/index.html
   --------------------------------------------------------------------------
   La portada son cinco escenas fotografiadas (imágenes hechas con trazado de
   rayos, scripts/v8/escenas.py) que se recorren con el scroll, y cada una
   explica una sola cosa:
     · cuatro placas que se alinean y dejan pasar la luz: las personas, los
       procesos, los datos y las herramientas de una empresa (inicio, el
       resultado y el final, con el nombre de quien visita grabado);
     · cuatro cabos distintos que se trenzan en un cable: hoy y el sistema;
     · una fila de piezas que cae sola: la automatización;
     · un líquido sin forma que toma una forma exacta: la inteligencia;
     · una llave cuyos cuatro dientes encajan en una cerradura: Finance.
   Encima va el contenido de verdad, en HTML: lo que lee Google y lo que lee
   un lector de pantalla está aquí, no en el lienzo. Cada <section
   class="acto"> es un capítulo (data-acto = su número en el motor) y cada
   cosa de la imagen lleva su nombre escrito (los rótulos).

   La cabecera, el pie y el asistente de cada página no se tocan. Las demos y
   la lista de productos se conservan tal cual (scripts/v8/fragmentos/).
   Uso: node scripts/v8/portada.mjs
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const FRAG = path.join(RAIZ, "scripts/v8/fragmentos");
const DATOS = JSON.parse(fs.readFileSync(path.join(RAIZ, "scripts/v8/datos.json"), "utf8"));
const FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
const IDS = ["inicio", "hoy", "sistema", "automatizacion", "inteligencia", "finance", "resultado", "tocalo", "hablemos"];
const NOCHE = DATOS.noche;   // los actos de la escena oscura (las placas)

const T = {
  es: {
    p: "",
    hero: { marca: "D-Code Partners", h1: ["Sistemas inteligentes", "para empresas."], lead: "Cada placa es una parte de tu empresa: las personas, los procesos, los datos y las herramientas. Nosotros las alineamos con automatización e inteligencia artificial para que el trabajo pase de una a otra sin detenerse.", cta: "Reservar una llamada", cta2: "Ver cómo lo hacemos", pista: "Desliza para ver cómo lo hacemos", carga: "Cargando la escena" },
    indice: "Capítulos",
    actos: ["Inicio", "Hoy", "El sistema", "La automatización", "La inteligencia", "D-Code Finance", "El resultado", "Pruébalo", "El tuyo"],
    partes: [["personas", "Personas"], ["procesos", "Procesos"], ["datos", "Datos"], ["herramientas", "Herramientas"]],
    rot: {
      2: [["sistema", "Un solo sistema"]],
      3: [["entra", "1 · Entra una factura"], ["registra", "2 · Se registra"], ["programa", "3 · Se programa el pago"], ["avisa", "4 · Se avisa a dirección"]],
      4: [["entra", "Correos, PDF y mensajes"], ["iman", "El agente de IA"], ["sale", "Datos exactos"]],
      5: [["proveedor", "Proveedor"], ["importe", "Importe"], ["iva", "IVA"], ["vencimiento", "Vencimiento"]],
    },
    hoy: {
      h2: "Hoy cada parte de tu empresa va por su lado.",
      lead: "Las personas, los procesos, los datos y las herramientas funcionan, pero cada uno tira hacia un sitio, como estos cuatro cabos. Para que la información pase de uno a otro, alguien tiene que llevarla a mano.",
      sueltas: ["Un pedido se apunta en un programa y se vuelve a teclear en otro.", "Una factura espera en un correo hasta que alguien la ve.", "El informe del mes se monta a mano con datos de tres sitios."],
    },
    sistema: {
      h2: "Nosotros las unimos en un solo sistema.",
      lead: "Trenzados, los cuatro cabos forman un cable que aguanta lo que ninguno aguantaría solo. En tu empresa eso significa que cada dato entra una vez y llega a todos los que lo necesitan.",
      elige: "Elige un cabo para ver qué cambia en esa parte",
      areas: [
        ["Todo", "Son cuatro cabos distintos dentro de un mismo cable. Elige uno para ver qué cambia en esa parte de la empresa.", "/que-hacemos", "Ver todo lo que hacemos", ""],
        ["Personas", "Es el cabo de algodón. Cada persona recibe el aviso que le toca en el momento en que ocurre.", "/que-hacemos", "Ver las áreas de la empresa", "personas"],
        ["Procesos", "Es el cabo negro. Cada tarea empieza cuando termina la anterior y queda apuntada sin que nadie la marque.", "/servicios/automatizaciones", "Ver las automatizaciones", "procesos"],
        ["Datos", "Es la fibra azul. Cada dato se registra una sola vez y queda disponible para todos los demás.", "/servicios/sistemas-a-medida", "Ver los sistemas a medida", "datos"],
        ["Herramientas", "Es el cable de acero. Los programas que ya usas se conectan entre sí y dejan de ser islas.", "/servicios/integraciones", "Ver las integraciones", "herramientas"],
      ],
      mas: [["/servicios/integraciones", "Integraciones"], ["/servicios/sistemas-a-medida", "Sistemas a medida"], ["/que-hacemos", "Todas las áreas"]],
    },
    auto: { h2: "Lo que se repite cada semana se hace solo.", lead: "Basta con que ocurra lo primero. Entra una factura y, sin que nadie haga nada, se registra, se programa el pago y se avisa a dirección: cada paso empuja al siguiente, como las piezas de esta fila.", nota: "Los recordatorios, los informes y los avisos salen también cuando la oficina está cerrada.", enlace: ["/servicios/automatizaciones", "Ver las automatizaciones"] },
    ia: { h2: "Y además entiende lo que le das.", lead: "Los correos, los PDF y los mensajes llegan cada uno a su manera, como este líquido sin forma. Los agentes de IA los leen, sacan los datos y los devuelven siempre con la misma forma exacta.", nota: "Las decisiones importantes las sigue tomando una persona.", enlace: ["/servicios/agentes-de-ia", "Ver los agentes de IA"] },
    finance: {
      etiqueta: "D-Code Finance", h2: "Finance lee tus facturas y te responde con tus números.",
      lead: "Cada pasador de esta cerradura es un dato de la factura: el proveedor, el importe, el IVA y el vencimiento. Pásale una factura: Finance la lee, la registra, programa el pago y avisa a dirección. Después puedes preguntarle por tus pagos, tus cobros y tu tesorería.",
      base: "Base imponible de la factura", ayuda: "Cambia la cifra y pruébalo con la tuya. La llave entra, los cuatro datos encajan y la factura queda registrada.",
      boton: "Pasar la factura por Finance", otra: "Repetir", registro: "Registro de la factura", vacio: "Todavía no hay nada registrado.", hecho: "Factura registrada. Nadie la ha tecleado.", accion: "Pago programado para el 28/10/2026 y aviso enviado a dirección.",
      campos: [["prov", "Proveedor", "Suministros Arce, S.L."], ["num", "Número", "F-2026/0412"], ["fecha", "Fecha", "28/09/2026"], ["base", "Base imponible", "1.240,00 €"], ["iva", "IVA 21 %", "260,40 €"], ["total", "Total", "1.500,40 €"], ["vence", "Vencimiento", "28/10/2026"]],
      pregunta: "Ahora pregúntale", preguntas: [["¿Qué pagos vencen en octubre?", "Uno: {total} a Suministros Arce, S.L., el 28 de octubre."], ["¿Cuánto IVA lleva esta factura?", "{iva}, el 21 % sobre una base de {base}."]],
      aviso: "Es un ejemplo con datos inventados. La lectura de facturas y las preguntas están en Finance con inteligencia.",
      enlace: ["/sistema-financiero", "Ver D-Code Finance"], demo: "Abrir la demo completa",
    },
    resultado: { h2: "Lo complejo queda dentro. Tú ves lo que importa.", lead: "Con las cuatro partes alineadas, el trabajo pasa de una a otra como esta luz: cada dato entra una vez, cada tarea tiene su sitio y tú miras una sola pantalla.", instalamos: "Esto es lo que instalamos", garantias: [["/garantias", "Alcance y precio por escrito antes de empezar"], ["/garantias", "Sin permanencia"], ["/casos-exito", "Lo usamos antes en nuestra propia empresa"]] },
    tuyo: {
      h2: "¿Qué alineamos en tu empresa?", lead: "Escribe el nombre de tu empresa y míralo grabado en la primera placa. Marca lo que hoy no encaja y en una llamada de treinta minutos te decimos cómo lo conectaríamos.",
      nombre: "El nombre de tu empresa", marcador: "Tu empresa", piezas: "¿Qué es lo que hoy no encaja?", opciones: ["Ventas", "Atención al cliente", "Operaciones", "Facturación y cobros", "Informes para dirección"],
      cta: "Reservar una llamada", privado: "Lo que escribas aquí solo se usa para rellenar el formulario de contacto.",
      mas: [["/metodo", "Cómo trabajamos"], ["/que-hacemos", "Todo lo que hacemos"], ["/garantias", "Garantías"], ["/diagnostico", "Diagnóstico gratuito"]], web: "Esta web también la hemos construido nosotros.", webEnlace: ["/servicios/paginas-web", "Queremos una así"],
      grabado: "ALINEADO PARA",
    },
  },
  en: {
    p: "/en",
    hero: { marca: "D-Code Partners", h1: ["Intelligent systems", "for companies."], lead: "Each plate is a part of your company: people, processes, data and tools. We line them up with automation and artificial intelligence so that work passes from one to the next without stopping.", cta: "Book a call", cta2: "See how we do it", pista: "Scroll to see how we do it", carga: "Loading the scene" },
    indice: "Chapters",
    actos: ["Start", "Today", "The system", "The automation", "The intelligence", "D-Code Finance", "The result", "Try it", "Yours"],
    partes: [["personas", "People"], ["procesos", "Processes"], ["datos", "Data"], ["herramientas", "Tools"]],
    rot: {
      2: [["sistema", "One system"]],
      3: [["entra", "1 · An invoice comes in"], ["registra", "2 · It is recorded"], ["programa", "3 · The payment is scheduled"], ["avisa", "4 · Management is notified"]],
      4: [["entra", "Emails, PDFs and messages"], ["iman", "The AI agent"], ["sale", "Exact data"]],
      5: [["proveedor", "Supplier"], ["importe", "Amount"], ["iva", "VAT"], ["vencimiento", "Due date"]],
    },
    hoy: {
      h2: "Today every part of your company goes its own way.",
      lead: "People, processes, data and tools all work, but each one pulls in its own direction, like these four strands. For information to get from one to another, someone has to carry it by hand.",
      sueltas: ["An order is entered in one program and typed again into another.", "An invoice waits in an email until someone sees it.", "The monthly report is put together by hand with data from three places."],
    },
    sistema: {
      h2: "We bring them together into one system.",
      lead: "Braided, the four strands make a cable that holds what none of them would hold alone. In your company that means every piece of data comes in once and reaches everyone who needs it.",
      elige: "Pick a strand to see what changes in that part",
      areas: [
        ["All", "Four different strands inside one cable. Pick one to see what changes in that part of the company.", "/en/que-hacemos", "See everything we do", ""],
        ["People", "This is the cotton strand. Each person gets the alert meant for them the moment it happens.", "/en/que-hacemos", "See the company areas", "personas"],
        ["Processes", "This is the black strand. Each task starts when the previous one ends and is logged without anyone ticking it off.", "/en/servicios/automatizaciones", "See the automations", "procesos"],
        ["Data", "This is the blue fibre. Each piece of data is recorded once and stays available to everyone else.", "/en/servicios/sistemas-a-medida", "See the custom systems", "datos"],
        ["Tools", "This is the steel cable. The programs you already use connect to each other and stop being islands.", "/en/servicios/integraciones", "See the integrations", "herramientas"],
      ],
      mas: [["/en/servicios/integraciones", "Integrations"], ["/en/servicios/sistemas-a-medida", "Custom systems"], ["/en/que-hacemos", "All areas"]],
    },
    auto: { h2: "What repeats every week runs on its own.", lead: "All it takes is for the first thing to happen. An invoice comes in and, without anyone doing anything, it is recorded, the payment is scheduled and management is notified: each step pushes the next, like the pieces in this row.", nota: "Reminders, reports and alerts also go out when the office is closed.", enlace: ["/en/servicios/automatizaciones", "See the automations"] },
    ia: { h2: "And it understands what you give it.", lead: "Emails, PDFs and messages each arrive in their own way, like this shapeless liquid. AI agents read them, extract the data and always return it in the same exact shape.", nota: "The important decisions are still made by a person.", enlace: ["/en/servicios/agentes-de-ia", "See the AI agents"] },
    finance: {
      etiqueta: "D-Code Finance", h2: "Finance reads your invoices and answers with your numbers.",
      lead: "Each pin in this lock is one piece of data on the invoice: the supplier, the amount, the VAT and the due date. Hand it an invoice: Finance reads it, records it, schedules the payment and notifies management. Then you can ask about your payments, your collections and your cash flow.",
      base: "Net amount of the invoice", ayuda: "Change the figure and try it with your own. The key goes in, the four pieces of data fit and the invoice is recorded.",
      boton: "Run the invoice through Finance", otra: "Repeat", registro: "Invoice record", vacio: "Nothing has been recorded yet.", hecho: "Invoice recorded. Nobody typed it in.", accion: "Payment scheduled for 28/10/2026 and management notified.",
      campos: [["prov", "Supplier", "Suministros Arce, S.L."], ["num", "Number", "F-2026/0412"], ["fecha", "Date", "28/09/2026"], ["base", "Net amount", "€1,240.00"], ["iva", "VAT 21%", "€260.40"], ["total", "Total", "€1,500.40"], ["vence", "Due date", "28/10/2026"]],
      pregunta: "Now ask it", preguntas: [["Which payments are due in October?", "One: {total} to Suministros Arce, S.L., on 28 October."], ["How much VAT is on this invoice?", "{iva}, 21% on a net amount of {base}."]],
      aviso: "This is an example with invented data. Invoice reading and questions are part of Finance with intelligence.",
      enlace: ["/en/sistema-financiero", "See D-Code Finance"], demo: "Open the full demo",
    },
    resultado: { h2: "The complexity stays inside. You see what matters.", lead: "With the four parts lined up, work passes from one to the next like this light: every piece of data comes in once, every task has its place and you look at a single screen.", instalamos: "This is what we install", garantias: [["/en/garantias", "Scope and price in writing before we start"], ["/en/garantias", "No lock-in"], ["/en/casos-exito", "We ran it in our own company first"]] },
    tuyo: {
      h2: "What shall we line up in your company?", lead: "Type your company's name and see it engraved on the first plate. Tick what does not fit today and on a thirty-minute call we will tell you how we would connect it.",
      nombre: "Your company's name", marcador: "Your company", piezas: "What does not fit today?", opciones: ["Sales", "Customer service", "Operations", "Invoicing and collections", "Reports for management"],
      cta: "Book a call", privado: "What you type here is only used to fill in the contact form.",
      mas: [["/en/metodo", "How we work"], ["/en/que-hacemos", "Everything we do"], ["/en/garantias", "Guarantees"], ["/en/diagnostico", "Free assessment"]], web: "We built this website too.", webEnlace: ["/en/servicios/paginas-web", "We want one like it"],
      grabado: "LINED UP FOR",
    },
  },
};

const num = (n) => String(n).padStart(2, "0");
const cab = (n, nombre) => `<p class="acto-n"><span>${num(n)}</span>${nombre}</p>`;
const enlace = ([href, t], clase = "enlace") => `<a class="${clase}" href="${href}">${t} ${FLECHA}</a>`;
const fmt = (s, f) => s.replace(/\{(\w+)\}/g, (_, k) => f[k]);
// cada acto lleva el tono de su fotografía (para el velo de detrás del texto) y, si es de la escena oscura, su clase
const acto = (n, clase, id, h) => `<section class="acto ${clase}${NOCHE.includes(n) ? " acto--noche" : ""}" id="${id}" data-acto="${n}" aria-labelledby="${h}" style="--tono: ${DATOS.tono[n].join(", ")}">`;

function principal(lang, frag) {
  const t = T[lang], p = t.p, f = t.finance, val = Object.fromEntries(f.campos.map(([k, , v]) => [k, v]));
  // los rótulos: el nombre de cada cosa de la fotografía, escrito encima de ella
  const rot = { 0: t.partes, 1: t.partes, 2: [...t.partes, ...t.rot[2]], 3: t.rot[3], 4: t.rot[4], 5: t.rot[5] };
  const rotulos = Object.entries(rot).map(([a, ls]) => ls.map(([k, x], i) => `<li data-rot="${a}:${k}" class="rot-${a} rot-i${i}${NOCHE.includes(+a) ? " es-noche" : ""}" style="--i:${i}"><span><i></i>${x}</span></li>`).join("")).join("\n    ");
  return `<main id="contenido" class="maq" data-maq>
<div class="maq-escena" aria-hidden="true"><div class="esc-plano" data-esc-plano><canvas class="maq-lienzo" data-maq-lienzo></canvas>
  <div class="esc-sobre esc-sobre--placa" data-sobre="placa"><p><small>${t.tuyo.grabado}</small><b data-esc-nombre>${t.tuyo.marcador.toUpperCase()}</b></p></div>
  <ol class="esc-rotulos" role="list" data-rotulos>
    ${rotulos}
  </ol>
</div><div class="maq-velo"></div><p class="maq-carga" data-maq-carga><span class="pixel"></span>${t.hero.carga}</p></div>
<nav class="maq-tira" aria-label="${t.indice}"><ol role="list">${t.actos.map((a, i) => `<li><a href="#${IDS[i]}" data-indice="${i}"><span>${num(i)}</span><b>${a}</b></a></li>`).join("")}</ol></nav>

${acto(0, "acto--claro", "inicio", "h-inicio")}
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

${acto(1, "acto--hoy", "hoy", "h-hoy")}
  <div class="marco acto-in">
    <div class="acto-texto">
      ${cab(1, t.actos[1])}
      <h2 class="h2" id="h-hoy">${t.hoy.h2}</h2>
      <p class="lead">${t.hoy.lead}</p>
      <ul class="sueltas" role="list">${t.hoy.sueltas.map((d) => `<li><span>${d}</span></li>`).join("")}</ul>
    </div>
  </div>
</section>

${acto(2, "acto--sistema", "sistema", "h-sistema")}
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
  </div>
</section>

${acto(3, "acto--auto", "automatizacion", "h-auto")}
  <div class="marco acto-in">
    <div class="acto-texto">
      ${cab(3, t.actos[3])}
      <h2 class="h2" id="h-auto">${t.auto.h2}</h2>
      <p class="lead">${t.auto.lead}</p>
      <p class="nota-pixel"><span class="pixel" aria-hidden="true"></span>${t.auto.nota}</p>
      <p>${enlace(t.auto.enlace)}</p>
    </div>
  </div>
</section>

${acto(4, "acto--ia", "inteligencia", "h-ia")}
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

${acto(5, "acto--finance", "finance", "h-finance")}
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

${acto(6, "acto--resultado productos", "resultado", "h-resultado")}
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

${acto(8, "acto--tuyo fin", "hablemos", "h-fin")}
  <div class="marco acto-in">
    <div class="acto-texto">
      ${cab(8, t.actos[8])}
      <h2 class="display" id="h-fin">${t.tuyo.h2}</h2>
      <p class="lead">${t.tuyo.lead}</p>
      <div class="tuyo" data-tuyo>
        <label class="tuyo-nombre"><span class="rotulo">${t.tuyo.nombre}</span><input type="text" name="empresa" maxlength="22" autocomplete="organization" spellcheck="false" placeholder="${t.tuyo.marcador}" data-tuyo-nombre></label>
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
    tocalo: fs.readFileSync(path.join(FRAG, `${lang}-tocalo.html`), "utf8").replace('<section class="bloque bloque--aire tocalo" id="tocalo"', `<section class="acto acto--demos acto--noche bloque tocalo" id="tocalo" data-acto="7" style="--tono: ${DATOS.tono[7].join(", ")}"`).replace(/ aparece"/g, '"').replace(/class="h2 aparece"/, 'class="h2"'),
    productos: fs.readFileSync(path.join(FRAG, `${lang}-productos.html`), "utf8").replace(/class="aparece" style="--i:\d"/g, "").replace(/ aparece"/g, '"').replace(/<p class="aparece">/g, "<p>"),
  };
  s = s.slice(0, i) + principal(lang, frag) + s.slice(j);
  // hoja de estilos y código de la portada
  if (!s.includes("/assets/v2/escena.css")) s = s.replace(/(<link rel="stylesheet" href="\/assets\/v2\/inicio\.css\?v=[0-9a-f]+">)/, '$1\n<link rel="stylesheet" href="/assets/v2/escena.css?v=0000000000">');
  if (!s.includes("/assets/v2/js/portada.js")) s = s.replace(/(<script type="module" src="\/assets\/v2\/js\/inicio\.js\?v=[0-9a-f]+"><\/script>)/, '$1\n<script type="module" src="/assets/v2/js/portada.js?v=0000000000"></script>');
  // la primera fotografía se pide desde el principio (es la misma para el ordenador y para el móvil)
  s = s.replace(/<link rel="preload" as="image" href="\/assets\/v2\/img\/(maquina|sistema|escena)\/[^>]+>\n?/g, "");
  s = s.replace("</head>", `<link rel="preload" as="image" href="/assets/v2/img/escena/h-0.webp?v=0000000000" type="image/webp" fetchpriority="high">\n</head>`);
  // la portada abre de noche (las placas): la cabecera nace ya con el texto claro y el código la cambia según el acto
  s = s.replace(/<html([^>]*)class="([^"]*)"/, (m, a, c) => `<html${a}class="${["es-escena", "esc-noche", ...c.split(/\s+/).filter((x) => x && !["es-mundo", "es-maquina", "es-salto", "es-sistema", "es-escena", "esc-noche"].includes(x))].join(" ")}"`);
  fs.writeFileSync(path.join(RAIZ, rel), s);
  console.log(`portada: ${rel} (${(principal(lang, frag).length / 1024).toFixed(1)} KB de <main>)`);
}
