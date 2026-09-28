# Imágenes de las webs de ejemplo (rev. 28/09/2026): renders propios, sin fotos de banco ni marcas reales.
#   visqa-gama   · la gama de Visqa (lubricantes, empresa ficticia): botella de 1 L, garrafa de 5 L y bidón de 20 L
#   visqa-5l     · la garrafa de 5 L sola (ficha de producto)
#   orbe-mesa    · una mesa puesta al anochecer (restaurante Orbe, ficticio)
# Uso: python3.11 scripts/v2/renders/productos.py --out <carpeta> [--muestras 64] [--solo visqa-gama,orbe-mesa]
#      después: python3 scripts/v2/renders/empaquetar-webs.py <carpeta>   → assets/v2/img/webs/*.webp
import bpy, bmesh, math, os, sys, argparse, random
from mathutils import Vector, Matrix
from PIL import Image, ImageDraw, ImageFont

ap = argparse.ArgumentParser(); ap.add_argument('--out', required=True); ap.add_argument('--muestras', type=int, default=64); ap.add_argument('--solo', default='')
ap.add_argument('--fuentes', default=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fuentes'))
A = ap.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:])
os.makedirs(A.out, exist_ok=True)
QUIERO = set(A.solo.split(',')) if A.solo else {'visqa-gama', 'visqa-5l', 'orbe-mesa'}

def srgb(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)

# ------------------------------------------------------------------ etiquetas (PIL)
def fuente(nombre, tam, peso=None):
    f = ImageFont.truetype(os.path.join(A.fuentes, nombre), tam)
    if peso is not None:
        try: f.set_variation_by_axes([peso])
        except Exception: pass
    return f

def etiqueta(ruta, producto, grado, volumen, lineas):
    W, H = 1400, 1000
    im = Image.new('RGB', (W, H), '#1b2023'); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, 150], fill='#f2a900')
    d.text((60, 40), 'VISQA', font=fuente('spacegrotesk.ttf', 82, 700), fill='#111416')
    d.text((W - 60, 58), 'LUBRICANTES TÉCNICOS', font=fuente('jetbrains.ttf', 30, 500), fill='#111416', anchor='ra')
    d.text((60, 230), producto, font=fuente('spacegrotesk.ttf', 110, 700), fill='#f1f3f4')
    d.text((60, 370), grado, font=fuente('spacegrotesk.ttf', 230, 700), fill='#f2a900')
    y = 650
    for l in lineas:
        d.text((60, y), l, font=fuente('jetbrains.ttf', 34, 400), fill='#aeb6bb'); y += 52
    d.text((W - 60, H - 70), volumen, font=fuente('spacegrotesk.ttf', 96, 700), fill='#f1f3f4', anchor='rs')
    x = 60
    rr = random.Random(3)
    while x < 420:
        w = rr.choice((3, 3, 5, 8)); d.rectangle([x, H - 150, x + w, H - 60], fill='#f1f3f4'); x += w + rr.choice((3, 4, 6))
    im.save(ruta)
    return ruta

# ------------------------------------------------------------------ utilidades de escena
def limpiar():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = A.muestras; sc.cycles.use_denoising = True
    sc.cycles.denoiser = 'OPENIMAGEDENOISE'; sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.03
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'Medium High Contrast'; sc.view_settings.exposure = -0.35
    sc.render.image_settings.file_format = 'PNG'
    return sc

def mat(nombre, color, rug=0.4, met=0.0, capa=0.0, transm=0.0, ior=1.45, emision=None, fuerza=0.0, sheen=0.0):
    m = bpy.data.materials.new(nombre); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*srgb(color), 1); b.inputs['Roughness'].default_value = rug; b.inputs['Metallic'].default_value = met
    b.inputs['Coat Weight'].default_value = capa; b.inputs['Transmission Weight'].default_value = transm; b.inputs['IOR'].default_value = ior
    b.inputs['Sheen Weight'].default_value = sheen
    if emision: b.inputs['Emission Color'].default_value = (*srgb(emision), 1); b.inputs['Emission Strength'].default_value = fuerza
    return m

def mat_imagen(nombre, ruta, rug=0.35, capa=0.25):
    m = bpy.data.materials.new(nombre); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    t = nt.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(ruta); nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = rug; b.inputs['Coat Weight'].default_value = capa
    return m

