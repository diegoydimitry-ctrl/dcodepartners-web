# Reel «Es una web» (30,1 s · 1080×1920)

Siete mundos 3D distintos, cada uno una página web real (Three.js / WebGL) renderizada fotograma a fotograma, con revelación, D-Code y CTA «Comenta WEB».

| Tiempo | Escena (`mundo.html?e=…`) | Qué pasa |
|---|---|---|
| 0–2,6 | `reloj` | Gancho: un reloj desmontado en el aire se ensambla solo |
| 2,6–5,3 | `coche` | Túnel de arcos de luz con reflejos reales; corte al asiento |
| 5,3–8,5 | `casa` | Villa sobre el mar: llegamos rozando el agua y se enciende |
| 8,5–11,3 | `ajedrez` | La gravedad se apaga y las piezas despegan |
| 11,3–14,1 | `bolas` | 300 esferas con física que se apartan del cursor |
| 14,1–17,1 | `dragon` | Una escultura cambia de materia: cristal → oro → metal líquido → luz |
| 17,1–20,7 | `particulas` | 260.000 partículas escriben «ES UNA WEB.» |
| 20,7–23,6 | muro | El plano se abre: todo eran ventanas de navegador |
| 23,6–26,1 | D-Code | Logo y nombre |
| 26,1–30,1 | CTA | «¿Quieres una web así?» → «Comenta WEB» → «y te mandamos los prompts.» |

## Cómo se genera
1. Servir esta carpeta: `python3 -m http.server 8771 --bind 127.0.0.1`
2. Clips: `node render.cjs --pagina "mundo.html?captura&e=reloj" --dir render/reloj` (igual con el resto; `cola.sh` los encadena). Copias pequeñas para el muro en `render/<escena>_m/` (ffmpeg `scale=432:768`).
3. `python3 banda.py` (diseño de sonido y música, todo sintetizado).
4. `./final.sh` → `render/reel-imagen.mp4` (final), `render/reel-limpio.mp4` (sin textos, hasta el logo) y la portada en `render/fotos/`.

Sin `?captura`, cada escena se reproduce en vivo en el navegador.

## Créditos obligatorios al publicar
Modelos con licencia CC-BY 4.0 (glTF Sample Assets, Khronos): «Chronograph Watch» © Darmstadt Graphics Group (marcas de terceros retiradas) · «Car Concept» © Khronos Group (matrícula y emblema ocultos) · «A Beautiful Game» © ASWF / MaterialX · «Dragon Attenuation» (dragón de Stanford) · «Glam Velvet Sofa» © Wayfair. HDRI: Poly Haven, CC0.
