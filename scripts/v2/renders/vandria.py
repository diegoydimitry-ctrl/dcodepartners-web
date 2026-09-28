# Imágenes de la inmobiliaria de ejemplo «Vandria Hogar» (ficticia): la casa modelada por D-Code para su recorrido,
# vista DE DÍA y desde otros ángulos, como un anuncio de una villa en la costa (no el recorrido de hora azul).
# Uso: python3.11 scripts/v2/renders/vandria.py --blend <escena.blend guardada por escena.py --guardar> --out <carpeta> [--muestras 48] [--res 1200]
import bpy, math, os, sys, argparse
from mathutils import Vector
ap = argparse.ArgumentParser(); ap.add_argument('--blend', required=True); ap.add_argument('--out', required=True)
ap.add_argument('--muestras', type=int, default=48); ap.add_argument('--res', type=int, default=1200); ap.add_argument('--solo', default='')
A = ap.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:])
bpy.ops.wm.open_mainfile(filepath=A.blend)
sc = bpy.context.scene
# de día: sol alto de media mañana, cielo claro; las luces de la casa apagadas
w = sc.world; sky = next(n for n in w.node_tree.nodes if n.type == 'TEX_SKY')
sky.sun_elevation = math.radians(38); sky.sun_rotation = math.radians(215); sky.sun_disc = True; sky.dust_density = 0.6
next(n for n in w.node_tree.nodes if n.type == 'BACKGROUND').inputs['Strength'].default_value = 0.42
ORIG = {o.name: o.data.energy for o in bpy.data.objects if o.type == 'LIGHT'}
def luces(f):
    for o in bpy.data.objects:
        if o.type == 'LIGHT': o.data.energy = ORIG[o.name] * f
for m in bpy.data.materials:
    if m.node_tree:
        for nd in m.node_tree.nodes:
            if nd.type == 'BSDF_PRINCIPLED' and nd.inputs['Emission Strength'].default_value > 0 and not m.name.startswith(('llama', 'fuego')):
                nd.inputs['Emission Strength'].default_value = 0.0
sc.view_settings.exposure = -0.2
sc.node_tree.nodes.clear() if False else None
for n in sc.node_tree.nodes:           # sin salida de profundidad ni bruma nocturna
    if n.type == 'OUTPUT_FILE': n.mute = True
    if n.type == 'MIX_RGB' and n.blend_type == 'MIX' and n.inputs[0].links: n.mute = True
cam = sc.camera; cd = cam.data; cam.animation_data_clear(); cd.animation_data_clear()
for fc in []: pass
cd.sensor_fit = 'AUTO'
sc.cycles.samples = A.muestras
sc.render.resolution_x = A.res; sc.render.resolution_y = round(A.res * 0.7)
os.makedirs(A.out, exist_ok=True)
# (nombre, posición, mira, focal, foco, exposición, luces de la casa)
VISTAS = [
    ('vandria-1', (27.0, 23.0, 2.4), (5.0, 3.0, 2.6), 28, 30, -0.2, 0.02),
    ('vandria-2', (-3.7, 2.4, 1.25), (-8.0, -2.9, 0.85), 24, 5, 2.3, 0.25),
    ('vandria-3', (2.1, 3.3, 1.42), (6.2, -2.8, 1.05), 24, 5, 2.1, 0.25),
]
for nombre, p, t, lente, foco, expo, fl in VISTAS:
    sc.view_settings.exposure = expo; luces(fl)
    if A.solo and nombre not in A.solo.split(','): continue
    cam.location = p; d = Vector(t) - Vector(p); cam.rotation_euler = (math.pi / 2 + math.atan2(d.z, math.hypot(d.x, d.y)) * 0.0, 0, math.atan2(d.y, d.x) - math.pi / 2)
    cd.lens = lente; cd.shift_y = 0.0; cd.dof.focus_distance = foco; cd.dof.aperture_fstop = 8
    sc.render.filepath = os.path.join(A.out, f'{nombre}.png'); bpy.ops.render.render(write_still=True); print('RENDER', nombre, flush=True)
