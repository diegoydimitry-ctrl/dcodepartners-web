"""Bloques reutilizables de las páginas interiores v9."""
import re

from common import CTA, e
from extraer import clases, limpiar_inline, piezas, secciones, texto

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


def lista(items, cls="ticks"):
    return f'<ul class="{cls}">' + "".join(f"<li>{x}</li>" for x in items) + "</ul>"


def bloque(h2, cuerpo, wide=False, cls="", ident=None):
    i = f' id="{ident}"' if ident else ""
    return f"""<section class="block{' block--wide' if wide else ''} {cls}"{i}>
  <h2 data-r>{h2}</h2>
  <div class="block-body" data-r>{cuerpo}</div>
</section>"""


def cta_band(lang, h2, texto_p=None, secundario=None, primario=None):
    label, href = primario or CTA[lang]
    sec = f'<a class="link" href="{secundario[1]}">{secundario[0]}</a>' if secundario else ""
    st = f'<p class="statement" data-r>{texto_p}</p>' if texto_p else ""
    return f"""<section class="cta-band">
  <h2 data-r>{h2}</h2>
  {st}
  <p class="cta-band-act" data-r><a class="btn btn--ink btn--big" href="{href}">{label}</a>{sec}</p>
</section>"""


def _shift(seccion: str):
    cols = re.findall(r'<div class="shift-col shift-[ab]">\s*<b>(.*?)</b>\s*<ul>(.*?)</ul>', seccion, flags=re.S)
    return [(texto(lbl), [limpiar_inline(li) for li in re.findall(r"<li\b[^>]*>(.*?)</li>", ul, flags=re.S)]) for lbl, ul in cols]


def _botones(seccion: str):
    out = []
    for m in re.finditer(r'<a\b([^>]*)class="[^"]*\bbtn\b[^"]*"([^>]*)>(.*?)</a>', seccion, flags=re.S):
        attrs = m.group(1) + m.group(2)
        h = re.search(r'href="([^"]*)"', attrs)
        if h:
            out.append((texto(m.group(3)), h.group(1)))
    return out


def generico(path: str, lang: str, saltar_hero=True, reemplazar=None):
    """Recompone las secciones de una página de producción con bloques v9.
    Devuelve (hero_piezas, html_de_secciones)."""
    secs = secciones(path)
    hero_p = []
    html = []
    for idx, sec in enumerate(secs):
        cl = clases(sec)
        ps = piezas(sec)
        if idx == 0 and ("page-hero" in cl or any(p[0] == "h1" for p in ps)):
            hero_p = ps
            continue
        if reemplazar and idx in reemplazar:
            h2r = next((p[1] for p in ps if p[0] == "h2"), "")
            html.append(reemplazar[idx](h2r, ps))
            continue
        if "cta-band" in cl:
            pre = [p for p in ps if p[0] == "p" and "pre-cta" in (p[2] if len(p) > 2 else "")]
            h2 = next((p[1] for p in ps if p[0] == "h2"), "")
            txt = next((p[1] for p in ps if p[0] == "p" and "pre-cta" not in (p[2] if len(p) > 2 else "")), None)
            bots = _botones(sec)
            if pre:
                html.append(f'<section class="pre-cta"><p class="note" data-r>{pre[0][1]}</p></section>')
            sec_btn = next(((l, h) for l, h in bots[1:]), None) if len(bots) > 1 else None
            html.append(cta_band(lang, h2, txt, sec_btn))
            continue
        h2 = next((p[1] for p in ps if p[0] == "h2"), None)
        cuerpo_ps = [p for p in ps if p[0] not in ("eyebrow", "trust-badge", "h2")]
        cuerpo_ps = [p for p in cuerpo_ps if not (p[0] == "p" and es_ruido(texto(p[1])))]
        outs = [p for p in cuerpo_ps if p[0] == "out"]
        shift = _shift(sec)
        h3s = [i for i, p in enumerate(cuerpo_ps) if p[0] == "h3"]
        if outs:
            items = "".join(f'<li data-r><h3>{a}</h3><p>{b}</p></li>' for _, a, b in outs)
            extra = "".join(f"<p>{p[1]}</p>" for p in cuerpo_ps if p[0] == "p")
            html.append(f"""<section class="sec-results">
  <div class="sec-head"><h2 data-r>{h2}</h2></div>
  <ul class="results">{items}</ul>{f'<div class="block-after" data-r>{extra}</div>' if extra else ''}
</section>""")
        elif len(shift) >= 2:
            cols = "".join(f'<div data-r><h3>{lbl}</h3>{lista(lis)}</div>' for lbl, lis in shift[:2])
            html.append(f"""<section class="sec-pair">
  <div class="sec-head"><h2 data-r>{h2}</h2></div>
  <div class="pair">{cols}</div>
</section>""")
        elif len(h3s) >= 2:
            intro = "".join(f'<p class="lead" data-r>{p[1]}</p>' for p in cuerpo_ps[: h3s[0]] if p[0] == "p")
            pares = []
            for n, i in enumerate(h3s):
                fin = h3s[n + 1] if n + 1 < len(h3s) else len(cuerpo_ps)
                cuerpo = "".join(
                    f"<p>{p[1]}</p>" if p[0] == "p" else lista(p[1]) if p[0] in ("ul", "ol") else "" for p in cuerpo_ps[i + 1: fin]
                )
                pares.append((cuerpo_ps[i][1], cuerpo))
            if len(pares) in (3, 4) and all(len(texto(c)) < 260 for _, c in pares) and ("chain" in sec or "cadena" in texto(sec).lower()[:200] or "steps" in sec):
                lis = "".join(f'<li data-r><h3>{a}</h3>{b}</li>' for a, b in pares)
                html.append(f"""<section class="sec-flow">
  <div class="sec-head"><h2 data-r>{h2}</h2>{intro}</div>
  <ol class="flow" style="--n:{len(pares)}">{lis}</ol>
</section>""")
            else:
                lis = "".join(f'<li data-r><h3>{a}</h3>{b}</li>' for a, b in pares)
                html.append(f"""<section class="sec-cards">
  <div class="sec-head"><h2 data-r>{h2}</h2>{intro}</div>
  <ul class="cards-list">{lis}</ul>
</section>""")
        else:
            cuerpo = ""
            for p in cuerpo_ps:
                if p[0] == "p":
                    cuerpo += f"<p>{p[1]}</p>"
                elif p[0] in ("ul", "ol"):
                    cuerpo += lista(p[1])
                elif p[0] == "h3":
                    cuerpo += f"<h3>{p[1]}</h3>"
                elif p[0] == "table":
                    cuerpo += p[1]
                elif p[0] == "quote":
                    cuerpo += f"<blockquote>{p[1]}</blockquote>"
            if h2 and cuerpo:
                html.append(bloque(h2, cuerpo))
            elif h2:
                html.append(f'<section class="sec-solo"><h2 data-r>{h2}</h2></section>')
            elif cuerpo:
                html.append(f'<section class="block block--wide"><div class="block-body" data-r>{cuerpo}</div></section>')
    return hero_p, "\n".join(html)
