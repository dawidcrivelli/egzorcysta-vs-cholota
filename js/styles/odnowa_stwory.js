/* Odnowa: chołota bez szkieletu (Nysa, świnia, kura, buraki, barszcz, krowa, Pałac).
   Rysuje w jednostkach 100 = wzrost postaci w grze, ziemia y=0, przodem w lewo; rozmiary jak w drawEnemyRaw.
   Kontur OL/OLW i dwa tony jak w grze; oczy zawsze po jednej stronie twarzy (3/4) albo jedno oko z profilu. */
(()=>{
const PI=Math.PI,X=ODN.X;
const E=(x,y,rx,ry,a)=>()=>ctx.ellipse(x,y,rx,ry,a||0,0,7);
const PL=p=>()=>{ctx.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);ctx.closePath();};
const el=(x,y,rx,ry,c,a)=>{ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,a||0,0,7);ctx.fill();};
const oel=(x,y,rx,ry,c,w,a)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,a||0,0,7);fs(c,w);};
const rect=(c,x,y,w,h)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
const ground=(rx,x)=>el(x||0,0,rx,rx*0.13,'rgba(0,0,0,.38)');
// cień: wszystko poza kształtem przesuniętym w lewo-górę (sierp z prawej-dołu)
function shade(path,k,a){ctx.save();ctx.beginPath();path();ctx.clip();ctx.beginPath();ctx.rect(-900,-900,1800,1800);ctx.save();ctx.translate(-k,-k*0.6);path();ctx.restore();ctx.fillStyle='rgba(25,12,4,'+(a||0.26)+')';ctx.fill('evenodd');ctx.restore();}
// bryła: kolor, szczegóły w obrysie, cień, kontur
function blob(path,col,k,detail,lw){ctx.beginPath();path();ctx.fillStyle=col;ctx.fill();
 if(detail){ctx.save();ctx.beginPath();path();ctx.clip();detail();ctx.restore();}
 shade(path,k);ctx.beginPath();path();ctx.strokeStyle=OL;ctx.lineWidth=lw||OLW;ctx.lineJoin='round';ctx.stroke();}
function eye(x,y,r,o){o=o||{};
 if(o.glow){ctx.save();ctx.shadowColor=o.glow;ctx.shadowBlur=r*1.6;}
 oel(x,y,r*(o.sx||1),r*(o.lid||1),o.white||'#fbf6ea',OLW*0.8);if(o.glow)ctx.restore();
 if((o.lid||1)>0.25)el(x+(o.px==null?-r*0.3:o.px),y+(o.py||0),r*(o.pr||0.42),r*(o.pr||0.42)*Math.min(1,(o.lid||1)*1.3),o.pupil||'#1a120c');
 if(o.lid&&o.lid<1)ln(x-r*1.1,y-r*o.lid,x+r*1.1,y-r*o.lid,OL,OLW*1.1);}
const brow=(x1,y1,x2,y2,w,c)=>{ln(x1,y1,x2,y2,OL,w+OLW*1.2);ln(x1,y1,x2,y2,c||'#2a1a10',w);};
function puffs(x,y,t,n,dx,dy,c,sp){for(let i=0;i<n;i++){const p=((t*(sp||1)+i/n)%1);ctx.fillStyle=(c||'rgba(120,120,120,')+(0.55*(1-p))+')';ctx.beginPath();ctx.arc(x+dx*p,y+dy*p,1.6+p*4.5,0,7);ctx.fill();}}

