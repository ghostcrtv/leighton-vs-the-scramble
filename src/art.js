// ---------- pixel art: Leighton, the monsters, night scenes, icons ----------
const PAL = {
  k:'#15141a', w:'#f3f1ea', h:'#fdf8ec', e:'#15141a',
  f:'#f1c39d', F:'#d39a72', H:'#6e4426', J:'#9a6537', L:'#c9d6e8',
  b:'#4d74a8', B:'#35598d', c:'#5ec3e8', n:'#1d2747',
  g:'#5fae4e', G:'#2f6a33', m:'#9ccf4f', M:'#5d8f2c', z:'#8fb38a', Z:'#5f7f5a',
  p:'#8a5ab8', P:'#523277', r:'#d8433a', R:'#8e2620', x:'#ff3b2f', X:'#ffb02e', Y:'#ffe45c',
  o:'#e9862c', O:'#a9561b', y:'#f2c641', s:'#8d8f96', S:'#4a4c55', l:'#d7d9de',
  t:'#c9a46b', T:'#7a5432', u:'#4b3220', q:'#dfe8f7', Q:'#9fb3d6', a:'#86d8cf', A:'#3c8f88',
  i:'#e9e4d0', I:'#b8b29a', d:'#c9b994', D:'#8f8064'
};
const SPRITES = {
  // Leighton, full body (16x24)
  leighton:[
"................",".....kkkkkk.....","....kJHJJHJk....","...kHJHHHJHHk...",
"...kHHJHHHJHk...","...kHfHHfHHfk...","..fkkkffffkkkf..","..fkSSSffSSSkf..",
"..fkLeeSSeeLkf..","...kfffFFfffk...","...kffffkkffk...","....kffffffk....",
".....kFFFFk.....","...kBBbbbbBBk...","..kbbbbBBbbbbk..",".kbbbbbbbbbbbbk.",
".kbkbbbbbbbbkbk.",".kbkbBBBBBBbkbk.",".kfkbbbbbbbbkfk.","..kkcccccccckk..",
"...knnnkknnnk...","...knnnk.knnnk..","...kwwwk.kwwwk..","..kwwwwk.kwwwwk."],
  slime:[
"................","................","................","......kkkk......",
"....kkmmmmkk....","...kmmmmmmmmk...","..kmmwmmmmmmmk..","..kmmmmmmmmmmk..",
".kmmkekmmkekmmk.",".kmmkkkmmkkkmmk.",".kmmmmmmmmmmmmk.",".kmmmmkkkkmmmmk.",
".kMmmmmmmmmmmMk.","kMMMMMMMMMMMMMMk","kMkkMMkkkkMMkkMk","kk..kk....kk..kk"],
  bat:[
"................","................",".....k....k.....",".....kk..kk.....",
"kk...kPPPPk...kk","kPk..kxPPxk..kPk","kPPk.kPPPPk.kPPk","kPPPkkPhhPkkPPPk",
"kPPPPPPPPPPPPPPk",".kPPPPPPPPPPPPk.",".kPkPPPPPPPPkPk.","..k.kPkPPkPk.k..",
".....k.kk.k.....","................","................","................"],
  zombie:[
"....kkkkkkk.....","...kSSzSSzSk....","...kzzzzzzzzk...","...kzzzzzzzzk...",
"...kzwkzzwkzk...","...kzzzZZzzzk...","...kzkhkhkhzk...","...kZzzzzzzZk...",
"....kzzzzzzk....","..kkgGggGgggkk..",".kzgggGgggGggzk.","kzkgGggggggGgkzk",
"kzkggggGgggggkzk","kzkgggggggGggkzk",".k.kgGkgkgGgk.k.","...kk.kk.kk.kk.."],
  ghost:[
"................",".....kkkkkk.....","....kqqqqqqk....","...kqqqqqqqqk...",
"..kqqqqqqqqqqk..","..kqqkkqqkkqqk..","..kqqkkqqkkqqk..","..kqqqqqqqqqqk..",
"..kqqqqkkqqqqk..","..kqqqqkkqqqqk..",".kqqqqqqqqqqqqk.","kqqqqqqqqqqqqqqk",
"kQqqqqqqqqqqqqQk","kQQQkQQQkQQQkQQk","kk..kk..kk..kkk.","................"],
  skeleton:[
"................","....kkkkkkkk....","...kiiiiiiiik...","..kiiiiiiiiiik..",
"..kiiiiiiiiiik..","..kikkkiikkkik..","..kikxkiikxkik..","..kikkkiikkkik..",
"..kiiiiikiiiik..","...kIiiiiiiIk...","...kikikikikk...","....kiiiiiik....",
".....kkkkkk.....","......kiik......","..kkkkiIIikkkk..",".kiiIiiIIiiIiik."],
  mummy:[
"................","....kkkkkkkk....","...kddDdddDdk...","..kdDdddDdddDk..",
"..kDdddDdddDdk..","..kdkYkddkkkdk..","..kddDdddDdddk..","..kDdddDdddDdk..",
"..kdddkkkkdddk..","..kdDddddDdddk..","...kddDdddDdk...","..kkdDddddDdkk..",
".kdDdddDdddDddk.","kdddDdddDdddDddk","kDdddDdddDdddDdk","kdDddddDdddDddkd"],
  spider:[
"k..............k",".k....kkkk....k.","..k..kSSSSk..k..","...kkSxSSxSkk...",
"kk..kSSxxSSk..kk","..kkkSSSSSSkkk..",".k..kSkhhkSk..k.","k..kSSSSSSSSk..k",
"..kSSSrSSrSSSk..",".kkSSSSrrSSSSkk.","k.kSSSSSSSSSSk.k","..kSSSSSSSSSSk..",
".k.kSSSSSSSSk.k.","k...kkSSSSkk...k","......kkkk......","................"],
  pumpkin:[
"................",".......kk.......","......kGGk......","....kkkGkkkk....",
"..kkooOooOooOkk.",".kooOooOooOooOk.","kooOooOooOooOook","kooOYYoOoOYYOook",
"koOoYYoOoOYYoOok","kooOooOYYOooOook","koYkYYkYYkYYkYok","kooYYkYYkYYkYook",
".kooOooOooOooOk.","..kkoOooOooOkk..","....kkkkkkkk....","................"],
  werewolf:[
"..kk........kk..","..kTk......kTk..","..kTTkkkkkkTTk..","..kTTTTTTTTTTk..",
".kTuTTTTTTTTuTk.",".kTkYkTTTTkYkTk.",".kTTTTTttTTTTTk.",".kTTTTttttTTTTk.",
"..kTTttkkttTTk..","..kTtkhkkhktTk..","...kTtkkkktTk...","...kuTttttTuk...",
"..kuuTTTTTTuuk..",".kuTTuTTTTuTTuk.","kuTTTTuTTuTTTTuk","kTTuTTTTTTTTuTTk"],
  vampire:[
"....kkkkkkkk....","...kSSSSSSSSk...","..kSSSSSSSSSSk..","..kSSSllllSSSk..",
"..kSllllllllSk..","..kSlxkllkxlSk..","..kSllllllllSk..","..kSlllSSlllSk..",
"..kRlkhkkhklRk..","RRkRRlkkkklRRkRR","RrrkRRllllRRkrrR","RrrrkRRkkRRkrrrR",
"RrrrrkSSSSkrrrrR","RrrrrkSwwSkrrrrR","RrrrrrkSSkrrrrrR","RRRRRRkkkkRRRRRR"],
  robot:[
".......x........",".......k........","....kkkkkkkk....","...kllllllllk...",
"..kSlllllllllk..","..kSkkkkkkkkSk..","..kSkxxkkxxkSk..","..kSkkkkkkkkSk..",
"..kSllllllllSk..","..kSlkSkSkSlSk..","..kSllllllllSk..","...kkkSSSSkkk...",
"..kllllSSllllk..",".klSlYYllRRlSlk.",".klSllllllllSlk.",".kkkkkkkkkkkkkk."],
  alien:[
"................",".....kkkkkk.....","...kkaaaaaakk...","..kaaaaaaaaaak..",
".kaaaaaaaaaaaak.",".kaakkkaakkkaak.",".kakkwkaakwkkak.",".kakkkkaakkkkak.",
"..kakkaaaakkak..","..kaaaaaaaaaak..","...kaaakkaaak...","....kaaaaaak....",
".....kAAAAk.....","...kkAAAAAAkk...","..kAAAAAAAAAAk..",".kAAAAAAAAAAAAk."],
  eyeball:[
"................","................",".....kkkkkk.....","...kkppppppkk...",
"..kpppwwwwpppk..","..kppwwxxwwppk..","..kppwwxxwwppk..","..kpppwwwwpppk..",
".kppppppppppppk.",".kphkhkhkhkhkpk.",".kpkkkkkkkkkkpk.",".kphkhkhkhkhkpk.",
"..kppppppppppk..","..kPPPPPPPPPPk..","...kPk....kPk...","...kk......kk..."],
  vine:[
"..k....kk....k..","...k..kGGk..k...","...kkkGGGGkkk...","..kGGGgGGgGGGk..",
".kGgGGGGGGGGgGk.",".kGGXXGGGGXXGGk.",".kGGXXGGGGXXGGk.","kGGGGGGkkGGGGGGk",
"kGgGGGkhhkGGGgGk",".kGGGGkhhkGGGGk.",".kGGgGGkkGGgGGk.","..kGGGGGGGGGGk..",
".kGk.kGGGGk.kGk.","kGk..kGkkGk..kGk","kk...kGkkGk...kk",".....kk..kk....."],
  toad:[
"................","..kxk.kxk.kxk...","..kkk.kkk.kkk...","..kmmmmmmmmmmk..",
".kmmmmmmmmmmmmk.",".kmmxmmmmmmxmmk.","kmmmmmmmmmmmmmmk","kmkkkkkkkkkkkkmk",
"kmkhkhkhkhkhkkmk","kmmkkkkkkkkkkmmk","kmmmmmmmmmmmmmmk",".kmGmmGmmGmmGmk.",
".kmmmmmmmmmmmmk.","kmmk........kmmk","kkkk........kkkk","................"],
  serpent:[
"......kkkk......",".....kbbbbk.....","....kbbxbbbk....","....kbbbbbbk....",
"....khkhkbbk....",".....kkkkbbk....","........kbbk....",".......kbbk.....",
"......kbbk......",".....kbbk.......","....kbbk........","....kbbbk.......",
".....kbbbk......","..kkkkkbbbkkkk..",".knnnnnnnnnnnnk.","kbbbbbbbbbbbbbbk"],
  scarecrow:[
".....kkkkkk.....","....kTTTTTTk....","....kTTTTTTk....",".kkkkTTTTTTkkkk.",
".kTTTTTTTTTTTTk.","..kttttttttttk..","..ktXXttttXXtk..","..ktXXttttXXtk..",
"..kttttttttttk..","..ktkktkktkktk..","..kttttttttttk..","...kkttttttkk...",
".kooooooooooook.","kyokooooooookoyk","y.kooooooooook.y","...kk......kk..."],
  moth:[
"...k........k...","....k......k....",".....k....k.....","kk....kkkk....kk",
"kppk.kPPPPk.kppk","kpXpkkPxxPkkpXpk","kpXppkPPPPkppXpk","kpppppkPPkpppppk",
".kppppkPPkppppk.","..kpppkPPkpppk..","..kppkkPPkkppk..","...kk.kPPk.kk...",
"......kPPk......",".......kk.......","................","................"],
  stag:[
".k.k........k.k.",".kik.k....k.kik.","..kikik..kikik..","...kiik..kiik...",
"....kiikkiik....","....kiiiiiik....","...kiiiiiiiik...","...kikkiikkik...",
"...kikxiixkik...","....kiiiiiik....","....kiikkiik....",".....kiiiik.....",
"....kSkhhkSk....","...kSSSkkSSSk...","..kSSSSSSSSSSk..",".kSSSSSSSSSSSSk."],
  worm:[
"................","....kkkkkkkk....","...kTTTTTTTTk...","..kThkhkhkhkTk..",
"..kThRRRRRRhTk..","..kThRRkkRRhTk..","..kThRRRRRRhTk..","..kThkhkhkhkTk..",
"...kTTTTTTTTk...","...kTtTTTTtTk...","..kTTTTTTTTTTk..","..kTtTTTTTTtTk..",
".kTTTTTTTTTTTTk.","kTTtTTTTTTTTtTTk","kkkkkkkkkkkkkkkk","TTtTTTtTTTtTTTtT"],
  scrambler:[
"................","..kkkkkkkkkkkkk.","..kyyykrrrkbbbk.","..kyyykrxrkbbbk.",
"..kyyykrrrkbbbk.","..kkkkkkkkkkkkk.","..kgggkhkhkoook.","..kgggkkkkkoook.",
"..kgggkhkhkoook.","..kkkkkkkkkkkkk.","..kwwwkpppkrrrk.","..kwwwkpppkrrrk.",
"..kwwwkpppkrrrk.","..kkkkkkkkkkkkk.","...kxk.....kxk..","................"],
};
SPRITES.face = SPRITES.leighton.slice(0,16);

