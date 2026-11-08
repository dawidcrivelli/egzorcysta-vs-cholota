/* Odnowa – sprzęt, część 2: kombajn, relikwia, kabel, sklep mięsny, gnojówka, aparatura, flaszka, pług, łopata, Ursus.
   Jednostki jak DRAW w grze: 72 = pole, ziemia y=0, chołota przychodzi z prawej. d = stan sprzętu (null = ikona). */
(()=>{
if(!window.ODN)return;
const D=ODN.D,PI=Math.PI;
const shadow=(x,w,h)=>{ctx.fillStyle='rgba(0,0,0,.34)';ctx.beginPath();ctx.ellipse(x,0,w,h||4.4,0,0,7);ctx.fill();};
const rr=(x,y,w,h,r)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);};
const ofs=(c,w)=>fs(c,w);
// kształt z cieniem po prawej: path(), kolor, ile cienia od x
function blk(path,c,sx,lw){path();ctx.fillStyle=c;ctx.fill();ctx.save();path();ctx.clip();ctx.fillStyle='rgba(30,15,5,.25)';ctx.fillRect(sx,-200,400,400);ctx.restore();path();ctx.strokeStyle=OL;ctx.lineWidth=lw||OLW;ctx.lineJoin='round';ctx.stroke();}
function smoke(x,y,t,n,sp,col,size){for(let i=0;i<n;i++){const q=((t*(sp||0.8))+i/n)%1;ctx.fillStyle='rgba('+(col||'90,90,90')+','+(0.55*(1-q))+')';ctx.beginPath();ctx.arc(x+Math.sin(t*2+i*2)*2-q*5,y-q*18,(size||2)+q*4,0,7);ctx.fill();}}
function wheel(x,y,r,rot,hub,tread){ctx.save();ctx.translate(x,y);ctx.beginPath();ctx.arc(0,0,r,0,7);fs('#1a1a1a');
 ctx.rotate(rot);if(tread)for(let i=0;i<tread;i++){ctx.rotate(2*PI/tread);Pth([[-r*0.16,-r*1.04],[r*0.16,-r*1.04],[r*0.12,-r*0.84],[-r*0.12,-r*0.84]]);ctx.fillStyle='#333';ctx.fill();}
 ctx.beginPath();ctx.arc(0,0,r*0.52,0,7);fs(hub,OLW*0.8);ctx.fillStyle=tint(hub,0.6);for(let i=0;i<5;i++){ctx.rotate(2*PI/5);ctx.beginPath();ctx.arc(0,-r*0.3,r*0.07,0,7);ctx.fill();}
 ctx.beginPath();ctx.arc(0,0,r*0.16,0,7);fs(tint(hub,0.75),OLW*0.6);ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.ellipse(-r*0.22,-r*0.22,r*0.14,r*0.07,-0.7,0,7);ctx.fill();ctx.restore();}
function txt(s,x,y,sz,c,w){ctx.font=(w||900)+' '+sz+'px '+FONT;ctx.textAlign='center';ctx.fillStyle=c;ctx.fillText(s,x,y);}
function fly(x,y,t,i){const a=t*(6+i)+i*2,fx=x+Math.cos(a)*(6+i*2),fy=y+Math.sin(a*1.3)*4;ctx.fillStyle='rgba(220,230,255,.75)';ctx.beginPath();ctx.ellipse(fx-0.6,fy-1.3,1.1,0.6,Math.sin(t*60)*0.6,0,7);ctx.fill();ctx.fillStyle='#141414';ctx.beginPath();ctx.arc(fx,fy,1.1,0,7);ctx.fill();}

