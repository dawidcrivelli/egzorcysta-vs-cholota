/* Styl „Odnowa”: ten sam silnik co w grze (szkielet, kontur, dwa tony), ale nowe stroje, twarze i rekwizyty.
   Inspiracja: katalog postaci z generatora obrazków. Większa głowa i dłonie, dwoje oczu, mocniejsze miny.
   Używa globalnych funkcji gry (drawFigure, poseFor, Pth, fs, ln, tint, limb, lp…), rysuje tylko na karcie stylu. */
(()=>{
const N={};
const eye=(x,y,rx,ry,col,px,py,pr,pc)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,7);fs(col,OLW*0.55);ctx.fillStyle=pc||'#1a1410';ctx.beginPath();ctx.arc(x+(px||0),y+(py||0),pr||0.7,0,7);ctx.fill();};
const dot=(x,y,r,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();};
const ell=(x,y,rx,ry,c,a)=>{ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,a||0,0,7);ctx.fill();};
// kaszkiet: płaska czapka z daszkiem w lewo; kratka opcjonalnie
function flatCap(col,check,tilt){
 ctx.save();ctx.rotate(tilt||0);
 const P=[[7.4,-10.8],[7.6,-15.4],[2.4,-19.4],[-5.4,-18.4],[-8.2,-15],[-13,-13.6],[-13.2,-12.2],[-7,-11.8],[-2.6,-12.6],[3.4,-12]];
 Pth(P);fs(col);
 ctx.save();Pth(P);ctx.clip();ctx.fillStyle=tint(col,0.72);ctx.fillRect(2.4,-21,8,10);
 if(check){ctx.strokeStyle=tint(col,0.6);ctx.lineWidth=0.35;for(let x=-12;x<9;x+=2.2){ctx.beginPath();ctx.moveTo(x,-20);ctx.lineTo(x+1.6,-11);ctx.stroke();}for(let y=-19;y<-11;y+=2.2){ctx.beginPath();ctx.moveTo(-14,y);ctx.lineTo(9,y+0.8);ctx.stroke();}}
 ctx.restore();
 ln(-12.8,-12.6,-7,-12.2,tint(col,0.45),0.8);ln(-4.6,-16.8,4,-18,tint(col,1.25),0.5);
 ctx.beginPath();ctx.arc(0.6,-19.2,0.9,0,7);fs(tint(col,0.85),OLW*0.5);
 ctx.restore();
}
// palce: trzy krótkie kreski w kierunku przedramienia (dłoń ma środek w (0,3))
function fingers(col,claw){return function(far){const c=far?tint(col,0.8):col;
 for(const [x,a] of [[-1.8,0.25],[0,0],[1.8,-0.25]]){ctx.save();ctx.translate(x,5.6);ctx.rotate(a);
  ln(0,0,0,claw?4.4:3,OL,claw?2.4:2.8);ln(0,0,0,claw?4.4:3,c,claw?1.3:1.7);
  if(claw){Pth([[-0.6,4.2],[0.6,4.2],[0,6.2]]);fs('#e8e0c0',OLW*0.4);}ctx.restore();}};}

