#!/usr/bin/env python3
"""
D-Code · las cinco escenas de la portada (Blender como módulo de Python, Cycles en CPU).

Cada escena es un objeto real que explica una sola cosa:
  A · la alineación   cuatro placas (personas, procesos, datos, herramientas); solo cuando están en línea pasa la luz.
  B · la trenza       cuatro cabos sueltos que pasan por un aro y salen como un solo cable: el sistema.
  C · la cadena       una fila de losas; cae la primera y lo demás ocurre solo: la automatización.
  D · el orden        un líquido desparramado que, bajo el imán, toma una forma exacta: la inteligencia que lee lo desordenado.
  E · la llave        una cerradura en corte; la llave pone cada perno en su sitio y gira: Finance registrando una factura.

Uso:
  python3 escenas.py --lote lote.json      # [{"e": "A", "p": {...}, "f": "x.png", "res": [w, h], "spp": n}, …]; salta lo que ya existe
  python3 escenas.py --anclas anclas.json  # sin pintar: dónde cae en cada fotografía lo que la página rotula
  python3 escenas.py --e C --p '{"frente": 10}' --salida foto.png [--res 960x540] [--spp 24]
"""
import json, random, time
from comun import *
from bpy_extras.object_utils import world_to_camera_view

def sv(a, b, x):
    t = min(1.0, max(0.0, (x - a) / (b - a))); return t * t * (3 - 2 * t)
def mez(a, b, t): return a + (b - a) * t
def cil(nombre, r, h, mat=None, seg=48, cono=None, canto=0.0):
    me = bpy.data.meshes.new(nombre); bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=cono if cono is not None else r, radius2=r, depth=h); bm.to_mesh(me); bm.free()
    o = enlazar(bpy.data.objects.new(nombre, me)); me.set_sharp_from_angle(angle=rad(40))
    for p in me.polygons: p.use_smooth = True
    if canto: b = o.modifiers.new("canto", "BEVEL"); b.width = canto; b.segments = 3; b.limit_method = "ANGLE"; b.angle_limit = rad(50); aplicar(o, 40)
    if mat: o.data.materials.append(mat)
    return o
def nueva_camara():
    cam = bpy.data.cameras.new("camara"); cam.sensor_width = 36; oc = enlazar(bpy.data.objects.new("camara", cam)); bpy.context.scene.camera = oc; cam.dof.use_dof = True; return oc
def poner_camara(oc, a, b=None, w=0.0):
    """a y b: (posición, adónde mira, focal, diafragma, desplazamiento, foco). Con b, mezcla entre las dos."""
    b = b or a; pos = Vector(a[0]).lerp(Vector(b[0]), w); mira = Vector(a[1]).lerp(Vector(b[1]), w); foco = Vector(a[5]).lerp(Vector(b[5]), w)
    oc.location = pos; oc.rotation_euler = (mira - pos).to_track_quat("-Z", "Y").to_euler(); c = oc.data; c.lens = mez(a[2], b[2], w); c.dof.aperture_fstop = mez(a[3], b[3], w)
    c.shift_x = mez(a[4][0], b[4][0], w); c.shift_y = mez(a[4][1], b[4][1], w); c.dof.focus_distance = (foco - pos).length; bpy.context.view_layer.update()
def en_foto(p):
    S = bpy.context.scene; q = world_to_camera_view(S, S.camera, Vector(p)); return [round(q.x, 4), round(1 - q.y, 4)]

