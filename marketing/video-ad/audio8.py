#!/usr/bin/env python3
"""
Banda sonora del anuncio 8 de D-Code Partners (Reel motivacional,
servicios premium), 45,6 s.

Pista nueva y distinta de la usada en el anuncio 7 (que era una pista
subida por el usuario, de piano ambiental) — aquí, por petición expresa
de no repetir banda sonora y de tener la licencia resuelta sin dudas,
se sintetiza desde cero en Python puro (sin muestras, sin librerías
externas, pista original y libre de derechos por construcción, apta
para Instagram, TikTok y YouTube sin reclamaciones de copyright).

Carácter: tech/corporativo, moderno y dinámico — pulso de bajo tipo
synth, arpegios digitales brillantes y un "stinger" de transición en
cada corte de escena del montaje (sincronizado con ad8.html), con una
curva de energía que crece escena a escena hasta el cierre. Nada de
piano ambiental ni de los mismos timbres que audio7.py.

Arco, sincronizado con las escenas de ad8.html:
    0,00          flash de apertura — riser + stinger + golpe grave
    0,00 – 11,71  escena 1 (skyline) — pulso bajo, casi solo, entra despacio
   11,71 – 18,11  escena 2 (papeleo) — pulso más seco, contraste "a mano"
   18,11 – 23,53  escena 3 (chat IA) — arpegio digital entra
   23,53 – 29,18  escena 4 (servidores) — pulso más denso, más energía
   29,18 – 33,99  escena 5 (red) — arpegios en capas, más lleno
   33,99 – 43,90  escena 6 (cierre) — el acorde se abre, el gran crescendo
   43,90 – 45,60  tarjeta de marca — resolución, un acorde que se sostiene

La mezcla deja las ocho ventanas de voz (GUION-8.md § 1) atenuadas
(ducking) con el mismo método fiable de tramos de volumen fijo que el
resto de la serie — no sidechaincompress, que ya demostró no distinguir
bien la voz del ruido de fondo de los clips de ElevenLabs.

Uso:  python3 audio8.py out/banda-sonora-8.wav
"""

import math
import sys
import wave
from array import array

SR = 44100
DUR = 45.6
N = int(SR * DUR)
TWO_PI = 2.0 * math.pi

L = array('d', bytes(8 * N))
R = array('d', bytes(8 * N))


def note(semitones, base=196.0):
    # Base en Sol (G3) en vez de La — registro distinto al de audio7.py
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


_seed = [0x8ADE0710]


def rnd():
    _seed[0] = (1103515245 * _seed[0] + 12345) & 0x7FFFFFFF
    return _seed[0] / 0x7FFFFFFF


def saw_bass(freq, dur, amp=0.20, harmonics=6, decay=4.0):
    """Bajo tipo synth — suma de armónicos tipo sierra, más 'digital'
    y presente que un seno puro: el timbre central de esta pista."""
    n = int(dur * SR)
    atk = int(0.004 * SR)
    out = []
    for i in range(n):
        t = i / SR
        a = i / atk if i < atk else 1.0
        e = math.exp(-decay * t)
        s = 0.0
        for k in range(1, harmonics + 1):
            s += (1.0 / k) * math.sin(TWO_PI * freq * k * t)
        out.append(s * a * e * amp)
    return out


def arp(freq, dur=0.22, amp=0.11):
    """Nota de arpegio digital — corta, brillante, percusiva."""
    n = int(dur * SR)
    atk = int(0.002 * SR)
    out = []
    for i in range(n):
        t = i / SR
        a = i / atk if i < atk else 1.0
        e = math.exp(-11.0 * t)
        s = (math.sin(TWO_PI * freq * t)
             + 0.5 * math.sin(TWO_PI * freq * 2 * t) * math.exp(-15.0 * t)
             + 0.25 * math.sin(TWO_PI * freq * 3 * t) * math.exp(-22.0 * t))
        out.append(s * a * e * amp)
    return out


def riser(dur=0.45, amp=0.11):
    """Barrido ascendente de ruido filtrado — marca cada corte de escena."""
    n = int(dur * SR)
    out = []
    lp = 0.0
    for i in range(n):
        x = i / n
        a_coef = 0.02 + 0.55 * x
        lp = lp * (1 - a_coef) + (rnd() * 2 - 1) * a_coef
        env = x ** 1.3
        out.append(lp * env * amp)
    return out


