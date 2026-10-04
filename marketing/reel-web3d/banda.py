# Banda original del Reel «Esto no es una foto. Es una web.» (todo sintetizado aquí, sin samples de terceros).
# Tono luminoso y limpio (mayor, 112 BPM): gancho con dos acentos, pulso que crece con cada función, toques de interfaz, y cierre que resuelve.
import os, sys, math
import numpy as np
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, "..", "anuncios-v3", "comun"))
from sintesis import *
DUR = 28.4; BPM = 112; B = 60 / BPM
T_UI, TC, Z0, Z1, T_TALLA, T_CTA, T_CESTA, T_MAS, T_PAGAR, T_NEGRO, T_FRASE, T_FIRMA = 2.4, [8.2, 9.9], 11.9, 15.2, 17.0, 18.0, 19.7, 21.0, 22.2, 23.5, 24.2, 26.1
mus, fx = Pista(DUR), Pista(DUR)
ir = ir_sala(1.2, 7000, 0.010, 5); irg = ir_sala(3.2, 6000, 0.02, 13)
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def pad(notas, t0, t1, g, fc, a=None):
    d = t1 - t0; y = acorde([hz(m) for m in notas], d, fc=fc, a=a or min(0.8, d / 3), r=min(1.0, d / 2))
    mus.pon(reverb(pico(y, 0.5), irg, 0.45), t0, g, 0, 0.8)
def toque(f=1500):          # toque de interfaz: gota corta y limpia
    t = t_(n_(0.09)); return np.sin(2 * math.pi * f * t * (1 + 0.25 * np.exp(-t * 60))) * np.exp(-t * 55)
def nivel(t):
    if t < T_UI: return 0
    if t < 7.4: return 0.45
    if t < Z0: return 0.7
    if t < Z1 + 0.9: return 0.35
    if t < T_CESTA: return 0.8
    return 1.0
# ── gancho ──
fx.pon(pico(impacto(1.2, 0.6), 1.0), 0.1, 0.22)
fx.pon(reverb(pico(campana(hz(76), 1.2), 1.0), irg, 0.5), 0.1, 0.07)
fx.pon(whoosh(1.0, 400, 5000, -0.7, 0.7), 1.25, 0.14)                                             # el dedo la gira
fx.pon(pico(impacto(1.6, 0.8), 1.0), 1.25, 0.26); fx.pon(reverb(pico(campana(hz(83), 1.4), 1.0), irg, 0.5), 1.25, 0.07)
mus.pon(pico(subida(1.0, 400, 9000), 0.7), T_UI - 1.0, 0.07)
# ── cuerpo: mi mayor, luminoso ──
PROG = [(40, [52, 59, 64, 68]), (37, [49, 56, 61, 64]), (45, [57, 61, 64, 69]), (47, [59, 63, 66, 71])]
tb, j = T_UI, 0
while tb < T_NEGRO - 0.05:
    raiz, ac = PROG[j % 4]; comp = min(4 * B, T_NEGRO - tb); n = nivel(tb + 0.01); dentro = Z0 + 0.4 <= tb < Z1 + 0.6
    pad(ac + ([ac[2] + 12] if n > 0.9 else []), tb, tb + comp, 0.07 + 0.05 * n, 900 if dentro else 1400 + 3200 * n)
    bajo = saw(hz(raiz - 12), comp * 0.98) * env_ad(comp * 0.98, 0.02, None, 0.9)
    mus.pon(pico(lp(bajo, 170 + 240 * n), 0.9), tb, 0.08 + 0.09 * n)
    for q in range(16):
        tq = tb + q * B / 4
        if tq >= T_NEGRO - 0.02: break
        nq = nivel(tq); d = Z0 + 0.4 <= tq < Z1 + 0.6
        if q % 4 == 0: mus.pon(pico(lp(bombo(0.36, 120, 46, 0.8, 1.0, 1.3), 260 if d else 16000), 1.0), tq, 0.17 + 0.17 * nq)
        if q % 4 == 2 and nq > 0.4 and not d: mus.pon(pico(lp(saw(hz(raiz), 0.12) * env_ad(0.12, 0.004, None, 7), 500 + 800 * nq), 0.8), tq, 0.06 + 0.05 * nq)
        mus.pon(pico(pluck(hz(ac[[0, 2, 3, 1, 2, 3, 1, 2][q % 8]] + 12), 0.2, 1000 if d else 2600 + 2600 * nq), 1.0), tq, 0.016 + 0.022 * nq, 0.5 * (-1) ** q)
        if nq > 0.6 and q % 2 == 1 and not d: mus.pon(pico(hat(False, 9500), 0.5), tq, 0.018 + 0.03 * nq, 0.35)
        if nq > 0.65 and q in (4, 12): mus.pon(reverb(pico(palmada(), 1.0), ir, 0.25), tq, 0.07 + 0.08 * nq)
    tb += comp; j += 1
