#!/usr/bin/env python3
"""
Banda sonora del anuncio 2 de D-Code Partners («Llamar a Javier»), 60 s.

Mismo motor de síntesis que audio.py —sin samples ni librerías externas, pista
original y libre de derechos por construcción— pero con otro carácter: aquí la
música acompaña una comedia, no un anuncio cinematográfico.

Arco:
    0.0 –  6.6   ligero, casi nada: solo los pops de mensaje
    6.6 – 11.8   se acumula: avisos cada vez más seguidos
   11.8 – 16.6   pulso cómico, clics de pestañas
   16.6 – 22.0   sigue subiendo, con guasa
   22.0 – 27.0   notas de papel, ritmo juguetón
   27.0 – 32.0   la agenda: la broma se tensa
   32.0 – 32.7   SILENCIO (el único momento serio)
   32.7 – 40.0   pad desnudo: aquí se habla en serio
   40.0 – 49.2   resolución: el sistema funciona
   49.2 – 60.0   remate y cierre de marca

La mezcla ya viene atenuada en los tramos de narración de GUION-2.md.

Uso:  python3 audio2.py out/banda-sonora-2.wav
"""

import math
import sys
import wave
from array import array

SR = 44100
DUR = 60.0
N = int(SR * DUR)
TWO_PI = 2.0 * math.pi

L = array('d', bytes(8 * N))
R = array('d', bytes(8 * N))


# ────────────────────────────── utilidades ──────────────────────────────

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


_seed = [0x5AF3C1]


def rnd():
    _seed[0] = (1103515245 * _seed[0] + 12345) & 0x7FFFFFFF
    return _seed[0] / 0x7FFFFFFF


# ─────────────────────────────── voces ───────────────────────────────

def pluck(freq, dur, amp=0.25, bright=0.30):
    n = int(dur * SR)
    atk = int(0.003 * SR)
    out = []
    for i in range(n):
        e = env_ad(i, atk, n * 0.42)
        p = TWO_PI * freq * i / SR
        s = math.sin(p) + bright * math.sin(2 * p) + bright * 0.4 * math.sin(3 * p)
        out.append(s * e * amp)
    return out


def marimba(freq, dur=0.5, amp=0.20):
    """Timbre de madera: da el aire cómico de los actos 1 y 2."""
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        e = env_ad(i, int(0.002 * SR), n * 0.22)
        s = (math.sin(TWO_PI * freq * t)
             + 0.42 * math.sin(TWO_PI * freq * 4.0 * t) * math.exp(-11.0 * t)
             + 0.18 * math.sin(TWO_PI * freq * 9.2 * t) * math.exp(-20.0 * t))
        out.append(s * e * amp)
    return out


def bell(freq, dur, amp=0.22):
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        e = env_ad(i, int(0.002 * SR), n * 0.30)
        s = (math.sin(TWO_PI * freq * t)
             + 0.55 * math.sin(TWO_PI * freq * 2.76 * t) * math.exp(-4.0 * t)
             + 0.30 * math.sin(TWO_PI * freq * 5.40 * t) * math.exp(-7.0 * t))
        out.append(s * e * amp)
    return out


def pop(freq=520.0, dur=0.10, amp=0.16):
    """Mensaje entrante/saliente: glissando corto hacia arriba."""
    n = int(dur * SR)
    out = []
    ph = 0.0
    for i in range(n):
        t = i / SR
        f = freq * (1.0 + 0.85 * min(1.0, t / (dur * 0.55)))
        ph += TWO_PI * f / SR
        e = env_ad(i, int(0.0015 * SR), n * 0.30)
        out.append(math.sin(ph) * e * amp)
    return out


def blip(freq, dur=0.12, amp=0.13):
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        e = env_ad(i, int(0.002 * SR), n * 0.28)
        f = freq * (1.0 + 0.26 * min(1.0, t / (dur * 0.45)))
        out.append(math.sin(TWO_PI * f * t) * e * amp)
    return out


def kick(dur=0.30, amp=0.45):
    n = int(dur * SR)
    out = []
    ph = 0.0
    for i in range(n):
        t = i / SR
        f = 45.0 + 85.0 * math.exp(-24.0 * t)
        ph += TWO_PI * f / SR
        out.append(math.sin(ph) * math.exp(-9.0 * t) * amp)
    return out


def tick(dur=0.035, amp=0.10, tone=2400.0):
    n = int(dur * SR)
    out = []
    prev = 0.0
    for i in range(n):
        t = i / SR
        e = math.exp(-70.0 * t)
        prev = prev * 0.55 + (rnd() * 2 - 1) * 0.45
        out.append((prev * 0.7 + 0.3 * math.sin(TWO_PI * tone * t)) * e * amp)
    return out


def paper(dur=0.16, amp=0.14):
    """Nota adhesiva al pegarse: ruido corto y sordo."""
    n = int(dur * SR)
    out = []
    lp = 0.0
    for i in range(n):
        t = i / SR
        e = math.exp(-26.0 * t)
        lp = lp * 0.82 + (rnd() * 2 - 1) * 0.18
        out.append(lp * e * amp * 2.2)
    return out


