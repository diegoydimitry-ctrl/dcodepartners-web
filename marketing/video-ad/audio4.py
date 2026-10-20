#!/usr/bin/env python3
"""
Banda sonora del anuncio 4 de D-Code Partners («D-Code Finance», versión
corporativa), 56,4 s.

Mismo motor de síntesis que audio.py/audio2.py/audio3.py —sin samples ni
librerías externas, pista original y libre de derechos por construcción—
con un carácter cinemático-corporativo: crece con calma bajo el caos
inicial, dos golpes de intensidad claros (la conexión de la escena 3, la
resolución de la escena 6) y un cierre que se abre en vez de estallar.

Arco, alineado con GUION-4.md:
    0.0  – 4.0   casi silencio: un pulso grave bajo los documentos dispersos
    4.0  – 13.6  pulso disperso, sin resolver — cada etiqueta con su tono
   13.6  – 21.0  la conexión: barrido + campanas + acorde que se abre
   21.0  – 31.85 energía de sistema — un tono por módulo que aparece
   31.85 – 39.3  calma segura — el asistente responde, sin percusión dura
   39.3  – 45.9  resolución cálida — evolución + confirmaciones
   45.9  – 56.4  cierre: el acorde se abre del todo, campana de marca

La mezcla deja los doce tramos de voz de GUION-4.md atenuados (ducking),
igual que audio.py/audio2.py.

Uso:  python3 audio4.py out/banda-sonora-4.wav
"""

import math
import sys
import wave
from array import array

SR = 44100
DUR = 56.4
N = int(SR * DUR)
TWO_PI = 2.0 * math.pi

L = array('d', bytes(8 * N))
R = array('d', bytes(8 * N))


def note(semitones, base=220.0):
    return base * (2.0 ** (semitones / 12.0))


def env_ad(i, attack, decay):
    if i < attack:
        return i / attack if attack else 1.0
    return math.exp(-3.2 * ((i - attack) / decay if decay else 1.0))


def add(start_s, samples, pan=0.0):
    i0 = int(start_s * SR)
    gl = math.sqrt((1.0 - pan) * 0.5) * 1.4142
    gr = math.sqrt((1.0 + pan) * 0.5) * 1.4142
    for k, v in enumerate(samples):
        i = i0 + k
        if i < 0:
            continue
        if i >= N:
            break
        L[i] += v * gl
        R[i] += v * gr


_seed = [0xF14A5C]


def rnd():
    _seed[0] = (1103515245 * _seed[0] + 12345) & 0x7FFFFFFF
    return _seed[0] / 0x7FFFFFFF


def pluck(freq, dur, amp=0.22, bright=0.22):
    n = int(dur * SR)
    atk = int(0.004 * SR)
    out = []
    for i in range(n):
        e = env_ad(i, atk, n * 0.5)
        p = TWO_PI * freq * i / SR
        s = math.sin(p) + bright * math.sin(2 * p)
        out.append(s * e * amp)
    return out


def bell(freq, dur, amp=0.20):
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        e = env_ad(i, int(0.003 * SR), n * 0.34)
        s = (math.sin(TWO_PI * freq * t)
             + 0.4 * math.sin(TWO_PI * freq * 2.0 * t) * math.exp(-5.0 * t)
             + 0.18 * math.sin(TWO_PI * freq * 3.0 * t) * math.exp(-8.0 * t))
        out.append(s * e * amp)
    return out


def blip(freq, dur=0.10, amp=0.11):
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        e = env_ad(i, int(0.002 * SR), n * 0.3)
        out.append(math.sin(TWO_PI * freq * t) * e * amp)
    return out


def kick(dur=0.28, amp=0.34):
    n = int(dur * SR)
    out = []
    ph = 0.0
    for i in range(n):
        t = i / SR
        f = 44.0 + 70.0 * math.exp(-22.0 * t)
        ph += TWO_PI * f / SR
        out.append(math.sin(ph) * math.exp(-8.5 * t) * amp)
    return out


def tick(dur=0.03, amp=0.07, tone=2600.0):
    n = int(dur * SR)
    out = []
    prev = 0.0
    for i in range(n):
        t = i / SR
        e = math.exp(-75.0 * t)
        prev = prev * 0.55 + (rnd() * 2 - 1) * 0.45
        out.append((prev * 0.6 + 0.4 * math.sin(TWO_PI * tone * t)) * e * amp)
    return out


