#!/usr/bin/env python3
"""
Banda sonora del anuncio 5 de D-Code Partners («D-Code Finance», recorte
social), 22 s.

Mismo motor de síntesis que el resto —sin samples ni librerías externas—
condensado a la mitad de escenas del anuncio 4: el mismo carácter
cinemático-corporativo, sin locución que ducking, así que la música lleva
todo el peso rítmico. Cada corte de escena coincide con un golpe de
percusión o una campana, para que el vídeo funcione también sin sonido
(el ritmo se lee en el movimiento, la música solo lo refuerza).

Arco:
    0.0  – 3.2   casi silencio bajo los documentos dispersos
    3.2  – 7.0   la revelación: barrido + campana + acorde que se abre
    7.0  – 13.2  energía de sistema — un tono por módulo
   13.2  – 18.2  calma segura — el asistente responde
   18.2  – 22.0  cierre: campana de marca, silencio final

Uso:  python3 audio5.py out/banda-sonora-5.wav
"""

import math
import sys
import wave
from array import array

SR = 44100
DUR = 22.0
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


_seed = [0x5A1FC0]


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


def kick(dur=0.26, amp=0.32):
    n = int(dur * SR)
    out = []
    ph = 0.0
    for i in range(n):
        t = i / SR
        f = 44.0 + 70.0 * math.exp(-22.0 * t)
        ph += TWO_PI * f / SR
        out.append(math.sin(ph) * math.exp(-8.5 * t) * amp)
    return out


def whoosh(dur=0.6, amp=0.14, rise=True):
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


def tick(dur=0.03, amp=0.06, tone=1800.0):
    n = int(dur * SR)
    out = []
    prev = 0.0
    for i in range(n):
        t = i / SR
        e = math.exp(-75.0 * t)
        prev = prev * 0.55 + (rnd() * 2 - 1) * 0.45
        out.append((prev * 0.6 + 0.4 * math.sin(TWO_PI * tone * t)) * e * amp)
    return out


# ──────────────────────────────── pads ────────────────────────────────

CHORDS = [
    (0.0,   3.5,  [-12, 7],           0.045),   # abierto — el caos
    (3.0,   7.4,  [-12, 0, 3, 7, 10], 0.100),   # la revelación
    (7.0,  13.5,  [-12, 3, 7, 10],    0.110),   # el sistema funciona
    (13.0, 18.5,  [-12, 0, 7, 12],    0.090),   # calma segura
    (17.9, 22.0,  [-12, 0, 3, 7, 12], 0.115)    # cierre
]


def render_pads():
    for (s, e, semis, gain) in CHORDS:
        i0, i1 = int(s * SR), min(N, int(e * SR))
        n = i1 - i0
        if n <= 0:
            continue
        atk = int(min(0.7, (e - s) * 0.3) * SR)
        rel = int(min(0.7, (e - s) * 0.3) * SR)
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

BEAT = 0.38


def render_arrangement():
    # ── s1 (0 – 3.2): casi silencio.
    add(0.20, pluck(note(-12), 2.6, 0.10, 0.09))
    for i in range(5):
        add(0.10 + i * 0.22, tick(0.03, 0.05, 1700 + i * 100))

    # ── s2 (3.2 – 7.0): la revelación.
    add(3.35, whoosh(0.5, 0.14, rise=True))
    add(4.05, bell(note(0), 2.6, 0.17))
    add(4.20, bell(note(12), 2.2, 0.11))
    add(5.10, bell(note(7), 1.4, 0.09))

    # ── s3 (7.0 – 13.2): el sistema funciona.
    t, step = 7.1, 0
    while t < 13.0:
        if step % 4 == 0:
            add(t, kick(0.24, 0.26))
        add(t, pluck(note([0, 7, 12, 15, 12, 7][step % 6] + 12), 0.28, 0.065),
            pan=-0.4 + 0.8 * ((step * 3) % 5) / 4)
        t += BEAT
        step += 1
    mod_at = [8.0, 8.55, 9.1, 9.65, 10.2]
    for i, at in enumerate(mod_at):
        add(at, blip(680 + i * 50, 0.09, 0.075), pan=-0.5 + i * 0.2)

    # ── s4 (13.2 – 18.2): calma segura.
    add(13.65, bell(note(12), 1.3, 0.11))
    add(14.25, bell(note(7), 1.8, 0.13))
    add(15.20, blip(900, 0.10, 0.06))
    add(16.05, tick(0.05, 0.045, 2000))

    # ── s5 (18.2 – 22.0): cierre.
    add(18.45, whoosh(1.0, 0.11, rise=False))
    add(18.65, bell(note(0), 3.0, 0.17))
    add(18.80, bell(note(12), 2.6, 0.11))
    add(20.40, blip(note(7, base=260), 0.13, 0.07))


# ───────────────── mezcla: sin ducking de voz (pieza sin VO) ─────────────────

def mixdown(path):
    peak = 0.0
    for i in range(N):
        t = i / SR
        d = 1.0
        if t < 0.3:
            d *= t / 0.3
        if t > DUR - 0.8:
            d *= max(0.0, (DUR - t) / 0.8)
        L[i] *= d
        R[i] *= d
        peak = max(peak, abs(L[i]), abs(R[i]))

    k = (0.84 / peak) if peak > 0 else 1.0
    frames = array('h', bytes(4 * N))
    for i in range(N):
        for ch, b in ((0, L), (1, R)):
            v = math.tanh(b[i] * k * 1.08) * 0.94
            frames[2 * i + ch] = int(max(-32767, min(32767, v * 32767)))

    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(frames.tobytes())
    print(f'audio  → {path}  ({DUR:.1f}s, pico previo {peak:.3f})')


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else 'out/banda-sonora-5.wav'
    render_pads()
    render_arrangement()
    mixdown(out)
