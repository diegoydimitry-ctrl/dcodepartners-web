# Captación de comerciales (versión final) — banda sonora: la locución (UNA toma continua), un pulso electrónico
# sobrio y diseño sonoro atado a lo que hace la imagen.
#
#   python3 v5-comerciales/audio.py
#
# Estructura: gancho con el pulso filtrado → entra el ritmo con «D-Code Partners» → se abre antes del «50» con un
# barrido y el 50 cae con golpe y sub → en «¿Hablamos?» el ritmo se para y queda un acorde abierto.
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
T_RITMO = V["c2"]["t0"] - 0.12          # entra el ritmo con el cambio de escena
T50 = W("c5", "50") - 0.1
T_CTA = V["c6"]["t0"] - 0.12
def hz(m): return 440 * 2 ** ((m - 69) / 12)

voz, mus, sfx = Pista(DUR), Pista(DUR), Pista(DUR)
x, _ = sf.read(os.path.join(AQUI, M["toma"]["archivo"]), dtype="float32")
voz.pon(cadena_voz(x, hpf=90, presencia=(3200, 2.0), aire=1.5, ratio=2.5, umbral=-22, sala=0.02), M["toma"]["en"], db(3))
voz.x = compresor(voz.x, umbral_db=-16, ratio=4, ataque=0.003, suelta=0.1, ganancia_db=3)

ir = ir_sala(1.3, 7000, 0.012, 5)
prog_ = [(45, [57, 60, 64, 67]), (41, [57, 60, 65, 69]), (48, [55, 60, 64, 67]), (43, [55, 59, 62, 67])]   # Am7 · F · C · G
def compas(tb, idx, filtro=None, nivel=1, fin=None):
    """nivel 0: solo bombo en el 1 y bajo filtrado · 1: groove sin palmas · 2: groove completo"""
    raiz, ac = prog_[idx % 4]
    for q in range(4):
        if nivel >= 1 or q == 0:
            if fin is None or tb + q * BEAT < fin - 0.02:
                mus.pon(pico(bombo(0.3, 150, 48, 0.9, 0.7, 1.6), 1.0), tb + q * BEAT, 0.42 if nivel else 0.25)
    b = saw(hz(raiz - 12), BEAT * 3.6) * env_ad(BEAT * 3.6, 0.01, None, 2.5)
    mus.pon(pico(lp(b, filtro or (700 if nivel < 2 else 900)), 0.9), tb, 0.24)
    if nivel >= 1:
        for i in range(8): mus.pon(pico(hat(False, 10500), 0.5), tb + i * BEAT / 2 + BEAT / 4, 0.1 if nivel == 1 else 0.12, 0.25 * (-1) ** i)
    if nivel >= 2:
        for q in (1, 3): mus.pon(reverb(pico(palmada(), 1.0), ir, 0.12), tb + q * BEAT, 0.3, 0.05)
        for j, m in enumerate(ac[:4]): mus.pon(pico(pluck(hz(m + 12), 0.18, 4200), 1.0), tb + 3 * BEAT + j * BEAT / 4, 0.07, 0.4 * (-1) ** j)
    pad = acorde([hz(m) for m in ac], COMPAS, fc=filtro or 2400, a=0.08, r=0.3)
    mus.pon(reverb(pico(pad, 0.5), ir, 0.3), tb, 0.12, 0, 0.01)

# 1 · gancho: pulso filtrado
tb, idx = 0.0, 0
while tb < T_RITMO - 0.05: compas(tb, idx, filtro=500 + 600 * min(1, tb / T_RITMO), nivel=0); tb += COMPAS; idx += 1
mus.corta(T_RITMO - 0.05, DUR, 0.03)
# 2 · desde «D-Code Partners» hasta el 50: groove sin palmas (deja la voz delante)
tb = T_RITMO; idx = 0
while tb < T50 - 0.05: compas(tb, idx, nivel=1, fin=T50 - 0.6); tb += COMPAS; idx += 1
mus.corta(T50 - 0.6, DUR, 0.08)                              # hueco de medio segundo antes de la cifra
mus.pon(pico(subida(1.3, 200, 9000), 0.8), T50 - 1.35, 0.2)
# 3 · desde el «50»: completo, hasta la llamada
tb = T50; idx = 0
while tb < T_CTA - 0.05: compas(tb, idx, nivel=2); tb += COMPAS; idx += 1
mus.corta(T_CTA, DUR, 0.05)
# 4 · llamada: acorde abierto y cola
fin = acorde([hz(m) for m in (57, 64, 69, 71, 76)], DUR - T_CTA, fc=3000, a=0.05, r=1.2)
mus.pon(reverb(pico(fin, 0.5), ir, 0.4), T_CTA, 0.16)

