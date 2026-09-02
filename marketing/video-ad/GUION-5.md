# Anuncio D-Code Partners — «D-Code Finance» (recorte social)

Duración **22,0 s** · Formatos **9:16 (1080×1920)** y **16:9 (1920×1080)** · 30 fps
Estructura: **EL CAOS → LA REVELACIÓN → EL SISTEMA → INTELIGENCIA → CIERRE**

Recorte directo de **[ad4.html](ad4.html)** (ver **[GUION-4.md](GUION-4.md)**
para la versión completa de 56,4 s) para redes sociales y publicidad de
pago: mismo concepto, mismos activos visuales y misma paleta, sin
locución — solo música y rótulos, siguiendo el mismo criterio que el
teaser de DCode OS (`ad3.html`): un formato corto se lee bien sin voz
porque cada corte lleva su propio mensaje en pantalla, y así funciona
también con el sonido apagado, que es como se consume la mayoría del
vídeo vertical en redes.

Misma restricción de honestidad que el anuncio 4: datos de la cuenta
DEMO, chip visible; el cierre no promete disponibilidad.

---

## 1. Escaleta y tiempos

| # | Escena | Entrada | Salida | En pantalla |
|---|--------|---------|--------|-------------|
| 1 | El caos | 0,0 | 3,2 | Fragmentos de factura dispersos · ¿SABES QUÉ ESTÁ PASANDO CON EL DINERO DE TU EMPRESA? |
| 2 | La revelación | 3,2 | 7,0 | D-CODE FINANCE · Todo el dinero de tu empresa, explicado. |
| 3 | El sistema | 7,0 | 13,2 | Panel financiero · Cobrado/Pendiente de cobro/Vencido · Facturas · Cobros · Gastos · Presupuestos · Proyectos · TODA TU INFORMACIÓN FINANCIERA. EN UN SOLO LUGAR. |
| 4 | Inteligencia | 13,2 | 18,2 | Pregunta a Finanzas · «¿Cuánto tenemos pendiente de cobrar?» · Tenéis 6.150 € pendientes de cobrar, repartidos en 4 facturas. · ASISTENTE DETERMINISTA. NUNCA INVENTA CIFRAS. |
| 5 | Cierre | 18,2 | 22,0 | D-CODE FINANCE · Todo el dinero de tu empresa, explicado. · MUY PRONTO, PARA NUESTROS CLIENTES · dcodepartners.com |

Sin tabla de voz — pieza sin locución.

---

## 2. Banda sonora (`audio5.py`)

Mismo carácter cinemático-corporativo que `audio4.py`, condensado a las
cinco escenas de esta pieza y sin ducking (no hay voz que dejar pasar):
cada corte de escena coincide con un golpe de percusión o una campana
para que el ritmo se lea aunque se vea sin sonido.

```bash
python3 audio5.py out/banda-sonora-5.wav
```

---

## 3. Cómo se genera

```bash
python3 audio5.py out/banda-sonora-5.wav
node render.js --src ad5.html --fmt 9x16 --dur 22 --audio out/banda-sonora-5.wav --workers 4
node render.js --src ad5.html --fmt 16x9 --dur 22 --audio out/banda-sonora-5.wav --workers 4
```

Mismo motor que el resto: `render(t)` puro y determinista, corte entre
escenas por `cutOffsetX()` (cut-the-curve).
