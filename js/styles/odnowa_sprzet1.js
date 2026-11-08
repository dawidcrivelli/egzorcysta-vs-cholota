/* Odnowa – sprzęt cz. 1: bimbrownia, gumofilce, słoje, resztki, woda, samowar, armata, meblościanka, Rubin, piła.
   Jednostki jak DRAW w grze: 72 = pole, ziemia y=0, chołota nadchodzi z prawej. d = stan (null = ikona). */
(()=>{
if(!window.ODN)return;
const D=ODN.D;
const R=(x,y,w,h,r)=>()=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r||0);};
const E=(x,y,rx,ry,a)=>()=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,a||0,0,7);};
const P=pts=>()=>Pth(pts);
// bryła: kolor, cień od sx w prawo, kontur
function sh(path,col,sx,lw,shade){path();ctx.fillStyle=col;ctx.fill();
 if(sx!=null){ctx.save();path();ctx.clip();ctx.fillStyle=shade||'rgba(30,15,5,.26)';ctx.fillRect(sx,-300,600,600);ctx.restore();}
 path();ctx.strokeStyle=OL;ctx.lineWidth=lw||OLW;ctx.lineJoin='round';ctx.stroke();}
const ell=(x,y,rx,ry,c,a)=>{ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,a||0,0,7);ctx.fill();};
const shadow=(x,w)=>ell(x||0,0,w,4.6,'rgba(0,0,0,.34)');
const rope=(pts,c,w)=>{ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);sk(OL,w+OLW*2);ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);sk(c,w);};
const bez=(a,b,c,d,col,w)=>{for(const [cc,ww] of [[OL,w+OLW*2],[col,w]]){ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.bezierCurveTo(b[0],b[1],c[0],c[1],d[0],d[1]);sk(cc,ww);}};
const txt=(s,x,y,sz,c,w)=>{ctx.font=(w||900)+' '+sz+'px '+FONT;ctx.textAlign='center';ctx.fillStyle=c;ctx.fillText(s,x,y);};
const puff=(x,y,t,n,sp,col,up)=>{for(let i=0;i<n;i++){const p=(t*sp+i/n)%1;ctx.fillStyle=col.replace('A',(0.55*(1-p)).toFixed(3));ctx.beginPath();ctx.arc(x+Math.sin(t*2+i*2)*2+p*5,y-p*(up||18),1.8+p*3.6,0,7);ctx.fill();}};
const copper=(x0,x1)=>{const g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,'#6a2a10');g.addColorStop(0.3,'#d27a40');g.addColorStop(0.42,'#ffc59a');g.addColorStop(0.58,'#c86a32');g.addColorStop(1,'#4e1c08');return g;};
const brass=(x0,x1)=>{const g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,'#5e400f');g.addColorStop(0.28,'#c08e2c');g.addColorStop(0.4,'#ffe9a4');g.addColorStop(0.55,'#d4a43a');g.addColorStop(1,'#56380c');return g;};
function cracks(lines){ctx.strokeStyle='#120804';ctx.lineWidth=1.3;ctx.lineJoin='miter';for(const L of lines){ctx.beginPath();ctx.moveTo(L[0][0],L[0][1]);for(const q of L.slice(1))ctx.lineTo(q[0],q[1]);ctx.stroke();}}
// gumofilc: czarny gumiak z filcem, nosek w prawo, kostka w (0,0)
function gumiak(stink,t){
 sh(P([[-5,-20],[5,-20],[5.6,-6],[12,-5],[14.6,-1.4],[13.6,2.6],[-5.6,2.6],[-6,-6]]),'#262626',1);
 ctx.fillStyle='#5a5a5a';ctx.fillRect(-5.6,1,19,1.6);ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(-3,-18,1.3,14);
 sh(R(-7,-26,14,7,2),'#cfc6b0',2);ctx.strokeStyle='#8a8070';ctx.lineWidth=0.6;for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(-5.4+i*2.2,-25);ctx.lineTo(-4.8+i*2.2,-20.4);ctx.stroke();}
 if(stink){ctx.strokeStyle='rgba(150,190,60,.8)';ctx.lineWidth=1.1;for(let i=0;i<3;i++){const o=Math.sin(t*4+i*2)*1.6;ctx.beginPath();ctx.moveTo(-4+i*4,-28);ctx.bezierCurveTo(-7+i*4+o,-32,-1+i*4-o,-35,-4+i*4+o,-40);ctx.stroke();}}
}
function fly(x,y,t,i){const a=t*7+i*2.1,fx=x+Math.cos(a)*7,fy=y+Math.sin(a*1.3)*4;ell(fx,fy,1.1,1.1,'#111');ell(fx-0.8,fy-1.2,1.1,0.6,'rgba(220,240,255,.8)',-0.5);ell(fx+0.8,fy-1.2,1.1,0.6,'rgba(220,240,255,.8)',0.5);}

