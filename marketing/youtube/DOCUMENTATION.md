# «El bucle» — anuncio de YouTube · D-Code Partners

Pieza de 45 s para **YouTube skippable in-stream**, 16:9, más un corte de 20 s
y un bumper de 6 s derivados del mismo montaje.

---

## 1 · Antes que nada: qué NO lleva esta entrega

Tres cosas del encargo no se han podido hacer aquí, y ninguna es una
decisión creativa. Van primero para que nadie las descubra viendo el vídeo.

**No lleva voz en off.** En este entorno no hay ninguna credencial de
ElevenLabs ni de ningún otro motor de voz —se comprobó en las variables del
contenedor y en las de los cuatro proyectos de Vercel—, y el proxy de salida
sólo deja pasar npm, PyPI, GitHub y la API de Anthropic: no hay forma de
llegar a un servicio de síntesis ni de descargar los pesos de un modelo
local (huggingface.co está bloqueado). Se podría haber montado un motor
local de los que sí se descargan desde GitHub, pero una voz claramente
sintética habría suspendido el propio criterio del encargo («¿la voz parece
realmente humana? Si no: REHÁZLO»), y un anuncio publicado con una voz
robótica es peor que uno sin voz.

Así que la pieza está construida para **sostenerse sin narración**: el guion
está íntegro en pantalla, escrito, con la misma cadencia que tendría dicho.
El §7 de este documento trae el guion con códigos de tiempo exactos; cuando
haya una credencial, la voz entra encima sin tocar la imagen (ver §8).

**No se ha podido analizar el anuncio de Finance de Instagram.** Se buscó en
los cinco repositorios del proyecto y no hay ni un solo fichero de vídeo,
audio o pieza de marketing: no está versionado en ninguna parte. Lo que se
ha hecho, por tanto, es alejarse deliberadamente de lo que suele ser un reel
vertical de producto financiero, y queda anotado en §4 como una **suposición
sin verificar**.

**No hay asistente de llamadas.** El encargo pedía enseñarlo como producto
real. No existe: el catálogo publicado en dcodepartners.com ofrece
«automatización de procesos», «agentes de IA» e «integraciones», y en n8n no
hay ningún flujo de telefonía. Inventar una pantalla habría roto la regla de
no inventar funcionalidades, así que ese hueco lo ocupa **el agente de IA
que sí existe** —«Pregunta a Finanzas», dentro de D-Code Finance—, con la
frase cambiada a «Un asistente que responde con tus datos».

---

## 2 · Concepto

> Una tarea se repite. Al principio parece normal. Al cabo de diez segundos
> hay cuarenta ventanas haciendo lo mismo a la vez y ya no parece normal.
> Entonces todo se para en seco.

El anuncio no empieza contando lo que hace D-Code. Empieza **dentro del
problema**, sin logo, sin claim y sin presentación, con un gesto que
cualquiera que trabaje con un ordenador reconoce en dos segundos:
seleccionar un dato en una hoja, copiarlo, cambiar de ventana, pegarlo,
volver.

La estructura sigue el arco emergente que Google recomienda para YouTube
—arrancar arriba, marca dentro, giro inesperado, varios picos— en vez del
arco de televisión:

| Tramo | Función | Pico |
|---|---|---|
| 0–5 s | El gesto reconocible, en macro, acelerando | **Atracción** |
| 5–12 s | La repetición se multiplica hasta saturar | Reconocimiento |
| 12–18 s | **Corte en seco. Silencio. La imagen se congela** | **Giro** |
| 18–24 s | El caos se ordena y se conecta | Alivio |
| 24–36 s | Cuatro productos reales, cuatro cortes secos | **Prueba** |
| 36–41 s | Vuelta a la persona: una frase escrita a mano | Cercanía |
| 41–45 s | Marca y llamada basada en el problema | **Dirección** |

El pico que sostiene la pieza es el del segundo 12: el sonido desaparece del
todo durante seis décimas. En un anuncio que hasta ese momento ha estado
subiendo de densidad, el silencio es el acontecimiento.

---

## 3 · Guion

Todo el texto aparece escrito en pantalla. Ni una línea de este guion afirma
nada que no sea comprobable.

| t | En pantalla |
|---|---|
| 1,55 | ¿Cuánto tiempo pierdes haciendo esto cada día? |
| 4,75 | Copiar de un sitio a otro. |
| 6,15 | Responder lo mismo otra vez. |
| 7,45 | Buscar el dato que ya existe. |
| 8,70 | Comprobar que está hecho. |
| 10,15 | Y ya lo has normalizado. |
| 13,15 | Pero muchas de esas tareas |
| 15,35 | no deberían hacerse a mano. |
| 19,05 | Miramos cómo funciona tu negocio |
| 21,55 | y construimos el sistema que lo hace por ti. |
| 24,30 | Un sistema financiero conectado. |
| 27,35 | Una aplicación propia para tu negocio. |
| 30,40 | Un asistente que responde con tus datos. |
| 33,40 | Y un sistema que lo conecta todo. |
| 37,15 | No necesitas saber de IA. |
| 38,85 | Ni de programación. |
| 41,00 | Solo necesitas saber qué problema tienes. |
| 42,55 | D-CODE PARTNERS |
| 43,35 | Cuéntanos qué te está haciendo perder tiempo. · dcodepartners.com |

