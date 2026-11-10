/* ---------- bufor gotowych klatek (szybsze rysowanie na telefonie) ---------- */
const SPR=new Map(),LASTSPR=new Map();let FIELD=null;
/* limit czasu na rysowanie nowych klatek w jednej klatce gry: gdy się skończy, a klatka ma prefiks
   (ta sama postać/sprzęt w tym samym rozmiarze), pokaż ostatnią gotową zamiast szarpać */
const SPRB={ms:0,max:4,skip:0};
function sprite(key,w,h,ax,ay,fn,pre){
 let c=SPR.get(key);
 if(c){SPR.delete(key);SPR.set(key,c);if(pre)LASTSPR.set(pre,c);return c;}
 if(pre&&SPRB.ms>=SPRB.max){const o=LASTSPR.get(pre);if(o){SPRB.skip++;return o;}}
 const t0=performance.now();
 if(SPR.size>=900)SPR.delete(SPR.keys().next().value);
 const sc=S*DPR;c=document.createElement('canvas');c.width=Math.max(1,Math.ceil(w*sc));c.height=Math.max(1,Math.ceil(h*sc));
 const g=c.getContext('2d',{willReadFrequently:!!pre}),old=ctx;ctx=g;try{g.setTransform(sc,0,0,sc,0,0);g.translate(ax,ay);fn();}finally{ctx=old;}
 if(pre)c=trim(c,g,sc);
 SPR.set(key,c);if(pre)LASTSPR.set(pre,c);SPRB.ms+=performance.now()-t0;return c;
}
/* przycina klatkę do narysowanych pikseli: postać zajmuje mniej niż połowę pudełka, a każda klatka to tekstura w pamięci
   (na telefonie limit pamięci płócien). c.tx,c.ty,c.tw,c.th: położenie wyciętego kawałka w jednostkach pudełka */
