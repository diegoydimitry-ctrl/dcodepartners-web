# Informe · D-Code Design System en dcodepartners.com

Fecha: 17-09-2026 · Rama: `diseno/dcode-design-system` (desde `main` 9994abe) · Sin push ni merge.

> Documento interno. `docs/` queda excluido del despliegue por `.vercelignore`.

## 0. Resumen

Es una pasada de convergencia y calidad, no un rediseño. El posicionamiento y los textos comerciales no cambian, salvo un CTA que no coincidía con su destino.

1. **P0 de seguridad confirmado y corregido en la rama.** Producción servía documentos internos con HTTP 200, entre ellos la estrategia de precios.
2. **Una sola paleta.** Los dos juegos de tokens en competencia usan ahora los valores del tema noche del DS.
3. **Marca vectorial del DS** en cabecera y pie de las 68 páginas con cabecera.
4. **Selector de idioma rastreable**, con hrefs reales. Además, 7 páginas ES que no tenían selector lo tienen ahora.
5. **Accesibilidad:** ninguna etiqueta visible por debajo de 11 px, salvo el lockup, que queda en 10 px como permite el DS.
6. **QA:** antes 512 comprobaciones y 0 problemas; después 528 comprobaciones y 0 problemas.

## 1. Exposición en producción (lectura GET, 17-09-2026 ~04:53 UTC)

El proxy de este entorno bloquea `curl` a dcodepartners.com (403 en CONNECT). Las comprobaciones se hicieron con el fetch de Vercel MCP sobre `https://dcodepartners.com`.

| Ruta | HTTP |
|---|---|
| `/docs/estrategia-monetizacion-dcode-partners.md` | **200** (`text/markdown`, documento completo de precios y márgenes) |
| `/scripts/qa-preview-check.js` | **200** |
| `/automation/` | 404 (sin índice de directorio) |
| `/automation/n8n/linkedin-auto-post/README.md` | **200** |
| `/lib/providers.js` | **200** (sin claves: las lee de variables de entorno) |
| `/.github/workflows/qa-preview.yml` | **200** |
| `/README.md` | 404 |
| `/package.json` | 404 |

Los workflows JSON de n8n (`automation/n8n/*/*.workflow.json`) no se pidieron para no volcarlos, pero están en la misma carpeta y es de suponer que también daban 200.

### Mecanismo elegido

- **`.vercelignore`** (commit 62ca039) excluye `/docs`, `/automation`, `/scripts`, `/.github` y `/README.md`.
  - Vercel lo aplica también en los despliegues de la integración con GitHub. Hay evidencia en un log real de un build disparado por Git: «Removed N ignored files defined in .vercelignore».
  - La documentación dice: «Non-targeted files are prevented from being deployed and served».
  - Los patrones van anclados con `/`, porque sin barra coinciden a cualquier profundidad.
- **No se ignoran:**
  - `package.json`: hace falta para instalar `resend`, que usa `api/contact-fallback.js`, y ya da 404.
  - `lib/`: `api/chat.js` hace `require('../lib/providers')`.
  - `assets/data/knowledge-base.json`: lo usa la API y es contenido público.
- **`lib/`:** su lectura se corta con un `redirect` `/lib/:path*` → `/404` en `vercel.json`. Los redirects se evalúan antes que el sistema de archivos, y el empaquetado de la función no depende del enrutado.
- **Cabeceras nuevas:** `X-Frame-Options: SAMEORIGIN` y `Content-Security-Policy: frame-ancestors 'self'`. No hay iframes que embeban el sitio desde fuera; se buscó en todo el ecosistema.
- **CSP completa (script-src):** no se añade, ni siquiera en modo Report-Only. Los orígenes de CookieYes, gtag y GA4 (con sus regiones), el webhook de n8n y Turnstile no se pueden enumerar con seguridad desde aquí, porque el egress está bloqueado. Queda pendiente para cuando haya acceso a la consola del navegador en producción.

### Verificación pendiente tras desplegar la Preview

Pedir las 8 rutas de la tabla y `/lib/providers.js`: deben dar 404 o redirigir. Probar además el chat (`/api/chat`) y el formulario de contacto.

**Importante:** ignorar archivos no borra el historial. Si el repositorio de GitHub es público, la estrategia de precios sigue en `git log`. No se pudo comprobar la visibilidad (api.github.com bloqueada). Además, el documento ha estado público y puede estar cacheado o indexado.

## 2. Tokens

