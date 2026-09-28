# Créditos de las imágenes renderizadas (`scripts/v2/renders/`)

Todas las escenas son de D-Code (Blender 4.2, Cycles), salvo el modelo de terceros que se indica.

| Imagen | Qué hay de terceros | Licencia | Cómo se atribuye en la web |
|---|---|---|---|
| `assets/v2/img/webs/taller-1.webp`, `taller-2.webp` (web de ejemplo «Brío») | Coche «CarConcept», de **Eric Chadwick / Darmstadt Graphics Group GmbH** (2024), publicado en Khronos glTF-Sample-Assets a partir de un modelo de dominio público (CC0) de Unity Fan | **CC BY 4.0** — https://creativecommons.org/licenses/by/4.0/ | Línea «Coche de las fotos: «CarConcept», Eric Chadwick / Darmstadt Graphics Group · CC BY 4.0 · modificado, render de D-Code» al pie de la portada de Brío (`scripts/v2/paginas/webs3d.mjs`) |
| Resto (Vandria, Orbe, productos) | Nada: geometría y materiales de D-Code | — | — |

Cambios sobre el modelo: la matrícula y el emblema del volante se sustituyen por materiales lisos (llevaban logotipos de Khronos, que no se usan), el segundo coche lleva pintura grafito y los flancos de los neumáticos, un material liso. El fichero original no se incluye en el repositorio (`taller.py --coche <CarConcept.glb>`).
