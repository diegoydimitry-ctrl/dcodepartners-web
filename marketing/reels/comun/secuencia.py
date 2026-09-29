# Convierte una secuencia de capturas del navegador (fotogramas reales de la web, con duraciones propias) en un clip
# de 60 fps: ffmpeg concat con la duración de cada fotograma + interpolación por compensación de movimiento, con
# detección de cambio de escena para que los saltos grandes sean corte y no «derretido».
#   python3 comun/secuencia.py <salida.mp4> "<carpeta>:<desde>-<hasta>@<fps>" ...
import os, subprocess, sys, tempfile
sal, tramos = sys.argv[1], sys.argv[2:]
lin = []
for t in tramos:
    ruta, resto = t.split(":"); rango, fps = resto.split("@"); a, b = map(int, rango.split("-"))
    for i in range(a, b + 1):
        f = os.path.abspath(os.path.join(ruta, f"{i:03d}.jpg"))
        if os.path.exists(f): lin += [f"file '{f}'", f"duration {1/float(fps):.5f}"]
lin += [lin[-2]]                                  # concat: el último fotograma necesita repetirse
lista = tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False); lista.write("\n".join(lin)); lista.close()
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lista.name, "-vf",
    "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1:scd=fdiff:scd_threshold=14,scale=800:914:flags=lanczos,setsar=1",
    "-c:v", "libx264", "-crf", "12", "-preset", "fast", "-pix_fmt", "yuv420p", sal], check=True)
print(sal, subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", sal], capture_output=True, text=True).stdout.strip())
