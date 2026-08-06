# Estrategia de Monetización D-Code Partners

**Documento interno de estrategia comercial y pricing — no publicar en el sitio web.**

Versión 1.0 · Elaborado como marco oficial de precios y monetización de D-Code Partners.
Moneda: EUR. Precios sin IVA (operativa B2B). Todas las cifras son precios de referencia (rack rate) para la fuerza comercial; el descuento máximo autorizado sin escalar a dirección es del 10 % sobre implantación y 0 % sobre mensualidad (la mensualidad es margen recurrente, no se negocia a la baja salvo en volumen — ver §11).

---

## 0. Resumen ejecutivo

D-Code Partners no vende automatizaciones sueltas. Vende **capacidad tecnológica gestionada**: la promesa de marca ya validada en el sitio público ("diagnóstico gratuito → implementación en 30 días → resultados medidos → *entonces* hablamos de precio → si no hay beneficio demostrado, no hay factura") es, de hecho, la mejor arquitectura de pricing psicológico posible: **vende el resultado antes que el precio**. Este documento no contradice esa promesa — la instrumenta. Es el motor de precios que el equipo comercial usa *en la conversación del día 30*, cuando el cliente ya ha visto el ROI y está listo para decidir alcance y compromiso.

El modelo de negocio objetivo es el de una **consultora tecnológica de servicios gestionados (MSP de IA)**, no una agencia de proyectos. Los proyectos (implantaciones) son la puerta de entrada; el ingreso recurrente (mantenimiento, planes SaaS, paquetes departamentales) es el motor de valor de la compañía. Referencias de categoría: el modelo de "managed services + implementation fee" de agencias Salesforce/HubSpot Platinum, el pricing por valor de las Big 4 en transformación digital, y el land-and-expand de infraestructuras SaaS verticales (Toast, ServiceTitan) aplicado a PYME.

Tres cifras gobiernan todo el sistema:

1. **32 servicios** catalogados en 8 departamentos, cada uno con precio de implantación y mensualidad justificados por horas, complejidad, valor de mercado e impacto económico.
2. **7 paquetes departamentales** ("Departamento X IA") que convierten el catálogo en decisiones de compra de alto nivel — el verdadero vehículo de ticket medio alto.
3. **4 planes de mantenimiento tipo SaaS** (Starter/Growth/Scale/Enterprise) que convierten cada cliente en una cuenta recurrente y escalable, independientemente de cuántos servicios tenga activos.

---

## 1. Marco metodológico

Antes de fijar un solo precio, se necesita una vara de medir consistente. Cada uno de los 32 servicios se evalúa en seis ejes:

| Eje | Qué mide | Escala |
|---|---|---|
| **Dificultad técnica** | Complejidad de build: nº de integraciones, uso de IA generativa vs. reglas fijas, gestión de estado, manejo de errores | Baja / Media / Alta / Muy alta |
| **Valor para el cliente** | Cuánto valora el cliente el resultado percibido (no el esfuerzo técnico) | 1–5 |
| **Impacto económico** | Efecto directo en ingresos, costes o riesgo del cliente | 1–5 |
| **Tiempo de desarrollo** | Horas de ingeniería estimadas (diseño + build + testing + documentación) | Rango en horas |
| **Nivel de mantenimiento** | Fragilidad ante cambios de APIs/terceros, necesidad de supervisión de IA, frecuencia de incidencias esperada | Bajo / Medio / Alto |
| **Prioridad comercial** | Cuánto debe empujar el equipo de ventas este servicio como puerta de entrada o upsell | 1–5 |

### 1.1 Bandas de complejidad y precio

En vez de cotizar cada servicio de forma aislada (lo que produce inconsistencias y erosión de precio ante la primera objeción), los 32 servicios se agrupan en **4 bandas**. La banda determina el rango de precio; el ajuste fino dentro de la banda lo determina el impacto económico específico del servicio.

**Principio de fondo: se cotiza por valor, no por hora.** Las horas son el suelo (sanity check de rentabilidad), no el techo. Un cálculo de coste-plus puro (horas × tarifa) es el error clásico de las agencias de automatización de nivel freelance, que se quedan ancladas a las tarifas de Fiverr/Upwork (25–40 €/h) y nunca escalan. D-Code Partners fija precio por el valor que el sistema genera en el cliente, usando las horas solo como referencia de coste interno y como argumento de justificación frente al cliente cuando hace falta.

| Banda | Descripción | Horas típicas | Coste interno (tarifa mixta 85 €/h) | Precio de implantación | Mensualidad |
|---|---|---|---|---|---|
| **A — Básica** | Automatización de utilidad operativa, plantilla replicable, 1–2 integraciones, sin IA generativa o IA mínima | 8–18 h | 680–1.530 € | **1.100 – 1.500 €** | **80 – 120 €** |
| **B — Intermedia** | Lógica de negocio real, IA ligera (clasificación, resumen, scoring), 3–4 integraciones | 20–36 h | 1.700–3.060 € | **2.400 – 3.200 €** | **190 – 240 €** |
| **C — Avanzada** | IA generativa como núcleo, orquestación multi-sistema, toma de decisiones semi-autónoma | 40–70 h | 3.400–5.950 € | **4.200 – 5.800 €** | **320 – 420 €** |
| **D — Estratégica / Core** | Sistema nervioso del negocio del cliente: integra y depende de casi todo lo demás, alto riesgo si falla, alto valor percibido por dirección | 90–140 h | 7.650–11.900 € | **8.500 – 9.500 €** | **650 – 750 €** |

