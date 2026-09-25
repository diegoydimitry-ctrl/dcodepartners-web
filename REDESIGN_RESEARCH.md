# REDESIGN_RESEARCH

Investigación previa al rediseño de dcodepartners.com.
Fecha: 26 de septiembre de 2026 · Rama: `diseno/dcode-design-system`

**Cómo leer este documento.** Lo que está medido lleva su número y dice cómo se
midió. Lo que es opinión de diseño va marcado como **[JUICIO]**. Lo que no se ha
podido comprobar va como **[NO MEDIDO]** o **[HIPÓTESIS]**. No hay ni una cifra
comercial, ni un cliente, ni un resultado que no esté ya en el proyecto.

---

## A. Análisis de la web actual

### A.1 Lo que hay, contado

| | |
|---|---|
| Páginas publicadas | **74** (35 en español, 35 en inglés, más 404 y utilidades) |
| CSS propio | **966 KB** sin comprimir, en 16 hojas |
| JavaScript propio | **1.501 KB** sin comprimir, en 22 ficheros |
| HTML | **1.325 KB** |
| Dependencias de ejecución | **una** (`resend`, solo en la función de correo del servidor) |
| Dependencias de desarrollo | 3 (`playwright`, `node-html-parser`, `ignore`) |
| Pruebas automáticas | **38** (16 `check:*`, 8 `qa:*`, 2 `perf:*`, 12 `build:*`) |
| Frameworks de front | **ninguno**. HTML, CSS y JavaScript a mano |

Medido con `find`, `wc -c` y `package.json` sobre el repositorio a día de hoy.

**Esto no es una plantilla.** Es un sistema escrito a mano, sin React, sin Tailwind,
sin librería de componentes, con 38 comprobaciones automáticas que se ejecutan
antes de cada publicación. El punto 24 del encargo dice «no quiero una web que
parezca hecha por IA»: conviene saber que el punto de partida ya no lo es, y que
lo que hay que proteger al rediseñar no es el aspecto, es esa maquinaria.

### A.2 Arquitectura actual

```
/                        portada
/metodo                  cómo se trabaja
/que-hacemos             índice de lo que se construye
/servicios/…             5 páginas: agentes-de-ia, automatizaciones,
                         integraciones, paginas-web, sistemas-a-medida
/departamentos/…         8 páginas: administracion, clientes, comercial,
                         direccion, finanzas, marketing, produccion, soporte
/sistema-financiero      D-Code Finance, el producto propio
/precios                 catálogo con 18 productos en 8 categorías
/casos-exito             cómo se aplican los sistemas dentro de casa
/contacto                configurador de 6 pasos + formulario
/cambios-en-proceso      qué se está construyendo ahora
/blog                    4 artículos
/conocenos /faq /garantias /seguridad + 5 páginas legales
                         todo duplicado en /en/
```

### A.3 La portada, sección a sección (medido en un PC de 1440 px)

| Sección | Alto | Qué es |
|---|---|---|
| `inicio` | 743 px | Titular + el panel de Finance en perspectiva |
| `que-hacemos` | 1.728 px | Escena de arquitectura animada |
| `diagnostico` | 1.092 px | Cuestionario de 4 pasos que estima horas y coste |
| `sistemas` | 2.954 px | Galería con 4 demos funcionando |
| `dcode-os` | 3.630 px | Recorrido de la capa operativa |
| `proceso` + 4 pasos | 1.986 px | Cómo se trabaja |
| `confianza` | 852 px | Garantías |
| `que-puedes-tener` | 763 px | Qué se puede construir |
| `contacto` | 418 px | Cierre |

**14.346 px en total, 17 pantallas.**

### A.4 Animación e interacción que ya existe

| | |
|---|---|
| `@keyframes` distintos | 124 |
| Reglas `animation:` | 189 |
| `transition:` | 295 |
| `IntersectionObserver` | 50 usos |
| `requestAnimationFrame` | 43 usos |
| `<canvas>` | 12 |
| `backdrop-filter` | 42 |
| Bloques `prefers-reduced-motion` | 75 |
| **WebGL / Three.js** | **0** |

### A.5 Las demos: lo que de verdad distingue a esta web

Cuatro aplicaciones funcionando con datos ficticios, no capturas:

| | Registros | Pantallas |
|---|---|---|
| D-Code Finance | 350 | ~25 |
| Comercial | 60 | 4 |
| Operaciones | 55 | 4 |
| Atención al cliente | 25 | 4 |

