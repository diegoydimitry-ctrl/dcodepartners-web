# Banda sonora del Reel «La pantalla que se rompe». Todo sintetizado aquí (sin samples de terceros).
#   0–2,1 s   oficina real: ambiente, teclado, ratón y notificaciones que se amontonan
#   1,6–2,1   las notificaciones se callan: solo el ambiente (tensión)
#   2,1–3     clic → grieta → crujidos cada vez más fuertes → micro-silencio
#   3,0       la pantalla estalla: golpe, sub, cristales; entra la música
#   5,2–10,3  cada pieza entra en su sitio (whoosh + acorde que crece); 10,3 destello
#   10,3–16,8 producto: pulso con bombo; 16,8 respiro; 18,55 subida; 20,8 cierre y campana
#   python3 audio/banda.py  → audio/mezcla.wav · audio/mezcla-sin-musica.wav
import os, sys, math
import numpy as np
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, "..", "..", "anuncios-v3", "comun"))
from sintesis import *

DUR = 24.0; T_CLIC, T_SH, T_MAPA, T_PROD, T_MSG, T_CTA = 2.1, 3.0, 5.2, 10.3, 16.8, 20.8
BPM = 120; BEAT = 60 / BPM
amb, sfx, mus = Pista(DUR), Pista(DUR), Pista(DUR)
ir = ir_sala(1.4, 6000, 0.012, 5); ir_g = ir_sala(2.6, 5200, 0.02, 11)
rng = np.random.default_rng(7)
def hz(m): return 440 * 2 ** ((m - 69) / 12)

# ── 0–3 s: oficina ──
tono = lp(ruido(T_SH + 0.2), 420) * 0.05 + lp(ruido(T_SH + 0.2), 2500) * 0.008
amb.pon(np.stack([tono, np.roll(tono, 900)], 1), 0, 1.0)
for t0, f in zip([0.15, 0.42, 0.66, 0.9, 1.12, 1.34, 1.56], [1046.5, 880, 1174.7, 1046.5, 987.8, 1318.5, 1046.5]):
    sfx.pon(aviso(f), t0, 0.5, rng.uniform(-0.3, 0.4))
for k in (0.36, 1.07): sfx.pon(pico(clic(), 1.0), k, 0.35, 0.05)
for j in range(int((1.5 - 1.05) * 13)): sfx.pon(pico(tecla(), 1.0), 1.05 + j / 13 + 0.01 * math.sin(j * 5), 0.16, 0.12)
for j in range(8): sfx.pon(pico(tecla(), 1.0), 0.02 + j * 0.07, 0.1, 0.12)          # remate de una frase que se estaba escribiendo
# tensión: zumbido grave que sube muy poco a poco mientras todo se para
t = t_(n_(1.4)); zum = np.sin(2 * math.pi * (55 + 8 * t / 1.4) * t) * (t / 1.4) ** 2 * 0.25 + lp(ruido(1.4), 200) * (t / 1.4) ** 2 * 0.2
sfx.pon(zum, 1.6, 0.5)

# ── 2,1–3: el clic y la grieta ──
sfx.pon(pico(clic(), 1.0), T_CLIC, 0.5)
def tic(f=5200, d=0.35):
    t = t_(n_(d)); y = np.zeros_like(t)
    for r, g in ((1, 1), (1.53, 0.5), (2.41, 0.3)): y += np.sin(2 * math.pi * f * r * t) * g
    y *= np.exp(-t * 16); y[:n_(0.003)] += hp(ruido(0.003), 3000) * 1.5; return y * 0.35
def crujido(d=0.25, dens=90, fc=2600):
    y = np.zeros(n_(d))
    for _ in range(int(dens * d)):
        k = rng.integers(0, len(y) - 200); b = hp(ruido(0.004), fc) * np.exp(-t_(n_(0.004)) * 900) * rng.uniform(0.3, 1); y[k:k + len(b)] += b
    y += lp(ruido(d), 500) * np.hanning(len(y)) * 0.3
    return y
sfx.pon(reverb(tic(), ir, 0.3), T_CLIC + 0.03, 0.7)
for t0, d, g in ((2.22, 0.22, 0.35), (2.52, 0.3, 0.6), (2.8, 0.16, 0.85)):
    sfx.pon(reverb(crujido(d), ir, 0.25), t0, g, rng.uniform(-0.3, 0.3))
    sfx.pon(tic(rng.uniform(3800, 6400), 0.25), t0, g * 0.5, rng.uniform(-0.5, 0.5))
amb.corta(2.93, DUR, 0.02)
sfx.corta(2.935, 2.998, 0.03)                                                        # el silencio de verdad                                                           # micro-silencio antes del estallido

# ── 3,0: estalla ──
sfx.pon(pico(impacto(2.4, 1.2), 1.0), T_SH, 0.62)
sfx.pon(pico(caida_sub(1.6, 80, 24), 1.0), T_SH, 0.45)
cris = np.zeros((n_(1.8), 2))
for _ in range(170):                                                                 # lluvia de cristales en estéreo
    k0 = rng.exponential(0.22); f = rng.uniform(2500, 9500); d = rng.uniform(0.05, 0.4)
    tt = t_(n_(d)); y = np.sin(2 * math.pi * f * tt) * np.exp(-tt * rng.uniform(12, 40)) * rng.uniform(0.05, 0.28)
    y[:n_(0.002)] += hp(ruido(0.002), 4000) * 0.4; p = rng.uniform(-1, 1); a = (p + 1) * math.pi / 4
    k = n_(min(k0, 1.3)); cris[k:k + len(y), 0] += y * math.cos(a); cris[k:k + len(y), 1] += y * math.sin(a)
