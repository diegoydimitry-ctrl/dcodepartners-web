# D-Code Partners · anuncios (v5, 28/09/2026)

Esta ronda cambia **la voz y el ritmo de COMERCIALES** (v5) y añade **un mini de YouTube** nuevo. El vídeo largo de
YouTube (RUIDO, v4) se conserva sin cambios.

| | **1 · RUIDO** (YouTube, v4) | **2 · COMERCIALES v5** (Reels/Stories) | **3 · EN AUTOMÁTICO** (mini YouTube) |
|---|---|---|---|
| Formato | 16:9 · 1920×1080 · 30 fps · 44,6 s | 9:16 · 1080×1920 · 30 fps · **43,4 s** | 16:9 · 1920×1080 · 30 fps · **8,5 s** |
| Idea | Hay un trabajo en tu empresa que nadie ve; D-Code lo convierte en un sistema | Buscamos comerciales en toda España: sin estudios, sin experiencia, 50 % de cada venta | ¿Sigues haciendo esto a mano? → D-Code Partners → tu empresa, en automático |
| Voz | Supertonic 3 (sin cambios) | **Qwen3-TTS · voz «Bodega»**, masculina, español de España | Qwen3-TTS · «Bodega» |
| Sonoridad entregada | −14,3 LUFS · −1,4 dBTP | **−14,3 LUFS · −1,2 dBTP** | **−14,0 LUFS · −1,6 dBTP** |
| Entrega | `v1-youtube/entrega/dcode-ruido-youtube-16x9.mp4` | `v2-vendedores/entrega/dcode-comerciales-v5-9x16.mp4` | `v3-mini/entrega/dcode-en-automatico-youtube-16x9.mp4` |

La v4 de COMERCIALES (`dcode-comerciales-9x16.mp4`) se deja en el repositorio como versión anterior.

## 1 · Investigación aplicada (qué se ha hecho y por qué)

- **Hueco de información (Loewenstein):** la curiosidad aparece cuando alguien nota que le falta un dato concreto
  que le afecta. → *«Hay un trabajo en tu empresa que nadie ve. Y puede estar costándote un sueldo entero.»* Es
  concreto, personal («tu empresa») y habla de una pérdida. La aversión a la pérdida mueve más que la ganancia.
- **Bucle abierto con plazo:** *«En treinta segundos te digo cuál es… y cómo quitártelo de encima.»* Una
  **cuenta atrás** se queda en la esquina y llega a cero en el remate (*«Y tu equipo, por fin…»*). Es el efecto
  Zeigarnik: una tarea abierta se recuerda y se quiere ver cerrada.
- **YouTube (Google, miles de anuncios TrueView):**
  - El logotipo en los 5 primeros segundos sube el recuerdo pero también los saltos. → La firma de marca aparece
    después del segundo 5; la marca se dice a los 21 s y cierra el vídeo.
  - La música en los 5 primeros segundos resta recuerdo de marca. → El arranque va con voz al frente, golpes y
    un latido; la música entra con los microplanos.
  - El tono de suspense sube el recuerdo. → Latido que se acelera y rodillo de euros.
- **Color:** los tonos cálidos saturados (amarillo‑naranja) son los de mayor activación y valencia positiva
  (estudio Munsell, BMC Psychology 2025). → Ámbar/naranja en los ganchos de los dos vídeos, sobre negro para el
  contraste máximo. En el vídeo 2 solo hay un color de acento, para no dispersar.
- **Voz masculina grave:** las voces masculinas más graves se valoran como más atractivas (Feinberg et al.,
  2005). → Se eligió el estilo más grave (~90 Hz de mediana).

