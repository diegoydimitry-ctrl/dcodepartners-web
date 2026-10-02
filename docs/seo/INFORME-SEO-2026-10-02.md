# Auditoría e implementación SEO — dcodepartners.com

**Fecha:** 2 de octubre de 2026 · **Rama:** `seo/google-optimization` · **Commit:** `9ad03d7` (sale de `40237a1`, que es lo que hay en producción)
**Estado:** subido a GitHub y desplegado solo en Preview. No hay merge ni despliegue a producción.
**Preview:** https://dcodepartners-7mrzhhnp6-d-code-partners.vercel.app

Cómo se ha medido: todo lo de este informe sale de los ficheros que se despliegan, con `npm run qa:seo`. Lo que no se ha podido medir está marcado como **NO MEDIDO**. No hay ningún dato de posicionamiento, porque no se puede saber desde el código.

---

## 1. SEO ANTES

Medido sobre `40237a1` con el mismo script que mide el después.

| | Antes |
|---|---|
| Páginas HTML publicadas | 84 |
| Páginas indexables | 70 |
| URLs en sitemap.xml | 70 |
| URLs del sitemap con `<lastmod>` | 0 |
| Fallos de `qa:seo` | **88** |
| Avisos de `qa:seo` | **151** |

Los 88 fallos eran: 70 URLs del sitemap sin fecha, 6 artículos marcados como `og:type=website`, 6 sin `article:published_time` y 6 sin `dateModified` en sus datos estructurados.

Los 151 avisos eran: 70 páginas sin texto alternativo en la imagen social, 20 sin ruta de navegación estructurada, 16 con una URL que redirige dentro del JSON-LD (`/departamentos`), 14 sin ningún dato estructurado, 9 descripciones cortadas con «…», 8 páginas con muy pocos enlaces internos, 5 títulos de más de 65 caracteres, 1 título de 21 caracteres y 7 referencias a scripts sin versión.

Lo que ya estaba bien: title, description, canonical, robots y hreflang (es, en, x-default) en todas las páginas indexables; un solo h1 por página; demos, app y 404 con `noindex`; ninguna imagen sin `alt`; ningún enlace interno roto; analítica solo tras el consentimiento.

## 2. SEO DESPUÉS

| | Antes | Después |
|---|---|---|
| Páginas HTML publicadas | 84 | 86 |
| Páginas indexables | 70 | 72 |
| URLs en sitemap.xml | 70 | 72 |
| URLs del sitemap con `<lastmod>` | 0 | 72 |
| Fallos de `qa:seo` | 88 | **0** |
| Avisos de `qa:seo` | 151 | **0** |
| Páginas indexables sin datos estructurados | 14 | 0 |
| Títulos de más de 65 caracteres | 5 | 0 |
| Descripciones cortadas con «…» | 9 | 0 |
| Páginas que enlazan a `/diagnostico` | 3 | 37 |
| Páginas que enlazan a cada artículo del blog | 4 | 5 a 7 |
| Palabras en `/servicios/automatizaciones` | ~250 | 392 |

## 3. CAMBIOS IMPLEMENTADOS

1. **Títulos y descripciones.** ANTES → DESPUÉS en la sección 11.
2. **H1 con el tema de la página** en 5 servicios, 8 áreas, precios, FAQ y Finance (ES y EN). Siguen siendo una frase corta, como pide la guía de voz.
3. **Datos estructurados** unificados en un bloque por página (sección 10).
4. **Open Graph:** `og:type=article` y fechas en los artículos; `og:image:alt` y `twitter:image:alt` en todas.
5. **Sitemap con `<lastmod>`** que solo cambia cuando cambia el contenido real de la página.
6. **robots.txt:** se añade `Disallow: /api/`.
7. **Caché:** un año para los CSS y JS de `/assets/v2` que llevan `?v=` y para las fuentes.
8. **Bloque «Cuándo tiene sentido»** en los 5 servicios (ES y EN): tres señales del problema y enlaces a blog, precios y diagnóstico.
9. **Enlaces dentro de los artículos** hacia servicios, áreas y diagnóstico; «Diagnóstico gratuito» en el pie de todas las páginas.
10. **Artículo nuevo** (ES y EN): «Automatización para pymes: por dónde empezar y cuánto cuesta», con los precios que ya publica `precios.html`.
11. **Error visible corregido en inglés:** en las fichas del blog se colaba el nombre del fichero (`what-is-automation.md Fundamentals …`).
12. **Logo de la organización:** el anterior medía 120×101 y Google pide al menos 112×112; ahora apunta al de 512×512.
13. **Herramientas:** `npm run seo`, `check:seo`, `qa:seo`, `seo:mapa`, `seo:online`.