/* ---- Bimbrownia: piec z cegły, miedziany kocioł z manometrem, wężownica w beczce, gąsior ---- */
D.bimbrownia=(d,t)=>{
 shadow(0,50);
 // piec
 sh(R(-46,-26,34,26,3),'#a4512e',-20);
 ctx.save();R(-46,-26,34,26,3)();ctx.clip();ctx.strokeStyle='#5a2614';ctx.lineWidth=0.8;
 for(let r=0;r<4;r++){const y=-26+r*6.5;ln(-47,y,-11,y,'#5a2614',0.8);for(let x=-46+(r%2)*5;x<-12;x+=10)ln(x,y,x,y+6.5,'#5a2614',0.8);}ctx.restore();
 sh(R(-48,-30,38,5,2),'#7c3a20',-22);
 const fl=0.6+0.4*Math.sin(t*11)*Math.sin(t*7.3);
 ctx.save();ctx.beginPath();ctx.moveTo(-38,0);ctx.lineTo(-38,-10);ctx.quadraticCurveTo(-29,-19,-20,-10);ctx.lineTo(-20,0);ctx.closePath();ctx.fillStyle='#160a05';ctx.fill();ctx.clip();
 for(let i=0;i<5;i++){const x=-36+i*4,h=6+4*Math.sin(t*9+i*1.7)+2*Math.sin(t*14+i);Pth([[x-3,0],[x+Math.sin(t*6+i),-h],[x+3,0]]);ctx.fillStyle='#ff6a12';ctx.fill();Pth([[x-1.6,0],[x,-h*0.6],[x+1.6,0]]);ctx.fillStyle='#ffd25a';ctx.fill();}
 ctx.restore();ctx.beginPath();ctx.moveTo(-38,0);ctx.lineTo(-38,-10);ctx.quadraticCurveTo(-29,-19,-20,-10);ctx.lineTo(-20,0);ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 ell(-29,-2,12*fl+4,4,'rgba(255,160,60,.25)');
 // kot śpi na ciepłym piecu
 const br=Math.sin(t*2)*0.4;ctx.save();ctx.translate(-14,-31);
 sh(()=>{ctx.beginPath();ctx.ellipse(0,-3.4-br*0.3,7.4,4+br*0.4,0,PI_,0);ctx.lineTo(7.4,0);ctx.lineTo(-7.4,0);ctx.closePath();},'#e08a3a',3);
 sh(E(-7,-3,3.6,3.2),'#e08a3a');Pth([[-9.6,-5],[-9.2,-8.6],[-7.4,-6]]);fs('#e08a3a',OLW*0.7);Pth([[-6.6,-6],[-5,-8.8],[-4.4,-5.6]]);fs('#e08a3a',OLW*0.7);
 ln(-8.8,-3.2,-7.6,-3,OL,0.7);ln(-6.6,-3.2,-5.4,-3,OL,0.7);ln(-2,-6.6,-1,-3.4,'#b0601e',1.1);ln(1.4,-7,2.2,-3.8,'#b0601e',1.1);
 txt('z',-12-Math.sin(t)*1.5,-10-(t*5%6),4,'rgba(255,255,255,.85)',700);ctx.restore();
 // kocioł
 const kx=-29,ky=-30;
 ctx.beginPath();ctx.moveTo(kx-15,ky);ctx.bezierCurveTo(kx-21,ky-12,kx-15,ky-30,kx,ky-31);ctx.bezierCurveTo(kx+15,ky-30,kx+21,ky-12,kx+15,ky);ctx.closePath();
 ctx.fillStyle=copper(kx-19,kx+19);ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 ctx.beginPath();ctx.moveTo(kx-18.6,ky-12);ctx.quadraticCurveTo(kx,ky-9,kx+18.6,ky-12);sk('#5a240e',1.6);
 for(let i=0;i<6;i++)ell(kx-15+i*6,ky-10.6+Math.abs(i-2.5)*0.4,0.8,0.8,'#7a3410');
 ell(kx-7,ky-20,1.8,5.4,'rgba(255,235,210,.55)',0.25);
 // manometr: igła drży, czasem w czerwonym
 const gx=kx+2,gy=ky-21;sh(E(gx,gy,5.2,5.2),'#f2ede0');ctx.beginPath();ctx.arc(gx,gy,4,PI_*0.9,PI_*1.25);sk('#3a8a3a',1.4);ctx.beginPath();ctx.arc(gx,gy,4,PI_*1.75,PI_*2.1);sk('#d02a20',1.4);
 const na=-2.2+1.9*(0.5+0.5*Math.sin(t*0.9))+0.08*Math.sin(t*40);ln(gx,gy,gx+Math.cos(na)*3.8,gy+Math.sin(na)*3.8,'#111',0.8);ell(gx,gy,0.8,0.8,'#111');
 sh(R(kx-3,ky-37,6,6,1),'#a85a26');
 // rura: wężownica do beczki
 bez([kx+1,ky-35],[kx+10,ky-50],[8,-66],[16,-56],'#c46a32',3.2);
 // beczka chłodząca
 const bx0=8,bx1=34,by0=-50,by1=0;
 const barrel=()=>{ctx.beginPath();ctx.moveTo(bx0+1.4,by1);ctx.quadraticCurveTo(bx0-2,(by0+by1)/2,bx0+1.4,by0);ctx.lineTo(bx1-1.4,by0);ctx.quadraticCurveTo(bx1+2,(by0+by1)/2,bx1-1.4,by1);ctx.closePath();};
 barrel();const g2=ctx.createLinearGradient(bx0,0,bx1,0);g2.addColorStop(0,'#5a3a1e');g2.addColorStop(0.35,'#a2744a');g2.addColorStop(1,'#4a2e16');ctx.fillStyle=g2;ctx.fill();
 ctx.save();barrel();ctx.clip();for(let x=bx0+4;x<bx1;x+=5)ln(x,by0,x,by1,'rgba(40,20,5,.45)',0.6);ctx.restore();barrel();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 for(const y of [by0+5,-25,by1-5]){ln(bx0-0.6,y,bx1+0.6,y,OL,3.2);ln(bx0-0.6,y,bx1+0.6,y,'#5a5a5a',1.8);}
 ell((bx0+bx1)/2,by0,(bx1-bx0)/2-1.4,2.4,'#23323a');ctx.strokeStyle='rgba(200,230,240,.5)';ctx.lineWidth=0.6;ctx.beginPath();ctx.ellipse((bx0+bx1)/2+Math.sin(t)*2,by0,5,0.9,0,0,7);ctx.stroke();
 // napis kredą i kranik
 txt('XXX',21,-32,7,'#f4ead0');
 sh(P([[bx1-1,-14],[bx1+6,-14.6],[bx1+6.4,-11],[bx1-1,-10.6]]),'#c46a32');
 // gąsior zbiera krople
 const jx=46;ctx.beginPath();ctx.moveTo(jx-2.4,-24);ctx.lineTo(jx-2.4,-20);ctx.bezierCurveTo(jx-11,-18,-0+jx-11,0,jx-6,0);ctx.lineTo(jx+6,0);ctx.bezierCurveTo(jx+11,0,jx+11,-18,jx+2.4,-20);ctx.lineTo(jx+2.4,-24);ctx.closePath();
 ctx.fillStyle='rgba(190,225,215,.45)';ctx.fill();
 const lvl=-3-12*((t*0.04)%1);ctx.save();ctx.clip();ctx.fillStyle='rgba(232,190,80,.9)';ctx.fillRect(jx-12,lvl,24,24);ctx.fillStyle='rgba(255,245,190,.9)';ctx.fillRect(jx-12,lvl,24,0.8);ctx.restore();
 ctx.beginPath();ctx.moveTo(jx-2.4,-24);ctx.lineTo(jx-2.4,-20);ctx.bezierCurveTo(jx-11,-18,jx-11,0,jx-6,0);ctx.lineTo(jx+6,0);ctx.bezierCurveTo(jx+11,0,jx+11,-18,jx+2.4,-20);ctx.lineTo(jx+2.4,-24);ctx.closePath();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 ell(jx-5,-11,1.3,4,'rgba(255,255,255,.65)',0.3);
 const dc=(t*1.4)%1;if(dc<0.7)ell(bx1+5.6,-10+dc/0.7*12,0.8,1.2,'#f0d070');
 puff(kx,ky-40,t,3,0.5,'rgba(240,240,240,A)');
 if(d&&d.t<1.2)ell(jx,-9,13,13,'rgba(255,230,120,'+(0.3+0.25*Math.sin(t*15)).toFixed(3)+')');
};
const PI_=Math.PI;

