"""D-CODE · «EL BANCO DE TRABAJO» · la escena (Blender / Cycles)
----------------------------------------------------------------------------
Lo que una empresa pequeña usa cada día, fotografiado como un producto: un
teléfono (las personas), una tableta con las tareas (los procesos), una factura
(los datos) y un portátil (las herramientas). Al principio cada cosa va por su
lado, con su pantalla y su pendiente. D-Code es la base: una pieza de aluminio
con un sitio para cada una. Cuando encajan, se enciende la línea azul y el
mismo dato aparece en todas a la vez.
Todo se modela aquí por código y se pinta con trazado de rayos; la web recorre
las imágenes con el scroll.

Uso:  python3 escena.py --c 2 --salida foto.png [--res 1600x900] [--spp 96] [--vertical] [--datos datos.json]
      python3 escena.py --serie 1:2:16 --carpeta dir   (16 pasos del capítulo 1 al 2)
"""
import bpy, bmesh, math, os, sys, json
from mathutils import Vector, Euler

AQUI = os.path.dirname(os.path.abspath(__file__)); TEX = os.path.join(AQUI, "tex")
rad = math.radians
def suave(a, b, x):
    t = max(0.0, min(1.0, (x - a) / (b - a))); return t * t * (3 - 2 * t)
def mezcla(a, b, t): return a + (b - a) * t

# ------------------------------------------------------------------ medidas (metros)
BASE = dict(w=0.98, d=0.35, h=0.03)
MOVIL = dict(w=0.0716, h=0.1466, g=0.0078, x=-0.405, y=-0.03, inclin=16)
TABLETA = dict(w=0.2476, h=0.1785, g=0.0061, x=-0.215, y=0.02, inclin=21)
PORTATIL = dict(w=0.3041, d=0.2124, x=0.095, y=0.005)
FACTURA = dict(w=0.21, h=0.297, x=0.365, y=0.06, inclin=11)
ROTULOS = ["PERSONAS", "PROCESOS", "HERRAMIENTAS", "DATOS"]

# ------------------------------------------------------------------ utilidades
def limpiar():
    bpy.ops.wm.read_factory_settings(use_empty=True)
def enlazar(ob, col=None):
    (col or bpy.context.scene.collection).objects.link(ob); return ob
def material(nombre, color=(0.8, 0.8, 0.8), metal=0.0, rug=0.5, **mas):
    m = bpy.data.materials.new(nombre); m.use_nodes = True; p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (*color, 1); p.inputs["Metallic"].default_value = metal; p.inputs["Roughness"].default_value = rug
    for k, v in mas.items(): p.inputs[k].default_value = v
    return m
def aplicar(ob, alisar=28):
    """Convierte los modificadores en malla y deja las aristas vivas donde toca."""
    dg = bpy.context.evaluated_depsgraph_get(); me = bpy.data.meshes.new_from_object(ob.evaluated_get(dg)); ob.modifiers.clear(); viejo = ob.data; ob.data = me
    for p in me.polygons: p.use_smooth = True
    me.set_sharp_from_angle(angle=rad(alisar)); return ob
def prisma(nombre, w, d, h, r=0.0, filete=0.0, mat=None, seg=14, uv=False):
    """Un bloque de planta rectangular con las esquinas redondeadas (r) y los cantos matados (filete). Origen: centro de la cara de abajo."""
    me = bpy.data.meshes.new(nombre); bm = bmesh.new()
    vs = [bm.verts.new((x * w / 2, y * d / 2, 0)) for x, y in [(-1, -1), (1, -1), (1, 1), (-1, 1)]]; bm.faces.new(vs)
    if r > 0: bmesh.ops.bevel(bm, geom=vs, offset=r, segments=seg, affect='VERTICES', profile=0.5)
    if h > 0:
        res = bmesh.ops.extrude_face_region(bm, geom=bm.faces[:]); bmesh.ops.translate(bm, verts=[v for v in res["geom"] if isinstance(v, bmesh.types.BMVert)], vec=(0, 0, h))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    if uv:
        capa = bm.loops.layers.uv.new("uv")
        for f in bm.faces:
            for l in f.loops: l[capa].uv = (l.vert.co.x / w + 0.5, l.vert.co.y / d + 0.5)
    bm.to_mesh(me); bm.free(); ob = enlazar(bpy.data.objects.new(nombre, me))
    if filete > 0:
        b = ob.modifiers.new("canto", "BEVEL"); b.width = filete; b.segments = 4; b.limit_method = "ANGLE"; b.angle_limit = rad(40)
    aplicar(ob)
    if mat: ob.data.materials.append(mat)
    return ob
def vacio(nombre, padre=None):
    e = enlazar(bpy.data.objects.new(nombre, None)); e.empty_display_size = 0.02
    if padre: e.parent = padre
    return e
def imagen(nombre):
    return bpy.data.images.load(os.path.join(TEX, nombre), check_existing=True)

