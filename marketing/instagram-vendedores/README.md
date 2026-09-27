# Anuncio de Instagram · captación de vendedores

Pieza para captar personas que vendan D-Code Partners. No es un anuncio de empleo: cuenta la oportunidad.

## Lo que se entrega

| Fichero | Formato | Dónde va |
|---|---|---|
| `out/dcode-vendedores-9x16.mp4` | 1080×1920 · 24,000 s · 30 fps · 720 fotogramas | Reels y Stories |
| `out/dcode-vendedores-4x5.mp4` | 1080×1350 · 24,000 s · 30 fps · 720 fotogramas | Feed |

Los dos: H.264 High, AAC-LC 48 kHz estéreo, −13,9 LUFS integrado y −1,0 dBFS de pico real (objetivo −14 LUFS,
que es lo que Instagram deja pasar sin volver a tocar el volumen).

**No hay versión 1:1.** El texto ocupa de y=280 a y=1470 del vertical: 1190 px. En 1080 de alto no cabe, y el
recorte partía el titular por la mitad. El formato alto del feed (4:5) lo contiene entero con margen.

## El montaje (revisión 2)

| Tramo | Segundos | Qué dice |
|---|---|---|
| **La oferta** | **0 – 3,7** | **Vende sistemas de IA y automatización a empresas. 50 % de cada venta, para ti.** Y tres hechos: tú vendes y nosotros construimos · vendes desde donde estés · no necesitas saber de IA ni programar |
| Por qué se vende solo | 3,7 – 7 | Las empresas que conoces pierden horas aquí — ocho tareas concretas, cada una en su ventana |
| Qué vendes | 7 – 13,3 | No una herramienta suelta: automatizaciones, agentes de IA, integraciones y software propio |
| La relación | 13,3 – 18,2 | Tú abres la conversación · nosotros construimos e implantamos · el cliente paga al ver resultados |
| La cifra, otra vez | 18,1 – 21,7 | **50 %** de cada venta, en comisión. Vendes desde donde estés |
| Cierre | 21,6 – 24 | Quién encaja · zonas desde las que ya se vende · dcodepartners.com |

### Qué cambió respecto a la primera versión, y por qué

**La oferta va primero.** Antes el anuncio abría por el problema y la comisión no llegaba hasta el segundo 19:
quien pasaba de largo en los tres primeros segundos no llegaba a saber de qué iba. Ahora en el primer segundo ya
se lee qué se vende y cuánto se lleva quien lo venda; el problema viene después, como argumento de por qué se
vende solo. La cifra aparece **dos veces**: como oferta al abrir y como remate al cerrar.

**Los recuadros llevan información.** Las ventanas del tramo del problema eran cajas oscuras con barras sin
significado. Ahora cada una dice una tarea concreta y reconocible —copiar pedidos al sistema, contestar el mismo
email, pasar facturas a mano, buscar un dato que ya existe, cuadrar las horas del equipo, rehacer el mismo
informe, repasar albaranes uno a uno, volver a pedir los mismos papeles— con un «otra vez» que late debajo. Es
lo que esa persona va a oír en las empresas que visite: le sirve de guion.

## Lo que la pieza afirma, y de dónde sale

Nada se ha inventado. Cada afirmación tiene origen:

- **50 % de cada venta en comisión** — condición dada en el encargo.
- **«El cliente paga al ver resultados · un mes de servicio real antes de facturar»** — es el modelo sin riesgo
  de D-Code, no una promesa nueva.
- **«Ya se vende desde Madrid, Málaga y Asturias»** — zonas en las que ya hay actividad comercial. No aparece
  el nombre de nadie: en publicidad no se exponen datos personales del equipo.
- **«No necesitas saber de IA ni programar»** — es la frase del anuncio de YouTube, no una promesa nueva.
- **Las ocho tareas del tramo del problema** son trabajo administrativo corriente, no datos de ningún cliente.
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
