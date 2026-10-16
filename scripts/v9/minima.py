"""Piezas de la versión mínima: cabecera de página, filas, pasos, antes/después y cierre.

Una idea por bloque. El título de cada bloque va a la izquierda y el contenido a
la derecha; en el teléfono, uno encima del otro.
"""
from common import e
from plantillas import crumbs

CIERRE = {
    "es": {"h": "¿Hablamos?", "p": "En 30 minutos te decimos qué automatizaríamos y por dónde empezar.",
           "cta": ("Reservar 30 minutos", "/contacto"),
           "gar": ["Alcance por escrito", "Sin permanencia", "El sistema es tuyo"]},
    "en": {"h": "Shall we talk?", "p": "In 30 minutes we tell you what we would automate and where to start.",
           "cta": ("Book 30 minutes", "/en/contacto"),
           "gar": ["Scope in writing", "No lock-in", "The system is yours"]},
}


def cabecera(lang, h1, sub=None, migas=(), acciones=None, chip=None, extra=""):
    """Cabecera de página interior: migas, título, una frase y, si hace falta, botones."""
    mg = crumbs(lang, list(migas)) if migas else ""
    ch = f'<p class="mp-chip" data-r>{chip}</p>' if chip else ""
    sb = f'<p class="mh-sub" data-r>{sub}</p>' if sub else ""
    act = ""
    if acciones:
        act = '<p class="mh-act mp-act" data-r>' + "".join(
            f'<a class="{"btn btn--big" if i == 0 else "link"}" href="{h}">{l}</a>' for i, (l, h) in enumerate(acciones)) + "</p>"
    return f"""<section class="mp">
  {mg}
  <div class="mp-text">{ch}<h1 data-r>{h1}</h1>{sb}{extra}{act}</div>
</section>"""


def filas(label, rows, more=None, ident="f", grande=True):
    """Filas: título, una línea y, si la hay, una etiqueta o un enlace. rows = [(t, d, href|None, tag|None)]."""
    lis = []
    for r in rows:
        t, d = r[0], r[1]
        href = r[2] if len(r) > 2 else None
        tag = r[3] if len(r) > 3 else None
        fin = f'<span class="mq-tag">{tag}</span>' if tag else ('<span class="mq-go" aria-hidden="true"></span>' if href else "")
        inner = f'<span class="mq-t">{t}</span><span class="mq-d">{d}</span>{fin}'
        lis.append(f'<li data-r><a href="{href}">{inner}</a></li>' if href else f'<li data-r><div class="mq-row">{inner}</div></li>')
    m = f'<p class="ms-more" data-r><a class="link" href="{more[1]}">{more[0]}</a></p>' if more else ""
    return f"""<section class="ms" aria-labelledby="{ident}-l">
  <h2 class="ms-l" id="{ident}-l" data-r>{label}</h2>
  <ul class="mq{'' if grande else ' mq--s'}">{''.join(lis)}</ul>{m}
</section>"""


def pasos(label, items, ident="p"):
    lis = "".join(f'<li data-r><h3>{a}</h3><p>{b}</p></li>' for a, b in items)
    return f"""<section class="ms" aria-labelledby="{ident}-l">
  <h2 class="ms-l" id="{ident}-l" data-r>{label}</h2>
  <ol class="mc" style="--n:{len(items)}">{lis}</ol>
</section>"""


def cambio(lang, label, antes, despues, ident="c"):
    """Antes y después, fila a fila: lo que pasa hoy frente a lo que hace el sistema."""
    hoy, con = ("Hoy", "Con el sistema") if lang == "es" else ("Today", "With the system")
    filas_html = "".join(
        f'<li data-r><p class="ad-a"><span class="ad-k">{hoy}: </span>{a}</p>'
        f'<p class="ad-b"><span class="ad-k">{con}: </span>{b}</p></li>'
        for a, b in zip(antes, despues))
    return f"""<section class="ms" aria-labelledby="{ident}-l">
  <h2 class="ms-l" id="{ident}-l" data-r>{label}</h2>
  <div class="ad">
    <p class="ad-h" aria-hidden="true"><span>{hoy}</span><span>{con}</span></p>
    <ul>{filas_html}</ul>
  </div>
</section>"""


def figura(nombre, alt, w=1920, h=1200, cls=""):
    return f"""<figure class="mfig {cls}" data-r>
  <img src="/assets/img/v9/{nombre}.webp" srcset="/assets/img/v9/{nombre}-960.webp 960w, /assets/img/v9/{nombre}.webp {w}w"
    sizes="(min-width: 1100px) 90vw, 100vw" width="{w}" height="{h}" loading="lazy" decoding="async" alt="{e(alt)}">
</figure>"""


def cierre(lang, h=None, p=None, primario=None, secundario=None, garantias=True):
    c = CIERRE[lang]
    label, href = primario or c["cta"]
    sec = f'<a class="link" href="{secundario[1]}">{secundario[0]}</a>' if secundario else ""
    gar = ('<ul class="mg" data-r>' + "".join(f"<li>{g}</li>" for g in c["gar"]) + "</ul>") if garantias else ""
    return f"""<section class="me" aria-labelledby="me-h">
  <h2 id="me-h" data-r>{h or c['h']}</h2>
  <p class="mh-sub" data-r>{p or c['p']}</p>
  <p class="mh-act me-act" data-r><a class="btn btn--big" href="{href}">{label}</a>{sec}</p>
  {gar}
</section>"""
