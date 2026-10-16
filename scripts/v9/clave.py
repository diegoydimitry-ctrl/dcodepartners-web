"""Páginas clave en versión mínima: índices, método, garantías, nosotros, casos,
en curso, D-Code Finance y contacto.

Los textos salen de la web de producción (commit SRC_COMMIT) y de datos.py; aquí
solo se acortan. Nada de cifras, clientes ni resultados nuevos.
"""
import re
import subprocess

from common import CTA, ROOT, page, src
from datos import CASOS, COMPROMISOS, EN_CURSO, FUNDADORES, ORGANIGRAMA
from extraer import piezas, secciones, texto
from minima import cabecera, cierre, figura, filas, pasos


def _pre(lang):
    return "" if lang == "es" else "en/"


def _u(lang, slug=""):
    return ("/" if lang == "es" else "/en/") + slug


def _hero(path):
    ps = piezas(secciones(path)[0])
    h1 = next((p[1] for p in ps if p[0] == "h1"), "")
    p = next((p[1] for p in ps if p[0] == "p"), "")
    return h1, p


def areas(lang):
    """Las ocho áreas en el orden del menú de producción, con su estado si lo tienen."""
    org = ORGANIGRAMA[lang]
    return org["areas"] + [org["top"]]


SERV = ["automatizacion-ia", "agentes-ia", "integraciones"]


def servicio_nombre(path):
    ps = piezas(secciones(path)[0])
    eb = next((p[1] for p in ps if p[0] == "eyebrow"), "")
    return eb.split("·")[-1].strip() if "·" in eb else eb


# ---------------------------------------------------------------- índices

def departamentos(lang):
    es = lang == "es"
    path = f"{_pre(lang)}departamentos.html"
    rows = [(n, d, h if es else h, s) for n, h, d, s in areas(lang)]
    main = cabecera(
        lang, "Qué automatizamos" if es else "What we automate",
        "Ocho áreas de una empresa. Empezamos por la que más tiempo te quita." if es
        else "Eight areas of a company. We start with the one that takes most of your time.",
    ) + filas("Las ocho áreas" if es else "The eight areas", rows, ident="areas") + cierre(lang)
    page(path, path, lang, _u(lang, "departamentos"), main, "p-min",
         title="Qué automatizamos — D-Code Partners" if es else "What we automate — D-Code Partners")


def servicios(lang):
    es = lang == "es"
    path = f"{_pre(lang)}servicios.html"
    h1, p = _hero(path)
    rows = []
    for s in SERV:
        sp = f"{_pre(lang)}servicios/{s}.html"
        rows.append((servicio_nombre(sp), texto(_hero(sp)[0]), _u(lang, f"servicios/{s}")))
    main = cabecera(lang, h1, p) + filas("Las tres" if es else "The three", rows, ident="serv") + cierre(lang)
    page(path, path, lang, _u(lang, "servicios"), main, "p-min")


# ---------------------------------------------------------------- empresa

METODO = {
    "es": {"sub": "No construimos nada hasta que sepas exactamente qué vamos a construir.", "l": "Cuatro pasos",
           "d": ["Qué procesos consumen más horas y dónde se pierden oportunidades.",
                 "Qué se automatiza, qué decide una persona y qué medimos. Por escrito.",
                 "Sobre tu operativa real, no sobre una maqueta.",
                 "Con datos, frente a tu punto de partida. Y ajustamos."]},
    "en": {"sub": "We build nothing until you know exactly what we are going to build.", "l": "Four steps",
           "d": ["Which processes take the most hours and where opportunities are lost.",
                 "What gets automated, what a person decides and what we measure. In writing.",
                 "On your real operation, not on a mock-up.",
                 "With data, against your starting point. And we adjust."]},
}


def metodo(lang):
    path = f"{_pre(lang)}metodo.html"
    h1, _ = _hero(path)
    h3s = [p[1] for p in piezas(secciones(path)[1]) if p[0] == "h3"][:4]
    m = METODO[lang]
    main = cabecera(lang, h1, m["sub"]) + pasos(m["l"], list(zip(h3s, m["d"])), ident="pasos") + cierre(lang)
    page(path, path, lang, _u(lang, "metodo"), main, "p-min")


def garantias(lang):
    es = lang == "es"
    path = f"{_pre(lang)}garantias.html"
    h1, _ = _hero(path)
    sub = ("No prometemos un resultado antes de medirlo contigo. Garantizamos cómo trabajamos." if es
           else "We do not promise a result before measuring it with you. We guarantee how we work.")
    rows = [(t.rstrip("."), d) for t, d in COMPROMISOS[lang]]
    main = (cabecera(lang, h1, sub) + filas("Cinco compromisos" if es else "Five commitments", rows, ident="com", grande=False)
            + cierre(lang, garantias=False, secundario=("Ver el método" if es else "See the method", _u(lang, "metodo"))))
    page(path, path, lang, _u(lang, "garantias"), main, "p-min")


