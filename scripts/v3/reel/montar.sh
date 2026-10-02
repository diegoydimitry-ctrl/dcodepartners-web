#!/usr/bin/env bash
# ==========================================================================
# MONTAJE DEL REEL · une los planos, superpone los rótulos y mete el sonido
# --------------------------------------------------------------------------
# Uso: montar.sh <cuadros> <rótulos> <audio.wav> <salida>
#   <cuadros>  carpeta del rodaje (director.mjs): una subcarpeta por plano, fNNNN.jpg
#   <rótulos>  carpeta de capas.mjs: cNNNN.png con transparencia, uno por cuadro del montaje
#   <salida>   carpeta donde quedan reel-dcode.mp4 (con texto) y reel-dcode-sin-texto.mp4
# 1080×1920 · 30 fps · H.264 alto + AAC 48 kHz, como pide Instagram. Cortes en seco: el sonido lleva el golpe.
# ==========================================================================
set -euo pipefail
CUADROS="$1"; ROTULOS="$2"; AUDIO="$3"; SAL="$4"; mkdir -p "$SAL"
PLANOS=(01-tormenta 02-claro 03-hoy 04-orden 05-sistema 06-inteligencia 07-noche 08-finance 09-resultado 10-tuyo)
ENT=(); CAD=""; n=0
for p in "${PLANOS[@]}"; do ENT+=(-framerate 30 -i "$CUADROS/$p/f%04d.jpg"); CAD+="[$n:v]"; n=$((n + 1)); done
# etalonaje: una curva suave que baja los negros y sube un poco las luces (la web real es algo más plana)
TONO="curves=all='0/0 0.18/0.13 0.5/0.5 0.82/0.87 1/1'"
# el pico real del audio se deja en torno a −1 dBTP; entrada de 50 ms y salida de 0,7 s
SON="volume=-0.9dB,afade=t=in:d=0.05,afade=t=out:st=39.3:d=0.7"
VID=(-c:v libx264 -preset slow -crf "${CRF:-18}" -maxrate "${TOPE:-9M}" -bufsize 18M -profile:v high -level 4.2 -pix_fmt yuv420p -r 30 -g 60 -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart)
AUD=(-c:a aac -b:a 256k -ar 48000 -ac 2)

# sin texto: los planos tal cual; empieza en seco (el primer cuadro es el gancho) y acaba con un fundido a negro
ffmpeg -hide_banner -loglevel error -y "${ENT[@]}" -i "$AUDIO" \
  -filter_complex "${CAD}concat=n=$n:v=1:a=0,${TONO},fade=t=out:st=39.5:d=0.5,format=yuv420p[v];[$n:a]${SON}[a]" \
  -map "[v]" -map "[a]" -t 40 "${VID[@]}" "${AUD[@]}" "$SAL/reel-dcode-sin-texto.mp4"

# con texto: los rótulos encima (el cierre no se funde a negro: se queda la marca)
ffmpeg -hide_banner -loglevel error -y "${ENT[@]}" -framerate 30 -i "$ROTULOS/c%04d.png" -i "$AUDIO" \
  -filter_complex "${CAD}concat=n=$n:v=1:a=0,${TONO}[b];[b][$n:v]overlay=format=auto,format=yuv420p[v];[$((n + 1)):a]${SON}[a]" \
  -map "[v]" -map "[a]" -t 40 "${VID[@]}" "${AUD[@]}" "$SAL/reel-dcode.mp4"

for f in reel-dcode.mp4 reel-dcode-sin-texto.mp4; do
  ffprobe -v error -show_entries format=duration,size,bit_rate:stream=codec_name,width,height,r_frame_rate -of default=nw=1 "$SAL/$f" | tr '\n' ' '; echo " · $f"
done
