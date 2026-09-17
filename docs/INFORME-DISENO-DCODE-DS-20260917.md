# Informe · D-Code Design System en dcodepartners.com

Fecha: 17-09-2026 · Rama: `diseno/dcode-design-system` (desde `main` 9994abe) · Sin push, sin merge y sin despliegue.

> Documento interno. `docs/` queda fuera del despliegue por la lista blanca de `.vercelignore`.
>
> **Aviso:** el repositorio es público. Este informe, como todo `docs/`, se puede leer en GitHub. No contiene secretos ni precios.

## 0. Resumen

Es una pasada de convergencia y calidad, no un rediseño. El posicionamiento y los textos comerciales no cambian, salvo un CTA que no coincidía con su destino.

**Ronda 1**
1. P0 de exposición confirmado en producción y cortado en la rama.
2. Una sola paleta, alineada con el tema noche del DS.
3. Marca vectorial del DS en cabecera y pie.
4. Selector de idioma con enlaces reales.
5. Etiquetas por encima de 11 px.

**Ronda 2**
1. Revisión de la lista blanca (1f773ed) con simulación de Preview.
2. Centinela de enlaces.
3. Auditoría funcional y visual de las 72 páginas.
4. Teclado: Esc y foco.
5. Rendimiento de las páginas legales.
6. Demo de Finance en AA.
7. Conformidad real con el DS.
8. Tres textos tapados por velos oscuros, que ya pasaba en `main`.

**Resultado final:**

| Prueba | Resultado |
|---|---|
| `qa-preview-check` contra la Preview simulada | **560 comprobaciones, 0 problemas** |
| `check:superficie --url` | verde |
| `check:enlaces` | 0 errores |
| Funcional (menús, chat, formulario, idioma) | 127 pruebas, 0 fallos |
| Maquetación | 360 comprobaciones, 0 problemas |
| Contraste AA con la paleta nueva | 0 fallos (medido en reposo) |

## 1. Exposición y superficie de despliegue

### 1.1 Producción (lectura GET, 17-09-2026)

`curl` está bloqueado por el proxy; se comprobó con el fetch de Vercel MCP.

| Ruta | HTTP |
|---|---|
| `/docs/estrategia-monetizacion-dcode-partners.md` | **200** |
| `/scripts/qa-preview-check.js` | **200** |
| `/automation/n8n/linkedin-auto-post/README.md` | **200** |
| `/lib/providers.js` | **200** |
| `/.github/workflows/qa-preview.yml` | **200** |
| `/automation/` | 404 |
| `/README.md` | 404 |
| `/package.json` | 404 |

Detalle y corrección definitiva: `docs/INFORME-EXPOSICION-WEB-20260917.md` (commit 1f773ed, lista blanca).

### 1.2 Revisión crítica de 1f773ed: simulación de Preview

Método:
1. `git archive` de la rama y de `main`.
2. `buildFileTree` de `@vercel/client`, con la misma selección que la integración de Git.
3. `vercel build --yes` sin conexión.
4. Emulador de la Build Output API en un puerto 91xx.

**Ficheros subidos y estáticos, main → rama:**

| | main | rama |
|---|---|---|
| Subidos | 123 | 110 |
| Estáticos | 118 | 106 |

**La única diferencia son ficheros internos y `dcp4`:**
- `docs/estrategia-monetizacion-dcode-partners.md`
- `scripts/` (4 ficheros)
- `automation/n8n/` (4 ficheros)
- `.github/workflows/qa-preview.yml`
- `README.md` (solo en la subida; el constructor estático ya lo excluía)
- `assets/css/dcp4.css` y `assets/js/dcp4.js`

No falta ninguna página ni ningún estático:
- 72 HTML, incluidos `/en/404`, el blog EN y `/sistema-financiero/app` y `/demo`;
- favicons, `site.webmanifest`, `og-image.png`, fotos, fuentes, `knowledge-base.json`, `robots.txt` y `sitemap.xml`.

Todo recurso referenciado desde el HTML existe en la salida.

**Funciones:**
- `chat.func` incluye `lib/providers.js` y `knowledge-base.json`.
- `contact-fallback.func` incluye `node_modules/resend`.

**Enrutado** (`config.json`, diferencias con `main`):
- añade `^/lib(...)$ → 307 /404`;
- añade `X-Frame-Options` y `frame-ancestors`.

`check:superficie --url` contra la rama:
- rutas internas: 404, y `/lib/providers.js` responde 307;
- rutas públicas: 200.