Nótese que el margen sobre coste interno crece con la banda (de ~1,3x en Banda A a ~1,9–2,2x en Banda D). Esto es deliberado y sigue la lógica de pricing por valor de McKinsey/BCG: **cuanto más estratégico es el sistema para el cliente, menos elástico es el precio a la hora** — el cliente no está comprando horas de desarrollo, está comprando el reemplazo de un proceso crítico (o de una futura contratación).

**Benchmark de mercado usado para calibrar las bandas:**
- Freelancers/agencias junior de n8n/Make: 40–70 €/h, proyectos sueltos 500–2.500 €. D-Code se posiciona por encima porque entrega sistemas mantenidos, no scripts.
- Agencias boutique de automatización con IA (EU/US): proyectos de 3.000–15.000 € por sistema, retenedores de 300–1.500 €/mes. D-Code se sitúa en la banda alta de este grupo.
- Consultoras enterprise (Accenture, Deloitte Digital, capítulos de automatización de las Big 4): 150–300 €/h, mínimos de proyecto de 50.000 €+. D-Code no compite aquí de forma directa, pero **usa estas cifras como ancla de conversación** (ver §10) para que sus propios precios parezcan razonables por comparación.
- Mensualidades de gestión de RevOps/MarTech (agencias HubSpot Platinum, agencias de RevOps): 500–3.000 €/mes. Referencia directa para los planes Growth/Scale (§8).

---

## 2. Catálogo completo por departamento

Para cada servicio: dificultad técnica · valor cliente (1-5) · impacto económico (1-5) · tiempo de desarrollo · mantenimiento · prioridad comercial · venta individual.

### Administración

| Servicio | Dificultad | Valor cliente | Impacto económico | Tiempo dev | Mantenimiento | Prioridad comercial | ¿Venta individual? |
|---|---|---|---|---|---|---|---|
| Copias de Seguridad | Baja | 3 | 2 | 10–14 h | Bajo | 2 | **No** — solo en paquete Fundamentos |
| Gestión Documental | Media | 4 | 3 | 25–32 h | Medio | 3 | Opcional (mejor en paquete) |
| Monitorización n8n | Baja-Media | 3 | 2 | 14–18 h | Bajo | 2 | **No** — es la póliza de seguro del propio stack |

### Clientes

| Servicio | Dificultad | Valor cliente | Impacto económico | Tiempo dev | Mantenimiento | Prioridad comercial | ¿Venta individual? |
|---|---|---|---|---|---|---|---|
| Encuestas Automáticas | Baja | 3 | 2 | 10–14 h | Bajo | 2 | Opcional |
| Bienvenida Cliente | Baja | 4 | 3 | 12–16 h | Bajo | 3 | Opcional |
| Renovaciones | Media | 5 | 5 | 24–30 h | Medio | 4 | **Sí** |
| Onboarding Cliente IA | Alta | 5 | 4 | 55–70 h | Medio-Alto | 5 | **Sí** |

### Comercial

| Servicio | Dificultad | Valor cliente | Impacto económico | Tiempo dev | Mantenimiento | Prioridad comercial | ¿Venta individual? |
|---|---|---|---|---|---|---|---|
| Generador de Propuestas IA | Media | 5 | 5 | 28–36 h | Medio | 5 | **Sí** |
| Seguimiento Comercial IA | Media | 4 | 4 | 26–32 h | Medio | 4 | **Sí** |
| CRM Inteligente | Muy alta | 5 | 5 | 100–140 h | Alto | 5 | **Sí — producto ancla** |
| Recordatorio Comercial | Baja | 3 | 3 | 8–12 h | Bajo | 2 | **No** — solo con CRM/Seguimiento |

### Dirección

| Servicio | Dificultad | Valor cliente | Impacto económico | Tiempo dev | Mantenimiento | Prioridad comercial | ¿Venta individual? |
|---|---|---|---|---|---|---|---|
| KPIs Empresa | Alta | 5 | 4 | 45–58 h | Medio | 4 | **Sí** |
| Dashboard Ejecutivo | Alta | 5 | 4 | 55–70 h | Medio-Alto | 5 | **Sí** |
| Informe Diario | Baja | 3 | 2 | 10–14 h | Bajo | 2 | **No** — parte de la suite de informes |
| Informe Semanal | Baja | 3 | 2 | 11–15 h | Bajo | 2 | **No** — parte de la suite de informes |
| Informe Mensual | Media | 4 | 3 | 18–24 h | Medio | 3 | Opcional |

### Finanzas