function spriteSVG(name, cls='', style=''){
  const rows=SPRITES[name]; const H=rows.length; let out='', eyes='';
  rows.forEach((row,y)=>{
    let x=0;
    while(x<16){
      const ch=row[x]; if(!ch||ch==='.'){x++;continue;}
      let x2=x; while(x2<16&&row[x2]===ch) x2++;
      const r=`<rect x="${x}" y="${y}" width="${x2-x}" height="1" fill="${PAL[ch]||'#f0f'}"/>`;
      if(ch==='e') eyes+=r; else out+=r;
      x=x2;
    }
  });
  return `<svg class="pix sprite ${cls}" viewBox="0 0 16 ${H}" style="${style}" aria-hidden="true">${out}<g class="eyes">${eyes}</g></svg>`;
}

function rng(seed){ let s=seed>>>0||1; return ()=>{ s^=s<<13; s>>>=0; s^=s>>17; s^=s<<5; s>>>=0; return (s%10000)/10000; }; }

// night scenes for each part of town
const SCENES = {
  street:{ sky:['#0d1330','#162047','#24305e'], hills:['#1b2440','#141b31','#0f1424'], ground:'#141a2a', feature:'street', rift:true },
  garden:{ sky:['#0c1a24','#12283a','#1c3a4e'], hills:['#173226','#10251c','#0b1a14'], ground:'#0e1d16', feature:'garden' },
  pond:{ sky:['#0b1428','#132248','#1e3566'], hills:['#152a2a','#0f201f','#0a1716'], ground:'#0c1817', feature:'pond' },
  creek:{ sky:['#0e1226','#161d3c','#232b55'], hills:['#18263a','#111c2c','#0b1420'], ground:'#0d1522', feature:'creek' },
  farm:{ sky:['#1a0f22','#2a1630','#4a2236'], hills:['#2b2218','#1f1912','#16120d'], ground:'#18130e', feature:'farm', rift:true },
  drivein:{ sky:['#140f2a','#211845','#3a2563'], hills:['#1c1a33','#151327','#0f0e1c'], ground:'#100f1c', feature:'drivein' },
  hollow:{ sky:['#0d1014','#151a20','#222a31'], hills:['#1a1f24','#13171b','#0d1013'], ground:'#0d1013', feature:'hollow' },
  mine:{ sky:['#120c0a','#1f1511','#3a2419'], hills:['#2a1c14','#20150f','#160f0a'], ground:'#160f0a', feature:'mine', rift:true },
  tower:{ sky:['#090b18','#121633','#1f2552'], hills:['#151a36','#10142a','#0b0e1e'], ground:'#0b0e1e', feature:'tower', rift:true },
};

