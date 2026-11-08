/* ---------- poziomy ---------- */
const D1=['bimbrownia','gumofilce'],D2=D1.concat(['szafa']),D3=D2.concat(['resztki']),D4=D3.concat(['kabel']),D5=D4.concat(['aparatura']),D6=D5.concat(['woda']),D7=D6.concat(['rubin']),D8=D7.concat(['pralka']),D9=D8.concat(['lancuch']),D10=D9.concat(['relikwia','samowar']),D11=D10.concat(['rozlew']),D12=D11.concat(['pila']),D13=D12.concat(['armata','flaszka']),D14=D13.concat(['plug']),D15=D14.concat(['kombajn']);
const LEVELS=[
 {name:'Noc pierwsza',sub:'Ktoś rozkopał cmentarz parafialny. Trupy idą prosto na zagrodę.',quote:'Ech, znowu. Daj no flaszkę i gumofilce, pogonimy.',theme:0,start:150,slots:6,defs:D1,intro:['bimbrownia','gumofilce','lopata','ursus'],newEn:['trup'],
  waves:'20:trup|42:trup|60:trup|76:trup*2|92:trup|106:trup*2|122:trup*2|142:!trup*6'},
 {name:'Sąsiedzka wizyta',sub:'Sąsiad przyszedł pożyczyć szklankę. I nie wyjdzie, dopóki nie pożyczy flaszki.',quote:'Ten to zawsze wie, kiedy pędzę.',theme:0,start:150,slots:6,defs:D2,intro:['szafa'],newEn:['sasiad'],
  waves:'18:trup|36:trup|52:sasiad|66:trup*2|82:sasiad,trup|98:trup*2|114:!trup*3,sasiad*2|136:trup*2,sasiad|156:!trup*4,sasiad*3'},
 {name:'Gmina przysłała ludzi',sub:'Urzędnik ma do pana sprawę. Ze stemplem.',quote:'Papiery to ja mam. W meblościance.',theme:1,start:150,slots:6,defs:D3,intro:['resztki'],newEn:['urzednik'],
  waves:'18:trup|34:urzednik|50:trup*2|66:sasiad,trup|82:urzednik,trup|98:!trup*3,urzednik|118:sasiad,urzednik,trup|136:trup*2,urzednik|156:!trup*4,urzednik*2,sasiad'},
 {name:'Wiec pod remizą',sub:'Aktywista zwołał zebranie. Porządek obrad: twoja bimbrownia.',quote:'Zebrania to ja lubię. Szczególnie nieobecność na nich.',theme:1,start:150,slots:6,defs:D4,intro:['kabel'],newEn:['komunista'],
  waves:'18:trup|32:komunista|48:trup,urzednik|62:komunista,trup|78:sasiad*2|94:!komunista*2,trup*3|114:urzednik,komunista|132:trup*3,sasiad|152:!komunista*3,trup*3,urzednik'},
 {name:'Milicja na sygnale',sub:'Ktoś doniósł o bimbrowni. Jedzie Nysa.',quote:'Kabel mam goły od zawsze. Nikt nie pytał.',theme:2,start:175,slots:6,defs:D5,intro:['aparatura'],newEn:['milicjant','nysa'],
  waves:'18:trup|32:milicjant|48:trup,urzednik|62:komunista,milicjant|78:milicjant,trup*2|94:komunista,sasiad|110:!milicjant*2,komunista,trup*3|128:nysa|144:urzednik*2,komunista|160:milicjant*2,trup*2|180:!nysa,milicjant*3,komunista,trup*3'},
 {name:'Cmentarz parafialny',sub:'Ktoś zostawił otwartą kryptę. Coś z niej wyszło i jest głodne.',quote:'Święconej mam dwa baniaki. Starczy na pół wsi.',theme:3,start:175,slots:7,defs:D6,intro:['woda'],newEn:['wampir'],
  waves:'18:trup*2|32:wampir|48:trup,milicjant|62:wampir,komunista|78:trup*3|94:!wampir*2,trup*3,urzednik|116:milicjant,wampir|134:nysa,trup*2|154:!wampir*3,trup*4,milicjant'},
 {name:'Muzeum w powiecie',sub:'Z gabloty uciekły mumie. Kierownik twierdzi, że to nie jego wina.',quote:'Egipt, nie Egipt, bandaż pali się tak samo.',theme:3,start:200,slots:7,defs:D7,intro:['rubin'],newEn:['mumia'],
  waves:'18:trup*2|32:mumia|48:wampir,trup|64:mumia,komunista|80:milicjant*2|96:!mumia,wampir*2,trup*3|118:mumia,trup*2|136:wampir*2,urzednik|156:!mumia*2,wampir*2,trup*4,milicjant'},
 {name:'Pełnia',sub:'Księżyc wyciąga lunatyków z chałup, a kury z kurnika. Te kury mają trzy nogi.',quote:'Przy pełni to nawet kury głupieją.',theme:5,start:200,slots:8,defs:D8,intro:['pralka'],newEn:['lunatyk','kura'],
  waves:'16:kura*2|30:lunatyk|46:kura*2,trup|60:lunatyk,wampir|76:mumia,kura*2|92:!kura*4,lunatyk,trup*2|112:lunatyk*2,milicjant|130:kura*3,mumia|150:!lunatyk*2,kura*4,wampir*2,trup*2'},
 {name:'Chlewik',sub:'Coś było nie tak z paszą z PGR-u. Świnie mają teraz kolce i zły charakter.',quote:'Mówiłem, żeby nie dawać im resztek spod elektrowni.',theme:5,start:200,slots:8,defs:D9,intro:['lancuch'],newEn:['swinia'],
  waves:'16:trup*2|30:swinia|46:kura*2,lunatyk|62:swinia,trup|78:mumia,wampir|94:!swinia*2,kura*3,trup*2|114:lunatyk*2,swinia|132:nysa,kura*2|152:!swinia*3,lunatyk,mumia,trup*3'},
 {name:'Mauzoleum',sub:'Lenin wstał. I przyprowadził przodowników pracy.',quote:'Z tym łysym to ja się jeszcze w szkole nie lubiłem.',theme:3,start:225,slots:9,defs:D10,intro:['relikwia','samowar'],newEn:['lenin','przodownik'],
  waves:'16:trup*2|30:przodownik|46:lenin|62:trup*2,komunista|78:przodownik,urzednik|94:lenin,trup*2|110:!lenin,przodownik*2,trup*3,komunista|132:mumia,lenin|150:przodownik*2,milicjant*2|172:!lenin*3,przodownik*2,trup*4,komunista*2'},
 {name:'Skażone pola',sub:'Wiatr przyniósł coś zza wschodniej granicy. Buraki i barszcz mają teraz zdanie.',quote:'Mówiłem, żeby nie siać koło elektrowni.',theme:6,start:225,slots:9,defs:D11,intro:['rozlew'],newEn:['burak','barszcz'],
  waves:'16:burak|30:kura*3|46:barszcz|62:burak,trup*2|78:przodownik,lenin|96:barszcz,swinia|112:!burak*2,kura*3,barszcz,trup*2|134:lenin,lunatyk|152:barszcz*2,burak|174:!barszcz*2,burak*2,kura*4,swinia,lenin'},
 {name:'Dożynki w PGR-ze',sub:'Wielkie święto plonów w Państwowym Gospodarstwie Rolnym. Przyszły wszystkie zwierzęta z PGR-u. Niektóre mają dwie głowy.',quote:'Wieniec dożynkowy to ja bym uplótł z czosnku.',theme:1,start:225,slots:10,defs:D12,intro:['pila'],newEn:['krowa'],
  waves:'16:kura*3|30:krowa|48:swinia,kura*2|64:burak,barszcz|80:krowa,kura*3|98:!swinia*2,krowa,kura*4,burak|120:barszcz,swinia,trup|138:krowa,kura*3|158:!krowa*2,swinia*2,kura*5,burak*2,barszcz'},
 {name:'Carska armia',sub:'Przez wieś maszeruje carski pułk z 1915 roku, a zaraz za nim okupant z ’44.',quote:'Historia się powtarza. Bimber też.',theme:2,start:250,slots:10,defs:D13,intro:['armata','flaszka'],newEn:['carski','okupant'],
  waves:'15:trup*2|30:carski|45:okupant|62:carski,trup*2|78:okupant,milicjant|94:!carski*2,okupant,trup*3|116:nysa,okupant|134:carski*2,lenin|152:okupant*2,przodownik|174:!carski*3,okupant*3,nysa,trup*3'},
 {name:'Pochód pierwszomajowy',sub:'Cała chołota w jednym pochodzie. Na czele idzie ktoś z brązu.',quote:'Na pochód to ja nie chodziłem nawet za komuny.',theme:4,start:300,slots:10,defs:D14,intro:['plug'],newEn:['sekretarz','boss'],
  waves:'15:trup*2|30:sekretarz|46:komunista*2,trup|62:sekretarz,lenin|80:carski,okupant|96:!komunista*2,milicjant*2,lenin,trup*2|116:burak*2,wampir|132:okupant*2,swinia|150:nysa,sekretarz|170:!lenin*2,mumia,okupant,trup*3|192:#boss|206:komunista*2|230:lenin,trup*3|258:!carski,okupant*2,burak,milicjant*2,lenin*2'},
 {name:'Dar przyjaźni narodów',sub:'Ze stolicy idzie Pałac Kultury. Na kurzych nogach. Prosto na zagrodę.',quote:'Takiego sąsiada to ja jeszcze nie miałem.',theme:7,start:400,slots:10,defs:D15,intro:['kombajn'],newEn:['palac'],
  waves:'15:trup*2|32:sekretarz,komunista|50:carski,okupant|68:krowa|86:lenin,przodownik|104:!komunista*2,milicjant,sekretarz,trup*3|124:barszcz,burak|142:nysa,okupant|160:mumia,wampir,lunatyk|180:!lenin,carski*2,sekretarz,trup*3|204:#palac|224:komunista*2,trup|252:przodownik,sekretarz|280:!carski,okupant,lenin,milicjant*2'},
 {name:'Noc bez końca',sub:'Fale bez końca, każda gorsza od poprzedniej. Ile wytrzymasz?',quote:'Spać będę na emeryturze.',theme:5,start:300,slots:10,endless:true,defs:D15,intro:[],newEn:[]}
];
const CAMP=15;
const THEMES=[
 {g1:'#78b443',g2:'#6aa63b',edge:'#5e8f33',road:'#8a7350',dark:0,tint:'0,0,0'},
 {g1:'#86ad44',g2:'#789f3c',edge:'#6b8a35',road:'#8a6f4a',dark:0.16,tint:'255,120,40'},
 {g1:'#679a3e',g2:'#5b8c37',edge:'#4f7a30',road:'#6f5b3f',dark:0.28,tint:'40,30,90'},
 {g1:'#4c7a40',g2:'#436e39',edge:'#3a5f32',road:'#544632',dark:0.42,tint:'10,20,60',moon:true},
 {g1:'#7a9a40',g2:'#6c8c39',edge:'#5f7d33',road:'#8a6a4a',dark:0.14,tint:'190,20,20',flags:true},
 {g1:'#4f6e3a',g2:'#466434',edge:'#3c5730',road:'#4e4030',dark:0.38,tint:'40,0,60',moon:true},
 {g1:'#7a9a3a',g2:'#6c8c33',edge:'#5a7a2c',road:'#6a6040',dark:0.24,tint:'90,150,20'},
 {g1:'#7f8f3e',g2:'#718136',edge:'#5f6d2e',road:'#7a6650',dark:0.3,tint:'170,50,20',flags:true}
];
function parseWaves(s){return s.split('|').map(p=>{const i=p.indexOf(':');const t=+p.slice(0,i);let sp=p.slice(i+1),flag='';while(sp[0]==='!'||sp[0]==='#'){flag+=sp[0];sp=sp.slice(1);}const list=[];sp.split(',').forEach(it=>{const a=it.split('*');for(let j=0;j<(+a[1]||1);j++)list.push(a[0]);});return{t,flag,list};});}
const ECOST={trup:1,urzednik:1.5,sasiad:1,milicjant:1.5,komunista:2,wampir:1.6,lunatyk:1.5,swinia:2,mumia:3,lenin:3,carski:2.5,okupant:2.5,burak:2,nysa:5,kura:0.6,przodownik:2,barszcz:2.6,krowa:5,sekretarz:2.6};
const EUNLOCK=[['trup','kura'],['urzednik','sasiad'],['milicjant','komunista'],['wampir','lunatyk','swinia'],['mumia','burak','okupant','przodownik'],['lenin','carski','nysa','barszcz'],['krowa','sekretarz']];
function endlessWave(n){const pool=[];for(let i=0;i<EUNLOCK.length&&i<=Math.floor(n/2);i++)pool.push(...EUNLOCK[i]);let b=1.5+n*1.25;if(n%5===0)b*=1.8;const list=[];let g=0;while(b>0.9&&g++<90){const k=pool[rnd(pool.length)];if(ECOST[k]<=b+0.5){list.push(k);b-=ECOST[k];}}if(n%10===0)list.push(n%20===0?'palac':'boss');return{flag:n%10===0?'#':(n%5===0?'!':''),list};}

