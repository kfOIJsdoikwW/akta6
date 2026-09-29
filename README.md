# A.K.T.A. – 6. akta · „nem.felejtek” (zsarolás / kép-alapú visszaélés)

Interaktív, telefonra tervezett nyomozós feladat középiskolásoknak, a BRFK bűnmegelőzési programjához. Egy lezárt (kitalált) ügy adatmentését böngészve a csapatnak azonosítania kell a zsarolót.

## Fájlok
- `index.html`, `style.css`, `app.js` – a weboldal
- `data.js` – az ügy összes adata (szereplők, üzenetek, térkép, idővonal, névsor)
- `img/` – helyőrző képek (`buli1.jpg`, `buli2.jpg`); ide kerülnek a saját képek is
- `MEGOLDOKULCS.md` – **csak a foglalkozásvezetőnek** (ne kerüljön a diákokhoz, és NE tedd ki a netre a diákoknak szánt linken)

A diákoknak szánt kiinduló nyomtatvány (jegyzőkönyv + QR + kérdések + profil-lap) külön PDF: `akta6_kiindulo_dokumentum.pdf`.

## Közzététel (GitHub Pages)
1. Hozz létre egy repót (pl. `akta6`), töltsd fel az `index.html`, `style.css`, `app.js`, `data.js` fájlokat és az `img/` mappát.
2. Settings → Pages → Deploy from branch → `main` / `root`.
3. A kapott URL-t (`https://<felhasznaloneved>.github.io/akta6/`) írd be a PDF-generátorba, hogy a QR-kód oda mutasson:
   ```
   python3 akta6_pdf_generator.py "https://<felhasznaloneved>.github.io/akta6/" akta6_kiindulo_dokumentum.pdf
   ```
4. A `MEGOLDOKULCS.md`-t **ne** töltsd fel a diákoknak szánt repóba.

## Saját képek (opcionális, de sokat dob a valóságérzeten)
Minden kép helyőrzővel működik, tehát képek nélkül is teljes a feladat. Ahol nincs feltöltött fájl, ott a rendszer automatikusan színes helyőrzőre vált. Ha valósághűbbé tennéd, tedd a `.jpg` fájlokat az `img/` mappába a lenti pontos fájlnevekkel.

**Fontos, hogy senki ne legyen felismerhető** a képeken (arc nélkül, hátulról, tömegben, tárgyakról/helyszínekről). Feed-képek 4:5 (álló) arányban, profilképek négyzetesen néznek ki a legjobban.

### Tartalmi képek
- `img/buli1.jpg`, `img/buli2.jpg` – **buli tudta nélkül** hangulat (háttal álló fiatalok, füzérfény, tömeg). Ez a két kép a metaadat-elemzés tárgya is. *(Már benne van egy-egy helyőrző.)*
- `img/love.jpg` – Réka és Máté „páros” posztja (összefont kéz, két pohár, naplemente sziluett).

### Feed-posztképek (opcionális)
- `img/feed_reka.jpg` – Réka második posztképe
- `img/feed_dori.jpg` – lassú reggel / matcha
- `img/feed_mate.jpg` – kosárlabda
- `img/feed_vivi.jpg` – naplemente (golden hour)
- `img/feed_gergo.jpg` – edzés

### Profilképek (négyzetes, arc nélküli avatarok)
`img/pp_reka.jpg`, `pp_bence.jpg`, `pp_zsofi.jpg`, `pp_laura.jpg`, `pp_mate.jpg`, `pp_dori.jpg`, `pp_gergo.jpg`, `pp_vivi.jpg`, `pp_panni.jpg`, `pp_adam.jpg`, `pp_bianka.jpg`, `pp_eszter.jpg`, `pp_hanna.jpg`, `pp_noemi.jpg`, `pp_soma.jpg`
(A fájlnév mindig `pp_<kulcs>.jpg`, ahol a kulcs a `data.js`-beli azonosító.)

> A sztorik és a profil-rácsok alapból színes helyőrzők – ezek jól néznek ki képek nélkül is. Ha ezekhez is valódi képet szeretnél, szólj, és beépítem a fájlnév-helyeket.

## Tartalmi elvek
- Az intim kép sehol nem jelenik meg. Az eltűnő üzenetek helyén csak „Fotó · Megnyitva” jelzés áll.
- A hangsúly a nyomozáson és az üzeneten van: ez **bűncselekmény akkor is, ha az elkövető is fiatalkorú**, és a felelősség **soha nem a sértetté**.
- Záró segítség a diákoknak: Kék Vonal 116-111; StopNCII / Take It Down.

## Localhost-teszt
```
cd akta6
python3 -m http.server 8000
# böngészőben: http://localhost:8000/
```
(Helyi megnyitásnál a metaadat-elemző bármely képet elfogad; élesben, GitHub Pages-en a bulis képet kell feltölteni.)
