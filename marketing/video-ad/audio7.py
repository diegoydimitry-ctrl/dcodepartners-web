#!/usr/bin/env python3
"""
Banda sonora del anuncio 7 de D-Code Partners (Reel cinematográfico sobre
Séneca y el tiempo), 51,8 s.

Mismo motor de síntesis que el resto de la serie — sin samples ni
librerías externas, pista original y libre de derechos por construcción.
Carácter distinto al de los anuncios anteriores: ambiental, minimalista,
de piano — pensado para documental, no para "anuncio". Empieza casi en
silencio, crece muy poco a poco a lo largo de las siete escenas y deja
el primer plano siempre a la voz.

Arco, alineado con el guion (GUION-7.md):
    0,00 –  6,63  el gancho — una sola nota de piano, aire casi vacío
    6,63 – 14,03  Séneca — el mismo piano, un acorde grave y quieto debajo
   14,03 – 19,81  la ciudad — un pulso suave, más presente, nunca percusión
   19,81 – 24,67  el artesano — vuelve el silencio, una nota, muy íntima
   24,67 – 33,79  la empresa — tensión leve (intervalo menor), sin resolver
   33,79 – 40,40  D-Code — el acorde se abre (resolución, mayor)
   40,40 – 50,30  el cierre — el único crecimiento real de la pieza, breve
   50,30 – 51,80  marca — una nota final que se apaga, sin campana de venta

La mezcla deja las siete ventanas de voz (GUION-7.md § 3) atenuadas
(ducking), igual que el resto de la serie.

Uso:  python3 audio7.py out/banda-sonora-7.wav
"""

import math
import sys
import wave
from array import array

SR = 44100
DUR = 51.8
N = int(SR * DUR)
TWO_PI = 2.0 * math.pi

L = array('d', bytes(8 * N))
R = array('d', bytes(8 * N))


def note(semitones, base=220.0):
    return base * (2.0 ** (semitones / 12.0))


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


_seed = [0xD7C0DE]


def rnd():
    _seed[0] = (1103515245 * _seed[0] + 12345) & 0x7FFFFFFF
    return _seed[0] / 0x7FFFFFFF


def piano(freq, dur, amp=0.16):
    """Nota de piano aditiva — fundamental + armónicos con caídas propias,
    sin muestras: el timbre viene de que cada armónico se apaga a su
    propio ritmo, como en una cuerda percutida real."""
    n = int(dur * SR)
    harmonics = [(1, 1.00, 2.6), (2, 0.46, 4.2), (3, 0.26, 5.6),
                 (4, 0.15, 7.2), (5, 0.08, 9.0), (6, 0.05, 11.0)]
    atk = int(0.006 * SR)
    out = []
    for i in range(n):
        t = i / SR
        a = i / atk if i < atk else 1.0
        s = 0.0
        for (k, w, decay) in harmonics:
            s += w * math.sin(TWO_PI * freq * k * t) * math.exp(-decay * t)
        out.append(s * a * amp)
    return out


def pad(freq, dur, amp=0.05):
    """Pad quieto, dos osciladores muy ligeramente desafinados — aire,
    nunca protagonista."""
    n = int(dur * SR)
    atk = int(min(1.6, dur * 0.4) * SR)
    rel = int(min(1.8, dur * 0.4) * SR)
    out = []
    for i in range(n):
        t = i / SR
        a = i / atk if i < atk else 1.0
        r = (n - i) / rel if (n - i) < rel else 1.0
        s = (math.sin(TWO_PI * freq * 0.999 * t)
             + math.sin(TWO_PI * freq * 1.001 * t)) * 0.5
        out.append(s * a * r * amp)
    return out


def air(dur, amp=0.012):
    """Ruido muy suave y filtrado — aire de sala, no percusión."""
    n = int(dur * SR)
    out = []
    lp = 0.0
    for i in range(n):
        lp = lp * 0.985 + (rnd() * 2 - 1) * 0.015
        out.append(lp * amp)
    return out


# ──────────────────────────── arreglo ────────────────────────────

