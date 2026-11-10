/* Styl „Odnowa lekka”: te same rysunki co Odnowa, ale na czas rysowania podmienia:
   - cień: tint(c,f) z f<1 przyciemnia tylko o 40% tego co zwykle, a półprzezroczyste brązowe cienie są o połowę słabsze;
   - kontur: zamiast czarnej linii (OL) cieńsza linia w ciemniejszym odcieniu wypełnienia (kolorowy kontur). */
(()=>{
const O=STYLES.find(s=>s.id==='odnowa');if(!O)return;
const P=CanvasRenderingContext2D.prototype,stroke0=P.stroke,fill0=P.fill;
const OLC='#150e09',SHADE=0.4,WIDTH=0.7,DARK=0.55;
const hex=c=>typeof c==='string'&&/^#[0-9a-f]{6}$/i.test(c);
const darken=c=>{const n=parseInt(c.slice(1),16),f=v=>Math.round(v*DARK);return`rgb(${f(n>>16)},${f(n>>8&255)},${f(n&255)})`;};
function light(fn){
 const tint0=window.tint;
 window.tint=(c,f)=>tint0(c,f<1?1-(1-f)*SHADE:f);
 P.stroke=function(...a){
  if(this.strokeStyle!==OLC)return stroke0.apply(this,a);
  const ss=this.strokeStyle,lw=this.lineWidth;
  this.strokeStyle=hex(this.fillStyle)&&this.fillStyle!==OLC?darken(this.fillStyle):'rgba(60,40,25,.7)';this.lineWidth=lw*WIDTH;
  stroke0.apply(this,a);this.strokeStyle=ss;this.lineWidth=lw;};
 P.fill=function(...a){   // półprzezroczyste ciemne cienie: słabiej
  const fsl=this.fillStyle,m=typeof fsl==='string'&&fsl.match(/^rgba\((\d+), (\d+), (\d+), ([\d.]+)\)$/);
  if(m&&+m[1]<80&&+m[2]<80&&+m[3]<80&&+m[4]<0.5){this.fillStyle=`rgba(${m[1]}, ${m[2]}, ${m[3]}, ${(+m[4]*0.5).toFixed(3)})`;fill0.apply(this,a);this.fillStyle=fsl;return;}
  return fill0.apply(this,a);};
 try{return fn();}finally{window.tint=tint0;P.stroke=stroke0;P.fill=fill0;}
}
STYLES.push({id:'odnowa_lekka',name:'Odnowa lekka: jaśniej, kolorowy kontur',
 desc:'Te same rysunki co Odnowa, ale lżejsze cienie i cieńszy kontur w kolorze wypełnienia zamiast czarnego.',
 en:O.en,def:O.def,hero:O.hero,
 draw:(...a)=>light(()=>O.draw(...a)),drawDef:(...a)=>light(()=>O.drawDef(...a)),drawHero:(...a)=>light(()=>O.drawHero(...a)),
 drawHeroPose:(...a)=>light(()=>O.drawHeroPose(...a)),drawProj:(...a)=>light(()=>O.drawProj(...a))});
})();
