/* ---------- zapis ---------- */
let save={unlocked:1,best:0,load:null,sfx:true,mus:true,seen:[],stars:{},diff:'normal',evilUnlocked:1,evilStars:{},evilLoad:null};
try{const s=JSON.parse(localStorage.getItem('evc_save_v1')||'null');if(s&&typeof s.unlocked==='number')save=Object.assign(save,s);}catch(e){}
if(!save.v){save.unlocked=Math.min(11,Math.max(1,save.unlocked*2-1));save.load=null;save.v=3;}
if(!Array.isArray(save.seen))save.seen=[];
if(!save.stars||typeof save.stars!=='object')save.stars={};if(!save.evilUnlocked)save.evilUnlocked=1;if(!save.evilStars||typeof save.evilStars!=='object')save.evilStars={};if(!save.diff)save.diff='normal';
const EZ=()=>save.diff==='easy';
if(save.v===3){const M=[1,1,2,3,5,6,8,10,11,13,14,16];save.unlocked=M[Math.min(11,save.unlocked)]||1;save.load=null;save.v=4;}
function persist(){try{localStorage.setItem('evc_save_v1',JSON.stringify(save));}catch(e){}}