| Servicio | Dificultad | Valor cliente | Impacto económico | Tiempo dev | Mantenimiento | Prioridad comercial | ¿Venta individual? |
|---|---|---|---|---|---|---|---|
| Facturación IA | Alta | 5 | 5 | 42–55 h | Medio | 5 | **Sí** |
| Control de Gastos | Media | 4 | 4 | 24–30 h | Medio | 3 | **Sí** |
| Cobros Automáticos | Alta | 5 | 5 | 48–62 h | Medio | 5 | **Sí** |
| Recordatorios de Pago | Baja | 3 | 3 | 9–13 h | Bajo | 2 | **No** — solo con Cobros Automáticos |

### Marketing

| Servicio | Dificultad | Valor cliente | Impacto económico | Tiempo dev | Mantenimiento | Prioridad comercial | ¿Venta individual? |
|---|---|---|---|---|---|---|---|
| Captación de Leads | Media | 4 | 4 | 28–34 h | Medio | 4 | **Sí** |
| Lead IA 360 | Muy alta | 5 | 5 | 95–130 h | Alto | 5 | **Sí — producto insignia** |
| Contenido IA para Redes Sociales | Media | 4 | 3 | 26–32 h | Medio | 4 | **Sí** |
| Newsletter IA | Media | 3 | 3 | 22–28 h | Medio | 3 | **Sí** |
| SEO IA | Alta | 4 | 4 | 40–52 h | Medio-Alto | 4 | **Sí** |

### Producción

| Servicio | Dificultad | Valor cliente | Impacto económico | Tiempo dev | Mantenimiento | Prioridad comercial | ¿Venta individual? |
|---|---|---|---|---|---|---|---|
| Seguimiento de Tareas | Baja | 3 | 3 | 12–16 h | Bajo | 2 | Opcional |
| Gestión de Proyectos | Alta | 5 | 4 | 44–56 h | Medio | 4 | **Sí** |
| Asignación Automática | Media | 4 | 4 | 27–33 h | Medio | 3 | **Sí** |
| Control de Entregas | Media | 4 | 3 | 23–29 h | Medio | 3 | **Sí** |

### Soporte

| Servicio | Dificultad | Valor cliente | Impacto económico | Tiempo dev | Mantenimiento | Prioridad comercial | ¿Venta individual? |
|---|---|---|---|---|---|---|---|
| Chat IA Clientes | Alta | 5 | 4 | 46–58 h | Medio-Alto | 5 | **Sí** |
| WhatsApp IA | Alta | 5 | 5 | 50–64 h | Medio-Alto | 5 | **Sí** |
| Tickets IA | Media | 4 | 4 | 30–38 h | Medio | 4 | **Sí** |

---

## 3. Precio de implantación (pago único)

| Servicio | Banda | Precio implantación |
|---|---|---|
| Copias de Seguridad | A | 1.200 € |
| Gestión Documental | B | 2.800 € |
| Monitorización n8n | A | 1.400 € |
| Encuestas Automáticas | A | 1.200 € |
| Bienvenida Cliente | A | 1.500 € |
| Renovaciones | B | 2.600 € |
| Onboarding Cliente IA | C | 5.500 € |
| Generador de Propuestas IA | B | 3.200 € |
| Seguimiento Comercial IA | B | 2.900 € |
| CRM Inteligente | D | 9.500 € |
| Recordatorio Comercial | A | 1.100 € |
| KPIs Empresa | C | 4.800 € |
| Dashboard Ejecutivo | C | 5.800 € |
| Informe Diario | A | 1.300 € |
| Informe Semanal | A | 1.400 € |
| Informe Mensual | B | 2.000 € |
| Facturación IA | C | 4.500 € |
| Control de Gastos | B | 2.700 € |
| Cobros Automáticos | C | 5.200 € |
| Recordatorios de Pago | A | 1.200 € |
| Captación de Leads | B | 3.000 € |
| Lead IA 360 | D | 8.500 € |
| Contenido IA para Redes Sociales | B | 2.800 € |
| Newsletter IA | B | 2.400 € |
| SEO IA | C | 4.200 € |
| Seguimiento de Tareas | A | 1.400 € |
| Gestión de Proyectos | C | 4.600 € |
| Asignación Automática | B | 2.900 € |
| Control de Entregas | B | 2.500 € |
| Chat IA Clientes | C | 4.800 € |
| WhatsApp IA | C | 5.200 € |
| Tickets IA | B | 3.100 € |

**Justificación del método:** cada precio se ancla a horas estimadas × tarifa interna mixta (85 €/h, que combina desarrollo senior de automatización, prompt/IA engineering y QA), con un multiplicador de valor que sube con: (a) impacto económico directo (Facturación IA, Cobros Automáticos, CRM Inteligente, WhatsApp IA cotizan por encima del punto medio de su banda por su ROI directo y medible en caja); (b) irreversibilidad/dependencia (CRM Inteligente y Lead IA 360 cotizan en el techo de su banda porque, una vez implantados, se convierten en el sistema operativo del cliente — sustituirlos tiene un coste de cambio altísimo, lo cual justifica un precio de entrada más alto: es una decisión de plataforma, no de herramienta); y (c) escasez de competencia cualificada (pocos proveedores en España combinan n8n/Make + IA generativa + integraciones financieras con el nivel de fiabilidad que exige Cobros Automáticos o Facturación IA).

