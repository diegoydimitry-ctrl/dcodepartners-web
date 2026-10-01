# Carrusel 3 «Mensajes de tu yo de 2036» — móviles de los 90 (busca, Nokia, ladrillo, tapa, Siemens).
# Las pantallas se dibujan a su resolución real (p. ej. 96×64 px) con fuente bitmap y se amplían píxel a píxel.
#   python3 genera.py && node ../render.cjs v3/carrusel.html v3/salida   (desde la carpeta padre)
import os, numpy as np
from PIL import Image, ImageDraw, ImageFont
AQUI = os.path.dirname(os.path.abspath(__file__)); os.chdir(AQUI)
os.makedirs("lcd", exist_ok=True)
F8 = ImageFont.truetype("silkscreen-latin-400-normal.ttf", 8)
F8B = ImageFont.truetype("silkscreen-latin-700-normal.ttf", 8)
F16 = ImageFont.truetype("silkscreen-latin-700-normal.ttf", 16)
LOGO = open("../fuentes/logo.txt").read().split("\n")

def logo_bits(w=24):
    """Logo D-Code a 1 bit, del tamaño de un «logo de operadora» de Nokia."""
    src = Image.open("../fuentes/logo.png").convert("RGBA")
    h = round(w * src.height / src.width)
    a = np.array(src.resize((w, h), Image.LANCZOS))
    return (a[..., 3] > 110) & (a[..., :3].mean(-1) > 60)

