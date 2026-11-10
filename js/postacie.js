/* Przegląd postaci (postacie.html): duże podglądy chołoty i sprzętu rysowane kodem gry, bez pętli gry.
   Skrypty gry bierze z index.html, więc nowe pliki gry wczytają się same.
   Na localhost przeładowuje się po zapisie dowolnego pliku: edytuj grafikę, patrz od razu. */
(()=>{
const SKIP=/petla_i_wejscie/, POLL_MS=1000, FIT=0.92, STRIP=0.28, STORE='postacie-ui';
const LOCAL=/^(localhost|127\.|\[::1\])/.test(location.hostname);
// pudełko klatki w buforze gry (szer., wys., zaczepienie y) w jednostkach wysokości postaci; jak w drawEnemyKey / drawDef
const BOX={en:{w:1.8,h:1.5,ay:0.88},def:{w:1.6,h:1.5,ay:0.86}};
const GAME_ROWS=2.7*BOX.en.h;   // w „skali z gry” rząd tak, żeby zmieścił się Pałac Kultury
const SPEEDS=[[0,'⏸'],[0.25,'¼'],[0.5,'½'],[1,'1×'],[2,'2×']];
const TABS=[['en','Chołota'],['def','Sprzęt'],['style','Style']];
/* Próby stylów: każdy plik js/styles/<id>.js dopisuje się do STYLES i rysuje te postacie */
const STYLE_ENEMIES=['trup','sasiad','urzednik','komunista'];
const STYLE_FILES=['odnowa','odnowa_ludzie','odnowa_ludzie2','odnowa_stwory','odnowa_sprzet1','odnowa_sprzet2','odnowa_lekka','szkic','chibi','pixel','wycinanka','plakat','cien','glina','kreska','pixel_ludzie','pixel_ludzie2','pixel_stwory','pixel_sprzet1','pixel_sprzet2'];
const STYLE_STATES={idzie:{walk:true},gryzie:{eat:true},stoi:{},mówi:{walk:true,talk:true},'bez transparentu':{walk:true,shield:0}};
/* styl może rysować też całą obsadę: s.en / s.def / s.hero = lista kluczy albo funkcja k=>bool,
   s.draw(k,x,y,h,st) chołota, s.drawDef(k,x,by,sz,d,t) sprzęt, s.drawHero(x,y,h,t) Zdzichu; czego nie ma, rysuje gra */
const styleHas=(s,unit,k)=>{if(!s||s.id==='gra')return false;const f=s[unit];
 return typeof f==='function'?!!f(k):Array.isArray(f)?f.includes(k):unit==='en'&&!!s.draw&&STYLE_ENEMIES.includes(k);};
const curStyle=()=>STYLES.find(s=>s.id===UI.style);
window.STYLES=[{id:'gra',name:'Obecna grafika',desc:'Tak jak teraz w grze, do porównania.',draw:(k,x,y,h,st)=>drawEnemyRaw(k,x,y,h,st)}];
const UI=Object.assign({style:'gra',tab:'en',speed:1,bg:'trawa',box:false,frames:false,gameScale:false,q:'',st:{},big:null},JSON.parse(localStorage.getItem(STORE)||'{}'));
// ustawienia z adresu, np. postacie.html?tab=def&frames=1&box=1&q=pila&state=gryzie&speed=0&t=1.3
for(const [k,v] of new URLSearchParams(location.search))UI[k]=v==='1'?true:v==='0'?false:k==='speed'?+v:v;
const keep=()=>localStorage.setItem(STORE,JSON.stringify({...UI,state:undefined,t:undefined}));   // state, t: tylko z adresu
const $=s=>document.querySelector(s);
let cards=[],last=0;

/* tła: u = jednostka postaci, żeby kratka trawy pasowała do skali */
const BGS={
 trawa(W,H,u){ctx.fillStyle='#5e8f33';ctx.fillRect(0,0,W,H);const c=u*1.1;for(let y=0;y<H;y+=c)for(let x=0;x<W;x+=c){ctx.fillStyle=((x/c+y/c)&1)?'#78b443':'#6aa63b';ctx.fillRect(x,y,c+0.5,c+0.5);}},
 jasne(W,H){fr('#efe6d0',0,0,W,H);},
 ciemne(W,H){fr('#141414',0,0,W,H);},
 szachownica(W,H){const c=16;for(let y=0;y<H;y+=c)for(let x=0;x<W;x+=c){ctx.fillStyle=((x/c+y/c)&1)?'#9a9a9a':'#cfcfcf';ctx.fillRect(x,y,c,c);}}
};

/* atrapa stanu sprzętu jak w logika.js; 'działa' = cykl strzału co def.rate */
function mockDef(k,t,mode){
 const def=DEF[k],r=def.rate||1.5,ph=t%r,act=mode==='działa',max=def.hp||1;
 return{k,def,hp:mode==='uszkodzony'?max*0.2:max,max,t:act?r-ph:9,kick:act&&ph<0.25?0.25-ph:0,rev:act,armed:act,armT:act?0:(def.arm||0),
  reload:0,life:def.life||0,hitT:0,anim:t,moving:mode==='jedzie'};
}
const night=(k,f)=>{const i=LEVELS.findIndex(l=>(l[f]||[]).includes(k));return i>=0?' · od nocy '+(i+1):'';};

function enemyCard(k){
 const d=EN[k],b={sp:d.sp,shield:d.shield||0,helm:d.helm||0,hp:1},w={...b,walk:true};
 const states={idzie:w,gryzie:{...b,eat:true},stoi:b,mówi:{...w,talk:true}};
 if(d.shield)states['bez transparentu']={...w,shield:0};
 if(d.helm)states['bez hełmu']={...w,helm:0};
 if(k==='boss')Object.assign(states,{ranny:{...w,hp:0.5},'ledwo żyje':{...w,hp:0.2}});
 return{k,unit:'en',name:d.name||k,desc:d.desc,states,
  stats:`❤ ${d.hp}`+(d.shield?` · 🪧 ${d.shield}`:'')+(d.helm?` · ⛑ ${d.helm}`:'')+` · 🏃 ${d.sp}`+(d.bite?` · 🦷 ${d.bite}`:'')+(d.undead?' · umarlak':'')+(d.boss?' · boss':'')+night(k,'newEn'),
  hr:enemyHR(k),
  raw:(x,y,h,st,t)=>{const s=curStyle();styleHas(s,'en',k)?s.draw(k,x,y,h,{...st,t}):drawEnemyRaw(k,x,y,h,{...st,t});},
  cached:(x,y,h,st,t)=>{const s=curStyle();styleHas(s,'en',k)?s.draw(k,x,y,h,{...st,t}):drawEnemyKey(k,x,y,h,{...st,t});},
  cycle:st=>st.walk||st.eat?cycleOf(k,st):null};
}
function defCard(k){
 const d=DEF[k],modes=['ikona','stoi','działa'].concat(d.hp?['uszkodzony']:[],k==='ursus'?['jedzie']:[]);
 const states=Object.fromEntries(modes.map(m=>[m,{mode:m}]));if(DEMO_SPEC[k])states.pokaz={demo:true};
 const dd=(st,t)=>st.mode==='ikona'?null:mockDef(k,t,st.mode);
 return{k,unit:'def',name:d.name,desc:d.desc,states,hr:0.95,
  stats:(d.tool||d.special?'za darmo':`${d.cost} l · ⏱ ${d.cd} s`)+(d.hp?` · ❤ ${d.hp}`:'')+(d.dmg?` · 💥 ${d.dmg}`:'')+(d.dps?` · 💥 ${d.dps}/s`:'')+(d.rate?` · co ${d.rate} s`:'')+night(k,'intro'),
  raw:(x,y,sz,st,t)=>{const s=curStyle();styleHas(s,'def',k)?s.drawDef(k,x,y,sz,dd(st,t),t):drawDefRaw(k,x,y,sz,dd(st,t),t);},
  cached:(x,y,sz,st,t)=>{const s=curStyle();styleHas(s,'def',k)?s.drawDef(k,x,y,sz,dd(st,t),t):drawDef(k,x,y,sz,dd(st,t),t);},
  cycle:()=>({P:1,n:6})};
}
// Zdzichu nie jest ani wrogiem, ani sprzętem: rysowany jak człowiek, cykl polewania 2,8 s (poseDziad)
const dziadCard={k:'dziad',unit:'en',name:'Zdzichu',desc:'Egzorcysta z beczką i wężem.',stats:'bohater',hr:0.88,states:{polewa:{}},
 raw:(x,y,h,st,t)=>{const s=curStyle();styleHas(s,'hero','dziad')?s.drawHero(x,y,h,t):drawHuman('dziad',x,y,h,{t});},cached:(x,y,h,st,t)=>dziadCard.raw(x,y,h,st,t),cycle:()=>({P:2.8,n:8})};

const styleCard=s=>({k:s.id,name:s.name,desc:s.desc,stats:'styl: '+s.id,states:STYLE_STATES,s});
/* karta stylu: 4 postacie obok siebie; błąd w stylu pokazany na karcie, nie psuje reszty */
function drawLineup(c,st,W,H){
 const n=STYLE_ENEMIES.length,sw=W/n,h=UI.gameScale?H/GAME_ROWS*enemyHR('trup'):Math.min(H*0.58,sw*0.95),y=H*0.9;
 BGS[UI.bg](W,H,h);
 STYLE_ENEMIES.forEach((k,i)=>{const d=EN[k],x=sw*(i+0.5);
  ctx.save();try{c.s.draw(k,x,y,h,{sp:d.sp,shield:d.shield||0,helm:0,hp:1,...st,t:T});}catch(e){c.err=e.message;}ctx.restore();
  if(UI.box){const B=BOX.en;ctx.setLineDash([6,4]);ctx.strokeStyle='#ff3df2';ctx.lineWidth=1.5;ctx.strokeRect(x-B.w*h/2,y-B.ay*B.h*h,B.w*h,B.h*h);ctx.setLineDash([]);line(x-10,y,x+10,y,2.5,'#ff3df2');}
  txt(k,x,H-6,11,700,'rgba(255,255,255,.8)','center',['rgba(0,0,0,.6)',3]);});
 if(c.err)txt('błąd: '+c.err,8,H-24,12,700,'#ff6a5a','left',['#000',3]);
}
function drawCard(c){
 const cv=c.cv,dpr=Math.min(devicePixelRatio||1,2),W=cv.clientWidth,H=cv.clientHeight;
 if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(H*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);}
 ctx=c.g;DPR=dpr;S=1;ctx.setTransform(dpr,0,0,dpr,0,0);
 const st=c.states[c.state];
 if(c.s){drawLineup(c,st,W,H);return;}
 if(st.demo){DM=c.dm||null;demoBox(c.k,0,0,W,H);c.dm=DM;return;}   // każda karta ma własny pokaz
 const B=BOX[c.unit],cyc=UI.frames&&c.cycle(st),H1=H-(cyc?H*STRIP:0);
 const u=UI.gameScale?H1/GAME_ROWS*c.hr:Math.min(W/B.w,H1/B.h)*FIT;
 const bw=B.w*u,bh=B.h*u,x0=(W-bw)/2,y0=Math.max(0,(H1-bh)/2),ax=x0+bw/2,ay=y0+bh*B.ay;
 BGS[UI.bg](W,H,u);
 c.raw(ax,ay,u,st,T);
 if(UI.box){ctx.setLineDash([6,4]);ctx.strokeStyle='#ff3df2';ctx.lineWidth=1.5;ctx.strokeRect(x0,y0,bw,bh);ctx.setLineDash([]);
  line(x0,ay,x0+bw,ay,1,'#00e5ff');line(ax-10,ay,ax+10,ay,2.5,'#ff3df2');line(ax,ay-10,ax,ay+10,2.5,'#ff3df2');
  txt('bufor '+B.w+'×'+B.h+' · h='+Math.round(u)+' px',x0+4,y0+bh-4,11,700,'#ff3df2','left',['#000',3]);}
 if(cyc){   // klatki dokładnie tak, jak gra je trzyma w buforze
  const n=cyc.n,sw=W/n,u2=Math.min(sw/B.w,H*STRIP/B.h)*FIT,yT=H1;
  fr('rgba(0,0,0,.45)',0,yT,W,H-yT);
  for(let i=0;i<n;i++){const cx=sw*(i+0.5);c.cached(cx,yT+(H-yT-B.h*u2)/2+B.h*u2*B.ay,u2,st,i/n*cyc.P+1e-4);txt(String(i),sw*i+4,yT+12,10,700,'#ffd66a','left');}
 }
}

function build(){
 const grid=$('#grid');grid.innerHTML='';
 const list=UI.tab==='style'?STYLES.map(styleCard):UI.tab==='en'?ALM_EN.concat('buraczek').map(enemyCard):[dziadCard].concat(ALM_DEF.map(defCard));
 const q=UI.q.toLowerCase();
 cards=list.filter(c=>!q||(c.name+' '+c.k).toLowerCase().includes(q));
 const io=new IntersectionObserver(es=>es.forEach(e=>{e.target.card.vis=e.isIntersecting;}));
 for(const c of cards){
  const el=document.createElement('section');el.className='card'+(UI.big===c.k?' big':'');
  el.innerHTML=`<canvas title="2× klik: powiększ"></canvas><div class="info"><h2>${c.name}<small>${c.k}</small></h2><div class="stats">${c.stats}</div><p>${c.desc||''}</p></div><div class="states"></div>`;
  c.cv=el.querySelector('canvas');c.g=c.cv.getContext('2d');c.state=[UI.state,UI.st[c.k]].find(s=>c.states[s])||Object.keys(c.states)[0];
  const box=el.querySelector('.states');
  for(const s in c.states){const b=document.createElement('button');b.textContent=s;b.classList.toggle('on',s===c.state);
   b.onclick=()=>{c.state=UI.st[c.k]=s;box.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));keep();};box.append(b);}
  c.cv.ondblclick=()=>{UI.big=UI.big===c.k?null:c.k;keep();build();el.scrollIntoView?.();};
  el.card=c;io.observe(el);grid.append(el);
 }
}