/* ---- Wyrzutnia gumofilców: proca z dętki rowerowej wbita w ziemię, sterta śmierdzących gumiaków ---- */
D.gumofilce=(d,t)=>{
 const a=catSt(d,t).a,pull=clamp((0.38-a)/1.58,0,1),loaded=a<-1.0;
 shadow(-2,46);
 // sterta gumiaków z muchami
 for(const [x,y,r] of [[-40,-1,0],[-26,-1,0.05],[-34,-17,-0.25]]){ctx.save();ctx.translate(x,y);ctx.rotate(r);gumiak(false,t);ctx.restore();}
 ctx.strokeStyle='rgba(150,190,60,.75)';ctx.lineWidth=1.2;for(let i=0;i<3;i++){const o=Math.sin(t*3+i*2)*2;ctx.beginPath();ctx.moveTo(-40+i*7,-40);ctx.bezierCurveTo(-44+i*7+o,-46,-36+i*7-o,-50,-40+i*7+o,-56);ctx.stroke();}
 fly(-34,-48,t,0);fly(-30,-42,t,1.7);
 // proca: rozwidlony konar
 const L=[-2,-66],Rt=[24,-68],j=[10,-38];
 chain([[10,0],[10,-20],j],[12,11,10],'#8a5a32');chain([j,[2,-52],L],[9,7.6,7],'#8a5a32');chain([j,[20,-54],Rt],[9,7.6,7],'#9a6a3e');
 for(const y of [-8,-16,-26])ln(6,y,14,y-1.4,'#5e3a1e',1);ell(14,-12,1.6,2.4,'#4a2a14');
 // owijki z taśmy na końcach
 for(const p of [L,Rt]){ctx.save();ctx.translate(p[0],p[1]+4);sh(R(-5,-3,10,6,1.4),'#9aa4ac',1.5);ln(-4.4,-1,4.4,1,'rgba(255,255,255,.5)',0.6);ctx.restore();}
 // dętka (czerwona, z łatką)
 const px=lerp(12,-30,pull),py=lerp(-60,-46,pull);
 rope([[Rt[0],Rt[1]+4],[px+4,py]],'#c0301c',3.6);
 ctx.save();ctx.translate(px,py);
 sh(E(0,1.4,8,5.6),'#6a4428',-1);
 if(loaded){ctx.save();ctx.translate(-1,-2);ctx.rotate(-0.5-pull*0.2);ctx.scale(0.85,0.85);gumiak(true,t);ctx.restore();}
 ctx.restore();
 rope([[L[0],L[1]+4],[px-4,py]],'#d8422a',3.6);
 ctx.save();ctx.translate(lerp(L[0],px,0.45),lerp(L[1]+4,py,0.45));sh(R(-2.6,-2.4,5.2,4.8,1),'#2a2a2a',0.5,OLW*0.7);ctx.restore();
 // napięta guma drży przed strzałem
 if(pull>0.95){ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=0.8;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(px+s*9,py-6);ctx.lineTo(px+s*12,py-9);ctx.stroke();}}
};

/* ---- Słoje z ogórkami: gigantyczny słój na taborecie, ściereczka w kratkę na sznurku, ogórek z oczami ---- */
D.pralka=(d,t)=>{
 const kick=d&&d.kick>0?d.kick/0.25:0,j=kick?Math.sin(t*60)*1.4:0;
 shadow(-2,46);
 // piramida małych słoików
 for(const [x,y] of [[-44,0],[-34,0],[-24,0],[-39,-13],[-29,-13],[-34,-26]]){ctx.save();ctx.translate(x,y);
  sh(R(-4.6,-12,9.2,12,2),'rgba(205,235,220,.92)',2);ctx.fillStyle='#5a8a22';ctx.fillRect(-3,-9,2,8);ctx.fillRect(0.4,-10,2,9);
  sh(R(-5,-14,10,3,1),'#c9a24a',2,OLW*0.8);ctx.restore();}
 // taboret
 ctx.save();ctx.translate(14+j,0);
 for(const x of [-15,13])chain([[x,-14],[x+(x<0?-2:2),0]],[4.4,4],'#8a6238');ln(-15,-6,15,-6,OL,3.4);ln(-15,-6,15,-6,'#9a7040',2);
 sh(R(-20,-18,40,5,1.6),'#a87a48',4);
 // słój
 const jar=()=>{ctx.beginPath();ctx.moveTo(-16,-74);ctx.quadraticCurveTo(-20,-70,-19,-62);ctx.lineTo(-19,-24);ctx.quadraticCurveTo(-19,-18,-12,-18);ctx.lineTo(12,-18);ctx.quadraticCurveTo(19,-18,19,-24);ctx.lineTo(19,-62);ctx.quadraticCurveTo(20,-70,16,-74);ctx.closePath();};
 jar();ctx.fillStyle='rgba(205,235,222,.9)';ctx.fill();
 ctx.save();jar();ctx.clip();ctx.fillStyle='rgba(170,200,110,.6)';ctx.fillRect(-21,-64+Math.sin(t*2)*0.6,42,48);
 for(const [x,y,h,r] of [[-12,-58,34,0.1],[-5,-62,38,-0.05],[10,-56,32,0.08]]){ctx.save();ctx.translate(x,y);ctx.rotate(r);sh(R(-3.6,0,7.2,h,3.6),'#5a8a22',1);for(let k=4;k<h;k+=5)ell(-1.4,k,0.7,0.7,'#2e5a10');ctx.restore();}
 // ogórek z oczami podgląda
 ctx.save();ctx.translate(3,-52+Math.sin(t*1.6)*1.4);ctx.rotate(-0.05);sh(R(-4.4,0,8.8,32,4.4),'#6a9e2a',1.6);
 ell(-1.6,6,1.9,2.2,'#fff');ell(2,6,1.9,2.2,'#fff');ell(-2.1,6.4,0.9,0.9,'#111');ell(1.5,6.4,0.9,0.9,'#111');
 ctx.beginPath();ctx.arc(0,11,1.8,0.2,PI_-0.2);sk('#1e3a08',0.7);ctx.restore();
 ctx.strokeStyle='#3e6a12';ctx.lineWidth=1;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-14+i*7,-64);ctx.lineTo(-12+i*7,-56);ctx.lineTo(-15+i*7,-52);ctx.stroke();}
 for(let i=0;i<4;i++){const p=(t*0.6+i/4)%1;ctx.fillStyle='rgba(255,255,255,.6)';ctx.beginPath();ctx.arc(-14+i*9,-22-p*40,0.9+p*0.6,0,7);ctx.fill();}
 ctx.fillStyle='rgba(255,255,255,.55)';ctx.fillRect(-16,-66,3,44);ctx.restore();
 jar();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 // etykieta
 sh(R(-12,-36,24,11,1.4),'#f4ecd0',null,OLW*0.7);txt('OGÓRKI',0,-30.4,4.8,'#2a6a12');txt('1983',0,-26.6,3.4,'#8a1a12',700);
 // ściereczka w kratkę – podskakuje przy strzale
 const lid=-10*kick;ctx.save();ctx.translate(0,lid);ctx.rotate(-0.2*kick);
 const cloth=()=>{ctx.beginPath();ctx.moveTo(-20,-72);ctx.quadraticCurveTo(-24,-66,-21,-63);ctx.lineTo(-17,-66);ctx.lineTo(17,-66);ctx.lineTo(21,-63);ctx.quadraticCurveTo(24,-66,20,-72);ctx.quadraticCurveTo(0,-80,-20,-72);ctx.closePath();};
 cloth();ctx.fillStyle='#f2ede0';ctx.fill();ctx.save();cloth();ctx.clip();ctx.fillStyle='rgba(200,40,30,.75)';for(let x=-24;x<24;x+=6)ctx.fillRect(x,-82,3,20);for(let y=-80;y<-62;y+=6)ctx.fillRect(-24,y,48,3);ctx.restore();cloth();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 ln(-18,-67,18,-67,'#c9a070',1.4);ctx.restore();
 if(kick>0.4){ctx.fillStyle='rgba(190,220,140,.85)';for(let i=0;i<5;i++)ell(-8+i*4,-70-kick*8-i%2*3,1.3,2,'rgba(190,220,140,.85)');}
 ctx.restore();
};

