/* ==========================================================================
   D-CODE · DEMOS DE LA PORTADA
   Cinco experiencias de producto, cada una con los mismos cinco tiempos:
   contexto → problema → TÚ (una acción) → EL SISTEMA (transformación) → resultado.
   Sin librerías. Cada demo se monta la primera vez que se abre su pestaña.
   Con movimiento reducido, los mismos pasos ocurren sin esperas ni animación.
   ========================================================================== */
const REDUCIDO = matchMedia("(prefers-reduced-motion: reduce)").matches;
const h = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const euros = (n, en) => (en ? "€" : "") + n.toLocaleString(en ? "en-GB" : "es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (en ? "" : " €");

/* Una ejecución por demo: al reiniciar o salir, las esperas pendientes se cancelan. */
function corrida() {
  let viva = true;
  return {
    get viva() { return viva; },
    parar() { viva = false; },
    espera(ms) { return new Promise((ok, no) => setTimeout(() => (viva ? ok() : no(new Error("parada"))), REDUCIDO ? Math.min(ms, 40) : ms)); },
  };
}

/* ------------------------------------------------------------- textos */
const T = {
  es: {
    fz: { vacio: "Nada registrado todavía", bandeja: "Bandeja vacía", cab: "Facturas recibidas", sem: "Semana 40", pie: "Pagos previstos esta semana", mal: "No cuadra", ok: "Revisada", leido: "Leído en la factura", habitual: "Lo habitual con este proveedor", corregir: "Corregir a 21 %", correcto: "Es correcto así", nota: "IVA al 10 % en un porte. El transporte de mercancías siempre va al 21 %." , movil: { antes: "facturas en el correo", hecho: "registradas", mal: "Transportes Cierzo · IVA al 10 % en un porte", ahora: "tesorería de la semana al día" } },
    cm: { hoy: "Hoy", con: "Con el sistema", dias: "2 días hábiles", min: "1 minuto", lead: ["María Gómez", "Reforma de cocina · Pozuelo de Alarcón", "«Queremos reformar la cocina antes de Navidad. Presupuesto aproximado: 20.000 €.»"],
      pasos: [["18:40:02", "Clasificado", "Reforma de cocina · prioridad alta: presupuesto y plazo claros"], ["18:40:03", "Asignado a Laura", "Zona oeste · 4 proyectos abiertos, la que menos carga tiene"], ["18:40:05", "Respuesta preparada", "Con dos huecos reales de su agenda"]],
      borrador: "Hola, María:\nGracias por escribirnos. Para una cocina antes de Navidad lo mejor es ver el espacio cuanto antes. ¿Te viene bien el martes a las 10:00 o el miércoles a las 17:30?\n— Laura · Alba Interiorismo",
      envio: [["18:41:12", "Enviada por Laura", "La leyó, no cambió nada y la envió"], ["18:41:12", "Seguimiento", "Martes 10:00 en la agenda de Laura, con el caso resumido"]] },
    op: { semana: "Semana 41", quien: ["Andrés", "Bea", "Carlos"], dias: ["Lun", "Mar", "Mié", "Jue", "Vie"],
      previo: [[0, 0, 2, "Mantenimiento", "Hotel Duna"], [1, 2, 1, "Avería", "Oficinas Sur"], [2, 0, 1, "Revisión", "Colegio Arce"]],
      nuevo: [["v", 1, 0, 1, "Visita técnica", "P-118 · 9:00"], ["i1", 0, 2, 2, "Instalación P-118", "Splits ×4"], ["i2", 2, 2, 2, "Instalación P-118", "Splits ×4"], ["pm", 0, 4, 1, "Puesta en marcha", "Con el cliente"]],
      chips: ["Proyecto creado", "5 tareas", "Material pedido · llega el martes", "Cliente avisado: miércoles y jueves"],
      retraso: ["Proveedor: el material llega el miércoles", "Retraso visto el lunes, dos días antes", "Instalación movida a jueves y viernes", "Cliente avisado: nueva fecha"] },
    at: { cab: "Clínica Sonrisa · asistente", sub: "Responde con la agenda real", hola: "Hola, soy el asistente de Clínica Sonrisa. ¿En qué te ayudo?",
      preg: ["¿Tenéis hueco el jueves por la tarde?", "¿Cuánto cuesta una limpieza?", "Quiero reclamar una factura"],
      fuentes: [["Agenda", "Jueves 2: libre 17:30 y 18:15"], ["Tarifas 2026", "Limpieza 55 € · con revisión 70 €"], ["Protocolo", "Reclamaciones: siempre a una persona"]],
      r: ["Sí: el jueves 2 tengo libre a las 17:30 y a las 18:15. ¿Te reservo alguna?", "Una limpieza cuesta 55 €; con revisión incluida, 70 €. ¿Quieres que te busque hueco?", "Lo siento. Esto prefiero que lo vea una persona del equipo: he pasado tu caso a recepción y te llamarán el lunes a primera hora."],
      rastro: ["Consultado: agenda", "Fuente: tarifas 2026", "Tarea para recepción · lunes 9:00 · prioridad alta"],
      reserva: "Hecho: jueves 2 a las 18:15 con la Dra. Ruiz. Te llegará un SMS de confirmación.", reservaR: "Reservado en la agenda · 22:16" },
    os: { nodos: ["Web", "WhatsApp", "Correo", "Holded", "Banco", "Agenda", "Excel"], centro: "D-Code OS", act: "Actividad", sin: "Sin conectar: cada herramienta guarda lo suyo.", hoy: "Hoy",
      ev: [[0, "Lead María Gómez · asignado a Laura", "regla «leads web» · 18:40"], [2, "23 facturas de proveedor · registradas", "lectura de documentos · 9:12"], [1, "Cita jueves 18:15 · en la agenda", "asistente · 22:16"], [3, "Factura F-2026-0142 · emitida y enviada", "Finance · 11:03"], [4, "Cobro 2.420 € · cuadra con F-2026-0131", "conciliación · 12:47"], [5, "Instalación P-118 · movida al jueves · cliente avisado", "Operaciones · 8:01"]],
      parte: ["Parte del día", "1 lead nuevo prioritario, ya respondido. 23 facturas registradas; una la revisaste tú. 1 cobro conciliado. 1 retraso resuelto dos días antes. Nada pendiente para hoy.", "Escrito por la IA con los datos de arriba; cada línea enlaza a su rastro."] },
  },
  en: {
    fz: { vacio: "Nothing recorded yet", bandeja: "Inbox empty", cab: "Invoices received", sem: "Week 40", pie: "Payments due this week", mal: "Doesn't add up", ok: "Reviewed", leido: "Read on the invoice", habitual: "Usual with this supplier", corregir: "Correct to 21%", correcto: "It's right as is", nota: "10% VAT on a haulage invoice. Goods transport is always 21%.", movil: { antes: "invoices in the inbox", hecho: "recorded", mal: "Transportes Cierzo · 10% VAT on haulage", ahora: "this week's cash flow up to date" } },
    cm: { hoy: "Today", con: "With the system", dias: "2 working days", min: "1 minute", lead: ["María Gómez", "Kitchen renovation · Pozuelo de Alarcón", "“We'd like to renovate the kitchen before Christmas. Budget around €20,000.”"],
      pasos: [["18:40:02", "Classified", "Kitchen renovation · high priority: clear budget and deadline"], ["18:40:03", "Assigned to Laura", "West area · 4 open projects, the lightest workload"], ["18:40:05", "Reply drafted", "With two real slots from her calendar"]],
      borrador: "Hi María,\nThanks for writing to us. For a kitchen before Christmas, it's best to see the space soon. Would Tuesday at 10:00 or Wednesday at 17:30 work for you?\n— Laura · Alba Interiors",
      envio: [["18:41:12", "Sent by Laura", "She read it, changed nothing and sent it"], ["18:41:12", "Follow-up", "Tuesday 10:00 in Laura's calendar, with the case summarised"]] },
    op: { semana: "Week 41", quien: ["Andrés", "Bea", "Carlos"], dias: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      previo: [[0, 0, 2, "Maintenance", "Hotel Duna"], [1, 2, 1, "Repair", "Oficinas Sur"], [2, 0, 1, "Inspection", "Arce School"]],
      nuevo: [["v", 1, 0, 1, "Site visit", "P-118 · 9:00"], ["i1", 0, 2, 2, "Install P-118", "Splits ×4"], ["i2", 2, 2, 2, "Install P-118", "Splits ×4"], ["pm", 0, 4, 1, "Commissioning", "With the customer"]],
      chips: ["Project created", "5 tasks", "Material ordered · arrives Tuesday", "Customer told: Wednesday and Thursday"],
      retraso: ["Supplier: material arrives Wednesday", "Delay seen on Monday, two days early", "Install moved to Thursday and Friday", "Customer told: new date"] },
    at: { cab: "Sonrisa Clinic · assistant", sub: "Answers with the real calendar", hola: "Hi, I'm the Sonrisa Clinic assistant. How can I help?",
      preg: ["Do you have a slot on Thursday afternoon?", "How much is a cleaning?", "I want to dispute an invoice"],
      fuentes: [["Calendar", "Thursday 2: free 17:30 and 18:15"], ["2026 prices", "Cleaning €55 · with check-up €70"], ["Protocol", "Complaints: always to a person"]],
      r: ["Yes: on Thursday 2 I have 17:30 and 18:15 free. Shall I book one?", "A cleaning is €55; with a check-up included, €70. Shall I find you a slot?", "I'm sorry. I'd rather a person on the team handled this: I've passed your case to reception and they'll call you first thing on Monday."],
      rastro: ["Checked: calendar", "Source: 2026 prices", "Task for reception · Monday 9:00 · high priority"],
      reserva: "Done: Thursday 2 at 18:15 with Dr Ruiz. You'll get a confirmation text.", reservaR: "Booked in the calendar · 22:16" },
    os: { nodos: ["Web", "WhatsApp", "Email", "Holded", "Bank", "Calendar", "Excel"], centro: "D-Code OS", act: "Activity", sin: "Not connected: each tool keeps its own part.", hoy: "Today",
      ev: [[0, "Lead María Gómez · assigned to Laura", "rule “web leads” · 18:40"], [2, "23 supplier invoices · recorded", "document reading · 9:12"], [1, "Appointment Thursday 18:15 · in the calendar", "assistant · 22:16"], [3, "Invoice F-2026-0142 · issued and sent", "Finance · 11:03"], [4, "Payment €2,420 · matches F-2026-0131", "reconciliation · 12:47"], [5, "Install P-118 · moved to Thursday · customer told", "Operations · 8:01"]],
      parte: ["Daily report", "1 new priority lead, already answered. 23 invoices recorded; you reviewed one. 1 payment reconciled. 1 delay solved two days early. Nothing pending today.", "Written by the AI from the data above; each line links to its trail."] },
  },
};

/* Facturas de la demo: proveedor, concepto, total. La 15 es la que no cuadra. */
const FACTURAS = [["Bases Cantábrico", "Aceite base SN 150 · 20 t", 18420], ["Aditivos Nalón", "Paquete de aditivos 5W30", 6840.5], ["Envases Siero", "Bidones 20 l ×600", 2952], ["Etiquetas Llanes", "Etiquetas ×12.000", 702.6], ["Laboratorio Avilés", "Análisis de lote L-2609", 318.45], ["Palés Navia", "Palés europeos ×80", 1104], ["Tapones Gozón", "Tapones con precinto ×20.000", 1103.8], ["Carretillas Mieres", "Revisión carretilla", 214.9], ["Envases Siero", "Garrafas 5 l ×2.000", 3356], ["Gas Industrial Avilés", "Nitrógeno", 142.3], ["Limpiezas Nalón", "Limpieza septiembre", 480], ["Telefonía Norte", "Líneas y fibra", 96.8], ["Seguros Principado", "Cuota trimestral", 1320], ["Cantábrico Energía", "Electricidad agosto", 2684.15], ["Transportes Cierzo", "Portes a Burgos ×3", 1240], ["Transportes Cierzo", "Porte a León", 456], ["Aditivos Nalón", "Antidesgaste ZDDP", 1165], ["Papelería Centro", "Material de oficina", 58.4], ["Bases Cantábrico", "Aceite base SN 500 · 4 t", 4132.6], ["Etiquetas Llanes", "Fichas técnicas impresas", 390], ["Suministros Levante", "Guantes y trapos", 74.2], ["Asesoría Llanes", "Asesoría septiembre", 290], ["Agua Avilés", "Agua agosto", 38.9]];
const MAL = 14;

/* ================================================================ FINANCE */
function finance(panel, t, en) {
  const L = panel.querySelector("[data-dm-lienzo]");
  let c = null, total = 0;
  const hoja = (i, extra = "") => { const [p, con, tot] = FACTURAS[i % FACTURAS.length]; return `<div class="fz-hoja${extra}" style="--r:${((i * 37) % 9) - 4}deg;--x:${((i * 13) % 7) - 3}px;--y:${((i * 7) % 5) - 2}px"><b>${p}</b><div class="l" style="width:62%"></div><div class="l" style="width:40%"></div><div class="l" style="width:80%"></div><div class="l" style="width:70%"></div><p>${con}</p><div class="t"><span>Total</span><span>${euros(tot, en)}</span></div></div>`; };
  const pinta = () => {
    L.innerHTML = `<div class="fz"><div class="fz-mesa"><div class="fz-pila" data-pila>${[4, 3, 2, 1, 0].map((i) => hoja(i)).join("")}<div class="fz-scan"></div></div><p class="fz-cuenta dm-mono" data-cuenta>0 / 23</p></div>
      <div class="fz-libro"><div class="fz-cab"><b>${t.cab}</b><span class="dm-chip">${t.sem}</span></div><ol class="fz-filas" data-filas data-vacio="${t.vacio}"></ol><div class="fz-pie" data-pie><span>${t.pie}</span><b data-total>${euros(0, en)}</b></div></div></div>`;
    total = 0;
  };
  pinta();
  return {
    async a1(ctl) {
      c = ctl; const pila = L.querySelector("[data-pila]"), filas = L.querySelector("[data-filas]"), cuenta = L.querySelector("[data-cuenta]"), tot = L.querySelector("[data-total]");
      pila.classList.add("is-leyendo");
      for (let i = 0; i < FACTURAS.length; i++) {
        await c.espera(i < 3 ? 420 : 90);
        const arriba = [...pila.querySelectorAll(".fz-hoja:not(.is-ida)")].pop(); if (arriba) { arriba.classList.add("is-ida"); setTimeout(() => arriba.remove(), 420); }
        if (i < FACTURAS.length - 5) pila.insertBefore(h(hoja(i + 5)), pila.firstChild);
        const [p, con, imp] = FACTURAS[i]; total += imp;
        const f = h(`<li class="fz-fila dm-entra${i === MAL ? " is-mal" : ""}"><span><b>${p}</b><span class="dm-mono">${con}</span></span>${i === MAL ? `<span class="dm-chip dm-chip--sis" data-marca>${t.mal}</span>` : `<span class="dm-chip">${[0, 1, 2, 3, 5, 6, 8, 16, 18].includes(i) ? (en ? "Materials" : "Materia prima") : en ? "Services" : "Servicios"}</span>`}<span class="imp">${euros(imp, en)}</span></li>`);
        filas.insertBefore(f, filas.firstChild);
        while (filas.children.length > 9) filas.lastElementChild.remove();
        cuenta.textContent = `${i + 1} / 23`; tot.textContent = euros(total, en);
      }
      pila.classList.remove("is-leyendo");
      await c.espera(300); pila.replaceWith(h(`<div class="fz-mesa-fin dm-entra"><b>0</b><span class="dm-mono">${t.bandeja}</span></div>`)); cuenta.textContent = "23 / 23";
      // la que no cuadra, arriba del todo para que se vea
      const mal = [...filas.children].find((x) => x.classList.contains("is-mal"));
      if (mal) filas.insertBefore(mal, filas.firstChild);
      return "espera2";
    },
    async a2(ctl, fin) {
      c = ctl; const pie = L.querySelector("[data-pie]");
      const rev = h(`<div class="fz-rev dm-entra"><p class="dm-mono">${t.nota}</p><div class="fz-rev-c"><div><span class="dm-mono">${t.leido}</span><b>IVA 10 %</b></div><div><span class="dm-mono">${t.habitual}</span><b>IVA 21 %</b></div></div><div class="dm-acciones"><button type="button" class="boton boton--principal" data-r="1">${t.corregir}</button><button type="button" class="boton" data-r="0">${t.correcto}</button></div></div>`);
      pie.replaceWith(rev); L.querySelector(".fz").classList.add("is-rev");
      rev.querySelector("[data-r]").focus({ preventScroll: true });
      const corrige = await new Promise((ok) => rev.addEventListener("click", (e) => { const r = e.target.closest("[data-r]"); if (r) ok(r.dataset.r === "1"); }));
      const mal = L.querySelector(".is-mal"); if (mal) { mal.classList.remove("is-mal"); const m = mal.querySelector("[data-marca]"); if (m) { m.className = "dm-chip dm-chip--ok"; m.textContent = t.ok; }
        // 1.240 € con IVA al 10 % son 1.127,27 € de base; al 21 % el total es 1.364,00 €
        if (corrige) { total += 124; mal.querySelector(".imp").textContent = euros(1364, en); } }
      rev.replaceWith(h(`<div class="fz-pie dm-entra"><span>${t.pie}</span><b>${euros(total, en)}</b></div>`));
      fin();
    },
    reset() { pinta(); },
  };
}

/* ============================================================== COMERCIAL */
function comercial(panel, t) {
  const L = panel.querySelector("[data-dm-lienzo]");
  let reloj = 0;
  const pinta = () => {
    L.innerHTML = `<div class="cm"><div class="cm-reloj"><span class="dm-mono">${panel.querySelector(".dm-ctx").textContent.split("·").pop().trim()}</span><b data-hora>18:40:00</b></div>
      <div class="cm-cuerpo"><div data-lead></div><ol class="cm-pasos" data-pasos></ol></div>
      <div class="cm-compara"><div><span class="dm-mono">${t.hoy}</span><b>${t.dias}</b></div><div data-con><span class="dm-mono">${t.con}</span><b>—</b></div></div></div>`;
  };
  const hora = (s) => { const el = L.querySelector("[data-hora]"); if (el) el.textContent = s; };
  const paso = (p, tu) => h(`<li class="dm-entra${tu ? " es-tu" : ""}"><span class="dm-mono">${p[0]}</span><span><b class="${tu ? "" : "dm-sis"}">${p[1]}</b><br><span class="dm-mono">${p[2]}</span></span></li>`);
  pinta();
  return {
    async a1(c) {
      const [n, que, msg] = t.lead;
      L.querySelector("[data-lead]").appendChild(h(`<div class="cm-lead dm-entra"><span class="dm-chip">Web · 18:40:00</span><b>${n}</b><p>${que}</p><p>${msg}</p><div data-borrador></div></div>`));
      const pasos = L.querySelector("[data-pasos]");
      for (const p of t.pasos) { await c.espera(900); hora(p[0]); pasos.appendChild(paso(p)); }
      L.querySelector("[data-borrador]").appendChild(h(`<p class="cm-borrador dm-entra">${t.borrador}</p>`));
      return "espera2";
    },
    async a2(c, fin) {
      const pasos = L.querySelector("[data-pasos]");
      pasos.classList.add("is-compacto"); hora(t.envio[0][0]); pasos.appendChild(paso(t.envio[0], true));
      await c.espera(700); pasos.appendChild(paso(t.envio[1]));
      const con = L.querySelector("[data-con]"); con.classList.add("es-ahora"); con.querySelector("b").textContent = t.min;
      fin();
    },
    reset() { clearInterval(reloj); pinta(); },
  };
}

/* ============================================================ OPERACIONES */
function operaciones(panel, t) {
  const L = panel.querySelector("[data-dm-lienzo]");
  const pos = (fila, dia, dias) => `left:calc(var(--q) + (100% - var(--q)) * ${dia} / 5 + 4px);top:calc(40px + (100% - 40px) * ${fila} / 3 + 6px);width:calc((100% - var(--q)) * ${dias} / 5 - 8px);height:calc((100% - 40px) / 3 - 12px)`;
  const bloque = (id, fila, dia, dias, a, b, cls = "") => `<div class="op-bloque ${cls}" data-b="${id}" style="${pos(fila, dia, dias)}"><b>${a}</b><span>${b}</span></div>`;
  const pinta = () => {
    const celdas = [`<div class="op-quien"></div>`, ...t.dias.map((d) => `<div class="op-dia">${d}</div>`)];
    t.quien.forEach((q) => { celdas.push(`<div class="op-quien">${q}</div>`); for (let i = 0; i < 5; i++) celdas.push("<div></div>"); });
    L.innerHTML = `<div class="op"><div class="op-cab"><b>${t.semana}</b><span class="dm-chip" data-estado>P-118</span></div>
      <div class="op-rej" style="--q:${matchMedia("(max-width: 640px)").matches ? "4.6rem" : "6.5rem"};grid-template-rows:40px repeat(3, 1fr)">${celdas.join("")}${t.previo.map(([f, d, n, a, b], i) => bloque("p" + i, f, d, n, a, b)).join("")}</div>
      <div class="op-pie" data-pie></div></div>`;
  };
  const chip = (txt, sis) => h(`<span class="dm-chip${sis ? " dm-chip--sis" : ""} dm-entra">${txt}</span>`);
  pinta();
  return {
    async a1(c) {
      const rej = L.querySelector(".op-rej"), pie = L.querySelector("[data-pie]");
      for (const [id, f, d, n, a, b] of t.nuevo) { await c.espera(420); rej.appendChild(h(bloque(id, f, d, n, a, b, "es-nuevo dm-entra"))); }
      for (const x of t.chips) { await c.espera(260); pie.appendChild(chip(x, true)); }
      return "espera2";
    },
    async a2(c, fin) {
      const pie = L.querySelector("[data-pie]"); pie.innerHTML = "";
      pie.appendChild(chip(t.retraso[0])); await c.espera(700);
      const mueve = (id, f, d, n) => { const b = L.querySelector(`[data-b="${id}"]`); if (!b) return; b.setAttribute("style", pos(f, d, n)); b.classList.add("es-movido"); };
      mueve("i1", 0, 3, 2); mueve("i2", 2, 3, 2);
      const pm = L.querySelector('[data-b="pm"]'); if (pm) { pm.style.opacity = "0"; }
      for (const x of t.retraso.slice(1)) { await c.espera(420); pie.appendChild(chip(x, true)); }
      fin();
    },
    reset() { pinta(); },
  };
}

/* =============================================================== ATENCIÓN */
function atencion(panel, t) {
  const L = panel.querySelector("[data-dm-lienzo]");
  let hechas = 0, fin = null, ocupado = false;
  const pinta = () => {
    hechas = 0;
    L.innerHTML = `<div class="at"><div class="at-chat"><div class="at-cab"><span class="punto"></span><span><b>${t.cab}</b><br><span class="dm-mono">${t.sub}</span></span></div>
      <div class="at-msgs" data-msgs><div class="at-m at-m--sis">${t.hola}</div></div>
      <div class="at-preg" data-preg>${t.preg.map((p, i) => `<button type="button" data-q="${i}">${p}</button>`).join("")}</div></div>
      <div class="at-datos">${t.fuentes.map(([a, b], i) => `<div class="at-fuente" data-f="${i}"><b>${a}</b><span class="dm-mono">${b}</span></div>`).join("")}</div></div>`;
  };
  const msg = (html, quien) => { const m = L.querySelector("[data-msgs]"); const el = h(`<div class="at-m at-m--${quien} dm-entra">${html}</div>`); m.appendChild(el); while (m.children.length > 6) m.firstElementChild.remove(); return el; };
  const responde = async (c, i) => {
    const m = L.querySelector("[data-msgs]"); const esc = h(`<div class="at-escribe" aria-hidden="true"><i></i><i></i><i></i></div>`); m.appendChild(esc);
    await c.espera(500); L.querySelector(`[data-f="${i}"]`)?.classList.add("is-leida");
    await c.espera(700); esc.remove();
    const r = msg(`${t.r[i]}<small>${t.rastro[i]}</small>`, "sis");
    return r;
  };
  pinta();
  const api = {
    async a1(c, terminar) {
      fin = terminar;
      L.querySelector("[data-preg]").addEventListener("click", async (e) => {
        const b = e.target.closest("[data-q]"); if (!b || ocupado || b.disabled) return;
        ocupado = true; b.disabled = true; api.fase(3);
        const i = +b.dataset.q; msg(t.preg[i], "el");
        try {
          const r = await responde(c, i);
          if (i === 0) {
            const hu = h(`<div class="at-huecos"><button type="button">17:30</button><button type="button">18:15</button></div>`); r.appendChild(hu);
            await new Promise((ok) => hu.addEventListener("click", (ev) => { const x = ev.target.closest("button"); if (!x) return; hu.remove(); msg(x.textContent, "el"); ok(); }));
            await c.espera(600); msg(`${t.reserva}<small>${t.reservaR}</small>`, "sis");
          }
        } catch (err) { return; }
        ocupado = false; hechas++;
        if (hechas >= 2 && fin) { fin(); fin = null; }
        else api.fase(2);
      });
      return "libre";
    },
    fase: () => {},
    reset() { pinta(); ocupado = false; },
  };
  return api;
}

/* ===================================================================== OS */
function os(panel, t) {
  const L = panel.querySelector("[data-dm-lienzo]");
  const P = [[18, 22], [50, 12], [82, 22], [88, 55], [72, 86], [28, 86], [12, 55]];
  let raf = 0;
  const pinta = () => {
    cancelAnimationFrame(raf);
    L.innerHTML = `<div class="os"><div class="os-mapa" data-mapa><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${P.map(([x, y], i) => `<line class="os-linea" x1="50" y1="50" x2="${x}" y2="${y}" vector-effect="non-scaling-stroke"/>`).join("")}<g data-pulsos></g></svg>
      ${P.map(([x, y], i) => `<div class="os-nodo" style="left:${x}%;top:${y}%"><i>${t.nodos[i].slice(0, 2).toUpperCase()}</i><span>${t.nodos[i]}</span></div>`).join("")}<div class="os-centro">${t.centro}</div></div>
      <div class="os-feed"><div class="os-feed-cab"><b>${t.act}</b><span class="dm-chip">${t.hoy}</span></div><ol class="os-ev" data-ev><li><span class="dm-mono">${t.sin}</span></li></ol><div class="os-parte" data-parte hidden></div></div></div>`;
  };
  // pulsos: el dato viaja de la herramienta al centro (solo con movimiento)
  const pulsos = () => {
    if (REDUCIDO) return;
    const g = L.querySelector("[data-pulsos]"); if (!g) return;
    const ps = P.map(([x, y], i) => { const c = document.createElementNS("http://www.w3.org/2000/svg", "ellipse"); c.setAttribute("rx", ".9"); c.setAttribute("ry", "1.4"); c.setAttribute("class", "os-pulso"); g.appendChild(c); return { c, x, y, t0: i * 0.37 }; });
    const paso = (now) => {
      if (!L.isConnected || panel.hidden) { raf = 0; return; }
      for (const p of ps) { const k = ((now / 1600 + p.t0) % 1); const e = k * k * (3 - 2 * k); p.c.setAttribute("cx", p.x + (50 - p.x) * e); p.c.setAttribute("cy", p.y + (50 - p.y) * e); p.c.style.opacity = String(Math.sin(k * Math.PI)); }
      raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
  };
  pinta();
  return {
    async a1(c) {
      L.querySelector("[data-mapa]").classList.add("is-conectado"); pulsos();
      const ev = L.querySelector("[data-ev]"); ev.innerHTML = "";
      for (const [n, a, b] of t.ev) { await c.espera(750); ev.insertBefore(h(`<li class="dm-entra"><span class="dm-mono">${t.nodos[n]}</span><b>${a}</b><span class="dm-mono dm-sis">${b}</span></li>`), ev.firstChild); while (ev.children.length > 5) ev.lastElementChild.remove(); }
      return "espera2";
    },
    async a2(c, fin) {
      const ev = L.querySelector("[data-ev]"); while (ev.children.length > 2) ev.lastElementChild.remove();
      const p = L.querySelector("[data-parte]"); p.hidden = false;
      p.innerHTML = `<span class="dm-chip dm-chip--sis">${t.parte[0]}</span>`;
      await c.espera(600);
      p.appendChild(h(`<p class="dm-entra">${t.parte[1]}</p>`)); p.appendChild(h(`<p class="dm-mono dm-entra">${t.parte[2]}</p>`));
      fin();
    },
    reset() { pinta(); },
  };
}

/* ================================================================ MÓVIL
   En el teléfono no se enseña la composición de escritorio (mesa + libro + tabla): se cuenta la MISMA historia en
   vertical, con una sola transformación a la vista, un número grande y como mucho tres líneas de detalle. */
function financeMovil(panel, t, en) {
  const L = panel.querySelector("[data-dm-lienzo]"); const m = t.movil; let total = 0;
  const pinta = () => { total = 0;
    L.innerHTML = `<div class="mv mv-fz"><div class="mv-cifra"><b data-n>23</b><span data-n-t>${m.antes}</span></div><div class="mv-barra"><i data-barra></i></div>
      <ol class="mv-filas" data-filas></ol><div class="mv-pie"><span>${t.pie}</span><b data-total>${euros(0, en)}</b></div></div>`; };
  pinta();
  return {
    async a1(c) {
      const n = L.querySelector("[data-n]"), nt = L.querySelector("[data-n-t]"), barra = L.querySelector("[data-barra]"), filas = L.querySelector("[data-filas]"), tot = L.querySelector("[data-total]");
      nt.textContent = m.hecho; n.textContent = "0";
      for (let i = 0; i < FACTURAS.length; i++) {
        await c.espera(i < 2 ? 380 : 70);
        const [p, con, imp] = FACTURAS[i]; total += imp;
        n.textContent = String(i + 1); barra.style.transform = `scaleX(${(i + 1) / FACTURAS.length})`; tot.textContent = euros(total, en);
        if (i !== MAL) { filas.insertBefore(h(`<li class="dm-entra"><span>${p}</span><span class="dm-mono">${euros(imp, en)}</span></li>`), filas.firstChild); while (filas.children.length > 2) filas.lastElementChild.remove(); }
      }
      filas.insertBefore(h(`<li class="mv-mal dm-entra" data-mal><span>${m.mal}</span><span class="dm-chip dm-chip--sis">${t.mal}</span></li>`), filas.firstChild);
      return "espera2";
    },
    async a2(c, fin) {
      const mal = L.querySelector("[data-mal]");
      const rev = h(`<div class="mv-rev dm-entra"><div><span class="dm-mono">${t.leido}</span><b>10 %</b></div><div><span class="dm-mono">${t.habitual}</span><b>21 %</b></div>
        <button type="button" class="boton boton--principal" data-r="1">${t.corregir}</button><button type="button" class="boton" data-r="0">${t.correcto}</button></div>`);
      mal.after(rev); rev.querySelector("[data-r]").focus({ preventScroll: true });
      const corrige = await new Promise((ok) => rev.addEventListener("click", (e) => { const r = e.target.closest("[data-r]"); if (r) ok(r.dataset.r === "1"); }));
      if (corrige) total += 124;
      rev.remove(); mal.classList.remove("mv-mal"); mal.lastElementChild.className = "dm-chip dm-chip--ok"; mal.lastElementChild.textContent = t.ok;
      L.querySelector("[data-total]").textContent = euros(total, en);
      L.querySelector("[data-n-t]").textContent = m.ahora;
      fin();
    },
    reset() { pinta(); },
  };
}
function comercialMovil(panel, t) {
  const L = panel.querySelector("[data-dm-lienzo]");
  const pinta = () => { L.innerHTML = `<div class="mv mv-cm"><div class="mv-cifra"><b data-hora>18:40</b><span>${t.lead[0]} · ${t.lead[1]}</span></div><ol class="mv-pasos" data-pasos></ol>
      <div class="mv-compara"><div><span class="dm-mono">${t.hoy}</span><b>${t.dias}</b></div><div data-con><span class="dm-mono">${t.con}</span><b>—</b></div></div></div>`; };
  const paso = (p, tu) => h(`<li class="dm-entra${tu ? " es-tu" : ""}"><span class="dm-mono">${p[0].slice(0, 5)}</span><b class="${tu ? "" : "dm-sis"}">${p[1]}</b></li>`);
  pinta();
  return {
    async a1(c) { const ps = L.querySelector("[data-pasos]"); for (const p of t.pasos) { await c.espera(700); ps.appendChild(paso(p)); } return "espera2"; },
    async a2(c, fin) { const ps = L.querySelector("[data-pasos]"); ps.appendChild(paso(t.envio[0], true)); L.querySelector("[data-hora]").textContent = "18:41";
      const con = L.querySelector("[data-con]"); con.classList.add("es-ahora"); con.querySelector("b").textContent = t.min; fin(); },
    reset() { pinta(); },
  };
}
function operacionesMovil(panel, t) {
  const L = panel.querySelector("[data-dm-lienzo]");
  const dia = (d, k) => `<div class="mv-dia" data-d="${k}"><span class="dm-mono">${d}</span><i></i></div>`;
  const pinta = () => { L.innerHTML = `<div class="mv mv-op"><div class="mv-cifra"><b data-estado>P-118</b><span>${t.semana}</span></div><div class="mv-semana">${t.dias.map(dia).join("")}</div><div class="mv-chips" data-pie></div></div>`; };
  const marca = (ks, cls, txt) => ks.forEach((k) => { const d = L.querySelector(`[data-d="${k}"]`); if (!d) return; d.classList.add(cls); if (txt !== undefined) d.querySelector("i").textContent = txt; });
  const chip = (x) => h(`<span class="dm-chip dm-chip--sis dm-entra">${x}</span>`);
  pinta();
  return {
    async a1(c) { await c.espera(300); marca([0], "es-visita", t.nuevo[0][4].split(" ")[0]); await c.espera(300); marca([2, 3], "es-obra", "P-118"); const pie = L.querySelector("[data-pie]"); for (const x of [t.chips[2], t.chips[3]]) { await c.espera(260); pie.appendChild(chip(x)); } return "espera2"; },
    async a2(c, fin) { const pie = L.querySelector("[data-pie]"); pie.innerHTML = ""; pie.appendChild(chip(t.retraso[0])); await c.espera(600);
      L.querySelectorAll(".es-obra").forEach((x) => { x.classList.remove("es-obra"); x.querySelector("i").textContent = ""; }); marca([3, 4], "es-obra", "P-118"); marca([3, 4], "es-movido");
      for (const x of [t.retraso[2], t.retraso[3]]) { await c.espera(360); pie.appendChild(chip(x)); } fin(); },
    reset() { pinta(); },
  };
}
function osMovil(panel, t) {
  const L = panel.querySelector("[data-dm-lienzo]");
  const pinta = () => { L.innerHTML = `<div class="mv mv-os"><ul class="mv-nodos" data-nodos>${t.nodos.map((x) => `<li>${x}</li>`).join("")}</ul><div class="mv-centro">${t.centro}</div><ol class="mv-ev" data-ev><li class="dm-mono">${t.sin}</li></ol><div data-parte></div></div>`; };
  pinta();
  return {
    async a1(c) { const ns = [...L.querySelectorAll("[data-nodos] li")]; for (const n of ns) { await c.espera(140); n.classList.add("is-on"); }
      L.querySelector(".mv-centro").classList.add("is-on"); const ev = L.querySelector("[data-ev]"); ev.innerHTML = "";
      for (const [n, a] of t.ev.slice(0, 3)) { await c.espera(600); ev.appendChild(h(`<li class="dm-entra"><span class="dm-mono">${t.nodos[n]}</span><b>${a}</b></li>`)); } return "espera2"; },
    async a2(c, fin) { L.querySelector("[data-parte]").appendChild(h(`<div class="mv-parte dm-entra"><span class="dm-chip dm-chip--sis">${t.parte[0]}</span><p>${t.parte[1]}</p></div>`)); fin(); },
    reset() { pinta(); },
  };
}
const MOVIL = { finance: financeMovil, comercial: comercialMovil, operaciones: operacionesMovil, os: osMovil };

const CONSTRUYE = { finance, comercial, operaciones, atencion, os };
const CLAVE = { finance: "fz", comercial: "cm", operaciones: "op", atencion: "at", os: "os" };

/* ============================================================ el escenario */
export function montarDemos(raiz) {
  const ENMOVIL = matchMedia("(max-width: 640px)").matches;
  raiz.classList.toggle("dm--movil", ENMOVIL);
  const en = raiz.dataset.lang === "en";
  const TX = T[en ? "en" : "es"];
  const pest = [...raiz.querySelectorAll("[data-dm-pest]")];
  const paneles = new Map([...raiz.querySelectorAll("[data-dm]")].map((p) => [p.dataset.dm, p]));
  const vivos = new Map();

  function montar(id) {
    if (vivos.has(id)) return vivos.get(id);
    const panel = paneles.get(id);
    const fases = [...panel.querySelectorAll(".dm-fases li")];
    const b1 = panel.querySelector('[data-dm-acc="1"]'), b2 = panel.querySelector('[data-dm-acc="2"]');
    const otra = panel.querySelector("[data-dm-otra]");
    const fase = (k) => fases.forEach((li, i) => { li.classList.toggle("is-hecha", i < k); li.classList.toggle("is-ahora", i === k); });
    let ctl = corrida();
    const demo = ((ENMOVIL && MOVIL[id]) || CONSTRUYE[id])(panel, TX[CLAVE[id]], en);
    demo.fase = fase;
    const fin = () => { fase(4); panel.classList.add("is-fin"); if (b2) b2.hidden = true; if (b1) b1.hidden = true; otra.hidden = false; };
    const empezar = () => { panel.classList.remove("is-fin"); otra.hidden = true; if (b1) { b1.hidden = false; b1.disabled = false; } if (b2) b2.hidden = true; fase(2); };
    b1?.addEventListener("click", async () => {
      b1.disabled = true; fase(3);
      try {
        const r = await demo.a1(ctl, fin);
        if (r === "espera2" && b2) { b1.hidden = true; b2.hidden = false; fase(2); b2.focus({ preventScroll: true }); }
        if (r === "libre") { b1.hidden = true; fase(2); panel.querySelector("[data-q]")?.focus({ preventScroll: true }); }
      } catch (e) { /* reiniciada a mitad */ }
    });
    b2?.addEventListener("click", async () => { b2.disabled = true; fase(3); try { await demo.a2(ctl, fin); } catch (e) { /* reiniciada */ } b2.disabled = false; });
    otra.addEventListener("click", () => { ctl.parar(); ctl = corrida(); demo.reset(); empezar(); b1?.focus({ preventScroll: true }); });
    empezar();
    vivos.set(id, demo);
    return demo;
  }

  function abrir(id, foco) {
    pest.forEach((b) => { const si = b.dataset.dmPest === id; b.setAttribute("aria-selected", si); b.tabIndex = si ? 0 : -1; if (si && foco) b.focus(); });
    paneles.forEach((p, k) => { p.hidden = k !== id; });
    montar(id);
  }
  pest.forEach((b, i) => {
    b.addEventListener("click", () => abrir(b.dataset.dmPest));
    b.addEventListener("keydown", (e) => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!k && e.key !== "Home" && e.key !== "End") return;
      e.preventDefault(); const j = e.key === "Home" ? 0 : e.key === "End" ? pest.length - 1 : (i + k + pest.length) % pest.length;
      abrir(pest[j].dataset.dmPest, true);
    });
  });
  abrir(pest[0].dataset.dmPest);
}
