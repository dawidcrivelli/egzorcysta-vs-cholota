/* Styl „Odnowa”: kontur i cieniowanie jak w grze (chain, fs, dwa tony), ale nowe figury:
   krępe proporcje, duża głowa (~1/3 wzrostu), ciało i twarz w 3/4 w lewo – oboje oczu po jednej stronie nosa,
   bliższe oko większe, dalsze mniejsze przy konturze, ucho z prawej.
   Jednostki: 100 = wzrost, ziemia y=0, twarz w lewo (-x). Kąty jak w grze: 0 = w dół, + = do przodu. */
(()=>{
const PI=Math.PI;
const rotp=(p,a)=>{const c=Math.cos(a),s=Math.sin(a);return[p[0]*c+p[1]*s,-p[0]*s+p[1]*c];};   // to samo co ctx.rotate(-a)
const ell=(x,y,rx,ry,c,a)=>{ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,a||0,0,7);ctx.fill();};
const oell=(x,y,rx,ry,c,w,a)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,a||0,0,7);fs(c,w);};
const dot=(x,y,r,c)=>ell(x,y,r,r,c);
const curve=(a,b,c,col,w)=>{ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.quadraticCurveTo(b[0],b[1],c[0],c[1]);sk(col,w);};

/* ---------- szkielet ---------- */
function solve(c,P){
 const [L1,L2]=c.leg,[A1,A2]=c.arm,T=c.T;
 const legs=P.legs.map((g,i)=>{const hp=[c.hipX[i],0],kn=add(hp,dir(g.th,L1)),an=add(kn,dir(g.th-g.kn,L2));return{hp,kn,an};});
 let low=-99;for(const L of legs)low=Math.max(low,L.an[1]);
 const shL=[[-T.sw*0.45,-T.h+3.5],[T.sw*0.55,-T.h+4]];
 const arms=P.arms.map((g,i)=>{const s=rotp(shL[i],P.lean),el=add(s,dir(P.lean+g.sh,A1)),wr=add(el,dir(P.lean+g.sh+g.el,A2));return{sh:s,el,wr};});
 const neck=rotp([-1,-T.h],P.lean),hr=P.lean*0.55+(P.tilt||0),hc=add(neck,rotp([-1,-c.R*0.86],hr));
 return{legs,arms,neck,hc,hr,lean:P.lean,shift:-(low+4.6)};
}
function shoe(col,far,bare,skin){
 const c=far?tint(bare?skin:col,0.8):(bare?skin:col);
 ctx.beginPath();ctx.moveTo(3.6,-3.2);ctx.lineTo(4,4.6);ctx.lineTo(-10.5,4.6);ctx.quadraticCurveTo(-14,4.6,-13.4,1);ctx.quadraticCurveTo(-12.4,-2.6,-5,-3.6);ctx.closePath();fs(c);
 if(bare){for(const x of [-12.6,-10.4,-8.4])ln(x,4.4,x+0.6,2.6,tint(skin,0.6),0.5);}
 else{ctx.save();ctx.clip();ctx.fillStyle=tint(c,0.6);ctx.fillRect(-15,3.2,20,2);ctx.fillStyle='rgba(255,255,255,.22)';ctx.beginPath();ctx.ellipse(-8,-0.6,3,1,-0.2,0,7);ctx.fill();ctx.restore();}
}
function leg(c,L,far){
 chain([L.hp,L.kn,L.an],c.legW,c.pants,far);
 if(c.stripe)ln(lp(L.hp,L.kn,0.15)[0]-2.6,lp(L.hp,L.kn,0.15)[1],L.an[0]-2,L.an[1]-3,far?tint(c.stripe,0.8):c.stripe,1.6);
 if(c.boot)chain([lp(L.kn,L.an,0.15),L.an],[c.legW[1]+2,c.legW[2]+1.6],c.boot,far);
 const bare=c.bareNear&&!far;
 if(bare){const a=lp(L.kn,L.an,0.45);chain([a,L.an],[c.legW[2]*0.8,c.legW[2]*0.75],c.skin,far);
  const d=[L.an[0]-L.kn[0],L.an[1]-L.kn[1]],n=Math.hypot(d[0],d[1]),nx=-d[1]/n,ny=d[0]/n,w=c.legW[1]/2+0.6;
  ctx.beginPath();ctx.moveTo(a[0]+nx*w,a[1]+ny*w);for(let i=1;i<6;i++){const q=lp([a[0]+nx*w,a[1]+ny*w],[a[0]-nx*w,a[1]-ny*w],i/6);ctx.lineTo(q[0]+(i%2?d[0]/n*2.4:0),q[1]+(i%2?d[1]/n*2.4:0));}ctx.lineTo(a[0]-nx*w,a[1]-ny*w);
  ctx.fillStyle=far?tint(c.pants,0.8):c.pants;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW*0.8;ctx.stroke();}
 ctx.save();ctx.translate(L.an[0],L.an[1]);shoe(c.shoe,far,bare,c.skin);ctx.restore();
}
function arm(c,A,far,hold){
 chain([A.sh,A.el,A.wr],c.armW,c.sleeve,far);
 if(c.cuff)chain([lp(A.el,A.wr,0.8),A.wr],[c.armW[2]+0.6,c.armW[2]+0.6],c.cuff,far);
 const d=[A.wr[0]-A.el[0],A.wr[1]-A.el[1]],ang=Math.atan2(d[1],d[0])-PI/2,pw=OLW,S=1.9;
 ctx.save();ctx.translate(A.wr[0],A.wr[1]);ctx.rotate(ang);ctx.scale(S,S);OLW=pw/S;
 if(hold&&hold.behind)hold.fn(far,ang);
 ctx.beginPath();ctx.ellipse(0,3,3.5,3.9,0,0,7);fs(far?tint(c.skin,0.8):c.skin);
 ctx.beginPath();ctx.ellipse(-2.6,2,1.3,2,0.5,0,7);fs(far?tint(c.skin,0.72):tint(c.skin,0.9),OLW*0.7);   // kciuk
 if(hold&&!hold.behind)hold.fn(far,ang);
 OLW=pw;ctx.restore();
}
function torsoPath(T){const {h,sw,hw,belly,sk}=T;
 ctx.beginPath();ctx.moveTo(-hw,sk);ctx.bezierCurveTo(-hw-belly,sk-h*0.4,-sw-1.5,-h*0.72,-sw,-h+3);ctx.quadraticCurveTo(-sw+1,-h-0.8,-sw*0.3,-h);
 ctx.lineTo(sw*0.4,-h);ctx.quadraticCurveTo(sw+1,-h-0.6,sw,-h+3);ctx.bezierCurveTo(sw+1.5,-h*0.6,hw+1.2,-h*0.2,hw,sk);ctx.closePath();}
