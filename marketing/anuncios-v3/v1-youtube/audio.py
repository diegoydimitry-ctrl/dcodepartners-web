# RUIDO v4 — banda sonora: locución, música, diseño sonoro y mezcla. Todo colocado desde montaje.json.
#
#   python3 v1-youtube/audio.py
#
# 0–5 s: casi sin música (la música en los primeros 5 s resta recuerdo de marca en YouTube — Google): voz al
# frente, golpes graves en cada palabra, pulso de suspense y el rodillo de «un sueldo» como tragaperras.
# Después: microplanos con percusión de oficina → silencio → problema (dron y reloj) → golpe → groove 120 BPM
# → la cuenta atrás llega a cero en el remate («y tu equipo, por fin…») con un acorde que se abre → cierre.
import json, os, sys
import numpy as np, soundfile as sf
AQUI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(AQUI, "..", "comun"))
from sintesis import *

M = json.load(open(os.path.join(AQUI, "montaje.json"), encoding="utf-8"))
DUR = M["duracion"]; V = {f["id"]: f for f in M["voz"]}
OUT = os.path.join(AQUI, "audio"); os.makedirs(OUT, exist_ok=True)
BEAT = 60 / M["bpm"]
SIL0, SIL1, G0, C0, CF, PROD, FIN = M["silencio0"], M["silencio1"], M["golpe"], M["cuenta0"], M["cuenta_fin"], M["producto"], M["cierre"]
PR0 = V["p1"]["t0"] - 0.1; TICK = V["c8"]["t0"] - 0.05
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def W(fid, w): return next((p["t0"] for p in V[fid]["palabras"] if p["w"].lower().strip(",.:¿?…").startswith(w)), V[fid]["t0"])

voz, mus, sfx = Pista(DUR), Pista(DUR), Pista(DUR)

# ───────────── locución ─────────────
for f in M["voz"]:
    x, _ = sf.read(os.path.join(AQUI, "voz", f"{f['id']}.wav"), dtype="float32")
    y = cadena_voz(x, hpf=70, presencia=(3800, 2.0), aire=1.5, ratio=2.5, umbral=-22, calor=1.5, sala=0.04)
    voz.pon(y, f["t0"], 1.0)

# ───────────── 0 → 9 s · el gancho nuevo ─────────────
sfx.pon(pico(impacto(0.9, 1.3), 1.0), 0.0, 0.6)                       # fotograma 0: golpe + rendija de luz
sfx.pon(whoosh(0.45, 7000, 800, -0.9, 0.9), 0.0, 0.35)
mus.pon(pico(caida_sub(1.0, 70, 30), 1.0), 0.0, 0.45)
t = 0.9; per = 0.95                                                     # pulso de suspense (latido grave) que se acelera
while t < V["h"]["t0"] - 0.3:
    mus.pon(pico(bombo(0.3, 90, 38, 0.2, 1.0, 1.1), 1.0), t, 0.24); mus.pon(pico(bombo(0.3, 80, 36, 0.2, 0.8, 1.1), 1.0), t + 0.22, 0.13)
    t += per; per = max(0.55, per * 0.95)
dron = voz_saw(hz(38), V["h"]["t0"], 0.15, 5); dron = lp(dron, 260) * env_adsr(V["h"]["t0"], 1.2, 0.1, 1.0, 0.2)
mus.pon(pico(dron, 0.5), 0.0, 0.15, 0.0, 0.01)
for p in V["a1"]["palabras"]:                                           # golpe en cada palabra (60 ms antes: no tapa la consonante)
    sfx.pon(pico(hp(bombo(0.22, 200, 70, 0.8, 0.6, 2.0), 60), 1.0), p["t0"] - 0.06, 0.1)
