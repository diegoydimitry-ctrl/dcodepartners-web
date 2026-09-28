# Subtítulos .srt de un vídeo a partir de montaje.json (una línea por frase de la locución, con sus tiempos reales).
#
#   python3 comun/subtitulos.py v2-vendedores entrega/dcode-comerciales-v6-9x16.srt
#
# Frases largas se parten en dos líneas de ≤ 42 caracteres (norma habitual de subtítulos). El texto es el del guion,
# no una transcripción automática.
import json, os, sys
AQUI = os.path.dirname(os.path.abspath(__file__))
v, destino = sys.argv[1], sys.argv[2]
M = json.load(open(os.path.join(AQUI, "..", v, "montaje.json"), encoding="utf-8"))
def ts(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"
def lineas(texto, ancho=42):
    if len(texto) <= ancho: return texto
    pal = texto.split(); mejor = None
    for i in range(1, len(pal)):
        a, b = " ".join(pal[:i]), " ".join(pal[i:])
        if len(a) <= ancho and len(b) <= ancho and (mejor is None or abs(len(a) - len(b)) < abs(len(mejor[0]) - len(mejor[1]))): mejor = (a, b)
    return "\n".join(mejor) if mejor else texto
out = []
V = M["voz"]
for i, f in enumerate(V, 1):
    fin = f["t1"] + 0.25 if i == len(V) else min(f["t1"] + 0.25, V[i]["t0"] - 0.05)   # nunca pisa el siguiente
    out.append(f"{i}\n{ts(f['t0'])} --> {ts(fin)}\n{lineas(f['texto'])}\n")
ruta = os.path.join(AQUI, "..", v, destino); open(ruta, "w", encoding="utf-8").write("\n".join(out))
print(f"{len(out)} subtítulos → {os.path.relpath(ruta, os.path.join(AQUI, '..'))}")