function torso(c,J,t){const T=c.T;
 ctx.save();ctx.rotate(-J.lean);
 torsoPath(T);ctx.fillStyle=c.coat;ctx.fill();
 ctx.save();torsoPath(T);ctx.clip();
 if(c.torsoFx)c.torsoFx(T,t);
 ctx.fillStyle='rgba(30,15,5,.26)';ctx.beginPath();ctx.moveTo(T.sw*0.3,-T.h-2);ctx.quadraticCurveTo(T.sw*0.75,-T.h*0.5,T.hw*0.35,T.sk+2);ctx.lineTo(40,T.sk+2);ctx.lineTo(40,-T.h-2);ctx.fill();
 ctx.restore();
 torsoPath(T);ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.lineJoin='round';ctx.stroke();
 if(c.torsoOver)c.torsoOver(T,t);
 ctx.restore();
}
/* twarz 3/4: oś twarzy przesunięta w lewo; bliższe oko (prawe na ekranie) większe, dalsze mniejsze przy konturze */
const F={far:[-0.64,-0.06],near:[-0.1,-0.06],nose:[-0.56,0.16],mouth:[-0.38,0.5],ear:[0.68,0.1]};
function eyes(R,o){
 for(const [k,s] of [['far',0.78],['near',1]]){
  const x=F[k][0]*R,y=F[k][1]*R+(o.dy||0)*R,rx=(o.rx||0.15)*R*s,ry=(o.ry||0.19)*R*(o.lid||1);
  if(o.socket)ell(x,y,rx*1.6,ry*1.45+R*0.04,o.socket);
  if(o.glow){ctx.save();ctx.shadowColor=o.glow;ctx.shadowBlur=R*0.35;}
  oell(x,y,rx,Math.max(ry,0.3),o.white||'#fbf6ea',OLW*0.8);
  if(o.glow)ctx.restore();
  if(ry>0.6)dot(x-R*0.045*s,y+R*0.01,(o.pr||0.07)*R*s*Math.min(1,o.lid||1),o.pupil||'#1c140e');
  if(o.lid&&o.lid<1){ln(x-rx*1.15,y-ry,x+rx*1.15,y-ry-0.3,OL,OLW*0.9);}
 }
}
function head(c,J,t,st){const R=c.R;
 ctx.save();ctx.translate(J.hc[0],J.hc[1]);ctx.rotate(-J.hr);
 if(c.headBack)c.headBack(R,t,st);
 const path=c.headPath||(()=>{ctx.beginPath();ctx.ellipse(0,0,R*0.95,R,0,0,7);});
 path();ctx.fillStyle=c.skin;ctx.fill();
 ctx.save();path();ctx.clip();
 ctx.fillStyle=tint(c.skin,0.8);ctx.beginPath();ctx.moveTo(R*0.22,-R*1.2);ctx.quadraticCurveTo(R*0.02,0,R*0.3,R*1.2);ctx.lineTo(R*1.2,R*1.2);ctx.lineTo(R*1.2,-R*1.2);ctx.fill();
 ell(-R*0.78,R*0.28,R*0.16,R*0.1,'rgba(220,90,70,.25)');   // rumieniec na dalszym policzku
 if(c.faceFx)c.faceFx(R,t,st);
 ctx.restore();
 path();ctx.strokeStyle=OL;ctx.lineWidth=OLW*1.1;ctx.stroke();
 // ucho
 const [ex,ey]=[F.ear[0]*R,F.ear[1]*R];oell(ex,ey,R*0.15,R*0.21,tint(c.skin,0.88),OLW*0.9);curve([ex-R*0.04,ey-R*0.1],[ex+R*0.06,ey],[ex-R*0.03,ey+R*0.1],tint(c.skin,0.55),R*0.035);
 c.face(R,t,st);
 if(c.hat)c.hat(R,t,st);
 ctx.restore();
}
function figure(c,P,t,st){
 const J=solve(c,P);
 ctx.fillStyle='rgba(0,0,0,.38)';ctx.beginPath();ctx.ellipse(-2,0,c.shadow||30,5,0,0,7);ctx.fill();
 ctx.save();ctx.translate(0,J.shift);
 if(c.back)c.back(J,t,st);
 arm(c,J.arms[1],true,c.holdFar);
 leg(c,J.legs[1],true);
 leg(c,J.legs[0],false);
 chain([J.neck,add(J.neck,rotp([0,-6],J.hr))],[c.neckW||9,c.neckW||9],c.skin);
 torso(c,J,t);
 if(c.collar)c.collar(J,t,st);
 head(c,J,t,st);
 arm(c,J.arms[0],false,c.holdNear);
 if(c.front)c.front(J,t,st);
 ctx.restore();
}

