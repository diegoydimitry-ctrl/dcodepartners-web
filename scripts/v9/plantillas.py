"""Bloques reutilizables de las páginas interiores v9."""
import re

from extraer import limpiar_inline, texto

LABELS = {
    "es": {"inicio": "Inicio", "antes": "Hoy, sin sistema", "despues": "Con el sistema", "migas": "Ruta"},
    "en": {"inicio": "Home", "antes": "Today, without a system", "despues": "With the system", "migas": "Breadcrumb"},
}

# Indicaciones de los antiguos widgets interactivos, que v9 ya no tiene.
RUIDO = (
    "Pasa el ratón", "Pasa el cursor", "Hover", "hover", "Desliza para", "Swipe", "En pantallas pequeñas",
    "On small screens", "Representación simplificada", "Representación del sistema", "Simplified representation",
    "System representation", "Ejemplo ilustrativo", "Illustrative example", "no son datos de un cliente real",
    "not real client data", "not a real client",
)


def es_ruido(t: str) -> bool:
    return any(r in t for r in RUIDO)


def crumbs(lang: str, pares: list[tuple[str, str | None]]) -> str:
    L = LABELS[lang]
    home = "/" if lang == "es" else "/en/"
    items = [f'<a href="{home}">{L["inicio"]}</a>']
    for label, href in pares:
        items.append(f'<a href="{href}">{label}</a>' if href else f'<span aria-current="page">{label}</span>')
    return f'<nav class="crumbs" aria-label="{L["migas"]}">' + '<span aria-hidden="true">/</span>'.join(items) + "</nav>"


def phero(lang, h1, statement=None, migas=(), acciones=None, chips=None, corto=False, extra=""):
    st = f'<p class="statement" data-r>{statement}</p>' if statement else ""
    ch = ""
    if chips:
        ch = '<ul class="chips" data-r>' + "".join(
            f'<li class="{"is-on" if on else ""}">{c}</li>' for c, on in chips) + "</ul>"
    act = ""
    if acciones:
        act = '<p class="phero-act" data-r>' + "".join(
            f'<a class="{"btn btn--big" if i == 0 else "link"}" href="{h}">{l}</a>' for i, (l, h) in enumerate(acciones)) + "</p>"
    return f"""<section class="phero{' phero--short' if corto else ''}">
  {crumbs(lang, list(migas))}
  <h1 data-r>{h1}</h1>
  {st}{extra}{ch}{act}
</section>"""


def cta_band(lang, h2, texto_p=None, secundario=None, primario=None):
    """Cierre de página (mismo bloque que la portada)."""
    label, href = primario or (("Reservar 30 minutos", "/contacto") if lang == "es" else ("Book 30 minutes", "/en/contacto"))
    sec = f'<a class="link" href="{secundario[1]}">{secundario[0]}</a>' if secundario else ""
    st = f'<p class="mh-sub" data-r>{texto_p}</p>' if texto_p else ""
    return f"""<section class="me">
  <h2 data-r>{h2}</h2>
  {st}
  <p class="mh-act me-act" data-r><a class="btn btn--big" href="{href}">{label}</a>{sec}</p>
</section>"""


def _shift(seccion: str):
    cols = re.findall(r'<div class="shift-col shift-[ab]">\s*<b>(.*?)</b>\s*<ul>(.*?)</ul>', seccion, flags=re.S)
    return [(texto(lbl), [limpiar_inline(li) for li in re.findall(r"<li\b[^>]*>(.*?)</li>", ul, flags=re.S)]) for lbl, ul in cols]
