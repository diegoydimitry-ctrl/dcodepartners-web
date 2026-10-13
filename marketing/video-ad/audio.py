#!/usr/bin/env python3
"""
Banda sonora del anuncio de D-Code Partners.

Sintetiza desde cero (sin samples ni librerías externas) los 40 s de música y
efectos del anuncio, de modo que la pista es original y libre de derechos por
construcción. Salida: WAV estéreo 44,1 kHz / 16 bits.

Estructura, alineada con el guion:
    0.0 – 4.5   mínimo, avisos que se acumulan
    4.5 – 10.5  pulso repetitivo, teclas
   10.5 – 15.5  tensión, reloj acelerando
   15.5 – 16.1  SILENCIO (el giro)
   16.1 – 20.8  pad que vuelve, conexiones
   20.8 – 28.6  energía, el sistema funcionando
   28.6 – 34.6  resolución cálida
   34.6 – 40.0  cierre elegante

La mezcla ya viene atenuada ("ducking") en los tramos de voz en off indicados en
GUION.md, para que la locución se pueda superponer sin volver a mezclar.

Uso:  python3 audio.py out/banda-sonora.wav
"""

import math
import struct
import sys
import wave
from array import array

SR = 44100
DUR = 40.0
N = int(SR * DUR)

TWO_PI = 2.0 * math.pi


def buf():
    return array('d', bytes(8 * N))


L, R = buf(), buf()


# ────────────────────────────── utilidades ──────────────────────────────

def clampi(i):
    return 0 if i < 0 else (N - 1 if i >= N else i)


def note(semitones, base=220.0):
    """Frecuencia a `semitones` de A3 (220 Hz)."""
    return base * (2.0 ** (semitones / 12.0))


def env_ad(n, i, attack, decay):
    """Envolvente ataque/caída exponencial, i en [0, n)."""
    if i < attack:
        return i / attack if attack else 1.0
    k = (i - attack) / decay if decay else 1.0
    return math.exp(-3.2 * k)


def add(start_s, samples, pan=0.0):
    """Suma un generador de muestras a partir del segundo `start_s`."""
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


# ─────────────────────────────── voces ───────────────────────────────

def pluck(freq, dur, amp=0.25, decay=None):
    """Pulsación corta y limpia: fundamental + 2 armónicos suaves."""
    n = int(dur * SR)
    decay = decay or n * 0.55
    atk = int(0.004 * SR)
    out = []
    for i in range(n):
        e = env_ad(n, i, atk, decay)
        p = TWO_PI * freq * i / SR
        s = math.sin(p) + 0.30 * math.sin(2 * p) + 0.12 * math.sin(3 * p)
        out.append(s * e * amp)
    return out


def bell(freq, dur, amp=0.22):
    """Campana/confirmación: parciales inarmónicos."""
    n = int(dur * SR)
    atk = int(0.002 * SR)
    out = []
    for i in range(n):
        e = env_ad(n, i, atk, n * 0.30)
        t = i / SR
        s = (math.sin(TWO_PI * freq * t)
             + 0.55 * math.sin(TWO_PI * freq * 2.76 * t) * math.exp(-4.0 * t)
             + 0.30 * math.sin(TWO_PI * freq * 5.40 * t) * math.exp(-7.0 * t))
        out.append(s * e * amp)
    return out


def blip(freq, dur=0.13, amp=0.14):
    """Aviso de notificación: dos tonos ascendentes muy breves."""
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        e = env_ad(n, i, int(0.002 * SR), n * 0.28)
        f = freq * (1.0 + 0.26 * min(1.0, t / (dur * 0.45)))
        out.append(math.sin(TWO_PI * f * t) * e * amp)
    return out


def kick(dur=0.30, amp=0.55):
    """Bombo: barrido de 130 Hz a 45 Hz."""
    n = int(dur * SR)
    out = []
    ph = 0.0
    for i in range(n):
        t = i / SR
        f = 45.0 + 85.0 * math.exp(-24.0 * t)
        ph += TWO_PI * f / SR
        e = math.exp(-9.0 * t)
        out.append(math.sin(ph) * e * amp)
    return out


_seed = [0x2F6E2B1]


def rnd():
    """PRNG determinista: la banda sonora es reproducible bit a bit."""
    _seed[0] = (1103515245 * _seed[0] + 12345) & 0x7FFFFFFF
    return _seed[0] / 0x7FFFFFFF


