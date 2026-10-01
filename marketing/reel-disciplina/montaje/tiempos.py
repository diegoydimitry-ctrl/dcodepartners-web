# Estimación de tiempos de la locución (ElevenLabs turbo v2.5, 73,51 s; habla 73,23 s).
# Modelo: sílabas*k + pausas. Anclado al principio y al final; error esperado ~±0,5 s.
L = [  # (texto, sílabas, pausas internas en s)
 ("Cada vez que dices «mañana empiezo»… estás entrenando algo.", 20, 0.45),
 ("Y cada vez se te da mejor.", 9, 0),
 ("El problema no es que te falte motivación.", 14, 0),
 ("Es que cada día abres una negociación contigo mismo.", 19, 0),
 ("«Hoy estoy cansado.» «Esta semana ha sido mala.» «Empiezo el lunes.»", 22, 0.9),
 ("Y esa negociación… la pierdes casi siempre.", 14, 0.45),
 ("La gente constante tampoco tiene ganas.", 13, 0),
 ("La diferencia es que no decide en el momento.", 16, 0),
 ("Lo decidió antes.", 6, 0),
 ("Montando mi empresa, esto es lo que más me ha servido: una frase.", 22, 0.6),
 ("«Cuando pase esto, hago esto.»", 10, 0.25),
 ("Cuando cierro el portátil, me pongo las zapatillas.", 16, 0.25),
 ("Cuando llego, lo primero es la tarea difícil.", 16, 0.25),
 ("Que sea tan pequeño que no se pueda negociar.", 15, 0),
 ("Y si un día fallas, vale.", 9, 0.25),
 ("Pero nunca dos seguidos.", 8, 0),
 ("Nadie va a aplaudir las promesas que te cumples a ti mismo.", 19, 0),
 ("Pero son las únicas que te cambian.", 11, 0),
]
T0, T1, K = 0.12, 73.35, 0.19
S = sum(s for _, s, _ in L); I = sum(i for *_, i in L)
P = (T1 - T0 - S * K - I) / (len(L) - 1)
t = T0; out = []
for i, (txt, s, ip) in enumerate(L):
    d = s * K + ip; out.append((t, t + d, txt)); t += d + P
print(f"pausa entre frases ≈ {P:.2f} s")
for a, b, x in out: print(f"{a:6.2f} {b:6.2f}  {x}")
