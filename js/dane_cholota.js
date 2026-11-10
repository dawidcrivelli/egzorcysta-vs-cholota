/* ---------- dane: chołota ---------- */
const EN={
 trup:{name:'Trup z parafialnego',hp:200,sp:0.22,bite:40,undead:true,desc:'Wstał, bo ktoś rozkopał cmentarz. Wolny, głupi i wiecznie głodny. W noce z księżycem zostawia grób: wykop go łopatą, zanim wstanie z niego następny.',say:['Mózgiii…','Bimbruuu…']},
 urzednik:{name:'Urzędnik z gminy',hp:300,sp:0.16,bite:30,desc:'Wolny, ale gdy dorwie twój sprzęt, przybija pieczątkę „ZAMKNIĘTE” i sprzęt staje na 6 sekund.',say:['Brak pieczątki!','Proszę przyjść jutro.','Okienko obok.']},
 sasiad:{name:'Zazdrosny sąsiad',hp:220,sp:0.26,bite:30,desc:'Słabeusz, ale gdy podgryza twój sprzęt, podkrada ci samogon. Zawsze tak robił.',say:['Pożycz flaszkę!','Jak ty to pędzisz?']},
 milicjant:{name:'Milicjant',hp:320,sp:0.3,bite:50,desc:'Szybszy od trupa i mocniej bije pałką. Prosi o dowód, ale nie czeka na odpowiedź.',say:['Dowód osobisty!','Obywatelu!']},
 komunista:{name:'Aktywista z transparentem',hp:200,shield:400,sp:0.2,bite:40,desc:'Transparent zatrzymuje gumofilce. Resztki i święcona lecą górą, więc trafiają prosto w głowę.',say:['Plan wykonany w 300%!','Precz z bimbrem!']},
 nysa:{name:'Milicyjna Nysa',hp:1400,sp:0.24,vehicle:true,desc:'Rozjeżdża sprzęt na swojej drodze, ale na meblościance, telewizorze i kombajnie grzęźnie na kilka sekund. Na gołym kablu łapie zwarcie, aparatura i flaszka ją wysadzają, a sklep mięsny ją zatrzymuje. Z wraku wysiada kierowca.',say:['Iiiuuu iiiuuu!']},
 wampir:{name:'Wampir',hp:260,sp:0.4,bite:45,undead:true,desc:'Szybki. Przeskakuje pierwszą przeszkodę w rzędzie, potem zwalnia. Święcona pali go potrójnie.',say:['Krrrew…']},
 mumia:{name:'Mumia',hp:800,sp:0.13,bite:40,undead:true,burn:true,desc:'Bardzo wytrzymała i bardzo powolna. Ogień pali ją podwójnie, bo bandaże.',say:['Mmmhhh…']},
 swinia:{name:'Zła świnia',hp:360,sp:0.45,bite:60,desc:'Szarżuje i pierwszy cios zadaje z rozpędu. Potem już tylko gryzie. Kiełbasy z niej nie będzie.',say:['KWIIIK!']},
 lunatyk:{name:'Lunatyk',hp:240,sp:0.24,bite:40,desc:'Łazi przy pełni i co chwilę zmienia rząd. Nie budzić, tylko bić.',say:['Zzzz…','Mamo, już wstaję…']},
 lenin:{name:'Lenin',hp:650,sp:0.17,bite:45,undead:true,aura:true,desc:'Uciekł z mauzoleum. Twardy, a jego przemówienie przyspiesza chołotę wokół. Umarlak, więc święcona działa. Występuje hurtowo.',say:['Uczyć się, uczyć się…','Towarzysze!']},
 carski:{name:'Carski sołdat',hp:500,sp:0.2,bite:55,desc:'Zabłądził w 1915 roku i dalej maszeruje. Twardy, a bagnet ma ostry.',say:['Za cara!','Urra!']},
 okupant:{name:'Okupant z ’44',hp:300,helm:350,sp:0.22,bite:45,desc:'Hełm przyjmuje sporo ciosów. Gdy spadnie, robi się miękki. Ogień i wybuchy omijają hełm.',say:['Halt!']},
 burak:{name:'Burak mutant',hp:320,sp:0.24,bite:40,desc:'Wyrósł koło elektrowni. Po rozbiciu rozpada się na dwa wściekłe buraczki.',say:['Grrr!']},
 buraczek:{name:'Buraczek',hp:90,sp:0.36,bite:25,small:true},
 kura:{name:'Kura mutant',hp:90,sp:0.5,bite:25,desc:'Trzy nogi, dwa łby rozumu mniej. Szybka i jest ich dużo, ale jeden gumofilc ją kładzie.',say:['KO-KO-KO!']},
 przodownik:{name:'Przodownik pracy',hp:320,sp:0.24,bite:120,desc:'Wyrabia 300% normy. Rozbiera twój sprzęt kilofem trzy razy szybciej niż zwykły trup.',say:['Norma wykonana!','Czyn społeczny!']},
 barszcz:{name:'Barszcz Sosnowskiego',hp:480,sp:0.14,bite:40,splash:true,desc:'Zwiał z PGR-u i rośnie, gdzie chce. Parzy: gdy gryzie sprzęt, rani też ten stojący za nim.',say:['Sssss…']},
 krowa:{name:'Krowa z Czarnobyla',hp:1500,sp:0.12,bite:70,desc:'Świeci w nocy i daje mleko, którego nie pij. Bardzo wytrzymała i nie zwalnia na widok meblościanki.',say:['MUUUU!']},
 palac:{name:'Pałac Kultury na kurzych nogach',hp:7500,sp:0.06,boss:true,desc:'Dar przyjaźni narodów, który sam przyszedł po odbiór. Depcze sprzęt w trzech rzędach, wysyła delegacje i nadaje przemówienia, które wyłączają twój sprzęt.',say:['UWAGA, UWAGA!','Delegacja przybyła!','Dar przyjaźni!']},
 sekretarz:{name:'Sekretarz partii',hp:420,sp:0.18,bite:30,heal:25,desc:'Sam się nie bije, za to przemowami leczy chołotę wokół siebie. Bij go pierwszego.',say:['Towarzysze, naprzód!','Zgodnie z uchwałą…']},
 boss:{name:'Lenin z brązu',hp:4500,sp:0.085,boss:true,desc:'Zszedł z cokołu. Rozdeptuje sprzęt, co chwilę wzywa posiłki i nie da się go spętać. Ursus robi mu tylko wgniecenie.',say:['TOWARZYSZE!','Naprzód!']}
};

