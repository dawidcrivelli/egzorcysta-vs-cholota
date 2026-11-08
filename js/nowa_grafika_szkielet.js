/* ===== NOWA GRAFIKA: szkielet + szczegółowe rysunki ===== */
const OL='#150e09';let OLW=1;
function tint(c,f){const n=parseInt(c.slice(1),16);const r=Math.min(255,Math.round((n>>16)*f)),g=Math.min(255,Math.round((n>>8&255)*f)),b=Math.min(255,Math.round((n&255)*f));return 'rgb('+r+','+g+','+b+')';}
function Pth(p){ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);ctx.closePath();}
function fs(c,lw){ctx.fillStyle=c;ctx.fill();if(lw!==0){ctx.strokeStyle=OL;ctx.lineWidth=lw||OLW;ctx.lineJoin='round';ctx.stroke();}}
function sk(c,w){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}
function ln(x1,y1,x2,y2,c,w){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);sk(c,w);}
function add(a,b){return[a[0]+b[0],a[1]+b[1]];}
function dir(a,l){return[-Math.sin(a)*l,Math.cos(a)*l];}
function lp(a,b,t){return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];}
function ease(t){t=clamp(t,0,1);return t*t*(3-2*t);}
function limb(a,b,w1,w2,c,far,noOut){
 const col=far?tint(c,0.8):c,sh=tint(c,far?0.6:0.72);
 const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;
 const p1=[a[0]+nx*w1/2,a[1]+ny*w1/2],p2=[b[0]+nx*w2/2,b[1]+ny*w2/2],p3=[b[0]-nx*w2/2,b[1]-ny*w2/2],p4=[a[0]-nx*w1/2,a[1]-ny*w1/2];
 Pth([p1,p2,p3,p4]);ctx.fillStyle=col;ctx.fill();
 Pth(nx>0?[p1,p2,b,a]:[a,b,p3,p4]);ctx.fillStyle=sh;ctx.fill();
 if(!noOut){Pth([p1,p2,p3,p4]);ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.lineJoin='round';ctx.stroke();}
}
/* kończyna jako jedna bryła przez punkty P o szerokościach W: najpierw kontur całości, potem wypełnienie,
   więc stawy nie mają szwów ani guzów, a końce są zaokrąglone */
function chain(P,W,c,far){
 const col=far?tint(c,0.8):c,sh=tint(c,far?0.6:0.72),shapes=[];
 for(let i=0;i<P.length;i++){
  shapes.push(()=>ctx.arc(P[i][0],P[i][1],W[i]/2,0,7));
  if(i){const a=P[i-1],b=P[i],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,r1=W[i-1]/2,r2=W[i]/2;
   shapes.push(()=>{ctx.moveTo(a[0]+nx*r1,a[1]+ny*r1);ctx.lineTo(b[0]+nx*r2,b[1]+ny*r2);ctx.lineTo(b[0]-nx*r2,b[1]-ny*r2);ctx.lineTo(a[0]-nx*r1,a[1]-ny*r1);ctx.closePath();});}
 }
 ctx.beginPath();for(const s of shapes){s();ctx.closePath();}ctx.strokeStyle=OL;ctx.lineWidth=OLW*2;ctx.lineJoin='round';ctx.stroke();
 ctx.fillStyle=col;for(const s of shapes){ctx.beginPath();s();ctx.fill();}   // osobno: przeciwne kierunki ścieżek nie robią dziur
 for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,r1=W[i-1]/2,r2=W[i]/2;
  Pth(nx>0?[[a[0]+nx*r1,a[1]+ny*r1],[b[0]+nx*r2,b[1]+ny*r2],b,a]:[a,b,[b[0]-nx*r2,b[1]-ny*r2],[a[0]-nx*r1,a[1]-ny*r1]]);ctx.fillStyle=sh;ctx.fill();}
}

