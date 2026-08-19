# CAMBIOS ABIERTOS — D-Code Partners

> Estados permitidos: PENDIENTE · EN INVESTIGACIÓN · BLOQUEADO · LISTO PARA EJECUTAR
> · EN EJECUCIÓN · VERIFICACIÓN · RESUELTO · DESCARTADO
> No marcar RESUELTO sin evidencia de que funciona en producción.

Última actualización: 2026-08-14 (auditoría AUD-20260814-001, con acceso en vivo a
n8n y Gmail — ver `AUDITORIAS.md`).

Plantilla de cada cambio:

```
ID:
Estado:
Área:
Prioridad: (P0/P1/P2/P3, ver ROADMAP.md)
Impacto:
Urgencia:
Dependencias:
Problema:
Causa:
Evidencia:
Solución propuesta:
Riesgo:
Acción requerida:
Responsable:
Bloqueado por:
Fecha de detección:
Última revisión:
Estado de verificación:
```

---

## CAMBIO-001

- ID: CAMBIO-001
- Estado: EN INVESTIGACIÓN (escalado de PENDIENTE tras verificación en vivo)
- Área: Comercial / Automatizaciones / n8n
- Prioridad: P0 (subido de P1 — confirmado con evidencia directa, no ya solo
  hipótesis)
- Impacto: si el webhook de captación nunca ha recibido tráfico real, cada visita
  al formulario de contacto se pierde en silencio — es el único canal de entrada de
  leads verificado.
- Urgencia: Crítica.
- Dependencias: ninguna.
- Problema: **verificado en vivo el 2026-08-14** — el workflow "MK/Lead IA 360"
  (`0NQvFFWYj3cNI6Zo`) tiene **0 ejecuciones registradas desde su creación** (12
  días), pese a estar `active: true`, publicado (`versionId` = `activeVersionId`,
  sin cambios sin publicar), y con Production URL
  (`https://diegoydimitry2.app.n8n.cloud/webhook/lead-ia-360-v2`) idéntica a
  `N8N_WEBHOOK_URL` en `assets/js/main.js`. La hipótesis original de CAMBIO-001
  (desajuste de URL) queda **descartada** — la configuración coincide.
- Causa: [NO VERIFICADO]. Candidatas sin confirmar: (a) ausencia real de tráfico al
  formulario, (b) fallo silencioso en el frontend (JS/CORS/Turnstile) que impide que
  la petición llegue a salir del navegador, (c) algún otro canal de entrada no
  documentado.
- CONTRADICCIÓN DETECTADA: el informe diario interno (`[DCP][REPORT] Informe
  Diario`, 2026-08-14) reporta "Total leads: 13" en Airtable. Fuente A (n8n,
  ejecuciones): 0 leads recibidos por el único webhook conocido. Fuente B (informe
  interno, presumiblemente leído de Airtable): 13 leads existentes. Qué sabemos: las
  dos cosas son ciertas por separado. Qué no sabemos: el origen real de esos 13
  registros. Qué debe verificarse: abrir Airtable directamente (el conector MCP de
  esta sesión no tenía bases visibles) y revisar la fecha de creación de esos 13
  registros y si tienen campos compatibles con haber venido del formulario web.
- Evidencia: [EVIDENCIA DIRECTA] `search_executions` (n8n MCP) para
  `0NQvFFWYj3cNI6Zo` → `count: 0`. [EVIDENCIA INDIRECTA] cifra de 13 leads del
  informe diario por email.
- Solución propuesta: (1) enviar un lead de prueba real desde
  `https://dcodepartners.com/contacto` en un navegador real y confirmar si genera
  ejecución en n8n; (2) si no la genera, revisar consola del navegador
  (JS/CORS/Turnstile) antes de tocar nada en n8n; (3) en paralelo, abrir Airtable
  directamente y confirmar el origen de los 13 leads actuales.
- Riesgo de no actuar: si el fallo es real, el canal de entrada más básico del
  negocio lleva 12 días roto sin que nadie lo sepa.
