#!/usr/bin/env bash
# ==========================================================================
# MONTAJE DEL REEL · junta los planos del rodaje, los rótulos y el sonido
# --------------------------------------------------------------------------
# Uso: scripts/v4/reel/montar.sh <cuadros> <rótulos> <audio.wav> <salida>
#   <cuadros>  carpeta del rodaje (director.mjs): un subdirectorio por plano, con la escena (f0000.jpg…)
#              y, en los planos con interfaz, la capa de la página (u0000.png…, con transparencia)
#   <rótulos>  carpeta de capas.mjs (c0000.png…)
#   <salida>   carpeta donde quedan reel-dcode.mp4 (con texto) y reel-dcode-sin-texto.mp4
# 1080×1920 · 30 fps · H.264 alto + AAC 48 kHz, como pide Instagram. Cortes en seco: el sonido lleva el golpe.
# ==========================================================================
set -euo pipefail
CUADROS="$1"; ROTULOS="$2"; AUDIO="$3"; SAL="$4"; mkdir -p "$SAL"
DUR="${DUR:-32}"
ENT=(); GRAFO=""; CAD=""; n=0; k=0
for dir in "$CUADROS"/*/; do
  p="$(basename "$dir")"
  ENT+=(-framerate 30 -i "$dir/f%04d.jpg")
  if [ -f "$dir/u0000.png" ]; then
    ENT+=(-framerate 30 -i "$dir/u%04d.png")
    GRAFO+="[$n:v]scale=1080:1920:flags=lanczos,setsar=1[e$k];[e$k][$((n + 1)):v]overlay=format=auto,format=yuv420p[p$k];"; n=$((n + 2))
  else
    GRAFO+="[$n:v]scale=1080:1920:flags=lanczos,setsar=1,format=yuv420p[p$k];"; n=$((n + 1))
  fi
  CAD+="[p$k]"; k=$((k + 1))
done
# etalonaje: una curva suave que asienta los negros y da algo más de contraste
TONO="curves=all='0/0 0.18/0.14 0.5/0.5 0.82/0.86 1/1'"
SON="volume=-0.9dB,afade=t=in:d=0.02,afade=t=out:st=$(echo "$DUR - 1.2" | bc):d=1.2"
VID=(-c:v libx264 -preset slow -crf "${CRF:-17}" -maxrate "${TOPE:-10M}" -bufsize "${BUFER:-20M}" -profile:v high -level 4.2 -pix_fmt yuv420p -r 30 -g 60 -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart)
AUD=(-c:a aac -b:a 256k -ar 48000 -ac 2)
FIN="fade=t=out:st=$(echo "$DUR - 0.6" | bc):d=0.6"

# sin texto: los planos tal cual; empieza en seco (el primer cuadro es el gancho) y acaba con un fundido a negro
ffmpeg -hide_banner -loglevel error -y "${ENT[@]}" -i "$AUDIO" \
  -filter_complex "${GRAFO}${CAD}concat=n=$k:v=1:a=0,${TONO},${FIN},format=yuv420p[v];[$n:a]${SON}[a]" \
  -map "[v]" -map "[a]" -t "$DUR" "${VID[@]}" "${AUD[@]}" "$SAL/reel-dcode-sin-texto.mp4"

# con texto: los rótulos encima
ffmpeg -hide_banner -loglevel error -y "${ENT[@]}" -framerate 30 -i "$ROTULOS/c%04d.png" -i "$AUDIO" \
  -filter_complex "${GRAFO}${CAD}concat=n=$k:v=1:a=0,${TONO}[b];[b][$n:v]overlay=format=auto,${FIN},format=yuv420p[v];[$((n + 1)):a]${SON}[a]" \
  -map "[v]" -map "[a]" -t "$DUR" "${VID[@]}" "${AUD[@]}" "$SAL/reel-dcode.mp4"

for f in reel-dcode.mp4 reel-dcode-sin-texto.mp4; do
  ffprobe -v error -show_entries format=duration,size,bit_rate:stream=codec_name,width,height,r_frame_rate -of default=nw=1 "$SAL/$f" | tr '\n' ' '; echo " · $f"
done
