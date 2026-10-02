#!/usr/bin/env python3
"""Banda sonora del Reel de D-Code, sintetizada entera con numpy (sin muestras ni música de terceros:
no hay nada con derechos de autor). 40 s, 48 kHz, estéreo. Uso: python3 scripts/v3/reel/audio.py salida.wav

Cortes del montaje (s): 2.5 claro · 6 hoy · 10 orden · 13.5 sistema · 19 IA · 22.5 noche · 25.5 Finance · 31 resultado · 34 cierre
"""
import sys
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR, DUR = 48000, 40.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
mezcla = np.zeros((N, 2))


def t_de(d): return np.arange(int(SR * d)) / SR
def filtro(x, tipo, f, orden=2): return sosfilt(butter(orden, np.array(f) / (SR / 2), btype=tipo, output="sos"), x)
def env(n, a, r, forma=2.0):
    e = np.ones(n); na, nr = min(n, int(a * SR)), min(n, int(r * SR))
    if na: e[:na] = np.linspace(0, 1, na) ** forma
    if nr: e[-nr:] *= np.linspace(1, 0, nr) ** forma
    return e
def poner(x, t0, g=1.0, pan=0.0):
    i = int(t0 * SR); x = x[: max(0, N - i)]
    if x.ndim == 1: x = np.stack([x * np.sqrt(0.5 * (1 - pan)), x * np.sqrt(0.5 * (1 + pan))], 1) * 1.414
    mezcla[i:i + len(x)] += x * g
def reverb(x, d=1.8, mojado=0.3):
    n = int(SR * d); ir = rng.standard_normal((n, 2)) * np.exp(-np.linspace(0, 7, n))[:, None]; ir = np.stack([filtro(ir[:, 0], "low", 5200), filtro(ir[:, 1], "low", 5200)], 1)
    y = np.stack([fftconvolve(x[:, k], ir[:, k])[: len(x) + n] for k in (0, 1)], 1); y /= np.max(np.abs(y)) + 1e-9
    seco = np.vstack([x, np.zeros((n, 2))]); k = min(len(seco), len(y)); return seco[:k] * (1 - mojado) + y[:k] * mojado * np.max(np.abs(x))


# ---------------------------------------------------------------- piezas
def viento(d, f0, f1, ancho=0.9):
    """Aire y papel: ruido filtrado cuya frecuencia central se mueve."""
    n = int(SR * d); r = rng.standard_normal(n + 4096); out = np.zeros(n); tramos = max(4, int(d * 9)); paso = n // tramos; sol = min(2048, paso // 2)
    for k in range(tramos):
        f = f0 * (f1 / f0) ** (k / (tramos - 1)); a = k * paso; b = min(n, a + paso + sol)
        seg = filtro(r[a:b + 2048], "band", [f * (1 - ancho / 2), min(f * (1 + ancho / 2), SR * 0.45)])[: b - a]
        v = np.hanning(2 * sol)
        if k: seg[:sol] *= v[:sol]
        if b - a > paso: seg[paso:] *= v[sol:sol + (b - a - paso)]
        out[a:b] += seg
    return out / (np.max(np.abs(out)) + 1e-9)
def aleteo(d, densidad):
    """Hojas que pasan cerca: ráfagas cortas de ruido agudo, repartidas en estéreo."""
    out = np.zeros((int(SR * d), 2))
    for _ in range(int(d * densidad)):
        n = int(SR * rng.uniform(0.03, 0.11)); x = filtro(rng.standard_normal(n), "band", [rng.uniform(1500, 3500), rng.uniform(5000, 9000)]) * env(n, 0.004, n / SR * 0.8)
        i = int(rng.uniform(0, d - 0.12) * SR); p = rng.uniform(-0.9, 0.9); g = rng.uniform(0.2, 1.0)
        out[i:i + n, 0] += x * g * (1 - p) / 2; out[i:i + n, 1] += x * g * (1 + p) / 2
    return out
def golpe(grave=52, d=1.6, cuerpo=1.0):
    """Impacto: un grave que cae, un chasquido y una cola de aire."""
    t = t_de(d); f = grave * (1 + 2.2 * np.exp(-t * 26)); sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2) * cuerpo
    clic = filtro(rng.standard_normal(len(t)), "band", [900, 6000]) * np.exp(-t * 60) * 0.5
    aire = filtro(rng.standard_normal(len(t)), "low", 2400) * np.exp(-t * 4.5) * 0.35
    return np.tanh((sub + clic + aire) * 1.4)
def subida(d, f0=180, f1=1400):
    t = t_de(d); f = f0 * (f1 / f0) ** (t / d); tono = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25
    return (tono + viento(d, 500, 6000) * 0.8) * (t / d) ** 2.4