def tick(dur=0.035, amp=0.10, tone=2400.0):
    """Clic de tecla / tic de reloj: ruido filtrado + tono corto."""
    n = int(dur * SR)
    out = []
    prev = 0.0
    for i in range(n):
        t = i / SR
        e = math.exp(-70.0 * t)
        nz = (rnd() * 2 - 1)
        prev = prev * 0.55 + nz * 0.45          # paso bajo de un polo
        out.append((prev * 0.7 + 0.3 * math.sin(TWO_PI * tone * t)) * e * amp)
    return out


def whoosh(dur=0.9, amp=0.20, rise=True):
    """Transición: ruido con barrido de filtro."""
    n = int(dur * SR)
    out = []
    lp = 0.0
    for i in range(n):
        x = i / n
        e = math.sin(math.pi * x) ** 1.5
        a = 0.02 + 0.55 * (x if rise else (1 - x))
        nz = (rnd() * 2 - 1)
        lp = lp * (1 - a) + nz * a
        out.append(lp * e * amp)
    return out


def sub_swell(start, dur, freq=55.0, amp=0.30):
    """Subgrave que crece: tensión."""
    n = int(dur * SR)
    out = []
    for i in range(n):
        x = i / n
        e = (x ** 2) * (1 - max(0.0, (x - 0.88) / 0.12))
        f = freq * (1 + 0.35 * x)
        out.append(math.sin(TWO_PI * f * i / SR) * e * amp)
    add(start, out)


# ──────────────────────────────── pads ────────────────────────────────

# (inicio, fin, [semitonos sobre A3], ganancia)
CHORDS = [
    (0.0,  4.6,  [-12, 0, 3, 7],        0.085),   # Am — reposo inquieto
    (4.4, 10.7,  [-12, 0, 3, 7, 10],    0.105),   # Am7
    (10.5, 15.5, [-12, -1, 3, 8],       0.130),   # tensión (b6)
    # 15.5 – 16.1: silencio absoluto
    (16.05, 20.9, [-12, 0, 7, 12],      0.100),   # abierto, sin tercera
    (20.7, 24.7, [-12, 3, 7, 10],       0.125),   # C/Am
    (24.6, 28.7, [-10, 2, 5, 9],        0.125),   # F
    (28.5, 34.7, [-12, 3, 7, 12],       0.115),   # resolución
    (34.5, 40.0, [-12, 0, 3, 7, 12],    0.120),   # cierre
]


def render_pads():
    for (s, e, semis, gain) in CHORDS:
        i0, i1 = int(s * SR), min(N, int(e * SR))
        n = i1 - i0
        if n <= 0:
            continue
        atk = int(min(0.9, (e - s) * 0.35) * SR)
        rel = int(min(0.8, (e - s) * 0.30) * SR)
        freqs = [note(x) for x in semis]
        for i in range(n):
            # envolvente del acorde
            a = i / atk if i < atk else 1.0
            r = (n - i) / rel if (n - i) < rel else 1.0
            env = a * r * gain
            if env <= 0:
                continue
            t = (i0 + i) / SR
            lfo = 1.0 + 0.05 * math.sin(TWO_PI * 0.13 * t)
            sl = sr = 0.0
            for k, f in enumerate(freqs):
                # ligera desafinación entre canales: anchura estéreo
                pl = TWO_PI * (f * 0.9985) * t
                pr = TWO_PI * (f * 1.0015) * t
                w = 1.0 / (1.0 + k * 0.55)
                sl += (math.sin(pl) + 0.22 * math.sin(2 * pl)) * w
                sr += (math.sin(pr) + 0.22 * math.sin(2 * pr)) * w
            idx = i0 + i
            L[idx] += sl * env * lfo
            R[idx] += sr * env * lfo


# ───────────────────────── arreglo y efectos ─────────────────────────