---

## 4. Precio mensual (mantenimiento, mejoras, soporte, monitorización)

| Servicio | Mensualidad |
|---|---|
| Copias de Seguridad | 90 € |
| Gestión Documental | 220 € |
| Monitorización n8n | 110 € |
| Encuestas Automáticas | 90 € |
| Bienvenida Cliente | 100 € |
| Renovaciones | 200 € |
| Onboarding Cliente IA | 380 € |
| Generador de Propuestas IA | 240 € |
| Seguimiento Comercial IA | 220 € |
| CRM Inteligente | 750 € |
| Recordatorio Comercial | 80 € |
| KPIs Empresa | 350 € |
| Dashboard Ejecutivo | 420 € |
| Informe Diario | 100 € |
| Informe Semanal | 110 € |
| Informe Mensual | 160 € |
| Facturación IA | 340 € |
| Control de Gastos | 210 € |
| Cobros Automáticos | 400 € |
| Recordatorios de Pago | 90 € |
| Captación de Leads | 230 € |
| Lead IA 360 | 650 € |
| Contenido IA para Redes Sociales | 220 € |
| Newsletter IA | 190 € |
| SEO IA | 320 € |
| Seguimiento de Tareas | 110 € |
| Gestión de Proyectos | 350 € |
| Asignación Automática | 230 € |
| Control de Entregas | 200 € |
| Chat IA Clientes | 380 € |
| WhatsApp IA | 400 € |
| Tickets IA | 240 € |

**Qué cubre la mensualidad (los cuatro componentes que la justifican, siempre):**

1. **Mantenimiento técnico** — APIs de terceros cambian (WhatsApp Business, bancos, ERPs, Google/Microsoft), y un workflow no mantenido se rompe en 3–9 meses. Esto no es negociable ni opcional: es la razón real de que estos sistemas no se vendan "a coste único" como haría un desarrollador freelance — ahí es donde compiten mal y donde D-Code compite bien.
2. **Mejoras continuas** — pequeños ajustes de reglas de negocio, nuevos campos, nuevas condiciones, sin necesidad de re-cotizar cada cambio menor.
3. **Soporte** — canal de incidencias con SLA (ver §8), crítico en servicios que tocan dinero (Facturación, Cobros) o cara al cliente final (Chat IA, WhatsApp IA).
4. **Monitorización** — alertas proactivas de fallos de ejecución, especialmente relevante en flujos con IA generativa, donde "funciona pero da una respuesta rara" es un modo de fallo tan real como "se ha caído".

La mensualidad se calibra en ~7–9 % del precio de implantación al mes para las Bandas A–B (retorno de la implantación en 11–14 meses vía mensualidad, razonable para el cliente) y ~6–8 % para C–D (el ticket de implantación ya es alto, así que el ratio baja ligeramente, pero el importe absoluto crece por la complejidad real de mantener sistemas con más superficie de fallo).

---

## 5. Servicios que nunca se venden solos

Seis servicios están marcados explícitamente como **"No — solo en paquete"**:

| Servicio | Por qué no se vende solo |
|---|---|
| Copias de Seguridad | Bajo valor percibido en aislamiento ("es solo un backup"), aunque el riesgo que cubre es alto. Vendido solo, ancla la percepción de precio de D-Code a un servicio de commodity. Vendido dentro de Fundamentos IA, se percibe como "la base de todo lo demás". |
| Monitorización n8n | Es la garantía de que el resto de automatizaciones (propias o no) siguen funcionando. Vender "vigilancia de tu propio sistema" como producto aislado genera la pregunta incómoda "¿y si no lo compro, no lo vigiláis?". Debe presentarse como incluido en la gobernanza técnica del cliente, nunca como línea de precio suelta al inicio de la conversación. |
| Recordatorio Comercial | Sin un CRM Inteligente o Seguimiento Comercial IA detrás, un recordatorio no tiene datos de los que "recordar" nada relevante. Es un complemento funcional, no un sistema. |
| Informe Diario / Informe Semanal | Un informe automatizado sin los KPIs/Dashboard que lo alimentan es un email bonito sin sustancia analítica. Venderlos sueltos infla el catálogo mercado de "informes" que cualquier freelancer replica en un día — mejor no competir ahí en absoluto. |
| Recordatorios de Pago | Exactamente el mismo patrón que Recordatorio Comercial: sin Cobros Automáticos, no hay motor de gestión de impagos detrás, solo un envío de emails. |

**Principio general:** un servicio no se vende solo cuando (a) su valor depende estructuralmente de otro sistema para generar dato o contexto, o (b) su venta aislada lo convierte en un commodity fácilmente replicable por la competencia low-cost, dañando el posicionamiento de precio de toda la marca. Estos seis servicios son el "pegamento" de los paquetes, no productos de puerta de entrada.

---

## 6. Servicios estrella (top 10, ranking comercial)

