import sys, os
from PIL import Image, ImageOps, ImageEnhance
R='/home/claude/boadilla/raw/'; S='/home/claude/boadilla/sitio/'
def out(src, dst, widths=(640,1280,1920), q=78, enh=None, crop=None, rot=0):
    im=ImageOps.exif_transpose(Image.open(R+src)).convert('RGB')
    if rot: im=im.rotate(rot, resample=Image.BICUBIC, expand=False)
    if crop:
        w,h=im.size; l,t,r,b=crop; im=im.crop((int(l*w),int(t*h),int(r*w),int(b*h)))
    if enh: im=enh(im)
    res=[]
    ws=sorted(set(min(W,im.width) for W in widths))
    for w in ws:
        x=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
        p=f'{S}{dst}-{w}.webp'; x.save(p,'WEBP',quality=q,method=6); res.append((w,x.height,os.path.getsize(p)))
    print(dst, im.size, res)
def mont(im):
    im=ImageOps.autocontrast(im,cutoff=1); im=ImageEnhance.Color(im).enhance(1.12); return ImageEnhance.Contrast(im).enhance(1.05)
site=sys.argv[1]
if site=='lq':
    L=[('bdl-lq-074.jpg','jardin'),('bdl-lq-002.jpg','carpa'),('bdl-lq-089.jpg','atardecer'),('bdl-lq-021.jpg','noche'),('bdl-lq-013.jpg','mesa-larga'),
       ('bdl-lq-000.jpg','salon'),('bdl-lq-001.jpg','coctel-jardin'),('bdl-lq-016.jpg','huerta'),('bdl-lq-017.jpg','emplatado'),('bdl-lq-007.jpg','solomillo'),
       ('bdl-lq-081.jpg','plato-caldo'),('bdl-lq-073.jpg','jamon'),('bdl-lq-088.jpg','rincon'),('bdl-lq-103.jpg','paella'),('bdl-lq-004.jpg','velas'),
       ('bdl-lq-058.jpg','velas-mesa'),('bdl-lq-100.jpg','noche-jardin'),('bdl-lq-029.jpg','pergola'),('bdl-lq-080.jpg','abedules'),('bdl-lq-041.jpg','bogavante'),
       ('bdl-lq-009.jpg','bocados'),('bdl-lq-031.jpg','postre'),('bdl-lq-033.jpg','coctel'),('bdl-lq-005.jpg','quesos'),('bdl-lq-057.jpg','entrada'),('bdl-lq-012.jpg','salon-palacio'),('bdl-lq-060.jpg','mesa-cesped'),('bdl-lq-064.jpg','limonada')]
    for s,d in L: out(s,'la-quinta/img/'+d)
elif site=='mo':
    L=[('bdl-mo-002.jpg','chupitos'),('bdl-mo-004.jpg','wraps'),('bdl-mo-008.jpg','brochetas-rollitos'),('bdl-mo-009.jpg','tostas-burrata'),('bdl-mo-012.jpg','rollitos'),
       ('bdl-mo-014.jpg','roast-beef'),('bdl-mo-016.jpg','vasitos'),('bdl-mo-017.jpg','caprese'),('bdl-mo-018.jpg','tartar'),('bdl-mo-021.jpg','brochetas'),
       ('bdl-mo-022.jpg','hojaldres'),('bdl-mo-023.jpg','galletas'),('bdl-mo-024.jpg','bao'),('bdl-mo-026.jpg','brazo'),('bdl-mo-027.jpg','postre-oreo'),
       ('bdl-mo-028.jpg','zumos'),('bdl-mo-029.jpg','burger-negra'),('bdl-mo-030.jpg','brownies'),('bdl-mo-031.jpg','coffee-break'),('bdl-mo-003.jpg','zumos-hielo'),
       ('bdl-mo-005.jpg','mesa-cafe'),('bdl-mo-013.jpg','ensaladas'),('bdl-mo-001.jpg','dulces'),('bdl-mo-025.jpg','bandeja')]
    for s,d in L: out(s,'montejo/img/'+d,enh=mont)
elif site=='lb':
    L=[('bdl-lb-003.jpg','barra'),('bdl-lb-025.jpg','espresso'),('bdl-lb-004.jpg','iced-latte'),('bdl-lb-023.jpg','terraza'),('bdl-lb-050.jpg','fachada'),
       ('bdl-lb-013.jpg','capuchino'),('bdl-lb-018.jpg','matcha-iced'),('bdl-lb-022.jpg','matcha'),('bdl-lb-029.jpg','matcha-latte'),('bdl-lb-030.jpg','cortado-hielo'),
       ('bdl-lb-031.jpg','tostada-salmon'),('bdl-lb-038.jpg','tostada-salmon-2'),('bdl-lb-008.jpg','tostada-jamon'),('bdl-lb-017.jpg','tostada-huevo'),('bdl-lb-021.jpg','yogur'),
       ('bdl-lb-000.jpg','poke'),('bdl-lb-024.jpg','sushi-tabla'),('bdl-lb-044.jpg','sushi-salmon'),('bdl-lb-005.jpg','sushi-bandeja'),('bdl-lb-039.jpg','sushi-mesa'),
       ('bdl-lb-007.jpg','cinnamon'),('bdl-lb-047.jpg','cookies'),('bdl-lb-009.jpg','vitrina'),('bdl-lb-045.jpg','vitrina-singluten'),('bdl-lb-015.jpg','smoothie'),
       ('bdl-lb-014.jpg','cafe-bolsa'),('bdl-lb-032.jpg','cafe-especialidad'),('bdl-lb-034.jpg','sala'),('bdl-lb-041.jpg','merienda'),('bdl-lb-028.jpg','desayuno'),('bdl-lb-048.jpg','cartel-sushi'),('bdl-lb-036.jpg','tostada-tomate')]
    for s,d in L: out(s,'la-base/img/'+d)
