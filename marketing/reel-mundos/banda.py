# Diseño de sonido y música del reel (todo sintetizado aquí, sin samples de terceros). Estilo tráiler: cada mundo tiene su sonido y cada corte, su golpe.
import os, sys, math
import numpy as np
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, "..", "anuncios-v3", "comun"))
from sintesis import *
RELOJ, COCHE, CASA, AJEDREZ, BOLAS, DRAGON, PART, MURO = 0.0, 2.6, 5.3, 8.5, 11.3, 14.1, 17.1, 20.7
LIM, DCODE, CTA = MURO + 1.25, MURO + 2.9, MURO + 5.4
DUR = CTA + 4.0
mus, fx = Pista(DUR), Pista(DUR)
ir = ir_sala(1.2, 7000, 0.010, 5); irg = ir_sala(3.6, 5500, 0.02, 13)
rng = np.random.default_rng(7)
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def pad(notas, t0, t1, g, fc, a=None, r=None):
    d = t1 - t0; y = acorde([hz(m) for m in notas], d, fc=fc, a=a or min(0.8, d / 3), r=r or min(1.0, d / 2))
    mus.pon(reverb(pico(y, 0.5), irg, 0.5), t0, g, 0, 0.8)
def metal(f, d=0.5, g=1.0):      # golpe metálico: parciales inarmónicos
    t = t_(n_(d)); y = sum(np.sin(2 * math.pi * f * r * t) * a * np.exp(-t * dec) for r, a, dec in ((1, 1, 9), (2.76, .5, 13), (5.4, .3, 18), (8.9, .18, 26)))
    return y * g + hp(ruido(d), 5000) * np.exp(-t * 90) * 0.4
def gota(f0=900, f1=300, d=0.18):
    t = t_(n_(d)); f = f1 + (f0 - f1) * np.exp(-t * 25); return np.sin(2 * math.pi * np.cumsum(f) / SR) * np.exp(-t * 16)
def tono(f0, f1, d, fc=3000):
    t = t_(n_(d)); f = f0 + (f1 - f0) * (t / d) ** 1.6; y = np.sin(2 * math.pi * np.cumsum(f) / SR) * 0.5 + np.sin(2 * math.pi * np.cumsum(f * 2.01) / SR) * 0.25
    return lp(y, fc) * np.minimum(1, t / 0.15) * np.minimum(1, (d - t) / 0.12)
def golpe(t, peso=1.0, g=0.4): fx.pon(pico(impacto(2.0 * peso, peso), 1.0), t, g); fx.pon(pico(caida_sub(1.1 * peso, 75, 30), 1.0), t, g * 0.55)

# ── 1 · RELOJ: zumbido, piezas que encajan una a una, golpe seco ──
pad([33, 45, 52], 0, 2.2, 0.10, 500, a=0.05)
mus.pon(pico(subida(1.6, 200, 7000), 0.7), 0.25, 0.13)
for k in range(7): fx.pon(reverb(pico(metal(1400 + 240 * k, 0.25), 1.0), ir, 0.2), 1.25 + 0.085 * k, 0.07 + 0.012 * k, 0.5 * (-1) ** k)
golpe(1.88, 1.0, 0.46); fx.pon(reverb(pico(metal(520, 0.9), 1.0), irg, 0.35), 1.88, 0.2)
for t in (2.0, 2.25, 2.5): fx.pon(pico(clic(), 1.0), t, 0.08)
# ── 2 · COCHE: arcos que pasan, motor que sube, corte al interior ──
golpe(COCHE, 0.9, 0.42)
d = CASA - COCHE; fx.pon(pico(tono(160, 760, d, 3200), 1.0), COCHE, 0.07)
fx.pon(pico(lp(hp(ruido(d), 300), 4200) * np.minimum(1, t_(n_(d)) / 0.4), 1.0), COCHE, 0.06, 0, 0.9)
k = 0; t = COCHE + 0.1
while t < CASA - 0.1:
    interior = t > COCHE + 1.25; fx.pon(whoosh(0.22, 700 if interior else 1400, 2600 if interior else 6000, -0.9 * (-1) ** k, 0.9 * (-1) ** k), t, 0.10 if interior else 0.15); t += 0.25 - 0.07 * (t - COCHE) / d; k += 1