Ninguna de las referencias que se analizan más abajo —Linear, Stripe, Vercel,
Raycast, Lovable, GetLayers— deja tocar su producto sin registrarse. Aquí se toca
desde la portada. **[JUICIO]** Esto es el mayor activo de la web y el rediseño
tiene que construirse alrededor, no encima.

### A.6 SEO y accesibilidad

Medido sobre cinco páginas representativas: un solo `<h1>` por página, `<title>`
de 25–52 caracteres, `<meta description>` de 123–152, HTML semántico, el texto
importante servido en el HTML y no montado por JavaScript. `JSON-LD` presente en
portada y contacto, **ausente** en `/que-hacemos`, `/precios` y las cinco páginas
de `/servicios/`. Hay `sitemap.xml`, `robots.txt`, Open Graph verificado por
`check:og` y una batería axe-core WCAG 2.2 AA.

### A.7 Rendimiento

Medido con `perf/aparatos.mjs`, CPU frenada ×4:

| | Primer pintado | Bloqueo | Peso |
|---|---|---|---|
| iPhone 12 · portada | 408 ms | 51 ms | 1.087 KB |
| iPad (gen 7) · portada | 508 ms | 103 ms | 1.087 KB |
| Galaxy S9+ · portada | 492 ms | 36 ms | 1.087 KB |

Sin tirones al hacer scroll: el hilo principal está libre mientras se baja. El CSS
comprime de 716 KB a **183 KB** por red (medido en el Preview desplegado).

---

## B. Problemas detectados

**B.1 · Hay demasiada web.** 74 páginas, 18 productos en el catálogo, 5 servicios
más 8 departamentos que se solapan. Quien entra sin conocer D-Code tiene que
elegir demasiadas veces antes de entender qué se le ofrece. **[JUICIO]**

**B.2 · Los servicios y los departamentos cuentan lo mismo dos veces.**
`/servicios/automatizaciones` y `/departamentos/produccion` describen el mismo
trabajo desde dos ángulos. Trece páginas para lo que probablemente son cinco.

**B.3 · Las páginas largas siguen siendo largas.** `/precios` mide 15.170 px en un
móvil de 320 px y `/sistema-financiero` 15.321. Ya hay una guarda que impide que
crezcan, pero el problema de fondo —18 fichas de precio seguidas— no está resuelto.

**B.4 · No hay casos con resultados.** `casos-exito.html` cuenta cómo D-Code aplica
sus propios sistemas dentro de casa. La única cifra que aparece en toda la página
es «9h». **No se pueden inventar métricas**: el punto 14 del encargo lo prohíbe y
es lo correcto. Cualquier sección de casos tiene que construirse con lo que hay.

**B.5 · Sin jerarquía tipográfica de marca.** Tres familias —Space Grotesk, Inter,
JetBrains Mono— y 82 variables de tema, pero no hay una escala tipográfica
declarada: los tamaños se deciden sección a sección con `clamp()` sueltos.
**[JUICIO]** Es la diferencia más visible entre esta web y Linear o Stripe.

**B.6 · Demasiados sistemas de animación conviviendo.** 124 `@keyframes` es mucho
para una web de servicios. **[NO MEDIDO]** cuántos están vivos hoy: haría falta un
barrido de CSS muerto.

**B.7 · El titular de la portada no plantea un problema.** El punto 8 del encargo
pide `PROBLEMA → SISTEMA → RESULTADO`. La portada actual abre por el sistema.

**B.8 · Falta `JSON-LD` en siete páginas comerciales**, incluida `/precios`, que es
donde más valdría (`Product`/`Offer`).

---

## C. Oportunidades

1. **La demo como héroe.** Ninguna referencia analizada deja probar su producto sin
   cuenta. D-Code sí. Esa es la ventaja y debe estar en el primer scroll.
2. **El diagnóstico como puerta de entrada.** Ya existe, ya calcula horas y coste, y
   desde ayer acepta el coste por hora que ponga el visitante. Es un mecanismo de
   captación real, no un formulario.
3. **Hablar del problema, no del servicio.** El encargo lo pide y el contenido ya
   existe: los ocho departamentos describen problemas cotidianos.
4. **Menos páginas, mejor contadas.** Fusionar servicios y departamentos.
5. **Una escala tipográfica y un ritmo de espacio declarados**, que es lo que
   convierte «páginas hechas» en «sistema de diseño».
