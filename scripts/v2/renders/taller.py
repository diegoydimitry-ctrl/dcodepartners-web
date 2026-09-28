# Imágenes del taller de ejemplo «Brío» (empresa ficticia) para la web de demostración de /servicios/paginas-web.
# Un taller mecánico moderno y creíble: suelo de resina gris, paredes blancas, carros de herramienta, elevador de dos
# columnas con un coche subido, luz de tubos LED y la luz fría del portón abierto.
# El coche es «CarConcept» (Khronos glTF-Sample-Assets, Eric Chadwick / Darmstadt Graphics Group, CC BY 4.0, a partir
# de un modelo CC0); la matrícula y el emblema del volante se sustituyen por materiales lisos (llevan logotipos de Khronos).
# Uso: python3.11 scripts/v2/renders/taller.py --coche <CarConcept.glb> --out <carpeta> [--muestras 48] [--res 1200] [--solo taller-1]
import bpy, math, os, sys, argparse
from mathutils import Vector, Euler

ap = argparse.ArgumentParser(); ap.add_argument('--coche', required=True); ap.add_argument('--out', required=True)
ap.add_argument('--muestras', type=int, default=48); ap.add_argument('--res', type=int, default=1200); ap.add_argument('--solo', default='')
A = ap.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:])
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; col = sc.collection

def srgb(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)

def mat(nombre, color, rug=0.5, met=0.0, emision=None, fuerza=0.0, capa=0.0):
    m = bpy.data.materials.new(nombre); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*srgb(color), 1); b.inputs['Roughness'].default_value = rug; b.inputs['Metallic'].default_value = met
    b.inputs['Coat Weight'].default_value = capa
    if emision: b.inputs['Emission Color'].default_value = (*srgb(emision), 1); b.inputs['Emission Strength'].default_value = fuerza
    return m

