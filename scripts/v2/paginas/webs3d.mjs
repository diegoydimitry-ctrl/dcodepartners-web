/* ==========================================================================
   WEBS DE EJEMPLO EN 3D (rev. 28/09/2026) · «Cuatro ejemplos de lo que sale»
   Cuatro webs de verdad (HTML, no capturas), cada una con su identidad, para
   cuatro sectores: inmobiliaria, restaurante, industria (lubricantes) y
   servicios (clínica). En escritorio viven en un escenario 3D (CSS 3D, sin
   WebGL): se eligen, se acercan, se navegan y se bajan por dentro. En tableta,
   un carrusel plano con algo de profundidad. En el teléfono, cada web dentro de
   un marco de teléfono: la misma web, maquetada para móvil (container queries).
   Empresas y datos inventados; marcas reales, ninguna.
   ========================================================================== */
const FLECHA = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>`;
const T = {
  es: {
    etiqueta: "Páginas web", h: "Cuatro webs de verdad. Entra en ellas.",
    lead: "Maquetas nuestras, empresas inventadas, código de verdad: elige una, bájala, navega. Cada una se conecta con lo que la empresa ya usa.",
    aviso: "Webs de demostración · empresas ficticias · ningún sistema real conectado.",
    abrir: "Ver a pantalla completa", cerrar: "Cerrar", anterior: "Web anterior", siguiente: "Web siguiente", elige: "Elige una web",
    conexion: "Conectada con",
  },
  en: {
    etiqueta: "Websites", h: "Four real websites. Step inside.",
    lead: "Our mock-ups, made-up companies, real code: pick one, scroll it, click around. Each one connects to what the company already uses.",
    aviso: "Demo websites · fictional companies · no real system connected.",
    abrir: "View full screen", cerrar: "Close", anterior: "Previous site", siguiente: "Next site", elige: "Pick a site",
    conexion: "Connected to",
  },
};

/* ------------------------------------------------------------ las cuatro webs */
function visqa(en) {
  const P = en ? {
    nav: ["Products", "Technical finder", "Distributors", "Data sheets"], pro: "Trade area",
    h: "Technical lubricants for engines that cannot stop.", sub: "Formulated and filled in Avilés. Every batch with its own lab report.",
    chips: ["ACEA C3", "API SP", "214 references"], buscar: "Technical finder", apl: "Application", vis: "Viscosity", nor: "Standard",
    apls: ["Passenger car · petrol/diesel", "Heavy duty", "Industrial hydraulics", "Gear oils"], res: "3 products match", ficha: "Data sheet", fds: "SDS",
    stock: "In stock", conecta: "Stock and data sheets come straight from the ERP: what you see is what is in the warehouse.",
    prods: [["VISQA PRO C3 5W-30", "Full synthetic · low SAPS", "1,240 u."], ["VISQA PRO SP 0W-20", "Full synthetic · hybrids", "860 u."], ["VISQA MAX HD 10W-40", "Heavy duty · long drain", "310 drums"]],
    det: "Product", tabla: [["Viscosity at 100 °C", "11.8 mm²/s"], ["Viscosity at 40 °C", "69 mm²/s"], ["Viscosity index", "168"], ["Pour point", "−39 °C"], ["TBN", "7.2 mg KOH/g"], ["Packs", "1 L · 5 L · 20 L · 208 L"]],
    homol: "Specifications", pedido: "Trade order", volver: "Back to catalogue",
  } : {
    nav: ["Productos", "Buscador técnico", "Distribuidores", "Fichas"], pro: "Área profesional",
    h: "Lubricantes técnicos para motores que no pueden parar.", sub: "Formulados y envasados en Avilés. Cada lote, con su análisis de laboratorio.",
    chips: ["ACEA C3", "API SP", "214 referencias"], buscar: "Buscador técnico", apl: "Aplicación", vis: "Viscosidad", nor: "Norma",
    apls: ["Turismo · gasolina y diésel", "Vehículo pesado", "Hidráulico industrial", "Engranajes"], res: "3 productos cumplen", ficha: "Ficha técnica", fds: "FDS",
    stock: "En almacén", conecta: "El stock y las fichas salen del ERP: lo que ves es lo que hay en el almacén.",
    prods: [["VISQA PRO C3 5W-30", "Sintético · bajo SAPS", "1.240 u."], ["VISQA PRO SP 0W-20", "Sintético · híbridos", "860 u."], ["VISQA MAX HD 10W-40", "Vehículo pesado · cambio largo", "310 bidones"]],
    det: "Producto", tabla: [["Viscosidad a 100 °C", "11,8 mm²/s"], ["Viscosidad a 40 °C", "69 mm²/s"], ["Índice de viscosidad", "168"], ["Punto de congelación", "−39 °C"], ["TBN", "7,2 mg KOH/g"], ["Envases", "1 L · 5 L · 20 L · 208 L"]],
    homol: "Homologaciones", pedido: "Pedido profesional", volver: "Volver al catálogo",
  };
  return `<div class="vq" data-sitio-vistas>
  <header class="vq-top"><span class="vq-logo">VISQA<small>${en ? "Lubricants" : "Lubricantes"}</small></span><nav>${P.nav.map((x, i) => `<a href="${i === 1 ? "#vq-buscar" : "#vq-inicio"}" data-ir="${i === 1 ? "buscar" : "inicio"}">${x}</a>`).join("")}</nav><a class="vq-pro" href="#vq-inicio" data-ir="inicio">${P.pro}</a></header>
  <section data-vista="inicio" id="vq-inicio">
    <div class="vq-heroe"><div class="vq-heroe-t"><p class="vq-k">Avilés · 1987</p><h3>${P.h}</h3><p>${P.sub}</p><ul class="vq-chips">${P.chips.map((c) => `<li>${c}</li>`).join("")}</ul></div>
      <figure class="vq-foto"><img data-src="/assets/v2/img/webs/visqa-gama.webp" alt="${en ? "VISQA range: 1 L and 5 L bottles, a 20 L drum" : "Gama VISQA: botellas de 1 L y 5 L y un bidón de 20 L"}" width="1200" height="800"></figure></div>
    <div class="vq-buscador" id="vq-buscar" data-vista-ancla="buscar"><p class="vq-k">${P.buscar}</p>
      <div class="vq-filtros"><label><span>${P.apl}</span><select>${P.apls.map((a) => `<option>${a}</option>`).join("")}</select></label>
        <label><span>${P.vis}</span><select><option>5W-30</option><option>0W-20</option><option>10W-40</option></select></label>
        <label><span>${P.nor}</span><select><option>ACEA C3</option><option>API SP</option><option>ACEA E7</option></select></label></div>
      <p class="vq-res"><b>${P.res}</b> · ${P.conecta}</p>
      <ul class="vq-prods">${P.prods.map(([n, d, s], i) => `<li><a href="#vq-producto" data-ir="producto"><span class="vq-bote vq-bote--${i + 1}" aria-hidden="true"></span><span><b>${n}</b><span>${d}</span></span><span class="vq-stock"><i></i>${P.stock}: ${s}</span></a><span class="vq-docs"><a href="#vq-producto" data-ir="producto">${P.ficha}</a><a href="#vq-producto" data-ir="producto">${P.fds}</a></span></li>`).join("")}</ul></div>
  </section>
  <section data-vista="producto" id="vq-producto" hidden>
    <a href="#vq-inicio" class="vq-volver" data-ir="inicio">← ${P.volver}</a>
    <div class="vq-ficha"><figure class="vq-foto vq-foto--p"><img data-src="/assets/v2/img/webs/visqa-5l.webp" alt="VISQA PRO C3 5W-30, 5 L" width="800" height="800"></figure>
      <div><p class="vq-k">${P.det}</p><h3>VISQA PRO C3 5W-30</h3><p>${P.prods[0][1]} · ${P.stock}: ${P.prods[0][2]}</p>
        <table>${P.tabla.map(([a, b]) => `<tr><th>${a}</th><td>${b}</td></tr>`).join("")}</table>
        <p class="vq-k">${P.homol}</p><ul class="vq-chips"><li>ACEA C3</li><li>API SP</li><li>VW 504.00 / 507.00</li><li>MB 229.51</li></ul>
        <a class="vq-pro vq-pro--l" href="#vq-inicio" data-ir="inicio">${P.pedido}</a></div></div>
  </section>
