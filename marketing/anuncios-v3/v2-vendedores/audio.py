# LA MITAD — banda sonora completa: locución procesada, trap a 140 BPM, diseño sonoro y mezcla.
#
#   python3 v2-vendedores/audio.py
#
# Todo sale de montaje.json. La base es de medio tiempo (compás = 1,714 s) y arranca con el tajo; se para antes
# del «50 %» y vuelve a arrancar exactamente en el «50», con la caja registradora. Escribe audio/mezcla.wav,
# las pistas separadas y audio/golpes.json (para que la imagen golpee con el sonido).
import json, os, sys
import numpy as np, soundfile as sf
AQUI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(AQUI, "..", "comun"))
from sintesis import *

M = json.load(open(os.path.join(AQUI, "montaje.json"), encoding="utf-8"))
DUR = M["duracion"]; V = {f["id"]: f for f in M["voz"]}
def W(fid, palabra):
    return next(p for p in V[fid]["palabras"] if p["w"].lower().strip(",.:¿?") .startswith(palabra.lower()))["t0"]
OUT = os.path.join(AQUI, "audio"); os.makedirs(OUT, exist_ok=True)
BEAT = 60 / M["bpm"]; COMPAS = 4 * BEAT
T_SELLO = 0.02; T_TAJO = M["tajo"]
T50 = W("d4", "50"); ROTURA = (T_TAJO + 11 * COMPAS, T50)       # la base se filtra y se para antes del 50 %
T_FIN = V["e3"]["t1"] + 0.12                                      # tape stop al acabar la última frase
def hz(m): return 440 * 2 ** ((m - 69) / 12)

voz, mus, sfx = Pista(DUR), Pista(DUR), Pista(DUR)
golpes = {}

# ───────────── locución: más brillante, más comprimida, un punto de saturación (es la voz del «anuncio») ─────────────
for f in M["voz"]:
    x, _ = sf.read(os.path.join(AQUI, "voz", f"{f['id']}.wav"), dtype="float32")
    y = cadena_voz(x, hpf=120, presencia=(3500, 2.0), aire=1.0, ratio=4.0, umbral=-22, sala=0.025, satura=0.15)
    voz.pon(y, f["t0"], 1.0)

# ───────────── 0 · el sello: primer fotograma, antes de la primera palabra ─────────────
sfx.pon(pico(sello(), 1.0), T_SELLO, 0.75)
sfx.pon(whoosh(0.25, 6000, 900, 0.3, -0.3), T_SELLO + 0.02, 0.18)
golpes["sello"] = T_SELLO
# «proyecto»: el ticket se sella como CERRADO
t = W("a1", "proyecto"); sfx.pon(pico(sello(), 1.0), t + 0.25, 0.4, 0.2); golpes["cerrado"] = t + 0.25

# ───────────── 1,714 · el tajo parte el ticket y arranca la base ─────────────
sfx.pon(pico(tajo(), 1.0), T_TAJO - 0.05, 0.55, 0.0)
sfx.pon(pico(impacto(1.2, 1.0), 1.0), T_TAJO, 0.35)
golpes["tajo"] = T_TAJO

# armonía de do menor: Cm · Ab · Eb · Bb (i–VI–III–VII); un compás por acorde
prog = [(48, [60, 63, 67]), (44, [60, 63, 68]), (51, [58, 63, 67]), (46, [58, 62, 65])]
ir = ir_sala(1.2, 7000, 0.015, 5)

def compas_base(tb, idx, filtro=None, sin_bombo=False):
    """Un compás de trap en medio tiempo."""
    raiz, ac = prog[idx % 4]
    # 808: nota larga en el 1, repique en el «y» del 2 con deslizamiento a la octava en compases pares
    dur1 = BEAT * 2.4
    b1 = ochocientos(hz(raiz - 12), dur1, None)
    b2 = ochocientos(hz(raiz - 12 + (12 if idx % 2 else 7)), BEAT * 1.3, hz(raiz - 12), 0.06)
    for s_, tt in ((b1, tb), (b2, tb + BEAT * 2.5)):
        mus.pon(pico(s_ if not filtro else lp(s_, filtro), 0.9), tt, 0.5)
    if not sin_bombo:
        for tk in (0, 2.5 if idx % 2 else 1.75):
            mus.pon(pico(bombo(0.35, 180, 50, 1.0, 0.7, 2.0), 1.0), tb + tk * BEAT, 0.55)
    # palmada + caja en el 3 (medio tiempo)
    c = palmada(); c[:n_(0.26)] += caja(0.26, 230) * 0.5
    mus.pon(reverb(pico(c if not filtro else lp(c, filtro), 1.0), ir, 0.15), tb + 2 * BEAT, 0.5, 0.05)
    # hats: corcheas, con redobles en semicorcheas/tresillos al final de cada 2 compases
    for i in range(8):
        tt = tb + i * BEAT / 2
        h = hat(False, 9500)
        mus.pon(pico(h if not filtro else lp(h, filtro), 0.5), tt, 0.22 if i % 2 == 0 else 0.14, 0.3)
    if idx % 2 == 1:
        for j in range(6):   # redoble en tresillo de semicorchea en el último tiempo
            tt = tb + 3 * BEAT + j * BEAT / 6
            mus.pon(pico(hat(False, 10000), 0.5), tt, 0.09 + 0.02 * j, 0.3 - 0.1 * j)
    # acorde: pad oscuro de sierras, abierto solo un poco
    pad = acorde([hz(m) for m in ac], COMPAS, fc=1600 if not filtro else min(1600, filtro), a=0.05, r=0.3)
    mus.pon(reverb(pico(pad, 0.5), ir, 0.3), tb, 0.2, 0, 0.012)
    # campana: una nota por compás, el gancho melódico
    mel = [72, 75, 79, 77][idx % 4]
    mus.pon(reverb(pico(campana(hz(mel), 1.2), 0.5), ir, 0.35), tb + BEAT * 1.5, 0.12, -0.3)

