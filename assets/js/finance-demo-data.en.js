/* ============================================================
   D-Code Finance — public demo data (English)
   ============================================================

   THIS IS THE PRODUCT’S OWN DATA, NOT FIGURES INVENTED FOR THE SITE.

   Generated from assets/js/finance-demo-data.js by /tmp/gen/gen-en.py.
   Same records, same amounts, same dates — only the wording changes, and
   every string is translated by hand from a closed dictionary. If the
   Spanish file grows a sentence that is not in that dictionary the
   generator stops instead of shipping half-English. That is the whole
   point: this file fell a full rewrite behind once, and the English demo
   threw on its own dashboard.

     · NAMES. Every company, person and supplier name is invented.
       Addresses are made up and e-mails use .example, which RFC 2606
       reserves and which never resolves.

     · DATES. Each date is stored as an OFFSET in days and recomposed on
       load, so the demo never ages: “recent activity” is always recent.
   ============================================================ */
(function (global) {
  'use strict';

  var CRUDO = {"clientes": [{"id": "c0", "empresa": "Vandria Logística S.L.", "estado": "client", "sector": "Logistics", "email": "facturacion@vandria-logistica-s-l.example", "telefono": "+34 910000000", "nif": "B10000000", "direccionFiscal": "Calle Ficticia 1, España", "cuotaMensual": 1200}, {"id": "c1", "empresa": "Pelmar Retail", "estado": "client", "sector": "Retail", "email": "facturacion@pelmar-retail.example", "telefono": "+34 910000137", "nif": "B10007919", "direccionFiscal": "Calle Ficticia 2, España", "cuotaMensual": 800}, {"id": "c2", "empresa": "Ferretería Olvanta", "estado": "client", "sector": "Industrial", "email": "facturacion@ferreteria-olvanta.example", "telefono": "+34 910000274", "nif": "B10015838", "direccionFiscal": "Calle Ficticia 3, España", "cuotaMensual": null}, {"id": "c3", "empresa": "Grupo Alimentario Brance", "estado": "client", "sector": "Food", "email": "facturacion@grupo-alimentario-brance.example", "telefono": "+34 910000411", "nif": "B10023757", "direccionFiscal": "Calle Ficticia 4, España", "cuotaMensual": 1500}, {"id": "c4", "empresa": "Clínica Dental Solmara", "estado": "client", "sector": "Health", "email": "facturacion@clinica-dental-solmara.example", "telefono": "+34 910000548", "nif": "B10031676", "direccionFiscal": "Calle Ficticia 5, España", "cuotaMensual": 450}, {"id": "c5", "empresa": "Arquitectura Veltris", "estado": "client", "sector": "Architecture", "email": "facturacion@arquitectura-veltris.example", "telefono": "+34 910000685", "nif": "B10039595", "direccionFiscal": "Calle Ficticia 6, España", "cuotaMensual": null}, {"id": "c6", "empresa": "Talleres Korvan", "estado": "client", "sector": "Automotive", "email": "facturacion@talleres-korvan.example", "telefono": "+34 910000822", "nif": "B10047514", "direccionFiscal": "Calle Ficticia 7, España", "cuotaMensual": 600}, {"id": "c7", "empresa": "Editorial Tarnia", "estado": "client", "sector": "Publishing", "email": "facturacion@editorial-tarnia.example", "telefono": "+34 910000959", "nif": "B10055433", "direccionFiscal": "Calle Ficticia 8, España", "cuotaMensual": null}, {"id": "c8", "empresa": "Hostelería Malvés", "estado": "client", "sector": "Hospitality", "email": "facturacion@hosteleria-malves.example", "telefono": "+34 910001096", "nif": "B10063352", "direccionFiscal": "Calle Ficticia 9, España", "cuotaMensual": 350}, {"id": "c9", "empresa": "Seguros Lintara", "estado": "client", "sector": "Insurance", "email": "facturacion@seguros-lintara.example", "telefono": "+34 910001233", "nif": "B10071271", "direccionFiscal": "Calle Ficticia 10, España", "cuotaMensual": 900}, {"id": "c10", "empresa": "Bodegas Arnisel", "estado": "prospect", "sector": "Food", "email": "facturacion@bodegas-arnisel.example", "telefono": "+34 910001370", "nif": null, "direccionFiscal": null, "cuotaMensual": null}, {"id": "c11", "empresa": "Inmobiliaria Ludvara", "estado": "prospect", "sector": "Real estate", "email": "facturacion@inmobiliaria-ludvara.example", "telefono": "+34 910001507", "nif": null, "direccionFiscal": null, "cuotaMensual": null}, {"id": "c12", "empresa": "Fernwald Logistik GmbH", "estado": "client", "sector": "Logistics", "email": "facturacion@fernwald-logistik-gmbh.example", "telefono": "+34 910001644", "nif": "DE300095028", "direccionFiscal": "Calle Ficticia 13, Alemania", "cuotaMensual": 1200}], "proveedores": [{"id": "v0", "nombre": "Nubalia Cloud", "nif": "A20000000", "email": "admin@nubalia-cloud.example", "telefono": "+34 920000000", "categoria": "Infrastructure"}, {"id": "v1", "nombre": "Suministros Gráficos Perlan", "nif": "A20004441", "email": "admin@suministros-graficos-perlan.example", "telefono": "+34 920000311", "categoria": "Supplies"}, {"id": "v2", "nombre": "Gestoría Menvia", "nif": "A20008882", "email": "admin@gestoria-menvia.example", "telefono": "+34 920000622", "categoria": "Professional services"}, {"id": "v3", "nombre": "Coworking Belvedo", "nif": "A20013323", "email": "admin@coworking-belvedo.example", "telefono": "+34 920000933", "categoria": "Rent"}, {"id": "v4", "nombre": "Telecom Sarkia", "nif": "A20017764", "email": "admin@telecom-sarkia.example", "telefono": "+34 920001244", "categoria": "Telecoms"}, {"id": "v5", "nombre": "Seguros Lintara", "nif": "A20022205", "email": "admin@seguros-lintara.example", "telefono": "+34 920001555", "categoria": "Insurance"}, {"id": "v6", "nombre": "Formación Oribel", "nif": "A20026646", "email": "admin@formacion-oribel.example", "telefono": "+34 920001866", "categoria": "Training"}, {"id": "v7", "nombre": "Viajes Tarsen", "nif": "A20031087", "email": "admin@viajes-tarsen.example", "telefono": "+34 920002177", "categoria": "Travel"}, {"id": "v8", "nombre": "Talento Externo Rivelda", "nif": "A20035528", "email": "admin@talento-externo-rivelda.example", "telefono": "+34 920002488", "categoria": "Subcontracting"}, {"id": "v9", "nombre": "Suite Norlem", "nif": "A20039969", "email": "admin@suite-norlem.example", "telefono": "+34 920002799", "categoria": "Software"}, {"id": "v10", "nombre": "Quiosco Prensa Belvedo", "nif": "A20044410", "email": "admin@quiosco-prensa-belvedo.example", "telefono": "+34 920003110", "categoria": "Publications"}, {"id": "v11", "nombre": "Caja Fiduciaria Alvedo", "nif": "A20048851", "email": "admin@caja-fiduciaria-alvedo.example", "telefono": "+34 920003421", "categoria": "Financial services"}], "proyectos": [{"id": "p0", "nombre": "Route automation", "empresa": "Vandria Logística S.L.", "clienteId": "c0", "estado": "delivered", "inicio": 380, "prevista": 290, "real": 298, "servicios": "n8n integration + delivery route optimisation", "responsable": "D-Code team"}, {"id": "p1", "nombre": "Sales KPI dashboard", "empresa": "Pelmar Retail", "clienteId": "c1", "estado": "delivered", "inicio": 349, "prevista": 259, "real": 266, "servicios": "Dashboard with live sales figures", "responsable": "D-Code team"}, {"id": "p2", "nombre": "AI-assisted inventory", "empresa": "Ferretería Olvanta", "clienteId": "c2", "estado": "delivered", "inicio": 317, "prevista": 227, "real": 233, "servicios": "Stock forecasting and restock alerts", "responsable": "D-Code team"}, {"id": "p3", "nombre": "Supplier portal", "empresa": "Grupo Alimentario Brance", "clienteId": "c3", "estado": "in_progress", "inicio": 286, "prevista": 196, "real": null, "servicios": "Supplier onboarding and tracking", "responsable": "D-Code team"}, {"id": "p4", "nombre": "Smart scheduling", "empresa": "Clínica Dental Solmara", "clienteId": "c4", "estado": "in_progress", "inicio": 254, "prevista": 164, "real": null, "servicios": "Automatic appointment reminders", "responsable": "D-Code team"}, {"id": "p5", "nombre": "Document manager", "empresa": "Arquitectura Veltris", "clienteId": "c5", "estado": "in_progress", "inicio": 222, "prevista": 132, "real": null, "servicios": "Automatic filing of drawings and specifications", "responsable": "D-Code team"}, {"id": "p6", "nombre": "Vehicle check-in", "empresa": "Talleres Korvan", "clienteId": "c6", "estado": "on_hold", "inicio": 193, "prevista": 103, "real": null, "servicios": "Digitised check-in sheet", "responsable": "D-Code team"}, {"id": "p7", "nombre": "Digital catalogue", "empresa": "Editorial Tarnia", "clienteId": "c7", "estado": "in_progress", "inicio": 161, "prevista": 71, "real": null, "servicios": "Automated catalogue publishing", "responsable": "D-Code team"}], "facturas": [{"id": "f0", "numero": "F-2026-0001", "clienteId": "c0", "cliente": "Vandria Logística S.L.", "proyecto": null, "emision": 384, "vencimiento": 354, "importe": 1452, "base": 1200, "iva": 252, "estado": "paid", "cobrado": 1452, "metodoPago": "Bank transfer", "pago": 363, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f1", "numero": "F-2026-0002", "clienteId": "c1", "cliente": "Pelmar Retail", "proyecto": null, "emision": 384, "vencimiento": 354, "importe": 968, "base": 800, "iva": 168, "estado": "paid", "cobrado": 968, "metodoPago": "Bank transfer", "pago": 342, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f2", "numero": "F-2026-0003", "clienteId": "c3", "cliente": "Grupo Alimentario Brance", "proyecto": null, "emision": 384, "vencimiento": 354, "importe": 1815, "base": 1500, "iva": 315, "estado": "paid", "cobrado": 1815, "metodoPago": "Bank transfer", "pago": 351, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f3", "numero": "F-2026-0004", "clienteId": "c4", "cliente": "Clínica Dental Solmara", "proyecto": null, "emision": 384, "vencimiento": 354, "importe": 544.5, "base": 450, "iva": 94.5, "estado": "paid", "cobrado": 544.5, "metodoPago": "Bank transfer", "pago": 328, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f4", "numero": "F-2026-0005", "clienteId": "c6", "cliente": "Talleres Korvan", "proyecto": null, "emision": 384, "vencimiento": 354, "importe": 726, "base": 600, "iva": 126, "estado": "overdue", "cobrado": 0, "metodoPago": "Bank transfer", "pago": null, "recordatorios": 2, "serie": "F", "proyectoId": null}, {"id": "f5", "numero": "F-2026-0006", "clienteId": "c8", "cliente": "Hostelería Malvés", "proyecto": null, "emision": 384, "vencimiento": 354, "importe": 423.5, "base": 350, "iva": 73.5, "estado": "paid", "cobrado": 423.5, "metodoPago": "Bank transfer", "pago": 346, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f6", "numero": "F-2026-0007", "clienteId": "c9", "cliente": "Seguros Lintara", "proyecto": null, "emision": 384, "vencimiento": 354, "importe": 1089, "base": 900, "iva": 189, "estado": "paid", "cobrado": 1089, "metodoPago": "Bank transfer", "pago": 357, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f7", "numero": "F-2026-0008", "clienteId": "c12", "cliente": "Fernwald Logistik GmbH", "proyecto": null, "emision": 384, "vencimiento": 354, "importe": 1200, "base": 1200, "iva": 0, "estado": "paid", "cobrado": 1200, "metodoPago": "Bank transfer", "pago": 336, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f8", "numero": "F-2026-0009", "clienteId": "c0", "cliente": "Vandria Logística S.L.", "proyecto": "Route automation", "emision": 367, "vencimiento": 337, "importe": 10587.5, "base": 8750, "iva": 1837.5, "estado": "paid", "cobrado": 10587.5, "metodoPago": "Bank transfer", "pago": 346, "recordatorios": 0, "serie": "F", "proyectoId": "p0"}, {"id": "f9", "numero": "F-2026-0010", "clienteId": "c0", "cliente": "Vandria Logística S.L.", "proyecto": null, "emision": 354, "vencimiento": 324, "importe": 1452, "base": 1200, "iva": 252, "estado": "paid", "cobrado": 1452, "metodoPago": "Bank transfer", "pago": 333, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f10", "numero": "F-2026-0011", "clienteId": "c1", "cliente": "Pelmar Retail", "proyecto": null, "emision": 354, "vencimiento": 324, "importe": 968, "base": 800, "iva": 168, "estado": "paid", "cobrado": 968, "metodoPago": "Bank transfer", "pago": 312, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f11", "numero": "F-2026-0012", "clienteId": "c3", "cliente": "Grupo Alimentario Brance", "proyecto": null, "emision": 354, "vencimiento": 324, "importe": 1815, "base": 1500, "iva": 315, "estado": "paid", "cobrado": 1815, "metodoPago": "Bank transfer", "pago": 321, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f12", "numero": "F-2026-0013", "clienteId": "c4", "cliente": "Clínica Dental Solmara", "proyecto": null, "emision": 354, "vencimiento": 324, "importe": 544.5, "base": 450, "iva": 94.5, "estado": "paid", "cobrado": 544.5, "metodoPago": "Bank transfer", "pago": 298, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f13", "numero": "F-2026-0014", "clienteId": "c6", "cliente": "Talleres Korvan", "proyecto": null, "emision": 354, "vencimiento": 324, "importe": 726, "base": 600, "iva": 126, "estado": "paid", "cobrado": 726, "metodoPago": "Bank transfer", "pago": 283, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f14", "numero": "F-2026-0015", "clienteId": "c8", "cliente": "Hostelería Malvés", "proyecto": null, "emision": 354, "vencimiento": 324, "importe": 423.5, "base": 350, "iva": 73.5, "estado": "paid", "cobrado": 423.5, "metodoPago": "Bank transfer", "pago": 316, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f15", "numero": "F-2026-0016", "clienteId": "c9", "cliente": "Seguros Lintara", "proyecto": null, "emision": 354, "vencimiento": 324, "importe": 1089, "base": 900, "iva": 189, "estado": "paid", "cobrado": 1089, "metodoPago": "Bank transfer", "pago": 327, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f16", "numero": "F-2026-0017", "clienteId": "c12", "cliente": "Fernwald Logistik GmbH", "proyecto": null, "emision": 354, "vencimiento": 324, "importe": 1200, "base": 1200, "iva": 0, "estado": "paid", "cobrado": 1200, "metodoPago": "Bank transfer", "pago": 306, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f17", "numero": "F-2026-0018", "clienteId": "c0", "cliente": "Vandria Logística S.L.", "proyecto": null, "emision": 323, "vencimiento": 293, "importe": 1452, "base": 1200, "iva": 252, "estado": "paid", "cobrado": 1452, "metodoPago": "Bank transfer", "pago": 302, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f18", "numero": "F-2026-0019", "clienteId": "c1", "cliente": "Pelmar Retail", "proyecto": null, "emision": 323, "vencimiento": 293, "importe": 968, "base": 800, "iva": 168, "estado": "paid", "cobrado": 968, "metodoPago": "Bank transfer", "pago": 281, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f19", "numero": "F-2026-0020", "clienteId": "c3", "cliente": "Grupo Alimentario Brance", "proyecto": null, "emision": 323, "vencimiento": 293, "importe": 1815, "base": 1500, "iva": 315, "estado": "paid", "cobrado": 1815, "metodoPago": "Bank transfer", "pago": 290, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f20", "numero": "F-2026-0021", "clienteId": "c4", "cliente": "Clínica Dental Solmara", "proyecto": null, "emision": 323, "vencimiento": 293, "importe": 544.5, "base": 450, "iva": 94.5, "estado": "paid", "cobrado": 544.5, "metodoPago": "Bank transfer", "pago": 267, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f21", "numero": "F-2026-0022", "clienteId": "c6", "cliente": "Talleres Korvan", "proyecto": null, "emision": 323, "vencimiento": 293, "importe": 726, "base": 600, "iva": 126, "estado": "paid", "cobrado": 726, "metodoPago": "Bank transfer", "pago": 252, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f22", "numero": "F-2026-0023", "clienteId": "c8", "cliente": "Hostelería Malvés", "proyecto": null, "emision": 323, "vencimiento": 293, "importe": 423.5, "base": 350, "iva": 73.5, "estado": "paid", "cobrado": 423.5, "metodoPago": "Bank transfer", "pago": 285, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f23", "numero": "F-2026-0024", "clienteId": "c9", "cliente": "Seguros Lintara", "proyecto": null, "emision": 323, "vencimiento": 293, "importe": 1089, "base": 900, "iva": 189, "estado": "paid", "cobrado": 1089, "metodoPago": "Bank transfer", "pago": 296, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f24", "numero": "F-2026-0025", "clienteId": "c12", "cliente": "Fernwald Logistik GmbH", "proyecto": null, "emision": 323, "vencimiento": 293, "importe": 1200, "base": 1200, "iva": 0, "estado": "overdue", "cobrado": 0, "metodoPago": "Bank transfer", "pago": null, "recordatorios": 2, "serie": "F", "proyectoId": null}, {"id": "f25", "numero": "F-2026-0026", "clienteId": "c2", "cliente": "Ferretería Olvanta", "proyecto": "AI-assisted inventory", "emision": 306, "vencimiento": 276, "importe": 5808, "base": 4800, "iva": 1008, "estado": "paid", "cobrado": 5808, "metodoPago": "Bank transfer", "pago": 262, "recordatorios": 0, "serie": "F", "proyectoId": "p2"}, {"id": "f26", "numero": "F-2026-0027", "clienteId": "c0", "cliente": "Vandria Logística S.L.", "proyecto": null, "emision": 293, "vencimiento": 263, "importe": 1452, "base": 1200, "iva": 252, "estado": "paid", "cobrado": 1452, "metodoPago": "Bank transfer", "pago": 272, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f27", "numero": "F-2026-0028", "clienteId": "c1", "cliente": "Pelmar Retail", "proyecto": null, "emision": 293, "vencimiento": 263, "importe": 968, "base": 800, "iva": 168, "estado": "paid", "cobrado": 968, "metodoPago": "Bank transfer", "pago": 251, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f28", "numero": "F-2026-0029", "clienteId": "c3", "cliente": "Grupo Alimentario Brance", "proyecto": null, "emision": 293, "vencimiento": 263, "importe": 1815, "base": 1500, "iva": 315, "estado": "paid", "cobrado": 1815, "metodoPago": "Bank transfer", "pago": 260, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f29", "numero": "F-2026-0030", "clienteId": "c4", "cliente": "Clínica Dental Solmara", "proyecto": null, "emision": 293, "vencimiento": 263, "importe": 544.5, "base": 450, "iva": 94.5, "estado": "paid", "cobrado": 544.5, "metodoPago": "Bank transfer", "pago": 237, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f30", "numero": "F-2026-0031", "clienteId": "c6", "cliente": "Talleres Korvan", "proyecto": null, "emision": 293, "vencimiento": 263, "importe": 726, "base": 600, "iva": 126, "estado": "paid", "cobrado": 726, "metodoPago": "Bank transfer", "pago": 222, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f31", "numero": "F-2026-0032", "clienteId": "c8", "cliente": "Hostelería Malvés", "proyecto": null, "emision": 293, "vencimiento": 263, "importe": 423.5, "base": 350, "iva": 73.5, "estado": "paid", "cobrado": 423.5, "metodoPago": "Bank transfer", "pago": 255, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f32", "numero": "F-2026-0033", "clienteId": "c9", "cliente": "Seguros Lintara", "proyecto": null, "emision": 293, "vencimiento": 263, "importe": 1089, "base": 900, "iva": 189, "estado": "paid", "cobrado": 1089, "metodoPago": "Bank transfer", "pago": 266, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f33", "numero": "F-2026-0034", "clienteId": "c12", "cliente": "Fernwald Logistik GmbH", "proyecto": null, "emision": 293, "vencimiento": 263, "importe": 1200, "base": 1200, "iva": 0, "estado": "overdue", "cobrado": 0, "metodoPago": "Bank transfer", "pago": null, "recordatorios": 2, "serie": "F", "proyectoId": null}, {"id": "f34", "numero": "F-2026-0035", "clienteId": "c0", "cliente": "Vandria Logística S.L.", "proyecto": null, "emision": 262, "vencimiento": 232, "importe": 1452, "base": 1200, "iva": 252, "estado": "paid", "cobrado": 1452, "metodoPago": "Bank transfer", "pago": 241, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f35", "numero": "F-2026-0036", "clienteId": "c1", "cliente": "Pelmar Retail", "proyecto": null, "emision": 262, "vencimiento": 232, "importe": 968, "base": 800, "iva": 168, "estado": "paid", "cobrado": 968, "metodoPago": "Bank transfer", "pago": 220, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f36", "numero": "F-2026-0037", "clienteId": "c3", "cliente": "Grupo Alimentario Brance", "proyecto": null, "emision": 262, "vencimiento": 232, "importe": 1815, "base": 1500, "iva": 315, "estado": "paid", "cobrado": 1815, "metodoPago": "Bank transfer", "pago": 229, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f37", "numero": "F-2026-0038", "clienteId": "c4", "cliente": "Clínica Dental Solmara", "proyecto": null, "emision": 262, "vencimiento": 232, "importe": 544.5, "base": 450, "iva": 94.5, "estado": "paid", "cobrado": 544.5, "metodoPago": "Bank transfer", "pago": 206, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f38", "numero": "F-2026-0039", "clienteId": "c6", "cliente": "Talleres Korvan", "proyecto": null, "emision": 262, "vencimiento": 232, "importe": 726, "base": 600, "iva": 126, "estado": "paid", "cobrado": 726, "metodoPago": "Bank transfer", "pago": 191, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f39", "numero": "F-2026-0040", "clienteId": "c8", "cliente": "Hostelería Malvés", "proyecto": null, "emision": 262, "vencimiento": 232, "importe": 423.5, "base": 350, "iva": 73.5, "estado": "paid", "cobrado": 423.5, "metodoPago": "Bank transfer", "pago": 224, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f40", "numero": "F-2026-0041", "clienteId": "c9", "cliente": "Seguros Lintara", "proyecto": null, "emision": 262, "vencimiento": 232, "importe": 1089, "base": 900, "iva": 189, "estado": "paid", "cobrado": 1089, "metodoPago": "Bank transfer", "pago": 235, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f41", "numero": "F-2026-0042", "clienteId": "c12", "cliente": "Fernwald Logistik GmbH", "proyecto": null, "emision": 262, "vencimiento": 232, "importe": 1200, "base": 1200, "iva": 0, "estado": "paid", "cobrado": 1200, "metodoPago": "Bank transfer", "pago": 214, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f42", "numero": "F-2026-0043", "clienteId": "c4", "cliente": "Clínica Dental Solmara", "proyecto": "Smart scheduling", "emision": 245, "vencimiento": 215, "importe": 7018, "base": 5800, "iva": 1218, "estado": "paid", "cobrado": 7018, "metodoPago": "Bank transfer", "pago": 189, "recordatorios": 0, "serie": "F", "proyectoId": "p4"}, {"id": "f43", "numero": "F-2026-0044", "clienteId": "c0", "cliente": "Vandria Logística S.L.", "proyecto": null, "emision": 231, "vencimiento": 201, "importe": 1452, "base": 1200, "iva": 252, "estado": "paid", "cobrado": 1452, "metodoPago": "Bank transfer", "pago": 210, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f44", "numero": "F-2026-0045", "clienteId": "c1", "cliente": "Pelmar Retail", "proyecto": null, "emision": 231, "vencimiento": 201, "importe": 968, "base": 800, "iva": 168, "estado": "paid", "cobrado": 968, "metodoPago": "Bank transfer", "pago": 189, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f45", "numero": "F-2026-0046", "clienteId": "c3", "cliente": "Grupo Alimentario Brance", "proyecto": null, "emision": 231, "vencimiento": 201, "importe": 1815, "base": 1500, "iva": 315, "estado": "overdue", "cobrado": 0, "metodoPago": "Bank transfer", "pago": null, "recordatorios": 2, "serie": "F", "proyectoId": null}, {"id": "f46", "numero": "F-2026-0047", "clienteId": "c4", "cliente": "Clínica Dental Solmara", "proyecto": null, "emision": 231, "vencimiento": 201, "importe": 544.5, "base": 450, "iva": 94.5, "estado": "paid", "cobrado": 544.5, "metodoPago": "Bank transfer", "pago": 175, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f47", "numero": "F-2026-0048", "clienteId": "c6", "cliente": "Talleres Korvan", "proyecto": null, "emision": 231, "vencimiento": 201, "importe": 726, "base": 600, "iva": 126, "estado": "paid", "cobrado": 726, "metodoPago": "Bank transfer", "pago": 160, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f48", "numero": "F-2026-0049", "clienteId": "c8", "cliente": "Hostelería Malvés", "proyecto": null, "emision": 231, "vencimiento": 201, "importe": 423.5, "base": 350, "iva": 73.5, "estado": "paid", "cobrado": 423.5, "metodoPago": "Bank transfer", "pago": 193, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f49", "numero": "F-2026-0050", "clienteId": "c9", "cliente": "Seguros Lintara", "proyecto": null, "emision": 231, "vencimiento": 201, "importe": 1089, "base": 900, "iva": 189, "estado": "paid", "cobrado": 1089, "metodoPago": "Bank transfer", "pago": 204, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f50", "numero": "F-2026-0051", "clienteId": "c12", "cliente": "Fernwald Logistik GmbH", "proyecto": null, "emision": 231, "vencimiento": 201, "importe": 1200, "base": 1200, "iva": 0, "estado": "paid", "cobrado": 1200, "metodoPago": "Bank transfer", "pago": 183, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f51", "numero": "F-2026-0052", "clienteId": "c0", "cliente": "Vandria Logística S.L.", "proyecto": null, "emision": 203, "vencimiento": 173, "importe": 1452, "base": 1200, "iva": 252, "estado": "paid", "cobrado": 1452, "metodoPago": "Bank transfer", "pago": 182, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f52", "numero": "F-2026-0053", "clienteId": "c1", "cliente": "Pelmar Retail", "proyecto": null, "emision": 203, "vencimiento": 173, "importe": 968, "base": 800, "iva": 168, "estado": "paid", "cobrado": 968, "metodoPago": "Bank transfer", "pago": 161, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f53", "numero": "F-2026-0054", "clienteId": "c3", "cliente": "Grupo Alimentario Brance", "proyecto": null, "emision": 203, "vencimiento": 173, "importe": 1815, "base": 1500, "iva": 315, "estado": "paid", "cobrado": 1815, "metodoPago": "Bank transfer", "pago": 170, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f54", "numero": "F-2026-0055", "clienteId": "c4", "cliente": "Clínica Dental Solmara", "proyecto": null, "emision": 203, "vencimiento": 173, "importe": 544.5, "base": 450, "iva": 94.5, "estado": "paid", "cobrado": 544.5, "metodoPago": "Bank transfer", "pago": 147, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f55", "numero": "F-2026-0056", "clienteId": "c6", "cliente": "Talleres Korvan", "proyecto": null, "emision": 203, "vencimiento": 173, "importe": 726, "base": 600, "iva": 126, "estado": "paid", "cobrado": 726, "metodoPago": "Bank transfer", "pago": 132, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f56", "numero": "F-2026-0057", "clienteId": "c8", "cliente": "Hostelería Malvés", "proyecto": null, "emision": 203, "vencimiento": 173, "importe": 423.5, "base": 350, "iva": 73.5, "estado": "paid", "cobrado": 423.5, "metodoPago": "Bank transfer", "pago": 165, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f57", "numero": "F-2026-0058", "clienteId": "c9", "cliente": "Seguros Lintara", "proyecto": null, "emision": 203, "vencimiento": 173, "importe": 1089, "base": 900, "iva": 189, "estado": "paid", "cobrado": 1089, "metodoPago": "Bank transfer", "pago": 176, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f58", "numero": "F-2026-0059", "clienteId": "c12", "cliente": "Fernwald Logistik GmbH", "proyecto": null, "emision": 203, "vencimiento": 173, "importe": 1200, "base": 1200, "iva": 0, "estado": "paid", "cobrado": 1200, "metodoPago": "Bank transfer", "pago": 155, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f59", "numero": "F-2026-0060", "clienteId": "c6", "cliente": "Talleres Korvan", "proyecto": "Vehicle check-in", "emision": 186, "vencimiento": 156, "importe": 11737, "base": 9700, "iva": 2037, "estado": "paid", "cobrado": 11737, "metodoPago": "Bank transfer", "pago": 115, "recordatorios": 0, "serie": "F", "proyectoId": "p6"}, {"id": "f60", "numero": "F-2026-0061", "clienteId": "c0", "cliente": "Vandria Logística S.L.", "proyecto": null, "emision": 172, "vencimiento": 142, "importe": 1452, "base": 1200, "iva": 252, "estado": "paid", "cobrado": 1452, "metodoPago": "Bank transfer", "pago": 151, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f61", "numero": "F-2026-0062", "clienteId": "c1", "cliente": "Pelmar Retail", "proyecto": null, "emision": 172, "vencimiento": 142, "importe": 968, "base": 800, "iva": 168, "estado": "paid", "cobrado": 968, "metodoPago": "Bank transfer", "pago": 130, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f62", "numero": "F-2026-0063", "clienteId": "c3", "cliente": "Grupo Alimentario Brance", "proyecto": null, "emision": 172, "vencimiento": 142, "importe": 1815, "base": 1500, "iva": 315, "estado": "paid", "cobrado": 1815, "metodoPago": "Bank transfer", "pago": 139, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f63", "numero": "F-2026-0064", "clienteId": "c4", "cliente": "Clínica Dental Solmara", "proyecto": null, "emision": 172, "vencimiento": 142, "importe": 544.5, "base": 450, "iva": 94.5, "estado": "paid", "cobrado": 544.5, "metodoPago": "Bank transfer", "pago": 116, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f64", "numero": "F-2026-0065", "clienteId": "c6", "cliente": "Talleres Korvan", "proyecto": null, "emision": 172, "vencimiento": 142, "importe": 726, "base": 600, "iva": 126, "estado": "paid", "cobrado": 726, "metodoPago": "Bank transfer", "pago": 101, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f65", "numero": "F-2026-0066", "clienteId": "c8", "cliente": "Hostelería Malvés", "proyecto": null, "emision": 172, "vencimiento": 142, "importe": 423.5, "base": 350, "iva": 73.5, "estado": "paid", "cobrado": 423.5, "metodoPago": "Bank transfer", "pago": 134, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f66", "numero": "F-2026-0067", "clienteId": "c9", "cliente": "Seguros Lintara", "proyecto": null, "emision": 172, "vencimiento": 142, "importe": 1089, "base": 900, "iva": 189, "estado": "paid", "cobrado": 1089, "metodoPago": "Bank transfer", "pago": 145, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f67", "numero": "F-2026-0068", "clienteId": "c12", "cliente": "Fernwald Logistik GmbH", "proyecto": null, "emision": 172, "vencimiento": 142, "importe": 1200, "base": 1200, "iva": 0, "estado": "paid", "cobrado": 1200, "metodoPago": "Bank transfer", "pago": 124, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f68", "numero": "F-2026-0069", "clienteId": "c0", "cliente": "Vandria Logística S.L.", "proyecto": null, "emision": 142, "vencimiento": 112, "importe": 1452, "base": 1200, "iva": 252, "estado": "paid", "cobrado": 1452, "metodoPago": "Bank transfer", "pago": 121, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f69", "numero": "F-2026-0070", "clienteId": "c1", "cliente": "Pelmar Retail", "proyecto": null, "emision": 142, "vencimiento": 112, "importe": 968, "base": 800, "iva": 168, "estado": "paid", "cobrado": 968, "metodoPago": "Bank transfer", "pago": 100, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f70", "numero": "F-2026-0071", "clienteId": "c3", "cliente": "Grupo Alimentario Brance", "proyecto": null, "emision": 142, "vencimiento": 112, "importe": 1815, "base": 1500, "iva": 315, "estado": "paid", "cobrado": 1815, "metodoPago": "Bank transfer", "pago": 109, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f71", "numero": "F-2026-0072", "clienteId": "c4", "cliente": "Clínica Dental Solmara", "proyecto": null, "emision": 142, "vencimiento": 112, "importe": 544.5, "base": 450, "iva": 94.5, "estado": "overdue", "cobrado": 0, "metodoPago": "Bank transfer", "pago": null, "recordatorios": 2, "serie": "F", "proyectoId": null}, {"id": "f72", "numero": "F-2026-0073", "clienteId": "c6", "cliente": "Talleres Korvan", "proyecto": null, "emision": 142, "vencimiento": 112, "importe": 726, "base": 600, "iva": 126, "estado": "paid", "cobrado": 726, "metodoPago": "Bank transfer", "pago": 71, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f73", "numero": "F-2026-0074", "clienteId": "c8", "cliente": "Hostelería Malvés", "proyecto": null, "emision": 142, "vencimiento": 112, "importe": 423.5, "base": 350, "iva": 73.5, "estado": "paid", "cobrado": 423.5, "metodoPago": "Bank transfer", "pago": 104, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f74", "numero": "F-2026-0075", "clienteId": "c9", "cliente": "Seguros Lintara", "proyecto": null, "emision": 142, "vencimiento": 112, "importe": 1089, "base": 900, "iva": 189, "estado": "paid", "cobrado": 1089, "metodoPago": "Bank transfer", "pago": 115, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f75", "numero": "F-2026-0076", "clienteId": "c12", "cliente": "Fernwald Logistik GmbH", "proyecto": null, "emision": 142, "vencimiento": 112, "importe": 1200, "base": 1200, "iva": 0, "estado": "paid", "cobrado": 1200, "metodoPago": "Bank transfer", "pago": 94, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f76", "numero": "F-2026-0077", "clienteId": "c0", "cliente": "Vandria Logística S.L.", "proyecto": "Route automation", "emision": 125, "vencimiento": 95, "importe": 10224.5, "base": 8450, "iva": 1774.5, "estado": "paid", "cobrado": 10224.5, "metodoPago": "Bank transfer", "pago": 104, "recordatorios": 0, "serie": "F", "proyectoId": "p0"}, {"id": "f77", "numero": "F-2026-0078", "clienteId": "c0", "cliente": "Vandria Logística S.L.", "proyecto": null, "emision": 111, "vencimiento": 81, "importe": 1452, "base": 1200, "iva": 252, "estado": "paid", "cobrado": 1452, "metodoPago": "Bank transfer", "pago": 90, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f78", "numero": "F-2026-0079", "clienteId": "c1", "cliente": "Pelmar Retail", "proyecto": null, "emision": 111, "vencimiento": 81, "importe": 968, "base": 800, "iva": 168, "estado": "overdue", "cobrado": 0, "metodoPago": "Bank transfer", "pago": null, "recordatorios": 2, "serie": "F", "proyectoId": null}, {"id": "f79", "numero": "F-2026-0080", "clienteId": "c3", "cliente": "Grupo Alimentario Brance", "proyecto": null, "emision": 111, "vencimiento": 81, "importe": 1815, "base": 1500, "iva": 315, "estado": "paid", "cobrado": 1815, "metodoPago": "Bank transfer", "pago": 78, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f80", "numero": "F-2026-0081", "clienteId": "c4", "cliente": "Clínica Dental Solmara", "proyecto": null, "emision": 111, "vencimiento": 81, "importe": 544.5, "base": 450, "iva": 94.5, "estado": "paid", "cobrado": 544.5, "metodoPago": "Bank transfer", "pago": 55, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f81", "numero": "F-2026-0082", "clienteId": "c6", "cliente": "Talleres Korvan", "proyecto": null, "emision": 111, "vencimiento": 81, "importe": 726, "base": 600, "iva": 126, "estado": "paid", "cobrado": 726, "metodoPago": "Bank transfer", "pago": 40, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f82", "numero": "F-2026-0083", "clienteId": "c8", "cliente": "Hostelería Malvés", "proyecto": null, "emision": 111, "vencimiento": 81, "importe": 423.5, "base": 350, "iva": 73.5, "estado": "paid", "cobrado": 423.5, "metodoPago": "Bank transfer", "pago": 73, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f83", "numero": "F-2026-0084", "clienteId": "c9", "cliente": "Seguros Lintara", "proyecto": null, "emision": 111, "vencimiento": 81, "importe": 1089, "base": 900, "iva": 189, "estado": "paid", "cobrado": 1089, "metodoPago": "Bank transfer", "pago": 84, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f84", "numero": "F-2026-0085", "clienteId": "c12", "cliente": "Fernwald Logistik GmbH", "proyecto": null, "emision": 111, "vencimiento": 81, "importe": 1200, "base": 1200, "iva": 0, "estado": "paid", "cobrado": 1200, "metodoPago": "Bank transfer", "pago": 63, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f85", "numero": "F-2026-0086", "clienteId": "c0", "cliente": "Vandria Logística S.L.", "proyecto": null, "emision": 81, "vencimiento": 51, "importe": 1452, "base": 1200, "iva": 252, "estado": "paid", "cobrado": 1452, "metodoPago": "Bank transfer", "pago": 60, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f86", "numero": "F-2026-0087", "clienteId": "c1", "cliente": "Pelmar Retail", "proyecto": null, "emision": 81, "vencimiento": 51, "importe": 968, "base": 800, "iva": 168, "estado": "paid", "cobrado": 968, "metodoPago": "Bank transfer", "pago": 39, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f87", "numero": "F-2026-0088", "clienteId": "c3", "cliente": "Grupo Alimentario Brance", "proyecto": null, "emision": 81, "vencimiento": 51, "importe": 1815, "base": 1500, "iva": 315, "estado": "paid", "cobrado": 1815, "metodoPago": "Bank transfer", "pago": 48, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f88", "numero": "F-2026-0089", "clienteId": "c4", "cliente": "Clínica Dental Solmara", "proyecto": null, "emision": 81, "vencimiento": 51, "importe": 544.5, "base": 450, "iva": 94.5, "estado": "paid", "cobrado": 544.5, "metodoPago": "Bank transfer", "pago": 25, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f89", "numero": "F-2026-0090", "clienteId": "c6", "cliente": "Talleres Korvan", "proyecto": null, "emision": 81, "vencimiento": 51, "importe": 726, "base": 600, "iva": 126, "estado": "paid", "cobrado": 726, "metodoPago": "Bank transfer", "pago": 10, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f90", "numero": "F-2026-0091", "clienteId": "c8", "cliente": "Hostelería Malvés", "proyecto": null, "emision": 81, "vencimiento": 51, "importe": 423.5, "base": 350, "iva": 73.5, "estado": "paid", "cobrado": 423.5, "metodoPago": "Bank transfer", "pago": 43, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f91", "numero": "F-2026-0092", "clienteId": "c9", "cliente": "Seguros Lintara", "proyecto": null, "emision": 81, "vencimiento": 51, "importe": 1089, "base": 900, "iva": 189, "estado": "paid", "cobrado": 1089, "metodoPago": "Bank transfer", "pago": 54, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f92", "numero": "F-2026-0093", "clienteId": "c12", "cliente": "Fernwald Logistik GmbH", "proyecto": null, "emision": 81, "vencimiento": 51, "importe": 1200, "base": 1200, "iva": 0, "estado": "overdue", "cobrado": 0, "metodoPago": "Bank transfer", "pago": null, "recordatorios": 2, "serie": "F", "proyectoId": null}, {"id": "f93", "numero": "F-2026-0094", "clienteId": "c2", "cliente": "Ferretería Olvanta", "proyecto": "AI-assisted inventory", "emision": 64, "vencimiento": 34, "importe": 10043, "base": 8300, "iva": 1743, "estado": "paid", "cobrado": 10043, "metodoPago": "Bank transfer", "pago": 20, "recordatorios": 0, "serie": "F", "proyectoId": "p2"}, {"id": "f94", "numero": "F-2026-0095", "clienteId": "c0", "cliente": "Vandria Logística S.L.", "proyecto": null, "emision": 50, "vencimiento": 20, "importe": 1452, "base": 1200, "iva": 252, "estado": "paid", "cobrado": 1452, "metodoPago": "Bank transfer", "pago": 29, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f95", "numero": "F-2026-0096", "clienteId": "c1", "cliente": "Pelmar Retail", "proyecto": null, "emision": 50, "vencimiento": 20, "importe": 968, "base": 800, "iva": 168, "estado": "overdue", "cobrado": 0, "metodoPago": "Bank transfer", "pago": null, "recordatorios": 2, "serie": "F", "proyectoId": null}, {"id": "f96", "numero": "F-2026-0097", "clienteId": "c3", "cliente": "Grupo Alimentario Brance", "proyecto": null, "emision": 50, "vencimiento": 20, "importe": 1815, "base": 1500, "iva": 315, "estado": "paid", "cobrado": 1815, "metodoPago": "Bank transfer", "pago": 17, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f97", "numero": "F-2026-0098", "clienteId": "c4", "cliente": "Clínica Dental Solmara", "proyecto": null, "emision": 50, "vencimiento": 20, "importe": 544.5, "base": 450, "iva": 94.5, "estado": "overdue", "cobrado": 0, "metodoPago": "Bank transfer", "pago": null, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f98", "numero": "F-2026-0099", "clienteId": "c6", "cliente": "Talleres Korvan", "proyecto": null, "emision": 50, "vencimiento": 20, "importe": 726, "base": 600, "iva": 126, "estado": "overdue", "cobrado": 0, "metodoPago": "Bank transfer", "pago": null, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f99", "numero": "F-2026-0100", "clienteId": "c8", "cliente": "Hostelería Malvés", "proyecto": null, "emision": 50, "vencimiento": 20, "importe": 423.5, "base": 350, "iva": 73.5, "estado": "overdue", "cobrado": 0, "metodoPago": "Bank transfer", "pago": null, "recordatorios": 2, "serie": "F", "proyectoId": null}, {"id": "f100", "numero": "F-2026-0101", "clienteId": "c9", "cliente": "Seguros Lintara", "proyecto": null, "emision": 50, "vencimiento": 20, "importe": 1089, "base": 900, "iva": 189, "estado": "paid", "cobrado": 1089, "metodoPago": "Bank transfer", "pago": 23, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f101", "numero": "F-2026-0102", "clienteId": "c12", "cliente": "Fernwald Logistik GmbH", "proyecto": null, "emision": 50, "vencimiento": 20, "importe": 1200, "base": 1200, "iva": 0, "estado": "paid", "cobrado": 1200, "metodoPago": "Bank transfer", "pago": 2, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f102", "numero": "F-2026-0103", "clienteId": "c0", "cliente": "Vandria Logística S.L.", "proyecto": null, "emision": 19, "vencimiento": -11, "importe": 1452, "base": 1200, "iva": 252, "estado": "sent", "cobrado": 0, "metodoPago": "Bank transfer", "pago": null, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f103", "numero": "F-2026-0104", "clienteId": "c1", "cliente": "Pelmar Retail", "proyecto": null, "emision": 19, "vencimiento": -11, "importe": 968, "base": 800, "iva": 168, "estado": "sent", "cobrado": 0, "metodoPago": "Bank transfer", "pago": null, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f104", "numero": "F-2026-0105", "clienteId": "c3", "cliente": "Grupo Alimentario Brance", "proyecto": null, "emision": 19, "vencimiento": -11, "importe": 1815, "base": 1500, "iva": 315, "estado": "sent", "cobrado": 0, "metodoPago": "Bank transfer", "pago": null, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f105", "numero": "F-2026-0106", "clienteId": "c4", "cliente": "Clínica Dental Solmara", "proyecto": null, "emision": 19, "vencimiento": -11, "importe": 544.5, "base": 450, "iva": 94.5, "estado": "sent", "cobrado": 0, "metodoPago": "Bank transfer", "pago": null, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f106", "numero": "F-2026-0107", "clienteId": "c6", "cliente": "Talleres Korvan", "proyecto": null, "emision": 19, "vencimiento": -11, "importe": 726, "base": 600, "iva": 126, "estado": "sent", "cobrado": 0, "metodoPago": "Bank transfer", "pago": null, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f107", "numero": "F-2026-0108", "clienteId": "c8", "cliente": "Hostelería Malvés", "proyecto": null, "emision": 19, "vencimiento": -11, "importe": 423.5, "base": 350, "iva": 73.5, "estado": "sent", "cobrado": 0, "metodoPago": "Bank transfer", "pago": null, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f108", "numero": "F-2026-0109", "clienteId": "c9", "cliente": "Seguros Lintara", "proyecto": null, "emision": 19, "vencimiento": -11, "importe": 1089, "base": 900, "iva": 189, "estado": "sent", "cobrado": 0, "metodoPago": "Bank transfer", "pago": null, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f109", "numero": "F-2026-0110", "clienteId": "c12", "cliente": "Fernwald Logistik GmbH", "proyecto": null, "emision": 19, "vencimiento": -11, "importe": 1200, "base": 1200, "iva": 0, "estado": "sent", "cobrado": 0, "metodoPago": "Bank transfer", "pago": null, "recordatorios": 0, "serie": "F", "proyectoId": null}, {"id": "f110", "numero": "F-2026-0111", "clienteId": "c4", "cliente": "Clínica Dental Solmara", "proyecto": "Smart scheduling", "emision": 3, "vencimiento": -27, "importe": 9196, "base": 7600, "iva": 1596, "estado": "sent", "cobrado": 0, "metodoPago": "Bank transfer", "pago": null, "recordatorios": 0, "serie": "F", "proyectoId": "p4"}, {"id": "f111", "numero": "F-2026-0112", "clienteId": "c5", "cliente": "Arquitectura Veltris", "proyecto": "Document manager", "emision": 0, "vencimiento": -30, "importe": 5808, "base": 4800, "iva": 1008, "estado": "draft", "cobrado": 0, "metodoPago": null, "pago": null, "recordatorios": 0, "serie": "F", "proyectoId": "p5"}], "cobros": [{"id": "r0", "facturaId": "f0", "fecha": 363, "importe": 1452, "metodo": "Bank transfer", "referencia": "TRF-2026-1"}, {"id": "r1", "facturaId": "f1", "fecha": 342, "importe": 968, "metodo": "Bank transfer", "referencia": "TRF-2026-2"}, {"id": "r2", "facturaId": "f2", "fecha": 351, "importe": 1815, "metodo": "Bank transfer", "referencia": "TRF-2026-3"}, {"id": "r3", "facturaId": "f3", "fecha": 328, "importe": 544.5, "metodo": "Bank transfer", "referencia": "TRF-2026-4"}, {"id": "r4", "facturaId": "f5", "fecha": 346, "importe": 423.5, "metodo": "Bank transfer", "referencia": "TRF-2026-5"}, {"id": "r5", "facturaId": "f6", "fecha": 357, "importe": 1089, "metodo": "Bank transfer", "referencia": "TRF-2026-6"}, {"id": "r6", "facturaId": "f7", "fecha": 336, "importe": 1200, "metodo": "Bank transfer", "referencia": "TRF-2026-7"}, {"id": "r7", "facturaId": "f8", "fecha": 346, "importe": 10587.5, "metodo": "Bank transfer", "referencia": "TRF-2026-8"}, {"id": "r8", "facturaId": "f9", "fecha": 333, "importe": 1452, "metodo": "Bank transfer", "referencia": "TRF-2026-9"}, {"id": "r9", "facturaId": "f10", "fecha": 312, "importe": 968, "metodo": "Bank transfer", "referencia": "TRF-2026-10"}, {"id": "r10", "facturaId": "f11", "fecha": 321, "importe": 1815, "metodo": "Bank transfer", "referencia": "TRF-2026-11"}, {"id": "r11", "facturaId": "f12", "fecha": 298, "importe": 544.5, "metodo": "Bank transfer", "referencia": "TRF-2026-12"}, {"id": "r12", "facturaId": "f13", "fecha": 283, "importe": 726, "metodo": "Bank transfer", "referencia": "TRF-2026-13"}, {"id": "r13", "facturaId": "f14", "fecha": 316, "importe": 423.5, "metodo": "Bank transfer", "referencia": "TRF-2026-14"}, {"id": "r14", "facturaId": "f15", "fecha": 327, "importe": 1089, "metodo": "Bank transfer", "referencia": "TRF-2026-15"}, {"id": "r15", "facturaId": "f16", "fecha": 306, "importe": 1200, "metodo": "Bank transfer", "referencia": "TRF-2026-16"}, {"id": "r16", "facturaId": "f17", "fecha": 302, "importe": 1452, "metodo": "Bank transfer", "referencia": "TRF-2026-17"}, {"id": "r17", "facturaId": "f18", "fecha": 281, "importe": 968, "metodo": "Bank transfer", "referencia": "TRF-2026-18"}, {"id": "r18", "facturaId": "f19", "fecha": 290, "importe": 1815, "metodo": "Bank transfer", "referencia": "TRF-2026-19"}, {"id": "r19", "facturaId": "f20", "fecha": 267, "importe": 544.5, "metodo": "Bank transfer", "referencia": "TRF-2026-20"}, {"id": "r20", "facturaId": "f21", "fecha": 252, "importe": 726, "metodo": "Bank transfer", "referencia": "TRF-2026-21"}, {"id": "r21", "facturaId": "f22", "fecha": 285, "importe": 423.5, "metodo": "Bank transfer", "referencia": "TRF-2026-22"}, {"id": "r22", "facturaId": "f23", "fecha": 296, "importe": 1089, "metodo": "Bank transfer", "referencia": "TRF-2026-23"}, {"id": "r23", "facturaId": "f25", "fecha": 262, "importe": 5808, "metodo": "Bank transfer", "referencia": "TRF-2026-24"}, {"id": "r24", "facturaId": "f26", "fecha": 272, "importe": 1452, "metodo": "Bank transfer", "referencia": "TRF-2026-25"}, {"id": "r25", "facturaId": "f27", "fecha": 251, "importe": 968, "metodo": "Bank transfer", "referencia": "TRF-2026-26"}, {"id": "r26", "facturaId": "f28", "fecha": 260, "importe": 1815, "metodo": "Bank transfer", "referencia": "TRF-2026-27"}, {"id": "r27", "facturaId": "f29", "fecha": 237, "importe": 544.5, "metodo": "Bank transfer", "referencia": "TRF-2026-28"}, {"id": "r28", "facturaId": "f30", "fecha": 222, "importe": 726, "metodo": "Bank transfer", "referencia": "TRF-2026-29"}, {"id": "r29", "facturaId": "f31", "fecha": 255, "importe": 423.5, "metodo": "Bank transfer", "referencia": "TRF-2026-30"}, {"id": "r30", "facturaId": "f32", "fecha": 266, "importe": 1089, "metodo": "Bank transfer", "referencia": "TRF-2026-31"}, {"id": "r31", "facturaId": "f34", "fecha": 241, "importe": 1452, "metodo": "Bank transfer", "referencia": "TRF-2026-32"}, {"id": "r32", "facturaId": "f35", "fecha": 220, "importe": 968, "metodo": "Bank transfer", "referencia": "TRF-2026-33"}, {"id": "r33", "facturaId": "f36", "fecha": 229, "importe": 1815, "metodo": "Bank transfer", "referencia": "TRF-2026-34"}, {"id": "r34", "facturaId": "f37", "fecha": 206, "importe": 544.5, "metodo": "Bank transfer", "referencia": "TRF-2026-35"}, {"id": "r35", "facturaId": "f38", "fecha": 191, "importe": 726, "metodo": "Bank transfer", "referencia": "TRF-2026-36"}, {"id": "r36", "facturaId": "f39", "fecha": 224, "importe": 423.5, "metodo": "Bank transfer", "referencia": "TRF-2026-37"}, {"id": "r37", "facturaId": "f40", "fecha": 235, "importe": 1089, "metodo": "Bank transfer", "referencia": "TRF-2026-38"}, {"id": "r38", "facturaId": "f41", "fecha": 214, "importe": 1200, "metodo": "Bank transfer", "referencia": "TRF-2026-39"}, {"id": "r39", "facturaId": "f42", "fecha": 189, "importe": 7018, "metodo": "Bank transfer", "referencia": "TRF-2026-40"}, {"id": "r40", "facturaId": "f43", "fecha": 210, "importe": 1452, "metodo": "Bank transfer", "referencia": "TRF-2026-41"}, {"id": "r41", "facturaId": "f44", "fecha": 189, "importe": 968, "metodo": "Bank transfer", "referencia": "TRF-2026-42"}, {"id": "r42", "facturaId": "f46", "fecha": 175, "importe": 544.5, "metodo": "Bank transfer", "referencia": "TRF-2026-43"}, {"id": "r43", "facturaId": "f47", "fecha": 160, "importe": 726, "metodo": "Bank transfer", "referencia": "TRF-2026-44"}, {"id": "r44", "facturaId": "f48", "fecha": 193, "importe": 423.5, "metodo": "Bank transfer", "referencia": "TRF-2026-45"}, {"id": "r45", "facturaId": "f49", "fecha": 204, "importe": 1089, "metodo": "Bank transfer", "referencia": "TRF-2026-46"}, {"id": "r46", "facturaId": "f50", "fecha": 183, "importe": 1200, "metodo": "Bank transfer", "referencia": "TRF-2026-47"}, {"id": "r47", "facturaId": "f51", "fecha": 182, "importe": 1452, "metodo": "Bank transfer", "referencia": "TRF-2026-48"}, {"id": "r48", "facturaId": "f52", "fecha": 161, "importe": 968, "metodo": "Bank transfer", "referencia": "TRF-2026-49"}, {"id": "r49", "facturaId": "f53", "fecha": 170, "importe": 1815, "metodo": "Bank transfer", "referencia": "TRF-2026-50"}, {"id": "r50", "facturaId": "f54", "fecha": 147, "importe": 544.5, "metodo": "Bank transfer", "referencia": "TRF-2026-51"}, {"id": "r51", "facturaId": "f55", "fecha": 132, "importe": 726, "metodo": "Bank transfer", "referencia": "TRF-2026-52"}, {"id": "r52", "facturaId": "f56", "fecha": 165, "importe": 423.5, "metodo": "Bank transfer", "referencia": "TRF-2026-53"}, {"id": "r53", "facturaId": "f57", "fecha": 176, "importe": 1089, "metodo": "Bank transfer", "referencia": "TRF-2026-54"}, {"id": "r54", "facturaId": "f58", "fecha": 155, "importe": 1200, "metodo": "Bank transfer", "referencia": "TRF-2026-55"}, {"id": "r55", "facturaId": "f59", "fecha": 115, "importe": 11737, "metodo": "Bank transfer", "referencia": "TRF-2026-56"}, {"id": "r56", "facturaId": "f60", "fecha": 151, "importe": 1452, "metodo": "Bank transfer", "referencia": "TRF-2026-57"}, {"id": "r57", "facturaId": "f61", "fecha": 130, "importe": 968, "metodo": "Bank transfer", "referencia": "TRF-2026-58"}, {"id": "r58", "facturaId": "f62", "fecha": 139, "importe": 1815, "metodo": "Bank transfer", "referencia": "TRF-2026-59"}, {"id": "r59", "facturaId": "f63", "fecha": 116, "importe": 544.5, "metodo": "Bank transfer", "referencia": "TRF-2026-60"}, {"id": "r60", "facturaId": "f64", "fecha": 101, "importe": 726, "metodo": "Bank transfer", "referencia": "TRF-2026-61"}, {"id": "r61", "facturaId": "f65", "fecha": 134, "importe": 423.5, "metodo": "Bank transfer", "referencia": "TRF-2026-62"}, {"id": "r62", "facturaId": "f66", "fecha": 145, "importe": 1089, "metodo": "Bank transfer", "referencia": "TRF-2026-63"}, {"id": "r63", "facturaId": "f67", "fecha": 124, "importe": 1200, "metodo": "Bank transfer", "referencia": "TRF-2026-64"}, {"id": "r64", "facturaId": "f68", "fecha": 121, "importe": 1452, "metodo": "Bank transfer", "referencia": "TRF-2026-65"}, {"id": "r65", "facturaId": "f69", "fecha": 100, "importe": 968, "metodo": "Bank transfer", "referencia": "TRF-2026-66"}, {"id": "r66", "facturaId": "f70", "fecha": 109, "importe": 1815, "metodo": "Bank transfer", "referencia": "TRF-2026-67"}, {"id": "r67", "facturaId": "f72", "fecha": 71, "importe": 726, "metodo": "Bank transfer", "referencia": "TRF-2026-68"}, {"id": "r68", "facturaId": "f73", "fecha": 104, "importe": 423.5, "metodo": "Bank transfer", "referencia": "TRF-2026-69"}, {"id": "r69", "facturaId": "f74", "fecha": 115, "importe": 1089, "metodo": "Bank transfer", "referencia": "TRF-2026-70"}, {"id": "r70", "facturaId": "f75", "fecha": 94, "importe": 1200, "metodo": "Bank transfer", "referencia": "TRF-2026-71"}, {"id": "r71", "facturaId": "f76", "fecha": 104, "importe": 10224.5, "metodo": "Bank transfer", "referencia": "TRF-2026-72"}, {"id": "r72", "facturaId": "f77", "fecha": 90, "importe": 1452, "metodo": "Bank transfer", "referencia": "TRF-2026-73"}, {"id": "r73", "facturaId": "f79", "fecha": 78, "importe": 1815, "metodo": "Bank transfer", "referencia": "TRF-2026-74"}, {"id": "r74", "facturaId": "f80", "fecha": 55, "importe": 544.5, "metodo": "Bank transfer", "referencia": "TRF-2026-75"}, {"id": "r75", "facturaId": "f81", "fecha": 40, "importe": 726, "metodo": "Bank transfer", "referencia": "TRF-2026-76"}, {"id": "r76", "facturaId": "f82", "fecha": 73, "importe": 423.5, "metodo": "Bank transfer", "referencia": "TRF-2026-77"}, {"id": "r77", "facturaId": "f83", "fecha": 84, "importe": 1089, "metodo": "Bank transfer", "referencia": "TRF-2026-78"}, {"id": "r78", "facturaId": "f84", "fecha": 63, "importe": 1200, "metodo": "Bank transfer", "referencia": "TRF-2026-79"}, {"id": "r79", "facturaId": "f85", "fecha": 60, "importe": 1452, "metodo": "Bank transfer", "referencia": "TRF-2026-80"}, {"id": "r80", "facturaId": "f86", "fecha": 39, "importe": 968, "metodo": "Bank transfer", "referencia": "TRF-2026-81"}, {"id": "r81", "facturaId": "f87", "fecha": 48, "importe": 1815, "metodo": "Bank transfer", "referencia": "TRF-2026-82"}, {"id": "r82", "facturaId": "f88", "fecha": 25, "importe": 544.5, "metodo": "Bank transfer", "referencia": "TRF-2026-83"}, {"id": "r83", "facturaId": "f89", "fecha": 10, "importe": 726, "metodo": "Bank transfer", "referencia": "TRF-2026-84"}, {"id": "r84", "facturaId": "f90", "fecha": 43, "importe": 423.5, "metodo": "Bank transfer", "referencia": "TRF-2026-85"}, {"id": "r85", "facturaId": "f91", "fecha": 54, "importe": 1089, "metodo": "Bank transfer", "referencia": "TRF-2026-86"}, {"id": "r86", "facturaId": "f93", "fecha": 20, "importe": 10043, "metodo": "Bank transfer", "referencia": "TRF-2026-87"}, {"id": "r87", "facturaId": "f94", "fecha": 29, "importe": 1452, "metodo": "Bank transfer", "referencia": "TRF-2026-88"}, {"id": "r88", "facturaId": "f96", "fecha": 17, "importe": 1815, "metodo": "Bank transfer", "referencia": "TRF-2026-89"}, {"id": "r89", "facturaId": "f100", "fecha": 23, "importe": 1089, "metodo": "Bank transfer", "referencia": "TRF-2026-90"}, {"id": "r90", "facturaId": "f101", "fecha": 2, "importe": 1200, "metodo": "Bank transfer", "referencia": "TRF-2026-91"}], "gastos": [{"id": "g0", "proveedor": "Nubalia Cloud", "proveedorId": "v0", "importe": 54.45, "base": 45, "iva": 9.45, "fecha": 382, "vencimiento": 352, "concepto": "Infrastructure — monthly", "categoria": "Infrastructure", "revision": "approved", "pagado": true, "pago": 352, "proyectoId": null, "notas": null}, {"id": "g1", "proveedor": "Coworking Belvedo", "proveedorId": "v3", "importe": 786.5, "base": 650, "iva": 136.5, "fecha": 379, "vencimiento": 349, "concepto": "Rent — monthly", "categoria": "Rent", "revision": "approved", "pagado": true, "pago": 349, "proyectoId": null, "notas": null}, {"id": "g2", "proveedor": "Telecom Sarkia", "proveedorId": "v4", "importe": 107.69, "base": 89, "iva": 18.69, "fecha": 378, "vencimiento": 348, "concepto": "Telecoms — monthly", "categoria": "Telecoms", "revision": "approved", "pagado": true, "pago": 348, "proyectoId": null, "notas": null}, {"id": "g3", "proveedor": "Talento Externo Rivelda", "proveedorId": "v8", "importe": 11053.35, "base": 9135, "iva": 1918.35, "fecha": 382, "vencimiento": 367, "concepto": "Subcontracted engineering — hours on Route automation", "categoria": "Subcontracting", "revision": "approved", "pagado": true, "pago": 367, "proyectoId": "p0", "notas": null}, {"id": "g4", "proveedor": "Suite Norlem", "proveedorId": "v9", "importe": 254.1, "base": 210, "iva": 44.1, "fecha": 377, "vencimiento": 362, "concepto": "Tool subscriptions — monthly", "categoria": "Software", "revision": "approved", "pagado": true, "pago": 362, "proyectoId": null, "notas": null}, {"id": "g5", "proveedor": "Seguros Lintara", "proveedorId": "v5", "importe": 905, "base": 905, "iva": 0, "fecha": 373, "vencimiento": 343, "concepto": "Insurance — Vehicle check-in", "categoria": "Insurance", "revision": "approved", "pagado": true, "pago": 343, "proyectoId": "p6", "notas": "VAT-exempt (Spanish VAT Act art. 20.One.16, insurance transactions)."}, {"id": "g6", "proveedor": "Quiosco Prensa Belvedo", "proveedorId": "v10", "importe": 35.36, "base": 34, "iva": 1.36, "fecha": 371, "vencimiento": 341, "concepto": "Business press and technical publications", "categoria": "Publications", "revision": "approved", "pagado": true, "pago": 341, "proyectoId": null, "notas": null}, {"id": "g7", "proveedor": "Caja Fiduciaria Alvedo", "proveedorId": "v11", "importe": 18, "base": 18, "iva": 0, "fecha": 371, "vencimiento": 341, "concepto": "Account and transfer fees", "categoria": "Financial services", "revision": "approved", "pagado": true, "pago": 341, "proyectoId": null, "notas": "VAT-exempt (Spanish VAT Act art. 20.One.18, financial services)."}, {"id": "g8", "proveedor": "Viajes Tarsen", "proveedorId": "v7", "importe": 264, "base": 240, "iva": 24, "fecha": 371, "vencimiento": 341, "concepto": "Travel and accommodation — client visit", "categoria": "Travel", "revision": "approved", "pagado": true, "pago": 341, "proyectoId": null, "notas": null}, {"id": "g9", "proveedor": "Nubalia Cloud", "proveedorId": "v0", "importe": 54.45, "base": 45, "iva": 9.45, "fecha": 352, "vencimiento": 322, "concepto": "Infrastructure — monthly", "categoria": "Infrastructure", "revision": "approved", "pagado": true, "pago": 322, "proyectoId": null, "notas": null}, {"id": "g10", "proveedor": "Coworking Belvedo", "proveedorId": "v3", "importe": 786.5, "base": 650, "iva": 136.5, "fecha": 349, "vencimiento": 319, "concepto": "Rent — monthly", "categoria": "Rent", "revision": "approved", "pagado": true, "pago": 319, "proyectoId": null, "notas": null}, {"id": "g11", "proveedor": "Telecom Sarkia", "proveedorId": "v4", "importe": 107.69, "base": 89, "iva": 18.69, "fecha": 348, "vencimiento": 318, "concepto": "Telecoms — monthly", "categoria": "Telecoms", "revision": "approved", "pagado": true, "pago": 318, "proyectoId": null, "notas": null}, {"id": "g12", "proveedor": "Talento Externo Rivelda", "proveedorId": "v8", "importe": 4785.55, "base": 3955, "iva": 830.55, "fecha": 352, "vencimiento": 337, "concepto": "Subcontracted engineering — hours on Sales KPI dashboard", "categoria": "Subcontracting", "revision": "approved", "pagado": true, "pago": 337, "proyectoId": "p1", "notas": null}, {"id": "g13", "proveedor": "Suite Norlem", "proveedorId": "v9", "importe": 254.1, "base": 210, "iva": 44.1, "fecha": 347, "vencimiento": 332, "concepto": "Tool subscriptions — monthly", "categoria": "Software", "revision": "approved", "pagado": true, "pago": 332, "proyectoId": null, "notas": null}, {"id": "g14", "proveedor": "Quiosco Prensa Belvedo", "proveedorId": "v10", "importe": 35.36, "base": 34, "iva": 1.36, "fecha": 341, "vencimiento": 311, "concepto": "Business press and technical publications", "categoria": "Publications", "revision": "approved", "pagado": true, "pago": 311, "proyectoId": null, "notas": null}, {"id": "g15", "proveedor": "Caja Fiduciaria Alvedo", "proveedorId": "v11", "importe": 18, "base": 18, "iva": 0, "fecha": 341, "vencimiento": 311, "concepto": "Account and transfer fees", "categoria": "Financial services", "revision": "approved", "pagado": true, "pago": 311, "proyectoId": null, "notas": "VAT-exempt (Spanish VAT Act art. 20.One.18, financial services)."}, {"id": "g16", "proveedor": "Nubalia Cloud", "proveedorId": "v0", "importe": 54.45, "base": 45, "iva": 9.45, "fecha": 321, "vencimiento": 291, "concepto": "Infrastructure — monthly", "categoria": "Infrastructure", "revision": "approved", "pagado": true, "pago": 291, "proyectoId": null, "notas": null}, {"id": "g17", "proveedor": "Coworking Belvedo", "proveedorId": "v3", "importe": 786.5, "base": 650, "iva": 136.5, "fecha": 318, "vencimiento": 288, "concepto": "Rent — monthly", "categoria": "Rent", "revision": "approved", "pagado": true, "pago": 288, "proyectoId": null, "notas": null}, {"id": "g18", "proveedor": "Telecom Sarkia", "proveedorId": "v4", "importe": 107.69, "base": 89, "iva": 18.69, "fecha": 317, "vencimiento": 287, "concepto": "Telecoms — monthly", "categoria": "Telecoms", "revision": "approved", "pagado": true, "pago": 287, "proyectoId": null, "notas": null}, {"id": "g19", "proveedor": "Talento Externo Rivelda", "proveedorId": "v8", "importe": 7852.9, "base": 6490, "iva": 1362.9, "fecha": 321, "vencimiento": 306, "concepto": "Subcontracted engineering — hours on AI-assisted inventory", "categoria": "Subcontracting", "revision": "approved", "pagado": true, "pago": 306, "proyectoId": "p2", "notas": null}, {"id": "g20", "proveedor": "Suite Norlem", "proveedorId": "v9", "importe": 254.1, "base": 210, "iva": 44.1, "fecha": 316, "vencimiento": 301, "concepto": "Tool subscriptions — monthly", "categoria": "Software", "revision": "approved", "pagado": true, "pago": 301, "proyectoId": null, "notas": null}, {"id": "g21", "proveedor": "Quiosco Prensa Belvedo", "proveedorId": "v10", "importe": 35.36, "base": 34, "iva": 1.36, "fecha": 310, "vencimiento": 280, "concepto": "Business press and technical publications", "categoria": "Publications", "revision": "approved", "pagado": true, "pago": 280, "proyectoId": null, "notas": null}, {"id": "g22", "proveedor": "Caja Fiduciaria Alvedo", "proveedorId": "v11", "importe": 18, "base": 18, "iva": 0, "fecha": 310, "vencimiento": 280, "concepto": "Account and transfer fees", "categoria": "Financial services", "revision": "approved", "pagado": true, "pago": 280, "proyectoId": null, "notas": "VAT-exempt (Spanish VAT Act art. 20.One.18, financial services)."}, {"id": "g23", "proveedor": "Viajes Tarsen", "proveedorId": "v7", "importe": 385, "base": 350, "iva": 35, "fecha": 310, "vencimiento": 280, "concepto": "Travel and accommodation — client visit", "categoria": "Travel", "revision": "approved", "pagado": true, "pago": 280, "proyectoId": null, "notas": null}, {"id": "g24", "proveedor": "Nubalia Cloud", "proveedorId": "v0", "importe": 54.45, "base": 45, "iva": 9.45, "fecha": 291, "vencimiento": 261, "concepto": "Infrastructure — monthly", "categoria": "Infrastructure", "revision": "approved", "pagado": true, "pago": 261, "proyectoId": null, "notas": null}, {"id": "g25", "proveedor": "Coworking Belvedo", "proveedorId": "v3", "importe": 786.5, "base": 650, "iva": 136.5, "fecha": 288, "vencimiento": 258, "concepto": "Rent — monthly", "categoria": "Rent", "revision": "approved", "pagado": true, "pago": 258, "proyectoId": null, "notas": null}, {"id": "g26", "proveedor": "Telecom Sarkia", "proveedorId": "v4", "importe": 107.69, "base": 89, "iva": 18.69, "fecha": 287, "vencimiento": 257, "concepto": "Telecoms — monthly", "categoria": "Telecoms", "revision": "approved", "pagado": true, "pago": 257, "proyectoId": null, "notas": null}, {"id": "g27", "proveedor": "Talento Externo Rivelda", "proveedorId": "v8", "importe": 5166.7, "base": 4270, "iva": 896.7, "fecha": 291, "vencimiento": 276, "concepto": "Subcontracted engineering — hours on Supplier portal", "categoria": "Subcontracting", "revision": "approved", "pagado": true, "pago": 276, "proyectoId": "p3", "notas": null}, {"id": "g28", "proveedor": "Suite Norlem", "proveedorId": "v9", "importe": 263.78, "base": 218, "iva": 45.78, "fecha": 286, "vencimiento": 271, "concepto": "Tool subscriptions — monthly", "categoria": "Software", "revision": "approved", "pagado": true, "pago": 271, "proyectoId": null, "notas": null}, {"id": "g29", "proveedor": "Gestoría Menvia", "proveedorId": "v2", "importe": 623.15, "base": 515, "iva": 108.15, "fecha": 282, "vencimiento": 252, "concepto": "Professional services — Supplier portal", "categoria": "Professional services", "revision": "approved", "pagado": true, "pago": 252, "proyectoId": "p3", "notas": null}, {"id": "g30", "proveedor": "Quiosco Prensa Belvedo", "proveedorId": "v10", "importe": 35.36, "base": 34, "iva": 1.36, "fecha": 280, "vencimiento": 250, "concepto": "Business press and technical publications", "categoria": "Publications", "revision": "approved", "pagado": true, "pago": 250, "proyectoId": null, "notas": null}, {"id": "g31", "proveedor": "Caja Fiduciaria Alvedo", "proveedorId": "v11", "importe": 18, "base": 18, "iva": 0, "fecha": 280, "vencimiento": 250, "concepto": "Account and transfer fees", "categoria": "Financial services", "revision": "approved", "pagado": true, "pago": 250, "proyectoId": null, "notas": "VAT-exempt (Spanish VAT Act art. 20.One.18, financial services)."}, {"id": "g32", "proveedor": "Nubalia Cloud", "proveedorId": "v0", "importe": 54.45, "base": 45, "iva": 9.45, "fecha": 260, "vencimiento": 230, "concepto": "Infrastructure — monthly", "categoria": "Infrastructure", "revision": "approved", "pagado": true, "pago": 230, "proyectoId": null, "notas": null}, {"id": "g33", "proveedor": "Coworking Belvedo", "proveedorId": "v3", "importe": 786.5, "base": 650, "iva": 136.5, "fecha": 257, "vencimiento": 227, "concepto": "Rent — monthly", "categoria": "Rent", "revision": "approved", "pagado": true, "pago": 227, "proyectoId": null, "notas": null}, {"id": "g34", "proveedor": "Telecom Sarkia", "proveedorId": "v4", "importe": 107.69, "base": 89, "iva": 18.69, "fecha": 256, "vencimiento": 226, "concepto": "Telecoms — monthly", "categoria": "Telecoms", "revision": "approved", "pagado": true, "pago": 226, "proyectoId": null, "notas": null}, {"id": "g35", "proveedor": "Talento Externo Rivelda", "proveedorId": "v8", "importe": 9215.36, "base": 7616, "iva": 1599.36, "fecha": 260, "vencimiento": 245, "concepto": "Subcontracted engineering — hours on Smart scheduling", "categoria": "Subcontracting", "revision": "approved", "pagado": true, "pago": 245, "proyectoId": "p4", "notas": null}, {"id": "g36", "proveedor": "Suite Norlem", "proveedorId": "v9", "importe": 263.78, "base": 218, "iva": 45.78, "fecha": 255, "vencimiento": 240, "concepto": "Tool subscriptions — monthly", "categoria": "Software", "revision": "approved", "pagado": true, "pago": 240, "proyectoId": null, "notas": null}, {"id": "g37", "proveedor": "Quiosco Prensa Belvedo", "proveedorId": "v10", "importe": 35.36, "base": 34, "iva": 1.36, "fecha": 249, "vencimiento": 219, "concepto": "Business press and technical publications", "categoria": "Publications", "revision": "approved", "pagado": true, "pago": 219, "proyectoId": null, "notas": null}, {"id": "g38", "proveedor": "Caja Fiduciaria Alvedo", "proveedorId": "v11", "importe": 18, "base": 18, "iva": 0, "fecha": 249, "vencimiento": 219, "concepto": "Account and transfer fees", "categoria": "Financial services", "revision": "approved", "pagado": true, "pago": 219, "proyectoId": null, "notas": "VAT-exempt (Spanish VAT Act art. 20.One.18, financial services)."}, {"id": "g39", "proveedor": "Viajes Tarsen", "proveedorId": "v7", "importe": 264, "base": 240, "iva": 24, "fecha": 249, "vencimiento": 219, "concepto": "Travel and accommodation — client visit", "categoria": "Travel", "revision": "approved", "pagado": true, "pago": 219, "proyectoId": null, "notas": null}, {"id": "g40", "proveedor": "Nubalia Cloud", "proveedorId": "v0", "importe": 54.45, "base": 45, "iva": 9.45, "fecha": 229, "vencimiento": 199, "concepto": "Infrastructure — monthly", "categoria": "Infrastructure", "revision": "approved", "pagado": true, "pago": 199, "proyectoId": null, "notas": null}, {"id": "g41", "proveedor": "Coworking Belvedo", "proveedorId": "v3", "importe": 786.5, "base": 650, "iva": 136.5, "fecha": 226, "vencimiento": 196, "concepto": "Rent — monthly", "categoria": "Rent", "revision": "approved", "pagado": true, "pago": 196, "proyectoId": null, "notas": null}, {"id": "g42", "proveedor": "Telecom Sarkia", "proveedorId": "v4", "importe": 107.69, "base": 89, "iva": 18.69, "fecha": 225, "vencimiento": 195, "concepto": "Telecoms — monthly", "categoria": "Telecoms", "revision": "approved", "pagado": true, "pago": 195, "proyectoId": null, "notas": null}, {"id": "g43", "proveedor": "Talento Externo Rivelda", "proveedorId": "v8", "importe": 4912.6, "base": 4060, "iva": 852.6, "fecha": 229, "vencimiento": 214, "concepto": "Subcontracted engineering — hours on Document manager", "categoria": "Subcontracting", "revision": "approved", "pagado": true, "pago": 214, "proyectoId": "p5", "notas": null}, {"id": "g44", "proveedor": "Suite Norlem", "proveedorId": "v9", "importe": 263.78, "base": 218, "iva": 45.78, "fecha": 224, "vencimiento": 209, "concepto": "Tool subscriptions — monthly", "categoria": "Software", "revision": "approved", "pagado": true, "pago": 209, "proyectoId": null, "notas": null}, {"id": "g45", "proveedor": "Quiosco Prensa Belvedo", "proveedorId": "v10", "importe": 35.36, "base": 34, "iva": 1.36, "fecha": 218, "vencimiento": 188, "concepto": "Business press and technical publications", "categoria": "Publications", "revision": "approved", "pagado": true, "pago": 188, "proyectoId": null, "notas": null}, {"id": "g46", "proveedor": "Caja Fiduciaria Alvedo", "proveedorId": "v11", "importe": 18, "base": 18, "iva": 0, "fecha": 218, "vencimiento": 188, "concepto": "Account and transfer fees", "categoria": "Financial services", "revision": "approved", "pagado": true, "pago": 188, "proyectoId": null, "notas": "VAT-exempt (Spanish VAT Act art. 20.One.18, financial services)."}, {"id": "g47", "proveedor": "Nubalia Cloud", "proveedorId": "v0", "importe": 54.45, "base": 45, "iva": 9.45, "fecha": 201, "vencimiento": 171, "concepto": "Infrastructure — monthly", "categoria": "Infrastructure", "revision": "approved", "pagado": true, "pago": 171, "proyectoId": null, "notas": null}, {"id": "g48", "proveedor": "Coworking Belvedo", "proveedorId": "v3", "importe": 786.5, "base": 650, "iva": 136.5, "fecha": 198, "vencimiento": 168, "concepto": "Rent — monthly", "categoria": "Rent", "revision": "approved", "pagado": true, "pago": 168, "proyectoId": null, "notas": null}, {"id": "g49", "proveedor": "Telecom Sarkia", "proveedorId": "v4", "importe": 107.69, "base": 89, "iva": 18.69, "fecha": 197, "vencimiento": 167, "concepto": "Telecoms — monthly", "categoria": "Telecoms", "revision": "approved", "pagado": true, "pago": 167, "proyectoId": null, "notas": null}, {"id": "g50", "proveedor": "Talento Externo Rivelda", "proveedorId": "v8", "importe": 11417.56, "base": 9436, "iva": 1981.56, "fecha": 201, "vencimiento": 186, "concepto": "Subcontracted engineering — hours on Vehicle check-in", "categoria": "Subcontracting", "revision": "approved", "pagado": true, "pago": 186, "proyectoId": "p6", "notas": null}, {"id": "g51", "proveedor": "Suite Norlem", "proveedorId": "v9", "importe": 274.67, "base": 227, "iva": 47.67, "fecha": 196, "vencimiento": 181, "concepto": "Tool subscriptions — monthly", "categoria": "Software", "revision": "approved", "pagado": true, "pago": 181, "proyectoId": null, "notas": null}, {"id": "g52", "proveedor": "Caja Fiduciaria Alvedo", "proveedorId": "v11", "importe": 613, "base": 613, "iva": 0, "fecha": 192, "vencimiento": 162, "concepto": "Financial services — Route automation", "categoria": "Financial services", "revision": "approved", "pagado": true, "pago": 162, "proyectoId": "p0", "notas": "VAT-exempt (Spanish VAT Act art. 20.One.18, financial services)."}, {"id": "g53", "proveedor": "Quiosco Prensa Belvedo", "proveedorId": "v10", "importe": 35.36, "base": 34, "iva": 1.36, "fecha": 190, "vencimiento": 160, "concepto": "Business press and technical publications", "categoria": "Publications", "revision": "approved", "pagado": true, "pago": 160, "proyectoId": null, "notas": null}, {"id": "g54", "proveedor": "Caja Fiduciaria Alvedo", "proveedorId": "v11", "importe": 18, "base": 18, "iva": 0, "fecha": 190, "vencimiento": 160, "concepto": "Account and transfer fees", "categoria": "Financial services", "revision": "approved", "pagado": true, "pago": 160, "proyectoId": null, "notas": "VAT-exempt (Spanish VAT Act art. 20.One.18, financial services)."}, {"id": "g55", "proveedor": "Viajes Tarsen", "proveedorId": "v7", "importe": 385, "base": 350, "iva": 35, "fecha": 190, "vencimiento": 160, "concepto": "Travel and accommodation — client visit", "categoria": "Travel", "revision": "approved", "pagado": true, "pago": 160, "proyectoId": null, "notas": null}, {"id": "g56", "proveedor": "Nubalia Cloud", "proveedorId": "v0", "importe": 54.45, "base": 45, "iva": 9.45, "fecha": 170, "vencimiento": 140, "concepto": "Infrastructure — monthly", "categoria": "Infrastructure", "revision": "approved", "pagado": true, "pago": 140, "proyectoId": null, "notas": null}, {"id": "g57", "proveedor": "Coworking Belvedo", "proveedorId": "v3", "importe": 786.5, "base": 650, "iva": 136.5, "fecha": 167, "vencimiento": 137, "concepto": "Rent — monthly", "categoria": "Rent", "revision": "approved", "pagado": true, "pago": 137, "proyectoId": null, "notas": null}, {"id": "g58", "proveedor": "Telecom Sarkia", "proveedorId": "v4", "importe": 107.69, "base": 89, "iva": 18.69, "fecha": 166, "vencimiento": 136, "concepto": "Telecoms — monthly", "categoria": "Telecoms", "revision": "approved", "pagado": true, "pago": 136, "proyectoId": null, "notas": null}, {"id": "g59", "proveedor": "Talento Externo Rivelda", "proveedorId": "v8", "importe": 4658.5, "base": 3850, "iva": 808.5, "fecha": 170, "vencimiento": 155, "concepto": "Subcontracted engineering — hours on Digital catalogue", "categoria": "Subcontracting", "revision": "approved", "pagado": true, "pago": 155, "proyectoId": "p7", "notas": null}, {"id": "g60", "proveedor": "Suite Norlem", "proveedorId": "v9", "importe": 274.67, "base": 227, "iva": 47.67, "fecha": 165, "vencimiento": 150, "concepto": "Tool subscriptions — monthly", "categoria": "Software", "revision": "approved", "pagado": true, "pago": 150, "proyectoId": null, "notas": null}, {"id": "g61", "proveedor": "Quiosco Prensa Belvedo", "proveedorId": "v10", "importe": 35.36, "base": 34, "iva": 1.36, "fecha": 159, "vencimiento": 129, "concepto": "Business press and technical publications", "categoria": "Publications", "revision": "approved", "pagado": true, "pago": 129, "proyectoId": null, "notas": null}, {"id": "g62", "proveedor": "Caja Fiduciaria Alvedo", "proveedorId": "v11", "importe": 18, "base": 18, "iva": 0, "fecha": 159, "vencimiento": 129, "concepto": "Account and transfer fees", "categoria": "Financial services", "revision": "approved", "pagado": true, "pago": 129, "proyectoId": null, "notas": "VAT-exempt (Spanish VAT Act art. 20.One.18, financial services)."}, {"id": "g63", "proveedor": "Nubalia Cloud", "proveedorId": "v0", "importe": 54.45, "base": 45, "iva": 9.45, "fecha": 140, "vencimiento": 110, "concepto": "Infrastructure — monthly", "categoria": "Infrastructure", "revision": "approved", "pagado": true, "pago": 110, "proyectoId": null, "notas": null}, {"id": "g64", "proveedor": "Coworking Belvedo", "proveedorId": "v3", "importe": 786.5, "base": 650, "iva": 136.5, "fecha": 137, "vencimiento": 107, "concepto": "Rent — monthly", "categoria": "Rent", "revision": "approved", "pagado": true, "pago": 107, "proyectoId": null, "notas": null}, {"id": "g65", "proveedor": "Telecom Sarkia", "proveedorId": "v4", "importe": 107.69, "base": 89, "iva": 18.69, "fecha": 136, "vencimiento": 106, "concepto": "Telecoms — monthly", "categoria": "Telecoms", "revision": "approved", "pagado": true, "pago": 106, "proyectoId": null, "notas": null}, {"id": "g66", "proveedor": "Talento Externo Rivelda", "proveedorId": "v8", "importe": 11404.25, "base": 9425, "iva": 1979.25, "fecha": 140, "vencimiento": 125, "concepto": "Subcontracted engineering — hours on Route automation", "categoria": "Subcontracting", "revision": "approved", "pagado": true, "pago": 125, "proyectoId": "p0", "notas": null}, {"id": "g67", "proveedor": "Suite Norlem", "proveedorId": "v9", "importe": 274.67, "base": 227, "iva": 47.67, "fecha": 135, "vencimiento": 120, "concepto": "Tool subscriptions — monthly", "categoria": "Software", "revision": "approved", "pagado": true, "pago": 120, "proyectoId": null, "notas": null}, {"id": "g68", "proveedor": "Quiosco Prensa Belvedo", "proveedorId": "v10", "importe": 35.36, "base": 34, "iva": 1.36, "fecha": 129, "vencimiento": 99, "concepto": "Business press and technical publications", "categoria": "Publications", "revision": "approved", "pagado": true, "pago": 99, "proyectoId": null, "notas": null}, {"id": "g69", "proveedor": "Caja Fiduciaria Alvedo", "proveedorId": "v11", "importe": 18, "base": 18, "iva": 0, "fecha": 129, "vencimiento": 99, "concepto": "Account and transfer fees", "categoria": "Financial services", "revision": "approved", "pagado": true, "pago": 99, "proyectoId": null, "notas": "VAT-exempt (Spanish VAT Act art. 20.One.18, financial services)."}, {"id": "g70", "proveedor": "Viajes Tarsen", "proveedorId": "v7", "importe": 264, "base": 240, "iva": 24, "fecha": 129, "vencimiento": 99, "concepto": "Travel and accommodation — client visit", "categoria": "Travel", "revision": "approved", "pagado": true, "pago": 99, "proyectoId": null, "notas": null}, {"id": "g71", "proveedor": "Nubalia Cloud", "proveedorId": "v0", "importe": 54.45, "base": 45, "iva": 9.45, "fecha": 109, "vencimiento": 79, "concepto": "Infrastructure — monthly", "categoria": "Infrastructure", "revision": "approved", "pagado": true, "pago": 79, "proyectoId": null, "notas": null}, {"id": "g72", "proveedor": "Coworking Belvedo", "proveedorId": "v3", "importe": 786.5, "base": 650, "iva": 136.5, "fecha": 106, "vencimiento": 76, "concepto": "Rent — monthly", "categoria": "Rent", "revision": "approved", "pagado": true, "pago": 76, "proyectoId": null, "notas": null}, {"id": "g73", "proveedor": "Telecom Sarkia", "proveedorId": "v4", "importe": 107.69, "base": 89, "iva": 18.69, "fecha": 105, "vencimiento": 75, "concepto": "Telecoms — monthly", "categoria": "Telecoms", "revision": "approved", "pagado": true, "pago": 75, "proyectoId": null, "notas": null}, {"id": "g74", "proveedor": "Talento Externo Rivelda", "proveedorId": "v8", "importe": 5039.65, "base": 4165, "iva": 874.65, "fecha": 109, "vencimiento": 94, "concepto": "Subcontracted engineering — hours on Sales KPI dashboard", "categoria": "Subcontracting", "revision": "approved", "pagado": true, "pago": 94, "proyectoId": "p1", "notas": null}, {"id": "g75", "proveedor": "Suite Norlem", "proveedorId": "v9", "importe": 285.56, "base": 236, "iva": 49.56, "fecha": 104, "vencimiento": 89, "concepto": "Tool subscriptions — monthly", "categoria": "Software", "revision": "approved", "pagado": true, "pago": 89, "proyectoId": null, "notas": null}, {"id": "g76", "proveedor": "Gestoría Menvia", "proveedorId": "v2", "importe": 821.59, "base": 679, "iva": 142.59, "fecha": 100, "vencimiento": 70, "concepto": "Professional services — Document manager", "categoria": "Professional services", "revision": "approved", "pagado": true, "pago": 70, "proyectoId": "p5", "notas": null}, {"id": "g77", "proveedor": "Quiosco Prensa Belvedo", "proveedorId": "v10", "importe": 35.36, "base": 34, "iva": 1.36, "fecha": 98, "vencimiento": 68, "concepto": "Business press and technical publications", "categoria": "Publications", "revision": "approved", "pagado": true, "pago": 68, "proyectoId": null, "notas": null}, {"id": "g78", "proveedor": "Caja Fiduciaria Alvedo", "proveedorId": "v11", "importe": 18, "base": 18, "iva": 0, "fecha": 98, "vencimiento": 68, "concepto": "Account and transfer fees", "categoria": "Financial services", "revision": "approved", "pagado": true, "pago": 68, "proyectoId": null, "notas": "VAT-exempt (Spanish VAT Act art. 20.One.18, financial services)."}, {"id": "g79", "proveedor": "Nubalia Cloud", "proveedorId": "v0", "importe": 54.45, "base": 45, "iva": 9.45, "fecha": 79, "vencimiento": 49, "concepto": "Infrastructure — monthly", "categoria": "Infrastructure", "revision": "approved", "pagado": true, "pago": 49, "proyectoId": null, "notas": null}, {"id": "g80", "proveedor": "Coworking Belvedo", "proveedorId": "v3", "importe": 786.5, "base": 650, "iva": 136.5, "fecha": 76, "vencimiento": 46, "concepto": "Rent — monthly", "categoria": "Rent", "revision": "approved", "pagado": true, "pago": 46, "proyectoId": null, "notas": null}, {"id": "g81", "proveedor": "Telecom Sarkia", "proveedorId": "v4", "importe": 107.69, "base": 89, "iva": 18.69, "fecha": 75, "vencimiento": 45, "concepto": "Telecoms — monthly", "categoria": "Telecoms", "revision": "approved", "pagado": true, "pago": 45, "proyectoId": null, "notas": null}, {"id": "g82", "proveedor": "Talento Externo Rivelda", "proveedorId": "v8", "importe": 10737.54, "base": 8874, "iva": 1863.54, "fecha": 79, "vencimiento": 64, "concepto": "Subcontracted engineering — hours on AI-assisted inventory", "categoria": "Subcontracting", "revision": "approved", "pagado": true, "pago": 64, "proyectoId": "p2", "notas": null}, {"id": "g83", "proveedor": "Suite Norlem", "proveedorId": "v9", "importe": 285.56, "base": 236, "iva": 49.56, "fecha": 74, "vencimiento": 59, "concepto": "Tool subscriptions — monthly", "categoria": "Software", "revision": "approved", "pagado": true, "pago": 59, "proyectoId": null, "notas": null}, {"id": "g84", "proveedor": "Quiosco Prensa Belvedo", "proveedorId": "v10", "importe": 35.36, "base": 34, "iva": 1.36, "fecha": 68, "vencimiento": 38, "concepto": "Business press and technical publications", "categoria": "Publications", "revision": "approved", "pagado": true, "pago": 38, "proyectoId": null, "notas": null}, {"id": "g85", "proveedor": "Caja Fiduciaria Alvedo", "proveedorId": "v11", "importe": 18, "base": 18, "iva": 0, "fecha": 68, "vencimiento": 38, "concepto": "Account and transfer fees", "categoria": "Financial services", "revision": "approved", "pagado": true, "pago": 38, "proyectoId": null, "notas": "VAT-exempt (Spanish VAT Act art. 20.One.18, financial services)."}, {"id": "g86", "proveedor": "Viajes Tarsen", "proveedorId": "v7", "importe": 385, "base": 350, "iva": 35, "fecha": 68, "vencimiento": 38, "concepto": "Travel and accommodation — client visit", "categoria": "Travel", "revision": "approved", "pagado": true, "pago": 38, "proyectoId": null, "notas": null}, {"id": "g87", "proveedor": "Nubalia Cloud", "proveedorId": "v0", "importe": 54.45, "base": 45, "iva": 9.45, "fecha": 48, "vencimiento": 18, "concepto": "Infrastructure — monthly", "categoria": "Infrastructure", "revision": "approved", "pagado": true, "pago": 18, "proyectoId": null, "notas": null}, {"id": "g88", "proveedor": "Coworking Belvedo", "proveedorId": "v3", "importe": 786.5, "base": 650, "iva": 136.5, "fecha": 45, "vencimiento": 15, "concepto": "Rent — monthly", "categoria": "Rent", "revision": "approved", "pagado": true, "pago": 15, "proyectoId": null, "notas": null}, {"id": "g89", "proveedor": "Telecom Sarkia", "proveedorId": "v4", "importe": 107.69, "base": 89, "iva": 18.69, "fecha": 44, "vencimiento": 14, "concepto": "Telecoms — monthly", "categoria": "Telecoms", "revision": "approved", "pagado": true, "pago": 14, "proyectoId": null, "notas": null}, {"id": "g90", "proveedor": "Talento Externo Rivelda", "proveedorId": "v8", "importe": 4785.55, "base": 3955, "iva": 830.55, "fecha": 48, "vencimiento": 33, "concepto": "Subcontracted engineering — hours on Supplier portal", "categoria": "Subcontracting", "revision": "approved", "pagado": true, "pago": 33, "proyectoId": "p3", "notas": null}, {"id": "g91", "proveedor": "Suite Norlem", "proveedorId": "v9", "importe": 285.56, "base": 236, "iva": 49.56, "fecha": 43, "vencimiento": 28, "concepto": "Tool subscriptions — monthly", "categoria": "Software", "revision": "approved", "pagado": true, "pago": 28, "proyectoId": null, "notas": null}, {"id": "g92", "proveedor": "Quiosco Prensa Belvedo", "proveedorId": "v10", "importe": 35.36, "base": 34, "iva": 1.36, "fecha": 37, "vencimiento": 7, "concepto": "Business press and technical publications", "categoria": "Publications", "revision": "approved", "pagado": true, "pago": 7, "proyectoId": null, "notas": null}, {"id": "g93", "proveedor": "Caja Fiduciaria Alvedo", "proveedorId": "v11", "importe": 18, "base": 18, "iva": 0, "fecha": 37, "vencimiento": 7, "concepto": "Account and transfer fees", "categoria": "Financial services", "revision": "approved", "pagado": true, "pago": 7, "proyectoId": null, "notas": "VAT-exempt (Spanish VAT Act art. 20.One.18, financial services)."}, {"id": "g94", "proveedor": "Nubalia Cloud", "proveedorId": "v0", "importe": 54.45, "base": 45, "iva": 9.45, "fecha": 17, "vencimiento": -13, "concepto": "Infrastructure — monthly", "categoria": "Infrastructure", "revision": "pending_review", "pagado": false, "pago": null, "proyectoId": null, "notas": null}, {"id": "g95", "proveedor": "Coworking Belvedo", "proveedorId": "v3", "importe": 786.5, "base": 650, "iva": 136.5, "fecha": 14, "vencimiento": -16, "concepto": "Rent — monthly", "categoria": "Rent", "revision": "pending_review", "pagado": false, "pago": null, "proyectoId": null, "notas": null}, {"id": "g96", "proveedor": "Telecom Sarkia", "proveedorId": "v4", "importe": 107.69, "base": 89, "iva": 18.69, "fecha": 13, "vencimiento": -17, "concepto": "Telecoms — monthly", "categoria": "Telecoms", "revision": "pending_review", "pagado": false, "pago": null, "proyectoId": null, "notas": null}, {"id": "g97", "proveedor": "Talento Externo Rivelda", "proveedorId": "v8", "importe": 9716.3, "base": 8030, "iva": 1686.3, "fecha": 17, "vencimiento": 2, "concepto": "Subcontracted engineering — hours on Smart scheduling", "categoria": "Subcontracting", "revision": "pending_review", "pagado": false, "pago": null, "proyectoId": "p4", "notas": null}, {"id": "g98", "proveedor": "Suite Norlem", "proveedorId": "v9", "importe": 297.66, "base": 246, "iva": 51.66, "fecha": 12, "vencimiento": -3, "concepto": "Tool subscriptions — monthly", "categoria": "Software", "revision": "pending_review", "pagado": false, "pago": null, "proyectoId": null, "notas": null}, {"id": "g99", "proveedor": "Gestoría Menvia", "proveedorId": "v2", "importe": 327.91, "base": 271, "iva": 56.91, "fecha": 8, "vencimiento": -22, "concepto": "Professional services — AI-assisted inventory", "categoria": "Professional services", "revision": "pending_review", "pagado": false, "pago": null, "proyectoId": "p2", "notas": null}, {"id": "g100", "proveedor": "Quiosco Prensa Belvedo", "proveedorId": "v10", "importe": 35.36, "base": 34, "iva": 1.36, "fecha": 6, "vencimiento": -24, "concepto": "Business press and technical publications", "categoria": "Publications", "revision": "pending_review", "pagado": false, "pago": null, "proyectoId": null, "notas": null}, {"id": "g101", "proveedor": "Caja Fiduciaria Alvedo", "proveedorId": "v11", "importe": 18, "base": 18, "iva": 0, "fecha": 6, "vencimiento": -24, "concepto": "Account and transfer fees", "categoria": "Financial services", "revision": "pending_review", "pagado": false, "pago": null, "proyectoId": null, "notas": "VAT-exempt (Spanish VAT Act art. 20.One.18, financial services)."}, {"id": "g102", "proveedor": "Viajes Tarsen", "proveedorId": "v7", "importe": 264, "base": 240, "iva": 24, "fecha": 6, "vencimiento": -24, "concepto": "Travel and accommodation — client visit", "categoria": "Travel", "revision": "pending_review", "pagado": false, "pago": null, "proyectoId": null, "notas": null}, {"id": "g103", "proveedor": "Viajes Tarsen", "proveedorId": "v7", "importe": 212.4, "base": null, "iva": null, "fecha": 4, "vencimiento": -11, "concepto": "Receipt with no breakdown — full invoice still to be requested", "categoria": "Travel", "revision": "pending_review", "pagado": false, "pago": null, "proyectoId": null, "notas": "No net amount or VAT broken out: nothing is estimated. Ask the supplier for a full invoice."}], "presupuestos": [{"id": "q0", "empresa": "Vandria Logística S.L.", "clienteId": "c0", "estado": "converted", "fecha": 347, "importe": 12100, "resumen": "Automation proposal for Vandria Logística S.L.", "servicios": "Process analysis, rollout and team training.", "facturaId": "f0"}, {"id": "q1", "empresa": "Pelmar Retail", "clienteId": "c1", "estado": "converted", "fecha": 315, "importe": 5050, "resumen": "Automation proposal for Pelmar Retail.", "servicios": "Process analysis, rollout and team training.", "facturaId": "f1"}, {"id": "q2", "empresa": "Ferretería Olvanta", "clienteId": "c2", "estado": "accepted", "fecha": 284, "importe": 14200, "resumen": "Automation proposal for Ferretería Olvanta.", "servicios": "Process analysis, rollout and team training.", "facturaId": null}, {"id": "q3", "empresa": "Grupo Alimentario Brance", "clienteId": "c3", "estado": "sent", "fecha": 252, "importe": 8450, "resumen": "Automation proposal for Grupo Alimentario Brance.", "servicios": "Process analysis, rollout and team training.", "facturaId": null}, {"id": "q4", "empresa": "Clínica Dental Solmara", "clienteId": "c4", "estado": "sent", "fecha": 220, "importe": 13250, "resumen": "Automation proposal for Clínica Dental Solmara.", "servicios": "Process analysis, rollout and team training.", "facturaId": null}, {"id": "q5", "empresa": "Arquitectura Veltris", "clienteId": "c5", "estado": "rejected", "fecha": 191, "importe": 10150, "resumen": "Automation proposal for Arquitectura Veltris.", "servicios": "Process analysis, rollout and team training.", "facturaId": null}, {"id": "q6", "empresa": "Talleres Korvan", "clienteId": "c6", "estado": "draft", "fecha": 159, "importe": 5850, "resumen": "Automation proposal for Talleres Korvan.", "servicios": "Process analysis, rollout and team training.", "facturaId": null}, {"id": "q7", "empresa": "Editorial Tarnia", "clienteId": "c7", "estado": "expired", "fecha": 128, "importe": 8550, "resumen": "Automation proposal for Editorial Tarnia.", "servicios": "Process analysis, rollout and team training.", "facturaId": null}, {"id": "q8", "empresa": "Hostelería Malvés", "clienteId": "c8", "estado": "converted", "fecha": 96, "importe": 15050, "resumen": "Automation proposal for Hostelería Malvés.", "servicios": "Process analysis, rollout and team training.", "facturaId": "f5"}, {"id": "q9", "empresa": "Seguros Lintara", "clienteId": "c9", "estado": "sent", "fecha": 65, "importe": 6050, "resumen": "Automation proposal for Seguros Lintara.", "servicios": "Process analysis, rollout and team training.", "facturaId": null}]};
;

  // ── recomposición de fechas ─────────────────────────────────────────────
  // Hoy a medianoche UTC: la demo tiene que enseñar el mismo día entero
  // aunque se abra a las siete de la mañana o a las once de la noche.
  var AHORA = new Date();
  var HOY_MS = Date.UTC(AHORA.getFullYear(), AHORA.getMonth(), AHORA.getDate());
  var DIA_MS = 86400000;
  function fecha(off) {
    if (off === null || off === undefined) return null;
    return new Date(HOY_MS - off * DIA_MS).toISOString().slice(0, 10);
  }
  var HOY = fecha(0);

  function diasEntre(desde, hasta) {
    if (!desde || !hasta) return null;
    return Math.round((Date.parse(hasta) - Date.parse(desde)) / DIA_MS);
  }

  // ── reconstrucción de los registros ─────────────────────────────────────
  // Se publican con DOS juegos de nombres: los cortos del fichero y los
  // largos que ya usaban las pantallas. No es redundancia gratuita: evita
  // tocar dos mil líneas de renderizado para un cambio de datos, y el día que
  // se limpien los largos, se limpian en un sitio.
  var CLIENTES = CRUDO.clientes.map(function (c) {
    c.nombre = c.empresa;
    c.facturaIds = [];
    return c;
  });
  var PROVEEDORES = CRUDO.proveedores;
  var PROYECTOS = CRUDO.proyectos.map(function (p) {
    p.fechaInicio = fecha(p.inicio);
    p.fechaEntregaPrevista = fecha(p.prevista);
    p.fechaEntregaReal = fecha(p.real);
    p.serviciosContratados = p.servicios;
    p.estado = (p.estado === 'entregado' || p.estado === 'delivered') ? 'Delivered' : (p.estado === 'en_curso' || p.estado === 'in_progress') ? 'In progress' : cap(p.estado);
    return p;
  });

  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ') : s; }

  var EST_FAC = { pagada: 'Paid', enviada: 'Sent', vencida: 'Sent', borrador: 'Draft' };
  var FACTURAS = CRUDO.facturas.map(function (f) {
    f.fechaEmision = fecha(f.emision);
    f.fechaVencimiento = fecha(f.vencimiento);
    f.fechaPago = fecha(f.pago);
    f.clienteNombre = f.cliente;
    f.clienteIds = f.clienteId ? [f.clienteId] : [];
    f.importeCobrado = f.cobrado;
    f.estadoBruto = f.estado;
    f.estado = EST_FAC[f.estado] || cap(f.estado);
    /* Los estados en bruto de los datos ingleses están traducidos («paid»):
       comparar solo con la clave española dejaba TODAS las facturas como no
       pagadas y todos los gastos como pendientes de revisión. */
    f.pagada = f.estadoBruto === 'pagada' || f.estadoBruto === 'paid';
    f.recordatoriosEnviados = f.recordatorios;
    f.observaciones = null;
    return f;
  });
  FACTURAS.forEach(function (f) {
    var c = byId(CLIENTES, f.clienteId);
    if (c) c.facturaIds.push(f.id);
  });

  var COBROS = CRUDO.cobros.map(function (c) { c.fechaCobro = fecha(c.fecha); return c; });

  var GASTOS = CRUDO.gastos.map(function (g) {
    g.fechaGasto = fecha(g.fecha);
    g.fechaVencimiento = fecha(g.vencimiento);
    g.fechaPago = fecha(g.pago);
    g.estadoRevision = (g.revision === 'aprobado' || g.revision === 'approved') ? 'Approved' : 'Pending review';
    g.proyectoRecordId = g.proyectoId;
    g.notasRevision = g.notas;
    return g;
  });

  var EST_PRE = { convertido: 'Converted', aceptado: 'Accepted', enviado: 'Sent',
                  rechazado: 'Rejected', borrador: 'Draft', caducado: 'Expired' };
  var PRESUPUESTOS = CRUDO.presupuestos.map(function (p) {
    p.fechaGeneracion = fecha(p.fecha);
    p.estado = EST_PRE[p.estado] || cap(p.estado);
    p.resumenEjecutivo = p.resumen;
    p.serviciosPropuestos = p.servicios;
    p.aceptadaPorCliente = p.estado === 'Accepted' || p.estado === 'Converted';
    p.facturaGeneradaId = p.facturaId;
    p.clienteRecordId = p.clienteId;
    return p;
  });

  function byId(lista, id) {
    for (var i = 0; i < lista.length; i++) if (lista[i].id === id) return lista[i];
    return null;
  }
  function suma(lista, f) { var t = 0; for (var i = 0; i < lista.length; i++) t += f(lista[i]) || 0; return t; }
  function emitidas() { return FACTURAS.filter(function (f) { return f.estado !== 'Draft'; }); }
  function pendienteDe(f) { return Math.max(0, (f.importe || 0) - (f.importeCobrado || 0)); }
  function diasDeRetraso(f) {
    if (!f.fechaVencimiento || pendienteDe(f) <= 0) return 0;
    var d = diasEntre(f.fechaVencimiento, HOY);
    return d > 0 ? d : 0;
  }
  function estadoCobroDe(f) {
    if (f.estado === 'Draft') return null;
    if (pendienteDe(f) <= 0) return 'Collected';
    if (diasDeRetraso(f) > 0) return f.recordatoriosEnviados >= 2 ? 'Being chased' : 'Overdue';
    return 'Outstanding';
  }
  FACTURAS.forEach(function (f) { f.estadoCobro = estadoCobroDe(f); });

  // ══════════════════ LO QUE CALCULA EL PANEL ══════════════════
  // Todo esto lo calcula el producto en el servidor. Aquí se calcula en el
  // navegador sobre los mismos datos y con las mismas reglas, porque una
  // demo que enseña cifras precocinadas se nota: en cuanto tocas algo, deja
  // de cuadrar.
  var MESES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function clave(iso) { return iso ? iso.slice(0, 7) : null; }
  function etiquetaMes(k) {
    var p = k.split('-');
    return MESES[parseInt(p[1], 10) - 1] + ' ' + p[0].slice(2);
  }
  function ultimosMeses(n) {
    var out = [], d = new Date(HOY_MS);
    for (var i = n - 1; i >= 0; i--) {
      var m = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - i, 1));
      out.push(m.toISOString().slice(0, 7));
    }
    return out;
  }

  var EVOLUCION = (function () {
    var ks = ultimosMeses(12), idx = {};
    var filas = ks.map(function (k) {
      var f = { mes: k, etiqueta: etiquetaMes(k), cobrado: 0, gastos: 0, facturado: 0, resultado: 0 };
      idx[k] = f; return f;
    });
    COBROS.forEach(function (c) { var f = idx[clave(c.fechaCobro)]; if (f) f.cobrado += c.importe; });
    GASTOS.forEach(function (g) { var f = idx[clave(g.fechaGasto)]; if (f) f.gastos += g.importe; });
    emitidas().forEach(function (x) { var f = idx[clave(x.fechaEmision)]; if (f) f.facturado += x.importe; });
    filas.forEach(function (f) {
      f.cobrado = Math.round(f.cobrado * 100) / 100;
      f.gastos = Math.round(f.gastos * 100) / 100;
      f.facturado = Math.round(f.facturado * 100) / 100;
      f.resultado = Math.round((f.facturado - f.gastos) * 100) / 100;
    });
    return filas;
  })();

  var SNAP = (function () {
    var lista = emitidas();
    var facturado = suma(lista, function (f) { return f.importe; });
    var cobrado = suma(lista, function (f) { return f.importeCobrado; });
    var pendiente = suma(lista, pendienteDe);
    var vencidas = lista.filter(function (f) { return diasDeRetraso(f) > 0; });
    var vencido = suma(vencidas, pendienteDe);
    var gastos = suma(GASTOS, function (g) { return g.importe; });
    var en30 = lista.filter(function (f) {
      var d = diasEntre(HOY, f.fechaVencimiento);
      return pendienteDe(f) > 0 && d !== null && d >= 0 && d <= 30;
    });
    var activos = PROYECTOS.filter(function (p) { return p.estado === 'In progress'; });
    var mesActual = EVOLUCION[EVOLUCION.length - 1], mesPrevio = EVOLUCION[EVOLUCION.length - 2];
    // Mediana de días que se tarda en cobrar: la mediana y no la media,
    // porque una sola factura muy vieja desplaza la media y deja de describir
    // lo que pasa normalmente.
    var dias = [];
    FACTURAS.forEach(function (f) {
      if (f.fechaPago && f.fechaEmision) { var d = diasEntre(f.fechaEmision, f.fechaPago); if (d >= 0) dias.push(d); }
    });
    dias.sort(function (a, b) { return a - b; });
    var dso = dias.length ? dias[Math.floor(dias.length / 2)] : null;
    return {
      totalFacturado: facturado, totalCobrado: cobrado, totalPendiente: pendiente,
      totalVencido: vencido, totalGastos: gastos,
      nVencidas: vencidas.length,
      venceEn30: suma(en30, pendienteDe), nVence30: en30.length,
      proyectosActivos: activos.length,
      resultadoMes: mesActual.resultado, resultadoMesPrevio: mesPrevio.resultado,
      dso: dso,
      sinFacturar: suma(PRESUPUESTOS.filter(function (p) { return p.estado === 'Accepted'; }),
                        function (p) { return p.importe; }),
      margen: Math.round((facturado - gastos) * 100) / 100,
      fechaCalculo: HOY
    };
  })();

  // Lo que se debe, por antigüedad. Los tramos son los del producto.
  var ANTIGUEDAD = (function () {
    var tramos = [
      { etiqueta: 'Up to date', nivel: 'ok', total: 0, n: 0 },
      { etiqueta: '1 to 30 days', nivel: 'aviso', total: 0, n: 0 },
      { etiqueta: '31 to 60 days', nivel: 'serio', total: 0, n: 0 },
      { etiqueta: 'Over 60 days', nivel: 'critico', total: 0, n: 0 }
    ];
    emitidas().forEach(function (f) {
      var p = pendienteDe(f); if (p <= 0) return;
      var d = diasDeRetraso(f);
      var i = d <= 0 ? 0 : d <= 30 ? 1 : d <= 60 ? 2 : 3;
      tramos[i].total += p; tramos[i].n++;
    });
    var total = suma(tramos, function (t) { return t.total; }) || 1;
    tramos.forEach(function (t) {
      t.total = Math.round(t.total * 100) / 100;
      t.pct = Math.round((t.total / total) * 1000) / 10;
    });
    return { tramos: tramos.filter(function (t) { return t.total > 0; }), total: Math.round(total * 100) / 100 };
  })();

  // De quién depende la facturación. Un cliente por encima del 30 % es un
  // riesgo, y el producto lo dice con esas palabras.
  var CONCENTRACION = (function () {
    var por = {};
    emitidas().forEach(function (f) { por[f.cliente] = (por[f.cliente] || 0) + f.importe; });
    var total = 0, n;
    for (n in por) total += por[n];
    var filas = Object.keys(por).map(function (k) {
      return { cliente: k, total: Math.round(por[k] * 100) / 100, pct: Math.round((por[k] / total) * 1000) / 10 };
    }).sort(function (a, b) { return b.total - a.total; });
    return { filas: filas.slice(0, 6), total: Math.round(total * 100) / 100,
             riesgo: filas.length && filas[0].pct >= 30 ? filas[0] : null };
  })();

  // Previsión de caja a 30 días. El saldo del banco NO está en el sistema y
  // el producto lo dice en vez de inventarse uno: esto es variación, no saldo.
  var PREVISION = (function () {
    var entra = 0, sale = 0;
    emitidas().forEach(function (f) {
      var p = pendienteDe(f); if (p <= 0) return;
      var d = diasEntre(HOY, f.fechaVencimiento);
      if (d !== null && d >= -30 && d <= 30) entra += p;
    });
    GASTOS.forEach(function (g) {
      if (g.pagado) return;
      var d = diasEntre(HOY, g.fechaVencimiento || g.fechaGasto);
      if (d !== null && d >= -30 && d <= 30) sale += g.importe;
    });
    entra = Math.round(entra * 100) / 100; sale = Math.round(sale * 100) / 100;
    return { entra: entra, sale: sale, neto: Math.round((entra - sale) * 100) / 100 };
  })();

  var RENTABILIDAD = PROYECTOS.map(function (p) {
    var fs = FACTURAS.filter(function (f) { return f.proyectoId === p.id; });
    var gs = GASTOS.filter(function (g) { return g.proyectoId === p.id; });
    var facturado = suma(fs, function (f) { return f.importe; });
    var cobrado = suma(fs, function (f) { return f.importeCobrado; });
    var coste = suma(gs, function (g) { return g.importe; });
    p.totalFacturado = Math.round(facturado * 100) / 100;
    p.totalCobrado = Math.round(cobrado * 100) / 100;
    p.totalGastos = Math.round(coste * 100) / 100;
    p.rentabilidad = Math.round((facturado - coste) * 100) / 100;
    p.margen = facturado > 0 ? Math.round(((facturado - coste) / facturado) * 1000) / 10 : null;
    return p;
  });

  // Las frases de arriba del panel. Se escriben solas a partir de las
  // cifras, y solo aparecen las que tienen algo que decir.
  function resumenEjecutivo() {
    var frases = [];
    var mes = EVOLUCION[EVOLUCION.length - 1];
    var caja = Math.round((mes.cobrado - mes.gastos) * 100) / 100;
    var principal;
    if (caja < 0) {
      principal = { nivel: mes.resultado >= 0 ? 'aviso' : 'critico', vista: 'cobros',
        texto: 'So far this month you have spent ' + EUR(Math.abs(caja)) + ' more than you have collected. This is cash: the month’s result ' +
               (mes.resultado >= 0 ? 'is positive (' + EUR(mes.resultado) + '), and the difference is work done that you have not been paid for yet.'
                                   : 'is negative too (' + EUR(mes.resultado) + ').') };
    } else {
      principal = { nivel: 'ok', vista: 'cobros',
        texto: 'This month you have collected ' + EUR(caja) + ' more than you have spent, and the month’s result is ' + EUR(mes.resultado) + '.' };
    }
    if (SNAP.totalPendiente > 0) {
      var mayor = CONCENTRACION.filas[0];
      frases.push({ nivel: SNAP.totalVencido > 0 ? 'serio' : 'aviso', vista: 'cobros',
        texto: 'You are owed ' + EUR(SNAP.totalPendiente) +
               (SNAP.totalVencido > 0 ? ', of which ' + EUR(SNAP.totalVencido) + ' are already past due' : ', and nothing is past due yet') +
               (mayor ? '; ' + EUR(mayorDeudor().total) + ' of it is owed by ' + mayorDeudor().cliente + '.' : '.') });
    }
    var pierden = RENTABILIDAD.filter(function (p) { return p.rentabilidad < 0; });
    if (pierden.length) {
      frases.push({ nivel: 'serio', vista: 'proyectos',
        texto: pierden.length + ' project' + (pierden.length > 1 ? 's losing' : ' loses') + ' money, ' +
               EUR(Math.abs(suma(pierden, function (p) { return p.rentabilidad; }))) + ' between them.' });
    }
    var revisar = GASTOS.filter(function (g) { return g.estadoRevision === 'Pending review'; });
    if (revisar.length) {
      frases.push({ nivel: 'aviso', vista: 'gastos',
        texto: revisar.length + ' expense' + (revisar.length > 1 ? 's waiting' : ' waiting') + ' for someone to review them.' });
    }
    return { principal: principal, frases: frases.slice(0, 3) };
  }
  function mayorDeudor() {
    var por = {};
    emitidas().forEach(function (f) { var p = pendienteDe(f); if (p > 0) por[f.cliente] = (por[f.cliente] || 0) + p; });
    var mejor = null;
    Object.keys(por).forEach(function (k) { if (!mejor || por[k] > mejor.total) mejor = { cliente: k, total: Math.round(por[k] * 100) / 100 }; });
    return mejor || { cliente: '—', total: 0 };
  }

  // Lo que pide una decisión hoy, ordenado por urgencia. P0 a P3, igual que
  // el producto: la prioridad no es un color, es el orden en que hay que
  // mirarlo.
  function senalesHoy() {
    var s = [];
    var muyViejas = emitidas().filter(function (f) { return diasDeRetraso(f) > 60; });
    if (muyViejas.length) s.push({ p: 'P0', titulo: muyViejas.length + ' invoice(s) have gone over 60 days unpaid',
      porque: 'After two months the odds of collecting drop. That is ' + EUR(suma(muyViejas, pendienteDe)) + '.',
      cifra: EUR(suma(muyViejas, pendienteDe)), vista: 'cobros' });
    var vencidas = emitidas().filter(function (f) { var d = diasDeRetraso(f); return d > 0 && d <= 60; });
    if (vencidas.length) s.push({ p: 'P1', titulo: vencidas.length + ' invoice(s) past due',
      porque: 'Chasing within the first month is what makes the difference.',
      cifra: EUR(suma(vencidas, pendienteDe)), vista: 'cobros' });
    var pierden = RENTABILIDAD.filter(function (p) { return p.rentabilidad < 0; });
    if (pierden.length) s.push({ p: 'P1', titulo: pierden.length + ' project(s) cost more than they invoice',
      porque: 'This is not a forecast: it is invoiced minus spent, today.',
      cifra: EUR(suma(pierden, function (p) { return p.rentabilidad; })), vista: 'proyectos' });
    if (CONCENTRACION.riesgo) s.push({ p: 'P2', titulo: 'One client accounts for ' + CONCENTRACION.riesgo.pct + ' % of your invoicing',
      porque: CONCENTRACION.riesgo.cliente + '. If they leave, that share of the business leaves with them.',
      cifra: CONCENTRACION.riesgo.pct + ' %', vista: 'clientes' });
    var revisar = GASTOS.filter(function (g) { return g.estadoRevision === 'Pending review'; });
    if (revisar.length) s.push({ p: 'P2', titulo: revisar.length + ' expense(s) waiting to be reviewed',
      porque: 'Until someone looks at them, they do not count as settled cost.',
      cifra: EUR(suma(revisar, function (g) { return g.importe; })), vista: 'gastos' });
    var borradores = FACTURAS.filter(function (f) { return f.estado === 'Draft'; });
    if (borradores.length) s.push({ p: 'P3', titulo: borradores.length + ' invoice(s) in draft, never sent',
      porque: 'An invoice that is never issued never gets paid.',
      cifra: EUR(suma(borradores, function (f) { return f.importe; })), vista: 'facturas' });
    return s;
  }

  function actividadReciente(n) {
    var ev = [];
    FACTURAS.forEach(function (f) {
      if (!f.fechaEmision) return;
      ev.push({ fecha: f.fechaEmision, tipo: 'Invoice', texto: f.numero + ' · ' + f.cliente,
                importe: f.importe, estado: f.estado, vista: 'facturas', id: f.id });
    });
    GASTOS.forEach(function (g) {
      ev.push({ fecha: g.fechaGasto, tipo: 'Expense', texto: g.proveedor + ' · ' + g.concepto,
                importe: g.importe, estado: g.estadoRevision, vista: 'gastos', id: g.id });
    });
    COBROS.forEach(function (c) {
      var f = byId(FACTURAS, c.facturaId);
      ev.push({ fecha: c.fechaCobro, tipo: 'Payment received', texto: (f ? f.numero + ' · ' + f.cliente : 'Payment received'),
                importe: c.importe, estado: 'Collected', vista: 'cobros', id: c.facturaId });
    });
    return ev.sort(function (a, b) { return a.fecha < b.fecha ? 1 : -1; }).slice(0, n || 8);
  }

  function EUR(v) {
    /* useGrouping 'always', igual que fmtEUR: es-ES no separa los miles de
       los enteros de CUATRO cifras, y media demo lo es. Sin esto salia
       «8079,27 €» en la frase de arriba y «28.442,50 €» en la tabla de
       abajo, que es la misma cifra leida de dos maneras. */
    return (Math.round((v || 0) * 100) / 100)
      .toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' }) + '\u00a0€';
  }

  // ── formato, igual que src/lib/format.ts del producto ───────────────────
  function fmtEUR(value) {
    if (value === null || value === undefined) return 'Not enough data';
    // useGrouping 'always': es-ES no agrupa los enteros de CUATRO cifras, y
    // muchos importes de esta demo lo son. Sin esto se enseñaba «1200,00 €»
    // al lado de «28.442,50 €» en la misma columna.
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', useGrouping: 'always' }).format(value);
  }
  function fmtFecha(value) {
    if (!value) return '—';
    var d = new Date(value);
    if (isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
  }
  function fmtFechaHora(value) {
    if (!value) return '—';
    var d = new Date(value);
    if (isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d);
  }
  function clienteById(id) { return byId(CLIENTES, id); }
  function facturaById(id) { return byId(FACTURAS, id); }
  function derivarCobros() {
    return COBROS.map(function (c) {
      var f = byId(FACTURAS, c.facturaId);
      return { id: c.id, facturaId: c.facturaId, numero: f ? f.numero : '—',
               cliente: f ? f.cliente : '—', fecha: c.fechaCobro, importe: c.importe,
               metodo: c.metodo, referencia: c.referencia };
    }).sort(function (a, b) { return a.fecha < b.fecha ? 1 : -1; });
  }

  var FinanceStore = {
    empresa: { nombre: 'D-Code Finance', tagline: 'Financial dashboard' },

    getDashboardSnapshot: function () { return SNAP; },
    getEvolucion: function () { return EVOLUCION.slice(); },
    getResumenEjecutivo: resumenEjecutivo,
    getSenales: senalesHoy,
    getAntiguedad: function () { return ANTIGUEDAD; },
    getConcentracion: function () { return CONCENTRACION; },
    getPrevision: function () { return PREVISION; },
    getActividad: actividadReciente,
    getRentabilidad: function () { return RENTABILIDAD.slice(); },

    listFacturas: function () { return FACTURAS.slice(); },
    getFactura: function (id) { return facturaById(id); },
    listPresupuestos: function () { return PRESUPUESTOS.slice(); },
    getPresupuesto: function (id) { return byId(PRESUPUESTOS, id); },
    listClientes: function () { return CLIENTES.slice(); },
    getCliente: function (id) { return clienteById(id); },
    listProveedores: function () { return PROVEEDORES.slice(); },
    getProveedor: function (id) { return byId(PROVEEDORES, id); },
    listCobros: function () { return derivarCobros(); },
    listGastos: function () { return GASTOS.slice(); },
    getGasto: function (id) { return byId(GASTOS, id); },
    listProyectos: function () { return RENTABILIDAD.slice(); },
    getProyecto: function (id) { return byId(PROYECTOS, id); },

    pendienteDe: pendienteDe,
    diasDeRetraso: diasDeRetraso,
    // --- Pregunta a Finanzas ---------------------------------------
    // El sistema real responde en abierto: manda la pregunta a su webhook de
    // IA Financiera con los datos de la empresa detrás. Esta demo pública no
    // llama a nada: las seis respuestas se calculan aquí mismo, sobre el
    // dataset ficticio, para que se pueda ver cómo responde sin conectar
    // ninguna cuenta. La forma de la respuesta -- conclusión, datos, qué
    // significa y qué revisar -- es la que da el sistema real.
    askQuestions: function () {
      var self = this;

      function refFactura(f) { return { type: 'facturas', id: f.id, label: f.numero }; }

      return [
        {
          clave: 'deudores',
          pistas: ['owe', 'owes', 'owed', 'debt', 'debtor', 'collect', 'outstanding', 'who owes us'],
          q: 'Who owes us money right now?',
          a: function () {
            var lista = emitidas().filter(function (f) { return pendienteDe(f) > 0; });
            if (!lista.length) return { conclusion: 'There are no outstanding invoices.', datos: [], refs: [] };
            var total = suma(lista, pendienteDe);
            var fuera = lista.filter(function (f) { return diasDeRetraso(f) > 0; });
            var porCliente = {};
            lista.forEach(function (f) {
              var k = f.clienteNombre || 'Unresolved client';
              porCliente[k] = (porCliente[k] || 0) + pendienteDe(f);
            });
            var nombres = Object.keys(porCliente).sort(function (a, b) { return porCliente[b] - porCliente[a]; });
            var mayor = nombres[0];
            var cuota = Math.round((porCliente[mayor] / total) * 100);
            return {
              conclusion: 'You are owed ' + fmtEUR(total) + ' across ' + lista.length + ' invoices. ' + (fuera.length ? fmtEUR(suma(fuera, pendienteDe)) + ' is already past due.' : 'None of it is past due yet.'),
              datos: nombres.map(function (n) {
                var suyas = lista.filter(function (f) { return (f.clienteNombre || 'Unresolved client') === n; });
                var atraso = Math.max.apply(null, suyas.map(diasDeRetraso));
                return { k: n, v: fmtEUR(porCliente[n]), n: (atraso > 0 ? atraso + ' days late' : 'within terms') + (suyas.length > 1 ? ' · ' + suyas.length + ' invoices' : '') };
              }),
              significado: '' + cuota + '% of what you are owed sits with a single client: ' + mayor + '.',
              refs: fuera.map(refFactura)
            };
          }
        },
        {
          clave: 'atrasadas',
          pistas: ['late', 'overdue', 'past due', 'behind', 'unpaid', 'arrears'],
          q: 'Which invoices are furthest behind?',
          a: function () {
            var atrasadas = emitidas().filter(function (f) { return diasDeRetraso(f) > 0 && pendienteDe(f) > 0; })
              .sort(function (a, b) { return diasDeRetraso(b) - diasDeRetraso(a); });
            if (!atrasadas.length) return { conclusion: 'No invoice is past due.', datos: [], refs: [] };
            var peor = atrasadas[0];
            return {
              conclusion: atrasadas.length + ' invoices past due, ' + fmtEUR(suma(atrasadas, pendienteDe)) + ' uncollected. The oldest has been out ' + diasDeRetraso(peor) + ' days.',
              datos: atrasadas.map(function (f) {
                return {
                  k: f.numero + ' · ' + (f.clienteNombre || 'Unresolved client'),
                  v: fmtEUR(pendienteDe(f)),
                  n: diasDeRetraso(f) + ' days · due ' + fmtFecha(f.fechaVencimiento) + ' · ' + (f.recordatoriosEnviados || 0) + ' reminders'
                };
              }),
              significado: peor.observaciones ? 'The oldest one, ' + peor.numero + ', has a note on it: “' + peor.observaciones + '” That is not reflected in the invoice status.' : 'The oldest one, ' + peor.numero + ', has run up ' + (peor.recordatoriosEnviados || 0) + ' reminders sent with nothing to show for them.',
              revisar: ['Decide what happens with ' + peor.numero + ': another reminder has already failed ' + (peor.recordatoriosEnviados || 0) + ' times.'],
              refs: atrasadas.map(refFactura)
            };
          }
        },
        {
          clave: 'gastos',
          pistas: ['expense', 'expenses', 'cost', 'costs', 'growing', 'rising', 'spend', 'supplier'],
          q: 'Which expenses are growing?',
          a: function () {
            var gastos = GASTOS.filter(function (g) { return g.fecha; });
            var meses = {};
            gastos.forEach(function (g) {
              var m = g.fecha.slice(0, 7);
              meses[m] = meses[m] || { total: 0, cat: {} };
              meses[m].total += g.importe;
              var c = g.categoria || 'Uncategorised';
              meses[m].cat[c] = (meses[m].cat[c] || 0) + g.importe;
            });
            var clavesMes = Object.keys(meses).sort();
            var ultimo = clavesMes[clavesMes.length - 1];
            var previo = clavesMes[clavesMes.length - 2];
            if (!previo) {
              return { conclusion: 'There is only one month of expenses on record: nothing to compare against.', datos: [], refs: [] };
            }
            var difTotal = meses[ultimo].total - meses[previo].total;
            var categorias = {};
            Object.keys(meses[ultimo].cat).concat(Object.keys(meses[previo].cat)).forEach(function (c) { categorias[c] = true; });
            var filas = Object.keys(categorias).map(function (c) {
              var ahora = meses[ultimo].cat[c] || 0;
              var antes = meses[previo].cat[c] || 0;
              return { cat: c, ahora: ahora, antes: antes, dif: ahora - antes };
            }).sort(function (a, b) { return b.dif - a.dif; });
            var suben = filas.filter(function (f) { return f.dif > 0; });
            return {
              conclusion: (difTotal > 0 ? 'Spending is up ' + fmtEUR(difTotal) : 'Spending is down ' + fmtEUR(-difTotal)) + ' on the previous month (' + fmtEUR(meses[ultimo].total) + ' against ' + fmtEUR(meses[previo].total) + ').',
              datos: filas.map(function (f) {
                return { k: f.cat, v: f.ahora === 0 ? '\u2014' : fmtEUR(f.ahora), n: (f.antes === 0 ? 'nuevo este mes' : (f.ahora === 0 ? 'no se ha repetido (' + fmtEUR(f.antes) + ' el mes anterior)' : (f.dif >= 0 ? '+' : '') + fmtEUR(f.dif) + ' respecto al mes anterior')) };
              }),
              significado: 'With ' + clavesMes.length + ' months on record there is not enough of a series to talk about a trend. This is what changed, not a forecast' + (suben.length ? ': ' + (suben.length === 1 ? 'the only thing going up is ' : 'what is going up is ') + suben.map(function (x) { return x.cat; }).join(' and ') + '.' : '.'),
              refs: []
            };
          }
        },
        {
          clave: 'hoy',
          pistas: ['review', 'today', 'priority', 'urgent', 'what should i do', 'what do i do', 'waiting on me'],
          q: 'What should I look at today?',
          a: function () {
            var pendientes = [];
            var refs = [];
            emitidas().filter(function (f) { return diasDeRetraso(f) > 0 && pendienteDe(f) > 0; })
              .sort(function (a, b) { return diasDeRetraso(b) - diasDeRetraso(a); })
              .forEach(function (f) { pendientes.push(f.numero + ' (' + f.clienteNombre + '): ' + fmtEUR(pendienteDe(f)) + ' with ' + diasDeRetraso(f) + ' days late.'); refs.push(refFactura(f)); });
            FACTURAS.filter(function (f) { return f.estado === 'Draft'; })
              .forEach(function (f) { pendientes.push(f.numero + ': ' + fmtEUR(f.importe) + ' in draft, never sent. Nobody has been chased for it.'); refs.push(refFactura(f)); });
            var gastosPte = GASTOS.filter(function (g) { return g.estadoRevision === 'Pending review'; });
            if (gastosPte.length) pendientes.push(gastosPte.length + ' expenses waiting for review: ' + gastosPte.map(function (g) { return g.proveedor + ' (' + fmtEUR(g.importe) + ')'; }).join(', ') + '.');
            PROYECTOS.filter(function (p) { return p.estado === 'In progress' && p.fechaEntregaPrevista; })
              .forEach(function (p) {
                var quedan = diasEntre(HOY, p.fechaEntregaPrevista);
                if (quedan !== null && quedan <= 21) pendientes.push(p.nombre + ': delivery due ' + fmtFecha(p.fechaEntregaPrevista) + ', leaving ' + quedan + ' days.');
              });
            return {
              conclusion: pendientes.length ? 'There are ' + pendientes.length + ' things waiting on a decision from you today.' : 'Nothing needs a decision today.',
              revisar: pendientes,
              refs: refs
            };
          }
        },
        {
          clave: 'resumen',
          pistas: ['summary', 'summarise', 'summarize', 'how are we doing', 'situation', 'overall', 'what is going on', 'whats going on'],
          q: 'Give me today’s financial summary.',
          a: function () {
            var s = self.getDashboardSnapshot();
            var margen = s.totalFacturado - s.totalGastos;
            var cobradoPct = s.totalFacturado > 0 ? Math.round((s.totalCobrado / s.totalFacturado) * 100) : 0;
            return {
              conclusion: 'You have invoiced ' + fmtEUR(s.totalFacturado) + ' and collected ' + fmtEUR(s.totalCobrado) + '. That leaves ' + fmtEUR(s.totalPendiente) + ' still to collect, of which ' + fmtEUR(s.totalVencido) + ' is past due.',
              datos: [
                { k: 'Invoiced', v: fmtEUR(s.totalFacturado) },
                { k: 'Collected', v: fmtEUR(s.totalCobrado), n: cobradoPct + '%' },
                { k: 'Outstanding', v: fmtEUR(s.totalPendiente) },
                { k: 'Past due', v: fmtEUR(s.totalVencido) },
                { k: 'Expenses', v: fmtEUR(s.totalGastos) },
                { k: 'Due within 30 days', v: fmtEUR(s.venceEn30) }
              ],
              significado: 'The problem is not the margin (' + fmtEUR(margen) + ' between invoiced and spent): it is that only ' + cobradoPct + '% of what you invoiced has actually come in.',
              revisar: ['The ' + fmtEUR(s.totalVencido) + ' past due, before anything else.'],
              refs: []
            };
          }
        },
        {
          clave: 'proyectos',
          pistas: ['project', 'projects', 'profit', 'profitab', 'margin'],
          q: 'How profitable are the active projects?',
          a: function () {
            var activos = self.listProyectos().filter(function (p) { return p.estado === 'In progress'; });
            if (!activos.length) return { conclusion: 'There are no projects in progress right now.', datos: [], refs: [] };
            var mejor = activos.slice().sort(function (a, b) { return b.rentabilidad - a.rentabilidad; })[0];
            return {
              conclusion: activos.length + ' projects in progress, ' + fmtEUR(suma(activos, function (p) { return p.rentabilidad; })) + ' of estimated profit.',
              datos: activos.map(function (p) {
                return { k: p.nombre + ' · ' + p.empresa, v: fmtEUR(p.rentabilidad), n: fmtEUR(p.totalFacturado) + ' invoiced · ' + fmtEUR(p.totalCobrado) + ' collected · ' + fmtEUR(p.totalGastos) + ' of cost' };
              }),
              significado: 'The one that leaves the most is ' + mejor.nombre + ', and of that ' + (mejor.totalFacturado - mejor.totalCobrado > 0 ? 'there is still ' + fmtEUR(mejor.totalFacturado - mejor.totalCobrado) + ' uncollected.' : 'it has all been collected.'),
              refs: activos.map(function (p) { return { type: 'proyectos', id: p.id, label: p.nombre }; })
            };
          }
        },
        {
          clave: 'deudor',
          pistas: ['client', 'customer', 'who owes the most', 'biggest debt', 'largest debt', 'worst payer'],
          q: 'Which client owes us the most?',
          a: function () {
            var lista = emitidas().filter(function (f) { return pendienteDe(f) > 0; });
            if (!lista.length) return { conclusion: 'No client has outstanding invoices.', datos: [], refs: [] };
            var porCliente = {};
            lista.forEach(function (f) {
              var k = f.clienteNombre || 'Unresolved client';
              porCliente[k] = porCliente[k] || { total: 0, facturas: [] };
              porCliente[k].total += pendienteDe(f);
              porCliente[k].facturas.push(f);
            });
            var nombres = Object.keys(porCliente).sort(function (a, b) { return porCliente[b].total - porCliente[a].total; });
            var top = nombres[0];
            var suyas = porCliente[top].facturas.slice().sort(function (a, b) { return diasDeRetraso(b) - diasDeRetraso(a); });
            var totalTodos = suma(lista, pendienteDe);
            var cuota = Math.round((porCliente[top].total / totalTodos) * 100);
            var ficha = self.listClientes().filter(function (c) { return c.empresa === top; })[0];
            return {
              conclusion: top + ' owes the most: ' + fmtEUR(porCliente[top].total) + ' across ' + suyas.length + ' invoice(s), ' + cuota + '% of everything outstanding.',
              datos: suyas.map(function (f) {
                return { k: f.numero, v: fmtEUR(pendienteDe(f)), n: (diasDeRetraso(f) > 0 ? diasDeRetraso(f) + ' days late' : 'due ' + fmtFecha(f.fechaVencimiento)) + (f.importeCobrado ? ' · already paid ' + fmtEUR(f.importeCobrado) : '') };
              }),
              significado: (ficha && ficha.cuotaMensual ? 'They are also on a monthly fee of ' + fmtEUR(ficha.cuotaMensual) + ', so the debt keeps growing every month it goes uncollected.' : 'Having the debt sit with one client is the risk, not the amount.'),
              refs: (ficha ? [{ type: 'clientes', id: ficha.id, label: top }] : []).concat(suyas.map(refFactura))
            };
          }
        },
        {
          clave: 'caja',
          pistas: ['cash', 'treasury', 'liquidity', 'balance', 'how much money', 'runway'],
          q: 'How is our cash position?',
          a: function () {
            var lista = emitidas();
            var cobrado = suma(lista, function (f) { return f.importeCobrado; });
            var gastado = suma(GASTOS, function (g) { return g.importe; });
            var porEntrar = suma(lista.filter(function (f) { return pendienteDe(f) > 0; }), pendienteDe);
            var s = self.getDashboardSnapshot();
            return {
              conclusion: 'This demo is not connected to your bank, so there is no bank balance: what there is, is the recorded movement. In came ' + fmtEUR(cobrado) + ' and out went ' + fmtEUR(gastado) + '.',
              datos: [
                { k: 'Collected', v: fmtEUR(cobrado) },
                { k: 'Expenses recorded', v: fmtEUR(gastado) },
                { k: 'Difference', v: fmtEUR(cobrado - gastado) },
                { k: 'Coming in', v: fmtEUR(porEntrar), n: fmtEUR(s.venceEn30) + ' falls due within 30 days' }
              ],
              significado: 'The difference between what came in and what went out is not your bank balance: it leaves out payroll, taxes and whatever was already in the account. To cross expected collections and payments there is Cash, right next to this in the menu.',
              revisar: ['What is still to come in (' + fmtEUR(porEntrar) + ') is more than double everything collected so far. That is where the money is.'],
              refs: []
            };
          }
        }
      ];
    },

    // Busca la pregunta preparada que más se parece a lo que se ha escrito.
    // No es comprensión de lenguaje: son palabras clave. Cuando no encuentra
    // ninguna lo dice, en vez de inventarse una respuesta.
    matchQuestion: function (texto) {
      var t = (texto || '').toLowerCase();
      var preguntas = this.askQuestions();
      var mejor = null, mejorPuntos = 0;
      preguntas.forEach(function (p) {
        var puntos = 0;
        p.pistas.forEach(function (pista) { if (t.indexOf(pista) !== -1) puntos++; });
        if (puntos > mejorPuntos) { mejorPuntos = puntos; mejor = p; }
      });
      return mejorPuntos > 0 ? mejor : null;
    },

    hoy: HOY

  };

  global.FinanceStore = FinanceStore;
  global.FinanceFmt = { eur: fmtEUR, fecha: fmtFecha, fechaHora: fmtFechaHora };

})(window);
