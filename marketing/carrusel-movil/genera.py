# Carrusel de Instagram «Mensajes de tu yo de dentro de 5 años» — 6 imágenes 1080×1350 con estética de móvil antiguo.
# Diseño y textos originales. python3 genera.py → carrusel.html → render.cjs → salida/NN.png
import html

LOGO = open("fuentes/logo.txt").read().split("\n")

def svg_px(rows, size, colores, extra=""):
    """Matriz de caracteres → SVG pixelado (shape-rendering crispEdges)."""
    h, w = len(rows), max(len(r) for r in rows)
    rects = []
    for y, r in enumerate(rows):
        for x, c in enumerate(r):
            if c in colores:
                rects.append(f'<rect x="{x}" y="{y}" width="1.02" height="1.02" fill="{colores[c]}"/>')
    return (f'<svg viewBox="0 0 {w} {h}" width="{w * size}" height="{h * size}" shape-rendering="crispEdges" {extra}>'
            + "".join(rects) + "</svg>")

SOBRE = [
    "xxxxxxxxxxxxxxxxxxxxxx",
    "xx..................xx",
    "x.x................x.x",
    "x..x..............x..x",
    "x...x............x...x",
    "x....x..........x....x",
    "x.....x........x.....x",
    "x......x......x......x",
    "x.......xx..xx.......x",
    "x.........xx.........x",
    "x....................x",
    "x....................x",
    "x....................x",
    "xxxxxxxxxxxxxxxxxxxxxx",
]
CAMPANA = [
    ".....xx.....",
    "....xxxx....",
    "...xxxxxx...",
    "..xxxxxxxx..",
    "..xxxxxxxx..",
    "..xxxxxxxx..",
    ".xxxxxxxxxx.",
    "xxxxxxxxxxxx",
    "............",
    ".....xx.....",
]
def bateria(n, total=5):
    filas = ["xxxxxxxxxxxxxxxxx.", "x...............x."]
    for _ in range(4):
        cel = "".join("xx." if i < n else "..." for i in range(total))
        filas.append("x." + cel[:14].ljust(14, ".") + "xx")
    filas += ["x...............x.", "xxxxxxxxxxxxxxxxx."]
    return filas

def barras_laterales(lado, n=5):
    """Columna de barras tipo Nokia (cobertura a la izquierda, batería a la derecha)."""
    out = []
    for i in range(n):
        w = 14 + (n - i) * 7
        out.append(f'<div class="bar" style="width:{w}px;{"margin-left:auto" if lado == "d" else ""}"></div>')
    return f'<div class="barras {lado}">' + "".join(out) + "</div>"

def md(t):
    """*palabra* → resaltada."""
    import re
    return re.sub(r"\*(.+?)\*", r'<b class="hl">\1</b>', html.escape(t)).replace("\n", "<br>")

# ───────────────────────── pantallas ─────────────────────────
def mono(cont, rot=-2.0, sk=("Opción", "Salir"), arriba="", desplaza=(0, 0)):
    """Móvil monocromo (LCD verde) fotografiado."""
    izq, der = sk
    return f'''
<section class="pg mono">
  <div class="foto" style="transform:translate({desplaza[0]}px,{desplaza[1]}px) rotate({rot}deg)">
    <div class="carcasa">
      <div class="lcd">
        <div class="lcd-in">
          {barras_laterales("i")}{barras_laterales("d")}
          <div class="top">{arriba}</div>
          <div class="cuerpo">{cont}</div>
          <div class="sk"><span>{izq}</span><span>{der}</span></div>
        </div>
      </div>
      <div class="teclas"><i></i><i class="c"></i><i></i></div>
    </div>
  </div>
  <div class="grano"></div><div class="vig"></div>
</section>'''

