/* Offline: pliki gry z pamięci podręcznej, w tle odświeżane z sieci (stale-while-revalidate).
   Zmień VERSION przy wydaniu, żeby wyczyścić stare pliki. */
const VERSION = 'evc-v6';
const CORE = ["./", "index.html", "css/app.css", "js/init.js", "js/prymitywy_rysowania.js", "js/dane_sprzet.js", "js/dane_cholota.js", "js/poziomy.js", "js/tryb_zly_cholota.js", "js/zapis.js", "js/stan.js", "js/obrazenia.js", "js/logika.js", "js/nowa_grafika_szkielet.js", "js/grafika_v3_reszta.js", "js/bufor_gotowych_klatek.js", "js/rysowanie_pole.js", "js/ui.js", "js/pokaz_dzialania_broni.js", "js/almanach.js", "js/styl_gry.js", "js/styles/odnowa.js", "js/styles/odnowa_ludzie.js", "js/styles/odnowa_ludzie2.js", "js/styles/odnowa_stwory.js", "js/styles/odnowa_sprzet1.js", "js/styles/odnowa_sprzet2.js", "js/styles/odnowa_pociski.js", "js/styles/odnowa_lekka.js", "js/styles/pixel.js", "js/styles/pixel_ludzie.js", "js/styles/pixel_ludzie2.js", "js/styles/pixel_stwory.js", "js/styles/pixel_sprzet1.js", "js/styles/pixel_sprzet2.js", "js/styles/pixel_pociski.js", "js/dzwiek_syntezowany_bez.js", "js/petla_i_wejscie.js", "manifest.json", "icon.svg"];
self.addEventListener('install', e => e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys()
  .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(VERSION).then(async c => {
    const hit = await c.match(e.request);
    const net = fetch(e.request).then(r => { if (r.ok || r.type === 'opaque') c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
