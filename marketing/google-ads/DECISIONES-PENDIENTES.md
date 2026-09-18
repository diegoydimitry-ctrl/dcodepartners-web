# Decisiones humanas pendientes (Fase 0 Google Ads)

Todo está preparado para que cada decisión sea un cambio pequeño. No se ha inventado ninguna regla de negocio.

| # | Decisión | Por qué importa | Dónde se aplica cuando se decida |
|---|---|---|---|
| 1 | ¿El diagnóstico de 30 min es **gratuito**? | Varios anuncios y enlaces del estudio lo decían; la web no lo publica. Hoy están BLOQUEADOS. | `07_anuncios_borrador.csv` → regenerar `campana/`; FAQ en `landings/contenido.mjs` |
| 2 | ¿Se ofrece **prueba de 30 días sin factura** (Modelo 3) en anuncios? | Notion lo da como modelo principal; la web dice «condiciones caso a caso». Hoy BLOQUEADO. | Anuncios + sección «Cómo trabajamos» |
| 3 | **Precios**: reconciliar PRICING OFICIAL (niveles Starter/Pro/Premium, 19/08) con los criterios del 18/09 (sin paquetes) | Sin esto no se publica ningún precio ni «desde». | Anuncios y, si se quiere, landings |
| 4 | ¿Una **llamada** o un **WhatsApp** cuentan como lead? | Regla actual: lead = solo formulario web. WhatsApp no existe hoy (botón preparado, `config.js → whatsapp: null`). | `config.js` + conversión de llamadas |
| 5 | **Aplicar la migración aditiva** de Airtable (37 columnas + 5 en Propuestas) | Sin ella, en modo `airtable` Production fallaría al escribir columnas que no existen. | `airtable/MIGRACION-LEADS.md` |
| 6 | **Aplicar la guarda de n8n** en el Generador de Propuestas | Hoy no hay disparo automático (CRM Inteligente inactivo), pero la guarda lo asegura. | `n8n/README.md` |
| 7 | **Token de Airtable** y variables de entorno en Vercel (Preview → base de PRUEBAS) | Hasta entonces el Preview funciona en `dryrun`: valida todo pero no guarda. | `SEGURIDAD.md` |
| 8 | ¿Activar la **lectura de la web del lead** para la ficha (`ADS_FICHA_LEER_WEB=1`)? | Añade evidencia (título, descripción) pero hace una petición a su web. | Variable de entorno |
| 9 | **Recordatorio comercial** activo | CM/Recordatorio Comercial figura INACTIVO en n8n (13/09). La landing GA2 promete «aviso si no hay respuesta». | Activarlo o quitar esa frase |
| 10 | ¿**SEO IA** se ofrece? | MK/SEO IA figura INACTIVO en n8n (13/09); la landing lo nombra en «Qué más se puede automatizar». | `landings/contenido.mjs` |
| 11 | Mover la conversión principal de «formulario» a «reunión celebrada» | Solo cuando haya volumen (~30/mes); antes el Smart Bidding no aprende. | Google Ads |
| 12 | Base de la rama | La rama sale de `abe4cde` (rama de diseño `diseno/dcode-design-system`, aún no fusionada). Si se fusiona antes el diseño, esta rama entra limpia; si no, hay que rebasarla sobre `main`. | Git |
| 13 | Retirar o conservar el proyecto de Vercel `dcode-ads-fase0-preview` (preview aislado creado para probar) | No toca la web; se puede borrar sin efectos. | Vercel |
| 14 | Dónde vive el panel | Hoy es un HTML local (`panel/panel.html`). Llevarlo a la Partners App (solo lectura) es un trabajo posterior. | Partners App |
