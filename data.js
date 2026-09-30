'use strict';
/* =========================================================
   A.K.T.A. – 6. akta (zsarolás / kép-alapú visszaélés) – ADATOK
   Lezárt ügy. Minden szereplő, név, fiók, kép és adat kitalált.
   Az intim kép SEHOL nem jelenik meg, még helyőrzőként sem.
   ========================================================= */

const CASE_NO = '01100/2231/2025.bü.';
const CASE_YEAR = 2025;
// A buli tudta nélkül készült képei – EZEK A BIZONYÍTÉKOK: ezeket küldi a zsaroló DM-ben,
// ezek szerepelnek Laura posztjában/sztorijában és Bence rácsában, és ezeket ismeri fel a metaadat-elemző.
const PARTY_IMG = ['img/rejtettkep.jpg', 'img/buli1.jpg'];
const PARTY_FILENAME = 'IMG_20250614_231502.jpg';

/* ---------- Szereplők (profilkép: a `pic` mező = img/<pic>.jpg; ha nincs ilyen fájl, színes monogram jelenik meg) ---------- */
const P = {
  reka:   { u: 'reka.szdesignn', n: 'Réka', h: 330, pic: 'rekaprof', real: 'Szabó Réka' },
  mate:   { u: 'mate_k04', n: 'Máté', h: 210, pic: 'mateprof' },
  bence:  { u: 'bencehimself', n: 'Bence', h: 205, real: 'Kovács Bence', pic: 'benceprof' },
  anon:   { u: 'nem.felejtek', n: 'nem.felejtek', anon: true },
  zsofi:  { u: 'zsofi.hvth', n: 'Zsófi', h: 285, pic: 'zsofiprof' },
  laura:  { u: 'laura.kiss_', n: 'Laura', h: 20, pic: 'lauraprof' },
  panni:  { u: 'panni.b', n: 'Panni', h: 145, pic: 'panniprof' },
  dori:   { u: 'dorka.official', n: 'Dorka', h: 350, pic: 'dorkaprof' },
  gergo:  { u: 'gergo.n', n: 'Gergő', h: 190, pic: 'gergoprof' },
  vivi:   { u: 'vivien.k', n: 'Vivien', h: 300, pic: 'vivienprof' },
  adam:   { u: 'adam.foto', n: 'Ádám', h: 165 },
  hanna:  { u: 'hanna.m', n: 'Hanna', h: 40 },
  noemi:  { u: 'noemi.rose', n: 'Noémi', h: 260, pic: 'noemiprof' },
  bianka: { u: 'bianka_', n: 'Bianka', h: 320 },
  soma:   { u: 'soma.zene', n: 'Soma', h: 130 },
  eszter: { u: 'eszti.b', n: 'Eszter', h: 55 }
};
const who = k => P[k];

/* =========================================================
   INSTAGRAM – KÉPEK
   Minden kép helye: img/<név>.jpg. Rövidítés: sima szöveg ('reka1') = img/reka1.jpg.
   EV0 / EV1 = a két bizonyíték-kép (PARTY_IMG), ezeket NE cseréld sima névre,
   mert a metaadat-elemző és a DM-ek is ezekre hivatkoznak.
   Posztokban, rácsokban, sztorikban CSAK létező képek vannak: ahány kép, annyi poszt.
   ========================================================= */
const EV0 = { pic: 'party', img: 0 };   // img/rejtettkep.jpg
const EV1 = { pic: 'party', img: 1 };   // img/buli1.jpg