## 4. ARCHIVOS MODIFICADOS

96 ficheros: 2.599 líneas añadidas y 413 quitadas.

- **Nuevos:** `scripts/seo/datos.mjs`, `seo.mjs`, `qa-seo.mjs`, `lastmod.mjs`, `lastmod.json`; `docs/seo/MAPA-RASTREO.md`; `blog/automatizacion-para-pymes.html` y su versión en `/en`.
- **Configuración:** `package.json`, `vercel.json`, `robots.txt`, `sitemap.xml`, `assets/site.webmanifest`, `scripts/v2/sitemap.mjs`.
- **Páginas:** las 72 indexables (cabecera y JSON-LD; texto visible solo en las de la sección 3).
- **Textos:** 11 archivos de `scripts/v2/textos/` actualizados para que `check:textos` siga cuadrando.
- **No se ha tocado:** CSS, JavaScript, WebGL, chatbot, formularios, `/api`, demos, app de Finance.

## 5. NUEVAS RUTAS

| Ruta | Para qué búsqueda |
|---|---|
| `/blog/automatizacion-para-pymes` | automatización para pymes, IA para pymes, automatización de tareas |
| `/en/blog/automatizacion-para-pymes` | versión en inglés |

No se ha creado ninguna página de servicio nueva. Propuestas que dejo sin crear, porque son decisión tuya:

- **n8n para empresas.** La web no nombra herramientas a propósito (la FAQ dice que no se imponen). Publicar una página sobre n8n cambia ese criterio.
- **Digitalización de empresas** y **consultoría de automatización.** Solo tienen sentido con contenido propio (casos, proceso, cifras). Sin eso serían páginas puerta.

## 6. SITEMAP

- ANTES: 70 URLs, sin `<lastmod>`.
- DESPUÉS: 72 URLs, todas con `<lastmod>`, hreflang es/en/x-default y solo URLs canónicas e indexables.
- La fecha sale de una huella del título, la descripción y el texto de la página (`scripts/seo/lastmod.json`). Un cambio de versión de un script no la mueve.
- `qa:seo` falla si entra una URL con `noindex`, si falta una indexable o si los hreflang del sitemap no coinciden con los de la página.
- En producción sigue el sitemap antiguo hasta que se despliegue esta rama.

## 7. ROBOTS.TXT

ANTES:
```
User-agent: *
Allow: /
Sitemap: https://dcodepartners.com/sitemap.xml
```
DESPUÉS:
```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://dcodepartners.com/sitemap.xml
```
Las demos y la app de Finance no se bloquean a propósito: llevan `noindex` y Google tiene que poder leerlas para verlo.

## 8. CANONICAL

Sin cambios, estaba bien: las 72 páginas indexables tienen canonical absoluto, a sí mismas, en `https://dcodepartners.com` sin `www` ni barra final. `qa:seo` lo comprueba junto con `og:url`.

## 9. HREFLANG

Sin cambios en las 70 páginas que ya lo tenían; las 2 nuevas lo llevan. `es`, `en` y `x-default` (apunta al español), recíprocos y a páginas indexables. Se usa `es` y no `es-ES` porque el contenido no es exclusivo de España; cambiarlo no aporta nada.

## 10. STRUCTURED DATA

Un bloque JSON-LD por página, con `@graph` y nodos enlazados por `@id`.

| Página | Antes | Después |
|---|---|---|
| Inicio | Organization, WebSite | Organization completa (qué sabe hacer, zona, contacto), WebSite, WebPage |
| Servicios (5) | Service, BreadcrumbList | + WebPage; el servicio lleva nombre propio («Automatización de procesos») |
| Áreas (8) | Service, BreadcrumbList a una URL que redirige | + WebPage; la ruta apunta a `/que-hacemos` |
| Qué hacemos | nada | CollectionPage, BreadcrumbList, ItemList con los 5 servicios |
| Artículos (4) | Article sin `dateModified` | BlogPosting con fechas, sección y número de palabras |
| Blog | BreadcrumbList | + Blog con sus artículos |
| Finance | SoftwareApplication mínima | + sistema operativo, categoría y WebPage |
| Contacto, Conócenos | ninguna u Organization | ContactPage, AboutPage, Organization completa |
| Legales (6) | nada | WebPage, BreadcrumbList |
| FAQ, Precios | FAQPage, OfferCatalog | se conservan tal cual, + WebPage y BreadcrumbList |

