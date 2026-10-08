# Demos web · Boadilla del Monte (propuestas de D-Code Partners)

Tres demos estáticas independientes, cada una en su carpeta:

- `/la-quinta/` — La Quinta · Villa Real Catering (bodas y eventos). Pieza 3D: «El paseo», recorrido WebGL entre fotos reales de la tarde a la noche (`la-quinta/paseo.js`).
- `/montejo/` — Catering Montejo. Pieza 3D: «El pase», cinta curva de bandejas que reacciona al scroll y se arrastra (`montejo/pase.js`).
- `/la-base/` — La Base Café. Pieza 3D: taza con su logotipo, café con corazón y vapor, que se gira con el dedo (`la-base/taza.js`); muro de azulejos que voltea fotos.

Sin build ni dependencias externas: Three.js r170 servido desde `lib/` (licencia MIT en `lib/three-LICENSE.txt`), fuentes propias (SIL OFL) y fotos optimizadas en WebP con `srcset`.
Si el navegador no tiene WebGL o pide reducir movimiento, cada demo muestra su versión estática con fotos.

Todas llevan aviso de demo, `noindex` (meta, cabecera y `robots.txt`) y no usan cookies ni seguimiento.

## Fuentes
- `_fuente/*.html`: plantillas; `python3 _fuente/build.py <demo>` expande `{{img …}}` en `<img srcset>` (rutas del entorno de trabajo original).
- Fotos: fichas públicas de Google Maps de cada negocio. Datos: Google Maps, Instagram y directorios públicos (ver informe de entrega).
