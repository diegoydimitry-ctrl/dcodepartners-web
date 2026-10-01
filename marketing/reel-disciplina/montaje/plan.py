# Montaje del Reel «Deja de negociar contigo» — páginas (escenas), textos y planos.
# Cada página = un vídeo de segmento (composición ElevenLabs, planos recortados) + texto en Canva.
# La voz va entera en la mezcla final, desplazada VOZ_OFFSET s.
import json
VOZ_OFFSET = 0.5
A = {  # letra: (asset_id ElevenLabs, id Pexels, descripción)
 "A": ("ah9xMtlWyU9cl49A4HYY", 19539315, "hombre corriendo bajo la lluvia"),
 "B": ("mAnmSJBEaL240mtvJMOm", 9615482, "alarma"),
 "C": ("xJJjBUjBssnQQWaPE1aP", 8810536, "alarma"),
 "D": ("8edMMbw0Hyq0pN7d3WQn", 8070886, "móvil de noche"),
 "E": ("ge1Wt4axN46yETReo501", 9902443, "hombre sentado en la cama"),
 "F": ("o232K9VKpe5q7F5GsaWN", 854403, "reloj despertador"),
 "G": ("XuJKazyKKBiYqLERkNph", 4069295, "portátil de noche"),
 "H": ("NXwFUIpCLdjDicfd1Lrp", 7942761, "móvil"),
 "I": ("O0p4fie3MEgt2GxVP70N", 7279032, "hombre en la cama"),
 "J": ("Jj7HCvQj2CvdSJXZpUH6", 4052920, "alarma"),
 "K": ("tlIqSY0c2S77Tz1ocRZv", 6269163, "cierra el portátil"),
 "L": ("L4raG6UFuyei4ZPfkoAR", 9615481, "móvil en la cama"),
 "M": ("Z7gWM1jPtnv1fmb3HNoY", 7698695, "hombre frustrado en la cama"),
 "N": ("47OJCng9LRdUQAvGqFW9", 9615647, "se despierta y se sienta"),
 "O": ("CpwBmf7JurCut1kea519", 9902447, "abre la ventana"),
 "P": ("kbQI476BEB4ZBR135lu1", 8533112, "ata los cordones"),
 "Q": ("zKUEOcaIt8iNw7krvJNz", 15019286, "camina de noche"),
 "R": ("7WBS2RRllK8jbro66uEB", 5310962, "corre por la calle"),
 "S": ("jHHptN03nZyYIEVrGSC6", 9558853, "teclea en el portátil"),
 "T": ("thQVNGAbLIuzAKEMC7E8", 7597168, "escribe una lista"),
 "U": ("HJmMWTcnRrRZ8clIHWjG", 7062381, "camina por la calle de noche"),
 "V": ("IMbuGr7vZnhXtTWQc5Wy", 32082737, "completa una checklist"),
 "W": ("AUHTB4u3O7KAYefPTAzN", 4113236, "cierra el portátil"),
 "X": ("AqtGdws9Rf95CwhnZGKX", 8995265, "se pone las zapatillas"),
 "Y": ("s3O36MabbqMRFArfl2g3", 4351798, "teclado de cerca"),
 "Z": ("VgBHGFphDSPCKl5UgzqT", 16538871, "llega caminando"),
 "AA": ("KipbVWSe2gb4bl16SzbA", 6326807, "ata la zapatilla"),
 "AB": ("LMnOcnGmi4A43uTxBr6V", 9778003, "peso muerto"),
 "AC": ("Ya70lqqIA3fEXdbSDix1", 16125447, "cansado tras entrenar"),
 "AD": ("MxvzKKV3fjuPgHXz10MO", 31990878, "corre al amanecer"),
 "AE": ("B2YPVRqddz6JS0rXxDYi", 33498429, "camina solo al amanecer"),
 "AF": ("e5JvZPC1Tr4msN9nX4iq", 14180867, "entrena"),
 "AG": ("FFUfwYnHuLCIMvTXlSmC", 31993283, "silueta al amanecer"),
 "AH": ("ehraWOV3iprJuVnzvfdP", 15308529, "camino"),
}
# Descartados tras revisar los planos: P (logo de Nike visible) y U (encuadre confuso).
# (inicio, fin, [planos], texto grande, texto pequeño)   *palabra* = destacada
P = [
 (0.00, 2.40, ["A"], "NO TE FALTA *MOTIVACIÓN.*", "Cada vez que dices «mañana empiezo»…"),
 (2.40, 5.47, ["B", "C"], "TE SOBRA *NEGOCIACIÓN* CONTIGO MISMO.", "…estás entrenando algo."),
 (5.47, 8.40, ["D"], "Y cada vez se te da *mejor.*", ""),
 (8.40, 12.27, ["E", "F"], "El problema no es que te falte *motivación.*", ""),
 (12.27, 17.09, ["G", "H"], "Es que cada día abres una *negociación* contigo mismo.", ""),
 (17.09, 19.06, ["I"], "«Hoy estoy *cansado.*»", ""),
 (19.06, 21.41, ["J"], "«Esta semana ha sido *mala.*»", ""),
 (21.41, 23.39, ["K"], "«Empiezo el *lunes.*»", ""),
 (23.39, 27.71, ["L", "M"], "Y esa negociación… la *pierdes* casi siempre.", ""),
 (27.71, 31.40, ["N", "O"], "La gente constante tampoco tiene *ganas.*", ""),
 (31.40, 35.65, ["Q"], "La diferencia es que no decide *en el momento.*", ""),
 (35.65, 38.00, ["R"], "Lo decidió *antes.*", ""),
 (38.00, 44.00, ["S", "T"], "Montando mi empresa, esto es lo que más me ha servido: *una frase.*", "Madrid · construyendo D-Code"),
 (44.00, 47.35, ["V"], "CUANDO *X* → HAGO *Y*", "«Cuando pase esto, hago esto.»"),
 (47.35, 51.86, ["W", "X"], "Cuando cierro el portátil → me pongo las *zapatillas.*", ""),
 (51.86, 56.36, ["Z", "Y"], "Cuando llego → lo primero, la tarea *difícil.*", ""),
 (56.36, 60.42, ["AA", "AB"], "Que sea tan pequeño que no se pueda *negociar.*", ""),
 (60.42, 63.60, ["AC"], "SI FALLAS UN DÍA, *VALE.*", ""),
 (63.60, 66.33, ["AD"], "NUNCA *DOS* SEGUIDOS.", ""),
 (66.33, 71.15, ["AE", "AF"], "Nadie va a aplaudir las promesas que te cumples a ti *mismo.*", ""),
 (71.15, 74.30, ["AG"], "Pero son las únicas que te *cambian.*", ""),
 (74.30, 78.00, ["AH"], "CUMPLE LAS PROMESAS *QUE NADIE VE.*", ""),
]
def composicion(p):
    a, b, planos, *_ = p; d = round(b - a, 3); n = len(planos); clips = []
    for i, k in enumerate(planos):
        dur = round(d / n, 3) if i < n - 1 else round(d - round(d / n, 3) * (n - 1), 3)
        clips.append({"modality": "video", "gap_before": 0, "trim_in": 1.0, "trim_out": round(1.0 + dur, 3),
                      "source": {"content_asset_id": A[k][0]}})
    return {"tracks": [{"clips": clips, "volume": 0, "mute": True}]}
if __name__ == "__main__":
    for i, p in enumerate(P, 1):
        print(i, json.dumps(composicion(p)))
