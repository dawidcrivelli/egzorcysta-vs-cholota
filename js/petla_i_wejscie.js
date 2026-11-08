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
 for(const k of ks){const d=EN[k];if(!d)continue;const h=k==='palac'?L.rowH*2.7:d.boss?L.rowH*1.7:d.small?L.rowH*0.52:L.rowH*0.88;
  const sp=d.sp,P=NONH_P[k]||Math.PI*2/(16*sp*(k==='mumia'?0.9:k==='boss'?1.6:1)),n=NONH_P[k]?8:10;
  for(let i=0;i<n;i++)WARM.push({k,h,st:{t:i/n*P+1e-4,walk:true,sp,shield:d.shield||0,helm:d.helm||0,hp:1}});
  for(let i=0;i<6;i++)WARM.push({k,h,st:{t:i/6*(Math.PI*2/((k==='trup'||k==='mumia')?10:9))+1e-4,eat:true,walk:false,sp,shield:d.shield||0,helm:d.helm||0,hp:1}});}
}
function warmStep(){
 if(!WARM.length)return;if(!warmCtx){const c=document.createElement('canvas');c.width=c.height=1;warmCtx=c.getContext('2d');}
 const t0=performance.now(),old=ctx;ctx=warmCtx;
 try{while(WARM.length&&performance.now()-t0<5){const w=WARM.shift();drawEnemyKey(w.k,0,0,w.h,w.st);}}finally{ctx=old;}
}
let lastDraw=0;
function frame(now){
 if(lastDraw&&now-lastDraw<15){requestAnimationFrame(frame);return;}lastDraw=now;
 const dt=last?Math.min(0.05,(now-last)/1000):0;last=now;T+=dt;FDT=dt;
 const portrait=CW<CH;
 if(scene==='play'&&G&&!paused&&!G.modal.length&&!portrait&&!G.over){let acc=dt*speed;while(acc>1e-6){const s=Math.min(acc,1/60);update(s);acc-=s;if(G.over)break;}}
 draw(portrait);
 if(scene==='play'&&G&&(G.modal.length||paused||G.t<20))warmStep();
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
