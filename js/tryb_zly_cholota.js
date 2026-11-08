/* ---------- tryb zły: chołota ---------- */
let MODE='good';
const EVB={hp:2.6,cost:1,cd:0.6,bite:2,botInc:0.5,bimbMax:4,react:1};
const UNIT={trup:[50,3],kura:[25,2],sasiad:[50,4],urzednik:[75,7],komunista:[100,7],milicjant:[75,5],nysa:[250,22],wampir:[100,7],mumia:[150,9],lunatyk:[75,5],swinia:[100,7],lenin:[200,12],przodownik:[125,9],burak:[100,7],barszcz:[150,10],krowa:[250,18],carski:[150,9],okupant:[150,9],sekretarz:[175,12],boss:[500,50],palac:[800,80]};
const GROB={name:'Rozkopany grób',cost:50,cd:5,desc:'Stawiasz go na cmentarzu, czyli w dwóch ostatnich kolumnach. Co 10 sekund wypuszcza duszyczkę wartą 25. Duszyczki to waluta chołoty, zbierasz je dotykiem.'};
const SHOOT=['gumofilce','resztki','woda','pralka','samowar','armata'];
function costOf(k){if(k==='grob')return GROB.cost;if(UNIT[k])return Math.max(10,Math.round(UNIT[k][0]*EVB.cost/5)*5);return DEF[k]?DEF[k].cost:0;}
function cdOf(k){if(k==='grob')return GROB.cd;if(UNIT[k])return Math.max(1,Math.round(UNIT[k][1]*EVB.cd*2)/2);return DEF[k]?DEF[k].cd:1;}
function infoOf(k){if(k==='grob')return GROB;if(UNIT[k])return{name:EN[k].name,desc:EN[k].desc,cost:UNIT[k][0]};return DEF[k];}
function evilUnits(li){const out=[];for(let i=0;i<=li;i++)for(const k of LEVELS[i].newEn)if(UNIT[k]&&!out.includes(k))out.push(k);return out;}
function cur(){return G&&G.evil?'duszyczek':'samogonu';}

