# Especificación de tracking — Google Ads → D-Code

## 1. URL
- Etiquetado automático: ON (gclid)
- Sufijo URL final: `utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={adgroupid}&utm_term={keyword}&mt={matchtype}&dev={device}`

## 2. Captura (landing)
Script: al cargar, si hay consentimiento, guardar gclid/gbraid/wbraid/utm_*/mt/dev + landing + timestamp en first-party storage (90 días) y rellenar campos ocultos del formulario. Sin consentimiento: solo utm en el propio envío (no persistir).

## 3. Registro Lead (Airtable · tabla Leads)
| Campo | Tipo | Origen |
|---|---|---|
| lead_id | autonumérico | Airtable |
| created_at | fecha-hora | n8n |
| nombre, empresa, web, email, telefono | texto | formulario |
| sector_declarado | select | formulario |
| empleados_rango | select | formulario |
| necesidad_texto | texto largo | formulario |
| sector_inferido, producto_sugerido | texto | n8n + IA, marcado INFERENCIA |
| fuente, medio, campana_id, grupo_id, keyword, matchtype, device | texto | campos ocultos |
| gclid, gbraid, wbraid | texto | campos ocultos |
| landing_url | url | campo oculto |
| consentimiento_privacidad (texto + timestamp) | texto/fecha | formulario |
| estado | select: nuevo/cualificado/descartado/reunión_programada/reunión_celebrada/propuesta/prueba/cliente/perdido | humano/n8n |
| motivo_descarte | select: spam/estudiante/empleo/software_barato/fuera_zona/sin_presupuesto/otro | humano |
| score | número | IA borrador + humano |
| proxima_accion, proxima_accion_fecha, responsable | texto/fecha | humano |
| reunion_fecha, propuesta_id, importe_impl, importe_mensual | — | App |
| horas_impl_reales | número | registro de horas |
| fecha_cliente, conv_enviadas_google (multi) | fecha/multi | n8n |

## 4. Flujo n8n "Lead Ads" (inactivo hasta aprobación)
1. Webhook formulario → validar/antispam → crear Lead
2. Enriquecer (web del lead, sector) con etiquetas HECHO/INFERENCIA
3. Aviso a Diego y Dimitry (Gmail) con resumen
4. Email de confirmación al lead con enlace de reserva (responde a su solicitud)
5. Vigilancia: sin acción 24 h laborables → alerta; sin reserva 48 h → un único recordatorio
6. Reunión programada → informe previo automático
7. Si fuente = google_ads → propuesta como BORRADOR interno, sin envío
8. Semanal: exportar CSV de conversiones offline (Google Click ID, Conversion Name, Conversion Time, Conversion Value, Conversion Currency) para cualificado / reunión_celebrada / cliente

## 5. Acciones de conversión
Principal: Lead formulario (una por clic). Secundarias: reserva, llamada ≥ umbral, WhatsApp clic, demo 50 %. Offline: lead_cualificado, reunion_celebrada, cliente (valor = implantación + mensualidad × meses acordados).

## 6. Panel "Adquisición" (Partners App, solo lectura Airtable + Finance)
Por fuente y por campaña/grupo: gasto (import semanal), clics, CPC, CTR, leads, % válidos, reuniones, propuestas, pruebas, clientes, CPL, coste/reunión, CAC anuncios, CAC completo (horas × 20 € + pruebas fallidas), MRR, contribución. Finance: SOLO LECTURA.

## 7. Seguridad
Sin claves en el repositorio; variables de entorno de preview gestionadas por los responsables; ningún dato de cliente en demos; Google Ads API solo lectura cuando se conecte (decisión futura).