/* ---------- Milicyjna Nysa: zła mina na przodzie, kraty w oknach, kogut i szczekaczka ---------- */
X.nysa=(st,t)=>{
 const mv=st.walk||st.eat,b=mv?Math.sin(t*14)*0.9:0,cr=st.eat?Math.sin(t*21)*0.02:0;
 ground(63,-3);
 if(mv)puffs(57,-15,t,3,16,-12,'rgba(110,110,110,',1.4);
 if(st.eat)for(let i=0;i<3;i++){const p=((t*2+i/3)%1);el(-60-p*14,-3-p*6,3+p*5,2+p*3,'rgba(170,140,90,'+(0.6*(1-p))+')');}
 ctx.save();ctx.translate(0,b);ctx.rotate(cr);
 // antena i szczekaczka
 const aw=Math.sin(t*7)*3;ctx.beginPath();ctx.moveTo(48,-67);ctx.quadraticCurveTo(50,-80,53+aw,-92);sk(OL,2.2);ctx.beginPath();ctx.moveTo(48,-67);ctx.quadraticCurveTo(50,-80,53+aw,-92);sk('#888',1);
 const body=()=>{ctx.moveTo(-63,-15);ctx.lineTo(-63,-33);ctx.quadraticCurveTo(-62,-41,-55,-43);ctx.lineTo(-47,-64);ctx.quadraticCurveTo(-45.5,-67.5,-41,-67.5);ctx.lineTo(50,-67.5);ctx.quadraticCurveTo(55.5,-67.5,55.5,-62);ctx.lineTo(55.5,-15);ctx.closePath();};
 blob(body,'#eef0f2',5,()=>{
  rect('#2f5fa8',-70,-39,140,25);rect('#f6f6f6',-70,-40.5,140,1.6);
  for(const wx of [-38,32]){el(wx,-11,15,15,'#1e2430');}
  ctx.font='900 9px '+FONT;ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText('MILICJA',-1,-24);
  ln(-27,-63,-27,-16,'rgba(0,0,0,.35)',0.9);rect('#2a2a2a',-25,-36,4,1.5);
  // okna boczne: pierwsze zwykłe, w drugim i trzecim kraty i ponura twarz za kratami
  for(const [x0,bars] of [[-22,false],[2,true],[27,true]]){ctx.beginPath();ctx.roundRect(x0,-62,20,16,2);fs('#9cc4de',OLW*0.8);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(x0+3,-60,3,12);
   if(x0===2){ctx.save();ctx.beginPath();ctx.roundRect(x0,-62,20,16,2);ctx.clip();oel(x0+10,-50,5.5,6,'#e2b590',OLW*0.6);eye(x0+8,-52,1.3,{lid:0.5,px:-0.2});ln(x0+6,-47.6,x0+10,-47.8,'#7a3a2a',0.7);ctx.fillStyle='#3a3a3a';ctx.beginPath();ctx.ellipse(x0+10,-56.5,5.8,2.4,0,PI,0);ctx.fill();ctx.restore();}
   if(bars)for(let i=1;i<5;i++){ln(x0+i*4,-62,x0+i*4,-46,OL,1.6);ln(x0+i*4,-62,x0+i*4,-46,'#8a9096',0.8);}}
  // przednia szyba i kierowca z profilu
  const ws=PL([[-53,-45],[-45.5,-63],[-30,-63],[-30,-45]]);ctx.beginPath();ws();fs('#8fb8d4',OLW*0.9);
  ctx.save();ctx.beginPath();ws();ctx.clip();
  oel(-38,-52,6,6.4,'#dcae88',OLW*0.7);el(-35.5,-51,1.4,1.8,'#c9967a');
  eye(-41.4,-53.4,1.4,{pr:0.5});brow(-43.6,-56.6,-39.4,-55.4,0.9,'#2a1a10');
  ctx.beginPath();ctx.moveTo(-44.6,-50.4);ctx.lineTo(-40,-50.8);ctx.lineTo(-40.4,-49.2);ctx.lineTo(-44,-48.8);fs('#3a2618',OLW*0.4);
  ctx.beginPath();ctx.moveTo(-44.6,-56.6);ctx.lineTo(-31.6,-57.6);ctx.lineTo(-32,-62);ctx.lineTo(-42,-62.6);ctx.closePath();fs('#3d4f6a',OLW*0.7);rect('#a42020',-44.2,-58.6,12.6,1.6);
  ctx.beginPath();ctx.moveTo(-44.6,-57);ctx.lineTo(-49.6,-56);ctx.lineTo(-44,-55.4);fs('#1a1a1a',OLW*0.5);
  ctx.fillStyle='rgba(255,255,255,.4)';ctx.beginPath();ctx.moveTo(-50,-47);ctx.lineTo(-44,-62);ctx.lineTo(-41,-62);ctx.lineTo(-47,-47);ctx.fill();
  ctx.restore();
 });
 // przód: reflektor-oko z gniewną brwią i paszcza z zębami
 ctx.save();ctx.beginPath();body();ctx.clip();
 ctx.beginPath();ctx.moveTo(-64,-23);ctx.lineTo(-51,-21.4);ctx.quadraticCurveTo(-52,-15,-56,-15);ctx.lineTo(-64,-15);ctx.closePath();fs('#2a0e0c',OLW*0.8);
 ctx.fillStyle='#f4eedc';for(let i=0;i<4;i++){const x=-63+i*3;ctx.beginPath();ctx.moveTo(x,-22.6+i*0.2);ctx.lineTo(x+2.6,-22.3+i*0.2);ctx.lineTo(x+1.3,-19.6+i*0.2);ctx.fill();}
 ctx.restore();
 const on=Math.sin(t*14)>0;
 ctx.save();ctx.shadowColor='rgba(255,240,170,.9)';ctx.shadowBlur=6;oel(-59.5,-29,4.4,4.4,'#fff6c8',OLW*0.9);ctx.restore();
 el(-61,-28.6,1.7,1.9,'#1a120c');el(-60.4,-29.6,0.6,0.6,'#fff');brow(-65,-36.4,-54.6,-32.4,1.8,'#1c2433');
 ctx.beginPath();ctx.roundRect(-66,-17.4,17,4.4,1.6);fs('#b8bec4',OLW*0.8);ctx.beginPath();ctx.roundRect(48,-17.4,10,4.4,1.6);fs('#b8bec4',OLW*0.8);
 // dach: kogut i szczekaczka
 if(on){const g=ctx.createRadialGradient(-12,-71,1,-12,-71,30);g.addColorStop(0,'rgba(80,150,255,.85)');g.addColorStop(1,'rgba(80,150,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(-12,-71,30,0,7);ctx.fill();}
 ctx.beginPath();ctx.roundRect(-19,-70.5,14,3.4,1);fs('#2a2a2a',OLW*0.8);
 ctx.beginPath();ctx.ellipse(-12,-70.5,5.4,6.4,0,PI,0);ctx.closePath();fs(on?'#5aa8ff':'#1c3c80',OLW*0.8);el(-14,-73.5,1.2,2,'rgba(255,255,255,.6)');
 ln(16,-67.5,22,-72,OL,2.4);ln(22,-72,30,-67.5,OL,2.4);
 ctx.beginPath();ctx.moveTo(26,-74.6);ctx.lineTo(16,-72.4);ctx.lineTo(9,-77);ctx.lineTo(9,-66);ctx.lineTo(16,-70);ctx.lineTo(26,-69.4);ctx.closePath();fs('#c8ccd0',OLW*0.8);
 el(9,-71.5,1.4,5.4,'#4a4e54');
 if(st.talk||st.eat){for(let i=0;i<3;i++){const p=((t*2.5+i/3)%1);ctx.globalAlpha=1-p;ctx.beginPath();ctx.arc(9,-71.5,4+p*14,PI*0.75,PI*1.25);sk('#fff',1.4);ctx.globalAlpha=1;}}
 ctx.restore();
 // koła
 for(const wx of [-38,32]){ctx.save();ctx.translate(wx,-11);ctx.beginPath();ctx.arc(0,0,11.2,0,7);fs('#151515');ctx.beginPath();ctx.arc(0,0,6,0,7);fs('#a0a6ac',OLW*0.8);
  ctx.rotate(-(mv?t*7*3:0));for(let i=0;i<5;i++){ctx.rotate(PI*2/5);el(0,-3.6,0.9,0.9,'#55585c');}el(0,0,1.6,1.6,'#d4d8dc');ctx.restore();}
};

/* ---------- Zła świnia: dzik z irokezem, kolczatka, kły, tatuaż „przekreślona kiełbasa” ---------- */
X.swinia=(st,t)=>{
 const run=st.walk,ph=t*12,b=run?Math.abs(Math.cos(ph))*2.4:0,eat=st.eat;
 ground(40,2);
 const P='#ee9cab';
 const leg=(x,o,far)=>{const a=run?0.55*Math.sin(ph+o):eat?0.15*Math.sin(t*10+o):0.05,hp=[x,-30-b],kn=add(hp,dir(a,13)),an=add(kn,dir(a*0.4-0.15,12));
  chain([hp,kn,an],[11,8.6,7.6],P,far);ctx.save();ctx.translate(an[0],an[1]);ctx.beginPath();ctx.moveTo(-4.6,-1);ctx.lineTo(4,-1);ctx.lineTo(4.4,4);ctx.lineTo(-5.4,4);ctx.closePath();fs(far?'#3a221c':'#4a2a24');ln(-0.4,-0.6,-0.6,4,'#1a0c08',0.8);ctx.restore();};
 leg(-14,PI,true);leg(26,0,true);
 ctx.save();ctx.translate(0,-b);
 // ogonek-sprężynka
 ctx.beginPath();ctx.moveTo(34,-46);for(let i=0;i<=12;i++){const a=i/12*PI*3,r=3.4;ctx.lineTo(37+i*0.8+Math.cos(a)*r,-50+Math.sin(a)*r+Math.sin(t*12)*i*0.06);}sk(OL,3);
 ctx.beginPath();ctx.moveTo(34,-46);for(let i=0;i<=12;i++){const a=i/12*PI*3,r=3.4;ctx.lineTo(37+i*0.8+Math.cos(a)*r,-50+Math.sin(a)*r+Math.sin(t*12)*i*0.06);}sk(P,1.6);
 // irokez
 for(let i=0;i<9;i++){const x=-22+i*5.6,h=8+((i*7)%3)*3+Math.sin(t*12+i)*0.8;ctx.beginPath();ctx.moveTo(x-3,-56+i*0.2);ctx.lineTo(x+0.6+(run?2:0),-56-h);ctx.lineTo(x+3.4,-56+i*0.2);ctx.closePath();fs('#4a2030',OLW*0.8);}
 blob(E(4,-41,34,20),P,6,()=>{
  el(4,-26,26,6,'#f6c0ca');
  // tatuaż: serce z przekreśloną kiełbasą
  ctx.save();ctx.translate(14,-44);ctx.beginPath();ctx.moveTo(0,5);ctx.bezierCurveTo(-9,-1,-6,-8,0,-4);ctx.bezierCurveTo(6,-8,9,-1,0,5);sk('#2a4a8a',1.2);
  ctx.beginPath();ctx.ellipse(0,-1,4.4,1.6,-0.3,0,7);ctx.fillStyle='#b0503a';ctx.fill();ln(-4,2.4,4,-4.4,'#c42a20',1.2);ctx.restore();
  // blizna ze szwami
  ln(-6,-52,6,-46,'#b06070',1);for(let i=0;i<4;i++){const q=lp([-6,-52],[6,-46],(i+0.5)/4);ln(q[0]-1,q[1]+1.4,q[0]+1,q[1]-1.4,'#7a3040',0.6);}
 });
 // kolczatka
 ctx.save();ctx.translate(-25,-42);ctx.rotate(0.25);ctx.beginPath();ctx.roundRect(-3.6,-17,7.2,32,3);fs('#2a2a2a',OLW*0.9);for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-5,-12+i*8);ctx.lineTo(-9,-10+i*8);ctx.lineTo(-5,-8+i*8);ctx.closePath();fs('#d4d8dc',OLW*0.5);}ctx.restore();
 // głowa w 3/4: ryj z przodu, oboje oczu nad ryjem
 const hd=eat?0.22+0.16*Math.sin(t*10):run?0.06*Math.sin(ph):0;
 ctx.save();ctx.translate(-34,-46);ctx.rotate(-hd);
 ctx.beginPath();ctx.moveTo(4,-11);ctx.quadraticCurveTo(12,-24,16,-15);ctx.quadraticCurveTo(12,-10,8,-6);fs(tint(P,0.8));   // dalsze ucho
 blob(E(0,0,15.5,14),P,4,()=>{el(5,-2,6,4,'rgba(220,90,90,.25)');});
 const mo=eat?2+2*Math.abs(Math.sin(t*10)):1;
 ctx.beginPath();ctx.moveTo(-13,7);ctx.quadraticCurveTo(-6,10+mo*1.4,2,8);ctx.lineTo(1,6.6);ctx.quadraticCurveTo(-6,8,-12.6,5.6);fs('#4a1220',OLW*0.8);
 for(const [x,y,s] of [[-12.6,6.4,1],[0.6,7.4,-1]]){ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x-1.4*s,y-4,x+0.6*s,y-6.4);ctx.lineTo(x+1.2*s,y-0.6);ctx.closePath();fs('#f4eedc',OLW*0.6);}
 // ryj
 oel(-12,-0.5,6.4,7.4,'#f6b6c2',OLW*0.9,0.15);el(-14,-1.6,1.3,2.2,'#7a2a3a',0.1);el(-10.2,-0.6,1.3,2.2,'#7a2a3a',0.1);
 ctx.beginPath();ctx.arc(-12,6.6,2.8,0.2,PI-0.2);sk(OL,1.6);ctx.beginPath();ctx.arc(-12,6.6,2.8,0.2,PI-0.2);sk('#e4c040',0.9);
 // oczy: dalsze mniejsze przy ryju, bliższe większe; brwi w V
 eye(-7.4,-6.6,2.4,{white:'#fff2d8',pupil:'#c41a1a',pr:0.5,px:-0.6,sx:0.8});
 eye(1.4,-6.8,3.1,{white:'#fff2d8',pupil:'#c41a1a',pr:0.5,px:-0.9});
 brow(-10.6,-11.4,-5.4,-9.2,1.3);brow(-1.6,-10.2,5.4,-12.6,1.5);
 // bliższe ucho klapnięte do przodu
 ctx.beginPath();ctx.moveTo(4,-11);ctx.quadraticCurveTo(0,-22,-6,-17);ctx.quadraticCurveTo(-3,-13,1,-9);fs('#e48a9a');
 ctx.restore();
 if(run)puffs(-52,-44,t,3,-14,-6,'rgba(235,235,235,',2);
 ctx.restore();
 leg(-22,0,false);leg(18,PI,false);
};

