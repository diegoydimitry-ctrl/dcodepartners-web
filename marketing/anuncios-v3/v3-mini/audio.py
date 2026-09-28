# EN AUTOMÁTICO — banda sonora del mini de YouTube: locución, diseño sonoro y un pulso mínimo. Todo desde montaje.json.
#
#   python3 v3-mini/audio.py
#
# Gancho: clics de ratón y teclado en seco (trabajo a mano), con una tensión que sube. Marca: el píxel llena la
# pantalla con un barrido y cae un golpe con sub justo antes de «D-Code». Propuesta: arranca un pulso a 124 BPM y
# cada tarea que se completa sola suena como una nota de una escala ascendente. Cierre: golpe suave y cola.
# Escribe audio/golpes.json (clics y completados) para que la imagen use los mismos instantes.
import json, os, sys
import numpy as np, soundfile as sf
AQUI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(AQUI, "..", "comun"))
from sintesis import *

M = json.load(open(os.path.join(AQUI, "montaje.json"), encoding="utf-8"))
DUR = M["duracion"]; V = {f["id"]: f for f in M["voz"]}
def W(fid, palabra):
    return next((p["t0"] for p in V[fid]["palabras"] if p["w"].lower().strip(",.:¿?%").startswith(palabra.lower())), V[fid]["t0"])
OUT = os.path.join(AQUI, "audio"); os.makedirs(OUT, exist_ok=True)
BEAT = 60 / M["bpm"]
T_MARCA = V["m2"]["t0"] - 0.28; T_PROP = V["m3"]["t0"] - 0.12; T_FIN = V["m3"]["t1"] + 0.18
def hz(m): return 440 * 2 ** ((m - 69) / 12)

# instantes compartidos con la imagen
clics, t, prev, r = [], 0.42, -1, np.random.default_rng(5)
while t < V["m1"]["t1"] - 0.08:
    i = int(r.integers(12))
    while i == prev: i = int(r.integers(12))
    clics.append({"t": round(t, 3), "i": i}); prev = i; t += 0.17 + 0.05 * r.random()
t_a, t_b = W("m3", "tu") + 0.05, V["m3"]["t1"] - 0.05
orden = [0, 5, 10, 3, 6, 9, 1, 4, 11, 2, 7, 8]
checks = [{"t": round(t_a + (t_b - t_a) * (k / 11) ** 0.85, 3), "i": orden[k]} for k in range(12)]

voz, mus, sfx = Pista(DUR), Pista(DUR), Pista(DUR)
for f in M["voz"]:
    x, _ = sf.read(os.path.join(AQUI, "voz", f"{f['id']}.wav"), dtype="float32")
    voz.pon(cadena_voz(x, hpf=110, presencia=(3400, 2.5), aire=1.5, ratio=3.0, umbral=-22, sala=0.025), f["t0"], db(4))   # la voz manda (+4 dB)

# las crestas de la voz (oclusivas de ElevenLabs v3) se recortan para que la voz pueda sonar alta sin picos
voz.x = compresor(voz.x, umbral_db=-14, ratio=8, ataque=0.002, suelta=0.08)
# 1 · gancho: trabajo a mano
for k, q in enumerate(clics):
    sfx.pon(pico(clic(), 1.0), q["t"], 0.32, 0.4 * (-1) ** k)
    if k % 2 == 0:
        for j in range(3): sfx.pon(pico(tecla(), 1.0), q["t"] + 0.05 + 0.035 * j, 0.12, -0.3)
ir = ir_sala(1.4, 6500, 0.015, 5)
ten = acorde([hz(m) for m in (45, 52, 57, 60)], T_MARCA + 0.1, fc=900, a=0.6, r=0.1)
mus.pon(reverb(pico(ten, 0.5), ir, 0.3), 0.0, 0.16)
mus.pon(pico(subida(T_MARCA - 0.9, 250, 7000), 0.8), 0.9, 0.18)