/* ---------- pozy ---------- */
function walk(t,sp,amp,lean){
 const ph=t*sp;
 return{ph,lean,tilt:0,
  legs:[0,PI].map(o=>{const p=ph+o;return{th:amp*Math.sin(p),kn:0.1+0.85*Math.pow(Math.max(0,Math.sin(p+1.85)),1.4)};}),
  arms:[PI,0].map(o=>{const p=ph+o;return{sh:0.8*amp*Math.sin(p),el:0.3+0.3*Math.max(0,Math.sin(p))};})};
}
const stand=(t,lean)=>({ph:0,lean:lean||0.04,tilt:0,legs:[{th:0.16,kn:0.06},{th:-0.12,kn:0.08}],arms:[{sh:0.12+0.04*Math.sin(t*2),el:0.3},{sh:0.08,el:0.3}]});
function pose(k,st){
 if(ODN.P[k])return ODN.P[k](st);
 const t=st.t||0,sp=16*(st.sp||0.22),eat=st.eat,idle=!st.walk&&!eat,s=Math.max(0,Math.sin(t*9));
 let p;
 if(k==='trup'){
  const ph=t*sp*0.9;
  p=idle?stand(t,0.26):{ph,lean:0.36+0.04*Math.sin(ph*2),tilt:0.18+0.08*Math.sin(ph*0.7),
   legs:[{th:0.36*Math.sin(ph),kn:0.1+0.6*Math.pow(Math.max(0,Math.sin(ph+1.85)),1.4)},{th:0.16*Math.sin(ph+PI)-0.12,kn:0.3}]};
  p.arms=[{sh:1.3+0.1*Math.sin(t*2.6),el:0.12+0.08*Math.sin(t*2)},{sh:1.15+0.1*Math.sin(t*2.6+1),el:0.3}];
  if(eat){p.lean=0.5;p.tilt=0.3+0.15*Math.sin(t*10);p.arms=[{sh:1.0+0.3*Math.sin(t*10),el:0.5},{sh:0.9+0.3*Math.sin(t*10+1.5),el:0.6}];p.legs=[{th:0.3,kn:0.25},{th:-0.22,kn:0.3}];}
  return p;
 }
 p=idle?stand(t):walk(t,sp,k==='komunista'?0.46:k==='urzednik'?0.28:0.32,k==='sasiad'?-0.05:k==='komunista'?0.08:0.04);
 if(eat){p.lean=0.16;p.legs=[{th:0.3,kn:0.15},{th:-0.22,kn:0.12}];}
 if(k==='sasiad'){p.arms[0]=eat?{sh:0.3+1.8*s,el:0.9-0.6*s}:st.talk?{sh:1.3+0.2*Math.sin(t*6),el:1.0}:{sh:0.55,el:1.25};}
 if(k==='urzednik'){p.arms[0]=eat?{sh:0.5+1.5*s,el:0.9-0.5*s}:{sh:0.75+0.08*Math.sin((p.ph||t)*2),el:1.25};p.arms[1]={sh:p.arms[1].sh*0.3,el:0.1};}
 if(k==='komunista'){
  if(st.shield>0)p.arms[0]=eat?{sh:0.75+0.3*s,el:1.1}:{sh:0.75,el:1.1};
  else if(st.talk||eat)p.arms[0]={sh:2.5-0.6*(eat?s:Math.abs(Math.sin(t*5))),el:0.45};
 }
 return p;
}

/* ---------- rekwizyty (w układzie dłoni gry: +y wzdłuż przedramienia) ---------- */
function claws(col){return function(far){const c=far?tint(col,0.8):col;
 for(const [x,a] of [[-1.8,0.3],[0,0],[1.8,-0.3]]){ctx.save();ctx.translate(x,5.8);ctx.rotate(a);ln(0,0,0,4.2,OL,2.4);ln(0,0,0,4.2,c,1.3);Pth([[-0.6,4],[0.6,4],[0,6]]);fs('#e8e0c0',OLW*0.4);ctx.restore();}};}
function holdGasior(far,ang){ctx.save();ctx.translate(0,4);ctx.rotate(-ang);ctx.scale(0.95,0.95);
 const body=()=>{ctx.beginPath();ctx.moveTo(-1.6,-9);ctx.lineTo(-1.6,-6);ctx.bezierCurveTo(-7,-5,-7,7,-4.6,8);ctx.lineTo(4.6,8);ctx.bezierCurveTo(7,7,7,-5,1.6,-6);ctx.lineTo(1.6,-9);ctx.closePath();};
 body();fs('rgba(200,230,215,.92)',OLW*0.8);
 ctx.save();body();ctx.clip();ctx.fillStyle='rgba(232,196,90,.88)';ctx.fillRect(-8,-1,16,10);ctx.restore();
 Pth([[-4.2,0],[4.2,0],[4,4.8],[-4,4.8]]);fs('#efe2bc',OLW*0.5);
 ctx.font='900 3.6px '+FONT;ctx.textAlign='center';ctx.fillStyle='#8a1a12';ctx.fillText('XXX',0,3.8);
 ctx.fillStyle='rgba(255,255,255,.6)';ctx.fillRect(-4.6,-4,0.8,7);
 Pth([[-1.8,-9],[1.8,-9],[1.8,-11.2],[-1.8,-11.2]]);fs('#c8b48a',OLW*0.6);ctx.restore();}
