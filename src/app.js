{
window.__reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
const fmt=s=>{ if(s==null) return '-'; const m=Math.floor(s/60), r=s-m*60; return m? `${m}:${r.toFixed(1).padStart(4,'0')}` : r.toFixed(2); };
const today=()=>{ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };
const DAY=864e5;

// ---------- save data ----------
const KEY='twistwood.v1';
let S={ levels:{}, xp:0, streak:{n:0,last:''}, skills:{}, sound:true, times:[], solved:false, openAll:false };
try{ const raw=localStorage.getItem(KEY); if(raw) S=Object.assign(S, JSON.parse(raw)); }catch(e){}
const save=()=>{ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} };
S.music=S.music!==false; Sound.on=S.sound; Sound.music=S.music;
const unlocked=i=> S.openAll || i===0 || !!S.levels[LEVELS[i-1].id];
const rankOf=xp=>{ let r=RANKS[0][1]; for(const [n,name] of RANKS) if(xp>=n) r=name; return r; };
const starTotal=()=>Object.values(S.levels).reduce((a,l)=>a+(l.stars||0),0);
const dueSkills=()=>Object.entries(S.skills).filter(([k,v])=>v.due<=Date.now()).map(([k])=>k);
const bestTime=()=>S.times.length? Math.min(...S.times.map(t=>t.t)) : null;
function bumpStreak(){ const t=today(); if(S.streak.last===t) return; const y=new Date(Date.now()-DAY); const ys=y.getFullYear()+'-'+String(y.getMonth()+1).padStart(2,'0')+'-'+String(y.getDate()).padStart(2,'0'); S.streak.n = S.streak.last===ys ? S.streak.n+1 : 1; S.streak.last=t; }
const monSVG=(m,cls='')=>spriteSVG(m.sp,cls,m.hue?`filter:hue-rotate(${m.hue}deg)`:'');
const downCount=()=>LEVELS.filter(l=>S.levels[l.id]).length;

// ---------- screens ----------
let current='home';
function show(id){ $$('.screen').forEach(s=>s.classList.toggle('on', s.id===id)); current=id; if(['home','map','friends'].includes(id)) Sound.bed('menu'); if(id==='timer') Sound.bed('story'); if(id==='home') renderHome(); if(id==='map') renderMap(); if(id==='friends') renderFriends(); if(id==='timer') renderTimer(); }
document.addEventListener('pointerdown',()=>Sound.init(),{once:true});
document.addEventListener('click',e=>{ const b=e.target.closest('[data-go]'); if(b){ Sound.tap(); show(b.dataset.go); } });

// ---------- home ----------
function renderHome(){
  const due=dueSkills().length;
  $('#homeWarm').innerHTML = due? `Warm-up <span class="px" style="opacity:.8">${due}</span>` : 'Warm-up';
  const next=LEVELS.find((l,i)=>unlocked(i)&&!S.levels[l.id]);
  $('#homePlay').textContent = Object.keys(S.levels).length? (next? `Continue ${next.id}` : 'Replay levels') : 'Start learning';
  $('#heroLei').innerHTML=spriteSVG('leighton')+'<div class="orb"></div>';
  $('#heroMons').innerHTML=[MONSTERS['1.3'],MONSTERS['8.3'],MONSTERS['1.2']].map(m=>`<div>${monSVG(m)}</div>`).join('');
  const bt=bestTime();
  $('#homeStats').innerHTML = `
    <div class="stat"><b>${S.streak.n}</b><span>day streak</span></div>
    <div class="stat"><b>${S.xp}</b><span>XP, ${esc(rankOf(S.xp))}</span></div>
    <div class="stat"><b>${downCount()}<span style="font-size:15px;color:var(--faint)">/${LEVELS.length}</span></b><span>monsters down</span></div>
    <div class="stat"><b>${bt?fmt(bt):'-'}</b><span>best real solve</span></div>
    <div class="home-links">
      <button class="row-btn" data-go="friends">${spriteSVG('zombie')} Monster files</button>
      <button class="row-btn" data-go="timer">${spriteSVG('robot')} Speed timer</button>
      <button class="row-btn" id="openSettings">${spriteSVG('face')} Settings</button>
    </div>`;
  $('#openSettings').onclick=openSettings;
}
$('#homePlay').onclick=()=>{ Sound.tap(); show('map'); setTimeout(()=>{ const el=$('.lvl.open'); el&&el.scrollIntoView({block:'center',behavior:'smooth'}); },120); };
$('#homeWarm').onclick=()=>{ Sound.tap(); startWarmup(); };

// ---------- map ----------
function renderMap(){
  $('#mapXP').innerHTML=`${ICON.bolt}${S.xp}`; $('#mapStreak').innerHTML=`${ICON.flame}${S.streak.n}`;
  const nxt=LEVELS.findIndex((l,i)=>unlocked(i)&&!S.levels[l.id]);
  $('#mapBody').innerHTML = WORLDS.map((w,wi)=>{
    const first=w.levels[0].index, open=unlocked(first);
    const boss=w.levels[w.levels.length-1].mon;
    return `<section class="world">
      <div class="world-card ${open?'':'locked'}"><div class="art">${sceneSVG(w.scene,200,60,wi*7+3)}<div class="boss-sp">${monSVG(boss)}</div>
        <div class="cap"><div class="mono">World ${wi+1}</div><h3>${esc(w.title)}. <span>${esc(w.sub)}.</span></h3></div></div></div>
      <div class="levels">${w.levels.map(l=>{ const i=l.index, rec=S.levels[l.id], u=unlocked(i);
        const cls=rec?'done':(u&&i===nxt)?'open':u?'done':'locked';
        const st=rec?rec.stars:0;
        return `<div class="lvl ${cls} ${l.boss?'boss':''}"><button class="node" data-lvl="${i}" ${u?'':'disabled'} aria-label="Level ${l.id} ${esc(l.name)}, ${esc(l.mon.name)}">${u?monSVG(l.mon):ICON.lock}</button>
          <span class="code">${l.id}</span><div class="stars">${rec?[0,1,2].map(k=>ICON.star(k<st)).join(''):''}</div><div class="name">${esc(l.name)}<br><span style="color:var(--faint)">${u?esc(l.mon.name):'???'}</span></div></div>`; }).join('')}</div>
    </section>`; }).join('');
  $$('#mapBody [data-lvl]').forEach(b=>{ b.onclick=()=>{ Sound.tap(); startLevel(+b.dataset.lvl); }; });
}

