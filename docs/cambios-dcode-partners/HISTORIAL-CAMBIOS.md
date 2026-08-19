# HISTORIAL DE CAMBIOS — D-Code Partners

> Registra la evolución del sistema documental y de los cambios ejecutados sobre
> D-Code Partners que pasan por este rol. Permite responder: "¿qué cambió desde la
> última auditoría?". No confundir con `git log` del código del sitio (ese es el
> historial del propio repositorio; este archivo es específico del rol "Cambios
> D-Code Partners" y de cambios operativos más amplios que la web).

Formato de cada entrada:

```
FECHA:
CAMBIO:
MOTIVO:
ÁREA:
ESTADO ANTERIOR:
ESTADO NUEVO:
EVIDENCIA:
RESPONSABLE:
TICKET RELACIONADO:
```

---

FECHA: 2026-08-08
CAMBIO: Creación de la arquitectura documental "Cambios D-Code Partners"
(`docs/cambios-dcode-partners/*.md` + `CLAUDE.md` en la raíz del repositorio).
MOTIVO: Establecer una memoria persistente para que futuras sesiones de Claude Code
puedan reconstruir el estado de D-Code Partners sin depender de memoria
conversacional entre sesiones.
ÁREA: Gobernanza / Documentación.
ESTADO ANTERIOR: No existía `CLAUDE.md` ni ninguna carpeta `docs/` en el
repositorio.
ESTADO NUEVO: 10 archivos creados (ver estructura en `AUDITORIAS.md` o en el propio
repositorio). Ningún archivo de producción (workflows, credenciales, HTML
publicado) fue modificado.
EVIDENCIA: Commit(s) en la rama `claude/dcode-partners-changes-governance-tvyk6k`.
RESPONSABLE: Sesión de Claude Code, a petición de Dirección.
TICKET RELACIONADO: N/A (primera creación).

---

FECHA: 2026-08-14
CAMBIO: Primera auditoría completa con acceso en vivo a n8n y Gmail
(AUD-20260814-001, solicitada por Dirección como CAM-20260814-001). Actualización
de `ESTADO-ACTUAL.md`, `CAMBIOS-ABIERTOS.md` (CAMBIO-001 y CAMBIO-003 revisados,
CAMBIO-002 marcado obsoleto, CAMBIO-004 a CAMBIO-010 añadidos), `INCIDENCIAS.md`
(INC-20260814-001/002/003), `ROADMAP.md` y `CONTEXTO-MAESTRO.md` (secciones 3, 4,
5 y 7).
MOTIVO: Dirección pidió una revisión global orientada a impacto comercial —
"preparar a D-Code Partners para vender a pymes".
ÁREA: Comercial / Automatizaciones / Gobernanza.
ESTADO ANTERIOR: memoria documental basada solo en lectura del repositorio (2
workflows conocidos, Radar Comercial y asistentes Director/Auditor marcados NO
VERIFICADO).
ESTADO NUEVO: confirmado en vivo que existen 38 workflows de n8n; identificados 3
bloqueos P0 (captación de leads nunca ejecutada, seguimiento comercial roto en sus
dos mitades) y contradicción entre el diagnóstico automático del propio Auditor
Interno y la verificación directa. Ningún cambio de producción ejecutado — solo
diagnóstico y documentación.
EVIDENCIA: MCP n8n (`search_workflows`, `search_executions`, `get_execution`,
`get_workflow_details`) y MCP Gmail (`search_threads`, `get_thread`), 2026-08-14.
Commit(s) en la rama `claude/dcode-partners-changes-governance-tvyk6k`.
RESPONSABLE: Sesión de Claude Code, a petición de Dirección.
TICKET RELACIONADO: CAM-20260814-001.

---

FECHA: 2026-08-18
CAMBIO: Construcción completa de "D-Code Content Factory" V1 (Video Engine con
Remotion + identidad de marca, Content Engine en n8n, GitHub Actions como motor
de render sin coste, QA Engine de 3 niveles, 3 vídeos de prueba reales).
MOTIVO: Autorización explícita de Dirección (DCP-CONTENT-FACTORY-001) para
construir de cero, con autonomía completa salvo credenciales/costes externos.
ÁREA: Producto / Contenido / Automatizaciones.
ESTADO ANTERIOR: no existía ninguna fábrica de contenido automatizada.
ESTADO NUEVO: sistema completo de creación de contenido audiovisual hasta el
límite de lo construible sin publicador real ni credenciales externas. Ningún
workflow activado, ninguna publicación real.
EVIDENCIA: Commit `d8ed49e` en `claude/dcode-partners-changes-governance-tvyk6k`.
Informe `DCP-CONTENT-FACTORY-FINAL` (PDF enviado a Dirección).
RESPONSABLE: Sesión de Claude Code, a petición de Dirección.
TICKET RELACIONADO: DCP-CONTENT-FACTORY-001.

---

