# Preview local — D-Code Partners v10 "El sistema, en profundidad"

Esta rama (`claude/rediseno-cinematico-webgl`) añade una capa WebGL cinemática
sobre la web estática existente — no reescribe la arquitectura. Sigue siendo
HTML multipágina + CSS + JS vanilla, sin bundler, sin React. Ver el informe
final en el chat para el porqué de esa decisión.

## 1 · Instalación

```bash
npm install
```

Instala `three` (motor 3D, vendorizado en `assets/vendor/three/` — no se carga
desde ningún CDN) y las dependencias de desarrollo que ya tenía el proyecto
(`playwright`, `node-html-parser`).

## 2 · Desarrollo (preview local)

Este proyecto no tiene servidor de desarrollo propio (es HTML estático). Para
verlo tal y como lo verá Vercel, sirve la carpeta con cualquier servidor
estático:

```bash
npx serve .
# o, si prefieres Python:
python3 -m http.server 8080
```

Abre `http://localhost:3000` (o `:8080`) → `/` es la portada con la escena
WebGL del Hero y la nueva sección "El sistema completo".

**Páginas donde mirar primero:**
- `/` — Hero con partículas 3D + sección "El sistema" (scroll para ver cómo
  se conectan las seis capas).
- `/conocenos` — mismo sistema tipográfico nuevo (`.h-title`/`.eyebrow`),
  sin escena 3D (no le corresponde una por intensidad de la página).
- `/departamentos` — el listado de Capacidades con la inclinación 3D en CSS.

## 3 · Regenerar hashes de caché tras tocar CSS/JS

Si tocas `assets/css/dcp10.css` o `assets/js/dcp10.js` (o cualquier otro
`dcp*`/`styles.css`/`main.js`), hay que recalcular su `?v=` antes de commitear
— si no, Production puede servir la versión cacheada antigua bajo la misma
URL:

```bash
npm run update-asset-versions
```

Y si tocas el CONTENIDO real de alguna página (texto, no solo estilos), hay
que regenerar la base de conocimiento del chatbot:

```bash
npm run generate-kb
# o las dos cosas juntas:
npm run sync-content
```

## 4 · Comprobaciones antes de tocar producción

```bash
npm run check-instruments   # nombres de instrumentos/composiciones sin huérfanos
npm run qa:check -- http://localhost:8080   # barrido de QA en navegador real
                                             # (tarda; contra local puede colgarse
                                             # si intenta contactar cookieyes/gtag
                                             # sin salida a internet — normal en
                                             # sandbox, no en tu máquina real)
```

No hay `npm run build`: es HTML estático, no hay paso de compilación. El
"build" es, literalmente, el contenido del repositorio.

## 5 · Variables de entorno

Ninguna nueva. El chatbot (`api/chat.js`) sigue usando las que ya tenía
configuradas en Vercel (`GEMINI_API_KEY`/`ANTHROPIC_API_KEY` — nombres reales
en el propio `api/chat.js`); esta rama no las toca.

## 6 · Actualizar el motor 3D vendorizado

`assets/vendor/three/` no es una dependencia de `package.json` a propósito:
es un artefacto ya construido (el build ES module oficial de Three.js),
copiado una vez, servido tal cual — nada en producción importa desde
`node_modules`. Para subir de versión:

```bash
npm install --no-save three@<version>
cp node_modules/three/build/three.module.min.js assets/vendor/three/
cp node_modules/three/build/three.core.min.js assets/vendor/three/
npm run update-asset-versions   # si cambiaste algo más; el vendor no lleva ?v=
```

## 7 · Qué NO hace esta rama

- No hace `git push`, no hace merge, no toca `main` ni producción.
- No cambia el catálogo de precios, casos ni datos — solo su tratamiento
  visual en las páginas donde ya existían.
- No añade React, Vite, Next ni ningún bundler.
