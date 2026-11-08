/* Styl „Plastelina”: claymation, bez obrysów; każda część to bryłka z cieniowaniem, odciskami palców i lekkim „gotowaniem” kształtu.
   Jednostki: 100 = wysokość postaci, (0,0) = ziemia między stopami, przód = -x. */
(()=>{
const TAU=Math.PI*2, BOIL=0.55, WALK_N=10, EAT_N=6, IDLE_FPS=5;
let seed=0,frame=0,sb=1;

/* deterministyczny szum: zależy od klatki (kwantowanej fazy), więc klatki w buforze gry są stabilne */
const rnd=n=>{const s=Math.sin(n*12.9898+frame*78.233)*43758.5453;return s-Math.floor(s);};
const rgb=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
const tone=(c,f)=>{const m=f>0?255:0,a=Math.abs(f);return '#'+rgb(c).map(v=>Math.round(v+(m-v)*a).toString(16).padStart(2,'0')).join('');};

/* kształty jako wielokąty, wygładzane przez środki krawędzi */
const ov=(cx,cy,rx,ry,rot=0,n=14)=>Array.from({length:n},(_,i)=>{const a=i/n*TAU,x=Math.cos(a)*rx,y=Math.sin(a)*ry,c=Math.cos(rot),s=Math.sin(rot);return[cx+x*c-y*s,cy+x*s+y*c];});
const cap=(x1,y1,x2,y2,r1,r2=r1)=>{const a=Math.atan2(y2-y1,x2-x1),p=[];
 for(let i=0;i<=5;i++){const b=a-Math.PI/2+i/5*Math.PI;p.push([x2+Math.cos(b)*r2,y2+Math.sin(b)*r2]);}
 for(let i=0;i<=5;i++){const b=a+Math.PI/2+i/5*Math.PI;p.push([x1+Math.cos(b)*r1,y1+Math.sin(b)*r1]);}
 return p;};
function path(p){const n=p.length,m=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];ctx.beginPath();ctx.moveTo(...m(p[n-1],p[0]));
 for(let i=0;i<n;i++)ctx.quadraticCurveTo(...p[i],...m(p[i],p[(i+1)%n]));ctx.closePath();}

/* bryłka plasteliny: drgające punkty, gradient światła z lewej-góry, miękki cień, odcisk palca, połysk */
function blob(p,c,o={}){
 seed++;const b=o.b??BOIL;
 p=p.map(([x,y],i)=>[x+(rnd(seed*7.1+i)-0.5)*2*b,y+(rnd(seed*7.1+i+50)-0.5)*2*b]);
 const xs=p.map(q=>q[0]),ys=p.map(q=>q[1]),x0=Math.min(...xs),y0=Math.min(...ys),w=Math.max(...xs)-x0,h=Math.max(...ys)-y0;
 path(p);ctx.save();
 if(!o.noShadow){ctx.shadowColor='rgba(30,15,5,.32)';ctx.shadowBlur=sb;ctx.shadowOffsetX=sb*0.35;ctx.shadowOffsetY=sb*0.55;}
 const lx=x0+w*0.33,ly=y0+h*0.28,g=ctx.createRadialGradient(lx,ly,0,lx,ly,Math.max(w,h)*0.95);
 g.addColorStop(0,tone(c,0.28));g.addColorStop(0.5,c);g.addColorStop(1,tone(c,-0.38));
 ctx.fillStyle=g;ctx.fill();ctx.restore();
 if(o.flat||w<4)return;
 ctx.save();ctx.clip();
 if(w>9&&h>6){   // odcisk palca: kilka łuków
  const fx=x0+w*(0.25+rnd(seed+3)*0.5),fy=y0+h*(0.3+rnd(seed+4)*0.5),a0=rnd(seed+5)*TAU;
  ctx.strokeStyle='rgba(40,20,10,.07)';ctx.lineWidth=0.45;
  for(let r=1.2;r<5;r+=1){ctx.beginPath();ctx.arc(fx,fy,r,a0,a0+4);ctx.stroke();}}
 const sx=x0+w*0.3,sy=y0+h*0.24,sr=Math.min(w,h)*0.32,s=ctx.createRadialGradient(sx,sy,0,sx,sy,sr);
 s.addColorStop(0,'rgba(255,255,255,'+(o.gloss??0.45)+')');s.addColorStop(1,'rgba(255,255,255,0)');
 ctx.fillStyle=s;ctx.fillRect(sx-sr,sy-sr,sr*2,sr*2);ctx.restore();
}
const o_=(cx,cy,rx,ry,c,rot,o)=>blob(ov(cx,cy,rx,ry,rot),c,o);
const k_=(x1,y1,x2,y2,r1,r2,c,o)=>blob(cap(x1,y1,x2,y2,r1,r2),c,o);
const rot=(x,y,a,f)=>{ctx.save();ctx.translate(x,y);ctx.rotate(a);f();ctx.restore();};

/* oczy na sprężynkach: białko, źrenica patrzy w lewo i lekko pływa */
function eyes(cx,cy,r,ph,o={}){
 for(const [dx,s] of [[r*1.05,0.85],[-r*0.95,1]]){
  const ex=cx+dx,ey=cy-(s<1?r*0.15:0),er=r*s;
  if(o.glow){ctx.save();ctx.shadowColor=o.glow;ctx.shadowBlur=sb*4;o_(ex,ey,er,er*1.05,o.white,0,{noShadow:true,flat:true});ctx.restore();}
  o_(ex,ey,er,er*1.05,o.white||'#fbf7ee',0,{b:0.25});
  const px=ex-er*0.38+Math.sin(ph*1.3+dx)*er*0.12,py=ey+er*0.1+Math.cos(ph+dx)*er*0.1;
  o_(px,py,er*(o.pupil||0.48),er*(o.pupil||0.48),'#1a1410',0,{b:0.15,noShadow:true,gloss:0});
  ctx.fillStyle='rgba(255,255,255,.9)';ctx.beginPath();ctx.arc(px-er*0.15,py-er*0.18,er*0.13,0,TAU);ctx.fill();}
}
function mouth(x,y,w,open,o={}){
 o_(x,y+open*0.4,w,0.9+open,'#4a1418',0,{b:0.2,noShadow:true,gloss:0.15});
 if(o.teeth&&open>0.6)for(let i=-1;i<=1;i++)o_(x+i*w*0.5,y-0.2,w*0.2,1.2,'#e8dfb8',0,{b:0.15,noShadow:true});
}

/* nogi: krok w lewo, stopa unosi się przy przenoszeniu do przodu */
function legs(L,ph,walk){
 for(const i of [1,0]){
  const s=walk?Math.sin(ph+i*Math.PI):0,lift=walk?Math.max(0,Math.cos(ph+i*Math.PI))*L.lift:0;
  const hx=L.hx+(i?4:-2),fx=hx-s*L.step,fy=-4-lift,d=i?-0.16:0;
  k_(hx,L.hy,fx,fy-2,L.r+0.8,L.r,tone(L.pants,d));
  if(L.stripe)k_(hx+L.r*0.55,L.hy+2,fx+L.r*0.5,fy-3,0.9,0.8,tone(L.stripe,d),{noShadow:true,gloss:0});
  if(L.shin)k_(fx+0.5,fy-6,fx,fy-2,L.r*0.8,L.r*0.7,tone(L.shin,d));
  o_(fx-3.5,fy+0.5,8.5,4.4,tone(L.shoe,d),0);}
}
/* ręka: kąt 0 = w dół, dodatni = do przodu (w lewo); zwraca dłoń */
function arm(sx,sy,a,len,r,sleeve,skin,o={}){
 const ex=sx-Math.sin(a)*len*0.55,ey=sy+Math.cos(a)*len*0.55,b=a+(o.bend||0),hx=ex-Math.sin(b)*len*0.5,hy=ey+Math.cos(b)*len*0.5;
 k_(sx,sy,ex,ey,r+0.6,r,sleeve);k_(ex,ey,hx,hy,r,r*0.9,o.fore||sleeve);
 if(!o.noHand)o_(hx-Math.sin(b)*1.5,hy+Math.cos(b)*1.5,r*1.05,r*1.05,skin,0);
 return[hx-Math.sin(b)*1.5,hy+Math.cos(b)*1.5,b];
}
const shadow=w=>{const g=ctx.createRadialGradient(0,0,0,0,0,w);g.addColorStop(0,'rgba(20,10,0,.38)');g.addColorStop(1,'rgba(20,10,0,0)');
 ctx.save();ctx.scale(1,0.22);ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,w,0,TAU);ctx.fill();ctx.restore();};

