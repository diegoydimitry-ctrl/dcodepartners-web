# Banda sonora de un Reel: música electrónica/ambiental propia (sin samples de terceros) que crece segmento a
# segmento, diseño sonoro discreto atado al montaje (golpe inicial, cambios de plano, rótulos, clics reales de la
# grabación) y el audio original de las grabaciones cuando aporta (la canción de ElevenLabs, el sonido de una web).
#
#   python3 comun/audio-reel.py ia
#
# Salida: <reel>/audio/mezcla.wav (todo) · <reel>/audio/mezcla-sin-musica.wav (efectos + audio original)
import json, os, sys
import numpy as np, soundfile as sf
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, "..", "..", "anuncios-v3", "comun"))
from sintesis import *

reel = sys.argv[1]; base = os.path.join(AQUI, "..", reel)
R = json.load(open(os.path.join(base, "reel.json"), encoding="utf-8"))
t = 0; SEG = []
for s in R["segmentos"]: SEG.append({**s, "t0": t, "t1": t + s["dur"]}); t += s["dur"]
T_CIERRE = t; DUR = t + R.get("cierre", {}).get("dur", 3)
BPM = R.get("bpm", 120); BEAT = 60 / BPM; COMPAS = 4 * BEAT
HOOK = R.get("gancho", {}).get("hasta", 2.0)
def hz(m): return 440 * 2 ** ((m - 69) / 12)
OUT = os.path.join(base, "audio"); os.makedirs(OUT, exist_ok=True)
mus, sfx, nat = Pista(DUR), Pista(DUR), Pista(DUR)
ir = ir_sala(1.6, 6500, 0.015, 9)