fx.pon(pico(caida_sub(0.7, 90, 40), 1.0), COCHE + 1.25, 0.22); fx.pon(pico(bombo(0.4, 120, 42, 0.9, 1.0, 1.6), 1.0), COCHE + 1.25, 0.3)
mus.pon(pico(subida(1.2, 300, 9000), 0.7), CASA - 1.2, 0.12)
# ── 3 · CASA: silencio, agua y aire; las luces se encienden una a una ──
for P in (mus, fx): P.corta(CASA, CASA + 0.02, 0.01)
d = AJEDREZ - CASA; t = t_(n_(d)); mar = lp(ruido(d), 700) * (0.55 + 0.45 * np.sin(2 * math.pi * 0.42 * t)) * np.minimum(1, t / 0.3) * np.minimum(1, (d - t) / 0.3)
fx.pon(pico(mar, 1.0), CASA, 0.10, 0, 0.9)
pad([50, 57, 62, 66, 69], CASA + 0.1, AJEDREZ, 0.11, 1500, a=0.5)
for i in range(5): fx.pon(reverb(pico(campana(hz(74 + [0, 2, 4, 7, 9][i]), 1.0), 1.0), irg, 0.5), CASA + 0.7 + i * 0.16, 0.055, -0.6 + 0.3 * i)
fx.pon(whoosh(1.4, 250, 2200, 0, 0), AJEDREZ - 1.3, 0.09)
# ── 4 · AJEDREZ: golpe grave, tensión, piezas que se sueltan ──
golpe(AJEDREZ, 1.0, 0.44)
pad([38, 45, 50, 53], AJEDREZ, BOLAS, 0.12, 900, a=0.2)
mus.pon(pico(tono(hz(50), hz(57), BOLAS - AJEDREZ, 1400), 1.0), AJEDREZ, 0.045)
for k in range(14): fx.pon(reverb(pico(gota(500 + 400 * rng.random(), 160, 0.12), 1.0), ir, 0.3), AJEDREZ + 0.3 + 2.2 * rng.random(), 0.05, rng.uniform(-0.7, 0.7))
mus.pon(pico(subida(0.9, 300, 8000), 0.7), BOLAS - 0.9, 0.10)
# ── 5 · BOLAS: juguetón, burbujas y arpegio ──
golpe(BOLAS, 0.6, 0.3)
for k in range(46): fx.pon(pico(gota(700 + 900 * rng.random(), 260 + 200 * rng.random(), 0.1), 1.0), BOLAS + 0.05 + 2.7 * rng.random(), 0.05, rng.uniform(-0.8, 0.8))
ARP = [62, 66, 69, 74, 69, 66, 71, 74, 78, 74, 71, 66]
for k in range(22): mus.pon(reverb(pico(pluck(hz(ARP[k % 12] + 12), 0.22, 5200), 1.0), ir, 0.25), BOLAS + 0.1 + k * 0.125, 0.07, 0.5 * (-1) ** k)
for k in range(6): mus.pon(pico(bombo(0.34, 125, 46, 0.85, 1.0, 1.4), 1.0), BOLAS + k * 0.5, 0.26); mus.pon(pico(lp(saw(hz(38), 0.2) * env_ad(0.2, 0.005, None, 5), 420), 0.9), BOLAS + 0.25 + k * 0.5, 0.14)
# ── 6 · DRAGÓN: cada materia suena distinto ──
fx.pon(reverb(pico(campana(hz(88), 1.6), 1.0), irg, 0.5), DRAGON, 0.12); golpe(DRAGON, 0.5, 0.26)
pad([45, 52, 57, 60, 64], DRAGON, PART, 0.10, 1800, a=0.3)
for (a, b), tipo in zip(((0.45, 1.05), (1.2, 1.8), (1.95, 2.5)), ("oro", "liquido", "luz")):
    fx.pon(whoosh(b - a, 400, 6500, -0.5, 0.5), DRAGON + a, 0.13)
    if tipo == "oro": fx.pon(reverb(pico(metal(660, 1.0), 1.0), irg, 0.4), DRAGON + b - 0.08, 0.16)
    if tipo == "liquido":
        for j in range(5): fx.pon(reverb(pico(gota(1100 - 120 * j, 240, 0.2), 1.0), ir, 0.35), DRAGON + a + 0.1 * j, 0.09, 0.3 * (-1) ** j)
    if tipo == "luz": mus.pon(reverb(pico(acorde([hz(m) for m in (69, 76, 81, 85, 88)], 1.1, fc=7000, a=0.25, r=0.3), 0.5), irg, 0.6), DRAGON + a, 0.2, 0, 0.9)
