# «El bucle» — qué subir y con qué textos

Todo lo de aquí sale del propio anuncio o de lo publicado en dcodepartners.com. No hay ninguna cifra de
resultados, ningún número de clientes y ningún plazo: nada de eso está medido, así que no se dice.

---

## 1 · Los ficheros

| Fichero | Duración | Dónde va |
|---|---|---|
| `../dcode-youtube-ad-45s-master.mp4` | 45,013 s | Campaña principal · skippable in-stream |
| `../dcode-youtube-ad-20s.mp4` | 19,400 s | Segunda versión de la misma campaña, y remarketing |
| `../dcode-youtube-ad-6s.mp4` | 6,000 s | Bumper (no se puede saltar) |
| `miniatura-el-bucle.png` / `.jpg` | 1280×720 | Miniatura. El JPG pesa 84 KB, muy por debajo de los 2 MB que acepta YouTube |

## 2 · Verificación antes de subir (medida el 27/09/2026)

| Comprobación | Máster 45 s | Corte 20 s | Bumper 6 s |
|---|---|---|---|
| Duración | 45,013 s | 19,400 s | 6,000 s |
| Fotogramas | 1350 | 582 | 180 |
| ¿Cuadra con duración × 30 fps? | **Sí, exacto** | **Sí, exacto** | **Sí, exacto** |
| Resolución y cadencia | 1920×1080 · 30 fps | igual | igual |
| Vídeo | H.264 High · 2,79 Mbps | 2,83 Mbps | 1,79 Mbps |
| Audio | AAC-LC 48 kHz estéreo · 312 kbps | 258 kbps | 255 kbps |
| Peso | 17,48 MB | 7,52 MB | 1,55 MB |
| Decodificación completa | sin errores | sin errores | sin errores |

**Sonoridad del máster:** −14,4 LUFS integrados, −1,0 dBFS de pico real, rango 7,2 LU. YouTube normaliza a
−14 LUFS: la pieza ya está ahí, así que no le van a bajar el volumen.

**Sobre los «congelados» y los «negros»:** los detectores automáticos marcan cuatro congelados cortos y tres
tramos oscuros. Ninguno es un fallo. El congelado del segundo 12,4 es **el giro del anuncio** —la imagen se para
en seco y el sonido desaparece durante seis décimas, que es el pico que sostiene la pieza— y el tramo «negro»
final es el rótulo de marca, que va sobre el casi negro de la identidad. Comprobado fotograma a fotograma.

## 3 · Título

```
¿Cuánto tiempo pierdes haciendo esto cada día?
```

Alternativa, si se prefiere nombrar la marca en el título:

```
El bucle · D-Code Partners
```

## 4 · Descripción

```
Copiar de un sitio a otro. Responder lo mismo otra vez. Buscar el dato que ya
existe. Comprobar que está hecho.

Muchas de esas tareas no deberían hacerse a mano.

En D-Code Partners miramos cómo funciona tu negocio y construimos el sistema
que lo hace por ti: un sistema financiero conectado, una aplicación propia
para tu negocio, un asistente que responde con tus datos y un sistema que lo
conecta todo.

No necesitas saber de IA. Ni de programación. Solo necesitas saber qué
problema tienes.

Cuéntanos qué te está haciendo perder tiempo:
https://dcodepartners.com

—
D-Code Partners · Madrid
Automatización, agentes de IA e integraciones para empresas.
```

## 5 · Etiquetas

```
automatización de procesos, agentes de IA, integraciones, software a medida,
digitalización pymes, automatizar tareas repetitivas, sistemas internos,
D-Code Partners
```

## 6 · Cómo configurar la campaña

- **Formato:** in-stream saltable con el máster de 45 s. El bumper de 6 s va en una campaña aparte, de alcance.
- **El gancho está en los dos primeros segundos**, antes del botón de saltar: el gesto de copiar y pegar se
  reconoce sin sonido y sin marca. Por eso el anuncio no abre con el logotipo.
- **Sirve sin sonido.** Todo el guion está escrito en pantalla. En YouTube la mayoría del in-stream se ve con
  audio, pero la pieza no depende de él.
- **Destino:** dcodepartners.com.

## 7 · Lo que falta, y no es una decisión creativa

**No lleva voz en off.** No hay ninguna credencial de un motor de voz en este entorno, y una voz claramente
sintética habría sido peor que ninguna. La pieza está construida para sostenerse leída: el guion completo, con
códigos de tiempo, está en `../DOCUMENTATION.md` §7. Cuando haya credencial de ElevenLabs, la locución entra
encima **sin tocar la imagen**: los tiempos ya están pensados para ello.

Es la única pieza pendiente de este bloque, y depende de una credencial, no de más trabajo aquí.
