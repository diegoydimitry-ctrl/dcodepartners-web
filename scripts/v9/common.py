"""Piezas compartidas del rediseño v9 (cabecera, pie, asistente, <head>).

Las páginas de v9 se generan con `python3 scripts/v9/build.py`. El contenido
original (metadatos SEO, textos de páginas legales, blog y departamentos) se lee
del commit de producción indicado en SRC_COMMIT, para que el resultado sea
reproducible aunque los HTML del repositorio ya estén regenerados.
"""
import hashlib
import html
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC_COMMIT = "9994abe"  # main en el momento del rediseño (16/10/2026)


def src(path: str) -> str:
    """HTML original de producción (commit SRC_COMMIT)."""
    return subprocess.run(
        ["git", "show", f"{SRC_COMMIT}:{path}"], cwd=ROOT, check=True,
        capture_output=True, text=True,
    ).stdout


def ver(rel: str) -> str:
    """Hash corto del fichero para romper la caché (mismo criterio que update-asset-versions)."""
    data = (ROOT / rel).read_bytes()
    return hashlib.md5(data).hexdigest()[:10]


def e(text: str) -> str:
    return html.escape(text, quote=True)


# ---------------------------------------------------------------- marca

def mark(cls: str = "mark", label: str | None = None, anim: bool = False) -> str:
    """La marca de D-Code: piezas sueltas que encajan en una D. Una es azul.

    Geometría medida sobre assets/logo/dcode-icon-sm.png (120×101)."""
    a11y = f'role="img" aria-label="{e(label)}"' if label else 'aria-hidden="true"'
    sq = lambda x, y, s, extra="": f'<rect class="m-sq{extra}" x="{x}" y="{y}" width="{s}" height="{s}" rx="2.6"/>'
    loose = [(1, 27, "1"), (34, 27, "2"), (1, 64, "3"), (34, 64, "4")]
    loose_svg = "".join(
        f'<rect class="m-sq m-loose m-l{k}" x="{x}" y="{y}" width="13" height="13" rx="2.4"/>' for x, y, k in loose
    )
    return (
        f'<svg class="{cls}{" mark--anim" if anim else ""}" viewBox="0 0 120 101" {a11y} focusable="false">'
        + sq(26, 1, 17, " m-d m-d1")
        + '<path class="m-d m-d2" d="M48 1H84A34 34 0 0 1 118 35V38H101V35A17 17 0 0 0 84 18H48Z"/>'
        + sq(101, 43, 17, " m-d m-d3")
        + '<path class="m-d m-d4" d="M48 100H84A34 34 0 0 0 118 66V63H101V66A17 17 0 0 1 84 83H48Z"/>'
        + sq(26, 83, 17, " m-d m-d5")
        + loose_svg
        + '<rect class="m-blue" x="16" y="45" width="15" height="15" rx="2.6"/>'
        + "</svg>"
    )


# ---------------------------------------------------------------- navegación

NAV = {
    "es": [("Qué automatizamos", "/departamentos"), ("Finance", "/sistema-financiero"), ("Nosotros", "/conocenos")],
    "en": [("What we automate", "/en/departamentos"), ("Finance", "/en/sistema-financiero"), ("About", "/en/conocenos")],
}
CTA = {"es": ("Reservar una llamada", "/contacto"), "en": ("Book a call", "/en/contacto")}
UI = {
    "es": {"skip": "Saltar al contenido", "menu": "Menú", "close": "Cerrar", "home": "D-Code Partners, inicio",
           "nav": "Principal", "lang": "Idioma"},
    "en": {"skip": "Skip to content", "menu": "Menu", "close": "Close", "home": "D-Code Partners, home",
           "nav": "Main", "lang": "Language"},
}


def lang_paths(path: str) -> tuple[str, str]:
    """(ruta ES, ruta EN) de una página. path es la URL limpia ('/', '/metodo', '/en/metodo')."""
    if path == "/en" or path.startswith("/en/"):
        es = path[3:] or "/"
        return es, path if path != "/en" else "/en/"
    return path, "/en" + ("/" if path == "/" else path)