def caja(nombre, dims, loc, material, bisel=0.01, sub=0, seg=3):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc); o = bpy.context.object; o.name = nombre; o.scale = dims
    bpy.ops.object.transform_apply(scale=True)
    if bisel: bv = o.modifiers.new('b', 'BEVEL'); bv.width = bisel; bv.segments = seg; bv.limit_method = 'ANGLE'
    if sub: sd = o.modifiers.new('s', 'SUBSURF'); sd.levels = sd.render_levels = sub
    for p in o.data.polygons: p.use_smooth = True
    o.data.materials.append(material); return o

def torno(nombre, perfil, loc, material, lados=64):
    me = bpy.data.meshes.new(nombre); bm = bmesh.new(); prev = None
    for r, z in perfil:
        v = bm.verts.new((r, 0, z))
        if prev: bm.edges.new((prev, v))
        prev = v
    bmesh.ops.spin(bm, geom=bm.verts[:] + bm.edges[:], cent=(0, 0, 0), axis=(0, 0, 1), angle=2 * math.pi, steps=lados, use_merge=True)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5); bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me); bm.free(); o = bpy.data.objects.new(nombre, me); bpy.context.scene.collection.objects.link(o); o.location = loc
    for p in me.polygons: p.use_smooth = True
    me.materials.append(material); return o

def tubo(nombre, puntos, radio, material):
    cu = bpy.data.curves.new(nombre, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = radio; cu.bevel_resolution = 4; cu.use_fill_caps = True
    sp = cu.splines.new('BEZIER'); sp.bezier_points.add(len(puntos) - 1)
    for p, q in zip(sp.bezier_points, puntos): p.co = q; p.handle_left_type = p.handle_right_type = 'AUTO'
    o = bpy.data.objects.new(nombre, cu); bpy.context.scene.collection.objects.link(o); cu.materials.append(material); return o

def plano_etiqueta(nombre, ancho, alto, loc, rot, material, curva=0.0):
    """Etiqueta pegada a una cara (plana o algo curvada)."""
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=24, y_subdivisions=2, size=1, location=(0, 0, 0)); o = bpy.context.object; o.name = nombre
    o.scale = (ancho, alto, 1); bpy.ops.object.transform_apply(scale=True)
    if curva:
        for v in o.data.vertices: v.co.z = -curva * (v.co.x / (ancho / 2)) ** 2
    o.rotation_euler = rot; o.location = loc
    o.data.materials.append(material)
    return o

def luz_area(nombre, loc, apunta, tam, e, color=(1, 1, 1), forma='RECTANGLE', tam_y=None):
    ld = bpy.data.lights.new(nombre, 'AREA'); ld.energy = e; ld.color = color; ld.shape = forma; ld.size = tam; ld.size_y = tam_y or tam
    o = bpy.data.objects.new(nombre, ld); bpy.context.scene.collection.objects.link(o); o.location = loc
    o.rotation_euler = (Vector(apunta) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); return o

def camara(loc, apunta, lente, foco, f, res=(1600, 1066)):
    cd = bpy.data.cameras.new('cam'); cd.lens = lente; cd.dof.use_dof = True; cd.dof.focus_distance = foco; cd.dof.aperture_fstop = f
    o = bpy.data.objects.new('cam', cd); bpy.context.scene.collection.objects.link(o); o.location = loc
    o.rotation_euler = (Vector(apunta) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); bpy.context.scene.camera = o
    sc = bpy.context.scene; sc.render.resolution_x, sc.render.resolution_y = res; return o

def mundo(color, fuerza):
    w = bpy.data.worlds.new('w'); bpy.context.scene.world = w; w.use_nodes = True
    w.node_tree.nodes['Background'].inputs['Color'].default_value = (*srgb(color), 1); w.node_tree.nodes['Background'].inputs['Strength'].default_value = fuerza

def render(nombre):
    sc = bpy.context.scene; sc.render.filepath = os.path.join(A.out, f'{nombre}.png'); bpy.ops.render.render(write_still=True); print('RENDER', nombre, flush=True)

# ------------------------------------------------------------------ VISQA · envases
def plastico(nombre, color):
    return mat(nombre, color, rug=0.32, capa=0.35)

