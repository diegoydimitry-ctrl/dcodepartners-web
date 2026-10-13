# Locución con Kokoro (em_alex, español) generada aquí, sin servicios externos.
# Cada frase se genera aparte; los subtítulos se reparten dentro de la frase por sílabas.
import sherpa_onnx as s, soundfile as sf, numpy as np, json, re
from scipy.signal import resample_poly
K = 'tts/kokoro-multi-lang-v1_0/'
tts = s.OfflineTts(s.OfflineTtsConfig(model=s.OfflineTtsModelConfig(kokoro=s.OfflineTtsKokoroModelConfig(model=K + 'model.onnx', voices=K + 'voices.bin', tokens=K + 'tokens.txt', data_dir=K + 'espeak-ng-data', dict_dir=K + 'dict', lexicon=K + 'lexicon-us-en.txt', lang='es'), num_threads=2)))
SID, VEL = 29, 1.2
# (pausa antes, [(texto en pantalla, texto hablado), ...], escena)
GUION = [
 (0.30, [("En 2020, los científicos cambiaron", "En dos mil veinte, los científicos cambiaron"), ("el nombre de 27 genes humanos.", "el nombre de veintisiete genes humanos.")], "gancho"),
 (0.25, [("No por un descubrimiento.", "No por un descubrimiento.")], "gancho"),
 (0.10, [("Por Excel.", "Por Excel.")], "excel"),
 (0.35, [("Escribe MARCH1 en un Excel en inglés…", "Escribe march uno en un Excel en inglés,")], "demo"),
 (0.05, [("y lo convierte en una fecha.", "y lo convierte en una fecha.")], "demo"),
 (0.15, [("Sin preguntar.", "Sin preguntar.")], "demo"),
 (0.40, [("En 2016, un estudio revisó casi 3.600 artículos", "En dos mil dieciséis, un estudio revisó casi tres mil seiscientos artículos"), ("con listas de genes en Excel.", "con listas de genes en Excel.")], "estudio"),
 (0.15, [("Uno de cada cinco tenía errores.", "Uno de cada cinco tenía errores.")], "estudio"),
 (0.35, [("Al final, fue más fácil renombrar los genes", "Al final, fue más fácil renombrar los genes,"), ("que cambiar la costumbre.", "que cambiar la costumbre.")], "renombre"),
 (0.50, [("Ese mismo año, en Inglaterra,", "Ese mismo año, en Inglaterra,"), ("casi 16.000 positivos de COVID", "casi dieciséis mil positivos de COVID"), ("se quedaron días fuera de las cifras oficiales.", "se quedaron días fuera de las cifras oficiales.")], "filas"),
 (0.30, [("El archivo de Excel…", "El archivo de Excel,")], "filas"),
 (0.05, [("se había quedado sin filas.", "se había quedado sin filas.")], "vacio"),
 (0.70, [("En ninguno de los dos casos falló Excel.", "En ninguno de los dos casos falló Excel.")], "calma"),
 (0.20, [("Hizo exactamente lo que debía.", "Hizo exactamente lo que debía.")], "calma"),
 (0.20, [("Por eso nadie lo vio.", "Por eso nadie lo vio.")], "calma"),
 (0.60, [("Los errores más caros no dan error.", "Los errores más caros no dan error.")], "leccion"),
 (0.30, [("Simplemente, no avisan.", "Simplemente, no avisan.")], "leccion"),
 (0.60, [("Si trabajas con códigos,", "Si trabajas con códigos,"), ("formatea la columna como Texto antes de pegar.", "formatea la columna como texto antes de pegar.")], "truco"),
 (0.60, [("¿Qué parte de tu trabajo depende", "¿Qué parte de tu trabajo depende"), ("de que alguien note algo que nunca avisa?", "de que alguien note algo que nunca avisa?")], "cierre"),
]
def silabas(t): return max(1, len(re.findall(r'[aeiouáéíóúü]+', t.lower())))
SR = 48000; partes = []; t = 0.0; frases = []; subs = []
for pausa, trozos, escena in GUION:
    texto = ' '.join(h for _, h in trozos)
    a = tts.generate(texto, sid=SID, speed=VEL); x = np.array(a.samples, dtype='float64'); x = resample_poly(x, SR, a.sample_rate)
    env = np.abs(x) > 0.012; i0 = max(0, np.argmax(env) - int(0.02 * SR)); i1 = len(x) - np.argmax(env[::-1]) + int(0.06 * SR); x = x[i0:i1]
    t += pausa; partes.append((t, x)); d = len(x) / SR
    frases.append({'t0': round(t, 3), 't1': round(t + d, 3), 'escena': escena, 'texto': texto})
    pesos = np.array([silabas(h) for _, h in trozos], float); cum = np.concatenate([[0], np.cumsum(pesos)]) / pesos.sum()
    for k, (p, _) in enumerate(trozos): subs.append({'t0': round(t + d * cum[k], 3), 't1': round(t + d * cum[k + 1], 3), 'texto': p})
    t += d
dur = t + 0.3
y = np.zeros(int(dur * SR))
for t0, x in partes: a = int(t0 * SR); y[a:a + len(x)] += x
y /= np.abs(y).max() / 0.9
sf.write('audio/voz.wav', y, SR)
json.dump({'duracion_voz': round(dur, 3), 'frases': frases, 'subs': subs}, open('voz.json', 'w'), ensure_ascii=False, indent=1)
print('voz', round(dur, 2), 's'); [print(f"{f['t0']:6.2f}-{f['t1']:6.2f} {f['escena']:9s} {f['texto'][:60]}") for f in frases]
