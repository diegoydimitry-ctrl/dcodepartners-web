# Anuncio en vídeo — D-Code Partners

Anuncio de 40 s para LinkedIn, reutilizable en Instagram Reels, TikTok y Shorts.
Se renderiza desde este repositorio, con la identidad real de la marca: mismas
tipografías, misma paleta y mismo logotipo que la web.

El guion completo, la voz en off con sus entradas y las notas de dirección están
en **[GUION.md](GUION.md)**.

## Resultado

| Archivo | Formato | Uso |
|---------|---------|-----|
| `out/dcode-anuncio-9x16.mp4` | 1080×1920 · 30 fps | LinkedIn móvil, Reels, TikTok, Shorts |
| `out/dcode-anuncio-16x9.mp4` | 1920×1080 · 30 fps | LinkedIn escritorio, web |
| `out/banda-sonora.wav` | 44,1 kHz estéreo | Música y efectos por separado |

H.264 High + AAC 192 kbps, `+faststart`. Con música y efectos; **sin locución**
(ver GUION.md § 7 para añadirla — la mezcla ya deja los huecos hechos).

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

## Previsualizar sin renderizar

Abrir `ad.html` en el navegador: sin parámetros se reproduce en bucle a tiempo
real. Con `?fmt=16x9` se ve la versión horizontal y con `?t=17.2` se congela ese
segundo exacto, que es lo cómodo para ajustar una escena.

## Archivos

| Archivo | Qué hace |
|---------|----------|
| `ad.html` | La animación. Todo se deriva de `render(t)`, sin estado entre fotogramas. |
| `render.js` | Captura fotogramas en Chromium y los envía por tubería a ffmpeg. |
| `audio.py` | Sintetiza música y efectos desde cero. Sin dependencias. |
| `tools/clean-logo.py` | Recupera el logotipo sobre transparencia real. |
| `assets/dcode-mark.png` | Logotipo limpio que usa el cierre. |

## Notas de implementación

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
