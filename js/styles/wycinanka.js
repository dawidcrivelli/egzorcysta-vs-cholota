/* Styl „Wycinanka ludowa”: postacie z płaskiego kolorowego papieru, sztywne części obracane na pinezkach,
   każda warstwa rzuca mały cień. Jednostki: wysokość postaci = 100, (0,0) = ziemia między stopami, przód = w lewo. */
(()=>{
const TAU=Math.PI*2, LEG=38, SH_U=1.2, SHADOW='rgba(70,30,10,.4)';
const C={red:'#d8232a',dred:'#a3141f',grn:'#1f8f45',lgrn:'#6cbf3e',yel:'#f7c51e',blu:'#1f55b8',dblu:'#173d86',pink:'#e0418a',
 wht:'#f8f3e3',blk:'#1d1b22',pin:'#fff1b8',skin:'#f2b48c',ear:'#dc9670',brown:'#6b3a1c'};
let pxU=1;   // piksele bitmapy na jednostkę: offset cienia nie podlega transformacji
const shadow=on=>{ctx.shadowColor=on?SHADOW:'transparent';ctx.shadowOffsetX=ctx.shadowOffsetY=Math.max(1,SH_U*pxU);ctx.shadowBlur=0;};
const fill=(c,f)=>{ctx.fillStyle=c;ctx.beginPath();f();ctx.fill();};
const circ=(x,y,r)=>()=>{ctx.moveTo(x+r,y);ctx.arc(x,y,r,0,TAU);};
const ell=(x,y,rx,ry,a=0)=>()=>ctx.ellipse(x,y,rx,ry,a,0,TAU);
const rr=(x,y,w,h,r)=>()=>ctx.roundRect(x,y,w,h,r);
const poly=(...p)=>()=>{ctx.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)ctx.lineTo(p[i],p[i+1]);ctx.closePath();};
const at=(x,y,a,f)=>{ctx.save();ctx.translate(x,y);ctx.rotate(a);f();ctx.restore();};
const pin=(x,y)=>fill(C.pin,circ(x,y,1.1));
const flower=(x,y,r,c,mid=C.yel)=>{for(let i=0;i<5;i++){const a=i*TAU/5-Math.PI/2;fill(c,circ(x+Math.cos(a)*r*.62,y+Math.sin(a)*r*.62,r*.42));}fill(mid,circ(x,y,r*.34));};
const dots=(x0,y0,x1,y1,n,r,c)=>{for(let i=0;i<n;i++){const f=n>1?i/(n-1):.5;fill(c,circ(lerp(x0,x1,f),lerp(y0,y1,f),r));}};
// ząbkowany pas (wycięty nożyczkami brzeg): od x0 do x1, górna krawędź y-top, zęby w dół o d
const zig=(x0,x1,y,d,n,c,top=2)=>fill(c,()=>{const w=(x1-x0)/n;ctx.moveTo(x0,y-top);ctx.lineTo(x1,y-top);ctx.lineTo(x1,y);
 for(let i=n;i>0;i--){ctx.lineTo(x0+w*(i-.5),y+d);ctx.lineTo(x0+w*(i-1),y);}ctx.closePath();});
const scal=(x0,x1,y,n,c)=>{const r=(x1-x0)/n/2;for(let i=0;i<n;i++)fill(c,circ(x0+r*(2*i+1),y,r));};
const eye=(x,y,s=1,iris=C.blk)=>{fill(C.wht,ell(x,y,2.6*s,3*s));fill(iris,circ(x-.8*s,y+.3*s,1.4*s));};
// kąt i długość ręki od barku do dłoni (ręka wisi w dół przy a=0, a>0 = do przodu)
const reach=(sx,sy,hx,hy)=>({a:Math.atan2(sx-hx,hy-sy),len:Math.hypot(hx-sx,hy-sy)});

/* sztywna noga na pinezce w biodrze; o: c kolor, shoe, low (goleń/skarpeta), torn (postrzępiona nogawka), deco */
function leg(x,y,a,o){at(x,y,a,()=>{
 if(o.low)fill(o.low,rr(-4,LEG-17,8,12,2));
 fill(o.c,rr(-5,-2,10,LEG-(o.low?13:5),3));
 if(o.torn)zig(-5,5,LEG-15,4,3,o.c,0);
 o.deco&&o.deco();
 fill(o.shoe,()=>ctx.roundRect(-11,LEG-7,15,7,[4,3,1,1]));
 o.sole&&fill(o.sole,rr(-11,LEG-2,15,2,1));
 pin(0,0);});}
/* sztywna ręka na pinezce w barku; held() rysuje trzymany przedmiot w układzie dłoni (obrócony z powrotem o -a-lean) */
function arm(x,y,a,o,lean=0){const len=o.len||25;at(x,y,a,()=>{
 fill(o.c,rr(-4,-2,8,len*.85,3.5));
 if(o.cuff)zig(-4,4,len*.85-2,3,2,o.c,0);
 o.held&&at(0,len,o.swing?0:-a-lean,o.held);
 fill(o.hand||C.skin,circ(0,len,4.2));
 o.claws&&[-1,1,0].forEach(i=>fill(o.hand,poly(-2+i*2.2,len+3,i*2.2-3.8,len+8.5,i*2.2+.6,len+4)));
 o.grip&&o.grip(len);
 pin(0,0);});}

/* faza ruchu: sw = wymach nóg (-1..1), r = uniesienie przy ataku (1 = zamach, 0 = uderzenie), m = otwarcie ust */
function pose(k,st){
 const t=st.t||0;let ph=0,sw=0,r=0,br=0;
 if(st.eat){ph=t*TAU/cycleOf(k,{eat:true}).P;const f=((ph/TAU)%1+1)%1;r=f<.6?Math.sin(f/.6*Math.PI/2):f<.72?1-(f-.6)/.12:0;}
 else if(st.walk){ph=t*TAU/cycleOf(k,st).P;sw=Math.sin(ph);}
 else br=Math.sin(t*2.4);
 return{ph,sw,r,br,eat:!!st.eat,m:st.talk?.25+.75*Math.abs(Math.sin(ph*2)):st.eat?.6*r:0};
}
/* szkielet kukiełki: tylna ręka, nogi, potem tułów z głową i przednią ręką; tułów pochylony o lean wokół bioder */
function puppet(p,o){
 const a=p.sw*(o.stride||.38),hy=-LEG*Math.cos(a)+p.br*.5,T=f=>at(0,hy,o.lean,f);
 o.back&&T(o.back);
 leg(3.5,hy,-a,o.legB);leg(-3.5,hy,a,o.legF);
 T(o.front);
}
const head=(x,y,skin,r=12)=>{fill(skin,circ(x,y,r));};

const F={
 trup(p){
  const SK='#8fb86a',SKD='#6f9a52',SUIT='#2f2b44',SUITD='#25223a',bob=Math.sin(p.ph*2)*.06;
  const lean=p.eat?-.45-.25*(1-p.r):-.32+bob,arms=p.eat?.9+.8*p.r:1.45;
  puppet(p,{lean,stride:.3,
   legB:{c:SUITD,low:SKD,torn:1,shoe:'#4a2c18'},legF:{c:SUIT,low:SK,torn:1,shoe:'#5a3a22',deco:()=>fill(C.dred,rr(-4,10,6,6,1))},
   back:()=>arm(3,-27,arms+.12*Math.sin(p.ph+1),{c:SUITD,hand:SKD,cuff:1,claws:1,len:26},lean),
   front:()=>{
    // marynarka z postrzępionym dołem, łatą i kwiatkiem z grobu
    fill(SUIT,poly(-11,-32,10,-32,12,-2,-12,-2));zig(-12,12,-2,6,5,SUIT,0);
    fill('#cfc7a8',poly(-9,-32,-2,-32,-6,-17));fill(C.dred,poly(-6.5,-30,-4.5,-30,-5.5,-20));
    fill(C.dred,rr(1,-15,9,9,1));dots(2.5,-13.5,8.5,-13.5,3,.7,C.yel);dots(2.5,-7.5,8.5,-7.5,3,.7,C.yel);
    flower(-7,-23,4,C.pink);
    // głowa opada do przodu; żuchwa na osobnej pinezce
    at(-3,-31,p.eat?-.25:-.15,()=>{
     fill(SKD,circ(6,-11,3.2));head(-2,-13,SK,12.5);
     fill(C.blk,poly(-11,-22,-6,-28,-3,-23,1,-29,3,-23,7,-27,8,-19,-2,-21));
     fill('rgba(255,236,80,.45)',circ(-9,-14,5));fill('rgba(255,236,80,.45)',circ(-1,-15,4.4));
     fill('#ffe63a',circ(-9,-14,3.4));fill('#ffe63a',circ(-1,-15,3));fill(C.blk,circ(-9.7,-13.8,1.2));fill(C.blk,circ(-1.6,-14.8,1.1));
     fill(SKD,poly(-15,-10,-12,-9,-13,-7));
     fill('#2a0f12',ell(-8,-4,5,2.5+3*p.m));
     at(-2,-5,-.25-.5*p.m,()=>{fill(SK,poly(-12,0,2,-1,1,5,-10,5));fill(C.wht,poly(-11,0,-9,0,-10,2));fill(C.wht,poly(-7,0,-5,0,-6,2));pin(0,0);});
     fill(C.wht,poly(-12,-6,-10,-6,-11,-3.5));fill(C.wht,poly(-8,-6,-6,-6,-7,-3.5));
     pin(0,0);});
    arm(-2,-27,arms-.05+.12*Math.sin(p.ph),{c:SUIT,hand:SK,cuff:1,claws:1,len:27},lean);
   }});
 },
 sasiad(p){
  const lean=p.eat?-.2*(1-p.r)+.05*p.r:.04,TR=C.blu,TRD=C.dblu,CAP='#6b5640';
  const stripes=()=>{fill(C.wht,rr(1.2,-1,1.5,LEG-9,.7));fill(C.wht,rr(3,-1,1.5,LEG-9,.7));};
  const bottle=()=>{fill(C.brown,rr(-1.6,-6,3.2,8,1));fill('#7b3f12',rr(-3.8,1,7.6,16,2.5));fill(C.yel,rr(-3.8,6,7.6,6,1));fill(C.red,circ(0,9,1.5));fill(C.yel,rr(-1.6,-7,3.2,2,.5));hit(p,0,18);};
  const armA=p.eat?lerp(1.1,2.5,p.r):.15+.45*p.sw;
  puppet(p,{lean,stride:.42,
   legB:{c:TRD,shoe:'#d9d9d4',sole:C.red,deco:stripes},legF:{c:TR,shoe:'#f4f4f0',sole:C.red,deco:stripes},
   back:()=>arm(3,-27,.1-.45*p.sw+(p.eat?.4:0),{c:C.ear,hand:C.ear,len:24},lean),
   front:()=>{
    // biały podkoszulek na brzuchu, haftowany pas i kwiatki
    fill(C.skin,ell(-1,-29,9,4));
    fill(C.wht,()=>{ctx.moveTo(-8,-31);ctx.lineTo(-3,-27);ctx.lineTo(3,-27);ctx.lineTo(8,-31);ctx.lineTo(10,-4);ctx.lineTo(-10,-4);ctx.closePath();ctx.moveTo(-2,-14);ctx.ellipse(-3,-14,11,12,0,0,TAU);});
    zig(-13,10,-6,3,6,C.red,2);
    flower(-5,-19,4,C.red,C.grn);flower(3,-15,3,C.grn,C.red);dots(-11,-24,-11,-11,3,.9,C.blu);
    fill(TR,rr(-13,-4,24,6,2));fill(C.wht,rr(-13,-2,24,1.2,.5));
    // głowa: czapka z daszkiem, czerwony nos, wąsy
    at(-2,-31,p.eat?-.1:0,()=>{
     fill(C.ear,circ(6,-12,3.2));head(-1,-13,C.skin);
     fill(CAP,()=>ctx.ellipse(0,-17,12.5,9,0,Math.PI,TAU));fill(CAP,poly(-12,-17,-21,-15,-12,-14));fill("#4a3a2a",rr(-11.5,-18.5,23,2.5,1));
     eye(-7,-12,1);fill(C.blk,poly(-11,-16,-4,-16.5,-4,-15,-10,-14.5));
     fill('#3a1a12',ell(-9,-3,3.5,1.2+3*p.m));
     fill(C.blk,ell(-12,-6.5,4.5,2.2,.2));fill(C.blk,ell(-6,-6.5,3.8,2,-.25));
     fill(C.red,circ(-13,-9,3.4));
     pin(0,0);});
    arm(-3,-27,armA,{c:C.skin,len:24,held:bottle,swing:1},lean);
   },
  });
 },
 urzednik(p){
  const SU='#6c7480',SUD='#565d68',lean=p.eat?-.15*(1-p.r):.06,armA=p.eat?lerp(.55,2.3,p.r):.95+.08*p.sw;
  const stamp=()=>{fill(C.brown,circ(0,-6,4.3));fill('#8a5a30',rr(-1.8,-4,3.6,10,1));
   fill(C.blk,rr(-11,5,22,7,1.5));fill(C.red,rr(-11,12,22,3,1));
   ctx.fillStyle=C.wht;ctx.font=`900 2.9px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('ZAMKNIĘTE',0,8.7);hit(p,0,16);};
  puppet(p,{lean,stride:.3,
   legB:{c:SUD,shoe:C.blk},legF:{c:SU,shoe:C.blk,deco:()=>fill(SUD,rr(-.5,0,1,LEG-9,.5))},
   back:()=>arm(3,-27,.15-.35*p.sw,{c:SUD,len:24},lean),
   front:()=>{
    // szara marynarka: koszula, krawat w kropki, kwiatek w kieszonce, ząbkowany dół
    fill(SU,rr(-12,-32,23,32,4));scal(-12,11,0,6,SU);
    fill(C.wht,poly(-10,-32,-1,-32,-5,-16));
    fill(C.red,poly(-6.5,-31,-3.5,-31,-3,-17,-5,-14,-7,-17));dots(-5,-28,-5,-19,3,.6,C.yel);
    fill(SUD,poly(-10,-32,-5,-16,-8,-20,-12,-28));
    fill(C.pink,circ(4,-22,2.2));fill(C.yel,circ(6.5,-22.5,1.8));fill(SUD,rr(1,-21,8,4,1));
    dots(-4,-11,-4,-4,2,1,C.yel);
    // łysa głowa z siwym wieńcem, okulary
    at(-2,-31,0,()=>{
     head(-1,-13,C.skin);fill(C.ear,circ(6,-12,3));
     fill('#cfd2d6',()=>ctx.ellipse(5,-12,6.5,8.5,0,-1.9,1.6));fill('#cfd2d6',ell(-8,-21,3.5,1.6,.3));
     fill(C.skin,poly(-13,-12,-17,-8,-12,-7));
     fill(C.blk,rr(-11,-15,15,1.2,.6));fill(C.blk,circ(-8,-12.5,4));fill(C.blk,circ(-1,-12.5,3.6));
     fill('#cfe6f0',circ(-8,-12.5,3));fill('#cfe6f0',circ(-1,-12.5,2.6));fill(C.blk,circ(-8.8,-12.3,1.1));fill(C.blk,circ(-1.8,-12.3,1));
     fill('#9aa0a8',ell(-9,-5.5,3.6,1.2));
     fill('#3a1a12',ell(-8,-3,2.8,.7+2.6*p.m));
     pin(0,0);});
    arm(-3,-27,armA,{c:SU,len:23,held:stamp},lean);
   },
  });
 },
 komunista(p,st){
  const JK=C.red,JKD=C.dred,lean=p.eat?-.12*(1-p.r):0,flag=st.shield>0;
  const G={x:-20,y:-20},tilt=p.eat?.18*p.r-.7*(1-p.r):.04*p.sw;     // chwyt drzewca i jego pochylenie
  const rot=(x,y)=>({x:G.x+x*Math.cos(tilt)-y*Math.sin(tilt),y:G.y+x*Math.sin(tilt)+y*Math.cos(tilt)});
  const hF=rot(0,-6),hB=rot(0,6),aF=reach(-3,-27,hF.x,hF.y),aB=reach(3,-27,hB.x,hB.y);
  const banner=()=>at(G.x,G.y,tilt,()=>{
   if(!flag){fill('#8a5a30',poly(-1.5,24,1.5,24,1.5,-18,0,-14,-.5,-20,-1.5,-16));fill(C.red,poly(-1.5,-15,-7,-12,-5,-9,-1.5,-11));return;}
   fill('#8a5a30',rr(-1.5,-48,3,74,1));fill(C.yel,circ(0,-49,2.5));
   // transparent z ludowym obszyciem
   fill(C.red,rr(-42,-46,40,27,1));zig(-42,-2,-19,4,8,C.yel,2);fill(C.grn,rr(-42,-46,40,2.5,1));
   flower(-38,-41.5,3,C.yel,C.grn);flower(-6,-41.5,3,C.yel,C.grn);
   ctx.fillStyle=C.wht;ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.font=`900 9px ${FONT}`;ctx.fillText('PLAN',-22,-37);ctx.font=`900 7.2px ${FONT}`;ctx.fillText('5-LETNI',-22,-27);
   pin(0,-44);hit(p,-42,-30);});
  const star=(x,y,r,c)=>fill(c,()=>{for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i&1?r*.42:r;ctx.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q);}ctx.closePath();});
  puppet(p,{lean,stride:.38,
   legB:{c:'#25242c',shoe:C.blk},legF:{c:'#2f2e38',shoe:C.blk,deco:()=>fill(C.blk,rr(-5,LEG-15,10,9,2))},
   back:()=>arm(3,-27,aB.a,{c:JKD,len:aB.len},lean),
   front:()=>{
    // czerwona kurtka z żółtym ząbkowanym obszyciem
    fill(JK,rr(-12,-32,23,32,4));zig(-12,11,0,3,6,C.yel,2);fill(C.blk,rr(-12,-9,23,3.5,1));fill(C.yel,rr(-5,-9.5,4,4.5,1));
    fill(C.yel,poly(-10,-32,-2,-32,-6,-26));dots(-7,-22,-7,-13,3,1,C.yel);star(3,-22,3.2,C.yel);
    at(-2,-31,0,()=>{
     head(-1,-13,C.skin);fill(C.ear,circ(6,-12,3));
     fill('#3d4048',()=>ctx.ellipse(0,-17,12.5,9.5,0,Math.PI,TAU));fill('#3d4048',poly(-12,-17,-20,-15,-12,-14));star(-3,-21,3.6,C.red);
     eye(-7,-12,1);fill(C.blk,poly(-12,-17,-4,-15,-4,-13.5,-11,-15));
     fill(C.skin,poly(-13,-11,-17,-7,-12,-6.5));
     fill('#3a1a12',ell(-8,-3,3,1+3.2*p.m));fill('#4a2a18',ell(-8,-6.5,4,1.3));
     pin(0,0);});
    banner();
    arm(-3,-27,aF.a,{c:JK,len:aF.len},lean);
   },
  });
 }
};
// gwiazdka uderzenia z papieru
const hit=(p,x,y)=>p.eat&&p.r<.1&&burst(x,y);
function burst(x,y){fill(C.yel,()=>{for(let i=0;i<16;i++){const a=i*Math.PI/8,q=i&1?3.5:8;ctx.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q);}ctx.closePath();});fill(C.red,circ(x,y,2.2));}

STYLES.push({id:'wycinanka',name:'Wycinanka ludowa',desc:'Kolorowy papier jak z łowickiej wycinanki, kukiełki na pinezkach.',
 draw(k,x,y,h,st){
  const m=ctx.getTransform(),u=h/100;pxU=Math.hypot(m.a,m.b)*u;
  ctx.translate(x,y);ctx.scale(u,u);
  shadow(false);fill('rgba(30,20,10,.25)',ell(-4,1,28,4.5));
  shadow(true);(F[k]||F.trup)(pose(k,st),st);shadow(false);
 }});
})();
