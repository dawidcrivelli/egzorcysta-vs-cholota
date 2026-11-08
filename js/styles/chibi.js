/* Styl „Naklejki chibi”: wielka głowa, gruby czarny kontur, jeden ton cienia, połysk, sprężysty chód.
   Rysuje w jednostkach u=h/100 (ziemia y=0, czubek głowy y≈-100), twarzą w lewo. */
(()=>{
const TAU=Math.PI*2,OL=2.5,INK='#1b1410',GLOSS='rgba(255,255,255,.55)';
const E=(x,y,rx,ry,r=0)=>()=>ctx.ellipse(x,y,rx,ry,r,0,TAU);
const RR=(x,y,w,h,r)=>()=>ctx.roundRect(x,y,w,h,r);
const PL=pts=>()=>{ctx.moveTo(pts[0][0],pts[0][1]);for(const p of pts)ctx.lineTo(p[0],p[1]);ctx.closePath();};
// kształt: cień (prawy-dolny sierp) + kolor + połysk + kontur
function sh(path,col,shd,k=3.5,gloss){
 ctx.beginPath();path();ctx.fillStyle=shd||col;ctx.fill();
 if(shd){ctx.save();ctx.clip();ctx.translate(-k,-k*0.8);ctx.beginPath();path();ctx.fillStyle=col;ctx.fill();ctx.restore();}
 if(gloss){ctx.beginPath();gloss();ctx.fillStyle=GLOSS;ctx.fill();}
 ctx.beginPath();path();ctx.lineWidth=OL;ctx.strokeStyle=INK;ctx.stroke();
}
const seg=(a,b,w,col)=>{ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineWidth=w;ctx.strokeStyle=col;ctx.stroke();};
// kończyna: kontur, cień, kolor przesunięty w stronę światła
function limb(a,b,w,col,shd){
 seg(a,b,w+2*OL,INK);seg(a,b,w,shd);const o=[-w*0.18,-w*0.12];seg([a[0]+o[0],a[1]+o[1]],[b[0]+o[0],b[1]+o[1]],w*0.55,col);
}
const dot=(x,y,r,col)=>{ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle=col;ctx.fill();};
const pt=(o,r,ang)=>[o[0]+r*Math.cos(ang),o[1]+r*Math.sin(ang)];
function txt(s,x,y,sz,col){ctx.font=`900 ${sz}px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=col;ctx.fillText(s,x,y);}

/* twarz w 3/4 w lewo; f: {skin,shd,m (otwarcie ust 0..1),eye,glow,pupil,brow,nose,noseR,teeth,ear} */
function head(hx,hy,r,f){
 if(f.ear!==false)sh(E(hx+r*0.92,hy+r*0.1,r*0.17,r*0.24),f.skin,f.shd,2);
 sh(E(hx,hy,r*1.04,r),f.skin,f.shd,r*0.22,f.bald?E(hx-r*0.35,hy-r*0.62,r*0.38,r*0.17,-0.4):E(hx-r*0.5,hy-r*0.5,r*0.25,r*0.12,-0.6));
 const ey=hy-r*0.02;
 [[hx-r*0.6,0.82],[hx-r*0.08,1]].forEach(([ex,s],i)=>{
  if(f.glow){ctx.save();ctx.shadowColor=f.glow;ctx.shadowBlur=r*0.5;}
  sh(E(ex,ey,r*0.22*s,r*0.28*s),f.eye||'#fff');
  if(f.glow)ctx.restore();
  dot(ex-r*0.07,ey+r*0.03,r*(f.pupil||0.13)*s,INK);dot(ex-r*0.11,ey-r*0.04,r*0.05*s,'#fff');
  const bx=ex,by=ey-r*0.36*s,d=f.brow??0.12,w=r*0.22;   // brwi: wewnętrzny koniec niżej = gniew
  i?seg([bx-w,by+d*r],[bx+w,by-d*r*0.6],r*0.12,INK):seg([bx-w,by-d*r*0.6],[bx+w*0.8,by+d*r],r*0.12,INK);
 });
 const mx=hx-r*0.38,my=hy+r*(f.my||0.55),m=f.m||0;
 if(m<0.08){ctx.beginPath();ctx.moveTo(mx-r*0.2,my+r*0.03);ctx.quadraticCurveTo(mx,my-r*0.04,mx+r*0.2,my+r*0.06);ctx.lineWidth=OL;ctx.strokeStyle=INK;ctx.stroke();}
 else{const mh=r*(0.08+0.3*m),mp=E(mx,my+mh*0.3,r*0.24,mh);
  ctx.beginPath();mp();ctx.fillStyle='#5a1212';ctx.fill();
  ctx.save();ctx.clip();dot(mx+r*0.04,my+mh*1.1,r*0.17,'#e0605a');
  if(f.teeth!==false){ctx.fillStyle='#fffbe8';f.jag?ctx.fill(new Path2D(`M${mx-r*0.25} ${my-mh}l${r*0.1} ${mh*0.9}l${r*0.08} ${-mh*0.6}l${r*0.1} ${mh*0.8}l${r*0.1} ${-mh*0.7}l${r*0.1} ${mh*0.7}l0 ${-mh}z`)):ctx.fillRect(mx-r*0.25,my-mh,r*0.5,mh*0.55);}
  ctx.restore();ctx.beginPath();mp();ctx.lineWidth=OL;ctx.strokeStyle=INK;ctx.stroke();}
 if(f.nose)sh(E(hx-r*0.42,hy+r*0.24,f.noseR*r,f.noseR*r*0.85),f.nose,f.noseShd,f.noseR*r*0.35,E(hx-r*0.48,hy+r*0.16,f.noseR*r*0.35,f.noseR*r*0.22));
}

/* nogi: hip, stopa; noga = nogawka + but */
function leg(hip,foot,w,col,shd,shoe,shoeShd){limb(hip,[foot[0],foot[1]-4],w,col,shd);if(shoe)sh(E(foot[0]-3,foot[1]-3,8,4.6),shoe,shoeShd,2,E(foot[0]-6,foot[1]-5,3,1.2));}
function arm(sh0,hand,w,col,shd,skin,skinShd){limb(sh0,hand,w,col,shd);sh(E(hand[0],hand[1],5,5),skin,skinShd,1.8);}

// ruch ręki w ataku: kąt od góry (-π/2) przez przód do przodu-w-dół
const strike=a=>-Math.PI/2+0.7-a*(Math.PI/2+1.05);

const CH={
 trup:{lean:-0.2,stride:7,bounce:2.5,
  leg(i,hip,foot){i?leg(hip,foot,9,'#3b3546','#2a2533','#6b4a2e','#4a3220'):(limb(hip,[foot[0],foot[1]-6],9,'#3b3546','#2a2533'),sh(E(foot[0]-3,foot[1]-3,7.5,4),'#9fc07e','#6f9a5a',2));},
  body(g){
   const sw=g.walk?Math.sin(g.ph)*3:Math.sin(g.t*2)*1,lunge=g.a*8;
   arm([6,-52],[-30-lunge,-60+sw],8,'#4a4458','#332f3f','#9fc07e','#6f9a5a');
   sh(PL([[-15,-58],[15,-58],[17,-24],[13,-17],[8,-22],[3,-15],[-3,-22],[-8,-16],[-13,-22],[-17,-24]]),'#4a4458','#332f3f',5);
   sh(PL([[-9,-57],[-1,-57],[-3,-36],[-7,-40]]),'#d9d4b8','#b7b196',1.5);seg([-5,-54],[-5,-44],3,'#b8322c');
   seg([9,-34],[13,-30],1.5,'#8a849a');seg([11,-36],[11,-28],1.5,'#8a849a');   // łata
   const hx=-6-lunge*0.6,hy=-74+g.a*3;
   head(hx,hy,22,{skin:'#9fc07e',shd:'#6f9a5a',m:g.eat?0.4+0.6*g.a:g.talk?g.m:0.35,eye:'#fff36b',glow:'#e8ff40',pupil:0.06,brow:0.02,jag:true});
   ctx.lineWidth=OL;ctx.strokeStyle=INK;ctx.beginPath();ctx.moveTo(hx-2,hy-21);ctx.quadraticCurveTo(hx+2,hy-30,hx+8,hy-27);ctx.moveTo(hx+5,hy-20);ctx.quadraticCurveTo(hx+10,hy-28,hx+15,hy-24);ctx.stroke();
   seg([hx+8,hy-12],[hx+15,hy-2],1.6,'#3d5a30');for(let j=0;j<3;j++)seg([hx+9+j*2.5,hy-9+j*3],[hx+13+j*2.5,hy-11+j*3],1.4,'#3d5a30');  // szew
   arm([-6,-50],[-34-lunge,-52-sw],8,'#4a4458','#332f3f','#9fc07e','#6f9a5a');
  }},
 sasiad:{lean:0,stride:9,bounce:4,
  leg(i,hip,foot){leg(hip,foot,10,'#2d56c8','#1f3c94','#fbfbf6','#c8ccd6');const o=i?2:-2;seg([hip[0]+o,hip[1]+2],[foot[0]+o,foot[1]-6],1.6,'#fff');},
  body(g){
   const sw=g.walk?Math.sin(g.ph)*7:0;
   arm([8,-50],[12-sw,-34],7,'#f5b88f','#d98f6a','#f5b88f','#d98f6a');
   sh(RR(-15,-38,30,20,7),'#2d56c8','#1f3c94',4);
   sh(()=>{ctx.moveTo(-12,-57);ctx.lineTo(12,-57);ctx.quadraticCurveTo(17,-40,13,-30);ctx.quadraticCurveTo(-4,-24,-16,-31);ctx.quadraticCurveTo(-22,-42,-12,-57);ctx.closePath();},'#fbfbf6','#c8ccd6',5,E(-9,-46,3,6,0.3));
   seg([-6,-57],[-4,-50],1.6,'#c8ccd6');seg([6,-57],[3,-50],1.6,'#c8ccd6');
   // flaszka: w chodzie pionowo w dłoni, w ataku trzymana za szyjkę i walnięta z góry
   const s0=[-6,-50],ang=g.eat?strike(g.a):0,hd=g.eat?pt(s0,20,ang):[-20+(g.walk?Math.sin(g.ph)*4:0),-37],up=g.eat&&ang>-Math.PI/2-0.5;   // zamach za głową
   const bottle=()=>{
   ctx.save();ctx.translate(hd[0],hd[1]);g.eat?(ctx.rotate(ang-Math.PI/2),ctx.translate(0,13)):ctx.rotate(-0.15);ctx.scale(1.25,1.25);
   sh(RR(-2,-18,4,9,1.5),'#8a4a14','#5c2f0a',1);sh(RR(-4.5,-11,9,19,3),'#8a4a14','#5c2f0a',2.5,RR(-3,-9,2,13,1));sh(RR(-4.5,-4,9,6,1),'#f5d34a');dot(0,-18.5,2,'#f0c020');
   ctx.restore();
   arm(s0,hd,7,'#f5b88f','#d98f6a','#f5b88f','#d98f6a');};
   if(up)bottle();
   const hx=-2,hy=-77;
   head(hx,hy,22,{skin:'#f5b88f',shd:'#d98f6a',my:0.74,m:g.talk?g.m:g.eat?0.3*g.a:0,brow:0.16,nose:'#ef4a3c',noseShd:'#b52a22',noseR:0.24});
   ctx.beginPath();ctx.moveTo(hx-22,hy+8);ctx.quadraticCurveTo(hx-9,hy+3,hx+2,hy+9);ctx.quadraticCurveTo(hx-4,hy+14,hx-9,hy+11);ctx.quadraticCurveTo(hx-16,hy+16,hx-22,hy+8);ctx.closePath();   // wąs
   ctx.fillStyle='#4a2c18';ctx.fill();ctx.lineWidth=OL*0.7;ctx.strokeStyle=INK;ctx.stroke();
   for(const [dx,dy] of [[6,14],[10,11],[3,17],[12,16]])dot(hx+dx,hy+dy,0.9,'#b9876a');   // szczecina
   sh(()=>{ctx.moveTo(hx-22,hy-8);ctx.quadraticCurveTo(hx-20,hy-28,hx+2,hy-27);ctx.quadraticCurveTo(hx+22,hy-25,hx+23,hy-7);ctx.closePath();},'#8a5a3a','#5e3c26',4,E(hx-8,hy-21,6,2.5,-0.2));
   sh(E(hx-24,hy-8,12,3.6,-0.08),'#8a5a3a','#5e3c26',2);
   if(!up)bottle();
  }},
 urzednik:{lean:0,stride:7,bounce:2.5,
  leg(i,hip,foot){leg(hip,foot,10,'#6c7685','#4e5664','#2a2a30','#141418');},
  body(g){
   const sw=g.walk?Math.sin(g.ph)*6:0;
   arm([8,-50],[12-sw,-30],8,'#7d8794','#5a6370','#f2c09a','#d4977a');
   sh(RR(-16,-58,32,42,10),'#7d8794','#5a6370',5,E(-9,-50,3,5,0.3));
   sh(PL([[-8,-58],[4,-58],[-2,-42]]),'#fbfbf6','#cfd3dc',1);sh(PL([[-3,-56],[0,-56],[1,-44],[-1.5,-40],[-4,-44]]),'#d2302c','#952018',1.2);
   seg([-16,-28],[16,-28],1.4,'#5a6370');
   const hx=-2,hy=-77;
   head(hx,hy,22,{skin:'#f2c09a',shd:'#d4977a',bald:true,m:g.talk?g.m:g.eat?0.25*g.a:0,brow:0.04});
   ctx.save();ctx.beginPath();E(hx,hy,22.9,22)();ctx.clip();sh(E(hx+22,hy+2,13,13),'#c3c7cf','#959aa4',3);ctx.restore();   // siwy wianuszek z tyłu
   ctx.lineWidth=1.8;ctx.strokeStyle=INK;for(const [ex,s] of [[hx-13.2,0.82],[hx-1.8,1]]){ctx.beginPath();ctx.arc(ex,hy,6.4*s,0,TAU);ctx.fillStyle='rgba(170,220,255,.25)';ctx.fill();ctx.stroke();}
   seg([hx-7.9,hy-1],[hx-8,hy-1],1.8,INK);seg([hx+4.5,hy-1],[hx+18,hy-3],1.8,INK);
   seg([hx-15,hy-3],[hx-12,hy-6],1.2,'#fff');
   sh(PL([[hx-17,hy+9],[hx-3,hy+8],[hx-5,hy+11],[hx-15,hy+12]]),'#b9bcc4','#8e929b',1);
   // pieczątka: góra w spoczynku/chodzie, uderza w przód przy ataku
   const k=g.eat?g.a*g.a:0,hd=[-30-k*6,lerp(-60,-40,k)-(g.eat?Math.max(0,Math.sin(g.ph))*(1-g.a)*22:0)+(g.walk?Math.sin(g.ph*2)*1.5:0)];
   limb([-6,-50],hd,8,'#7d8794','#5a6370');
   ctx.save();ctx.translate(hd[0],hd[1]);ctx.rotate(0.08-k*0.08);   // pieczątka: dłoń na trzonku, odcisk w dół
   sh(RR(-3,-8,6,16,1.5),'#a8642e','#6e3d18',1);sh(E(0,-10,7.5,6),'#a8642e','#6e3d18',2,E(-2,-12,2.5,1.3));
   sh(RR(-18,7,36,12,3),'#d23a2f','#952018',3,RR(-15,8.5,14,2.2,1));sh(RR(-17,19,34,4,1),'#2a2a30');
   txt('ZAMKNIĘTE',0,13.4,6.4,'#fff6dc');sh(E(1,0,5.5,5.5),'#f2c09a','#d4977a',1.8);ctx.restore();
   if(g.eat&&g.a>0.85){ctx.lineWidth=2;ctx.strokeStyle='#ffd23a';for(let j=0;j<5;j++){const an=Math.PI*(0.15+j*0.18);ctx.beginPath();ctx.moveTo(hd[0]-Math.cos(an)*21,hd[1]+23+Math.sin(an)*4);ctx.lineTo(hd[0]-Math.cos(an)*28,hd[1]+23+Math.sin(an)*9);ctx.stroke();}}
  }},
 komunista:{lean:0,stride:8,bounce:3.5,
  leg(i,hip,foot){leg(hip,foot,10,'#2f2f3a','#1e1e26','#232326','#0e0e10');},
  body(g){
   const sw=g.walk?Math.sin(g.ph)*2:0,jab=g.eat?g.a*10:0;
   const px=-28-jab,poleTop=-118,hnear=[px+2,-48+sw],hfar=[px+2,-64+sw];
   if(g.shield>0)arm([8,-52],hfar,8,'#e0352b','#a8231c','#f5b88f','#d98f6a');
   else arm([8,-50],[12-(g.walk?Math.sin(g.ph)*7:0),-32],8,'#e0352b','#a8231c','#f5b88f','#d98f6a');
   sh(RR(-16,-58,32,42,10),'#e0352b','#a8231c',5,E(-9,-50,3,5,0.3));
   sh(PL([[-12,-58],[-2,-58],[-6,-50]]),'#a8231c');sh(PL([[2,-58],[12,-58],[6,-50]]),'#a8231c');
   for(const yy of [-48,-40,-32])dot(-3,yy,1.6,'#f5c542');
   seg([-16,-24],[16,-24],3.5,'#3a2a20');
   const hx=0,hy=-77;
   head(hx,hy,22,{skin:'#f5b88f',shd:'#d98f6a',m:g.talk?g.m:g.eat?0.5+0.5*g.a:0.25,brow:0.2,nose:'#f5b88f',noseShd:'#d98f6a',noseR:0.14});
   sh(()=>{ctx.moveTo(hx-22,hy-6);ctx.quadraticCurveTo(hx-22,hy-30,hx+1,hy-30);ctx.quadraticCurveTo(hx+23,hy-29,hx+23,hy-6);ctx.closePath();},'#6b7a3a','#4a5626',4,E(hx-9,hy-23,6,2.5,-0.2));
   sh(RR(hx-23,hy-11,46,6,3),'#4a5626');sh(E(hx-24,hy-6,11,3.4,-0.1),'#2a2a26');
   ctx.save();ctx.translate(hx-9,hy-19);ctx.beginPath();for(let j=0;j<10;j++){const rr=j&1?2.4:5.6,an=-Math.PI/2+j*Math.PI/5;ctx.lineTo(rr*Math.cos(an),rr*Math.sin(an));}ctx.closePath();
   ctx.fillStyle='#e8231c';ctx.fill();ctx.lineWidth=1.5;ctx.strokeStyle=INK;ctx.stroke();ctx.restore();
   if(g.shield>0){   // transparent przed sobą: to jego tarcza
    const wv=g.walk?Math.sin(g.ph):Math.sin(g.t*2)*0.3,top=poleTop+6,bx=px-54,bw=54,bh=40;
    limb([px,-14],[px,poleTop],3.5,'#8a5a2e','#5e3c1c');dot(px,poleTop-2,3.5,'#f5c542');
    ctx.save();ctx.translate(-jab*0.2,0);
    const bp=()=>{ctx.moveTo(px,top);ctx.bezierCurveTo(px-18,top-3*wv,px-36,top+3*wv,bx,top);ctx.lineTo(bx,top+bh);ctx.bezierCurveTo(px-36,top+bh+3*wv,px-18,top+bh-3*wv,px,top+bh);ctx.closePath();};
    sh(bp,'#e0352b','#a8231c',4,RR(bx+3,top+3,bw-8,3,1.5));
    txt('PLAN',bx+bw/2,top+bh*0.32,12,'#fff6dc');txt('5-LETNI',bx+bw/2,top+bh*0.7,11.5,'#ffd23a');
    ctx.restore();
    arm([-6,-50],hnear,8,'#e0352b','#a8231c','#f5b88f','#d98f6a');
    sh(E(hfar[0],hfar[1],5,5),'#f5b88f','#d98f6a',1.8);
   }else{   // złamany kij
    const hd=[-24-jab*1.2,-46+sw];
    limb([hd[0],hd[1]+10],[hd[0]-4,hd[1]-24],3.5,'#8a5a2e','#5e3c1c');
    ctx.fillStyle='#c48a4a';ctx.beginPath();ctx.moveTo(hd[0]-6,hd[1]-23);ctx.lineTo(hd[0]-5,hd[1]-31);ctx.lineTo(hd[0]-3,hd[1]-25);ctx.lineTo(hd[0]-1,hd[1]-29);ctx.lineTo(hd[0]-2,hd[1]-22);ctx.closePath();ctx.fill();ctx.lineWidth=1.4;ctx.strokeStyle=INK;ctx.stroke();
    sh(PL([[hd[0]-4,hd[1]-20],[hd[0]-12,hd[1]-18],[hd[0]-9,hd[1]-13],[hd[0]-14,hd[1]-9],[hd[0]-3,hd[1]-12]]),'#e0352b','#a8231c',1.5);
    arm([-6,-50],hd,8,'#e0352b','#a8231c','#f5b88f','#d98f6a');
   }
  }}
};

STYLES.push({id:'chibi',name:'Naklejki chibi',desc:'Wielkie głowy, gruby kontur i połysk jak na naklejkach z gumy do żucia.',
 draw(k,x,y,h,st){
  const C=CH[k];if(!C)return drawEnemyRaw(k,x,y,h,st);
  const t=st.t||0,eat=!!st.eat,walk=!!st.walk&&!eat;
  const ph=eat?t*TAU/cycleOf(k,{eat:true}).P:walk?t*TAU/cycleOf(k,st).P:t*2.2;
  const s=walk?Math.sin(ph):0,c=walk?Math.cos(ph):0,a=eat?0.5-0.5*Math.cos(ph):0;
  const lift=walk?(1-Math.abs(s))*C.bounce:0;
  const q=walk?(0.5-Math.abs(s))*0.09:eat?0.06*Math.sin(ph*2):Math.sin(ph)*0.018;   // squash & stretch
  const g={t,ph,s,a,walk,eat,talk:!!st.talk,shield:st.shield||0,m:0.45+0.45*Math.sin(walk?ph*4:t*14)};
  ctx.translate(x,y);ctx.scale(h/100,h/100);ctx.lineJoin=ctx.lineCap='round';
  ctx.beginPath();ctx.ellipse(-2,0,30,6,0,0,TAU);ctx.fillStyle='rgba(0,0,0,.28)';ctx.fill();
  for(const i of [1,0]){   // 1 = dalsza noga
   const hip=[i?5:-5,-20-lift],fx=eat?(i?7:-9):hip[0]+(i?1:-1)*s*C.stride,fl=walk?Math.max(0,i?-c:c)*5:0;
   C.leg(i,hip,[fx,-fl]);
  }
  ctx.translate(0,-20-lift);ctx.rotate(C.lean+(eat?-0.22*a:walk?-0.04:0));ctx.scale(1-q,1+q);ctx.translate(0,20);
  C.body(g);
 }});
})();
