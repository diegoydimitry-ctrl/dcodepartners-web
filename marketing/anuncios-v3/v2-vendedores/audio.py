# SE BUSCAN COMERCIALES — banda sonora: locución, trap a 140 BPM, diseño sonoro y mezcla. Todo desde montaje.json.
#
#   python3 v2-vendedores/audio.py
#
# Fotograma 0: golpe + barrido (interrupción de patrón). La base arranca en «COMERCIALES»; antes del «50 %» se
# filtra y se para, y vuelve entera exactamente en el «50» con una caja registradora. Avisos de mensaje en
# «Instagram» y «correo», golpe al terminar la marca, sello final y la cinta que se frena.
import json, os, sys
import numpy as np, soundfile as sf
AQUI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(AQUI, "..", "comun"))
from sintesis import *

M = json.load(open(os.path.join(AQUI, "montaje.json"), encoding="utf-8"))
DUR = M["duracion"]; V = {f["id"]: f for f in M["voz"]}
def W(fid, palabra):
    return next((p["t0"] for p in V[fid]["palabras"] if p["w"].lower().strip(",.:¿?%").startswith(palabra.lower())), V[fid]["t0"])
OUT = os.path.join(AQUI, "audio"); os.makedirs(OUT, exist_ok=True)
BEAT = 60 / M["bpm"]; COMPAS = 4 * BEAT
T0B = V["v2"]["t0"] - 0.1                            # arranca la base (la primera frase va sola: voz + golpes)
T50 = W("v3", "50"); ROT0 = V["v3"]["t0"] - 0.15     # rotura: de «Y te llevas…» al «50»
T_FIN = V["v10"]["t1"] + 0.12
def hz(m): return 440 * 2 ** ((m - 69) / 12)

voz, mus, sfx = Pista(DUR), Pista(DUR), Pista(DUR)
for f in M["voz"]:
    x, _ = sf.read(os.path.join(AQUI, "voz", f"{f['id']}.wav"), dtype="float32")
    y = cadena_voz(x, hpf=110, presencia=(3400, 2.5), aire=1.5, ratio=3.0, umbral=-22, sala=0.025)
    voz.pon(y, f["t0"], 1.0)

sfx.pon(pico(impacto(0.7, 1.2), 1.0), 0.0, 0.45); sfx.pon(whoosh(0.3, 7000, 900, -0.8, 0.8), 0.0, 0.25)

prog_ = [(48, [60, 63, 67]), (44, [60, 63, 68]), (51, [58, 63, 67]), (46, [58, 62, 65])]
ir = ir_sala(1.2, 7000, 0.015, 5)
def compas_base(tb, idx, filtro=None, sin_bombo=False):
    raiz, ac = prog_[idx % 4]
    b1 = ochocientos(hz(raiz - 12), BEAT * 2.4, None)
    b2 = ochocientos(hz(raiz - 12 + (12 if idx % 2 else 7)), BEAT * 1.3, hz(raiz - 12), 0.06)
    for s_, tt in ((b1, tb), (b2, tb + BEAT * 2.5)):
        mus.pon(pico(s_ if not filtro else lp(s_, filtro), 0.9), tt, 0.5)
    if not sin_bombo:
        for tk in (0, 2.5 if idx % 2 else 1.75):
            mus.pon(pico(bombo(0.35, 180, 50, 1.0, 0.7, 2.0), 1.0), tb + tk * BEAT, 0.55)
    cp = palmada(); cp[:n_(0.26)] += caja(0.26, 230) * 0.5
    mus.pon(reverb(pico(cp if not filtro else lp(cp, filtro), 1.0), ir, 0.15), tb + 2 * BEAT, 0.5, 0.05)
    for i in range(8):
        h = hat(False, 9500); mus.pon(pico(h if not filtro else lp(h, filtro), 0.5), tb + i * BEAT / 2, 0.22 if i % 2 == 0 else 0.14, 0.3)
    if idx % 2 == 1:
        for j in range(6): mus.pon(pico(hat(False, 10000), 0.5), tb + 3 * BEAT + j * BEAT / 6, 0.09 + 0.02 * j, 0.3 - 0.1 * j)
    pad = acorde([hz(m) for m in ac], COMPAS, fc=1600 if not filtro else min(1600, filtro), a=0.05, r=0.3)
    mus.pon(reverb(pico(pad, 0.5), ir, 0.3), tb, 0.2, 0, 0.012)
    mus.pon(reverb(pico(campana(hz([72, 75, 79, 77][idx % 4]), 1.2), 0.5), ir, 0.35), tb + BEAT * 1.5, 0.12, -0.3)