| # | Servicio | Por qué |
|---|---|---|
| 1 | **Lead IA 360** | Producto insignia ya construido y en producción (workflow real del sitio de D-Code). Cubre todo el funnel de captación con IA — es la demostración viva de la propia capacidad de la empresa: "usamos lo que vendemos". |
| 2 | **CRM Inteligente** | El sistema de mayor dependencia y mayor LTV del catálogo. Una vez dentro, el cliente no se va — coste de cambio altísimo. Es la base de la mayoría de upsells posteriores. |
| 3 | **WhatsApp IA** | Canal de mayor demanda en España/LATAM para PYME orientada a cliente final. Cierre rápido: el dolor ("no damos abasto con WhatsApp") es universal y fácil de vender en la primera llamada. |
| 4 | **Chat IA Clientes** | Automatización visible y demostrable en la propia web del cliente en cuestión de días — genera "efecto wow" inmediato, ideal para testimoniales y casos de estudio. |
| 5 | **Onboarding Cliente IA** | Reduce directamente el churn del cliente de D-Code — argumento de ROI limpio y fácil de cuantificar (coste de un cliente perdido en el primer mes vs. coste del sistema). |
| 6 | **Dashboard Ejecutivo** | Vende directamente a quien firma el cheque (dirección/gerencia). Acceso directo al presupuesto y a la decisión, sin intermediarios de compras. |
| 7 | **Cobros Automáticos** | ROI cuantificable en euros reales recuperados desde el primer mes — el argumento de venta se escribe solo ("recuperamos X € de impagados el mes pasado"). |
| 8 | **Generador de Propuestas IA** | Equipo comercial del cliente lo adopta de inmediato porque le ahorra tiempo a él mismo — genera evangelistas internos dentro de la cuenta, acelera el resto de la venta departamental. |
| 9 | **Facturación IA** | Necesidad recurrente y, en España, con presión regulatoria creciente (facturación electrónica/Veri*Factu) que empuja a la adopción — argumento de cumplimiento normativo además de eficiencia. |
| 10 | **SEO IA** | Motor de venta recurrente por naturaleza (el contenido/posicionamiento se degrada si se deja de trabajar), abre la puerta a todo el Departamento Marketing IA. |

---

## 7. Paquetes departamentales

No se venden features sueltas: se vende un **departamento sustituido o aumentado por IA**. Cada paquete incluye un descuento de empaquetado (20–28 %) frente a la suma de precios individuales — el ahorro es el argumento de cierre, no el precio absoluto.

### 7.0 Fundamentos IA (Infraestructura y Gobierno) — paquete de entrada

*Incluye:* Copias de Seguridad + Gestión Documental + Monitorización n8n
*Precio implantación:* **3.900 €** *(vs. 5.400 € por separado → ahorro 1.500 €)*
*Precio mensual:* **320 €** *(vs. 420 € por separado)*
*ROI esperado:* evita pérdida de datos crítica (coste medio de un incidente de datos en PYME: varios miles de euros y días de operativa parada) y ordena la documentación dispersa en Drive/email, recuperando horas de búsqueda de información cada semana.
*Empresa ideal:* cualquier cliente nuevo, como paso previo o paralelo al primer paquete departamental — es la oferta de "aterrizaje" de menor fricción y mayor sensación de seguridad inmediata.

### 7.1 Departamento Comercial IA

*Incluye:* Generador de Propuestas IA + Seguimiento Comercial IA + CRM Inteligente + Recordatorio Comercial
*Precio implantación:* **12.500 €** *(vs. 16.700 € → ahorro 4.200 €)*
*Precio mensual:* **1.000 €** *(vs. 1.290 € → ahorro 290 €/mes)*
*ROI esperado:* aumento típico de tasa de cierre por seguimiento sistemático (nada se olvida) + reducción del ciclo de venta al automatizar propuestas — en una PYME con ticket medio de 5.000–20.000 € por venta, un solo cierre adicional al trimestre paga el paquete completo.
*Empresa ideal:* empresas con equipo comercial de 2–15 personas y ciclo de venta consultivo (B2B servicios, industria, distribución).

### 7.2 Departamento Financiero IA

*Incluye:* Facturación IA + Control de Gastos + Cobros Automáticos + Recordatorios de Pago
*Precio implantación:* **10.200 €** *(vs. 13.600 € → ahorro 3.400 €)*
*Precio mensual:* **820 €** *(vs. 1.040 € → ahorro 220 €/mes)*
*ROI esperado:* reducción del DSO (días de cobro pendiente) y del tiempo de administración financiera — el argumento más limpio de todo el catálogo: "esto se paga solo con lo que dejáis de perder en impagados".
*Empresa ideal:* empresas de servicios profesionales o B2B con facturación recurrente y morosidad relevante (agencias, consultoras, distribuidoras, clínicas privadas).

### 7.3 Departamento Marketing IA

*Incluye:* Captación de Leads + Lead IA 360 + Contenido IA para Redes Sociales + Newsletter IA + SEO IA
*Precio implantación:* **15.700 €** *(vs. 20.900 € → ahorro 5.200 €)*
*Precio mensual:* **1.250 €** *(vs. 1.610 € → ahorro 360 €/mes)*
*ROI esperado:* sustituye o complementa la contratación de un equipo de marketing de 1–2 personas (coste totalmente cargado 45.000–70.000 €/año en España) manteniendo presencia constante en captación, contenido y SEO.
*Empresa ideal:* empresas sin equipo de marketing interno o con equipo pequeño saturado, que buscan presencia digital constante sin escalar plantilla.

