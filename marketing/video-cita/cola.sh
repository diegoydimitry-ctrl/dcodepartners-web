#!/bin/sh
cd "$(dirname "$0")"
node render.cjs --pagina "video.html?captura" --salida render/imagen.mp4 > render/imagen.log 2>&1
echo FIN > render/cola.fin