/* pasek narzędzi: przełączniki zapisywane w localStorage */
function seg(sel,items,key,after){
 const box=$(sel);box.innerHTML='';
 for(const [v,l] of items){const b=document.createElement('button');b.textContent=l;b.classList.toggle('on',UI[key]===v);
  b.onclick=()=>{UI[key]=v;keep();seg(sel,items,key,after);after&&after();};box.append(b);}
}
function toolbar(){
 seg('#tabs',TABS,'tab',build);seg('#speeds',SPEEDS,'speed');
 $('#style').innerHTML=STYLES.map(s=>`<option value="${s.id}"${s.id===UI.style?' selected':''}>${s.id==='gra'?'styl: gra':s.name}</option>`).join('');
 $('#style').onchange=e=>{UI.style=e.target.value;keep();};
 $('#bg').innerHTML=Object.keys(BGS).map(b=>`<option${b===UI.bg?' selected':''}>${b}</option>`).join('');
 $('#bg').onchange=e=>{UI.bg=e.target.value;keep();};
 for(const id of ['box','frames','gameScale']){$('#'+id).checked=UI[id];$('#'+id).onchange=e=>{UI[id]=e.target.checked;keep();};}
 $('#q').value=UI.q;$('#q').oninput=e=>{UI.q=e.target.value;keep();build();};
}