/* ---------- Kura mutant: trzy nogi, dwie głowy z profilu (jedno oko każda), świecące plamy ---------- */
X.kura=(st,t)=>{
 const w=st.walk,s=w?Math.sin(t*16):0,hop=w?Math.abs(Math.sin(t*8))*6:0,eat=st.eat,pk=eat?Math.max(0,Math.sin(t*16)):0;
 ground(20,2);
 const Y='#e8a820';
 for(const [x,ph,far] of [[8,s*0.6,true],[-4,s,false],[3,-s,false]]){const hp=[x,-28-hop],kn=add(hp,dir(ph*0.5+0.2,14)),an=add(kn,dir(ph*0.5-0.3,13));
  chain([hp,kn,an],[3.6,3,2.6],Y,far);ctx.save();ctx.translate(an[0],an[1]+2.6);for(const a of [-1.9,-1.5,-1.1,1.2])ln(0,0,Math.sin(a)*-5,Math.cos(a)*1.4,far?tint(Y,0.8):Y,1.6);ctx.restore();}
 ctx.save();ctx.translate(0,-hop);
 // ogon
 for(let i=0;i<4;i++){ctx.save();ctx.translate(18,-42);ctx.rotate(-0.9+i*0.28+Math.sin(t*8+i)*0.05);ctx.beginPath();ctx.ellipse(0,-9,3,10,0,0,7);fs(i%2?'#2a2a2a':'#3a5a3a',OLW*0.8);ctx.restore();}
 blob(E(3,-38,18,14,-0.15),'#f2ece0',4,()=>{
  for(const [x,y,r] of [[-4,-33,3.4],[10,-41,2.6],[4,-28,2]]){ctx.save();ctx.shadowColor='#b6ff4a';ctx.shadowBlur=6;el(x,y,r,r*0.8,'rgba(170,240,70,.85)');ctx.restore();}
  el(13,-30,4,3,'#f0b8b0');for(let i=0;i<3;i++)el(12+i*1.4,-30.6+i,0.4,0.4,'#c07a70');   // łysy placek
 });
 // skrzydło trzepocze
 ctx.save();ctx.translate(6,-40);ctx.rotate(w?0.35*Math.sin(t*16):eat?-0.2:0);ctx.beginPath();ctx.moveTo(-8,0);ctx.quadraticCurveTo(2,-7,12,-1);ctx.quadraticCurveTo(10,6,4,8);ctx.lineTo(1,5);ctx.lineTo(-2,8);ctx.lineTo(-4,5);ctx.closePath();fs('#e2d9c6');ctx.restore();
 // szyje i głowy (dalsza niżej i ciemniej, bliższa wyżej)
 const head=(nk,hx,hy,r,far,crazy)=>{const c=far?tint('#f2ece0',0.82):'#f2ece0';
  ctx.beginPath();ctx.moveTo(nk[0]-3,nk[1]);ctx.quadraticCurveTo(hx+1,hy+8,hx-1,hy+2);ctx.lineTo(hx+5,hy+3);ctx.quadraticCurveTo(hx+6,hy+10,nk[0]+5,nk[1]);ctx.closePath();fs(c);
  ctx.save();ctx.translate(hx,hy);ctx.rotate(crazy?Math.sin(t*9)*0.12-pk*0.6:(eat?-pk*0.5:0)+0.08);
  // grzebień
  ctx.beginPath();ctx.moveTo(-r*0.6,-r*0.7);for(let i=0;i<4;i++){ctx.quadraticCurveTo(-r*0.7+i*r*0.42,-r*(1.75-i*0.12),-r*0.45+i*r*0.42,-r*0.85);}ctx.closePath();fs(far?'#a42a20':'#d42a1e',OLW*0.8);
  blob(E(0,0,r,r*0.92),c,r*0.25);
  // dziób i korale
  const op=crazy?(eat?pk*3:1.5+Math.abs(Math.sin(t*12))*1.6):0.2;
  ctx.beginPath();ctx.moveTo(-r*0.85,-r*0.2);ctx.lineTo(-r*1.75,-r*0.05);ctx.lineTo(-r*0.85,r*0.1);ctx.closePath();fs('#e8a820',OLW*0.8);
  ctx.beginPath();ctx.moveTo(-r*0.85,r*0.15);ctx.lineTo(-r*1.5,r*0.25+op);ctx.lineTo(-r*0.8,r*0.4);ctx.closePath();fs('#c88010',OLW*0.8);
  ctx.beginPath();ctx.moveTo(-r*0.75,r*0.4);ctx.quadraticCurveTo(-r*1.05,r*1.4,-r*0.45,r*1.0);ctx.closePath();fs('#d42a1e',OLW*0.7);
  if(crazy){ctx.save();ctx.shadowColor='#ffe94a';ctx.shadowBlur=5;eye(-r*0.25,-r*0.2,r*0.42,{white:'#fffbe0',pr:0.22,px:Math.sin(t*23)*r*0.12,py:Math.cos(t*19)*r*0.08});ctx.restore();ln(-r*0.65,-r*0.72,-r*0.05,-r*0.82,OL,OLW);}
  else{eye(-r*0.25,-r*0.18,r*0.3,{lid:0.45,pr:0.5});ctx.save();ctx.translate(r*0.25,-r*0.55);ctx.rotate(0.5);rect('#f6f0e0',-r*0.4,-r*0.1,r*0.8,r*0.26);ln(-r*0.15,-r*0.08,-r*0.15,r*0.14,'#c0b8a0',0.4);ln(r*0.15,-r*0.08,r*0.15,r*0.14,'#c0b8a0',0.4);ctx.restore();}
  ctx.restore();};
 head([-4,-47],3,-70,7,true,false);
 head([-12,-42],-19,-58,8,false,true);
 // spadające piórko
 if(w){const p=(t*0.6)%1;ctx.save();ctx.translate(14+p*10,-50+p*44);ctx.rotate(Math.sin(t*5)*0.8);ctx.beginPath();ctx.ellipse(0,0,1.2,3.4,0,0,7);fs('#f2ece0',OLW*0.5);ctx.restore();}
 if(st.talk||eat){ctx.font='900 7px '+FONT;ctx.textAlign='center';ctx.fillStyle='#fff';ctx.strokeStyle=OL;ctx.lineWidth=2.4;ctx.strokeText('KO!',-34,-72+Math.sin(t*12));ctx.fillText('KO!',-34,-72+Math.sin(t*12));}
 ctx.restore();
};

