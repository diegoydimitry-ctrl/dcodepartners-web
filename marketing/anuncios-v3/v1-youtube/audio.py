# RUIDO — banda sonora completa: locución procesada, música, diseño sonoro y mezcla.
#
#   python3 v1-youtube/audio.py
#
# Todo está colocado a partir de montaje.json (los tiempos de la voz): la música se escribe alrededor de la
# locución, no al revés. Escribe audio/mezcla.wav (y las pistas separadas) y audio/cortes.json con los cortes
# del gancho, para que la imagen corte exactamente donde golpea el sonido.
import json, os, sys
import numpy as np, soundfile as sf
AQUI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(AQUI, "..", "comun"))
from sintesis import *

M = json.load(open(os.path.join(AQUI, "montaje.json"), encoding="utf-8"))
DUR = M["duracion"]; V = {f["id"]: f for f in M["voz"]}
OUT = os.path.join(AQUI, "audio"); os.makedirs(OUT, exist_ok=True)
BEAT = 60 / M["bpm"]; G0 = M["rejilla"]           # 0,5 s; el golpe de transformación en 15,4
SIL0, SIL1 = M["silencio"]                         # negro y silencio: 4,30 → 4,80
def hz(m): return 440 * 2 ** ((m - 69) / 12)

voz, mus, sfx = Pista(DUR), Pista(DUR), Pista(DUR)

# ───────────── locución ─────────────
for f in M["voz"]:
    x, _ = sf.read(os.path.join(AQUI, "voz", f"{f['id']}.wav"), dtype="float32")
    gancho = f["id"].startswith("h")
    y = cadena_voz(x, hpf=90, presencia=(4000, 3.0), aire=2.0, ratio=3.0, calor=1.5,
                   sala=0.03 if gancho else 0.05, satura=0.25 if gancho else 0.0)
    voz.pon(y, f["t0"], 1.0)

# ───────────── 0 → 4,3 · el gancho: percusión hecha con sonidos de oficina ─────────────
# Cada palabra del gancho cae en un tiempo; entre dos palabras, cuatro semicorcheas. Los microplanos de la imagen
# cortan en esas mismas semicorcheas.
golpes = [V[k]["t0"] for k in ("h1", "h2", "h3", "h4", "h5")] + [SIL0]
cortes = []
oficina = [tecla, clic, aviso, tecla, vibracion, clic, obturador, tecla]
k = 0
for i in range(len(golpes) - 1):
    a, b = golpes[i], golpes[i + 1]; paso = (b - a) / 4
    for j in range(4):
        t = a + j * paso; cortes.append(round(t, 3))
        s = oficina[k % len(oficina)](); k += 1
        if j == 0: continue            # en el ataque de la palabra solo bombo: la voz necesita ese hueco
        if i == 0 and j != 2: continue # la primera palabra casi sola: el ritmo se va sumando
        pan = [-0.6, 0.5, -0.2, 0.7, 0.0, -0.7, 0.3, 0.6][k % 8]
        sfx.pon(pico(s if np.ndim(s) == 1 else s, 0.5), t, 0.55 + 0.1 * (j == 2), pan)
        if j == 2: sfx.pon(pico(hat(), 0.4), t, 0.5, 0.3)
        if j in (1, 3): sfx.pon(pico(hat(), 0.4), t, 0.3, -0.3)
    mus.pon(pico(hp(bombo(0.4, 170, 44, drive=2.4), 35), 1.0), a - 0.07, 0.8)   # el golpe lanza la palabra: no tapa su consonante
    mus.pon(pico(caja(0.22, 210), 1.0), a + 2 * paso, 0.45, 0.0)
# en el último tramo se aprieta: redoble de clics en fusas (el nervio sube)
a = V["h5"]["t0"]
for j in range(12):
    sfx.pon(pico(clic(), 0.5), a + j * (SIL0 - a) / 12, 0.35 + 0.03 * j, (-1) ** j * 0.5)
# bajo distorsionado y nota disonante que sube de tensión
for i, t in enumerate(golpes[:-1]):
    d = golpes[i + 1] - t
    b = sat(saw(hz(33 + [0, 0, 1, 0, 1][i]), d) * env_adsr(d, 0.004, 0.1, 0.6, 0.05), 2.5)
    mus.pon(pico(lp(b, 900), 0.8), t - 0.07, 0.3)
mus.pon(pico(subida(SIL0 - 0.2, 400, 11000), 0.8), 0.2, 0.4)
# la cinta se frena al final del gancho (se aplica sobre lo ya sonado)
t_ts = V["h5"]["t1"] - 0.05
for P in (mus, sfx):
    a, b = n_(t_ts), n_(SIL0)
    frenado = tape_stop(P.x[a:], SIL0 - t_ts + 0.3)
    P.x[a:b] = 0; P.x[a:a + len(frenado)][:b - a] += frenado[:b - a]
for P in (mus, sfx, voz): P.corta(SIL0, SIL1, 0.01)     # SILENCIO REAL: ni cola de reverb

