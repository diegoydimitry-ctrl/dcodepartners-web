# Los tirones al entrar: quién pide qué y cuándo

> «En otros dispositivos como el iPad o el teléfono da tirones a la hora de
> entrar a la web y que cargue todo. Las demos tardan en cargar y demás.»

Las iteraciones anteriores iban de lo que cuesta **mantener** la página en
pantalla. Esta va de lo que cuesta **montarla**, que se mide distinto: tareas
largas —más de 50 ms con el hilo principal bloqueado— desde que se pide la
página hasta que responde.

## Lo que pasaba

El HTML pedía **siete ficheros con `defer`**, unos 330 KB de JavaScript que el
navegador compila y ejecuta uno detrás de otro en cuanto termina de leer el
HTML. En un iPad eso eran **961 ms de hilo bloqueado al entrar**, con una
tarea de 372 ms. La página se veía, y no respondía.

Y de esos 330 KB, en un aparato táctil:

- **154 KB (`dcp6.js`) y 64 KB (`dcp8.js`) no hacen nada**: son el campo de
  partículas, que en táctil no se monta desde la iteración del iPad. Se
  descargaban, se compilaban y se ejecutaban para salir en la primera línea.
- `dcp10.js` y `dcode-os.js` viven muy por debajo del primer pantallazo.
- `main.js` pesaba 81 KB y un tercio de él —formulario de contacto, envío,
  movilidad por departamento y asistente— tampoco hace falta en el primer
  segundo.

Aparte, la demo de Finance (287 KB de motor + 129 de datos) se montaba **al
acercarse**: una tarea de 274–312 ms justo mientras el dedo bajaba.

## Lo que se hizo

El HTML ya no pide esos ficheros con `defer`: los **marca**, y `main.js`
decide (bloque «CARGA A SU DEBIDO TIEMPO»).

- `type="dcp/raton"` → solo con puntero fino. **En táctil no se descarga ni un
  byte** del campo. El `<link rel=preload media="(pointer:fine)">` que va al
  lado mantiene la descarga igual de pronto en un ratón.
- `type="dcp/cerca"` → en el primer hueco libre después de montar el HTML, uno
  por hueco; y de inmediato si su sección ya se ve.
- `main-b.js`: 30 KB salidos de `main.js` sin tocar una línea de su lógica. En
  `/contacto` el formulario se ve al entrar, así que llega enseguida; en el
  resto, en el hueco.
- La demo de Finance se monta en ese mismo hueco: cuando se llega, ya está.
  Si el aparato pide ahorrar datos, se respeta.

Tres detalles, cada uno con su medida detrás:

1. La puerta **no** se abre al primer roce del dedo (se probó: el recorrido
   pasaba de 339 a 485 ms).
2. La puerta **no** espera a `load` (en un teléfono llega tarde y el dedo ya
   baja).
3. Al abrir entra **todo** lo que quede, aunque su sección esté al final; si
   no, `dcode-os.js` se pedía en mitad del recorrido.

### Un fallo por el camino

Al dejar de descargar `dcp6.js`/`dcp8.js` en táctil, la clase
`html.cielo-quieto` —que esconde el lienzo y saca la galaxia— **dejó de
ponerse**, porque la ponían ellos. Resultado: un rectángulo opaco tapando el
cielo en las 130 cargas de `qa:dispositivos`, que lo cazó en la primera
pasada. Ahora la pone el script del `<head>`, antes de pintar, y `check:tema`
lo vigila.

## Antes y después

Mediana de seis cargas por perfil:

| | tareas largas al entrar | la peor | durante el recorrido |
|---|---:|---:|---:|
| iPad | 961 → **860 ms** | 372 → **323 ms** | 339 → **62 ms** |
| Móvil | 998 → **983 ms** | 445 → **345 ms** | 92 → 173 ms |
| PC | 206 → **178 ms** | 123 → **119 ms** | 73 → **0 ms** |

El recorrido del iPad baja un **82 %**. El del móvil parece subir, y conviene
mirarlo de cerca: bajando la portada entera quedan **dos o tres tareas de 50 a
73 ms**, todas al final de la página, todas de pintado y **sin una sola
petición de JavaScript**. Antes las tareas eran del mismo tamaño; lo que cambia
es cuántas cruzan el listón de los 50 ms. Es jitter alrededor del umbral, no
una regresión: lo que sí desapareció del recorrido es la compilación de
ficheros, que era lo que se notaba.

## El suelo, y por qué no se ha bajado más

Medido apagando cosas enteras en el perfil iPad:

| | tareas largas al entrar |
|---|---:|
| la página entera | 753 ms |
| **sin ninguna hoja de estilo** | **191 ms** |
| sin nada de JavaScript | 464 ms |

**El CSS es dos tercios del coste.** La portada trae 693 KB de CSS que bloquean
el pintado. Se probaron los atajos y ninguno vale: cargar el CSS sin bloquear
adelanta el primer pintado pero **sube** el total bloqueado (705 → 990 ms);
`content-visibility` gana 45 ms y cambia la altura de la página, que rompe el
recorrido del campo; quitar la galaxia entera no mejora nada.

Bajar de ahí pide **CSS crítico** y **minificar al desplegar** (los ficheros
van con sus comentarios, que son entre el 13 % y el 43 % del peso, y ahí vive
la documentación del proyecto). Las dos tocan el pipeline de Vercel, que desde
aquí no se puede probar. Quedan **PENDIENTES** y escritas.

## Verificación

`qa:carga` (nuevo, probado rompiéndolo) · diez checks · `qa:formulario` 120
campos · `qa:dispositivos` 130 cargas · `qa:demo` sin incidencias ·
`qa:solapes` 70 páginas × 10 anchos = 0 · axe-core WCAG 2.2 AA en 10 páginas ×
2 anchos, con ratón y con dedo = 0 · bancos de carga y recorrido en los tres
perfiles, seis pasadas cada uno.

**NO MEDIDO**: nada de esto está medido en un iPad real con Safari.
