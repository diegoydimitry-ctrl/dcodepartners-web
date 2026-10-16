"""Páginas interiores v9: departamentos, servicios, legales, blog, FAQ y 404."""
import re

from common import CTA, e, page
from datos import COMO, ORGANIGRAMA
from extraer import cuerpo, main_html, piezas, secciones, texto
from plantillas import LABELS, crumbs, cta_band, generico, phero

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


def _como(slug: str, lang: str):
    """Fragmento de interfaz de «Cómo funciona» para un Departamento."""
    c = COMO[lang].get(slug)
    if not c:
        return None
    aviso = COMO[lang]["aviso"]

    def render(h2, ps):
        intro = c.get("intro")
        lead = next((p[1] for p in ps if p[0] == "p" and "lead" in (p[2] if len(p) > 2 else "")
                     and "Representaci" not in p[1] and "simplified" not in p[1].lower()), None)
        texto_intro = intro or lead or ""
        t = c["tipo"]
        if t == "flujo":
            lis = "".join(f"<li data-r><h3>{a}</h3><p>{b}</p></li>" for a, b in c["pasos"])
            fig = f'<ol class="flow" style="--n:{len(c["pasos"])}">{lis}</ol>'
        elif t in ("ficha", "panel"):
            cab = f'<p class="ui-cab"><span class="ui-sq"></span>{c.get("titulo", "")}</p>' if c.get("titulo") else ""
            tiles = "".join(f'<li><h3>{a}</h3><p>{b}</p></li>' for a, b in c["pasos"])
            fig = f'<div class="ui ui--{t}" data-ui data-r>{cab}<ul class="ui-tiles">{tiles}</ul></div>'
        elif t == "tablero":
            cols = "".join(
                f'<div class="ui-col"><h3>{n}</h3><ul>' + "".join(f"<li>{x}</li>" for x in items) + "</ul></div>"
                for n, items in c["cols"])
            fig = f'<div class="ui ui--tablero" data-ui data-r>{cols}</div>'
        elif t == "ticket":
            pasos = "".join(f'<li><h3>{a}</h3><p>{b}</p></li>' for a, b in c["pasos"])
            fig = (f'<div class="ui ui--ticket" data-ui data-r><p class="ui-cab"><span class="ui-sq"></span>{c["id"]}</p>'
                   f'<p class="ui-msg">{c["msg"]}</p><ol class="ui-pasos">{pasos}</ol></div>')
        elif t == "mando":
            filas = "".join(
                f'<li class="{"ok" if ok else "alerta"}"><span class="ui-dot"></span><b>{a}</b><span>{b}</span></li>'
                for a, b, ok in c["filas"])
            fig = (f'<div class="ui ui--mando" data-ui data-r><p class="ui-cab"><span class="ui-sq"></span>{c["titulo"]}</p>'
                   f'<ul class="ui-filas">{filas}</ul><p class="ui-pie">{c["pie"]}</p></div>')
        else:
            fig = ""
        intro_html = f'<p class="lead" data-r>{texto_intro}</p>' if texto_intro else ""
        return f"""<section class="sec-como">
  <div class="sec-head"><h2 data-r>{h2}</h2>{intro_html}</div>
  {fig}
  <p class="ui-aviso" data-r>{aviso}</p>
</section>"""
    return render


def departamento(slug: str, lang: str):
    path = f"{_pre(lang)}departamentos/{slug}.html"
    t = TXT[lang]
    org = ORGANIGRAMA[lang]
    nodos = [org["top"]] + org["areas"]
    nombre = next(n[0] for n in nodos if n[1].endswith("/" + slug))
    como = _como(slug, lang)
    hero_p, cuerpo_html = generico(path, lang, reemplazar={2: como} if como else None)
    h1, ps, badges, _ = _hero_parts(hero_p)
    lead = "".join(f'<p class="lead phero-lead" data-r>{p}</p>' for p in ps)
    chips = [(b, any(k in b.lower() for k in ("disponible", "operativo", "available", "operational", "validación", "validation", "revisión", "review"))) for b in badges]
    hero = phero(lang, nombre, h1, [(t["cap"], _url(lang, "departamentos")), (nombre, None)],
                 acciones=[CTA[lang], t["todas"]], chips=chips, extra=lead)
    page(path, path, lang, _url(lang, f"departamentos/{slug}"), hero + "\n" + cuerpo_html, "p-dept")


def servicio(slug: str, lang: str):
    path = f"{_pre(lang)}servicios/{slug}.html"
    t = TXT[lang]
    hero_p, cuerpo_html = generico(path, lang)
    h1, ps, badges, eyebrow = _hero_parts(hero_p)
    nombre = eyebrow.split("·")[-1].strip() if "·" in eyebrow else eyebrow
    lead = "".join(f'<p class="lead phero-lead" data-r>{p}</p>' for p in ps)
    hero = phero(lang, nombre, h1, [(t["serv"], _url(lang, "servicios")), (nombre, None)],
                 acciones=[CTA[lang], t["serv_all"]], extra=lead)
    page(path, path, lang, _url(lang, f"servicios/{slug}"), hero + "\n" + cuerpo_html, "p-serv")


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
