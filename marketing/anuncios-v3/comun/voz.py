# Genera la locución de un anuncio frase a frase y la verifica.
#
#   python3 comun/voz.py v1-youtube [id …]   (o v2-vendedores; con ids, solo esas frases)
#
# Lee <vídeo>/guion.json, sintetiza cada frase con Kokoro-82M (local, Apache-2.0), recorta el silencio de los
# extremos, la remuestrea a 48 kHz y la escribe en <vídeo>/voz/<id>.wav. Después transcribe cada frase con
# Whisper small (local) y mide el error frente al texto: una frase que no se entiende no pasa.
#
# Por qué frase a frase: una locución leída de corrido sale con la cadencia uniforme de una lectura. Frase a
# frase, cada una entra en su tiempo, con las pausas que decide el montaje, y se puede repetir solo la que falle.
#
# Modelos: variable de entorno VOZ_MODELOS (carpeta con kokoro-v1.0.onnx, voices-v1.0.bin y
# sherpa-onnx-whisper-small/). Se descargan de GitHub Releases:
#   thewh1teagle/kokoro-onnx  → model-files-v1.0/{kokoro-v1.0.onnx, voices-v1.0.bin}
#   k2-fsa/sherpa-onnx        → asr-models/sherpa-onnx-whisper-small.tar.bz2
import json, os, re, sys, unicodedata
import numpy as np, soundfile as sf
from scipy.signal import resample_poly

AQUI = os.path.dirname(os.path.abspath(__file__))
MOD = os.environ.get("VOZ_MODELOS", os.path.join(AQUI, "..", "..", "..", ".modelos"))
SR = 48000

def recorta(x, sr, umbral_db=-52, margen=0.075):
    """Quita el silencio de los extremos dejando un margen corto, para que la frase entre en su tiempo exacto."""
    env = np.abs(x)
    u = 10 ** (umbral_db / 20) * env.max()
    idx = np.where(env > u)[0]
    if len(idx) == 0: return x
    a = max(0, idx[0] - int(margen * sr)); b = min(len(x), idx[-1] + int(margen * sr))
    y = x[a:b].copy()
    f = int(0.006 * sr)                       # fundido mínimo: nada de chasquidos en los cortes
    y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f)
    return y

def norm(t):
    t = unicodedata.normalize("NFD", t.lower()); t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    t = re.sub(r"50\s*%", " cincuenta por ciento ", t).replace("d-code", "dicode")
    t = re.sub(r"\b30\b", " treinta ", t); t = re.sub(r"\b50\b", " cincuenta ", t)
    t = re.sub(r"\b(decode|de code|dicode|di code|dicoud)\b", "dicode", t)
    t = t.replace("v", "b")   # en español b y v suenan igual: Whisper escribe «bende» por «vende»
    return re.sub(r"[^a-z0-9ñ ]+", " ", t).split()

def wer(ref, hyp):
    r, h = norm(ref), norm(hyp)
    d = np.zeros((len(r) + 1, len(h) + 1), int); d[:, 0] = range(len(r) + 1); d[0, :] = range(len(h) + 1)
    for i in range(1, len(r) + 1):
        for j in range(1, len(h) + 1):
            d[i, j] = min(d[i - 1, j] + 1, d[i, j - 1] + 1, d[i - 1, j - 1] + (r[i - 1] != h[j - 1]))
    return d[len(r), len(h)] / max(1, len(r))

def main(video, solo=None):
    from kokoro_onnx import Kokoro
    import sherpa_onnx
    base = os.path.join(AQUI, "..", video)
    g = json.load(open(os.path.join(base, "guion.json"), encoding="utf-8"))
    out = os.path.join(base, "voz"); os.makedirs(out, exist_ok=True)
    k = Kokoro(os.path.join(MOD, "kokoro-v1.0.onnx"), os.path.join(MOD, "voices-v1.0.bin"))
    W = os.path.join(MOD, "sherpa-onnx-whisper-small")
    asr = sherpa_onnx.OfflineRecognizer.from_whisper(
        encoder=f"{W}/small-encoder.int8.onnx", decoder=f"{W}/small-decoder.int8.onnx",
        tokens=f"{W}/small-tokens.txt", language="es", task="transcribe", num_threads=2)
    prev = os.path.join(out, "manifest.json")
    ant = {m["id"]: m for m in json.load(open(prev, encoding="utf-8"))["frases"]} if (solo and os.path.exists(prev)) else {}
    man = []
    for f in g["frases"]:
        if solo and f["id"] not in solo:
            man.append(ant[f["id"]]); continue
        v = f.get("velocidad", g.get("velocidad", 1.0))
        x, sr0 = k.create(f["tts"], voice=f.get("voz", g["voz"]), speed=v, lang="es")
        x = recorta(np.asarray(x, dtype=np.float32), sr0)
        y = resample_poly(x, SR, sr0).astype(np.float32)
        p = os.path.join(out, f"{f['id']}.wav"); sf.write(p, y, SR, subtype="FLOAT")
        # verificación: ¿se entiende?
        z = resample_poly(x, 16000, sr0).astype(np.float32)
        s = asr.create_stream(); s.accept_waveform(16000, z); asr.decode_stream(s)
        oido = s.result.text.strip()
        e = wer(f["texto"], oido)
        man.append({"id": f["id"], "texto": f["texto"], "dur": round(len(y) / SR, 3), "oido": oido, "wer": round(e, 3)})
        print(f"{f['id']:<4} {len(y)/SR:5.2f} s  WER {e*100:5.1f} %  «{oido}»")
    json.dump({"voz": g["voz"], "sr": SR, "frases": man}, open(os.path.join(out, "manifest.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    tot = sum(m["dur"] for m in man); malos = [m["id"] for m in man if m["wer"] > 0.15]
    print(f"\n{len(man)} frases · {tot:.1f} s de voz · WER medio {np.mean([m['wer'] for m in man])*100:.1f} %"
          + (f" · REVISAR: {', '.join(malos)}" if malos else " · todas por debajo del 15 %"))

if __name__ == "__main__":
    main(sys.argv[1], set(sys.argv[2:]) or None)   # ids opcionales: regenera solo esas frases