/* ---------- Burak mutant i buraczek: twarz w 3/4, korzenie jako nogi i ręce ---------- */
function beet(st,t,small){
 const w=st.walk,ph=t*9,s=w?Math.sin(ph):0,b=w?Math.abs(Math.cos(ph))*1.6:0,eat=st.eat,hit=eat?Math.max(0,Math.sin(t*9)):0;
 ground(small?16:20);
 const R=small?18:22,cy=-30-b-(small?-4:0),C='#9c1f4e';
 for(const [x,ph2] of [[-6,s],[7,-s]]){ctx.beginPath();ctx.moveTo(x,cy+R*0.6);ctx.quadraticCurveTo(x*1.3,cy+R*0.95,x+ph2*5,0);sk(OL,4.2);ctx.beginPath();ctx.moveTo(x,cy+R*0.6);ctx.quadraticCurveTo(x*1.3,cy+R*0.95,x+ph2*5,0);sk('#6a1238',2.4);
  ln(x+ph2*5,-0.4,x+ph2*5-4,0,OL,3);ln(x+ph2*5,-0.4,x+ph2*5-4,0,'#6a1238',1.6);}
 // liście (włosy)
 const n=small?3:5;for(let i=0;i<n;i++){const a=(i-(n-1)/2)*(small?0.45:0.32)+Math.sin(t*4+i)*0.08+(w?s*0.05:0);
  ctx.save();ctx.translate(0,cy-R*0.9);ctx.rotate(a);const L=small?13:20;ln(0,0,0,-L*0.5,'#8a1e4a',1.8);
  ctx.beginPath();ctx.moveTo(0,-L*0.3);ctx.bezierCurveTo(-L*0.4,-L*0.6,-L*0.25,-L*1.1,0,-L*1.2);ctx.bezierCurveTo(L*0.25,-L*1.1,L*0.4,-L*0.6,0,-L*0.3);fs(i%2?'#4f9a3a':'#5fae44');ln(0,-L*0.35,0,-L*1.1,'#8a1e4a',0.8);ctx.restore();}
 // dalsza ręka-korzeń
 const arm=(sx,a,far)=>{const s0=[sx,cy+2],e=add(s0,dir(a,10)),wr=add(e,dir(a+0.6,8));ctx.beginPath();ctx.moveTo(s0[0],s0[1]);ctx.quadraticCurveTo(e[0],e[1],wr[0],wr[1]);sk(OL,4);ctx.beginPath();ctx.moveTo(s0[0],s0[1]);ctx.quadraticCurveTo(e[0],e[1],wr[0],wr[1]);sk(far?'#5a1030':'#7a1a40',2.4);oel(wr[0],wr[1],2.6,2.6,far?'#5a1030':'#8a1e4a',OLW*0.8);};
 arm(R*0.7,0.5-s*0.4,true);
 const body=()=>{ctx.moveTo(0,cy+R*1.05);ctx.bezierCurveTo(-R*1.25,cy+R*0.55,-R*1.1,cy-R*1.05,0,cy-R*0.98);ctx.bezierCurveTo(R*1.1,cy-R*1.05,R*1.25,cy+R*0.55,0,cy+R*1.05);ctx.closePath();};
 blob(body,C,R*0.22,()=>{for(const y of [-0.35,0.05,0.45])ln(-R,cy+R*y,R,cy+R*y+2,'rgba(60,0,30,.25)',0.8);el(-R*0.45,cy-R*0.55,R*0.22,R*0.12,'rgba(255,170,210,.4)',-0.5);});
 // twarz 3/4 w lewo: oś na -0.3R
 const fy=cy-R*0.18;
 if(small){
  eye(-R*0.62,fy,R*0.2,{sx:0.8,pr:0.55,px:-R*0.06});eye(-R*0.08,fy,R*0.26,{pr:0.55,px:-R*0.07});
  brow(-R*0.82,fy-R*0.38,-R*0.48,fy-R*0.28,1.2);brow(-R*0.28,fy-R*0.3,R*0.15,fy-R*0.42,1.3);
  // smoczek
  oel(-R*0.36,fy+R*0.5,R*0.3,R*0.2,'#5ab4e8',OLW*0.8);el(-R*0.36,fy+R*0.5,R*0.12,R*0.1,'#2a6a9a');ctx.beginPath();ctx.arc(-R*0.36,fy+R*0.72,R*0.14,0,PI);sk(OL,1.8);ctx.beginPath();ctx.arc(-R*0.36,fy+R*0.72,R*0.14,0,PI);sk('#f0e060',0.9);
 }else{
  eye(-R*0.62,fy,R*0.15,{sx:0.8,lid:0.7,pr:0.6});eye(-R*0.08,fy,R*0.2,{lid:0.7,pr:0.6});
  brow(-R*0.86,fy-R*0.32,-R*0.46,fy-R*0.16,1.8);brow(-R*0.3,fy-R*0.18,R*0.2,fy-R*0.34,2);
  const mo=eat?hit*R*0.12:0;
  ctx.beginPath();ctx.moveTo(-R*0.72,fy+R*0.4);ctx.lineTo(R*0.05,fy+R*0.36);ctx.lineTo(-R*0.05,fy+R*0.56+mo);ctx.lineTo(-R*0.66,fy+R*0.58+mo);ctx.closePath();fs('#2a0818',OLW*0.8);
  rect('#f2ead6',-R*0.66,fy+R*0.4,R*0.66,R*0.08);rect('#e8c040',-R*0.3,fy+R*0.4,R*0.12,R*0.09);
  // zapałka w kąciku
  ln(-R*0.7,fy+R*0.46,-R*1.15,fy+R*0.4,'#e8d8a8',1.2);el(-R*1.17,fy+R*0.4,0.9,0.9,'#c42a20');
 }
 // bliższa ręka (przy gryzieniu wali pięścią)
 arm(-R*0.55,0.25+(eat?1.6*hit:s*0.5),false);
}
X.burak=(st,t)=>beet(st,t,false);
X.buraczek=(st,t)=>beet(st,t,true);

