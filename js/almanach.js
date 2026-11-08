/* ---------- almanach ---------- */
const ALM_DEF=ORDER.concat(['lopata','ursus']);
const ALM_EN=['trup','sasiad','urzednik','komunista','milicjant','nysa','wampir','mumia','lunatyk','swinia','kura','lenin','przodownik','burak','barszcz','krowa','carski','okupant','sekretarz','boss','palac'];
let ALM={tab:'def',sel:null,back:'title'};
function unlockedDefs(){const set=new Set(['lopata','ursus']);for(let i=0;i<Math.min(save.unlocked,LEVELS.length);i++)LEVELS[i].defs.forEach(k=>set.add(k));return set;}
function openAlm(back){ALM.back=back;ALM.sel=null;scene='almanac';}
function drawAlmanac(){
 const g=ctx.createLinearGradient(0,0,0,LH);g.addColorStop(0,'#4a3018');g.addColorStop(1,'#22160a');ctx.fillStyle=g;ctx.fillRect(0,0,LW,LH);
 txt('Almanach',LW/2,40,24,900,'#ffd66a','center',['#1a0f06',5]);
 button(14,12,96,34,'‹ Wróć',()=>{scene=ALM.back;},{size:14,bg:'#cdb48a'});
 button(LW-232,12,104,34,'Sprzęt',()=>{ALM.tab='def';ALM.sel=null;},{size:14,on:ALM.tab==='def',bg:ALM.tab==='def'?null:'#a89068'});
 button(LW-122,12,108,34,'Chołota',()=>{ALM.tab='en';ALM.sel=null;},{size:14,on:ALM.tab==='en',bg:ALM.tab==='en'?null:'#a89068'});
 const list=ALM.tab==='def'?ALM_DEF:ALM_EN,un=ALM.tab==='def'?unlockedDefs():new Set(save.seen);
 const gw=Math.min(LW*0.52,380),cols=5,cw=(gw-4*6)/cols,ch=Math.min(66,cw*1.1),x0=14,y0=60;
 list.forEach((k,i)=>{const x=x0+(i%cols)*(cw+6),y=y0+Math.floor(i/cols)*(ch+6),open=un.has(k),sel=ALM.sel===k;
  ctx.fillStyle=open?(sel?'#fff1b8':'#ead6a6'):'#5a4a38';rrect(x,y,cw,ch,6);ctx.fill();ctx.lineWidth=sel?3:1.5;ctx.strokeStyle=sel?'#ffcc00':'#2a1608';ctx.stroke();
  if(open){ctx.save();rrect(x,y,cw,ch,6);ctx.clip();if(ALM.tab==='def')drawDef(k,x+cw/2,y+ch-6,Math.min(cw*0.86,ch*0.85),null,T);else{const hh=k==='palac'?ch*0.36:k==='boss'?ch*0.82:k==='nysa'?ch*0.5:k==='barszcz'?ch*0.62:ch*0.8;drawEnemyKey(k,x+cw/2,y+ch-5,hh,{t:T+i,walk:false,shield:400,helm:350,hp:1});}ctx.restore();btns.push({x,y,w:cw,h:ch,cb:()=>{ALM.sel=k;}});}
  else txt('?',x+cw/2,y+ch/2+8,22,900,'#8a7a6a');});
 const px=x0+gw+16,pw=LW-px-14,py=60,ph=LH-74;
 ctx.fillStyle='#f1e2bd';rrect(px,py,pw,ph,12);ctx.fill();ctx.lineWidth=3;ctx.strokeStyle='#5a3a1e';ctx.stroke();
 if(!ALM.sel){ctx.font=F(14,500);let yy=py+ph/2-10;for(const ln of wrap(ALM.tab==='def'?'Dotknij sprzętu po lewej, żeby zobaczyć, co robi. Szare pola odblokujesz w kolejnych nocach.':'Dotknij wroga po lewej. Szare pola to chołota, której jeszcze nie spotkałeś.',pw-40)){txt(ln,px+pw/2,yy,14,500,'#5a3a1e');yy+=19;}return;}
 const k=ALM.sel,bh=Math.min(150,ph*0.5);
 ctx.fillStyle=ALM.tab==='def'?'#d9c393':'#3a3428';rrect(px+12,py+12,pw-24,bh,8);ctx.fill();
 ctx.save();rrect(px+12,py+12,pw-24,bh,8);ctx.clip();
 if(ALM.tab==='def'){ctx.restore();ctx.save();demoBox(k,px+12,py+12,pw-24,bh);}
 else{ctx.fillStyle='#4a5a35';ctx.fillRect(px+12,py+12+bh-26,pw-24,26);const hh=k==='palac'?bh*0.8:k==='boss'?bh*0.95:k==='nysa'?bh*0.62:k==='barszcz'?bh*0.7:k==='krowa'?bh*0.85:bh*0.82;drawEnemyKey(k,px+pw/2,py+12+bh-12,hh,{nocache:true,t:T,walk:true,shield:400,helm:350,hp:1,talk:true,sp:EN[k].sp});}
 ctx.restore();
 let ty=py+bh+40;const tw=pw-32;
 if(ALM.tab==='def'){const d=DEF[k];ctx.font=F(19,900);for(const ln of wrap(d.name,tw)){txt(ln,px+16,ty,19,900,'#2a1608','left');ty+=22;}
  txt(d.special?'Darmowy, stoi przy płocie':d.tool?'Narzędzie, za darmo':'Koszt: '+d.cost+' l   Odnowienie: '+d.cd+' s',px+16,ty,12,700,'#7a5a2a','left');ty+=20;
  ctx.font=F(13,500);for(const ln of wrap(d.desc,tw)){txt(ln,px+16,ty,13,500,'#2a1608','left');ty+=17;}
  const night=LEVELS.findIndex(l=>l.intro.includes(k));if(night>=0)txt('Pojawia się od nocy '+(night+1),px+16,py+ph-12,11,700,'#7a5a2a','left');}
 else{const e=EN[k];ctx.font=F(19,900);for(const ln of wrap(e.name,tw)){txt(ln,px+16,ty,19,900,'#2a1608','left');ty+=22;}
  const tough=e.hp+(e.shield||0)+(e.helm||0),ts=e.boss?5:clamp(Math.round(tough/180),1,5),ss=clamp(Math.ceil(e.sp/0.11),1,4);
  txt('Wytrzymałość '+'★'.repeat(ts)+'☆'.repeat(5-ts)+'   Szybkość '+'★'.repeat(ss)+'☆'.repeat(4-ss)+(e.undead?'   Umarlak':''),px+16,ty,12,700,'#7a5a2a','left');ty+=20;
  ctx.font=F(13,500);for(const ln of wrap(e.desc,tw)){txt(ln,px+16,ty,13,500,'#2a1608','left');ty+=17;}
  const night=LEVELS.findIndex(l=>l.newEn.includes(k));if(night>=0)txt('Pojawia się od nocy '+(night+1),px+16,py+ph-12,11,700,'#7a5a2a','left');}
}
function drawPick(){
 const g=ctx.createLinearGradient(0,0,0,LH);g.addColorStop(0,'#5a3a1e');g.addColorStop(1,'#2a1a0c');ctx.fillStyle=g;ctx.fillRect(0,0,LW,LH);
 const mx=maxSlots(PK.li),lv=LEVELS[PK.li];
 txt(MODE==='evil'?'Wybierz chołotę na tę noc':'Wybierz sprzęt na tę noc',LW/2,40,24,900,'#ffd66a','center',['#1a0f06',5]);
 txt(lv.name+'  ·  wybrano '+PK.sel.length+' z '+mx,LW/2,62,13,700,'#e8d3a0');
 button(14,14,96,34,'‹ Wróć',()=>{scene='levels';},{size:14,bg:'#cdb48a'});
 const n=PK.avail.length,cols=Math.min(n,Math.max(6,Math.floor((LW-40)/72))),cw=64,ch=76,gap=8,w=cols*(cw+gap)-gap,x0=(LW-w)/2,y0=78;
 PK.avail.forEach((k,i)=>{
  const x=x0+(i%cols)*(cw+gap),y=y0+Math.floor(i/cols)*(ch+gap),on=PK.sel.includes(k),def={cost:costOf(k)},isNew=(MODE==='evil'?lv.newEn:lv.intro).includes(k);
  ctx.fillStyle=on?'#fff1b8':'#b8a582';rrect(x,y,cw,ch,7);ctx.fill();ctx.lineWidth=on?3:1.5;ctx.strokeStyle=on?'#ffcc00':'#3a2210';ctx.stroke();
  ctx.save();rrect(x,y,cw,ch,7);ctx.clip();cardIcon(k,x+cw/2,y+ch-18,48);ctx.restore();
  fr('rgba(42,26,12,.85)',x+2,y+ch-16,cw-4,14);txt(String(def.cost),x+cw/2,y+ch-5,11,900,'#ffd66a');
  if(!on){ctx.fillStyle='rgba(30,20,10,.45)';rrect(x,y,cw,ch,7);ctx.fill();}
  if(on){ctx.fillStyle='#2d6a1f';circ(x+cw-9,y+9,7);line(x+cw-12,y+9,x+cw-9.5,y+12,2,'#fff');line(x+cw-9.5,y+12,x+cw-5.5,y+6,2,'#fff');}
  if(isNew){fr('#b3261e',x+3,y+3,26,11);txt('nowe',x+16,y+11.5,8,900,'#fff');}
  btns.push({x,y,w:cw,h:ch,cb:()=>{PK.info=k;if(on)PK.sel=PK.sel.filter(q=>q!==k);else if(PK.sel.length<mx)PK.sel.push(k);else toast2('Najwyżej '+mx+' sprzętów. Odznacz coś.');}});
 });
 const rows=Math.ceil(n/cols),iy=y0+rows*(ch+gap)+4;
 if(MODE==='evil'){const arr=ORDER.filter(k=>lv.defs.includes(k)),n2=arr.length,cw2=Math.min(40,(LW-60)/n2-4),x2=LW/2-(n2*(cw2+4)-4)/2;txt('Zdzichu ma tej nocy:',LW/2,iy+66,12,900,'#ffd66a');arr.forEach((k,i)=>{const xx=x2+i*(cw2+4);ctx.fillStyle='#d9c393';rrect(xx,iy+72,cw2,cw2+4,5);ctx.fill();drawDef(k,xx+cw2/2,iy+72+cw2,cw2*0.9,null,T);});}
 else{const el=nightEnemies(lv);if(el.length){txt('Tej nocy przyjdą:',LW/2,iy+66,12,900,'#ffd66a');enemyRow(el,lv.newEn,LW/2,iy+72,30,LW-40);}}
 if(PK.info){const d=infoOf(PK.info);txt(d.name,LW/2,iy+14,14,900,'#fff8dc');ctx.font=F(12,500);let yy=iy+32;for(const ln of wrap(d.desc,Math.min(620,LW-60)).slice(0,2)){txt(ln,LW/2,yy,12,500,'#e8d3a0');yy+=15;}}
 else txt('Dotknij karty, żeby ją dodać albo zdjąć. Nowe karty są zaznaczone.',LW/2,iy+14,12,500,'#e8d3a0');
 button(LW/2-100,LH-56,200,44,'Do boju!',()=>{if(!PK.sel.length){toast2('Weź chociaż jeden sprzęt');return;}if(MODE==='evil')save.evilLoad=PK.sel.slice();else save.load=PK.sel.slice();persist();newGame(PK.li,PK.sel.slice());},{size:18});
 if(PK.toast&&PK.toast.t>T){ctx.font=F(13,700);const w2=ctx.measureText(PK.toast.tx).width+24;ctx.fillStyle='rgba(20,12,4,.9)';rrect(LW/2-w2/2,LH-92,w2,28,14);ctx.fill();txt(PK.toast.tx,LW/2,LH-73,13,700,'#f4e7c9');}
}
function toast2(s){PK.toast={tx:s,t:T+1.6};}
function drawRotate(){
 ctx.fillStyle='#1d140b';ctx.fillRect(0,0,LW,LH);
 ctx.save();ctx.translate(LW/2,LH*0.4);ctx.rotate(Math.sin(T*2)*0.5-0.5);ctx.strokeStyle='#ffd66a';ctx.lineWidth=4;rrect(-22,-38,44,76,8);ctx.stroke();ctx.restore();
 ctx.font=F(16,900);let y=LH*0.62;for(const ln of wrap('Obróć telefon poziomo',LW-20)){txt(ln,LW/2,y,16,900,'#ffd66a');y+=22;}
}