| Token | Antes | Después (DS noche) |
|---|---|---|
| `--bg` / `--v-bg` | `#06080d` / `#06080f` | `#06080d` |
| `--v-bg-2` | `#0a0e1b` | `#0b0f17` (surface-1) |
| `--ink` / `--v-ink` | `#eef2fb` / `#f5f8ff` | `#edf1f8` |
| `--stone` / `--v-ink-2` | `#a7b0c4` / `#b3bfe0` | `#a7b0c4` |
| `--stone-soft` / `--v-ink-3` | `#8089a0` / `#78849f` | `#8c95aa` |
| `--cyan` / `--v-a` | `#43e0ff` / `#4dd0e1` | `#43e0ff` (data) |
| `--violet` / `--v-b` | `#9b6bff` / `#7c6cff` | `#9b6bff` (valor también usado en Finance) |

- **Nombres:** se conservan todos. `dcp7.css` (27 literales) y `dcp5.js` (11 tripletas RGB del ambiente) usan los mismos valores.
- **`--v-grad`:** pasa de cian → violeta → rosa a **cian → azul → violeta**, el mismo que `--grad-brand`. Solo se usa en titulares `.grad` y en la cifra.
- **Botón primario:** pasa del degradado al **azul de acción plano `#5b8cff`** con texto `#04070f`, como pide el contrato de Button del DS. El idioma activo usa también el azul, no el cian.
- **Pendiente de alcance, no de decisión:** `styles.css` sigue usando `--grad-brand` en unos 12 elementos decorativos de capas antiguas, que quedan tapados por las capas posteriores. El rosa `--v-c` se mantiene como color de departamento y de ambiente. Las partículas del hero (dcp6.js) conservan su recorrido de color hasta magenta.
- **Limpieza:**
  - Se eliminan `dcp4.css` y `dcp4.js`, sin referencias en ES ni EN.
  - `update-asset-versions.js` cubre ahora `finance-demo.css` y los 4 JS de la demo, que tenían `?v=2` escrito a mano. El script se ejecutó y es idempotente (0/72 en la segunda pasada).

## 3. Marca y deriva de cabecera y pie

**Logotipo:**
- 136 sustituciones: 68 en cabecera a 34×29 y 68 en pie a 30×26.
- Reparto: 34 páginas ES y 34 EN. Quedan 0 `<img>` del logotipo.
- El SVG en línea lleva `role="img"` y `aria-label="D-Code Partners"`. Los píxeles van en `currentColor` blanco y el píxel central en `#5b8cff`.
- Favicons y `logo` del JSON-LD siguen en PNG, porque Google exige imagen rasterizada.
- Las 4 páginas sin cabecera (`sistema-financiero/demo` y `app`, ES y EN) no cambian.

**Variantes:**

| | Cabecera | Pie |
|---|---|---|
| Antes, literales | 15 | 7 |
| Antes, sin contar `aria-current` ni espacios | 3 (ES con selector, ES sin selector, EN) | 5 |
| Después, normalizadas | 2 (ES, EN) | 5 |

Las cabeceras literales son ahora 66, porque cada página lleva sus propios hrefs de idioma.

**Deriva corregida:** 7 páginas ES sin selector de idioma, cuyos espejos EN sí lo tenían:
- 404
- aviso-legal
- acuerdo-encargado-tratamiento
- condiciones-contratacion
- cookies
- privacidad
- seguridad

**Deriva no tocada:**
- El pie de `/sistema-financiero` (ES y EN) añade un enlace «D-Code Finance» que no tienen los demás pies. Ver PENDIENTE 5.
- El pie de `en/faq` escribe `&amp;` en lugar de `&`. Es equivalente y no requiere cambio.

## 4. Selector de idioma

- `<a href="#" data-lang>` pasa a llevar hrefs reales (`/ruta` ↔ `/en/ruta`, raíz `/` ↔ `/en`), con `hreflang`, `lang` y `aria-current` en el HTML. Quedan 0 `href="#"`.
- `main.js` los sigue reajustando a la URL de la visita, lo que es útil en la 404. La raíz inglesa usa `/en`, sin barra final, para evitar una redirección.

## 5. Honestidad

- CTA de la home: «Ver casos reales» → «Ver casos internos»; en EN, «See real cases» → «See internal cases».
- Los textos «tres casos reales de D-Code Partners» de `/casos-exito` y `/garantias` no se tocan: dicen explícitamente que son de la propia empresa.

## 6. Analítica y consentimiento

- **Orden actual en `<head>`:** script de CookieYes (síncrono), después `gtag.js` async y después `gtag('config')`. No hay valores por defecto de Consent Mode.
- **Configuración del cliente CookieYes** (`script.js`, leído con WebFetch; lectura resumida, confianza media):
  - El bloqueo automático está activo.
  - `googletagmanager.com/gtag/js` está en la categoría *analytics*.
  - Analytics está desactivado por defecto con RGPD.
  - **No hay configuración de GCM** (no aparecen `gcm`, `wait_for_update` ni `url_passthrough`).
