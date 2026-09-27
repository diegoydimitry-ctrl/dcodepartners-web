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
Recorrido completo de la sección en 6 s con `requestAnimationFrame`: se mide en cuanto la Preview del commit del 3D esté publicada (la medida de 59 fps / p95 16,8 ms tomada antes era aún de la secuencia de fotogramas y no cuenta). Móvil real: **NO MEDIDO**.

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
