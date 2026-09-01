# Pausa controlada de la captación comercial

**Fecha:** 1 de septiembre de 2026
**Autorización:** Dirección, orden directa.
**Motivo:** operativo, NO técnico. Entran más leads de los que D-Code Partners
puede atender ahora mismo. Los 58 leads en estado "Nuevo" son una decisión
deliberada de Dirección, no un fallo del ecosistema.

## Qué se ha hecho exactamente

Se han DESPUBLICADO tres workflows. Despublicar no es borrar:

- `active` pasa a `false` y los disparadores dejan de correr,
- `activeVersionId` pasa a `null`,
- **`versionId` y todos los nodos se conservan intactos.**

No se ha borrado ningún workflow, ningún dato, ninguna empresa, ningún
contacto, ningún lead y ninguna propuesta.

## Workflows pausados

| Workflow | ID | Disparador | Qué hacía | Nodos conservados |
|---|---|---|---|---|
| `AAA/Radar Comercial IA` | `WyEpUqTFD4JLN6Sf` | Diario 06:00 | Prospección con Google Places + auditoría IA. Daba de alta empresas nuevas en Radar Comercial. **Era el motor principal de captación.** | 48 |
| `CM/CRM Inteligente` | `JAxURoa7Y0ADtUUn` | Lunes 06:30 | Volcaba las empresas HOT/WARM del Radar a la tabla Clientes como prospectos. **Alimentaba el pipeline.** | 21 |
| `CM/Recordatorio Comercial` | `yfi2UCTZNrZjXYyT` | Diario 09:00 | Digest interno de leads sin seguimiento y propuestas sin enviar. | 14 |

El tercero no capta nada. Se pausa porque durante la pausa su único efecto es
mandar un correo diario reclamando que se gestionen unos leads que Dirección ha
decidido no gestionar. Esa clase de aviso es exactamente la que enseña a
ignorar el buzón, y este ecosistema ya ha pagado ese precio.

## Cómo se reactiva

Por cada workflow, una sola acción: **publicar la versión que ya está guardada**.

    publish_workflow(workflowId: "WyEpUqTFD4JLN6Sf")   # Radar Comercial
    publish_workflow(workflowId: "JAxURoa7Y0ADtUUn")   # CRM Inteligente
    publish_workflow(workflowId: "yfi2UCTZNrZjXYyT")   # Recordatorio Comercial

O en la interfaz de n8n, el botón Publicar de cada uno. No hay que reconstruir
nada ni volver a configurar credenciales: la versión guardada es exactamente la
que estaba corriendo el 1 de septiembre.

**Orden recomendado al reactivar:** primero Radar, y solo cuando haya vuelto a
llenar Radar Comercial, CRM Inteligente. Al revés, CRM Inteligente correría
sobre datos viejos.

## Lo que sigue funcionando, y por qué

Nada de lo siguiente se ha tocado.

**Comercial que NO es captación:**

- `CM/Cliente Activo (Orquestador)` — da de alta clientes desde propuestas
  ACEPTADAS. Si una de las propuestas ya emitidas se acepta durante la pausa,
  hay que atenderla. Pausar esto sería perder una venta.
- `CM/Alerta Empresa Ya Cliente` — guardarraíl que evita prospectar a quien ya
  es cliente. Es protección, no captación.
- `CM/Detección de Respuestas` — **CRÍTICO. No pausar nunca.** Es lo que
  registra las oposiciones expresas en Supresiones. Detenerlo sería dejar de
  atender solicitudes de exclusión: un riesgo legal, no comercial.
- `CM/Seguimiento Comercial IA` — ya estaba retirado desde el 19/08 por el
  incidente legal. Sigue retirado.

**Todo lo demás intacto:** clientes (CLS/), soporte (SP/), administración y
backups (ADM/), finanzas (FNZ/), proyectos (PRD/), Dirección y Executive Board
(DIR/), guardarraíles (GRD/), D-Code OS y monitorización.

## Dos que NO se han pausado, y la razón

### `MK/Lead IA 360` — el formulario de la web

Recibe por webhook lo que una PERSONA escribe en el formulario de la web
pública. No genera leads: los recibe.

**Pausarlo no reduce la entrada, la destruye.** El formulario seguiría visible
en la web, alguien lo rellenaría, y su mensaje no llegaría a ninguna parte: ni
a Airtable, ni al buzón, ni a una respuesta. Un contacto real perdido en
silencio es peor que un lead sin gestionar, y contradice la instrucción de no
borrar datos.

**Si Dirección quiere cerrar también la entrada inbound, el sitio correcto es
la web, no el webhook:** quitar o deshabilitar el formulario, o sustituirlo por
un aviso de "no estamos aceptando nuevos proyectos ahora mismo". Así quien
llega lo sabe, en vez de escribir al vacío. Eso es una decisión de Dirección y
un cambio en el repositorio de la web pública, no en n8n.

### `CM/Generador de Propuestas IA` — lo dispara una persona

Su disparador es un FORMULARIO que rellena un comercial a mano ("Empresa o
Web" + "Notas del comercial"). No se ejecuta solo: no tiene horario. Y no
contacta con la empresa — deja la propuesta en Drive y avisa al equipo.

Dejarlo publicado no genera ni una sola propuesta por su cuenta, y mantiene
disponible la herramienta por si hace falta preparar una propuesta para un
cliente actual. Si aun así se prefiere cerrarlo, `unpublish_workflow`
("nhZjxvi3p3wM8QY3") y se revierte igual de fácil.

**Observación aparte, no relacionada con la pausa:** los disparadores de tipo
formulario de n8n tienen URL pública. Cualquiera que conociese la dirección
podría lanzar una generación con IA, con su coste. No es urgente ni es lo que
se pidió hoy, pero conviene revisarlo cuando se retome la captación.
