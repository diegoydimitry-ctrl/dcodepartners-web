"""Portada v9: «D-Code», la palabra descifrada."""
import json

from common import e, mark, page
from datos import CASOS, COMPROMISOS, EN_CURSO, FINANCE, FRASES, FUNDADORES, ORGANIGRAMA, SEMANAS, horas_anuales

T = {
    "es": {
        "pron": "/di·kóud/", "origin": "Del inglés <i>decode</i>, descifrar.",
        "gram": "f.", "gram_t": "nombre femenino",
        "def": "Equipo de Madrid que lee cómo trabaja tu empresa, encuentra dónde se pierde el tiempo y construye el sistema que hace solo el trabajo repetido.",
        "cta": ("Reservar una llamada", "/contacto"), "cta2": ("Cómo trabajamos", "/metodo"),
        "note": "Treinta minutos. Respondemos en menos de 24 horas.",
        "dic_h": "Lo que nos dicen, descifrado.",
        "dic_p": "Casi todas las primeras llamadas empiezan con una de estas frases. Esto es lo que suele haber detrás y lo que hace el sistema en su lugar.",
        "dic_sys": "Lo hace el sistema:",
        "dec_h": "Descifra una tarea tuya.",
        "dec_p": "Elige la frase que más se parece a tu semana, pon cuánto dura y cuántas veces pasa. Te decimos cuánto tiempo es al año y qué haría el sistema.",
        "dec_f": "La frase", "dec_min": "Minutos cada vez", "dec_veces": "Veces por semana", "dec_per": "Personas que lo hacen",
        "dec_unit": "horas al año",
        "dec_eq": "Unas {j} jornadas de ocho horas, contando {s} semanas de trabajo.",
        "dec_sys": "Lo hace el sistema", "dec_hum": "Sigue decidiendo una persona",
        "dec_cta": "Hablemos de estas horas", "dec_dep": "Ver {area}",
        "dec_fine": "Es una cuenta con tus números, no una promesa. Cuánto se puede automatizar lo medimos contigo en el diagnóstico.",
        "met_h": "Primero entender.<br> Después construir.",
        "met_p": "No empezamos escribiendo código. Empezamos mirando cómo funciona tu empresa de verdad, y no construimos nada hasta que sabes exactamente qué vamos a construir.",
        "met": [
            ("Diagnóstico", "Recorremos tu operación real: qué procesos consumen más horas, dónde se pierden oportunidades y qué tareas frenan al equipo. No es un cuestionario."),
            ("Diseño y alcance", "Decidimos qué se automatiza, qué sigue decidiendo una persona, con qué herramientas se conecta y qué vamos a medir. Lo acordamos por escrito antes de construir."),
            ("Construcción", "Adaptamos las piezas que ya sabemos construir y desarrollamos lo que falte, en tu operativa real y no en un entorno de pruebas aislado."),
            ("Medición y ajuste", "Comparamos horas, tiempos de respuesta y procesos automatizados con tu punto de partida, y ajustamos lo que haga falta."),
        ],
        "met_l": ("El método completo", "/metodo"),
        "org_h": "Tu organigrama, con sistema.",
        "org_p": "Ocho piezas que ya sabemos construir, una por área. No es un catálogo: si tu problema pide otra cosa, se construye otra cosa.",
        "org_f": 'Cada pieza se monta con tres disciplinas: <a href="/servicios/automatizacion-ia">automatización de procesos</a>, <a href="/servicios/agentes-ia">agentes de IA</a> e <a href="/servicios/integraciones">integraciones</a>.',
        "org_all": ("Ver las ocho capacidades", "/departamentos"),
        "fin_p": "Nuestro sistema financiero, construido por nosotros: facturación, cobros, gastos, presupuestos y análisis en un mismo sitio. Es el que usamos para nuestras propias cuentas.",
        "fin_cta": ("Abrir la demo", "/sistema-financiero/demo"), "fin_cta2": ("Ver D-Code Finance", "/sistema-financiero"),
        "fin_shots": [
            ("finance-panel", "Panel de D-Code Finance con lo facturado, cobrado, pendiente y vencido, alertas y actividad reciente."),
            ("finance-cobros", "Cobros: facturas vencidas, en seguimiento, pendientes y cobradas."),
            ("finance-factura", "Ficha de una factura en seguimiento, con su presupuesto de origen y los recordatorios enviados."),
            ("finance-pregunta", "Pregunta a Finanzas: «¿Cuánto me deben en total?», respondida citando la factura vencida."),
        ],
        "fin_cap": "Demo de D-Code Finance con una empresa y datos ficticios.",
        "fin_list_h": "Catorce piezas que ya funcionan juntas",
        "cas_h": "Primero lo probamos en casa.",
        "cas_p": "Cada pieza dirige antes una parte real de D-Code. Tres casos, incluido uno en el que nuestra hipótesis era falsa.",
        "cas_cols": ("Caso", "Antes", "Ahora", "Qué aprendimos"),
        "cas_l": ("Los casos completos", "/casos-exito"),
        "com_h": "Por escrito, antes de empezar.",
        "com_p": "No prometemos un resultado antes de haberlo medido contigo. Lo que sí garantizamos es cómo trabajamos, y eso se puede exigir desde el primer día.",
        "com_l": ("Garantías y proceso", "/garantias"),
        "duo_h": "Dos fundadores, una mitad cada uno.",
        "duo_p": "Cada Departamento que ves en esta web pasa primero por nuestra propia empresa. Así lo probamos.",
        "duo_l": ("Conócenos", "/conocenos"),
        "cur_h": "Lo que estamos construyendo.",
        "cur_p": "El estado real de lo que tenemos en marcha, sin plazos inventados.",
        "cur_l": ("Cambios en proceso", "/cambios-en-proceso"),
        "end_h": "Empecemos por tu operación.",
        "end_p": "En una llamada de 30 minutos te decimos qué construiríamos, con qué alcance y por dónde empezaríamos.",
        "end_l": ("Leer las preguntas frecuentes", "/faq"),
        "credit": "",
    },
    "en": {
        "pron": "/diːˈkoʊd/", "origin": "From <i>decode</i>: to make sense of.",
        "gram": "n.", "gram_t": "noun",
        "def": "A Madrid team that reads how your company works, finds where the time goes and builds the system that does the repetitive work on its own.",
        "cta": ("Book a call", "/en/contacto"), "cta2": ("How we work", "/en/metodo"),
        "note": "Thirty minutes. We reply within 24 hours.",
        "dic_h": "What we hear, decoded.",
        "dic_p": "Almost every first call starts with one of these sentences. This is what is usually behind it and what the system does instead.",
        "dic_sys": "The system:",
        "dec_h": "Decode one of your tasks.",
        "dec_p": "Pick the sentence that sounds most like your week, say how long it takes and how often it happens. We tell you how much time that is a year and what the system would do.",
        "dec_f": "The sentence", "dec_min": "Minutes each time", "dec_veces": "Times a week", "dec_per": "People doing it",
        "dec_unit": "hours a year",
        "dec_eq": "About {j} eight-hour days, counting {s} working weeks.",
        "dec_sys": "The system does", "dec_hum": "A person still decides",
        "dec_cta": "Let's talk about these hours", "dec_dep": "See {area}",
        "dec_fine": "It is arithmetic with your numbers, not a promise. How much can be automated is measured with you in the diagnosis.",
        "met_h": "First understand.<br> Then build.",
        "met_p": "We do not start by writing code. We start by looking at how your company really works, and we build nothing until you know exactly what we are going to build.",
        "met": [
            ("Diagnosis", "We walk through your real operation: which processes eat the most hours, where opportunities are lost and which tasks slow the team down. It is not a questionnaire."),
            ("Design and scope", "We decide what gets automated, what a person keeps deciding, which tools it connects to and what we will measure. We agree it in writing before building."),
            ("Build", "We adapt the pieces we already know how to build and develop whatever is missing, in your real operation, not in an isolated test environment."),
            ("Measure and adjust", "We compare hours, response times and automated processes with your starting point, and adjust whatever needs it."),
        ],
        "met_l": ("The full method", "/en/metodo"),
        "org_h": "Your org chart, with a system.",
        "org_p": "Eight pieces we already know how to build, one per area. It is not a catalogue: if your problem needs something else, we build something else.",
        "org_f": 'Each piece is built with three disciplines: <a href="/en/servicios/automatizacion-ia">process automation</a>, <a href="/en/servicios/agentes-ia">AI agents</a> and <a href="/en/servicios/integraciones">integrations</a>.',
        "org_all": ("See all eight capabilities", "/en/departamentos"),
        "fin_p": "Our own financial system, built by us: invoicing, collections, expenses, quotes and analysis in one place. It is the one we use for our own accounts.",
        "fin_cta": ("Open the demo", "/en/sistema-financiero/demo"), "fin_cta2": ("See D-Code Finance", "/en/sistema-financiero"),
        "fin_shots": [
            ("finance-panel", "D-Code Finance dashboard with invoiced, collected, pending and overdue amounts, alerts and recent activity."),
            ("finance-cobros", "Collections: overdue, followed-up, pending and paid invoices."),
            ("finance-factura", "An invoice under follow-up, with its source quote and the reminders sent."),
            ("finance-pregunta", "Ask Finance: «How much are we owed?», answered citing the overdue invoice."),
        ],
        "fin_cap": "D-Code Finance demo with a fictitious company and data (interface in Spanish).",
        "fin_list_h": "Fourteen pieces that already work together",
        "cas_h": "We try it at home first.",
        "cas_p": "Every piece first runs a real part of D-Code. Three cases, including one where our hypothesis was wrong.",
        "cas_cols": ("Case", "Before", "Now", "What we learned"),
        "cas_l": ("The full cases", "/en/casos-exito"),
        "com_h": "In writing, before we start.",
        "com_p": "We do not promise a result before measuring it with you. What we do guarantee is how we work, and you can hold us to it from day one.",
        "com_l": ("Guarantees and process", "/en/garantias"),
        "duo_h": "Two founders, one half each.",
        "duo_p": "Every Department you see on this site runs in our own company first. That is how we test it.",
        "duo_l": ("About us", "/en/conocenos"),
        "cur_h": "What we are building.",
        "cur_p": "The real status of what we have running, with no made-up deadlines.",
        "cur_l": ("Changes in progress", "/en/cambios-en-proceso"),
        "end_h": "Let's start with your operation.",
        "end_p": "In a 30-minute call we tell you what we would build, with what scope and where we would start.",
        "end_l": ("Read the FAQ", "/en/faq"),
        "credit": "",
    },
}