/* ---- Wyrzutnia resztek: chochla na emaliowanym garze w kropki, kapusta i kość ---- */
D.resztki=(d,t)=>{
 const st=catSt(d,t),a=st.a,loaded=st.loaded;
 shadow(-2,46);
 // gar
 const pot=()=>{ctx.beginPath();ctx.moveTo(-34,-36);ctx.lineTo(-32,-6);ctx.quadraticCurveTo(-32,0,-26,0);ctx.lineTo(10,0);ctx.quadraticCurveTo(16,0,16,-6);ctx.lineTo(18,-36);ctx.closePath();};
 pot();ctx.fillStyle='#f2efe6';ctx.fill();ctx.save();pot();ctx.clip();
 for(const [x,y] of [[-26,-28],[-14,-20],[-24,-12],[-4,-30],[6,-14],[-12,-6],[10,-26]])ell(x,y,2.6,2.6,'#d02a20');
 ctx.fillStyle='rgba(30,15,5,.18)';ctx.fillRect(2,-40,20,42);ell(-20,-24,2,3.4,'rgba(60,60,60,.5)');ctx.restore();pot();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 ell(-24,-24,2.4,3.6,'#2a2a2a');   // obtłuczona emalia
 for(const x of [-37,21]){ctx.beginPath();ctx.ellipse(x,-28,3.4,2.4,0,0,7);ctx.strokeStyle=OL;ctx.lineWidth=3.6;ctx.stroke();ctx.strokeStyle='#2a5aa8';ctx.lineWidth=2;ctx.stroke();}
 sh(E(-8,-36,26.4,5),'#2a5aa8');ell(-8,-36.6,23,3.4,'#5a3a1a');
 // zawartość: bigos bulgocze
 for(let i=0;i<3;i++){const p=(t*0.9+i/3)%1;ell(-18+i*10,-37-p*3,1.4+p*1.4,1+p,'rgba(140,90,40,'+(1-p).toFixed(2)+')');}
 puff(-12,-42,t,3,0.45,'rgba(235,235,235,A)',16);
 // chochla jako ramię
 const piv=[4,-48],L=40,tip=[piv[0]+Math.sin(a)*L,piv[1]-Math.cos(a)*L];
 chain([[-2,-38],[4,-48]],[5,5],'#8a8e94');chain([[12,-38],[4,-48]],[5,5],'#7a7e84');
 chain([piv,tip],[4.6,3.4],'#c9ced4');ln(piv[0],piv[1],tip[0],tip[1],'rgba(255,255,255,.5)',0.9);
 sh(E(piv[0],piv[1],4.4,4.4),'#555a60');ell(piv[0],piv[1],1.3,1.3,'#111');
 ctx.save();ctx.translate(tip[0],tip[1]);ctx.rotate(a);
 ctx.beginPath();ctx.arc(0,-1,7,0,PI_);ctx.closePath();ctx.fillStyle='#c9ced4';ctx.fill();ctx.save();ctx.clip();ctx.fillStyle='rgba(30,30,40,.25)';ctx.fillRect(1,-2,8,10);ctx.restore();ctx.beginPath();ctx.arc(0,-1,7,0,PI_);ctx.closePath();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 if(loaded){sh(E(-2,-5,5.4,5),'#8cc85a',-1);ln(-6,-6,1,-3,'#4f8a2a',0.9);ln(-4.6,-9,-1.4,-2,'#4f8a2a',0.7);
  ctx.save();ctx.translate(4,-6);ctx.rotate(-0.6);sh(R(-1.3,-9,2.6,10,1),'#f0e8d2',null,OLW*0.8);sh(E(-1.4,-9.4,1.7,1.7),'#f0e8d2',null,OLW*0.6);sh(E(1.4,-9.4,1.7,1.7),'#f0e8d2',null,OLW*0.6);ctx.restore();
  ell(-6,-1,2.4,1.8,'#e8d070');}
 ctx.restore();
};

