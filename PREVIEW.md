# PREVIEW — dcodepartners.com · dirección «Piezas» (blanco y negro)

| | |
|---|---|
| URL (sigue a la rama) | https://dcodepartners-web-git-web-dcp-cowork4-d-code-partners.vercel.app |
| Rama | `web/dcp-cowork4` (parte de `8ff5f5b`) |
| Commit | el último de la rama (ver `git log`) |
| Production | 28/09 11:10: publicada `42b53f2` por petición expresa de Dirección (`dpl_AZqAhyAtf32KTYe86VAD2ntZJpyr`). **28/09 21:38: redeploy a producción desde la cuenta de Vercel del equipo** de `47231fc` de esta rama (`dpl_5FWeFUtfgByEJbgArsgwFbu1TX8r`; no lo hizo Cowork 4, que solo sube commits a la rama). Rollback a la anterior: `dpl_AZqAhyAtf32KTYe86VAD2ntZJpyr` |

## Cómo probarla (5 minutos)
1. **Portada `/`**: baja despacio. Las piezas sueltas flotan, se unen y al final se enciende el píxel azul. Mueve el ratón: la luz del estudio se desliza por la cerámica. Cuatro frases en total.
2. Cambia a **modo claro** (sol, arriba a la derecha): la misma escena, con sombra de contacto sobre blanco.
3. Baja hasta el **pie**: Instagram, LinkedIn y Facebook.
3. **Tócalo**: cinco demos, cada una con su propia escena 3D (y solo la elegida está viva):
   - **Finance** (taller Brío): «Suelta las facturas» → vuelan de la bandeja al libro; «Revisar la que no cuadra» (neumáticos al 10 % en vez del 21 %) y corrígela. «Ver las 23» despliega el detalle.
   - **Comercial**: «Que entre el lead» → la ficha avanza por los carriles del embudo; «Aprobar y enviar» la respuesta redactada.
   - **Operaciones**: la semana como una mesa inclinada; «Aceptar el presupuesto» (los bloques caen en su sitio) y «Simular: el material llega tarde».
   - **Atención**: elige la pregunta del paciente; la conversación va delante y, detrás, las fuentes que el sistema consulta (se iluminan las que usa).
   - **D-Code OS**: tres capas que se separan al «Conectar con D-Code OS»; «¿Qué ha pasado hoy?» escribe el parte del día.
   «Otra vez» reinicia; «Abrir la aplicación completa» abre la demo entera en un visor (Escape la cierra).
4. **Webs de ejemplo en 3D** (`/servicios/paginas-web`, capítulo 01, y `/que-hacemos`, «Páginas web»): cuatro webs ficticias en un escenario 3D (Vandria, Orbe, **Brío — taller mecánico**, Clínica Sonrisa). Elige una abajo (o pulsa una de los lados), bájala por dentro, entra en una ficha, reserva mesa o cita. En **Brío**: pide cita (servicio, hora, matrícula), entra en «Sigue tu coche», aprueba el presupuesto y mira avanzar el coche por la pista del taller; «Taller» enseña el panel del jefe de taller (trabajos por columnas y lo que se automatiza). «Ver a pantalla completa» la abre a todo el ancho. En el móvil son marcos de teléfono que se deslizan con el dedo. Solo la web que miras está montada; las demás son un cartel ligero hasta que las eliges.
4. **Precios** (`/precios`): todo sale de `catalogo.json`; «Qué incluye» despliega el detalle.
5. **Contacto** (`/contacto`): configurador de cinco pasos y formulario por pasos. El envío real solo funciona en el dominio con Turnstile; en la Preview la verificación puede no cargar.
6. **Diagnóstico** (`/diagnostico`): tres preguntas y el resultado con tus horas y tu coste por hora.
7. **Finance** (`/sistema-financiero`), capítulo «Cada factura, registrada y encadenada»: la cadena de registros y la hoja de ruta de VERI*FACTU.
8. Cualquier interior (fíjate en el número de capítulo: su línea se llena al leer; y al cambiar de página, el fundido): `/departamentos/finanzas`, `/servicios/automatizaciones`, `/metodo`, `/faq`, `/aviso-legal`.
8. **EN**: `/en` y el selector ES/EN de la cabecera.
9. En el **móvil**: la escena arriba, el texto abajo; menú a pantalla completa. Las demos de «Tócalo» tienen su versión vertical (no la de escritorio encogida); los capítulos largos se pliegan con «Seguir leyendo»; el pie va en acordeón; el botón del chat se aparta al bajar y vuelve al subir.
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
