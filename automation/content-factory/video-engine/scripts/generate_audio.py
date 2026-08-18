#!/usr/bin/env python3
"""
Audio Engine — generación procedural de música y efectos originales.

Por qué generado y no licencia externa: evita cualquier riesgo de copyright
(regla explícita del encargo) y coste de API (ninguna API de audio de pago
está autorizada). Todo el audio de este directorio es 100% sintetizado por
código, sin muestras de terceros.

Genera:
  public/audio/beds/<familia>.wav   — 7 camas musicales, una por familia
  public/audio/sfx/<nombre>.wav     — efectos cortos para sincronizar con
                                       transiciones/reveals de escena

Ejecutar: python3 scripts/generate_audio.py
"""
import numpy as np
import wave
import os

SR = 44100
OUT_BEDS = "public/audio/beds"
OUT_SFX = "public/audio/sfx"
os.makedirs(OUT_BEDS, exist_ok=True)
os.makedirs(OUT_SFX, exist_ok=True)


def write_wav(path, samples, sr=SR):
    samples = np.clip(samples, -1.0, 1.0)
    pcm = (samples * 32767).astype(np.int16)
    with wave.open(path, "w") as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(sr)
        f.writeframes(pcm.tobytes())


def adsr(n, sr, attack=0.02, decay=0.1, sustain=0.7, release=0.3):
    a, d, r = int(attack * sr), int(decay * sr), int(release * sr)
    s = max(n - a - d - r, 0)
    env = np.concatenate([
        np.linspace(0, 1, a, endpoint=False) if a else np.array([]),
        np.linspace(1, sustain, d, endpoint=False) if d else np.array([]),
        np.full(s, sustain),
        np.linspace(sustain, 0, r) if r else np.array([]),
    ])
    if len(env) < n:
        env = np.pad(env, (0, n - len(env)))
    return env[:n]


def note(freq, dur, sr=SR, wave_="sine", vol=1.0):
    t = np.linspace(0, dur, int(sr * dur), endpoint=False)
    if wave_ == "sine":
        w = np.sin(2 * np.pi * freq * t)
    elif wave_ == "triangle":
        w = 2 * np.abs(2 * (t * freq - np.floor(t * freq + 0.5))) - 1
    elif wave_ == "saw":
        w = 2 * (t * freq - np.floor(0.5 + t * freq))
    else:
        w = np.sin(2 * np.pi * freq * t)
    return w * vol * adsr(len(t), sr, release=dur * 0.4)


def lowpass(signal, cutoff_hz, sr=SR):
    # filtro paso-bajo de un polo, simple y suficiente para "suavizar" texturas
    rc = 1.0 / (2 * np.pi * cutoff_hz)
    dt = 1.0 / sr
    alpha = dt / (rc + dt)
    out = np.zeros_like(signal)
    out[0] = signal[0]
    for i in range(1, len(signal)):
        out[i] = out[i - 1] + alpha * (signal[i] - out[i - 1])
    return out


def pad_chord(freqs, dur, sr=SR, detune=0.003, vol=0.5):
    t = np.linspace(0, dur, int(sr * dur), endpoint=False)
    mix = np.zeros_like(t)
    for f in freqs:
        for d in (-detune, 0, detune):
            mix += np.sin(2 * np.pi * f * (1 + d) * t)
    mix /= (len(freqs) * 3)
    fade = min(dur * 0.15, 3.0)
    env = adsr(len(t), sr, attack=fade, decay=0.05, sustain=0.85, release=fade)
    return mix * env * vol


def noise_texture(dur, sr=SR, cutoff=800, vol=0.15, seed=0):
    rng = np.random.default_rng(seed)
    n = rng.uniform(-1, 1, int(sr * dur))
    n = lowpass(n, cutoff, sr)
    n = n / (np.max(np.abs(n)) + 1e-9)
    return n * vol


def click(sr=SR, t=0.02, freq=1200, vol=0.6):
    n = int(sr * t)
    tt = np.linspace(0, t, n, endpoint=False)
    w = np.sin(2 * np.pi * freq * tt) * np.exp(-tt * 60)
    return w * vol


def kick(sr=SR, t=0.35, vol=0.7):
    n = int(sr * t)
    tt = np.linspace(0, t, n, endpoint=False)
    freq_env = 120 * np.exp(-tt * 18) + 40
    phase = np.cumsum(2 * np.pi * freq_env / sr)
    w = np.sin(phase) * np.exp(-tt * 9)
    return w * vol


