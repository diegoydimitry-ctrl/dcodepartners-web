# Banda original del Reel «Hazlo cansado» (todo sintetizado aquí, sin samples de terceros).
# Cuenta la misma historia que la voz:
#   transición: atmósfera que entra con la cola del «I'M BACK!!» · espejo/tiempo perdido: tensión contenida + tic de reloj que acelera
#   «otra persona…»: entra el pulso y crece · «No necesitas…»: golpe en cada frase · «Hazlo…»: punto máximo, un golpe por frase
#   «Porque dentro de cinco años…»: se vacía · última pregunta: vuelve a crecer un poco · negro: silencio
import os, sys, json, math
import numpy as np
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, "..", "anuncios-v3", "comun"))
from sintesis import *
J = json.load(open(os.path.join(AQUI, "tiempos.json"))); A = J["anclas"]; L = J["frases"]
T0, TIEMPO, GOLPE, EXC, HAZ, RESP, PREG, CORTE, FIN = (A[k] for k in ("transicion", "tiempo", "golpe", "excusas", "hazlo", "respiro", "pregunta", "corte", "fin"))
DUR = FIN + 0.05
mus, fx = Pista(DUR), Pista(DUR)
ir = ir_sala(1.4, 6000, 0.012, 5); irg = ir_sala(3.8, 5000, 0.025, 13)
BPM = 100; B = 60 / BPM
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def tom(f0=95, f1=48, d=0.7, rg=0.25):
    t = t_(n_(d)); f = f1 + (f0 - f1) * np.exp(-t * 9)
    y = np.sin(2 * math.pi * np.cumsum(f) / SR) * np.exp(-t * 5) + lp(ruido(d), 900) * np.exp(-t * 30) * rg
    return sat(y, 1.6)
def tic(f=2800, d=0.05):
    t = t_(n_(d)); return (np.sin(2 * math.pi * f * t) * np.exp(-t * 120) + hp(ruido(d), 3000) * np.exp(-t * 200) * 0.6) * 0.5
def pad(notas, t0, t1, g, fc, a=None):
    d = t1 - t0
    if d < 0.1: return
    y = acorde([hz(m) for m in notas], d, fc=fc, a=a or min(1.0, d / 3), r=min(1.2, d / 2))
    mus.pon(reverb(pico(y, 0.5), irg, 0.5), t0, g, 0, 0.8)
def piano(f, d=1.6, fc=2400):
    t = t_(n_(d)); y = np.zeros_like(t)
    for r, g, dec in ((1, 1, 2.2), (2, .45, 3.2), (3, .22, 4.5), (4.02, .1, 6)): y += np.sin(2 * math.pi * f * r * t) * g * np.exp(-t * dec)
    return lp(y, fc) * 0.5

# ── transición: la atmósfera crece desde la cola de Goggins ──
pad([38, 45, 50, 53], T0 - 0.3, TIEMPO + 1.0, 0.09, 600, a=1.2)
mus.pon(pico(np.flip(reverb(piano(hz(62), 1.2), irg, 0.7)[:, 0]), 0.7), T0 - 0.9, 0.06)          # piano invertido que «aspira»
fx.pon(pico(caida_sub(2.2, 60, 24), 1.0), T0 + 0.35, 0.28)
# ── espejo y tiempo perdido: dron frío + tic de reloj que acelera ──
pad([38, 45, 50, 52], TIEMPO, GOLPE, 0.08, 700)
t = TIEMPO; k = 0
while t < GOLPE - 0.05:
    p = (t - TIEMPO) / max(0.1, GOLPE - TIEMPO)
    fx.pon(pico(tic(2600 if k % 2 else 3100), 1.0), t, 0.05 + 0.05 * p, 0.25 * (-1) ** k)
    t += 0.5 - 0.28 * p; k += 1
b = T0 + 0.6
while b < GOLPE:
    mus.pon(pico(lp(sine(hz(26), 0.3) * env_ad(0.3, 0.004, None, 7), 160), 1.0), b, 0.16); b += B * 2   # latido
# ── golpe: «otra persona está haciendo…» ──
mus.pon(pico(subida(1.4, 200, 7000), 0.7), GOLPE - 1.4, 0.10)
fx.pon(pico(impacto(2.2, 0.9), 1.0), GOLPE, 0.34)
PROG = [(38, [50, 57, 62, 65]), (34, [46, 53, 58, 62]), (41, [53, 57, 60, 65]), (36, [48, 55, 60, 64])]
def nivel(t):
    if t < GOLPE: return 0
    if t < EXC: return 0.35 + 0.25 * (t - GOLPE) / max(0.1, EXC - GOLPE)
    if t < HAZ: return 0.65 + 0.2 * (t - EXC) / max(0.1, HAZ - EXC)
    if t < RESP: return 1.0
    return 0
