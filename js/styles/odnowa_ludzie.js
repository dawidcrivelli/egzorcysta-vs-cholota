/* Odnowa, cz. 1: milicjant, wampir, mumia, lunatyk, Lenin i Lenin z brązu (boss).
   Rejestruje się w ODN (js/styles/odnowa.js): C = wygląd na szkielecie, P = pozy. Twarze w 3/4 jak w odnowa.js. */
(()=>{
const {C,P,walk,stand,eyes,F,ell,oell,dot,curve,rotp,claws}=ODN,PI=Math.PI;
// pałka w przedłużeniu przedramienia (układ dłoni: +y wzdłuż przedramienia)
function holdBaton(){ctx.save();ctx.translate(0,4);ctx.rotate(0.45);Pth([[-1.4,-2],[1.4,-2],[1.2,19],[-1.2,19]]);fs('#ecebe4',OLW*0.8);ctx.fillStyle='#222';ctx.fillRect(-1.5,-2,3,4.6);ctx.fillStyle='rgba(0,0,0,.15)';ctx.fillRect(0.2,3,0.9,16);ctx.restore();}
// kaszkiet trzymany za daszek, zawsze denkiem do góry
function holdKaszkiet(far,ang){ctx.save();ctx.translate(0,5);ctx.rotate(-ang);ctx.translate(-1,3);
 Pth([[-6,-1],[5.6,-1.6],[6.4,1.6],[-6.6,2.2]]);fs(far?'#2c2c30':'#38383e',OLW*0.8);ctx.beginPath();ctx.ellipse(0,-1.4,6,2.6,0,PI,0);fs('#2c2c30',OLW*0.8);
 Pth([[-6.6,2.2],[-10,3.4],[-5,3]]);fs('#1c1c20',OLW*0.7);ctx.restore();}
const sw9=t=>Math.max(0,Math.sin(t*9));
// wspólny wzór pozy: chód/stanie/gryzienie, potem ręce per postać
function base(st,amp,lean){const t=st.t||0,sp=16*(st.sp||0.22),idle=!st.walk&&!st.eat;
 const p=idle?stand(t,lean):walk(t,sp,amp,lean);if(st.eat){p.lean=(lean||0)+0.14;p.legs=[{th:0.3,kn:0.15},{th:-0.22,kn:0.12}];}return p;}
function star(x,y,s,col,w){const pts=[];for(let i=0;i<10;i++){const a=-PI/2+i*PI/5,r=i%2?s*0.42:s;pts.push([x+Math.cos(a)*r*0.85,y+Math.sin(a)*r]);}Pth(pts);fs(col,w);}
function crack(pts,w){ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(const p of pts.slice(1))ctx.lineTo(p[0],p[1]);sk('#2a1606',w);}

/* ---------- Milicjant: krępy, czapka z orzełkiem, wąs, pałka, „Dowód osobisty!” ---------- */
C.milicjant={R:18,leg:[14.5,14.5],legW:[11,9.6,8.2],arm:[13.5,13],armW:[9.8,8.4,7.4],hipX:[-3.5,4],neckW:10.5,
 T:{h:29,sw:12.5,hw:10.5,belly:4,sk:6},skin:'#e2b08a',pants:'#4a586b',coat:'#5a6a80',sleeve:'#5a6a80',shoe:'#151515',boot:'#161616',
 holdNear:{fn:holdBaton},
 torsoFx(T){const c='#5a6a80';
  Pth([[-6.4,-29],[-3,-29],[-3,-6],[-6.4,-6]]);fs(tint(c,0.9),OLW*0.5);for(const y of [-25,-19,-13])dot(-4.7,y,0.9,'#d4b04a');
  for(const [x0,x1] of [[-14,-8.6],[1,8.6]]){Pth([[x0,-24],[x1,-24.4],[x1,-17],[x0,-16.6]]);fs(tint(c,0.88),OLW*0.5);Pth([[x0-0.4,-24.6],[x1+0.4,-25],[x1+0.4,-22],[x0-0.4,-21.6]]);fs(tint(c,0.8),OLW*0.5);}
  // gwizdek na łańcuszku
  curve([5,-22],[2,-14],[-1,-17],'#d4b04a',0.6);Pth([[-2.6,-18],[0.4,-18.4],[0.6,-16],[-2.4,-15.6]]);fs('#c9c9c9',OLW*0.4);
  // pas przez ramię, pas główny, kabura
  ctx.fillStyle='#3a2414';ctx.beginPath();ctx.moveTo(9,-30);ctx.lineTo(12,-29);ctx.lineTo(-8,-1);ctx.lineTo(-11,-2);ctx.fill();
  ctx.fillRect(-20,-4,40,3.6);ln(-20,-4,20,-4,OL,OLW*0.6);ln(-20,-0.4,20,-0.4,OL,OLW*0.6);Pth([[-8,-4.6],[-3.6,-4.6],[-3.6,0.2],[-8,0.2]]);fs('#c9c9c9',OLW*0.6);},
 torsoOver(T){Pth([[3,-1],[9.6,-1.4],[10,8],[3.6,8.6]]);fs('#3a2414',OLW*0.7);ln(4,1.4,9.4,1,'#5a3a24',0.8);
  for(const [x,s] of [[-T.sw+3.6,1],[T.sw-3,0.8]]){Pth([[x-3.4*s,-T.h+1],[x+3.4*s,-T.h+1.6],[x+3.2*s,-T.h+4],[x-3.4*s,-T.h+3.4]]);fs('#4a586b',OLW*0.6);ln(x-2*s,-T.h+2.6,x+2*s,-T.h+2.8,'#d4b04a',0.6);}
  Pth([[-7,-T.h-0.6],[-3,-T.h-1.2],[-3.4,-T.h+2.4],[-6.4,-T.h+2.8]]);fs('#b0241c',OLW*0.5);},
 face(R,t,st){const m=st.talk?0.3+0.5*Math.abs(Math.sin(t*9)):0.12;
  eyes(R,{rx:0.14,ry:0.18,lid:0.72});
  Pth([[-R*0.92,-R*0.34],[-R*0.42,-R*0.22],[-R*0.44,-R*0.12],[-R*0.88,-R*0.24]]);fs('#2a1a10',OLW*0.5);
  Pth([[-R*0.3,-R*0.2],[R*0.14,-R*0.32],[R*0.16,-R*0.22],[-R*0.28,-R*0.1]]);fs('#2a1a10',OLW*0.5);
  oell(-R*0.6,R*0.18,R*0.2,R*0.17,tint('#e2b08a',0.92),OLW*0.8);
  ctx.beginPath();ctx.ellipse(-R*0.38,R*0.6,R*0.18,R*0.04+R*0.16*m,0,0,7);fs('#3a0d0d',OLW*0.6);
  Pth([[-R*0.86,R*0.46],[-R*0.6,R*0.32],[-R*0.36,R*0.38],[-R*0.1,R*0.32],[R*0.06,R*0.46],[-R*0.12,R*0.5],[-R*0.36,R*0.46],[-R*0.62,R*0.52]]);fs('#3a2618',OLW*0.6);
  ctx.fillStyle='rgba(40,30,30,.2)';ctx.beginPath();ctx.ellipse(-R*0.2,R*0.8,R*0.5,R*0.16,0,0,7);ctx.fill();},
 hat(R){ // czapka MO: sztywny denek, ciemny otok, czarny daszek, orzełek
  const P=()=>{ctx.beginPath();ctx.moveTo(R*0.98,-R*0.42);ctx.lineTo(R*1.22,-R*1.04);ctx.quadraticCurveTo(R*0.2,-R*1.3,-R*1.02,-R*1.14);ctx.lineTo(-R*0.94,-R*0.56);ctx.quadraticCurveTo(0,-R*0.5,R*0.98,-R*0.42);ctx.closePath();};
  P();ctx.fillStyle='#5a6a80';ctx.fill();ctx.save();P();ctx.clip();ctx.fillStyle='#2a3240';ctx.fillRect(-R*1.3,-R*0.84,R*2.6,R*0.36);ctx.fillStyle='rgba(30,15,5,.28)';ctx.fillRect(R*0.3,-R*1.5,R,R*1.3);ctx.restore();P();ctx.strokeStyle=OL;ctx.lineWidth=OLW*1.1;ctx.stroke();
  ln(-R*0.9,-R*1.02,R*1.1,-R*1.0,'rgba(255,255,255,.25)',R*0.05);
  Pth([[-R*0.94,-R*0.6],[-R*1.5,-R*0.4],[-R*1.42,-R*0.28],[-R*0.82,-R*0.48]]);fs('#111');ln(-R*1.36,-R*0.38,-R*0.96,-R*0.52,'rgba(255,255,255,.35)',R*0.04);
  // orzełek
  const ex=-R*0.42,ey=-R*0.98;Pth([[ex,ey-R*0.12],[ex+R*0.14,ey-R*0.04],[ex+R*0.07,ey+R*0.12],[ex-R*0.07,ey+R*0.12],[ex-R*0.14,ey-R*0.04]]);fs('#e8e4da',OLW*0.5);dot(ex,ey,R*0.04,'#c9a24a');}
};
P.milicjant=st=>{const t=st.t||0,p=base(st,0.44,0.05),s=sw9(t);
 if(st.eat)p.arms[0]={sh:0.3+1.9*s,el:0.9-0.7*s};
 else if(st.talk){p.arms[0]={sh:0.35,el:0.5};p.arms[1]={sh:1.5+0.05*Math.sin(t*3),el:0.06};}
 else p.arms[0]={sh:0.3+0.3*Math.sin((p.ph||t)+PI),el:0.45};
 return p;};

/* ---------- Wampir: smukły, peleryna z wysokim kołnierzem, wdowi szpic, kły ---------- */
C.wampir={R:17,leg:[16.5,16],legW:[9.6,8.2,7],arm:[15,14],armW:[8.4,7.2,6.2],hipX:[-3,4],neckW:8,
 T:{h:31,sw:11,hw:8,belly:0,sk:7},skin:'#e4e0f2',pants:'#18181c',coat:'#1e1e26',sleeve:'#1e1e26',shoe:'#0e0e10',cuff:'#f0f0f0',shadow:34,
 holdNear:{fn:claws('#e4e0f2')},holdFar:{fn:claws('#e4e0f2')},
 back(J,t,st){ // peleryna od barków do kostek, łopocze w marszu
  const a=J.arms[0].sh,b=J.arms[1].sh,g=-J.shift,f=Math.sin(t*5)*(st.walk?3:1.2),w=st.walk?6:0;
  const outer=[[a[0]-2,a[1]-2],[b[0]+3,b[1]-3],[b[0]+14+w,b[1]+18+f],[b[0]+22+w*1.6,g-22+f],[b[0]+20+w*1.8,g-5],[b[0]+12+w,g-9+f*0.5],[b[0]+4+w*0.6,g-3],[b[0]-4,g-8],[a[0]-6,g-4],[a[0]-8,g-10]];
  Pth(outer);fs('#141418');
  Pth([[b[0]+2,b[1]],[b[0]+12+w,b[1]+18+f],[b[0]+19+w*1.6,g-22+f],[b[0]+17+w*1.8,g-8],[b[0]+11+w,g-12+f*0.5],[b[0]+4,g-7]]);fs('#8a0f1c',0);
  ctx.save();Pth(outer);ctx.clip();ln(b[0]+8,b[1]+6,b[0]+12+w,g-10,'rgba(255,255,255,.08)',2);ctx.restore();},
 torsoFx(T){
  Pth([[-9,-31],[0,-31],[-4.6,-8]]);fs('#f0eee8',0);
  Pth([[-10.4,-24],[-6,-26],[-4.6,-8],[-9.6,-2]]);fs('#6a0c16',OLW*0.5);Pth([[0,-31],[3,-30],[-1,-14],[-4.6,-8]]);fs('#2a2a34',OLW*0.5);
  for(const y of [-18,-13])dot(-7.4,y,0.6,'#c9a24a');
  Pth([[-6.6,-30.4],[-4.6,-29],[-2.6,-30.4],[-2.6,-27.6],[-4.6,-29],[-6.6,-27.6]]);fs('#111',OLW*0.4);},
 torsoOver(T){ // medalion
  curve([-9,-29],[-6,-22],[-3,-29],'#c9a24a',0.6);oell(-6,-22,2.2,2.6,'#d4af37',OLW*0.6);oell(-6,-22,1,1.2,'#c41a1a',OLW*0.3);dot(-6.4,-22.6,0.35,'#ffd0d0');},
 headBack(R){ // wysoki kołnierz za głową
  Pth([[-R*1.2,-R*0.05],[-R*0.5,R*0.4],[R*0.5,R*0.36],[R*1.35,-R*0.35],[R*0.9,R*1.15],[-R*0.7,R*1.2]]);fs('#141418',OLW);
  Pth([[-R*1.0,R*0.12],[-R*0.5,R*0.5],[R*0.5,R*0.46],[R*1.15,-R*0.12],[R*0.8,R*1.0],[-R*0.6,R*1.05]]);fs('#8a0f1c',0);},
 faceFx(R){ell(-R*0.38,-R*0.18,R*0.5,R*0.14,'rgba(110,80,140,.3)');ell(-R*0.2,R*0.4,R*0.4,R*0.18,'rgba(110,80,140,.25)');},
 face(R,t,st){const m=st.talk?0.3+0.5*Math.abs(Math.sin(t*8)):st.eat?0.7:0.15;
  eyes(R,{rx:0.14,ry:0.16,lid:0.8,white:'#fbe8e8',pupil:'#d01818',pr:0.08,glow:'rgba(255,40,40,.55)'});
  Pth([[-R*0.94,-R*0.42],[-R*0.42,-R*0.2],[-R*0.42,-R*0.1],[-R*0.9,-R*0.3]]);fs('#0e0e10',OLW*0.4);
  Pth([[-R*0.3,-R*0.18],[R*0.2,-R*0.42],[R*0.2,-R*0.3],[-R*0.28,-R*0.08]]);fs('#0e0e10',OLW*0.4);
  ctx.beginPath();ctx.moveTo(-R*0.44,-R*0.04);ctx.quadraticCurveTo(-R*0.92,R*0.2,-R*0.62,R*0.32);ctx.lineTo(-R*0.42,R*0.28);fs(tint('#e4e0f2',0.9),OLW*0.8);
  // uśmieszek z kłami
  const my=R*0.56;ctx.beginPath();ctx.moveTo(-R*0.68,my-R*0.04);ctx.quadraticCurveTo(-R*0.38,my+R*0.1+R*0.2*m,-R*0.06,my-R*0.1);ctx.quadraticCurveTo(-R*0.36,my+R*0.02,-R*0.68,my-R*0.04);fs('#3a0710',OLW*0.7);
  ctx.fillStyle='#fff';for(const x of [-0.56,-0.24])Pth([[x*R,my-R*0.04],[(x+0.09)*R,my-R*0.06],[(x+0.04)*R,my+R*0.16]]),ctx.fill();
  // włosy z wdowim szpicem
  Pth([[R*0.95,R*0.1],[R*0.95,-R*0.5],[R*0.5,-R*0.95],[-R*0.3,-R*1.02],[-R*0.85,-R*0.62],[-R*0.62,-R*0.62],[-R*0.42,-R*0.4],[-R*0.22,-R*0.6],[R*0.2,-R*0.62],[R*0.5,-R*0.4],[R*0.62,-R*0.08]]);fs('#101014',OLW*0.8);
  ln(-R*0.3,-R*0.86,R*0.4,-R*0.78,'rgba(150,150,200,.5)',R*0.04);
  // spiczaste ucho na wierzchu
  Pth([[R*0.56,-R*0.08],[R*1.02,-R*0.42],[R*0.86,R*0.12],[R*0.62,R*0.3]]);fs(tint('#e4e0f2',0.88),OLW*0.8);curve([R*0.7,-R*0.02],[R*0.84,-R*0.16],[R*0.74,R*0.16],tint('#e4e0f2',0.55),R*0.035);}
};
P.wampir=st=>{const t=st.t||0,p=base(st,0.36,0.14);
 if(st.eat){p.lean=0.3;p.arms=[{sh:1.1+0.3*Math.sin(t*10),el:0.5},{sh:1.0+0.3*Math.sin(t*10+1.5),el:0.6}];}
 else if(st.talk){p.arms[0]={sh:1.75+0.1*Math.sin(t*4),el:0.25};p.tilt=-0.08;}
 else p.arms[0]={sh:1.15+0.1*Math.sin(t*2.4),el:0.55};
 p.arms[1]={sh:0.8,el:0.7};return p;};

/* ---------- Mumia: cała w bandażach, jedno oko świeci spod opaski, skarabeusz ---------- */
const BAND='#9a8c66';
C.mumia={R:17,leg:[15.5,15],legW:[10.6,9,8],arm:[14.5,14],armW:[9,7.8,7],hipX:[-3.5,4],neckW:9,
 T:{h:28,sw:11,hw:9.5,belly:1,sk:3},skin:'#e2d8bc',pants:'#d8cdae',coat:'#e0d6b9',sleeve:'#ddd3b5',shoe:'#cfc3a0',
 holdNear:{fn:claws('#d8cdae')},holdFar:{fn:claws('#d8cdae')},
 torsoFx(T){ctx.strokeStyle=BAND;ctx.lineWidth=0.9;for(let y=-33;y<8;y+=3.6){ctx.beginPath();ctx.moveTo(-16,y+2.4);ctx.lineTo(16,y-2.4);ctx.stroke();}
  ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=0.5;for(let y=-31;y<8;y+=7.2){ctx.beginPath();ctx.moveTo(-16,y+1.6);ctx.lineTo(16,y-3.2);ctx.stroke();}
  ell(3,-12,3.4,2.2,'rgba(110,80,40,.35)');ell(-8,-22,2,1.4,'rgba(110,80,40,.3)');
  Pth([[1,-20],[4.4,-21.4],[5.6,-17],[2,-16]]);fs('#1b1610',OLW*0.5);},
 torsoOver(T){ // skarabeusz z turkusu
  ctx.save();ctx.translate(-6.4,-21);oell(0,0,2.6,3.2,'#2aa6a0',OLW*0.6);ln(0,-3,0,3,OL,0.5);dot(0,-3.6,1.2,'#1e7a76');
  for(const s of [-1,1])ln(s*2.4,-1,s*4.2,-2.6,'#d4af37',0.7),ln(s*2.4,1.4,s*4.2,2.8,'#d4af37',0.7);ctx.restore();},
 front(J,t,st){const A=J.arms[0],L=J.legs[0],f=Math.sin(t*4)*3;
  wrapLines(A.sh,A.el,8.4,BAND);wrapLines(A.el,A.wr,7.2,BAND);wrapLines(lp(L.hp,L.kn,0.45),L.kn,10,BAND);wrapLines(L.kn,L.an,8.4,BAND);
  // luźne końce bandaży
  const e=lp(A.el,A.wr,0.4);Pth([[e[0]-1.4,e[1]],[e[0]+1.6,e[1]],[e[0]+4+f,e[1]+13],[e[0]+1+f,e[1]+14]]);fs('#e4dcc4',OLW*0.7);
  const h=rotp([8,2],J.lean);Pth([[h[0],h[1]],[h[0]+3,h[1]],[h[0]+8-f,h[1]+16],[h[0]+4.6-f,h[1]+17]]);fs('#e4dcc4',OLW*0.7);},
 faceFx(R){
  ctx.strokeStyle=BAND;ctx.lineWidth=R*0.05;for(const [y,a] of [[-0.85,0.12],[-0.62,-0.1],[-0.42,0.08],[0.3,-0.06],[0.5,0.1],[0.72,-0.08],[0.92,0.06]]){ctx.beginPath();ctx.moveTo(-R*1.1,y*R+a*R*1.1);ctx.lineTo(R*1.1,y*R-a*R*1.1);ctx.stroke();}
  // szpara na oczy
  Pth([[-R*1.1,-R*0.26],[R*0.3,-R*0.3],[R*0.3,R*0.12],[-R*1.1,R*0.1]]);ctx.fillStyle='#1a140a';ctx.fill();},
 face(R,t){const g=0.75+0.25*Math.sin(t*6);
  eyes(R,{rx:0.13,ry:0.14,white:'rgb(255,'+Math.round(200+30*g)+',90)',glow:'rgba(255,220,80,'+g+')',pupil:'#7a3a00',pr:0.04,dy:-0.02});
  // pas bandaża przez dalsze oko: widać tylko jedno
  Pth([[-R*0.88,-R*0.42],[-R*0.32,-R*0.04],[-R*0.36,R*0.12],[-R*0.9,-R*0.2]]);fs('#e2d8bc',OLW*0.6);ln(-R*0.84,-R*0.3,-R*0.4,R*0.02,BAND,R*0.04);
  ln(-R*0.62,R*0.56,-R*0.2,R*0.54,'#3a2a14',R*0.06);},
 hat(R,t){const f=Math.sin(t*3)*R*0.1;Pth([[R*0.62,-R*0.62],[R*0.78,-R*0.5],[R*1.25+f,-R*0.62+f],[R*1.18+f,-R*0.78+f]]);fs('#e4dcc4',OLW*0.7);}
};
P.mumia=st=>{const t=st.t||0,sp=16*(st.sp||0.13)*0.9,ph=t*sp,idle=!st.walk&&!st.eat;
 const p={ph,lean:0.1,tilt:0.04*Math.sin(ph),legs:idle?[{th:0.12,kn:0.05},{th:-0.1,kn:0.05}]:[0,PI].map(o=>({th:0.28*Math.sin(ph+o),kn:0.08+0.3*Math.pow(Math.max(0,Math.sin(ph+o+1.85)),1.4)})),
  arms:[{sh:1.45+0.06*Math.sin(t*2),el:0.08},{sh:1.35+0.06*Math.sin(t*2+1),el:0.14}]};
 if(st.eat){p.lean=0.3;p.arms=[{sh:1.0+0.35*Math.sin(t*8),el:0.4},{sh:0.9+0.35*Math.sin(t*8+1.5),el:0.5}];p.legs=[{th:0.28,kn:0.2},{th:-0.2,kn:0.2}];}
 return p;};

/* ---------- Lunatyk: piżama w paski, szlafmyca z pomponem, oczy zamknięte, świeczka ---------- */
function holdCandle(far,ang){const t=CS.t||0;ctx.save();ctx.translate(0,4);ctx.rotate(-ang);
 const fl=0.8+0.2*Math.sin(t*17)*Math.sin(t*11);
 const g=ctx.createRadialGradient(0,-12,0.5,0,-12,12);g.addColorStop(0,'rgba(255,220,120,'+(0.55*fl)+')');g.addColorStop(1,'rgba(255,220,120,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,-12,12,0,7);ctx.fill();
 ctx.beginPath();ctx.ellipse(0,0.6,5.6,1.6,0,0,7);fs('#c9a24a',OLW*0.7);ctx.beginPath();ctx.arc(5.6,0.2,1.6,-1.2,1.6);sk(OL,1);
 Pth([[-1.6,0],[1.6,0],[1.6,-8],[-1.6,-8]]);fs('#f6f0dc',OLW*0.6);Pth([[1.6,-8],[1.6,-5],[2.4,-4.4],[2.2,-7.4]]);fs('#f6f0dc',OLW*0.4);
 ln(0,-8,0,-9.2,OL,0.4);ctx.beginPath();ctx.moveTo(0,-9);ctx.quadraticCurveTo(-1.8,-11,0+Math.sin(t*9)*0.5,-14*fl);ctx.quadraticCurveTo(1.8,-11,0,-9);ctx.fillStyle='#ffb43a';ctx.fill();
 ell(0,-10.4,0.6,1.2,'#fff3b0');ctx.restore();}
C.lunatyk={R:18,leg:[15,14.5],legW:[10.4,9,7.8],arm:[14,13.5],armW:[9,7.8,6.8],hipX:[-3.5,4],neckW:9.5,
 T:{h:28,sw:11,hw:11,belly:4,sk:5},skin:'#ecc29e',pants:'#a8c8e8',stripe:'#eef5fb',coat:'#a8c8e8',sleeve:'#a8c8e8',cuff:'#eef5fb',shoe:'#9a5a3a',
 holdFar:{fn:holdCandle},
 torsoFx(T){ctx.strokeStyle='#eef5fb';ctx.lineWidth=1.4;for(let x=-15;x<16;x+=3.6){ctx.beginPath();ctx.moveTo(x,-32);ctx.lineTo(x+0.8,8);ctx.stroke();}
  ctx.strokeStyle='#7a9ec4';ctx.lineWidth=0.5;for(let x=-13.2;x<16;x+=3.6){ctx.beginPath();ctx.moveTo(x,-32);ctx.lineTo(x+0.8,8);ctx.stroke();}
  Pth([[-6,-28.6],[-2.4,-28.6],[-2.4,4],[-6,4]]);fs('#eef5fb',OLW*0.4);for(const y of [-24,-17,-10,-3])dot(-4.2,y,0.8,'#d06a6a');
  Pth([[1.6,-21],[7.6,-21.4],[7.8,-15],[1.8,-14.6]]);fs('#c8dcf0',OLW*0.5);ctx.font='900 3.6px '+FONT;ctx.textAlign='center';ctx.fillStyle='#d06a6a';ctx.fillText('L',4.7,-16.4);},
 torsoOver(T){Pth([[-9,-T.h+0.4],[-3,-T.h-0.8],[-4.6,-T.h+4.6],[-8.4,-T.h+3.6]]);fs('#eef5fb',OLW*0.6);Pth([[-1,-T.h-0.8],[5,-T.h+0.6],[3.6,-T.h+3.6],[-1.4,-T.h+3]]);fs('#eef5fb',OLW*0.6);},
 faceFx(R){ell(-R*0.82,R*0.28,R*0.16,R*0.11,'rgba(230,100,90,.35)');ell(-R*0.06,R*0.3,R*0.2,R*0.13,'rgba(230,100,90,.35)');},
 face(R,t,st){const m=st.talk?0.6+0.3*Math.sin(t*6):0.45+0.1*Math.sin(t*2);
  // zamknięte oczy z rzęsami
  for(const [k,s] of [['far',0.78],['near',1]]){const x=F[k][0]*R,y=F[k][1]*R,w=R*0.15*s;
   ctx.beginPath();ctx.arc(x,y-R*0.04,w,0.25,PI-0.25);sk(OL,R*0.05);for(const a of [0.6,1.2,1.9])ln(x+Math.cos(a)*w,y-R*0.04+Math.sin(a)*w,x+Math.cos(a)*w*1.4,y-R*0.04+Math.sin(a)*w*1.45,OL,R*0.025);}
  curve([-R*0.86,-R*0.36],[-R*0.66,-R*0.5],[-R*0.48,-R*0.38],'#7a5030',R*0.05);curve([-R*0.26,-R*0.38],[-R*0.06,-R*0.52],[R*0.12,-R*0.4],'#7a5030',R*0.05);
  oell(-R*0.6,R*0.18,R*0.17,R*0.15,tint('#ecc29e',0.92),OLW*0.8);
  ctx.beginPath();ctx.ellipse(-R*0.38,R*0.58,R*0.09,R*0.1*m,0,0,7);fs('#5a1a1a',OLW*0.6);
  const d=(t*0.7)%1;ctx.fillStyle='rgba(190,225,255,.85)';ctx.beginPath();ctx.ellipse(-R*0.32,R*0.7+d*R*0.25,R*0.035,R*0.05+d*R*0.06,0,0,7);ctx.fill();
  Pth([[R*0.44,-R*0.36],[R*0.66,-R*0.3],[R*0.6,-R*0.02],[R*0.46,-R*0.12]]);fs('#8a5a32',0);},
 hat(R,t){ // szlafmyca opada za głowę, pompon się kołysze
  const sw=Math.sin(t*2.2)*R*0.15,tip=[R*1.55+sw,-R*0.35+Math.abs(sw)*0.5];
  const P=()=>{ctx.beginPath();ctx.moveTo(-R*0.96,-R*0.42);ctx.quadraticCurveTo(-R*0.7,-R*1.2,R*0.2,-R*1.16);ctx.quadraticCurveTo(R*1.2,-R*1.1,tip[0],tip[1]);ctx.quadraticCurveTo(R*1.0,-R*0.76,R*0.98,-R*0.36);ctx.quadraticCurveTo(0,-R*0.58,-R*0.96,-R*0.42);ctx.closePath();};
  P();ctx.fillStyle='#4a78c0';ctx.fill();ctx.save();P();ctx.clip();ctx.strokeStyle='#eef5fb';ctx.lineWidth=R*0.09;for(let x=-0.8;x<1.7;x+=0.34){ctx.beginPath();ctx.moveTo(x*R,-R*1.3);ctx.lineTo(x*R+R*0.3,-R*0.3);ctx.stroke();}ctx.fillStyle='rgba(20,30,60,.25)';ctx.fillRect(R*0.3,-R*1.4,R*1.6,R*1.2);ctx.restore();P();ctx.strokeStyle=OL;ctx.lineWidth=OLW*1.1;ctx.stroke();
  ctx.beginPath();ctx.moveTo(-R*1.0,-R*0.38);ctx.quadraticCurveTo(0,-R*0.62,R*1.0,-R*0.34);ctx.lineTo(R*0.98,-R*0.5);ctx.quadraticCurveTo(0,-R*0.78,-R*0.98,-R*0.56);ctx.closePath();fs('#eef5fb',OLW*0.8);
  oell(tip[0],tip[1],R*0.17,R*0.17,'#fff',OLW*0.8);
  // „z” unoszą się
  ctx.textAlign='center';for(let i=0;i<3;i++){const q=((t*0.5+i/3)%1);ctx.font='900 '+(R*0.3+q*R*0.25)+'px '+FONT;ctx.fillStyle='rgba(230,240,255,'+(1-q)+')';ctx.strokeStyle='rgba(30,40,80,'+(0.8*(1-q))+')';ctx.lineWidth=R*0.05;
   const x=-R*0.9-q*R*0.6+Math.sin(t*2+i)*R*0.15,y=-R*1.25-q*R*1.1;ctx.strokeText('z',x,y);ctx.fillText('z',x,y);}}
};
P.lunatyk=st=>{const t=st.t||0,p=base(st,0.3,-0.05);p.tilt=-0.14+0.04*Math.sin(t*1.5);
 p.arms[0]=st.eat?{sh:1.2+0.3*Math.sin(t*6),el:0.3+0.2*Math.sin(t*6)}:{sh:1.5+0.05*Math.sin(t*2),el:0.08};
 p.arms[1]={sh:0.75,el:1.15};return p;};

/* ---------- Lenin: łysina, rudawa bródka w szpic, kamizelka, kaszkiet w dłoni, wskazuje drogę ---------- */
const LEN={R:18,leg:[14.5,14.5],legW:[10.6,9.2,8],arm:[13.5,13],armW:[9.4,8.2,7.2],hipX:[-3.5,4],neckW:9.5,
 T:{h:29,sw:11.5,hw:10.5,belly:2,sk:9},skin:'#e4b494',pants:'#26262c',coat:'#2c2c34',sleeve:'#2c2c34',cuff:'#e8e4da',shoe:'#111',
 holdFar:{fn:holdKaszkiet},
 torsoFx(T){const c=this.coat,v=this.vest||'#3e3e48',sh=this.shirt||'#ece8de';
  Pth([[-10,-29],[0,-29],[-2,-6],[-9,-4]]);fs(v,0);for(const y of [-22,-17,-12])dot(-4.6,y,0.6,tint(v,0.6));
  Pth([[-7.4,-29.4],[-2.6,-29.4],[-4.6,-23]]);fs(sh,0);
  Pth([[-5.8,-28.6],[-3.6,-28.6],[-3.6,-21],[-4.6,-19.6],[-5.8,-21]]);fs(this.tie||'#8a1a1a',OLW*0.4);
  if(!this.vest)for(const [x,y] of [[-5,-27],[-4.2,-24.6],[-5,-22.4]])dot(x,y,0.35,'#f0e0d0');
  Pth([[0,-29],[3.6,-29.6],[0.6,-17],[-2,-6]]);fs(tint(c,0.85),OLW*0.5);Pth([[-10,-29],[-12.6,-25],[-9,-4]]);fs(tint(c,0.85),OLW*0.5);
  ln(-2,-6,-4,9,tint(c,0.6),0.8);},
 torsoOver(T){if(this.bronze)return;ctx.fillStyle='#d42a1e';Pth([[-11,-24],[-8,-26],[-9.6,-21]]);ctx.fill();Pth([[-9.6,-21],[-12.4,-19.4],[-11,-24]]);ctx.fill();oell(-10.2,-23,1.4,1.4,'#e03a2e',OLW*0.4);},
 faceFx(R){ell(-R*0.25,-R*0.66,R*0.34,R*0.13,'rgba(255,240,215,.6)',-0.25);},
 face(R,t,st){const m=st.talk?0.25+0.45*Math.abs(Math.sin(t*9)):0.05,hair=this.hair||'#9a5a2a',dark=this.bronze;
  if(dark)eyes(R,{rx:0.14,ry:0.16,lid:0.7,white:'#d8a060',pupil:'#a06a32',pr:0.04});else eyes(R,{rx:0.14,ry:0.17,lid:0.68,pupil:'#3a2a1c'});
  for(const k of ['far','near']){const x=F[k][0]*R,y=F[k][1]*R;ln(x+R*0.16,y+R*0.08,x+R*0.26,y+R*0.12,tint(this.skin,0.6),R*0.025);}
  curve([-R*0.88,-R*0.34],[-R*0.68,-R*0.46],[-R*0.46,-R*0.32],hair,R*0.07);curve([-R*0.26,-R*0.32],[-R*0.04,-R*0.46],[R*0.16,-R*0.36],hair,R*0.07);
  oell(-R*0.6,R*0.17,R*0.17,R*0.15,tint(this.skin,0.92),OLW*0.8);
  // bródka w szpic, wąsy, usta
  Pth([[-R*0.74,R*0.62],[-R*0.5,R*0.74],[-R*0.22,R*0.7],[-R*0.02,R*0.6],[-R*0.04,R*0.8],[-R*0.26,R*1.04],[-R*0.5,R*1.3],[-R*0.6,R*1.02],[-R*0.78,R*0.8]]);fs(hair,OLW*0.8);
  ctx.strokeStyle=tint(hair,0.7);ctx.lineWidth=R*0.03;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-R*(0.62-i*0.16),R*0.72);ctx.lineTo(-R*(0.5-i*0.04),R*(1.06-i*0.06));ctx.stroke();}
  if(m>0.1){ctx.beginPath();ctx.ellipse(-R*0.38,R*0.6,R*0.13,R*0.12*m,0,0,7);fs(dark?'#4a2a0a':'#4a1414',OLW*0.5);}
  Pth([[-R*0.82,R*0.46],[-R*0.56,R*0.34],[-R*0.36,R*0.4],[-R*0.14,R*0.34],[R*0.06,R*0.46],[-R*0.16,R*0.5],[-R*0.38,R*0.46],[-R*0.6,R*0.52]]);fs(hair,OLW*0.6);
  // rudawy wianuszek włosów z tyłu
  Pth([[R*0.4,-R*0.56],[R*0.88,-R*0.46],[R*0.96,R*0.06],[R*0.8,R*0.3],[R*0.64,-R*0.1],[R*0.48,-R*0.3]]);fs(hair,OLW*0.6);}
};
C.lenin=Object.assign({},LEN);
const leninPose=(st,boss)=>{const t=st.t||0,p=base(st,boss?0.3:0.36,boss?0.1:0.12),s=sw9(t);
 if(boss||st.talk){p.arms[0]={sh:2.12+0.04*Math.sin(t*2),el:0.05};p.tilt=-0.12;}
 if(st.eat&&!boss)p.arms[0]={sh:0.4+1.7*s,el:0.8-0.6*s};
 p.arms[1]={sh:0.15+(p.arms[1].sh||0)*0.4,el:0.75};
 if(boss){p.lean=st.eat?0.2:0.1;p.legs.forEach(l=>{l.kn*=0.7;});}
 return p;};
P.lenin=st=>leninPose(st,false);

/* ---------- Lenin z brązu: ten sam Lenin, ale pomnik: patyna, pęknięcia, gołąb na głowie ---------- */
C.boss=Object.assign({},LEN,{bronze:true,R:18.5,legW:[12,10.6,9.4],armW:[10.4,9,8],T:{h:30,sw:13.5,hw:11.5,belly:3,sk:9},neckW:11,shadow:38,
 skin:'#b4783c',pants:'#7a4e24',coat:'#8a5a2a',sleeve:'#8f5e2c',cuff:'#a06a32',shoe:'#5e3a18',vest:'#7a4e22',shirt:'#c48a48',tie:'#6e4420',hair:'#8a5a26',holdFar:null,
 back(J,t){ // kawałek cokołu przyklejony do butów
  const g=-J.shift;Pth([[-22,g-3],[20,g-3],[22,g+1],[-24,g+1]]);fs('#8a8478',OLW);ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(4,g-3,18,4);},
 faceFx(R){LEN.faceFx(R);ell(R*0.3,-R*0.3,R*0.2,R*0.12,'rgba(70,160,120,.55)');ell(-R*0.8,R*0.1,R*0.1,R*0.18,'rgba(70,160,120,.45)');ell(R*0.1,R*0.8,R*0.25,R*0.1,'rgba(70,160,120,.4)');
  if(CS.hp<0.6)crack([[-R*0.2,-R*1.0],[-R*0.05,-R*0.6],[-R*0.3,-R*0.3],[-R*0.1,R*0.1]],R*0.05);
  if(CS.hp<0.3)crack([[R*0.7,-R*0.7],[R*0.4,-R*0.3],[R*0.6,R*0.2],[R*0.3,R*0.6]],R*0.05);},
 torsoFx(T){LEN.torsoFx.call(this,T);
  ell(4,-20,3.4,2,'rgba(70,160,120,.5)');ell(-6,-6,2.6,1.6,'rgba(70,160,120,.45)');ell(8,2,2,3,'rgba(70,160,120,.4)');
  ln(-12,-26,-10,-10,'rgba(255,220,160,.45)',1);
  if(CS.hp<0.6)crack([[-7,-30],[-3,-22],[-6,-16],[-1,-8],[-3,0]],0.9);
  if(CS.hp<0.3){crack([[7,-28],[3,-20],[6,-12],[2,-4]],0.9);crack([[-3,-22],[2,-20]],0.7);}},
 hat(R,t){ // gołąb na łysinie
  const b=Math.max(0,Math.sin(t*3.2))*R*0.08;ctx.save();ctx.translate(R*0.05,-R*1.0-b*0.3);
  ctx.beginPath();ctx.ellipse(R*0.12,-R*0.18,R*0.34,R*0.2,-0.15,0,7);fs('#9aa0a8',OLW*0.8);
  Pth([[R*0.38,-R*0.24],[R*0.72,-R*0.36],[R*0.66,-R*0.12]]);fs('#6a7078',OLW*0.6);
  ctx.beginPath();ctx.ellipse(R*0.18,-R*0.2,R*0.2,R*0.1,-0.2,0,7);fs('#7e848c',OLW*0.5);
  ctx.beginPath();ctx.arc(-R*0.2,-R*0.36-b,R*0.14,0,7);fs('#8c929a',OLW*0.7);ell(-R*0.18,-R*0.26-b,R*0.1,R*0.05,'rgba(120,200,160,.8)');
  dot(-R*0.26,-R*0.4-b,R*0.03,'#d04a10');Pth([[-R*0.33,-R*0.36-b],[-R*0.44,-R*0.32-b],[-R*0.33,-R*0.3-b]]);fs('#e0a060',OLW*0.4);
  ln(-R*0.05,0,-R*0.08,R*0.06,'#d07a4a',R*0.04);ln(R*0.14,0,R*0.12,R*0.06,'#d07a4a',R*0.04);
  ctx.restore();
  ell(R*0.5,-R*0.82,R*0.08,R*0.1,'rgba(240,240,230,.85)');}   // pamiątka po gołębiu
});
P.boss=st=>leninPose(st,true);
})();