def conocenos(lang):
    es = lang == "es"
    path = f"{_pre(lang)}conocenos.html"
    personas = "".join(
        f"""<li data-r>
      <img src="{foto}" width="492" height="492" loading="lazy" decoding="async" alt="{n}">
      <h3>{n}</h3><p class="mper-r">{rol}</p><p>{bio.split('. ')[0].rstrip('.')}.</p>
    </li>"""
        for n, rol, foto, bio in FUNDADORES[lang])
    main = (cabecera(lang, "Somos Diego y Dimitry." if es else "We are Diego and Dimitry.",
                     "Cada sistema que ofrecemos funciona primero en nuestra propia empresa." if es
                     else "Every system we offer runs inside our own company first.")
            + f"""<section class="ms" aria-labelledby="per-l">
  <h2 class="ms-l" id="per-l" data-r>{'Los fundadores' if es else 'The founders'}</h2>
  <ul class="mper">{personas}</ul>
</section>""" + cierre(lang, secundario=("Ver los casos" if es else "See the cases", _u(lang, "casos-exito"))))
    page(path, path, lang, _u(lang, "conocenos"), main, "p-min")


def casos(lang):
    es = lang == "es"
    path = f"{_pre(lang)}casos-exito.html"
    rows = [(c["titulo"], c["ahora"], None, c["area"]) for c in CASOS[lang]]
    main = (cabecera(lang, "Lo probamos primero en nuestra empresa." if es else "We test it in our own company first.",
                     "Tres casos reales, incluido uno en el que la primera hipótesis era errónea." if es
                     else "Three real cases, including one where the first hypothesis was wrong.")
            + filas("Tres casos" if es else "Three cases", rows, ident="casos", grande=False) + cierre(lang))
    page(path, path, lang, _u(lang, "casos-exito"), main, "p-min")


def en_curso(lang):
    es = lang == "es"
    path = f"{_pre(lang)}cambios-en-proceso.html"
    rows = [(n, d, None, st) for n, d, st, _ in EN_CURSO[lang]]
    main = (cabecera(lang, "En curso" if es else "In progress",
                     "Qué estamos construyendo ahora y qué ya funciona." if es else "What we are building now and what already runs.")
            + filas("Ahora mismo" if es else "Right now", rows, ident="curso", grande=False) + cierre(lang))
    page(path, path, lang, _u(lang, "cambios-en-proceso"), main, "p-min")


def como_funciona(lang):
    es = lang == "es"
    path = f"{_pre(lang)}como-funciona.html"
    h1, _ = _hero(path)
    outs = [(p[1], p[2]) for x in secciones(path) for p in piezas(x) if p[0] == "out"]
    main = (cabecera(lang, h1, "Lo que pasa en un área lo saben las demás, sin que nadie tenga que avisar." if es
                     else "What happens in one area, the others know, without anyone having to pass it on.")
            + filas("Qué obtienes" if es else "What you get", outs, ident="cf", grande=False)
            + cierre(lang, secundario=("Ver las 8 áreas" if es else "See all 8 areas", _u(lang, "departamentos"))))
    page(path, path, lang, _u(lang, "como-funciona"), main, "p-min")


# ---------------------------------------------------------------- D-Code Finance

FIN = {
    "es": {"sub": "Facturación, cobros, gastos, presupuestos y análisis en un mismo sitio.", "demo": "Abrir la demo",
           "l": "Qué resuelve", "fig": "Panel de D-Code Finance (demo con datos ficticios).",
           "fin_h": "Recórrelo tú.", "fin_p": "Demo con datos de ejemplo. Sin registro."},
    "en": {"sub": "Invoicing, collections, expenses, quotes and analytics in one place.", "demo": "Open the demo",
           "l": "What it solves", "fig": "D-Code Finance dashboard (demo with fictitious data).",
           "fin_h": "Try it yourself.", "fin_p": "Demo with sample data. No sign-up."},
}


def finance(lang):
    es = lang == "es"
    path = f"{_pre(lang)}sistema-financiero.html"
    f = FIN[lang]
    outs = [(p[1].rstrip(".") + ".", p[2]) for s in secciones(path) for p in piezas(s) if p[0] == "out"][:3]
    demo = (f["demo"], _u(lang, "sistema-financiero/demo"))
    main = (cabecera(lang, "D-Code Finance", f["sub"], acciones=[demo, (CTA[lang][0], CTA[lang][1])])
            + f'<section class="mfig-wrap">{figura("finance-panel", f["fig"])}</section>'
            + pasos(f["l"], outs, ident="fin")
            + cierre(lang, f["fin_h"], f["fin_p"], primario=demo, secundario=CTA[lang], garantias=False))
    page(path, path, lang, _u(lang, "sistema-financiero"), main, "p-min")


