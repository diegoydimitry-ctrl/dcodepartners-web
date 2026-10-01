# Reel «Dos futuros» — montaje completo 1080×1920 / 30 fps.
#   0–2 s   golpe: «I'M BACK…» (clip aportado por Dimitry) · corte seco
#   2 s →   historia en 2.ª persona: TÚ AHORA → TIEMPO PERDIDO → DECISIÓN → DISCIPLINA → TRANSFORMACIÓN → TU FUTURO
# Voz: ElevenLabs (Martin Osborne, turbo v2.5) → pausas comprimidas + atempo, medidas sobre la grabación real.
#   python3 montar.py
import os, json, subprocess, html, re
AQUI = os.path.dirname(os.path.abspath(__file__)); os.chdir(AQUI)
TMP = "tmp"; os.makedirs(TMP, exist_ok=True); os.makedirs("entrega", exist_ok=True); os.makedirs("capas", exist_ok=True)
def sh(c): return subprocess.run(c, shell=True, check=True, text=True, capture_output=True)
def dur(f): return float(sh(f"ffprobe -v error -show_entries format=duration -of csv=p=0 '{f}'").stdout)
FPS = 30
HOOK = [(9.55, 10.95), (12.42, 12.98)]            # «I'M BACK, MOTHERFUCKERS!» + «I'M BACK!!» (pocketsphinx KWS: 9,65 y 12,52 s)
HOOK_D = sum(b - a for a, b in HOOK)
VOZ_INI = HOOK_D + 0.30                            # la música entra en el corte; la voz, un respiro después
TEMPO = 1.04

# ── frases medidas en medios/voz.mp3 (silencedetect −38 dB / 0,15 s, asignadas a mano) ──
# (inicio, fin, pausa_despues, texto)   la pausa es la que dejamos tras comprimir
F = [
 (0.00, 1.39, 0.30, "Ahora imagínate *aquí.*"),
 (2.01, 2.66, 0.14, "Sentado,"),
 (3.00, 3.99, 0.30, "mirando el *móvil.*"),
 (4.59, 7.41, 0.32, "Tienes cosas que hacer, pero llevas otra hora de *scroll.*"),
 (8.01, 9.26, 0.40, "Y no parece *importante.*"),
 (9.87, 11.21, 0.40, "Pero repite *este día.*"),
 (11.74, 12.40, 0.55, "UN *AÑO.*"),
 (13.65, 14.31, 1.10, "*CINCO.*"),
 (15.20, 17.26, 0.40, "Ahora imagina *el otro camino.*"),
 (18.22, 19.68, 0.22, "Dejas el *móvil.*"),
 (20.23, 21.16, 0.10, "Te *levantas,*"),
 (21.56, 22.79, 0.26, "aunque estés *cansado.*"),
 (23.33, 24.02, 0.16, "*Estudias.*"),
 (24.41, 25.13, 0.16, "*Entrenas.*"),
 (25.51, 26.93, 0.28, "Construyes algo *tuyo.*"),
 (27.33, 28.12, 0.14, "Un *día.*"),
 (28.55, 29.22, 0.14, "Y *otro.*"),
 (29.54, 30.22, 0.40, "Y *otro.*"),
 (30.65, 32.12, 0.18, "Hasta que un día miras *atrás…*"),
 (32.49, 34.22, 3.20, "y ya no eres *el del móvil.*"),
 (34.58, 36.87, 0.75, "Dentro de cinco años vas a ser *otra persona.*"),
 (37.38, 38.80, 0.00, "TÚ DECIDES CUÁL."),
]
GRANDES = {6, 7, 21}                                 # índices con tarjeta grande (Anton)
COLA = 3.4                                           # lo que queda tras la última palabra
# ── planos por frase: (clip, segundo de entrada) ──
PLANOS = [
 [("S3", 1.0)], [("S2", 1.0)], [("C", 1.2)],
 [("H", 1.0), ("D", 1.0)],
 [("L", 1.5)],
 [("W1", 1.0), ("B", 1.5)],
 [("T1", 2.0)], [("T2", 2.0), ("I", 1.0)],
 [("W2", 1.0), ("O", 2.8)],
 [("S1", 4.0)],                      # deja el móvil en el sofá
 [("X", 1.0)], [("AA", 1.0), ("AD", 1.5)],
 [("E1", 1.0)], [("B1", 1.5)], [("K2", 1.5), ("M1", 1.5)],
 [("R", 1.0)], [("E2", 1.0), ("AB", 1.0)], [("S", 1.0), ("AF", 1.0)],
 [("C1", 1.5)], [("C4", 1.0), ("AE", 1.5), ("F1", 1.5), ("V2", 1.0), ("K1", 2.0)],   # + tramo instrumental de la transformación
 [("C2", 1.0), ("C3", 2.0)],
 [("S3", 3.5), ("AG", 1.0)],
]
assert len(PLANOS) == len(F), (len(PLANOS), len(F))
# etalonaje: 0 = gris/apagado (tú ahora) → 1 = luminoso (tu futuro)
NIVEL = [0, 0, 0, 0, 0, 0, 0, 0, .3, .4, .45, .5, .6, .65, .7, .78, .84, .9, 1, 1, 1, 1]
def grade(g):
    sat = 0.45 + 0.6 * g; bri = -0.07 + 0.09 * g; con = 1.03 + 0.07 * g
    rs, bs = -0.05 + 0.12 * g, 0.06 - 0.12 * g      # frío → cálido
    return (f"eq=contrast={con:.3f}:saturation={sat:.3f}:brightness={bri:.3f},"
            f"colorbalance=rm={rs:.3f}:bm={bs:.3f}:rh={rs/2:.3f}:bh={bs/2:.3f},vignette=PI/{4.5 + 2 * g:.2f}")

