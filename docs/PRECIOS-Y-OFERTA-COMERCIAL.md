# Precios y oferta comercial de D-Code Partners

**Fecha de la ronda:** 24 de septiembre de 2026
**Rama:** `diseno/dcode-design-system` · solo Preview · `main` y Production sin tocar
**Fuente única de los precios:** `catalogo.json` (raíz del repositorio)

Este documento explica **de dónde sale cada precio que hay publicado en la web**: qué
se miró del mercado, qué se decidió cobrar, por qué, y qué sigue sin decidir. No es
material de marketing: es el papel al que hay que volver cuando alguien pregunte
«¿por qué 390 y no 500?» o cuando haya que revisar la tarifa dentro de seis meses.

---

## 0. Lo que hay que saber en un minuto

| | |
|---|---|
| **Dónde viven los precios** | `catalogo.json`. En ningún sitio más. |
| **Qué los publica** | `npm run build:catalogo` → `precios.html`, `en/precios.html`, `assets/js/catalogo-datos.js` |
| **Qué los vigila** | `npm run check:precios` (cuadre catálogo ↔ web) y `npm run qa:precios` (catálogo, filtros, configurador y comparativa en 3 aparatos × 2 idiomas) |
| **Qué NO se ha hecho, a propósito** | No hay pago online, ni Stripe, ni contratación automática. La web dice exactamente eso. |
| **Decisiones que no son mías** | Están en el §8. Ninguna se ha inventado. |

---

## 1. Qué pedía la ronda y qué se ha hecho

| Lo que se pedía | Dónde está |
|---|---|
| Sección PRECIOS en la navegación | `/precios` y `/en/precios`, enlazada en el menú y en el pie de las 66 páginas |
| Catálogo con qué incluye y qué no | 15 productos + 3 packs, con `incluye` / `no_incluye` / `para` |
| Comparador | Filtros por categoría, sector y necesidad, con el estado reflejado en la URL |
| Configurador en vez de formulario plano | `/contacto#configurador`: 5 pasos, ramificado por sector, con estimación |
| Separar DISPONIBLE / PRÓXIMAMENTE / PERSONALIZADO | Estado explícito en cada ficha: «Se contrata hoy», «Se valora el alcance», «Próximamente» |
| Sin pago real | «Hoy no se paga en la web», con los 4 pasos de hoy y los 5 de mañana, uno al lado del otro |
| Un solo sitio para los precios | `catalogo.json`, con dos guardas automáticas que fallan si algo se descuadra |
| Nada de precios contradictorios sueltos | Los tres precios de `/sistema-financiero` y su comparativa de mercado se han movido a `/precios` |
| Investigación de mercado real | §2 de este documento, con URL y fecha de cada cifra |

---

## 2. La investigación de mercado

### 2.0 Cómo se hizo y qué vale

- Todas las cifras salen de **la página de precios del propio fabricante**, consultadas
  el **24 de septiembre de 2026**.
- **No se ha usado ni un solo rango de blog, comparador o agencia.** Cuando una cifra
  solo aparecía fuera de la página de tarifas oficial, se dice de dónde sale.
- Cuando el fabricante **no publica** precio, aquí pone «no público». No se ha estimado
  nada para tapar el hueco.
- **La unidad importa más que el número.** «49 €» por empresa y «49 €» por usuario no
  son el mismo precio. Cada fila lleva su unidad.
- Lo que no se pudo leer está en §2.5. No se rellenó de memoria.

### 2.1 Gestión y contabilidad de pyme (los competidores directos de Finance)