/* Kombajn Bizon: czerwona kobyła z kabiną, kombajnista w kaszkiecie, choinka zapachowa, nagarniacz z przodu (w prawo) */
D.kombajn=(d,t)=>{const rev=d&&d.rev,hp=d&&d.max?d.hp/d.max:1,b=rev?Math.abs(Math.sin(t*25))*0.7:0;
 shadow(0,40,5);ctx.save();ctx.translate(0,-b);
 // rura wysypowa nad kabiną
 limb([-34,-40],[-40,-60],5,4,'#b8281c');limb([-40,-60],[-30,-66],4,3.6,'#b8281c');
 // korpus
 const body=()=>{ctx.beginPath();ctx.moveTo(-38,-12);ctx.lineTo(-38,-40);ctx.quadraticCurveTo(-38,-46,-32,-46);ctx.lineTo(10,-46);ctx.lineTo(16,-36);ctx.lineTo(16,-12);ctx.closePath();};
 blk(body,'#d23a28',2);
 ln(-38,-28,16,-28,'#7a160c',1.1);for(let i=0;i<6;i++)ln(-34+i*7,-26,-34+i*7,-15,'#8a1e14',0.9);
 ctx.fillStyle='#f4ecd0';rr(-34,-43,26,9,2);ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW*0.7;ctx.stroke();txt('BIZON',-21,-36.4,7,'#c42a20');
 // kabina z kombajnistą
 const cab=()=>{ctx.beginPath();ctx.moveTo(-14,-46);ctx.lineTo(-12,-74);ctx.lineTo(10,-74);ctx.lineTo(14,-46);ctx.closePath();};
 blk(cab,'#efe8d6',4);
 Pth([[-10,-70],[8,-70],[11,-50],[-9,-50]]);ctx.fillStyle='rgba(150,195,220,.85)';ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW*0.8;ctx.stroke();
 ctx.save();Pth([[-10,-70],[8,-70],[11,-50],[-9,-50]]);ctx.clip();
 ctx.beginPath();ctx.ellipse(0,-56,6.4,6.6,0,0,7);fs('#e2a982',OLW*0.7);dot2(2,-58,'#1a1410');dot2(-2.4,-58,'#1a1410');
 Pth([[-1,-54],[5,-54.4],[4,-52.6],[0,-52.6]]);fs('#4a3020',OLW*0.4);ctx.beginPath();ctx.ellipse(4.2,-55.6,1.6,1.3,0,0,7);fs('#d9665a',OLW*0.4);
 Pth([[-7,-61],[7,-62],[9,-59],[11,-58.6],[-7,-58.6]]);fs('#5a5047',OLW*0.6);
 ctx.fillStyle='rgba(255,255,255,.35)';Pth([[-8,-70],[-4,-70],[-9,-52],[-10,-56]]);ctx.fill();ctx.restore();
 // choinka zapachowa
 const sw=Math.sin(t*3)*0.25;ctx.save();ctx.translate(6,-69);ctx.rotate(sw);ln(0,0,0,5,'#333',0.4);Pth([[0,5],[2.6,11],[-2.6,11]]);fs('#3aa040',OLW*0.4);ctx.restore();
 Pth([[-14,-74],[12,-74],[13,-77],[-15,-77]]);fs('#c42a20',OLW*0.7);ctx.beginPath();ctx.arc(-11,-79,1.8,0,7);fs(rev?(Math.sin(t*12)>0?'#ffb020':'#8a5010'):'#8a5010',OLW*0.5);
 // gardziel i nagarniacz w prawo
 Pth([[14,-22],[42,-18],[42,-6],[14,-8]]);fs('#8a1e14');for(let i=0;i<7;i++){Pth([[16+i*4,-6],[18+i*4,-1.6],[20+i*4,-6]]);ctx.fillStyle='#d8dde2';ctx.fill();}
 ctx.save();ctx.translate(32,-26);ctx.rotate(rev?t*9:t*1.2);for(let i=0;i<6;i++){ctx.rotate(PI/3);limb([0,0],[0,-12.5],2.2,2,'#f0c840');Pth([[-4.6,-14],[4.6,-14],[4.6,-11],[-4.6,-11]]);fs('#f0c840',OLW*0.6);}ctx.beginPath();ctx.arc(0,0,3,0,7);fs('#555',OLW*0.6);ctx.restore();
 // koła
 wheel(-24,-12,12,rev?-t*4:0,'#f0c840',10);wheel(6,-8,8,rev?-t*6:0,'#f0c840',8);
 if(rev){ctx.fillStyle='#e6cf7a';for(let i=0;i<7;i++){const q=(t*3+i/7)%1;ctx.save();ctx.translate(38+q*8,-30+q*24);ctx.rotate(q*8+i);ctx.fillRect(-1.6,-0.4,3.2,0.8);ctx.restore();}}
 if(hp<0.5){ctx.strokeStyle='#3a0c06';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-30,-44);ctx.lineTo(-24,-36);ctx.lineTo(-28,-30);ctx.stroke();smoke(-10,-48,t,3,1,'60,60,60',2.6);}
 ctx.restore();smoke(-30,-70,t,3,rev?1.6:0.6,'70,70,70',2);
};
function dot2(x,y,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,0.9,1.2,0,0,7);ctx.fill();}