function sceneSVG(theme, w=160, h=72, seed=7){
  const T=SCENES[theme]||SCENES.street; const R=rng(seed); let s='';
  const band=(y0,y1,c)=>s+=`<rect x="0" y="${y0}" width="${w}" height="${y1-y0}" fill="${c}"/>`;
  const b1=Math.round(h*.25), b2=Math.round(h*.5);
  band(0,b1,T.sky[0]); band(b1,b2,T.sky[1]); band(b2,h,T.sky[2]);
  for(let x=0;x<w;x+=2){ s+=`<rect x="${x+(R()<.5?0:1)}" y="${b1-1}" width="1" height="1" fill="${T.sky[1]}"/><rect x="${x+(R()<.5?0:1)}" y="${b2-1}" width="1" height="1" fill="${T.sky[2]}"/>`; }
  for(let i=0;i<Math.round(w/7);i++) s+=`<rect x="${Math.floor(R()*w)}" y="${Math.floor(R()*h*.45)}" width="1" height="1" fill="${R()<.2?'#ffe9a8':'#cdd6f5'}" opacity="${(.4+R()*.6).toFixed(2)}"/>`;
  const mx=Math.round(w*(.12+R()*.2)), my=Math.round(h*.12);
  s+=`<rect x="${mx}" y="${my}" width="7" height="7" fill="#f4efd8"/><rect x="${mx+1}" y="${my-1}" width="5" height="9" fill="#f4efd8"/><rect x="${mx-1}" y="${my+1}" width="9" height="5" fill="#f4efd8"/><rect x="${mx+4}" y="${my+2}" width="2" height="2" fill="#d8d1b4"/>`;
  if(T.rift){ let x=Math.round(w*.62), y=2; for(let i=0;i<10;i++){ s+=`<rect x="${x-1}" y="${y}" width="3" height="3" fill="#ff3b2f" opacity=".35"/><rect x="${x}" y="${y}" width="1" height="3" fill="#ff7a5c"/>`; x+=R()<.5?-2:2; y+=3; } }
  const layer=(base,amp,freq,c,ph)=>{ for(let x=0;x<w;x+=2){ const y=Math.round(base+Math.sin(x*freq+ph)*amp+Math.sin(x*freq*2.7+ph*2)*amp*.35); s+=`<rect x="${x}" y="${y}" width="2" height="${h-y}" fill="${c}"/>`; } };
  layer(h*.55,4,.05,T.hills[0],R()*6); layer(h*.68,3,.07,T.hills[1],R()*6);
  const F=T.feature, gy=Math.round(h*.86);
  const pine=(x,y,c)=>{ s+=`<rect x="${x+3}" y="${y}" width="2" height="3" fill="${c}"/><rect x="${x+2}" y="${y+3}" width="4" height="3" fill="${c}"/><rect x="${x+1}" y="${y+6}" width="6" height="3" fill="${c}"/><rect x="${x}" y="${y+9}" width="8" height="4" fill="${c}"/><rect x="${x+3}" y="${y+13}" width="2" height="${h}" fill="${c}"/>`; };
  const deadTree=(x,y)=>{ s+=`<rect x="${x}" y="${y}" width="2" height="${h-y}" fill="#07090b"/><rect x="${x-4}" y="${y+4}" width="4" height="1" fill="#07090b"/><rect x="${x-4}" y="${y+1}" width="1" height="3" fill="#07090b"/><rect x="${x+2}" y="${y+7}" width="5" height="1" fill="#07090b"/><rect x="${x+6}" y="${y+3}" width="1" height="4" fill="#07090b"/>`; };
  const glowEyes=(x,y)=>{ s+=`<rect x="${x}" y="${y}" width="1" height="1" fill="#ff3b2f"/><rect x="${x+3}" y="${y}" width="1" height="1" fill="#ff3b2f"/>`; };
  for(let i=0;i<6;i++) pine(Math.floor(R()*w), Math.round(h*.5+R()*h*.12), T.hills[2]);
  if(F==='street'){ [[.38,.6],[.52,.64],[.7,.58]].forEach(([fx,fy])=>{ const x=Math.round(w*fx), y=Math.round(h*fy); s+=`<rect x="${x}" y="${y}" width="16" height="${gy-y}" fill="#0b0f1d"/><rect x="${x-1}" y="${y-5}" width="18" height="2" fill="#0b0f1d"/><rect x="${x+2}" y="${y-3}" width="12" height="3" fill="#0b0f1d"/><rect x="${x+3}" y="${y+4}" width="3" height="3" fill="#ffcf5c"/><rect x="${x+10}" y="${y+4}" width="3" height="3" fill="${R()<.5?'#ffcf5c':'#1b2238'}"/>`; });
    const lx=Math.round(w*.88); s+=`<rect x="${lx}" y="${Math.round(h*.45)}" width="1" height="${h}" fill="#0b0f1d"/><rect x="${lx-2}" y="${Math.round(h*.45)}" width="4" height="2" fill="#ffe59a"/><path d="M${lx-1} ${Math.round(h*.47)} L${lx-10} ${gy} L${lx+10} ${gy} Z" fill="#ffe59a" opacity=".12"/>`; }
  if(F==='garden'){ for(let x=0;x<w;x+=6) s+=`<rect x="${x}" y="${gy-8}" width="1" height="8" fill="#2a3a2e"/>`; s+=`<rect x="0" y="${gy-7}" width="${w}" height="1" fill="#2a3a2e"/>`; for(let i=0;i<10;i++){ const x=Math.floor(R()*w); s+=`<rect x="${x}" y="${gy-10-Math.floor(R()*6)}" width="1" height="12" fill="#1f5a2c"/><rect x="${x-1}" y="${gy-8}" width="3" height="1" fill="#2f7a3a"/>`; } glowEyes(Math.round(w*.75),gy-6); }
  if(F==='pond'){ const px=Math.round(w*.4); s+=`<rect x="${px}" y="${gy-2}" width="56" height="6" fill="#0f2a4a"/><rect x="${px+4}" y="${gy-3}" width="48" height="2" fill="#173a63"/><rect x="${px+20}" y="${gy-1}" width="6" height="1" fill="#f4efd8" opacity=".6"/><rect x="${px+22}" y="${gy+1}" width="3" height="1" fill="#f4efd8" opacity=".4"/>`; for(let i=0;i<6;i++){ const x=px-4+Math.floor(R()*64); s+=`<rect x="${x}" y="${gy-7}" width="1" height="6" fill="#1f3a2a"/>`; } glowEyes(px+40,gy-1); }
  if(F==='creek'){ for(let x=0;x<w;x+=2){ const y=Math.round(gy-2+Math.sin(x*.06)*2); s+=`<rect x="${x}" y="${y}" width="2" height="4" fill="#132c52"/>`; if(x%12===0) s+=`<rect x="${x}" y="${y+1}" width="3" height="1" fill="#4a6fa8"/>`; } deadTree(Math.round(w*.8),Math.round(h*.4)); }
  if(F==='farm'){ const bx=Math.round(w*.64); s+=`<rect x="${bx}" y="${Math.round(h*.52)}" width="24" height="${gy-Math.round(h*.52)}" fill="#2a0f12"/><rect x="${bx-2}" y="${Math.round(h*.5)}" width="28" height="3" fill="#1a0a0c"/><rect x="${bx+9}" y="${Math.round(h*.62)}" width="6" height="${gy-Math.round(h*.62)}" fill="#120708"/>`; for(let x=0;x<Math.round(w*.55);x+=3){ s+=`<rect x="${x}" y="${gy-6-Math.floor(R()*3)}" width="1" height="9" fill="#3a3218"/><rect x="${x+1}" y="${gy-5}" width="1" height="1" fill="#5a4a22"/>`; } }
  if(F==='drivein'){ const sx=Math.round(w*.35), sw=Math.round(w*.4); s+=`<rect x="${sx}" y="${Math.round(h*.25)}" width="${sw}" height="${Math.round(h*.32)}" fill="#bcd6ff" opacity=".85"/><rect x="${sx+3}" y="${Math.round(h*.57)}" width="2" height="${gy}" fill="#0f0e1c"/><rect x="${sx+sw-5}" y="${Math.round(h*.57)}" width="2" height="${gy}" fill="#0f0e1c"/><path d="M${sx} ${Math.round(h*.57)} L${sx-20} ${gy} L${sx+sw+20} ${gy} L${sx+sw} ${Math.round(h*.57)} Z" fill="#bcd6ff" opacity=".07"/>`; for(let i=0;i<4;i++){ const cx=Math.round(w*.2+i*w*.17); s+=`<rect x="${cx}" y="${gy-4}" width="14" height="4" fill="#07070d"/><rect x="${cx+3}" y="${gy-7}" width="8" height="3" fill="#07070d"/>`; } }
  if(F==='hollow'){ for(let i=0;i<5;i++) deadTree(Math.round(w*.3+i*w*.14+R()*6), Math.round(h*.35+R()*10)); s+=`<rect x="0" y="${gy-5}" width="${w}" height="4" fill="#c7d0da" opacity=".08"/><rect x="0" y="${gy-9}" width="${w}" height="3" fill="#c7d0da" opacity=".05"/>`; glowEyes(Math.round(w*.55),gy-8); glowEyes(Math.round(w*.9),gy-12); }
  if(F==='mine'){ const m2=Math.round(w*.55); s+=`<rect x="${m2}" y="${gy-20}" width="22" height="20" fill="#2a1a10"/><rect x="${m2+4}" y="${gy-16}" width="14" height="16" fill="#050302"/><rect x="${m2+2}" y="${gy-20}" width="2" height="20" fill="#6b4a2a"/><rect x="${m2+18}" y="${gy-20}" width="2" height="20" fill="#6b4a2a"/><rect x="${m2}" y="${gy-21}" width="22" height="2" fill="#6b4a2a"/><rect x="${m2+24}" y="${gy-12}" width="3" height="4" fill="#ffb02e"/><rect x="${m2+23}" y="${gy-13}" width="5" height="1" fill="#3a2a1a"/>`; glowEyes(m2+9,gy-10); }
  if(F==='tower'){ const tx=Math.round(w*.62); s+=`<rect x="${tx}" y="${Math.round(h*.28)}" width="18" height="${h}" fill="#070914"/><rect x="${tx+3}" y="${Math.round(h*.2)}" width="12" height="7" fill="#070914"/><rect x="${tx+7}" y="${Math.round(h*.13)}" width="4" height="5" fill="#070914"/><rect x="${tx+4}" y="${Math.round(h*.34)}" width="10" height="10" fill="#ffe59a"/><rect x="${tx+8}" y="${Math.round(h*.35)}" width="2" height="5" fill="#15141a"/><rect x="${tx+8}" y="${Math.round(h*.39)}" width="4" height="1" fill="#15141a"/>`; }
  band(gy,h,T.ground);
  if(F==='mine'){ for(let x=0;x<w;x+=4) s+=`<rect x="${x}" y="${gy+2}" width="2" height="1" fill="#5a3a22"/>`; s+=`<rect x="0" y="${gy+1}" width="${w}" height="1" fill="#3a3a44"/><rect x="0" y="${gy+4}" width="${w}" height="1" fill="#3a3a44"/>`; }
  return `<svg class="pix scene" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${s}</svg>`;
}

