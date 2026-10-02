#!/usr/bin/env python3
"""Banda sonora del Reel «la máquina», sintetizada entera con numpy (sin muestras ni música de terceros:
no hay nada con derechos de autor). 32 s, 48 kHz, estéreo. Uso: python3 scripts/v4/reel/audio.py salida.wav

Es el sonido de un mecanismo: escape, engranajes, carraca, campana, y un pulso a 120 ppm al que van los cortes.
Cortes del montaje (s): 0 dentro · 1.0 estallido · 2.5 web · 5 se monta · 7 azul · 8 marcha · 9.5 leva · 10.5 noche ·
12.5 Finance · 17.5 registro · 18.5 campana (19.0) · 19.5 tapa (cae en 21.5) · 22 tu nombre · 26.5 cierre
"""
import sys
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR, DUR = 48000, 32.0
N = int(SR * DUR)
rng = np.random.default_rng(11)
mezcla = np.zeros((N, 2))


def t_de(d): return np.arange(int(SR * d)) / SR
def filtro(x, tipo, f, orden=2): return sosfilt(butter(orden, np.array(f) / (SR / 2), btype=tipo, output="sos"), x)
def env(n, a, r, forma=2.0):
    e = np.ones(n); na, nr = min(n, int(a * SR)), min(n, int(r * SR))
    if na: e[:na] = np.linspace(0, 1, na) ** forma
    if nr: e[-nr:] *= np.linspace(1, 0, nr) ** forma
    return e
def poner(x, t0, g=1.0, pan=0.0):
    i = int(t0 * SR)
    if i < 0: x = x[-i:]; i = 0
    x = x[: max(0, N - i)]
    if x.ndim == 1: x = np.stack([x * np.sqrt(0.5 * (1 - pan)), x * np.sqrt(0.5 * (1 + pan))], 1) * 1.414
    mezcla[i:i + len(x)] += x * g
def reverb(x, d=1.8, mojado=0.3, brillo=5200):
    if x.ndim == 1: x = np.stack([x, x], 1)
    n = int(SR * d); ir = rng.standard_normal((n, 2)) * np.exp(-np.linspace(0, 7, n))[:, None]; ir = np.stack([filtro(ir[:, 0], "low", brillo), filtro(ir[:, 1], "low", brillo)], 1)
    y = np.stack([fftconvolve(x[:, k], ir[:, k])[: len(x) + n] for k in (0, 1)], 1); y /= np.max(np.abs(y)) + 1e-9
    seco = np.vstack([x, np.zeros((n, 2))]); k = min(len(seco), len(y)); return seco[:k] * (1 - mojado) + y[:k] * mojado * np.max(np.abs(x))


# ---------------------------------------------------------------- las piezas del sonido
def viento(d, f0, f1, ancho=0.9):
    """Aire: ruido filtrado cuya frecuencia central se mueve."""
    n = int(SR * d); r = rng.standard_normal(n + 4096); out = np.zeros(n); tramos = max(4, int(d * 9)); paso = n // tramos; sol = min(2048, paso // 2)
    for k in range(tramos):
        f = f0 * (f1 / f0) ** (k / (tramos - 1)); a = k * paso; b = min(n, a + paso + sol)
        seg = filtro(r[a:b + 2048], "band", [f * (1 - ancho / 2), min(f * (1 + ancho / 2), SR * 0.45)])[: b - a]
        v = np.hanning(2 * sol)
        if k: seg[:sol] *= v[:sol]
        if b - a > paso: seg[paso:] *= v[sol:sol + (b - a - paso)]
        out[a:b] += seg
    return out / (np.max(np.abs(out)) + 1e-9)
def tic(f=3200, d=0.03, q=0.5):
    """El golpe de un diente: un chasquido con algo de tono, como metal pequeño."""
    n = int(SR * d); t = np.arange(n) / SR
    return (filtro(rng.standard_normal(n), "band", [f * (1 - q / 2), min(f * (1 + q / 2), SR * 0.45)]) * 0.8 + np.sin(2 * np.pi * f * t) * 0.5) * np.exp(-t / (d * 0.22))