def mat_pantalla(nombre, antes, despues, fuerza=1.0):
    """Una pantalla encendida: mezcla entre dos imágenes (antes/después de conectar) bajo un cristal."""
    m = bpy.data.materials.new(nombre); m.use_nodes = True; nt = m.node_tree; p = nt.nodes["Principled BSDF"]
    a = nt.nodes.new("ShaderNodeTexImage"); a.image = imagen(antes); b = nt.nodes.new("ShaderNodeTexImage"); b.image = imagen(despues)
    mix = nt.nodes.new("ShaderNodeMix"); mix.data_type = "RGBA"; mix.name = "mezcla"; mix.inputs[0].default_value = 0
    nt.links.new(a.outputs["Color"], mix.inputs[6]); nt.links.new(b.outputs["Color"], mix.inputs[7])
    ga = nt.nodes.new("ShaderNodeGamma"); ga.inputs[1].default_value = LUCES["gamma"]; nt.links.new(mix.outputs[2], ga.inputs[0])
    nt.links.new(ga.outputs[0], p.inputs["Emission Color"]); p.inputs["Emission Strength"].default_value = fuerza * LUCES["pantalla"]
    p.inputs["Base Color"].default_value = (0.0, 0.0, 0.0, 1); p.inputs["Roughness"].default_value = 0.06; p.inputs["Coat Weight"].default_value = 1.0; p.inputs["Coat Roughness"].default_value = 0.02
    return m