/* ---------- Instagram: sztorik (a főoldali karikák) ---------- */
const IG_STORIES = [
  { k: 'reka', me: true, slides: [{ pic: 'reka9', txt: 'új korszak ✨' }] },
  { k: 'laura', slides: [
      { pic: 'party', img: 0, txt: 'BULI 🎉🎂' },
      { pic: 'party', img: 1, txt: 'best night 🥳', meta: 'Készült: 2025.06.14. 23:15 · Budapest' },
      { pic: 'buli7', txt: 'köszi hogy eljöttetek 💛' }] },
  { k: 'zsofi', slides: [{ pic: 'zsofi5', txt: 'próba 💃' }] },
  { k: 'dori', slides: [{ pic: 'kondilany', txt: 'gym 💪' }, { pic: 'matcha', txt: 'matcha ☕' }] },
  { k: 'gergo', slides: [{ pic: 'kosar 2', txt: 'meccs este 🏀' }] },
  { k: 'vivi', slides: [{ pic: 'naplemente2', txt: 'sunset 🌇' }] },
  { k: 'noemi', slides: [{ pic: 'ujhaj', txt: 'új haj 💇‍♀️' }] },
  { k: 'panni', slides: [{ pic: 'hazimozi3', txt: 'filmest 🍿' }] }
];

/* ---------- Instagram: feed posztok ---------- */
const IG_FEED = [
  { by: 'reka', pin: true, imgs: ['kosar1', 'reka10'], likes: 142,
    cap: 'a legjobb ember mellettem 🫶 @mate_k04', date: '2025. SZEPTEMBER 28.',
    comments: [['mate_k04', '🤍🤍🤍'], ['laura.kiss_', 'cukik vagytok!!'], ['dorka.official', '😍😍']] },
  { by: 'zsofi', imgs: ['zsofi1', 'zsofi4'], likes: 118, cap: 'új koreó hamarosan 🖤', date: '2025. SZEPTEMBER 25.',
    comments: [['panni.b', 'odaaa 🔥'], ['bianka_', 'tanítsd meg!!']] },
  { by: 'dori', imgs: ['matcha'], likes: 96, cap: 'lassú reggelek ☕', date: '2025. SZEPTEMBER 20.',
    comments: [['noemi.rose', 'hol ez a hely??'], ['dorka.official', '@noemi.rose dm 💌']] },
  { by: 'panni', imgs: ['hazimozi1', 'hazimozi2', 'hazimozi3'], likes: 58, cap: 'péntek esti filmmaraton 🍿🎬', date: '2025. SZEPTEMBER 19.',
    comments: [['vivien.k', 'legközelebb én is jövök!!']] },
  { by: 'mate', imgs: ['mate1', 'mate2'], likes: 77, cap: 'hajrá csapat 🏀', date: '2025. SZEPTEMBER 12.',
    comments: [['gergo.n', '💪'], ['reka.szdesignn', '🥰']] },
  { by: 'bence', imgs: ['bence4'], likes: 64, cap: 'vissza a pályán ⚽', date: '2025. SZEPTEMBER 6.',
    comments: [['gergo.n', 'gólkirály 👑']] },
  { by: 'vivi', imgs: ['naplemente1', 'naplemente3'], likes: 61, cap: 'golden hour 🌅', date: '2025. AUGUSZTUS 30.', comments: [['bianka_', '🤍']] },
  { by: 'gergo', imgs: ['kondifiu', 'kondi'], likes: 44, cap: 'leg day 🦵', date: '2025. AUGUSZTUS 22.', comments: [] },
  { by: 'laura', imgs: [EV0, EV1, 'laura3', 'buli3', 'buli5', 'laura4'], likes: 208,
    cap: '16 🎂 életem legjobb bulija, köszi mindenkinek 💛 #szülinap', date: '2025. JÚNIUS 15.',
    comments: [['reka.szdesignn', 'imádtam!! 🥳'], ['panni.b', 'a torta 😍'], ['vivien.k', '🔥🔥']] }
];

/* ---------- Instagram: profilok ----------
   A „bejegyzés” szám automatikusan a rács képeinek száma (ha nincs külön `posts` megadva). */