def stinger(freq, amp=0.16):
    """Golpe corto de transición — un pulso que cae de agudo a la nota base."""
    n = int(0.28 * SR)
    out = []
    ph = 0.0
    for i in range(n):
        t = i / SR
        f = freq * 2.2 * math.exp(-11.0 * t) + freq
        ph += TWO_PI * f / SR
        e = math.exp(-11.0 * t)
        out.append(math.sin(ph) * e * amp)
    return out


def pad(freq, dur, amp=0.045):
    n = int(dur * SR)
    atk = int(min(1.4, dur * 0.3) * SR)
    rel = int(min(1.4, dur * 0.3) * SR)
    out = []
    for i in range(n):
        t = i / SR
        a = i / atk if i < atk else 1.0
        r = (n - i) / rel if (n - i) < rel else 1.0
        s = (math.sin(TWO_PI * freq * 0.999 * t)
             + math.sin(TWO_PI * freq * 1.001 * t)) * 0.5
        out.append(s * a * r * amp)
    return out


def thud(dur=0.5, amp=0.17):
    n = int(dur * SR)
    out = []
    ph = 0.0
    for i in range(n):
        t = i / SR
        f = 90.0 + 130.0 * math.exp(-20.0 * t)
        ph += TWO_PI * f / SR
        env = math.exp(-7.0 * t)
        out.append(math.sin(ph) * env * amp)
    return out


def crack(dur=0.05, amp=0.09):
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        e = math.exp(-65.0 * t)
        out.append((rnd() * 2 - 1) * e * amp)
    return out


def hat(dur=0.045, amp=0.045):
    """Tic agudo filtrado — pulso digital, no percusión de batería real."""
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        e = math.exp(-90.0 * t)
        out.append((rnd() * 2 - 1) * e * amp)
    return out


# ──────────────────────────── arreglo ────────────────────────────

BEAT = 60.0 / 112.0  # 112 bpm — más vivo que la pieza anterior


def bass_groove(t0, t1, root_semi, density=1.0, amp=0.20, decay=5.0):
    """Pulso de bajo synth en corcheas, con alguna síncopa — density
    controla cuántos pulsos suenan (sparse al principio, lleno al final)."""
    t = t0
    step = 0
    while t < t1:
        play = True
        if density < 1.0 and (step % 2 == 1) and rnd() > density:
            play = False
        if play:
            semis = root_semi if step % 4 != 2 else root_semi + 7
            add(t, saw_bass(note(semis), BEAT * 0.9, amp, decay=decay),
                pan=(rnd() * 2 - 1) * 0.12)
        t += BEAT
        step += 1


