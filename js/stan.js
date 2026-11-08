/* ---------- stan ---------- */
let scene='title',G=null,speed=1,paused=false,btns=[];

function maxSlots(li){const w=clamp(Math.floor((LW-200)/50)-1,6,12);return li==null?w:Math.min(w,LEVELS[li].slots||10);}
let PK=null;
function startLevel(li){
 layout();const lv=LEVELS[li];const evil=MODE==='evil';const avail=evil?evilUnits(li):ORDER.filter(k=>lv.defs.includes(k));const mx=maxSlots(li)-(evil?1:0);
 if(avail.length<=mx){newGame(li,avail);return;}
 const pre=[];const add=k=>{if(avail.includes(k)&&!pre.includes(k)&&pre.length<mx)pre.push(k);};
 (evil?lv.newEn:lv.intro).forEach(add);((evil?save.evilLoad:save.load)||[]).forEach(add);avail.forEach(add);
 PK={li,avail,sel:pre,info:null};scene='pick';
}
function newGame(li,load){
 layout();
 const lv=LEVELS[li];
 if(!load)load=ORDER.filter(k=>lv.defs.includes(k)).slice(0,maxSlots(li));
 musicStart();
 const st0=Math.round(lv.start*(EZ()?1.5:1));
 G={li,lv,endless:!!lv.endless,t:0,sam:Math.max(0,st0-150),lost:0,ursUsed:false,intro:{t:0,drop:[1.6,3.1,4.6],done:0},defs:[],grid:[],ens:[],proj:[],picks:[],fx:[],
  urs:[0,1,2,3,4].map(()=>({st:'ready',x:-0.55})),cd:{},sel:null,wi:0,sq:[],banner:null,toast:null,shake:0,sky:7,
  modal:[],modalT:T,seen:{},winT:-1,over:false,wave:0,nextWave:15,kills:0,steal:0,deco:[],plows:[],load};
 for(let r=0;r<5;r++){G.grid.push([]);for(let c=0;c<9;c++)G.grid[r].push(null);}
 for(let i=0;i<60;i++)G.deco.push({x:rr(0.05,8.95),r:rnd(5),dy:rr(0.15,0.85),k:rnd(4)});
 G.cards=ORDER.filter(k=>load.includes(k)).concat(['lopata']);
 for(const k of lv.defs){const d=DEF[k];G.cd[k]=d.cd>15?d.cd*0.6:0;}
 G.waves=lv.endless?[]:parseWaves(lv.waves);
 G.lastT=G.waves.length?G.waves[G.waves.length-1].t:1;
 G.modal.push({kind:'level'});
 if(!lv.endless)G.modal.push({kind:'preview'});
 for(const k of lv.intro)G.modal.push({kind:'def',key:k});
 if(MODE==='evil')evilSetup(li,load);
 scene='play';paused=false;queueWarm();
}
function evilSetup(li,load){
 const lv=LEVELS[li];G.evil=true;G.endless=false;G.waves=[];G.lastT=1;G.intro=null;G.sky=1e9;
 G.sam=150;G.botSam=100+li*20;G.botT=1.5;G.bcd={};G.dawn=195+li*5;G.graves=[];G.farmBimb=EVB.bimbMax+Math.min(2,Math.floor(li/5));
 G.cards=['grob'].concat(evilUnits(li).filter(k=>load.includes(k))).concat(['lopata']);
 G.cd={};for(const k of G.cards)G.cd[k]=0;
 for(const k of evilUnits(li))G.seen[k]=true;
 G.modal=[{kind:'level'},{kind:'arsenal'}];for(const k of lv.newEn)if(UNIT[k])G.modal.push({kind:'en',key:k});
 const pre=[['bimbrownia',2,0],['bimbrownia',1,0],['bimbrownia',3,0],['gumofilce',2,1]];
 if(li>=2)pre.push(['bimbrownia',0,0],['bimbrownia',4,0],['gumofilce',1,1],['gumofilce',3,1]);
 if(li>=6)pre.push(['gumofilce',0,1],['gumofilce',4,1]);
 if(li>=5)pre.push(['woda',2,2]);if(li>=12)pre.push(['armata',1,2],['armata',3,2]);
 for(const [k,r,c] of pre)if(lv.defs.includes(k)&&!G.grid[r][c])makeDef(k,r,c);
}
function farmerStep(){
 const g=G,lv=g.lv,has=k=>lv.defs.includes(k),free=(r,c)=>c>=0&&c<=6&&!g.grid[r][c];
 const can=k=>has(k)&&(g.bcd[k]||0)<=0&&g.botSam>=DEF[k].cost;
 const put=(k,r,c)=>{if(!free(r,c)||!can(k))return false;g.botSam-=DEF[k].cost;g.bcd[k]=DEF[k].cd;makeDef(k,r,c);return true;};
 const thr=[0,0,0,0,0],near=[9,9,9,9,9],und=[0,0,0,0,0],shl=[0,0,0,0,0],big=[0,0,0,0,0];
 for(const e of g.ens){if(e.dead||e.x>9.5)continue;const r=e.row,v=e.hp+e.shield+e.helm;thr[r]+=v;near[r]=Math.min(near[r],e.x);if(e.d.undead)und[r]++;if(e.shield>0)shl[r]++;if(v>=600||e.d.vehicle)big[r]=Math.max(big[r],e.x);}
 for(let r=0;r<5;r++)if(near[r]<2.4&&thr[r]>250){
  if(can('flaszka')){const c=Math.max(0,Math.floor(near[r]));for(const cc of [c,c-1,c+1])if(put('flaszka',r,cc))return;}
  if(can('plug')&&thr[r]>500){for(let c=0;c<=Math.min(6,Math.floor(near[r]));c++)if(put('plug',r,c))return;}}
 for(let r=0;r<5;r++)if(big[r]&&big[r]<8.5&&can('aparatura')){const c=Math.min(6,Math.floor(big[r])-2);if(c>=2&&put('aparatura',r,c))return;}
 const nb=g.defs.filter(d=>d.k==='bimbrownia').length,danger=Math.max(...thr);
 if(nb<g.farmBimb&&danger<400){for(const r of [2,1,3,0,4])if(put('bimbrownia',r,0))return;}
 const order=[0,1,2,3,4].sort((a,b)=>thr[b]-thr[a]);
 for(const r of order){
  let n=0;for(let c=1;c<=4;c++){const d=g.grid[r][c];if(d&&SHOOT.includes(d.k))n++;}
  const want=Math.min(4,1+Math.floor(thr[r]/350)+(g.t>70?1:0));
  if(n<want&&(thr[r]>0||n<1)){
   const pick=[und[r]&&can('woda')?'woda':null,shl[r]&&can('resztki')?'resztki':null,thr[r]>500&&can('armata')?'armata':null,can('samowar')&&Math.random()<0.5?'samowar':null,can('pralka')&&Math.random()<0.3?'pralka':null,can('gumofilce')?'gumofilce':null].find(x=>x);
   if(pick){for(let c=1;c<=4;c++)if(put(pick,r,c))return;}}
 }
 for(const r of order){if(thr[r]<=0)continue;
  if(near[r]<7.5){for(const k of ['szafa','rubin','kombajn'])if(put(k,r,5))return;}
  if(put('kabel',r,6))return;
  if(und[r]){for(const c of [3,4])if(put('relikwia',r,c))return;}
  if(thr[r]>400&&put('lancuch',r,6))return;
  if(near[r]<6&&put('pila',r,4))return;
  if(put('rozlew',r,6))return;}
}
function evilTap(r,c){
 const k=G.sel;if(!k){const gr=G.graves.find(q=>q.r===r&&q.c===c);toast(gr?GROB.name:'Wybierz u góry chołotę albo grób');return;}
 if(k==='lopata'){const gi=G.graves.findIndex(q=>q.r===r&&q.c===c);if(gi>=0){G.graves.splice(gi,1);G.sam+=25;sfx('place');fxText(PX(c+0.5),FY(r)-L.rowH*0.8,'+25','#c8f0ff');}G.sel=null;return;}
 if(G.sam<costOf(k)){toast('Za mało duszyczek');G.sel=null;return;}
 if(G.cd[k]>0){G.sel=null;return;}
 if(k==='grob'){if(c<7){toast('Groby tylko na cmentarzu: dwie ostatnie kolumny');return;}if(G.graves.some(q=>q.r===r&&q.c===c)){toast('Tu już jest grób');return;}
  G.sam-=GROB.cost;G.cd.grob=GROB.cd;G.graves.push({r,c,t:4});sfx('place');burst(PX(c+0.5),FY(r)-4,'#5a4a3a',8,60);G.sel=null;return;}
 G.sam-=costOf(k);G.cd[k]=cdOf(k);spawn(k,r,9.3);sfx('place');burst(PX(9.1),FY(r)-L.rowH*0.4,'#7a6a9a',10,80);G.sel=null;
}
function evilWin(e){G.over=true;scene='win';G.loseT=T;G.loseK=e?e.k:'trup';musicStop();sfx('win');
 const f=(G.dawn-G.t)/G.dawn;G.stars=f>0.35?3:f>0.15?2:1;save.evilStars[G.li]=Math.max(save.evilStars[G.li]||0,G.stars);save.evilUnlocked=Math.max(save.evilUnlocked,Math.min(CAMP,G.li+2));persist();}
