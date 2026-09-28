# PERFORMANCE_AUDIT — dcodepartners.com

Medido el 27/09/2026 con `~/tools/perf.mjs` (Playwright + Chromium 141): **CPU ×4 más lenta, red de 200 KB/s con 150 ms de latencia, caché desactivada, mediana de 3 cargas**. Mismo servidor estático local para las dos versiones (sin compresión en ninguna de las dos, así que los KB son brutos). «Antes» = `8ff5f5b` (rev. 3). «Después» = esta rama.

| Página | Ancho | Primer pintado (FCP) | LCP | CLS | KB transferidos* | Peticiones |
|---|---|---|---|---|---|---|
| Portada antes | 390 | 5.956 ms | 5.956 ms | 0,002 | 1.886 | 43 |
| **Portada después** | 390 | **1.060 ms** | **1.060 ms** | **0** | 854 | 32 |
| Portada antes | 1440 | 5.856 ms | 6.888 ms | 0,002 | 1.555 | 42 |
| **Portada después** | 1440 | **1.092 ms** | **1.092 ms** | 0,013 | 864 | 18 |
| **Portada 3D en tiempo real** (`c6eb414`) | 390 | **1.072 ms** | **1.072 ms** (H1) | **0** | 749 (sin compresión; three gzip = 148) | **9** |
| **Portada 3D en tiempo real** | 1440 | **1.064 ms** | **1.064 ms** (H1) | 0,013 | 749 (ídem) | **9** |
| Precios antes | 390 | 5.388 ms | 6.000 ms | 0,037 | 1.551 | 30 |
| **Precios después** | 390 | **956 ms** | **1.836 ms** | **0** | **232** | **8** |
| Finanzas (departamento) antes | 390 | 5.292 ms | 5.292 ms | 0,001 | 1.328 | 37 |
| **Finanzas después** | 390 | **776 ms** | **776 ms** | 0 | **198** | **7** |

\* En la portada «después», los KB incluyen los fotogramas de la escena que se descargan **después** del primer pintado durante los 3 s de la medición (carga progresiva); no bloquean nada.

### Fluidez del 3D (medida en el navegador del equipo de Dirección, GTX 1060, Chrome, 803 px)
Recorrido completo de la sección en 6 s, intervalos entre `requestAnimationFrame` (Preview `96f9aa9`):

| | Secuencia de fotogramas (`3d50b45`) | **3D en tiempo real** |
|---|---|---|
| fps medio | 59 | **60** |
| p95 / p99 | 16,8 / 33,3 ms | **16,8 / 16,8 ms** |
| fotogramas > 33 ms | 5 (máx. 83 ms) | **0** (máx. 16,8 ms) |
| Peso de la escena | 4.575 KB (escritorio) | **141 KB** transferidos |

Móvil real y GPU integrada: **NO MEDIDO** (la escena baja sola la resolución si pasa de 21 ms por fotograma).

## Por qué
- 11 hojas de estilo y 8 scripts por página → 1 hoja común (`dc.css`) + la de la página, y 1 módulo común (`sitio.js`, 4 KB).
- Sin Three.js en la carga (antes, motor + escena + texturas). El 3D son imágenes: la primera, precargada; el resto, en orden (1 de cada 8, luego cada 4, cada 2 y el resto) con cuatro descargas a la vez, solo en esa página.
- Las demos (hasta 290 KB de JS cada una) ya no viven en la portada: se cargan al abrir el visor.
- Fuentes: dos ficheros propios (80 + 34 KB, subconjunto latino) con `preload` de la principal.
- El asistente y el formulario (`main-b.js`, 30 KB) se piden cuando el navegador está libre; en /contacto, al entrar.

## Lo que NO se ha medido aquí
- **FPS e INP en hardware real** (el entorno no tiene GPU). HIPÓTESIS: el héroe dibuja como mucho dos imágenes por fotograma en un canvas 2D, sin WebGL; en un móvil medio debería ir a la frecuencia de la pantalla.
- Core Web Vitals de campo (CrUX): no hay datos de esta rama publicada.
- Peso final de la secuencia (72 fotogramas, medido con `du`/`os.path.getsize`): **escritorio 1100 px = 4.575 KB (63,5 KB/fotograma)**; **móvil 700 px = 2.583 KB (35,9 KB/fotograma)**. En móvil, con ahorro de datos o red 2G/3G se cargan 1 de cada 2: **1.326 KB (37 fotogramas)**. La carga es progresiva y posterior al primer pintado, así que no cuenta para FCP/LCP (el póster, sí: 1 fotograma).

## 28/09/2026 — demos nuevas de la portada y web de Sánchez Rubio
Mismo método (`perf.mjs`, 390 px, CPU ×4, 4G lenta, mediana de 5). «Antes» = `42b53f2`; «Después» = `a04c66b` + carga diferida del CSS.

| Página | FCP / LCP | CLS | Peticiones hasta `load` |
|---|---|---|---|
| Portada antes | 1.072–1.092 ms | 0 | 9 |
| Portada con demos, CSS bloqueante (descartado) | 1.188–1.236 ms (+120 ms) | 0 | 10 |
| **Portada con demos, CSS diferido** | **1.088 ms** | **0** | 9 (+CSS y JS de las demos después) |

Demos en uso (390 px, CPU ×4): 0 *long tasks*; p99 entre fotogramas 16,8 ms. Detalle en `DESIGN_ENGINEERING_AUDIT.md` §4.1.

## 28/09/2026 (noche) — demos con escena 3D propia y webs de ejemplo que duermen
«Antes» = `c4d4b43` (Preview de las 17:00); «después» = `a166268`. Mismo servidor local; el render de Sánchez Rubio,
**en pausa** durante las medidas (dos CPU compartidas).

**Carga** (`perf.mjs`, CPU ×4, 4G lenta, mediana de 3):

| Página | Ancho | FCP antes → después | LCP antes → después | CLS | KB · peticiones antes → después |
|---|---|---|---|---|---|
| Portada | 390 | 1.148 → 1.196 ms | 1.148 → 1.196 ms | 0 | 794 · 10 → 796 · 10 |
| Portada | 1440 | 1.208 → 1.184 ms | 1.208 → 1.184 ms | 0,013 | 794 · 10 → 796 · 10 |
| `/servicios/paginas-web` | 390 | 1.052 → 1.140 ms | 1.392 → 1.448 ms | 0 | 595 · 19 → **522 · 16** |
| `/servicios/paginas-web` | 1440 | 1.128 → 1.104 ms | 1.404 → 1.408 ms | 0,017 | 265 · 8 → 274 · 8 |

Diferencias de ±90 ms en uno u otro sentido: ruido del entorno. La carga no empeora; en el móvil baja lo transferido
(solo se piden las imágenes de la web activa).

**Uso** (`interaccion.mjs` / `demos-inter.mjs`, Chromium sin GPU, CPU ×4): ver la tabla de
`DESIGN_ENGINEERING_AUDIT.md` §4 quinquies. Resumen: webs de ejemplo en escritorio, p95 entre fotogramas
**316,7 → 50,1 ms** y tareas largas **23 → 2**; demos en uso, 0 tareas largas y p95 16,7 ms en las cinco, antes y después,
con el DOM estable (solo una montada).
