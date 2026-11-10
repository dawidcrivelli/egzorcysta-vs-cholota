/* ---------- UI ---------- */
function button(x,y,w,h,label,cb,opt){
 opt=opt||{};btns.push({x,y,w,h,cb});
 ctx.fillStyle='rgba(0,0,0,.35)';rrect(x+2,y+3,w,h,8);ctx.fill();
 ctx.fillStyle=opt.bg||(opt.on?'#ffd66a':'#e7b04a');rrect(x,y,w,h,8);ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle='#3a2210';ctx.stroke();
 if(opt.icon)opt.icon(x+w/2,y+h/2);else txt(label,x+w/2,y+h/2+(opt.size||16)*0.36,opt.size||16,900,opt.fg||'#2a1608');
}
function drawTop(live){
 const g=ctx.createLinearGradient(0,0,0,L.top);g.addColorStop(0,'#6b4524');g.addColorStop(1,'#4a2e16');ctx.fillStyle=g;ctx.fillRect(0,0,LW,L.top);
 for(let y=14;y<L.top;y+=16)line(0,y,LW,y,1,'rgba(0,0,0,.18)');
 line(0,L.top,LW,L.top,2,'#2a1608');
 ctx.fillStyle='#2a1a0c';rrect(6,6,76,66,8);ctx.fill();ctx.strokeStyle='#8a6a3a';ctx.lineWidth=1.5;ctx.stroke();
 if(G.evil)soulIcon(24,40,1.15,false);else bottleIcon(24,38,0.95,false);const sv=String(Math.floor(G.sam));txt(sv,60,40,sv.length>3?13:16,900,'#ffd66a','center');txt(G.evil?'duszyczek':'litrów',60,54,9,700,'#c9a36a','center');
 const n=G.cards.length,x0=88,avail=LW-x0-112,cw=Math.min(64,Math.floor(avail/n)-3),ch=66;
 G.cards.forEach((k,i)=>{
  const x=x0+i*(cw+3),def={cost:costOf(k),cd:cdOf(k)},sel=G.sel===k,ready=k==='lopata'||G.cd[k]<=0,afford=k==='lopata'||G.sam>=def.cost,yy=sel?3:6;
  ctx.fillStyle=sel?'#fff1b8':'#ead6a6';rrect(x,yy,cw,ch,6);ctx.fill();ctx.lineWidth=sel?3:1.5;ctx.strokeStyle=sel?'#ffcc00':'#3a2210';ctx.stroke();
  ctx.save();rrect(x,yy,cw,ch,6);ctx.clip();cardIcon(k,x+cw/2,yy+ch-16,Math.min(cw*0.92,46));ctx.restore();
  if(k!=='lopata'){fr('rgba(42,26,12,.85)',x+2,yy+ch-15,cw-4,13);txt(String(def.cost),x+cw/2,yy+ch-4.5,11,900,'#ffd66a');}
  if(!afford||!ready){ctx.fillStyle='rgba(30,20,10,.42)';rrect(x,yy,cw,ch,6);ctx.fill();}
  if(!ready){const f=G.cd[k]/def.cd;fr('rgba(20,10,0,.5)',x,yy,cw,ch*f);}
  if(live)btns.push({x,y:0,w:cw+3,h:L.top,cb:()=>{selectCard(k);PRESS={k,t:T,x:x+cw/2};}});
 });
 const bx=LW-104;
 if(live){
  button(bx,6,46,30,'',()=>{paused=true;},{icon:(cx,cy)=>{fr('#2a1608',cx-6,cy-7,4,14);fr('#2a1608',cx+2,cy-7,4,14);}});
  button(bx+52,6,46,30,speed===2?'×2':'×1',()=>{speed=speed===2?1:2;},{on:speed===2});
 }
 ctx.fillStyle='rgba(0,0,0,.4)';rrect(bx,46,98,12,6);ctx.fill();
 if(G.evil){const f=clamp(G.t/G.dawn,0,1);ctx.fillStyle='#e8b04a';rrect(bx,46,Math.max(12,98*f),12,6);ctx.fill();txt('Do świtu: '+Math.max(0,Math.ceil(G.dawn-G.t))+' s',bx+49,72,10,900,'#ffd66a');}
 else if(G.endless){const f=clamp(1-(G.nextWave-G.t)/Math.max(13,24-G.wave*0.5),0,1);ctx.fillStyle='#c33';rrect(bx,46,98*f,12,6);ctx.fill();txt('Fala '+G.wave,bx+49,72,10,900,'#ffd66a');}
 else{const f=clamp(G.t/G.lastT,0,1);ctx.fillStyle='#c33';rrect(bx,46,Math.max(12,98*f),12,6);ctx.fill();
  for(const w of G.waves)if(w.flag){const fx=bx+98*clamp(w.t/G.lastT,0,1);line(fx-3,44,fx-3,58,1.5,'#f4e7c9');ctx.fillStyle=w.flag.includes('#')?'#ffd66a':'#e0412e';poly([[fx-3,44],[fx+5,47],[fx-3,50]]);}
  ctx.font=F(9,700);const nw=ctx.measureText(G.lv.name).width;txt(G.lv.name,bx+49,72,nw>100?9*100/nw:9,700,'#e8d3a0');}
}
function nightEnemies(lv){if(lv.endless)return[];const out=[];for(const w of parseWaves(lv.waves))for(const k of w.list)if(!out.includes(k))out.push(k);return out;}
function enemyRow(list,newOnes,cx,y,size,maxW){
 const n=list.length,gap=6,cw=Math.min(size+14,(maxW-gap*(n-1))/n),w=n*cw+(n-1)*gap,x0=cx-w/2;
 list.forEach((k,i)=>{const x=x0+i*(cw+gap);ctx.fillStyle=newOnes.includes(k)?'#f6e2a6':'#d9c393';rrect(x,y,cw,size+18,6);ctx.fill();ctx.strokeStyle='#5a3a1e';ctx.lineWidth=1.5;ctx.stroke();
  ctx.save();rrect(x,y,cw,size+18,6);ctx.clip();const hh=k==='palac'?size*0.62:k==='boss'?size*0.9:k==='nysa'?size*0.55:k==='barszcz'?size*0.75:size*0.86;drawEnemyKey(k,x+cw/2,y+size+2,hh,{t:T+i,walk:false,shield:400,helm:350,hp:1});ctx.restore();
  ctx.font=F(8,700);const SH={nysa:'Nysa',boss:'Pomnik',palac:'Pałac',komunista:'Aktywista',przodownik:'Przodownik',sasiad:'Sąsiad',urzednik:'Urzędnik'},nm=SH[k]||EN[k].name.split(' ')[0];txt(nm.length>9?nm.slice(0,8)+'.':nm,x+cw/2,y+size+14,8,700,'#2a1608');
  if(newOnes.includes(k)){fr('#b3261e',x+2,y+2,22,10);txt('nowy',x+13,y+10,7,900,'#fff');}});
}
function drawModal(m){
 if(m.kind==='arsenal'){ctx.fillStyle='rgba(10,6,2,.62)';ctx.fillRect(0,0,LW,LH);const w=Math.min(640,LW-30),h=270,x=(LW-w)/2,y=(LH-h)/2;
  ctx.fillStyle='#f1e2bd';rrect(x,y,w,h,14);ctx.fill();ctx.lineWidth=4;ctx.strokeStyle='#5a3a1e';ctx.stroke();
  txt('Tryb chołoty',LW/2,y+30,13,900,'#7a1fb3');txt('Wejdź do chałupy Zdzicha przed świtem',LW/2,y+56,20,900,'#2a1608');
  ctx.font=F(12,500);let yy=y+78;for(const ln of wrap('Stawiaj groby na cmentarzu (dwie ostatnie kolumny) i zbieraj duszyczki. Za duszyczki wysyłasz chołotę do wybranego rzędu. Pierwszy, kto dojdzie do płotu, odpala Ursusa w tym rzędzie, dopiero następny wejdzie do chałupy.',w-40)){txt(ln,LW/2,yy,12,500,'#2a1608');yy+=16;}
  txt('Zdzichu ma tej nocy:',LW/2,yy+14,12,900,'#7a4a1a');const arr=ORDER.filter(k=>G.lv.defs.includes(k)),n=arr.length,cw=Math.min(50,(w-30)/n-4),x0=LW/2-(n*(cw+4)-4)/2;
  arr.forEach((k,i)=>{const xx=x0+i*(cw+4);ctx.fillStyle='#d9c393';rrect(xx,yy+22,cw,cw+4,6);ctx.fill();drawDef(k,xx+cw/2,yy+22+cw,cw*0.9,null,T);});
  ctx.globalAlpha=0.6+0.4*Math.sin(T*4);txt(G.modal.length>1?'Dotknij, aby czytać dalej ('+(G.modal.length-1)+')':'Dotknij, aby grać',LW/2,y+h-12,12,700,'#5a3a1e');ctx.globalAlpha=1;return;}
 if(m.kind==='preview'){ctx.fillStyle='rgba(10,6,2,.62)';ctx.fillRect(0,0,LW,LH);const w=Math.min(620,LW-30),h=220,x=(LW-w)/2,y=(LH-h)/2;
  ctx.fillStyle='#f1e2bd';rrect(x,y,w,h,14);ctx.fill();ctx.lineWidth=4;ctx.strokeStyle='#5a3a1e';ctx.stroke();
  txt('Tej nocy przyjdą',LW/2,y+36,22,900,'#2a1608');const list=nightEnemies(G.lv);
  const half=list.length>8?Math.ceil(list.length/2):list.length;enemyRow(list.slice(0,half),G.lv.newEn,LW/2,y+52,44,w-30);if(list.length>half)enemyRow(list.slice(half),G.lv.newEn,LW/2,y+52+70,44,w-30);
  ctx.globalAlpha=0.6+0.4*Math.sin(T*4);txt(G.modal.length>1?'Dotknij, aby czytać dalej ('+(G.modal.length-1)+')':'Dotknij, aby grać',LW/2,y+h-12,12,700,'#5a3a1e');ctx.globalAlpha=1;return;}
 ctx.fillStyle='rgba(10,6,2,.62)';ctx.fillRect(0,0,LW,LH);
 if(m.kind==='def'){const w=Math.min(600,LW-30),h=380,x=(LW-w)/2,y=(LH-h)/2;
  ctx.fillStyle='rgba(0,0,0,.4)';rrect(x+4,y+6,w,h,14);ctx.fill();ctx.fillStyle='#f1e2bd';rrect(x,y,w,h,14);ctx.fill();ctx.lineWidth=4;ctx.strokeStyle='#5a3a1e';ctx.stroke();
  const d=DEF[m.key],bh=200;demoBox(m.key,x+16,y+16,w-32,bh);
  let ty=y+bh+40;txt('Nowy sprzęt',x+18,ty,12,900,'#2d6a1f','left');txt(d.special?'Darmowy, stoi przy płocie':d.tool?'Narzędzie, za darmo':'Koszt: '+d.cost+' l   Odnowienie: '+d.cd+' s',x+w-18,ty,12,700,'#7a5a2a','right');ty+=26;
  ctx.font=F(21,900);txt(d.name,x+18,ty,21,900,'#2a1608','left');ty+=22;ctx.font=F(13,500);for(const ln of wrap(d.desc,w-36).slice(0,4)){txt(ln,x+18,ty,13,500,'#2a1608','left');ty+=17;}
  ctx.globalAlpha=0.6+0.4*Math.sin(T*4);txt(G.modal.length>1?'Dotknij, aby czytać dalej ('+(G.modal.length-1)+')':'Dotknij, aby grać',x+w/2,y+h-12,12,700,'#5a3a1e');ctx.globalAlpha=1;return;}
 const w=Math.min(580,LW-30),h=300,x=(LW-w)/2,y=(LH-h)/2;
 ctx.fillStyle='rgba(0,0,0,.4)';rrect(x+4,y+6,w,h,14);ctx.fill();
 ctx.fillStyle='#f1e2bd';rrect(x,y,w,h,14);ctx.fill();ctx.lineWidth=4;ctx.strokeStyle='#5a3a1e';ctx.stroke();
 const pw=Math.min(190,w*0.34),px=x+18,py=y+22,ph=h-64;
 ctx.fillStyle=m.kind==='en'||m.kind==='boss'?'#3a2a2a':'#d9c393';rrect(px,py,pw,ph,10);ctx.fill();
 ctx.save();rrect(px,py,pw,ph,10);ctx.clip();
 let label='',name='',meta='',desc='',lc='#2d6a1f';
 if(m.kind==='level'){
  const lv=G.lv;dziad(px+pw*0.5,py+ph-12,ph*0.82,T);
  label=lv.endless?'Tryb bez końca':'Noc '+(G.li+1)+' z '+CAMP;name=lv.name;desc=lv.sub;meta='„'+lv.quote+'” – Egzorcysta Zdzichu';lc='#7a4a1a';
 }else if(m.kind==='def'){
  const d=DEF[m.key];drawDef(m.key,px+pw/2,py+ph-26,Math.min(pw*0.8,ph*0.75),null,T);
  label='Nowy sprzęt';name=d.name;desc=d.desc;meta=d.special?'Darmowy, stoi przy płocie':d.tool?'Narzędzie, za darmo':'Koszt: '+d.cost+' l samogonu, odnowienie '+d.cd+' s';
 }else{
  const e=EN[m.key];ctx.fillStyle='#4a6a35';ctx.fillRect(px,py+ph-34,pw,34);
  const hh=m.key==='palac'?ph*0.78:m.key==='boss'?ph*0.92:m.key==='nysa'?ph*0.6:m.key==='barszcz'?ph*0.68:m.key==='krowa'?ph*0.78:ph*0.8;drawEnemyKey(m.key,px+pw*(m.key==='nysa'?0.52:0.5),py+ph-14,hh,{nocache:true,t:T,walk:true,shield:e.shield||0,helm:e.helm||0,hp:1,talk:true});
  label=G.evil?(m.kind==='boss'?'Nowy boss do wysłania':'Nowa chołota do wysłania'):m.kind==='boss'?'Boss':'Nowy wróg';lc=m.kind==='boss'?'#8a1fb3':'#b3261e';name=e.name;desc=e.desc;
  const tough=e.hp+(e.shield||0)+(e.helm||0);const ts=e.boss?5:clamp(Math.round(tough/180),1,5),ss=clamp(Math.ceil(e.sp/0.11),1,4);
  meta=(G.evil&&UNIT[m.key]?'Koszt: '+costOf(m.key)+' duszyczek, odnowienie '+cdOf(m.key)+' s.   ':'')+'Wytrzymałość '+'★'.repeat(ts)+'☆'.repeat(5-ts)+'   Szybkość '+'★'.repeat(ss)+'☆'.repeat(4-ss)+(e.undead?'   Umarlak':'');
 }
 ctx.restore();
 const tx=px+pw+20,tw=x+w-tx-18;let ty=y+44;
 txt(label,tx,ty,13,900,lc,'left');ty+=26;
 ctx.font=F(23,900);for(const ln of wrap(name,tw)){txt(ln,tx,ty,23,900,'#2a1608','left');ty+=27;}
 ty+=2;ctx.font=F(12,700);for(const ln of wrap(meta,tw)){txt(ln,tx,ty,12,700,'#7a5a2a','left');ty+=16;}
 ty+=8;ctx.font=F(14,500);for(const ln of wrap(desc,tw)){txt(ln,tx,ty,14,500,'#2a1608','left');ty+=19;}
 ctx.globalAlpha=0.6+0.4*Math.sin(T*4);txt(G.modal.length>1?'Dotknij, aby czytać dalej ('+(G.modal.length-1)+')':'Dotknij, aby grać',x+w/2,y+h-14,12,700,'#5a3a1e');ctx.globalAlpha=1;
}
function panel(w,h){const x=(LW-w)/2,y=(LH-h)/2;ctx.fillStyle='rgba(10,6,2,.6)';ctx.fillRect(0,0,LW,LH);ctx.fillStyle='rgba(0,0,0,.4)';rrect(x+4,y+6,w,h,14);ctx.fill();ctx.fillStyle='#f1e2bd';rrect(x,y,w,h,14);ctx.fill();ctx.lineWidth=4;ctx.strokeStyle='#5a3a1e';ctx.stroke();return{x,y};}
function drawPause(){
 const p=panel(320,346);txt('Pauza',LW/2,p.y+40,26,900,'#2a1608');
 button(LW/2-110,p.y+56,107,40,'Graj dalej',()=>{paused=false;},{size:14});
 button(LW/2+3,p.y+56,107,40,'Almanach',()=>openAlm('play'),{size:14,bg:'#cdb48a'});
 button(LW/2-110,p.y+108,107,36,save.mus?'Muzyka: tak':'Muzyka: nie',()=>toggleMus(),{size:12,on:save.mus});
 button(LW/2+3,p.y+108,107,36,save.sfx?'Dźwięki: tak':'Dźwięki: nie',()=>toggleSfx(),{size:12,on:save.sfx});
 button(LW/2-110,p.y+156,220,40,'Zacznij noc od nowa',()=>{newGame(G.li,G.load);},{size:14});
 button(LW/2-110,p.y+206,220,40,'Wybór nocy',()=>{paused=false;scene='levels';},{size:14,bg:'#cdb48a'});
 button(LW/2-110,p.y+254,220,36,'Grafika: '+styleName(),()=>nextGameStyle(),{size:13,bg:'#cdb48a'});
}
function drawLoseScene(t){
 const fl=LH*0.8;
 ctx.fillStyle='#3e2a18';ctx.fillRect(0,0,LW,LH);for(let x=0;x<LW;x+=26)line(x,0,x,fl,2,'rgba(0,0,0,.25)');
 ctx.fillStyle='#2a1c10';ctx.fillRect(0,fl,LW,LH-fl);for(let x=-40;x<LW;x+=60)line(x,fl,x+40,LH,1.5,'rgba(0,0,0,.3)');
 const wx=LW*0.12,wy=LH*0.16;fr('#141c34',wx,wy,90,80);ctx.fillStyle='#f4f1d0';circ(wx+60,wy+26,11);line(wx+45,wy,wx+45,wy+80,4,'#5a3a1e');line(wx,wy+40,wx+90,wy+40,4,'#5a3a1e');ctx.strokeStyle='#5a3a1e';ctx.lineWidth=6;ctx.strokeRect(wx,wy,90,80);
 fr('#c9a24a',LW*0.42,LH*0.14,52,64);fr('#6a5a8a',LW*0.42+6,LH*0.14+6,40,52);ctx.fillStyle='#f0d890';circ(LW*0.42+26,LH*0.14+26,8);
 const sw=Math.sin(T*1.6)*0.12,bx=LW*0.34,by=LH*0.04;ctx.save();ctx.translate(bx,0);ctx.rotate(sw);line(0,0,0,LH*0.26,1.5,'#111');const g=ctx.createRadialGradient(0,LH*0.28,2,0,LH*0.28,LH*0.5);g.addColorStop(0,'rgba(255,220,140,.35)');g.addColorStop(1,'rgba(255,220,140,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-8,LH*0.28);ctx.lineTo(-LW*0.25,LH);ctx.lineTo(LW*0.25,LH);ctx.closePath();ctx.fill();ctx.fillStyle='#fff3c0';circ(0,LH*0.28,7);ctx.restore();
 const dx=LW*0.78,open=clamp(t/0.6,0,1);fr('#120a04',dx,fl-150,80,150);ctx.fillStyle='#6a4424';ctx.fillRect(dx+80-80*(1-open*0.85),fl-150,80*(1-open*0.85),150);ctx.strokeStyle='#2a1608';ctx.lineWidth=3;ctx.strokeRect(dx,fl-150,80,150);
 fr('#6a4424',LW*0.24,fl-58,LW*0.2,8);line(LW*0.26,fl-50,LW*0.26,fl,5,'#4a2e16');line(LW*0.42,fl-50,LW*0.42,fl,5,'#4a2e16');
 bottleIcon(LW*0.36,fl-62,1.1,false);
 fr('#5a3a1e',LW*0.12,fl-30,LW*0.12,7);
 const scared=t>1.9;drawHuman('dziad',LW*0.2,fl,150,{t:T,flip:true,pose:scared?{hip:-30,lean:-0.12,tilt:-0.15,legs:SEAT.legs,arms:[{sh:2.7,el:0.3},{sh:2.5,el:0.4}]}:SEAT});
 if(scared&&t<3.2){ctx.font=F(13,700);const tx='O matko…',w=ctx.measureText(tx).width+16;ctx.fillStyle='rgba(255,255,255,.95)';rrect(LW*0.2-w/2,fl-196,w,22,9);ctx.fill();txt(tx,LW*0.2,fl-180,13,700,'#222');}
 const ex=lerp(LW*0.86,LW*0.56,clamp((t-0.5)/1.6,0,1)),k=G.loseK||'trup';drawEnemyKey(k,ex,fl,k==='palac'?260:k==='boss'?230:150,{nocache:true,t:T,walk:t<2.1,eat:t>=2.1,shield:400,helm:350,hp:1,sp:0.22});
 const c=ease((t-2.4)/1.0),cw=LW/2*c;
 for(const side of [0,1]){ctx.save();if(side)ctx.translate(LW,0),ctx.scale(-1,1);const g2=ctx.createLinearGradient(0,0,cw,0);g2.addColorStop(0,'#7a0e12');g2.addColorStop(1,'#b81c22');ctx.fillStyle=g2;ctx.fillRect(0,0,cw,LH);for(let x=10;x<cw;x+=22)line(x,0,x,LH,6,'rgba(0,0,0,.18)');fr('#d4a830',cw-4,0,4,LH);ctx.restore();}
 fr('#8a1016',0,0,LW,34);for(let x=0;x<LW;x+=30){ctx.fillStyle='#8a1016';ctx.beginPath();ctx.arc(x+15,34,15,0,Math.PI);ctx.fill();}fr('#d4a830',0,30,LW,4);
 if(t<0.4){ctx.fillStyle='rgba(0,0,0,'+(1-t/0.4)+')';ctx.fillRect(0,0,LW,LH);}
}
function drawEvilEnd(won){
 if(won){const lt=T-(G.loseT||0);if(lt<3.7){drawLoseScene(lt);return;}drawLoseScene(3.7);
  const p=panel(Math.min(460,LW-40),250);txt('Chołota w chałupie!',LW/2,p.y+50,26,900,'#7a1fb3');
  for(let j=0;j<3;j++)txt('★',LW/2-34+j*34,p.y+86,30,900,j<(G.stars||1)?'#e8a81a':'#cdbf9a','center',['#5a3a1e',2]);
  txt('Zostało do świtu: '+Math.max(0,Math.ceil(G.dawn-G.t))+' s',LW/2,p.y+106,11,700,'#5a3a1e');txt('Zdzichu chowa flaszkę pod łóżko. Na wszelki wypadek.',LW/2,p.y+124,13,500,'#2a1608');
  const nx=Math.min(CAMP-1,G.li+1);button(LW/2-110,p.y+136,220,42,G.li<CAMP-1?'Następna noc':'Jeszcze raz',()=>G.li<CAMP-1?startLevel(nx):newGame(G.li,G.load));
  button(LW/2-110,p.y+188,220,40,'Wybór nocy',()=>{scene='levels';},{size:14,bg:'#cdb48a'});}
 else{const p=panel(Math.min(460,LW-40),230);txt('Świt! Kogut zapiał.',LW/2,p.y+52,26,900,'#b3261e');
  txt('Chołota wraca do grobów, a Zdzichu idzie doić krowę.',LW/2,p.y+84,13,500,'#2a1608');txt('Wskazówka: skup się na jednym rzędzie.',LW/2,p.y+104,12,700,'#7a5a2a');
  button(LW/2-110,p.y+122,220,42,'Jeszcze raz',()=>newGame(G.li,G.load));button(LW/2-110,p.y+174,220,40,'Wybór nocy',()=>{scene='levels';},{size:14,bg:'#cdb48a'});}
}
function drawEnd(won){
 if(G.evil){drawEvilEnd(won);return;}
 if(!won){const lt=T-(G.loseT||0);if(lt<3.7){drawLoseScene(lt);return;}drawLoseScene(3.7);}
 const p=panel(Math.min(460,LW-40),250);
 if(won){
  txt('Chołota przegoniona!',LW/2,p.y+52,26,900,'#2d6a1f');
  if(!G.endless){const st=G.stars||1;for(let j=0;j<3;j++)txt('★',LW/2-34+j*34,p.y+86,30,900,j<st?'#e8a81a':'#cdbf9a','center',['#5a3a1e',2]);ctx.font=F(10,700);txt((G.ursUsed?'✗':'✓')+' bez Ursusa    '+(G.lost===0?'✓':'✗')+' bez straty sprzętu',LW/2,p.y+104,10,700,'#5a3a1e');}
  else txt('Pogonionych: '+G.kills,LW/2,p.y+82,14,700,'#5a3a1e');
  txt(G.li===CAMP-1?'Pałac obalony. Odblokowano Noc bez końca.':'Zdzichu otwiera flaszkę i idzie spać.',LW/2,p.y+122,13,500,'#2a1608');
  const nx=Math.min(CAMP,G.li+1);
  button(LW/2-110,p.y+136,220,42,G.li<CAMP-1?'Następna noc':'Noc bez końca',()=>startLevel(nx));
  button(LW/2-110,p.y+188,220,40,'Wybór nocy',()=>{scene='levels';},{size:14,bg:'#cdb48a'});
 }else{

  txt('Chołota weszła do chałupy!',LW/2,p.y+52,24,900,'#b3261e');
  txt(G.endless?'Przetrwane fale: '+Math.max(0,G.wave-1)+'   Rekord: '+save.best:'Ursus już raz pojechał w tym rzędzie.',LW/2,p.y+84,14,700,'#5a3a1e');
  txt('Zdzichu mruczy coś o gminie i zaczyna od nowa.',LW/2,p.y+108,14,500,'#2a1608');
  button(LW/2-110,p.y+130,220,42,'Jeszcze raz',()=>newGame(G.li,G.load));
  button(LW/2-110,p.y+184,220,40,'Wybór nocy',()=>{scene='levels';},{size:14,bg:'#cdb48a'});
 }
}
function zdzX(t){return t<3?lerp(-1.3,4.9,t/3):lerp(4.9,-1.3,(t-3.2)/3);}
const SEAT={hip:-30,lean:0.12,tilt:-0.05,legs:[{th:1.35,kn:1.45,fp:0},{th:1.25,kn:1.4,fp:0}],arms:[{sh:1.15,el:0.45},{sh:1.05,el:0.55}]};
function drawGrave(cx,by,sz,t){
 const u=sz/60;ctx.save();ctx.translate(cx,by);ctx.scale(u,u);const pw=OLW;OLW=clamp(1.6/u,0.9,4);
 ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,0,24,4,0,0,7);ctx.fill();
 ctx.beginPath();ctx.ellipse(0,-4,22,9,0,Math.PI,0);ctx.closePath();fs('#4a3622');ctx.fillStyle='#5e4630';for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(-14+i*7,-6-(i%2)*3,1.6,0,7);ctx.fill();}
 ctx.save();ctx.translate(-4,-8);ctx.rotate(-0.12);Pth([[-2,0],[2,0],[2,-34],[-2,-34]]);fs('#7a5634');Pth([[-11,-26],[11,-26],[11,-21],[-11,-21]]);fs('#7a5634');ctx.restore();
 const fl=0.6+0.4*Math.sin(t*9);const g=ctx.createRadialGradient(13,-12,1,13,-12,14);g.addColorStop(0,'rgba(255,80,40,'+(0.45*fl)+')');g.addColorStop(1,'rgba(255,80,40,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(13,-12,14,0,7);ctx.fill();
 Pth([[9,-4],[17,-4],[16,-16],[10,-16]]);fs('#c42a20');Pth([[10,-16],[16,-16],[13,-20]]);fs('#8a1a14');ctx.fillStyle='#ffd25a';ctx.beginPath();ctx.ellipse(13,-11,1.4,2.6+fl,0,0,7);ctx.fill();
 OLW=pw;ctx.restore();
}
function soulIcon(x,y,s,glow){
 ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 if(glow){const g=ctx.createRadialGradient(0,-4,2,0,-4,20);g.addColorStop(0,'rgba(170,240,255,.55)');g.addColorStop(1,'rgba(170,240,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,-4,20,0,7);ctx.fill();}
 const w=Math.sin(T*6)*1.2;ctx.beginPath();ctx.moveTo(-8,8);ctx.lineTo(-8,-6);ctx.arc(0,-6,8,Math.PI,0);ctx.lineTo(8,8);ctx.lineTo(5,6+w);ctx.lineTo(2.6,8);ctx.lineTo(0,6-w);ctx.lineTo(-2.6,8);ctx.lineTo(-5,6+w);ctx.closePath();
 ctx.fillStyle='rgba(235,250,255,.95)';ctx.fill();ctx.strokeStyle='#2a3a4a';ctx.lineWidth=1.3;ctx.stroke();
 ctx.fillStyle='#1a2430';ctx.beginPath();ctx.ellipse(-3,-6,1.6,2.2,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(3,-6,1.6,2.2,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(0,-0.5,1.6,1.2,0,0,7);ctx.fill();
 ctx.restore();
}
function cardIcon(k,cx,by,size){
 if(k==='grob'){drawGrave(cx,by,size*0.95,T);return;}
 if(UNIT[k]&&EN[k]){const hh=k==='palac'?size*0.62:k==='boss'?size*0.92:k==='nysa'?size*0.6:k==='barszcz'?size*0.8:k==='krowa'?size*0.75:size*0.9;drawEnemyKey(k,cx,by,hh,{t:0,walk:false,shield:400,helm:350,hp:1});return;}
 drawDef(k,cx,by,size,null,T);
}
function parkedUrsus(x,y,s){const sc=s/64,bw=110*sc,bh=112*sc,ax=bw/2,ay=100*sc;const c=sprite('U|parked|'+Math.round(s*2)/2,bw,bh,ax,ay,()=>ursus(0,0,s,0,false));ctx.drawImage(c,x-ax,y-ay,bw,bh);}
/* ikony znajdziek i groby z bufora */
function iconC(kind,x,y,s){const f=kind==='soul'?((Math.floor(T*6)%4)+4)%4:0,bw=46*s,bh=50*s,ax=bw/2,ay=bh*0.62;
 const c=sprite('I|'+kind+'|'+s+'|'+f,bw,bh,ax,ay,()=>{if(kind==='soul'){const old=T;T=f/6;soulIcon(0,0,s,true);T=old;}else bottleIcon(0,0,s,true);});ctx.drawImage(c,x-ax,y-ay,bw,bh);}
/* grób po trupie: kopiec ze zniczem; przed wstaniem trzęsie się i wystaje ręka, po wstaniu rozkopany */
function drawTomb(q){const x=PX(q.c+0.5),y=FY(q.r)+3,sz=Math.min(L.cellW,L.rowH)*0.85,warn=!q.rose&&q.t<5;
 ctx.save();if(warn)ctx.translate(Math.sin(T*40)*1.2*(1-q.t/5),0);graveC(x,y,sz,T+q.c*0.37);ctx.restore();
 const u=sz/60;
 if(q.rose){ctx.fillStyle='#1e140c';ctx.beginPath();ctx.ellipse(x-2*u,y-4*u,12*u,4*u,0,0,7);ctx.fill();}
 else if(warn){const k=1-q.t/5,hy=y-4*u-k*10*u;ctx.fillStyle='#9fc07e';ctx.strokeStyle=OL;ctx.lineWidth=1;
  ctx.beginPath();ctx.ellipse(x+6*u,hy,3*u,4*u,0,0,7);ctx.fill();ctx.stroke();for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x+(4+i*2)*u,hy-3*u);ctx.lineTo(x+(4+i*2)*u+Math.sin(T*12+i)*u,hy-7*u);ctx.lineWidth=1.6*u;ctx.strokeStyle='#9fc07e';ctx.stroke();}}
}
function graveC(x,y,sz,t){const f=((Math.floor(t*6)%6)+6)%6,q=Math.round(sz*2)/2,bw=q*1.1,bh=q*0.95,ax=bw/2,ay=bh*0.85;
 const c=sprite('G|'+q+'|'+f,bw,bh,ax,ay,()=>drawGrave(0,0,q,f/6));ctx.drawImage(c,x-ax,y-ay,bw,bh);}
function drawUrsusRow(r){
 const u=G.urs[r];if(u.st==='used')return;const s=L.rowH*0.78,sc=s/64;
 if(u.st==='go')ursus(PX(u.x),FY(r)-2,s,T,true);else parkedUrsus(PX(u.x),FY(r)-2,s);
 if(u.st==='arm'){const k=1-u.armT/0.7;drawHuman('dziad',PX(lerp(-0.98,-0.62,k)),EY(r),L.rowH*0.62,{t:T,flip:true,pose:walkPose(T,14,0.5,0.15)});}
 else if(u.st==='go'){drawHuman('dziad',PX(u.x)-14*sc,FY(r)-2-30*sc,L.rowH*0.6,{t:T,flip:true,pose:SEAT});}
}
function drawPlay(){
 const live=scene==='play'&&!G.modal.length&&!paused;
 const th=THEMES[G.lv.theme];
 ctx.save();
 if(G.shake>0)ctx.translate(rr(-3,3)*G.shake*4,rr(-3,3)*G.shake*4);
 drawField(th);
 if(G.sel&&live&&G.evil){for(let r=0;r<5;r++){if(G.sel==='grob'){for(const c of [7,8])if(!G.graves.some(q=>q.r===r&&q.c===c)){ctx.fillStyle='rgba(170,220,255,.16)';ctx.fillRect(PX(c)+2,RY(r)+2,L.cellW-4,L.rowH-4);}}else if(G.sel==='lopata'){for(const q of G.graves)if(q.r===r){ctx.fillStyle='rgba(255,120,90,.2)';ctx.fillRect(PX(q.c)+2,RY(r)+2,L.cellW-4,L.rowH-4);}}else{ctx.fillStyle='rgba(200,170,255,.12)';ctx.fillRect(PX(7)+2,RY(r)+2,L.cellW*2-4,L.rowH-4);}}}
 if(G.sel&&live&&!G.evil){for(let r=0;r<5;r++)for(let c=0;c<9;c++){const occ=G.grid[r][c]||tombAt(r,c);if(G.sel==='lopata'?occ:!occ){ctx.fillStyle=G.sel==='lopata'?'rgba(255,120,90,.18)':'rgba(255,240,150,.13)';ctx.fillRect(PX(c)+2,RY(r)+2,L.cellW-4,L.rowH-4);}}}
 for(let r=0;r<5;r++)drawUrsusRow(r);
 for(let r=0;r<5;r++){
  if(G.tombs)for(const q of G.tombs)if(q.r===r)drawTomb(q);
  if(G.graves)for(const gr of G.graves)if(gr.r===r)graveC(PX(gr.c+0.5),FY(r)+3,Math.min(L.cellW,L.rowH)*0.85,T+gr.c*0.37);
  for(const d of G.defs)if(d.r===r&&d.def.trap)drawDefOnGrid(d);
  for(const d of G.defs)if(d.r===r&&!d.def.trap)drawDefOnGrid(d);
  const es=G.ens.filter(e=>Math.round(e.y)===r).sort((a,b)=>b.x-a.x);
  for(const e of es)drawEnemy(e);
  if(r===2&&G.intro){const t=G.intro.t,x=zdzX(t),back=t>=3.2;if(t<3||t>=3.2)drawHuman('dziad',PX(x),EY(2),L.rowH*0.86,{t:T,flip:!back,pose:walkPose(T,9,0.45,0.05)});else drawHuman('dziad',PX(x),EY(2),L.rowH*0.86,{t:T,flip:true});
   if(t<2.2){ctx.font=F(11,700);const tx='Na dobry początek!',w=ctx.measureText(tx).width+14,bx=PX(x)-w/2,by=EY(2)-L.rowH*0.95;ctx.fillStyle='rgba(255,255,255,.95)';rrect(bx,by-16,w,19,8);ctx.fill();txt(tx,bx+w/2,by-2.5,11,700,'#222');}}
 }
 for(const p of G.plows)drawDef(p.k||'plug',PX(p.x),FY(p.r)+3,Math.min(L.cellW*0.92,L.rowH*0.95),{},T);
 drawProj();drawFx();
 for(const e of G.ens)if(e.bub)drawBubble(e);
 drawPicks();
 ctx.restore();
 drawTop(live);
 const boss=G.ens.find(e=>e.d.boss&&!e.dead);
 if(boss){const w=Math.min(300,LW*0.4),x=(LW-w)/2,y=LH-30;ctx.fillStyle='rgba(0,0,0,.55)';rrect(x-4,y-2,w+8,24,6);ctx.fill();fr('#3a1a1a',x,y+12,w,7);fr('#c9a03a',x,y+12,w*clamp(boss.hp/boss.mx,0,1),7);txt(boss.d.name,LW/2,y+10,10,900,'#ffd66a');}
 if(G.banner){const a=clamp(G.banner.t/0.4,0,1),sc=1+Math.max(0,G.banner.t-2.2)*0.8;ctx.save();ctx.globalAlpha=a;ctx.translate(LW/2,LH*0.52);ctx.scale(sc,sc);txt(G.banner.tx,0,0,34,900,'#ffd66a','center',['#3a0a06',7]);ctx.restore();}
 if(G.toast){ctx.font=F(13,700);const w=ctx.measureText(G.toast.tx).width+24;ctx.globalAlpha=clamp(G.toast.t/0.3,0,1);ctx.fillStyle='rgba(20,12,4,.85)';rrect(LW/2-w/2,LH-42,w,28,14);ctx.fill();txt(G.toast.tx,LW/2,LH-23,13,700,'#f4e7c9');ctx.globalAlpha=1;}
 if(G.sel&&live){const nm=infoOf(G.sel).name;txt(G.evil?(G.sel==='lopata'?'Dotknij grobu, żeby go zdjąć':G.sel==='grob'?'Postaw grób w jednej z dwóch ostatnich kolumn':'Dotknij rzędu, żeby wysłać: '+nm):G.sel==='lopata'?'Dotknij sprzętu, żeby go zdjąć':'Dotknij pola: '+nm,PX(4.5),LH-10,12,700,'#fff8dc','center',['rgba(0,0,0,.7)',3]);}
 if(PRESS&&T-PRESS.t>0.35&&scene==='play'&&!G.modal.length){const d=infoOf(PRESS.k),w=Math.min(420,LW-40),bx=clamp(PRESS.x-w/2,10,LW-w-10),by=L.top+8;ctx.font=F(12,500);const lines=wrap(d.desc,w-20).slice(0,4),hh=34+lines.length*16;
  ctx.fillStyle='rgba(20,12,4,.92)';rrect(bx,by,w,hh,10);ctx.fill();ctx.strokeStyle='#c9a24a';ctx.lineWidth=2;ctx.stroke();txt(d.name+(costOf(PRESS.k)?'  ·  '+costOf(PRESS.k)+(G.evil?' duszyczek':' l'):''),bx+10,by+20,14,900,'#ffd66a','left');let yy=by+38;for(const ln of lines){txt(ln,bx+10,yy,12,500,'#f4e7c9','left');yy+=16;}}
 if(G.modal.length&&scene==='play')drawModal(G.modal[0]);
 else if(paused&&scene==='play')drawPause();
}
let titleCrowd=['trup','milicjant','lenin','wampir','urzednik','swinia','mumia','komunista'];
function drawTitle(){
 const g=ctx.createLinearGradient(0,0,0,LH*0.7);g.addColorStop(0,'#0d1630');g.addColorStop(1,'#4a2a48');ctx.fillStyle=g;ctx.fillRect(0,0,LW,LH);
 for(let i=0;i<40;i++){const sx=(i*137.5)%LW,sy=(i*71.3)%(LH*0.55);ctx.fillStyle='rgba(255,255,230,'+(0.3+0.3*Math.sin(T*2+i))+')';circ(sx,sy,1);}
 const mg=ctx.createRadialGradient(LW*0.86,70,6,LW*0.86,70,70);mg.addColorStop(0,'rgba(255,250,210,.45)');mg.addColorStop(1,'rgba(255,250,210,0)');ctx.fillStyle=mg;circ(LW*0.86,70,70);ctx.fillStyle='#f4f1d0';circ(LW*0.86,70,22);
 ctx.fillStyle='#2e4a2a';ctx.beginPath();ctx.moveTo(0,LH*0.7);for(let x=0;x<=LW;x+=40)ctx.lineTo(x,LH*0.66+Math.sin(x*0.013)*12);ctx.lineTo(LW,LH);ctx.lineTo(0,LH);ctx.fill();
 ctx.fillStyle='#3f6a35';ctx.fillRect(0,LH*0.8,LW,LH*0.2);
 for(let x=0;x<LW;x+=14)fr('#5a4020',x,LH*0.74,5,LH*0.07);line(0,LH*0.76,LW,LH*0.76,2,'#5a4020');
 titleCrowd.forEach((k,i)=>{const span=LW*0.62;const x=LW+40-((T*16+i*span/titleCrowd.length)%span);drawEnemyKey(k,x,LH*0.94,96,{t:T+i,walk:true,shield:400,helm:0,hp:1,sp:0.18});});
 dziad(LW*0.19,LH*0.95,LH*0.52,T);
 const cx=LW*0.58;
 txt('EGZORCYSTA',cx,96,Math.min(58,LW*0.07),900,'#ffcf4a','center',['#2a1608',8]);
 txt('vs',cx,134,26,900,'#f4e7c9','center',['#2a1608',6]);
 txt('CHOŁOTA',cx,196,Math.min(70,LW*0.085),900,'#e0412e','center',['#2a1608',9]);
 txt('Obrona zagrody przed wszystkim, co nadciąga zza miedzy',cx,228,14,700,'#f4e7c9','center',['rgba(0,0,0,.6)',3]);
 button(cx-196,248,186,50,'Tryb egzorcysty',()=>{goFull();MODE='good';scene='levels';},{size:17});
 button(cx+10,248,186,50,'Tryb chołoty',()=>{goFull();MODE='evil';scene='levels';},{size:17,bg:'#b89ae0'});
 button(cx-70,308,140,36,'Almanach',()=>openAlm('title'),{size:14,bg:'#cdb48a'});
 button(LW-122,54,108,34,'Grafika: '+styleName(),()=>nextGameStyle(),{size:11,bg:'#cdb48a'});
 const on=save.mus||save.sfx;button(LW-122,14,108,34,on?'Dźwięk: tak':'Dźwięk: nie',()=>{const v=!(save.mus||save.sfx);save.mus=v;save.sfx=v;applyVol();persist();if(v)musicStart();else musicStop();},{size:12,on});
}
function drawLevels(){
 const g=ctx.createLinearGradient(0,0,0,LH);g.addColorStop(0,'#5a3a1e');g.addColorStop(1,'#2a1a0c');ctx.fillStyle=g;ctx.fillRect(0,0,LW,LH);
 for(let y=20;y<LH;y+=22)line(0,y,LW,y,1,'rgba(0,0,0,.2)');
 const EV=MODE==='evil';txt(EV?'Chołota: wybierz noc':'Wybierz noc',LW/2,44,26,900,EV?'#d8b8ff':'#ffd66a','center',['#1a0f06',5]);
 button(14,14,96,34,'‹ Wróć',()=>{scene='title';},{size:14,bg:'#cdb48a'});
 button(LW-124,14,110,34,'Almanach',()=>openAlm('levels'),{size:14,bg:'#cdb48a'});
 button(LW-266,14,136,34,EZ()?'Trudność: łatwa':'Trudność: normalna',()=>{save.diff=EZ()?'normal':'easy';persist();},{size:12,on:EZ()});
 const cols=4,gap=8,w=Math.min(210,(LW-40-gap*3)/4),h=82,x0=(LW-(w*cols+gap*3))/2,y0=60;
 LEVELS.forEach((lv,i)=>{
  if(EV&&lv.endless)return;
  const x=x0+(i%cols)*(w+gap),y=y0+Math.floor(i/cols)*(h+gap),open=i<(EV?save.evilUnlocked:save.unlocked),th=THEMES[lv.theme];
  ctx.fillStyle='rgba(0,0,0,.4)';rrect(x+3,y+5,w,h,10);ctx.fill();
  ctx.fillStyle=open?th.g2:'#4a4038';rrect(x,y,w,h,10);ctx.fill();
  if(open&&th.dark){ctx.fillStyle='rgba('+th.tint+','+th.dark+')';rrect(x,y,w,h,10);ctx.fill();}
  ctx.lineWidth=3;ctx.strokeStyle='#2a1608';rrect(x,y,w,h,10);ctx.stroke();
  txt(lv.endless?'∞':String(i+1),x+20,y+32,22,900,open?'#ffd66a':'#8a7a6a','center',['#1a0f06',5]);
  ctx.font=F(13,900);let ty=y+24;for(const ln of wrap(lv.name,w-50).slice(0,2)){txt(ln,x+42,ty,13,900,open?'#fff8dc':'#a89a8a','left',['rgba(0,0,0,.5)',3]);ty+=16;}
  if(open){
   const nd=EV?lv.newEn.filter(k=>UNIT[k]):lv.intro.filter(k=>k!=='lopata'&&k!=='ursus');let ix=x+10;
   for(const k of nd.slice(0,3)){cardIcon(k,ix+11,y+h-6,22);ix+=26;}
   if(lv.endless)txt('Rekord: '+save.best+' fal',x+w-8,y+h-10,11,900,'#ffd66a','right',['rgba(0,0,0,.6)',3]);
   else{const st=(EV?save.evilStars:save.stars)[i]||0;for(let j=0;j<3;j++)txt('★',x+w-38+j*13,y+h-8,14,900,j<st?'#ffd66a':'rgba(0,0,0,.35)','center',['rgba(0,0,0,.5)',2]);}
   btns.push({x,y,w,h,cb:()=>startLevel(i)});}
  else{ctx.fillStyle='#8a7a6a';rrect(x+w/2-9,y+50,18,14,3);ctx.fill();ctx.strokeStyle='#8a7a6a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x+w/2,y+50,5,Math.PI,0);ctx.stroke();}
 });
 txt('Zbieraj butelki samogonu dotykiem. Przytrzymaj kartę sprzętu, żeby zobaczyć, co robi.',LW/2,LH-12,12,500,'#e8d3a0');
}
