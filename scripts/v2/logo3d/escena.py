# ==========================================================================
# D-CODE · LAS PIEZAS (render fotorrealista del héroe, Blender 4.2 · Cycles)
# --------------------------------------------------------------------------
# Qué representa: las piezas del logotipo de D-Code fabricadas como objetos
# reales (cerámica mate, cantos redondeados). Empiezan sueltas —las áreas y
# herramientas de una empresa que no se hablan— y se unen en un solo
# sistema; al final se enciende el píxel azul: la IA.
#
# Salida: fotogramas PNG con fondo TRANSPARENTE y sombra real (shadow
# catcher), para que la misma secuencia sirva en modo oscuro y claro.
#
# Uso:
#   python3.11 scripts/v2/logo3d/escena.py --out ~/logo-render [--desde 1 --hasta 96 --cada 1] [--muestras 48] [--res 1200]
# ==========================================================================
import bpy, bmesh, math, random, sys, os, argparse, time
from mathutils import Vector, Euler

ap = argparse.ArgumentParser()
ap.add_argument('--out', required=True)
ap.add_argument('--desde', type=int, default=1); ap.add_argument('--hasta', type=int, default=0); ap.add_argument('--cada', type=int, default=1)
ap.add_argument('--muestras', type=int, default=48); ap.add_argument('--res', type=int, default=1200)
ap.add_argument('--prueba', action='store_true')
A = ap.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:])

FRAMES = 72
S = 0.01          # 1 unidad del SVG = 1 cm
PROF = 0.13       # grosor de las piezas
ALTURA = 0.34     # el logotipo flota sobre el suelo

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

# ------------------------------------------------------------------ geometría
def arco(cx, cy, r, a0, a1, n=24):
    return [(cx + r * math.cos(a0 + (a1 - a0) * i / n), cy + r * math.sin(a0 + (a1 - a0) * i / n)) for i in range(n + 1)]

def rect(x, y, w, h):
    return [(x, y), (x + w, y), (x + w, y + h), (x, y + h)]

# El logotipo (viewBox 120×100, y hacia abajo), igual que el SVG de la web.
PIEZAS = [
    ('p1', rect(26, 1, 16, 16)), ('p2', rect(1, 27, 13, 13)), ('p3', rect(35, 26, 13, 13)),
    ('p4', rect(2, 64, 12, 12)), ('p5', rect(35, 64, 13, 13)), ('p6', rect(26, 83, 16, 16)),
    ('p7', rect(102, 43, 16, 16)),
    # arco superior: 48,1 → 86,1 · arco r32 hasta 118,33 · baja a 38 · 102 · sube a 33 · arco r16 hasta 86,17 · 48,17
    ('arco_sup', [(48, 1), (86, 1)] + arco(86, 33, 32, -math.pi / 2, 0)[1:] + [(118, 38), (102, 38)] + arco(86, 33, 16, 0, -math.pi / 2)[:-1] + [(86, 17), (48, 17)]),
    ('arco_inf', [(48, 99), (86, 99)] + arco(86, 67, 32, math.pi / 2, 0)[1:] + [(118, 63), (102, 63)] + arco(86, 67, 16, 0, math.pi / 2)[:-1] + [(86, 83), (48, 83)]),
    ('ia', rect(16, 45, 15, 15)),
]

def pieza(nombre, pts):
    # centro del contorno → origen del objeto (para girar y mover cada pieza)
    cx = sum(p[0] for p in pts) / len(pts); cy = sum(p[1] for p in pts) / len(pts)
    me = bpy.data.meshes.new(nombre); ob = bpy.data.objects.new(nombre, me)
    sc.collection.objects.link(ob)
    bm = bmesh.new()
    vs = [bm.verts.new(((x - cx) * S, 0, -(y - cy) * S)) for x, y in pts]
    f = bm.faces.new(vs)
    r = bmesh.ops.extrude_face_region(bm, geom=[f])
    for v in [e for e in r['geom'] if isinstance(e, bmesh.types.BMVert)]: v.co.y += PROF
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    bv = ob.modifiers.new('bisel', 'BEVEL'); bv.width = 0.018 if nombre.startswith('arco') else 0.022; bv.segments = 6; bv.limit_method = 'ANGLE'; bv.angle_limit = math.radians(35); bv.harden_normals = True

    final = Vector(((cx - 60) * S, -PROF / 2, (100 - cy) * S - 0.5 + ALTURA + 0.5))
    return ob, final

# ------------------------------------------------------------------ materiales
def principled(nombre, color, rough, coat=0.0, coat_r=0.1, sss=0.0, emis=None):
    m = bpy.data.materials.new(nombre); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1); b.inputs['Roughness'].default_value = rough
    b.inputs['Coat Weight'].default_value = coat; b.inputs['Coat Roughness'].default_value = coat_r
    b.inputs['Subsurface Weight'].default_value = sss; b.inputs['Subsurface Radius'].default_value = (0.02, 0.02, 0.02)
    if emis: b.inputs['Emission Color'].default_value = (*emis, 1); b.inputs['Emission Strength'].default_value = 0.0
    return m, b

ceramica, _ = principled('ceramica', (0.018, 0.018, 0.02), 0.34, coat=0.55, coat_r=0.12)
# micro-relieve: la cerámica no es perfecta
nt = ceramica.node_tree; b = nt.nodes['Principled BSDF']
tx = nt.nodes.new('ShaderNodeTexNoise'); tx.inputs['Scale'].default_value = 900; tx.inputs['Detail'].default_value = 4
bump = nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.035
nt.links.new(tx.outputs['Fac'], bump.inputs['Height']); nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
azul, bazul = principled('ia', (0.05, 0.16, 0.85), 0.18, coat=1.0, coat_r=0.03, emis=(0.12, 0.32, 1.0))
bazul.inputs['Transmission Weight'].default_value = 0.0

