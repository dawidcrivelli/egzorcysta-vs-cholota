/* Piksel 16-bit: milicjant, wampir, mumia, lunatyk, Lenin i Lenin z brązu.
   Te same zasady co w pixel.js: 40 wierszy = wzrost, ziemia w wierszu 40, twarzą w lewo, kontur z pikseli,
   głowa 14×13 od wiersza 0, tułów 14×12 od wiersza 13, nogi od HIP. Kolory spoza PAL: lokalna paleta LP
   (litera → '#hex' albo para do ditheringu w szachownicę). */
(()=>{
if(!window.PIX)return;
const {limb,line,poly,rect,ell,WALK,IDLE,HIP,LEG_END}=PIX;

const LP={
 m:'#5b6d86',M:'#3d4a5e',a:['#5b6d86','#3d4a5e'],      // mundur milicji
 v:'#3d3350',V:'#272033',u:['#3d3350','#272033'],      // garnitur wampira
 P:'#e6e2ef',p:'#aaa2c0',q:['#e6e2ef','#aaa2c0'],      // trupio blada skóra
 c:'#d9cfae',C:'#a39468',e:['#d9cfae','#a39468'],      // bandaże
 l:'#a8c8e8',L:'#6f93bf',i:['#a8c8e8','#6f93bf'],      // piżama
 j:'#3a3a46',J:'#24242c',h:['#3a3a46','#24242c'],      // garnitur Lenina
 N:'#9a5a2e',n:'#5e3418',                               // rude włosy Lenina (nadpisują brązy z PAL)
 x:'#7a1c1c',                                           // otok
 t:'#8a6a3a',T:'#5e4424'                                // miś
};
// brąz pomnika: wszystko, co ma Lenin, w odcieniach brązu i patyny
const BR={S:'#b87c3c',s:'#7e4f22','4':['#b87c3c','#7e4f22'],W:'#e6b26a',K:'#4a2c10',N:'#8e5a26',n:'#5a3614',
 j:'#9a6430',J:'#6a4018',h:['#9a6430','#6a4018'],R:'#9a6430',r:'#6a4018',Y:'#e6b26a',v:'#5fa08a',k:'#5a3614','6':['#9a6430','#5a3614']};

// litery z LP (i pary do ditheringu) zamieniane na kolory przy stawianiu piksela
const res=(c,x,y)=>{let v=LP[c]!==undefined?LP[c]:c;return Array.isArray(v)?v[(x+y)&1]:v;};
const layer=(fn,outline)=>PIX.layer(p=>fn((x,y,c)=>p(x,y,res(c,x,y))),outline);
const fist=(x,y,H)=>layer(rect(x,y,2,2,H));
const stampP=(map,ox,oy,pal)=>p=>map.forEach((row,j)=>[...row].forEach((ch,i)=>{
 if(ch==='.')return;let c=pal&&pal[ch]!==undefined?pal[ch]:LP[ch]!==undefined?LP[ch]:ch;
 if(Array.isArray(c))c=c[(ox+i+oy+j)&1];if(c)p(ox+i,oy+j,c);}));
// noga z cholewą: dolne `boot` wierszy w kolorze buta
const legB=(hx,fx,lift,look,far,boot)=>p=>{const [P,Ps,F,,,,str]=look,end=LEG_END-lift;
 for(let y=HIP;y<=end;y++){const x=Math.round(hx+(fx-hx)*(y-HIP)/(end-HIP)),b=boot&&y>end-boot,bf=far?'k':F;
  p(x,y,b?bf:far?Ps:P);p(x+1,y,b?bf:far?Ps:str||P);p(x+2,y,b?(far?'K':'k'):Ps);}
 for(let y=end+1;y<=end+2;y++)for(let x=fx-2;x<=fx+2;x++)p(x,y,far?'k':F);};
const arm=(x0,y0,x1,y1,c,fore,H)=>{layer(limb(x0,y0,x1,y1,c,fore));fist(x1,y1,H);};
const mouthOpen=(st,e)=>(st.talk&&Math.sin((st.t||0)*14)>0)||e===2;

/* wspólny szkielet postaci: s = {head,torso,look,boot,pal,hunch,back,farArm,nearArm,front,mouth} */
function human(k,st,s){
 const P=cycleOf(k,st).P,ph=PIX.phase(st,P),f=Math.floor(ph*4)%4;
 const e=st.eat?f:-1,w=st.walk&&!st.eat?WALK[f]:IDLE;
 const breath=!st.walk&&!st.eat&&Math.sin((st.t||0)*2.4)>0.4?-1:0;
 const lean=e>=0?(s.lunge||[0,-1,-2,-1])[e]:0,oy=w.bob+breath,sw=st.walk&&!st.eat?[1,0,-1,0][f]:0;
 const o={st,e,f,w,lean,oy,sw,t:st.t||0,hx:-8+lean+(s.hunch||0),hy:oy+(s.hunch?2:0),tx:-7+lean+(s.hunch?-1:0),ty:13+oy+(s.hunch?1:0)};
 if(s.back)s.back(o);
 if(s.farArm)s.farArm(o);
 layer(legB(0,w.b,w.bl,s.look,true,s.boot));
 layer(legB(-2,-2+w.a,w.al,s.look,false,s.boot));
 if(s.legsOver)s.legsOver(o);
 layer(rect(o.tx+2,o.ty+10,10,HIP-o.ty-9,s.hips||s.look[0]));   // biodra: bez dziury między tułowiem a nogami
 layer(stampP(s.torso,o.tx,o.ty,s.pal));
 if(s.behindHead)s.behindHead(o);
 layer(stampP(typeof s.head==='function'?s.head(o):s.head,o.hx,o.hy,s.pal));
 if(s.face)s.face(o);
 if(s.mouth&&mouthOpen(st,e))layer(stampP(s.mouth[2]||["KK","KK","RK"],o.hx+s.mouth[0],o.hy+s.mouth[1],s.pal),false);
 if(s.nearArm)s.nearArm(o);
 if(s.front)s.front(o);
 return o;
}

/* ---------- Milicjant: czapka z otokiem, pas skośny, oficerki, biała pałka ---------- */
const MIL_HEAD=["....mmmmmm....","..mmmmmmmmmM..",".mmmmmmmmmmMM.","..xxYxxxxxxx..","KKKKKKxxxxx...",
 "...SSSSSSSs4..","..SWKSSSSSs44.","..SWKSSSSS4s4.",".SSSSSSSSSsS4.","SSSSSSSSSSs4s.","..nnnnSSSs4...","...SSSSSs4....","....ssss......"];
const MIL_TORSO=["....SSmmm.....","..mxmmmmNNaa..",".mmxmmmmNmaaa.",".mmmmmmNmmaaa.","mmmYmmNmmmmaaa","mmmmmNmmmmmaaa",
 "mmmYNmmmmmmaaa","mmmNmmmmmmmmaa",".nnYnnnnnnnnn.",".mmmmmmmmmmaa.",".MMMMMMMMMMMM.",".MMMMMMMMMMMM."];
function baton(x0,y0,x1,y1){layer(line(x0,y0,x1,y1,'#e8e6df',2));layer(line(x0,y0,lerpI(x0,x1,0.25),lerpI(y0,y1,0.25),'K',2),false);}
const lerpI=(a,b,t)=>Math.round(a+(b-a)*t);
PIX.E.milicjant=st=>human('milicjant',st,{head:MIL_HEAD,torso:MIL_TORSO,look:['#4a586b','#38424f','K','m','M','S','','m','M'],boot:5,
 mouth:[2,9],
 farArm(o){arm(1,15+o.oy,1-o.sw,24+o.oy,'M','M','s');},
 nearArm(o){const by=o.oy;
  // pałka: przy chodzie oparta o bark, przy biciu zamach zza głowy i łup
  const H=o.e<0?[[-6+o.sw,20],[-10+o.sw,26]]:[[[1,9],[6,2]],[[-4,7],[-9,0]],[[-12,18],[-19,21]],[[-10,20],[-16,25]]][o.e];
  const [[hx,hy],[bx,byy]]=H;
  if(o.e===0||o.e===1){baton(hx,hy+by,bx,byy+by);arm(-1,15+by,hx,hy+by,'m','m','S');}
  else{arm(-1,15+by,hx,hy+by,'m','m','S');baton(hx,hy+by,bx,byy+by);fist(hx,hy+by,'S');}}
});

/* ---------- Wampir: peleryna z czerwoną podszewką, stójka, kły, czerwone oczy ---------- */
const WAM_HEAD=["...KKKKKKK....","..KKKKKKKKKK..",".KKKPKKKKKKKK.",".KKPPPKKKKKKK.","..PPPPPPPKKKK.",
 "..PPPPPPPPpKP.","..PRKPPPPPpPPP","..PRKPPPPPpPP.",".PPPPPPPPPpPp.","PPPPPPPPPPpp..","..PKKKPPPp....","..PWPWPPp.....","....ppp......."];
const WAM_TORSO=["....PPvv......","..vvWWvvvvuu..",".vvvWWRvvvuuu.",".vvvWYWvvvuuu.","vvvvWWvvvvvuuu","vvvvWWvvvvvuuu",
 "vvvvvWvvvvvuuu","vvvvvvvvvvvvuu",".vvvvvvvvvvuu.",".vvvvvvvvvvuu.",".VVVVVVVVVVVV.",".VVVVVVVVVVVV."];
PIX.E.wampir=st=>human('wampir',st,{head:WAM_HEAD,torso:WAM_TORSO,look:['#2f2840','#1f1a2a','K','v','V','P','','v','V'],
 lunge:[0,-2,-4,-2],mouth:[2,9,["KKKK","KRRK","WK.W"]],
 back(o){const fl=o.st.walk?[2,0,-1,0][o.f]:o.e>=0?3:0,y=o.oy;
  layer(poly([[-3,13+y],[7,12+y],[12+fl,24+y],[14+fl,35],[8+fl,36],[2,36],[-3,30]],'#2a2236'));
  layer(poly([[9+fl,24+y],[13+fl,25+y],[15+fl,35],[9+fl,36]],'#9a1424'),false);
  for(let x=1;x<8;x+=3)layer(line(x+fl*(x/8),26,x+1+fl*(x/8),35,'#1f1a2a'),false);},
 behindHead(o){const y=o.hy;layer(poly([[1,13+y],[3,4+y],[9,1+y],[10,8+y],[7,14+y]],'#2a2236'));layer(poly([[3,12+y],[4,6+y],[8,4+y],[8,9+y],[6,13+y]],'#9a1424'),false);},
 farArm(o){const by=o.oy;if(o.e>=0)arm(1,15+by,-9+o.lean,15+by,'v','V','p');else arm(1,15+by,8,21+by,'v','V','p');},
 nearArm(o){const by=o.oy,hx=o.e>=0?-12+o.lean:-10+o.sw,hy=o.e>=0?[14,13,16,15][o.e]:13;
  arm(-1,15+by,hx,hy+by,'v','v','P');for(const d of [[-1,-1],[-1,2],[-2,1]])layer(p=>p(hx+d[0],hy+by+d[1],'p'));}   // szpony
});

/* ---------- Mumia: bandaże w paski, świecące oko w szparze, zwisający bandaż ---------- */
const MUM_HEAD=["....cccccc....","...cWcWcccC...","..cWWWcWWcCC..",".cWcWWWcWcWCC.",".KKKKKKKKKKCC.",
 ".KYYKKKKKKcCC.",".cWWcWWWcWcCC.","cWWWWcWWWcCcC.","cccWWWcWWCCC..",".cWWcWWWcCC...","..cWWWcWCC....","...cWWcCC.....","....CCCC......"];
const MUM_TORSO=(()=>{const R=[],sh=["....cccc......","..cccccccccC..",".ccccccccccCC.",".ccccccccccCC.","cccccccccccCCC","cccccccccccCCC",
 "cccccccccccCCC","ccccccccccccCC",".ccccccccccCC.",".ccccccccccCC.",".ccccccccccCC.",".ccccccccccC.."];
 sh.forEach((r,j)=>R.push([...r].map((c,i)=>c==='.'?'.':(i+2*j)%6===0?'C':(i+2*j)%6===3&&c==='c'?'W':c).join('')));return R;})();
PIX.E.mumia=st=>human('mumia',st,{head:MUM_HEAD,torso:MUM_TORSO,look:['c','C','C','c','C','c','','c','C'],hunch:-1,
 lunge:[0,-1,-3,-2],
 face(o){if(Math.sin(o.t*6)>0.2)layer(p=>{p(o.hx+2,o.hy+5,'#fff6a0');},false);
  if(mouthOpen(o.st,o.e))layer(stampP(["KKK","K.K"],o.hx+2,o.hy+9),false);},
 farArm(o){const by=o.oy,ay=o.e>=0?[0,-2,1,0][o.e]:0;arm(0,15+by,-11+o.lean,15+by+ay-o.sw,'C','C','C');},
 nearArm(o){const by=o.oy,ay=o.e>=0?[0,-2,1,0][o.e]:0,hx=-13+o.lean,hy=17+by+ay+o.sw;
  arm(-2,16+by,hx,hy,'c','c','c');
  // luźny koniec bandaża majta się pod ręką
  const sw=Math.round(Math.sin(o.t*5)*1.5);layer(line(-6+o.lean,18+by,-7+o.lean+sw,24+by,'W'));layer(line(-5+o.lean,18+by,-6+o.lean+sw,24+by,'c'),false);},
 legsOver(o){const sw=Math.round(Math.sin(o.t*4+1));layer(line(1,30,3+sw,38,'W'),false);}
});

/* ---------- Lunatyk: piżama w paski, szlafmyca z pomponem, oczy zamknięte, miś w ręku, ZZZ ---------- */
const LUN_HEAD=["....llllll....","..llllllllLL..",".llllllllllLL.",".WWWWWWWWWWLLl","..SSSSSSSs4.LW","..SSSSSSSSs4WW",
 "..SKKSSSSS4sWW","..SSSSSSSS4s4.",".SSSSSSSSSsS4.","SSSSSSSSSSs4s.","..SSrSSSSs4...","...SSSSSs4....","....ssss......"];
const LUN_TORSO=["....SSl.......","..lWlWlWlWii..",".lWlWlWlWlWii.",".lWYWlWlWlWii.","lWlWlWlWlWlWii","lWlWlWlWlWlWii",
 "lWlYlWlWlWlWii","lWlWlWlWlWlWli",".lWlWlWlWlWii.",".lWlWlWlWlWii.",".LLLLLLLLLLLL.",".lWlWlWlWlWl.."];
const TEDDY=[".t..t",".ttTt","tKtKt","ttttT",".tttT","t.t.T"];
PIX.E.lunatyk=st=>{const o=human('lunatyk',st,{head:LUN_HEAD,torso:LUN_TORSO,look:['l','L','#b07a4a','l','L','S','W','l','L'],
 mouth:[3,9,["KK","Kr"]],
 farArm(o){const by=o.oy;arm(1,15+by,-9+o.lean,14+by,'L','L','s');layer(stampP(TEDDY,-12+o.lean,15+by));fist(-9+o.lean,14+by,'s');},
 nearArm(o){const by=o.oy,dy=Math.round(Math.sin(o.t*2));arm(-1,15+by,-13+o.lean,13+by+dy,'l','l','S');}});
 // unoszące się zetki
 const Z=["11111","...1.","..1..",".1...","11111"],z=["111","..1",".1.","111"];
 for(const [m,ph,dx] of [[Z,0,0],[z,0.5,5]]){const q=((o.t*0.6+ph)%1),x=4+dx+Math.round(Math.sin(q*6)),y=Math.round(-1-q*8);
  if(q<0.9)layer(p=>m.forEach((r,j)=>[...r].forEach((c,i)=>c==='1'&&p(x+i,y+j,'#dce6ff'))),false);}
};

/* ---------- Lenin: łysina, rudawa bródka, garnitur, czerwona kokarda, kaszkiet w ręku, wskazuje przy przemowie ---------- */
const LEN_HEAD=["....SSSSSS....","...SWSSSSSs4..","..SSSSSSSSs44.","..SSSSSSSSs44.",".SSSSSSSSNNN4.",
 "..SNNSSSSNNN4.","..SWKSSSSSN44.","..SSSSSSSS4s4.",".SSSSSSSSSsS4.","NNNNSSSSSs4s..","NNNNNNSSs4....",".NNNNNSs4.....","..NNN........."];
const LEN_TORSO=["....SSjjj.....","..jjWWjjjjhh..",".jjjWRjjjjhhh.",".jRRWRjjjjhhh.","jjRjWjjjjjjhhh","jjjjWjjjjjjhhh",
 "jjjjjjjjjjjhhh","jjjjjjjjjjjjhh",".jjjjjjjjjjhh.",".jjjjjjjjjjhh.",".JJJJJJJJJJJJ.",".JJJJJJJJJJJJ."];
const CAP=["KKKKK.","kkkkkK","..kkkk"];
function leninArms(o,pal,point){
 const by=o.oy,cc=ch=>pal&&pal[ch]!==undefined?pal[ch]:ch,sk=cc('S'),J=cc('J'),j=cc('j');
 return{
  farArm(){arm(1,15+by,2-o.sw,24+by,J,J,cc('s'));layer(stampP(CAP,0-o.sw,24+by,pal));},
  nearArm(){
   if(point){const hx=-14+o.lean,hy=7+by;arm(-1,15+by,hx,hy,j,j,sk);layer(p=>{p(hx-1,hy,sk);p(hx-2,hy,sk);});}   // palec wskazujący
   else if(o.e>=0){const H=[[-3,10],[-6,8],[-13,17],[-11,19]][o.e];arm(-1,15+by,H[0]+o.lean,H[1]+by,j,j,sk);}
   else arm(-1,15+by,-6+o.sw,23+by,j,j,sk);}};
}
PIX.E.lenin=st=>{let A;human('lenin',st,{head:LEN_HEAD,torso:LEN_TORSO,look:['h','J','K','j','J','S','','j','J'],mouth:[2,9,["KK","RK"]],
 back(o){A=leninArms(o,null,o.st.talk&&o.e<0);},farArm(){A.farArm();},nearArm(){A.nearArm();},
 front(o){if(o.st.talk&&o.e<0){const q=(o.t*3)%1;for(const [dx,dy] of [[-17,4],[-18,7],[-17,10]])layer(p=>p(dx-Math.round(q*2),dy+o.oy+(dy-7)*Math.round(q),'#ff5a4a'),false);}}});};

/* ---------- Lenin z brązu: pomnik w rozpiętym płaszczu, zawsze wskazuje, kawał cokołu na butach, pęka ---------- */
const BOSS_COAT=["....SSjjj.....","..jjWWjjjjhh..",".jjjWRjjjjhhh.","jjRRWRjjjjhhhh","jjRjWjjjjjjhhh","jjjjWjjjjjjhhh",
 "jjjjjjjjjjjhhh","jjjjjjjjjjjjhh","jjjjjjjjjjjjhh","jjjjjjjjjjjjhh","jjj.jjjjjjjjhh","jjj..jjjjjjjhh","jj....jjjjjjhh","jj.....jjjjjhh","j.......jjjjh."];
PIX.SH.boss=[11,14,13];
PIX.E.boss=st=>{let A;const hp=st.hp==null?1:st.hp;
 const o=human('boss',st,{head:LEN_HEAD,torso:BOSS_COAT,pal:BR,look:[BR.j,BR.J,'#8a8a84',BR.j,BR.J,BR.S,'',BR.j,BR.J],
  back(o){A=leninArms(o,BR,true);},farArm(){A.farArm();},nearArm(){A.nearArm();},
  legsOver(o){ // bryły betonu z cokołu przyklejone do butów
   for(const [x,lift] of [[-2+o.w.a,o.w.al],[o.w.b,o.w.bl]])layer(rect(x-3,37-lift,7,3,'#8a8a84'));},
  face(o){ // patyna i pęknięcia
   const P='#5fa08a';layer(p=>{p(o.tx+9,o.ty+5,P);p(o.tx+10,o.ty+6,P);p(o.tx+3,o.ty+11,P);p(o.hx+10,o.hy+2,P);p(o.hx+11,o.hy+3,P);},false);
   const K='#2a1606';
   if(hp<0.6)layer(p=>{for(const [x,y] of [[3,1],[4,2],[4,3],[5,4],[4,5],[5,6],[6,7],[6,8]])p(o.tx+x,o.ty+y,K);for(const [x,y] of [[5,1],[6,2],[6,3],[7,4]])p(o.hx+x,o.hy+y,K);},false);
   if(hp<0.3)layer(p=>{for(const [x,y] of [[10,1],[9,2],[10,3],[9,4],[10,5],[9,6],[10,7],[11,8]])p(o.tx+x,o.ty+y,K);for(const [x,y] of [[2,7],[3,8],[2,9]])p(o.hx+x,o.hy+y,K);},false);}});
 // ciężkie kroki: kurz przy stawianiu stopy
 if(st.walk&&!st.eat&&(o.f===0||o.f===2)){const q=(o.t*4)%1;layer(p=>{for(const [x,y] of [[-9,38],[-10,37],[5,38],[6,37]])p(x-Math.round(q*2),y,'rgba(200,190,170,.7)');},false);}
};
})();