| Producto y plan | Precio de lista | Unidad | IVA | Mensual / anual | Implantación publicada |
|---|---|---|---|---|---|
| Holded Plus | 15,00 €/mes | por empresa | sin IVA (lo dice la página) | mensual o anual | Implementación asistida **desde 99 €/mes** |
| Holded Básico | 29,00 €/mes | por empresa, 2 usuarios; extra 10 €/mes | sin IVA | mensual o anual | ídem |
| Holded Estándar | 59,00 €/mes | por empresa, 4 usuarios | sin IVA | mensual o anual | ídem |
| Holded Avanzado | 99,00 €/mes | por empresa, 7 usuarios | sin IVA | mensual o anual | ídem |
| Holded Premium | 199,00 €/mes | por empresa | sin IVA | mensual o anual | ídem |
| Quipu Starter | 8,50 €/mes · 168 €/año | por empresa, 1 usuario; extra 5 €/mes | no lo dice | ambas | no publica |
| Quipu Solution | 15,00 €/mes · 300 €/año | por empresa, 1 usuario | no lo dice | ambas | no publica |
| Quipu Premium | 29,50 €/mes · 588 €/año | por empresa, 3 usuarios | no lo dice | ambas | no publica |
| Sage 50 Essential | 45 €/mes + IVA | por empresa, hasta 2 usuarios | + IVA | **contrato y pago anual** | no publica |
| Sage 50 Standard | 102 €/mes + IVA | por empresa, hasta 5 usuarios | + IVA | contrato y pago anual | no publica |
| Sage 50 Premium | 152 €/mes + IVA | por empresa, más de 5 usuarios | + IVA | contrato y pago anual | no publica |
| Sage 200 Extra | Desde 50 €/mes | **sin unidad fija**: «dependerá del número de usuarios y de los módulos» | no lo dice | no lo dice | no publica |
| Sage 200 Smart Business | Desde 136 €/mes | ídem | no lo dice | no lo dice | no publica |
| Sage 200 Smart Business Complete | Desde 235 €/mes | ídem | no lo dice | no lo dice | no publica |
| Odoo One App Free | 0 $ | usuarios ilimitados, 1 app | no lo dice | — | — |
| Odoo Standard | 24,90 $/usuario/mes anual · 31,10 $ mensual | **por usuario** | no lo dice | ambas | no obtenida |
| Odoo Custom | 49,00 $/usuario/mes anual · 61,00 $ mensual | **por usuario** | no lo dice | ambas | no obtenida |
| Dynamics 365 BC Essentials | 69,30 €/usuario/mes | **por usuario** | «el precio no incluye IVA» | **pago anual** | no publica |
| Dynamics 365 BC Premium | 95,30 €/usuario/mes | **por usuario** | sin IVA | pago anual | no publica |
| Dynamics 365 BC Team Members | 6,90 €/usuario/mes | **por usuario** | sin IVA | pago anual | no publica |
| SAP Business One | **no público** | — | — | — | «Solicite una cotización» |
| Zoho Books (EE. UU., referencia) | 0 / 20 / 50 / 70 / 150 / 275 $/mes | por organización; usuario extra 3 $/mes | no lo dice | ambas | no publica |
| Zoho One | **no público** en las páginas accesibles | por usuario, licencia anual | «no incluyen IVA» | anual | — |
| Xero | sin tarifa para España (sirve EE. UU.: 25 / 55 / 90 $/mes) | por organización | no lo dice | — | no publica |
| QuickBooks España | **no legible** (los importes los carga JavaScript) | por cuenta, 1/3/5/25 usuarios | no lo dice | «sin contrato» | no publica |

**Lo que se aprende de esta tabla, y es lo que decide nuestro precio:**

1. **Hay dos mundos de unidad.** Holded, Quipu, Sage 50 y Zoho Books cobran **por
   empresa** con un cupo de usuarios. Odoo, Dynamics 365 y Zoho One cobran **por
   usuario**. La diferencia se nota: 8 personas en Dynamics 365 Essentials son
   554 €/mes, el mismo equipo en Holded Avanzado son 99 €/mes.
2. **La suscripción barata esconde la implantación.** Holded publica 29 €/mes y, al
   lado, «implementación asistida **desde 99 €/mes**»: la puesta en marcha cuesta más
   que el programa, y es recurrente. Sage 50 ni siquiera se vende online. Sage 200,
   Dynamics 365 y SAP no publican la implantación en ningún sitio.
3. **Casi nadie da un total.** Lo único que el cliente ve es un «desde». Ahí es donde
   se puede competir sin bajar el precio: diciendo el número entero.

### 2.2 Automatización