/* --- postacie: f(P) gdzie P={ph,walk,eat,talk,e(0..1 uderzenie),br(oddech),st} --- */
const C={
 trup(P){
  const skin='#93ab7c',suit='#55493d',ph=P.ph;
  legs({hx:2,hy:-30,r:5.2,step:7,lift:3,pants:'#3c3934',shoe:'#2c241f',shin:skin},ph,P.walk);
  rot(2,-30,-0.3-(P.eat?P.e*0.2:0)+(P.walk?Math.sin(ph*2)*0.03:0),()=>{
   const reach=P.eat?1.25+P.e*0.35:1.35+Math.sin(ph)*0.12;
   arm(4,-28,reach+0.12,30,4.2,tone(suit,-0.15),tone(skin,-0.12),{fore:tone(suit,-0.15)});
   // marynarka z postrzępionym dołem
   blob([[-15,-36],[-9,-39],[10,-39],[16,-33],[16,-6],[12,3],[7,-2],[2,5],[-3,-1],[-9,4],[-15,-3]],suit);
   blob([[-6,-35],[2,-35],[-1,-20]],'#e3dccb',{b:0.3});o_(-1.5,-24,1.6,6,'#5d1d1d',0.1,{b:0.3});
   o_(8,-12,3.5,3,'#6a5f52',0.4);   // łata
   const hx=-4+(P.eat?-P.e*3:0),hy=-53;
   o_(hx+11,hy+2,4,5.5,tone(skin,-0.08),0);   // ucho
   o_(hx,hy,17,16,skin,0);
   for(const [a,b] of [[-6,-14],[0,-16],[5,-14]])k_(hx+a,hy-12,hx+b*0.2+a+2,hy+b-4,0.9,0.6,'#3a3a2a',{noShadow:true});
   o_(hx-5,hy-3,11,7,tone(skin,-0.25),0,{noShadow:true,gloss:0});
   eyes(hx-5,hy-3,4.6,ph,{white:'#fff36a',pupil:0.28,glow:'rgba(255,240,80,.9)'});
   o_(hx-15,hy+3,3,2.8,tone(skin,-0.05),0);
   mouth(hx-8,hy+9,6,P.eat?2.5+Math.sin(P.e*Math.PI)*3:P.talk?1+P.mo*3:1.6,{teeth:true});
   arm(-2,-28,reach,30,4.4,suit,skin,{fore:suit});
  });
 },
 sasiad(P){
  const skin='#e8ab86',ph=P.ph,vest='#f4f2ea';
  legs({hx:0,hy:-30,r:5.6,step:9,lift:4,pants:'#2f55a8',stripe:'#f6f6f6',shoe:'#eeeeee'},ph,P.walk);
  arm(5,-52,P.walk?-Math.sin(ph)*0.4:0.1,26,4,skin,skin);
  blob([[-12,-56],[-6,-60],[7,-60],[13,-54],[13,-34],[8,-27],[-6,-26],[-16,-32],[-17,-44]],vest);   // podkoszulek z brzuchem
  o_(-8,-55,4,3,skin,0,{flat:true,noShadow:true});
  const hx=-3,hy=-77;
  o_(hx+12,hy+2,4,5,tone(skin,-0.06),0);
  o_(hx,hy,17,16,skin,0);
  blob([[hx-17,hy-6],[hx-12,hy-17],[hx+2,hy-21],[hx+14,hy-16],[hx+18,hy-6],[hx+2,hy-9]],'#6b5c4f');   // czapka
  o_(hx-18,hy-7,8,3.6,'#5f5246',-0.12);
  eyes(hx-4,hy-2,4.4,ph);
  k_(hx-15,hy+6,hx-3,hy+6,3.2,3,'#3b2618',{b:0.4});   // wąs
  o_(hx-17,hy+4,5,4.6,'#e2443c',0,{gloss:0.6});   // czerwony nos
  mouth(hx-8,hy+11,4,P.talk?P.mo*3:P.eat?2:0.2);
  const a=P.eat?2.6-P.e*1.9:P.walk?0.7+Math.sin(ph)*0.3:0.75,[bx,by,b]=arm(-4,-52,a,26,4.2,skin,skin,{bend:P.eat?0.3:-0.5});
  rot(bx,by,P.eat?b:-0.25,()=>{const y0=P.eat?2:-14;k_(0,y0,0,y0+8,1.5,1.5,'#6a3a14');k_(0,y0+9,0,y0+21,4,4,'#6a3a14',{gloss:0.7});o_(0,y0+15,3.9,2.8,'#efe2b0',0,{noShadow:true});});
  o_(bx,by,4.3,4.3,skin,0);
 },
 urzednik(P){
  const skin='#e8c19c',suit='#5f6878',ph=P.ph;
  legs({hx:0,hy:-30,r:5.4,step:8,lift:3.5,pants:'#454c59',shoe:'#1f1f22'},ph,P.walk);
  const [fx,fy]=arm(5,-54,P.walk?-Math.sin(ph)*0.3:0.05,26,4.2,tone(suit,-0.15),skin);
  blob([[fx-8,fy-1],[fx+8,fy-1],[fx+9,fy+12],[fx-9,fy+12]],'#7a4a26');   // teczka
  blob([[-12,-58],[12,-58],[15,-30],[10,-22],[-12,-22],[-15,-30]],suit);
  blob([[-7,-59],[3,-59],[-2,-44]],'#f1eee6',{b:0.3});k_(-2,-55,-2,-38,1.6,2.6,'#a8262b',{b:0.3});
  const hx=-2,hy=-78;
  o_(hx+12,hy+2,4,5,tone(skin,-0.06),0);
  o_(hx,hy,16.5,16.5,skin,0,{gloss:0.7});
  o_(hx+11,hy-3,6,7,'#b9b9b9',0.3);o_(hx-13,hy-6,3,4,'#b9b9b9',0);   // siwe boki
  eyes(hx-5,hy-2,4.2,ph);
  ctx.strokeStyle='#2a2622';ctx.lineWidth=1.2;for(const dx of [-9.4,-0.6]){ctx.beginPath();ctx.arc(hx+dx,hy-2,5.2,0,TAU);ctx.stroke();}
  o_(hx-15,hy+3,3.4,3.2,tone(skin,-0.08),0);
  k_(hx-12,hy+7,hx-4,hy+7,1.6,1.4,'#8a8a8a',{noShadow:true});
  mouth(hx-7,hy+11,3.5,P.talk?P.mo*3:P.eat?1.5:0.1);
  // pieczątka: w marszu uniesiona, w ataku wali w dół
  const a=P.eat?2.7-P.e*1.7:2.5+(P.walk?Math.sin(ph*2)*0.1:0),[sx,sy,b]=arm(-6,-54,a,24,4.2,suit,skin,{bend:-0.3,noHand:true});
  rot(sx,sy,b,()=>{ctx.scale(1.3,1.3);o_(0,-4,4.4,4.4,'#8a5a30');k_(0,-2,0,10,2.2,2.2,'#8a5a30');blob([[-8,10],[8,10],[8,16],[-8,16]],'#2c2c30');blob([[-8,16],[8,16],[8,18.5],[-8,18.5]],'#c4302a',{noShadow:true});});
  o_(sx,sy,4.4,4.4,skin,0);
 },
 komunista(P){
  const skin='#ecbb94',shirt='#b8291f',ph=P.ph,sh=P.st.shield>0;
  legs({hx:0,hy:-30,r:5.4,step:8.5,lift:4,pants:'#34343c',shoe:'#1c1c1e'},ph,P.walk);
  arm(5,-54,P.walk?-Math.sin(ph)*0.35:0.05,26,4.3,tone(shirt,-0.15),skin);
  blob([[-12,-58],[12,-58],[14,-30],[10,-24],[-11,-24],[-14,-30]],shirt);
  blob([[-8,-59],[4,-59],[-2,-50]],tone(shirt,-0.2),{b:0.3});o_(-1,-40,1.3,1.3,'#e8c040',0,{b:0.1,noShadow:true});o_(-1,-32,1.3,1.3,'#e8c040',0,{b:0.1,noShadow:true});
  const hx=-3,hy=-78;
  o_(hx+12,hy+2,4,5,tone(skin,-0.06),0);
  o_(hx,hy,16.5,16,skin,0);
  blob([[hx-16,hy-5],[hx-12,hy-17],[hx+3,hy-21],[hx+15,hy-15],[hx+17,hy-5]],'#3d3d45');   // czapka
  o_(hx-18,hy-6,7.5,3.4,'#34343b',-0.12);
  blob(Array.from({length:10},(_,i)=>{const r=i%2?1.6:4,a=i/10*TAU-Math.PI/2;return[hx-5+Math.cos(a)*r,hy-11+Math.sin(a)*r];}),'#e03228',{b:0.2,gloss:0.6});
  eyes(hx-5,hy-2,4.3,ph);
  for(const dx of [-10,-1])k_(hx+dx-3,hy-9.5,hx+dx+3,hy-7.5,1,1,'#2a1a10',{noShadow:true});   // groźne brwi
  o_(hx-15,hy+3,3.4,3.2,tone(skin,-0.08),0);
  mouth(hx-8,hy+10,4.5,P.talk?P.mo*3.5:P.eat?3:0.8);
  // transparent przed sobą = tarcza; w ataku dźga drzewcem
  const jab=P.eat?Math.sin(P.e*Math.PI):0,a=1.25+jab*0.35,[px,py]=arm(-5,-54,a,24,4.4,shirt,skin,{bend:0.35,noHand:true});
  rot(px-jab*4,py,-0.08-jab*0.15+(P.walk?Math.sin(ph)*0.04:0),()=>{
   if(!sh){k_(0,10,-1,-16,1.4,1.2,'#7a5232');blob([[-1,-16],[-3,-21],[0,-19],[1.5,-23],[1.5,-16]],'#9a6a40',{b:0.3});o_(-3,-14,3,2,'#b8291f',0.4);return;}
   k_(0,12,0,-50,1.6,1.6,'#7a5232');
   const wv=i=>Math.sin(ph+i*0.9)*1.2,top=-52,bot=-16,L=-46;
   blob([[2,top],[L,top+wv(0)],[L-1,bot+wv(1)],[L*0.66,bot+2+wv(2)],[L*0.33,bot-1+wv(3)],[2,bot]],'#c62a20',{gloss:0.3});
   ctx.textAlign='center';ctx.font='900 9.5px '+FONT;
   for(const [s,y] of [['PLAN',top+15],['5-LETNI',top+28]]){ctx.fillStyle='rgba(90,10,5,.55)';ctx.fillText(s,L/2+2+0.6,y+0.8);ctx.fillStyle='#fff3d6';ctx.fillText(s,L/2+2,y);}
  });
  o_(px-jab*4,py,4.5,4.5,skin,0);
 }
};