def render_arrangement():
    # 0,00 · flash de apertura — riser + stinger + golpe grave bajo el corte
    add(0.0, riser(0.30, 0.09))
    add(0.0, thud(0.5, 0.17))
    add(0.0, crack(0.05, 0.09))
    add(0.26, stinger(note(-12), 0.14))

    # 0,00–11,71 · escena 1 (skyline) — el pulso entra despacio, casi solo
    bass_groove(0.9, 11.71, -12, density=0.55, amp=0.14, decay=5.5)
    add(5.2, pad(note(-12), 5.0, 0.035))

    # 11,71 · corte a escena 2 (papeleo) — transición
    add(11.71, riser(0.35, 0.09))
    add(11.95, stinger(note(-5), 0.13))

    # 11,71–18,11 · escena 2 — pulso más seco, contraste "a mano"
    bass_groove(12.1, 15.1, -12, density=0.6, amp=0.15, decay=6.0)
    hat_at = [15.35, 15.65, 15.95, 16.25, 16.9, 17.2, 17.5]
    for i, at in enumerate(hat_at):
        add(at, hat(0.04, 0.045), pan=(rnd() * 2 - 1) * 0.4)
    bass_groove(15.3, 18.0, -12, density=0.75, amp=0.16, decay=5.5)

    # 18,11 · corte a escena 3 (chat IA) — transición, entra el arpegio
    add(18.11, riser(0.35, 0.10))
    add(18.35, stinger(note(0), 0.14))

    # 18,11–23,53 · escena 3 — arpegio digital entra
    bass_groove(18.6, 23.4, -12, density=0.8, amp=0.17, decay=5.0)
    arp_notes = [0, 3, 7, 10, 7, 3]
    t, i = 19.0, 0
    while t < 23.3:
        add(t, arp(note(arp_notes[i % len(arp_notes)] + 12), 0.2, 0.09),
            pan=-0.3 + 0.6 * ((i // 2) % 2))
        t += BEAT * 0.5
        i += 1

    # 23,53 · corte a escena 4 (servidores) — transición
    add(23.53, riser(0.35, 0.10))
    add(23.77, stinger(note(-5), 0.15))

    # 23,53–29,18 · escena 4 — pulso más denso, más energía
    bass_groove(23.9, 29.0, -12, density=0.95, amp=0.19, decay=4.5)
    t, i = 24.3, 0
    while t < 28.9:
        add(t, arp(note(arp_notes[i % len(arp_notes)] + 12), 0.18, 0.08),
            pan=0.3 - 0.6 * ((i // 2) % 2))
        t += BEAT * 0.5
        i += 1
    add(26.5, pad(note(-5), 3.0, 0.04))

    # 29,18 · corte a escena 5 (red) — transición
    add(29.18, riser(0.4, 0.11))
    add(29.45, stinger(note(0), 0.15))

    # 29,18–33,99 · escena 5 — arpegios en capas, más lleno
    bass_groove(29.6, 33.8, -12, density=1.0, amp=0.20, decay=4.2)
    t, i = 29.9, 0
    while t < 33.8:
        add(t, arp(note(arp_notes[i % len(arp_notes)] + 12), 0.16, 0.085))
        add(t + BEAT * 0.25, arp(note(arp_notes[(i + 2) % len(arp_notes)] + 24), 0.14, 0.05))
        t += BEAT * 0.5
        i += 1

    # 33,99 · corte a escena 6 (cierre) — el gran crescendo empieza
    add(33.99, riser(0.5, 0.13))
    add(34.3, stinger(note(0), 0.17))

    # 33,99–43,90 · escena 6 — el acorde se abre, crescendo hacia el cierre
    add(34.5, pad(note(-12), 9.0, 0.06))
    add(34.5, pad(note(0), 9.0, 0.05))
    add(34.5, pad(note(7), 9.0, 0.04))
    bass_groove(34.5, 42.2, -12, density=1.0, amp=0.21, decay=4.0)
    t, i = 34.7, 0
    while t < 42.2:
        add(t, arp(note(arp_notes[i % len(arp_notes)] + 12), 0.16, 0.085))
        t += BEAT * 0.5
        i += 1

    # 42,43–43,90 · último empujón hacia la tarjeta de marca
    add(42.5, riser(0.9, 0.12))
    add(43.3, stinger(note(12), 0.16))

    # 43,90–45,60 · tarjeta de marca — resolución, acorde sostenido
    add(43.95, pad(note(-12), 1.6, 0.05))
    add(43.95, pad(note(0), 1.6, 0.045))
    add(43.95, pad(note(7), 1.6, 0.035))
    add(43.95, pad(note(12), 1.6, 0.03))


# ───────────────── mezcla: ducking de voz, límite y fundidos ─────────────────

VO = [
    (0.30, 4.61), (4.96, 11.36), (11.71, 14.90), (15.20, 17.71),
    (18.11, 23.13), (23.53, 28.78), (29.18, 33.54), (33.99, 42.43)
]
DUCK = 0.38
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
        if t < 0.015:
            d *= t / 0.015
        if t > DUR - 1.0:
            d *= max(0.0, (DUR - t) / 1.0)
        L[i] *= d
        R[i] *= d
        peak = max(peak, abs(L[i]), abs(R[i]))

    k = (0.85 / peak) if peak > 0 else 1.0
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
    out = sys.argv[1] if len(sys.argv) > 1 else 'out/banda-sonora-8.wav'
    render_arrangement()
    mixdown(out)
