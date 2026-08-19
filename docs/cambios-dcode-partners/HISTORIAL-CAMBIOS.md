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

FECHA: 2026-08-18
CAMBIO: DCP-CONTENT-FACTORY-003 — eliminación de TTS del pipeline automático
(voz sintética retirada, ver decisión de Dirección de no usar voz sintética como
elemento principal) y Diversity Score compuesto real (5 dimensiones ponderadas:
tema 0.45, estructura 0.20, audio 0.15, CTA 0.10, formato 0.10, con regla de
"estructura clonada" y distinción explícita ADAPTACION_MULTIPLATAFORMA vs
DUPLICADO_PROBABLE/REPETICION_PARCIAL/DIVERSO), integrado en los 3 workflows de
producción n8n relevantes.
MOTIVO: Orden de trabajo nocturna DCP-CONTENT-FACTORY-003 (15 prioridades,
sección 10). Esta entrada se registra ahora (19/08/2026) de forma retroactiva:
el trabajo se completó y se pusheó la noche del 18/08/2026, pero la sesión que lo
hizo terminó su turno tras escribir `CONTINUATION-STATE.md` sin registrar esta
entrada en el historial — corregido aquí, sin reabrir ni repetir el trabajo.
ÁREA: Producto / Contenido / Automatizaciones.
ESTADO ANTERIOR: ver entrada V2 — vídeo con audio opcional vía TTS
(`espeak-ng`), Diversity Gate basado solo en similitud de tema.
ESTADO NUEVO: pipeline automático 100% sin voz (música/SFX únicamente, decisión
de audio por pieza incl. silencio intencionado como opción válida), Diversity
Score compuesto de 5 dimensiones en los 3 workflows relevantes, 32 pruebas
automáticas en verde (`npm test`) + `npm run typecheck` sin errores, 2 bugs
reales corregidos (script `render` roto en `package.json`; nodo de posts que
leía `$json` tras un HTTP node roto en la rama con slides). Los 4 workflows
siguen `active: false` (verificado explícitamente, no solo asumido). Ninguna
ejecución real contra la cuenta de n8n todavía.
EVIDENCIA: Commit `f573e23` en `claude/dcode-partners-changes-governance-tvyk6k`.
Checkpoint técnico completo en `automation/content-factory/CONTINUATION-STATE.md`
(commit `4159fa2`). `npm test`: 32/32 tests, 10/10 suites, 0 fail.
`node scripts/audio-qa.mjs out/*.mp4`: 5/5 PASA.
RESPONSABLE: Sesión de Claude Code, a petición de Dirección.
TICKET RELACIONADO: DCP-CONTENT-FACTORY-003.

---

FECHA: 2026-08-19
CAMBIO: DCP-CONTENT-FACTORY-004 — actualización de `automation/content-factory/
README.md` para reflejar el estado real V2 + DCP-CONTENT-FACTORY-003 (seguía
describiendo solo la V1 de 2 workflows) y corrección de un dato desactualizado:
el README anterior decía que las credenciales de Gemini y GitHub PAT faltaban
por crear; verificado con `list_credentials` de n8n que ambas YA EXISTEN
(`Gemini - DCode Content Factory`, `GitHub - DCode Content Factory`) — lo que
falta de verdad es una primera ejecución real supervisada que confirme que
están correctamente vinculadas y funcionan de punta a punta.
MOTIVO: Reasignación de Dirección del proyecto activo y prioritario a RRSS /
Content Factory. Siguiendo el "próximo paso exacto" que la propia sesión
anterior dejó documentado en `CONTINUATION-STATE.md` sección J antes de tocar
nada en producción.
ÁREA: Producto / Contenido / Automatizaciones / Documentación.
ESTADO ANTERIOR: README desactualizado (solo V1), credenciales reportadas como
pendientes de crear.
ESTADO NUEVO: README refleja los 4 workflows reales (Research/Memory/Video/Post
Engine) con sus IDs, el routing por `formatoDecidido`, y el estado real de
credenciales/decisiones pendientes. Ningún workflow activado, ninguna
credencial modificada, ninguna publicación real — solo documentación y
verificación de solo lectura.
EVIDENCIA: Commit `43c1c23` en `claude/dcode-partners-changes-governance-tvyk6k`.
`list_credentials` (n8n MCP), `get_workflow_details` sobre los 4 workflows
CF/*, 19/08/2026.
RESPONSABLE: Sesión de Claude Code, a petición de Dirección.
TICKET RELACIONADO: DCP-CONTENT-FACTORY-004.