tN = W("a1", "nadie")                                                   # «nadie ve»: brillo que se aleja
sfx.pon(reverb(pico(campana(hz(88), 1.6), 1.0), ir_sala(2.5, 8000, 0.03), 0.6), tN + 0.2, 0.12, 0.3)
tC, tU = W("a2", "cost"), W("a2", "un")                                 # rodillo de dígitos: tragaperras que frena
t = tC - 0.1; iv = 0.028
while t < tU - 0.05:
    sfx.pon(pico(clic(), 1.0), t, 0.22, np.sin(t * 13) * 0.5); t += iv; iv *= 1.035
sfx.pon(pico(caja_registradora(), 1.0), tU - 0.07, 0.33, 0.1)          # «UN SUELDO»
sfx.pon(pico(impacto(1.4, 1.0), 1.0), tU - 0.06, 0.4)
sfx.pon(pico(hp(bombo(0.4, 150, 45, 1.0, 1.0, 2.0), 30), 1.0), W("a2", "entero") - 0.06, 0.4)
for i in range(int((V["h"]["t0"] - C0) / 0.5)):                         # «en treinta segundos»: empieza el reloj
    tt = C0 + i * 0.5; sfx.pon(pico(hat(False, 6000 if i % 2 else 8000), 0.5), tt, 0.18 * (0.7 if i % 2 else 1.0), 0.35 * (-1) ** i)
mus.pon(pico(subida(1.2, 300, 9000), 0.9), V["h"]["t0"] - 1.2, 0.3)

# ───────────── microplanos: percusión de oficina con bombo en cada palabra ─────────────
pw = V["h"]["palabras"]
golpes = [pw[i]["t0"] for i in range(5)] + [SIL0]
cortes = []; oficina = [tecla, clic, aviso, tecla, vibracion, clic, obturador, tecla]; k = 0
for i in range(5):
    a, b = golpes[i], golpes[i + 1]; paso = (b - a) / 4
    for j in range(4):
        tt = a + j * paso; cortes.append(round(tt, 3))
        if j == 0: continue
        s = oficina[k % len(oficina)](); k += 1
        sfx.pon(pico(s, 0.5), tt, 0.55, [-0.6, 0.5, -0.2, 0.7, 0.0, -0.7, 0.3, 0.6][k % 8])
        if j == 2: sfx.pon(pico(hat(), 0.4), tt, 0.5, 0.3)
    mus.pon(pico(hp(bombo(0.4, 170, 44, drive=2.4), 35), 1.0), a - 0.07, 0.8)
    mus.pon(pico(caja(0.22, 210), 1.0), a + 2 * paso, 0.4)
    bb = sat(saw(hz(33 + [0, 0, 1, 0, 1][i]), b - a) * env_adsr(b - a, 0.004, 0.1, 0.6, 0.05), 2.5)
    mus.pon(pico(lp(bb, 900), 0.8), a - 0.07, 0.3)
a = pw[4]["t0"]
for j in range(12): sfx.pon(pico(clic(), 0.5), a + j * (SIL0 - a) / 12, 0.35 + 0.03 * j, (-1) ** j * 0.5)
t_ts = V["h"]["t1"] - 0.05
for P in (mus, sfx):
    a_, b_ = n_(t_ts), n_(SIL0); fr = tape_stop(P.x[a_:], SIL0 - t_ts + 0.3); P.x[a_:b_] = 0; P.x[a_:a_ + len(fr)][:b_ - a_] += fr[:b_ - a_]
for P in (mus, sfx, voz): P.corta(SIL0, SIL1, 0.01)                   # silencio real

# ───────────── «Esto no es trabajo. Es ruido.» ─────────────
mus.pon(pico(caida_sub(1.6, 85, 28), 1.0), SIL1, 0.9)
sfx.pon(pico(impacto(2.4, 1.2), 1.0), SIL1, 0.5)
t = V["b2"]["t0"]; g = pico(sat(hp(ruido(0.09), 900) * env_ad(0.09, 0.001, None, 6), 3), 0.8)
sfx.pon(tartamudeo(g, 0.03, 5), t + 0.02, 0.35, 0.2); sfx.pon(pico(bombo(0.5, 120, 40, drive=3), 1.0), t - 0.05, 0.5)

