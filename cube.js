// Twistwood cube engine. Math coords: x right, y up, z toward viewer.
// Orientation used everywhere: yellow up, white down, green front, orange right.
const FACE_N = { U:[0,1,0], D:[0,-1,0], F:[0,0,1], B:[0,0,-1], R:[1,0,0], L:[-1,0,0] };
const FACE_COLOR = { U:'Y', D:'W', F:'G', B:'B', R:'O', L:'R' };
const MOVE_DEF = {
  R:{axis:0, layer:1, dir:-1}, L:{axis:0, layer:-1, dir:1},
  U:{axis:1, layer:1, dir:-1}, D:{axis:1, layer:-1, dir:1},
  F:{axis:2, layer:1, dir:-1}, B:{axis:2, layer:-1, dir:1},
  x:{axis:0, layer:null, dir:-1}, y:{axis:1, layer:null, dir:-1}, z:{axis:2, layer:null, dir:-1},
};

function rotMat(axis, ang){
  const c = Math.cos(ang), s = Math.sin(ang);
  if(axis===0) return [[1,0,0],[0,c,-s],[0,s,c]];
  if(axis===1) return [[c,0,s],[0,1,0],[-s,0,c]];
  return [[c,-s,0],[s,c,0],[0,0,1]];
}
function mulMat(a,b){
  const r=[[0,0,0],[0,0,0],[0,0,0]];
  for(let i=0;i<3;i++)for(let j=0;j<3;j++){let v=0;for(let k=0;k<3;k++)v+=a[i][k]*b[k][j];r[i][j]=v;}
  return r;
}
function mulVec(m,v){ return [0,1,2].map(i=>m[i][0]*v[0]+m[i][1]*v[1]+m[i][2]*v[2]); }
function roundMat(m){ return m.map(r=>r.map(v=>Math.round(v))); }
const I3 = [[1,0,0],[0,1,0],[0,0,1]];
function eqV(a,b){ return a[0]===b[0]&&a[1]===b[1]&&a[2]===b[2]; }
function isI(m){ for(let i=0;i<3;i++)for(let j=0;j<3;j++) if(m[i][j]!==(i===j?1:0)) return false; return true; }

function parseMove(tok){
  const m = /^([RLUDFBxyz])(2|'|2')?$/.exec(tok);
  if(!m) throw new Error('bad move '+tok);
  const suf = m[2]||'';
  const turns = suf.startsWith('2') ? 2 : (suf==="'" ? -1 : 1);
  return { face:m[1], turns };
}
function parseAlg(s){ return s.trim().split(/\s+/).filter(Boolean); }
function invertTok(t){ const {face,turns}=parseMove(t); if(turns===2) return face+'2'; return turns===1? face+"'" : face; }
function invertAlg(a){ return (typeof a==='string'?parseAlg(a):a).slice().reverse().map(invertTok); }
// expand X2 into X X (pad-friendly)
function expandAlg(a){ const out=[]; for(const t of (typeof a==='string'?parseAlg(a):a)){ const {face,turns}=parseMove(t); if(turns===2){out.push(face,face);} else out.push(t);} return out; }