- Acción requerida: verificación (lectura + una prueba real desde el navegador), no
  requiere autorización de cambio en producción todavía.
- Responsable: [PENDIENTE DE DEFINIR] — equipo técnico + Dirección.
- Bloqueado por: nada técnico; requiere que alguien haga la prueba real desde el
  navegador.
- Fecha de detección: 2026-08-08 (como hipótesis). Confirmado con evidencia directa:
  2026-08-14.
- Última revisión: 2026-08-14.
- Estado de verificación: [EVIDENCIA DIRECTA] sobre las 0 ejecuciones;
  [NO VERIFICADO] la causa raíz y el origen de los 13 leads existentes.

## CAMBIO-002

- ID: CAMBIO-002
- Estado: DESCARTADO (superado por un sistema distinto — ver actualización
  2026-08-14 al final de esta entrada)
- Área: Marketing / n8n
- Prioridad: P2
- Impacto: Sin post nuevo, el calendario de LinkedIn deja de publicar contenido
  automáticamente a partir del 29 de agosto de 2026 sin ningún aviso — el workflow
  simplemente no hace nada ("Sin Publicación Hoy") ese día y todos los siguientes.
- Urgencia: Media — quedan ~3 semanas desde la fecha de este documento (2026-08-08).
- Dependencias: ninguna.
- Problema: el calendario de contenido del workflow "LinkedIn Auto-Post" está
  embebido y cubre solo 12 posts (3–28 de agosto de 2026, 3 posts/semana).
- Causa: diseño intencional documentado — el calendario vive dentro del Code node
  porque n8n Cloud no tiene acceso al repositorio.
- Evidencia: [EVIDENCIA DIRECTA] `automation/n8n/linkedin-auto-post/README.md`.
- Solución propuesta: decidir con antelación (antes del 28 de agosto de 2026) si se
  extiende el calendario con más semanas, o se deja que la publicación automática
  se detenga y pase a manual. Requiere editar el array `CALENDARIO` del Code node
  en n8n directamente (según el propio README).
- Riesgo de no actuar: silencio en LinkedIn sin que nadie lo note, ya que no hay
  alerta configurada para "no queda contenido programado".
- Acción requerida: decisión de Dirección + ejecución en n8n (modificación de
  producción, requiere autorización explícita).
- Responsable: [PENDIENTE DE DEFINIR]
- Bloqueado por: decisión de Dirección sobre si continuar la cadencia de LinkedIn.
- Fecha de detección: 2026-08-08.
- Última revisión: 2026-08-08.
- Estado de verificación: [EVIDENCIA DIRECTA] (el hecho de que el calendario termine
  el 28/08 está confirmado leyendo el propio Code node; lo no verificado es si ya
  existe un plan para extenderlo).