### 7.4 Departamento Atención al Cliente IA

*Incluye:* Chat IA Clientes + WhatsApp IA + Tickets IA + Encuestas Automáticas + Bienvenida Cliente + Renovaciones + Onboarding Cliente IA
*Precio implantación:* **17.900 €** *(vs. 23.900 € → ahorro 6.000 €)*
*Precio mensual:* **1.400 €** *(vs. 1.790 € → ahorro 390 €/mes)*
*ROI esperado:* cobertura 24/7 sin ampliar plantilla de soporte, reducción de churn vía onboarding y renovaciones proactivas — combina el paquete de mayor volumen de interacción diaria con el de mayor efecto en retención de ingresos.
*Empresa ideal:* empresas con base de clientes activa y recurrente (SaaS, suscripciones, servicios con renovación, e-commerce con volumen medio-alto de consultas).

### 7.5 Departamento Dirección IA

*Incluye:* KPIs Empresa + Dashboard Ejecutivo + Informe Diario + Informe Semanal + Informe Mensual
*Precio implantación:* **11.500 €** *(vs. 15.300 € → ahorro 3.800 €)*
*Precio mensual:* **890 €** *(vs. 1.140 € → ahorro 250 €/mes)*
*ROI esperado:* decisiones más rápidas y basadas en datos reales en vez de intuición o Excel manual — el paquete con mayor visibilidad ante el comprador final (socio/gerente), lo que lo convierte en excelente punto de entrada para vender el resto de departamentos ("¿queréis que el Dashboard también muestre datos comerciales/financieros en tiempo real?").
*Empresa ideal:* empresas de 15+ empleados con estructura de dirección definida (socios, comité de dirección) que necesitan reporting consolidado sin depender de que alguien lo monte a mano cada semana.

### 7.6 Departamento Operaciones IA

*Incluye:* Seguimiento de Tareas + Gestión de Proyectos + Asignación Automática + Control de Entregas
*Precio implantación:* **8.900 €** *(vs. 11.400 € → ahorro 2.500 €)*
*Precio mensual:* **700 €** *(vs. 890 € → ahorro 190 €/mes)*
*ROI esperado:* reducción de retrasos y cuellos de botella operativos, visibilidad de carga de trabajo en tiempo real — especialmente potente en empresas con múltiples proyectos/clientes en paralelo.
*Empresa ideal:* agencias, consultoras, estudios técnicos, constructoras y empresas de producción/proyecto a proyecto.

---

## 8. Planes de mantenimiento (modelo SaaS)

Los planes departamentales (§7) definen **qué** automatizaciones tiene el cliente. Los planes de mantenimiento definen **cómo se le da servicio**, independientemente de cuántos servicios individuales o paquetes tenga contratados. Todo cliente de D-Code Partners, sin excepción, está en uno de estos cuatro planes — es el ingreso recurrente base de la compañía, la capa que la convierte en un negocio de suscripción y no en una sucesión de proyectos.

| | **Starter** | **Growth** | **Scale** | **Enterprise** |
|---|---|---|---|---|
| **Precio** | 290 €/mes | 690 €/mes | 1.490 €/mes | desde 3.500 €/mes (a medida) |
| **Automatizaciones activas** | Hasta 3 | Hasta 8 | Hasta 20 | Ilimitadas |
| **Soporte** | Email, respuesta &lt;48 h | Email + chat, respuesta &lt;24 h | Canal prioritario, respuesta &lt;8 h laborables | Canal dedicado (Slack/Teams), respuesta &lt;4 h en incidencias críticas |
| **Horas de consultoría incluidas** | 2 h/mes | 5 h/mes | 12 h/mes | 30 h/mes (bolsa de desarrollo bajo demanda) |
| **SLA** | Best effort (sin SLA formal) | 99 % uptime de workflows | 99,5 % uptime + alertas proactivas | 99,9 % uptime + gestor de cuenta dedicado |
| **Mejoras mensuales** | Menores (ajustes, no features) | 1 mejora funcional/mes | 2–3 mejoras/mes | Bajo demanda dentro de la bolsa de horas |
| **Monitorización** | Básica (fallos críticos) | Proactiva | Proactiva + revisión trimestral de arquitectura | Proactiva + roadmap trimestral conjunto |
| **Consultoría estratégica** | No | Puntual | Trimestral | Continua (partner tecnológico externo) |

**Lógica de diseño (patrón "decoy" clásico de pricing SaaS):** Growth está deliberadamente posicionado como la opción de mejor relación valor/precio visible — Starter existe sobre todo para que Growth se vea generoso por comparación, y Scale existe para que las cuentas con 4+ automatizaciones activas (es decir, casi cualquier cliente de un paquete departamental completo) salten de forma natural a Scale sin que se perciba como un salto agresivo de precio. Enterprise no tiene precio de tabla — se cotiza siempre en llamada, lo que en sí mismo señala exclusividad y refuerza el ancla alta de todo el sistema.

