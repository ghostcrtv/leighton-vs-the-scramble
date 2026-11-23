// ---------- the hero ----------
const HERO = {
  name:'Leighton',
  yay:['Boom.','Got it.','Too easy.','Direct hit!','Next!','Clean.',"Let's go!",'Nailed it.'],
  oops:['Whoa, other way.','Nope. Again.','It dodged!','Missed. Again.','Close one.'],
};
const CREW = { leighton:{ name:'Leighton', yay:HERO.yay, oops:HERO.oops } };

// the seven moves Leighton fights with
const SKILL_ALGS = {
  wiggle:{ alg:"R U R' U'", name:'The Jab', chant:'Up, over, down, back.' },
  slideR:{ alg:"U R U' R' U' F' U F", name:'Right Slide', chant:'Top, up, top, down. Top, tip, top, tip.' },
  slideL:{ alg:"U' L' U L U F U' F'", name:'Left Slide', chant:'Right Slide in a mirror.' },
  sandwich:{ alg:"F R U R' U' F'", name:'The Sandwich', chant:'Front, Jab, front back.' },
  swirl:{ alg:"R U R' U R U2 R'", name:'The Tornado', chant:'Up, over, down. Over. Up, over over, down.' },
  swap:{ alg:"U R U' L' U R' U' L", name:'The Switch', chant:'Top, right. Top, left. Top, right. Top, left.' },
  dig:{ alg:"R' D' R D", name:'The Drill', chant:'Down, drill, up, drill.' }
};

