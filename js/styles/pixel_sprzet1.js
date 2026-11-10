/* Piksel: sprzęt cz. 1 – bimbrownia, wyrzutnie, słoje, samowar, armata, meblościanka, Rubin, piła.
   Siatka: 36 pikseli = pole (72 jednostki gry), ziemia w wierszu 0, w górę ujemne y, wróg nadchodzi z prawej. */
(()=>{
const X1=window.PIX;   // rejestr pikseli (PX to funkcja gry)
const {layer:L,rect,ell,line,poly,stamp}=X1;
const S=(...f)=>p=>f.forEach(g=>g(p));
const R=Math.round;
// cień na ziemi: dwa wiersze pod przedmiotem
const shadow=(rx,x=0)=>L(S(rect(x-rx,0,2*rx+1,1,'rgba(0,0,0,.32)'),rect(x-rx+3,1,2*rx-5,1,'rgba(0,0,0,.2)')),false);
// pozycja ramienia wyrzutni jak w grze: a=-1.2 naciągnięte (w lewo), 0.38 po strzale (w prawo)
const armA=(d,t)=>catSt(d,t).a;
const tipOf=(piv,a,len)=>[piv[0]+Math.sin(a)*len,piv[1]-Math.cos(a)*len];
const rot=(p,o,a)=>{const c=Math.cos(a),s=Math.sin(a);return[o[0]+p[0]*c-p[1]*s,o[1]+p[0]*s+p[1]*c];};
const puff=(x,y,r,c)=>L(ell(x,y,r,r,c),false);
// dymek: 3 kłęby unoszące się w pętli
function smoke(x,y,t,col='rgba(225,225,225,',speed=0.5,rise=10){for(let i=0;i<3;i++){const q=(t*speed+i/3)%1;puff(R(x+Math.sin(t*2+i*2)*1+q*2),R(y-q*rise),1+q*2,col+(0.55*(1-q)).toFixed(2)+')');}}

// gumofilc (nosek w prawo), 6×8
const BOOT=["WWWW..","GGGG..","kkkk..","kkkk..","kkkk..","kkkkkk","kkkkkk","gggggg"];
// kryształowy kieliszek do meblościanki
const GLASS=["WGW","GWG",".W.","WWW"];

PIX.D.bimbrownia=(d,t)=>{   // uproszczona: piec, kocioł, rurka, gąsior
 shadow(20,-1);
 // piec z cegły i ogień
 L(S(rect(-20,-12,16,12,'#a4512e'),rect(-20,-8,16,1,'#7c3a20'),rect(-20,-4,16,1,'#7c3a20'),rect(-16,-5,8,5,'#2a1208')));
 L(p=>{for(let i=0;i<4;i++){const h=1+R(1.5+1.5*Math.sin(t*9+i*1.7));for(let j=0;j<h;j++)p(-15+i*2,-1-j,j===h-1?'#ff7a1a':'#ffd25a');}},false);
 // kocioł: jeden kolor, odblask, cień z prawej
 L(S(ell(-12,-19,8,7,'#c8703a'),p=>{for(let y=-25;y<=-13;y++)for(let x=-8;x<=-4;x++)if((x+12)**2/64+(y+19)**2/49<=1)p(x,y,'#9a4c22');},rect(-17,-22,1,3,'#f6c8a0'),rect(-13,-28,3,2,'#9a4c22')));
 // rurka i gąsior
 L(S(line(-12,-28,-6,-31,'#c8703a'),line(-6,-31,2,-30,'#c8703a'),line(2,-30,7,-25,'#c8703a'),line(7,-25,8,-14,'#c8703a')));
 const lvl=-2-R(7*((t*0.04)%1));
 L(S(ell(8,-6,6,6,'#cfe6e0'),rect(7,-14,3,3,'#cfe6e0'),p=>{for(let y=lvl;y<=-1;y++)for(let x=2;x<=14;x++)if((x-8)**2/37+(y+6)**2/37<=1)p(x,y,'#e8be50');},rect(4,-9,1,3,'#ffffff')));
 const dc=(t*1.4)%1;if(dc<0.7)L(rect(8,-13+R(dc/0.7*2),1,1,'#f0d070'),false);
 smoke(-12,-31,t);
 if(d&&d.t<1.2)L(ell(8,-6,9,9,'rgba(255,230,120,'+(0.25+0.2*Math.sin(t*15)).toFixed(2)+')'),false);
};


PIX.D.gumofilce=(d,t)=>{
 const a=armA(d,t),pull=clamp((0.38-a)/1.58,0,1),loaded=a<-1.0;
 shadow(19,-2);
 L(stamp(BOOT,-19,-8));L(stamp(BOOT,-13,-8));                 // zapas butów
 const px=R(lerp(4,-12,pull)),py=R(lerp(-26,-21,pull));
 L(line(9,-29,px+2,py,'#d0442a'),false);                      // dalsza guma
 L(S(line(3,-1,3,-14,'N',2),line(3,-14,-2,-28,'N',2),line(4,-14,9,-29,'N',2),rect(3,-12,2,1,'n'),rect(3,-8,2,1,'n')));
 L(line(-1,-28,px-1,py,'#e0583a'),false);                     // bliższa guma
 L(rect(px-2,py,5,2,'n'));
 if(loaded)L(stamp(BOOT,px-3,py-8));
};

PIX.D.pralka=(d,t)=>{
 const kick=d&&d.kick>0,j=kick?R(Math.sin(t*60)):0,lid=kick?-R(3*d.kick/0.25):0;
 shadow(18,-1);
 // skrzynka z małymi słoikami
 L(S(rect(-17,-7,13,7,'#8a6238'),rect(-17,-4,13,1,'#5e3a1e')));
 for(const x of [-16,-12,-8]){L(S(rect(x,-12,3,5,'rgba(215,240,230,.92)'),rect(x+1,-11,1,4,'#6a9a2a')));L(rect(x,-13,3,1,'#c9a24a'));}
 // wielki słój z ogórkami
 const x0=-2+j;
 L(S(rect(x0,-27,19,26,'rgba(200,232,222,.9)'),rect(x0+1,-28,17,1,'rgba(200,232,222,.9)'),rect(x0,-23,19,22,'#aac872'),
  p=>{for(const [x,y,h] of [[2,-22,15],[6,-24,18],[10,-21,14],[14,-23,16]])for(let k=0;k<h;k++){p(x0+x,y+k,'#5a8a22');p(x0+x+1,y+k,k%3?'#5a8a22':'#3a6a12');}},
  rect(x0+1,-26,1,22,'rgba(255,255,255,.65)'),ell(x0+13,-6,1,1,'#f2efe0')));
 L(S(rect(x0+4,-13,11,5,'#f4ecd0'),rect(x0+5,-11,9,1,'#2a6a12')));
 L(S(rect(x0-1,-30+lid,21,3,'#c9a24a'),rect(x0-1,-29+lid,21,1,'#8a6a1a')));
 if(kick)for(let i=0;i<3;i++)L(rect(x0+4+i*5,-33+lid-((t*20+i)%3|0),1,1,'rgba(200,230,170,.9)'),false);   // chlup solanki
};

PIX.D.resztki=(d,t)=>{
 const a=armA(d,t),loaded=a<-1.0;
 shadow(20,-1);
 // garnek z resztkami
 L(S(poly([[-18,-15],[-1,-15],[-2,-1],[-17,-1]],'#f2efe6'),rect(-6,-15,4,14,'#cfcbc0'),rect(-18,-16,18,1,'#2a5aa8'),rect(-14,-9,2,2,'#2a5aa8')));
 L(S(rect(-20,-13,2,2,'#2a5aa8'),rect(0,-13,2,2,'#2a5aa8')));
 L(S(ell(-13,-18,3,3,'#7cc24a'),ell(-7,-18,3,3,'#6aae3c'),rect(-14,-19,2,1,'#4f8a2a')));
 L(S(line(-4,-20,1,-23,'#efe7d2',2),rect(1,-24,2,2,'#efe7d2')));
 smoke(-10,-22,t,'rgba(240,240,240,',0.4,8);
 // wyrzutnia: kozioł + chochla
 L(S(poly([[2,-1],[11,-1],[8,-5],[5,-5]],'#6e4a2a'),line(6,-4,6,-14,'#8a5a32',2)));
 const piv=[6.5,-14],tip=tipOf(piv,a,18),back=tipOf(piv,a,-3);
 L(line(R(back[0]),R(back[1]),R(tip[0]),R(tip[1]),'#b8bec4',1));
 L(S(ell(R(tip[0]),R(tip[1]),3,2,'#c9ced4'),rect(R(tip[0])-2,R(tip[1])-1,2,1,'#ffffff')));
 if(loaded)L(S(ell(R(tip[0]),R(tip[1])-3,2.5,2.5,'#7cc24a'),rect(R(tip[0])-1,R(tip[1])-4,1,2,'#4f8a2a')));
 L(rect(5,-15,3,3,'#555'));
};

PIX.D.woda=(d,t)=>{
 const a=armA(d,t),loaded=a<-1.0;
 shadow(20,-1);
 // przydrożny krzyż i wiadro święconej
 L(S(rect(11,-34,3,34,'#7a5232'),rect(13,-34,1,34,'#5a3a1e'),rect(7,-28,11,2,'#7a5232'),rect(12,-27,1,1,'#e6c24a')));
 L(S(poly([[-18,-12],[-16,-1],[-5,-1],[-3,-12]],'#3a6ac0'),rect(-7,-12,3,11,'#2a4a90'),rect(-12,-10,2,7,'#e6c24a'),rect(-14,-8,6,2,'#e6c24a')));
 L(S(rect(-17,-13,13,1,'#a8d4ff'),rect(-14,-13,3,1,'#e8f6ff')),false);
 L(S(line(-19,-12,-15,-17,'#9aa0a6'),line(-15,-17,-6,-17,'#9aa0a6'),line(-6,-17,-2,-12,'#9aa0a6')),false);
 // ramię z kropidłem
 L(S(poly([[0,-1],[7,-1],[5,-4],[2,-4]],'#6e4a2a'),line(3,-3,3,-13,'#8a5a32',2)));
 const piv=[3.5,-13],tip=tipOf(piv,a,17);
 L(line(R(piv[0]),R(piv[1]),R(tip[0]),R(tip[1]),'#7a5232',1));
 L(S(ell(R(tip[0]),R(tip[1]),3,3,'#c9ced4'),p=>{for(const [x,y] of [[-1,-1],[1,0],[0,1],[1,-2]])p(R(tip[0])+x,R(tip[1])+y,'#55585c');},rect(R(tip[0])-2,R(tip[1])-2,1,1,'#ffffff')));
 L(rect(2,-14,3,3,'#555'));
 if(loaded){const b=(t*2)%1;L(rect(R(tip[0]),R(tip[1])+4+R(b*3),1,1,'#a8d4ff'),false);}
 else if(a>0)for(let i=0;i<5;i++){const q=((t*3+i/5)%1);L(rect(R(tip[0]+2+q*10+i),R(tip[1]-2+q*q*8-i),1,1,'rgba(168,212,255,'+(1-q).toFixed(2)+')'),false);}
};

PIX.D.samowar=(d,t)=>{   // uproszczony: korpus, kranik, czajniczek
 const open=d?d.kick>0:false;
 shadow(13);
 L(poly([[-7,0],[8,0],[5,-4],[-4,-4]],'#a8781e'));
 L(S(ell(0,-15,9,10,'#d4a43a'),p=>{for(let y=-25;y<=-5;y++)for(let x=4;x<=9;x++)if(x*x/81+(y+15)**2/100<=1)p(x,y,'#a8781e');},rect(-6,-20,1,7,'#ffe7a0')));
 L(S(rect(8,-9,6,2,'#d4a43a'),rect(13,-8,1,2,'#d4a43a')));
 L(open?rect(11,-12,1,3,'#8a6420'):rect(10,-11,3,1,'#8a6420'));
 L(rect(-5,-27,11,2,'#b8862a'));
 L(S(ell(0,-31,5,3,'#f2efe6'),rect(-4,-30,9,1,'#2a4fa0'),line(5,-32,7,-35,'#f2efe6'),rect(0,-35,1,1,'#2a4fa0')));
 smoke(7,-37,t,'rgba(240,240,240,',0.45,8);
 if(false){const k=d.kick/0.25;   // strumień w grze rysuje efekt 'steam'
  L(p=>{for(let i=0;i<24;i++){const x=14+i,y=R(-7+i*i*0.014-Math.sin(i/24*Math.PI)*2);p(x,y,'#c8e6ff');if(i%3)p(x,y-1,'#ffffff');}},false);
  for(let i=0;i<3;i++){const q=((t*2.2+i/3)%1);puff(R(17+q*18),R(-10-q*6),1+q*1.6,'rgba(245,248,255,'+(0.6*(1-q)*k+0.2).toFixed(2)+')');}}
};


PIX.D.armata=(d,t)=>{
 const rec=d&&d.kick>0?-R((d.kick/0.25)*3):0,o=[-1+rec,-12],A=-0.25;
 shadow(17);
 L(poly([[-15,-3],[5,-8],[6,-5],[-14,-1]],'#6e4a2a'));
 const B=pts=>pts.map(p=>rot(p,o,A));
 L(S(poly(B([[-9,-4],[15,-3],[15,3],[-9,4]]),'#a8782c'),poly(B([[-9,-4],[15,-3],[15,-1],[-9,-1.5]]),'#e8bc70'),
  p=>{for(const x of [-5,3,10])for(let y=-3;y<=3;y++){const q=rot([x,y],o,A);p(R(q[0]),R(q[1]),'#c9962e');}}));
 const m=rot([16,0],o,A),c=rot([-10,0],o,A);
 L(S(ell(R(m[0]),R(m[1]),1.5,3.5,'#8a6420'),ell(R(c[0]),R(c[1]),2,2,'#8a6420')));
 // koło na szprychach
 const wr=t*0;L(S(ell(-3,-6,5.5,5.5,'#3a3a3a'),ell(-3,-6,4.3,4.3,'#5a3e24'),p=>{for(let i=0;i<4;i++){const an=i*Math.PI/4+wr;for(let r=-4;r<=4;r++)p(R(-3+Math.cos(an)*r),R(-6+Math.sin(an)*r),'#8a6238');}},rect(-4,-7,2,2,'#3a3a3a')));
 L(p=>{for(const [x,y] of [[7,-3],[12,-3],[9.5,-7]]){ell(x,y,1.8,1.8,'#1c1c1c')(p);p(R(x)-1,y-1,'#8a8a8a');}});
 if(d&&d.kick>0.15){const f=rot([19,0],o,A);   // błysk i dym z lufy
  L(S(ell(R(f[0]),R(f[1]),3.5,3,'#ffc85a'),ell(R(f[0]),R(f[1]),1.8,1.5,'#fff6c0')),false);
  for(let i=0;i<3;i++)puff(R(f[0]+3+i*3),R(f[1]-2-i*2),1.5+i,'rgba(200,200,200,.6)');}
};

PIX.D.szafa=(d,t)=>{
 const hp=d&&d.max?d.hp/d.max:1;
 shadow(15);
 L(S(rect(-13,-32,26,31,'#8a5530'),rect(8,-32,5,31,'#5e3a1e'),rect(-13,-32,1,31,'#a86a3e')));
 L(S(rect(-14,-34,28,2,'#6e4024'),rect(-13,-2,26,1,'#3a2010')));
 for(const x0 of [-11,0]){
  L(S(rect(x0,-30,10,13,'rgba(160,200,215,.8)'),rect(x0,-24,10,1,'#6e4024')),true);
  L(S(stamp(GLASS,x0+1,-28),stamp(GLASS,x0+5,-28),stamp(GLASS,x0+2,-22),stamp(GLASS,x0+6,-22),line(x0+1,-19,x0+7,-29,'rgba(255,255,255,.35)')),false);
 }
 for(const y of [-15,-8])L(S(rect(-11,y,21,5,'#6e4024'),rect(-2,y+2,4,1,'#c9a24a')));
 // serwetka i wazon
 L(rect(-6,-35,12,1,'W'));
 if(hp>=0.33)L(S(ell(3,-38,2,3,'#c9d8e8'),rect(2,-39,3,1,'#2a4fa0')));
 else L(S(ell(18,-2,3,1,'#c9d8e8'),rect(17,-2,1,1,'#2a4fa0')));    // wazon spadł
 if(hp<0.66)L(S(line(-11,-23,-6,-21,'#1a0c04'),line(-6,-21,-8,-17,'#1a0c04'),line(-5,-28,-3,-25,'#1a0c04')),false);
 if(hp<0.33)L(S(rect(1,-30,4,6,'#1a1a22'),line(12,-30,6,-26,'#1a0c04'),line(6,-26,8,-20,'#1a0c04'),line(8,-20,4,-15,'#1a0c04')),false);
};

PIX.D.rubin=(d,t)=>{
 const hurt=d&&d.hp<d.max*0.5;
 shadow(15);
 L(S(line(-11,-6,-12,-1,'#3a2414'),line(9,-6,10,-1,'#3a2414')));
 // antena „królicze uszy”
 L(S(line(-3,-28,-9,-37,'#888'),line(-1,-28,5,-37,'#888')),true);
 L(S(rect(-14,-27,28,21,'#8a5530'),rect(9,-27,5,21,'#5e3a1e'),rect(-14,-27,28,1,'#a86a3e')));
 L(S(rect(-4,-29,4,2,'#333')));
 // ekran: niebieska poświata, przesuwająca się linia, a na niej mała czerwona gwiazdka
 const scan=-24+R((t*8)%15);
 L(S(rect(-11,-24,18,14,'#2a3a48'),rect(-10,-25,16,16,'#2a3a48'),ell(-2,-17,7,5,'#4a6070'),ell(-3,-18,4,3,'#7d97a8'),
  rect(-10,scan,16,1,'rgba(200,230,255,.45)'),rect(-9,-23,2,3,'rgba(255,255,255,.5)')));
 const tw=Math.sin(t*3)>0;L(p=>{for(const [x,y] of [[-3,-20],[-4,-18],[-2,-18],[-3,-17],[-5,-19],[-1,-19],[-3,-19]])p(x,y,tw?'#ff5a4a':'#d0342c');},false);
 L(S(ell(11,-22,1.5,1.5,'#d4af37'),ell(11,-17,1.5,1.5,'#d4af37')));
 L(p=>{for(let y=-13;y<=-9;y+=2)for(let x=9;x<=12;x++)p(x,y,'#2a1a0c');},false);
 L(rect(-6,-8,8,1,'#e6c24a'),false);
 if(hurt){L(S(line(-7,-23,-3,-17,'#ffffff'),line(-3,-17,-6,-12,'#ffffff'),line(-3,-17,3,-16,'#ffffff')),false);smoke(-2,-30,t,'rgba(120,120,120,',1.3,8);}
};

PIX.D.pila=(d,t)=>{
 const rev=d&&d.rev,jx=rev?R(Math.sin(t*90)*0.6):0,jy=rev?R(Math.cos(t*70)*0.6):0;
 shadow(16,3);
 L(S(line(-11,-1,-6,-12,'#7a5634',2),line(-2,-1,-6,-12,'#7a5634',2),line(9,-1,11,-12,'#7a5634',2),line(16,-1,11,-12,'#7a5634',2)));
 L(S(rect(-8,-13,22,2,'#8a6238'),rect(-8,-12,22,1,'#6a4a28')));
 // prowadnica z łańcuchem
 const off=rev?R(t*30)%2:0,X=jx,Y=jy;
 L(S(poly([[1+X,-20+Y],[20+X,-19+Y],[22+X,-17+Y],[20+X,-15+Y],[1+X,-15+Y]],'#a0a6ac'),rect(2+X,-19+Y,17,1,'#d6dade'),
  p=>{for(let i=0;i<10;i++){const x=2+i*2+off+X;if(x<21+X){p(x,-21+Y,'#222');p(x,-14+Y,'#222');}}}));
 // korpus pomarańczowy
 L(S(rect(-10+X,-23+Y,13,11,'#e8731c'),rect(-10+X,-16+Y,13,4,'#b8540c'),rect(-8+X,-21+Y,5,3,'#1c1c1c'),rect(-2+X,-22+Y,4,1,'#ffffff')));
 L(S(line(-8+X,-23+Y,-5+X,-27+Y,'#2a2a2a'),line(-5+X,-27+Y,1+X,-27+Y,'#2a2a2a'),line(1+X,-27+Y,2+X,-23+Y,'#2a2a2a')));
 L(rect(-13+X,-19+Y,3,3,'#2a2a2a'));
 if(rev){smoke(-12,-21,t,'rgba(90,90,90,',2,7);L(p=>{for(let i=0;i<3;i++){const q=(t*6+i/3)%1;p(R(22+q*4),R(-17-q*3+i),'#ffd25a');}},false);}
};
})();