def hat(sr=SR, t=0.06, vol=0.18, seed=1):
    rng = np.random.default_rng(seed)
    n = int(sr * t)
    w = rng.uniform(-1, 1, n)
    w = lowpass(w, 9000, sr) - lowpass(w, 4000, sr)
    env = np.exp(-np.linspace(0, t, n) * 40)
    return w * env * vol


NOTE = {
    "C2": 65.41, "C3": 130.81, "D3": 146.83, "Eb3": 155.56, "E3": 164.81,
    "F3": 174.61, "G3": 196.00, "A3": 220.00, "Bb3": 233.08, "B3": 246.94,
    "C4": 261.63, "D4": 293.66, "Eb4": 311.13, "E4": 329.63, "F4": 349.23,
    "G4": 392.00, "A4": 440.00, "Bb4": 466.16, "C5": 523.25,
}


def sequence(events, sr=SR):
    """events: list of (start_sec, generator_fn()) -> mixes into one buffer."""
    total = max(s + len(g) / sr for s, g in events) + 1.0
    buf = np.zeros(int(total * sr))
    for start, gen in events:
        i0 = int(start * sr)
        buf[i0:i0 + len(gen)] += gen
    peak = np.max(np.abs(buf))
    if peak > 0:
        buf = buf / peak * 0.9
    return buf


DUR = 30.0  # duración de cada cama, cubre sobradamente los vídeos actuales (12-24s)


def bed_tech():
    """TECH -> electrónica minimalista: arpegio limpio + kick/hat discretos, brillante."""
    chords = [["C3", "E3", "G3"], ["A3", "C4", "E3"], ["F3", "A3", "C4"], ["G3", "B3", "D4"]]
    events = []
    bar = 4.0
    for i in range(int(DUR / bar) + 1):
        chord = chords[i % len(chords)]
        events.append((i * bar, pad_chord([NOTE[n] for n in chord], bar * 1.1, vol=0.22)))
        for step in range(8):
            t = i * bar + step * (bar / 8)
            if t >= DUR:
                continue
            if step % 2 == 0:
                events.append((t, hat(vol=0.10, seed=step + i)))
            if step % 4 == 0:
                events.append((t, kick(vol=0.35)))
    seq = sequence(events)[: int(DUR * SR)]
    return seq


def bed_cinematic():
    """CINEMATIC -> ambiente profundo: pad grave sostenido + textura de aire."""
    events = [
        (0, pad_chord([NOTE["C2"], NOTE["G3"], NOTE["Eb3"]], DUR, vol=0.5)),
        (0, noise_texture(DUR, cutoff=600, vol=0.06, seed=2)),
        (DUR * 0.5, pad_chord([NOTE["F3"], NOTE["Bb3"], NOTE["D4"]], DUR * 0.5, vol=0.35)),
    ]
    return sequence(events)[: int(DUR * SR)]


def bed_educational():
    """EDUCATIONAL -> ritmo limpio y ligero: pad claro + pulso suave, sin percusión dura."""
    chords = [["C4", "E4", "G4"], ["A3", "C4", "E4"], ["F3", "A3", "C4"], ["G3", "B3", "D4"]]
    events = []
    bar = 5.0
    for i in range(int(DUR / bar) + 1):
        chord = chords[i % len(chords)]
        events.append((i * bar, pad_chord([NOTE[n] for n in chord], bar * 1.05, vol=0.28)))
        for step in range(4):
            t = i * bar + step * (bar / 4)
            if t < DUR:
                events.append((t, hat(vol=0.06, seed=step)))
    return sequence(events)[: int(DUR * SR)]


def bed_problem():
    """PROBLEM -> tensión sutil: intervalo disonante sostenido, sin percusión."""
    events = [
        (0, pad_chord([NOTE["C3"], NOTE["F3"], NOTE["Bb3"]], DUR, vol=0.4)),
        (0, noise_texture(DUR, cutoff=300, vol=0.08, seed=3)),
        (DUR * 0.4, pad_chord([NOTE["D3"], NOTE["Eb3"]], DUR * 0.4, vol=0.25)),
    ]
    return sequence(events)[: int(DUR * SR)]


