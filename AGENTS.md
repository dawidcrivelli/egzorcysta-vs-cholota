# Agents

- `js/*.js`: classic scripts sharing one global scope; order in `index.html` matters. New file → add to `index.html` and `CORE` in `sw.js`, bump `VERSION`.
- Test: `tools/check.sh [page]` (no console errors, screenshot in `tmp/`), e.g. `tools/check.sh 'postacie.html?tab=def&frames=1'`.
- `postacie.html` + `js/postacie.js`: character viewer; loads game scripts from `index.html` except the loop, calls draw functions directly.
- `tools/`: committed scripts. `tmp/`: outputs only, not committed.
