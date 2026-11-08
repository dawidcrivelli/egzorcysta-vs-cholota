/* ===== GRAFIKA v3: reszta postaci, sprzętu i API dla gry ===== */
let CS={};
/* --- przedmioty w rękach --- */
function holdStamp(far,ang){ctx.save();ctx.translate(0,4);ctx.rotate(-ang+Math.PI);ctx.scale(0.9,0.9);Pth([[-3,0],[3,0],[2.4,-9],[-2.4,-9]]);fs('#8a5a32');ctx.beginPath();ctx.arc(0,-11,4.4,0,7);fs('#a06a3a');Pth([[-9,0],[9,0],[9,4],[-9,4]]);fs('#3a3a3a');Pth([[-8.4,4],[8.4,4],[8.4,7],[-8.4,7]]);fs('#c42a20');ctx.restore();}
function holdMegafon(far,ang){ctx.save();ctx.translate(0,3);ctx.rotate(-ang-Math.PI/2);ctx.scale(0.9,0.9);Pth([[-2,-2.4],[6,-3],[18,-9],[18,9],[6,3],[-2,2.4]]);fs('#e8e4da');ctx.fillStyle='#c42a20';ctx.fillRect(3,-3.2,3,6.4);ctx.beginPath();ctx.ellipse(18,0,2.4,9,0,0,7);fs('#b8bcc0');ctx.restore();}
function holdTeczka(far,ang){ctx.save();ctx.translate(0,4);ctx.rotate(-ang);ctx.scale(0.75,0.75);Pth([[-7,2],[8,2],[8,13],[-7,13]]);fs('#6b3f1f');ctx.fillStyle='#4e2c14';ctx.fillRect(-7,6.5,15,1.2);ctx.fillStyle='#c9a24a';ctx.fillRect(0,5.6,2.4,2.6);ln(-2,2,-1,-1,OL,1.6);ln(3,2,2,-1,OL,1.6);ln(-1,-1,2,-1,OL,1.6);ctx.restore();}
function holdBeer(far,ang){ctx.save();ctx.translate(0,4);ctx.rotate(-ang);Pth([[-2.2,-7],[2.2,-7],[2.4,6],[-2.4,6]]);fs('#5a2e0e');Pth([[-1,-7],[1,-7],[0.9,-11.6],[-0.9,-11.6]]);fs('#5a2e0e',OLW*0.7);ctx.fillStyle='#e8d8a0';ctx.fillRect(-2,-3,4,4);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(-1.5,-6,0.8,10);ctx.restore();}
function holdSign(far,ang){if(!(CS.shield>0))return;ctx.save();ctx.translate(0,3);ctx.rotate(-ang);ctx.scale(0.62,0.62);
 Pth([[-1.6,8],[1.6,8],[1.6,-26],[-1.6,-26]]);fs('#7a5232');
 Pth([[-48,-52],[-2,-52],[-2,-22],[-48,-22]]);fs('#c42a20');ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(-10,-52,8,30);
 ctx.font='900 9px '+FONT;ctx.textAlign='center';ctx.fillStyle='#fff6dc';ctx.fillText('PLAN',-25,-40);ctx.fillText('5-LETNI',-25,-28);ctx.restore();}
function holdRifle(bay){return function(far,ang){ctx.save();ctx.translate(0,4);ctx.rotate(-ang-0.35);ctx.scale(0.62,0.62);
 Pth([[14,-1],[24,2.6],[24,6.4],[13,3.4]]);fs('#6b4a2a');Pth([[13,-0.6],[-20,-2.4],[-20,0.8],[13,3.2]]);fs('#7a5634');Pth([[-20,-1.8],[-34,-2],[-34,-0.2],[-20,0.2]]);fs('#4a4a4e');Pth([[2,0],[6,0],[5,3.6],[3,3.6]]);fs('#3a3a3e',OLW*0.6);
 if(bay){Pth([[-33,-2.2],[-46,-1.4],[-33,-0.2]]);fs('#c9ced4',OLW*0.7);}ctx.restore();};}
function holdKilof(far,ang){ctx.save();ctx.translate(0,4);ctx.rotate(1.3);ctx.scale(0.8,0.8);Pth([[-1.4,-4],[1.4,-4],[1.2,26],[-1.2,26]]);fs('#8a6238');ctx.save();ctx.translate(0,26);Pth([[-14,-2],[-4,-4],[4,-4],[14,-2],[14,0],[4,0.6],[-4,0.6],[-14,0]]);fs('#7a7e84');ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(-12,-2.4,8,0.8);ctx.restore();ctx.restore();}
function holdPapers(far,ang){ctx.save();ctx.translate(0,5);ctx.rotate(-ang+0.2);ctx.scale(0.75,0.75);Pth([[-6,-6],[5,-7],[6,7],[-5,8]]);fs('#efe9dc');for(let i=0;i<4;i++)ln(-3.6,-3+i*2.6,3.6,-3.6+i*2.6,'#9a9488',0.5);ctx.fillStyle='#b8241c';ctx.fillRect(-3,-5,2,1.4);ctx.restore();}
/* --- nowe postaci --- */
const SUITB=[[7,-1],[7.6,-14],[7.2,-27],[5.6,-32.6],[0,-34.6],[-5.2,-33.2],[-8,-27.5],[-10.6,-19],[-11,-11],[-8,-1]];
CHR.urzednik={skin:'#e6bd98',pants:'#3f4652',coat:'#5c6573',sleeve:'#5c6573',shoe:'#1a1a1a',skirt:8,cuff:'#e8e4da',brow:'#6a6a6a',holdNear:{fn:holdStamp},holdFar:{fn:holdTeczka},
 torsoFx(){Pth([[-8.4,-30],[-4,-33],[-3,-17],[-7.6,-14]]);ctx.fillStyle='#e8e4da';ctx.fill();Pth([[-6,-31.6],[-4.6,-31.8],[-4,-21],[-5.4,-19.6],[-6.6,-21]]);ctx.fillStyle='#8a1e1e';ctx.fill();ln(-4,-33,-3,-17,'#3e4552',0.8);ln(-3,-17,-7.6,-14,'#3e4552',0.8);},
 headFx(){Pth([[5.4,-12],[5,-16],[0,-18.6],[-5.6,-15],[-3,-15.6],[0,-15],[3,-13.6]]);fs('#8a8a8a',OLW*0.6);ln(-1,-17.6,1.6,-14.4,'#5a5a5a',0.5);
  ctx.strokeStyle=OL;ctx.lineWidth=OLW*0.8;ctx.strokeRect(-6,-11.2,3.6,2.8);ln(-2.4,-10,1.6,-10.6,OL,OLW*0.7);ctx.fillStyle='rgba(200,230,255,.25)';ctx.fillRect(-6,-11.2,3.6,2.8);ln(-5.4,-7.8,-3,-7.6,tint('#e6bd98',0.7),0.5);}};
