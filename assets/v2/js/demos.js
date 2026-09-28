/* ==========================================================================
   D-CODE · DEMOS DE LA PORTADA (rev. 3, 28/09/2026 tarde)
   Cinco productos, cada uno con los mismos cinco tiempos (contexto → problema → TÚ → EL SISTEMA → resultado)
   y, desde la rev. 3, cada uno con SU escena en 3D, pensada para lo que hace:
     Finance      las facturas vuelan de la bandeja al libro (el flujo del dinero, con profundidad)
     Comercial    el lead recorre el embudo tendido en el suelo (movimiento comercial)
     Operaciones  el plan es una mesa de trabajo: los trabajos caen en su hueco y se levantan si hay que moverlos
     Atención     la conversación delante y, detrás, en profundidad, lo que el asistente consulta para responder
     D-Code OS    tres capas apiladas: tus herramientas, el sistema y tu día
   Todo es CSS 3D con transform y opacity (lo que la GPU compone sin repintar): sin librerías, sin WebGL, sin
   bucles continuos. Solo vive la demo abierta: al cambiar de pestaña, la anterior se para y se borra.
   Con movimiento reducido, los mismos pasos ocurren sin esperas ni vuelos.
   ========================================================================== */
const REDUCIDO = matchMedia("(prefers-reduced-motion: reduce)").matches;
const h = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const euros = (n, en) => (en ? "€" : "") + n.toLocaleString(en ? "en-GB" : "es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (en ? "" : " €");
const siguienteFotograma = () => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));

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
    fz: { antes: "facturas en el correo", hecho: "registradas", pie: "Pagos previstos esta semana", mal: "No cuadra", ok: "Revisada", leido: "En la factura", habitual: "Lo correcto", corregir: "Corregir a 21 %", correcto: "Es correcto así",
      nota: "Neumáticos Sur facturó al 10 %. Los neumáticos van al 21 %.", mas: "Ver las 23", ahora: "semana al día", vacia: "Bandeja vacía" },
    cm: { hoy: "Hoy", con: "Con el sistema", dias: "2 días hábiles", min: "1 minuto", carriles: ["Entra", "Clasificado", "Asignado", "Respondido"], lead: ["María Gómez", "Reforma de cocina · Pozuelo"],
      etiquetas: ["Web · 18:40", "Prioridad alta · presupuesto y plazo claros", "Laura · zona oeste, la que menos carga tiene", "Respuesta con dos huecos de su agenda"], horas: ["18:40:00", "18:40:02", "18:40:03", "18:40:05"],
      borrador: "Hola, María: para una cocina antes de Navidad lo mejor es ver el espacio cuanto antes. ¿Te viene bien el martes a las 10:00 o el miércoles a las 17:30? — Laura",
      enviado: "Enviada por Laura · 18:41", cita: "Martes 10:00 · en la agenda de Laura" },
    op: { semana: "Semana 41", quien: ["Andrés", "Bea", "Carlos"], dias: ["Lun", "Mar", "Mié", "Jue", "Vie"],
      previo: [[0, 0, 2, "Mantenimiento"], [1, 2, 1, "Avería"], [2, 0, 1, "Revisión"]],
      nuevo: [["v", 1, 0, 1, "Visita P-118"], ["i1", 0, 2, 2, "Instalación P-118"], ["i2", 2, 2, 2, "Instalación P-118"]],
      chips: ["5 tareas creadas", "Material pedido: llega el martes", "Cliente avisado"],
      retraso: ["El material llegará el miércoles", "Instalación movida a jueves y viernes", "Cliente avisado de la nueva fecha"] },
    at: { cab: "Clínica Sonrisa · asistente", sub: "Responde con la agenda real", hola: "Hola, soy el asistente de Clínica Sonrisa. ¿En qué te ayudo?",
      preg: ["¿Tenéis hueco el jueves por la tarde?", "¿Cuánto cuesta una limpieza?", "Quiero reclamar una factura"],
      fuentes: [["Agenda", "Jueves 2 · libre 17:30 y 18:15"], ["Tarifas 2026", "Limpieza 55 € · con revisión 70 €"], ["Protocolo", "Reclamaciones: siempre a una persona"]],
      r: ["Sí: el jueves 2 tengo libre a las 17:30 y a las 18:15. ¿Te reservo alguna?", "Una limpieza cuesta 55 €; con revisión, 70 €. ¿Te busco hueco?", "Esto prefiero que lo vea una persona: he pasado tu caso a recepción y te llamarán el lunes a primera hora."],
      rastro: ["Consultado: agenda", "Fuente: tarifas 2026", "Tarea para recepción · lunes 9:00"],
      reserva: "Hecho: jueves 2 a las 18:15 con la Dra. Ruiz. Te llegará un SMS.", reservaR: "Reservado en la agenda · 22:16" },
    os: { capas: ["Tus herramientas", "D-Code OS", "Tu día"], nodos: ["Web", "WhatsApp", "Correo", "Holded", "Banco", "Agenda", "Excel"],
      ev: ["Lead nuevo · asignado a Laura", "23 facturas · registradas", "Cita jueves 18:15 · en la agenda", "Cobro 2.420 € · conciliado"],
      parte: ["Parte del día", "1 lead nuevo, ya respondido. 23 facturas registradas; una la revisaste tú. 1 cobro conciliado. Nada pendiente para hoy."] },
  },
  en: {
    fz: { antes: "invoices in the inbox", hecho: "recorded", pie: "Payments due this week", mal: "Doesn't add up", ok: "Reviewed", leido: "On the invoice", habitual: "Correct rate", corregir: "Correct to 21%", correcto: "It's right as is",
      nota: "Neumáticos Sur charged 10% VAT. Tyres are 21%.", mas: "See all 23", ahora: "week up to date", vacia: "Inbox empty" },
    cm: { hoy: "Today", con: "With the system", dias: "2 working days", min: "1 minute", carriles: ["In", "Classified", "Assigned", "Answered"], lead: ["María Gómez", "Kitchen renovation · Pozuelo"],
      etiquetas: ["Web · 18:40", "High priority · clear budget and deadline", "Laura · west area, the lightest workload", "Reply with two slots from her calendar"], horas: ["18:40:00", "18:40:02", "18:40:03", "18:40:05"],
      borrador: "Hi María, for a kitchen before Christmas it's best to see the space soon. Would Tuesday at 10:00 or Wednesday at 17:30 work? — Laura",
      enviado: "Sent by Laura · 18:41", cita: "Tuesday 10:00 · in Laura's calendar" },
    op: { semana: "Week 41", quien: ["Andrés", "Bea", "Carlos"], dias: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      previo: [[0, 0, 2, "Maintenance"], [1, 2, 1, "Repair"], [2, 0, 1, "Inspection"]],
      nuevo: [["v", 1, 0, 1, "Visit P-118"], ["i1", 0, 2, 2, "Install P-118"], ["i2", 2, 2, 2, "Install P-118"]],
      chips: ["5 tasks created", "Material ordered: arrives Tuesday", "Customer told"],
      retraso: ["The material will arrive on Wednesday", "Install moved to Thursday and Friday", "Customer told the new date"] },
    at: { cab: "Sonrisa Clinic · assistant", sub: "Answers with the real calendar", hola: "Hi, I'm the Sonrisa Clinic assistant. How can I help?",
      preg: ["Do you have a slot on Thursday afternoon?", "How much is a cleaning?", "I want to dispute an invoice"],
      fuentes: [["Calendar", "Thursday 2 · free 17:30 and 18:15"], ["2026 prices", "Cleaning €55 · with check-up €70"], ["Protocol", "Complaints: always to a person"]],
      r: ["Yes: on Thursday 2 I have 17:30 and 18:15 free. Shall I book one?", "A cleaning is €55; with a check-up, €70. Shall I find you a slot?", "I'd rather a person handled this: I've passed your case to reception and they'll call you first thing on Monday."],
      rastro: ["Checked: calendar", "Source: 2026 prices", "Task for reception · Monday 9:00"],
      reserva: "Done: Thursday 2 at 18:15 with Dr Ruiz. You'll get a text.", reservaR: "Booked in the calendar · 22:16" },
    os: { capas: ["Your tools", "D-Code OS", "Your day"], nodos: ["Web", "WhatsApp", "Email", "Holded", "Bank", "Calendar", "Excel"],
      ev: ["New lead · assigned to Laura", "23 invoices · recorded", "Appointment Thu 18:15 · booked", "Payment €2,420 · reconciled"],
      parte: ["Daily report", "1 new lead, already answered. 23 invoices recorded; you reviewed one. 1 payment reconciled. Nothing pending today."] },
  },
};

