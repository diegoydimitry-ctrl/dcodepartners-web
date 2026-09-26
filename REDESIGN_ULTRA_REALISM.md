# REDESIGN_ULTRA_REALISM — La Planta

Rama `claude/dcode-ultra-realism`, desde `e99d61f`, el commit que sirve hoy
dcodepartners.com.

---

## 0. Punto de partida: qué es Production de verdad

La reconstrucción anterior (`0ecc76a`) se hizo sobre `main` (`9994abe`). Pero
**producción no sirve `main`**. Según Vercel, el último deploy de producción es
la rama `diseno/dcode-design-system` en `e99d61f`, que va **273 ficheros y
~47.800 líneas por delante** de `main`. Por eso `0ecc76a` trabajó con datos
antiguos. Esta rama parte de `e99d61f` y lo trata como fuente de verdad.

**Inventario de Production (e99d61f) frente a la base de 0ecc76a**

| | Base de 0ecc76a (`main`) | Production (`e99d61f`) |
|---|---|---|
| Portada | «Analizamos tu empresa. Construimos su sistema.» | «No te faltan herramientas. Te falta que hablen entre ellas.» |
| Precios | ninguno publicado | `/precios`: Finance **desde 29 €/mes + 390 €** de puesta en marcha · sistema a medida **desde 1.500 €** · agentes e integraciones **desde 750 €** |
| Demos | Finance | Finance + Comercial + Operaciones + Atención al cliente, más el panel D-Code OS |
| Servicios | 3 (`automatizacion-ia`, `agentes-ia`, `integraciones`) | 5 (`automatizaciones`, `agentes-de-ia`, `integraciones`, `paginas-web`, `sistemas-a-medida`) más `/que-hacemos` |
| Diagnóstico | no existía | tres toques: áreas → horas → coste por hora |
| Tema | solo oscuro | oscuro/claro con transición y cielo |
| Pruebas | 3 scripts | más de 30 (`check:*`, `qa:*`) |

**Qué no se ha tocado:** el contenido, los precios, las demos, el
diagnóstico, D-Code OS, el formulario, el chatbot, los idiomas, el SEO, la
analítica y el consentimiento siguen siendo los de producción. Ninguna cifra
nueva.

## 1. Concepto: La Planta

El brief pedía realismo **con significado**. La respuesta es una maqueta
física del sistema de una empresa, como la maqueta de un arquitecto. Cada
objeto es algo que D-Code construye de verdad:

| Objeto | Qué es en D-Code |
|---|---|
| Losa de grafito con retícula grabada | La empresa: el suelo común |
| 8 módulos de aluminio mecanizado | Los 8 departamentos del sitio. Cada uno lleva su color `--k-*` en una franja de estado y **su interfaz en la pantalla de arriba**; Finanzas, Comercial, Producción, Soporte y Dirección muestran las **capturas reales** de las demos y de D-Code OS |
| Núcleo de vidrio sobre zócalo cerámico | D-Code OS, la capa que conecta. Dentro, la IA: una red de aristas alrededor de una luz que late |
| Conductos con pulsos de luz | Las integraciones: el dato viaja por ellos |
| Fichas ámbar que saltan entre módulos | El trabajo a mano: alguien copiando y pegando de un sitio a otro |
| Haz de luz que barre la planta | Analizar o diagnosticar |
| Aristas azules | Diseñar: el plano técnico antes de construir |
| Columnas de luz | Medir: cada módulo levanta su indicador |

**La narrativa de la portada de producción, en la planta**

