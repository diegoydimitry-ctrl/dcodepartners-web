#!/usr/bin/env python3
"""
Banda sonora del anuncio 7 de D-Code Partners (Reel cinematográfico sobre
Séneca y el tiempo), 40,6 s.

Mismo motor de síntesis que el resto de la serie — sin samples ni
librerías externas, pista original y libre de derechos por construcción.
Carácter distinto al de los anuncios anteriores: ambiental, minimalista,
de piano — pensado para documental, no para "anuncio". Empieza casi en
silencio, crece muy poco a poco a lo largo de las siete escenas y deja
el primer plano siempre a la voz.

Arco, alineado con el guion (GUION-7.md):
    0,00 –  5,26  el gancho — una sola nota de piano, aire casi vacío
    5,26 – 10,54  Séneca — el mismo piano, un acorde grave y quieto debajo
   10,54 – 15,17  la ciudad — un pulso suave, más presente, nunca percusión
   15,17 – 18,82  el artesano — vuelve el silencio, una nota, muy íntima
   18,82 – 25,56  la empresa — tensión leve (intervalo menor), sin resolver
   25,56 – 30,99  D-Code — el acorde se abre (resolución, mayor)
   30,99 – 38,90  el cierre — el único crecimiento real de la pieza, breve
   38,90 – 40,60  marca — una nota final que se apaga, sin campana de venta

La mezcla deja las siete ventanas de voz (GUION-7.md § 3) atenuadas
(ducking), igual que el resto de la serie.

Uso:  python3 audio7.py out/banda-sonora-7.wav
"""

import math
import sys
import wave
from array import array

SR = 44100
DUR = 40.6
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
    # 0,00–5,26 · el gancho — una nota, el aire casi vacío
    add(0.0, air(5.26, 0.010))
    add(0.55, piano(note(-12), 4.2, 0.15))

    # 5,26–10,54 · Séneca — el mismo piano, un acorde grave y quieto debajo
    add(5.26, air(5.28, 0.011))
    add(5.55, piano(note(-12), 3.6, 0.13))
    add(5.60, pad(note(-24), 4.6, 0.045))
    add(9.20, piano(note(-5), 1.6, 0.10))

    # 10,54–15,17 · la ciudad — un pulso suave, más presente, nunca percusión
    add(10.54, air(4.63, 0.013))
    add(10.54, pad(note(-24), 4.6, 0.05))
    pulse_at = [11.1, 11.95, 12.8, 13.65, 14.5]
    for i, at in enumerate(pulse_at):
        add(at, piano(note([-12, -5, -8, -5, -12][i]), 0.9, 0.065), pan=(rnd()*2-1)*0.35)

    # 15,17–18,82 · el artesano — vuelve el silencio, una nota íntima
    add(15.17, air(3.65, 0.009))
    add(15.35, piano(note(0), 3.1, 0.12))

    # 18,82–25,56 · la empresa — tensión leve, sin resolver (intervalo menor)
    add(18.82, air(6.74, 0.012))
    add(18.95, pad(note(-12), 6.4, 0.05))
    add(18.95, pad(note(-9), 6.4, 0.04))
    tick_at = [20.9, 22.1, 23.2, 24.3]
    for i, at in enumerate(tick_at):
        add(at, piano(note([-5, -9, -5, -12][i]), 1.1, 0.07), pan=(rnd()*2-1)*0.3)

    # 25,56–30,99 · D-Code — el acorde se abre, resolución mayor
    add(25.56, air(5.43, 0.012))
    add(25.75, pad(note(-12), 5.1, 0.055))
    add(25.75, pad(note(0), 5.1, 0.045))
    add(25.75, pad(note(7), 5.1, 0.035))
    add(26.0, piano(note(0), 2.4, 0.11))
    add(28.6, piano(note(7), 1.8, 0.09))

    # 30,99–38,90 · el cierre — el único crecimiento real, breve y contenido
    add(30.99, air(7.91, 0.015))
    add(31.1, pad(note(-12), 7.6, 0.07))
    add(31.1, pad(note(0), 7.6, 0.06))
    add(31.1, pad(note(7), 7.6, 0.05))
    add(31.1, pad(note(12), 7.6, 0.035))
    swell_notes = [0, 7, 12, 15]
    for i, at in enumerate([31.3, 33.1, 35.0, 36.8]):
        add(at, piano(note(swell_notes[i]), 2.0, 0.10 + i * 0.012), pan=-0.2 + i * 0.13)

    # 38,90–40,60 · marca — una nota final que se apaga, sin campana de venta
    add(38.95, piano(note(12), 1.7, 0.09))
    add(38.95, pad(note(0), 1.65, 0.03))


# ───────────────── mezcla: ducking de voz, límite y fundidos ─────────────────

VO = [
    (0.30, 4.71), (5.26, 10.09), (10.54, 14.62), (15.17, 18.17),
    (18.82, 24.91), (25.56, 30.24), (30.99, 36.92)
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