/* ---------- Barszcz Sosnowskiego: gęba na łodydze, liście-łapy, parasol kwiatów, znak „PARZY” ---------- */
X.barszcz=(st,t)=>{
 const w=st.walk,s=w?Math.sin(t*6):0,sw=Math.sin(t*2)*2.4,eat=st.eat,gr=eat?Math.max(0,Math.sin(t*9)):0;
 ground(24);
 const G='#5f8a3a';
 for(const [x,ph] of [[-9,s],[0,-s],[9,s*0.7]]){ctx.beginPath();ctx.moveTo(x*0.3,-12);ctx.quadraticCurveTo(x,-5,x+ph*4,0);sk(OL,4.4);ctx.beginPath();ctx.moveTo(x*0.3,-12);ctx.quadraticCurveTo(x,-5,x+ph*4,0);sk('#7a8a4a',2.6);}
 const leaf=(ox,oy,a,L,far)=>{ctx.save();ctx.translate(ox,oy);ctx.rotate(a);const p=[[0,0]];for(let i=1;i<=6;i++)p.push([i*L/6,-L*0.22*Math.sin(i/6*PI)-(i%2?L*0.08:0)]);p.push([L*1.05,0]);for(let i=6;i>=1;i--)p.push([i*L/6,L*0.2*Math.sin(i/6*PI)+(i%2?L*0.08:0)]);
  ctx.beginPath();PL(p)();fs(far?'#3e6424':'#4f7a2e');ln(0,0,L,0,'#2f5018',0.8);for(let i=1;i<5;i++)ln(i*L/5,0,i*L/5+L*0.08,-L*0.12,'#2f5018',0.5);ctx.restore();};
 leaf(sw*0.25,-34,-0.5+Math.sin(t*3)*0.1,30,true);
 // łodyga z bulwą na twarz
 const stem=()=>{ctx.moveTo(-5,-12);ctx.quadraticCurveTo(-7,-30,-11+sw*0.3,-44);ctx.bezierCurveTo(-15+sw*0.4,-60,-5+sw*0.6,-70,-3+sw,-88);ctx.lineTo(4+sw,-88);ctx.bezierCurveTo(7+sw*0.6,-70,13+sw*0.4,-60,10+sw*0.3,-44);ctx.quadraticCurveTo(6,-30,5,-12);ctx.closePath();};
 blob(stem,G,3,()=>{ctx.fillStyle='#6a2a5a';for(let i=0;i<12;i++){ctx.beginPath();ctx.ellipse(-4+(i%3)*4+sw*(i/14),-16-i*6,1.3,0.9,0,0,7);ctx.fill();}
  for(let i=0;i<14;i++)ln(-7+(i%4)*5,-18-i*5,-9+(i%4)*5,-20-i*5,'rgba(230,255,200,.5)',0.4);});
 // parasol
 ctx.save();ctx.translate(sw+0.5,-88);for(let i=-5;i<=5;i++){ln(0,0,i*5.6,-11+Math.abs(i)*1.2,OL,2.2);ln(0,0,i*5.6,-11+Math.abs(i)*1.2,G,1.2);}
 blob(()=>{ctx.ellipse(0,-12,31,10,0,PI,0);ctx.closePath();},'#f4f1e4',2.4,()=>{ctx.fillStyle='#d8d2be';for(let i=0;i<20;i++){ctx.beginPath();ctx.arc(-28+i*2.95,-12-Math.sin(i*0.9)*2.4-(i%3)*1.5,1.9,0,7);ctx.fill();}});
 ctx.restore();
 // twarz 3/4 na bulwie
 ctx.save();ctx.translate(-2+sw*0.4,-56);
 eye(-6,-2,2.6,{sx:0.8,white:'#fff6a8',pr:0.5,px:-0.8});eye(1.4,-2.2,3.2,{white:'#fff6a8',pr:0.5,px:-1});
 brow(-9,-6.4,-4,-4.4,1.3);brow(-1.4,-5,4.6,-7.6,1.5);
 const mo=2+gr*3;ctx.beginPath();ctx.moveTo(-8,5);ctx.quadraticCurveTo(-3,3,2,4.6);ctx.quadraticCurveTo(-2,5+mo*1.6,-7,5+mo);ctx.closePath();fs('#2a3a10',OLW*0.8);
 ctx.fillStyle='#f0f0c0';for(const x of [-6.6,-3.4,-0.4])ctx.beginPath(),ctx.moveTo(x,4.4),ctx.lineTo(x+1.6,4.2),ctx.lineTo(x+0.8,6.4),ctx.fill();
 const d=(t*1.1)%1;el(-5,7+d*14,0.9,1.3,'rgba(230,240,90,'+(1-d)+')');
 ctx.restore();
 // znak ostrzegawczy na sznurku
 ctx.save();ctx.translate(sw*0.32-2,-40);ctx.rotate(Math.sin(t*3)*0.12);ln(-6,-6,0,4,'#9a8a6a',0.7);ln(6,-7,0,4,'#9a8a6a',0.7);
 ctx.beginPath();ctx.moveTo(0,1);ctx.lineTo(8,15);ctx.lineTo(-8,15);ctx.closePath();fs('#ffd21e',OLW*0.9);ctx.font='900 8px '+FONT;ctx.textAlign='center';ctx.fillStyle='#1a1a1a';ctx.fillText('!',0,13.4);
 ctx.font='900 3.4px '+FONT;ctx.fillText('PARZY',0,19.6);ctx.restore();
 // bliższy liść-łapa sięga do przodu
 const reach=eat?-0.2-gr*0.5:-0.15+Math.sin(t*2.4)*0.15;
 leaf(-6+sw*0.3,-46,PI+reach,32,false);
 ctx.fillStyle='rgba(220,255,120,.65)';for(let i=0;i<3;i++){const p=(t*0.8+i/3)%1;ctx.beginPath();ctx.arc(-18+i*14,-80+p*64,1.3,0,7);ctx.fill();}
};