6. **Precios navegables**, no una lista de 18.

---

## D. Análisis de GetLayers

Consultado el 26/09/2026 en `getlayers.ai`.

**Qué es.** Una biblioteca de *prompts* para que una IA genere webs que no parezcan
hechas por IA. Titular: «Cinematic AI sites, made easy». Subtítulo: «Copy a prompt,
paste it into your AI, and launch a site that doesn't look AI-made.»

**Su estructura.** Trece secciones, y las cinco primeras son galerías: plantillas,
escenas 3D, gradientes interactivos, secciones interactivas, fondos animados. Ocho
piezas cada una. Luego explica el concepto de capas, muestra el configurador, la
integración MCP, un resumen con CTA y un FAQ de seis preguntas.

**Qué hace bien.**

- **El producto ES la demostración.** No enseña capturas de escenas 3D: las ejecuta
  en la página. La web es el catálogo funcionando.
- **Texto mínimo.** Títulos de 3 a 8 palabras, pies de 1 a 3. Ninguna frase de relleno.
- **Un CTA por bloque, siempre el mismo verbo** («All 3D Scenes →», «All Gradients →»).
  Catorce CTAs y ni uno ambiguo.
- **Honestidad sobre el peso**: «Pointer-interactive gradients in pure WebGL, about
  a kilobyte». Presume del coste, no solo del efecto.

**Qué hay que entender antes de copiar nada.** GetLayers **vende piezas visuales**.
Su estructura de galería tras galería es correcta *para un catálogo de assets*. La
web de D-Code no vende assets: vende que alguien entienda tu negocio y construya un
sistema. **[JUICIO] Copiar la estructura de GetLayers a D-Code sería el error más
caro de este proyecto**: produciría una web preciosa que no explica a qué se dedica
la empresa.

**El concepto «LAYERS» traducido a D-Code.** GetLayers apila capas *visuales* (hero,
escena 3D, fondo, gradiente, sección). D-Code apila capas *de negocio*:

```
        PERSONAS          quién hace el trabajo hoy
        PROCESOS          en qué orden, y qué se repite
        DATOS             dónde vive la información
        HERRAMIENTAS      WhatsApp, Excel, correo, el programa de facturas
        IA                qué puede leer, clasificar y contestar
        AUTOMATIZACIONES  qué deja de hacerse a mano
```

La traducción honesta no es «hagamos escenas 3D». Es: **la misma idea de capas que
se encienden una sobre otra, pero cada capa es una parte real del negocio del
visitante, y encenderlas todas es exactamente lo que vende D-Code.** El punto 9 del
encargo ya apunta ahí.

---

## E. Análisis de las demás referencias

### Linear · `linear.app`
Titular: «The product development system for teams and agents». Nueve secciones.
**Lo que enseña: producto, producto y producto** — interfaz real de Linear con
incidencias, backlogs y diagramas de Gantt, más diffs de código. El texto es de 20
a 30 palabras por sección. **La lección**: la jerarquía la construyen el tamaño y
el contraste, no la decoración, y la captura de producto ocupa más superficie que
el texto.

### Stripe · `stripe.com`
Titular: «Financial infrastructure to grow your revenue». **La lección clave para
D-Code**: cómo explican algo técnico a alguien que no lo es. Abren por el resultado
de negocio, agrupan por caso de uso («Accept and optimize payments globally») y no
por nombre técnico de API, y dan cifras concretas. Además: un enlace explícito
«Don't code?» que reconoce que no todo el mundo programa. Hero de ~35 palabras.

### Vercel · `vercel.com`
Titular: «Agentic Infrastructure». Cada sección empareja **un cliente real con 3–4
funciones concretas** (Notion, Zapier, Mintlify). **La lección**: la prueba social y
la función técnica van juntas en el mismo bloque, no en secciones separadas.
**[JUICIO]** D-Code no puede hacer esto todavía: no hay clientes publicables.

### Raycast · `raycast.com`
Titular: «Your shortcut to everything». Subtítulo de 14 palabras. La segunda sección
se llama **«It's not about saving time»** — y ahí está la lección: se niegan a
vender el tópico obvio de su categoría. **[JUICIO]** D-Code tiene el mismo tópico
delante («te ahorramos tiempo») y la misma oportunidad de negarlo.

