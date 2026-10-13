#!/bin/sh
# Une imagen y mezcla a −14 LUFS y genera la portada.
cd "$(dirname "$0")"; mkdir -p entrega
M=$(ffmpeg -hide_banner -i audio/mezcla.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
I=$(echo "$M" | python3 -c "import sys,json;j=json.load(sys.stdin);print(f\"measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}\")")
ffmpeg -loglevel error -y -i render/imagen.mp4 -i audio/mezcla.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:$I:linear=true,aresample=48000" \
  -c:v libx264 -preset slow -crf 19 -maxrate 4200k -bufsize 8400k -profile:v high -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -movflags +faststart -shortest entrega/errores-que-no-avisan-9x16.mp4
node render.cjs --pagina "video.html?portada&t=1.35" --fotos 0 --nombre portada > /dev/null 2>&1
python3 -c "from PIL import Image; Image.open('render/fotos/portada-t000.00.png').convert('RGB').save('entrega/portada-9x16.jpg', quality=92)"
ls -la entrega
