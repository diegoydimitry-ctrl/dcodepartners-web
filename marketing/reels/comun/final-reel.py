# Multiplexa imagen + mezcla a −14 LUFS (loudnorm de dos pasadas, pico real ≤ −1 dBTP) y mide el resultado.
#
#   python3 comun/final-reel.py ia dcode-reel-5-ia-2026            → entrega/<nombre>.mp4 y entrega/<nombre>-sin-musica.mp4
import json, os, re, subprocess, sys
AQUI = os.path.dirname(os.path.abspath(__file__))
reel, nombre = sys.argv[1], sys.argv[2]
base = os.path.join(AQUI, "..", reel); ent = os.path.join(base, "entrega"); os.makedirs(ent, exist_ok=True)
img = os.path.join(base, "render", "imagen.mp4")
def corre(a): return subprocess.run(a, capture_output=True, text=True)
def mux(mez, dest):
    filt = "loudnorm=I=-14:TP=-1.6:LRA=11"
    r = corre(["ffmpeg", "-hide_banner", "-i", mez, "-af", filt + ":print_format=json", "-f", "null", "-"])
    m = json.loads(r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1])
    f2 = (f"{filt}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
          f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    r = corre(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", img, "-i", mez, "-map", "0:v", "-map", "1:a", "-c:v", "copy",
               "-af", f2 + ",aresample=48000", "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-shortest", "-movflags", "+faststart", dest])
    if r.returncode: print(r.stderr); sys.exit(1)
    r = corre(["ffmpeg", "-hide_banner", "-nostats", "-i", dest, "-filter_complex", "ebur128=peak=true", "-f", "null", "-"])
    I = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)[-1]); TP = float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", r.stderr)[-1])
    p = json.loads(corre(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", dest]).stdout)
    vs = next(s for s in p["streams"] if s["codec_type"] == "video")
    return {"archivo": os.path.basename(dest), "duracion_s": round(float(p["format"]["duration"]), 2), "video": f"{vs['width']}×{vs['height']} {vs['r_frame_rate']}",
            "lufs": I, "pico_dbtp": TP, "mb": round(os.path.getsize(dest) / 1e6, 1)}
info = [mux(os.path.join(base, "audio", "mezcla.wav"), os.path.join(ent, f"{nombre}.mp4")),
        mux(os.path.join(base, "audio", "mezcla-sin-musica.wav"), os.path.join(ent, f"{nombre}-sin-musica.mp4"))]
json.dump(info, open(os.path.join(ent, f"{nombre}.medidas.json"), "w"), ensure_ascii=False, indent=1)
for i in info: print(i)