### Lovable · `lovable.dev`
Titular: «Build something Lovable». **La lección**: cuatro casos con métricas y dos
cifras de escala. Es la estructura que D-Code **no puede** copiar sin inventar datos.

### Sobre «parecer hecho por IA»
Investigado en la literatura de diseño de 2026. Las señales concretas y verificables:

| Señal | ¿Está en la web actual? |
|---|---|
| Inter con fallback de sistema, sin variación | **No** — hay tres familias con intención |
| Gradiente morado-azul decorativo | **No** |
| Mismo `border-radius` (16px) en todo | **A revisar** |
| Mismo padding y misma altura en todas las tarjetas | **A revisar** |
| Fotos de stock, blobs 3D abstractos | **No** — hay producto real |
| Hover que no hace nada, fade-in idéntico en todo | **A revisar** — 189 reglas de animación |
| Titulares vagos («Transforma tu negocio») | **No** |

**[JUICIO]** Tres de siete señales están limpias por diseño. Las otras cuatro son
precisamente el trabajo del sistema visual (sección L).

---

## F. Elementos que deberíamos adoptar

1. **De GetLayers** · Que la demostración sea el producto ejecutándose, no una
   captura. *Ya se hace; hay que subirlo al primer scroll.*
2. **De GetLayers** · Un CTA por bloque, con verbo idéntico y repetido.
3. **De GetLayers** · Presumir del coste: si algo pesa poco, decirlo.
4. **De Linear** · La captura de producto ocupa más superficie que el texto.
5. **De Linear** · Jerarquía por tamaño y contraste, no por caja ni por borde.
6. **De Stripe** · Agrupar por problema del cliente, nunca por nombre técnico.
7. **De Stripe** · Abrir por el resultado de negocio y bajar al detalle después.
8. **De Raycast** · Negar el tópico de la categoría en la segunda sección.
9. **De Vercel** · Prueba y función en el mismo bloque. *Cuando haya clientes.*
10. **De todas** · Hero de 30–40 palabras. La portada actual tiene bastante más.

## G. Elementos que NO deberíamos adoptar

1. **La estructura de galerías de GetLayers.** Vende assets; D-Code vende criterio.
2. **Las escenas WebGL «porque quedan bien».** El encargo lo dice en el punto 18 y
   hay una razón medida: la web va hoy a 408 ms de primer pintado en un iPhone con
   la CPU frenada ×4. WebGL en la portada se come ese presupuesto entero.
   **Recomendación: no introducir Three.js.** Ver sección P.
3. **Las métricas de Lovable y Vercel.** No hay clientes ni resultados publicables.
   Inventarlos está prohibido y sería lo único capaz de hundir la credibilidad.
4. **El hero de una sola palabra de Vercel** («Agentic Infrastructure»). Funciona
   porque todo el mundo sabe qué es Vercel. Nadie sabe qué es D-Code todavía.
5. **La densidad de navegación de Stripe.** 25 productos en un desplegable exige una
   marca conocida.
6. **El modo oscuro por defecto sin alternativa.** La web ya tiene los dos temas y
   eso vale más que parecerse a Linear.

---

## H. Nueva dirección artística propuesta **[JUICIO]**

**El concepto: CAPAS QUE SE ENCIENDEN.**

No capas visuales apiladas por decoración, sino las seis capas del negocio del
visitante. El recurso visual central de la web es **una capa apagada que se
enciende**: se ve el trabajo manual, y encima se enciende el sistema que lo hace.

De ahí salen tres reglas:

1. **Antes y después en el mismo sitio.** No dos columnas comparando: el mismo
   bloque, que cambia. Es lo que ya hace el patrón «01 HOY / 02 CON EL SISTEMA» de
   la portada actual, y es lo mejor que tiene la web.
2. **La luz cuenta la historia.** Lo manual, apagado y sin color. Lo que hace el
   sistema, encendido en azul D-Code. Nada más decide el color.
3. **La profundidad viene del producto.** El panel de Finance en perspectiva ya da
   profundidad real, con una captura a 2.800 px. No hacen falta blobs.

**Paleta.** Negro, blanco, azul D-Code y neutros, como pide el punto 7. Un solo
acento. Gradiente permitido **únicamente** como luz que emite una capa encendida:
nunca de fondo, nunca en un botón, nunca morado-azul.

**Tipografía.** Las tres familias se quedan —son de marca, no de plantilla— pero
con una escala declarada en lugar de `clamp()` sueltos. Ver sección L.