/* ---------- Trup: zombiak w brązowej marynarce, kaszkiet na bakier, świecące oczy ---------- */
N.trup={skin:'#93a86e',pants:'#4c4438',coat:'#6e4c2e',sleeve:'#6e4c2e',shoe:'#2a2420',skirt:8,ragged:true,bareNear:true,brow:'rgba(0,0,0,0)',noMouth:true,noEye:false,
 cuff:'#93a86e',
 holdNear:{fn:fingers('#93a86e',true)},holdFar:{fn:fingers('#93a86e',true)},
 torsoFx(t){
  // rozpięta marynarka: brudna koszula z przodu, porwana na brzegu
  Pth([[-9,-31],[-3.6,-32.6],[-2.6,-20],[-4.4,-17],[-2.8,-13],[-4.8,-9],[-3.6,-4],[-9,-3]]);fs('#c2b48a',0);
  ln(-6.6,-31,-5.4,-16,'#6a1a16',1.4);ctx.fillStyle='rgba(90,70,40,.45)';ctx.beginPath();ctx.ellipse(-6,-10,2,1.4,0,0,7);ctx.fill();
  ln(-3.6,-32.6,-2.6,-20,tint('#6e4c2e',0.6),0.8);ln(-2.6,-20,-4.4,-17,tint('#6e4c2e',0.6),0.8);
  // dziura z żebrami
  Pth([[1,-24],[4.4,-25],[5.6,-19.6],[3.6,-15],[1.2,-16.4],[1.8,-20]]);fs('#1b1914',OLW*0.6);
  ctx.strokeStyle='#d8d0b4';ctx.lineWidth=0.7;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(1.6,-23+i*2.4);ctx.quadraticCurveTo(3.4,-24+i*2.4,4.8,-22.4+i*2.4);ctx.stroke();}
  // łata ze ściegami
  Pth([[-1,-10],[4.6,-10.6],[5,-5.4],[-0.6,-5]]);fs('#8a7a50',OLW*0.5);ctx.strokeStyle='#e8dcb0';ctx.lineWidth=0.35;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-0.6+i*1.3,-10.8);ctx.lineTo(-0.2+i*1.3,-9.4);ctx.stroke();}
  ctx.fillStyle='rgba(60,80,30,.35)';ctx.beginPath();ctx.ellipse(5,-29,2.4,1.6,0,0,7);ctx.fill();},
 torsoOver(){ // postrzępiony kołnierz
  Pth([[-6.4,-33],[-1,-35.6],[5,-33.4],[3.6,-30.6],[0.6,-32.4],[-1.8,-30.8],[-4.6,-31.8]]);fs('#5a3c22',OLW*0.7);},
 faceFx(){ell(-1.6,-4.6,3.4,2.2,'rgba(40,55,25,.45)');ell(-3.8,-9.4,3.6,3,'rgba(40,40,30,.35)');ell(0.8,-9.6,2.6,2.6,'rgba(40,40,30,.3)');},
 eyeFn(t){const g=0.85+0.15*Math.sin(t*5);
  ctx.save();ctx.shadowColor='rgba(240,250,120,.9)';ctx.shadowBlur=3;
  eye(0.9,-9.8,1.6,1.9,'rgb(240,240,'+Math.round(140*g)+')',-0.5,0,0.45);
  eye(-4.2,-9.8,2.3,2.5,'rgb(246,246,'+Math.round(150*g)+')',-0.6,0.1,0.55);
  ctx.restore();ln(-6.4,-12.8,-2,-12,'#2e3622',0.9);ln(0,-12,2.2,-12.6,'#2e3622',0.8);},
 headFx(t){const j=0.5+0.5*Math.sin(t*3);
  // otwarta paszcza z krzywymi zębami
  Pth([[-7.4,-5.4],[-1.2,-4.6],[-1.6,-1.2-j],[-4.4,0.2-j*1.2],[-7,-1.6-j*0.6]]);fs('#2a0e0c',OLW*0.6);
  ell(-4.2,-1.4-j*0.8,1.6,0.7,'#7a2a26');
  ctx.fillStyle='#ece4c4';for(const [x,w,h] of [[-6.6,1.1,1.6],[-5,1,1.1],[-3.4,1.2,1.8],[-1.9,0.8,1]])Pth([[x,-5.2],[x+w,-5],[x+w/2,-5+h]]),ctx.fill();
  Pth([[-5.6,-0.4-j],[-4.6,-0.4-j],[-5.1,-1.6-j]]);ctx.fill();
  // szwy na czole, naderwane ucho
  ln(-3,-15,2.4,-14,'#3a2a20',0.4);for(let i=0;i<4;i++)ln(-2.4+i*1.5,-15.6,-2.2+i*1.5,-13.6,'#3a2a20',0.35);
  Pth([[3.4,-6.8],[5.2,-6],[4.6,-4.8]]);fs('#1b1914',0);
  // kępki włosów spod kaszkietu
  ctx.strokeStyle='#2a2a22';ctx.lineWidth=0.5;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(4+i*0.8,-12);ctx.quadraticCurveTo(6+i,-10,6.4+i*0.6,-8.6+Math.sin(t*2+i)*0.6);ctx.stroke();}
  flatCap('#5a4a3a',false,0.18);
  ctx.save();ctx.rotate(0.18);Pth([[-1,-18.6],[2,-19.4],[1.6,-17.4]]);fs('#2a2018',0);ctx.restore();}
};

