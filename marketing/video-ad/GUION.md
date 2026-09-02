# Anuncio D-Code Partners — «¿Cuánto tiempo está perdiendo tu empresa?»

Duración **40,0 s** · Formatos **9:16 (1080×1920)** y **16:9 (1920×1080)** · 30 fps
Estructura: **PROBLEMA → COSTE → CAMBIO → SOLUCIÓN → RESULTADO → CTA**

El anuncio empieza por el problema del espectador. La marca no aparece hasta el
segundo 34,6. No hay lista de servicios ni frases de catálogo.

---

## 1. Escaleta y tiempos

| # | Escena | Entrada | Salida | En pantalla |
|---|--------|---------|--------|-------------|
| 1 | Hook | 0,0 | 4,5 | ¿CUÁNTO TIEMPO PIERDE TU EMPRESA EN TAREAS REPETITIVAS? |
| 2 | El problema | 4,5 | 10,5 | CORREOS. · CITAS. · DATOS. · SEGUIMIENTOS. · TAREAS REPETITIVAS. |
| 3 | El coste oculto | 10,5 | 15,5 | +300 h AL AÑO EN TAREAS REPETITIVAS · PEQUEÑAS TAREAS × MUCHAS VECES = GRANDES PÉRDIDAS |
| 4 | El giro | 15,5 | 20,8 | EL PROBLEMA NO SIEMPRE ES TU EQUIPO. → A VECES ES EL PROCESO. |
| 5 | La solución | 20,8 | 28,6 | CLIENTE→WHATSAPP→IA→CRM→CALENDARIO→SEGUIMIENTO · ANALIZAR ↓ DISEÑAR ↓ AUTOMATIZAR ↓ MEDIR |
| 6 | Resultado | 28,6 | 34,6 | MENOS TAREAS MANUALES · MÁS ORGANIZACIÓN · MÁS TIEMPO PARA CRECER |
| 7 | Cierre | 34,6 | 40,0 | D-Code PARTNERS · ¿QUÉ PODRÍAMOS AUTOMATIZAR EN TU EMPRESA? · dcodepartners.com |

**El giro (15,5 s) es el eje del anuncio.** La imagen se queda casi a negro y la
música calla ~0,5 s antes de que aparezca la primera línea. Es el único silencio
del montaje y es lo que hace que el espectador se detenga.

---

## 2. Voz en off — guion y entradas

Voz masculina, español de España, tono profesional, seguro y tranquilo. Sin
énfasis publicitario. Ritmo pausado: es una conversación, no un anuncio de
televisión.

| Entrada | Salida | Texto |
|---------|--------|-------|
| 0,60 | 4,40 | ¿Cuánto tiempo pierde tu empresa haciendo cosas que una máquina podría hacer? |
| 5,00 | 10,20 | Correos. Citas. Seguimientos. Datos. Tareas que se repiten una y otra vez. |
| 10,80 | 15,30 | Por separado parecen pequeñas. Juntas pueden convertirse en cientos de horas perdidas. |
| 16,40 | 18,40 | Pero quizá el problema no sea tu equipo. |
| 19,00 | 20,50 | *(pausa)* Quizá sea el proceso. |
| 21,20 | 28,40 | Analizamos cómo funciona tu empresa, detectamos dónde se pierde tiempo y diseñamos sistemas de IA y automatización para solucionarlo. |
| 29,00 | 34,20 | Menos tareas manuales. Más organización. Más tiempo para hacer crecer tu negocio. |
| 35,40 | 38,40 | La tecnología debe trabajar para tu negocio. |

Indicaciones de interpretación:

- **0,60** — pregunta real, sin subrayarla. Que suene a duda, no a eslogan.
- **10,80** — bajar el tono en «por separado parecen pequeñas» y abrir en «cientos de horas».
- **16,40 → 19,00** — respetar la pausa de 0,6 s entre las dos frases. Es el momento del anuncio.
- **35,40** — cerrar en voz baja. Sin florituras.

La banda sonora ya viene atenuada (a un 52 %) en cada uno de estos tramos, con
rampas de 0,1 s, así que la locución se puede montar encima sin volver a mezclar.

---

## 3. Textos en pantalla (ortografía definitiva)

Copiar y pegar desde aquí; llevan todas las tildes y los signos de apertura.

