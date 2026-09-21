/*
 * Lo que la web dice sobre VERI*FACTU y la conciliación, en función del
 * estado. Cada región de las páginas es una función de (cfg, idioma): si el
 * estado cambia, cambia el texto; si nadie cambia el estado, nadie puede
 * cambiar el texto sin que check-estado.mjs lo cace.
 *
 * Reglas de redacción que este fichero se impone:
 *  - Solo se afirma lo que el estado sostiene. Lo que no ha pasado va en
 *    futuro y con su etiqueta («Próximamente», «Siguiente»).
 *  - Nunca: implantado, certificado, homologado, 100 % conforme, «cumple».
 *    El centinela lo barre también aquí dentro.
 *  - Las fechas que se enseñan salen de la evidencia, no de la redacción.
 */
import crypto from 'node:crypto';
import { VF, CONC, PLANES, vfN, concN, fechaLarga, fechaCorta } from './modelo.mjs';

const T = (lang, es, en) => (lang === 'en' ? en : es);
const vfLabel = (cfg, lang) => VF[cfg.verifactu.estado][lang === 'en' ? 'en' : 'es'];
const concLabel = (cfg, lang) => CONC[cfg.conciliacion.estado][lang === 'en' ? 'en' : 'es'];
const ev = (cfg) => cfg.verifactu.evidencia || {};
const evc = (cfg) => cfg.conciliacion.evidencia || {};
const qr = (cfg) => !!cfg.verifactu.qrEnFactura;
const futuro = (cfg) => concN(cfg) < 4;   // la conciliación todavía no se puede usar

export const chipVF = (cfg, lang, corto = false) =>
  `<span class="estado-chip" data-vf="${vfN(cfg)}">${corto ? VF[cfg.verifactu.estado][lang === 'en' ? 'cortoEn' : 'cortoEs'] : vfLabel(cfg, lang)}</span>`;
export const chipConc = (cfg, lang) =>
  `<span class="estado-chip" data-conc="${concN(cfg)}">${concLabel(cfg, lang)}</span>`;

/* ════════════════════════ VERI*FACTU ════════════════════════ */

// Qué hace falta para ESTAR en cada estado. Se enseña en la pista de cuatro
// pasos: es el criterio, no una promesa de fecha.
const CRITERIO = {
  'preparado':     ['Registro, huella y cadena de cada factura, dentro del sistema.', 'Record, fingerprint and chain for every invoice, inside the system.'],
  'en-validacion': ['Registros remitidos al entorno de pruebas de la AEAT, con sus respuestas revisadas.', 'Records sent to the AEAT test environment, with their responses checked.'],
  'integrado':     ['Remisión validada de extremo a extremo con la especificación oficial.', 'Submission validated end to end against the official specification.'],
  'operativo':     ['Remisión real en producción y declaración responsable firmada.', 'Live submission in production and the responsible declaration signed.'],
};

function titularVF(cfg, lang) {
  return {
    'preparado':     T(lang, 'Cada factura, registrada y encadenada desde que se emite.', 'Every invoice, recorded and chained from the moment it is issued.'),
    'en-validacion': T(lang, 'La remisión a la AEAT, en pruebas con la propia AEAT.', 'Submission to the AEAT, being tested with the AEAT itself.'),
    'integrado':     T(lang, 'La remisión a la AEAT, integrada y validada.', 'Submission to the AEAT, integrated and validated.'),
    'operativo':     T(lang, 'Cada factura, registrada, encadenada y remitida a la AEAT.', 'Every invoice, recorded, chained and submitted to the AEAT.'),
  }[cfg.verifactu.estado];
}

function entradillaVF(cfg, lang) {
  const e = ev(cfg);
  const f = (x) => fechaLarga(x, lang);
  switch (cfg.verifactu.estado) {
    case 'preparado': return T(lang,
      'D-Code Finance lleva el registro de facturación encadenado e inalterable desde la emisión: cada factura genera su registro, con una huella que enlaza con la del anterior, y cada anulación deja el suyo. El siguiente paso es la remisión a la AEAT. Cuando esté probada, esta página lo dirá.',
      'D-Code Finance keeps a chained, unalterable invoicing record from the moment of issue: every invoice produces its record, with a fingerprint linked to the previous one, and every cancellation leaves its own. The next step is submission to the AEAT. When it has been proven, this page will say so.');
    case 'en-validacion': return T(lang,
      `El registro de cada factura ya se genera y se encadena, y la remisión a la AEAT está en validación: desde el ${f(e.remisionPruebas.fecha)} los registros se envían al entorno de pruebas de la AEAT y se revisan sus respuestas. Todavía no se remite en producción.`,
      `Every invoice record is already produced and chained, and submission to the AEAT is in validation: since ${f(e.remisionPruebas.fecha)} records are sent to the AEAT test environment and their responses are checked. Nothing is submitted in production yet.`);
    case 'integrado': return T(lang,
      `La remisión a la AEAT está integrada y validada de extremo a extremo desde el ${f(e.validacion.fecha)}, con la huella y el formato del registro contrastados con la especificación oficial. Lo que queda es el paso a producción.`,
      `Submission to the AEAT has been integrated and validated end to end since ${f(e.validacion.fecha)}, with the record's fingerprint and format checked against the official specification. What remains is the move to production.`);
    case 'operativo': return T(lang,
      `Los registros se remiten a la AEAT en producción desde el ${f(e.remisionProduccion.fecha)}, y la declaración responsable del sistema está firmada desde el ${f(e.declaracionResponsable.fecha)}.`,
      `Records have been submitted to the AEAT in production since ${f(e.remisionProduccion.fecha)}, and the system's responsible declaration has been signed since ${f(e.declaracionResponsable.fecha)}.`);
  }
}

