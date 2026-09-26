# Preview local: D-Code Partners, remodelación completa

Rama `claude/dcode-full-redesign`. Parte de `e99d61f`, que es lo que sirve producción. La explicación completa está en `REDESIGN_FULL.md`.

```bash
git fetch origin claude/dcode-full-redesign
git checkout claude/dcode-full-redesign
npm install          # solo para las herramientas de pruebas
npx serve .          # abre http://localhost:3000 (con URLs limpias)
```

Con Python (`python3 -m http.server 8080`) las URLs llevan `.html`.

**Qué mirar**
- `/` y `/en`: recarga para ver la pieza montarse. Mueve el ratón (inercia y luz) y baja despacio por «Anatomía» (las cotas siguen cada capa).
- En el diagnóstico, marca un área: su toma se enciende.
- `/departamentos/finanzas` (y las otras 7), `/servicios/*`, `/que-hacemos`, `/precios`, `/metodo`, `/casos-exito`, `/contacto`: héroe con la fotografía de su parte del sistema.
- Botón «Modo oscuro» (abajo a la izquierda): estudio oscuro.
- `?calidad=alta|media|baja|estatica` fuerza un nivel del motor.

**Regenerar las fotografías de producto** (tras tocar `assets/js/nucleo/nucleo.js`):
abre `scripts/fotos/estudio.html?estado=anatomia&tema=claro` en local para
ver un plano. Cada plano se define en la URL (`estado`, `cam`, `mira`, `fov`, `giro`, `focos`).

**Antes de commitear**
```bash
npm run update-asset-versions
npm run check:tema && npm run check:portada && npm run check:enlaces && npm run check:superficie
```

Esta rama no hace merge ni deploy a producción.