---

## I. Nueva arquitectura de información **[JUICIO]**

El recorrido que pide el punto 10, con lo que ya existe:

```
PROBLEMA      «Copiar. Pegar. Buscar. Repetir.»   ← contenido nuevo
   ↓
FRICCIÓN      el diagnóstico: cuánto cuesta        ← YA EXISTE
   ↓
DESCUBRIMIENTO las capas que se encienden          ← evoluciona la escena arq
   ↓
SISTEMA       las cuatro demos, tocándose          ← YA EXISTE
   ↓
RESULTADO     qué cambia el lunes por la mañana    ← contenido nuevo
   ↓
CASOS         cómo lo usamos dentro de casa        ← YA EXISTE, sin inventar
   ↓
CONFIANZA     garantías, precios, en curso         ← YA EXISTE
   ↓
ACCIÓN        «cuéntanos qué te hace perder tiempo» ← reescribir el cierre
```

Cinco de ocho pasos ya existen. **[JUICIO] Esto no es un rediseño desde cero: es
reordenar y reescribir lo que hay, y construir dos piezas nuevas.**

## J. Nueva estructura de páginas **[JUICIO]**

```
/                     la narrativa completa
/servicios/…          5 páginas   (se quedan)
/departamentos/…      8 páginas → se absorben en las 5 de servicios,
                                   con redirección 301 desde cada una
/sistema-financiero   el producto propio (se queda)
/precios              catálogo navegable por problema, no lista de 18
/casos-exito          cómo lo usamos dentro (se queda, sin inventar nada)
/contacto             diagnóstico + formulario (se queda)
/metodo /faq /garantias /seguridad /conocenos /cambios-en-proceso /blog
```

De 74 páginas a **58**. Ninguna información se pierde: se fusiona.
**Requisito duro:** cada URL retirada necesita su 301 y `check:enlaces` tiene que
seguir en verde. Sin eso, el SEO acumulado se tira a la basura.

## K. Sistema de animaciones **[JUICIO]**

La regla del punto 17 —ninguna animación sin propósito— convertida en algo
comprobable. Cuatro categorías, y todo lo que no entre en una se borra:

| Categoría | Para qué | Duración |
|---|---|---|
| **Estado** | algo ha cambiado por lo que has hecho | 120–200 ms |
| **Entrada** | un bloque llega a la vista, una vez | 300–420 ms |
| **Narrativa** | la capa que se enciende; cuenta algo | 500–900 ms |
| **Continua** | el cielo, el panel que flota | sin límite, casi gratis |

Reglas, todas verificables por prueba automática:

1. Nada se anima sin `prefers-reduced-motion` (hoy: **75 bloques**, mantener).
2. Nada continuo en el teléfono (hoy ya se apaga el cielo en táctil).
3. Solo `transform` y `opacity`. Animar `width`, `top` o `box-shadow` = fallo.
4. Ninguna animación de entrada se repite al volver a pasar.
5. Presupuesto: como mucho **3 animaciones continuas** a la vez por pantalla.
   Hoy la portada tiene 6 en un iPhone. `perf/aparatos.mjs` ya lo cuenta.

## L. Sistema visual **[JUICIO]**

Lo que falta para que esto sea un sistema y no un conjunto de páginas:

**Escala tipográfica declarada** (razón 1,25, base 16 px):

```
--t-display  clamp(2.75rem, 2rem + 3.6vw, 5.25rem)   Space Grotesk 700
--t-h1       clamp(2.25rem, 1.8rem + 2.2vw, 3.5rem)  Space Grotesk 700
--t-h2       clamp(1.75rem, 1.5rem + 1.3vw, 2.5rem)  Space Grotesk 600
--t-h3       1.375rem                                 Space Grotesk 600
--t-body     1.0625rem / 1.6                          Inter 400
--t-small    0.9375rem / 1.5                          Inter 400
--t-mono     0.8125rem                                JetBrains Mono 400
```

**Ritmo de espacio** de un solo origen (4 px): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
Ningún margen fuera de esa lista.

**Radios con jerarquía**, contra la señal de «todo a 16 px»: 6 px controles,
10 px tarjetas, 16 px ventanas, 999 px píldoras.

**Elevación por luz, no por sombra**: la superficie que está «encendida» se
distingue por color y borde, no por `box-shadow` genérica.

