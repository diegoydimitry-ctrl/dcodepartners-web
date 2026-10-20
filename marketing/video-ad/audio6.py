#!/usr/bin/env python3
"""
Banda sonora del anuncio 6 de D-Code Partners («El scroll que no para en
ti» — redes sociales + páginas web para negocios), 27 s.

Mismo motor de síntesis que el resto de la serie —sin samples ni
librerías externas, pista original y libre de derechos por construcción—
con un carácter distinto, a juego con la estética B/N minimalista de
ad6.html: más seco y percusivo, casi sin pad armónico hasta el giro,
apoyado en texturas de interfaz (tics, clics) en vez de música "de
anuncio". Nada de swells épicos ni de identidad sonora prestada.

Arco, alineado con el guion:
    0.0  – 3.6   seco: solo tics de interfaz, un pulso grave apenas presente
    3.6  – 9.0   el mismo pulso, sin resolver — la cadencia no cambia
    9.0  – 15.0  el giro: entra el primer acorde real, limpio, con aire
   15.0 – 21.0  ritmo claro y confiado — el servicio funcionando
   21.0 – 24.0  resolución — el pulso de apertura, ahora sin fricción
   24.0 – 27.0  cierre — un acorde que se abre y una campana de marca

La mezcla deja los dos tramos de voz (GUION-6.md) atenuados (ducking),
igual que el resto de la serie.

Uso:  python3 audio6.py out/banda-sonora-6.wav
"""

import math
import sys
import wave
from array import array

SR = 44100
DUR = 27.0
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


_seed = [0xA6D1C0]


def rnd():
    _seed[0] = (1103515245 * _seed[0] + 12345) & 0x7FFFFFFF
    return _seed[0] / 0x7FFFFFFF


def pluck(freq, dur, amp=0.22, bright=0.18):
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


def tick(dur=0.028, amp=0.08, tone=3200.0):
    """Tic de interfaz — clic seco de tap/tecla, el sonido base de la pieza."""
    n = int(dur * SR)
    out = []
    prev = 0.0
    for i in range(n):
        t = i / SR
        e = math.exp(-95.0 * t)
        prev = prev * 0.5 + (rnd() * 2 - 1) * 0.5
        out.append((prev * 0.65 + 0.35 * math.sin(TWO_PI * tone * t)) * e * amp)
    return out


def subpulse(dur=0.5, freq=48.0, amp=0.16):
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        e = math.exp(-5.5 * t)
        out.append(math.sin(TWO_PI * freq * t) * e * amp)
    return out


def kick(dur=0.26, amp=0.30):
    n = int(dur * SR)
    out = []
    ph = 0.0
    for i in range(n):
        t = i / SR
        f = 42.0 + 65.0 * math.exp(-22.0 * t)
        ph += TWO_PI * f / SR
        out.append(math.sin(ph) * math.exp(-8.5 * t) * amp)
    return out


def whoosh(dur=0.6, amp=0.11, rise=True):
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


# ──────────────────────────────── pads ────────────────────────────────
# Casi ausentes hasta el giro — la pieza empieza seca a propósito.

CHORDS = [
    (9.0,  15.4, [-12, 3, 7, 10],      0.075),   # el giro — primer acorde
    (14.9, 21.3, [-12, 0, 3, 7],       0.090),   # el servicio funcionando
    (20.8, 24.2, [-12, 0, 7, 12],      0.080),   # la resolución
    (23.8, 27.0, [-12, 0, 3, 7, 12],   0.100)    # cierre
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

BEAT = 0.42


def render_arrangement():
    # ── s1 (0 – 3.6): el scroll — tics secos, pulso grave apenas presente.
    add(0.0, subpulse(1.2, 46.0, 0.10))
    tick_at = [0.05, 0.95, 1.65, 1.72, 2.95, 3.05, 3.15]
    for i, at in enumerate(tick_at):
        add(at, tick(0.03, 0.075, 2800 + i * 140), pan=(rnd() * 2 - 1) * 0.3)

    # ── s2 (3.6 – 9.0): el detalle — misma cadencia, sin resolver.
    t, step = 3.7, 0
    while t < 8.9:
        add(t, tick(0.026, 0.055, 2600 + (step % 5) * 90), pan=(rnd() * 2 - 1) * 0.5)
        t += BEAT * (1.0 if step % 3 else 1.6)
        step += 1
    add(3.75, subpulse(1.0, 44.0, 0.09))
    add(7.9, whoosh(0.5, 0.07, rise=False))  # la web que no carga

    # ── s3 (9.0 – 15.0): el giro — entra el primer acorde, con aire.
    add(9.05, whoosh(0.7, 0.12, rise=True))
    add(9.5, bell(note(0), 2.4, 0.14))
    add(9.65, bell(note(12), 2.0, 0.09))
    add(13.3, bell(note(7), 1.4, 0.11))   # "La misma empresa."
    add(14.1, bell(note(15), 1.3, 0.10))  # "Mejor contada."

    # ── s4 (15.0 – 21.0): el servicio — ritmo claro y confiado.
    t, step = 15.1, 0
    while t < 20.8:
        if step % 4 == 0:
            add(t, kick(0.24, 0.24))
        add(t, pluck(note([0, 7, 12, 7][step % 4] + 12), 0.26, 0.06), pan=-0.3 + 0.6 * (step % 2))
        t += BEAT
        step += 1
    dots_at = [19.5, 19.65, 19.8, 20.3, 20.45, 20.6]
    for i, at in enumerate(dots_at):
        add(at, tick(0.03, 0.06, 2200 + i * 80), pan=-0.4 + i * 0.16)

    # ── s5 (21.0 – 24.0): el bucle — el mismo pulso, ahora sin fricción.
    add(21.0, subpulse(1.0, 48.0, 0.10))
    add(21.45, tick(0.03, 0.07, 2900))
    add(21.75, bell(note(12), 1.6, 0.12))  # la web se abre sin dudar

    # ── s6 (24.0 – 27.0): cierre — acorde abierto, campana de marca.
    add(24.1, whoosh(1.0, 0.10, rise=False))
    add(24.3, bell(note(0), 2.6, 0.16))
    add(24.45, bell(note(12), 2.2, 0.10))
    add(25.9, bell(note(19), 1.6, 0.08))


# ───────────────── mezcla: ducking de voz, límite y fundidos ─────────────────

VO = [(4.70, 8.50), (9.30, 12.90)]
DUCK = 0.48
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
        if t < 0.3:
            d *= t / 0.3
        if t > DUR - 1.0:
            d *= max(0.0, (DUR - t) / 1.0)
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
    out = sys.argv[1] if len(sys.argv) > 1 else 'out/banda-sonora-6.wav'
    render_pads()
    render_arrangement()
    mixdown(out)
