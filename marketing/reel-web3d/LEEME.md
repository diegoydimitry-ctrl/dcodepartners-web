# Reel «¿Y si tu web hiciera esto?» (25,5 s · 1080×1920)

Showreel de tres webs 3D de demostración (marcas ficticias) sobre un mismo motor, con cierre de D-Code Partners.

- `web/` — las webs: `index.html?s=vela` (zapatillas), `?s=norda` (mobiliario), `?s=orien` (relojería). En vivo: arrastrar para girar, rueda o doble clic para acercar, color, opciones (medidas en 3D en norda) y cesta. `?auto` reproduce el guion; `?captura` es el modo de render.
- `montaje/` — une los clips: gancho, rótulos, escaparate de móviles y cierre.
- `render.cjs` — captura con Chromium. Servir antes esta carpeta: `python3 -m http.server 8770 --bind 127.0.0.1`.
  1. `node render.cjs --pagina "web/index.html?captura&s=vela&esc=1.5" --dir render/vela` (igual con norda y orien)
  2. copias a media resolución en `render/<web>_m/` (ffmpeg `scale=540:960`)
  3. `node render.cjs --pagina "montaje/index.html?captura" --salida render/imagen.mp4`
- `banda.py` — banda sonora original sintetizada (sin samples de terceros), 120 BPM.

Créditos obligatorios al publicar (modelos de glTF Sample Assets, Khronos, CC-BY 4.0): «Materials Variants Shoe» © Shopify · «Glam Velvet Sofa» © Wayfair · «Chronograph Watch» © Darmstadt Graphics Group (marcas de terceros retiradas de la esfera). HDRI: Poly Haven, CC0.