def metal(f, d=0.6, cae=6.0):
    """Una pieza de metal que suena: parciales de barra, que no son armónicos."""
    t = t_de(d); x = np.zeros(len(t))
    for r, a, c in ((1, 1, 1), (2.76, 0.55, 1.6), (5.4, 0.3, 2.6), (8.93, 0.16, 4.0)):
        if f * r < SR * 0.45: x += a * np.sin(2 * np.pi * f * r * t + rng.uniform(0, 6)) * np.exp(-t * cae * c)
    return x * env(len(t), 0.002, 0.02, 1)
def campana(f, d=3.2):
    """Campana: parciales de campana (zumbido, fundamental, tercera menor, quinta, nominal…)."""
    t = t_de(d); x = np.zeros(len(t))
    for r, a, c in ((0.5, 0.45, 0.7), (1.0, 1.0, 1.0), (1.19, 0.6, 1.4), (1.5, 0.35, 1.8), (2.0, 0.7, 1.6), (2.51, 0.3, 2.6), (3.0, 0.22, 3.2), (4.2, 0.14, 4.5)):
        x += a * np.sin(2 * np.pi * f * r * t + rng.uniform(0, 6)) * np.exp(-t * 1.5 * c)
    golpe_ = filtro(rng.standard_normal(len(t)), "band", [1800, 7000]) * np.exp(-t * 180) * 0.6
    return (x / 3.2 + golpe_) * env(len(t), 0.001, 0.3, 1)
def impacto(grave=50, d=1.6, cuerpo=1.0):
    """Impacto: un grave que cae, un chasquido y una cola de aire."""
    t = t_de(d); f = grave * (1 + 2.2 * np.exp(-t * 26)); sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2) * cuerpo
    clic = filtro(rng.standard_normal(len(t)), "band", [900, 6000]) * np.exp(-t * 60) * 0.5
    aire = filtro(rng.standard_normal(len(t)), "low", 2400) * np.exp(-t * 4.5) * 0.35
    return np.tanh((sub + clic + aire) * 1.4)
def engranaje(d, f0, f1, g0=1.0, g1=1.0):
    """El zumbido de un tren de ruedas: un diente tras otro, con su vaivén."""
    t = t_de(d); f = f0 * (f1 / f0) ** (t / d); fase = np.cumsum(f) / SR
    x = (2 * (fase % 1) - 1) * 0.5 + np.sin(2 * np.pi * fase * 2.01) * 0.25
    x = filtro(x, "band", [300, 3400]) * (0.75 + 0.25 * np.sin(2 * np.pi * 7.3 * t)) + filtro(rng.standard_normal(len(t)), "band", [1500, 5000]) * 0.12
    return x * np.linspace(g0, g1, len(t))
def carraca(t0, n, d, curva=1.0, f=3600, g=0.2, pan=0.0, sube=0.0):
    """Clics seguidos (una carraca, un tambor de cifras): curva < 1 frena, curva > 1 acelera."""
    for k in range(n):
        poner(tic(f * (1 + sube * k / n) * rng.uniform(0.93, 1.07), 0.022), t0 + d * (k / n) ** curva, g * rng.uniform(0.7, 1.0), pan + rng.uniform(-0.25, 0.25))
def subida(d, f0=180, f1=1400):
    t = t_de(d); f = f0 * (f1 / f0) ** (t / d); tono = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25
    return (tono + viento(d, 500, 6000) * 0.8) * (t / d) ** 2.4
def acorde(notas, d, brillo=1400, ataque=1.0, suelta=1.4):
    """Colchón: sierras desafinadas, filtradas, de entrada lenta."""
    t = t_de(d); out = np.zeros((len(t), 2))
    for f in notas:
        for des, pan in ((-0.006, -0.6), (0.0, 0.0), (0.007, 0.6)):
            fase = (f * (1 + des) * t + rng.uniform()) % 1.0; s = 2 * fase - 1
            out[:, 0] += s * (1 - pan) / 2; out[:, 1] += s * (1 + pan) / 2
    out = np.stack([filtro(out[:, k], "low", brillo, 4) for k in (0, 1)], 1)
    return out / (np.max(np.abs(out)) + 1e-9) * env(len(t), ataque, suelta)[:, None]
