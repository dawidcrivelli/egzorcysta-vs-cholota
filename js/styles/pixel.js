/* Styl „Piksel 16-bit”: postać na siatce 40 wirtualnych pikseli wysokości, mapy znakowe + paleta 16 kolorów,
   kontur z pikseli dookoła każdej warstwy, cieniowanie ditheringiem, 4 skwantowane pozy chodu i ataku. */
(()=>{
const ROWS=40, GROUND=40, HIP=27, LEG_END=37, OUT='K';
// paleta (16 kolorów); cyfry = dithering w szachownicę z dwóch kolorów
const PAL={K:'#1b1621',k:'#3b3542',g:'#686574',G:'#a6a4b0',W:'#f2eee2',S:'#eab48c',s:'#bf7e5c',Z:'#9cb27c',
 z:'#5f7a4f',R:'#d0342c',r:'#7f1d22',B:'#3552a8',b:'#1f2e66',N:'#7a5132',n:'#46301f',Y:'#ffe14a'};
const DITH={1:'kK',2:'Zz',3:'Rr',4:'Ss',5:'Bb',6:'gk',7:'Gg',8:'Nn',9:'WG'};
const SHADOW='rgba(0,0,0,.32)', SHADOW_W=[9,12,11];

/* głowy (twarzą w lewo), tułowia, rekwizyty */
const HEAD={
 trup:["...K..K.......","....ZZZZZZ....","...ZZZZZZZz2..","..ZZZZZZZZz22.","..ZZZZZZZZZz2.",".ZYYKZZZZz2Z2.",
  ".ZYYKZZZZzZ22.","ZZZZZZZZZZz22.","ZZZZZZZZZz2z2.",".KWKWZZZZz22..",".KKKKKZZz22...",".WKWZZZzz2....","..zzzzz......."],
 sasiad:["....gGGGGg....","...gGGGGGGgg..","..gggggggggg6.","kkkkkkggggg66.","...SSSSSSSs4..","..SSWKSSSSs44.",
  "..SSWKSSSS4s4.","RRSSSSSSSSsS4.","RRRnnnSSSSs4s.",".nnnnnnSSSs4..","..SSKKSSSs4...","...SSSSSs4....","....ssss......"],
 urzednik:["....SSSSSS....","...SSSSSSSs4..","..SSSSSSSSs44.","..GSSSSSSGGG4.",".KKKKKSSSGGGG.",".KWKWKSSSGsGG.",
  "SSKKKSSSSGsSG.","sSSSSSSSSGGG4.",".SSSSSSSSGGs4.",".SgggSSSSSs4..","..SKKSSSSs4...","...SSSSSs4....","....ssss......"],
 komunista:["....kkkkkk....","...k6666666k..","..kRk666666k..",".kRRRk66666k6.","kkkkkkkk6666..","...SSSSSSSs4..",
  "..SWKSSSSSs44.","..SWKSSSSS4s4.",".SSSSSSSSSsS4.","SSSSSSSSSSs4s.","..SKKSSSSs4...","...SSSSSs4....","....ssss......"]};
const TORSO={
 trup:["....ZnnnK.....","...nWWnnnnn8..","..nnWWrnnnn88.",".nnnnWrnnnnn88",".nnnnWnnnnnn88","nnnnnnnnnnn888","nnnnnnnnnnnn88",
  "nnnnnnnnnnn88.",".nnnnnnnnnn88.",".nnnnnnnnnn88.",".nn.n8nnn8n8..",".n...n..n....."],
 sasiad:["....SSSWW.....","..SSSSSWWWSs..","..SWWWWWWWW9s.",".WWWWWWWWWW99.","WWWWWWWWWWW99.","WWWWWWWWWWWW9.",
  "WWWWWWWWWWW99.","WWWWWWWWWWW99.",".WWWWWWWWWW99.",".WWWWWWWWWW9..",".BBBBBBBBBBBb.",".BBBBBBBBBBBb."],
 urzednik:["....WRWggg....","...gWRRWgggg..","..ggWRRggggg6.",".ggGWRRgggggg6",".gGWWRRggggg66","ggGWWRRggggg66",
  "ggGWWRRggggg66","gggGWRRgggggg6","ggggGRgggggg66",".gggggggggggg6",".kkkkkkkkkkkk.",".gggggggggggg."],
 komunista:["....SSRRR.....","..RRRSRRRR33..",".RRRRRRRRRR33.",".RRYRRRRRRR33.","RRRRRRRRRRR333","RRRYRRRRRRR333",
  "RRRRRRRRRRR333","RRRYRRRRRRRR33",".RRRRRRRRRR33.",".RRRRRRRRRR33.",".kkkkkkkkkkkk.",".kkkkkkkkkkkk."]};
const BOTTLE=[".z.",".z.",".z.","zZz","zZz","zWz","zWz","zWz","zzz"], BOTTLE_H=["zzzzzz..","zZWWZzzz","zzzzzz.."], BOTTLE_UP=[...BOTTLE].reverse();
const STAMP_H=["Rkk.....","Rkk..NN.","RkknnNNN","RkknnNNN","Rkk..NN.","Rkk....."], STAMP=["..NNNN..","..NNNn..","...Nn...","...Nn...","kkkkkkkk","kkkkkkkk","RRRRRRRR"];
const INK=["R.RR.R","RRRRRR"];
// font 3×5 na transparent; '1' = piksel
const GLYPH={P:["111","101","111","100","100"],L:["100","100","100","100","111"],A:["010","101","111","101","101"],
 N:["1001","1101","1011","1001","1001"],5:["111","100","111","001","111"],'-':["00","00","11","00","00"],
 E:["111","100","110","100","111"],T:["111","010","010","010","010"],I:["1","1","1","1","1"]};
const BANNER_TXT=['PLAN','5-LETNI'], BOARD={x:-23,y:-11,w:27,h:12}, POLE_X=-10;
// [spodnie, cień spodni, buty, rękaw, rękaw dalszy, dłoń, lampas, przedramię, przedramię dalsze]
const LOOK={trup:['g','k','Z','n','8','Z','','Z','z'],sasiad:['B','b','W','S','s','S','W','S','s'],
 urzednik:['k','K','n','g','6','S','','g','6'],komunista:['k','K','n','R','3','S','','R','3']};
const MOUTH={sasiad:[4,10],urzednik:[3,10],komunista:[3,10]};
// chód: a/b = przesunięcie stopy bliższej/dalszej nogi, al/bl = uniesienie, bob = podskok tułowia
const WALK=[{a:-4,al:0,b:4,bl:0,bob:0},{a:-1,al:0,b:1,bl:2,bob:-1},{a:4,al:0,b:-4,bl:0,bob:0},{a:1,al:2,b:-1,bl:0,bob:-1}];
const IDLE={a:-1,al:0,b:1,bl:0,bob:0};
const POSES=4;

let G;
const key=(x,y)=>(y+64)*256+x+128;
// warstwa: piksele + kontur dookoła (także na wcześniejszych warstwach, jak w ręcznym pixel arcie)
function layer(fn,outline=true){
 const L=new Map();fn((x,y,c)=>{if(c&&c!=='.')L.set(key(x,y),c);});
 if(outline)for(const k of L.keys())for(const d of [1,-1,256,-256])if(!L.has(k+d))G.set(k+d,OUT);
 for(const [k,c] of L)G.set(k,c);
}
const stamp=(map,ox,oy)=>p=>map.forEach((row,j)=>[...row].forEach((c,i)=>p(ox+i,oy+j,c)));
// ręka: linia 2×2 od barku do dłoni, druga połowa w kolorze przedramienia (goła skóra, poszarpany rękaw)
const limb=(x0,y0,x1,y1,c,fore=c)=>p=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);
 for(let i=0;i<=n;i++){const x=Math.round(x0+(x1-x0)*i/n),y=Math.round(y0+(y1-y0)*i/n);for(let u=0;u<2;u++)for(let v=0;v<2;v++)p(x+u,y+v,i>n/2?fore:c);}};