def whoosh(dur=0.6, amp=0.13, rise=True):
    n = int(dur * SR)
    out = []
    lp = 0.0
    for i in range(n):
        x = i / n
        e = math.sin(math.pi * x) ** 1.5
        a = 0.03 + 0.5 * (x if rise else (1 - x))
        lp = lp * (1 - a) + (rnd() * 2 - 1) * a
        out.append(lp * e * amp)
    return out


def sub_swell(dur, freq=52.0, amp=0.30):
    n = int(dur * SR)
    out = []
    for i in range(n):
        x = i / n
        e = (x ** 2) * (1 - max(0.0, (x - 0.88) / 0.12))
        f = freq * (1 + 0.30 * x)
        out.append(math.sin(TWO_PI * f * i / SR) * e * amp)
    return out


# ──────────────────────────────── pads ────────────────────────────────

CHORDS = [
    (0.0,   4.4,  [-12, 7],            0.040),   # abierto — el caos, sin resolver
    (3.8,  13.9,  [-12, 0, 3, 7],      0.075),   # todo disperso
    (13.5, 21.3,  [-12, 0, 3, 7, 10],  0.100),   # la conexión se abre
    (21.0, 32.1,  [-12, 3, 7, 10],     0.115),   # el sistema funciona
    (31.7, 39.5,  [-12, 0, 7, 12],     0.090),   # calma segura, sin tercera
    (39.1, 46.1,  [-12, 3, 7, 10],     0.110),   # resolución cálida
    (45.7, 56.4,  [-12, 0, 3, 7, 12],  0.115)    # cierre
]


def render_pads():
    for (s, e, semis, gain) in CHORDS:
        i0, i1 = int(s * SR), min(N, int(e * SR))
        n = i1 - i0
        if n <= 0:
            continue
        atk = int(min(0.9, (e - s) * 0.32) * SR)
        rel = int(min(0.9, (e - s) * 0.30) * SR)
        freqs = [note(x) for x in semis]
        for i in range(n):
            a = i / atk if i < atk else 1.0
            r = (n - i) / rel if (n - i) < rel else 1.0
            env = a * r * gain
            if env <= 0:
                continue
            t = (i0 + i) / SR
            sl = sr_ = 0.0
            for k, f in enumerate(freqs):
                pl = TWO_PI * (f * 0.999) * t
                pr = TWO_PI * (f * 1.001) * t
                w = 1.0 / (1.0 + k * 0.5)
                sl += math.sin(pl) * w
                sr_ += math.sin(pr) * w
            L[i0 + i] += sl * env
            R[i0 + i] += sr_ * env


# ───────────────────────── arreglo y efectos ─────────────────────────

BEAT = 0.40


