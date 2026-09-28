# PREVIEW — dcodepartners.com · dirección «Piezas» (blanco y negro)

| | |
|---|---|
| URL (sigue a la rama) | https://dcodepartners-web-git-web-dcp-cowork4-d-code-partners.vercel.app |
| Rama | `web/dcp-cowork4` (parte de `8ff5f5b`) |
| Commit | el último de la rama (ver `git log`) |
| Production | Se publicó **una vez**, por petición expresa de Dirección (28/09 11:10), desde `42b53f2` (arreglo del configurador). Desde entonces, **sin tocar**: lo posterior está solo en la Preview. Rollback: `dpl_EC1c3BqRJykCBctkXMQSeyC5hzB1` (`e658c31`) |

## Cómo probarla (5 minutos)
1. **Portada `/`**: baja despacio. Las piezas sueltas flotan, se unen y al final se enciende el píxel azul. Mueve el ratón: la luz del estudio se desliza por la cerámica. Cuatro frases en total.
2. Cambia a **modo claro** (sol, arriba a la derecha): la misma escena, con sombra de contacto sobre blanco.
3. Baja hasta el **pie**: Instagram, LinkedIn y Facebook.
3. **Tócalo**: cinco demos (Finance, Comercial, Operaciones, Atención, D-Code OS). Pulsa el botón de cada una y mira el lienzo; al final, «Otra vez». «Abrir la aplicación completa» abre la demo entera en un visor (Escape la cierra).
4. **Precios** (`/precios`): todo sale de `catalogo.json`; «Qué incluye» despliega el detalle.
5. **Contacto** (`/contacto`): configurador de cinco pasos y formulario por pasos. El envío real solo funciona en el dominio con Turnstile; en la Preview la verificación puede no cargar.
6. **Diagnóstico** (`/diagnostico`): tres preguntas y el resultado con tus horas y tu coste por hora.
7. **Finance** (`/sistema-financiero`), capítulo «Cada factura, registrada y encadenada»: la cadena de registros y la hoja de ruta de VERI*FACTU.
8. Cualquier interior (fíjate en el número de capítulo: su línea se llena al leer; y al cambiar de página, el fundido): `/departamentos/finanzas`, `/servicios/automatizaciones`, `/metodo`, `/faq`, `/aviso-legal`.
8. **EN**: `/en` y el selector ES/EN de la cabecera.
9. En el **móvil**: la escena arriba, el texto abajo; menú a pantalla completa.
10. Con **movimiento reducido** activado en el sistema: la pieza montada, quieta, y los capítulos uno debajo de otro.

## Páginas principales
`/` · `/que-hacemos` · `/servicios/*` (5) · `/departamentos/*` (8) · `/sistema-financiero` · `/precios` · `/metodo` · `/diagnostico` · `/contacto` · `/casos-exito` · `/cambios-en-proceso` · `/garantias` · `/faq` · `/conocenos` · `/blog` (+3) · legales (6). Todas en `/en/…`.

## Escenas 3D
Una: **las piezas** (portada), en tiempo real con three.js. Fuente: `scripts/v2/escena/piezas.js`; se empaqueta con `npm run build:3d` (incluido en `build:v2`) en `assets/v2/js/piezas3d.js`.
Imagen para movimiento reducido / sin WebGL: `assets/v2/img/piezas/{1100,700}/072.webp` (render de Blender, `scripts/v2/logo3d/`).

## Construir el sitio
```bash
npm install
npm run build:v2     # migra interiores, construye portada/precios/contacto/diagnóstico, demos, precios, sitemap y auditoría SEO
```
Fuentes del contenido: `scripts/v2/paginas/*` (portada, precios, contacto), `scripts/v2/migrar.mjs` (interiores desde su texto de producción), `catalogo.json` y `precios.json` (cifras), `scripts/v2/plantilla.mjs` (cabecera, menú y pie comunes).

## Cambios importantes
Ver `DESIGN_ENGINEERING_AUDIT.md`, `DESIGN_AUDIT.md`, `SEO_AUDIT.md` y `PERFORMANCE_AUDIT.md`.
