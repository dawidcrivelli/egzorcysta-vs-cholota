/* ---------- logika ---------- */
function enemyAhead(r,c){let b=null;for(const e of G.ens){if(e.dead||e.row!==r)continue;if(e.x>c+0.3&&e.x<9.25&&(!b||e.x<b.x))b=e;}return b;}
function blocker(e){for(let c=8;c>=0;c--){const d=G.grid[e.row][c];if(!d||d.dead)continue;if(d.def.trap||d.k==='flaszka'||(d.k==='aparatura'&&d.armed))continue;if(e.x>c+0.35&&e.x<=c+1.15)return d;}return null;}

function update(dt){
 const g=G;g.t+=dt;
 if(g.intro&&!DEMO){const I=g.intro;I.t+=dt;const x=zdzX(I.t);
  while(I.done<I.drop.length&&x>=I.drop[I.done]){const c=I.drop[I.done];g.picks.push({x:PX(c),y:EY(2)-L.rowH*0.45,gy:EY(2)-L.rowH*0.12,vy:-60,vx:0,val:50,life:6,st:'pop'});sfx('pickup');I.done++;}
  if(I.t>6.2)g.intro=null;}
 if(g.banner){g.banner.t-=dt;if(g.banner.t<=0)g.banner=null;}
 if(g.toast){g.toast.t-=dt;if(g.toast.t<=0)g.toast=null;}
 if(g.shake>0)g.shake-=dt;
 if(g.endless){if(g.t>=g.nextWave){g.wave++;launchWave(endlessWave(g.wave),false);g.nextWave=g.t+Math.max(13,24-g.wave*0.5);}}
 else while(g.wi<g.waves.length&&g.t>=g.waves[g.wi].t){launchWave(g.waves[g.wi],g.wi===g.waves.length-1);g.wi++;}
 for(let i=g.sq.length-1;i>=0;i--)if(g.t>=g.sq[i].at){const k=g.sq[i].k;g.sq.splice(i,1);spawn(k);}
 g.sky-=dt;if(g.sky<=0){g.sky=rr(8,11);g.picks.push({x:rr(PX(0.6),PX(8.4)),y:L.top+4,gy:rr(L.top+L.rowH*0.6,LH-30),vy:34,val:25,life:9,st:'fall'});}
 for(const k in g.cd)if(g.cd[k]>0)g.cd[k]=Math.max(0,g.cd[k]-dt);
 if(g.evil&&!DEMO){
  g.botSam+=dt*EVB.botInc*(1+g.li*0.04)*25/Math.max(5,9-g.li*0.25);for(const k in g.bcd)if(g.bcd[k]>0)g.bcd[k]-=dt;
  g.botT-=dt;if(g.botT<=0){g.botT=EVB.react*Math.max(0.6,1.2-g.li*0.03);farmerStep();}
  for(const gr of g.graves){gr.t-=dt;if(gr.t<=0){gr.t=10;g.picks.push({soul:true,x:PX(gr.c+0.5),y:FY(gr.r)-L.rowH*0.55,gy:FY(gr.r)-L.rowH*0.25,vy:-40,vx:rr(-10,10),val:25,life:7,st:'pop'});}}
  if(g.t>=g.dawn&&!g.over){evilLose();return;}
 }
 if(g.ens.some(e=>e.k==='nysa'&&!e.dead))sfx('siren');
 updDefs(dt);updEns(dt);if(g.over)return;updProj(dt);updPicks(dt);updFx(dt);updUrs(dt);updPlows(dt);
 g.ens=g.ens.filter(e=>!e.dead);g.defs=g.defs.filter(d=>!d.dead);
 if(!g.evil&&!g.endless&&g.wi>=g.waves.length&&g.sq.length===0&&g.ens.length===0&&g.winT<0)g.winT=1.6;
 if(g.winT>0){g.winT-=dt;if(g.winT<=0)win();}
}
function updDefs(dt){
 for(const d of G.defs){
  if(d.dead)continue;
  d.anim+=dt;if(d.kick>0)d.kick-=dt;if(d.hitT>0)d.hitT-=dt;
  if(d.hp<=0){killDef(d);continue;}
  if(d.stamp>0){d.stamp-=dt;continue;}
  const k=d.k,def=d.def,r=d.r,c=d.c;
  if(k==='bimbrownia'){d.t-=dt;if(d.t<=0&&G.evil&&!DEMO){d.t=12;G.botSam+=25;burst(PX(c+0.6),FY(r)-L.rowH*0.4,'#f3d36b',5,50);}else if(d.t<=0){d.t=12;G.picks.push({x:PX(c+0.62),y:FY(r)-L.rowH*0.35,gy:FY(r)-8,vy:-95,vx:rr(-10,25),val:25,life:DEMO?1.4:8,st:'pop'});}}
  else if(k==='gumofilce'||k==='resztki'||k==='woda'||k==='pralka'){
   d.t=Math.max(0,d.t-dt);const tg=enemyAhead(r,c);
   if(tg&&d.t<=0){d.t=def.rate*rr(0.95,1.05);d.kick=0.25;sfx(k==='pralka'?'soap':'throw');
    if(k==='gumofilce')G.proj.push({k:'boot',r,x:c+0.7,sp:4.8,dmg:def.dmg,rot:0});
    else if(k==='pralka')G.proj.push({k:'soap',r,x:c+0.7,sp:4.2,dmg:def.dmg,rot:0});
    else{const TT=0.75,lead=tg.x-(tg.stun>0||tg.eating?0:tg.sp*TT);G.proj.push({k:k==='woda'?'holy':'food',v:rnd(3),r,x0:c+0.6,x1:Math.max(c+0.8,lead),t:0,T:TT,dmg:def.dmg});}
   }
  }
  else if(k==='pila'||k==='kombajn'){const reach=k==='pila'?1.45:2.4;d.rev=false;for(const e of G.ens){if(e.dead||e.row!==r||e.jump>0)continue;if(e.x>c+0.3&&e.x<c+reach){hurt(e,def.dps*dt,'melee');d.rev=true;}}if(d.rev){sfx(k==='pila'?'saw':'harvest');if(Math.random()<dt*14)burst(PX(c+(k==='pila'?0.95:1.3)),FY(r)-L.rowH*0.35,k==='pila'?'#ffd34d':'#d9c070',2,70);}}
  else if(k==='samowar'){d.t=Math.max(0,d.t-dt);let any=false;for(const e of G.ens)if(!e.dead&&e.row===r&&e.x>c+0.3&&e.x<c+3.4){any=true;break;}
   if(any&&d.t<=0){d.t=def.rate;d.kick=0.25;sfx('steam');for(const e of G.ens)if(!e.dead&&e.row===r&&e.x>c+0.3&&e.x<c+3.4)hurt(e,def.dmg,'steam');G.fx.push({k:'steam',x1:PX(c+0.85),x2:PX(c+3.4),y:FY(r)-L.rowH*0.38,t:0,T:0.45});}}
  else if(k==='armata'){d.t=Math.max(0,d.t-dt);let tg=null;for(const e of G.ens){if(e.dead||e.row!==r)continue;if(e.x>c+0.3&&e.x<9.25&&(!tg||e.x>tg.x))tg=e;}
   if(tg&&d.t<=0){d.t=def.rate;d.kick=0.25;sfx('cannon');burst(PX(c+0.9),FY(r)-L.rowH*0.5,'#bbb',8,80);const TT=1.0,lead=tg.x-(tg.stun>0||tg.eating?0:tg.sp*TT);G.proj.push({k:'ball',r,x0:c+0.7,x1:Math.max(c+0.8,lead),t:0,T:TT,dmg:def.dmg});}}
  else if(k==='relikwia'){d.t-=dt;if(d.t<=0){d.t=def.rate;let any=false;for(const e of G.ens){if(e.dead)continue;if(Math.abs(e.row-r)<=1&&Math.abs(e.x-(c+0.5))<=1.55){hurt(e,def.dmg,'holy');any=true;}}if(any)sfx('bell');G.fx.push({k:'ring',x:PX(c+0.5),y:FY(r)-L.rowH*0.3,t:0,T:0.6,r:L.cellW*1.5,c:any?'255,215,80':'255,240,190'});}}
  else if(k==='aparatura'){if(!d.armed){d.armT-=dt;if(d.armT<=0){d.armed=true;sfx('armed');fxText(PX(c+0.5),FY(r)-L.rowH*0.7,'GOTOWA','#ffcf4a');}}else{for(const e of G.ens){if(!e.dead&&e.row===r&&e.jump<=0&&e.x>c+0.05&&e.x<c+1.25){explodeApar(d);break;}}}}
  else if(k==='lancuch'){if(d.reload>0)d.reload-=dt;}
  else if(k==='rozlew'){d.life-=dt;if(d.life<=0)killDef(d,false,'used');}
  else if(k==='flaszka'){d.fuse-=dt;if(d.fuse<=0)flaszkaBoom(d);}
 }
}
function explodeApar(d){
 d.dead=true;G.grid[d.r][d.c]=null;const x=PX(d.c+0.5),y=FY(d.r)-L.rowH*0.3;
 for(const e of G.ens)if(!e.dead&&e.row===d.r&&Math.abs(e.x-(d.c+0.6))<=0.95)hurt(e,DEF.aparatura.dmg,'explode');
 boom(x,y,L.cellW*0.9);burst(x,y,'#7a4a1a',18,170);fxText(x,y-L.rowH*0.5,'BUM!','#ffb43a');G.shake=Math.max(G.shake,0.25);
}
function flaszkaBoom(d){
 d.dead=true;G.grid[d.r][d.c]=null;const x=PX(d.c+0.5),y=FY(d.r)-L.rowH*0.35;
 for(const e of G.ens)if(!e.dead&&Math.abs(e.row-d.r)<=1&&e.x>=d.c-1&&e.x<=d.c+2.05)hurt(e,DEF.flaszka.dmg,'fire');
 for(const p2 of G.defs){if(p2.dead||p2.k!=='rozlew'||Math.abs(p2.r-d.r)>1||Math.abs(p2.c-d.c)>1)continue;for(const e of G.ens)if(!e.dead&&e.row===p2.r&&Math.abs(e.x-(p2.c+0.5))<=1.0)hurt(e,500,'fire');const px2=PX(p2.c+0.5),py2=FY(p2.r)-L.rowH*0.3;killDef(p2,false,'used');G.fx.push({k:'boom',x:px2,y:py2,t:0,T:0.6,r:L.cellW*0.9});fxText(px2,py2-L.rowH*0.5,'PODPALONY!','#ff9a3a');}
 boom(x,y,L.cellW*1.6);burst(x,y,'#ff5a1f',26,220);fxText(x,y-L.rowH*0.6,'OGNIA!','#ffcf4a');G.shake=Math.max(G.shake,0.35);
}
function updEns(dt){
 const lenins=G.ens.filter(e=>!e.dead&&(e.k==='lenin'||e.k==='boss'));
 for(const s2 of G.ens){if(s2.dead||!s2.d.heal)continue;for(const o of G.ens){if(o===s2||o.dead||o.d.boss||Math.abs(o.row-s2.row)>1||Math.abs(o.x-s2.x)>1.6||o.hp>=o.mx)continue;o.hp=Math.min(o.mx,o.hp+s2.d.heal*dt);if(Math.random()<dt*1.5)fxText(PX(o.x),FY(o.row)-L.rowH*0.9,'+','#7ae05a');}}
 for(const e of G.ens){
  if(e.dead)continue;const d=e.d;
  e.anim+=dt;if(e.flash>0)e.flash-=dt;if(e.stampCd>0)e.stampCd-=dt;if(e.zap>0)e.zap-=dt;if(e.soap>0)e.soap-=dt;if(e.drunk>0){e.drunk-=dt;if(Math.random()<dt*0.7){fxText(PX(e.x),FY(e.row)-L.rowH*0.9,'fuj!','#c8e07a');sfx('hic');}}
  e.y+=(e.row-e.y)*Math.min(1,dt*4);
  if(e.bubAt>0&&G.t>=e.bubAt){e.bub={tx:d.say[rnd(d.say.length)],t:2.2};e.bubAt=(e.k==='lenin'||d.boss)?G.t+rr(7,12):-1;}
  if(e.bub){e.bub.t-=dt;if(e.bub.t<=0)e.bub=null;}
  if(e.jump>0){e.jump-=dt;const p=1-Math.max(0,e.jump)/0.6;e.x=lerp(e.jFrom,e.jTo,p);if(e.jump<=0)e.sp=0.22;continue;}
  if(e.k==='palac'){e.sum-=dt;e.talkCd=(e.talkCd==null?8:e.talkCd)-dt;if(Math.random()<dt*1.6)sfx('thud');
   if(e.sum<=0){e.sum=12;const pool=['komunista','trup','trup','przodownik','sekretarz'];for(let i=0;i<2;i++)spawn(pool[rnd(pool.length)],rnd(5),Math.min(9.3,e.x+0.6));fxText(PX(e.x),EY(e.row)-L.rowH*2.4,'DELEGACJA!','#ff6b4a');}
   if(e.talkCd<=0){e.talkCd=16;let n=0;for(const dd of G.defs){if(dd.dead||dd.def.trap||Math.abs(dd.r-e.row)>1||Math.abs(dd.c+0.5-e.x)>2.2)continue;dd.stamp=3;n++;}banner('PRZEMÓWIENIE!');G.fx.push({k:'ring',x:PX(e.x),y:EY(e.row)-L.rowH*1.6,t:0,T:0.9,r:L.cellW*2.6,c:'255,90,60'});}
   for(const rr2 of [e.row-1,e.row+1]){if(rr2<0||rr2>4)continue;for(let c=8;c>=0;c--){const dd=G.grid[rr2][c];if(dd&&!dd.dead&&e.x>c+0.35&&e.x<=c+1.15){killDef(dd,true);G.shake=Math.max(G.shake,0.2);}}}}
  else if(d.boss){e.sum-=dt;if(e.sum<=0){e.sum=12;const pool=['komunista','trup','trup','milicjant'];for(let i=0;i<(e.hp<e.mx*0.5?2:1);i++)spawn(pool[rnd(pool.length)],rnd(5),Math.min(9.3,e.x+0.6));fxText(PX(e.x),FY(e.row)-L.rowH*1.8,'POSIŁKI!','#ff6b4a');}}
  const cc=Math.floor(e.x);
  if(cc>=0&&cc<9){const td=G.grid[e.row][cc];if(td&&!td.dead){
   if(td.k==='kabel'){
    if(d.vehicle||d.boss){fxText(PX(cc+0.5),FY(e.row)-L.rowH*0.9,'ZWARCIE!','#7fd4ff');burst(PX(cc+0.5),FY(e.row)-12,'#ffe14d',16,140);killDef(td);hurt(e,d.boss?300:600,'elec');}
    else{hurt(e,td.def.dps*dt,'elec');e.zap=0.15;sfx('zap');if(Math.random()<dt*5)burst(PX(e.x),FY(e.row)-L.rowH*0.25,'#ffe14d',2,60);}
   }else if(td.k==='rozlew'&&!d.vehicle&&!d.boss&&!(e.drunk>0)&&!e.gnoj&&e.x<cc+0.85){e.gnoj=true;
    e.drunk=6;fxText(PX(cc+0.5),FY(e.row)-L.rowH*0.9,'FUJ!','#c8e07a');sfx('hic');
   }else if(td.k==='lancuch'&&td.reload<=0&&e.x<cc+0.85&&e.stun<=0){
    if(d.boss){killDef(td,true);}
    else{let n=0;for(const o of G.ens){if(o.dead||o.row!==e.row||o.d.boss||o.x<cc-0.2||o.x>cc+2.2)continue;o.stun=td.def.stun;o.queue=true;n++;}td.reload=td.def.reload;sfx('chain');fxText(PX(cc+0.5),FY(e.row)-L.rowH*0.9,'RZUCILI SZYNKĘ!','#ffd0c0');}
   }
  }}
  if(e.dead)continue;
  if(e.stun>0){e.stun-=dt;if(e.stun<=0)e.queue=false;continue;}
  if(e.k==='lunatyk'&&!e.eating){e.lane-=dt;if(e.lane<=0){e.lane=rr(3.5,6);const o=[e.row-1,e.row+1].filter(v=>v>=0&&v<5);e.row=o[rnd(o.length)];}}
  const blk=blocker(e);e.eating=null;
  if(blk){
   if(e.k==='wampir'&&!e.jumped){e.jumped=true;e.jump=0.6;e.jFrom=e.x;e.jTo=blk.c+0.22;fxText(PX(e.x),FY(e.row)-L.rowH,'HOP!','#d6b8ff');sfx('jump');continue;}
   if(d.vehicle&&(blk.k==='szafa'||blk.k==='rubin'||blk.k==='kombajn')){e.eating=blk;blk.hp-=400*dt;blk.hitT=0.08;if(Math.random()<dt*3)burst(PX(blk.c+0.9),FY(e.row)-L.rowH*0.3,'#8a6a40',3,60);sfx('crunch');continue;}
   if(d.vehicle||d.boss){killDef(blk,true);G.shake=Math.max(G.shake,0.15);continue;}
   if(e.k==='swinia'&&!e.charged){e.charged=true;e.sp=0.25;blk.hp-=150;blk.hitT=0.3;e.x+=0.18;fxText(PX(e.x),FY(e.row)-L.rowH,'BUCH!','#ffb0c0');sfx('squeal');continue;}
   e.eating=blk;blk.hp-=d.bite*dt*(e.soap>0?0.4:1)*(G.evil?EVB.bite:1);blk.hitT=0.08;sfx('eat');
   if(d.splash&&blk.c>0){const b2=G.grid[e.row][blk.c-1];if(b2&&!b2.dead&&!b2.def.trap){b2.hp-=d.bite*0.5*dt;b2.hitT=0.08;if(Math.random()<dt*2)burst(PX(blk.c),FY(e.row)-L.rowH*0.5,'#d8f070',3,50);}}
   if(e.k==='urzednik'&&e.stampCd<=0&&blk.k!=='szafa'){blk.stamp=6;e.stampCd=9;sfx('stamp');fxText(PX(blk.c+0.5),FY(blk.r)-L.rowH*0.9,'PIECZĄTKA!','#ff5a4a');}
   if(e.k==='sasiad'){G.steal+=4*dt;if(G.steal>=5){G.steal-=5;if(G.evil){const s=Math.min(5,G.botSam);G.botSam-=s;G.sam+=5;fxText(PX(e.x),FY(e.row)-L.rowH,'+5 duszyczek','#c8f0ff');}else{const s=Math.min(5,G.sam);G.sam-=s;if(s>0)fxText(PX(e.x),FY(e.row)-L.rowH,'−5 l','#ffcf4a');}}}
   continue;
  }
  let m=1;if(e.zap>0)m*=0.5;if(e.soap>0)m*=0.4;if(e.drunk>0)m*=Math.sin(e.anim*1.8)>0.6?-0.9:0.45;
  for(const l of lenins){if(l!==e&&!l.dead&&Math.abs(l.row-e.row)<=1&&Math.abs(l.x-e.x)<1.7){m*=1.35;break;}}
  e.x=Math.min(9.6,e.x-e.sp*m*dt);
  if(e.x<0.05){const u=G.urs[e.row];if(u.st==='ready'){u.st='arm';u.armT=0.7;G.ursUsed=true;sfx('tractor');fxText(PX(-0.2),FY(e.row)-L.rowH*0.9,'URSUS RUSZA!','#ff6a4a');}}
  if(DEMO&&e.x<-0.5){e.dead=true;continue;}
  if(e.x<-0.75&&G.urs[e.row].st!=='go'&&G.urs[e.row].st!=='arm'){lose(e);return;}
 }
}
function updProj(dt){
 for(const p of G.proj){
  if(p.dead)continue;
  if(p.k==='boot'||p.k==='soap'){p.x+=p.sp*dt;p.rot+=dt*14;if(p.x>9.6){p.dead=true;continue;}
   for(const e of G.ens){if(e.dead||e.row!==p.r||Math.abs(e.y-p.r)>0.4)continue;if(p.x>=e.x-0.22&&p.x<=e.x+0.35){hurt(e,p.dmg,'straight');if(p.k==='soap'&&!e.dead&&e.shield<=0)e.soap=5;sfx(p.k==='soap'?'glass':'hit');p.dead=true;if(p.k==='soap'){burst(PX(p.x),FY(p.r)-L.rowH*0.42,'#bfe08a',10,90);burst(PX(p.x),FY(p.r)-L.rowH*0.42,'#e8f4f0',6,110);}else burst(PX(p.x),FY(p.r)-L.rowH*0.42,'#3a3a3a',4,60);break;}}
  }else{p.t+=dt;if(p.t>=p.T){p.dead=true;land(p);}}
 }
 G.proj=G.proj.filter(p=>!p.dead);
}
function land(p){
 const x=p.x1,r=p.r,px=PX(x),py=FY(r)-L.rowH*0.3;
 if(p.k==='ball'){sfx('thud');for(const e of G.ens)if(!e.dead&&e.row===r&&Math.abs(e.x-x)<=0.9){hurt(e,p.dmg,'lob');if(!e.dead&&!e.d.boss&&!e.d.vehicle&&e.jump<=0)e.x=Math.min(9.3,e.x+0.35);}G.fx.push({k:'puff',x:px,y:py,t:0,T:0.5,r:L.cellW*0.6,c:'150,120,90'});burst(px,py,'#6b4a2a',16,150);return;}
 if(p.k==='holy'){sfx('splash');for(const e of G.ens)if(!e.dead&&e.row===r&&Math.abs(e.x-x)<=0.85)hurt(e,p.dmg,'holy');burst(px,py,'#8fd0ff',14,110);G.fx.push({k:'puff',x:px,y:py,t:0,T:0.35,r:L.cellW*0.55,c:'150,210,255'});}
 else{let b=null,bd=9;for(const e of G.ens){if(e.dead||e.row!==r)continue;const dd=Math.abs(e.x-x);if(dd<0.6&&dd<bd){bd=dd;b=e;}}sfx('splat');if(b)hurt(b,p.dmg,'lob');burst(px,py,p.v===0?'#7cc24a':p.v===1?'#c9a066':'#f1ead8',8,80);}
}
function collect(p){if(DEMO){p.dead=true;return;}if(p.st==='fly')return;sfx('pickup');p.st='fly';p.ft=0;p.fx0=p.x;p.fy0=p.y;}
function updPicks(dt){
 for(const p of G.picks){
  if(p.st==='pop'){p.vy+=260*dt;p.y+=p.vy*dt;p.x+=(p.vx||0)*dt;if(p.y>=p.gy&&p.vy>0){p.y=p.gy;p.st='idle';}}
  else if(p.st==='fall'){p.y+=p.vy*dt;if(p.y>=p.gy)p.st='idle';}
  else if(p.st==='idle'){p.life-=dt;if(p.life<=0)collect(p);}
  else if(p.st==='fly'){p.ft+=dt/0.45;const k=Math.min(1,p.ft);p.x=lerp(p.fx0,30,k*k);p.y=lerp(p.fy0,38,k*k);if(k>=1){p.dead=true;G.sam+=p.val;}}
 }
 G.picks=G.picks.filter(p=>!p.dead);
}
function updFx(dt){
 for(const f of G.fx){f.t+=dt;if(f.k==='p'){f.vy+=300*dt;f.x+=f.vx*dt;f.y+=f.vy*dt;}}
 G.fx=G.fx.filter(f=>f.t<f.T);
}
function updUrs(dt){
 for(let r=0;r<5;r++){const u=G.urs[r];if(u.st==='arm'){u.armT-=dt;if(u.armT<=0)u.st='go';continue;}if(u.st!=='go')continue;u.x+=dt*5.5;
  for(const e of G.ens){if(e.dead||e.row!==r)continue;if(e.x>=u.x-0.3&&e.x<=u.x+0.55){if(e.d.boss){if(!e.uHit){e.uHit=true;hurt(e,1500,'explode');fxText(PX(e.x),FY(r)-L.rowH*1.6,'WGNIECENIE!','#ffd08a');}}else kill(e);}}
  if(Math.random()<dt*12)G.fx.push({k:'puff',x:PX(u.x)-8,y:FY(r)-L.rowH*0.75,t:0,T:0.6,r:8,c:'90,90,90'});
  if(u.x>9.8)u.st='used';
 }
}
function updPlows(dt){
 for(const p of G.plows){p.x+=(p.sp||3.2)*dt;
  for(const e of G.ens){if(e.dead||e.row!==p.r||p.hit.includes(e))continue;if(e.x>=p.x-0.2&&e.x<=p.x+0.6){p.hit.push(e);hurt(e,p.dmg||DEF.plug.dmg,'melee');e.flash=0.15;if(p.k==='maluch'){if(!e.dead&&!e.d.boss&&!e.d.vehicle)e.x=Math.min(9.4,e.x+0.6);burst(PX(e.x),FY(p.r)-L.rowH*0.4,'#e8c84a',8,120);sfx('thud');}else burst(PX(e.x),FY(p.r)-L.rowH*0.3,'#6b4a2a',10,120);}}
  if(Math.random()<dt*20)burst(PX(p.x)+10,FY(p.r)-4,'#5a3a1e',2,70);
  if(p.x>9.7)p.dead=true;
 }
 G.plows=G.plows.filter(p=>!p.dead);
}
function win(){
 if(DEMO)return;
 G.over=true;scene='win';musicStop();sfx('win');
 G.stars=1+(G.ursUsed?0:1)+(G.lost===0?1:0);if(!G.endless){save.stars[G.li]=Math.max(save.stars[G.li]||0,G.stars);persist();}
 if(G.li<CAMP){save.unlocked=Math.max(save.unlocked,Math.min(CAMP+1,G.li+2));persist();}
}
function lose(e){
 if(DEMO)return;
 if(G.evil){evilWin(e);return;}
 G.over=true;scene='lose';G.loseT=T;G.loseK=e?e.k:'trup';musicStop();sfx('lose');
 if(G.endless){save.best=Math.max(save.best,G.wave-1);persist();}
}
function selectCard(k){
 if(G.sel===k){G.sel=null;return;}
 if(k!=='lopata'){if(G.cd[k]>0){toast('Jeszcze się odnawia');return;}if(G.sam<costOf(k)){toast('Za mało '+cur());return;}}
 G.sel=k;
}
function tryPlace(r,c){
 const k=G.sel;if(!k)return;
 if(k==='lopata'){const d=G.grid[r][c];if(d){sfx('place');const back=Math.floor(d.def.cost/2);G.sam+=back;killDef(d,false,'shovel');if(back)fxText(PX(c+0.5),FY(r)-L.rowH*0.8,'+'+back+' l','#ffcf4a');}G.sel=null;return;}
 const def=DEF[k];
 if(G.grid[r][c]){toast('To pole jest zajęte');return;}
 if(G.sam<def.cost){toast('Za mało samogonu');G.sel=null;return;}
 if(G.cd[k]>0){G.sel=null;return;}
 G.sam-=def.cost;G.cd[k]=def.cd;sfx('place');
 if(k==='maluch'){G.plows.push({r,x:c+0.2,hit:[],k:'maluch',sp:4.2,dmg:DEF.maluch.dmg});G.sel=null;sfx('putt');fxText(PX(c+0.5),FY(r)-L.rowH*0.9,'BRUM!','#ffe9a0');return;}
 makeDef(k,r,c);G.sel=null;
}
function makeDef(k,r,c){
 const def=DEF[k];
 if(k==='plug'){G.plows.push({r,x:c+0.2,hit:[]});sfx('plow');fxText(PX(c+0.5),FY(r)-L.rowH*0.9,'WIO!','#ffe9a0');return null;}
 const d={k,def,r,c,hp:def.hp||1,max:def.hp||1,t:k==='bimbrownia'?6:0.3,stamp:0,armT:def.arm||0,armed:false,reload:0,uses:def.uses||0,life:def.life||0,fuse:0.7,anim:0,kick:0,dead:false,hitT:0,rev:false};
 G.defs.push(d);G.grid[r][c]=d;
 burst(PX(c+0.5),FY(r)-4,'#a08050',8,60);return d;
}