/* ---- szkielet ---- */
const RG={W:2.3,HS:0.8,head:2.35,hand:1.85,foot:1.55};
function solve(pose){
 const H=[0,pose.hip],lean=pose.lean;
 const sh=[H[0]-Math.sin(lean)*23,H[1]-Math.cos(lean)*23];
 const nk=[H[0]-Math.sin(lean)*26.5,H[1]-Math.cos(lean)*26.5];
 const legs=pose.legs.map((g,i)=>{const hp=[H[0]+(i?3.5:-3.5),H[1]];const kn=add(hp,dir(g.th,14));const an=add(kn,dir(g.th-g.kn,13));return{hp,kn,an,fp:g.fp||0};});
 const arms=pose.arms.map((g,i)=>{const s0=[sh[0]+(i?5:-3),sh[1]+2];const el=add(s0,dir(lean+g.sh,12));const wr=add(el,dir(lean+g.sh+g.el,11));return{sh:s0,el,wr};});
 let low=-99;for(const L of legs){low=Math.max(low,L.an[1]+5.2+Math.max(0,-Math.sin(L.fp)*14));}
 return{H,lean,sh,nk,legs,arms,shift:-low,tilt:pose.tilt||0};
}
function wrapLines(a,b,w,c){const dx=b[0]-a[0],dy=b[1]-a[1],Ln=Math.hypot(dx,dy)||1,nx=-dy/Ln,ny=dx/Ln,ux=dx/Ln,uy=dy/Ln;for(const t of [0.18,0.42,0.66,0.9]){const p=lp(a,b,t);ln(p[0]+nx*w/2-ux*2,p[1]+ny*w/2-uy*2,p[0]-nx*w/2+ux*2,p[1]-ny*w/2+uy*2,c,1.8);}}
function drawLeg(L,o,far){
 chain([L.hp,L.kn,L.an],[18,14.5,11.6],o.pants,far);
 if(o.wrap){wrapLines(L.hp,L.kn,16,o.wrap);wrapLines(L.kn,L.an,12,o.wrap);}
 if(o.legStripe){ln(lp(L.hp,L.kn,0.1)[0]+2,lp(L.hp,L.kn,0.1)[1],L.an[0]+1.6,L.an[1]-2,far?tint(o.legStripe,0.8):o.legStripe,2);}
 if(o.bootH){const top=lp(L.kn,L.an,1-o.bootH);limb(top,L.an,15,13,o.boot,far);if(o.felt)limb(top,lp(top,L.an,0.22),16.6,16.2,o.felt,far);}
 const bare=o.bareNear&&!far,pw=OLW;
 ctx.save();ctx.translate(L.an[0],L.an[1]);ctx.rotate(L.fp);ctx.scale(RG.foot,RG.foot);OLW=pw/RG.foot;
 if(bare){Pth([[3,-2],[3.2,3.6],[-8.5,3.6],[-9.6,2.2],[-6,-0.5],[-1.5,-2.6]]);fs(far?tint(o.skin,0.8):o.skin);}
 else{const bc=far?tint(o.shoe,0.8):o.shoe;Pth([[3.6,-3],[3.9,3.6],[-10.2,3.6],[-10.8,1.2],[-7.4,-1.4],[-2,-3.4]]);fs(bc);}
 OLW=pw;ctx.restore();
}
function drawArm(A,o,far,hold){
 chain([A.sh,A.el,A.wr],[14,11.6,9.8],o.sleeve,far);
 if(o.cuff)limb(lp(A.el,A.wr,0.78),A.wr,9.6,9.6,o.cuff,far);
 if(o.wrap){wrapLines(A.sh,A.el,13,o.wrap);wrapLines(A.el,A.wr,10.5,o.wrap);}
 const d=[A.wr[0]-A.el[0],A.wr[1]-A.el[1]],ang=Math.atan2(d[1],d[0])-Math.PI/2,pw=OLW;
 ctx.save();ctx.translate(A.wr[0],A.wr[1]);ctx.rotate(ang);ctx.scale(RG.hand,RG.hand);OLW=pw/RG.hand;
 if(hold&&hold.behind)hold.fn(far,ang);
 ctx.beginPath();ctx.ellipse(0,3,3.4,3.8,0,0,7);fs(far?tint(o.skin,0.8):o.skin);
 if(hold&&!hold.behind)hold.fn(far,ang);
 OLW=pw;ctx.restore();
}
function sc2(p){return p.map(q=>[q[0]*RG.W,q[1]*RG.HS]);}
function drawTorso(J,o,t){
 ctx.save();ctx.translate(J.H[0],J.H[1]);ctx.rotate(-J.lean);
 if(o.skirt){const sw=(J.legs[0].kn[0]+J.legs[1].kn[0])*0.04;let sk2=[[-8,-2],[7.6,-2],[9.2-sw,o.skirt],[-10.2-sw,o.skirt]];if(o.ragged){sk2.splice(2,1,[9-sw,o.skirt],[5,o.skirt-2.5],[2,o.skirt+0.5],[-2,o.skirt-2],[-6,o.skirt+0.5]);}sk2=sc2(sk2);Pth(sk2);fs(o.coat);ctx.save();Pth(sk2);ctx.clip();ctx.fillStyle=tint(o.coat,0.72);ctx.fillRect(2,-3,30,o.skirt+8);ctx.restore();Pth(sk2);ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();}
 const body=sc2(o.body||[[7,-1],[7.6,-14],[7.2,-27],[5.6,-32.6],[0,-34.6],[-5.2,-33.2],[-8,-27.5],[-8.8,-20],[-7.2,-10],[-7.8,-1]]);
 Pth(body);ctx.fillStyle=o.coat;ctx.fill();
 ctx.save();Pth(body);ctx.clip();
 ctx.fillStyle=tint(o.coat,0.72);ctx.beginPath();ctx.moveTo(3,-36);ctx.quadraticCurveTo(7,-16,1,0);ctx.lineTo(20,0);ctx.lineTo(20,-36);ctx.fill();
 if(o.torsoFx){ctx.save();ctx.scale(RG.W,RG.HS);const pw=OLW;OLW=pw/1.4;o.torsoFx(t);OLW=pw;ctx.restore();}
 ctx.restore();
 Pth(body);ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.lineJoin='round';ctx.stroke();
 if(o.torsoOver){ctx.save();ctx.scale(RG.W,RG.HS);const pw=OLW;OLW=pw/1.4;o.torsoOver(t);OLW=pw;ctx.restore();}
 ctx.restore();
}
function headPath(){ctx.beginPath();ctx.ellipse(0,-8.6,8.4,8.2,0,0,Math.PI*2);ctx.closePath();}
function drawHead(J,o,t){
 const pw=OLW;
 ctx.save();ctx.translate(J.nk[0],J.nk[1]);ctx.rotate(-(J.lean+J.tilt));ctx.scale(RG.head,RG.head);OLW=pw/RG.head*1.15;
 if(o.collarFx)o.collarFx(t);
 headPath();ctx.fillStyle=o.skin;ctx.fill();
 ctx.save();headPath();ctx.clip();
 ctx.fillStyle=tint(o.skin,0.8);ctx.beginPath();ctx.moveTo(1.5,-20);ctx.quadraticCurveTo(-0.5,-9,2,0);ctx.lineTo(10,0);ctx.lineTo(10,-20);ctx.fill();
 if(o.faceFx)o.faceFx(t);
 ctx.restore();
 headPath();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.lineJoin='round';ctx.stroke();
 ctx.beginPath();ctx.ellipse(3.6,-8.4,1.5,2.1,0,0,7);fs(tint(o.skin,0.86),OLW*0.8);
 ctx.beginPath();ctx.ellipse(-8.3,-7.6,2,1.7,0,0,7);fs(o.skin,OLW*0.8);
 if(!o.noEye){
  if(o.eyeFn)o.eyeFn(t);else{ctx.beginPath();ctx.ellipse(-4.2,-9.8,1.4,1.7,0,0,7);fs('#fbf6ea',OLW*0.6);ctx.fillStyle='#1e1610';ctx.beginPath();ctx.arc(-4.8,-9.7,0.85,0,7);ctx.fill();}
 }
 ln(-6.4,-12.2,-2.2,-12.6,o.brow||tint(o.skin,0.5),o.browW||1.1);
 if(!o.noMouth)ln(-6.4,-4.6,-3.6,-4.2,tint(o.skin,0.45),0.8);
 if(o.headFx)o.headFx(t);
 OLW=pw;ctx.restore();
}
function drawFigure(o,pose,t){
 const J=solve(pose);
 ctx.fillStyle='rgba(0,0,0,.38)';ctx.beginPath();ctx.ellipse(-1,0,30,5,0,0,7);ctx.fill();
 ctx.save();ctx.translate(0,J.shift);
 if(o.back)o.back(J,t);
 drawArm(J.arms[1],o,true,o.holdFar);
 drawLeg(J.legs[1],o,true);
 drawLeg(J.legs[0],o,false);
 drawTorso(J,o,t);
 if(o.beard)drawArm(J.arms[0],o,false,o.holdNear);   // długa broda zakrywa bark
 drawHead(J,o,t);
 if(!o.beard)drawArm(J.arms[0],o,false,o.holdNear);
 if(o.front)o.front(J,t);
 ctx.restore();
 return J;
}

