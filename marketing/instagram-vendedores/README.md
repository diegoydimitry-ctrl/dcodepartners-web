# Anuncio de Instagram · captación de vendedores

Pieza para captar personas que vendan D-Code Partners. No es un anuncio de empleo: cuenta la oportunidad.

## Lo que se entrega

| Fichero | Formato | Dónde va |
|---|---|---|
| `out/dcode-vendedores-9x16.mp4` | 1080×1920 · 24,000 s · 30 fps · 720 fotogramas | Reels y Stories |
| `out/dcode-vendedores-4x5.mp4` | 1080×1350 · 24,000 s · 30 fps · 720 fotogramas | Feed |

Los dos: H.264 High, AAC-LC 48 kHz estéreo, −13,8 LUFS integrado y −1,0 dBFS de pico real (objetivo −14 LUFS,
que es lo que Instagram deja pasar sin volver a tocar el volumen).

**No hay versión 1:1.** El texto ocupa de y=280 a y=1470 del vertical: 1190 px. En 1080 de alto no cabe, y el
recorte partía el titular por la mitad. El formato alto del feed (4:5) lo contiene entero con margen.

## El montaje

| Tramo | Segundos | Qué dice |
|---|---|---|
| Problema | 0 – 4 | Hay empresas perdiendo horas cada día en trabajo que ya no debería hacer nadie |
| Reconocimiento | 4 – 8 | Tú ya las conoces. Nosotros construimos el sistema que se las devuelve |
| Qué vende | 8 – 14 | No una herramienta suelta: automatizaciones, agentes de IA, integraciones y software propio |
| La relación | 14 – 19 | Tú abres la conversación · nosotros construimos e implantamos · el cliente paga al ver resultados |
| La cifra | 19 – 23 | **50 %** de cada venta, en comisión. Vendes desde donde estés |
| Cierre | 23 – 24 | Quién encaja · zonas desde las que ya se vende · dcodepartners.com |

## Lo que la pieza afirma, y de dónde sale

Nada se ha inventado. Cada afirmación tiene origen:

- **50 % de cada venta en comisión** — condición dada en el encargo.
- **«El cliente paga al ver resultados · un mes de servicio real antes de facturar»** — es el modelo sin riesgo
  de D-Code, no una promesa nueva.
- **«Ya se vende desde Madrid, Málaga y Asturias»** — zonas en las que ya hay actividad comercial. No aparece
  el nombre de nadie: en publicidad no se exponen datos personales del equipo.
- **`dcodepartners.com`** — el contacto oficial. No se inventa ningún correo ni teléfono.

Lo que **no** dice, porque no estaba dado: nada sobre exclusividad de zona, ni importes, ni plazos de cobro, ni
número de clientes, ni porcentajes de conversión. Los precios de los productos son los publicados en la web.

## Cómo se regenera

```bash
cd marketing/instagram-vendedores
python3 audio.py out/banda.wav     # banda sonora sintetizada aquí (sin música de terceros)
node render.mjs 0 720              # 720 PNG en frames/ · ~0,3 s por fotograma
./montar.sh                        # normaliza el audio y monta 9:16 y 4:5
```

`render.mjs` es determinista: el mismo fotograma sale siempre igual, así que el trabajo se puede trocear en
varios procesos y concatenar. Para revisar el diseño sin renderizarlo todo:

```bash
node render.mjs --muestras 60,180,340,500,640,716
```

La escena es `escena.html` y sigue el mismo contrato que `marketing/youtube/_build/escena.html`
(`window.META`, `window.LISTO`, `window.pintaFrame(n)`), para poder reutilizar esa cadena de render.

Tipografías: las de la propia web (`assets/fonts/`). Logotipo: el mismo trazado que la cabecera del sitio.