function holdBanner(far,ang){if(!(CS.shield>0))return;const t=CS.t||0;ctx.save();ctx.translate(0,3);ctx.rotate(-ang);ctx.scale(0.62,0.62);
 Pth([[-1.6,10],[1.6,10],[1.6,-62],[-1.6,-62]]);fs('#7a5232');ctx.beginPath();ctx.arc(0,-64,2.6,0,7);fs('#d4af37');
 const w=x=>Math.sin(t*5+x*0.12)*2.2*(-x/50),top=[],bot=[];
 for(let x=-2;x>=-62;x-=5){top.push([x,-60+w(x)]);bot.unshift([x,-28+w(x)+(x<-50?(x+50)*0.08:0)]);}
 Pth(top.concat(bot));fs('#c42a20');
 ctx.save();Pth(top.concat(bot));ctx.clip();for(let x=-62;x<0;x+=10){ctx.fillStyle='rgba(0,0,0,'+(0.08+0.07*Math.sin(t*5+x*0.12))+')';ctx.fillRect(x,-64,5,40);}ctx.restore();
 ctx.save();ctx.translate(-13,-51+w(-13));ctx.scale(0.8,0.8);
 ctx.beginPath();ctx.arc(0.6,0,5.6,-0.9,2.6);sk('#ffd34a',2.2);ln(-4,3.4,-6.4,6.6,'#ffd34a',2.4);
 ln(-4,-4,4.4,4.4,'#ffd34a',1.8);Pth([[-6.6,-3.4],[-3.4,-6.6],[-1.4,-4.6],[-4.6,-1.4]]);ctx.fillStyle='#ffd34a';ctx.fill();ctx.restore();
 ctx.font='900 8px '+FONT;ctx.textAlign='center';ctx.fillStyle='#fff6dc';ctx.fillText('PLAN',-41,-45+w(-41));ctx.fillText('5-LETNI',-41,-34+w(-41));
 ctx.restore();}

const C={};
/* ---------- Trup: chudy, zgarbiony, łysy, długie ręce, świecące oczy ---------- */
C.trup={R:17.5,leg:[15.5,15],legW:[10,8.2,7],arm:[14.5,14],armW:[8.6,7.4,6.4],hipX:[-3,4],neckW:7.5,
 T:{h:27,sw:11,hw:9,belly:1,sk:4},skin:'#9db07a',pants:'#54493a',coat:'#6e4c2e',sleeve:'#6e4c2e',shoe:'#2c2622',bareNear:true,cuff:null,
 holdNear:{fn:claws('#9db07a')},holdFar:{fn:claws('#9db07a')},
 torsoFx(T){
  Pth([[-14,-27],[-4.6,-27.6],[-3,-14],[-5,-6],[-3.6,6],[-14,6]]);fs('#c9bc94',0);
  ln(-8,-25,-6.6,-8,'#6a1a16',1.5);ell(-9,-4,2.4,1.6,'rgba(90,70,40,.5)');
  ln(-4.6,-27.6,-3,-14,tint('#6e4c2e',0.55),0.9);ln(-3,-14,-5,-6,tint('#6e4c2e',0.55),0.9);
  Pth([[0,-20],[4,-21],[5.4,-15],[3.4,-10.6],[0.4,-12],[1,-16]]);fs('#1b1914',OLW*0.6);
  ctx.strokeStyle='#ddd5b8';ctx.lineWidth=0.8;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(0.6,-19+i*2.6);ctx.quadraticCurveTo(2.8,-20+i*2.6,4.6,-18.2+i*2.6);ctx.stroke();}
  Pth([[2,-6],[7.6,-6.6],[8,-1],[2.4,-0.6]]);fs('#8a7a50',OLW*0.5);ctx.strokeStyle='#eadfb4';ctx.lineWidth=0.4;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(2.4+i*1.3,-6.8);ctx.lineTo(2.8+i*1.3,-5.4);ctx.stroke();}},
 torsoOver(T){ // postrzępiony dół marynarki i kołnierz
  const p=[[-T.hw,T.sk-1]];for(let i=0;i<=8;i++){const x=-T.hw+i*(2*T.hw/8);p.push([x,T.sk+(i%2?4.5:0.5)]);}p.push([T.hw,T.sk-1]);Pth(p);fs('#6e4c2e',OLW*0.7);
  Pth([[-7,-27.4],[-1,-30],[6,-27.6],[4.6,-24.6],[1,-26.6],[-2,-25],[-5.4,-25.6]]);fs('#5a3c22',OLW*0.7);},
 headPath:null,
 headBack(R){},
 faceFx(R){ell(-R*0.4,R*0.05,R*0.62,R*0.32,'rgba(40,55,25,.28)');ell(R*0.1,R*0.42,R*0.3,R*0.2,'rgba(40,55,25,.3)');ell(-R*0.2,-R*0.6,R*0.2,R*0.12,'rgba(70,90,50,.6)');},
 face(R,t,st){const j=0.5+0.5*Math.sin(t*3)+(st.eat?0.6*Math.abs(Math.sin(t*10)):0);
  eyes(R,{rx:0.17,ry:0.2,white:'#f2f08a',glow:'rgba(240,250,110,.95)',socket:'rgba(30,40,20,.55)',pr:0.05,pupil:'#3a1010'});
  ln(-R*0.86,-R*0.32,-R*0.5,-R*0.26,'#2e3622',R*0.06);ln(-R*0.26,-R*0.3,R*0.08,-R*0.36,'#2e3622',R*0.06);
  // nos: zapadnięty, z dziurką
  ctx.beginPath();ctx.moveTo(-R*0.5,-R*0.02);ctx.quadraticCurveTo(-R*0.78,R*0.2,-R*0.56,R*0.26);ctx.lineTo(-R*0.4,R*0.22);fs('#8a9e68',OLW*0.8);dot(-R*0.52,R*0.2,R*0.035,'#1b1914');
  // rozdziawiona paszcza
  const my=R*0.52,mh=R*(0.13+0.1*j);
  ctx.beginPath();ctx.ellipse(-R*0.36,my,R*0.27,mh,0.08,0,7);fs('#2a0e0c',OLW*0.8);
  ell(-R*0.34,my+mh*0.5,R*0.15,mh*0.35,'#7a2a26');
  ctx.fillStyle='#ece4c4';for(const [x,w,h] of [[-0.58,0.1,0.12],[-0.46,0.09,0.08],[-0.34,0.1,0.14],[-0.2,0.08,0.07]])Pth([[x*R,my-mh*0.9],[(x+w)*R,my-mh*0.85],[(x+w/2)*R,my-mh*0.9+h*R]]),ctx.fill();
  for(const x of [-0.5,-0.28])Pth([[x*R,my+mh*0.9],[(x+0.09)*R,my+mh*0.85],[(x+0.045)*R,my+mh*0.9-0.1*R]]),ctx.fill();
  // szwy, kępki włosów, nadgryzione ucho
  ln(R*0.05,-R*0.8,R*0.6,-R*0.5,'#3a2a20',R*0.03);for(let i=0;i<4;i++){const q=lp([R*0.05,-R*0.8],[R*0.6,-R*0.5],(i+0.5)/4);ln(q[0]-R*0.04,q[1]-R*0.07,q[0]+R*0.04,q[1]+R*0.07,'#3a2a20',R*0.025);}
  ctx.strokeStyle='#2a2a22';ctx.lineWidth=R*0.03;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-R*0.3+i*R*0.16,-R*0.97);ctx.quadraticCurveTo(-R*0.2+i*R*0.2,-R*1.3,R*0.05+i*R*0.18,-R*1.18+Math.sin(t*2+i)*R*0.06);ctx.stroke();}
  Pth([[R*0.74,-R*0.08],[R*0.86,R*0.02],[R*0.76,R*0.1]]);fs('#1b1914',0);}
};

