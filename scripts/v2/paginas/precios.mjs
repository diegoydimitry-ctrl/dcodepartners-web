/* PRECIOS (ES / EN) — sale entero de catalogo.json, la fuente única comercial.
   Aquí no se escribe ni un importe: se leen. Cambiar un precio en el catálogo
   lo cambia aquí al reconstruir. */
import fs from "node:fs";
import { FLECHA } from "../plantilla.mjs";

const CAT = JSON.parse(fs.readFileSync(new URL("../../../catalogo.json", import.meta.url), "utf8"));
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const T = {
  es: { titulo: "Precios: automatización, IA y software a medida | D-Code", desc: "Qué incluye y cuánto cuesta D-Code Finance, D-Code OS, las automatizaciones, los agentes de IA, las webs y los sistemas a medida. Precios sin IVA.", et: "Precios", h1: "Qué incluye y cuánto cuesta.", lead: "Precios de referencia, sin letra pequeña. El alcance se cierra por escrito antes de empezar.", incluye: "Qué incluye", no: "Qué no incluye", packs: "Packs", packsLead: "Varias piezas juntas, más baratas que por separado.", lleva: "Lleva", como: "Cómo se contrata hoy", estado: { disponible: "Disponible", "a-medida": "A medida", proximamente: "Próximamente" }, cta: "Pedir esto", mas: "+", indice: "Categorías" },
  en: { titulo: "Pricing for automation, AI and custom software | D-Code Partners", desc: "What D-Code Finance, D-Code OS, automations, AI agents, websites and custom systems include and cost. Reference prices, excluding VAT.", et: "Pricing", h1: "What's included and what it costs.", lead: "Reference prices, no small print. Scope is agreed in writing before anything starts.", incluye: "What's included", no: "Not included", packs: "Packs", packsLead: "Several pieces together, cheaper than separately.", lleva: "Includes", como: "How to buy it today", estado: { disponible: "Available", "a-medida": "Custom", proximamente: "Coming soon" }, cta: "Ask for this", mas: "+", indice: "Categories" },
};

export const META_PRECIOS = { es: { titulo: T.es.titulo, descripcion: T.es.desc }, en: { titulo: T.en.titulo, descripcion: T.en.desc } };

