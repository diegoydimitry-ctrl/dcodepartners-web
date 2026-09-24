/*
 * LO QUE ESTÁ LISTO, EN UNA SOLA LISTA.
 *
 * El tablero de /cambios-en-proceso tenía dos columnas y la de la izquierda
 * llevaba dentro cosas que YA funcionan y solo estaban creciendo —Finance y
 * la capa común—, así que quien miraba veía Finance en la columna de «en
 * proceso» y entendía lo contrario de lo que pasa. Ahora a la izquierda solo
 * queda lo que de verdad no está: la remisión a la AEAT y la conciliación,
 * que además tienen su propia regla de evidencia y las escribe build:estado.
 *
 * Cada línea de aquí es un sistema que corre en la operación de D-Code, no en
 * la de un cliente. Eso lo dice la nota del pie y no se quita.
 */

export const LISTOS = [
  {
    k: 'k-direccion',
    es: ['D-Code OS',
      'El panel desde el que se ven y se dirigen todos los sistemas de la empresa: qué está corriendo, qué ha fallado y qué ha cambiado. Es el sitio por el que se entra.'],
    en: ['D-Code OS',
      'The panel from which every system in the company is seen and steered: what is running, what failed and what changed. It is the way in.'],
  },
  {
    k: 'k-finanzas', vf: true,
    es: ['D-Code Finance',
      'El sistema financiero completo: veinticinco pantallas, §, tesorería, radar de avisos y lectura de documentos. Corriendo sobre nuestros propios números todos los días.'],
    en: ['D-Code Finance',
      'The full financial system: twenty-five screens, §, cash flow, an alert radar and document reading. Running on our own numbers every day.'],
  },
  {
    k: 'k-produccion',
    es: ['Los sistemas de cada área',
      'Comercial, marketing, clientes, operaciones, finanzas, soporte, administración y dirección: los ocho montados y funcionando, cada uno con sus automatizaciones y su parte de IA.'],
    en: ['The systems for each area',
      'Sales, marketing, customers, operations, finance, support, administration and leadership: all eight built and running, each with its automations and its share of AI.'],
  },
  {
    k: 'k-soporte',
    es: ['Chatbots y agentes de IA',
      'Atienden por web y por WhatsApp, responden con los datos del negocio y pasan a una persona cuando toca. Todo lo que contestan queda registrado.'],
    en: ['Chatbots and AI agents',
      'They answer on the web and on WhatsApp, reply from the business data and hand over to a person when it matters. Everything they say is logged.'],
  },
  {
    k: 'k-clientes',
    es: ['CRM y ficha única de cliente',
      'Nombre, NIF, contactos y actividad de cada cliente en una sola ficha, sincronizada a diario aunque los datos vengan de cinco sitios. Se deja de discutir cuál es el dato bueno.'],
    en: ['CRM and a single customer record',
      'Name, tax ID, contacts and activity for each customer in one record, synced daily even when the data comes from five places. No more arguing about which figure is the right one.'],
  },
  {
    k: 'k-administracion',
    es: ['Aplicaciones internas a medida',
      'Aplicaciones propias para lo que ninguna herramienta comprada hacía: con su base de datos, sus permisos y su registro de quién tocó qué.'],
    en: ['In-house applications',
      'Our own applications for what no bought tool did: with their database, their permissions and a record of who touched what.'],
  },
  {
    k: 'k-marketing',
    es: ['Webs conectadas, con chatbot',
      'Webs hechas y rehechas que además hablan con los sistemas: el formulario entra ya clasificado, la cita cae en la agenda y el chatbot responde con los datos de verdad.'],
    en: ['Connected websites, with a chatbot',
      'Sites built and rebuilt that also talk to the systems: the form arrives already sorted, the booking lands in the diary and the chatbot answers from real data.'],
  },
  {
    k: 'k-comercial',
    es: ['De oportunidad a propuesta, sin escribirla a mano',
      'En cuanto una oportunidad cumple las condiciones, la propuesta se redacta sola y llega lista para revisar y enviar.'],
    en: ['From opportunity to proposal, without writing it by hand',
      'As soon as an opportunity meets the conditions, the proposal writes itself and arrives ready to review and send.'],
  },
  {
    k: 'k-soporte',
    es: ['Ningún correo sale sin pasar un control',
      'Antes de cualquier envío a un cliente se comprueba destinatario, contenido y permiso. Si algo no cuadra, no sale.'],
    en: ['No email goes out without a check',
      'Before anything reaches a customer we check recipient, content and consent. If something does not add up, it does not go.'],
  },
  {
    k: 'k-produccion',
    es: ['Si una automatización falla, alguien se entera al momento',
      'Cada proceso avisa cuando se rompe, y los datos se respaldan sin que nadie tenga que acordarse.'],
    en: ['If an automation fails, someone knows right away',
      'Every process raises an alert when it breaks, and data is backed up without anyone having to remember.'],
  },
  {
    k: 'k-clientes',
    es: ['Cada petición con dueño, plazo y aviso antes de incumplirlo',
      'Las peticiones se reparten por carga de trabajo, avisan cuando se acerca el plazo y escalan solas si nadie las coge.'],
    en: ['Every request with an owner, a deadline and a warning before missing it',
      'Requests are shared out by workload, warn when the deadline approaches and escalate on their own if nobody picks them up.'],
  },
];

export const ROTULOS = {
  es: {
    estado: 'Listo',
    cuenta: (n) => `${n} sistemas`,
    tag: 'Listo',
    /* La cifra sale del recuento, no escrita a mano: el día que se añada un
       sistema, la nota ya no dirá «los once». */
    nota: (n) => `Los ${n} están funcionando en nuestra propia operación, no en la de un cliente: son sistemas que sabemos construir porque los usamos a diario. En tu empresa se montarían con tus herramientas y tus reglas.`,
  },
  en: {
    estado: 'Ready',
    cuenta: (n) => `${n} systems`,
    tag: 'Ready',
    nota: (n) => `All ${n} run inside our own operation, not a client\u2019s: they are systems we know how to build because we use them daily. In your company they would be built with your tools and your rules.`,
  },
};