/* ---------- Krowa z Czarnobyla: dwie głowy (przód i tył), świecące wymię, plama-trójliść ---------- */
X.krowa=(st,t)=>{
 const w=st.walk,s=w?Math.sin(t*7):0,b=w?Math.abs(Math.cos(t*7))*1.4:0,gl=0.5+0.5*Math.sin(t*3),eat=st.eat;
 const g0=ctx.createRadialGradient(0,-45,6,0,-45,78);g0.addColorStop(0,'rgba(150,255,90,'+(0.2+0.14*gl)+')');g0.addColorStop(1,'rgba(150,255,90,0)');ctx.fillStyle=g0;ctx.beginPath();ctx.arc(0,-45,78,0,7);ctx.fill();
 ground(48);
 const W='#f0ede4';
 const leg=(x,o,far)=>{const a=w?0.35*Math.sin(t*7+o):0,hp=[x,-38-b],kn=add(hp,dir(a,17)),an=add(kn,dir(a*0.3,16));chain([hp,kn,an],[12,9,8],W,far);ctx.save();ctx.translate(an[0],an[1]);ctx.beginPath();ctx.roundRect(-4.6,-1,9.2,5.6,1.4);fs(far?'#1a1612':'#2a2420');ln(0,-1,0,4.6,'#0a0806',0.8);ctx.restore();};
 leg(-26,PI,true);leg(22,0,true);
 ctx.save();ctx.translate(0,-b);
 const body=()=>{ctx.moveTo(-36,-68);ctx.quadraticCurveTo(0,-74,34,-69);ctx.quadraticCurveTo(44,-60,40,-42);ctx.quadraticCurveTo(36,-32,24,-33);ctx.quadraticCurveTo(0,-29,-26,-33);ctx.quadraticCurveTo(-42,-36,-42,-52);ctx.quadraticCurveTo(-42,-64,-36,-68);ctx.closePath();};
 blob(body,W,6,()=>{ctx.fillStyle='#1c1c1c';for(const [x,y,rx,ry,a] of [[-18,-60,10,7,0.3],[20,-46,9,6,-0.4],[30,-64,6,5,0],[-34,-42,6,7,0.2]]){ctx.beginPath();ctx.ellipse(x,y,rx,ry,a,0,7);ctx.fill();}
  // plama w kształcie trójliścia
  ctx.save();ctx.translate(4,-53);ctx.rotate(t*0.6);ctx.fillStyle='#1c1c1c';for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,10,i*PI*2/3-0.5,i*PI*2/3+0.5);ctx.closePath();ctx.fill();}ctx.restore();
  el(4,-53,3.4,3.4,'#1c1c1c');el(4,-53,1.8,1.8,W);});
 // świecące wymię i kapiące mleko
 ctx.save();ctx.shadowColor='#9cff4a';ctx.shadowBlur=10+6*gl;oel(12,-32,8,5.4,'#b8ff7a',OLW*0.9);ctx.restore();
 for(const x of [7,10.5,14,17.5]){ln(x,-28,x,-24.4,OL,3.2);ln(x,-28,x,-24.4,'#a0f060',1.8);}
 const dp=(t*1.6)%1;el(10.5,-24+dp*22,0.9,1.4,'rgba(190,255,120,'+(1-dp)+')');
 // licznik Geigera dynda u szyi
 ctx.save();ctx.translate(-38,-46);ctx.rotate(Math.sin(t*7)*0.15);ln(0,-8,0,0,'#5a4a3a',1);ctx.beginPath();ctx.roundRect(-4,0,8,6,1);fs('#d8c070',OLW*0.8);ctx.beginPath();ctx.arc(0,3,1.6,PI,0);sk('#2a2a2a',0.5);ln(0,3,Math.cos(t*20)*1.4,3-Math.abs(Math.sin(t*20))*1.4,'#c42a20',0.4);ctx.restore();
 if(Math.sin(t*13)>0.3){ctx.font='900 5px '+FONT;ctx.textAlign='center';ctx.fillStyle='#d8ff60';ctx.fillText('tyk',-46,-30);}
 // głowy: przód zły (ryczy), tył głupkowaty z jęzorem
 const head=(mood,glw)=>{
  ctx.beginPath();ctx.moveTo(4,-8);ctx.quadraticCurveTo(-2,-4,-4,4);ctx.lineTo(6,6);ctx.closePath();fs(W);
  for(const [x,y,c] of [[3,-10,true],[-9,-11,false]]){ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x-2,y-8,x-6+(c?-2:0),y-11);ctx.quadraticCurveTo(x-1,y-6,x+3,y+1);fs(c?'#e8e0c8':'#d8d0b8',OLW*0.8);}
  ctx.beginPath();ctx.moveTo(6,-9);ctx.quadraticCurveTo(14,-14,15,-8);ctx.quadraticCurveTo(11,-5,6,-5);fs('#e8d8d0');   // ucho
  blob(()=>{ctx.moveTo(4,-11);ctx.quadraticCurveTo(-6,-14,-12,-8);ctx.quadraticCurveTo(-18,2,-20,10);ctx.quadraticCurveTo(-14,18,-4,14);ctx.quadraticCurveTo(6,8,7,-2);ctx.closePath();},W,3,()=>{el(-1,-6,6,4,'#1c1c1c',0.4);});
  // nozdrza z przodu ryja, oczy nad nim (dalsze mniejsze)
  oel(-14,10.5,7,5,'#eab0a8',OLW*0.9,-0.3);el(-16.6,10,1,1.4,'#5a2a2a');el(-12,9.4,1,1.4,'#5a2a2a');
  ctx.save();ctx.shadowColor='#aaff55';ctx.shadowBlur=4+4*glw;
  eye(-13.4,-3,2.2,{sx:0.8,white:'rgb('+Math.round(190+40*glw)+',255,120)',pupil:'#0a1a04',pr:0.4,px:-0.4});
  eye(-5.4,-3.6,2.8,{white:'rgb('+Math.round(190+40*glw)+',255,120)',pupil:'#0a1a04',pr:0.4,px:-0.6});ctx.restore();
  if(mood==='zly'){brow(-16,-7,-11.6,-5.2,1.1);brow(-8.6,-5.6,-2,-8.4,1.3);
   const mo=st.talk||eat?2+2*Math.abs(Math.sin(t*10)):1.2;ctx.beginPath();ctx.ellipse(-10,15,4.6,mo,0.2,0,7);fs('#4a1a1a',OLW*0.7);
   ctx.beginPath();ctx.arc(-7,18,3.4,0,7);fs('#c9a24a',OLW*0.8);ln(-7,15,-7,21,'#8a6a1a',0.6);}
  else{ln(-15.6,-5.6,-11.4,-6.2,OL,0.8);ln(-7.6,-6.8,-3,-7.4,OL,0.8);
   ctx.beginPath();ctx.moveTo(-12,14);ctx.quadraticCurveTo(-13,20+Math.sin(t*5),-9.6,19.6+Math.sin(t*5));ctx.quadraticCurveTo(-8,16,-8.6,14);fs('#e46a8a',OLW*0.6);}
 };
 const tilt=w?Math.sin(t*7)*0.06:eat?0.15*Math.sin(t*9):0;
 ctx.save();ctx.translate(-40,-58);ctx.rotate(tilt);head('zly',gl);ctx.restore();
 ctx.save();ctx.translate(40,-60);ctx.scale(-1,1);ctx.rotate(-tilt);head('glupi',1-gl);ctx.restore();
 ctx.restore();
 leg(-20,0,false);leg(26,PI,false);
};