export function precios(lang) {
  const t = T[lang];
  const L = (r) => (lang === "en" ? "/en" + r : r);
  const nombre = (id) => (CAT.productos.find((p) => p.id === id) || {})[lang]?.nombre || id;
  const cats = CAT.categorias.filter((c) => c.id !== "packs");
  const bloque = (c) => {
    const ps = CAT.productos.filter((p) => p.cat === c.id);
    if (!ps.length) return "";
    return `<section class="cat" id="g-${c.id}" aria-labelledby="h-${c.id}">
  <div class="marco cat-in">
    <div class="cat-cab"><h2 class="h2" id="h-${c.id}">${esc(c[lang])}</h2><p class="lead">${esc(c["resumen_" + lang])}</p></div>
    <ul class="prods" role="list">
      ${ps.map((p) => { const d = p[lang]; return `<li><article class="prod" data-id="${p.id}">
        <div class="prod-cab">
          <h3 class="h3">${esc(d.nombre)}</h3>
          <p class="rotulo prod-estado" data-estado="${p.estado}">${t.estado[p.estado] || p.estado}</p>
        </div>
        ${d.para ? `<p class="prod-para">${esc(d.para)}</p>` : ""}
        <p class="prod-que">${esc(d.que)}</p>
        <div class="prod-precio">
          ${d.precio ? `<p><span class="precio-v">${esc(d.precio)}</span> <span class="precio-d">${esc(d.precio_detalle || "")}</span></p>` : ""}
          ${d.precio_mes ? `<p><span class="precio-v">${d.precio ? "+ " : ""}${esc(d.precio_mes)}</span> <span class="precio-d">${esc(d.precio_mes_detalle || "")}</span></p>` : ""}
        </div>
        ${(d.incluye?.length || d.no_incluye?.length || d.nota) ? `<details class="prod-mas"><summary>${t.incluye}</summary>
          ${d.incluye?.length ? `<ul>${d.incluye.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
          ${d.no_incluye?.length ? `<p class="rotulo">${t.no}</p><ul class="prod-no">${d.no_incluye.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
          ${d.nota ? `<p class="peq">${esc(d.nota)}</p>` : ""}
        </details>` : ""}
        <p class="prod-acc"><a class="enlace" href="${L("/contacto")}?producto=${p.id}">${t.cta} ${FLECHA}</a></p>
      </article></li>`; }).join("\n      ")}
    </ul>
  </div>
</section>`;
  };
  const packs = `<section class="cat" id="g-packs" aria-labelledby="h-packs">
  <div class="marco cat-in">
    <div class="cat-cab"><h2 class="h2" id="h-packs">${t.packs}</h2><p class="lead">${t.packsLead}</p></div>
    <ul class="prods" role="list">
      ${CAT.packs.map((k) => { const d = k[lang]; return `<li><article class="prod" data-id="${k.id}">
        <div class="prod-cab"><h3 class="h3">${esc(d.nombre)}</h3><p class="rotulo prod-estado" data-estado="${k.estado}">${t.estado[k.estado] || ""}</p></div>
        ${d.para ? `<p class="prod-para">${esc(d.para)}</p>` : ""}
        <p class="prod-que">${esc(d.que)}</p>
        <p class="peq">${t.lleva}: ${[...new Set(k.lleva)].map(nombre).map(esc).join(" · ")}</p>
        <div class="prod-precio">
          ${d.precio ? `<p><span class="precio-v">${esc(d.precio)}</span> <span class="precio-d">${esc(d.precio_detalle || "")}</span></p>` : ""}
          ${d.precio_mes ? `<p><span class="precio-v">+ ${esc(d.precio_mes)}</span> <span class="precio-d">${esc(d.precio_mes_detalle || "")}</span></p>` : ""}
          ${d.ahorro ? `<p class="peq">${esc(d.suelto ? (lang === "en" ? "Separately " : "Por separado ") + d.suelto + " · " : "")}${esc(d.ahorro)}</p>` : ""}
        </div>
        ${d.incluye?.length ? `<details class="prod-mas"><summary>${t.incluye}</summary><ul>${d.incluye.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></details>` : ""}
        <p class="prod-acc"><a class="enlace" href="${L("/contacto")}?producto=${k.id}">${t.cta} ${FLECHA}</a></p>
      </article></li>`; }).join("\n      ")}
    </ul>
  </div>
</section>`;
  const como = `<section class="cat" aria-labelledby="h-como"><div class="marco cat-in"><div class="cat-cab"><h2 class="h2" id="h-como">${t.como}</h2></div><div><ol class="pasos-compra" role="list">${CAT.contratacion.hoy[lang].map((x, i) => `<li><span class="dato">0${i + 1}</span>${esc(x)}</li>`).join("")}</ol><p class="texto" style="margin-top:24px">${esc(CAT.contratacion.nota[lang])}</p><p class="peq" style="margin-top:12px">${esc(CAT.aviso[lang])} ${esc(CAT.iva[lang])}</p></div></div></section>`;
  return `<header class="pag-cab"><div class="marco"><p class="etiqueta aparece">${t.et}</p><h1 class="h1 aparece" style="--i:1">${t.h1}</h1><p class="lead aparece" style="--i:2">${t.lead}</p>
  <nav class="indice aparece" style="--i:3" aria-label="${t.indice}"><ul role="list">${[...cats.filter((c) => CAT.productos.some((p) => p.cat === c.id)), { id: "packs", es: "Packs", en: "Packs" }].map((c) => `<li><a href="#g-${c.id}">${esc(c[lang])}</a></li>`).join("")}</ul></nav></div></header>
${cats.map(bloque).join("\n")}
${packs}
${como}`;
}

export const JSONLD_PRECIOS = (lang) => ({
  "@context": "https://schema.org", "@type": "OfferCatalog", name: lang === "en" ? "D-Code Partners catalogue" : "Catálogo de D-Code Partners",
  itemListElement: CAT.productos.filter((p) => p.estado === "disponible" && /\d/.test(p.es.precio_mes || p.es.precio || "")).map((p) => {
    const v = (p.es.precio_mes && !p.es.precio) ? p.es.precio_mes : (p.es.precio || p.es.precio_mes); // cifras en formato español: 1.500 €
    const n = Number(String(v).replace(/[^\d,]/g, "").replace(",", "."));
    return { "@type": "Offer", itemOffered: { "@type": "Service", name: p[lang].nombre, description: p[lang].que }, priceCurrency: "EUR", price: n, priceSpecification: { "@type": "PriceSpecification", minPrice: n, priceCurrency: "EUR", valueAddedTaxIncluded: false } };
  }),
});