# ───────────── el problema ─────────────
d = G0 - PR0
dron = (voz_saw(hz(33), d, 0.18, 5) + voz_saw(hz(40), d, 0.2, 3) * 0.5)
dron = barrido(dron, 140, 700, "lp", 1.1, 40) * env_adsr(d, 1.2, 0.1, 1.0, 0.3)
mus.pon(pico(dron, 0.7), PR0, 0.34, 0.0, 0.012)
for i in range(int(d / (BEAT / 2))):
    tt = PR0 + i * BEAT / 2
    sfx.pon(pico(hat(False, 5500 if i % 2 else 7000), 0.5), tt, 0.16 + 0.1 * (i % 2 == 0), 0.35 * (-1) ** i)
    if i % 4 == 0: mus.pon(pico(bombo(0.35, 110, 42, 0.3, 0.8, 1.2), 1.0), tt, 0.32)
for key, f0 in (("p1", 1046.5 * 0.97), ("p2", 1174.7 * 1.03), ("p3", 987.8 * 0.955)):
    for w in V[key]["palabras"][::2]:
        sfx.pon(pico(aviso(f0), 0.4), w["t0"], 0.13, np.sin(w["t0"] * 3) * 0.7)
mus.pon(pico(subida(2.0, 250, 12000), 0.9), G0 - 2.1, 0.45)
sfx.pon(whoosh(1.0, 400, 6000, -0.9, 0.9), G0 - 1.05, 0.35)
for P in (mus, sfx): P.corta(G0 - 0.12, G0, 0.03)

