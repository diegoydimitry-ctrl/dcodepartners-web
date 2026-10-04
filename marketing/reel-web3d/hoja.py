import sys, glob
from PIL import Image
fs = sorted(glob.glob("render/fotos/t*.png")); n = len(fs); cols = min(n, int(sys.argv[1]) if len(sys.argv) > 1 else 6); rows = (n + cols - 1) // cols; w = int(sys.argv[2]) if len(sys.argv) > 2 else 324; hh = w * 16 // 9
h = Image.new("RGB", (cols * w, rows * hh), "black")
for i, f in enumerate(fs): h.paste(Image.open(f).convert("RGB").resize((w, hh), Image.LANCZOS), ((i % cols) * w, (i // cols) * hh))
h.save("/tmp/claude-0/hoja3d.png"); print(n)
