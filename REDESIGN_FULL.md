# REDESIGN_FULL: la remodelación completa de dcodepartners.com

Rama `claude/dcode-full-redesign`, que parte de `e99d61f`: el commit que
sirve hoy producción, según los deploys de Vercel. Esta rama no toca
producción.

## 1. Dirección (revisión 2)

La primera preview tenía un solo objeto 3D (el «Núcleo») repetido en todas
las secciones, que no se leía como D-Code y que tardaba en cargar. Esta
revisión lo sustituye por:

- **Modo oscuro por defecto**, un estudio de noche; el claro (hueso cálido) es
  la alternativa. El selector es un botón redondo pequeño en la navegación y
  el cambio de tema relanza la luz y los materiales de las escenas vivas.
- **Una biblioteca de escenas**, una por idea. Cada sección enseña la parte
  del sistema de la que habla. Ninguna escena se repite con el mismo plano.
- **Un solo motor 3D** compartido por toda la web, perezoso y medido.
- **Todo el contenido en HTML**: las escenas son ilustración. Titulares,
  textos, precios, demos, D-Code OS, diagnóstico, chatbot, formularios, SEO
  y ES/EN son los de producción.

## 2. La biblioteca de escenas

Cada escena es un módulo `assets/js/escenas/e-*.js` de 1–3 KB con gzip. El
motor solo lo descarga cuando su sección se acerca a la pantalla.

| Escena | Dónde | Qué cuenta |
|---|---|---|
| `sistema` | Héroe de portada | El propio logotipo de D-Code, fabricado. Los píxeles son las herramientas de la empresa (hoja, correo, chat, facturas, agenda y carpetas), cada una de un material. Llegan sueltas y encajan; el píxel azul es la IA y por la «D» de aluminio circula el dato. Es el titular «no te faltan herramientas, te falta que hablen entre ellas». |
| `sistema` · firma | Conócenos | La marca ya montada: quiénes somos. |
| `datos` | Portada · El problema | Treinta fichas, las treinta veces al día que alguien copia, pega, busca o revisa (las cifras de la lista de la sección). Sueltas y en ámbar; al bajar pasan por el anillo del sistema y salen ordenadas en siete columnas, una por tarea. |
| `integracion` | Portada · Qué hacemos, `/que-hacemos` | Seis herramientas reales (hoja, correo, chat, facturas, agenda y carpetas), cada una con su luz de estado en ámbar. Al bajar se tiende un cable de cada una a D-Code OS en el centro, la luz pasa a azul y el dato va y viene. |
| `integracion` · puente | `/servicios/integraciones` | Dos grupos de herramientas enfrentados, unidos a través del centro. |
| `ia` | `/servicios/agentes-de-ia` | Una red de nodos de vidrio, no un cerebro. Entran consultas, la señal atraviesa la red capa a capa y enciende una de tres salidas: responde, clasifica o pasa a una persona. |
| `automatizacion` | `/servicios/automatizaciones` | Una línea de datos con cuatro estaciones: evento, proceso, decisión y acción. Las cápsulas la recorren solas y cada estación se enciende al pasar una. |
| `software` · lab | Portada · Laboratorio | Pantallas **reales** de D-Code (Finance, D-Code OS, Comercial, Operaciones, Atención) en láminas de vidrio con canto de aluminio. Al bajar se separan en capas. |
| `software` · finance, medida | `/sistema-financiero`, `/servicios/sistemas-a-medida` | Las mismas láminas, con el orden y el producto de cada página. |
| `software` · web | `/servicios/paginas-web` | Las webs de producción (inmobiliaria, restaurante, clínica y tienda) en abanico, cableadas al mismo núcleo: la web lee y escribe en el sistema. |
| `departamento` | Portada · Ocho áreas | Ocho objetos sobre su peana, en círculo y cableados a D-Code OS: embudo (Comercial), antena (Marketing), anillo (Clientes), engranaje (Producción), monedas (Finanzas), mensaje (Soporte), archivo (Administración) y esfera (Dirección). |
| `departamento` · <área> | `/departamentos/<área>` (×8) | Su objeto en primer plano, iluminado y enviando su dato al centro, con los demás detrás. |
| `metodo` | Portada · Método, `/metodo` | Seis recorridos (un cliente, un pedido, una factura…) enredados como van hoy. Una lámina de luz los analiza y, detrás de ella, cada uno queda recto: seguir el recorrido real y diseñar el que debería ser. |
| `metodo` · casos | `/casos-exito` | Antes y después, uno junto a otro y separados por vidrio. |
| `precios` | Portada · Precios, `/precios` | Un bastidor y tres módulos que encajan en él al bajar (Finance, un sistema a medida, agentes e integraciones): se empieza por uno y se añade lo que haga falta. Las cifras siguen en HTML y no cambian. |
| `contacto` | Portada · Contacto, `/contacto` | Las ocho áreas, cada una con su color, convergen en un anillo que mira a quien lee: el sistema termina en una persona. |

