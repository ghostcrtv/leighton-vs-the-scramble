import base64, io, re
OUT='.'
from PIL import Image, ImageDraw
src='src/'
css=open(src+'style.css').read()+open(src+'arena.css').read()
font=base64.b64encode(open('assets/DepartureMono-Regular.woff2','rb').read()).decode()
css=css.replace('__DM_FONT__',font).replace('__PS_FONT__',base64.b64encode(open('assets/PressStart2P.woff2','rb').read()).decode())
js='\n'.join(open(src+f).read() for f in ['../cube.js','render.js','art.js','audio.js','content.js','app.js'])
# app icon: The Scrambler in front of the rift (tools/icon.py)
import sys, os; sys.path.insert(0,'tools'); import icon as _icon
os.makedirs(OUT or '.',exist_ok=True)
_icon.make(os.path.join(OUT,'icon.png'),180); _icon.make(os.path.join(OUT,'icon-512.png'),512)
icon='icon.png'
html=open(src+'shell.html').read().replace('__CSS__',css).replace('__JS__',js).replace('__ICON__',icon)
open(os.path.join(OUT,'index.html'),'w').write(html)
print('built', len(html)//1024,'KB')
