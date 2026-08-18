#!/usr/bin/env bash
# TTS básico vía espeak-ng (open source, sin coste, sin licencia dudosa).
# Calidad robótica, NO "premium" — por eso el Format/Audio Decision Engine
# la reserva para piezas donde aporta (voz + música, contenido conceptual)
# y no la usa por defecto en piezas donde la calidad de marca es crítica.
# Si en el futuro se autoriza una API de TTS de pago, sustituir aquí sin
# tocar el resto del pipeline (el storyboard solo espera un .wav en
# audio.voice.archivo).
#
# Uso: scripts/generate-tts.sh "texto a locutar" public/audio/voice/salida.wav
set -euo pipefail
TEXT="$1"
OUT="$2"
mkdir -p "$(dirname "$OUT")"
espeak-ng -v es -s 145 -p 40 "$TEXT" -w "$OUT"