// pięść 2×2 z konturem, rysowana na rekwizycie, żeby było widać chwyt
const fist=(x,y,H)=>layer(p=>{p(x,y,H);p(x+1,y,H);p(x,y+1,H);p(x+1,y+1,H);});
// noga: 3 piksele szerokości od biodra do stopy, but 5 pikseli w lewo
const leg=(hx,fx,lift,look,far)=>p=>{const [P,Ps,F,,,,str]=look,end=LEG_END-lift;
 for(let y=HIP;y<=end;y++){const x=Math.round(hx+(fx-hx)*(y-HIP)/(end-HIP));p(x,y,far?Ps:P);p(x+1,y,far?Ps:str||P);p(x+2,y,Ps);}
 for(let y=end+1;y<=end+2;y++)for(let x=fx-2;x<=fx+2;x++)p(x,y,F);};
const text=(s,x,y,c)=>p=>{for(const ch of s){const g=GLYPH[ch];g.forEach((r,j)=>[...r].forEach((v,i)=>v==='1'&&p(x+i,y+j,c)));x+=g[0].length+1;}};
const textW=s=>[...s].reduce((w,ch)=>w+GLYPH[ch][0].length+1,-1);

/* rekwizyty i ręce dla każdej postaci; e = poza ataku 0..3 albo -1, sw = wymach przy chodzie */
function arms(k,look,o,e,sw,shield){
 const [, , , A, Af, H, , F, Ff]=look, by=o.y;
 const arm=(x0,y0,x1,y1,far)=>{layer(limb(x0,y0+by,x1,y1,far?Af:A,far?Ff:F));fist(x1,y1,far?Ff:H);};
 if(k==='trup'){const lean=[0,-1,-3,-2][e]||0,ay=e>=0?[0,-2,1,0][e]:0;
  arm(0,15,-11+lean,15+by+ay-sw,true);return {near:()=>arm(-2,16,-13+lean,17+by+ay+sw)};}
 if(k==='sasiad'||k==='urzednik'){
  arm(1,15,1-sw,24+by,true);
  return {near:()=>{
   const [map,hp,ofs]=k==='sasiad'
    ?(e<0?[BOTTLE,[-8+sw,21],[-1,0]]:[e<2?BOTTLE_UP:BOTTLE_H,[[3,-4],[-2,-5],[-12,17],[-10,19]][e],e<2?[-1,-7]:[-6,-1]])   // butelka nad głowę i w dół
    :e<0?[STAMP_H,[-9+sw,19],[-3,-2]]:[STAMP,[[3,-4],[-2,-6],[-15,23],[-14,24]][e],[-3,-3]];                                            // pieczątka w górę i łup
   const hx=hp[0],hy=hp[1]+by;
   layer(limb(-1,15+by,hx,hy,A,F));layer(stamp(map,hx+ofs[0],hy+ofs[1]));fist(hx,hy,H);
   if(k==='urzednik'&&e>=2)layer(stamp(INK,-21,GROUND-2),false);},behind:e===0||e===1};}   // zamach zza głowy
 // komunista: oburącz trzyma tyczkę z tablicą przed sobą; atak = dźgnięcie tyczką
 const jab=e>=0?[0,-3,-7,-4][e]:0,px=POLE_X+jab,py=by+(e===2?2:0);
 layer(limb(1,15+by,px+1,17+py,Af));fist(px+1,17+py,'s');
 return {near:()=>{
  layer(p=>{const top=shield>0?BOARD.y+BOARD.h:10;for(let y=top+py;y<=32+py;y++){p(px,y,'N');p(px+1,y,'n');}
   if(shield<=0){p(px,top+py-1,'N');p(px+1,top+py-2,'n');}});     // złamany kij
  layer(limb(-1,15+by,px,22+py,A));fist(px,22+py,'S');
  if(shield>0){const bx=BOARD.x+jab,byy=BOARD.y+py;
   layer(p=>{for(let y=0;y<BOARD.h;y++)for(let x=0;x<BOARD.w;x++)p(bx+x,byy+y,y===BOARD.h-1||x===BOARD.w-1?'r':x===BOARD.w-2?'3':'R');});
   BANNER_TXT.forEach((s,i)=>layer(text(s,bx+((BOARD.w-1-textW(s))>>1),byy+i*6,'W'),false));}}};
}

