# Música, efectos y mezcla con la voz (todo sintetizado aquí). Arco: noche tranquila → tensión → subidón en el 91 % → groove → cierre.
import os, sys, math, json
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
AQUI = os.path.dirname(os.path.abspath(__file__))
for p in (os.path.join(AQUI, "..", "anuncios-v3", "marketing", "anuncios-v3", "comun"), os.path.join(AQUI, "..", "anuncios-v3", "comun")):
    sys.path.insert(0, p)
from sintesis import *
V = json.load(open(os.path.join(AQUI, "voz.json"))); F = V["frases"]; S = V["subs"]
def sub(txt): return next(s for s in S if s["texto"].startswith(txt))
T_LOGO = F[17]["t1"] + 0.3; FIN = T_LOGO + 2.3
E = dict(personas=F[1]["t0"] - 0.2, grupos=F[3]["t0"] - 0.1, frase=F[6]["t0"] - 0.15, resultado=F[7]["t0"] - 0.25, noventa=F[9]["t0"] - 0.1,
         ganas=F[11]["t0"] - 0.2, estudios=F[13]["t0"] - 0.2, tu=F[14]["t0"] - 0.2, final=F[16]["t0"] - 0.2, logo=T_LOGO)
mus, fx = Pista(FIN), Pista(FIN)
ir = ir_sala(0.8, 7000, 0.01, 5); irg = ir_sala(2.6, 6000, 0.02, 13)
rng = np.random.default_rng(9)
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def blip(f0, f1, d=0.1):
    t = t_(n_(d)); f = f1 + (f0 - f1) * np.exp(-t * 45); return np.sin(2 * math.pi * np.cumsum(f) / SR) * np.exp(-t * 30)
def pad(notas, t0, t1, g, fc=1800):
    d = t1 - t0; y = acorde([hz(m) for m in notas], d, fc=fc, a=min(0.5, d / 3), r=min(0.9, d / 2)); mus.pon(reverb(pico(y, 0.5), irg, 0.5), t0, g, 0, 0.9)
def boli(d=0.25):                                  # trazo de bolígrafo: ruido filtrado con vaivén
    t = t_(n_(d)); y = bp(ruido(d), 3200, 1.5) * (0.5 + 0.5 * np.abs(np.sin(2 * math.pi * 9 * t))) * np.minimum(1, t / 0.02) * np.minimum(1, (d - t) / 0.04); return y
