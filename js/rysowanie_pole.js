/* ---------- rysowanie: pole ---------- */
function drawField(th){
 const key=G.lv.theme+'|'+LW;
 if(!FIELD||FIELD.key!==key){FIELD={key,c:null};FIELD.c=sprite('F|'+key+'|'+Math.random(),LW,LH,0,0,()=>drawFieldRaw(th));}
 ctx.drawImage(FIELD.c,0,0,LW,LH);
 if(th.flags){for(let r=0;r<5;r+=2){const x=L.x1+14,y=RY(r)+6;line(x,y,x,y+L.rowH*0.7,1.5,'#5a3a1e');ctx.fillStyle='#d42a1e';poly([[x,y],[x+14+Math.sin(T*4+r)*2,y+4],[x,y+9]]);}}
}
function drawFieldRaw(th){
 ctx.fillStyle=th.edge;ctx.fillRect(0,L.top,LW,LH-L.top);
 ctx.fillStyle=th.road;ctx.fillRect(L.x1,L.top,LW-L.x1,LH-L.top);
 for(let r=0;r<5;r++)line(L.x1+4,RY(r)+L.rowH*0.75,LW,RY(r)+L.rowH*0.75,2,'rgba(0,0,0,.12)');
 for(let r=0;r<5;r++)for(let c=0;c<9;c++){ctx.fillStyle=((r+c)%2)?th.g1:th.g2;ctx.fillRect(PX(c),RY(r),L.cellW+0.5,L.rowH+0.5);}
 for(const d of G.deco){const x=PX(d.x),y=RY(d.r)+d.dy*L.rowH;if(d.k===0){ctx.fillStyle='#f6f0c8';circ(x,y,1.6);ctx.fillStyle='#f3c63a';circ(x,y,0.7);}else{line(x,y,x-2,y-5,1,'rgba(30,60,20,.45)');line(x,y,x+2,y-5,1,'rgba(30,60,20,.45)');}}
 ctx.fillStyle='#7d5f38';ctx.fillRect(0,L.top,L.x0,LH-L.top);
 ctx.fillStyle='#6a4424';ctx.fillRect(0,L.top,16,LH-L.top);
 for(let y=L.top+10;y<LH;y+=12)line(0,y,16,y,1,'#4a2e16');
 const wy=RY(2)+8;fr('#2a1a0c',2,wy,12,18);ctx.fillStyle='#e2b48e';circ(8,wy+10,4);ctx.fillStyle='#d8d8d0';ell(8,wy+14,4,3);fr('#3a3632',3,wy+4,10,3);line(2,wy+9,14,wy+9,1,'#6a4424');
 for(let y=L.top+4;y<LH-4;y+=9){fr('#9a7a4a',L.x0-7,y,4,7);}line(L.x0-5,L.top+2,L.x0-5,LH-2,1,'#5a4020');
 if(th.dark){ctx.fillStyle='rgba('+th.tint+','+th.dark+')';ctx.fillRect(0,L.top,LW,LH-L.top);}
 if(th.moon){const g=ctx.createRadialGradient(LW-30,L.top+26,4,LW-30,L.top+26,40);g.addColorStop(0,'rgba(255,250,210,.5)');g.addColorStop(1,'rgba(255,250,210,0)');ctx.fillStyle=g;circ(LW-30,L.top+26,40);ctx.fillStyle='#f4f1d0';circ(LW-30,L.top+26,12);}
}
function drawDefOnGrid(d){
 const cx=PX(d.c+0.5),by=FY(d.r)+3,sz=Math.min(L.cellW*0.92,L.rowH*0.95);
 drawDef(d.k,cx,by,sz,d,T);
 if(!d.def.trap&&d.k!=='flaszka'&&d.hp<d.max){const w=sz*0.6;fr('rgba(0,0,0,.5)',cx-w/2,by-sz*0.98,w,4);fr(d.hp/d.max>0.4?'#7ad04a':'#e0412e',cx-w/2,by-sz*0.98,w*clamp(d.hp/d.max,0,1),4);}
 if(d.stamp>0){ctx.save();ctx.translate(cx,by-sz*0.45);ctx.rotate(-0.25);ctx.globalAlpha=0.9;ctx.strokeStyle='#d0201a';ctx.lineWidth=2;rrect(-L.cellW*0.44,-9,L.cellW*0.88,18,3);ctx.stroke();txt('ZAMKNIĘTE',0,4,Math.min(11,L.cellW*0.16),900,'#d0201a');ctx.restore();}
 if(d.k==='aparatura'&&!d.armed){const f=1-d.armT/DEF.aparatura.arm;ctx.strokeStyle='#ffcf4a';ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(cx,by-sz*0.7,6,-Math.PI/2,-Math.PI/2+f*Math.PI*2);ctx.stroke();}
 if(d.k==='lancuch'&&d.reload>0){const f=1-d.reload/d.def.reload;ctx.strokeStyle='#d8dde2';ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(cx,by-sz*0.5,6,-Math.PI/2,-Math.PI/2+f*Math.PI*2);ctx.stroke();}
}
/* wysokość wroga w rzędach (gra i przegląd postaci) */
const enemyHR=k=>k==='palac'?2.7:EN[k].boss?1.7:EN[k].small?0.52:0.88;
function enemyH(e){return L.rowH*enemyHR(e.k);}
const EY=r=>L.top+(r+0.94)*L.rowH;
function drawEnemy(e){
 const x=PX(e.x);let y=EY(e.y);
 if(e.jump>0){const p=1-e.jump/0.6;y-=Math.sin(p*Math.PI)*L.rowH*0.9;}
 const h=enemyH(e);
 const sway=e.drunk>0;if(sway){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(T*3+e.anim)*0.16);ctx.translate(-x,-y);}
 drawEnemyKey(e.k,x,y,h,{t:e.anim,walk:!e.eating&&e.stun<=0&&e.jump<=0,eat:!!e.eating,shield:e.shield,helm:e.helm,hp:e.hp/e.mx,talk:!!e.bub,sp:e.sp});
 if(sway)ctx.restore();
 if(e.soap>0){ctx.fillStyle='rgba(190,230,120,.85)';for(let i=0;i<4;i++){const a=e.anim*2+i*1.6;circ(x+Math.cos(a)*h*0.2,y-h*0.5+Math.sin(a*1.3)*h*0.3,2+i%2);}}
 if(e.flash>0){ctx.fillStyle='rgba(255,255,255,.4)';const wide=e.k==='nysa'||e.k==='swinia'||e.k==='krowa';ell(x,y-h*(wide?0.3:0.42),h*(wide?0.5:0.2),h*(wide?0.3:0.4));}
 if(e.zap>0&&Math.sin(T*40)>0){ctx.strokeStyle='#bfe9ff';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-8,y-h*0.2);ctx.lineTo(x-2,y-h*0.35);ctx.lineTo(x-5,y-h*0.4);ctx.lineTo(x+4,y-h*0.6);ctx.stroke();}
 if(e.stun>0&&e.queue){const qy=Math.max(RY(e.row)+8,y-h-2);ctx.save();ctx.translate(x+4,qy);ctx.rotate(Math.sin(T*3)*0.15);ctx.fillStyle='#f4ecd0';ctx.fillRect(-8,-6,16,11);ctx.strokeStyle=OL;ctx.lineWidth=1;ctx.strokeRect(-8,-6,16,11);ctx.fillStyle='#c42a20';ctx.fillRect(-6,-3.6,12,2);ctx.fillStyle='#555';ctx.fillRect(-6,0,8,1.2);ctx.restore();}
 else if(e.stun>0){ctx.strokeStyle='#b8bec4';ctx.lineWidth=2.4;ctx.beginPath();ctx.ellipse(x,y-h*0.2,h*0.2,h*0.07,0,0,7);ctx.stroke();for(let i=0;i<3;i++){const a=T*4+i*2.1;ctx.fillStyle='#ffe14d';circ(x+Math.cos(a)*h*0.15,y-h*1.02+Math.sin(a)*3,2.2);}}
 if(!e.d.boss&&e.hp<e.mx){const w=h*0.4,hy=Math.max(RY(e.row)+2,y-h);fr('rgba(0,0,0,.5)',x-w/2,hy,w,3);fr('#e0412e',x-w/2,hy,w*clamp(e.hp/e.mx,0,1),3);}
}
function drawBubble(e){
 const x=PX(e.x),y=Math.max(L.top+20,EY(e.y)-enemyH(e)-6);ctx.font=F(10,700);const w=ctx.measureText(e.bub.tx).width+12;const bx=clamp(x-w/2,4,LW-w-4);
 ctx.fillStyle='rgba(255,255,255,.95)';rrect(bx,y-16,w,18,7);ctx.fill();poly([[x-4,y+1],[x+3,y+1],[x,y+7]]);txt(e.bub.tx,bx+w/2,y-3.5,10,700,'#222');
}
function drawProj(){
 for(const p of G.proj){
  {let x,y,rot;if(p.k==='boot'||p.k==='soap'){x=PX(p.x);y=FY(p.r)-L.rowH*0.42;rot=p.rot;}   // styl gry może narysować pocisk po swojemu
   else{const k=p.t/p.T;x=PX(lerp(p.x0,p.x1,k));y=FY(p.r)-L.rowH*0.45-Math.sin(k*Math.PI)*L.rowH*(p.k==='ball'?1.5:0.9);rot=k*(p.k==='holy'?8:9);}
   if(styleProj(p.k,x,y,rot,p.v))continue;}
  if(p.k==='boot')boot(PX(p.x),FY(p.r)-L.rowH*0.42,L.rowH/70,p.rot);
  else if(p.k==='soap'){const x=PX(p.x),y=FY(p.r)-L.rowH*0.42,sc=L.rowH/74;ctx.save();ctx.translate(x,y);ctx.rotate(p.rot);ctx.scale(sc,sc);ctx.fillStyle='rgba(215,240,230,.92)';rrect(-5,-6,10,12,3);ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=1.4;ctx.stroke();ctx.fillStyle='#6a9a2a';ctx.fillRect(-3.4,-3,2.2,7);ctx.fillRect(0.6,-4,2.2,8);fr('#c9a24a',-5.4,-8.4,10.8,3);ctx.restore();}
  else{const k=p.t/p.T,x=PX(lerp(p.x0,p.x1,k)),y=FY(p.r)-L.rowH*0.45-Math.sin(k*Math.PI)*L.rowH*(p.k==='ball'?1.5:0.9);
   if(p.k==='ball'){ctx.fillStyle='#1b1b1b';circ(x,y,5.5);ctx.fillStyle='rgba(255,255,255,.4)';circ(x-1.8,y-1.8,1.6);continue;}
   if(p.k==='holy'){ctx.save();ctx.translate(x,y);ctx.rotate(k*8);ctx.fillStyle='rgba(120,180,255,.95)';rrect(-3.5,-7,7,13,2.5);ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=1.3;ctx.stroke();fr('#fff',-0.6,-4,1.2,6);fr('#fff',-2,-2,4,1.2);ctx.restore();}
   else if(p.v===0){ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.fillStyle='#7cc24a';ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=1.4;ctx.stroke();line(x-4,y-2,x+3,y+3,0.8,'#4f8a2a');}
   else if(p.v===1){ctx.beginPath();ctx.ellipse(x,y,6,4.4,0,0,7);ctx.fillStyle='#c9a066';ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=1.3;ctx.stroke();ctx.fillStyle='#8a6a3a';circ(x-2,y-1,0.9);}
   else{ctx.save();ctx.translate(x,y);ctx.rotate(k*9);fr('#f1ead8',-6,-1.5,12,3);ctx.fillStyle='#f1ead8';circ(-6,-1.5,2);circ(-6,1.5,2);circ(6,-1.5,2);circ(6,1.5,2);ctx.restore();}
  }
 }
}
function drawFx(){
 for(const f of G.fx){
  const a=1-f.t/f.T;ctx.globalAlpha=clamp(a,0,1);
  if(f.k==='p'){ctx.fillStyle=f.c;ctx.fillRect(f.x-f.sz/2,f.y-f.sz/2,f.sz,f.sz);}
  else if(f.k==='puff'){ctx.globalAlpha=a*0.7;ctx.fillStyle='rgb('+(f.c||'200,200,200')+')';circ(f.x,f.y-(1-a)*8,f.r*(0.4+0.8*(1-a)));}
  else if(f.k==='boom'){const r=f.r*(0.4+0.9*(1-a));const g=ctx.createRadialGradient(f.x,f.y,1,f.x,f.y,r);g.addColorStop(0,'rgba(255,250,200,1)');g.addColorStop(0.4,'rgba(255,170,40,.95)');g.addColorStop(1,'rgba(200,40,0,0)');ctx.fillStyle=g;circ(f.x,f.y,r);}
  else if(f.k==='ring'){const k=1-a;ctx.strokeStyle='rgb('+f.c+')';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(f.x,f.y,Math.max(1,f.r*k),Math.max(1,f.r*0.55*k),0,0,7);ctx.stroke();}
  else if(f.k==='steam'){ctx.globalAlpha=a*0.8;ctx.strokeStyle='#f0f6ff';ctx.lineWidth=5;ctx.beginPath();for(let i=0;i<=12;i++){const xx=lerp(f.x1,f.x2,i/12),yy=f.y+Math.sin(i*1.3+T*20)*3;if(i)ctx.lineTo(xx,yy);else ctx.moveTo(xx,yy);}ctx.stroke();ctx.fillStyle='#fff';for(let i=0;i<5;i++)circ(lerp(f.x1,f.x2,(i+0.5)/5),f.y-6-(1-a)*10,4+i*0.6);}
  else if(f.k==='txt'){ctx.globalAlpha=clamp(a*2,0,1);txt(f.tx,f.x,f.y-(1-a)*24,13,900,f.c,'center',['#1a0f06',3]);}
 }
 ctx.globalAlpha=1;
}
function drawPicks(){
 for(const p of G.picks){const bob=p.st==='idle'?Math.sin(T*4+p.x)*1.5:0;const blink=p.st==='idle'&&p.life<2.5&&Math.sin(T*18)>0;if(!blink){if(p.soul)iconC('soul',p.x,p.y+bob,1.05);else iconC('bottle',p.x,p.y+bob,1.15);}}
}

