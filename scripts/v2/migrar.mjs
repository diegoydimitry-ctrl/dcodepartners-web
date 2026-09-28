#!/usr/bin/env node
/* ==========================================================================
   MIGRACIÓN DE PÁGINAS INTERIORES AL SISTEMA NUEVO
   --------------------------------------------------------------------------
   Toma cada página tal como estaba en producción (commit de partida de la
   rama) y conserva TODO su contenido —títulos, textos, listas, tablas,
   preguntas, enlaces, datos estructurados, meta— pero lo vuelve a componer
   con el sistema blanco y negro: sin las once hojas de estilo antiguas, sin
   decoración, con la tipografía y el ritmo nuevos.
   Nada de texto se inventa ni se reescribe aquí.
   Uso: node scripts/v2/migrar.mjs [ruta.html ...]   (sin argumentos: todas)
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { parse } from "node-html-parser";
import { pagina, FLECHA } from "./plantilla.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const BASE = "8ff5f5b";
const viejo = (f) => execSync(`git -C "${RAIZ}" show ${BASE}:${f}`, { encoding: "utf8", maxBuffer: 1 << 26 });

export const MIGRADAS = [
  "metodo.html", "garantias.html", "seguridad.html", "conocenos.html", "casos-exito.html", "cambios-en-proceso.html", "faq.html",
  "privacidad.html", "aviso-legal.html", "cookies.html", "condiciones-contratacion.html", "acuerdo-encargado-tratamiento.html",
  "blog/index.html", "blog/automatizacion-vs-agentes-ia.html", "blog/procesos-que-puedes-automatizar-ya.html", "blog/que-es-la-automatizacion-con-ia.html",
  "departamentos/administracion.html", "departamentos/clientes.html", "departamentos/comercial.html", "departamentos/direccion.html",
  "departamentos/finanzas.html", "departamentos/marketing.html", "departamentos/produccion.html", "departamentos/soporte.html",
  "que-hacemos.html", "servicios/agentes-de-ia.html", "servicios/automatizaciones.html", "servicios/integraciones.html", "servicios/paginas-web.html", "servicios/sistemas-a-medida.html",
  "sistema-financiero.html", "404.html",
];

/* Títulos que describen la página real (lo que hace cada una), no «Sección — Marca». */
const TITULOS = {
  "departamentos/administracion.html": ["Automatizar la administración de tu empresa: documentos, plazos y avisos | D-Code", "Automating company administration: documents, deadlines and alerts | D-Code"],
  "departamentos/clientes.html": ["Atención al cliente automatizada con IA y seguimiento | D-Code Partners", "Automated customer care with AI and follow-up | D-Code Partners"],
  "departamentos/comercial.html": ["CRM y seguimiento comercial automatizado para empresas | D-Code", "CRM and automated sales follow-up for companies | D-Code"],
  "departamentos/direccion.html": ["Panel de dirección con datos reales de tu empresa | D-Code Partners", "Management dashboard with your company's real data | D-Code"],
  "departamentos/finanzas.html": ["Automatizar facturación, cobros y gastos en tu empresa | D-Code", "Automating invoicing, collections and expenses | D-Code Partners"],
  "departamentos/marketing.html": ["Captación de leads automatizada desde tu web y anuncios | D-Code", "Automated lead capture from your website and ads | D-Code"],
  "departamentos/produccion.html": ["Automatizar operaciones: trabajos, partes y plazos | D-Code", "Automating operations: jobs, work orders and deadlines | D-Code"],
  "departamentos/soporte.html": ["Soporte automatizado con IA, también fuera de horario | D-Code", "Automated AI support, also out of hours | D-Code Partners"],
  "servicios/agentes-de-ia.html": ["Agentes de IA y chatbots con los datos de tu negocio | D-Code", "AI agents and chatbots on your business data | D-Code Partners"],
  "servicios/automatizaciones.html": ["Automatización de procesos para empresas | D-Code Partners", "Business process automation for companies | D-Code Partners"],
  "servicios/integraciones.html": ["Integraciones entre tus herramientas: CRM, ERP, correo | D-Code", "Integrations between your tools: CRM, ERP, email | D-Code"],
  "servicios/paginas-web.html": ["Páginas web conectadas con tus sistemas | D-Code Partners", "Websites connected to your systems | D-Code Partners"],
  "servicios/sistemas-a-medida.html": ["Software y sistemas a medida para empresas | D-Code Partners", "Custom software and systems for companies | D-Code Partners"],
  "que-hacemos.html": ["Qué hacemos: automatización, IA, integraciones y software | D-Code", "What we build: automation, AI, integrations and software | D-Code"],
  "sistema-financiero.html": ["D-Code Finance | Software de facturación y cobros con IA", "D-Code Finance | Invoicing and collections software with AI"],
  "cambios-en-proceso.html": ["Qué estamos construyendo ahora | D-Code Partners", "What we are building right now | D-Code Partners"],
  "casos-exito.html": ["Casos internos: los sistemas que usamos en D-Code Partners", "In-house cases: the systems we use at D-Code Partners"],
};
const LEGAL = /privacidad|aviso-legal|cookies|condiciones|acuerdo-encargado|seguridad/;

