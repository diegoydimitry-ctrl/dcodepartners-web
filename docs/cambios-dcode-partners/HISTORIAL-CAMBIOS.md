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
