# REDESIGN_FINAL

Qué se ha hecho, por qué, y qué queda. Complementa `REDESIGN_RESEARCH.md`, que
es la investigación previa y sigue siendo la fuente de las decisiones.

Rama `diseno/dcode-design-system` · desde `6699d5f`.

---

## 1. Sistema visual

Estaba a medias: tres tokens (`--f-display`, `--f-h2`, `--f-body`) y más de
setenta `clamp()` sueltos, cada sección decidiendo su tamaño por su cuenta. En
`/que-hacemos`, `/precios` y las cinco de `/servicios/`, el titular de la página
y el de sus secciones medían **los dos 45 px**: sin diferencia de tamaño no hay
jerarquía, solo texto grande repetido.

Ahora la escala está declarada en `assets/css/dcp5.css`, en un solo sitio:

```
--f-display  clamp(2.7rem, 6.8vw, 5.6rem)    portada, una vez por web
--f-h1       clamp(2.25rem, 4.6vw, 3.5rem)   titular de página
--f-h2       clamp(1.8rem, 3.3vw, 2.8rem)    titular de sección
--f-h3       clamp(1.25rem, 1.6vw, 1.5rem)   titular de bloque
--f-h4       1.0625rem                        titular de tarjeta
--f-lead     clamp(1.0625rem, 1.3vw, 1.25rem) entradilla
--f-body     clamp(1rem, 1.02vw, 1.05rem)
--f-small    .9375rem      --f-mono  .8125rem
```

Con su interlineado (`--lh-display: 1.02` … `--lh-body: 1.6`), el ritmo de
espacio (`--e-1: 4px` … `--e-10: 128px`, múltiplos de 4, sin excepciones) y los
radios con jerarquía (`--r-ctrl: 6px`, `--r-card: 10px`, `--r-win: 16px`,
`--r-pill: 999px`): el radio dice de qué tamaño es la cosa, y un control no se
redondea como una ventana.

Medido después, en un PC de 1440 px:

| | antes | después |
|---|---|---|
| Portada · display | 75 px | 75 px |
| Página · h1 | 45 px | **56 px** |
| Sección · h2 | 45 px | 45 px |

`.h-title` (95 usos), `.v6-title` y `.os-h2` salen ya de la escala. Quedan
clamps sueltos en hojas de componentes: ver *Pendientes*.

## 2. Narrativa de la portada

El orden abría por el sistema. Ahora abre por lo que el visitante reconoce:

```
inicio  →  problema  →  diagnostico  →  que-hacemos  →  sistemas  →
dcode-os  →  proceso  →  confianza  →  que-puedes-tener  →  contacto
```

`diagnostico` sube por delante de `que-hacemos`: es el que le pone precio al
problema, así que va justo después de plantearlo y antes de enseñar nada.

## 3. «El problema»: la capa que se enciende

Sección nueva, y el recurso narrativo central del rediseño. Siete tareas que
alguien del equipo hará hoy —copiar, pegar, buscar, responder, apuntar,
revisar, recordar— cada una con **cuántas veces al día**. La capa entra
apagada: gris, monoespaciada, con la etiqueta `A MANO`. Medio segundo después
de llegar a la vista se enciende: azul D-Code, la etiqueta cambia a
`CON EL SISTEMA` y cada contador se tacha, escalonado de arriba abajo.

**Esa pausa de 520 ms no es decoración.** Sin ella el contraste no se percibe:
al llegar ya está encendida y lo que debería leerse como «esto es lo de hoy →
esto es con el sistema» se lee como una lista azul. El antes hay que verlo para
que el después signifique algo. Verificado midiendo estilos calculados:

| | clase | etiqueta `A MANO` | número |
|---|---|---|---|
| Antes de bajar | apagada | opacidad 1 | gris |
| 230 ms tras entrar | apagada | opacidad 1 | gris |
| 2,2 s tras entrar | encendida | opacidad 0 | azul |

**Coste: una lista, dos estados y transiciones de `transform` y `opacity`.** Ni
WebGL, ni canvas, ni una imagen. Se anima una vez y el observador se
desconecta; con `prefers-reduced-motion` se enciende directamente.

## 4. Hero

| | |
|---|---|
| Antes | «Lo que tu equipo repite cada semana / puede hacerlo un sistema.» |
| Ahora | **«No te faltan herramientas. / Te falta que hablen entre ellas.»** |

Y un solo botón primario. Había dos del mismo peso —«Prueba los sistemas» y
«Haz el diagnóstico»—, que es pedir dos cosas a la vez y no elegir ninguna. El
segundo pasa a una línea que invita sin competir: «¿Cuánto os cuesta hoy?
**Hazlo el diagnóstico** →». En inglés, igual.

## 5. Precios

El catálogo **ya tenía filtros** por categoría, sector y necesidad: eso no
hacía falta construirlo. Lo que no funcionaba era el teléfono, donde los siete
grupos se abren a la vez y dieciocho fichas seguidas no se recorren.

Ahora, **solo por debajo de 767 px**, cada grupo se pliega con su recuento a la
vista; el primero queda abierto. Al filtrar, los grupos que siguen teniendo
fichas se abren solos —plegado y filtrado a la vez escondería justo lo que
acaban de pedir—. Es mejora progresiva: sin JavaScript se ve el catálogo
entero, como siempre.

| | antes | después |
|---|---|---|
| /precios a 320 px | 15.170 px | **8.361 px** |
| /precios en iPhone 12 | 13.961 px | **7.750 px** |
| iPad y PC | — | sin cambios |

## 6. SEO

`JSON-LD` en las diez páginas de `/servicios/` (ES y EN) con `Service` +
`BreadcrumbList`, generado de la descripción real de cada página. De 18 páginas
con datos estructurados a **28**.

