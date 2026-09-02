# Teaser D-Code Partners — «DCode OS»

Duración **18,0 s** · Formatos **9:16 (1080×1920)** y **16:9 (1920×1080)** · 30 fps
Estructura: **PREGUNTA → PROYECTO → ACTIVIDAD → INCIDENCIA → MÓDULOS → CIERRE**

Pieza distinta a `ad.html` y `ad2.html`: no vende un servicio de automatización
en abstracto, presenta un producto concreto — DCode OS, el sistema operativo
interno de D-Code Partners y portal de clientes — con capturas reconstruidas
de su interfaz real, no maquetas genéricas de "dashboard".

**Restricción de honestidad.** DCode OS no está desplegado en ningún sitio a
fecha de este anuncio: es un sistema interno de operaciones y portal de
cliente, no un SaaS público. El vídeo nunca dice "ya disponible" ni lleva un
CTA a un enlace de acceso — cierra con **"Muy pronto, para nuestros
clientes"**. Si el producto se lanza, este teaser deja de ser válido tal cual
y hay que revisar el cierre antes de reutilizarlo.

---

## 1. Escaleta y tiempos

| # | Escena | Entrada | Salida | En pantalla |
|---|--------|---------|--------|-------------|
| 1 | Hook | 0,0 | 1,9 | ¿QUÉ ESTÁ PASANDO AHORA MISMO CON TU PROYECTO? |
| 2 | Proyecto | 1,9 | 5,6 | Tarjeta de proyecto: Empresa Demo S.L. · DEMO · «Automatización de facturación» · EN CURSO · AVANCE · 6 DE 10 TAREAS |
| 3 | Actividad | 5,6 | 9,4 | Feed de actividad en tiempo real (4 entradas) |
| 4 | Incidencia | 9,4 | 12,6 | #2026-114 · «Retraso en la sincronización» · ABIERTA → RESUELTA EL 14 MAR |
| 5 | Módulos | 12,6 | 15,0 | PROYECTOS · TAREAS · INCIDENCIAS · DOCUMENTACIÓN · ACTIVIDAD |
| 6 | Cierre | 15,0 | 18,0 | D-Code OS · «El sistema operativo de D-Code Partners.» · MUY PRONTO, PARA NUESTROS CLIENTES · dcodepartners.com |

No hay locución: 18 s es demasiado corto para un guion hablado con la
cadencia pausada del resto del sistema (ver `PRUEBA-KOKORO.md` sobre por qué
un ritmo de corte rápido no encaja con la voz sintetizada). La pieza se
apoya en rótulos y en la banda sonora de `audio3.py`.

---

## 2. Contenido de cada escena

**Escena 2 — Proyecto** (tarjeta, `panel()`):
- Organización: `EMPRESA DEMO S.L.` con chip `DEMO` (tono violeta)
- Título: `Automatización de facturación`
- Estado: badge `EN CURSO` (tono marca)
- Progreso: `AVANCE · 6 DE 10 TAREAS` + barra
- 3 filas de tarea con `checkDot` (completada/pendiente)
- Rótulo: **TU PROYECTO. EN TIEMPO REAL.**

**Escena 3 — Actividad** (feed, `FEED[]`):

| Evento | Detalle | Cuándo | Tono |
|--------|---------|--------|------|
| Tarea completada | Conectar CRM con WhatsApp | hace 12 min | success |
| Documento añadido | Contrato de servicio firmado | hace 48 min | brand |
| Incidencia resuelta | Retraso en la sincronización | hace 2 h | success |
| Comentario nuevo | Revisión de alcance — Producción | hace 3 h | brand |

Rótulo: **CADA CAMBIO, A LA VISTA.**

**Escena 4 — Incidencia** (`#2026-114`):
Badge `ABIERTA` (crítico) se transforma en `RESUELTA EL 14 MAR` (éxito) a
mitad de escena, con `checkDot` de confirmación. Rótulo: **NADA SE QUEDA EN
EL AIRE.**

**Escena 5 — Módulos** (`MODS[]`): cascada de los cinco módulos del sistema
— Proyectos, Tareas, Incidencias, Documentación, Actividad. Rótulo: **TODO,
EN UN SOLO SITIO.**

**Escena 6 — Cierre**: lockup `D-Code` + badge `OS` (cian, dato/producto),
tagline «El sistema operativo de D-Code Partners.», después «Muy pronto,
para nuestros clientes» en violeta y `dcodepartners.com`.

---

## 3. Identidad visual

Paleta tomada directamente de `dcode-os/app/globals.css` (confirmada
idéntica a `assets/css/styles.css` de la web pública): superficies
`#06080d` → `#1b2542`, azul de marca `#5b8cff`, cian reservado para
dato/producto `#43e0ff`, éxito `#34e7a4`, aviso `#ffb454`, crítico `#ff6b6b`,
demo/violeta `#9b6bff`. Mismas tipografías del sistema (Space Grotesk,
Inter, JetBrains Mono para datos).

---

## 4. Banda sonora (`audio3.py`)

Tono distinto a los otros dos anuncios: sin la escalada de tensión de
`audio.py` ni el vaivén cómico de `audio2.py`. Pulso estable desde el
segundo 1, un tono de confirmación limpio (`bell()`) en cada evento de
interfaz — abrir la tarjeta, cambiar un badge, resolver la incidencia — y un
arpegio ascendente en la cascada de módulos. Breve tensión armónica en la
escena de incidencia (acorde con sexta menor) que se resuelve al pasar a
verde. Cierre con campana de marca y silencio final.

```bash
python3 audio3.py out/banda-sonora-3.wav
```

---

## 5. Cómo se genera

```bash
python3 audio3.py out/banda-sonora-3.wav
node render.js --src ad3.html --fmt 9x16 --dur 18 --audio out/banda-sonora-3.wav --workers 4
node render.js --src ad3.html --fmt 16x9 --dur 18 --audio out/banda-sonora-3.wav --workers 4
```

Mismo motor que `ad.html`/`ad2.html`: `render(t)` puro y determinista, corte
entre escenas por `cutOffsetX()` (cut-the-curve, ver notas de
implementación en `README.md`), codificación por segmentos en paralelo con
`render.js`.