def whoosh(dur=0.9, amp=0.20, rise=True):
    n = int(dur * SR)
    out = []
    lp = 0.0
    for i in range(n):
        x = i / n
        e = math.sin(math.pi * x) ** 1.5
        a = 0.02 + 0.55 * (x if rise else (1 - x))
        lp = lp * (1 - a) + (rnd() * 2 - 1) * a
        out.append(lp * e * amp)
    return out


# ──────────────────────────────── pads ────────────────────────────────

CHORDS = [
    (0.0,   6.8,  [-12, 0, 7],          0.060),   # casi nada: que respire el chiste
    (6.6,  11.9,  [-12, 0, 3, 7],       0.085),
    (11.8, 16.7,  [-12, 0, 3, 7, 10],   0.095),
    (16.6, 22.1,  [-12, -1, 3, 7],      0.100),
    (22.0, 27.1,  [-12, 0, 3, 8],       0.105),
    (27.0, 32.0,  [-12, -1, 3, 8],      0.125),   # la broma se tensa
    # 32.0 – 32.7 silencio
    (32.65, 40.1, [-12, 0, 7, 12],      0.090),   # serio, abierto, sin tercera
    (40.0, 49.3,  [-12, 3, 7, 10],      0.115),
    (49.2, 60.0,  [-12, 0, 3, 7, 12],   0.115)
]


def render_pads():
    for (s, e, semis, gain) in CHORDS:
        i0, i1 = int(s * SR), min(N, int(e * SR))
        n = i1 - i0
        if n <= 0:
            continue
        atk = int(min(0.9, (e - s) * 0.30) * SR)
        rel = int(min(0.8, (e - s) * 0.28) * SR)
        freqs = [note(x) for x in semis]
        for i in range(n):
            a = i / atk if i < atk else 1.0
            r = (n - i) / rel if (n - i) < rel else 1.0
            env = a * r * gain
            if env <= 0:
                continue
            t = (i0 + i) / SR
            lfo = 1.0 + 0.05 * math.sin(TWO_PI * 0.15 * t)
            sl = sr_ = 0.0
            for k, f in enumerate(freqs):
                pl = TWO_PI * (f * 0.9985) * t
                pr = TWO_PI * (f * 1.0015) * t
                w = 1.0 / (1.0 + k * 0.55)
                sl += (math.sin(pl) + 0.20 * math.sin(2 * pl)) * w
                sr_ += (math.sin(pr) + 0.20 * math.sin(2 * pr)) * w
            L[i0 + i] += sl * env * lfo
            R[i0 + i] += sr_ * env * lfo


# ───────────────────────── arreglo y efectos ─────────────────────────

BEAT = 0.4        # 150 BPM


