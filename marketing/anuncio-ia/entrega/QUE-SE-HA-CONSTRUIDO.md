# Esto no es un vídeo · qué se ha construido de verdad

Reel de 33,5 s, 1080×1920, 30 fps. Cada imagen sale de un programa que funciona en el navegador. No se ha usado ningún generador de imágenes ni de vídeo, ni imágenes de archivo.

## Qué hace Claude y qué no (lo que se ha tenido en cuenta)

- **Claude escribe código.** Las cinco escenas son código: GLSL, JavaScript, Three.js, HTML y CSS. La música también: Python que sintetiza cada sonido.
- **Claude no genera imágenes, vídeo ni audio por sí mismo.** Todo lo que se ve lo dibuja el navegador al ejecutar ese código. Si un día se usa un generador (por ejemplo ElevenLabs para una voz), hay que decirlo en el vídeo o en el texto.
- **No sale a la primera.** Cada escena necesitó varias rondas de corrección, por ejemplo:
  - imagen al revés, terreno lavado y escalonado, vuelo lento;
  - textos que se pisaban y etiquetas desfasadas en la web;
  - tinta que no se movía y después se emborronaba;
  - ciudad sobreexpuesta y con el sol al otro lado.

  Eso es lo que hace D-Code: dirigir, revisar y llevarlo a algo que funcione.
- **«Fotorrealista» es una aspiración, no una descripción literal.** El paisaje es realista y con buena luz, pero sale de reglas matemáticas, sin fotos ni texturas. Se nota que es un render.

## Las escenas

| Escena | Archivo | Qué es | Interacción en directo |
|---|---|---|---|
| Vuelo | `demos/vuelo.html` (345 líneas) | Juego en WebGL2. Terreno generado con ruido, dibujado trazando rayos en la GPU. Lago con reflejos, nieve, niebla, sombras y 8 anillos con contador. | Teclado W/A/S/D. |
| Reloj | `demos/web3d.html` (237) | Web 3D con Three.js. El reloj se construye entero en código: caja, cristal de zafiro, esfera, agujas y engranajes con dientes. | Scroll real de la página (ratón o dedo). |
| Tinta | `demos/fluido.html` (153) | Simulación de fluidos en la GPU (advección, presión y vorticidad) con tinta sobre papel. | Ratón o dedo. |
| Ciudad | `demos/ciudad.html` (137) | Ciudad de maqueta generada por reglas, con sombras suaves y oclusión ambiental. | Es una animación; no se controla. |
| Finance | D-Code Finance (repositorio `dcode-finance-demo`) | La aplicación de verdad en modo demostración, en local y con datos inventados. Se ve el aviso «DEMOSTRACIÓN · datos inventados». | Clics reales: entrar, bajar por el panel, cambiar tesorería a 60 y 90 días, abrir el radar. |
| Proceso | `demos/proceso.html` | Pantalla con la instrucción del encargo, copiada tal cual, y después el código real del archivo de la demo. | No se controla. |

Código común: `demos/comun.js` (119 líneas). Montaje: `montaje/montaje.html` (207). Música: `montaje/audio.py` (345).

## Lo que conviene saber (y decir si alguien pregunta)

1. **La entrada de la grabación es un guion.**
   - Las teclas del juego las pulsa un piloto automático; el panel inferior muestra cuáles.
   - El scroll y el dedo de la tinta siguen una trayectoria escrita.

   Se hizo así para que la toma saliera limpia y se pudiera repetir. En directo, todo eso lo hace la persona.
2. **Se grabó fotograma a fotograma, no en tiempo real.**
   - Un navegador sin pantalla, con dibujo por software, calcula cada fotograma y lo guarda: 30 por segundo de vídeo.
   - Cuánto rinde en tiempo real en un móvil o un portátil: **NO MEDIDO**.
3. **La pantalla del proceso es una animación de texto real.**
   - La instrucción y el código son los auténticos.
   - Pero el código no se escribió a esa velocidad delante de la cámara: se muestra el archivo terminado línea a línea.
4. **D-Code Finance no se hizo para el anuncio.** Es nuestro producto y se ve en su modo demostración. No sale ningún dato real de clientes.
5. **Piezas de terceros:**
   - Three.js 0.186.1 (licencia MIT);
   - las fuentes Archivo y Martian Mono (licencia OFL).

   El resto lo ha escrito Claude en esta sesión, bajo la dirección del equipo.

## Sonido

- Música a 120 BPM, en La menor, sintetizada en Python: bombo, caja, platos, impactos, subidas, golpes de aire, clics y tecleo.
- Cada golpe cae en un corte: el anillo, los cuatro cortes de las creaciones, los clics en Finance, el tecleo del proceso, la subida antes del mosaico y el logo.
- Sin muestras ni licencias de terceros. ElevenLabs Music no se ha usado porque el plan gratuito no permite descargar ni usar comercialmente.
- Volumen (MEDIDO con ffmpeg ebur128): −13,9 LUFS integrado y pico real de −2,4 dBFS.
- El vídeo se entiende sin sonido: los textos cuentan la historia.
- Lo que no se ha podido hacer: **escucharlo**. Se ha revisado con medidas y espectrograma. Antes de publicar conviene oírlo una vez con auriculares y otra con el altavoz del móvil.

## Estructura del reel

| Segundos | Qué pasa | Texto |
|---|---|---|
| 0–2,5 | Vuelo sobre el lago, sin interfaz. En la B: la instrucción y después el resultado | «Esto no es un vídeo.» · B: «Le pedimos esto a una IA:» → «…y construyó esto.» |
| 2,5–5 | Aparecen el contador y las teclas; se cruza el primer anillo | «Es un juego. Y se juega.» |
| 5–9 | Cuatro golpes: reloj, tinta, ciudad y app | «Una web 3D.» · «Una simulación de fluidos.» · «Una ciudad que se construye sola.» · «Una app de verdad.» |
| 9–15,5 | Se ve que responden: scroll, dedo y clics | «No son imágenes.» · «Se navega.» · «Se toca.» · «Se usa.» |
| 15,5–23 | Instrucción → código → resultado, dos veces | «Le explicamos lo que queremos.» · «La IA escribe el código.» · «Nosotros lo dirigimos y lo revisamos.» |
| 23–27,5 | La ciudad se levanta; mosaico con todo a la vez | «Esto ya se puede construir.» · «Juegos. Webs. Apps. Simulaciones.» |
| 27,5–33,5 | Cierre | «No se trata de imaginar el futuro. Se trata de construirlo.» → logo → «¿Quieres saber cómo se hizo? Comenta IA y te mandamos las instrucciones.» |