function evilLose(){G.over=true;scene='lose';G.dawnLose=true;musicStop();sfx('lose');}
function pushModal(m){if(!G.modal.length)G.modalT=T;G.modal.push(m);sfx('sting');}
function banner(s){if(DEMO)return;G.banner={tx:s,t:2.6};sfx('banner');}
function toast(s){G.toast={tx:s,t:1.6};}
function fxText(x,y,s,c){G.fx.push({k:'txt',x,y,tx:s,c,t:0,T:1.1});}
function burst(x,y,c,n,sp){for(let i=0;i<n;i++)G.fx.push({k:'p',x,y,vx:rr(-1,1)*sp,vy:rr(-1.3,0.2)*sp,c,t:0,T:rr(0.35,0.8),sz:rr(1.5,3.6)});}
function launchWave(w,isLast){
 if(w.flag.includes('#'))banner('BOSS NADCHODZI!');
 else if(w.flag.includes('!'))banner(isLast?'OSTATNIA FALA!':'NADCIĄGA CHOŁOTA!');
 const gap=w.flag?0.45:0.9;
 w.list.forEach((k,i)=>G.sq.push({at:G.t+i*gap+rr(0,0.3),k}));
}
function spawn(k,row,x){
 const d=EN[k];if(row==null)row=k==='boss'?2:rnd(5);
 const hm=G&&G.evil&&!DEMO?EVB.hp:(EZ()&&!DEMO)?0.7:1;
 const e={k,d,row,y:row,x:x!=null?x:9.35+rr(0,0.5),hp:d.hp*hm,mx:d.hp*hm,max:d.hp+(d.shield||0)+(d.helm||0),shield:(d.shield||0)*hm,helm:(d.helm||0)*hm,sp:d.sp,stun:0,flash:0,anim:rr(0,10),
  jumped:false,jump:0,charged:false,lane:rr(3,6),sum:6,stampCd:0,zap:0,bub:null,bubAt:d.say&&(Math.random()<0.45||d.boss)?G.t+rr(1.5,6):-1,dead:false,uHit:false,eating:null};
 G.ens.push(e);
 if(k==='trup'||k==='mumia'||k==='lenin')sfx('groan');if(k==='kura')sfx('cluck');if(k==='krowa')sfx('moo');if(k==='nysa')sfx('siren');if(k==='swinia')sfx('squeal');
 if(!DEMO&&!save.seen.includes(k)&&k!=='buraczek'){save.seen.push(k);persist();}
 if(G.lv.newEn.includes(k)&&!G.seen[k]){G.seen[k]=true;pushModal({kind:d.boss?'boss':'en',key:k});}
 return e;
}

