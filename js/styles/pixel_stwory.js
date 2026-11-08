/* Piksel: chołota bez szkieletu (Nysa, świnia, kura, buraki, barszcz, krowa, Pałac Kultury).
   Siatka jak w pixel.js: 40 wierszy = wzrost człowieka, ziemia w wierszu 40, twarzą w lewo.
   Rozmiary z gry (skale w drawEnemyRaw / nPalac), przeliczone: 1 piksel = 2,5 jednostki. */
(()=>{
const L=(...fs)=>PIX.layer(p=>fs.forEach(f=>f(p))), N=(...fs)=>PIX.layer(p=>fs.forEach(f=>f(p)),false);
const {rect,ell,line,poly,stamp,text}=PIX;
const pt=(x,y,c)=>p=>p(Math.round(x),Math.round(y),c);
const fr=(k,st,n=4)=>st.walk||st.eat?PIX.frame(st,cycleOf(k,st).P,n):-1;
// cieniowanie bryły 16-bit: jasno z lewej-góry, ciemno z prawej-dołu, na przejściu szachownica
const shade=(prim,c)=>p=>{const a=[];prim((x,y)=>a.push([x,y]));if(!a.length)return;
 let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const [x,y] of a){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
 const cx=(x0+x1)/2,cy=(y0+y1)/2,rx=Math.max(1,(x1-x0)/2),ry=Math.max(1,(y1-y0)/2);
 for(const [x,y] of a){const s=-((x-cx)/rx+(y-cy)/ry)*0.5;p(x,y,s>0.42?c[0]:s<-0.45?c[2]:s<-0.2?(((x+y)&1)?c[1]:c[2]):c[1]);}};
// litery do napisów (pixel.js ma tylko te do „PLAN 5-LETNI”)
Object.assign(PIX.GLYPH,{M:["10001","11011","10101","10001","10001"],C:["111","100","100","100","111"],J:["001","001","001","101","111"]});
const E=PIX.E,SH=PIX.SH;

/* ---------- Milicyjna Nysa: biało-niebieska, kogut na dachu, w szybie milicjant ---------- */
SH.nysa=[22,24,23];
E.nysa=st=>{
 const t=st.t||0,f=fr('nysa',st),oy=st.walk&&f%2?-1:0,ox=st.eat?(Math.floor(t*14)%2?1:-1):0,on=Math.sin(t*14)>0;
 const X=x=>x+ox,Y=y=>y+oy;
 if(on)N(p=>{for(let j=-5;j<=4;j++)for(let i=-8;i<=7;i++){const d=Math.hypot(i,j*1.3);if(d>2.5&&d<7.5&&((i+j)&1))p(X(-4+i),Y(11+j),'rgba(80,150,255,'+(0.55-d*0.06).toFixed(2)+')');}});
 L(shade(poly([[X(-23),Y(35)],[X(-23),Y(24)],[X(-20),Y(22)],[X(-18),Y(13)],[X(20),Y(13)],[X(22),Y(15)],[X(22),Y(35)]],'W'),['#ffffff','#e6eaee','#b4bcc4']));
 N(rect(X(-23),Y(24),46,7,'B'),rect(X(-23),Y(31),46,3,'#c8ced4'),line(X(-23),Y(30),X(22),Y(30),'b'),line(X(-10),Y(14),X(-10),Y(33),'#9aa2ac'),
  text('MILICJA',X(-7),Y(25),'W'),rect(X(-12),Y(28),2,1,'k'));
 // przednia szyba z kierowcą w czapce i boczne okna
 L(poly([[X(-20),Y(22)],[X(-17.5),Y(14.5)],[X(-12),Y(14.5)],[X(-12),Y(22)]],'#8fb8d4'));
 N(rect(X(-16),Y(17),3,3,'S'),rect(X(-17),Y(16),5,1,'#2e3442'),rect(X(-16),Y(15),3,1,'#2e3442'),pt(X(-15),Y(16),'R'),pt(X(-16),Y(18),'K'),
  rect(X(-15),Y(20),3,2,'#4e5c70'),pt(X(-19),Y(21),'W'),pt(X(-18),Y(20),'W'));
 for(const x of [-8,0,8,15])L(rect(X(x),Y(15),x===15?5:6,6,'#8fb8d4')),N(pt(X(x+1),Y(16),'W'),pt(X(x+1),Y(17),'W'),pt(X(x+2),Y(16),'W'));
 // pałka wystaje z okna
 L(line(X(-6),Y(20),X(-8),Y(23),'W'),pt(X(-6),Y(19),'S'));
 L(rect(X(-23),Y(32),2,2,'#fff0b0'),rect(X(-25),Y(34),7,2,'k'),rect(X(18),Y(34),6,2,'k'));
 // koła z kręcącą się szprychą
 for(const wx of [-14,13]){L(ell(X(wx),36,4,4,'k'));N(ell(X(wx),36,1.6,1.6,'G'));const a=(f<0?0:f)*Math.PI/2+wx;N(pt(X(wx)+2.6*Math.cos(a),36+2.6*Math.sin(a),'g'));}
 // kogut
 L(rect(X(-7),Y(10),5,3,on?'#4a9bff':'#1a3a7a'),rect(X(-8),Y(12),7,1,'g'));N(pt(X(-6),Y(10),on?'W':'#4a6aaa'));
};

/* ---------- Zła świnia: irokez z kolców, kły, para z nosa w szarży ---------- */
SH.swinia=[14,16,15];
E.swinia=st=>{
 const t=st.t||0,f=fr('swinia',st),run=f>=0&&st.walk,b=run&&f%2?-1:0,hy=st.eat?[0,2,3,1][f<0?0:f]:0;
 const dx=run?[2,0,-2,0][f]:0;
 const legC=far=>far?'#b06878':'#c97888';
 for(const [x,d,far] of [[-6,-dx,true],[10,dx,true],[-9,dx,false],[7,-dx,false]])L(line(x,30+b,x+d,37,legC(far),2),rect(x+d-1,38,3,2,'#4a2a24'));
 L(shade(ell(2,25+b,13,8,'S'),['#f8c4ce','#e99aaa','#c97888']));
 N(ell(9,27+b,2,1,'rgba(120,60,70,.45)'),pt(-1,28+b,'rgba(120,60,70,.45)'));
 for(let i=0;i<7;i++){const x=-5+i*3;L(line(x,18+b,x+1,14-(i%2)*2+b,'#5a2e3e'));}
 L(pt(15,22+b,'#d98798'),pt(16,21+b,'#d98798'),pt(17,22+b,'#d98798'),pt(17,23+b,'#d98798'),pt(16,24+b,'#d98798'));
 // głowa
 const hx=-11,hyy=24+b+hy;
 L(poly([[hx-1,hyy-4],[hx+3,hyy-9],[hx+4,hyy-4]],'#c06e7e'));
 L(shade(ell(hx,hyy,5.5,5,'S'),['#f8c4ce','#eea3b0','#c97888']));
 L(ell(hx-5,hyy+1,2.4,2.2,'#d97f92'));N(pt(hx-6,hyy,'#5a1a2a'),pt(hx-4,hyy,'#5a1a2a'));
 N(pt(hx-2,hyy-2,'W'),pt(hx-2,hyy-1,'R'),pt(hx-1,hyy-2,'W'),line(hx-4,hyy-4,hx-1,hyy-3,'K'));
 L(rect(hx-3,hyy+4,1,2,'W'));
 N(pt(hx+1,hyy-6,'#5a2e3e'),pt(hx+2,hyy-7,'#d8ff60'));
 // para z nosa przy szarży, zielona ślina przy gryzieniu
 if(run)N(...[0,1,2].map(i=>pt(hx-8-i-((f+i)%3),hyy-1+i%2,'rgba(240,240,240,'+(0.75-i*0.2)+')')));
 if(st.eat)N(pt(hx-3,hyy+6+(f%2),'#8fe04a'));
};

/* ---------- Kura mutant: dwa łby, trzy nogi, zezowate oczy ---------- */
SH.kura=[9,11,10];
E.kura=st=>{
 const t=st.t||0,f=fr('kura',st),hop=st.walk?[0,2,3,1][f]:0,sw=st.walk?[1,0,-1,0][f]:0;
 for(const [x,d] of [[-3,sw],[1,-sw],[4,sw]])L(line(x,30-hop,x+d,38,'#e0a020'),line(x+d-2,39,x+d+1,39,'#e0a020'));
 L(poly([[6,24-hop],[11,17-hop],[12,21-hop],[14,19-hop],[12,27-hop]],'#e4dccc'));
 L(shade(ell(1,25-hop,7.5,5.5,'W'),['#ffffff','#efe8dc','#cfc6b4']));
 N(ell(3,25-hop,3,1.5,'#ddd4c2'),line(1,25-hop,5,24-hop,'#b8ae9a'),ell(-2,28-hop,1.5,1,'rgba(120,190,60,.6)'));
 const peck=st.eat?[[3,0],[0,3],[3,0],[0,3]][f]:[0,0];
 const head=(nx,ny,hx,hy,ex,cross)=>{L(line(nx,ny,hx,hy+2,'#efe8dc',2));L(ell(hx,hy,3,3,'#efe8dc'));
  L(rect(hx-2,hy-5,1,2,'R'),rect(hx-1,hy-6,1,3,'R'),rect(hx,hy-5,1,2,'R'));
  L(line(hx-5,hy,hx-3,hy,'#e0a020'),pt(hx-4,hy+1,'#e0a020'));L(pt(hx-3,hy+2,'R'),pt(hx-3,hy+3,'R'));
  N(rect(hx-2,hy-2,2,2,'#fff8a0'),pt(hx-2+(cross?1:0)+ex,hy-1+(cross?0:-1)*0,'K'));};
 const e1=Math.sin(t*20)>0?0:1;
 head(1,21-hop,3,12-hop+peck[1],0,true);
 head(-4,22-hop,-8,17-hop+peck[0],e1,false);
};

/* ---------- Burak mutant i buraczek ---------- */
const BEET=['#e070a4','#b03070','#5a1034'];
SH.burak=[7,9,8];
E.burak=st=>{
 const t=st.t||0,f=fr('burak',st),s=st.walk?[1,0,-1,0][f]:0,b=st.walk&&f%2?-1:0,ch=st.eat?[0,1,2,1][f]:0;
 L(line(-3,34+b,-4+s,38,'#5a1530',2),line(2,34+b,3-s,38,'#5a1530',2));
 for(const [x,a] of [[-4,-1],[0,0],[4,1]]){const w=Math.round(Math.sin(t*4+x));L(shade(ell(x+a*2+w*0.4,15+Math.abs(a)*2+b,2,4.5,'Z'),['#7cc85a','#4f9a3a','#2f6a22']));N(line(x+a,21+b,x+a*2+w*0.4,13+Math.abs(a)*2+b,'#2f6a22'));}
 L(shade(ell(0,27+b,8,8,'R'),BEET),poly([[-3,34+b],[3,34+b],[0,37+b]],BEET[2]));
 // ręce-korzonki z pięściami
 L(line(-8,27+b,-11,23+b-(ch?1:0),'#5a1530'),pt(-11,22+b-(ch?1:0),'#5a1530'),line(8,27+b,10,24+b,'#5a1530'));
 N(rect(-5,24+b,3,3,'W'),rect(0,24+b,3,3,'W'),pt(-5,25+b,'K'),pt(-4,25+b,'K'),pt(0,25+b,'K'),pt(1,25+b,'K'),
  line(-6,22+b,-3,23+b,'K'),line(3,22+b,0,23+b,'K'),pt(-4,22+b,'#ffd0e4'));
 N(rect(-5,29+b+ch*0,7,2+ch,'#2a0818'));for(let i=0;i<4;i++)N(pt(-5+i*2,29+b,'W'));if(ch)N(pt(-4,30+b+ch,'W'),pt(0,30+b+ch,'W'));
 N(pt(-6,20+b,'#f4a0c8'),pt(-5,19+b,'#f4a0c8'));
};
SH.buraczek=[6,7,6];
E.buraczek=st=>{
 const t=st.t||0,f=fr('buraczek',st),s=st.walk?[2,0,-2,0][f]:0,b=st.walk&&f%2?-2:0;
 L(line(-2,34+b,-3+s,39,'#5a1530'),line(2,34+b,3-s,39,'#5a1530'));
 L(shade(ell(0,25,2,4,'Z'),['#7cc85a','#4f9a3a','#2f6a22']),line(0,29+b,0,26,'#2f6a22'));
 L(shade(ell(0,31+b,6,5.5,'R'),BEET),poly([[-2,36+b],[2,36+b],[0,38+b]],BEET[2]));
 N(rect(-4,28+b,3,3,'W'),rect(0,28+b,3,3,'W'),pt(-4,29+b,'K'),pt(0,29+b,'K'),line(-5,27+b,-2,28+b,'K'),line(3,27+b,0,28+b,'K'));
 const o=Math.sin(t*12)>0||st.eat;N(rect(-3,32+b,4,o?3:1,'#2a0818'),pt(-3,32+b,'W'),pt(0,32+b,'W'));
 // pot ze złości
 N(pt(4,25+b-(Math.floor(t*6)%3),'#9fd0ff'));
};

/* ---------- Barszcz Sosnowskiego: łodyga w cętki, parasol kwiatu, kapiący jad ---------- */
SH.barszcz=[9,11,10];
E.barszcz=st=>{
 const t=st.t||0,f=fr('barszcz',st),s=st.walk?[1,0,-1,0][f]:0,lean=st.eat?[-1,-3,-4,-2][f]:0,sw=Math.round(Math.sin(t*2)*1.2)+lean;
 for(const [x,d] of [[-3,s],[0,-s],[3,s]])L(line(x,34,x+d*2,39,'#3f6a24',1),pt(x+d*2-1,39,'#3f6a24'));
 const sx=y=>Math.round(sw*(35-y)/28);
 L(p=>{for(let y=7;y<=35;y++){const x=sx(y);p(x-1,y,'#7aa84a');p(x,y,'#5f8a3a');p(x+1,y,'#3f6a24');}});
 N(p=>{for(let i=0;i<8;i++){const y=10+i*3;p(sx(y)+(i%2?1:-1),y,'#6a2a5a');}});
 // liście ząbkowane, na zmianę
 for(const [y,d] of [[31,-1],[26,1],[13,-1]]){const x=sx(y),wv=Math.round(Math.sin(t*3+y)*0.6);
  L(shade(poly([[x,y],[x+d*4,y-3+wv],[x+d*6,y-2],[x+d*8,y-4+wv],[x+d*10,y-1],[x+d*8,y+1],[x+d*9,y+3],[x+d*4,y+2]],'Z'),['#8cc860','#5f8a3a','#3f6a24']));}
 // parasol
 const tx=sx(7);for(let i=-4;i<=4;i++)N(line(tx,8,tx+i*2,5,'#5f8a3a'));
 L(p=>{for(let y=1;y<=5;y++){const w=Math.round(11*Math.sqrt(1-((5-y)/4.6)**2));for(let x=-w;x<=w;x++)p(tx+x,y,((x+y)%3)?'#f2efe2':'#d8d2be');}});
 // oczy i złośliwy uśmiech
 const ex=sx(19);N(rect(ex-3,18,2,2,'#ffe060'),rect(ex+1,18,2,2,'#ffe060'),pt(ex-3,19,'K'),pt(ex+1,19,'K'),line(ex-4,16,ex-1,17,'K'),line(ex+3,16,ex,17,'K'),
  line(ex-2,22,ex+2,22,'#2a0818'),pt(ex-3,21,'#2a0818'),pt(ex+3,21,'#2a0818'));
 // kapiący jad
 for(let i=0;i<3;i++){const p=((t*0.8+i/3)%1);N(pt(-7+i*7+sx(20),14+Math.round(p*24),'rgba(200,255,90,'+(0.9-p*0.6).toFixed(2)+')'));}
};

/* ---------- Krowa z Czarnobyla: dwie głowy, świeci, trójlistek na boku ---------- */
SH.krowa=[20,22,21];
E.krowa=st=>{
 const t=st.t||0,f=fr('krowa',st),gl=0.5+0.5*Math.sin(t*3),s=st.walk?[2,0,-2,0][f]:0,b=st.walk&&f%2?-1:0,moo=st.talk&&Math.sin(t*6)>0;
 N(p=>{for(let j=-14;j<=14;j++)for(let i=-26;i<=26;i++){const d=(i*i)/676+(j*j)/196;if(d<1&&d>0.35&&((i+j)&1))p(i,20+j,'rgba(150,255,90,'+((0.12+0.18*gl)*(1-d)+0.05).toFixed(2)+')');}});
 const leg=(x,d,far)=>L(p=>{for(let y=27;y<=37;y++){const xx=x+Math.round(d*(y-27)/10);p(xx,y+b*(y<30?1:0),far?'#d8d4c8':'#efece4');p(xx+1,y+b*(y<30?1:0),far?'#c0bcb0':'#d8d4c8');p(xx+2,y,far?'#b0aca0':'#c8c4b8');}},rect(x+d,38,3,2,'#2a2420'));
 leg(-12,-s,true);leg(8,s,true);
 L(shade(poly([[-14,12+b],[13,11+b],[17,16+b],[16,26+b],[12,28+b],[-12,28+b],[-16,24+b],[-17,16+b]],'W'),['#ffffff','#efece4','#c8c4b8']));
 N(ell(-8,16+b,4,3,'k'),ell(6,20+b,5,3.5,'k'),ell(12,14+b,2.5,2,'k'),ell(-3,25+b,3,1.6,'k'),pt(-8,15+b,'#3b3542'));
 // trójlistek
 N(stamp(['.YYY.','YKYKY','YYKYY','YKYKY','.YYY.'],-1,15+b));
 L(ell(4,29+b,3,1.6,'#f0a8b4'));N(pt(2,31+b,'#e08898'),pt(4,31+b,'#e08898'),pt(6,31+b,'#e08898'));
 leg(-9,s,false);leg(11,-s,false);
 // dwie głowy: z przodu w lewo i z tyłu w prawo
 const head=(cx,cy,d,g)=>{
  L(poly([[cx+d*1,cy-4],[cx-d*1,cy-7],[cx,cy-4]],'#e8e0c8'),poly([[cx-d*4,cy-4],[cx-d*6,cy-7],[cx-d*3,cy-4]],'#e8e0c8'));
  L(shade(ell(cx-d*2,cy,4,4,'W'),['#ffffff','#efece4','#c8c4b8']));
  L(ell(cx-d*5,cy+3,3,2.2,'#e8b0a8'));N(pt(cx-d*6,cy+3,'#5a2a2a'),pt(cx-d*4,cy+3,'#5a2a2a'));
  if(moo&&d>0)N(rect(cx-6,cy+5,3,1,'#5a1a2a'));
  N(rect(cx-d*3-(d>0?1:0),cy-2,2,2,'rgba(170,255,110,'+(0.7+0.3*g).toFixed(2)+')'),pt(cx-d*3-(d>0?1:0),cy-1,'#0a1a04'),pt(cx-d*1,cy-1,'k'));
  L(rect(cx-d*2-1,cy+5,2,2,'#c9a24a'));};
 head(-17,16+b,1,gl);head(17,15+b,-1,1-gl);
};

/* ---------- Pałac Kultury na kurzych nogach ---------- */
SH.palac=[16,18,17];
const STONE=['#f2e8cc','#d9ccb0','#b3a58a'];
E.palac=st=>{
 const t=st.t||0,f=fr('palac',st),hp=st.hp==null?1:st.hp,talk=st.talk&&Math.sin(t*10)>0;
 const lift=st.walk?[3,1,0,0][f]:0,lift2=st.walk?[0,0,3,1][f]:0,b=st.walk&&(f===1||f===3)?-1:0;
 const leg=(x,lf,far)=>{const c=far?'#c98a2a':'#e8a83a';L(line(x,27,x+4,33-lf,c,3),line(x+4,33-lf,x-1,38-lf,c,2));
  L(line(x-1,39-lf,x-5,39-lf,c),line(x-1,39-lf,x-4,37-lf,c),line(x,39-lf,x+2,39-lf,c));};
 leg(5,lift2,true);
 const Y=y=>y+b;
 // pierze pod pałacem
 L(poly([[-8,Y(27)],[8,Y(27)],[6,Y(30)],[3,Y(29)],[0,Y(31)],[-3,Y(29)],[-6,Y(30)]],'#efe8dc'));
 // skrzydła boczne, kondygnacje
 L(poly([[-14,Y(18)],[-20,Y(21)],[-20,Y(26)],[-14,Y(26)]],'#9aa0a6'),poly([[14,Y(18)],[20,Y(21)],[20,Y(26)],[14,Y(26)]],'#8a8e94'));
 L(shade(rect(-14,Y(18),29,10,'G'),STONE));
 L(shade(rect(-10,Y(12),21,6,'G'),STONE));
 L(shade(rect(-6,Y(6),13,6,'G'),STONE));
 L(shade(poly([[-3,Y(6)],[4,Y(6)],[3,Y(2)],[-2,Y(2)]],'G'),STONE));
 L(line(0,Y(1),0,Y(-6),'#c9b48a'));
 N(stamp(['..R..','RRRRR','.RRR.','R...R'],-2,Y(-10)));
 // okna
 N(p=>{for(const [x0,y0,w,h] of [[-12,13,11,4],[-8,7,8,3],[-4,1,4,4]])for(let y=0;y<h;y+=2)for(let x=0;x<=w*2;x+=3)p(x0+x,Y(y0+y),'#5a5040');});
 // zegar
 L(ell(0,Y(8),1.4,1.4,'W'));N(pt(0,Y(7),'K'),pt(1,Y(8),'K'));
 // czerwona szarfa „przyjaźń narodów”
 N(rect(-9,Y(16),19,2,'R'),...[...Array(6)].map((_,i)=>pt(-7+i*3,Y(16),'W')),line(-9,Y(17),9,Y(17),'r'));
 // twarz: płonące okna-oczy, brwi, drzwi-usta
 const g=0.6+0.4*Math.sin(t*5),eye='rgba(255,220,80,'+g.toFixed(2)+')';
 N(rect(-11,Y(20),4,2,eye),rect(-3,Y(20),4,2,eye),pt(-10,Y(21),'K'),pt(-2,Y(21),'K'),line(-12,Y(18),-7,Y(19),'K'),line(1,Y(18),-4,Y(19),'K'));
 N(rect(-6,Y(talk?22:23),5,talk?5:4,'#3a2a1a'));if(talk)N(rect(-5,Y(25),3,1,'R'),line(-6,Y(22),-2,Y(22),'W'),...[0,1,2].map(i=>pt(-13-i*2,Y(23+(i%2?-1:1)*i),'W')));
 for(let i=0;i<4;i++)N(rect(4+i*3,Y(21),1,2,'#5a5040'),rect(-13+i*0,Y(24),1,1,'#5a5040'));
 // pęknięcia przy ranach
 if(hp<0.6)N(line(-12,Y(19),-9,Y(22),'K'),line(-9,Y(22),-11,Y(25),'K'),line(6,Y(13),8,Y(16),'K'));
 if(hp<0.3){N(line(10,Y(19),7,Y(23),'K'),line(7,Y(23),9,Y(26),'K'),line(-4,Y(8),-2,Y(11),'K'));
  for(let i=0;i<3;i++){const q=(t*0.7+i/3)%1;N(pt(9+i*2,Y(Math.round(17-q*10)),'rgba(90,90,90,'+(0.7*(1-q)).toFixed(2)+')'),pt(10+i*2,Y(Math.round(17-q*10)),'rgba(90,90,90,'+(0.5*(1-q)).toFixed(2)+')'));}}
 leg(-5,lift,false);
};
})();