# ====================================================================== A · la alineación
A_ = dict(A=0.21, H=0.32, G=0.007, RA=0.058, SEP=0.20, ZA=0.215, DX=[-0.105, 0.088, -0.066, 0.112], GIRO=[9, -7, 6, -8])
CAM_A = {
  "h0": ((0.86, -0.86, 0.25), (0.10, 0.42, 0.165), 46, 9, (-0.31, 0.0), (0, 0.20, 0.215)),
  "h6": ((0.30, -1.06, 0.30), (0.02, 0.34, 0.185), 58, 11, (-0.24, 0.0), (0, 0.0, 0.215)),
  "h8": ((0.34, -0.50, 0.135), (-0.005, 0.02, 0.105), 62, 8, (-0.25, 0.0), (0, -0.004, 0.08)),
}
def construir_A():
    a = A_; E = {}
    ti = material("titanio", (0.50, 0.50, 0.52), 1.0, 0.34, **{"Anisotropic": 0.5}); nt = ti.node_tree; p = nt.nodes["Principled BSDF"]
    co = nt.nodes.new("ShaderNodeTexCoord"); mp = nt.nodes.new("ShaderNodeMapping"); mp.inputs["Scale"].default_value = (600.0, 2.0, 2.0); nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 1.0; nz.inputs["Detail"].default_value = 5
    mr = nt.nodes.new("ShaderNodeMapRange"); mr.inputs[3].default_value = 0.26; mr.inputs[4].default_value = 0.46; nt.links.new(co.outputs["Object"], mp.inputs["Vector"]); nt.links.new(mp.outputs["Vector"], nz.inputs["Vector"]); nt.links.new(nz.outputs["Fac"], mr.inputs[0]); nt.links.new(mr.outputs[0], p.inputs["Roughness"])
    bu = nt.nodes.new("ShaderNodeBump"); bu.inputs["Strength"].default_value = 0.03; nt.links.new(nz.outputs["Fac"], bu.inputs["Height"]); nt.links.new(bu.outputs["Normal"], p.inputs["Normal"])
    pulido = material("canto pulido", (0.62, 0.62, 0.64), 1.0, 0.08); E["placas"] = []
    for i in range(4):
        pl = prisma(f"placa {i}", a["A"], a["G"], a["H"], r=0.0, mat=None)
        oc = cil("c", a["RA"], 0.1, None, 128); oc.rotation_euler = (rad(90), 0, 0); oc.location = (0, 0, a["ZA"])
        m = pl.modifiers.new("abertura", "BOOLEAN"); m.object = oc; m.operation = "DIFFERENCE"; m.solver = "EXACT"; bpy.context.view_layer.update(); aplicar(pl, 40); bpy.data.objects.remove(oc)
        b = pl.modifiers.new("canto", "BEVEL"); b.width = 0.0011; b.segments = 3; b.limit_method = "ANGLE"; b.angle_limit = rad(40); aplicar(pl, 40); pl.data.materials.append(ti)
        aro = bpy.data.meshes.new("aro"); bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=False, segments=128, radius1=a["RA"] + 0.0001, radius2=a["RA"] + 0.0001, depth=a["G"] + 0.0006); bm.to_mesh(aro); bm.free()
        oa = enlazar(bpy.data.objects.new(f"aro {i}", aro)); oa.rotation_euler = (rad(90), 0, 0); oa.location = (0, 0, a["ZA"]); oa.data.materials.append(pulido); so = oa.modifiers.new("g", "SOLIDIFY"); so.thickness = 0.0022; so.offset = 1
        for q in oa.data.polygons: q.use_smooth = True
        raiz = vacio(f"p{i}"); pl.parent = raiz; oa.parent = raiz; E["placas"].append(raiz)
    _, mplato = plato((0.016, 0.022, 0.040), 0.30, R=3.0, Y1=4.2); mplato.node_tree.nodes["Principled BSDF"].inputs["Specular IOR Level"].default_value = 0.6
    mundo((0.10, 0.16, 0.34), 0.015)
    vol = bpy.data.materials.new("bruma"); vol.use_nodes = True; vn = vol.node_tree; vn.nodes.remove(vn.nodes["Principled BSDF"]); sc = vn.nodes.new("ShaderNodeVolumeScatter"); sc.inputs["Density"].default_value = 0.16; sc.inputs["Anisotropy"].default_value = 0.35; vn.links.new(sc.outputs[0], vn.nodes["Material Output"].inputs["Volume"])
    caja = prisma("bruma", 6.0, 4.6, 2.2, mat=vol); caja.location = (0, 2.3 - 0.012, -0.01)
    luz("haz", 9000, None, (0, -2.4, a["ZA"]), (0, 3 * a["SEP"], a["ZA"]), (1.0, 0.60, 0.28), tipo="SPOT", spot_size=rad(3.6), spot_blend=0.12, shadow_soft_size=0.004)
    luz("azul", 70, (0.3, 2.4), (2.2, 0.9, 1.3), (0, 0.3, 0.16), (0.35, 0.52, 1.0)); luz("fria", 85, (2.6, 1.2), (-2.0, -1.6, 2.4), (0, 0.3, 0.1), (0.72, 0.82, 1.0)); luz("fondo", 36, (5, 1.5), (1.2, 1.2, 0.2), (1.5, 4.2, 1.2), (0.25, 0.38, 0.9))
    E["cam"] = nueva_camara(); E["revelado"] = dict(exposicion=0.75, rebotes=(8, 4, 6, 4), resplandor=(2.2, 7, -0.86)); return E
def poner_A(E, p):
    a = A_; t = p.get("t", 1.0)
    for i, r in enumerate(E["placas"]):
        u = sv(i * 0.17, i * 0.17 + 0.46, t); r.location = (a["DX"][i] * (1 - u), i * a["SEP"], 0.0); r.rotation_euler = (0, 0, rad(a["GIRO"][i]) * (1 - u))
    c = p.get("cam", "h0")
    if isinstance(c, str): poner_camara(E["cam"], CAM_A[c])
    else: poner_camara(E["cam"], CAM_A[c[0]], CAM_A[c[1]], sv(0, 1, c[2]))
def anclas_A(E):
    a = A_; sal = {}
    poner_A(E, {"t": 1.0, "cam": "h0"}); sal["0"] = {k: en_foto((0, i * a["SEP"], a["H"] + 0.004)) for i, k in enumerate(("personas", "procesos", "datos", "herramientas"))}
    poner_A(E, {"t": 1.0, "cam": "h6"}); sal["6"] = {"luz": en_foto((0, 0, a["ZA"]))}
    poner_A(E, {"t": 1.0, "cam": "h8"}); y = -a["G"] / 2 - 0.0002; sal["8"] = {"placa": [en_foto(q) for q in ((-0.088, y, 0.118), (0.088, y, 0.118), (0.088, y, 0.068), (-0.088, y, 0.068))]}
    return sal

