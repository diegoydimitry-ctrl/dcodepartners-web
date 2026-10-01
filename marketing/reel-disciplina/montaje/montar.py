# Monta el Reel final «Deja de negociar contigo» (1080×1920, 30 fps) a partir de:
#   medios/voz.mp3                 locución ElevenLabs (Martin Osborne, turbo v2.5)
#   medios/clips/<LETRA>.mp4       planos reales de Pexels (ver plan.py: letra → id)
# 1) mide la voz real (silencedetect) y recalcula los cortes de página → tiempos.json
# 2) regenera música/efectos con esos cortes (banda.py) y las capas de texto (overlays.cjs)
# 3) cada página: planos recortados a 9:16 + etalonaje sobrio + texto → concat
# 4) mezcla voz + música (con ducking) + efectos, −14 LUFS → entrega/…mp4 y verificación
#   python3 montar.py            (medios reales)      python3 montar.py --prueba  (medios sintéticos)
import os, sys, json, re, subprocess, shutil
from plan import P, A, VOZ_OFFSET
AQUI = os.path.dirname(os.path.abspath(__file__)); os.chdir(AQUI)
PRUEBA = "--prueba" in sys.argv
MED = "medios-prueba" if PRUEBA else "medios"
TMP = "tmp"; os.makedirs(TMP, exist_ok=True); os.makedirs("entrega", exist_ok=True)
def sh(c, **k): return subprocess.run(c, shell=True, check=True, text=True, capture_output=True, **k)
def dur(f): return float(sh(f"ffprobe -v error -show_entries format=duration -of csv=p=0 '{f}'").stdout)

if PRUEBA:  # medios sintéticos para probar la cadena entera
    os.makedirs(f"{MED}/clips", exist_ok=True)
    for i, k in enumerate(A):
        f = f"{MED}/clips/{k}.mp4"
        if not os.path.exists(f):
            size = "3840x2160" if i % 3 else "2160x3840"
            sh(f"ffmpeg -y -v error -f lavfi -i testsrc2=s={size}:r=25:d=6 -c:v libx264 -preset ultrafast '{f}'")
    if not os.path.exists(f"{MED}/voz.mp3"):  # 18 «frases» de tono con los tiempos estimados
        from tiempos import out
        parts = "+".join(f"between(t,{a:.2f},{b:.2f})" for a, b, _ in out)
        sh(f"ffmpeg -y -v error -f lavfi -i \"aevalsrc='0.3*sin(2*PI*180*t)*({parts})':s=44100:d=73.5\" '{MED}/voz.mp3'")

# ── 1) medir la voz ──
voz = f"{MED}/voz.mp3"; DV = dur(voz)
if os.path.exists("alineacion.json") and not PRUEBA:   # alineación medida y revisada a mano
    al = json.load(open("alineacion.json")); fr = [tuple(x) for x in al["frases"]]; c5 = [tuple(x) for x in al["citas"]]
    gancho = al["corte_gancho"]
else:
    r = subprocess.run(f"ffmpeg -nostats -i '{voz}' -af silencedetect=noise=-38dB:d=0.28 -f null -", shell=True, text=True, capture_output=True).stderr
    ini = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r)]; fin = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r)]
    sil = [(a, b) for a, b in zip(ini, fin) if a > 0.05 and b < DV - 0.05]       # huecos internos
    habla0 = fin[0] if ini and ini[0] <= 0.05 else 0.0
    habla1 = ini[-1] if len(ini) > len(fin) or (ini and ini[-1] > fin[-1]) else DV
    grandes = sorted(sorted(sil, key=lambda s: s[1] - s[0], reverse=True)[:17])  # 17 cortes entre las 18 frases
    if len(grandes) < 17: sys.exit(f"solo {len(grandes)} pausas detectadas: revisar umbral")
    fr = []; t = habla0
    for a, b in grandes: fr.append((t, a)); t = b
    fr.append((t, habla1))
    # frase 5 = tres citas: sus dos pausas internas más largas
    c5 = sorted(sorted([s for s in sil if fr[4][0] < s[0] < fr[4][1]], key=lambda s: s[1] - s[0], reverse=True)[:2])
    gancho = fr[0][0] + min(1.9, (fr[0][1] - fr[0][0]) * 0.45)
o = VOZ_OFFSET; mid = lambda i: o + (fr[i][1] + fr[i + 1][0]) / 2
cortes = [0.0, o + gancho]                      # p1 | p2 dentro de la frase 1
cortes += [mid(0), mid(1), mid(2), mid(3)]                                                    # p3 p4 p5 p6
cortes += [o + (c5[0][0] + c5[0][1]) / 2 if len(c5) == 2 else mid(3) + 1.97,
           o + (c5[1][0] + c5[1][1]) / 2 if len(c5) == 2 else mid(3) + 4.32]                  # p7 p8
