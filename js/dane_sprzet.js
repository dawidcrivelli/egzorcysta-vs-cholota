/* ---------- dane: sprzęt ---------- */
const DEF={
 bimbrownia:{name:'Bimbrownia',cost:50,cd:7,hp:300,desc:'Produkuje samogon, czyli walutę tej gry. Gdy chołota ją rozwali, wybucha – jak każda porządna aparatura.'},
 gumofilce:{name:'Wyrzutnia gumofilców',cost:100,cd:7,hp:300,rate:1.45,dmg:20,desc:'Ciska starymi gumiakami z filcem. Zapach dobija tych, których nie dobije but. Transparent zatrzymuje buty.'},
 resztki:{name:'Wyrzutnia resztek',cost:150,cd:7,hp:300,rate:2.8,dmg:45,desc:'Rzuca łukiem tym, co zostało po niedzielnym obiedzie: kapustą, kośćmi, zimnymi ziemniakami. Przelatuje nad transparentami.'},
 woda:{name:'Miotacz wody święconej',cost:175,cd:8,hp:300,rate:2.6,dmg:30,desc:'Rzuca butelkami święconej. Rozbryzg rani kilku naraz, a umarlaki – trupy, wampiry, mumie i Leniny – dostają potrójnie.'},
 szafa:{name:'Meblościanka PRL',cost:50,cd:24,hp:2400,desc:'Sto kilo płyty wiórowej z kryształami w środku. Chołota będzie ją gryźć do następnej pięciolatki.'},
 pila:{name:'Piła mechaniczna',cost:125,cd:10,hp:500,dps:75,desc:'Stoi i warczy. Kto podejdzie, dostaje po nogach. Wytrzymała, choć paliwo pachnie podejrzanie bimbrem.'},
 relikwia:{name:'Relikwia w puszce po landrynkach',cost:200,cd:26,hp:400,rate:2,dmg:45,desc:'Co dwie sekundy promieniuje na sąsiednie pola. Umarlaki cierpią potrójnie. Puszka po landrynkach, bo innej nie było.'},
 kabel:{name:'Goły kabel pod prądem',cost:100,cd:7,trap:true,dps:16,desc:'Leży w trawie. Kopie i spowalnia wszystko, co po nim przejdzie, i nie da się go zjeść. Milicyjna Nysa łapie na nim zwarcie.'},
 lancuch:{name:'Sklep mięsny: „Rzucili szynkę!”',cost:75,cd:10,trap:true,reload:9,stun:5,desc:'Szyld sklepu mięsnego. Kto przechodzi obok, staje w kolejce po szynkę i stoi 5 sekund, nawet milicyjna Nysa. Łapie wszystkich na dwóch polach przy sklepie. Potem 9 sekund czekania na następną dostawę.'},
 aparatura:{name:'Aparatura do destylacji zdalnej',cost:25,cd:14,hp:120,arm:5,dmg:1800,desc:'Najpierw musi się rozgrzać (5 sekund). Potem wystarczy, że ktoś podejdzie… BUM. Zabija prawie każdego, także Nysę. Tania i szybko się odnawia, więc stawiaj ją przed groźnymi wrogami.'},
 flaszka:{name:'Płonąca flaszka bimbru',cost:150,cd:32,instant:true,dmg:1800,desc:'Jednorazowa. Wybucha na polu 3×3. Mumie płoną podwójnie – bandaże.'},
 rubin:{name:'Telewizor Rubin',cost:75,cd:20,hp:1000,dmg:700,desc:'Radziecki kolorowy, słynny z tego, że wybucha. Chołota gryzie go jak meblościankę, a gdy go rozwali, kineskop robi BUM na całe pole.'},
 pralka:{name:'Słoje z ogórkami kiszonymi',cost:100,cd:7,hp:300,rate:1.5,dmg:20,desc:'Ciska słoikami z kiszonkami. Słoik pęka, solanka się rozlewa, a trafiony ślizga się i przez 5 sekund chodzi i gryzie ponad dwa razy wolniej. Dobra para do armaty i święconej: wolniejszy wróg dłużej obrywa.'},
 samowar:{name:'Carski samowar',cost:200,cd:9,hp:300,rate:3,dmg:45,desc:'Z pałacu w Petersburgu, przez trzy wojny, prosto do zagrody. Pluje wrzątkiem na trzy pola i parzy każdego po drodze. Transparent nie pomoże.'},
 rozlew:{name:'Gnojówka',cost:50,cd:12,trap:true,life:30,desc:'Kałuża prosto z obory, schnie po 30 sekundach. Każdy, kto w nią wdepnie, krztusi się smrodem: zatacza się do tyłu i przez 6 sekund idzie wolniej. Działa na wszystkich, którzy przejdą, nie tylko na trzech. Płonąca flaszka podpala metan.'},
 armata:{name:'Carska armata',cost:250,cd:14,hp:300,rate:6,dmg:150,desc:'Mała kopia tej z Kremla, ale ta strzela. Wolno, za to kula spada na najdalszego wroga w rzędzie, rani kilku i odrzuca ich do tyłu.'},
 plug:{name:'Pług',cost:175,cd:30,instant:true,dmg:900,desc:'Postaw w rzędzie, a ruszy w prawo i zaorze wszystko na swojej drodze: 900 obrażeń każdemu, nawet bossowi. Jednorazowy.'},
 kombajn:{name:'Kombajn Bizon',cost:200,cd:20,hp:1500,dps:60,desc:'Z PGR-u. Nie zastępuje Ursusa: stoi w miejscu, a nagarniacz mieli wszystko na dwóch polach przed sobą. Bardzo wytrzymały, więc działa też jak mur.'},
 lopata:{name:'Łopata',tool:true,cost:0,desc:'Wybierz łopatę i dotknij swojego sprzętu: zdejmiesz go z pola i odzyskasz połowę samogonu.'},
 ursus:{name:'Ursus C-330',special:true,cost:0,desc:'Jeden na każdy rząd, czeka przy płocie. Gdy chołota dojdzie do zagrody, ciągnik rusza i rozjeżdża wszystko w rzędzie. Działa raz na noc.'}
};
const ORDER=['bimbrownia','gumofilce','pralka','resztki','woda','samowar','armata','szafa','rubin','pila','kombajn','relikwia','kabel','lancuch','rozlew','aparatura','flaszka','plug'];