# 2 · marca
sfx.pon(whoosh(0.35, 600, 7000, 0.8, -0.2), T_MARCA - 0.05, 0.4)
sfx.pon(pico(impacto(1.6, 1.2), 1.0), T_MARCA + 0.22, 0.3)
sfx.pon(pico(caida_sub(1.0, 75, 30), 1.0), T_MARCA + 0.22, 0.22)
sfx.pon(reverb(pico(campana(hz(81), 1.6), 0.6), ir, 0.4), W("m2", "partners"), 0.10, 0.2)

# 3 · propuesta: pulso + escala ascendente por cada tarea completada
tb, n = T_PROP, 0
while tb < T_FIN + 0.1:
    mus.pon(pico(bombo(0.35, 170, 48, 1.0, 0.8, 1.8), 1.0), tb, 0.28)
    mus.pon(pico(hat(False, 10000), 0.5), tb + BEAT / 2, 0.14, 0.3)
    if n % 2 == 1:
        cp = palmada(); mus.pon(reverb(pico(cp, 1.0), ir, 0.15), tb, 0.3, 0.05)
    tb += BEAT; n += 1
pad = acorde([hz(m) for m in (57, 64, 69, 73, 76)], T_FIN - T_PROP + 0.6, fc=2600, a=0.08, r=0.4)
mus.pon(reverb(pico(pad, 0.5), ir, 0.35), T_PROP, 0.16)
escala = [69, 71, 73, 76, 78, 81, 83, 85, 88, 90, 93, 95]
for k, q in enumerate(checks):
    sfx.pon(reverb(pico(pluck(hz(escala[k]), 0.3, 5200), 1.0), ir, 0.2), q["t"], 0.16, 0.5 * ((k % 3) - 1))

# 4 · cierre
sfx.pon(whoosh(0.35, 400, 4000, -0.3, 0.3), T_FIN - 0.1, 0.25)
sfx.pon(pico(impacto(1.8, 0.8), 1.0), T_FIN + 0.3, 0.3)
sfx.pon(reverb(pico(campana(hz(81), 1.8), 0.6), ir, 0.45), T_FIN + 0.5, 0.12)
a = n_(T_FIN + 0.3); mus.x[a:] *= np.linspace(1, 0, len(mus.x) - a)[:, None] ** 0.5
f = n_(0.5)
for P in (mus, sfx): P.x[-f:] *= np.linspace(1, 0, f)[:, None]

# la marca, limpia: todo se aparta mientras se dice «D-Code Partners»
a, b, f = n_(V["m2"]["t0"] - 0.05), n_(V["m2"]["t1"] + 0.05), n_(0.12)
g = np.ones(len(mus.x)); g[a:b] = db(-12); g[a - f:a] = np.linspace(1, db(-12), f); g[b:b + f] = np.linspace(db(-12), 1, f)
mus.x *= g[:, None]
e = envolvente(voz.x, 0.008, 0.2)
mus.x *= (1 - (1 - db(-14)) * np.clip(e * 1.6, 0, 1))[:, None]
sfx.x *= (1 - (1 - db(-9)) * np.clip(e * 1.6, 0, 1))[:, None]
mezcla = master(limitador(voz.x + mus.x * 0.75 + sfx.x * 0.62, 9.0))   # crestas −9 dB: −14 LUFS sin pasar de −1 dBTP
escribe(os.path.join(OUT, "mezcla.wav"), mezcla)
for nom, P in (("voz", voz), ("musica", mus), ("efectos", sfx)): escribe(os.path.join(OUT, f"pista-{nom}.wav"), P.x)
json.dump({"clics": clics, "checks": checks, "marca": T_MARCA, "fin": T_FIN}, open(os.path.join(OUT, "golpes.json"), "w"), indent=1)
print(f"mezcla {len(mezcla)/SR:.2f} s · {len(clics)} clics · 12 tareas de {checks[0]['t']:.2f} a {checks[-1]['t']:.2f} · cierre {T_FIN:.2f}")