CHR.sasiad={skin:'#e2a982',pants:'#2f4f9a',coat:'#eceae0',sleeve:'#e2a982',shoe:'#e8e8e8',skirt:0,legStripe:'#f0f0f0',brow:'#3a2618',holdNear:{fn:holdBeer},
 body:[[7,-1],[7.6,-14],[7.2,-27],[5.6,-32.6],[0,-34.6],[-5.2,-33.2],[-8,-27.5],[-11.6,-18],[-12,-10],[-8.4,-1]],
 torsoFx(){ctx.fillStyle='rgba(180,150,60,.35)';ctx.beginPath();ctx.ellipse(-7,-14,2.4,1.6,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(-3,-24,1.4,1,0,0,7);ctx.fill();ctx.fillStyle='#e2a982';Pth([[-5.6,-34],[3.6,-35],[1,-30],[-3.6,-30]]);ctx.fill();ln(-2,-36,-1,-32,'#3a2618',0.4);ln(0,-36,0.4,-32,'#3a2618',0.4);},
 headFx(){ctx.fillStyle='#c4554a';ctx.beginPath();ctx.ellipse(-7.6,-7.4,1.8,1.5,0.2,0,7);ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW*0.5;ctx.stroke();
  
  Pth([[-8.2,-6.6],[-4,-7],[-2,-5.6],[-4,-5],[-7.8,-5]]);fs('#4a3020',OLW*0.5);
  Pth([[6.8,-11.4],[6.2,-15.6],[1.2,-18.8],[-5,-17.2],[-7.2,-14.6],[-11.6,-13.6],[-11.8,-12.5],[-6.2,-12.2],[-2.8,-12.8],[3.2,-12.3]]);fs('#5a5047');ln(-11.4,-12.8,-6.4,-12.4,'#2a2420',0.7);ln(-4,-16.6,4,-17.6,'#6e655a',0.5);}};
CHR.komunista={skin:'#e8b892',pants:'#33333b',coat:'#b02a20',sleeve:'#b02a20',shoe:'#1a1a1a',skirt:0,brow:'#2a1a10',browW:1.5,holdNear:{fn:holdSign,behind:true},
 torsoFx(){ln(-2,-34,-3,-1,'#7a1a14',0.6);Pth([[-7,-27],[-3,-27],[-3,-23],[-7,-23]]);fs(tint('#b02a20',0.85),OLW*0.4);ctx.fillStyle='#3a2a1a';ctx.fillRect(-10,-3,20,2.4);},
 headFx(t){Pth([[-6.3,-5.2],[-2.6,-4.8],[-3,-1.8],[-5.6,-2.4]]);fs('#3a0d0d',OLW*0.5);ctx.fillStyle='#e8e0cc';ctx.fillRect(-5.6,-5,2.4,0.8);
  Pth([[6.8,-11.4],[6.2,-15.6],[1.2,-18.8],[-5,-17.2],[-7.2,-14.6],[-11.6,-13.6],[-11.8,-12.5],[-6.2,-12.2],[-2.8,-12.8],[3.2,-12.3]]);fs('#3a3a3a');
  ctx.fillStyle='#d42a1e';Pth([[-5.4,-16.4],[-4.8,-14.8],[-3.2,-14.8],[-4.4,-13.8],[-4,-12.2],[-5.4,-13.2],[-6.8,-12.2],[-6.4,-13.8],[-7.6,-14.8],[-6,-14.8]]);ctx.fill();}};
CHR.wampir={skin:'#e6e2ef',pants:'#18181c',coat:'#1c1c22',sleeve:'#1c1c22',shoe:'#0e0e10',skirt:12,cuff:'#f0f0f0',brow:'#111',browW:1.4,
 back(J,t){const s=J.sh,H=J.H,w=Math.sin(t*4)*2;Pth([[s[0]+6,s[1]-2],[s[0]-4,s[1]-1],[H[0]-8,H[1]+34],[H[0]+4,H[1]+36],[H[0]+18+w,H[1]+30]]);fs('#101012');Pth([[s[0]+3,s[1]],[s[0]-2,s[1]+1],[H[0]-4,H[1]+31],[H[0]+12+w,H[1]+28]]);fs('#7a0f18',0);},
 torsoFx(){Pth([[-8.6,-30],[-4,-33],[-3.4,-12],[-7.6,-10]]);ctx.fillStyle='#f0eee8';ctx.fill();Pth([[-6.4,-31],[-4,-31.4],[-5,-29],[-6.6,-29]]);ctx.fillStyle='#8a0f18';ctx.fill();ctx.fillStyle='#c9a24a';ctx.beginPath();ctx.arc(-5.6,-26,1.4,0,7);ctx.fill();ctx.fillStyle='#8a0f18';ctx.beginPath();ctx.arc(-5.6,-26,0.7,0,7);ctx.fill();},
 torsoOver(){Pth([[-6,-33.4],[0,-35],[6,-33],[7,-38],[0,-37.6],[-5,-38.6]]);fs('#101012',OLW*0.8);},
 eyeFn(){Pth([[-5.1,-9.6],[-3.9,-10.4],[-2.5,-9.7],[-3.9,-9.1]]);fs('#f0e0e0',0);ctx.fillStyle='#c41a1a';ctx.beginPath();ctx.arc(-4.2,-9.7,0.7,0,7);ctx.fill();ln(-5.1,-9.6,-2.5,-9.7,OL,0.5);},
 headFx(){Pth([[5.2,-11],[5.2,-15],[0,-18.8],[-5.6,-14.8],[-4.2,-13.6],[-2.6,-15],[-1.4,-13],[2,-14]]);fs('#0e0e10',OLW*0.6);Pth([[2.6,-10],[4.6,-13.6],[4.4,-8.4],[3.6,-6.6]]);fs('#e6e2ef',OLW*0.6);
  ctx.fillStyle='#fff';Pth([[-6,-4.6],[-5.4,-4.6],[-5.7,-2.8]]);ctx.fill();Pth([[-4.4,-4.4],[-3.8,-4.4],[-4.1,-2.6]]);ctx.fill();ctx.fillStyle='rgba(120,100,140,.35)';ctx.beginPath();ctx.ellipse(-3.6,-8.4,1.8,0.8,0,0,7);ctx.fill();}};
CHR.mumia={skin:'#e4dcc4',pants:'#ddd4ba',coat:'#e0d8bf',sleeve:'#e0d8bf',shoe:'#c2b796',hand:'#e4dcc4',skirt:0,brow:'#6e6248',noMouth:true,wrap:'#7a6c4e',
 torsoFx(){ctx.strokeStyle='#7a6c4e';ctx.lineWidth=1.1;for(let y=-33;y<0;y+=4){ctx.beginPath();ctx.moveTo(-12,y+1.6);ctx.lineTo(12,y-1.6);ctx.stroke();}ctx.fillStyle='rgba(90,70,40,.35)';ctx.beginPath();ctx.ellipse(2,-14,3,2,0,0,7);ctx.fill();},
 front(J,t){const h=J.H,w=Math.sin(t*3)*4;Pth([[h[0]-14,h[1]-16],[h[0]-9,h[1]-16],[h[0]-14+w,h[1]+14],[h[0]-19+w,h[1]+13]]);fs('#e4dcc4');Pth([[h[0]+8,h[1]-30],[h[0]+12,h[1]-30],[h[0]+20-w,h[1]-8],[h[0]+16-w,h[1]-8]]);fs('#e4dcc4');},
 eyeFn(t){ctx.fillStyle='#1a140a';Pth([[-8,-11.4],[1,-11.8],[1,-8.4],[-8,-8]]);ctx.fill();ctx.fillStyle='#ffe066';ctx.beginPath();ctx.arc(-4.6,-9.8,1.1+0.2*Math.sin(t*6),0,7);ctx.fill();},
 headFx(){ctx.strokeStyle='#7a6c4e';ctx.lineWidth=0.9;for(const y of [-15.5,-13.3,-6.6,-4.4,-2.2]){ctx.beginPath();ctx.moveTo(-8.6,y);ctx.lineTo(7.6,y+1.2);ctx.stroke();}}};
CHR.lunatyk={skin:'#ecc29e',pants:'#a8c8e8',coat:'#a8c8e8',sleeve:'#a8c8e8',shoe:'#b07a4a',skirt:0,brow:'#5a3a22',legStripe:'#e8f2fa',
 torsoFx(){ctx.strokeStyle='#e8f2fa';ctx.lineWidth=1.3;for(let x=-9;x<9;x+=3.4){ctx.beginPath();ctx.moveTo(x,-36);ctx.lineTo(x+0.6,0);ctx.stroke();}},
 eyeFn(){ln(-5.2,-9.4,-2.6,-9.4,OL,0.7);ln(-5,-9.4,-5.6,-8.6,OL,0.4);},
 headFx(t){ctx.fillStyle='#3a0d0d';ctx.beginPath();ctx.ellipse(-5.4,-4,1.2,1+0.4*Math.sin(t*2),0,0,7);ctx.fill();
  Pth([[6.6,-11],[6.6,-15.6],[1,-19],[-5.6,-16.4],[-6.6,-13.4],[0,-14],[8,-12]]);fs('#4a78c0');Pth([[6.6,-15.6],[1,-19],[10,-20],[16,-14+Math.sin(t*2)],[13,-12]]);fs('#4a78c0');ctx.beginPath();ctx.arc(16,-13+Math.sin(t*2),2.4,0,7);fs('#fff');Pth([[-6.8,-14.4],[7,-12],[7,-10.4],[-6.8,-12.6]]);fs('#fff',OLW*0.6);
  ctx.font='700 4px '+FONT;ctx.fillStyle='rgba(220,230,255,'+(0.5+0.5*Math.sin(t*2))+')';ctx.fillText('z',-10-Math.sin(t)*2,-20-(t*6%8));}};
CHR.carski={skin:'#e2b590',pants:'#4e5434',coat:'#626a40',sleeve:'#626a40',shoe:'#121212',boot:'#141414',bootH:0.55,skirt:24,brow:'#3a2410',browW:1.5,holdNear:{fn:holdRifle(true)},
 torsoFx(){for(const x of [-7,-3.4])ctx.fillStyle='#3a2a18';ctx.fillRect(-10,-12,20,2.6);ctx.fillStyle='#c9a24a';ctx.fillRect(-8.6,-12,2.6,2.6);},
 torsoOver(){Pth([[1.6,-34.6],[6.8,-33],[6.4,-31.2],[1.2,-32.6]]);fs('#a42a20',OLW*0.6);},
 headFx(){Pth([[-8.6,-6.8],[-4.2,-7.4],[-0.6,-6.2],[1,-7.6],[-1,-4.6],[-4.6,-5.2],[-9.4,-4.4]]);fs('#3a2410',OLW*0.6);
  Pth([[6.4,-11.6],[7.2,-23],[-6.4,-23.6],[-7.4,-12.8]]);fs('#5e554c');Pth([[-2.6,-24],[3,-24],[2.6,-22],[-2.2,-22]]);fs('#a42a20',OLW*0.5);}};
CHR.okupant={skin:'#e2b590',pants:'#5d5f50',coat:'#6e705e',sleeve:'#6e705e',shoe:'#121212',boot:'#141414',bootH:0.48,skirt:7,brow:'#8a6a3a',holdNear:{fn:holdRifle(false)},
 torsoFx(){Pth([[-7.6,-28],[-3,-28],[-3,-23],[-7.6,-23]]);fs(tint('#6e705e',0.88),OLW*0.4);ctx.fillStyle='#2a2a24';ctx.fillRect(-10,-12,20,2.6);Pth([[-9,-11],[-3,-11],[-3,-6],[-9,-6]]);fs('#3a3a30',OLW*0.5);},
 headFx(){if(CS.helm>0){Pth([[7.6,-8.4],[8.4,-12],[6.4,-17.6],[0,-20.2],[-6.4,-17.4],[-8,-13.4],[-7.4,-12.4],[-2,-13],[2,-12.2],[5.6,-10],[6.4,-8]]);fs('#55594b');ln(-6,-16,2,-18.6,'rgba(255,255,255,.2)',1.2);ln(-7.4,-12.6,6,-10.4,'#33362c',0.8);}
  else{Pth([[5.4,-11.6],[5,-15.6],[0,-18],[-5.6,-15],[-1,-15.6],[3,-14]]);fs('#c9a36a',OLW*0.6);}}};
CHR.przodownik={skin:'#e0aa82',pants:'#2e4a7a',coat:'#2e4a7a',sleeve:'#8a8a84',shoe:'#1c1c1c',boot:'#1c1c1c',bootH:0.3,skirt:0,brow:'#3a2410',browW:1.7,holdNear:{fn:holdKilof},
 torsoFx(){ctx.fillStyle='#8a8a84';Pth([[-8.4,-34],[6,-34],[6,-24],[-8.4,-24]]);ctx.fill();ctx.fillStyle='#2e4a7a';Pth([[-8.6,-24],[-2,-24],[-2,-30],[-8.4,-30]]);ctx.fill();ln(-6,-30,-4,-35,'#1e3256',1.2);ln(4,-24,5,-35,'#1e3256',1.2);ctx.fillStyle='#c9a24a';ctx.beginPath();ctx.arc(-5.4,-27,1.4,0,7);ctx.fill();ctx.fillStyle='#b8241c';ctx.fillRect(-6,-29.6,1.2,1.6);ctx.fillStyle='#d8d4c8';ctx.fillRect(-3.6,-21,3,4);},
 headFx(t){ctx.fillStyle='rgba(160,210,255,.85)';const d=(t*2)%1;ctx.beginPath();ctx.ellipse(2-d,-12+d*6,0.6,0.9,0,0,7);ctx.fill();
  Pth([[6.8,-11.4],[6.2,-15.6],[1.2,-18.8],[-5,-17.2],[-7.2,-14.6],[-11.6,-13.6],[-11.8,-12.5],[-6.2,-12.2],[-2.8,-12.8],[3.2,-12.3]]);fs('#2e4a7a');ln(-11.4,-12.8,-6.4,-12.4,'#1e3256',0.7);
  Pth([[-5.8,-3.4],[-2.2,-2.6],[-3,-1.4],[-5.6,-1.8]]);fs(tint('#e0aa82',0.8),OLW*0.5);}};
CHR.sekretarz={skin:'#e6b896',pants:'#4a3a2a',coat:'#5a4632',sleeve:'#5a4632',shoe:'#1a1a1a',skirt:10,cuff:'#e8e4da',brow:'#4a4a4a',holdFar:{fn:holdPapers},holdNear:{fn:holdMegafon},
 body:[[7,-1],[7.6,-14],[7.2,-27],[5.6,-32.6],[0,-34.6],[-5.2,-33.2],[-8,-27.5],[-12.6,-17],[-12.6,-9],[-8.6,-1]],
 torsoFx(){Pth([[-8.4,-30],[-4,-33],[-3,-17],[-8.6,-14]]);ctx.fillStyle='#e8e4da';ctx.fill();Pth([[-6,-31.6],[-4.6,-31.8],[-4.2,-22],[-5.4,-20.6],[-6.6,-22]]);ctx.fillStyle='#6a2a1a';ctx.fill();ctx.fillStyle='#b8241c';ctx.beginPath();ctx.arc(-1.4,-27,1.2,0,7);ctx.fill();ctx.fillStyle='#c9a24a';ctx.beginPath();ctx.arc(-1.4,-27,0.5,0,7);ctx.fill();},
 headFx(t){ctx.fillStyle=tint('#e6b896',0.92);ctx.beginPath();ctx.ellipse(-2,-1.6,4.2,2.2,0,0,7);ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW*0.6;ctx.beginPath();ctx.ellipse(-2,-1.6,4.2,2.2,0,0.2,3);ctx.stroke();
  ctx.strokeStyle='#5a5a5a';ctx.lineWidth=0.6;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(5,-12-i*1.4);ctx.quadraticCurveTo(0,-17-i*0.6,-5,-14.6-i*0.4);ctx.stroke();}
  ctx.strokeStyle=OL;ctx.lineWidth=OLW*1.1;ctx.strokeRect(-6.2,-11.4,4,3);ctx.fillStyle='rgba(200,230,255,.3)';ctx.fillRect(-6.2,-11.4,4,3);
  ctx.fillStyle='rgba(160,210,255,.8)';ctx.beginPath();ctx.ellipse(1,-15+((t*1.5)%1)*5,0.5,0.8,0,0,7);ctx.fill();}};
