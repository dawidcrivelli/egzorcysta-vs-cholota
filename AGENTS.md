# Agents

- `js/*.js`: classic scripts sharing one global scope; order in `index.html` matters. New file → add to `index.html` and `CORE` in `sw.js`, bump `VERSION`.
- Test: `tools/check.sh [page]` (no console errors, screenshot in `tmp/`), e.g. `tools/check.sh 'postacie.html?tab=def&frames=1'`.
- `postacie.html` + `js/postacie.js`: character viewer; loads game scripts from `index.html` except the loop, calls draw functions directly.
- Perf: `node tools/perf.js --n 10 --cpu 4` (plansza pełna sprzętu i chołoty, FPS, szarpnięcia, czas JS, bufor klatek); `--root dir` porównuje z inną wersją, `--prof` czasy funkcji.
- Style: `js/styl_gry.js` podmienia drawEnemyRaw/drawDefRaw/ursus/dziad wg `save.style`; style w `js/styles/` (odnowa*, pixel*) są w `index.html` i `sw.js`. Rozmiary: `node tools/fit.js` (nic nie może wyjść poza ramkę klatki).
- Bot: `node tools/bot.js --levels 6-10 --runs 3 [--notombs] [--noshovel]` gra noce bez rysowania (czy da się przejść). Słaby gracz: porównuj warianty, nie bezwzględne wyniki.
- Groby po trupach: `TOMB` w `js/logika.js`, tylko noce z `moon` w THEMES.
- `tools/`: committed scripts. `tmp/`: outputs only, not committed.
