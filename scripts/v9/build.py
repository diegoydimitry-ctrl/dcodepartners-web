"""Genera las páginas del rediseño v9.

Uso: python3 scripts/v9/build.py [home] [paginas] [departamentos] [legales] [blog] [en]
Sin argumentos genera todo.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import home  # noqa: E402

TARGETS = sys.argv[1:] or ["home"]

if "home" in TARGETS:
    home.build("es")
    print("portada ES")
