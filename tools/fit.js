#!/usr/bin/env node
/* Czy każdy styl mieści się w ramce klatki gry i ma podobną wielkość jak grafika gry.
   Uruchom: node tools/fit.js [--style odnowa,pixel] [--only klucz] [--json]
   Dla każdej postaci i sprzętu rysuje wiele stanów i klatek animacji na dużym płótnie, liczy prostokąt
   narysowanych pikseli (w jednostkach wzrostu h lub pola sz) i porównuje:
   - z ramką bufora (to, co wyjdzie poza nią, gra ucina): chołota 1.8×1.5 h, zaczepienie 0.88; sprzęt 1.6×1.5 sz, 0.86;
   - z wysokością i szerokością tej samej postaci w grafice gry (styl „gra”).
   Wypisuje tylko to, co wychodzi poza ramkę albo różni się od gry o więcej niż ±25 %. */
const {chromium}=require('playwright');
const http=require('http'),fs=require('fs'),path=require('path');
const arg=(k,d)=>{const i=process.argv.indexOf('--'+k);return i<0?d:(process.argv[i+1]&&!process.argv[i+1].startsWith('--')?process.argv[i+1]:true);};
const ROOT=path.join(__dirname,'..'),TYPES={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json'};
const srv=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split('?')[0]),f=path.join(ROOT,u==='/'?'index.html':u);
 fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream'});r.end(b);});});
