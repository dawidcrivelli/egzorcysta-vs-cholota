/* Styl „Plakat PRL”: linoryt / plakat propagandowy. Czerwień, czerń, krem (+ zieleń trupa),
   kanciaste płaszczyzny, kreskowanie i raster przycięte do kształtu, bohaterskie pozy.
   Układ: 100 jednostek = wysokość postaci, (0,0) = ziemia między stopami, przód = lewo. */
(()=>{
const R='#c8261c',K='#17110d',C='#f0e3c3',G='#9aab5e',LW=2.4,MIS=[0.8,0.5],TAU=Math.PI*2;
let seed=0;
const hash=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s);};
const path=p=>{ctx.beginPath();p.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();};
const add=(p,d)=>p.map(([x,y])=>[x+d[0],y+d[1]]);
// poszarpana krawędź odbitki: środek każdego dłuższego boku lekko przesunięty (stałe ziarno, więc nie migocze)
function rough(p){seed++;const o=[];p.forEach((a,i)=>{const b=p[(i+1)%p.length],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,j=(hash(seed*31+i)-0.5)*1.2;
 o.push(a);if(l>6)o.push([a[0]+dx/2-dy/l*j,a[1]+dy/2+dx/l*j]);});return o;}
/* faktura w obrysie: h = kreski „/”, x = kreski „\”, d = raster gęstniejący w prawo (cień z tyłu postaci); [kolor, odstęp, od x, grubość] */
function texture(p,o){
 const xs=p.map(q=>q[0]),ys=p.map(q=>q[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),H=y1-y0;
 ctx.save();path(p);ctx.clip();
 for(const [key,dir] of [['h',1],['x',-1]])if(o[key]){const[c,sp,from=-1e3,w=0.7]=o[key];
  ctx.save();ctx.beginPath();ctx.rect(from,y0-1,1e3,H+2);ctx.clip();ctx.beginPath();
  for(let i=x0-H;i<x1+H;i+=sp){ctx.moveTo(i,dir>0?y1:y0);ctx.lineTo(i+H,dir>0?y0:y1);}
  ctx.strokeStyle=c;ctx.lineWidth=w;ctx.stroke();ctx.restore();}
 if(o.d){const[c,from,span=10]=o.d;ctx.fillStyle=c;ctx.beginPath();
  for(let y=y0,row=0;y<y1+3;y+=2.6,row++)for(let x=x0+(row&1)*1.3;x<x1+3;x+=2.6){const r=clamp((x-from)/span,0,1)*1.45;if(r>0.2){ctx.moveTo(x+r,y);ctx.arc(x,y,r,0,TAU);}}
  ctx.fill();}
 ctx.restore();}
// płaszczyzna: przesunięty nadruk koloru, faktura, gruby czarny kontur
function sh(p,fill,o={}){const q=rough(p);
 path(fill===K?q:add(q,MIS));ctx.fillStyle=fill;ctx.fill();texture(q,o);
 path(q);ctx.lineJoin='miter';ctx.lineWidth=o.lw||LW;ctx.strokeStyle=K;ctx.stroke();}
const ln=(pts,w=LW,c=K)=>{ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.lineWidth=w;ctx.strokeStyle=c;ctx.lineCap='round';ctx.stroke();};
const HS=1.22;
const frH=(p,a,fn)=>fr(p,a,fn,HS);   // głowy powiększone, żeby czytały się w małej skali
const fr=(p,a,fn,s=1)=>{ctx.save();ctx.translate(p[0],p[1]);ctx.rotate(a);ctx.scale(s,s);fn();ctx.restore();};
function ik(a,b,l1,l2,bend){const dx=b[0]-a[0],dy=b[1]-a[1],d=clamp(Math.hypot(dx,dy),0.1,l1+l2-0.01),
 c=Math.acos(clamp((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1)),k=Math.atan2(dy,dx)+bend*c;return[a[0]+Math.cos(k)*l1,a[1]+Math.sin(k)*l1];}
// kończyna z dwóch odcinków jako jeden kanciasty wielokąt
function limb(a,k,b,w1,w2,fill,o){const n=(p,q)=>{const dx=q[0]-p[0],dy=q[1]-p[1],l=Math.hypot(dx,dy)||1;return[-dy/l,dx/l];},
 n1=n(a,k),n2=n(k,b),nk=[(n1[0]+n2[0])/2,(n1[1]+n2[1])/2],P=(p,v,w)=>[p[0]+v[0]*w,p[1]+v[1]*w],wk=(w1+w2)/2;
 sh([P(a,n1,w1),P(k,nk,wk),P(b,n2,w2),P(b,n2,-w2),P(k,nk,-wk),P(a,n1,-w1)],fill,o);}
const arm=(S,H,fill,o,w=4.2,bend=-1,l=13)=>limb(S,ik(S,H,l,l,bend),H,w,w*0.8,fill,o);
const fist=(p,fill=C,r=3.6)=>sh([0,1,2,3,4,5].map(i=>[p[0]+Math.cos(i*1.05+0.3)*r,p[1]+Math.sin(i*1.05+0.3)*r]),fill,{d:[K,p[0],r*2]});
const boot=(f,fill=K,o,tall=0)=>sh([[f[0]+4,f[1]-7-tall],[f[0]-3,f[1]-7-tall],[f[0]-5,f[1]-4],[f[0]-12,f[1]-2],[f[0]-12,f[1]+1],[f[0]+5,f[1]+1]],fill,o);
function leg(hip,f,fill,o,shoe,w=5){const an=[f[0],f[1]-5],kn=ik(hip,an,19,19,1);limb(hip,kn,an,w,w*0.8,fill,o);shoe(f);return[hip,kn,an];}
/* faza ruchu: chód (ph), atak (u: 0..1, r: wzniesienie broni, 0 = uderzenie), oddech, usta */
function motion(k,st){const t=st.t||0,m={t,walk:!!st.walk&&!st.eat,eat:!!st.eat,ph:0,bob:0,a:0,r:0,u:0,br:Math.sin(t*2.2),mo:0};
 if(m.eat){m.u=((t/cycleOf(k,{eat:true}).P)%1+1)%1;m.a=0.5-0.5*Math.cos(m.u*TAU);m.r=m.u<0.6?m.u/0.6:Math.max(0,1-(m.u-0.6)/0.15);}
 else if(m.walk){m.ph=t*TAU/cycleOf(k,st).P;m.bob=-Math.abs(Math.cos(m.ph))*2;}
 else m.bob=m.br*0.5;
 if(st.talk)m.mo=0.5-0.5*Math.cos(m.walk?m.ph*4:t*15);
 return m;}
const foot=(m,i,S,L,idle)=>m.walk?[-Math.sin(m.ph+i*Math.PI)*S,-Math.max(0,Math.cos(m.ph+i*Math.PI))*L]:[m.eat?(i?9:-11):idle[i],0];
/* głowa z profilu (w lewo), zaczep u nasady szyi; mo = otwarcie ust, opuszcza szczękę */
function head(skin,mo,o={}){const d=mo*4;
 sh([[6,0],[9,-9],[8,-20],[1,-26],[-7,-25],[-12,-19],[-12.5,-14],[-16,-9],[-12.5,-7],[-12.5,-4],[-12,-1+d],[-10,3+d],[-4,4+d],[4,2]],skin,{d:[K,-1,9],...o.tex});
 sh([[1,-14],[5,-15],[6,-9],[2,-8]],skin,{lw:1.4});
 if(mo>0.08)sh([[-12.5,-4],[-6,-3.5],[-8,-1+d],[-11.8,-0.5+d]],K,{lw:1});else ln([[-12.5,-3],[-8,-2.5]],1.4);
 if(o.teeth&&mo>0.08)sh([[-12.3,-3.8],[-8,-3.5],[-9,-2.2],[-12,-2.4]],C,{lw:0.7});
 if(!o.noBrow)sh([[-13.5,-15.5],[-5,-17.5],[-5,-15.2],[-12.5,-13.5]],K,{lw:1});
 if(!o.noEye)sh([[-9.5,-12.8],[-6.5,-13.4],[-7.2,-11.6]],K,{lw:0.8});}
const shadow=()=>{ctx.fillStyle='rgba(0,0,0,.32)';path([[-28,-2],[16,-3.5],[28,1],[18,3.5],[-22,3]]);ctx.fill();};

/* --- postacie --- */
const FIG={
 trup(m){   // zgarbiony, ręce przed siebie, broda dumnie w górę
  const lean=-0.42-0.25*m.a+(m.walk?0.04*Math.sin(m.ph*2):0.02*m.br),hip=[6,-40+m.bob],F=i=>foot(m,i,8,3,[-5,7]);
  const rag={h:[C,4.5,-1e3,0.5]};
  leg([hip[0]+3,hip[1]],F(1),K,rag,f=>boot(f));
  leg(hip,F(0),K,rag,f=>sh([[f[0]+4,f[1]-7],[f[0]-3,f[1]-7],[f[0]-6,f[1]-3],[f[0]-12,f[1]-2],[f[0]-9,f[1]],[f[0]-12,f[1]+1],[f[0]+5,f[1]+1]],G,{d:[K,f[0],8]}));
  fr(hip,lean,()=>{
   const S=[-1,-27],sw=m.walk?Math.sin(m.ph)*3:m.br,reach=m.a*7;
   const claw=(H,a)=>fr(H,a,()=>sh([[3,-3],[-3,-4],[-9,-6],[-5,-2.5],[-11,-1],[-5,0.5],[-9,4],[-3,2.5],[3,3]],G,{d:[K,-2,6],lw:1.8}));
   const far=[S[0]-20-reach,S[1]-15+sw];arm([S[0]+3,S[1]],far,K,rag,4);claw(far,0.5);
   sh([[11,2],[8,8],[5,3],[1,9],[-3,3],[-7,8],[-10,2],[-12,-14],[-11,-28],[-4,-32],[9,-31],[12,-18]],K,{h:[C,3.5,3,0.6]});   // postrzępiona marynarka
   sh([[-11,-28],[-4,-32],[-6,-19]],C,{d:[K,-9,6]});sh([[-6.5,-29],[-8.5,-22],[-6.5,-18],[-4.5,-23]],R,{lw:1.4});
   frH([-4,-30],0.4-0.1*m.a,()=>{
    sh([[-3,2],[-4,-4],[3,-4],[3,2]],G);
    head(G,m.eat?0.35+0.65*m.a:0.3+0.6*m.mo,{teeth:1,noEye:1});
    ln([[-3,-25],[-2,-30]],1.1);ln([[2,-26],[5,-30]],1.1);ln([[6,-23],[10,-25]],1.1);ln([[3,-20],[-1,-19],[3,-17],[-1,-16]],0.9);   // włosy i szwy
    ctx.save();ctx.shadowColor='#fff6b0';ctx.shadowBlur=6;sh([[-10.5,-13.5],[-5.5,-14.5],[-6.5,-11],[-10,-11.3]],C,{lw:1.2});ctx.restore();
    sh([[-8.5,-13.2],[-7,-13.4],[-7.4,-11.9]],R,{lw:0.4});});
   const near=[S[0]-23-reach,S[1]-11-sw];arm(S,near,K,rag,4.4);claw(near,0.3);});
 },
 sasiad(m){   // brzuch do przodu, butelka uniesiona jak puchar
  const lean=0.08-0.28*m.a+(m.walk?0.03*Math.sin(m.ph*2):0),hip=[2,-41+m.bob],F=i=>foot(m,i,10,5,[-6,6]);
  const stripes=([h,k,a])=>{for(const o of [0.6,2.4])ln([[h[0]+o,h[1]],[k[0]+o,k[1]],[a[0]+o,a[1]]],0.8,C);};
  stripes(leg([hip[0]+3,hip[1]],F(1),K,{},f=>boot(f,C,{d:[K,f[0],10]})));
  stripes(leg(hip,F(0),K,{},f=>boot(f,C,{d:[K,f[0],10]})));
  fr(hip,lean,()=>{
   const S=[-2,-27],FS=[4,-27],sw=m.walk?Math.sin(m.ph)*2:m.br*0.5;
   // dalsza ręka z butelką: w górze toast, przy ataku zamach w dół na obrońcę
   const H=m.eat?[lerp(-22,14,m.r),lerp(-18,-59,m.r)]:[14+sw*0.5,-59+Math.abs(sw)],ang=m.eat?lerp(-1.9,0.15,m.r):0.15+sw*0.03;
   fr(H,ang,()=>{sh([[-3,4],[-3.2,-8],[-1.3,-11],[-1.3,-17],[1.3,-17],[1.3,-11],[3.2,-8],[3,4]],K);sh([[-3.4,-5],[3.4,-5],[3.4,1],[-3.4,1]],C,{lw:1.2});sh([[-1.8,-17],[1.8,-17],[1.8,-19],[-1.8,-19]],R,{lw:1});});
   arm(FS,H,C,{d:[K,FS[0]-4,8]},4.2,1,18);fist(H);
   sh([[-9,1],[-15,-10],[-14,-19],[-9,-29],[8,-30],[11,-15],[9,1]],C,{d:[K,0,10]});   // podkoszulek
   ln([[-9,-28],[-6,-23],[-1,-22],[3,-26],[4,-30]],1.4);ln([[-5,-26],[-4,-24],[-2,-25]],0.8);
   frH([-3,-30],0.15-0.08*m.a,()=>{
    head(C,m.eat?0.6*m.a:0.15+0.7*m.mo,{teeth:1});
    sh([[-15.5,-7.5],[-8.5,-6.5],[-5.5,-3],[-9.5,-4.6],[-13,-3],[-18,-4.5]],K,{lw:1});   // wąs
    sh([[-13,-11],[-16.5,-12],[-19,-9],[-17.5,-6],[-13.5,-6.5]],R,{lw:1.5});   // czerwony nos
    sh([[-12,-19],[-9,-26],[0,-29],[9,-26],[10,-18]],K,{h:[C,3.5,-3,0.6]});sh([[-12,-20],[-22,-18],[-21,-16],[-10,-17]],K);});   // kaszkiet
   const N=[-4-sw*2,-5];arm(S,N,C,{d:[K,S[0],8]},4.4);fist(N);});
 },
 urzednik(m){   // pieczątka wzniesiona jak pochodnia, teczka w drugiej ręce
  const lean=-0.02-0.3*m.a+(m.walk?0.02*Math.sin(m.ph*2):0),hip=[3,-41+m.bob],F=i=>foot(m,i,8,4,[-5,6]);
  const grey={h:[K,2.1,-1e3,0.55],x:[K,2.1,2,0.5]};
  leg([hip[0]+3,hip[1]],F(1),C,grey,f=>boot(f));leg(hip,F(0),C,grey,f=>boot(f));
  fr(hip,lean,()=>{
   const S=[-2,-27],FS=[4,-27],sw=m.walk?Math.sin(m.ph)*3:m.br*0.5,B=[-3-sw,-6];
   // dalsza ręka: pieczątka wzniesiona jak pochodnia (gumą w górę), przy ataku walnięcie w obrońcę
   const H=m.eat?[lerp(-22,14,m.r),lerp(-18,-59,m.r)]:[14+sw*0.4,-59+Math.abs(sw)*0.4],ang=m.eat?lerp(1.1,Math.PI-0.15,m.r):Math.PI-0.15+0.04*sw;
   fr(H,ang,()=>{sh([[-1.6,1],[-1.6,-5],[-3.5,-7],[-2.5,-11],[2.5,-11],[3.5,-7],[1.6,-5],[1.6,1]],K,{h:[C,3,-1e3,0.5]});
    sh([[-12,1],[12,1],[12,8],[-12,8]],R,{x:[K,2.2,6,0.5]});sh([[-12.5,8],[12.5,8],[12.5,10.5],[-12.5,10.5]],K);
    ctx.translate(0,4.7);if(Math.cos(ang)<0)ctx.rotate(Math.PI);
    ctx.fillStyle=C;ctx.font=`900 3.6px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('ZAMKNIĘTE',0,0);});
   arm(FS,H,C,grey,4.2,1,18);fist(H);
   sh([[-9,1],[-11,-14],[-9,-28],[-3,-31],[7,-30],[10,-16],[9,1]],C,grey);
   sh([[-9,-28],[-3,-31],[-5,-17]],C);sh([[-5.5,-29.5],[-7.5,-21],[-5.5,-16],[-3.5,-21.5]],R,{lw:1.4});
   ln([[-3,-31],[-4.5,-17],[-9.5,-4]],1.2);
   frH([-3,-30],0.18-0.1*m.a,()=>{
    head(C,m.eat?0.5*m.r:0.1+0.6*m.mo,{noEye:1});
    sh([[4,-7],[8,-10],[8,-18],[5,-16],[3,-11]],K,{lw:1});ln([[-8,-24],[3,-23]],1.1);ln([[-9,-22],[2,-21]],1.1);   // wianuszek i pożyczka
    sh([[-12,-12],[-11,-15],[-8,-16.5],[-5,-15],[-5,-12],[-8,-10.5]],C,{lw:1.5});ln([[-5,-14],[2,-13]],1.2);sh([[-9,-13.8],[-7,-14.2],[-7.4,-12.6]],K,{lw:0.5});});   // okulary
   arm(S,B,C,grey,4.4);
   fr(B,0.05*sw,()=>{sh([[-7,1],[7,1],[7,12],[-7,12]],K,{h:[C,4,-1e3,0.5]});ln([[-3,1],[-3,-1.5],[3,-1.5],[3,1]],1.4);});fist(B);   // teczka
   if(m.eat&&m.u>0.6&&m.u<0.85){const k=1-(m.u-0.6)/0.25;for(let i=0;i<6;i++){const a=Math.PI*(0.6+i*0.16);ln([[H[0]-8+Math.cos(a)*14,H[1]+12+Math.sin(a)*4],[H[0]-8+Math.cos(a)*(14+8*k),H[1]+12+Math.sin(a)*(4+6*k)]],1.6);}}});
 },
 komunista(m,st){   // transparent na drzewcu przed sobą = tarcza; bez niego złamany kij
  const lean=0.08-0.22*m.a+(m.walk?0.03*Math.sin(m.ph*2):0),hip=[5,-41+m.bob],F=i=>foot(m,i,10,5,[-6,6]),gouge={h:[C,4,2,0.5]};
  leg([hip[0]+3,hip[1]],F(1),K,gouge,f=>boot(f,K,{},6));leg(hip,F(0),K,gouge,f=>boot(f,K,{},6));
  fr(hip,lean,()=>{
   const S=[-2,-27],sw=m.walk?Math.sin(m.ph):0,banner=st.shield>0,P=[-24,-17];
   const pa=m.eat?-0.8*m.a:sw*0.05+m.br*0.01,H1=[P[0],P[1]-8],H2=[P[0]+1,P[1]+6];   // chwyt drzewca: wyżej i niżej
   const grip=p=>[P[0]+(p[0]-P[0])*Math.cos(pa)-(p[1]-P[1])*Math.sin(pa),P[1]+(p[0]-P[0])*Math.sin(pa)+(p[1]-P[1])*Math.cos(pa)];
   arm([S[0]+5,S[1]],grip(H2),R,{h:[K,1.8,-1e3,0.6]},4);
   sh([[-10,1],[-12,-14],[-10,-28],[-3,-31],[8,-30],[11,-15],[10,1]],R,{h:[K,2,1,0.6]});   // czerwona bluza
   sh([[-11,-4],[10,-4],[10,1],[-10,1]],K,{lw:1.6});sh([[-10,-28],[-3,-31],[-4,-25]],C,{lw:1.4});
   for(const y of [-22,-15,-8])sh([[-8.5,y],[-7,y-1],[-6,y],[-7.5,y+1]],K,{lw:0.6});
   frH([-3,-30],0.22-0.08*m.a,()=>{
    head(C,m.eat?0.4+0.5*m.a:0.3+0.6*m.mo,{teeth:1});
    sh([[-11,-19],[-10,-26],[-2,-30],[9,-27],[10,-19]],K,{h:[C,3.5,-2,0.6]});sh([[-11,-20],[-19,-17],[-11,-16.5]],K);   // czapka
    ctx.save();ctx.translate(-6.5,-23);sh([0,1,2,3,4,5,6,7,8,9].map(i=>{const r=i&1?1.3:3.2,a=i*Math.PI/5-Math.PI/2;return[Math.cos(a)*r,Math.sin(a)*r];}),R,{lw:0.9});ctx.restore();});
   fr(P,pa,()=>{
    if(banner){
     ln([[0,32],[0,-60]],2.8,K);ln([[0,32],[0,-60]],1.2,C);ln([[3,-58],[-42,-58]],2.4);
     const w=x=>Math.sin((m.walk?m.ph:m.eat?m.u*TAU:m.t*3)+x*0.18)*(m.walk||!m.eat?1.4:0.6);
     const cloth=[[-41,-58],[1,-58]];for(let x=1;x>=-41;x-=6)cloth.push([x+w(x)*0.4,-27+w(x)]);
     sh(cloth,R,{x:[K,2.2,-6,0.5]});
     ctx.save();ctx.fillStyle=C;ctx.strokeStyle=K;ctx.lineWidth=1.6;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
     ctx.font=`900 11px ${FONT}`;ctx.strokeText('PLAN',-20,-48);ctx.fillText('PLAN',-20,-48);
     ctx.font=`900 8.5px ${FONT}`;ctx.strokeText('5-LETNI',-20,-36);ctx.fillText('5-LETNI',-20,-36);ctx.restore();
    }else{sh([[-1.4,26],[-1.4,-14],[-3,-19],[-0.5,-16],[0.5,-21],[1.5,-15],[1.4,26]],K,{h:[C,3,-1e3,0.5]});sh([[0,-12],[-6,-10],[-4,-7],[0,-9]],R,{lw:1.2});}});
   arm(S,grip(H1),R,{d:[K,S[0],10]},4.4,1);fist(grip(H1));fist(grip(H2));});
 }
};

STYLES.push({id:'plakat',name:'Plakat PRL',desc:'Linoryt z plakatu propagandowego: czerwień, czerń i krem, bohaterskie pozy nawet u trupa.',
 draw(k,x,y,h,st){seed=0;ctx.translate(x,y);ctx.scale(h/100,h/100);shadow();FIG[k](motion(k,st),st);}});
})();