mus.pon(pico(subida(0.9, 400, 11000), 0.7), PART - 0.9, 0.15)
# ── 7 · PARTÍCULAS: vacío, polvo que brilla, y la frase que cae ──
for P in (mus, fx): P.corta(PART, PART + 0.02, 0.01)
fx.pon(pico(caida_sub(1.6, 70, 26), 1.0), PART, 0.3)
d = 2.5; t = t_(n_(d)); polvo = hp(ruido(d), 6000) * (0.5 + 0.5 * np.sin(2 * math.pi * 7 * t + 3 * np.sin(2 * math.pi * 0.7 * t))) * np.minimum(1, t / 0.6) * np.minimum(1, (d - t) / 0.2)
fx.pon(pico(polvo, 1.0), PART + 0.05, 0.05, 0, 0.9)
pad([38, 50, 57, 62], PART + 0.1, PART + 2.55, 0.09, 700, a=0.8)
mus.pon(pico(subida(1.3, 250, 10000), 0.7), PART + 1.25, 0.17)
golpe(PART + 2.55, 1.0, 0.5); mus.pon(reverb(pico(acorde([hz(m) for m in (38, 50, 57, 62, 66, 69, 74)], 1.4, fc=5000, a=0.01, r=0.5), 0.5), irg, 0.5), PART + 2.55, 0.24, 0, 0.9)
# ── MURO: se abre el plano y entra el pulso ──
fx.pon(whoosh(1.1, 3000, 250, 0, 0), MURO, 0.16); golpe(MURO, 0.7, 0.32)
PROG = [(38, [50, 57, 62, 66]), (43, [55, 59, 62, 67])]
for j in range(3):
    tb = MURO + j * 1.0
    if tb >= DCODE - 0.05: break
    raiz, ac = PROG[j % 2]; pad(ac + [ac[2] + 12], tb, min(tb + 1.0, DCODE), 0.10, 3200)
    for q in range(8):
        tq = tb + q * 0.125
        if tq >= DCODE - 0.03: break
        if q % 4 == 0: mus.pon(pico(bombo(0.36, 125, 45, 0.9, 1.0, 1.5), 1.0), tq, 0.36)
        if q % 4 == 2: mus.pon(pico(lp(saw(hz(raiz - 12), 0.2) * env_ad(0.2, 0.005, None, 5), 420), 0.9), tq, 0.18)
        mus.pon(pico(hat(q % 4 == 2, 9500), 0.5), tq, 0.045, 0.3 * (-1) ** q)
        mus.pon(pico(pluck(hz(ac[[0, 2, 3, 1][q % 4]] + 12), 0.2, 4600), 1.0), tq, 0.035, 0.5 * (-1) ** q)
golpe(LIM, 0.6, 0.26); golpe(LIM + 0.75, 0.8, 0.32)
mus.pon(pico(subida(0.8, 400, 10000), 0.7), DCODE - 0.8, 0.14)
# ── D-CODE: golpe y acorde que resuelve ──
for P in (mus, fx): P.corta(DCODE, DCODE + 0.02, 0.01)
golpe(DCODE + 0.25, 1.0, 0.5)
mus.pon(reverb(pico(acorde([hz(m) for m in (38, 50, 57, 62, 66, 69, 74)], CTA - DCODE, fc=4200, a=0.02, r=0.8), 0.5), irg, 0.5), DCODE + 0.25, 0.22, 0, 0.9)
mus.pon(reverb(pico(campana(hz(86), 1.8), 1.0), irg, 0.5), DCODE + 0.25, 0.08)
# ── CTA: pulso limpio y un golpe en «WEB» ──
pad([38, 50, 57, 62, 66], CTA, DUR, 0.10, 1600, a=0.3, r=1.2)
fx.pon(pico(clic(), 1.0), CTA + 0.05, 0.12); fx.pon(whoosh(0.4, 500, 5000, -0.4, 0.4), CTA + 0.75, 0.1)
golpe(CTA + 1.05, 1.0, 0.5); mus.pon(reverb(pico(acorde([hz(m) for m in (62, 66, 69, 74, 78)], 1.6, fc=6000, a=0.01, r=0.6), 0.5), irg, 0.5), CTA + 1.05, 0.2, 0, 0.9)
fx.pon(reverb(pico(campana(hz(81), 1.0), 1.0), irg, 0.5), CTA + 2.0, 0.07); fx.pon(reverb(pico(campana(hz(86), 1.2), 1.0), irg, 0.5), CTA + 2.5, 0.06)
for k in range(8): mus.pon(pico(bombo(0.36, 120, 45, 0.85, 1.0, 1.4), 1.0), CTA + 1.05 + k * 0.5, 0.16 * (1 - k / 10))
x = master(limitador(mus.x, 4.0), 0.9) * 0.8 + master(limitador(fx.x, 3.0), 0.9) * 0.85
n = n_(0.6); x[-n:] *= np.linspace(1, 0, n)[:, None]
os.makedirs(os.path.join(AQUI, "audio"), exist_ok=True)
escribe(os.path.join(AQUI, "audio", "banda.wav"), master(x, 0.93)); print(f"banda: {DUR:.2f} s")
