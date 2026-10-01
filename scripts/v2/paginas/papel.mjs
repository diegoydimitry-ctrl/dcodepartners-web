/* D-Code Finance · «Así entra una factura en Finance»: la escena 3D (scripts/v2/escena/factura.js) y sus cuatro pasos.
   El texto está en el HTML (se indexa y se lee sin JavaScript); assets/v2/js/finance.js pone la escena. */
const P = {
  es: `<section class="papel" data-papel aria-labelledby="h-papel">
  <div class="papel-fijo">
    <div class="papel-luz" aria-hidden="true"></div>
    <canvas class="papel-lienzo" data-papel-lienzo role="img" aria-label="Una factura de proveedor entra en D-Code Finance: una línea de luz la lee, sus campos salen del papel como datos y el registro entra en el libro de facturas. Datos inventados."></canvas>
    <div class="marco papel-texto">
      <h2 class="papel-h" id="h-papel">Así entra una factura en Finance.</h2>
      <ol class="papel-pasos" role="list">
        <li class="papel-paso is-activa" data-paso="0"><h3>Llega una factura de proveedor.</h3><p>Llega en PDF, tal como la manda el proveedor, junto a las demás de la semana.</p></li>
        <li class="papel-paso" data-paso="1"><h3>La inteligencia artificial la lee.</h3><p>Reconoce al proveedor, la fecha, el concepto, la base, el IVA y el total.</p></li>
        <li class="papel-paso" data-paso="2"><h3>Cada campo se convierte en un dato.</h3><p>Si algo no cuadra, como un IVA al 10 % en unos neumáticos, te lo enseña antes de registrarlo.</p></li>
        <li class="papel-paso" data-paso="3"><h3>Queda registrada con las demás.</h3><p>Tú solo revisas lo que no cuadra; el resto entra solo en el libro de facturas.</p></li>
      </ol>
      <p class="papel-nota">Datos inventados: son los del taller de la demo.</p>
    </div>
  </div>
</section>`,
  en: `<section class="papel" data-papel aria-labelledby="h-papel">
  <div class="papel-fijo">
    <div class="papel-luz" aria-hidden="true"></div>
    <canvas class="papel-lienzo" data-papel-lienzo role="img" aria-label="A supplier invoice enters D-Code Finance: a line of light reads it, its fields leave the paper as data and the record goes into the invoice ledger. Invented data."></canvas>
    <div class="marco papel-texto">
      <h2 class="papel-h" id="h-papel">This is how an invoice enters Finance.</h2>
      <ol class="papel-pasos" role="list">
        <li class="papel-paso is-activa" data-paso="0"><h3>A supplier invoice arrives.</h3><p>It arrives as a PDF, just as the supplier sends it, with the rest of the week's invoices.</p></li>
        <li class="papel-paso" data-paso="1"><h3>Artificial intelligence reads it.</h3><p>It recognises the supplier, the date, the item, the base amount, the VAT and the total.</p></li>
        <li class="papel-paso" data-paso="2"><h3>Every field becomes data.</h3><p>If something doesn't add up, like 10% VAT on tyres, it shows you before recording it.</p></li>
        <li class="papel-paso" data-paso="3"><h3>It is recorded with the rest.</h3><p>You only review what doesn't add up; everything else goes into the invoice ledger on its own.</p></li>
      </ol>
      <p class="papel-nota">Invented data: it belongs to the garage in the demo.</p>
    </div>
  </div>
</section>`,
};
export const seccionPapel = (lang) => P[lang];
