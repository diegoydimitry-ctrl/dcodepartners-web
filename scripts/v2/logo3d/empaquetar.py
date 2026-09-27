# Deja los fotogramas del render en la web: assets/v2/img/piezas/{1100,700}/NNN.webp (con transparencia).
# Si falta un fotograma, no se inventa: la web funde entre los que existan.
# Uso: python3 scripts/v2/logo3d/empaquetar.py ~/logo-render
import sys, os, glob
from PIL import Image
src = sys.argv[1]; raiz = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'assets', 'v2', 'img', 'piezas')
for r in (1100, 700): os.makedirs(os.path.join(raiz, str(r)), exist_ok=True)
tam = 0; n = 0
for f in sorted(glob.glob(os.path.join(src, 'd_*.png'))):
    k = os.path.basename(f)[2:5]
    im = Image.open(f).convert('RGBA')
    for r, q in ((1100, 80), (700, 76)):
        d = os.path.join(raiz, str(r), k + '.webp')
        (im if im.width == r else im.resize((r, r), Image.LANCZOS)).save(d, 'WEBP', quality=q, method=6, alpha_quality=90)
        tam += os.path.getsize(d)
    n += 1
print(f'{n} fotogramas · {tam/1e6:.1f} MB')
