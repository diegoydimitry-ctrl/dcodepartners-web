# Locución con Kokoro (em_alex, español) generada aquí, sin servicios externos.
# Cada frase se genera aparte; los subtítulos se reparten dentro de la frase por sílabas.
import sherpa_onnx as s, soundfile as sf, numpy as np, json, re
from scipy.signal import resample_poly
K = 'tts/kokoro-multi-lang-v1_0/'
tts = s.OfflineTts(s.OfflineTtsConfig(model=s.OfflineTtsModelConfig(kokoro=s.OfflineTtsKokoroModelConfig(model=K + 'model.onnx', voices=K + 'voices.bin', tokens=K + 'tokens.txt', data_dir=K + 'espeak-ng-data', dict_dir=K + 'dict', lexicon=K + 'lexicon-us-en.txt', lang='es'), num_threads=2)))
SID, VEL = 29, 1.2
# (pausa antes, [(texto en pantalla, texto hablado), ...], escena)
GUION = [
 (0.25, [("Escribir una sola frase", "Escribir una sola frase"), ("casi triplicó cuántas personas hacían deporte.", "casi triplicó cuántas personas hacían deporte.")], "gancho"),
 (0.45, [("En el Reino Unido,", "En el Reino Unido,"), ("248 personas quieren empezar a entrenar.", "Doscientas cuarenta y ocho personas quieren empezar a entrenar.")], "personas"),
 (0.15, [("Las dividen en tres grupos.", "Las dividen en tres grupos.")], "grupos"),
 (0.25, [("El primero solo apunta lo que hace.", "El primero solo apunta lo que hace.")], "g1"),
 (0.15, [("El segundo lee por qué el ejercicio", "El segundo lee por qué el ejercicio"), ("protege su corazón.", "protege su corazón.")], "g2"),
 (0.15, [("El tercero lee lo mismo…", "El tercero lee lo mismo,"), ("y escribe una frase:", "y escribe una frase:")], "g3"),
 (0.20, [("«La semana que viene entrenaré", "La semana que viene entrenaré"), ("el día tal, a tal hora, en tal sitio.»", "el día tal, a tal hora, en tal sitio.")], "frase"),
 (0.50, [("Resultado: en los dos primeros grupos,", "Resultado: en los dos primeros grupos,"), ("solo uno de cada tres entrenaba cada semana.", "solo uno de cada tres entrenaba cada semana.")], "resultado"),
 (0.25, [("La motivación, sola, no cambió nada.", "La motivación, sola, no cambió nada.")], "resultado"),
 (0.45, [("En el tercero…", "En el tercero,")], "noventa"),
 (0.20, [("el 91 %.", "el noventa y uno por ciento.")], "noventa"),
 (0.55, [("No tenían más ganas.", "No tenían más ganas.")], "ganas"),
 (0.20, [("Tenían un cuándo y un dónde.", "Tenían un cuándo, y un dónde.")], "ganas"),
 (0.45, [("Se ha repetido en casi cien estudios.", "Se ha repetido en casi cien estudios.")], "estudios"),
 (0.45, [("Así que elige eso que llevas", "Así que elige eso que llevas"), ("tiempo aplazando…", "tiempo aplazando,")], "tu"),
 (0.10, [("y escribe ahora el día, la hora", "y escribe ahora el día, la hora,"), ("y el lugar.", "y el lugar.")], "tu"),
 (0.55, [("No necesitas más motivación.", "No necesitas más motivación.")], "final"),
 (0.25, [("Necesitas una cita contigo.", "Necesitas una cita contigo.")], "final"),
]
def silabas(t): return max(1, len(re.findall(r'[aeiouáéíóúü]+', t.lower())))
SR = 48000; partes = []; t = 0.0; frases = []; subs = []
for pausa, trozos, escena in GUION:
    texto = ' '.join(h for _, h in trozos)
    a = tts.generate(texto, sid=SID, speed=VEL); x = np.array(a.samples, dtype='float64'); x = resample_poly(x, SR, a.sample_rate)
    env = np.abs(x) > 0.012; i0 = max(0, np.argmax(env) - int(0.07 * SR)); i1 = len(x) - np.argmax(env[::-1]) + int(0.06 * SR); x = x[i0:i1]
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
