# Importa tomas de voz generadas fuera (Qwen3-TTS, ElevenLabs, un locutor…) al formato del montaje.
#
#   python3 comun/importa_voz.py v2-vendedores elecciones.json
#
# elecciones.json: {"motor": "…", "voz": "…", "frases": [{"id", "texto", "archivo", "wer", "var_st", "sps", "tomas"}]}
# Cada archivo se recorta de silencio en los extremos (margen corto), se pasa a 48 kHz y se escribe en
# <vídeo>/voz/<id>.wav; manifest.json guarda texto, duración y las medidas del casting.
import json, os, sys
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
AQUI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, AQUI)
from voz import recorta
v = sys.argv[1]; E = json.load(open(sys.argv[2], encoding="utf-8"))
out = os.path.join(AQUI, "..", v, "voz"); os.makedirs(out, exist_ok=True)
for f in os.listdir(out):
    if f.endswith(".wav"): os.remove(os.path.join(out, f))
man = []
for f in E["frases"]:
    x, sr = sf.read(f["archivo"], dtype="float32")
    x = recorta(x.mean(1) if x.ndim > 1 else x, sr, -50, 0.06)
    y = resample_poly(x, 48000, sr).astype(np.float32)
    sf.write(os.path.join(out, f"{f['id']}.wav"), y, 48000, subtype="FLOAT")
    m = {k: f[k] for k in f if k not in ("archivo",)}; m["dur"] = round(len(y) / 48000, 3); man.append(m)
    print(f"{f['id']:<5} {m['dur']:5.2f} s  «{f['texto']}»")
json.dump({"motor": E["motor"], "voz": E["voz"], "sr": 48000, "frases": man},
          open(os.path.join(out, "manifest.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
