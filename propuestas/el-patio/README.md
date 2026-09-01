# Propuesta comercial — El Patio (Las Rozas)

Documento de 6 páginas A4 para el restaurante El Patio (elpatio.es).
Entregable final: **`Propuesta-El-Patio-DCode-Partners.pdf`**.

## Estructura

| Pág. | Contenido |
|------|-----------|
| 1 | Portada con el logotipo del restaurante |
| 2 | El objetivo (experiencia · presencia digital · eficiencia) |
| 3 | Tres plantillas de soporte QR con la marca de El Patio |
| 4 | Presencia digital: web actual, mantenimiento y redes |
| 5 | Automatización — **servicio independiente del plan mensual** |
| 6 | La propuesta: plan de 400 €/mes, QR por unidades y automatización aparte |

### Qué entra y qué no en el plan de 400 €/mes

Incluye mantenimiento y mejoras de la web, gestión de la presencia digital,
redes y contenido, códigos QR cuando se necesiten, seguimiento de reseñas y
soporte. **La automatización de procesos NO está incluida**: es un servicio
propio de D-Code Partners que se analiza caso por caso y se presupuesta por
separado, con precio cerrado antes de empezar.

## Marca del cliente

- **Logotipo**: extraído de la cabecera de elpatio.es y vectorizado con
  [potracer](https://pypi.org/project/potracer/) a `assets/logo-elpatio-ink.svg`
  (versión oscura) y `assets/logo-elpatio-light.svg` (versión clara).
  Al ser un trazado a partir de una captura, para producción de soportes
  impresos conviene pedir al restaurante el vector original y sustituirlo.
- **Color**: negro `#0E0C0A`, papel `#FAF8F5` y dorado `#A88A63`, muestreado
  del propio sitio web.
- **Tipografías del documento**: Fraunces (títulos, SIL OFL, auto-alojada) e
  Inter (texto, reutilizada de `assets/fonts/` del sitio). Ambas incrustadas
  en el PDF.

## Regenerar el PDF

```bash
npm install                        # playwright (usa el Chromium del entorno)
node propuestas/el-patio/build.mjs
```

El script maqueta `propuesta-el-patio.html`, ejecuta un control de calidad
automático y escribe el PDF junto al HTML. El QA comprueba:

1. que ningún elemento rebase el área útil de la hoja (márgenes y pie),
2. que nada quede recortado por un contenedor con `overflow:hidden`,
3. que no haya bloques de texto solapados,
4. tamaños mínimos de fuente para impresión.

## Códigos QR

Se generan con [segno](https://pypi.org/project/segno/):

```bash
python3 -c "import segno; segno.make('URL', error='m').save('propuestas/el-patio/assets/qr-el-patio.svg', kind='svg', scale=10, border=3, dark='#141010', light=None)"
```

Los del PDF actual son **de muestra** y apuntan a `elpatio.es`. Antes de
producir los soportes hay que regenerarlos con el enlace de reseñas de la
ficha de Google del restaurante.