def header(lang: str, path: str) -> str:
    t = UI[lang]
    es_p, en_p = lang_paths(path)
    home = "/" if lang == "es" else "/en/"
    cur = ' aria-current="page"'
    links = "".join(
        f'<li><a href="{href}"{cur if path == href or path.startswith(href + "/") else ""}>{label}</a></li>'
        for label, href in NAV[lang]
    )
    cta_label, cta_href = CTA[lang]
    return f"""<a class="skip" href="#contenido">{t['skip']}</a>
<header class="bar" data-bar>
  <a class="bar-brand" href="{home}" aria-label="{t['home']}">{mark('bar-mark')}<span>D-Code <span class="bar-brand-2">Partners</span></span></a>
  <nav class="bar-nav" aria-label="{t['nav']}" id="menu-principal">
    <ul class="bar-links">{links}</ul>
    <div class="bar-lang lang-switch" aria-label="{t['lang']}">
      <a href="{es_p}" data-lang="es" hreflang="es"{' aria-current="true"' if lang == 'es' else ''}>ES</a>
      <a href="{en_p}" data-lang="en" hreflang="en"{' aria-current="true"' if lang == 'en' else ''}>EN</a>
    </div>
    <a class="btn bar-cta" href="{cta_href}">{cta_label}</a>
  </nav>
  <button class="bar-toggle" type="button" aria-expanded="false" aria-controls="menu-principal" data-toggle>
    <span class="bar-toggle-open">{t['menu']}</span><span class="bar-toggle-close">{t['close']}</span>
  </button>
</header>"""


FOOT = {
    "es": {
        "links": [("Qué automatizamos", "/departamentos"), ("Servicios", "/servicios"), ("D-Code Finance", "/sistema-financiero"),
                  ("Método", "/metodo"), ("Garantías", "/garantias"), ("Casos", "/casos-exito"),
                  ("Nosotros", "/conocenos"), ("En curso", "/cambios-en-proceso"), ("Blog", "/blog"),
                  ("Preguntas frecuentes", "/faq"), ("Contacto", "/contacto")],
        "legal": [("Privacidad", "/privacidad"), ("Aviso legal", "/aviso-legal"), ("Cookies", "/cookies"),
                  ("Seguridad", "/seguridad"), ("Condiciones", "/condiciones-contratacion"),
                  ("Encargado de tratamiento", "/acuerdo-encargado-tratamiento")],
        "where": "Madrid. Respondemos en menos de 24 horas.",
        "rights": "© 2026 D-Code Partners",
        "nav": "Pie de página", "legal_l": "Legal",
    },
    "en": {
        "links": [("What we automate", "/en/departamentos"), ("Services", "/en/servicios"), ("D-Code Finance", "/en/sistema-financiero"),
                  ("Method", "/en/metodo"), ("Guarantees", "/en/garantias"), ("Cases", "/en/casos-exito"),
                  ("About", "/en/conocenos"), ("In progress", "/en/cambios-en-proceso"), ("Blog", "/en/blog"),
                  ("FAQ", "/en/faq"), ("Contact", "/en/contacto")],
        "legal": [("Privacy", "/en/privacidad"), ("Legal notice", "/en/aviso-legal"), ("Cookies", "/en/cookies"),
                  ("Security", "/en/seguridad"), ("Terms", "/en/condiciones-contratacion"),
                  ("Data processing", "/en/acuerdo-encargado-tratamiento")],
        "where": "Madrid. We reply within 24 hours.",
        "rights": "© 2026 D-Code Partners",
        "nav": "Footer", "legal_l": "Legal",
    },
}


def footer(lang: str) -> str:
    f = FOOT[lang]
    links = "".join(f'<li><a href="{h}">{l}</a></li>' for l, h in f["links"])
    legal = "".join(f'<li><a href="{h}">{l}</a></li>' for l, h in f["legal"])
    return f"""<footer class="foot">
  <div class="foot-top">
    <div class="foot-contact">
      <a href="mailto:dcodedepartment@gmail.com">dcodedepartment@gmail.com</a>
      <a href="tel:+34680223439">Diego · 680 22 34 39</a>
      <a href="tel:+34614547570">Dimitry · 614 54 75 70</a>
      <span>{f['where']}</span>
    </div>
    <nav class="foot-nav" aria-label="{f['nav']}"><ul>{links}</ul></nav>
  </div>
  <div class="foot-name" aria-hidden="true">{mark('foot-mark')}<span>D-Code</span></div>
  <div class="foot-base">
    <p class="foot-rights">{f['rights']}</p>
    <ul class="foot-legal" aria-label="{f['legal_l']}">{legal}</ul>
  </div>
</footer>"""