def bed_storytelling():
    """STORYTELLING -> evolución progresiva: acordes que se abren y suben de registro."""
    stages = [
        ["C3", "Eb3", "G3"],
        ["C3", "Eb3", "G3", "Bb3"],
        ["F3", "A3", "C4", "Eb4"],
        ["G3", "B3", "D4", "F4"],
    ]
    events = []
    stage_dur = DUR / len(stages)
    for i, chord in enumerate(stages):
        vol = 0.22 + i * 0.05
        events.append((i * stage_dur, pad_chord([NOTE[n] for n in chord], stage_dur * 1.15, vol=vol)))
    return sequence(events)[: int(DUR * SR)]


def bed_opinion():
    """OPINION -> sonido contenido: pad simple, casi sin movimiento, deja espacio a la voz/texto.
    Nota: pese a ser "contenido" en textura (una sola nota sostenida, sin percusión),
    su volumen se normaliza igual que el resto de camas — "contenido" es una decisión
    de arreglo musical, no una pista casi inaudible."""
    events = [(0, pad_chord([NOTE["A3"], NOTE["C4"], NOTE["E4"]], DUR, vol=0.6))]
    return sequence(events)[: int(DUR * SR)]


def bed_experimental():
    """EXPERIMENTAL -> diseño sonoro distinto: capas de ruido filtrado + glitches rítmicos."""
    events = [(0, noise_texture(DUR, cutoff=1500, vol=0.12, seed=7))]
    rng = np.random.default_rng(9)
    t = 0.0
    while t < DUR:
        events.append((t, click(freq=rng.uniform(400, 2000), vol=0.25)))
        t += rng.uniform(0.4, 1.6)
    events.append((0, pad_chord([NOTE["Eb3"], NOTE["A3"]], DUR, vol=0.15)))
    return sequence(events)[: int(DUR * SR)]


FAMILIES = {
    "tech": bed_tech,
    "cinematic": bed_cinematic,
    "educational": bed_educational,
    "problem": bed_problem,
    "storytelling": bed_storytelling,
    "opinion": bed_opinion,
    "experimental": bed_experimental,
}

for name, fn in FAMILIES.items():
    write_wav(f"{OUT_BEDS}/{name}.wav", fn())
    print("bed:", name)


def sfx_whoosh():
    dur = 0.5
    n = int(SR * dur)
    rng = np.random.default_rng(11)
    w = rng.uniform(-1, 1, n)
    # barrido de filtro: de oscuro a brillante
    out = np.zeros(n)
    chunk = 512
    for i in range(0, n, chunk):
        cutoff = 300 + 6000 * (i / n)
        seg = w[i:i + chunk]
        out[i:i + len(seg)] = lowpass(seg, cutoff, SR)
    env = adsr(n, SR, attack=0.05, decay=0.1, sustain=0.4, release=0.3)
    return out * env * 0.5


def sfx_impact():
    n = int(SR * 0.4)
    k = kick(t=0.4, vol=0.8)
    h = hat(t=0.05, vol=0.3)
    k = np.pad(k, (0, max(0, n - len(k))))[:n]
    h = np.pad(h, (0, max(0, n - len(h))))[:n]
    return k + h


def sfx_blip():
    return click(t=0.05, freq=1800, vol=0.5)


def sfx_riser():
    dur = 1.2
    n = int(SR * dur)
    t = np.linspace(0, dur, n, endpoint=False)
    freq = 200 + 1600 * (t / dur) ** 2
    phase = np.cumsum(2 * np.pi * freq / SR)
    w = np.sin(phase)
    env = np.linspace(0.05, 0.6, n) ** 1.5
    return w * env


def sfx_soft_close():
    dur = 1.0
    n = int(SR * dur)
    t = np.linspace(0, dur, n, endpoint=False)
    w = np.sin(2 * np.pi * 220 * t)
    env = np.exp(-t * 3)
    return w * env * 0.3


SFX = {
    "whoosh": sfx_whoosh,
    "impact": sfx_impact,
    "blip": sfx_blip,
    "riser": sfx_riser,
    "soft-close": sfx_soft_close,
}

for name, fn in SFX.items():
    write_wav(f"{OUT_SFX}/{name}.wav", fn())
    print("sfx:", name)

print("\nAudio Engine: generación completa.")