// every level has its own monster. hue shifts the sprite's colors.
const MONSTERS = {
  '1.1':{ sp:'slime', name:'Glop', taunt:'Blorp.', bio:'A puddle with an attitude. Weak to pretty much anything.' },
  '1.2':{ sp:'bat', name:'Screech', taunt:'SKREEE!', bio:'Flies in circles. Hates it when you know R from R prime.' },
  '1.3':{ sp:'zombie', name:'Shambles', taunt:'Brainnns... or cubes.', bio:'Slow, hungry and really bad at puzzles.' },
  '1.4':{ sp:'ghost', name:'Wailer', taunt:'Ooooo... wrong way...', bio:'Haunts the left side of every cube in town.' },
  '1.5':{ sp:'eyeball', name:'The Watcher', taunt:'I see every mistake.', bio:'Boss of Maple Street. Stares at you the whole time you turn.', boss:true },
  '2.1':{ sp:'vine', name:'Snapvine', taunt:'Sssnap.', bio:'Grows back if you leave a petal behind.' },
  '2.2':{ sp:'spider', name:'Crawlspace', taunt:'Click. Click. Click.', bio:'Lives under the greenhouse benches. Eight legs, zero manners.' },
  '2.3':{ sp:'pumpkin', name:'Jack Rot', taunt:'Hehehe.', bio:'Carved its own face. Nobody knows how.' },
  '2.4':{ sp:'vine', name:'Briarback', taunt:'You cannot cross me.', bio:'Boss of the Greenhouse. Thorns down its whole back.', boss:true, hue:-40 },
  '3.1':{ sp:'toad', name:'Croaker', taunt:'RIBBIT. (That was a threat.)', bio:'Six eyes and one brain cell.' },
  '3.2':{ sp:'slime', name:'Bog Glop', taunt:'Blorp. But angrier.', bio:"Glop's cousin from the pond. Smells way worse.", hue:200 },
  '3.3':{ sp:'serpent', name:'Pond Eel', taunt:'Hssss.', bio:'Waits for you to mess up a Jab, then bites.' },
  '3.4':{ sp:'bat', name:'Mire Wing', taunt:'SKREE?', bio:'A bat that lives in a swamp. Questionable life choices.', hue:120 },
  '3.5':{ sp:'werewolf', name:'Moonfang', taunt:'AWOOOO!', bio:'Boss of Hatcher\'s Pond. Only shows up when the corners are wrong.', boss:true },
  '4.1':{ sp:'skeleton', name:'Rattles', taunt:'*rattle rattle*', bio:'All bones, no brains. Literally.' },
  '4.2':{ sp:'mummy', name:'The Wrapper', taunt:'Mmmmph.', bio:'Wrapped up since 1922. Still mad about it.' },
  '4.3':{ sp:'ghost', name:'Shiver', taunt:'Left... or right...?', bio:'Tries to trick you into sliding the wrong way.', hue:150 },
  '4.4':{ sp:'serpent', name:'Black Eel', taunt:'Hssss!', bio:'Lives in Black Creek. Faster than its pond cousin.', hue:-60 },
  '4.5':{ sp:'vampire', name:'Count Vexley', taunt:'I vant to scramble your cube.', bio:'Boss of Black Creek. Hates sunlight and solved cubes.', boss:true },
  '5.1':{ sp:'scarecrow', name:'Stitchface', taunt:'...', bio:'Never talks. Always watching the corn.' },
  '5.2':{ sp:'pumpkin', name:'Gourdon', taunt:'Heh. Heh. Heh.', bio:"Jack Rot's big brother. Twice the teeth.", hue:-25 },
  '5.3':{ sp:'scarecrow', name:'The Harvest Man', taunt:'The crop is ready.', bio:'Boss of Mercer Farm. Thinks the yellow top belongs to him.', boss:true, hue:-30 },
  '6.1':{ sp:'robot', name:'Unit-86', taunt:'BEEP. HOSTILE.', bio:'Walked out of the drive-in screen during a robot movie.' },
  '6.2':{ sp:'alien', name:'The Visitor', taunt:'Take me to your cube.', bio:'Boss of the Drive-In. Landed during the late show.', boss:true },
  '7.1':{ sp:'stag', name:'Bone Stag', taunt:'*clack clack*', bio:'Antlers made of old bones. Runs through the Hollow at night.' },
  '7.2':{ sp:'zombie', name:'Ghoul', taunt:'Hhhhrrrrnnn.', bio:'A zombie that wandered into the Hollow and never left.', hue:220 },
  '7.3':{ sp:'moth', name:'Mother Moth', taunt:'Come to the light...', bio:'Boss of the Hollow. Her wings have eyes. Do not look.', boss:true },
  '8.1':{ sp:'worm', name:'Tunneler', taunt:'*rumble*', bio:'Chews through rock. And cubes, if you let it.' },
  '8.2':{ sp:'spider', name:'Cave Crawler', taunt:'Click.', bio:'Grew huge in the dark. Hates headlamps.', hue:90 },
  '8.3':{ sp:'scrambler', name:'The Scrambler', taunt:'I AM THE MESS.', bio:'The cube that started all of this. Solve it and the rift closes.', boss:true },
  '9.1':{ sp:'eyeball', name:'Clockeye', taunt:'Tick. Tock.', bio:'Counts every second you waste.', hue:160 },
  '9.2':{ sp:'robot', name:'Rewinder', taunt:'REWINDING.', bio:'Tries to undo everything you learned. Prove it wrong.', hue:250 },
  '9.3':{ sp:'scrambler', name:'Scrambler Prime', taunt:'Faster. FASTER.', bio:'The Scrambler came back mad. Beat it in under two minutes.', boss:true, hue:40 },
};
// random grunts for warm-ups
const GRUNTS = ['slime','bat','zombie','ghost','skeleton','spider','pumpkin','mummy','robot','toad'];
const GRUNT_NAMES = ['Night Glop','Rafter Bat','Basement Zombie','Hallway Ghost','Bonehead','Gutter Spider','Porch Pumpkin','Closet Mummy','Junkyard Bot','Ditch Toad'];

// ---------- focus modes: which stickers keep their color ----------
const hasC=(q,c)=>q.stickers.some(s=>s.c===c);
const FOCUS = {
  all:null,
  centers:(q)=>q.type==='center',
  cross:(q)=>q.type==='center'||(q.type==='edge'&&hasC(q,'W')),
  f1:(q)=>q.type==='center'||hasC(q,'W'),
  f2l:(q)=>q.type==='center'||hasC(q,'W')||(q.type==='edge'&&!hasC(q,'Y')),
  ytop:(q,s)=>q.type==='center'||hasC(q,'W')||(q.type==='edge'&&!hasC(q,'Y'))||s.c==='Y',
  yedges:(q,s)=>q.type==='center'||!hasC(q,'Y')||q.type==='edge'||s.c==='Y',
};

// ---------- generators for puzzles and recognition ----------
const rnd=n=>Math.floor(Math.random()*n);
const pick=a=>a[rnd(a.length)];
const Upow=k=>['','U','U2',"U'"][((k%4)+4)%4];
const rep=(a,n)=>Array(n).fill(a).join(' ');
const DAISY="F2 R2 B2 L2";
function stateOf(base, setup){ const c=new Cube(); if(base) c.alg(base); c.alg(setup); return c; }
function yShape(c){ const up=c.edgesWith('Y').filter(q=>c.stickerNormal(q,'Y')[1]===1).map(q=>q.pos.join(','));
  if(up.length===4) return 'cross'; if(up.length===0) return 'Dot';
  const has=p=>up.includes(p); return (has('1,1,0')&&has('-1,1,0'))||(has('0,1,1')&&has('0,1,-1'))?'Line':'L shape'; }

