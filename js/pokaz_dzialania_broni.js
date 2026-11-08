/* ---------- pokaz działania broni ---------- */
let DEMO=false,DM=null,FDT=0;
const DEMO_SPEC={
 bimbrownia:{c:1,en:[],loop:6,setup(d){d.t=0.6;}},
 gumofilce:{c:0,en:[['trup',1,4.2,0.2]],loop:8},
 resztki:{c:0,en:[['komunista',1,4.2,0.2]],loop:9},
 woda:{c:0,en:[['trup',1,4,0.2],['trup',1,4.7,0.5]],loop:8},
 pralka:{c:0,en:[['trup',1,4,0.2]],loop:8},
 samowar:{c:0,en:[['trup',1,3.4,0.2],['trup',1,4.3,0.7]],loop:8},
 armata:{c:0,en:[['trup',1,4.4,0.2],['trup',1,5,0.4]],loop:9},
 szafa:{c:2,en:[['trup',1,3.8,0.2],['trup',1,4.6,1]],loop:8},
 pila:{c:2,en:[['trup',1,3.8,0.2],['trup',1,4.8,1.4]],loop:8},
 kombajn:{c:1,en:[['trup',1,4.2,0.2],['trup',1,5,1.2]],loop:8},
 relikwia:{c:2,en:[['trup',0,4.4,0.2],['trup',1,4.2,0.2],['trup',2,4.6,0.2]],loop:9},
 kabel:{c:2,en:[['trup',1,3.8,0.2],['trup',1,4.8,1.6]],loop:9},
 aparatura:{c:2,en:[['trup',1,3.8,0.2],['trup',1,4.4,0.3]],loop:7,setup(d){d.armT=0.05;}},
 flaszka:{c:3,place:2.2,en:[['trup',0,4.8,0.1],['trup',1,4.6,0.1],['trup',2,4.9,0.1]],loop:6},
 rubin:{c:2,en:[['trup',1,3.6,0.2],['trup',1,4.3,0.3]],loop:9,setup(d){d.hp=d.max=160;}},
 rozlew:{c:3,en:[['trup',1,4.6,0.2],['trup',1,5.4,1.6]],loop:9},
 lancuch:{c:2,en:[['trup',1,3.6,0.2],['urzednik',1,4.1,0.3],['trup',1,4.7,0.5]],loop:9},
 plug:{c:0,place:1.8,en:[['trup',1,3,0.1],['trup',1,3.8,0.1],['milicjant',1,4.6,0.1]],loop:6},
 ursus:{c:-1,en:[['trup',1,1.2,0.1],['trup',1,2,0.4]],loop:7}
};
function demoNew(k){
 const g={li:0,lv:{newEn:[],theme:0},endless:true,t:0,sam:99999,defs:[],grid:[],ens:[],proj:[],picks:[],fx:[],urs:[0,1,2,3,4].map(()=>({st:'used',x:-0.55})),cd:{},sel:null,wi:0,sq:[],banner:null,toast:null,shake:0,sky:1e9,modal:[],modalT:0,seen:{},winT:-1,over:false,wave:0,nextWave:1e9,kills:0,steal:0,deco:[],plows:[],load:[],waves:[],lastT:1,cards:[]};
 for(let r=0;r<5;r++){g.grid.push([]);for(let c=0;c<9;c++)g.grid[r].push(null);}
 const sp=DEMO_SPEC[k];if(k==='ursus')g.urs[1].st='ready';
 DM={k,g,sp,pend:sp.en.map(a=>({k:a[0],row:a[1],x:a[2],at:a[3],done:false})),placed:false};
}
function demoPlace(){const sp=DM.sp;if(sp.c<0)return;G.cd={};G.sel=DM.k;tryPlace(1,sp.c);const d=G.grid[1][sp.c];if(d&&sp.setup)sp.setup(d);DM.placed=true;}
function demoBox(k,bx,by,bw,bh){
 if(!DEMO_SPEC[k]){ctx.fillStyle='#d9c393';rrect(bx,by,bw,bh,8);ctx.fill();drawDef(k,bx+bw/2,by+bh-12,bh*0.8,null,T);return;}
 if(!DM||DM.k!==k)demoNew(k);
 const rG=G,sv={top:L.top,rowH:L.rowH,x0:L.x0,cellW:L.cellW,x1:L.x1};
 L.rowH=bh/3;L.top=by;L.cellW=Math.min(L.rowH*1.25,bw/6.2);L.x0=bx+(k==='ursus'?L.cellW*1.1:L.cellW*0.25);L.x1=L.x0+9*L.cellW;
 DEMO=true;G=DM.g;
 try{
  if(!DM.placed&&!DM.sp.place)demoPlace();
  if(!DM.placed&&DM.sp.place&&G.t>=DM.sp.place)demoPlace();
  for(const p of DM.pend)if(!p.done&&G.t>=p.at){p.done=true;const e=spawn(p.k,p.row,p.x);e.sp*=1.7;e.bubAt=-1;}
  let acc=Math.min(FDT,0.05);while(acc>1e-6){const st=Math.min(acc,1/60);update(st);acc-=st;}
  ctx.save();rrect(bx,by,bw,bh,8);ctx.clip();
  ctx.fillStyle='#5e8f33';ctx.fillRect(bx,by,bw,bh);
  for(let r=0;r<3;r++)for(let c=0;c<9;c++){ctx.fillStyle=((r+c)%2)?'#78b443':'#6aa63b';ctx.fillRect(PX(c),RY(r),L.cellW+0.5,L.rowH+0.5);}
  if(k==='ursus'){ctx.fillStyle='#7d5f38';ctx.fillRect(bx,by,L.x0-bx,bh);for(let r=0;r<3;r++)drawUrsusRow(r);}
  for(let r=0;r<3;r++){
   for(const d of G.defs)if(d.r===r&&d.def.trap)drawDefOnGrid(d);
   for(const d of G.defs)if(d.r===r&&!d.def.trap)drawDefOnGrid(d);
   for(const e of G.ens.filter(e=>Math.round(e.y)===r).sort((a,b)=>b.x-a.x))drawEnemy(e);
  }
  for(const p of G.plows)drawDef(p.k||'plug',PX(p.x),FY(p.r)+3,Math.min(L.cellW*0.92,L.rowH*0.95),{},T);
  drawProj();drawFx();drawPicks();
  ctx.restore();
  ctx.lineWidth=2;ctx.strokeStyle='#5a3a1e';rrect(bx,by,bw,bh,8);ctx.stroke();
  if(G.t>DM.sp.loop)demoNew(k);
 }finally{G=rG;Object.assign(L,sv);DEMO=false;}
 txt('pokaz działania',bx+bw-8,by+14,10,700,'rgba(255,255,255,.85)','right',['rgba(0,0,0,.6)',3]);
}

