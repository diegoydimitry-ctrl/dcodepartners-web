"""Contenido compartido por la portada y otras páginas (ES y EN).

Todo sale de lo que ya publica dcodepartners.com (departamentos, casos internos,
garantías, cambios en proceso). No hay clientes, cifras ni testimonios inventados.
"""

# Frases que llegan en las primeras llamadas, una por área. Cada una lleva lo que
# suele haber detrás (de «Hoy, sin sistema» de cada Departamento), lo que hace el
# sistema y lo que sigue decidiendo una persona. `min` y `veces` son solo los
# valores de partida del descifrador: el visitante pone los suyos.
FRASES = {
    "es": [
        {"id": "cobros", "frase": "Persigo cobros.", "gram": "loc.",
         "detras": "Se factura bien y se cobra tarde, porque avisar depende de que alguien se acuerde.",
         "sistema": "Genera la factura desde el presupuesto aceptado, vigila cada vencimiento y escala los recordatorios hasta que se paga.",
         "persona": "Los casos que piden criterio: un plan de pagos, un cliente con un acuerdo especial.",
         "area": "Finanzas", "href": "/departamentos/finanzas", "min": 15, "veces": 8},
        {"id": "oportunidades", "frase": "Se me escapan oportunidades.", "gram": "loc.",
         "detras": "Entran por varios sitios y el seguimiento se hace si queda tiempo.",
         "sistema": "Centraliza cada oportunidad, prepara la propuesta con los datos reales del cliente y avisa cada mañana de lo que toca.",
         "persona": "Revisar la propuesta antes de enviarla y convertir la oportunidad en una conversación.",
         "area": "Comercial", "href": "/departamentos/comercial", "min": 30, "veces": 5},
        {"id": "tres-sitios", "frase": "Lo mismo, en tres sitios.", "gram": "loc.",
         "detras": "La información se repite, no cuadra y los informes salen mal.",
         "sistema": "El dato se escribe una vez y llega solo a tu CRM, tus hojas, tu ERP o tu web, con los permisos mínimos necesarios.",
         "persona": "Leer los informes en vez de montarlos a mano.",
         "area": "Integraciones", "href": "/servicios/integraciones", "min": 10, "veces": 20},
        {"id": "formularios", "frase": "Los formularios se quedan sin leer.", "gram": "loc.",
         "detras": "Los contactos de la web se leen cuando alguien tiene tiempo, no cuando entran.",
         "sistema": "Cualifica cada contacto en cuanto entra y avisa a tu equipo comercial si es prioritario.",
         "persona": "La primera llamada a los contactos que merecen una.",
         "area": "Marketing", "href": "/departamentos/marketing", "min": 5, "veces": 25},
        {"id": "clientes", "frase": "Cada cliente nuevo es una improvisación.", "gram": "loc.",
         "detras": "La bienvenida cambia según quién la haga y las renovaciones se descubren tarde.",
         "sistema": "Da de alta al cliente, envía siempre la misma bienvenida con un plan propio y vigila las renovaciones con antelación.",
         "persona": "La relación: hablar con el cliente cuando algo no va bien.",
         "area": "Clientes", "href": "/departamentos/clientes", "min": 45, "veces": 2},
        {"id": "retrasos", "frase": "Los retrasos los descubre el cliente.", "gram": "loc.",
         "detras": "Las tareas se reparten a ojo y nadie ve el retraso hasta que alguien pregunta.",
         "sistema": "Crea el proyecto al ganar el cliente, reparte las tareas según la carga real de cada persona y avisa de lo que está a punto de vencer.",
         "persona": "Volver a priorizar cuando cambia algo importante.",
         "area": "Producción", "href": "/departamentos/produccion", "min": 20, "veces": 10},
        {"id": "soporte", "frase": "La bandeja de soporte no se acaba nunca.", "gram": "loc.",
         "detras": "Los emails llegan sin prioridad ni plazo, y fuera de horario no hay nadie.",
         "sistema": "Convierte cada email en un ticket con prioridad y plazo, para que las urgencias reales se vean sin leerlo todo.",
         "persona": "Resolver lo que de verdad necesita a alguien del equipo.",
         "area": "Soporte", "href": "/departamentos/soporte", "min": 8, "veces": 30},
        {"id": "fallos", "frase": "Si algo falla, nos enteramos tarde.", "gram": "loc.",
         "detras": "Nadie se entera de que algo interno ha dejado de funcionar hasta que alguien se queja.",
         "sistema": "Vigila que el resto del sistema funcione, avisa en horas si algo falla y mantiene copias de seguridad recientes.",
         "persona": "Arreglar la causa cuando salta el aviso.",
         "area": "Administración", "href": "/departamentos/administracion", "min": 30, "veces": 2},
        {"id": "a-ciegas", "frase": "Decido a ciegas.", "gram": "loc.",
         "detras": "Los números están repartidos y reunirlos lleva más que decidir.",
         "sistema": "Reúne los indicadores de cada área y cada mañana propone una decisión clara con datos reales.",
         "persona": "Tomar la decisión.",
         "area": "Dirección", "href": "/departamentos/direccion", "min": 60, "veces": 3},
    ],
    "en": [
        {"id": "cobros", "frase": "I keep chasing payments.", "gram": "phr.",
         "detras": "Invoices go out fine and get paid late, because reminding depends on someone remembering.",
         "sistema": "It issues the invoice from the accepted quote, watches every due date and escalates the reminders until it is paid.",
         "persona": "The cases that need judgement: a payment plan, a client with a special agreement.",
         "area": "Finance", "href": "/en/departamentos/finanzas", "min": 15, "veces": 8},
        {"id": "oportunidades", "frase": "Opportunities slip away.", "gram": "phr.",
         "detras": "They come in through several channels and follow-up happens if there is time left.",
         "sistema": "It centralises every opportunity, drafts the proposal with the client's real data and flags what is due each morning.",
         "persona": "Reviewing the proposal before it goes out and turning the opportunity into a conversation.",
         "area": "Sales", "href": "/en/departamentos/comercial", "min": 30, "veces": 5},
        {"id": "tres-sitios", "frase": "The same thing, in three places.", "gram": "phr.",
         "detras": "Information is repeated, it never matches and the reports come out wrong.",
         "sistema": "Data is written once and reaches your CRM, spreadsheets, ERP or website on its own, with the minimum permissions needed.",
         "persona": "Reading the reports instead of building them by hand.",
         "area": "Integrations", "href": "/en/servicios/integraciones", "min": 10, "veces": 20},
        {"id": "formularios", "frase": "Web forms go unread.", "gram": "phr.",
         "detras": "Website leads are read when someone has time, not when they arrive.",
         "sistema": "It qualifies every lead the moment it arrives and alerts your sales team when one is a priority.",
         "persona": "The first call to the leads that deserve one.",
         "area": "Marketing", "href": "/en/departamentos/marketing", "min": 5, "veces": 25},
        {"id": "clientes", "frase": "Every new client is improvised.", "gram": "phr.",
         "detras": "The welcome changes depending on who does it, and renewals are noticed too late.",
         "sistema": "It registers the client, always sends the same welcome with its own plan and watches renewals well in advance.",
         "persona": "The relationship: talking to the client when something is not right.",
         "area": "Customers", "href": "/en/departamentos/clientes", "min": 45, "veces": 2},
        {"id": "retrasos", "frase": "The client finds the delays first.", "gram": "phr.",
         "detras": "Tasks are handed out by eye and nobody sees a delay until someone asks.",
         "sistema": "It creates the project when the client is won, assigns tasks by each person's real workload and warns before anything is due.",
         "persona": "Re-prioritising when something important changes.",
         "area": "Delivery", "href": "/en/departamentos/produccion", "min": 20, "veces": 10},
        {"id": "soporte", "frase": "The support inbox never ends.", "gram": "phr.",
         "detras": "Emails arrive with no priority and no deadline, and after hours nobody is there.",
         "sistema": "It turns every email into a ticket with a priority and a deadline, so real emergencies show without reading everything.",
         "persona": "Solving what truly needs someone from the team.",
         "area": "Support", "href": "/en/departamentos/soporte", "min": 8, "veces": 30},
        {"id": "fallos", "frase": "When something breaks, we find out late.", "gram": "phr.",
         "detras": "Nobody notices that something internal has stopped working until someone complains.",
         "sistema": "It checks that the rest of the system is working, alerts within hours when something fails and keeps recent backups.",
         "persona": "Fixing the cause when the alert goes off.",
         "area": "Operations", "href": "/en/departamentos/administracion", "min": 30, "veces": 2},
        {"id": "a-ciegas", "frase": "I decide blind.", "gram": "phr.",
         "detras": "The numbers are scattered and gathering them takes longer than deciding.",
         "sistema": "It gathers each area's indicators and every morning proposes one clear decision with real data.",
         "persona": "Making the decision.",
         "area": "Leadership", "href": "/en/departamentos/direccion", "min": 60, "veces": 3},
    ],
}

