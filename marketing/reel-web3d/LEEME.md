# Reel «Esto no es una foto. Es una web.» (28,4 s · 1080×1920)

Tienda 3D de demostración (marca ficticia «VELA», zapatilla «Vela Uno») grabada fotograma a fotograma. Cierre: logo y nombre de D-Code Partners.

- `web/` — la tienda (Three.js). En vivo funciona de verdad: arrastrar para girar, rueda o doble clic para acercar, color, talla, cesta, cantidad y pago simulado. `?auto` reproduce el guion del vídeo; `?captura` es el modo de render.
- `render.cjs` — captura con Chromium (servir antes esta carpeta: `python3 -m http.server 8770 --bind 127.0.0.1`; calidad del vídeo: `EXTRA='&esc=1.5'`).
- `banda.py` — banda sonora original sintetizada (sin samples de terceros).

Créditos obligatorios si se publica: modelo «Materials Variants Shoe» © Shopify, CC-BY 4.0 (glTF Sample Assets, Khronos). HDRI de estudio: Poly Haven, CC0.