| Capítulo real | Estado | Qué se ve |
|---|---|---|
| Inicio («No te faltan herramientas…») | desorden | Los módulos caen al entrar, flotan sueltos y desalineados; las fichas vuelan de uno a otro |
| El problema («Solo se hace a mano») | problema | Cámara baja; más fichas |
| Diagnóstico | analizar | El haz barre la planta; las áreas que marcas en el diagnóstico **se encienden en su módulo** |
| Qué hacemos / demos / D-Code OS | conectar o apagada | Detrás de las demos y del panel de OS la planta se apaga y deja de renderizar |
| 01 Analizamos | analizar | Haz de escaneo |
| 02 Diseñamos | diseñar | Vista cenital con aristas de plano; el núcleo empieza a salir |
| 03 Implantamos | implantar | Los módulos aterrizan en su sitio (física de muelle), sube el núcleo, se tienden los conductos y empieza a fluir el dato |
| 04 Medimos | medir | Suben las columnas de medida |
| Se comprueba / Qué puedes tener / Contacto | régimen | Plano general, tranquilo y atenuado bajo el texto |

**Interacción**
- El cursor mueve la cámara y la luz clave, así que el reflejo recorre el metal.
- Al pasar el cursor por un módulo, este se levanta y muestra su nombre; un clic abre la página de su departamento.
- Los textos y los controles nunca pierden un clic por culpa de la escena.

**Páginas interiores**
- Cada departamento muestra **su** módulo, con su pantalla, conectado por un conducto que sale de cuadro hacia el resto del sistema: una parte, no una pieza suelta.
- Páginas web muestra el módulo de Marketing.
- Sistemas a medida muestra el plano (diseñar).
- Automatizaciones, integraciones, agentes, qué hacemos y departamentos muestran el sistema conectado.
- Método muestra el análisis.

## 2. Investigación → decisiones

Se hicieron dos pasadas de investigación. La primera fue técnica (morph,
scroll, cámara). La segunda, sobre realismo en Three.js r180, se contrastó con
el código de three@0.180.0.

**Qué produce realismo, y qué se usa aquí**

| Técnica | Decisión | Por qué |
|---|---|---|
| IBL sin HDR (RoomEnvironment + PMREM) | **Sí** | Reflejos y luz ambiente coherentes sin descargar ni un byte de HDR |
| PBR: MeshPhysicalMaterial con clearcoat | **Sí** | Aluminio anodizado, cerámica mate, grafito; vidrio con transmisión en calidad alta |
| Rugosidad procedimental (vetas de cepillado en canvas de 256²) | **Sí** | Rompe el reflejo como el metal real; sin texturas descargadas |
| Tone mapping Khronos PBR Neutral | **Sí** | Respeta el color real de los materiales; ACES y AgX desaturan |
| Sombras PCF suaves y estudio con ciclorama y niebla | **Sí** | La diferencia entre «objeto sobre negro» y «objeto en un sitio» |
| Bloom selectivo por umbral (1,35) | **Sí** | Solo florece lo emisivo sin tone mapping (conductos, franjas, IA); metal y pantallas no |
| Cámara tele (30°) con `setViewOffset` | **Sí** | Encuadre a un lado del texto sin deformar la perspectiva |
| Física de muelle por módulo | **Sí** | Aterrizan con peso; sin motor de física, que aquí no aporta |
| GTAO / SAO | No | Un pase de escena completo más; la sombra y el IBL ya asientan los objetos |
| DoF / Bokeh | No | Otro pase de profundidad por fotograma; el texto necesita nitidez |
| GLTF / Draco / KTX2 | No | Geometría procedimental (RoundedBox, Tube, Cylinder): cero modelos que descargar; las únicas imágenes son las capturas reales de producción (WebP de 700 px) |
| Fluidos / raymarching | No | Caros, y no representan nada que D-Code haga |

**Referencias estudiadas.** Son técnicas extraídas, no copiadas:
- **Lusion:** hornea mapas y usa matcaps para abaratar la translucidez.
- **Abeto / Igloo Inc (Site of the Year 2024):** geometría procedimental y UI en WebGL.
- **Immersive Garden:** texturas KTX y empaquetado de canales.
- **Active Theory:** motor propio que ahorra CPU.
- **Páginas de producto de Apple:** secuencias pre-renderizadas.
- **14islands:** WebGL integrado con el layout HTML.
- **Ejemplos de three.js:** `webgl_shadow_contact`, bloom y RoomEnvironment.