| Producto y plan | Precio de lista | Unidad | Anual |
|---|---|---|---|
| Zapier Free | 0 $/mes | 100 tasks/mes | no |
| Zapier Professional | desde 19,99 $/mes | task (750/mes en el tramo base, según el blog del propio Zapier) | precio mostrado con pago anual |
| Zapier Team | desde 69 $/mes | task, tramo por slider | ídem |
| Zapier Enterprise | **no público** | — | — |
| Make Free | 0 $/mes | 1.000 créditos/mes | no |
| Make Core | 12 $/mes | 10.000 **créditos**/mes («cada acción de un módulo cuenta como un crédito») | no obligatorio |
| Make Pro | 21 $/mes | 10.000 créditos/mes | no obligatorio |
| Make Teams | 38 $/mes | 10.000 créditos/mes | no obligatorio |
| n8n Community (self-hosted) | **gratis** | sin límite de ejecuciones | no |
| n8n Starter | 20 €/mes | 2.500 ejecuciones de workflow | sí, facturación anual |
| n8n Pro | 50 €/mes | 10.000 ejecuciones | sí |
| n8n Business | 667 €/mes | 40.000 ejecuciones, incluye self-hosted y SSO | sí |
| Power Automate Premium | 15,00 $/usuario/mes | **por usuario** | sí, pago anual |
| Power Automate Process | 150,00 $/bot/mes | **por bot**, RPA desatendido | sí |
| Power Automate Hosted Process | 215,00 $/bot/mes | por bot + máquina virtual | sí |
| Power Automate Process Mining | 5.000,00 $/tenant/mes | por tenant | sí |
| Copilot Studio prepago | 200,00 $/pack/mes | pack de 25.000 créditos | compromiso previo |
| Microsoft 365 Copilot | 30,00 $/usuario/mes | por usuario | sí |

**Lo que se aprende:** la herramienta es barata y **el trabajo no está incluido en
ninguna de estas cifras**. 12 $/mes de Make no montan una automatización: montan el
sitio donde alguien la monta. Quien cobra el montaje son las agencias, y ese precio no
es público en ningún sitio. Nuestro precio de automatización es **precio de trabajo
hecho**, no de licencia, y por eso no se puede comparar cara a cara con esta tabla —
en la web no se compara, justamente por eso.

### 2.3 Agentes de IA y atención

| Producto y plan | Precio de lista | Unidad |
|---|---|---|
| Intercom Fin | **0,99 $ por resultado** (9,99 $ si es cualificación) | por resolución, no por conversación |
| Intercom Essential / Advanced / Expert | 29 / 85 / 132 $ por asiento y mes | por asiento, Fin aparte |
| Zendesk Support Team | 19 $/agente/mes | por agente; 5 resoluciones automáticas/agente/mes |
| Zendesk Suite Team / Professional | 55 / 115 $/agente/mes | por agente; 5 y 10 resoluciones |
| Zendesk Copilot (add-on) | 50 $/agente/mes | por agente |
| Zendesk, precio por resolución | **no público**: «pricing based on the value delivered by each resolution» | — |
| Tidio Free / Starter / Growth | 0 / 24,17 / desde 49,17 $/mes | conversación facturable |
| Tidio Lyro (add-on) | desde 32,50 $/mes | conversación de IA, desde 50 |
| Tidio Premium | **no público**, facturación por resolución | — |
| Voiceflow | **no público**, ni un importe en su web | — |
| Salesforce Agentforce | **2 $ por conversación**; Flex Credits 500 $/100.000 | por conversación o crédito |
| Salesforce Agentforce 1 | desde 550 $/usuario/mes | por usuario |
| Freshdesk Growth / Pro / Enterprise | 19 / 55 / 89 $/agente/mes | por agente, 500 sesiones de IA incluidas |
| Freshworks Freddy, sesiones extra | 49 $/100 sesiones (≈0,49 $/sesión) | por sesión |

**Lo que se aprende:** el sector se está moviendo a **cobrar por resultado**
(0,99 $ la resolución de Intercom, 2 $ la conversación de Agentforce, 0,49 $ la sesión
de Freshworks). Es un modelo bueno para quien tiene mucho volumen y **malo para una
pyme**, porque la factura no se puede presupuestar: depende de cuánta gente escriba
ese mes. Nuestra decisión es la contraria y es deliberada: **cuota fija, sin contador**
(§3.4). Es peor negocio para nosotros si el agente se usa muchísimo, y es lo que hace
que una pyme se atreva a encenderlo.

### 2.4 CRM