# ─── música: Fm9 · Db · Ab · Eb (oscura y moderna), 4 compases que se repiten; cada segmento suma una capa ───
prog_ = [(41, [56, 60, 63, 67]), (37, [56, 60, 65, 68]), (44, [55, 60, 63, 68]), (39, [55, 58, 63, 67])]
def energia(tt):
    if tt < HOOK: return 0
    if tt >= T_CIERRE: return -1
    grupos = list(dict.fromkeys(s.get("g", s["id"]) for s in SEG))
    s = next((s for s in SEG if s["t0"] <= tt < s["t1"]), SEG[0]); i = grupos.index(s.get("g", s["id"]))
    return 1 + min(3, i * 3 // max(1, len(grupos) - 1))        # 1 → 4 a lo largo de las herramientas/webs
tb, idx = 0.0, 0
while tb < T_CIERRE - 0.01:
    raiz, ac = prog_[idx % 4]; e = energia(tb + 0.01)
    fc = 900 if e == 0 else 1800 + 700 * e
    pad = acorde([hz(m) for m in ac], COMPAS, fc=fc, a=0.25 if e == 0 else 0.05, r=0.4)
    mus.pon(reverb(pico(pad, 0.5), ir, 0.35), tb, 0.11, 0, 0.02)
    b = saw(hz(raiz - 12), COMPAS * 0.95) * env_ad(COMPAS * 0.95, 0.02, None, 1.2)
    mus.pon(pico(lp(b, 260 + 120 * max(e, 0)), 0.9), tb, 0.2)
    for q in range(4):
        tq = tb + q * BEAT
        if tq >= T_CIERRE - 0.02: break
        if e >= 1: mus.pon(pico(bombo(0.32, 140, 45, 0.8, 0.8, 1.4), 1.0), tq, 0.36)
        if e >= 2: mus.pon(pico(hat(False, 11000), 0.5), tq + BEAT / 2, 0.1, 0.3)
        if e >= 3 and q in (1, 3): mus.pon(reverb(pico(palmada(), 1.0), ir, 0.15), tq, 0.2, -0.05)
        if e >= 4:
            for j in range(2): mus.pon(pico(hat(False, 12500), 0.4), tq + BEAT / 4 + j * BEAT / 2, 0.06, -0.3)
    if e >= 2:                                                   # arpegio de pulsaciones (semicorcheas) que da empuje
        for j in range(16):
            tj = tb + j * BEAT / 4
            if tj >= T_CIERRE - 0.02: break
            m = ac[[0, 2, 1, 3, 2, 0, 3, 1][j % 8]] + 12
            mus.pon(pico(pluck(hz(m), 0.16, 3000 + 600 * e), 1.0), tj, 0.045, 0.5 * (-1) ** j)
    tb += COMPAS; idx += 1
mus.corta(T_CIERRE - 0.02, DUR, 0.05)
fin = acorde([hz(m) for m in (53, 60, 63, 67, 72)], DUR - T_CIERRE, fc=2600, a=0.08, r=1.4)
mus.pon(reverb(pico(fin, 0.5), ir, 0.45), T_CIERRE, 0.14)
mus.pon(pico(subida(max(0.6, HOOK - 0.2), 250, 7000), 0.8), 0.15, 0.08)          # el gancho sube hacia el primer segmento

# ─── diseño sonoro ───
sfx.pon(pico(hp(impacto(1.2, 0.8), 45), 1.0), 0.0, 0.3)                           # fotograma 0
sfx.pon(pico(caida_sub(0.9, 60, 30), 1.0), 0.0, 0.18)
for i, s in enumerate(SEG):
    if i > 0: sfx.pon(whoosh(0.22, 700, 5200, -0.3, 0.3), s["t0"] - 0.12, 0.07 if s.get("g", s["id"]) != SEG[i - 1].get("g", SEG[i - 1]["id"]) else 0.035)   # cambio de plano
    nuevo = i == 0 or s.get("g", s["id"]) != SEG[i - 1].get("g", SEG[i - 1]["id"])
    if nuevo: sfx.pon(pico(tecla(), 1.0), HOOK + 0.05 if i == 0 else s["t0"] + 0.08, 0.07, -0.2)   # entra el rótulo
    for k in s.get("clics", []): sfx.pon(pico(clic(), 1.0), s["t0"] + k["t"], 0.2, 0.1)
    for k in s.get("teclas", []):                                                 # tecleo real (tramos de escritura)
        a, b = k; n = int((b - a) * 11)
        for j in range(n): sfx.pon(pico(tecla(), 1.0), s["t0"] + a + j / 11 + 0.015 * np.sin(j * 7), 0.035, 0.2 * np.sin(j))
    if s.get("cortinilla"): sfx.pon(whoosh(0.5, 400, 4000, -0.7, 0.7), s["t0"] + s["cortinilla"][0], 0.1)
    # audio original de la grabación (p. ej. la canción generada o el sonido de una web)
    g = s.get("audio_nativo_db")
    if g is not None and os.path.exists(os.path.join(base, "cache", s["id"], "audio.wav")):
        x, sr_ = sf.read(os.path.join(base, "cache", s["id"], "audio.wav"), dtype="float32")
        if x.ndim == 1: x = np.stack([x, x], 1)
        x = x[: int(s["dur"] * SR)]; f = int(0.08 * SR); x[:f] *= np.linspace(0, 1, f)[:, None]; x[-f:] *= np.linspace(1, 0, f)[:, None]
        nat.pon(x, s["t0"], db(g))
sfx.pon(reverb(pico(campana(hz(84), 1.8), 0.6), ir, 0.4), T_CIERRE + R.get("cierre", {}).get("marca_t", 0.9), 0.06)

# cuando suena el audio original, la música se aparta (-14 dB)
e = envolvente(nat.x, 0.02, 0.3) if np.abs(nat.x).max() > 0 else np.zeros(len(nat.x))
mus.x *= (1 - (1 - db(-14)) * np.clip(e * 2.0, 0, 1))[:, None]
f = n_(0.6)
for P in (mus, sfx, nat): P.x[-f:] *= np.linspace(1, 0, f)[:, None]
mezcla = master(limitador(mus.x * 0.8 + sfx.x * 0.7 + nat.x, 6.0))
seca = master(limitador(sfx.x * 0.7 + nat.x, 6.0))
escribe(os.path.join(OUT, "mezcla.wav"), mezcla)
escribe(os.path.join(OUT, "mezcla-sin-musica.wav"), seca)
print(f"{reel}: {DUR:.2f} s · cierre en {T_CIERRE:.2f} · {len(SEG)} segmentos")
