/* ---------- styl grafiki w grze: klasyczna (gra), rysunek (odnowa), rysunek lekki, piksel ----------
   Pliki stylów (js/styles/*.js, ładowane po tym pliku) dopisują się do STYLES. Tu podmieniamy surowe funkcje rysowania:
   bufor klatek (drawEnemyKey, drawDef) woła drawEnemyRaw/drawDefRaw, więc wystarczy podmienić te dwie, Ursusa i Zdzicha na tytule.
   Czego styl nie ma, rysuje grafika gry. W przeglądzie postaci (window.POSTACIE) podmiana jest wyłączona. */
window.STYLES=window.STYLES||[{id:'gra',name:'Obecna grafika',draw:(k,x,y,h,st)=>drawEnemyRaw(k,x,y,h,st)}];
const GAME_STYLES=[['gra','klasyczna'],['odnowa','rysunek'],['odnowa_lekka','rysunek lekki'],['pixel','piksel']];
function gameStyle(){if(window.POSTACIE||!save.style||save.style==='gra')return null;return STYLES.find(s=>s.id===save.style)||null;}
function styleHas(s,unit,k){const f=s&&s[unit];return typeof f==='function'?!!f(k):Array.isArray(f)?f.includes(k):false;}
function styleName(){const g=GAME_STYLES.find(x=>x[0]===(save.style||'gra'));return g?g[1]:'klasyczna';}
/* następny styl z listy; czyści bufor klatek, bo klucze klatek nie zawierają stylu */
function nextGameStyle(){
 const i=GAME_STYLES.findIndex(x=>x[0]===(save.style||'gra'));save.style=GAME_STYLES[(i+1)%GAME_STYLES.length][0];persist();
 resize();LASTSPR.clear();if(G&&scene==='play')queueWarm();   // resize: inna gęstość pikseli dla pixel artu, czyści bufor
}
{
 const enemyRaw0=drawEnemyRaw,defRaw0=drawDefRaw,ursus0=ursus;
 drawEnemyRaw=function(k,x,y,h,st){const s=gameStyle();if(s&&styleHas(s,'en',k)){s.draw(k,x,y,h,st);return;}enemyRaw0(k,x,y,h,st);};
 drawDefRaw=function(k,cx,by,sz,d,tt){const s=gameStyle();if(s&&styleHas(s,'def',k)){ctx.save();try{s.drawDef(k,cx,by,sz,d,tt);}finally{ctx.restore();}return;}defRaw0(k,cx,by,sz,d,tt);};
 // Ursus w grze: s = 64 jednostki, w stylach sprzęt ma 72 jednostki na pole
 ursus=function(x,y,s,t,moving){const st=gameStyle();if(st&&styleHas(st,'def','ursus')){ctx.save();try{st.drawDef('ursus',x,y,s*72/64,{k:'ursus',def:DEF.ursus,moving,hp:1,max:1,t:9,kick:0,hitT:0},t);}finally{ctx.restore();}return;}ursus0(x,y,s,t,moving);};
 // Zdzichu: na tytule (dziad → drawHuman bez pozy, patrzy w prawo), w intro, przy Ursusie i przy przegranej (z pozą z gry)
 const human0=drawHuman;
 drawHuman=function(k,x,y,h,st){const s=k==='dziad'&&gameStyle();
  if(s&&s.drawHeroPose){ctx.save();try{if(s.drawHeroPose(x,y,h,{...st,mode:heroMode(st)})!==false)return;}finally{ctx.restore();}}
  human0(k,x,y,h,st);};
}
/* rodzaj sceny ze Zdzichem po pozie z gry: siedzi na Ursusie (SEAT), przestraszony (ręce w górze), maszeruje, polewa */
function heroMode(st){const P=st&&st.pose;if(!P)return'idle';if(P===SEAT||P.legs===SEAT.legs)return P.arms[0].sh>2.4?'scared':'seat';return'walk';}
/* pocisk w stylu gry: true = narysowany */
function styleProj(kind,x,y,rot,v){const s=gameStyle();if(!s||!s.drawProj)return false;ctx.save();try{return !!s.drawProj(kind,x,y,rot,v,L.rowH);}finally{ctx.restore();}}