const IG_PROFILES = {
  reka:  { followers: '612', following: 401, bio: 'Réka · 16\nBudapest 📍\ngrafika & fotó 🎨', priv: false,
    highlights: [{ n: 'mi ✨', pic: 'kosar1' }, { n: 'nyár ☀️', pic: 'reka7' }, { n: 'art 🎨', pic: 'reka2' }],
    grid: ['kosar1', 'reka10', 'reka9', 'reka11', 'reka1', 'reka2', 'reka4', 'reka5', 'reka6', 'reka7', 'reka8'] },
  anon:  { posts: 0, followers: '0', following: 1, bio: '', priv: true, anon: true, joined: '2025.10.01.' },
  bence: { followers: '389', following: 420, bio: 'Bence · 17\nfoci ⚽ | zene 🎧\n„aki tudja, tudja”', priv: false,
    highlights: [{ n: 'foci ⚽', pic: 'bence4' }, { n: 'nyár ☀️', pic: 'party', img: 0 }],
    grid: ['bence4', EV0, 'bence2', 'bence1', 'bence3', 'bence5'] },
  zsofi: { followers: '503', following: 388, bio: 'Zsófi 🤍\ndancer 💃', priv: false,
    highlights: [{ n: 'tánc 💃', pic: 'zsofi2' }, { n: 'me 🤍', pic: 'zsofi8' }],
    grid: ['zsofi1', 'zsofi4', 'zsofi5', 'zsofi2', 'zsofi3', 'zsofi6', 'zsofi8'] },
  laura: { followers: '740', following: 512, bio: 'Laura 🎂\n16 · Bp', priv: false,
    highlights: [{ n: '16 🎂', pic: 'party', img: 0 }, { n: 'nyár ☀️', pic: 'laura4' }, { n: 'sütis 🍪', pic: 'laura5' }],
    grid: [EV0, EV1, 'laura3', 'buli3', 'buli5', 'laura4', 'laura5', 'laura2', 'laura1'] },
  mate:  { followers: '430', following: 366, bio: 'Máté\nkosár 🏀', priv: false,
    highlights: [{ n: 'kosár 🏀', pic: 'mate5' }],
    grid: ['mate1', 'mate2', 'kosar1', 'mate5', 'mate3', 'mate4'] }
};

