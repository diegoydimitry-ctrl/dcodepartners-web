# Banda original del Reel «Dos futuros» (todo sintetizado, sin samples de terceros).
# Empieza contenida tras el golpe de Goggins y crece hasta la transformación; se vacía para «Tú decides cuál».
# Lee las anclas de tiempos.json (generado por montar.py a partir de la voz real).
import os, sys, json, math
import numpy as np
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, "..", "anuncios-v3", "comun"))
from sintesis import *
J = json.load(open(os.path.join(AQUI, "tiempos.json")))
T0, DEC, DISC, MONT, TRANS, FINAL, FIN = (J["anclas"][k] for k in ("inicio", "decision", "disciplina", "montaje", "transformacion", "final", "fin"))
DUR = FIN + 0.1
mus, fx = Pista(DUR), Pista(DUR)
ir = ir_sala(1.4, 6000, 0.012, 5); irg = ir_sala(3.6, 5200, 0.025, 13)
BPM = 96; B = 60 / BPM
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def tom(f0=95, f1=48, d=0.7, ruido_g=0.25):
    t = t_(n_(d)); f = f1 + (f0 - f1) * np.exp(-t * 9)
    y = np.sin(2 * math.pi * np.cumsum(f) / SR) * np.exp(-t * 5)
    y += lp(ruido(d), 900) * np.exp(-t * 30) * ruido_g
    return sat(y, 1.6)
def piano(f, d=1.6, fc=2600):
    t = t_(n_(d)); y = np.zeros_like(t)
    for r, g, dec in ((1, 1, 2.2), (2, .45, 3.2), (3, .22, 4.5), (4.02, .1, 6)):
        y += np.sin(2 * math.pi * f * r * t) * g * np.exp(-t * dec)
    y[:n_(0.004)] *= np.linspace(0, 1, n_(0.004))
    return lp(y, fc) * 0.5
def cuerdas(notas, t0, t1, g, fc):
    d = t1 - t0
    if d < 0.1: return
    y = acorde([hz(m) for m in notas], d, fc=fc, a=min(0.8, d / 3), r=min(1.2, d / 2))
    mus.pon(reverb(pico(y, 0.5), irg, 0.5), t0, g, 0, 0.8)
def nivel(t):  # 0 → 1 a lo largo de la historia
    if t < DEC: return 0.0
    if t < DISC: return 0.15
    if t < MONT: return 0.25 + 0.35 * (t - DISC) / max(0.1, MONT - DISC)
    if t < TRANS: return 0.65 + 0.25 * (t - MONT) / max(0.1, TRANS - MONT)
    if t < FINAL: return 1.0
    return -1
PROG = [(38, [50, 57, 62, 65]), (34, [46, 53, 58, 62]), (41, [53, 57, 60, 65]), (36, [48, 55, 60, 64])]  # Dm Bb F C