/* ---------- Sąsiad: kaszkiet w kratkę, wąsy, czerwony nos, kamizelka, gąsior XXX ---------- */
function holdGasior(far,ang){ctx.save();ctx.translate(0,4);ctx.rotate(-ang);ctx.scale(0.9,0.9);
 ctx.beginPath();ctx.moveTo(-1.6,-9);ctx.lineTo(-1.6,-6);ctx.bezierCurveTo(-7,-5,-7,7,-4.6,8);ctx.lineTo(4.6,8);ctx.bezierCurveTo(7,7,7,-5,1.6,-6);ctx.lineTo(1.6,-9);ctx.closePath();
 fs('rgba(200,230,215,.9)',OLW*0.8);
 ctx.save();ctx.beginPath();ctx.moveTo(-6,-1);ctx.lineTo(6,-1);ctx.lineTo(6,9);ctx.lineTo(-6,9);ctx.clip();ctx.beginPath();ctx.moveTo(-1.6,-9);ctx.lineTo(-1.6,-6);ctx.bezierCurveTo(-7,-5,-7,7,-4.6,8);ctx.lineTo(4.6,8);ctx.bezierCurveTo(7,7,7,-5,1.6,-6);ctx.closePath();ctx.fillStyle='rgba(232,196,90,.85)';ctx.fill();ctx.restore();
 Pth([[-4.2,0],[4.2,0],[4,4.8],[-4,4.8]]);fs('#efe2bc',OLW*0.5);
 ctx.font='900 3.6px '+FONT;ctx.textAlign='center';ctx.fillStyle='#8a1a12';ctx.fillText('XXX',0,3.8);
 ctx.fillStyle='rgba(255,255,255,.6)';ctx.fillRect(-4.6,-4,0.8,7);
 Pth([[-1.8,-9],[1.8,-9],[1.8,-11.2],[-1.8,-11.2]]);fs('#c8b48a',OLW*0.6);ctx.restore();}
