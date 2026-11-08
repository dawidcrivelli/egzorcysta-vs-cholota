/* Styl „Teatr cieni”: czarne sylwetki jak lalki w teatrze cieni, zimne księżycowe światło na górnych/prawych krawędziach,
   kolorowe świecą tylko znaki rozpoznawcze (oczy, nos, butelka, okulary, pieczątka, transparent, gwiazda).
   Postać rysowana w 3 przebiegach tej samej funkcji: obwódka (przesunięta w górę-prawo), sylwetka, świecące detale. */
(()=>{
const RIM='#cfe4ff',DARK='#141018',FAR='#2b2437',U=100,HS=1.35;   // U: wysokość postaci w jednostkach rysunku, HS: skala głów
const TAU=Math.PI*2,PI=Math.PI,sin=Math.sin,cos=Math.cos,max=Math.max;
let PASS,far=false,PX=1;
const on=()=>PASS!=='glow',G=()=>PASS==='glow';
const col=()=>PASS==='rim'?RIM:far?FAR:DARK;
const farDo=f=>{far=true;f();far=false;};
// kształty sylwetki (w przebiegu „glow” nic nie robią)
function P(...p){if(!on())return;ctx.fillStyle=col();ctx.beginPath();ctx.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)ctx.lineTo(p[i],p[i+1]);ctx.closePath();ctx.fill();}
function E(x,y,rx,ry=rx,r=0){if(!on())return;ctx.fillStyle=col();ctx.beginPath();ctx.ellipse(x,y,rx,ry,r,0,TAU);ctx.fill();}
function L(x1,y1,x2,y2,w){if(!on())return;ctx.strokeStyle=col();ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
const D=(a,l)=>[-sin(a)*l,cos(a)*l];   // kąt od pionu w dół, dodatni = do przodu (w lewo)
function limb(x,y,a1,l1,a2,l2,w1,w2){const[kx,ky]=D(a1,l1),[ex,ey]=D(a2,l2);L(x,y,x+kx,y+ky,w1);L(x+kx,y+ky,x+kx+ex,y+ky+ey,w2);return[x+kx+ex,y+ky+ey];}
const at=(x,y,r,f,s=1)=>{ctx.save();ctx.translate(x,y);ctx.rotate(r);ctx.scale(s,s);f();ctx.restore();};
// świecenie: shadowBlur nie skaluje się z transformacją, więc mnożnik PX
function glow(c,b,f){ctx.save();ctx.shadowColor=c;ctx.shadowBlur=b*PX;f();ctx.restore();}
function dot(x,y,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();}
// otwarcie ust: gadanie, gryzienie albo lekko uchylone
const mouth=(m,st,eat,rest=0)=>st.talk?0.24+0.18*sin(st.t*14):m.eat?eat:rest;
// żuchwa na zawiasie (2,-2) głowy
function jaw(o,pts){at(2,-2,-o,()=>P(...pts.map((v,i)=>v-(i%2?-2:2))));}

/* nogi: chód (fazą), wypad przy ataku albo stanie; biodra tak wysoko, by niższa stopa stała na ziemi.
   Zwraca body(f): rysuj w układzie tułowia (biodro=(0,0), pochylenie), i near(): bliższa noga */
function legs(m,o,lean){
 const sw=a=>[o.A*sin(a),o.B*max(0,cos(a))];
 const pose=m.walk?[sw(m.ph),sw(m.ph+PI)]:m.eat?[[0.42,0.1],[-0.38,0.05]]:[[0.07,0.03],[-0.07,0.03]];
 const pts=pose.map(([a,b])=>{const k=D(a,o.th),e=D(a-b,o.sh);return{a,b,k,e:[k[0]+e[0],k[1]+e[1]]};});
 const hy=-max(pts[0].e[1],pts[1].e[1])-o.foot;
 const draw=(p,x)=>{L(x,hy,x+p.k[0],hy+p.k[1],o.w);L(x+p.k[0],hy+p.k[1],x+p.e[0],hy+p.e[1],o.w*0.85);
  at(x+p.e[0],hy+p.e[1],Math.max(-0.5,Math.min(0.5,(p.b-p.a)*0.35)),o.shoe);
  if(o.stripe&&PASS==='dark'&&!far){ctx.strokeStyle='rgba(205,225,255,.6)';ctx.lineWidth=1.3;ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(x+2.5,hy+2);ctx.lineTo(x+p.k[0]+2.5,hy+p.k[1]);ctx.lineTo(x+p.e[0]+2,hy+p.e[1]-3);ctx.stroke();}};
 farDo(()=>draw(pts[1],2));
 const breath=m.walk||m.eat?0:0.5*sin(m.br);   // oddech w staniu
 return{body:f=>at(0,hy-breath,-lean,f),near:()=>draw(pts[0],-2)};
}

/* ---------- postacie: stopy w (0,0), wysokość U, przód w lewo ---------- */
const CH={
 trup(m,st){
  const sw=m.walk?sin(m.ph):0,lean=m.eat?0.75+0.12*sin(m.pe):0.5+0.05*sin(2*m.ph)+(m.walk?0:0.02*sin(m.br));
  const lg=legs(m,{th:21,sh:21,w:7,A:0.34,B:0.5,foot:3,shoe:()=>P(3,-3,-8,-3,-10,2,4,2)},lean);
  const reach=m.eat?1.55+0.3*sin(m.pe):1.45+0.1*sin(m.ph+1);   // ręce wyciągnięte prawie poziomo
  const claws=(x,y)=>{for(const d of[-0.45,0,0.45]){const[a,b]=D(reach+0.3+d,6.5);L(x,y,x+a,y+b,1.8);}};
  lg.body(()=>farDo(()=>{const[hx,hy]=limb(3,-31,reach+lean+0.1*sw,13,reach+lean+0.2+0.1*sw,12,5.5,4.5);claws(hx,hy);}));
  lg.near();
  lg.body(()=>{
   // poszarpany surdut z garbem
   P(-10,-31,-3,-36,8,-36,12,-25,11,-5,13,9,11,4,8,12,4,6,0,13,-4,6,-8,11,-11,4,-11,-12);
   E(4,-29,7,7,0.3);
   at(-9,-34,0.55+(m.eat?-0.3:0),head,HS);
   const[hx,hy]=limb(-4,-31,reach+lean-0.1*sw,14,reach+lean+0.2-0.1*sw,12,6.5,5.5);
   claws(hx,hy);
  });
  function head(){
   E(-4,-11,9.5,9);P(-11,-14,-14,-8,-12,-5,-12,-3,-4,-1,-2,-6);
   jaw(mouth(m,st,0.1+0.4*max(0,sin(m.pe*2)),0.08),[-12,-2,-11,3,-5,5,3,2,4,-4]);
   for(const a of[-3,1,4])L(a,-19,a+3,-20.5-a*0.15,1.1);   // kępki włosów
   if(G())glow('#d8ff3a',10,()=>{dot(-8,-11,2.3,'#e4ff5a');dot(-12.5,-11.3,1.5,'#c8f03a');dot(-8.4,-11.4,0.8,'#fffbe0');});
  }
 },
 sasiad(m,st){
  const sw=m.walk?sin(m.ph):0,lean=m.eat?0.2+0.12*sin(m.pe):0.04;
  const lg=legs(m,{th:22,sh:21,w:9,A:0.4,B:0.6,foot:4,stripe:true,shoe:()=>P(4,-4,-6,-5,-11,-1,-11,3,5,3)},lean);
  lg.body(()=>farDo(()=>limb(5,-31,-0.4*sw,13,-0.4*sw+0.4,12,6,5)));
  lg.near();
  lg.body(()=>{
   P(-9,-33,9,-34,12,-22,10,0,-6,1,-10,-8);E(-5,-13,12,12);   // podkoszulek z brzuchem
   at(-1,-34,0,head,HS);
   // ramię z butelką; przy ataku zamach nad głową i walnięcie w dół
   const a1=m.eat?1.3+1.5*(0.5+0.5*cos(m.pe)):0.25+0.3*sw,a2=m.eat?a1+0.3:1.45+0.15*sw;
   const[hx,hy]=limb(-3,-30,a1,13,a2,11,7,6);
   at(hx,hy,m.eat?PI+a2:0.15,()=>{P(-3.2,0,3.2,0,3,-11,1.2,-14,1.2,-20,-1.2,-20,-1.2,-14,-3,-11);E(0,1,3.8,2.8);
    if(G())glow('#ffb53a',8,()=>{ctx.fillStyle='rgba(255,190,80,.95)';ctx.fillRect(0.7,-10.5,1.2,8);dot(0,-19,0.9,'#fff2c8');});});
  });
  function head(){
   E(-1,-11,9.5,10);P(-8,-14,-11,-8,-10,-3,0,-2,2,-8);
   jaw(mouth(m,st,0.25),[-10,-3,-9,1,-3,3,4,0,5,-5]);
   P(-15,-6,-7,-6,-4,-2,-7,1,-12,4,-17,3);   // sumiasty wąs
   P(-11,-17,-6,-23,4,-23,10,-17,9,-14,-11,-14,-22,-13,-21,-16);   // czapka z długim daszkiem
   E(-12,-8.5,4.3);   // nochal
   if(G())glow('#ff3a2a',9,()=>{dot(-13,-8.5,3.4,'#e8382c');dot(-14.2,-10,1,'#ffc0a8');});
  }
 },
 urzednik(m,st){
  const sw=m.walk?sin(m.ph):0,lean=m.eat?0.15+0.1*sin(m.pe):0.02,slam=m.eat?max(0,sin(m.pe)):0;
  const lg=legs(m,{th:23,sh:22,w:6.5,A:0.34,B:0.5,foot:3,shoe:()=>P(3,-3,-7,-3,-12,1,4,1)},lean);
  // teczka w tylnej ręce
  lg.body(()=>farDo(()=>{const[hx,hy]=limb(5,-35,-0.3*sw,14,-0.3*sw+0.15,13,5.5,5);P(hx-7,hy+2,hx+8,hy+2,hx+8,hy+12,hx-7,hy+12);L(hx-2,hy+2,hx+3,hy+2,2.5);}));
  lg.near();
  lg.body(()=>{
   P(-12,-38,12,-39,13,-33,9,-12,12,4,-9,4,-10,-12,-13,-31);   // marynarka z wywatowanymi ramionami
   at(-9,-34,0.1+0.25*sw+(m.eat?-0.3:0),()=>P(-1,0,1,0,2,4,0,20,-3,22,-4,18,-2,4));   // fruwający krawat
   at(-1,-38,0,head,HS);
   // pieczątka: niesiona przed sobą, przy ataku uderza w dół
   const a1=m.eat?2.4-1.5*slam:0.9+0.08*sw,a2=m.eat?a1-0.6:2.3+0.05*sw;
   const[hx,hy]=limb(-5,-35,a1,13,a2,11,6,5.5);
   at(hx,hy,lean,()=>{E(0,-7,4.5,4);L(0,-4,0,4,3.5);P(-8,3,8,3,8,9,-8,9);
    if(G())glow('#ff2a2a',8+10*slam,()=>{ctx.fillStyle='#e0262a';ctx.fillRect(-8,8.4,16,2.4);});});
  });
  if(G()&&slam>0.75)glow('#ff2a2a',6,()=>{ctx.fillStyle=`rgba(230,40,40,${(slam-0.75)*4})`;ctx.font=`900 7px ${FONT}`;ctx.textAlign='center';ctx.fillText('ZAMKNIĘTE',-34,4);});
  function head(){
   E(0,-12,9,11);P(-8,-12,-15,-6,-9,-5,-9,-2,0,-1,2,-8);   // jajowata łysina, długi nos
   jaw(mouth(m,st,0.1*slam),[-9,-3,-8,2,-2,3,4,0,5,-6]);
   E(7,-9,3.5,6);   // wianuszek włosów z tyłu
   if(on()){ctx.strokeStyle=col();ctx.lineWidth=1.3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(6,-20);ctx.quadraticCurveTo(-2,-26,-7,-20);ctx.stroke();}   // zaczesana pożyczka
   L(-6,-11,5,-11,1.2);   // zausznik okularów
   if(G())glow('#bfe6ff',8,()=>{ctx.strokeStyle='#e8f6ff';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(-7,-11,3.2,0,TAU);ctx.stroke();dot(-8.2,-12.2,1,'#fff');});
  }
 },
 komunista(m,st){
  const sw=m.walk?sin(m.ph):0,lean=m.eat?0.12+0.1*sin(m.pe):0.05,jab=m.eat?max(0,sin(m.pe)):0;
  const lg=legs(m,{th:21,sh:21,w:8,A:0.4,B:0.55,foot:4,shoe:()=>P(4,-7,-5,-7,-6,-3,-11,-1,-11,3,5,3)},lean);
  lg.body(()=>farDo(()=>{const[hx,hy]=limb(5,-32,-0.45*sw,13,-0.45*sw+0.7,11,6.5,5.5);E(hx,hy,3.5);}));
  lg.near();
  lg.body(()=>{
   P(-11,-34,10,-35,13,-25,11,0,-10,0,-12,-22);   // kurtka
   at(-1,-35,0,head,HS);
   // drzewce trzymane przed sobą z transparentem-tarczą; bez tarczy zostaje złamany kij ze strzępem
   const[hx,hy]=limb(-5,-31,0.9,12,2.0,9,7,6);
   at(hx,hy,lean-0.5*jab-0.04*sw,()=>{
    const top=st.shield>0?-60:-26;
    L(0,22,0,top,2.8);E(0,0,3.6);
    if(st.shield>0){if(G())banner(-58,top+2,57,34,st.t);return;}
    P(-1.5,top,1.5,top,2,top-4,0.5,top-2,-0.5,top-6,-1.2,top-2);
    if(G())glow('#ff3030',6,()=>{ctx.fillStyle='#c8242a';ctx.beginPath();ctx.moveTo(0,top+2);ctx.lineTo(-7,top+4+sin(st.t*3));ctx.lineTo(-4,top+10);ctx.lineTo(0,top+7);ctx.fill();});
   });
  });
  function head(){
   E(0,-11,9.5,10);P(-8,-14,-11,-8,-12,-6,-9,-4,-9,-2,0,-1,2,-8);
   jaw(mouth(m,st,0.25*jab),[-10,-3,-9,2,-3,3,4,0,5,-5]);
   P(-12,-17,-10,-25,8,-26,11,-17,-2,-15,-14,-13,-19,-14);   // czapka z daszkiem
   if(G())glow('#ff2a2a',8,()=>star(-7,-20,3.2));
  }
  function star(x,y,r){ctx.fillStyle='#ff3a30';ctx.beginPath();for(let i=0;i<10;i++){const a=-PI/2+i*PI/5,q=i%2?r*0.42:r;ctx.lineTo(x+cos(a)*q,y+sin(a)*q);}ctx.fill();}
  // falujący czerwony transparent, prawym bokiem na drzewcu (u = odległość od drzewca)
  function banner(x,y,w,h,t){
   const wv=u=>2.2*sin(t*4-u*0.12)*u/w,X=u=>x+w-u;
   glow('rgba(255,40,30,.8)',10,()=>{
    const g=ctx.createLinearGradient(x,y+h,x+w,y);g.addColorStop(0,'#8e1418');g.addColorStop(1,'#e8342e');
    ctx.fillStyle=g;ctx.beginPath();
    for(let u=0;u<=w;u+=3)ctx.lineTo(X(u),y+wv(u));for(let u=w;u>=0;u-=3)ctx.lineTo(X(u),y+h+wv(u));
    ctx.closePath();ctx.fill();});
   ctx.fillStyle=RIM;ctx.fillRect(x+w-16,y-0.6,16,1.2);   // księżyc na górnej krawędzi
   ctx.fillStyle=DARK;ctx.textAlign='center';
   ctx.font=`900 13px ${FONT}`;ctx.fillText('PLAN',x+w/2,y+h*0.44+wv(w/2));
   ctx.font=`900 10px ${FONT}`;ctx.fillText('5-LETNI',x+w/2,y+h*0.82+wv(w/2));
  }
 }
};

STYLES.push({id:'cien',name:'Teatr cieni',desc:'Czarne sylwetki w świetle księżyca; świecą tylko oczy, nosy i czerwień.',
 draw(k,x,y,h,st){
  const s=h/U,m={walk:!!st.walk&&!st.eat,eat:!!st.eat,ph:st.t*TAU/cycleOf(k,st).P,pe:st.t*TAU/cycleOf(k,{eat:true}).P,br:st.t*TAU/3};
  PX=s*(window.DPR||1);
  ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle='rgba(12,8,24,.45)';ctx.beginPath();ctx.ellipse(-2,0,30,5,0,0,TAU);ctx.fill();
  const r=Math.max(1.4/s,0.9);   // grubość obwódki: min. ~1,4 px w skali gry
  for(const[p,d,a]of[['rim',2*r,0.3],['rim',r,1],['dark',0,1],['glow',0,1]]){
   PASS=p;ctx.save();ctx.globalAlpha=a;ctx.translate(d,-d);CH[k](m,st);ctx.restore();}
 }});
})();