function loQueHace(cfg, lang) {
  const n = vfN(cfg);
  const l = [
    T(lang, '<b>Registro de alta</b> al emitir cada factura, y <b>de anulación</b> al anularla.', '<b>An issue record</b> when each invoice is issued, and <b>a cancellation record</b> when it is cancelled.'),
    T(lang, '<b>Huella encadenada:</b> cada registro guarda la del anterior, en una sola cadena por empresa emisora.', '<b>Chained fingerprint:</b> every record keeps the previous one’s, in a single chain per issuing company.'),
    T(lang, '<b>Sin huecos silenciosos:</b> si el registro no se puede encadenar, la factura no se emite.', '<b>No silent gaps:</b> if the record cannot be chained, the invoice is not issued.'),
    T(lang, '<b>Comprobación de la cadena</b> en pantalla: huecos, duplicados, bifurcaciones y eslabones rotos.', '<b>Chain check</b> on screen: gaps, duplicates, forks and broken links.'),
    T(lang, '<b>Registro de eventos</b> del sistema (art. 9.1 del RD 1007/2023), encadenados entre sí.', '<b>System event log</b> (art. 9.1 of RD 1007/2023), chained together.'),
  ];
  if (n >= 2) l.push(T(lang, '<b>Remisión al entorno de pruebas</b> de la AEAT, con cada respuesta guardada.', '<b>Submission to the AEAT test environment</b>, with every response stored.'));
  if (n >= 3) l.push(T(lang, '<b>Huella y formato</b> del registro contrastados con la especificación oficial.', 'Record <b>fingerprint and format</b> checked against the official specification.'));
  if (n >= 4) l.push(T(lang, '<b>Remisión en producción</b> de cada registro a la AEAT.', '<b>Live submission</b> of every record to the AEAT.'));
  if (qr(cfg)) l.push(T(lang, '<b>Código QR de cotejo</b> impreso en cada factura.', '<b>Verification QR code</b> printed on every invoice.'));
  return l;
}

function loQueLlega(cfg, lang) {
  const n = vfN(cfg), l = [];
  if (n < 2) l.push(T(lang, 'La remisión de cada registro a la AEAT, primero en su entorno de pruebas.', 'Submission of every record to the AEAT, first in its test environment.'));
  if (n < 3) l.push(T(lang, 'La huella y el formato del registro, contrastados con la especificación oficial.', 'The record’s fingerprint and format, checked against the official specification.'));
  if (!qr(cfg)) l.push(T(lang, 'El código QR de cotejo, impreso en cada factura.', 'The verification QR code, printed on every invoice.'));
  if (n < 4) l.push(T(lang, 'La remisión en producción y la declaración responsable del sistema, firmada.', 'Live submission in production and the system’s responsible declaration, signed.'));
  return l;
}

// Una cadena de ejemplo con huellas SHA-256 de verdad sobre datos
// ficticios: que se vea la forma exacta de lo que se guarda.
function cadenaEjemplo(lang) {
  const regs = [
    ['F-2026-0140', T(lang, 'Alta', 'Issue')],
    ['F-2026-0141', T(lang, 'Alta', 'Issue')],
    ['F-2026-0141', T(lang, 'Anulación', 'Cancellation')],
    ['F-2026-0142', T(lang, 'Alta', 'Issue')],
  ];
  const h = (s) => crypto.createHash('sha256').update(s).digest('hex').toUpperCase();
  const corta = (x) => x.slice(0, 8) + '…' + x.slice(-4);
  let prev = h('B00000000|F-2026-0139|alta');
  return regs.map(([num, tipo], i) => {
    const cur = h(`B00000000|${num}|${tipo}|${prev}`);
    const li = `<li class="vf-eslabon" style="--i:${i}"><span class="vf-e-tipo${i === 2 ? ' es-anula' : ''}">${tipo}</span><b class="vf-e-num">${num}</b>` +
      `<span class="vf-e-h"><em>${T(lang, 'Anterior', 'Previous')}</em><code>${corta(prev)}</code></span>` +
      `<span class="vf-e-h vf-e-h--esta"><em>${T(lang, 'Huella', 'Fingerprint')}</em><code>${corta(cur)}</code></span>` +
      `<span class="vf-e-ok" aria-hidden="true"></span></li>`;
    prev = cur;
    return li;
  }).join('\n            ');
}

