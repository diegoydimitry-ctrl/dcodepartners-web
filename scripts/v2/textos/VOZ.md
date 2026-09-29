# Cómo escribe D-Code Partners en su web

Revisión del 29/09/2026, por petición de Dirección: «textos más humanos, como si los hubiera escrito yo de forma profesional; decir "Lo que toca. Ahora…" no me sirve; cada cosa debe entenderse en una frase y no debe haber cosas a medias ni que no se entiendan».

## La voz
Escribe como lo haría uno de los fundadores de D-Code al explicar su trabajo a un empresario que no conoce: con cercanía y seguridad, sin jerga ni frases de anuncio. Una persona real, profesional y tranquila, que explica lo que hace y lo que consigues con ello.

## Reglas
1. **Frases completas.** Cada titular y cada frase tienen sujeto y verbo, y se entienden sin leer lo de alrededor.
   - Mal: «Hoy, piezas sueltas.» · «Las unimos.» · «Lo que toca. Ahora…» · «No te lo contamos. Tócalo.»
   - Bien: «Hoy cada herramienta de tu empresa va por su lado.» · «Nosotros las conectamos.» · «Pruébalo tú antes de hablar con nosotros.»
2. **Una idea por frase.** Si una frase necesita dos puntos y un punto y coma para sostenerse, son dos frases.
3. **Nada a medias.** No se deja un titular colgando para que el siguiente lo complete, ni se usan elipsis de eslogan («Hecho solo.», «En un sitio.», «Sin tocarlo por dentro.»).
4. **Tú al lector, nosotros para D-Code.** «Tu empresa», «tu equipo», «lo que ya usas». No mezclar con «vosotros» ni «usáis».
5. **Palabras de empresario, no de programador.** «Cliente potencial» o «contacto» antes que «lead»; «programa» o «herramienta» antes que «stack». Los nombres de producto (D-Code Finance, D-Code OS, VERI*FACTU) no se tocan.
6. **Los botones dicen lo que pasa al pulsarlos.** «Reservar una llamada», «Ver las demos», «Ver precios». Nada de «Tócalo» ni «Vamos».
7. **Profesional y concreto.** Nada de superlativos vacíos («revolucionario», «increíble», «de otro nivel»), ni exclamaciones, ni promesas que no se puedan cumplir.
8. **Los hechos no cambian.** Precios, plazos, cifras, garantías, nombres de empresas de las demos, condiciones y datos legales se copian tal cual. Si una frase dice algo que no se entiende, se aclara sin inventar nada nuevo.
9. **Longitud.** Los titulares siguen siendo cortos (caben en la misma maqueta): una frase de 3 a 10 palabras. Los párrafos, de una a tres frases.

## Qué no se toca
Los textos legales (privacidad, aviso legal, cookies, condiciones de contratación, acuerdo de encargado del tratamiento, seguridad de la información) y la versión inglesa (`/en`), que tiene su propio texto.

## Cómo se aplica
Cada página tiene su archivo en esta carpeta con pares `[texto anterior, texto nuevo]` tal como aparecen en el HTML; `comun.json` tiene los textos de la cabecera, el menú y el pie de todas las páginas. `node scripts/v2/textos.mjs` los aplica y `--check` comprueba que están todos. Se ejecuta al final de `build:v2` y de `sync-content`.