cris += estereo(hp(ruido(1.8), 2200) * np.exp(-t_(n_(1.8)) * 3.2) * 0.35, 0, 0.8)
sfx.pon(reverb(cris, ir_g, 0.35), T_SH, 0.8)
sfx.pon(whoosh(1.4, 300, 3500, 0.6, -0.6), 3.15, 0.35)                            # la cámara atraviesa los trozos

# ── música ──
prog_ = [(38, [62, 65, 69, 72]), (34, [62, 65, 70, 74]), (41, [60, 65, 69, 72]), (36, [60, 64, 67, 72])]   # Dm9 · Bb · F · C
def energia(t):
    if t < T_SH: return -1
    if t < T_MAPA: return 0
    if t < 8.9: return 1
    if t < T_PROD: return 2
    if t < T_MSG: return 3
    if t < 18.55: return 1
    if t < T_CTA: return 2
    return -2
tb, i = T_SH, 0
while tb < T_CTA - 0.01:
    raiz, ac = prog_[i % 4]; e = energia(tb + 0.01); comp = 4 * BEAT; fc = 1300 + 700 * max(e, 0)
    mus.pon(reverb(pico(acorde([hz(m) for m in ac], comp, fc=fc, a=0.3 if e == 0 else 0.06, r=0.5), 0.5), ir_g, 0.4), tb, 0.12)
    b = saw(hz(raiz - 12), comp * 0.95) * env_ad(comp * 0.95, 0.03, None, 1.3); mus.pon(pico(lp(b, 220 + 90 * max(e, 0)), 0.9), tb, 0.16 + 0.03 * max(e, 0))
    for q in range(8):
        tq = tb + q * BEAT / 2
        if tq >= T_CTA - 0.02: break
        if e >= 1 and q % 2 == 0: mus.pon(pico(lp(sine(hz(raiz), 0.18) * env_ad(0.18, 0.004, None, 6), 900), 0.8), tq, 0.1)   # pulso grave
        if e >= 2 and q % 2 == 1: mus.pon(pico(hat(False, 10500), 0.5), tq, 0.06, 0.3)
        if e >= 3 and q % 2 == 0: mus.pon(pico(bombo(0.34, 140, 44, 0.85, 0.9, 1.4), 1.0), tq, 0.34)
        if e >= 3 and q in (2, 6): mus.pon(reverb(pico(palmada(), 1.0), ir, 0.2), tq, 0.14, -0.05)
    if e >= 1:
        for j in range(16):
            tj = tb + j * BEAT / 4
            if tj >= T_CTA - 0.02: break
            m = ac[[0, 2, 1, 3][j % 4]] + 12; mus.pon(pico(pluck(hz(m), 0.14, 2600 + 500 * e), 1.0), tj, 0.03 + 0.008 * e, 0.5 * (-1) ** j)
    tb += comp; i += 1
mus.pon(pico(subida(1.1, 300, 8000), 0.8), T_PROD - 1.1, 0.12)                     # subida al destello
mus.pon(pico(subida(1.2, 250, 7000), 0.8), 18.55 - 1.2, 0.08)
fin = acorde([hz(m) for m in (50, 57, 62, 65, 69, 74)], DUR - T_CTA, fc=2400, a=0.1, r=1.6)
mus.pon(reverb(pico(fin, 0.5), ir_g, 0.5), T_CTA, 0.15)
mus.pon(pico(caida_sub(1.2, 70, 30), 1.0), T_CTA, 0.2)

# ── efectos del sistema y del producto ──
for t0 in (5.35, 6.05, 6.75, 7.45, 8.15):
    sfx.pon(whoosh(0.7, 600, 5200, rng.choice([-0.6, 0.6]), 0), t0, 0.16)
    sfx.pon(reverb(pico(campana(hz(rng.choice([81, 84, 86, 88, 91])), 0.9), 0.5), ir, 0.35), t0 + 0.85, 0.07, rng.uniform(-0.3, 0.3))
    sfx.pon(pico(clic(), 1.0), t0 + 0.85, 0.18)
sfx.pon(reverb(pico(acorde([hz(m) for m in (74, 77, 81, 86)], 1.4, fc=5000, a=0.02, r=0.9), 0.5), ir_g, 0.5), 8.95, 0.07)
sfx.pon(pico(impacto(1.6, 0.8), 1.0), T_PROD, 0.35)
for t0 in (12.5, 14.65): sfx.pon(whoosh(0.45, 700, 5500, -0.5, 0.5), t0 - 0.2, 0.2)
for t0 in (T_PROD + 0.14, 12.64, 14.79): sfx.pon(pico(tecla(), 1.0), t0, 0.12)
sfx.pon(whoosh(0.8, 400, 3000, 0.5, -0.5), T_MSG - 0.3, 0.18)
sfx.pon(reverb(pico(campana(hz(86), 1.8), 0.6), ir_g, 0.45), T_CTA + 0.95, 0.08)

mus.corta(T_CTA + 0.0 - 0.001, T_CTA + 0.001, 0.08) if False else None
f = n_(0.6)
for P in (amb, sfx, mus): P.x[-f:] *= np.linspace(1, 0, f)[:, None]
mezcla = master(limitador(amb.x + sfx.x * 0.8 + mus.x * 0.85, 6.0))
seca = master(limitador(amb.x + sfx.x * 0.8, 6.0))
os.makedirs(AQUI, exist_ok=True)
escribe(os.path.join(AQUI, "mezcla.wav"), mezcla); escribe(os.path.join(AQUI, "mezcla-sin-musica.wav"), seca)
print("banda lista:", DUR, "s")