N.sasiad={skin:'#e8a882',pants:'#2f4f9a',coat:'#eceae0',sleeve:'#e8a882',shoe:'#e8e8e8',skirt:0,legStripe:'#f0f0f0',brow:'rgba(0,0,0,0)',noMouth:true,
 holdNear:{fn:holdGasior},holdFar:{fn:fingers('#e8a882')},
 body:[[7,-1],[7.6,-14],[7.2,-27],[5.6,-32.6],[0,-34.6],[-5.2,-33.2],[-8.6,-27.5],[-12.6,-18],[-12.8,-9],[-8.6,-1]],
 torsoFx(){
  // podkoszulek z plamami, owłosiona pierś
  ell(-8,-14,2.4,1.6,'rgba(180,150,60,.4)');ell(-4,-24,1.4,1,'rgba(180,150,60,.35)');
  ctx.fillStyle='#e8a882';Pth([[-5.6,-34],[3.6,-35],[1,-29.6],[-3.6,-29.6]]);ctx.fill();
  for(const x of [-2,-0.6,0.8])ln(x,-35,x+0.4,-31,'#3a2618',0.45);
  // kamizelka w jodełkę, rozpięta
  const V=[[0.6,-35],[8,-33],[8,-1],[-1.2,-1],[-0.6,-12],[-2.2,-22],[-1.6,-30]];Pth(V);ctx.fillStyle='#6a5a3a';ctx.fill();
  ctx.save();Pth(V);ctx.clip();ctx.strokeStyle='#58492e';ctx.lineWidth=0.6;for(let y=-36;y<0;y+=2.2){ctx.beginPath();ctx.moveTo(-3,y);ctx.lineTo(9,y+1.4);ctx.stroke();}ctx.restore();
  Pth(V);ctx.strokeStyle=OL;ctx.lineWidth=OLW*0.8;ctx.stroke();
  for(const y of [-25,-18,-11])dot(-0.6,y,0.7,'#2a2018');
  // gruby pasek pod brzuchem
  ctx.fillStyle='#2a1a10';ctx.fillRect(-12,-3.4,20,2.4);ctx.fillStyle='#b8a050';ctx.fillRect(-10,-3.6,2.6,2.8);},
 faceFx(){ // zarost
  ctx.fillStyle='rgba(60,40,30,.28)';ctx.beginPath();ctx.ellipse(-2,-3,6.6,3.6,0,0,7);ctx.fill();
  ctx.fillStyle='rgba(50,30,20,.5)';for(const [x,y] of [[-5,-2],[-3,-1.4],[-1,-2.2],[1,-1.6],[-4,0],[-2,0.4],[0.4,-0.2],[2.4,-2.6]])ctx.fillRect(x,y,0.35,0.35);},
 eyeFn(t){const sq=0.6+0.4*Math.max(0,Math.sin(t*1.3));
  eye(0.8,-9.6,1.3,1.4*sq,'#fbf3e4',-0.4,0,0.55);eye(-3.8,-9.8,1.8,1.9*sq,'#fbf3e4',-0.6,0.1,0.7);
  // krzaczaste brwi, chytra mina
  Pth([[-6.8,-12.4],[-1.6,-13.4],[-1.4,-12],[-6.4,-11.2]]);fs('#3a2618',OLW*0.4);Pth([[-0.2,-12.8],[2.6,-13],[2.6,-12],[0,-11.8]]);fs('#3a2618',OLW*0.4);},
 headFx(t){
  // czerwony kartofel-nos
  ctx.beginPath();ctx.ellipse(-8.6,-6.8,2.6,2.2,0.2,0,7);fs('#d9665a',OLW*0.7);ell(-9.2,-7.6,0.8,0.5,'rgba(255,255,255,.5)');
  // uśmieszek i sumiaste wąsy
  ctx.beginPath();ctx.moveTo(-6.4,-2.8);ctx.quadraticCurveTo(-4,-1.2,-1.6,-3.2);sk('#4a1a14',0.7);
  Pth([[-9.6,-4.6],[-7.4,-5.8],[-4.4,-5.8],[-1.4,-4.4],[-0.6,-2.4],[-2.6,-3.6],[-4.6,-3.8],[-6.8,-3.6],[-9,-2.8],[-10.4,-3.4]]);fs('#4a3020',OLW*0.6);
  ln(-7,-5,-5,-4.4,'#6a4a30',0.4);ln(-4,-5,-2,-4,'#6a4a30',0.4);
  // bokobrody spod czapki
  Pth([[3.2,-12],[5.6,-11.4],[5.4,-8],[3.8,-9]]);fs('#4a3020',0);
  flatCap('#7a6a58',true,0.04);}
};