# ------------------------------------------------------------------ la escena
def construir(idioma="es"):
    limpiar(); S = bpy.context.scene; E = {}
    # --- materiales
    alu = material("aluminio", (0.006, 0.042, 0.56), 1.0, 0.30, **{"Anisotropic": 0.6, "Anisotropic Rotation": 0.0, "Specular Tint": (0.17, 0.36, 1.0, 1.0)})
    alu_c = material("aluminio claro", (0.74, 0.75, 0.77), 1.0, 0.27, **{"Anisotropic": 0.35})
    grafito = material("grafito", (0.035, 0.037, 0.042), 0.85, 0.32)
    negro = material("vidrio negro", (0.005, 0.005, 0.006), 0.0, 0.06, **{"Coat Weight": 1.0})
    tecla = material("tecla", (0.012, 0.012, 0.014), 0.0, 0.5)
    tinta = material("grabado", (0.9, 0.91, 0.93), 0.0, 0.45)
    plato = material("plato", (0.74, 0.735, 0.725), 0.0, 0.42, **{"Specular IOR Level": 0.5})
    led = bpy.data.materials.new("linea azul"); led.use_nodes = True; pl = led.node_tree.nodes["Principled BSDF"]
    pl.inputs["Base Color"].default_value = (0.02, 0.03, 0.08, 1); pl.inputs["Roughness"].default_value = 0.2; pl.inputs["Emission Color"].default_value = (0.35, 0.55, 1.0, 1); pl.inputs["Emission Strength"].default_value = 0.0
    E["led"] = pl
    # el aluminio cepillado: vetas finas que cambian la rugosidad
    { }
    nt = alu.node_tree; p = nt.nodes["Principled BSDF"]; co = nt.nodes.new("ShaderNodeTexCoord"); mp = nt.nodes.new("ShaderNodeMapping"); mp.inputs["Scale"].default_value = (2.0, 900.0, 900.0)
    ru = nt.nodes.new("ShaderNodeTexNoise"); ru.inputs["Scale"].default_value = 1.0; ru.inputs["Detail"].default_value = 6
    rm = nt.nodes.new("ShaderNodeMapRange"); rm.inputs[3].default_value = 0.24; rm.inputs[4].default_value = 0.44
    nt.links.new(co.outputs["Object"], mp.inputs["Vector"]); nt.links.new(mp.outputs["Vector"], ru.inputs["Vector"]); nt.links.new(ru.outputs["Fac"], rm.inputs[0]); nt.links.new(rm.outputs[0], p.inputs["Roughness"])
    bu = nt.nodes.new("ShaderNodeBump"); bu.inputs["Strength"].default_value = 0.035; nt.links.new(ru.outputs["Fac"], bu.inputs["Height"]); nt.links.new(bu.outputs["Normal"], p.inputs["Normal"])

    # --- el plató: suelo y fondo en una sola curva, sin horizonte
    me = bpy.data.meshes.new("ciclorama"); bm = bmesh.new(); N = 40; R = 3.0; Y1 = 5.0; perfil = [(-9.0, 0.0), (Y1 - R, 0.0)] + [(Y1 - R + math.sin(rad(90 * i / N)) * R, R - math.cos(rad(90 * i / N)) * R) for i in range(1, N + 1)] + [(Y1, 9.0)]
    filas = [[bm.verts.new((x, y, z)) for (y, z) in perfil] for x in (-12.0, 12.0)]
    for i in range(len(perfil) - 1): bm.faces.new((filas[0][i], filas[1][i], filas[1][i + 1], filas[0][i + 1]))
    bm.to_mesh(me); bm.free(); cic = enlazar(bpy.data.objects.new("ciclorama", me)); cic.data.materials.append(plato)
    for pp in me.polygons: pp.use_smooth = True

    # --- la base: una pieza de aluminio con un sitio para cada cosa
    base = prisma("base", BASE["w"], BASE["d"], BASE["h"], r=0.022, mat=None)
    def corte(nombre, w, d, h, x, y, z, rx=0.0, r=0.0):
        c = prisma(nombre, w, d, h, r=r); c.location = (x, y, z); c.rotation_euler = (rad(rx), 0, 0); m = base.modifiers.new(nombre, "BOOLEAN"); m.object = c; m.operation = "DIFFERENCE"; m.solver = "EXACT"; return c
    H = BASE["h"]; cortes = [
        corte("c movil", MOVIL["w"] + 0.0016, MOVIL["g"] + 0.0012, 0.05, MOVIL["x"], MOVIL["y"], H - 0.013, -MOVIL["inclin"], 0.003),
        corte("c tableta", TABLETA["w"] + 0.0016, TABLETA["g"] + 0.0012, 0.05, TABLETA["x"], TABLETA["y"], H - 0.013, -TABLETA["inclin"], 0.003),
        corte("c portatil", PORTATIL["w"] + 0.002, PORTATIL["d"] + 0.002, 0.02, PORTATIL["x"], PORTATIL["y"], H - 0.003, 0, 0.012),
        corte("c factura", FACTURA["w"] + 0.003, 0.0026, 0.05, FACTURA["x"], FACTURA["y"], H - 0.012, -FACTURA["inclin"], 0.0),
        corte("c linea", BASE["w"] - 0.09, 0.0032, 0.02, 0, -BASE["d"] / 2 + 0.019, H - 0.0016, 0, 0.0),
    ]
    YR = -BASE["d"] / 2 + 0.049; CAN = {"movil": (MOVIL["x"], MOVIL["y"] - 0.014), "tableta": (TABLETA["x"], TABLETA["y"] - 0.016), "portatil": (PORTATIL["x"], PORTATIL["y"] - PORTATIL["d"] / 2 - 0.004), "factura": (FACTURA["x"], FACTURA["y"] - 0.012)}
    for a_, (x_, y_) in CAN.items(): cortes.append(corte("c canal " + a_, 0.0024, y_ - YR, 0.02, x_, (y_ + YR) / 2, H - 0.0014))
    bpy.context.view_layer.update(); aplicar(base)
    for c in cortes: bpy.data.objects.remove(c)
    b = base.modifiers.new("canto", "BEVEL"); b.width = 0.0016; b.segments = 3; b.limit_method = "ANGLE"; b.angle_limit = rad(40); aplicar(base); wn = base.modifiers.new("normales", "WEIGHTED_NORMAL"); wn.keep_sharp = True; wn.weight = 100; me_b = bpy.data.meshes.new_from_object(base.evaluated_get(bpy.context.evaluated_depsgraph_get())); base.modifiers.clear(); base.data = me_b; base.data.materials.append(alu)
    E["base"] = base
    linea = prisma("linea azul", BASE["w"] - 0.092, 0.0026, 0.0012, mat=led); linea.location = (0, -BASE["d"] / 2 + 0.019, H - 0.0016)
    for a_, (x_, y_) in CAN.items():
        mc = bpy.data.materials.new("canal " + a_); mc.use_nodes = True; pc = mc.node_tree.nodes["Principled BSDF"]; pc.inputs["Base Color"].default_value = (0.02, 0.03, 0.08, 1); pc.inputs["Roughness"].default_value = 0.2; pc.inputs["Emission Color"].default_value = (0.35, 0.55, 1.0, 1); pc.inputs["Emission Strength"].default_value = 0.0
        cn = prisma("canal " + a_, 0.0018, y_ - YR - 0.0006, 0.001, mat=mc); cn.location = (x_, (y_ + YR) / 2, H - 0.0014); E["canal_" + a_] = pc
    # los nombres, grabados delante de cada sitio
    fuente = bpy.data.fonts.load(os.path.join(TEX, "Inter.ttf"))
    nombres = ROTULOS if idioma == "es" else ["PEOPLE", "PROCESSES", "TOOLS", "DATA"]
    for t, x in zip(nombres, [MOVIL["x"], TABLETA["x"], PORTATIL["x"], FACTURA["x"]]):
        cu = bpy.data.curves.new("r " + t, "FONT"); cu.body = t; cu.font = fuente; cu.size = 0.0105; cu.space_character = 1.45; cu.align_x = "CENTER"; o = enlazar(bpy.data.objects.new("r " + t, cu)); bpy.context.view_layer.update()
        me = bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get())); bpy.data.objects.remove(o); o = enlazar(bpy.data.objects.new("rotulo " + t, me)); o.location = (x, -BASE["d"] / 2 + 0.036, H + 0.00012); o.data.materials.append(tinta)
    # la chapa del nombre, a la derecha: ahí va el de tu empresa (lo pone la web encima)
    chapa = prisma("chapa", 0.36, 0.0205, 0.0006, r=0.002, mat=alu_c, uv=True); chapa.rotation_euler = (rad(90), 0, 0); chapa.location = (-0.255, -BASE["d"] / 2 - 0.0001, H / 2 - 0.0002); E["chapa"] = chapa

    # --- un aparato con pantalla (teléfono, tableta): raíz en el centro del canto de abajo
    def aparato(nombre, w, h, g, r, tex, bisel=0.0032, fuerza=1.0):
        raiz = vacio(nombre)
        cuerpo = prisma(nombre + " cuerpo", w, h, g, r=r, filete=0.0016, mat=grafito); cuerpo.parent = raiz; cuerpo.location = (0, 0, h / 2); cuerpo.rotation_euler = (rad(90), 0, 0); cuerpo.location.y = g / 2
        marco = prisma(nombre + " cristal", w - 0.0016, h - 0.0016, 0.0003, r=r - 0.0008, mat=negro); marco.parent = raiz; marco.rotation_euler = (rad(90), 0, 0); marco.location = (0, -g / 2 + 0.0001, h / 2)
        mp_ = mat_pantalla(nombre + " pantalla", tex + "-antes.png", tex + "-despues.png", fuerza)
        pan = prisma(nombre + " pantalla", w - bisel * 2, h - bisel * 2, 0, r=max(0.001, r - bisel), mat=mp_, uv=True); pan.parent = raiz; pan.rotation_euler = (rad(90), 0, 0); pan.location = (0, -g / 2 - 0.00025, h / 2)
        return raiz, mp_
    E["movil"], E["m_movil"] = aparato("movil", MOVIL["w"], MOVIL["h"], MOVIL["g"], 0.0105, "movil", 0.0028, 1.0)
    E["tableta"], E["m_tableta"] = aparato("tableta", TABLETA["w"], TABLETA["h"], TABLETA["g"], 0.011, "tableta", 0.0075, 0.85)

    # --- el portátil: raíz en el centro de la cara de abajo; la tapa gira sobre el canto de atrás
    pw, pd = PORTATIL["w"], PORTATIL["d"]; raiz = vacio("portatil"); E["portatil"] = raiz
    cu = prisma("portatil base", pw, pd, 0.0098, r=0.011, filete=0.002)
    pozo = prisma("c teclas", 0.274, 0.106, 0.01, r=0.004); pozo.location = (0, 0.036, 0.0098 - 0.0011); m = cu.modifiers.new("pozo", "BOOLEAN"); m.object = pozo; m.operation = "DIFFERENCE"; m.solver = "EXACT"
    pad = prisma("c pad", 0.124, 0.076, 0.01, r=0.004); pad.location = (0, -0.062, 0.0098 - 0.0003); m2 = cu.modifiers.new("pad", "BOOLEAN"); m2.object = pad; m2.operation = "DIFFERENCE"; m2.solver = "EXACT"
    bpy.context.view_layer.update(); aplicar(cu); bpy.data.objects.remove(pozo); bpy.data.objects.remove(pad); cu.data.materials.append(alu_c); cu.parent = raiz
    pp = prisma("portatil pad", 0.1236, 0.0756, 0.0002, r=0.0038, mat=material("pad", (0.80, 0.81, 0.83), 1.0, 0.16)); pp.parent = raiz; pp.location = (0, -0.062, 0.0098 - 0.0003)
    fondo_t = prisma("portatil pozo", 0.2736, 0.1056, 0.0002, r=0.0038, mat=tecla); fondo_t.parent = raiz; fondo_t.location = (0, 0.036, 0.0098 - 0.0011)
    # las teclas, en una sola malla
    me = bpy.data.meshes.new("teclas"); bm = bmesh.new(); filas_t = [14, 14, 13, 12, 9]
    for j, n in enumerate(filas_t):
        y = 0.036 + 0.042 - j * 0.0195; ancho_fila = 0.268; paso = ancho_fila / n if j < 4 else None
        xs = [(-ancho_fila / 2 + paso * (i + 0.5), paso - 0.0026) for i in range(n)] if j < 4 else [(-0.134 + 0.0083 + i * 0.0191, 0.0165) for i in range(3)] + [(0.0, 0.094)] + [(0.134 - 0.0083 - i * 0.0191, 0.0165) for i in range(4, -1, -1)]
        for (x, w) in xs:
            vs = [bm.verts.new((x + sx * w / 2, y + sy * 0.0082, z)) for z in (0.0098 - 0.0009, 0.0098 - 0.0001) for sx, sy in [(-1, -1), (1, -1), (1, 1), (-1, 1)]]
            for f in [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]: bm.faces.new([vs[k] for k in f])
    bm.to_mesh(me); bm.free(); tk = enlazar(bpy.data.objects.new("teclas", me)); bv = tk.modifiers.new("canto", "BEVEL"); bv.width = 0.0007; bv.segments = 2; aplicar(tk); tk.data.materials.append(tecla); tk.parent = raiz
    bisagra = vacio("bisagra", raiz); bisagra.location = (0, pd / 2 - 0.003, 0.0098 + 0.0006); E["bisagra"] = bisagra
    tapa = prisma("portatil tapa", pw, pd, 0.0044, r=0.011, filete=0.0016, mat=alu_c); tapa.parent = bisagra; tapa.location = (0, -(pd / 2 - 0.003), 0.0)
    cristal = prisma("portatil cristal", pw - 0.004, pd - 0.004, 0.0002, r=0.009, mat=negro); cristal.parent = bisagra; cristal.location = (0, -(pd / 2 - 0.003), -0.0002)
    E["m_portatil"] = bpy.data.materials.new("portatil pantalla"); mpt = E["m_portatil"]; mpt.use_nodes = True; nt = mpt.node_tree; p = nt.nodes["Principled BSDF"]
    ims = [nt.nodes.new("ShaderNodeTexImage") for _ in range(3)]
    for n_, f in zip(ims, ["portatil-antes.png", "portatil-despues.png", "portatil-vacio.png"]): n_.image = imagen(f)
    mx1 = nt.nodes.new("ShaderNodeMix"); mx1.data_type = "RGBA"; mx1.name = "mezcla"; mx2 = nt.nodes.new("ShaderNodeMix"); mx2.data_type = "RGBA"; mx2.name = "vacio"; mx1.inputs[0].default_value = 0; mx2.inputs[0].default_value = 0
    nt.links.new(ims[0].outputs["Color"], mx1.inputs[6]); nt.links.new(ims[1].outputs["Color"], mx1.inputs[7]); nt.links.new(mx1.outputs[2], mx2.inputs[6]); nt.links.new(ims[2].outputs["Color"], mx2.inputs[7]); ga = nt.nodes.new("ShaderNodeGamma"); ga.inputs[1].default_value = LUCES["gamma"]; nt.links.new(mx2.outputs[2], ga.inputs[0]); nt.links.new(ga.outputs[0], p.inputs["Emission Color"])
    p.inputs["Emission Strength"].default_value = 0.9 * LUCES["pantalla"]; p.inputs["Base Color"].default_value = (0, 0, 0, 1); p.inputs["Roughness"].default_value = 0.08; p.inputs["Coat Weight"].default_value = 1.0; p.inputs["Coat Roughness"].default_value = 0.03
    # la pantalla va en la cara de dentro de la tapa (mira hacia abajo cuando está cerrada)
    sw, sh = 0.2863, 0.1789; pan = prisma("portatil pantalla", sw, sh, 0, r=0.004, mat=mpt, uv=True); pan.parent = bisagra; pan.location = (0, -(pd / 2 - 0.003) + 0.004, -0.00045); pan.rotation_euler = (rad(180), 0, 0); E["pantalla_portatil"] = pan

    # --- la factura: una hoja con su curva
    me = bpy.data.meshes.new("factura"); bm = bmesh.new(); NF = 28; capa = bm.loops.layers.uv.new("uv"); fw, fh = FACTURA["w"], FACTURA["h"]
    filas = [[bm.verts.new((sx * fw / 2, 0.016 * (j / NF) ** 2.2 * -1.0, fh * j / NF)) for sx in (-1, 1)] for j in range(NF + 1)]
    for j in range(NF):
        f = bm.faces.new((filas[j][0], filas[j][1], filas[j + 1][1], filas[j + 1][0]))
        for l, (u, v) in zip(f.loops, [(0, j / NF), (1, j / NF), (1, (j + 1) / NF), (0, (j + 1) / NF)]): l[capa].uv = (u, v)
    bm.to_mesh(me); bm.free(); hoja = enlazar(bpy.data.objects.new("factura hoja", me))
    for pp_ in me.polygons: pp_.use_smooth = True
    so = hoja.modifiers.new("grosor", "SOLIDIFY"); so.thickness = 0.00022
    papel = bpy.data.materials.new("papel"); papel.use_nodes = True; nt = papel.node_tree; p = nt.nodes["Principled BSDF"]; im = nt.nodes.new("ShaderNodeTexImage"); im.image = imagen("factura.png"); nt.links.new(im.outputs["Color"], p.inputs["Base Color"]); p.inputs["Roughness"].default_value = 0.62; p.inputs["Specular IOR Level"].default_value = 0.25
    hoja.data.materials.append(papel); raiz_f = vacio("factura"); hoja.parent = raiz_f; E["factura"] = raiz_f
    # la línea que lee la factura
    lector = bpy.data.materials.new("lector"); lector.use_nodes = True; pl2 = lector.node_tree.nodes["Principled BSDF"]; pl2.inputs["Base Color"].default_value = (0, 0, 0, 1); pl2.inputs["Emission Color"].default_value = (0.05, 0.22, 1.0, 1); pl2.inputs["Emission Strength"].default_value = 14.0
    barra = prisma("lector", fw + 0.004, 0.0009, 0.0012, mat=lector); barra.parent = raiz_f; E["lector"] = barra; barra.hide_render = True

    # --- luces: una caja de luz grande arriba a la izquierda, relleno a la derecha y un contraluz
    def luz(nombre, pot, tam, loc, mira=(0, 0, 0.05), color=(1, 1, 1)):
        l = bpy.data.lights.new(nombre, "AREA"); l.energy = pot; l.shape = "RECTANGLE"; l.size = tam[0]; l.size_y = tam[1]; l.color = color; o = enlazar(bpy.data.objects.new(nombre, l)); o.location = loc
        o.rotation_euler = (Vector(mira) - Vector(loc)).to_track_quat("-Z", "Y").to_euler(); o.visible_camera = False; return o
    L = LUCES
    luz("principal", L["principal"], (1.8, 1.3), (-1.7, -0.9, 2.3)); luz("relleno", L["relleno"], (2.2, 2.2), (2.6, -2.0, 1.2)); luz("contra", L["contra"], (2.8, 0.5), (0.4, 2.3, 1.7), (0, 0, 0.1)); luz("franja", L["franja"], (0.22, 2.4), (-2.4, 0.4, 0.8))
    luz("fondo", L["fondo"], (6.0, 2.0), (0.0, -0.6, 4.6), (0.0, 5.0, 1.8))
    mundo = bpy.data.worlds.new("mundo"); mundo.use_nodes = True; mundo.node_tree.nodes["Background"].inputs[0].default_value = (0.92, 0.95, 1, 1); mundo.node_tree.nodes["Background"].inputs[1].default_value = L["mundo"]; S.world = mundo

    # --- cámara
    cam = bpy.data.cameras.new("camara"); cam.sensor_width = 36; oc = enlazar(bpy.data.objects.new("camara", cam)); S.camera = oc; obj = vacio("objetivo"); E["camara"] = oc; E["objetivo"] = obj
    tr = oc.constraints.new("TRACK_TO"); tr.target = obj; tr.track_axis = "TRACK_NEGATIVE_Z"; tr.up_axis = "UP_Y"; cam.dof.use_dof = True; cam.dof.focus_object = obj
    return E

