"""Páginas interiores v9 (versión mínima): áreas, servicios, legales, blog, FAQ y 404."""
import re

from common import CTA, e, page
from extraer import cuerpo, main_html, piezas, secciones, texto
from plantillas import cta_band, phero

DEPTS = ["comercial", "marketing", "clientes", "produccion", "finanzas", "soporte", "administracion", "direccion"]
SERVICIOS = ["automatizacion-ia", "agentes-ia", "integraciones"]
LEGALES = ["privacidad", "aviso-legal", "cookies", "seguridad", "condiciones-contratacion", "acuerdo-encargado-tratamiento"]
BLOG = ["que-es-la-automatizacion-con-ia", "automatizacion-vs-agentes-ia", "procesos-que-puedes-automatizar-ya"]

TXT = {
    "es": {"cap": "Capacidades", "serv": "Servicios", "blog": "Blog", "legal": "Legal",
           "todas": ("Todas las capacidades", "/departamentos"), "serv_all": ("Qué hacemos", "/servicios")},
    "en": {"cap": "Capabilities", "serv": "Services", "blog": "Blog", "legal": "Legal",
           "todas": ("All capabilities", "/en/departamentos"), "serv_all": ("What we do", "/en/servicios")},
}


def _pre(lang):
    return "" if lang == "es" else "en/"


def _url(lang, slug):
    return ("/" if lang == "es" else "/en/") + slug


def _sentence(t: str) -> str:
    """Las antiguas etiquetas en mayúsculas pasan a frase normal."""
    if t.upper() == t and any(c.isalpha() for c in t):
        t = t.lower()
        t = t[0].upper() + t[1:]
        for w in ("D-code", "Ia ", "ia ", " ia"):
            pass
        t = t.replace("d-code", "D-Code").replace(" ia", " IA").replace("Ia ", "IA ").replace("chat ia", "chat IA")
    return t


def _hero_parts(hero_p):
    h1 = next((p[1] for p in hero_p if p[0] == "h1"), "")
    ps = [p[1] for p in hero_p if p[0] == "p"]
    badges = [_sentence(p[1]) for p in hero_p if p[0] == "trust-badge"]
    eyebrow = next((p[1] for p in hero_p if p[0] == "eyebrow"), "")
    return h1, ps, badges, eyebrow


def departamento(slug: str, lang: str):
    """Área en versión mínima: nombre, la frase del menú y qué cambia, fila a fila."""
    from clave import areas
    from minima import cabecera, cambio, cierre
    from plantillas import _shift
    es = lang == "es"
    path = f"{_pre(lang)}departamentos/{slug}.html"
    nombre, _, linea, estado = next(a for a in areas(lang) if a[1].endswith("/" + slug))
    hub = ("Qué automatizamos" if es else "What we automate", _url(lang, "departamentos"))
    shift = next((sh for sh in (_shift(x) for x in secciones(path)) if len(sh) >= 2), None)
    cuerpo_html = cambio(lang, "Qué cambia" if es else "What changes", shift[0][1], shift[1][1]) if shift else ""
    acciones = [CTA[lang]]
    if slug == "finanzas":
        acciones.append(("Ver la demo de D-Code Finance" if es else "See the D-Code Finance demo",
                         _url(lang, "sistema-financiero/demo")))
    main = (cabecera(lang, nombre, linea, migas=[hub, (nombre, None)], acciones=acciones, chip=estado)
            + cuerpo_html + cierre(lang, secundario=("Ver las 8 áreas" if es else "See all 8 areas", hub[1])))
    page(path, path, lang, _url(lang, f"departamentos/{slug}"), main, "p-min")


def servicio(slug: str, lang: str):
    """Servicio en versión mínima: nombre, su frase y la lista de lo que cubre."""
    from clave import servicio_nombre
    from minima import cabecera, cierre, filas
    from plantillas import es_ruido
    es = lang == "es"
    path = f"{_pre(lang)}servicios/{slug}.html"
    secs = secciones(path)
    h1 = next(p[1] for p in piezas(secs[0]) if p[0] == "h1")
    nombre = servicio_nombre(path)
    lit = next(x for x in secs[1:] if sum(1 for p in piezas(x) if p[0] == "h3") >= 3)
    ps = [p for p in piezas(lit) if not (p[0] == "p" and es_ruido(texto(p[1])))]
    label = next((p[1] for p in ps if p[0] == "eyebrow"), "")
    rows = []
    for i, p in enumerate(ps):
        if p[0] == "h3":
            d = next((q[1] for q in ps[i + 1:] if q[0] == "p"), "")
            rows.append((p[1], d))
    hub = ("Servicios" if es else "Services", _url(lang, "servicios"))
    main = (cabecera(lang, nombre, h1, migas=[hub, (nombre, None)], acciones=[CTA[lang]])
            + filas(label, rows, ident="serv", grande=False) + cierre(lang))
    page(path, path, lang, _url(lang, f"servicios/{slug}"), main, "p-min")