# ====================================================================== B · la trenza
B_ = dict(RC=0.0052, RH=0.0068, PASO=0.058, LARGO=0.62, P0=Vector((0.0, 0.0, 0.0165)), DIR=Vector((0.36, -0.93, 0.0)).normalized())
SUELTOS = [
  [(0.06, 1.05, 0.006), (0.07, 0.62, 0.006), (0.035, 0.34, 0.030), (0.012, 0.17, 0.046), (-0.004, 0.07, 0.032)],
  [(0.95, 0.72, 0.006), (0.56, 0.46, 0.006), (0.30, 0.31, 0.022), (0.13, 0.17, 0.042), (0.03, 0.07, 0.030)],
  [(0.52, 1.10, 0.006), (0.36, 0.66, 0.006), (0.21, 0.41, 0.030), (0.09, 0.21, 0.052), (0.015, 0.085, 0.034)],
  [(1.15, 0.20, 0.006), (0.66, 0.19, 0.006), (0.38, 0.165, 0.016), (0.17, 0.11, 0.032), (0.04, 0.05, 0.026)],
]
# cuando van sueltos, la punta de cada cabo descansa en la mesa, lejos del aro y de los demás
PUNTAS = [(0.005, 0.250, 0.0056), (0.200, 0.170, 0.0056), (0.105, 0.300, 0.0056), (0.215, 0.050, 0.0056)]
CAM_B = {"h": ((-0.20, -0.66, 0.42), (0.075, 0.035, 0.01), 78, 8, (-0.2, 0.0), (0.011, -0.028, 0.0165)), "h1": ((-0.20, -0.66, 0.46), (0.10, 0.10, 0.01), 66, 9, (-0.2, 0.0), (0.06, 0.14, 0.01))}
def construir_B():
    b = B_; E = {"cabos": []}
    def con_uv(nombre, base, metal, rug, bulto, escala, fuerza, **mas):
        m = material(nombre, base, metal, rug, **mas); nt = m.node_tree; p = nt.nodes["Principled BSDF"]; uv = nt.nodes.new("ShaderNodeTexCoord"); mp = nt.nodes.new("ShaderNodeMapping"); mp.inputs["Scale"].default_value = escala
        nt.links.new(uv.outputs["UV"], mp.inputs["Vector"]); t = bulto(nt); nt.links.new(mp.outputs["Vector"], t.inputs["Vector"]); bb = nt.nodes.new("ShaderNodeBump"); bb.inputs["Strength"].default_value = fuerza; bb.inputs["Distance"].default_value = 0.001
        nt.links.new(t.outputs[0], bb.inputs["Height"]); nt.links.new(bb.outputs["Normal"], p.inputs["Normal"]); return m
    def trenzado(nt): w = nt.nodes.new("ShaderNodeTexVoronoi"); w.inputs["Scale"].default_value = 1.0; return w
    def torcido(nt): w = nt.nodes.new("ShaderNodeTexWave"); w.inputs["Scale"].default_value = 1.0; w.wave_type = "BANDS"; w.bands_direction = "DIAGONAL"; return w
    nailon = con_uv("nailon negro", (0.012, 0.012, 0.014), 0.0, 0.62, trenzado, (1700, 9, 1), 0.9, **{"Specular IOR Level": 0.35})
    cable = con_uv("cable de acero", (0.62, 0.63, 0.65), 1.0, 0.24, torcido, (520, 7, 1), 0.85)
    algodon = con_uv("algodon", (0.82, 0.80, 0.74), 0.0, 0.9, torcido, (430, 3, 1), 0.7, **{"Specular IOR Level": 0.2, "Sheen Weight": 0.6})
    vidrio = material("fibra", (1, 1, 1), 0.0, 0.03, **{"Transmission Weight": 1.0, "IOR": 1.46})
    nucleo = bpy.data.materials.new("nucleo"); nucleo.use_nodes = True; pn = nucleo.node_tree.nodes["Principled BSDF"]; pn.inputs["Base Color"].default_value = (0.02, 0.1, 0.8, 1); pn.inputs["Emission Color"].default_value = (0.03, 0.16, 1.0, 1); pn.inputs["Emission Strength"].default_value = 1.1
    E["mats"] = [nailon, cable, algodon, vidrio]; E["nucleo"] = nucleo
    alu = material("aluminio", (0.80, 0.81, 0.83), 1.0, 0.28, **{"Anisotropic": 0.6})
    me = bpy.data.meshes.new("casquillo"); bm = bmesh.new(); Rext, Rint, L = b["RH"] + b["RC"] + 0.0042, b["RH"] + b["RC"] + 0.0006, 0.022
    perfil = [(Rint, -L / 2), (Rext - 0.0012, -L / 2), (Rext, -L / 2 + 0.0012), (Rext, L / 2 - 0.0012), (Rext - 0.0012, L / 2), (Rint, L / 2)]; SEG = 96
    an = [[bm.verts.new((r * math.cos(2 * math.pi * j / SEG), r * math.sin(2 * math.pi * j / SEG), z)) for (r, z) in perfil] for j in range(SEG)]
    for j in range(SEG):
        for i in range(len(perfil)): bm.faces.new((an[j][i], an[(j + 1) % SEG][i], an[(j + 1) % SEG][(i + 1) % len(perfil)], an[j][(i + 1) % len(perfil)]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:]); bm.to_mesh(me); bm.free(); cq = enlazar(bpy.data.objects.new("casquillo", me)); cq.data.materials.append(alu); me.set_sharp_from_angle(angle=rad(30))
    for q in me.polygons: q.use_smooth = True
    cq.location = b["P0"] + b["DIR"] * 0.012; cq.rotation_euler = b["DIR"].to_track_quat("Z", "Y").to_euler()
    plato((0.80, 0.795, 0.785), 0.55, R=2.0, Y1=2.6, ancho=8); mundo((1, 1, 1), 0.3)
    luz("caja", 34, (0.9, 0.7), (-0.55, -0.15, 0.85), (0.05, 0.05, 0.0)); luz("relleno", 4, (0.8, 0.8), (0.8, -0.5, 0.5), (0.05, 0.05, 0)); luz("contra", 9, (0.9, 0.12), (0.25, 0.85, 0.30), (0.05, 0.1, 0.0))
    E["cam"] = nueva_camara(); E["revelado"] = dict(exposicion=-0.45, rebotes=(10, 4, 6, 10)); return E
def poner_B(E, p):
    """a: -1 = cada cabo por su lado; 0 = las cuatro puntas en la boca del aro; 1 = el cable entero."""
    b = B_; a = p.get("a", 1.0); P0, DIR = b["P0"], b["DIR"]; LAT = Vector((DIR.y, -DIR.x, 0)); ARR = Vector((0, 0, 1))
    for o in E["cabos"]: bpy.data.objects.remove(o)
    E["cabos"] = []
    def helice(k, s, abre=0.0):
        ang = 2 * math.pi * (s / b["PASO"]) + k * math.pi / 2; r = b["RH"] * (1 + abre * 2.6); return P0 + DIR * s + LAT * (r * math.cos(ang)) + ARR * (r * math.sin(ang) - abre * 0.006)
    for k in range(4):
        pts = [Vector(q) for q in SUELTOS[k]]
        if a < 0:
            u = sv(0, 1, -a); pts[3] = pts[3].lerp((pts[2] + Vector(PUNTAS[k])) / 2 + Vector((0, 0, 0.012)), u); pts[4] = pts[4].lerp(Vector(PUNTAS[k]), u)
        else:
            fin = a * b["LARGO"]; n = max(1, int((fin + 0.012) / 0.004)); pts += [helice(k, -0.012 + (fin + 0.012) * i / n) for i in range(n + 1)]
            pts += [helice(k, fin + 0.034 * q, q) for q in (0.25, 0.5, 0.75, 1.0)]     # las puntas, que se abren al final del cable
        cam = [tuple(q) for q in pts]; E["cabos"].append(tubo(f"cabo {k}", cam, b["RC"], E["mats"][k], res=10))
        if k == 3: E["cabos"].append(tubo("alma", cam, b["RC"] * 0.34, E["nucleo"], res=6))
    c = p.get("cam", "h")
    if isinstance(c, str): poner_camara(E["cam"], CAM_B[c])
    else: poner_camara(E["cam"], CAM_B[c[0]], CAM_B[c[1]], sv(0, 1, c[2]))
