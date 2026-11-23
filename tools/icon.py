# Draws the app icon: The Scrambler (a living cube) glowing in front of the rift.
from PIL import Image, ImageDraw, ImageFilter
import random
def make(path, out=180):
    N=90; random.seed(7)
    im=Image.new('RGB',(N,N)); d=ImageDraw.Draw(im)
    for y in range(N):
        t=y/N; c=(int(11+t*20),int(16+t*26),int(41+t*45))
        d.line([(0,y),(N,y)],fill=c)
    for _ in range(40):
        x,y=random.randrange(N),random.randrange(N); d.point((x,y),fill=(214,222,250) if random.random()<.8 else (255,233,168))
    # rift glow + crack
    glow=Image.new('RGBA',(N,N),(0,0,0,0)); g=ImageDraw.Draw(glow)
    g.ellipse([16,6,74,64],fill=(255,59,47,200)); glow=glow.filter(ImageFilter.GaussianBlur(12))
    im.paste(glow,(0,0),glow)
    x=62
    for y in range(0,N,3):
        d.rectangle([x-1,y,x+1,y+2],fill=(120,20,18)); d.rectangle([x,y,x,y+2],fill=(255,190,160)); x+=random.choice([-2,2])
    # isometric cube
    a,b,c=9.5,5.2,9.5; cx,cy=45,17
    P=lambda X,Y,Z:(cx+(X-Z)*a, cy+(X+Z)*b-(Y-3)*c)
    COL={'Y':(247,200,68),'W':(243,241,234),'G':(67,169,75),'B':(42,111,214),'O':(242,137,43),'R':(222,63,58)}
    def shade(col,k): return tuple(int(v*k) for v in col)
    body=[P(0,3,0),P(3,3,0),P(3,3,3)]  # outline polygon of whole cube
    outline=[P(0,3,0),P(3,3,0),P(3,0,0),P(3,0,3),P(0,0,3),P(0,3,3)]
    d.polygon([(px,py+2) for px,py in outline],fill=(5,6,12))
    d.polygon(outline,fill=(12,12,14))
    ins=.14
    def sticker(face,i,j,col):
        if face=='top': pts=[(i+ins,3,j+ins),(i+1-ins,3,j+ins),(i+1-ins,3,j+1-ins),(i+ins,3,j+1-ins)]
        if face=='left': pts=[(i+ins,3-j-ins,3),(i+1-ins,3-j-ins,3),(i+1-ins,3-j-1+ins,3),(i+ins,3-j-1+ins,3)]
        if face=='right': pts=[(3,3-j-ins,3-i-ins),(3,3-j-ins,3-i-1+ins),(3,3-j-1+ins,3-i-1+ins),(3,3-j-1+ins,3-i-ins)]
        d.polygon([P(*p) for p in pts],fill=col)
    top=['Y','R','Y','B','Y','G','Y','O','Y']; left=['G','W','R','O','G','B','R','G','W']; right=['O','B','O','Y','R','W','B','O','G']
    for k in range(9):
        sticker('top',k%3,k//3,COL[top[k]])
        if k//3!=1: sticker('left',k%3,k//3,shade(COL[left[k]],.92))
        if k//3!=1: sticker('right',k%3,k//3,shade(COL[right[k]],.75))
    # angry glowing eyes across the middle row of the front faces
    for face,cxi in (('left',1.0),('right',2.0)):
        pass
    def eye(X,Y,Z,flip):
        x0,y0=P(X,Y,Z); x0=int(round(x0)); y0=int(round(y0))
        # angled slit: inner end lower, so it looks angry
        pts=[(x0-5,y0-3),(x0+5,y0+1),(x0+5,y0+3),(x0-5,y0)] if not flip else [(x0-5,y0+1),(x0+5,y0-3),(x0+5,y0),(x0-5,y0+3)]
        gl=Image.new('RGBA',(N,N),(0,0,0,0)); gd=ImageDraw.Draw(gl); gd.polygon(pts,fill=(255,59,47,200)); gl=gl.filter(ImageFilter.GaussianBlur(2.5)); im.paste(gl,(0,0),gl)
        d.polygon(pts,fill=(255,59,47)); d.line([(x0-3,y0-1 if not flip else y0+1),(x0+3,y0+2 if not flip else y0-2)],fill=(255,228,92))
    eye(1.5,1.5,3,False); eye(3,1.5,1.5,True)
    # teeth along the bottom edges
    for i in range(6):
        X=0.25+i*0.5
        x0,y0=P(X,0,3); d.polygon([(x0-2,y0-1),(x0+2,y0+1),(x0,y0+5)],fill=(253,248,236))
        x1,y1=P(3,0,3-X); d.polygon([(x1-2,y1+1),(x1+2,y1-1),(x1,y1+5)],fill=(253,248,236))
    # ground glow line
    big=im.resize((out,out),Image.NEAREST); big.save(path)