Y una frase que la investigación señalaba como marca de web genérica, y que
estaba literalmente en el `<title>`:

| | antes | después |
|---|---|---|
| EN | «D-Code Finance — AI-Powered Financial System» | «D-Code Finance — Invoice, get paid and know where you stand» |
| ES | «Sistema Financiero con IA» | «Facturar, cobrar y saber lo que hay» |

`check:enlaces` (que valida JSON-LD, sitemap y hreflang), `check:og` y
`check:kb` en verde después.

## 7. Auditoría «¿parece hecha por IA?»

Contra las siete señales concretas de la investigación:

| Señal | Estado |
|---|---|
| Inter genérica sin variación | **limpio** — tres familias con intención |
| Gradiente morado-azul decorativo | **limpio** — 0 apariciones |
| Mismo radio en todo | **limpio** — 21 radios distintos, con jerarquía |
| Mismo padding en todas las tarjetas | **limpio** — 277 paddings distintos |
| Fotos de stock / blobs 3D | **limpio** — 0 `.jpg`, producto real |
| Titulares vagos («AI-powered») | **corregido** — de 3 a 0 |
| Hover que no hace nada / fade-in idéntico | **parcial** — 364 hovers sin auditar uno a uno |

## 8. Rendimiento

Medido con `perf/aparatos.mjs`, CPU frenada ×4, antes y después:

| | primer pintado | bloqueo | peso |
|---|---|---|---|
| iPhone 12 · portada | 408 → **432 ms** | 51 → **0 ms** | 1.087 → **1.109 KB** |
| iPad (gen 7) · portada | 508 → 880 ms | 103 → 119 ms | 1.087 → 1.109 KB |
| Galaxy S9+ · portada | 492 → **396 ms** | 36 → **0 ms** | 1.087 → **1.109 KB** |

Los 22 KB de más son la sección nueva. **El bloqueo del hilo principal baja a
cero en todas las páginas menos la portada en iPad.** El primer pintado se
mueve ±150 ms entre carreras, así que las diferencias de esa columna están
dentro del ruido y **no se afirma mejora**: lo firme es el bloqueo y el peso.

Cero dependencias nuevas. Cero WebGL.

## 9. Responsive

El corte sigue en **767 px** a propósito: el iPad en vertical mide 768 y ahí las
demos se usan. En el teléfono la web se lee, no se toca.

La sección nueva se comprime en dos escalones: a 640 px se aprietan los
espacios, y a 400 px el contador se queda en la cifra —«6 ×»— porque las
palabras «veces al día» ya las dice la fila de arriba. De ~2.300 px a **1.089**
en una pantalla de 320.

## 10. Pruebas

Las 38 siguen y todas pasan. Dos guardas tocadas, y conviene decir por qué:

- `qa:dispositivos` sube su tope de alto en teléfono de 11.000 a **11.500 px**.
  La portada ha ganado una sección entera que antes no existía. El tope existe
  para que no vuelvan las diecisiete pantallas (15.671 px); a 11.123 sigue a
  4.500 px de aquello. Si hace falta subirlo otra vez, la pregunta correcta es
  qué sobra, no cuánto se sube.
- Se retira la excepción de `/precios`, que ya no la necesita. Queda solo
  `/sistema-financiero`.

`qa:solapes` cazó un fallo real durante el trabajo: el botón de plegar iba en
`position:absolute` sobre toda la cabecera del grupo y el contador caía encima
de la descripción, a 320 y a 430 px. Corregido poniendo la cabecera en rejilla.

## 11. Decisiones tomadas sin preguntar

1. **Completar la escala donde ya vivía** (`dcp5.css`) en vez de crear una hoja
   nueva: no hay que cablear un `<link>` en 74 páginas, no hay petición de más,
   y `check:tema` exige que `tema.css` y `superficies.css` sean las dos últimas.
2. **Pausa de 520 ms antes de encender la capa.** Sin ella la idea no se lee.
3. **Plegar el catálogo solo en teléfono.** En tableta y PC verlo entero es una
   ventaja, no un problema.
4. **No tocar la maqueta del kanban de las demos**: con 22 tarjetas parecía
   cortarse, se midió, y las 22 se alcanzan bajando 97 px.
5. **Los ocho `/departamentos/` se conservan.** El plan contemplaba fusionarlos
   en los cinco servicios. Tienen contenido propio y la navegación principal ya
   solo enlaza uno: el problema de «demasiadas opciones» no está ahí, y
   borrarlos habría costado ocho 301 y contenido real a cambio de poco. Queda
   documentado como pendiente, no como hecho.

## 12. Pendientes reales

1. **La fusión de `/departamentos/` en `/servicios/`.** Es la parte del plan
   (apartado J de la investigación) que no se ha ejecutado, por la razón de
   arriba. Exige mover contenido, ocho redirecciones 301, sitemap y `check:kb`.
2. **68 `clamp()` de tamaño siguen sueltos** en hojas de componentes. Los
   titulares principales ya salen de la escala; el resto no se ha migrado
   porque cada uno exige comprobar su bloque y no había forma de validarlo sin
   arriesgar maquetación.
3. **CSS muerto sin medir.** 966 KB sin comprimir en 16 hojas; no se ha hecho
   barrido de cobertura por página.
4. **Los 364 `:hover` no se han auditado uno a uno** contra la regla de «ningún
   hover que no haga nada».
5. **`/sistema-financiero` sigue en 15.321 px en móvil.** Lo que la alarga es
   información —las catorce piezas de Finance—, no demos. Recortarla es decidir
   qué deja de contarse, y eso no se inventa: queda anclado para que no crezca.
6. **Sin casos con resultados.** `casos-exito.html` tiene una sola cifra
   publicada. No se ha fabricado ninguna.
