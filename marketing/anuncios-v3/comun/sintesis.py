# Biblioteca de síntesis para las dos bandas sonoras. Todo se genera aquí: no hay ni un sample de terceros,
# así que no hay licencias que revisar.
#
# Estéreo a 48 kHz, en coma flotante. Los instrumentos devuelven arrays (n,) mono o (n, 2) estéreo; `Pista`
# los coloca en el tiempo con ganancia y panorama.
import math
import numpy as np
from scipy.signal import lfilter, fftconvolve, butter, sosfilt

SR = 48000
RNG = np.random.default_rng(20260927)

def n_(s): return int(round(s * SR))
def t_(n): return np.arange(n) / SR
def db(x): return 10 ** (x / 20)

# ───────────────────────────────── filtros (fórmulas RBJ) ─────────────────────────────────
def _biquad(x, b, a): return lfilter(b, a, x, axis=0)

def lp(x, fc, q=0.707):
    w = 2 * math.pi * min(fc, SR * 0.45) / SR; al = math.sin(w) / (2 * q); c = math.cos(w)
    b = [(1 - c) / 2, 1 - c, (1 - c) / 2]; a = [1 + al, -2 * c, 1 - al]
    return _biquad(x, np.array(b) / a[0], np.array(a) / a[0])

def hp(x, fc, q=0.707):
    w = 2 * math.pi * min(fc, SR * 0.45) / SR; al = math.sin(w) / (2 * q); c = math.cos(w)
    b = [(1 + c) / 2, -(1 + c), (1 + c) / 2]; a = [1 + al, -2 * c, 1 - al]
    return _biquad(x, np.array(b) / a[0], np.array(a) / a[0])

def bp(x, fc, q=1.0):
    w = 2 * math.pi * min(fc, SR * 0.45) / SR; al = math.sin(w) / (2 * q); c = math.cos(w)
    b = [al, 0, -al]; a = [1 + al, -2 * c, 1 - al]
    return _biquad(x, np.array(b) / a[0], np.array(a) / a[0])

def peak(x, fc, gain_db, q=1.0):
    A = 10 ** (gain_db / 40); w = 2 * math.pi * fc / SR; al = math.sin(w) / (2 * q); c = math.cos(w)
    b = [1 + al * A, -2 * c, 1 - al * A]; a = [1 + al / A, -2 * c, 1 - al / A]
    return _biquad(x, np.array(b) / a[0], np.array(a) / a[0])

def shelf(x, fc, gain_db, alto=True):
    A = 10 ** (gain_db / 40); w = 2 * math.pi * fc / SR; c = math.cos(w); s = math.sin(w)
    al = s / 2 * math.sqrt(2); sq = 2 * math.sqrt(A) * al
    if alto:
        b = [A * ((A + 1) + (A - 1) * c + sq), -2 * A * ((A - 1) + (A + 1) * c), A * ((A + 1) + (A - 1) * c - sq)]
        a = [(A + 1) - (A - 1) * c + sq, 2 * ((A - 1) - (A + 1) * c), (A + 1) - (A - 1) * c - sq]
    else:
        b = [A * ((A + 1) - (A - 1) * c + sq), 2 * A * ((A - 1) - (A + 1) * c), A * ((A + 1) - (A - 1) * c - sq)]
        a = [(A + 1) + (A - 1) * c + sq, -2 * ((A - 1) + (A + 1) * c), (A + 1) + (A - 1) * c - sq]
    return _biquad(x, np.array(b) / a[0], np.array(a) / a[0])