No hay reseñas, valoraciones, premios ni precios nuevos. **No hay LocalBusiness:** exige dirección postal y la web no publica ninguna.

## 11. METADATA

Títulos (ANTES → DESPUÉS):

| Página | Antes | Después |
|---|---|---|
| `/` | D-Code Partners \| Automatización e IA para empresas | Automatización e IA para empresas \| D-Code Partners |
| `/que-hacemos` | Qué hacemos: automatización, IA, integraciones y software \| D-Code (66) | Automatización, IA, integraciones y software a medida \| D-Code |
| `/servicios/agentes-de-ia` | Agentes de IA y chatbots con los datos de tu negocio \| D-Code | Agentes de IA para empresas, con los datos de tu negocio \| D-Code |
| `/servicios/integraciones` | Integraciones entre tus herramientas: CRM, ERP, correo \| D-Code | Integración de herramientas: CRM, ERP, correo y web \| D-Code |
| `/departamentos/administracion` | Automatizar la administración de tu empresa: documentos, plazos y avisos \| D-Code (81) | Automatización administrativa: documentos y plazos \| D-Code |
| `/departamentos/clientes` | Atención al cliente automatizada con IA y seguimiento \| D-Code Partners (71) | Atención al cliente automatizada con IA \| D-Code Partners |
| `/departamentos/comercial` | CRM y seguimiento comercial automatizado para empresas \| D-Code | Automatización de ventas y CRM para empresas \| D-Code Partners |
| `/departamentos/direccion` | Panel de dirección con datos reales de tu empresa \| D-Code Partners (67) | Panel de dirección con los datos reales de tu empresa \| D-Code |
| `/faq` | Preguntas frecuentes — D-Code Partners | Preguntas frecuentes sobre automatización e IA \| D-Code Partners |
| `/blog` | Blog — Automatización e IA para empresas \| D-Code Partners | Blog de automatización e IA para empresas \| D-Code Partners |

H1 (ANTES → DESPUÉS):

| Página | Antes | Después |
|---|---|---|
| Automatizaciones | Lo que se repite cada semana deja de hacerse a mano. | Automatizamos los procesos que tu empresa repite cada semana. |
| Integraciones | El dato se escribe una vez y aparece donde tiene que aparecer. | Integramos tus herramientas para que cada dato se escriba una vez. |
| Páginas web | Hacemos webs que trabajan con tus sistemas, no folletos. | Hacemos páginas web que trabajan con tus sistemas, no folletos. |
| Sistemas a medida | Construimos lo que necesitas y no se vende hecho. | Construimos el software a medida que no se vende hecho. |
| Comercial | Ninguna venta se pierde por falta de seguimiento. | Automatizamos el seguimiento de ventas para no perder ninguna. |
| Finanzas | Cobras antes y ves el gasto cada día, no al cierre de mes. | Automatizamos la facturación y los cobros para que cobres antes. |
| Marketing | Tu web no deja de traer oportunidades. | Automatizamos la captación para que tu web traiga oportunidades. |
| Clientes | Cada cliente se siente cuidado, sin depender de nadie en concreto. | Automatizamos el seguimiento de clientes, del alta a la renovación. |
| Operaciones | Cada trabajo arranca solo y cumple su plazo. | Automatizamos tus operaciones para que cada trabajo cumpla su plazo. |
| Soporte | Tus clientes tienen respuesta rápida, también fuera de horario. | Automatizamos el soporte para responder también fuera de horario. |
| Administración | Mantenemos tu empresa vigilada, protegida y en orden. | Automatizamos la administración para tener tu empresa en orden. |
| Dirección | Cada mañana tienes una decisión clara, basada en datos reales. | Tu panel de dirección te da cada mañana una decisión clara. |
| Precios | Qué incluye y cuánto cuesta. | Estos son nuestros precios y lo que incluye cada uno. |
| FAQ | Todo lo que sueles preguntarnos antes de empezar. | Estas son las preguntas más frecuentes antes de empezar. |
| Finance | Un sistema financiero al que le preguntas qué está pasando en tu empresa. | D-Code Finance es el programa de facturación al que puedes preguntarle. |