SEMANAS = 46  # semanas de trabajo que se cuentan en el descifrador


def horas_anuales(minutos: int, veces: int, personas: int = 1) -> int:
    return round(minutos * veces * personas * SEMANAS / 60)


# El organigrama: las ocho piezas que ya existen (texto del menú de capacidades
# y estados reales de /departamentos).
ORGANIGRAMA = {
    "es": {
        "top": ("Dirección", "/departamentos/direccion", "Una decisión clara cada mañana, con datos reales.", None),
        "areas": [
            ("Comercial", "/departamentos/comercial", "Que ninguna venta se pierda por falta de seguimiento.", None),
            ("Marketing", "/departamentos/marketing", "Contactos que llegan ya clasificados, no en bruto.", None),
            ("Clientes", "/departamentos/clientes", "Que cada cliente se sienta cuidado, sin depender de nadie.", "Disponible"),
            ("Producción", "/departamentos/produccion", "Proyectos que arrancan solos y cumplen plazos.", None),
            ("Finanzas", "/departamentos/finanzas", "Factura, cobra y controla el gasto sin perseguir a nadie.", "En validación"),
            ("Soporte", "/departamentos/soporte", "Respuesta rápida, incluso fuera de horario.", "Chat en revisión"),
            ("Administración", "/departamentos/administracion", "Tu empresa, protegida y ordenada, sin esfuerzo.", None),
        ],
    },
    "en": {
        "top": ("Leadership", "/en/departamentos/direccion", "One clear decision every morning, with real data.", None),
        "areas": [
            ("Sales", "/en/departamentos/comercial", "No sale lost for lack of follow-up.", None),
            ("Marketing", "/en/departamentos/marketing", "Leads that arrive already qualified.", None),
            ("Customers", "/en/departamentos/clientes", "Every client looked after, without depending on anyone.", "Available"),
            ("Delivery", "/en/departamentos/produccion", "Projects that start themselves and meet deadlines.", None),
            ("Finance", "/en/departamentos/finanzas", "Invoice, collect and control spending without chasing anyone.", "In validation"),
            ("Support", "/en/departamentos/soporte", "Fast answers, even after hours.", "Chat under review"),
            ("Operations", "/en/departamentos/administracion", "Your company, protected and in order, effortlessly.", None),
        ],
    },
}

