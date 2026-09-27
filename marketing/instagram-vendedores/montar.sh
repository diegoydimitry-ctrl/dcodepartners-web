#!/bin/bash
# Monta el anuncio a partir de los fotogramas y de la banda sonora.
#
#   python3 audio.py out/banda.wav
#   node render.mjs 0 720            # deja out/frames/f00000.png …
#   ./montar.sh
#
# Sale una pieza 9:16 (1080x1920) para Reels/Stories y un recorte 1:1 (1080x1080) para el feed, los dos con el
# audio normalizado a −14 LUFS, que es lo que Instagram deja pasar sin volver a tocarlo.
set -euo pipefail
cd "$(dirname "$0")"

FF=${FFMPEG:-ffmpeg}
FRAMES=${1:-frames}
BANDA=${2:-out/banda.wav}
mkdir -p out

echo "── normalizando la banda a −14 LUFS (dos pasadas) ──"
# Una sola pasada de loudnorm es aproximada y se queda cerca, pero no en el objetivo. La primera pasada mide,
# la segunda corrige con esas medidas: así la cifra que se promete es la cifra que sale.
MED=$("$FF" -hide_banner -nostats -i "$BANDA" -af "loudnorm=I=-14:TP=-1.0:LRA=9:print_format=json" -f null - 2>&1 |
      sed -n '/^{/,/^}/p')
LEE () { printf '%s' "$MED" | sed -n "s/.*\"$1\"[[:space:]]*:[[:space:]]*\"\([^\"]*\)\".*/\1/p" | head -1; }
"$FF" -y -loglevel error -i "$BANDA" \
  -af "loudnorm=I=-14:TP=-1.0:LRA=9:measured_I=$(LEE input_i):measured_TP=$(LEE input_tp):measured_LRA=$(LEE input_lra):measured_thresh=$(LEE input_thresh):offset=$(LEE target_offset):linear=true" \
  -ar 48000 -ac 2 -c:a pcm_s16le out/banda-norm.wav

echo "── máster 9:16 (Reels / Stories) ──"
"$FF" -y -loglevel error -framerate 30 -i "$FRAMES/f%05d.png" -i out/banda-norm.wav \
  -map 0:v -map 1:a -t 24 \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -profile:v high -level 4.1 \
  -x264-params "keyint=60:min-keyint=30:bframes=3" \
  -c:a aac -b:a 256k -ar 48000 -ac 2 \
  -movflags +faststart -r 30 out/dcode-vendedores-9x16.mp4

echo "── versión 4:5 (feed) ──"
# El texto del anuncio ocupa de y=280 a y=1470 en el vertical: son 1190 px, así que en un 1:1 (1080 de alto)
# NO cabe y el recorte parte el titular. Se entrega en 4:5 (1080x1350), que es el formato alto del feed, con la
# ventana y=230..1580: el contenido entra entero y sobra margen arriba y abajo.
"$FF" -y -loglevel error -i out/dcode-vendedores-9x16.mp4 \
  -vf "crop=1080:1350:0:230" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -profile:v high -level 4.1 \
  -c:a aac -b:a 256k -ar 48000 -ac 2 -movflags +faststart -r 30 out/dcode-vendedores-4x5.mp4

echo "── resultado ──"
for f in out/dcode-vendedores-9x16.mp4 out/dcode-vendedores-4x5.mp4; do
  [ -f "$f" ] && printf "%-38s %8s  %s\n" "$(basename "$f")" "$(du -h "$f" | cut -f1)" \
    "$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,nb_frames:format=duration -of 'csv=p=0:s=x' "$f" | tr '\n' ' ')"
done