def anclas_B(E):
    sal = {}; nombres = ("procesos", "herramientas", "personas", "datos")   # nailon, cable de acero, algodón, fibra con el núcleo azul
    poner_B(E, {"a": -1.0, "cam": "h1"}); sal["1"] = {n: en_foto(PUNTAS[k]) for k, n in enumerate(nombres)}
    poner_B(E, {"a": 1.0, "cam": "h"}); sal["2"] = {n: en_foto(Vector(SUELTOS[k][3]).lerp(Vector(SUELTOS[k][4]), 0.5)) for k, n in enumerate(nombres)}; sal["2"]["sistema"] = en_foto(B_["P0"] + B_["DIR"] * 0.16)
    return sal

# ====================================================================== C · la cadena
C_ = dict(W=0.074, T=0.0125, H=0.152, PASO=0.037, N=77)
CAM_C = {"h": ((-0.05, -1.62, 0.30), (0.47, -0.22, 0.062), 62, 6.3, (-0.16, 0.02), None)}
def construir_C():
    c = C_; E = {"losas": []}
    def rumbo(d): return rad(86 - 118 * sv(0.22, 1.25, d) + 52 * sv(1.5, 2.9, d))
    pts, tang = [], []; q = Vector((0.22, -0.36, 0)); d = 0.0
    for i in range(c["N"]):
        h = rumbo(d); t = Vector((math.sin(h), math.cos(h), 0)); pts.append(q.copy()); tang.append(t); q = q + t * c["PASO"]; d += c["PASO"]
    E["pts"], E["tang"] = pts, tang
    def marmol(nombre, base, veta, rug):
        m = material(nombre, base, 0.0, rug, **{"Specular IOR Level": 0.5}); nt = m.node_tree; p = nt.nodes["Principled BSDF"]
        co = nt.nodes.new("ShaderNodeTexCoord"); n1 = nt.nodes.new("ShaderNodeTexNoise"); n1.inputs["Scale"].default_value = 9; n1.inputs["Detail"].default_value = 9; n1.inputs["Roughness"].default_value = 0.62; n1.inputs["Distortion"].default_value = 1.6
        w = nt.nodes.new("ShaderNodeTexWave"); w.inputs["Scale"].default_value = 3.2; w.inputs["Distortion"].default_value = 14; w.inputs["Detail"].default_value = 6; w.inputs["Detail Scale"].default_value = 1.4
        r = nt.nodes.new("ShaderNodeValToRGB"); r.color_ramp.elements[0].position = 0.0; r.color_ramp.elements[0].color = (*veta, 1); r.color_ramp.elements[1].position = 0.22; r.color_ramp.elements[1].color = (*base, 1)
        mp = nt.nodes.new("ShaderNodeMapping"); nt.links.new(co.outputs["Object"], mp.inputs["Vector"]); nt.links.new(mp.outputs["Vector"], w.inputs["Vector"]); nt.links.new(mp.outputs["Vector"], n1.inputs["Vector"])
        mx = nt.nodes.new("ShaderNodeMix"); mx.data_type = "RGBA"; mx.inputs[0].default_value = 0.2; nt.links.new(w.outputs["Fac"], r.inputs["Fac"]); nt.links.new(r.outputs["Color"], mx.inputs[6]); mx.inputs[7].default_value = (*base, 1)
        nt.links.new(n1.outputs["Fac"], mx.inputs[0]); nt.links.new(mx.outputs[2], p.inputs["Base Color"]); p.inputs["Subsurface Weight"].default_value = 0.12; p.inputs["Subsurface Radius"].default_value = (0.004, 0.004, 0.004); return m
    blanco = marmol("marmol", (0.86, 0.855, 0.84), (0.42, 0.43, 0.45), 0.34); negro = material("basalto", (0.022, 0.022, 0.024), 0.0, 0.46, **{"Specular IOR Level": 0.5})
    azul = material("vidrio azul", (0.02, 0.10, 0.85), 0.0, 0.02, **{"Transmission Weight": 1.0, "IOR": 1.5}); vt = azul.node_tree; va = vt.nodes.new("ShaderNodeVolumeAbsorption"); va.inputs["Color"].default_value = (0.03, 0.14, 0.95, 1); va.inputs["Density"].default_value = 60; vt.links.new(va.outputs[0], vt.nodes["Material Output"].inputs["Volume"])
    for i in range(c["N"]): E["losas"].append(prisma(f"losa {i}", c["W"], c["T"], c["H"], r=0.0016, filete=0.0012, mat=azul if i == 0 else negro if i % 6 == 3 else blanco))
    plato((0.56, 0.56, 0.565), 0.42, R=4.5, Y1=9.0); mundo((0.93, 0.95, 1.0), 0.22)
    luz("sol", 900, (1.2, 1.2), (3.4, 2.6, 1.25), (0.5, -0.2, 0.05), (1.0, 0.95, 0.88)); luz("relleno", 30, (3, 2), (-2.5, -2.0, 2.2), (0.3, 0.3, 0.05)); luz("cenital", 60, (3, 3), (0.5, 0.8, 3.2), (0.4, 0.5, 0)); luz("pared", 620, (8, 3), (0.5, 1.0, 5.5), (0.5, 9.0, 2.5))
    E["cam"] = nueva_camara(); E["revelado"] = dict(exposicion=0.15, rebotes=(8, 4, 6, 8)); return E
