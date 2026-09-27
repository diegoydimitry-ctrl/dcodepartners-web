# Banda sonora del anuncio (24 s, 48 kHz, estéreo). Sintetizada aquí: no hay música de terceros ni licencias.
#
#   python3 audio.py banda.wav
#
# La pieza sigue el montaje: pulso sordo mientras se plantea el problema, el bajo entra cuando aparece lo que
# se vende, la cadencia se abre en la relación comercial, un golpe en la cifra y una resolución larga al cierre.
# Todo son senos y ruido filtrado: nada sampleado.
import sys, math
import numpy as np

SR, DUR = 48000, 24.0
n = int(SR * DUR)
t = np.arange(n) / SR

# Marcas de tiempo, en segundos, alineadas con escena.html (fotograma / 30)
T_VENDE, T_RELACION, T_CIFRA, T_CIERRE = 244 / 30, 428 / 30, 574 / 30, 698 / 30


def env(ini, fin, sube=0.35, baja=0.6):
    """Envolvente suave por tramo."""
    e = np.zeros(n)
    a, b = int(ini * SR), int(fin * SR)
    b = min(b, n)
    if b <= a: return e
    L = b - a
    seg = np.ones(L)
    # Las rampas nunca pueden sumar más que el propio tramo: si el tramo es corto, se reparten.
    ns, nb = int(sube * SR), int(baja * SR)
    if ns + nb > L:
        k = L / (ns + nb) if (ns + nb) else 0
        ns, nb = int(ns * k), int(nb * k)
    if ns > 0: seg[:ns] *= np.linspace(0, 1, ns) ** 1.6
    if nb > 0: seg[L - nb:] *= np.linspace(1, 0, nb) ** 1.4
    e[a:b] = seg
    return e


def seno(f, fase=0.0):
    return np.sin(2 * math.pi * f * t + fase)


def paso_bajo(x, corte, orden=2):
    """Filtro de un polo aplicado varias veces (suficiente para un pad)."""
    a = math.exp(-2 * math.pi * corte / SR)
    y = x.copy()
    for _ in range(orden):
        out = np.empty_like(y); acc = 0.0
        for i in range(len(y)):
            acc = (1 - a) * y[i] + a * acc
            out[i] = acc
        y = out
    return y


mezcla = np.zeros(n)

# 1 · pulso grave: el tiempo que se pierde, latiendo
periodo = 60.0 / 76          # 76 pulsaciones por minuto
for k in range(int(DUR / periodo) + 1):
    ini = k * periodo
    if ini >= DUR: break
    d = 0.42
    e = env(ini, ini + d, 0.006, d - 0.01)
    f = 52 * np.exp(-3.4 * np.clip(t - ini, 0, None))     # caída de tono: da el golpe
    mezcla += 0.46 * e * np.sin(2 * math.pi * np.cumsum(f) / SR)

# 2 · colchón: dos quintas que sostienen toda la pieza
base = (seno(110) + 0.6 * seno(164.81) + 0.35 * seno(220)) / 2
mezcla += 0.14 * env(0.4, DUR - 0.5, 2.2, 2.4) * base

# 3 · el bajo entra con "lo que vas a vender"
mezcla += 0.20 * env(T_VENDE, DUR - 0.6, 0.9, 2.2) * (seno(55) + 0.45 * seno(82.41))

# 4 · arpegio tenue que abre la parte de la relación comercial
notas = [329.63, 392.00, 493.88, 587.33]
for k in range(28):
    ini = T_RELACION + k * 0.19
    if ini > T_CIFRA - 0.1: break
    f = notas[k % len(notas)] * (2 if k % 8 >= 4 else 1)
    mezcla += 0.065 * env(ini, ini + 0.42, 0.01, 0.38) * seno(f)

# 5 · el golpe de la cifra: subida y impacto
sub = env(T_CIFRA - 1.5, T_CIFRA, 1.4, 0.05)
barrido = np.clip(t - (T_CIFRA - 1.5), 0, 1.5) / 1.5
ruido = np.random.default_rng(7).normal(0, 1, n)
mezcla += 0.11 * sub * ruido * barrido
mezcla += 0.55 * env(T_CIFRA, T_CIFRA + 1.1, 0.004, 1.0) * np.sin(
    2 * math.pi * np.cumsum(44 * np.exp(-2.2 * np.clip(t - T_CIFRA, 0, None))) / SR)
mezcla += 0.18 * env(T_CIFRA, T_CIFRA + 2.6, 0.02, 2.4) * (seno(220) + 0.5 * seno(329.63))

# 6 · resolución del cierre
mezcla += 0.17 * env(T_CIERRE, DUR - 0.25, 0.5, 2.0) * (seno(146.83) + 0.55 * seno(220) + 0.3 * seno(293.66))

# aire: ruido muy filtrado, bajo, para que no suene a sintetizador seco
aire = paso_bajo(np.random.default_rng(3).normal(0, 1, n), 900, 1)
mezcla += 0.022 * env(0.2, DUR - 0.3, 2.0, 2.0) * aire / (np.abs(aire).max() + 1e-9)

# fundido final y limitado suave
mezcla *= env(0.0, DUR, 0.25, 1.6)
mezcla = np.tanh(mezcla * 0.85)
mezcla /= np.abs(mezcla).max() + 1e-9
mezcla *= 0.89

# estéreo: el mismo material con un retardo mínimo a la derecha (ensancha sin descolocar)
ret = int(0.0075 * SR)
izq = mezcla
der = np.concatenate([np.zeros(ret), mezcla[:-ret]]) * 0.97
est = np.stack([izq, der], axis=1)

pcm = (np.clip(est, -1, 1) * 32767).astype('<i2')
import wave
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'banda.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f'banda sonora: {DUR:.1f} s · {SR} Hz · estéreo')