</div>`;
}

function orbe(en) {
  const P = en ? {
    nav: ["Menu", "The house", "Groups"], res: "Book", h: "Seasonal cooking, ten minutes from home.", sub: "Short menu, market produce, a table held for you in thirty seconds.",
    dia: "Day", hora: "Time", pers: "Guests", dias: ["Thu 2", "Fri 3", "Sat 4"], conf: "Confirm table for 2",
    ok: "Table confirmed · Friday 3 · 21:30 · 2 guests", okd: "It is already in the floor plan. You will get a reminder on the day, and you can change it from the message.",
    carta: "This week", menu: [["Grilled leeks, romesco", "12"], ["Mountain lamb, baked potatoes", "26"], ["Hake, green sauce, clams", "24"], ["Cheesecake, quince", "8"]], dia_m: "Lunch menu Tue–Fri", precio: "€24",
  } : {
    nav: ["Carta", "La casa", "Grupos"], res: "Reservar", h: "Cocina de temporada, a diez minutos de casa.", sub: "Carta corta, producto de mercado y tu mesa reservada en treinta segundos.",
    dia: "Día", hora: "Hora", pers: "Personas", dias: ["Jue 2", "Vie 3", "Sáb 4"], conf: "Confirmar mesa para 2",
    ok: "Mesa confirmada · viernes 3 · 21:30 · 2 personas", okd: "Ya está en el plano de sala. Te llegará un recordatorio el mismo día y podrás cambiarla desde el mensaje.",
    carta: "Esta semana", menu: [["Puerros a la brasa, romesco", "12"], ["Cordero de la sierra, patatas panaderas", "26"], ["Merluza en salsa verde, almejas", "24"], ["Tarta de queso, membrillo", "8"]], dia_m: "Menú del día, de martes a viernes", precio: "24 €",
  };
  return `<div class="or">
  <header class="or-top"><span class="or-logo">Orbe</span><nav>${P.nav.map((x, i) => `<a href="${i ? "#or-reserva" : "#or-carta"}">${x}</a>`).join("")}</nav><a class="or-res" href="#or-reserva">${P.res}</a></header>
  <div class="or-heroe"><figure class="or-foto"><img data-src="/assets/v2/img/webs/orbe-mesa.webp" alt="${en ? "A table set at dusk: ceramic plates, glasses and a candle" : "Una mesa puesta al anochecer: platos de cerámica, copas y una vela"}" width="1200" height="800"></figure>
    <div class="or-heroe-t"><p class="or-k">Torrelodones</p><h3>${P.h}</h3><p>${P.sub}</p></div></div>
  <div class="or-reserva" id="or-reserva" data-reserva>
    <div class="or-paso"><span class="or-k">${P.dia}</span><div class="or-ops">${P.dias.map((d, i) => `<button type="button" aria-pressed="${i === 1}">${d}</button>`).join("")}</div></div>
    <div class="or-paso"><span class="or-k">${P.hora}</span><div class="or-ops">${["13:30", "14:00", "21:00", "21:30", "22:00"].map((h) => `<button type="button" aria-pressed="${h === "21:30"}"${h === "22:00" ? " disabled" : ""}>${h}</button>`).join("")}</div></div>
    <button type="button" class="or-confirmar" data-confirmar>${P.conf}</button>
    <div class="or-ok" data-ok hidden role="status"><b>${P.ok}</b><p>${P.okd}</p></div>
  </div>
  <div class="or-carta" id="or-carta"><p class="or-k">${P.carta}</p><ul>${P.menu.map(([a, b]) => `<li><span>${a}</span><i></i><span>${b}</span></li>`).join("")}</ul><p class="or-menu">${P.dia_m} · <b>${P.precio}</b></p></div>
