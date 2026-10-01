# Reel «Hazlo cansado» — guion definitivo de Dimitry. 1080×1920 / 30 fps / 45–50 s.
# GOGGINS → ESPEJO → TIEMPO PERDIDO → GOLPE → DECISIÓN → DISCIPLINA → FUTURO
#   python3 montar.py [--voz DIR] [--tempo 1.0] [--tono -1]
#   DIR contiene 01.wav … 22.wav (una frase por archivo, en el orden de GUION). Cambiar la voz = cambiar DIR.
import os, sys, json, subprocess, html, re, argparse
import numpy as np, soundfile as sf
AQUI = os.path.dirname(os.path.abspath(__file__)); os.chdir(AQUI)
ap = argparse.ArgumentParser(); ap.add_argument("--voz", default="medios/voz"); ap.add_argument("--tempo", type=float, default=1.0)
ap.add_argument("--tono", type=float, default=0.0); ap.add_argument("--salida", default="entrega/dcode-reel-hazlo-cansado.mp4"); ap.add_argument("--reusar", action="store_true")
ARG = ap.parse_args()
TMP = "tmp"; [os.makedirs(d, exist_ok=True) for d in (TMP, "entrega", "capas", "audio")]
def sh(c): return subprocess.run(c, shell=True, check=True, text=True, capture_output=True)
def dur(f): return float(sh(f"ffprobe -v error -show_entries format=duration -of csv=p=0 '{f}'").stdout)
FPS = 30
HOOK = [(9.55, 10.95), (12.42, 12.98)]        # «I'M BACK, MOTHERFUCKERS!» + «I'M BACK!!» (pocketsphinx KWS 9,65 s y 12,52 s)
HOOK_D = sum(b - a for a, b in HOOK)          # 1,96 s
CONGELA, NEGRO = 0.55, 0.25                   # cámara lenta/congelado con zoom → fundido a negro → la historia sale de la oscuridad
T_HIST = HOOK_D + CONGELA + NEGRO             # 2,76 s: primer plano de la historia