tb, j = GOLPE, 0
while tb < RESP - 0.05:
    raiz, ac = PROG[j % 4]; comp = min(4 * B, RESP - tb); n = nivel(tb + 0.01)
    pad(ac + ([ac[1] + 12, ac[2] + 12] if n > 0.9 else []), tb, tb + comp, 0.06 + 0.07 * n, 1000 + 3000 * n)
    bajo = saw(hz(raiz - 12), comp * 0.98) * env_ad(comp * 0.98, 0.02, None, 0.9)
    mus.pon(pico(lp(bajo, 180 + 260 * n), 0.9), tb, 0.08 + 0.1 * n)
    for q in range(16):
        tq = tb + q * B / 4
        if tq >= RESP - 0.02: break
        nq = nivel(tq)
        if q % 4 == 0: mus.pon(pico(bombo(0.4, 120, 42, 0.85, 1.0, 1.5), 1.0), tq, 0.18 + 0.2 * nq)
        if q % 2 == 0: mus.pon(pico(lp(saw(hz(raiz), 0.11) * env_ad(0.11, 0.004, None, 7), 500 + 700 * nq), 0.8), tq, 0.05 + 0.05 * nq)
        mus.pon(pico(pluck(hz(ac[[0, 2, 1, 3][q % 4]] + 12 + (12 if nq > 0.9 and q % 8 > 3 else 0)), 0.15, 2400 + 2400 * nq), 1.0), tq, 0.012 + 0.02 * nq, 0.45 * (-1) ** q)
        if nq > 0.5 and q % 2 == 1: mus.pon(pico(hat(False, 9500), 0.5), tq, 0.02 + 0.03 * nq, 0.35)
        if nq > 0.6 and q in (4, 12): mus.pon(reverb(pico(palmada(), 1.0), ir, 0.25), tq, 0.08 + 0.08 * nq)
        if nq > 0.4 and q in (6, 14): mus.pon(reverb(pico(tom(110, 55, 0.6), 1.0), irg, 0.3), tq, 0.08 + 0.12 * nq, -0.3)
        if nq > 0.9 and q in (10, 11, 15): mus.pon(reverb(pico(tom(85, 44, 0.7), 1.0), irg, 0.3), tq, 0.2, 0.3)
    tb += comp; j += 1
# un golpe por frase en «No necesitas…» y en «Hazlo…»
for i in J["golpes_medios"]: fx.pon(pico(tom(80, 40, 0.9, 0.4), 1.0), L[i][0] - 0.02, 0.22); fx.pon(pico(caida_sub(0.9, 70, 30), 1.0), L[i][0] - 0.02, 0.12)
for i in J["golpes_fuertes"]: fx.pon(pico(impacto(1.6, 0.8), 1.0), L[i][0] - 0.03, 0.30); fx.pon(reverb(pico(tom(70, 36, 1.0, 0.5), 1.0), irg, 0.3), L[i][0] - 0.03, 0.25)
mus.pon(pico(subida(1.6, 250, 9000), 0.7), HAZ - 1.6, 0.13)
# ── respiro: se vacía; piano y acorde ──
fx.pon(whoosh(0.8, 2000, 300, 0.4, -0.4), RESP - 0.3, 0.10)
pad([50, 57, 62, 65, 69], RESP, PREG + 0.2, 0.08, 1400)
for k, m in enumerate([62, 65, 69, 65, 62]):
    mus.pon(reverb(pico(piano(hz(m), 1.8), 1.0), irg, 0.45), RESP + 0.2 + k * B, 0.08)
# ── la pregunta: vuelve a crecer un poco, hasta el corte a negro ──
pad([46, 53, 58, 62, 65], PREG, CORTE, 0.10, 1800)
b = PREG
while b < CORTE - 0.05:
    mus.pon(pico(bombo(0.45, 110, 40, 0.8, 1.0, 1.4), 1.0), b, 0.16 + 0.1 * (b - PREG) / max(0.1, CORTE - PREG)); b += B
mus.pon(pico(subida(max(0.5, CORTE - PREG), 300, 6000), 0.6), PREG, 0.07)
# negro: corte seco con una cola mínima
for P in (mus, fx): P.corta(CORTE + 0.02, DUR, 0.06)
fx.pon(pico(caida_sub(0.8, 60, 30), 1.0), CORTE, 0.18)
escribe(os.path.join(AQUI, "audio", "musica.wav"), master(limitador(mus.x, 4.0), 0.9))
escribe(os.path.join(AQUI, "audio", "efectos.wav"), master(fx.x, 0.9))
print(f"banda: {DUR:.2f} s")