# ------------------------------------------------------------------ piezas
random.seed(7)
objs = []
for nombre, pts in PIEZAS:
    ob, final = pieza(nombre, pts)
    ob.data.materials.append(azul if nombre == 'ia' else ceramica)
    # posición de partida: sueltas por la mesa, cada una a su aire
    ang = random.uniform(0, math.tau)
    ini = Vector((random.uniform(-0.85, 0.85), random.uniform(-0.5, 0.6), random.uniform(0.1, 1.2)))
    rot0 = Euler((random.uniform(-1.3, 1.3), random.uniform(-2.4, 2.4), random.uniform(-1.3, 1.3)))
    objs.append((ob, ini, final, rot0, random.uniform(0, 0.22), nombre))

# ------------------------------------------------------------------ animación
def suave(t):  # ease in-out quíntico: sale despacio, llega posándose
    t = max(0.0, min(1.0, t)); return t * t * t * (t * (t * 6 - 15) + 10)

def colocar(f):
    u = (f - 1) / (FRAMES - 1)                       # 0 … 1 a lo largo del scroll
    for ob, ini, fin, rot0, retraso, nombre in objs:
        # 0.00–0.18 flotan sueltas · 0.18–0.78 se unen (cada una con su retraso) · 0.78–1 quietas
        k = suave((u - 0.18 - retraso) / 0.42)
        deriva = (1 - k) * 0.04 * math.sin(u * 9 + retraso * 20)
        ob.location = ini.lerp(fin, k) + Vector((0, 0, deriva))
        ob.rotation_euler = Euler((rot0.x * (1 - k), rot0.y * (1 - k), rot0.z * (1 - k)))
        if nombre == 'ia':
            e = suave((u - 0.8) / 0.14)
            bazul.inputs['Emission Strength'].default_value = 0.7 * e
    # cámara: se acerca un poco y rodea despacio
    cam.location = Vector((-0.2 + 1.25 * suave(u), -3.4 + 0.45 * suave(u), 1.05 - 0.05 * suave(u)))
    cam.rotation_euler = (Vector((0, 0, ALTURA + 0.52)) - cam.location).to_track_quat('-Z', 'Y').to_euler()

# ------------------------------------------------------------------ suelo, luz y cámara
bpy.ops.mesh.primitive_plane_add(size=12, location=(0, 0, 0)); suelo = bpy.context.object
suelo.is_shadow_catcher = True
suelo.data.materials.append(principled('suelo', (0.5, 0.5, 0.5), 0.8)[0])

def luz(nombre, tipo, pos, rot, fuerza, tam, color=(1, 1, 1)):
    d = bpy.data.lights.new(nombre, tipo); d.energy = fuerza; d.color = color
    if tipo == 'AREA': d.shape = 'RECTANGLE'; d.size = tam[0]; d.size_y = tam[1]
    o = bpy.data.objects.new(nombre, d); o.location = pos; o.rotation_euler = rot; sc.collection.objects.link(o); return o
luz('caja', 'AREA', (-2.2, -0.6, 3.2), (math.radians(30), 0, math.radians(-70)), 520, (2.8, 1.4))   # ventana grande, arriba a la izquierda
luz('recorte', 'AREA', (2.4, 1.2, 1.8), (math.radians(-70), 0, math.radians(120)), 700, (0.5, 2.6))
luz('recorte2', 'AREA', (-2.4, 1.4, 1.4), (math.radians(-70), 0, math.radians(-120)), 420, (0.5, 2.2)) # filo por detrás a la derecha
luz('relleno', 'AREA', (0.4, -3.2, 2.4), (math.radians(55), 0, 0), 70, (4.0, 0.6))                  # rebote frontal bajo
w = bpy.data.worlds.new('mundo'); sc.world = w; w.use_nodes = True
w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.012, 0.012, 0.013, 1)
w.node_tree.nodes['Background'].inputs['Strength'].default_value = 1.0

cd = bpy.data.cameras.new('cam'); cd.lens = 52; cd.dof.use_dof = True; cd.dof.aperture_fstop = 5.6
cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
foco = bpy.data.objects.new('foco', None); foco.location = (0, 0, ALTURA + 0.5); sc.collection.objects.link(foco); cd.dof.focus_object = foco

# ------------------------------------------------------------------ render
sc.render.engine = 'CYCLES'
sc.cycles.device = 'CPU'
sc.cycles.samples = A.muestras; sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'
sc.cycles.max_bounces = 6; sc.cycles.transmission_bounces = 6; sc.cycles.glossy_bounces = 4
sc.render.film_transparent = True
sc.render.resolution_x = sc.render.resolution_y = A.res
sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'; sc.render.image_settings.color_depth = '8'
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Punchy'
os.makedirs(A.out, exist_ok=True)

hasta = A.hasta or FRAMES
cuadros = [48] if A.prueba else range(A.desde, hasta + 1, A.cada)
for f in cuadros:
    destino = os.path.join(A.out, f'd_{f:03d}.png')
    if os.path.exists(destino) and not A.prueba: continue
    colocar(f); sc.render.filepath = destino
    t0 = time.time(); bpy.ops.render.render(write_still=True)
    print(f'FOTOGRAMA {f} {time.time() - t0:.1f}s', flush=True)