(async()=>{
 await new Promise(ok=>srv.listen(0,ok));
 const b=await chromium.launch(),p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(`http://localhost:${srv.address().port}/postacie.html?tab=style&q=zzzz`);await p.waitForFunction(()=>window.STYLES&&STYLES.length>3&&typeof drawEnemyRaw==='function');await p.waitForTimeout(500);
 const res=await p.evaluate(({want,only})=>{
  const U=100,CW=900,CH=900,AX=450,AY=600,cv=document.createElement('canvas');cv.width=CW;cv.height=CH;const g=cv.getContext('2d',{willReadFrequently:true});
  const bbox=draw=>{g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,CW,CH);const old=ctx;ctx=g;try{draw();}catch(e){return{err:e.message};}finally{ctx=old;}
   const d=g.getImageData(0,0,CW,CH).data;let x0=CW,y0=CH,x1=-1,y1=-1;
   for(let y=0;y<CH;y++)for(let x=0;x<CW;x++)if(d[(y*CW+x)*4+3]>24){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
   return x1<0?null:{l:(x0-AX)/U,r:(x1+1-AX)/U,t:(y0-AY)/U,b:(y1+1-AY)/U};};
  const join=(a,c)=>!a?c:!c?a:{l:Math.min(a.l,c.l),r:Math.max(a.r,c.r),t:Math.min(a.t,c.t),b:Math.max(a.b,c.b)};
  const styles=STYLES.filter(s=>want.includes(s.id)||s.id==='gra'),out={};
  const ens=ALM_EN.concat('buraczek'),defs=ALM_DEF;
  const enStates=k=>{const d=EN[k],b={sp:d.sp,shield:d.shield||0,helm:d.helm||0,hp:1},L=[];
   for(const m of [{walk:true},{eat:true},{},{walk:true,talk:true},d.shield?{walk:true,shield:0}:null,d.helm?{walk:true,helm:0}:null,d.boss?{walk:true,hp:0.2}:null]){if(!m)continue;
    const st={...b,...m},{P,n}=cycleOf(k,st);for(let i=0;i<(st.walk||st.eat?n:3);i++)L.push({...st,t:i/Math.max(1,n)*P+(st.walk||st.eat?1e-4:i*0.7)});}return L;};
  const defStates=k=>{const d=DEF[k],L=[null],mk=(t,mode)=>{const r=d.rate||1.5,ph=t%r,act=mode==='act';return{k,def:d,hp:mode==='dmg'?(d.hp||1)*0.2:(d.hp||1),max:d.hp||1,t:act?r-ph:9,kick:act&&ph<0.25?0.25-ph:0,rev:act,armed:act,armT:act?0:(d.arm||0),reload:0,life:d.life||0,hitT:0,anim:t,moving:mode==='move'};};
   for(let i=0;i<12;i++){const t=i*0.23;L.push({d:mk(t,'act'),t},{d:mk(t,'stand'),t});}L.push({d:mk(0,'dmg'),t:0});if(k==='ursus')for(let i=0;i<6;i++)L.push({d:mk(i*0.2,'move'),t:i*0.2});return L;};
  for(const s of styles){const o=out[s.id]={en:{},def:{}};
   for(const k of ens){if(only&&k!==only)continue;if(s.id!=='gra'&&!(typeof s.en==='function'?s.en(k):Array.isArray(s.en)?s.en.includes(k):['trup','sasiad','urzednik','komunista'].includes(k)))continue;
    let bb=null;for(const st of enStates(k)){const r=bbox(()=>{if(s.id==='gra')drawEnemyRaw(k,AX,AY,U,st);else s.draw(k,AX,AY,U,st);});if(r&&r.err){o.en[k]={err:r.err};bb=null;break;}bb=join(bb,r);}if(bb)o.en[k]=bb;}
   for(const k of defs){if(only&&k!==only)continue;const has=s.id==='gra'||(typeof s.def==='function'&&s.def(k));if(!has)continue;
    let bb=null;for(const q of defStates(k)){const r=bbox(()=>{if(s.id==='gra')drawDefRaw(k,AX,AY,U,q?q.d:null,q?q.t:0);else s.drawDef(k,AX,AY,U,q?q.d:null,q?q.t:0);});if(r&&r.err){o.def[k]={err:r.err};bb=null;break;}bb=join(bb,r);}if(bb)o.def[k]=bb;}
  }
  return out;},{want:String(arg('style','odnowa,odnowa_lekka,pixel')).split(','),only:arg('only',null)});
 const BOX={en:{l:-0.9,r:0.9,t:-1.5*0.88,b:1.5*0.12},def:{l:-0.8,r:0.8,t:-1.5*0.86,b:1.5*0.14}};
 const f=v=>(v>=0?'+':'')+v.toFixed(2);let bad=0,diff=0;
 for(const sid in res){if(sid==='gra')continue;console.log(`\n== ${sid}`);
  for(const u of ['en','def'])for(const k in res[sid][u]){const a=res[sid][u][k],gb=res.gra[u][k],B=BOX[u],msg=[];
   if(a.err){msg.push('BŁĄD '+a.err);}
   else{const over={l:B.l-a.l,r:a.r-B.r,t:B.t-a.t,b:a.b-B.b};for(const s in over)if(over[s]>0.005)msg.push(`poza ramką ${s} ${over[s].toFixed(2)}`);
    if(gb){const hr=(a.b-a.t)/(gb.b-gb.t),wr=(a.r-a.l)/(gb.r-gb.l);if(Math.abs(hr-1)>0.25)msg.push(`wysokość ×${hr.toFixed(2)} gry`);if(Math.abs(wr-1)>0.35)msg.push(`szerokość ×${wr.toFixed(2)} gry`);}}
   if(msg.some(m=>m.startsWith('poza')||m.startsWith('BŁĄD')))bad++;else if(msg.length)diff++;
   if(msg.length){console.log(`${u==='en'?'chołota':'sprzęt '} ${k.padEnd(11)} [${f(a.l||0)},${f(a.r||0)}]×[${f(a.t||0)},${f(a.b||0)}]  ${msg.join('; ')}`);}}}
 console.log(`\n${bad?bad+' wychodzi poza ramkę (do poprawy)':'wszystko mieści się w ramkach'}; ${diff} o innej wielkości niż w grze (w ramce)`);
 process.exitCode=bad?1:0;
 if(arg('json',false))console.log(JSON.stringify(res));
 if(errs.length)console.log('BŁĘDY STRONY:\n'+[...new Set(errs)].join('\n'));
 await b.close();srv.close();
})().catch(e=>{console.error(e);srv.close();process.exit(1);});
