import math

angle = 27
width = 4
coef  = 0.3
sx    = 60 - coef
sy    = 0

angles = [ i * 27 for i in range(1,6) ]


for a in angles:
    print sx, sy, a
    ra = a * math.pi / 180
    sx += (width - coef) * math.cos(ra);
    sy += (width - coef) * math.sin(ra);

    
