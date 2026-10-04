#!/usr/bin/env python3
"""Pasa los fotogramas pintados por escena.py (PNG) a WebP dentro de assets/v2/img/escena/ y guarda en scripts/v7/datos.json lo que la página
necesita saber de ellos: cuántos fotogramas tiene cada viaje, dónde caen la pantalla del portátil y la placa, y qué rectángulo ocupa cada cosa.
Uso: python3 scripts/v7/imagenes.py <carpeta de fotogramas>"""
import sys, os, json, re
from PIL import Image
AQUI = os.path.dirname(os.path.abspath(__file__)); RAIZ = os.path.abspath(os.path.join(AQUI, "../..")); DEST = os.path.join(RAIZ, "assets/v2/img/escena")
ORIGEN = sys.argv[1]; os.makedirs(DEST, exist_ok=True)
CALIDAD = {"h": 90, "v": 88, "t": 78, "u": 76}
total = {k: 0 for k in CALIDAD}; n = {k: 0 for k in CALIDAD}
for f in sorted(os.listdir(ORIGEN)):
    if not f.endswith(".png") or f[0] not in CALIDAD: continue
    sal = os.path.join(DEST, f[:-4] + ".webp")
    if not os.path.exists(sal) or os.path.getmtime(sal) < os.path.getmtime(os.path.join(ORIGEN, f)):
        Image.open(os.path.join(ORIGEN, f)).convert("RGB").save(sal, "WEBP", quality=CALIDAD[f[0]], method=6)
    total[f[0]] += os.path.getsize(sal); n[f[0]] += 1
for k in CALIDAD: print(f"{k}: {n[k]} imágenes, {total[k] / 1024:.0f} KB")
print(f"escritorio (h+t): {(total['h'] + total['t']) / 1024:.0f} KB · móvil (v+u): {(total['v'] + total['u']) / 1024:.0f} KB")
# los viajes que de verdad están enteros (si falta un fotograma, ese viaje se queda en fundido entre las dos fotografías)
tr = json.load(open(os.path.join(ORIGEN, "transiciones.json"))); hay = set(os.listdir(DEST)); listos = {}
for s, pre in (("h", "t"), ("v", "u")):
    listos[s] = [[c0, k] for c0, k in tr[s] if all(f"{pre}-{c0}-{i:02d}.webp" in hay for i in range(1, k))]
medidas = json.load(open(os.path.join(ORIGEN, "anclas.json"))); sobre = medidas["sobre"]
json.dump({"tr": listos, "sobre": sobre, "cajas": medidas["cajas"]}, open(os.path.join(AQUI, "datos.json"), "w"), indent=1)
print("viajes:", listos, "· planos:", sorted(sobre))
