# Kizás Lounge — web demo (propuesta de D-Code Partners)

Demo comercial de una web nueva para **Kizás Lounge** (C.C. TresAguas, Alcorcón).
No es la web oficial del local: está marcada como propuesta en la cabecera y en el pie,
y lleva `noindex` (meta + cabecera `X-Robots-Tag` + `robots.txt`) para que Google no la indexe.

## Estructura
- `index.html` — página única (HTML + CSS + JS sin dependencias ni build).
- `assets/` — logo, favicon, imagen OG, vídeo de humo de la portada, fotos y fuentes (`assets/fuentes`, licencia SIL OFL).
- `vercel.json` — cabeceras de seguridad (CSP, nosniff, frame-ancestors), caché de assets y noindex.

Sin build: se despliega tal cual en Vercel, Netlify, Cloudflare Pages o cualquier hosting estático.

## Datos (todos verificados en fuentes públicas del local, 08/10/2026)
- Carta y precios: carta digital oficial https://cartakizaslounge.netlify.app/ (enlazada desde su Instagram).
- Dirección, teléfono, valoración y horario: ficha de Google Maps e Instagram @kizasloungebar («Lunes a domingo desde las 18:00»).
- Eventos (artistas invitados, flamenco, DJ, Kizzas Night), grupos hasta 100 personas, terraza y transporte: web Canva del local, Instagram y Privateaser.
- Reservas: el local no tiene sistema online; reserva por teléfono (642 33 87 88) y DM de Instagram. La web enlaza a esos canales, no simula un sistema.

## Imágenes
- Cócteles: imágenes oficiales de su carta digital.
- El espacio: fotos públicas del local (Privateaser), recortadas; resolución baja → **sustituir por sesión de fotos real**.
- Vídeo de humo de la portada: el de su web en Canva.
- Cartel «Sabor del mes · Octubre»: su publicación de Instagram (actualizar cada mes).

## Antes de pasar a producción como web oficial
1. Quitar el aviso de demo (`.aviso-demo`, línea legal del pie) y el `noindex` (meta, `vercel.json`, `robots.txt`).
2. Fotos profesionales del local y de la barra; confirmar horario de cierre.
3. Revisión legal de la promoción de cachimbas (Ley 28/2005 de tabaco) y textos de alcohol.
4. Aviso legal, política de privacidad y dominio propio (kizas.es no resuelve hoy).
