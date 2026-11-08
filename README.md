# Egzorcysta vs Chołota

Obrona zagrody przed wszystkim, co nadciąga zza miedzy. Obrona w rzędach: rozstaw sprzęt, odeprzyj chołotę — albo zagraj chołotą (tryb zły).

**Zagraj:** https://dawidcrivelli.github.io/egzorcysta-vs-cholota/

Na telefonie: „Dodaj do ekranu głównego” — działa offline (`sw.js`), zapis gry w `localStorage`.

## Uruchomienie

Otwórz `index.html` w przeglądarce — bez budowania (grafika i dźwięk generowane w kodzie, bez plików).
Jeden plik (np. do artefaktu Claude): `node build.js` → `dist/egzorcysta-vs-cholota.html`.

## Struktura

`index.html` (układ), `css/app.css`, `js/*.js` — zwykłe skrypty (wspólny zasięg globalny), ładowane w kolejności z `index.html`:

| plik | linie |
|---|---|
| `js/init.js` | 14 |
| `js/prymitywy_rysowania.js` | 10 |
| `js/dane_sprzet.js` | 25 |
| `js/dane_cholota.js` | 26 |
| `js/poziomy.js` | 51 |
| `js/tryb_zly_cholota.js` | 12 |
| `js/zapis.js` | 10 |
| `js/stan.js` | 109 |
| `js/obrazenia.js` | 35 |
| `js/logika.js` | 198 |
| `js/nowa_grafika_szkielet.js` | 320 |
| `js/grafika_v3_reszta.js` | 466 |
| `js/bufor_gotowych_klatek.js` | 74 |
| `js/rysowanie_pole.js` | 78 |
| `js/ui.js` | 269 |
| `js/pokaz_dzialania_broni.js` | 59 |
| `js/almanach.js` | 70 |
| `js/dzwiek_syntezowany_bez.js` | 77 |
| `js/petla_i_wejscie.js` | 62 |

Po zmianie listy plików zaktualizuj `CORE` i podbij `VERSION` w `sw.js`.

`tools/check.sh` — smoke test w headless Chrome (błędy JS z konsoli, zrzut `tmp/shot.png`). `tmp/` — poza repo.