def _hero(t):
    return f"""<section class="hero" aria-labelledby="hero-h">
  <div class="hero-word">
    <h1 id="hero-h" class="hero-h" data-r>D-Code</h1>
    <p class="hero-pron" data-r><span class="hero-ipa">{t['pron']}</span> {t['origin']}</p>
    <p class="hero-def" data-r><abbr title="{t['gram_t']}">{t['gram']}</abbr> {t['def']}</p>
    <div class="hero-act" data-r>
      <a class="btn btn--big" href="{t['cta'][1]}">{t['cta'][0]}</a>
      <a class="link" href="{t['cta2'][1]}">{t['cta2'][0]}</a>
    </div>
    <p class="hero-note" data-r>{t['note']}</p>
  </div>
  <div class="hero-mark">{mark('mark-xl', anim=True)}</div>
</section>"""


def _diccionario(t, frases):
    # Como en un diccionario: entradas en orden alfabético y, arriba, la primera y la última palabra.
    import unicodedata
    clave = lambda f: unicodedata.normalize("NFD", f["frase"]).encode("ascii", "ignore").decode().lower()
    frases = sorted(frases, key=clave)
    first = frases[0]["frase"].split()[0].strip(".,").lower()
    last = frases[-1]["frase"].split()[0].strip(".,").lower()
    ents = "".join(
        f"""<article class="ent" data-r>
      <h3 class="ent-h">«{e(f['frase'])}»</h3>
      <p class="ent-g"><i>{f['gram']}</i> {e(f['detras'])}</p>
      <p class="ent-s"><span class="sq" aria-hidden="true"></span>{e(f['sistema'])}</p>
      <a class="ent-a" href="{f['href']}">{e(f['area'])}</a>
    </article>"""
        for f in frases
    )
    return f"""<section class="dic" id="diccionario" aria-labelledby="dic-h">
  <div class="sec-head">
    <h2 id="dic-h" data-r>{t['dic_h']}</h2>
    <p class="lead" data-r>{t['dic_p']}</p>
  </div>
  <p class="dic-guide" aria-hidden="true"><span>{first}</span><span>{last}</span></p>
  <div class="dic-cols">{ents}</div>
</section>"""