# ------------------------------------------------------------------ los momentos
H = BASE["h"]
def sitio(a, datos):  # dónde queda cada cosa cuando encaja
    if a in ("movil", "tableta", "factura"): return (datos["x"], datos["y"], H - 0.0125), (rad(-datos["inclin"]), 0, 0)
    return (datos["x"], datos["y"], H - 0.003), (0, 0, 0)
SITIOS = { "movil": sitio("movil", MOVIL), "tableta": sitio("tableta", TABLETA), "portatil": sitio("portatil", PORTATIL), "factura": sitio("factura", FACTURA) }
# sueltas: cada una en su sitio del aire, a distinta distancia; y antes de eso, fuera de cuadro
SUELTAS = { "movil": ((-0.16, -0.62, 0.25), (rad(-22), rad(-12), rad(16))), "tableta": ((-0.30, 0.30, 0.50), (rad(-14), rad(8), rad(-10))), "portatil": ((0.20, 0.26, 0.40), (rad(14), rad(-6), rad(-16))), "factura": ((0.31, -0.12, 0.20), (rad(-12), rad(10), rad(-24))) }
FUERA = { "movil": ((-1.5, -1.9, 0.75), (rad(-60), rad(-40), rad(70))), "tableta": ((-1.4, 2.8, 1.5), (rad(-50), rad(30), rad(-60))), "portatil": ((1.9, 2.6, 1.3), (rad(40), rad(-20), rad(-70))), "factura": ((2.1, -1.5, 0.9), (rad(-60), rad(30), rad(-80))) }
TURNO = { "movil": (0.0, 0.55), "tableta": (0.12, 0.68), "portatil": (0.26, 0.84), "factura": (0.44, 1.0) }   # en qué tramo de la unión encaja cada una
# cámaras: (posición, adónde mira, focal, diafragma, desplazamiento x/y)
CAMARAS = {
  "h": [((-0.42, -2.25, 0.56), (0.12, 0.0, 0.27), 58, 16, (-0.23, 0.03)), ((-0.05, -2.34, 0.50), (0.06, 0.0, 0.29), 54, 16, (-0.2, 0.02)), ((-0.98, -1.95, 0.84), (0.03, 0.0, 0.085), 62, 9, (-0.215, 0.03)),
        ((-1.20, -1.10, 0.42), (-0.30, 0.0, 0.10), 85, 4.5, (-0.27, 0.0)), ((1.05, -0.92, 0.36), (0.35, 0.035, 0.17), 90, 3.5, (-0.215, 0.0)), ((0.095, -1.36, 0.36), (0.095, 0.10, 0.118), 80, 9, (-0.2, 0.0)),
        ((1.28, -1.72, 0.70), (0.0, 0.0, 0.085), 61, 9, (-0.2, 0.03)), ((1.28, -1.72, 0.70), (0.0, 0.0, 0.085), 61, 9, (-0.2, 0.03)), ((-1.30, -1.30, 0.30), (-0.22, 0.0, 0.085), 72, 6.3, (-0.2, 0.02))],
  # las del móvil: imagen cuadrada, con la escena centrada
  "v": [((-0.42, -2.25, 0.56), (0.08, 0.0, 0.25), 62, 16, (0.0, 0.0)), ((-0.05, -2.34, 0.50), (0.06, 0.0, 0.26), 58, 16, (0.0, 0.0)), ((-0.98, -1.95, 0.84), (0.0, 0.0, 0.10), 72, 9, (0.0, 0.0)),
        ((-1.20, -1.10, 0.42), (-0.30, 0.0, 0.10), 85, 4.5, (-0.02, 0.0)), ((1.05, -0.92, 0.36), (0.35, 0.035, 0.17), 90, 3.5, (0.06, 0.0)), ((0.095, -1.36, 0.36), (0.095, 0.10, 0.118), 100, 9, (0.0, 0.0)),
        ((1.28, -1.72, 0.70), (0.0, 0.0, 0.10), 78, 9, (0.0, 0.0)), ((1.28, -1.72, 0.70), (0.0, 0.0, 0.10), 78, 9, (0.0, 0.0)), ((-1.30, -1.30, 0.30), (-0.25, 0.0, 0.085), 82, 6.3, (0.0, 0.0))],
}
LUCES = dict(principal=150, relleno=9, contra=80, franja=22, fondo=260, mundo=0.05, exposicion=0.45, pantalla=1.7, gamma=1.45)
ABIERTA = 112   # grados de la tapa del portátil

