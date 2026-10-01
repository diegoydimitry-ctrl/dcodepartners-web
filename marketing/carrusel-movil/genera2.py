# Carrusel 2 «Llamada entrante: tus excusas» — reutiliza las piezas de genera.py
exec(open("genera.py").read().split("S = []")[0])
TEL = [
    "xxx.........",
    "xxxx........",
    "xxxx........",
    "xxx.........",
    ".xx.........",
    ".xxx........",
    "..xxx...xxx.",
    "...xxxxxxxxx",
    "....xxxxxxxx",
    ".......xxxx.",
]
AVION = [
    ".....xx.....", ".....xx.....", "....xxxx....", "..xxxxxxxx..", "xxxxxxxxxxxx",
    "x...xxxx...x", ".....xx.....", ".....xx.....", "....xxxx....", "...xx..xx...",
]
CHECK = ["..........xx", ".........xxx", "........xxx.", "xx.....xxx..", "xxx...xxx...", ".xxx.xxx....", "..xxxxx.....", "...xxx......"]
logo_op = svg_px(LOGO, 2, {"w": "#f2f4f8", "b": "#4b8dff"}, 'class="op-logo"')
S = []
# 1 · GANCHO
S.append(mono(
    f'''<div class="sobre tiembla">{svg_px(TEL, 12, {"x": "var(--px)"})}</div>
        <div class="titmono">LLAMADA ENTRANTE</div>
        <div class="grande">TUS<br>EXCUSAS</div>''',
    rot=-2.4, sk=("Contestar", "Rechazar"), arriba='<span class="reloj">06:30</span>'))
# 2
S.append(color("Te llama otra vez",
    md("Las excusas siempre\nllaman cuando estás\n*cansado*, cuando hace\nfrío o cuando nadie\nte está mirando."),
    sk=("Contestar", "Colgar"), hora="06:31", icono=svg_px(TEL, 4, {"x": "#10131c"}, 'class="ico"'), rot=1.3))
# 3
S.append(mono(
    f'''<div class="campana">{svg_px(AVION, 10, {"x": "var(--px)"})}</div>
        <div class="titmono">MODO AVIÓN: ON</div>
        <div class="txtmono">Sin notificaciones.<br>Sin opiniones.<br>Solo tú y lo que<br>tienes que hacer.</div>''',
    rot=2.2, sk=("Atrás", "Seguir"), desplaza=(0, -8)))
# 4
agenda = "".join(f'<div class="ag"><span class="h">{h}</span><span class="t">{t}</span><span class="ok">{svg_px(CHECK, 4, {"x": "#7fd39a"})}</span></div>'
                 for h, t in (("06:30", "Entrenar"), ("08:00", "Lo difícil primero"), ("22:00", "Repetir mañana")))
S.append(color("Agenda · Hoy",
    f'<div class="agenda">{agenda}</div>' + md("Un día bueno\nno cambia nada.\n*Cien seguidos, sí.*"),
    sk=("Opciones", "Mañana"), hora="22:01", icono='<span class="ico-mem">31</span>', rot=-1.2, extra_cls="c4"))
# 5
S.append(mono(
    f'''<div class="titmono">SIN COBERTURA</div>
        <div class="txtmono">Nadie va a entender<br>lo que construyes<br>hasta que esté<br>construido.</div>
        <div class="de">Sigue igual.</div>''',
    rot=-1.8, sk=("Reintentar", "Seguir"), desplaza=(0, -6), sin_barras=True))
# 6 · CIERRE
S.append(f'''
<section class="pg color fin">
  <div class="foto" style="transform:rotate(-1.2deg)">
    <div class="carcasa2">
      <div class="scr">
        <div class="status"><span class="sig">{"".join(f'<i style="height:{6+k*5}px"></i>' for k in range(5))}</span>
          <span class="op">{logo_op}D-Code</span>{svg_px(bateria(5), 3, {"x": "#e9edf5"}, 'class="bat"')}</div>
        <div class="tit"><span class="ico-mem">✕</span><span>Llamada rechazada</span></div>
        <div class="resp">
          <div class="para">Llamada de: <b>Tus excusas</b> · 00:00</div>
          <div class="burbuja grande2">Hoy no.</div>
          <div class="entregado">✓✓ Respuesta enviada · 06:30</div>
        </div>
        <div class="firma">{svg_px(LOGO, 3, {"w": "#f2f4f8", "b": "#4b8dff"})}<div><strong>D-Code Partners</strong><span>@d_codepartners</span></div></div>
        <div class="sk2"><span>Guardar</span><span>Enviar a alguien</span></div>
      </div>
      <div class="luces"><b>─</b><b>─</b><em>C</em><em class="ok">OK</em></div>
    </div>
  </div>
  <div class="grano"></div><div class="vig"></div>
</section>''')
CSS = open("estilo.css").read() + """
.tiembla{position:relative}
.tiembla::before,.tiembla::after{content:"";position:absolute;top:30px;width:16px;height:70px;border:8px solid var(--px);border-width:0 8px 0 0;border-radius:0 60px 60px 0}
.tiembla::before{right:-46px}.tiembla::after{left:-46px;transform:scaleX(-1)}
.agenda{margin-bottom:34px}
.ag{display:flex;align-items:center;gap:26px;padding:12px 0;border-bottom:2px solid rgba(159,176,208,.2);font:600 50px "Barlow"}
.ag .h{color:var(--ambar);width:150px}.ag .t{flex:1;color:#f3f5fa}
.c4 .txt{font-size:68px}
.fin .burbuja.izq{align-self:flex-start;border-radius:34px 34px 34px 8px;background:linear-gradient(180deg,#2a3c62,#1d2c4d);color:#fff;box-shadow:none;border:3px solid #3b5590}
.fin .entregado.gris{align-self:flex-start;color:#ff8a7a}
.titmono{white-space:nowrap}
.mono .cuerpo .titmono{font-size:40px}
.fin .burbuja.grande2{font-size:160px;padding:30px 56px 40px;margin-top:44px}
"""
doc = f'<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Carrusel 2</title><style>{CSS}</style></head><body>{"".join(S)}</body></html>'
open("carrusel2.html", "w").write(doc); print(len(S))