const GEN = {
  petal1:()=>{ const m=pick(["F","F'","R","R'","F2","R2"]); return {base:DAISY, setup:[m], focus:'cross', goal:'daisy'}; },
  petal2:()=>{ let s; do{ s=[pick(['U',"U'",'U2']), pick(["F","F'","R","R'"]), pick(["D","D'","F","R'"])]; }while(stateOf(DAISY,s).daisy()); return {base:DAISY, setup:s, focus:'cross', goal:'daisy'}; },
  cross1:()=>{ const f=pick(['F','R']); return {base:'', setup:[f+'2', Upow(1+rnd(3))], focus:'cross', goal:'cross'}; },
  crossAll:()=>({base:'', setup:['F2','R2','B2','L2',Upow(1+rnd(3))].filter(Boolean), focus:'cross', goal:'cross'}),
  corner0:()=>({base:'', setup:invertAlg(rep(ALGS.wiggle,pick([1,3,5]))), focus:'f1', goal:'firstLayer'}),
  corner:()=>({base:'', setup:invertAlg(rep(ALGS.wiggle,pick([1,3,5]))).concat([Upow(1+rnd(3))]), focus:'f1', goal:'firstLayer'}),
  cornerAny:()=>{ const m=rnd(4); const y=Array(m).fill('y'), yi=Array(m).fill("y'");
    const inner = rnd(3)===0 ? invertAlg(rep(ALGS.wiggle,pick([2,4]))) : invertAlg(rep(ALGS.wiggle,pick([1,3,5]))).concat([Upow(rnd(4))]);
    return {base:'', setup:[...y,...inner,...yi].filter(Boolean), focus:'f1', goal:'firstLayer'}; },
  cornerStuck:()=>({base:'', setup:invertAlg(rep(ALGS.wiggle,pick([2,4]))), focus:'f1', goal:'firstLayer'}),
  slide:()=>{ const a=pick([ALGS.slideR,ALGS.slideL]); return {base:'', setup:invertAlg(a).concat([Upow(rnd(4))]).filter(Boolean), focus:'f2l', goal:'twoLayers'}; },
  slideFlip:()=>({base:'', setup:invertAlg(ALGS.slideR+' U2 '+ALGS.slideR), focus:'f2l', goal:'twoLayers'}),
  ycross:()=>{ let s,c; do{ s=[]; const n=1+rnd(3); for(let i=0;i<n;i++){ s.push(Upow(rnd(4))); s.push(...invertAlg(ALGS.sandwich)); } s=s.filter(Boolean); c=stateOf('',s); }while(c.yellowCross()); return {base:'', setup:s, focus:'ytop', goal:'yellowCross'}; },
  yedges:()=>{ let s,c,ok; do{ s=[]; const n=1+rnd(3); for(let i=0;i<n;i++){ s.push(Upow(rnd(4))); s.push(...parseAlg(ALGS.swirl)); } s=s.filter(Boolean); c=stateOf('',s); ok=false; for(let k=0;k<4;k++){ if(c.yellowEdges()) ok=true; c.move('U'); } }while(ok); return {base:'', setup:s, focus:'yedges', goal:'yellowEdges'}; },
  corners:()=>{ let s,c; do{ s=[]; const n=1+rnd(2); for(let i=0;i<n;i++){ const m=rnd(4); s.push(...Array(m).fill('y'), ...parseAlg(ALGS.swap), ...Array(m).fill("y'")); } c=stateOf('',s); }while(c.cornersPlaced()); return {base:'', setup:s, focus:'all', goal:'cornersPlaced'}; },
  twist:()=>{ let t; do{ t=[rnd(3),rnd(3),rnd(3),rnd(3)]; }while(t.every(x=>!x)||(t[0]+t[1]+t[2]+t[3])%3); const s=[]; t.forEach(x=>{ s.push(...parseAlg(rep(ALGS.dig,2*x)||'')); s.push('U'); }); return {base:'', setup:s.filter(Boolean), focus:'all', goal:'isSolved'}; },
};
const GOALS = {
  daisy:c=>c.daisy(), cross:c=>c.cross(), firstLayer:c=>c.firstLayer(), twoLayers:c=>c.twoLayers(),
  yellowCross:c=>c.twoLayers()&&c.yellowCross(), yellowEdges:c=>c.twoLayers()&&c.yellowEdges(),
  cornersPlaced:c=>c.twoLayers()&&c.yellowEdges()&&c.cornersPlaced(), isSolved:c=>c.isSolved()
};
const SPOT = {
  cornerCount:()=>{ const n=pick([1,3,5]); return {setup:invertAlg(rep(ALGS.wiggle,n)), focus:'f1', q:'How many Jabs drop this corner home?', options:['1','3','5'], answer:String(n), px:true,
    why:{1:'White faces right: 1 Wiggle.',3:'White faces up: 3 Wiggles.',5:'White faces you: 5 Wiggles.'}[n]}; },
  slideDir:()=>{ const r=rnd(2); return {setup:invertAlg(r?ALGS.slideR:ALGS.slideL), focus:'f2l', q:'The front of this edge matches green. Which way does it slide?', options:['Left','Right'], answer:r?'Right':'Left',
    why:r?'Its top color is orange, and orange is on the right.':'Its top color is red, and red is on the left.'}; },
  crossShape:()=>{ const g=GEN.ycross(); const c=stateOf('',g.setup); return {setup:g.setup, focus:'ytop', q:'What shape is on the yellow top? (Edges only, skip the corners.)', options:['Dot','L shape','Line'], answer:yShape(c),
    why:{'Dot':'No yellow edges up. That is a dot.','L shape':'Two yellow edges side by side make an L.','Line':'Two yellow edges straight across make a line.'}[yShape(c)]}; },
  placed:()=>{ const g=GEN.corners(); const c=stateOf('',g.setup); const q=c.cubies.find(q=>q.type==='corner'&&q.pos.join(',')==='1,1,1'); const ok=c.piecePlaced(q);
    return {setup:g.setup, focus:'all', q:'Is the front-right top corner in its home spot? (Twisted still counts.)', options:['Yes','No'], answer:ok?'Yes':'No',
      why:ok?'Its three colors match the three centers around it.':'Its colors do not match the centers around it.'}; },
};