def bombo(): t = t_de(0.32); return np.sin(2 * np.pi * np.cumsum(46 * (1 + 1.6 * np.exp(-t * 34))) / SR) * np.exp(-t * 11)
def nota(f, d=0.5):
    t = t_de(d); return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.01 * t) * np.exp(-t * 9) + 0.15 * np.sin(2 * np.pi * f * 3.02 * t) * np.exp(-t * 16)) * np.exp(-t * 7) * env(len(t), 0.003, 0.05, 1)
def toque(): t = t_de(0.05); return np.sin(2 * np.pi * 320 * t) * np.exp(-t * 90)
def suma(*xs):
    n = max(len(x) for x in xs); o = np.zeros(n)
    for x in xs: o[:len(x)] += x
    return o
def tecla(): return suma(tic(rng.uniform(1700, 2300), 0.028, 0.9) * 0.8, toque() * 0.6)


HZ = lambda n: 440 * 2 ** ((n - 69) / 12)
RE_M, SIB, FA, DO, RE = [HZ(n) for n in (38, 50, 57, 62, 65)], [HZ(n) for n in (34, 46, 53, 58, 62)], [HZ(n) for n in (41, 53, 57, 60, 65)], [HZ(n) for n in (36, 48, 55, 60, 64)], [HZ(n) for n in (38, 50, 57, 62, 66)]

# ------------------------------------------------- 0–1.0 · DENTRO: el escape acelera, los engranajes suben
poner(metal(1320, 0.5, 9), 0.0, 0.32, -0.2); poner(impacto(70, 0.5, 0.6), 0.0, 0.4)      # suena desde el primer cuadro
ts, t0, paso = [], 0.02, 0.105
while t0 < 0.99: ts.append(t0); t0 += paso; paso *= 0.9
for k, x in enumerate(ts): poner(tic(2600 if k % 2 else 3500, 0.03), x, 0.32 + 0.3 * k / len(ts), -0.3 if k % 2 else 0.3)
poner(engranaje(1.02, 150, 620, 0.25, 1.0), 0.0, 0.2)
poner(subida(0.95, 200, 1700), 0.06, 0.5)
# ------------------------------------------------- 1.0 · ESTALLIDO: la máquina salta en piezas
poner(reverb(impacto(46, 2.0, 1.2), 2.6, 0.36), 1.0, 1.0)
for k in range(44):                                                       # las piezas pasan junto a la cámara y se alejan
    x = 1.0 + 1.5 * (k / 44) ** 1.7 + rng.uniform(0, 0.03)
    poner(metal(rng.uniform(1400, 6200), rng.uniform(0.25, 0.7), rng.uniform(5, 11)), x, 0.2 * (1 - k / 60), rng.uniform(-0.9, 0.9))
poner(viento(1.3, 3200, 500) * env(int(1.3 * SR), 0.01, 1.1), 1.0, 0.36)
# ------------------------------------------------- colchón de 2.5 al final
for (ac, t0, d, brillo, g) in [(RE_M, 2.5, 2.7, 1500, 0.3), (SIB, 5.0, 2.2, 1300, 0.12), (FA, 7.0, 1.2, 1500, 0.12), (RE_M, 8.0, 2.7, 1700, 0.12), (SIB, 10.5, 2.2, 520, 0.16), (DO, 12.5, 2.7, 1300, 0.11), (FA, 15.0, 2.7, 1500, 0.11),
                              (SIB, 17.5, 2.2, 1500, 0.11), (DO, 19.5, 2.7, 1100, 0.13), (RE_M, 22.0, 2.4, 1500, 0.12), (SIB, 24.2, 2.5, 1700, 0.12), (RE, 26.5, 5.6, 2300, 0.18)]:
    poner(acorde(ac, d + 0.8, brillo), t0 - 0.15, g)