// ---------- friends ----------
function renderFriends(){
  $('#filesCount').innerHTML=`${ICON.skull}${downCount()}/${LEVELS.length}`;
  $('#friendsBody').innerHTML = LEVELS.map((l,i)=>{ const m=l.mon, d=!!S.levels[l.id];
    return `<article class="fcard ${d?'':'locked'}"><div class="cover"><div class="pic">${sceneSVG(l.world.scene,120,56,i*5+2)}<div class="who">${monSVG(m)}</div></div>
      <h3>${d?esc(m.name):'???'} <span>${m.boss?'Boss':'Level '+l.id}</span></h3><p>${d?esc(m.bio):'Beat level '+l.id+' to open this file.'}</p>
      <div class="owns"><span class="mono">${esc(l.world.title)}</span>${d?'<span class="stamp">DEFEATED</span>':''}</div></div></article>`; }).join('');
}

// ---------- settings ----------
function openSettings(){
  const m=$('#settings'); m.classList.add('on');
  const paint=()=>{ $('#swSound').classList.toggle('on',S.sound); $('#swMusic').classList.toggle('on',S.music); $('#swOpen').classList.toggle('on',S.openAll); };
  paint();
  $('#swSoundRow').onclick=()=>{ S.sound=!S.sound; Sound.setOn(S.sound); save(); paint(); Sound.tap(); };
  $('#swMusicRow').onclick=()=>{ S.music=!S.music; Sound.setMusic(S.music); save(); paint(); };
  $('#swOpenRow').onclick=()=>{ S.openAll=!S.openAll; save(); paint(); };
  let armed=false; const rb=$('#resetBtn'); rb.textContent='Reset all progress';
  rb.onclick=()=>{ if(!armed){ armed=true; rb.textContent='Tap again to erase everything'; return; } S={ levels:{}, xp:0, streak:{n:0,last:''}, skills:{}, sound:S.sound, music:S.music, times:[], solved:false, openAll:false }; save(); m.classList.remove('on'); renderHome(); };
  $('#closeSettings').onclick=()=>{ m.classList.remove('on'); if(current==='home') renderHome(); };
}

// ---------- lesson engine ----------
const L={};
L.root=$('#lesson'); L.view=new CubeView($('#cubeHost'));
$('#viewReset').onclick=()=>L.view.resetView();
let lesson=null;

function simplify(toks){
  let a=toks.map(t=>parseMove(t)).map(m=>({f:m.face,n:((m.turns%4)+4)%4}));
  let changed=true;
  while(changed){ changed=false; const out=[];
    for(const m of a){ const last=out[out.length-1]; if(m.n===0){changed=true;continue;} if(last&&last.f===m.f){ last.n=(last.n+m.n)%4; changed=true; if(last.n===0) out.pop(); } else out.push({...m}); }
    a=out; }
  return a.map(m=>m.f+(m.n===1?'':m.n===2?'2':"'"));
}
function crossHint(c,pad){
  const up=c.dirOf('Y');
  const petals=c.edgesWith('W').filter(q=>eqV(c.stickerNormal(q,'W'),up));
  if(!petals.length) return null;
  const faces={F:[0,0,1],R:[1,0,0],B:[0,0,-1],L:[-1,0,0]};
  for(const q of petals){
    const side=q.stickers.find(s=>s.c!=='W').c;
    for(let k=0;k<4;k++){
      const t=c.clone(); for(let i=0;i<k;i++) t.move('U');
      const tq=t.cubies[q.id]; const n=t.stickerNormal(tq,side);
      if(t.centerColor(n)===side){ const f=Object.keys(faces).find(f=>eqV(faces[f],n));
        const pre=Upow(k)?[Upow(k)]:[]; if(pad.includes(f)) return [...pre,f+'2']; if(!pad.includes('y')) continue; return [...pre, {R:'y',L:"y'",B:'y2'}[f], 'F2']; }
    }
  }
  return null;
}

// typewriter for the dialog box; tap the box to finish instantly
let typeTimer=null;
function typeOut(b){
  clearInterval(typeTimer);
  const txt=b.querySelector('.txt'); if(!txt) return;
  const nodes=[]; const walk=n=>{ for(const c of n.childNodes){ if(c.nodeType===3){ nodes.push([c,c.textContent]); c.textContent=''; } else walk(c); } }; walk(txt);
  if(window.__reduced){ nodes.forEach(([n,t])=>n.textContent=t); return; }
  b.classList.add('typing'); let ni=0, ci=0, k=0;
  const finish=()=>{ clearInterval(typeTimer); nodes.forEach(([n,t])=>n.textContent=t); b.classList.remove('typing'); b.onclick=null; };
  b.onclick=finish;
  typeTimer=setInterval(()=>{
    for(let step=0;step<2;step++){
      if(ni>=nodes.length){ finish(); return; }
      const [n,t]=nodes[ni]; ci++; n.textContent=t.slice(0,ci); if(ci>=t.length){ ni++; ci=0; }
    }
    if((k++)%2===0) Sound.type();
  },16);
}