# Las catorce piezas de D-Code Finance (de /sistema-financiero).
FINANCE = {
    "es": [
        ("Facturación", "Series y numeración correlativa, rectificativas enlazadas al original y PDF generado por el propio sistema."),
        ("Cobros", "Antigüedad de la deuda por tramos, recordatorios que escalan solos y cobros parciales sobre una misma factura."),
        ("Gastos", "Alta desde documento con revisión humana, categorías, proveedores y control de presupuesto."),
        ("Cuentas por pagar", "Vencimientos, próximos pagos y estado de cada gasto hasta que queda saldado."),
        ("Presupuestos", "Del presupuesto aceptado a la factura, sin facturar dos veces lo mismo."),
        ("Pedidos y albaranes", "Conversión entre documentos manteniendo qué queda pendiente en cada línea."),
        ("Proyectos", "Rentabilidad real por proyecto, devengada y de caja, no solo facturación."),
        ("Tesorería", "Saldo del periodo con cobros y pagos previstos sobre la misma línea de tiempo."),
        ("Recurrentes", "Plantillas de facturación periódica y control de qué periodos ya se han emitido."),
        ("Radar", "Anomalías explicables: gastos nuevos, desaparecidos, importes fuera de rango, concentración."),
        ("Documentos", "Subida y descarga mediadas por la aplicación, con registro de cada acceso."),
        ("Consulta", "Preguntas en lenguaje natural sobre los datos, respondidas citando de dónde sale cada cifra."),
        ("Búsqueda", "Un solo buscador sobre facturas, gastos, clientes, proveedores, presupuestos y proyectos."),
        ("Actividad", "Historial de lo que ha pasado en cada factura y cada gasto, con quién y cuándo."),
    ],
    "en": [
        ("Invoicing", "Series with correlative numbering, credit notes linked to the original and PDFs generated by the system itself."),
        ("Collections", "Debt ageing by bracket, reminders that escalate on their own and partial payments on one invoice."),
        ("Expenses", "Entry from a document with human review, categories, suppliers and budget control."),
        ("Payables", "Due dates, upcoming payments and the status of each expense until it is settled."),
        ("Quotes", "From accepted quote to invoice, never invoicing the same thing twice."),
        ("Orders and delivery notes", "Conversion between documents, keeping what is still pending on each line."),
        ("Projects", "Real profitability per project, accrued and cash-based, not just invoicing."),
        ("Treasury", "The period's balance with expected receipts and payments on the same timeline."),
        ("Recurring", "Periodic invoicing templates and a record of which periods have been issued."),
        ("Radar", "Explainable anomalies: new or missing expenses, out-of-range amounts, concentration."),
        ("Documents", "Uploads and downloads mediated by the app, with every access logged."),
        ("Ask", "Natural-language questions about the data, answered citing where each figure comes from."),
        ("Search", "One search across invoices, expenses, clients, suppliers, quotes and projects."),
        ("Activity", "The history of each invoice and each expense: what happened, who and when."),
    ],
}