// ---------- levels ----------
// step types: say, watch, tap, name, quiz, spot, copy, puzzle, mission, recall
const NOTATION_ALL=["R","R'","U","U'","F","F'","L","L'","D","D'"];
const J=ALGS.wiggle;
const WORLDS = [
 { id:'w1', scene:'street', title:'Maple Street', sub:'Learn the turns', levels:[
  { id:'1.1', name:'The cube', steps:[
    {t:'say', text:"Something came out of the cube last night. The only way to send it back is to learn to solve it. I'm Leighton. Let's go.", setup:'', focus:'all'},
    {t:'say', text:"First rule: the middle squares are <b>centers</b> and they never move. Yellow is on top, white on the bottom, green faces you.", focus:'centers'},
    {t:'quiz', q:'Which color is on the bottom?', options:['White','Yellow','Blue'], answer:'White', focus:'centers'},
    {t:'quiz', q:'Edge pieces have 2 colors. How many does a corner have?', options:['2','3','4'], answer:'3', px:true, focus:'all'},
    {t:'quiz', q:'Green faces you. What color is on the back?', options:['Red','Blue','Orange'], answer:'Blue', focus:'centers', why:'Green and blue are always opposite. So are red and orange.'},
    {t:'say', text:"Hold your real cube the same way: <b>yellow up, green toward you.</b> Every hit you land from here on is a turn.", focus:'all'},
  ]},
  { id:'1.2', name:'R means right', steps:[
    {t:'say', text:"Every face has a letter. <b>R</b> is the right side. It turns up, away from you.", focus:'all'},
    {t:'watch', alg:'R', text:'R'},
    {t:'watch', alg:"R'", text:"R' (say \"R prime\") turns it back down."},
    {t:'tap', moves:['R',"R'",'R','R',"R'","R'"], pad:['R',"R'"]},
    {t:'name', count:3, pool:['R',"R'"]},
  ]},
  { id:'1.3', name:'Top and front', steps:[
    {t:'say', text:"<b>U</b> is the top. The front row slides left. <b>U'</b> slides it back right."},
    {t:'watch', alg:"U U'", text:"U, then U'"},
    {t:'tap', moves:['U',"U'",'U','U',"U'"], pad:['U',"U'"]},
    {t:'say', text:"<b>F</b> is the front. Turn it like a steering wheel, clockwise."},
    {t:'watch', alg:"F F'", text:"F, then F'"},
    {t:'tap', moves:['F',"F'","F'",'F'], pad:['F',"F'"]},
    {t:'name', count:4, pool:['U',"U'",'F',"F'",'R',"R'"]},
  ]},
  { id:'1.4', name:'Left and down', steps:[
    {t:'say', text:"<b>L</b> is the left side. Its front moves down, the opposite of R."},
    {t:'watch', alg:"L L'", text:"L, then L'"},
    {t:'say', text:"<b>D</b> is the bottom. The front row slides right."},
    {t:'watch', alg:"D D'", text:"D, then D'"},
    {t:'tap', moves:['L','D',"L'","D'",'L','D'], pad:['L',"L'",'D',"D'"]},
    {t:'name', count:5, pool:NOTATION_ALL},
  ]},
  { id:'1.5', name:'Turn Tag', boss:true, skill:'notation', steps:[
    {t:'say', text:"Boss fight. 16 turns, as fast as you can. Don't think. Just hit."},
    {t:'tap', count:16, pool:NOTATION_ALL, pad:NOTATION_ALL, timed:[22,35]},
  ]},
 ]},
 { id:'w2', scene:'garden', title:'The Greenhouse', sub:'The white cross', levels:[
  { id:'2.1', name:'The daisy', steps:[
    {t:'say', text:"Step one of the solve is a <b>daisy</b>: yellow center on top with four white edges around it, white facing up.", setup:DAISY, focus:'cross'},
    {t:'say', text:"Only the white edges matter right now, so I grayed out everything else. Each white edge is a petal."},
    {t:'puzzle', gen:'petal1', count:3, pad:['F',"F'",'R',"R'"], text:'A petal got knocked off. Put it back, white side up.'},
  ]},
  { id:'2.2', name:'Guard the petals', steps:[
    {t:'say', text:"Before you lift a new petal, turn the top so an empty spot is right above it. That way you don't knock an old one off.", setup:DAISY, focus:'cross'},
    {t:'puzzle', gen:'petal2', count:4, pad:['U',"U'",'F',"F'",'R',"R'",'D',"D'"], text:'Rescue the petal. Keep the others on top.'},
  ]},
  { id:'2.3', name:'Plant it', steps:[
    {t:'say', text:"Now plant the petals. Turn the top until a petal's side color matches the center under it. Then turn that face twice.", setup:'F2 U', focus:'cross'},
    {t:'watch', alg:"U' F2", setup:'F2 U', focus:'cross', text:'Match it up, then turn the face twice.'},
    {t:'puzzle', gen:'cross1', count:3, pad:['U',"U'",'F',"F'",'R',"R'"], text:'Match the petal with its center, then plant it.'},
  ]},
  { id:'2.4', name:'White cross', boss:true, steps:[
    {t:'say', text:"Plant all four. <b>y</b> turns the whole cube, so you can always work on the front.", setup:DAISY, focus:'cross'},
    {t:'puzzle', gen:'crossAll', count:2, pad:['U',"U'",'F',"F'",'y',"y'"], text:'Plant all four petals for a white cross.'},
    {t:'mission', title:'On your real cube', items:['Hold yellow up.','Make the daisy: four white edges around yellow.','Match each petal to its center and turn that face twice.','Flip the cube. White cross on the bottom.'], tip:'Lost a petal? Turn the top first so the empty spot sits above the piece you want to lift.'},
  ]},
 ]},
 { id:'w3', scene:'pond', title:"Hatcher's Pond", sub:'White corners', levels:[
  { id:'3.1', name:'The Jab', skill:'wiggle', steps:[
    {t:'say', text:"Time for my favorite move. <b>The Jab</b>: R U R' U'. You'll use it more than anything else in this whole game.", setup:invertAlg(J), focus:'all'},
    {t:'watch', alg:J, setup:invertAlg(J), chant:SKILL_ALGS.wiggle.chant, text:"R U R' U'"},
    {t:'copy', alg:J, ladder:true, reps:4, setup:invertAlg(J), chant:SKILL_ALGS.wiggle.chant},
  ]},
  { id:'3.2', name:'Six Jabs', steps:[
    {t:'say', text:"Weird fact: do the Jab 6 times in a row and the cube goes right back to how it started. Go.", setup:'', focus:'all'},
    {t:'copy', alg:J, reps:6, fade:3, setup:'', keep:true, timed:[14,25], chant:SKILL_ALGS.wiggle.chant},
  ]},
  { id:'3.3', name:'Corner drop', steps:[
    {t:'say', text:"White corner on top, sitting right above its home? Jab until it drops in.", setup:invertAlg(J), focus:'f1'},
    {t:'say', text:"Look where the white sticker points. <b>Right: 1</b> Jab. <b>Up: 3</b>. <b>At you: 5</b>."},
    {t:'spot', gen:'cornerCount', count:3},
    {t:'puzzle', gen:'corner0', count:3, pad:['R',"R'",'U',"U'"], text:'Jab the corner home.'},
  ]},
  { id:'3.4', name:'Find its home', steps:[
    {t:'say', text:"Corner in the wrong spot? Turn the top until it sits above the gap between its two side colors.", setup:invertAlg(J).join(' ')+' U2', focus:'f1'},
    {t:'puzzle', gen:'corner', count:4, pad:['R',"R'",'U',"U'"], text:'Line it up, then Jab it home.'},
  ]},
  { id:'3.5', name:'Stuck corners', boss:true, steps:[
    {t:'say', text:"Corner stuck in the bottom, twisted wrong? Just keep Jabbing. It pops up and drops back in the right way.", setup:invertAlg(rep(J,2)), focus:'f1'},
    {t:'puzzle', gen:'cornerStuck', count:2, pad:['R',"R'",'U',"U'"], text:'Jab until the corner is fixed.'},
    {t:'puzzle', gen:'cornerAny', count:3, pad:['R',"R'",'U',"U'",'y',"y'"], text:"Turn the cube so the corner's home is front-right, then Jab."},
    {t:'mission', title:'Finish the white layer', items:['White cross on the bottom.','Find a white corner on top.','Turn the top until it sits above its home.','Jab until it drops in. Do all four.'], tip:'Keep the cube still and let the Jab do the work. Right 1, up 3, at you 5.'},
  ]},
 ]},
 { id:'w4', scene:'creek', title:'Black Creek', sub:'The middle layer', levels:[
  { id:'4.1', name:'Right Slide', skill:'slideR', steps:[
    {t:'say', text:"Middle layer. You fill it with Slides.", setup:invertAlg(ALGS.slideR), focus:'f2l'},
    {t:'say', text:"This edge's front matches green. Its top is orange, and orange is on the right. So it slides <b>right</b>."},
    {t:'watch', alg:ALGS.slideR, setup:invertAlg(ALGS.slideR), focus:'f2l', chant:SKILL_ALGS.slideR.chant, text:'Two halves: the first half moves away, the second half tucks in.'},
    {t:'copy', alg:ALGS.slideR, ladder:true, reps:4, setup:invertAlg(ALGS.slideR), focus:'f2l', chant:SKILL_ALGS.slideR.chant},
  ]},
  { id:'4.2', name:'Left Slide', skill:'slideL', steps:[
    {t:'say', text:"Same thing, other side. Top color red? Red is on the left. Slide left.", setup:invertAlg(ALGS.slideL), focus:'f2l'},
    {t:'watch', alg:ALGS.slideL, setup:invertAlg(ALGS.slideL), focus:'f2l', chant:SKILL_ALGS.slideL.chant, text:'Mirror image of the Right Slide.'},
    {t:'copy', alg:ALGS.slideL, ladder:true, reps:4, setup:invertAlg(ALGS.slideL), focus:'f2l', chant:SKILL_ALGS.slideL.chant},
  ]},
  { id:'4.3', name:'Which way?', skill:'slideDir', steps:[
    {t:'say', text:"Read the edge's top color. Find that center. That's the side it slides to."},
    {t:'spot', gen:'slideDir', count:6},
  ]},
  { id:'4.4', name:'Creek run', steps:[
    {t:'say', text:"Turn the top until the edge's front matches its center. Then pick a side and slide.", setup:invertAlg(ALGS.slideR).join(' ')+' U', focus:'f2l'},
    {t:'puzzle', gen:'slide', count:4, pad:['U',"U'",'R',"R'",'L',"L'",'F',"F'"], text:'Line it up and slide it in.'},
  ]},
  { id:'4.5', name:'Flipped edge', boss:true, steps:[
    {t:'say', text:"Edge in the right slot but flipped? Slide any top edge into that slot to kick it out. Then slide it back in the right way.", setup:invertAlg(ALGS.slideR+' U2 '+ALGS.slideR), focus:'f2l'},
    {t:'puzzle', gen:'slideFlip', count:1, pad:['U',"U'",'R',"R'",'L',"L'",'F',"F'"], text:'Kick it out, then slide it in.'},
    {t:'puzzle', gen:'slide', count:2, pad:['U',"U'",'R',"R'",'L',"L'",'F',"F'",'y',"y'"], text:'Two more. Finish him.'},
    {t:'mission', title:'Two layers on your cube', items:['White layer done, white on the bottom.','Find a top edge with no yellow on it.','Turn the top until its front matches the center.','Its top color tells you: slide left or right.'], tip:'No edges without yellow up top? One is stuck in a slot. Slide any edge in there to kick it out.'},
  ]},
 ]},
 { id:'w5', scene:'farm', title:'Mercer Farm', sub:'The yellow cross', levels:[
  { id:'5.1', name:'The Sandwich', skill:'sandwich', steps:[
    {t:'say', text:"Bottom two layers done. Now the top. First, a yellow cross, and the Sandwich makes it.", setup:invertAlg(ALGS.sandwich), focus:'ytop'},
    {t:'say', text:"It's just F, then the Jab you already know, then F'. Bread, Jab, bread."},
    {t:'watch', alg:ALGS.sandwich, setup:invertAlg(ALGS.sandwich), focus:'ytop', chant:SKILL_ALGS.sandwich.chant, text:'Front, Jab, front back.'},
    {t:'copy', alg:ALGS.sandwich, ladder:true, reps:4, setup:invertAlg(ALGS.sandwich), focus:'ytop', chant:SKILL_ALGS.sandwich.chant},
  ]},
  { id:'5.2', name:'Dot, L, line', skill:'crossShape', steps:[
    {t:'say', text:"Look only at the yellow edges on top. You'll see a <b>dot</b>, an <b>L</b>, or a <b>line</b>."},
    {t:'spot', gen:'crossShape', count:4},
    {t:'say', text:"Dot: Sandwich from anywhere. L: point it back and left, then Sandwich. Line: hold it left to right, then Sandwich."},
    {t:'quiz', q:'You see an L. Where should it point before the Sandwich?', options:['Back and left','Front and right'], answer:'Back and left'},
    {t:'quiz', q:'You see a line. How do you hold it?', options:['Left to right','Front to back'], answer:'Left to right'},
  ]},
  { id:'5.3', name:'Yellow cross', boss:true, steps:[
    {t:'puzzle', gen:'ycross', count:3, pad:['U',"U'",'F',"F'",'R',"R'"], text:'Make the yellow cross. Hold the shape right, then Sandwich.'},
  ]},
 ]},
 { id:'w6', scene:'drivein', title:'The Drive-In', sub:'Yellow edges', levels:[
  { id:'6.1', name:'The Tornado', skill:'swirl', steps:[
    {t:'say', text:"The Tornado spins the top edges around and leaves everything else alone.", setup:invertAlg(ALGS.swirl), focus:'yedges'},
    {t:'watch', alg:ALGS.swirl, setup:invertAlg(ALGS.swirl), focus:'yedges', chant:SKILL_ALGS.swirl.chant, text:"R U R' U R U2 R'"},
    {t:'copy', alg:ALGS.swirl, ladder:true, reps:4, setup:invertAlg(ALGS.swirl), focus:'yedges', chant:SKILL_ALGS.swirl.chant},
  ]},
  { id:'6.2', name:'Match the edges', boss:true, steps:[
    {t:'say', text:"Turn the top until two edges match their centers. Put those two at the <b>back and right</b>. Tornado. Then turn the top to line it all up."},
    {t:'say', text:"Matching edges straight across from each other? Tornado once from anywhere and look again."},
    {t:'puzzle', gen:'yedges', count:3, pad:['U',"U'",'R',"R'",'y',"y'"], text:'Get all four top edges matching their centers.'},
  ]},
 ]},
 { id:'w7', scene:'hollow', title:'The Hollow', sub:'Corner spots', levels:[
  { id:'7.1', name:'The Switch', skill:'swap', steps:[
    {t:'say', text:"The Switch moves three top corners around. The front-right corner stays put.", setup:invertAlg(ALGS.swap), focus:'all'},
    {t:'watch', alg:ALGS.swap, setup:invertAlg(ALGS.swap), focus:'all', chant:SKILL_ALGS.swap.chant, text:'Top, right. Top, left.'},
    {t:'copy', alg:ALGS.swap, ladder:true, reps:4, setup:invertAlg(ALGS.swap), focus:'all', chant:SKILL_ALGS.swap.chant},
  ]},
  { id:'7.2', name:'Home spots', skill:'placed', steps:[
    {t:'say', text:"A corner is home when its 3 colors match the 3 centers around it. Twisted still counts. We fix twists last."},
    {t:'spot', gen:'placed', count:4},
  ]},
  { id:'7.3', name:'Corner shuffle', boss:true, steps:[
    {t:'say', text:"Find a corner that's home. Turn the cube so it's front-right. Switch until all four are home. None home? Switch once from anywhere."},
    {t:'puzzle', gen:'corners', count:3, pad:['U',"U'",'R',"R'",'L',"L'",'y',"y'"], text:'Get every top corner to its home spot.'},
  ]},
 ]},
 { id:'w8', scene:'mine', title:'Old Mine No. 9', sub:'The final twist', levels:[
  { id:'8.1', name:'The Drill', skill:'dig', steps:[
    {t:'say', text:"Last move you need: <b>the Drill</b>. Four turns. It twists a corner in place.", setup:invertAlg(rep(ALGS.dig,2)), focus:'all'},
    {t:'watch', alg:rep(ALGS.dig,2), setup:invertAlg(rep(ALGS.dig,2)), focus:'all', chant:SKILL_ALGS.dig.chant, text:"R' D' R D, twice"},
    {t:'copy', alg:ALGS.dig, ladder:true, reps:4, setup:'', keep:true, focus:'all', chant:SKILL_ALGS.dig.chant},
  ]},
  { id:'8.2', name:'Trust the mess', steps:[
    {t:'say', text:"Twisted corner goes front-right. Drill until yellow is on top. The bottom WILL look wrecked. Ignore it."},
    {t:'say', text:"Then turn <b>only the top</b> to bring the next twisted corner front-right. Drill again. It all fixes itself at the end."},
    {t:'puzzle', gen:'twist', count:3, pad:['R',"R'",'D',"D'",'U',"U'"], text:'Twist every corner yellow-up. Never turn the whole cube.'},
  ]},
  { id:'8.3', name:'The Scrambler', boss:true, steps:[
    {t:'say', text:"This is it. The Scrambler. Everything you learned, one solve, on your real cube. Let's close this rift."},
    {t:'mission', title:'Solve the whole cube', solve:true, items:['Daisy, then white cross','White corners (Jab)','Middle layer (Slides)','Yellow cross (Sandwich)','Yellow edges (Tornado)','Corners home (Switch)','Twist corners (Drill)'], tip:'Stuck on a step? Go back and replay that level from the map. They stay open.'},
  ]},
 ]},
 { id:'w9', scene:'tower', title:'The Clocktower', sub:'Get fast', levels:[
  { id:'9.1', name:'Fast hands', steps:[
    {t:'say', text:"Speed is just clean moves, over and over. Six Jabs. Go.", setup:'', focus:'all'},
    {t:'copy', alg:J, reps:6, fade:3, setup:'', keep:true, timed:[9,16]},
    {t:'copy', alg:ALGS.slideR, reps:2, fade:3, setup:invertAlg(ALGS.slideR), focus:'f2l', timed:[9,16]},
  ]},
  { id:'9.2', name:'Recall run', steps:[
    {t:'say', text:"All seven moves, mixed up on purpose, no hints on screen. Mixing them is what makes them stick."},
    {t:'recall', count:7},
  ]},
  { id:'9.3', name:'Under two minutes', boss:true, steps:[
    {t:'say', text:"Real cube, real clock. Beat two minutes and Scrambler Prime goes down for good."},
    {t:'mission', title:'Sub 2:00 solve', solve:true, target:120, items:['Scramble your cube.','Start the clock and solve it.','Tap Done the second it is solved.'], tip:'Most of the time goes to looking around. Find your next piece while your hands finish the last move.'},
  ]},
 ]},
];
const LEVELS=[]; WORLDS.forEach((w,wi)=>w.levels.forEach((l,li)=>{ l.world=w; l.wi=wi; l.li=li; l.index=LEVELS.length; l.mon=MONSTERS[l.id]; LEVELS.push(l); }));

const RANKS=[[0,'Rookie'],[150,'Monster Spotter'],[450,'Corner Crusher'],[900,'Edge Hunter'],[1400,'Rift Fighter'],[2000,'Night Patrol'],[2700,'Monster Slayer'],[3500,'Cube Master'],[5000,'Legend of Twistwood']];
const BOX_DAYS=[0,1,2,4,8,16,32];
