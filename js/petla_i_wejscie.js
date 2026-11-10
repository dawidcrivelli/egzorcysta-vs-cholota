/* ---------- pętla i wejście ---------- */
function draw(portrait){
 ctx.setTransform(DPR*S,0,0,DPR*S,0,0);btns=[];ctx.clearRect(0,0,LW,LH);
 if(portrait){drawRotate();return;}
 if(scene==='title')drawTitle();
 else if(scene==='levels')drawLevels();
 else if(scene==='pick')drawPick();
 else if(scene==='almanac')drawAlmanac();
 else{drawPlay();if(scene==='win')drawEnd(true);if(scene==='lose')drawEnd(false);}
}
function tap(x,y){
 if(CW<CH)return;
 if(scene==='play'&&G&&G.modal.length){if(T-G.modalT>0.3){G.modal.shift();G.modalT=T;}return;}
 const live=scene==='play'&&G&&!paused&&!G.over;
 if(live){for(const p of G.picks){if(p.st!=='fly'&&Math.hypot(p.x-x,p.y-y)<32){collect(p);return;}}}
 for(let i=btns.length-1;i>=0;i--){const b=btns[i];if(x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h){sfx('click');b.cb();return;}}
 if(live){
  const c=Math.floor((x-L.x0)/L.cellW),r=Math.floor((y-L.top)/L.rowH);
  if(c<0||c>8||r<0||r>4){G.sel=null;return;}
  if(G.evil)evilTap(r,c);else if(G.sel)tryPlace(r,c);else{const d=G.grid[r][c];if(d)toast(DEF[d.k].name);}
 }
}
function goFull(){
 try{const el=document.documentElement,rq=el.requestFullscreen||el.webkitRequestFullscreen;
  if(rq&&!(document.fullscreenElement||document.webkitFullscreenElement)){const p=rq.call(el);if(p&&p.then)p.then(()=>{try{if(screen.orientation&&screen.orientation.lock)screen.orientation.lock('landscape').catch(()=>{});}catch(e){}}).catch(()=>{});}
 }catch(e){}
}
let last=0;
let WARM=[],warmCtx=null;
function queueWarm(){
 if(!G||G.evil===undefined&&false)return;WARM=[];const ks=G.evil?G.cards.filter(k=>UNIT[k]):nightEnemies(G.lv);
 for(const k of ks){const d=EN[k];if(!d)continue;const h=L.rowH*enemyHR(k),b={sp:d.sp,shield:d.shield||0,helm:d.helm||0,hp:1};
  for(const m of [{walk:true},{eat:true,walk:false}]){const{P,n}=cycleOf(k,m.eat?m:b);for(let i=0;i<n;i++)WARM.push({k,h,st:{...b,...m,t:i/n*P+1e-4}});}}
 // sprzęt z talii: 6 klatek animacji w rozmiarze pola (pierwsze postawienie nie szarpie)
 if(!G.evil){const sz=Math.min(L.cellW*0.92,L.rowH*0.95);for(const k of G.cards){const d=DEF[k];if(!d||d.tool||d.instant)continue;
  for(let i=0;i<6;i++)WARM.push({def:k,sz,t:i/6+1e-4,d:{k,def:d,t:9,kick:0,rev:false,armed:false,armT:d.arm||0,reload:0,life:d.life||0,hp:1,max:1,hitT:0}});}}
}
function warmStep(){
 if(!WARM.length)return;if(!warmCtx){const c=document.createElement('canvas');c.width=c.height=1;warmCtx=c.getContext('2d');}
 const t0=performance.now(),old=ctx,mb=SPRB.max;ctx=warmCtx;SPRB.max=1e9;   // rozgrzewka ma własny limit 5 ms
 try{while(WARM.length&&performance.now()-t0<5){const w=WARM.shift();if(w.def)drawDef(w.def,0,0,w.sz,w.d,w.t);else drawEnemyKey(w.k,0,0,w.h,w.st);}}finally{ctx=old;SPRB.max=mb;}
}
let lastDraw=0;
/* jakość: gdy klatki średnio trwają > 25 ms przez 2 s gry, zmniejsz rozdzielczość płótna (QUAL), nie niżej niż 1 piksel na punkt */
const QA={ema:16,slow:0};
function autoQuality(dt){
 if(!dt)return;QA.ema+=(dt*1000-QA.ema)*0.1;
 if(QA.ema>25){QA.slow+=dt;if(QA.slow>2){QA.slow=0;const base=Math.min(window.devicePixelRatio||1,2);
  if(base*QUAL>1.01){QUAL=Math.max(1/base,QUAL-0.25);resize();QA.ema=16;}}}
 else QA.slow=Math.max(0,QA.slow-dt);
}
function frame(now){
 if(lastDraw&&now-lastDraw<15){requestAnimationFrame(frame);return;}lastDraw=now;
 const dt=last?Math.min(0.05,(now-last)/1000):0;last=now;T+=dt;FDT=dt;
 const portrait=CW<CH;
 if(scene==='play'&&G&&!paused&&!G.modal.length&&!portrait&&!G.over){let acc=dt*speed;while(acc>1e-6){const s=Math.min(acc,1/60);update(s);acc-=s;if(G.over)break;}}
 SPRB.ms=0;draw(portrait);
 if(scene==='play'&&G&&(G.modal.length||paused||G.t<20))warmStep();
 if(scene==='play'&&G&&!paused&&!G.modal.length&&!portrait)autoQuality(dt);
 requestAnimationFrame(frame);
}
let PRESS=null;
function endPress(){PRESS=null;}
cv.addEventListener('pointerup',endPress);cv.addEventListener('pointercancel',endPress);cv.addEventListener('pointerleave',endPress);
cv.addEventListener('pointerdown',ev=>{ev.preventDefault();audioInit();const r=cv.getBoundingClientRect();tap((ev.clientX-r.left)/S,(ev.clientY-r.top)/S);},{passive:false});
window.addEventListener('resize',resize);
window.addEventListener('orientationchange',()=>setTimeout(resize,200));
document.addEventListener('fullscreenchange',()=>setTimeout(resize,100));
document.addEventListener('visibilitychange',()=>{if(document.hidden&&scene==='play')paused=true;if(SND.ctx){if(document.hidden)SND.ctx.suspend().catch(()=>{});else SND.ctx.resume().catch(()=>{});}});
resize();
if(document.fonts&&document.fonts.load){document.fonts.load('900 20px Rubik').catch(()=>{});}
requestAnimationFrame(frame);