function frame(now){
 const dt=last?Math.min(0.05,(now-last)/1000):0;last=now;FDT=dt*UI.speed;T+=FDT;
 for(const c of cards)if(c.vis)drawCard(c);
 requestAnimationFrame(frame);
}
function main(){
 if(UI.t)T=+UI.t;   // ?t=1.3: start w danej chwili animacji (np. do zrzutów przy speed=0)
 toolbar();build();
 if(UI.scrollY){scrollTo(0,UI.scrollY);delete UI.scrollY;keep();}
 requestAnimationFrame(frame);
}
/* przeładowanie po zmianie pliku (Last-Modified z serwera), z zachowaniem przewinięcia */
function watch(files){
 const seen={};
 setInterval(async()=>{for(const f of files){
  const r=await fetch(f,{method:'HEAD',cache:'no-store'}).catch(()=>null),m=r&&r.headers.get('last-modified');
  if(m&&seen[f]&&seen[f]!==m){UI.scrollY=scrollY;keep();location.reload();return;}
  if(m)seen[f]=m;}},POLL_MS);
}

fetch('index.html').then(r=>r.text()).then(html=>{
 const srcs=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(s=>!SKIP.test(s));
 srcs.push(...STYLE_FILES.map(f=>`js/styles/${f}.js`));   // brakujący plik stylu nie blokuje strony (onerror)
 srcs.forEach((s,i)=>{const el=document.createElement('script');el.src=s;el.async=false;if(i===srcs.length-1)el.onload=el.onerror=main;document.body.append(el);});
 if(LOCAL)watch(['postacie.html','css/postacie.css','js/postacie.js',...srcs]);
});
})();