def botella_1l(x, y, et):
    grafito = plastico('grafito_1l', '#23282c')
    cuerpo = caja('b1_cuerpo', (0.1, 0.062, 0.2), (x, y, 0.1), grafito, bisel=0.02, sub=2)
    torno('b1_hombro', [(0.0, 0.0), (0.028, 0.0), (0.026, 0.012), (0.017, 0.03), (0.0, 0.03)], (x - 0.012, y, 0.196), grafito)
    torno('b1_tapon', [(0.0, 0.0), (0.019, 0.0), (0.019, 0.028), (0.016, 0.03), (0.0, 0.03)], (x - 0.012, y, 0.224), mat('amb1', '#f2a900', 0.4, capa=0.2))
    plano_etiqueta('b1_et', 0.086, 0.11, (x, y - 0.0322, 0.095), (math.pi / 2, 0, 0), et, 0.0015)

def garrafa_5l(x, y, et, nombre='g5'):
    grafito = plastico(f'grafito_{nombre}', '#23282c')
    caja(f'{nombre}_cuerpo', (0.19, 0.12, 0.3), (x, y, 0.15), grafito, bisel=0.035, sub=2)
    torno(f'{nombre}_cuello', [(0.0, 0.0), (0.03, 0.0), (0.028, 0.02), (0.0, 0.02)], (x + 0.055, y, 0.298), grafito)
    torno(f'{nombre}_tapon', [(0.0, 0.0), (0.032, 0.0), (0.032, 0.034), (0.029, 0.036), (0.0, 0.036)], (x + 0.055, y, 0.316), mat(f'amb_{nombre}', '#f2a900', 0.4, capa=0.2))
    tubo(f'{nombre}_asa', [(x - 0.085, y, 0.285), (x - 0.07, y, 0.33), (x - 0.02, y, 0.335), (x + 0.005, y, 0.29)], 0.012, grafito)
    plano_etiqueta(f'{nombre}_et', 0.16, 0.2, (x, y - 0.0612, 0.14), (math.pi / 2, 0, 0), et, 0.002)

def bidon_20l(x, y, et):
    gris = plastico('gris_20l', '#2b3035')
    caja('b20_cuerpo', (0.29, 0.24, 0.39), (x, y, 0.195), gris, bisel=0.03, sub=2)
    for k in range(4): caja(f'b20_nervio_{k}', (0.292, 0.242, 0.012), (x, y, 0.06 + k * 0.09), gris, bisel=0.004)
    torno('b20_tapon', [(0.0, 0.0), (0.04, 0.0), (0.04, 0.04), (0.036, 0.042), (0.0, 0.042)], (x + 0.08, y + 0.05, 0.388), mat('amb20', '#f2a900', 0.4, capa=0.2))
    tubo('b20_asa', [(x - 0.11, y, 0.385), (x - 0.09, y, 0.45), (x + 0.0, y, 0.455), (x + 0.02, y, 0.39)], 0.016, gris)
    plano_etiqueta('b20_et', 0.22, 0.2, (x, y - 0.1215, 0.2), (math.pi / 2, 0, 0), et, 0.0)

def estudio_visqa():
    sc = limpiar(); mundo('#0d1012', 0.35)
    # peana de piedra negra y fondo de estudio curvo (sin esquina)
    piedra = mat('piedra', '#141719', rug=0.28, capa=0.1)
    caja('peana', (1.6, 0.8, 0.04), (0.05, 0.1, -0.02), piedra, bisel=0.004)
    bpy.ops.mesh.primitive_plane_add(size=1); fondo = bpy.context.object; fondo.scale = (8, 8, 1); fondo.location = (0, 1.2, -0.04)
    bm = bmesh.new(); bm.from_mesh(fondo.data); bm.free()
    fondo.data.materials.append(mat('fondo', '#15191c', rug=0.8))
    bpy.ops.mesh.primitive_plane_add(size=1); pared = bpy.context.object; pared.scale = (8, 3, 1); pared.rotation_euler = (math.pi / 2, 0, 0); pared.location = (0, 1.6, 1.4)
    pared.data.materials.append(mat('pared', '#171b1e', rug=0.9))
    luz_area('clave', (-0.9, -0.9, 1.1), (0.0, 0.1, 0.15), 0.9, 180, (1.0, 0.95, 0.9))
    luz_area('recorte', (1.1, 0.7, 0.9), (0.0, 0.1, 0.2), 0.15, 90, (1.0, 0.85, 0.6), tam_y=1.2)
    luz_area('relleno', (0.2, -1.4, 0.3), (0.0, 0.1, 0.15), 1.5, 30, (0.85, 0.9, 1.0))
    luz_area('fondo_luz', (0.0, 1.2, 1.6), (0.0, 1.6, 0.8), 1.2, 60, (1.0, 0.8, 0.55))

