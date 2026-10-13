# Música, efectos y mezcla con la voz (todo sintetizado aquí, sin samples de terceros).
# La música baja sola cuando habla la voz (compresión lateral con su envolvente).
import os, sys, math, json
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, "..", "anuncios-v3", "comun"))
from sintesis import *
V = json.load(open(os.path.join(AQUI, "voz.json"))); F = V["frases"]; S = V["subs"]
T_LOGO = F[18]["t1"] + 0.35; FIN = T_LOGO + 2.5
E = dict(excel=F[2]["t0"] - 0.05, demo=F[3]["t0"] - 0.3, estudio=F[6]["t0"] - 0.15, renombre=F[8]["t0"] - 0.2, filas=F[9]["t0"] - 0.25,
         vacio=F[11]["t0"], calma=F[12]["t0"] - 0.25, leccion=F[15]["t0"] - 0.15, truco=F[17]["t0"] - 0.2, cierre=F[18]["t0"] - 0.2, logo=T_LOGO)
mus, fx = Pista(FIN), Pista(FIN)
ir = ir_sala(0.8, 7000, 0.01, 5); irg = ir_sala(2.6, 5500, 0.02, 13)
rng = np.random.default_rng(5)
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def blip(f0, f1, d=0.1):
    t = t_(n_(d)); f = f1 + (f0 - f1) * np.exp(-t * 45); return np.sin(2 * math.pi * np.cumsum(f) / SR) * np.exp(-t * 32)
def thock(g=0.3, t0=0.0):                       # tecla grande (Intro)
    fx.pon(pico(bombo(0.12, 260, 120, 0.4, 0.6, 1.1), 1.0), t0, g * 0.7); fx.pon(pico(tecla(), 1.0), t0, g)
def teclas(a, b, n, g=0.09):
    for k in range(n): fx.pon(pico(tecla(), 1.0), a + (b - a) * k / max(1, n - 1) + rng.uniform(-0.01, 0.01), g * rng.uniform(0.8, 1.1), rng.uniform(-0.25, 0.25))
def pad(notas, t0, t1, g, fc=1400):
    d = t1 - t0; y = acorde([hz(m) for m in notas], d, fc=fc, a=min(0.6, d / 3), r=min(0.9, d / 2)); mus.pon(reverb(pico(y, 0.5), irg, 0.5), t0, g, 0, 0.9)
def tic(f=2400, d=0.03):
    t = t_(n_(d)); return np.sin(2 * math.pi * f * t) * np.exp(-t * 160) + hp(ruido(d), 5000) * np.exp(-t * 300) * 0.3
BPM = 100; B = 60 / BPM
DM = [[50, 57, 62, 65], [46, 53, 58, 62], [41, 53, 57, 60], [48, 55, 60, 64]]   # Rem · Sib · Fa · Do
RA = [38, 34, 41, 36]
ARP = [74, 77, 81, 77, 74, 72, 74, 69]

# ── 0 · gancho: reloj de curiosidad (corcheas agudas) y dron ──
pad([38, 50, 57], 0.0, E["excel"], 0.08, 700)
for k in range(int(E["excel"] / (B / 2))):
    tk = k * B / 2; mus.pon(reverb(pico(pluck(hz(ARP[k % 8] + (0 if tk < 1.2 else 0)), 0.18, 2600 if tk > 1.2 else 1800), 1.0), ir, 0.25), tk + 0.02, 0.035 if tk < 1.2 else 0.05, 0.4 * (-1) ** k)
teclas(0.0, 0.7, 6, 0.11); thock(0.32, 0.95)
fx.pon(reverb(pico(blip(1500, 900, 0.12), 1.0), ir, 0.2), 0.96, 0.08)
for rr in range(1, 26):                         # cada gen que se convierte en fecha
    if rr == 15: continue
    tc = 1.55 + abs(rr - 15) * 0.085; fx.pon(pico(tic(1800 + 40 * abs(rr - 15)), 1.0), tc, 0.05, 0.6 * (1 if rr > 15 else -1))
fx.pon(whoosh(3.0, 200, 2200, -0.3, 0.3), 1.15, 0.06)
fx.pon(pico(impacto(1.0, 0.8), 1.0), E["excel"] - 0.12, 0.3); fx.pon(pico(caida_sub(0.9, 70, 30), 1.0), E["excel"] - 0.12, 0.2)
mus.corta(E["excel"], E["excel"] + 0.01, 0.02)