# ------------------------------------------------- 2.5 · ES UNA WEB: el título entra
poner(tic(5200, 0.02), 2.62, 0.16); poner(tic(5200, 0.02), 2.76, 0.14); poner(reverb(nota(HZ(74), 0.7), 1.4, 0.4), 2.62, 0.12)
poner(viento(0.85, 600, 3600) * env(int(0.85 * SR), 0.6, 0.06), 4.2, 0.3)          # el dedo desliza
for k in range(9): poner(tic(2600 if k % 2 else 3400, 0.028), 2.75 + k * 0.25, 0.1, -0.25 if k % 2 else 0.25)   # el escape, lejos: el silencio tras el estallido no es un vacío
# ------------------------------------------------- pulso (120 ppm) desde que se monta
for k in range(int((26.5 - 5.0) / 0.5)):
    t0 = 5.0 + k * 0.5
    if 10.4 < t0 < 12.4 or 19.4 < t0 < 21.9: continue                     # se calla de noche y mientras baja la tapa
    poner(bombo(), t0, 0.5 if t0 < 12.5 or t0 >= 22 else 0.36)
    if t0 >= 8.0: poner(tic(7200, 0.02), t0 + 0.25, 0.07, rng.uniform(-0.5, 0.5))
# ------------------------------------------------- cortes: un soplo y un golpe en cada uno
for t0, g in ((5.0, 1.0), (7.0, 0.7), (8.0, 0.8), (9.5, 0.6), (10.5, 0.8), (12.5, 0.9), (17.5, 0.7), (18.5, 0.6), (19.5, 0.9), (22.0, 0.8)):
    poner(viento(0.36, 700, 3400) * env(int(0.36 * SR), 0.3, 0.08), t0 - 0.3, 0.2 * g)
    poner(impacto(58, 0.7, 0.7), t0, 0.34 * g)
# ------------------------------------------------- 5–7 · SE MONTA: cada pieza cae en su sitio, cada vez más seguidas
for k in range(64):
    x = 5.08 + 1.8 * (k / 64) ** 0.7
    poner(tic(rng.uniform(2200, 5600), 0.03), x, 0.1 + 0.12 * k / 64, rng.uniform(-0.85, 0.85))
    if k % 5 == 0: poner(metal(rng.uniform(900, 2600), 0.3, 12), x, 0.07, rng.uniform(-0.7, 0.7))
poner(engranaje(1.9, 90, 240, 0.2, 0.9), 5.05, 0.1)
# ------------------------------------------------- 7–8 · LAS RUEDAS AZULES entran y engranan
poner(reverb(nota(HZ(81), 0.9), 1.8, 0.45), 7.28, 0.2, -0.2); poner(reverb(nota(HZ(86), 0.9), 1.8, 0.45), 7.52, 0.18, 0.2)
carraca(7.55, 12, 0.4, 0.8, 4200, 0.13)
# ------------------------------------------------- 8–10.5 · EN MARCHA: el escape, regular
for k in range(int(2.5 * 8)):
    poner(tic(2600 if k % 2 else 3400, 0.028), 8.0 + k * 0.125, 0.15 if k % 4 else 0.22, -0.25 if k % 2 else 0.25)
poner(engranaje(2.5, 210, 230, 1, 1), 8.0, 0.075)
for k in range(4):                                                        # la cremallera va y viene
    poner(viento(0.22, 1400 if k % 2 else 2600, 2600 if k % 2 else 1400, 0.6) * env(int(0.22 * SR), 0.08, 0.1), 9.55 + k * 0.25, 0.14, 0.3)
# ------------------------------------------------- 10.5–12.5 · LA NOCHE: la luz se va, la máquina sigue
t = t_de(0.7); poner(np.sin(2 * np.pi * np.cumsum(520 * np.exp(-t * 3.4) + 60) / SR) * env(len(t), 0.01, 0.4) * 0.5, 10.55, 0.22)
for k in range(16): poner(reverb(tic(2400 if k % 2 else 3100, 0.025) * 0.8, 0.9, 0.5, 3000), 10.62 + k * 0.125, 0.085, -0.2 if k % 2 else 0.2)
for k in range(9): poner(reverb(nota(HZ(rng.choice([86, 89, 93, 98])), 0.5), 1.6, 0.6), 10.9 + k * 0.17 + rng.uniform(0, 0.05), 0.05, rng.uniform(-0.8, 0.8))   # los zafiros
# ------------------------------------------------- 12.5–17.5 · FINANCE: se toca, lee, registra y avisa
poner(toque(), 13.23, 0.6)
t = t_de(2.35); poner((np.sin(2 * np.pi * np.cumsum(700 + 1500 * (t / 2.35) ** 1.5) / SR) * 0.3 + viento(2.35, 1800, 5200, 0.5) * 0.5) * env(len(t), 0.15, 0.3), 13.28, 0.1)
for k, (campo_t, n) in enumerate([(13.60, 74), (13.69, 76), (13.88, 77), (14.68, 81), (14.76, 79), (14.91, 86), (14.93, 84)]):
    poner(tic(4600, 0.02), campo_t, 0.1); poner(nota(HZ(n), 0.45), campo_t + 0.68, 0.14, -0.4 + k * 0.13)