/* ---- pozy ---- */
function walkPose(t,sp,amp,lean){
 const ph=t*sp;
 const legs=[0,Math.PI].map(o=>{const p=ph+o;return{th:amp*Math.sin(p),kn:0.1+0.8*Math.pow(Math.max(0,Math.sin(p+1.85)),1.4),fp:0.26*Math.sin(p)};});
 const arms=[Math.PI,0].map(o=>{const p=ph+o;return{sh:0.85*amp*Math.sin(p),el:0.3+0.3*Math.max(0,Math.sin(p))};});
 return{hip:-50.5,lean:lean||0.05,legs,arms,tilt:0,ph};
}
function poseTrup(t){
 const ph=t*2.1;
 return{hip:-50,lean:0.3+0.04*Math.sin(ph*2),tilt:0.32+0.1*Math.sin(ph*0.7),
  legs:[{th:0.34*Math.sin(ph),kn:0.12+0.55*Math.pow(Math.max(0,Math.sin(ph+1.85)),1.4),fp:0.22*Math.sin(ph)},{th:0.16*Math.sin(ph+Math.PI)-0.1,kn:0.28,fp:-0.25}],
  arms:[{sh:1.25+0.08*Math.sin(ph*1.3),el:0.15+0.06*Math.sin(ph)},{sh:1.15+0.08*Math.sin(ph*1.3+1),el:0.25}]};
}
function poseMil(t){const p=walkPose(t,4.6,0.46,0.04);p.arms[0].sh=0.25+0.35*Math.sin(p.ph+Math.PI);p.arms[0].el=1.35;return p;}
function poseLenin(t){
 const p=walkPose(t,3.5,0.36,0.13);const g=ease((Math.sin(t*0.8)-0.1)*2.2);
 p.arms[0].sh=lerp(p.arms[0].sh,2.15,g);p.arms[0].el=lerp(p.arms[0].el,0.05,g);
 p.arms[1].sh=0.15+p.arms[1].sh*0.4;p.arms[1].el=0.75;p.tilt=-0.12*g;p.g=g;return p;
}
function poseDziad(t){
 const c=(t%2.8)/2.8;let sh,el;
 if(c<0.3){const k=ease(c/0.3);sh=lerp(0.7,2.3,k);el=lerp(0.5,0.9,k);}
 else if(c<0.4){const k=Math.pow((c-0.3)/0.1,0.6);sh=lerp(2.3,0.9,k);el=lerp(0.9,0.1,k);}
 else{const k=ease((c-0.4)/0.6);sh=lerp(0.9,0.7,k);el=lerp(0.1,0.5,k);}
 return{hip:-50.2+0.35*Math.sin(t*2.2),lean:0.04,tilt:-0.04,legs:[{th:0.16,kn:0.06,fp:0},{th:-0.12,kn:0.1,fp:0}],arms:[{sh,el},{sh:0.35,el:0.4}],c};
}

/* ---- trzymane przedmioty ---- */
function holdBottle(far){ctx.save();ctx.translate(-0.5,4);ctx.rotate(1.2);Pth([[-2.6,-6],[2.6,-6],[2.8,5],[-2.8,5]]);fs('rgba(205,232,226,.85)',OLW*0.8);ctx.fillStyle='rgba(232,192,80,.9)';ctx.fillRect(-2.2,-1,4.4,5.4);Pth([[-1.1,-6],[1.1,-6],[1,-10],[-1,-10]]);fs('rgba(205,232,226,.85)',OLW*0.7);ctx.fillStyle='#8a5a2a';ctx.fillRect(-1.1,-11.6,2.2,1.8);ctx.fillStyle='#e8dcb8';ctx.fillRect(-2.4,-4,4.8,2.4);ctx.fillStyle='rgba(255,255,255,.6)';ctx.fillRect(-1.9,-5,0.8,8);ctx.restore();}
function holdKropidlo(){ctx.save();ctx.translate(0,4);ctx.rotate(0.25);ln(0,-1,0,17,OL,2.8);ln(0,-1,0,17,'#7a5232',1.7);ctx.beginPath();ctx.arc(0,20,3.2,0,7);ctx.fillStyle='#c9ced4';ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW*0.8;ctx.stroke();ctx.fillStyle='#55585c';for(const p of [[-1.2,19],[1.2,20.6],[0,21.8],[0.6,18.6]])ctx.fillRect(p[0]-0.4,p[1]-0.4,0.8,0.8);ctx.restore();}
function holdPalka(){ctx.save();ctx.translate(0,4);ctx.rotate(-0.7);Pth([[-1.3,3],[1.3,3],[1.1,-18],[-1.1,-18]]);fs('#e8e6df',OLW*0.8);ctx.fillStyle='#222';ctx.fillRect(-1.4,-1,2.8,4.5);ctx.fillStyle='rgba(0,0,0,.15)';ctx.fillRect(0.2,-18,0.9,16);ctx.restore();}
function holdCap(){ctx.save();ctx.translate(0,5.5);ctx.rotate(0.3);Pth([[-5,-2],[5.5,-2.5],[6,1.5],[-6.5,1.8]]);fs('#2c2a28',OLW*0.8);Pth([[-6.5,1.8],[-9,3.4],[-5,2.6]]);fs('#1c1a18',OLW*0.7);ctx.restore();}

/* ---- postaci ---- */
const CHR={};
function dziadBarrel(J){const x=J.H[0]+31,y=(J.H[1]+J.sh[1])/2-6;
 ctx.save();ctx.translate(x,y);ctx.rotate(-J.lean*0.6);ctx.scale(1.4,1.4);
 ctx.beginPath();ctx.moveTo(-11,-17);ctx.quadraticCurveTo(-14,0,-11,17);ctx.lineTo(11,17);ctx.quadraticCurveTo(14,0,11,-17);ctx.closePath();
 const g=ctx.createLinearGradient(-13,0,13,0);g.addColorStop(0,'#5e3c1e');g.addColorStop(0.4,'#9a6a3c');g.addColorStop(1,'#4a2e14');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 for(const yy of [-11,11]){ctx.beginPath();ctx.moveTo(-12.6,yy);ctx.lineTo(12.6,yy);sk(OL,3.2);ctx.beginPath();ctx.moveTo(-12.6,yy);ctx.lineTo(12.6,yy);sk('#4a4a4a',1.8);}
 ctx.save();ctx.scale(CS.flip?-1:1,1);ctx.font='900 11px '+FONT;ctx.textAlign='center';ctx.lineWidth=2.4;ctx.strokeStyle='#2a1608';ctx.strokeText('XX',0,4);ctx.fillStyle='#f4e7c9';ctx.fillText('XX',0,4);ctx.restore();
 Pth([[-3,-17],[3,-17],[3,-21],[-3,-21]]);fs('#8a8e94',OLW*0.8);
 ctx.restore();}
function dziadHose(J){const x=J.H[0]+31,y=(J.H[1]+J.sh[1])/2-6-29,A=J.arms[0],w=A.wr,mx=(x+w[0])/2,my=Math.max(y,w[1])+14;
 ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(mx+4,my,w[0],w[1]);sk(OL,4.4);ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(mx+4,my,w[0],w[1]);sk('#3a3a3a',2.6);
 ctx.beginPath();ctx.moveTo(J.sh[0]+6,J.sh[1]-1);ctx.lineTo(x-12,y+34);sk(OL,3.4);ctx.beginPath();ctx.moveTo(J.sh[0]+6,J.sh[1]-1);ctx.lineTo(x-12,y+34);sk('#6a4a2a',2);}
