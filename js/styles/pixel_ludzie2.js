/* Piksel 16-bit: przodownik, carski sołdat, okupant, sekretarz i Zdzichu. Ta sama siatka co pixel.js
   (40 wierszy = wzrost, ziemia w wierszu 40, twarzą w lewo), głowa 14×13 od x=-8, tułów od wiersza 13. */
(()=>{
const PIX=window.PIX;if(!PIX||!PIX.E)return;const PX=PIX;   // rejestr pikseli (PX w grze to inna funkcja)
const {layer,limb,fist,line,rect,ell,poly,WALK,IDLE}=PX;
// paleta dodatkowa (litery spoza PAL gry) i dithering w szachownicę
const LP={o:'#626a40',O:'#7f8852',q:'#3f452a',h:'#59604c',H:'#7c836b',f:'#6e705e',F:'#8e907c',v:'#45473a',
 u:'#2e4a7a',U:'#4a6ea8',w:'#1d3156',c:'#5a4632',C:'#7a6244',x:'#382a1c',m:'#e0b43a',l:'#fff3a0',
 e:'#e4e0d6',E:'#aca89e',j:'#a2703f',J:'#5e3c1e',p:'#3a3a3a',a:'#9ad4ff',A:'#e8f6ff',t:'#4a5140',T:'#2c3226',
 y:'#c9a24a',d:'#d8c070',i:'#a8c8e8',b2:'#000'};
const DT={1:'oq',2:'uw',3:'cx',4:'Ss',5:'fv',6:'tT',7:'gk',8:'Nn',9:'hv',0:'jJ'};
const col=(c,x,y)=>{if(DT[c])c=DT[c][(x+y)&1];return LP[c]||c;};
const st2=(map,ox,oy)=>p=>map.forEach((r,j)=>[...r].forEach((c,i)=>{if(c!=='.')p(ox+i,oy+j,col(c,ox+i,oy+j));}));
const L=(c)=>LP[c]||c;
const GL={U:["101","101","101","101","111"],R:["110","101","110","101","101"],A:["010","101","111","101","101"],H:["101","101","111","101","101"],L:["100","100","100","100","111"],T:["111","010","010","010","010"],'!':["1","1","1","0","1"]};
const say=(s,x,y,c)=>p=>{for(const ch of s){const g=GL[ch];g.forEach((r,j)=>[...r].forEach((v,i)=>v==='1'&&p(x+i,y+j,c)));x+=g[0].length+1;}};
// noga z cholewą: od wiersza `boot` w dół kolor buta; stopa 5 px w lewo
function leg(hx,fx,lift,o,far){return p=>{const end=PIX.LEG_END-lift;
 for(let y=PIX.HIP;y<=end;y++){const x=Math.round(hx+(fx-hx)*(y-PIX.HIP)/(end-PIX.HIP)),b=o.boot&&y>=end-o.boot;
  const c0=b?o.shoe:o.pants,c1=b?(o.shoe2||o.shoe):o.pantsS;
  p(x,y,far?c1:c0);p(x+1,y,far?c1:(o.stripe&&!b?o.stripe:c0));p(x+2,y,c1);
  if(b&&o.felt&&y===end-o.boot){p(x,y,o.felt);p(x+1,y,o.felt);p(x+2,y,o.felt);}}
 for(let y=end+1;y<=end+2;y++)for(let x=fx-2;x<=fx+2;x++)p(x,y,far?(o.shoe2||o.shoe):o.shoe);};}
// wspólny rytm: e = klatka ataku 0..3 albo -1, w = poza chodu, by = podskok, sw = wymach rąk
function rig(k,st){
 const t=st.t||0,P=cycleOf(k,st).P,f=PIX.frame(st,P),e=st.eat?f:-1;
 const w=st.walk&&!st.eat?WALK[f]:IDLE,breath=!st.walk&&!st.eat&&Math.sin(t*2.4)>0.4?-1:0;
 return{t,e,w,by:w.bob+breath,sw:st.walk&&!st.eat?[1,0,-1,0][f]:0,lean:e>=0?[0,-1,-2,-1][e]:0,
  open:(st.talk&&Math.sin(t*14)>0)||e===2};
}
const arm=(x0,y0,x1,y1,c,fc,h)=>{layer(limb(x0,y0,x1,y1,L(c),L(fc)));fist(x1,y1,L(h));};
const legs=(r,o)=>{layer(leg(0,r.w.b,r.w.bl,o,true));layer(leg(-2,-2+r.w.a,r.w.al,o,false));};

/* ===================== PRZODOWNIK PRACY: niebieski kombinezon, order, kilof ===================== */
const PRZ_H=["....uuuuuu....","...uUUUUuuuw..","..uUUUUUuuuww.","wwwwwwwuuuuww.","...SSSSSSSs4..","..SSWKSSSSs44.",
 "..SSWKSSSs4s4.","SSSSSSSSSSsS4.","sSnnnnSSSSs4s.","..nSSnSSSs44..","...SSSSSSs4...","...SSSSSs4....","....ssss......"];
const PRZ_T=["....SSSgg.....","..ggguggggug..",".gggguggggu77.",".gguuuuuuuu77.","gguummuuuwwu77","gguummuuuwwu77",
 "ggguuuuuuuu277","gggUuuuuuuu227",".gguuuuuuuu22.",".gguuuuuuuu22.",".uuuuuuuuuu22.",".wwwwwwmwwwww.",".uuuuuuuuuu22.",".uuuuuuuuuuu2."];
const PRZ_L={pants:L('u'),pantsS:L('w'),shoe:'#1c1c1c',boot:3,shoe2:'#111'};
function kilof(hx,hy,ang){ // trzonek od dłoni w kierunku ang, żelazo prostopadle
 const dx=Math.cos(ang),dy=Math.sin(ang),ex=hx+dx*13,ey=hy+dy*13;
 layer(line(hx-dx*2,hy-dy*2,ex,ey,'#8a6238',1));
 const nx=-dy,ny=dx;layer(poly([[ex+nx*7,ey+ny*7],[ex+dx*1.5,ey+dy*1.5],[ex-nx*7,ey-ny*7],[ex-nx*6-dx,ey-ny*6-dy],[ex-dx,ey-dy],[ex+nx*6-dx,ey+ny*6-dy]],'#8a8e94'));
 layer(line(ex+nx*5,ey+ny*5-0,ex+nx*2,ey+ny*2,'#c4c8cc',1),false);
}
PIX.E.przodownik=st=>{const r=rig('przodownik',st),by=r.by,hx=-8+r.lean,tx=-7+r.lean;
 legs(r,PRZ_L);
 arm(1,15+by,2-r.sw,24+by,'g','g','s');
 layer(st2(PRZ_T,tx,13+by));
 layer(st2(PRZ_H,hx,by));
 if(r.open)layer(st2(["KK","rK"],hx+3,by+10),false);
 // pot ścieka z czoła
 const d=Math.floor((r.t*6)%4);layer(p=>p(hx+8,by+4+d,L('a')),false);
 // kilof: na ramieniu przy chodzie, zamach przy gryzieniu
 if(r.e<0){const h=[-4,17+by];kilof(h[0],h[1],-2.3+r.sw*0.05);arm(-1,15+by,h[0],h[1],'g','g','S');}
 else{const A=[[-1.6,[1,10]],[-2.2,[-1,8]],[2.6,[-11,20]],[2.3,[-10,21]]][r.e],h=[A[1][0],A[1][1]+by];
  if(r.e<2){kilof(h[0],h[1],A[0]);arm(-1,15+by,h[0],h[1],'g','g','S');}else{arm(-1,15+by,h[0],h[1],'g','g','S');kilof(h[0],h[1],A[0]);}
  if(r.e===2)layer(p=>{for(const [x,y] of [[-20,36],[-22,33],[-18,34],[-23,37]])p(x,y,L('l'));},false);}
};

/* ===================== CARSKI SOŁDAT: szynel do kolan, papacha, wąsiska, karabin z bagnetem ===================== */
const CAR_H=["...NJNJNJ.....","..JNJNJNJNJ...","..NmJNJNJNJn..","..JNJNJNJNJn..","..SSSSSSSSs4..","..SKWSSSSSs44.",
 "..SKWSSSSs4s4.","SSSSSSSSSSsS4.","nnnnnSSSSSs4s.","nn.nnnSSSs44..","...SSSSSSs4...","...SSSSSs4....","....ssss......"];
const CAR_T=["....SSoo......","..oooRooooO...",".ooooOoooo11..",".oyooOoooo11..","oooooOooooo111","ooyooOoooooo11",
 "oooooOooooo111","JJJJJJJJJJJJJJ","JJmJJJJJJJJJJJ","oooooOooooo111",".ooooOoooooo11",".ooooOooooo11.",".oooooOoooo11.",".oooooOooooo11","..ooooOooooo11","..oooooOoooo1.","..ooooooooo11.","..oo.ooo.oo.1."];
const CAR_L={pants:L('q'),pantsS:L('q'),shoe:'#141414',boot:6,shoe2:'#0c0c0c'};
function rifle(hx,hy,ang,bay){const dx=Math.cos(ang),dy=Math.sin(ang);
 layer(line(hx+dx*6,hy+dy*6,hx-dx*4,hy-dy*4,'#7a5634',2));          // kolba i łoże
 layer(line(hx-dx*4,hy-dy*4,hx-dx*15,hy-dy*15,'#4a4a4e',1));           // lufa
 if(bay)layer(line(hx-dx*15,hy-dy*15,hx-dx*22,hy-dy*22,'#d8dde2',1));
}
PIX.E.carski=st=>{const r=rig('carski',st),by=r.by,hx=-8+r.lean,tx=-7+r.lean;
 legs(r,CAR_L);
 const e=r.e,stab=e>=0?[0,2,-4,-2][e]:0;
 // karabin oburącz: przy chodzie na ukos w górę, przy gryzieniu pchnięcie bagnetem
 const ang=e>=0?0.05:1.05,h=[e>=0?-6+stab:-3,e>=0?21+by:20+by];
 arm(1,15+by,h[0]+5,h[1]+(e>=0?0:2),'o','o','s');
 layer(st2(CAR_T,tx,13+by));
 layer(st2(CAR_H,hx,by));
 if(r.open)layer(st2(["KK","rK"],hx+3,by+10),false);
 rifle(h[0],h[1],ang,true);
 arm(-1,15+by,h[0],h[1],'O','o','S');
 if(st.talk&&Math.sin(r.t*3)>0)layer(say('URRA!',-30,2+by,'#fff6dc'),false);
};

/* ===================== OKUPANT Z ’44: feldgrau, hełm (spada przy helm=0), oficerki ===================== */
const OK_H=["..............","..............","..............","..............","...SSSSSSSs4..","..SkkSSSSSs44.",
 "..SWKSSSSs4s4.","SSSSSSSSSSsS4.","sSSSSSSSSSs4s.","..SkkSSSSs44..","...SSSSSSs4...","...SSSSSs4....","....ssss......"];
const OK_HAIR=["....dddddd....","...ddddddddd..","..dddddddddd..","..d.d.ddddddd."];
const OK_HELM=["....hhhhhh....","..hhHHhhhhhv..",".hhHhhhhhhhvv.","hhhhhhhhhhhhvv","vvvvvvvvvvvvvv"];
const OK_T=["....SSff......","..ffvffffffF..",".ffffffffff55.",".fvvfffvffff5.","fffvvfffffff55","fffffffffffff5",
 "ffffFffffff555","fffffffffffff5","kkkkkmkkkkkkkk","fvvvvffffffff5",".fvvvvfffff55.",".ffffffffff55.",".fffffffffff5.",".kkkkkkkkkkkk."];
const OK_L={pants:L('f'),pantsS:L('v'),shoe:'#161616',boot:5,shoe2:'#0c0c0c'};
PIX.E.okupant=st=>{const r=rig('okupant',st),by=r.by,hx=-8+r.lean,tx=-7+r.lean,e=r.e;
 legs(r,OK_L);
 // karabin: przy chodzie oburącz przed sobą, przy gryzieniu cios kolbą z góry
 const butt=e>=0,ang=butt?[0.3,0.5,-0.05,0.05][e]:0.25,h=butt?[[-4,20],[-2,19],[-10,21],[-8,21]][e]:[-5,21];h[1]+=by;
 arm(1,15+by,h[0]+4,h[1]+1,'f','f','s');
 layer(st2(OK_T,tx,13+by));
 if(!(st.helm>0))layer(st2(OK_HAIR,hx,by));   // włosy pod głową: kontur głowy robi linię grzywki
 layer(st2(OK_H,hx,by));
 if(st.helm>0)layer(st2(OK_HELM,hx,by));
 if(r.open)layer(st2(["KK","rK"],hx+3,by+10),false);
 rifle(h[0],h[1],ang,false);
 arm(-1,15+by,h[0],h[1],'F','f','S');
 if(st.talk&&Math.sin(r.t*3)>0)layer(say('HALT!',-30,2+by,'#fff6dc'),false);
 // spadający hełm (stan bez hełmu): leży przy butach
 if(!(st.helm>0))layer(st2(["..hhhh..",".hHhhhv.","hhhhhhvv"],4,37));
};

/* ===================== SEKRETARZ PARTII: brzuch, okulary, zaczeska, megafon i papiery ===================== */
const SEK_H=["..............","...SkkkkkSs...","..SSSSkkkSs4..","..SSSSSSSGGG4.",".KKSKKSSSGGGG.",".KiKKiKSSGsGG.",
 "SKKSKKSSSGsSG.","sSSSSSSSSGGG4.",".SSSSSSSSSGs4.",".SSkkSSSSSs4..","..SSSSSSSs4...","...SSSSSSs4...","....sssss....."];
const SEK_T=["....SSWcc.....","..ccWWWcccC...",".cccWRWccccc3.",".ccWWRWcRcccc3","cccWRRWcmccc33","ccccWRccccccc3",
 "cccccRcccccc33","Cccccccccccc33","Ccccccccccccc3","Ccccccccccccc3","CccccccCcccc33",".ccccccccccc33",".xxxxxxyxxxxx.",".ccccccccccc3."];
const SEK_L={pants:L('c'),pantsS:L('x'),shoe:'#1a1a1a'};
function megafon(hx,hy,talk,t){layer(st2(["......WWWW","..WWWWWWWW","RRWWWWWWWW","RRWWWWWWWW","..WWWWWWWW","......WWWW"].map(r=>[...r].reverse().join('')),hx-11,hy-3));
 layer(st2(["G","G","G","G"],hx-12,hy-2),false);
 if(talk){const q=Math.floor(t*6)%3;for(let i=0;i<=q;i++){const x=hx-15-i*3;layer(p=>{for(let y=-2-i;y<=2+i;y++)p(x-(Math.abs(y)<i?1:0),hy+y,'#fff6dc');},false);}}}
PIX.E.sekretarz=st=>{const r=rig('sekretarz',st),by=r.by,hx=-8+r.lean,tx=-7+r.lean,e=r.e;
 legs(r,SEK_L);
 // dalsza ręka trzyma papiery uchwały
 const ph=[2-r.sw,22+by];arm(1,15+by,ph[0],ph[1],'c','c','s');layer(st2(["WWWW","WiiW","WWWW","WiiW","WWWW"],ph[0]-1,ph[1]-1));
 layer(st2(SEK_T,tx,13+by));
 layer(st2(SEK_H,hx,by));
 if(r.open||st.talk)layer(st2(["KKK","rrK"],hx+2,by+9),false);
 // megafon przy ustach; przy gryzieniu wali nim w sprzęt
 const h=e>=0?[[-6,12],[-6,10],[-12,20],[-11,21]][e]:[-7,17];h[1]+=by;
 arm(-1,15+by,h[0],h[1],'C','c','S');megafon(h[0],h[1],st.talk||e===2,r.t);
 // pot liderski
 const d=Math.floor((r.t*5)%5);if(st.talk)layer(p=>p(hx+10,by+3+d,L('a')),false);
};

/* ===================== ZDZICHU: fufajka, stuła, broda, czerwony nos, beczka XX i kropidło ===================== */
const Z_H=["...pppppp.....","..pppppppppp..","..ppppppppppp.","pppppppppppppp","...eeSSSSSs4..","..SKWSSSSSs44.",
 "..eKWSSSSs4s4.","RRSSSSSSSSsS4.","RReeeeSSSSs4s.",".eeeeeeeSSs4..","..eeeeeeSs4...","...eeeeeE.....","....eeeE......"];
const Z_BEARD=["..eeeeee..","..eeeeeE..","...eeeEE..","....eeE...","....eE...."];
const Z_T=["....SStt......","..tttRtttTT...",".tttRYRttTTT6.",".ttttRtttTTT6.","TTTTRTTTTTTTT6","ttttRYRtttttt6",
 "ttttRtttttttt6","TTTTRTTTTTTTT6","ttttRYRttttt66","ttttRtttttttt6","NNNNNNmNNNNNN6","ttttttttttttt6",".tttttttttttt6",".tttttttttttt."];
const Z_L={pants:'#3c3a34',pantsS:'#2a2924',shoe:'#1c1c1a',boot:5,felt:'#9a948a',shoe2:'#121210'};
const BARREL=[".JJJJJJJJJ.","J000000000J","kkkkkkkkkkk","j0000000000","jjj0W0W0000","jjj00W00000","jjj0W0W0000","j0000000000","kkkkkkkkkkk","j0000000000","j0000000000","kkkkkkkkkkk",".J0000000J."];
PIX.H=t=>{const c=(t%2.8)/2.8,bob=Math.sin(t*2.2)>0.5?-1:0,by=bob;
 // ręka z kropidłem: zamach do góry (0..0.3), szybki strzał (0.3..0.4), powrót
 const ph=c<0.3?0:c<0.4?1:c<0.75?2:3;
 const H=[[-10,10],[-14,12],[-13,17],[-9,20]][ph],ang=[1.3,-0.35,0.2,0.7][ph];H[1]+=by;
 // beczka na plecach i szelka
 layer(st2(BARREL,5,11+by));
 layer(rect(8,9+by,4,2,'#8a8e94'));
 arm(1,15+by,1,24+by,'t','t','s');layer(st2(["..WW",".AWA","AAAA","AyyA","AAAA"],0,22+by));   // flaszka święconej w dalszej ręce
 layer(leg(0,1,0,Z_L,true));layer(leg(-2,-3,0,Z_L,false));
 layer(st2(Z_T,-7,13+by));
 layer(st2(Z_H,-8,by));
 layer(st2(Z_BEARD,-9,12+by));
 // wąż od beczki do kropidła
 const top=[6,12+by],sag=[(top[0]+H[0])/2+2,Math.max(top[1],H[1])+6];
 layer(p=>{line(top[0],top[1],sag[0],sag[1],L('p'))(p);line(sag[0],sag[1],H[0],H[1],L('p'))(p);});
 // kropidło: trzonek i dziurkowana kula
 const dx=Math.cos(ang),dy=Math.sin(ang),bx=Math.round(H[0]-dx*8),bY=Math.round(H[1]-dy*8);
 layer(line(H[0],H[1],bx,bY,'#7a5232',1));layer(ell(bx,bY,2,2,'#c9ced4'));layer(p=>{p(bx,bY,'#55585c');p(bx-1,bY+1,'#55585c');},false);
 arm(-1,15+by,H[0],H[1],'t','T','S');
 // strumień święconej: krople lecą łukiem w lewo
 if(c>0.36&&c<0.75){const q=(c-0.36)/0.39;layer(p=>{for(let i=0;i<7;i++){const s=q*28-i*2.2;if(s<0)continue;const x=Math.round(bx-s),y=Math.round(bY-4+s*s*0.03-i*0.4+(i%3));p(x,y,i%2?L('A'):L('a'));}},false);}
};
})();