/* ---- Miotacz wody święconej: kropielnica na cokole, sprężynowe kropidło, gołąbek nad nią ---- */
D.woda=(d,t)=>{
 const st=catSt(d,t),a=st.a,loaded=st.loaded;
 shadow(0,40);
 const glow=0.5+0.5*Math.sin(t*2.4);
 ell(-8,-44,30,18,'rgba(255,240,170,'+(0.12+0.1*glow).toFixed(3)+')');
 // cokół i misa z kamienia
 sh(P([[-24,0],[8,0],[4,-6],[-20,-6]]),'#9a958a',-2);sh(R(-17,-30,18,24,2),'#b0aa9c',-4);
 for(const y of [-24,-14])ln(-17,y,1,y,'#7a7468',0.8);
 sh(()=>{ctx.beginPath();ctx.moveTo(-30,-42);ctx.quadraticCurveTo(-28,-26,-8,-28);ctx.quadraticCurveTo(12,-26,14,-42);ctx.closePath();},'#c4beb0',-2);
 ell(-8,-42,22,4,'#5a90c8');ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.beginPath();ctx.ellipse(-8,-42,22,4,0,0,7);ctx.stroke();
 ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=0.7;ctx.beginPath();ctx.ellipse(-8+Math.sin(t)*3,-42,6,1.2,0,0,7);ctx.stroke();
 // krzyż z przodu
 ctx.fillStyle='#d4af37';ctx.fillRect(-9.6,-22,3.2,13);ctx.fillRect(-13,-18.6,10,3.2);ctx.strokeStyle=OL;ctx.lineWidth=OLW*0.6;ctx.strokeRect(-9.6,-22,3.2,13);
 // sprężyna i ramię
 const piv=[12,-46];
 for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(12,-30-i*3.2,3.4,1.4,0,0,7);ctx.strokeStyle=OL;ctx.lineWidth=2;ctx.stroke();ctx.strokeStyle='#b8bcc0';ctx.lineWidth=1;ctx.stroke();}
 const L=40,tip=[piv[0]+Math.sin(a)*L,piv[1]-Math.cos(a)*L];
 chain([piv,tip],[4.4,3.4],'#7a5232');
 sh(E(piv[0],piv[1],4,4),'#d4af37');ell(piv[0],piv[1],1.2,1.2,'#5a3a10');
 // kropidło na końcu: srebrna kula z dziurkami
 ctx.save();ctx.translate(tip[0],tip[1]);ctx.rotate(a);
 sh(E(0,-2,6,6),'#cfd4da',1);ctx.fillStyle='#55585c';for(const p of [[-2,-4],[2,-1],[0,1.6],[-2.6,0],[2.2,-4.4]])ctx.fillRect(p[0]-0.5,p[1]-0.5,1,1);
 if(loaded){ctx.save();ctx.translate(0,-12);ctx.rotate(-0.3);sh(R(-3,-8,6,12,1.4),'rgba(130,185,255,.95)');sh(R(-1.3,-12,2.6,4,0.6),'rgba(130,185,255,.95)',null,OLW*0.7);ctx.fillStyle='#fff';ctx.fillRect(-0.5,-5,1,6);ctx.fillRect(-2,-3.4,4,1);ctx.restore();}
 ctx.restore();
 // krople z kropidła
 ctx.fillStyle='rgba(150,200,255,.85)';for(let i=0;i<4;i++){const p=(t*1.3+i/4)%1;ell(tip[0]-2+i*1.6,tip[1]+2+p*16,0.8,1.3,'rgba(150,200,255,'+(0.9*(1-p)).toFixed(2)+')');}
 // gołąbek ducha świętego krąży
 const dx=-24+Math.sin(t*1.2)*6,dy=-70+Math.sin(t*2.4)*3,wf=Math.sin(t*12)*3;
 ctx.save();ctx.translate(dx,dy);sh(E(0,0,5,3),'#ffffff');sh(E(-4.4,-1.6,2.4,2.2),'#ffffff');Pth([[-6.6,-1.4],[-8.4,-0.8],[-6.6,-0.4]]);fs('#e8a020',OLW*0.5);ell(-5,-2,0.6,0.6,'#111');
 Pth([[-1,-1],[3,-5-wf],[5,-1]]);fs('#f0f0f8',OLW*0.7);Pth([[4,0],[8,-2],[8,2]]);fs('#ffffff',OLW*0.6);ctx.restore();
};

/* ---- Carski samowar: brzuchaty, z dwugłowym orłem, czajniczek w różyczki, korona na kominku ---- */
D.samowar=(d,t)=>{
 const T=3.2,c=(t%T)/T;let k=c>0.45&&c<0.78?ease(Math.min((c-0.45)/0.05,(0.78-c)/0.05)):0;if(d)k=d.kick>0?1:0;
 shadow(0,34);
 // nóżki i podstawa
 for(const x of [-14,0,14]){sh(P([[x-3,0],[x+3,0],[x+2,-5],[x-2,-5]]),'#8a6420',null,OLW*0.8);}
 sh(E(0,-6,24,4),'#a8781e');
 sh(P([[-11,-8],[11,-8],[8,-18],[-8,-18]]),'#c08e2c',2);
 const glow=0.55+0.45*Math.sin(t*8)*Math.sin(t*5.1);for(const vx of [-5,0,5]){ctx.beginPath();ctx.moveTo(vx-1.4,-10);ctx.lineTo(vx-1.4,-13);ctx.arc(vx,-13,1.4,PI_,0);ctx.lineTo(vx+1.4,-10);ctx.closePath();fs('rgba(255,'+Math.round(110+60*glow)+',30,'+(0.6+0.4*glow).toFixed(2)+')',OLW*0.6);}
 // brzuch
 const body=()=>{ctx.beginPath();ctx.moveTo(-8,-18);ctx.bezierCurveTo(-28,-20,-28,-52,-13,-58);ctx.lineTo(13,-58);ctx.bezierCurveTo(28,-52,28,-20,8,-18);ctx.closePath();};
 body();ctx.fillStyle=brass(-24,24);ctx.fill();ctx.save();body();ctx.clip();ctx.fillStyle='rgba(30,15,5,.2)';ctx.fillRect(8,-60,24,44);
 for(let i=0;i<9;i++){const x=-22+i*5.4;ln(x,-58,x+1,-18,'rgba(90,60,10,.35)',0.8);}ctx.restore();body();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 ctx.beginPath();ctx.moveTo(-25,-40);ctx.quadraticCurveTo(0,-37,25,-40);sk('#7a5214',2);
 // medalion z orłem
 sh(E(0,-29,6.4,6.6),'#7a1a14');ctx.fillStyle='#ffd34a';
 Pth([[0,-34],[2,-31.4],[5.4,-33],[4,-28.6],[2,-27.6],[1,-24.6],[-1,-24.6],[-2,-27.6],[-4,-28.6],[-5.4,-33],[-2,-31.4]]);ctx.fill();ell(-2.6,-33.6,1,1,'#ffd34a');ell(2.6,-33.6,1,1,'#ffd34a');
 // uchwyty
 for(const sx of [-1,1]){bez([sx*21,-50],[sx*31,-51],[sx*31,-38],[sx*24,-34],'#b8862a',2.2);ctx.save();ctx.translate(sx*29.4,-43);sh(R(-1.6,-3,3.2,6,1),'#2a1a10',null,OLW*0.6);ctx.restore();}
 // kranik w prawo (do wrogów)
 sh(P([[20,-26],[34,-25.6],[34.6,-21.4],[32,-19.4],[31,-22.4],[20,-22.4]]),'#d4a43a',27);
 ctx.save();ctx.translate(28,-26.4);ctx.rotate(-k*1.3);sh(P([[-0.8,0],[0.8,0],[0.8,-3],[3.6,-4],[3.6,-5.8],[-3.6,-5.8],[-3.6,-4],[-0.8,-3]]),'#d4a43a',null,OLW*0.7);ctx.restore();
 if(k>0){for(let i=0;i<5;i++){const p=((t*2.2+i/5)%1);ell(34+p*12,-20+p*p*14,1+p*2.2,1+p*2,'rgba(220,240,255,'+(0.75*(1-p)).toFixed(2)+')');}ell(36,-18,2.2,3,'rgba(200,230,255,.8)');}
 // korona i komin
 sh(P([[-14,-58],[14,-58],[12,-62],[-12,-62]]),'#c08e2c',4);
 sh(R(-3,-66,6,5,1),'#8a6420');
 // czajniczek w różyczki
 const tp=()=>{ctx.beginPath();ctx.ellipse(0,-73,11,7,0,0,7);};
 tp();ctx.fillStyle='#f2efe6';ctx.fill();ctx.save();tp();ctx.clip();ctx.fillStyle='rgba(30,15,5,.14)';ctx.fillRect(4,-82,10,16);
 for(const [x,y] of [[-5,-73],[2,-75],[-1,-70.4]]){for(let i=0;i<5;i++){const an=i*1.257;ell(x+Math.cos(an)*1.3,y+Math.sin(an)*1.3,1.1,1.1,'#d0342c');}ell(x,y,0.8,0.8,'#ffd34a');}
 ctx.fillStyle='#2a4fa0';ctx.fillRect(-11,-68.6,22,0.9);ctx.restore();tp();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 bez([9.6,-71],[15,-72],[16,-78],[18,-80],'#f2efe6',1.8);
 // korona carska zamiast gałki
 ctx.save();ctx.translate(0,-80);sh(P([[-5,0],[5,0],[6,-5],[3,-2.6],[0,-6.4],[-3,-2.6],[-6,-5]]),'#ffd34a',2);ell(0,-7,1,1,'#d0342c');ctx.restore();
 puff(19,-82,t,3,0.45,'rgba(240,240,240,A)',14);
};

