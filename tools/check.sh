#!/bin/bash
# Smoke test: ładuje stronę (domyślnie grę) w headless Chrome, wypisuje błędy JS z konsoli i robi zrzut do tmp/.
# Np.: SIZE=1400,900 PORT=8771 tools/check.sh 'postacie.html?tab=style&q=chibi&big=chibi'
# Osobny PORT = osobny profil Chrome, więc kilka sprawdzeń może iść naraz.
cd "$(dirname "$0")/.."; mkdir -p tmp; PORT=${PORT:-8765}; PAGE=${1:-index.html}; SIZE=${SIZE:-900,600}
SHOT="tmp/shot_$(echo "${PAGE%%\?*}" | sed 's/\.html$//')$(echo "${PAGE#*\?}" | grep -q = && echo "_${PAGE#*\?}" | tr -c 'a-zA-Z0-9_\n' '_').png"
rm -rf "tmp/chrome-prof-$PORT"   # świeży profil: bez starych plików z cache
python3 -m http.server $PORT >/dev/null 2>&1 & SP=$!; trap "kill $SP" EXIT; sleep 1
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --user-data-dir="$PWD/tmp/chrome-prof-$PORT" \
  --enable-logging=stderr --v=0 --window-size=$SIZE --virtual-time-budget=${WAIT_MS:-4000} --screenshot="$PWD/$SHOT" \
  "http://localhost:$PORT/$PAGE" 2>&1 | grep CONSOLE && exit 1 || echo "OK, bez błędów; zrzut: $SHOT"
