/* ---------- dźwięk (syntezowany, bez plików) ---------- */
const SND={ctx:null,last:{}};
function audioInit(){
 if(SND.ctx){if(SND.ctx.state==='suspended')SND.ctx.resume().catch(()=>{});return;}
 const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
 try{const a=new AC();SND.ctx=a;SND.master=a.createGain();SND.master.gain.value=0.8;SND.master.connect(a.destination);
  SND.sfx=a.createGain();SND.sfx.connect(SND.master);SND.mus=a.createGain();SND.mus.connect(SND.master);
  const b=a.createBuffer(1,a.sampleRate,a.sampleRate),dd=b.getChannelData(0);for(let i=0;i<dd.length;i++)dd[i]=Math.random()*2-1;SND.noise=b;
  applyVol();if(save.mus)musicStart();}catch(e){SND.ctx=null;}
}
function applyVol(){if(!SND.ctx)return;SND.sfx.gain.value=save.sfx?0.6:0;SND.mus.gain.value=save.mus?0.16:0;}
function toggleMus(){save.mus=!save.mus;applyVol();persist();if(save.mus)musicStart();else musicStop();}
function toggleSfx(){save.sfx=!save.sfx;applyVol();persist();}
function tone(type,f0,f1,dur,vol,delay,dest){const a=SND.ctx,t=a.currentTime+(delay||0),o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);if(f1)o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g);g.connect(dest||SND.sfx);o.start(t);o.stop(t+dur+0.03);}
function noise(dur,vol,ft,freq,delay,q,dest){const a=SND.ctx,t=a.currentTime+(delay||0),s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=SND.noise;f.type=ft||'lowpass';f.frequency.value=freq||1000;if(q)f.Q.value=q;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);s.connect(f);f.connect(g);g.connect(dest||SND.sfx);s.start(t,Math.random()*0.4);s.stop(t+dur+0.03);}
const SFXGAP={hit:0.06,eat:0.35,zap:0.25,saw:0.18,harvest:0.22,groan:1.2,siren:2.4,steam:0.2,soap:0.1,throw:0.08,splat:0.08,splash:0.1,pickup:0.05,bell:0.4,hic:0.3,boom:0.08,crunch:0.1,squeal:0.6,sting:0.3};
const SFX={
 click:()=>tone('triangle',700,0,0.05,0.15),
 place:()=>{tone('triangle',200,90,0.12,0.45);noise(0.06,0.25,'lowpass',900);},
 throw:()=>noise(0.1,0.2,'bandpass',900,0,1.5),
 hit:()=>{tone('sine',150,60,0.09,0.35);noise(0.04,0.15,'lowpass',600);},
 splat:()=>{noise(0.12,0.3,'lowpass',500);tone('sine',240,80,0.08,0.18);},
 splash:()=>{noise(0.25,0.25,'highpass',2500);tone('sine',1200,1900,0.1,0.06);},
 pickup:()=>{tone('sine',1320,0,0.12,0.22);tone('sine',1760,0,0.2,0.18,0.06);},
 boom:()=>{noise(0.7,0.9,'lowpass',380);tone('sine',95,30,0.5,0.7);},
 glass:()=>{noise(0.35,0.35,'highpass',3500);tone('sine',2400,1800,0.2,0.06);},
 zap:()=>{tone('square',90,0,0.12,0.1);noise(0.08,0.12,'highpass',3000);},
 saw:()=>tone('sawtooth',105,135,0.17,0.09),
 harvest:()=>tone('sawtooth',70,85,0.2,0.08),
 groan:()=>{tone('sawtooth',120,75,0.7,0.07);tone('sawtooth',123,78,0.7,0.05);},
 siren:()=>{for(let i=0;i<4;i++)tone('square',i%2?880:660,0,0.28,0.05,i*0.3);},
 squeal:()=>tone('square',900,1700,0.25,0.08),
 cluck:()=>{tone('square',700,1100,0.05,0.06);tone('square',650,1000,0.05,0.06,0.09);},
 moo:()=>{tone('sawtooth',150,105,1.0,0.12);tone('sawtooth',152,107,1.0,0.08);},
 stamp:()=>{tone('sine',85,45,0.14,0.6);noise(0.05,0.3,'lowpass',300);},
 tractor:()=>{tone('sawtooth',52,68,1.0,0.22);noise(0.9,0.18,'lowpass',220);},
 bell:()=>{tone('sine',880,0,0.9,0.1);tone('sine',1318,0,0.6,0.05);},
 chain:()=>{tone('sine',1320,0,0.25,0.12);tone('sine',990,0,0.4,0.12,0.18);},
 putt:()=>{for(let i=0;i<6;i++)tone('square',70+i*6,0,0.06,0.08,i*0.07);tone('square',520,0,0.18,0.06,0.5);tone('square',620,0,0.18,0.06,0.72);},
 cannon:()=>{noise(0.45,0.8,'lowpass',300);tone('sine',75,35,0.4,0.6);},
 thud:()=>{noise(0.25,0.5,'lowpass',250);tone('sine',70,40,0.25,0.5);},
 steam:()=>noise(0.45,0.25,'highpass',1800),
 soap:()=>{tone('sine',600,1200,0.08,0.1);tone('sine',900,1600,0.06,0.08,0.05);},
 hic:()=>tone('triangle',380,720,0.08,0.18),
 crunch:()=>noise(0.22,0.5,'lowpass',900),
 plow:()=>{noise(1.2,0.3,'lowpass',260);tone('sawtooth',60,55,1.0,0.06);},
 jump:()=>tone('sine',300,900,0.15,0.14),
 eat:()=>noise(0.06,0.13,'bandpass',700,0,2),
 armed:()=>tone('sine',1000,0,0.08,0.1),
 banner:()=>{tone('sawtooth',196,0,0.5,0.1);tone('sawtooth',294,0,0.5,0.08,0.06);tone('sawtooth',392,0,0.6,0.07,0.12);},
 sting:()=>{tone('sawtooth',110,0,0.6,0.1);tone('sawtooth',155.6,0,0.6,0.08);tone('sawtooth',220,0,0.6,0.06);},
 win:()=>{[523,659,784,1047].forEach((f,i)=>tone('square',f,0,0.25,0.1,i*0.14));},
 lose:()=>{[392,330,262,196].forEach((f,i)=>tone('triangle',f,0,0.35,0.2,i*0.2));}
};
function sfx(n){if(DEMO||!SND.ctx||!save.sfx||SND.ctx.state!=='running')return;const now=SND.ctx.currentTime,gap=SFXGAP[n]||0.04;if(SND.last[n]&&now-SND.last[n]<gap)return;SND.last[n]=now;try{SFX[n]&&SFX[n]();}catch(e){}}
// muzyka: wiejska polka w a-moll
const NOTE={};(()=>{const nm=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];for(let o=1;o<7;o++)nm.forEach((n,i)=>{NOTE[n+o]=440*Math.pow(2,((o-4)*12+i-9)/12);});})();
const MEL='A4 C5 E5 C5 B4 D5 E5 D5 C5 E5 A5 E5 B4 G#4 E4 - A4 C5 E5 A5 G5 F5 E5 D5 C5 B4 A4 C5 B4 - E4 - F4 A4 C5 F5 E5 D5 C5 A4 G4 B4 D5 G5 F5 E5 D5 B4 C5 E5 A5 G5 F5 E5 D5 B4 C5 A4 B4 G#4 A4 - - -'.split(' ');
const BASS='A E A E A G A E F C G D A D E A'.split(' '),PAH={A:'E',E:'B',G:'D',F:'C',C:'G',D:'A'};
let musStep=0,musNext=0,musTimer=null;
function musicStart(){if(!SND.ctx||musTimer||!save.mus)return;musNext=SND.ctx.currentTime+0.1;musTimer=setInterval(musicTick,60);}
function musicStop(){if(musTimer){clearInterval(musTimer);musTimer=null;}}
function musicTick(){
 const a=SND.ctx;if(!a||a.state!=='running')return;if(musNext<a.currentTime)musNext=a.currentTime+0.05;
 const boss=scene==='play'&&G&&G.ens.some(e=>e.d.boss),step=(boss?0.16:0.2);
 while(musNext<a.currentTime+0.25){
  const i=musStep%MEL.length,bar=Math.floor(i/4),beat=i%4,t=musNext,n=MEL[i],root=BASS[bar%BASS.length];
  if(n!=='-')accord(NOTE[n],t,step*0.9);
  if(beat===0||beat===2)bassNote(NOTE[root+'2'],t,step*0.9,1);
  else{bassNote(NOTE[PAH[root]+'3'],t,step*0.5,0.45);musHat(t);}
  musNext+=step;musStep++;
 }
}
function accord(f,t,d){for(let j=0;j<2;j++){const a=SND.ctx,o=a.createOscillator(),g=a.createGain(),fl=a.createBiquadFilter();o.type=j?'sawtooth':'square';o.frequency.value=f*(j?1.004:1);fl.type='lowpass';fl.frequency.value=1700;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.16,t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(fl);fl.connect(g);g.connect(SND.mus);o.start(t);o.stop(t+d+0.03);}}
function bassNote(f,t,d,v){const a=SND.ctx,o=a.createOscillator(),g=a.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.5*v,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(SND.mus);o.start(t);o.stop(t+d+0.03);}
function musHat(t){const a=SND.ctx,s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=SND.noise;f.type='highpass';f.frequency.value=6000;g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.05);s.connect(f);f.connect(g);g.connect(SND.mus);s.start(t,Math.random()*0.5);s.stop(t+0.07);}