**Fallos encontrados en la herramienta, no en el commit:**
1. **`boa-serve.mjs` no envía `Content-Type`.** Con `X-Content-Type-Options: nosniff`, Chromium bloquea CSS y JS, así que una QA visual contra ese emulador corre sobre páginas sin estilos y sin scripts, y aun así da «0 problemas». Los códigos HTTP del informe de exposición siguen siendo válidos. Para esta ronda se usó una copia con tipos MIME: `/home/claude/eco/_tools/boa-serve-mime.mjs`.
2. **Protección de despliegues desactivada.** La API de Vercel devuelve `ssoProtection` y `passwordProtection` desactivadas. Las Previews son públicas:
   - el paso de CI `check:superficie --url <Preview>` funciona sin credenciales;
   - las Previews de ramas basadas en `main` sin la lista blanca exponen lo mismo que producción.

**Rama `seguridad/superficie-despliegue`** (b31cce4, 7a14617): su centinela pasa (128 → 112 desplegados, 0 internos). No se tocó.

## 2. Tokens: conformidad con el DS (tema noche)

| Token DS | Valor DS | styles.css | dcp5.css | Estado |
|---|---|---|---|---|
| bg | `#06080d` | `--bg #06080d` | `--v-bg #06080d` (antes `#06080f`) | ✓ |
| surface-1 | `#0b0f17` | `--bg-elev #0c1019` | `--v-bg-2 #0b0f17` (antes `#0a0e1b`) | ✓ / ≈ |
| text | `#edf1f8` | `--ink #edf1f8` (antes `#eef2fb`) | `--v-ink #edf1f8` (antes `#f5f8ff`) | ✓ |
| text-2 | `#a7b0c4` | `--stone` | `--v-ink-2` (antes `#b3bfe0`) | ✓ |
| text-3 | `#8c95aa` | `--stone-soft` (antes `#8089a0`) | `--v-ink-3` (antes `#78849f`) | ✓ |
| signal | `#5b8cff` | `--blue` | botón primario, foco, idioma activo | ✓ |
| signal-text | `#a9c2ff` | `--signal-text` (nuevo) | hover de enlaces, menú activo, etiqueta enfocada | ✓ |
| data | `#43e0ff` | `--cyan` | `--v-a` (antes `#4dd0e1`) | ✓, solo dato y decoración |
| warn / bad | `#f5a524` / `#ff6b62` | `--amber` / `--red` (antes `#ffb454` / `#ff6b6b`) | — | ✓ |
| Degradado de marca | cian → azul → violeta, solo en hero | `--grad-brand` | `--v-grad` (antes cian → violeta → rosa) | ✓ |
| Radio de superficies | 12 | — | `--rad 12` (antes 18) | ✓ |
| Radio de controles | 8 / pill | botones pill | botones pill | ✓ (el DS admite pill) |
| Curva | `cubic-bezier(.2,.8,.2,1)` | — | `--ease` (antes `.22,.75,.28,1`) | ✓ |
| Foco | 2 px azul, separación 2 px | `:focus-visible` (antes cian, 3 px) | `:where(...)`, mega-menú, índice | ✓ |
| Tipografía | Space Grotesk / Inter / JetBrains Mono, autoalojadas | ✓ | ✓ | ✓ |
| Cuerpo web | 16 px | 16 px | `--f-body` mínimo 1rem (antes 15,5 px) | ✓ |
| Texto mínimo | 12 px; 11 px solo en mayúsculas | 76 reglas a 11 px, 18 a 12 px | ídem | ✓ (lockup «PARTNERS» a 10 px, rango del lockup) |
| Objetivo táctil | 44 px | burger 44; idioma con área de 44 px | — | ✓ (pie a 32 px: ver §8) |
| Alto completo | `dvh` | menú móvil y chat con `100dvh` y respaldo `vh` | — | ✓ |

**Divergencias que se mantienen, justificadas o pendientes:**
- **Sombras en tarjetas.** El DS noche dice «ninguna». La web tiene profundidad editorial (vidrio y velos). Pendiente 9.
- **Duraciones.** Las entradas al hacer scroll duran 300-700 ms, frente a 110/180/240 ms en el DS. Es la personalidad «aire editorial» de la web. Las transiciones de interfaz ya están en 180-300 ms. Pendiente 9.
- **Bucles infinitos decorativos** (pulsos de estado «en vivo», flujo de los diagramas, indicador de scroll del hero). Con `prefers-reduced-motion` no queda ninguno: medido en 10 páginas × 2 anchos. Se quitaron los dos más caros o de todas las páginas: la deriva del fondo y el anillo del chat. Pendiente 9.
- **`--green #34e7a4`** coincide con `data-2` del DS; no es el `ok`.
- **Superficies de la demo de Finance** (`#0a0e17` / `#10151f`): se conservan como réplica del producto. Textos, estados y acento sí están ya en valores del DS.

## 3. Marca, cabecera, pie e idioma

