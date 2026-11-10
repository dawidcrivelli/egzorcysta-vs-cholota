#!/usr/bin/env node
/* Prosty bot, który gra noce bez rysowania (szybciej niż czas rzeczywisty), żeby sprawdzić, czy da się je przejść.
   Uruchom: node tools/bot.js [--levels 6-10] [--runs 3] [--notombs] [--noshovel]
   Bot: zbiera samogon, stawia bimbrownie w kolumnie 0, potem w rzędzie z największym zagrożeniem najlepszy dostępny
   sprzęt strzelający (kolumny 1–3) i ściany (kolumna 5); groby wykopuje łopatą, chyba że --noshovel.
   Wypisuje dla każdej nocy: wygrane/rozgrywki, ile grobów powstało, ile trupów z nich wstało, ile wykopano. */
const {chromium}=require('playwright');
const http=require('http'),fs=require('fs'),path=require('path');
const arg=(k,d)=>{const i=process.argv.indexOf('--'+k);return i<0?d:(process.argv[i+1]&&!process.argv[i+1].startsWith('--')?process.argv[i+1]:true);};
const [L0,L1]=String(arg('levels','6-10')).split('-').map(Number),RUNS=+arg('runs',3),NOTOMBS=!!arg('notombs',false),NOSHOVEL=!!arg('noshovel',false);
const ROOT=path.join(__dirname,'..'),TYPES={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json'};
const srv=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split('?')[0]),f=path.join(ROOT,u==='/'?'index.html':u);
 fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream'});r.end(b);});});
(async()=>{
 await new Promise(ok=>srv.listen(0,ok));const b=await chromium.launch(),p=await b.newPage({viewport:{width:844,height:390}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{localStorage.setItem('evc_save_v1',JSON.stringify({unlocked:16,v:4,mus:false,sfx:false}));});
 await p.goto(`http://localhost:${srv.address().port}/index.html`);await p.waitForTimeout(500);
 const res=await p.evaluate(({L0,L1,RUNS,NOTOMBS,NOSHOVEL})=>{
  window.requestAnimationFrame=()=>0;   // pętla gry stoi, symulujemy sami
  const SHOOT_PREF=['armata','samowar','woda','resztki','pralka','gumofilce'],WALL=['szafa','rubin','kombajn'];
  const out=[];
  for(let li=L0-1;li<=L1-1;li++){const row={night:li+1,name:LEVELS[li].name,wins:0,runs:0,tombs:0,rose:0,dug:0,lostAt:[]};
   for(let run=0;run<RUNS;run++){
    MODE='good';newGame(li);G.modal=[];paused=false;G.intro=null;if(NOTOMBS)G.tombNight=false;
    let made=0;const push0=G.tombs.push.bind(G.tombs);G.tombs.push=(...a)=>{made+=a.length;return push0(...a);};
    let rose=0,dug=0,botT=0;const dt=1/30;
    while(!G.over&&scene==='play'&&G.t<400){
     update(dt);
     for(const q of G.tombs)if(q.rose&&!q.counted){q.counted=true;rose++;}
     for(const pk of G.picks)if(pk.st!=='fly')collect(pk);
     botT-=dt;if(botT>0)continue;botT=0.5;
     const can=k=>G.cards.includes(k)&&G.cd[k]<=0&&G.sam>=DEF[k].cost;
     const put=(k,r,c)=>{if(G.grid[r][c]||tombAt(r,c)||!can(k))return false;G.sel=k;tryPlace(r,c);return true;};
     if(!NOSHOVEL&&G.tombs.length){const q=G.tombs[0];G.sel='lopata';tryPlace(q.r,q.c);dug++;continue;}
     const thr=[0,0,0,0,0];for(const e of G.ens)if(!e.dead)thr[e.row]+=e.hp+e.shield+e.helm;
     const nb=G.defs.filter(d=>d.k==='bimbrownia').length;
     if(nb<5&&(Math.max(...thr)<300||nb<2)){for(const r of [2,1,3,0,4])if(put('bimbrownia',r,0))break;continue;}
     const order=[0,1,2,3,4].sort((a,c)=>thr[c]-thr[a]);let done=false;
     for(const r of order){for(const k of SHOOT_PREF){if(!can(k))continue;for(const c of [1,2,3])if(put(k,r,c)){done=true;break;}if(done)break;}if(done)break;}
     if(!done)for(const r of order)if(thr[r]>0){for(const k of WALL)if(put(k,r,5)){done=true;break;}if(done)break;}
    }
    row.runs++;if(scene==='win')row.wins++;else row.lostAt.push(Math.round(G.t));row.tombs+=made;row.rose+=rose;row.dug+=NOSHOVEL?0:G.tombs.length===0?made:dug;
    scene='title';
   }
   out.push(row);}
  return out;},{L0,L1,RUNS,NOTOMBS,NOSHOVEL});
 console.log(`groby: ${NOTOMBS?'wyłączone':'włączone'}${NOSHOVEL?', bot nie kopie':''}`);
 for(const r of res)console.log(`noc ${r.night} ${r.name.padEnd(22)} wygrane ${r.wins}/${r.runs} | grobów ${r.tombs}, wstało ${r.rose}${r.lostAt.length?' | przegrane w s: '+r.lostAt.join(','):''}`);
 if(errs.length)console.log('BŁĘDY:\n'+[...new Set(errs)].join('\n'));
 await b.close();srv.close();
})().catch(e=>{console.error(e);srv.close();process.exit(1);});