# ---------------------------------------------------------------- contacto

CONT = {
    "es": {"h1": "Hablemos.", "sub": "Cuéntanos en qué punto está tu empresa. En 30 minutos te decimos qué construiríamos y por dónde empezar.",
           "cal_h": "¿Prefieres elegir hora?", "cal_p": "Reserva la llamada directamente, sin formulario.", "cal_b": "Ver disponibilidad",
           "dir": "Directo", "faq": ("¿Dudas antes? Preguntas frecuentes", "/faq"), "form": "Formulario de contacto"},
    "en": {"h1": "Let's talk.", "sub": "Tell us where your company stands. In 30 minutes we tell you what we would build and where to start.",
           "cal_h": "Prefer to pick a time?", "cal_p": "Book the call directly, no form.", "cal_b": "See availability",
           "dir": "Direct", "faq": ("Questions first? FAQ", "/en/faq"), "form": "Contact form"},
}


def _formulario(path):
    """El formulario de producción tal cual: main.js depende de sus id y clases."""
    s = src(path)
    i = s.find("<form ")
    j = s.find('<div class="window booking-card')
    bloque = s[i:j].rstrip()
    for _ in range(2):  # cierra window-body y window, que v9 no usa
        bloque = bloque[: bloque.rfind("</div>")].rstrip()
    bloque = re.sub(r"<!--.*?-->", "", bloque, flags=re.S)
    return bloque


# En producción este script quedó en una sola línea desde el rediseño v5 (93c1495):
# el primer comentario «//» anula todo lo que sigue y el calendario no llega a
# cargarse. Se toma la última versión con saltos de línea (72c3faf), idéntica en
# todo lo demás (comprobado: mismo texto al normalizar los espacios).
CAL_COMMIT = "72c3faf"


def _script_cal(path):
    s = subprocess.run(["git", "show", f"{CAL_COMMIT}:{path}"], cwd=ROOT, check=True,
                       capture_output=True, text=True).stdout
    m = next(x for x in re.finditer(r"<script>(.*?)</script>", s, flags=re.S) if "reunion-30min" in x.group(1))
    js = m.group(1)
    # El calendario adopta los colores de v9: claro y con el azul de la marca.
    js = js.replace("theme: 'dark'", "theme: 'light'")
    js = re.sub(r"cssVarsPerTheme:\s*\{\s*dark:\s*\{\s*'cal-brand':\s*'#[0-9a-fA-F]+'\s*\}\s*\}",
                "cssVarsPerTheme: { light: { 'cal-brand': '#0A5CF5' } }", js)
    js = js.replace("// Tema oscuro D-Code + cian como acento", "// Tema claro de v9 + el azul de la marca como acento")
    return "<script>" + js + "</script>"


def contacto(lang):
    path = f"{_pre(lang)}contacto.html"
    c = CONT[lang]
    form = _formulario(path)
    cal = ('<button type="button" class="btn btn--ink" id="booking-cta-btn" data-cal-link="dimitry-y-diego-y9tbqp/30min" '
           'data-cal-namespace="reunion-30min" data-cal-config=\'{"layout":"month_view","theme":"light"}\'>' + c["cal_b"] + "</button>")
    main = cabecera(lang, c["h1"], c["sub"]) + f"""<section class="contact">
  <div class="contact-form" data-r>
    <h2 class="sr-only">{c['form']}</h2>
    {form}
  </div>
  <aside class="contact-side">
    <div data-r>
      <h2>{c['cal_h']}</h2>
      <p>{c['cal_p']}</p>
      <p class="contact-cal">{cal}</p>
    </div>
    <div data-r>
      <h2>{c['dir']}</h2>
      <dl>
        <dt>Email</dt><dd><a href="mailto:dcodedepartment@gmail.com">dcodedepartment@gmail.com</a></dd>
        <dt>Diego</dt><dd><a href="tel:+34680223439">680 22 34 39</a></dd>
        <dt>Dimitry</dt><dd><a href="tel:+34614547570">614 54 75 70</a></dd>
      </dl>
    </div>
    <p data-r><a class="link" href="{c['faq'][1]}">{c['faq'][0]}</a></p>
  </aside>
</section>"""
    page(path, path, lang, _u(lang, "contacto"), main, "p-contacto", scripts=_script_cal(path))


def build(lang):
    departamentos(lang)
    servicios(lang)
    metodo(lang)
    garantias(lang)
    conocenos(lang)
    casos(lang)
    en_curso(lang)
    finance(lang)
    contacto(lang)
    como_funciona(lang)
