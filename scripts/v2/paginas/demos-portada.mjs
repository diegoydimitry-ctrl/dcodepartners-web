/* ==========================================================================
   DEMOS DE LA PORTADA · cinco experiencias de producto (ES / EN)
   Cada demo cuenta lo mismo en cinco tiempos:
     CONTEXTO → PROBLEMA → TÚ (una acción) → EL SISTEMA (transformación) → RESULTADO
   Todo el texto está en el HTML (se indexa y se lee sin JavaScript); el
   comportamiento lo pone assets/v2/js/demos.js. Datos inventados y marcados.
   ========================================================================== */
import { FLECHA } from "../plantilla.mjs";

export const DEMOS = {
  es: {
    h2: "No te lo contamos. Tócalo.",
    sub: "Cinco sistemas, un minuto cada uno. Los datos son inventados; lo que hacen, no.",
    fases: ["Contexto", "Problema", "Tú", "El sistema", "Resultado"],
    completa: "Abrir la aplicación completa",
    reiniciar: "Otra vez",
    aviso: "Demostración · empresas ficticias · ningún sistema real conectado.",
    cerrar: "Cerrar la demo", pantalla: "Mejor en un ordenador.",
    lista: [
      {
        id: "finance", pest: "Finance", marca: ["BR", "Taller Brío"], ctx: "Taller mecánico · Leganés · 9 personas · martes, 9:10",
        t: "Finance registra solas tus facturas de proveedor.",
        prob: "El taller recibe 23 a la semana y hoy se teclean a mano: dos horas, y algún IVA mal puesto.",
        acc: "Suelta las facturas", acc2: "Revisar la que no cuadra",
        res: "23 facturas registradas en 38 segundos. Tú solo miraste una.",
        app: "finance",
      },
      {
        id: "comercial", pest: "Comercial", marca: ["AI", "Alba Interiorismo"], ctx: "Estudio de interiorismo · 3 comerciales · viernes, 18:40",
        t: "Entra un lead por la web un viernes por la tarde.",
        prob: "Hoy lo vería alguien el lunes, cuando ya habrá pedido presupuesto a otros dos estudios.",
        acc: "Que entre el lead", acc2: "Aprobar y enviar",
        res: "Primera respuesta en un minuto, no en dos días. El lead tiene dueña, respuesta y seguimiento en la agenda.",
        app: "comercial",
      },
      {
        id: "operaciones", pest: "Operaciones", marca: ["CL", "Climatec"], ctx: "Instalaciones de climatización · 8 técnicos · lunes, 8:00",
        t: "El cliente acaba de aceptar el presupuesto P-118.",
        prob: "Planificarlo lleva dos días de hojas y llamadas, y los retrasos se ven el mismo día.",
        acc: "Aceptar el presupuesto", acc2: "Simular: el material llega tarde",
        res: "Planificado en tres segundos. El retraso se vio dos días antes y el cliente ya tiene su nueva fecha.",
        app: "operaciones",
      },
      {
        id: "atencion", pest: "Atención", marca: ["CS", "Clínica Sonrisa"], ctx: "Clínica dental · 2 recepcionistas · sábado, 22:15",
        t: "Alguien escribe fuera de horario.",
        prob: "Hasta el lunes nadie contesta, y cuatro de cada diez no vuelven a escribir.",
        acc: "Elige qué pregunta", acc2: "",
        res: "Respondido en segundos, con la agenda real. Lo delicado lo decide una persona el lunes a primera hora.",
        app: "atencion",
      },
      {
        id: "os", pest: "D-Code OS", marca: ["OS", "Toda la empresa"], ctx: "La misma empresa, vista entera",
        t: "Siete herramientas. Nadie ve el conjunto.",
        prob: "Saber qué ha pasado hoy obliga a abrir siete pestañas y preguntar a tres personas.",
        acc: "Conectar con D-Code OS", acc2: "¿Qué ha pasado hoy?",
        res: "Todo lo que pasa, en un solo sitio y con su rastro. Y un parte del día escrito solo.",
        app: "os",
      },
    ],
  },
  en: {
    h2: "Don't take our word for it. Try it.",
    sub: "Five systems, one minute each. The data is invented; what they do is not.",
    fases: ["Context", "Problem", "You", "The system", "Result"],
    completa: "Open the full application",
    reiniciar: "Again",
    aviso: "Demo · fictional companies · no real system connected.",
    cerrar: "Close the demo", pantalla: "Better on a computer.",
    lista: [
      {
        id: "finance", pest: "Finance", marca: ["BR", "Brío Car Repair"], ctx: "Car repair workshop · Leganés · 9 people · Tuesday, 9:10",
        t: "Finance records your supplier invoices by itself.",
        prob: "The workshop gets 23 a week and today they're typed in by hand: two hours, and the odd wrong VAT rate.",
        acc: "Drop the invoices", acc2: "Review the one that doesn't add up",
        res: "23 invoices recorded in 38 seconds. You only looked at one.",
        app: "finance",
      },
      {
        id: "comercial", pest: "Sales", marca: ["AI", "Alba Interiors"], ctx: "Interior design studio · 3 sales people · Friday, 18:40",
        t: "A lead comes in through the website on a Friday evening.",
        prob: "Today someone would see it on Monday, when they'll already have asked two other studios.",
        acc: "Let the lead in", acc2: "Approve and send",
        res: "First reply in one minute, not two days. The lead has an owner, an answer and a follow-up in the calendar.",
        app: "comercial",
      },
      {
        id: "operaciones", pest: "Operations", marca: ["CL", "Climatec"], ctx: "HVAC installers · 8 technicians · Monday, 8:00",
        t: "The customer has just accepted quote P-118.",
        prob: "Planning it takes two days of spreadsheets and calls, and delays show up on the day.",
        acc: "Accept the quote", acc2: "Simulate: the material is late",
        res: "Planned in three seconds. The delay was seen two days early and the customer already has the new date.",
        app: "operaciones",
      },
      {
        id: "atencion", pest: "Service", marca: ["CS", "Sonrisa Clinic"], ctx: "Dental clinic · 2 receptionists · Saturday, 22:15",
        t: "Someone writes outside opening hours.",
        prob: "Nobody answers until Monday, and four in ten never write again.",
        acc: "Pick a question", acc2: "",
        res: "Answered in seconds, with the real calendar. Sensitive matters are decided by a person first thing on Monday.",
        app: "atencion",
      },
      {
        id: "os", pest: "D-Code OS", marca: ["OS", "The whole company"], ctx: "The same company, seen whole",
        t: "Seven tools. Nobody sees the whole.",
        prob: "Knowing what happened today means opening seven tabs and asking three people.",
        acc: "Connect D-Code OS", acc2: "What happened today?",
        res: "Everything that happens, in one place and with its trail. And a daily report written by itself.",
        app: "os",
      },
    ],
  },
};

