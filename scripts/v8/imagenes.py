#!/usr/bin/env python3
"""De los PNG que pinta escenas.py a lo que publica la web.

Pasa a WebP las fotografías (1920 × 1080) y los fotogramas (960 × 540) de una
carpeta, los deja en assets/v2/img/escena/ y escribe scripts/v8/datos.json con
lo que la página necesita saber de ellas: cuántos fotogramas tiene cada viaje,
dónde cae en cada fotografía cada cosa que lleva nombre (las anclas), qué tono
tiene el fondo de cada una (para el velo de detrás del texto) y hacia dónde se
encuadra en el teléfono.

Uso: python3 scripts/v8/imagenes.py <carpeta con los PNG, plan.json y anclas.json>
"""
import json, sys, os, glob
from PIL import Image

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
SAL = os.path.join(RAIZ, "assets/v2/img/escena")
ORIGEN = sys.argv[1]
FIJA = {0: "h-0", 1: "h-1", 2: "h-2", 3: "h-3", 4: "h-4", 5: "h-5", 6: "h-6", 7: "h-6", 8: "h-8"}
NOCHE = [0, 6, 7, 8]                       # los actos de las placas: escena oscura, texto claro
FOCO = {0: 0.645, 1: 0.70, 2: 0.72, 3: 0.66, 4: 0.72, 5: 0.58, 6: 0.61, 7: 0.61, 8: 0.72}   # centro del encuadre en el teléfono (0…1 del ancho)

os.makedirs(SAL, exist_ok=True)
plan = json.load(open(os.path.join(ORIGEN, "plan.json")))
anclas = json.load(open(os.path.join(ORIGEN, "anclas.json")))

esperadas = set(FIJA.values()) | {"e-fin"} | {f"e-{k:02d}" for k in range(1, plan["sec"] + 1)}
for i, n in plan["tr"]:
    esperadas |= {f"t-{i}-{k:02d}" for k in range(1, n)}
hechas, faltan, peso = [], [], 0
for nombre in sorted(esperadas):
    png = os.path.join(ORIGEN, nombre + ".png")
    if not os.path.exists(png): faltan.append(nombre); continue
    im = Image.open(png).convert("RGB"); fija = nombre.startswith("h-") or nombre == "e-fin"
    dst = os.path.join(SAL, nombre + ".webp")
    if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(png):
        im.save(dst, "WEBP", quality=84 if fija else 74, method=6)
    hechas.append(nombre); peso += os.path.getsize(dst)
# lo que ya no se usa (las imágenes de la portada anterior) se quita
for f in glob.glob(os.path.join(SAL, "*.webp")):
    if os.path.splitext(os.path.basename(f))[0] not in hechas: os.remove(f)

def tono(nombre):
    """El color del fondo en la zona donde va el texto (la franja izquierda de la fotografía)."""
    png = os.path.join(ORIGEN, nombre + ".png")
    if not os.path.exists(png): return [228, 228, 227]
    im = Image.open(png).convert("RGB"); w, h = im.size
    zona = im.crop((int(w * 0.04), int(h * 0.30), int(w * 0.30), int(h * 0.70))).resize((1, 1), Image.BOX)
    return list(zona.getpixel((0, 0)))

datos = {
    "tr": plan["tr"], "sec": plan["sec"], "noche": NOCHE,
    "tono": {str(i): tono(n) for i, n in FIJA.items()},
    "foco": {str(i): v for i, v in FOCO.items()},
    "anclas": anclas, "imagenes": sorted(esperadas),
}
json.dump(datos, open(os.path.join(RAIZ, "scripts/v8/datos.json"), "w"), ensure_ascii=False, separators=(",", ":"))
print(f"imágenes: {len(hechas)} de {len(esperadas)} · {peso / 1024:.0f} KB" + (f" · faltan {len(faltan)}: {' '.join(faltan[:8])}…" if faltan else ""))
