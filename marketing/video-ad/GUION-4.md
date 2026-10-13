# Anuncio D-Code Partners — «D-Code Finance» (versión corporativa)

Duración **56,4 s** · Formatos **9:16 (1080×1920)** y **16:9 (1920×1080)** · 30 fps
Estructura: **EL CAOS → EL PROBLEMA → LA TRANSFORMACIÓN → EL SISTEMA → INTELIGENCIA → CONTROL → CIERRE**

Versión larga para LinkedIn y web. Hay una segunda pieza, `ad5.html`
(20-25 s, sin locución, recorte directo para redes), pensada para
reutilizar exactamente el mismo concepto — ver **[GUION-5.md](GUION-5.md)**.

**Fuente de la verdad.** Todo el contenido de producto —KPIs, módulos,
preguntas del asistente, formato de sus respuestas, paleta— sale del
repositorio `diegoydimitry-ctrl/dcode-finance`, no de una idea genérica de
"software de facturación". En concreto:

- `docs/DISENO.md`: la paleta se **adopta**, no se "inspira", de
  `assets/css/styles.css` de esta misma web — mismos fondos, tinta y
  azul/cian/violeta, verificados con ratios de contraste AA reales.
- El dashboard real tiene tres KPI hero: **Cobrado**, **Pendiente de
  cobro**, **Vencido** (verde/ámbar/rojo) — no "ingresos/gastos" genéricos.
- «Pregunta a Finanzas» **no es un modelo de lenguaje**: es una capa
  determinista sobre los datos reales de cada cuenta. Comentario textual
  del propio código: *"un modelo que se equivoca en un importe sobre la
  contabilidad de alguien es peor que uno que dice 'no lo sé'"*. Cada
  respuesta lleva cifra + fuente citada — es el argumento de venta central
  de la escena 5, no un adorno visual.
- El umbral "por debajo del 15 % de margen" de la escena 6 es el real —
  la lógica de rentabilidad de proyectos del producto solo lista los que
  pierden o quedan por debajo de esa cifra.

**Restricción de honestidad.** El producto está verificado en local (843
pruebas en verde, `docs/PRODUCT-MASTER-PLAN.md`) pero sin despliegue
público: la demo funciona pero está bloqueada por la protección SSO de
Vercel (`docs/DEMO_PUBLICA.md`), no hay production todavía. El cierre no
promete disponibilidad — dice **"Muy pronto, para nuestros clientes"**,
igual que el teaser de DCode OS (`ad3.html`). Todos los importes en
pantalla son de la cuenta DEMO y llevan su chip visible; nunca se
presentan como datos de un cliente real.

---

## 1. Escaleta y tiempos

| # | Escena | Entrada | Salida | En pantalla |
|---|--------|---------|--------|-------------|
| 1 | El caos | 0,0 | 4,0 | Fragmentos de factura/hoja de cálculo/correo dispersos · ¿SABES REALMENTE QUÉ ESTÁ PASANDO CON EL DINERO DE TU EMPRESA? |
| 2 | El problema | 4,0 | 13,6 | FACTURAS · COBROS · GASTOS · PRESUPUESTOS · CLIENTES · PROYECTOS, dispersos · TODO PARECE SEPARADO. |
| 3 | La transformación | 13,6 | 21,0 | Las seis etiquetas convergen · D-CODE FINANCE · Todo el dinero de tu empresa, explicado. |
| 4 | El sistema | 21,0 | 31,85 | Panel financiero · Cobrado/Pendiente de cobro/Vencido · cascada de módulos · TODA TU INFORMACIÓN FINANCIERA. EN UN SOLO LUGAR. |
| 5 | Inteligencia | 31,85 | 39,3 | Pregunta a Finanzas · «¿Cuánto tenemos pendiente de cobrar?» · respuesta con cifra + fuente · ASISTENTE DETERMINISTA. NUNCA INVENTA CIFRAS. |
| 6 | Control | 39,3 | 45,9 | Evolución 12 meses · Rentabilidad de proyectos · MENOS TIEMPO BUSCANDO INFORMACIÓN. → MÁS TIEMPO TOMANDO DECISIONES. |
| 7 | Cierre | 45,9 | 56,4 | D-CODE FINANCE · Todo el dinero de tu empresa, explicado. · CENTRALIZA · CONTROLA · ENTIENDE · DECIDE · MUY PRONTO, PARA NUESTROS CLIENTES · dcodepartners.com |

---

