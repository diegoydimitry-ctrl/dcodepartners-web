# Prepara el material de un Reel: extrae a JPG, a 30 fps y a resolución completa, SOLO los tramos de las
# grabaciones que usa reel.json (así el render no decodifica vídeo), y el audio original de esos tramos.
#
#   python3 comun/prepara.py ia        (carpeta del Reel: ia/ o webs/)
#
# Salida: <reel>/cache/<id>/%05d.jpg · <reel>/cache/<id>/audio.wav · <reel>/cache/medios.json
import json, os, subprocess, sys
AQUI = os.path.dirname(os.path.abspath(__file__))
reel = sys.argv[1]; base = os.path.join(AQUI, "..", reel)
R = json.load(open(os.path.join(base, "reel.json"), encoding="utf-8"))
G = os.path.normpath(os.path.join(base, R.get("grabaciones", "../grabaciones")))
FPS = R.get("fps", 30); cache = os.path.join(base, "cache"); os.makedirs(cache, exist_ok=True)
medios = {}
def sonda(p):
    o = json.loads(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                                    "-of", "json", p], capture_output=True, text=True).stdout)["streams"][0]
    return o["width"], o["height"]
for s in R["segmentos"]:
    d = os.path.join(cache, s["id"]); os.makedirs(d, exist_ok=True)
    if s["tipo"] == "clip":
        src = os.path.join(G, s["fuente"]); w, h = sonda(src)
        firma = f'{s["fuente"]}|{s["in"]}|{s["dur"]}|{FPS}'
        hecho = os.path.join(d, "firma.txt")
        if not (os.path.exists(hecho) and open(hecho).read() == firma):
            for f in os.listdir(d): os.remove(os.path.join(d, f))
            vf = f"fps={FPS}" + (f",crop={s['recorte']}" if s.get("recorte") else "")
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(s["in"]), "-t", str(s["dur"] + 0.2), "-i", src,
                            "-vf", vf, "-q:v", "2", os.path.join(d, "%05d.jpg")], check=True)
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(s["in"]), "-t", str(s["dur"] + 0.2), "-i", src,
                            "-vn", "-ac", "2", "-ar", "48000", os.path.join(d, "audio.wav")])
            open(hecho, "w").write(firma)
        if s.get("recorte"): w, h = [int(v) for v in s["recorte"].split(":")[:2]]
        n = len([f for f in os.listdir(d) if f.endswith(".jpg")])
        medios[s["id"]] = {"tipo": "clip", "w": w, "h": h, "n": n, "ruta": f"cache/{s['id']}/"}
    elif s["tipo"] == "imagenes":
        imgs = []
        for i, f in enumerate(s["imagenes"]):
            dst = os.path.join(d, f"img{i}.jpg")
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", os.path.join(G, f), "-q:v", "2", dst], check=True)
            imgs.append(dict(zip(("w", "h"), sonda(dst)), ruta=f"cache/{s['id']}/img{i}.jpg"))
        medios[s["id"]] = {"tipo": "imagenes", "imagenes": imgs}
json.dump(medios, open(os.path.join(cache, "medios.json"), "w"), indent=1)
for k, v in medios.items(): print(k, v.get("n", ""), v.get("w", ""), v.get("h", ""))