/* ---------- Sąsiad: przysadzisty, brzuch, kaszkiet w kratkę, wąsy i czerwony nos ---------- */
C.sasiad={R:19.5,leg:[13,12.5],legW:[11,9.4,8],arm:[13,12.5],armW:[9.4,8.2,7.2],hipX:[-4,4.5],neckW:10,shadow:32,
 T:{h:28,sw:12,hw:12.5,belly:8,sk:1},skin:'#eaa984',pants:'#2f4f9a',stripe:'#f0f0f0',coat:'#efece2',sleeve:'#eaa984',shoe:'#ececec',
 holdNear:{fn:holdGasior},
 torsoFx(T){
  // brzuch wystaje spod podkoszulka, gumka od dresu
  ctx.beginPath();ctx.moveTo(-30,-7.5);ctx.quadraticCurveTo(-4,-10,30,-5.6);ctx.lineTo(30,10);ctx.lineTo(-30,10);ctx.fillStyle='#eaa984';ctx.fill();
  ctx.beginPath();ctx.moveTo(-30,-7.5);ctx.quadraticCurveTo(-4,-10,30,-5.6);sk(OL,OLW*0.8);
  curve([-10,-4],[-11.2,-3.2],[-10.4,-2.2],tint('#eaa984',0.55),0.8);
  ctx.fillStyle='#2f4f9a';ctx.fillRect(-30,-1.4,60,12);ln(-30,-1.4,30,-1.4,OL,OLW*0.7);ln(-15,0.4,-15,8,'#f0f0f0',1.4);
  // plamy, owłosiony dekolt
  ell(-8,-17,2.4,1.6,'rgba(180,150,60,.4)');ell(-3,-25,1.4,1,'rgba(180,150,60,.35)');
  ctx.beginPath();ctx.moveTo(-10,-31);ctx.quadraticCurveTo(-4,-23,2,-31);ctx.fillStyle='#eaa984';ctx.fill();ctx.beginPath();ctx.moveTo(-10,-31);ctx.quadraticCurveTo(-4,-23,2,-31);sk(OL,OLW*0.6);
  for(const x of [-6,-4.4,-2.8])ln(x,-29,x+0.4,-26.4,'#4a2a18',0.5);
  // kamizelka w jodełkę, rozpięta: prawy płat i wąski lewy
  for(const V of [[[1.6,-32],[16,-30],[16,-6],[3.4,-7.6],[1.2,-18]],[[-16,-28],[-11,-30],[-10.4,-17],[-12,-9],[-16,-9]]]){
   Pth(V);ctx.fillStyle='#6a5a3a';ctx.fill();ctx.save();Pth(V);ctx.clip();ctx.strokeStyle='#57482d';ctx.lineWidth=0.6;for(let y=-34;y<0;y+=2.2){ctx.beginPath();ctx.moveTo(-17,y);ctx.lineTo(17,y+2);ctx.stroke();}ctx.restore();Pth(V);ctx.strokeStyle=OL;ctx.lineWidth=OLW*0.8;ctx.stroke();}
  for(const y of [-24,-17,-11])dot(2.4,y,0.8,'#2a2018');},
 face(R,t,st){
  eyes(R,{rx:0.15,ry:0.2,lid:0.55+0.15*Math.sin(t*1.3)});
  Pth([[-R*0.88,-R*0.32],[-R*0.48,-R*0.42],[-R*0.42,-R*0.3],[-R*0.84,-R*0.22]]);fs('#3a2618',OLW*0.5);
  Pth([[-R*0.32,-R*0.38],[R*0.12,-R*0.46],[R*0.16,-R*0.33],[-R*0.3,-R*0.27]]);fs('#3a2618',OLW*0.5);
  // nos-kartofel
  oell(-R*0.66,R*0.15,R*0.25,R*0.21,'#d9665a',OLW*0.9);ell(-R*0.74,R*0.08,R*0.07,R*0.045,'rgba(255,255,255,.55)');
  // uśmieszek, sumiaste wąsy, zarost
  curve([-R*0.62,R*0.58],[-R*0.36,R*0.7],[-R*0.06,R*0.52],'#4a1a14',R*0.05);
  Pth([[-R*1.0,R*0.48],[-R*0.82,R*0.32],[-R*0.5,R*0.32],[-R*0.12,R*0.34],[R*0.08,R*0.5],[-R*0.12,R*0.46],[-R*0.42,R*0.46],[-R*0.72,R*0.5]]);fs('#4a3020',OLW*0.7);
  ln(-R*0.7,R*0.38,-R*0.5,R*0.44,'#6e4c32',R*0.03);ln(-R*0.3,R*0.38,-R*0.1,R*0.44,'#6e4c32',R*0.03);
  ctx.fillStyle='rgba(50,30,20,.5)';for(const [x,y] of [[-0.5,0.78],[-0.3,0.82],[-0.1,0.74],[0.1,0.66],[-0.2,0.66],[0.3,0.5],[0.3,0.68],[-0.62,0.72]])ctx.fillRect(x*R,y*R,R*0.03,R*0.03);
  Pth([[R*0.42,-R*0.45],[R*0.62,-R*0.4],[R*0.56,-R*0.05],[R*0.44,-R*0.15]]);fs('#4a3020',0);},
 hat(R){ // kaszkiet w kratkę, daszek w lewo
  const P=()=>{ctx.beginPath();ctx.moveTo(R*0.98,-R*0.32);ctx.quadraticCurveTo(R*1.05,-R*1.0,R*0.1,-R*1.12);ctx.quadraticCurveTo(-R*0.7,-R*1.1,-R*0.9,-R*0.62);ctx.lineTo(-R*1.38,-R*0.5);ctx.quadraticCurveTo(-R*1.42,-R*0.38,-R*1.24,-R*0.36);ctx.lineTo(-R*0.62,-R*0.44);ctx.quadraticCurveTo(R*0.2,-R*0.5,R*0.98,-R*0.32);ctx.closePath();};
  P();ctx.fillStyle='#7a6a58';ctx.fill();ctx.save();P();ctx.clip();ctx.strokeStyle='#5e5040';ctx.lineWidth=R*0.03;
  for(let x=-1.5;x<1.2;x+=0.14){ctx.beginPath();ctx.moveTo(x*R,-R*1.2);ctx.lineTo(x*R+R*0.1,-R*0.3);ctx.stroke();}for(let y=-1.15;y<-0.3;y+=0.13){ctx.beginPath();ctx.moveTo(-R*1.5,y*R);ctx.lineTo(R*1.1,y*R+R*0.06);ctx.stroke();}
  ctx.fillStyle='rgba(30,15,5,.3)';ctx.fillRect(R*0.3,-R*1.2,R,R);ctx.restore();P();ctx.strokeStyle=OL;ctx.lineWidth=OLW*1.1;ctx.stroke();
  curve([-R*1.3,-R*0.42],[-R*1.0,-R*0.52],[-R*0.62,-R*0.47],'#3e3428',R*0.05);dot(R*0.08,-R*1.1,R*0.07,'#5e5040');}
};

