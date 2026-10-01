# Genera textos.html (22 páginas 1080×1920, solo texto, fondo negro) para importarlo en Canva como base del Reel.
import re, html
from plan import P
F = "../../anuncios-v3/comun/fuentes/"
GRANDES = {1, 2, 14, 18, 19, 22}
def marca(t):
    t = html.escape(t)
    return re.sub(r"\*(.+?)\*", r'<span class="d">\1</span>', t)
pags = []
for i, (a, b, planos, g, p) in enumerate(P, 1):
    if i == 14:
        cuerpo = ('<div class="grande" style="top:560px">CUANDO <span class="d">X</span></div>'
                  '<div class="flecha">→</div>'
                  '<div class="grande" style="top:1000px">HAGO <span class="d">Y</span></div>'
                  f'<div class="peq" style="top:1400px">{html.escape(p)}</div>')
    elif i in GRANDES:
        cuerpo = f'<div class="grande">{marca(g)}</div>'
        if p: cuerpo += f'<div class="peq">{html.escape(p)}</div>'
    else:
        cuerpo = f'<div class="sub">{marca(g)}</div>'
        if p: cuerpo += f'<div class="tag">{html.escape(p)}</div>'
    pags.append(f'<section class="pg" data-document-role="page" data-label="{i:02d} · {a:.2f}–{b:.2f}s">{cuerpo}</section>')
doc = f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Reel · Deja de negociar contigo · textos</title>
<style>
@font-face{{font-family:"Anton";src:url({F}anton.woff2)}}
@font-face{{font-family:"Inter Tight";src:url({F}inter-tight.woff2);font-weight:100 900}}
@page{{size:1080px 1920px;margin:0}}
html,body{{margin:0;background:#0b0b0c}}
.pg{{position:relative;width:1080px;height:1920px;overflow:hidden;background:#0b0b0c;page-break-after:always}}
.grande{{position:absolute;left:90px;right:90px;top:700px;font-family:"Anton";font-size:132px;line-height:1.02;color:#fff;text-align:center;text-transform:uppercase;letter-spacing:.5px}}
.sub{{position:absolute;left:100px;right:100px;top:1170px;font-family:"Inter Tight";font-weight:800;font-size:66px;line-height:1.12;color:#fff;text-align:center;letter-spacing:-1px}}
.d{{color:#F5B841}}
.flecha{{position:absolute;left:0;right:0;top:770px;font-family:"Inter Tight";font-weight:300;font-size:150px;line-height:1;color:#F5B841;text-align:center}}
.peq{{position:absolute;left:120px;right:120px;top:1330px;font-family:"Inter Tight";font-weight:500;font-size:46px;line-height:1.25;color:#e9e9e9;text-align:center}}
.tag{{position:absolute;left:0;right:0;top:1560px;font-family:"Inter Tight";font-weight:600;font-size:26px;letter-spacing:6px;color:#bdbdbd;text-align:center;text-transform:uppercase}}
</style></head><body>
{''.join(pags)}
</body></html>"""
open("textos.html", "w").write(doc)
sup = doc.replace("background:#0b0b0c", "background:transparent").replace(
  "</style>", ".grande,.sub,.peq,.tag,.flecha{text-shadow:0 2px 18px rgba(0,0,0,.55),0 0 2px rgba(0,0,0,.35)}</style>")
open("textos-superponer.html", "w").write(sup); print(len(pags), "páginas")
