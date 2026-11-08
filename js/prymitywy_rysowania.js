/* ---------- prymitywy rysowania ---------- */
function ell(x,y,rx,ry){ctx.beginPath();ctx.ellipse(x,y,Math.abs(rx),Math.abs(ry),0,0,Math.PI*2);ctx.fill();}
function circ(x,y,r){ctx.beginPath();ctx.arc(x,y,Math.abs(r),0,Math.PI*2);ctx.fill();}
function poly(p){ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);ctx.closePath();ctx.fill();}
function line(x1,y1,x2,y2,w,c){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
function fr(c,x,y,w,h){ctx.fillStyle=c;ctx.fillRect(x,y,w,h);}
function rrect(x,y,w,h,r){r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function txt(s,x,y,sz,w,c,al,st){ctx.font=F(sz,w);ctx.textAlign=al||'center';ctx.textBaseline='alphabetic';if(st){ctx.lineJoin='round';ctx.lineWidth=st[1]||3;ctx.strokeStyle=st[0];ctx.strokeText(s,x,y);}ctx.fillStyle=c;ctx.fillText(s,x,y);}
function wrap(s,maxW){const ws=String(s||'').split(' '),out=[];let cur='';for(const w of ws){const t=cur?cur+' '+w:w;if(ctx.measureText(t).width>maxW&&cur){out.push(cur);cur=w;}else cur=t;}if(cur)out.push(cur);return out;}

