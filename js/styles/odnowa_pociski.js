/* Odnowa: pociski w locie (gumiak, słoik z ogórkami, kula, święcona, resztki). ODN.PROJ(kind,x,y,rot,v,rowH) → true.
   Jednostki jak sprzęt: rowH/72 na jednostkę, kontur jak w odnowie. */
(()=>{
const ODN=window.ODN;if(!ODN)return;
const sh=(path,c,lw)=>{path();ctx.fillStyle=c;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=lw||1.2;ctx.lineJoin='round';ctx.stroke();};
const P=pts=>()=>Pth(pts),E=(x,y,rx,ry,a)=>()=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,a||0,0,7);};
const R=(x,y,w,h,r)=>()=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);};
const DRAW={
 boot(){ // gumofilc z filcem, nosek w prawo, środek w kostce
  ctx.translate(0,8);
  sh(P([[-4.6,-17],[4.4,-17],[4.8,-5],[11,-4],[12.6,-0.6],[11.8,2.2],[-5,2.2],[-5.4,-5]]),'#262626');
  ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(-2.8,-15,1.3,12);ctx.fillStyle='#4a4a4a';ctx.fillRect(-5,0.8,16.6,1.4);
  sh(R(-6.2,-23,12.4,6.4,1.5),'#c8c0ae');ctx.fillStyle='#e8e2d2';ctx.fillRect(-5.6,-22.4,11.2,1.4);},
 soap(){ // słoik ogórków z kraciastą pokrywką
  sh(R(-6,-8,12,15,3),'rgba(200,232,215,.95)');
  ctx.fillStyle='#4f8a2a';for(const x of [-3.4,0,3.2]){ctx.beginPath();ctx.ellipse(x,0,1.5,5.4,0.1,0,7);ctx.fill();}
  ctx.fillStyle='rgba(255,255,255,.6)';ctx.fillRect(-4.6,-6,1,11);
  sh(R(-6.6,-11.4,13.2,4,1),'#e8e2d2');ctx.fillStyle='#c42a20';for(let i=0;i<4;i++)ctx.fillRect(-6+i*3.3,-11,1.6,3.2);},
 ball(){sh(E(0,0,6,6),'#1e1e1e',1.4);ctx.fillStyle='rgba(255,255,255,.45)';ctx.beginPath();ctx.arc(-2,-2,1.8,0,7);ctx.fill();
  ctx.fillStyle='rgba(120,120,120,.35)';for(let i=1;i<4;i++){ctx.beginPath();ctx.arc(-6-i*4,i%2,2.2-i*0.4,0,7);ctx.fill();}},
 holy(){ // butelka święconej z krzyżykiem
  sh(R(-3.6,-6,7.2,13,2.4),'rgba(130,185,255,.95)');sh(R(-1.4,-10,2.8,4.4,0.6),'rgba(130,185,255,.95)',1);
  ctx.fillStyle='#8a5a2a';ctx.fillRect(-1.4,-11.6,2.8,1.8);ctx.fillStyle='#fff';ctx.fillRect(-0.6,-3.6,1.2,6);ctx.fillRect(-2,-1.6,4,1.2);
  ctx.fillStyle='rgba(255,250,200,.9)';ctx.beginPath();ctx.arc(4.8,-6,1,0,7);ctx.fill();},
 food0(){sh(E(0,0,6.4,6),'#86c850');ctx.strokeStyle='#4f8a2a';ctx.lineWidth=0.9;ctx.beginPath();ctx.moveTo(-4,-3);ctx.quadraticCurveTo(0,0,3.6,4);ctx.moveTo(-1,-5.4);ctx.quadraticCurveTo(-2,0,0,5.6);ctx.stroke();},
 food1(){sh(E(0,0,6.4,4.6,0.2),'#c9a066');ctx.fillStyle='#8a6a3a';for(const [x,y] of [[-2,-1],[2,1],[0.6,-2]]){ctx.beginPath();ctx.arc(x,y,0.8,0,7);ctx.fill();}},
 food2(){ // kość z obiadu
  sh(()=>{ctx.beginPath();ctx.roundRect(-6,-1.6,12,3.2,1);for(const [x,y] of [[-6,-1.6],[-6,1.6],[6,-1.6],[6,1.6]]){ctx.moveTo(x+2.2,y);ctx.arc(x,y,2.2,0,7);}},'#f1ead8');}
};
ODN.PROJ=(kind,x,y,rot,v,rowH)=>{
 const f=DRAW[kind==='food'?'food'+(v||0):kind]||(kind!=='boot'&&kind!=='soap'&&kind!=='ball'&&kind!=='holy'?DRAW['food'+(v||0)]:null);if(!f)return false;
 const u=rowH/72;ctx.translate(x,y);ctx.scale(u,u);if(kind!=='ball')ctx.rotate(rot||0);f();return true;
};
})();
