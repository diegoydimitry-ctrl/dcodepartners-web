"""Lo común a los cinco modelos: plató, luces, cámara y revelado (Blender como módulo, Cycles en CPU)."""
import bpy, bmesh, math, sys, os
from mathutils import Vector, Matrix
rad = math.radians
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


def plato(color=(0.8, 0.8, 0.8), rug=0.45, R=3.0, Y1=5.0, ancho=14.0, nombre="plato"):
    """Suelo y fondo en una sola curva, sin horizonte."""
    m = material(nombre, color, 0.0, rug, **{"Specular IOR Level": 0.5})
    me = bpy.data.meshes.new("ciclorama"); bm = bmesh.new(); N = 40
    perfil = [(-9.0, 0.0), (Y1 - R, 0.0)] + [(Y1 - R + math.sin(rad(90 * i / N)) * R, R - math.cos(rad(90 * i / N)) * R) for i in range(1, N + 1)] + [(Y1, 9.0)]
    filas = [[bm.verts.new((x, y, z)) for (y, z) in perfil] for x in (-ancho, ancho)]
    for i in range(len(perfil) - 1): bm.faces.new((filas[0][i], filas[1][i], filas[1][i + 1], filas[0][i + 1]))
    bm.to_mesh(me); bm.free(); o = enlazar(bpy.data.objects.new("ciclorama", me)); o.data.materials.append(m)
    for p in me.polygons: p.use_smooth = True
    return o, m

def luz(nombre, pot, tam, loc, mira=(0, 0, 0.05), color=(1, 1, 1), tipo="AREA", visible=False, **mas):
    l = bpy.data.lights.new(nombre, tipo); l.energy = pot; l.color = color
    if tipo == "AREA": l.shape = "RECTANGLE"; l.size = tam[0]; l.size_y = tam[1]
    for k, v in mas.items(): setattr(l, k, v)
    o = enlazar(bpy.data.objects.new(nombre, l)); o.location = loc
    o.rotation_euler = (Vector(mira) - Vector(loc)).to_track_quat("-Z", "Y").to_euler(); o.visible_camera = visible; return o

def mundo(color=(1, 1, 1), fuerza=0.1):
    w = bpy.data.worlds.new("mundo"); w.use_nodes = True; b = w.node_tree.nodes["Background"]; b.inputs[0].default_value = (*color, 1); b.inputs[1].default_value = fuerza; bpy.context.scene.world = w; return w

def camara(pos, mira, lente=60, f=8, desplaza=(-0.2, 0.0), foco=None):
    S = bpy.context.scene; cam = bpy.data.cameras.new("camara"); cam.sensor_width = 36; cam.lens = lente; cam.shift_x, cam.shift_y = desplaza
    oc = enlazar(bpy.data.objects.new("camara", cam)); oc.location = pos; oc.rotation_euler = (Vector(mira) - Vector(pos)).to_track_quat("-Z", "Y").to_euler(); S.camera = oc
    cam.dof.use_dof = f is not None
    if f is not None: cam.dof.aperture_fstop = f; cam.dof.focus_distance = (Vector(foco if foco else mira) - Vector(pos)).length
    return oc

def revelar(salida, res=(1920, 1080), spp=64, exposicion=0.0, look="AgX - Medium High Contrast", rebotes=(8, 4, 6, 8), resplandor=None, filmico="AgX"):
    S = bpy.context.scene; S.render.engine = "CYCLES"; cy = S.cycles; cy.device = "CPU"; cy.samples = spp; cy.use_adaptive_sampling = True; cy.adaptive_threshold = 0.015; cy.use_denoising = True
    try: cy.denoiser = "OPENIMAGEDENOISE"
    except Exception: pass
    cy.max_bounces, cy.diffuse_bounces, cy.glossy_bounces, cy.transmission_bounces = rebotes; cy.transparent_max_bounces = 12; cy.caustics_reflective = False; cy.caustics_refractive = False; cy.sample_clamp_indirect = 8.0
    S.render.resolution_x, S.render.resolution_y = res; S.render.resolution_percentage = 100; S.render.image_settings.file_format = "PNG"; S.render.image_settings.color_mode = "RGB"
    S.view_settings.view_transform = filmico; S.view_settings.look = look; S.view_settings.exposure = exposicion; cy.filter_width = 1.4
    if resplandor:
        S.use_nodes = True; nt = S.node_tree; rl = nt.nodes.get("Render Layers") or nt.nodes.new("CompositorNodeRLayers"); co = nt.nodes.get("Composite") or nt.nodes.new("CompositorNodeComposite")
        g = nt.nodes.new("CompositorNodeGlare"); g.glare_type = "FOG_GLOW"; g.quality = "HIGH"; g.threshold = resplandor[0]; g.size = resplandor[1]; g.mix = resplandor[2]; nt.links.new(rl.outputs["Image"], g.inputs[0]); nt.links.new(g.outputs[0], co.inputs[0])
    S.render.filepath = salida; bpy.ops.render.render(write_still=True)

def opciones():
    a = sys.argv[1:]; op = {a[i][2:]: (a[i + 1] if i + 1 < len(a) and not a[i + 1].startswith("--") else True) for i in range(len(a)) if a[i].startswith("--")}
    res = tuple(int(x) for x in op.get("res", "1920x1080").split("x")); return op.get("salida", "foto.png"), res, int(op.get("spp", 64))

def tubo(nombre, puntos, radio, mat=None, res=12, cerrado=False, uv=True):
    """Una curva suave por los puntos dados, con sección circular; devuelve una malla con UV (U a lo largo, V alrededor)."""
    cu = bpy.data.curves.new(nombre, "CURVE"); cu.dimensions = "3D"; cu.bevel_depth = radio; cu.bevel_resolution = res; cu.use_fill_caps = True; cu.resolution_u = 12
    sp = cu.splines.new("NURBS"); sp.points.add(len(puntos) - 1)
    for p, c in zip(sp.points, puntos): p.co = (*c, 1.0)
    sp.use_endpoint_u = True; sp.order_u = 4; sp.use_cyclic_u = cerrado
    o = enlazar(bpy.data.objects.new(nombre, cu)); bpy.context.view_layer.update()
    me = bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get())); bpy.data.objects.remove(o); o = enlazar(bpy.data.objects.new(nombre, me))
    for p in me.polygons: p.use_smooth = True
    if mat: o.data.materials.append(mat)
    return o
