'use strict';
/**
 * Las tres landings de la primera prueba. Fuente única para: validación de
 * «landing» en el servidor, producto por defecto de la ficha, mapeo
 * keyword → grupo → anuncio → landing → demo y la comprobación final.
 */
const LANDINGS = Object.freeze({
  '/automatizacion-procesos': {
    grupo: 'GA1 Proveedor de automatización',
    demo: 'procesos',
    productoPorDefecto: 'Automatización individual o Producción IA (a decidir en diagnóstico)',
  },
  '/automatizacion-seguimiento-comercial': {
    grupo: 'GA2 Seguimiento comercial',
    demo: 'comercial',
    productoPorDefecto: 'Comercial IA · núcleo (CRM + Propuestas + Recordatorio)',
  },
  '/automatizacion-atencion-clientes': {
    grupo: 'GA3 Consultas de clientes',
    demo: 'atencion',
    productoPorDefecto: 'Soporte IA · Tickets IA',
  },
});
module.exports = { LANDINGS };