/* ---------- Instagram: DM lista + beszélgetések ---------- */
// típusok: t (szöveg), img (kép), vanish (eltűnő kép jelzés), sys
const IG_DMS = {
  anon: { with: 'anon', unread: true, note: 'Ismeretlen fiók kérése – elfogadva', msgs: [
    { d: '2025.10.02', t: '21:14', x: 'szia rékuci', them: 1 },
    { d: '2025.10.02', t: '21:14', x: 'láttam a posztod az új csávóddal', them: 1 },
    { d: '2025.10.02', t: '21:15', x: 'ki vagy?', me: 1 },
    { d: '2025.10.02', t: '21:16', x: 'az nem érdekes. inkább szakíts vele.', them: 1 },
    { d: '2025.10.02', t: '21:16', x: 'különben elküldök egy-két képed neki is, és anyudéknak is', them: 1 },
    { d: '2025.10.02', t: '21:17', x: 'még van pár képem itt-ott', them: 1 },
    { d: '2025.10.02', t: '21:18', vanish: 'Fotó', note: '„nem.felejtek” egy eltűnő fotót küldött.', them: 1 },
    { d: '2025.10.02', t: '21:18', x: 'ez csak ízelítő volt. van több is.', them: 1 },
    { d: '2025.10.02', t: '21:20', x: 'ezt töröld ki!!', me: 1 },
    { d: '2025.10.02', t: '21:20', x: 'menj már a picsába', me: 1 },
    { d: '2025.10.04', t: '20:02', img: { pic: 'party', img: 0, fn: PARTY_FILENAME }, note: 'ez te vagy ugye?', them: 1 },
    { d: '2025.10.04', t: '20:03', x: 'látod? ott voltam. mindig ott vagyok.', them: 1 },
    { d: '2025.10.05', t: '18:40', x: 'két napod van. szakíts vele', them: 1 },
    { d: '2025.10.05', t: '18:44', x: 'ki vagy te?? miért csinálod ezt', me: 1 },
  ]},
  zsofi: { with: 'zsofi', unread: true, note: '', msgs: [
    { d: '2025.09.29', t: '22:10', x: 'szia. tudom hogy te vagy máté új csaja', them: 1 },
    { d: '2025.09.29', t: '22:11', x: 'nem semmi hogy pont őt kellett', them: 1 },
    { d: '2025.09.29', t: '22:12', x: 'nem tudom mi a bajod velem', me: 1 },
    { d: '2025.09.29', t: '22:13', x: 'majd meglátod milyen. sok sikert', them: 1 },
    { d: '2025.09.29', t: '22:15', x: 'köszpusz', me: 1 },
    { d: '2025.10.04', t: '21:30', x: 'hallod', them: 1 },
    { d: '2025.10.04', t: '21:30', x: 'ezt figyeld', them: 1 },
    { d: '2025.10.04', t: '21:30', x: 'valami random csávó küldött rólad kérdezget', them: 1 },
    { d: '2025.10.04', t: '21:31', x: 'azt akarja, hogy írjak rá újra a mátéra, te meg szakíts vele', them: 1 },
    { d: '2025.10.04', t: '21:40', x: 'mivaaan', me: 1 },
    { d: '2025.10.04', t: '21:40', x: 'mi a neve??', me: 1 },
    { d: '2025.10.04', t: '21:32', x: 'nemfelejtek vagy valami random ig fiók', them: 1 },
    { d: '2025.10.04', t: '21:40', x: 'köszi hogy szóltál', me: 1 }
  ]},
  laura: { with: 'laura', note: '', msgs: [
    { d: '2025.06.16', t: '14:20', x: 'kösziii a szülinapot még egyszer 🥺 életem legjobb bulija volt', me: 1 },
    { d: '2025.06.16', t: '14:25', x: 'annyira örülök hogy eljöttél 💛 küldök képeket amit csináltam', them: 1 },
    { d: '2025.06.16', t: '14:26', x: 'igeeen 😍', me: 1 },
    { d: '2025.10.03', t: '19:40', x: 'te, fura kérdés. a szülinapodon ki készített képeket? valaki fura fotókat küldözget rólam onnan', me: 1 },
    { d: '2025.10.03', t: '19:52', x: 'hát sokan fotóztak 😅 miért, mi a baj?', them: 1 },
    { d: '2025.10.03', t: '19:53', x: 'semmi hagyd, majd mesélem', me: 1 }
  ]},
  dori: { with: 'dori', note: '', msgs: [
    { d: '2025.10.01', t: '17:00', x: 'jövő héten tanulunk együtt? tesi beadandó 😭', them: 1 },
    { d: '2025.10.01', t: '17:10', x: 'aha, szerdán jó?', me: 1 },
    { d: '2025.10.01', t: '17:11', x: 'tökéletes 🫶', them: 1 }
  ]},
  mate: { with: 'mate', note: '', msgs: [
    { d: '2025.10.02', t: '22:30', x: 'szia szii, minden ok? fura voltál este', them: 1 },
    { d: '2025.10.02', t: '22:35', x: 'ja csak fáradt vagyok, semmi baj 🤍', me: 1 },
    { d: '2025.10.02', t: '22:36', x: 'oké 🤍 holnap tali?', them: 1 },
    { d: '2025.10.02', t: '22:36', x: '🤍', me: 1 }
  ]}
};
const IG_DM_ORDER = ['anon', 'zsofi', 'mate', 'laura', 'dori'];

/* ---------- Instagram: jelszó-visszaállítás (a névtelen fiók lelepleződik) ---------- */
const IG_RESET = {
  'nem.felejtek': { sms: '+36 •• ••• ••47', email: '••••••7@gmail.com' },
  'reka.szdesignn': { sms: '+36 •• ••• ••08', email: '••••••@gmail.com' }
};

/* =========================================================
   SNAPCHAT
   ========================================================= */
