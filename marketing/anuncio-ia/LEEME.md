# Esto no es un vídeo · anuncio de capacidades de IA

Reel de 33,5 s (1080×1920, 30 fps). Todas las escenas son programas que funcionan en el navegador. Explicación completa en `entrega/QUE-SE-HA-CONSTRUIDO.md`.

## Carpetas

| Carpeta | Qué hay |
|---|---|
| `demos/` | Las demos: `vuelo.html` (juego), `web3d.html` (reloj), `fluido.html` (tinta), `ciudad.html` (ciudad), `proceso.html` (instrucción → código) y `comun.js` |
| `lib/` | Three.js 0.186.1 (MIT) y las fuentes Archivo y Martian Mono (OFL) |
| `montaje/` | `montaje.html` monta el reel desde las grabaciones; `audio.py` sintetiza la música |
| `entrega/` | Portada, PDF «Cómo se hizo», textos para publicar, subtítulos `.srt` e imágenes |
| `herramientas/` | Servidor local y grabación fotograma a fotograma con Playwright |

Los MP4 y las grabaciones fotograma a fotograma **no** están en el repositorio por su tamaño: unos 45 MB por vídeo y miles de JPG.

## Probar las demos en directo

Los módulos de JavaScript no cargan con `file://`. Hay que servir la carpeta:

```bash
node herramientas/servir.mjs "$(pwd)" 4700
# http://127.0.0.1:4700/demos/vuelo.html    → W/A/S/D
# http://127.0.0.1:4700/demos/web3d.html    → scroll
# http://127.0.0.1:4700/demos/fluido.html   → arrastrar con ratón o dedo
# http://127.0.0.1:4700/demos/ciudad.html
```

`?captura=1` pone una demo en modo grabación: entrada por guion y tiempo fijo, con `window.renderAt(t)` expuesto.

## Rehacer el reel

1. Grabar cada demo con `herramientas/grabar.mjs <url?captura=1> <carpeta> <t0> <t1> 30` en `cap/<nombre>/`. Los nombres y tramos están en `FUENTES` de `montaje/montaje.html`.
2. D-Code Finance se graba con `herramientas/grabar-finance.mjs <carpeta>`, con la demo de `dcode-finance-demo` corriendo en local en el puerto 4800 (datos inventados).
3. Servir la carpeta que contiene `cap/` y `repo/` y grabar `montaje.html?captura=1&version=A|B|limpia` de 0 a 33,47 s.
4. Música:
   - `python3 montaje/audio.py banda-A.wav A` (B para el gancho alternativo);
   - normalizar con `ffmpeg loudnorm` a −14 LUFS;
   - unir con libx264 (crf 16, yuv420p, bt709) y AAC a 320 kb/s.