Y una frase más, que la escribe el usuario dentro del plano (36,75 → 38,80):

> Tardo tres días en pasar los pedidos al sistema.

seguida, a los 39,05, de la respuesta del sistema:

> Hecho automáticamente, cada día, a las 8:00.

---

## 4 · Cómo se diferencia del anuncio de Finance

No se ha podido ver, así que esto es una lista de decisiones tomadas **contra
el lenguaje habitual de un reel vertical de producto financiero**, no contra
esa pieza en concreto. Queda como suposición.

| Lo que suele hacer un reel de producto | Lo que hace esta pieza |
|---|---|
| 9:16, corte rápido desde el primer fotograma | 16:9, un solo movimiento continuo de doce segundos |
| Abre con marca o con claim | La marca no aparece hasta el segundo 21, y pequeña |
| Tarjetas de interfaz flotando y deslizándose | Pantallas en el espacio, con sombra de contacto y foco |
| Contadores de cifras subiendo | Ni un número animado |
| Degradado de marca en todas partes | El degradado aparece **una sola vez**, en el cierre |
| Música electrónica de catálogo en bucle | Banda sintetizada, con un silencio total en mitad |
| Texto que entra deslizándose | Texto que se materializa por foco y peso |

---

## 5 · Qué se ve, y de dónde sale

**Las cuatro pantallas de producto son capturas reales**, tomadas de las
aplicaciones corriendo en local durante esta sesión, no maquetas:

| Plano | Producto | Pantalla | Cómo se obtuvo |
|---|---|---|---|
| 24,0–27,0 | D-Code Finance | Panel financiero | `dcode-finance` en modo demostración (`DATA_SOURCE=mock`), puerto 3100 |
| 27,1–30,1 | D-Code Partners App | Procesos de la empresa | `dcode-partners-app` con PostgreSQL local y su siembra real, puerto 3300 |
| 30,1–33,1 | Agente de IA | Pregunta a Finanzas | `dcode-finance`, misma instancia |
| 33,1–36,2 | D-Code OS | El pulso del día | `dcode-os` con PostgreSQL local, migraciones y las dos siembras, puerto 3200 |

Capturas a 3200 × 2000 (1600 × 1000 CSS a `deviceScaleFactor` 2), en
`_assets/capturas/`. Los datos que se leen son los de las siembras de
demostración de cada producto; en el panel de Finance se lee, de hecho, la
propia advertencia del producto de que son datos de demostración.

**Las ventanas del primer acto están dibujadas**, y a propósito. Son la
dramatización del trabajo repetitivo de cualquier empresa, no una pantalla
de D-Code, así que no llevan ni un nombre de cliente ni una cifra que pueda
leerse como real: filas numeradas, barras grises y un importe. Lo que tiene
que reconocerse es el gesto, no el dato.

Dos descartes, por si vuelven a plantearse:

- La pantalla de inicio de la App de Partners se sustituyó por la de
  Procesos. La primera es real y está bien, pero lo que enseña es la lista
  de bloqueos legales de la propia D-Code: en un anuncio se lee al revés de
  lo que se quiere decir.
- El encuadre del pulso de D-Code OS se cerró sobre el titular para dejar
  fuera dos rótulos de «no se ha podido leer». Es un estado vacío honesto
  del producto, pero en un anuncio parece un fallo.

---

## 6 · Imagen

Todo el vídeo se dibuja en un `canvas` de 3840 × 2160, fotograma a
fotograma, desde `_build/escena.html`. No hay vídeo generado por IA: no hay
credenciales para ello en este entorno, y una escena generada mediocre
—manos deformes, texto ilegible— habría sido peor que no tenerla. El
realismo se busca por otro camino: **contenido real y óptica real**.

- Cámara virtual con deriva de mano (suma de senos, sin aleatoriedad viva).
- Profundidad de campo por capas: lo lejano se dibuja en un lienzo aparte y
  se desenfoca, no se aplica un desenfoque global.
- Aberración cromática, viñeta y grano de película, los tres muy contenidos.
- Sombra de contacto y un solo reflejo diagonal en cada pantalla.
- El texto entra por foco y peso, nunca deslizándose.

**Es determinista.** `pintaFrame(n)` depende sólo de `n`: el grano, la deriva
de cámara y el desorden de la retícula salen de una función de ruido
reproducible. El mismo rango de fotogramas da siempre la misma imagen, que es
lo que permitió repartir el render en tres procesos y volver a montarlo sin
que se note una costura.