/* Facturas del taller: proveedor, concepto, total. La 15 (Neumáticos Sur) viene con el IVA mal. */
const FACTURAS = [["Recambios Sur", "Pastillas y discos ×14", 1843.2], ["Neumáticos Sur", "205/55 R16 ×8", 624], ["Lubricantes Centro", "Aceite 5W-30 · 208 l", 1290.5], ["Recambios Sur", "Filtros ×40", 412.8], ["Grúas Leganés", "Remolque ×3", 285], ["Luz", "Agosto", 698.3], ["Herramientas Ruiz", "Llave dinamométrica", 189.9], ["Pinturas Oeste", "Pintura y barniz", 356.4], ["Recambios Sur", "Correas de distribución ×6", 934], ["Gases Industriales", "Gas de aire acondicionado", 248], ["Limpiezas Vega", "Septiembre", 320], ["Telefonía Norte", "Líneas y fibra", 96.8], ["Seguros Castilla", "Cuota trimestral", 1120], ["Alquiler de la nave", "Octubre", 2200], ["Neumáticos Sur", "225/45 R17 ×4", 512], ["Recambios Sur", "Baterías ×5", 480], ["Diagnosis Pro", "Licencia", 145], ["Papelería Centro", "Material de oficina", 58.4], ["Recambios Sur", "Amortiguadores ×4", 396], ["Residuos Sur", "Aceite usado", 90], ["Suministros Levante", "Guantes y trapos", 74.2], ["Asesoría Vega", "Septiembre", 290], ["Agua", "Agosto", 38.9]];
const MAL = 14, BIEN = 563.2;   // 512 € con IVA al 10 % → base 465,45 €; al 21 %, 563,20 €

