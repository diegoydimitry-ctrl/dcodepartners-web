#!/usr/bin/env python3
"""
Banda sonora y sonido del anuncio «Esto no es un vídeo» (33,5 s, 120 BPM).

Todo se sintetiza aquí, sin muestras ni librerías de sonido: pista original y
libre de derechos por construcción. Va cuadrada con los cortes del montaje
(montaje.html), que caen en la rejilla de 120 BPM (un pulso = 0,5 s).

    0.0 – 2.5   tensión: zumbido grave, pulso apagado y un subidón hacia el corte
    2.5         golpe: aparece el juego · entra el ritmo
    5.0 – 9.0   cuatro creaciones, un acento en cada corte
    9.0 – 15.5  ritmo estable · clics en los toques de la app
   15.5 – 23.0  respiro: teclas al escribir la instrucción, textura de código
   23.0 – 25.5  subida · 25.5 golpe con todo a la vez
   27.5 – 33.5  cierre: acorde abierto, firma de marca y final

Uso:  python3 audio.py salida.wav [A|B]
"""
import sys
import numpy as np
from scipy import signal

SR = 48000
DUR = 33.5
N = int(SR * DUR)
BPM = 120
PULSO = 60 / BPM
rng = np.random.default_rng(20261013)
version = sys.argv[2] if len(sys.argv) > 2 else 'A'

L = np.zeros(N); R = np.zeros(N)
envio = np.zeros((2, N))          # bus de reverberación


def t_(d): return np.arange(int(d * SR)) / SR


def pon(t0, x, pan=0.0, rev=0.0, g=1.0):
    i0 = int(t0 * SR)
    if i0 >= N: return
    x = x[: N - i0] * g
    gl, gr = np.sqrt((1 - pan) / 2) * 1.414, np.sqrt((1 + pan) / 2) * 1.414
    L[i0:i0 + len(x)] += x * gl; R[i0:i0 + len(x)] += x * gr
    if rev:
        envio[0, i0:i0 + len(x)] += x * gl * rev; envio[1, i0:i0 + len(x)] += x * gr * rev


def pon_st(t0, xl, xr, rev=0.0, g=1.0):
    i0 = int(t0 * SR)
    n = min(len(xl), N - i0)
    L[i0:i0 + n] += xl[:n] * g; R[i0:i0 + n] += xr[:n] * g
    if rev:
        envio[0, i0:i0 + n] += xl[:n] * g * rev; envio[1, i0:i0 + n] += xr[:n] * g * rev


def filtro(x, tipo, f, orden=2):
    sos = signal.butter(orden, f, btype=tipo, fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def nota(n):  # n en semitonos respecto a La 440
    return 440.0 * 2 ** (n / 12)


def sierra(f, d, det=0.0):
    t = t_(d)
    x = np.zeros_like(t)
    for k in range(1, 40):
        if f * k > SR / 2.4: break
        x += np.sin(2 * np.pi * f * k * t * (1 + det)) / k
    return x * 0.55


def env(n, a, r, sost=1.0):
    e = np.ones(n) * sost
    na = max(1, int(a * SR)); nr = max(1, int(r * SR))
    e[:na] = np.linspace(0, sost, na)
    if nr < n: e[-nr:] *= np.linspace(1, 0, nr)
    return e


# ------------------------------------------------------------ instrumentos
def bombo(g=1.0):
    t = t_(0.5)
    f = 46 + 110 * np.exp(-t * 28)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5)
    x += filtro(rng.standard_normal(len(t)), 'highpass', 2500) * np.exp(-t * 260) * 0.25
    return np.tanh(x * 1.6) * g


def caja(g=1.0):
    t = t_(0.35)
    ruido = filtro(rng.standard_normal(len(t)), 'bandpass', [1400, 7500]) * np.exp(-t * 17)
    tono = np.sin(2 * np.pi * 185 * t) * np.exp(-t * 30) * 0.6
    return (ruido * 0.9 + tono) * g


def charles(g=1.0, d=0.06):
    t = t_(d + 0.05)
    return filtro(rng.standard_normal(len(t)), 'highpass', 7800) * np.exp(-t / d * 3.5) * g


def golpe(g=1.0):
    """Impacto: subgrave que cae, ruido y cola."""
    t = t_(2.6)
    f = 34 + 70 * np.exp(-t * 6)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6)
    ruido = filtro(rng.standard_normal(len(t)), 'lowpass', 3200) * np.exp(-t * 5)
    return np.tanh((sub * 1.2 + ruido * 0.55) * 1.3) * g