# (texto subtítulo, pausa tras la frase en s, clave = frase con tarjeta grande)
GUION = [
 ("Ahora *mírate.*", 0.25, False), ("Estás sentado.", 0.12, False), ("Mirando una pantalla.", 0.18, False),
 ("Diciéndote que *luego* vas a hacer lo que tienes que hacer.", 0.30, False),
 ("Pero «*luego*» se convierte en *mañana.*", 0.12, False), ("*Mañana* se convierte en el lunes.", 0.12, False),
 ("El lunes se convierte en el mes que viene.", 0.22, False), ("Y de repente han pasado *años.*", 0.75, False),
 ("Y mientras tú *esperas* a tener ganas…", 0.10, False),
 ("otra persona está haciendo exactamente lo que tú llevas meses diciendo que vas a hacer.", 0.30, False),
 ("Y deja de buscar *excusas.*", 0.18, False), ("No necesitas más motivación.", 0.12, False),
 ("No necesitas el lunes.", 0.12, False), ("No necesitas sentirte preparado.", 0.30, False),
 ("HAZLO *CANSADO.*", 0.16, True), ("HAZLO *SIN GANAS.*", 0.16, True), ("HAZLO *SOLO.*", 0.16, True),
 ("HAZLO CUANDO *NADIE* ESTÉ MIRANDO.", 0.75, True),
 ("Porque dentro de *cinco años* vas a ser diferente.", 0.55, False), ("La pregunta es…", 0.6, False),
 ("¿Vas a decidir *quién eres*…", 0.15, False), ("o vas a dejar que tus *hábitos* lo decidan por ti?", 0.0, False),
]
# qué ve el espectador mientras oye cada frase: (clip, segundo de entrada)
PLANOS = [
 [("H", 0.6)],                                   # mírate: cara iluminada por el móvil (sale de la oscuridad)
 [("S3", 1.0)],                                  # sentado en el sofá
 [("C", 1.2)],                                   # el pulgar haciendo scroll
 [("D", 1.0), ("G", 1.0), ("L", 1.5)],           # en la cama con el móvil · la mesa vacía · otra vez el móvil
 [("R2", 1.0), ("WU3", 1.0)],                    # reloj · otro día que empieza
 [("CA1", 1.0), ("B", 1.5)],                     # tachando días · apaga la alarma
 [("R3", 1.0), ("T1", 2.0), ("S2", 1.0)],        # reloj acelerado · cielo · mismo sofá, mismo móvil
 [("T2", 2.0), ("I", 1.0)],                      # días y noches · solo en la habitación
 [("S1", 1.0)],                                  # esperando
 [("O", 2.8), ("X", 1.0), ("AA", 1.0), ("PU2", 1.0), ("R", 1.0), ("E2", 1.0), ("PR2", 1.0), ("E3", 1.0)],  # otro actúa
 [("ES2", 1.0)],                                 # excusas: frente al espejo
 [("AD", 1.5)],                                  # no necesitas más motivación: al amanecer, ya en marcha
 [("AM1", 1.0)],                                 # no necesitas el lunes: trabajando un día cualquiera
 [("B1", 1.5)],                                  # no necesitas sentirte preparado: al saco
 [("AG1", 1.0)],                                 # HAZLO CANSADO: respira agotado
 [("E1", 1.0)],                                  # HAZLO SIN GANAS: estudiando de noche
 [("Q", 1.0)],                                   # HAZLO SOLO: caminando solo en la niebla
 [("PU1", 1.0)],                                 # HAZLO CUANDO NADIE ESTÉ MIRANDO: flexiones a oscuras
 [("AE", 1.5)],                                  # dentro de cinco años: amanecer
 [("ES4", 1.0)],                                 # la pregunta es…: el reflejo
 [("AG3", 1.0)],                                 # ¿vas a decidir quién eres…
 [("S2", 4.0), ("SU1", 1.0)],                    # o tus hábitos…: el sofá un instante → la cara sudada, de cerca
]
assert len(PLANOS) == len(GUION)
NIVEL = [.15, 0, 0, 0, .05, .05, .05, .05, .1, .45, .55, .6, .65, .7, .8, .85, .85, .85, 1, .9, .9, .9]
def grade(g):
    sat = 0.42 + 0.6 * g; bri = -0.035 + 0.07 * g; con = 1.05 + 0.08 * g
    rs, bs = -0.06 + 0.13 * g, 0.08 - 0.14 * g
    return (f"eq=contrast={con:.3f}:saturation={sat:.3f}:brightness={bri:.3f},"
            f"colorbalance=rm={rs:.3f}:bm={bs:.3f}:rh={rs/2:.3f}:bh={bs/2:.3f},vignette=PI/{4.2 + 2 * g:.2f}")

# ── 1) voz: frases en su sitio con pausas intencionales ──
partes, t, FR = [], T_HIST + 0.15, []
filtros_voz = []
if ARG.tono: filtros_voz.append(f"rubberband=pitch={2 ** (ARG.tono / 12):.4f}:formant=preserved")
if ARG.tempo != 1.0: filtros_voz.append(f"atempo={ARG.tempo}")
filtros_voz += ["silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02",
                "areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,areverse",
                "aresample=48000"]
for i, (txt, p, _) in enumerate(GUION):
    seg = f"{TMP}/v{i:02d}.wav"
    sh(f"ffmpeg -y -v error -i {ARG.voz}/{i+1:02d}.wav -af \"{','.join(filtros_voz)}\" -ac 1 {seg}")
    d = dur(seg); FR.append((t, t + d)); partes.append((seg, t)); t += d + p
CORTE = FR[-1][1] + 0.25; FIN = CORTE + 0.9          # último plano → negro → silencio breve
total = int(FIN * 48000); v = np.zeros(total)
for seg, t0 in partes:
    x, sr = sf.read(seg); a = int(t0 * 48000); v[a:a + len(x)] += x[: total - a]
sf.write(f"{TMP}/voz.wav", v, 48000)

ini = [max(T_HIST, a - 0.08) for a, _ in FR]; ini[0] = T_HIST - NEGRO  # el primer plano aparece desde el negro
fin = ini[1:] + [CORTE]
anclas = {"transicion": HOOK_D, "tiempo": ini[4], "golpe": ini[9], "excusas": ini[10], "hazlo": ini[14], "respiro": ini[18],
          "pregunta": ini[20], "corte": CORTE, "fin": FIN}
json.dump({"frases": FR, "escenas": list(zip(ini, fin)), "anclas": anclas, "golpes_medios": [11, 12, 13], "golpes_fuertes": [14, 15, 16, 17]},
          open("tiempos.json", "w"), indent=1)