def _prosa_de(path):
    """Todo el texto largo de una página (legales, artículos) como prosa."""
    secs = secciones(path)
    hero = piezas(secs[0]) if secs else []
    cuerpo_secs = [s for s in secs[1:] if "cta-band" not in s[:200] and "metodo lit" not in s[:200]]
    html = "\n".join(cuerpo(s) for s in cuerpo_secs)
    return hero, html


def legal(slug: str, lang: str):
    path = f"{_pre(lang)}{slug}.html"
    hero_p, prosa = _prosa_de(path)
    h1, ps, _, _ = _hero_parts(hero_p)
    t = TXT[lang]
    hero = phero(lang, h1, None, [(t["legal"], None)], corto=True)
    hero = hero.replace(f'<span aria-current="page">{t["legal"]}</span>', f'<span>{t["legal"]}</span><span aria-hidden="true">/</span><span aria-current="page">{h1}</span>')
    lead = "".join(f"<p>{p}</p>" for p in ps)
    main = hero + f'\n<section class="prose-wrap"><div class="prose" data-r>{lead}{prosa}</div></section>'
    page(path, path, lang, _url(lang, slug), main, "p-legal")


def blog_post(slug: str, lang: str):
    path = f"{_pre(lang)}blog/{slug}.html"
    secs = secciones(path)
    hero_p = piezas(secs[0])
    h1, ps, _, eyebrow = _hero_parts(hero_p)
    meta = re.search(r'class="[^"]*(?:post-meta|article-meta|meta)[^"]*"[^>]*>(.*?)</', secs[0], flags=re.S)
    t = TXT[lang]
    articulo = [s for s in secs[1:] if "cta-band" not in s[:200] and "metodo lit" not in s[:200]]
    prosa = "\n".join(cuerpo(s) for s in articulo)
    otros = [s for s in secs[1:] if "metodo lit" in s[:200]]
    hero = phero(lang, h1, None, [(t["blog"], _url(lang, "blog")), (eyebrow or h1, None)], corto=True,
                 extra=(f'<p class="meta-line" data-r>{e(texto(meta.group(1)))}</p>' if meta else "")
                 + "".join(f'<p class="lead phero-lead" data-r>{p}</p>' for p in ps))
    mas = ""
    if otros:
        ps2 = piezas(otros[0])
        h2 = next((p[1] for p in ps2 if p[0] == "h2"), "")
        links = re.findall(r'<a\b[^>]*href="([^"]*blog/[^"]*)"[^>]*>(.*?)</a>', otros[0], flags=re.S)
        h3s = [p[1] for p in ps2 if p[0] == "h3"]
        descs = [p[1] for p in ps2 if p[0] == "p"]
        hrefs = []
        for href, inner in links:
            if href not in hrefs:
                hrefs.append(href)
        items = "".join(
            f'<li data-r><h3><a href="{hrefs[i] if i < len(hrefs) else "#"}">{h}</a></h3><p>{descs[i] if i < len(descs) else ""}</p></li>'
            for i, h in enumerate(h3s))
        mas = f'<section class="sec-cards"><div class="sec-head"><h2 data-r>{h2}</h2></div><ul class="cards-list cards-list--links">{items}</ul></section>'
    cta = cta_band(lang, "¿Qué de todo esto aplica a tu empresa?" if lang == "es" else "What applies to your company?",
                   "En una llamada de 30 minutos te lo decimos." if lang == "es" else "In a 30-minute call we will tell you.")
    main = hero + f'\n<section class="prose-wrap"><article class="prose" data-r>{prosa}</article></section>\n' + mas + "\n" + cta
    page(path, path, lang, _url(lang, f"blog/{slug}"), main, "p-post")


