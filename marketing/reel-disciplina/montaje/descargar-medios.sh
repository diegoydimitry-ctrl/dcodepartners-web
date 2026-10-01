# Descarga de medios (ejecutar donde haya acceso a Pexels; no en el contenedor)
set -e
mkdir -p medios/clips
# voz: URL firmada vigente de ElevenLabs (flujo XPcsMV0rZ6YsBwA55Z2h, generación TSw8hiJUyDPmlWWuGvsE) como $1
[ -n "$1" ] && curl -fsSL -o medios/voz.mp3 "$1"
curl -fsSL -A "Mozilla/5.0" -o medios/clips/A.mp4 "https://www.pexels.com/download/video/19539315/"   # hombre corriendo bajo la lluvia
curl -fsSL -A "Mozilla/5.0" -o medios/clips/B.mp4 "https://www.pexels.com/download/video/9615482/"   # alarma
curl -fsSL -A "Mozilla/5.0" -o medios/clips/C.mp4 "https://www.pexels.com/download/video/8810536/"   # alarma
curl -fsSL -A "Mozilla/5.0" -o medios/clips/D.mp4 "https://www.pexels.com/download/video/8070886/"   # móvil de noche
curl -fsSL -A "Mozilla/5.0" -o medios/clips/E.mp4 "https://www.pexels.com/download/video/9902443/"   # hombre sentado en la cama
curl -fsSL -A "Mozilla/5.0" -o medios/clips/F.mp4 "https://www.pexels.com/download/video/854403/"   # reloj despertador
curl -fsSL -A "Mozilla/5.0" -o medios/clips/G.mp4 "https://www.pexels.com/download/video/4069295/"   # portátil de noche
curl -fsSL -A "Mozilla/5.0" -o medios/clips/H.mp4 "https://www.pexels.com/download/video/7942761/"   # móvil
curl -fsSL -A "Mozilla/5.0" -o medios/clips/I.mp4 "https://www.pexels.com/download/video/7279032/"   # hombre en la cama
curl -fsSL -A "Mozilla/5.0" -o medios/clips/J.mp4 "https://www.pexels.com/download/video/4052920/"   # alarma
curl -fsSL -A "Mozilla/5.0" -o medios/clips/K.mp4 "https://www.pexels.com/download/video/6269163/"   # cierra el portátil
curl -fsSL -A "Mozilla/5.0" -o medios/clips/L.mp4 "https://www.pexels.com/download/video/9615481/"   # móvil en la cama
curl -fsSL -A "Mozilla/5.0" -o medios/clips/M.mp4 "https://www.pexels.com/download/video/7698695/"   # hombre frustrado en la cama
curl -fsSL -A "Mozilla/5.0" -o medios/clips/N.mp4 "https://www.pexels.com/download/video/9615647/"   # se despierta y se sienta
curl -fsSL -A "Mozilla/5.0" -o medios/clips/O.mp4 "https://www.pexels.com/download/video/9902447/"   # abre la ventana
curl -fsSL -A "Mozilla/5.0" -o medios/clips/P.mp4 "https://www.pexels.com/download/video/8533112/"   # ata los cordones
curl -fsSL -A "Mozilla/5.0" -o medios/clips/Q.mp4 "https://www.pexels.com/download/video/15019286/"   # camina de noche
curl -fsSL -A "Mozilla/5.0" -o medios/clips/R.mp4 "https://www.pexels.com/download/video/5310962/"   # corre por la calle
curl -fsSL -A "Mozilla/5.0" -o medios/clips/S.mp4 "https://www.pexels.com/download/video/9558853/"   # teclea en el portátil
curl -fsSL -A "Mozilla/5.0" -o medios/clips/T.mp4 "https://www.pexels.com/download/video/7597168/"   # escribe una lista
curl -fsSL -A "Mozilla/5.0" -o medios/clips/U.mp4 "https://www.pexels.com/download/video/7062381/"   # camina por la calle de noche
curl -fsSL -A "Mozilla/5.0" -o medios/clips/V.mp4 "https://www.pexels.com/download/video/32082737/"   # completa una checklist
curl -fsSL -A "Mozilla/5.0" -o medios/clips/W.mp4 "https://www.pexels.com/download/video/4113236/"   # cierra el portátil
curl -fsSL -A "Mozilla/5.0" -o medios/clips/X.mp4 "https://www.pexels.com/download/video/8995265/"   # se pone las zapatillas
curl -fsSL -A "Mozilla/5.0" -o medios/clips/Y.mp4 "https://www.pexels.com/download/video/4351798/"   # teclado de cerca
curl -fsSL -A "Mozilla/5.0" -o medios/clips/Z.mp4 "https://www.pexels.com/download/video/16538871/"   # llega caminando
curl -fsSL -A "Mozilla/5.0" -o medios/clips/AA.mp4 "https://www.pexels.com/download/video/6326807/"   # ata la zapatilla
curl -fsSL -A "Mozilla/5.0" -o medios/clips/AB.mp4 "https://www.pexels.com/download/video/9778003/"   # peso muerto
curl -fsSL -A "Mozilla/5.0" -o medios/clips/AC.mp4 "https://www.pexels.com/download/video/16125447/"   # cansado tras entrenar
curl -fsSL -A "Mozilla/5.0" -o medios/clips/AD.mp4 "https://www.pexels.com/download/video/31990878/"   # corre al amanecer
curl -fsSL -A "Mozilla/5.0" -o medios/clips/AE.mp4 "https://www.pexels.com/download/video/33498429/"   # camina solo al amanecer
curl -fsSL -A "Mozilla/5.0" -o medios/clips/AF.mp4 "https://www.pexels.com/download/video/14180867/"   # entrena
curl -fsSL -A "Mozilla/5.0" -o medios/clips/AG.mp4 "https://www.pexels.com/download/video/31993283/"   # silueta al amanecer
curl -fsSL -A "Mozilla/5.0" -o medios/clips/AH.mp4 "https://www.pexels.com/download/video/15308529/"   # camino
