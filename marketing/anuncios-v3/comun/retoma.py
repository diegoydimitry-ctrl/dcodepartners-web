# Rehace los tiempos de un vídeo a partir de UNA toma continua nueva de la locución.
#
#   python3 comun/retoma.py v4-comerciales ruta/toma.wav [cola_s]
#
# 1. Copia la toma a voz/toma.wav (mono, 48 kHz).
# 2. La parte en tantas frases como líneas «voz» tenga montaje.json: busca los silencios y, si sobran
#    cortes, une los más cortos (las comas) hasta que cuadra; si faltan, afina el umbral.
# 3. Escribe voz/cN.wav (cortes exactos, solo para medir tiempos por palabra) y actualiza en montaje.json
#    los t0/t1 de cada frase, los golpes de escena y la duración (fin de la voz + cola).
# Después hay que ejecutar comun/palabras.py para los tiempos por palabra.
import json, os, sys, subprocess
import numpy as np, soundfile as sf
AQUI = os.path.dirname(os.path.abspath(__file__))
LEAD = 0.15

def huecos(x, sr, umbral_db, min_sil):
    w = int(0.01 * sr); e = np.array([np.sqrt(np.mean(x[i:i + w] ** 2)) for i in range(0, len(x) - w, w)])
    act = 20 * np.log10(e / e.max() + 1e-9) > umbral_db
    idx = np.where(act)[0]; ini, fin = idx[0], idx[-1] + 1
    segs, a = [], ini
    i = ini
    while i < fin:
        if not act[i]:
            j = i
            while j < fin and not act[j]: j += 1
            if (j - i) * 0.01 >= min_sil: segs.append((a, i)); a = j
            i = j
        else: i += 1
    segs.append((a, fin))
    return [(s * 0.01, t * 0.01) for s, t in segs]

def parte(x, sr, n):
    for umbral in (-40, -44, -36, -48, -32):
        for min_sil in (0.12, 0.09, 0.16, 0.07):
            s = huecos(x, sr, umbral, min_sil)
            while len(s) > n:
                g = [s[i + 1][0] - s[i][1] for i in range(len(s) - 1)]; k = int(np.argmin(g))
                s[k:k + 2] = [(s[k][0], s[k + 1][1])]
            if len(s) == n: return s
    raise SystemExit(f"no se pudo partir en {n} frases")

def main(video, toma, cola=2.2):
    base = os.path.join(AQUI, "..", video)
    m = json.load(open(os.path.join(base, "montaje.json"), encoding="utf-8"))
    dst = os.path.join(base, "voz", "toma.wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", toma, "-ac", "1", "-ar", "48000", "-c:a", "pcm_s24le", dst], check=True)
    x, sr = sf.read(dst, dtype="float32")
    s = parte(x, sr, len(m["voz"]))
    for f, (a, b) in zip(m["voz"], s):
        a = max(0, a - 0.01); b = min(len(x) / sr, b + 0.02)
        sf.write(os.path.join(base, "voz", f"{f['id']}.wav"), x[int(a * sr):int(b * sr)], sr, subtype="PCM_24")
        f["t0"], f["t1"] = round(a + LEAD, 3), round(b + LEAD, 3)
        f.pop("palabras", None)
    V = {f["id"]: f for f in m["voz"]}
    for clave, fid in (("crece", "c2"), ("comision", "c3"), ("cincuenta", "c4"), ("producto", "c5"), ("cierre", "c6"), ("cta", "c8")):
        if clave in m and fid in V: m[clave] = V[fid]["t0"]
    m["toma"] = {"archivo": "voz/toma.wav", "en": LEAD, "dur": round(len(x) / sr, 3)}
    m["duracion"] = round(m["voz"][-1]["t1"] + cola, 2)
    json.dump(m, open(os.path.join(base, "montaje.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for f in m["voz"]: print(f"{f['id']}  {f['t0']:6.3f}–{f['t1']:6.3f}  {f['texto']}")
    print("duración", m["duracion"])

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], float(sys.argv[3]) if len(sys.argv) > 3 else 2.2)