/* Relikwia: puszka po landrynkach na koronkowej serwetce i taborecie, ze skrzydełkami, aureolą i boskim światłem */
D.relikwia=(d,t)=>{const p=0.5+0.5*Math.sin(t*3),burst=d&&d.def&&d.t>(d.def.rate||2)-0.4?1-(d.def.rate-d.t)/0.4:0;
 const R=28+burst*20,g=ctx.createRadialGradient(0,-34,2,0,-34,R+10);g.addColorStop(0,'rgba(255,236,150,'+(0.5+p*0.25+burst*0.3)+')');g.addColorStop(1,'rgba(255,236,150,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,-34,R+10,0,7);ctx.fill();
 ctx.save();ctx.translate(0,-36);ctx.rotate(t*0.4);for(let i=0;i<10;i++){ctx.rotate(PI/5);Pth([[-1.6,-14],[1.6,-14],[0,-24-p*4-burst*14]]);ctx.fillStyle='rgba(255,246,190,'+(0.35+p*0.3)+')';ctx.fill();}ctx.restore();
 if(burst>0){ctx.strokeStyle='rgba(255,240,170,'+(1-burst)+')';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-20,20+burst*40,6+burst*10,0,0,7);ctx.stroke();}
 shadow(0,22,3.6);
 // taboret
 for(const x of [-14,12])limb([x,-14],[x+(x<0?-3:3),0],4,3.4,'#7a5634');
 Pth([[-20,-19],[20,-19],[20,-13],[-20,-13]]);fs('#9a6e40');
 // serwetka szydełkowa
 ctx.beginPath();ctx.moveTo(-19,-19);for(let i=0;i<=10;i++){const x=-19+i*3.8;ctx.quadraticCurveTo(x-1.9,-14.6,x,-17.6);}ctx.lineTo(19,-21);ctx.lineTo(-19,-21);ctx.closePath();fs('#f6f2e6',OLW*0.6);
 for(let i=0;i<9;i++){ctx.beginPath();ctx.arc(-15+i*3.8,-18,0.8,0,7);ctx.fillStyle='rgba(120,100,80,.4)';ctx.fill();}
 // skrzydełka
 const fl=Math.sin(t*8)*0.25;for(const s of [-1,1]){ctx.save();ctx.translate(s*14,-32);ctx.scale(s,1);ctx.rotate(-0.3+fl);
  ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(10,-14,20,-10);ctx.quadraticCurveTo(16,-6,18,-3);ctx.quadraticCurveTo(12,-2,14,2);ctx.quadraticCurveTo(6,3,0,4);ctx.closePath();fs('#fffdf4',OLW*0.8);
  ln(4,-2,14,-7,'#d8d0c0',0.6);ln(4,1,12,-1,'#d8d0c0',0.6);ctx.restore();}
 // puszka
 const can=()=>{rr(-15,-40,30,19,2);};blk(can,'#d6a51a',7);
 ctx.save();can();ctx.clip();ctx.fillStyle='#2a6a3a';ctx.fillRect(-15,-34,30,6);ctx.fillStyle='#f6e090';for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(-11+i*5.4,-31,1.4,0,7);ctx.fill();}
 for(const [x,c] of [[-10,'#e04848'],[-3,'#48a8e0'],[4,'#e8d048'],[10,'#58c060']]){ctx.beginPath();ctx.arc(x,-24.6,2,0,7);ctx.fillStyle=c;ctx.fill();}ctx.restore();
 txt('LANDRYNKI',0,-36.4,3.6,'#8a1a20');
 // uchylona pokrywka i aureola
 ctx.save();ctx.translate(-15,-40);ctx.rotate(-0.18-burst*0.3);Pth([[0,0],[31,0],[31,-3.4],[0,-3.4]]);fs('#c22d3a',OLW*0.8);ctx.restore();
 ctx.beginPath();ctx.ellipse(0,-50-p*2,11,3,0,0,7);ctx.strokeStyle=OL;ctx.lineWidth=3.6;ctx.stroke();ctx.strokeStyle='#ffd84a';ctx.lineWidth=2;ctx.stroke();
 ctx.fillStyle='rgba(255,250,200,'+(0.5+0.5*p)+')';for(let i=0;i<5;i++){const q=(t*0.6+i/5)%1;ctx.save();ctx.translate(-12+i*6,-44-q*22);ctx.rotate(q*3);Pth([[0,-1.6],[0.5,-0.5],[1.6,0],[0.5,0.5],[0,1.6],[-0.5,0.5],[-1.6,0],[-0.5,-0.5]]);ctx.fill();ctx.restore();}
};

/* Goły kabel: krzywy słup z izolatorami i tabliczką z czaszką, kabel w trawie z gołą miedzią i iskrami */
D.kabel=(d,t)=>{ctx.fillStyle='rgba(30,20,10,.4)';ctx.beginPath();ctx.ellipse(6,-2,28,3.4,0,0,7);ctx.fill();
 ctx.save();ctx.translate(-28,0);ctx.rotate(-0.08);limb([0,-1],[0,-52],5.6,4.4,'#6b4a2a');ln(-1,-8,-1,-46,'#4a3018',0.6);
 Pth([[-8,-48],[8,-48],[8,-45],[-8,-45]]);fs('#5a3a1e',OLW*0.7);for(const x of [-6,6]){ctx.beginPath();ctx.ellipse(x,-50.6,2,2.8,0,0,7);fs('#7ab8c8',OLW*0.6);ctx.fillStyle='rgba(255,255,255,.6)';ctx.fillRect(x-1,-52,0.7,2.4);}
 // tabliczka
 ctx.save();ctx.translate(0,-30);ctx.rotate(0.12);Pth([[-7,-6],[7,-6],[7,6],[-7,6]]);fs('#f0d84a',OLW*0.8);
 ctx.beginPath();ctx.arc(0,-1.4,2.6,0,7);fs('#1a1a1a',0);ctx.fillRect(-1.6,0.4,3.2,2);ctx.fillStyle='#f0d84a';ctx.beginPath();ctx.arc(-1,-1.6,0.7,0,7);ctx.arc(1,-1.6,0.7,0,7);ctx.fill();
 ln(-3.6,3.6,3.6,5,'#1a1a1a',0.8);ln(3.6,3.6,-3.6,5,'#1a1a1a',0.8);ctx.restore();ctx.restore();
 // kabel
 const path=()=>{ctx.beginPath();ctx.moveTo(-23,-52);ctx.quadraticCurveTo(-16,-12,-8,-5);for(let i=0;i<7;i++)ctx.quadraticCurveTo(-5+i*6,-0.5-(i%2)*6,-2+i*6,-5);};
 path();sk(OL,4.4);path();sk('#262626',2.6);
 for(const x of [-2,11,24,36]){ln(x,-5,x+4,-5,OL,3.2);ln(x,-5,x+4,-5,'#e8903a',2.2);ln(x+0.5,-5.6,x+3.4,-5.6,'#ffd0a0',0.6);}
 const on=Math.sin(t*9)>0.05;if(on){const gl=ctx.createRadialGradient(14,-6,1,14,-6,22);gl.addColorStop(0,'rgba(140,220,255,.35)');gl.addColorStop(1,'rgba(140,220,255,0)');ctx.fillStyle=gl;ctx.beginPath();ctx.arc(14,-6,22,0,7);ctx.fill();
  for(let k=0;k<3;k++){const sx=-2+((t*41+k*13)%40);ctx.beginPath();ctx.moveTo(sx,-6);ctx.lineTo(sx+3,-12);ctx.lineTo(sx+0.6,-12.6);ctx.lineTo(sx+4.6,-20);sk('#ffffff',2.2);ctx.beginPath();ctx.moveTo(sx,-6);ctx.lineTo(sx+3,-12);ctx.lineTo(sx+0.6,-12.6);ctx.lineTo(sx+4.6,-20);sk('#7ad8ff',1);}}
 // osmalona trawka
 ctx.fillStyle='#2a2a1a';for(const x of [6,20,30])Pth([[x,-2],[x+1,-8],[x+2,-2]]),ctx.fill();
};

