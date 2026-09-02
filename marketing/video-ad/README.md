# Anuncios en vídeo — D-Code Partners

Tres piezas para LinkedIn, reutilizables en Instagram Reels, TikTok y Shorts.
Se renderizan desde este repositorio, con la identidad real de la marca: mismas
tipografías, misma paleta y mismo logotipo que la web.

El guion completo de cada anuncio, con sus entradas y notas de dirección, está
en **[GUION.md](GUION.md)** (anuncio 1), **[GUION-2.md](GUION-2.md)** (anuncio
2) y **[GUION-3.md](GUION-3.md)** (teaser DCode OS).

## Resultado

| Archivo | Formato | Uso |
|---------|---------|-----|
| `out/dcode-anuncio-9x16.mp4` | 1080×1920 · 30 fps · 40 s | LinkedIn móvil, Reels, TikTok, Shorts |
| `out/dcode-anuncio-16x9.mp4` | 1920×1080 · 30 fps · 40 s | LinkedIn escritorio, web |
| `out/dcode-ad3-9x16.mp4` | 1080×1920 · 30 fps · 18 s | Teaser DCode OS — móvil, Reels, Stories |
| `out/dcode-ad3-16x9.mp4` | 1920×1080 · 30 fps · 18 s | Teaser DCode OS — escritorio, web |
| `out/banda-sonora.wav` / `-2.wav` / `-3.wav` | 44,1 kHz estéreo | Música y efectos por separado, uno por anuncio |

H.264 High + AAC 192 kbps, `+faststart`. Con música y efectos. Los anuncios 1
y 2 salen **sin locución** (ver GUION.md § 7 para añadirla — la mezcla ya
deja los huecos hechos); el teaser DCode OS se apoya solo en rótulos y
música, sin voz en off (ver GUION-3.md).

## Cómo se genera

```bash
# 1. ffmpeg con libx264 y aac (el que trae Playwright solo hace VP8/WebM)
npm install ffmpeg-static

# 2. banda sonora  (~12 s)
python3 audio.py out/banda-sonora.wav

# 3. vídeo  (~4 min por formato con 4 procesos)
node render.js --fmt 9x16 --workers 4
node render.js --fmt 16x9 --workers 4
```

Requiere Node con Playwright y Chromium instalados. Si `ffmpeg` no está en el
PATH ni como dependencia, indícalo con `FFMPEG_PATH=/ruta/a/ffmpeg`.

Para el anuncio 2 o el teaser DCode OS, indicar `--src` y su duración propia:

```bash
python3 audio2.py out/banda-sonora-2.wav
node render.js --src ad2.html --fmt 9x16 --dur 60 --audio out/banda-sonora-2.wav --workers 4

python3 audio3.py out/banda-sonora-3.wav
node render.js --src ad3.html --fmt 9x16 --dur 18 --audio out/banda-sonora-3.wav --workers 4
```

## Previsualizar sin renderizar

Abrir `ad.html` en el navegador: sin parámetros se reproduce en bucle a tiempo
real. Con `?fmt=16x9` se ve la versión horizontal y con `?t=17.2` se congela ese
segundo exacto, que es lo cómodo para ajustar una escena.

## Archivos

| Archivo | Qué hace |
|---------|----------|
| `ad.html` / `ad2.html` / `ad3.html` | Las tres animaciones. Todo se deriva de `render(t)`, sin estado entre fotogramas. |
| `render.js` | Captura fotogramas en Chromium y los envía por tubería a ffmpeg. Sirve para las tres piezas (`--src`). |
| `audio.py` / `audio2.py` / `audio3.py` | Sintetizan música y efectos desde cero, uno por anuncio. Sin dependencias. |
| `tools/clean-logo.py` | Recupera el logotipo sobre transparencia real. |
| `assets/dcode-mark.png` | Logotipo limpio que usa el cierre. |
| `montar-voz.py` | Coloca los clips de locución en su segundo y los mezcla con la música. |
| `out/locucion/` | Texto de la narración, tiempos y subtítulos de los dos anuncios. |

## Añadir la locución

Los másteres salen con música y efectos, sin voz. Para montarla:

1. Generar un clip por fragmento con el texto de `out/locucion/<anuncio>-texto.txt`
   —uno por línea, en ese orden— y numerarlos `01`, `02`, `03`…
2. Dejarlos en una carpeta y montar:

```bash
python3 montar-voz.py --anuncio 1 --voces voces/anuncio-1 --fmt 9x16
python3 montar-voz.py --anuncio 2 --voces voces/anuncio-2 --fmt 16x9
```

Los tiempos se leen de las tablas de narración de los guiones, así que no hay
que repetirlos en ningún sitio. El vídeo no se recodifica (`-c:v copy`) y la
música ya viene atenuada bajo cada tramo de voz.

Antes de montar comprueba que cada clip cabe en su hueco y avisa si alguno
invadiría el siguiente, que es lo que pasa cuando la voz se genera demasiado
lenta. Con `--forzar` se monta igualmente; con `--volumen` se ajusta la ganancia
de la voz sobre la música (1,6 por defecto).

## Locución con Kokoro (opcional, no es el flujo por defecto)

Probado y funcional para el anuncio 1 (voz masculina española `em_alex`, motor
Kokoro local sin cuenta ni nube); no encaja para el anuncio 2, cuyo ritmo cómico
es demasiado corto para su cadencia. Detalle completo, con las cifras de cada
fragmento, en **[PRUEBA-KOKORO.md](PRUEBA-KOKORO.md)**. Para generarla:

```bash
python3 tools/generar-locucion-kokoro.py --anuncio 1 --voz em_alex --speed 1.1 --out voces/anuncio-1
python3 montar-voz.py --anuncio 1 --voces voces/anuncio-1 --fmt 9x16
```

## Notas de implementación

**Corte entre escenas (cut-the-curve).** El corte por defecto entre escenas no es
un crossfade por opacidad — se probó y dejaba las dos escenas casi a alfa 0 a la
vez, un fotograma "muerto" en cada corte (anti-patrón documentado en la doctrina
de movimiento de HyperFrames: *"the crossfade has no carrier"*). En su lugar,
`cutOffsetX()` en `ad.html`/`ad2.html` desplaza el contenido ~12 % del ancho de
fotograma: la escena saliente se desliza a la izquierda acelerando
(`power4.in`), la entrante continúa decelerando (`power4.out`) — las dos mitades
de una misma curva `power4.inOut`, así que la velocidad coincide exactamente en
el corte. Los fundidos de borde de cada escena se recortaron de ~0,3–0,45 s a
~0,10 s: ya no cargan con la transición, solo evitan un pop de un fotograma.

**Render determinista.** `render(t)` dibuja el fotograma del segundo `t` sin
depender de fotogramas anteriores: no hay `requestAnimationFrame` ni acumuladores,
y los valores aleatorios salen de generadores con semilla fija. Renderizar dos
veces da archivos idénticos, y el trabajo se puede repartir entre procesos
paralelos porque cada uno calcula su tramo por su cuenta.

**Unión sin recodificar.** Los segmentos se codifican con `keyint=60`,
`min-keyint=60` y `scenecut=0`, así que cada uno empieza en fotograma clave y se
concatenan con `-c:v copy`: el vídeo final no pasa dos veces por el compresor.

**El logotipo.** `assets/logo/dcode-icon-sm.png` lleva una plancha negra al 24 %
que cubre todo el lienzo. Sobre la cabecera casi negra de la web no se ve, pero en
el cierre del anuncio —azul marino con resplandor— aparecía como un recuadro
oscuro alrededor de la marca. `tools/clean-logo.py` no redibuja nada: invierte la
composición (`Am = (Ao − p)/(1 − p)`, `Cm = Co·Ao/Am`) y recupera los píxeles
originales sobre transparencia. El archivo de la web no se toca.

**Cambiar un texto.** Los rótulos están agrupados al principio de cada escena en
`ad.html` (`CHIPS`, `WORDS`, `TASKS`, `NODES`, `FLOW`, `METHOD`, `GAINS`). Tras
editarlos hay que volver a renderizar; si el cambio altera los tiempos, ajustar
también las entradas de voz en GUION.md y los efectos de `audio.py`, que están
alineados a los mismos segundos.