- **Logotipo:** 136 sustituciones del PNG por el SVG del DS (68 cabeceras a 34×29 y 68 pies a 30×26), con el nombre accesible «D-Code Partners». Verificado en navegador en 72 páginas × 5 anchos: visible, medida correcta y sin solapes con el menú ni con `nav-right`.
- **Selector de idioma:** hrefs reales con `hreflang` y `aria-current`. En las 68 páginas con cabecera enlaza con la espejo existente, comprobado por `check:enlaces`. Se añadió en 7 páginas ES que no lo tenían.
- **Deriva que queda:** el enlace «D-Code Finance» solo aparece en el pie de `/sistema-financiero`. Ver PENDIENTE 5.

## 4. Auditoría funcional y visual (ronda 2)

Herramientas:
- `/home/claude/eco/_tools/audit-web-ds.mjs`: maquetación, funcional y movimiento.
- `npm run check:enlaces`: nuevo, también en CI.

### 4.1 Centinela de enlaces (`scripts/check-internal-links.mjs`)

Cubre 72 páginas, 4.244 enlaces y recursos internos, 88 bloques JSON-LD y 66 URLs de sitemap.

**Resultado en la rama: 0 errores.** Comprueba:
- anclas;
- canonical propia;
- hreflang recíprocos entre ES y EN;
- selector de idioma a la página espejo;
- sitemap frente a páginas indexables, en los dos sentidos;
- JSON-LD válido y con `@type`.

En `main` da 251 errores: `<a href="#">` y selectores ausentes. Se comprobó por mutación que detecta:
- un enlace roto;
- un JSON-LD inválido;
- una canonical ajena;
- un selector a una página inexistente;
- un sitemap desalineado.

**Enlaces rotos: 0.**

### 4.2 Funcional (5 páginas ES/EN × escritorio y móvil, 127 pruebas)

| | Antes | Después |
|---|---|---|
| Fallos | 36 | **0** |

Corregido:
- **Esc no cerraba** el mega-menú, el menú móvil ni el asistente. Ahora los cierra y devuelve el foco al disparador, al burger o a la burbuja.
- **El asistente no enfocaba su campo al abrirse:** el `focus()` se lanzaba con la ventana aún en `visibility:hidden`.

Verificado sin cambios:
- el mega-menú se abre con hover y con foco, y Tab entra en él;
- foco visible;
- el menú móvil está cerrado al cargar y fuera del orden de tabulación; se abre y el submenú «Capacidades» se despliega;
- CTA móvil de 44 px;
- los enlaces navegan;
- el selector de idioma lleva a la espejo;
- el formulario no avanza con un paso vacío y enfoca el campo inválido (validación nativa);
- 0 errores JS.

**No verificable aquí:** banner de CookieYes, gtag y Turnstile (dominios bloqueados por el proxy) y el envío real del formulario y del chat (sin credenciales).

### 4.3 Maquetación y contraste (72 páginas × 1440/1280/1024/768/390)

- **Maquetación:** 0 problemas en logo, selector, burger, solapes de cabecera y desbordamiento.
- **Contraste AA:** 0 fallos en reposo. Las capturas a mitad de transición (fundidos de entrada, palabra rotativa del hero) se descartaron volviendo a medir con las animaciones asentadas.

Corregido en la ronda:
- **Migas:** el separador «/» estaba a 2,4:1.
- **Demo de Finance:**
  - texto secundario a 2,8-3,0:1, píldora «Enviada» a 4,3:1 y 4 etiquetas por debajo de 11 px;
  - **las etiquetas DEMO estaban en ámbar y violeta**, cuando el DS pide gris: ahora son neutras.
- **Texto tapado por velos oscuros (ya pasaba en `main`):**
  - `/departamentos` ES/EN a 390 px: la mitad inferior del titular «Así se combinan los Departamentos entre sí» quedaba bajo el velo del bloque siguiente, pintado en un contexto de apilamiento posterior;
  - `/contacto`: la barra de título de «reservar.cal» quedaba tapada;
  - `/contacto` a 390 px: «Ver preguntas frecuentes» quedaba casi invisible bajo el fundido del pie (`footer::before` sobresalía 64 px hacia arriba y el pie, aislado, se pinta después de `<main>`).
  - Barrido por píxeles de los velos de `<main>` y del pie en 71 páginas a 390/768/1440 (147 textos candidatos, glifos con y sin velo): en `main`, 2 titulares tapados, más el botón de FAQ, visto en captura; en la rama, 0. Los 9 avisos restantes tienen el texto legible y un instrumento brillante detrás.

### 4.4 Rendimiento y movimiento

- **Páginas legales y 404** (sin dcp6/dcp8): iban a **9-11 fps** en Chromium sin GPU, también en `main`. La causa era una capa fija de 160vmax con `blur(40px)` y una deriva infinita. Las transiciones del mega-menú y del chat tardaban casi 1 s en empezar. Sin blur y sin bucle: **61 fps**, con aspecto indistinguible en captura.
- **`prefers-reduced-motion`:** 0 contenidos ocultos y 0 animaciones infinitas (10 páginas × 1440/390).
- **CSS por página:** unos 290 KB sin comprimir y unos 76 KB en gzip (solo medición).