poner(reverb(suma(campana(HZ(86), 1.8) * 0.7, nota(HZ(93), 0.9) * 0.3), 1.8, 0.4), 16.47, 0.3)     # «pago programado»
# ------------------------------------------------- 17.5–18.5 · EL REGISTRO: los tambores giran hasta la cifra
carraca(17.52, 30, 0.85, 0.55, 3000, 0.2, 0.0, 0.25); poner(metal(1500, 0.35, 10), 18.4, 0.14)
# ------------------------------------------------- 18.5–19.5 · LA CAMPANA
poner(subida(0.42, 300, 1500), 18.55, 0.3)
poner(reverb(campana(HZ(81), 3.4), 3.0, 0.42), 19.0, 0.62)
# ------------------------------------------------- 19.5–22 · LA TAPA baja y cierra
poner(viento(1.9, 900, 110) * env(int(1.9 * SR), 0.5, 0.12), 19.6, 0.4)
poner(engranaje(1.9, 200, 130, 0.5, 0.2), 19.6, 0.07)
poner(reverb(impacto(40, 2.2, 1.3), 2.8, 0.4), 21.5, 0.95); poner(metal(820, 0.6, 7), 21.5, 0.2); poner(tic(3000, 0.03), 21.62, 0.2)
# ------------------------------------------------- 22–26.5 · TU NOMBRE: se toca, se escribe, y la máquina lo graba
poner(toque(), 22.57, 0.6)
for k, letra in enumerate("Talleres Luna"):
    x = 22.0 + (24 + 5 * k) / 30
    poner(tecla(), x, 0.34 if letra != " " else 0.2, -0.3 + 0.05 * k)
    if letra != " ": poner(metal(rng.uniform(3200, 4800), 0.18, 16), x + 0.02, 0.08, 0.2)   # el buril
poner(reverb(suma(nota(HZ(86), 0.9), nota(HZ(90), 0.9) * 0.6), 1.8, 0.45), 25.0, 0.16)
poner(subida(1.2, 200, 1500), 25.3, 0.34)
# ------------------------------------------------- 26.5 · CIERRE
poner(reverb(impacto(44, 2.4, 1.2), 3.2, 0.4), 26.5, 1.0)
for k, n in enumerate((62, 69, 74, 78)): poner(reverb(nota(HZ(n), 1.4), 2.2, 0.45), 26.55 + k * 0.09, 0.11)
poner(reverb(campana(HZ(74), 3.6), 3.2, 0.45), 27.4, 0.34)                                   # «¿Quieres una web así?»
for k in range(14): poner(tic(2600 if k % 2 else 3400, 0.028), 27.5 + k * 0.25, 0.1 * (1 - k / 16), -0.25 if k % 2 else 0.25)
poner(reverb(nota(HZ(86), 1.6), 2.4, 0.5), 28.93, 0.13)

# ------------------------------------------------- mezcla final
mezcla = np.stack([filtro(mezcla[:, k], "high", 28) for k in (0, 1)], 1)
mezcla *= env(N, 0.004, 1.5)[:, None]
mezcla = np.tanh(mezcla / (np.percentile(np.abs(mezcla), 99.9) + 1e-9) * 1.25) * 0.89
from scipy.io import wavfile
wavfile.write(sys.argv[1] if len(sys.argv) > 1 else "reel.wav", SR, (mezcla * 32767).astype(np.int16))
print("audio:", DUR, "s · pico", round(float(np.max(np.abs(mezcla))), 3))
