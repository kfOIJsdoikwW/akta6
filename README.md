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
Minden kép helyőrzővel működik, tehát képek nélkül is teljes a feladat. Ha valósághűbbé tennéd, tegyél `.jpg` fájlokat az `img/` mappába – ha egy fájl hiányzik, a rendszer automatikusan a színes helyőrzőre vált.

**Fontos, hogy senki ne legyen felismerhető** a képeken (arc nélkül, hátulról, tömegben, tárgyakról/helyszínekről).

Ajánlott képek (a `data.js`-ben hivatkozott kulcsok):
- `img/buli1.jpg`, `img/buli2.jpg` – **buli tudta nélkül** hangulat: háttal álló fiatalok, füzérfény, tömeg, koccintás felülről; arc ne látszódjon. Ez a két kép a metaadat-elemzés tárgya is.
- `img/love.jpg` – Réka és Máté „páros” posztja: összefont kéz, két kávéspohár, naplemente sziluett – arc nélkül.
- Profilképek: `img/pp_reka.jpg`, `img/pp_bence.jpg`, `img/pp_zsofi.jpg`, `img/pp_laura.jpg`, `img/pp_mate.jpg`, `img/pp_dori.jpg`, `img/pp_gergo.jpg`, `img/pp_vivi.jpg` stb. – semleges, arc nélküli avatarok (tárgy, tájkép, sziluett). A fájlnév a `data.js`-beli kulcs: `pp_<kulcs>.jpg`.
- Highlight/rács-képek: nem kötelezők, a színes helyőrzők jól néznek ki. Ha mégis, bármely arc nélküli, hangulati kép megteszi (edzés, matcha, naplemente, tánc – tárgy/sziluett szinten).

Pinterestről szedve érdemes 4:5 (álló) arányú, arc nélküli, „insta-hangulatú” képeket keresni. A profilképek négyzetesek legyenek.

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