const SC_FRIENDS = [
  { k: 'bence', streak: 0, snapcode: 'BK', chats: [
    { d: 'RÉGEBBI', sys: '☆ Ez a beszélgetés Réka mentései miatt maradt meg. A többi üzenet 24 óra után eltűnt.' },
    { d: '2025.05.10', who: 'bence', x: 'jó éjt rékuci 🤍' },
    { d: '2025.05.10', who: 'me', x: 'jó éjt 🤍', saved: 1 },
    { d: '2025.07.20', who: 'bence', x: 'ne szakíts velem. megbánod.' },
    { d: '2025.07.20', who: 'me', x: 'bence ne csináld ezt', saved: 1 },
    { d: '2025.07.20', who: 'bence', x: 'még beszélünk', saved: 1 },
    { d: '2025.07.21', snap: 'me' }
  ]},
  { k: 'laura', streak: 88, snapcode: 'LK', chats: [
    { d: 'MA', snap: 'them', new: 1 }, { d: 'MA', who: 'laura', x: 'jössz ma edzésre?' }, { d: 'MA', who: 'me', x: 'ja 6kor 🏐' }
  ]},
  { k: 'dori', streak: 121, snapcode: 'DO', chats: [
    { d: 'TEGNAP', who: 'dori', x: 'küldd át a matek házit pls 🥺' }, { d: 'TEGNAP', who: 'me', x: 'küldöm 📸' }, { d: 'TEGNAP', snap: 'me' }
  ]},
  { k: 'panni', streak: 45, snapcode: 'PB', chats: [
    { d: 'MA', who: 'panni', x: 'láttad zsófi új sztoriját?? 👀' }, { d: 'MA', who: 'me', x: 'neee mutasd' }, { d: 'MA', who: 'panni', x: 'küldöm mindjárt' }
  ]},
  { k: 'vivi', streak: 12, snapcode: 'VK', chats: [ { d: '2 N', who: 'vivi', x: 'boldog szülinapot laurának!! 🎂' }, { d: '2 N', who: 'me', x: 'igeen 🥳' } ]},
  { k: 'gergo', streak: 0, snapcode: 'GN', chats: [ { d: '3 N', who: 'gergo', x: 'meccs szombaton, jössz?' }, { d: '3 N', who: 'me', x: 'megpróbálok 🏀' } ]},
  { k: 'noemi', streak: 30, snapcode: 'NR', chats: [ { d: '1 H', snap: 'them' }, { d: '1 H', who: 'noemi', x: 'tetszik az új hajam?? 💇‍♀️' } ]},
  { k: 'soma', streak: 7, snapcode: 'SZ', chats: [ { d: '1 H', who: 'soma', x: 'küldök egy új demót 🎧' }, { d: '1 H', who: 'me', x: 'kíváncsi vagyok!' } ]}
];

/* ---------- Snap Map: bitmoji-pöttyök egy térképen ---------- */
const SNAP_MAP = {
  places: [
    { name: 'Iskola', x: 180, y: 210, type: 'school' },
    { name: 'Városliget', x: 470, y: 150, type: 'park' },
    { name: 'Pláza', x: 300, y: 430, type: 'mall' },
    { name: 'Edzőterem', x: 150, y: 560, type: 'gym' }
  ],
  people: [
    { k: 'reka', me: 1, x: 250, y: 300, loc: 'Otthon · Budapest, XIII. ker.', ago: 'most' },
    { k: 'laura', x: 470, y: 250, loc: 'Városliget', ago: '12 p', code: 'LK' },
    { k: 'dori', x: 160, y: 540, loc: 'Edzőterem', ago: '1 ó', code: 'DO' },
    { k: 'panni', x: 340, y: 420, loc: 'Aréna Pláza', ago: '25 p', code: 'PB' },
    { k: 'vivi', x: 520, y: 470, loc: 'Belváros', ago: '3 ó', code: 'VK' },
    { k: 'gergo', x: 220, y: 200, loc: 'Iskola', ago: '2 ó', code: 'GN' },
    { k: 'soma', x: 400, y: 620, loc: 'Zenesuli', ago: '40 p', code: 'SZ' },
    { k: 'bence', ghost: 1, x: 380, y: 320, loc: 'A Térkép ki van kapcsolva (Szellem mód)', ago: 'rejtett', code: 'BK' }
  ]
};