**No se ha cambiado** el h1 de la portada («Conectamos tu empresa en un solo sistema.»): es la frase de marca y va sobre la escena 3D. El título y la entradilla ya llevan las palabras clave. Tampoco los de método, garantías, conócenos, casos y contacto.

Descripciones: se han reescrito las 5 de servicios en ES y EN (terminaban cortadas con «…») y la de diagnóstico (167 caracteres).

## 12. INTERNAL LINKING

| | Antes | Después |
|---|---|---|
| Páginas que enlazan a `/diagnostico` | 3 | 37 |
| Páginas que enlazan a cada artículo | 4 | 5 a 7 |
| Páginas huérfanas | 0 | 0 |
| Enlaces internos rotos | 0 | 0 |

Los artículos enlazan ahora, dentro del texto, a automatizaciones, agentes de IA, integraciones, área comercial y diagnóstico. Los servicios enlazan al blog, a precios, a método y a garantías. El mapa completo está en `docs/seo/MAPA-RASTREO.md` (URL → estado → indexable → canonical → sitemap → enlaces internos).

## 13. IMÁGENES

- Sin `alt`: 0 antes y 0 después. Sin `width`/`height`: 0.
- Imagen social: 1200×630, ahora con texto alternativo.
- Pendiente: la imagen social pesa unos 300 KB y es la misma para todas las páginas. Una por servicio y por artículo mejoraría cómo se ve al compartir. Es trabajo de diseño.

## 14. PERFORMANCE

- ANTES: los CSS y JS de `/assets/v2` y las fuentes de `/assets/v2/fonts` se servían con `max-age=0`, así que cada visita los volvía a validar.
- DESPUÉS: `max-age=31536000, immutable` cuando la URL lleva `?v=`, y para las fuentes. Comprobado en el Preview (`interior.css?v=…` responde con esa cabecera).
- `qa:seo` falla si un `?v=` no coincide con el contenido del fichero, para que nadie se quede con una versión antigua.
- WebGL, animaciones y carga de la portada: sin tocar.
- **NO MEDIDO: Core Web Vitals (LCP, INP, CLS).** PageSpeed Insights devolvió error 429 y este entorno no llega a dcodepartners.com.

## 15. INDEXACIÓN

- Indexables: 72. No indexables a propósito: 14 (8 demos, 4 de la app y la entrada de Finance, 2 páginas 404).
- Redirecciones 308: 10, sin cadenas y todas a páginas que existen.
- **NO MEDIDO: qué tiene Google indexado hoy.** Solo se ve en Search Console.
- **NO MEDIDO desde este entorno: códigos de estado en producción.** Lo comprobado con WebFetch: la portada y `/precios` responden bien, `www` y la barra final llevan a la URL canónica, y una URL inexistente da 404. `npm run seo:online` lo comprueba URL a URL desde tu equipo.
- El Preview lleva `X-Robots-Tag: noindex`, que es lo que hace Vercel en los Preview. En producción no se añade.

## 16. GOOGLE SEARCH CONSOLE

1. **Propiedad:** de tipo **Dominio** (`dcodepartners.com`), verificada por DNS. Cubre `www`, `http` y `https`. Si ya tienes una de prefijo de URL, vale, pero la de dominio es más completa.
2. **Sitemap:** envía `https://dcodepartners.com/sitemap.xml` en Sitemaps. Un solo sitemap; incluye ES y EN.
3. **Inspección de URLs**, después de desplegar, pidiendo indexación de:
   `/`, `/que-hacemos`, `/servicios/automatizaciones`, `/servicios/agentes-de-ia`, `/servicios/integraciones`, `/servicios/sistemas-a-medida`, `/precios`, `/blog/automatizacion-para-pymes`.
4. **Qué revisar:**
   - Páginas → «Rastreada: actualmente sin indexar» y «Duplicada: Google ha elegido una canónica diferente».
   - Mejoras → Rutas de exploración y Preguntas frecuentes: 0 errores.
   - Rendimiento → consultas con muchas impresiones y posición 8–20: son las que más cerca están de la primera página.
   - Core Web Vitals → datos reales de usuarios, cuando haya tráfico suficiente.
5. **Prueba de resultados enriquecidos** (search.google.com/test/rich-results): pasa una página de servicio, un artículo y la FAQ.

## 17. TESTS EJECUTADOS