def _descifrador(t, frases, lang):
    f0 = frases[0]
    h0 = horas_anuales(f0["min"], f0["veces"])
    opts = "".join(f'<option value="{f["id"]}">«{e(f["frase"])}»</option>' for f in frases)
    data = {f["id"]: {k: f[k] for k in ("sistema", "persona", "area", "href", "min", "veces", "frase")} for f in frases}
    cfg = {"semanas": SEMANAS, "eq": t["dec_eq"], "dep": t["dec_dep"], "contacto": t["cta"][1], "lang": lang}
    return f"""<section class="dec" id="descifrador" aria-labelledby="dec-h">
  <div class="dec-intro">
    <h2 id="dec-h" data-r>{t['dec_h']}</h2>
    <p data-r>{t['dec_p']}</p>
  </div>
  <form class="dec-form" data-dec novalidate>
    <label class="dec-f dec-f--wide"><span>{t['dec_f']}</span><select name="frase">{opts}</select></label>
    <label class="dec-f"><span>{t['dec_min']}</span><output data-v="min">{f0['min']}</output>
      <input type="range" name="min" min="5" max="120" step="5" value="{f0['min']}"></label>
    <label class="dec-f"><span>{t['dec_veces']}</span><output data-v="veces">{f0['veces']}</output>
      <input type="range" name="veces" min="1" max="40" step="1" value="{f0['veces']}"></label>
    <label class="dec-f"><span>{t['dec_per']}</span><output data-v="personas">1</output>
      <input type="range" name="personas" min="1" max="10" step="1" value="1"></label>
  </form>
  <div class="dec-out" aria-live="polite">
    <p class="dec-num"><span data-horas>{h0}</span> <span class="dec-unit">{t['dec_unit']}</span></p>
    <p class="dec-eq" data-eq>{t['dec_eq'].format(j=round(h0 / 8), s=SEMANAS)}</p>
    <div class="dec-split">
      <div><h3>{t['dec_sys']}</h3><p data-sis>{e(f0['sistema'])}</p></div>
      <div><h3>{t['dec_hum']}</h3><p data-per>{e(f0['persona'])}</p></div>
    </div>
    <p class="dec-act"><a class="btn btn--ink" data-cta href="{t['cta'][1]}">{t['dec_cta']}</a>
      <a class="link link--light" data-dep href="{f0['href']}">{t['dec_dep'].format(area=f0['area'])}</a></p>
    <p class="dec-fine">{t['dec_fine']}</p>
  </div>
  <script type="application/json" id="dec-data">{json.dumps({"cfg": cfg, "frases": data}, ensure_ascii=False)}</script>
</section>"""


