# Preview local — D-Code Partners v11 · Reconstrucción visual

Rama: `claude/rediseno-cinematico-webgl`. Sigue siendo HTML multipágina +
CSS + JS vanilla, sin bundler ni React. El diseño se ha rehecho entero; el
contenido, los textos legales, el SEO (títulos, meta, OG, JSON-LD, sitemap,
robots), el chatbot, la demo de D-Code Finance y los datos reales se
conservan tal cual.

## 1 · Instalación

```bash
npm install
```

Three.js no se instala desde npm para producción: está vendorizado en
`assets/vendor/three/` (build ES module oficial, sin CDN).

## 2 · Ver la web en local

No hay servidor de desarrollo ni paso de build: es HTML estático.

```bash
npx serve .              # recomendado: respeta las URLs limpias (/metodo)
# o bien
python3 -m http.server 8080   # entonces abre las páginas con .html (/metodo.html)
```

Abre `http://localhost:3000` (serve) o `http://localhost:8080` (Python).

**Qué mirar primero**

| Ruta | Qué hay |
| --- | --- |
| `/` y `/en` | La portada: una sola escena WebGL fija que cambia de forma en nueve capítulos (Entrada → Problema → Conexión → Sistema → Lo que construimos → Laboratorio → Casos → Precio → Contacto). Mueve el ratón sobre el Hero; pasa el cursor por los departamentos del capítulo 05; baja despacio por el 04 (las capas se encienden una a una). |
| Botón **Índice** (arriba a la derecha) | La navegación nueva a pantalla completa. Escape la cierra. |
| `/servicios` | Reconstruida como Problema → Transformación → Solución. |
| `/departamentos/finanzas` (y las otras 7) | Héroe interior con la escena teñida del color del departamento. |
| `/conocenos`, `/contacto`, `/metodo`, `/casos-exito` | Cada página interior usa la forma del motor que le corresponde. |
| `/privacidad` y demás legales | Mismo sistema tipográfico, sin escena (a propósito). |

Para comprobar los modos de respaldo: activa "reducir movimiento" en el
sistema operativo (la escena queda en un fotograma fijo y nada se anima), o
desactiva WebGL en el navegador (queda el fondo degradado y todo el texto).

## 3 · Arquitectura del diseño

- `assets/js/dcode-system.js` — el ÚNICO motor 3D. Partículas con morph en
  GPU entre ocho formas (polvo, núcleo, fragmentos, red, capas, retícula,
  horizonte, punto), repulsión del cursor, líneas por forma, DPR limitado,
  pausa fuera de pantalla y con la pestaña oculta.
- `assets/js/dcp10.js` — orquestación: Índice, cabecera retirable, apariciones,
  capítulos de la portada, laboratorio, héroes interiores y los botones que
  preguntan al asistente real.
- `assets/css/dcp10.css` — el sistema visual completo: `body.d11-home`
  (portada), `body.d11-int` (las 66 páginas interiores con cabecera), y la
  parte global (cabecera, Índice, botones).
- Las páginas de la app/demo de Finance (`/sistema-financiero/app|demo`)
  quedan fuera a propósito: tienen su propia interfaz.

## 4 · Antes de cada commit

```bash
npm run update-asset-versions   # recalcula los ?v= de CSS/JS en todo el HTML
npm run generate-kb             # si cambió texto: regenera la base del chatbot
npm run check-instruments       # instrumentos/composiciones declarados = definidos
```

## 5 · Variables de entorno

Ninguna nueva. El chatbot sigue usando las que ya tenía en Vercel.

## 6 · Qué NO hace esta rama

- No hace push, merge ni deploy; no toca `main` ni producción.
- No inventa precios, métricas, clientes ni resultados: la sección Precio
  explica cómo se fija el precio (tal y como dicen la FAQ y las Condiciones
  de contratación), porque la web no publica ninguna cifra.
- No añade librerías: Three.js ya estaba vendorizado.
