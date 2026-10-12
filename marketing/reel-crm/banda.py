# Música y diseño de sonido del reel CRM (todo sintetizado aquí, sin samples de terceros ni voz).
# Música: house mínimo y cálido a 120 BPM en Re mayor. Efectos: cada gesto de la interfaz suena (teclas, clics, «pops»,
# arrastrar y soltar, oportunidad ganada, aviso), sincronizados con tiempos.json.
import os, sys, math, json
import numpy as np
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, "..", "anuncios-v3", "comun"))
from sintesis import *
T = json.load(open(os.path.join(AQUI, "tiempos.json")))
LIMPIO = "--limpio" in sys.argv
DUR = T["cta"] if LIMPIO else T["fin"]
mus, pad, fx = Pista(DUR), Pista(DUR), Pista(DUR)
ir = ir_sala(0.9, 7000, 0.01, 5); irg = ir_sala(2.8, 6000, 0.02, 13)
rng = np.random.default_rng(11)
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def blip(f0, f1, d=0.12, brillo=0.0):          # «pop» de interfaz: seno con caída de tono
    t = t_(n_(d)); f = f1 + (f0 - f1) * np.exp(-t * 40); y = np.sin(2 * math.pi * np.cumsum(f) / SR) * np.exp(-t * 30)
    return y + brillo * hp(ruido(d), 6000) * np.exp(-t * 120)
def tono(f0, f1, d, g_env=1.6):
    t = t_(n_(d)); f = f0 * (f1 / f0) ** (t / d); y = np.sin(2 * math.pi * np.cumsum(f) / SR) + 0.3 * np.sin(4 * math.pi * np.cumsum(f) / SR)
    return y * (t / d) ** g_env * np.minimum(1, (d - t) / 0.06)
def chispas(d=0.6):
    t = t_(n_(d)); y = np.zeros_like(t)
    for k in range(14):
        a = n_(rng.uniform(0, d * 0.6)); f = rng.uniform(4000, 9000); s = np.sin(2 * math.pi * f * t_(n_(0.05))) * np.exp(-t_(n_(0.05)) * 70)
        y[a:a + len(s)] += s[:len(y) - a] * rng.uniform(0.3, 1)
    return y * 0.5
def golpe(t, peso=1.0, g=0.4): fx.pon(pico(impacto(1.6 * peso, peso), 1.0), t, g); fx.pon(pico(caida_sub(1.0 * peso, 80, 32), 1.0), t, g * 0.5)

# ── armonía ──
ACORDES = [[50, 57, 61, 64, 69], [47, 54, 57, 61, 66], [43, 54, 57, 59, 62], [45, 52, 57, 59, 64]]
RAICES = [38, 35, 31, 33]
def capa_pad(notas, t0, t1, g=0.11, fc=1900):
    d = t1 - t0; y = acorde([hz(m) for m in notas], d, fc=fc, a=min(0.4, d / 3), r=min(0.6, d / 2)); pad.pon(reverb(pico(y, 0.5), irg, 0.45), t0, g, 0, 0.9)
