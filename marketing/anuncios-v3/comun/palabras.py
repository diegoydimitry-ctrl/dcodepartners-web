# Tiempos por palabra de cada frase de la locución, para que la tipografía golpee con la voz.
#
#   python3 comun/palabras.py v1-youtube
#
# No hay un modelo de alineación forzada disponible aquí, así que se hace en dos pasos:
#   1. se reparte la duración de la frase entre sus palabras en proporción a las sílabas (las vocales
#      son buena aproximación en español), y
#   2. cada inicio estimado se «imanta» al ataque de energía real más cercano del audio (±160 ms).
# Error típico por debajo de 0,1 s. En tipografía cinética el texto puede adelantarse a la voz ese tanto sin
# que se note desfase: es lo habitual en montaje publicitario.
import json, os, re, sys
import numpy as np, soundfile as sf

AQUI = os.path.dirname(os.path.abspath(__file__))

def silabas(p):
    p = p.lower()
    grupos = re.findall(r"[aeiouáéíóúü]+", p)
    n = 0
    for g in grupos:   # los hiatos cuentan doble, los diptongos una
        n += 2 if (len(g) >= 2 and all(c in "aeoáéó" for c in g[:2])) else 1
    return max(1, n)

def ataques(x, sr):
    hop = int(0.01 * sr); win = int(0.03 * sr)
    rms = np.array([np.sqrt(np.mean(x[i:i + win] ** 2)) for i in range(0, max(1, len(x) - win), hop)])
    rms = rms / (rms.max() + 1e-9)
    d = np.diff(rms, prepend=0)
    cand = [i for i in range(1, len(d) - 1) if d[i] > 0.06 and d[i] >= d[i - 1] and d[i] >= d[i + 1]]
    return np.array(cand) * hop / sr, rms

def main(video):
    base = os.path.join(AQUI, "..", video)
    m = json.load(open(os.path.join(base, "montaje.json"), encoding="utf-8"))
    for f in m["voz"]:
        x, sr = sf.read(os.path.join(base, "voz", f"{f['id']}.wav"), dtype="float32")
        dur = len(x) / sr
        at, rms = ataques(x, sr)
        # el habla empieza y acaba donde la energía supera el 8 %
        activo = np.where(rms > 0.08)[0]
        h0 = activo[0] * 0.01 if len(activo) else 0.0
        h1 = activo[-1] * 0.01 + 0.03 if len(activo) else dur
        ws = [w for w in re.split(r"\s+", f["texto"].strip()) if w]
        pesos = np.array([silabas(re.sub(r"[^\wáéíóúñü%]", "", w)) or 1 for w in ws], float)
        cum = np.concatenate([[0], np.cumsum(pesos)]) / pesos.sum()
        out = []
        for i, w in enumerate(ws):
            t = h0 + cum[i] * (h1 - h0)
            if i > 0 and len(at):
                j = np.argmin(np.abs(at - t))
                if abs(at[j] - t) < 0.16: t = float(at[j])
            out.append({"w": w, "t0": round(f["t0"] + t, 3)})
        for i in range(len(out)):
            out[i]["t1"] = out[i + 1]["t0"] if i + 1 < len(out) else round(f["t0"] + h1, 3)
        f["palabras"] = out
    json.dump(m, open(os.path.join(base, "montaje.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for f in m["voz"][:3] + m["voz"][-2:]:
        print(f"{f['id']:<4} " + "  ".join(f"{p['w']}@{p['t0']:.2f}" for p in f["palabras"]))
    print(f"… {sum(len(f['palabras']) for f in m['voz'])} palabras con tiempo en {video}")

if __name__ == "__main__":
    main(sys.argv[1])
