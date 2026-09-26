# REDESIGN_FULL: la remodelación completa de dcodepartners.com

Rama `claude/dcode-full-redesign`, que parte de `e99d61f`: el commit que
sirve hoy producción, según los deploys de Vercel. Esta rama no toca
producción.

## 1. Dirección

**Antes:** web oscura con cielo de estrellas, campo de partículas,
degradados cian-violeta y cajas de vidrio azul marino.

**Ahora:** un laboratorio de ingeniería.
- **Luz de laboratorio** (hueso cálido `#eeebe5`) como base de confianza.
- **Grafito** para las superficies de producto: las demos, D-Code OS y el diagnóstico siguen invertidos, como en producción, pero en grafito neutro en lugar de azul marino.
- **Un solo azul D-Code** (`#2b57f5`) como energía del sistema, nunca decorativo.
- **Materia en vez de brillo:** superficies mates, filetes finos, grano de fotografía. Sin cielos, sin neón y sin degradados de marca.

**Tipografía:**
- **Instrument Sans** (variable, OFL) para display y texto.
- **Instrument Serif** en cursiva como voz editorial: lo que antes era texto en degradado.
- **JetBrains Mono** para la anotación técnica (etiquetas, cotas, «FIG.»).

## 2. La pieza: El Núcleo D-Code

El 3D es **un solo objeto físico** con significado, no cajas ni partículas.
Es un mecanismo torneado cuyas capas son las capas de D-Code OS tal como
las nombra la web de producción. De abajo arriba:

| Pieza | Material | Qué es |
|---|---|---|
| Zócalo | Aluminio anodizado negro, canto moleteado, grabado láser | La base: «D-Code Partners · Sistema operativo empresarial» |
| Datos | Cerámica técnica blanca con surcos de torneado | «El dato entra una vez» |
| Automatizaciones | Titanio hilado (anisotropía) con **8 tomas de latón** | Las 8 áreas de la empresa; cada toma lleva la luz de su color |
| IA | Disco de vidrio (transmisión y dispersión) con un circuito dentro | «Lee, clasifica, responde y propone» |
| Interfaces | Bisel de acero pulido y esfera de vidrio negro con escala | El panel |
| Monitorización | Collar de aluminio y cúpula de vidrio con sensor | «Qué pasó, cuándo, en qué sistema» |
| Mejora continua | Aro que orbita el conjunto | «Cada mes se miran los números» |
| Cables | Funda de caucho y conector de aluminio | Las integraciones |

**Realismo:**
- **Luz:** HDRI fotográfico de estudio (CC0), prefiltrado con PMREM, como luz y reflejo real.
- **Materiales:** `MeshPhysicalMaterial` con anisotropía (metal hilado), clearcoat, sheen (cerámica), transmisión, IOR 1,5, atenuación y dispersión (vidrio).
- **Uso real en la superficie:** mapas de rugosidad con huellas y microarañazos, normales de moleteado y de torneado. Son texturas generadas por procedimiento en esta rama, sin descargas.
- **Geometría:** perfiles torneados con cantos redondeados (`LatheGeometry`), que son lo que atrapa la luz en una pieza mecanizada.
- **Sombra:** penumbra ancha y contacto oscuro (como en fotografía de producto), más la sombra suave de la luz clave.
- **Imagen:** tone mapping Khronos PBR Neutral, bloom solo en lo emisivo y un pase de cine con viñeta y grano.
- **Lienzo transparente:** el objeto se apoya en la propia página, sin costuras de color.

**Movimiento con intención** (portada):

| Capítulo de producción | Plano |
|---|---|
| Hero | La pieza ensamblada, montándose al llegar (las capas caen y se asientan con muelle) |
| El problema | Las capas desalineadas, los cables desenchufados y las tomas en ámbar intermitente: el trabajo a mano |
| Diagnóstico | Anillo de escaneo recorriendo la pila; las áreas que marca el usuario encienden su toma |
| **Anatomía** (nuevo) | Vista explosionada con **cotas HTML** que siguen a cada capa. El texto de cada capa es el de producción. |
| Qué hacemos, demos, D-Code OS, oferta | El estudio se apaga y deja de renderizar: manda el producto real |
| Método 01–04 | Escaneo, anatomía, implantación y medición (las tomas laten) |
| Contacto | La pieza completa, de abajo arriba, bajo el titular |

El cursor da inercia a la pieza, parallax de cámara y luz. En móvil la
composición es otra: la pieza arriba, el titular abajo y las cotas
sustituidas por la lista.

## 3. Fotografía de producto

Cada página interior importante lleva en su héroe **la fotografía de su
parte del sistema**. Son renders del mismo motor en calidad «foto»:
2×, sombras de 2048 y 192 segmentos. Hay una versión clara y otra oscura, a
1600×1000 en WebP.

Planos:
- Cada departamento: macro de **su toma**, iluminada.
- Automatizaciones: medición.
- Agentes: macro de la IA.
- Integraciones: cables.
- Páginas web: la interfaz.
- Sistemas a medida y garantías: anatomía a contraluz.
- Qué hacemos: anatomía.
- Método: escaneo.
- Casos: desalineado.
- Conócenos y departamentos: planta cenital.
- Contacto y FAQ: régimen.