# base del tajo a la rotura
nb = int(round((ROTURA[0] - T_TAJO) / COMPAS))
for b in range(nb):
    compas_base(T_TAJO + b * COMPAS, b)
# rotura (antes del 50 %): la base se va por un filtro y queda solo el 808 respirando + subida
tb = ROTURA[0]; idx = nb
while tb < ROTURA[1] - 0.05:
    compas_base(tb, idx, filtro=500, sin_bombo=True); tb += COMPAS; idx += 1
mus.corta(ROTURA[1] - 0.10, ROTURA[1], 0.02)
mus.pon(pico(subida(ROTURA[1] - ROTURA[0] - 0.1, 300, 10000), 0.9), ROTURA[0], 0.4)

# ───────────── 50 % · caja registradora + impacto + la base vuelve entera ─────────────
sfx.pon(pico(caja_registradora(), 1.0), T50 - 0.01, 0.34, 0.15)
sfx.pon(pico(hp(impacto(2.0, 1.2), 30), 1.0), T50 - 0.06, 0.4)   # justo antes del «50»: no tapa la palabra
sfx.pon(pico(caida_sub(1.0, 70, 32), 1.0), T50, 0.4)
golpes["cincuenta"] = T50
tb = T50; idx = 0
while tb < T_FIN:
    compas_base(tb, idx); tb += COMPAS; idx += 1

# ───────────── acentos de palabra (la tipografía golpea en los mismos instantes) ─────────────
acentos = []
for w in V["b1"]["palabras"]:           # BUSCAMOS / PERSONAS / PARA / VENTAS: un golpe por palabra
    sfx.pon(pico(bombo(0.25, 260, 90, 1.0, 0.6, 2.5), 1.0), w["t0"] - 0.03, 0.28)
    sfx.pon(pico(clic(), 1.0), w["t0"] - 0.03, 0.3, 0.2); acentos.append(w["t0"])
for fid, pal in (("c1", "automatización"), ("c2", "inteligencia"), ("c3", "sistemas")):   # las tres tarjetas
    t = W(fid, pal); sfx.pon(whoosh(0.3, 700, 6000, -0.6, 0.6), t - 0.28, 0.3)
    sfx.pon(pico(bombo(0.3, 200, 60, 1.0, 0.8, 2.0), 1.0), t - 0.02, 0.25); acentos.append(t)
for fid, pal in (("d1", "parte"), ("d2", "nuestra")):                  # pantalla partida: TU PARTE | LA NUESTRA
    t = W(fid, pal); sfx.pon(whoosh(0.35, 500, 5000, -0.9 if fid == "d1" else 0.9, 0.0), t - 0.3, 0.32); acentos.append(t)
t = W("d3", "programar"); sfx.pon(pico(clic(), 1.0), t, 0.3); acentos.append(t)
# CTA: dos avisos de mensaje (Instagram, correo)
for pal in ("instagram", "correo"):
    t = W("e2", pal); sfx.pon(pico(aviso(1318.5 if pal == "instagram" else 1568), 1.0), t, 0.22, 0.2); acentos.append(t)
t = W("e1", "interesa"); sfx.pon(whoosh(0.3, 800, 7000, 0.6, -0.6), t - 0.25, 0.25); acentos.append(t)
# cierre: marca → golpe final y la cinta se frena
t = V["e3"]["t1"] - 0.02; sfx.pon(pico(impacto(1.4, 1.0), 1.0), t, 0.4); golpes["marca"] = t   # al terminar la marca, no encima
a = n_(T_FIN); frenado = tape_stop(mus.x[a:], 0.6); mus.x[a:] = 0; mus.pon(frenado, T_FIN, 1.0)
sfx.pon(pico(sello(), 1.0), T_FIN + 0.55, 0.35); golpes["sello_final"] = T_FIN + 0.55
f = n_(0.6)
for P in (mus, sfx): P.x[-f:] *= np.linspace(1, 0, f)[:, None]

# ───────────── mezcla ─────────────
e = envolvente(voz.x, 0.008, 0.2)
mus.x *= (1 - (1 - db(-14)) * np.clip(e * 1.6, 0, 1))[:, None]
sfx.x *= (1 - (1 - db(-9)) * np.clip(e * 1.6, 0, 1))[:, None]
mezcla = master(voz.x + mus.x * 0.62 + sfx.x * 0.62)
escribe(os.path.join(OUT, "mezcla.wav"), mezcla)
for nom, P in (("voz", voz), ("musica", mus), ("efectos", sfx)): escribe(os.path.join(OUT, f"pista-{nom}.wav"), P.x)
golpes.update({"acentos": [round(x, 3) for x in sorted(acentos)], "rotura": [round(x, 3) for x in ROTURA],
               "compas": COMPAS, "fin": T_FIN})
json.dump(golpes, open(os.path.join(OUT, "golpes.json"), "w"), indent=1)
print(f"mezcla {len(mezcla)/SR:.2f} s · 50 % en {T50:.2f} s · rotura {ROTURA[0]:.2f}–{ROTURA[1]:.2f} · fin {T_FIN:.2f}")
