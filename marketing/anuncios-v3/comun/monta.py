# Coloca la locución en el tiempo a partir de las duraciones reales de cada toma y escribe montaje.json.
#
#   python3 comun/monta.py v1-youtube
#
# El plan de cada vídeo (plan.json) dice, frase a frase, el hueco que la separa de la anterior; y opcionalmente
# un «ancla»: dos frases entre las que debe haber una distancia exacta (p. ej. la cuenta atrás de 30 s del
# vídeo 1). Si hace falta, los huecos marcados como «elásticos» se estiran o encogen por igual para cumplirla.
import json, os, sys
AQUI = os.path.dirname(os.path.abspath(__file__))
v = sys.argv[1]; base = os.path.join(AQUI, "..", v)
plan = json.load(open(os.path.join(base, "plan.json"), encoding="utf-8"))
man = {m["id"]: m for m in json.load(open(os.path.join(base, "voz", "manifest.json"), encoding="utf-8"))["frases"]}

def coloca(ajuste=0.0):
    t = 0.0; out = []
    for i, p in enumerate(plan["frases"]):
        hueco = max(0.12, p.get("hueco", 0.3) + (ajuste if p.get("elastico") else 0.0)) if "en" not in p else 0
        t0 = p["en"] if "en" in p else t + hueco
        out.append({"id": p["id"], "t0": round(t0, 3), "t1": round(t0 + man[p["id"]]["dur"], 3), "texto": man[p["id"]]["texto"]})
        t = out[-1]["t1"]
    return out

voz = coloca()
if "ancla" in plan:
    a, b, dist = plan["ancla"]["desde"], plan["ancla"]["hasta"], plan["ancla"]["segundos"]
    n = sum(1 for p in plan["frases"] if p.get("elastico"))
    V = {f["id"]: f for f in voz}; falta = dist - (V[b]["t0"] - V[a]["t0"])
    voz = coloca(falta / max(1, n)); V = {f["id"]: f for f in voz}
    print(f"ancla {a}→{b}: {V[b]['t0'] - V[a]['t0']:.2f} s (ajuste por hueco elástico {falta / max(1, n):+.3f} s)")
V = {f["id"]: f for f in voz}
M = {"video": v, "fps": 30, "voz": voz}
for k, expr in plan.get("marcas", {}).items():   # marcas derivadas: «h.t1+0.05», «c7.t0» …
    idf, campo = expr.split("+")[0].split(".") if "+" in expr else expr.split(".")
    extra = float(expr.split("+")[1]) if "+" in expr else 0.0
    M[k] = round(V[idf][campo] + extra, 3)
M["duracion"] = round(voz[-1]["t1"] + plan.get("cola", 1.2), 2)
M.update(plan.get("fijos", {}))
json.dump(M, open(os.path.join(base, "montaje.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for f in voz: print(f"  {f['id']:<4} {f['t0']:6.2f} → {f['t1']:6.2f}  {f['texto']}")
print("  marcas:", {k: M[k] for k in plan.get("marcas", {})}, "· duración", M["duracion"])