if QUIERO & {'visqa-gama', 'visqa-5l'}:
    r1 = etiqueta(os.path.join(A.out, 'et-1l.png'), 'PRO SP', '0W-20', '1 L', ['Aceite de motor 100 % sintético', 'API SP · ILSAC GF-6A', 'Lote L-2609 · Avilés'])
    r5 = etiqueta(os.path.join(A.out, 'et-5l.png'), 'PRO C3', '5W-30', '5 L', ['Aceite de motor 100 % sintético', 'ACEA C3 · API SP · VW 504.00/507.00', 'Lote L-2609 · Avilés'])
    r20 = etiqueta(os.path.join(A.out, 'et-20l.png'), 'MAX HD', '10W-40', '20 L', ['Vehículo pesado · cambio largo', 'ACEA E7 · API CI-4', 'Lote L-2611 · Avilés'])
    if 'visqa-gama' in QUIERO:
        estudio_visqa()
        e1, e5, e20 = mat_imagen('et1', r1), mat_imagen('et5', r5), mat_imagen('et20', r20)
        bidon_20l(0.33, 0.18, e20); garrafa_5l(0.0, 0.05, e5); botella_1l(-0.25, -0.05, e1)
        camara((0.05, -1.55, 0.42), (0.03, 0.08, 0.17), 58, 1.6, 4.0)
        render('visqa-gama')
    if 'visqa-5l' in QUIERO:
        estudio_visqa(); garrafa_5l(0.0, 0.05, mat_imagen('et5b', r5), 'g5b')
        camara((0.28, -0.9, 0.36), (0.0, 0.05, 0.16), 70, 0.95, 3.2, res=(1200, 1200))
        render('visqa-5l')