/* =========================================================
   IDŐVONAL
   ========================================================= */
const TIMELINE = [
  { id: 't1', d: '2024. ősz', x: 'Réka és Bence kapcsolatának kezdete.' },
  { id: 't2', d: '2025.06.14.', x: 'Laura szülinapi bulija – itt készülnek a képek Rékáról.' },
  { id: 't3', d: '2025.07.20.', x: 'Réka szakít Bencével; Bence Snapen fenyegetőzik: „nem felejtek”.' },
  { id: 't4', d: '2025.09.28.', x: 'Réka kiposztolja az új kapcsolatát Mátéval.' },
  { id: 't5', d: '2025.10.01.', x: 'Létrejön a „nem.felejtek” névtelen Instagram-fiók.' },
  { id: 't6', d: '2025.10.02.', x: 'A névtelen fiók először fenyegeti meg Rékát.' },
  { id: 't7', d: '2025.10.05.', x: 'A zsaroló két napos határidőt szab.' },
  { id: 't8', d: '2025.10.06.', x: 'Réka elmondja a nővérének, és feljelentést tesznek.' }
];
const TL_START = ['t4', 't1', 't6', 't2', 't8', 't3', 't7', 't5'];

const PROVIDER = {
  created: '2025.10.01. 22:47',
  device: 'iPhone 13 (iOS 18.1)',
  ip: '84.2.xx.xx (Budapest, UPC/Vodafone)',
  linked: 'ugyanerről az eszközről egy másik fiókba is bejelentkeztek: „b••••••••lf” (kitakarva)',
  email: 'b•••••7@gmail.com',
  phone: '+36 •• ••• ••47'
};

/* =========================================================
   METAADAT (buli-kép elemzése)
   ========================================================= */
const PARTY_META = {
  fn: PARTY_FILENAME, created: '2025.06.14. 23:15:02', gps: '47.5039, 19.0784 (Budapest, XIII. kerület)',
  maker: 'Apple', device: 'iPhone 13', sw: 'iOS 17.5.1', res: '4032 × 3024'
};

/* =========================================================
   KAPCSOLATI HÁLÓ (záró szűrés)
   ========================================================= */
const TARGET6 = { id: 'K-017', target: true, name: 'Kovács Bence', born: '2008.03.22.', year: 2008, party: true, dev: 'iPhone 13', phone4: '3247', email1: 'b', reka: 'volt párja (2024 ősz – 2025.07.)',
  ig: 'bencehimself', extra: 'A „nem.felejtek” fiókot ugyanarról az iPhone 13-ról hozták létre, mint az ő fiókját. A jelszó-visszaállítás szerint a fiók telefonszáma …47-re, e-maile „b”-re és „7”-re végződik/kezdődik.' };
// A négy szűrő: bulin volt? · telefon típusa · tel.szám vége · e-mail kezdőbetűje

