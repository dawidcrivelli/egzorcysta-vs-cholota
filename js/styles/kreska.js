/* Styl „Kreska tuszem”: karykatura prasowa — drżąca kreska pędzla, kremowy papier, jedna lawowana barwa na postać, kreskowanie w cieniu.
   Układ w jednostkach u=h/100: (0,0) = ziemia między stopami, głowa ok. y=-100, przód = -x (idą w lewo). */
(()=>{
const INK='#1c1814',PAPER='#f4ecd6',GREY='#8a837a',TAU=Math.PI*2;
const ACC={trup:'#93b35a',sasiad:'#3f72c8',urzednik:'#7d93ab',komunista:'#d2382a'};
let SEED=0;   // licznik kresek: te same wywołania w tej samej pozie = ta sama „ręka”
const fract=v=>v-Math.floor(v),hsh=n=>fract(Math.sin(n*127.1+311.7)*43758.5453);
// gładki szum kreski; per = obwód zamkniętego konturu: całkowita liczba fal (bez szwu), gęstość jak na otwartej kresce
const nz=(sd,s,per)=>{const a=hsh(sd),b=hsh(sd+1.3),c=hsh(sd+2.7),q=per/(12*TAU),f1=per?Math.max(1,Math.round((5+a*6)*q)):5+a*6,f2=per?Math.max(2,Math.round((13+c*9)*q)):13+c*9;
 return Math.sin(s*f1+b*TAU)*0.6+Math.sin(s*f2+a*TAU)*0.4;};
const P=(x,y,sharp)=>sharp?[x,y,1]:[x,y];
const ell=(cx,cy,rx,ry,n=14,r0=0)=>Array.from({length:n},(_,i)=>[cx+Math.cos(r0+i/n*TAU)*rx,cy+Math.sin(r0+i/n*TAU)*ry]);
const add=(a,b,k=1)=>[a[0]+b[0]*k,a[1]+b[1]*k];
const pol=(o,len,ang)=>[o[0]+Math.cos(ang)*len,o[1]+Math.sin(ang)*len];
// Catmull-Rom przez punkty; punkt z trzecim polem = ostry narożnik (łamana)
function dense(p,closed){
 const out=[],n=p.length,m=closed?n:n-1,G=i=>p[closed?(i+n)%n:clamp(i,0,n-1)];
 for(let i=0;i<m;i++){const p0=G(i-1),p1=G(i),p2=G(i+1),p3=G(i+2),lin=p1[2]||p2[2];
  for(let j=0;j<6;j++){const t=j/6,t2=t*t,t3=t2*t;
   out.push(lin?[lerp(p1[0],p2[0],t),lerp(p1[1],p2[1],t)]:[0,1].map(d=>0.5*(2*p1[d]+(p2[d]-p0[d])*t+(2*p0[d]-5*p1[d]+4*p2[d]-p3[d])*t2+(3*p1[d]-p0[d]-3*p2[d]+p3[d])*t3)));}}
 if(!closed)out.push(p[n-1]);return out;
}
const normals=d=>d.map((q,i)=>{const a=d[Math.max(i-1,0)],b=d[Math.min(i+1,d.length-1)],nx=a[1]-b[1],ny=b[0]-a[0],l=Math.hypot(nx,ny)||1;return[nx/l,ny/l];});
const path=d=>{ctx.beginPath();d.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();};
/* kreska pędzla: wstęga o zmiennej grubości, lekko zbaczająca z osi; otwarta zwęża się na końcach */
function brush(p,w,o={}){
 const sd=SEED++,cl=!!o.closed,d=dense(p,cl),N=normals(d),n=d.length,A=[],B=[],ss=[0];
 for(let i=1;i<n;i++)ss.push(ss[i-1]+Math.hypot(d[i][0]-d[i-1][0],d[i][1]-d[i-1][1]));
 const per=cl&&ss[n-1];
 for(let i=0;i<n;i++){
  const f=i/(n-1||1),s=cl?i/n*TAU:ss[i]/12,tp=cl?1:Math.min(1,Math.pow(Math.sin(Math.PI*f),0.6)*1.4+0.15),
   off=0.5*nz(sd,s,per),ww=w*0.5*tp*(0.78+0.32*nz(sd+5,s,per)),cx=d[i][0]+N[i][0]*off,cy=d[i][1]+N[i][1]*off;
  A.push([cx+N[i][0]*ww,cy+N[i][1]*ww]);B.push([cx-N[i][0]*ww,cy-N[i][1]*ww]);}
 ctx.beginPath();A.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));
 if(cl){ctx.closePath();ctx.moveTo(B[n-1][0],B[n-1][1]);for(let i=n-2;i>=0;i--)ctx.lineTo(B[i][0],B[i][1]);}
 else for(let i=n-1;i>=0;i--)ctx.lineTo(B[i][0],B[i][1]);
 ctx.closePath();ctx.fillStyle=o.col||INK;ctx.fill(cl?'evenodd':'nonzero');
}
/* lawowanie: barwa przesunięta i rozlana obok konturu, ciemniejszy brzeg jak przy akwareli */
function wash(d,col,a=0.62){
 const sd=SEED++,N=normals(d.concat([d[0]])),n=d.length;
 const w=d.map((q,i)=>{const r=1.3*nz(sd,i/n*TAU,30);return[q[0]+1.3+N[i][0]*r,q[1]+0.9+N[i][1]*r];});
 ctx.save();ctx.globalCompositeOperation='multiply';ctx.globalAlpha=a;path(w);ctx.fillStyle=col;ctx.fill();
 ctx.globalAlpha=a*0.45;ctx.lineWidth=1.1;ctx.strokeStyle=col;ctx.stroke();ctx.restore();
}
// kreskowanie cienia w obrysie d, tylko w prostokącie r=[x0,y0,x1,y1]; cross = drugi kierunek
function hatch(d,r,gap=2.6,cross){
 const sd=SEED++;ctx.save();path(d);ctx.clip();ctx.beginPath();ctx.rect(r[0],r[1],r[2]-r[0],r[3]-r[1]);ctx.clip();
 ctx.strokeStyle=INK;ctx.lineWidth=0.55;ctx.lineCap='round';ctx.beginPath();
 const H=r[3]-r[1];
 for(const dir of cross?[1,-1]:[1])for(let x=r[0]-H,i=0;x<r[2]+H;x+=gap,i++){const j=hsh(sd+i*3.1+dir)*0.8;ctx.moveTo(x+j,r[3]+1);ctx.lineTo(x+dir*H+j*1.6,r[1]-1);}
 ctx.stroke();ctx.restore();
}
/* kształt: papier, lawowanie, kreskowanie, kontur tuszem */
function shape(p,o={}){
 const d=dense(p,true);path(d);ctx.fillStyle=o.fill||PAPER;ctx.fill();
 if(o.wash)wash(d,o.wash,o.wa);if(o.ink)wash(d,GREY,o.ink);
 if(o.hatch)hatch(d,o.hatch,o.gap,o.cross);
 if(o.w!==0)brush(p,o.w||2.2,{closed:true});
 return d;
}
function tube(p,r){
 const L=[],R=[],N=normals(p);
 p.forEach((q,i)=>{const ri=Array.isArray(r)?r[i]:r;L.push([q[0]+N[i][0]*ri,q[1]+N[i][1]*ri]);R.unshift([q[0]-N[i][0]*ri,q[1]-N[i][1]*ri]);});
 return L.concat(R);
}
const dot=(x,y,r,col=INK)=>{ctx.beginPath();ctx.ellipse(x,y,r,r*0.9,0,0,TAU);ctx.fillStyle=col;ctx.fill();};
const shoe=f=>shape(ell(f[0]-2.4,f[1]-2.6,6.4,3.2,10),{fill:INK,w:1.4});
function hand(c,col,r=3.4){shape(ell(c[0],c[1],r,r*0.85,9),{wash:col,w:1.5});}
// zamach do ciosu: 1 = ręka w górze; powoli w górę, szybko w dół, chwila przy celu
const raise=e=>{const k=fract(e/TAU);return k<0.65?Math.sin(k/0.65*Math.PI/2):k<0.78?1-(k-0.65)/0.13:0;};
// chód: dwie nogi, faza a=ph+i*π; stopa w powietrzu, gdy idzie do przodu (cos>0)
function gait(ph,walk,hip,stride=7,lift=4){
 return[0,1].map(i=>{const a=ph+i*Math.PI,fx=hip[0]+(walk?-stride*Math.sin(a):(i?3.5:-3.5)),fy=walk?-lift*Math.max(0,Math.cos(a)):0;
  return[hip,[(hip[0]+fx)/2-2.5-(walk?Math.max(0,Math.cos(a))*2.5:0),(hip[1]+fy)/2],[fx,fy]];});
}
function leg(L,o,r=4.6){shape(tube([add(L[0],[0,-2]),L[1],add(L[2],[0,-3])],r),o);shoe(L[2]);}
function shadow(w=26){
 ctx.save();ctx.globalCompositeOperation='multiply';ctx.globalAlpha=0.35;ctx.beginPath();ctx.ellipse(1,0.5,w,4.5,0,0,TAU);ctx.fillStyle=GREY;ctx.fill();ctx.restore();
 for(let i=0;i<4;i++)brush([[-w*0.8+i*5,1.6+i*0.9],[w*0.55+i*3,1.4+i*0.9]],0.9);
}
// nos‑kartofel i oko; ok = 0..1 otwarcie ust
function mouth(c,w,ok,teeth){
 if(ok<0.08){brush([[c[0]-w/2,c[1]],[c[0],c[1]+0.8],[c[0]+w/2,c[1]-0.6]],1.5);return;}
 const hh=1.5+ok*4,d=shape(ell(c[0],c[1]+hh/2-0.5,w/2,hh/2,10),{fill:'#3a1f1a',w:1.4});
 if(teeth){ctx.save();path(d);ctx.clip();ctx.fillStyle=PAPER;for(let i=0;i<3;i++)ctx.fillRect(c[0]-w*0.4+i*w*0.3,c[1]-1,w*0.2,1.6+(i&1)*0.8);ctx.restore();}
}
const star=(c,r)=>Array.from({length:10},(_,i)=>P(c[0]+Math.cos(-Math.PI/2+i*Math.PI/5)*r*(i&1?0.45:1),c[1]+Math.sin(-Math.PI/2+i*Math.PI/5)*r*(i&1?0.45:1),1));