# ------------------------------------------------------------------ ORBE · mesa puesta al anochecer
if 'orbe-mesa' in QUIERO:
    sc = limpiar(); mundo('#0b0706', 0.15)
    roble = mat('roble', '#6d4a30', rug=0.45)
    m = roble.node_tree; b = m.nodes['Principled BSDF']
    ondas = m.nodes.new('ShaderNodeTexWave'); ondas.wave_type = 'BANDS'; ondas.inputs['Scale'].default_value = 3.0; ondas.inputs['Distortion'].default_value = 7.0; ondas.inputs['Detail'].default_value = 6
    tc = m.nodes.new('ShaderNodeTexCoord'); mp = m.nodes.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (1, 12, 1)
    m.links.new(tc.outputs['Object'], mp.inputs['Vector']); m.links.new(mp.outputs['Vector'], ondas.inputs['Vector'])
    rp = m.nodes.new('ShaderNodeValToRGB'); rp.color_ramp.elements[0].color = (*srgb('#4a2f1e'), 1); rp.color_ramp.elements[1].color = (*srgb('#8a603f'), 1)
    m.links.new(ondas.outputs['Fac'], rp.inputs['Fac']); m.links.new(rp.outputs['Color'], b.inputs['Base Color'])
    caja('mesa', (1.8, 0.95, 0.05), (0, 0, 0.725), roble, bisel=0.006)
    lino = mat('lino', '#d9cbb3', rug=0.95, sheen=0.5)
    caja('camino', (0.42, 0.95, 0.004), (0.0, 0.0, 0.752), lino, bisel=0.001)
    ceramica = mat('ceramica', '#e7dfd0', rug=0.35, capa=0.3); ceramica2 = mat('ceramica2', '#3a3430', rug=0.4, capa=0.2)
    vidrio = mat('vidrio', '#f4f6f6', rug=0.0, transm=1.0, ior=1.5)
    laton = mat('laton', '#b08d57', rug=0.3, met=1.0)
    cubierto = mat('cubierto', '#c9c7c2', rug=0.25, met=1.0)
    for i, (x, y) in enumerate([(-0.45, -0.22), (0.45, -0.22), (-0.45, 0.22), (0.45, 0.22)]):
        z = 0.75
        torno(f'plato_{i}', [(0, 0), (0.1, 0), (0.13, 0.012), (0.14, 0.018), (0.138, 0.02), (0.1, 0.008), (0, 0.006)], (x, y, z), ceramica)
        torno(f'plato_h_{i}', [(0, 0), (0.06, 0), (0.08, 0.025), (0.085, 0.032), (0.082, 0.033), (0.06, 0.012), (0, 0.01)], (x, y, z + 0.008), ceramica2)
        torno(f'copa_{i}', [(0, 0), (0.035, 0), (0.035, 0.003), (0.004, 0.006), (0.004, 0.08), (0.03, 0.1), (0.042, 0.14), (0.04, 0.19), (0.037, 0.19), (0.039, 0.14), (0.028, 0.102), (0.0, 0.085)], (x + 0.13 * (1 if x > 0 else -1) * -1, y + 0.13 * (1 if y > 0 else -1) * -1, z), vidrio)
        s = 1 if y > 0 else -1
        for k, dx in enumerate((-0.17, 0.17)):
            caja(f'cubierto_{i}_{k}', (0.014, 0.2, 0.003), (x + dx, y, z + 0.002), cubierto, bisel=0.001)
    torno('jarra', [(0, 0), (0.06, 0), (0.07, 0.12), (0.045, 0.2), (0.04, 0.26), (0.043, 0.265), (0, 0.26)], (0.0, 0.05, 0.754), vidrio)
    torno('agua', [(0, 0), (0.058, 0), (0.066, 0.11), (0.0, 0.11)], (0.0, 0.05, 0.756), mat('agua', '#eef4f5', rug=0.0, transm=1.0, ior=1.33))
    torno('portavela', [(0, 0), (0.045, 0), (0.035, 0.02), (0.012, 0.03), (0.0, 0.03)], (0.02, -0.18, 0.754), laton)
    torno('vela', [(0, 0), (0.012, 0), (0.012, 0.2), (0.0, 0.2)], (0.02, -0.18, 0.78), mat('cera', '#efe6d4', rug=0.6, sheen=0.3))
    torno('llama', [(0, 0), (0.005, 0.008), (0.004, 0.022), (0, 0.032)], (0.02, -0.18, 0.982), mat('llama', '#ffb05a', emision='#ff9a40', fuerza=60.0))
    ld = bpy.data.lights.new('vela_luz', 'POINT'); ld.energy = 6; ld.color = (1.0, 0.62, 0.3); ld.shadow_soft_size = 0.01
    o = bpy.data.objects.new('vela_luz', ld); sc.collection.objects.link(o); o.location = (0.02, -0.18, 1.0)
    # pan y aceite
    torno('tabla_pan', [(0, 0), (0.12, 0), (0.12, 0.015), (0, 0.015)], (-0.05, 0.25, 0.754), roble)
    pan = caja('pan', (0.16, 0.08, 0.05), (-0.05, 0.25, 0.79), mat('pan', '#b0763c', rug=0.8), bisel=0.02, sub=2)
    torno('aceite', [(0, 0), (0.04, 0), (0.045, 0.012), (0, 0.01)], (0.12, 0.3, 0.754), ceramica2)
    # fondo: sala en penumbra con luces cálidas desenfocadas y una lámpara colgante
    for k in range(18):
        rr = random.Random(k); x = rr.uniform(-3, 3); y = rr.uniform(2.5, 5); z = rr.uniform(0.9, 2.4)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.035, location=(x, y, z)); s_ = bpy.context.object
        s_.data.materials.append(mat(f'bokeh_{k}', '#ffcf94', emision='#ffb46a', fuerza=rr.uniform(20, 60)))
    bpy.ops.mesh.primitive_plane_add(size=1); p = bpy.context.object; p.scale = (12, 12, 1); p.location = (0, 0, 0); p.data.materials.append(mat('suelo', '#1a120d', rug=0.7))
    torno('colgante', [(0.0, 0.3), (0.02, 0.3), (0.2, 0.02), (0.21, 0.0), (0.2, 0.005), (0.02, 0.28), (0.0, 0.28)], (0.0, 0.0, 1.55), mat('colgante', '#2a1f18', rug=0.5, met=0.6))
    ld = bpy.data.lights.new('colg', 'SPOT'); ld.energy = 60; ld.spot_size = math.radians(70); ld.spot_blend = 0.8; ld.color = (1.0, 0.7, 0.42); ld.shadow_soft_size = 0.08
    o = bpy.data.objects.new('colg', ld); sc.collection.objects.link(o); o.location = (0, 0, 1.54)
    luz_area('ventana_azul', (-2.0, -1.0, 1.6), (0, 0, 0.75), 1.5, 25, (0.55, 0.65, 1.0))
    camara((0.62, -1.05, 1.08), (0.0, 0.05, 0.76), 50, 1.15, 2.2)
    render('orbe-mesa')
print('HECHO', flush=True)
