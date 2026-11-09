/* Styl „Odnowa”, część 2: przodownik, carski sołdat, okupant, sekretarz partii i Zdzichu (bohater).
   Konfiguracje dla szkieletu z odnowa.js (ODN.C / ODN.P / ODN.H); twarze w 3/4 jak u pierwszej czwórki. */
(()=>{
if(!window.ODN)return;
const {eyes,ell,oell,dot,curve,rotp,walk,stand}=ODN,PI=Math.PI;
const star=(x,y,s,c)=>{const p=[];for(let i=0;i<10;i++){const a=-PI/2+i*PI/5,r=i%2?s*0.42:s;p.push([x+Math.cos(a)*r,y+Math.sin(a)*r]);}Pth(p);fs(c,OLW*0.5);};
const sw9=t=>Math.max(0,Math.sin(t*9));
// usta: otwarte (m 0..1) z górnymi zębami
function mouth(R,m){ODN.grim(R,m);}
function nose(R,col,big){oell(-R*0.6,R*0.17,R*(big||0.17),R*(big?big*0.85:0.15),col,OLW*0.8);ell(-R*0.66,R*0.11,R*0.05,R*0.03,'rgba(255,255,255,.45)');}
const brows=(R,c,ang)=>{const a=ang||0;Pth([[-R*0.88,-R*0.32-a*R],[-R*0.46,-R*0.36+a*R],[-R*0.44,-R*0.26+a*R],[-R*0.86,-R*0.22-a*R]]);fs(c,OLW*0.4);Pth([[-R*0.3,-R*0.32+a*R],[R*0.14,-R*0.4-a*R],[R*0.16,-R*0.3-a*R],[-R*0.28,-R*0.22+a*R]]);fs(c,OLW*0.4);};

/* ---------- Przodownik pracy: kark jak szafa, niebieski kombinezon, kask z lampką, kilof ---------- */
ODN.C.przodownik={R:18,leg:[14,14],legW:[12,10.4,8.8],arm:[13.5,13],armW:[11.4,10,8.6],hipX:[-4,4.5],neckW:12,shadow:32,
 T:{h:30,sw:15,hw:10,belly:1,sk:2},skin:'#e0aa82',pants:'#2e4a7a',coat:'#8a8a84',sleeve:'#8a8a84',cuff:'#e0aa82',shoe:'#2a2420',boot:'#1c1c1c',
 holdNear:{fn:holdKilof},
 torsoFx(T){
  // szelki i śliniak kombinezonu na szarej koszuli
  Pth([[-16,-18],[10,-19],[16,-14],[16,6],[-16,6]]);fs('#2e4a7a',0);
  Pth([[-9,-24],[3,-24.6],[3,-12],[-9,-12]]);fs('#2e4a7a',OLW*0.6);Pth([[-7,-21.6],[1,-22],[1,-16.6],[-7,-16.4]]);fs(tint('#2e4a7a',0.85),OLW*0.5);
  ln(-8,-24,-11,-32,'#1e3256',2.6);ln(2,-24.4,7,-32,'#1e3256',2.6);dot(-8.4,-23,1,'#c9a24a');dot(2.2,-23.4,1,'#c9a24a');
  // order i plakietka 300%
  star(-4.8,-28,2.2,'#d4281e');ln(-4.8,-31,-4.8,-29.4,'#c9a24a',1);
  Pth([[-6.6,-20.4],[-0.4,-20.6],[-0.4,-18],[-6.6,-17.8]]);fs('#f0e6c0',OLW*0.4);ctx.font='900 2.2px '+FONT;ctx.textAlign='center';ctx.fillStyle='#b8241c';ctx.fillText('300%',-3.5,-18.6);
  ell(8,-4,2.6,1.6,'rgba(30,20,10,.35)');ell(-10,-2,1.6,1.2,'rgba(30,20,10,.3)');
  ctx.fillStyle='#4a3420';ctx.fillRect(-20,-3,40,2.6);},
 torsoOver(T){Pth([[-T.sw+1,-T.h+3],[-T.sw+7,-T.h+0.6],[-T.sw+6,-T.h+5],[-T.sw+1,-T.h+6]]);fs('#7a7a74',OLW*0.5);},
 face(R,t,st){const m=st.talk?0.4+0.5*Math.abs(Math.sin(t*9)):0;
  eyes(R,{rx:0.14,ry:0.18});brows(R,'#3a2410',-0.02);
  nose(R,tint('#e0aa82',0.9),0.2);
  mouth(R,m);
  Pth([[-R*0.78,R*0.4],[-R*0.5,R*0.3],[-R*0.14,R*0.32],[R*0.02,R*0.42],[-R*0.36,R*0.42],[-R*0.72,R*0.46]]);fs('#3a2410',OLW*0.5);
  // szeroka szczęka z dołkiem, smar na policzku, pot
  ell(-R*0.3,R*0.86,R*0.5,R*0.12,'rgba(40,25,15,.18)');ln(-R*0.36,R*0.78,-R*0.34,R*0.9,tint('#e0aa82',0.6),R*0.03);
  ell(R*0.2,R*0.3,R*0.16,R*0.07,'rgba(40,40,40,.35)',0.3);
  const d=(t*1.6)%1;ctx.fillStyle='rgba(160,210,255,'+(1-d)+')';ctx.beginPath();ctx.ellipse(R*0.32,-R*0.5+d*R*0.6,R*0.04,R*0.07,0,0,7);ctx.fill();},
 hat(R,t){ // kask górniczy z lampką i snopem światła
  const P=()=>{ctx.beginPath();ctx.moveTo(R*1.02,-R*0.3);ctx.quadraticCurveTo(R*1.05,-R*1.28,-R*0.05,-R*1.3);ctx.quadraticCurveTo(-R*0.95,-R*1.22,-R*1.05,-R*0.5);ctx.lineTo(-R*1.25,-R*0.42);ctx.lineTo(-R*1.2,-R*0.3);ctx.quadraticCurveTo(0,-R*0.42,R*1.02,-R*0.3);ctx.closePath();};
  P();ctx.fillStyle='#f0c020';ctx.fill();ctx.save();P();ctx.clip();ctx.fillStyle='rgba(120,70,0,.3)';ctx.fillRect(R*0.3,-R*1.4,R,R*1.2);ln(-R*0.2,-R*1.3,R*0.1,-R*0.4,'#c89a10',R*0.08);ctx.fillStyle='rgba(255,255,255,.45)';ctx.beginPath();ctx.ellipse(-R*0.4,-R*1.0,R*0.28,R*0.08,-0.3,0,7);ctx.fill();ctx.restore();P();ctx.strokeStyle=OL;ctx.lineWidth=OLW*1.1;ctx.stroke();
  const g=0.6+0.4*Math.sin(t*4);ctx.fillStyle='rgba(255,240,150,'+(0.22*g)+')';ctx.beginPath();ctx.moveTo(-R*0.7,-R*0.9);ctx.lineTo(-R*2.6,-R*1.5);ctx.lineTo(-R*2.6,-R*0.3);ctx.closePath();ctx.fill();
  oell(-R*0.62,-R*0.88,R*0.2,R*0.18,'#5a5a5a',OLW*0.8);oell(-R*0.66,-R*0.88,R*0.13,R*0.12,'rgb(255,'+Math.round(230+20*g)+',150)',OLW*0.5);}
};
ODN.P.przodownik=st=>{const t=st.t||0,sp=16*(st.sp||0.24);
 const p=st.walk||st.eat?walk(t,sp,0.38,0.06):stand(t);
 if(st.eat){const s=sw9(t*0.9);p.lean=0.2;p.legs=[{th:0.32,kn:0.16},{th:-0.24,kn:0.12}];p.arms[0]={sh:-0.2+2.5*s,el:0.5};p.arms[1]={sh:0.4+0.6*s,el:0.9};}
 else p.arms[0]={sh:0.35+0.08*Math.sin(t*3),el:1.15};
 return p;};

/* ---------- Carski sołdat: długi szynel, papacha, wąsy jak kierownica, karabin z bagnetem ---------- */
ODN.C.carski={R:17,leg:[15,14.5],legW:[10.6,9.2,8],arm:[14,13.5],armW:[10,8.8,7.6],hipX:[-3.5,4],neckW:9.5,shadow:32,
 T:{h:31,sw:12.5,hw:13,belly:1,sk:17},skin:'#e2b590',pants:'#4e5434',coat:'#7a7560',sleeve:'#7a7560',cuff:'#a42a20',shoe:'#121212',boot:'#151515',
 holdNear:{fn:holdRifle(true)},
 torsoFx(T){
  // dwurzędowe guziki, pas z klamrą, rozcięcie poły
  for(const y of [-27,-21,-15,-9])for(const x of [-8.6,-2.4])dot(x,y,0.9,'#d4af37');
  ctx.fillStyle='#3a2a18';ctx.fillRect(-20,-6,40,3.4);Pth([[-7.6,-6.6],[-2.4,-6.6],[-2.4,-2],[-7.6,-2]]);fs('#d4af37',OLW*0.5);
  ln(-4,-2,-3,T.sk+1,tint('#7a7560',0.6),1);
  // kieszenie na naboje
  for(const x of [2,7]){Pth([[x,-6.4],[x+4.4,-6.4],[x+4.4,-1.4],[x,-1.4]]);fs('#5a4630',OLW*0.5);}},
 torsoOver(T){
  for(const [x,s] of [[-T.sw+3.4,1],[T.sw-3,0.8]]){Pth([[x-3.6*s,-T.h+1],[x+3.6*s,-T.h+1.6],[x+3.4*s,-T.h+4.2],[x-3.6*s,-T.h+3.6]]);fs('#c42a20',OLW*0.6);}
  // wysoki kołnierz
  Pth([[-7.6,-T.h-0.4],[4,-T.h-0.8],[4.6,-T.h+3],[-8,-T.h+3.2]]);fs(tint('#7a7560',0.9),OLW*0.7);Pth([[-7.6,-T.h+0.6],[-4.6,-T.h+0.6],[-4.6,-T.h+2.8],[-7.6,-T.h+2.8]]);fs('#c42a20',OLW*0.4);},
 face(R,t,st){const m=st.talk?0.4+0.5*Math.abs(Math.sin(t*9)):0.15;
  eyes(R,{rx:0.13,ry:0.18,lid:0.85});brows(R,'#3a2410',0.04);
  nose(R,'#d99a7a',0.19);
  mouth(R,m);
  // wąsy jak kierownica roweru, zakręcone do góry
  ctx.beginPath();ctx.moveTo(-R*0.38,R*0.34);ctx.bezierCurveTo(-R*0.8,R*0.2,-R*1.1,R*0.56,-R*1.18,R*0.16);ctx.bezierCurveTo(-R*1.0,R*0.5,-R*0.7,R*0.5,-R*0.38,R*0.46);ctx.bezierCurveTo(-R*0.06,R*0.5,R*0.22,R*0.5,R*0.32,R*0.16);ctx.bezierCurveTo(R*0.22,R*0.56,-R*0.04,R*0.2,-R*0.38,R*0.34);fs('#3a2410',OLW*0.7);
  Pth([[R*0.44,-R*0.3],[R*0.66,-R*0.26],[R*0.62,R*0.18],[R*0.48,R*0.1]]);fs('#3a2410',0);
  ell(-R*0.5,R*0.85,R*0.12,R*0.05,'rgba(40,25,15,.25)');},
 hat(R){ // papacha z czerwonym denkiem i kokardą
  const P=()=>{ctx.beginPath();ctx.moveTo(R*0.96,-R*0.38);ctx.lineTo(R*1.04,-R*1.42);ctx.quadraticCurveTo(0,-R*1.62,-R*0.98,-R*1.4);ctx.lineTo(-R*0.98,-R*0.5);ctx.quadraticCurveTo(0,-R*0.6,R*0.96,-R*0.38);ctx.closePath();};
  P();ctx.fillStyle='#6e6050';ctx.fill();ctx.save();P();ctx.clip();ctx.strokeStyle='#4e4236';ctx.lineWidth=R*0.05;
  for(let i=0;i<16;i++){const x=-R*1+i*R*0.13;ctx.beginPath();ctx.moveTo(x,-R*1.6);ctx.quadraticCurveTo(x+R*0.08,-R*1.0,x-R*0.02,-R*0.4);ctx.stroke();}
  ctx.fillStyle='rgba(30,15,5,.3)';ctx.fillRect(R*0.3,-R*1.7,R,R*1.4);ctx.restore();P();ctx.strokeStyle=OL;ctx.lineWidth=OLW*1.1;ctx.stroke();
  ctx.beginPath();ctx.ellipse(0,-R*1.46,R*0.92,R*0.14,-0.04,0,7);fs('#a42a20',OLW*0.8);
  oell(-R*0.42,-R*0.92,R*0.16,R*0.2,'#e8e4da',OLW*0.6);oell(-R*0.42,-R*0.92,R*0.09,R*0.12,'#2a2a2a',OLW*0.4);dot(-R*0.42,-R*0.92,R*0.04,'#d4af37');}
};
ODN.P.carski=st=>{const t=st.t||0,sp=16*(st.sp||0.2);
 const p=st.walk||st.eat?walk(t,sp,0.46,0.06):stand(t);
 // marsz: wysokie kolano z przodu
 if(st.walk&&!st.eat)p.legs.forEach((g,i)=>{const s=Math.sin(t*sp+(i?PI:0));if(s>0){g.th+=0.18*s;g.kn+=0.25*s;}});
 if(st.eat){p.lean=0.16;p.legs=[{th:0.32,kn:0.15},{th:-0.22,kn:0.12}];p.arms=[{sh:1.1+0.4*Math.sin(t*9),el:1.0},{sh:1.3,el:0.9}];}
 else p.arms=[{sh:0.45,el:1.35},{sh:1.0,el:0.95}];
 return p;};

/* ---------- Okupant z ’44: chudy i wysoki, hełm na nos, karabin, ładownice ---------- */
const HELM=R=>{ctx.beginPath();ctx.moveTo(R*1.12,-R*0.06);ctx.lineTo(R*1.0,-R*0.42);ctx.quadraticCurveTo(R*1.02,-R*1.38,-R*0.1,-R*1.34);ctx.quadraticCurveTo(-R*1.0,-R*1.26,-R*1.08,-R*0.46);ctx.lineTo(-R*1.24,-R*0.3);ctx.lineTo(-R*0.9,-R*0.32);ctx.quadraticCurveTo(R*0.1,-R*0.5,R*0.72,-R*0.22);ctx.lineTo(R*0.86,R*0.02);ctx.closePath();};
ODN.C.okupant={R:16.5,leg:[16.5,16],legW:[9.6,8.4,7.4],arm:[14.5,14],armW:[9,8,7],hipX:[-3,3.5],neckW:8,
 T:{h:30,sw:11.5,hw:9,belly:0,sk:7},skin:'#e2b590',pants:'#5d5f50',coat:'#6e705e',sleeve:'#6e705e',shoe:'#121212',boot:'#141414',
 holdNear:{fn:holdRifle(false)},
 torsoFx(T){
  Pth([[-6.4,-31],[-3.6,-31],[-3.6,-6],[-6.4,-6]]);fs(tint('#6e705e',0.9),OLW*0.4);for(const y of [-27,-21,-15,-9])dot(-5,y,0.7,'#9a9a8a');
  for(const [x0,x1] of [[-12,-7.6],[1,7]]){Pth([[x0,-25],[x1,-25],[x1,-19],[x0,-19]]);fs(tint('#6e705e',0.86),OLW*0.5);}
  // pas z ładownicami, chlebak przez ramię
  ctx.fillStyle='#2a2a24';ctx.fillRect(-20,-6.4,40,3.2);for(const x of [-13,-9.4,0.6]){Pth([[x,-7.6],[x+3.2,-7.6],[x+3.2,-2.4],[x,-2.4]]);fs('#3a3a30',OLW*0.5);}
  ctx.fillStyle='#4a4a3e';ctx.beginPath();ctx.moveTo(9,-31);ctx.lineTo(11.6,-30);ctx.lineTo(-6,-5);ctx.lineTo(-8.6,-6);ctx.fill();},
 torsoOver(T){Pth([[-7.6,-T.h-0.2],[3.6,-T.h-0.6],[4,-T.h+2.6],[-8,-T.h+2.8]]);fs(tint('#6e705e',0.78),OLW*0.6);
  for(const x of [-6.4,-3.6]){Pth([[x-1.2,-T.h+0.2],[x+1.2,-T.h+0.2],[x+1.2,-T.h+2.4],[x-1.2,-T.h+2.4]]);fs('#3a3e2e',OLW*0.3);ln(x-0.8,-T.h+1.3,x+0.8,-T.h+1.3,'#c8c8b8',0.4);}},
 // długi, wąski łeb
 headPath:null,
 face(R,t,st){const m=st.talk?0.4+0.5*Math.abs(Math.sin(t*9)):0.1,h=CS.helm>0;
  eyes(R,{rx:0.13,ry:0.15,lid:h?0.7:1,dy:0.04});brows(R,h?'#5a4a2a':'#c9a36a',0.06);
  nose(R,'#e0a684',0.15);ln(-R*0.66,R*0.3,-R*0.54,R*0.36,tint('#e2b590',0.6),R*0.03);
  mouth(R,m);
  ell(-R*0.36,R*0.84,R*0.28,R*0.1,'rgba(40,25,15,.2)');
  if(!h){ // jasne, krótko ostrzyżone włosy i siniak po hełmie
   ctx.beginPath();ctx.moveTo(R*0.9,-R*0.3);ctx.quadraticCurveTo(R*0.9,-R*1.12,-R*0.1,-R*1.04);ctx.quadraticCurveTo(-R*0.86,-R*0.98,-R*0.92,-R*0.5);ctx.quadraticCurveTo(-R*0.3,-R*0.72,R*0.4,-R*0.56);ctx.quadraticCurveTo(R*0.6,-R*0.4,R*0.9,-R*0.3);fs('#d8b46a',OLW*0.8);
   ell(-R*0.2,-R*0.68,R*0.18,R*0.1,'rgba(120,70,140,.4)');
   for(let i=0;i<3;i++){const a=t*4+i*2.1;ctx.fillStyle='#ffe066';star(Math.cos(a)*R*0.7,-R*1.2+Math.sin(a)*R*0.15,R*0.09,'#ffe066');}}},
 hat(R){if(!(CS.helm>0))return;
  HELM(R);ctx.fillStyle='#55594b';ctx.fill();ctx.save();HELM(R);ctx.clip();ctx.fillStyle='rgba(20,20,10,.32)';ctx.fillRect(R*0.25,-R*1.5,R*1.2,R*1.6);ctx.fillStyle='rgba(255,255,255,.22)';ctx.beginPath();ctx.ellipse(-R*0.4,-R*1.0,R*0.34,R*0.1,-0.4,0,7);ctx.fill();
  ln(-R*1.2,-R*0.36,R*0.9,-R*0.1,'#33362c',R*0.06);ctx.restore();HELM(R);ctx.strokeStyle=OL;ctx.lineWidth=OLW*1.1;ctx.stroke();
  // pasek pod brodą
  ln(R*0.62,-R*0.18,-R*0.1,R*0.9,'#2a2a1e',R*0.06);}
};
ODN.P.okupant=st=>{const t=st.t||0,sp=16*(st.sp||0.22);
 const p=st.walk||st.eat?walk(t,sp,0.42,0.05):stand(t);
 if(st.walk&&!st.eat)p.legs.forEach((g,i)=>{const s=Math.sin(t*sp+(i?PI:0));if(s>0){g.th+=0.22*s;g.kn=Math.max(0.05,g.kn-0.3*s);}});   // krok defiladowy: prosta noga
 if(st.eat){p.lean=0.16;p.legs=[{th:0.32,kn:0.15},{th:-0.22,kn:0.12}];p.arms=[{sh:1.1+0.4*Math.sin(t*9),el:1.0},{sh:1.3,el:0.9}];}
 else p.arms=[{sh:0.45,el:1.35},{sh:1.0,el:0.95}];
 return p;};

// megafon skierowany w lewo, przy ustach
function holdMega(far,ang){ctx.save();ctx.translate(0,3);ctx.rotate(-ang+PI);ctx.scale(0.95,0.95);
 Pth([[-2,-2.4],[6,-3],[17,-9],[17,9],[6,3],[-2,2.4]]);fs('#e8e4da');ctx.fillStyle='#c42a20';ctx.fillRect(3,-3.2,3,6.4);
 ctx.beginPath();ctx.ellipse(17,0,2.4,9,0,0,7);fs('#b8bcc0');ctx.beginPath();ctx.ellipse(17,0,1.2,6,0,0,7);ctx.fillStyle='#55585c';ctx.fill();ctx.restore();}
/* ---------- Sekretarz partii: okrągły jak beczka, order na orderze, megafon i uchwały ---------- */
ODN.C.sekretarz={R:19,leg:[12,12],legW:[11,9.4,8],arm:[12,11.5],armW:[9.4,8.4,7.4],hipX:[-4.5,5],neckW:10,shadow:34,
 T:{h:31,sw:11,hw:14,belly:9,sk:6},skin:'#e6b896',pants:'#3a2e22',coat:'#5a4632',sleeve:'#5a4632',cuff:'#e8e4da',shoe:'#1a1a1a',
 holdFar:{fn:holdPapers},holdNear:{fn:holdMega},
 torsoFx(T){
  Pth([[-10,-31.6],[-1,-31.6],[-5,-13]]);fs('#e8e4da',0);
  Pth([[-7,-30.6],[-4.4,-30.6],[-4.6,-15],[-5.8,-13],[-7,-15]]);fs('#6a2a1a',OLW*0.5);
  Pth([[-1,-31.6],[3,-32],[0,-21],[-5,-13]]);fs(tint('#5a4632',0.85),OLW*0.6);Pth([[-10,-31.6],[-13,-26],[-5,-13]]);fs(tint('#5a4632',0.85),OLW*0.6);
  // rząd orderów na piersi
  for(let i=0;i<5;i++){const x=1.6+i*2.4,y=-26+(i%2)*0.6;ctx.fillStyle=['#c42a20','#2a4fa0','#c9a24a','#c42a20','#3a8a4a'][i];ctx.fillRect(x-1,y-3,2,2.4);dot(x,y+0.8,1.1,i%2?'#d4af37':'#c0c4c8');}
  star(4,-19.4,1.8,'#d4af37');
  for(const y of [-9,-3])dot(-5,y,1,'#2a1a10');
  ell(-12,-6,2,1.4,'rgba(255,255,255,.12)');},
 headBack(R){oell(-R*0.3,R*0.94,R*0.56,R*0.26,tint('#e6b896',0.9),OLW);oell(-R*0.26,R*1.12,R*0.44,R*0.18,tint('#e6b896',0.86),OLW*0.8);},
 faceFx(R){ell(-R*0.25,-R*0.62,R*0.3,R*0.13,'rgba(255,255,255,.45)',-0.25);ell(-R*0.78,R*0.32,R*0.2,R*0.12,'rgba(220,80,60,.3)');},
 face(R,t,st){const m=st.talk?0.45+0.55*Math.abs(Math.sin(t*11)):0;
  eyes(R,{rx:0.11,ry:0.14,lid:0.75});
  ctx.fillStyle='rgba(200,230,255,.22)';ctx.strokeStyle=OL;ctx.lineWidth=R*0.06;
  for(const [k,s] of [['far',0.72],['near',1]]){ctx.beginPath();ctx.rect(ODN.F[k][0]*R-R*0.26*s,ODN.F[k][1]*R-R*0.2,R*0.52*s,R*0.36);ctx.fill();ctx.stroke();}
  ln(-R*0.46,-R*0.08,-R*0.36,-R*0.08,OL,R*0.06);ln(R*0.16,-R*0.08,R*0.6,-R*0.02,OL,R*0.05);
  brows(R,'#4a4a4a',-0.03);
  nose(R,'#e2a080',0.2);
  mouth(R,m);
  // siwa zaczeska, bokobrody
  ctx.strokeStyle='#6a6a6a';ctx.lineWidth=R*0.04;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(R*0.55,-R*(0.55+i*0.1));ctx.quadraticCurveTo(0,-R*(1.08+i*0.02),-R*(0.66-i*0.06),-R*(0.78+i*0.06));ctx.stroke();}
  Pth([[R*0.42,-R*0.5],[R*0.9,-R*0.3],[R*0.92,R*0.14],[R*0.78,0],[R*0.5,-R*0.24]]);fs('#8a8a86',OLW*0.6);
  const d=(t*1.5)%1;ctx.fillStyle='rgba(170,215,255,'+(1-d)+')';ctx.beginPath();ctx.ellipse(R*0.25,-R*0.66+d*R*0.5,R*0.04,R*0.06,0,0,7);ctx.fill();},
 front(J,t,st){ // przemowa leczy chołotę: zielone krzyżyki i fale z megafonu
  const A=J.arms[0],w=A.wr;
  for(let i=0;i<3;i++){const p=((t*0.7+i/3)%1);ctx.save();ctx.translate(w[0]-10-p*22,w[1]-14-p*18);ctx.globalAlpha=1-p;
   Pth([[-1,-3],[1,-3],[1,-1],[3,-1],[3,1],[1,1],[1,3],[-1,3],[-1,1],[-3,1],[-3,-1],[-1,-1]]);fs('#5ad06a',OLW*0.5);ctx.restore();}
  if(st.talk)for(let i=0;i<3;i++){const p=((t*2+i/3)%1);ctx.beginPath();ctx.arc(w[0]-30,w[1]-4,4+p*16,PI*0.75,PI*1.25);sk('rgba(255,255,255,'+(0.7*(1-p))+')',1.4);}}
};
ODN.P.sekretarz=st=>{const t=st.t||0,sp=16*(st.sp||0.18);
 const p=st.walk||st.eat?walk(t,sp,0.28,-0.04):stand(t,-0.02);
 if(st.walk&&!st.eat)p.tilt=-0.06*Math.sin(t*sp);   // kołysze się jak kaczka
 if(st.eat){const s=sw9(t);p.lean=0.12;p.legs=[{th:0.26,kn:0.12},{th:-0.2,kn:0.1}];p.arms[0]={sh:0.4+1.6*s,el:0.9-0.6*s};}
 else p.arms[0]={sh:1.5+(st.talk?0.1*Math.sin(t*5):0),el:0.75};
 p.arms[1]={sh:0.7,el:1.6};
 return p;};

/* ---------- Zdzichu: krępy dziadek z beczką-aparaturą na plecach, stułą, czerwonym nosem i białą brodą ---------- */
function dziadPose(t){
 const c=(t%2.8)/2.8;let sh,el;
 if(c<0.3){const k=ease(c/0.3);sh=lerp(0.7,2.3,k);el=lerp(0.5,0.9,k);}
 else if(c<0.4){const k=Math.pow((c-0.3)/0.1,0.6);sh=lerp(2.3,0.9,k);el=lerp(0.9,0.1,k);}
 else{const k=ease((c-0.4)/0.6);sh=lerp(0.9,0.7,k);el=lerp(0.1,0.5,k);}
 return{lean:0.05+(c>0.3&&c<0.45?0.06:0),tilt:-0.04,legs:[{th:0.2,kn:0.06},{th:-0.16,kn:0.1}],arms:[{sh,el},{sh:0.35+0.03*Math.sin(t*2.2),el:0.5}],c};
}
function still(J,t){ // miedziany kocioł z manometrem na drewnianej beczce, na plecach
 const s=rotp([16,-18],J.lean),x=s[0],y=s[1];
 ctx.save();ctx.translate(x,y);ctx.rotate(-J.lean*0.6);
 // szelki
 ln(-12,-14,-18,4,OL,3.4);ln(-12,-14,-18,4,'#6a4a2a',2);
 // beczka
 const B=()=>{ctx.beginPath();ctx.moveTo(-8,-6);ctx.quadraticCurveTo(-11,8,-8,22);ctx.lineTo(10,22);ctx.quadraticCurveTo(13,8,10,-6);ctx.closePath();};
 B();const g=ctx.createLinearGradient(-10,0,12,0);g.addColorStop(0,'#5e3c1e');g.addColorStop(0.4,'#a2723f');g.addColorStop(1,'#4a2e14');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 ctx.save();B();ctx.clip();for(let i=0;i<5;i++)ln(-6+i*4,-6,-6.6+i*4.2,22,'rgba(40,20,5,.35)',0.6);ctx.restore();
 for(const yy of [-1,17]){ln(-10.6,yy,12.6,yy,OL,3.2);ln(-10.6,yy,12.6,yy,'#5a5a5a',1.8);}
 ctx.font='900 7px '+FONT;ctx.textAlign='center';ctx.lineWidth=2;ctx.strokeStyle='#2a1608';ctx.strokeText('XXX',1,11);ctx.fillStyle='#f4e7c9';ctx.fillText('XXX',1,11);
 // miedziany kocioł na górze
 const K=()=>{ctx.beginPath();ctx.moveTo(-8,-5);ctx.bezierCurveTo(-11,-13,-7,-22,1,-22);ctx.bezierCurveTo(9,-22,13,-13,10,-5);ctx.closePath();};
 K();const g2=ctx.createLinearGradient(-10,0,12,0);g2.addColorStop(0,'#6a2a10');g2.addColorStop(0.35,'#e08a50');g2.addColorStop(0.5,'#ffc896');g2.addColorStop(1,'#5a200a');ctx.fillStyle=g2;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 // spiralna rurka i manometr
 ctx.beginPath();ctx.moveTo(1,-22);ctx.bezierCurveTo(2,-34,-14,-32,-12,-24);ctx.bezierCurveTo(-10,-18,-20,-18,-19,-26);sk(OL,3.6);
 ctx.beginPath();ctx.moveTo(1,-22);ctx.bezierCurveTo(2,-34,-14,-32,-12,-24);ctx.bezierCurveTo(-10,-18,-20,-18,-19,-26);sk('#c8703a',2.2);
 oell(8,-14,4,4,'#f2efe6',OLW*0.8);const a=-0.6+0.5*Math.sin(t*3);ln(8,-14,8+Math.cos(a)*3,-14+Math.sin(a)*3,'#c42a20',0.7);dot(8,-14,0.6,OL);
 // para z kotła
 for(let i=0;i<3;i++){const p=((t*0.5+i/3)%1);ctx.fillStyle='rgba(240,240,240,'+(0.45*(1-p))+')';ctx.beginPath();ctx.arc(-19+Math.sin(t*2+i)*1.5,-28-p*14,1.4+p*3,0,7);ctx.fill();}
 ctx.restore();
 return[x+2,y+20];
}
const DZ={R:19,leg:[13,12.5],legW:[11.6,10,8.6],arm:[12.5,12],armW:[10.4,9,8],hipX:[-4,5],neckW:11,shadow:32,
 T:{h:30,sw:12.5,hw:12,belly:5,sk:9},skin:'#e0a07a',pants:'#3c3a34',coat:'#4a5a3e',sleeve:'#4a5a3e',shoe:'#1c1c1a',boot:'#1c1c1a',
 holdNear:{fn:holdKropidlo},holdFar:{fn:holdBottle},
 back(J,t){J.tap=still(J,t);},
 torsoFx(T){
  // guziki, pas, łata
  for(const y of [-14,-8])dot(-6.6,y,0.9,'#2a2a1e');
  ctx.fillStyle='#3a2a18';ctx.fillRect(-20,-4,40,3);Pth([[-9,-4.6],[-5,-4.6],[-5,-0.4],[-9,-0.4]]);fs('#b8a050',OLW*0.5);
  Pth([[4,-12],[9,-12.4],[9.4,-7],[4.4,-6.6]]);fs('#6a7a50',OLW*0.5);ctx.strokeStyle='#e8dcb0';ctx.lineWidth=0.4;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(4.4+i*1.3,-12.6);ctx.lineTo(4.8+i*1.3,-11.2);ctx.stroke();}},
 torsoOver(T,t){ // stuła z krzyżykami, zwisa spod brody
  const sw=Math.sin(t*2.2)*0.5;
  for(const [x0,x1,c] of [[-10,-6,'#c42a20'],[-3,0.6,'#b8241c']]){Pth([[x0,-T.h+1],[x1,-T.h+1],[x1+0.8+sw,T.sk-1],[x0+0.8+sw,T.sk-1]]);fs(c,OLW*0.6);
   ln(x0+0.4,-T.h+2,x0+1+sw,T.sk-2,'#e8c050',0.6);ln(x1-0.4,-T.h+2,x1+0.4+sw,T.sk-2,'#e8c050',0.6);
   const cx=(x0+x1)/2+0.6+sw;ln(cx,T.sk-8,cx,T.sk-3.4,'#e8c050',1);ln(cx-1.6,T.sk-6.6,cx+1.6,T.sk-6.6,'#e8c050',1);
   Pth([[x0+0.8+sw,T.sk-1],[x1+0.8+sw,T.sk-1],[x1+0.8+sw,T.sk+1.6],[x0+0.8+sw,T.sk+1.6]]);fs('#e8c050',OLW*0.4);}},
 face(R,t){
  eyes(R,{rx:0.13,ry:0.17,lid:0.6,dy:0.02});
  // krzaczaste białe brwi, zmarszczone
  for(const [x0,x1] of [[-0.98,-0.42],[-0.3,0.2]]){ctx.beginPath();ctx.moveTo(x0*R,-R*0.3);ctx.quadraticCurveTo((x0+x1)/2*R,-R*0.5,x1*R,-R*0.24);ctx.lineTo(x1*R,-R*0.16);ctx.quadraticCurveTo((x0+x1)/2*R,-R*0.32,x0*R,-R*0.2);fs('#efece4',OLW*0.6);}
  ln(-R*0.36,-R*0.42,-R*0.3,-R*0.3,tint('#e0a07a',0.6),R*0.03);
  // biała broda do pasa
  const sw=Math.sin(t*2.2)*R*0.04;
  ctx.beginPath();ctx.moveTo(-R*0.9,R*0.22);ctx.quadraticCurveTo(-R*1.06,R*0.9,-R*0.7+sw,R*1.5);ctx.quadraticCurveTo(-R*0.5+sw,R*1.9,-R*0.3+sw,R*1.62);ctx.quadraticCurveTo(-R*0.1+sw,R*1.86,R*0.1+sw,R*1.5);ctx.quadraticCurveTo(R*0.42,R*1.1,R*0.52,R*0.42);ctx.quadraticCurveTo(R*0.3,R*0.62,R*0.1,R*0.4);ctx.quadraticCurveTo(-R*0.4,R*0.3,-R*0.9,R*0.22);ctx.closePath();
  fs('#e8e6de',OLW);
  ctx.strokeStyle='#bdb9ae';ctx.lineWidth=R*0.03;for(const [x,y] of [[-0.6,0.7],[-0.3,0.8],[0,0.75],[-0.45,1.1],[-0.1,1.15]]){ctx.beginPath();ctx.moveTo(x*R,y*R);ctx.quadraticCurveTo(x*R-R*0.06+sw,(y+0.2)*R,x*R+sw,(y+0.36)*R);ctx.stroke();}
  // sumiaste wąsy i czerwony nos-pomidor
  Pth([[-R*1.02,R*0.5],[-R*0.82,R*0.3],[-R*0.5,R*0.3],[-R*0.12,R*0.32],[R*0.12,R*0.52],[-R*0.12,R*0.48],[-R*0.42,R*0.44],[-R*0.76,R*0.52]]);fs('#f4f2ec',OLW*0.7);
  oell(-R*0.64,R*0.14,R*0.24,R*0.2,'#e0564a',OLW*0.9);ell(-R*0.72,R*0.07,R*0.07,R*0.045,'rgba(255,255,255,.55)');
  ln(-R*0.56,R*0.56,-R*0.3,R*0.6,'#7a2a20',R*0.05);},
 hat(R){ // stara, wymięta czapka z daszkiem
  const P=()=>{ctx.beginPath();ctx.moveTo(R*0.98,-R*0.34);ctx.quadraticCurveTo(R*1.08,-R*1.08,R*0.1,-R*1.18);ctx.quadraticCurveTo(-R*0.72,-R*1.14,-R*0.92,-R*0.62);ctx.lineTo(-R*1.42,-R*0.48);ctx.quadraticCurveTo(-R*1.46,-R*0.36,-R*1.26,-R*0.34);ctx.lineTo(-R*0.6,-R*0.42);ctx.quadraticCurveTo(R*0.2,-R*0.5,R*0.98,-R*0.34);ctx.closePath();};
  P();ctx.fillStyle='#3d3934';ctx.fill();ctx.save();P();ctx.clip();ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(R*0.3,-R*1.3,R,R);ln(-R*0.5,-R*0.94,R*0.4,-R*1.06,'#55504a',R*0.04);ctx.restore();P();ctx.strokeStyle=OL;ctx.lineWidth=OLW*1.1;ctx.stroke();
  ln(-R*1.32,-R*0.42,-R*0.62,-R*0.46,'#1d1b19',R*0.05);
  // siwe kosmyki spod czapki
  Pth([[R*0.4,-R*0.42],[R*0.9,-R*0.32],[R*0.94,R*0.1],[R*0.78,-R*0.02],[R*0.5,-R*0.2]]);fs('#dcd8ce',OLW*0.5);},
 front(J,t){ // wąż z beczki do kropidła i strumień święconej
  const A=J.arms[0],w=A.wr,tap=J.tap||[20,-50];
  ctx.beginPath();ctx.moveTo(tap[0],tap[1]);ctx.quadraticCurveTo((tap[0]+w[0])/2+4,Math.max(tap[1],w[1])+14,w[0],w[1]);sk(OL,4.4);
  ctx.beginPath();ctx.moveTo(tap[0],tap[1]);ctx.quadraticCurveTo((tap[0]+w[0])/2+4,Math.max(tap[1],w[1])+14,w[0],w[1]);sk('#3a3a3a',2.6);
  const c=(t%2.8)/2.8;if(c<0.36||c>0.75)return;
  const q=(c-0.36)/0.39,d=[A.wr[0]-A.el[0],A.wr[1]-A.el[1]],n=Math.hypot(d[0],d[1])||1,bx=A.wr[0]+d[0]/n*36,by=A.wr[1]+d[1]/n*36;
  for(let i=0;i<9;i++){const an=-0.7+i*0.17,r=6+q*46;ctx.fillStyle='rgba(150,200,255,'+(0.9*(1-q))+')';ctx.beginPath();ctx.ellipse(bx-Math.cos(an)*r,by+Math.sin(an)*r+q*q*26,1.8,2.6,0,0,7);ctx.fill();
   ctx.fillStyle='rgba(255,240,170,'+(0.8*(1-q))+')';ctx.beginPath();ctx.arc(bx-Math.cos(an)*r,by+Math.sin(an)*r+q*q*26-3,0.8,0,7);ctx.fill();}}
};
ODN.C.dziad=DZ;
ODN.P.dziad=st=>dziadPose(st.t||0);
ODN.H=t=>ODN.figure(DZ,dziadPose(t),t,{t});
})();