/* ---------- Urzędnik: aparatczyk, brązowy garnitur, łysina z zaczeską, okulary, podwójny podbródek ---------- */
N.urzednik={skin:'#ecc09c',pants:'#4e4030',coat:'#6a5640',sleeve:'#6a5640',shoe:'#1a1a1a',skirt:9,cuff:'#ece8de',brow:'rgba(0,0,0,0)',noMouth:true,
 holdNear:{fn:holdStamp},holdFar:{fn:holdTeczka},
 body:[[7,-1],[7.6,-14],[7.2,-27],[5.6,-32.6],[0,-34.6],[-5.2,-33.2],[-8.4,-27.5],[-11.4,-19],[-11.6,-10],[-8.4,-1]],
 collarFx(){ // podwójny podbródek wychodzi pod głowę
  ctx.beginPath();ctx.ellipse(-2.6,-0.6,5.4,2.6,0.1,0,7);fs(tint('#ecc09c',0.9),OLW*0.7);},
 torsoFx(){
  Pth([[-8.6,-30],[-4,-33.2],[-3,-16],[-8,-13]]);ctx.fillStyle='#ece8de';ctx.fill();
  Pth([[-6.2,-31.8],[-4.6,-32],[-3.8,-19],[-5.2,-17],[-6.8,-19]]);ctx.fillStyle='#a4241c';ctx.fill();ln(-6,-27,-4.2,-28,'#d84a3a',0.5);ln(-6.2,-23,-4.2,-24,'#d84a3a',0.5);
  // klapy marynarki
  Pth([[-4,-33.2],[-1,-34],[-1.8,-26],[-3,-16]]);fs(tint('#6a5640',0.85),OLW*0.5);Pth([[-8.6,-30],[-9.8,-25],[-8,-13]]);fs(tint('#6a5640',0.85),OLW*0.5);
  // znaczek partyjny i kieszonka z długopisami
  Pth([[-1.4,-26.6],[-0.8,-25],[0.8,-25],[-0.4,-24],[0,-22.4],[-1.4,-23.4],[-2.8,-22.4],[-2.4,-24],[-3.6,-25],[-2,-25]]);fs('#d4281e',OLW*0.35);
  Pth([[1,-21],[6,-21.4],[6,-19.6],[1,-19.2]]);fs(tint('#6a5640',0.8),OLW*0.4);ln(2.4,-21,2.6,-24,'#2a4fa0',0.9);ln(4,-21.2,4.2,-23.6,'#c42a20',0.9);
  for(const y of [-14,-8])dot(-2.6,y,0.7,'#2a1a10');},
 eyeFn(t){const bl=(t%3.4)<0.12;
  if(bl){ln(-5.8,-9.6,-2.6,-9.6,OL,0.6);ln(0,-9.6,1.8,-9.6,OL,0.5);}
  else{eye(0.9,-9.6,1.1,1.2,'#fbf6ea',-0.3,0,0.45);eye(-4.2,-9.6,1.4,1.5,'#fbf6ea',-0.5,0,0.55);}
  // grube okrągłe okulary
  ctx.fillStyle='rgba(200,230,255,.28)';ctx.beginPath();ctx.arc(-4.2,-9.6,2.9,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(1,-9.6,2,2.6,0,0,7);ctx.fill();
  ctx.strokeStyle=OL;ctx.lineWidth=0.75;ctx.beginPath();ctx.arc(-4.2,-9.6,2.9,0,7);ctx.stroke();ctx.beginPath();ctx.ellipse(1,-9.6,2,2.6,0,0,7);ctx.stroke();
  ln(-1.3,-10,-1,-10,OL,0.7);ln(3,-10,6.4,-10.6,OL,0.6);
  ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=0.4;ctx.beginPath();ctx.arc(-4.2,-9.6,2.2,3.6,4.4);ctx.stroke();
  // brwi zmarszczone ku nosowi
  ln(-6.8,-13.4,-2.4,-12.6,'#5a5048',1);ln(0,-12.4,2.4,-13,'#5a5048',0.8);},
 headFx(t){
  // nos-kluska, wąsik, skwaszone usta
  ctx.beginPath();ctx.ellipse(-8.6,-7,2,1.7,0.2,0,7);fs('#e2a888',OLW*0.6);
  Pth([[-8.2,-5.6],[-4.6,-5.8],[-3.4,-4.8],[-5.6,-4.6],[-8,-4.6]]);fs('#4a4038',OLW*0.4);
  ctx.beginPath();ctx.moveTo(-6.8,-2.4);ctx.quadraticCurveTo(-4.8,-3.6,-2.8,-2.2);sk('#7a3a2a',0.8);
  // siwe boki, zaczeska przez łysinę, połysk
  Pth([[3.4,-14.2],[7.4,-12.8],[8.2,-10],[6.6,-11],[4.6,-11.8]]);fs('#9a948a',OLW*0.5);
  ell(-2.6,-15.2,3,1.2,'rgba(255,255,255,.55)',-0.25);
  ctx.strokeStyle='#5a5048';ctx.lineWidth=0.55;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(5.2,-13-i*1.2);ctx.quadraticCurveTo(0,-17.6-i*0.4,-5.4+i*0.6,-14.4-i*0.6);ctx.stroke();}
  // kropla potu
  const d=(t*0.8)%1;ctx.fillStyle='rgba(170,215,255,'+(1-d)+')';ctx.beginPath();ctx.ellipse(3.2,-14+d*7,0.6,0.9,0,0,7);ctx.fill();}
};