- **Conclusión:** GA no debería cargarse antes del consentimiento, porque CookieYes bloquea la etiqueta. **No se añade** el snippet de Consent Mode v2 con denegado por defecto. Sin la opción «Support GCM» activa en el panel de CookieYes, nadie enviaría `consent update` y GA quedaría denegado incluso después de aceptar, con pérdida de datos. Ver PENDIENTE 4.

## 7. Accesibilidad, responsive y QA

`qa-preview-check.js` añade `/sistema-financiero` y `/en/sistema-financiero`, y admite `QA_PATHS` para pasadas parciales.

| Pasada | Comprobaciones | Problemas |
|---|---|---|
| Antes (worktree de `main` en :8081) | 512 | **0** |
| Antes, solo Finance (landing y demo, ES y EN) | 32 | 0 |
| **Después (rama en :8080, lista ampliada)** | **528** | **0** |

**Auditoría complementaria** (10 páginas a 1440 y 390; textos visibles no ocultos para lectores de pantalla):

| | Antes | Después |
|---|---|---|
| Textos < 11 px | 436 (34 clases, entre 8,5 y 10,9 px) | 20 (solo «PARTNERS» del lockup, a 10 px) |
| Contraste < 4.5 (o < 3 en texto grande) | 0 | 0 |

- **Cambio:** 76 declaraciones suben a `0.6875rem` (11 px), el mínimo del DS para etiquetas en mayúsculas.
- **Regresión detectada en las capturas y corregida:** la línea de estado del hero se partía a 390 px. Se redujo el tracking en ≤560 px. A 320 px, el estado más largo baja de línea (flex-wrap previsto).
- **Capturas AFTER:** `/home/claude/eco/_shots/web/after` (8 rutas × 4 anchos, sin errores). Revisadas la home a 1440 y 390 y /metodo a 1440 contra BEFORE, sin regresiones.

## 8. Rendimiento (solo medición)

- **CSS por página:** unos 289 KB sin comprimir y unos 76 KB en gzip (styles 168 KB + dcp5 58 + dcp7 44 + dcp6/dcp8 26).
- **La demo de Finance:** 244 KB.
- **`styles.css`** conserva reglas de capas antiguas que las posteriores sobrescriben. Consolidar esas capas es trabajo aparte; no se reestructura en esta pasada.

## 9. PENDIENTE DECISIÓN

1. **Email del JSON-LD de Organization:** `dcodedepartment@gmail.com` (Gmail en los datos estructurados de la marca). No se cambia.
2. **Cargos de los fundadores:** Diego Siñeriz y Dimitry Sosenko figuran los dos como «Co-Founder & CEO» en /conocenos (ES y EN). Dos CEO a la vez resta credibilidad. No se cambia.
3. **«Sistema Operativo Empresarial» / «Business Operating System»** en el `<title>` de la home y en /conocenos, mientras D-Code OS figura «En construcción» en /cambios-en-proceso. No se cambia.
4. **Consent Mode v2:** activar «Support GCM» en CookieYes (Advanced Settings) y, después, añadir el snippet con denegado por defecto antes del script de CookieYes en las 70 páginas.
5. **Pie:** decidir si el enlace «D-Code Finance» va en todos los pies (hoy solo en /sistema-financiero) o en ninguno.
6. **Historial de Git y caché:** confirmar si el repositorio es privado. Si es público, valorar reescribir el historial o asumir que la estrategia de precios es pública, y revisar si hay copias indexadas.
7. **Botón primario plano:** es un cambio visible respecto al degradado anterior. Lo pide el DS, pero conviene que Dirección lo valide en la Preview.
8. **CSP completa (Report-Only):** preparar la lista de orígenes desde la consola de producción: CookieYes, GA4, el webhook de n8n y Turnstile.

## 10. Commits

```
aa0bcb6 Hero móvil: la línea de estado vuelve a caber en una línea a 11 px
9e2a649 Accesibilidad: ninguna etiqueta por debajo de 11 px; la QA cubre Finance
d0dd622 Confianza: el CTA de la home dice «Ver casos internos» (EN: «See internal cases»)
4b97f95 Marca: el logotipo PNG pasa a la marca vectorial del DS; idioma rastreable
a01c5b4 Diseño: una sola paleta, alineada con el D-Code Design System
8dfbb23 Limpieza: se eliminan dcp4.css y dcp4.js, sin ninguna referencia en ES ni EN
62ca039 Seguridad: los documentos internos dejan de publicarse en la web
```