# ── 1) voz editada: cada frase a ritmo 1,07 y pausas comprimidas ──
partes, t, FR = [], VOZ_INI, []
for i, (a, b, p, txt) in enumerate(F):
    a2, b2 = max(0, a - 0.03), b + 0.05
    seg = f"{TMP}/v{i:02d}.wav"
    sh(f"ffmpeg -y -v error -ss {a2} -to {b2} -i medios/voz.mp3 -af atempo={TEMPO},afade=t=in:d=0.01,areverse,afade=t=in:d=0.02,areverse -ar 48000 -ac 1 {seg}")
    d = dur(seg); FR.append((t, t + d)); partes.append(seg); t += d
    if p > 0:
        sil = f"{TMP}/s{i:02d}.wav"; sh(f"ffmpeg -y -v error -f lavfi -i anullsrc=r=48000:cl=mono -t {p} {sil}"); partes.append(sil); t += p
FIN = FR[-1][1] + COLA
open(f"{TMP}/voz.txt", "w").write("".join(f"file '{os.path.basename(x)}'\n" for x in partes))
sh(f"ffmpeg -y -v error -f concat -safe 0 -i {TMP}/voz.txt -c pcm_s16le {TMP}/voz_editada.wav")

# cortes de plano: cada frase manda desde un poco antes de empezar (0,10 s) hasta la siguiente
ini = [max(HOOK_D, a - 0.10) for a, _ in FR]; ini[0] = HOOK_D
fin = ini[1:] + [FIN]
anclas = {"inicio": HOOK_D, "decision": ini[8], "disciplina": ini[9], "montaje": ini[15], "transformacion": FR[19][1] + 0.05,
          "final": ini[21], "fin": FIN}
json.dump({"frases": FR, "escenas": list(zip(ini, fin)), "anclas": anclas}, open("tiempos.json", "w"), indent=1)
print("duración total:", round(FIN, 2), "s · voz", round(FR[-1][1] - FR[0][0], 2), "s")

# ── 2) subtítulos y tarjetas (PNG transparentes) ──
F_ = "../anuncios-v3/comun/fuentes/"
def marca(s): return re.sub(r"\*(.+?)\*", r'<span class="d">\1</span>', html.escape(s))
def trozos(txt, n=4):
    w = txt.split(); out, cur = [], []
    for x in w:
        cur.append(x)
        if len(cur) >= n or x.rstrip("*").endswith((",", ".", "…")): out.append(" ".join(cur)); cur = []
    if cur: out.append(" ".join(cur))
    # arrastra los * abiertos entre trozos
    res, abierto = [], False
    for c in out:
        c2 = ("*" if abierto and not c.startswith("*") else "") + c
        abierto = c2.count("*") % 2 == 1
        res.append(c2 + ("*" if abierto else ""))
    return res