# ── arranque: golpe seco y piano bajo ──
fx.pon(pico(impacto(2.4, 1.0), 1.0), T0, 0.40); fx.pon(pico(caida_sub(1.8, 70, 26), 1.0), T0, 0.32)
t, k = T0, 0
pat = [62, 65, 69, 65, 60, 65, 69, 72]
while t < FINAL - 0.05:
    n = nivel(t); raiz, ac = PROG[(k // 8) % 4]
    nota = pat[k % 8] - (62 - ac[2]) if n >= 0.15 else pat[k % 8]
    g = 0.11 if n < 0.15 else 0.07 + 0.03 * n
    mus.pon(reverb(pico(piano(hz(nota - 12 if n < 0.6 else nota), 1.4, 1800 + 2500 * max(n, 0)), 1.0), ir, 0.35), t, g, 0.25 * math.sin(k))
    t += B / 2; k += 1
# aire gris al principio
cuerdas([50, 57, 62], T0, DEC, 0.07, 700)
# ── decisión: subida, golpe y se abre la armonía ──
mus.pon(pico(subida(1.6, 200, 7000), 0.7), DEC - 1.6, 0.11)
fx.pon(pico(caida_sub(1.6, 80, 28), 1.0), DEC, 0.3)
fx.pon(reverb(pico(campana(hz(74), 2.2), 0.6), irg, 0.5), DEC, 0.06)
tb, j = DEC, 0
while tb < FINAL - 0.05:
    raiz, ac = PROG[j % 4]; comp = min(4 * B, FINAL - tb); n = max(nivel(tb + 0.01), 0)
    voces = ac if n < 0.9 else ac + [ac[1] + 12, ac[2] + 12]
    cuerdas(voces, tb, tb + comp, 0.07 + 0.08 * n, 900 + 2600 * n)
    bajo = saw(hz(raiz - 12), comp * 0.98) * env_ad(comp * 0.98, 0.02, None, 0.9)
    mus.pon(pico(lp(bajo, 160 + 260 * n), 0.9), tb, 0.06 + 0.12 * n)
    for q in range(16):
        tq = tb + q * B / 4
        if tq >= FINAL - 0.02: break
        nq = max(nivel(tq), 0)
        if q % 4 == 0 and tq >= DEC: mus.pon(pico(bombo(0.4, 120, 42, 0.8, 1.0, 1.4), 1.0), tq, 0.12 + 0.24 * nq)     # pulso negra
        if nq >= 0.25 and q % 2 == 0: mus.pon(pico(lp(saw(hz(raiz), 0.12) * env_ad(0.12, 0.004, None, 7), 500 + 600 * nq), 0.8), tq, 0.05 + 0.06 * nq)
        if nq >= 0.3: mus.pon(pico(pluck(hz(ac[[0, 2, 1, 3][q % 4]] + 12 + (12 if nq > 0.8 and q % 8 > 3 else 0)), 0.16, 2200 + 2600 * nq), 1.0), tq, 0.012 + 0.02 * nq, 0.45 * (-1) ** q)
        if nq >= 0.45 and q % 2 == 1: mus.pon(pico(hat(False, 9500), 0.5), tq, 0.02 + 0.03 * nq, 0.35)
        if nq >= 0.6 and q in (4, 12): mus.pon(reverb(pico(palmada(), 1.0), ir, 0.25), tq, 0.10 + 0.08 * nq)
        if nq >= 0.4 and q in (6, 14): mus.pon(reverb(pico(tom(110, 55, 0.6), 1.0), irg, 0.3), tq, 0.10 + 0.14 * nq, -0.3)
        if nq >= 0.8 and q in (10, 11, 15): mus.pon(reverb(pico(tom(85, 44, 0.7), 1.0), irg, 0.3), tq, 0.2, 0.3)
    tb += comp; j += 1
# ── montaje: subida a la transformación ──
mus.pon(pico(subida(2.2, 250, 9000), 0.7), TRANS - 2.2, 0.14)
for k in range(8): mus.pon(reverb(pico(tom(95, 50, 0.5), 1.0), irg, 0.25), TRANS - 1.0 + k * 0.125, 0.10 + 0.03 * k, (-1) ** k * 0.3)
fx.pon(pico(impacto(2.6, 1.1), 1.0), TRANS, 0.45); fx.pon(pico(caida_sub(2.0, 80, 26), 1.0), TRANS, 0.35)
cuerdas([62, 69, 74, 77, 81], TRANS, FINAL, 0.06, 4200)            # brillo arriba en el clímax
# ── final: se vacía, golpe y acorde que queda ──
fx.pon(whoosh(0.9, 300, 3000, 0.4, -0.4), FINAL - 0.5, 0.12)
fx.pon(pico(impacto(3.0, 1.0), 1.0), FINAL, 0.34); fx.pon(pico(caida_sub(2.6, 70, 24), 1.0), FINAL, 0.3)
fin = acorde([hz(m) for m in (38, 50, 57, 62, 66, 69, 74)], FIN - FINAL, fc=2200, a=0.3, r=2.4)
mus.pon(reverb(pico(fin, 0.5), irg, 0.6), FINAL, 0.13)
fx.pon(reverb(pico(campana(hz(86), 3.0), 0.5), irg, 0.55), FINAL + 0.4, 0.05)
f = n_(1.8)
for P in (mus, fx): P.x[-f:] *= np.linspace(1, 0, f)[:, None]
escribe(os.path.join(AQUI, "audio", "musica.wav"), master(limitador(mus.x, 4.0), 0.9))
escribe(os.path.join(AQUI, "audio", "efectos.wav"), master(fx.x, 0.9))
print(f"banda: {DUR:.2f} s")