## 5. Honestidad

- CTA de la home: «Ver casos internos» / «See internal cases».
- Etiquetas DEMO de Finance en gris (§4.3).

## 6. Analítica y consentimiento

- CookieYes se carga antes que gtag.
- Su configuración bloquea `googletagmanager.com/gtag/js` en la categoría analytics hasta que hay consentimiento.
- No hay Google Consent Mode.
- **No se añade el snippet de denegado por defecto:** sin la opción «Support GCM» activa, GA quedaría denegado incluso después de aceptar. Ver PENDIENTE 4.

## 7. Capturas

| Serie | Ruta |
|---|---|
| BEFORE | `/home/claude/eco/_shots/web/before` |
| AFTER (ronda 1) | `/home/claude/eco/_shots/web/after` |
| **FINAL (ronda 2)** | **`/home/claude/eco/_shots/web/final`** |

FINAL: 8 rutas × 1440/1280/1024/768/390, tomadas contra la Preview simulada.

## 8. Accesibilidad pendiente de alcance, no de decisión

- **Enlaces del pie a 32 px de alto:** cumplen WCAG 2.2 AA (24 px), no los 44 px del DS. Subirlos alarga mucho el pie en móvil.
- **Sin trampa de foco** en el menú móvil ni en el asistente; Esc ya los cierra. El DS pide `inert` en el fondo en los drawers.

## 9. PENDIENTE DECISIÓN

1. **Email del JSON-LD de Organization:** `dcodedepartment@gmail.com`. No se cambia.
2. **Cargos de los fundadores:** los dos figuran como «Co-Founder & CEO». No se cambia.
3. **«Sistema Operativo Empresarial»** en el título de la home y en /conocenos, mientras D-Code OS figura «En construcción». No se cambia.
4. **Consent Mode v2:** activar «Support GCM» en CookieYes y, después, añadir el snippet con denegado por defecto.
5. **Pie:** «D-Code Finance» en todos los pies o en ninguno.
6. **Repositorio público:** historial y visibilidad. Ver el informe de exposición.
7. **Protección de las Previews de Vercel:** hoy desactivada.
8. **Botón primario plano y radio 12:** validar en la Preview. Lo pide el DS, pero es un cambio visible.
9. **Web frente al DS:** sombras editoriales, entradas de 300-700 ms y pulsos «en vivo» infinitos. ¿Excepción de personalidad web o convergencia completa?
10. **CSP completa en Report-Only:** hace falta la lista de orígenes desde la consola de producción.

## 10. Commits de la rama (desde 9994abe)

```
d0b8bef Legibilidad: el velo del pie ya no oscurece lo último del contenido
ec72cf7 Conformidad con el DS: cuerpo web a 16 px como mínimo y dvh en el menú móvil y el chat
1afa5c0 Legibilidad: dos velos oscuros tapaban texto a 390 px (ya pasaba en main)
0928604 QA: la demo de Finance entra en qa-preview-check y check:enlaces corre en CI
5014be0 Conformidad con el DS: foco azul, radio 12, una curva, 12 px y áreas táctiles
dfdf020 Demo de Finance: contraste AA, etiquetas DEMO en gris y colores del DS
67fbcbf Rendimiento: el fondo de las páginas sin instrumento deja de ir a 10 fps
5d8facc Teclado: Esc cierra mega-menú, menú móvil y asistente; el chat enfoca su campo
7ee9ea0 QA: centinela de enlaces internos, idiomas, sitemap y JSON-LD
1f773ed Seguridad: la superficie de despliegue pasa a lista blanca y queda vigilada por un centinela  (coordinación)
b47af23 Informe de la pasada del D-Code Design System en la web (interno, fuera del despliegue)
aa0bcb6 Hero móvil: la línea de estado vuelve a caber en una línea a 11 px
9e2a649 Accesibilidad: ninguna etiqueta por debajo de 11 px; la QA cubre Finance
d0dd622 Confianza: el CTA de la home dice «Ver casos internos» (EN: «See internal cases»)
4b97f95 Marca: el logotipo PNG pasa a la marca vectorial del DS; idioma rastreable
a01c5b4 Diseño: una sola paleta, alineada con el D-Code Design System
8dfbb23 Limpieza: se eliminan dcp4.css y dcp4.js, sin ninguna referencia en ES ni EN
62ca039 Seguridad: los documentos internos dejan de publicarse en la web
```

**Nota:** en 5d8facc y dfdf020 los `?v=` de algunas páginas apuntan ya a hojas que llegan en el commit siguiente. El estado final es coherente y `update-asset-versions` es idempotente.