def resina():
    # suelo de resina epoxi gris: casi espejo, con el velo de uso (rugosidad que varía) y juntas de dilatación
    m = bpy.data.materials.new('resina'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord'); nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 0.6; nz.inputs['Detail'].default_value = 8
    nt.links.new(tc.outputs['Object'], nz.inputs['Vector'])
    mr = nt.nodes.new('ShaderNodeMapRange'); mr.inputs['To Min'].default_value = 0.08; mr.inputs['To Max'].default_value = 0.34
    nt.links.new(nz.outputs['Fac'], mr.inputs['Value']); nt.links.new(mr.outputs['Result'], b.inputs['Roughness'])
    br = nt.nodes.new('ShaderNodeTexBrick'); br.inputs['Scale'].default_value = 0.25; br.inputs['Mortar Size'].default_value = 0.002; br.offset = 0.0
    br.inputs['Color1'].default_value = (*srgb('#6e7073'), 1); br.inputs['Color2'].default_value = (*srgb('#6a6c6f'), 1); br.inputs['Mortar'].default_value = (*srgb('#3a3b3d'), 1)
    nt.links.new(tc.outputs['Object'], br.inputs['Vector']); nt.links.new(br.outputs['Color'], b.inputs['Base Color'])
    b.inputs['Coat Weight'].default_value = 0.4
    return m

def caja(nombre, x0, x1, y0, y1, z0, z1, m, bisel=0.01):
    bpy.ops.mesh.primitive_cube_add(size=1, location=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
    o = bpy.context.object; o.name = nombre; o.scale = (x1 - x0, y1 - y0, z1 - z0)
    bpy.ops.object.transform_apply(scale=True)
    o.data.materials.append(m)
    if bisel:
        bv = o.modifiers.new('b', 'BEVEL'); bv.width = bisel; bv.segments = 2; bv.limit_method = 'ANGLE'
        for p in o.data.polygons: p.use_smooth = True
    return o

M = dict(resina=resina(), pared=mat('pared', '#e9e8e4', 0.85), negro=mat('negro', '#18191b', 0.45, 0.2), rojo=mat('rojo_carro', '#b3261e', 0.32, 0.0, capa=0.6),
         acero=mat('acero', '#9ea3a8', 0.28, 1.0), amarillo=mat('amarillo', '#e8b400', 0.5), led=mat('led', '#ffffff', 0.5, emision='#f4f7ff', fuerza=35.0),
         gris=mat('gris_elevador', '#3c4046', 0.4, 0.6), goma=mat('goma', '#111111', 0.9), vidrio=mat('vidrio', '#ffffff', 0.05),
         placa=mat('placa', '#f2f2f2', 0.4), pantalla=mat('pantalla', '#0d1117', 0.2, emision='#3d7bff', fuerza=1.6))
vb = M['vidrio'].node_tree.nodes['Principled BSDF']; vb.inputs['Transmission Weight'].default_value = 1.0

# ---------------- la nave: 16 × 12 m, 5,5 m de alto; el portón abierto al fondo a la izquierda
caja('suelo', -8, 8, -6, 8, -0.05, 0, M['resina'], 0)
caja('pared_fondo', -8, 8, -6.2, -6, 0, 5.5, M['pared'], 0)
caja('pared_der', 8, 8.2, -6, 8, 0, 5.5, M['pared'], 0)
caja('pared_izq_a', -8.2, -8, -6, -2, 0, 5.5, M['pared'], 0)
caja('pared_izq_b', -8.2, -8, 3, 8, 0, 5.5, M['pared'], 0)
caja('pared_izq_dintel', -8.2, -8, -2, 3, 4.2, 5.5, M['pared'], 0)
caja('techo', -8, 8, -6, 8, 5.5, 5.6, M['pared'], 0)
# zócalo gris y línea amarilla de seguridad alrededor del puesto
caja('zocalo', -8, 8, -6, -5.98, 0, 1.1, M['gris'], 0)
for (x0, x1, y0, y1) in [(-3.2, 3.2, -3.1, -3.0), (-3.2, 3.2, 3.0, 3.1), (-3.2, -3.1, -3.1, 3.1), (3.1, 3.2, -3.1, 3.1)]:
    caja('linea', x0, x1, y0, y1, 0, 0.002, M['amarillo'], 0)
# tubos LED en líneas (la luz de un taller moderno)
for x in (-4.5, 0, 4.5):
    for y in (-3.5, 0.5, 4.5):
        caja('led', x - 0.04, x + 0.04, y - 1.4, y + 1.4, 5.2, 5.23, M['led'], 0)
        L_ = bpy.data.lights.new('tubo', 'AREA'); L_.shape = 'RECTANGLE'; L_.size = 0.1; L_.size_y = 2.8; L_.energy = 420; L_.color = (0.96, 0.98, 1.0)
        lo = bpy.data.objects.new('tubo', L_); lo.location = (x, y, 5.18); col.objects.link(lo)
# luz del portón (día nublado)
Lp = bpy.data.lights.new('porton', 'AREA'); Lp.shape = 'RECTANGLE'; Lp.size = 5.0; Lp.size_y = 4.2; Lp.energy = 2600; Lp.color = (0.86, 0.92, 1.0)
lp = bpy.data.objects.new('porton', Lp); lp.location = (-8.3, 0.5, 2.1); lp.rotation_euler = (0, math.radians(90), 0); col.objects.link(lp)

# ---------------- elevador de dos columnas con el coche subido
ALTO = 1.25
for x in (-1.75, 1.75):
    caja('columna', x - 0.18, x + 0.18, -0.25, 0.25, 0, 3.9, M['gris'], 0.01)
    caja('base_col', x - 0.3, x + 0.3, -0.4, 0.4, 0, 0.05, M['gris'], 0.005)
    # brazos telescópicos: de la columna hacia dentro y luego hacia los puntos de apoyo, bajo los estribos
    sx = 1 if x > 0 else -1
    for dy in (-1, 1):
        caja('brazo_a', min(x, sx * 0.8), max(x, sx * 0.8), dy * 0.3 - 0.06, dy * 0.3 + 0.06, ALTO - 0.12, ALTO - 0.04, M['amarillo'], 0.005)
        caja('brazo_b', sx * 0.8 - 0.06, sx * 0.8 + 0.06, min(dy * 0.3, dy * 1.25), max(dy * 0.3, dy * 1.25), ALTO - 0.12, ALTO - 0.04, M['amarillo'], 0.005)
        bpy.ops.mesh.primitive_cylinder_add(radius=0.07, depth=0.05, location=(sx * 0.8, dy * 1.25, ALTO - 0.015)); bpy.context.object.data.materials.append(M['goma'])
caja('travesano', -1.9, 1.9, -0.15, 0.15, 3.9, 4.05, M['gris'], 0.01)

# carros de herramienta rojos, banco de trabajo y panel de herramientas en la pared del fondo
for i, x in enumerate((-6.6, -5.4, 5.0, 6.2)):
    caja(f'carro_{i}', x - 0.55, x + 0.55, -5.9, -5.3, 0.12, 1.05, M['rojo'], 0.012)
    for k in range(6): caja('cajon', x - 0.5, x + 0.5, -5.31, -5.29, 0.2 + k * 0.14, 0.2 + k * 0.14 + 0.004, M['negro'], 0)
    caja('asa', x - 0.3, x + 0.3, -5.3, -5.26, 0.93, 0.95, M['acero'], 0.002)
    for sx in (-0.45, 0.45):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.05, depth=0.04, location=(x + sx, -5.6, 0.05), rotation=(0, math.pi / 2, 0)); bpy.context.object.data.materials.append(M['goma'])
caja('banco', -3.8, 3.8, -5.95, -5.25, 0.88, 0.93, M['acero'], 0.005)
caja('banco_patas', -3.7, 3.7, -5.9, -5.3, 0, 0.88, M['negro'], 0.005)
caja('panel', -3.6, 3.6, -5.99, -5.97, 1.2, 2.4, M['negro'], 0)
for i in range(22):
    x = -3.3 + i * 0.31; caja('herr', x - 0.02, x + 0.02, -5.97, -5.94, 1.5 + (i % 3) * 0.2, 1.9 + (i % 4) * 0.12, M['acero'], 0.004)
# diagnosis: una pantalla en un pie junto al coche
caja('pie', 3.3, 3.38, -1.2, -1.12, 0, 1.25, M['negro'], 0.004)
caja('monitor', 3.05, 3.65, -1.25, -1.2, 1.25, 1.62, M['negro'], 0.006)
caja('monitor_luz', 3.08, 3.62, -1.2, -1.195, 1.28, 1.59, M['pantalla'], 0)
# neumáticos apilados junto al portón
for k in range(4):
    bpy.ops.mesh.primitive_torus_add(major_radius=0.3, minor_radius=0.11, location=(-7.2, 5.4, 0.11 + k * 0.22))
    t = bpy.context.object; t.data.materials.append(M['goma'])
    for p in t.data.polygons: p.use_smooth = True

# ---------------- los coches (el mismo modelo dos veces: uno en el elevador, otro esperando en el puesto de al lado)
def goma_lateral():
    # el flanco del neumático lleva rotulado «KHRONOS» en el modelo: aquí, goma lisa con un leve relieve
    m = mat('goma_lateral', '#141414', 0.78)
    return m
M['flanco'] = goma_lateral(); M['flanco'].name = 'goma_lateral'
def coche(nombre, loc, rz, pintura=None):
    antes = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=A.coche)
    nuevos = [o for o in bpy.data.objects if o not in antes]
    raiz = bpy.data.objects.new(nombre, None); col.objects.link(raiz)
    for o in nuevos:
        if o.parent is None: o.parent = raiz
        if o.type == 'MESH':
            for i, ms in enumerate(o.data.materials):
                if not ms: continue
                if ms.name.startswith('License'): o.data.materials[i] = M['placa']
                elif ms.name.startswith('Tireside'): o.data.materials[i] = M['flanco']
                elif pintura and ms.name.startswith(('Paint 1', 'Paint 2')):
                    alt = bpy.data.materials.get(ms.name.replace('Carmine', pintura).split('.')[0])
                    if alt: o.data.materials[i] = alt
        if 'Emblem' in o.name: o.hide_render = True
    # colocar por su caja real: largo a lo largo de Y (entre las columnas del elevador) y ruedas apoyadas en z = loc.z
    bpy.context.view_layer.update()
    pts = [o.matrix_world @ Vector(c) for o in nuevos if o.type == 'MESH' for c in o.bound_box]
    ex = max(p.x for p in pts) - min(p.x for p in pts); ey = max(p.y for p in pts) - min(p.y for p in pts)
    base = 0.0 if ey >= ex else math.radians(90)
    raiz.rotation_euler = (0, 0, base + rz); bpy.context.view_layer.update()
    pts = [o.matrix_world @ Vector(c) for o in nuevos if o.type == 'MESH' for c in o.bound_box]
    cx = (max(p.x for p in pts) + min(p.x for p in pts)) / 2; cy = (max(p.y for p in pts) + min(p.y for p in pts)) / 2
    # apoyo real: el vértice más bajo de las ruedas (la caja de una rueda girada miente unos centímetros)
    z0 = min((o.matrix_world @ v.co).z for o in nuevos if o.type == 'MESH' and any(m and m.name.startswith(('Tire', 'goma')) for m in o.data.materials) for v in o.data.vertices)
    raiz.location = (loc[0] - cx, loc[1] - cy, loc[2] - z0)
    print('COCHE', nombre, round(ex, 2), round(ey, 2), 'girado' if base else 'recto', flush=True)
    return raiz