def poner(E, c, vertical=False):
    """Coloca todo para el momento c (0…8: inicio, hoy, sistema, automatización, inteligencia, finance, resultado, demos, tuyo)."""
    S = bpy.context.scene; cc = max(0.0, c); i = max(0, min(7, int(math.floor(cc)))); f = cc - i; t = suave(0.0, 1.0, f)
    for n_, a in enumerate(("movil", "tableta", "portatil", "factura")):
        (p0, r0), (p1, r1), (p2, r2) = FUERA[a], SUELTAS[a], SITIOS[a]
        if c <= 0:   # la entrada: cada cosa llega al cuadro desde un sitio y una distancia distintos
            k = 1 - (1 - suave(0.0, 1.0, c + 1)) ** 1.6; loc = [mezcla(p0[j], p1[j], k) for j in range(3)]; rot = [mezcla(r0[j], r1[j], k) for j in range(3)]
        elif c <= 1:  # sueltas: flotan despacio, cada una a su aire
            loc = [p1[0] + math.sin(c * 2.2 + n_ * 1.7) * 0.02, p1[1], p1[2] + math.sin(c * 2.6 + n_ * 2.3) * 0.018 - 0.004 * n_ * c]; rot = [r1[0] + math.sin(c * 1.9 + n_) * 0.05, r1[1] + c * 0.06 * (1 if n_ % 2 else -1), r1[2]]
        else:
            q1 = [p1[0] + math.sin(2.2 + n_ * 1.7) * 0.02, p1[1], p1[2] + math.sin(2.6 + n_ * 2.3) * 0.018 - 0.004 * n_]; s1 = [r1[0] + math.sin(1.9 + n_) * 0.05, r1[1] + 0.06 * (1 if n_ % 2 else -1), r1[2]]
            u = suave(*TURNO[a], min(1.0, c - 1)); loc = [mezcla(q1[j], p2[j], u) for j in range(3)]; rot = [mezcla(s1[j], r2[j], suave(0.0, 0.8, u)) for j in range(3)]
            # viene en arco, se coloca encima de su sitio y baja recta, como quien posa algo con cuidado
            if u < 0.75: w = suave(0.0, 0.75, u); loc = [mezcla(q1[0], p2[0], w), mezcla(q1[1], p2[1], w), mezcla(q1[2], p2[2] + 0.06, w) + math.sin(w * math.pi) * 0.05]
            else: loc = [p2[0], p2[1], p2[2] + 0.06 * (1 - suave(0.75, 1.0, u))]
        E[a].location = loc; E[a].rotation_euler = rot
    # la tapa del portátil: a medio abrir mientras flota; se abre del todo al encajar
    u = suave(*TURNO["portatil"], max(0.0, min(1.0, c - 1))); E["bisagra"].rotation_euler = (-rad(mezcla(78, ABIERTA, suave(0.7, 1.0, u))), 0, 0)
    # la línea azul se enciende cuando ha encajado todo
    E["led"].inputs["Emission Strength"].default_value = 11.0 * suave(1.9, 2.05, c)
    for a in ("movil", "tableta", "portatil", "factura"): E["canal_" + a].inputs["Emission Strength"].default_value = 9.0 * suave(1 + TURNO[a][1] - 0.04, 1 + TURNO[a][1] + 0.06, c)
    # el dato se propaga: de la factura al portátil, a las tareas y al teléfono
    for nombre, (a, b) in (("m_portatil", (2.12, 2.38)), ("m_tableta", (2.4, 2.64)), ("m_movil", (2.66, 2.9))): E[nombre].node_tree.nodes["mezcla"].inputs[0].default_value = suave(a, b, c)
    E["m_portatil"].node_tree.nodes["vacio"].inputs[0].default_value = suave(4.55, 4.95, c) * (1 - suave(5.05, 5.45, c))
    # la línea que lee la factura: baja por la hoja entre el 3 y el 4, y se queda a media altura en el 4
    lee = suave(3.35, 3.6, c) * (1 - suave(4.25, 4.5, c)); E["lector"].hide_render = lee < 0.01
    v = mezcla(0.92, 0.36, suave(3.4, 4.0, c)); E["lector"].location = (0, -0.0012 - 0.016 * v ** 2.2, FACTURA["h"] * v)
    # cámara
    E["chapa"].hide_render = c < 7.4
    cams = CAMARAS["v" if vertical else "h"]; A = cams[i]; B = cams[min(8, i + 1)]
    pos = [mezcla(A[0][j], B[0][j], t) for j in range(3)]; mira = [mezcla(A[1][j], B[1][j], t) for j in range(3)]
    if c < 0: pos[1] -= 0.55 * (1 - suave(0.0, 1.0, c + 1)); pos[2] += 0.08 * (1 - suave(0.0, 1.0, c + 1))
    arco = math.sin(math.pi * t) * min(0.5, (Vector(A[0]) - Vector(B[0])).length * 0.12); pos[1] -= arco; pos[2] += arco * 0.35
    cam = E["camara"]; cam.location = pos; E["objetivo"].location = mira; cam.data.lens = mezcla(A[2], B[2], t); cam.data.dof.aperture_fstop = mezcla(A[3], B[3], t); cam.data.shift_x = mezcla(A[4][0], B[4][0], t); cam.data.shift_y = mezcla(A[4][1], B[4][1], t)
    bpy.context.view_layer.update()