/* ================================================================ FINANCE */
function finance(panel, t, en, movil) {
  const L = panel.querySelector("[data-dm-lienzo]");
  let total = 0, cuantas = 0;
  const hoja = (i) => { const [p, , tot] = FACTURAS[i % FACTURAS.length]; return `<div class="fz3-hoja"><b>${p}</b><i></i><i></i><i style="width:55%"></i><span>${euros(tot, en)}</span></div>`; };
  const pinta = () => {
    total = 0; cuantas = 0;
    L.innerHTML = `<div class="fz3"><div class="fz3-mesa" data-vacia="${t.vacia}" aria-hidden="true"><div class="fz3-pila" data-pila>${[0, 1, 2, 3, 4, 5].map((k) => `<div class="fz3-capa" style="--k:${k}">${hoja(5 - k)}</div>`).join("")}</div></div>
      <div class="fz3-libro" data-libro><div class="fz3-cifra"><b data-n>23</b><span data-n-t>${t.antes}</span></div><ol class="fz3-filas" data-filas></ol>
        <div class="fz3-total"><span>${t.pie}</span><b data-total>${euros(0, en)}</b></div></div></div>`;
  };
  pinta();
  // una hoja vuela de la pila al libro: se crea fuera de la pila (en el espacio 3D del lienzo) y se anima con transform
  const vuela = (i, desde, hacia) => {
    const x = h(`<div class="fz3-vuelo" aria-hidden="true" style="left:${desde.x}px;top:${desde.y}px;width:${desde.w}px">${hoja(i)}</div>`);
    L.firstElementChild.appendChild(x);
    requestAnimationFrame(() => { x.style.transform = `translate3d(${hacia.x - desde.x}px, ${hacia.y - desde.y}px, 60px) rotateX(0deg) rotateZ(0deg) scale(.22)`; x.style.opacity = "0"; });
    setTimeout(() => x.remove(), REDUCIDO ? 0 : 760);
  };
  return {
    async a1(c) {
      const fz = L.firstElementChild, pila = L.querySelector("[data-pila]"), filas = L.querySelector("[data-filas]"), n = L.querySelector("[data-n]"), nt = L.querySelector("[data-n-t]"), tot = L.querySelector("[data-total]");
      const r0 = fz.getBoundingClientRect(), rp = pila.getBoundingClientRect(), rl = L.querySelector("[data-filas]").getBoundingClientRect();
      const desde = { x: rp.left - r0.left, y: rp.top - r0.top, w: rp.width }, hacia = { x: rl.left - r0.left + rl.width * 0.2, y: rl.top - r0.top - 10 };
      nt.textContent = t.hecho; n.textContent = "0"; fz.classList.add("is-leyendo");
      for (let i = 0; i < FACTURAS.length; i++) {
        await c.espera(i < 3 ? 420 : 95);
        if (!REDUCIDO && !movil) vuela(i, desde, hacia);   // en el teléfono, sin vuelos: la pila baja y el número sube
        if (i % 4 === 3) { const capa = pila.lastElementChild; if (capa && pila.children.length > 1) capa.remove(); }
        const [p, con, imp] = FACTURAS[i]; total += imp; cuantas = i + 1;
        n.textContent = String(cuantas);
        if (movil && i % 4 !== 3 && i !== FACTURAS.length - 1) continue;   // en el teléfono, la lista y el total se actualizan a saltos (menos trabajo por fotograma)
        tot.textContent = euros(total, en);
        if (i !== MAL) { filas.insertBefore(h(`<li class="dm-entra"><span><b>${p}</b><span>${con}</span></span><span class="dm-mono">${euros(imp, en)}</span></li>`), filas.firstChild); while (filas.children.length > 3) filas.lastElementChild.remove(); }
      }
      fz.classList.remove("is-leyendo"); pila.replaceChildren(); fz.classList.add("is-vacia");
      filas.insertBefore(h(`<li class="fz3-mal dm-entra" data-mal><span><b>${FACTURAS[MAL][0]}</b><span>${FACTURAS[MAL][1]}</span></span><span class="dm-chip dm-chip--sis">${t.mal}</span></li>`), filas.firstChild);
      while (filas.children.length > 3) filas.lastElementChild.remove();
      return "espera2";
    },
    async a2(c, fin) {
      const fz = L.firstElementChild;
      // la factura que no cuadra se acerca (sale del libro hacia ti), con las dos respuestas posibles
      const rev = h(`<div class="fz3-rev"><p>${t.nota}</p><div class="fz3-rev-c"><div><span class="dm-mono">${t.leido}</span><b>10 %</b></div><div><span class="dm-mono">${t.habitual}</span><b>21 %</b></div></div>
        <div class="dm-acciones"><button type="button" class="boton boton--principal" data-r="1">${t.corregir}</button><button type="button" class="boton" data-r="0">${t.correcto}</button></div></div>`);
      fz.appendChild(rev); await siguienteFotograma(); rev.classList.add("is-cerca"); fz.classList.add("is-rev");
      rev.querySelector("[data-r]").focus({ preventScroll: true });
      const corrige = await new Promise((ok) => rev.addEventListener("click", (e) => { const r = e.target.closest("[data-r]"); if (r) ok(r.dataset.r === "1"); }));
      rev.classList.remove("is-cerca"); fz.classList.remove("is-rev"); await c.espera(360); rev.remove();
      if (corrige) total += BIEN - FACTURAS[MAL][2];
      const mal = L.querySelector("[data-mal]"); if (mal) { mal.classList.remove("fz3-mal"); const ch = mal.querySelector(".dm-chip"); ch.className = "dm-chip dm-chip--ok"; ch.textContent = t.ok; }
      L.querySelector("[data-total]").textContent = euros(total, en); L.querySelector("[data-n-t]").textContent = t.ahora;
      // el detalle, solo si se pide (divulgación progresiva)
      const lista = FACTURAS.map(([p, con, imp], i) => `<li><span><b>${p}</b><span>${con}</span></span><span class="dm-mono">${euros(i === MAL && corrige ? BIEN : imp, en)}</span></li>`).join("");
      L.querySelector("[data-libro]").appendChild(h(`<details class="fz3-mas dm-entra"><summary>${t.mas}</summary><ol class="fz3-filas fz3-todas">${lista}</ol></details>`));
      fin();
    },
    reset() { pinta(); },
  };
}

