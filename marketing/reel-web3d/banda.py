# Banda original del reel de webs 3D (todo sintetizado aquí, sin samples de terceros). 120 BPM: cada corte y cada toque caen a pulso.
#   0–2 gancho (cuatro golpes y subida) · 2–20 tres webs (base completa, golpe en cada cambio de web, toques de interfaz) · 20–23 escaparate · 23 cierre
import os, sys, math
import numpy as np
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, "..", "anuncios-v3", "comun"))
from sintesis import *
DUR = 25.5; BPM = 120; B = 60 / BPM
WEBS = [2, 8, 14]; T_ESC, T_FIN = 20, 23
TOQUES = [4.0, 4.75, 7.4, 9.5, 10.0, 10.5, 11.0, 11.5, 16.0, 16.5, 17.0]
ZOOMS = [5.5, 12.95, 17.4]
mus, fx = Pista(DUR), Pista(DUR)
ir = ir_sala(1.1, 7000, 0.010, 5); irg = ir_sala(3.0, 6000, 0.02, 13)
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def pad(notas, t0, t1, g, fc, a=None):
    d = t1 - t0; y = acorde([hz(m) for m in notas], d, fc=fc, a=a or min(0.6, d / 3), r=min(0.8, d / 2))
    mus.pon(reverb(pico(y, 0.5), irg, 0.4), t0, g, 0, 0.8)
def toque(f=1500):
    t = t_(n_(0.09)); return np.sin(2 * math.pi * f * t * (1 + 0.25 * np.exp(-t * 60))) * np.exp(-t * 55)
# ── gancho: un golpe por plano ──
for k in range(4):
    fx.pon(pico(impacto(0.9, 0.6 + 0.12 * k), 1.0), k * B, 0.24 + 0.03 * k); fx.pon(pico(bombo(0.4, 130, 44, 0.9, 1.0, 1.6), 1.0), k * B, 0.3)
    fx.pon(reverb(pico(campana(hz([64, 67, 71, 76][k]), 0.8), 1.0), irg, 0.4), k * B, 0.06)
mus.pon(pico(subida(1.6, 300, 10000), 0.7), 0.4, 0.13)
# ── cuerpo: la menor → fa → do → sol, base de baile limpia ──
PROG = [(45, [57, 60, 64, 69]), (41, [53, 57, 60, 65]), (48, [55, 60, 64, 67]), (43, [55, 59, 62, 67])]
tb, j = 2.0, 0
while tb < T_ESC - 0.01:
    raiz, ac = PROG[j % 4]; comp = 4 * B; web = sum(tb >= w for w in WEBS) - 1; n = 0.8 + 0.1 * web
    pad(ac + [ac[2] + 12], tb, tb + comp, 0.085, 2600 + 900 * web)
    for q in range(16):
        tq = tb + q * B / 4
        if q % 4 == 0: mus.pon(pico(bombo(0.36, 125, 45, 0.9, 1.0, 1.5), 1.0), tq, 0.4)
        if q % 4 == 2: mus.pon(pico(lp(saw(hz(raiz - 12), 0.2) * env_ad(0.2, 0.005, None, 5), 420), 0.9), tq, 0.2)          # bajo a contratiempo
        if q in (4, 12): mus.pon(reverb(pico(palmada(), 1.0), ir, 0.22), tq, 0.15)
        mus.pon(pico(hat(q % 4 == 2, 9500), 0.5), tq, 0.05 if q % 2 else 0.028, 0.3 * (-1) ** q)
        mus.pon(pico(pluck(hz(ac[[0, 2, 3, 1, 2, 3, 1, 2][q % 8]] + 12 + (12 if web == 2 and q % 4 == 3 else 0)), 0.2, 4200 + 600 * web), 1.0), tq, 0.036, 0.5 * (-1) ** q)
    tb += comp; j += 1
# ── cambio de web: barrido + golpe ──
for k, w in enumerate(WEBS):
    fx.pon(pico(impacto(1.8, 1.0), 1.0), w, 0.4); fx.pon(pico(caida_sub(0.9, 80, 34), 1.0), w, 0.2)
    if k: fx.pon(whoosh(0.5, 400, 7000, -0.8, 0.8), w - 0.42, 0.18); mus.pon(pico(subida(1.0, 500, 9000), 0.7), w - 1.0, 0.07)
# ── interfaz: toques y zooms ──
for k, t in enumerate(TOQUES): fx.pon(pico(toque(1300 + 130 * (k % 4)), 1.0), t, 0.17); fx.pon(reverb(pico(campana(hz(76 + [0, 3, 7, 10][k % 4]), 0.6), 1.0), ir, 0.3), t + 0.02, 0.05, 0.4 * (-1) ** k)
for t in ZOOMS: fx.pon(whoosh(0.7, 300, 5200, -0.5, 0.5), t, 0.16)
fx.pon(whoosh(1.0, 400, 4000, -0.7, 0.7), 2.2, 0.1); fx.pon(whoosh(1.0, 400, 3000, 0.7, -0.7), 8.2, 0.09); fx.pon(whoosh(1.0, 400, 3500, -0.7, 0.7), 14.2, 0.09)      # arrastres
fx.pon(whoosh(0.5, 600, 5000, -0.2, 0.8), 7.5, 0.12)                                                 # a la cesta
# ── escaparate: se abre, sube ──
for P in (mus,): P.corta(T_ESC + 0.02, DUR, 0.12)
fx.pon(pico(impacto(2.6, 1.0), 1.0), T_ESC, 0.42); fx.pon(pico(caida_sub(1.4, 70, 28), 1.0), T_ESC, 0.22)
pad([45, 57, 60, 64, 69, 72], T_ESC, T_FIN + 0.1, 0.13, 2400, a=0.25)
for k in range(6): mus.pon(pico(bombo(0.4, 120, 44, 0.85, 1.0, 1.4), 1.0), T_ESC + k * B, 0.2 + 0.03 * k)
for k, m in enumerate([69, 72, 76, 81, 84, 88]): mus.pon(reverb(pico(pluck(hz(m), 0.4, 5000), 1.0), irg, 0.4), T_ESC + 0.5 + k * B / 2, 0.06, 0.4 * (-1) ** k)
mus.pon(pico(subida(1.6, 300, 10000), 0.7), T_FIN - 1.6, 0.12)
# ── cierre: resuelve en do mayor ──
for P in (mus, fx): P.corta(T_FIN + 0.02, DUR, 0.05)
fx.pon(pico(impacto(2.4, 1.0), 1.0), T_FIN + 0.45, 0.42); fx.pon(pico(caida_sub(1.2, 65, 28), 1.0), T_FIN + 0.45, 0.2)
y = acorde([hz(m) for m in [36, 48, 55, 60, 64, 67, 72]], DUR - T_FIN - 0.45, fc=4200, a=0.02, r=1.0)
mus.pon(reverb(pico(y, 0.5), irg, 0.5), T_FIN + 0.45, 0.22, 0, 0.9)
mus.pon(reverb(pico(campana(hz(84), 1.6), 1.0), irg, 0.5), T_FIN + 0.45, 0.08)
x = master(limitador(mus.x, 4.0), 0.9) * 0.85 + master(fx.x, 0.9) * 0.75
n = n_(0.5); x[-n:] *= np.linspace(1, 0, n)[:, None]
os.makedirs(os.path.join(AQUI, "audio"), exist_ok=True)
escribe(os.path.join(AQUI, "audio", "banda.wav"), master(x, 0.93)); print(f"banda: {DUR} s")