/* ---------- Urzędnik: gruszka, wąskie barki, szerokie biodra, łysina, okulary na oboje oczu ---------- */
C.urzednik={R:19,leg:[13.5,13],legW:[10.4,8.8,7.6],arm:[12,12],armW:[8.6,7.6,6.8],hipX:[-4,5],neckW:9,
 T:{h:27,sw:8.5,hw:12.5,belly:4.5,sk:7},skin:'#edc29e',pants:'#4e4030',coat:'#6a5640',sleeve:'#6a5640',shoe:'#18161a',cuff:'#ece8de',
 holdNear:{fn:holdStamp},holdFar:{fn:holdTeczka},
 torsoFx(T){
  Pth([[-9,-28.6],[-1,-28.6],[-4.6,-12]]);fs('#ece8de',0);
  Pth([[-5.8,-27.6],[-3.6,-27.6],[-3.4,-14],[-4.6,-12],[-5.8,-14]]);fs('#a4241c',OLW*0.5);ln(-5.6,-23,-3.6,-24,'#d84a3a',0.6);ln(-5.6,-19,-3.6,-20,'#d84a3a',0.6);
  Pth([[-1,-28.6],[2.4,-29],[0,-20],[-4.6,-12]]);fs(tint('#6a5640',0.85),OLW*0.6);Pth([[-9,-28.6],[-11.4,-24],[-4.6,-12]]);fs(tint('#6a5640',0.85),OLW*0.6);
  Pth([[-9.4,-23],[-8.4,-21.2],[-6.6,-21.2],[-8,-20],[-7.4,-18.2],[-9.4,-19.4],[-11.2,-18.2],[-10.6,-20],[-12,-21.2],[-10.2,-21.2]]);fs('#d4281e',OLW*0.4);
  Pth([[2,-18],[8,-18.6],[8,-16.2],[2,-15.6]]);fs(tint('#6a5640',0.8),OLW*0.5);ln(3.6,-18.2,3.8,-21.6,'#2a4fa0',1.1);ln(5.6,-18.4,5.8,-21,'#c42a20',1.1);
  for(const y of [-9,-3])dot(-4.4,y,0.9,'#2a1a10');ln(-4.6,-12,-5,8,tint('#6a5640',0.6),0.8);},
 headPath:null,
 headBack(R){oell(-R*0.32,R*0.92,R*0.5,R*0.24,tint('#edc29e',0.9),OLW);},   // podwójny podbródek
 faceFx(R){ell(-R*0.25,-R*0.62,R*0.32,R*0.14,'rgba(255,255,255,.5)',-0.25);},
 face(R,t){const bl=(t%3.4)<0.12;
  eyes(R,{rx:0.12,ry:0.15,lid:bl?0.1:1});
  // okulary: bliższe szkło okrągłe, dalsze zwężone
  ctx.fillStyle='rgba(200,230,255,.25)';ctx.strokeStyle=OL;ctx.lineWidth=R*0.07;
  for(const [k,s] of [['far',0.72],['near',1]]){ctx.beginPath();ctx.ellipse(F[k][0]*R,F[k][1]*R,R*0.27*s,R*0.27,0,0,7);ctx.fill();ctx.stroke();}
  ln(-R*0.45,-R*0.1,-R*0.37,-R*0.1,OL,R*0.07);ln(R*0.17,-R*0.1,R*0.6,-R*0.02,OL,R*0.06);
  ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=R*0.04;ctx.beginPath();ctx.arc(-R*0.1,-R*0.06,R*0.19,3.5,4.4);ctx.stroke();
  ln(-R*0.86,-R*0.42,-R*0.5,-R*0.36,'#5a5048',R*0.07);ln(-R*0.3,-R*0.36,R*0.12,-R*0.44,'#5a5048',R*0.07);
  oell(-R*0.6,R*0.2,R*0.17,R*0.15,'#e2a888',OLW*0.8);
  Pth([[-R*0.72,R*0.34],[-R*0.42,R*0.32],[-R*0.12,R*0.36],[-R*0.22,R*0.44],[-R*0.66,R*0.44]]);fs('#4a4038',OLW*0.5);
  curve([-R*0.6,R*0.62],[-R*0.38,R*0.52],[-R*0.14,R*0.64],'#7a3a2a',R*0.05);
  // siwe boki, zaczeska, pot
  Pth([[R*0.4,-R*0.5],[R*0.9,-R*0.3],[R*0.94,R*0.1],[R*0.82,-R*0.04],[R*0.48,-R*0.26]]);fs('#9a948a',OLW*0.6);
  ctx.strokeStyle='#5a5048';ctx.lineWidth=R*0.035;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(R*0.5,-R*(0.6+i*0.1));ctx.quadraticCurveTo(R*0.0,-R*(1.08+i*0.02),-R*(0.6-i*0.05),-R*(0.82+i*0.06));ctx.stroke();}
  const d=(t*0.8)%1;ctx.fillStyle='rgba(170,215,255,'+(1-d)+')';ctx.beginPath();ctx.ellipse(R*0.3,-R*0.6+d*R*0.5,R*0.04,R*0.06,0,0,7);ctx.fill();}
};