class Cube {
  constructor(){
    this.cubies=[];
    for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++){
      if(x===0&&y===0&&z===0) continue;
      const home=[x,y,z], stickers=[];
      for(const f in FACE_N){ const n=FACE_N[f]; if((n[0]&&n[0]===x)||(n[1]&&n[1]===y)||(n[2]&&n[2]===z)) stickers.push({n, c:FACE_COLOR[f], face:f}); }
      const type = stickers.length===3?'corner':stickers.length===2?'edge':'center';
      this.cubies.push({ id:this.cubies.length, home, pos:home.slice(), rot:I3.map(r=>r.slice()), stickers, type });
    }
  }
  clone(){ const c=new Cube(); c.cubies.forEach((q,i)=>{ q.pos=this.cubies[i].pos.slice(); q.rot=this.cubies[i].rot.map(r=>r.slice()); }); return c; }
  affected(face){ const d=MOVE_DEF[face]; return this.cubies.filter(q=> d.layer===null || q.pos[d.axis]===d.layer); }
  move(tok){
    const {face,turns}=parseMove(tok); const d=MOVE_DEF[face];
    const M = roundMat(rotMat(d.axis, d.dir*turns*Math.PI/2));
    for(const q of this.affected(face)){ q.pos = mulVec(M,q.pos).map(Math.round); q.rot = roundMat(mulMat(M,q.rot)); }
    return this;
  }
  alg(a){ for(const t of (typeof a==='string'?parseAlg(a):a)) this.move(t); return this; }
  find(pred){ return this.cubies.find(pred); }
  byHome(h){ return this.cubies.find(q=>eqV(q.home,h)); }
  solvedPiece(q){ return eqV(q.pos,q.home) && isI(q.rot); }
  stickerNormal(q,color){ const s=q.stickers.find(s=>s.c===color); return s? mulVec(q.rot,s.n).map(Math.round):null; }
  colorAt(faceKey, pos){ const n=FACE_N[faceKey]; const q=this.cubies.find(q=>eqV(q.pos,pos)); if(!q) return null; const s=q.stickers.find(s=>eqV(mulVec(q.rot,s.n).map(Math.round),n)); return s?s.c:null; }
  // ---- goal checks (relative to centers, so whole-cube turns are fine) ----
  centerColor(n){ const q=this.cubies.find(q=>q.type==='center'&&eqV(q.pos,n)); return q.stickers[0].c; }
  dirOf(color){ for(const f in FACE_N){ if(this.centerColor(FACE_N[f])===color) return FACE_N[f]; } }
  pieceOk(q){ return q.stickers.every(s=>this.centerColor(mulVec(q.rot,s.n).map(Math.round))===s.c); }
  piecePlaced(q){ // right slot, any twist
    const want=q.stickers.map(s=>s.c).sort().join('');
    const have=[0,1,2].filter(i=>q.pos[i]!==0).map(i=>{const n=[0,0,0];n[i]=q.pos[i];return this.centerColor(n);}).sort().join('');
    return want===have; }
  isSolved(){ return this.cubies.every(q=>q.type==='center'||this.pieceOk(q)); }
  pieces(filter){ return this.cubies.filter(filter); }
  has(q,c){ return q.stickers.some(s=>s.c===c); }
  edgesWith(c){ return this.pieces(q=>q.type==='edge'&&this.has(q,c)); }
  cornersWith(c){ return this.pieces(q=>q.type==='corner'&&this.has(q,c)); }
  daisy(){ const up=this.dirOf('Y'); return this.edgesWith('W').every(q=>eqV(this.stickerNormal(q,'W'),up)); }
  cross(){ return this.edgesWith('W').every(q=>this.pieceOk(q)); }
  firstLayer(){ return this.pieces(q=>q.type!=='center'&&this.has(q,'W')).every(q=>this.pieceOk(q)); }
  middleLayer(){ return this.pieces(q=>q.type==='edge'&&!this.has(q,'W')&&!this.has(q,'Y')).every(q=>this.pieceOk(q)); }
  twoLayers(){ return this.firstLayer()&&this.middleLayer(); }
  yellowCross(){ const up=this.dirOf('Y'); return this.edgesWith('Y').every(q=>eqV(this.stickerNormal(q,'Y'),up)); }
  yellowEdges(){ return this.edgesWith('Y').every(q=>this.pieceOk(q)); }
  cornersPlaced(){ return this.cornersWith('Y').every(q=>this.piecePlaced(q)); }
  solvedPieces(list){ return list.every(q=>this.pieceOk(q)); }
}

const ALGS = {
  wiggle:  "R U R' U'",
  slideR:  "U R U' R' U' F' U F",
  slideL:  "U' L' U L U F U' F'",
  sandwich:"F R U R' U' F'",
  swirl:   "R U R' U R U2 R'",
  swap:    "U R U' L' U R' U' L",
  dig:     "R' D' R D",
};

if(typeof module!=='undefined') module.exports={Cube,ALGS,parseAlg,invertAlg,expandAlg,parseMove,FACE_N,FACE_COLOR,MOVE_DEF,rotMat,mulMat,mulVec,eqV,isI,I3};