/* ---------- postacie ---------- */
const FIG={
trup(c){   // zgarbiony, ręce przed siebie, świecące oczy
 const{ph,walk,ea,br,ok}=c,bob=walk?-1.4*Math.abs(Math.cos(ph)):br,hip=[7,-26+bob],L=gait(ph,walk,hip,5.5,3),A=ACC.trup,sw=walk?Math.sin(ph)*2.5:Math.sin(c.t*1.6);
 const sh=[-4-ea*4,-51+bob+ea*2],hd=[-15-ea*9,-64+bob+ea*3];
 const arm=(dy,s)=>{const el=[-20-ea*6,sh[1]-2+dy+s],hn=[-34-ea*10,sh[1]-5+dy+s+ea*6];shape(tube([add(sh,[6,0]),el,hn],3.6),{ink:0.7,hatch:[el[0],el[1]-1,sh[0]+8,el[1]+6]});hand(hn,A);
  for(let i=0;i<3;i++)brush([add(hn,[-2,-1.5+i*1.6]),add(hn,[-6,-2+i*2]),add(hn,[-7.5,i*2.2])],1.1);};
 arm(-6,-sw);leg(L[1],{ink:0.9,hatch:[-20,-30,20,0],gap:2});
 shape([[17,-47+bob],[12,-57+bob],[-2,-57+bob],sh,[-12-ea*4,-44+bob],[-8,-34+bob],P(-7,-20+bob,1),P(-3,-24+bob,1),P(0,-18+bob,1),P(4,-23+bob,1),P(8,-17+bob,1),P(11,-23+bob,1),P(14,-20+bob,1),[15,-32+bob]],
  {ink:0.85,hatch:[3,-60,20,-15],gap:2.2,cross:1});
 shape([P(-3,-55+bob,1),P(0,-55+bob,1),P(-2,-44+bob,1),P(-5,-42+bob,1),P(-5,-50+bob,1)],{fill:INK,w:0.8});brush([[2,-56+bob],[-3,-46+bob],[-4,-34+bob]],1.2);brush([[-6,-50+bob],[-4,-45+bob],[-8,-42+bob]],1);   // klapa, łata
 leg(L[0],{ink:0.9,hatch:[2,-30,20,0],gap:2.4});
 shape(ell(hd[0],hd[1],13,15,14),{wash:A,wa:0.75,hatch:[hd[0]+3,hd[1]+2,hd[0]+14,hd[1]+16]});
 shape(ell(hd[0]+10,hd[1]+1,2.6,4,8),{wash:A,w:1.5});
 for(let i=0;i<4;i++)brush([[hd[0]-4+i*4,hd[1]-13],[hd[0]-6+i*5,hd[1]-19+i%2*2],[hd[0]-9+i*5.5,hd[1]-20]],1);
 brush([[hd[0]-9,hd[1]-6],[hd[0]-4,hd[1]-4]],1.3);brush([[hd[0]-2,hd[1]-6],[hd[0]+3,hd[1]-5]],1.3);
 for(const [ex,r] of [[-6.5,3.2],[0.5,2.6]]){const e=[hd[0]+ex,hd[1]-1];
  const g=ctx.createRadialGradient(e[0],e[1],0,e[0],e[1],r*2.6);g.addColorStop(0,'rgba(220,255,120,.9)');g.addColorStop(1,'rgba(200,255,90,0)');ctx.fillStyle=g;ctx.fillRect(e[0]-r*3,e[1]-r*3,r*6,r*6);
  shape(ell(e[0],e[1],r,r,8),{fill:'#f2ffc8',w:1.3});dot(e[0]-0.6,e[1],0.9);}
 shape([[hd[0]-11,hd[1]+0],[hd[0]-17,hd[1]+5],[hd[0]-11,hd[1]+6]],{wash:A,w:1.6});
 mouth([hd[0]-6,hd[1]+9],9,Math.max(ok,ea*0.9),1);
 arm(0,sw);
},
sasiad(c){   // brzuch w podkoszulku, dres w paski, czapka, flaszka
 const{ph,walk,ea,br,ok,t}=c,bob=walk?-1.5*Math.abs(Math.cos(ph)):br,hip=[2,-26+bob],L=gait(ph,walk,hip),A=ACC.sasiad,sw=walk?Math.sin(ph):0;
 const pants=l=>{leg(l,{wash:A,wa:0.7,hatch:[l[1][0],l[1][1]-14,l[1][0]+8,l[1][1]+14],gap:2.4});
  const q=[add(l[0],[1.5,0]),add(l[1],[1.8,0]),add(l[2],[1.4,-4])];brush(q,2.2,{col:PAPER});brush(q.map(v=>add(v,[1.3,0])),0.7);brush(q.map(v=>add(v,[-1.3,0])),0.7);};
 const sh=[-2,-55+bob],bsh=[7,-55+bob];
 const ba=pol(bsh,11,Math.PI/2+sw*0.5),bh=pol(ba,10,Math.PI/2+0.2+sw*0.6);shape(tube([bsh,ba,bh],3.4),{hatch:[0,-60,20,-30]});hand(bh);
 pants(L[1]);
 const v=shape([[11,-55+bob],[-6,-57+bob],[-13,-48+bob],[-19,-38+bob],[-16,-28+bob],[-6,-24+bob],[11,-25+bob],[13,-40+bob]],{hatch:[-17,-34+bob,14,-23+bob],gap:2.2});
 brush([[-4,-56+bob],[0,-50+bob],[5,-56+bob]],1.2);brush([[-17,-30+bob],[-10,-27+bob]],1);   // dekolt, brzuch
 shape([[-16,-27+bob],[12,-27+bob],[12,-22+bob],[-12,-21+bob]],{wash:A,wa:0.7});
 pants(L[0]);
 const hd=[-5-ea*3,-72+bob];
 shape(ell(hd[0],hd[1],14,15,14),{hatch:[hd[0]+5,hd[1]+3,hd[0]+15,hd[1]+15]});
 shape(ell(hd[0]+11,hd[1]+1,2.6,3.8,8),{w:1.5});
 for(let i=0;i<9;i++)dot(hd[0]-8+hsh(i)*9,hd[1]+8+hsh(i+9)*5,0.35);   // zarost
 shape([[hd[0]+14,hd[1]-6],[hd[0]+12,hd[1]-15],[hd[0]-2,hd[1]-19],[hd[0]-12,hd[1]-12],[hd[0]-12,hd[1]-7]],{wash:A,wa:0.75,hatch:[hd[0]+6,hd[1]-20,hd[0]+16,hd[1]-4]});
 shape([P(hd[0]-11,hd[1]-9,1),P(hd[0]-25,hd[1]-6,1),[hd[0]-22,hd[1]-4],P(hd[0]-10,hd[1]-6,1)],{fill:INK,w:1.4});   // daszek
 brush([[hd[0]-8,hd[1]-3],[hd[0]-4,hd[1]-4]],1.4);brush([[hd[0]-9,hd[1]-0.5],[hd[0]-5.5,hd[1]]],1.3);dot(hd[0]-7,hd[1]-1.2,1);   // ciężka powieka
 brush([[hd[0]-1,hd[1]-4],[hd[0]+3,hd[1]-3.5]],1.3);dot(hd[0]+1,hd[1]-1.5,0.9);
 mouth([hd[0]-9,hd[1]+9.5],7,ok,0);
 shape([[hd[0]-17,hd[1]+5],[hd[0]-10,hd[1]+3.5],[hd[0]-4,hd[1]+6],[hd[0]-7,hd[1]+8.5],[hd[0]-12,hd[1]+7],[hd[0]-18,hd[1]+9]],{fill:INK,w:1});
 const ns=ell(hd[0]-15,hd[1]+1.5,5,4.4,10);path(dense(ns,true));ctx.fillStyle=PAPER;ctx.fill();wash(dense(ns,true),'#e0605a',0.55);brush(ns,1.8,{closed:true});
 // przednia ręka z flaszką; przy ataku zamach znad głowy w dół
 const a=c.eat?lerp(2.5,4.9,raise(c.e)):0,el=c.eat?pol(sh,11,a+0.3):pol(sh,11,1.75+sw*0.3),hn=c.eat?pol(el,10,a):pol(el,9,2.75+sw*0.2);
 shape(tube([sh,el,hn],3.4));
 ctx.save();ctx.translate(hn[0],hn[1]);if(c.eat){ctx.rotate(a-Math.PI/2);ctx.translate(0,14);}else ctx.translate(0,-1);
 shape([[-3.4,9],[-3.6,-3],[-1.5,-7],[-1.4,-14],[1.4,-14],[1.5,-7],[3.6,-3],[3.4,9]],{fill:'#5a4128',ink:0.5,w:1.6});
 shape([P(-3.5,0,1),P(3.5,0,1),P(3.5,5,1),P(-3.5,5,1)],{w:0.8});brush([[-1.8,6],[-1.8,-4]],0.9,{col:'rgba(255,255,255,.55)'});
 ctx.restore();hand(hn);
},
urzednik(c){   // szary garnitur, krawat, łysina, okulary, pieczątka ZAMKNIĘTE
 const{ph,walk,ea,br,ok}=c,bob=walk?-1.1*Math.abs(Math.cos(ph)):br,hip=[2,-26+bob],L=gait(ph,walk,hip,5.5,3.5),A=ACC.urzednik,sw=walk?Math.sin(ph):0;
 const sh=[-3,-55+bob],bsh=[7,-56+bob];
 const ba=pol(bsh,11,Math.PI/2+sw*0.4),bh=pol(ba,10,Math.PI/2+0.25+sw*0.5);shape(tube([bsh,ba,bh],3.8),{wash:A,hatch:[0,-60,20,-30],gap:2});hand(bh);
 leg(L[1],{wash:A,ink:0.5,hatch:[-20,-30,20,0],gap:2.2});
 shape([[12,-56+bob],[-7,-58+bob],[-13,-46+bob],[-13,-28+bob],P(-10,-20+bob,1),P(12,-20+bob,1),[13,-40+bob]],{wash:A,wa:0.7,hatch:[5,-60,15,-18],gap:2.2});
 shape([P(-6,-58+bob,1),P(2,-58+bob,1),P(-3,-46+bob,1)],{w:1.2});
 shape([P(-3,-57+bob,1),P(-1,-57+bob,1),P(0,-50+bob,1),P(-2,-44+bob,1),P(-4,-50+bob,1)],{fill:INK,w:1});
 brush([[2,-57+bob],[-4,-44+bob],[-11,-24+bob]],1.2);dot(-9,-38+bob,0.8);dot(-9,-30+bob,0.8);
 leg(L[0],{wash:A,wa:0.65,hatch:[L[0][1][0]+1,-28,20,0],gap:2.4});
 // pieczątka: przy ataku powolny zamach nad głowę (za nią) i szybkie walnięcie przed siebie
 const up=c.eat?raise(c.e):0,hn=!c.eat?[-19,-52+bob+sw*1.2]:[lerp(-38,-12,up),lerp(-26,-104,up)],
  el=!c.eat?[(sh[0]+hn[0])/2+4,(sh[1]+hn[1])/2+5]:[lerp(-22,7,up),lerp(-40,-80,up)];
 const stamp=()=>{shape(tube([sh,el,hn],3.8),{wash:A});
  ctx.save();ctx.translate(hn[0],hn[1]);ctx.rotate(-0.25*up);
  shape(ell(0,-6,3.6,3,10),{fill:'#8a5a32',ink:0.3,w:1.4});shape(tube([[0,-4],[0,3]],1.6),{fill:'#8a5a32',w:1.2});
  shape([P(-14,3,1),P(14,3,1),P(14,11,1),P(-14,11,1)],{fill:'#8a5a32',ink:0.3,w:1.6});shape([P(-14,11,1),P(14,11,1),P(13,14,1),P(-13,14,1)],{fill:INK,w:1});
  ctx.fillStyle=PAPER;ctx.font='900 5.6px '+FONT;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('ZAMKNIĘTE',0,7.2,25);
  ctx.restore();hand(hn,null,3.6);};
 if(c.eat)stamp();
 const hd=[-4-ea*3,-73+bob+ea*2];
 shape(ell(hd[0],hd[1],13.5,15,14),{hatch:[hd[0]+5,hd[1]+4,hd[0]+15,hd[1]+15]});
 brush([[hd[0]-5,hd[1]-11],[hd[0]-1,hd[1]-13]],1.1,{col:'rgba(255,255,255,.9)'});   // połysk łysiny
 for(let i=0;i<5;i++)brush([[hd[0]+8+i*0.8,hd[1]-8+i*3],[hd[0]+14,hd[1]-7+i*3],[hd[0]+15.5,hd[1]-9+i*3.2]],0.9);
 shape(ell(hd[0]+9,hd[1]+1,2.6,3.8,8),{w:1.5});
 brush([[hd[0]-11,hd[1]-6],[hd[0]-5,hd[1]-7.5]],1.6);brush([[hd[0]-1,hd[1]-6.5],[hd[0]+3,hd[1]-6]],1.4);
 for(const [ex,r] of [[-8,3.6],[1,3]]){brush(ell(hd[0]+ex,hd[1]-2,r,r*0.85,10),0.9,{closed:true});dot(hd[0]+ex-0.8,hd[1]-1.6,0.9);}
 brush([[hd[0]-4.4,hd[1]-2],[hd[0]-2,hd[1]-2.6]],0.8);brush([[hd[0]+4,hd[1]-2.4],[hd[0]+8.5,hd[1]-1]],0.8);
 shape([[hd[0]-10,hd[1]-2],[hd[0]-18,hd[1]+5],[hd[0]-17,hd[1]+8],[hd[0]-11,hd[1]+6]],{w:1.7});   // długi nos
 mouth([hd[0]-8,hd[1]+10.5],7,ok,0);if(ok<0.08)brush([[hd[0]-12,hd[1]+11],[hd[0]-11,hd[1]+12.5]],0.9);
 if(!c.eat)stamp();
},
komunista(c){   // czerwona kurtka, czapka z gwiazdą, transparent przed sobą (tarcza)
 const{ph,walk,ea,br,ok}=c,bob=walk?-1.5*Math.abs(Math.cos(ph)):br,hip=[3,-26+bob],L=gait(ph,walk,hip),A=ACC.komunista,sw=walk?Math.sin(ph):0;
 const sh=[-2,-55+bob],bsh=[8,-55+bob],jab=ea?Math.max(0,Math.sin(c.e)):0,hb=[-22-jab*5,-40+bob],hf=[-21-jab*5,-52+bob];
 shape(tube([bsh,[4,-38+bob],add(hb,[2,0])],3.6),{wash:A,hatch:[0,-60,20,-30],gap:2});
 leg(L[1],{ink:0.9,hatch:[-20,-30,20,0],gap:2});
 shape([[12,-56+bob],[-6,-58+bob],[-12,-46+bob],[-11,-26+bob],P(-9,-20+bob,1),P(12,-20+bob,1),[13,-40+bob]],{wash:A,wa:0.72,hatch:[6,-60,15,-18],gap:2.2});
 brush([[-2,-57+bob],[-6,-40+bob],[-9,-22+bob]],1.2);shape([P(-1,-52+bob,1),P(5,-52+bob,1),P(5,-47+bob,1),P(-1,-47+bob,1)],{wash:A,w:1});   // zamek, kieszeń
 leg(L[0],{ink:0.85,hatch:[L[0][1][0]+1,-28,20,0],gap:2.4});
 const hd=[-4,-72+bob];
 shape(ell(hd[0],hd[1],14,15,14),{hatch:[hd[0]+5,hd[1]+3,hd[0]+15,hd[1]+15]});
 shape(ell(hd[0]+10,hd[1]+1,2.6,3.8,8),{w:1.5});
 shape([[hd[0]+14,hd[1]-5],[hd[0]+13,hd[1]-15],[hd[0]+2,hd[1]-20],[hd[0]-12,hd[1]-15],[hd[0]-13,hd[1]-7]],{wash:A,wa:0.5,ink:0.6,hatch:[hd[0]+6,hd[1]-20,hd[0]+16,hd[1]-4]});
 shape([P(-12+hd[0],hd[1]-10,1),P(hd[0]-24,hd[1]-7,1),[hd[0]-21,hd[1]-5],P(hd[0]-11,hd[1]-6.5,1)],{fill:INK,w:1.4});
 shape(star([hd[0]-5,hd[1]-13],3.6),{wash:A,wa:0.95,w:1});
 brush([[hd[0]-11,hd[1]-6.5],[hd[0]-5,hd[1]-3.5]],1.8);brush([[hd[0]-1,hd[1]-4],[hd[0]+3,hd[1]-5.5]],1.6);   // gniewne brwi
 dot(hd[0]-7,hd[1]-1,1.1);dot(hd[0]+1,hd[1]-1.2,1);
 shape([[hd[0]-10,hd[1]-2],[hd[0]-17,hd[1]+1],[hd[0]-20,hd[1]+5],[hd[0]-16,hd[1]+7.5],[hd[0]-10,hd[1]+5]],{w:1.7});
 mouth([hd[0]-8,hd[1]+9.5],8,Math.max(ok,jab*0.7),1);
 // transparent obraca się wokół dłoni; bez tarczy zostaje złamany kij
 ctx.save();ctx.translate(hf[0],hf[1]);ctx.rotate(-0.24*jab);
 if(c.shield>0){
  const fl=walk?Math.sin(c.ph*2)*1.2:Math.sin(c.t*2)*0.8,Y=-70,B=-34;
  brush([[-1,46],[-1,-74]],3.4);shape(tube([[-1,46],[-1,-74]],1.5),{fill:'#9a6a3a',w:1.2});
  const cl=[P(1,Y,1),P(-50,Y,1),[-51,(Y+B)/2+fl],P(-50,B+fl,1),[-38,B-2+fl],[-25,B+1-fl],P(1,B,1)];
  shape(cl,{wash:A,wa:0.85,hatch:[-50,B-6,1,B+4],gap:2.4});brush([[-52,Y-1],[3,Y-1]],2.4);
  ctx.fillStyle=INK;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 12px '+FONT;ctx.fillText('PLAN',-24,Y+10);ctx.font='900 9.5px '+FONT;ctx.fillText('5-LETNI',-24,Y+25+fl*0.5);
 }else{shape([P(-2,22,1),P(1,22,1),P(1.6,-20,1),P(0,-23,1),P(-0.6,-18,1),P(-1.8,-22,1)],{fill:'#9a6a3a',w:1.3});
  shape([P(1,-16,1),P(-8,-14,1),P(-5,-9,1),P(-9,-5,1),P(1,-7,1)],{wash:A,wa:0.8,w:1});}
 ctx.restore();
 shape(tube([sh,[-10,-46+bob],hf],3.6),{wash:A});hand(hf,null,3.4);hand(hb,null,3.4);
}};

STYLES.push({id:'kreska',name:'Kreska tuszem',desc:'Karykatura z gazety: drżąca kreska tuszu, kremowy papier i jedna lawowana barwa.',
 draw(k,x,y,h,st){
  const f=FIG[k];if(!f)return;const t=st.t||0,walk=!!st.walk&&!st.eat;
  const ph=t*TAU/cycleOf(k,st).P,e=st.eat?t*TAU/cycleOf(k,{eat:true}).P:0;
  const c={t,walk,eat:!!st.eat,ph:walk?ph:0,e,ea:st.eat?0.5-0.5*Math.cos(e):0,br:st.eat||walk?0:Math.sin(t*2)*0.7,ok:st.talk?0.5+0.5*Math.sin(t*13):0,shield:st.shield};
  ctx.translate(x,y);ctx.scale(h/100,h/100);ctx.lineJoin='round';SEED=k.length*977;
  shadow(k==='komunista'?30:24);f(c);
 }});
})();