# Casos internos (de /casos-exito).
CASOS = {
    "es": [
        {"area": "Comercial", "titulo": "De empresa detectada a propuesta enviada",
         "antes": "Pasar de «empresa interesante» a «propuesta enviada» era un paso manual, sin fecha fija.",
         "ahora": "Cada lunes, las empresas mejor puntuadas pasan a leads y se prepara la propuesta con IA, que revisa una persona antes de que salga.",
         "aprendido": "Automatizar la propuesta no cierra la venta: crea la conversación. Hace falta una persona que la convierta en una llamada."},
        {"area": "Producción", "titulo": "Repartir el trabajo sin decidirlo cada hora",
         "antes": "Crear la ficha del proyecto, repartir tareas y vigilar plazos dependía de que alguien se acordara entre el resto del trabajo.",
         "ahora": "Al cerrar un proyecto se crea solo; cada hora se reparten las tareas según la carga real; cada día avisa de lo que va a vencer.",
         "aprendido": "Es el sistema que más usamos: automatiza la decisión pequeña y repetida que consume más tiempo del que parece."},
        {"area": "Disciplina", "titulo": "Cuando la hipótesis no coincidía con los datos",
         "antes": "Nuestra auditoría interna señalaba un workflow como causa probable de una tasa de errores alta. Íbamos a intervenir sobre él.",
         "ahora": "Antes de tocar nada auditamos las ejecuciones reales una a una: los errores estaban en otros dos workflows.",
         "aprendido": "No corregimos un fallo hasta verificar su causa con evidencia directa, aunque la sospecha venga de nuestro propio sistema."},
    ],
    "en": [
        {"area": "Sales", "titulo": "From detected company to proposal sent",
         "antes": "Going from «interesting company» to «proposal sent» was a manual step with no fixed date.",
         "ahora": "Every Monday the best-scored companies become leads and an AI draft proposal is prepared, reviewed by a person before it goes out.",
         "aprendido": "Automating the proposal does not close the sale: it creates the conversation. A person still has to turn it into a call."},
        {"area": "Delivery", "titulo": "Sharing out the work without deciding it every hour",
         "antes": "Creating the project record, assigning tasks and watching deadlines depended on someone remembering among everything else.",
         "ahora": "When a project is closed it is created on its own; every hour tasks are assigned by real workload; every day it warns of what is due.",
         "aprendido": "It is the system we use most: it automates the small repeated decision that takes more time than it seems."},
        {"area": "Discipline", "titulo": "When the hypothesis did not match the data",
         "antes": "Our internal audit pointed at one workflow as the likely cause of a high error rate. We were about to change it.",
         "ahora": "Before touching anything we audited the real executions one by one: the errors were in two other workflows.",
         "aprendido": "We do not fix a fault until its cause is verified with direct evidence, even when the suspicion comes from our own system."},
    ],
}