/* Sklep mięsny: budka z pasiastą markizą; gotowy = szynka i girlanda kiełbas, przeładowanie = „NIE MA” i mucha */
D.lancuch=(d,t)=>{const ready=!d||d.reload<=0;
 shadow(0,32,4.6);
 const box=()=>{ctx.beginPath();ctx.rect(-26,-44,52,44);};blk(box,'#e8dcc0',14);
 for(let i=0;i<5;i++)ln(-26,-36+i*8,26,-36+i*8,'rgba(120,90,60,.25)',0.6);
 // okienko
 Pth([[-18,-38],[18,-38],[18,-14],[-18,-14]]);fs('#3a2a1e',OLW*0.8);Pth([[-20,-14],[20,-14],[20,-10],[-20,-10]]);fs('#9a6e40',OLW*0.8);
 // markiza
 ctx.beginPath();ctx.moveTo(-30,-46);ctx.lineTo(30,-46);ctx.lineTo(32,-38);for(let i=0;i<8;i++){const x=32-(i+1)*8;ctx.quadraticCurveTo(x+4,-33,x,-38);}ctx.closePath();
 ctx.save();ctx.clip();for(let i=0;i<8;i++){ctx.fillStyle=i%2?'#f4f0e4':'#c42a20';ctx.fillRect(-32+i*8,-48,8,16);}ctx.restore();
 ctx.beginPath();ctx.moveTo(-30,-46);ctx.lineTo(30,-46);ctx.lineTo(32,-38);for(let i=0;i<8;i++){const x=32-(i+1)*8;ctx.quadraticCurveTo(x+4,-33,x,-38);}ctx.closePath();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 // szyld
 Pth([[-24,-66],[24,-66],[24,-48],[-24,-48]]);fs('#f8f2dc');ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(14,-66,10,18);txt('MIĘSO',0,-53,10,'#c42a20');
 limb([-18,-48],[-18,-46],2,2,'#555');limb([18,-48],[18,-46],2,2,'#555');
 if(ready){
  // kiełbasy
  ctx.beginPath();ctx.moveTo(-16,-36);for(let i=0;i<5;i++)ctx.quadraticCurveTo(-13+i*7,-28,-10+i*7,-33);ctx.strokeStyle=OL;ctx.lineWidth=4;ctx.stroke();ctx.strokeStyle='#a8483a';ctx.lineWidth=2.6;ctx.stroke();
  const sw=Math.sin(t*2)*0.12;ctx.save();ctx.translate(4,-36);ctx.rotate(sw);ln(0,0,0,5,'#888',0.8);
  ctx.beginPath();ctx.ellipse(0,13,7.6,9.6,0.15,0,7);fs('#e2867a');ctx.beginPath();ctx.ellipse(1.6,15,4.4,5.8,0.15,0,7);fs('#f6d4ca',OLW*0.6);ctx.beginPath();ctx.arc(1.8,15,1.4,0,7);fs('#f8f2e8',OLW*0.4);
  Pth([[-2.4,4],[2.4,4],[1.6,1],[-1.6,1]]);fs('#f2ede0',OLW*0.6);ctx.restore();
  // kolejka gotowa: błysk
  ctx.fillStyle='rgba(255,255,255,'+(0.5+0.5*Math.sin(t*5))+')';Pth([[-12,-22],[-11,-24.4],[-10,-22],[-11,-19.6]]);ctx.fill();
 }else{
  ctx.save();ctx.translate(0,-26);ctx.rotate(-0.12);Pth([[-17,-6],[17,-6],[17,6],[-17,6]]);fs('#f4ecd0');txt('NIE MA',0,2.6,7.4,'#1a1a1a');ln(0,-6,-6,-12,'#555',0.6);ln(0,-6,6,-12,'#555',0.6);ctx.restore();
  ln(-12,-36,-12,-30,'#888',0.8);ctx.beginPath();ctx.arc(-12,-29,1.6,0,PI);sk('#888',0.8);
  fly(10,-40,t,0);
  const left=d.reload/((d.def&&d.def.reload)||9);ctx.fillStyle='rgba(0,0,0,.35)';rr(-20,-74,40,4,2);ctx.fill();ctx.fillStyle='#ffd34a';rr(-20,-74,40*(1-left),4,2);ctx.fill();
 }
 Pth([[-30,-2],[30,-2],[30,1.4],[-30,1.4]]);fs('#7a5232',OLW*0.6);
};