# ── groove de descubrimiento: demo, estudio y renombre ──
def compas(tb, k, hasta, f=1.0, hats=False):
    ac, raiz = DM[k % 4], RA[k % 4]; pad(ac, tb, min(hasta, tb + 4 * B) + 0.1, 0.07 * f, 1500)
    for q in range(8):
        tq = tb + q * B / 2
        if tq >= hasta - 0.02: break
        if q % 2 == 0: mus.pon(pico(bombo(0.3, 120, 45, 0.6, 1.0, 1.2), 1.0), tq, 0.22 * f)
        mus.pon(pico(lp(saw(hz(raiz), 0.2) * env_ad(0.2, 0.005, None, 5), 340), 0.9), tq + B / 4, 0.12 * f)
        mus.pon(reverb(pico(pluck(hz(ARP[(q + k * 2) % 8]), 0.22, 2400), 1.0), ir, 0.25), tq, 0.04 * f, 0.4 * (-1) ** q)
        if hats: mus.pon(pico(hat(False, 9000), 0.5), tq + B / 4, 0.03 * f, 0.3)
tb = E["excel"] + 0.75; k = 0
while tb < E["filas"] - 0.05:
    compas(tb, k, E["filas"], 1.0, tb > E["estudio"]); tb += 4 * B; k += 1
teclas(F[3]["t0"] + 0.5, F[3]["t0"] + 1.25, 6, 0.1); thock(0.3, F[4]["t0"] + 0.3)
fx.pon(reverb(pico(blip(700, 380, 0.16), 1.0), ir, 0.3), F[4]["t0"] + 0.32, 0.1)
fx.pon(whoosh(0.7, 4000, 400, 0.5, -0.5), E["estudio"], 0.12)
nf = 70                                          # celdas que se llenan: lluvia de tics
for j in range(nf):
    tj = E["estudio"] + 0.2 + (F[6]["t1"] - 0.6 - E["estudio"]) * (1 - (1 - j / nf) ** 2)
    fx.pon(pico(tic(rng.uniform(2600, 4200), 0.02), 1.0), tj, 0.025, rng.uniform(-0.7, 0.7))
for j in range(26): fx.pon(reverb(pico(blip(rng.uniform(900, 1500), 500, 0.08), 1.0), ir, 0.3), F[7]["t0"] + 0.05 + rng.random() * 0.9, 0.035, rng.uniform(-0.6, 0.6))
t0 = F[8]["t0"]
for a in (t0 + 0.25, t0 + 1.25): fx.pon(whoosh(0.3, 2500, 7000, -0.5, 0.5), a, 0.07)
teclas(t0 + 0.55, t0 + 1.1, 7, 0.08); teclas(t0 + 1.55, t0 + 2.1, 7, 0.08)

# ── filas: el contador acelera hasta 65.536 y se queda sin hoja ──
ta, tb2 = E["filas"] + 0.2, F[10]["t1"] + 0.05
pad([38, 45, 50, 53], E["filas"], tb2, 0.09, 900)
mus.pon(pico(subida(tb2 - ta, 120, 6000), 0.6), ta, 0.07)
x = 0.0
while True:                                      # tics al ritmo del contador
    k = x; tt = ta + (tb2 - ta) * k
    if tt >= tb2 - 0.01: break
    fx.pon(pico(tic(1600 + 2200 * k, 0.025), 1.0), tt, 0.035 + 0.03 * k, 0.3 * math.sin(40 * k))
    x += 0.012 + 0.11 * (1 - k) ** 2.2
for q in range(int((tb2 - E["filas"]) / (B / 2))):
    tq = E["filas"] + q * B / 2
    if q % 2 == 0: mus.pon(pico(bombo(0.3, 110, 42, 0.6, 1.0, 1.3), 1.0), tq, 0.2)
    mus.pon(pico(hat(q % 4 == 2, 9500), 0.5), tq + B / 4, 0.025)
mus.corta(tb2, tb2 + 0.01, 0.01)
fx.pon(pico(impacto(1.6, 1.0), 1.0), tb2 - 0.04, 0.26); fx.pon(pico(caida_sub(1.4, 80, 26), 1.0), tb2 - 0.04, 0.2)
fx.pon(reverb(pico(metal := (lambda f, d: sum(np.sin(2 * math.pi * f * rr * t_(n_(d))) * a * np.exp(-t_(n_(d)) * dc) for rr, a, dc in ((1, 1, 6), (2.76, .5, 9), (5.4, .3, 14))))(330, 1.4), 1.0), irg, 0.4), tb2, 0.08)
for j in range(9):                               # filas que caen al vacío
    ts = E["vacio"] + 0.1 + j * 0.2; fx.pon(whoosh(0.9, 2400, 180, -0.2 + 0.05 * j, 0.2), ts, 0.07 * (1 - j / 12))