function trim(c,g,sc){
 const W=c.width,H=c.height,d=g.getImageData(0,0,W,H).data;let x0=W,y0=H,x1=-1,y1=-1;
 for(let y=0;y<H;y++){let row=y*W*4+3;for(let x=0;x<W;x++,row+=4)if(d[row]){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;y1=y;}}
 const t=document.createElement('canvas');
 if(x1<0){t.width=t.height=1;t.tx=t.ty=t.tw=t.th=0;return t;}
 x0=Math.max(0,x0-1);y0=Math.max(0,y0-1);x1=Math.min(W-1,x1+1);y1=Math.min(H-1,y1+1);
 const tw=x1-x0+1,th=y1-y0+1;t.width=tw;t.height=th;t.getContext('2d').drawImage(c,x0,y0,tw,th,0,0,tw,th);
 t.tx=x0/sc;t.ty=y0/sc;t.tw=tw/sc;t.th=th/sc;return t;
}
/* rysuje klatkę z bufora w pudełku (x,y = lewy górny róg, bw×bh); przycięta trafia w swoje miejsce */
function blit(c,x,y,bw,bh){if(c.tw!=null){if(c.tw)ctx.drawImage(c,x+c.tx,y+c.ty,c.tw,c.th);}else ctx.drawImage(c,x,y,bw,bh);}
const NONH_P={palac:Math.PI*2/3,swinia:Math.PI*2/12,kura:Math.PI*2/8,burak:Math.PI*2/9,buraczek:Math.PI*2/9,barszcz:Math.PI*2/6,krowa:Math.PI*2/7,nysa:Math.PI*2/7};
/* cykl animacji: okres P i liczba klatek n w buforze (gra, rozgrzewka bufora, przegląd postaci) */
function cycleOf(k,st){
 if(st.eat)return{P:Math.PI*2/((k==='trup'||k==='mumia')?10:9),n:6};
 const sp=st.sp||(EN[k]?EN[k].sp:0.22);return{sp,P:NONH_P[k]||Math.PI*2/(16*sp*(k==='mumia'?0.9:k==='boss'?1.6:1)),n:NONH_P[k]?8:10};
}
function frameFor(k,st){
 if(!st.eat&&!st.walk)return{id:NONH_P[k]?'i0':'i',t:0};
 const t=st.t||0,{P,n}=cycleOf(k,st),i=Math.floor(((t%P)+P)%P/P*n);
 if(st.eat)return{id:'e'+i,t:i/n*P};
 // poza zależy od fazy t*sp, więc klatkę i rysuje się raz, dla prędkości bazowej (spowolnienie nie tworzy nowych klatek)
 const sp0=EN[k]?EN[k].sp:st.sp,P0=cycleOf(k,{sp:sp0}).P;
 return{id:'w'+i,t:i/n*P0,sp:sp0};
}
function nPalac(t,walk){
 const s=walk?Math.sin(t*3):0,lift=walk?Math.max(0,Math.sin(t*3))*6:0,lift2=walk?Math.max(0,-Math.sin(t*3))*6:0;
 ctx.fillStyle='rgba(0,0,0,.38)';ctx.beginPath();ctx.ellipse(0,0,40,5,0,0,7);ctx.fill();
 const leg=(x,lf,far)=>{const c=far?'#c98a2a':'#e8a83a';const hip=[x,-32],kn=[x+6,-18-lf],an=[x-2,-4-lf];limb(hip,kn,8,6,c,far);limb(kn,an,6,5,c,far);
  for(const [dx,dy] of [[-10,0],[-7,3],[-3,3.4],[5,1]]){limb([an[0],an[1]],[an[0]+dx,an[1]+4+dy*0.3],2.6,1.8,c,far);}};
 leg(8,lift2,true);
 ctx.save();ctx.translate(0,-Math.abs(s)*1.5);
 const st='#d9ccb0',sh='#b3a58a';
 Pth([[-36,-30],[36,-30],[36,-54],[-36,-54]]);fs(st);fr(sh,22,-54,14,24);
 Pth([[-24,-54],[24,-54],[24,-70],[-24,-70]]);fs(st);fr(sh,14,-70,10,16);
 Pth([[-15,-70],[15,-70],[15,-84],[-15,-84]]);fs(st);fr(sh,8,-84,7,14);
 Pth([[-8,-84],[8,-84],[6,-94],[-6,-94]]);fs(st);
 Pth([[-2.4,-94],[2.4,-94],[0,-118]]);fs('#c9b48a');
 ctx.beginPath();ctx.arc(0,-77,4.2,0,7);fs('#f4efe0',OLW*0.8);ln(0,-77,0,-80,OL,0.9);ln(0,-77,2.4,-77,OL,0.9);
 for(let i=0;i<5;i++)fr('#5a5040',-30+i*12,-50,5,7);for(let i=0;i<4;i++)fr('#5a5040',-20+i*11,-66,4,6);
 const gl=0.6+0.4*Math.sin(t*5);ctx.fillStyle='rgba(255,220,80,'+gl+')';ctx.fillRect(-28,-48,9,6);ctx.fillRect(-12,-48,9,6);
 ln(-30,-52,-18,-49,OL,2);ln(-14,-49,-2,-52,OL,2);
 Pth([[-6,-30],[6,-30],[6,-42],[-6,-42]]);fs('#3a2a1a');
 Pth([[-36,-54],[-50,-62],[-50,-46]]);fs('#8a8e94');Pth([[36,-54],[48,-62],[48,-46]]);fs('#8a8e94');
 Pth([[-20,-58],[20,-58],[20,-53],[-20,-53]]);fs('#c42a20',OLW*0.8);ctx.font='900 4px '+FONT;ctx.textAlign='center';ctx.fillStyle='#fff6dc';ctx.fillText('PRZYJAŹŃ NARODÓW',0,-54.4);
 ctx.restore();
 leg(-8,lift,false);
}
function drawEnemyKey(k,x,y,h,st){
 if(st.nocache||k==='dziad'){drawEnemyRaw(k,x,y,h,st);return;}
 const fr=frameFor(k,st),hq=Math.round(h*2)/2;
 const key='E|'+k+'|'+hq+'|'+fr.id+'|'+(st.shield>0?1:0)+(st.helm>0?1:0)+(st.talk?1:0)+'|'+(k==='boss'?(st.hp<0.3?2:st.hp<0.6?1:0):0);
 const bw=hq*1.8,bh=hq*1.5,ax=bw/2,ay=bh*0.88;
 const c=sprite(key,bw,bh,ax,ay,()=>drawEnemyRaw(k,0,0,hq,Object.assign({},st,{t:fr.t},fr.sp?{sp:fr.sp}:null)),'E|'+k+'|'+hq+'|'+(st.shield>0?1:0)+(st.helm>0?1:0));
 blit(c,x-ax,y-ay,bw,bh);
}
function defSig(k,d,t){
 const F6=((Math.floor(t*6)%6)+6)%6;let tq=F6/6;if(!d)return{id:'icon',t:0,d:null};
 let id='f'+F6,d2={};
 switch(k){
  case 'gumofilce':case 'resztki':case 'woda':{const st=catapultFromDef(d,t),ab=Math.round(st.a*8)/8;id='a'+ab;d2={__a:ab};tq=0;break;}
  case 'pila':case 'kombajn':id=(d.rev?'r':'s')+(d.rev?F6:F6%3);d2={rev:d.rev};break;
  case 'szafa':id='h'+(d.hp<d.max*0.33?2:d.hp<d.max*0.66?1:0);d2={hp:d.hp,max:d.max};tq=0;break;
  case 'rubin':id='h'+(d.hp<d.max*0.5?1:0)+F6;d2={hp:d.hp,max:d.max};break;
  case 'aparatura':id=d.armed?'A'+(F6%2):'u'+Math.ceil(d.armT);d2={armed:d.armed,armT:Math.ceil(d.armT)};break;
  case 'lancuch':id=d.reload>0?'R':'r';d2={reload:d.reload};tq=0;break;
  case 'rozlew':{const lq=Math.ceil(d.life/5);id='u'+lq+F6;d2={life:lq*5};break;}
  case 'pralka':case 'armata':{const kk=d.kick>0?Math.ceil(d.kick*16/4)*4:0;id='k'+kk+(kk?'':F6);d2={kick:kk/16};if(kk)tq=0;break;}
  case 'samowar':id=(d.kick>0?'o':'c')+F6;d2={kick:d.kick>0?1:0};break;
  case 'bimbrownia':id=(d.t<1.2?'g':'n')+F6;d2={t:d.t<1.2?0:5};break;
  case 'plug':case 'maluch':id='m'+F6;d2={};break;
 }
 return{id,t:tq,d:d2};
}
function drawDef(k,cx,by,sz,d,tt){
 const sig=defSig(k,d,tt||0),sq=Math.round(sz*2)/2,bw=sq*1.6,bh=sq*1.5,ax=bw/2,ay=bh*0.86;
 const c=sprite('D|'+k+'|'+sq+'|'+sig.id,bw,bh,ax,ay,()=>drawDefRaw(k,0,0,sq,sig.d,sig.t),'D|'+k+'|'+sq);
 const ox=d&&d.hitT>0?Math.sin((tt||0)*80)*1.4*sq/72:0;
 blit(c,cx-ax+ox,by-ay,bw,bh);
}