def color(titulo, cont, sk=("Opciones", "Volver"), hora="06:30", icono="", rot=0.0, extra_cls=""):
    """Móvil de pantalla a color, primeros 2000."""
    izq, der = sk
    return f'''
<section class="pg color {extra_cls}">
  <div class="foto" style="transform:rotate({rot}deg)">
    <div class="carcasa2">
      <div class="scr">
        <div class="status"><span class="sig">{"".join(f'<i style="height:{6+k*5}px"></i>' for k in range(5))}</span>
          <span class="hora">{hora}</span>{svg_px(bateria(2), 3, {"x": "#e9edf5"}, 'class="bat"')}</div>
        <div class="tit">{icono}<span>{titulo}</span></div>
        <div class="txt">{cont}</div>
        <div class="sk2"><span>{izq}</span><span>{der}</span></div>
      </div>
      <div class="luces"><b>─</b><b>─</b><em>C</em><em class="ok">OK</em></div>
    </div>
  </div>
  <div class="grano"></div><div class="vig"></div>
</section>'''

S = []
# 1 · GANCHO — notificación de un mensaje de ti mismo dentro de 5 años
S.append(mono(
    f'''<div class="sobre">{svg_px(SOBRE, 9, {"x": "var(--px)"})}</div>
        <div class="grande">1 mensaje<br>nuevo</div>
        <div class="de">De: TÚ<br>(dentro de cinco años)</div>''',
    rot=-2.2, sk=("Leer", "Ignorar"), arriba='<span class="reloj">03:14</span>'))
# 2 · El primer mensaje
S.append(color("Mensaje · Tú (2031)",
    md("Deja de esperar\na tener ganas.\n\nLas ganas llegan\n*después* de empezar.\nNunca antes."),
    sk=("Responder", "Siguiente"), hora="03:15",
    icono=svg_px(SOBRE, 2, {"x": "#10131c"}, 'class="ico"'), rot=1.2))
# 3 · Alarma: posponer tachado
S.append(mono(
    f'''<div class="campana">{svg_px(CAMPANA, 10, {"x": "var(--px)"})}</div>
        <div class="titmono">ALARMA 06:30</div>
        <div class="txtmono">Nadie va a venir<br>a salvarte.<br>Ni el lunes.<br>Ni enero.<br>Eres tú. Hoy.</div>''',
    rot=2.4, sk=('<s>Posponer</s>', "Levantarse"), desplaza=(0, -10)))
# 4 · Memoria llena
S.append(color("Memoria llena",
    '''<div class="mem"><div class="memb"><i style="width:99%"></i></div><div class="memt">99% ocupado</div></div>'''
    + md("Borra excusas\npara hacer sitio\na tus *avances*."),
    sk=("Borrar", "Cancelar"), hora="21:40",
    icono='<span class="ico-mem">!</span>', rot=-1.4))
# 5 · Cargando — el progreso no se ve hoy
S.append(mono(
    f'''<div class="titmono">CARGANDO...</div>
        <div class="prog"><div class="progb">{"".join("<i></i>" for _ in range(7))}{"".join("<u></u>" for _ in range(11))}</div><div class="prognum">37%</div></div>
        <div class="txtmono">Lo que haces hoy<br>no se nota hoy.<br>Se nota dentro<br>de cinco años.</div>''',
    rot=-1.6, sk=("Seguir", "Cancelar"), desplaza=(0, -6)))
# 6 · D-Code — pantalla de encendido
logo_lcd = svg_px(LOGO, 7, {"w": "#f2f4f8", "b": "#2f7cf6"})
S.append(f'''
<section class="pg color fin">
  <div class="foto">
    <div class="carcasa2">
      <div class="scr arranque">
        <div class="logo">{logo_lcd}</div>
        <div class="marca">D-Code<small>PARTNERS</small></div>
        <div class="carga"><i></i><i></i><i></i><i></i><i></i><i></i><u></u><u></u></div>
        <div class="lema">Construimos sistemas.<br>Tú construye tu <b class="hl">disciplina</b>.</div>
        <div class="sk2"><span>@d_codepartners</span><span>Empezar</span></div>
      </div>
      <div class="luces"><b>─</b><b>─</b><em>C</em><em class="ok">OK</em></div>
    </div>
  </div>
  <div class="grano"></div><div class="vig"></div>
</section>''')

CSS = open("estilo.css").read()
doc = f'<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Carrusel</title><style>{CSS}</style></head><body>{"".join(S)}</body></html>'
open("carrusel.html", "w").write(doc)
print(len(S), "imágenes")