def render_arrangement():
    # ── ESC. 1 (0 – 6,6): los dos mensajes, y luego nada. El vacío es el chiste.
    add(0.55, pop(500, 0.11, 0.17))                     # entra el del cliente
    add(1.70, pop(700, 0.10, 0.15), pan=0.25)           # "ahora mismo te respondo"
    add(3.45, whoosh(0.55, 0.16, rise=False))           # salto de seis horas
    add(3.62, marimba(note(-5), 0.7, 0.10))

    # ── ESC. 2 (6,6 – 11,8): la cascada, acelerando igual que en pantalla.
    for i in range(8):
        at = 6.6 + 0.25 + 2.6 * ((i / 8.0) ** 1.5)
        add(at, blip(560 * (1 + 0.09 * (i % 4)), 0.11, 0.10), pan=(rnd() * 2 - 1) * 0.6)
        add(at, tick(0.03, 0.05, 1800 + 700 * rnd()))
    t, step = 7.2, 0
    while t < 11.7:
        if step % 2 == 0:
            add(t, kick(0.24, 0.22))
        add(t, marimba(note([0, 3, 7, 3][step % 4]), 0.34, 0.075),
            pan=-0.3 if step % 2 else 0.3)
        t += BEAT
        step += 1

    # ── ESC. 3 (11,8 – 16,6): 47 clics de pestaña, cada vez más rápido.
    t, gap = 11.9, 0.10
    while t < 13.9:
        add(t, tick(0.028, 0.07, 2600 + 900 * rnd()), pan=(rnd() * 2 - 1) * 0.7)
        gap *= 0.965
        t += max(0.032, gap)
    add(13.85, bell(note(12), 1.1, 0.10))                # aterriza el "47"
    t, step = 12.0, 0
    while t < 16.5:
        if step % 2 == 0:
            add(t, kick(0.26, 0.26))
        add(t, marimba(note([0, 5, 7, 10][step % 4]), 0.32, 0.070),
            pan=-0.35 if step % 2 else 0.35)
        t += BEAT
        step += 1

    # ── ESC. 4 (16,6 – 22,0): un clic seco por cada Excel «definitivo».
    for i in range(5):
        at = 16.6 + 0.35 + i * 0.52
        add(at, tick(0.05, 0.10, 1400), pan=-0.2 + 0.1 * i)
        add(at, marimba(note(i * 2), 0.4, 0.085))
    t, step = 16.7, 0
    while t < 21.9:
        if step % 2 == 0:
            add(t, kick(0.26, 0.26))
        t += BEAT
        step += 1

    # ── ESC. 5 (22,0 – 27,0): las notas de Javier, cada una un poco más aguda.
    for i in range(6):
        at = 22.0 + 0.3 + i * 0.36
        add(at, paper(0.16, 0.16), pan=(rnd() * 2 - 1) * 0.5)
        add(at, marimba(note(i * 2), 0.38, 0.090))
    t, step = 22.1, 0
    while t < 26.9:
        if step % 2 == 0:
            add(t, kick(0.26, 0.28))
        add(t, marimba(note([0, 3, 7, 12][step % 4] + 12), 0.30, 0.055), pan=0.4)
        t += BEAT
        step += 1

    # ── ESC. 6 (27,0 – 32,0): la agenda se llena y la cosa aprieta.
    for i in range(7):
        add(27.0 + 0.3 + i * 0.30, tick(0.05, 0.095, 1200 + i * 130))
    t, step = 27.1, 0
    while t < 31.9:
        add(t, kick(0.26, 0.30 + 0.02 * step))
        add(t, marimba(note([0, 1, 3, 5][step % 4]), 0.28, 0.070), pan=-0.4)
        t += BEAT * 0.75                                   # acelera
        step += 1
    add(31.35, whoosh(0.62, 0.24, rise=True))

    # ── ESC. 7 (32,0 – 40,0): 0,7 s de silencio y luego solo el pad.
    add(32.65, whoosh(1.0, 0.10, rise=False))
    add(33.10, bell(note(0), 2.4, 0.11))
    add(35.30, bell(note(7), 2.2, 0.085))
    add(37.60, bell(note(3), 2.4, 0.095))

    # ── ESC. 8 (40,0 – 49,2): ahora contesta el sistema. Limpio y seguro.
    add(40.30, pop(500, 0.11, 0.15))
    add(41.20, pop(760, 0.10, 0.15), pan=0.25)
    add(42.25, pop(520, 0.11, 0.14))
    add(43.05, pop(780, 0.10, 0.15), pan=0.25)
    for i in range(3):                                     # las tres confirmaciones
        add(43.65 + i * 0.28, bell(note(12 + [0, 4, 7][i]), 1.2, 0.105))
    t, step = 40.1, 0
    while t < 49.1:
        if step % 4 == 0:
            add(t, kick(0.30, 0.36))
        add(t, pluck(note([0, 7, 12, 15, 12, 7][step % 6] + 12), 0.32, 0.075),
            pan=-0.45 + 0.9 * (step % 3) / 2)
        t += BEAT / 2
        step += 1
    add(45.95, whoosh(0.7, 0.14, rise=True))               # el flujo arranca
    for i in range(6):                                     # cada eslabón
        add(46.35 + i * 0.16, blip(700 + i * 60, 0.09, 0.065), pan=-0.5 + i * 0.2)

    # ── ESC. 9 (49,2 – 60,0): remate y marca.
    t, step = 49.3, 0
    while t < 55.9:
        if step % 4 == 0:
            add(t, kick(0.30, 0.24))
        add(t, pluck(note([12, 15, 19][step % 3]), 0.38, 0.050), pan=-0.35 + 0.7 * (step % 2))
        t += BEAT
        step += 1
    add(55.60, paper(0.16, 0.15))                          # la nota de Javier
    add(55.90, bell(note(19), 1.4, 0.10))                  # ✓ hecho
    add(56.90, whoosh(1.2, 0.10, rise=False))
    add(57.15, bell(note(3), 3.0, 0.16))                   # entra el logotipo
    add(57.25, bell(note(15), 2.8, 0.095))
    add(58.55, bell(note(10), 1.8, 0.080))                 # dcodepartners.com


# ───────────────── mezcla: ducking de narración y límite ─────────────────

VO = [
    (4.35,  6.45), (9.95, 11.65), (14.55, 16.45), (19.90, 21.85),
    (24.85, 26.85), (29.85, 31.85), (33.15, 40.00),
    (44.50, 45.75), (49.60, 56.20)
]
DUCK = 0.52
FADE = 0.10


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
        if 32.02 < t < 32.62:                       # el silencio, reforzado
            d *= max(0.0, 1.0 - (t - 32.02) / 0.10) * 0.22
        if t < 0.3:
            d *= t / 0.3
        if t > DUR - 1.2:
            d *= max(0.0, (DUR - t) / 1.2)
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
    out = sys.argv[1] if len(sys.argv) > 1 else 'out/banda-sonora-2.wav'
    render_pads()
    render_arrangement()
    mixdown(out)