# ---------------------------------------------------------------- asistente (chat)

_CHAT_CACHE: dict[str, str] = {}


def chat(lang: str) -> str:
    """Widget del asistente, tal cual está en producción (main.js depende de sus id)."""
    if lang not in _CHAT_CACHE:
        s = src("index.html" if lang == "es" else "en/index.html")
        i = s.find('<div class="chat-widget" id="chat-widget">')
        j = s.find("<script", i)
        block = s[i:j].strip()
        # La ventana pierde la barra de "ventana" con puntos de colores: es un adorno del diseño anterior.
        block = re.sub(r'<span class="window-dots">.*?</span>\s*</span>', "", block, flags=re.S)
        block = re.sub(r'<span class="window-title">[^<]*</span>',
                       '<span class="window-title">' + ("Asistente de D-Code" if lang == "es" else "D-Code assistant") + "</span>",
                       block)
        _CHAT_CACHE[lang] = block
    return _CHAT_CACHE[lang]


# ---------------------------------------------------------------- <head>

def head(src_path: str, extra: str = "", title: str | None = None, description: str | None = None) -> str:
    """El <head> de producción (SEO, hreflang, OG, JSON-LD, CookieYes, GA4) con la hoja y las fuentes de v9."""
    s = src(src_path)
    h = s[s.find("<head>") + 6: s.find("</head>")]
    h = re.sub(r'\s*<link rel="stylesheet"[^>]*>', "", h)
    h = re.sub(r'\s*<link rel="preload"[^>]*as="font"[^>]*>', "", h)
    h = re.sub(r'\s*<style\b.*?</style>', "", h, flags=re.S)
    h = re.sub(r'<meta name="theme-color" content="[^"]*">', '<meta name="theme-color" content="#F4F4F0">', h)
    if title:
        h = re.sub(r"<title>.*?</title>", f"<title>{e(title)}</title>", h, flags=re.S)
        h = re.sub(r'(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*', lambda m: m.group(1) + e(title), h)
    if description:
        h = re.sub(r'(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*',
                   lambda m: m.group(1) + e(description), h)
    fonts = (
        "<script>document.documentElement.classList.add('js');setTimeout(function(){if(!window.__v9)document.documentElement.classList.remove('js')},3000)</script>\n"
        '<link rel="preload" href="/assets/fonts/schibsted-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin>\n'
        '<link rel="preload" href="/assets/fonts/newsreader-latin.woff2" as="font" type="font/woff2" crossorigin>\n'
        f'<link rel="stylesheet" href="/assets/css/v9.css?v={ver("assets/css/v9.css")}">'
    )
    h = h.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">', 1)
    # Las hojas y fuentes van antes de los scripts de terceros.
    marker = "<!-- Start cookieyes banner -->"
    if marker in h:
        h = h.replace(marker, fonts + "\n" + extra + "\n" + marker, 1)
    else:
        h = h + "\n" + fonts + "\n" + extra
    h = re.sub(r"\n\s*\n+", "\n", h)
    return "<head>\n" + h.strip() + "\n</head>"


def page(src_path: str, out_path: str, lang: str, url: str, main: str, body_class: str = "",
         title: str | None = None, description: str | None = None, head_extra: str = "", scripts: str = "") -> None:
    doc = f"""<!DOCTYPE html>
<html lang="{lang}">
{head(src_path, head_extra, title, description)}
<body class="{body_class}">
{header(lang, url)}
<main id="contenido">
{main}
</main>
{footer(lang)}
{chat(lang)}
<script src="/assets/js/main.js?v={ver('assets/js/main.js')}" defer></script>
<script src="/assets/js/v9.js?v={ver('assets/js/v9.js')}" defer></script>
{scripts}
</body>
</html>
"""
    out = ROOT / out_path
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(doc, encoding="utf-8")
