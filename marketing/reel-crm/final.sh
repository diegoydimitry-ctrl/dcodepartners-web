#!/bin/sh
# Une vídeo y audio (−14 LUFS), codifica para Instagram y genera las portadas.
cd "$(dirname "$0")"; mkdir -p entrega
mezcla() { # $1 vídeo  $2 audio  $3 salida
  M=$(ffmpeg -hide_banner -i "$2" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  I=$(echo "$M" | python3 -c "import sys,json;j=json.load(sys.stdin);print(f\"measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}\")")
  ffmpeg -loglevel error -y -i "$1" -i "$2" -af "loudnorm=I=-14:TP=-1.5:LRA=11:$I:linear=true,aresample=48000" \
    -c:v libx264 -preset slow -crf 19 -maxrate 4200k -bufsize 8400k -profile:v high -pix_fmt yuv420p -r 30 \
    -c:a aac -b:a 192k -movflags +faststart -shortest "$3"
}
mezcla render/v916.mp4 audio/banda.wav entrega/crm-reel-9x16.mp4
mezcla render/v45.mp4 audio/banda.wav entrega/crm-publicacion-4x5.mp4
mezcla render/limpio.mp4 audio/banda-limpio.wav entrega/crm-reel-limpio-9x16.mp4
node render.cjs --pagina "crm.html?portada" --fotos 0 --nombre portada-9x16 > /dev/null 2>&1
node render.cjs --alto 1350 --pagina "crm.html?portada" --fotos 0 --nombre portada-4x5 > /dev/null 2>&1
for f in portada-9x16 portada-4x5; do cp render/fotos/$f-t000.00.png entrega/$f.png; done
ls -la entrega
