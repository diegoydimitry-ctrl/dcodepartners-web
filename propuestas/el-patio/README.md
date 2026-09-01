# Propuesta comercial — El Patio (Las Rozas)

Documento de 6 páginas A4 para el restaurante El Patio.
Entregable final: **`Propuesta-El-Patio-DCode-Partners.pdf`**.

## Estructura

| Pág. | Contenido |
|------|-----------|
| 1 | Portada |
| 2 | El objetivo (experiencia · presencia digital · eficiencia) |
| 3 | QR de reseñas de Google y sus soportes |
| 4 | Presencia digital (web, mantenimiento, redes) |
| 5 | Automatización de tareas repetitivas |
| 6 | La propuesta: 20 €/QR, 15 €/QR desde 10 uds., plan de 400 €/mes |

## Regenerar el PDF

```bash
npm install                        # playwright (usa el Chromium del entorno)
node propuestas/el-patio/build.mjs
```

El script maqueta `propuesta-el-patio.html`, ejecuta un control de calidad
automático (desbordes de página, elementos recortados, solapes de texto y
tamaños de fuente mínimos) y escribe el PDF junto al HTML.

## Detalles

- Tipografías: **Fraunces** (títulos, SIL OFL, auto-alojada en `assets/`) e
  **Inter** (texto, reutilizada de `assets/fonts/` del sitio). Ambas van
  incrustadas en el PDF.
- Los QR se generan con [segno](https://pypi.org/project/segno/):

  ```bash
  python3 -c "import segno; segno.make('URL', error='m').save('propuestas/el-patio/assets/qr-el-patio.svg', kind='svg', scale=10, border=3, dark='#1a1510', light=None)"
  ```

  Los del PDF actual son **de muestra** y apuntan a `dcodepartners.com`.
  Antes de producir los soportes hay que regenerarlos con el enlace de reseñas
  de la ficha de Google de El Patio.