def _metodo(t):
    steps = "".join(
        f'<li data-r><span class="trk-dot" aria-hidden="true"></span><h3>{a}</h3><p>{b}</p></li>' for a, b in t["met"]
    )
    return f"""<section class="met" aria-labelledby="met-h">
  <div class="met-head">
    <h2 id="met-h" data-r>{t['met_h']}</h2>
    <p class="statement" data-r>{t['met_p']}</p>
  </div>
  <ol class="trk">{steps}</ol>
  <p class="met-more" data-r><a class="link" href="{t['met_l'][1]}">{t['met_l'][0]}</a></p>
</section>"""


def _organigrama(t, org):
    def node(n, top=False):
        name, href, do, st = n
        st_html = f'<span class="org-st">{st}</span>' if st else ""
        return f'<a class="org-n{" org-n--top" if top else ""}" href="{href}" data-r><span class="org-name">{name}</span><span class="org-do">{do}</span>{st_html}</a>'
    areas = "".join(f"<li>{node(a)}</li>" for a in org["areas"])
    return f"""<section class="org" aria-labelledby="org-h">
  <div class="sec-head sec-head--split">
    <h2 id="org-h" data-r>{t['org_h']}</h2>
    <p class="lead" data-r>{t['org_p']}</p>
  </div>
  <div class="org-chart">
    <div class="org-top">{node(org['top'], True)}</div>
    <ul class="org-row">{areas}</ul>
  </div>
  <p class="org-foot" data-r>{t['org_f']} <a class="link" href="{t['org_all'][1]}">{t['org_all'][0]}</a></p>
</section>"""


