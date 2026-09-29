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
        # cursor: el registro real de la «mano» durante la grabación (ms desde el inicio) → tramo del segmento, en 0–1
        log = os.path.join(G, s["fuente"].rsplit(".", 1)[0] + ".json")
        if s.get("cursor") and os.path.exists(log):
            L = json.load(open(log))["log"]; ini = next((e for e in L if e.get("ev") == "inicio"), {})
            vw, vh = ini.get("vw", w), ini.get("vh", h); pts = []; ult = None
            for e in L:
                if "x" not in e: continue
                tt = e["t"] / 1000 - s["in"]
                if tt < 0: ult = e; continue
                if tt > s["dur"] + 0.3: break
                pts.append({"t": round(tt, 3), "x": round(e["x"] / vw, 4), "y": round(e["y"] / vh, 4), "c": e["ev"] == "clic"})
            if ult: pts.insert(0, {"t": 0, "x": round(ult["x"] / vw, 4), "y": round(ult["y"] / vh, 4), "c": False})
            medios[s["id"]]["cursor"] = pts
        if s.get("cursor_fijo"): medios[s["id"]]["cursor"] = [{"t": 0, "x": s["cursor_fijo"][0], "y": s["cursor_fijo"][1], "c": False}]
    elif s["tipo"] == "imagenes":
        imgs = []
        for i, f in enumerate(s["imagenes"]):
            dst = os.path.join(d, f"img{i}.jpg")
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", os.path.join(G, f), "-q:v", "2", dst], check=True)
            imgs.append(dict(zip(("w", "h"), sonda(dst)), ruta=f"cache/{s['id']}/img{i}.jpg"))
        medios[s["id"]] = {"tipo": "imagenes", "imagenes": imgs}
json.dump(medios, open(os.path.join(cache, "medios.json"), "w"), indent=1)
for k, v in medios.items(): print(k, v.get("n", ""), v.get("w", ""), v.get("h", ""))
