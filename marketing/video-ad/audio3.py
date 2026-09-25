#!/usr/bin/env python3
"""
Banda sonora del anuncio 3 de D-Code Partners («DCode OS»), 18 s.

Mismo motor de síntesis que audio.py/audio2.py —sin samples ni librerías
externas, pista original y libre de derechos por construcción— pero con un
carácter distinto: aquí no hay caos ni comedia, es la presentación segura de
un sistema. Pulso constante y confiado desde el segundo 1, sin la escalada
de tensión de los otros dos anuncios; cada corte de escena lleva una
confirmación breve (un "tono de sistema", no un golpe).

Arco:
    0.0 – 1.9   la pregunta, casi en silencio: solo un pulso grave arrancando
    1.9 – 5.6   Proyecto — pulso ya estable, confirmación al entrar la barra
    5.6 – 9.4   Actividad — el pulso más presente, un tono por cada fila
    9.4 – 12.6  Incidencia — breve tensión en rojo, resuelta en verde
   12.6 – 15.0  Módulos — arpegio ascendente, un tono por palabra
   15.0 – 18.0  Cierre — el acorde se abre, campana de marca, silencio final

Uso:  python3 audio3.py out/banda-sonora-3.wav
"""

import math
import sys
import wave
from array import array

SR = 44100
DUR = 18.0
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


_seed = [0x0D5A11]


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
    """Tono de confirmación del sistema: limpio, sin aspereza."""
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


# ──────────────────────────────── pads ────────────────────────────────

CHORDS = [
    (0.0,  2.0,  [-12, 7],           0.045),   # abierto, sin tercera: la pregunta
    (1.85, 5.7,  [-12, 0, 3, 7],     0.085),
    (5.5,  9.5,  [-12, 0, 3, 7, 10], 0.095),
    (9.3, 10.9,  [-12, -1, 3, 8],    0.100),   # tensión — incidencia abierta
    (10.7, 12.7, [-12, 0, 3, 7],     0.100),   # resuelta
    (12.5, 15.1, [-12, 3, 7, 10],    0.095),
    (14.9, 18.0, [-12, 0, 3, 7, 12], 0.100)
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

BEAT = 0.375


def render_arrangement():
    # ── s1 (0 – 1.9): casi en silencio, un pulso grave que arranca.
    add(0.35, pluck(note(-12), 1.3, 0.10, 0.1))
    add(1.0, whoosh(0.5, 0.09, rise=True))

    # ── s2 (1.9 – 5.6): Proyecto. Pulso estable + confirmaciones.
    t, step = 1.95, 0
    while t < 5.55:
        if step % 4 == 0:
            add(t, kick(0.26, 0.28))
        add(t, pluck(note([0, 7, 12, 7][step % 4] + 12), 0.30, 0.06), pan=-0.3 + 0.6 * (step % 2))
        t += BEAT
        step += 1
    add(2.45, blip(760, 0.09, 0.09))                  # chip DEMO
    add(2.50, bell(note(12), 1.0, 0.10))               # badge EN CURSO
    add(3.05, whoosh(0.5, 0.08, rise=True))            # barra de avance
    for i in range(3):                                 # filas de tareas
        add(3.40 + i * 0.16, tick(0.03, 0.07, 2000 + i * 200))

    # ── s3 (5.6 – 9.4): Actividad. Un tono por fila que llega.
    t, step = 5.65, 0
    while t < 9.35:
        if step % 4 == 0:
            add(t, kick(0.26, 0.26))
        add(t, pluck(note([0, 5, 7, 10][step % 4] + 12), 0.28, 0.055), pan=0.35)
        t += BEAT
        step += 1
    for i in range(4):
        add(5.95 + i * 0.22, bell(note(12 + [0, 4, 7, 4][i]), 0.9, 0.095), pan=-0.4 + i * 0.25)

    # ── s4 (9.4 – 12.6): Incidencia. Tensión breve, luego resuelta.
    add(9.55, pluck(note(-1), 1.1, 0.09))              # nota tensa (b6)
    add(10.75, whoosh(0.45, 0.11, rise=False))         # el giro de la insignia
    add(11.05, bell(note(7), 1.6, 0.14))                # RESUELTA
    add(11.15, bell(note(15), 1.4, 0.09))
    t, step = 9.5, 0
    while t < 12.5:
        add(t, kick(0.24, 0.20))
        t += BEAT * 1.3
        step += 1

    # ── s5 (12.6 – 15.0): Módulos. Arpegio ascendente, un tono por palabra.
    mods_notes = [0, 4, 7, 11, 14]
    for i, sm in enumerate(mods_notes):
        add(12.66 + i * 0.13, blip(note(sm + 12, base=260), 0.11, 0.10), pan=-0.4 + i * 0.2)
    t, step = 12.7, 0
    while t < 14.9:
        if step % 3 == 0:
            add(t, kick(0.24, 0.24))
        t += BEAT * 0.85
        step += 1

    # ── s6 (15.0 – 18.0): Cierre. Campana de marca, silencio al final.
    add(15.30, bell(note(0), 3.2, 0.17))
    add(15.45, bell(note(12), 2.8, 0.11))
    add(16.05, bell(note(19), 2.2, 0.08))               # badge OS
    add(17.35, blip(note(7, base=260), 0.14, 0.07))     # dominio


# ───────────────── mezcla: sin ducking de voz (pieza sin VO) ─────────────────
# Esta pieza es tan corta que se apoya solo en música + rótulos; si se le
# añade locución más adelante, aplicar el mismo patrón de ducking que
# audio.py/audio2.py sobre las líneas que se escriban.

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
    out = sys.argv[1] if len(sys.argv) > 1 else 'out/banda-sonora-3.wav'
    render_pads()
    render_arrangement()
    mixdown(out)
