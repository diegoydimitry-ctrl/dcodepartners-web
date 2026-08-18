#!/usr/bin/env bash
# Descarga las fuentes de marca (Archivo, Inter, JetBrains Mono) desde Google
# Fonts y las guarda en public/fonts como woff2 auto-alojados. Solo hace falta
# ejecutarlo una vez (o si se añade un peso/familia nueva) — el resultado se
# versiona en el repositorio, el render no depende de red para las fuentes.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/fonts
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"

fetch_family() {
  local family="$1" weights="$2" out="$3"
  curl -sS -A "$UA" "https://fonts.googleapis.com/css2?family=${family}:wght@${weights}&display=swap" -o "/tmp/${out}.css"
}

fetch_family "Archivo" "700;800" archivo
fetch_family "Inter" "500;600;700" inter
fetch_family "JetBrains+Mono" "500" jbm

python3 - <<'PYEOF'
import re, os, subprocess
jobs = [("archivo.css", "Archivo", ["700", "800"]),
        ("inter.css", "Inter", ["500", "600", "700"]),
        ("jbm.css", "JetBrainsMono", ["500"])]
for cssfile, family, weights in jobs:
    with open(f"/tmp/{cssfile}") as f:
        content = f.read()
    for b in re.findall(r"@font-face\s*{([^}]+)}", content):
        wmatch = re.search(r"font-weight:\s*(\d+)", b)
        umatch = re.search(r"unicode-range:\s*([^;]+);", b)
        srcmatch = re.search(r"url\((https://fonts.gstatic.com/[^)]+)\)", b)
        if not (wmatch and srcmatch):
            continue
        unicode_range = umatch.group(1) if umatch else ""
        if "U+0000-00FF" not in unicode_range and unicode_range != "":
            continue
        weight = wmatch.group(1)
        out = f"public/fonts/{family}-{weight}.woff2"
        subprocess.run(["curl", "-sS", "-o", out, srcmatch.group(1)], check=True)
        print(family, weight, "->", out)
PYEOF
