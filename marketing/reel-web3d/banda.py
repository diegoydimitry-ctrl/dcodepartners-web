# Banda original del Reel «Web 3D» (todo sintetizado aquí, sin samples de terceros).
#   gancho: dos golpes («ESTO NO ES UN VÍDEO.» / «ES UNA WEB.») · web: pulso que crece · clics de interfaz con barrido
#   interior: la música se «mete dentro» (filtro) · mundo: golpe en cada cambio · carretera: máximo + motor eléctrico · cierre: golpe y acorde
import os, sys, math
import numpy as np
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, "..", "anuncios-v3", "comun"))
from sintesis import *
DUR = 32.5; BPM = 120; B = 60 / BPM
CLIC_COLOR, CLIC_PUERTAS, CLIC_MUNDO = [8.7, 10.3, 11.9], 13.6, [19.5, 21.4]
WEB, DENTRO, FUERA, CORRE, NEGRO, FRASE, LOGO = 2.5, 15.5, 18.5, 23.5, 28.0, 28.6, 30.5
mus, fx = Pista(DUR), Pista(DUR)
ir = ir_sala(1.4, 6000, 0.012, 5); irg = ir_sala(3.8, 5000, 0.025, 13)
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def pad(notas, t0, t1, g, fc, a=None):
    d = t1 - t0; y = acorde([hz(m) for m in notas], d, fc=fc, a=a or min(1.0, d / 3), r=min(1.2, d / 2))
    mus.pon(reverb(pico(y, 0.5), irg, 0.5), t0, g, 0, 0.8)
def nivel(t):
    if t < WEB: return 0
    if t < 7.5: return 0.45
    if t < 13.0: return 0.7
    if t < DENTRO: return 0.6
    if t < FUERA: return 0.3
    if t < CORRE: return 0.8
    return 1.0
# ── gancho ──
fx.pon(pico(impacto(1.4, 0.8), 1.0), 0.10, 0.32); fx.pon(pico(caida_sub(1.0, 70, 28), 1.0), 0.10, 0.2)
mus.pon(pico(subida(0.9, 300, 8000), 0.7), 0.6, 0.08)
fx.pon(pico(impacto(2.2, 1.0), 1.0), 1.5, 0.38); fx.pon(reverb(pico(campana(hz(74), 1.6), 1.0), irg, 0.5), 1.5, 0.06)
for k, t in enumerate((0.45, 0.68, 0.8)): fx.pon(pico(clic(), 1.0), t, 0.10, 0.3 * (-1) ** k)      # parpadeo de faros
# ── cuerpo: re menor, cuatro acordes ──
PROG = [(38, [50, 57, 62, 65]), (34, [46, 53, 58, 62]), (41, [53, 57, 60, 65]), (36, [48, 55, 60, 64])]
tb, j = WEB, 0
while tb < NEGRO - 0.05:
    raiz, ac = PROG[j % 4]; comp = min(4 * B, NEGRO - tb); n = nivel(tb + 0.01); dentro = DENTRO <= tb < FUERA
    pad(ac + ([ac[1] + 12, ac[2] + 12] if n > 0.9 else []), tb, tb + comp, 0.06 + 0.06 * n, (500 if dentro else 1000 + 3000 * n))
    bajo = saw(hz(raiz - 12), comp * 0.98) * env_ad(comp * 0.98, 0.02, None, 0.9)
    mus.pon(pico(lp(bajo, 180 + 260 * n), 0.9), tb, 0.08 + 0.1 * n)
    for q in range(16):
        tq = tb + q * B / 4
        if tq >= NEGRO - 0.02: break
        nq = nivel(tq); d = DENTRO <= tq < FUERA
        if q % 4 == 0: mus.pon(pico(lp(bombo(0.4, 125, 44, 0.85, 1.0, 1.5), 300 if d else 16000), 1.0), tq, 0.2 + 0.2 * nq)
        if q % 2 == 0 and not d: mus.pon(pico(lp(saw(hz(raiz), 0.11) * env_ad(0.11, 0.004, None, 7), 500 + 900 * nq), 0.8), tq, 0.05 + 0.06 * nq)
        mus.pon(pico(pluck(hz(ac[[0, 2, 1, 3][q % 4]] + 12 + (12 if nq > 0.9 and q % 8 > 3 else 0)), 0.15, 900 if d else 2400 + 2600 * nq), 1.0), tq, 0.014 + 0.022 * nq, 0.45 * (-1) ** q)
        if nq > 0.55 and q % 2 == 1: mus.pon(pico(hat(False, 9500), 0.5), tq, 0.02 + 0.035 * nq, 0.35)
        if nq > 0.65 and q in (4, 12): mus.pon(reverb(pico(palmada(), 1.0), ir, 0.25), tq, 0.08 + 0.09 * nq)
        if nq > 0.9 and q % 4 == 2: mus.pon(pico(hat(True, 9000), 0.5), tq, 0.035, -0.3)
    tb += comp; j += 1