def ajustes(res=(1600, 900), spp=96):
    S = bpy.context.scene; S.render.engine = "CYCLES"; cy = S.cycles; cy.device = "CPU"; cy.samples = spp; cy.use_adaptive_sampling = True; cy.adaptive_threshold = 0.02; cy.use_denoising = True
    try: cy.denoiser = "OPENIMAGEDENOISE"
    except Exception: pass
    cy.max_bounces = 6; cy.glossy_bounces = 4; cy.transmission_bounces = 4; cy.diffuse_bounces = 3; cy.caustics_reflective = False; cy.caustics_refractive = False; cy.sample_clamp_indirect = 6.0
    S.render.resolution_x, S.render.resolution_y = res; S.render.resolution_percentage = 100; S.render.film_transparent = False; S.render.use_persistent_data = True; S.render.threads_mode = "AUTO"
    S.render.image_settings.file_format = "PNG"; S.render.image_settings.color_mode = "RGB"; S.render.image_settings.compression = 30
    S.view_settings.view_transform = "AgX"; S.view_settings.look = "AgX - Medium High Contrast"; S.view_settings.exposure = LUCES["exposicion"]; S.cycles.filter_width = 1.4
    S.use_nodes = True; nt = S.node_tree
    if "resplandor" not in nt.nodes:
        rl = nt.nodes.get("Render Layers") or nt.nodes.new("CompositorNodeRLayers"); co = nt.nodes.get("Composite") or nt.nodes.new("CompositorNodeComposite")
        g = nt.nodes.new("CompositorNodeGlare"); g.name = "resplandor"; g.glare_type = "FOG_GLOW"; g.quality = "HIGH"; g.threshold = 2.2; g.size = 7; g.mix = -0.78
        nt.links.new(rl.outputs["Image"], g.inputs[0]); nt.links.new(g.outputs[0], co.inputs[0])

