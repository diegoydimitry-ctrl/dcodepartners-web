# Reel «¿Quieres un CRM de este nivel?» (28,6 s · sin voz)

Un CRM inventado para el vídeo (no reproduce ningún producto existente ni el CRM de Sánchez Rubio). Es una página web real
(HTML + CSS 3D + Three.js) animada de forma determinista y capturada fotograma a fotograma; música y efectos sintetizados aquí.

| Tiempo | Qué pasa |
|---|---|
| 0–2,4 | Gancho: aparece la cápsula «¿Quieres un CRM de este nivel?» tecleándose; las tarjetas del panel llegan volando desde el fondo y encajan |
| 2,4–5,4 | Panel principal: los KPI cuentan, la gráfica se dibuja, el cursor señala septiembre y pulsa «3D» |
| 5,4–9,2 | Ventas por línea en 3D: las barras crecen del cristal; el cursor arrastra y gira la gráfica |
| 9,2–12,8 | Oportunidades: se arrastra «Clínica Arce» a Ganado; chispas, el total sube a 110.500 € |
| 12,8–15,6 | Ficha del cliente: anillo 3D de salud que se llena hasta 92, actividad y «Programar arranque» |
| 15,6–19,6 | Agenda: aparece la reunión nueva, se mueve una demo de martes a miércoles y llega el aviso |
| 19,6–22,2 | Vista de conjunto: todas las pantallas sobre una mesa inclinada · «Todo en un solo sitio.» |
| 22,2–24,4 | Icono 3D de D-Code · «CRM a medida para tu empresa» |
| 24,4–28,6 | CTA: «¿Quieres un CRM así?» → «Comenta CRM» → «y te enseñamos cómo sería el tuyo.» |

## Cómo se genera
1. `python3 -m http.server 8772 --bind 127.0.0.1` en esta carpeta (sin `?captura` la página se reproduce en vivo).
2. `./cola.sh` → `render/v916.mp4`, `render/v45.mp4` (4:5) y `render/limpio.mp4` (sin textos, hasta el logo).
3. `python3 banda.py` y `python3 banda.py --limpio` → `audio/`.
4. `./final.sh` → `entrega/` (MP4 a −14 LUFS y portadas).

Los tiempos están en `tiempos.json` y los leen tanto la animación como la banda sonora. Fuentes: Geist, Geist Mono y Bricolage
Grotesque (OFL, autoalojadas). Sin modelos ni sonidos de terceros.