# ───────────── 4,8 · «Esto no es trabajo.» ─────────────
mus.pon(pico(caida_sub(1.6, 85, 28), 1.0), SIL1, 0.9)
sfx.pon(pico(impacto(2.4, 1.2), 1.0), SIL1, 0.55)
# «Es ruido.»: golpe con tartamudeo, la palabra «vibra» en pantalla
t = V["l2"]["t0"]
g = pico(sat(hp(ruido(0.09), 900) * env_ad(0.09, 0.001, None, 6), 3), 0.8)
sfx.pon(tartamudeo(g, 0.03, 5), t + 0.02, 0.35, 0.2)
sfx.pon(pico(bombo(0.5, 120, 40, drive=3), 1.0), t, 0.6)

# ───────────── 7,4 → 15,4 · el problema ─────────────
# dron grave (La), reloj a corcheas y avisos desafinados; todo sube hacia el golpe.
t0p, t1p = 7.4, G0
d = t1p - t0p
dron = (voz_saw(hz(33), d, 0.18, 5) + voz_saw(hz(40), d, 0.2, 3) * 0.5)
dron = barrido(dron, 140, 700, "lp", 1.1, 40) * env_adsr(d, 1.5, 0.1, 1.0, 0.3)
mus.pon(pico(dron, 0.7), t0p, 0.34, 0.0, 0.012)
nt = int(round(d / (BEAT / 2)))
for i in range(nt):
    t = t0p + i * BEAT / 2
    sfx.pon(pico(hat(False, 5500 if i % 2 else 7000), 0.5), t, 0.16 + 0.1 * (i % 2 == 0), 0.35 * (-1) ** i)
    if i % 4 == 0: mus.pon(pico(bombo(0.35, 110, 42, 0.3, 0.8, 1.2), 1.0), t, 0.32)
# avisos desafinados: una «notificación» que ya no suena bien, en cada frase del problema
for key, f0 in (("l3", 1046.5 * 0.97), ("l4", 1174.7 * 1.03), ("l5", 987.8 * 0.955)):
    for w in V[key]["palabras"][::2]:
        sfx.pon(pico(aviso(f0 * (1 + 0.02 * np.sin(len(w["w"])))), 0.4), w["t0"], 0.14, np.sin(w["t0"] * 3) * 0.7)
# subida hacia la transformación y un vacío de 120 ms justo antes del golpe
mus.pon(pico(subida(2.2, 250, 12000), 0.9), G0 - 2.3, 0.45)
sfx.pon(whoosh(1.0, 400, 6000, -0.9, 0.9), G0 - 1.05, 0.35)
for P in (mus, sfx): P.corta(G0 - 0.12, G0, 0.03)

# ───────────── 15,4 · golpe de transformación y groove ─────────────
sfx.pon(pico(impacto(1.5, 1.0), 1.0), G0, 0.55)
sfx.pon(pico(campana(hz(81), 1.6), 1.0), G0, 0.15, -0.3)
sfx.pon(pico(campana(hz(88), 1.6), 1.0), G0 + 0.01, 0.12, 0.3)
ir = ir_sala(1.8, 6500, 0.02)

