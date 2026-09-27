# Multiplexa imagen + mezcla con la sonoridad de entrega y mide el resultado.
#
#   python3 comun/final.py v1-youtube dcode-ruido-youtube-16x9
#
# Sonoridad: loudnorm de dos pasadas a −14 LUFS integrados (lo que normalizan YouTube e Instagram), pico real
# pedido −1,6 dBTP para que tras el AAC quede por debajo de −1 dBTP. Después se mide el MP4 ya codificado.
import json, os, re, subprocess, sys
AQUI = os.path.dirname(os.path.abspath(__file__))
v, nombre = sys.argv[1], sys.argv[2]
base = os.path.join(AQUI, "..", v); ent = os.path.join(base, "entrega"); os.makedirs(ent, exist_ok=True)
img, mez = os.path.join(base, "render", "imagen.mp4"), os.path.join(base, "audio", "mezcla.wav")
dest = os.path.join(ent, f"{nombre}.mp4")

def corre(a): return subprocess.run(a, capture_output=True, text=True)
filt = "loudnorm=I=-14:TP=-1.6:LRA=11"
r = corre(["ffmpeg", "-hide_banner", "-i", mez, "-af", filt + ":print_format=json", "-f", "null", "-"])
m = json.loads(r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1])
f2 = (f"{filt}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
      f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
r = corre(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", img, "-i", mez, "-map", "0:v", "-map", "1:a",
           "-c:v", "copy", "-af", f2 + ",aresample=48000", "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-shortest",
           "-movflags", "+faststart", dest])
if r.returncode: print(r.stderr); sys.exit(1)
# medición del entregable
r = corre(["ffmpeg", "-hide_banner", "-nostats", "-i", dest, "-filter_complex", "ebur128=peak=true", "-f", "null", "-"])
I = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)[-1]); TP = float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", r.stderr)[-1])
p = json.loads(corre(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", dest]).stdout)
vs = next(s for s in p["streams"] if s["codec_type"] == "video"); a = next(s for s in p["streams"] if s["codec_type"] == "audio")
nf = int(corre(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", dest]).stdout.strip())
info = {"archivo": os.path.relpath(dest, os.path.join(AQUI, "..")), "duracion_s": round(float(p["format"]["duration"]), 3),
        "video": f"{vs['codec_name']} {vs['width']}×{vs['height']} {vs['r_frame_rate']} fps · {nf} fotogramas · {vs['pix_fmt']}",
        "audio": f"{a['codec_name']} {a['sample_rate']} Hz {a['channels']} canales {int(a.get('bit_rate', 0))//1000} kb/s",
        "lufs_integrados": I, "pico_real_dbtp": TP, "tamano_mb": round(os.path.getsize(dest) / 1e6, 1)}
json.dump(info, open(os.path.join(ent, f"{nombre}.medidas.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for k, x in info.items(): print(f"  {k:<16} {x}")
ok = abs(I + 14) <= 0.5 and TP <= -1.0
print("  → sonoridad y pico en objetivo" if ok else "  → REVISAR sonoridad / pico")