Paleta tomada de los tokens reales del sitio (`assets/css/dcp8.css`):
fondo `#05070c`, tinta `#f5f8ff`, y los acentos `#4dd0e1`, `#7c6cff`,
`#ff6b9d`, `#ffb43a`, uno por producto. Tipografías: Space Grotesk
(titulares), Inter (texto), JetBrains Mono (rótulos e interfaz), las tres
desde `assets/fonts/`.

---

## 7 · Sonido

Todo sintetizado en `_build/audio.html` con `OfflineAudioContext`: no hay
biblioteca de efectos ni música de catálogo. Dos motivos: una pista comprada
se parece a sí misma allá donde suene —y el encargo pedía no parecerse a
nada anterior—, y los golpes del primer acto tienen que caer exactamente
donde cae el gesto. **La tabla de ciclos del audio es la misma que la de la
imagen**, así que la sincronía no se ajusta a oído: es la misma cuenta.

- **Efectos**: teclas (golpe de aire + cuerpo de plástico), clic de ratón,
  barrido de cambio de ventana, golpe grave al pegar. Cincuenta y cuatro
  ventanas suenan a la vez, cada una con su desfase y su distancia.
- **Tensión**: un armónico que sube de 110 a 440 Hz entre el segundo 3 y el 12,
  y que nadie identifica hasta que desaparece.
- **El corte**: entre 12,00 y 12,62 no hay absolutamente nada salvo un pitido
  de oído a 6,1 kHz y −40 dB.
- **Música**: un motivo de tres notas en re. En el acto 2 es menor; al llegar
  la solución la tercera sube y el mismo motivo se vuelve mayor. No hay
  cambio de tema: hay un cambio de modo, que es lo que suena a alivio y no a
  épica de catálogo.
- **Acentos de producto**: Finance, un brillo agudo y preciso (1175 Hz);
  App, uno cálido (880 Hz); Asistente, aire (1568 Hz); OS, cuerpo (587 Hz).
  Cada uno con su golpe grave debajo.
- **Reverberación** por convolución con dos impulsos sintetizados (0,9 s y
  3,4 s).

Medido sobre la entrega: **−14,4 LUFS integrado**, **pico real −1,5 dBTP**,
rango dinámico 7,8 LU tras la normalización de dos pasadas. Es lo que
YouTube espera; sin normalizar estaba a −25,0 LUFS.

---

## 8 · Cuando haya voz

La imagen no hay que tocarla. El guion del §3 ya lleva los tiempos, y las
frases en pantalla están escritas para poder leerse **a la vez** que se
dicen, no en vez de.

1. Grabar o sintetizar las diecisiete frases con los códigos de tiempo del §3.
   Voz masculina española, 25–40, natural y segura; interpretación por
   tramos: intriga en el gancho, ritmo creciente en el problema, seguridad
   en la solución, precisión en los productos, calma en el cierre.
2. Bajar la banda entre 4 y 6 dB bajo cada frase (`sidechaincompress` sirve).
3. Volver a normalizar el conjunto a −14 LUFS / −1,5 dBTP.
4. Volver a multiplexar sobre el máster 4K sin recodificar la imagen:
   `ffmpeg -i dcode-youtube-ad-45s-4k.mp4 -i voz-mezcla.wav -map 0:v -map 1:a -c:v copy ...`

---

## 9 · Ficheros

| Fichero | Qué es |
|---|---|
| `dcode-youtube-ad-45s-master.mp4` | **La entrega.** 1920 × 1080, 30 fps, H.264 High, AAC 320 kb/s |
| `dcode-youtube-ad-20s.mp4` | Corte de 20 s |
| `dcode-youtube-ad-6s.mp4` | Bumper de 6 s |
| `_build/escena.html` | La película entera: una función de `t` |
| `_build/audio.html` | Banda sonora y diseño sonoro |
| `_build/render.mjs` | Render por fotogramas (troceable) |
| `_build/montar.sh` | Montaje, escalado y cortes |
| `_assets/capturas/` | Capturas reales de producto, 3200 × 2000 |
| `_assets/fuentes/` | Las tres tipografías de marca |

Los cortes de 20 s y 6 s **no son otro montaje**: son tramos del máster, con
los mismos fotogramas y los mismos trozos de banda, empalmados con un
encadenado de 0,25 s. Por eso suenan y se ven como la pieza larga.

El máster a 4K (`_build/dcode-youtube-ad-45s-4k.mp4`) y los 1350 fotogramas
intermedios no se versionan: pesan más de 4 GB y se regeneran enteros con
`node _build/render.mjs && _build/montar.sh`, porque el render es
determinista.

---

## 10 · Reproducirlo

```bash
cd marketing/youtube/_build
npm i playwright@1.56.0 ffmpeg-static ffprobe-static   # chromium ya instalado
node render.mjs                                        # 1350 fotogramas a 4K
node rend-audio.mjs                                    # banda.wav
./montar.sh                                            # máster + cortes
```

Para repartir el render: `node render.mjs 0 450 frames` en tres procesos con
rangos distintos. Los fotogramas son independientes.