La conclusión que guía la escena: cuando la escena es casi estática, el
realismo sale del IBL, de un buen tone mapping y de sombras bien asentadas,
no de apilar postproceso.

## 3. Arquitectura

```
assets/vendor/three/            three r180 (module + core) y 12 addons, imports reescritos a rutas
                                absolutas: sin bundler y sin importmap. Licencia MIT: cabecera @license en cada build y texto completo en docs/THREEJS-LICENSE.txt.
assets/js/realidad/planta.js    El motor. Clase Planta: materiales, módulos, núcleo, conductos,
                                fichas, escaneo, estados, cámara, calidad, postproceso diferido.
assets/js/realidad/app.js       Orquestación: capítulo → estado, encuadre, tema, cursor, diagnóstico,
                                interiores. Carga el motor DESPUÉS de `load`.
assets/css/realidad.css         Escenario, póster, composición del Hero (escritorio y móvil),
                                etiqueta del cursor, interiores.
assets/img/planta/poster-*.webp Póster oscuro y claro, renderizados CON EL PROPIO MOTOR (24-31 KB).
```

- La portada sustituye el campo de partículas 2D (`dcp6.js`) y el cielo por
  la planta. `dcp6.css` se mantiene porque da estilo a las secciones.
- En las páginas donde aparece la planta se retira el instrumento 2D de dcp8.
- `update-asset-versions` versiona `realidad.css`, `app.js` y el import
  dinámico del motor que va dentro de `app.js`.

## 4. Calidad adaptable

| Nivel | Cuándo | DPR | Sombras | Bloom | Vidrio con transmisión |
|---|---|---|---|---|---|
| **alta** | Escritorio con puntero fino y memoria de 8 GB o más | ≤1,75 | 2048² | sí (MSAA ×4) | sí |
| **media** | Táctil, pantalla estrecha o memoria ≤4 GB | ≤1,35 | 1024² | sí (½ resolución) | no (transparencia) |
| **baja** | Memoria ≤2 GB o CPU de ≤2 núcleos | 1 | sombra de contacto horneada | no | no |
| **estática** | GPU por software (SwiftShader, llvmpipe…) | 1 | como baja | no | no |
| **sin WebGL** | — | — | — | — | póster |

La escena también baja de nivel sola durante la visita:
- Si 90 fotogramas seguidos tienen una mediana de más de 26 ms, baja un escalón.
- Si en baja la mediana supera 45 ms, pasa a estática.
- Nunca sube de nivel.

En estática (y con `prefers-reduced-motion`) se renderiza un fotograma
solo cuando cambia el estado.

**Siempre:**
- Pausa fuera de pantalla y con la pestaña oculta.
- Se apaga detrás de las demos y de D-Code OS.
- El motor se pide después de `load`.
- El titular es HTML y es el LCP.

Para QA, `?calidad=alta|media|baja|estatica` fuerza un nivel.

## 5. Métricas medidas

Entorno: Chromium headless con **SwiftShader, que es una GPU emulada en la
CPU de un contenedor de 2 núcleos**. Las cifras de carga y de estructura son
fiables. Los **tiempos de fotograma no** lo son: una GPU real hace este render
en milisegundos. Las cifras de FPS reales hay que tomarlas en un equipo físico
(ver pendientes).

**Carga** (misma máquina, mismo script, producción `e99d61f` frente a esta rama)

| | Producción 1440×900 | Nueva 1440×900 | Producción 390×844 | Nueva 390×844 |
|---|---|---|---|---|
| FCP | 2.052–2.320 ms | 820–896 ms | 796 ms | 612–692 ms |
| LCP | 2.320–2.632 ms | 820–896 ms | 796 ms | 612–800 ms |
| CLS | 0 | **0** | 0 | **0** |
| Evento `load` | 239–323 ms | 886–931 ms | 214 ms | 662–718 ms |
| JS transferido, sin comprimir | 784 KB | 1.400–1.449 KB | 366 KB | 982–1.031 KB |
| Heap JS | 5–6,5 MB | 10–12 MB | 2,5 MB | 9–12 MB |

