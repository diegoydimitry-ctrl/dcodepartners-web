# Publicación · textos y ficheros preparados (28/09/2026)

Todo está listo para subir. **No se ha publicado nada**: publicar lo hace Dirección desde sus cuentas.

- Los textos solo dicen lo que dicen los vídeos. No se ha inventado ninguna cifra ni promesa nueva.
- Instagram: **@d_codepartners**.
- Web: **dcodepartners.com**.
- Correo para candidatos: **dcodedepartment@gmail.com**, el que sale en el vídeo.

---

## 1 · COMERCIALES (Instagram Reels / Stories · 9:16 · 39,5 s)

**Fichero:** `v2-vendedores/entrega/dcode-comerciales-v6-9x16.mp4`, con los subtítulos `…-v6-9x16.srt`.
- Instagram genera sus propios subtítulos. Este .srt es por si se sube a otra red o se quieren revisar.
- El texto clave ya está en pantalla.

**Texto del post:**
> Buscamos comerciales en toda España. 🇪🇸
> Sin estudios. Sin experiencia.
> Tú encuentras al cliente; nosotros construimos la solución: automatización e inteligencia artificial para empresas.
> Y te llevas el 50 % de cada venta.
>
> ¿Te interesa? Escríbenos por mensaje directo o a dcodedepartment@gmail.com y te lo contamos.
>
> #empleo #comerciales #ventas #trabajoremoto #inteligenciaartificial #automatizacion #españa

**Portada sugerida:** el fotograma 0 (BUSCAMOS COMERCIALES + 50 %). El mensaje entero se lee en la miniatura.

**Pendiente de decidir (negocio):** el 50 % es la cifra de este encargo («aproximadamente el 50 % de la venta en comisiones»). Si las condiciones del contrato comercial tienen matices (sobre qué importe, cuándo se cobra), el post y las respuestas a candidatos deben decirlos igual. Eso no se ha inventado aquí.

## 2 · RUIDO (YouTube · 16:9 · 44,6 s)

**Fichero:** `v1-youtube/entrega/dcode-ruido-youtube-16x9.mp4`, con los subtítulos `…-16x9.srt` (subir en YouTube Studio › Subtítulos).

**Título:** Hay un trabajo en tu empresa que nadie ve · D-Code Partners

**Descripción:**
> Copiar, pegar, responder, buscar. Datos copiados a mano. Herramientas que no se hablan. Eso no es trabajo: es ruido.
> En D-Code Partners convertimos ese trabajo invisible en sistemas: automatización e inteligencia artificial para empresas.
>
> Más en https://dcodepartners.com

## 3 · EN AUTOMÁTICO (mini · 16:9 · 7,4 s)

**Fichero:** `v3-mini/entrega/dcode-en-automatico-v2-youtube-16x9.mp4`, con `…-v2-youtube-16x9.srt`.

- **Uso:** pieza corta para YouTube (vídeo o anuncio *in-stream*).
- **Anuncio *bumper*:** YouTube los limita a 6 s, así que esta pieza **no entra** en ese formato. Si se quiere usar como *bumper*, se puede sacar una versión de 6 s acortando la cola final. Es un cambio de montaje y no se ha hecho sin pedirlo.

**Título:** ¿Sigues haciendo esto a mano? · D-Code Partners

**Descripción:**
> Tu empresa, en automático. Automatización e IA para empresas.
> https://dcodepartners.com

---

## Comprobado en los ficheros (MEDIDO)

| Vídeo | Formato | Sonoridad | Pico real | Voz entendida sobre la mezcla (Whisper) |
|---|---|---|---|---|
| COMERCIALES v6 | 1080×1920, 30 fps, 39,5 s | −14,0 LUFS | −1,4 dBTP | 11 de 12 frases al 0 %. «¿Experiencia?» sale transcrita «espereencia». La voz sola se transcribe bien, y la voz está 21 LU por encima del fondo en esa frase. **HIPÓTESIS:** es la pronunciación coloquial castellana de /ks/ ante consonante («esperiencia»), no un fallo de mezcla. |
| EN AUTOMÁTICO v2 | 1920×1080, 30 fps, 7,4 s | −14,2 LUFS | −1,5 dBTP | 3 de 3 frases al 0 % |
| RUIDO v4 | 1920×1080, 30 fps, 44,6 s | −14,3 LUFS | −1,4 dBTP | sin cambios desde la v4 |

Los .srt se han validado leyéndolos con ffmpeg: 12, 3 y 18 subtítulos, sin solaparse.
