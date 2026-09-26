# Preview local — D-Code Partners · La Planta

Rama: `claude/dcode-ultra-realism` (parte de `e99d61f`, lo que sirve hoy producción).
HTML estático + CSS + JS vanilla. Sin build ni bundler.

## 1. Instalar

```bash
git fetch origin claude/dcode-ultra-realism
git checkout claude/dcode-ultra-realism
npm install
```

`npm install` solo instala las herramientas de pruebas. Three.js no hace falta
instalarlo: va vendorizado en `assets/vendor/three/`.

## 2. Arrancar

```bash
npx serve .                    # recomendado: respeta las URLs limpias (/precios, /departamentos/finanzas)
# o bien
python3 -m http.server 8080    # entonces abre las páginas con .html (/precios.html)
```

Abre `http://localhost:3000` (serve) o `http://localhost:8080/index.html` (Python).

## 3. Qué mirar

| Dónde | Qué hacer |
|---|---|
| `/` y `/en` | Recarga para ver la entrada: los módulos caen y se asientan. Mueve el ratón: la cámara y la luz responden. Pasa el cursor sobre un módulo y haz clic: abre su departamento. |
| `/#problema` y `/#diagnostico` | Marca áreas en el diagnóstico: el módulo de cada una se enciende en la planta. |
| Método, pasos 01 a 04 | Baja despacio: haz de escaneo, luego plano técnico, luego montaje (aterrizan, sube el núcleo, fluye el dato) y por último columnas de medida. |
| Botón «Modo claro» | La planta cambia de estudio: maqueta clara con sombras suaves. |
| `/departamentos/finanzas` (y los otros 7) | El módulo del departamento, con su pantalla, conectado al resto del sistema. |
| `/servicios/sistemas-a-medida` | La planta en modo plano (diseño). |

**Forzar un nivel de calidad** (para comparar): añade
`?calidad=alta`, `?calidad=media`, `?calidad=baja` o `?calidad=estatica` a la URL.

**Respaldo:** activa «reducir movimiento» en el sistema (se ve un fotograma fijo
por capítulo) o desactiva WebGL en el navegador (se ve el póster).

## 4. Antes de commitear

```bash
npm run update-asset-versions   # ?v= de todo el CSS/JS, incluido el motor que importa app.js
npm run check:tema && npm run check:portada && npm run check:enlaces && npm run check-instruments
```

## 5. Actualizar Three.js

```bash
npm install --no-save three@<versión>
# Copia build/three.module.min.js y build/three.core.min.js a assets/vendor/three/, y los addons
# de examples/jsm/ que se usan, cambiando `from 'three'` por
# `from '/assets/vendor/three/three.module.min.js'`
# (ver REDESIGN_ULTRA_REALISM.md §3).
```

## 6. Qué NO hace esta rama

- No hace merge a `main` ni deploy a producción.
- No cambia textos, precios, demos, formularios, chatbot, SEO ni analítica de producción.