def _finance(t, piezas):
    big, *small = t["fin_shots"]
    smalls = "".join(
        f'<figure class="fin-s" data-r><img src="/assets/img/v9/{n}-960.webp" width="960" height="600" loading="lazy" decoding="async" alt="{e(alt)}"></figure>'
        for n, alt in small
    )
    lista = "".join(f"<div><dt>{a}</dt><dd>{b}</dd></div>" for a, b in piezas)
    return f"""<section class="fin" aria-labelledby="fin-h">
  <div class="fin-head">
    <h2 id="fin-h" data-r>D-Code Finance</h2>
    <p class="statement" data-r>{t['fin_p']}</p>
    <p class="fin-act" data-r><a class="btn" href="{t['fin_cta'][1]}">{t['fin_cta'][0]}</a>
      <a class="link link--light" href="{t['fin_cta2'][1]}">{t['fin_cta2'][0]}</a></p>
  </div>
  <figure class="fin-big" data-ui>
    <img src="/assets/img/v9/{big[0]}.webp" srcset="/assets/img/v9/{big[0]}-960.webp 960w, /assets/img/v9/{big[0]}.webp 1920w"
      sizes="(min-width: 1200px) 86vw, 100vw" width="1920" height="1200" loading="lazy" decoding="async" alt="{e(big[1])}">
  </figure>
  <div class="fin-strip">{smalls}</div>
  <p class="fin-cap">{t['fin_cap']}</p>
  <h3 class="fin-list-h" data-r>{t['fin_list_h']}</h3>
  <dl class="fin-list">{lista}</dl>
</section>"""


def _casos(t, casos):
    c = t["cas_cols"]
    rows = "".join(
        f"""<tr data-r><th scope="row"><span class="cas-a">{x['area']}</span>{x['titulo']}</th>
      <td data-c="{c[1]}">{x['antes']}</td><td data-c="{c[2]}">{x['ahora']}</td><td data-c="{c[3]}">{x['aprendido']}</td></tr>"""
        for x in casos
    )
    return f"""<section class="cas" aria-labelledby="cas-h">
  <div class="sec-head">
    <h2 id="cas-h" data-r>{t['cas_h']}</h2>
    <p class="lead" data-r>{t['cas_p']}</p>
  </div>
  <table class="cas-t">
    <thead><tr><th scope="col">{c[0]}</th><th scope="col">{c[1]}</th><th scope="col">{c[2]}</th><th scope="col">{c[3]}</th></tr></thead>
    <tbody>{rows}</tbody>
  </table>
  <p class="cas-more" data-r><a class="link" href="{t['cas_l'][1]}">{t['cas_l'][0]}</a></p>
</section>"""