tb, idx = T0B, 0
while tb < ROT0 - 0.05: compas_base(tb, idx); tb += COMPAS; idx += 1
mus.corta(ROT0, DUR, 0.02)
tb2 = ROT0
while tb2 < T50 - 0.05: compas_base(tb2, idx, filtro=500, sin_bombo=True); tb2 += COMPAS; idx += 1
mus.corta(T50 - 0.1, DUR, 0.02)
mus.pon(pico(subida(max(0.4, T50 - ROT0 - 0.1), 300, 10000), 0.9), ROT0, 0.4)
sfx.pon(pico(caja_registradora(), 1.0), T50 - 0.01, 0.34, 0.15)
sfx.pon(pico(hp(impacto(2.0, 1.2), 30), 1.0), T50 - 0.06, 0.4)
sfx.pon(pico(caida_sub(1.0, 70, 32), 1.0), T50, 0.4)
tb = T50; idx = 0
while tb < T_FIN: compas_base(tb, idx); tb += COMPAS; idx += 1

acentos = []
for p in V["v1"]["palabras"]:
    sfx.pon(pico(hp(bombo(0.25, 260, 90, 1.0, 0.6, 2.5), 60), 1.0), p["t0"] - 0.06, 0.12); acentos.append(p["t0"])
pv2 = V["v2"]["palabras"]                              # «SIN ESTUDIOS / SIN EXPERIENCIA»: tachones al acabar cada palabra
for i, tt in enumerate((pv2[1]["t1"] + 0.1, pv2[-1]["t1"] + 0.08, pv2[-1]["t1"] + 0.35)):
    sfx.pon(pico(barrido(ruido(0.3), 5000, 1500, "bp", 3, 12) * env_ad(0.3, 0.01, None, 3), 0.8), tt, 0.2, 0.3 * (-1) ** i)
for w in ("automatización", "inteligencia"):
    t = W("v4", w); sfx.pon(whoosh(0.3, 700, 6000, -0.6, 0.6), t - 0.28, 0.3); acentos.append(t)
for fid in ("v5", "v6"):
    t = V[fid]["t0"]; sfx.pon(whoosh(0.35, 500, 5000, -0.9 if fid == "v5" else 0.9, 0.0), t - 0.3, 0.3); acentos.append(t)
t = W("v7", "programar"); sfx.pon(pico(clic(), 1.0), t + 0.2, 0.3)
for pal_ in ("instagram", "correo"):
    t = W("v9", pal_); sfx.pon(pico(aviso(1318.5 if pal_ == "instagram" else 1568), 1.0), t, 0.22, 0.2); acentos.append(t)
t = V["v10"]["t1"] - 0.02; sfx.pon(pico(impacto(1.4, 1.0), 1.0), t, 0.4)
a = n_(T_FIN); frenado = tape_stop(mus.x[a:], 0.6); mus.x[a:] = 0; mus.pon(frenado, T_FIN, 1.0)
sfx.pon(pico(sello(), 1.0), V["v10"]["t1"] + 0.35, 0.4)
f = n_(0.6)
for P in (mus, sfx): P.x[-f:] *= np.linspace(1, 0, f)[:, None]

e = envolvente(voz.x, 0.008, 0.2)
mus.x *= (1 - (1 - db(-14)) * np.clip(e * 1.6, 0, 1))[:, None]
sfx.x *= (1 - (1 - db(-9)) * np.clip(e * 1.6, 0, 1))[:, None]
mezcla = master(voz.x + mus.x * 0.75 + sfx.x * 0.62)
escribe(os.path.join(OUT, "mezcla.wav"), mezcla)
for nom, P in (("voz", voz), ("musica", mus), ("efectos", sfx)): escribe(os.path.join(OUT, f"pista-{nom}.wav"), P.x)
json.dump({"acentos": sorted(acentos), "cincuenta": T50, "fin": T_FIN}, open(os.path.join(OUT, "golpes.json"), "w"), indent=1)
print(f"mezcla {len(mezcla)/SR:.2f} s · base desde {T0B:.2f} · 50 % en {T50:.2f} · fin {T_FIN:.2f}")