def render_arrangement():
    # ESCENA 1 — avisos que se acumulan (mismos tiempos que las tarjetas).
    for i in range(22):
        at = 0.5 + 3.15 * ((i / 22.0) ** 1.65)
        add(at, blip(660 * (1 + 0.06 * (i % 5)), 0.12, 0.085),
            pan=-0.6 + 1.2 * ((i * 7) % 10) / 10.0)

    # ESCENA 2 — pulso repetitivo + teclas: el bucle sin salida.
    beat = 0.387                                   # ~155 BPM, ágil
    t = 4.6
    step = 0
    while t < 10.45:
        if step % 2 == 0:
            add(t, kick(0.26, 0.30))
        add(t, pluck(note([0, 3, 7, 3][step % 4] + 12), 0.30, 0.075),
            pan=-0.35 if step % 2 else 0.35)
        t += beat / 2
        step += 1
    t = 4.7
    while t < 10.4:                                 # teclado
        add(t, tick(0.03, 0.055, 2200 + 900 * rnd()), pan=(rnd() * 2 - 1) * 0.7)
        t += 0.075 + rnd() * 0.075

    # ESCENA 3 — el reloj acelera y la tensión sube.
    sub_swell(10.6, 4.7, 52.0, 0.34)
    t, spd = 10.6, 0.34
    while t < 15.35:
        add(t, tick(0.045, 0.115, 1500), pan=(rnd() * 2 - 1) * 0.35)
        spd *= 0.90                                 # acelerando
        t += max(0.035, spd)
    add(14.95, whoosh(0.62, 0.26, rise=True))

    # ESCENA 4 — el giro. 15.5 – 16.1 en silencio absoluto.
    add(16.05, whoosh(1.0, 0.13, rise=False))
    for i in range(6):                              # cada nodo que se conecta
        add(16.72 + i * 0.13, bell(note(12 + [0, 3, 7, 10, 12, 15][i]), 1.5, 0.115),
            pan=math.sin(i * 1.05) * 0.6)
    add(19.0, bell(note(3), 2.0, 0.10))

    # ESCENA 5 — el sistema funciona: energía y confianza.
    t, step = 20.85, 0
    while t < 28.5:
        if step % 4 == 0:
            add(t, kick(0.30, 0.42))
        arp = [0, 7, 12, 15, 12, 7][step % 6]
        add(t, pluck(note(arp + 12), 0.34, 0.085), pan=-0.45 + 0.9 * (step % 3) / 2)
        t += beat / 2
        step += 1
    for at in (21.95, 23.30):                       # el pulso recorriendo la cadena
        add(at, whoosh(0.75, 0.15, rise=True))
    for i in range(4):                              # ANALIZAR / DISEÑAR / ...
        add(25.10 + i * 0.44, bell(note(12 + i * 4), 1.1, 0.115))

    # ESCENA 6 — resultado: se retira la percusión dura, quedan confirmaciones.
    t, step = 28.65, 0
    while t < 34.4:
        if step % 8 == 0:
            add(t, kick(0.30, 0.24))
        add(t, pluck(note([12, 15, 19, 15][step % 4]), 0.40, 0.055),
            pan=-0.4 + 0.8 * (step % 2))
        t += beat
        step += 1
    for i in range(12):                             # paneles que se confirman
        add(28.80 + i * 0.055, blip(880, 0.07, 0.030), pan=(rnd() * 2 - 1) * 0.5)
    for i in range(3):                              # los tres beneficios
        add(29.15 + i * 1.62, bell(note(12 + [0, 4, 7][i]), 1.6, 0.10))

    # ESCENA 7 — cierre.
    add(34.70, whoosh(1.3, 0.11, rise=False))
    add(34.95, bell(note(3), 3.2, 0.16))
    add(35.05, bell(note(15), 3.0, 0.10))
    add(38.05, bell(note(10), 2.0, 0.085))          # dcodepartners.com


# ───────────────── mezcla: ducking de voz, límite y fundidos ─────────────────

# Tramos donde va la locución (ver GUION.md). La música baja para dejar sitio.
VO = [
    (0.60,  4.40), (5.00, 10.20), (10.80, 15.30),
    (16.40, 18.40), (19.00, 20.50), (21.20, 28.40),
    (29.00, 34.20), (35.40, 38.40),
]
DUCK = 0.52          # ganancia de la música bajo la voz
FADE = 0.10          # rampa del ducking, en segundos


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

        # silencio del giro, reforzado por si alguna cola se solapa
        if 15.52 < t < 16.02:
            d *= max(0.0, 1.0 - (t - 15.52) / 0.10) * 0.25

        # fundidos de entrada y salida
        if t < 0.35:
            d *= t / 0.35
        if t > DUR - 1.1:
            d *= max(0.0, (DUR - t) / 1.1)

        L[i] *= d
        R[i] *= d
        peak = max(peak, abs(L[i]), abs(R[i]))

    # Normaliza a -1.5 dBFS y aplica una saturación suave para pegar la mezcla.
    target = 0.84
    k = (target / peak) if peak > 0 else 1.0
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
    out = sys.argv[1] if len(sys.argv) > 1 else 'out/banda-sonora.wav'
    render_pads()
    render_arrangement()
    mixdown(out)
