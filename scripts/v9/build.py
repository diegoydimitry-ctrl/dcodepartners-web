"""Genera las páginas del rediseño v9.

Uso: python3 scripts/v9/build.py [home] [departamentos] [servicios] [legales] [blog] [faq] [404] [clave] [--en]
Sin argumentos genera todo, en español y en inglés.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import home  # noqa: E402
import paginas  # noqa: E402

TODO = ["home", "departamentos", "servicios", "legales", "blog", "faq", "404", "clave"]
args = [a for a in sys.argv[1:] if not a.startswith("--")]
que = args or TODO
langs = ["es", "en"] if ("--en" in sys.argv or not args) else ["es"]
if "--solo-en" in sys.argv:
    langs = ["en"]

for lang in langs:
    if "home" in que:
        home.build(lang)
    paginas.build(lang, que)
    try:
        import clave  # noqa: E402
        if "clave" in que:
            clave.build(lang)
    except ModuleNotFoundError:
        pass
    print("hecho:", lang, ", ".join(que))