def acorde(notas, d, brillo=1400, ataque=1.2, suelta=1.6):
    """Colchón: sierras desafinadas, filtradas, de entrada lenta."""
    t = t_de(d); out = np.zeros((len(t), 2))
    for f in notas:
        for des, pan in ((-0.006, -0.6), (0.0, 0.0), (0.007, 0.6)):
            fase = (f * (1 + des) * t + rng.uniform()) % 1.0; s = 2 * fase - 1
            out[:, 0] += s * (1 - pan) / 2; out[:, 1] += s * (1 + pan) / 2
    out = np.stack([filtro(out[:, k], "low", brillo, 4) for k in (0, 1)], 1)
    return out / (np.max(np.abs(out)) + 1e-9) * env(len(t), ataque, suelta)[:, None]
def bombo(): t = t_de(0.32); return np.sin(2 * np.pi * np.cumsum(46 * (1 + 1.6 * np.exp(-t * 34))) / SR) * np.exp(-t * 11)
def tic(f=6500, d=0.035): n = int(SR * d); return filtro(rng.standard_normal(n), "high", f) * np.exp(-np.arange(n) / (SR * d * 0.25))
def nota(f, d=0.5, brillo=3.0):
    """Pulsación tipo campana breve: cada dato que entra en el registro."""
    t = t_de(d); return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.01 * t) * np.exp(-t * 9 * brillo / 3) + 0.15 * np.sin(2 * np.pi * f * 3.02 * t) * np.exp(-t * 16)) * np.exp(-t * 7) * env(len(t), 0.003, 0.05, 1)
def toque(): t = t_de(0.05); return np.sin(2 * np.pi * 320 * t) * np.exp(-t * 90)


HZ = lambda n: 440 * 2 ** ((n - 69) / 12)
RE_M, SIB, FA, DO = [HZ(n) for n in (38, 50, 57, 62, 65)], [HZ(n) for n in (34, 46, 53, 58, 62)], [HZ(n) for n in (41, 53, 57, 60, 65)], [HZ(n) for n in (36, 48, 55, 60, 64)]

# ------------------------------------------------- 0–2.5 · la tormenta
poner(viento(2.7, 260, 1500) * env(int(2.7 * SR), 0.5, 0.12), 0.0, 0.42)
poner(aleteo(2.5, 26), 0.0, 0.5)
poner(subida(1.1, 140, 900), 1.42, 0.5)
# ------------------------------------------------- 2.5 · se abre el claro
poner(reverb(np.stack([golpe(50, 1.8)] * 2, 1), 2.6, 0.34), 2.5, 0.95)
poner(viento(2.2, 2400, 380) * env(int(2.2 * SR), 0.01, 1.8), 2.5, 0.2)
# ------------------------------------------------- colchón de 2.5 a 40
for k, (ac, t0) in enumerate([(RE_M, 2.5), (SIB, 6.0), (RE_M, 10.0), (FA, 13.5), (SIB, 17.0), (RE_M, 19.0), (SIB, 22.5), (DO, 25.5), (FA, 28.5), (SIB, 31.0), (RE_M, 34.0), (RE_M, 37.0)]):
    d = [3.9, 4.4, 3.9, 3.9, 2.4, 3.9, 3.4, 3.4, 2.9, 3.4, 3.4, 3.6][k]
    brillo = 700 if 22.5 <= t0 < 25.5 else 1100 if t0 < 13.5 else 1700 if t0 < 34 else 2300
    poner(acorde(ac, d + 0.9, brillo), t0 - 0.2, 0.13 if t0 < 34 else 0.17)
# ------------------------------------------------- pulso (120 ppm) desde «hoy»
for k in range(int((34.0 - 6.0) / 0.5)):
    t0 = 6.0 + k * 0.5
    if 10.6 < t0 < 13.4 or 22.4 < t0 < 25.4: continue                    # se calla mientras se mantiene pulsado y de noche
    poner(bombo(), t0, 0.5 if t0 >= 13.5 else 0.3)
    if t0 >= 13.5: poner(tic(), t0 + 0.25, 0.07, rng.uniform(-0.5, 0.5))
    if t0 >= 25.5 and k % 2 == 0: poner(tic(8000, 0.02), t0 + 0.125, 0.045, 0.4)
# ------------------------------------------------- cortes: un soplo en cada uno
for t0 in (6.0, 10.0, 13.5, 19.0, 22.5, 25.5, 31.0):
    poner(viento(0.42, 700, 3200) * env(int(0.42 * SR), 0.3, 0.1), t0 - 0.34, 0.22)
    poner(golpe(58, 0.7, 0.7), t0, 0.34)