CHR.boss=Object.assign({},CHR.lenin,{skin:'#b0763a',pants:'#7a4e24',coat:'#8a5a2a',sleeve:'#8f5e2c',shoe:'#6e461e',cuff:'#a06a32',brow:'#5a3810',holdFar:null,
 faceFx(){ctx.fillStyle='rgba(255,215,150,.45)';ctx.beginPath();ctx.ellipse(-1.6,-15.4,3.2,1.4,-0.3,0,7);ctx.fill();ctx.fillStyle='rgba(80,150,110,.5)';ctx.beginPath();ctx.ellipse(3,-12,1.6,1,0,0,7);ctx.fill();},
 eyeFn(){Pth([[-5.1,-9.4],[-3.9,-10.2],[-2.5,-9.8],[-3.9,-9.1]]);fs('#c99456',0);ln(-5.2,-9.4,-2.4,-10,'#4a2a0a',0.6);},
 torsoFx(){CHR.lenin.torsoFx();ctx.fillStyle='rgba(80,150,110,.45)';ctx.beginPath();ctx.ellipse(3,-20,3,2,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(-4,-6,2,1.4,0,0,7);ctx.fill();
  if(CS.hp<0.6){ctx.strokeStyle='#2a1606';ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(-6,-32);ctx.lineTo(-2,-24);ctx.lineTo(-5,-18);ctx.lineTo(0,-10);ctx.stroke();}
  if(CS.hp<0.3){ctx.beginPath();ctx.moveTo(6,-30);ctx.lineTo(2,-22);ctx.lineTo(5,-14);ctx.stroke();}},
 torsoOver:null});
/* tułów Lenina: kolory z brązu dla bossa */
CHR.lenin.faceFx=CHR.lenin.faceFx;

/* --- pozy dla gry --- */
function stance(t){return{hip:-50.5,lean:0.06,tilt:0,legs:[{th:0.2,kn:0.1,fp:0},{th:-0.18,kn:0.12,fp:0}],arms:[{sh:0.15+0.05*Math.sin(t*2),el:0.3},{sh:0.1,el:0.3}]};}
function zombieWalk(t,sp){const ph=t*sp;return{hip:-50,lean:0.3+0.04*Math.sin(ph*2),tilt:0.32+0.1*Math.sin(ph*0.7),ph,
 legs:[{th:0.34*Math.sin(ph),kn:0.12+0.55*Math.pow(Math.max(0,Math.sin(ph+1.85)),1.4),fp:0.22*Math.sin(ph)},{th:0.16*Math.sin(ph+Math.PI)-0.1,kn:0.28,fp:-0.25}],
 arms:[{sh:1.25+0.08*Math.sin(ph*1.3),el:0.15+0.06*Math.sin(ph)},{sh:1.15+0.08*Math.sin(ph*1.3+1),el:0.25}]};}
function poseFor(k,st){
 const t=st.t||0,sp=16*(st.sp||0.22),eat=st.eat,idle=!st.walk&&!eat,zomb=k==='trup'||k==='mumia';
 let p;
 if(zomb)p=idle?stance(t):zombieWalk(t,sp*(k==='mumia'?0.9:1));
 else if(k==='lunatyk'){p=idle?stance(t):walkPose(t,sp,0.34,-0.05);p.arms[0]={sh:1.45+0.05*Math.sin(t*2),el:0.1};p.arms[1]={sh:1.35,el:0.15};p.tilt=-0.1;}
 else if(k==='boss'){p=walkPose(t,sp*1.6,0.3,0.1);p.arms[0]={sh:2.1+0.05*Math.sin(t*2),el:0.05};p.arms[1].sh=0.2+p.arms[1].sh*0.3;}
 else{const march=k==='milicjant'||k==='carski'||k==='okupant';p=idle?stance(t):walkPose(t,sp,march?0.46:k==='sasiad'||k==='sekretarz'?0.32:0.4,k==='wampir'?0.16:k==='sasiad'?-0.02:0.06);}
 if(eat){
  if(zomb){p.lean=0.42;p.tilt=0.35+0.2*Math.sin(t*10);p.arms[0]={sh:1.0+0.25*Math.sin(t*10),el:0.4};p.arms[1]={sh:0.9+0.25*Math.sin(t*10+1.5),el:0.5};p.legs=[{th:0.25,kn:0.2,fp:0},{th:-0.2,kn:0.3,fp:-0.2}];}
  else if(k!=='boss'){p.lean=0.18;const s=Math.max(0,Math.sin(t*9));p.arms[0]={sh:0.4+1.7*s,el:0.8-0.6*s};p.arms[1]={sh:0.3+0.4*s,el:0.9};p.legs=[{th:0.28,kn:0.15,fp:0},{th:-0.22,kn:0.12,fp:0}];}
 }
 switch(k){
  case 'milicjant':if(!eat){p.arms[0].sh=0.25+0.35*Math.sin((p.ph||0)+Math.PI);p.arms[0].el=1.35;}break;
  case 'urzednik':if(!eat){p.arms[0]={sh:1.5+0.15*Math.sin((p.ph||0)*2),el:1.5};p.arms[1].sh*=0.4;p.arms[1].el=0.12;}break;
  case 'komunista':if(st.shield>0){p.arms[0]={sh:0.75,el:1.1};}break;
  case 'carski':case 'okupant':if(!eat){p.arms[0]={sh:0.85,el:1.45};p.arms[1]={sh:1.25,el:0.95};}else{p.arms[0]={sh:1.1+0.4*Math.sin(t*9),el:1.0};p.arms[1]={sh:1.3,el:0.9};}break;
  case 'przodownik':if(!eat){p.arms[0]={sh:0.55,el:2.3};}else{const s=Math.max(0,Math.sin(t*8));p.arms[0]={sh:-0.2+2.4*s,el:0.5};}break;
  case 'lenin':if(!eat){const g=st.talk?1:0;p.arms[0].sh=lerp(p.arms[0].sh,2.15,g);p.arms[0].el=lerp(p.arms[0].el,0.05,g);p.arms[1].sh=0.15+p.arms[1].sh*0.4;p.arms[1].el=0.75;p.tilt=-0.12*g;}break;
  case 'sekretarz':p.arms[1]={sh:0.7,el:1.6};if(!eat){p.arms[0]={sh:1.25,el:1.75};}break;
  case 'sasiad':if(!eat){p.arms[0].el=1.3;}break;
 }
 return p;
}
function drawHuman(k,x,y,h,st){
 const o=CHR[k],sc=h/100,flip=st.flip?-1:1;
 ctx.save();ctx.translate(x,y);ctx.scale(sc*flip,sc);const prev=OLW;OLW=clamp(1.8/sc,0.9,3.2);
 CS=st;drawFigure(o,st.pose||(k==='dziad'?poseDziad(st.t||0):poseFor(k,st)),st.t||0);
 OLW=prev;ctx.restore();
}
/* --- nie-ludzie --- */
function nPig(t,walk){
 const s=walk?Math.sin(t*12):0,b=walk?Math.abs(Math.cos(t*12))*1.2:0;
 ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(0,0,30,4,0,0,7);ctx.fill();
 const leg=(x,ph,far)=>{ctx.save();ctx.translate(x,-16-b);ctx.rotate(ph*0.4);limb([0,0],[0,15],6.4,5,'#d07f8e',far);Pth([[-3,13],[3,13],[3.4,17],[-3.4,17]]);fs('#4a2a24');ctx.restore();};
 leg(-14,-s,true);leg(12,s,true);
 ctx.save();ctx.translate(0,-b);
 ctx.beginPath();ctx.ellipse(2,-28,26,15,0,0,7);ctx.fillStyle='#e99aaa';ctx.fill();ctx.save();ctx.beginPath();ctx.ellipse(2,-28,26,15,0,0,7);ctx.clip();ctx.fillStyle='#c97888';ctx.beginPath();ctx.ellipse(6,-17,28,9,0,0,7);ctx.fill();ctx.fillStyle='rgba(120,60,70,.3)';ctx.beginPath();ctx.ellipse(10,-30,4,3,0,0,7);ctx.fill();ctx.restore();ctx.beginPath();ctx.ellipse(2,-28,26,15,0,0,7);ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 for(let i=0;i<7;i++){const x=-12+i*5;Pth([[x-2.6,-41],[x+2.6,-41.6],[x+0.4,-49-(i%2)*3]]);fs('#5a2e3e',OLW*0.7);}
 ctx.beginPath();ctx.moveTo(27,-32);ctx.bezierCurveTo(33,-36,31,-26,35,-30);sk(OL,2.6);ctx.beginPath();ctx.moveTo(27,-32);ctx.bezierCurveTo(33,-36,31,-26,35,-30);sk('#d98798',1.4);
 ctx.save();ctx.translate(-22,-30);ctx.rotate(walk?Math.sin(t*12)*0.05:0);
 ctx.beginPath();ctx.ellipse(0,0,12,11,0,0,7);fs('#eea3b0');
 Pth([[2,-8],[8,-8],[5,-17]]);fs('#d07f8e',OLW*0.8);Pth([[-4,-9],[1,-9],[-3,-16]]);fs('#c06e7e',OLW*0.8);
 ctx.beginPath();ctx.ellipse(-12,2,5,4.6,0,0,7);fs('#d97f92');ctx.fillStyle='#5a1a2a';ctx.beginPath();ctx.ellipse(-13.6,1.4,0.9,1.4,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(-10.6,1.4,0.9,1.4,0,0,7);ctx.fill();
 Pth([[-8,6],[-6,6],[-9,1]]);fs('#f2ede0',OLW*0.6);
 ctx.beginPath();ctx.arc(-5,-3,2.6,0,7);fs('#ffdada',OLW*0.6);ctx.fillStyle='#d01010';ctx.beginPath();ctx.arc(-5.6,-3,1.3,0,7);ctx.fill();
 ctx.beginPath();ctx.arc(1.6,-5,2.2,0,7);fs('#f6f080',OLW*0.6);ctx.fillStyle='#111';ctx.beginPath();ctx.arc(1.2,-5,0.9,0,7);ctx.fill();
 ln(-8,-6,-2,-5,OL,1.2);ctx.fillStyle='#8fe04a';ctx.beginPath();ctx.ellipse(-8,8+Math.abs(Math.sin(t*3))*3,1.2,2.4,0,0,7);ctx.fill();
 ctx.restore();ctx.restore();
 leg(-10,s,false);leg(16,-s,false);
}
function nBeet(t,walk){
 const s=walk?Math.sin(t*9):0;
 ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(0,0,16,3.4,0,0,7);ctx.fill();
 ctx.beginPath();ctx.moveTo(-4,-12);ctx.quadraticCurveTo(-8,-6,-7+s*4,0);sk(OL,3.6);ctx.beginPath();ctx.moveTo(-4,-12);ctx.quadraticCurveTo(-8,-6,-7+s*4,0);sk('#5a1530',2.2);
 ctx.beginPath();ctx.moveTo(4,-12);ctx.quadraticCurveTo(8,-6,7-s*4,0);sk(OL,3.6);ctx.beginPath();ctx.moveTo(4,-12);ctx.quadraticCurveTo(8,-6,7-s*4,0);sk('#5a1530',2.2);
 for(const a of [[-7,-0.5],[0,0],[7,0.5]]){ctx.save();ctx.translate(a[0],-44);ctx.rotate(a[1]+Math.sin(t*4+a[0])*0.1);ctx.beginPath();ctx.ellipse(0,-9,4.6,10,0,0,7);fs('#4f9a3a');ln(0,1,0,-17,'#2f6a22',0.8);ctx.fillStyle='#8a1e4a';ctx.fillRect(-0.6,0,1.2,4);ctx.restore();}
 ctx.beginPath();ctx.arc(0,-26,18,0,7);const g=ctx.createRadialGradient(-6,-32,2,0,-26,19);g.addColorStop(0,'#c2407a');g.addColorStop(1,'#5a1034');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 Pth([[-5,-10],[5,-10],[0,-1]]);fs('#5a1034',OLW*0.8);ln(-10,-30,-6,-20,'rgba(255,200,230,.3)',1);
 ctx.beginPath();ctx.arc(-7,-29,4,0,7);fs('#fff',OLW*0.6);ctx.beginPath();ctx.arc(3,-29,4,0,7);fs('#fff',OLW*0.6);ctx.fillStyle='#111';ctx.beginPath();ctx.arc(-8.2,-29,1.9,0,7);ctx.fill();ctx.beginPath();ctx.arc(1.8,-29,1.9,0,7);ctx.fill();
 ln(-12,-36,-4,-32.6,OL,2.2);ln(8,-36,0,-32.6,OL,2.2);
 Pth([[-10,-19],[-7,-22],[-4,-19],[-1,-22],[2,-19],[5,-22],[6,-18],[-1,-15],[-8,-15]]);fs('#2a0818',OLW*0.7);
}
function nNysa(t){
 ctx.fillStyle='rgba(0,0,0,.38)';ctx.beginPath();ctx.ellipse(0,0,56,5,0,0,7);ctx.fill();
 Pth([[-58,-14],[-58,-36],[-50,-42],[-44,-64],[48,-64],[52,-60],[52,-14]]);fs('#e6eaee');
 ctx.save();Pth([[-58,-14],[-58,-36],[-50,-42],[-44,-64],[48,-64],[52,-60],[52,-14]]);ctx.clip();ctx.fillStyle='#c8ced4';ctx.fillRect(-60,-30,120,16);ctx.fillStyle='#2f5fa8';ctx.fillRect(-60,-36,120,9);ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(30,-66,30,60);ctx.restore();
 Pth([[-58,-14],[-58,-36],[-50,-42],[-44,-64],[48,-64],[52,-60],[52,-14]]);ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 ctx.font='900 8px '+FONT;ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText('MILICJA',12,-29.2);
 Pth([[-50,-44],[-44,-62],[-30,-62],[-30,-44]]);fs('#8fb8d4');ctx.fillStyle='rgba(255,255,255,.4)';Pth([[-46,-46],[-41,-60],[-38,-60],[-43,-46]]);ctx.fill();
 ctx.fillStyle='#2e3442';ctx.beginPath();ctx.arc(-37,-52,4.2,0,7);ctx.fill();Pth([[-42,-56],[-32,-56],[-33,-59],[-41,-59]]);fs('#4e5c70',OLW*0.6);
 for(const x of [-24,-4,16,34]){Pth([[x,-60],[x+15,-60],[x+15,-46],[x,-46]]);fs('#8fb8d4',OLW*0.8);ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(x+2,-58,3,10);}
 ln(-28,-44,-28,-16,'rgba(0,0,0,.3)',0.8);ctx.fillStyle='#222';ctx.fillRect(-26,-34,4,1.4);
 Pth([[-59,-28],[-56,-28],[-56,-18],[-59,-18]]);fs('#555');for(let i=0;i<4;i++)ln(-58.6,-26+i*2.4,-56.4,-26+i*2.4,'#999',0.5);
 ctx.beginPath();ctx.arc(-55,-20,2.6,0,7);fs('#fff0b0',OLW*0.6);
 Pth([[-60,-15],[-46,-15],[-46,-11],[-60,-11]]);fs('#3a3a3a',OLW*0.7);Pth([[40,-15],[54,-15],[54,-11],[40,-11]]);fs('#3a3a3a',OLW*0.7);
 for(const wx of [-38,30]){ctx.save();ctx.translate(wx,-10);ctx.beginPath();ctx.arc(0,0,10.6,0,7);fs('#141414');ctx.beginPath();ctx.arc(0,0,5.6,0,7);fs('#9aa0a6',OLW*0.7);ctx.rotate(-t*7);for(let i=0;i<5;i++){ctx.rotate(Math.PI*2/5);ctx.fillStyle='#55585c';ctx.fillRect(-0.7,-5,1.4,3);}ctx.restore();ctx.beginPath();ctx.arc(wx,-10,13.4,Math.PI*1.05,Math.PI*1.95);sk(OL,2.6);}
 const on=Math.sin(t*14)>0;
 if(on){const g=ctx.createRadialGradient(-12,-68,1,-12,-68,26);g.addColorStop(0,'rgba(80,150,255,.8)');g.addColorStop(1,'rgba(80,150,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(-12,-68,26,0,7);ctx.fill();}
 Pth([[-20,-64],[-4,-64],[-6,-70],[-18,-70]]);fs(on?'#4a9bff':'#1a3a7a');ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(-16,-69,3,3);
}
function nKura(t,walk){
 const s=walk?Math.sin(t*16):0,hop=walk?Math.abs(Math.sin(t*8))*5:0;
 ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(0,0,12,2.6,0,0,7);ctx.fill();
 for(const [x,ph] of [[-3,s],[2,-s],[6,s*0.6]]){ctx.save();ctx.translate(x,-16-hop);ctx.rotate(ph*0.5);ln(0,0,0,15,OL,2.6);ln(0,0,0,15,'#e0a020',1.4);ln(0,15,-4,16,'#e0a020',1.2);ln(0,15,2,16.4,'#e0a020',1.2);ctx.restore();}
 ctx.save();ctx.translate(0,-hop);
 ctx.beginPath();ctx.ellipse(2,-24,12,9,-0.2,0,7);fs('#efe8dc');Pth([[10,-30],[18,-38],[17,-28],[13,-22]]);fs('#e4dccc');ln(12,-31,16,-35,'#b8ae9a',0.6);
 ctx.beginPath();ctx.ellipse(4,-23,6,4,0.3+Math.sin(t*10)*0.3,0,7);fs('#ddd4c2',OLW*0.7);
 ctx.fillStyle='rgba(120,190,60,.5)';ctx.beginPath();ctx.ellipse(-2,-20,3,2,0,0,7);ctx.fill();
 ctx.beginPath();ctx.ellipse(-8,-33,6,6.4,0,0,7);fs('#efe8dc');
 Pth([[-11,-39],[-9,-43],[-7,-39.6],[-5,-43.4],[-4,-38.6]]);fs('#d42a1e',OLW*0.7);Pth([[-13,-31],[-10.6,-31],[-12,-27]]);fs('#d42a1e',OLW*0.6);
 Pth([[-13.6,-34],[-19,-33],[-13.6,-31.6]]);fs('#e0a020',OLW*0.7);
 ctx.beginPath();ctx.arc(-9.6,-34.6,2.4,0,7);fs('#fff8a0',OLW*0.6);ctx.fillStyle='#111';ctx.beginPath();ctx.arc(-10.2,-34.4+Math.sin(t*20)*0.6,1,0,7);ctx.fill();
 ctx.beginPath();ctx.arc(-6.4,-36.2,1.4,0,7);fs('#fff8a0',OLW*0.5);ctx.fillStyle='#111';ctx.beginPath();ctx.arc(-6.6,-36.2,0.6,0,7);ctx.fill();
 ctx.restore();
}
function nBarszcz(t,walk){
 const s=walk?Math.sin(t*6):0,sw=Math.sin(t*2)*2;
 ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(0,0,22,3.6,0,0,7);ctx.fill();
 for(const [x,ph] of [[-8,s],[0,-s],[8,s*0.7]]){ctx.beginPath();ctx.moveTo(x*0.4,-14);ctx.quadraticCurveTo(x,-6,x+ph*4,0);sk(OL,4);ctx.beginPath();ctx.moveTo(x*0.4,-14);ctx.quadraticCurveTo(x,-6,x+ph*4,0);sk('#7a8a4a',2.4);}
 ctx.beginPath();ctx.moveTo(-5,-14);ctx.quadraticCurveTo(-7+sw*0.3,-70,sw,-108);ctx.lineTo(6+sw,-108);ctx.quadraticCurveTo(0+sw*0.3,-70,5,-14);ctx.closePath();fs('#5f8a3a');
 ctx.fillStyle='#6a2a5a';for(let i=0;i<9;i++){ctx.beginPath();ctx.ellipse(-2+(i%3)*2+sw*(i/12),-22-i*9,1.1,0.8,0,0,7);ctx.fill();}
 for(const [y,d] of [[-40,-1],[-62,1],[-80,-1]]){ctx.save();ctx.translate(sw*(-y/110),y);ctx.scale(d,1);ctx.rotate(-0.5+Math.sin(t*3+y)*0.08);Pth([[0,0],[10,-6],[18,-2],[26,-8],[30,0],[24,4],[28,10],[18,8],[10,10],[4,4]]);fs('#4f7a2e');ln(0,0,26,-2,'#3a5a20',0.7);ctx.restore();}
 ctx.save();ctx.translate(sw+2,-108);for(let i=-4;i<=4;i++){ln(0,0,i*6,-10+Math.abs(i)*1.4,'#5f8a3a',1.4);}
 ctx.beginPath();ctx.ellipse(0,-12,28,8,0,Math.PI,0);ctx.closePath();fs('#f2efe2');ctx.fillStyle='#d8d2be';for(let i=0;i<16;i++){ctx.beginPath();ctx.arc(-24+i*3.2,-12-Math.sin(i*0.9)*2-(i%3),1.8,0,7);ctx.fill();}ctx.restore();
 ctx.save();ctx.translate(sw*0.5,-52);ctx.beginPath();ctx.arc(-3,0,2.6,0,7);fs('#ffe060',OLW*0.6);ctx.beginPath();ctx.arc(3,-1,2.6,0,7);fs('#ffe060',OLW*0.6);ctx.fillStyle='#111';ctx.beginPath();ctx.arc(-3.8,0,1.1,0,7);ctx.fill();ctx.beginPath();ctx.arc(2.2,-1,1.1,0,7);ctx.fill();ln(-6,-4,-1,-2.4,OL,1.2);ln(6,-5,1,-3,OL,1.2);Pth([[-4,5],[4,4],[2,8],[-2,8.4]]);fs('#2a3a10',OLW*0.6);ctx.restore();
 ctx.fillStyle='rgba(220,255,120,.6)';for(let i=0;i<3;i++){const p=(t*0.8+i/3)%1;ctx.beginPath();ctx.arc(-14+i*12,-90+p*70,1.2,0,7);ctx.fill();}
}
function nKrowa(t,walk){
 const s=walk?Math.sin(t*7):0,b=walk?Math.abs(Math.cos(t*7))*1.2:0,gl=0.5+0.5*Math.sin(t*3);
 const g0=ctx.createRadialGradient(0,-40,4,0,-40,60);g0.addColorStop(0,'rgba(150,255,90,'+(0.18+0.12*gl)+')');g0.addColorStop(1,'rgba(150,255,90,0)');ctx.fillStyle=g0;ctx.beginPath();ctx.arc(0,-40,60,0,7);ctx.fill();
 ctx.fillStyle='rgba(0,0,0,.38)';ctx.beginPath();ctx.ellipse(0,0,40,5,0,0,7);ctx.fill();
 const leg=(x,ph,far)=>{ctx.save();ctx.translate(x,-30-b);ctx.rotate(ph*0.3);limb([0,0],[0,28],8.6,6.4,'#efece4',far);Pth([[-3.6,26],[3.6,26],[4,31],[-4,31]]);fs('#2a2420');ctx.restore();};
 leg(-24,-s,true);leg(20,s,true);
 ctx.save();ctx.translate(0,-b);
 Pth([[-30,-58],[28,-60],[36,-50],[34,-30],[24,-26],[-26,-26],[-34,-34],[-36,-50]]);fs('#efece4');
 ctx.save();Pth([[-30,-58],[28,-60],[36,-50],[34,-30],[24,-26],[-26,-26],[-34,-34],[-36,-50]]);ctx.clip();ctx.fillStyle='#1c1c1c';for(const [x,y,rx,ry] of [[-14,-50,9,7],[10,-44,12,8],[26,-56,6,5],[-28,-34,6,6]]){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0.3,0,7);ctx.fill();}ctx.fillStyle='rgba(0,0,0,.14)';ctx.fillRect(-40,-34,80,10);ctx.restore();
 Pth([[-30,-58],[28,-60],[36,-50],[34,-30],[24,-26],[-26,-26],[-34,-34],[-36,-50]]);ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 ctx.beginPath();ctx.ellipse(10,-24,7,5,0,0,7);fs('#f0a8b4');for(const x of [6,9,12,15])ln(x,-20,x,-16,'#e08898',1.6);
 const head=(gl)=>{ctx.rotate(walk?Math.sin(t*7)*0.06:0);
  Pth([[0,-6],[-16,-4],[-22,8],[-18,14],[-6,12],[2,4]]);fs('#efece4');ctx.fillStyle='#1c1c1c';ctx.beginPath();ctx.ellipse(-6,-1,5,4,0,0,7);ctx.fill();
  ctx.beginPath();ctx.ellipse(-19,10,6,4.4,0,0,7);fs('#e8b0a8');ctx.fillStyle='#5a2a2a';ctx.beginPath();ctx.arc(-21,9,0.9,0,7);ctx.fill();ctx.beginPath();ctx.arc(-17.6,9,0.9,0,7);ctx.fill();
  Pth([[-4,-6],[-2,-14],[2,-12],[0,-5]]);fs('#e8e0c8',OLW*0.7);Pth([[-12,-5],[-16,-12],[-12,-11],[-9,-5]]);fs('#e8e0c8',OLW*0.7);
  ctx.beginPath();ctx.arc(-12,-1,3,0,7);fs('rgba(170,255,110,'+(0.7+0.3*gl)+')',OLW*0.6);ctx.fillStyle='#0a1a04';ctx.beginPath();ctx.arc(-12.6,-1,1.1,0,7);ctx.fill();
  ctx.beginPath();ctx.arc(-14,16,3.4,0,7);fs('#c9a24a',OLW*0.7);};
 ctx.save();ctx.translate(-36,-50);head(gl);ctx.restore();
 ctx.save();ctx.translate(36,-52);ctx.scale(-1,1);head(1-gl);ctx.restore();
 ctx.font='900 12px '+FONT;ctx.textAlign='center';ctx.fillStyle='#d8ff60';ctx.fillText('☢',0,-38);
 ctx.restore();
 leg(-20,s,false);leg(24,-s,false);
}
function drawEnemyRaw(k,x,y,h,st){
 const sc=h/100;
 if(CHR[k]){drawHuman(k,x,y,h,st);return;}
 ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);const prev=OLW;OLW=clamp(1.8/sc,0.9,3.2);CS=st;const t=st.t||0;
 switch(k){
  case 'swinia':ctx.scale(1.3,1.3);nPig(t,st.walk);break;
  case 'burak':case 'buraczek':nBeet(t,st.walk);break;
  case 'nysa':nNysa(t);break;
  case 'kura':ctx.scale(1.55,1.55);nKura(t,st.walk);break;
  case 'barszcz':ctx.scale(1.0,0.72);nBarszcz(t,st.walk);break;
  case 'krowa':ctx.scale(1.2,1.2);nKrowa(t,st.walk);break;
  case 'palac':nPalac(t,st.walk);break;
 }
 OLW=prev;ctx.restore();
}
function dziad(x,y,h,t){drawHuman('dziad',x,y,h,{t,flip:true});}

/* --- sprzęt w nowym stylu --- */
function catapultFromDef(d,tt){if(!d)return{c:0,a:-1.2,loaded:true};const k=d.kick>0?d.kick/0.25:0;let a;
 if(k>0.55)a=lerp(0.38,-1.2,Math.pow((k-0.55)/0.45,1.6));else if(k>0)a=0.38-0.1*Math.sin(k/0.55*Math.PI);else{const r=d.def.rate||1.5,since=r-d.t;a=since<0.25?0.38:lerp(0.38,-1.2,ease((since-0.25)/Math.max(0.3,r*0.5)));}
 return{c:0.9,a,loaded:a<-1.0};}
function catSt(d,t){if(d&&d.__a!=null)return{c:0.9,a:d.__a,loaded:d.__a<-1.0};return catapultFromDef(d,t);}
function nProca(a){
 const pull=clamp((0.38-a)/1.58,0,1),loaded=a<-1.0;
 ctx.fillStyle='rgba(0,0,0,.32)';ctx.beginPath();ctx.ellipse(-4,0,38,5,0,0,7);ctx.fill();
 for(const [x,y,r,sc] of [[-33,-2,0,1.05],[-21,-1,0.08,1.05]]){ctx.save();ctx.translate(x,y);ctx.rotate(r);ctx.scale(sc,sc);const pw=OLW;OLW=pw/sc;nBoot();OLW=pw;ctx.restore();}
 const R=[18,-60],Lt=[-4,-60],px=lerp(6,-30,pull),py=lerp(-54,-44,pull);
 ln(R[0],R[1],px+3,py,OL,5.6);ln(R[0],R[1],px+3,py,'#b8341c',3.4);
 limb([6,0],[6,-34],11,9,'#8a5a32');limb([6,-34],R,8,6.4,'#8a5a32');limb([6,-34],Lt,8,6.4,'#9a6a3e');
 ctx.beginPath();ctx.arc(6,-34,5,0,7);fs('#8a5a32');ln(1,-28,10,-30,'#5e3a1e',1.2);ln(1,-24,10,-26,'#5e3a1e',1.2);
 ln(Lt[0],Lt[1],px-3,py,OL,5.6);ln(Lt[0],Lt[1],px-3,py,'#d0442a',3.4);
 ctx.save();ctx.translate(px,py);ctx.beginPath();ctx.ellipse(0,1,7,5,0,0,7);fs('#6a4428');
 if(loaded){ctx.translate(-2,-1);ctx.rotate(-0.35);ctx.scale(0.95,0.95);const pw=OLW;OLW=pw/0.95;nBoot();OLW=pw;}
 ctx.restore();
}
function nKociol(a){
 const loaded=a<-1.0;
 ctx.fillStyle='rgba(0,0,0,.32)';ctx.beginPath();ctx.ellipse(-4,0,38,5,0,0,7);ctx.fill();
 ctx.beginPath();ctx.moveTo(-36,-30);ctx.lineTo(-34,-4);ctx.quadraticCurveTo(-34,0,-30,0);ctx.lineTo(-8,0);ctx.quadraticCurveTo(-4,0,-4,-4);ctx.lineTo(-2,-30);ctx.closePath();fs('#f2efe6');
 ctx.save();ctx.beginPath();ctx.moveTo(-36,-30);ctx.lineTo(-34,-4);ctx.quadraticCurveTo(-34,0,-30,0);ctx.lineTo(-8,0);ctx.quadraticCurveTo(-4,0,-4,-4);ctx.lineTo(-2,-30);ctx.closePath();ctx.clip();ctx.fillStyle='rgba(0,0,0,.14)';ctx.fillRect(-12,-32,12,34);ctx.fillStyle='#2a5aa8';ctx.fillRect(-40,-31,40,4);ctx.fillRect(-40,-3,40,4);ctx.restore();
 for(const x of [-38,0]){ctx.beginPath();ctx.ellipse(x,-22,3,2.2,0,0,7);ctx.strokeStyle=OL;ctx.lineWidth=3.4;ctx.stroke();ctx.strokeStyle='#2a5aa8';ctx.lineWidth=1.8;ctx.stroke();}
 ctx.beginPath();ctx.ellipse(-19,-30,17,4.4,0,0,7);fs('#2a5aa8');
 for(const [x,y,r] of [[-26,-34,6],[-14,-35,6.4],[-20,-39,5.4]]){ctx.beginPath();ctx.arc(x,y,r,0,7);fs('#7cc24a');ln(x-r*0.6,y-1,x+r*0.4,y+r*0.6,'#4f8a2a',1.2);}
 Pth([[-8,-41],[2,-47],[3,-45],[-7,-39]]);fs('#efe7d2');ctx.beginPath();ctx.arc(3,-46.5,1.8,0,7);fs('#efe7d2',OLW*0.8);
 Pth([[4,0],[18,0],[13,-8],[9,-8]]);fs('#6e4a2a');limb([11,-6],[11,-28],6.4,5.4,'#8a5a32');
 const piv=[11,-28],tip=[piv[0]+Math.sin(a)*36,piv[1]-Math.cos(a)*36];
 limb(lp(piv,tip,-0.18),tip,4,3.2,'#b8bec4');
 ctx.beginPath();ctx.arc(piv[0],piv[1],3.2,0,7);fs('#555');
 ctx.save();ctx.translate(tip[0],tip[1]);ctx.rotate(a);ctx.beginPath();ctx.ellipse(0,-4,8.4,6,0,0,Math.PI);ctx.closePath();ctx.rotate(Math.PI);ctx.restore();
 ctx.save();ctx.translate(tip[0],tip[1]);ctx.rotate(a);ctx.beginPath();ctx.moveTo(-9,0);ctx.quadraticCurveTo(0,13,9,0);ctx.closePath();fs('#c9ced4');ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(-6,1,4,1.4);
 if(loaded){ctx.beginPath();ctx.arc(0,-2,5.6,0,7);fs('#7cc24a');ln(-3,-4,2,1,'#4f8a2a',1);}
 ctx.restore();
}
function nKropidlo(a){
 const loaded=a<-1.0;
 ctx.fillStyle='rgba(0,0,0,.32)';ctx.beginPath();ctx.ellipse(-2,0,38,5,0,0,7);ctx.fill();
 limb([24,0],[24,-66],5.4,4.6,'#7a5232');limb([14,-52],[34,-52],4.6,4.6,'#7a5232');ctx.fillStyle='#e6c24a';ctx.beginPath();ctx.arc(24,-52,2.6,0,7);ctx.fill();
 ctx.beginPath();ctx.moveTo(-36,-24);ctx.lineTo(-32,0);ctx.lineTo(-10,0);ctx.lineTo(-6,-24);ctx.closePath();fs('#3a6ac0');
 ctx.save();ctx.beginPath();ctx.moveTo(-36,-24);ctx.lineTo(-32,0);ctx.lineTo(-10,0);ctx.lineTo(-6,-24);ctx.closePath();ctx.clip();ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(-14,-26,10,28);ctx.restore();
 Pth([[-23,-20],[-19,-20],[-19,-6],[-23,-6]]);fs('#e6c24a',OLW*0.7);Pth([[-26,-16],[-16,-16],[-16,-12.4],[-26,-12.4]]);fs('#e6c24a',OLW*0.7);
 ctx.beginPath();ctx.ellipse(-21,-24,15,3.8,0,0,7);fs('#a8d4ff');ctx.beginPath();ctx.moveTo(-38,-25);ctx.quadraticCurveTo(-21,-50,-4,-25);sk(OL,3.2);ctx.beginPath();ctx.moveTo(-38,-25);ctx.quadraticCurveTo(-21,-50,-4,-25);sk('#9aa0a6',1.6);
 Pth([[0,0],[14,0],[10,-6],[4,-6]]);fs('#6e4a2a');limb([7,-4],[7,-26],6,5,'#8a5a32');
 const piv=[7,-26],tip=[piv[0]+Math.sin(a)*34,piv[1]-Math.cos(a)*34];
 limb(lp(piv,tip,-0.15),tip,4.4,3.6,'#7a5232');ctx.beginPath();ctx.arc(piv[0],piv[1],3,0,7);fs('#555');
 ctx.beginPath();ctx.arc(tip[0],tip[1],7.4,0,7);fs('#c9ced4');ctx.fillStyle='#55585c';for(const [dx,dy] of [[-3,-2],[2,-3],[0,2],[3,1.6],[-2,3]]){ctx.beginPath();ctx.arc(tip[0]+dx,tip[1]+dy,0.9,0,7);ctx.fill();}
 ctx.fillStyle='rgba(255,255,255,.7)';ctx.beginPath();ctx.arc(tip[0]-2.6,tip[1]-3,1.6,0,7);ctx.fill();
 if(loaded){ctx.fillStyle='#8fd0ff';for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(tip[0]-2+i*2.4,tip[1]+10+i*2,1,1.6,0,0,7);ctx.fill();}}
}
const DRAW={
 bimbrownia(d,t){ctx.save();ctx.translate(-8,0);ctx.scale(0.88,0.88);nBimbrownia(t);ctx.restore();if(d&&d.t<1.2){ctx.fillStyle='rgba(255,230,120,'+(0.3+0.25*Math.sin(t*15))+')';ctx.beginPath();ctx.arc(29,-9,11,0,7);ctx.fill();}},
 gumofilce(d,t){nProca(catSt(d,t).a);},
 resztki(d,t){nKociol(catSt(d,t).a);},
 woda(d,t){nKropidlo(catSt(d,t).a);},
 samowar(d,t){ctx.save();ctx.scale(0.95,0.95);nSamowar(t,d?(d.kick>0?1:0):null,!!d);ctx.restore();},
 szafa(d,t){
  const hp=d&&d.max?d.hp/d.max:1;ctx.save();ctx.scale(0.88,0.88);if(hp<0.33)ctx.rotate(-0.05);
  ctx.fillStyle='rgba(0,0,0,.32)';ctx.beginPath();ctx.ellipse(0,0,32,4,0,0,7);ctx.fill();
  Pth([[-28,-70],[28,-70],[28,-2],[-28,-2]]);const g=ctx.createLinearGradient(-28,0,28,0);g.addColorStop(0,'#5a321a');g.addColorStop(0.4,'#8a5530');g.addColorStop(1,'#4e2a14');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
  Pth([[-30,-74],[30,-74],[29,-70],[-29,-70]]);fs('#6e4024');Pth([[-29,-3],[29,-3],[29,0],[-29,0]]);fs('#3a2010',OLW*0.7);
  for(const x0 of [-24,2]){Pth([[x0,-66],[x0+22,-66],[x0+22,-36],[x0,-36]]);fs('rgba(160,200,215,.7)');ctx.save();Pth([[x0,-66],[x0+22,-66],[x0+22,-36],[x0,-36]]);ctx.clip();ln(x0-2,-40,x0+12,-70,'rgba(255,255,255,.4)',2);ctx.restore();ln(x0,-51,x0+22,-51,'#6e4024',1.6);
   for(let i=0;i<3;i++){Pth([[x0+3+i*6.4,-37],[x0+7+i*6.4,-37],[x0+8+i*6.4,-47],[x0+2+i*6.4,-47]]);fs('rgba(240,250,255,.85)',OLW*0.5);}Pth([[x0+5,-52],[x0+17,-52],[x0+15,-60],[x0+7,-60]]);fs('rgba(230,240,250,.8)',OLW*0.5);}
  for(const y of [-32,-17]){Pth([[-24,y],[24,y],[24,y+13],[-24,y+13]]);fs('#6e4024',OLW*0.8);Pth([[-4,y+5],[4,y+5],[4,y+7.6],[-4,y+7.6]]);fs('#c9a24a',OLW*0.6);}
  Pth([[-12,-74],[12,-74],[10,-76.4],[-10,-76.4]]);fs('#f0ece0',OLW*0.6);ctx.beginPath();ctx.ellipse(6,-81,3.4,5,0,0,7);fs('#c9d8e8',OLW*0.7);ctx.fillStyle='#2a4fa0';ctx.fillRect(4.6,-82,2.8,1);
  if(hp<0.66){ctx.strokeStyle='#1a0c04';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-28,-48);ctx.lineTo(-16,-42);ctx.lineTo(-20,-32);ctx.stroke();ctx.beginPath();ctx.moveTo(-14,-60);ctx.lineTo(-8,-54);ctx.stroke();}
  if(hp<0.33){ctx.beginPath();ctx.moveTo(28,-60);ctx.lineTo(16,-52);ctx.lineTo(20,-40);ctx.lineTo(10,-30);ctx.stroke();}
  ctx.restore();},
 pila(d,t){const rev=d&&d.rev;ctx.fillStyle='rgba(0,0,0,.32)';ctx.beginPath();ctx.ellipse(0,0,30,4,0,0,7);ctx.fill();
  for(const [a,b] of [[[-22,-1],[-10,-24]],[[-4,-1],[-10,-24]],[[16,-1],[22,-24]],[[30,-1],[22,-24]]])limb(a,b,3.6,3.2,'#7a5634');Pth([[-14,-26],[26,-26],[26,-22],[-14,-22]]);fs('#8a6238');
  ctx.save();if(rev)ctx.translate(Math.sin(t*90)*0.9,Math.cos(t*70)*0.5);
  Pth([[2,-38],[40,-36],[42,-32],[40,-28],[2,-28]]);fs('#a0a6ac');ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(4,-36,34,1.4);
  ctx.fillStyle='#222';const off=rev?(t*60)%5:0;for(let i=0;i<8;i++){const x=4+i*5+off;if(x<40){Pth([[x,-38],[x+2,-41],[x+4,-38]]);ctx.fill();Pth([[x,-28],[x+2,-25],[x+4,-28]]);ctx.fill();}}
  Pth([[-20,-44],[6,-44],[8,-26],[-20,-24]]);fs('#e8731c');ctx.save();Pth([[-20,-44],[6,-44],[8,-26],[-20,-24]]);ctx.clip();ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(-20,-32,30,10);ctx.fillStyle='#1c1c1c';ctx.fillRect(-16,-40,10,6);ctx.restore();
  ctx.font='900 4.4px '+FONT;ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText('STIHL?',-11,-35.2);
  ctx.beginPath();ctx.moveTo(-14,-44);ctx.quadraticCurveTo(-6,-56,4,-44);sk(OL,4);ctx.beginPath();ctx.moveTo(-14,-44);ctx.quadraticCurveTo(-6,-56,4,-44);sk('#2a2a2a',2.4);
  Pth([[-26,-36],[-20,-36],[-20,-30],[-26,-30]]);fs('#2a2a2a',OLW*0.7);ctx.restore();
  if(rev){for(let i=0;i<3;i++){const p=(t*2+i/3)%1;ctx.fillStyle='rgba(90,90,90,'+(0.5*(1-p))+')';ctx.beginPath();ctx.arc(-24-p*6,-36-p*14,2+p*3,0,7);ctx.fill();}}},
 relikwia(d,t){const p=0.5+0.5*Math.sin(t*3);const g=ctx.createRadialGradient(0,-30,2,0,-30,36);g.addColorStop(0,'rgba(255,230,140,'+(0.45+p*0.3)+')');g.addColorStop(1,'rgba(255,230,140,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,-30,36,0,7);ctx.fill();
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2+t*0.5;ln(Math.cos(a)*20,-30+Math.sin(a)*16,Math.cos(a)*30,-30+Math.sin(a)*24,'rgba(255,240,170,'+(0.35+p*0.4)+')',1.6);}
  ctx.fillStyle='rgba(0,0,0,.32)';ctx.beginPath();ctx.ellipse(0,0,22,3.4,0,0,7);ctx.fill();
  for(const x of [-14,10])limb([x,-14],[x+(x<0?-2:2),0],3.4,3,'#7a5634');Pth([[-20,-18],[20,-18],[20,-13],[-20,-13]]);fs('#8a6238');
  Pth([[-17,-20],[17,-20],[19,-17.6],[-19,-17.6]]);fs('#f2eee2',OLW*0.6);
  ctx.beginPath();ctx.ellipse(0,-22,15,4,0,0,7);fs('#c9962e');Pth([[-15,-22],[15,-22],[15,-36],[-15,-36]]);fs('#d6a51a');ctx.save();Pth([[-15,-22],[15,-22],[15,-36],[-15,-36]]);ctx.clip();ctx.fillStyle='#2a6a3a';ctx.fillRect(-15,-31,30,5);ctx.fillStyle='#f6e090';for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(-11+i*5.4,-28.4,1.3,0,7);ctx.fill();}ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(6,-36,10,16);ctx.restore();
  ctx.beginPath();ctx.ellipse(0,-36,15.6,4.6,0,0,7);fs('#c22d3a');ctx.beginPath();ctx.ellipse(0,-37,10,2.8,0,0,7);ctx.fillStyle='#f0d060';ctx.fill();ctx.font='900 3.4px '+FONT;ctx.textAlign='center';ctx.fillStyle='#8a1a20';ctx.fillText('LANDRYNKI',0,-36.2);
  ctx.fillStyle='rgba(255,250,200,'+(0.5+0.5*p)+')';for(let i=0;i<4;i++){const q=(t*0.6+i/4)%1;ctx.beginPath();ctx.arc(-10+i*7,-40-q*20,0.9,0,7);ctx.fill();}},
 kabel(d,t){ctx.fillStyle='rgba(30,20,10,.4)';ctx.beginPath();ctx.ellipse(6,-3,24,3,0,0,7);ctx.fill();
  limb([-28,-1],[-27,-46],4.6,3.6,'#6b4a2a');Pth([[-34,-42],[-20,-42],[-20,-39],[-34,-39]]);fs('#5a3a1e',OLW*0.7);for(const x of [-32,-22]){ctx.beginPath();ctx.ellipse(x,-44,1.8,2.4,0,0,7);fs('#e8e8e0',OLW*0.6);}
  ctx.beginPath();ctx.moveTo(-22,-44);ctx.quadraticCurveTo(-14,-8,-6,-5);for(let i=0;i<6;i++)ctx.quadraticCurveTo(-3+i*6,-1-(i%2)*6,0+i*6,-5);sk(OL,3.6);ctx.beginPath();ctx.moveTo(-22,-44);ctx.quadraticCurveTo(-14,-8,-6,-5);for(let i=0;i<6;i++)ctx.quadraticCurveTo(-3+i*6,-1-(i%2)*6,0+i*6,-5);sk('#262626',2);
  ln(-4,-5,1,-5,'#e0883a',2.2);ln(14,-5,19,-5,'#e0883a',2.2);ln(30,-5,34,-5,'#e0883a',2.2);
  const on=Math.sin(t*9+(d&&d.c!=null?d.c*3:0))>0.1;if(on){ctx.strokeStyle='#fff6a0';ctx.lineWidth=1.6;for(let k=0;k<2;k++){const sx=-2+((t*37+k*13)%34);ctx.beginPath();ctx.moveTo(sx,-6);ctx.lineTo(sx+3,-13);ctx.lineTo(sx+1,-13);ctx.lineTo(sx+5,-21);ctx.stroke();}const g=ctx.createRadialGradient(8,-6,1,8,-6,20);g.addColorStop(0,'rgba(255,240,120,.35)');g.addColorStop(1,'rgba(255,240,120,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(8,-6,20,0,7);ctx.fill();}},
 lancuch(d,t){const ready=!d||d.reload<=0;
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,0,28,4.4,0,0,7);ctx.fill();
  limb([-16,0],[-16,-58],4.6,4,'#6b4a2a');limb([16,0],[16,-58],4.6,4,'#6b4a2a');
  Pth([[-26,-66],[26,-66],[26,-44],[-26,-44]]);fs('#f4ecd0');ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(14,-66,12,22);
  ctx.font='900 9.5px '+FONT;ctx.textAlign='center';ctx.fillStyle='#c42a20';ctx.fillText('MIĘSO',0,-51);ln(-20,-62,20,-62,'#c42a20',1.4);
  if(ready){ln(0,-44,0,-36,OL,1.2);ctx.beginPath();ctx.ellipse(0,-27,7,9.5,0.2,0,7);fs('#e58a80');ctx.beginPath();ctx.ellipse(1,-25,4,5.6,0.2,0,7);fs('#f6d0c8',OLW*0.7);Pth([[-3,-36],[3,-36],[2,-40],[-2,-40]]);fs('#f2ede0',OLW*0.7);}
  else{ctx.save();ctx.translate(0,-32);ctx.rotate(-0.15);Pth([[-18,-6],[18,-6],[18,6],[-18,6]]);fs('#2a2a2a');ctx.font='900 6px '+FONT;ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText('NIE MA',0,2.4);ctx.restore();}
  Pth([[-30,-2],[30,-2],[30,2],[-30,2]]);fs('#8a6238',OLW*0.6);},
 _lancuch_old(d,t){const ready=!d||d.reload<=0;ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,-3,26,4,0,0,7);ctx.fill();
  limb([0,-1],[0,-20],4.4,3.6,'#6b4a2a');ctx.beginPath();ctx.arc(0,-21,2.6,0,7);fs('#5a5a5a',OLW*0.6);
  const n=16;for(let i=0;i<n;i++){const a=i/n*Math.PI*2,rx=ready?18:26,ry=ready?6:3.4;const x=Math.cos(a)*rx,y=-6+Math.sin(a)*ry;ctx.save();ctx.translate(x,y);ctx.rotate(a+Math.PI/2);ctx.beginPath();ctx.ellipse(0,0,3.4,2,0,0,7);ctx.strokeStyle=OL;ctx.lineWidth=2.6;ctx.stroke();ctx.strokeStyle=ready?'#b8bec4':'#6a6e72';ctx.lineWidth=1.4;ctx.stroke();ctx.restore();}
  if(ready){ctx.beginPath();ctx.ellipse(0,-7,10,3.4,0,0,7);ctx.strokeStyle='#b8bec4';ctx.lineWidth=1.6;ctx.stroke();ctx.save();ctx.translate(12,-14);ctx.beginPath();ctx.arc(0,0,4,0.3,Math.PI*1.4);sk(OL,3);ctx.beginPath();ctx.arc(0,0,4,0.3,Math.PI*1.4);sk('#9aa0a6',1.6);ctx.restore();}},
 aparatura(d,t){ctx.fillStyle='#5a3e22';ctx.beginPath();ctx.ellipse(0,-3,28,8,0,Math.PI,0);ctx.closePath();fs('#5a3e22');ctx.fillStyle='#6b4a2a';for(let i=0;i<8;i++){ctx.beginPath();ctx.arc(-20+i*6,-4-(i%2)*2,1.4,0,7);ctx.fill();}
  const rise=d&&!d.armed?9*(d.armT/9):0;ctx.save();ctx.beginPath();ctx.rect(-40,-60,80,57);ctx.clip();ctx.translate(0,rise);
  const g=ctx.createLinearGradient(-14,0,14,0);g.addColorStop(0,'#5a240e');g.addColorStop(0.35,'#d9824a');g.addColorStop(0.5,'#f3b07c');g.addColorStop(1,'#5a240e');ctx.beginPath();ctx.ellipse(0,-18,14,12,0,0,7);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
  ctx.beginPath();ctx.moveTo(2,-29);ctx.quadraticCurveTo(14,-36,18,-22);sk(OL,4);ctx.beginPath();ctx.moveTo(2,-29);ctx.quadraticCurveTo(14,-36,18,-22);sk('#b8622e',2.4);
  ctx.beginPath();ctx.arc(-6,-20,4.6,0,7);fs('#f2efe6');ctx.save();ctx.translate(-6,-20);ctx.rotate(d&&d.armed?1.2+Math.sin(t*20)*0.15:-0.8);ln(0,0,0,-3.6,'#b8241c',0.8);ctx.restore();
  const on=d&&d.armed&&Math.sin(t*10)>0;ctx.beginPath();ctx.arc(8,-28,3.2,0,7);fs((!d||d.armed)?(on?'#ff2a2a':'#8a1010'):'#3a2a1a');if(on){const g2=ctx.createRadialGradient(8,-28,1,8,-28,10);g2.addColorStop(0,'rgba(255,60,40,.6)');g2.addColorStop(1,'rgba(255,60,40,0)');ctx.fillStyle=g2;ctx.beginPath();ctx.arc(8,-28,10,0,7);ctx.fill();}
  ctx.restore();if(d&&!d.armed){ctx.fillStyle='rgba(200,200,200,.5)';const q=(t*1.5)%1;ctx.beginPath();ctx.arc(2+q*4,-12-q*18,2+q*3,0,7);ctx.fill();}},
 flaszka(d,t){if(d)ctx.translate(Math.sin(t*50)*1.6,0);ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,0,12,3,0,0,7);ctx.fill();
  Pth([[-8,-34],[8,-34],[9,-2],[-9,-2]]);fs('rgba(200,235,215,.88)');ctx.fillStyle='rgba(240,215,110,.9)';ctx.fillRect(-8,-18,16,15);Pth([[-8,-34],[8,-34],[9,-2],[-9,-2]]);ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
  Pth([[-3.4,-46],[3.4,-46],[3.2,-34],[-3.2,-34]]);fs('rgba(200,235,215,.88)');Pth([[-7,-28],[7,-28],[7,-21],[-7,-21]]);fs('#efe6c8',OLW*0.6);ctx.font='900 3.6px '+FONT;ctx.textAlign='center';ctx.fillStyle='#8a1a20';ctx.fillText('SPIRYTUS',0,-23.6);
  ctx.fillStyle='rgba(255,255,255,.6)';ctx.fillRect(-6,-32,1.4,26);
  Pth([[-3,-46],[3,-46],[5,-54],[0,-50],[-4,-55]]);fs('#e8dcc0',OLW*0.7);
  const f=Math.sin(t*16)*2,f2=Math.sin(t*23)*1.5;Pth([[-6,-50],[-2,-64-f],[1,-56],[4,-68-f2],[7,-50]]);ctx.fillStyle='#ff6a12';ctx.fill();Pth([[-3,-50],[0,-58-f],[3,-50]]);ctx.fillStyle='#ffe04a';ctx.fill();},
 rubin(d,t){ctx.fillStyle='rgba(0,0,0,.32)';ctx.beginPath();ctx.ellipse(0,0,30,4,0,0,7);ctx.fill();
  for(const x of [-22,18])limb([x,-12],[x+(x<0?-3:3),0],3.4,3,'#3a2414');
  Pth([[-28,-54],[28,-54],[28,-12],[-28,-12]]);const g=ctx.createLinearGradient(-28,0,28,0);g.addColorStop(0,'#5a321a');g.addColorStop(0.4,'#8a5530');g.addColorStop(1,'#4a2810');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
  ctx.beginPath();ctx.moveTo(-22,-50);ctx.quadraticCurveTo(-4,-53,14,-50);ctx.quadraticCurveTo(17,-33,14,-17);ctx.quadraticCurveTo(-4,-14,-22,-17);ctx.quadraticCurveTo(-25,-33,-22,-50);ctx.closePath();
  const g2=ctx.createRadialGradient(-6,-36,2,-4,-33,22);g2.addColorStop(0,'#c8dce8');g2.addColorStop(1,'#2a3a48');ctx.fillStyle=g2;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
  ctx.save();ctx.clip();const o=(t*40)%5;for(let i=0;i<8;i++)ln(-24,-50+i*5+o,16,-50+i*5+o,'rgba(255,255,255,'+(0.12+0.12*Math.sin(t*9+i))+')',1);ctx.fillStyle='rgba(255,255,255,.3)';ctx.beginPath();ctx.ellipse(-14,-42,4,6,0.4,0,7);ctx.fill();ctx.restore();
  ctx.beginPath();ctx.arc(22,-44,3,0,7);fs('#d4af37',OLW*0.7);ctx.beginPath();ctx.arc(22,-33,3,0,7);fs('#d4af37',OLW*0.7);for(let i=0;i<4;i++)ln(19,-24+i*2,25,-24+i*2,'#2a1a0c',0.8);
  ctx.font='900 5px '+FONT;ctx.textAlign='center';ctx.fillStyle='#e6c24a';ctx.fillText('РУБИН',-4,-12.6+0.0);
  ln(-6,-54,-18,-72,OL,2.4);ln(-6,-54,-18,-72,'#888',1.2);ln(-2,-54,10,-73,OL,2.4);ln(-2,-54,10,-73,'#888',1.2);ctx.beginPath();ctx.arc(-4,-55,3.4,Math.PI,0);fs('#333',OLW*0.7);
  if(d&&d.hp<d.max*0.5){ctx.strokeStyle='#fff';ctx.lineWidth=0.9;ctx.beginPath();ctx.moveTo(-14,-44);ctx.lineTo(-6,-34);ctx.lineTo(-12,-24);ctx.moveTo(-6,-34);ctx.lineTo(6,-32);ctx.stroke();ctx.fillStyle='rgba(120,120,120,.6)';const q=(t*1.3)%1;ctx.beginPath();ctx.arc(0+q*4,-56-q*14,2+q*3,0,7);ctx.fill();}},
 pralka(d,t){const j=d&&d.kick>0?Math.sin(t*60)*1.4:0;
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(-2,0,34,4.6,0,0,7);ctx.fill();
  Pth([[-34,-14],[-8,-14],[-8,0],[-34,0]]);fs('#8a6238');ln(-34,-7,-8,-7,'#5e3a1e',1);
  for(const [x,y] of [[-29,-14],[-20,-14],[-11.5,-14]]){ctx.save();ctx.translate(x,y);Pth([[-4,0],[4,0],[4,-10],[-4,-10]]);fs('rgba(215,240,230,.92)');ctx.fillStyle='#6a9a2a';ctx.fillRect(-2.6,-8,1.8,7);ctx.fillRect(0.6,-9,1.8,8);Pth([[-4.4,-10],[4.4,-10],[4.4,-12.6],[-4.4,-12.6]]);fs('#c9a24a',OLW*0.7);ctx.restore();}
  ctx.save();ctx.translate(12+j,0);ctx.scale(1.3,1);
  ctx.beginPath();ctx.moveTo(-14,-54);ctx.lineTo(-15,-8);ctx.quadraticCurveTo(-15,0,-8,0);ctx.lineTo(8,0);ctx.quadraticCurveTo(15,0,15,-8);ctx.lineTo(14,-54);ctx.closePath();
  ctx.fillStyle='rgba(200,232,222,.9)';ctx.fill();
  ctx.save();ctx.clip();ctx.fillStyle='rgba(170,200,110,.55)';ctx.fillRect(-16,-44,32,46);
  ctx.fillStyle='#5a8a22';for(const [x,y,h] of [[-9,-40,30],[-3,-44,34],[3,-38,28],[9,-42,32]]){rrect(x-2.6,y,5.2,h,2.6);ctx.fill();}
  ctx.strokeStyle='#3a6a12';ctx.lineWidth=1;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-12+i*6,-46);ctx.lineTo(-10+i*6,-34);ctx.stroke();}
  ctx.fillStyle='#f2efe0';ctx.beginPath();ctx.arc(6,-12,3,0,7);ctx.fill();ctx.fillStyle='rgba(255,255,255,.55)';ctx.fillRect(-11,-50,3,42);ctx.restore();
  ctx.beginPath();ctx.moveTo(-14,-54);ctx.lineTo(-15,-8);ctx.quadraticCurveTo(-15,0,-8,0);ctx.lineTo(8,0);ctx.quadraticCurveTo(15,0,15,-8);ctx.lineTo(14,-54);ctx.closePath();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
  const lid=d&&d.kick>0?-6*(d.kick/0.25):0;Pth([[-15,-54+lid],[15,-54+lid],[15,-60+lid],[-15,-60+lid]]);fs('#c9a24a');ln(-13,-57+lid,13,-57+lid,'#8a6a1a',1);
  Pth([[-10,-24],[10,-24],[10,-14],[-10,-14]]);fs('#f4ecd0',OLW*0.6);ctx.font='900 4.4px '+FONT;ctx.textAlign='center';ctx.fillStyle='#2a6a12';ctx.fillText('OGÓRKI',0,-17.6);
  ctx.restore();},
 _pralka_old(d,t){const j=d&&d.kick>0?Math.sin(t*60)*1.6:0;ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,0,24,3.6,0,0,7);ctx.fill();ctx.save();ctx.translate(j,0);
  for(const x of [-14,10])limb([x,-6],[x,0],3,3,'#555');
  ctx.beginPath();ctx.moveTo(-20,-52);ctx.lineTo(-20,-10);ctx.quadraticCurveTo(-20,-4,-14,-4);ctx.lineTo(12,-4);ctx.quadraticCurveTo(18,-4,18,-10);ctx.lineTo(18,-52);ctx.closePath();
  const g=ctx.createLinearGradient(-20,0,18,0);g.addColorStop(0,'#c8c2b2');g.addColorStop(0.35,'#f6f2e8');g.addColorStop(1,'#a8a292');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
  Pth([[-20,-32],[18,-32],[18,-24],[-20,-24]]);fs('#4a7ac0',OLW*0.7);ctx.font='900 6px '+FONT;ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText('FRANIA',-1,-25.8);
  ctx.beginPath();ctx.ellipse(-1,-52,19,5,0,0,7);fs('#ddd6c6');ctx.beginPath();ctx.ellipse(-1,-53,12,3,0,0,7);fs('#bdb5a2',OLW*0.6);ctx.beginPath();ctx.arc(-1,-56,2,0,7);fs('#333',OLW*0.6);
  Pth([[18,-44],[28,-44],[28,-40],[18,-40]]);fs('#8a8a8a',OLW*0.7);ctx.beginPath();ctx.arc(29,-42,3,0,7);fs('#444',OLW*0.6);
  Pth([[-24,-40],[-20,-40],[-20,-30],[-24,-30]]);fs('#666',OLW*0.6);
  ctx.fillStyle='rgba(255,255,255,.92)';for(let i=0;i<5;i++){const q=(t*0.8+i/5)%1;ctx.beginPath();ctx.arc(-8+i*4+Math.sin(t*3+i)*2,-58-q*16,1.4+q*2,0,7);ctx.fill();ctx.strokeStyle='rgba(120,170,230,.6)';ctx.lineWidth=0.5;ctx.stroke();}
  ctx.restore();},
 rozlew(d,t){const n=d&&d.life!=null?clamp(d.life/10,0.6,3):3;
  ctx.beginPath();ctx.ellipse(6,-4,12+n*5,3.6+n*1.4,0,0,7);ctx.fillStyle='#6a5226';ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW*0.8;ctx.stroke();
  ctx.fillStyle='#8a6e30';ctx.beginPath();ctx.ellipse(2,-5,6+n*2,1.8,0,0,7);ctx.fill();ctx.fillStyle='rgba(150,170,60,.7)';ctx.beginPath();ctx.ellipse(12,-3,4+n,1.2,0,0,7);ctx.fill();
  for(let i=0;i<3;i++){const q=(t*0.9+i/3)%1;ctx.beginPath();ctx.arc(-2+i*8,-5-q*2,0.8+q*1.4,0,7);ctx.strokeStyle='rgba(200,190,120,'+(1-q)+')';ctx.lineWidth=0.8;ctx.stroke();}
  ctx.save();ctx.translate(-20,-7);ctx.rotate(-1.25);Pth([[-7,-10],[7,-10],[5.6,8],[-5.6,8]]);fs('#8a6238');ln(-6.6,-4,6.6,-4,'#3a3a3a',1.4);ln(-6,3,6,3,'#3a3a3a',1.4);ctx.beginPath();ctx.ellipse(0,-10,7,2,0,0,7);fs('#4a3418',OLW*0.7);ctx.restore();
  ctx.strokeStyle='rgba(120,140,60,.55)';ctx.lineWidth=1.2;for(let i=0;i<3;i++){ctx.beginPath();const x0=-2+i*9;ctx.moveTo(x0,-10);ctx.quadraticCurveTo(x0+3+Math.sin(t*3+i)*2,-17,x0,-24);ctx.stroke();}
  ctx.fillStyle='#1a1a1a';for(let i=0;i<3;i++){const a=t*(5+i)+i*2;const fx=6+Math.cos(a)*(10+i*3),fy=-20+Math.sin(a*1.3)*6;ctx.beginPath();ctx.arc(fx,fy,1.2,0,7);ctx.fill();ctx.fillStyle='rgba(220,230,255,.7)';ctx.beginPath();ctx.ellipse(fx-0.8,fy-1.4,1,0.6,0,0,7);ctx.fill();ctx.fillStyle='#1a1a1a';}},
 armata(d,t){const rec=d&&d.kick>0?-(d.kick/0.25)*5:0;ctx.fillStyle='rgba(0,0,0,.32)';ctx.beginPath();ctx.ellipse(0,0,34,4,0,0,7);ctx.fill();
  Pth([[-30,-6],[10,-16],[12,-11],[-28,-1]]);fs('#6e4a2a');
  ctx.save();ctx.translate(-2+rec,-24);ctx.rotate(-0.25);const g=ctx.createLinearGradient(0,-8,0,8);g.addColorStop(0,'#e8bc70');g.addColorStop(0.5,'#a8782c');g.addColorStop(1,'#5a3a10');Pth([[-18,-8],[30,-6],[30,6],[-18,8]]);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
  for(const x of [-8,8,22])Pth([[x,-7.6],[x+3,-7.4],[x+3,7.4],[x,7.6]]),fs('#c9962e',OLW*0.6);Pth([[30,-7.6],[34,-7.6],[34,7.6],[30,7.6]]);fs('#8a6420',OLW*0.8);ctx.beginPath();ctx.arc(-20,0,6,0,7);fs('#8a6420');ctx.beginPath();ctx.arc(-26,0,2.6,0,7);fs('#8a6420',OLW*0.7);ctx.restore();
  ctx.save();ctx.translate(-6,-12);ctx.beginPath();ctx.arc(0,0,11,0,7);fs('#5a3e24');ctx.strokeStyle='#3a3a3a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,11,0,7);ctx.stroke();for(let i=0;i<8;i++){ctx.rotate(Math.PI/4);ln(0,0,0,-10,'#7a5634',1.6);}ctx.beginPath();ctx.arc(0,0,2.6,0,7);fs('#3a3a3a',OLW*0.7);ctx.beginPath();ctx.arc(0,0,12,0,7);ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();ctx.restore();
  for(const [x,y] of [[16,-4],[23,-4],[19.5,-10.4]]){ctx.beginPath();ctx.arc(x,y,3.8,0,7);fs('#1c1c1c',OLW*0.7);ctx.fillStyle='rgba(255,255,255,.3)';ctx.beginPath();ctx.arc(x-1,y-1.2,1,0,7);ctx.fill();}
  if(d&&d.kick>0.15){ctx.fillStyle='rgba(255,200,90,.85)';ctx.beginPath();ctx.arc(34,-34,6,0,7);ctx.fill();}},
 maluch(d,t){ctx.fillStyle='rgba(0,0,0,.32)';ctx.beginPath();ctx.ellipse(0,0,34,4.4,0,0,7);ctx.fill();
  const b=d?Math.abs(Math.sin(t*30))*0.8:0;ctx.save();ctx.translate(0,-b);
  ctx.beginPath();ctx.moveTo(-32,-12);ctx.lineTo(-30,-24);ctx.quadraticCurveTo(-22,-27,-16,-28);ctx.quadraticCurveTo(-8,-46,8,-44);ctx.quadraticCurveTo(22,-42,26,-28);ctx.lineTo(32,-24);ctx.lineTo(33,-12);ctx.closePath();
  ctx.fillStyle='#e8c84a';ctx.fill();ctx.save();ctx.clip();ctx.fillStyle='rgba(0,0,0,.14)';ctx.fillRect(-34,-18,70,8);ctx.restore();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
  Pth([[-13,-30],[-7,-41],[0,-41],[0,-30]]);fs('#9fc6e0',OLW*0.8);Pth([[3,-30],[3,-41],[10,-41],[20,-30]]);fs('#9fc6e0',OLW*0.8);ln(1.5,-42,1.5,-14,'#a88a2a',1);
  ctx.fillStyle='#2e3442';ctx.beginPath();ctx.arc(8,-34,3.2,0,7);ctx.fill();
  Pth([[-34,-14],[-24,-14],[-24,-11],[-34,-11]]);fs('#9aa0a6',OLW*0.6);Pth([[26,-14],[35,-14],[35,-11],[26,-11]]);fs('#9aa0a6',OLW*0.6);
  ctx.beginPath();ctx.arc(31,-21,2.6,0,7);fs('#fff4c0',OLW*0.6);
  for(const wx of [-18,18]){ctx.save();ctx.translate(wx,-8);ctx.beginPath();ctx.arc(0,0,7.4,0,7);fs('#161616');ctx.rotate(d?t*14:0);ctx.beginPath();ctx.arc(0,0,3.6,0,7);fs('#c9ced4',OLW*0.6);ctx.fillStyle='#55585c';ctx.fillRect(-0.6,-3,1.2,6);ctx.restore();}
  ctx.font='900 5px '+FONT;ctx.textAlign='center';ctx.fillStyle='#5a4a10';ctx.fillText('126p',-16,-17);
  ctx.restore();if(d){for(let i=0;i<3;i++){const q=(t*3+i/3)%1;ctx.fillStyle='rgba(90,90,90,'+(0.5*(1-q))+')';ctx.beginPath();ctx.arc(-36-q*12,-12-q*6,2+q*3,0,7);ctx.fill();}}},
 plug(d,t){ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,0,32,4,0,0,7);ctx.fill();
  limb([-30,-40],[8,-14],4.4,4,'#7a5230');limb([-34,-46],[-24,-40],3.6,3.6,'#7a5230');limb([-36,-34],[-26,-36],3.6,3.6,'#7a5230');limb([-26,-36],[-4,-16],3.4,3.4,'#6e4a2a');
  Pth([[-2,-18],[4,-18],[6,-2],[-2,-2]]);fs('#5a3a1e');Pth([[4,-18],[26,-6],[30,-1],[6,-2]]);fs('#8a9096');ctx.fillStyle='rgba(255,255,255,.4)';Pth([[8,-14],[22,-6],[20,-5],[8,-11]]);ctx.fill();
  ctx.save();ctx.translate(24,-6);ctx.beginPath();ctx.arc(0,0,6,0,7);fs('#5a3e24');ctx.rotate(d?t*8:0);for(let i=0;i<5;i++){ctx.rotate(Math.PI*2/5);ln(0,0,0,-5,'#3a2a14',1);}ctx.restore();
  limb([8,-14],[30,-30],2.4,2.4,'#9a7a4a');ctx.beginPath();ctx.arc(31,-31,2.4,0,7);fs('#5a5a5a',OLW*0.6);
  if(d){ctx.fillStyle='#5a3a1e';for(let i=0;i<5;i++){const q=(t*3+i/5)%1;ctx.beginPath();ctx.arc(-6-q*16,-2-Math.sin(q*Math.PI)*10,1.6,0,7);ctx.fill();}}},
 kombajn(d,t){const rev=d&&d.rev;ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(0,0,38,4.4,0,0,7);ctx.fill();
  Pth([[-34,-44],[12,-44],[14,-12],[-34,-12]]);const g=ctx.createLinearGradient(0,-44,0,-12);g.addColorStop(0,'#d03a2a');g.addColorStop(1,'#8a1e14');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
  ln(-34,-30,14,-30,'#6a140c',0.8);for(let i=0;i<5;i++)ln(-28+i*8,-28,-28+i*8,-16,'#6a140c',0.6);
  Pth([[-36,-64],[-14,-64],[-12,-44],[-36,-44]]);fs('#e8e2d0');Pth([[-33,-61],[-17,-61],[-16,-47],[-33,-47]]);fs('#8fb8d4',OLW*0.7);ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillRect(-31,-59,3,10);ctx.fillStyle='#2e3442';ctx.beginPath();ctx.arc(-22,-52,3,0,7);ctx.fill();
  Pth([[-12,-56],[10,-56],[10,-44],[-12,-44]]);fs('#d9b23a');ctx.fillStyle='#c9a020';for(let i=0;i<4;i++)ctx.fillRect(-10+i*5,-55,3,2);
  limb([-36,-62],[-36,-72],2.6,2.2,'#2a2a2a');if(d){const q=(t*1.5)%1;ctx.fillStyle='rgba(70,70,70,'+(0.5*(1-q))+')';ctx.beginPath();ctx.arc(-36-q*4,-76-q*12,2+q*4,0,7);ctx.fill();}
  ctx.font='900 7px '+FONT;ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText('BIZON',-12,-34);
  Pth([[12,-18],[40,-14],[40,-6],[12,-8]]);fs('#7a1e14');for(let i=0;i<7;i++){ctx.fillStyle='#ccc';Pth([[14+i*4,-6],[16+i*4,-2],[18+i*4,-6]]);ctx.fill();}
  ctx.save();ctx.translate(30,-24);ctx.rotate(rev?t*10:t*1.5);for(let i=0;i<6;i++){ctx.rotate(Math.PI/3);limb([0,0],[0,-12],2,2,'#e0c040');Pth([[-4,-13],[4,-13],[4,-10.6],[-4,-10.6]]);fs('#e0c040',OLW*0.6);}ctx.beginPath();ctx.arc(0,0,2.4,0,7);fs('#555',OLW*0.6);ctx.restore();
  for(const [wx,r] of [[-24,11],[6,7]]){ctx.save();ctx.translate(wx,-r+0.5);ctx.beginPath();ctx.arc(0,0,r,0,7);fs('#141414');ctx.beginPath();ctx.arc(0,0,r*0.5,0,7);fs('#d9b23a',OLW*0.7);ctx.rotate(rev?t*4:0);ctx.fillStyle='#8a6a1a';ctx.fillRect(-0.8,-r*0.45,1.6,r*0.9);ctx.restore();}
  if(rev){ctx.fillStyle='#d9c070';for(let i=0;i<4;i++){const q=(t*3+i/4)%1;ctx.fillRect(34+q*6,-30+q*20,1.4,1.4);}}},
 lopata(d,t){limb([-14,-62],[6,-16],3.6,3.6,'#8a5a32');limb([-20,-63],[-8,-61],3.4,3.4,'#8a5a32');Pth([[0,-20],[12,-14],[16,0],[4,-2],[-4,-12]]);fs('#9aa0a6');ln(4,-12,12,-6,'#d0d4d8',1);},
 ursus(d,t){ursus(0,0,64,t,!!(d&&d.moving));}
};
function drawDefRaw(k,cx,by,sz,d,tt){
 const sc=sz/72;ctx.save();ctx.translate(cx,by);ctx.scale(sc,sc);const prev=OLW;OLW=clamp(1.7/sc,0.9,4);
 if(d&&d.hitT>0)ctx.translate(Math.sin((tt||0)*80)*1.4,0);
 const f=DRAW[k];if(f)f(d,tt||0);
 OLW=prev;ctx.restore();
}
function ursus(x,y,s,t,moving){
 const sc=s/64;ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);const prev=OLW;OLW=clamp(1.7/sc,0.9,4);
 ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(4,0,36,4.4,0,0,7);ctx.fill();
 const rot=moving?t*14:0;
 ctx.save();ctx.translate(-14,-19);ctx.beginPath();ctx.arc(0,0,19,0,7);fs('#161616');ctx.rotate(rot);for(let i=0;i<12;i++){ctx.rotate(Math.PI/6);Pth([[-2.6,-19.6],[2.6,-19.6],[1.6,-16],[-1.6,-16]]);ctx.fillStyle='#2e2e2e';ctx.fill();}ctx.beginPath();ctx.arc(0,0,8.6,0,7);fs('#c9a020',OLW*0.8);ctx.fillStyle='#8a6a10';for(let i=0;i<5;i++){ctx.rotate(Math.PI*2/5);ctx.beginPath();ctx.arc(0,-5,1,0,7);ctx.fill();}ctx.beginPath();ctx.arc(0,0,2.6,0,7);fs('#6a5010',OLW*0.6);ctx.restore();
 ctx.beginPath();ctx.arc(-14,-19,23,Math.PI*1.03,Math.PI*1.97);sk(OL,7.4);ctx.beginPath();ctx.arc(-14,-19,23,Math.PI*1.03,Math.PI*1.97);sk('#c4291c',5);
 Pth([[0,-24],[28,-24],[28,-14],[0,-14]]);fs('#3a3a3a');ctx.fillStyle='#555';for(let i=0;i<4;i++)ctx.fillRect(4+i*6,-22,3,6);
 Pth([[-4,-40],[30,-40],[36,-36],[36,-23],[-4,-23]]);const g=ctx.createLinearGradient(0,-40,0,-23);g.addColorStop(0,'#e0402e');g.addColorStop(1,'#9a1e14');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(0,-39,24,1.4);Pth([[33,-37],[37,-35],[37,-24],[33,-24]]);fs('#2a2a2a',OLW*0.7);for(let i=0;i<4;i++)ln(34,-34+i*2.6,36.4,-34+i*2.6,'#777',0.6);
 ctx.beginPath();ctx.arc(31,-30,2.2,0,7);fs('#fff4c0',OLW*0.5);
 ctx.font='900 6.4px '+FONT;ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText('URSUS',14,-29);
 Pth([[-24,-46],[-10,-46],[-10,-42],[-24,-42]]);fs('#2a2a2a',OLW*0.8);limb([-17,-42],[-16,-30],2.6,2.6,'#2a2a2a');
 limb([-2,-40],[-8,-52],2.4,2.4,'#222');ctx.beginPath();ctx.ellipse(-8,-52,6,1.8,0,0,7);ctx.strokeStyle=OL;ctx.lineWidth=2.4;ctx.stroke();ctx.strokeStyle='#333';ctx.lineWidth=1.2;ctx.stroke();
 limb([22,-40],[22,-58],3.6,3,'#222');Pth([[20.6,-60],[23.6,-60],[24.4,-62],[19.8,-62]]);fs('#222',OLW*0.6);
 ctx.save();ctx.translate(30,-9);ctx.beginPath();ctx.arc(0,0,9,0,7);fs('#161616');ctx.rotate(rot);ctx.beginPath();ctx.arc(0,0,4,0,7);fs('#c9a020',OLW*0.7);ctx.fillStyle='#8a6a10';ctx.fillRect(-0.6,-3.4,1.2,6.8);ctx.restore();
 if(moving){for(let i=0;i<3;i++){const q=((t*3)+i/3)%1;ctx.fillStyle='rgba(60,60,60,'+(0.55*(1-q))+')';ctx.beginPath();ctx.arc(22-q*14,-64-q*14,3+q*4,0,7);ctx.fill();}}
 OLW=prev;ctx.restore();
}
function boot(x,y,s,r){ctx.save();ctx.translate(x,y);ctx.rotate(r||0);ctx.scale(s*0.85,s*0.85);const prev=OLW;OLW=clamp(1.6/(s*0.85),0.9,4);nBoot();OLW=prev;ctx.restore();}
function bottleIcon(x,y,s,glow){
 ctx.save();ctx.translate(x,y);ctx.scale(s,s);const prev=OLW;OLW=1.4/s;
 if(glow){const g=ctx.createRadialGradient(0,-4,2,0,-4,20);g.addColorStop(0,'rgba(255,225,110,.55)');g.addColorStop(1,'rgba(255,225,110,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,-4,20,0,7);ctx.fill();}
 ctx.beginPath();ctx.moveTo(-7,-8);ctx.quadraticCurveTo(-7,-12,-3,-12);ctx.lineTo(-3,-19);ctx.lineTo(3,-19);ctx.lineTo(3,-12);ctx.quadraticCurveTo(7,-12,7,-8);ctx.lineTo(7,8);ctx.quadraticCurveTo(7,10,5,10);ctx.lineTo(-5,10);ctx.quadraticCurveTo(-7,10,-7,8);ctx.closePath();
 ctx.fillStyle='rgba(225,245,245,.95)';ctx.fill();ctx.save();ctx.clip();ctx.fillStyle='#f3d36b';ctx.fillRect(-8,-3,16,14);ctx.fillStyle='#fff6d0';ctx.fillRect(-8,-3,16,1);ctx.restore();ctx.strokeStyle=OL;ctx.lineWidth=OLW;ctx.stroke();
 Pth([[-3.4,-23],[3.4,-23],[3,-19],[-3,-19]]);fs('#a0703a',OLW*0.8);ctx.fillStyle='#efe6c8';ctx.fillRect(-5.4,-8,10.8,4);ctx.fillStyle='rgba(255,255,255,.7)';ctx.fillRect(-5,-10,1.6,15);
 OLW=prev;ctx.restore();
}