def esquinas(E, objeto):
    """Dónde caen en la imagen las cuatro esquinas de un plano (para colocar HTML encima con la misma perspectiva). Devuelve [x, y] de 0 a 1, desde arriba a la izquierda."""
    from bpy_extras.object_utils import world_to_camera_view
    S = bpy.context.scene; ob = objeto; me = ob.data; xs = [v.co.x for v in me.vertices]; ys = [v.co.y for v in me.vertices]; x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    sal = []
    for (x, y) in [(x0, y1), (x1, y1), (x1, y0), (x0, y0)]:
        w = ob.matrix_world @ Vector((x, y, 0)); q = world_to_camera_view(S, S.camera, w); sal.append([round(q.x, 5), round(1 - q.y, 5)])
    return sal

def cajas(E):
    """El rectángulo que ocupa en la imagen cada cosa (para señalarla desde la página): [x0, y0, x1, y1] de 0 a 1."""
    from bpy_extras.object_utils import world_to_camera_view
    S = bpy.context.scene; sal = {}
    def hijos(o):
        for h in o.children: yield h; yield from hijos(h)
    for a in ("movil", "tableta", "portatil", "factura"):
        xs, ys = [], []
        for o in hijos(E[a]):
            if o.type != "MESH" or o.hide_render: continue
            dg = bpy.context.evaluated_depsgraph_get(); oe = o.evaluated_get(dg); me = oe.to_mesh()
            paso = max(1, len(me.vertices) // 400)
            for i in range(0, len(me.vertices), paso):
                q = world_to_camera_view(S, S.camera, oe.matrix_world @ me.vertices[i].co); xs.append(q.x); ys.append(1 - q.y)
            oe.to_mesh_clear()
        sal[a] = [round(min(xs), 4), round(min(ys), 4), round(max(xs), 4), round(max(ys), 4)]
    return sal

if __name__ == "__main__":
    a = sys.argv[1:]; op = {a[i][2:]: (a[i + 1] if i + 1 < len(a) and not a[i + 1].startswith("--") else True) for i in range(len(a)) if a[i].startswith("--")}
    vertical = bool(op.get("vertical")); res = tuple(int(x) for x in op.get("res", "1080x1080" if vertical else "1600x900").split("x")); spp = int(op.get("spp", 96))
    E = construir(op.get("idioma", "es")); ajustes(res, spp); S = bpy.context.scene
    if "anclas" in op:   # solo medir, sin pintar
        sal = {"cajas": {}, "sobre": {}}
        for v, r in ((False, (1600, 900)), (True, (1080, 1080))):
            l = "v" if v else "h"; ajustes(r, 1); poner(E, 2.0, v); sal["cajas"][l] = cajas(E)
            poner(E, 5.0, v); sal["sobre"]["5" + l] = {"pantalla": esquinas(E, E["pantalla_portatil"])}; poner(E, 8.0, v); sal["sobre"]["8" + l] = {"chapa": esquinas(E, E["chapa"])}
        json.dump(sal, open(op["anclas"], "w")); print(sal); sys.exit(0)
    tareas = []   # (momento, fichero, resolución, muestras, vertical)
    if "lote" in op: tareas = [(t["c"], t["f"], tuple(t["res"]), t["spp"], bool(t.get("v"))) for t in json.load(open(op["lote"]))]
    elif "serie" in op:
        c0, c1, n = op["serie"].split(":"); c0 = float(c0); c1 = float(c1); n = int(n); os.makedirs(op["carpeta"], exist_ok=True)
        tareas = [(c0 + (c1 - c0) * k / n, os.path.join(op["carpeta"], f"{c0:g}-{k:02d}.png"), res, spp, vertical) for k in range(1, n)]
    else: tareas = [(float(op.get("c", 2)), op.get("salida", "foto.png"), res, spp, vertical)]
    import time
    for c, salida, res, spp, vertical in tareas:
        if os.path.exists(salida): continue
        t0 = time.time(); ajustes(res, spp); poner(E, c, vertical); S.render.filepath = salida; bpy.ops.render.render(write_still=True); print(f"HECHO c={c:.3f} {salida} {time.time() - t0:.0f}s", flush=True)
        if "datos" in op:
            d = json.load(open(op["datos"])) if os.path.exists(op["datos"]) else {}
            d[f"{c:g}{'v' if vertical else 'h'}"] = {"pantalla": esquinas(E, E["pantalla_portatil"]), "chapa": esquinas(E, E["chapa"])}; json.dump(d, open(op["datos"], "w"))