```
¿CUÁNTO TIEMPO PIERDE TU EMPRESA EN TAREAS REPETITIVAS?
CORREOS.
CITAS.
DATOS.
SEGUIMIENTOS.
TAREAS REPETITIVAS.
PEQUEÑAS TAREAS × MUCHAS VECES = GRANDES PÉRDIDAS
EL PROBLEMA NO SIEMPRE ES TU EQUIPO.
A VECES ES EL PROCESO.
ANALIZAR → DISEÑAR → AUTOMATIZAR → MEDIR
MENOS TAREAS MANUALES
MÁS ORGANIZACIÓN
MÁS TIEMPO PARA CRECER
¿QUÉ PODRÍAMOS AUTOMATIZAR EN TU EMPRESA?
dcodepartners.com
```

Sobre el contador de la escena 3: aparece como **«+300 h AL AÑO EN TAREAS
REPETITIVAS»** y la voz dice «pueden convertirse en cientos de horas». Es una
cifra ilustrativa, deliberadamente redonda y con «+», no un dato medido. Si se
quiere sustituir por una cifra propia de un caso real, está en `ad.html`, en
`scene3()` (`* 300`).

---

## 4. Dirección visual

Paleta tomada de `assets/css/styles.css`, la misma de la web:

| Uso | Token | Valor |
|-----|-------|-------|
| Fondo | `--bg` | `#06080d` |
| Paneles | `--panel` / `--panel-2` | `#0e1320` / `#121828` |
| Bordes | `--border` | `#1e2536` |
| Texto | `--ink` / `--stone` | `#eef2fb` / `#a7b0c4` |
| Azul eléctrico | `--blue` | `#5b8cff` |
| Cian | `--cyan` | `#43e0ff` |
| Ámbar (coste) | `--amber` | `#ffb454` |
| Verde (resultado) | `--green` | `#34e7a4` |

Tipografías: **Space Grotesk** (titulares), **JetBrains Mono** (etiquetas de
interfaz), **Inter** (texto corrido). Son los mismos ficheros que sirve la web.

El color cuenta la historia: azul neutro en el planteamiento, ámbar cuando
aparece el coste, casi negro en el giro, azul y cian cuando el sistema funciona,
verde en el resultado, azul marino en el cierre.

**El logotipo solo aparece en la escena 7**, como pedía el encargo.

---

## 5. Sobre la pieza entregada

Lo que hay en `out/` es **animación de marca (motion graphics)**, no imagen real
de oficina con actores: en este entorno no hay ninguna herramienta de generación
de vídeo por IA disponible, así que la pieza está dibujada fotograma a fotograma
con la identidad real de D-Code Partners.

Para el posicionamiento que se busca —«Apple + consultora tecnológica premium»,
sin robots ni cerebros digitales— esta vía juega a favor: no hay riesgo de manos
deformes, texto ilegible ni continuidad rota entre planos, que es donde se
delatan los anuncios generados con IA. Y el resultado es reproducible: cambiar un
texto y volver a renderizar son dos minutos.

Si además se quiere la versión con oficina y personas reales, la sección
siguiente trae los prompts listos.

---

## 6. Prompts para generar las escenas en vídeo por IA

Para Veo 3, Sora, Kling o Runway Gen-3. Un plano por escena, 9:16, sin texto
incrustado (los rótulos se superponen después en montaje, que es como se
garantiza la ortografía).

**Bloque de estilo — repetir literalmente en todos los prompts, para mantener la
continuidad de oficina, personajes e iluminación:**