# ------------------------------------------------- 6–10 · hoy: el tiempo se frena
poner(viento(3.6, 900, 220) * env(int(3.6 * SR), 0.2, 2.0), 6.1, 0.13)
poner(aleteo(3.6, 3), 6.3, 0.25)
# ------------------------------------------------- 10–13.5 · mantener pulsado
poner(toque(), 10.66, 0.5)
poner(subida(1.9, 220, 880), 10.7, 0.32)
poner(reverb(np.stack([nota(HZ(74), 0.9)] * 2, 1), 1.4, 0.4), 12.58, 0.3)
poner(aleteo(0.9, 14), 12.62, 0.3)
# ------------------------------------------------- 13.5–19 · el caos se ordena
poner(viento(2.6, 3200, 300) * env(int(2.6 * SR), 0.05, 1.6), 13.7, 0.3)
for k in range(46):                                                      # hojas que caen en su sitio, cada vez más seguidas
    t0 = 14.0 + 2.6 * (k / 46) ** 0.62; poner(tic(rng.uniform(2500, 5200), 0.03), t0, 0.12 * (0.5 + k / 46), rng.uniform(-0.8, 0.8))
poner(toque(), 17.63, 0.5); poner(nota(HZ(69), 0.5), 17.66, 0.16)
# ------------------------------------------------- 19–22.5 · la lectura
for k in range(4):
    t = t_de(0.5); barrido = np.sin(2 * np.pi * np.cumsum(1500 + 900 * t / 0.5) / SR) * env(len(t), 0.05, 0.3) * 0.5
    poner(barrido, 19.5 + k * 0.8, 0.06, 0.3 if k % 2 else -0.3); poner(nota(HZ(81), 0.3), 19.95 + k * 0.8, 0.07, -0.2)
# ------------------------------------------------- 22.5–25.5 · la noche
for k in range(6): poner(tic(1800, 0.015), 22.75 + k * 0.5, 0.1, 0.0)
poner(viento(3.0, 300, 420, 0.5) * env(int(3.0 * SR), 0.8, 0.8), 22.5, 0.1)
# ------------------------------------------------- 25.5–31 · Finance
poner(toque(), 26.3, 0.55)
t = t_de(2.3); poner((np.sin(2 * np.pi * np.cumsum(700 + 1500 * (t / 2.3) ** 1.5) / SR) * 0.3 + viento(2.3, 1800, 5200, 0.5) * 0.5) * env(len(t), 0.15, 0.3), 26.35, 0.11)
for k, (campo_t, n) in enumerate([(26.62, 74), (26.7, 76), (26.92, 77), (27.92, 81), (28.02, 79), (28.2, 86), (28.22, 84)]):
    poner(nota(HZ(n), 0.45), campo_t + 0.6, 0.14, -0.4 + k * 0.13)
poner(reverb(np.stack([nota(HZ(86), 0.9) + nota(HZ(93), 0.9) * 0.5] * 2, 1), 1.6, 0.4), 29.4, 0.22)
# ------------------------------------------------- 31–34 · el conjunto, y la subida al cierre
poner(subida(2.2, 160, 1300), 31.8, 0.42)
# ------------------------------------------------- 34 · cierre
poner(reverb(np.stack([golpe(46, 2.2, 1.1)] * 2, 1), 3.0, 0.38), 34.0, 1.0)
for k, n in enumerate((62, 69, 74, 77)): poner(reverb(np.stack([nota(HZ(n), 1.4, 2)] * 2, 1), 2.2, 0.45), 34.05 + k * 0.09, 0.12)
poner(reverb(np.stack([golpe(54, 1.2, 0.8)] * 2, 1), 2.2, 0.36), 37.2, 0.5)
poner(reverb(np.stack([nota(HZ(86), 1.6, 2)] * 2, 1), 2.4, 0.5), 37.77, 0.15)

# ------------------------------------------------- mezcla final
mezcla = np.stack([filtro(mezcla[:, k], "high", 28) for k in (0, 1)], 1)
mezcla *= env(N, 0.02, 1.6)[:, None]
mezcla = np.tanh(mezcla / (np.percentile(np.abs(mezcla), 99.9) + 1e-9) * 1.25) * 0.89
from scipy.io import wavfile
wavfile.write(sys.argv[1] if len(sys.argv) > 1 else "reel.wav", SR, (mezcla * 32767).astype(np.int16))
print("audio:", DUR, "s · pico", round(float(np.max(np.abs(mezcla))), 3))
