"""Lectura del contenido de las páginas de producción (commit SRC_COMMIT).

Convierte cada <section> del <main> original en una lista de piezas sencillas
(títulos, párrafos, listas…) para volver a componerlas con las plantillas v9 sin
perder texto. Solo se conserva HTML en línea seguro (enlaces, negritas, cursivas).
"""
import html
import re

from common import src

INLINE_OK = {"a", "strong", "b", "em", "i", "br", "abbr", "code", "sup", "sub"}


def limpiar_inline(fragmento: str) -> str:
    """Deja solo etiquetas en línea permitidas; de los enlaces conserva href."""
    s = re.sub(r"<(script|style|svg|noscript)\b.*?</\1>", "", fragmento, flags=re.S)

    def tag(m):
        cierre, nombre, attrs = m.group(1), m.group(2).lower(), m.group(3) or ""
        if nombre not in INLINE_OK:
            return ""
        if nombre == "b":
            nombre = "strong"
        if nombre == "i":
            nombre = "em"
        if cierre:
            return f"</{nombre}>"
        if nombre == "a":
            href = re.search(r'href="([^"]*)"', attrs)
            extra = ""
            if href and href.group(1).startswith("http"):
                extra = ' rel="noopener"'
                if 'target="_blank"' in attrs:
                    extra = ' target="_blank" rel="noopener"'
            return f'<a href="{href.group(1)}"{extra}>' if href else "<a>"
        if nombre == "abbr":
            t = re.search(r'title="([^"]*)"', attrs)
            return f'<abbr title="{t.group(1)}">' if t else "<abbr>"
        return f"<{nombre}>"

    s = re.sub(r"<(/?)([a-zA-Z0-9]+)\b([^>]*)>", tag, s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def texto(fragmento: str) -> str:
    s = re.sub(r"<(script|style|svg)\b.*?</\1>", "", fragmento, flags=re.S)
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", html.unescape(s)).strip()


def main_html(path: str) -> str:
    s = src(path)
    i = s.find("<main")
    j = s.find("</main>")
    return s[s.find(">", i) + 1: j]


def secciones(path: str) -> list[str]:
    return re.findall(r"<section\b.*?</section>", main_html(path), flags=re.S)


def clases(fragmento: str) -> str:
    m = re.match(r"<[a-z0-9]+\b[^>]*class=\"([^\"]*)\"", fragmento.strip())
    return m.group(1) if m else ""


def piezas(seccion: str) -> list[tuple]:
    """Recorre la sección en orden y devuelve piezas: (tipo, contenido)."""
    s = re.sub(r"<(svg|script|style)\b.*?</\1>", "", seccion, flags=re.S)
    out = []
    pat = re.compile(
        r"<(h1|h2|h3|h4)\b[^>]*>(.*?)</\1>"
        r"|<(ul|ol)\b([^>]*)>(.*?)</\3>"
        r"|<p\b([^>]*)>(.*?)</p>"
        r"|<span\b[^>]*class=\"[^\"]*(eyebrow|trust-badge|badge)[^\"]*\"[^>]*>(.*?)</span>"
        r"|<div\b[^>]*class=\"[^\"]*\bout\b[^\"]*\"[^>]*>\s*<b>(.*?)</b>\s*<span>(.*?)</span>\s*</div>"
        r"|<details\b[^>]*>(.*?)</details>"
        r"|<table\b[^>]*>(.*?)</table>"
        r"|<blockquote\b[^>]*>(.*?)</blockquote>",
        flags=re.S,
    )
    for m in pat.finditer(s):
        if m.group(1):
            out.append((m.group(1), limpiar_inline(m.group(2))))
        elif m.group(3):
            items = [limpiar_inline(li) for li in re.findall(r"<li\b[^>]*>(.*?)</li>", m.group(5), flags=re.S)]
            items = [x for x in items if x]
            if items:
                out.append((m.group(3), items, m.group(4)))
        elif m.group(7) is not None:
            attrs = m.group(6) or ""
            cl = re.search(r'class="([^"]*)"', attrs)
            t = limpiar_inline(m.group(7))
            if t:
                out.append(("p", t, cl.group(1) if cl else ""))
        elif m.group(8):
            out.append(("trust-badge" if m.group(8) == "badge" else m.group(8), texto(m.group(9))))
        elif m.group(10):
            out.append(("out", limpiar_inline(m.group(10)), limpiar_inline(m.group(11))))
        elif m.group(12):
            d = m.group(12)
            q = re.search(r"<summary\b[^>]*>(.*?)</summary>", d, flags=re.S)
            a = d[q.end():] if q else d
            out.append(("faq", texto(q.group(1)) if q else "", cuerpo(a)))
        elif m.group(13):
            out.append(("table", tabla(m.group(13))))
        elif m.group(14):
            out.append(("quote", limpiar_inline(m.group(14))))
    return out


def tabla(t: str) -> str:
    filas = []
    for tr in re.findall(r"<tr\b[^>]*>(.*?)</tr>", t, flags=re.S):
        celdas = re.findall(r"<(th|td)\b[^>]*>(.*?)</\1>", tr, flags=re.S)
        filas.append("<tr>" + "".join(f"<{k}>{limpiar_inline(v)}</{k}>" for k, v in celdas) + "</tr>")
    return "<table><tbody>" + "".join(filas) + "</tbody></table>"


def cuerpo(fragmento: str) -> str:
    """Texto largo (respuestas, legales, blog) como HTML de prosa limpio."""
    s = re.sub(r"<(svg|script|style|button|nav|form)\b.*?</\1>", "", fragmento, flags=re.S)
    partes = []
    pat = re.compile(
        r"<(h2|h3|h4)\b[^>]*>(.*?)</\1>|<p\b[^>]*>(.*?)</p>|<(ul|ol)\b[^>]*>(.*?)</\4>"
        r"|<table\b[^>]*>(.*?)</table>|<blockquote\b[^>]*>(.*?)</blockquote>",
        flags=re.S,
    )
    for m in pat.finditer(s):
        if m.group(1):
            partes.append(f"<{m.group(1)}>{limpiar_inline(m.group(2))}</{m.group(1)}>")
        elif m.group(3) is not None:
            t = limpiar_inline(m.group(3))
            if t:
                partes.append(f"<p>{t}</p>")
        elif m.group(4):
            lis = "".join(f"<li>{limpiar_inline(x)}</li>" for x in re.findall(r"<li\b[^>]*>(.*?)</li>", m.group(5), flags=re.S))
            partes.append(f"<{m.group(4)}>{lis}</{m.group(4)}>")
        elif m.group(6):
            partes.append(tabla(m.group(6)))
        elif m.group(7):
            partes.append(f"<blockquote>{limpiar_inline(m.group(7))}</blockquote>")
    if not partes:
        t = limpiar_inline(s)
        if t:
            partes.append(f"<p>{t}</p>")
    return "\n".join(partes)


def resumen(path: str) -> None:
    for i, sec in enumerate(secciones(path)):
        print(f"--- sección {i} [{clases(sec)}]")
        for p in piezas(sec):
            print("   ", p[0], "|", (str(p[1])[:110] if not isinstance(p[1], list) else p[1][:3]))
