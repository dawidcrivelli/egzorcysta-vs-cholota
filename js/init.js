'use strict';
const cv=document.getElementById('c');let ctx=cv.getContext('2d',{alpha:false});
const LH=450;
let DPR=1,CW=1,CH=1,S=1,LW=800,T=0;
const L={};
const FONT='Rubik, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const F=(s,w)=>(w||700)+' '+s+'px '+FONT;
const rnd=n=>Math.floor(Math.random()*n), rr=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a,b)=>v<a?a:v>b?b:v, lerp=(a,b,t)=>a+(b-a)*t;

function layout(){L.top=78;L.rowH=(LH-L.top-6)/5;L.x0=78;L.cellW=clamp((LW-L.x0-50)/9,48,98);L.x1=L.x0+9*L.cellW;}
// pełna gęstość ekranu (do 3): przy mniejszej przeglądarka rozciąga płótno i rozmywa grafikę;
// save.lowres (Ostrość: oszczędna, w pauzie) = do 2, dla słabszych telefonów
function resize(){const r=cv.getBoundingClientRect();CW=Math.max(1,r.width);CH=Math.max(1,r.height);DPR=Math.min(window.devicePixelRatio||1,typeof save!=='undefined'&&save.lowres?2:3);cv.width=Math.round(CW*DPR);cv.height=Math.round(CH*DPR);S=CH/LH;LW=CW/S;layout();SPR.clear();FIELD=null;}
const PX=x=>L.x0+x*L.cellW, RY=r=>L.top+r*L.rowH, FY=r=>L.top+(r+0.9)*L.rowH;