export function vfBloque(cfg, lang) {
  const n = vfN(cfg);
  const cal = cfg.calendario;
  const pasos = Object.entries(VF).map(([id, s]) => {
    const clase = s.n < n ? 'es-hecho' : s.n === n ? 'es-actual' : s.n === n + 1 ? 'es-siguiente' : 'es-despues';
    const marca = s.n < n ? T(lang, 'Hecho', 'Done') : s.n === n ? T(lang, 'Estado actual', 'Current state') : s.n === n + 1 ? T(lang, 'Siguiente', 'Next') : T(lang, 'Después', 'Later');
    return `<li class="vf-paso ${clase}"${s.n === n ? ' aria-current="step"' : ''}>` +
      `<span class="vf-paso-n">0${s.n}</span><b class="vf-paso-t">${lang === 'en' ? s.en : s.es}</b>` +
      `<span class="vf-paso-d">${CRITERIO[id][lang === 'en' ? 1 : 0]}</span><span class="vf-paso-e">${marca}</span></li>`;
  }).join('\n        ');
  const llega = loQueLlega(cfg, lang);
  return `
  <section class="section-air edge-top vf" id="verifactu" data-amb="violeta" data-vf-estado="${cfg.verifactu.estado}" aria-labelledby="vf-t">
    <div class="container">
      <div class="vf-grid">
        <div class="vf-intro rise">
          <span class="eyebrow">${T(lang, 'Registro fiscal · VERI*FACTU', 'Tax register · VERI*FACTU')}</span>
          <p class="vf-sello" data-vf="${n}"><i aria-hidden="true"></i><span>${vfLabel(cfg, lang)}</span></p>
          <h2 class="h-title" id="vf-t">${titularVF(cfg, lang)}</h2>
          <p class="lead">${entradillaVF(cfg, lang)}</p>
        </div>
        <figure class="vf-cadena rise">
          <ol class="vf-eslabones" aria-label="${T(lang, 'Cuatro registros encadenados, de ejemplo', 'Four chained records, as an example')}">
            ${cadenaEjemplo(lang)}
          </ol>
          <figcaption>${T(lang, 'Ilustración con datos ficticios y huellas SHA-256 reales. Cada registro guarda la huella del anterior: si alguien tocara uno, la cadena se rompería justo ahí.', 'Illustration with made-up data and real SHA-256 fingerprints. Every record keeps the previous one’s fingerprint: if someone touched one, the chain would break right there.')}</figcaption>
        </figure>
      </div>
      <ol class="vf-track" aria-label="${T(lang, 'Los cuatro estados de VERI*FACTU en D-Code Finance', 'The four VERI*FACTU states in D-Code Finance')}">
        ${pasos}
      </ol>
      <div class="vf-dos">
        <div class="vf-col vf-col--hoy">
          <p class="vf-col-t">${T(lang, 'Lo que ya hace', 'What it already does')}</p>
          <ul class="vf-l">
            ${loQueHace(cfg, lang).map((x) => `<li>${x}</li>`).join('\n            ')}
          </ul>
        </div>${llega.length ? `
        <div class="vf-col vf-col--luego">
          <p class="vf-col-t">${T(lang, 'Lo que llega con los siguientes pasos', 'What comes with the next steps')}</p>
          <ul class="vf-l">
            ${llega.map((x) => `<li>${x}</li>`).join('\n            ')}
          </ul>
        </div>` : ''}
      </div>
      <div class="vf-pie">
        <p class="vf-cal"><b>${T(lang, 'Plazo de adaptación', 'Adaptation deadline')}</b> ${T(lang,
          `Sociedades, antes del ${fechaLarga(cal.sociedades, lang)}; resto de obligados, antes del ${fechaLarga(cal.resto, lang)}. Fuente: <a href="${cal.url}" rel="noopener" target="_blank">nota informativa de la AEAT</a> sobre el ${cal.norma} (consultada el ${fechaCorta(cal.consultado)}).`,
          `Companies paying Corporate Tax, before ${fechaLarga(cal.sociedades, lang)}; everyone else, before ${fechaLarga(cal.resto, lang)}. Source: <a href="${cal.url}" rel="noopener" target="_blank">AEAT information note</a> on ${cal.norma.replace('Real Decreto-ley', 'Royal Decree-Law').replace(', de 2 de diciembre', ' of 2 December')} (checked ${fechaCorta(cal.consultado)}).`)}</p>
        <p class="vf-nota">${T(lang,
          `Este estado no se escribe a mano: sale de un registro que solo cambia cuando el equipo de D-Code Finance aporta la prueba de cada paso. Última revisión: ${fechaCorta(cfg.revisado)}.`,
          `This state is not typed by hand: it comes from a record that only changes when the D-Code Finance team provides the proof for each step. Last reviewed: ${fechaCorta(cfg.revisado)}.`)}</p>
      </div>
    </div>
  </section>
  `;
}

