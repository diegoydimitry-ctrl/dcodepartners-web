#!/bin/bash
# interp.sh fuente in dur salida : tramo → 60 fps constantes con interpolación por compensación de movimiento
ffmpeg -y -loglevel error -ss $2 -t $3 -i $1 -vf "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1:scd=fdiff:scd_threshold=12" -c:v libx264 -crf 12 -preset fast -pix_fmt yuv420p $4
