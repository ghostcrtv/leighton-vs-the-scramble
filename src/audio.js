// ---------- sound: Steve's licensed beds + SFX from /audio, with a tiny synth layered on top ----------
// Beds and samples load from audio/*.mp3. If a file is missing, the synth tones still play.
const Sound = {
  ctx:null, on:true, music:true, master:null, fxg:null, bedGain:null, buf:{},
  bedEl:null, stingEl:null, cur:null,
  BED_VOL:{ menu:.5, trivia:.32, code:.42, match:.36, story:.38 },
  SAMPLES:{ pong:'sfx-pong', collect:'sfx-collect', hit:'sfx-hit', laser:'sfx-laser', design:'sfx-design' },
  init(){
    if(this.ctx) return;
    try{ this.ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ this.ctx=null; return; }
    const c=this.ctx;
    this.master=c.createGain(); this.master.gain.value=this.on?1:0; this.master.connect(c.destination);
    this.fxg=c.createGain(); this.fxg.gain.value=.9; this.fxg.connect(this.master);
    this.bedEl=new Audio(); this.bedEl.loop=true; this.bedEl.preload='auto';
    this.stingEl=new Audio();
    try{ this.bedGain=c.createGain(); c.createMediaElementSource(this.bedEl).connect(this.bedGain); this.bedGain.connect(this.master);
      const sg=c.createGain(); sg.gain.value=.8; c.createMediaElementSource(this.stingEl).connect(sg); sg.connect(this.master); }catch(e){ this.bedGain=null; }
    for(const k in this.SAMPLES) fetch('audio/'+this.SAMPLES[k]+'.mp3').then(r=>{ if(!r.ok) throw 0; return r.arrayBuffer(); })
      .then(a=>new Promise((res,rej)=>c.decodeAudioData(a,res,rej))).then(b=>{ this.buf[k]=b; }).catch(()=>{});
    if(this.cur){ const n=this.cur; this.cur=null; this.bed(n); }
  },
  unlock(){ this.init(); if(this.ctx&&this.ctx.state==='suspended') this.ctx.resume(); this.playBed(); },
  vol(v){ if(this.bedGain) this.bedGain.gain.value=v; else if(this.bedEl) this.bedEl.volume=v; },
  playBed(){ if(!this.bedEl||!this.cur||!this.on||!this.music) return; if(!this.stingEl.paused) return; const p=this.bedEl.play(); if(p) p.catch(()=>{}); },
  bed(name){
    if(name===this.cur){ this.playBed(); return; }
    this.cur=name; if(!this.bedEl) return;
    this.stingEl.pause(); this.stingEl.onended=null;
    if(!name){ this.bedEl.pause(); return; }
    this.bedEl.src='audio/'+name+'.mp3'; this.vol(this.BED_VOL[name]||.4); this.playBed();
  },
  sting(name){
    if(!this.on||!this.stingEl) return; this.bedEl.pause();
    this.stingEl.src='audio/sting-'+name+'.mp3'; const p=this.stingEl.play(); if(p) p.catch(()=>{});
    this.stingEl.onended=()=>this.playBed();
  },
  setOn(v){ this.on=v; if(this.master) this.master.gain.value=v?1:0; if(this.bedEl){ if(v) this.playBed(); else { this.bedEl.pause(); this.stingEl.pause(); } } },
  setMusic(v){ this.music=v; if(this.bedEl){ if(v) this.playBed(); else this.bedEl.pause(); } },
  sample(k, vol=.8, rate=1){
    if(!this.on||!this.ctx||!this.buf[k]) return false;
    const s=this.ctx.createBufferSource(), g=this.ctx.createGain(); s.buffer=this.buf[k]; s.playbackRate.value=rate; g.gain.value=vol;
    s.connect(g); g.connect(this.fxg); s.start(); return true;
  },
  tone(freq, dur=.08, type='square', vol=.05, when=0, slide=0){
    if(!this.on||!this.ctx) return;
    const t=this.ctx.currentTime+when, o=this.ctx.createOscillator(), g=this.ctx.createGain();
    o.type=type; o.frequency.setValueAtTime(freq,t); if(slide) o.frequency.exponentialRampToValueAtTime(freq*slide,t+dur);
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+.01); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g); g.connect(this.fxg); o.start(t); o.stop(t+dur+.02);
  },
  click(){ if(!this.on||!this.ctx) return; const c=this.ctx, t=c.currentTime, b=c.createBuffer(1,800,c.sampleRate), d=b.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,4);
    const s=c.createBufferSource(), f=c.createBiquadFilter(), g=c.createGain(); f.type='bandpass'; f.frequency.value=2400; g.gain.value=.35;
    s.buffer=b; s.connect(f); f.connect(g); g.connect(this.fxg); s.start(t); },
  thump(f0=120, vol=.8){ if(!this.on||!this.ctx) return; const c=this.ctx, t=c.currentTime, o=c.createOscillator(), g=c.createGain();
    o.frequency.setValueAtTime(f0,t); o.frequency.exponentialRampToValueAtTime(38,t+.14); g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.001,t+.26);
    o.connect(g); g.connect(this.fxg); o.start(t); o.stop(t+.3); },
  good(combo=0){ if(!this.sample('collect',.55,1+Math.min(combo,12)*.035)){ const base=440*Math.pow(2,Math.min(combo,12)/12); this.tone(base,.07,'square',.035); this.tone(base*1.189,.1,'square',.03,.05); } },
  bad(){ this.sample('hit',.9,.8); this.tone(110,.4,'sawtooth',.06,0,.6); },
  tap(){ if(!this.sample('pong',.55)) this.tone(880,.04,'triangle',.05); },
  shoot(){ this.sample('laser',.28,1.7); },
  zap(c=1){ if(!this.sample('hit',.55,1.4+Math.min(c,10)*.04)) this.tone(220+Math.min(c,10)*30,.07,'square',.04,0,2.2); this.click(); },
  roar(boss){ if(boss){ this.sample('laser',.8,.6); this.thump(90,1); } this.tone(boss?70:110,boss?.6:.35,'sawtooth',.05,0,.55); this.tone(boss?94:140,boss?.5:.3,'square',.03,.05,.6); },
  ko(){ this.sample('laser',1,.7); this.thump(90,1); [392,330,262,196].forEach((f,i)=>this.tone(f,.12,'square',.045,i*.07)); },
  win(){ if(!this.sample('design',.6,1.2)) [440,523,659,880].forEach((f,i)=>this.tone(f,.14,'square',.045,i*.08)); },
  star(i){ if(!this.sample('collect',.6,1+i*.18)) this.tone(784*Math.pow(1.26,i),.14,'square',.045); },
  beep(hi){ this.tone(hi?1046:660,.12,'square',.05); }
};
addEventListener('pointerdown',()=>Sound.unlock(),{passive:true});
addEventListener('keydown',()=>Sound.unlock());
document.addEventListener('visibilitychange',()=>{ if(!Sound.ctx) return; if(document.hidden){ Sound.bedEl.pause(); Sound.stingEl.pause(); Sound.ctx.suspend(); } else { Sound.ctx.resume(); Sound.playBed(); } });