/* ---------- Komunista: szerokie barki, wąskie biodra, oficerki, kwadratowa szczęka, krzyczy ---------- */
C.komunista={R:18.5,leg:[14.5,14.5],legW:[11,9.6,8.2],arm:[14,13],armW:[10,8.6,7.4],hipX:[-3.5,4],neckW:10,
 T:{h:30,sw:13.5,hw:9,belly:0,sk:6},skin:'#e8b892',pants:'#3e3d32',coat:'#6e7444',sleeve:'#6e7444',shoe:'#151515',boot:'#1c1a18',
 holdNear:{fn:holdBanner,behind:true},
 headPath:null,
 back(J,t){const n=J.neck,f=Math.sin(t*6)*2;Pth([[n[0]+4,n[1]+1],[n[0]+18,n[1]+4+f],[n[0]+24,n[1]+f*1.4],[n[0]+16,n[1]+9+f],[n[0]+4,n[1]+6]]);fs('#c8281e');},
 torsoFx(T){
  Pth([[-8,-30],[-4.4,-30],[-4.4,-12],[-8,-12]]);fs(tint('#6e7444',0.88),OLW*0.5);for(const y of [-27,-22,-17])dot(-6.2,y,0.8,'#c9a24a');
  for(const [x0,x1] of [[-14,-9.6],[1,9]]){Pth([[x0,-25],[x1,-25.4],[x1,-18],[x0,-17.6]]);fs(tint('#6e7444',0.86),OLW*0.5);Pth([[x0-0.4,-25.6],[x1+0.4,-26],[x1+0.4,-23],[x0-0.4,-22.6]]);fs(tint('#6e7444',0.8),OLW*0.5);}
  ctx.fillStyle='#4a3420';ctx.beginPath();ctx.moveTo(9,-31);ctx.lineTo(12,-30);ctx.lineTo(-8,-1);ctx.lineTo(-11,-2);ctx.fill();
  ctx.fillRect(-20,-4,40,3.6);ln(-20,-4,20,-4,OL,OLW*0.6);ln(-20,-0.4,20,-0.4,OL,OLW*0.6);Pth([[-8.4,-4.6],[-3.6,-4.6],[-3.6,0.2],[-8.4,0.2]]);fs('#d4af37',OLW*0.6);ctx.fillStyle='#4a3420';ctx.fillRect(-7,-3.2,2,2);},
 torsoOver(T){for(const [x,s] of [[-T.sw+3.4,1],[T.sw-3,0.8]]){Pth([[x-3.4*s,-T.h+1],[x+3.4*s,-T.h+1.6],[x+3.2*s,-T.h+4],[x-3.4*s,-T.h+3.4]]);fs('#c42a20',OLW*0.6);}},
 collar(J,t){const n=J.neck,q=rotp([-2,1],J.hr);   // czerwona chusta z węzłem
  ctx.beginPath();ctx.ellipse(n[0],n[1]-1,9,3.4,-J.lean*0.5,0,7);fs('#d02c20',OLW);
  const k=add(n,q);Pth([[k[0]-2,k[1]],[k[0]+1.6,k[1]+1],[k[0]-0.6,k[1]+8+Math.sin(t*6)*0.6],[k[0]-4.4,k[1]+7]]);fs('#b8241a',OLW*0.8);oell(k[0]-1,k[1],2.4,2,'#d02c20',OLW*0.8);},
 face(R,t,st){const m=st.talk?0.45+0.55*Math.abs(Math.sin(t*10)):0.55;
  eyes(R,{rx:0.14,ry:0.18,dy:0.02});
  Pth([[-R*0.9,-R*0.36],[-R*0.44,-R*0.2],[-R*0.46,-R*0.1],[-R*0.86,-R*0.24]]);fs('#2a1a10',OLW*0.5);
  Pth([[-R*0.3,-R*0.18],[R*0.14,-R*0.34],[R*0.16,-R*0.22],[-R*0.28,-R*0.08]]);fs('#2a1a10',OLW*0.5);
  ctx.beginPath();ctx.moveTo(-R*0.44,-R*0.0);ctx.quadraticCurveTo(-R*0.84,R*0.24,-R*0.62,R*0.3);ctx.lineTo(-R*0.38,R*0.26);fs(tint('#e8b892',0.92),OLW*0.8);
  // krzyczące usta z zębami
  const my=R*0.56;ctx.beginPath();ctx.moveTo(-R*0.66,my-R*0.08);ctx.lineTo(-R*0.08,my-R*0.1);ctx.quadraticCurveTo(-R*0.12,my+R*0.36*m,-R*0.36,my+R*0.34*m);ctx.quadraticCurveTo(-R*0.62,my+R*0.3*m,-R*0.66,my-R*0.08);fs('#3a0d0d',OLW*0.8);
  ctx.fillStyle='#f2ead6';ctx.fillRect(-R*0.6,my-R*0.08,R*0.48,R*0.08);ell(-R*0.36,my+R*0.22*m,R*0.14,R*0.06*m,'#b03a34');
  Pth([[-R*0.82,R*0.4],[-R*0.5,R*0.3],[-R*0.12,R*0.32],[R*0.04,R*0.44],[-R*0.14,R*0.44],[-R*0.48,R*0.4],[-R*0.76,R*0.48]]);fs('#2a1a10',OLW*0.6);
  ctx.fillStyle='rgba(40,30,20,.18)';ctx.beginPath();ctx.ellipse(-R*0.2,R*0.78,R*0.5,R*0.16,0,0,7);ctx.fill();},
 hat(R){ // maciejówka z gwiazdą
  const P=()=>{ctx.beginPath();ctx.moveTo(R*0.98,-R*0.3);ctx.lineTo(R*1.08,-R*0.92);ctx.quadraticCurveTo(R*0.4,-R*1.36,-R*0.62,-R*1.22);ctx.lineTo(-R*0.98,-R*0.62);ctx.quadraticCurveTo(-R*0.1,-R*0.5,R*0.98,-R*0.3);ctx.closePath();};
  P();ctx.fillStyle='#5e6438';ctx.fill();ctx.save();P();ctx.clip();ctx.fillStyle='#4a5030';ctx.fillRect(-R*1.2,-R*0.82,R*2.4,R*0.2);ctx.fillStyle='rgba(30,15,5,.28)';ctx.fillRect(R*0.3,-R*1.5,R,R*1.3);ctx.restore();P();ctx.strokeStyle=OL;ctx.lineWidth=OLW*1.1;ctx.stroke();
  Pth([[-R*0.96,-R*0.66],[-R*1.42,-R*0.5],[-R*1.36,-R*0.4],[-R*0.82,-R*0.5]]);fs('#1a1a14');
  const sx=-R*0.42,sy=-R*0.95,s=R*0.2,pts=[];for(let i=0;i<10;i++){const a=-PI/2+i*PI/5,r=i%2?s*0.42:s;pts.push([sx+Math.cos(a)*r*0.8,sy+Math.sin(a)*r]);}Pth(pts);fs('#d42a1e',OLW*0.6);}
};