/* ============================================================== COMERCIAL */
function comercial(panel, t) {
  const L = panel.querySelector("[data-dm-lienzo]");
  const pinta = () => {
    L.innerHTML = `<div class="cm3"><div class="cm3-reloj"><span class="dm-mono">${panel.querySelector(".dm-ctx").textContent.split("·").pop().trim().split(",")[0]}</span><b data-hora>18:40:00</b></div>
      <div class="cm3-escena"><div class="cm3-suelo">${t.carriles.map((c, i) => `<div class="cm3-carril" style="--i:${i}"><span>${c}</span></div>`).join("")}
        <div class="cm3-lead" data-lead style="--k:0"><b>${t.lead[0]}</b><span>${t.lead[1]}</span><em data-tag>${t.etiquetas[0]}</em></div></div></div>
      <div class="cm3-borrador" data-borrador hidden><p>${t.borrador}</p></div>
      <div class="cm3-compara"><div><span class="dm-mono">${t.hoy}</span><b>${t.dias}</b></div><div data-con><span class="dm-mono">${t.con}</span><b>—</b></div></div></div>`;
  };
  pinta();
  return {
    async a1(c) {
      const lead = L.querySelector("[data-lead]"), tag = L.querySelector("[data-tag]"), hora = L.querySelector("[data-hora]");
      lead.classList.add("is-dentro");
      for (let k = 1; k < 4; k++) {
        await c.espera(1000); lead.style.setProperty("--k", k); tag.textContent = t.etiquetas[k]; hora.textContent = t.horas[k];
        L.querySelector(`.cm3-carril[style*="--i:${k}"]`)?.classList.add("is-on");
      }
      await c.espera(500); const b = L.querySelector("[data-borrador]"); b.hidden = false; await siguienteFotograma(); b.classList.add("is-arriba");
      return "espera2";
    },
    async a2(c, fin) {
      const b = L.querySelector("[data-borrador]"); b.classList.add("is-enviado"); L.querySelector("[data-hora]").textContent = "18:41:12";
      await c.espera(500); b.hidden = true;
      const lead = L.querySelector("[data-lead]"); lead.classList.add("is-enviado"); L.querySelector("[data-tag]").textContent = t.enviado;
      lead.appendChild(h(`<em class="cm3-cita dm-entra">${t.cita}</em>`));
      const con = L.querySelector("[data-con]"); con.classList.add("es-ahora"); con.querySelector("b").textContent = t.min;
      fin();
    },
    reset() { pinta(); },
  };
}