def render_arrangement():
    # ── s1 (0 – 4.0): casi silencio, un pulso grave bajo los fragmentos.
    add(0.30, pluck(note(-12), 3.2, 0.09, 0.08))
    for i in range(7):                                  # un tic por fragmento
        add(0.20 + i * 0.42, tick(0.03, 0.05, 1800 + i * 90))

    # ── s2 (4.0 – 13.6): disperso — un tono por etiqueta, sin conectar.
    labels_at = [4.35, 5.05, 5.75, 6.35, 6.85, 7.35]
    for i, at in enumerate(labels_at):
        add(at, blip(note(i * 2, base=520), 0.14, 0.09), pan=-0.6 + i * 0.24)
    t, step = 8.0, 0
    while t < 13.4:
        add(t, pluck(note([0, 5, 7, 3][step % 4] + 12), 0.34, 0.055), pan=-0.3 + 0.6 * (step % 2))
        t += BEAT * 1.15
        step += 1

    # ── s3 (13.6 – 21.0): la conexión — barrido + campanas, el momento del anuncio.
    add(15.55, whoosh(1.0, 0.13, rise=True))
    add(15.75, sub_swell(0.9, 58.0, 0.26))
    for i, sm in enumerate([0, 7, 12, 16, 19]):          # las etiquetas convergiendo
        add(13.85 + i * 0.28, blip(note(sm + 12), 0.10, 0.08))
    add(16.55, bell(note(0), 2.6, 0.16))
    add(16.70, bell(note(12), 2.3, 0.11))
    add(18.30, bell(note(7), 1.6, 0.09))                 # subtítulo

    # ── s4 (21.0 – 31.85): el sistema funciona — un tono por módulo.
    t, step = 21.1, 0
    while t < 31.7:
        if step % 4 == 0:
            add(t, kick(0.26, 0.26))
        add(t, pluck(note([0, 7, 12, 15, 12, 7][step % 6] + 12), 0.30, 0.07),
            pan=-0.4 + 0.8 * ((step * 3) % 5) / 4)
        t += BEAT
        step += 1
    mod_at = [22.55, 23.17, 23.79, 24.41, 25.03, 25.65, 26.27]
    for i, at in enumerate(mod_at):
        add(at, blip(680 + i * 45, 0.09, 0.075), pan=-0.5 + i * 0.16)

    # ── s5 (31.85 – 39.3): calma segura — el asistente responde, sin percusión dura.
    add(32.40, bell(note(12), 1.4, 0.11))                # burbuja del usuario
    add(33.10, bell(note(7), 2.0, 0.13))                 # titular de la respuesta
    add(34.30, blip(900, 0.10, 0.07))                    # detalle 1
    add(34.65, blip(760, 0.10, 0.06))                    # detalle 2
    add(35.20, tick(0.05, 0.05, 2200))                   # línea de fuente
    add(36.20, bell(note(15), 1.6, 0.08))                # botón "ver los cobros"
    t = 32.0
    while t < 39.1:
        add(t, pluck(note(-12), 0.9, 0.05, 0.05))
        t += 1.5

    # ── s6 (39.3 – 45.9): resolución cálida.
    add(39.55, whoosh(0.7, 0.10, rise=True))             # el gráfico se dibuja
    t, step = 39.7, 0
    while t < 45.7:
        if step % 3 == 0:
            add(t, kick(0.24, 0.22))
        add(t, pluck(note([0, 4, 7, 4][step % 4] + 12), 0.30, 0.05), pan=0.3)
        t += BEAT * 1.05
        step += 1
    add(41.25, bell(note(7), 1.2, 0.10))                 # proyecto alfa
    add(41.90, bell(note(3), 1.2, 0.08))                 # proyecto beta (aviso)

    # ── s7 (45.9 – 56.4): cierre — el acorde se abre, campana de marca.
    add(46.10, whoosh(1.3, 0.11, rise=False))
    add(46.35, bell(note(0), 3.4, 0.17))
    add(46.55, bell(note(12), 3.0, 0.11))
    add(48.55, bell(note(19), 2.0, 0.08))                # el eslogan secundario
    add(50.80, blip(note(7, base=260), 0.14, 0.07))      # dominio


# ───────────────── mezcla: ducking de voz, límite y fundidos ─────────────────

VO = [
    (0.60, 3.35), (3.75, 6.85), (7.20, 12.85), (13.40, 15.35),
    (15.75, 20.55), (21.00, 27.35), (28.15, 31.45), (31.85, 39.20),
    (39.30, 41.35), (41.75, 44.50), (45.20, 46.35), (46.75, 49.05)
]
DUCK = 0.50
FADE = 0.10


def duck_gain(t):
    g = 1.0
    for (a, b) in VO:
        if a - FADE < t < b + FADE:
            if t < a:
                k = (t - (a - FADE)) / FADE
            elif t > b:
                k = 1.0 - (t - b) / FADE
            else:
                k = 1.0
            g = min(g, 1.0 - (1.0 - DUCK) * max(0.0, min(1.0, k)))
    return g


def mixdown(path):
    peak = 0.0
    for i in range(N):
        t = i / SR
        d = duck_gain(t)
        if t < 0.35:
            d *= t / 0.35
        if t > DUR - 1.1:
            d *= max(0.0, (DUR - t) / 1.1)
        L[i] *= d
        R[i] *= d
        peak = max(peak, abs(L[i]), abs(R[i]))

    k = (0.84 / peak) if peak > 0 else 1.0
    frames = array('h', bytes(4 * N))
    for i in range(N):
        for ch, b in ((0, L), (1, R)):
            v = math.tanh(b[i] * k * 1.10) * 0.93
            frames[2 * i + ch] = int(max(-32767, min(32767, v * 32767)))

    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(frames.tobytes())
    print(f'audio  → {path}  ({DUR:.1f}s, pico previo {peak:.3f})')


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else 'out/banda-sonora-4.wav'
    render_pads()
    render_arrangement()
    mixdown(out)