CHR.dziad={beard:true,back(J,t){dziadBarrel(J);},front(J,t){dziadHose(J);const c=(t%2.8)/2.8;if(c<0.36||c>0.75)return;const q=(c-0.36)/0.39,A=J.arms[0],d=[A.wr[0]-A.el[0],A.wr[1]-A.el[1]],n=Math.hypot(d[0],d[1])||1,bx=A.wr[0]+d[0]/n*34,by=A.wr[1]+d[1]/n*34;ctx.fillStyle='rgba(245,215,110,'+(1-q)+')';for(let i=0;i<8;i++){const an=-0.7+i*0.18,r=6+q*44;ctx.beginPath();ctx.ellipse(bx-Math.cos(an)*r,by+Math.sin(an)*r+q*q*26,1.8,2.6,0,0,7);ctx.fill();}},skin:'#d8a07a',pants:'#3c3a34',coat:'#4a5140',sleeve:'#4a5140',shoe:'#1c1c1a',boot:'#1c1c1a',bootH:0.62,felt:'#9a948a',skirt:6,brow:'#d8d4ca',browW:1.8,
 holdNear:{fn:holdKropidlo},holdFar:{fn:holdBottle},
 torsoFx(){for(let y=-28;y<0;y+=7)ln(-10,y,10,y+0.6,'#2c3226',0.9);ln(-1,-34,-2.5,0,'#2c3226',0.6);
  ctx.fillStyle='#6a5a3a';ctx.fillRect(1.5,-21,5,5.5);
  
  ctx.fillStyle='#9a8a5a';ctx.fillRect(-10,-13.4,20,1.6);},
 torsoOver(t){ctx.fillStyle='#9a8a5a';ctx.beginPath();ctx.ellipse(-7.4,-12.6,1.4,1.1,0,0,7);ctx.fill();ln(-7.6,-12,-8.8,-7+Math.sin(t*2)*0.5,'#9a8a5a',0.9);ln(-7,-12,-7.4,-7.5+Math.sin(t*2+1)*0.5,'#9a8a5a',0.9);
  Pth([[-5.4,-33.4],[0,-35.4],[5.8,-33],[5,-29.5],[-0.5,-31.4],[-5.6,-30]]);fs('#3a4034',OLW*0.8);},
 faceFx(){},
 eyeFn(t){const bl=false;if(bl)ln(-5,-9.6,-2.8,-9.5,OL,0.7);else{Pth([[-5,-9.5],[-3.9,-10],[-2.7,-9.5],[-3.9,-9.2]]);fs('#e8e0d0',0);ctx.fillStyle='#4a5a6a';ctx.beginPath();ctx.arc(-4.2,-9.6,0.55,0,7);ctx.fill();ln(-5.1,-9.7,-2.6,-9.6,OL,0.6);}},
 headFx(t){const sw=Math.sin(t*2.2)*0.25;
  ctx.fillStyle='#c4554a';ctx.beginPath();ctx.ellipse(-7.6,-7.4,1.8,1.6,0.2,0,7);ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW*0.6;ctx.stroke();ln(-8,-7.6,-7.4,-7.2,'#9a3a32',0.35);
  Pth([[-6.8,-6.5],[-7.9,-3.8],[-8.6+sw,0.3],[-7+sw,5.4],[-3.6+sw,9.6],[-1.2,6.2],[2,1.2],[3.4,-3.5],[1,-5.6],[-3,-6.4]]);fs('#c9c6bc',OLW*0.8);
  ctx.strokeStyle='#8f8c84';ctx.lineWidth=0.45;for(let i=0;i<2;i++){ctx.beginPath();ctx.moveTo(-6+i*1.4,-5.5);ctx.quadraticCurveTo(-6.5+i*1.2+sw,0,-5+i*0.9+sw,4+i*0.6);ctx.stroke();}
  Pth([[-8.2,-6.6],[-4.6,-7],[-1,-5.8],[-2.8,-4.4],[-5.2,-5.2],[-7.6,-4.6]]);fs('#dedbd2',OLW*0.6);
  Pth([[-6.6,-11],[-2.2,-12.2],[-1.6,-11.2],[-4,-10.4],[-6.4,-10]]);fs('#dcd8ce',0);
  Pth([[3.8,-11],[6,-10],[6.2,-6.5],[4.8,-7]]);fs('#bdb9b0',0);
  Pth([[6.8,-11.4],[6.2,-15.6],[1.2,-18.8],[-5,-17.2],[-7.2,-14.6],[-11.6,-13.6],[-11.8,-12.5],[-6.2,-12.2],[-2.8,-12.8],[3.2,-12.3]]);fs('#3d3934');
  ctx.save();Pth([[6.8,-11.4],[6.2,-15.6],[1.2,-18.8],[-5,-17.2],[-7.2,-14.6],[-6.2,-12.2],[-2.8,-12.8],[3.2,-12.3]]);ctx.clip();ctx.fillStyle='#2a2724';ctx.fillRect(1,-20,8,10);ln(-4,-16.6,4,-17.6,'#55504a',0.5);ctx.restore();
  ln(-11.4,-12.8,-6.4,-12.4,'#1d1b19',0.7);}
};
CHR.trup={skin:'#8a9a72',pants:'#34322e',coat:'#3d3b36',sleeve:'#3d3b36',shoe:'#2a2420',skirt:7,ragged:true,bareNear:true,brow:'#3a4232',noMouth:true,
 torsoFx(t){ctx.fillStyle='#b9b196';Pth([[-8.6,-30],[-5,-31],[-4.4,-8],[-7.4,-8]]);ctx.fill();ln(-6.2,-30,-5.6,-17,'#5a1a18',1.6);
  Pth([[0,-23],[3.4,-24.4],[5,-19],[3,-14.6],[0.6,-16],[1.4,-19]]);fs('#1b1914',OLW*0.6);ctx.strokeStyle='#cfc8b0';ctx.lineWidth=0.7;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(1,-22+i*2.4);ctx.quadraticCurveTo(2.8,-23+i*2.4,4.2,-21.4+i*2.4);ctx.stroke();}
  ctx.fillStyle='rgba(90,70,40,.5)';ctx.beginPath();ctx.ellipse(4,-6,3,2,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(-3,-26,2,1.4,0,0,7);ctx.fill();},
 faceFx(){ctx.fillStyle='rgba(40,50,30,.5)';ctx.beginPath();ctx.ellipse(-2,-6,2.6,2,0,0,7);ctx.fill();},
 eyeFn(t){ctx.fillStyle='#14170f';ctx.beginPath();ctx.ellipse(-3.9,-9.7,1.9,1.3,0,0,7);ctx.fill();ctx.fillStyle='#d8e06a';ctx.beginPath();ctx.arc(-4.2,-9.7,0.5+0.1*Math.sin(t*5),0,7);ctx.fill();},
 headFx(t){const j=1.3+0.5*Math.sin(t*3);
  Pth([[-6.3,-4.8],[-1.5,-4.2],[-1.8,-1+j*0.4],[-5.6,-1.6+j]]);fs('#2a1210',OLW*0.6);
  ctx.strokeStyle='#2a2a22';ctx.lineWidth=0.4;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-4+i*1.4,-16.4+Math.abs(i-3)*0.3);ctx.quadraticCurveTo(-3+i*1.4,-19,-1+i*1.5,-18.6+Math.sin(t*2+i)*0.6);ctx.stroke();}
  }
};
CHR.milicjant={skin:'#dcae88',pants:'#4a586b',coat:'#55657a',sleeve:'#55657a',shoe:'#151515',boot:'#161616',bootH:0.42,skirt:5,brow:'#2a1a10',browW:1.3,
 holdNear:{fn:holdPalka,behind:true},
 torsoFx(){Pth([[-7.8,-27.5],[-2.2,-27.6],[-2.2,-21.4],[-7.6,-21.4]]);fs(tint('#55657a',0.9),OLW*0.5);Pth([[-8,-27.8],[-2,-27.9],[-2,-25.6],[-8,-25.5]]);fs(tint('#55657a',0.8),OLW*0.5);ctx.fillStyle='#c9a24a';ctx.beginPath();ctx.arc(-5,-26.6,0.6,0,7);ctx.fill();
  
  ctx.fillStyle='#5a3a22';ctx.beginPath();ctx.moveTo(6,-33);ctx.lineTo(8,-33);ctx.lineTo(-6,-11);ctx.lineTo(-8,-11);ctx.fill();},
 torsoOver(){ctx.fillStyle='#5a3a22';ctx.fillRect(-8.6,-13,17.2,2.8);ctx.strokeStyle=OL;ctx.lineWidth=OLW*0.6;ctx.strokeRect(-8.6,-13,17.2,2.8);ctx.fillStyle='#c9a24a';ctx.fillRect(-8.2,-12.8,2.4,2.4);
  Pth([[5.2,-11],[9.4,-11.4],[9.6,-4],[5.4,-4.4]]);fs('#4a2e1a',OLW*0.7);ctx.fillStyle='#2a1a10';ctx.fillRect(5.6,-10.6,3.6,1.2);
  Pth([[2,-34.4],[6.6,-33],[6.2,-31.4],[1.6,-32.6]]);fs(tint('#55657a',0.85),OLW*0.6);
  Pth([[-5,-33.4],[-2.4,-34.2],[-2.2,-31.6],[-4.6,-31]]);fs('#7a1c1c',OLW*0.5);},
 headFx(){Pth([[-8.2,-6.5],[-4.2,-7],[-2.4,-5.6],[-3.8,-4.6],[-6.4,-5.2],[-8.4,-4.8]]);fs('#3a2618',OLW*0.6);
  Pth([[5.6,-12],[5.6,-8],[4.4,-8.6],[4.2,-11.6]]);fs('#2a1a10',0);
  Pth([[6.6,-12.2],[7.8,-16.6],[2.2,-19.8],[-6.6,-19],[-8.4,-15.8],[-6.4,-12.8]]);fs('#55657a');
  ctx.save();Pth([[6.6,-12.2],[7.8,-16.6],[2.2,-19.8],[-6.6,-19],[-8.4,-15.8],[-6.4,-12.8]]);ctx.clip();ctx.fillStyle='#7a1c1c';ctx.fillRect(-10,-14.6,20,2.2);ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(2,-21,8,10);ctx.restore();
  Pth([[6.6,-12.2],[7.8,-16.6],[2.2,-19.8],[-6.6,-19],[-8.4,-15.8],[-6.4,-12.8]]);ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
  Pth([[-6.2,-13],[-12,-11.4],[-11.6,-10.2],[-5.8,-11.6]]);fs('#111');ln(-10.8,-11.2,-7,-12.2,'rgba(255,255,255,.35)',0.5);
  Pth([[-7.6,-17.4],[-6.4,-18.2],[-5.6,-17],[-6.6,-15.8]]);fs('#d4af37',OLW*0.4);}
};
CHR.lenin={torsoOver(){ctx.fillStyle='#d42a1e';Pth([[-8,-28],[-4,-30],[-6,-25.5]]);ctx.fill();Pth([[-6,-25.5],[-9.4,-24],[-8,-28]]);ctx.fill();ctx.beginPath();ctx.arc(-6.6,-27,1.4,0,7);ctx.fill();},skin:'#e0b290',pants:'#26262b',coat:'#2a2a30',sleeve:'#2a2a30',shoe:'#111',skirt:10,cuff:'#e8e4da',brow:'#6a3a20',browW:1.2,
 holdFar:{fn:holdCap},
 torsoFx(){Pth([[-8.6,-28],[-3.4,-31],[-2.6,-16],[-7.4,-12]]);ctx.fillStyle='#3a3a42';ctx.fill();
  Pth([[-6.8,-31.4],[-3.6,-32.2],[-4.4,-26],[-6.2,-24]]);ctx.fillStyle='#eae6dc';ctx.fill();
  Pth([[-5.8,-30.4],[-4.4,-30.6],[-4,-22],[-5.2,-20.6],[-6.2,-22]]);ctx.fillStyle='#9e1b1b';ctx.fill();
  
  ln(-3.4,-31,-2.6,-16,'#3c3c44',0.8);ln(-2.6,-16,-7.4,-12,'#3c3c44',0.8);
  ctx.fillStyle='#3a3a42';ctx.fillRect(0,-12,5,1);},
 faceFx(){ctx.fillStyle='rgba(255,236,210,.55)';ctx.beginPath();ctx.ellipse(-1.6,-15.4,3.2,1.4,-0.3,0,7);ctx.fill();},
 eyeFn(t){const bl=false;if(bl)ln(-5,-9.6,-2.6,-9.6,OL,0.7);else{Pth([[-5.1,-9.4],[-3.9,-10.2],[-2.5,-9.8],[-3.9,-9.1]]);fs('#ece6da',0);ctx.fillStyle='#3a2a1c';ctx.beginPath();ctx.arc(-4.3,-9.7,0.55,0,7);ctx.fill();ln(-5.2,-9.4,-2.4,-10,OL,0.6);}},
 headFx(t){Pth([[1.8,-13],[5.4,-12.6],[6,-8],[4.6,-6.2],[3.8,-9],[2.4,-11]]);fs('#7a4a2a',OLW*0.6);
  Pth([[-6.3,-4.6],[-5.4,-2],[-6.2,2.2],[-3.8,0.4],[-1.8,-1.2],[-3.2,-3.8]]);fs('#7a4a2a',OLW*0.7);
  Pth([[-8,-6.6],[-4.6,-7],[-2.6,-5.6],[-4.4,-5],[-7.8,-5]]);fs('#7a4a2a',OLW*0.5);
  ln(-6.4,-11.6,-2.4,-11,'#6a3a20',1.1);}
};
/* ---- sprzęt ---- */
const BRICK=['#8d4630','#7f3e2a','#94503a','#86432e'];
function nBimbrownia(t){
 ctx.fillStyle='rgba(0,0,0,.32)';ctx.beginPath();ctx.ellipse(4,0,44,5,0,0,7);ctx.fill();
 const fl=0.6+0.4*Math.sin(t*11)*Math.sin(t*7.3);
 const g0=ctx.createRadialGradient(-16,-2,1,-16,-2,26);g0.addColorStop(0,'rgba(255,150,50,'+(0.35*fl+0.15)+')');g0.addColorStop(1,'rgba(255,150,50,0)');ctx.fillStyle=g0;ctx.beginPath();ctx.ellipse(-16,-2,26,8,0,0,7);ctx.fill();
 ctx.save();ctx.beginPath();ctx.rect(-32,-22,34,22);ctx.clip();
 ctx.fillStyle=BRICK[0];ctx.fillRect(-32,-22,34,22);for(const y of [-16.5,-11])ln(-32,y,2,y,'#4a261a',0.9);
 ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(-32,-6,34,6);ctx.restore();
 ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.strokeRect(-32,-22,34,22);
 ctx.beginPath();ctx.moveTo(-24,0);ctx.lineTo(-24,-9);ctx.quadraticCurveTo(-16,-16,-8,-9);ctx.lineTo(-8,0);ctx.closePath();fs('#160a05');
 ctx.save();ctx.beginPath();ctx.moveTo(-24,0);ctx.lineTo(-24,-9);ctx.quadraticCurveTo(-16,-16,-8,-9);ctx.lineTo(-8,0);ctx.closePath();ctx.clip();
 for(let i=0;i<5;i++){const x=-22+i*3.4,h=5+3*Math.sin(t*9+i*1.7)+2*Math.sin(t*14.3+i*2.3);Pth([[x-2.6,0],[x+Math.sin(t*6+i)*0.8,-h],[x+2.6,0]]);ctx.fillStyle='#ff6a12';ctx.fill();Pth([[x-1.4,0],[x,-h*0.6],[x+1.4,0]]);ctx.fillStyle='#ffd25a';ctx.fill();}
 ctx.fillStyle='#2a1208';ctx.fillRect(-24,-1.6,16,1.6);ctx.fillStyle='#ff9a3a';for(let i=0;i<5;i++)ctx.fillRect(-22+i*3,-1.4,1.2,0.8);
 ctx.restore();
 const kx=-14,ky=-22;
 ctx.beginPath();ctx.moveTo(kx-15,ky);ctx.bezierCurveTo(kx-20,ky-10,kx-16,ky-26,kx,ky-27);ctx.bezierCurveTo(kx+16,ky-26,kx+20,ky-10,kx+15,ky);ctx.closePath();
 const g=ctx.createLinearGradient(kx-18,0,kx+18,0);g.addColorStop(0,'#5a240e');g.addColorStop(0.3,'#c8703a');g.addColorStop(0.42,'#f6b888');g.addColorStop(0.55,'#c06630');g.addColorStop(1,'#4a1c0a');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 ctx.beginPath();ctx.moveTo(kx-17.4,ky-12);ctx.quadraticCurveTo(kx,ky-10,kx+17.4,ky-12);sk('#5a240e',1.4);
 ctx.fillStyle='rgba(255,230,200,.5)';ctx.beginPath();ctx.ellipse(kx-6,ky-18,1.6,5,0.2,0,7);ctx.fill();
 ctx.beginPath();ctx.ellipse(kx,ky-27,9,3.4,0,Math.PI,0);ctx.closePath();fs('#b0602e');ctx.fillStyle='#8a4a22';ctx.fillRect(kx-1.4,ky-34,2.8,4);ctx.strokeStyle=OL;ctx.lineWidth=OLW*0.7;ctx.strokeRect(kx-1.4,ky-34,2.8,4);
 for(const sx of [-9.5,9.5]){Pth([[kx+sx-1.4,ky-28],[kx+sx+1.4,ky-28],[kx+sx+1,ky-24],[kx+sx-1,ky-24]]);fs('#3a3a3a',OLW*0.6);}
 ctx.beginPath();ctx.moveTo(kx+1,ky-32);ctx.bezierCurveTo(kx+8,ky-44,22,ky-40,22,-40);sk(OL,4.6);ctx.beginPath();ctx.moveTo(kx+1,ky-32);ctx.bezierCurveTo(kx+8,ky-44,22,ky-40,22,-40);sk('#b8622e',3);ctx.beginPath();ctx.moveTo(kx+1.6,ky-33);ctx.bezierCurveTo(kx+8,ky-44.6,22,ky-41,21.5,-41);sk('#f0a070',0.8);
 const bx0=10,bx1=32,by0=-40,by1=-2;
 ctx.beginPath();ctx.moveTo(bx0+1,by1);ctx.quadraticCurveTo(bx0-1.4,(by0+by1)/2,bx0+1,by0);ctx.lineTo(bx1-1,by0);ctx.quadraticCurveTo(bx1+1.4,(by0+by1)/2,bx1-1,by1);ctx.closePath();
 const g2=ctx.createLinearGradient(bx0,0,bx1,0);g2.addColorStop(0,'#5a3a1e');g2.addColorStop(0.35,'#9a6e40');g2.addColorStop(1,'#4a2e16');ctx.fillStyle=g2;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 for(const y of [by0+4,(by0+by1)/2,by1-4]){ctx.beginPath();ctx.moveTo(bx0-0.4,y);ctx.lineTo(bx1+0.4,y);sk(OL,2.6);ctx.beginPath();ctx.moveTo(bx0-0.4,y);ctx.lineTo(bx1+0.4,y);sk('#4a4a4a',1.6);ln(bx0+2,y-0.4,bx1-6,y-0.4,'#8a8a8a',0.4);}
 ctx.beginPath();ctx.ellipse((bx0+bx1)/2,by0,(bx1-bx0)/2-1,2,0,0,7);fs('#23323a',OLW*0.8);ctx.strokeStyle='rgba(180,210,220,.4)';ctx.lineWidth=0.5;ctx.beginPath();ctx.ellipse((bx0+bx1)/2+Math.sin(t)*1.5,by0,4,0.8,0,0,7);ctx.stroke();
 Pth([[bx1-1,-25],[bx1+5,-25.6],[bx1+5.4,-23],[bx1-1,-22.6]]);fs('#b8622e',OLW*0.8);
 const jx=42;ctx.beginPath();ctx.arc(jx,-9,9,0,7);ctx.fillStyle='rgba(190,225,215,.38)';ctx.fill();
 const lvl=-3-9*((t*0.04)%1);ctx.save();ctx.beginPath();ctx.arc(jx,-9,9,0,7);ctx.clip();ctx.fillStyle='rgba(232,190,80,.85)';ctx.fillRect(jx-10,lvl,20,20);ctx.fillStyle='rgba(255,240,180,.8)';ctx.fillRect(jx-10,lvl,20,0.7);ctx.restore();
 ctx.beginPath();ctx.arc(jx,-9,9,0,7);ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 Pth([[jx-2,-17],[jx+2,-17],[jx+2.2,-21],[jx-2.2,-21]]);fs('rgba(190,225,215,.5)',OLW*0.8);
 ctx.fillStyle='rgba(255,255,255,.65)';ctx.beginPath();ctx.ellipse(jx-4.4,-11,1.2,3.4,0.4,0,7);ctx.fill();
 const dc=(t*1.4)%1;if(dc<0.7){const dy=-22.4+dc/0.7*6;ctx.fillStyle='#f0d070';ctx.beginPath();ctx.ellipse(bx1+4.8,dy,0.7,1,0,0,7);ctx.fill();}
 for(let i=0;i<3;i++){const p=((t*0.5+i/3)%1);ctx.fillStyle='rgba(235,235,235,'+(0.45*(1-p))+')';ctx.beginPath();ctx.arc(kx+Math.sin(t*2+i*2)*2+p*4,ky-36-p*16,1.6+p*3,0,7);ctx.fill();}
}
function nBoot(s){ // gumofilc; początek w kostce, nosek w +x
 Pth([[-4.6,-18],[4.6,-18],[5,-5],[11.6,-4],[13.4,-0.4],[12.4,2.4],[-5.2,2.4],[-5.6,-5]]);fs('#1e1e1e');
 ctx.fillStyle='#555';ctx.fillRect(-5.2,1,17.6,1.4);
 ctx.fillStyle='rgba(255,255,255,.28)';ctx.fillRect(-2.6,-16,1.4,14);ctx.beginPath();ctx.ellipse(7.4,-2.2,3.2,0.9,0,0,7);ctx.fill();
 Pth([[-6.4,-24],[6.4,-24],[5.4,-17.4],[-5.4,-17.4]]);fs('#c8c0ae');ctx.fillStyle='#e4ddcc';ctx.fillRect(-5.8,-23.4,11.6,1.6);
 ctx.strokeStyle='#8a8272';ctx.lineWidth=0.6;for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(-5+i*2,-21.6);ctx.lineTo(-4.4+i*2,-18.6);ctx.stroke();}
}
function catapultState(t){const T=2.4,c=(t%T)/T;let a;
 if(c<0.55)a=-1.2+(c>0.42?0.03*Math.sin(t*40):0);else if(c<0.62)a=lerp(-1.2,0.38,Math.pow((c-0.55)/0.07,1.6));else if(c<0.68)a=0.38-0.1*Math.sin((c-0.62)/0.06*Math.PI);else a=lerp(0.38,-1.2,ease((c-0.68)/0.32));
 return{c,a,loaded:c<0.6||c>0.86,fly:c>=0.6?(c-0.6)/0.4:-1};}