def silabas(s): return max(1, len(re.findall(r"[aeiouáéíóúü]+", s.lower())))
caps, secs = [], []
for i, (txt, (a, b)) in enumerate(zip([f[3] for f in F], FR)):
    if i in GRANDES:
        caps.append((a - 0.06, fin[i] if i < len(F) - 1 else FIN, len(secs))); secs.append(f'<div class="grande">{marca(txt)}</div>'); continue
    tz = trozos(txt); tot = sum(silabas(x) for x in tz); t0 = a - 0.06
    for k, x in enumerate(tz):
        d = (b - a) * silabas(x) / tot
        t1 = t0 + d if k < len(tz) - 1 else (fin[i] - 0.02 if fin[i] - b < 0.5 else b + 0.35)
        caps.append((t0, t1, len(secs))); secs.append(f'<div class="sub">{marca(x)}</div>'); t0 += d
doc = f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:"Anton";src:url({F_}anton.woff2)}}
@font-face{{font-family:"Inter Tight";src:url({F_}inter-tight.woff2);font-weight:100 900}}
html,body{{margin:0;background:transparent}}
.pg{{position:relative;width:1080px;height:1920px;overflow:hidden}}
.sub{{position:absolute;left:80px;right:80px;top:1180px;font-family:"Inter Tight";font-weight:800;font-size:88px;line-height:1.08;
 color:#fff;text-align:center;letter-spacing:-1.5px;text-shadow:0 3px 22px rgba(0,0,0,.6),0 0 3px rgba(0,0,0,.4)}}
.grande{{position:absolute;left:60px;right:60px;top:760px;font-family:"Anton";font-size:190px;line-height:1;color:#fff;
 text-align:center;text-shadow:0 4px 30px rgba(0,0,0,.55)}}
.d{{color:#F5B841}}
</style></head><body>{''.join(f'<section class="pg">{s}</section>' for s in secs)}</body></html>"""
open("subtitulos.html", "w").write(doc)
open(f"{TMP}/cap.cjs", "w").write("""const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
 await p.goto('file://' + process.cwd() + '/subtitulos.html'); await p.evaluate(() => document.fonts.ready);
 const e = await p.$$('.pg'); for (let i = 0; i < e.length; i++) await e[i].screenshot({ path: `capas/${String(i).padStart(3,'0')}.png`, omitBackground: true });
 await b.close(); })();""")
sh(f"node {TMP}/cap.cjs")

# ── 3) vídeo ──
lista = []
# 3a) golpe de Goggins: fondo desenfocado + plano ampliado, sin etalonaje de la historia
g = f"{TMP}/g.mp4"
partes_h = "".join(f"[0:v]trim={a}:{b},setpts=PTS-STARTPTS[h{j}];" for j, (a, b) in enumerate(HOOK))
sh(f"ffmpeg -y -v error -i medios/goggins.mp4 -filter_complex \"{partes_h}[h0][h1]concat=n=2:v=1:a=0,fps={FPS},split[x][y];"
   f"[x]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:2,eq=brightness=-0.22:saturation=0.7[bg];"
   f"[y]scale=-2:1240,crop=1080:1240:(iw-1080)*0.62:0,eq=contrast=1.12:saturation=1.1[fg];"
   f"[bg][fg]overlay=0:(H-h)/2,format=yuv420p[v]\" -map [v] -an -c:v libx264 -preset medium -crf 16 {g}")
lista.append(g)
for i, planos in enumerate(PLANOS):
    d = fin[i] - ini[i]; n = len(planos)
    if i == len(PLANOS) - 1:      # «Tú decides cuál»: destello del sofá (gris) y el otro futuro
        reps = [(planos[0], 0.45, 0.0), (planos[1], d - 0.45, 1.0)]
    else:
        reps = [(p, d / n, NIVEL[i]) for p in planos]
    for j, ((k, ss), dj, gl) in enumerate(reps):
        out = f"{TMP}/e{i:02d}_{j}.mp4"
        sh(f"ffmpeg -y -v error -stream_loop -1 -ss {ss} -i medios/clips/{k}.mp4 -t {dj:.4f} -vf "
           f"\"scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps={FPS},setsar=1,{grade(gl)},format=yuv420p\" "
           f"-an -c:v libx264 -preset medium -crf 16 {out}")
        lista.append(out)
open(f"{TMP}/lista.txt", "w").write("".join(f"file '{os.path.basename(x)}'\n" for x in lista))
sh(f"ffmpeg -y -v error -f concat -safe 0 -i {TMP}/lista.txt -c copy {TMP}/base.mp4")
# 3b) subtítulos encima (aparecen con un fundido muy corto)
ins = "".join(f" -loop 1 -t {b + 0.1:.2f} -i capas/{k:03d}.png" for _, b, k in caps)
fc, prev = [], "[0:v]"
for j, (a, b, k) in enumerate(caps):
    fc.append(f"[{j+1}:v]format=rgba,fade=in:st={a:.3f}:d=0.08:alpha=1[c{j}]")
    fc.append(f"{prev}[c{j}]overlay=enable='between(t,{a:.3f},{b:.3f})':format=auto:eof_action=pass[o{j}]"); prev = f"[o{j}]"
fc.append(f"{prev}format=yuv420p[v]")
open(f"{TMP}/fc.txt", "w").write(";".join(fc))
sh(f"ffmpeg -y -v error -i {TMP}/base.mp4{ins} -filter_complex_script {TMP}/fc.txt -map [v] -t {FIN:.3f} -c:v libx264 -preset medium -crf 16 {TMP}/video.mp4")

# ── 4) banda y mezcla ──
sh("python3 banda.py")
dly = int(VOZ_INI * 1000)
a0, a1 = HOOK[0]; b0, b1 = HOOK[1]
mezcla = (f"[0:a]atrim={a0}:{a1},asetpts=PTS-STARTPTS[g0];[0:a]atrim={b0}:{b1},asetpts=PTS-STARTPTS[g1];"
          f"[g0][g1]concat=n=2:v=0:a=1,aresample=48000,volume=1.6,afade=t=out:st={HOOK_D-0.02:.3f}:d=0.02,apad,atrim=0:{FIN:.3f}[gog];"
          f"[1:a]aresample=48000,highpass=f=80,acompressor=threshold=-20dB:ratio=2.6:attack=6:release=110,"
          f"equalizer=f=3200:t=q:w=1.2:g=2.5,adelay={dly}|{dly},apad,atrim=0:{FIN:.3f},asplit[voz][vsc];"
          f"[2:a]aresample=48000,apad,atrim=0:{FIN:.3f},volume=0.62[mus];"
          f"[mus][vsc]sidechaincompress=threshold=0.035:ratio=5:attack=15:release=300:makeup=1[musd];"
          f"[3:a]aresample=48000,apad,atrim=0:{FIN:.3f},volume=0.7[fx];"
          f"[gog][voz][musd][fx]amix=inputs=4:normalize=0:duration=first,loudnorm=I=-14:TP=-1.2:LRA=11[a]")
sal = "entrega/dcode-reel-dos-futuros.mp4"
sh(f"ffmpeg -y -v error -i medios/goggins.mp4 -i {TMP}/voz_editada.wav -i audio/musica.wav -i audio/efectos.wav -i {TMP}/video.mp4 "
   f"-filter_complex \"{mezcla}\" -map 4:v -map [a] -c:v libx264 -preset slow -crf 20 -maxrate 6M -bufsize 12M -profile:v high "
   f"-pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -movflags +faststart -t {FIN:.3f} {sal}")
# segunda pasada de sonoridad (la primera se queda corta): ganancia medida + limitador a −1,2 dBTP
lu = subprocess.run(f"ffmpeg -nostats -i {sal} -af ebur128 -f null -", shell=True, text=True, capture_output=True).stderr
I = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", lu)[-1])
sh(f"ffmpeg -y -v error -i {sal} -c:v copy -af volume={-14 - I:.2f}dB,alimiter=limit=0.87:level=disabled -c:a aac -b:a 192k -ar 48000 -movflags +faststart {TMP}/final.mp4")
os.replace(f"{TMP}/final.mp4", sal)
# verificación
print(sh(f"ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate:format=duration,size -of compact {sal}").stdout)
sh(f"ffmpeg -v error -i {sal} -f null -")
lu = subprocess.run(f"ffmpeg -nostats -i {sal} -af ebur128=peak=true -f null -", shell=True, text=True, capture_output=True).stderr
print("\n".join(l for l in lu.splitlines()[-12:] if "I:" in l or "Peak" in l))
sh(f"ffmpeg -y -v error -i {sal} -vf \"fps=1.5,scale=180:-1,tile=10x7\" -frames:v 1 entrega/hoja-contactos.jpg")
print("OK", sal, round(dur(sal), 2), "s")