/* rejestr dla dalszych plików odnowa_*.js: C = postaci na szkielecie, P = ich pozy (st→poza),
   X = chołota bez szkieletu (st,t) w jednostkach 100 = wzrost, D = sprzęt (d,t) w jednostkach 72 = pole jak DRAW w grze, H = Zdzichu */
const ODN=window.ODN={C,P:{},X:{},D:{},H:null,figure,pose,walk,stand,eyes,F,ell,oell,dot,curve,rotp,claws,holdGasior,holdBanner};
STYLES.push({id:'odnowa',name:'Odnowa: nowe figury 3/4',desc:'Kontur i cieniowanie jak w grze, ale nowe sylwetki i proporcje (duża głowa, krępe ciało) oraz twarz w 3/4 zgodna z ciałem.',
 en:k=>!!(C[k]||ODN.X[k]),def:k=>!!ODN.D[k],hero:()=>!!ODN.H,
 draw(k,x,y,h,st){
  const sc=h/100,prev=OLW;
  ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);OLW=clamp(1.8/sc,0.9,3.2);CS=st;
  try{if(C[k])figure(C[k],pose(k,st),st.t||0,st);else if(ODN.X[k])ODN.X[k](st,st.t||0);}finally{OLW=prev;ctx.restore();}
 },
 drawDef(k,x,by,sz,d,t){
  const sc=sz/72,prev=OLW;ctx.save();ctx.translate(x,by);ctx.scale(sc,sc);OLW=clamp(1.7/sc,0.9,4);
  try{if(d&&d.hitT>0)ctx.translate(Math.sin((t||0)*80)*1.4,0);ODN.D[k](d,t||0);}finally{OLW=prev;ctx.restore();}
 },
 drawHero(x,y,h,t){const sc=h/100,prev=OLW;ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);OLW=clamp(1.8/sc,0.9,3.2);CS={t};
  try{ODN.H(t);}finally{OLW=prev;ctx.restore();}}
});
})();