/* ============================================================ OPERACIONES */
function operaciones(panel, t) {
  const L = panel.querySelector("[data-dm-lienzo]");
  const bloque = (id, f, d, n, a, cls = "") => `<div class="op3-b ${cls}" data-b="${id}" style="--f:${f};--d:${d};--n:${n}"><b>${a}</b></div>`;
  const pinta = () => {
    L.innerHTML = `<div class="op3"><div class="op3-cab"><b>${t.semana}</b><span class="dm-chip" data-estado>P-118</span></div>
      <div class="op3-escena"><div class="op3-mesa">
        <div class="op3-dias">${t.dias.map((d) => `<span>${d}</span>`).join("")}</div>
        <div class="op3-rej">${t.quien.map((q) => `<div class="op3-fila"><span>${q}</span></div>`).join("")}${t.previo.map(([f, d, n, a], i) => bloque("p" + i, f, d, n, a, "es-previo")).join("")}</div>
      </div></div>
      <div class="op3-chips" data-pie></div></div>`;
  };
  const chip = (txt, sis) => h(`<span class="dm-chip${sis ? " dm-chip--sis" : ""} dm-entra">${txt}</span>`);
  pinta();
  return {
    async a1(c) {
      const rej = L.querySelector(".op3-rej"), pie = L.querySelector("[data-pie]");
      for (const [id, f, d, n, a] of t.nuevo) { await c.espera(480); const b = h(bloque(id, f, d, n, a, "es-nuevo")); rej.appendChild(b); await siguienteFotograma(); b.classList.add("is-puesto"); }
      for (const x of t.chips) { await c.espera(300); pie.appendChild(chip(x, true)); }
      return "espera2";
    },
    async a2(c, fin) {
      const pie = L.querySelector("[data-pie]"); pie.replaceChildren(chip(t.retraso[0]));
      await c.espera(600);
      const mueve = async (id, d) => { const b = L.querySelector(`[data-b="${id}"]`); if (!b) return; b.classList.add("is-alzado"); await c.espera(380); b.style.setProperty("--d", d); await c.espera(520); b.classList.remove("is-alzado"); b.classList.add("es-movido"); };
      await Promise.all([mueve("i1", 3), mueve("i2", 3)]);
      for (const x of t.retraso.slice(1)) { await c.espera(360); pie.appendChild(chip(x, true)); }
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
    L.innerHTML = `<div class="at3"><div class="at3-escena"><div class="at3-fuentes">${t.fuentes.map(([a, b], i) => `<div class="at3-fuente" data-f="${i}" style="--i:${i}"><b>${a}</b><span class="dm-mono">${b}</span></div>`).join("")}</div>
      <div class="at3-chat"><div class="at3-cab"><span class="punto"></span><span><b>${t.cab}</b><br><span class="dm-mono">${t.sub}</span></span></div>
      <div class="at3-msgs" data-msgs><div class="at3-m at3-m--sis">${t.hola}</div></div>
      <div class="at3-preg" data-preg>${t.preg.map((p, i) => `<button type="button" data-q="${i}">${p}</button>`).join("")}</div></div></div></div>`;
  };
  const msg = (html, quien) => { const m = L.querySelector("[data-msgs]"); const el = h(`<div class="at3-m at3-m--${quien} dm-entra">${html}</div>`); m.appendChild(el); while (m.children.length > 5) m.firstElementChild.remove(); m.scrollTop = m.scrollHeight; return el; };
  const responde = async (c, i) => {
    const m = L.querySelector("[data-msgs]"); const esc = h(`<div class="at3-escribe" aria-hidden="true"><i></i><i></i><i></i></div>`); m.appendChild(esc);
    const f = L.querySelector(`[data-f="${i}"]`); await c.espera(450); f?.classList.add("is-leida");
    await c.espera(800); esc.remove(); f?.classList.remove("is-leida"); f?.classList.add("is-usada");
    return msg(`${t.r[i]}<small>${t.rastro[i]}</small>`, "sis");
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
            const hu = h(`<div class="at3-huecos"><button type="button">17:30</button><button type="button">18:15</button></div>`); r.appendChild(hu);
            await new Promise((ok) => hu.addEventListener("click", (ev) => { const x = ev.target.closest("button"); if (!x) return; hu.remove(); msg(x.textContent, "el"); ok(); }));
            await c.espera(600); msg(`${t.reserva}<small>${t.reservaR}</small>`, "sis");
          }
        } catch (err) { return; }
        ocupado = false; hechas++;
        if (hechas >= 2 && fin) { fin(); fin = null; } else api.fase(2);
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
  const pinta = () => {
    L.innerHTML = `<div class="os3"><div class="os3-escena"><div class="os3-pila" data-pila>
        <div class="os3-capa os3-capa--1" style="--c:0"><span class="os3-et">${t.capas[0]}</span><div class="os3-nodos">${t.nodos.map((x) => `<span>${x}</span>`).join("")}</div></div>
        <div class="os3-capa os3-capa--2" style="--c:1"><span class="os3-et">${t.capas[1]}</span><div class="os3-nucleo"><i></i><b>D-Code OS</b></div></div>
        <div class="os3-capa os3-capa--3" style="--c:2"><span class="os3-et">${t.capas[2]}</span><div class="os3-ev" data-ev></div></div>
      </div></div><div class="os3-parte" data-parte hidden></div></div>`;
  };
  pinta();
  return {
    async a1(c) {
      const pila = L.querySelector("[data-pila]"); pila.classList.add("is-abierta");
      const nodos = [...L.querySelectorAll(".os3-nodos span")];
      for (const n of nodos) { await c.espera(120); n.classList.add("is-on"); }
      L.querySelector(".os3-nucleo").classList.add("is-on");
      const ev = L.querySelector("[data-ev]");
      for (const x of t.ev) { await c.espera(650); ev.appendChild(h(`<span class="dm-entra">${x}</span>`)); }
      return "espera2";
    },
    async a2(c, fin) {
      const p = L.querySelector("[data-parte]"); p.hidden = false;
      p.innerHTML = `<span class="dm-chip dm-chip--sis">${t.parte[0]}</span><p>${t.parte[1]}</p>`;
      await siguienteFotograma(); p.classList.add("is-arriba");
      fin();
    },
    reset() { pinta(); },
  };
}

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
  let viva = null;   // solo una demo montada a la vez: { id, parar() }

  function montar(id) {
    if (viva?.id === id) return;
    viva?.parar();
    const panel = paneles.get(id);
    const fases = [...panel.querySelectorAll(".dm-fases li")];
    // botones nuevos en cada montaje (sin escuchas de montajes anteriores)
    panel.querySelectorAll("[data-dm-acc], [data-dm-otra]").forEach((b) => b.replaceWith(b.cloneNode(true)));
    const b1 = panel.querySelector('[data-dm-acc="1"]'), b2 = panel.querySelector('[data-dm-acc="2"]'), otra = panel.querySelector("[data-dm-otra]");
    const fase = (k) => fases.forEach((li, i) => { li.classList.toggle("is-hecha", i < k); li.classList.toggle("is-ahora", i === k); });
    let ctl = corrida();
    const demo = CONSTRUYE[id](panel, TX[CLAVE[id]], en, ENMOVIL);
    demo.fase = fase;
    const fin = () => { fase(4); panel.classList.add("is-fin"); if (b2) b2.hidden = true; if (b1) b1.hidden = true; otra.hidden = false; };
    const empezar = () => { panel.classList.remove("is-fin"); otra.hidden = true; if (b1) { b1.hidden = false; b1.disabled = false; } if (b2) { b2.hidden = true; b2.disabled = false; } fase(2); };
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
    viva = { id, parar() { ctl.parar(); panel.querySelector("[data-dm-lienzo]").replaceChildren(); panel.classList.remove("is-fin"); } };
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