def inclinaciones(E, frente):
    c = C_; N = c["N"]; ang = [0.0] * N; frente = min(N - 1, frente)
    def toca(th, th2, sep): d = (-sep + c["H"] * math.sin(th), c["H"] * math.cos(th)); return d[0] * math.cos(th2) - d[1] * math.sin(th2)
    for i in range(frente - 1, -1, -1):
        sep = (E["pts"][i + 1] - E["pts"][i]).length; lo, hi = ang[i + 1], rad(89)
        for _ in range(50):
            mid = (lo + hi) / 2
            if toca(mid, ang[i + 1], sep) < -c["T"]: lo = mid
            else: hi = mid
        ang[i] = lo
    if frente >= N - 1: ang[N - 1] = rad(82)
    return ang
def poner_C(E, p):
    c = C_; ang = inclinaciones(E, int(p.get("frente", 10)))
    for i, o in enumerate(E["losas"]):
        t = E["tang"][i]; yaw = math.atan2(t.y, t.x) - math.pi / 2
        o.matrix_world = Matrix.Translation(E["pts"][i] + t * (c["T"] / 2)) @ Matrix.Rotation(yaw, 4, "Z") @ Matrix.Rotation(-ang[i], 4, "X") @ Matrix.Translation((0, -c["T"] / 2, 0))
    cam = list(CAM_C["h"]); cam[5] = tuple(E["pts"][4] + Vector((0, 0, 0.06))); poner_camara(E["cam"], tuple(cam))
def anclas_C(E):
    poner_C(E, {"frente": 10}); c = C_; ang = inclinaciones(E, 10); sal = {}
    for i, n in ((0, "entra"), (3, "registra"), (9, "programa"), (15, "avisa")):   # la de vidrio azul y las tres primeras de basalto
        t = E["tang"][i]; cima = E["pts"][i] + t * (c["T"] / 2) + t * (c["H"] * math.sin(ang[i])) + Vector((0, 0, c["H"] * math.cos(ang[i]))); sal[n] = en_foto(cima)
    return {"3": sal}

# ====================================================================== D · el orden
D_ = dict(RC=0.034, HC=0.012, ZI=0.047)
CAM_D = {"h": ((-0.115, -0.43, 0.235), (0.050, 0.004, 0.012), 85, 9, (-0.3, 0.0), (0, -0.02, 0.02))}
def construir_D():
    E = {"piel": None}
    E["fluido"] = material("ferrofluido", (0.002, 0.002, 0.003), 0.0, 0.04, **{"Specular IOR Level": 0.5, "IOR": 1.5})
    porc = material("porcelana", (0.86, 0.86, 0.85), 0.0, 0.42, **{"Specular IOR Level": 0.4}); po = prisma("plato de porcelana", 0.50, 0.38, 0.004, r=0.16, mat=porc); po.location = (0.07, 0.02, 0.0)
    acero = material("acero", (0.62, 0.63, 0.65), 1.0, 0.22, **{"Anisotropic": 0.5}); anod = material("anodizado azul", (0.01, 0.06, 0.70), 1.0, 0.25)
    E["iman"] = vacio("iman"); i1 = cil("cuerpo", 0.019, 0.022, acero, 128, canto=0.0009); i1.parent = E["iman"]; i1.location = (0, 0, 0.0125); i2 = cil("aro azul", 0.0191, 0.0015, anod, 128); i2.parent = E["iman"]; i2.location = (0, 0, 0.0012)
    plato((0.82, 0.82, 0.82), 0.5, R=2.0, Y1=2.6, ancho=8); mundo((1, 1, 1), 0.16)
    luz("cenital", 46, (0.7, 0.45), (0.10, 0.16, 0.9), (0.03, 0, 0)); luz("lado", 7, (0.6, 0.25), (-0.7, -0.3, 0.25), (0.03, 0, 0.01)); luz("contra", 9, (1.0, 0.1), (0.2, 0.8, 0.22), (0.03, 0, 0.01))
    E["cam"] = nueva_camara(); E["revelado"] = dict(exposicion=0.1, rebotes=(8, 4, 8, 4)); return E
def poner_D(E, p):
    """m: 0 = todo desparramado y el imán lejos; 1 = el imán encima y la corona levantada."""
    d = D_; m = p.get("m", 1.0); RC = d["RC"]; random.seed(11)
    if E["piel"]: bpy.data.objects.remove(E["piel"])
    sube = sv(0.18, 1.0, m); HC = mez(0.0032, d["HC"], sube); bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=64, v_segments=32, radius=1.0)
    for v in bm.verts: v.co = Vector((v.co.x * RC, v.co.y * RC, max(-0.2, v.co.z) * HC))
    paso = 0.0074
    if sube > 0.02:
        for i in range(-7, 8):
            for j in range(-7, 8):
                x = (i + 0.5 * (j % 2)) * paso; y = j * paso * 0.866; r = math.hypot(x, y)
                if r > RC * 0.93: continue
                k = 1 - (r / RC) ** 2; llega = sv(0.0, 0.75, sube - (r / RC) * 0.25); alto = 0.0125 * (0.42 + 0.58 * k) * llega
                if alto < 0.0012: continue
                base = paso * 0.50; z0 = HC * math.sqrt(max(0, k)) - 0.002; n = Vector((x / RC * 0.9, y / RC * 0.9, 1)).normalized()
                mm = Matrix.Translation((x, y, z0)) @ n.to_track_quat("Z", "Y").to_matrix().to_4x4() @ Matrix.Translation((0, 0, alto / 2))
                bmesh.ops.create_cone(bm, cap_ends=True, segments=16, radius1=base, radius2=base * 0.05, depth=alto, matrix=mm)
    me = bpy.data.meshes.new("corona"); bm.to_mesh(me); bm.free(); corona = enlazar(bpy.data.objects.new("corona", me))
    mb = bpy.data.metaballs.new("charco"); mb.resolution = 0.0011; mb.render_resolution = 0.0011; mb.threshold = 0.6; om = enlazar(bpy.data.objects.new("charco", mb))
    def bola(x, y, r, aplasta=0.28): e = mb.elements.new(); e.type = "ELLIPSOID"; e.co = (x, y, 0.0); e.radius = r * 2; e.size_x = 1; e.size_y = 1; e.size_z = aplasta
    for _ in range(46):
        an = random.uniform(0, 2 * math.pi); dd = abs(random.gauss(0, 0.022)); bola(0.085 + dd * math.cos(an) * 1.5, 0.004 + dd * math.sin(an), random.uniform(0.006, 0.013))
    for _ in range(34):
        an = random.uniform(-1.2, 1.9); dd = random.uniform(0.045, 0.105); bola(0.075 + dd * math.cos(an), dd * math.sin(an) * 0.8, random.uniform(0.0016, 0.0048), 0.45)
    hilo = sv(0.05, 0.6, m)     # los hilos: lo que el imán va recogiendo del charco
    for t in range(3):
        y0 = (-0.014, 0.004, 0.02)[t]; n = 26
        for k in range(n):
            u = k / (n - 1)
            if u < 1 - hilo: continue
            x = 0.03 + 0.045 * u; y = y0 * u + 0.004 * math.sin(u * 5 + t); bola(x, y, 0.0030 + 0.0028 * abs(u - 0.45), 0.5)
    bpy.context.view_layer.update(); mm = bpy.data.meshes.new_from_object(om.evaluated_get(bpy.context.evaluated_depsgraph_get())); bpy.data.objects.remove(om); charco = enlazar(bpy.data.objects.new("charco", mm))
    bpy.context.view_layer.objects.active = corona
    for o in bpy.context.scene.objects: o.select_set(o in (corona, charco))
    bpy.ops.object.join(); rm = corona.modifiers.new("piel", "REMESH"); rm.mode = "VOXEL"; rm.voxel_size = 0.00042; rm.use_smooth_shade = True; sm = corona.modifiers.new("suave", "SMOOTH"); sm.factor = 0.8; sm.iterations = 7
    bpy.context.view_layer.update(); aplicar(corona, 180); corona.data.materials.append(E["fluido"]); corona.location.z = 0.0041; E["piel"] = corona
    E["iman"].location = (0, 0, d["ZI"] + (1 - sv(0.0, 0.85, m)) * 0.15); poner_camara(E["cam"], CAM_D["h"])
