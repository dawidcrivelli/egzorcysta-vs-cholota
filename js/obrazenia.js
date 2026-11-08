/* ---------- obrażenia ---------- */
function hurt(e,dmg,kind){
 if(e.dead)return;const d=e.d;
 if(kind==='holy'&&d.undead)dmg*=3;
 if(kind==='fire'&&d.burn)dmg*=2;
 if((kind==='explode'||kind==='fire')&&dmg>=300){if(e.shield>0)dropFx(e,'sign');if(e.helm>0)dropFx(e,'helm');e.shield=0;e.helm=0;}
 if(kind==='straight'&&e.shield>0){const a=Math.min(e.shield,dmg);e.shield-=a;dmg-=a;if(e.shield<=0)dropFx(e,'sign');}
 if(e.helm>0&&kind!=='fire'&&kind!=='explode'){const a=Math.min(e.helm,dmg);e.helm-=a;dmg-=a;if(e.helm<=0)dropFx(e,'helm');}
 if(dmg<=0){e.flash=0.06;return;}
 e.hp-=dmg;
 if(kind!=='melee'&&kind!=='elec')e.flash=0.1;
 if(e.hp<=0)kill(e);
}
function dropFx(e,what){const x=PX(e.x),y=FY(e.row)-L.rowH*0.8;if(what==='sign'){fxText(x,y,'Transparent pada!','#ff8a7a');burst(x,y,'#c0281e',10,90);}else{fxText(x,y,'Hełm spadł!','#d0d4c0');burst(x,y,'#55594b',8,110);}}
function ecolor(k){return({trup:'#9fc07e',urzednik:'#5c6573',sasiad:'#f2f2ee',milicjant:'#5a687d',komunista:'#b8281e',nysa:'#e9edf0',wampir:'#1c1c22',mumia:'#d9cfac',swinia:'#e99aaa',lunatyk:'#9cc3e6',lenin:'#2c2c34',carski:'#6b7044',okupant:'#6e705e',burak:'#7a1f4a',buraczek:'#7a1f4a',boss:'#a8743a',palac:'#d9ccb0',kura:'#efe8dc',przodownik:'#2e4a7a',barszcz:'#5f8a3a',krowa:'#efece4',sekretarz:'#5a4632'})[k]||'#999';}
function kill(e){
 if(e.dead)return;e.dead=true;G.kills++;
 const x=PX(e.x),y=FY(e.row);
 burst(x,y-L.rowH*0.4,ecolor(e.k),e.d.boss?44:12,e.d.boss?170:90);
 G.fx.push({k:'puff',x,y:y-L.rowH*0.3,t:0,T:0.5,r:e.d.boss?60:20,c:'210,210,200'});
 if(e.k==='burak'){spawn('buraczek',e.row,e.x+0.18);spawn('buraczek',e.row,e.x-0.12);}
 if(e.k==='nysa'){spawn('milicjant',e.row,e.x);fxText(x,y-L.rowH,'Kierowca wysiada!','#bcd0ff');}
 if(e.k==='boss'){banner('POMNIK OBALONY!');G.shake=0.6;}
}
function killDef(d,crushed,why){
 if(d.dead)return;if(!DEMO&&why!=='shovel'&&why!=='used')G.lost++;d.dead=true;if(G.grid[d.r][d.c]===d)G.grid[d.r][d.c]=null;
 const x=PX(d.c+0.5),y=FY(d.r);
 G.fx.push({k:'puff',x,y:y-L.rowH*0.3,t:0,T:0.45,r:22,c:'180,170,150'});
 burst(x,y-L.rowH*0.3,'#8a6a40',8,80);
 if(crushed){fxText(x,y-L.rowH*0.8,'CHRUP!','#ffd0a0');sfx('crunch');}
 if(d.k==='rubin'){boom(x,y-L.rowH*0.35,L.cellW*1.1);sfx('glass');fxText(x,y-L.rowH*0.9,'KINESKOP!','#9fd8ff');for(const e of G.ens)if(!e.dead&&e.row===d.r&&Math.abs(e.x-(d.c+0.6))<=1.2)hurt(e,d.def.dmg,'explode');}
 if(d.k==='bimbrownia'){boom(x,y-L.rowH*0.35,L.cellW*0.8);fxText(x,y-L.rowH*0.9,'BUM!','#ffb43a');for(const e of G.ens)if(!e.dead&&e.row===d.r&&Math.abs(e.x-(d.c+0.6))<=0.95)hurt(e,300,'explode');}
}
function boom(x,y,r){sfx('boom');G.fx.push({k:'boom',x,y,t:0,T:0.5,r});burst(x,y,'#ff9a1f',16,160);burst(x,y,'#ffe14d',8,120);}