/* Gnojówka: kałuża rośnie i schnie z d.life, wywrócone wiadro, bąble, smród i muchy, pływający gumiak */
D.rozlew=(d,t)=>{const n=d&&d.life!=null?clamp(d.life/10,0.6,3):3;
 const pud=()=>{ctx.beginPath();ctx.moveTo(-6-n*6,-3);ctx.bezierCurveTo(-8-n*6,-8-n,2,-8-n*1.6,10,-7-n);ctx.bezierCurveTo(20+n*5,-7-n,22+n*6,-1,14+n*4,0);ctx.bezierCurveTo(4,2,-6-n*5,1,-6-n*6,-3);ctx.closePath();};
 pud();ctx.fillStyle='#6a5226';ctx.fill();ctx.save();pud();ctx.clip();ctx.fillStyle='#8a6e30';ctx.beginPath();ctx.ellipse(2,-5,6+n*3,1.8,0,0,7);ctx.fill();ctx.fillStyle='rgba(150,175,60,.7)';ctx.beginPath();ctx.ellipse(14,-3,4+n*1.4,1.2,0,0,7);ctx.fill();ctx.restore();
 pud();ctx.strokeStyle=OL;ctx.lineWidth=OLW*0.8;ctx.stroke();
 for(let i=0;i<4;i++){const q=(t*0.9+i/4)%1;ctx.beginPath();ctx.arc(-4+i*7,-5-q*2.4,0.8+q*1.6,0,7);ctx.strokeStyle='rgba(220,210,130,'+(1-q)+')';ctx.lineWidth=0.8;ctx.stroke();}
 // pływający gumiak
 if(n>1.2){ctx.save();ctx.translate(10,-7+Math.sin(t*2)*0.6);ctx.rotate(Math.sin(t*1.5)*0.12);   // gumowa kaczka
  ctx.beginPath();ctx.ellipse(0,0,5,3,0,0,7);fs('#ffd83a',OLW*0.8);ctx.beginPath();ctx.arc(-3.4,-3.6,2.6,0,7);fs('#ffd83a',OLW*0.8);
  Pth([[-5.8,-3.8],[-8.4,-3],[-5.6,-2.6]]);fs('#f08a2a',OLW*0.5);ctx.fillStyle='#000';ctx.beginPath();ctx.arc(-4.2,-4.4,0.5,0,7);ctx.fill();ln(1,-1,4,-1.6,'#d8a810',0.7);ctx.restore();}
 // wiadro
 ctx.save();ctx.translate(-22-n*2,-8);ctx.rotate(-1.3);Pth([[-7.6,-10],[7.6,-10],[6,9],[-6,9]]);fs('#9aa0a6');ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(2,-10,6,19);ln(-7,-3,7,-3,'#6a6e72',1.2);ln(-6.4,4,6.4,4,'#6a6e72',1.2);
 ctx.beginPath();ctx.ellipse(0,-10,7.6,2.2,0,0,7);fs('#4a3418',OLW*0.7);ctx.beginPath();ctx.arc(0,-2,9,PI*1.1,PI*1.9);sk('#555',0.8);ctx.restore();
 // smród
 for(let i=0;i<3;i++){ctx.beginPath();const x0=-2+i*10;ctx.moveTo(x0,-10);ctx.quadraticCurveTo(x0+4+Math.sin(t*3+i)*2,-17,x0,-24);ctx.quadraticCurveTo(x0-4,-30,x0+1,-35);ctx.strokeStyle='rgba(130,155,50,.6)';ctx.lineWidth=1.6;ctx.stroke();}
 for(let i=0;i<3;i++)fly(6,-22,t,i);
};

