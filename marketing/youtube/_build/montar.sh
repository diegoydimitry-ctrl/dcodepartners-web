#!/bin/bash
# Monta el máster y las versiones cortas a partir de los fotogramas
# renderizados y de la banda normalizada.
#
#   ./montar.sh
#
# Los cortes de 20 s y 6 s NO son otro montaje: son tramos del mismo máster,
# con los mismos fotogramas y los mismos trozos de banda sonora, empalmados
# con un encadenado corto. Por eso suenan y se ven como la pieza larga.
set -euo pipefail
cd "$(dirname "$0")"
FF=node_modules/ffmpeg-static/ffmpeg
SAL=..

echo "── máster 4K ──"
"$FF" -y -loglevel error -framerate 30 -i frames/f%05d.png -i banda-norm.wav \
  -map 0:v -map 1:a -t 45 \
  -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -profile:v high -level 5.1 \
  -x264-params "keyint=60:min-keyint=30:bframes=3" \
  -c:a aac -b:a 320k -ar 48000 -ac 2 \
  -movflags +faststart -r 30 dcode-youtube-ad-45s-4k.mp4

echo "── máster 1080p (entrega) ──"
"$FF" -y -loglevel error -i dcode-youtube-ad-45s-4k.mp4 \
  -vf "scale=1920:1080:flags=lanczos" \
  -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -profile:v high -level 4.2 \
  -x264-params "keyint=60:min-keyint=30:bframes=3" \
  -c:a aac -b:a 320k -ar 48000 -ac 2 \
  -movflags +faststart -r 30 "$SAL/dcode-youtube-ad-45s-master.mp4"

# ── versiones cortas ────────────────────────────────────────────────────
# Cada tramo se extrae del máster 1080p ya montado (imagen y sonido juntos,
# así no hay riesgo de desincronizar) y se encadena con 0,25 s de fundido.
corta () {
  local destino="$1"; shift
  local filtros="" entradas="" i=0
  local tmp; tmp=$(mktemp -d)
  for tramo in "$@"; do
    local ini="${tramo%%:*}" dur="${tramo##*:}"
    "$FF" -y -loglevel error -ss "$ini" -t "$dur" -i "$SAL/dcode-youtube-ad-45s-master.mp4" \
      -c:v libx264 -preset medium -crf 16 -pix_fmt yuv420p \
      -af "afade=t=in:st=0:d=0.12,afade=t=out:st=$(echo "$dur-0.18" | bc):d=0.18" \
      -c:a pcm_s16le -f matroska "$tmp/p$i.mkv"
    entradas="$entradas -i $tmp/p$i.mkv"
    i=$((i+1))
  done
  local n=$i
  local v="" a=""
  for ((j=0;j<n;j++)); do v="$v[$j:v]"; a="$a[$j:a]"; done
  # shellcheck disable=SC2086
  "$FF" -y -loglevel error $entradas \
    -filter_complex "${v}concat=n=$n:v=1:a=0[v];${a}concat=n=$n:v=0:a=1[a]" \
    -map "[v]" -map "[a]" \
    -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -profile:v high -level 4.2 \
    -c:a aac -b:a 256k -ar 48000 -ac 2 -movflags +faststart -r 30 "$destino"
  rm -rf "$tmp"
}

echo "── corte de 20 s ──"
# problema (hook) · el giro · dos productos · cierre
corta "$SAL/dcode-youtube-ad-20s.mp4" "0:5.0" "12.6:4.4" "24.0:3.0" "33.1:3.0" "41.0:4.0"

echo "── bumper de 6 s ──"
# el gesto reconocible y la marca: nada más cabe, y nada más hace falta
corta "$SAL/dcode-youtube-ad-6s.mp4" "0:3.6" "42.4:2.4"

echo "── resultado ──"
for f in "$SAL/dcode-youtube-ad-45s-master.mp4" "$SAL/dcode-youtube-ad-20s.mp4" "$SAL/dcode-youtube-ad-6s.mp4" dcode-youtube-ad-45s-4k.mp4; do
  [ -f "$f" ] && printf "%-46s %7s  %s\n" "$(basename "$f")" \
    "$(du -h "$f" | cut -f1)" \
    "$(node_modules/ffprobe-static/bin/linux/x64/ffprobe -v error -select_streams v:0 \
        -show_entries stream=width,height,r_frame_rate:format=duration -of csv=p=0:s=x "$f" | tr '\n' ' ')"
done