// La línea corta del estado, para la ficha técnica y la portada.
function fraseVF(cfg, lang) {
  return {
    'preparado':     T(lang, 'La remisión a la AEAT es el siguiente paso.', 'Submission to the AEAT is the next step.'),
    'en-validacion': T(lang, 'La remisión a la AEAT está en pruebas; todavía no en producción.', 'Submission to the AEAT is being tested; not in production yet.'),
    'integrado':     T(lang, 'La remisión a la AEAT está integrada y validada; falta el paso a producción.', 'Submission to the AEAT is integrated and validated; the move to production remains.'),
    'operativo':     T(lang, 'Cada registro se remite a la AEAT.', 'Every record is submitted to the AEAT.'),
  }[cfg.verifactu.estado];
}

export function vfFicha(cfg, lang) {
  return `${chipVF(cfg, lang)} ${T(lang,
    'Registro de facturación encadenado e inalterable desde la emisión: cada factura queda enlazada a la anterior con su huella, y una pantalla comprueba que la cadena está entera.',
    'A chained, unalterable invoicing record from the moment of issue: every invoice is linked to the previous one with its fingerprint, and a screen checks the chain is whole.')} ${fraseVF(cfg, lang)} <a href="#verifactu">${T(lang, 'En qué punto está', 'Where it stands')}</a>`;
}

export function vfFrase(cfg, lang) {
  return {
    'preparado':     T(lang, 'registro fiscal preparado para VERI*FACTU', 'a tax register ready for VERI*FACTU'),
    'en-validacion': T(lang, 'registro fiscal con la integración VERI*FACTU en validación', 'a tax register with its VERI*FACTU integration in validation'),
    'integrado':     T(lang, 'registro fiscal con VERI*FACTU integrado', 'a tax register with VERI*FACTU integrated'),
    'operativo':     T(lang, 'registro fiscal con VERI*FACTU operativo', 'a tax register with VERI*FACTU operational'),
  }[cfg.verifactu.estado];
}

/* ════════════════════════ CONCILIACIÓN ════════════════════════ */

function concNota(cfg, lang, corta = false) {
  const e = evc(cfg), f = (x) => fechaLarga(x, lang);
  switch (cfg.conciliacion.estado) {
    case 'planificada': return corta
      ? T(lang, 'Todavía no está en el sistema: es la siguiente pieza de D-Code Finance.', 'It is not in the system yet: it is the next piece of D-Code Finance.')
      : T(lang, 'Todavía no está en el sistema: es la siguiente pieza de D-Code Finance. Cuando cambie de estado, esta página lo dirá, y los planes también.', 'It is not in the system yet: it is the next piece of D-Code Finance. When its state changes, this page will say so, and so will the plans.');
    case 'en-desarrollo': return T(lang, `Se está construyendo en D-Code Finance desde el ${f(e.desarrollo.fecha)}. Todavía no se puede usar.`, `Being built in D-Code Finance since ${f(e.desarrollo.fecha)}. It cannot be used yet.`);
    case 'en-pruebas': return T(lang, `En pruebas desde el ${f(e.pruebas.fecha)}. Todavía no está abierta a clientes.`, `In testing since ${f(e.pruebas.fecha)}. Not open to clients yet.`);
    case 'disponible': return T(lang, `Disponible en D-Code Finance desde el ${f(e.disponible.fecha)}.`, `Available in D-Code Finance since ${f(e.disponible.fecha)}.`);
  }
}

function concPuntos(cfg, lang) {
  return futuro(cfg) ? [
    T(lang, 'Subirás el extracto del banco como fichero.', 'You will upload the bank statement as a file.'),
    T(lang, 'Cada cobro se cruzará con su factura, y cada cargo con su gasto.', 'Every incoming payment will be matched to its invoice, and every charge to its expense.'),
    T(lang, 'Lo que no cuadre se quedará señalado para que lo mires, en vez de asignarse a ojo.', 'Whatever does not match will stay flagged for you to look at, instead of being assigned by eye.'),
    T(lang, 'Y Pregunta a Finanzas podrá decirte qué movimientos siguen sin identificar.', 'And Ask Finance will be able to tell you which movements are still unidentified.'),
  ] : [
    T(lang, 'Subes el extracto del banco como fichero.', 'You upload the bank statement as a file.'),
    T(lang, 'Cada cobro se cruza con su factura, y cada cargo con su gasto.', 'Every incoming payment is matched to its invoice, and every charge to its expense.'),
    T(lang, 'Lo que no cuadra se queda señalado para que lo mires, en vez de asignarse a ojo.', 'Whatever does not match stays flagged for you to look at, instead of being assigned by eye.'),
    T(lang, 'Y Pregunta a Finanzas te dice qué movimientos siguen sin identificar.', 'And Ask Finance tells you which movements are still unidentified.'),
  ];
}

