# ¿SABES VENDER? — banda sonora: la locución (UNA toma continua), un pulso electrónico sobrio y diseño sonoro
# que subraya lo que hace la imagen (el hilo, la partición del 50 %, la lista, el relevo, el cierre).
#
#   python3 v4-comerciales/audio.py
#
# Estructura: 0–5 s el pulso va filtrado (deja el gancho limpio); sube con un barrido y ENTRA ENTERO en el «50»;
# en la llamada final el ritmo se para y queda un acorde abierto con la marca.
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
T50 = W("c4", "50") - 0.1
T_CTA = V["c8"]["t0"] - 0.22
def hz(m): return 440 * 2 ** ((m - 69) / 12)

voz, mus, sfx = Pista(DUR), Pista(DUR), Pista(DUR)
x, _ = sf.read(os.path.join(AQUI, M["toma"]["archivo"]), dtype="float32")
voz.pon(cadena_voz(x, hpf=100, presencia=(3200, 2.0), aire=1.5, ratio=2.5, umbral=-22, sala=0.02), M["toma"]["en"], db(4))
voz.x = compresor(voz.x, umbral_db=-14, ratio=6, ataque=0.002, suelta=0.08, ganancia_db=4)

ir = ir_sala(1.3, 7000, 0.012, 5)
prog_ = [(45, [57, 60, 64, 67]), (41, [57, 60, 65, 69]), (48, [55, 60, 64, 67]), (43, [55, 59, 62, 67])]   # Am7 · F · C · G
def compas(tb, idx, filtro=None, entero=True):
    raiz, ac = prog_[idx % 4]
    for q in range(4):                                     # bombo en negras (4/4), seco
        if entero or q == 0:
            mus.pon(pico(bombo(0.3, 150, 48, 0.9, 0.7, 1.6), 1.0), tb + q * BEAT, 0.42 if entero else 0.25)
    b = saw(hz(raiz - 12), BEAT * 3.6) * env_ad(BEAT * 3.6, 0.01, None, 2.5)
    b = lp(b, filtro or 700); mus.pon(pico(b, 0.9), tb, 0.24)
    if entero:
        for q in (1, 3): mus.pon(reverb(pico(palmada(), 1.0), ir, 0.12), tb + q * BEAT, 0.32, 0.05)
        for i in range(8): mus.pon(pico(hat(False, 10500), 0.5), tb + i * BEAT / 2 + BEAT / 4, 0.12, 0.25 * (-1) ** i)
    pad = acorde([hz(m) for m in ac], COMPAS, fc=filtro or 2400, a=0.08, r=0.3)
    mus.pon(reverb(pico(pad, 0.5), ir, 0.3), tb, 0.13, 0, 0.01)
    # arpegio corto de pulsaciones (pluck) en semicorcheas del último tiempo: da empuje sin tapar la voz
    if entero:
        for j, m in enumerate(ac[:4]): mus.pon(pico(pluck(hz(m + 12), 0.18, 4200), 1.0), tb + 3 * BEAT + j * BEAT / 4, 0.07, 0.4 * (-1) ** j)

# 1 · gancho y propuesta: pulso filtrado
tb, idx = 0.0, 0
while tb < T50 - 0.05:
    compas(tb, idx, filtro=500 + 900 * min(1, tb / T50), entero=False); tb += COMPAS; idx += 1
mus.corta(T50 - 0.12, DUR, 0.03)
mus.pon(pico(subida(1.4, 200, 9000), 0.8), T50 - 1.45, 0.22)
# 2 · desde el «50»: entero, hasta la llamada
tb = T50; idx = 0
while tb < T_CTA - 0.05: compas(tb, idx); tb += COMPAS; idx += 1
mus.corta(T_CTA, DUR, 0.05)
# 3 · llamada: acorde abierto y cola
fin = acorde([hz(m) for m in (57, 64, 69, 71, 76)], DUR - T_CTA, fc=3000, a=0.05, r=1.2)
mus.pon(reverb(pico(fin, 0.5), ir, 0.4), T_CTA, 0.16)

# ─── diseño sonoro ───
sfx.pon(pico(hp(impacto(0.9, 0.7), 40), 1.0), 0.0, 0.25)                                 # golpe seco en el fotograma 0
tv = W("c1", "vender"); sfx.pon(whoosh(0.28, 900, 7000, -0.6, 0.6), tv + 0.02, 0.14)       # el hilo subraya «vender»
sfx.pon(whoosh(0.3, 500, 4500, 0.8, -0.2), V["c2"]["t0"] - 0.3, 0.16)                    # cambio de escena
tc = W("c2", "creciendo")
for i, m in enumerate((72, 76, 79)): sfx.pon(reverb(pico(pluck(hz(m), 0.3, 5200), 1.0), ir, 0.2), tc - 0.1 + i * 0.25, 0.09, 0.2)   # tres escalones
sfx.pon(whoosh(0.25, 3000, 400, 0, 0), T50 - 0.28, 0.2)                                   # el hilo cae por el centro
sfx.pon(pico(impacto(1.8, 1.2), 1.0), T50 - 0.01, 0.42)                                   # la mitad se llena de azul
sfx.pon(pico(caida_sub(1.1, 70, 30), 1.0), T50, 0.26)
sfx.pon(whoosh(0.3, 4000, 600, 0.5, 1.0), V["c5"]["t0"] - 0.3, 0.16)
ta = W("c5", "artificial") - 0.05
for i in range(3): sfx.pon(pico(tecla(), 1.0), ta + i * 0.2, 0.12, -0.2 + 0.2 * i)        # filas del catálogo
tt = W("c7", "tú") - 0.1; sfx.pon(pico(bombo(0.3, 180, 50, 1.0, 0.8, 2.0), 1.0), tt, 0.3); sfx.pon(pico(clic(), 1.0), tt, 0.2)
sfx.pon(whoosh(0.4, 400, 3500, -0.4, 0.4), T_CTA - 0.1, 0.2)                              # el papel sube
sfx.pon(reverb(pico(campana(hz(81), 1.6), 0.6), ir, 0.4), W("c8", "hoy"), 0.07)

f = n_(0.8)
for P in (mus, sfx): P.x[-f:] *= np.linspace(1, 0, f)[:, None]
e = envolvente(voz.x, 0.008, 0.2)
mus.x *= (1 - (1 - db(-13)) * np.clip(e * 1.6, 0, 1))[:, None]
sfx.x *= (1 - (1 - db(-8)) * np.clip(e * 1.6, 0, 1))[:, None]
mezcla = master(limitador(voz.x + mus.x * 0.7 + sfx.x * 0.6, 8.0))
escribe(os.path.join(OUT, "mezcla.wav"), mezcla)
for nom, P in (("voz", voz), ("musica", mus), ("efectos", sfx)): escribe(os.path.join(OUT, f"pista-{nom}.wav"), P.x)
json.dump({"cincuenta": T50, "cta": T_CTA}, open(os.path.join(OUT, "golpes.json"), "w"), indent=1)
print(f"mezcla {len(mezcla)/SR:.2f} s · 50 % en {T50:.2f} · llamada {T_CTA:.2f}")
