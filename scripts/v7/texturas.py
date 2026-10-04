"""EL BANCO DE TRABAJO · lo que se ve en cada pantalla y en la factura.
Son los mismos datos de ejemplo (inventados) que usa la demo de Finance de la web: Suministros Arce, S.L., factura F-2026/0412, 1.500,40 €.
Cada pantalla tiene dos estados: «antes» (cada herramienta por su cuenta) y «después» (conectadas: el mismo dato en todas)."""
import os
from PIL import Image, ImageDraw, ImageFont
AQUI = os.path.dirname(os.path.abspath(__file__)); TEX = os.path.join(AQUI, "tex")
def F(px, peso=400):
    f = ImageFont.truetype(os.path.join(TEX, "Inter.ttf"), px)
    try: f.set_variation_by_axes([14 if px < 40 else 28, peso] if len(f.get_variation_axes()) == 2 else [peso])
    except Exception: pass
    return f
AZUL = (28, 76, 240); TINTA = (17, 18, 20); GRIS = (120, 123, 130); LINEA = (226, 228, 232); FONDO = (247, 247, 248); VERDE = (24, 128, 78)
def caja(d, xy, r, **k): d.rounded_rectangle(xy, r, **k)

def factura(en=False):
    W, H = 1240, 1754; im = Image.new("RGB", (W, H), (252, 252, 250)); d = ImageDraw.Draw(im)
    d.text((110, 120), "Suministros Arce, S.L.", font=F(46, 700), fill=TINTA); d.text((110, 184), "Polígono Los Olivos, nave 14 · Getafe" if not en else "Los Olivos estate, unit 14 · Getafe", font=F(24), fill=GRIS)
    d.text((W - 110, 110), "FACTURA" if not en else "INVOICE", font=F(30, 600), fill=GRIS, anchor="ra"); d.text((W - 110, 152), "F-2026/0412", font=F(44, 700), fill=TINTA, anchor="ra"); d.text((W - 110, 212), "28/09/2026", font=F(26), fill=GRIS, anchor="ra")
    d.line((110, 300, W - 110, 300), fill=TINTA, width=3)
    d.text((110, 340), "Cliente" if not en else "Client", font=F(22, 600), fill=GRIS); d.text((110, 374), "Taller Brío, S.L.", font=F(30, 600), fill=TINTA)
    y = 520; d.text((110, y), "Concepto" if not en else "Item", font=F(22, 600), fill=GRIS); d.text((W - 110, y), "Importe" if not en else "Amount", font=F(22, 600), fill=GRIS, anchor="ra"); y += 44; d.line((110, y, W - 110, y), fill=LINEA, width=2)
    for c, v in [("Pastillas de freno (8 juegos)" if not en else "Brake pads (8 sets)", "212,04"), ("Aceite 5W-30 (60 L)" if not en else "5W-30 oil (60 L)", "486,45"), ("Filtros de aceite y de aire" if not en else "Oil and air filters", "318,06"), ("Líquido refrigerante" if not en else "Coolant", "223,45")]:
        y += 34; d.text((110, y), c, font=F(28), fill=TINTA); d.text((W - 110, y), v + " €", font=F(28), fill=TINTA, anchor="ra"); y += 56; d.line((110, y, W - 110, y), fill=LINEA, width=2)
    y += 70
    for c, v, p in [("Base imponible" if not en else "Net amount", "1.240,00 €", 400), ("IVA 21 %" if not en else "VAT 21%", "260,40 €", 400)]:
        d.text((W - 540, y), c, font=F(28), fill=GRIS); d.text((W - 110, y), v, font=F(28, p), fill=TINTA, anchor="ra"); y += 54
    d.line((W - 540, y + 6, W - 110, y + 6), fill=TINTA, width=3); y += 30
    d.text((W - 540, y), "Total", font=F(36, 700), fill=TINTA); d.text((W - 110, y), "1.500,40 €", font=F(40, 700), fill=TINTA, anchor="ra")
    d.text((110, H - 230), "Vencimiento" if not en else "Due date", font=F(22, 600), fill=GRIS); d.text((110, H - 196), "28/10/2026", font=F(32, 600), fill=TINTA)
    d.text((110, H - 110), "Documento de ejemplo con datos inventados." if not en else "Sample document with invented data.", font=F(20), fill=(170, 172, 178))
    return im

