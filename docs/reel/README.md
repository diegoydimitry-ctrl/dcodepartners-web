# Reel de la nueva portada · D-Code Partners

Vídeo vertical para Instagram hecho con la propia web: cada plano es la portada «el mundo» funcionando en un navegador, dirigida cuadro a cuadro. No es una grabación de pantalla ni una animación aparte.

## Archivos

| Archivo | Qué es |
|---|---|
| `reel-dcode.mp4` | Versión final con rótulos. 1080 × 1920, 30 fps, 40 s, H.264 + AAC. |
| `reel-dcode-sin-texto.mp4` | El mismo montaje sin rótulos, para poner otros textos desde Instagram o reutilizar planos. |
| `reel-dcode-portada.jpg` | Portada (cover) del Reel, 1080 × 1920. Lo importante queda dentro del recorte 4:5 que hace la cuadrícula del perfil. |

## Guion (40 s)

| Tiempo | Plano | Rótulo en pantalla |
|---|---|---|
| 0,0–2,5 s | Dentro de la tormenta de documentos; la cámara se aleja. | «Así está hoy el trabajo de tu empresa.» |
| 2,5–6 s | Se abre la portada: el título en calma en mitad de la tormenta. | «Esto no es un vídeo» → «Es una página web» |
| 6–10 s | Se desliza al capítulo «Hoy»: los documentos quedan suspendidos. | — (habla el texto de la propia web) |
| 10–13,5 s | Un dedo mantiene pulsado y los documentos se ordenan en un muro. | «Mantén pulsado: el sistema pone orden» |
| 13,5–19 s | Se desliza al sistema: cinco carriles, uno por área; se toca «Finanzas» y se ilumina su carril. | «Deslizas y el caos se ordena» |
| 19–22,5 s | El pórtico de lectura de cerca: cada hoja sale con su píxel azul. | «La IA lee cada documento.» |
| 22,5–25,5 s | La sala de noche: los carriles siguen moviéndose solos. | «Y sigue trabajando a las 03:12.» |
| 25,5–31 s | D-Code Finance: un dedo pulsa «Pasar la factura por Finance», la luz recorre la factura y cada dato salta al registro. | «Todo lo que ves funciona» |
| 31–34 s | La sala vista desde arriba: la empresa entera en un plano. | «Tu empresa, como un solo sistema.» |
| 34–40 s | La hoja en blanco con el píxel azul. | «¿Quieres una web así para tu empresa?» → «La construimos nosotros.» + marca + «Escríbenos · dcodepartners.com» |

## Texto recomendado para la publicación

**Si el Reel se publica cuando la nueva web ya esté en dcodepartners.com:**

> Esto no es un vídeo. Es nuestra nueva web.
>
> Así llega el trabajo a casi cualquier empresa: facturas, correos, presupuestos y hojas de cálculo, cada uno por su lado. Al deslizar se ve cómo un sistema los lee, los ordena y sigue trabajando de madrugada.
>
> Todo lo que aparece funciona en el navegador, también en el móvil. Entra en dcodepartners.com, mantén pulsado sobre los documentos y pásale una factura a D-Code Finance.
>
> Si quieres una web así para tu empresa, o el sistema que hay detrás, escríbenos por mensaje directo.

**Si se publica antes de que la web esté en producción** (ahora mismo solo existe en Preview), cambia el tercer párrafo por:

> Todo lo que aparece funciona en el navegador, también en el móvil. La publicamos en dcodepartners.com en los próximos días.

Etiquetas sugeridas (pocas y concretas): `#automatización #inteligenciaartificial #diseñoweb #webgl #pymes #empresas #madrid`

## Llamada a la acción

- En pantalla: «¿Quieres una web así para tu empresa?» → «La construimos nosotros.» → la marca y «Escríbenos · dcodepartners.com».
- En el texto: «escríbenos por mensaje directo».
- Vende dos cosas a la vez sin decirlo dos veces: la web (lo que se acaba de ver) y el sistema (lo que la web cuenta).

## Sonido

Diseño sonoro propio, generado por código (`scripts/v3/reel/audio.py`, con numpy y scipy): viento y golpes para la tormenta, una base grave, un pulso a 120 pulsos por minuto, barridos en cada corte y una nota por cada dato que Finance extrae de la factura. No usa música, muestras ni librerías de terceros, así que no hay derechos de nadie.

- Sonoridad integrada medida en el archivo final: −14,7 LUFS; pico real −0,9 dBTP.
- **Pendiente de tu oído:** está medido, pero no lo he escuchado (trabajo sin altavoces). Si no te convence, usa `reel-dcode-sin-texto.mp4` o silencia la pista y pon un audio de la biblioteca de Instagram: los cortes caen en 2,5 · 6 · 10 · 13,5 · 19 · 22,5 · 25,5 · 31 y 34 s.

## Cómo se ha hecho (y cómo repetirlo)

Todo está en `scripts/v3/reel/`:

1. `director.mjs` abre la portada en Chromium sin cabeza (Playwright) con el tiempo detenido: adelanta 1/30 s, mueve el scroll, la cámara o el dedo según el plano, y guarda el cuadro a 1080 × 1920. Como el tiempo es virtual, cada cuadro sale completo aunque tarde segundos en pintarse.
2. `capas.mjs` graba los rótulos de `capas.html` aparte, con transparencia. Por eso existen las dos versiones del mismo rodaje.
3. `audio.py` genera la pista.
4. `montar.sh` une los planos, les da una curva de contraste suave, superpone los rótulos y mete el sonido con ffmpeg.
5. `portada.mjs` hace la portada con un cuadro del plano del muro rodado sin el dedo (`SIN_DEDO=1`).

```
node scripts/v3/reel/director.mjs <cuadros>            # con la web servida en local: BASE=http://localhost:8097
node scripts/v3/reel/capas.mjs <rótulos> 1200
python3 scripts/v3/reel/audio.py <carpeta>/reel.wav
bash scripts/v3/reel/montar.sh <cuadros> <rótulos> <carpeta>/reel.wav docs/reel
SALTO=35 SIN_DEDO=1 node scripts/v3/reel/director.mjs <portada> 04
node scripts/v3/reel/portada.mjs <portada>/04-orden/f0070.jpg docs/reel/reel-dcode-portada.jpg
```

Sin tarjeta gráfica (render por software) el rodaje completo tarda unas dos horas: 1.200 cuadros a entre 4 y 11 segundos cada uno.

El modo de rodaje se activa solo con `?captura&reel` en la URL; un visitante normal nunca lo carga y no cambia nada de la web publicada. El vídeo lleva una curva de contraste que la web no tiene: los negros del Reel son algo más profundos que los de la página.
