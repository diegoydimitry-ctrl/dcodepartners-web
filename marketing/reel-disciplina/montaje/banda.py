# Música y efectos originales del Reel «Deja de negociar contigo» (todo sintetizado aquí, sin samples de terceros).
# Lee los cortes de página de tiempos.json (si existe, medidos sobre la voz real) o de plan.py (estimados).
#   problema (p2–p9): dron oscuro en Re menor + latido grave · cambio (p10): subida → pulso constante
#   fórmula (p14): campana + sub y un respiro · p15–p17: crece · p18 «Si fallas un día, vale»: se vacía
#   p19 «Nunca dos seguidos»: golpe · p20–p21: baja para que mande la voz · p22: acorde final que se apaga
import os, sys, json, math
import numpy as np
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, "..", "..", "anuncios-v3", "comun"))
from sintesis import *
from plan import P
T = [(a, b) for a, b, *_ in P]
if os.path.exists(os.path.join(AQUI, "tiempos.json")):
    T = [tuple(x) for x in json.load(open(os.path.join(AQUI, "tiempos.json")))["paginas"]]
S = [a for a, _ in T]; FIN = T[-1][1]; DUR = FIN + 0.2
mus, sfx = Pista(DUR), Pista(DUR)
ir = ir_sala(1.3, 6000, 0.012, 5); irg = ir_sala(3.2, 4800, 0.02, 11)
rng = np.random.default_rng(11)
def hz(m): return 440 * 2 ** ((m - 69) / 12)
BPM = 76; BEAT = 60 / BPM

def pad(notas, t0, t1, g, fc=1400):
    d = t1 - t0
    if d <= 0.05: return
    y = acorde([hz(m) for m in notas], d, fc=fc, a=min(1.2, d / 3), r=min(1.5, d / 2))
    mus.pon(reverb(pico(y, 0.5), irg, 0.45), t0, g, 0, 0.6)

def latido(t, g):  # pulso grave tipo corazón
    for k, gg in ((0, 1.0), (0.18, 0.6)):
        y = lp(sine(hz(26), 0.32) * env_ad(0.32, 0.004, None, 7), 180)
        mus.pon(pico(y, 1.0), t + k, g * gg)

# ── 0: golpe de entrada + reloj ──
sfx.pon(pico(impacto(2.0, 0.9), 1.0), 0.0, 0.42)
sfx.pon(pico(caida_sub(1.4, 70, 28), 1.0), 0.0, 0.3)
# alarma real del plano (p2): pitidos de despertador, cortos
for k in range(5): sfx.pon(pico(aviso(1760), 0.9), S[1] + 0.12 + k * 0.28, 0.16, 0.1)
# ── problema: dron + latido ──
prog_osc = [[38, 50, 53, 57], [34, 46, 50, 53], [36, 48, 51, 55], [33, 45, 49, 52]]  # Dm · Bb · Cm(add) · A
t, i = 0.3, 0
while t < S[9] - 0.05:
    t1 = min(S[9], t + 4 * BEAT * 2); pad(prog_osc[i % 4], t, t1, 0.10, 900); t = t1; i += 1
b = 0.6
while b < S[9] - 0.1:
    latido(b, 0.20 + 0.10 * (b / S[9])); b += BEAT * 2