/* ---------------------------------------------------------------- limpieza */
const INLINE = new Set(["a", "b", "strong", "em", "i", "code", "br", "small", "abbr", "time", "sup", "sub", "kbd", "mark", "u", "s"]);
const esc = (s) => s.replace(/&(?![a-z#0-9]+;)/gi, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function inline(n) {
  if (n.nodeType === 3) return n.rawText;
  if (n.nodeType !== 1) return "";
  const t = n.rawTagName?.toLowerCase();
  if (!t || ["svg", "script", "style", "button", "noscript", "template", "canvas", "img", "picture", "video", "iframe", "input", "select", "textarea"].includes(t)) return "";
  if (n.getAttribute?.("aria-hidden") === "true") return "";
  // Dos elementos seguidos sin espacio entre ellos eran celdas de un diseño (spans en rejilla):
  // al pasarlos a texto corrido se pegaban («AltaF-2026-0140Anterior…»). Se separan con un espacio.
  let dentro = "";
  n.childNodes.forEach((c, i) => {
    const ant = n.childNodes[i - 1];
    if (i && c.nodeType === 1 && ant?.nodeType === 1 && !/^(br)$/i.test(c.rawTagName) && !/^(br)$/i.test(ant.rawTagName)) dentro += " ";
    dentro += inline(c);
  });
  if (t === "br") return "<br>";
  if (t === "span" && n.getAttribute("data-precio") !== undefined) {
    const k = n.getAttribute("data-precio");
    return `<span data-precio="${k}"${n.getAttribute("data-precio-detalle") !== undefined ? " data-precio-detalle" : ""}>${dentro}</span>`;
  }
  if (!INLINE.has(t)) return dentro;
  if (t === "a") {
    const href = reescribir(n.getAttribute("href") || "#");
    const ext = /^https?:/.test(href) && !href.includes("dcodepartners.com");
    return `<a href="${href.replace(/"/g, "&quot;")}"${ext ? ' rel="noopener" target="_blank"' : ""}>${dentro}</a>`;
  }
  if (t === "i" || t === "em") return `<em>${dentro}</em>`;
  if (t === "b" || t === "strong") return `<strong>${dentro}</strong>`;
  return `<${t}>${dentro}</${t}>`;
}
/* Anclas de la portada anterior que ya no existen: se mandan a su sitio nuevo. */
export const reescribir = (h) => h.replace(/^(\/en)?\/#sistemas(-[a-z]+)?$/, (m, en) => (en || "") + "/#tocalo").replace(/^(\/en)?\/#diagnostico$/, (m, en) => (en || "") + "/diagnostico").replace(/^(\/en)?\/#(dcode-os|que-hacemos|proceso|confianza|que-puedes-tener|contacto|problema|inicio)$/, (m, en, k) => (en || "") + ({ "dcode-os": "/#tocalo", "que-hacemos": "/que-hacemos", proceso: "/metodo", confianza: "/garantias", "que-puedes-tener": "/precios", contacto: "/contacto", problema: "/", inicio: "/" })[k]);
const limpio = (n) => inline(n).replace(/\s+/g, " ").trim();
const texto = (n) => esc((n.text || "").replace(/\s+/g, " ").trim());
const clases = (n) => (n.getAttribute?.("class") || "").split(/\s+/);
const tiene = (n, re) => clases(n).some((c) => re.test(c));

/* ------------------------------------------------------ lectura en bloques
   Recorre el <main> antiguo y produce una lista plana de bloques con tipo. */
function bloques(main) {
  const out = [];
  const hijos = (n) => n.childNodes.filter((c) => c.nodeType === 1 || (c.nodeType === 3 && c.rawText.trim()));
  function tabla(n) {
    // Las marcas de «incluido / no incluido» eran iconos (role="img" + aria-label): se conservan como marca accesible.
    const celda = (c) => {
      const h = limpio(c); if (h) return h;
      const ic = c.querySelector('[role="img"][aria-label]'); if (!ic) return "";
      const lab = ic.getAttribute("aria-label"); const no = /^no\b|not /i.test(lab);
      return `<span class="t-${no ? "no" : "si"}" role="img" aria-label="${esc(lab)}"></span>`;
    };
    const filas = n.querySelectorAll("tr").map((tr) => tr.childNodes.filter((c) => c.nodeType === 1 && /t[hd]/i.test(c.rawTagName)).map((c) => ({ th: /th/i.test(c.rawTagName), h: celda(c) })));
    // Cabecera (primera fila toda de th): en el teléfono cada fila se lee como una ficha con su etiqueta.
    const cab = filas[0]?.every((c) => c.th) ? filas[0].map((c) => c.h.replace(/<[^>]+>/g, "").trim()) : null;
    const varias = cab && cab.length >= 3;
    return `<div class="tabla${varias ? " tabla--fichas" : ""}"><table>${filas.map((f, i) => `<tr${varias && i === 0 ? ' class="t-cab"' : ""}>${f.map((c, k) => `<${c.th ? "th" : "td"}${varias && i > 0 && k > 0 ? ` data-l="${esc(cab[k] || "")}"` : ""}>${c.h}</${c.th ? "th" : "td"}>`).join("")}</tr>`).join("")}</table></div>`;
  }
  const celdas = (li) => li.childNodes.filter((c) => c.nodeType === 1 && c.getAttribute("aria-hidden") !== "true");
  const sinTexto = (li) => !li.childNodes.some((c) => c.nodeType === 3 && c.rawText.trim());
  function estructurada(n) {
    const lis = n.childNodes.filter((c) => c.nodeType === 1 && c.rawTagName.toLowerCase() === "li");
    // una lista de tarjetas-enlace (áreas, servicios…): cada una, fila enlazada con su título y su frase
    if (lis.length >= 2 && lis.every((li) => sinTexto(li) && celdas(li).length === 1 && celdas(li)[0].rawTagName.toLowerCase() === "a" && celdas(li)[0].childNodes.filter((c) => c.nodeType === 1).length >= 2)) {
      return { tipo: "enlaces", items: lis.map((li) => { const a = celdas(li)[0]; const cs = a.childNodes.filter((c) => c.nodeType === 1 && !/^(svg|i)$/i.test(c.rawTagName) && !/^(ver|see)\b/i.test(c.text.trim()));
        return { href: reescribir(a.getAttribute("href") || "#"), t: texto(cs[0]), d: cs.slice(1).map(texto).join(" ") }; }) };
    }
    if (lis.length < 2 || !lis.every((li) => sinTexto(li) && celdas(li).length >= 2 && celdas(li).every((c) => /^(span|b|strong|em|i|code|small|time|p)$/i.test(c.rawTagName)))) return null;
    const cl = clases(n).join(" ");
    // la cadena de registros de VERI*FACTU: tipo, número, huella anterior y huella propia
    if (/vf-eslabones/.test(cl)) return { tipo: "cadena", items: lis.map((li) => ({ tipo: texto(li.querySelector(".vf-e-tipo")), anula: tiene(li.querySelector(".vf-e-tipo"), /es-anula/), num: texto(li.querySelector(".vf-e-num")), h: li.querySelectorAll(".vf-e-h").map((h) => ({ k: texto(h.querySelector("em")), v: texto(h.querySelector("code")) })) })) };
    // una hoja de ruta por pasos: número, título, descripción y estado
    if (/vf-track/.test(cl)) return { tipo: "ruta", items: lis.map((li) => ({ n: texto(li.querySelector(".vf-paso-n")), t: texto(li.querySelector(".vf-paso-t")), d: texto(li.querySelector(".vf-paso-d")), e: texto(li.querySelector(".vf-paso-e")), actual: tiene(li, /es-actual/) })) };
    // título (b) y descripción (span): una lista de puntos; si el título lleva número delante, se separa
    if (lis.every((li) => /^(b|strong)$/i.test(celdas(li)[0].rawTagName))) return { tipo: "puntos", ord: n.rawTagName.toLowerCase() === "ol", items: lis.map((li) => {
      const [b, ...r] = celdas(li); const num = b.childNodes.find((c) => c.nodeType === 1 && /^\d+$/.test(c.text.trim()));
      return { n: num ? num.text.trim() : "", t: esc(b.childNodes.filter((c) => c !== num).map((c) => c.text).join("").replace(/\s+/g, " ").trim()), d: r.map(limpio).join(" ") };
    }) };
    // registros con varias celdas (movimientos de un extracto…): una tabla
    return { tipo: "html", h: `<div class="tabla tabla--registros" tabindex="0"><table>${lis.map((li) => `<tr>${celdas(li).map((c) => `<td>${limpio(c)}</td>`).join("")}</tr>`).join("")}</table></div>` };
  }
  function lista(n, ord) {
    const lis = n.childNodes.filter((c) => c.nodeType === 1 && c.rawTagName.toLowerCase() === "li");
    const items = lis.map((li) => {
      const sub = li.querySelector("ul, ol");
      const txt = limpio(parse(li.toString().replace(sub ? sub.toString() : "\u0000", "")).firstChild);
      return `<li>${txt}${sub ? lista(sub, sub.rawTagName.toLowerCase() === "ol") : ""}</li>`;
    }).filter((x) => x !== "<li></li>");
    if (!items.length) return "";
    return `<${ord ? "ol" : "ul"}>${items.join("")}</${ord ? "ol" : "ul"}>`;
  }
  function visitar(n, ctx = {}) {
    if (n.nodeType === 3) { const t = n.rawText.trim(); if (t && ctx.suelto) out.push({ tipo: "p", h: esc(t) }); return; }
    if (n.nodeType !== 1) return;
    const t = n.rawTagName.toLowerCase();
    if (["script", "style", "svg", "noscript", "template", "canvas", "button", "form", "dialog", "iframe", "video"].includes(t)) return;
    if (n.getAttribute("aria-hidden") === "true" && !/^h[1-4]$/.test(t)) return;
    // el id de una sección antigua (#planes, #verifactu…): se conserva como ancla en el título que la abre
    const idSec = n.getAttribute("id");
    if (idSec && /^(section|article|div|aside)$/.test(t) && !/^(contenido|main|hoja|plano|chat)/.test(idSec)) out.push({ tipo: "ancla", id: idSec });
    if (tiene(n, /^(breadcrumbs?|sr-only|visually-hidden|skip)/) && t !== "h1" && t !== "h2") { if (tiene(n, /breadcrumb/)) out.push({ tipo: "migas", items: n.querySelectorAll("li a, li[aria-current]").map((a) => ({ href: a.getAttribute("href"), t: texto(a) })) }); return; }
    if (tiene(n, /^(eyebrow|kicker|v6-kicker|ph-kicker|tag|overline)$/)) { const x = limpio(n); if (x) out.push({ tipo: "etiqueta", h: x }); return; }
    if (tiene(n, /^(badge|trust-badge|ph-prueba-badge)$/)) return;
    if (tiene(n, /^vf-col-t$/)) { const x = limpio(n); if (x) out.push({ tipo: "h3", h: x }); return; }
    if (/^h[1-4]$/.test(t)) { const x = limpio(n); if (x) out.push({ tipo: t, h: x, id: n.getAttribute("id") }); return; }
    if (t === "p") { const x = limpio(n); if (x) out.push({ tipo: tiene(n, /lead|intro|sub/) ? "lead" : "p", h: x }); return; }
    if (t === "ul" || t === "ol") { const e = estructurada(n); if (e) { out.push(e); return; } const x = lista(n, t === "ol"); if (x) out.push({ tipo: "lista", h: x }); return; }
    if (t === "table") { out.push({ tipo: "html", h: tabla(n) }); return; }
    if (t === "blockquote") { out.push({ tipo: "cita", h: limpio(n) }); return; }
    if (t === "dl") { out.push({ tipo: "html", h: `<dl class="dl">${n.childNodes.filter((c) => c.nodeType === 1).map((c) => `<${c.rawTagName.toLowerCase()}>${limpio(c)}</${c.rawTagName.toLowerCase()}>`).join("")}</dl>` }); return; }
    if (t === "details") {
      const s = n.querySelector("summary"); const q = s ? limpio(s) : "";
      const resto = parse(n.innerHTML.replace(s ? s.toString() : "\u0000", ""));
      const sub = []; const guarda = out.length;
      hijos(resto).forEach((c) => visitar(c, { suelto: true }));
      const cuerpo = out.splice(guarda).map(pintar).join("");
      out.push({ tipo: "pregunta", q, h: cuerpo });
      return;
    }
    if (t === "a" && tiene(n, /^(btn|button|cta)/)) {
      const x = texto(n); if (!x) return;
      const ult = out[out.length - 1], b = { href: reescribir(n.getAttribute("href") || "#"), t: x };
      if (ult && ult.tipo === "botones") ult.lista.push(b); else out.push({ tipo: "botones", lista: [b] });
      return;
    }
    if (t === "a" && !ctx.enTexto) {
      // una tarjeta-enlace: su título y su texto, como fila enlazada
      const tit = n.querySelector("h2, h3, h4, strong, b"); const x = texto(n);
      if (tit && x) { const tt = texto(tit); out.push({ tipo: "enlace", href: reescribir(n.getAttribute("href") || "#"), t: tt, d: x.replace(tt, "").trim() }); return; }
      if (x) { out.push({ tipo: "enlace", href: reescribir(n.getAttribute("href") || "#"), t: x, d: "" }); return; }
      return;
    }
    if (t === "img") { const src = n.getAttribute("src"); const alt = n.getAttribute("alt"); if (src && alt) out.push({ tipo: "img", src, alt, w: n.getAttribute("width"), h: n.getAttribute("height"), retrato: /fundador|founder|equipo|team|retrato|eje-foto|sineriz|sosenko/i.test(src + " " + clases(n).join(" ")) }); return; }
    // acordeón de preguntas: la pregunta y su respuesta, como <details> accesible
    if (tiene(n, /^(accordion-item|faq-item)$/)) {
      const q = n.querySelector(".accordion-title, .faq-q, summary, button");
      const r = n.querySelector(".accordion-panel, .faq-a") || n;
      const guarda = out.length;
      if (r.childNodes.some((c) => c.nodeType === 3 && c.rawText.trim())) out.push({ tipo: "p", h: limpio(r) });
      else hijos(r).forEach((c) => visitar(c, { suelto: true }));
      const cuerpo = out.splice(guarda).map(pintar).join("");
      out.push({ tipo: "pregunta", q: q ? texto(q) : "", h: cuerpo, id: n.getAttribute("id") });
      return;
    }
    // un contenedor con texto suelto y solo elementos en línea: es un párrafo
    const soloLinea = n.childNodes.every((c) => c.nodeType === 3 || (c.nodeType === 1 && (INLINE.has(c.rawTagName.toLowerCase()) || c.rawTagName.toLowerCase() === "span")));
    if (soloLinea && n.childNodes.some((c) => c.nodeType === 3 && c.rawText.trim())) { const x = limpio(n); if (x) out.push({ tipo: "p", h: x }); return; }
    // un elemento compuesto por un título corto (b/strong) y su texto: un «punto»
    const c = hijos(n);
    const primero = c[0];
    if (c.length >= 2 && primero?.nodeType === 1 && /^(b|strong)$/i.test(primero.rawTagName) && c.slice(1).every((x) => x.nodeType === 3 || /^(span|p|ul|ol|small|em|i|div)$/i.test(x.rawTagName))) {
      const titulo = limpio(primero);
      const resto = c.slice(1).map((x) => (x.nodeType === 3 ? esc(x.rawText.trim()) : /^(ul|ol)$/i.test(x.rawTagName) ? lista(x, /ol/i.test(x.rawTagName)) : limpio(x))).filter(Boolean).join(" ");
      out.push({ tipo: "punto", t: titulo, h: resto });
      return;
    }
    c.forEach((x) => visitar(x, ctx));
  }
  hijos(main).forEach((x) => visitar(x));
  return out;
}

function pintar(b) {
  if (b.tipo === "ancla") return `<span class="ancla" id="${b.id}"></span>`;
  switch (b.tipo) {
    case "h2": return `<h2 class="h2"${b.id ? ` id="${b.id}"` : ""}>${b.h}</h2>`;
    case "h3": return `<h3 class="h3"${b.id ? ` id="${b.id}"` : ""}>${b.h}</h3>`;
    case "h4": return `<h4 class="h4">${b.h}</h4>`;
    case "etiqueta": return `<p class="etiqueta">${b.h}</p>`;
    case "lead": return `<p class="lead">${b.h}</p>`;
    case "p": return /^(Listo|En proceso|Próximamente|Proximamente|Ready|Done|In progress|Coming soon|Live|Operativo)$/i.test(b.h.trim()) ? `<p class="estado estado--${/^(listo|ready|done|live|operativo)$/i.test(b.h.trim()) ? "si" : "no"}">${b.h}</p>` : `<p>${b.h}</p>`;
    case "lista": return b.h;
    case "html": return b.h;
    case "cita": return `<blockquote>${b.h}</blockquote>`;
    case "enlaces": return `<div class="enlaces">${b.items.map((x) => pintar({ tipo: "enlace", ...x })).join("")}</div>`;
    case "cadena": return `<figure class="cadena"><ol class="cadena-l">${b.items.map((it, i) => `<li class="eslabon${it.anula ? " eslabon--anula" : ""}" style="--i:${i}"><span class="eslabon-tipo">${it.tipo}</span><strong class="eslabon-num">${it.num}</strong><dl class="eslabon-h">${it.h.map((h, j) => `<div${j ? ' class="es-propia"' : ""}><dt>${h.k}</dt><dd><code>${h.v}</code></dd></div>`).join("")}</dl></li>`).join("")}</ol></figure>`;
    case "ruta": return `<ol class="ruta">${b.items.map((it) => `<li class="ruta-p${it.actual ? " es-actual" : ""}"${it.actual ? ' aria-current="step"' : ""}><span class="ruta-n">${it.n}</span><span class="ruta-e">${it.e}</span><p class="ruta-t">${it.t}</p><p class="ruta-d">${it.d}</p></li>`).join("")}</ol>`;
    case "puntos": return `<${b.ord ? "ol" : "ul"} class="puntos-l">${b.items.map((it) => `<li>${it.n ? `<span class="pl-n">${it.n}</span>` : ""}<p class="pl-t">${it.t}</p>${it.d ? `<p class="pl-d">${it.d}</p>` : ""}</li>`).join("")}</${b.ord ? "ol" : "ul"}>`;
    case "punto": return `<div class="punto"><p class="punto-t">${b.t}</p>${b.h ? `<div class="punto-d">${b.h}</div>` : ""}</div>`;
    case "pregunta": {
      // Un plan («01 <strong>Finance</strong> Descripción larga…»): el número, el nombre y la primera frase arriba; el
      // resto dentro. Sin esto el resumen era una fila de tres columnas estrujadas en el teléfono.
      const m = /^(\d{2})\s*(<strong>[\s\S]*?<\/strong>)\s*([\s\S]*)$/.exec(b.q);
      if (m) {
        const corte = m[3].search(/\.\s/); const primera = corte > 0 ? m[3].slice(0, corte + 1) : m[3]; const resto = corte > 0 ? m[3].slice(corte + 1).trim() : "";
        return `<details class="pregunta pregunta--plan"${b.id ? ` id="${b.id}"` : ""}><summary><span class="pq-n">${m[1]}</span><span class="pq-t">${m[2]}<span class="pq-d">${primera}</span></span></summary><div class="pregunta-r">${resto ? `<p>${resto}</p>` : ""}${b.h}</div></details>`;
      }
      return `<details class="pregunta"${b.id ? ` id="${b.id}"` : ""}><summary><span class="pq-t">${b.q}</span></summary><div class="pregunta-r">${b.h}</div></details>`;
    }
    case "enlace": return `<a class="fila-enlace" href="${b.href}"><span class="fe-t">${b.t}</span>${b.d ? `<span class="fe-d">${b.d}</span>` : ""}${FLECHA}</a>`;
    case "botones": return `<div class="acc">${b.lista.map((x, i) => `<a class="boton${i === 0 ? " boton--principal" : ""}" href="${x.href}">${x.t}${i === 0 ? " " + FLECHA : ""}</a>`).join("")}</div>`;
    case "img": return `<figure class="figura${b.retrato ? " figura--retrato" : ""}"><img src="${b.src}" alt="${b.alt}"${b.w ? ` width="${b.w}"` : ""}${b.h ? ` height="${b.h}"` : ""} loading="lazy" decoding="async"></figure>`;
    default: return "";
  }
}

/* Tres o más «puntos» seguidos (título + texto) se leen mejor como rejilla que como columna. */
function agrupar(bs) {
  const out = []; let grupo = [];
  const cierra = () => { if (grupo.length >= 3) out.push(`<div class="puntos">${grupo.map(pintar).join("")}</div>`); else grupo.forEach((b) => out.push(pintar(b))); grupo = []; };
  for (let i = 0; i < bs.length; i++) {
    const b = bs[i];
    // «01» suelto y, detrás, su título: un paso numerado
    if (b.tipo === "p" && /^\d{1,2}$/.test(b.h.trim()) && bs[i + 1] && /^h[34]$/.test(bs[i + 1].tipo)) { cierra(); out.push(`<div class="paso"><span class="paso-n">${b.h.trim()}</span>${pintar(bs[i + 1])}</div>`); i++; continue; }
    if (b.tipo === "punto") grupo.push(b); else { cierra(); out.push(pintar(b)); }
  }
  cierra(); return out.join("\n");
}

/* ---------------------------------------------------------- composición
   Cabecera de página (migas, etiqueta, h1, entradilla, botones) y, después,
   un capítulo por cada h2: título a la izquierda, contenido a la derecha. */
function componer(bs, { lectura }) {
  const vistos = new Set(bs.filter((b) => b.id && b.tipo !== "ancla").map((b) => b.id));
  for (let i = 0; i < bs.length; i++) {
    if (bs[i].tipo !== "ancla" || bs[i].fija) continue;
    const id = bs[i].id;
    if (vistos.has(id)) { bs.splice(i--, 1); continue; }
    vistos.add(id);
    const j = bs.findIndex((x, k) => k > i && k <= i + 4 && /^h[23]$/.test(x.tipo));
    if (j < 0 || bs.slice(i + 1, j).some((x) => x.tipo === "ancla" || x.tipo === "h1")) continue;
    if (!bs[j].id) { bs[j].id = id; bs.splice(i--, 1); continue; }
    // el título ya tiene id: el ancla va al principio del cuerpo de ese capítulo (tras el título y su entradilla)
    const [a] = bs.splice(i, 1); a.fija = true; const tras = bs[j] && bs[j].tipo === "lead" ? j + 1 : j; bs.splice(tras, 0, a); i--;
  }
  const i1 = bs.findIndex((b) => b.tipo === "h1");
  const antes = i1 >= 0 ? bs.slice(0, i1) : [];
  const migas = antes.find((b) => b.tipo === "migas") || bs.find((b) => b.tipo === "migas");
  const etiqueta = [...antes].reverse().find((b) => b.tipo === "etiqueta");
  let k = i1 + 1; const cab = [];
  while (k < bs.length && ["lead", "p", "botones", "etiqueta"].includes(bs[k].tipo) && cab.length < 4) { if (bs[k].tipo !== "etiqueta") cab.push(bs[k]); k++; }
  const h1 = i1 >= 0 ? bs[i1].h : "";
  const cuerpo = bs.slice(Math.max(k, 0)).filter((b) => b.tipo !== "migas");
  // jerarquía: ningún h3 antes del primer h2 (no se salta de h1 a h3)
  for (const b of cuerpo) { if (b.tipo === "h2") break; if (b.tipo === "h3") b.tipo = "h2"; }
  // capítulos por h2
  const caps = []; let actual = { cab: [], cuerpo: [] };
  for (let i = 0; i < cuerpo.length; i++) {
    const b = cuerpo[i];
    if (b.tipo === "etiqueta" && cuerpo[i + 1]?.tipo === "h2") { if (actual.cab.length || actual.cuerpo.length) caps.push(actual); actual = { cab: [b], cuerpo: [] }; continue; }
    if (b.tipo === "h2") { if (actual.cab.some((x) => x.tipo === "h2") || actual.cuerpo.length) { caps.push(actual); actual = { cab: [], cuerpo: [] }; } actual.cab.push(b); if (cuerpo[i + 1]?.tipo === "lead") { actual.cab.push(cuerpo[++i]); } continue; }
    actual.cuerpo.push(b);
  }
  if (actual.cab.length || actual.cuerpo.length) caps.push(actual);
  const migasHtml = migas && migas.items.filter((m) => m.href).length ? `<nav class="migas" aria-label="Ruta"><ol role="list">${migas.items.map((m, i) => (m.href ? `<li><a href="${m.href}">${m.t}</a></li>` : `<li aria-current="page">${m.t}</li>`)).join("")}</ol></nav>` : "";
  const cabHtml = `<header class="pag-cab">
  <div class="marco">
    ${migasHtml}
    ${etiqueta ? `<p class="etiqueta aparece">${etiqueta.h}</p>` : ""}
    <h1 class="h1 aparece" style="--i:1">${h1}</h1>
    ${cab.map((b, i) => `<div class="aparece" style="--i:${i + 2}">${pintar(b.tipo === "p" && i === 0 ? { ...b, tipo: "lead" } : b)}</div>`).join("\n    ")}
  </div>
</header>`;
  let num = 0;
  const capsHtml = caps.map((c) => {
    const tieneCab = c.cab.length > 0;
    const n = tieneCab && !lectura && c.cuerpo.length ? String(++num).padStart(2, "0") : "";
    return `<section class="capitulo${lectura ? " capitulo--lectura" : ""}${tieneCab ? "" : " capitulo--suelto"}">
  <div class="marco capitulo-in">
    ${tieneCab ? `<div class="capitulo-cab">${n ? `<p class="cap-num" aria-hidden="true">${n}</p>` : ""}${c.cab.map(pintar).join("")}</div>` : ""}
    <div class="capitulo-cuerpo prosa">${agrupar(c.cuerpo)}</div>
  </div>
</section>`;
  }).join("\n");
  return cabHtml + "\n" + capsHtml;
}

/* ------------------------------------------------------------------ head */
function meta(doc) {
  const m = (sel, attr = "content") => doc.querySelector(sel)?.getAttribute(attr) || "";
  return {
    titulo: (doc.querySelector("title")?.text || "").trim(),
    descripcion: m('meta[name="description"]'),
    noindex: /noindex/.test(m('meta[name="robots"]')),
    jsonld: doc.querySelectorAll('script[type="application/ld+json"]').map((s) => { try { return JSON.parse(s.text); } catch { return null; } }).filter(Boolean),
    imagen: (m('meta[property="og:image"]') || "").replace("https://dcodepartners.com", "") || undefined,
  };
}

export function migrar(rel) {
  const res = [];
  for (const lang of ["es", "en"]) {
    const archivo = (lang === "en" ? "en/" : "") + rel;
    let html; try { html = viejo(archivo); } catch { continue; }
    const doc = parse(html, { comment: false });
    let main = doc.querySelector("main");
    if (!main) { // página sin <main>: el cuerpo, pero sin la cabecera ni el pie antiguos (ya los pone la plantilla)
      main = doc.querySelector("body") || doc;
      main.querySelectorAll("body > header, body > footer, body > nav, .site-header, .site-footer, footer, .cookie-banner, [class*=chat]").forEach((x) => x.remove());
    }
    const bs = bloques(main);
    const ruta = "/" + (lang === "en" ? "en/" : "") + rel.replace(/(index)?\.html$/, "").replace(/\/$/, "");
    const m = meta(doc);
    if (TITULOS[rel]) m.titulo = TITULOS[rel][lang === "en" ? 1 : 0];
    const lectura = LEGAL.test(rel) || rel.startsWith("blog/") && rel !== "blog/index.html";
    const p = { lang, ruta: ruta === "/en/" ? "/en" : ruta.replace(/\/$/, "") || "/", ...m, css: ["/assets/v2/interior.css"], claseBody: lectura ? "es-lectura" : "" };
    if (rel === "404.html") { p.ruta = lang === "en" ? "/en/404" : "/404"; p.noindex = true; p.sinEn = false; }
    fs.writeFileSync(path.join(RAIZ, archivo), pagina(p, componer(bs, { lectura })));
    res.push(archivo);
  }
  return res;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const lista = process.argv.slice(2).length ? process.argv.slice(2) : MIGRADAS;
  for (const r of lista) console.log("  " + migrar(r).join("  "));
}