/* Aparatura: miedziany kocioł z manometrem; rozgrzewa się (wyjeżdża z ziemi, para), uzbrojona = czerwona lampka i wskazówka na czerwonym */
D.aparatura=(d,t)=>{const armed=!d||d.armed,warm=d&&!d.armed?1-(d.armT/((d.def&&d.def.arm)||5)):1;
 ctx.fillStyle='#5a3e22';ctx.beginPath();ctx.ellipse(0,-2,30,8,0,PI,0);ctx.closePath();fs('#5a3e22');ctx.fillStyle='#6b4a2a';for(let i=0;i<9;i++){ctx.beginPath();ctx.arc(-24+i*6,-3-(i%2)*2.4,1.4,0,7);ctx.fill();}
 const rise=d&&!d.armed?14*(1-warm):0,sh=armed&&d?Math.sin(t*40)*0.5:0;
 ctx.save();ctx.beginPath();ctx.rect(-50,-80,100,77);ctx.clip();ctx.translate(sh,rise);
 // kocioł
 const pot=()=>{ctx.beginPath();ctx.moveTo(-16,-4);ctx.bezierCurveTo(-24,-10,-22,-36,-8,-38);ctx.lineTo(8,-38);ctx.bezierCurveTo(22,-36,24,-10,16,-4);ctx.closePath();};
 pot();const g=ctx.createLinearGradient(-20,0,20,0);g.addColorStop(0,'#5a240e');g.addColorStop(0.32,'#d9824a');g.addColorStop(0.45,'#f6be90');g.addColorStop(1,'#5a240e');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 ctx.fillStyle='#3a1a08';for(const y of [-30,-12])for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(-13+i*5.2,y,0.8,0,7);ctx.fill();}
 Pth([[-6,-38],[6,-38],[4,-44],[-4,-44]]);fs('#b8622e');
 // wężownica
 ctx.beginPath();ctx.moveTo(2,-43);ctx.quadraticCurveTo(18,-54,24,-34);for(let i=0;i<3;i++){ctx.quadraticCurveTo(30,-30+i*7,22,-28+i*7);ctx.quadraticCurveTo(16,-26+i*7,22,-24+i*7);}sk(OL,4.4);
 ctx.beginPath();ctx.moveTo(2,-43);ctx.quadraticCurveTo(18,-54,24,-34);for(let i=0;i<3;i++){ctx.quadraticCurveTo(30,-30+i*7,22,-28+i*7);ctx.quadraticCurveTo(16,-26+i*7,22,-24+i*7);}sk('#c8703a',2.6);
 // manometr
 ctx.beginPath();ctx.arc(-7,-22,6.4,0,7);fs('#f4f0e4');ctx.beginPath();ctx.arc(-7,-22,6.4,-0.3,0.6);ctx.lineTo(-7,-22);ctx.closePath();ctx.fillStyle='rgba(210,40,30,.55)';ctx.fill();
 ctx.beginPath();ctx.arc(-7,-22,6.4,0,7);ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 const na=lerp(-2.4,0.15,warm)+(armed&&d?Math.sin(t*25)*0.12:0);ctx.save();ctx.translate(-7,-22);ctx.rotate(na);ln(0,0,4.8,0,'#b8241c',0.9);ctx.restore();dot3(-7,-22);
 // naklejka
 ctx.save();ctx.translate(8,-14);ctx.rotate(0.15);Pth([[-8,-3],[8,-3],[8,3],[-8,3]]);fs('#f8f0d0',OLW*0.5);txt('NIE RUSZAĆ!',0,1.1,2.3,'#b8241c');ctx.restore();
 // lampka
 const on=armed&&d&&Math.sin(t*10)>0;ctx.beginPath();ctx.arc(0,-48,3.4,0,7);fs(armed?(on?'#ff2a2a':'#8a1010'):'#3a2a1a');
 if(on){const g2=ctx.createRadialGradient(0,-48,1,0,-48,12);g2.addColorStop(0,'rgba(255,60,40,.6)');g2.addColorStop(1,'rgba(255,60,40,0)');ctx.fillStyle=g2;ctx.beginPath();ctx.arc(0,-48,12,0,7);ctx.fill();}
 ctx.restore();
 if(d&&!d.armed)smoke(4,-30+rise,t,4,1.4,'225,225,225',2);else if(d){const dc=(t*1.2)%1;ctx.fillStyle='#f0d070';ctx.beginPath();ctx.ellipse(22,-6+dc*4,0.8,1.1,0,0,7);ctx.fill();}
};
function dot3(x,y){ctx.beginPath();ctx.arc(x,y,1.1,0,7);fs('#2a2a2a',OLW*0.5);}

/* Płonąca flaszka: spirytus z płonącą szmatą, iskry, drży gdy w akcji */
D.flaszka=(d,t)=>{if(d)ctx.translate(Math.sin(t*50)*1.6,0);shadow(0,13,3);
 ctx.save();ctx.rotate(d?-0.08:-0.04);
 const b=()=>{ctx.beginPath();ctx.moveTo(-10,-2);ctx.lineTo(-10,-30);ctx.quadraticCurveTo(-10,-36,-4,-38);ctx.lineTo(-4,-48);ctx.lineTo(4,-48);ctx.lineTo(4,-38);ctx.quadraticCurveTo(10,-36,10,-30);ctx.lineTo(10,-2);ctx.quadraticCurveTo(10,0,8,0);ctx.lineTo(-8,0);ctx.quadraticCurveTo(-10,0,-10,-2);ctx.closePath();};
 b();ctx.fillStyle='rgba(200,235,215,.9)';ctx.fill();ctx.save();b();ctx.clip();const lv=-20+Math.sin(t*6)*1.2;ctx.fillStyle='rgba(240,215,110,.92)';ctx.beginPath();ctx.moveTo(-12,lv);ctx.quadraticCurveTo(0,lv-2*Math.sin(t*6),12,lv);ctx.lineTo(12,2);ctx.lineTo(-12,2);ctx.fill();ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(4,-50,8,52);ctx.restore();
 b();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 Pth([[-8,-28],[8,-28],[8,-15],[-8,-15]]);fs('#efe6c8',OLW*0.6);ctx.fillStyle='#c42a20';ctx.fillRect(-8,-28,16,3.4);txt('SPIRYTUS',0,-25.4,3,'#fff6dc');txt('96%',0,-17.6,6,'#8a1a20');
 ctx.fillStyle='rgba(255,255,255,.65)';ctx.fillRect(-8,-34,1.6,30);
 // szmata
 Pth([[-4,-48],[4,-48],[7,-55],[2,-52],[0,-58],[-3,-52],[-7,-54]]);fs('#d8ccb0',OLW*0.7);ln(-3,-50,3,-50,'#a89a80',0.6);
 ctx.restore();
 const f=Math.sin(t*16)*2.4,f2=Math.sin(t*23)*1.8,F=d?1.4:1;
 ctx.save();ctx.translate(0,-56);ctx.scale(F,F);Pth([[-8,2],[-4,-12-f],[-1,-6],[2,-20-f2],[5,-8],[8,-14+f],[9,2]]);ctx.fillStyle='#ff5a10';ctx.fill();Pth([[-4,2],[-1,-8-f],[2,-4],[4,-12-f2],[6,2]]);ctx.fillStyle='#ffc23a';ctx.fill();Pth([[-1,2],[1,-5],[3,2]]);ctx.fillStyle='#fff4b0';ctx.fill();ctx.restore();
 ctx.fillStyle='#ffd040';for(let i=0;i<5;i++){const q=(t*1.6+i/5)%1;ctx.globalAlpha=1-q;ctx.fillRect(Math.sin(i*7+t)*8,-64-q*22,1.4,1.4);}ctx.globalAlpha=1;
};

