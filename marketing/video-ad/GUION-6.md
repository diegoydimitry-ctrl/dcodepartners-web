# Anuncio D-Code Partners — «El scroll que no para en ti»

Duración **27,0 s** · Formato **9:16 (1080×1920)**, adaptable a 16:9 (1920×1080) · 30 fps
Servicio anunciado: **redes sociales y páginas web para negocios locales**
(restaurantes, peluquerías, gimnasios, clínicas, comercio, profesionales
independientes).

**Nota sobre el servicio.** El FAQ público de dcodepartners.com dice hoy que
la gestión de redes sociales se hace "mediante automatización con IA, no
como creación de contenido manual" — no hay todavía una página de servicio
para este público (negocio local) ni un portafolio de proyectos reales en
este sector. Este anuncio asume la ampliación de servicio tal y como se
describió al encargarlo; en cuanto exista, conviene actualizar el FAQ y
crear una página de servicio para que la web no contradiga al anuncio.

---

## 1. Concepto y hooks explorados

**Elegido — "El scroll que no para en ti".** Un pulgar busca un negocio,
entra en un perfil descuidado, se va al siguiente sin pensarlo — nada se
explica, se ve. Cierra con el mismo gesto de apertura, esta vez sin
rechazo: el pulgar se queda. Se construye entero con mockups de interfaz
(teléfono, grid, navegador), sin necesitar actores ni localizaciones.

**Alternativas descartadas:**
- *"El candado invisible"* — un enlace roto en una bio. Es un gesto, no
  una historia completa, así que no es el hook principal — pero sí da
  suficiente de sí para una **variante B** del gancho que probar en A/B
  (ver § 7): `ad6.html?variant=b` sustituye solo la escena 1 (0,0–3,6 s)
  por un plano macro directo sobre la bio — más íntimo, más rápido de
  leer — y deja el resto del anuncio (escenas 2–6) exactamente igual,
  incluida la voz. Export ya generado: `out/dcode-ad6b-9x16-vo.mp4`.
- *"La vitrina que nadie ve"* — persiana bajando al anochecer + móvil
  encendido en la oscuridad. Más cinematográfico, pero depende de un plano
  de calle real que hoy no se puede generar de forma creíble. Queda
  anotado como posible variante si hay grabación propia (ver § 5).

---

## 2. Escaleta y tiempos

| # | Escena | Entrada | Salida | Qué se ve |
|---|--------|---------|--------|-----------|
| 1 | El scroll | 0,0 | 3,6 | Macro de móvil: busca "peluquería cerca de ti", entra en un perfil con grid inconsistente, duda, se va |
| 2 | El detalle | 3,6 | 9,0 | Planos detalle del perfil abandonado: grid sin criterio, enlace roto, web que no carga |
| 3 | El giro | 9,0 | 15,0 | El mismo grid se reorganiza; la web carga limpia; aparece "La misma empresa. Mejor contada." |
| 4 | El servicio | 15,0 | 21,0 | Calendario de publicaciones, scroll por la web nueva, paleta del grid = paleta de la web ("Coherencia visual") |
| 5 | El bucle | 21,0 | 24,0 | Mismo encuadre que la escena 1: el pulgar entra en este negocio y esta vez no se va |
| 6 | Marca | 24,0 | 27,0 | D-Code Partners · "Redes sociales y páginas web para negocios." · CTA · dcodepartners.com |

---

## 3. Voz en off — guion y entradas

Dos frases únicamente — el resto lo llevan la imagen y la música. Voz
generada con Kokoro local (`em_alex`, la misma voz masculina ya validada
en el anuncio 1 y en D-Code Finance); se intentó primero con ElevenLabs
pero la cuenta conectada no tenía crédito disponible.

| Entrada | Salida | Texto |
|---------|--------|-------|
| 4,70 | 8,50 | Tu negocio puede ser excelente. Pero por fuera, no siempre se nota. |
| 9,30 | 12,90 | A veces el problema no es el negocio. Es cómo se ve desde fuera. |

Interpretación: observacional, sin énfasis publicitario — es una
constatación, no una advertencia ni una venta.

---

## 4. Identidad visual