def subida(d, g=1.0):
    """Ruido que sube de tono y volumen hasta el golpe."""
    t = t_(d)
    u = t / d
    x = rng.standard_normal(len(t))
    out = np.zeros_like(x)
    trozos = 48
    for k in range(trozos):
        a, b = int(k * len(t) / trozos), int((k + 1) * len(t) / trozos)
        fc = 400 * (18 ** (k / trozos))
        out[a:b] = filtro(x[a - 2000 if a > 2000 else 0:b], 'bandpass', [fc * 0.7, min(fc * 1.6, 20000)])[-(b - a):]
    tono = sierra(110, d) * 0
    for k in range(3):
        fr = nota(-24 + k * 7) * (1 + u * 1.2)
        tono += np.sin(2 * np.pi * np.cumsum(fr) / SR)
    return (out * 0.8 + tono * 0.06) * (u ** 2.2) * g


def barrido(d=0.45, sube=True, g=1.0):
    """Barrido de aire para los cortes."""
    t = t_(d)
    x = rng.standard_normal(len(t))
    out = np.zeros_like(x)
    trozos = 16
    for k in range(trozos):
        a, b = int(k * len(t) / trozos), int((k + 1) * len(t) / trozos)
        u = k / trozos if sube else 1 - k / trozos
        fc = 600 * (12 ** u)
        out[a:b] = filtro(x[max(0, a - 1500):b], 'bandpass', [fc * 0.6, min(fc * 1.8, 20000)])[-(b - a):]
    e = np.sin(np.pi * t / d) ** 1.5
    return out * e * g


def clic(g=1.0, f=2600):
    t = t_(0.03)
    return (np.sin(2 * np.pi * f * t) * np.exp(-t * 300) + filtro(rng.standard_normal(len(t)), 'highpass', 4000) * np.exp(-t * 500) * 0.4) * g


def tecla(g=1.0):
    t = t_(0.025)
    return filtro(rng.standard_normal(len(t)), 'bandpass', [1800, 6000]) * np.exp(-t * 380) * g


def pulso_suave(f, d, g=1.0, corte=1400):
    x = sierra(f, d) + sierra(f, d, 0.004)
    x = filtro(x, 'lowpass', corte)
    return x * env(len(x), 0.004, d * 0.7, 1) * np.exp(-t_(d) * 5) * g


def colchon(notas, d, corte=1800, g=1.0):
    xl = np.zeros(int(d * SR)); xr = np.zeros(int(d * SR))
    for n in notas:
        f = nota(n)
        xl += sierra(f, d, -0.003) + sierra(f, d, 0.005)
        xr += sierra(f, d, 0.003) + sierra(f, d, -0.005)
    xl = filtro(xl, 'lowpass', corte); xr = filtro(xr, 'lowpass', corte)
    e = env(len(xl), 0.35, 0.6)
    return xl * e * g / len(notas), xr * e * g / len(notas)


def bajo(n, d, g=1.0):
    f = nota(n)
    t = t_(d)
    x = np.sin(2 * np.pi * f * t) + 0.35 * filtro(sierra(f, d), 'lowpass', 500)
    return np.tanh(x * 1.4) * env(len(t), 0.006, 0.05) * g


# ------------------------------------------------------------ armonía
# La menor: Am – F – C – G (un compás = 2 s = 4 pulsos)
ACORDES = [(-36, [-12, -9, -5]), (-40, [-16, -12, -9]), (-33, [-9, -5, -2]), (-38, [-14, -10, -7])]   # raíz y notas, en semitonos desde La 440


def acorde_en(t):
    k = int(np.floor((t - 2.5) / 2.0)) % 4 if t >= 2.5 else 0
    return ACORDES[k]


# ------------------------------------------------------------ 0 – 2.5 tensión
t0 = 0.0
dr = np.sin(2 * np.pi * nota(-36) * t_(2.7)) * 0.5 + filtro(sierra(nota(-36), 2.7), 'lowpass', 300) * 0.4
pon(t0, dr * env(len(dr), 0.05, 0.3) * 0.5, rev=0.2)
for k in range(10):
    pon(k * 0.25, pulso_suave(nota(-24), 0.22, 0.10 + k * 0.01, corte=500 + k * 90), pan=-0.2 if k % 2 else 0.2)
