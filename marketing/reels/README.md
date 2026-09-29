# Reels de contenido (Instagram) · D-Code Partners

Dos Reels «de cuenta tecnológica», no anuncios:
- `ia/`: 5 IA que deberías conocer.
- `webs/`: 5 webs que parecen del futuro.

Se montan con **grabaciones reales de pantalla** (guía de grabación en `guia/GUIA-GRABACION-REELS.pdf`), no con simulaciones.

| Paso | Comando |
|---|---|
| 1. Grabaciones | Copiar las tomas a `grabaciones/` con los nombres de la guía |
| 2. Tramos | Ajustar en `<reel>/reel.json` los `in`/`dur`, la cámara y los clics de cada segmento |
| 3. Extraer | `python3 comun/prepara.py <reel>` |
| 4. Revisar | `node comun/render-reel.mjs <reel> --fotos 0.5,3,6` |
| 5. Sonido | `python3 comun/audio-reel.py <reel>` |
| 6. Render | `node comun/render-reel.mjs <reel>` |
| 7. Entrega | `python3 comun/final-reel.py <reel> <nombre>`: versión final y versión sin música, a −14 LUFS |

**Cámara de cada segmento:** fotogramas clave `[t, modo, focoX, focoY, zoom]`.
- `lleno`: la grabación llena la pantalla vertical.
- `ventana`: la grabación entera flota sobre su propio fondo desenfocado.
- El paso de un modo a otro es continuo.

**Grupos:** segmentos con el mismo `g` son la misma herramienta o web y comparten el rótulo.

**Variables de entorno:** `PLAYWRIGHT` y `CHROMIUM`, como en `../anuncios-v3`.