function concMovs(cfg, lang) {
  const M = [
    ['02/09', T(lang, 'Transferencia · Vandria Logística', 'Transfer · Vandria Logística'), '+2.420,00 €', '+€2,420.00', 'F-2026-0131', true],
    ['04/09', T(lang, 'Recibo · Nubalia Cloud', 'Direct debit · Nubalia Cloud'), '−186,34 €', '−€186.34', T(lang, 'Gasto G-0412', 'Expense G-0412'), true],
    ['09/09', T(lang, 'Transferencia · Estudio Orbe', 'Transfer · Estudio Orbe'), '+1.210,00 €', '+€1,210.00', 'F-2026-0137', true],
    ['12/09', T(lang, 'Cargo tarjeta · TPV 88213', 'Card charge · POS 88213'), '−64,90 €', '−€64.90', null, false],
    ['15/09', T(lang, 'Transferencia sin concepto', 'Transfer with no reference'), '+300,00 €', '+€300.00', null, false],
  ];
  return M.map(([d, c, iEs, iEn, con, ok]) =>
    `<li class="conc-mov ${ok ? 'es-cuadra' : 'es-suelto'}"><span class="conc-mov-f">${d}</span><span class="conc-mov-c">${c}</span>` +
    `<b class="conc-mov-i">${lang === 'en' ? iEn : iEs}</b>` +
    `<span class="conc-mov-x">${ok ? `→ ${con}` : T(lang, 'Sin identificar', 'Unidentified')}</span>` +
    `<span class="conc-mov-e">${ok ? T(lang, 'Cuadra', 'Matches') : T(lang, 'Para revisar', 'To review')}</span></li>`
  ).join('\n              ');
}

export function concBloque(cfg, lang) {
  return `
  <section class="section-air edge-top conc" id="conciliacion" data-amb="cian" data-conc-estado="${cfg.conciliacion.estado}" aria-labelledby="conc-t">
    <div class="container">
      <div class="conc-grid">
        <div class="conc-intro rise">
          <span class="eyebrow">${futuro(cfg) ? T(lang, 'La siguiente pieza', 'The next piece') : T(lang, 'Conciliación bancaria', 'Bank reconciliation')}</span>
          <p class="vf-sello" data-conc="${concN(cfg)}"><i aria-hidden="true"></i><span>${futuro(cfg) ? T(lang, 'Conciliación bancaria · ', 'Bank reconciliation · ') : ''}${concLabel(cfg, lang)}</span></p>
          <h2 class="h-title" id="conc-t">${T(lang, 'El extracto del banco, cruzado con lo que ya tienes.', 'Your bank statement, matched against what you already have.')}</h2>
          <ul class="conc-l">
            ${concPuntos(cfg, lang).map((x) => `<li>${x}</li>`).join('\n            ')}
          </ul>
          <p class="conc-nota">${concNota(cfg, lang)}</p>
        </div>
        <figure class="conc-fig rise">
          <p class="conc-fig-t"><span>${T(lang, 'Extracto · septiembre', 'Statement · September')}</span><span>${T(lang, '3 cuadran · 2 para revisar', '3 match · 2 to review')}</span></p>
          <ul class="conc-movs">
              ${concMovs(cfg, lang)}
          </ul>
          <figcaption>${futuro(cfg) ? T(lang, 'Así funcionará · ilustración con datos ficticios.', 'How it will work · illustration with made-up data.') : T(lang, 'Ilustración con datos ficticios.', 'Illustration with made-up data.')}</figcaption>
        </figure>
      </div>
    </div>
  </section>
  `;
}

// Plan en el que aparece por primera vez (los planes son acumulativos).
function primerPlan(cfg) {
  const inc = cfg.conciliacion.incluidaEn || [];
  return PLANES.find((p) => inc.includes(p)) || null;
}
export function concPlan(plan) {
  return (cfg, lang) => {
    if (primerPlan(cfg) !== plan) return '';
    return `<li><b>${T(lang, 'Conciliación bancaria', 'Bank reconciliation')}</b> ${chipConc(cfg, lang)} ${futuro(cfg)
      ? T(lang, 'Cruzará el extracto del banco con tus facturas y tus gastos, y dejará señalado lo que no cuadre. <a href="#conciliacion">Cómo funcionará</a>', 'It will match your bank statement against your invoices and expenses, and flag whatever does not match. <a href="#conciliacion">How it will work</a>')
      : T(lang, 'Cruza el extracto del banco con tus facturas y tus gastos, y deja señalado lo que no cuadra.', 'It matches your bank statement against your invoices and expenses, and flags whatever does not match.')}</li>`;
  };
}