function fringeSVG(color='#121318', seed=3){
  const R=rng(seed), w=320, h=20; let s=`<rect x="0" y="${h-6}" width="${w}" height="6" fill="${color}"/>`;
  for(let x=0;x<w;x+=2){ const k=Math.floor(R()*4); for(let j=0;j<k;j++) s+=`<rect x="${x}" y="${h-7-j*2}" width="2" height="2" fill="${color}"/>`; if(R()<.12) s+=`<rect x="${x}" y="${h-16-Math.floor(R()*4)}" width="2" height="2" fill="${color}"/>`; }
  return `<svg class="pix fringe" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">${s}</svg>`;
}

// title scene: Maple Street at night, the rift tearing open over the trees
function heroSVG(){
  const w=240,h=150,R=rng(5); let s='';
  s+=`<rect width="${w}" height="${h}" fill="#0b1029"/><rect y="40" width="${w}" height="40" fill="#121a3f"/><rect y="80" width="${w}" height="70" fill="#1c2756"/>`;
  for(let x=0;x<w;x+=2){ s+=`<rect x="${x+(R()<.5?0:1)}" y="39" width="1" height="1" fill="#121a3f"/><rect x="${x+(R()<.5?0:1)}" y="79" width="1" height="1" fill="#1c2756"/>`; }
  for(let i=0;i<70;i++) s+=`<rect x="${Math.floor(R()*w)}" y="${Math.floor(R()*80)}" width="1" height="1" fill="#d6defa" opacity="${(.3+R()*.7).toFixed(2)}"/>`;
  s+=`<rect x="178" y="14" width="16" height="16" fill="#f4efd8"/><rect x="180" y="12" width="12" height="20" fill="#f4efd8"/><rect x="176" y="16" width="20" height="12" fill="#f4efd8"/><rect x="184" y="18" width="4" height="3" fill="#ddd5b5"/><rect x="181" y="24" width="3" height="2" fill="#ddd5b5"/>`;
  let x=214,y=0; for(let i=0;i<20;i++){ s+=`<rect x="${x-3}" y="${y}" width="7" height="4" fill="#ff3b2f" opacity=".18"/><rect x="${x-1}" y="${y}" width="3" height="4" fill="#ff3b2f" opacity=".45"/><rect x="${x}" y="${y}" width="1" height="4" fill="#ffd0b0"/>`; x+=R()<.5?-3:3; y+=4; }
  const layer=(base,amp,freq,c,ph)=>{ for(let x=0;x<w;x+=2){ const y=Math.round(base+Math.sin(x*freq+ph)*amp+Math.sin(x*freq*2.3+ph)*amp*.4); s+=`<rect x="${x}" y="${y}" width="2" height="${h-y}" fill="${c}"/>`; } };
  layer(92,5,.035,'#16203f',1);
  for(let i=0;i<18;i++){ const px=Math.floor(R()*w), py=82+Math.floor(R()*14), c='#0d1428'; s+=`<rect x="${px+3}" y="${py}" width="2" height="3" fill="${c}"/><rect x="${px+2}" y="${py+3}" width="4" height="3" fill="${c}"/><rect x="${px+1}" y="${py+6}" width="6" height="4" fill="${c}"/><rect x="${px}" y="${py+10}" width="8" height="5" fill="${c}"/>`; }
  layer(112,3,.05,'#0e1426',3);
  [[96,104],[126,100],[204,106]].forEach(([hx,hy],i)=>{ s+=`<rect x="${hx}" y="${hy}" width="26" height="${136-hy}" fill="#090d1c"/><rect x="${hx-2}" y="${hy-6}" width="30" height="3" fill="#090d1c"/><rect x="${hx+3}" y="${hy-4}" width="20" height="4" fill="#090d1c"/><rect x="${hx+4}" y="${hy+6}" width="5" height="5" fill="#ffcf5c"/><rect x="${hx+16}" y="${hy+6}" width="5" height="5" fill="${i===1?'#1b2238':'#ffcf5c'}"/><rect x="${hx+11}" y="${hy+18}" width="5" height="${136-hy-18}" fill="#05070f"/>`; });
  s+=`<rect x="70" y="80" width="2" height="60" fill="#090d1c"/><rect x="66" y="78" width="10" height="3" fill="#090d1c"/><rect x="67" y="81" width="8" height="2" fill="#ffe59a"/><path d="M67 83 L50 138 L92 138 L75 83 Z" fill="#ffe59a" opacity=".1"/>`;
  s+=`<rect y="136" width="${w}" height="14" fill="#0b0f1d"/><rect y="138" width="${w}" height="1" fill="#1a2140"/>`;
  for(let i=0;i<14;i++) s+=`<rect x="${i*18+4}" y="143" width="8" height="1" fill="#e2c35a" opacity=".5"/>`;
  [[30,104],[118,118],[226,96],[160,122]].forEach(([ex,ey])=>{ s+=`<rect x="${ex}" y="${ey}" width="2" height="1" fill="#ff3b2f"/><rect x="${ex+5}" y="${ey}" width="2" height="1" fill="#ff3b2f"/>`; });
  return `<svg class="pix scene" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${s}</svg>`;
}