Fuentes: [Google — The first 5 seconds](https://business.google.com/aunz/think/marketing-strategies/creating-youtube-ads-that-break-through-in-a-skippable-world/),
[Color emotional perception, BMC Psychology](https://pmc.ncbi.nlm.nih.gov/articles/PMC12211919/),
[Information gap theory](https://psychologyfanatic.com/information-gap-theory/),
[Curiosity in marketing (review)](https://www.researchgate.net/publication/361196613_Consumers'_Situational_Curiosity_A_Review_of_Research_on_Antecedents_and_Consequences_of_Curiosity_in_Marketing-Relevant_Situations).

## 2 · RUIDO — guion final (tiempos reales)

| t (s) | Voz | Imagen |
|---|---|---|
| 0,0 | — | Rendija de luz ámbar y golpe (interrupción de patrón); la frase entera ya está en fantasma desde el fotograma 0 |
| 0,35–2,4 | «Hay un trabajo en tu empresa que nadie ve.» | Tipografía que se estampa palabra a palabra; «NADIE VE» se vuelve invisible (contorno que parpadea) |
| 2,7–4,7 | «Y puede estar costándote un sueldo entero.» | Rodillo de euros que gira como una tragaperras y frena en **UN SUELDO ENTERO** |
| 5,1–9,4 | «En treinta segundos te digo cuál es… y cómo quitártelo de encima.» | Anillo de cuenta atrás **30** que viaja a la esquina y se queda |
| 9,6–12,1 | «Copiar. Pegar. Responder. Buscar. Otra vez.» | Microplanos de interfaces genéricas cortados en semicorcheas |
| 12,2–12,6 | silencio | negro |
| 12,6–15,2 | «Esto no es trabajo. Es ruido.» | «RUIDO.» con desgarro, sostenido hasta la frase siguiente |
| 14,9–21,0 | «Datos copiados a mano. Herramientas que no se hablan. La misma pregunta, cada día, a la misma persona.» | Islas desconectadas, enlaces rotos, preguntas que se acumulan |
| 21,1 | — | Golpe a blanco |
| 21,5–35,8 | «En D-Code Partners convertimos ese ruido en un sistema. Analizamos cómo trabaja tu empresa. Diseñamos el sistema. Y lo conectamos todo. Lo repetitivo, lo hace la automatización. Lo que requiere pensar, la inteligencia artificial.» | ANALIZAMOS (diagnóstico en rojo) · DISEÑAMOS · CONECTAMOS · AUTOMATIZAMOS (las tarjetas se llenan de tareas resueltas) · + IA. Cada verbo se ajusta al ancho de su columna y ya no pisa las tarjetas |
| 36,1–38,1 | «Y tu equipo, por fin, a lo que importa.» | La cuenta llega a **00** en «por fin». Interfaces **diseñadas** (no capturas): «Todo al día», asistente, automatizaciones activas. Rótulo: «Interfaz ilustrativa» |
| 39,3–43,0 | «D-Code Partners. Sistemas inteligentes para empresas.» | Todo se recoge en el píxel azul → logotipo, lema y botón «Cuéntanos tu caso → dcodepartners.com» |

**Contradicción corregida:** se ha quitado «No se trata de usar inteligencia artificial». Ahora el reparto está
claro: lo repetitivo lo hace la automatización y lo que requiere pensar, la IA.

**Cuenta atrás:** marca 30 → 0 entre «segundos» (5,6 s) y «por fin» (36,6 s). Son 31,0 s reales: va un 3 % más
lenta que un reloj, algo que no se percibe.

## 3 · COMERCIALES v5 — guion final (tiempos reales)

**Qué cambia respecto a la v4.** La voz sonaba robótica, rápida y se preguntaba y respondía a sí misma sin respirar.
Ahora el guion es una **conversación**: PREGUNTA → PAUSA HUMANA (0,55–0,85 s) → RESPUESTA. La voz **no se ha
acelerado**: el vídeo se ha alargado (27 → 43 s) para que quepan las pausas, que es lo que pedía el encargo.
Para no alargarlo más se quitaron tres frases secundarias («En toda España» hablado —sigue escrito en pantalla—,
«No hace falta saber programar» y «Desde tu ciudad»). Estética, estructura, marca y el mensaje del 50 % se mantienen.

| t (s) | Voz | Imagen |
|---|---|---|
| 0,25–2,65 | «Estamos buscando comerciales.» | La oferta entera desde el fotograma 0: BUSCAMOS / COMERCIALES · SIN ESTUDIOS · SIN EXPERIENCIA · EN TODA ESPAÑA · 50 % DE CADA VENTA |
| 3,20–6,64 | «¿Necesitas estudios? ¿Experiencia?» | Tarjeta REQUISITOS; «¿ESTUDIOS?» «¿EXPERIENCIA?» en gris y **tres puntos** mientras la pregunta espera |
| *pausa 0,8* | — | la música baja 7 dB: la pausa se oye |
| 7,44–10,00 | «No. No te hace falta.» | Los tres requisitos se tachan · SIN ESTUDIOS. **SIN EXPERIENCIA.** |
| 10,55–11,75 | «Y lo mejor…» | «Y LO MEJOR…» (la base se filtra y se para) |
| 12,20–15,87 | «Te llevas el 50 % de cada venta.» | En el «50» exacto (13,21 s) pantalla naranja: TE LLEVAS EL **50 %** |
| 16,47–19,43 | «¿Y qué venderías, exactamente?» | ¿QUÉ VENDERÍAS? + tres puntos en la pausa |
| 20,27–25,64 | «Soluciones de automatización e inteligencia artificial para empresas.» | AUTOMATIZACIÓN · INTELIGENCIA ARTIFICIAL · PARA EMPRESAS |
| 26,19–31,87 | «Tú encuentras al cliente.» · «Nosotros nos encargamos de construirlo todo.» | TÚ / NOSOTROS + logotipo |
| 32,47–33,43 | «¿Te interesa?» | ¿TE INTERESA? + tres puntos |
| 34,18–38,10 | «Escríbenos por Instagram, o por correo, y te lo contamos.» | Mensaje por Instagram · dcodedepartment@gmail.com |
| 38,65–41,53 | «Vende con D-Code Partners.» | VENDE CON + logotipo; la base baja 16 dB para que la marca se oiga limpia · sello «50 % DE CADA VENTA» |

**QA medido sobre la mezcla** (`entrega/qa-audio-v5.json`, Whisper small sobre la mezcla, no sobre la voz sola):
error por palabra **0 %** en las 12 frases; voz por encima del fondo **7,6–23,6 LU** (la más justa, el «50 %», con
la caja registradora); único silencio > 0,35 s, el final (42,95–43,45 s). Texto: todo dentro de zona segura en los
1.303 fotogramas.

## 4 · EN AUTOMÁTICO — mini de YouTube (8,5 s)

Lenguaje distinto del vídeo largo: **papel claro, tinta y un solo azul, el del píxel del logotipo**, que es el
protagonista (cursor, transición y marca).

| t (s) | Voz | Imagen |
|---|---|---|
| 0,08–2,47 | «¿Sigues haciendo esto a mano?» | GANCHO: doce tareas manuales amontonadas («Copiar y pegar», «factura_FINAL(2).xls», «Pasar datos al CRM»…) y un cursor que no para de hacer clic. **La marca aparece arriba a la derecha en el segundo 1.** |
| 2,55–2,85 | — | El píxel azul del logotipo crece hasta llenar la pantalla |
| 2,82–4,58 | «D-Code Partners.» | …y vuelve a su sitio en el logotipo grande: **D-Code Partners** · AUTOMATIZACIÓN + IA PARA EMPRESAS |
| 4,88–6,89 | «Tu empresa, en automático.» | Las MISMAS doce tareas, en orden, se completan solas en cascada (12 A MANO → 12 EN AUTOMÁTICO), una nota por tarea |
| 7,07–8,50 | — | Cierre: logotipo + **dcodepartners.com** · «Automatización e IA para empresas» |

**QA medido** (`v3-mini/entrega/qa-audio.json`): error por palabra 0 % en las 3 frases; voz sobre el fondo
12,8–26,5 LU; sin silencios muertos; −14,0 LUFS; todo el texto dentro de zona segura.


## 4b · Revisión independiente (v4)

Un agente que no participó en el montaje revisó los dos vídeos fotograma a fotograma contra lo que se pidió. Se
corrigió lo que señaló:
- **Vídeo 2:** la oferta completa no se veía al principio → ahora está en pantalla desde el fotograma 0.
- **Vídeo 1:**
  - «RUIDO» duraba muy poco → se sostiene hasta la frase siguiente.
  - No había llamada a la acción al final → ahora hay un botón.
  - La tarjeta del asistente quedaba tapada → las tarjetas se han recolocado sin solapes.
  - Las pastillas chocaban con la cuenta atrás → se han bajado.
  - Las tarjetas del sistema eran esqueletos → ahora muestran tareas resueltas cuando llega la automatización.
  - Los globos eran pequeños → se han agrandado.
  - Había una letra fantasma en la llamada → se ha quitado.

Queda sin tocar una observación que no me corresponde decidir:
- Usa dcodedepartment@gmail.com, el único contacto que D-Code ya tenía. El revisor opina que un correo con
  dominio propio daría más confianza. No se ha inventado otro.

## 5 · Voces

### v5 (COMERCIALES y mini): Qwen3-TTS, voz «Bodega»
- **Motor:** Qwen3-TTS, demo oficial de Qwen en Hugging Face (con API, sin cuota ZeroGPU). Las tomas se generaron
  en el navegador del ordenador de Dirección, se descargaron a *Descargas* (autorizado en la conversación) y se
  importaron con `comun/importa_voz.py`, que recorta silencios y pasa a 48 kHz.
- **Por qué «Bodega» (masculina):** es la única voz del motor con acento de **España** medido. Prueba θ/s: las
  frases con c/z dan +6,4 dB de fricción aguda frente a +1,8 dB de la voz de referencia latinoamericana. La única
  femenina «de España» sonaba infantil y las demás no distinguen /θ/. El encargo de esta ronda pide «español de
  España, profesional, natural» sin fijar género; en la ronda anterior se había pedido mujer. **Si tiene que ser
  mujer, hace falta una locutora o una voz de ElevenLabs** (PENDIENTE de decisión, no bloquea).
- **Casting:** varias tomas por frase (3–4). Se midió error de Whisper, sílabas por segundo y variación de tono, y
  se eligió a oído dentro de las correctas. Se descartaron tomas lentas o exclamativas que el automático prefería
  (v2, v3, v4, v8 y v9 elegidas a mano). Tabla completa en `v2-vendedores/voz/manifest.json` y `v3-mini/voz/manifest.json`.
- **Límite honesto:** no puedo escuchar. Está medido que se entiende sobre la mezcla y el ritmo (pausas reales,
  4–5 sílabas/s); que suene humana es un juicio que tiene que confirmar Dirección.

### v4 (RUIDO): Supertonic 3


- **Lo que se intentó primero:**
  - ElevenLabs y HuggingFace están bloqueados desde este entorno.
  - Qwen3-TTS (2026, voz diseñada por descripción) sí se generó en el navegador de la app de escritorio.
  - Traer ese audio hasta aquí por el navegador lo bloqueó el sistema de permisos. No se ha forzado.
- **Lo que se usa:** **Supertonic 3** (Supertone, abril 2026, modelo OpenRAIL‑M con uso comercial permitido),
  descargado de las *releases* de GitHub de sherpa‑onnx. Es un modelo más reciente y expresivo que Kokoro.
- **Cómo se ha generado:**
  - Se sintetizan **frases completas**, no palabras sueltas, para que la entonación salga natural.
  - Cada frase se genera **9 veces** (3 velocidades × 3 tomas).
  - Se queda la toma que Whisper entiende sin errores y que tiene **más variación de tono**.
- **Medidas** (`voz/manifest.json`):
  - Variación de tono: vídeo 1, 12 de 18 frases por encima de 2,5 semitonos (rango 1,1–4,9); vídeo 2, las 10
    frases (rango 2,7–4,4). HIPÓTESIS: por debajo de ~2,5 st una voz suena plana. La voz anterior no se midió
    así: NO MEDIDO.
  - Acento de España: los estilos elegidos distinguen /θ/ de /s/. Las frases escritas con c/z dan 2,3–5,5 dB
    menos de energía fricativa aguda que las mismas frases con s. Es una prueba acústica indirecta, no una
    escucha.
- **Límite honesto:** no puedo escuchar. Está medido que se entiende (0 % de error sobre la mezcla final) y que
  entona más; **que suene humana no está medido**. Si no convence, cada frase es un archivo suelto: se puede
  cambiar por una locución de ElevenLabs o de un locutor con el mismo guion (`guion.json`), y el montaje se
  recoloca solo (`comun/monta.py` usa las duraciones reales).

## 6 · Cómo se reconstruye

```
VOZ_ST=<supertonic-3> VOZ_MODELOS=<whisper> python3 comun/voz_st.py v1-youtube   # tomas + casting
python3 comun/monta.py v1-youtube          # coloca la voz (plan.json) y calcula marcas
python3 comun/palabras.py v1-youtube       # tiempos por palabra
python3 v1-youtube/audio.py                # música, efectos y mezcla
VOZ_MODELOS=<whisper> python3 comun/analiza_audio.py v1-youtube
PLAYWRIGHT=… CHROMIUM=… node comun/render.mjs v1-youtube
python3 comun/final.py v1-youtube dcode-ruido-youtube-16x9
```
Igual con `v2-vendedores` / `dcode-comerciales-v5-9x16` y `v3-mini` / `dcode-en-automatico-youtube-16x9` (en la v5 la voz no se sintetiza aquí: se importa con `python3 comun/importa_voz.py <vídeo> elecciones.json`). Todo el sonido está sintetizado en
`comun/sintesis.py`. No hay música, samples ni imágenes de terceros: en la v4 no queda ninguna captura; las
interfaces se dibujan en la escena.