coche('coche_elevador', (0, 0.0, ALTO - 0.16), 0.0)   # los estribos sobre los tacos; las ruedas cuelgan
coche('coche_espera', (-4.9, 1.6, 0.0), math.radians(192), 'Graphite')

# ---------------- cámara, mundo y render
w = bpy.data.worlds.new('mundo'); sc.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs['Color'].default_value = (*srgb('#cfd6de'), 1)
w.node_tree.nodes['Background'].inputs['Strength'].default_value = 1.4   # el portón da a la calle: fuera, día nublado
cd = bpy.data.cameras.new('cam'); cam = bpy.data.objects.new('cam', cd); col.objects.link(cam); sc.camera = cam
cd.dof.use_dof = True; cd.sensor_width = 36
sc.render.engine = 'CYCLES'; sc.cycles.samples = A.muestras; sc.cycles.use_denoising = True; sc.cycles.use_adaptive_sampling = True
sc.cycles.device = 'CPU'; sc.cycles.max_bounces = 6; sc.cycles.caustics_reflective = False; sc.cycles.caustics_refractive = False
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'; sc.view_settings.exposure = 0.2
sc.render.resolution_x = A.res; sc.render.resolution_y = round(A.res * 2 / 3)
sc.render.image_settings.file_format = 'PNG'
os.makedirs(A.out, exist_ok=True)
def mirar(p, t):
    d = Vector(t) - Vector(p); return Euler((math.pi / 2 + math.atan2(d.z, math.hypot(d.x, d.y)), 0, math.atan2(d.y, d.x) - math.pi / 2), 'XYZ')
VISTAS = [
    # plano general: el coche en el elevador, el taller entero detrás
    ('taller-1', (5.6, 6.8, 1.55), (0.0, -0.8, 1.5), 26, 7.0, 4.0),
    # detalle: rueda y freno a la altura de los ojos, la pantalla de diagnosis desenfocada
    ('taller-2', (-1.4, 5.9, 0.95), (-4.7, 1.7, 0.7), 38, 4.8, 2.8),
]
for nombre, p, t, lente, foco, f in VISTAS:
    if A.solo and nombre not in A.solo.split(','): continue
    cam.location = p; cam.rotation_euler = mirar(p, t); cd.lens = lente; cd.dof.focus_distance = foco; cd.dof.aperture_fstop = f
    sc.render.filepath = os.path.join(A.out, nombre + '.png'); bpy.ops.render.render(write_still=True); print('RENDER', nombre, flush=True)
