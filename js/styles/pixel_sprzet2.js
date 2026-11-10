/* Pixel art sprzętu, część 2: kombajn, relikwia, kabel, sklep mięsny, gnojówka, aparatura, flaszka, pług, łopata, Ursus.
   Siatka: 36 pikseli = pole (2 jednostki gry na piksel), ziemia w wierszu 0, w górę ujemne y; wrogowie idą z prawej. */
(()=>{const PX=window.PIX;   // rejestr pixel art (PX w grze to funkcja)
const {layer,rect,ell,line,poly}=PX;
const L=(...f)=>layer(p=>f.forEach(g=>g(p)));          // kształty jednej warstwy, z konturem
const N=(...f)=>layer(p=>f.forEach(g=>g(p)),false);    // bez konturu: blaski, napisy, cienie
const fr=(t,fps,n)=>((Math.floor(t*fps)%n)+n)%n;
const dots=(pts,c)=>p=>pts.forEach(q=>p(Math.round(q[0]),Math.round(q[1]),c));
const shadow=(cx,w)=>N(ell(cx,-0.2,w,1.3,'rgba(0,0,0,.32)'));
const hurt=d=>d&&d.max&&d.hp<d.max*0.5;
const C={wood:'#8a5a32',woodD:'#5e3a1e',woodL:'#b07a46',iron:'#9aa0a6',ironD:'#5f656b',ironL:'#d6dadd',gold:'#e0b030',goldD:'#a87818',
 red:'#d0342c',redD:'#8a1e18',redL:'#ee6a4a',cream:'#f4ecd0',green:'#3f8a3a',pink:'#e88a86',pinkL:'#f7c6bd',dirt:'#6a4a26',dirtD:'#4a3218'};
/* font 3×5 na szyldy */
const FONT3={A:'010101111101101',B:'110101110101110',E:'111100110100111',I:'111010010010111',M:'101111111101101',N:'110101101101101',
 O:'111101101101111',S:'111100111001111',U:'101101101101111',R:'110101110101101',Z:'111001010100111',C:'111100100100111','3':'111001011001111','0':'111101101101111',X:'101101010101101',' ':'000000000000000'};
const txt=(s,x,y,c)=>p=>{for(const ch of s){const g=FONT3[ch]||FONT3[' '];for(let i=0;i<15;i++)if(g[i]==='1')p(x+i%3,y+Math.floor(i/3),c);x+=4;}};
const txtW=s=>s.length*4-1;
// koło: opona, bieżnik obraca się z kątem a, felga z konturem, piasta
function wheel(cx,cy,r,a,rim,n){
 L(ell(cx,cy,r,r,'#1e1e22'));
 N(p=>{for(let i=0;i<n;i++){const q=a+i*Math.PI*2/n;p(Math.round(cx+Math.cos(q)*(r-0.6)),Math.round(cy+Math.sin(q)*(r-0.6)),'#62626c');}});
 L(ell(cx,cy,r*0.48,r*0.48,rim));
 N(line(Math.round(cx-Math.cos(a)*r*0.4),Math.round(cy-Math.sin(a)*r*0.4),Math.round(cx+Math.cos(a)*r*0.4),Math.round(cy+Math.sin(a)*r*0.4),'#8a6a1a'),p=>p(Math.round(cx),Math.round(cy),'#2a2a2a'));
}
function smoke(x,y,t,k,col){const n=3;N(p=>{for(let i=0;i<n;i++){const q=(t*k+i/n)%1,r=0.6+q*2.2,cx=x+q*3+Math.sin(t*3+i)*1,cy=y-q*9;ell(cx,cy,r,r,col||'rgba(110,110,110,'+(0.6*(1-q)).toFixed(2)+')')(p);}});}

const D=PIX.D;

/* Kombajn Bizon: czerwony, kierowca w kabinie, nagarniacz mieli */
D.kombajn=(d,t)=>{const rev=d&&d.rev,j=rev?fr(t,14,2):0;
 shadow(1,20);
 // przyrząd żniwny z zębami i nagarniacz
 L(poly([[6,-9],[20,-7],[20,-3],[6,-4]],C.redD));
 N(p=>{for(let i=0;i<7;i++){p(7+i*2,-2,'#d8d8d8');p(7+i*2,-1,i%2?'#d8d8d8':'#b0b0b0');}});
 L(rect(-17,-22,24,16,C.red));
 N(rect(-17,-15,24,1,C.redD),rect(-17,-8,24,2,C.redD),p=>{for(let i=0;i<5;i++)for(let y=-13;y<-9;y++)p(-14+i*4,y,C.redD);});
 N(rect(-17,-22,24,1,C.redL));
 N(txt('BIZON',-14,-21,'#fff6dc'));
 // kosz zbożowy
 L(rect(-6,-28,11,6,C.gold));N(p=>{for(let i=0;i<4;i++)p(-5+i*3,-27,C.goldD);},rect(-6,-28,11,1,'#f4d070'));
 if(rev)N(p=>{for(let i=0;i<5;i++)p(-4+((i*3+fr(t,10,9))%9),-29-(i%2),'#f4d070');});
 // kabina z kierowcą
 L(rect(-18,-33,11,11,C.cream));
 L(rect(-16,-31,7,7,'#8fb8d4'));
 N(rect(-16,-31,1,6,'#d8ecf6'),rect(-12,-29,3,3,'#e2a07c'),rect(-13,-31,5,2,'#3a5a8a'),rect(-14,-30,1,1,'#3a5a8a'),p=>{p(-12,-28,'#1c140e');p(-13,-26,'#5a3a20');p(-12,-26,'#5a3a20');});
 // rura wydechowa
 L(rect(-17,-37,2,4,'#2a2a2a'));if(d)smoke(-16,-38,t,1.4);
 // nagarniacz
 const a=(rev?t*9:t*1.2);
 N(p=>{for(let i=0;i<6;i++){const q=a+i*Math.PI/3;line(15,-12,Math.round(15+Math.cos(q)*6),Math.round(-12+Math.sin(q)*6),'#c8a020')(p);}});
 L(p=>{for(let i=0;i<6;i++){const q=a+i*Math.PI/3;p(Math.round(15+Math.cos(q)*6),Math.round(-12+Math.sin(q)*6),'#f0d040');}},rect(14,-13,2,2,'#5a5a5a'));
 if(rev)N(p=>{for(let i=0;i<4;i++){const q=(t*3+i/4)%1;p(Math.round(21+q*4),Math.round(-14+q*10),'#e8d070');}});
 wheel(-11,-6,6,rev?t*4:0,C.gold,8);wheel(3,-4,4,rev?t*6:0,C.gold,6);
 if(hurt(d)){N(line(-12,-20,-8,-15,'#3a0e08'),line(-8,-15,-10,-11,'#3a0e08'),line(-1,-21,2,-17,'#3a0e08'));smoke(-4,-24,t,0.9,null);}
 if(j)N(p=>p(-15,-36,'#555'));
};

/* Relikwia w puszce po landrynkach: puszka ze skrzydełkami na stołku z koronką, aureola pulsuje */
D.relikwia=(d,t)=>{const pulse=0.5+0.5*Math.sin(t*3),wave=d&&d.kick>0?1-d.kick/0.25:-1;
 N(ell(0,-15,15+pulse*2,13+pulse*2,'rgba(255,230,140,'+(0.18+pulse*0.14).toFixed(2)+')'),ell(0,-15,10,9,'rgba(255,240,170,'+(0.2+pulse*0.15).toFixed(2)+')'));
 N(p=>{for(let i=0;i<8;i++){const q=i/8*Math.PI*2+fr(t,4,8)*Math.PI/16;line(Math.round(Math.cos(q)*11),Math.round(-15+Math.sin(q)*9),Math.round(Math.cos(q)*(14+pulse*2)),Math.round(-15+Math.sin(q)*(12+pulse*2)),i%2?'#fff0a0':'#ffe070')(p);}});
 if(wave>=0)N(p=>{const r=6+wave*16;for(let i=0;i<40;i++){const q=i/40*Math.PI*2;p(Math.round(Math.cos(q)*r),Math.round(-12+Math.sin(q)*r*0.6),wave<0.6?'#fff6c0':'#f0e090');}});
 shadow(0,11);
 // stołek z koronkową serwetką
 L(rect(-8,-6,2,6,C.wood),rect(6,-6,2,6,C.wood));L(rect(-10,-9,20,3,C.woodL));
 L(rect(-9,-10,18,1,'#f2eee2'));N(p=>{for(let x=-9;x<9;x+=2)p(x,-9,'#f2eee2');});
 // skrzydełka
 const fl=fr(t,6,2);
 L(poly([[-7,-17],[-15,-22+fl],[-13,-16],[-15,-13+fl],[-7,-13]],'#fbf7ee'));L(poly([[7,-17],[15,-22+fl],[13,-16],[15,-13+fl],[7,-13]],'#fbf7ee'));
 N(line(-13,-19+fl,-9,-16,'#c8c2b8'),line(13,-19+fl,9,-16,'#c8c2b8'));
 // puszka
 L(rect(-7,-19,14,9,C.gold));
 N(rect(-7,-16,14,3,C.green),p=>{['#ff6a8a','#ffe060','#7ad0ff','#ff9a40','#c080ff'].forEach((c,i)=>p(-6+i*3,-15,c));},rect(4,-16,3,3,'#2c6a2a'),rect(4,-19,3,3,'#b08a20'),rect(4,-13,3,3,'#b08a20'),rect(-6,-19,1,9,'#f6d870'));
 L(rect(-8,-21,16,2,C.red));N(rect(-4,-21,8,1,'#f0d060'));
 if(hurt(d))N(line(-7,-13,-4,-11,'#5a3a10'),p=>{p(5,-18,'#5a3a10');p(6,-17,'#5a3a10');});
 // świecące okruchy
 N(p=>{for(let i=0;i<4;i++){const q=(t*0.6+i/4)%1;p(-6+i*4,Math.round(-23-q*10),'rgba(255,250,200,'+(0.9*(1-q)).toFixed(2)+')');}});
};

/* Goły kabel pod prądem: słup z izolatorami, tabliczka „uwaga”, kabel wije się po trawie i iskrzy */
D.kabel=(d,t)=>{const on=Math.sin(t*9)>0.1;
 N(ell(3,-1,13,1.5,'rgba(30,20,10,.4)'));if(Math.sin(t*9)>0.1)N(ell(6,-5,10,4,'rgba(255,240,120,.2)'));
 L(rect(-15,-24,2,24,C.wood));L(rect(-18,-22,8,1,C.woodD));
 L(rect(-18,-24,1,2,'#eeeee6'),rect(-11,-24,1,2,'#eeeee6'));
 // żółta tabliczka z piorunem
 L(poly([[-14,-17],[-11,-11],[-17,-11]],'#ffd02a'));N(p=>{p(-14,-15,'#1c1c1c');p(-14,-14,'#1c1c1c');p(-13,-13,'#1c1c1c');p(-14,-12,'#1c1c1c');});
 // kabel: łuk ze słupa do ziemi, potem zygzak w trawie
 const pts=[];for(let i=0;i<=10;i++){const q=i/10;pts.push([-11+q*7,-23+q*q*20]);}
 for(let i=0;i<=24;i++)pts.push([-4+i,-3+(Math.sin(i*0.7)>0?-1:0)]);
 L(p=>{for(let i=1;i<pts.length;i++)line(Math.round(pts[i-1][0]),Math.round(pts[i-1][1]),Math.round(pts[i][0]),Math.round(pts[i][1]),'#262626')(p);});
 N(p=>{for(const x of [-2,-1,8,9,17,18])p(x,-3+(Math.sin((x+4)*0.7)>0?-1:0),'#e0883a');});
 if(on){const f=fr(t,12,3);
  N(p=>{for(let k=0;k<2;k++){const sx=-1+((f*7+k*9)%20);for(const [dx,dy] of [[0,-4],[1,-5],[0,-6],[1,-7],[2,-8],[1,-9]])p(sx+dx,dy,k?'#fff6a0':'#ffffff');}});}
};

/* Sklep mięsny: szyld MIĘSO, szynka na haku albo „NIE MA” */
D.lancuch=(d,t)=>{const ready=!d||(d.reload>0?false:!(d.rev&&(t%6)>4));
 shadow(0,15);
 L(rect(-9,-29,2,29,C.woodD),rect(7,-29,2,29,C.woodD));
 L(rect(-14,-34,28,11,C.cream));N(rect(8,-34,6,11,'#e2d8b8'),rect(-12,-32,24,1,C.red));
 const s='MIESO';N(txt(s,-Math.floor(txtW(s)/2),-30,C.red),p=>{p(1,-25,C.red);p(2,-24,C.red);});   // ogonek Ę
 if(ready){const sw=Math.round(Math.sin(t*2)*1);
  N(line(0,-22,sw,-19,'#2a2a2a'));
  L(ell(sw,-13,4,5.5,C.pink));N(ell(sw+1,-12,2,3,C.pinkL),p=>{p(sw-2,-15,'#ffffff');});
  L(rect(sw-1,-20,2,2,'#f2ede0'));
  // mucha nad szynką
  const q=t*5;N(p=>{const fx=Math.round(sw+Math.cos(q)*6),fy=Math.round(-16+Math.sin(q*1.4)*3);p(fx,fy,'#1a1a1a');p(fx,fy-1,'rgba(220,230,255,.8)');});}
 else{L(rect(-12,-19,24,8,'#2a2a2a'));N(txt('NIE MA',-11,-17,'#ffffff'));}
 L(rect(-16,-2,32,2,C.wood));
};

/* Gnojówka: kałuża maleje z czasem życia, przewrócone wiadro, smród i muchy */
D.rozlew=(d,t)=>{const n=d&&d.life!=null?clamp(d.life/10,0.6,3):3;
 L(ell(3,-2,6+n*3,1.6+n*0.6,'#6a5226'));
 N(ell(1,-2,3+n,1,'#8a6e30'),ell(7,-2,2+n*0.6,0.6,'#7c7a30'));
 N(p=>{for(let i=0;i<3;i++){const q=(t*0.9+i/3)%1;if(q<0.7)p(-1+i*4,Math.round(-3-q*2),q<0.4?'#c8be78':'#a89a5a');}});
 // wiadro na boku
 L(poly([[-17,-7],[-10,-8],[-9,-1],[-16,-1]],C.wood));N(line(-16,-5,-10,-6,'#3a3a3a'),line(-15,-2,-10,-3,'#3a3a3a'));L(ell(-9,-4,1,3,C.dirtD));
 // smród: zielone fale
 const f=fr(t,5,4);
 N(p=>{for(let i=0;i<3;i++){const x0=-1+i*5;for(let y=0;y<9;y++){const x=x0+[0,1,1,0,-1,-1,0,1][(y+f+i)%8];p(x,-6-y,'rgba(120,150,60,'+(0.7-y*0.06).toFixed(2)+')');}}});
 // muchy
 N(p=>{for(let i=0;i<3;i++){const a=t*(5+i)+i*2,fx=Math.round(4+Math.cos(a)*(6+i*2)),fy=Math.round(-11+Math.sin(a*1.3)*3);p(fx,fy,'#141414');p(fx,fy-1,'rgba(220,230,255,.85)');}});
};

/* Aparatura: miedziany kocioł zakopany w kopczyku, wyłania się przy uzbrajaniu; lampka miga, gdy gotowa */
D.aparatura=(d,t)=>{const rise=d&&!d.armed?Math.round(clamp((d.armT||0)/5,0,1)*7):0,armed=!d||d.armed,on=d&&d.armed&&Math.sin(t*10)>0;
 const cut=f=>p=>f((x,y,c)=>{if(y+rise<-1)p(x,y+rise,c);});     // poniżej ziemi nie widać
 L(cut(ell(0,-8,7,6,'#c06a34')));
 N(cut(ell(-2,-9,3,3,'#e89a62')),cut(p=>{p(-3,-11,'#ffd0a8');p(-4,-10,'#ffd0a8');}),cut(rect(4,-11,3,6,'#8e4620')));
 // wężownica
 L(cut(p=>{line(1,-14,5,-17,'#b8622e')(p);line(5,-17,8,-15,'#b8622e')(p);line(8,-15,9,-11,'#b8622e')(p);}));
 // manometr
 L(cut(ell(-3,-9,2,2,'#f2efe6')));
 const na=armed?(d?1.2+Math.sin(t*20)*0.15:0.6):-0.8;N(cut(p=>p(Math.round(-3+Math.sin(na)*1.4),Math.round(-9-Math.cos(na)*1.4),'#b8241c')));
 // lampka
 L(cut(rect(3,-16,3,2,armed?(on?'#ff2a2a':'#8a1010'):'#3a2a1a')));
 if(hurt(d))N(cut(line(-5,-6,-2,-4,'#3a1004')));
 // kopczyk ziemi
 L(poly([[-14,0],[-11,-3],[-5,-4],[5,-4],[11,-3],[14,0]],C.dirt));
 N(p=>{for(let i=0;i<7;i++)p(-10+i*3,-2-(i%2),'#7e5a30');});
 if(d&&!d.armed)smoke(1,-7+rise,t,1.5,null);
};

/* Płonąca flaszka bimbru: trzęsie się i pali */
D.flaszka=(d,t)=>{const sx=d?[0,1,0,-1][fr(t,25,4)]:0,f=fr(t,10,3);
 shadow(0,6);
 L(rect(sx-4,-17,9,16,'#c8ebd8'),rect(sx-2,-23,5,6,'#c8ebd8'));
 N(rect(sx-4,-9,9,8,'#f0d76e'),rect(sx-4,-9,9,1,'#fff2b0'),rect(sx-3,-16,1,13,'#eef8f2'));
 L(rect(sx-3,-14,7,4,'#efe6c8'));N(txt('XXX',sx-5,-14,'#8a1a20'));
 // szmata
 L(poly([[sx-2,-23],[sx+3,-23],[sx+4,-27],[sx+1,-25],[sx-3,-28]],'#e8dcc0'));
 // płomień: 3 klatki
 const FL=[[[-3,-26],[-1,-34],[1,-29],[3,-36],[5,-26]],[[-3,-26],[-2,-32],[0,-28],[2,-37],[4,-30],[5,-26]],[[-4,-26],[-1,-36],[1,-30],[4,-33],[5,-26]]][f];
 N(poly(FL.map(q=>[q[0]+sx,q[1]]),'#ff6a12'),poly([[sx-1,-26],[sx+1,-31-f],[sx+3,-26]],'#ffe04a'),p=>p(sx+(f-1),-38-f,'rgba(255,200,80,.7)'));
};

/* Pług: drewniane rączki, lemiesz z błyskiem, kółko; przy pracy sypie grudami */
D.plug=(d,t)=>{const go=!!d;
 shadow(0,16);
 L(line(-15,-20,4,-7,C.wood,2));L(line(-17,-23,-12,-20,C.woodL,2),line(-18,-17,-13,-18,C.woodL,2));L(line(-13,-18,-2,-8,C.woodD,2));
 L(rect(-1,-9,3,8,C.woodD));
 L(poly([[2,-9],[13,-3],[15,-1],[3,-1]],C.iron));
 N(line(4,-7,11,-3,C.ironL),p=>{const g=fr(t,3,6);if(g<3)p(5+g*2,-6+g,'#ffffff');});
 L(line(4,-7,15,-15,'#9a7a4a',1));
 const a=go?t*8:0;wheel(12,-3,3,a,C.dirt,5);
 if(go)N(p=>{for(let i=0;i<5;i++){const q=(t*3+i/5)%1;p(Math.round(-3-q*8),Math.round(-1-Math.sin(q*Math.PI)*5),C.dirtD);p(Math.round(-2-q*8),Math.round(-1-Math.sin(q*Math.PI)*5),C.dirt);}});
};

/* Łopata: trzonek z poprzeczką, ostrze z ziemią i błyskiem */
D.lopata=(d,t)=>{
 shadow(1,7);
 L(line(-7,-31,2,-9,C.wood,2));L(rect(-10,-32,6,2,C.woodL));
 L(poly([[0,-10],[6,-7],[8,0],[2,-1],[-2,-6]],C.iron));
 N(line(2,-6,6,-3,C.ironL),rect(2,-2,5,1,C.dirt),p=>{p(3,-3,C.dirt);});
 const g=fr(t,2,5);if(g<2)N(p=>{p(5-g,-6+g*2,'#ffffff');p(4-g,-6+g*2,'#ffffff');});
};

/* Ursus C-330 z Heńkiem za kierownicą; przy jeździe koła się kręcą, traktor podskakuje i kopci */
D.ursus=(d,t)=>{const mv=!!(d&&d.moving),b=mv?fr(t,12,2):0,ox=0,oy=-b;
 shadow(3,19);
 const R=-7,RY=-10+oy;
 // kierowca (za błotnikiem)
 L(rect(-10,-28+oy,6,7,'#4a78b0'));
 L(rect(-9,-34+oy,5,5,'#e2a07c'));N(p=>{p(-9,-32+oy,'#1c140e');p(-8,-30+oy,'#6a3a20');p(-9,-30+oy,'#6a3a20');p(-10,-31+oy,'#c87a5c');});
 L(rect(-10,-36+oy,6,2,'#4a5a3a'));N(rect(-12,-35+oy,2,1,'#2a3420'));
 L(line(-6,-26+oy,-3,-24+oy,'#4a78b0',2));
 // kierownica
 L(line(-1,-20+oy,-3,-26+oy,'#222'));L(rect(-6,-27+oy,5,1,'#333'));
 // maska z kratką i światłem
 L(rect(-2,-20+oy,20,9,C.red));
 N(rect(-2,-20+oy,18,1,C.redL),rect(-2,-12+oy,20,1,C.redD));
 L(rect(17,-19+oy,2,7,'#2a2a2a'));N(p=>{for(let i=0;i<3;i++)p(18,-18+i*2+oy,'#777');});
 L(rect(15,-17+oy,2,2,'#fff4c0'));
 L(rect(0,-12+oy,14,5,'#3a3a3a'));N(p=>{for(let i=0;i<4;i++)p(2+i*3,-10+oy,'#555');});
 // rura
 L(rect(14,-29+oy,2,9,'#222'));L(rect(13,-31+oy,4,1,'#222'));
 if(mv)smoke(15,-32+oy,t,3,null);
 // błotnik nad dużym kołem
 wheel(R,RY,9.5,mv?t*7:0,'#d8b030',12);
 L(p=>{for(let i=0;i<=16;i++){const q=Math.PI*(1.05+0.9*i/16);for(let w=0;w<2;w++)p(Math.round(R+Math.cos(q)*(11+w)),Math.round(RY+Math.sin(q)*(11+w)),C.red);}});
 wheel(15,-4+oy,4,mv?t*14:0,'#d8b030',6);
 N(rect(4,-18+oy,12,5,C.red),txt('330',5,-18+oy,'#ffffff'));
 if(mv)N(p=>{for(let i=0;i<4;i++){const q=(t*4+i/4)%1;p(Math.round(-16-q*6),Math.round(-1-q*3),'rgba(120,90,50,'+(0.7*(1-q)).toFixed(2)+')');}});
};
})();