## M. Estrategia responsive **[JUICIO]**

Ya está resuelto el corte y conviene no tocarlo: **767 px**, porque el iPad en
vertical mide 768 y ahí las demos se usan y se ven bien.

| | Teléfono ≤767 | Tableta 768–1100 | PC ≥1101 |
|---|---|---|---|
| Demos | no se montan | completas | completas |
| Panel de Finance | no se descarga | no se descarga | 2.800 px |
| Escenas narrativas | texto en su lugar | completas | completas |
| Cielo animado | quieto | quieto | completo |

El móvil tiene experiencia propia, como pide el punto 19: la portada mide 9.029 px
frente a 14.346 en PC, porque en el teléfono se lee en vez de tocarse.

## N. Estrategia de conversión **[JUICIO]**

Tres puertas, por orden de compromiso:

1. **Tocar una demo** — cero compromiso, y es lo que nadie más deja hacer.
2. **Hacer el diagnóstico** — 4 pasos, sale una cifra suya, con su coste por hora.
3. **Contar qué te hace perder tiempo** — el configurador de 6 pasos.

Regla: **un solo CTA primario por pantalla**. Hoy la portada ofrece «Prueba los
sistemas» y «Haz el diagnóstico» juntos en el hero, que es pedir dos cosas a la vez.

## O. Estrategia SEO

**Lo que no se puede romper** (hoy en verde y con prueba automática): `<h1>` único,
HTML semántico, texto en el HTML y no en JavaScript, `sitemap.xml`, `robots.txt`,
Open Graph verificado, hreflang ES/EN, axe-core WCAG 2.2 AA.

**Lo que hay que añadir:**

1. `JSON-LD` en las siete páginas que no lo tienen; `Product` + `Offer` en `/precios`.
2. `BreadcrumbList` en servicios y departamentos.
3. **301 desde cada URL de `/departamentos/` que se fusione.** Innegociable.
4. `FAQPage` en `/faq`.
5. Mantener `check:enlaces` en verde en cada paso, no al final.

## P. Recomendaciones técnicas de rendimiento

**P.1 · No introducir WebGL ni Three.js.** Razonado, no por gusto: Three.js pesa
~150 KB comprimido, frente a los 183 KB que hoy suma **todo** el CSS por red. La web
va a 408 ms de primer pintado en un iPhone con la CPU frenada ×4. **[JUICIO]** El
concepto de «capas que se encienden» se resuelve con CSS y con los 12 `<canvas>` 2D
que ya existen, que cuestan una fracción.

**P.2 · Barrer el CSS muerto.** 966 KB sin comprimir en 16 hojas. **[NO MEDIDO]**
cuánto se usa realmente: hace falta un barrido de cobertura por página.

**P.3 · Mantener el stack.** El punto 23 pide no cambiar por cambiar. Vanilla, cero
dependencias de ejecución, 38 pruebas y un despliegue estático que va a 408 ms. Un
framework añadiría peso y tiraría las 38 pruebas. **No hay razón técnica para cambiar.**

**P.4 · Conservar lo ya ganado**: capturas del panel solo en PC, un solo tema
descargado, `tema-claro.css` con `media="not all"` en oscuro, cielo del otro tema
sin precargar en táctil.

**P.5 · Presupuestos como prueba, no como intención.** `perf/aparatos.mjs` y
`perf/peso-aparatos.mjs` ya existen. Añadir: tope de animaciones continuas por
pantalla y tope de peso de CSS por página.

---

## Nota final sobre el alcance **[JUICIO]**

El encargo pide un «rediseño completo». Sobre lo medido, la recomendación honesta
es esta: **el problema de esta web no es cómo se ve. Es que hay demasiada, que abre
por el sistema en vez de por el problema, y que no tiene una escala declarada.**

Lo que sí hay que rehacer: el hero, el orden de la narrativa, la escala tipográfica
y el ritmo de espacio, la fusión de 13 páginas en 5, y el catálogo de precios.

Lo que **no** hay que tirar: las cuatro demos funcionando, las 38 pruebas, los dos
temas, el diagnóstico, el configurador, el rendimiento medido y el trabajo de
accesibilidad.

Un rediseño que destruya eso para parecerse a GetLayers sería más bonito en una
captura y peor en todo lo demás. El plan de las secciones H a P evoluciona la web
—que es lo que pide el punto 1 del encargo— en lugar de sustituirla.
