#!/usr/bin/env node
/* Test wydajności: wypełnia planszę sprzętem i chołotą, puszcza prawdziwą pętlę gry i mierzy klatki.
   Uruchom: node tools/perf.js [opcje]
     --n 10          ilu wrogów naraz (stale dosyłani, żeby było ich tyle przez cały pomiar)
     --cpu 4         spowolnienie CPU jak na telefonie (1 = bez)
     --s 8           sekundy pomiaru (po 2 s rozgrzewki)
     --mix all       typy wrogów: all | basic (trup, sąsiad, urzędnik, komunista) | lista po przecinku
     --size 844x390  okno (telefon poziomo), DPR 2
     --cold          bez rozgrzewki bufora klatek (jak pierwsze spotkanie z wrogami)
     --dpr 2         gęstość pikseli ekranu
     --noadapt       bez automatycznego obniżania rozdzielczości
     --shot plik.png zrzut planszy na koniec
     --prof          czas na klatkę w głównych funkcjach rysowania
     --style odnowa  styl grafiki w grze (gra | odnowa | odnowa_lekka | pixel)
     --root dir      katalog gry (np. stara wersja do porównania)
   Wypisuje FPS, czasy klatek (p50/p95/p99/max), ile klatek > 33 ms (szarpnięcia),
   średni czas update/draw i ile razy bufor gotowych klatek musiał coś narysować od nowa. */
const {chromium}=require('playwright');
const http=require('http'),fs=require('fs'),path=require('path');
const arg=(k,d)=>{const i=process.argv.indexOf('--'+k);return i<0?d:(process.argv[i+1]&&!process.argv[i+1].startsWith('--')?process.argv[i+1]:true);};
const N=+arg('n',10),CPU=+arg('cpu',4),SEC=+arg('s',8),MIX=arg('mix','all'),[W,H]=String(arg('size','844x390')).split('x').map(Number),COLD=!!arg('cold',false),NOADAPT=!!arg('noadapt',false),PROF=!!arg('prof',false),STYLE=arg('style','gra');
const ROOT=path.resolve(arg('root',path.join(__dirname,'..')));   // --root katalog: np. stara wersja gry do porównania
const TYPES={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json'};
const srv=http.createServer((q,r)=>{const f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0])==='/'?'index.html':decodeURIComponent(q.url.split('?')[0]));
 fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream'});r.end(b);});});

