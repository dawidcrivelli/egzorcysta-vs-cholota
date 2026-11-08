#!/bin/bash
# Smoke test: ładuje stronę (domyślnie grę; np. tools/check.sh postacie.html) w headless Chrome, wypisuje błędy JS z konsoli, zrzut ekranu -> tmp/shot.png.
cd "$(dirname "$0")/.."; mkdir -p tmp; PORT=${PORT:-8765}; PAGE=${1:-index.html}; SIZE=${SIZE:-900,600}
python3 -m http.server $PORT >/dev/null 2>&1 & SP=$!; trap "kill $SP" EXIT; sleep 1
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --user-data-dir="$PWD/tmp/chrome-prof" \
  --enable-logging=stderr --v=0 --window-size=$SIZE --virtual-time-budget=4000 --screenshot="$PWD/tmp/shot_${PAGE%.html}.png" \
  "http://localhost:$PORT/$PAGE" 2>&1 | grep CONSOLE && exit 1 || echo "OK, bez błędów; zrzut: tmp/shot_${PAGE%.html}.png"