pon(0.5, subida(2.0, 0.42), rev=0.3)
if version == 'B':
    for k in range(26):
        pon(0.1 + k * 0.045 + rng.random() * 0.01, tecla(0.18), pan=rng.uniform(-0.3, 0.3))

# ------------------------------------------------------------ golpes y ritmo
GOLPES = [2.5, 25.5, 27.5]
for g in GOLPES:
    pon(g, golpe(0.95 if g != 27.5 else 0.8), rev=0.35)
for g in [2.5, 25.5]:
    pon(g - 0.02, charles(0.5, 0.9), pan=0.0, rev=0.4)   # platillo corto


def ritmo(de, a, intensidad=1.0, bombo_cada=1, con_caja=True):
    b = de
    k = 0
    while b < a - 1e-6:
        if k % bombo_cada == 0: pon(b, bombo(0.85 * intensidad))
        if con_caja and k % 2 == 1: pon(b, caja(0.42 * intensidad), rev=0.18)
        pon(b + PULSO / 2, charles(0.22 * intensidad), pan=0.25)
        pon(b + PULSO / 4, charles(0.08 * intensidad, 0.03), pan=-0.3)
        pon(b + 3 * PULSO / 4, charles(0.08 * intensidad, 0.03), pan=-0.3)
        k += 1; b += PULSO


def bajos(de, a, g=1.0):
    b = de
    while b < a - 1e-6:
        raiz, _ = acorde_en(b)
        for k in range(2):
            x = bajo(raiz, PULSO / 2 * 0.9, g)
            # bombeo: el bajo se aparta cuando entra el bombo
            e = np.minimum(1, (np.arange(len(x)) / SR / 0.09) ** 1.5) if k == 0 else np.ones(len(x))
            pon(b + k * PULSO / 2, x * e)
        b += PULSO


def colchones(de, a, g=1.0, corte=1800):
    b = de
    while b < a - 1e-6:
        _, notas = acorde_en(b)
        d = min(2.0, a - b)
        xl, xr = colchon(notas, d + 0.3, corte, g)
        pon_st(b, xl, xr, rev=0.35)
        b += 2.0


def arpegio(de, a, g=1.0, corte=2600):
    b = de
    k = 0
    while b < a - 1e-6:
        _, notas = acorde_en(b)
        n = notas[k % 3] + 24 + (12 if k % 8 >= 6 else 0)
        x = filtro(sierra(nota(n), 0.2), 'lowpass', corte) * np.exp(-t_(0.2) * 16)
        pon(b, x * g, pan=0.35 if k % 2 else -0.35, rev=0.3)
        k += 1; b += PULSO / 4


# el juego (2.5 – 9): ritmo lleno
ritmo(2.5, 9.0, 1.0)
bajos(2.5, 9.0, 0.5)
colchones(2.5, 9.0, 0.32, 1500)
arpegio(5.0, 9.0, 0.11)
# acentos en los cortes del montaje
for c in [5.0, 6.0, 7.0, 8.0, 9.0]:
    pon(c - 0.32, barrido(0.34, True, 0.22), pan=rng.uniform(-0.4, 0.4), rev=0.2)
    pon(c, caja(0.5), rev=0.25)
# el anillo: destello del juego
pon(2.95, barrido(0.5, True, 0.3), pan=0.1, rev=0.3)
for k, f in enumerate([nota(12), nota(19), nota(24)]):
    x = np.sin(2 * np.pi * f * t_(0.9)) * np.exp(-t_(0.9) * 4)
    pon(3.25 + k * 0.05, x * 0.08, pan=-0.2 + k * 0.2, rev=0.5)

# funciona (9 – 15.5): ritmo estable, más ligero
ritmo(9.0, 15.5, 0.8)
bajos(9.0, 15.5, 0.42)
colchones(9.0, 15.5, 0.26, 1300)
arpegio(9.0, 15.5, 0.08, 2000)
for c in [11.0, 13.0]:
    pon(c - 0.3, barrido(0.3, True, 0.18), rev=0.2)
# toques en la app (13.0 + fotogramas de la grabación)
for f in [142, 168]:
    pon(13.0 + (f - 128) / 30, clic(0.35), pan=0.1)
# scroll de la web: un susurro
pon(9.4, barrido(1.2, False, 0.08), pan=-0.2, rev=0.2)