Los precios de HubSpot, Salesforce y Pipedrive **no se han vuelto a comprobar en esta
ronda** y por eso **no aparecen en la web**. Había una fila de HubSpot en un borrador de
la comparativa (7 – 150 $/licencia y onboarding obligatorio de 1.500 / 3.500 $); se
**retiró** antes de publicar porque no pude verificarla hoy contra la página del
fabricante. Publicar el precio de otro sin poder abrir su tarifa es exactamente lo que
esta ronda vino a quitar. Si se quiere esa comparación, es media hora de trabajo y una
fila más en `catalogo.json`.

### 2.5 Lo que no se pudo verificar (y por eso no está publicado)

| Qué | Por qué |
|---|---|
| Zoho Books y Zoho One en euros | `zoho.com/eu/` bloqueada por su `robots.txt`; la página española de Zoho One trae los importes vacíos en el HTML |
| QuickBooks España | los precios los pinta JavaScript; el HTML dice «Cargando precios actuales…» |
| Odoo en euros | la URL española geolocaliza y devolvió dólares; no se fuerza la vista en EUR |
| Success Pack de Odoo | no se pudo abrir la página. **Se quitó de la web una cifra de «580 a 25.000 $» que estaba en el borrador.** En su lugar la ficha dice «implantación aparte, no incluida en la tarifa», que es lo que sí consta |
| Implantación de Sage 200, Dynamics 365 y SAP | no la publican |
| Precio por resolución de Zendesk | no lo publica |
| Voiceflow | no publica ningún importe |
| Volumen del tramo base de Zapier | 750 tasks sale del **blog de Zapier**, no de su página de precios; marcado como tal |

### 2.6 Fuentes

Todas consultadas el **24 de septiembre de 2026**:

1. https://www.holded.com/es/precios
2. https://getquipu.com/en/pricing-plans
3. https://www.sage.com/es-es/productos/sage-50cloud/precios/
4. https://www.sage.com/es-es/productos/sage-200/
5. https://www.odoo.com/es_ES/pricing
6. https://www.microsoft.com/es-es/dynamics-365/products/business-central/pricing
7. https://www.sap.com/spain/products/erp/business-one.html
8. https://www.zoho.com/books/pricing/ · https://www.zoho.com/one/pricing/
9. https://www.xero.com/pricing-plans/
10. https://quickbooks.intuit.com/global/es-es/pricing/
11. https://zapier.com/pricing · https://zapier.com/pricing/rates · https://zapier.com/blog/zapier-pricing/
12. https://www.make.com/en/pricing
13. https://n8n.io/pricing/
14. https://www.microsoft.com/en-us/power-platform/products/power-automate/pricing
15. https://www.microsoft.com/en-us/microsoft-copilot/microsoft-copilot-studio
16. https://www.intercom.com/pricing · https://fin.ai/pricing/
17. https://www.zendesk.com/pricing/ · https://www.zendesk.com/service/ai-agents/
18. https://www.tidio.com/pricing/
19. https://www.voiceflow.com/pricing
20. https://www.salesforce.com/agentforce/pricing/
21. https://www.freshworks.com/freshdesk/pricing/

De estas, **las seis que se publican en la web** (Holded, Quipu, Sage 50, Sage 200,
Odoo y Dynamics 365) van con su enlace en la propia página, en `/precios`, para que
cualquiera compruebe la cifra sin fiarse de nosotros.

---

## 3. Los precios de D-Code y por qué son esos

### 3.0 Las tres reglas que siguen todos

1. **Implantación de un pago + cuota mensual.** Nunca solo cuota: montar el sistema es
   trabajo real y cobrarlo diluido en 24 meses obliga a atar al cliente con permanencia,
   que es lo que hace Sage 50 y lo que no queremos hacer.
2. **Cuota por empresa, no por usuario**, salvo la persona adicional de Finance. Es la
   diferencia más visible frente a Odoo y Dynamics 365, y la que hace que crecer no
   castigue.
3. **Todo lo que tiene precio lo enseña.** «Consultar precio» solo donde de verdad
   depende de la empresa, y ahí se dice por qué.

### 3.1 Finance

