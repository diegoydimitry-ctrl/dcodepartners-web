# Reel D-Code Partners — «Hay un nivel» (motivacional, servicios premium)

Duración **45,6 s** · Formato **9:16 (1080×1920)** · 30 fps
Pieza motivacional que sí presenta los servicios de D-Code Partners,
a diferencia del anuncio 7 (que los evitaba deliberadamente). Mismo
motor y estética que el anuncio 7: Ken Burns sobre fotografía real,
voz Arconte, flash de apertura, subtítulos incrustados.

---

## 1. Guion y tiempos

Las líneas 5, 6 y 7 son casi textuales de las páginas reales de
servicio — no se inventa lo que ofrece D-Code:
- `servicios/agentes-ia.html` → "Atención al cliente y ventas que no
  hacen esperar a nadie."
- `servicios/automatizacion-ia.html` → "Procesos que se ejecutan
  solos, 24 horas al día."
- `servicios/integraciones.html` → "Tus herramientas, conectadas
  entre sí de verdad." (parafraseada: "conectadas de verdad, sin
  fricción.")

| Entrada | Salida | Texto |
|---------|--------|-------|
| 0,30 | 4,61 | Hay un nivel en el que las empresas no compiten por precio. |
| 4,96 | 11,36 | Compiten por lo que no se ve: la velocidad, la precisión, el cuidado. |
| 11,71 | 14,90 | Mientras unos siguen gestionando todo a mano, |
| 15,20 | 17,71 | otros ya operan de otra forma. |
| 18,11 | 23,13 | Atención al cliente y ventas que no hacen esperar a nadie. |
| 23,53 | 28,78 | Procesos que se ejecutan solos, 24 horas al día. |
| 29,18 | 33,54 | Herramientas conectadas de verdad, sin fricción. |
| 33,99 | 42,43 | En D-Code Partners construimos sistemas premium para empresas que no se conforman con lo básico. |

Voz: ElevenLabs, **Arconte — Evocative & Magnetic** (misma voz validada
en el anuncio 7).

---

## 2. Escaleta visual

| # | Entrada | Salida | Imagen |
|---|---------|--------|--------|
| 1 | 0,00 | 11,71 | Skyline premium al atardecer (ambición, gancho) |
| 2 | 11,71 | 18,11 | Papeleo manual, escritorio antiguo (contraste — "a mano") |
| 3 | 18,11 | 23,53 | Interfaz de chat IA en un móvil (agentes de IA) |
| 4 | 23,53 | 29,18 | Sala de servidores premium (automatización) |
| 5 | 29,18 | 33,99 | Red de nodos conectados, dashboards (integraciones) |
| 6 | 33,99 | 43,90 | Manos cerrando un portátil, escritorio premium (cierre) |
| — | 43,90 | 45,60 | Tarjeta de marca: logo + "Agentes de IA · Automatización · Integraciones" + dominio |

Fotografías generadas con Figma (`generate_image`, 768×1376 px reales),
mismo método que el anuncio 7 — descargadas vía `get_screenshot` en
modo `enableBase64Response` para no depender de la red bloqueada hacia
`www.figma.com`. Mismo gancho de apertura que el anuncio 7: flash de
0,3 s con tres cortes duros antes de aterrizar en la escena 1.

---

## 3. Música y cierre

**Música propia, distinta de la del anuncio 7** (`audio8.py` →
`out/banda-sonora-8.wav`) — el usuario pidió explícitamente no repetir
la pista subida para el anuncio 7. Sintetizada desde cero en Python
puro (sin muestras, sin librerías externas): pista original y libre de
derechos por construcción, sin ninguna duda de licencia para publicar
en Instagram, TikTok o YouTube. Carácter tech/corporativo moderno —
pulso de bajo tipo synth (`saw_bass`), arpegios digitales brillantes
(`arp`) y un "stinger" + barrido (`riser`/`stinger`) sincronizado en
cada corte de escena del montaje (t = 0, 11,71, 18,11, 23,53, 29,18,
33,99), con la energía creciendo escena a escena hasta el crescendo
del cierre — nada de piano ambiental ni de los timbres del anuncio 7.

Atenuación bajo cada línea de voz calculada directamente en Python
(`duck_gain()`, multiplicando cada muestra), no vía expresión de
ffmpeg — más fiable aún que el método de tramos usado en el anuncio 7,
y verificado numéricamente antes de mezclar (0,38× bajo voz, 1,0× en
los huecos).

El cierre, a diferencia del anuncio 7, sí nombra los tres servicios
(una sola línea, sin lista de bullets) porque esta pieza está pensada
para presentar el catálogo, no para pasar desapercibida.

---

## 4. Entregables

| Archivo | Qué es |
|---------|--------|
| `out/dcode-ad8-9x16-vo.mp4` | Máster vertical — locución, música y subtítulos |
| `out/dcode-ad8-portada-9x16.png` | Portada del Reel |
| `voces/ad8/01.mp3` … `08.mp3` | Locución sin editar (ElevenLabs, voz Arconte) |
| `assets/stock-ad8/*.png` | Las 6 fotografías generadas (Figma) |
| `out/banda-sonora-8.wav` | Música sintetizada, sin voz, por separado |

---

## Nota importante

**No se ha publicado ni programado nada en las cuentas de D-Code.**
