#!/bin/sh
# Monta el reel final, la versión limpia y la portada, y mezcla el audio a −14 LUFS.
cd "$(dirname "$0")"
node render.cjs --pagina "montaje/index.html?captura" --salida render/imagen.mp4 > render/m1.log 2>&1
node render.cjs --pagina "montaje/index.html?captura&limpio" --salida render/limpio.mp4 > render/m2.log 2>&1
node render.cjs --pagina "montaje/portada.html" --nombre portada --fotos 0 > render/m3.log 2>&1
M=$(ffmpeg -hide_banner -i audio/banda.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
I=$(echo "$M" | python3 -c "import sys,json;j=json.load(sys.stdin);print(f\"measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}\")")
for v in imagen limpio; do ffmpeg -loglevel error -y -i render/$v.mp4 -i audio/banda.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:$I:linear=true,aresample=48000" -c:v copy -c:a aac -b:a 256k -movflags +faststart -shortest render/reel-$v.mp4; done
echo FIN > render/final.log
