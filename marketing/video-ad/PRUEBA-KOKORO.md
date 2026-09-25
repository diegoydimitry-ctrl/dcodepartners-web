# Prueba de Kokoro local para la locución — resultado

Se instaló y probó Kokoro (`npx hyperframes tts`, motor Kokoro-82M en local, sin
cuenta ni nube) como posible sustituto de una locución humana o de un servicio
de pago. Resultado: **funciona técnicamente, pero no encaja igual en los dos
anuncios** — se explica por qué abajo. No se ha adoptado como flujo por
defecto; queda como herramienta opcional, ya integrada, a la espera de que se
escuchen las muestras y se decida.

## Lo que se instaló

- `espeak-ng` (paquete del sistema — el fonemizador que usa Kokoro para
  idiomas no ingleses).
- `kokoro-onnx` + `soundfile` (paquetes de Python — el motor de síntesis).

Ambos ya están en la máquina de este entorno de trabajo; en otra habría que
repetir la instalación. La primera vez que se usa una voz, descarga ~27 MB de
datos del modelo (una sola vez, se queda en caché).

## Voces en español encontradas

| Voz | Género | Estado |
|---|---|---|
| `ef_dora` | mujer | En el catálogo oficial de la CLI. |
| `em_alex` | hombre | Funciona, pero **no aparece en el catálogo oficial** (`hyperframes tts --list`) — es parte del conjunto de 54 voces de Kokoro-82M, accesible por ID aunque no esté documentada. Los dos guiones piden voz masculina, así que las pruebas usan esta. |

## Validación técnica (objetiva)

Audio limpio en las dos voces: 24 kHz mono, sin clipping, sin cortes, silencio
inicial mínimo. Antes de escuchar nada, el archivo en sí no tiene defectos
técnicos.

**No pude verificar la inteligibilidad con una transcripción automática de
control** (habría sido la comprobación más objetiva: generar audio, pasarlo
por Whisper y comparar contra el texto original). El entorno bloquea la
descarga del modelo de Whisper local (403 desde el proxy). No es un fallo de
Kokoro, es una limitación de este espacio de trabajo concreto.

**Lo que no puedo evaluar yo: si suena natural.** No tengo manera de escuchar
audio. Lo que sigue es medible (duración, ajuste al hueco de cada frase); el
veredicto sobre si la voz suena bien tiene que ser tuyo.

## Ajuste al ritmo de cada guion — aquí está la diferencia real

Se generó la locución completa de los dos anuncios (`em_alex`, `--speed 1.1`,
dentro del rango que la propia documentación de Kokoro considera razonable)
y se comparó cada clip contra el hueco de tiempo que tiene asignado en el
guion.

**Anuncio 1** — encaja razonablemente bien:

| Resultado | Fragmentos |
|---|---|
| Dentro del hueco | 5 de 8 |
| Se pasa, pero por poco (8–13%, 0,15–0,59 s) | 3 de 8 |

Nada grave: ensanchar un poco esas tres ventanas en el guion (o recortar
ligeramente el texto) lo dejaría encajando del todo.

**Anuncio 2 — no encaja.** 9 de 13 fragmentos superan su hueco, algunos por
mucho: el peor, un 58% más largo de lo previsto (3,95 s de audio para una
ventana de 2,50 s); otro, un 74% (3,31 s para 1,90 s). En el montaje de
prueba, un fragmento llega a solaparse con el siguiente.

**Por qué pasa esto, y por qué no es un fallo del motor:** «Llamar a Javier»
está construido sobre golpes cómicos muy cortos —GUION-2.md lo dice
explícitamente: «el narrador no está contando un chiste, está constatando un
hecho», con silencios y remates secos—. Los huecos de ese guion (1,25–2,10 s
para una frase suelta) están pensados para una lectura de humor seco, casi
entrecortada. Kokoro lee con la cadencia uniforme de una síntesis de voz
normal, no con el corte de un cómico — así que una frase como «47 pestañas.
Porque 46 eran pocas.» (guion: 1,90 s) sale en 3,31 s, casi el doble.

Subir la velocidad no lo resuelve sin coste: la propia documentación de
Kokoro avisa de que por encima de ~1,2x «rara vez es apropiado» y empieza a
sonar forzado. Llegar a los tiempos del anuncio 2 pediría bastante más que
eso en varias líneas.

## Las muestras

Se han generado y se entregan:

- Cinco fragmentos sueltos de comparación (`out/prueba-voz/*.wav`) — frases
  reales de los dos guiones, con las dos voces.
- **`dcode-anuncio-1-kokoro-DEMO.mp4`** — el anuncio 1 completo, con esta
  locución montada sobre el máster ya actualizado.
- **`dcode-anuncio-2-kokoro-DEMO.mp4`** — el anuncio 2 completo, igual.
  Tiene el solape mencionado arriba en el fragmento 11 (el remate, «Si para
  llevar tu empresa…»): se oirá encabalgado con la frase siguiente.

## Recomendación

- **Anuncio 1:** una opción real. Si al escucharlo la voz convence, con
  ensanchar tres ventanas en `GUION.md` (o recortar esas tres frases) queda
  listo para producción.
- **Anuncio 2:** no, tal cual. O se vuelve a escribir el guion de esa pieza
  con huecos más generosos —lo que probablemente le quita el punchy que tiene
  ahora—, o esta locución concreta necesita una voz humana o un servicio con
  más control de ritmo (ver `references/setup-providers.md` de `media-use`:
  HeyGen y ElevenLabs, ambos con cuenta y con coste, están ahí como
  alternativas si se prefiere seguir explorando síntesis).

## Cómo generarla si se decide seguir adelante

```bash
python3 tools/generar-locucion-kokoro.py --anuncio 1 --voz em_alex --speed 1.1 --out voces/anuncio-1
python3 montar-voz.py --anuncio 1 --voces voces/anuncio-1 --fmt 9x16
```

`generar-locucion-kokoro.py` lee los mismos fragmentos que `montar-voz.py` —
la tabla de narración de `GUION.md` / `GUION-2.md`—, así que los tiempos no
se repiten en ningún sitio. Avisa antes de montar si algún clip no cabe en su
hueco; con eso ya se sabe qué frase hay que retocar.

## Confirmación en producción: anuncio 4

El anuncio 4 (D-Code Finance, `GUION-4.md`) confirma la hipótesis de arriba:
su guion tiene el mismo registro pausado y profesional que el anuncio 1, y
Kokoro (`em_alex`, velocidad 1,1) encaja en sus doce huecos sin necesidad de
`--forzar` — solo hizo falta ensanchar dos ventanas ~0,3–1,1 s tras la
primera pasada, exactamente el ajuste que se predecía aquí. Es la primera
pieza que sale a producción con esta locución.