</div>`;
}

function vandria(en) {
  const P = en ? {
    nav: ["Buy", "Rent", "Sell", "About"], cta: "Book a viewing", h: "Homes on the Costa del Sol.", sub: "Every listing comes from our system: what you see is available today. Tell us what you need and we only show what fits.",
    zona: "Area", precio: "Up to", buscar: "Search", casas: [["Villa · Marbella", "4 bed · 4 bath · 312 m²", "€1,950,000", "New"], ["Flat · Málaga centre", "3 bed · 2 bath · 118 m²", "€389,000", "Viewing today"], ["Penthouse · Benalmádena", "3 bed · 2 bath · 132 m²", "€612,000", "Exclusive"]],
    ficha: "Villa in Marbella", datos: [["Bedrooms", "4"], ["Bathrooms", "4"], ["Built", "312 m²"], ["Plot", "1,100 m²"], ["Energy", "B"]], pagar: "How would you pay?", ops: ["Mortgage approved", "Pending mortgage", "Cash"], pedir: "Request a viewing", okv: "We will call you today to arrange the viewing.", volver: "Back",
  } : {
    nav: ["Comprar", "Alquilar", "Vender", "Nosotros"], cta: "Pedir visita", h: "Casas y pisos en la Costa del Sol.", sub: "Cada ficha sale de nuestro sistema: lo que ves está disponible hoy. Dinos qué buscas y te enseñamos solo lo que encaja.",
    zona: "Zona", precio: "Hasta", buscar: "Buscar", casas: [["Villa · Marbella", "4 hab · 4 baños · 312 m²", "1.950.000 €", "Nuevo"], ["Piso · Málaga centro", "3 hab · 2 baños · 118 m²", "389.000 €", "Visita hoy"], ["Ático · Benalmádena", "3 hab · 2 baños · 132 m²", "612.000 €", "Exclusiva"]],
    ficha: "Villa en Marbella", datos: [["Habitaciones", "4"], ["Baños", "4"], ["Construidos", "312 m²"], ["Parcela", "1.100 m²"], ["Energía", "B"]], pagar: "¿Cómo lo pagarías?", ops: ["Hipoteca aprobada", "Hipoteca en trámite", "Al contado"], pedir: "Pedir la visita", okv: "Te llamamos hoy para cerrar la visita.", volver: "Volver",
  };
  return `<div class="vh" data-sitio-vistas>
  <header class="vh-top"><span class="vh-logo">Vandria<small>Hogar</small></span><nav>${P.nav.map((x) => `<a href="#vh-inicio" data-ir="inicio">${x}</a>`).join("")}</nav><a class="vh-cta" href="#vh-ficha" data-ir="ficha">${P.cta}</a></header>
  <section data-vista="inicio" id="vh-inicio">
    <div class="vh-heroe"><h3>${P.h}</h3><p>${P.sub}</p>
      <form class="vh-busca" onsubmit="return false"><label><span>${P.zona}</span><select><option>Marbella</option><option>Málaga</option><option>Benalmádena</option><option>Estepona</option></select></label><label><span>${P.precio}</span><select><option>2.000.000 €</option><option>900.000 €</option><option>600.000 €</option></select></label><button type="submit">${P.buscar}</button></form></div>
    <ul class="vh-casas">${P.casas.map(([t, d, p, b], i) => `<li><a href="#vh-ficha" data-ir="ficha"><figure><img data-src="/assets/v2/img/webs/vandria-${i + 1}.webp" alt="${t}" width="800" height="560"><span class="vh-badge">${b}</span></figure><b>${p}</b><span>${t}</span><span class="vh-d">${d}</span></a></li>`).join("")}</ul>
  </section>
  <section data-vista="ficha" id="vh-ficha" hidden>
    <a href="#vh-inicio" class="vh-volver" data-ir="inicio">← ${P.volver}</a>
    <figure class="vh-grande"><img data-src="/assets/v2/img/webs/vandria-1.webp" alt="${P.ficha}" width="800" height="560"></figure>
    <div class="vh-ficha"><div><h3>${P.ficha}</h3><p class="vh-p">${P.casas[0][2]}</p><dl>${P.datos.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join("")}</dl></div>
      <div class="vh-visita" data-visita><p class="vh-k">${P.pagar}</p>${P.ops.map((o, i) => `<button type="button" aria-pressed="${i === 0}">${o}</button>`).join("")}<button type="button" class="vh-cta vh-cta--l" data-pedir>${P.pedir}</button><p class="vh-ok" data-ok hidden role="status">${P.okv}</p></div></div>
  </section>