# armonía: Fmaj9 · Am9 · Dm9 · G6/9 → el color «claro» (mayor, abierto), 2 compases cada uno
prog = [[53, 57, 60, 64, 67], [57, 60, 64, 67, 71], [50, 57, 60, 64, 65], [55, 59, 62, 64, 69]]
bajos = [41, 45, 38, 43]
FIN_GROOVE = 37.4; ROTURA = (31.4, 34.4)
barra = 4 * BEAT
nb = int(round((FIN_GROOVE - G0) / barra))
for b in range(nb):
    tb = G0 + b * barra; ac = prog[(b // 2) % 4]; bj = bajos[(b // 2) % 4]
    en_rotura = ROTURA[0] <= tb < ROTURA[1]
    entrada = b < 2          # los dos primeros compases, bajo la frase de marca: solo bombo, palmada y acorde
    # acordes: largos, a la izquierda y a la derecha
    if b % 2 == 0:
        c = acorde([hz(m) for m in ac], barra * 2, fc=2600 if not en_rotura else 1200, a=0.03, r=0.6)
        mus.pon(reverb(pico(c, 0.6), ir, 0.25), tb, 0.30, 0, 0)
    for q in range(4):
        tq = tb + q * BEAT
        if not en_rotura:
            mus.pon(pico(bombo(0.38, 150, 45, 0.8, 1.0, 1.5), 1.0), tq, 0.72)
            if q in (1, 3): mus.pon(reverb(pico(palmada(), 1.0), ir, 0.18), tq, 0.34, 0.1)
            # bajo a contratiempo
            if entrada: continue
            bl = saw(hz(bj), BEAT / 2 * 0.9) * env_adsr(BEAT / 2 * 0.9, 0.003, 0.06, 0.6, 0.05)
            mus.pon(pico(lp(sat(bl, 1.6), 700), 0.8), tq + BEAT / 2, 0.42)
        for s16 in range(4):
            ts = tq + s16 * BEAT / 4
            if entrada: continue
            if not en_rotura or s16 == 2:
                v = [0.10, 0.06, 0.16, 0.06][s16]
                mus.pon(pico(hat(s16 == 2 and q == 3, 9000), 0.5), ts, v * 1.4, 0.4 * (-1) ** s16)
            # arpegio: el «pulso azul» que recorre las conexiones
            nota = ac[[0, 2, 4, 3, 1, 2, 4, 3][(q * 4 + s16) % 8]] + 12
            mus.pon(reverb(pico(pluck(hz(nota), 0.28, 3500 if not en_rotura else 1500), 0.5), ir, 0.3), ts,
                    0.10 if not en_rotura else 0.13, 0.5 * np.sin(ts * 2.1), 0.009)
# golpes con las palabras clave del bloque de transformación
for key in ("l7", "l8", "l9"):
    t = V[key]["palabras"][0]["t0"]
    sfx.pon(pico(bombo(0.5, 180, 50, 1.0, 1.0, 2.2), 1.0), t, 0.28)
    sfx.pon(whoosh(0.32, 900, 7000, -0.5, 0.5), t - 0.3, 0.22)
# procesos · datos · herramientas: un «clic» de conexión en cada una
for w in V["l9"]["palabras"]:
    if w["w"].strip(",.:").lower() in ("procesos", "datos", "herramientas"):
        sfx.pon(pico(campana(hz(93), 0.6), 1.0), w["t0"], 0.12, 0.3)
        sfx.pon(pico(clic(), 1.0), w["t0"], 0.35)
# «usar inteligencia artificial» se tacha: raspado; «funcione mejor»: la batería vuelve con un golpe
t = V["l11"]["palabras"][-1]["t1"] - 0.1
sfx.pon(pico(barrido(ruido(0.35), 5000, 1200, "bp", 3, 12) * env_ad(0.35, 0.01, None, 3), 0.8), t, 0.28, 0.3)
mus.pon(pico(subida(1.0, 600, 9000, False), 0.8), ROTURA[1] - 1.0, 0.3)
sfx.pon(pico(impacto(1.6, 0.8), 1.0), ROTURA[1], 0.45)

# ───────────── 37,4 → 43 · cierre ─────────────
t = FIN_GROOVE
fin = acorde([hz(m) for m in (41, 53, 57, 60, 64, 67, 72)], DUR - t, fc=2000, a=0.02, r=2.5)
mus.pon(reverb(pico(fin, 0.7), ir_sala(3.0, 5000, 0.03), 0.35), t, 0.34)
mus.pon(pico(caida_sub(3.0, 60, 40), 1.0), t, 0.5)
sfx.pon(whoosh(0.9, 5000, 300, 0.8, -0.8), t - 0.5, 0.25)           # el sistema se recoge…
tick = V["l13"]["t0"] - 0.05                                            # …y el píxel azul se posa
sfx.pon(reverb(pico(campana(hz(96), 2.0), 1.0), ir_sala(2.2, 9000, 0.02), 0.35), tick, 0.32, 0.15)
sfx.pon(pico(clic(), 1.0), tick, 0.5)
sfx.pon(pico(campana(hz(91), 1.8), 1.0), V["l14"]["t0"], 0.12, -0.2)
# fundido final
f = n_(1.3)
for P in (mus, sfx): P.x[-f:] *= np.linspace(1, 0, f)[:, None] ** 2

# ───────────── mezcla ─────────────
# compresión lateral: la música baja ~12 dB cuando habla la voz (en el gancho ~8 dB: allí la voz también es ritmo)
e = envolvente(voz.x, 0.01, 0.25)
prof = np.where(np.arange(len(e)) < n_(SIL0), db(-8), db(-12))
g = 1 - (1 - prof) * np.clip(e * 1.6, 0, 1)
mus.x *= g[:, None]; sfx.x *= (1 - (1 - db(-9)) * np.clip(e * 1.6, 0, 1))[:, None]
mezcla = voz.x * 1.0 + mus.x * 0.62 + sfx.x * 0.62
mezcla = master(mezcla)
mezcla[n_(SIL0):n_(SIL1)] = 0.0                                          # el silencio, garantizado
escribe(os.path.join(OUT, "mezcla.wav"), mezcla)
for nom, P in (("voz", voz), ("musica", mus), ("efectos", sfx)): escribe(os.path.join(OUT, f"pista-{nom}.wav"), P.x)
json.dump({"cortes": cortes, "golpe": G0, "rotura": ROTURA, "fin_groove": FIN_GROOVE, "tick": tick,
           "silencio": [SIL0, SIL1]}, open(os.path.join(OUT, "cortes.json"), "w"), indent=1)
print(f"mezcla {len(mezcla)/SR:.2f} s · {len(cortes)} cortes en el gancho · pico {np.abs(mezcla).max():.3f}")
