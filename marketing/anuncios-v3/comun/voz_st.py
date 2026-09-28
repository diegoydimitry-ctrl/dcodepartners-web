# Locución con Supertonic 3 (sherpa-onnx, modelo OpenRAIL-M), con casting automático por toma.
#
#   VOZ_ST=<carpeta del modelo> VOZ_MODELOS=<carpeta whisper> python3 comun/voz_st.py v1-youtube [id …]
#
# Por qué: la voz anterior (Kokoro) sonaba robótica. Supertonic 3 (2026, flow matching) entona mucho más: se mide
# como variación de tono (semitonos) — HIPÓTESIS útil: una voz plana (<2,5 st) se percibe «de máquina».
# Cada frase se genera varias veces (el modelo tiene azar) y a varias velocidades; se queda la toma que:
#   1) se entiende (Whisper sobre la toma: error 0 sin contar la marca), y
#   2) entre las que se entienden, tiene MÁS variación de tono y la duración más cercana a la pedida.
# Se sintetizan frases completas (no palabras sueltas): la entonación natural sale de la frase entera.
#
# guion.json: {"voz_st": {"sid": 6}, "frases": [{"id", "texto", "tts"?, "velocidades"?: [..], "tomas"?: n, "dur_max"?: s}]}
import json, os, re, sys, time
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
AQUI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, AQUI)
from voz import recorta, wer, MOD
ST = os.environ.get("VOZ_ST", os.path.join(AQUI, "..", "..", "..", ".modelos", "supertonic-3"))
SR = 48000

def sin_marca(t):
    ws = re.findall(r"[\wáéíóúñü%-]+", t)
    marca = lambda w: re.fullmatch(r"(?i)the|partners|compañeros|[\w-]*cod[\w-]*|dico|tico|cloud|decout", w) is not None
    fuera = {k for k, w in enumerate(ws) if marca(w)}
    fuera |= {k for k, w in enumerate(ws) if w.lower() == "de" and (k - 1 in fuera or k + 1 in fuera)}
    return " ".join(w for k, w in enumerate(ws) if k not in fuera)

def variacion_tono(x, sr):
    import librosa
    y = resample_poly(x, 16000, sr); f, v, _ = librosa.pyin(y, fmin=60, fmax=420, sr=16000, frame_length=1024)
    f = f[v & np.isfinite(f)]
    return (float(np.median(f)), float(np.std(12 * np.log2(f / np.median(f))))) if len(f) > 5 else (0.0, 0.0)

def main(video, solo=None):
    import sherpa_onnx as so
    base = os.path.join(AQUI, "..", video); g = json.load(open(os.path.join(base, "guion.json"), encoding="utf-8"))
    out = os.path.join(base, "voz"); os.makedirs(out, exist_ok=True)
    cfg = so.OfflineTtsConfig(model=so.OfflineTtsModelConfig(supertonic=so.OfflineTtsSupertonicModelConfig(
        duration_predictor=f"{ST}/duration_predictor.int8.onnx", text_encoder=f"{ST}/text_encoder.int8.onnx",
        vector_estimator=f"{ST}/vector_estimator.int8.onnx", vocoder=f"{ST}/vocoder.int8.onnx", tts_json=f"{ST}/tts.json",
        unicode_indexer=f"{ST}/unicode_indexer.bin", voice_style=f"{ST}/voice.bin"), num_threads=2))
    tts = so.OfflineTts(cfg)
    W = os.path.join(MOD, "sherpa-onnx-whisper-small")
    asr = so.OfflineRecognizer.from_whisper(encoder=f"{W}/small-encoder.int8.onnx", decoder=f"{W}/small-decoder.int8.onnx",
        tokens=f"{W}/small-tokens.txt", language="es", task="transcribe", num_threads=2)
    prev = os.path.join(out, "manifest.json")
    ant = {m["id"]: m for m in json.load(open(prev, encoding="utf-8"))["frases"]} if (solo and os.path.exists(prev)) else {}
    man = []
    for f in g["frases"]:
        if solo and f["id"] not in solo:
            man.append(ant[f["id"]]); continue
        texto_tts = f.get("tts", f["texto"]); sid = f.get("sid", g["voz_st"]["sid"])
        cands = []
        for vel in f.get("velocidades", g["voz_st"].get("velocidades", [1.0])):
            for k in range(f.get("tomas", g["voz_st"].get("tomas", 3))):
                gc = so.GenerationConfig(); gc.sid = sid; gc.speed = vel; gc.num_steps = g["voz_st"].get("pasos", 24); gc.extra = {"lang": "es"}
                a = tts.generate(texto_tts, gc); x = recorta(np.asarray(a.samples, np.float32), a.sample_rate, -50, 0.06)
                z = resample_poly(x, 16000, a.sample_rate).astype(np.float32); s = asr.create_stream(); s.accept_waveform(16000, z); asr.decode_stream(s)
                oido = s.result.text.strip(); e = wer(sin_marca(f["texto"]), sin_marca(oido))
                if "D-Code" in f["texto"] and "cod" not in oido.lower(): e = max(e, 0.5)
                f0, var = variacion_tono(x, a.sample_rate); d = len(x) / a.sample_rate
                cands.append({"vel": vel, "toma": k, "dur": round(d, 3), "wer": round(e, 3), "f0": round(f0), "var_st": round(var, 2), "oido": oido,
                              "x": resample_poly(x, SR, a.sample_rate).astype(np.float32)})
        dmax = f.get("dur_max", 99)
        buenos = [c for c in cands if c["wer"] == 0] or sorted(cands, key=lambda c: c["wer"])[:1]
        dentro = [c for c in buenos if c["dur"] <= dmax] or sorted(buenos, key=lambda c: c["dur"])[:1]
        mejor = max(dentro, key=lambda c: c["var_st"])
        sf.write(os.path.join(out, f"{f['id']}.wav"), mejor["x"], SR, subtype="FLOAT")
        info = {k: v for k, v in mejor.items() if k != "x"}
        man.append({"id": f["id"], "texto": f["texto"], "dur": round(len(mejor["x"]) / SR, 3), "oido": mejor["oido"], "wer": mejor["wer"],
                    "var_st": mejor["var_st"], "f0": mejor["f0"], "vel": mejor["vel"], "tomas": len(cands),
                    "alternativas": [{k: v for k, v in c.items() if k != "x"} for c in cands]})
        print(f"{f['id']:<4} {info['dur']:5.2f}s v={info['vel']} WER {info['wer']*100:4.1f}% tono ±{info['var_st']:.2f} st ({info['f0']} Hz) "
              f"· {len([c for c in cands if c['wer'] == 0])}/{len(cands)} tomas limpias «{info['oido']}»", flush=True)
    json.dump({"motor": "supertonic-3", "sid": g["voz_st"]["sid"], "sr": SR, "frases": man},
              open(os.path.join(out, "manifest.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

if __name__ == "__main__":
    main(sys.argv[1], set(sys.argv[2:]) or None)