function build(k,st){
 G=new Map();const look=LOOK[k],P=cycleOf(k,st).P,ph=((st.t||0)/P%1+1)%1;
 const e=st.eat?Math.floor(ph*POSES):-1, w=st.walk&&!st.eat?WALK[Math.floor(ph*POSES)]:IDLE;
 const breath=!st.walk&&!st.eat&&Math.sin((st.t||0)*2.4)>0.4?-1:0;
 const lean=e>=0?(k==='trup'?[0,-1,-3,-2]:[0,-1,-2,-1])[e]:0, o={y:w.bob+breath};
 const sw=st.walk&&!st.eat?[1,0,-1,0][Math.floor(ph*POSES)]:0;
 layer(leg(0,w.b,w.bl,look,true));
 layer(leg(-2,-2+w.a,w.al,look,false));
 const a=arms(k,look,o,e,sw,st.shield||0);
 const hunch=k==='trup', tx=-7+lean+(hunch?-1:0);
 layer(stamp(TORSO[k],tx,13+o.y+(hunch?1:0)));
 const hx=-8+lean+(hunch?-3:0)+(e===2&&k!=='trup'?-1:0), hy=o.y+(hunch?3:0);
 if(a.behind)a.near();
 layer(stamp(HEAD[k],hx,hy));
 // usta: trup kłapie szczęką przy gryzieniu, reszta otwiera usta przy gadaniu i ataku
 const open=(st.talk&&Math.sin((st.t||0)*14)>0)||e===2;
 if(k==='trup'&&open)layer(stamp(["KKKKK","KRRKK","WKWK."],hx+1,hy+9),false);
 else if(MOUTH[k]&&open)layer(stamp(["KK","KK","RK"],hx+MOUTH[k][0]-1,hy+MOUTH[k][1]-1),false);
 if(!a.behind)a.near();
}