/* ---------- Komunista: gimnastiorka, czerwona chusta, czapka z gwiazdą, sztandar z sierpem i młotem ---------- */
function holdBanner(far,ang){if(!(CS.shield>0))return;const t=CS.t||0;ctx.save();ctx.translate(0,3);ctx.rotate(-ang);ctx.scale(0.62,0.62);
 Pth([[-1.6,8],[1.6,8],[1.6,-58],[-1.6,-58]]);fs('#7a5232');ctx.beginPath();ctx.arc(0,-60,2.6,0,7);fs('#d4af37');
 // płachta faluje: górna i dolna krawędź jako fala
 const w=x=>Math.sin(t*5+x*0.12)*2.2*(-x/50);
 const top=[],bot=[];for(let x=-2;x>=-62;x-=5){top.push([x,-56+w(x)]);bot.unshift([x,-24+w(x)+(x<-50?(x+50)*0.08:0)]);}
 Pth(top.concat(bot));fs('#c42a20');
 ctx.save();Pth(top.concat(bot));ctx.clip();
 for(let x=-62;x<0;x+=10){ctx.fillStyle='rgba(0,0,0,'+(0.08+0.07*Math.sin(t*5+x*0.12))+')';ctx.fillRect(x,-60,5,40);}
 ctx.restore();
 // sierp i młot + napis
 ctx.save();ctx.translate(-13,-47+w(-13));ctx.scale(0.8,0.8);
 ctx.beginPath();ctx.arc(0.6,0,5.6,-0.9,2.6);sk('#ffd34a',2.2);ln(-4,3.4,-6.4,6.6,'#ffd34a',2.4);
 ln(-4,-4,4.4,4.4,'#ffd34a',1.8);Pth([[-6.6,-3.4],[-3.4,-6.6],[-1.4,-4.6],[-4.6,-1.4]]);ctx.fillStyle='#ffd34a';ctx.fill();
 ctx.restore();
 ctx.font='900 8px '+FONT;ctx.textAlign='center';ctx.fillStyle='#fff6dc';ctx.fillText('PLAN',-41,-41+w(-41));ctx.fillText('5-LETNI',-41,-30+w(-41));
 ctx.restore();}
