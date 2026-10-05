#!/bin/sh
# Cola de render: cada línea de render/cola.txt es «escena [parámetros extra]». Se procesa en orden, de una en una.
cd "$(dirname "$0")"
while true; do
  L=$(flock render/cola.lock sh -c 'L=$(head -n1 render/cola.txt 2>/dev/null); [ -n "$L" ] && sed -i 1d render/cola.txt; echo "$L"')
  if [ -z "$L" ]; then sleep 5; continue; fi
  E=$(echo "$L" | cut -d' ' -f1); X=$(echo "$L" | cut -s -d' ' -f2)
  node render.cjs --pagina "mundo.html?captura&e=$E$X" --dir render/$E > render/$E.log 2>&1
done