# segundos sueltos (tic de reloj) bajo «el problema»
for k in range(int((S[4] - S[3]) / 0.5)): sfx.pon(pico(clic(), 1.0), S[3] + k * 0.5, 0.05, 0.2)
# ── cambio (p10): subida y pulso constante ──
mus.pon(pico(subida(1.4, 200, 6000), 0.7), S[9] - 1.4, 0.10)
prog = [(38, [62, 65, 69, 72]), (34, [62, 65, 70, 74]), (41, [60, 65, 69, 72]), (36, [60, 64, 67, 72])]  # Dm9 Bb F C
def seccion(t0, t1, e):
    tb, j = t0, 0
    while tb < t1 - 0.05:
        raiz, ac = prog[j % 4]; comp = min(4 * BEAT, t1 - tb)
        pad([m - 12 for m in ac], tb, tb + comp, 0.09 + 0.02 * e, 1100 + 500 * e)
        bass = saw(hz(raiz - 12), comp * 0.95) * env_ad(comp * 0.95, 0.02, None, 1.2)
        mus.pon(pico(lp(bass, 200 + 60 * e), 0.9), tb, 0.10 + 0.03 * e)
        for q in range(8):
            tq = tb + q * BEAT / 2
            if tq >= t1 - 0.02: break
            mus.pon(pico(lp(sine(hz(raiz), 0.16) * env_ad(0.16, 0.004, None, 6), 700), 0.8), tq, 0.06 + 0.02 * e)
            if e >= 2 and q % 2 == 0: mus.pon(pico(bombo(0.34, 130, 44, 0.8, 0.9, 1.3), 1.0), tq, 0.22 + 0.04 * (e - 2))
            if e >= 2 and q % 2 == 1: mus.pon(pico(hat(False, 9000), 0.5), tq, 0.035, 0.3)
            if e >= 1: mus.pon(pico(pluck(hz(ac[[0, 2, 1, 3][q % 4]] + 12), 0.14, 2400 + 400 * e), 1.0), tq, 0.018 + 0.006 * e, 0.4 * (-1) ** q)
        tb += comp; j += 1
seccion(S[9], S[12], 0)          # gente constante · lo decidió antes
sfx.pon(reverb(pico(campana(hz(81), 1.6), 0.6), ir, 0.4), S[11], 0.05)   # «Lo decidió antes»
seccion(S[12], S[13], 1)         # montando mi empresa
for k in range(14): sfx.pon(pico(tecla(), 1.0), S[12] + 0.15 + k * 0.085 + 0.01 * math.sin(k * 3), 0.07, 0.1)
# fórmula (p14): respiro con campana y sub
sfx.pon(whoosh(0.7, 400, 4200, -0.5, 0.5), S[13] - 0.45, 0.12)
sfx.pon(reverb(pico(campana(hz(74), 2.4), 0.7), irg, 0.5), S[13], 0.10)
sfx.pon(pico(caida_sub(1.6, 80, 30), 1.0), S[13], 0.28)
pad([50, 57, 62, 65, 69], S[13], S[14], 0.10, 2200)
seccion(S[14], S[16], 2)         # cuando cierro el portátil · cuando llego
seccion(S[16], S[17], 3)         # que sea tan pequeño
mus.pon(pico(subida(1.2, 300, 7000), 0.7), S[17] - 1.2, 0.08)
# p18 «Si fallas un día, vale»: se vacía, solo un acorde
pad([50, 57, 62, 65], S[17], S[18], 0.08, 1300)
# p19 «Nunca dos seguidos»: golpe
sfx.pon(pico(impacto(2.2, 1.0), 1.0), S[18], 0.38)
sfx.pon(pico(caida_sub(1.8, 75, 26), 1.0), S[18], 0.3)
seccion(S[18], S[20], 1)         # promesas: baja para que mande la voz
pad([46, 53, 58, 62, 65], S[20], S[21], 0.09, 1500)
# final: resolución y cola
fin = acorde([hz(m) for m in (50, 57, 62, 66, 69, 74)], FIN - S[21] + 0.2, fc=2600, a=0.15, r=2.0)
mus.pon(reverb(pico(fin, 0.5), irg, 0.55), S[21], 0.13)
mus.pon(pico(caida_sub(1.4, 70, 28), 1.0), S[21], 0.2)
sfx.pon(reverb(pico(campana(hz(86), 2.6), 0.5), irg, 0.5), S[21] + 0.3, 0.05)
f = n_(1.6)
for Pp in (mus, sfx): Pp.x[-f:] *= np.linspace(1, 0, f)[:, None]
escribe(os.path.join(AQUI, "audio", "musica.wav"), master(limitador(mus.x, 4.0), 0.9))
escribe(os.path.join(AQUI, "audio", "efectos.wav"), master(sfx.x, 0.9))
print(f"banda lista: {DUR:.2f} s")