- **Actualización 2026-08-14**: el workflow `linkedin-auto-post` de este repositorio
  ya no parece ser el mecanismo activo de publicación de contenido — existe ahora
  "MK/Contenido IA Redes Sociales" en n8n, que genera 4 publicaciones/día
  (LinkedIn, Instagram, Facebook, X) pendientes de revisión humana antes de
  publicarse (confirmado por email "[Contenido IA] Nuevo contenido pendiente de
  revisión", 2026-08-14 07:00). No se ha verificado si el workflow
  `linkedin-auto-post` original sigue activo en paralelo o fue reemplazado — marcar
  [NO VERIFICADO]. Se descarta este cambio tal como estaba formulado (el riesgo de
  "calendario que se agota" ya no aplica al sistema real); si se necesita seguir
  este nuevo sistema, debe abrirse un cambio nuevo específico para él.

## CAMBIO-003

- ID: CAMBIO-003
- Estado: PENDIENTE
- Área: Comercial / Gobernanza
- Prioridad: P1
- Impacto: Si no hay proceso definido de seguimiento comercial tras la creación del
  lead en Airtable, los leads cualificados como prioritarios podrían no convertirse
  — información generada pero sin acción garantizada después.
- Urgencia: Alta si el volumen de leads es significativo; [NO VERIFICADO] volumen
  actual.
- Dependencias: CAMBIO-001 (de nada sirve resolver el seguimiento si los leads ni
  siquiera están llegando de forma fiable).
- Problema: el workflow deja explícitamente en blanco los campos `Notas
  comerciales`, `Responsable` y `Fecha seguimiento` en Airtable "para que el equipo
  comercial los complete a mano" — es decir, el paso posterior al lead cualificado
  es manual y no está automatizado ni, hasta donde se puede verificar aquí,
  monitorizado.
- Causa: ausencia de automatización de seguimiento comercial (por diseño, no es un
  bug) — pendiente confirmar si es una decisión deliberada de Dirección o un hueco
  no decidido todavía.
- Evidencia: [EVIDENCIA DIRECTA] `automation/n8n/lead-ia-360/README.md`, tabla de
  esquema de Airtable.
- Solución propuesta: no proponer automatización todavía sin antes confirmar con
  Dirección si el proceso comercial manual actual es intencional y suficiente, o si
  se considera un cuello de botella. (Ver regla "diseñar → validar → estabilizar →
  automatizar" antes de automatizar un proceso comercial sensible.)
- Riesgo: automatizar prematuramente el contacto/seguimiento comercial sin validar
  el proceso podría generar emails duplicados o mal timing con clientes reales.
- Acción requerida: DECISIÓN DE DIRECCIÓN antes de cualquier propuesta técnica.
- Responsable: Dirección (decisión) → [PENDIENTE DE DEFINIR] (ejecución).
- Bloqueado por: decisión de Dirección.
- Fecha de detección: 2026-08-08.
- Última revisión: 2026-08-08.
- Estado de verificación: [EVIDENCIA DIRECTA] sobre el hueco; [NO VERIFICADO] si es
  intencional.
- **Actualización 2026-08-14**: el supuesto "proceso manual" ya no es la única
  causa del problema — existen dos workflows dedicados exactamente a esto
  (`CM/Seguimiento Comercial IA` y `CM/Detección de Respuestas`) y **ambos están
  rotos en producción** (ver CAMBIO-004 y CAMBIO-005). Prioridad subida a P0. La
  pregunta de Dirección sigue en pie (¿es aceptable que el resto del proceso sea
  manual?) pero ahora hay, además, un bloqueo técnico confirmado.

## CAMBIO-004

- ID: CAMBIO-004
- Estado: LISTO PARA EJECUTAR (el fix ya existe, solo falta publicarlo — pendiente
  de autorización de Dirección)
- Área: Comercial / Automatizaciones / n8n
- Prioridad: P0
- Impacto: el workflow que detecta cuándo un lead responde a un email comercial
  (para detener la secuencia de seguimiento automático) falla en casi el 100% de
  sus ejecuciones.
- Urgencia: Crítica — activo desde al menos el 8 de agosto (6+ días).
- Dependencias: ninguna.
- Problema: "CM/Detección de Respuestas - Seguimiento Comercial IA"
  (`ujkXnsEtzySHr00l`) acumula 145 ejecuciones con error en su histórico; 32 de las
  33 detectadas solo desde el 13 de agosto (una cada 5 minutos cuando llega correo a
  la bandeja comercial).
- Causa: [EVIDENCIA DIRECTA] `TypeError: ...trim is not a function` en la línea 30
  del nodo "Filtrar Autorrespuestas y OOO" — el Gmail Trigger (`simple:false`)
  entrega el remitente como objeto estructurado, y el código **publicado en
  producción** intenta `.trim()` directamente sobre ese objeto. El editor de n8n ya
  contiene una versión corregida (función `extractSender` defensiva) guardada pero
  **nunca publicada** (`versionId` del borrador ≠ `activeVersionId` en producción).
  Es una recurrencia exacta del "PATRÓN SISTÉMICO: gobernanza de despliegue" ya
  documentado en `INCIDENCIAS.md`.
- Evidencia: [EVIDENCIA DIRECTA] `get_execution` (n8n MCP) sobre la ejecución 1048,
  traza completa del error; comparación de `nodes` (borrador) vs
  `activeVersion.nodes` (producción) del mismo workflow.
- Solución propuesta: publicar la versión actual del workflow en n8n (no requiere
  desarrollo nuevo) y probar con un correo real antes de cerrar.
- Riesgo: bajo — es activar un fix ya escrito.
- Acción requerida: autorización de Dirección para publicar en producción.
- Responsable: quien tenga acceso de publicación en la cuenta n8n.
- Bloqueado por: autorización de Dirección (regla de no-ejecución de este rol).
- Fecha de detección: 2026-08-14.
- Última revisión: 2026-08-14.
- Estado de verificación: [EVIDENCIA DIRECTA]

## CAMBIO-005

- ID: CAMBIO-005
- Estado: PENDIENTE
- Área: Comercial / Automatizaciones / n8n / Credenciales
- Prioridad: P0
- Impacto: el workflow que genera y envía los emails de seguimiento (día 3/7/14)
  lleva 7 días sin ejecutarse correctamente ni una sola vez.
- Urgencia: Crítica.
- Dependencias: ninguna. Revisar si la misma credencial rota afecta a otros
  workflows.
- Problema: "CM/Seguimiento Comercial IA" (`qcwxtb9XO3pCpCSm`) falla cada día a las
  06:30 desde el 8 de agosto (ejecuciones 432/534/638/739/837/940/1035 — 7 de 7
  días consecutivos).
- Causa: [EVIDENCIA DIRECTA] `401 Invalid authentication token` sobre la credencial
  Airtable "Airtable Personal Access Token account" (id `OrGjGOCyB2b3E2s5`) en el
  nodo "Buscar Leads Nuevos en Airtable" — el token está expirado o revocado.
- Evidencia: [EVIDENCIA DIRECTA] `get_execution` (n8n MCP) sobre la ejecución 1035,
  traza completa `NodeApiError: Authorization failed`.
- Solución propuesta: regenerar el Personal Access Token de Airtable y reenlazarlo
  en n8n; verificar qué otros workflows usan la misma credencial.
- Riesgo: bajo — operación estándar de credenciales, requiere acceso a la cuenta
  Airtable.
- Acción requerida: autorización de Dirección (modifica una credencial de
  producción).
- Responsable: administrador de la cuenta Airtable/n8n.
- Bloqueado por: autorización de Dirección + acceso a la cuenta Airtable para
  regenerar el token.
- Fecha de detección: 2026-08-14.
- Última revisión: 2026-08-14.
- Estado de verificación: [EVIDENCIA DIRECTA]

## CAMBIO-006

- ID: CAMBIO-006
- Estado: EN INVESTIGACIÓN
- Área: Comercial / Gobernanza / n8n
- Prioridad: P1
- Impacto: decisiones podrían tomarse sobre un diagnóstico incorrecto de dónde
  están los problemas técnicos reales.
- Urgencia: Alta.
- Dependencias: ninguna.
- Problema: el informe automático de "DIR/Executive Board - Auditor Interno" del
  2026-08-14 señala a "PRD/Asignación Automática" (`GZ3w0M3oLzZzgceB`) como
  "sospechoso principal" de concentrar errores, por tener el mayor volumen de
  ejecuciones (24).
- CONTRADICCIÓN DETECTADA: Fuente A (Auditor Interno, informe por email): culpa a
  `GZ3w0M3oLzZzgceB`. Fuente B (verificación directa vía `search_executions`):
  `GZ3w0M3oLzZzgceB` tiene **0 ejecuciones con error**; el verdadero concentrador es
  `ujkXnsEtzySHr00l` (32 de 33 errores del mismo periodo, ver CAMBIO-004). Qué
  sabemos: la fuente B es una consulta directa y verificable. Qué no sabemos: por
  qué el Auditor Interno llegó a esa conclusión. Qué debe verificarse: la lógica
  interna del workflow del Auditor.
- Causa probable: [INFERENCIA] el Auditor Interno parece correlacionar "workflow
  con más ejecuciones totales" con "principal fuente de error", en vez de calcular
  la tasa de error específica de cada workflow.
- Evidencia: [EVIDENCIA DIRECTA] `search_executions` filtrado por `workflowId` y
  `status:error` para ambos workflows, 2026-08-14.
- Solución propuesta: revisar la lógica de `DIR/Executive Board - Auditor Interno`
  para que compute errores/ejecuciones POR workflow, no solo volumen total.
- Riesgo: bajo.
- Acción requerida: autorización de Dirección para modificar el workflow del
  Auditor.
- Responsable: equipo técnico (n8n).
- Bloqueado por: autorización de Dirección.
- Fecha de detección: 2026-08-14.
- Última revisión: 2026-08-14.
- Estado de verificación: [EVIDENCIA DIRECTA]

## CAMBIO-007

- ID: CAMBIO-007
- Estado: PENDIENTE — requiere decisión de Dirección antes de cualquier ejecución
- Área: Comercial / Producto
- Prioridad: P1
- Impacto: oportunidades comerciales cualificadas generadas a diario sin llegar de
  forma sistemática a ninguna acción comercial.
- Urgencia: Alta, condicionada a resolver primero CAMBIO-001, 004 y 005.
- Dependencias: CAMBIO-001, CAMBIO-004, CAMBIO-005.
- Problema: "AAA/Radar Comercial IA" funciona de forma fiable y diaria (0 errores,
  8 ejecuciones verificadas, hoy 35 empresas analizadas y 31 HOT), pero
  "CM/CRM Inteligente" —el único puente encontrado hacia la tabla `Clientes`— solo
  se ha ejecutado **una vez en 12 días** (10 de agosto), pese a estar configurado
  para ejecutarse semanalmente. No se ha encontrado ningún workflow que conecte un
  HOT/WARM con una propuesta o un contacto comercial saliente real.
- Causa: [NO VERIFICADO] si es una decisión deliberada (validar el proceso antes de
  automatizarlo del todo) o un hueco no resuelto.
- Evidencia: [EVIDENCIA DIRECTA] `search_executions` de `JAxURoa7Y0ADtUUn` → 1
  ejecución histórica. [EVIDENCIA INDIRECTA] emails "[DCP][HOT LEAD]" individuales sí
  se envían al equipo (ej. "Ichikani Madrid", "Rosi La Loca", 2026-08-14), lo que
  sugiere que la notificación existe pero el siguiente paso sistemático no.
- Solución propuesta: Dirección decide explícitamente qué debe pasar con un HOT
  (¿contacto manual? ¿propuesta automática? ¿nada todavía?) y lo registra en
  `DECISIONES-DIRECCION.md` antes de construir nada nuevo.
- Riesgo: automatizar un contacto comercial saliente sin validar el proceso puede
  dañar la reputación con negocios reales identificados por nombre.
- Acción requerida: DECISIÓN DE DIRECCIÓN.
- Responsable: Dirección (decisión) → equipo técnico (ejecución posterior).
- Bloqueado por: decisión de Dirección + resolución de CAMBIO-001/004/005.
- Fecha de detección: 2026-08-14.
- Última revisión: 2026-08-14.
- Estado de verificación: [EVIDENCIA DIRECTA] sobre el hueco de sincronización;
  [NO VERIFICADO] si hay un proceso manual compensatorio que ya lo cubre.

## CAMBIO-008

- ID: CAMBIO-008
- Estado: PENDIENTE
- Área: Estratégico / Gobernanza
- Prioridad: P1
- Impacto: cada workflow nuevo añadido sobre una base con ~27,6% de tasa de error
  (dato del propio Auditor Interno, 2026-08-14) es una fuente más de fallo.
- Urgencia: Alta.
- Dependencias: CAMBIO-001, CAMBIO-004, CAMBIO-005.
- Problema: existen al menos 6 workflows dedicados a medir/informar sobre la propia
  empresa (bloque `DIR/Executive Board` + Informes + KPIs + Dashboard) generando
  varios emails al día, mientras el motor comercial real está roto en al menos dos
  puntos críticos (CAMBIO-004, CAMBIO-005) y el canal de entrada de leads no está
  confirmado (CAMBIO-001).
- Evidencia: [EVIDENCIA DIRECTA] volumen de emails automáticos observado en la
  bandeja el 2026-08-14 (dashboard, informe diario, alertas de error cada ~2h,
  contenido pendiente) + cifra de error del propio Auditor Interno.
- Solución propuesta: pausa explícita de nuevos despliegues/workflows hasta
  resolver CAMBIO-001, 004 y 005. (Coincide, de forma independiente, con la
  recomendación que el propio Auditor Interno generó en su email de las 05:01 del
  mismo día.)
- Riesgo: ninguno — es una decisión organizativa sin coste.
- Acción requerida: decisión de Dirección (no requiere cambio técnico).
- Responsable: Dirección.
- Bloqueado por: nada, es una decisión que Dirección puede tomar ya.
- Fecha de detección: 2026-08-14.
- Última revisión: 2026-08-14.
- Estado de verificación: [EVIDENCIA DIRECTA]

## CAMBIO-009

- ID: CAMBIO-009
- Estado: PENDIENTE
- Área: Operaciones / Comunicación
- Prioridad: P2
- Impacto: dificulta detectar manualmente lo importante (p. ej. una respuesta real
  de un lead) entre el ruido — relevante porque CAMBIO-004 también depende de esta
  misma bandeja.
- Urgencia: Media.
- Dependencias: ninguna.
- Problema: la bandeja `dcodedepartment@gmail.com` acumula 38 correos sin
  clasificar, cerca de su máximo histórico (39) según el informe interno.
- Causa: [EVIDENCIA INDIRECTA — informe interno] las reglas de clasificación de
  Gmail no funcionan pese a recomendaciones previas. [EVIDENCIA DIRECTA] observación
  directa: la bandeja mezcla alertas críticas de sistema, notificaciones sociales de
  LinkedIn, avisos de Google/OpenAI y leads reales en el mismo espacio.
- Evidencia: informe "[DCP][DASHBOARD] Executive Board", 2026-08-14; inspección
  directa de `search_threads`.
- Solución propuesta: revisar y corregir reglas de etiquetado/clasificación;
  valorar separar tráfico comercial de notificaciones internas de sistema.
- Riesgo: bajo.
- Acción requerida: autorización de Dirección para modificar reglas de Gmail.
- Responsable: equipo técnico.
- Bloqueado por: autorización de Dirección.
- Fecha de detección: 2026-08-14.
- Última revisión: 2026-08-14.
- Estado de verificación: [EVIDENCIA INDIRECTA] sobre la cifra exacta;
  [EVIDENCIA DIRECTA] sobre la mezcla de contenido en la bandeja.

## CAMBIO-010

- ID: CAMBIO-010
- Estado: PENDIENTE
- Área: Técnico / Deuda técnica
- Prioridad: P3
- Impacto: bajo hoy, pero acumula deuda técnica no decidida.
- Urgencia: Baja.
- Dependencias: ninguna.
- Problema: existe un workflow "AAA/AI Factory Orchestrator" (`dhiRJiJAVYrGWQuG`),
  creado el 5 de agosto, con nombre de "orquestador central", pero inactivo
  (`active: false`), sin ejecuciones nunca (`triggerCount: 0`) y marcado como no
  disponible en MCP (`availableInMCP: false`), a diferencia de los otros 37
  workflows.
- Causa: [NO VERIFICADO] — no se ha abierto el contenido del workflow en esta
  pasada; puede ser una pieza abandonada a medio construir o pendiente de activar.
- Evidencia: [EVIDENCIA DIRECTA] `search_workflows` (n8n MCP), 2026-08-14.
- Solución propuesta: decidir si se termina o se elimina, antes de que se acumule
  como deuda técnica adicional.
- Riesgo: ninguno en el diagnóstico.
- Acción requerida: decisión de Dirección + equipo técnico.
- Responsable: equipo técnico + Dirección.
- Bloqueado por: nadie lo ha revisado en detalle todavía.
- Fecha de detección: 2026-08-14.
- Última revisión: 2026-08-14.
- Estado de verificación: [EVIDENCIA DIRECTA] sobre su estado inactivo;
  [NO VERIFICADO] su propósito real.

## CAMBIO-011

- ID: CAMBIO-011
- Estado: RESUELTO (verificado en producción, dos veces)
- Área: Finanzas / Automatizaciones / n8n
- Prioridad: P0
- Impacto: sin este guardrail, cualquier ejecución del workflow contra un cliente
  marcado Modo=Prueba en Airtable enviaba un recordatorio de cobro real al email
  real de ese contacto.
- Urgencia: Crítica — mismo patrón de riesgo que causó un incidente real.
- Dependencias: ninguna.
- Problema: "FNZ/Cobros y Recordatorios de Pago" (`bHFIS358z1VDabVm`) enviaba
  recordatorios de cobro a clientes reales sin comprobar el campo `Modo` del
  cliente en Airtable, a diferencia de su workflow hermano "FNZ/Cobros -
  Seguimiento" (`LGmMF8hsxhPf1CiC`), que sí tenía el guardrail desde su creación.
- Causa: guardrail no implementado en este workflow cuando se construyó
  (`bHFIS358z1VDabVm` es anterior a la introducción del patrón Modo=Prueba en el
  workflow hermano).
- Evidencia: [EVIDENCIA DIRECTA] comparación de `get_workflow_details` de ambos
  workflows (2026-08-19); [EVIDENCIA INDIRECTA] motivado además por el incidente
  real del 2026-08-06 (factura real enviada a un contacto externo real durante una
  prueba), hallazgo de la auditoría FASE 1 no re-verificado contra su fuente
  primaria en este turno.
- Solución aplicada: réplica exacta del patrón ya probado del workflow hermano —
  `Calcular Recordatorios` calcula `modoPrueba` (bloqueado por defecto si no se
  resuelve el cliente); nuevo nodo IF `¿Bloqueado Modo Prueba?` enruta a
  notificación interna (`dcodedepartment@gmail.com`) en vez de al cliente real.
  Cambio puramente aditivo, ninguna funcionalidad ni conexión existente eliminada.
- Riesgo residual: ninguno identificado — ver "Riesgos restantes" en el informe
  entregado a Dirección el 2026-08-19.
- Acción requerida: ninguna — ejecutado y verificado.
- Responsable: Sesión de Claude Code, con autorización explícita de Dirección en
  el mismo turno (2026-08-19).
- Bloqueado por: nada (ya no aplica).
- Fecha de detección: 2026-08-19 (auditoría FASE 1, DIR-DCP-20260819-MASTER-001).
- Última revisión: 2026-08-19.
- Estado de verificación: [EVIDENCIA DIRECTA] `update_workflow` + `publish_workflow`
  + dos ejecuciones de prueba controladas (`test_workflow`/`get_execution`,
  ejecuciones 1707 y 1709) + `get_workflow_details` post-publicación confirmando
  `versionId == activeVersionId` y conexiones originales intactas.

---

Ver también `INCIDENCIAS.md` para el patrón sistémico de gobernanza de despliegue
(ahora con una recurrencia confirmada en vivo: CAMBIO-004) y `AUDITORIAS.md` para el
registro completo de la auditoría AUD-20260814-001.