def render_arrangement():
    # 0,00–6,63 · el gancho — una nota, el aire casi vacío
    add(0.0, air(6.63, 0.010))
    add(0.55, piano(note(-12), 5.4, 0.15))

    # 6,63–14,03 · Séneca — el mismo piano, un acorde grave y quieto debajo
    add(6.63, air(7.40, 0.011))
    add(6.90, piano(note(-12), 4.6, 0.13))
    add(6.95, pad(note(-24), 6.0, 0.045))
    add(11.60, piano(note(-5), 2.0, 0.10))

    # 14,03–19,81 · la ciudad — un pulso suave, más presente, nunca percusión
    add(14.03, air(5.78, 0.013))
    add(14.03, pad(note(-24), 5.7, 0.05))
    pulse_at = [14.7, 15.75, 16.8, 17.85, 18.9]
    for i, at in enumerate(pulse_at):
        add(at, piano(note([-12, -5, -8, -5, -12][i]), 1.0, 0.065), pan=(rnd()*2-1)*0.35)

    # 19,81–24,67 · el artesano — vuelve el silencio, una nota íntima
    add(19.81, air(4.86, 0.009))
    add(20.00, piano(note(0), 4.0, 0.12))

    # 24,67–33,79 · la empresa — tensión leve, sin resolver (intervalo menor)
    add(24.67, air(9.12, 0.012))
    add(24.85, pad(note(-12), 8.6, 0.05))
    add(24.85, pad(note(-9), 8.6, 0.04))
    tick_at = [27.3, 28.9, 30.4, 31.9]
    for i, at in enumerate(tick_at):
        add(at, piano(note([-5, -9, -5, -12][i]), 1.3, 0.07), pan=(rnd()*2-1)*0.3)

    # 33,79–40,40 · D-Code — el acorde se abre, resolución mayor
    add(33.79, air(6.61, 0.012))
    add(34.00, pad(note(-12), 6.2, 0.055))
    add(34.00, pad(note(0), 6.2, 0.045))
    add(34.00, pad(note(7), 6.2, 0.035))
    add(34.25, piano(note(0), 2.8, 0.11))
    add(37.20, piano(note(7), 2.1, 0.09))

    # 40,40–50,30 · el cierre — el único crecimiento real, breve y contenido
    add(40.40, air(9.90, 0.015))
    add(40.55, pad(note(-12), 9.6, 0.07))
    add(40.55, pad(note(0), 9.6, 0.06))
    add(40.55, pad(note(7), 9.6, 0.05))
    add(40.55, pad(note(12), 9.6, 0.035))
    swell_notes = [0, 7, 12, 15]
    for i, at in enumerate([40.8, 43.1, 45.6, 48.1]):
        add(at, piano(note(swell_notes[i]), 2.3, 0.10 + i * 0.012), pan=-0.2 + i * 0.13)

    # 50,30–51,80 · marca — una nota final que se apaga, sin campana de venta
    add(50.35, piano(note(12), 1.7, 0.09))
    add(50.35, pad(note(0), 1.65, 0.03))


# ───────────────── mezcla: ducking de voz, límite y fundidos ─────────────────

VO = [
    (0.30, 6.23), (6.63, 13.68), (14.03, 19.41), (19.81, 24.22),
    (24.67, 33.34), (33.79, 39.90), (40.40, 48.79)
]
DUCK = 0.50
FADE = 0.12


def duck_gain(t):
    gain = 1.0
    for (a, b) in VO:
        if a - FADE < t < b + FADE:
            if t < a:
                k = (t - (a - FADE)) / FADE
            elif t > b:
                k = 1.0 - (t - b) / FADE
            else:
                k = 1.0
            gain = min(gain, 1.0 - (1.0 - DUCK) * max(0.0, min(1.0, k)))
    return gain


def mixdown(path):
    peak = 0.0
    for i in range(N):
        t = i / SR
        d = duck_gain(t)
        if t < 0.3:
            d *= t / 0.3
        if t > DUR - 1.2:
            d *= max(0.0, (DUR - t) / 1.2)
        L[i] *= d
        R[i] *= d
        peak = max(peak, abs(L[i]), abs(R[i]))

    k = (0.82 / peak) if peak > 0 else 1.0
    frames = array('h', bytes(4 * N))
    for i in range(N):
        for ch, b in ((0, L), (1, R)):
            v = math.tanh(b[i] * k * 1.05) * 0.95
            frames[2 * i + ch] = int(max(-32767, min(32767, v * 32767)))

    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(frames.tobytes())
    print(f'audio  → {path}  ({DUR:.1f}s, pico previo {peak:.3f})')


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else 'out/banda-sonora-7.wav'
    render_arrangement()
    mixdown(out)
