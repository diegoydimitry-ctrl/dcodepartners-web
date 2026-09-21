# Estado de producto en la web: VERI\*FACTU y conciliación bancaria

La web **no redacta** en qué punto está VERI\*FACTU ni la conciliación bancaria:
lo lee de `estado-producto.json` (raíz del repo, no se publica) y lo escribe en
las páginas con `npm run build:estado` (incluido en `npm run sync-content`).

## Qué se genera

| Dónde | Qué |
|---|---|
| `sistema-financiero.html` (+ EN) | Bloque `#verifactu`, bloque `#conciliacion`, ficha técnica del plan 01, línea de conciliación en el primer plan que la incluye, comparativa de los tres planes y tarjeta «Tu banco» |
| `index.html` (+ EN) | Franja «Registro fiscal / Conciliación bancaria» bajo la demo |
| `cambios-en-proceso.html` (+ EN) | Filas del tablero «En proceso», su recuento y la frase de D-Code Finance |
| `assets/js/finance-demo.js` | `ESTADO_PRODUCTO` (la demo lo usa en Registro fiscal, ficha de factura, Tu gestoría y el extracto) |
| `api/_lib/estado-producto.js` | Lo que el asistente puede afirmar |

Cada trozo va entre `<!--estado:ID-->` y `<!--/estado:ID-->`. **No se editan a mano.**

## Cómo se sube de estado

Solo con la prueba. Cambiar `estado` sin rellenar la evidencia hace que el
generador se niegue y que `npm run check:estado` falle.

### VERI\*FACTU

| Estado | Texto público | Exige en `verifactu.evidencia` |
|---|---|---|
| `preparado` | Preparado para VERI\*FACTU | — (solo `fuente`) |
| `en-validacion` | Integración VERI\*FACTU en validación | `remisionPruebas`: `fecha`, `entorno` (`pruebas`/`preproduccion`), `referencia` devuelta por la AEAT, `respuesta` (`Correcto`/`AceptadoConErrores`), `commit` |
| `integrado` | VERI\*FACTU integrado | lo anterior + `validacion`: `fecha`, `informe`, `huellaContrastadaConVectoresOficiales: true`, `xmlValidadoContraXsdOficial: true`, `commit` |
| `operativo` | VERI\*FACTU operativo | lo anterior + `remisionProduccion` (`fecha`, `referencia`, `respuesta`, `commit`) + `declaracionResponsable` (`fecha`, `firmante`, `documento`) |

`qrEnFactura` (`fecha`, `commit`) se rellena aparte cuando el QR de cotejo se imprima.

### Conciliación bancaria

| Estado | Texto público | Exige en `conciliacion.evidencia` |
|---|---|---|
| `planificada` | Próximamente | `decision` |
| `en-desarrollo` | En desarrollo | + `desarrollo` (`fecha`, `rama`, `commit`) |
| `en-pruebas` | En pruebas | + `pruebas` (`fecha`, `informe`, `commit`) |
| `disponible` | Disponible | + `disponible` (`fecha`, `commit`, `entorno: produccion`) |

`conciliacion.incluidaEn` decide en qué planes aparece. Los planes son
acumulativos: si está en uno, tiene que estar en los de encima.

## Qué no se puede escribir en ningún sitio

`npm run check:estado` barre todo lo que se publica (HTML, JS, base de
conocimiento del asistente y `api/`) y falla con «VERI\*FACTU implantado»,
«100 % conforme», «homologado», «certificado» atribuido a lo fiscal, «cumple
VERI\*FACTU», «adaptado a VERI\*FACTU», «aprobado por la AEAT», sus
equivalentes en inglés y la antigua promesa «te lo implantamos en un día».
El detector se prueba a sí mismo con frases que tiene que cazar y frases que no.

`npm run test:estado` demuestra el mecanismo sobre una copia temporal del
repositorio (10 casos).

## Pasos para actualizar

1. Finance aporta la prueba y se rellena en `estado-producto.json`.
2. `npm run sync-content`
3. `npm run check:estado && npm run test:estado`
4. Commit en rama; nunca directo a `main`.