export function concConexion(cfg, lang) {
  const f = futuro(cfg);
  return `<div class="conexion rise"><b>${T(lang, 'Tu banco', 'Your bank')}</b><span>${f
    ? T(lang, 'El extracto entrará como fichero y se cruzará con tus facturas y tus gastos. Lo que no cuadre se marcará en vez de asignarse a ojo.', 'The statement will come in as a file and be matched against your invoices and expenses. Whatever does not match will be flagged instead of assigned by eye.')
    : T(lang, 'El extracto entra como fichero y se cruza con tus facturas y tus gastos. Lo que no cuadra se marca en vez de asignarse a ojo.', 'The statement comes in as a file and is matched against your invoices and expenses. Whatever does not match is flagged instead of assigned by eye.')}</span><i class="conexion-e ${f ? 'es-estudio' : 'es-lista'}">${f ? concLabel(cfg, lang) : T(lang, 'Por fichero', 'By file')}</i></div>`;
}

/* ════════════════════════ COMPARATIVA DE PLANES ════════════════════════ */

const SI = (lang) => `<span class="cmp-si" role="img" aria-label="${T(lang, 'Incluido', 'Included')}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7"/></svg></span>`;
const NO = (lang) => `<span class="cmp-no" role="img" aria-label="${T(lang, 'No incluido', 'Not included')}">—</span>`;

// En móvil la tabla se convierte en filas de tres casillas y cada casilla
// dice de qué plan es (data-p): así no hay que desplazarse de lado.
const CORTO = { es: ['Finance', 'Con inteligencia', 'A medida'], en: ['Finance', 'With intelligence', 'Made to measure'] };
const td = (lang, desde, n, html, extra = '') => {
  const p = CORTO[lang === 'en' ? 'en' : 'es'].slice(desde, desde + n).join(' · ');
  return `<td data-p="${n === 3 ? T(lang, 'Los tres planes', 'All three plans') : p}"${n > 1 ? ` colspan="${n}" class="c${n}${extra ? ' ' + extra : ''}"` : extra ? ` class="${extra}"` : ''}>${html}</td>`;
};

export function comparativa(cfg, lang) {
  const inc = cfg.conciliacion.incluidaEn || [];
  const concCeldas = (() => {
    const desde = PLANES.findIndex((p) => inc.includes(p));
    if (desde < 0) return PLANES.map((_, i) => td(lang, i, 1, NO(lang))).join('');
    return PLANES.slice(0, desde).map((_, i) => td(lang, i, 1, NO(lang))).join('') +
      td(lang, desde, PLANES.length - desde, chipConc(cfg, lang), 'cmp-estado');
  })();
  const fila = (t, celdas) => `<tr><th scope="row">${t}</th>${celdas}</tr>`;
  const tres = (a, b, c) => [a, b, c].map((x, i) => td(lang, i, 1, x)).join('');
  const filas = [
    fila(T(lang, 'Facturas, cobros, gastos y pagos', 'Invoices, collections, expenses and payments'), tres(SI(lang), SI(lang), SI(lang))),
    fila(T(lang, 'Presupuestos, pedidos, albaranes y proyectos', 'Quotes, orders, delivery notes and projects'), tres(SI(lang), SI(lang), SI(lang))),
    fila(T(lang, 'Tesorería a 30, 60 y 90 días y radar de avisos', 'Cash forecast at 30, 60 and 90 days and alert radar'), tres(SI(lang), SI(lang), SI(lang))),
    fila(T(lang, 'Libros de IVA en CSV para tu gestoría', 'VAT books in CSV for your accountant'), tres(SI(lang), SI(lang), SI(lang))),
    fila(T(lang, 'Registro fiscal', 'Tax register'), td(lang, 0, 3, `${chipVF(cfg, lang)} <a href="#verifactu">${T(lang, 'Qué significa', 'What it means')}</a>`, 'cmp-estado')),
    fila(T(lang, 'Lectura de documentos: PDF, foto, Excel o CSV', 'Document reading: PDF, photo, Excel or CSV'), tres(NO(lang), SI(lang), SI(lang))),
    fila(T(lang, 'Pregunta a Finanzas', 'Ask Finance'), tres(NO(lang), SI(lang), SI(lang))),
    fila(T(lang, 'Conciliación bancaria', 'Bank reconciliation'), concCeldas),
    fila(T(lang, 'Campos, flujos y paneles propios', 'Your own fields, flows and dashboards'), tres(NO(lang), NO(lang), SI(lang))),
    fila(T(lang, 'Conexiones con tus herramientas', 'Connections with your tools'), tres(NO(lang), `<span class="cmp-txt">${T(lang, 'Se presupuestan aparte', 'Quoted separately')}</span>`, SI(lang))),
    fila(T(lang, 'Personas', 'People'), tres(`<span class="cmp-txt">${T(lang, 'Hasta 3', 'Up to 3')}</span>`, `<span class="cmp-txt">${T(lang, 'Hasta 10', 'Up to 10')}</span>`, `<span class="cmp-txt">${T(lang, 'Sin límite', 'No limit')}</span>`)),
    fila(T(lang, 'Puesta en marcha', 'Getting started'), td(lang, 0, 2, `<span class="cmp-txt">${T(lang, 'En 1 día, una vez validado el formulario', 'In 1 day, once the form is validated')}</span>`) + td(lang, 2, 1, `<span class="cmp-txt">${T(lang, 'Primero el diseño, que apruebas; después la implantación', 'Design first, for your approval; then the rollout')}</span>`)),
  ].join('\n            ');
  return `
      <div class="cmp rise">
        <p class="cmp-t">${T(lang, 'Los tres planes, fila a fila', 'The three plans, row by row')}</p>
        <div class="cmp-scroll" tabindex="0" role="region" aria-label="${T(lang, 'Comparativa de los tres planes', 'Comparison of the three plans')}">
          <table class="cmp-tabla">
            <colgroup><col class="cmp-c0"><col><col class="es-destacado"><col></colgroup>
            <thead><tr><th scope="col"><span class="sr-only">${T(lang, 'Qué incluye', 'What it includes')}</span></th><th scope="col">Finance</th><th scope="col" class="es-destacado">${T(lang, 'Finance con inteligencia', 'Finance with intelligence')}</th><th scope="col">${T(lang, 'Finance a medida', 'Finance, made to measure')}</th></tr></thead>
            <tbody>
            ${filas}
            </tbody>
          </table>
        </div>
      </div>
      `;
}

