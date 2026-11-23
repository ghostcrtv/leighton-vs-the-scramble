import base64, io, re
from PIL import Image, ImageDraw
src='src/'
css=open(src+'style.css').read()+open(src+'arena.css').read()
font=base64.b64encode(open('assets/DepartureMono-Regular.woff2','rb').read()).decode()
css=css.replace('__DM_FONT__',font)
js='\n'.join(open(src+f).read() for f in ['../cube.js','render.js','art.js','audio.js','content.js','app.js'])
# app icon: pixel cube on sky with grass
S=180; im=Image.new('RGB',(S,S),'#0b1029'); d=ImageDraw.Draw(im)
d.rectangle([0,70,S,S],fill='#162047'); d.rectangle([0,140,S,S],fill='#0b0f1d')
for i,(x,y) in enumerate([(84,0),(80,10),(88,20),(84,30)]): d.rectangle([x,y,x+3,y+10],fill='#ff3b2f')
cols=['#f7c844','#fbfbf8','#43a94b','#de3f3a','#f7c844','#2a6fd6','#f2892b','#43a94b','#f7c844']
x0,y0,c=42,34,32
d.rectangle([x0-4,y0-4,x0+3*c+8,y0+3*c+8],fill='#0c0c0e')
for i,col in enumerate(cols):
    x=x0+(i%3)*(c+2); y=y0+(i//3)*(c+2); d.rectangle([x+2,y+2,x+c-1,y+c-1],fill=col)
buf=io.BytesIO(); im.save(buf,'PNG'); im.save('icon.png') if False else None
icon='data:image/png;base64,'+base64.b64encode(buf.getvalue()).decode()
html=open(src+'shell.html').read().replace('__CSS__',css).replace('__JS__',js).replace('__ICON__',icon)
import os; os.makedirs('dist',exist_ok=True)
open('index.html','w').write(html); im.save('icon.png')
print('built', len(html)//1024,'KB')
