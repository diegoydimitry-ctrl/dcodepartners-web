#!/bin/sh
# Renderiza las tres versiones en cola (vertical, 4:5 y vertical limpia) y la portada.
cd "$(dirname "$0")"; mkdir -p render
node render.cjs --pagina "crm.html?captura" --salida render/v916.mp4 > render/v916.log 2>&1
node render.cjs --alto 1350 --pagina "crm.html?captura" --salida render/v45.mp4 > render/v45.log 2>&1
node render.cjs --pagina "crm.html?captura&limpio" --salida render/limpio.mp4 > render/limpio.log 2>&1
echo FIN > render/cola.fin
