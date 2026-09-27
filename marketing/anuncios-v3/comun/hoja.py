# Hoja de contactos de los fotogramas de revisión: python3 comun/hoja.py v1-youtube [columnas] [ancho]
import glob, os, sys
from PIL import Image, ImageDraw, ImageFont
v = sys.argv[1]; cols = int(sys.argv[2]) if len(sys.argv) > 2 else 4; aw = int(sys.argv[3]) if len(sys.argv) > 3 else 480
fs = sorted(glob.glob(os.path.join(os.path.dirname(__file__), "..", v, "render", "fotos", "*.png")))
ims = [Image.open(f).convert("RGB") for f in fs]; w, h = ims[0].size; ah = int(h * aw / w)
filas = (len(ims) + cols - 1) // cols; hoja = Image.new("RGB", (cols * (aw + 8), filas * (ah + 30)), "#444")
d = ImageDraw.Draw(hoja)
for i, (f, im) in enumerate(zip(fs, ims)):
    x, y = (i % cols) * (aw + 8), (i // cols) * (ah + 30)
    hoja.paste(im.resize((aw, ah), Image.LANCZOS), (x, y + 26)); d.text((x + 4, y + 6), os.path.basename(f)[1:-4] + " s", fill="#fff")
p = os.path.join(os.path.dirname(__file__), "..", v, "render", "hoja.jpg"); hoja.save(p, quality=85); print(p, len(ims))