STYLES.push({id:'glina',name:'Plastelina',desc:'Ulepione z plasteliny: miękkie bryłki, odciski palców i oczy na sprężynkach.',draw(k,x,y,h,st){
 const f=C[k];if(!f)return;
 const walk=!!st.walk&&!st.eat,P=cycleOf(k,st.eat?{eat:true}:st).P,ph=(st.t||0)*TAU/P,n=st.eat?EAT_N:WALK_N;
 const fi=st.eat||walk?Math.floor(((ph/TAU)%1+1)%1*n+1e-3)%n:Math.floor((st.t||0)*IDLE_FPS)%8;
 seed=0;frame=fi+(st.eat?20:walk?0:40)+k.length*7;sb=h*0.022*(typeof DPR==='number'?DPR:1);
 const e=st.eat?(Math.sin(ph-Math.PI/2)+1)/2:0,br=walk||st.eat?0:Math.sin((st.t||0)*2.2);
 const u=h/100;ctx.translate(x,y);ctx.scale(u,u);
 shadow(30);
 const bob=walk?-Math.abs(Math.cos(ph))*2:st.eat?e*1.5:0;
 ctx.translate(st.eat?-e*3:0,bob);ctx.scale(1,1+br*0.012);
 f({ph:st.eat?0:ph,walk,eat:!!st.eat,talk:!!st.talk,mo:Math.abs(Math.sin(ph*2)),e,br,st});
}});
})();