(async()=>{
 await new Promise(ok=>srv.listen(0,ok));const port=srv.address().port;
 const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:+arg('dpr',2)});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
 if(CPU>1){const cdp=await p.context().newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:CPU});}
 await p.goto(`http://localhost:${port}/index.html`);await p.waitForTimeout(800);
 const res=await p.evaluate(async({N,SEC,MIX,COLD,NOADAPT,PROF,STYLE})=>{
  if(typeof save!=='undefined'){save.style=STYLE;if(typeof SPR!=='undefined'){SPR.clear();if(typeof LASTSPR!=='undefined')LASTSPR.clear();}}
  if(NOADAPT&&window.autoQuality)window.autoQuality=()=>{};
  const all=ALM_EN.filter(k=>k!=='palac'&&k!=='boss'),basic=['trup','sasiad','urzednik','komunista'];
  const pool=MIX==='all'?all:MIX==='basic'?basic:MIX.split(',');
  // poziom z największą liczbą sprzętu, bez fal; wszystko odblokowane
  let li=0;LEVELS.forEach((l,i)=>{if(!l.endless&&l.defs.length>=LEVELS[li].defs.length)li=i;});
  newGame(li);G.modal=[];paused=false;G.intro=null;G.waves=[];G.sq=[];G.sam=1e6;G.sky=1e9;
  const lay=[['bimbrownia','gumofilce','woda','armata','samowar','szafa','kabel'],['bimbrownia','pralka','resztki','relikwia','pila','rubin','rozlew'],
   ['bimbrownia','gumofilce','samowar','armata','kombajn','szafa','lancuch'],['bimbrownia','resztki','woda','pralka','pila','rubin','kabel'],['bimbrownia','gumofilce','armata','relikwia','samowar','szafa','aparatura']];
  const place=()=>{for(let r=0;r<5;r++)lay[r].forEach((k,c)=>{if(DEF[k]&&!G.grid[r][c])makeDef(k,r,c);});};place();
  let si=0;const add=()=>{const k=pool[si++%pool.length];spawn(k,si%5,rr(5,9.3));};
  for(let i=0;i<N;i++)add();
  if(!COLD){queueWarm();while(WARM.length)warmStep();}
  // pomiary: owinięte funkcje gry (deklaracje globalne, więc pętla woła owinięte)
  const M={upd:[],drw:[],js:[],keys:[],cur:0,miss:0,frames:[]};
  const u0=update,d0=draw,s0=sprite;
  window.update=function(dt){const t=performance.now();u0(dt);const du=performance.now()-t;M.upd.push(du);M.cur+=du;
   // utrzymuj stan planszy: N wrogów, nikt nie dochodzi do zagrody, sprzęt cały
   for(const e of G.ens)if(e.x<1.6){e.x=rr(8,9.3);e.eating=null;}
   for(const d of G.defs)if(d.hp!=null)d.hp=Math.max(d.hp,d.max*0.5);
   while(G.ens.filter(e=>!e.dead).length<N)add();place();G.sam=1e6;};
  window.draw=function(pt){const t=performance.now();d0(pt);M.drw.push(performance.now()-t);const js=M.cur+performance.now()-t;M.js.push(js);if(js>30)(M.spk=M.spk||[]).push([+js.toFixed(1),M.keys.slice(M.k0||0)]);M.k0=M.keys.length;M.cur=0;};
  window.sprite=function(key,...a){const n=SPR.size,had=SPR.has(key),c=s0(key,...a);if(!had&&SPR.has(key)){M.miss++;M.keys.push(key);}return c;};
  const PT={};
  if(PROF)for(const fn of ['drawField','drawTop','drawUrsusRow','drawDefOnGrid','drawEnemy','drawProj','drawFx','drawPicks','drawBubble','drawEnemyRaw','drawDefRaw']){
   const o=window[fn];if(typeof o!=='function')continue;PT[fn]=0;let depth=0;
   window[fn]=function(...a){if(depth)return o.apply(this,a);depth++;const t=performance.now();try{return o.apply(this,a);}finally{PT[fn]+=performance.now()-t;depth--;}};}
  await new Promise(r=>setTimeout(r,2000));for(const k in PT)PT[k]=0;M.upd.length=M.drw.length=M.js.length=0;M.keys=[];M.miss=0;const spr0=SPR.size;
  await new Promise(done=>{let last=0;const t0=performance.now();const f=now=>{if(last)M.frames.push(now-last);last=now;if(now-t0<SEC*1000)requestAnimationFrame(f);else done();};requestAnimationFrame(f);});
  const q=(a,x)=>{const s=[...a].sort((m,n)=>m-n);return s.length?s[Math.min(s.length-1,Math.floor(s.length*x))]:0;},avg=a=>a.reduce((s,v)=>s+v,0)/(a.length||1);
  return{level:li,enemies:G.ens.length,defs:G.defs.length,frames:M.frames.length,fps:M.frames.length/SEC,
   p50:q(M.frames,0.5),p95:q(M.frames,0.95),p99:q(M.frames,0.99),max:Math.max(...M.frames),jank33:M.frames.filter(v=>v>33.4).length,jank50:M.frames.filter(v=>v>50).length,
   updAvg:avg(M.upd),updMax:Math.max(0,...M.upd),drwAvg:avg(M.drw),drwMax:Math.max(0,...M.drw),drwP95:q(M.drw,0.95),missPerSec:M.miss/SEC,jsP95:q(M.js,0.95),jsMax:Math.max(0,...M.js),jsLong:M.js.filter(v=>v>16).length,skip:typeof SPRB!=='undefined'?SPRB.skip:0,qual:typeof QUAL!=='undefined'?QUAL:1,dpr:DPR,keys:M.keys,spikes:M.spk||[],sprMB:+([...SPR.values()].reduce((a,c)=>a+c.width*c.height*4,0)/1048576).toFixed(1),prof:Object.fromEntries(Object.entries(PT).map(([k,v])=>[k,+(v/(M.drw.length||1)).toFixed(2)])),spr:SPR.size,spr0};
 },{N,SEC,MIX,COLD,NOADAPT,PROF,STYLE});
 const f=v=>v.toFixed(1);
 console.log(`styl ${STYLE}, wrogów ${res.enemies}, sprzętu ${res.defs}, poziom ${res.level+1}, CPU ×${CPU}, ${W}×${H}@2${COLD?', zimny bufor':''}`);
 console.log(`FPS ${f(res.fps)} | klatka p50 ${f(res.p50)} p95 ${f(res.p95)} p99 ${f(res.p99)} max ${f(res.max)} ms | szarpnięć >33ms: ${res.jank33}, >50ms: ${res.jank50}`);
 console.log(`JS na klatkę (update+draw): p95 ${f(res.jsP95)} max ${f(res.jsMax)} ms, klatek z JS > 16 ms: ${res.jsLong}`);
 console.log(`update śr ${f(res.updAvg)} max ${f(res.updMax)} ms | draw śr ${f(res.drwAvg)} p95 ${f(res.drwP95)} max ${f(res.drwMax)} ms | bufor: ${f(res.missPerSec)} nowych klatek/s, rozmiar ${res.spr0}→${res.spr} (${res.sprMB} MB), pominiętych (stara klatka) ${res.skip} | rozdzielczość ×${res.qual} (DPR ${res.dpr})`);
 if(arg('shot',false)){await p.evaluate(()=>{paused=false;});await p.screenshot({path:String(arg('shot'))});console.log('zrzut:',arg('shot'));}
 if(arg('spikes',false))console.log('skoki JS > 30 ms:',JSON.stringify(res.spikes));
 if(PROF)console.log('ms na klatkę:',JSON.stringify(res.prof));
 if(errs.length)console.log('BŁĘDY:\n'+[...new Set(errs)].join('\n'));
 if(arg('json',false))console.log(JSON.stringify(res));
 await b.close();srv.close();
})().catch(e=>{console.error(e);srv.close();process.exit(1);});
