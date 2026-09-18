# Diseño del primer experimento — Google Ads D-Code (NO EJECUTAR sin aprobación expresa)

## Objetivo
Aprender, no facturar:
1. ¿Hay demanda de proveedor/problema en Madrid a un CPC asumible?
2. ¿Qué % del gasto va a búsquedas útiles?
3. ¿Convierte la landing con demo y con qué calidad de lead?

## Fase 0 — 0 € (prerrequisitos; todo en rama + Preview de Vercel)
- [ ] Confirmar elegibilidad de la promoción (primer anunciante)
- [ ] 3 landings: /automatizacion-procesos, /automatizacion-seguimiento-comercial, /automatizacion-atencion-clientes
- [ ] Vídeo demo 60–120 s por landing con datos DEMO y subtítulos
- [ ] Página de gracias, campos ocultos (gclid, gbraid, wbraid, utm_*, keyword, landing), CMP + Consent Mode v2
- [ ] Airtable Leads con campos de fuente (ver 08_tracking_spec.md); flujo n8n "Lead Ads" inactivo y probado con envíos de test
- [ ] Revisión privacidad/cookies y texto de condiciones del Modelo 3 en la landing
- [ ] Decisiones de negocio: α, ¿llamada/WhatsApp = lead?, propuestas automáticas off para Ads, precios publicables
- [ ] Crear la cuenta SOLO al terminar lo anterior (ventana de 14 días de la promoción) → Keyword Planner → actualizar 03_keywords_candidatas.csv y 05_modelo_economico.xlsx

## Configuración
| Parámetro | Valor |
|---|---|
| Campañas | 1 Search (+1 marca opcional, presupuesto mínimo) |
| Redes | Solo Búsqueda de Google (sin Display, sin socios de búsqueda) |
| AI Max / recursos automáticos / amplia a nivel de campaña | DESACTIVADOS (verificar tras crear; auto-upgrade sept. 2026) |
| Grupos | GA1 Proveedor · GA2 Seguimiento comercial · GA3 Consultas de clientes (fusionar si KP muestra volumen ~0) |
| Keywords | Exacta y frase, 3–9 por grupo (fase = "Fase 1" en CSV) |
| Negativas | Lista compartida DCODE-BASE (04_keywords_negativas.csv) + revisión cada 2–3 días |
| Geografía | Comunidad de Madrid · opción "Presencia" |
| Horario | L–V 8:00–20:00 |
| Dispositivos | Todos, observar |
| Puja | CPC manual (tope por grupo desde KP) o Maximizar clics con CPC máx. |
| Presupuesto | Tramo 1: 150 € (~10 €/día, ~2 semanas). Tramo 2 solo si pasa puertas. Tramo 3: crédito |
| Anuncios | 2 RSA por grupo (07_anuncios_borrador.csv), sitelinks y callouts compartidos |
| Conversión principal | Formulario enviado (una por clic) |
| Secundarias | Reserva, clic WhatsApp, demo 50 %, llamada ≥ umbral |
| Offline | Lead cualificado, reunión celebrada, cliente (con valor) — CSV semanal |

## Criterios de pausa
- >40 % del coste en términos irrelevantes tras 50 clics → pausar grupo, corregir
- 150 clics y 0 leads → pausar, revisar landing/oferta
- CPC medio del grupo > CPL máx × conversión esperada (≈5 € con supuestos Y) → pausar grupo
- Rechazo de políticas · gasto > tramo aprobado · >50 % spam

## Puertas para el tramo 2
- ≥60 % del gasto en términos útiles · CTR ≥3 % en ≥1 grupo · CPC ≤ tope · ≥1 lead válido (o evidencia cualitativa de que la landing funciona)

## Qué NO tocar
Un cambio cada vez con fecha. No AI Max/PMax/Display/amplia. No mover presupuesto a diario. No juzgar antes de 7 días. No producción, no Finance, no propuestas automáticas.

## Datos a recoger (por grupo y keyword)
Impresiones, clics, CPC, CTR, términos de búsqueda, conversiones, leads válidos, motivo de descarte, sector, tamaño, tiempo a reunión, coste por reunión.

## Diario de cambios
| Fecha | Cambio | Motivo | Quién |
|---|---|---|---|
| | | | |