---

## 9. Estrategia comercial

**Qué vender primero.** Nunca el paquete completo en la primera propuesta. Se identifica el **dolor más agudo y medible** del cliente en el diagnóstico inicial (que ya es gratuito por promesa de marca) y se propone **un único servicio ancla** de alto impacto visible — casi siempre uno del top 10 de §6 (WhatsApp IA, Chat IA Clientes, Generador de Propuestas IA o Cobros Automáticos, según el departamento con el dolor más evidente). El objetivo de esta primera venta no es maximizar el ticket, es maximizar la **probabilidad de éxito visible en 30 días**, porque ese éxito es el que financia toda venta posterior.

**Qué ofrecer después.** A los 60–90 días de la primera implantación, con resultados ya demostrados, se presenta el paquete departamental completo del área donde ya se ha probado valor (ver §7). El argumento no es "cómpranos más cosas", es "ya viste lo que hace un sistema en marketing/comercial/finanzas — esto es verlo completo, no a medias". Es la lógica exacta de land-and-expand de Salesforce/HubSpot aplicada a automatización.

**Cómo aumentar el ticket medio.**
- Migrar cada cliente de "servicio suelto + plan Starter" a "paquete departamental + plan Scale" en el primer año de relación — es el movimiento de mayor impacto en ARPA (ingreso medio por cuenta).
- Prepago anual con descuento (10 % sobre mensualidad) financia caja y ancla el compromiso sin tocar el precio de implantación.
- Revisiones trimestrales de negocio (QBR, prestadas dentro de Scale/Enterprise) como espacio recurrente y ya pagado para detectar el siguiente departamento a vender.

**Upselling.** Dentro de un mismo departamento: de servicio suelto a paquete completo (ej. cliente con solo Facturación IA → Departamento Financiero IA completo). De plan de mantenimiento inferior a superior conforme crece el número de automatizaciones activas (el propio límite de automatizaciones de cada plan es, por diseño, el gatillo natural del upsell: al llegar a la automatización nº 4 en Starter, la conversación de subir a Growth se produce sola).

**Cross-selling.** Entre departamentos: el Dashboard Ejecutivo (Dirección) es el mejor gancho de cross-sell porque expone visualmente los huecos de datos de los departamentos que el cliente aún no tiene automatizados ("veo que no tenéis dato de X — es porque X todavía es manual"). Cada implantación deja intencionadamente visible, dentro del propio sistema entregado, la conexión natural con el siguiente departamento.

**Cuándo vender departamentos completos directamente (saltándose el servicio ancla).** Solo cuando el cliente llega ya con presupuesto definido y una necesidad transversal explícita (típicamente, empresas de 30+ empleados con experiencia previa contratando consultoría o software, que ya entienden el valor de un sistema completo y no necesitan la prueba de 30 días para confiar). Es la excepción, no la regla — la regla es siempre "ancla primero, departamento después".

---

## 10. Estrategia psicológica de precios

**Por qué un cliente acepta pagar estos precios.** Porque para cuando se le presenta el precio, ya ha visto el resultado — esta es la ventaja estructural que la promesa pública de D-Code Partners ("resultados antes que precio", "sin beneficio demostrado, no hay factura") ya construye mejor que cualquier técnica de anclaje aislada. El precio deja de evaluarse contra "cuánto cuesta un desarrollador de n8n" y pasa a evaluarse contra "cuánto vale lo que ya está viendo funcionar delante de él". Esta secuencia —entregar valor antes de pedir compromiso económico— es el mecanismo psicológico más potente disponible y debe protegerse en toda comunicación comercial y de precios: **este documento es interno precisamente para no romper esa secuencia.**

**Cómo presentar el ROI.** Siempre en la unidad que el interlocutor usa para pensar su propio negocio: horas ahorradas × coste/hora del puesto sustituido, € recuperados en cobros, % de reducción de tiempo de respuesta, número de leads adicionales gestionados sin ampliar plantilla. Nunca presentar el ROI en abstracto ("mejora la eficiencia") — siempre en la cifra concreta capturada durante los 30 días de prueba, que es el propio dato que el Método D-Code ya se compromete a entregar antes de hablar de precio.

**Cómo evitar la comparación de precios con otras agencias.** Cambiando la categoría de comparación, no el precio. D-Code no compite como "otro proveedor de automatizaciones" — se posiciona como "el departamento tecnológico externo" del cliente (lenguaje ya usado en el propio contexto de marca). Frente a esa categoría, la comparación relevante no es con un freelancer de n8n a 50 €/h, sino con el coste de contratar y mantener el puesto que el sistema sustituye o aumenta (candidato junior de operaciones/marketing/soporte: 24.000–35.000 €/año totalmente cargados en España) o con el coste-hora de una consultora enterprise (150–300 €/h). Contra ambas referencias, el precio de D-Code se percibe como una ganga sin necesidad de bajarlo un euro.