/* ---- Carska armata: brązowa lufa z lwią paszczą, zdobne koła, kule jak arbuzy, lont się skrzy ---- */
D.armata=(d,t)=>{
 const kick=d&&d.kick>0?d.kick/0.25:0,rec=-kick*6;
 shadow(0,48);
 // stos kul
 for(const [x,y] of [[-44,-5.4],[-33,-5.4],[-38.5,-15]]){sh(E(x,y,5.6,5.6),'#2a2a2c',x+1);ell(x-1.8,y-2,1.4,1.4,'rgba(255,255,255,.35)');}
 // łoże
 sh(P([[-30,-6],[16,-20],[20,-14],[-26,0]]),'#7a4e2a',-4);for(const x of [-18,-4,10])ell(x,-8-(x+30)*0.25,1,1,'#2a2a2a');
 // lufa
 ctx.save();ctx.translate(-4+rec,-30);ctx.rotate(-0.22);
 const g=ctx.createLinearGradient(0,-10,0,10);g.addColorStop(0,'#f0c878');g.addColorStop(0.45,'#b08030');g.addColorStop(1,'#5a3a10');
 const barrel=()=>{ctx.beginPath();ctx.moveTo(-22,-9);ctx.lineTo(32,-7.4);ctx.lineTo(32,7.4);ctx.lineTo(-22,9);ctx.quadraticCurveTo(-27,0,-22,-9);ctx.closePath();};
 barrel();ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 for(const x of [-10,6,20]){sh(R(x,-9,3.4,18,1),'#d4a43a',null,OLW*0.7);}
 // ornament
 ctx.strokeStyle='#7a5214';ctx.lineWidth=0.7;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-6+i*0.1,-4+i*3);ctx.bezierCurveTo(-2,-7+i*3,2,-1+i*3,5,-4+i*3);ctx.stroke();}
 // wylot – lwia paszcza
 sh(E(34,0,5,10),'#c08e2c',35);sh(E(37,0,3.2,6.6),'#1a1208');
 ctx.fillStyle='#8a5a14';for(let i=0;i<8;i++){const an=i/8*PI_*2;Pth([[34+Math.cos(an)*4.4,Math.sin(an)*9],[34+Math.cos(an+0.3)*7,Math.sin(an+0.3)*12.4],[34+Math.cos(an+0.6)*4.4,Math.sin(an+0.6)*9]]);ctx.fill();}
 ell(36,-4,1,1,'#ffd34a');ell(36,4,1,1,'#ffd34a');
 // tył z gałką i lont
 sh(E(-24,0,4,4),'#a8781e');sh(E(-29,0,2.6,2.6),'#a8781e');
 bez([-16,-9],[-16,-16],[-20,-15],[-22,-20],'#3a2a1a',1.2);
 if(!kick){const sp=(t*12)%1;for(let i=0;i<5;i++){const an=i*1.3+t*9;ell(-22+Math.cos(an)*(1.5+sp*3),-20+Math.sin(an)*(1.5+sp*3),0.7,0.7,i%2?'#ffd34a':'#ff7a20');}ell(-22,-20,1.4,1.4,'#fff4c0');}
 ctx.restore();
 // koło
 ctx.save();ctx.translate(-8,-14);ctx.rotate(rec*0.08);sh(E(0,0,14,14),'#6a4a2a');ctx.beginPath();ctx.arc(0,0,12.4,0,7);ctx.strokeStyle='#3a3a3a';ctx.lineWidth=2.4;ctx.stroke();
 for(let i=0;i<10;i++){ctx.rotate(PI_/5);ln(0,0,0,-11,'#8a6038',1.8);}sh(E(0,0,3.4,3.4),'#c08e2c');ctx.restore();
 ctx.beginPath();ctx.arc(-8,-14,14.6,0,7);ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 if(kick>0.4){ctx.save();ctx.translate(36,-38);for(let i=0;i<7;i++){const an=i/7*PI_*2;Pth([[0,0],[Math.cos(an)*12*kick,Math.sin(an)*12*kick],[Math.cos(an+0.4)*6,Math.sin(an+0.4)*6]]);ctx.fillStyle=i%2?'#ffd34a':'#ff7a20';ctx.fill();}ell(0,0,5,5,'#fff6c0');ctx.restore();}
 if(kick>0)puff(36+(1-kick)*8,-40,t,4,1.2,'rgba(200,200,200,A)',20);
};

