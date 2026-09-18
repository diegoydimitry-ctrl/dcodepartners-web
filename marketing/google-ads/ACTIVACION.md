# Día de activación de Google Ads — lista exacta (NADA de esto está hecho)

> Estado a 18/09/2026: **GOOGLE ADS: NO ACTIVADO · GASTO: 0 € · CUENTA: NO CREADA · PROMOCIÓN: NO CANJEADA.**
> La promoción exige canjear en una cuenta de menos de 14 días y aplicarla en los 14 días siguientes a la primera impresión: **no abrir la cuenta hasta tener todo lo de «Antes» hecho.**

## Antes de abrir la cuenta (decisiones y producción — humano)
- [ ] Decisiones de `DECISIONES-PENDIENTES.md` tomadas (al menos 1–6).
- [ ] Rama `ads/fase-0-google-ads` revisada en su Preview y fusionada (las landings tienen que estar en dcodepartners.com; los anuncios no pueden apuntar a un Preview).
- [ ] Migración aditiva de Airtable aplicada (`airtable/MIGRACION-LEADS.md`).
- [ ] Variables de entorno de Production (`SEGURIDAD.md`), incluido `ADS_LEAD_PRODUCTION_ENABLED=1`.
- [ ] Prueba real en producción con un lead «TEST» → aparece en Leads con Fuente, UTM y ficha → se borra.
- [ ] CookieYes: «Google Consent Mode» activado en su panel y la categoría «Publicidad» visible en el banner.
- [ ] Guarda de n8n aplicada (`n8n/README.md`).
- [ ] Comprobar que CM/Recordatorio Comercial está activo si se van a usar anuncios del GA2 que hablan de recordatorio (`demos/AFIRMACIONES.md`).

## En Google Ads (humano, en este orden)
1. **Crear la cuenta** con el email de empresa. Modo experto; saltar la campaña guiada («Cambiar a modo experto» / crear cuenta sin campaña).
2. **Comprobar elegibilidad** de la promoción: primera cuenta de la empresa, dirección de facturación en España.
3. **Comprobar el gasto mínimo REAL** en el texto de la oferta y en *Facturación → Promociones* (el importe oficial no está publicado; terceros dicen «gasta 400 € → 400 €»). Anotarlo en `estudio/05_modelo_economico.xlsx → Oferta400!B3`.
4. **Cargar facturación** (perfil de pagos + método de pago; es requisito de la promoción). Decisión humana.
5. **Keyword Planner**: volumen y CPC de las 14 keywords de `campana/mapa-keyword-grupo-anuncio-landing-demo.csv` para Comunidad de Madrid y para España. Pegar en `03_keywords_candidatas.csv` (columnas volumen_mensual y cpc_estimado) y en el modelo económico.
6. **Etiqueta de Google**: copiar el ID `AW-…` y la etiqueta de la conversión «formulario» en `assets/ads/config.js` (`googleAdsId`, `conversionFormulario`) → commit → Preview → merge.
7. **Conversiones**:
   - Crear «DCODE - Formulario» (web, categoría «Enviar formulario de cliente potencial», **principal**, una por clic).
   - Crear las 3 offline de `offline-conversions/PROCESO.md` como **secundarias**.
   - Activar conversiones mejoradas para leads (etiqueta de Google).
   - NO importar demo_25/50/90, cta_* ni reserva como principales. Si se importan desde GA4: secundarias.
8. **Verificar conversiones**: Tag Assistant sobre dcodepartners.com/automatizacion-procesos con consentimiento aceptado → enviar un lead TEST → ver la conversión en «Diagnóstico» de la acción. Borrar el lead TEST.
9. **Campaña** (desde Google Ads Editor o a mano, según `campana/`):
   - Una campaña de Búsqueda «DCODE Search Fase1 Madrid». Solo Red de Búsqueda (sin Display, sin socios).
   - Ubicación: Comunidad de Madrid, opción **Presencia**. Idioma: español.
   - Horario L–V 8:00–20:00. Dispositivos: todos.
   - Puja: CPC manual con máximos por grupo (o Maximizar clics con CPC máximo). Presupuesto ≈ 10 €/día (tramo 1: 150 €).
   - Sufijo de URL final: `utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={adgroupid}&utm_term={keyword}&mt={matchtype}&dev={device}`. Etiquetado automático activado.
10. **Revisar AI Max**: desactivado. Sin concordancia amplia a nivel de campaña. Sin recursos creados automáticamente. Sin expansión de URL final. (Desde septiembre de 2026 Google los activa solo en ciertas configuraciones: revisarlo tras crear la campaña.)
11. **Cargar keywords**: `campana/editor/keywords.csv` (exacta y frase; **ninguna amplia**).
12. **Cargar negativas**: lista compartida `DCODE-BASE` desde `campana/editor/negativas-DCODE-BASE.csv` y aplicarla a la campaña.
13. **Cargar anuncios**: `campana/editor/anuncios-rsa.csv` variante A (solo LISTO) o B (con CONDICIONADO, ya válidos si las landings están en producción). Ningún texto BLOQUEADO (`campana/anuncios-estado.csv`). Enlaces de sitio y textos destacados solo los LISTO.
14. **Revisión final**: todo en PAUSADO; URLs finales = las 3 landings; Diagnóstico de la campaña sin avisos de política.
15. **Lanzar** (decisión humana): activar la campaña.
16. **Cada 2–3 días**: informe de términos de búsqueda → añadir negativas; comprobar criterios de pausa de `estudio/06_diseno_experimento.md`; anotar cambios en el diario.
17. **Cada lunes**: exportar conversiones offline (`offline-conversions/PROCESO.md`) y actualizar el panel (`panel/panel.html`).