def golpe(t, peso=1.0, g=0.3): fx.pon(pico(impacto(1.6 * peso, peso), 1.0), t, g); fx.pon(pico(caida_sub(1.0 * peso, 80, 30), 1.0), t, g * 0.6)
B = 60 / 112
AC = [[54, 61, 66, 69], [50, 57, 62, 66], [45, 57, 61, 64], [52, 59, 64, 68]]     # Fa#m · Re · La · Mi
RZ = [42, 38, 45, 40]
ARP = [0, 1, 2, 3, 2, 1, 3, 2]
def compas(tb, k, hasta, f=1.0, bombo4=True, clap=True, hats=True, arp=True):
    ac, rz = AC[k % 4], RZ[k % 4]; pad(ac, tb, min(hasta, tb + 4 * B) + 0.1, 0.08 * f)
    for q in range(16):
        tq = tb + q * B / 4
        if tq >= hasta - 0.02: break
        if bombo4 and q % 4 == 0: mus.pon(pico(bombo(0.32, 130, 46, 0.8, 1.0, 1.3), 1.0), tq, 0.3 * f)
        if clap and q % 8 == 4: mus.pon(reverb(pico(palmada(), 0.6), ir, 0.25), tq, 0.09 * f)
        if hats and q % 4 == 2: mus.pon(pico(hat(False, 9500), 0.5), tq, 0.05 * f, 0.3)
        if hats: mus.pon(pico(hp(ruido(0.03), 8000) * np.exp(-t_(n_(0.03)) * 120), 0.5), tq, 0.012 * f, 0.4 * (-1) ** q)
        if q % 4 == 2: mus.pon(pico(lp(saw(hz(rz), 0.24) * env_ad(0.24, 0.005, None, 4), 380), 0.9), tq, 0.16 * f)
        if arp and q % 2 == 0: mus.pon(reverb(pico(pluck(hz(ac[ARP[(q // 2) % 8]] + 12), 0.25, 3200), 1.0), ir, 0.3), tq, 0.045 * f, 0.45 * (-1) ** (q // 2))

# ── gancho ──
pad(AC[2], 0.0, E["personas"] + 0.3, 0.07, 900)
for q in range(int(S[1]["t0"] / (B / 2))): mus.pon(reverb(pico(pluck(hz([69, 73, 76, 81][q % 4]), 0.35, 1800), 1.0), irg, 0.4), q * B / 2 + 0.05, 0.035, 0.4 * (-1) ** q)
fx.pon(pico(boli(0.95), 1.0), 0.38, 0.12)
mus.pon(pico(subida(S[1]["t0"] - 0.4, 300, 7000), 0.6), 0.35, 0.06)
golpe(S[1]["t0"] - 0.02, 0.7, 0.26); mus.pon(reverb(pico(acorde([hz(m) for m in (57, 64, 69, 73, 76)], 1.6, fc=5000, a=0.01, r=0.6), 0.5), irg, 0.5), S[1]["t0"] - 0.02, 0.16, 0, 0.9)
# ── personas y grupos: pulso suave ──
tb = E["personas"]; k = 0
while tb < E["frase"] - 0.05:
    compas(tb, k, E["frase"], 0.7, bombo4=True, clap=False, hats=tb > F[2]["t0"]); tb += 4 * B; k += 1
for j in range(40): fx.pon(pico(blip(rng.uniform(1100, 1900), 600, 0.06), 1.0), F[1]["t0"] + 0.05 + 1.1 * j / 40, 0.03, rng.uniform(-0.6, 0.6))
fx.pon(whoosh(0.9, 500, 4000, -0.6, 0.6), F[2]["t0"], 0.1)
for i in (3, 4, 5): fx.pon(reverb(pico(blip(hz([76, 81, 88][i - 3]), hz([76, 81, 88][i - 3]), 0.18), 1.0), ir, 0.3), F[i]["t0"] - 0.05, 0.07, [-0.6, 0, 0.6][i - 3])
# ── la frase: se escribe ──
pad(AC[2] + [76], E["frase"], E["resultado"], 0.08, 2200)
s2 = sub("el día tal")
for a, d in ((s2["t0"] + 0.05, 0.4), (s2["t0"] + 0.75, 0.3), (s2["t0"] + 1.35, 0.5)): fx.pon(pico(boli(d), 1.0), a, 0.12, rng.uniform(-0.3, 0.3))
fx.pon(whoosh(0.5, 3000, 600, 0.4, -0.4), E["frase"], 0.08)
# ── resultado: tensión ──
pad([42, 54, 57, 61], E["resultado"], E["noventa"] + 0.2, 0.09, 900)
for q in range(int((E["noventa"] - E["resultado"]) / B)): mus.pon(pico(bombo(0.4, 70, 38, 0.3, 1.0, 1.1), 1.0), E["resultado"] + q * B, 0.16)
tl = sub("solo uno de cada tres")["t0"]
for j in range(18): fx.pon(pico(blip(rng.uniform(700, 1000), 450, 0.08), 1.0), tl + rng.random() * 0.6, 0.035, rng.uniform(-0.6, 0.2))
fx.pon(pico(blip(500, 220, 0.25), 1.0), F[8]["t0"] + 0.05, 0.08)
# ── 91 %: subida y estallido ──
t91 = F[10]["t0"]
mus.pon(pico(subida(t91 - E["noventa"] + 0.1, 250, 11000), 0.6), E["noventa"] - 0.1, 0.12)
for k2 in range(8): mus.pon(pico(caja(0.15, 210), 0.6), t91 - 0.9 + k2 * 0.11, 0.015 + 0.01 * k2)
golpe(t91 - 0.08, 1.0, 0.24)
mus.pon(reverb(pico(acorde([hz(m) for m in (45, 57, 64, 69, 73, 76, 81)], 2.2, fc=6500, a=0.01, r=0.8), 0.5), irg, 0.5), t91 - 0.08, 0.13, 0, 0.9)
for j in range(36): fx.pon(reverb(pico(blip(rng.uniform(1500, 2600), 900, 0.07), 1.0), ir, 0.25), t91 + rng.random() * 0.6, 0.035, rng.uniform(-0.2, 0.8))
# ── groove: ganas, estudios, tu turno ──
tb = t91 + 0.5; k = 0
while tb < E["final"] - 0.05:
    compas(tb, k, E["final"], 1.0); tb += 4 * B; k += 1
fx.pon(whoosh(0.6, 600, 5000, -0.4, 0.4), E["ganas"], 0.08); fx.pon(whoosh(0.6, 600, 5000, 0.4, -0.4), F[12]["t0"] - 0.15, 0.09)
for i in range(94):
    ti = E["estudios"] + 0.2 + i * ((F[13]["t1"] - E["estudios"] - 0.3) / 94)
    if i % 2 == 0: fx.pon(pico(blip(1800 + 8 * i, 1200, 0.04), 1.0), ti, 0.02, (i % 10 - 4.5) / 6)
for txt, a, b in (("Así que elige", 0.5, 1.6), ("y escribe ahora", 0.75, 0.35), ("y escribe ahora", 1.35, 0.25), ("y el lugar", 0.05, 0.5)):
    fx.pon(pico(boli(b), 1.0), sub(txt)["t0"] + a, 0.1, rng.uniform(-0.3, 0.3))
# ── final ──
pad(AC[1], E["final"], F[17]["t0"], 0.1, 1400)
mus.pon(pico(subida(F[17]["t0"] - E["final"], 300, 8000), 0.6), E["final"], 0.07)
golpe(F[17]["t0"] - 0.08, 0.7, 0.2)
pad([45, 57, 64, 69, 73, 76], F[17]["t0"] - 0.08, FIN, 0.13, 3200)
for i, m in enumerate((81, 85, 88)): mus.pon(reverb(pico(campana(hz(m), 2.0), 1.0), irg, 0.6), F[17]["t0"] + 0.05 + i * 0.12, 0.05)
fx.pon(reverb(pico(campana(hz(93), 2.2), 1.0), irg, 0.6), E["logo"] + 0.25, 0.05)

# ── voz y mezcla (ganancias fijas: cada cambio es local) ──
v, sr = sf.read(os.path.join(AQUI, "audio", "voz.wav"))
if sr != SR: v = resample_poly(v, SR, sr)
voz = cadena_voz(v, hpf=80, presencia=(3500, 2.5), aire=1.5, ratio=2.5, umbral=-18, sala=0.04, calor=1.5)
n = len(mus.x); vz = np.zeros((n, 2)); m = min(n, len(voz)); vz[:m] = voz[:m]
env = envolvente(vz, 0.015, 0.35); duck = 1 - 0.7 * np.clip(env * 1.6, 0, 1)
musica = limitador(mus.x * duck[:, None], 3.0)
def bus(y, g): y = hp(y, 28); return np.tanh(y * g) * 0.9
print('picos', round(np.abs(musica).max(), 3), round(np.abs(fx.x).max(), 3))
GM = 0.062 / max(1e-6, np.percentile(np.abs(musica), 99.9)); GF = 0.52
x = vz * 0.95 + bus(musica, GM) + bus(fx.x, GF) * (1 - 0.45 * np.clip(env * 1.6, 0, 1))[:, None]
k = n_(0.5); x[-k:] *= np.linspace(1, 0, k)[:, None]
escribe(os.path.join(AQUI, "audio", "resto.wav"), x - vz * 0.95); escribe(os.path.join(AQUI, "audio", "vozp.wav"), vz * 0.95)
escribe(os.path.join(AQUI, "audio", "mezcla.wav"), master(x, 0.95)); print(f"mezcla: {FIN:.2f} s")