> Cinematic corporate film, modern open-plan office in a European city, floor-to-ceiling
> windows, overcast daylight plus cool practical lighting, deep navy and electric blue
> colour grade (#06080d shadows, #5b8cff accents), shallow depth of field, anamorphic
> 35mm look, subtle film grain, slow deliberate camera movement on a gimbal. Same four
> professionals throughout: a woman in her 30s in a grey blazer, a man in his 40s in a
> navy shirt, a younger man in a white shirt, a woman in her 50s in a black turtleneck.
> Photorealistic, understated, premium. No on-screen text, no logos, no robots, no
> holograms, no sci-fi interfaces, no glowing brains.

| Escena | Prompt del plano |
|--------|------------------|
| 1 | *[bloque de estilo]* + Slow push-in on the woman in the grey blazer at her desk. Her phone lights up, then again, then a third time. Two colleagues approach her from different directions at once, one holding a laptop. She glances between the screen, the phone and the people. Calm competence gradually turning into saturation. 4 seconds. |
| 2 | *[bloque de estilo]* + Series of tight insets, each 1 second: fingers retyping the same data from a printed form into a spreadsheet; a hand dragging appointments in a calendar app; a cursor copying a field from one window to another; someone typing a follow-up email that looks like the last one. Hands and screens only, faces out of frame. 6 seconds. |
| 3 | *[bloque de estilo]* + Wide static shot of the office as daylight shifts from morning to dusk in time-lapse. People move fast and blurred, desks stay cluttered. The man in the navy shirt is the one still point, sitting back, rubbing his eyes. Amber tint creeping into the grade. 5 seconds. |
| 4 | *[bloque de estilo]* + Everything stops. The office goes quiet and almost dark, only rim light on the faces. Hold on the woman in the grey blazer looking up, thinking. Then a single thin line of blue light crosses the frame behind her and the room reads as connected rather than crowded. The most elegant shot of the film. 5 seconds. |
| 5 | *[bloque de estilo]* + Smooth lateral dolly past the team, now working calmly. Over-shoulder of a clean dashboard on a large monitor: records updating on their own, a calendar filling itself, a message thread resolving. Restrained, believable business software — not sci-fi. 8 seconds. |
| 6 | *[bloque de estilo]* + Same wide framing as scene 3, now ordered: tidy desks, no phone lighting up, the four professionals talking to each other instead of to screens. One of them leaves on time. Cool blue light, a hint of green. 6 seconds. |
| 7 | Clean deep navy background (#0a1020), soft blue radial glow from the centre, empty frame, slow subtle drift. No people, no text. 5 seconds. *(El logotipo, la pregunta de cierre y el dominio se superponen en montaje sobre este fondo — no dejar que la IA escriba texto.)* |

Método recomendado: generar cada plano 3–4 veces, elegir la mejor toma, montar en
el orden de la escaleta y superponer los rótulos de la sección 3 con las
tipografías de marca. El logotipo, solo en la escena 7 y desde el archivo real
(`assets/dcode-mark.png`), nunca redibujado por la IA.

---

## 7. Audio

`audio.py` sintetiza los 40 s desde cero —sin samples ni librerías externas—, así
que la pista es original y **libre de derechos por construcción**: no hay licencia
que gestionar antes de publicar.

- Pads de acorde que siguen el arco emocional del guion.
- Percusión repetitiva en la escena 2 (el bucle sin salida) y con empuje en la 5.
- Efectos alineados al fotograma: avisos, teclado, tics de reloj acelerando,
  transición del giro, campanas al conectarse cada sistema, confirmaciones.
- Silencio real de 0,5 s en el giro.
- Atenuación automática bajo los tramos de voz de la sección 2.

**Lo que falta: la locución.** En este entorno no hay síntesis de voz, así que el
vídeo se entrega con música y efectos. Para cerrarlo:

1. Grabar o generar los ocho fragmentos de la sección 2 (ElevenLabs con una voz
   masculina de español de España da buen resultado; también un locutor real).
2. Montarlos en las entradas indicadas.
3. Mezclar sobre el MP4 tal cual — los huecos ya están hechos:

```bash
ffmpeg -i out/dcode-anuncio-9x16.mp4 -i locucion.wav \
  -filter_complex "[0:a][1:a]amix=inputs=2:duration=first:weights=1 1.6[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k out/dcode-anuncio-9x16-vo.mp4
```

---

## 8. Publicación

| Plataforma | Archivo | Notas |
|-----------|---------|-------|
| LinkedIn (feed y anuncio) | `dcode-anuncio-9x16.mp4` | El vertical rinde mejor en móvil, que es donde se consume el feed. |
| LinkedIn (escritorio y web) | `dcode-anuncio-16x9.mp4` | También para incrustar en `index.html`. |
| Instagram Reels · TikTok · Shorts | `dcode-anuncio-9x16.mp4` | Sin cambios: los rótulos están dentro de la zona segura. |

Los dos van a H.264 High + AAC 192 kbps, `+faststart`, dentro de los límites de
todas ellas.

**Subtítulos.** Buena parte del feed de LinkedIn se ve sin sonido. Los rótulos ya
sostienen el mensaje por sí solos, pero al añadir la locución conviene subir
también un `.srt` con los textos de la sección 2 en esas mismas entradas.

**Texto sugerido para la publicación** (el anuncio no vende, así que el pie
tampoco debería):

> La mayoría de las empresas no pierden tiempo en las cosas grandes.
> Lo pierden en las pequeñas, repetidas cientos de veces.
>
> Nosotros analizamos procesos, detectamos dónde se va el tiempo y diseñamos
> sistemas de IA y automatización para recuperarlo.
>
> ¿Qué podríamos automatizar en tu empresa? → dcodepartners.com