# ── interfaz: clic + barrido de reflejos en cada color ──
for k, t in enumerate(CLIC_COLOR):
    fx.pon(pico(clic(), 1.0), t, 0.16); fx.pon(whoosh(0.75, 500, 5200, -0.8 * (-1) ** k, 0.8 * (-1) ** k), t + 0.02, 0.15)
    fx.pon(reverb(pico(campana(hz([74, 77, 81][k]), 1.0), 1.0), irg, 0.4), t + 0.3, 0.045)
# ── puertas: clic + servo que sube ──
fx.pon(pico(clic(), 1.0), CLIC_PUERTAS, 0.16)
t = t_(n_(1.5)); f = 140 + 260 * (t / 1.5) ** 0.7; servo = np.sin(2 * math.pi * np.cumsum(f) / SR) * 0.6 + np.sin(2 * math.pi * np.cumsum(f * 3.01) / SR) * 0.25
servo = lp(servo, 2200) * np.minimum(1, t / 0.08) * np.minimum(1, (1.5 - t) / 0.25)
fx.pon(reverb(pico(servo, 1.0), ir, 0.2), CLIC_PUERTAS + 0.1, 0.06)
fx.pon(pico(caida_sub(0.5, 80, 40), 1.0), CLIC_PUERTAS + 1.55, 0.14)                                 # tope de la puerta
fx.pon(whoosh(1.6, 3000, 250, 0.5, 0.0), DENTRO - 0.6, 0.12)                                         # la cámara entra
fx.pon(whoosh(0.7, 300, 5000, -0.6, 0.6), FUERA - 0.35, 0.16); fx.pon(pico(impacto(1.4, 0.7), 1.0), FUERA, 0.22)
# ── mundo: golpe en cada cambio ──
for k, t in enumerate(CLIC_MUNDO):
    fx.pon(pico(clic(), 1.0), t, 0.16); fx.pon(pico(impacto(1.6, 0.85), 1.0), t + 0.12, 0.3); fx.pon(whoosh(0.5, 600, 6000, -0.7, 0.7), t - 0.1, 0.12)
# ── carretera: subida, golpe y motor eléctrico ──
mus.pon(pico(subida(1.6, 250, 9000), 0.7), CORRE - 1.6, 0.14)
fx.pon(pico(impacto(2.4, 1.0), 1.0), CORRE, 0.36)
d = NEGRO - CORRE + 0.3; t = t_(n_(d)); u = 1 - (1 - np.minimum(1, t / 4.0)) ** 3
f = 180 + 900 * u; motor = np.sin(2 * math.pi * np.cumsum(f) / SR) * 0.5 + np.sin(2 * math.pi * np.cumsum(f * 2.02) / SR) * 0.3 + np.sin(2 * math.pi * np.cumsum(f * 0.5) / SR) * 0.4
motor = lp(motor, 3800) * np.minimum(1, t / 0.3) * np.minimum(1, (d - t) / 0.3)
fx.pon(pico(motor, 1.0), CORRE, 0.055)
viento = lp(hp(ruido(d), 400), 5000) * np.minimum(1, t / 1.2) * np.minimum(1, (d - t) / 0.3)
fx.pon(pico(viento, 1.0), CORRE, 0.07, 0, 0.9)
for k in range(9): fx.pon(whoosh(0.3, 1500, 5000, -0.9 * (-1) ** k, 0.9 * (-1) ** k), CORRE + 0.5 + k * 0.45, 0.07)   # luces que pasan
fx.pon(whoosh(0.6, 400, 6000, 0, 0), 25.9 - 0.3, 0.14)                                               # cambio de plano
# ── cierre ──
for P in (mus, fx): P.corta(NEGRO + 0.05, DUR, 0.25)
fx.pon(pico(caida_sub(0.9, 60, 28), 1.0), NEGRO, 0.2)
fx.pon(pico(impacto(2.0, 0.9), 1.0), FRASE, 0.3)
pad([50, 57, 62, 65, 69], FRASE, LOGO + 0.2, 0.08, 1600, a=0.3)
fx.pon(pico(impacto(2.6, 1.0), 1.0), LOGO, 0.36)
y = acorde([hz(m) for m in [38, 50, 57, 62, 66, 69, 74]], DUR - LOGO, fc=4200, a=0.02, r=1.2)      # re mayor: resuelve
mus.pon(reverb(pico(y, 0.5), irg, 0.5), LOGO, 0.2, 0, 0.9)
mus.pon(reverb(pico(campana(hz(86), 1.8), 1.0), irg, 0.5), LOGO, 0.07)
x = master(limitador(mus.x, 4.0), 0.9) * 0.85 + master(fx.x, 0.9) * 0.8
n = n_(0.5); x[-n:] *= np.linspace(1, 0, n)[:, None]
escribe(os.path.join(AQUI, "audio", "banda.wav"), master(x, 0.93)); print(f"banda: {DUR} s")