/* Pług: drewniane rączki, lśniąca lemiesz, wrona na rączce; w akcji sypie skibami */
D.plug=(d,t)=>{shadow(0,34,4);const b=d?Math.abs(Math.sin(t*20))*0.8:0;ctx.save();ctx.translate(0,-b);
 limb([-34,-46],[6,-14],5,4.6,'#8a5a32');limb([-40,-48],[-28,-44],4,4,'#8a5a32');limb([-38,-34],[-26,-38],4,4,'#7a4e2a');limb([-26,-38],[-2,-16],4,3.6,'#7a4e2a');
 Pth([[-4,-20],[4,-20],[6,-2],[-4,-2]]);fs('#5a3a1e');
 // lemiesz
 const sh=()=>{ctx.beginPath();ctx.moveTo(2,-20);ctx.quadraticCurveTo(22,-16,34,-1);ctx.lineTo(4,-1);ctx.closePath();};
 sh();const g=ctx.createLinearGradient(0,-20,30,0);g.addColorStop(0,'#6a7076');g.addColorStop(0.5,'#e4e8ec');g.addColorStop(1,'#7a8086');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 ctx.fillStyle='rgba(255,255,255,'+(0.4+0.4*Math.sin(t*3))+')';Pth([[16,-12],[17,-15],[18,-12],[17,-9]]);ctx.fill();
 // kółko i wspornik
 limb([6,-14],[28,-30],3,3,'#9a7a4a');ctx.save();ctx.translate(28,-30);ctx.beginPath();ctx.arc(0,0,6,0,7);fs('#5a3e24');ctx.rotate(d?t*8:0);for(let i=0;i<5;i++){ctx.rotate(2*PI/5);ln(0,0,0,-5,'#3a2a14',1);}ctx.beginPath();ctx.arc(0,0,1.6,0,7);fs('#888',OLW*0.5);ctx.restore();
 // wrona
 const hop=d?0:Math.max(0,Math.sin(t*2.2))*1.4;ctx.save();ctx.translate(-24,-44-hop);
 ctx.beginPath();ctx.ellipse(0,-4,5,4,-0.2,0,7);fs('#1e1e24');ctx.beginPath();ctx.ellipse(-4,-8,3,2.8,0,0,7);fs('#1e1e24');Pth([[-6.6,-8.6],[-10,-7.6],[-6.6,-7]]);fs('#c9a24a',OLW*0.5);
 ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-4.6,-8.6,0.9,0,7);ctx.fill();ctx.fillStyle='#000';ctx.beginPath();ctx.arc(-4.9,-8.6,0.45,0,7);ctx.fill();
 Pth([[4,-4],[9,-1],[4,-1.4]]);fs('#1e1e24',OLW*0.6);ln(-1,0,-1,2,'#c9a24a',0.6);ln(1,0,1,2,'#c9a24a',0.6);ctx.restore();
 ctx.restore();
 if(d){ctx.fillStyle='#5a3a1e';for(let i=0;i<6;i++){const q=(t*3+i/6)%1;ctx.save();ctx.translate(-4-q*20,-2-Math.sin(q*PI)*12);ctx.rotate(q*6);ctx.fillRect(-1.6,-1.2,3.2,2.4);ctx.restore();}}
};