function nCatapult(t,st,ammo){
 st=st||catapultState(t);
 ctx.fillStyle='rgba(0,0,0,.32)';ctx.beginPath();ctx.ellipse(-2,0,38,5,0,0,7);ctx.fill();
 const W='#7a5634',Wd='#4e3420';
 const wood=(p)=>{Pth(p);fs(W);ctx.save();Pth(p);ctx.clip();ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(-60,-6,120,60);ctx.restore();};
 Pth([[-36,-17],[30,-14],[30,-7.4],[-36,-10]]);fs(W);ln(-30,-12.4,22,-10.6,'rgba(50,30,15,.55)',0.5);ln(-20,-11.2,10,-9.8,'rgba(50,30,15,.45)',0.4);
 for(const x of [-30,-10,18])ctx.fillStyle='#2a2a2a',ctx.fillRect(x,-12+((x+36)/66)*2.5,1.2,1.2);
 Pth([[-12,-14],[-6.5,-14],[0.5,-33],[-4,-34]]);fs(W);Pth([[6,-13.6],[11.5,-13.2],[1.6,-33],[-2.4,-34]]);fs(tint(W,0.88));
 Pth([[6,-46],[11,-44],[9.6,-41.4],[4.6,-43.4]]);fs(Wd);ctx.fillStyle='#b8a070';ctx.beginPath();ctx.ellipse(6.4,-44.4,2.6,1.6,0.4,0,7);ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW*0.7;ctx.stroke();
 Pth([[9,-43],[12.4,-43.6],[9.4,-13.4],[5.8,-13.4]]);fs(tint(W,0.8));
 const gr=-16,gx=-18,rot=st.c>0.68?(st.c-0.68)*30:0;ctx.save();ctx.translate(gx,gr);ctx.rotate(rot);ctx.beginPath();ctx.arc(0,0,4.6,0,7);fs('#3a3a3a');ctx.fillStyle='#5a5a5a';for(let i=0;i<8;i++){ctx.rotate(Math.PI/4);ctx.fillRect(-0.8,-5.8,1.6,1.6);}ctx.restore();
 ln(gx,gr,gx-5,gr-5,OL,2.2);ln(gx,gr,gx-5,gr-5,'#6a6a6a',1.2);
 const piv=[-1.5,-31],tip=[piv[0]+Math.sin(st.a)*38,piv[1]-Math.cos(st.a)*38];
 if(st.c<0.55||st.c>0.68){const k=st.c>0.68?ease((st.c-0.68)/0.32):1;ln(gx,gr,lerp(piv[0],tip[0],0.55*k+0.2),lerp(piv[1],tip[1],0.55*k+0.2),'#a8946a',0.8);}
 limb(piv,tip,6.4,4.6,W,false);
 ctx.beginPath();ctx.arc(piv[0],piv[1],5.4,0,7);fs('#a8946a');
 ctx.fillStyle='#2a2a2a';ctx.beginPath();ctx.arc(piv[0],piv[1],1.2,0,7);ctx.fill();
 ctx.save();ctx.translate(tip[0],tip[1]);ctx.rotate(st.a);
 ctx.beginPath();ctx.moveTo(-6,-1);ctx.quadraticCurveTo(0,7,6,-1);ctx.lineTo(4.6,-2);ctx.quadraticCurveTo(0,3.6,-4.6,-2);ctx.closePath();fs('#6a4428');
 if(st.loaded){if(ammo==='food'){ctx.fillStyle='#6a6a6a';Pth([[-6.5,-2],[6.5,-2],[5.4,-9],[-5.4,-9]]);fs('#6e6e6e');ln(-5.4,-9,5.4,-9,'#9a9a9a',0.8);ctx.beginPath();ctx.arc(-1.6,-10.5,4.6,0,7);fs('#7cc24a');ln(-4.6,-11.6,0.8,-8,'#4f8a2a',0.8);ln(-3,-14,-1,-7.4,'#4f8a2a',0.6);Pth([[1.6,-13],[9,-15.4],[9.6,-13.6],[2,-11.4]]);fs('#efe7d2',OLW*0.7);ctx.beginPath();ctx.arc(9.6,-15.2,1.6,0,7);fs('#efe7d2',OLW*0.6);}else if(ammo==='holy'){ctx.save();ctx.translate(0,-6);ctx.rotate(-0.3);Pth([[-2.6,-7],[2.6,-7],[2.8,4],[-2.8,4]]);fs('rgba(130,185,255,.95)');Pth([[-1.2,-7],[1.2,-7],[1,-11],[-1,-11]]);fs('rgba(130,185,255,.95)',OLW*0.7);ctx.fillStyle='#fff';ctx.fillRect(-0.4,-4,0.8,5);ctx.fillRect(-1.6,-2.6,3.2,0.8);ctx.restore();}else{ctx.save();ctx.translate(0,-2);ctx.rotate(-0.4);ctx.scale(0.8,0.8);nBoot();ctx.restore();}}
 ctx.restore();
 for(const wx of [-26,18]){ctx.save();ctx.translate(wx,-7);ctx.scale(1.12,1.12);ctx.beginPath();ctx.arc(0,0,6.6,0,7);fs('#5a3e24');ctx.beginPath();ctx.arc(0,0,6.6,0,7);sk('#3a3a3a',1.4);for(let i=0;i<6;i++){ctx.rotate(Math.PI/3);ln(0,0,0,-5.6,'#7a5634',1.1);}ctx.beginPath();ctx.arc(0,0,1.6,0,7);fs('#3a3a3a',OLW*0.6);ctx.beginPath();ctx.arc(0,0,7.3,0,7);ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();ctx.restore();}
 return{tip};
}
function nSamowar(t,kk,noStream){
 const T=3.2,c=(t%T)/T,open=c>0.45&&c<0.78;let k=open?ease(Math.min((c-0.45)/0.05,(0.78-c)/0.05)):0;if(kk!=null)k=kk;
 ctx.fillStyle='rgba(0,0,0,.32)';ctx.beginPath();ctx.ellipse(0,0,32,5,0,0,7);ctx.fill();
 ctx.beginPath();ctx.ellipse(0,-2,28,3.6,0,0,7);fs('#8a6420');ctx.beginPath();ctx.ellipse(0,-2.6,25,2.6,0,0,7);ctx.fillStyle='#c9962e';ctx.fill();
 for(const fx of [-11,11]){Pth([[fx-2.4,-3],[fx+2.4,-3],[fx+1.4,-7],[fx-1.4,-7]]);fs('#8a6420',OLW*0.7);}
 const brass=(x0,x1)=>{const g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,'#5e400f');g.addColorStop(0.28,'#b8862a');g.addColorStop(0.4,'#ffe7a0');g.addColorStop(0.52,'#d4a43a');g.addColorStop(1,'#5a3c0e');return g;};
 Pth([[-10,-6],[10,-6],[7,-16],[-7,-16]]);ctx.fillStyle=brass(-10,10);ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 const glow=0.55+0.45*Math.sin(t*8)*Math.sin(t*5.1);for(const vx of [-5,0,5]){ctx.beginPath();ctx.moveTo(vx-1.4,-8);ctx.lineTo(vx-1.4,-11.6);ctx.arc(vx,-11.6,1.4,Math.PI,0);ctx.lineTo(vx+1.4,-8);ctx.closePath();ctx.fillStyle='rgba(255,'+Math.round(110+60*glow)+',30,'+(0.6+0.4*glow)+')';ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW*0.6;ctx.stroke();}
 const body=()=>{ctx.beginPath();ctx.moveTo(-7,-16);ctx.bezierCurveTo(-23,-19,-23,-45,-12,-51);ctx.lineTo(12,-51);ctx.bezierCurveTo(23,-45,23,-19,7,-16);ctx.closePath();};
 body();ctx.fillStyle=brass(-20,20);ctx.fill();
 ctx.save();body();ctx.clip();ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(6,-52,20,40);ctx.restore();
 body();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 ctx.beginPath();ctx.moveTo(-20.4,-36);ctx.quadraticCurveTo(0,-33,20.4,-36);sk('#7a5214',1.8);
 ctx.beginPath();ctx.ellipse(0,-25,4.4,5,0,0,7);fs('#7a1a14',OLW*0.8);ctx.fillStyle='#e8c050';Pth([[0,-28.6],[2.6,-25.8],[1.6,-21.6],[0,-22.8],[-1.6,-21.6],[-2.6,-25.8]]);ctx.fill();ctx.fillRect(-0.5,-30,1,1.6);
 for(const sx of [-1,1]){ctx.beginPath();ctx.moveTo(sx*18.6,-43);ctx.bezierCurveTo(sx*27,-44,sx*27,-34,sx*20.6,-30);sk(OL,3.6);ctx.beginPath();ctx.moveTo(sx*18.6,-43);ctx.bezierCurveTo(sx*27,-44,sx*27,-34,sx*20.6,-30);sk('#b8862a',2);ctx.save();ctx.translate(sx*25.4,-37.6);Pth([[-1.4,-2.6],[1.4,-2.6],[1.4,2.6],[-1.4,2.6]]);fs('#2a1a10',OLW*0.6);ctx.restore();}
 Pth([[17,-21.4],[29,-21],[29.6,-17.4],[27.4,-15.6],[26.4,-18.4],[17,-18.4]]);ctx.fillStyle=brass(17,30);ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 ctx.save();ctx.translate(24,-21.6);ctx.rotate(-k*1.3);Pth([[-0.8,0],[0.8,0],[0.8,-3],[3.4,-4],[3.4,-5.6],[-3.4,-5.6],[-3.4,-4],[-0.8,-3]]);fs('#d4a43a',OLW*0.7);ctx.restore();
 Pth([[-13,-51],[13,-51],[12,-54],[9,-54],[8,-56],[-8,-56],[-9,-54],[-12,-54]]);ctx.fillStyle=brass(-13,13);ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 Pth([[-3.4,-56],[3.4,-56],[3,-59],[-3,-59]]);fs('#8a6420',OLW*0.8);
 const tp=()=>{ctx.beginPath();ctx.ellipse(0,-64,10,6,0,0,7);};
 tp();ctx.fillStyle='#f2efe6';ctx.fill();ctx.save();tp();ctx.clip();ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(3,-72,10,12);ctx.fillStyle='#2a4fa0';ctx.fillRect(-10,-60.4,20,0.8);ctx.restore();tp();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 ctx.beginPath();ctx.moveTo(8.6,-62);ctx.quadraticCurveTo(15,-64,16,-70);sk(OL,3.2);ctx.beginPath();ctx.moveTo(8.6,-62);ctx.quadraticCurveTo(15,-64,16,-70);sk('#f2efe6',1.8);
 ctx.beginPath();ctx.moveTo(-9,-66);ctx.bezierCurveTo(-15,-68,-15,-60,-9.4,-61);sk(OL,2.6);ctx.beginPath();ctx.moveTo(-9,-66);ctx.bezierCurveTo(-15,-68,-15,-60,-9.4,-61);sk('#f2efe6',1.2);
 ctx.beginPath();ctx.ellipse(0,-69.6,4.4,1.6,0,0,7);fs('#ebe7dc',OLW*0.7);ctx.beginPath();ctx.arc(0,-71.6,1.3,0,7);fs('#2a4fa0',OLW*0.6);
 for(let i=0;i<3;i++){const p=((t*0.45+i/3)%1);ctx.fillStyle='rgba(240,240,240,'+(0.5*(1-p))+')';ctx.beginPath();ctx.arc(16.4+p*3+Math.sin(t*2+i)*1.4,-71-p*14,1.2+p*3,0,7);ctx.fill();}
 if(k>0&&!noStream){const len=62*k;ctx.beginPath();ctx.moveTo(28.6,-15.6);ctx.quadraticCurveTo(28.6+len*0.4,-17-6*k,28.6+len,-6);sk('rgba(200,230,255,.55)',3.6*k+0.5);ctx.beginPath();ctx.moveTo(28.6,-15.6);ctx.quadraticCurveTo(28.6+len*0.4,-17-6*k,28.6+len,-6);sk('rgba(255,255,255,.85)',1.2);
  for(let i=0;i<7;i++){const p=((t*2.2+i/7)%1);const x=28.6+len*p,y=-15.6+(-6+15.6)*p*p-6*k*Math.sin(p*Math.PI)*0.5;ctx.fillStyle='rgba(245,248,255,'+(0.55*(1-p*0.5))+')';ctx.beginPath();ctx.arc(x,y-4-p*8,1.6+p*4,0,7);ctx.fill();}}
 return{open:k>0};
}