/* ---- Meblościanka: segment z kryształami, serwetka, jeleń na rykowisku, kolekcja puszek po piwie ---- */
D.szafa=(d,t)=>{
 const hp=d&&d.max?d.hp/d.max:1;
 shadow(0,40);
 ctx.save();if(hp<0.33)ctx.rotate(-0.05);
 const W1=-34,W2=34,TOP=-80;
 sh(R(W1,TOP,W2-W1,TOP*-1,1.4),'#8a5530',W2-16);
 ctx.save();R(W1,TOP,W2-W1,-TOP,1.4)();ctx.clip();for(let y=TOP+4;y<0;y+=6)ln(W1,y,W2,y+1.6,'rgba(60,30,10,.18)',1);ctx.restore();
 sh(R(W1-2,TOP-4,W2-W1+4,5,1),'#6e4024',W2-14);sh(R(W1-1,-4,W2-W1+2,4,0.6),'#3a2010');
 // gabloty z kryształami
 for(const x0 of [-30,2]){
  sh(R(x0,TOP+4,28,36,1),'rgba(150,195,215,.75)');
  ctx.save();R(x0,TOP+4,28,36,1)();ctx.clip();
  ln(x0+1,TOP+20,x0+27,TOP+20,'#6e4024',1.6);
  for(let i=0;i<3;i++){const cx=x0+5+i*9;Pth([[cx-3,TOP+19],[cx+3,TOP+19],[cx+4,TOP+9],[cx-4,TOP+9]]);fs('rgba(240,250,255,.9)',OLW*0.5);ln(cx-2,TOP+11,cx+2,TOP+17,'rgba(140,180,220,.8)',0.5);ln(cx+2,TOP+11,cx-2,TOP+17,'rgba(140,180,220,.8)',0.5);}
  if(x0<0){for(let i=0;i<3;i++){ctx.save();ctx.translate(x0+6+i*8,TOP+38);sh(R(-3,-12,6,12,1),['#c42a20','#2a6a2a','#d4a43a'][i],null,OLW*0.6);ctx.fillStyle='#fff';ctx.fillRect(-2,-8,4,2);ctx.restore();}}
  else{sh(E(x0+14,TOP+34,9,3),'rgba(240,250,255,.9)',null,OLW*0.6);Pth([[x0+6,TOP+34],[x0+22,TOP+34],[x0+18,TOP+26],[x0+10,TOP+26]]);fs('rgba(240,250,255,.85)',OLW*0.5);}
  const sw=(t*0.4+x0*0.01)%1;ln(x0+sw*40-6,TOP+40,x0+sw*40+4,TOP+4,'rgba(255,255,255,.45)',2.4);
  ctx.restore();}
 // szuflady
 for(const y of [-34,-18]){sh(R(-30,y,60,13,1),'#7a4a28',14,OLW*0.8);sh(R(-5,y+5,10,3,1),'#d4af37',null,OLW*0.6);}
 // serwetka szydełkowa i jeleń na górze
 ctx.beginPath();ctx.moveTo(-16,TOP-4);for(let i=0;i<=8;i++){const x=-16+i*4;ctx.lineTo(x,TOP-4+(i%2?4:1.4));}ctx.lineTo(16,TOP-4);ctx.closePath();fs('#f4f0e2',OLW*0.6);
 ctx.save();ctx.translate(4,TOP-4);
 sh(E(0,-7,7,3.4),'#c08a50');for(const x of [-5,-2,3,6])ln(x,-5,x+(x<0?-0.5:0.5),0,'#8a5a30',1.4);
 sh(E(-7,-10,2.4,3.4,0.4),'#c08a50');ell(-8.4,-12,0.6,0.6,'#111');
 ctx.strokeStyle='#5a3a1a';ctx.lineWidth=0.9;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(-7+s,-13);ctx.lineTo(-7+s*3,-19);ctx.lineTo(-7+s*5,-18);ctx.moveTo(-7+s*2,-16);ctx.lineTo(-7+s*4,-15.4);ctx.stroke();}
 ctx.restore();
 // waza z kwiatem
 ctx.save();ctx.translate(-24,TOP-4);sh(()=>{ctx.beginPath();ctx.moveTo(-3,0);ctx.quadraticCurveTo(-5,-5,-2,-9);ctx.lineTo(2,-9);ctx.quadraticCurveTo(5,-5,3,0);ctx.closePath();},'#2a5aa8',1);ln(0,-9,1,-15,'#3a7a2a',0.9);ell(1,-16,2,2,'#d02a20');ctx.restore();
 if(hp<0.66)cracks([[[-34,-56],[-20,-48],[-24,-38]],[[-14,-72],[-6,-64]]]);
 if(hp<0.33)cracks([[[34,-66],[20,-58],[24,-44],[12,-32]]]);
 ctx.restore();
};