def anclas_D(E):
    poner_D(E, {"m": 1.0}); return {"4": {"entra": en_foto((0.078, 0.004, 0.008)), "sale": en_foto((-0.031, 0.0, 0.017)), "iman": en_foto((0.0, 0.0, D_["ZI"] + 0.026))}}

# ====================================================================== E · la llave
E_ = dict(BW=0.074, BD=0.036, BH=0.060, RP=0.0115, ZP=0.020, XS=[-0.0195, -0.0065, 0.0065, 0.0195], RB=0.0031, LARGO_P=[0.0092, 0.0080, 0.0098, 0.0086], SUELO=0.012)
CAM_E = {"h": ((-0.10, -0.50, 0.085), (0.0275, 0.0, 0.046), 86, 11, (-0.2, 0.0), (0, -0.004, 0.05))}
def construir_E():
    e = E_; BW, BD, BH, RP, ZP, XS, RB = e["BW"], e["BD"], e["BH"], e["RP"], e["ZP"], e["XS"], e["RB"]; CORTE = ZP + RP; E = {"muelles": []}
    acr = material("metacrilato", (1, 1, 1), 0.0, 0.0, **{"Transmission Weight": 1.0, "IOR": 1.49, "Specular IOR Level": 0.5})
    acero = material("acero", (0.42, 0.43, 0.45), 1.0, 0.34, **{"Anisotropic": 0.4}); acero_o = material("acero oscuro", (0.16, 0.165, 0.175), 1.0, 0.28); E["acero_p"] = acero_p = material("acero pulido", (0.70, 0.71, 0.73), 1.0, 0.10)
    laton = material("laton", (0.78, 0.55, 0.24), 1.0, 0.20); esmalte = material("esmalte", (0.012, 0.07, 0.72), 0.0, 0.08, **{"Coat Weight": 1.0})
    raiz = vacio("todo"); raiz.location = (0, 0, e["SUELO"]); E["raiz"] = raiz; giro = vacio("giro", raiz); giro.location = (0, 0, ZP); E["giro"] = giro
    bloque = prisma("bloque", BW, BD, BH, r=0.003); huecos = []
    def taladro(o): m = bloque.modifiers.new("t", "BOOLEAN"); m.object = o; m.operation = "DIFFERENCE"; m.solver = "EXACT"; huecos.append(o)
    h = cil("h rotor", RP + 0.00015, BW + 0.02, None, 64); h.rotation_euler = (0, rad(90), 0); h.location = (0, 0, ZP); taladro(h)
    for x in XS: h = cil("h perno", RB, BH - CORTE + 0.004, None, 32); h.location = (x, 0, CORTE - 0.004 + (BH - CORTE + 0.004) / 2); taladro(h)
    bpy.context.view_layer.update(); aplicar(bloque, 30)
    for h in huecos: bpy.data.objects.remove(h)
    b = bloque.modifiers.new("canto", "BEVEL"); b.width = 0.0009; b.segments = 3; b.limit_method = "ANGLE"; b.angle_limit = rad(50); aplicar(bloque, 30); bloque.data.materials.append(acr); bloque.parent = raiz
    rotor = cil("rotor", RP, BW + 0.004, None, 96); rotor.rotation_euler = (0, rad(90), 0); rotor.location = (0.002, 0, ZP); cortes = []
    for x in XS: c = cil("a", RB, RP + 0.002, None, 32); c.location = (x, 0, ZP + RP / 2 + 0.0005); m = rotor.modifiers.new("a", "BOOLEAN"); m.object = c; m.operation = "DIFFERENCE"; m.solver = "EXACT"; cortes.append(c)
    ran = prisma("ranura", BW + 0.02, 0.0024, 0.0155); ran.location = (0, 0, ZP - 0.0085); m = rotor.modifiers.new("r", "BOOLEAN"); m.object = ran; m.operation = "DIFFERENCE"; m.solver = "EXACT"; cortes.append(ran)
    med = prisma("mitad", BW + 0.03, 0.03, 0.06); med.location = (0, -0.015, 0); m = rotor.modifiers.new("m", "BOOLEAN"); m.object = med; m.operation = "DIFFERENCE"; m.solver = "EXACT"; cortes.append(med)
    bpy.context.view_layer.update(); aplicar(rotor, 30)
    for c in cortes: bpy.data.objects.remove(c)
    rotor.data.materials.append(acero); rotor.parent = giro; rotor.location.z -= ZP
    frente = cil("frente", RP + 0.0022, 0.0022, acero_p, 96); frente.rotation_euler = (0, rad(90), 0); frente.location = (BW / 2 + 0.0031, 0, 0); frente.parent = giro
    E["pernos"], E["contras"] = [], []
    for i, x in enumerate(XS):
        L = e["LARGO_P"][i]; pr = vacio(f"perno {i}", giro); c1 = cil("cuerpo", RB - 0.0002, L - 0.0012, laton, 32); c1.parent = pr; c1.location = (0, 0, 0.0012 + (L - 0.0012) / 2); c2 = cil("punta", RB - 0.0002, 0.0012, laton, 32, cono=0.0009); c2.parent = pr; c2.location = (0, 0, 0.0006); E["pernos"].append(pr)
        cp = cil(f"contra {i}", RB - 0.0002, 0.0058, acero_o, 32); cp.parent = raiz; E["contras"].append(cp)
        ta = cil(f"tapon {i}", RB + 0.0002, 0.004, laton, 32); ta.parent = raiz; ta.location = (x, 0, BH - 0.004)
    # la llave: el perfil de arriba lleva un corte para cada perno, a la altura exacta que lo deja en la línea de corte
    zb = ZP - 0.0085 + 0.0006; XH = BW / 2 + 0.004; cuts = [(XS[i] - XH, CORTE - e["LARGO_P"][i]) for i in range(4)]; perfil = [(cuts[0][0] - 0.0105, zb + 0.0035), (cuts[0][0] - 0.0052, cuts[0][1] + 0.0020)]
    for i, (xc, zc) in enumerate(cuts):
        perfil += [(xc - 0.0011, zc), (xc + 0.0011, zc)]
        if i < 3: perfil.append(((xc + cuts[i + 1][0]) / 2, max(zc, cuts[i + 1][1]) + 0.0022))
    perfil += [(cuts[3][0] + 0.0040, cuts[3][1] + 0.0022), (0.0, cuts[3][1] + 0.0022)]; E["perfil"] = perfil; E["zb"] = zb; E["XH"] = XH
    llave = vacio("llave", giro); E["llave"] = llave; me = bpy.data.meshes.new("hoja"); bm = bmesh.new(); XF = 0.030
    cont = [(x, z - ZP) for x, z in perfil] + [(XF, perfil[-1][1] - ZP), (XF, zb - ZP), (perfil[0][0], zb - ZP)]
    vs = [bm.verts.new((x, -0.001, z)) for x, z in cont]; f = bm.faces.new(vs); r = bmesh.ops.extrude_face_region(bm, geom=[f]); bmesh.ops.translate(bm, verts=[v for v in r["geom"] if isinstance(v, bmesh.types.BMVert)], vec=(0, 0.002, 0)); bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    bm.to_mesh(me); bm.free(); hoja = enlazar(bpy.data.objects.new("hoja", me)); hoja.data.materials.append(acero_p); bb = hoja.modifiers.new("canto", "BEVEL"); bb.width = 0.00022; bb.segments = 2; aplicar(hoja, 30); hoja.parent = llave
    zc = (perfil[-1][1] + zb) / 2 - ZP; cab = cil("cabeza", 0.0135, 0.0024, None, 96); cab.rotation_euler = (rad(90), 0, 0); cab.location = (XF + 0.011, 0, zc)
    ojo = cil("ojo", 0.0030, 0.01, None, 32); ojo.rotation_euler = (rad(90), 0, 0); ojo.location = (XF + 0.019, 0, zc); m = cab.modifiers.new("o", "BOOLEAN"); m.object = ojo; m.operation = "DIFFERENCE"; m.solver = "EXACT"; bpy.context.view_layer.update(); aplicar(cab, 30); bpy.data.objects.remove(ojo)
    bc = cab.modifiers.new("canto", "BEVEL"); bc.width = 0.0005; bc.segments = 3; bc.limit_method = "ANGLE"; bc.angle_limit = rad(50); aplicar(cab, 30); cab.data.materials.append(acero_p); cab.parent = llave
    for s in (-1, 1): pt = cil("punto", 0.0042, 0.0003, esmalte, 48); pt.rotation_euler = (rad(90), 0, 0); pt.location = (XF + 0.0085, s * 0.00125, zc); pt.parent = llave
    # la peana: la cerradura de muestra descansa sobre una base negra, no flota
    peana = prisma("peana", BW + 0.014, BD + 0.014, e["SUELO"], r=0.002, filete=0.0008, mat=material("peana", (0.018, 0.018, 0.02), 0.0, 0.42, **{"Specular IOR Level": 0.5}))
    plato(E_.get("PLATO", (0.80, 0.795, 0.785)), 0.5, R=2.2, Y1=2.5, ancho=6); mundo((1, 1, 1), E_.get("MUNDO", 0.20))
    luz("caja", 7, (0.5, 0.36), (0.26, -0.22, 0.42), (0, 0, 0.04)); luz("contra", 10, (0.5, 0.06), (-0.1, 0.40, 0.22), (0, 0, 0.04)); luz("lado", 3.5, (0.06, 0.4), (-0.45, -0.20, 0.10), (0, 0, 0.04)); luz("fondo", E_.get("FONDO", 70), (2.4, 0.8), (0.3, 0.2, 1.6), (0.3, 2.5, 0.9))
    E["cam"] = nueva_camara(); E["revelado"] = dict(exposicion=0.0, rebotes=(16, 4, 8, 16)); return E