## 2. Voz en off — guion y entradas

Voz masculina, español de España, tono profesional, seguro y tranquilo —
el mismo registro que el anuncio 1 (`GUION.md`), no publicitario. Probada
con Kokoro local, voz `em_alex` (ver `PRUEBA-KOKORO.md`).

| Entrada | Salida | Texto |
|---------|--------|-------|
| 0,60 | 3,35 | En una empresa, el dinero se mueve constantemente. |
| 3,75 | 6,85 | Facturas. Cobros. Gastos. Presupuestos. Proyectos. |
| 7,20 | 12,85 | Pero cuando la información está dispersa, entender lo que realmente está pasando se vuelve mucho más difícil. |
| 13,40 | 15,35 | Por eso hemos creado D-Code Finance. |
| 15,75 | 20,55 | Un sistema financiero diseñado para conectar la información de tu empresa en un solo lugar. |
| 21,00 | 27,35 | Visualiza tus facturas. Controla tus cobros. Analiza tus gastos. Gestiona presupuestos, clientes, proveedores y proyectos. |
| 28,15 | 31,45 | Y cuando necesites entender algo, simplemente pregunta. |
| 31,85 | 39,20 | D-Code Finance convierte tus datos en información clara, calculada siempre sobre cifras reales, para tomar mejores decisiones. |
| 39,30 | 41,35 | Menos tiempo buscando información. |
| 41,75 | 44,50 | Más claridad. Más control. Mejores decisiones. |
| 45,20 | 46,35 | D-Code Finance. |
| 46,75 | 49,05 | Todo el dinero de tu empresa, explicado. |

Indicaciones de interpretación:

- **0,60** — constatación tranquila, no una advertencia.
- **21,00 → 27,35** — esta línea nombra los módulos en el mismo orden en
  que aparecen en pantalla (facturas → cobros → gastos → presupuestos →
  clientes → proveedores → proyectos); si se retoca el texto, hay que
  volver a sincronizar `MODULES4` en `ad4.html`.
- **31,85 → 39,20** — es la línea que sostiene el argumento honesto de
  venta ("calculada siempre sobre cifras reales"); no acortarla a un
  eslogan vacío.
- **46,75** — cerrar en voz baja, igual que el anuncio 1.

Adaptado del guion original del cliente con dos únicos cambios de fondo:
la línea del asistente incorpora "calculada siempre sobre cifras reales"
(el diferencial real del producto, no estaba en el borrador) y el cierre
en pantalla añade el aviso de disponibilidad, que no formaba parte de la
locución.

---

## 3. Identidad visual

Misma paleta que `ad3.html` (DCode OS) y que `dcode-finance/docs/DISENO.md`
confirma idéntica a esta web: superficies `#06080d` → `#1b2542`, azul de
marca `#5b8cff`, cian para dato/producto `#43e0ff`, éxito `#34e7a4`, aviso
`#ffb454`, crítico `#ff6b6b`, demo/violeta `#9b6bff`. Mismas tres familias
tipográficas (Space Grotesk, Inter, JetBrains Mono).

---

## 4. Banda sonora (`audio4.py`)

Tono cinemático-corporativo: arranca casi en silencio bajo el caos de la
escena 1, crece con cada escena y dos golpes de intensidad claros —el
"flash" de conexión en la escena 3 y la resolución de la escena 6— antes
de abrirse en el cierre. Deja los huecos de la tabla de voz atenuados
(ducking), igual que `audio.py`/`audio2.py`.

```bash
python3 audio4.py out/banda-sonora-4.wav
```

---

## 5. Cómo se genera

```bash
python3 audio4.py out/banda-sonora-4.wav
node render.js --src ad4.html --fmt 9x16 --dur 56.4 --audio out/banda-sonora-4.wav --workers 4
node render.js --src ad4.html --fmt 16x9 --dur 56.4 --audio out/banda-sonora-4.wav --workers 4

# locución (Kokoro local, voz masculina em_alex)
python3 tools/generar-locucion-kokoro.py --anuncio 4 --voz em_alex --speed 1.1 --out voces/anuncio-4
python3 montar-voz.py --anuncio 4 --voces voces/anuncio-4 --fmt 9x16
python3 montar-voz.py --anuncio 4 --voces voces/anuncio-4 --fmt 16x9
```

Mismo motor que el resto: `render(t)` puro y determinista, corte entre
escenas por `cutOffsetX()` (cut-the-curve), codificación por segmentos en
paralelo.