# ─── diseño sonoro (cada sonido corresponde a un gesto de la imagen) ───
sfx.pon(pico(hp(impacto(0.9, 0.7), 40), 1.0), 0.0, 0.22)                                  # fotograma 0
tO = W("c1", "oportunidades") - 0.1
for i, m in enumerate((76, 79, 83, 81, 84, 79, 88, 86)):                                   # los nodos que se encienden
    sfx.pon(reverb(pico(pluck(hz(m), 0.25, 5200), 1.0), ir, 0.25), tO + 0.05 + i * 0.09, 0.05, (-0.6, 0.5, -0.2, 0.7, -0.7, 0.3, 0.1, -0.4)[i])
sfx.pon(whoosh(0.3, 500, 4500, 0.8, -0.2), V["c2"]["t0"] - 0.3, 0.15)                     # cambio de escena
tc = W("c2", "creciendo")
for i, m in enumerate((72, 76, 79)): sfx.pon(reverb(pico(pluck(hz(m), 0.3, 5200), 1.0), ir, 0.2), tc - 0.05 + i * 0.25, 0.08, 0.2)   # la línea sube
sfx.pon(whoosh(0.3, 4000, 600, 0.5, 1.0), V["c3"]["t0"] - 0.3, 0.14)
tCo, tCl = W("c3", "conectas"), W("c3", "cliente")
sfx.pon(whoosh(0.5, 800, 3000, -0.7, 0.7), tCo, 0.08)                                      # la conexión cruza
sfx.pon(pico(clic(), 1.0), tCl + 0.6, 0.16)                                                # el pulso llega al cliente
for i in range(4): sfx.pon(pico(tecla(), 1.0), tCl + 0.2 + (W("c3", "venta") + 0.1 - tCl - 0.2) * (i + 1) / 4 - 0.02, 0.09, -0.3 + 0.2 * i)   # fases
sfx.pon(reverb(pico(campana(hz(84), 1.0), 0.6), ir, 0.3), W("c3", "venta"), 0.06)          # venta cerrada
sfx.pon(whoosh(0.35, 400, 3500, -0.4, 0.4), V["c4"]["t0"] - 0.25, 0.14)
tCo4, tSo = W("c4", "construimos"), W("c4", "solución")
sfx.pon(whoosh(0.4, 300, 2500, 0.3, -0.3), tCo4 + 0.05, 0.1); sfx.pon(whoosh(0.4, 300, 2500, -0.3, 0.3), tSo - 0.05, 0.1)   # pantallas
sfx.pon(whoosh(0.2, 3000, 400, 0, 0), T50 - 0.2, 0.2)                                    # la línea cae
sfx.pon(pico(impacto(1.8, 1.2), 1.0), T50 - 0.01, 0.3)                                    # la mitad se llena de azul
sfx.pon(pico(caida_sub(1.1, 70, 30), 1.0), T50, 0.2)
sfx.pon(whoosh(0.4, 400, 3500, -0.4, 0.4), T_CTA - 0.1, 0.2)                               # el papel sube
sfx.pon(reverb(pico(campana(hz(81), 1.6), 0.6), ir, 0.4), W("c6", "hablamos") + 0.3, 0.07)

f = n_(0.8)
for P in (mus, sfx): P.x[-f:] *= np.linspace(1, 0, f)[:, None]
e = envolvente(voz.x, 0.008, 0.2)
mus.x *= (1 - (1 - db(-13)) * np.clip(e * 1.6, 0, 1))[:, None]
sfx.x *= (1 - (1 - db(-8)) * np.clip(e * 1.6, 0, 1))[:, None]
mezcla = master(limitador(voz.x + mus.x * 0.7 + sfx.x * 0.6, 8.0))
escribe(os.path.join(OUT, "mezcla.wav"), mezcla)
for nom, P in (("voz", voz), ("musica", mus), ("efectos", sfx)): escribe(os.path.join(OUT, f"pista-{nom}.wav"), P.x)
json.dump({"ritmo": T_RITMO, "cincuenta": T50, "cta": T_CTA}, open(os.path.join(OUT, "golpes.json"), "w"), indent=1)
print(f"mezcla {len(mezcla)/SR:.2f} s · ritmo {T_RITMO:.2f} · 50 % en {T50:.2f} · llamada {T_CTA:.2f}")
