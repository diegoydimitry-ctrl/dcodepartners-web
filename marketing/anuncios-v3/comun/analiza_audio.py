# Control de calidad objetivo de una mezcla (no puedo escucharla, así que se mide):
#
#   python3 comun/analiza_audio.py v1-youtube [ruta-audio]
#
#  · sonoridad integrada y pico;
#  · por cada frase: sonoridad de la voz frente a la de música + efectos en esa ventana (objetivo ≥ 8 LU);
#  · inteligibilidad: cada frase se recorta DE LA MEZCLA y se transcribe con Whisper → error por palabra;
#  · silencios no previstos (tramos > 0,35 s por debajo de −50 dBFS que no estén en el guion);
#  · un espectrograma + forma de onda en audio/analisis.png para revisarlo a ojo.
import json, os, sys
import numpy as np, soundfile as sf, pyloudnorm as pyln
from scipy.signal import resample_poly
AQUI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, AQUI)
from voz import wer, MOD
import re

def sin_marca(t):
    """La marca no está en el vocabulario de Whisper y la escribe de mil maneras («decode», «the Code», «Dico de»…).
    Se puntúa aparte: WER sobre el resto de palabras + comprobación de que se oye «…cod…»."""
    ws = re.findall(r"[\wáéíóúñü%-]+", t)
    marca = lambda w: re.fullmatch(r"(?i)the|partners|compañeros|[\w-]*cod[\w-]*|dico|tico", w) is not None
    fuera = {k for k, w in enumerate(ws) if marca(w)}
    fuera |= {k for k, w in enumerate(ws) if w.lower() == "de" and (k - 1 in fuera or k + 1 in fuera)}
    return " ".join(w for k, w in enumerate(ws) if k not in fuera)


def main(video, ruta=None):
    base = os.path.join(AQUI, "..", video); A = os.path.join(base, "audio")
    M = json.load(open(os.path.join(base, "montaje.json"), encoding="utf-8"))
    mez, sr = sf.read(ruta or os.path.join(A, "mezcla.wav"), dtype="float64")
    if mez.ndim == 1: mez = np.stack([mez, mez], 1)
    v, _ = sf.read(os.path.join(A, "pista-voz.wav")); mu, _ = sf.read(os.path.join(A, "pista-musica.wav"))
    fx, _ = sf.read(os.path.join(A, "pista-efectos.wav"))
    fondo = (mu + fx) * 0.62
    met = pyln.Meter(sr, block_size=0.2)
    I = met.integrated_loudness(mez); pk = 20 * np.log10(np.abs(mez).max() + 1e-12)
    print(f"{video}: {len(mez)/sr:.2f} s · {I:.1f} LUFS integrados · pico {pk:.1f} dBFS (muestra)")

    import sherpa_onnx
    W = os.path.join(MOD, "sherpa-onnx-whisper-small")
    asr = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f"{W}/small-encoder.int8.onnx",
        decoder=f"{W}/small-decoder.int8.onnx", tokens=f"{W}/small-tokens.txt", language="es", task="transcribe", num_threads=2)
    malos = []; filas = []
    vs = M["voz"]
    for k, f in enumerate(vs):
        a, b = int(f["t0"] * sr), int(f["t1"] * sr)
        pre = min(0.08, (f["t0"] - vs[k - 1]["t1"]) / 2) if k else 0.08   # sin invadir la frase vecina
        post = min(0.12, (vs[k + 1]["t0"] - f["t1"]) / 2) if k + 1 < len(vs) else 0.12
        lv = met.integrated_loudness(v[a:b]) if b - a > 0.4 * sr else 20 * np.log10(np.sqrt(np.mean(v[a:b] ** 2)) + 1e-9)
        lf = met.integrated_loudness(fondo[a:b]) if b - a > 0.4 * sr else 20 * np.log10(np.sqrt(np.mean(fondo[a:b] ** 2)) + 1e-9)
        d = lv - lf
        # Whisper es inestable en los bordes (un corte 30 ms antes cambia «buscar» por «buscare», y la marca, que no
        # está en su vocabulario, baila): cada frase se transcribe con tres ventanas y cuenta la mediana.
        ventanas = [(pre, post), (0.0, 0.0), (pre / 2, post / 2)]
        res = []
        for p0, p1 in ventanas:
            a2, b2 = max(0, a - int(max(0, p0) * sr)), min(len(mez), b + int(max(0, p1) * sr))
            z = resample_poly(mez[a2:b2].mean(1), 16000, sr).astype(np.float32)
            s = asr.create_stream(); s.accept_waveform(16000, z); asr.decode_stream(s); o = s.result.text.strip()
            res.append((wer(sin_marca(f.get("texto", "")), sin_marca(o)), o))
        res.sort(key=lambda r: r[0]); e, oido = res[len(res) // 2]
        if "D-Code" in f.get("texto", "") and "cod" not in oido.lower(): e = max(e, 0.5)   # la marca tiene que oírse
        filas.append((f["id"], d, e, oido))
        if e > 0.15 or d < 6: malos.append(f["id"])
        print(f"  {f['id']:<4} voz−fondo {d:5.1f} LU · WER {e*100:5.1f} % · «{oido}»")
    # silencios
    env = np.abs(mez).max(1); hop = int(0.05 * sr)
    bajo = np.array([env[i:i + hop].max() < 10 ** (-50 / 20) for i in range(0, len(env), hop)])
    tramos = []; i = 0
    while i < len(bajo):
        if bajo[i]:
            j = i
            while j < len(bajo) and bajo[j]: j += 1
            if (j - i) * 0.05 >= 0.35: tramos.append((round(i * 0.05, 2), round(j * 0.05, 2)))
            i = j
        else: i += 1
    print(f"  silencios ≥ 0,35 s: {tramos or 'ninguno'}")
    print(f"  WER medio en la mezcla {np.mean([r[2] for r in filas])*100:.1f} % · voz−fondo mínimo "
          f"{min(r[1] for r in filas):.1f} LU" + (f" · REVISAR {malos}" if malos else " · todo en objetivo"))
    # figura
    import matplotlib; matplotlib.use("Agg"); import matplotlib.pyplot as plt
    fig, ax = plt.subplots(2, 1, figsize=(16, 6), sharex=True)
    t = np.arange(len(mez)) / sr
    ax[0].plot(t[::40], mez[::40, 0], lw=0.3, color="#333"); ax[0].plot(t[::40], v[::40, 0] * 0.8, lw=0.3, color="#2a6cff", alpha=.6)
    for f in M["voz"]: ax[0].axvspan(f["t0"], f["t1"], color="#5b8cff", alpha=.08)
    ax[1].specgram(mez.mean(1), NFFT=2048, Fs=sr, noverlap=1024, cmap="magma", vmin=-120); ax[1].set_ylim(0, 12000)
    ax[1].set_xlabel("s"); plt.tight_layout(); plt.savefig(os.path.join(A, "analisis.png"), dpi=80)
    json.dump({"lufs": I, "pico_dbfs": pk, "frases": [{"id": r[0], "voz_fondo_lu": round(r[1], 1), "wer": round(r[2], 3), "oido": r[3]} for r in filas],
               "silencios": tramos}, open(os.path.join(A, "analisis.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