</div>`;
}

function sonrisa(en) {
  const P = en ? {
    nav: ["Treatments", "Team", "Prices"], cta: "Book", h: "Book in two taps. The free slots you see are real.", sub: "The website reads the clinic's calendar and writes to it: no calls, no double bookings.",
    dias: ["Mon 29", "Tue 30", "Wed 1", "Thu 2", "Fri 3"], semana: "This week", elige: "Pick a time", nombre: "Name", tel: "Phone", reservar: "Book 18:15 on Thursday",
    ok: "Booked · Thursday 2 · 18:15 · Dr Ruiz", okd: "It is in the clinic's calendar. You will get a text the day before.",
    trat: "Treatments", precios: [["Cleaning", "€55"], ["Check-up + X-ray", "€40"], ["Whitening", "€290"], ["Clear aligners", "from €2,900"]],
  } : {
    nav: ["Tratamientos", "Equipo", "Precios"], cta: "Pedir cita", h: "Cita en dos toques. Los huecos que ves son los de verdad.", sub: "La web lee la agenda de la clínica y escribe en ella: sin llamadas y sin citas dobles.",
    dias: ["Lun 29", "Mar 30", "Mié 1", "Jue 2", "Vie 3"], semana: "Esta semana", elige: "Elige hora", nombre: "Nombre", tel: "Teléfono", reservar: "Reservar el jueves a las 18:15",
    ok: "Reservada · jueves 2 · 18:15 · Dra. Ruiz", okd: "Está en la agenda de la clínica. Te llegará un SMS el día antes.",
    trat: "Tratamientos", precios: [["Limpieza", "55 €"], ["Revisión con radiografía", "40 €"], ["Blanqueamiento", "290 €"], ["Ortodoncia invisible", "desde 2.900 €"]],
  };
  const huecos = [["09:30", "12:00"], ["—"], ["10:15", "17:00", "19:30"], ["17:30", "18:15"], ["09:00"]];
  return `<div class="cs">
  <header class="cs-top"><span class="cs-logo"><i aria-hidden="true"></i>Clínica Sonrisa</span><nav>${P.nav.map((x, i) => `<a href="${i === 1 ? "#cs-cita" : "#cs-trat"}">${x}</a>`).join("")}</nav><a class="cs-cta" href="#cs-cita">${P.cta}</a></header>
  <div class="cs-heroe"><h3>${P.h}</h3><p>${P.sub}</p></div>
  <div class="cs-cita" id="cs-cita" data-cita><p class="cs-k">${P.semana} · ${P.elige}</p>
    <div class="cs-semana">${P.dias.map((d, i) => `<div class="cs-dia"><b>${d}</b>${huecos[i].map((hh) => hh === "—" ? `<span class="cs-lleno">${en ? "Full" : "Completo"}</span>` : `<button type="button" aria-pressed="${i === 3 && hh === "18:15"}">${hh}</button>`).join("")}</div>`).join("")}</div>
    <div class="cs-datos"><label><span>${P.nombre}</span><input value="Lucía Martín" autocomplete="off"></label><label><span>${P.tel}</span><input value="600 000 000" autocomplete="off"></label></div>
    <button type="button" class="cs-cta cs-cta--l" data-reservar>${P.reservar}</button>
    <div class="cs-ok" data-ok hidden role="status"><b>${P.ok}</b><p>${P.okd}</p></div></div>
  <div class="cs-trat" id="cs-trat"><p class="cs-k">${P.trat}</p><ul>${P.precios.map(([a, b]) => `<li><span>${a}</span><b>${b}</b></li>`).join("")}</ul></div>