**Realismo:**
- **Luz:** un estudio procedural prefiltrado con PMREM (softboxes cenital, tiras laterales, rebote y ventana tras la cámara) para el oscuro y para el claro. Da reflejos reales al metal sin descargar un HDRI.
- **Materiales:** `MeshPhysicalMaterial` con aluminio torneado (normal de torneado y anisotropía), acero, grafito, moleteado, cerámica, silicio con iridiscencia, caucho, latón y vidrio. El vidrio usa transmisión real en calidad alta.
- **Sombras:** sombras de contacto horneadas en textura (una por objeto, casi gratis) y la sombra de la luz clave solo en calidad alta.
- **Imagen:** tone mapping Khronos PBR Neutral.
- **Movimiento:** muelles con inercia, sin giros de 360°. El cursor inclina la pieza y el scroll da el avance de cada escena.

## 3. El motor (`assets/js/escenas/motor.js`)

- **Un solo `WebGLRenderer`** sobre un lienzo fijo y transparente para toda la página. Cada escena se dibuja con *scissor* en el rectángulo de su hueco `[data-escena]`: no hay un contexto WebGL por sección.
- **Carga en tres tiempos:**
  1. El HTML y el CSS pintan primero. El LCP es el titular.
  2. `app.js` (1,6 KB) espera a `requestIdleCallback` y entonces importa el motor y Three.js.
  3. Cada escena se importa cuando su hueco está a menos de un 70 % de pantalla. Se compila con `compileAsync` antes de entrar, así no hay tirones al hacer scroll.
- **Descarga:** a más de tres pantallas de distancia, la escena libera su geometría y sus luces.
- **Pausa:** fuera de pantalla, con la pestaña oculta o cuando todo está quieto.
- **Calidad:**

  | Nivel | Cuándo | DPR | Vidrio | Sombra de luz |
  |---|---|---|---|---|
  | alta | Escritorio con 8 GB o más | 1,8 | transmisión | sí |
  | media | Táctil, pantalla estrecha o ≤4 GB | 1,4 | transparencia | no |
  | baja | ≤2 GB o 2 núcleos | 1,0 | transparencia | no |

  Si la mediana del fotograma pasa de 24 ms, el DPR baja solo. `?calidad=` fuerza un nivel.
- **Recursos compartidos:** geometrías y materiales se crean una vez y los pulsos de dato son una sola `InstancedMesh` por escena.
- **Pósteres:** cada hueco lleva de fondo un fotograma real de su escena en WebP, por tema. Pinta al instante, queda como respaldo sin WebGL y el lienzo vivo lo sustituye. Los de las bandas solo se piden al acercarse.
- **Movimiento reducido:** un fotograma fijo por escena, sin animación.
- **Sin WebGL:** se queda el póster.

## 4. Sistema de diseño

Solo se redefinen tokens y revestimientos: el HTML de los componentes de
producción no se ha reescrito, así que sus pruebas siguen siendo válidas.

- **Oscuro:**
  - Fondos `#07080a`, `#0c0d10` y `#111317`.
  - Tinta `#eceef1`, `#a7abb3` y `#7c818b`.
  - Acento `#5b8cff`.
- **Claro:** hueso `#eeebe5`, tinta grafito y acento `#2b57f5`.
- **Tipos:**
  - Instrument Sans (display y texto).
  - Instrument Serif en cursiva como voz editorial.
  - Mono para las etiquetas técnicas.
- **Cabecera:** se oculta al bajar y reaparece al subir. El selector de tema va integrado en la navegación.
- **Superficies de producto** (demos, D-Code OS, diagnóstico) en grafito en los dos temas.

## 5. Qué se conserva de producción

Se conservan:
- Todo el contenido y las rutas.
- Los precios de `/precios`, sin cambiar una cifra.
- Las cuatro demos, D-Code OS, el diagnóstico, el formulario por pasos y el chatbot.
- ES/EN, SEO (títulos, meta, OG, JSON-LD, sitemap y canonical), el consentimiento y la analítica.
- La lista blanca de despliegue (`.vercelignore`).

No se ha inventado ninguna métrica, cliente, resultado, precio ni función.

## 6. Activos externos y licencias

| Activo | Origen | Licencia |
|---|---|---|
| Three.js r180 (build y 2 addons) | npm `three@0.180.0` | MIT (`docs/THREEJS-LICENSE.txt`) |
| Instrument Sans | npm `@fontsource-variable/instrument-sans` | OFL (`docs/FONTS-INSTRUMENT-SANS-OFL.txt`) |
| Instrument Serif | npm `@fontsource/instrument-serif` | OFL (`docs/FONTS-INSTRUMENT-SERIF-OFL.txt`) |
| Texturas de torneado, moleteado, uso y grano | Generadas por procedimiento | Propias |
| Pantallas de las escenas | Capturas de las demos y webs que ya están en producción | Propias |

Se retiran el HDRI, el postprocesado y los loaders que usaba el Núcleo.

## 7. Medido

Ver la sección «Medidas» de `PREVIEW.md`.

## 8. Limitaciones

- El sandbox no tiene GPU (SwiftShader). Las cifras de carga son fiables, pero los FPS y el tiempo al primer fotograma son varias veces peores que en un equipo real y hay que medirlos en hardware físico.
- La maquetación interna de las secciones de producto (demos, D-Code OS, diagnóstico y tablas de precios) es la de producción, revestida con el sistema nuevo.
- Los pósteres son fotogramas a 1× y se regeneran a mano tras tocar una escena (ver `PREVIEW.md`).