def blog_index(lang: str):
    path = f"{_pre(lang)}blog/index.html"
    secs = secciones(path)
    hero_p = piezas(secs[0])
    h1, ps, _, _ = _hero_parts(hero_p)
    t = TXT[lang]
    lista_sec = secs[1]
    arts = re.findall(r'<a\b[^>]*href="([^"]*blog/[^"#]+)"[^>]*>(.*?)</a>', lista_sec, flags=re.S)
    ps2 = piezas(lista_sec)
    h3s = [p[1] for p in ps2 if p[0] == "h3"]
    descs = [p[1] for p in ps2 if p[0] == "p"]
    hrefs = []
    for h, _ in arts:
        if h not in hrefs:
            hrefs.append(h)
    items = "".join(
        f'<li class="post-i" data-r><a href="{hrefs[i]}"><h2>{h}</h2><p>{descs[i] if i < len(descs) else ""}</p></a></li>'
        for i, h in enumerate(h3s) if i < len(hrefs))
    hero = phero(lang, h1, ps[0] if ps else None, [(t["blog"], None)])
    cta = cta_band(lang, "Cuéntanos tu caso." if lang == "es" else "Tell us about your case.",
                   "En una llamada de 30 minutos." if lang == "es" else "In a 30-minute call.")
    main = hero + f'\n<section class="posts"><ul class="post-l">{items}</ul></section>\n' + cta
    page(path, path, lang, _url(lang, "blog"), main, "p-blog")


def faq(lang: str):
    path = f"{_pre(lang)}faq.html"
    m = main_html(path)
    secs = secciones(path)
    hero_p = piezas(secs[0])
    h1, ps, _, _ = _hero_parts(hero_p)
    grupos = []
    for cat in re.split(r'<div class="faq-category"', m)[1:]:
        h2 = re.search(r"<h2[^>]*>(.*?)</h2>", cat, flags=re.S)
        items = re.findall(
            r'<div class="accordion-item" id="([^"]*)">.*?<span class="accordion-title">(.*?)</span>\s*<span class="accordion-panel">(.*?)</span>\s*</span>\s*</button>',
            cat, flags=re.S)
        grupos.append((texto(h2.group(1)) if h2 else "", items))
    html = ""
    for titulo, items in grupos:
        # La respuesta original es HTML en línea dentro de un <span>: se limpia y se mete en un párrafo.
        dets = "".join(
            f'<details id="{i}" data-r><summary>{texto(q)}</summary><div class="faq-a">{_respuesta(a)}</div></details>'
            for i, q, a in items
        )
        html += f'<section class="faq-group"><h2 data-r>{titulo}</h2><div class="faq-list">{dets}</div></section>\n'
    cta_p = piezas(secs[-1])
    cta = cta_band(lang, next((p[1] for p in cta_p if p[0] == "h2"), ""), next((p[1] for p in cta_p if p[0] == "p"), None))
    hero = phero(lang, h1, ps[0] if ps else None, [("FAQ" if lang == "en" else "Preguntas frecuentes", None)])
    page(path, path, lang, _url(lang, "faq"), hero + "\n" + html + cta, "p-faq")


def _respuesta(a: str) -> str:
    from extraer import limpiar_inline
    partes = [x for x in re.split(r"<br\s*/?>\s*<br\s*/?>", a) if x.strip()]
    return "".join(f"<p>{limpiar_inline(x)}</p>" for x in partes)


def no_encontrada(lang: str):
    path = f"{_pre(lang)}404.html"
    es = lang == "es"
    from common import mark
    main = f"""<section class="p404">
  <div class="p404-mark">{mark('mark-xl', anim=True)}</div>
  <h1 data-r>{'Esta pieza no encaja.' if es else 'This piece does not fit.'}</h1>
  <p class="statement" data-r>{'La página que buscas no existe o ha cambiado de sitio. Vuelve a la portada o cuéntanos qué buscabas.' if es else 'The page you are looking for does not exist or has moved. Go back home or tell us what you were looking for.'}</p>
  <p class="phero-act" data-r><a class="btn btn--big" href="{'/' if es else '/en/'}">{'Ir a la portada' if es else 'Go home'}</a>
    <a class="link" href="{CTA[lang][1]}">{'Escribirnos' if es else 'Write to us'}</a></p>
</section>"""
    page(path, path, lang, "/404" if es else "/en/404", main, "p-404")


def build(lang: str, que: list[str]):
    if "departamentos" in que:
        for d in DEPTS:
            departamento(d, lang)
    if "servicios" in que:
        for s in SERVICIOS:
            servicio(s, lang)
    if "legales" in que:
        for l in LEGALES:
            legal(l, lang)
    if "blog" in que:
        blog_index(lang)
        for b in BLOG:
            blog_post(b, lang)
    if "faq" in que:
        faq(lang)
    if "404" in que:
        no_encontrada(lang)