**Motor, comprimido con gzip:** three.module 77 KB + three.core 97 KB +
addons 12 KB + planta.js 14 KB + app.js 3 KB = **≈ 203 KB**. Vercel sirve
Brotli, que comprime algo más.

**Escena**

| | Draw calls | Triángulos | Geometrías | Texturas |
|---|---|---|---|---|
| alta (1440) | 88 | 26.280 | 65 | 34 |
| media (1440) | 88 | 24.552 | 65 | 34 |
| media (390) | 72 | 19.996 | 59 | 32 |
| estática/baja (1440) | 69 | 12.728 | 72 | 21 |

**INP.** En SwiftShader, el render de un cambio de estado (más de 1 s)
coincide a veces con un clic, y el INP medido sube a 1,3–2,9 s. Con GPU real
el render dura milisegundos. El modo estático existe precisamente para que un
equipo sin aceleración no pinte en bucle.

## 6. Responsive, respaldo y accesibilidad

**Responsive**
- **Escritorio:** texto a un lado y la planta al otro. El lado se invierte en los pasos alternos del método (`v6-step--r`).
- **Móvil:** composición propia. La planta ocupa la mitad superior y el titular va abajo, sobre un degradado del color del estudio. Los pasos llevan fondo de tarjeta para leerse sobre la escena.
- **Barrido:** 7 anchos (375–1920) en las dos portadas y las 74 páginas a 1440 y 390 px. Ver §8.

**Respaldo**
- Sin WebGL, se ve el póster de la propia planta y el contenido completo.
- Con movimiento reducido, un fotograma fijo por estado, sin entrada animada ni deriva.

**Accesibilidad**
- Todo el contenido está en HTML. El lienzo es `aria-hidden`, y los nombres de los módulos dibujados en él también existen como enlaces en el menú y en el pie.
- El clic sobre un módulo es un atajo con ratón. Con teclado, esos mismos destinos son enlaces normales.
- El tema claro está completo: materiales, estudio, póster y capturas `-light`.

## 7. Cambios respecto a `0ecc76a`

- Base correcta: producción real, no `main`.
- Motor nuevo:
  - Antes eran partículas que cambiaban de forma; ahora son objetos PBR con significado.
  - Nuevo: IBL, sombras, tone mapping, bloom selectivo, física, calidad adaptable y póster.
- Contenido: el de producción, con precios, demos, diagnóstico y D-Code OS. La portada de nueve capítulos inventada en 0ecc76a no se reutiliza.
- Navegación: se conserva la de producción (menú, «Qué hacemos», idioma, tema, breadcrumbs), que ya es nueva y tiene sus propias pruebas. El Índice a pantalla completa de 0ecc76a no se trae.

## 8. QA

- **Pruebas de producción en verde:**
  - `check-instruments`
  - `check:enlaces`: 74 páginas, 5.106 enlaces, 76 bloques JSON-LD, sitemap
  - `check:portada`
  - `check:tema`: con el orden de hojas y la posición del cielo que exige
  - `check:consentimiento`
  - `check:chat`
  - `check:estado`
  - `check:superficie`: nada interno llega al despliegue
- **Barrido en navegador:** ver el resumen de la entrega.

## 9. Pendiente, dicho claro

- Medir los FPS y el INP en un equipo físico: iPad, un Android de gama media y un PC con GPU integrada. El sandbox no tiene GPU real.
- La identidad tipográfica y de componentes es la del design system de producción (escala `--f-*`, radios `--r-*`, tema claro y oscuro), que es reciente y tiene pruebas propias. No se ha rehecho componente a componente.
- Las demos, el diagnóstico y D-Code OS se mantienen tal cual: son el «laboratorio» real. La planta no los sustituye; se apaga para dejarles el sitio.
- La física es un muelle por módulo, suficiente para dar peso. No hay colisiones.
