/* Styl „szkic”: brudny, malowany komiks – ziemiste kolory, grube brązowe kontury o zmiennej grubości, miękki cień.
   Jednostki: postać ma 100 j. wysokości, (0,0) = ziemia między stopami, przód = w lewo (−x). */
(()=>{
const OUT='#2a1b12',TAU=Math.PI*2,LW=1.9,HS=1.3,DROP=5,HIP=-41;   // HS: duża głowa (≈1:3,5); DROP: krótsze nogi
const C={
 zSkin:['#8e9868','#69714c'],skin:['#d6a27a','#b07a56'],nose:['#c25a44','#963f2f'],
 suitD:['#4d3f33','#342920'],suitG:['#7a786c','#5b594f'],shirt:['#d9cfb4','#aea284'],
 red:['#a8402f','#7c2b20'],tie:['#8b3a2a','#652a1e'],olive:['#66643f','#4a482c'],
 navy:['#3f4a5c','#2c3443'],pants:['#3b342c','#28221c'],brown:['#6b5440','#4b3a2c'],
 wood:['#8a6038','#634426'],boot:['#3a2c22','#241a13'],glass:['#5c3d1c','#3d2810'],grey:['#a9a59a','#7f7b70']
};
const rnd=i=>{const v=Math.sin(i*127.1+311.7)*43758.5453;return v-Math.floor(v);};

/* gładka zamknięta ścieżka przez punkty (krzywe przez środki boków) */
function path(pts,closed=true){
 const n=pts.length,m=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];ctx.beginPath();
 if(!closed){ctx.moveTo(...pts[0]);for(let i=1;i<n-1;i++)ctx.quadraticCurveTo(...pts[i],...m(pts[i],pts[i+1]));ctx.lineTo(...pts[n-1]);return;}
 ctx.moveTo(...m(pts[n-1],pts[0]));for(let i=0;i<n;i++)ctx.quadraticCurveTo(...pts[i],...m(pts[i],pts[(i+1)%n]));ctx.closePath();
}
/* ostra ścieżka (postrzępione brzegi ubrań) */
function poly(pts){ctx.beginPath();ctx.moveTo(...pts[0]);for(const p of pts.slice(1))ctx.lineTo(...p);ctx.closePath();}
const ell=(cx,cy,rx,ry,n=10)=>Array.from({length:n},(_,i)=>[cx+Math.cos(i/n*TAU)*rx,cy+Math.sin(i/n*TAU)*ry]);
/* malowana plama: cień pod spodem, jasny kolor przesunięty ku światłu (lewa-góra), pociągnięcia pędzla, kontur o zmiennej grubości */
function blob(mk,[c,sh],{lw=LW,tex=0,seed=1,sharp=false}={}){
 const P=()=>sharp?poly(mk):path(mk);
 P();ctx.fillStyle=sh;ctx.fill();
 ctx.save();ctx.clip();ctx.translate(-2.6,-3);P();ctx.fillStyle=c;ctx.fill();ctx.translate(2.6,3);
 if(tex){const xs=mk.map(p=>p[0]),ys=mk.map(p=>p[1]),x0=Math.min(...xs),y0=Math.min(...ys),w=Math.max(...xs)-x0,h=Math.max(...ys)-y0;
  ctx.strokeStyle=sh;ctx.globalAlpha=0.55;ctx.lineWidth=0.8;ctx.beginPath();
  for(let i=0;i<tex;i++){const x=x0+rnd(seed+i)*w,y=y0+rnd(seed+i+50)*h,l=2+rnd(seed+i+90)*4;ctx.moveTo(x,y);ctx.lineTo(x+l*0.5,y+l);}
  ctx.stroke();ctx.globalAlpha=1;}
 ctx.restore();
 P();ctx.strokeStyle=OUT;ctx.lineWidth=lw;ctx.stroke();
 ctx.save();ctx.translate(0.45,0.6);P();ctx.lineWidth=lw*0.6;ctx.stroke();ctx.restore();
}
/* kończyna jako gruba kreska: kontur, cień, jaśniejszy wierzch */
function limb(pts,w,[c,sh]){
 const go=()=>{ctx.beginPath();ctx.moveTo(...pts[0]);for(const p of pts.slice(1))ctx.lineTo(...p);};
 ctx.lineCap=ctx.lineJoin='round';
 go();ctx.strokeStyle=OUT;ctx.lineWidth=w+LW*2;ctx.stroke();
 go();ctx.strokeStyle=sh;ctx.lineWidth=w;ctx.stroke();
 ctx.save();ctx.translate(-w*0.14,-w*0.14);go();ctx.strokeStyle=c;ctx.lineWidth=w*0.55;ctx.stroke();ctx.restore();
}
const ln=(pts,w,c=OUT)=>{ctx.beginPath();ctx.moveTo(...pts[0]);for(const p of pts.slice(1))ctx.lineTo(...p);ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.stroke();};
const dot=(x,y,r,c)=>{ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle=c;ctx.fill();};
/* odwrotna kinematyka dwóch odcinków; dir wybiera stronę zgięcia */
function ik(a,b,l1,l2,dir){
 let dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1e-3;const dd=Math.min(d,l1+l2-0.01);
 const al=(l1*l1-l2*l2+dd*dd)/(2*dd),hg=Math.sqrt(Math.max(0,l1*l1-al*al)),ux=dx/d,uy=dy/d;
 return[a[0]+ux*al-uy*hg*dir,a[1]+uy*al+ux*hg*dir];
}
/* nogi: krok w lewo, stopa uniesiona gdy idzie do przodu */
function legs(P,hx,hy,{str=12,lift=5,l=[21,21],spread=3}={}){
 return[0,1].map(i=>{const ph=P.a+(i?0:Math.PI),hip=[hx+(i?-1:1)*spread*0.5,hy];
  const f=P.w?[hx-Math.sin(ph)*str,-Math.max(0,Math.cos(ph))*lift]:[hx+(i?-spread:spread),0];
  return{hip,knee:ik(hip,f,l[0],l[1],1),f};});
}
function leg(L,w,col,shoe=C.boot,rag=false){
 limb([L.hip,L.knee,L.f],w,col);
 if(rag){const [x,y]=L.f;blob([[x-w*0.7,y-5],[x+w*0.7,y-5],[x+w*0.6,y-2],[x+w*0.2,y-3.5],[x-w*0.1,y-1.8],[x-w*0.5,y-3]],col,{sharp:true,lw:1.2});}
 mud(L.f,L.hip[0]*7);const [x,y]=L.f;blob([[x-10,y+0.5],[x-10.5,y-3],[x-6,y-6.5],[x+3,y-7],[x+4.5,y-3],[x+4,y+0.5]],shoe,{lw:1.6});
}
const hand=(x,y,r,col)=>blob(ell(x,y,r*1.25,r*1.1,8),col,{lw:1.5});
/* tułów szerszy niż wynika z punktów: krępa sylwetka */
const wide=f=>{ctx.save();ctx.scale(1.22,1);f();ctx.restore();};
/* błoto na butach i nogawkach */
const mud=([x,y],s)=>{for(let i=0;i<5;i++)dot(x-8+rnd(s+i)*12,y-3-rnd(s+i+20)*9,0.6+rnd(s+i+40)*1.1,'rgba(70,48,25,.75)');};

/* głowa w 3/4 profilu (patrzy w lewo); o: kolor skóry, oczy, usta, wąs, zarost, nakrycie */
function head(x,y,o){
 const sk=o.skin;ctx.save();ctx.translate(x,y);if(o.rot)ctx.rotate(o.rot);ctx.scale(HS,HS);
 blob(ell(9.5,1,3,4,8),sk,{lw:1.5});                                   // ucho
 const mo=o.mouth||0;
 blob([[-10,-7],[-7,-13],[1,-14.5],[10,-9],[12,1],[8,10],[1,13+mo*3],[-6,12+mo*3],[-10,8],[-11.5,1]],sk,{tex:o.zombie?6:0,seed:7});
 if(o.stub){ctx.fillStyle=sk[1];ctx.globalAlpha=0.7;for(let i=0;i<22;i++){const a=0.4+rnd(i+3)*2.3,r=8+rnd(i+30)*3.5;ctx.fillRect(Math.cos(a)*r-1,Math.sin(a)*r+2,0.8,0.8);}ctx.globalAlpha=1;}
 if(o.hair)o.hair();
 // oczy
 const ey=-3;
 if(o.zombie){
  for(const [ex,r] of [[-4,3.4],[-10.5,2.4]]){const g=ctx.createRadialGradient(ex,ey,0,ex,ey,r*2.4);g.addColorStop(0,'rgba(255,230,90,.75)');g.addColorStop(1,'rgba(255,200,40,0)');dot(ex,ey,r*2.4,g);
   blob(ell(ex,ey,r,r*1.05,8),['#ffe46a','#e0a924'],{lw:1.3});dot(ex-0.6,ey,r*0.28,'#5a3a10');}
  ln([[-8,-8],[-1,-6.5]],1.6);
 }else{
  for(const [ex,r] of [[-4,2.6],[-10.2,1.9]]){blob(ell(ex,ey,r,r*1.15,8),['#efe6d2','#cbbd9f'],{lw:1.1});dot(ex-r*0.35,ey+0.3,r*0.48,OUT);}
  ln(o.brow||[[-8,-7.5],[-1,-7]],1.8);
  if(o.glasses){ctx.strokeStyle=OUT;ctx.lineWidth=1.2;for(const [ex,r] of [[-4,3.8],[-10.4,2.8]]){ctx.beginPath();ctx.arc(ex,ey,r,0,TAU);ctx.stroke();}ln([[-7.6,-3.2],[-8,-3.2]],1);ln([[-0.2,-3.5],[8,-4.5]],1);}
 }
 // usta
 const my=o.mous?2.5:0;   // pod wąsem usta niżej, żeby było widać gadanie
 if(mo>0.05){blob([[-9,7+my],[-3,6.5+my],[-2.5,7+my+mo*5],[-6,8+my+mo*5.5],[-9.5,8+my+mo*3]],['#4a1f18','#33140f'],{lw:1.3,sharp:true});
  if(o.zombie){ctx.fillStyle='#d8cfa8';for(let i=0;i<3;i++)poly([[-8.5+i*2.1,7],[-6.6+i*2.1,7],[-7.5+i*2.1,8.6]]),ctx.fill();}}
 else ln(o.zombie?[[-9,8],[-6,9],[-3,7.5]]:[[-9,8.5],[-4,8]],1.4);
 // nos
 blob(ell(-12.5+(o.noseX||0),1.5,o.noseR||4.4,(o.noseR||4.4)*0.85,8),o.nose||sk,{lw:1.5});
 if(o.mous)blob([[-15,4.5],[-9,4],[-3,5.5],[-2,8],[-6,7],[-10,7.5],[-15,8]],o.mous,{lw:1.3});
 if(o.hat)o.hat();
 ctx.restore();
}
/* tułów + nakrycia głowy dzielone przez postacie */
const cap=(c,star)=>()=>{
 blob([[-12,-9],[-9,-16],[1,-18],[11,-14],[12,-7],[0,-8.5]],c,{tex:4,seed:11});
 blob([[-21,-7.5],[-13,-10],[-3,-9],[-4,-6],[-14,-5.5]],[c[1],OUT],{lw:1.4});
 if(star){ctx.save();ctx.translate(-4,-13);ctx.beginPath();for(let i=0;i<10;i++){const r=i%2?1.6:3.6,a=-Math.PI/2+i*Math.PI/5;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fillStyle='#c8402c';ctx.fill();ctx.strokeStyle=OUT;ctx.lineWidth=0.9;ctx.stroke();ctx.restore();}
};

/* faza ruchu wspólna dla stylów: chód, cios, gadanie, oddech */
function pose(k,st){
 const t=st.t||0,w=!!st.walk&&!st.eat;
 const a=w?t*TAU/cycleOf(k,st).P:0,ea=st.eat?t*TAU/cycleOf(k,{eat:true}).P:0;
 const e=st.eat?Math.pow(Math.max(0,Math.sin(ea)),0.7):0;        // 0..1, szczyt = trafienie
 return{t,w,a,e,ea,eat:!!st.eat,talk:st.talk?Math.abs(Math.sin(w?a*3:t*11)):0,   // przy chodzie zsynchronizowane z cyklem (bufor klatek)
  bob:w?-Math.abs(Math.cos(a))*1.6:st.eat?0:Math.sin(t*2.2)*0.5,br:w||st.eat?0:Math.sin(t*2.2)};
}
/* rysuje fn w układzie tułowia: opadnięty o DROP, kołysany, pochylony wokół biodra */
const up=(P,px,ang,fn)=>{ctx.save();ctx.translate(px,P.bob+DROP+HIP);ctx.rotate(ang);ctx.translate(-px,-HIP);fn();ctx.restore();};

/* ── postacie ── */
const DRAW={
 trup(P){   // zgarbiony umarlak w zbutwiałym garniturze, ręce przed sobą
  const hx=4,hy=HIP,L=legs(P,hx,hy+DROP,{str:9,lift:3.5,l:[17,18]}),sw=P.w?Math.sin(P.a):0;
  leg(L[0],9.5,C.pants,C.boot,true);
  const ang=-0.32-P.e*0.28+P.br*0.01,sh=[0,-68],ah=(dy,dx)=>[-28+dx,-65+dy];
  const arm=(back)=>{const s=[sh[0]+(back?5:0),sh[1]+(back?1:2)],h=back?ah(-3+sw*2.5,6-P.e*10):ah(1-sw*2.5,-1-P.e*14);
   const el=ik(s,h,15,15,-1);limb([s,el,h],7.5,C.suitD);
   blob([[h[0]+3,h[1]-3.4],[h[0]+3,h[1]+3.4],[h[0]+1,h[1]+2],[h[0]+2.4,h[1]+0.2]],C.suitD,{sharp:true,lw:1.1});
   ctx.save();ctx.translate(...h);hand(-2,0,3.4,C.zSkin);for(let i=0;i<3;i++)ln([[-4,-1.6+i*1.6],[-8.2,-2.4+i*2.4-P.e*1.5],[-9.4,-1+i*2.4]],1.6,OUT),ln([[-4,-1.6+i*1.6],[-8.2,-2.4+i*2.4-P.e*1.5]],0.8,C.zSkin[0]);ctx.restore();};
  up(P,hx,ang,()=>arm(true));
  leg(L[1],9.5,C.pants,C.boot,true);
  up(P,hx,ang,()=>{
  // marynarka z postrzępionym dołem
  wide(()=>blob([[-9,-71],[6,-72],[10,-60],[11,-44],[13,-34],[10,-37],[8,-32],[5,-36],[1,-31],[-2,-36],[-5,-32],[-7,-37],[-11,-34],[-10,-46],[-12,-60]],C.suitD,{tex:9,seed:3,sharp:true}));
  blob([[-9,-70],[-3,-70],[-4,-56],[-7,-49],[-9,-58]],C.shirt,{lw:1.3,sharp:true});
  blob([[-5,-68],[-3,-68],[-3,-56],[-5,-53],[-6.5,-57]],C.red,{lw:1,sharp:true});
  ln([[-2,-70],[-1,-56],[-6,-44]],1.2);ln([[3,-50],[6,-47],[8,-51]],0.9,C.suitD[1]);
  head(-9,-80,{skin:C.zSkin,zombie:1,mouth:Math.max(P.e,P.talk*0.8,0.25),rot:0.18,stub:0,
   hair:()=>{ctx.strokeStyle=OUT;ctx.lineWidth=1.3;for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(-4+i*3,-13.5+Math.abs(i-2)*0.5);ctx.quadraticCurveTo(-3+i*3+rnd(i)*4,-19,-1+i*3+rnd(i+5)*5,-17+rnd(i+9)*4);ctx.stroke();}}});
  arm(false);});
 },
 sasiad(P){   // dresiarz z piwem, wąs i czerwony nos
  const hx=1,hy=HIP,L=legs(P,hx,hy+DROP,{str:11,l:[17,18]}),sw=P.w?Math.sin(P.a):0;
  const pantLeg=(l)=>{leg(l,11,C.navy,['#d8cfba','#a59c86']);ln([[l.hip[0]+2.5,l.hip[1]],[l.knee[0]+2.5,l.knee[1]],[l.f[0]+2.2,l.f[1]-5]],1.3,'#ddd5c0');};
  pantLeg(L[0]);
  const ang=-0.06-P.e*0.12;
  up(P,hx,ang,()=>{const sh=[7,-68],bh=[sh[0]+5+sw*6,-46];limb([sh,ik(sh,bh,13,13,-1),bh],8,C.skin);hand(...bh,3.3,C.skin);});
  pantLeg(L[1]);
  up(P,hx,ang,()=>{
  // podkoszulek na brzuchu
  wide(()=>blob([[-8,-70],[-2,-73],[8,-72],[12,-62],[11,-48],[9,-40],[-2,-38],[-12,-41],[-15,-50],[-12,-60]],C.shirt,{tex:7,seed:21}));
  ln([[-4,-72],[-1,-64],[5,-72]],1.2);ln([[-8,-48],[-5,-49]],1,C.shirt[1]);
  dot(-6,-57,1.5,'rgba(120,90,40,.45)');dot(2,-45,2,'rgba(120,90,40,.35)');
  head(-3,-82,{skin:C.skin,nose:C.nose,noseR:5,mous:C.brown,stub:1,mouth:P.talk,brow:[[-9,-8],[-1,-6]],hat:cap(C.brown)});
  // ręka z flaszką; w ataku zamach z góry
  const sf=[-5,-67],ang=P.eat?4-P.e*2.8:0.15-sw*0.25,hd=[sf[0]+Math.cos(ang+Math.PI/2)*22,sf[1]+Math.sin(ang+Math.PI/2)*22];
  limb([sf,ik(sf,hd,12,12,-1),hd],8,C.skin);
  ctx.save();ctx.translate(...hd);ctx.rotate(P.eat?ang:-0.1);ctx.scale(1.35,1.35);
  blob([[-1.6,-6],[1.6,-6],[1.8,2],[3.6,5],[3.6,16],[-3.6,16],[-3.6,5],[-1.8,2]],C.glass,{sharp:true,lw:1.4,tex:2,seed:5});
  blob([[-2.6,8],[2.6,8],[2.6,12.5],[-2.6,12.5]],['#d9c58a','#b29d62'],{sharp:true,lw:0.8});ctx.restore();
  hand(...hd,3.4,C.skin);});
 },
 urzednik(P){   // szary urzędnik w okularach z wielką pieczątką
  const hx=1,hy=HIP,L=legs(P,hx,hy+DROP,{str:9,lift:4,l:[17,18]}),sw=P.w?Math.sin(P.a):0;
  leg(L[0],10.5,C.pants,C.boot);
  const ang=-0.03-P.e*0.1;
  up(P,hx,ang,()=>{const sh=[7,-67],bh=[sh[0]+4+sw*5,-45];limb([sh,ik(sh,bh,13,13,-1),bh],8,C.suitG);hand(...bh,3.2,C.skin);});
  leg(L[1],10.5,C.pants,C.boot);
  up(P,hx,ang,()=>{
  wide(()=>blob([[-9,-70],[8,-71],[11,-56],[11,-38],[-1,-35],[-12,-38],[-12,-55]],C.suitG,{tex:6,seed:31}));
  blob([[-8,-70],[-1,-71],[-3,-58]],C.shirt,{sharp:true,lw:1.2});
  blob([[-5.5,-69],[-3.5,-69],[-3,-55],[-5,-52],[-6.5,-56]],C.tie,{sharp:true,lw:1});
  ln([[-1,-71],[-2,-58],[-9,-48]],1.2);ln([[-7,-46],[-4,-46]],1.2,C.suitG[1]);
  head(-3,-82,{skin:C.skin,nose:C.skin,noseR:4.6,glasses:1,stub:0,mouth:P.talk,brow:[[-9,-7.5],[-1,-8.5]],
   hair:()=>{blob([[1,-13],[9,-11],[12,-3],[10,2],[6,-4],[2,-9]],C.grey,{lw:1.2});ln([[-5,-14],[2,-15.5]],1,C.grey[1]);}});
  // pieczątka: trzymana przed sobą, w ataku uniesiona i walnięta w dół
  const up=P.eat?Math.max(0,Math.cos(P.ea))*16:0,sx=-17-P.e*6,sy=-54-up+P.e*14+P.br*0.4;
  const sf=[-4,-66];limb([sf,ik(sf,[sx+2,sy-10],12,12,-1),[sx+2,sy-10]],8,C.suitG);
  ctx.save();ctx.translate(sx,sy);
  blob(ell(2,-21,5,4.4,8),C.wood,{lw:1.4});limb([[2,-17],[2,-5]],3.4,C.wood);
  blob([[-9,-5],[13,-5],[13,1],[-9,1]],['#4a3a2e','#2f241c'],{sharp:true,lw:1.5});
  blob([[-9,1],[13,1],[13,3.6],[-9,3.6]],['#a2392a','#76271c'],{sharp:true,lw:1.1});
  ctx.fillStyle='#d6c79f';ctx.font=`700 3.6px ${FONT}`;ctx.textAlign='center';ctx.fillText('ZAMKNIĘTE',2,-0.9);
  ctx.restore();hand(sx+2,sy-10,3.4,C.skin);
  if(P.e>0.85){ctx.globalAlpha=(P.e-0.85)*6;ln([[sx-12,sy+5],[sx-16,sy+2]],1.2);ln([[sx-11,sy+1],[sx-15,sy-4]],1.2);ctx.globalAlpha=1;}});
 },
 komunista(P,st){   // aktywista z transparentem-tarczą; bez tarczy zostaje złamany kij
  const hx=2,hy=HIP,L=legs(P,hx,hy+DROP,{str:11,l:[17,18]}),sw=P.w?Math.sin(P.a):0,ban=(st.shield||0)>0;
  leg(L[0],10.5,C.olive,C.boot);
  leg(L[1],10.5,C.olive,C.boot);
  up(P,hx,-0.05-P.e*0.12,()=>{const sh=[7,-67];
  wide(()=>blob([[-9,-70],[8,-71],[11,-56],[11,-37],[-1,-35],[-12,-37],[-12,-55]],C.red,{tex:7,seed:41}));
  ln([[-1,-71],[-1,-37]],1.2);ln([[-14,-41],[13,-41]],2.2,C.brown[1]);dot(-4,-63,1.1,OUT);dot(-4,-53,1.1,OUT);
  blob([[-8,-71],[-1,-71],[-4,-65]],C.red,{sharp:true,lw:1.2});
  head(-3,-82,{skin:C.skin,nose:C.nose,noseR:4.2,stub:1,mouth:Math.max(P.talk,P.e*0.6),mous:C.brown,brow:[[-9,-6.5],[-1,-8]],hat:cap(C.olive,1)});
  const PX=-19;   // drzewce przed twarzą, transparent jeszcze dalej z przodu
  // drzewce w obu rękach; w ataku dźgnięcie do przodu
  ctx.save();ctx.translate(PX-P.e*9,-52);ctx.rotate(-P.e*0.15+(P.w?sw*0.03:0));
  const top=ban?-56:-6;
  limb([[0,26],[0,top]],2.6,C.wood);
  if(ban){
   blob([[-40,-52],[2,-54],[2,-24],[-6,-22],[-10,-25],[-16,-21],[-22,-25],[-28,-21],[-34,-24],[-40,-22]],C.red,{sharp:true,tex:6,seed:51});
   ctx.fillStyle='#ead9a6';ctx.textAlign='center';ctx.font=`900 9px ${FONT}`;ctx.fillText('PLAN',-19,-41);ctx.font=`900 7.2px ${FONT}`;ctx.fillText('5-LETNI',-19,-31.5);
   limb([[-41,-53],[3,-55]],2.2,C.wood);
  }else{ln([[-1.5,top],[0,top-4],[1,top-1],[2,top-3.5]],1.4);blob([[1,top+1],[8,top+2],[6,top+6],[10,top+9],[5,top+10],[7,top+15],[1,top+11]],C.red,{sharp:true,lw:1.1});}
  ctx.restore();
  // ręce na drzewcu
  const g=(dy)=>{const r=-P.e*0.15,px=PX-P.e*9-Math.sin(r)*dy,py=-52+Math.cos(r)*dy;return[px,py];};
  const h1=g(ban?-6:4),h2=g(ban?6:14);
  limb([sh,ik(sh,h2,15,15,-1),h2],8,C.red);hand(...h2,3.3,C.skin);
  const sf=[-5,-66];limb([sf,ik(sf,h1,13,13,-1),h1],8,C.red);hand(...h1,3.4,C.skin);});
 }
};

STYLES.push({id:'szkic',name:'Komiks z błotem',desc:'Brudny, ręcznie malowany komiks w ziemistych barwach, z grubym brązowym konturem.',
 draw(k,x,y,h,st){
  ctx.save();ctx.translate(x,y);ctx.scale(h/100,h/100);ctx.lineJoin=ctx.lineCap='round';
  const g=ctx.createRadialGradient(0,0,2,0,0,30);g.addColorStop(0,'rgba(45,28,12,.45)');g.addColorStop(1,'rgba(45,28,12,0)');
  ctx.save();ctx.scale(1,0.2);dot(0,0,30,g);ctx.restore();
  (DRAW[k]||DRAW.trup)(pose(k,st),st);
  ctx.restore();
 }});
})();