/* ---------- Pałac Kultury na kurzych nogach: okna-oczy, wejście-paszcza z kolumn, megafony ---------- */
X.palac=(st,t)=>{
 const w=st.walk,s=w?Math.sin(t*3):0,l1=w?Math.max(0,s)*7:0,l2=w?Math.max(0,-s)*7:0,hp=st.hp==null?1:st.hp,talk=st.talk,eat=st.eat;
 ground(46);
 const Y='#e8a83a';
 const leg=(x,lf,far)=>{const c=Y,hip=[x,-33],kn=[x+9,-19-lf],an=[x-1,-6-lf];
  chain([hip,kn,an],[9,7,6],c,far);
  for(const [dx,dy] of [[-12,6],[-8,6.4],[-4,6.2],[5,4.6]]){const tip=[an[0]+dx,an[1]+dy];chain([an,tip],[3,2],c,far);Pth([[tip[0]-(dx<0?2.4:-2),tip[1]],[tip[0],tip[1]-1.2],[tip[0],tip[1]+1.2]]);fs('#3a3020',OLW*0.5);}
  if(far){}
  // pióra na udach
  for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(hip[0]-6+i*3,hip[1]+2+(i%2)*2,2.4,4.6,(i-2)*0.25,0,7);fs(far?'#d8d2c4':'#f4efe4',OLW*0.6);}};
 leg(12,l2,true);
 ctx.save();ctx.translate(0,-Math.abs(s)*2-(eat?Math.abs(Math.sin(t*9))*2:0));
 if(hp<0.3)ctx.rotate(-0.04);
 const S='#d9ccb0';
 const tier=(x0,x1,y0,y1,side)=>{const p=()=>{ctx.rect(x0,y1,x1-x0,y0-y1);};
  if(side){Pth([[x1,y0],[x1+side,y0-side*0.5],[x1+side,y1-side*0.5],[x1,y1]]);fs(tint(S,0.7));}
  blob(p,S,0.01,()=>{for(let y=y1+3;y<y0-2;y+=6)for(let x=x0+3;x<x1-3;x+=5.2)rect('#7a6a52',x,y,2.6,3.4);});};
 // wieżyczki boczne
 for(const x of [-48,40]){tier(x,x+8,-33,-58,2);Pth([[x-1,-58],[x+9,-58],[x+4,-70]]);fs('#c9b48a');}
 tier(-38,38,-33,-58,5);tier(-26,26,-58,-74,4);tier(-16,16,-74,-88,3);tier(-9,9,-88,-98,2);
 Pth([[-3,-98],[3,-98],[0,-124]]);fs('#c9b48a');
 ctx.save();ctx.translate(0,-126);ctx.rotate(Math.sin(t*2)*0.1);const pts=[];for(let i=0;i<10;i++){const a=-PI/2+i*PI/5,r=i%2?2.2:5;pts.push([Math.cos(a)*r,Math.sin(a)*r]);}
 ctx.save();ctx.shadowColor='#ff4a3a';ctx.shadowBlur=6;Pth(pts);fs('#e0281e',OLW*0.8);ctx.restore();ctx.restore();
 // zegar
 oel(0,-81,4.4,4.4,'#f4efe0',OLW*0.8);ln(0,-81,Math.sin(t*0.5)*3,-81-Math.cos(t*0.5)*3,OL,0.8);ln(0,-81,Math.sin(t*4)*2,-81-Math.cos(t*4)*2,OL,0.6);
 // transparent
 Pth([[-22,-72],[22,-72],[22,-66.5],[-22,-66.5]]);fs('#c42a20',OLW*0.7);ctx.font='900 4px '+FONT;ctx.textAlign='center';ctx.fillStyle='#fff6dc';ctx.fillText('PRZYJAŹŃ NARODÓW',0,-67.8);
 // twarz: okna-oczy, gzymsy-brwi, wejście-paszcza
 const gl=0.7+0.3*Math.sin(t*5),cx=-6;
 for(const [x,sz] of [[cx-12,1],[cx+9,1]]){ctx.save();ctx.shadowColor='rgba(255,220,80,.9)';ctx.shadowBlur=6*gl;ctx.beginPath();ctx.roundRect(x-5.4*sz,-53,10.8*sz,8,1.4);fs('rgba(255,'+Math.round(200+30*gl)+',90,1)',OLW*0.9);ctx.restore();
  ctx.fillStyle='#2a1a0a';ctx.fillRect(x-3.6+(talk?Math.sin(t*6):0),-51,3.6,5);ln(x-2,-53,x-2,-45,'rgba(90,60,20,.5)',0.6);}
 brow(cx-19,-58,cx-6,-54.6,2.2,'#8a7a5a');brow(cx+3,-54.6,cx+16,-58,2.2,'#8a7a5a');
 const mo=talk?4+3*Math.abs(Math.sin(t*8)):eat?3+3*Math.abs(Math.sin(t*9)):2;
 ctx.beginPath();ctx.moveTo(cx-9,-33);ctx.lineTo(cx-9,-38-mo*0.4);ctx.quadraticCurveTo(cx,-44-mo,cx+9,-38-mo*0.4);ctx.lineTo(cx+9,-33);ctx.closePath();fs('#2a1208',OLW*0.9);
 for(let i=0;i<5;i++){const x=cx-7.4+i*3.7;Pth([[x-1.1,-33],[x+1.1,-33],[x+1.1,-38-mo*0.5+Math.abs(i-2)*1.2],[x-1.1,-38-mo*0.5+Math.abs(i-2)*1.2]]);fs('#f4efe0',OLW*0.5);}
 el(cx,-34,4,1.4,'#c42a20');
 // megafony na drugim piętrze
 for(const [x,d] of [[-26,-1],[26,1]]){ctx.save();ctx.translate(x,-66);ctx.scale(d,1);Pth([[0,-1.6],[6,-4.6],[6,4.6],[0,1.6]]);fs('#c8ccd0',OLW*0.7);
  if(talk)for(let i=0;i<3;i++){const p=((t*2.5+i/3)%1);ctx.globalAlpha=1-p;ctx.beginPath();ctx.arc(6,0,3+p*16,-0.5,0.5);sk('#fff',1.3);ctx.globalAlpha=1;}ctx.restore();}
 if(talk){ctx.font='900 7px '+FONT;ctx.textAlign='center';ctx.lineWidth=2.6;ctx.strokeStyle=OL;ctx.strokeText('UWAGA!',-52,-84);ctx.fillStyle='#ffe14a';ctx.fillText('UWAGA!',-52,-84);}
 // rany bossa
 if(hp<0.6){ctx.strokeStyle='#2a1a0a';ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(-30,-58);ctx.lineTo(-24,-50);ctx.lineTo(-28,-42);ctx.lineTo(-22,-36);ctx.stroke();ctx.beginPath();ctx.moveTo(12,-74);ctx.lineTo(8,-66);ctx.stroke();
  ctx.save();ctx.translate(20,-80);ctx.rotate(0.6);rect('#f0e6c8',-6,-1.4,12,2.8);ctx.rotate(-1.2);rect('#f0e6c8',-6,-1.4,12,2.8);ctx.restore();}
 if(hp<0.3){ctx.beginPath();ctx.moveTo(30,-58);ctx.lineTo(24,-46);ctx.lineTo(30,-38);ctx.stroke();Pth([[16,-88],[11,-88],[16,-80]]);fs('#3a2a1a',0);puffs(10,-96,t,4,8,-24,'rgba(90,90,90,',0.8);}
 ctx.restore();
 leg(-12,l1,false);
};
})();