</div>`;
}

export const SITIOS = [
  { id: "vandria", sector: ["Inmobiliaria", "Real estate"], nombre: "Vandria Hogar", dominio: "vandriahogar.es", con: ["CRM", "CRM"], html: vandria },
  { id: "orbe", sector: ["Restaurante", "Restaurant"], nombre: "Orbe", dominio: "orbe-restaurante.es", con: ["Agenda de sala", "Floor plan"], html: orbe },
  { id: "visqa", sector: ["Industria · lubricantes", "Industry · lubricants"], nombre: "Visqa Lubricantes", dominio: "visqa.es", con: ["ERP y almacén", "ERP and warehouse"], html: visqa },
  { id: "sonrisa", sector: ["Servicios · clínica", "Services · clinic"], nombre: "Clínica Sonrisa", dominio: "clinicasonrisa.es", con: ["Agenda de la clínica", "Clinic calendar"], html: sonrisa },
];

/** El cuerpo del capítulo (sustituye a las cuatro capturas). */
export function cuerpoWebs(lang) {
  const t = T[lang], en = lang === "en", k = en ? 1 : 0;
  return `<div class="w3" data-webs3d data-lang="${lang}">
  <div class="w3-escena" data-w3-escena><div class="w3-mundo" data-w3-mundo>
    <div class="w3-suelo" aria-hidden="true"></div>
    ${SITIOS.map((s, i) => `<article class="w3-ventana${i ? "" : " is-activa"}" data-w3-v="${i}" id="w3-${s.id}" aria-label="${s.nombre} · ${s.sector[k]}"${i ? ' aria-hidden="true" inert' : ""}>
      <div class="w3-barra" aria-hidden="true"><i></i><i></i><i></i><span class="w3-url">${s.dominio}</span></div>
      <div class="w3-pantalla"><div class="w3-vista" tabindex="0">${s.html(en)}</div></div>
      <div class="w3-brillo" aria-hidden="true"></div>
    </article>`).join("\n    ")}
  </div></div>
  <div class="w3-mando">
    <div class="w3-lista" role="tablist" aria-label="${t.elige}">${SITIOS.map((s, i) => `<button type="button" role="tab" class="w3-t" aria-selected="${i === 0}" aria-controls="w3-${s.id}" tabindex="${i ? -1 : 0}" data-w3-t="${i}"><span class="w3-t-s">${s.sector[k]}</span><span class="w3-t-n">${s.nombre}</span><span class="w3-t-c">${t.conexion}: ${s.con[k]}</span></button>`).join("")}</div>
    <div class="w3-acc"><button type="button" class="ctrl" data-w3-ant aria-label="${t.anterior}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button><button type="button" class="ctrl" data-w3-sig aria-label="${t.siguiente}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button><button type="button" class="enlace" data-w3-grande>${t.abrir} ${FLECHA}</button></div>
  </div>
  <p class="rotulo w3-aviso">${t.aviso}</p>
  <dialog class="w3-dialogo" data-w3-dialogo aria-label="${t.abrir}"><div class="w3-dialogo-cab"><span class="w3-url" data-w3-dialogo-url></span><button type="button" class="ctrl" data-w3-cerrar aria-label="${t.cerrar}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div><div class="w3-dialogo-cuerpo" data-w3-dialogo-cuerpo></div></dialog>
</div>`;
}

/** Cabecera del capítulo con el texto nuevo (para las páginas donde se sustituye). */
export const textosWebs = (lang) => T[lang];