/* ---- Telewizor Rubin: drewniana skrzynia, obraz kontrolny, antena-króliczek z folią, kot śpi na górze? nie: serwetka i rybka ---- */
D.rubin=(d,t)=>{
 const hurt=d&&d.hp<d.max*0.5;
 shadow(0,36);
 for(const x of [-24,20])chain([[x,-14],[x+(x<0?-4:4),0]],[4,3.2],'#3a2414');
 sh(R(-32,-62,64,50,5),'#8a5530',14);
 ctx.save();R(-32,-62,64,50,5)();ctx.clip();for(let y=-60;y<-12;y+=5)ln(-32,y,32,y+1,'rgba(60,30,10,.18)',0.9);ctx.restore();
 // ekran z obrazem kontrolnym
 const scr=()=>{ctx.beginPath();ctx.moveTo(-25,-57);ctx.quadraticCurveTo(-5,-60,15,-57);ctx.quadraticCurveTo(18,-38,15,-20);ctx.quadraticCurveTo(-5,-17,-25,-20);ctx.quadraticCurveTo(-28,-38,-25,-57);ctx.closePath();};
 scr();ctx.fillStyle='#222';ctx.fill();ctx.save();scr();ctx.clip();
 const cols=['#f2f2f2','#f2e040','#40e0e0','#40d040','#e040e0','#e03030','#3040e0'];
 if(!hurt){for(let i=0;i<7;i++){ctx.fillStyle=cols[i];ctx.fillRect(-26+i*6.2,-58,6.4,26);}
  ctx.fillStyle='#111';ctx.fillRect(-26,-32,44,14);ell(-5,-38,10,10,'rgba(0,0,0,0)');ctx.beginPath();ctx.arc(-5,-38,11,0,7);ctx.strokeStyle='#fff';ctx.lineWidth=1.2;ctx.stroke();
  txt('PTV 1',-5,-23,5,'#fff');}
 else{for(let i=0;i<140;i++){const x=-26+((i*37+Math.floor(t*30)*13)%44),y=-58+((i*53+Math.floor(t*30)*7)%40);ctx.fillStyle=(i+Math.floor(t*30))%3?'#ddd':'#555';ctx.fillRect(x,y,1.6,1.6);}}
 const o=(t*40)%5;for(let i=0;i<9;i++)ln(-26,-58+i*5+o,18,-58+i*5+o,'rgba(0,0,0,.18)',1);
 ell(-16,-48,4,7,'rgba(255,255,255,.28)',0.4);ctx.restore();scr();ctx.strokeStyle=OL;ctx.lineWidth=OLW*1.2;ctx.stroke();
 // pokrętła
 for(const [y,an] of [[-50,t*0.3],[-38,1]]){ctx.save();ctx.translate(24,y);ctx.rotate(an);sh(E(0,0,3.6,3.6),'#d4af37');ln(0,0,0,-3,'#5a3a10',0.9);ctx.restore();}
 for(let i=0;i<4;i++)ln(20,-28+i*2.4,28,-28+i*2.4,'#2a1a0c',0.9);
 txt('РУБИН',-5,-13.8,5.4,'#e6c24a');
 // serwetka, rybka-akwarium
 ctx.beginPath();ctx.moveTo(-18,-62);for(let i=0;i<=8;i++)ctx.lineTo(-18+i*4.5,-62+(i%2?3.6:1));ctx.lineTo(18,-62);ctx.closePath();fs('#f4f0e2',OLW*0.6);
 ctx.save();ctx.translate(-12,-62);sh(()=>{ctx.beginPath();ctx.arc(0,-6,6.6,0.9,PI_*2+0.24);ctx.closePath();},'rgba(180,220,240,.6)');
 const fx=Math.sin(t*1.8)*2.6;ell(fx,-6,2.2,1.4,'#f08a20');Pth([[fx+2,-6],[fx+4,-7.6],[fx+4,-4.4]]);ctx.fillStyle='#f08a20';ctx.fill();ell(fx-1,-6.4,0.4,0.4,'#111');ctx.restore();
 // antena z folią
 ln(4,-62,-8,-84,OL,2.6);ln(4,-62,-8,-84,'#999',1.3);ln(8,-62,22,-84,OL,2.6);ln(8,-62,22,-84,'#999',1.3);
 ctx.save();ctx.translate(-8,-84);ctx.rotate(Math.sin(t*3)*0.12);sh(P([[0,0],[-6,-2],[-7,3],[-1,4]]),'#d8dce2',null,OLW*0.6);ln(-5,-1,-2,2,'rgba(255,255,255,.8)',0.6);ctx.restore();
 sh(()=>{ctx.beginPath();ctx.arc(6,-62,4,PI_,0);ctx.closePath();},'#333');
 if(hurt){cracks([[[-14,-48],[-6,-38],[-12,-28]],[[-6,-38],[8,-36]]]);ctx.strokeStyle='#fff';ctx.lineWidth=0.6;ctx.beginPath();ctx.moveTo(-14,-48);ctx.lineTo(-6,-38);ctx.lineTo(8,-36);ctx.stroke();
  puff(10,-66,t,4,1.1,'rgba(90,90,90,A)',22);
  const sp=Math.floor(t*14)%3;if(sp===0)for(let i=0;i<4;i++){const an=i*1.6+t;ln(26,-44,26+Math.cos(an)*5,-44+Math.sin(an)*5,'#ffe060',1);}}
};

/* ---- Piła mechaniczna „Drużba” na koźle, kanister z bimbrem, taśma izolacyjna ---- */
D.pila=(d,t)=>{
 const rev=d&&d.rev;
 shadow(0,44);
 // kanister z XXX
 ctx.save();ctx.translate(-38,0);sh(R(-8,-22,16,22,2),'#c42a20',3);sh(R(-4,-26,5,4,1),'#c42a20',null,OLW*0.8);ln(-6,-14,6,-6,'rgba(0,0,0,.25)',1.4);ln(6,-14,-6,-6,'rgba(0,0,0,.25)',1.4);
 sh(R(-6,-17,12,7,1),'#f2ead0',null,OLW*0.6);txt('XXX',0,-11.6,5,'#8a1a12');ctx.restore();
 // kozioł
 for(const [a,b] of [[[-20,0],[-8,-24]],[[-2,0],[-8,-24]],[[20,0],[26,-24]],[[34,0],[26,-24]]])chain([a,b],[4.4,4],'#8a6238');
 sh(R(-14,-28,46,6,1),'#a07040',22);ctx.fillStyle='#d8c090';for(let i=0;i<5;i++)ell(-8+i*9,-21,0.8,0.5,'#d8c090');
 // trociny
 ctx.fillStyle='#e8d0a0';for(let i=0;i<9;i++)ell(-14+i*5+Math.sin(i)*2,-1-(i%3),1.4,0.7,'#e8d0a0');
 ctx.save();if(rev)ctx.translate(Math.sin(t*90)*1,Math.cos(t*70)*0.6);
 // prowadnica z łańcuchem
 sh(()=>{ctx.beginPath();ctx.moveTo(4,-44);ctx.lineTo(44,-42);ctx.arc(44,-37,5,-PI_/2,PI_/2);ctx.lineTo(4,-30);ctx.closePath();},'#a8aeb4',30);
 ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillRect(6,-41.4,36,1.2);
 const off=rev?(t*70)%5:0;ctx.fillStyle='#222';
 for(let i=0;i<9;i++){const x=6+i*5+off;if(x<44){Pth([[x,-44],[x+2,-47.4],[x+4,-44]]);ctx.fill();Pth([[x,-30],[x+2,-26.6],[x+4,-30]]);ctx.fill();}}
 // korpus
 sh(()=>{ctx.beginPath();ctx.moveTo(-22,-50);ctx.lineTo(8,-52);ctx.quadraticCurveTo(12,-40,8,-28);ctx.lineTo(-22,-26);ctx.quadraticCurveTo(-26,-38,-22,-50);ctx.closePath();},'#e8731c',-2);
 sh(R(-18,-46,12,7,1),'#1c1c1c');ctx.fillStyle='#555';for(let i=0;i<4;i++)ctx.fillRect(-17+i*3,-45,1.4,5);
 txt('ДРУЖБА',-5,-31.4,4.6,'#fff');
 // uchwyt z taśmą
 bez([-18,-50],[-12,-66],[2,-66],[6,-52],'#2a2a2a',3);
 ctx.save();ctx.translate(-7,-61.6);ctx.rotate(-0.1);sh(R(-4,-2.6,8,5.2,1),'#3a5aa8',null,OLW*0.7);ln(-3,-1.6,3,1.6,'rgba(255,255,255,.4)',0.6);ctx.restore();
 // linka rozrusznika
 sh(R(-28,-42,6,6,1.4),'#2a2a2a');ln(-25,-39,-30,-30,'#d8d0c0',0.8);sh(R(-32,-31,4,3,0.8),'#c42a20',null,OLW*0.6);
 ctx.restore();
 if(rev){puff(-26,-52,t,4,2,'rgba(90,90,90,A)',22);for(let i=0;i<5;i++){const p=(t*4+i/5)%1;ell(46+p*8,-30+p*10-i,1,0.6,'rgba(232,208,160,'+(1-p).toFixed(2)+')');}
  txt('WRRR',-4,-72+Math.sin(t*40),5.4,'rgba(255,255,255,.85)');}
};
})();