def barrido(x, f0, f1, tipo="bp", q=2.0, bloques=64):
    """Filtro que se desplaza de f0 a f1 (exponencial). Por bloques con solape: suficiente para subidas y whooshes."""
    n = len(x); out = np.zeros_like(x); L = max(256, n // bloques); win = np.hanning(2 * L)
    for i in range(0, n, L):
        a = max(0, i - L // 2); b = min(n, i + L + L // 2); seg = x[a:b]
        k = (i + L / 2) / n; fc = f0 * (f1 / f0) ** k
        y = {"bp": bp, "lp": lp, "hp": hp}[tipo](seg, fc, q)
        w = np.hanning(len(seg)); out[a:b] += (y.T * w).T if y.ndim > 1 else y * w
    return out / 1.0

# ───────────────────────────────── osciladores sin aliasing (polyBLEP) ─────────────────────────────────
def _blep(t, dt):
    y = np.zeros_like(t); dt = np.broadcast_to(dt, t.shape)
    m = t < dt; x = t[m] / dt[m]; y[m] = x + x - x * x - 1
    m = t > 1 - dt; x = (t[m] - 1) / dt[m]; y[m] = x * x + x + x + 1
    return y

def saw(freq, dur, fase=0.0):
    n = n_(dur); f = np.broadcast_to(np.asarray(freq, float), (n,)) if np.ndim(freq) else np.full(n, float(freq))
    dt = f / SR; ph = (fase + np.cumsum(dt)) % 1.0
    return (2 * ph - 1) - _blep(ph, dt)

def square(freq, dur, pw=0.5):
    n = n_(dur); f = np.full(n, float(freq)) if not np.ndim(freq) else np.asarray(freq, float)
    dt = f / SR; ph = np.cumsum(dt) % 1.0; ph2 = (ph + (1 - pw)) % 1.0
    return (np.where(ph < pw, 1.0, -1.0) + _blep(ph, dt) - _blep(ph2, dt))

def sine(freq, dur, fase=0.0):
    n = n_(dur); f = np.full(n, float(freq)) if not np.ndim(freq) else np.asarray(freq, float)
    return np.sin(2 * math.pi * np.cumsum(f) / SR + fase)

def ruido(dur): return RNG.standard_normal(n_(dur))

def env_ad(dur, a=0.005, d=None, curva=4.0):
    n = n_(dur); e = np.ones(n); na = max(1, n_(a))
    e[:na] = np.linspace(0, 1, na)
    rest = n - na
    if rest > 0: e[na:] = np.exp(-curva * np.linspace(0, 1, rest)) if d is None else np.exp(-np.arange(rest) / (d * SR))
    return e

def env_adsr(dur, a, d, s, r):
    n = n_(dur); e = np.zeros(n); na, nd, nr = n_(a), n_(d), n_(r); ns = max(0, n - na - nd - nr)
    seg = [np.linspace(0, 1, na, endpoint=False), np.linspace(1, s, nd, endpoint=False), np.full(ns, s), np.linspace(s, 0, nr)]
    v = np.concatenate(seg)[:n]; e[:len(v)] = v
    return e

def sat(x, drive=1.0): return np.tanh(x * drive) / np.tanh(drive)

# ───────────────────────────────── espacio ─────────────────────────────────
def ir_sala(dur=1.6, brillo=6000, predelay=0.012, seed=3):
    r = np.random.default_rng(seed); n = n_(dur)
    t = t_(n); dec = np.exp(-6.9 * t / dur)
    L = r.standard_normal(n) * dec; R = r.standard_normal(n) * dec
    L = lp(L, brillo); R = lp(R, brillo * 0.95)
    pd = np.zeros(n_(predelay)); ir = np.stack([np.concatenate([pd, L]), np.concatenate([pd, R])], 1)
    return ir / np.sqrt((ir ** 2).sum())

def reverb(x, ir, mezcla=0.2):
    if x.ndim == 1: x = np.stack([x, x], 1)
    w = np.stack([fftconvolve(x[:, 0], ir[:, 0])[:len(x)], fftconvolve(x[:, 1], ir[:, 1])[:len(x)]], 1)
    return x * (1 - mezcla) + w * mezcla * 3.0

def estereo(x, pan=0.0, ancho=0.0):
    """pan −1..1 (ley de potencia constante); ancho: retardo corto en un canal para abrir."""
    if x.ndim == 2: return x
    a = (pan + 1) * math.pi / 4; L = x * math.cos(a); R = x * math.sin(a)
    if ancho > 0:
        d = n_(ancho); R = np.concatenate([np.zeros(d), R[:-d]]) if d else R
    return np.stack([L, R], 1) * math.sqrt(2)

# ───────────────────────────────── batería ─────────────────────────────────
def bombo(dur=0.42, f0=155, f1=46, golpe=0.9, cuerpo=1.0, drive=1.6):
    t = t_(n_(dur)); f = f1 + (f0 - f1) * np.exp(-t * 32)
    y = np.sin(2 * math.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5) * cuerpo
    click = hp(ruido(0.006), 2500) * np.linspace(1, 0, n_(0.006)) * 0.45 * golpe
    y[:len(click)] += click
    return sat(y, drive)

def caja(dur=0.26, tono=190):
    t = t_(n_(dur))
    body = np.sin(2 * math.pi * tono * t) * np.exp(-t * 28) * 0.6
    n = bp(ruido(dur), 3200, 0.5) * np.exp(-t * 16)
    return sat(body + n * 0.9, 1.4)

def palmada(dur=0.34):
    y = np.zeros(n_(dur)); t = t_(len(y))
    for i, off in enumerate((0.0, 0.011, 0.022, 0.034)):
        k = n_(off); m = len(y) - k
        dec = 70 if i < 3 else 13
        y[k:] += bp(ruido(m / SR), 1600, 0.8) * np.exp(-np.arange(m) / SR * dec) * (0.8 if i < 3 else 1.0)
    return y * 0.9

def hat(abierto=False, brillo=8500):
    dur = 0.32 if abierto else 0.05
    t = t_(n_(dur)); y = hp(ruido(dur), brillo, 0.9) * np.exp(-t * (9 if abierto else 85))
    return y * 0.55

def ochocientos(f, dur=0.8, glide_a=None, glide_t=0.12, drive=2.2):
    t = t_(n_(dur))
    fr = np.full(len(t), f, float)
    if glide_a: fr = f + (glide_a - f) * np.clip(t / glide_t, 0, 1) ** 0.6
    y = np.sin(2 * math.pi * np.cumsum(fr) / SR)
    e = env_adsr(dur, 0.004, 0.08, 0.75, min(0.12, dur * 0.3))
    y = sat(y * e * 1.1, drive)
    y[:n_(0.004)] += hp(ruido(0.004), 3000) * 0.3
    return lp(y, 3500)

# ───────────────────────────────── sintes ─────────────────────────────────
def voz_saw(f, dur, det=0.12, voces=5):
    y = np.zeros(n_(dur))
    for i in range(voces):
        c = (i - (voces - 1) / 2) / max(1, (voces - 1) / 2) * det
        y += saw(f * 2 ** (c / 12), dur, fase=RNG.random())
    return y / voces

def acorde(freqs, dur, fc=2200, a=0.02, r=0.35, brillo_env=True):
    y = sum(voz_saw(f, dur) for f in freqs) / len(freqs)
    if brillo_env:
        y = barrido(y, fc * 0.45, fc, "lp", 0.8, 24)
    else:
        y = lp(y, fc)
    return y * env_adsr(dur, a, 0.15, 0.7, r)

def pluck(f, dur=0.35, fc=4200):
    t = t_(n_(dur)); y = saw(f, dur) * 0.6 + square(f * 2, dur) * 0.15
    y = barrido(y, fc, 350, "lp", 1.2, 12)
    return y * np.exp(-t * 9)

def campana(f, dur=1.4):
    t = t_(n_(dur)); y = np.zeros_like(t)
    for r, g, d in ((1, 1, 3), (2.76, .5, 5), (5.4, .28, 8), (8.93, .15, 12)):
        y += np.sin(2 * math.pi * f * r * t) * g * np.exp(-t * d)
    return y * 0.4

# ───────────────────────────────── efectos ─────────────────────────────────
def subida(dur=1.6, f0=300, f1=9000, tono=True):
    t = t_(n_(dur)); y = barrido(ruido(dur), f0, f1, "bp", 1.6, 48) * (t / dur) ** 2.2
    if tono:
        fr = 180 * (6 ** (t / dur)); y += np.sin(2 * math.pi * np.cumsum(fr) / SR) * (t / dur) ** 3 * 0.25
    return y

def whoosh(dur=0.55, f0=500, f1=4500, pan0=-0.8, pan1=0.8):
    t = t_(n_(dur)); y = barrido(ruido(dur), f0, f1, "bp", 1.3, 24) * np.sin(math.pi * t / dur) ** 1.5
    p = pan0 + (pan1 - pan0) * t / dur; a = (p + 1) * math.pi / 4
    return np.stack([y * np.cos(a), y * np.sin(a)], 1) * 1.3

def impacto(dur=2.2, peso=1.0):
    t = t_(n_(dur)); f = 30 + 55 * np.exp(-t * 6)
    sub = np.sin(2 * math.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2) * peso
    crack = lp(ruido(dur), 1800) * np.exp(-t * 20) * 0.7
    return sat(sub + crack, 1.8)

def caida_sub(dur=1.2, f0=90, f1=26):
    t = t_(n_(dur)); f = f1 + (f0 - f1) * np.exp(-t * 3)
    return np.sin(2 * math.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6)

def tape_stop(x, dur=0.45):
    """La cinta se frena: velocidad de 1 a 0, el tono cae con ella."""
    n = n_(dur); v = np.linspace(1, 0, n) ** 1.3; pos = np.cumsum(v)
    pos = pos[pos < len(x) - 1]
    if x.ndim == 1: return np.interp(pos, np.arange(len(x)), x) * np.linspace(1, 0.2, len(pos))
    return np.stack([np.interp(pos, np.arange(len(x)), x[:, c]) for c in range(2)], 1) * np.linspace(1, 0.2, len(pos))[:, None]

def tartamudeo(x, trozo=0.045, veces=6):
    k = n_(trozo); s = x[:k]
    return np.concatenate([s * (0.9 ** i) for i in range(veces)])

# sonidos de oficina, sintetizados (genéricos: ningún sonido de marca)
def tecla():
    y = bp(ruido(0.03), 2600, 3) * np.exp(-t_(n_(0.03)) * 180)
    y[:n_(0.002)] += 0.6
    return y * 0.7

def clic():
    y = hp(ruido(0.012), 1800) * np.exp(-t_(n_(0.012)) * 400)
    return y * 0.9

def aviso(f=1046.5):
    d = 0.42; t = t_(n_(d))
    y = np.sin(2 * math.pi * f * t) * np.exp(-t * 9) * (t < 0.1)
    t2 = t - 0.09; y += np.where(t2 > 0, np.sin(2 * math.pi * f * 1.5 * t2) * np.exp(-np.clip(t2, 0, None) * 8), 0)
    return y * 0.45

def vibracion(dur=0.5):
    t = t_(n_(dur)); y = sat(np.sin(2 * math.pi * 145 * t) * (0.5 + 0.5 * np.sign(np.sin(2 * math.pi * 11 * t))), 3)
    return lp(y, 900) * 0.5

def obturador():
    y = np.zeros(n_(0.12))
    for off in (0, 0.055):
        k = n_(off); b = hp(ruido(0.03), 1200) * np.exp(-t_(n_(0.03)) * 120); y[k:k + len(b)] += b
    return y * 0.8

def sello():
    thud = impacto(0.5, 0.9)[:n_(0.5)] * 0.9
    papel = lp(ruido(0.18), 2400) * np.exp(-t_(n_(0.18)) * 30) * 0.8
    thud[:len(papel)] += papel
    return thud

def tajo():
    d = 0.9; t = t_(n_(d))
    y = np.zeros_like(t)
    for r, g in ((1, 1), (1.47, .6), (2.13, .45), (3.9, .25)):
        y += np.sin(2 * math.pi * 2350 * r * t) * g
    y *= np.exp(-t * 5) * 0.18
    sw = barrido(ruido(0.22), 6000, 900, "bp", 1.4, 16) * np.hanning(n_(0.22)) * 1.1
    y[:len(sw)] += sw
    return y

def caja_registradora():
    c = campana(1568, 1.1) + campana(2093, 1.1) * 0.7
    mec = np.zeros_like(c); k = hp(ruido(0.02), 2000) * np.exp(-t_(n_(0.02)) * 200)
    for off in (0, 0.04, 0.075):
        s = n_(off); mec[s:s + len(k)] += k
    return c + mec * 0.9

# ───────────────────────────────── pista y mezcla ─────────────────────────────────
class Pista:
    def __init__(self, dur): self.x = np.zeros((n_(dur), 2))

    def pon(self, sig, t, g=1.0, pan=0.0, ancho=0.0):
        s = estereo(np.asarray(sig, float), pan, ancho) if np.ndim(sig) == 1 else np.asarray(sig, float)
        a = n_(t)
        if a >= len(self.x) or a + len(s) <= 0: return
        if a < 0: s = s[-a:]; a = 0
        b = min(len(self.x), a + len(s)); self.x[a:b] += s[:b - a] * g

    def corta(self, t0, t1, fundido=0.004):
        a, b = n_(t0), n_(t1); f = n_(fundido)
        self.x[a:b] = 0
        if a - f > 0: self.x[a - f:a] *= np.linspace(1, 0, f)[:, None]

def envolvente(x, ataque=0.012, suelta=0.22):
    """Envolvente de la voz (para la compresión lateral de la música)."""
    m = np.abs(x).max(1) if x.ndim == 2 else np.abs(x)
    a = math.exp(-1 / (ataque * SR)); r = math.exp(-1 / (suelta * SR))
    # seguidor de pico con ataque y suelta distintos, vectorizado por tramos
    e = np.zeros_like(m); v = 0.0
    paso = 64
    for i in range(0, len(m), paso):
        p = m[i:i + paso].max(); c = a if p > v else r
        v = c * v + (1 - c) * p; e[i:i + paso] = v
    return e / (e.max() + 1e-9)

def compresor(x, umbral_db=-18, ratio=3.0, ataque=0.006, suelta=0.12, ganancia_db=0.0):
    m = np.abs(x).max(1) if x.ndim == 2 else np.abs(x)
    a = math.exp(-1 / (ataque * SR)); r = math.exp(-1 / (suelta * SR))
    g = np.ones_like(m); v = 1e-6; paso = 32; u = db(umbral_db)
    for i in range(0, len(m), paso):
        p = m[i:i + paso].max(); c = a if p > v else r; v = c * v + (1 - c) * p
        if v > u: g[i:i + paso] = (u * (v / u) ** (1 / ratio)) / v
    g = lp(g, 40)
    return (x * g[:, None] if x.ndim == 2 else x * g) * db(ganancia_db)

def pico(x, v=1.0):
    """Normaliza a un pico dado (los instrumentos salen a niveles distintos; así las ganancias son legibles)."""
    m = np.abs(x).max()
    return x * (v / m) if m > 0 else x

def cadena_voz(x, hpf=90, presencia=(4000, 3.0), aire=2.0, ratio=3.0, umbral=-20, sala=0.05, calor=0.0, satura=0.0):
    """Voz: limpieza de graves, recorte de barro, presencia, aire, compresión y una sala muy corta."""
    y = hp(x, hpf); y = peak(y, 280, -2.5, 1.0)
    if calor: y = peak(y, 160, calor, 0.8)
    y = peak(y, presencia[0], presencia[1], 0.9); y = shelf(y, 10000, aire, True)
    y = compresor(y, umbral, ratio, 0.004, 0.09)
    if satura: y = sat(y * (1 + satura), 1 + satura)
    y = pico(y, 0.9)
    return reverb(y, ir_sala(0.45, 7000, 0.006, 9), sala) if sala else estereo(y)

def escribe(ruta, x):
    import soundfile as sf
    sf.write(ruta, np.clip(x, -1, 1).astype(np.float32), SR, subtype="FLOAT")

def master(x, techo=0.93):
    """Suma final: pasa-altos de seguridad y un saturador suave como limitador. La sonoridad final (−14 LUFS)
    se fija después con loudnorm de dos pasadas al multiplexar."""
    y = hp(x, 28)
    y = pico(y, 1.0) * 1.25
    return np.tanh(y) * techo
