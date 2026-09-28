# Convierte los renders de productos.py (Orbe), taller.py (Brío) y vandria.py (Vandria) en las imágenes de las webs de ejemplo (assets/v2/img/webs/).
# Uso: python3 scripts/v2/renders/empaquetar-webs.py <carpeta de renders>
import os, sys
from PIL import Image
src = sys.argv[1]
dst = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'assets', 'v2', 'img', 'webs')
os.makedirs(dst, exist_ok=True)
TAM = {'taller-1': (1200, 800), 'taller-2': (800, 560), 'orbe-mesa': (1200, 800), 'vandria-1': (960, 672), 'vandria-2': (960, 672), 'vandria-3': (960, 672)}
for nombre, (w, h) in TAM.items():
    f = next((x for x in (os.path.join(src, f'{nombre}.png'), os.path.join(src, f'{nombre}.jpg')) if os.path.exists(x)), None)
    if not f: continue
    im = Image.open(f).convert('RGB')
    r = max(w / im.width, h / im.height); im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
    x0, y0 = (im.width - w) // 2, (im.height - h) // 2
    im = im.crop((x0, y0, x0 + w, y0 + h))
    im.save(os.path.join(dst, f'{nombre}.webp'), 'WEBP', quality=78, method=6)
    print(nombre, w, h, os.path.getsize(os.path.join(dst, f'{nombre}.webp')) // 1024, 'KB')