/* rysuje siatkę G: px = rozmiar piksela, ground = wiersz ziemi; kolor = litera z PAL, cyfra z DITH albo wprost '#hex'/'rgba(…)' */
function paint(x,y,px,ground,shadow){
 const X=v=>Math.round(x+v*px),Y=v=>Math.round(y+(v-ground)*px);
 if(shadow){ctx.fillStyle=SHADOW;shadow.forEach((w,i)=>ctx.fillRect(X(-w-1),Y(ground-1+i),X(w)-X(-w-1),Y(ground+i)-Y(ground-1+i)));}
 for(const [k,c] of G){const cx=k%256-128,cy=Math.floor(k/256)-64,d=DITH[c];
  ctx.fillStyle=d?PAL[d[(cx+cy)&1]]:PAL[c]||c;ctx.fillRect(X(cx),Y(cy),X(cx+1)-X(cx),Y(cy+1)-Y(cy));}
}
const render=(x,y,h)=>paint(x,y,h/ROWS,GROUND,SHADOW_W);

/* rejestr dla plików pixel_*.js (globalnie window.PIX, bo PX to funkcja gry). Ludzie i chołota: PX.E[k]=st=>{…} rysuje do siatki (40 wierszy = wzrost, ziemia w wierszu 40,
   twarzą w lewo, x≈0 to środek; wolno wyjść poza 0..40 w górę do -64). PX.SH[k] = szerokości cienia (opcjonalnie).
   Sprzęt: PX.D[k]=(d,t)=>{…}, 36 pikseli = pole, ziemia w wierszu 0, w górę ujemne y. Zdzichu: PX.H=t=>{…} jak chołota. */
const PX=window.PIX={E:{},D:{},H:null,SH:{},PAL,DITH,OUT,ROWS,GROUND,HIP,LEG_END,WALK,IDLE,POSES,
 begin(){G=new Map();},layer,stamp,limb,leg,fist,text,textW,GLYPH,
 rect:(x,y,w,h,c)=>p=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++)p(x+i,y+j,c);},
 ell:(cx,cy,rx,ry,c)=>p=>{for(let j=Math.floor(-ry);j<=Math.ceil(ry);j++)for(let i=Math.floor(-rx);i<=Math.ceil(rx);i++)if((i*i)/(rx*rx+0.01)+(j*j)/(ry*ry+0.01)<=1.05)p(Math.round(cx+i),Math.round(cy+j),c);},
 line:(x0,y0,x1,y1,c,w=1)=>p=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++){const x=Math.round(x0+(x1-x0)*i/n),y=Math.round(y0+(y1-y0)*i/n);for(let u=0;u<w;u++)for(let v=0;v<w;v++)p(x+u,y+v,c);}},
 poly:(pts,c)=>p=>{let y0=1e9,y1=-1e9;for(const q of pts){y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1]);}
  for(let y=Math.floor(y0);y<=Math.ceil(y1);y++){const xs=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=y+0.5)!==(b[1]<=y+0.5))xs.push(a[0]+(y+0.5-a[1])/(b[1]-a[1])*(b[0]-a[0]));}
   xs.sort((m,n)=>m-n);for(let i=0;i+1<xs.length;i+=2)for(let x=Math.round(xs[i]);x<Math.round(xs[i+1]);x++)p(x,y,c);}},
 phase:(st,P)=>(((st.t||0)/P)%1+1)%1,
 frame:(st,P,n=POSES)=>Math.floor(PX.phase(st,P)*n)};
const BASE=['trup','sasiad','urzednik','komunista'];
STYLES.push({id:'pixel',name:'Piksel 16-bit',desc:'Pixel art 16-bit: siatka 40 pikseli, 16 kolorów (i więcej), dithering i 4 klatki chodu.',
 en:k=>BASE.includes(k)||!!PX.E[k],def:k=>!!PX.D[k],hero:()=>!!PX.H,
 draw(k,x,y,h,st){if(PX.E[k]){G=new Map();PX.E[k](st);paint(x,y,h/ROWS,GROUND,PX.SH[k]||SHADOW_W);}else{build(k,st);render(x,y,h);}},
 drawDef(k,x,by,sz,d,t){G=new Map();PX.D[k](d,t||0);paint(x,by,sz/36,0,null);},
 drawHero(x,y,h,t){G=new Map();PX.H(t||0);paint(x,y,h/ROWS,GROUND,SHADOW_W);}});
})();