N.komunista={skin:'#e8b892',pants:'#3a3a30',coat:'#6e7444',sleeve:'#6e7444',shoe:'#151515',boot:'#161616',bootH:0.5,skirt:6,brow:'rgba(0,0,0,0)',noMouth:true,
 holdNear:{fn:holdBanner,behind:true},holdFar:{fn:fingers('#e8b892')},
 back(J,t){ // koniec chusty trzepocze za plecami
  const s=J.nk,f=Math.sin(t*6)*2;Pth([[s[0]+4,s[1]+2],[s[0]+16,s[1]+6+f],[s[0]+22,s[1]+2+f*1.4],[s[0]+14,s[1]+10+f],[s[0]+4,s[1]+7]]);fs('#c8281e');},
 front(J,t){ // czerwona opaska na ramieniu
  const A=J.arms[0];limb(lp(A.sh,A.el,0.45),lp(A.sh,A.el,0.75),14.4,13.6,'#c42a20',false);},
 torsoFx(){
  // plisa z guzikami, kieszenie, pas główny i parciany przez pierś
  Pth([[-6.4,-34],[-3.4,-34],[-3.4,-20],[-6.4,-20]]);fs(tint('#6e7444',0.88),OLW*0.4);for(const y of [-31,-26.5,-22])dot(-4.9,y,0.6,'#c9a24a');
  Pth([[0,-29],[5.4,-29.4],[5.4,-24],[0,-23.6]]);fs(tint('#6e7444',0.85),OLW*0.4);dot(2.7,-28,0.5,'#c9a24a');
  ctx.fillStyle='#4a3420';ctx.beginPath();ctx.moveTo(5,-34);ctx.lineTo(7.6,-34);ctx.lineTo(-6,-11);ctx.lineTo(-8.6,-11);ctx.fill();
  ctx.fillStyle='#4a3420';ctx.fillRect(-12,-11.6,22,3);ctx.fillStyle='#d4af37';ctx.fillRect(-9.6,-11.8,3.2,3.4);ctx.fillStyle='#4a3420';ctx.fillRect(-8.6,-10.8,1.2,1.4);},
 torsoOver(){Pth([[1.6,-34.6],[6.8,-33],[6.4,-31.2],[1.2,-32.6]]);fs('#c42a20',OLW*0.6);},
 collarFx(t){ // węzeł czerwonej chusty pod brodą
  ctx.beginPath();ctx.ellipse(-0.6,0.4,6.8,2.4,0.05,0,7);fs('#d02c20',OLW*0.7);
  Pth([[-3.6,1],[-1.6,1.4],[-2.4,5.4+Math.sin(t*6)*0.5],[-4.6,4.6]]);fs('#b8241a',OLW*0.6);},
 eyeFn(t){
  eye(0.9,-9.8,1.3,1.6,'#fbf6ea',-0.4,0,0.5);eye(-4.2,-9.8,1.7,2,'#fbf6ea',-0.7,0,0.65);
  Pth([[-6.8,-12.8],[-2,-12],[-2,-11.2],[-6.4,-11.4]]);fs('#2a1a10',OLW*0.35);Pth([[-0.4,-11.6],[2.6,-12.6],[2.6,-11.8],[-0.2,-11]]);fs('#2a1a10',OLW*0.35);},
 headFx(t){const m=CS.talk?0.6+0.4*Math.abs(Math.sin(t*10)):0.7;
  ctx.beginPath();ctx.ellipse(-8.6,-7.2,1.9,1.6,0.2,0,7);fs('#e6a07a',OLW*0.6);
  // krzyczące usta z zębami i wąsik
  Pth([[-7,-4.8],[-2,-4.4],[-2.4,-4.4+3.4*m],[-5.6,-4.6+3.8*m]]);fs('#3a0d0d',OLW*0.5);ctx.fillStyle='#f2ead6';ctx.fillRect(-6.6,-4.7,4.4,0.9);
  ell(-4.2,-4.6+3*m,1.4,0.6*m,'#b03a34');
  Pth([[-8.4,-6.2],[-5,-6.6],[-1.6,-5.6],[-3,-4.8],[-5.4,-5.4],[-8,-4.8]]);fs('#2a1a10',OLW*0.5);
  // czapka-maciejówka z czerwoną gwiazdą
  const C=[[7.4,-11.6],[8.6,-17],[2,-21.4],[-7.4,-20],[-8.8,-14.6],[-6.4,-12.6]];Pth(C);fs('#5e6438');
  ctx.save();Pth(C);ctx.clip();ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(2,-22,8,12);ctx.fillStyle='#4a5030';ctx.fillRect(-10,-15,20,2.6);ctx.restore();
  Pth(C);ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
  Pth([[-6.4,-13.4],[-13,-12],[-12.6,-10.6],[-6,-11.8]]);fs('#1a1a14');ln(-11.6,-11.6,-7.4,-12.6,'rgba(255,255,255,.3)',0.5);
  ctx.fillStyle='#d42a1e';Pth([[-5.4,-19.4],[-4.7,-17.6],[-2.9,-17.6],[-4.3,-16.5],[-3.8,-14.6],[-5.4,-15.8],[-7,-14.6],[-6.5,-16.5],[-7.9,-17.6],[-6.1,-17.6]]);fs('#d42a1e',OLW*0.4);}
};

const BIG={head:2.6,hand:2.05};   // trochę większa głowa i dłonie niż w grze (2.35, 1.85)
STYLES.push({id:'odnowa',name:'Odnowa (ten sam styl)',desc:'Silnik i kontur jak w grze, nowe stroje i miny: świecące oczy zombiaka, kaszkiet i gąsior XXX sąsiada, okulary aparatczyka, maciejówka i sztandar komunisty.',
 draw(k,x,y,h,st){
  const o=N[k],sc=h/100,keep={head:RG.head,hand:RG.hand},prev=OLW;
  Object.assign(RG,BIG);ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);OLW=clamp(1.8/sc,0.9,3.2);CS=st;
  try{drawFigure(o,poseFor(k,st),st.t||0);}finally{OLW=prev;Object.assign(RG,keep);ctx.restore();}
 }});
})();