COMPROMISOS = {
    "es": [
        ("Sabrás qué vamos a construir antes de construirlo.",
         "El alcance, las herramientas con las que se conecta y lo que vamos a medir se acuerdan contigo. Sin ese acuerdo, no empezamos."),
        ("Sin permanencia.", "No hay permanencia mínima ni penalización por cancelar. Si decides parar, paras."),
        ("Confidencialidad.", "Accedemos solo a lo necesario para cada proceso. Si necesitas un acuerdo de confidencialidad firmado antes de empezar, lo firmamos."),
        ("El sistema es tuyo.", "Los sistemas que implementamos en tu operativa te pertenecen. Nuestro papel es diseñarlos, construirlos y dejarlos funcionando."),
        ("Tus herramientas, no las nuestras.", "Nos integramos con lo que ya usas, CRM, hojas de cálculo, ERP o web, en vez de obligarte a cambiarlo."),
    ],
    "en": [
        ("You will know what we will build before we build it.",
         "The scope, the tools it connects to and what we will measure are agreed with you. Without that agreement we do not start."),
        ("No lock-in.", "No minimum term and no cancellation penalty. If you decide to stop, you stop."),
        ("Confidentiality.", "We access only what each process needs. If you need a signed NDA before we start, we sign it."),
        ("The system is yours.", "The systems we put into your operation belong to you. Our job is to design them, build them and leave them running."),
        ("Your tools, not ours.", "We integrate with what you already use, CRM, spreadsheets, ERP or website, instead of making you replace it."),
    ],
}

# Estado real de /cambios-en-proceso. kind: activo | obra
EN_CURSO = {
    "es": [
        ("D-Code OS", "Panel único para ver y dirigir los sistemas de una empresa.", "En construcción", "obra"),
        ("D-Code Finance", "Ampliación del circuito de cobros y del análisis financiero.", "En evolución", "obra"),
        ("Propuestas comerciales automáticas", "De oportunidad detectada a propuesta lista para revisar.", "En producción", "activo"),
        ("Guardarraíl de comunicación externa", "Comprobación previa a cualquier envío fuera de D-Code.", "Activo", "activo"),
        ("Ficha única por empresa", "Identidad unificada, sincronizada a diario.", "Activo", "activo"),
        ("Vigilancia y copias de seguridad", "Aviso automático cuando una automatización falla.", "Activo", "activo"),
        ("Ciclo de vida de tickets", "Asignación por carga, aviso de plazo y escalado.", "Activo", "activo"),
    ],
    "en": [
        ("D-Code OS", "One panel to see and run a company's systems.", "Being built", "obra"),
        ("D-Code Finance", "A wider collections circuit and deeper financial analysis.", "Evolving", "obra"),
        ("Automatic sales proposals", "From detected opportunity to proposal ready for review.", "In production", "activo"),
        ("External communication guardrail", "A check before anything is sent outside D-Code.", "Active", "activo"),
        ("Single company record", "Unified identity, synced daily.", "Active", "activo"),
        ("Monitoring and backups", "Automatic alert when an automation fails.", "Active", "activo"),
        ("Ticket lifecycle", "Assignment by workload, deadline alerts and escalation.", "Active", "activo"),
    ],
}

FUNDADORES = {
    "es": [
        ("Diego Siñeriz", "Estrategia y alianzas", "/assets/img/diego-sineriz.webp",
         "Lidera la visión estratégica y las alianzas. Inteligencia artificial aplicada a negocio: cómo traducir tecnología en resultados concretos para cada cliente."),
        ("Dimitry Sosenko", "Arquitectura de sistemas", "/assets/img/dimitry-sosenko.webp",
         "Al frente de la arquitectura de las automatizaciones. IA aplicada a procesos y atención al cliente: cómo se construye un sistema que funciona de verdad en producción."),
    ],
    "en": [
        ("Diego Siñeriz", "Strategy and partnerships", "/assets/img/diego-sineriz.webp",
         "Leads strategy and partnerships. Artificial intelligence applied to business: turning technology into concrete results for each client."),
        ("Dimitry Sosenko", "Systems architecture", "/assets/img/dimitry-sosenko.webp",
         "Heads the architecture of the automations. AI applied to operations and customer service: how to build a system that really works in production."),
    ],
}