def pantalla(nombre, W, H, items, escala, fondo, tinta, apagado=0.07):
    """items: (tipo, y, contenido, opciones). Devuelve ruta del PNG ampliado con rejilla de LCD."""
    im = Image.new("1", (W, H), 0); d = ImageDraw.Draw(im)
    for tipo, y, c, o in items:
        o = o or {}
        if tipo in ("t", "tb", "T"):
            f = {"t": F8, "tb": F8B, "T": F16}[tipo]
            bb = d.textbbox((0, 0), c, font=f); w = bb[2] - bb[0]
            x = o.get("x", (W - w) // 2 if o.get("c", True) else 2)
            if o.get("inv"):
                d.rectangle((x - 3, y - 1, x + w + 2, y + (bb[3] - bb[1]) + 2), fill=1)
                d.text((x - bb[0], y - bb[1] + 1), c, font=f, fill=0)
            else:
                d.text((x - bb[0], y - bb[1]), c, font=f, fill=1)
        elif tipo == "bar":      # barra invertida de lado a lado (cabecera)
            d.rectangle((0, y, W - 1, y + 9), fill=1)
            bb = d.textbbox((0, 0), c, font=F8B); w = bb[2] - bb[0]
            d.text(((W - w) // 2 - bb[0], y + 1 - bb[1]), c, font=F8B, fill=0)
        elif tipo == "linea":
            d.line((o.get("x0", 4), y, o.get("x1", W - 5), y), fill=1)
        elif tipo == "bits":
            m = c; x0 = o.get("x", (W - m.shape[1]) // 2)
            for yy, xx in zip(*np.nonzero(m)): im.putpixel((x0 + xx, y + yy), 1)
        elif tipo == "senal":    # barras de cobertura / batería a los lados (Nokia)
            for k in range(4):
                ww = 2 + k; yy = y + k * 4
                x = 0 if o.get("lado") == "i" else W - ww
                d.rectangle((x, yy, x + ww - 1, yy + 2), fill=1)
    b = np.array(im, dtype=float)
    s = escala; Hs, Ws = H * s, W * s
    yy, xx = np.mgrid[0:Hs, 0:Ws]
    luz = 1 - 0.18 * (((xx / Ws - 0.45) ** 2 + (yy / Hs - 0.4) ** 2) ** 0.5) * 1.6       # retroiluminación irregular
    base = np.array(fondo, float)[None, None] * luz[..., None]
    on = np.kron(b, np.ones((s, s)))
    gap = ((xx % s) == s - 1) | ((yy % s) == s - 1)                                    # rejilla entre píxeles
    sombra = np.roll(np.roll(on, max(1, s // 3), 0), max(1, s // 3), 1)               # sombra del cristal
    ink = np.array(tinta, float)[None, None]
    a = np.clip(apagado + on * 0.86 - gap * 0.5 * on, 0, 1)
    out = base * (1 - sombra[..., None] * 0.13)
    out = out * (1 - a[..., None]) + ink * a[..., None]
    out = out * (1 - gap[..., None] * 0.035)
    ruta = f"lcd/{nombre}.png"; Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(ruta); return ruta

VERDE, NEGRO_LCD = (178, 199, 128), (24, 33, 16)
AZULADO = (150, 178, 160)
NARANJA, NEGRO_N = (255, 156, 52), (40, 18, 4)
SOBRE = np.array([[c == "x" for c in r] for r in [
    "xxxxxxxxxxx", "xx.......xx", "x.x.....x.x", "x..x...x..x", "x...x.x...x", "x....x....x", "x.........x", "xxxxxxxxxxx"]])

# 1 · GANCHO — busca
p1 = pantalla("p1", 132, 44, [
    ("bits", 2, SOBRE, {"x": 4}), ("t", 3, "1 MENSAJE NUEVO", {"x": 20}),
    ("T", 15, "DE: TÚ.", {}),
    ("t", 34, "(DENTRO DE 10 AÑOS)", {}),
], 6, VERDE, NEGRO_LCD)
# 2 · Nokia
p2 = pantalla("p2", 96, 64, [
    ("bar", 0, "TÚ · 2036", None), ("senal", 14, None, {"lado": "i"}), ("senal", 14, None, {"lado": "d"}),
    ("t", 14, "SOY TÚ.", {}), ("t", 24, "EL DE 2036.", {}), ("t", 36, "NO VENGO A", {}), ("tb", 45, "ANIMARTE.", {"inv": True}),
    ("t", 57, "SIGUE", {}),
], 7, VERDE, NEGRO_LCD)
# 3 · ladrillo
p3 = pantalla("p3", 96, 34, [
    ("t", 1, "CADA «MAÑANA", {}), ("t", 12, "EMPIEZO» ME", {}), ("tb", 23, "COSTÓ UN AÑO.", {}),
], 6, AZULADO, (18, 30, 26), apagado=0.05)
# 4 · tapa
p4 = pantalla("p4", 96, 76, [
    ("t", 2, "1 HORA DE MÓVIL", {}), ("t", 11, "AL DÍA.", {}), ("linea", 20, None, {"x0": 20, "x1": 75}),
    ("t", 24, "EN 10 AÑOS SON", {}), ("T", 34, "152", {}), ("t", 53, "DÍAS ENTEROS.", {}), ("tb", 64, "TÚ VERÁS.", {"inv": True}),
], 7, VERDE, NEGRO_LCD)
# 5 · Siemens naranja
p5 = pantalla("p5", 96, 64, [
    ("t", 2, "DUELE. LO SÉ.", {}), ("t", 12, "PERO DUELE MÁS", {}), ("t", 21, "MIRAR ATRÁS", {}),
    ("t", 30, "Y SABER QUE", {}), ("t", 39, "PUDISTE.", {}), ("tb", 52, "MUÉVETE.", {"inv": True}),
], 7, NARANJA, NEGRO_N, apagado=0.06)
# 6 · cierre — Nokia con D-Code de operadora
LB = logo_bits(26)
p6 = pantalla("p6", 96, 64, [
    ("senal", 2, None, {"lado": "i"}), ("senal", 2, None, {"lado": "d"}),
    ("bits", 1, LB, {}), ("tb", 25, "D-CODE", {}),
    ("t", 37, "RESPUESTA A TÚ:", {}), ("tb", 48, "VOY A POR TI.", {"inv": True}),
], 7, VERDE, NEGRO_LCD)
print("pantallas listas")

# ─────────────── móviles (HTML/CSS) ───────────────
def pg(movil, rot=0, dx=0, dy=0, pie=""):
    return (f'<section class="pg"><div class="luz"></div><div class="movil" style="transform:translate({dx}px,{dy}px) rotate({rot}deg)">{movil}</div>'
            f'{pie}<div class="grano"></div><div class="vig"></div></section>')

BUSCA = f'''<div class="busca"><div class="clip"></div><div class="marco"><img src="{p1}"></div>
  <div class="bots"><i></i><i class="g"></i><i></i></div><div class="lado"></div><div class="rejilla">{"".join("<b></b>" for _ in range(9))}</div></div>'''
def nokia(src, marca="", color="azul"):
    return f'''<div class="nokia {color}"><div class="auricular">{"".join("<b></b>" for _ in range(5))}</div>
  <div class="logo-cuerpo">{marca}</div><div class="cristal"><img src="{src}"></div>
  <div class="navi"><div class="c">C</div><div class="tecla-nav"></div><div class="flechas"></div></div>
  <div class="teclado">{"".join(f'<span>{k}</span>' for k in "123456789")}</div></div>'''
LADRILLO = f'''<div class="ladrillo"><div class="antena"></div><div class="tope"></div><div class="lcdmarco"><img src="{p3}"></div>
  <div class="snd"><span>SND</span><span>CLR</span><span>END</span></div>
  <div class="tec">{"".join(f'<span>{k}</span>' for k in "123456789*0#")}</div></div>'''
TAPA = f'''<div class="tapa"><div class="tapa-sup"><div class="auric2"></div><div class="cristal2"><img src="{p4}"></div></div>
  <div class="bisagra"></div><div class="tapa-inf">{"".join(f'<span>{k}</span>' for k in "123456")}</div></div>'''
SIEMENS = f'''<div class="siemens"><div class="auric3"></div><div class="cristal3"><img src="{p5}"></div>
  <div class="botones3"><i></i><i class="rueda"></i><i></i></div><div class="teclado3">{"".join(f'<span>{k}</span>' for k in "123456789")}</div></div>'''

S = [
    pg(BUSCA, rot=-4, dy=-40),
    pg(nokia(p2), rot=2.5),
    pg(LADRILLO, rot=-6, dx=10),
    pg(TAPA, rot=3),
    pg(SIEMENS, rot=-2.5),
    pg(nokia(p6, "D-CODE", "negro"), rot=1.5, pie='<div class="pie">@d_codepartners</div>'),
]
CSS = open("estilo.css").read()
open("carrusel.html", "w").write(f'<!doctype html><html lang="es"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{"".join(S)}</body></html>')
print(len(S), "imágenes")