/* ════════════════════════ PORTADA ════════════════════════ */

export function homeEstado(cfg, lang) {
  const base = lang === 'en' ? '/en/sistema-financiero' : '/sistema-financiero';
  const vfTxt = {
    'preparado':     T(lang, 'Cada factura, registrada y encadenada desde que se emite. La remisión a la AEAT es el siguiente paso.', 'Every invoice, recorded and chained from the moment it is issued. Submission to the AEAT is the next step.'),
    'en-validacion': T(lang, 'La remisión a la AEAT, en pruebas con la propia AEAT. Todavía no en producción.', 'Submission to the AEAT, being tested with the AEAT itself. Not in production yet.'),
    'integrado':     T(lang, 'La remisión a la AEAT, integrada y validada. Falta el paso a producción.', 'Submission to the AEAT, integrated and validated. The move to production remains.'),
    'operativo':     T(lang, 'Cada factura, registrada, encadenada y remitida a la AEAT.', 'Every invoice, recorded, chained and submitted to the AEAT.'),
  }[cfg.verifactu.estado];
  const concTxt = {
    'planificada':   T(lang, 'El extracto del banco, cruzado con tus facturas y tus gastos. Es la siguiente pieza.', 'Your bank statement, matched against your invoices and expenses. It is the next piece.'),
    'en-desarrollo': T(lang, 'El extracto del banco, cruzado con tus facturas y tus gastos. Se está construyendo.', 'Your bank statement, matched against your invoices and expenses. Being built.'),
    'en-pruebas':    T(lang, 'El extracto del banco, cruzado con tus facturas y tus gastos. En pruebas antes de abrirse.', 'Your bank statement, matched against your invoices and expenses. In testing before it opens.'),
    'disponible':    T(lang, 'El extracto del banco, cruzado con tus facturas y tus gastos.', 'Your bank statement, matched against your invoices and expenses.'),
  }[cfg.conciliacion.estado];
  return `
      <div class="v7-fiscal v7-velo">
        <a class="v7-fiscal-i rise-s" href="${base}#verifactu">
          <span class="v7-fiscal-k">${T(lang, 'Registro fiscal', 'Tax register')}</span>
          <b class="vf-sello" data-vf="${vfN(cfg)}"><i aria-hidden="true"></i><span>${vfLabel(cfg, lang)}</span></b>
          <span class="v7-fiscal-d">${vfTxt}</span>
          <span class="v7-fiscal-m">${T(lang, 'En qué punto está', 'Where it stands')}</span>
        </a>
        <a class="v7-fiscal-i rise-s" href="${base}#conciliacion">
          <span class="v7-fiscal-k">${T(lang, 'Conciliación bancaria', 'Bank reconciliation')}</span>
          <b class="vf-sello" data-conc="${concN(cfg)}"><i aria-hidden="true"></i><span>${concLabel(cfg, lang)}</span></b>
          <span class="v7-fiscal-d">${concTxt}</span>
          <span class="v7-fiscal-m">${futuro(cfg) ? T(lang, 'Cómo funcionará', 'How it will work') : T(lang, 'Cómo funciona', 'How it works')}</span>
        </a>
      </div>
      `;
}

