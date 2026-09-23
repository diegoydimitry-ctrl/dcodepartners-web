# Cierre — el formulario en un iPad y el repaso de todos los aparatos

## El fallo

> «Revisa el apartado del formulario en iPad web, no aparece para escribir
> nada, está mal.»

Era mío, de la iteración anterior, y de manual. Al apagar el campo de
partículas en táctil escribí:

```css
html.cielo-quieto .field{ display:none !important; }
```

`.field` es el campo de **partículas** (`.field[data-field]` en la portada,
`.field--inst` en el resto). Y es también el campo de un **formulario**:

```html
<div class="field"><label for="nombre">Nombre completo</label><input id="nombre"></div>
```

Así que en cuanto el puntero era grueso, los doce campos del formulario de
contacto se apagaban. En un iPad la página se veía entera y no se podía
escribir en ella.

Lo peor no es el fallo: es que **no lo cazó nada**.

- `qa:solapes` mira anchos de ventana, no aparatos. A 1024 px de ventana de
  escritorio el formulario se veía perfectamente.
- axe-core no incumple ninguna norma con un campo en `display:none`.
- `check:tema` **ya vigilaba exactamente este choque de nombres** —lo dejó
  escrito una iteración anterior, cuando una regla sobre `.field` apagó los
  formularios en tema claro— pero solo en `tema.css`. La regla nueva estaba en
  `dcp7.css`.

## Lo que se ha hecho

**El arreglo**, que es de una línea:

```css
html.cielo-quieto .field[data-field],
html.cielo-quieto .field--inst{ display:none !important; }
```

**Y tres puertas para que no vuelva:**

1. `check:tema` aplica la regla de nombres también a `dcp7.css`: si alguien
   escribe `.field` a secas, falla y dice por qué. Probado escribiéndolo.
2. `qa:formulario` (nuevo): recorre los cuatro pasos **rellenándolos de
   verdad** en 6 aparatos × 2 temas × ES/EN — 120 campos—, comprueba que cada
   uno se ve, se enfoca y acepta texto, que los botones llevan al paso
   siguiente y que el cierre (casilla de privacidad y botón de enviar) está.
   No envía nada. Probado reintroduciendo el fallo: lo caza en el primer
   aparato táctil.
3. `qa:dispositivos` (nuevo): 13 páginas × 5 aparatos × 2 temas = 130 cargas.
   En cada una: desborde horizontal, texto visible, **campos de formulario del
   paso activo apagados**, imágenes rotas, el cielo quieto donde toca y solo
   donde toca, y errores de JavaScript propios.

La lección, escrita donde se lee: desde que el campo se apaga con el puntero
grueso, **un iPad de 1024 px y una ventana de escritorio de 1024 px ya no son
la misma web**. Las pruebas que miran anchos no bastan.

## El repaso de todos los aparatos

130 cargas (PC 1440, PC 1024, iPad, iPad apaisado, móvil 393 y 320 · los dos
temas · 13 páginas ES y EN): **0 incidencias**.

Banco de rendimiento, recorriendo la portada entera:

| perfil | p50 | p95 | > 50 ms | > 100 ms | lienzo | compositor |
|---|---:|---:|---:|---:|---:|---:|
| PC | 17 ms | 41 ms | 6 | 0 | 401.957 | 1.444 ms |
| iPad | 18 ms | 45 ms | 9 | 1 | **0** | **154 ms** |
| Móvil | 17 ms | 26 ms | 2 | 0 | **0** | **175 ms** |

Y por páginas en perfil iPad: `/servicios` p50 17 · p95 26 · `/contacto` p50 17
· p95 23 · `/sistema-financiero` p50 18 · p95 49, que es la más pesada y ya no
la que iba a tirones (era 34 ms de mediana).

## Una cosa más que salió en el repaso

axe-core con dedo cazó la pastilla de progreso (`.dcx-now`) en `/en/servicios`
a 390 px con **1,22:1** de contraste. No era un color mal elegido: la pastilla
se apaga con `opacity:0` mientras alguien lee, y un elemento a opacidad cero
**sigue existiendo** —para axe y para un lector de pantalla—. Ahora se apaga
también con `visibility`, con la transición escalonada para que el fundido se
vea igual. Comprobado con tres pasadas seguidas: 0 incumplimientos.

## Verificación de cierre

Nueve checks · `qa:formulario` 120 campos · `qa:dispositivos` 130 cargas · 
`qa:demo` sin incidencias · `qa:solapes` 70 páginas × 10 anchos = 0 ·
axe-core WCAG 2.2 AA en 10 páginas × 2 anchos, **con ratón y con dedo** = 0 ·
banco de rendimiento en los tres perfiles · hojas de contacto de 5 páginas × 3
aparatos × 2 temas, revisadas a ojo.

**NO MEDIDO**: nada de esto está medido en un iPad real con Safari.
