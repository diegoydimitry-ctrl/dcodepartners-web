/*
 * Guiones de las tres demos. DATOS DE DEMOSTRACIÓN: empresas, personas,
 * importes y fechas son inventados.
 *
 * Qué se enseña sale del catálogo «vendible ahora» y de los flujos que
 * existen hoy en n8n (ver marketing/google-ads/demos/AFIRMACIONES.md). Nada
 * que no se pueda enseñar funcionando en el diagnóstico.
 *
 * Cada paso: { t: segundo de inicio, c: subtítulo, a: [acciones] }.
 * Acciones: ['titulo', txt] ['entrada', id, de, asunto, meta] ['entradaEstado', id, estado]
 *   ['fila', id, [celdas]] ['celda', id, n, valor, resaltar] ['detalle', titulo, [[k,v]...], nota]
 *   ['aviso', txt, tipo] ['limpiar'] ['kpis', [[etiqueta, valor]...]] ['portada', titulo, lineas]
 */
(function (root) {
  var DEMOS = {
    comercial: {
      titulo: 'Seguimiento comercial',
      app: 'CRM · Comercial',
      columnas: ['Empresa', 'Origen', 'Estado', 'Siguiente paso'],
      duracion: 84,
      pasos: [
        { t: 0, c: 'Demo con datos inventados: así queda el seguimiento comercial cuando lo construimos.', a: [['portada', 'Que ningún presupuesto se quede sin seguimiento', ['Datos de demostración', 'Empresas y personas inventadas']]] },
        { t: 6, c: 'El problema: las solicitudes llegan por la web y por email, y el seguimiento depende de acordarse.', a: [['limpiar'], ['titulo', 'Hoy'], ['detalle', 'Cómo se trabaja hoy', [['Solicitudes', 'Web, email y teléfono, cada una en un sitio'], ['Presupuestos', 'En el correo y en una hoja'], ['Seguimiento', 'Cuando alguien se acuerda']], 'Punto de partida típico que vemos en el diagnóstico']] },
        { t: 14, c: 'Entra una solicitud por el formulario de la web.', a: [['titulo', 'Entrada de solicitudes'], ['entrada', 'e1', 'Formulario web', 'Reformas Ribera · reforma de baño', 'hace 1 min']] },
        { t: 20, c: 'Se registra sola en el CRM, con su origen. Nadie copia datos a mano.', a: [['entradaEstado', 'e1', 'registrada'], ['fila', 'r1', ['Reformas Ribera', 'Web', 'Nuevo', 'Revisar hoy']]] },
        { t: 27, c: 'Llega otra por email: también entra en el mismo sitio.', a: [['entrada', 'e2', 'Email', 'Clínica Arce · instalación de aire', 'hace 3 min'], ['entradaEstado', 'e2', 'registrada'], ['fila', 'r2', ['Clínica Arce', 'Email', 'Nuevo', 'Revisar hoy']]] },
        { t: 35, c: 'Con los datos del CRM, el sistema prepara un BORRADOR de propuesta.', a: [['celda', 'r1', 2, 'Borrador listo', true], ['detalle', 'Borrador de propuesta · Reformas Ribera', [['Problema', 'Reforma de baño completo'], ['Alcance', 'Según visita del 12/05'], ['Estado', 'Pendiente de revisión']], 'Una persona la revisa antes de enviarla']] },
        { t: 45, c: 'Una persona la revisa y la envía. El CRM guarda la fecha de envío.', a: [['celda', 'r1', 2, 'Propuesta enviada', true], ['celda', 'r1', 3, 'Esperar respuesta'], ['aviso', 'Propuesta enviada a Reformas Ribera · 12/05', 'ok']] },
        { t: 54, c: 'Pasan cinco días sin respuesta.', a: [['titulo', 'Cinco días después']] },
        { t: 58, c: 'El sistema avisa al responsable: toca hacer seguimiento. No se olvida.', a: [['celda', 'r1', 3, 'Llamar hoy (5 días sin respuesta)', true], ['aviso', 'Recordatorio para Laura: Reformas Ribera lleva 5 días sin responder', 'alerta']] },
        { t: 68, c: 'De un vistazo: qué está abierto y qué toca hoy.', a: [['kpis', [['Solicitudes abiertas', '2'], ['Propuestas enviadas', '1'], ['Seguimientos para hoy', '1'], ['Sin siguiente paso', '0']]]] },
        { t: 76, c: 'En el diagnóstico lo vemos sobre tu forma de vender y te decimos qué construiríamos.', a: [['portada', 'Reserva tu diagnóstico de 30 minutos', ['Te enseñamos el sistema funcionando', 'y qué parte aplicaríamos a tu caso']]] },
      ],
    },
    atencion: {
      titulo: 'Consultas de clientes',
      app: 'Soporte · Tickets',
      columnas: ['Consulta', 'Prioridad', 'Responsable', 'Plazo'],
      duracion: 84,
      pasos: [
        { t: 0, c: 'Demo con datos inventados: así se ordenan las consultas de clientes cuando lo construimos.', a: [['portada', 'Que ninguna consulta se quede sin responder', ['Datos de demostración', 'Empresas y personas inventadas']]] },
        { t: 6, c: 'El problema: las consultas llegan al buzón y nadie sabe cuál es urgente ni quién la lleva.', a: [['limpiar'], ['titulo', 'Hoy'], ['detalle', 'Cómo se trabaja hoy', [['Entrada', 'Un buzón compartido'], ['Prioridad', 'La que parezca'], ['Responsable', 'El primero que lo ve']], 'Punto de partida típico que vemos en el diagnóstico']] },
        { t: 14, c: 'Entra un email de un cliente.', a: [['titulo', 'Buzón de soporte'], ['entrada', 'm1', 'cliente@ejemplo.es', 'Mi pedido 2231 no ha llegado', 'hace 1 min']] },
        { t: 20, c: 'Se detecta que es una consulta de cliente y se crea un ticket con prioridad.', a: [['entradaEstado', 'm1', 'ticket creado'], ['fila', 't1', ['Pedido 2231 no llegado', 'Alta', 'Sin asignar', '8 h']]] },
        { t: 27, c: 'Un boletín comercial no es una consulta: no genera ticket.', a: [['entrada', 'm2', 'boletin@proveedor.es', 'Novedades de septiembre', 'hace 2 min'], ['entradaEstado', 'm2', 'no es consulta']] },
        { t: 33, c: 'Se asigna a quien tiene menos carga en ese momento.', a: [['celda', 't1', 2, 'Marta (2 abiertos)', true], ['aviso', 'Asignado a Marta: tiene 2 tickets abiertos, Jorge tiene 5', 'ok']] },
        { t: 42, c: 'Cada ticket tiene un plazo según su prioridad.', a: [['detalle', 'Plazos de respuesta (ejemplo)', [['Crítica', '2 h'], ['Alta', '8 h'], ['Media', '24 h'], ['Baja', '48 h']], 'Los plazos se acuerdan con cada empresa']] },
        { t: 52, c: 'Si se acerca el plazo, el sistema avisa al responsable.', a: [['celda', 't1', 3, 'Queda 1 h', true], ['aviso', 'Aviso a Marta: queda 1 h para responder el ticket del pedido 2231', 'alerta']] },
        { t: 60, c: 'Si se incumple, se escala a dirección. No se pierde en el buzón.', a: [['aviso', 'Plazo incumplido → escalado a dirección', 'alerta']] },
        { t: 68, c: 'De un vistazo: qué está abierto, de quién es y cuánto queda.', a: [['kpis', [['Tickets abiertos', '3'], ['Fuera de plazo', '0'], ['Sin responsable', '0'], ['Emails descartados', '1']]]] },
        { t: 76, c: 'En el diagnóstico lo vemos con tu buzón y tus plazos reales.', a: [['portada', 'Reserva tu diagnóstico de 30 minutos', ['Te enseñamos el sistema funcionando', 'y qué parte aplicaríamos a tu caso']]] },
      ],
    },
    procesos: {
      titulo: 'Automatización de procesos',
      app: 'Proyectos · Operaciones',
      columnas: ['Proyecto / tarea', 'Responsable', 'Estado', 'Entrega'],
      duracion: 86,
      pasos: [
        { t: 0, c: 'Demo con datos inventados: así convertimos un proceso manual en un sistema.', a: [['portada', 'Del problema al sistema', ['Datos de demostración', 'Empresas y personas inventadas']]] },
        { t: 6, c: 'Ejemplo de problema: cada cliente nuevo obliga a repetir los mismos pasos a mano.', a: [['limpiar'], ['titulo', 'Hoy'], ['detalle', 'Cada vez que se gana un cliente', [['1', 'Copiar sus datos a la hoja'], ['2', 'Crear el proyecto y las carpetas'], ['3', 'Repartir tareas por mensaje'], ['4', 'Acordarse de los plazos']], 'Punto de partida típico que vemos en el diagnóstico']] },
        { t: 16, c: 'En el diagnóstico marcamos qué pasos se repiten siempre igual. Eso es lo que se automatiza.', a: [['detalle', 'Qué se automatiza', [['Copiar datos', 'Sí: siempre igual'], ['Crear proyecto', 'Sí: siempre igual'], ['Repartir tareas', 'Sí: con reglas'], ['Decidir el alcance', 'No: lo decide una persona']], 'Lo que requiere criterio sigue siendo de una persona']] },
        { t: 27, c: 'Se gana un cliente: el sistema crea el proyecto solo.', a: [['titulo', 'Operaciones'], ['entrada', 'p1', 'Propuesta aceptada', 'Talleres Norte · web y reservas', 'ahora'], ['entradaEstado', 'p1', 'proyecto creado'], ['fila', 'f1', ['Talleres Norte', '—', 'Proyecto creado', '30/06']]] },
        { t: 36, c: 'Crea las tareas base y las reparte según la carga real del equipo.', a: [['fila', 'f2', ['· Toma de requisitos', 'Ana', 'Pendiente', '10/06']], ['fila', 'f3', ['· Construcción', 'Luis', 'Pendiente', '24/06']], ['aviso', 'Tareas asignadas por carga: Ana 3 abiertas, Luis 2, Pablo 6', 'ok']] },
        { t: 47, c: 'Vigila los plazos y avisa antes de que algo se retrase.', a: [['celda', 'f2', 2, 'En curso'], ['celda', 'f3', 3, '24/06 · en riesgo', true], ['aviso', 'Aviso: «Construcción» puede retrasarse; faltan 3 días y está sin empezar', 'alerta']] },
        { t: 58, c: 'Funciona con las herramientas que ya usáis: correo, hojas y calendario.', a: [['detalle', 'Conectado a lo que ya existe', [['Correo', 'Avisos y resúmenes'], ['Hojas / CRM', 'Datos del cliente'], ['Calendario', 'Plazos y entregas']], 'No hace falta cambiar de programa si no es necesario']] },
        { t: 68, c: 'De un vistazo: proyectos, tareas y riesgos.', a: [['kpis', [['Proyectos activos', '1'], ['Tareas asignadas', '2'], ['Tareas en riesgo', '1'], ['Pasos copiados a mano', '0']]]] },
        { t: 78, c: 'Esto es un ejemplo. En el diagnóstico elegimos el proceso que más tiempo os quita.', a: [['portada', 'Reserva tu diagnóstico de 30 minutos', ['Elegimos contigo el primer proceso', 'y te enseñamos el sistema funcionando']]] },
      ],
    },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = DEMOS;
  else root.DCODE_DEMOS = DEMOS;
})(this);