/* ════════════════════════ CAMBIOS EN PROCESO ════════════════════════ */

export function procesoFilas(cfg, lang) {
  const out = [];
  if (vfN(cfg) < 4) {
    const que = {
      'preparado':     T(lang, 'El registro de cada factura ya se genera y se encadena desde que se emite. El siguiente paso es la remisión a la AEAT, y este tablero cambia cuando haya prueba de cada paso.', 'Every invoice record is already produced and chained from the moment of issue. The next step is submission to the AEAT, and this board changes when there is proof of each step.'),
      'en-validacion': T(lang, 'Los registros ya se remiten al entorno de pruebas de la AEAT y se revisan sus respuestas. Todavía no se remite en producción.', 'Records are already sent to the AEAT test environment and their responses checked. Nothing is submitted in production yet.'),
      'integrado':     T(lang, 'La remisión está integrada y validada con la especificación oficial. Falta el paso a producción y la declaración responsable firmada.', 'Submission is integrated and validated against the official specification. The move to production and the signed responsible declaration remain.'),
    }[cfg.verifactu.estado];
    out.push(`<div class="board-row" data-etapa="2" style="--k:var(--k-finanzas)"> <span class="board-dot">
</span> <div>
<h2 class="board-name">${T(lang, 'VERI*FACTU: la remisión a la AEAT', 'VERI*FACTU: submission to the AEAT')}</h2>
<p class="board-what">${que}</p>
</div> <span class="board-tag">${VF[cfg.verifactu.estado][lang === 'en' ? 'cortoEn' : 'cortoEs']}</span> </div>`);
  }
  if (concN(cfg) < 4) {
    out.push(`<div class="board-row" data-etapa="1" style="--k:var(--k-finanzas)"> <span class="board-dot">
</span> <div>
<h2 class="board-name">${T(lang, 'Conciliación bancaria en Finance', 'Bank reconciliation in Finance')}</h2>
<p class="board-what">${T(lang, 'El extracto del banco, cruzado con facturas y gastos, para que lo cobrado y lo pagado cuadren sin repasarlo a mano. ', 'The bank statement, matched against invoices and expenses, so that what has been collected and paid adds up without checking it by hand. ')}${concNota(cfg, lang, true)}</p>
</div> <span class="board-tag">${concLabel(cfg, lang)}</span> </div>`);
  }
  return out.length ? ' ' + out.join(' ') + ' ' : '';
}

/* ════════════════════════ DEMO Y ASISTENTE ════════════════════════ */

export function demoConstante(cfg) {
  return `var ESTADO_PRODUCTO = ${JSON.stringify({ verifactu: cfg.verifactu.estado, conciliacion: cfg.conciliacion.estado, qr: qr(cfg) })};`;
}

export function asistente(cfg) {
  const vf = cfg.verifactu.estado, c = cfg.conciliacion.estado;
  const lineas = [
    `- VERI*FACTU en D-Code Finance: el estado publicado es «${VF[vf].es}» (revisado el ${fechaCorta(cfg.revisado)}). ${fraseVF(cfg, 'es')}`,
    `- Estados posibles, en orden: ${Object.values(VF).map((s) => `«${s.es}»`).join(' → ')}. Solo se afirma el estado publicado.`,
    '- Nunca digas que D-Code Finance está implantado, certificado u homologado para VERI*FACTU, ni que «cumple» o es «100 % conforme»: no es lo que se ha publicado. Si preguntan, di el estado publicado y que se puede ver en /sistema-financiero#verifactu.',
    `- Conciliación bancaria en D-Code Finance: «${CONC[c].es}». ${c === 'disponible' ? 'Se puede usar.' : 'Todavía no se puede usar; no la describas como disponible.'}`,
    `- Plazo de adaptación de los sistemas de facturación (${cfg.calendario.norma}): sociedades, antes del ${fechaLarga(cfg.calendario.sociedades, 'es')}; resto, antes del ${fechaLarga(cfg.calendario.resto, 'es')}.`,
  ];
  return `/* GENERADO por scripts/build-estado.mjs a partir de estado-producto.json.
   No se edita a mano: npm run check:estado falla si no coincide. */
module.exports = ${JSON.stringify(lineas.join('\n'))};
`;
}
