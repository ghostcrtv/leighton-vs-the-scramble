// ---------- tiny synth: every sound is generated, no files ----------
const Sound = {
  ctx:null, on:true,
  init(){ if(this.ctx) return; try{ this.ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ this.ctx=null; } },
  tone(freq, dur=.08, type='square', vol=.05, when=0, slide=0){
    if(!this.on||!this.ctx) return;
    const t=this.ctx.currentTime+when, o=this.ctx.createOscillator(), g=this.ctx.createGain();
    o.type=type; o.frequency.setValueAtTime(freq,t); if(slide) o.frequency.exponentialRampToValueAtTime(freq*slide,t+dur);
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+.01); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g); g.connect(this.ctx.destination); o.start(t); o.stop(t+dur+.02);
  },
  click(){ if(!this.on||!this.ctx) return; const t=this.ctx.currentTime, b=this.ctx.createBuffer(1,800,this.ctx.sampleRate), d=b.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,4);
    const s=this.ctx.createBufferSource(), f=this.ctx.createBiquadFilter(), g=this.ctx.createGain(); f.type='bandpass'; f.frequency.value=2400; g.gain.value=.35;
    s.buffer=b; s.connect(f); f.connect(g); g.connect(this.ctx.destination); s.start(t); },
  good(combo=0){ const base=440*Math.pow(2,Math.min(combo,12)/12); this.tone(base,.07,'square',.035); this.tone(base*1.189,.1,'square',.03,.05); },
  bad(){ this.tone(160,.18,'sawtooth',.05,0,.6); },
  tap(){ this.tone(880,.04,'triangle',.05); },
  win(){ [440,523,659,880].forEach((f,i)=>this.tone(f,.14,'square',.045,i*.08)); this.tone(1047,.3,'square',.04,.34); },
  star(i){ this.tone(784*Math.pow(1.26,i),.14,'square',.045); },
  zap(c=1){ this.tone(220+Math.min(c,10)*30,.07,'square',.04,0,2.2); this.click(); },
  roar(boss){ this.tone(boss?70:110,boss?.6:.35,'sawtooth',.05,0,.55); this.tone(boss?94:140,boss?.5:.3,'square',.03,.05,.6); },
  ko(){ [392,330,262,196].forEach((f,i)=>this.tone(f,.12,'square',.05,i*.07)); this.tone(98,.5,'sawtooth',.05,.3,.5); },
  beep(hi){ this.tone(hi?1046:660,.12,'square',.05); }
};
