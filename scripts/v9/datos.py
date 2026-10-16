"""Contenido compartido por las páginas mínimas (ES y EN).

Todo sale de lo que ya publica dcodepartners.com (departamentos, casos internos,
garantías, cambios en proceso). No hay clientes, cifras ni testimonios inventados.
"""

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
            ("Customer", "/en/departamentos/clientes", "Every client looked after, without depending on anyone.", "Available"),
            ("Delivery", "/en/departamentos/produccion", "Projects that start themselves and meet deadlines.", None),
            ("Finance", "/en/departamentos/finanzas", "Invoice, collect and control spending without chasing anyone.", "In validation"),
            ("Support", "/en/departamentos/soporte", "Fast answers, even after hours.", "Chat under review"),
            ("Operations", "/en/departamentos/administracion", "Your company, protected and in order, effortlessly.", None),
        ],
    },
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
