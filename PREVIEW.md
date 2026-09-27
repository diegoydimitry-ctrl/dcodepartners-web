# PREVIEW — dcodepartners.com · dirección «Piezas» (blanco y negro)

| | |
|---|---|
| URL (sigue a la rama) | https://dcodepartners-web-git-web-dcp-cowork4-d-code-partners.vercel.app |
| Rama | `web/dcp-cowork4` (parte de `8ff5f5b`) |
| Commit | el último de la rama (ver `git log`) |
| Production | **Sin tocar.** Sigue en `diseno/dcode-design-system` (`e99d61f`) |

## Cómo probarla (5 minutos)
1. **Portada `/`**: baja despacio. Las piezas sueltas se unen y al final se enciende el píxel azul. Cuatro frases en total.
2. Cambia a **modo claro** (sol, arriba a la derecha): la misma escena, con sombra real sobre blanco.
3. **Tócalo**: pulsa la captura de Finance o cualquiera de los cinco botones; la demo se abre en un visor (Escape la cierra).
4. **Precios** (`/precios`): todo sale de `catalogo.json`; «Qué incluye» despliega el detalle.
5. **Contacto** (`/contacto`): configurador de cinco pasos y formulario por pasos. El envío real solo funciona en el dominio con Turnstile; en la Preview la verificación puede no cargar.
6. **Diagnóstico** (`/diagnostico`): tres preguntas y el resultado con tus horas y tu coste por hora.
7. Cualquier interior: `/departamentos/finanzas`, `/servicios/automatizaciones`, `/metodo`, `/faq`, `/aviso-legal`.
8. **EN**: `/en` y el selector ES/EN de la cabecera.
9. En el **móvil**: la escena arriba, el texto abajo; menú a pantalla completa.
10. Con **movimiento reducido** activado en el sistema: la pieza montada, quieta, y los capítulos uno debajo de otro.

## Páginas principales
`/` · `/que-hacemos` · `/servicios/*` (5) · `/departamentos/*` (8) · `/sistema-financiero` · `/precios` · `/metodo` · `/diagnostico` · `/contacto` · `/casos-exito` · `/cambios-en-proceso` · `/garantias` · `/faq` · `/conocenos` · `/blog` (+3) · legales (6). Todas en `/en/…`.

## Escenas 3D
Una: **las piezas** (portada). Render Blender Cycles → `assets/v2/img/piezas/{1100,700}/NNN.webp`. Para regenerarla:
```bash
pip install bpy==4.2.0   # Python 3.11
python3.11 scripts/v2/logo3d/escena.py --out ~/logo-render --muestras 40 --res 1100
python3 scripts/v2/logo3d/empaquetar.py ~/logo-render
```

## Construir el sitio
```bash
npm install
npm run build:v2     # migra interiores, construye portada/precios/contacto/diagnóstico, demos, precios, sitemap y auditoría SEO
```
Fuentes del contenido: `scripts/v2/paginas/*` (portada, precios, contacto), `scripts/v2/migrar.mjs` (interiores desde su texto de producción), `catalogo.json` y `precios.json` (cifras), `scripts/v2/plantilla.mjs` (cabecera, menú y pie comunes).

## Cambios importantes
Ver `DESIGN_ENGINEERING_AUDIT.md`, `DESIGN_AUDIT.md`, `SEO_AUDIT.md` y `PERFORMANCE_AUDIT.md`.