# proceso (15.5 – 23): respiro con teclas y textura de código
colchones(15.5, 23.0, 0.3, 900)
pon(15.5, golpe(0.35), rev=0.4)
for k in range(40):   # escribir la instrucción
    pon(15.55 + k * 0.04 + rng.random() * 0.012, tecla(0.16), pan=rng.uniform(-0.3, 0.3))
for b in np.arange(17.5, 18.5, PULSO / 4):   # el código corre
    pon(b, clic(0.06, 3400 + rng.integers(-600, 600)), pan=rng.uniform(-0.5, 0.5))
ritmo(17.5, 18.5, 0.5, con_caja=False)
for k in range(28):
    pon(19.55 + k * 0.034 + rng.random() * 0.01, tecla(0.15), pan=rng.uniform(-0.3, 0.3))
for b in np.arange(20.5, 21.5, PULSO / 4):
    pon(b, clic(0.06, 3400 + rng.integers(-600, 600)), pan=rng.uniform(-0.5, 0.5))
for c in [18.5, 21.5]:
    pon(c - 0.35, barrido(0.36, True, 0.24), rev=0.25)
    pon(c, golpe(0.42), rev=0.35)
ritmo(18.5, 19.5, 0.65)
ritmo(21.5, 23.0, 0.7)
bajos(18.5, 19.5, 0.35); bajos(21.5, 23.0, 0.38)

# escala (23 – 25.5): subida
ritmo(23.0, 25.5, 0.75)
bajos(23.0, 25.5, 0.4)
colchones(23.0, 25.5, 0.3, 2200)
pon(23.0, subida(2.5, 0.55), rev=0.3)
for k, b in enumerate(np.arange(24.0, 25.5, PULSO / 4)):
    pon(b, caja(0.08 + k * 0.02), rev=0.15)
# todo a la vez (25.5 – 27.5)
ritmo(25.5, 27.5, 1.05)
bajos(25.5, 27.5, 0.55)
colchones(25.5, 27.5, 0.36, 2600)
arpegio(25.5, 27.5, 0.13, 3200)

# cierre (27.5 – 33.5): acorde abierto, firma y final
xl, xr = colchon([-21, -14, -9, -2, 3], 6.0, 2400, 0.42)
pon_st(27.5, xl, xr, rev=0.5)
motivo = [(28.0, 3), (28.5, 7), (29.0, 10), (29.5, 15)]
for tt, n in motivo:
    x = filtro(sierra(nota(n), 1.2), 'lowpass', 2400) * np.exp(-t_(1.2) * 4.5)
    pon(tt, x * 0.12, pan=-0.25 + (n % 3) * 0.2, rev=0.55)
# firma de marca al aparecer el logotipo
for k, n in enumerate([-9, -2, 3, 10]):
    x = np.sin(2 * np.pi * nota(n) * t_(2.4)) * np.exp(-t_(2.4) * 1.6) + 0.3 * np.sin(2 * np.pi * nota(n + 12) * t_(2.4)) * np.exp(-t_(2.4) * 3)
    pon(30.5 + k * 0.03, x * 0.12, pan=-0.3 + k * 0.2, rev=0.6)
pon(30.5, bombo(0.7)); pon(30.5, golpe(0.5), rev=0.4)

# ------------------------------------------------------------ reverberación
d = 2.4
nr = int(d * SR)
cola = np.exp(-np.arange(nr) / SR * 3.2)
ir_l = filtro(rng.standard_normal(nr), 'lowpass', 6000) * cola
ir_r = filtro(rng.standard_normal(nr), 'lowpass', 6000) * cola
ir_l /= np.sqrt(np.sum(ir_l ** 2)); ir_r /= np.sqrt(np.sum(ir_r ** 2))
rev_l = signal.fftconvolve(envio[0], ir_l)[:N]
rev_r = signal.fftconvolve(envio[1], ir_r)[:N]
L += rev_l * 0.6; R += rev_r * 0.6

# ------------------------------------------------------------ mezcla final
mezcla = np.stack([L, R])
mezcla = filtro(mezcla, 'highpass', 28)
mezcla[:, -int(1.2 * SR):] *= np.linspace(1, 0, int(1.2 * SR)) ** 1.5
mezcla = np.tanh(mezcla * 0.9) / np.tanh(0.9)
mezcla /= np.max(np.abs(mezcla)) / 0.89
from scipy.io import wavfile
wavfile.write(sys.argv[1], SR, (mezcla.T * 32767).astype(np.int16))
print('ok', sys.argv[1], f'{DUR} s')