print(f"duración total {FIN:.2f} s · historia desde {T_HIST:.2f} s · corte a negro {CORTE:.2f} s")

# ── 2) subtítulos: trozos cortos al ritmo de la voz; las 4 «Hazlo» en tarjeta grande ──
F_ = "../anuncios-v3/comun/fuentes/"
def marca(s): return re.sub(r"\*(.+?)\*", r'<span class="d">\1</span>', html.escape(s))
def trozos(txt, n=3):
    w = txt.split(); out, cur = [], []
    for x in w:
        cur.append(x)
        if len(cur) >= n or x.rstrip("*»").endswith((",", ".", "…", "?")): out.append(" ".join(cur)); cur = []
    if cur: out.append(" ".join(cur))
    res, abierto = [], False
    for c in out:
        c2 = ("*" if abierto and not c.startswith("*") else "") + c
        abierto = c2.count("*") % 2 == 1
        res.append(c2 + ("*" if abierto else ""))
    return [r.replace("**", "") for r in res]
def silabas(s): return max(1, len(re.findall(r"[aeiouáéíóúü]+", s.lower())))
caps, secs = [], []
for i, ((txt, _, grande), (a, b)) in enumerate(zip(GUION, FR)):
    if grande:
        caps.append((a - 0.05, fin[i] - 0.02, len(secs))); secs.append(f'<div class="grande">{marca(txt)}</div>'); continue
    tz = trozos(txt); tot = sum(silabas(x) for x in tz); t0 = a - 0.05
    for k, x in enumerate(tz):
        d = (b - a) * silabas(x) / tot
        t1 = t0 + d if k < len(tz) - 1 else min(fin[i] - 0.02, b + 0.3)
        caps.append((t0, t1, len(secs))); secs.append(f'<div class="sub">{marca(x)}</div>'); t0 += d