// ---------- the battle strip ----------
const COLOR_OF={R:'O',L:'R',U:'Y',D:'W',F:'G',B:'B'};
const Arena={
  mon:null,
  setup(mon, scene){
    this.mon=mon;
    $('#arenaScene').innerHTML=sceneSVG(scene,200,64,mon.name.length*13+7);
    $('#arenaHero').innerHTML=spriteSVG('leighton');
    $('#arenaMon').className='mon'+(mon.boss?' boss':'');
    $('#arenaMonBody').innerHTML=monSVG(mon);
    const nm=$('#monName'); nm.textContent=mon.name; nm.className='nm'+(mon.boss?' boss':'');
    this.hp(1,true); requestAnimationFrame(()=>this.placeOrb());
    clearTimeout(this.t1); this.t1=setTimeout(()=>this.taunt(mon.taunt),600); Sound.roar(mon.boss);
  },
  placeOrb(){ const ar=$('#arena'); if(!ar) return; const a=ar.getBoundingClientRect(), h=$('#arenaHero').getBoundingClientRect(); const o=$('#arenaOrb'); o.style.left=(h.right-a.left-h.width*.12)+'px'; o.style.top=(h.top-a.top+h.height*.6)+'px'; },
  hp(v,instant){ const i=$('#monHP'); if(instant){ i.style.transition='none'; i.style.width=(v*100)+'%'; void i.offsetWidth; i.style.transition=''; } else i.style.width=Math.max(0,v*100)+'%'; },
  taunt(t){ const el=$('#monTaunt'); el.textContent=t; el.classList.add('show'); clearTimeout(this.tt); this.tt=setTimeout(()=>el.classList.remove('show'),2200); },
  attack(tok, combo=1){
    const ar=$('#arena'); if(!this.mon||current!=='lesson') return;
    const col = tok&&COLOR_OF[tok[0]] ? STICKER[COLOR_OF[tok[0]]] : '#5ec3e8';
    $('#arenaOrb').style.setProperty('--orb',col);
    const a=ar.getBoundingClientRect(), o=$('#arenaOrb').getBoundingClientRect(), m=$('#arenaMon').getBoundingClientRect();
    const sx=o.left-a.left, sy=o.top-a.top, tx=m.left-a.left+m.width*.4, ty=m.top-a.top+m.height*.45;
    const h=$('#arenaHero'); h.classList.remove('throw'); void h.offsetWidth; h.classList.add('throw'); Sound.shoot();
    const shot=document.createElement('div'); shot.className='shot'; shot.style.cssText=`left:${sx}px;top:${sy}px;background:${col};box-shadow:0 0 10px 3px ${col}`; ar.appendChild(shot);
    const an=shot.animate([{transform:'translate(0,0) rotate(0deg)'},{transform:`translate(${(tx-sx)/2}px,${(ty-sy)/2-24}px) rotate(180deg)`},{transform:`translate(${tx-sx}px,${ty-sy}px) rotate(360deg)`}],{duration:window.__reduced?1:240,easing:'linear'});
    an.onfinish=()=>{ shot.remove(); this.impact(ar,tx,ty,col,combo); };
  },
  impact(ar,x,y,col,combo){
    const mon=$('#arenaMon'); mon.classList.remove('hurt'); void mon.offsetWidth; mon.classList.add('hurt'); Sound.zap(combo);
    const crit=combo>=5;
    const d=document.createElement('div'); d.className='dmg'+(crit?' crit':''); d.textContent=crit?'CRIT!':'-'+(6+Math.floor(Math.random()*8)+Math.min(combo,9));
    d.style.left=(x-14+Math.random()*24)+'px'; d.style.top=(y-34)+'px'; ar.appendChild(d); setTimeout(()=>d.remove(),850);
    this.burst(ar,x,y,col,crit?12:6,crit?34:22);
  },
  burst(ar,x,y,col,n,rad){
    for(let i=0;i<n;i++){ const b=document.createElement('div'); b.className='boom'; b.style.cssText=`left:${x}px;top:${y}px;background:${Array.isArray(col)?pick(col):col}`; ar.appendChild(b);
      const ang=Math.random()*Math.PI*2, r=rad*(.5+Math.random()*.7);
      b.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${Math.cos(ang)*r}px,${Math.sin(ang)*r}px)`,opacity:0}],{duration:window.__reduced?1:420,easing:'ease-out'}).onfinish=()=>b.remove(); }
  },
  bite(){
    const mon=$('#arenaMon'); mon.classList.remove('lunge'); void mon.offsetWidth; mon.classList.add('lunge');
    const f=$('#arenaFlash'); f.classList.remove('on'); void f.offsetWidth; f.classList.add('on');
    const h=$('#arenaHero'); h.classList.remove('recoil'); void h.offsetWidth; h.classList.add('recoil');
    if(Math.random()<.6) this.taunt(pick(['Ha!','Missed me.','Too slow.','Hehehe.','Wrong way!',this.mon.taunt]));
  },
  async ko(){
    this.hp(0); await sleep(250);
    const ar=$('#arena'), mon=$('#arenaMon'); mon.classList.add('dead'); Sound.ko();
    const m=mon.getBoundingClientRect(), a=ar.getBoundingClientRect();
    this.burst(ar,m.left-a.left+m.width/2,m.top-a.top+m.height/2,['#ffe45c','#ff3b2f','#f3f1ea','#5ec3e8'],26,70);
    const k=$('#arenaKO'); k.textContent=this.mon.boss?'BOSS DOWN':'K.O.'; k.classList.remove('show'); void k.offsetWidth; k.classList.add('show');
    await sleep(1150); k.classList.remove('show');
  }
};
new ResizeObserver(()=>Arena.placeOrb()).observe($('#arena'));

class Lesson{
  constructor(opts){ Object.assign(this,{ steps:opts.steps, level:opts.level||null, warm:opts.warm||null, mon:opts.mon, who:'leighton', m:0, h:0, combo:0, xp:0, timed:null, dead:false, results:[] }); this.t0=performance.now(); }
  // waits for UI; rejects if lesson closed
  ask(fn){ return new Promise((res,rej)=>{ this.cancel=()=>rej('abort'); fn(res); }); }
  kill(){ this.dead=true; L.view.stop(); this.cancel&&this.cancel(); document.onkeydown=null; }
  say(who, html){
    $('#lsFace').innerHTML=spriteSVG('face'); const f=$('#lsFace'); f.classList.remove('talk'); void f.offsetWidth; f.classList.add('talk');
    const b=$('#lsBubble'); b.innerHTML=`<span class="who">Leighton</span><span class="txt">${html}</span><span class="caret"></span>`;
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    typeOut(b); }
  toast(txt,bad){ const t=$('#lsToast'); t.textContent=txt; t.className='toast'+(bad?' bad':''); void t.offsetWidth; t.classList.add('show'); }
  yay(){ this.toast(pick(HERO.yay)); }
  oops(){ this.toast(pick(HERO.oops),true); }
  hit(col){ this.combo++; this.xp+=2+Math.min(this.combo,10); Sound.good(this.combo); Arena.attack(col, this.combo); const el=$('#lsCombo'); el.innerHTML=this.combo>1?`x${this.combo}`:''; el.classList.toggle('hot',this.combo>=5); el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
  miss(){ this.m++; this.combo=0; $('#lsCombo').innerHTML=''; Sound.bad(); Arena.bite(); const st=$('#lsStage'); st.classList.remove('shake'); void st.offsetWidth; st.classList.add('shake'); }
  setCube(setup, focus){
    if(setup!==undefined){ const c=new Cube(); c.alg(typeof setup==='string'?setup:setup); L.view.setCube(c); }
    if(focus!==undefined){ this.focus=focus; L.view.setFocus(FOCUS[focus]); }
  }
  sub(f){ Arena.hp(1-Math.min(1,(this.i+Math.max(0,Math.min(1,f)))/this.steps.length)); }
  bar(){ $('#lsBar').innerHTML=this.steps.map((s,i)=>`<i class="${i<this.i?'done':i===this.i?'now':''}"></i>`).join(''); }
  task(html){ $('#lsTask').innerHTML=html||''; }
  controls(html){ $('#lsControls').innerHTML=html||''; }
  pad(keys, onPress){
    const dot=t=>{ const f=t[0]; const col={R:'O',L:'R',U:'Y',D:'W',F:'G',B:'B'}[f]; return col?`<span class="dot" style="background:${STICKER[col]}"></span>`:''; };
    const html=`<div class="pad">${keys.map(k=>`<button class="pk" data-k="${k}" aria-label="${k}">${dot(k)}${esc(k)}${moveGlyph(k)}</button>`).join('')}</div>`;
    return { html, bind:()=>{
      $$('#lsControls .pk').forEach(b=>b.onpointerdown=e=>{ e.preventDefault(); b.classList.add('press'); setTimeout(()=>b.classList.remove('press'),120); onPress(b.dataset.k,b); });
      document.onkeydown=e=>{ const map={r:'R',l:'L',u:'U',d:'D',f:'F',b:'B',y:'y'}; const f=map[e.key.toLowerCase()]; if(!f) return; const k=f+(e.shiftKey?"'":''); const b=$(`#lsControls .pk[data-k="${k}"]`); if(b){ e.preventDefault(); b.classList.add('press'); setTimeout(()=>b.classList.remove('press'),120); onPress(k,b); } };
    }};
  }
  glow(tok){ $$('#lsControls .pk').forEach(b=>b.classList.toggle('glow', b.dataset.k===tok)); }

  async run(){
    show('lesson');
    $('#lsTitle').textContent = this.level? `${this.level.id} ${this.level.name}` : 'Warm-up';
    $('#lsCombo').innerHTML='';
    this.setCube('', 'all'); L.view.resetView();
    Arena.setup(this.mon, this.level? this.level.world.scene : 'street');
    Sound.bed(this.warm?'match':(this.level&&this.level.boss?'code':'trivia'));
    try{
      for(this.i=0;this.i<this.steps.length;this.i++){
        this.bar(); const st=this.steps[this.i]; const m0=this.m, h0=this.h;
        this.task(''); this.controls(''); this.glow(null); document.onkeydown=null; L.view.arrow(null);
        if(st.setup!==undefined||st.focus!==undefined) this.setCube(st.setup, st.focus);
        await this['s_'+st.t](st);
        this.sub(1);
        this.results.push({skill:st.skill, clean:this.m===m0&&this.h===h0});
        if(this.dead) return;
      }
      this.i=this.steps.length; this.bar();
      await Arena.ko(); if(this.dead) return;
      this.finish();
    }catch(e){ if(e!=='abort') { console.error(e); } }
  }
  nextBtn(label='Next'){ return `<div class="btn-row"><button class="key dark big" id="bNext">${label}</button></div>`; }
  waitNext(label){ this.controls(this.nextBtn(label)); return this.ask(res=>{ $('#bNext').onclick=()=>{ Sound.tap(); res(); }; document.onkeydown=e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); res(); } }; }); }

  async s_say(st){ this.say(st.who, st.text); await this.waitNext(); }

  async s_watch(st){
    const toks=parseAlg(st.alg); const start=L.view.cube.clone();
    this.say(st.who||this.who, `${st.text?esc(st.text):''}${st.chant?`<br><span class="chant">"${esc(st.chant)}"</span>`:''}`);
    this.task(`<div class="chips">${toks.map((t,i)=>`<span class="chip" data-i="${i}">${esc(t)}</span>`).join('')}</div>`);
    const play=async()=>{ L.view.setCube(start.clone()); await sleep(250);
      await L.view.play(toks, toks.length>2?420:560, 130, i=>$$('#lsTask .chip').forEach((c,j)=>{ c.classList.toggle('now',j===i); c.classList.toggle('ok',j<i); })); };
    this.controls(`<div class="btn-row"><button class="key light big" id="bAgain">Watch again</button><button class="key dark big" id="bNext" disabled>Next</button></div>`);
    await play(); if(this.dead) throw 'abort';
    $('#bNext').disabled=false;
    await this.ask(res=>{ $('#bAgain').onclick=async()=>{ Sound.tap(); $('#bAgain').disabled=true; await play(); $('#bAgain')&&($('#bAgain').disabled=false); }; $('#bNext').onclick=()=>{ Sound.tap(); L.view.stop(); res(); }; });
    await L.view.queue;
  }

  async s_tap(st){
    const moves = st.moves || Array.from({length:st.count},()=>pick(st.pool));
    let k=0, t0=null;
    this.say(st.who||this.who, st.timed? 'Tap each turn as fast as you can.' : 'Tap the turn shown. Watch the cube follow you.');
    const draw=()=>{ this.task(`<div class="label"><span class="mono">Turn ${Math.min(k+1,moves.length)} of ${moves.length}</span>${st.timed?`<span class="px" id="tClock">0.0</span>`:''}</div><div class="prompt-big pop">${esc(moves[k]||'')}</div>`); };
    draw();
    let tick; if(st.timed) tick=setInterval(()=>{ const c=$('#tClock'); if(c&&t0) c.textContent=((performance.now()-t0)/1000).toFixed(1); },100);
    const p=this.pad(st.pad||NOTATION_ALL, (key,btn)=>{
      if(!t0) t0=performance.now();
      if(key===moves[k]){ L.view.turn(key,150); this.hit(key); k++; this.sub(k/moves.length); if(k>=moves.length){ this._res(); return; } draw(); }
      else { this.miss(); btn.classList.remove('wrong'); void btn.offsetWidth; btn.classList.add('wrong'); }
    });
    this.controls(p.html); p.bind();
    await this.ask(res=>{ this._res=res; });
    clearInterval(tick);
    if(st.timed){ const secs=(performance.now()-t0)/1000; this.timed={secs, stars: secs<=st.timed[0]?3:secs<=st.timed[1]?2:1}; }
    await L.view.queue; this.yay(); await sleep(450);
  }

  async s_name(st){
    for(let r=0;r<st.count;r++){
      const mv=pick(st.pool);
      const opts=shuffle([mv,...shuffle(st.pool.filter(x=>x!==mv)).slice(0,3)]);
      this.say(st.who||this.who, `Which turn was that? <span class="mono">${r+1}/${st.count}</span>`);
      this.task('');
      this.controls(`<div class="choices">${opts.map(o=>`<button class="choice px" data-o="${o}">${esc(o)}</button>`).join('')}</div><div class="btn-row"><button class="key light" id="bReplay">Show it again</button></div>`);
      const before=L.view.cube.clone();
      await sleep(300); await L.view.turn(mv,520);
      await this.ask(res=>{
        $('#bReplay').onclick=async()=>{ L.view.setCube(before.clone()); await sleep(200); L.view.turn(mv,520); };
        $$('#lsControls .choice').forEach(b=>b.onclick=()=>{ if(b.dataset.o===mv){ b.classList.add('right'); this.hit(mv); this.sub((r+1)/st.count); this.yay(); setTimeout(res,500); } else { b.classList.add('wrong'); this.miss(); } });
      });
    }
  }

  async s_quiz(st){
    this.say(st.who||this.who, esc(st.q));
    await this.choose(st.options, st.answer, st.px, st.why);
  }
  choose(options, answer, px, why){
    this.controls(`<div class="choices">${options.map(o=>`<button class="choice ${px?'px':''}" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div>`);
    return this.ask(res=>{ let wrong=false;
      $$('#lsControls .choice').forEach(b=>b.onclick=()=>{ if(b.dataset.o===answer){ b.classList.add('right'); this.hit(); this.yay(); if(why) $('#lsBubble').insertAdjacentHTML('beforeend',`<br><span class="chant">${esc(why)}</span>`); setTimeout(res, why?1300:600); } else { b.classList.add('wrong'); wrong=true; this.miss(); if(why) this.toast('Look again',true); } });
    });
  }

  async s_spot(st){
    for(let r=0;r<st.count;r++){
      const g=SPOT[st.gen]();
      this.setCube(g.setup, g.focus);
      this.say(st.who||this.who, `${esc(g.q)} <span class="mono">${r+1}/${st.count}</span>`);
      await this.choose(g.options, g.answer, g.px, g.why); this.sub((r+1)/st.count);
    }
  }

  async s_copy(st){
    const toks=parseAlg(st.alg); const reps=st.reps||1; const info=Object.values(SKILL_ALGS).find(s=>s.alg===st.alg);
    const keys=[]; toks.forEach(t=>{ const f=t[0]; if(!keys.includes(f)) keys.push(f); });
    const padKeys=keys.flatMap(f=>[f,f+"'"]);
    let rep=0, ci=0, half=0, dir=null, t0=null, shown=new Set();
    const fadeOf=r=> st.ladder? Math.min(r,3) : (st.fade||0);
    const visible=(i,r)=>{ const f=fadeOf(r); if(shown.has(i)) return true; if(f===0) return true; if(f===1) return i%2===0; if(f===2) return i===0; return false; };
    const draw=()=>{
      const name=info?info.name:'Copy it';
      this.task(`<div class="label"><span class="mono">${esc(name)}${reps>1?` &middot; ${Math.min(rep+1,reps)} of ${reps}`:''}</span>${st.timed?`<span class="px" id="tClock">0.0</span>`:''}</div>
        <div class="chips">${toks.map((t,i)=>`<span class="chip ${i<ci?'ok':''} ${i===ci?'now':''} ${i>=ci&&!visible(i,rep)?'hidden':''}">${esc(t)}</span>`).join('')}</div>
        ${st.chant?`<div class="chant">"${esc(st.chant)}"</div>`:''}`);
    };
    const tips=['Copy each turn. The highlighted box is next.','Some boxes are hidden now. Fill them from memory.','Only the first move is showing. You got this.','All hidden. Say the chant in your head.'];
    this.say(st.who||this.who, st.ladder? tips[0] : (fadeOf(0)===3? `From memory: <b>${esc(info?info.name:st.alg)}</b>${reps>1?`, ${reps} times`:''}.` : 'Copy the moves.'));
    draw();
    let tick; if(st.timed) tick=setInterval(()=>{ const c=$('#tClock'); if(c&&t0) c.textContent=((performance.now()-t0)/1000).toFixed(1); },100);
    const p=this.pad(padKeys,(key,btn)=>{
      if(this.busyReset) return;
      if(!t0) t0=performance.now();
      const want=parseMove(toks[ci]); const got=parseMove(key);
      let ok=false;
      if(want.face===got.face){ if(Math.abs(want.turns)===2){ if(half===0){ ok=true; dir=got.turns; } else ok=(got.turns===dir); } else ok=(got.turns===want.turns); }
      if(ok){ L.view.turn(key,150); this.glow(null);
        if(Math.abs(want.turns)===2&&half===0){ half=1; Sound.click(); return; }
        half=0; ci++; this.hit(key); this.sub((rep+ci/toks.length)/reps);
        if(ci>=toks.length){ rep++; ci=0; shown=new Set();
          if(rep>=reps){ this._res(); return; }
          this.yay();
          if(st.ladder) this.say(st.who||this.who, tips[Math.min(rep,3)]);
          if(!st.keep){ this.busyReset=true; L.view.queue.then(()=>sleep(380)).then(()=>{ this.setCube(st.setup); this.busyReset=false; }); }
        }
        draw();
      } else {
        this.miss(); btn.classList.remove('wrong'); void btn.offsetWidth; btn.classList.add('wrong');
        shown.add(ci); draw();
      }
    });
    this.controls(p.html+`<div class="btn-row"><button class="key light" id="bHint">Hint</button><button class="key light" id="bShow">Show me</button></div>`); p.bind();
    $('#bHint').onclick=()=>{ this.h++; shown.add(ci); draw(); const w=parseMove(toks[ci]); this.glow(w.face+(w.turns===-1?"'":'')); };
    $('#bShow').onclick=async()=>{ if(L.view.busy) return; this.h++; this.busyReset=true; const snap=L.view.cube.clone(); const rest=toks.slice(ci);
      const snapState=[ci,half]; await L.view.play(rest,380,90); await sleep(350); L.view.setCube(snap); [ci,half]=snapState; this.busyReset=false; toks.forEach((_,i)=>shown.add(i)); draw(); };
    await this.ask(res=>{ this._res=res; });
    clearInterval(tick);
    if(st.timed){ const secs=(performance.now()-t0)/1000; const s=secs<=st.timed[0]?3:secs<=st.timed[1]?2:1; this.timed={secs, stars:this.timed?Math.min(this.timed.stars,s):s}; }
    await L.view.queue; const sg=$('#lsStage'); sg.classList.remove('win'); void sg.offsetWidth; sg.classList.add('win'); Sound.win(); this.yay(); await sleep(700);
  }

  async s_puzzle(st){
    for(let r=0;r<st.count;r++){
      const g=GEN[st.gen](); const start=stateOf(g.base,g.setup); const goal=GOALS[g.goal];
      let logic=start.clone(); let moves=[];
      L.view.setCube(start.clone()); this.setCube(undefined, g.focus);
      this.say(st.who||this.who, `${esc(st.text)} <span class="mono">${r+1}/${st.count}</span>`);
      const meta=()=>this.task(`<div class="meta"><span>Moves</span><span class="px">${moves.length}</span><span style="flex:1"></span><span>Fix it in about <span class="px">${simplify(invertAlg(g.setup)).length}</span></span></div>`);
      meta();
      let done=false;
      await this.ask(res=>{
        let plan=null; const p=this.pad(st.pad,(key)=>{ if(done) return; this.glow(null); if(plan&&plan[0]===key) plan.shift(); else plan=null; L.view.turn(key,170); logic.move(key); moves.push(key); Sound.click(); meta();
          if(goal(logic)){ done=true; L.view.queue.then(async()=>{ const sg=$('#lsStage'); sg.classList.remove('win'); void sg.offsetWidth; sg.classList.add('win'); this.hit('Y'); this.sub((r+1)/st.count); Sound.win(); this.yay(); await sleep(900); res(); }); } });
        this.controls(p.html+`<div class="btn-row"><button class="key light" id="bHint">Hint</button><button class="key light" id="bReset">Start over</button></div>`); p.bind();
        $('#bReset').onclick=()=>{ if(done) return; Sound.tap(); plan=null; logic=start.clone(); moves=[]; L.view.setCube(start.clone()); meta(); this.glow(null); };
        $('#bHint').onclick=()=>{ if(done) return; this.h++;
          if(!plan||!plan.length){
            let seq = (g.goal==='cross') ? crossHint(logic, st.pad) : null;
            if(!seq) seq=simplify([...invertAlg(moves), ...invertAlg(g.setup)]);
            if(!seq.length) return;
            plan=expandAlg(seq);
            this.say(st.who||this.who, `Try this: <span class="alg-inline">${esc(seq.slice(0,4).join(' '))}</span>${seq.length>4?' ...':''}`);
          }
          const tok=plan[0];
          this.glow(tok); L.view.arrow(tok); setTimeout(()=>L.view.arrow(null),1400); };
      });
    }
  }

  async s_mission(st){
    this.say(st.who||this.who, st.solve? 'Grab your real cube. Start the clock when you begin, tap Done when it\'s solved.' : 'Grab your real cube. Check off each step as you go.');
    this.setCube('', 'all');
    let t0=null, tick=null, secs=null;
    this.task(`<div class="mission"><div class="mono">${esc(st.title)}</div><ol>${st.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ol><div class="clock" id="mClock">0.0</div></div>`);
    this.controls(`<div class="btn-row"><button class="key light big" id="mStart">Start clock</button><button class="key dark big" id="mDone">Done, it worked</button></div><div class="btn-row"><button class="key light" id="mStuck">I'm stuck</button></div>`);
    await this.ask(res=>{
      $('#mStart').onclick=()=>{ Sound.beep(true); t0=performance.now(); $('#mStart').disabled=true; tick=setInterval(()=>{ $('#mClock')&&($('#mClock').textContent=fmt((performance.now()-t0)/1000)); },100); };
      $('#mStuck').onclick=()=>{ $('#lsBubble').insertAdjacentHTML('beforeend',`<div class="tip" style="margin-top:8px">${esc(st.tip)}</div>`); $('#mStuck').disabled=true; };
      $('#mDone').onclick=()=>{ clearInterval(tick); if(t0) secs=(performance.now()-t0)/1000; this.hit('Y'); Sound.win(); res(); };
    });
    if(secs!=null&&st.solve){ S.times.unshift({t:secs, d:Date.now(), splits:[]}); S.times=S.times.slice(0,200); }
    if(st.target){ this.timed={secs:secs||999, stars: secs&&secs<=st.target?3: secs&&secs<=st.target*1.5?2:1}; }
    if(st.solve&&this.level&&this.level.id==='8.3') S.solved=true;
  }

  async s_recall(st){
    const keys=shuffle(Object.keys(SKILL_ALGS)).slice(0,st.count);
    for(const k of keys){ const a=SKILL_ALGS[k]; const foc={wiggle:'all',slideR:'f2l',slideL:'f2l',sandwich:'ytop',swirl:'yedges',swap:'all',dig:'all'}[k];
      this.setCube(invertAlg(a.alg), foc); await this.s_copy({alg:a.alg, reps:1, fade:3, setup:invertAlg(a.alg)}); }
  }

  finish(){
    document.onkeydown=null;
    const secs=(performance.now()-this.t0)/1000;
    let stars = this.m===0&&this.h===0 ? 3 : (this.m<=2&&this.h<=1 ? 2 : 1);
    if(this.timed) stars=Math.min(stars,this.timed.stars);
    const gain=20+stars*10+this.xp;
    S.xp+=gain; bumpStreak();
    if(this.level){
      const prev=S.levels[this.level.id]; S.levels[this.level.id]={stars:Math.max(stars,prev?prev.stars:0), best:Math.min(secs, prev&&prev.best||1e9)};
      if(this.level.skill && !S.skills[this.level.skill]) S.skills[this.level.skill]={box:1, due:Date.now()+DAY};
    }
    if(this.warm){ this.warm.forEach((sk,i)=>{ const r=this.results[i]; const cur=S.skills[sk]||{box:1}; const box=r&&r.clean? Math.min(cur.box+1,BOX_DAYS.length-1) : 1; S.skills[sk]={box, due:Date.now()+BOX_DAYS[box]*DAY}; }); }
    save();
    showDone({stars, gain, secs, m:this.m, h:this.h, level:this.level, mon:this.mon, timed:this.timed});
  }
}

function startLevel(i){
  if(!unlocked(i)) return;
  const lvl=LEVELS[i];
  lesson&&lesson.kill();
  lesson=new Lesson({steps:lvl.steps, level:lvl, mon:lvl.mon});
  lesson.run();
}
$('#lsClose').onclick=()=>{ Sound.tap(); lesson&&lesson.kill(); show('map'); };

function warmStep(sk){
  if(sk==='notation') return {t:'tap', count:8, pool:NOTATION_ALL, pad:NOTATION_ALL, skill:sk};
  if(SKILL_ALGS[sk]){ const a=SKILL_ALGS[sk]; const foc={wiggle:'all',slideR:'f2l',slideL:'f2l',sandwich:'ytop',swirl:'yedges',swap:'all',dig:'all'}[sk];
    return {t:'copy', alg:a.alg, reps:1, fade:3, setup:invertAlg(a.alg), focus:foc, skill:sk}; }
  return {t:'spot', gen:sk, count:2, skill:sk};
}
function startWarmup(){
  let due=dueSkills();
  if(!due.length){ const known=Object.keys(S.skills); if(!known.length){ show('map'); return; } due=shuffle(known).slice(0,3); }
  due=shuffle(due).slice(0,5);
  const gi=rnd(GRUNTS.length); const mon={sp:GRUNTS[gi], name:GRUNT_NAMES[gi], taunt:pick(['Grrr.','You again?','Hssss.','*growl*']), hue:rnd(6)*50};
  const steps=[{t:'say', text:`Warm-up. A ${mon.name.toLowerCase()} showed up. ${due.length} quick drills, mixed up on purpose. Remembering is what makes it stick.`, setup:'', focus:'all'}, ...due.map(warmStep)];
  lesson&&lesson.kill();
  lesson=new Lesson({steps, warm:[null,...due], mon});
  lesson.run();
}

// ---------- results ----------
function showDone(r){
  show('done');
  const wi=r.level? r.level.wi : 8, scene=r.level? r.level.world.scene : 'street';
  const big=r.level&&r.level.id==='8.3';
  const next = r.level? LEVELS[r.level.index+1] : null;
  const m=r.mon;
  const h1 = big? 'The Scrambler is down.' : `${m.name} is down.`;
  const h2 = big? 'You can solve the cube. For real.' : r.level? (r.level.boss? 'Boss defeated.' : pick(['Next one is tougher.','Nice hands.','That move is yours now.'])) : 'See you tomorrow.';
  $('#doneCard').innerHTML=`<div class="art">${sceneSVG(scene,160,64,wi*7+3)}<div class="who">${spriteSVG('leighton')}</div><div class="mon-dead">${monSVG(m)}</div></div>
    <h2>${esc(h1)} <span>${esc(h2)}</span></h2>
    <div class="big-stars">${[0,1,2].map(k=>ICON.star(k<r.stars)).join('')}</div>
    <div class="nums"><div><b id="dXP">0</b>XP</div><div><b>${r.timed?fmt(r.timed.secs):fmt(r.secs)}</b>time</div><div><b>${r.m}</b>slips</div><div><b>${r.h}</b>hints</div></div>
    <p class="say">"${esc(r.stars===3?pick(['Flawless. Too easy.','Not a scratch on me.','That was clean.']):r.stars===2?pick(['Got hit a little. Still won.','Pretty good. I can do better.']):pick(['Messy, but it counts.','Next time, no hints.']))}" <span style="color:var(--faint)">Leighton</span></p>
    <div class="btn-row">${next&&r.level?`<button class="key dark big" id="dNext">Next: ${esc(next.mon.name)}</button>`:''}<button class="key light big" id="dAgain">${r.level?'Replay':'Again'}</button><button class="key light big" data-go="${r.level?'map':'home'}">${r.level?'Map':'Home'}</button></div>`;
  const svgs=$$('#doneCard .big-stars svg');
  svgs.forEach((s,i)=>setTimeout(()=>{ s.classList.add('in'); if(i<r.stars) Sound.star(i); }, 350+i*260));
  let x=0; const step=Math.max(1,Math.ceil(r.gain/30)); const iv=setInterval(()=>{ x=Math.min(r.gain,x+step); const el=$('#dXP'); if(el) el.textContent='+'+x; if(x>=r.gain) clearInterval(iv); },30);
  Sound.sting(big||(r.level&&r.level.id==='9.3')?'story':'win');
  if(r.stars===3||big||(r.level&&r.level.boss)) confetti(big?260:120);
  $('#dNext')&&($('#dNext').onclick=()=>{ Sound.tap(); startLevel(r.level.index+1); });
  $('#dAgain').onclick=()=>{ Sound.tap(); r.level? startLevel(r.level.index) : startWarmup(); };
}
function confetti(n){
  if(window.__reduced) return;
  const cv=$('#confetti'), ctx=cv.getContext('2d'); const W=cv.width=innerWidth, H=cv.height=innerHeight;
  const cols=Object.values(STICKER).slice(0,6); const P=Array.from({length:n},()=>({x:W/2+(Math.random()-.5)*W*.3,y:H*.35,vx:(Math.random()-.5)*14,vy:-Math.random()*14-4,s:6+Math.floor(Math.random()*3)*3,c:pick(cols),r:0}));
  let f=0; const loop=()=>{ ctx.clearRect(0,0,W,H); P.forEach(p=>{ p.vy+=.45; p.x+=p.vx; p.y+=p.vy; p.vx*=.99; ctx.fillStyle=p.c; ctx.fillRect(Math.round(p.x/3)*3,Math.round(p.y/3)*3,p.s,p.s); }); if(++f<140) requestAnimationFrame(loop); else ctx.clearRect(0,0,W,H); };
  loop();
}

// ---------- Tock's timer ----------
const SPLITS=['Cross','Corners','Middle','Yellow cross','Yellow edges','Corner spots','Twist'];
let T={state:'idle', t0:0, splits:[], useSplits:false, scr:''};
function scramble(){ const faces=['R','L','U','D','F','B'], sfx=['',"'",'2']; const out=[]; let last='', prev='';
  while(out.length<20){ const f=pick(faces); if(f===last) continue; const opp={R:'L',L:'R',U:'D',D:'U',F:'B',B:'F'}; if(f===prev&&opp[last]===f) continue; out.push(f+pick(sfx)); prev=last; last=f; } return out.join(' '); }
function renderTimer(){
  if(!T.scr) T.scr=scramble();
  $('#tScr').textContent=T.scr; $('#tTime').textContent=T.state==='run'? $('#tTime').textContent : (S.times[0]&&T.state==='done'? fmt(S.times[0].t) : '0.00');
  $('#tSub').textContent = T.state==='run'? (T.useSplits? `Tap when you finish: ${SPLITS[T.splits.length]}` : 'Tap anywhere to stop') : 'Hold, then let go to start';
  $('#tSplits').innerHTML=(T.state!=='idle'?T.splits:[]).map((s,i)=>`<span>${SPLITS[i]} <b>${fmt(s)}</b></span>`).join('');
  const last5=S.times.slice(0,5).map(t=>t.t); let ao5='-'; if(last5.length===5){ const s=last5.slice().sort((a,b)=>a-b).slice(1,4); ao5=fmt(s.reduce((a,b)=>a+b,0)/3); }
  $('#tStats').innerHTML=`<div class="stat"><b>${bestTime()?fmt(bestTime()):'-'}</b><span>best</span></div><div class="stat"><b>${ao5}</b><span>average of 5</span></div>`;
  $('#tList').innerHTML=S.times.length? S.times.slice(0,50).map((t,i)=>`<div><span>${S.times.length-i}. ${new Date(t.d).toLocaleDateString()}</span><b>${fmt(t.t)}</b></div>`).join('') : '<div><span>No solves yet. Your times show up here.</span></div>';
  $('#swSplits').classList.toggle('on',T.useSplits);
}
{
  const pad=$('#tPad'); let holdT=null;
  const down=()=>{ if(current!=='timer') return; Sound.init();
    if(T.state==='run'){ const now=(performance.now()-T.t0)/1000;
      if(T.useSplits&&T.splits.length<SPLITS.length-1){ T.splits.push(now); Sound.beep(false); renderTimer(); return; }
      if(T.useSplits) T.splits.push(now);
      T.state='done'; cancelAnimationFrame(T.raf); S.times.unshift({t:now,d:Date.now(),splits:T.splits}); S.times=S.times.slice(0,200); save(); Sound.win(); T.scr=scramble(); renderTimer(); return; }
    pad.classList.add('hold'); holdT=setTimeout(()=>{ pad.classList.remove('hold'); pad.classList.add('ready'); Sound.beep(true); },350); };
  const up=()=>{ if(current!=='timer') return; clearTimeout(holdT); pad.classList.remove('hold');
    if(pad.classList.contains('ready')){ pad.classList.remove('ready'); T.state='run'; T.splits=[]; T.t0=performance.now(); renderTimer();
      const loop=()=>{ $('#tTime').textContent=fmt((performance.now()-T.t0)/1000); T.raf=requestAnimationFrame(loop); }; loop(); } };
  pad.addEventListener('pointerdown',e=>{ e.preventDefault(); down(); }); pad.addEventListener('pointerup',up); pad.addEventListener('pointercancel',up);
  document.addEventListener('keydown',e=>{ if(current==='timer'&&e.code==='Space'&&!e.repeat){ e.preventDefault(); down(); } });
  document.addEventListener('keyup',e=>{ if(current==='timer'&&e.code==='Space'){ e.preventDefault(); up(); } });
  $('#swSplitsRow').onclick=()=>{ if(T.state==='run') return; T.useSplits=!T.useSplits; renderTimer(); };
  $('#tNew').onclick=()=>{ T.scr=scramble(); T.state='idle'; renderTimer(); };
}

// ---------- boot ----------
$('#heroScene').innerHTML=heroSVG();
$('#homeFringe').outerHTML=fringeSVG('#121318',3);
$$('.icon-back').forEach(b=>b.innerHTML=ICON.back);
$('#lsClose').innerHTML=ICON.close; $('#viewReset').innerHTML=ICON.reset;
const hash=location.hash.slice(1);
show(['map','friends','timer'].includes(hash)?hash:'home');
}
