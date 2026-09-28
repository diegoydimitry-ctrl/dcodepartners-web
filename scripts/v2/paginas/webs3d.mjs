/* ==========================================================================
   WEBS DE EJEMPLO EN 3D (rev. 28/09/2026) · «Cuatro ejemplos de lo que sale»
   Cuatro webs de verdad (HTML, no capturas), cada una con su identidad, para
   cuatro sectores: inmobiliaria, restaurante, taller mecánico y servicios
   (clínica). En escritorio viven en un escenario 3D (CSS 3D, sin
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
function brio(en) {
  const P = en ? {
    nav: ["Services", "Track your car", "The workshop"], cta: "Book", k: "Leganés · since 2004",
    h: "Your car, ready when we say it will be.", sub: "Book in a minute, a quote on WhatsApp before we touch anything, and your car's status on your phone.", seguir: "Track your car",
    servicios: [["Service and oil", "from €89"], ["Brakes", "from €120"], ["Tyres", "fitted in 30 min"], ["Diagnostics", "€35"], ["Pre-MOT check", "€25"]],
    volver: "Back", p1: "1 · What's wrong?", p2: "2 · When will you bring it?", p3: "3 · Number plate", ops1: ["Service", "Brakes", "Tyres", "Strange noise", "Pre-MOT"], ops2: ["Tomorrow 8:30", "Tomorrow 12:00", "Thu 2 · 8:30", "Thu 2 · 16:00"],
    conf: "Confirm booking", ok: "Booked · Thursday 2 · 8:30 · Brakes", okd: "We'll send you the quote on WhatsApp before we start. You can follow your car from here.", okl: "Track your car",
    matr: "4821 KLM · Brakes", est: ["Checked in", "Diagnosis", "Quote", "Repair", "Ready"],
    titulos: ["Checked in. We start with the diagnosis.", "Diagnosis done.", "Your quote is ready: approve it and we start.", "In the workshop: new pads and discs going on.", "Ready to collect. Your invoice is on WhatsApp."],
    hitos: [["9:02", "Checked in at the workshop", "Photos of the car on arrival, sent to you"], ["9:40", "Diagnosis", "Front pads at 15%, discs worn"], ["9:44", "Quote sent on WhatsApp", "Front pads and discs · €186, parts and labour"], ["", "Repair", "You'll know when it starts"], ["", "Ready to collect", "Invoice and warranty on WhatsApp"]],
    presu: "Quote", aprobar: "Approve €186", llamar: "I'd rather you called me", avanzar: "Simulate: the repair is finished", aprobado: "Approved by you on WhatsApp · 9:51",
    tk: "Today in the workshop · what Javier, the workshop manager, sees", cols: [["Waiting for approval", [["1187 HBC", "Timing belt · €540", "sent 10:12"], ["5530 LRD", "Tyres ×2 · €164", "sent 10:30"]]], ["On the lift", [["4821 KLM", "Brakes · €186", "approved 9:51"], ["2294 JXS", "Service", "since 9:15"], ["7713 MMP", "Diagnostics", "since 10:02"]]], ["Ready", [["0906 KZT", "Air con", "customer told 11:05"]]]],
    auto: [["6 / 6", "today's bookings confirmed by themselves"], ["5", "quotes approved on WhatsApp today"], ["12", "MOT reminders sent this week"]],
  } : {
    nav: ["Servicios", "Sigue tu coche", "El taller"], cta: "Pedir cita", k: "Leganés · desde 2004",
    h: "Tu coche, listo cuando te lo decimos.", sub: "Cita en un minuto, presupuesto por WhatsApp antes de tocar nada y el estado de tu coche en el móvil.", seguir: "Sigue tu coche",
    servicios: [["Revisión y aceite", "desde 89 €"], ["Frenos", "desde 120 €"], ["Neumáticos", "montaje en 30 min"], ["Diagnosis", "35 €"], ["Pre-ITV", "25 €"]],
    volver: "Volver", p1: "1 · ¿Qué le pasa?", p2: "2 · ¿Cuándo lo traes?", p3: "3 · Matrícula", ops1: ["Revisión", "Frenos", "Neumáticos", "Un ruido raro", "Pre-ITV"], ops2: ["Mañana 8:30", "Mañana 12:00", "Jue 2 · 8:30", "Jue 2 · 16:00"],
    conf: "Confirmar cita", ok: "Cita confirmada · jueves 2 · 8:30 · Frenos", okd: "Antes de empezar te mandamos el presupuesto por WhatsApp. Y puedes seguir tu coche desde aquí.", okl: "Sigue tu coche",
    matr: "4821 KLM · Frenos", est: ["Recibido", "Diagnóstico", "Presupuesto", "Reparación", "Listo"],
    titulos: ["Recibido. Empezamos por el diagnóstico.", "Diagnóstico hecho.", "Tu presupuesto está listo: apruébalo y empezamos.", "En el taller: pastillas y discos nuevos.", "Listo para recoger. La factura, en tu WhatsApp."],
    hitos: [["9:02", "Recibido en el taller", "Fotos del coche al llegar, enviadas a ti"], ["9:40", "Diagnóstico", "Pastillas delanteras al 15 %, discos gastados"], ["9:44", "Presupuesto enviado por WhatsApp", "Pastillas y discos delanteros · 186 €, piezas y mano de obra"], ["", "Reparación", "Te avisamos al empezar"], ["", "Listo para recoger", "Factura y garantía por WhatsApp"]],
    presu: "Presupuesto", aprobar: "Aprobar 186 €", llamar: "Prefiero que me llaméis", avanzar: "Simular: termina la reparación", aprobado: "Aprobado por ti en WhatsApp · 9:51",
    tk: "Hoy en el taller · lo que ve Javier, el jefe de taller", cols: [["Esperando aprobación", [["1187 HBC", "Correa de distribución · 540 €", "enviado 10:12"], ["5530 LRD", "Neumáticos ×2 · 164 €", "enviado 10:30"]]], ["En el elevador", [["4821 KLM", "Frenos · 186 €", "aprobado 9:51"], ["2294 JXS", "Revisión", "desde 9:15"], ["7713 MMP", "Diagnosis", "desde 10:02"]]], ["Listo", [["0906 KZT", "Aire acondicionado", "cliente avisado 11:05"]]]],
    auto: [["6 / 6", "citas de hoy confirmadas solas"], ["5", "presupuestos aprobados hoy por WhatsApp"], ["12", "avisos de ITV enviados esta semana"]],
  };
  const coche = `<svg class="br-coche-svg" viewBox="0 0 120 48" aria-hidden="true"><path d="M8 34c0-5 2-8 7-9l14-3 12-10c3-2 6-3 10-3h26c5 0 9 2 12 5l9 9 10 2c5 1 6 4 6 8v4H8z" fill="currentColor"/><path d="M45 14h16v10H36z M65 14h13c3 0 5 1 7 3l6 7H65z" fill="#dfe6ee" opacity=".9"/><circle cx="31" cy="38" r="8" fill="#15181c"/><circle cx="31" cy="38" r="3.4" fill="#aeb6bf"/><circle cx="92" cy="38" r="8" fill="#15181c"/><circle cx="92" cy="38" r="3.4" fill="#aeb6bf"/></svg>`;
  return `<div class="br" data-sitio-vistas>
  <header class="br-top"><span class="br-logo">BRÍO<small>${en ? "Car repair" : "Taller mecánico"}</small></span><nav>${P.nav.map((x, i) => `<a href="#${["br-inicio", "br-sigue", "br-taller"][i]}" data-ir="${["inicio", "sigue", "taller"][i]}">${x}</a>`).join("")}</nav><a class="br-cta" href="#br-cita" data-ir="cita">${P.cta}</a></header>
  <section data-vista="inicio" id="br-inicio">
    <div class="br-heroe"><figure class="br-foto"><img data-src="/assets/v2/img/webs/taller-1.webp" alt="${en ? "The workshop: a car on a two-post lift, another waiting" : "El taller: un coche en el elevador y otro esperando"}" width="1200" height="800"></figure>
      <div class="br-heroe-t"><p class="br-k">${P.k}</p><h3>${P.h}</h3><p>${P.sub}</p><div class="br-acc"><a class="br-cta" href="#br-cita" data-ir="cita">${P.cta}</a><a class="br-sec" href="#br-sigue" data-ir="sigue">${P.seguir} →</a></div></div></div>
    <ul class="br-servicios">${P.servicios.map(([a, b]) => `<li><b>${a}</b><span>${b}</span></li>`).join("")}</ul>
    <p class="br-credito">${en ? "Car in the photos" : "Coche de las fotos"}: «CarConcept», Eric Chadwick / Darmstadt Graphics Group · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener license">CC BY 4.0</a> · ${en ? "modified, rendered by D-Code" : "modificado, render de D-Code"}</p>
  </section>
  <section data-vista="cita" id="br-cita" hidden>
    <a href="#br-inicio" class="br-volver" data-ir="inicio">← ${P.volver}</a>
    <div class="br-form" data-cita>
      <div class="br-cita-foto"><img data-src="/assets/v2/img/webs/taller-2.webp" alt="${en ? "A car waiting in the workshop" : "Un coche esperando en el taller"}" width="800" height="560"></div>
      <div><p class="br-k">${P.p1}</p><div class="br-ops">${P.ops1.map((o, i) => `<button type="button" aria-pressed="${i === 1}">${o}</button>`).join("")}</div>
      <p class="br-k">${P.p2}</p><div class="br-ops">${P.ops2.map((o, i) => `<button type="button" aria-pressed="${i === 2}"${i === 1 ? " disabled" : ""}>${o}</button>`).join("")}</div>
      <p class="br-k">${P.p3}</p><input class="br-matricula" value="4821 KLM" aria-label="${P.p3}" autocomplete="off">
      <button type="button" class="br-cta br-cta--l" data-confirmar>${P.conf}</button>
      <div class="br-ok" data-ok hidden role="status"><b>${P.ok}</b><p>${P.okd}</p><a href="#br-sigue" data-ir="sigue">${P.okl} →</a></div></div>
    </div>
  </section>
  <section data-vista="sigue" id="br-sigue" hidden>
    <a href="#br-inicio" class="br-volver" data-ir="inicio">← ${P.volver}</a>
    <div class="br-sigue" data-br-sigue data-paso="2" data-titulos="${P.titulos.join("|")}">
      <p class="br-k">${P.matr}</p><h3 data-br-titulo>${P.titulos[2]}</h3>
      <div class="br-pista" aria-hidden="true"><div class="br-plano">${P.est.map((e, i) => `<span class="br-est" style="--i:${i}"><i></i></span>`).join("")}<div class="br-coche">${coche}</div></div></div>
      <div class="br-etq" aria-hidden="true">${P.est.map((e) => `<span>${e}</span>`).join("")}</div>
      <ol class="br-hitos">${P.hitos.map(([h, a, b], i) => `<li data-i="${i}"><span class="br-h">${h}</span><span><b>${a}</b><span>${b}</span></span></li>`).join("")}</ol>
      <div class="br-presu" data-br-presu><div><span class="br-k">${P.presu}</span><b>186 €</b></div><button type="button" class="br-cta" data-br-aprobar>${P.aprobar}</button><button type="button" class="br-sec" data-br-llamar>${P.llamar}</button></div>
      <button type="button" class="br-sec br-avanzar" data-br-avanzar hidden>${P.avanzar}</button>
      <p class="br-aprobado" data-br-aprobado hidden>${P.aprobado}</p>
    </div>
  </section>
  <section data-vista="taller" id="br-taller" hidden>
    <a href="#br-inicio" class="br-volver" data-ir="inicio">← ${P.volver}</a>
    <div class="br-panel"><p class="br-k">${P.tk}</p>
      <div class="br-cols">${P.cols.map(([t, xs]) => `<div class="br-col"><b>${t} <span>${xs.length}</span></b>${xs.map(([m, q, w]) => `<div class="br-tarjeta${m === "4821 KLM" ? " es-tuyo" : ""}"><span class="br-mat">${m}</span><span>${q}</span><span class="br-w">${w}</span></div>`).join("")}</div>`).join("")}</div>
      <ul class="br-auto">${P.auto.map(([n, t]) => `<li><b>${n}</b><span>${t}</span></li>`).join("")}</ul></div>
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
  { id: "vandria", sector: ["Inmobiliaria", "Real estate"], nombre: "Vandria Hogar", dominio: "vandriahogar.es", con: ["CRM", "CRM"], html: vandria, lema: ["Casas y pisos en la Costa del Sol.", "Homes on the Costa del Sol."] },
  { id: "orbe", sector: ["Restaurante", "Restaurant"], nombre: "Orbe", dominio: "orbe-restaurante.es", con: ["Agenda de sala", "Floor plan"], html: orbe, lema: ["Cocina de temporada, a diez minutos de casa.", "Seasonal cooking, ten minutes from home."] },
  { id: "brio", sector: ["Taller mecánico", "Car repair"], nombre: "Brío", dominio: "taller-brio.es", con: ["Agenda del taller y WhatsApp", "Workshop calendar and WhatsApp"], html: brio, lema: ["Tu coche, listo cuando te lo decimos.", "Your car, ready when we say it will be."] },
  { id: "sonrisa", sector: ["Servicios · clínica", "Services · clinic"], nombre: "Clínica Sonrisa", dominio: "clinicasonrisa.es", con: ["Agenda de la clínica", "Clinic calendar"], html: sonrisa, lema: ["Cita en dos toques.", "Book in two taps."] },
];

/** El cuerpo del capítulo (sustituye a las cuatro capturas). */
export function cuerpoWebs(lang) {
  const t = T[lang], en = lang === "en", k = en ? 1 : 0;
  return `<div class="w3" data-webs3d data-lang="${lang}">
  <div class="w3-escena" data-w3-escena><div class="w3-mundo" data-w3-mundo>
    <div class="w3-suelo" aria-hidden="true"></div>
    ${SITIOS.map((s, i) => `<article class="w3-ventana${i ? "" : " is-activa"}" data-w3-v="${i}" id="w3-${s.id}" aria-label="${s.nombre} · ${s.sector[k]}"${i ? ' aria-hidden="true" inert' : ""}>
      <div class="w3-barra" aria-hidden="true"><i></i><i></i><i></i><span class="w3-url">${s.dominio}</span></div>
      <div class="w3-pantalla">
        <div class="w3-cartel w3-cartel--${s.id}" aria-hidden="true"><span class="w3-cartel-l">${s.nombre}</span><span class="w3-cartel-s">${s.sector[k]}</span><span class="w3-cartel-h">${s.lema[k]}</span></div>
        <div class="w3-vista" tabindex="0"></div>
        <template data-w3-plantilla>${s.html(en)}</template>
      </div>
      <div class="w3-velo" aria-hidden="true"></div>
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