FECHA: 2026-08-18
CAMBIO: Evolución a "D-Code Daily Content Engine" V2 — Audio Engine (7 familias
musicales + SFX generados por código, TTS opcional vía espeak-ng), Post Engine
independiente (LinkedIn + Instagram), Memory Engine semántico + Diversity Gate
(embeddings, similitud coseno, decisión de formato incl. NO_PUBLICAR), Research
Engine ampliado (3 fuentes RSS + autoanálisis real de la web de D-Code +
autoanálisis de contenido propio). V1 no se rehizo, solo se extendió.
MOTIVO: Autorización explícita de Dirección (DCP-CONTENT-FACTORY-002).
ÁREA: Producto / Contenido / Automatizaciones.
ESTADO ANTERIOR: ver entrada anterior (V1) — vídeo mudo por defecto, sin Post
Engine, memoria editorial limitada a 30 días y a tema/hook/formato, investigación
basada en 1 sola fuente RSS.
ESTADO NUEVO: audio con criterio (incl. silencio intencionado como opción válida),
Post Engine con 6 piezas de prueba validadas contra schema, 2 workflows n8n nuevos
+ 2 actualizados (todos inactivos), 5 vídeos de prueba con Audio QA automático
PASA. Limitaciones honestas documentadas (no se puede verificar "se escucha bien"
por escucha real; embeddings semánticos no probados con llamada real desde esta
sesión) — ver informe.
EVIDENCIA: Commit `ea74453` en `claude/dcode-partners-changes-governance-tvyk6k`.
Workflows n8n: `Sip8U9IyPpQ8j6NA`, `H5b13tf9PIrlK4fQ`, `ARLDFrmHWdpQsNTb`,
`t96QwFyZj1Tw6ubc` (todos inactivos). Informe `DCP-CONTENT-FACTORY-V2` (PDF
enviado a Dirección).
RESPONSABLE: Sesión de Claude Code, a petición de Dirección.
TICKET RELACIONADO: DCP-CONTENT-FACTORY-002.

---

FECHA: 2026-08-19
CAMBIO: Cambio de producción en n8n — añadido el guardrail "Modo=Prueba" al
workflow "FNZ/Cobros y Recordatorios de Pago" (`bHFIS358z1VDabVm`), replicando el
patrón ya existente y verificado en su workflow hermano "FNZ/Cobros - Seguimiento"
(`LGmMF8hsxhPf1CiC`). El nodo "Calcular Recordatorios" ahora calcula `modoPrueba`
por factura (bloqueado por defecto si no puede resolverse el cliente); un nuevo
nodo IF "¿Bloqueado Modo Prueba?" enruta los clientes en Modo=Prueba a una
notificación interna (`dcodedepartment@gmail.com`) en vez de al email real del
cliente. Cambio puramente aditivo: ninguna conexión ni nodo existente fue
eliminado, solo se insertó el nuevo IF en medio del enlace
`¿Debe Recordar?→Preparar Notificacion Cobro`.
MOTIVO: Auditoría FASE 1 (mandato DIR-DCP-20260819-MASTER-001) detectó que este
workflow, a diferencia de su hermano, enviaba recordatorios de cobro a clientes
reales sin comprobar el campo `Modo` del cliente en Airtable — el mismo patrón de
riesgo que causó el envío de una factura real a un contacto externo real durante
una prueba, el 2026-08-06 [EVIDENCIA INDIRECTA — hallazgo de la auditoría FASE 1,
no re-verificado contra la fuente primaria en este turno]. Autorizado
explícitamente por Dirección en el mismo turno ("CONFIRMACIÓN DE DIRECCIÓN",
2026-08-19).
ÁREA: Finanzas / Automatizaciones / n8n.
ESTADO ANTERIOR: workflow activo en producción (ejecución diaria 09:30) sin
ninguna comprobación de `Modo` antes de enviar el recordatorio de cobro al email
real del cliente.
ESTADO NUEVO: guardrail activo en producción, verificado dos veces. La versión
activa (`activeVersionId`) coincide con la versión que contiene el guardrail.
EVIDENCIA: [EVIDENCIA DIRECTA] `update_workflow` (n8n MCP, 11 operaciones
aplicadas) + `publish_workflow` (activeVersionId `aba923f3-7fe4-4fa8-b75e-
f2a7f1ba0763`) + dos ejecuciones de prueba controladas con `test_workflow`/
`get_execution` sobre datos simulados (sin credenciales reales de cliente): (1)
ejecución 1707, cliente en Modo=Prueba → ruta bloqueada ejecutada (notificación
interna simulada), ruta de email al cliente NUNCA ejecutada (no aparece en
`runData`); (2) ejecución 1709, cliente fuera de Modo=Prueba → ruta normal
ejecutada (Preparar Notificacion Cobro → Aplicar Plantilla de Email → Enviar
Recordatorio de Pago, con el nodo Gmail final simulado vía pin data, sin envío
real), ruta bloqueada NUNCA ejecutada. Verificación 2: `get_workflow_details`
posterior a publicar confirma `versionId == activeVersionId`, todos los nodos y
conexiones originales intactos, `active: true` preservado, única credencial
auto-asignada la ya existente "Gmail account" (OAuth2) en el nuevo nodo
"Notificar Recordatorio Bloqueado" — ninguna credencial nueva ni modificada.
RESPONSABLE: Sesión de Claude Code, con autorización explícita de Dirección en
este turno.
TICKET RELACIONADO: DIR-DCP-20260819-MASTER-001 (Fase 1, bloque Mejorar) / CAMBIO-011.