def poner_E(E, p):
    """k: 0 = la llave fuera; 1 = dentro del todo, los cuatro pernos en línea; de 1 a 1,25 gira."""
    e = E_; k = p.get("k", 0.0); ZP, RP, XS, BH = e["ZP"], e["RP"], e["XS"], e["BH"]; CORTE = ZP + RP; perfil = E["perfil"]; XH = E["XH"]
    carrera = -perfil[0][0] + 0.006; dx = (1 - min(1.0, k)) * carrera; E["llave"].location = (XH + dx, 0, 0)
    def altura(xk):     # el perfil de arriba de la llave en un punto de su hoja
        if xk < perfil[0][0] or xk > perfil[-1][0]: return -1.0
        for (x0, z0), (x1, z1) in zip(perfil, perfil[1:]):
            if x0 <= xk <= x1: return z0 + (z1 - z0) * (xk - x0) / max(1e-9, x1 - x0)
        return -1.0
    REPOSO = ZP - 0.0005 + 0.0002
    for o in E["muelles"]: bpy.data.objects.remove(o)
    E["muelles"] = []
    for i, x in enumerate(XS):
        base = max(REPOSO, max(altura(x - XH - dx + d) for d in (-0.0009, 0.0, 0.0009))); cima = base + e["LARGO_P"][i]
        E["pernos"][i].location = (x, 0, base - ZP); zc = max(cima, CORTE) if k >= 1.0 else cima; E["contras"][i].location = (x, 0, zc + 0.0029 + 0.00012)
        z0, z1 = zc + 0.0060, BH - 0.0062; n = 7 * 16; r = 0.0023
        mu = tubo(f"muelle {i}", [(x + r * math.cos(2 * math.pi * j / 16), r * math.sin(2 * math.pi * j / 16), z0 + (z1 - z0) * j / n) for j in range(n + 1)], 0.00034, E["acero_p"], res=4); mu.parent = E["raiz"]; E["muelles"].append(mu)
    E["giro"].rotation_euler = (rad(64) * sv(1.0, 1.25, k), 0, 0); poner_camara(E["cam"], CAM_E["h"])