**Cómo justificar una implantación de 5.000 €.** Descomponiéndola en su equivalente diario: 5.000 € repartidos en un contrato de 24 meses de relación típica (implantación + mantenimiento) equivalen a menos de 7 €/día — menos que un café y un bocadillo, frente a un sistema que trabaja 24/7 sin bajas, sin rotación y sin curva de aprendizaje repetida. Combinado con el argumento de coste de oportunidad ("¿cuánto os cuesta cada semana que esto se siga haciendo a mano?"), la cifra deja de sentirse como gasto y pasa a sentirse como la opción obviamente más barata de las dos disponibles.

**Cómo convertir el precio en inversión.** Presentando siempre implantación + mensualidad juntas como un único número de "coste total de propiedad a 12 meses", y ese número siempre al lado del retorno ya demostrado en la prueba de 30 días. Un precio sin retorno al lado es un gasto; un precio con retorno al lado, mayor que el propio precio, dispuesto en la misma diapositiva, es matemáticamente una inversión — y se debe presentar literalmente así, en la misma tabla, nunca en documentos separados.

---

## 11. Escalabilidad: de 10 a 500 clientes

El modelo de entrega tiene que cambiar de forma deliberada en cada etapa; intentar escalar clientes sin escalar el modelo de entrega es la causa nº 1 de que las agencias de automatización se queden ancladas en la fase artesanal para siempre.

| | **10 clientes** | **50 clientes** | **100 clientes** | **500 clientes** |
|---|---|---|---|---|
| **Modelo de entrega** | Build 1:1 a medida por los fundadores | Plantillas modulares reutilizables por departamento + primeros ingenieros de delivery | Plataforma interna de configuración (los 32 servicios como bloques parametrizables, no builds desde cero) | Catálogo semi-productizado + red de partners/implementadores certificados en el método D-Code |
| **Equipo** | Fundadores + 1 perfil técnico | + 2–3 ingenieros de automatización, 1 CS/soporte | + Delivery lead, equipo de soporte por SLA, ventas dedicada | Equipos regionales/verticales, programa de partners, función de producto interno |
| **ARPA (ingreso medio/cuenta, implantación + mensualidad amortizada)** | ~450 €/mes blended | ~450 €/mes blended | ~500 €/mes blended (mayor cross-sell departamental) | ~550 €/mes blended |
| **MRR aproximado** | ~4.500 €/mes | ~22.500 €/mes | ~50.000 €/mes | ~275.000 €/mes |
| **ARR recurrente aproximado** | ~54.000 € | ~270.000 € | ~600.000 € | ~3.300.000 € |
| **Margen bruto** | Alto en % pero limitado por horas-fundador (cuello de botella de capacidad, no de demanda) | Empieza a comprimirse por nómina de delivery, se compensa con reutilización de plantillas | Se recupera vía plataforma interna (menos horas por implantación gracias a bloques reutilizables) | Máximo apalancamiento: coste marginal de una implantación adicional cae por productización y por partners que absorben delivery local |
| **Palanca principal de crecimiento** | Casos de éxito + referencias directas | Paquetes departamentales estandarizados + primeros QBR sistemáticos | Planes Scale/Enterprise como motor de expansión dentro de cuenta | Canal de partners + posible evolución de servicios de mayor demanda (Lead IA 360, CRM Inteligente) hacia producto verticalizado con licencia propia |

**El ingrediente que hace que esto escale sin perder rentabilidad no es vender más barato a más gente — es exactamente lo contrario:** cada etapa reduce el coste marginal de entrega (vía plantillas, plataforma interna y partners) mientras el precio al cliente se mantiene o sube (vía ARPA creciente por mayor cross-sell departamental). Es el patrón de márgenes crecientes de cualquier negocio de software bien gestionado, aplicado a un negocio que hoy nace como servicio. El ARR recurrente proyectado en la etapa de 500 clientes (~3,3 M€, sin contar el ingreso adicional de nuevas implantaciones cada año) sitúa a D-Code Partners con claridad en el rango de "varios millones de euros de facturación" que es el objetivo declarado de este documento — siempre como modelo direccional e ilustrativo, no como previsión garantizada.

---

## 12. Resumen final y próximos pasos

Este documento debe usarse como **la única fuente de verdad de precios** dentro de la organización. Ningún comercial debe cotizar un servicio individual, un paquete departamental o un plan de mantenimiento fuera de las cifras aquí definidas sin aprobación expresa de dirección (excepción: el descuento del 10 % en implantación ya autorizado en la cabecera del documento).

Próximos pasos recomendados:
1. Convertir §7 y §8 en materiales de venta (one-pager por paquete, comparativa de planes) — sin exponer nunca el desglose interno de horas/coste de §1 y §3.
2. Formar al equipo comercial explícitamente en la secuencia de §9–§10: nunca precio antes que resultado, nunca servicio suelto de la lista de "no vender solo" (§5) sin su complemento.
3. Revisar este documento cada 6 meses: ajustar bandas de precio según coste real observado por servicio (horas reales vs. estimadas) y según el mix de ventas real (qué paquetes y planes se están vendiendo más, para reforzar ahí la inversión comercial).