const ICON = {
  star:(on)=>`<svg class="pix" viewBox="0 0 9 9"><path fill="${on?'#ffd23f':'#3a3c45'}" d="M4 0h1v2h1v1h3v1h-1v1h-1v2h1v2h-1v-1h-1v-1h-3v1h-1v1h-1v-2h1v-2h-1v-1h-1v-1h3v-1h1z"/><path fill="${on?'#d9a62c':'#2c2e36'}" d="M3 6h3v1h-3z"/></svg>`,
  flame:`<svg class="pix" viewBox="0 0 8 8"><path fill="#f2892b" d="M3 0h1v1h1v1h1v1h1v4h-1v1h-4v-1h-1v-3h1v-1h1z"/><path fill="#f7c844" d="M3 4h1v1h1v2h-3v-2h1z"/></svg>`,
  bolt:`<svg class="pix" viewBox="0 0 8 8"><path fill="#5ec3e8" d="M4 0h2v1h-1v2h2v1h-1v1h-1v1h-1v1h-1v1h-1v-2h1v-2h-2v-1h1v-1h1v-1h1z"/></svg>`,
  skull:`<svg class="pix" viewBox="0 0 8 8"><path fill="#e9e4d0" d="M2 0h4v1h1v4h-1v2h-4v-2h-1v-4h1z"/><path fill="#15141a" d="M2 2h1v2h-1zM5 2h1v2h-1zM3 6h1v1h-1zM5 6h1v1h-1z"/></svg>`,
  lock:`<svg class="pix" viewBox="0 0 8 8" width="18" height="18"><path fill="#4a4c55" d="M2 1h4v1h1v2h1v4h-8v-4h1v-2h1zM3 2v2h2v-2z"/></svg>`,
  back:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>`,
  close:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  reset:`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/></svg>`,
};
function moveGlyph(tok){
  const a={ "R":'up', "R'":'down', "L":'down', "L'":'up', "U":'left', "U'":'right', "D":'right', "D'":'left', "F":'cw', "F'":'ccw', "B":'ccw', "B'":'cw', "y":'left', "y'":'right' }[tok];
  const p={ up:'M12 19V5M6 11l6-6 6 6', down:'M12 5v14M6 13l6 6 6-6', left:'M19 12H5M11 6l-6 6 6 6', right:'M5 12h14M13 6l6 6-6 6',
    cw:'M18.5 9A7 7 0 1 0 19 13M19 4v5h-5', ccw:'M5.5 9A7 7 0 1 1 5 13M5 4v5h5' }[a];
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="${p}"/></svg>`;
}
