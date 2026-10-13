# «Los errores que no avisan» (54,6 s · 9:16 · con voz)

Vídeo divulgativo: los genes renombrados por la conversión automática de Excel (HGNC, 2020), el estudio de Ziemann et al. (2016)
y los 15.841 positivos de COVID que Inglaterra dejó fuera del recuento por el límite de 65.536 filas del formato .xls (oct. 2020).

1. `voz.py` — locución con Kokoro v1.0 (voz em_alex, modelo abierto, vía sherpa-onnx) → `audio/voz.wav` y `voz.json` (tiempos de frases y subtítulos). Modelos en `tts/` (no versionados: releases de GitHub de k2-fsa/sherpa-onnx).
2. `python3 -m http.server 8773 --bind 127.0.0.1` y `./cola.sh` → `render/imagen.mp4` (la animación lee `voz.json`).
3. `python3 banda.py` → `audio/mezcla.wav` (música y efectos sintetizados + voz, con la música bajando bajo la voz).
4. `./final.sh` → `entrega/` (MP4 a −14 LUFS y portada).
Las hojas de cálculo son recreaciones genéricas (no capturas de Excel) y se rotulan como tales.
