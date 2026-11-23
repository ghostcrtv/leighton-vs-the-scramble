// ---------- 3D cube view (CSS 3D, no libraries) ----------
const STICKER = { Y:'#f7c844', W:'#fbfbf8', G:'#43a94b', B:'#2a6fd6', O:'#f2892b', R:'#de3f3a', X:'#3a3d46' };
const FACE_TF = {
  '0,0,1':'translateZ(H)', '0,0,-1':'rotateY(180deg) translateZ(H)',
  '1,0,0':'rotateY(90deg) translateZ(H)', '-1,0,0':'rotateY(-90deg) translateZ(H)',
  '0,1,0':'rotateX(90deg) translateZ(H)', '0,-1,0':'rotateX(-90deg) translateZ(H)'
};
const LIGHT = (()=>{ const v=[-0.25,0.65,0.75]; const l=Math.hypot(...v); return v.map(x=>x/l); })();
const DEG = Math.PI/180;
const easeOut = t => 1-Math.pow(1-t,3);
const easeInOut = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;

class CubeView {
  constructor(host){
    this.host = host;
    host.innerHTML = '<div class="cube-scene"><div class="cube-root"></div></div><svg class="cube-arrow"></svg>';
    this.scene = host.querySelector('.cube-scene');
    this.root = host.querySelector('.cube-root');
    this.arrowSvg = host.querySelector('.cube-arrow');
    this.rx = -24; this.ry = -34; this.S = 60;
    this.focus = null; this.queue = Promise.resolve(); this.anim = null; this.busy = 0;
    this.cube = new Cube();
    this.build();
    this.bindDrag();
    this.ro = new ResizeObserver(()=>this.resize()); this.ro.observe(host);
  }
  build(){
    this.root.innerHTML='';
    this.els = this.cube.cubies.map(q=>{
      const d=document.createElement('div'); d.className='cubie';
      const faces=[];
      for(const key in FACE_TF){
        const n=key.split(',').map(Number);
        const f=document.createElement('div'); f.className='cf'; f.dataset.n=key;
        const st=q.stickers.find(s=>s.n.join(',')===key);
        let stEl=null;
        if(st){ stEl=document.createElement('div'); stEl.className='st'; f.appendChild(stEl); }
        const sh=document.createElement('div'); sh.className='sh'; f.appendChild(sh);
        d.appendChild(f); faces.push({el:f,n,st,stEl,sh});
      }
      this.root.appendChild(d);
      return {el:d, faces};
    });
    this.resize();
  }
  resize(){
    const r=this.host.getBoundingClientRect();
    const m=Math.min(r.width, r.height);
    this.S = Math.max(26, Math.min(86, m/5.4));
    const S=this.S, H=S/2;
    for(const e of this.els) for(const f of e.faces){
      f.el.style.width=S+'px'; f.el.style.height=S+'px'; f.el.style.left=(-H)+'px'; f.el.style.top=(-H)+'px';
      f.el.style.transform = FACE_TF[f.n.join(',')].replace('H', H+'px');
    }
    this.renderAll();
  }
  viewMat(){ return mulMat(rotMat(0,-this.rx*DEG), rotMat(1,this.ry*DEG)); }
  setCube(c){ this.cube=c; this.renderAll(); }
  setFocus(fn){ this.focus=fn; this.paint(); }
  paint(){
    this.cube.cubies.forEach((q,i)=>{
      for(const f of this.els[i].faces){ if(!f.stEl) continue;
        const show = !this.focus || this.focus(q, f.st, this.cube);
        f.stEl.style.backgroundColor = show ? STICKER[f.st.c] : STICKER.X;
      }
    });
  }
  cubieCSS(q, A){
    const M = A ? mulMat(A,q.rot) : q.rot;
    const p = A ? mulVec(A,q.pos) : q.pos;
    const S=this.S;
    // math (y up) -> css (y down): conjugate by diag(1,-1,1)
    const m=[[M[0][0],-M[0][1],M[0][2]],[-M[1][0],M[1][1],-M[1][2]],[M[2][0],-M[2][1],M[2][2]]];
    const t=[p[0]*S*1.02, -p[1]*S*1.02, p[2]*S*1.02];
    return `matrix3d(${m[0][0]},${m[1][0]},${m[2][0]},0,${m[0][1]},${m[1][1]},${m[2][1]},0,${m[0][2]},${m[1][2]},${m[2][2]},0,${t[0]},${t[1]},${t[2]},1)`;
  }
  shade(i, q, A, V){
    const M = A ? mulMat(A,q.rot) : q.rot;
    for(const f of this.els[i].faces){
      const n = mulVec(V, mulVec(M, f.n));
      const b = Math.max(0, n[0]*LIGHT[0]+n[1]*LIGHT[1]+n[2]*LIGHT[2]);
      f.sh.style.opacity = (0.24*(1-b)).toFixed(3);
    }
  }
  renderAll(){
    this.root.style.transform = `rotateX(${this.rx}deg) rotateY(${this.ry}deg)`;
    const V=this.viewMat();
    this.cube.cubies.forEach((q,i)=>{ this.els[i].el.style.transform=this.cubieCSS(q,null); this.shade(i,q,null,V); });
    this.paint();
  }
  // queue a move; returns promise
  turn(tok, ms=180){
    this.busy++;
    const p = this.queue.then(()=>this._turn(tok, ms)).finally(()=>{this.busy--;});
    this.queue = p.catch(()=>{});
    return p;
  }
  instant(tok){ this.cube.move(tok); this.renderAll(); }
  _turn(tok, ms){
    return new Promise(res=>{
      const {face,turns}=parseMove(tok); const d=MOVE_DEF[face];
      const idx = this.cube.cubies.map((q,i)=>(d.layer===null||q.pos[d.axis]===d.layer)?i:-1).filter(i=>i>=0);
      const target = d.dir*turns*Math.PI/2;
      const dur = (Math.abs(turns)===2? ms*1.5 : ms) * (window.__reduced?0.01:1);
      const t0 = performance.now(); const V=this.viewMat();
      const step = now=>{
        const t = Math.min(1,(now-t0)/dur);
        const A = rotMat(d.axis, target*easeOut(t));
        for(const i of idx){ const q=this.cube.cubies[i]; this.els[i].el.style.transform=this.cubieCSS(q,A); this.shade(i,q,A,V); }
        if(t<1) requestAnimationFrame(step);
        else { this.cube.move(tok); for(const i of idx){ const q=this.cube.cubies[i]; this.els[i].el.style.transform=this.cubieCSS(q,null); this.shade(i,q,null,V);} res(); }
      };
      requestAnimationFrame(step);
    });
  }
  async play(alg, ms=380, gap=110, onStep){
    const toks = typeof alg==='string'? parseAlg(alg) : alg;
    this.cancelled=false;
    for(let i=0;i<toks.length;i++){
      if(this.cancelled){ this.cancelled=false; return false; }
      onStep && onStep(i);
      this.arrow(toks[i]);
      await sleep(gap+60);
      await this.turn(toks[i], ms);
      this.arrow(null);
      await sleep(gap);
    }
    onStep && onStep(toks.length);
    return true;
  }
  stop(){ this.cancelled=true; }
  // ---- direction arrow drawn on the layer that will turn ----
  arrow(tok){
    if(!tok){ this.arrowSvg.innerHTML=''; return; }
    const {face,turns}=parseMove(tok); const d=MOVE_DEF[face];
    const V=this.viewMat(); const r=this.host.getBoundingClientRect(); const cx=r.width/2, cy=r.height/2, S=this.S*1.02;
    const ax=d.axis, e1=[0,0,0], e2=[0,0,0]; const o=[(ax+1)%3,(ax+2)%3]; e1[o[0]]=1; e2[o[1]]=1;
    const layer = d.layer===null?0:d.layer;
    const axisV=[0,0,0]; axisV[ax]=layer||1; const facing=mulVec(V,axisV)[2];
    const sgn = d.dir*Math.sign(turns);
    let P, a0, sweep, n=24;
    if(layer!==0 && facing>0.6){
      // the turning face looks at us: draw a round arrow on the face itself
      const c=[0,0,0]; c[ax]=layer*1.56;
      P=t=>[0,1,2].map(k=>c[k]+0.95*(Math.cos(t)*e1[k]+Math.sin(t)*e2[k]));
      sweep=sgn*(Math.abs(turns)===2?5.2:4.4); a0=Math.PI/2-sweep/2;
    } else {
      // otherwise run a straight arrow along the most visible side of that layer
      const c=[0,0,0]; c[ax]=layer;
      P=t=>{ const r=1.56/Math.max(Math.abs(Math.cos(t)),Math.abs(Math.sin(t))); return [0,1,2].map(k=>c[k]+r*(Math.cos(t)*e1[k]+Math.sin(t)*e2[k])); };
      let best=0,bz=-9; for(const a of [0,Math.PI/2,Math.PI,3*Math.PI/2]){ const v=mulVec(V,[0,1,2].map(k=>Math.cos(a)*e1[k]+Math.sin(a)*e2[k])); if(v[2]>bz){bz=v[2];best=a;} }
      sweep=sgn*(Math.abs(turns)===2?1.45:1.3); a0=best-sweep/2;
    }
    const pts=[];
    for(let i=0;i<=n;i++){ const v=mulVec(V,P(a0+sweep*i/n)); pts.push([cx+v[0]*S, cy-v[1]*S]); }
    const dpath='M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L');
    const [x1,y1]=pts[n-2],[x2,y2]=pts[n]; const ang=Math.atan2(y2-y1,x2-x1); const hl=16;
    const head=`M${(x2+Math.cos(ang)*6).toFixed(1)} ${(y2+Math.sin(ang)*6).toFixed(1)} L${(x2+Math.cos(ang+2.5)*hl).toFixed(1)} ${(y2+Math.sin(ang+2.5)*hl).toFixed(1)} L${(x2+Math.cos(ang-2.5)*hl).toFixed(1)} ${(y2+Math.sin(ang-2.5)*hl).toFixed(1)} Z`;
    this.arrowSvg.innerHTML=`<g><path class="halo" d="${dpath}"/><path d="${dpath}"/><path class="head" d="${head}" style="stroke:#fff;stroke-width:3"/><path class="head" d="${head}"/></g>`;
  }
  bindDrag(){
    let sx,sy,rx0,ry0,drag=false;
    this.host.addEventListener('pointerdown',e=>{ drag=true; sx=e.clientX; sy=e.clientY; rx0=this.rx; ry0=this.ry; this.host.setPointerCapture(e.pointerId); });
    this.host.addEventListener('pointermove',e=>{ if(!drag) return; this.ry=ry0+(e.clientX-sx)*0.45; this.rx=Math.max(-75,Math.min(75,rx0-(e.clientY-sy)*0.35)); this.arrow(null); this.renderAll(); });
    const end=()=>{ drag=false; }; this.host.addEventListener('pointerup',end); this.host.addEventListener('pointercancel',end);
  }
  resetView(){
    const fx=this.rx, fy=this.ry, t0=performance.now();
    const step=now=>{ const t=Math.min(1,(now-t0)/380), k=easeInOut(t); this.rx=fx+(-24-fx)*k; this.ry=fy+(-34-fy)*k; this.renderAll(); if(t<1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
}
const sleep = ms => new Promise(r=>setTimeout(r, window.__reduced? Math.min(ms,30): ms));