/* Łopata: wbita w kopczyk, z robakiem, który zerka */
D.lopata=(d,t)=>{shadow(0,22,3.4);
 ctx.beginPath();ctx.moveTo(-22,0);ctx.quadraticCurveTo(-6,-14,14,-6);ctx.quadraticCurveTo(22,-2,24,0);ctx.closePath();fs('#6a4a2a');ctx.fillStyle='#8a6438';for(const [x,y] of [[-8,-6],[2,-8],[10,-4],[-14,-2]]){ctx.beginPath();ctx.arc(x,y,1.2,0,7);ctx.fill();}
 ctx.save();ctx.translate(2,-6);ctx.rotate(0.18);
 Pth([[-7,0],[7,0],[6,-14],[-6,-14]]);const g=ctx.createLinearGradient(-7,0,7,0);g.addColorStop(0,'#7a8086');g.addColorStop(0.4,'#d8dce0');g.addColorStop(1,'#6a7076');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 limb([0,-14],[0,-58],4.4,4,'#a06a3a');Pth([[-6,-58],[6,-58],[6,-62],[-6,-62]]);fs('#8a5a32');ctx.restore();
 // robak
 const p=Math.max(0,Math.sin(t*1.6));ctx.save();ctx.translate(-10,-6);ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-2,-4*p,1,-7*p);sk(OL,3.6);ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-2,-4*p,1,-7*p);sk('#e08a8a',2.4);
 if(p>0.5){ctx.fillStyle='#000';ctx.beginPath();ctx.arc(0.4,-7.6*p,0.4,0,7);ctx.fill();}ctx.restore();
};

/* Ursus C-330: czerwony, wielkie tylne koło, siedzisko z poduszką, kostki pluszowe, chmura spalin przy jeździe */
D.ursus=(d,t)=>{const mv=!!(d&&d.moving),b=mv?Math.abs(Math.sin(t*22))*1:Math.abs(Math.sin(t*14))*0.3,rot=mv?-t*10:0;
 shadow(2,38,4.6);ctx.save();ctx.translate(0,-b);
 // błotnik i tylne koło
 wheel(-16,-20,20,rot,'#e8c040',14);
 ctx.beginPath();ctx.arc(-16,-20,24,PI*1.02,PI*1.98);sk(OL,8);ctx.beginPath();ctx.arc(-16,-20,24,PI*1.02,PI*1.98);sk('#d03424',5.6);
 // maska
 const hood=()=>{ctx.beginPath();ctx.moveTo(0,-42);ctx.lineTo(30,-42);ctx.quadraticCurveTo(38,-42,38,-34);ctx.lineTo(38,-22);ctx.lineTo(0,-22);ctx.closePath();};
 blk(hood,'#d83a28',26);ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(2,-41,24,1.6);
 Pth([[2,-22],[30,-22],[30,-14],[2,-14]]);fs('#3a3a3a');ctx.fillStyle='#555';for(let i=0;i<4;i++)ctx.fillRect(5+i*6,-21,3,6);
 Pth([[34,-40],[39,-37],[39,-24],[34,-24]]);fs('#2a2a2a',OLW*0.7);for(let i=0;i<4;i++)ln(35,-37+i*3,38,-37+i*3,'#888',0.7);
 ctx.beginPath();ctx.arc(31,-30,2.8,0,7);fs('#fff4c0',OLW*0.6);if(mv){const gl=ctx.createRadialGradient(31,-30,1,40,-30,18);gl.addColorStop(0,'rgba(255,245,190,.5)');gl.addColorStop(1,'rgba(255,245,190,0)');ctx.fillStyle=gl;ctx.beginPath();ctx.arc(40,-30,18,0,7);ctx.fill();}
 txt('URSUS',14,-29.4,6.2,'#fff');txt('C-330',14,-24.6,3.6,'#ffd8c0');
 // siedzisko, kierownica, kostki
 Pth([[-26,-48],[-10,-48],[-10,-44],[-26,-44]]);fs('#2a2a2a',OLW*0.8);ctx.beginPath();ctx.ellipse(-18,-50,8,2.6,0,0,7);fs('#c84a8a',OLW*0.7);
 limb([-17,-44],[-16,-32],2.8,2.8,'#2a2a2a');
 limb([-2,-42],[-8,-56],2.6,2.6,'#222');ctx.beginPath();ctx.ellipse(-8,-56,6.4,2,0,0,7);ctx.strokeStyle=OL;ctx.lineWidth=2.6;ctx.stroke();ctx.strokeStyle='#333';ctx.lineWidth=1.3;ctx.stroke();
 const sw=Math.sin(t*4)*0.3;ctx.save();ctx.translate(-8,-56);ctx.rotate(sw);ln(0,0,0,5,'#444',0.4);for(const [x,c] of [[-2,'#f4f0e4'],[2,'#ffd34a']]){ctx.save();ctx.translate(x,7);ctx.rotate(x*0.2);rr(-1.8,-1.8,3.6,3.6,0.8);fs(c,OLW*0.5);ctx.fillStyle='#222';ctx.beginPath();ctx.arc(0,0,0.5,0,7);ctx.fill();ctx.restore();}ctx.restore();
 // komin
 limb([22,-42],[22,-62],3.8,3.2,'#222');Pth([[19.6,-62],[24.4,-62],[25.4,-65],[18.6,-65]]);fs('#333',OLW*0.6);
 // przednie koło
 wheel(28,-9,9,rot*2.2,'#e8c040',9);
 ctx.restore();
 if(mv){smoke(22,-68,t,4,3,'60,60,60',3);ctx.fillStyle='rgba(140,110,70,.5)';for(let i=0;i<4;i++){const q=(t*4+i/4)%1;ctx.beginPath();ctx.arc(-36-q*12,-3-q*5,2+q*3,0,7);ctx.fill();}}
 else smoke(22,-68,t,2,0.5,'110,110,110',1.6);
};
})();