def anclas_E(E):
    poner_E(E, {"k": 0.0}); e = E_; return {"5": {n: en_foto((e["XS"][i], 0, e["SUELO"] + e["BH"] + 0.0035)) for i, n in enumerate(("proveedor", "importe", "iva", "vencimiento"))}}

ESCENAS = {"A": (construir_A, poner_A, anclas_A), "B": (construir_B, poner_B, anclas_B), "C": (construir_C, poner_C, anclas_C), "D": (construir_D, poner_D, anclas_D), "E": (construir_E, poner_E, anclas_E)}

def ajustar(res, spp, exposicion=0.0, rebotes=(8, 4, 6, 8), resplandor=None):
    S = bpy.context.scene; S.render.engine = "CYCLES"; cy = S.cycles; cy.device = "CPU"; cy.samples = spp; cy.use_adaptive_sampling = True; cy.adaptive_threshold = 0.015; cy.use_denoising = True
    try: cy.denoiser = "OPENIMAGEDENOISE"
    except Exception: pass
    cy.max_bounces, cy.diffuse_bounces, cy.glossy_bounces, cy.transmission_bounces = rebotes; cy.transparent_max_bounces = 12; cy.caustics_reflective = False; cy.caustics_refractive = False; cy.sample_clamp_indirect = 8.0
    S.render.resolution_x, S.render.resolution_y = res; S.render.resolution_percentage = 100; S.render.image_settings.file_format = "PNG"; S.render.image_settings.color_mode = "RGB"
    S.view_settings.view_transform = "AgX"; S.view_settings.look = "AgX - Medium High Contrast"; S.view_settings.exposure = exposicion; cy.filter_width = 1.4
    if resplandor and not (S.node_tree and S.node_tree.nodes.get("resplandor")):
        S.use_nodes = True; nt = S.node_tree; rl = nt.nodes.get("Render Layers") or nt.nodes.new("CompositorNodeRLayers"); co = nt.nodes.get("Composite") or nt.nodes.new("CompositorNodeComposite")
        g = nt.nodes.new("CompositorNodeGlare"); g.name = "resplandor"; g.glare_type = "FOG_GLOW"; g.quality = "HIGH"; g.threshold = resplandor[0]; g.size = resplandor[1]; g.mix = resplandor[2]; nt.links.new(rl.outputs["Image"], g.inputs[0]); nt.links.new(g.outputs[0], co.inputs[0])

if __name__ == "__main__":
    a = sys.argv[1:]; op = {a[i][2:]: (a[i + 1] if i + 1 < len(a) and not a[i + 1].startswith("--") else True) for i in range(len(a)) if a[i].startswith("--")}
    if "anclas" in op:
        sal = {}
        for n, (construir, poner, anclas) in ESCENAS.items():
            limpiar(); E = construir(); ajustar((1920, 1080), 1); sal.update(anclas(E))
        json.dump(sal, open(op["anclas"], "w"), indent=1); print(json.dumps(sal)); sys.exit(0)
    if "ajuste" in op: E_.update(json.loads(op["ajuste"]))   # para probar otro fondo en la escena de la llave
    if "lote" in op: tareas = json.load(open(op["lote"]))
    else: r = op.get("res", "960x540").split("x"); tareas = [{"e": op["e"], "p": json.loads(op.get("p", "{}")), "f": op.get("salida", "foto.png"), "res": [int(r[0]), int(r[1])], "spp": int(op.get("spp", 24))}]
    tareas = [t for t in tareas if not os.path.exists(t["f"])]
    for n in sorted({t["e"] for t in tareas}, key=lambda x: [t["e"] for t in tareas].index(x)):
        limpiar(); construir, poner, _ = ESCENAS[n]; E = construir()
        for t in [t for t in tareas if t["e"] == n]:
            if os.path.exists(t["f"]): continue
            t0 = time.time(); ajustar(tuple(t["res"]), t["spp"], **E["revelado"]); poner(E, t["p"]); bpy.context.scene.render.filepath = t["f"]; bpy.ops.render.render(write_still=True); print(f"HECHO {n} {json.dumps(t['p'])} {os.path.basename(t['f'])} {time.time() - t0:.0f}s", flush=True)