# ───────────── golpe y groove ─────────────
sfx.pon(pico(impacto(1.5, 1.0), 1.0), G0, 0.55)
sfx.pon(pico(campana(hz(81), 1.6), 1.0), G0, 0.15, -0.3); sfx.pon(pico(campana(hz(88), 1.6), 1.0), G0 + 0.01, 0.12, 0.3)
ir = ir_sala(1.8, 6500, 0.02)
prog_ = [[53, 57, 60, 64, 67], [57, 60, 64, 67, 71], [50, 57, 60, 64, 65], [55, 59, 62, 64, 69]]; bajos = [41, 45, 38, 43]
barra = 4 * BEAT; nb = int(np.ceil((FIN - G0) / barra))
for b in range(nb):
    tb = G0 + b * barra; ac = prog_[(b // 2) % 4]; bj = bajos[(b // 2) % 4]
    entrada = b < 2; remate = tb >= CF - barra                          # en el remate la base se aligera y abre
    if tb >= FIN: break
    if b % 2 == 0:
        cc = acorde([hz(m) for m in ac], barra * 2, fc=2600 if not remate else 4200, a=0.03, r=0.6)
        mus.pon(reverb(pico(cc, 0.6), ir, 0.25), tb, 0.30)
    for q in range(4):
        tq = tb + q * BEAT
        if tq >= FIN: break
        mus.pon(pico(bombo(0.38, 150, 45, 0.8, 1.0, 1.5), 1.0), tq, 0.72 if not remate else 0.55)
        if q in (1, 3): mus.pon(reverb(pico(palmada(), 1.0), ir, 0.18), tq, 0.34, 0.1)
        if entrada: continue
        bl = saw(hz(bj), BEAT / 2 * 0.9) * env_adsr(BEAT / 2 * 0.9, 0.003, 0.06, 0.6, 0.05)
        mus.pon(pico(lp(sat(bl, 1.6), 700), 0.8), tq + BEAT / 2, 0.42)
        for s16 in range(4):
            ts = tq + s16 * BEAT / 4
            mus.pon(pico(hat(s16 == 2 and q == 3, 9000), 0.5), ts, [0.10, 0.06, 0.16, 0.06][s16] * 1.4, 0.4 * (-1) ** s16)
            nota = ac[[0, 2, 4, 3, 1, 2, 4, 3][(q * 4 + s16) % 8]] + 12
            mus.pon(reverb(pico(pluck(hz(nota), 0.28, 3500), 0.5), ir, 0.3), ts, 0.10, 0.5 * np.sin(ts * 2.1), 0.009)
for key in ("c2", "c3", "c4", "c5", "c6"):
    t = V[key]["t0"]; sfx.pon(pico(bombo(0.5, 180, 50, 1.0, 1.0, 2.2), 1.0), t - 0.06, 0.26); sfx.pon(whoosh(0.32, 900, 7000, -0.5, 0.5), t - 0.3, 0.2)
for j in range(3):                                                      # procesos · datos · herramientas
    t = V["c4"]["t0"] + 0.35 + j * 0.3; sfx.pon(pico(campana(hz(93), 0.6), 1.0), t, 0.1, 0.3); sfx.pon(pico(clic(), 1.0), t, 0.3)
for i, tt in enumerate((CF - 3, CF - 2, CF - 1)):                       # 3, 2, 1…
    sfx.pon(pico(campana(hz(96 + i), 0.4), 1.0), tt, 0.10 + 0.04 * i, 0.4)
sfx.pon(pico(subida(1.0, 800, 12000, False), 0.8), CF - 1.0, 0.3)
sfx.pon(reverb(pico(campana(hz(84), 2.5) + campana(hz(91), 2.5) * 0.6, 1.0), ir_sala(2.8, 9000, 0.02), 0.4), CF, 0.3)   # …cero
sfx.pon(pico(impacto(1.6, 0.8), 1.0), CF, 0.4)

# ───────────── cierre ─────────────
t = FIN
fin = acorde([hz(m) for m in (41, 53, 57, 60, 64, 67, 72)], DUR - t, fc=2000, a=0.02, r=2.0)
mus.pon(reverb(pico(fin, 0.7), ir_sala(3.0, 5000, 0.03), 0.35), t, 0.34)
mus.pon(pico(caida_sub(3.0, 60, 40), 1.0), t, 0.5)
sfx.pon(whoosh(0.9, 5000, 300, 0.8, -0.8), t - 0.3, 0.25)
sfx.pon(reverb(pico(campana(hz(96), 2.0), 1.0), ir_sala(2.2, 9000, 0.02), 0.35), TICK, 0.32, 0.15)
sfx.pon(pico(clic(), 1.0), TICK, 0.5)
sfx.pon(pico(campana(hz(91), 1.8), 1.0), V["c9"]["t0"], 0.12, -0.2)
f = n_(1.2)
for P in (mus, sfx): P.x[-f:] *= np.linspace(1, 0, f)[:, None] ** 2

# ───────────── mezcla ─────────────
e = envolvente(voz.x, 0.01, 0.25)
idx = np.arange(len(e)); en_gancho = (idx >= n_(V["h"]["t0"] - 0.1)) & (idx < n_(SIL0))
prof = np.where(en_gancho, db(-10), db(-12))
mus.x *= (1 - (1 - prof) * np.clip(e * 1.6, 0, 1))[:, None]
sfx.x *= (1 - (1 - db(-9)) * np.clip(e * 1.6, 0, 1))[:, None]
mezcla = master(voz.x + mus.x * 0.62 + sfx.x * 0.62)
mezcla[n_(SIL0):n_(SIL1)] = 0.0
escribe(os.path.join(OUT, "mezcla.wav"), mezcla)
for nom, P in (("voz", voz), ("musica", mus), ("efectos", sfx)): escribe(os.path.join(OUT, f"pista-{nom}.wav"), P.x)
json.dump({"cortes": cortes, "silencio": [SIL0, SIL1]}, open(os.path.join(OUT, "cortes.json"), "w"), indent=1)
print(f"mezcla {len(mezcla)/SR:.2f} s · {len(cortes)} cortes en microplanos · cuenta {C0:.2f}→{CF:.2f} ({CF-C0:.2f} s)")