| Prueba | Resultado |
|---|---|
| `npm run qa:seo` | 86 páginas, 0 fallos, 0 avisos |
| `npm run check:seo` | 0 pendientes; una segunda ejecución no cambia nada |
| `npm run check:enlaces` | correcto |
| `npm run check:textos` | 597 textos, 0 problemas |
| `npm run check:superficie` | nada interno llega al despliegue |
| `npm run check:consentimiento` | correcto |
| `npm run check:demo`, `check:og`, `check:webs`, `check:capturas`, `check:que-hacemos` | correctos |
| `npm run seo:audit` | 0 fallos, 6 avisos |
| Navegador a 1440 y 390 px, 10 páginas | 0 errores de consola, sin desbordes; ningún h1 pasa de 4 líneas |
| Preview de Vercel | robots.txt, artículo nuevo y cabecera de caché comprobados |

El proyecto no tiene `npm test`, ni compilación, ni typecheck, ni lint: es HTML estático sin paso de build.

## 18. PROBLEMAS ENCONTRADOS

| Prioridad | Problema | Estado |
|---|---|---|
| P1 | Sitemap sin `<lastmod>` | Arreglado |
| P1 | H1 que no decían de qué iba la página | Arreglado |
| P1 | 14 páginas sin datos estructurados; artículos sin `dateModified` | Arreglado |
| P2 | Ninguna página para «automatización para pymes» | Artículo nuevo |
| P2 | Servicios con unas 250 palabras | Bloque nuevo, unas 390 |
| P2 | Blog y diagnóstico casi sin enlaces internos | Arreglado |
| P2 | 9 descripciones cortadas, 5 títulos largos | Arreglado |
| P2 | CSS, JS y fuentes sin caché | Arreglado |
| P3 | Nombre de fichero `.md` visible en el blog en inglés | Arreglado |
| P3 | Logo de la organización por debajo del mínimo de Google | Arreglado |
| P3 | JSON-LD de las áreas apuntando a una URL que redirige | Arreglado |
| P3 | 8 pruebas del repositorio fallan desde antes (`check:chat`, `kb`, `precios`, `fichas`, `en-curso`, `estado`, `portada`, `tema`) | Sin tocar: fallan igual en `40237a1`, comprueban la web anterior |

## 19. PROBLEMAS QUE NO PUEDO SOLUCIONAR DESDE EL CÓDIGO

- **Autoridad del dominio.** Un dominio nuevo con pocos enlaces externos tarda en posicionar búsquedas genéricas como «automatización de empresas», por bien que esté la web.
- **Perfil de empresa en Google.** Para búsquedas locales en Madrid hace falta la ficha de Google Business Profile.
- **Sin dirección ni teléfono públicos** no hay LocalBusiness.
- **LinkedIn de empresa.** El pie enlaza al perfil personal de Diego; no hay página de empresa que declarar.
- **Core Web Vitals reales** y **estado de indexación**: solo en Search Console.
- **Chatbot:** su base de conocimiento no incluye el artículo nuevo. Regenerarla cambia el chatbot y lo he dejado fuera.

## 20. ACCIONES QUE TENGO QUE HACER YO

1. Revisar el Preview, sobre todo los h1 nuevos y el artículo de pymes.
2. Aprobar el merge a `main` y el despliegue a producción.
3. Después de desplegar: enviar el sitemap en Search Console y pedir indexación de las 8 URLs de la sección 16.
4. Ejecutar `npm run seo:online` desde tu equipo para comprobar los códigos de estado en producción.
5. Crear o reclamar la ficha de Google Business Profile.
6. Decidir si la web nombra n8n. Si sí, preparo el artículo.
7. Decidir si se regenera la base de conocimiento del chatbot con el artículo nuevo.

## 21. PRÓXIMOS PASOS

1. Un artículo al mes que responda a una búsqueda concreta: digitalización de empresas, CRM automatizado, automatización administrativa.
2. Convertir los casos internos en casos con cifras medidas, cuando las haya.
3. Imágenes sociales por servicio y por artículo.
4. Página de LinkedIn de empresa y enlazarla en el pie y en los datos estructurados.
5. A las 4 semanas del despliegue, revisar en Search Console qué consultas dan impresiones y ajustar títulos con esos datos.
6. Aplicar esto en la rama del 3D (`web/dcp-cowork4`) con `npm run seo`: el script es idempotente y está pensado para eso.