| Plan | Implantación | Cuota | Para |
|---|---|---|---|
| Finance | 390 € | 29 €/mes | hasta 3 personas en administración |
| Finance con inteligencia | 690 € | 79 €/mes | hasta 10 personas |
| Finance a medida | desde 1.500 € | desde 190 €/mes | alcance que se valora |
| Persona adicional | — | 9 €/mes | |

**Por qué 29 €/mes.** Es exactamente el plan Básico de Holded, que es con lo que nos
van a comparar de cabeza. Al mismo precio mensual, la diferencia se juega en lo que
está incluido y en que la implantación nuestra es **un pago de 390 €** en vez de
**99 €/mes para siempre**. A doce meses: Holded Básico con implementación asistida son
29 × 12 + 99 × 12 = **1.536 €**; Finance son 390 + 29 × 12 = **738 €**. Esa es la frase
comercial, y sale de dos cifras públicas, no de un cálculo nuestro.

**Por qué 390 € de implantación.** Es el suelo por debajo del cual el trabajo de montar
los datos de una empresa no sale rentable, y es una cifra que una pyme aprueba sin
pasar por comité. Es también menos que un mes de la mayoría de los proyectos de la §2.1.

**Por qué 79 € el segundo plan.** Por debajo de los 99 € de Holded Avanzado (7 usuarios)
y muy por debajo de Sage 50 Standard (102 €, 5 usuarios, con permanencia anual), y da
hasta 10 personas.

**Por qué 9 € la persona adicional.** Holded cobra 10 €, Quipu 5 €, Zoho 3 $. 9 € nos
deja justo por debajo del competidor con el que más nos comparan, y muy lejos de los
69,30 € por usuario de Dynamics 365.

### 3.2 D-Code OS y sistemas a medida

| | Implantación | Cuota |
|---|---|---|
| D-Code OS | desde 2.900 € | desde 190 €/mes |
| Sistema a medida | desde 1.500 € | desde 190 €/mes |

Ambos con estado **«Se valora el alcance»**: el precio depende de qué se construye y
la web lo dice en vez de fingir una tarifa. El «desde 2.900 €» no es un ancla
inventada: es el punto donde un despliegue de OS deja de ser un Finance con extras.
Como referencia externa, un Success Pack de Odoo o una implantación de Dynamics 365
por partner empiezan por encima de esa cifra, y ninguna de las dos se publica.

### 3.3 Automatizaciones e integraciones

| | Precio |
|---|---|
| Una automatización | desde 390 € |
| Paquete de automatizaciones | desde 1.200 € |
| Automatización con IA | desde 2.400 € |
| Mantenimiento | desde 150 €/mes |
| Conectar dos herramientas | desde 490 € |
| Conectar con tu ERP o sistema propio | desde 1.200 € |

Aquí **no hay comparable público**: las licencias de Zapier, Make y n8n (§2.2) son el
sitio donde se trabaja, no el trabajo. Lo que se vende es una automatización montada y
funcionando. El 390 € se escoge a propósito **igual que la implantación de Finance**:
es el «una cosa, bien hecha, sin reunión previa» de la casa, y que las dos primeras
compras posibles cuesten lo mismo hace la decisión más fácil.

El mantenimiento va aparte y se dice: una automatización sin nadie detrás se rompe el
día que el otro cambia su API, y cobrarlo escondido dentro del precio de montaje sería
mentir sobre lo que cuesta tenerla.

### 3.4 Agentes de IA

| | Implantación | Cuota |
|---|---|---|
| Agente de un canal | desde 750 € | desde 90 €/mes |
| Agente multicanal | desde 1.500 € | desde 190 €/mes |

**Cuota fija, sin contador.** Es la decisión más deliberada de toda la tarifa y va
contra el sector entero (§2.3). Con Intercom Fin, 300 resoluciones son 297 $ ese mes;
con Agentforce, 300 conversaciones son 600 $. Con nosotros son 90 €, se use 30 veces o
600. Se asume el riesgo del volumen a cambio de que el cliente pueda **presupuestarlo**
y no lo apague por miedo a la factura. Si algún cliente se sale de escala, se renegocia
por escrito; no se le pasa un recibo sorpresa.

### 3.5 Los tres packs