doc = f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:"Anton";src:url({F_}anton.woff2)}}
@font-face{{font-family:"Inter Tight";src:url({F_}inter-tight.woff2);font-weight:100 900}}
html,body{{margin:0;background:transparent}}
.pg{{position:relative;width:1080px;height:1920px;overflow:hidden}}
.sub{{position:absolute;left:70px;right:70px;top:1150px;font-family:"Inter Tight";font-weight:800;font-size:96px;line-height:1.04;
 color:#fff;text-align:center;letter-spacing:-2px;text-shadow:0 3px 24px rgba(0,0,0,.65),0 0 3px rgba(0,0,0,.45)}}
.grande{{position:absolute;left:50px;right:50px;top:700px;font-family:"Anton";font-size:200px;line-height:.98;color:#fff;
 text-align:center;text-shadow:0 4px 34px rgba(0,0,0,.6)}}
.d{{color:#F5B841}}
</style></head><body>{''.join(f'<section class="pg">{s}</section>' for s in secs)}</body></html>"""
open("subtitulos.html", "w").write(doc)
for f in os.listdir("capas"): os.remove(os.path.join("capas", f))
open(f"{TMP}/cap.cjs", "w").write("""const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
 await p.goto('file://' + process.cwd() + '/subtitulos.html'); await p.evaluate(() => document.fonts.ready);
 const e = await p.$$('.pg'); for (let i = 0; i < e.length; i++) await e[i].screenshot({ path: `capas/${String(i).padStart(3,'0')}.png`, omitBackground: true });
 await b.close(); })();""")
sh(f"node {TMP}/cap.cjs")

# ── 3) vídeo ──
lista = []
# 3a) Goggins: sus dos frases → la última imagen se ralentiza y se congela con un empuje de cámara, se apaga a gris y a negro
g = f"{TMP}/g.mp4"
(a0, a1), (b0, b1) = HOOK
fc = (f"[0:v]trim={a0}:{a1},setpts=PTS-STARTPTS[h0];[0:v]trim={b0}:{b1},setpts=PTS-STARTPTS[h1];"
      f"[0:v]trim={b1 - 0.12}:{b1},setpts=4*(PTS-STARTPTS),fps={FPS},tpad=stop_mode=clone:stop_duration={CONGELA + NEGRO}[lento];"
      f"[h0][h1]concat=n=2:v=1:a=0[hv];[hv]fps={FPS}[hv2];[hv2][lento]concat=n=2:v=1:a=0,split[x][y];"
      f"[x]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:2,eq=brightness=-0.22:saturation=0.7[bg];"
      f"[y]scale=-2:1240,crop=1080:1240:(iw-1080)*0.62:0,eq=contrast=1.12:saturation=1.1[fg];"
      f"[bg][fg]overlay=0:(H-h)/2,"
      f"zoompan=z='if(lt(it,{HOOK_D}),1,1+0.35*min(1,(it-{HOOK_D})/{CONGELA + NEGRO}))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps={FPS},"
      f"hue=s='if(lt(t,{HOOK_D}),1,max(0,1-(t-{HOOK_D})/{CONGELA}))',"
      f"fade=t=out:st={HOOK_D + 0.1:.3f}:d={CONGELA - 0.1:.3f},trim=end_frame={round((T_HIST - NEGRO) * FPS)},format=yuv420p[v]")
if not (ARG.reusar and os.path.exists(g)): sh(f"ffmpeg -y -v error -i medios/goggins.mp4 -filter_complex \"{fc}\" -map [v] -an -c:v libx264 -preset medium -crf 16 {g}")
lista.append(g)
# cortes cuantizados a fotogramas absolutos: sin deriva acumulada entre la voz, los planos y los subtítulos
for i, planos in enumerate(PLANOS):
    f0, f1 = round(ini[i] * FPS), round(fin[i] * FPS); nf = f1 - f0; n = len(planos)
    if i == len(PLANOS) - 1: reps = [(planos[0], 16, 0.0), (planos[1], nf - 16, NIVEL[i])]   # el sofá, un destello
    else:
        cortes = [round(nf * j / n) for j in range(n + 1)]
        reps = [(p, cortes[j + 1] - cortes[j], NIVEL[i]) for j, p in enumerate(planos)]
    for j, ((k, ss), nfj, gl) in enumerate(reps):
        dj = nfj / FPS
        out = f"{TMP}/e{i:02d}_{j}.mp4"; extra = ",fade=t=in:st=0:d=0.3" if i == 0 else ""
        if not (ARG.reusar and os.path.exists(out)): sh(f"ffmpeg -y -v error -stream_loop -1 -ss {ss} -i medios/clips/{k}.mp4 -t {dj:.4f} -vf "
           f"\"scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps={FPS},setsar=1,{grade(gl)}{extra},format=yuv420p\" "
           f"-frames:v {nfj} -an -c:v libx264 -preset medium -crf 16 {out}")
        lista.append(out)
negro = f"{TMP}/negro.mp4"
sh(f"ffmpeg -y -v error -f lavfi -i color=c=black:s=1080x1920:r={FPS}:d={(round(FIN * FPS) - round(CORTE * FPS)) / FPS:.4f} -c:v libx264 -pix_fmt yuv420p {negro}")
lista.append(negro)
open(f"{TMP}/lista.txt", "w").write("".join(f"file '{os.path.basename(x)}'\n" for x in lista))
sh(f"ffmpeg -y -v error -f concat -safe 0 -i {TMP}/lista.txt -c copy {TMP}/base.mp4")
from PIL import Image
yy = np.arange(1920)[:, None]; al = np.clip(0.42 * np.exp(-((yy - 1210) / 300.0) ** 2), 0, 1)
grad = np.zeros((1920, 1080, 4), np.uint8); grad[..., 3] = (al * 255).astype(np.uint8).repeat(1080, 1)
Image.fromarray(grad, "RGBA").save(f"{TMP}/banda-sub.png")
ins = f" -loop 1 -t {FIN:.2f} -i {TMP}/banda-sub.png" + "".join(f" -loop 1 -t {b + 0.1:.2f} -i capas/{k:03d}.png" for _, b, k in caps)
fcs, prev = [f"[0:v][1:v]overlay=enable='between(t,{T_HIST - NEGRO:.2f},{CORTE:.2f})':format=auto[gb]"], "[gb]"
for j, (a, b, k) in enumerate(caps):
    fcs.append(f"[{j+2}:v]format=rgba,fade=in:st={a:.3f}:d=0.06:alpha=1[c{j}]")
    fcs.append(f"{prev}[c{j}]overlay=enable='between(t,{a:.3f},{b:.3f})':format=auto:eof_action=pass[o{j}]"); prev = f"[o{j}]"
fcs.append(f"{prev}format=yuv420p[v]")
open(f"{TMP}/fc.txt", "w").write(";".join(fcs))
sh(f"ffmpeg -y -v error -i {TMP}/base.mp4{ins} -filter_complex_script {TMP}/fc.txt -map [v] -t {FIN:.3f} -c:v libx264 -preset medium -crf 16 {TMP}/video.mp4")

# ── 4) audio: Goggins con cola de reverberación + voz + banda ──
from scipy.signal import fftconvolve
raw = subprocess.run(f"ffmpeg -v error -i medios/goggins.mp4 -ac 2 -ar 48000 -f f32le -", shell=True, capture_output=True).stdout
gx = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(float)
gk = np.concatenate([gx[int(a * 48000):int(b * 48000)] for a, b in HOOK])
cola_n = int(48000 * 2.4); rng = np.random.default_rng(3); tt = np.arange(cola_n) / 48000
irr = np.stack([rng.standard_normal(cola_n) * np.exp(-tt * 3.0) for _ in range(2)], 1) * 0.05
ultimo = gk[-int(0.45 * 48000):]                                     # el último «BACK!!»
tail = np.stack([fftconvolve(ultimo[:, c], irr[:, c])[: cola_n] for c in range(2)], 1)
gog = np.zeros((int(FIN * 48000), 2)); gog[: len(gk)] += gk * 1.5
s0 = len(gk) - len(ultimo); gog[s0: s0 + len(tail)] += tail[: len(gog) - s0] * 1.2
f_ = int(0.03 * 48000); gog[len(gk) - f_: len(gk)] *= np.linspace(1, 0.35, f_)[:, None]   # la voz seca se apaga; queda la cola
sf.write(f"{TMP}/goggins.wav", np.clip(gog, -1, 1), 48000)
sh("python3 banda.py")
dly = 0
mezcla = (f"[0:a]aresample=48000,apad,atrim=0:{FIN:.3f}[gog];"
          f"[1:a]aresample=48000,highpass=f=75,acompressor=threshold=-21dB:ratio=2.8:attack=5:release=110,"
          f"equalizer=f=180:t=q:w=1:g=1.5,equalizer=f=3200:t=q:w=1.2:g=2.5,apad,atrim=0:{FIN:.3f},asplit[voz][vsc];"
          f"[2:a]aresample=48000,apad,atrim=0:{FIN:.3f},volume=0.62[mus];"
          f"[mus][vsc]sidechaincompress=threshold=0.035:ratio=5:attack=15:release=280:makeup=1[musd];"
          f"[3:a]aresample=48000,apad,atrim=0:{FIN:.3f},volume=0.7[fx];"
          f"[gog][voz][musd][fx]amix=inputs=4:normalize=0:duration=first,loudnorm=I=-14:TP=-1.2:LRA=11[a]")
sal = ARG.salida
sh(f"ffmpeg -y -v error -i {TMP}/goggins.wav -i {TMP}/voz.wav -i audio/musica.wav -i audio/efectos.wav -i {TMP}/video.mp4 "
   f"-filter_complex \"{mezcla}\" -map 4:v -map [a] -c:v libx264 -preset slow -crf 20 -maxrate 6M -bufsize 12M -profile:v high "
   f"-pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -movflags +faststart -t {FIN:.3f} {sal}")
lu = subprocess.run(f"ffmpeg -nostats -i {sal} -af ebur128 -f null -", shell=True, text=True, capture_output=True).stderr
I = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", lu)[-1])
sh(f"ffmpeg -y -v error -i {sal} -c:v copy -af volume={-14 - I:.2f}dB,alimiter=limit=0.87:level=disabled -c:a aac -b:a 192k -ar 48000 -movflags +faststart {TMP}/final.mp4")
os.replace(f"{TMP}/final.mp4", sal)
print(sh(f"ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate:format=duration,size -of compact {sal}").stdout)
sh(f"ffmpeg -v error -i {sal} -f null -")
lu = subprocess.run(f"ffmpeg -nostats -i {sal} -af ebur128=peak=true -f null -", shell=True, text=True, capture_output=True).stderr
print("\n".join(l for l in lu.splitlines()[-12:] if "I:" in l or "Peak" in l))
sh(f"ffmpeg -y -v error -i {sal} -vf \"fps=2,scale=150:-1,tile=12x9\" -frames:v 1 entrega/hoja-contactos.jpg")
print("OK", sal, round(dur(sal), 2), "s")