def movil(despues, en=False):
    W, H = 780, 1688; im = Image.new("RGB", (W, H), (10, 11, 14)); d = ImageDraw.Draw(im)
    d.text((W // 2, 150), "9:10", font=F(170, 300), fill=(245, 245, 247), anchor="ma"); d.text((W // 2, 350), "martes, 29 de septiembre" if not en else "Tuesday, 29 September", font=F(34), fill=(190, 192, 198), anchor="ma")
    def aviso(y, app, titulo, texto, hace, color=(60, 62, 68)):
        caja(d, (40, y, W - 40, y + 190), 44, fill=(36, 37, 42)); caja(d, (72, y + 34, 72 + 60, y + 94), 16, fill=color)
        d.text((152, y + 30), app, font=F(24, 600), fill=(160, 163, 170)); d.text((W - 76, y + 30), hace, font=F(24), fill=(130, 133, 140), anchor="ra")
        d.text((152, y + 70), titulo, font=F(32, 600), fill=(245, 245, 247)); d.text((152, y + 118), texto, font=F(28), fill=(200, 202, 208))
    if not despues:
        aviso(520, "MENSAJES" if not en else "MESSAGES", "Suministros Arce", "¿Os ha llegado la factura?" if not en else "Did you get the invoice?", "8:52", (46, 160, 90))
        aviso(730, "CORREO" if not en else "MAIL", "Marta (administración)" if not en else "Marta (admin)", "¿Quién la registra hoy?" if not en else "Who records it today?", "8:40", (70, 110, 220))
        aviso(940, "MENSAJES" if not en else "MESSAGES", "Dirección" if not en else "Management", "¿Cuánto pagamos este mes?" if not en else "How much do we pay this month?", "8:15", (46, 160, 90))
        d.text((W // 2, 1190), "3 sin responder" if not en else "3 unanswered", font=F(28), fill=(150, 153, 160), anchor="ma")
    else:
        aviso(520, "D-CODE FINANCE", "Factura registrada" if not en else "Invoice recorded", "F-2026/0412 · 1.500,40 €", "ahora" if not en else "now", AZUL)
        aviso(730, "D-CODE FINANCE", "Pago programado" if not en else "Payment scheduled", "28/10/2026 · Suministros Arce", "ahora" if not en else "now", AZUL)
        aviso(940, "D-CODE FINANCE", "Aviso a dirección enviado" if not en else "Management notified", "Nadie lo ha tecleado." if not en else "Nobody typed it in.", "ahora" if not en else "now", AZUL)
    caja(d, (W // 2 - 130, H - 44, W // 2 + 130, H - 32), 6, fill=(200, 200, 205))
    return im

def tableta(despues, en=False):
    W, H = 1640, 1180; im = Image.new("RGB", (W, H), FONDO); d = ImageDraw.Draw(im)
    d.text((90, 80), "Tareas de hoy" if not en else "Today's tasks", font=F(54, 700), fill=TINTA); d.text((W - 90, 96), "martes 29" if not en else "Tue 29", font=F(30), fill=GRIS, anchor="ra")
    cols = [("Pendiente" if not en else "To do", 90), ("Hecho" if not en else "Done", W // 2 + 30)]
    for t, x in cols: d.text((x, 220), t.upper(), font=F(26, 600), fill=GRIS); d.line((x, 268, x + W // 2 - 120, 268), fill=LINEA, width=3)
    tareas = ["Registrar la factura de Arce", "Programar el pago", "Avisar a dirección"] if not en else ["Record the Arce invoice", "Schedule the payment", "Notify management"]
    for i, t in enumerate(tareas):
        x = cols[1][1] if despues else cols[0][1]; y = 310 + i * 190
        caja(d, (x, y, x + W // 2 - 120, y + 150), 26, fill=(255, 255, 255), outline=LINEA, width=3)
        if despues: d.ellipse((x + 34, y + 49, x + 86, y + 101), fill=AZUL); d.line((x + 48, y + 76, x + 58, y + 87, x + 74, y + 64), fill=(255, 255, 255), width=6)
        else: d.ellipse((x + 34, y + 49, x + 86, y + 101), outline=(190, 193, 200), width=5)
        d.text((x + 116, y + 34), t, font=F(34, 600), fill=TINTA); d.text((x + 116, y + 86), ("automático · 9:10" if not en else "automatic · 9:10") if despues else ("sin asignar" if not en else "unassigned"), font=F(26), fill=AZUL if despues else GRIS)
    return im

def portatil(estado, en=False):
    """estado: 'antes' (una hoja de cálculo a mano) · 'despues' (el registro de Finance) · 'vacio' (la ventana de Finance sin datos: encima va el HTML de la web)"""
    W, H = 2560, 1600; im = Image.new("RGB", (W, H), (255, 255, 255)); d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 92), fill=(238, 239, 242)); 
    for i, c in enumerate([(236, 106, 94), (244, 191, 79), (98, 197, 84)]): d.ellipse((40 + i * 50, 30, 72 + i * 50, 62), fill=c)
    if estado == "antes":
        d.text((W // 2, 46), "facturas_2026_v3_buena.xlsx", font=F(30, 500), fill=(90, 92, 98), anchor="mm")
        cab = ["Proveedor", "Número", "Fecha", "Base", "IVA", "Total", "Vence", "¿Pagada?"] if not en else ["Supplier", "Number", "Date", "Net", "VAT", "Total", "Due", "Paid?"]
        xs = [60, 620, 960, 1260, 1520, 1780, 2060, 2320]; y = 150
        d.rectangle((0, y - 14, W, y + 62), fill=(246, 247, 249))
        for x, t in zip(xs, cab): d.text((x, y), t, font=F(32, 600), fill=(70, 72, 78))
        filas = [("Talleres del Sur", "A-118", "02/09", "640,00", "134,40", "774,40", "02/10", "sí"), ("Recambios Vega", "2026-771", "09/09", "1.120,00", "235,20", "1.355,20", "09/10", "?"), ("Gestoría Lema", "F/332", "15/09", "180,00", "37,80", "217,80", "15/10", "sí"), ("Aceites Iberia", "000912", "21/09", "905,50", "190,16", "1.095,66", "21/10", ""), ("Suministros Arce", "F-2026/041", "", "", "", "", "", "")]
        for j, f in enumerate(filas):
            y = 250 + j * 96; d.line((0, y - 22, W, y - 22), fill=LINEA, width=2)
            for x, t in zip(xs, f): d.text((x, y), t, font=F(34), fill=TINTA)
        y = 250 + 4 * 96; d.rectangle((xs[1] - 14, y - 16, xs[2] - 30, y + 62), outline=AZUL, width=5); d.line((xs[1] + 196, y - 4, xs[1] + 196, y + 50), fill=TINTA, width=4)   # alguien está tecleando el número
        for j in range(5, 12): d.line((0, 250 + j * 96 - 22, W, 250 + j * 96 - 22), fill=LINEA, width=2)
        for x in xs[1:]: d.line((x - 30, 136, x - 30, H), fill=LINEA, width=2)
    else:
        d.text((W // 2, 46), "D-Code Finance", font=F(30, 600), fill=(60, 62, 68), anchor="mm")
        d.rectangle((0, 92, 520, H), fill=(248, 248, 250)); d.rectangle((60, 170, 84, 194), fill=AZUL); d.text((104, 160), "Finance", font=F(40, 700), fill=TINTA)
        for i, t in enumerate(["Facturas", "Pagos", "Cobros", "Tesorería"] if not en else ["Invoices", "Payments", "Collections", "Cash flow"]):
            y = 300 + i * 96
            if i == 0: caja(d, (40, y - 20, 480, y + 62), 18, fill=(232, 236, 250))
            d.text((80, y), t, font=F(34, 600 if i == 0 else 400), fill=AZUL if i == 0 else (90, 92, 98))
        d.text((620, 170), "Registro de la factura" if not en else "Invoice record", font=F(56, 700), fill=TINTA)
        if estado == "despues":
            campos = [("Proveedor", "Suministros Arce, S.L."), ("Número", "F-2026/0412"), ("Fecha", "28/09/2026"), ("Base imponible", "1.240,00 €"), ("IVA 21 %", "260,40 €"), ("Total", "1.500,40 €"), ("Vencimiento", "28/10/2026")] if not en else [("Supplier", "Suministros Arce, S.L."), ("Number", "F-2026/0412"), ("Date", "28/09/2026"), ("Net amount", "€1,240.00"), ("VAT 21%", "€260.40"), ("Total", "€1,500.40"), ("Due date", "28/10/2026")]
            for i, (k, v) in enumerate(campos):
                y = 310 + i * 112; d.line((620, y - 26, W - 120, y - 26), fill=LINEA, width=2); d.text((620, y), k, font=F(34), fill=GRIS); d.text((W - 120, y), v, font=F(40 if k == "Total" else 36, 700 if k == "Total" else 500), fill=TINTA, anchor="ra")
            y = 310 + 7 * 112 + 10; caja(d, (620, y, W - 120, y + 190), 26, fill=(238, 242, 253))
            d.rectangle((666, y + 50, 690, y + 74), fill=AZUL); d.text((720, y + 36), "Factura registrada. Nadie la ha tecleado." if not en else "Invoice recorded. Nobody typed it in.", font=F(36, 600), fill=TINTA)
            d.rectangle((666, y + 118, 690, y + 142), fill=AZUL); d.text((720, y + 104), "Pago programado para el 28/10/2026 y aviso enviado a dirección." if not en else "Payment scheduled for 28/10/2026 and management notified.", font=F(36), fill=(60, 62, 68))
    return im

def todo():
    os.makedirs(TEX, exist_ok=True)
    factura().save(os.path.join(TEX, "factura.png"))
    for nombre, f in [("movil", movil), ("tableta", tableta)]:
        f(False).save(os.path.join(TEX, nombre + "-antes.png")); f(True).save(os.path.join(TEX, nombre + "-despues.png"))
    for e in ("antes", "despues", "vacio"): portatil(e).save(os.path.join(TEX, "portatil-" + e + ".png"))
if __name__ == "__main__": todo(); print("texturas listas")