# ── calma: casi silencio ──
pad([38, 50, 57, 62], E["calma"] + 0.2, E["leccion"], 0.07, 900)
for i, (m, dt) in enumerate(((74, 0.4), (69, 2.4), (72, 4.1))): mus.pon(reverb(pico(campana(hz(m), 2.0), 1.0), irg, 0.55), E["calma"] + dt, 0.045)
# ── lección: golpe grave y dron ──
fx.pon(pico(impacto(2.2, 1.0), 1.0), F[15]["t0"] - 0.12, 0.24); fx.pon(pico(caida_sub(2.0, 60, 24), 1.0), F[15]["t0"] - 0.08, 0.25)
pad([26, 38, 45], E["leccion"], E["truco"] + 0.2, 0.08, 500)
fx.pon(reverb(pico(campana(hz(62), 2.4), 1.0), irg, 0.6), F[16]["t0"] - 0.05, 0.06)
# ── truco: vuelve el pulso suave ──
tt = E["truco"]; tSel, tMenu, tTexto, tPega = F[17]["t0"] + 0.15, F[17]["t0"] + 0.7, F[17]["t0"] + 1.35, S[23]["t0"] + 1.0
for a in (tSel, tMenu, tTexto): fx.pon(pico(clic(), 1.0), a, 0.16)
fx.pon(pico(blip(1300, 900, 0.09), 1.0), tMenu + 0.02, 0.05); fx.pon(pico(blip(900, 1300, 0.09), 1.0), tTexto + 0.02, 0.05)
thock(0.25, tPega)
for rr in range(4): fx.pon(reverb(pico(blip(hz(81 + [0, 3, 7, 12][rr]), hz(81 + [0, 3, 7, 12][rr]), 0.16), 1.0), ir, 0.3), tPega + 0.3 + rr * 0.07, 0.05)
for q in range(int((E["cierre"] - tt) / (B / 2))):
    tq = tt + q * B / 2; mus.pon(reverb(pico(pluck(hz([62, 65, 69, 72][q % 4] + 12), 0.2, 2200), 1.0), ir, 0.3), tq, 0.03, 0.4 * (-1) ** q)
pad(DM[2], tt, E["cierre"] + 0.2, 0.06, 1200)
# ── cierre y marca ──
pad([38, 50, 57, 64], E["cierre"], FIN, 0.07, 1000)
for i, m in enumerate((74, 76, 77)): mus.pon(reverb(pico(campana(hz(m), 2.2), 1.0), irg, 0.6), E["cierre"] + 0.3 + i * 1.3, 0.04)
mus.pon(reverb(pico(acorde([hz(m) for m in (50, 57, 62, 65, 69)], 2.4, fc=2600, a=0.05, r=1.0), 0.5), irg, 0.55), E["logo"] + 0.2, 0.12, 0, 0.9)
fx.pon(reverb(pico(campana(hz(81), 2.2), 1.0), irg, 0.6), E["logo"] + 0.25, 0.06)

# ── voz y mezcla ──
v, sr = sf.read(os.path.join(AQUI, "audio", "voz.wav"))
if sr != SR: v = resample_poly(v, SR, sr)
voz = cadena_voz(v, hpf=80, presencia=(3500, 2.5), aire=1.5, ratio=2.5, umbral=-18, sala=0.04, calor=1.5)
n = len(mus.x); vz = np.zeros((n, 2)); m = min(n, len(voz)); vz[:m] = voz[:m]
env = envolvente(vz, 0.015, 0.35); duck = 1 - 0.7 * np.clip(env * 1.6, 0, 1)
tt_ = np.arange(n) / SR; gmus = np.where((tt_ > E['demo']) & (tt_ < E['vacio']), 0.6, 1.0); gmus = lp(gmus, 3)
musica = mus.x * (duck * gmus)[:, None]
def bus(y, g): y = hp(y, 28); return np.tanh(y * g) * 0.9
GM, GF = 1.95, 0.52     # ganancias fijas: así cada cambio de nivel es local
x = vz * 0.95 + bus(limitador(musica, 3.0), GM) + bus(fx.x, GF) * (1 - 0.45 * np.clip(env * 1.6, 0, 1))[:, None]
print('picos buses', round(np.abs(limitador(musica, 3.0)).max(), 3), round(np.abs(fx.x).max(), 3))
k = n_(0.5); x[-k:] *= np.linspace(1, 0, k)[:, None]
os.makedirs(os.path.join(AQUI, "audio"), exist_ok=True)
escribe(os.path.join(AQUI, "audio", "resto.wav"), x - vz * 0.95); escribe(os.path.join(AQUI, "audio", "vozp.wav"), vz * 0.95); escribe(os.path.join(AQUI, "audio", "mezcla.wav"), master(x, 0.95)); print(f"mezcla: {FIN:.2f} s")