cortes += [mid(i) for i in range(4, 17)]                                                      # p9 … p21
cortes += [o + fr[17][1] + 0.55]                                                              # p22 (tarjeta final)
FIN = cortes[-1] + 3.6
pags = [(round(cortes[i], 3), round(cortes[i + 1] if i + 1 < len(cortes) else FIN, 3)) for i in range(len(cortes))]
assert len(pags) == len(P), (len(pags), len(P))
json.dump({"voz": voz, "duracion_voz": DV, "frases": fr, "paginas": pags}, open("tiempos.json", "w"), indent=1)
print("frases medidas:", [(round(a, 2), round(b, 2)) for a, b in fr])

# ── 2) banda y capas con los cortes medidos ──
sh("python3 banda.py"); sh("python3 textos.py"); sh("node overlays.cjs")

# ── 3) vídeo por páginas ──
GRADE = "eq=contrast=1.06:saturation=0.82:brightness=-0.035:gamma=0.97,vignette=PI/5"
lista = []
for i, ((a, b), p) in enumerate(zip(pags, P), 1):
    planos = p[2]; d = b - a; n = len(planos); seg = f"{TMP}/p{i:02d}.mp4"
    ins, fc = "", []
    for j, k in enumerate(planos):
        dj = d / n
        ins += f" -stream_loop -1 -ss 1.0 -t {dj + 0.05:.3f} -i '{MED}/clips/{k}.mp4'"
        fc.append(f"[{j}:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,setsar=1,"
                  f"trim=duration={dj:.4f},setpts=PTS-STARTPTS,{GRADE}[v{j}]")
    fc.append("".join(f"[v{j}]" for j in range(n)) + f"concat=n={n}:v=1:a=0[base]")
    oscurece = 0.50 if i == 14 else 0.30 if i in (1, 2, 18, 19, 22) else 0.22
    fc.append(f"color=c=black@{oscurece}:s=1080x1920:r=30:d={d:.3f},format=rgba[osc]")
    fc.append("[base][osc]overlay=format=auto[b2]")
    fc.append(f"[{n}:v]format=rgba,fade=in:st=0:d=0.14:alpha=1[txt]")
    fc.append(f"[b2][txt]overlay=format=auto,format=yuv420p,trim=duration={d:.4f}[out]")
    sh(f"ffmpeg -y -v error{ins} -loop 1 -t {d:.3f} -i capas/{i:02d}.png -filter_complex \"{';'.join(fc)}\" "
       f"-map [out] -r 30 -c:v libx264 -preset medium -crf 17 -pix_fmt yuv420p '{seg}'")
    lista.append(seg)
open(f"{TMP}/lista.txt", "w").write("".join(f"file '{os.path.basename(s)}'\n" for s in lista))
sh(f"ffmpeg -y -v error -f concat -safe 0 -i {TMP}/lista.txt -c copy {TMP}/video.mp4")
DVID = dur(f"{TMP}/video.mp4")

# ── 4) mezcla y exportación ──
ms = int(VOZ_OFFSET * 1000)
mezcla = (f"[0:a]aresample=48000,highpass=f=80,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120,"
          f"equalizer=f=3500:t=q:w=1.2:g=2,adelay={ms}|{ms},apad,atrim=0:{DVID:.3f},volume=1.0[voz];"
          f"[voz]asplit[voz1][voz2];"
          f"[1:a]aresample=48000,atrim=0:{DVID:.3f},volume=0.55[mus];"
          f"[mus][voz2]sidechaincompress=threshold=0.04:ratio=6:attack=20:release=380:makeup=1[musd];"
          f"[2:a]aresample=48000,atrim=0:{DVID:.3f},volume=0.6[fx];"
          f"[voz1][musd][fx]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-14:TP=-1.0:LRA=9[a]")
NOMBRE = "dcode-reel-deja-de-negociar-PRUEBA.mp4" if PRUEBA else "dcode-reel-deja-de-negociar.mp4"
sal = f"entrega/{NOMBRE}"
sh(f"ffmpeg -y -v error -i '{voz}' -i audio/musica.wav -i audio/efectos.wav -i {TMP}/video.mp4 "
   f"-filter_complex \"{mezcla}\" -map 3:v -map [a] -c:v libx264 -preset slow -crf 19 -maxrate 9M -bufsize 18M "
   f"-profile:v high -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -movflags +faststart -shortest '{sal}'")
# verificación: metadatos, decodificación completa, sonoridad y hoja de contactos
info = sh(f"ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate:format=duration,size -of json '{sal}'").stdout
sh(f"ffmpeg -v error -i '{sal}' -f null -")
lu = subprocess.run(f"ffmpeg -nostats -i '{sal}' -af ebur128=peak=true -f null -", shell=True, text=True, capture_output=True).stderr
print(info); print("\n".join(l for l in lu.splitlines()[-12:] if "I:" in l or "Peak" in l or "LRA:" in l))
sh(f"ffmpeg -y -v error -i '{sal}' -vf \"fps=1/3,scale=270:-1,tile=6x5\" -frames:v 1 entrega/hoja-contactos{'-prueba' if PRUEBA else ''}.jpg")
print("OK →", sal, f"{dur(sal):.2f} s")