| Pack | Precio | Suelto sería | Ahorro |
|---|---|---|---|
| Empezar | 990 € + 29 €/mes | 1.170 € | 180 € |
| Operar | 2.290 € + 149 €/mes | 2.640 € + 169 €/mes | 350 € + 20 €/mes |
| Sistema completo | desde 6.900 € + desde 390 €/mes | 8.690 € + 459 €/mes | 1.790 € + 69 €/mes |

El descuento va **del 13 % al 21 %** (15,4 % en Empezar, 13,3 % en Operar, 20,6 % en
Sistema completo, sobre la implantación). Los «suelto sería» no
son un precio tachado de escaparate: se pueden sumar uno a uno con las fichas del
catálogo, y `check:precios` verifica que ambos números siguen en la página.

### 3.6 El diagnóstico es gratis

Y lo será. Es el único sitio de todo el catálogo donde la palabra «gratis» aparece, y
es lo que hace que el resto de la tarifa se pueda enseñar sin miedo: quien no sabe qué
necesita no tiene que pagar por averiguarlo.

---

## 4. Cómo se contrata hoy, y por qué se dice

La web publica los dos flujos, uno al lado del otro:

- **Hoy:** eliges → lo solicitas → lo configuramos contigo → lo implantamos.
- **Cuando lo haya:** eliges → pagas → se activa → se configura → funcionando.

Con esta frase debajo: «Hoy no se paga en la web. Nos lo pides, lo configuramos contigo
y lo implantamos nosotros. La compra directa llegará; cuando llegue, lo dirá aquí.»

**No hay Stripe, ni pasarela, ni contratación automática.** Los botones dicen
«Solicitar activación» y llevan a `/contacto?quiero=<id>`, que pre-rellena el
configurador. Decirlo así, en vez de esconderlo, es lo que evita que alguien llegue al
final esperando un carrito.

---

## 5. El configurador

Cinco pasos en `/contacto#configurador`, antes del formulario de siempre:

1. **Sector** — de los 9 del catálogo.
2. **Qué mejorar** — las opciones **cambian según el sector** elegido.
3. **Cuánta gente.**
4. **Qué piezas** — del catálogo.
5. **Nivel** — que aplica un coeficiente (×1, ×1,25, ×1,6).

Al final: un resumen en vivo y una **«Estimación inicial»** en forma de rango
(setup × 0,9 a setup × 1,25), calculada sobre los precios reales de
`window.DCP_CATALOGO`, nunca sobre números escritos a mano. **Los datos de contacto se
piden al final**, no al principio.

El resultado se vuelca en el campo `#mensaje` del formulario que ya existía, más un
campo oculto `configuracion`. El envío, el consentimiento y Turnstile **no se han
tocado**.

---

## 6. Una sola fuente, y dos guardas que no dejan que se rompa

```
catalogo.json  ──build:catalogo──▶  precios.html · en/precios.html · catalogo-datos.js
      │
      └──────── check:precios ────▶  cuadra con precios.json y con lo que hay en la página
```

**`npm run check:precios`** falla si:

- un «desde» de `precios.json` dice un número distinto al de `catalogo.json`;
- la ficha de un producto **no lleva su propio precio** (se comprueba dentro de su
  `<article>`, no en cualquier parte de la página: si no, la comparativa de mercado
  haría pasar el aviso por encima);
- falta el aviso de precios de referencia;
- **una fila de la comparativa no trae la URL de la tarifa publicada**;
- falta en la página la fecha y el criterio de la comparativa.

**`npm run qa:precios`** abre la web en 3 aparatos × 2 idiomas y comprueba que no queda
**ninguna cifra comercial suelta fuera de `/precios`**, que el catálogo y los filtros
responden, que la comparativa viene plegada y se abre, que sus enlaces son `https` +
`_blank` + `noopener`, y que el configurador llega hasta el final y rellena el
formulario.

Ambas se han **probado rompiéndolas**: poner un precio suelto en `servicios.html`,
cambiar un precio de la página sin regenerarla, quitar `noopener`, dejar la comparativa
abierta y quitar una URL. Las cinco se cazaron; luego se restauró todo.

### Lo que se quitó de otras páginas

| Dónde | Qué | Ahora |
|---|---|---|
| `sistema-financiero.html` · `en/` | los tres precios de los planes | enlace «Ver precio en Precios →» |
| `sistema-financiero.html` · `en/` | la comparativa «Lo que cuesta montar esto en el mercado» con «D-Code Finance 738 – 3.780 €» | enlace a la comparativa de `/precios`, ahora con fuentes |