def _compromisos(t, com):
    items = "".join(f'<li data-r><h3>{a}</h3><p>{b}</p></li>' for a, b in com)
    return f"""<section class="com" aria-labelledby="com-h">
  <div class="com-head">
    <h2 id="com-h" data-r>{t['com_h']}</h2>
    <p class="statement" data-r>{t['com_p']}</p>
    <p data-r><a class="link" href="{t['com_l'][1]}">{t['com_l'][0]}</a></p>
  </div>
  <ul class="com-list">{items}</ul>
</section>"""


def _duo(t, fund):
    halves = "".join(
        f"""<article class="duo-h" data-r>
      <img src="{img}" width="492" height="492" loading="lazy" decoding="async" alt="{e(name)}">
      <h3>{name}</h3><p class="duo-role">{role}</p><p>{bio}</p>
    </article>"""
        for name, role, img, bio in fund
    )
    return f"""<section class="duo" aria-labelledby="duo-h">
  <div class="sec-head sec-head--split">
    <h2 id="duo-h" data-r>{t['duo_h']}</h2>
    <p class="lead" data-r>{t['duo_p']} <a class="link" href="{t['duo_l'][1]}">{t['duo_l'][0]}</a></p>
  </div>
  <div class="duo-pair">{halves}<span class="duo-knot" aria-hidden="true"></span></div>
</section>"""


def _en_curso(t, items):
    lis = "".join(
        f'<li class="cur-i cur-i--{k}" data-r><span class="cur-sq" aria-hidden="true"></span><h3>{a}</h3><p>{b}</p><span class="cur-st">{st}</span></li>'
        for a, b, st, k in items
    )
    return f"""<section class="cur" aria-labelledby="cur-h">
  <div class="sec-head">
    <h2 id="cur-h" data-r>{t['cur_h']}</h2>
    <p class="lead" data-r>{t['cur_p']} <a class="link" href="{t['cur_l'][1]}">{t['cur_l'][0]}</a></p>
  </div>
  <ul class="cur-l">{lis}</ul>
</section>"""


def _cierre(t):
    return f"""<section class="end" aria-labelledby="end-h">
  <h2 id="end-h" data-r>{t['end_h']}</h2>
  <p class="statement" data-r>{t['end_p']}</p>
  <p class="end-act" data-r><a class="btn btn--big" href="{t['cta'][1]}">{t['cta'][0]}</a>
    <a class="link" href="{t['end_l'][1]}">{t['end_l'][0]}</a></p>
</section>"""


def build(lang: str = "es"):
    t = T[lang]
    main = "\n".join([
        _hero(t),
        _diccionario(t, FRASES[lang]),
        _descifrador(t, FRASES[lang], lang),
        _metodo(t),
        _organigrama(t, ORGANIGRAMA[lang]),
        _finance(t, FINANCE[lang]),
        _casos(t, CASOS[lang]),
        _compromisos(t, COMPROMISOS[lang]),
        _duo(t, FUNDADORES[lang]),
        _en_curso(t, EN_CURSO[lang]),
        _cierre(t),
    ])
    if lang == "es":
        page("index.html", "index.html", "es", "/", main, "p-home",
             title="D-Code Partners — Leemos cómo trabaja tu empresa y construimos su sistema",
             description="Leemos cómo trabaja tu empresa, encontramos dónde se pierde el tiempo y construimos el sistema que hace solo el trabajo repetido. Madrid. Llamada de 30 minutos.")
    else:
        page("en/index.html", "en/index.html", "en", "/en/", main, "p-home",
             title="D-Code Partners — We read how your company works and build its system",
             description="We read how your company works, find where the time goes and build the system that does the repetitive work on its own. Madrid. 30-minute call.")