La fotografía no bloquea nada: es un `<img>` con `alt=""` y el
contenido está en HTML. Se regenera con
`scripts/fotos/estudio.html` y `node .foto.mjs` (ver `PREVIEW.md`).

## 4. Rendimiento

- El motor se pide **después de `load`**. El LCP es el titular HTML.
- **Niveles de calidad:**

  | Nivel | Cuándo | DPR | Sombra | Postproceso | Vidrio |
  |---|---|---|---|---|---|
  | alta | Escritorio con 8 GB o más | 1,75 | 2048 | sí | transmisión con dispersión |
  | media | Táctil, pantalla estrecha o ≤4 GB | 1,4 | 1024 | sí | transparencia |
  | baja | ≤2 GB o 2 núcleos | 1 | 512 | no | transparencia |
  | estática | GPU por software | — | — | — | — |

  En estática se pinta solo al cambiar de plano, igual que con movimiento reducido.
- **Degradación en marcha:**
  - Si la mediana del fotograma pasa de 26 ms, se quita el postproceso y se baja el DPR a 1.
  - Si pasa de 45 ms, pasa a estática.
- **Pausas:** fuera de pantalla, con la pestaña oculta y detrás de las secciones de producto.
- **Respaldo sin WebGL:** fotografía del Núcleo como fondo del estudio.
- **Pesos:**
  - HDRI: 111 KB.
  - Texturas de uso, moleteado y torneado: 58 KB.
  - Fuentes nuevas: 100 KB.
  - Three.js + addons: ≈ 190 KB con gzip.

## 5. Qué se conserva de producción

Todo el contenido, las rutas, los precios de `/precios` (sin cambiar una
cifra) y las cuatro demos (Finance, Comercial, Operaciones, Atención). Se
conservan también:
- D-Code OS con sus vistas, el diagnóstico, el formulario de contacto por pasos y el chatbot con su saludo por sección.
- El tema claro/oscuro, ES/EN, SEO (títulos, meta, OG, JSON-LD, sitemap, canonical), el consentimiento y la analítica.
- La lista blanca de despliegue.

El HTML de los componentes de producción no se ha reescrito: el sistema
nuevo redefine sus tokens y los reviste. Así, las pruebas de producción
(`check:*`) siguen siendo válidas y pasan.

## 6. Activos externos y licencias

| Activo | Origen | Licencia |
|---|---|---|
| Three.js r180 (build y addons) | npm `three@0.180.0` | MIT (`docs/THREEJS-LICENSE.txt`) |
| HDRI `studio.exr` | npm `@pmndrs/assets@1.7.0` (Poly Haven) | CC0 (`docs/HDRI-PMNDRS-ASSETS-CC0.txt`) |
| Instrument Sans | npm `@fontsource-variable/instrument-sans` | OFL (`docs/FONTS-INSTRUMENT-SANS-OFL.txt`) |
| Instrument Serif | npm `@fontsource/instrument-serif` | OFL (`docs/FONTS-INSTRUMENT-SERIF-OFL.txt`) |
| Texturas de uso, moleteado, torneado y grano | Generadas por procedimiento en esta rama | Propias |

## 7. Limitaciones conocidas

- El sandbox no tiene GPU: los FPS y el INP reales hay que medirlos en un equipo físico. Las cifras de carga sí son reales (ver `PREVIEW.md`).
- La estructura interna de las secciones de producto (demos, D-Code OS, diagnóstico, precios) es la de producción, revestida con el sistema nuevo. No se ha rediseñado su maquetación interna: cambiarla exige reescribir su JS y sus pruebas.

## 8. Medido (Chromium headless, sin GPU: carga fiable, FPS no)

| | 1440×900 | 390×844 |
|---|---|---|
| FCP | 540 ms | 384 ms |
| LCP | 540 ms (titular HTML) | 480 ms |
| CLS | 0,002 | 0,016 |
| Evento `load` | 663 ms | 395 ms |
| Peticiones | 62 | 58 |
| Escena | 118 llamadas de dibujo · 106 k triángulos | 117 · 105 k |

La producción actual (`e99d61f`), con el mismo banco, daba un FCP/LCP de 2,0–2,6 s en escritorio y de 0,8 s en móvil.

**QA:**
- **Barrido:** 164 combinaciones (74 páginas a 1440 y 390 px, más las dos portadas a 375, 390, 430, 768, 1024, 1440 y 1920). 0 errores JS y 0 desbordes. Los únicos avisos son las URLs limpias de las demos de Finance, que el servidor local no resuelve y Vercel sí, y la herramienta interna de estudio, que no se despliega.
- **Movimiento reducido:** un fotograma fijo por plano.
- **Sin WebGL:** fotografía de la pieza.
- **Pruebas de producción en verde:** `check:tema`, `check:portada`, `check:enlaces`, `check:superficie`, `check:consentimiento`, `check:chat`, `check:estado` y `check-instruments`.