Paleta **nueva**, deliberadamente distinta del resto del sistema D-Code
(que usa azul marino + cian): aquí es blanco, negro y grises, con el azul
de marca (`#5b8cff`) reservado a un único acento — el enlace que funciona
en la escena 3 y 5, la línea de la escena 4, el CTA del cierre. Nunca un
fondo, nunca decorativo. Grano de película sutil y viñeta para que se
sienta cine, no dashboard de producto.

---

## 5. Producción real — lo que falta

Esta pieza está construida con mockups de interfaz deterministas (mismo
motor `render(t)` que el resto de anuncios) y voz sintética — no hay
actores, localizaciones ni cámara real, porque no existe en este entorno
una herramienta de generación de vídeo fotorrealista, y aunque existiera,
el criterio pedido prioriza grabación real sobre imagen artificial.

**Fotos del grid "después" (`assets/stock-ad6/`).** Generadas con Canva
(`generate-image`), blanco y negro, genéricas de peluquería — no
representan ningún negocio real ni cliente de D-Code. El grid "antes" se
deja sin fotos a propósito: un perfil abandonado no solo está mal
compuesto, tiene poco contenido real que mostrar; meterle fotos ahí
rompería la lectura del problema. Son miniaturas de 200×200 (lo único que
devolvió el generador sin pasar por un diseño de Canva completo) — se leen
bien al tamaño de celda del grid, pero no sirven para ampliar; si se
necesita más resolución, re-generarlas insertándolas primero en un diseño
de Canva y exportando desde ahí.

Para elevar esta pieza de concepto a grabación con presencia real, haría
falta:

1. **Plano de apertura real** — una mano sosteniendo un móvil, el pulgar
   deslizando de verdad sobre una pantalla (se podría componer el mockup
   de ad6.html *dentro* de la pantalla de ese móvil real en postproducción).
2. **Interior de un negocio real** (con permiso) — 3-5 s de un local
   cuidado (peluquería, restaurante, clínica) con luz natural, para un
   plano de contraste tipo Idea B del brief original.
3. **Captura de pantalla de un proyecto real de D-Code** si existe alguno
   ya entregado en este sector, para sustituir "Salón Elvira" (nombre
   conceptual, no un cliente real) por un caso verificable.
4. **Voz humana grabada**, si se prefiere a la síntesis para la pieza
   final — el guion y los tiempos de § 3 ya están listos para doblarse.

---

## 6. Copy para Instagram

> Tu negocio puede ser excelente. Pero si tu Instagram o tu web no lo
> demuestran, el cliente ya se ha ido a mirar otro.
>
> En D-Code Partners nos encargamos de tus redes sociales y de tu página
> web — con una misma identidad, pensadas para que decidan quedarse.
>
> Descubre lo que podemos hacer por tu negocio. Enlace en bio.
>
> #DCodePartners #NegociosLocales #RedesSociales #PáginaWeb #MarketingDigital

---

## 7. Entregables de esta producción

| Archivo | Qué es |
|---------|--------|
| `out/dcode-ad6-9x16-vo.mp4` | Máster vertical, con locución y música |
| `out/dcode-ad6-16x9-vo.mp4` | Máster horizontal, con locución y música |
| `out/dcode-ad6-9x16-cc-vo.mp4` | Igual, con subtítulos incrustados (tipografía de marca) |
| `out/dcode-ad6-16x9-cc-vo.mp4` | Igual, horizontal, con subtítulos |
| `out/dcode-ad6b-9x16-vo.mp4` | Variante B del hook (ver § 1), resto idéntico |
| `out/dcode-ad6-portada-9x16.png` | Portada del Reel |

---

## 8. Cómo se genera

```bash
python3 audio6.py out/banda-sonora-6.wav
node render.js --src ad6.html --fmt 9x16 --dur 27 --audio out/banda-sonora-6.wav --workers 4
node render.js --src ad6.html --fmt 16x9 --dur 27 --audio out/banda-sonora-6.wav --workers 4

python3 tools/generar-locucion-kokoro.py --anuncio 6 --voz em_alex --speed 1.1 --out voces/ad6
python3 montar-voz.py --anuncio 6 --voces voces/ad6 --fmt 9x16
python3 montar-voz.py --anuncio 6 --voces voces/ad6 --fmt 16x9
```

Mismo motor que el resto: `render(t)` puro y determinista, corte entre
escenas por `cutOffsetX()` (cut-the-curve).