def compas(tb, k, fuerza=1.0, hasta=None):
    """Un compás de groove (2 s) desde tb con el acorde k."""
    hasta = hasta or tb + 2.0
    ac, raiz = ACORDES[k % 4], RAICES[k % 4]
    capa_pad(ac, tb, min(tb + 2.0, hasta) + 0.15)
    for q in range(16):                                  # semicorcheas
        tq = tb + q * 0.125
        if tq >= hasta - 0.02: break
        if q % 4 == 0: mus.pon(pico(bombo(0.34, 130, 46, 0.8, 1.0, 1.3), 1.0), tq, 0.33 * fuerza)
        if q % 4 == 2: mus.pon(pico(hat(False, 9500), 0.5), tq, 0.05 * fuerza, 0.25); mus.pon(pico(lp(saw(hz(raiz), 0.22) * env_ad(0.22, 0.006, None, 4), 380), 0.9), tq, 0.2 * fuerza)
        if q % 8 == 4: mus.pon(reverb(pico(palmada(), 0.6), ir, 0.3), tq, 0.06 * fuerza)
        mus.pon(pico(hp(ruido(0.04), 7000) * np.exp(-t_(n_(0.04)) * 90), 0.5), tq, 0.012 * fuerza * (1.4 if q % 2 else 0.8), 0.4 * (-1) ** q)
        if q % 2 == 0:
            nota = ac[[1, 2, 3, 4, 3, 2, 4, 2][(q // 2) % 8]] + 12
            mus.pon(reverb(pico(pluck(hz(nota), 0.3, 2800), 1.0), ir, 0.3), tq + 0.004, 0.045 * fuerza, 0.45 * (-1) ** (q // 2))
    # compresión lateral del pad con el bombo
    a, b = n_(tb), min(len(pad.x), n_(hasta))
    tt = (np.arange(a, b) / SR - tb) % 0.5; pad.x[a:b] *= (1 - 0.55 * np.exp(-tt * 9))[:, None]

# ── 0 · gancho: pad, ensamblaje y tecleo ──
capa_pad(ACORDES[0], 0.0, T["dash"] + 0.1, 0.10, 1300)
fx.pon(pico(subida(T["dash"] - 0.2, 250, 7000), 0.7), 0.2, 0.08)
fx.pon(whoosh(1.4, 300, 3800, 0.6, -0.4), 0.15, 0.13)
fx.pon(pico(blip(1400, 700, 0.14, 0.3), 1.0), T["pill"], 0.16)
a, b = T["tecleo"]; frase = 30
for k in range(frase):
    fx.pon(pico(tecla(), 1.0), a + (b - a) * k / frase + rng.uniform(-0.006, 0.006), 0.07 + 0.03 * rng.random(), rng.uniform(-0.3, 0.3))
for k in range(7): fx.pon(reverb(pico(blip(500 + 90 * k, 220, 0.16), 1.0), ir, 0.3), 0.55 + 0.17 * k, 0.05, -0.6 + 0.2 * k)
golpe(T["ensambla"][1] - 0.1, 0.5, 0.22)
c0, c1 = T["cuenta"]
for k in range(16): fx.pon(pico(clic(), 1.0), c0 + (c1 - c0) * (k / 16) ** 1.5, 0.05, 0.2)

# ── groove principal ──
k = 0; tb = T["dash"]
while tb < T["todo"][0] - 0.01:
    compas(tb, k, 1.0, min(tb + 2.0, T["todo"][0])); tb += 2.0; k += 1

# panel principal: línea que se dibuja, punto, botón 3D
fx.pon(pico(tono(380, 900, T["linea"][1] - T["linea"][0]), 1.0), T["linea"][0], 0.035)
fx.pon(pico(blip(1800, 900, 0.14, 0.4), 1.0), T["tip"], 0.15, 0.3)
fx.pon(pico(clic(), 1.0), T["clic3d"], 0.2); fx.pon(pico(blip(900, 500, 0.12), 1.0), T["clic3d"], 0.12)
for i, pan in enumerate(("pan1", "pan2", "pan3", "pan4")):
    p0, p1 = T[pan]; fx.pon(whoosh(p1 - p0 + 0.2, 400, 5200, 0.8, -0.8), p0 - 0.05, 0.2)
# barras 3D que crecen
PENTA = [62, 64, 66, 69, 71, 74, 76, 78]
for m in range(8): fx.pon(reverb(pico(blip(hz(PENTA[m] + 12), hz(PENTA[m]), 0.18), 1.0), ir, 0.25), T["barras"][0] + 0.1 + m * 0.13, 0.08, -0.7 + 0.2 * m)
fx.pon(pico(blip(1600, 1100, 0.12, 0.3), 1.0), T["etiqueta"], 0.12)
fx.pon(pico(clic(), 1.0), 7.95, 0.12); fx.pon(whoosh(0.9, 600, 2600, -0.6, 0.6), 7.95, 0.08)
# oportunidades: coger, arrastrar, soltar y ganar
fx.pon(pico(clic(), 1.0), T["coge"], 0.18); fx.pon(pico(blip(500, 900, 0.1), 1.0), T["coge"], 0.08)
fx.pon(whoosh(T["arrastra"][1] - T["arrastra"][0], 500, 2200, -0.5, 0.5), T["arrastra"][0], 0.1)
fx.pon(pico(bombo(0.25, 200, 80, 0.5, 0.8, 1.2), 1.0), T["suelta"], 0.22); fx.pon(pico(clic(), 1.0), T["suelta"], 0.15)
for i, m in enumerate((74, 78, 81, 86)): fx.pon(reverb(pico(campana(hz(m + 12), 1.2), 1.0), irg, 0.4), T["gana"] + 0.06 * i, 0.12, -0.3 + 0.2 * i)
fx.pon(reverb(pico(chispas(0.7), 1.0), ir, 0.3), T["gana"], 0.12, 0, 0.8)
for k in range(10): fx.pon(pico(clic(), 1.0), T["gana"] + 0.06 * k, 0.03, 0.4)
fx.pon(pico(clic(), 1.0), T["abre"], 0.18)
# cliente: anillo que se llena y actividad
d = T["dona"][1] - T["dona"][0]; fx.pon(pico(tono(300, 1200, d, 1.2), 1.0), T["dona"][0], 0.04)
fx.pon(reverb(pico(campana(hz(93), 1.0), 1.0), irg, 0.4), T["dona"][1] - 0.05, 0.07)
for i, ti in enumerate(T["items"]): fx.pon(pico(blip(900 + 120 * i, 450, 0.12), 1.0), ti, 0.09, 0.2)
fx.pon(pico(clic(), 1.0), T["clicArranque"], 0.2); fx.pon(pico(blip(700, 1200, 0.12), 1.0), T["clicArranque"] + 0.02, 0.1)
# agenda: eventos, el nuevo cae, arrastre y aviso
for i, te in enumerate(T["eventos"]): fx.pon(pico(blip(1000 + 140 * i, 520, 0.12), 1.0), te, 0.08, -0.5 + 0.25 * i)
fx.pon(pico(bombo(0.3, 180, 60, 0.5, 0.9, 1.2), 1.0), T["nuevo"] + 0.25, 0.25)
fx.pon(reverb(pico(campana(hz(86), 1.0), 1.0), irg, 0.4), T["nuevo"] + 0.27, 0.08)
fx.pon(pico(clic(), 1.0), T["coge2"], 0.18); fx.pon(whoosh(0.5, 600, 2400, -0.3, 0.5), T["arrastra2"][0], 0.08)
fx.pon(pico(bombo(0.22, 200, 80, 0.5, 0.8, 1.2), 1.0), T["suelta2"], 0.18); fx.pon(pico(clic(), 1.0), T["suelta2"], 0.12)
fx.pon(reverb(pico(aviso(1318.5), 1.0), ir, 0.3), T["aviso"], 0.2)

# ── vista de conjunto: el groove se abre, sube y aterriza en D-Code ──
ta, tb2 = T["todo"]
for P in (mus,): P.corta(ta, ta + 0.01, 0.03)
fx.pon(whoosh(1.6, 4500, 250, 0, 0), ta - 0.05, 0.2); fx.pon(pico(caida_sub(1.4, 80, 28), 1.0), ta, 0.25)
capa_pad(ACORDES[2] + [66], ta, T["logo"] + 0.05, 0.13, 2600)
for q in range(8): mus.pon(reverb(pico(pluck(hz([74, 78, 81, 83, 86, 83, 81, 78][q]), 0.4, 3000), 1.0), irg, 0.45), ta + 0.25 + q * 0.25, 0.04, 0.5 * (-1) ** q)
mus.pon(pico(subida(1.4, 300, 11000), 0.7), T["logo"] - 1.4, 0.12)
for k in range(8): mus.pon(pico(caja(0.15, 220), 0.6), T["logo"] - 1.0 + k * 0.125 * (1 - k * 0.04), 0.012 + 0.008 * k)
pad.corta(T["logo"], T["logo"] + 0.01, 0.02)
golpe(T["logo"], 1.0, 0.45)
capa_pad([38, 50, 57, 61, 64, 69, 73], T["logo"], T["cta"] + 0.2, 0.14, 3200)
fx.pon(reverb(pico(campana(hz(81), 1.8), 1.0), irg, 0.5), T["logo"] + 0.02, 0.1)
fx.pon(whoosh(0.8, 800, 6000, -0.4, 0.4), T["logo"], 0.12)
fx.pon(pico(blip(1200, 800, 0.12), 1.0), T["nombre"], 0.06); fx.pon(pico(blip(1400, 900, 0.12), 1.0), T["lema"], 0.05)

# ── CTA ──
if not LIMPIO:
    tb = T["cta"]; k = 0
    while tb < T["fin"] - 0.8:
        compas(tb, k, 0.75, min(tb + 2.0, T["fin"] - 0.6)); tb += 2.0; k += 1
    capa_pad(ACORDES[0] + [73], T["fin"] - 0.9, T["fin"], 0.12, 2400)
    fx.pon(pico(clic(), 1.0), T["c1"], 0.14); fx.pon(pico(blip(1000, 600, 0.1), 1.0), T["c2"], 0.08)
    golpe(T["c3"], 0.9, 0.42); fx.pon(reverb(pico(acorde([hz(m) for m in (62, 66, 69, 74, 78)], 1.2, fc=6000, a=0.01, r=0.5), 0.5), irg, 0.5), T["c3"], 0.14)
    fx.pon(reverb(pico(campana(hz(86), 1.4), 1.0), irg, 0.5), T["c4"], 0.08)

x = master(limitador(mus.x + pad.x, 3.0), 0.9) * 0.78 + master(limitador(fx.x, 3.0), 0.9) * 0.9
n = n_(0.7); x[-n:] *= np.linspace(1, 0, n)[:, None]
os.makedirs(os.path.join(AQUI, "audio"), exist_ok=True)
nombre = "banda-limpio.wav" if LIMPIO else "banda.wav"
escribe(os.path.join(AQUI, "audio", nombre), master(x, 0.93)); print(f"{nombre}: {DUR:.2f} s")