Esa comparativa antigua decía «Holded 4.000 – 12.000 €», «Odoo 10.000 – 45.000 €» y
«Sage 200 18.000 – 55.000 €». **No he podido verificar ninguna de las tres**: no son
tarifas publicadas por esos fabricantes. Se han sustituido por las de §2.1, que sí lo
son y llevan enlace. La cifra propia (738 – 3.780 €) era correcta —sale de 390 + 29×12
y de 1.500 + 190×12— pero era un precio comercial viviendo fuera de `/precios`, que es
justo lo que esta ronda venía a terminar.

**Cifras que siguen fuera de `/precios` a propósito**, y por qué no son precios:

- `index.html`, bloque `data-dx`: los 18 / 25 / 35 / 50 € son **el coste de una hora de
  la gente del cliente**, que lo elige quien usa la calculadora.
- `index.html`, `data-os-datos` y la demo de Finance: datos de empresas ficticias.

`qa:precios` ignora esas dos regiones **por marca concreta**, no por comodín: si mañana
alguien mete un precio real ahí dentro, hay que tocar el script a propósito.

---

## 7. Lo que se comprobó antes de publicar

| Comprobación | Resultado |
|---|---|
| `check:estado` | ✓ 98 ficheros barridos · meta-prueba 17 cazadas / 13 respetadas |
| `check:precios` | ✓ 28 marcas al día y el catálogo cuadra con la web |
| `check:og` · `check:enlaces` · `check:kb` | ✓ (la base del asistente regenerada con `/precios`) |
| `check:consentimiento` · `check:demo` | ✓ |
| `check:tema` | ✓ 68 páginas · 54 contrastes de texto claro ≥ 4,5:1 |
| `check:superficie` | ✓ ningún contenido interno se despliega |
| `qa:precios` | ✓ 3 aparatos × 2 idiomas, 12 recorridos completos |
| Comparativa a ojo | PC 1440, iPad 1024 y móvil 393, tema claro y oscuro, ES y EN: ninguna fila se corta ni desborda, nada la tapa |

---

## 8. Lo que NO he decidido, porque es decisión de negocio

Está todo **preparado** en `catalogo.json`; solo hay que cambiar el número y volver a
generar. No he inventado ninguna de estas reglas:

1. **Descuento por pago anual.** No existe. Todos los competidores de §2.1 lo ofrecen
   (Sage 50 solo vende así). Es probablemente la decisión de tarifa más rentable que
   queda pendiente, y también la que más compromete: obliga a mantener el cliente 12
   meses.
2. **IVA.** Todo se publica sin IVA, como el sector. Si se quiere mostrar con IVA para
   autónomos, es un campo en `catalogo.json`.
3. **Permanencia.** No hay. No se dice que no la haya. Decirlo explícitamente sería un
   argumento fuerte frente a Sage, pero es un compromiso, no una redacción.
4. **Qué pasa si un agente se dispara de volumen.** La tarifa es fija (§3.4) y no dice
   qué ocurre en el caso extremo. Hoy la respuesta es «se renegocia por escrito». Si se
   quiere un techo publicado, hay que decidir cuál.
5. **Precio de «Próximamente».** Los productos en ese estado no llevan cifra. Cuando la
   lleven, hay que decidirla.
6. **Los CRM de §2.4** en la comparativa: sí o no.
7. **Pago online.** Fuera de esta ronda por instrucción expresa. Cuando entre, el texto
   de «cómo será» ya está escrito y solo hay que cambiar el estado.

---

## 9. Para la próxima revisión de tarifa

- Volver a abrir **las seis URL** que se publican en `/precios` y cambiar
  `mercado.consultado` y el texto de `mercado.sub`. Si una cifra ha cambiado y no se
  actualiza, la web estará publicando el precio equivocado **de otra empresa**, que es
  peor que equivocarse en el propio.
- Cambiar precios **solo en `catalogo.json`** y ejecutar `npm run build:catalogo` y
  `npm run generate-kb`.
- Pasar `npm run check:precios` y `npm run qa:precios` antes de publicar.
- Revisar §8: cada punto que se decida sale de esta lista y entra en la web.