export function seccionDemos(lang) {
  const d = DEMOS[lang];
  return `<section class="bloque bloque--aire tocalo" id="tocalo" data-escena="anillo" data-lado="der" data-intensidad=".4" aria-labelledby="h-tocalo">
  <div class="marco">
    <div class="tocalo-cab"><h2 class="h2 aparece" id="h-tocalo">${d.h2}</h2><p class="lead aparece" style="--i:1">${d.sub}</p></div>
    <div class="dm" data-demos data-lang="${lang}">
      <div class="dm-pest" role="tablist" aria-label="Demos">
        ${d.lista.map((x, i) => `<button type="button" role="tab" class="dm-p" id="dm-p-${x.id}" aria-controls="dm-${x.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-dm-pest="${x.id}"><span class="dm-p-n">0${i + 1}</span>${x.pest}</button>`).join("")}
      </div>
      ${d.lista.map((x, i) => `<div class="dm-panel dm-panel--${x.id}" id="dm-${x.id}" role="tabpanel" aria-labelledby="dm-p-${x.id}" data-dm="${x.id}"${i ? " hidden" : ""}>
        <div class="dm-guion">
          <p class="dm-marca"><span class="dm-marca-i" aria-hidden="true">${x.marca[0]}</span><span><b>${x.marca[1]}</b><span class="dm-ctx">${x.ctx}</span></span></p>
          <h3 class="dm-t">${x.t}</h3>
          <p class="dm-prob">${x.prob}</p>
        </div>
        <div class="dm-lienzo" data-dm-lienzo role="group" aria-label="${x.pest}"></div>
        <div class="dm-mando">
          <ol class="dm-fases" aria-hidden="true">${d.fases.map((f, k) => `<li data-fase="${k}"${k < 2 ? ' class="is-hecha"' : ""}>${f}</li>`).join("")}</ol>
          <div class="dm-acciones" data-dm-acciones>
            ${x.acc ? `<button type="button" class="boton boton--principal dm-acc" data-dm-acc="1">${x.acc}</button>` : ""}
            ${x.acc2 ? `<button type="button" class="boton dm-acc" data-dm-acc="2" hidden>${x.acc2}</button>` : ""}
          </div>
          <p class="dm-res" data-dm-res aria-live="polite"><span class="dm-res-t">${x.res}</span></p>
          <div class="dm-pie"><button type="button" class="enlace dm-otra" data-dm-otra hidden>${d.reiniciar}</button><button type="button" class="enlace" data-demo-abrir="${x.app}">${d.completa} ${FLECHA}</button></div>
        </div>
      </div>`).join("\n      ")}
    </div>
    <p class="rotulo tocalo-aviso">${d.aviso}</p>
    <dialog class="visor" data-visor aria-label="Demo">
      <div class="visor-cab"><p class="rotulo" data-visor-t></p><p class="rotulo visor-tel">${d.pantalla}</p><button type="button" class="ctrl" data-visor-cerrar aria-label="${d.cerrar}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
      <iframe data-visor-marco title="Demo"></iframe>
    </dialog>
  </div>
</section>`;
}

/* La demo de Finance sola, para su página (rev. 29/09): el mismo producto que en «Tócalo», sin las otras pestañas.
   Lleva su propio visor para «Abrir la aplicación completa». */
export function seccionDemoFinance(lang) {
  const d = DEMOS[lang]; const x = d.lista.find((y) => y.id === "finance");
  const T = lang === "en" ? { h: "Try it: drop the invoices.", sub: "Made-up data. Nothing is connected to a real system." } : { h: "Pruébalo: suelta las facturas.", sub: "Datos inventados. Nada está conectado a un sistema real." };
  return `<section class="capitulo fin-demo" aria-labelledby="demo">
  <div class="marco">
    <div class="fin-demo-cab"><h2 class="h2" id="demo">${T.h}</h2><p class="lead">${T.sub}</p></div>
    <div class="dm dm--solo" data-demos data-lang="${lang}">
      <div class="dm-pest" role="tablist" aria-label="Demo" hidden><button type="button" role="tab" class="dm-p" id="dm-p-${x.id}" aria-controls="dm-${x.id}" aria-selected="true" tabindex="0" data-dm-pest="${x.id}">${x.pest}</button></div>
      <div class="dm-panel dm-panel--${x.id}" id="dm-${x.id}" role="tabpanel" aria-labelledby="dm-p-${x.id}" data-dm="${x.id}">
        <div class="dm-guion">
          <p class="dm-marca"><span class="dm-marca-i" aria-hidden="true">${x.marca[0]}</span><span><b>${x.marca[1]}</b><span class="dm-ctx">${x.ctx}</span></span></p>
          <h3 class="dm-t">${x.t}</h3>
          <p class="dm-prob">${x.prob}</p>
        </div>
        <div class="dm-lienzo" data-dm-lienzo role="group" aria-label="${x.pest}"></div>
        <div class="dm-mando">
          <ol class="dm-fases" aria-hidden="true">${d.fases.map((f, k) => `<li data-fase="${k}"${k < 2 ? ' class="is-hecha"' : ""}>${f}</li>`).join("")}</ol>
          <div class="dm-acciones" data-dm-acciones>
            <button type="button" class="boton boton--principal dm-acc" data-dm-acc="1">${x.acc}</button>
            <button type="button" class="boton dm-acc" data-dm-acc="2" hidden>${x.acc2}</button>
          </div>
          <p class="dm-res" data-dm-res aria-live="polite"><span class="dm-res-t">${x.res}</span></p>
          <div class="dm-pie"><button type="button" class="enlace dm-otra" data-dm-otra hidden>${d.reiniciar}</button><button type="button" class="enlace" data-demo-abrir="${x.app}">${d.completa} ${FLECHA}</button></div>
        </div>
      </div>
    </div>
    <dialog class="visor" data-visor aria-label="Demo">
      <div class="visor-cab"><p class="rotulo" data-visor-t></p><p class="rotulo visor-tel">${d.pantalla}</p><button type="button" class="ctrl" data-visor-cerrar aria-label="${d.cerrar}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
      <iframe data-visor-marco title="Demo"></iframe>
    </dialog>
  </div>
</section>`;
}
