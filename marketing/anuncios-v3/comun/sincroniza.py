# Tras regenerar alguna frase: ajusta el final (t1) de cada frase de montaje.json a su nueva duración y
# avisa de solapes. Después hay que volver a pasar palabras.py.
#   python3 comun/sincroniza.py v1-youtube
import json, os, sys
AQUI = os.path.dirname(os.path.abspath(__file__))
v = os.path.join(AQUI, "..", sys.argv[1])
M = json.load(open(f"{v}/montaje.json", encoding="utf-8"))
man = {m["id"]: m for m in json.load(open(f"{v}/voz/manifest.json", encoding="utf-8"))["frases"]}
prev = None
for f in M["voz"]:
    f["t1"] = round(f["t0"] + man[f["id"]]["dur"], 3); f["texto"] = man[f["id"]]["texto"]
    if prev and prev["t1"] > f["t0"]: print("SOLAPE", prev["id"], f["id"], prev["t1"], f["t0"])
    prev = f
json.dump(M, open(f"{v}/montaje.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("montaje sincronizado:", sys.argv[1])