/* ---------- Kapcsolati háló: teljes névsor ---------- */
const REGISTRY = [{"id": "K-021","name": "Tóth Emma","born": "2008.03.22.","year": 2008,"party": true,"dev": "Huawei P50","phone4": "2329","email1": "v"},{"id": "K-017","name": "Kovács Bence","born": "2008.03.22.","year": 2008,"party": true,"dev": "iPhone 13","phone4": "3247","email1": "b","target": true},{"id": "K-005","name": "Varga Anna","born": "2009.04.15.","year": 2009,"party": false,"dev": "iPhone 13","phone4": "7747","email1": "b"},{"id": "K-003","name": "Török Csenge","born": "2007.10.14.","year": 2007,"party": true,"dev": "iPhone 13","phone4": "8152","email1": "b"},{"id": "K-007","name": "Horváth Zsombor","born": "2008.02.03.","year": 2008,"party": false,"dev": "iPhone 13","phone4": "6547","email1": "g"},{"id": "K-009","name": "Szilágyi Panna","born": "2008.10.07.","year": 2008,"party": false,"dev": "iPhone 13 mini","phone4": "2307","email1": "m"},{"id": "K-020","name": "Nagy Bendegúz","born": "2008.05.08.","year": 2008,"party": false,"dev": "iPhone 13","phone4": "3472","email1": "v"},{"id": "K-008","name": "Kovács Csenge","born": "2009.09.04.","year": 2009,"party": true,"dev": "Xiaomi 13","phone4": "1261","email1": "l"},{"id": "K-010","name": "Molnár Bendegúz","born": "2009.05.15.","year": 2009,"party": false,"dev": "iPhone 13","phone4": "4068","email1": "d"},{"id": "K-011","name": "Varga Lilla","born": "2008.12.22.","year": 2008,"party": false,"dev": "Xiaomi 13","phone4": "6572","email1": "p"},{"id": "K-018","name": "Fehér Marcell","born": "2008.09.04.","year": 2008,"party": false,"dev": "Xiaomi 13","phone4": "2368","email1": "s"},{"id": "K-027","name": "Simon Barnabás","born": "2007.11.18.","year": 2007,"party": true,"dev": "Huawei P50","phone4": "9307","email1": "l"},{"id": "K-016","name": "Szilágyi Ádám","born": "2009.10.03.","year": 2009,"party": false,"dev": "iPhone 12","phone4": "8129","email1": "f"},{"id": "K-006","name": "Nagy Emma","born": "2008.12.14.","year": 2008,"party": true,"dev": "iPhone 13","phone4": "6519","email1": "b"},{"id": "K-023","name": "Lakatos Olivér","born": "2009.02.08.","year": 2009,"party": false,"dev": "Samsung Galaxy S22","phone4": "7785","email1": "p"},{"id": "K-013","name": "Kovács Gergő","born": "2009.05.03.","year": 2009,"party": false,"dev": "Samsung Galaxy S22","phone4": "1213","email1": "k"},{"id": "K-019","name": "Horváth Kristóf","born": "2008.09.25.","year": 2008,"party": false,"dev": "iPhone 11","phone4": "0661","email1": "h"},{"id": "K-026","name": "Molnár Máté","born": "2009.04.04.","year": 2009,"party": false,"dev": "iPhone SE","phone4": "6561","email1": "v"},{"id": "K-002","name": "Nagy Csenge","born": "2008.04.08.","year": 2008,"party": true,"dev": "iPhone 13","phone4": "8147","email1": "d"},{"id": "K-015","name": "Rácz Áron","born": "2008.04.05.","year": 2008,"party": true,"dev": "iPhone SE","phone4": "0668","email1": "s"},{"id": "K-025","name": "Tóth Olivér","born": "2008.05.22.","year": 2008,"party": false,"dev": "Samsung Galaxy S22","phone4": "2313","email1": "n"},{"id": "K-024","name": "Rácz Levente","born": "2007.02.23.","year": 2007,"party": true,"dev": "Xiaomi 13","phone4": "8161","email1": "k"},{"id": "K-012","name": "Kiss Milán","born": "2009.05.21.","year": 2009,"party": false,"dev": "Huawei P50","phone4": "6507","email1": "k"},{"id": "K-014","name": "Takács Zsófia","born": "2009.03.09.","year": 2009,"party": true,"dev": "Huawei P50","phone4": "1251","email1": "v"},{"id": "K-022","name": "Fekete Noel","born": "2008.09.25.","year": 2008,"party": false,"dev": "iPhone SE","phone4": "6568","email1": "z"},{"id": "K-004","name": "Tóth Zsombor","born": "2008.09.20.","year": 2008,"party": true,"dev": "iPhone 12","phone4": "8147","email1": "b"}];
// A kereső a REGISTRY elemeit adja a részletező nézetnek, ezért a gyanúsított
// dús mezőit (ig, reka, extra) beolvasztjuk a nyilvántartás céltételébe.
(function () { const i = REGISTRY.findIndex(p => p.target); if (i >= 0) REGISTRY[i] = Object.assign({}, REGISTRY[i], TARGET6); })();