# ── giro con el dedo ──
for a, b_, p in ((3.3, 4.6, 1), (4.9, 6.3, -1)): fx.pon(whoosh(b_ - a, 350, 3200, -0.7 * p, 0.7 * p), a, 0.09)
# ── colores: toque + giro + nota ──
for k, t in enumerate(TC):
    fx.pon(pico(toque(1400 + 250 * k), 1.0), t, 0.14); fx.pon(whoosh(0.9, 500, 5200, -0.8 * (-1) ** k, 0.8 * (-1) ** k), t + 0.02, 0.15)
    fx.pon(pico(impacto(1.2, 0.6), 1.0), t + 0.47, 0.18); fx.pon(reverb(pico(campana(hz([76, 80][k]), 1.0), 1.0), irg, 0.4), t + 0.47, 0.06)
# ── zoom: la música se cierra y vuelve ──
fx.pon(whoosh(1.2, 2500, 300, 0.0, 0.0), Z0, 0.13); fx.pon(pico(caida_sub(1.0, 70, 32), 1.0), Z0 + 0.3, 0.12)
fx.pon(whoosh(0.9, 300, 4200, -0.4, 0.4), Z1 + 0.1, 0.13)
# ── talla, cesta y pago ──
fx.pon(pico(toque(1500), 1.0), T_TALLA, 0.14)
fx.pon(pico(toque(1200), 1.0), T_CTA, 0.16); fx.pon(whoosh(0.6, 600, 5000, -0.2, 0.8), T_CTA + 0.12, 0.12)
for k, m in enumerate((88, 92)): fx.pon(reverb(pico(campana(hz(m), 0.7), 1.0), ir, 0.3), T_CTA + 0.74 + k * 0.09, 0.07, 0.5)        # «plin» del globo
fx.pon(pico(toque(1300), 1.0), T_CESTA, 0.14); fx.pon(whoosh(0.55, 300, 2400, 0, 0), T_CESTA + 0.08, 0.12)
fx.pon(pico(toque(1700), 1.0), T_MAS, 0.15)
fx.pon(pico(toque(1200), 1.0), T_PAGAR, 0.16)
for k, m in enumerate((76, 80, 83, 88)): fx.pon(reverb(pico(campana(hz(m), 1.2), 1.0), irg, 0.4), T_PAGAR + 0.75 + k * 0.07, 0.07, 0.2 * (-1) ** k)   # pedido confirmado
fx.pon(pico(impacto(1.4, 0.7), 1.0), T_PAGAR + 0.75, 0.2)
# ── cierre ──
for P in (mus, fx): P.corta(T_NEGRO + 0.25, DUR, 0.3)
fx.pon(pico(caida_sub(0.9, 60, 28), 1.0), T_NEGRO, 0.16)
fx.pon(pico(impacto(2.0, 0.9), 1.0), T_FRASE, 0.28)
pad([52, 59, 64, 68, 71], T_FRASE, T_FIRMA + 0.2, 0.09, 1800, a=0.3)
fx.pon(pico(impacto(2.4, 1.0), 1.0), T_FIRMA, 0.34)
y = acorde([hz(m) for m in [40, 52, 59, 64, 68, 71, 76]], DUR - T_FIRMA, fc=4200, a=0.02, r=1.0)
mus.pon(reverb(pico(y, 0.5), irg, 0.5), T_FIRMA, 0.2, 0, 0.9)
mus.pon(reverb(pico(campana(hz(88), 1.6), 1.0), irg, 0.5), T_FIRMA, 0.07)
x = master(limitador(mus.x, 4.0), 0.9) * 0.85 + master(fx.x, 0.9) * 0.8
n = n_(0.5); x[-n:] *= np.linspace(1, 0, n)[:, None]
os.makedirs(os.path.join(AQUI, "audio"), exist_ok=True)
escribe(os.path.join(AQUI, "audio", "banda.wav"), master(x, 0.93)); print(f"banda: {DUR} s")
