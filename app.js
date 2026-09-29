'use strict';
/* =========================================================
   A.K.T.A. – 6. akta – Robotzsaru Adattár (telefonra tervezve)
   Téma: zsarolás / kép-alapú visszaélés kiskorúak közt.
   Minden szereplő, név, fiók, kép és adat KITALÁLT.
   Az intim kép sehol nem jelenik meg, még helyőrzőként sem.
   ========================================================= */

const STORE = 'akta6_state_v1';

/* ---------- Segédfüggvények ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const deacc = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const norm = s => deacc(s).replace(/\s+/g, '').replace(/\.+$/, '');
const digits = s => String(s).replace(/\D/g, '');
const sleep = ms => new Promise(r => setTimeout(r, ms));

const CLUE_LABELS = { buli: 'Bulin volt', keszulek: 'Telefon típusa', telefon: 'Telefonszám vége', email: 'E-mail kezdőbetűje' };
const defaultState = () => ({
  auth: false,
  clues: { buli: false, keszulek: false, telefon: false, email: false },
  timelineDone: false, dataRequested: false, solved: false
});
let S = loadState();
function loadState() { try { const r = localStorage.getItem(STORE); if (r) return Object.assign(defaultState(), JSON.parse(r)); } catch (e) { } return defaultState(); }
function save() { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { } }
const clueCount = () => Object.values(S.clues).filter(Boolean).length;
function addClue(k) { if (S.clues[k]) return; S.clues[k] = true; save(); toast(`Új adat került a profillapra (${clueCount()}/4)`); }

let toastT;
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 3200); }
function openModal(html) { $('#modal-body').innerHTML = html; $('#modal').hidden = false; $('.modal-box').scrollTop = 0; }
function closeModal() { $('#modal').hidden = true; $('#modal-body').innerHTML = ''; }
$('.modal-close').addEventListener('click', closeModal);
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#modal').hidden) closeModal(); });

/* ---------- Kép- és avatar-segédek ---------- */
// Egy képhivatkozás lehet sima szöveg ('reka1' → img/reka1.jpg) vagy objektum ({ pic, img, txt, meta, fn }).
const asPic = o => typeof o === 'string' ? { pic: o } : (o || {});
const imgPath = name => 'img/' + encodeURIComponent(name) + '.jpg';   // a szóközös fájlnevet is kezeli („kosar 2”)
function picSrc(o) {
  o = asPic(o);
  if (o.pic === 'party' || o.pic === 'buli') return PARTY_IMG[o.img || 0];
  if (o.pic) return imgPath(o.pic);
  return null;
}
function picHue(o) { o = asPic(o); if (o.h != null) return o.h; if (o.pic === 'party' || o.pic === 'buli') return 275; return 260; }
function picLabel(o) {
  o = asPic(o);
  if (o.txt) return esc(o.txt);
  if (o.pic === 'party' || o.pic === 'buli') return '<b>🎉</b>buli';
  return '<b>📷</b>';
}
// Ha egy kép nem található: rácsban az egész csempe eltűnik, máshol visszaáll a színes helyőrző.
function imgErr(el) {
  const tile = el.closest('.grid3 > button'); if (tile) { tile.remove(); return; }
  const box = el.parentElement; el.remove(); if (box) box.classList.remove('has-img');
}
function pic(o, cls) {
  const src = picSrc(o);
  // Van kép → semleges szürke háttér (mint az igazi Instán), a színes helyőrző csak hiányzó képnél látszik.
  const img = src ? `<img src="${src}" onerror="imgErr(this)" alt="" decoding="async">` : '';
  return `<div class="pic ${src ? 'has-img' : ''} ${cls || ''}" style="--h:${picHue(o)}">${img}<span>${picLabel(o)}</span></div>`;
}
// Profilkép: img/<kulcs>prof.jpg (pl. rekaprof.jpg, benceprof.jpg) vagy a P[k].pic mezőben megadott fájl; ha nincs meg a fájl: színes monogram.
function ppSrc(k) { const p = who(k) || {}; return imgPath(p.pic || k + 'prof'); }
function pp(k) {
  const p = who(k) || {};
  if (p.anon) return '<div class="pp anon" aria-hidden="true"></div>';
  return `<div class="pp has-img" style="--h:${p.h != null ? p.h : 260}"><img src="${ppSrc(k)}" onerror="imgErr(this)" alt="">${esc((p.n || '?')[0])}</div>`;
}

/* ---------- Előtöltés: induláskor az összes Instagram-kép letöltődik a háttérben,
   így profil megnyitásakor / lapozáskor már a gyorsítótárból, azonnal jelennek meg. ---------- */
const PRELOADED = [];
function preloadImages() {
  const srcs = new Set(PARTY_IMG);
  const add = o => { const s = picSrc(o); if (s) srcs.add(s); };
  IG_FEED.forEach(p => p.imgs.forEach(add));
  IG_STORIES.forEach(s => s.slides.forEach(add));
  Object.values(IG_PROFILES).forEach(p => { (p.grid || []).forEach(add); (p.highlights || []).forEach(add); });
  Object.keys(P).forEach(k => { if (P[k].pic) srcs.add(ppSrc(k)); });
  srcs.forEach(src => { const i = new Image(); i.decoding = 'async'; i.src = src; PRELOADED.push(i); });
}
const handle = k => (who(k) || {}).u || k;
const dispName = k => (who(k) || {}).n || k;

/* =========================================================
   ROUTER
   ========================================================= */
const app = $('#app');
const views = { login: vLogin, adattar: vDash, insta: vIG, snap: vSC, elemzes: vAnalyze, idovonal: vTimeline, nyilvantartas: vRegistry };
function route() {
  let h = location.hash.replace(/^#\/?/, '') || 'login';
  if (!views[h]) h = 'adattar';
  if (!S.auth) h = 'login'; else if (h === 'login') h = 'adattar';
  if (h === 'insta') { IG.view = 'home'; IG.arg = null; IG.back = null; }
  if (h === 'snap') { SC.view = 'chats'; SC.arg = null; }
  closeModal(); closeStory(); views[h](); window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
const backBar = title => `<div class="rz-top"><a class="back-link" href="#/adattar" aria-label="Vissza az adattárba">←</a><h2>${title}</h2></div>`;

/* =========================================================
   ROBOTZSARU – belépés / főoldal / dokumentumok
   ========================================================= */
function vLogin() {
  app.className = 'v-rz';
  app.innerHTML = `<section class="rz-frame rz-login">
    <h1 class="rz-title">ROBOTZSARU ADATTÁR</h1>
    <p class="rz-sub">A.K.T.A. Központi Bizonyítékkezelő v4.2<br>RENDSZER ONLINE</p>
    <input id="caseIn" class="rz-input" placeholder="ADJA MEG AZ ÜGYIRATSZÁMOT" autocomplete="off" aria-label="Ügyiratszám">
    <button id="caseBtn" class="rz-btn solid">ADATOK LEKÉRÉSE</button>
    <p id="caseErr" class="rz-err" role="alert"></p></section>`;
  const go = () => {
    if (norm($('#caseIn').value) === norm(CASE_NO)) { S.auth = true; save(); location.hash = '#/adattar'; }
    else $('#caseErr').textContent = 'Nincs ilyen ügyiratszám. Nézzétek meg a jegyzőkönyv jobb felső sarkát.';
  };
  $('#caseBtn').onclick = go; $('#caseIn').onkeydown = e => { if (e.key === 'Enter') go(); };
}

function vDash() {
  const n = clueCount();
  const chip = (k) => `<span class="clue-chip ${S.clues[k] ? 'on' : ''}">${S.clues[k] ? '✓' : '○'} ${CLUE_LABELS[k]}</span>`;
  const card = (t, p, btn) => `<article class="rz-card"><h3>${t}</h3><p>${p}</p>${btn}</article>`;
  app.className = 'v-rz';
  app.innerHTML = `<section class="rz-frame">
    <h1 class="rz-title">HOZZÁFÉRÉS ENGEDÉLYEZVE</h1>
    <p class="rz-case">Aktaszám: <strong>${CASE_NO}</strong><span class="closed">LEZÁRT ÜGY</span></p>
    <div class="rz-list">
      ${card('Feljelentési jegyzőkönyv', 'A sértett és édesanyja meghallgatása, 2025. október 6.', '<button class="rz-btn" data-doc="jkv">MEGTEKINTÉS</button>')}
      ${card('Sértett adatlapja', 'Sz. Réka, 16 éves (kiskorú, adatai anonimizálva).', '<button class="rz-btn" data-doc="sertett">MEGTEKINTÉS</button>')}
      ${card('Nyomozati kérdések', 'Az aktához tartozó kérdések.', '<button class="rz-btn" data-doc="kerdesek">MEGTEKINTÉS</button>')}
      ${card('Adatmentés: Instagram-fiók', 'A sértett fiókja: bejegyzések, sztorik, privát üzenetek, névtelen fiók fenyegetései.', '<a class="rz-btn" href="#/insta">MEGNYITÁS</a>')}
      ${card('Adatmentés: Snapchat-fiók', 'A sértett fiókja: beszélgetések, mentett üzenetek, Snap Térkép.', '<a class="rz-btn" href="#/snap">MEGNYITÁS</a>')}
      ${card('Digitális metaadat-elemzés', 'Töltsetek fel egy képet a bizonyítékok közül, és a rendszer kiolvassa a rejtett adatait.', '<a class="rz-btn" href="#/elemzes">KÉP FELTÖLTÉSE</a>')}
      ${card('Ügy idővonala', S.timelineDone ? 'Az idővonal összeállt.' : 'Az események időrendi rekonstrukciója.', '<a class="rz-btn" href="#/idovonal">MEGNYITÁS</a>')}
      <article class="rz-card ${n < 4 ? 'locked' : ''}"><h3>Kapcsolati háló – személykereső ${n < 4 ? '🔒' : ''}</h3>
        <p>${n < 4 ? 'A kereséshez négy adat kell a zsarolóról. Ezek a bizonyítékokban vannak – írjátok fel őket a profillapra.' : 'Minden adat megvan. Szűrjetek rá a zsarolóra a kapcsolati hálóban!'}</p>
        <div class="meter"><span style="width:${n * 25}%"></span></div>
        <div class="clue-row">${chip('buli')}${chip('keszulek')}${chip('telefon')}${chip('email')}</div>
        ${n < 4 ? `<button class="rz-btn" disabled style="width:100%">SZÜKSÉGES ADATOK: ${n}/4</button>` : `<a class="rz-btn" style="display:block" href="#/nyilvantartas">KERESŐ MEGNYITÁSA</a>`}
      </article>
    </div>
    <div class="rz-foot"><button class="rz-btn" id="logout">RENDSZER LEZÁRÁSA</button></div></section>`;
  $$('[data-doc]').forEach(b => b.onclick = () => showDoc(b.dataset.doc));
  $('#logout').onclick = () => { if (confirm('Biztosan lezárod a rendszert? Minden haladás törlődik.')) { S = defaultState(); save(); location.hash = '#/login'; route(); } };
}

function showDoc(w) {
  if (w === 'jkv') openModal(`<div class="paper">
    <div class="head">Budapesti Rendőr-főkapitányság<br>Bűnügyi Osztály</div>
    <div class="ref">Szám: ${CASE_NO}<br>Tárgy: kiskorú sérelmére elkövetett zsarolás, valamint hozzájárulás nélküli, szeméremsértő felvétellel való visszaélés gyanúja</div>
    <h4>JEGYZŐKÖNYV</h4>
    <p>Készült: Budapest, 2025. október 6-án, a feljelentő és a sértett meghallgatásáról. Jelen van: Varga Eszter r. főhadnagy, jegyzőkönyvvezető; Sz. Réka (16) sértett és édesanyja, Sz. Katalin.</p>
    <p>„A lányom, Réka nyáron szakított a barátjával, Bencével. Szeptemberben új kapcsolatba került (Máté). Néhány napja egy »nem.felejtek« nevű, ismeretlen Instagram-fiók kezdte fenyegetni: azt írta, hogy ha nem szakít Mátéval, elküld róla egy bizalmas képet Máténak és nekem, az édesanyjának.</p>
    <p>A fiók olyan képeket is küldött Rékáról, amelyek egy nyári bulin, a tudta nélkül készültek. Réka végül elmondta a nővérének, ő szólt nekem, és együtt jöttünk feljelentést tenni. Réka szerint a fiók mögött a volt barátja, Bence állhat, de biztosan nem tudja, mert a fiók névtelen.”</p>
    <p>A sértett előadta továbbá, hogy a bizalmas képet annak idején kizárólag a volt barátjának, Bencének küldte el, más nem fért hozzá.</p>
    <p><b>Záradék:</b> A sértett Instagram- és Snapchat-fiókjáról igazságügyi adatmentés készült (BJ: 2025/BJ/1180). A nyomozás az elkövető azonosításával zárult, az ügyben jogerős ítélet született.</p>
    <p style="margin-top:18px">Kelt: Budapest, 2025. 10. 06.<br>Varga Eszter r. főhadnagy</p></div>`);
  if (w === 'sertett') openModal(`<div class="inner"><h2 style="color:var(--rz-accent);margin-top:0">Sértett adatlapja</h2>
    <div class="mug big">KITAKARVA</div><div class="meta">
    <span>Név:</span><b>Sz. Réka (kiskorú)</b><span>Életkor:</span><b>16 év</b><span>Lakóhely:</span><b>Budapest, XIII. kerület</b>
    <span>Instagram:</span><b>${handle('reka')}</b><span>Snapchat:</span><b>reka_sz</b>
    <span>Lefoglalt adat:</span><b>Instagram + Snapchat mentés (BJ: 2025/BJ/1180)</b><span>Kapcsolattartó:</span><b>Sz. Katalin (édesanya)</b></div>
    <p class="muted" style="margin-top:12px">Fontos: az ügy középpontjában álló bizalmas kép a vizsgálati anyagban nem szerepel és nem megjeleníthető. A feladat megoldásához nincs is rá szükség.</p></div>`);
  if (w === 'kerdesek') openModal(`<div class="inner"><h2 style="color:var(--rz-accent);margin-top:0">Nyomozati kérdések</h2><ol class="q-list">
    <li>Mikor ért véget Réka korábbi kapcsolata, és mikor kezdődtek a fenyegetések?</li>
    <li>Mit követelt a zsaroló, és mivel fenyegetőzött?</li>
    <li>Honnan származnak a bulis képek, és mi bizonyítja, hogy Réka tudta nélkül készültek?</li>
    <li>Miért nem Zsófi a zsaroló, pedig ő is írt csúnya üzeneteket?</li>
    <li>Ki a zsaroló, és mely bizonyítékok azonosítják?</li></ol></div>`);
}

/* =========================================================
   INSTAGRAM MOCK
   ========================================================= */
let IG = { view: 'home', arg: null, acct: 'reka' };
const igShell = (title, body, nav, opts = {}) => {
  const back = opts.back ? `<button class="ig-ic" id="igBack" aria-label="Vissza">←</button>` : `<a class="ig-ic" href="#/adattar" aria-label="Adattár" title="Adattár">🏠</a>`;
  const nUnread = Object.values(IG_DMS).filter(d => d.unread).length;
  const top = opts.logo
    ? `<div class="ig-top"><span class="ig-logo">Instagram</span><button class="ig-ic" data-igv="dm" aria-label="Üzenetek">✉️${nUnread ? `<span class="dot" style="position:static;margin-left:-6px">${nUnread}</span>` : ''}</button></div>`
    : `<div class="ig-top">${back}<span class="t">${title}</span>${opts.right || '<span style="width:28px"></span>'}</div>`;
  const navBar = nav === false ? '' : `<nav class="ig-nav">
      <button data-igv="home" class="${IG.view === 'home' ? 'on' : ''}">🏠</button>
      <button data-igv="search" class="${IG.view === 'search' || IG.view === 'profile' ? 'on' : ''}">🔍</button>
      <button data-igv="dm" class="${IG.view === 'dm' || IG.view === 'thread' ? 'on' : ''}">✉️${nUnread ? `<span class="dot">${nUnread}</span>` : ''}</button></nav>`;
  return `<div class="ig-note">🔒<span>Igazságügyi adatmentés – ${handle('reka')} fiókja. Csak megtekintésre.</span></div>${top}<div class="ig-body">${body}</div>${navBar}`;
};

function vIG() {
  app.className = 'v-ig';
  if (IG.view === 'home') return igHome();
  if (IG.view === 'search') return igSearch();
  if (IG.view === 'profile') return igProfile(IG.arg);
  if (IG.view === 'dm') return igDMList();
  if (IG.view === 'thread') return igThread(IG.arg);
  if (IG.view === 'reset') return igReset(IG.arg);
  igHome();
}
function igNavBind() {
  $$('[data-igv]').forEach(b => b.onclick = () => { IG.view = b.dataset.igv; IG.arg = null; vIG(); });
  const bk = $('#igBack'); if (bk) bk.onclick = () => { IG.view = IG.back || 'home'; IG.arg = IG.backArg || null; IG.back = null; vIG(); };
}

function igHome() {
  const stories = IG_STORIES.map((s, i) => `<button class="ig-story" data-story="${i}">
      <span class="ring">${pp(s.k)}</span>
      <span class="n">${s.me ? 'Te' : esc(dispName(s.k))}</span></button>`).join('');
  const feed = IG_FEED.map(postHTML).join('');
  app.innerHTML = igShell('', `<div class="ig-stories">${stories}</div>${feed}`, true, { logo: true });
  igNavBind();
  $$('[data-story]').forEach(b => b.onclick = () => openStory(+b.dataset.story));
  bindPostActions();
}
function postHTML(p, idx) {
  const multi = p.imgs.length > 1;
  const slides = p.imgs.map((im, i) => `<div class="pslide" data-i="${i}" ${i ? 'hidden' : ''}>${pic(im, 'post-img')}</div>`).join('');
  const dots = multi ? `<div class="dots">${p.imgs.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>` : '';
  const nav = multi ? `<button class="nav l" data-pn="l" hidden>‹</button><button class="nav r" data-pn="r">›</button><span class="cnt">1/${p.imgs.length}</span>` : '';
  const cm = (p.comments || []).map(([u, t]) => `<div class="post-c"><b>${esc(u)}</b> ${esc(t)}</div>`).join('');
  return `<article class="post" data-post="${idx}">
    <div class="post-h" data-uprof="${p.by}">${pp(p.by)}<div><b>${esc(handle(p.by))}</b></div><span class="more">⋯</span></div>
    <div class="carousel">${slides}${nav}</div>
    <div class="post-a"><span>🤍</span><span>💬</span><span>➤</span><span class="bm">🔖</span></div>
    ${dots}
    <div class="post-t"><b>${p.likes} kedvelés</b></div>
    <div class="post-t"><b>${esc(handle(p.by))}</b> ${esc(p.cap)}</div>
    ${cm}
    <div class="post-date">${esc(p.date)}</div></article>`;
}
function bindPostActions() {
  $$('[data-uprof]').forEach(h => h.onclick = () => { IG.back = IG.view; IG.view = 'profile'; IG.arg = h.dataset.uprof; vIG(); });
  $$('.carousel').forEach(car => {
    const slides = $$('.pslide', car); if (slides.length < 2) return;
    let i = 0; const cnt = $('.cnt', car), l = $('[data-pn="l"]', car), r = $('[data-pn="r"]', car), dots = $$('.dots i', car.parentElement);
    const upd = () => { slides.forEach((s, k) => s.hidden = k !== i); if (cnt) cnt.textContent = `${i + 1}/${slides.length}`; if (l) l.hidden = i === 0; if (r) r.hidden = i === slides.length - 1; dots.forEach((d, k) => d.classList.toggle('on', k === i)); };
    if (r) r.onclick = () => { if (i < slides.length - 1) { i++; upd(); } };
    if (l) l.onclick = () => { if (i > 0) { i--; upd(); } };
  });
}

/* ----- Instagram: keresés + profilok ----- */
function igSearch() {
  const list = Object.keys(IG_PROFILES).filter(k => k !== 'anon');
  const rows = k => `<button class="urow" data-uprof="${k}">${pp(k)}<div class="i"><b>${esc(handle(k))}</b><small>${esc(dispName(k))}</small></div></button>`;
  app.innerHTML = igShell('Keresés', `<div class="ig-search">🔍<input id="igq" placeholder="Keresés" autocomplete="off"></div>
    <div id="igres">${list.map(rows).join('')}</div>`, true, {});
  igNavBind();
  $$('[data-uprof]').forEach(h => h.onclick = () => { IG.back = 'search'; IG.view = 'profile'; IG.arg = h.dataset.uprof; vIG(); });
  $('#igq').oninput = e => {
    const q = norm(e.target.value);
    const found = Object.keys(IG_PROFILES).filter(k => norm(handle(k)).includes(q) || norm(dispName(k)).includes(q) || (k === 'anon' && 'nemfelejtek'.includes(q)));
    $('#igres').innerHTML = found.length ? found.map(rows).join('') : '<p class="ig-empty">Nincs találat.</p>';
    $$('[data-uprof]').forEach(h => h.onclick = () => { IG.back = 'search'; IG.view = 'profile'; IG.arg = h.dataset.uprof; vIG(); });
  };
}
function igProfile(k) {
  const pr = IG_PROFILES[k];
  if (!pr) { IG.view = 'search'; return vIG(); }
  if (pr.anon) {
    app.innerHTML = igShell(handle(k), `<div class="ig-prof">
      <div class="ig-prof-top">${pp(k)}<div class="ig-stats"><div><b>0</b>bejegyzés</div><div><b>0</b>követő</div><div><b>1</b>követett</div></div></div>
      <div class="ig-bio"><b>${esc(handle(k))}</b>Nincs megadva név.</div>
      <div class="ig-btns"><button>Követés</button><button>Üzenet</button></div></div>
      <div class="private">🔒<b>Ez a fiók privát</b>Kövesd, hogy lásd a fényképeit és videóit.</div>
      <div class="dm-note" style="padding:14px">Létrehozva: ${esc(pr.joined)} · A fiók nevét, e-mailjét nem adta meg nyilvánosan. Használjátok a „Elfelejtett jelszó” eszközt a kapcsolati adatok kitakart részének megtekintéséhez.</div>
      <div style="padding:0 14px 18px"><button class="ig-btns"><button class="blue" id="toReset" style="width:100%">Elfelejtett jelszó – kapcsolati adatok</button></button></div>`, true, { back: true });
    igNavBind();
    $('#toReset').onclick = () => { IG.back = 'profile'; IG.backArg = k; IG.view = 'reset'; IG.arg = k; vIG(); };
    return;
  }
  const hl = (pr.highlights || []).map(h => `<div class="ig-hl"><span class="hl">${pic(h)}</span><span>${esc(h.n)}</span></div>`).join('');
  const grid = (pr.grid || []).map((g, i) => `<button data-grid="${i}">${pic(g)}</button>`).join('');
  app.innerHTML = igShell(handle(k), `<div class="ig-prof">
      <div class="ig-prof-top">${pp(k)}<div class="ig-stats"><div><b>${pr.posts != null ? pr.posts : (pr.grid || []).length}</b>bejegyzés</div><div><b>${pr.followers}</b>követő</div><div><b>${pr.following}</b>követett</div></div></div>
      <div class="ig-bio"><b>${esc(dispName(k))}</b>${esc(pr.bio)}</div>
      <div class="ig-btns"><button class="${k === 'reka' ? '' : 'blue'}">${k === 'reka' ? 'Profil szerkesztése' : 'Követés'}</button><button data-dm="${k}">Üzenet</button></div>
      ${hl ? `<div class="ig-hls">${hl}</div>` : ''}
    </div>
    <div class="ig-tabs"><span>▦</span><span>👤</span></div>
    <div class="grid3">${grid}</div>`, true, { back: true });
  igNavBind();
  const dmb = $('[data-dm]'); if (dmb) dmb.onclick = () => openThreadFor(k);
}
function openThreadFor(k) { if (!IG_DMS[k]) { toast('Nincs mentett üzenetváltás ezzel a fiókkal.'); return; } IG.view = 'thread'; IG.arg = k; vIG(); }

/* ----- Instagram: DM ----- */
function igDMList() {
  const rows = IG_DM_ORDER.map(k => {
    const d = IG_DMS[k], last = d.msgs[d.msgs.length - 1];
    const prev = last.vanish ? '📷 Fotó' : last.img ? '📷 Fénykép' : (last.me ? 'Te: ' : '') + (last.x || '');
    return `<button class="urow" data-thread="${k}">${pp(k)}<div class="i"><b>${esc(handle(k))}</b><small class="${d.unread ? 'unread' : ''}">${esc(prev)}</small></div>${d.unread ? '<span class="bd"></span>' : ''}</button>`;
  }).join('');
  app.innerHTML = igShell(handle('reka'), `<div class="dm-h">${esc(handle('reka'))} <span>⌄</span></div>${rows}`, true, { back: false, right: '<span style="width:28px"></span>' });
  igNavBind();
  $$('[data-thread]').forEach(b => b.onclick = () => { IG.view = 'thread'; IG.arg = b.dataset.thread; vIG(); });
}
function igThread(k) {
  const d = IG_DMS[k]; if (!d) { IG.view = 'dm'; return vIG(); }
  if (d.unread) { d.unread = false; }
  const vm = k === 'anon';
  let last = '', body = '';
  d.msgs.forEach(m => {
    const stamp = m.d + ' ' + m.t;
    if (stamp !== last) { body += `<div class="thr-time">${esc(m.d)} · ${esc(m.t)}</div>`; last = stamp; }
    const side = m.me ? 'me' : '';
    if (m.vanish) {
      body += `<div class="mrow ${side}">${m.them ? pp(k) : '<span class="sp"></span>'}<div class="bub vanish">📷 ${esc(m.vanish)} · Megnyitva</div></div>`;
      if (m.note) body += `<div class="dl" style="color:${vm ? '#a8a8a8' : '#737373'};font-weight:400">${esc(m.note)}</div>`;
    } else if (m.img) {
      body += `<div class="mrow ${side}">${m.them ? pp(k) : '<span class="sp"></span>'}<div class="bub img">${pic(m.img)}</div></div>`;
      const fn = m.img.fn ? `Fájl: ${m.img.fn}` : '';
      if (m.note || fn) body += `<div class="dl" style="font-weight:400">${esc(m.note || '')}${m.note && fn ? ' · ' : ''}${esc(fn)}</div>`;
    } else {
      body += `<div class="mrow ${side}">${m.them ? pp(k) : '<span class="sp"></span>'}<div class="bub">${esc(m.x)}</div></div>`;
    }
  });
  const hero = `<div class="thr-hero">${pp(k)}<b>${esc(handle(k))}</b><small>${k === 'anon' ? 'Ismeretlen fiók · nincs közös követő' : esc(dispName(k)) + ' · Instagram'}</small></div>`;
  const banner = vm ? `<div class="vm-banner">⏱ Eltűnő mód<br>A „nem.felejtek” fiók eltűnő üzeneteket használt. A rendszer csak azt rögzíti, hogy fotó érkezett és megnyitották – a fotó tartalma nem került mentésre.</div>` : '';
  app.innerHTML = igShell(handle(k), `<div class="thr ${vm ? 'vm' : ''}">${hero}${banner}${body}</div>
    <div class="compose"><div>Üzenet…</div></div>`, false, { back: true, right: k === 'anon' ? '<button class="ig-ic" id="toReset2" title="Fiókadatok">ⓘ</button>' : '' });
  const bk = $('#igBack'); if (bk) bk.onclick = () => { IG.view = IG.back === 'profile' ? 'profile' : 'dm'; IG.arg = IG.back === 'profile' ? k : null; IG.back = null; vIG(); };
  const r2 = $('#toReset2'); if (r2) r2.onclick = () => { IG.back = 'thread'; IG.backArg = 'anon'; IG.view = 'reset'; IG.arg = 'anon'; vIG(); };
  if (k === 'anon') setTimeout(() => toast('A bulis képek gyanúsak – elemezzétek a metaadatukat!'), 800);
}

/* ----- Instagram: elfelejtett jelszó (a névtelen fiók kapcsolati adatai) ----- */
function igReset(k) {
  const r = IG_RESET[handle(k)] || IG_RESET['nem.felejtek'];
  app.innerHTML = igShell('Bejelentkezési segítség', `<div class="ig-login" style="padding-top:30px">
    <span class="ig-logo">Instagram</span>
    <p style="margin-bottom:18px">Fiók: <b>${esc(handle(k))}</b><br>Ehhez a fiókhoz az alábbi (kitakart) elérhetőségek tartoznak. Rendőri megkeresésre a teljes adat a szolgáltatótól kérhető.</p>
    <div class="opt"><div>📱</div><div><b>SMS küldése ide</b><small>${esc(r.sms)}</small></div><span class="r on"></span></div>
    <div class="opt"><div>✉️</div><div><b>E-mail küldése ide</b><small>${esc(r.email)}</small></div><span class="r"></span></div>
    <p style="margin-top:16px;font-size:12.5px">A telefonszám utolsó két számjegye és az e-mail vége látszik. Írjátok fel a profillapra a <b>telefonszám végét</b>! Az e-mail kezdőbetűje itt ki van takarva – azt a szolgáltatói adatszolgáltatás fedi fel.</p>
    </div>`, false, { back: true });
  const bk = $('#igBack'); if (bk) bk.onclick = () => { IG.view = IG.back || 'profile'; IG.arg = IG.backArg || 'anon'; IG.back = null; vIG(); };
  if (k === 'anon') setTimeout(() => addClue('telefon'), 1200);
}

/* ----- Instagram: sztori-néző ----- */
let STORY = null;
function openStory(i) {
  STORY = { g: i, s: 0 };
  renderStory();
}
function closeStory() { if (STORY) clearTimeout(STORY.t); const el = $('#storyLayer'); if (el) el.remove(); STORY = null; }
function renderStory() {
  if (!STORY) return;
  const g = IG_STORIES[STORY.g]; if (!g) return closeStory();
  const sl = g.slides[STORY.s];
  const bars = g.slides.map((_, i) => `<i class="${i < STORY.s ? 'done' : i === STORY.s ? 'run' : ''}"><b></b></i>`).join('');
  const html = `<div id="storyLayer" class="story"><div class="story-in">
    ${pic(sl)}
    <div class="story-bars">${bars}</div>
    <div class="story-h">${pp(g.k)}<div><b style="color:#fff">${g.me ? 'te' : esc(handle(g.k))}</b></div><small>most</small><button id="stClose">×</button></div>
    ${sl.txt ? `<div class="story-txt"><span>${esc(sl.txt)}</span></div>` : ''}
    ${sl.meta ? `<div class="story-meta">📷 ${esc(sl.meta)}</div>` : ''}
    <button class="story-tap l" id="stPrev" aria-label="Előző"></button>
    <button class="story-tap r" id="stNext" aria-label="Következő"></button>
  </div></div>`;
  let layer = $('#storyLayer'); if (layer) layer.remove();
  document.body.insertAdjacentHTML('beforeend', html);
  $('#stClose').onclick = closeStory;
  $('#stNext').onclick = next; $('#stPrev').onclick = prev;
  clearTimeout(STORY.t); STORY.t = setTimeout(next, 5000);
  function next() { if (!STORY) return; clearTimeout(STORY.t); if (STORY.s < g.slides.length - 1) { STORY.s++; renderStory(); } else if (STORY.g < IG_STORIES.length - 1) { STORY.g++; STORY.s = 0; renderStory(); } else closeStory(); }
  function prev() { if (!STORY) return; clearTimeout(STORY.t); if (STORY.s > 0) { STORY.s--; renderStory(); } else if (STORY.g > 0) { STORY.g--; STORY.s = 0; renderStory(); } else renderStory(); }
}

/* =========================================================
   SNAPCHAT MOCK
   ========================================================= */
let SC = { view: 'chats', arg: null, mapSel: null };

function bitmoji(code, hue, ghost) {
  const h = hue == null ? 260 : hue;
  const skin = '#f0c9a8', hair = `hsl(${h} 45% 32%)`, shirt = `hsl(${h} 60% 52%)`;
  return `<svg class="face" viewBox="0 0 80 80" aria-hidden="true">
    <circle cx="40" cy="74" r="26" fill="${shirt}"/>
    <path d="M18 34a22 22 0 0 1 44 0v8a22 22 0 0 1-44 0z" fill="${skin}"/>
    <path d="M16 34a24 20 0 0 1 48 0c0-14-10-24-24-24S16 20 16 34z" fill="${hair}"/>
    <circle cx="31" cy="38" r="3" fill="#3a2a20"/><circle cx="49" cy="38" r="3" fill="#3a2a20"/>
    <path d="M32 48q8 6 16 0" stroke="#b5744f" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${ghost ? '<circle cx="40" cy="40" r="40" fill="rgba(255,255,255,.35)"/>' : ''}
    <text x="40" y="70" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">${esc(code || '')}</text></svg>`;
}
const scAvatar = k => { const p = who(k) || {}; return `<span class="av">${bitmoji((p.n || '?')[0], p.h)}</span>`; };

function scShell(body, nav) {
  const navBar = nav === false ? '' : `<nav class="sc-nav">
    <button class="chat ${SC.view === 'chats' || SC.view === 'chat' ? 'on' : ''}" data-scv="chats"><span>💬</span>Csevegés</button>
    <button data-scv="cam"><span>◎</span>Kamera</button>
    <button class="map ${SC.view === 'map' ? 'on' : ''}" data-scv="map"><span>📍</span>Térkép</button></nav>`;
  return `<div class="ig-note">🔒<span>Igazságügyi adatmentés – Réka Snapchat-fiókja. Csak megtekintésre.</span></div>${body}${navBar}`;
}
function scNavBind() { $$('[data-scv]').forEach(b => b.onclick = () => { const v = b.dataset.scv; if (v === 'cam') { toast('A kamera nem része a mentésnek.'); return; } SC.view = v; SC.arg = null; vSC(); }); }

function vSC() {
  app.className = 'v-sc';
  if (SC.view === 'chat') return scChat(SC.arg);
  if (SC.view === 'map') return scMap();
  scChats();
}
function scChats() {
  const rows = SC_FRIENDS.map(f => {
    const last = f.chats[f.chats.length - 1];
    let icon = '<span class="st chat o"></span>', txt = 'Csevegés';
    if (last.snap) { icon = last.snap === 'me' ? '<span class="st sent o"></span>' : '<span class="st snap"></span>'; txt = last.snap === 'me' ? 'Elküldve' : 'Új Snap'; }
    else if (last.x) { icon = last.who === 'me' ? '<span class="st chat o"></span>' : '<span class="st chat"></span>'; txt = (last.who === 'me' ? 'Te: ' : '') + last.x; }
    const streak = f.streak ? `<span class="streak">🔥 ${f.streak}</span>` : '';
    const nw = last.new ? 'new' : '';
    return `<button class="sc-row" data-chat="${f.k}">${scAvatar(f.k)}<div class="i"><b>${esc(dispName(f.k))}</b><small class="${nw}">${icon}${esc(txt)}</small></div>${streak}</button>`;
  }).join('');
  app.innerHTML = scShell(`<div class="sc-top"><span class="sc-round">${bitmoji('R', (who('reka') || {}).h)}</span><h1>Csevegés</h1><span class="sc-round">✎</span></div><div class="sc-body">${rows}</div>`, true);
  scNavBind();
  $$('[data-chat]').forEach(b => b.onclick = () => { SC.view = 'chat'; SC.arg = b.dataset.chat; vSC(); });
}
function scChat(k) {
  const f = SC_FRIENDS.find(x => x.k === k); if (!f) { SC.view = 'chats'; return vSC(); }
  let last = '', body = '';
  f.chats.forEach(c => {
    if (c.d && c.d !== last) { body += `<div class="sc-day">${esc(c.d)}</div>`; last = c.d; }
    if (c.sys) { body += `<div class="sc-sys">${esc(c.sys)}</div>`; return; }
    if (c.snap) { body += `<div class="sc-blk"><div class="sc-who ${c.snap === 'me' ? 'me' : ''}">${c.snap === 'me' ? 'TE' : esc(dispName(k)).toUpperCase()}</div><div class="sc-m ${c.snap === 'me' ? 'me' : ''} snapitem"><span class="st ${c.snap === 'me' ? 'sent o' : 'snap'}"></span> ${c.snap === 'me' ? 'Snap elküldve' : 'Snap – lejárt'}</div></div>`; return; }
    const me = c.who === 'me';
    body += `<div class="sc-blk"><div class="sc-who ${me ? 'me' : ''}">${me ? 'TE' : esc(dispName(k)).toUpperCase()}</div>
      <div class="sc-m ${me ? 'me' : ''} ${c.saved ? 'saved' : ''}">${c.saved ? '<span class="sv">Mentve a csevegésben</span>' : ''}${esc(c.x)}</div></div>`;
  });
  app.innerHTML = scShell(`<div class="sc-top"><button class="sc-round" id="scBack">←</button>${scAvatar(k)}<h1 style="text-align:left;font-size:16px;flex:1">${esc(dispName(k))} ${f.streak ? '🔥 ' + f.streak : ''}</h1><span class="sc-round">☰</span></div>
    <div class="sc-body sc-chat">${body}</div><div class="sc-compose"><div>Csevegés küldése…</div><span>📷</span></div>`, false);
  $('#scBack').onclick = () => { SC.view = 'chats'; vSC(); };
}

/* ----- Snap Térkép ----- */
function scMap() {
  const places = SNAP_MAP.places.map(pl => `<g transform="translate(${pl.x},${pl.y})"><circle r="30" fill="#dfe7d6" opacity=".8"/><text text-anchor="middle" y="4" font-size="12" fill="#5a6b52" font-weight="700">${esc(pl.name)}</text></g>`).join('');
  const roads = `<path d="M0 300 H640" stroke="#fff" stroke-width="14"/><path d="M300 0 V900" stroke="#fff" stroke-width="14"/><path d="M0 560 H640" stroke="#fff" stroke-width="10"/><path d="M470 0 V900" stroke="#fff" stroke-width="10"/>`;
  const pins = SNAP_MAP.people.map(pm => `<button class="bmj ${pm.me ? 'me' : ''} ${pm.ghost ? 'ghost' : ''}" data-map="${pm.k}" style="left:${pm.x}px;top:${pm.y}px">
      ${bitmoji(pm.me ? 'R' : (pm.code || (who(pm.k) || {}).n[0]), (who(pm.k) || {}).h, pm.ghost)}<span class="nm">${pm.me ? 'Te' : esc(dispName(pm.k))}</span></button>`).join('');
  app.innerHTML = scShell(`<div class="map-wrap"><div class="map-scroll"><div class="map-canvas">
      <svg viewBox="0 0 640 900" preserveAspectRatio="xMidYMid slice"><rect width="640" height="900" fill="#e7efe2"/>${roads}${places}</svg>
      ${pins}</div></div>
    <div class="map-top"><span class="sc-round">←</span><div class="srch">Barát vagy hely keresése</div></div>
    <div class="map-chip">🔥 Barátok</div>
    <div class="map-tray"><h4>Barátok a térképen</h4><div class="tray-row">${SNAP_MAP.people.filter(p => !p.me).map(pm => `<button data-map="${pm.k}">${bitmoji(pm.code || (who(pm.k) || {}).n[0], (who(pm.k) || {}).h, pm.ghost)}${esc(dispName(pm.k))}<small>${esc(pm.ago)}</small></button>`).join('')}</div></div>
    </div>`, true);
  scNavBind();
  $('.map-top .sc-round').onclick = () => { SC.view = 'chats'; vSC(); };
  $$('[data-map]').forEach(b => b.onclick = () => showMapCard(b.dataset.map));
}
function showMapCard(k) {
  const pm = SNAP_MAP.people.find(x => x.k === k); if (!pm) return;
  const ghost = pm.ghost;
  openModal(`<div class="fcard">${bitmoji(pm.code || (who(k) || {}).n[0], (who(k) || {}).h, ghost)}
    <h3>${esc(dispName(k))}</h3><div class="u">@${esc((who(k) || {}).u || k)}</div>
    <div class="loc"><b>Utolsó ismert hely</b>${ghost ? '<span class="ghost">👻 Szellem mód – a helyzet rejtve</span>' : esc(pm.loc)}<br><small style="color:#888">Frissítve: ${esc(pm.ago)}</small></div>
    ${k === 'bence' ? `<div class="loc" style="background:#fff4f4"><b>Nyomozói megjegyzés</b>Bence <b>Szellem módban</b> van, vagyis szándékosan elrejtette a tartózkodási helyét. A csevegésben viszont azt állította, hogy a fenyegetések idején Győrben volt a nagyszüleinél – ezt a térkép nem támasztja alá.</div>` : ''}</div>`);
}

/* =========================================================
   METAADAT-ELEMZÉS
   ========================================================= */
function vAnalyze() {
  app.className = 'v-rz';
  app.innerHTML = `<section class="rz-frame">${backBar('Metaadat-elemzés')}
    <p class="muted">Töltsetek fel egy képet a bizonyítékok közül (mentsétek le a telefonra a névtelen fiók által küldött bulis képek egyikét, majd válasszátok ki). A rendszer kiolvassa a kép rejtett (EXIF) adatait.</p>
    <label class="upload">📷 KÉP KIVÁLASZTÁSA<input type="file" id="file" accept="image/*"></label>
    <img id="prev" class="preview" hidden alt="">
    <div class="terminal" id="term" hidden></div><div id="res"></div></section>`;
  $('#file').onchange = async e => {
    const f = e.target.files[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    const prev = $('#prev'); prev.src = url; prev.hidden = false;
    const term = $('#term'); term.hidden = false; term.style.color = 'var(--rz-ok)'; term.textContent = ''; $('#res').innerHTML = '';
    const match = await matchesParty(url);
    for (const l of ['> Fájl beolvasása…', '> EXIF-blokk keresése…', '> Metaadatok dekódolása…', match ? '> KÉSZ – releváns metaadat található.' : '> KÉSZ.']) { await sleep(500); term.textContent += l + '\n'; }
    if (!match) { $('#res').innerHTML = `<div class="rec-item"><span class="tag" style="color:var(--rz-bad)">NINCS ÜGYHÖZ KAPCSOLÓDÓ ADAT</span><p class="muted" style="margin:8px 0 0">Ez a kép nem szerepel az ügy bizonyítékai között, vagy a metaadatai törlődtek. A névtelen fiók által küldött bulis képet töltsétek fel!</p></div>`; return; }
    $('#res').innerHTML = `<div class="rec-item"><span class="tag">ELEMZÉS KÉSZ</span><div class="meta" style="margin-top:8px">
      <span>Eredeti fájlnév:</span><b>${PARTY_META.fn}</b><span>Forrás:</span><b>nem.felejtek → ${handle('reka')}, Instagram DM</b>
      <span>Létrehozva:</span><b style="color:#ffd34d">${PARTY_META.created}</b><span>Hely (GPS):</span><b style="color:#ffd34d">${PARTY_META.gps}</b>
      <span>Gyártó:</span><b>${PARTY_META.maker}</b><span>Készülék:</span><b style="color:#ffd34d">${PARTY_META.device}</b>
      <span>Szoftver:</span><b>${PARTY_META.sw}</b><span>Felbontás:</span><b>${PARTY_META.res}</b></div>
      <p class="muted" style="margin:10px 0 0">A dátum és a GPS egyezik Laura 2025.06.14-i szülinapi bulijával → a kép a bulin készült. A készülék: <b>iPhone 13</b>.</p></div>`;
    setTimeout(() => { addClue('buli'); setTimeout(() => addClue('keszulek'), 700); }, 600);
  };
}
function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
function sig(img) { const c = document.createElement('canvas'); c.width = c.height = 16; const x = c.getContext('2d'); x.drawImage(img, 0, 0, 16, 16); const d = x.getImageData(0, 0, 16, 16).data, g = []; for (let i = 0; i < d.length; i += 4) g.push(.3 * d[i] + .59 * d[i + 1] + .11 * d[i + 2]); return g; }
async function matchesParty(url) {
  try {
    const A = await loadImg(url), ga = sig(A), ra = A.width / A.height;
    for (const cand of PARTY_IMG) {
      try {
        const B = await loadImg(cand), gb = sig(B), rb = B.width / B.height;
        const diff = ga.reduce((s, v, i) => s + Math.abs(v - gb[i]), 0) / ga.length;
        if (diff < 22 && Math.abs(ra - rb) < .12) return true;
      } catch (e) { return true; }
    }
    return false;
  } catch (e) { return true; }
}

/* =========================================================
   IDŐVONAL + SZOLGÁLTATÓI ADAT
   ========================================================= */
let tlOrder = null;
function vTimeline() {
  app.className = 'v-rz';
  if (S.timelineDone) tlOrder = TIMELINE.map(e => e.id); else if (!tlOrder) tlOrder = [...TL_START];
  const done = S.timelineDone;
  app.innerHTML = `<section class="rz-frame">${backBar('Ügy idővonala')}
    <p class="muted">${done ? 'Az idővonal összeállt.' : 'Tegyétek időrendbe az eseményeket a nyilakkal! A dátumokat a jegyzőkönyvben és az üzenetekben találjátok.'}</p>
    <ol class="tl-list" id="tl">${tlOrder.map(id => { const e = TIMELINE.find(x => x.id === id);
      return `<li class="tl-item ${done ? 'good' : ''}" data-id="${id}"><span class="txt">${done ? `<span class="date">${e.d}</span>` : ''}${esc(e.x)}</span>
      ${done ? '' : '<span class="tl-move"><button data-up aria-label="Feljebb">▲</button><button data-down aria-label="Lejjebb">▼</button></span>'}</li>`; }).join('')}</ol>
    ${done ? '' : '<button class="rz-btn solid" id="tlCheck">SORREND ELLENŐRZÉSE</button>'}
    <div class="tl-res" id="tlRes"></div>
    ${done ? (S.dataRequested ? providerHTML() : '<button class="rz-btn solid" id="req">A NÉVTELEN FIÓK ADATAINAK BEKÉRÉSE</button><div class="terminal" id="term" hidden></div>') : ''}</section>`;
  if (done) {
    const r = $('#req');
    if (r) r.onclick = async () => {
      r.disabled = true; const term = $('#term'); term.hidden = false;
      for (const l of ['> Adatszolgáltatási megkeresés: nem.felejtek', '> Megkeresés továbbítva a szolgáltatónak…', '> Válasz érkezett.']) { await sleep(700); term.textContent += l + '\n'; }
      await sleep(400); S.dataRequested = true; save(); vTimeline(); setTimeout(() => addClue('email'), 1400);
    };
    return;
  }
  const list = $('#tl');
  const sync = () => { tlOrder = $$('.tl-item', list).map(li => li.dataset.id); $('#tlRes').textContent = ''; };
  $$('[data-up]').forEach(b => b.onclick = () => { const li = b.closest('li'); if (li.previousElementSibling) list.insertBefore(li, li.previousElementSibling); sync(); });
  $$('[data-down]').forEach(b => b.onclick = () => { const li = b.closest('li'); if (li.nextElementSibling) list.insertBefore(li.nextElementSibling, li); sync(); });
  $('#tlCheck').onclick = () => {
    const ok = tlOrder.filter((id, i) => id === TIMELINE[i].id).length;
    if (ok === TIMELINE.length) { S.timelineDone = true; save(); vTimeline(); }
    else $('#tlRes').innerHTML = `<span style="color:var(--rz-bad)">${ok}/${TIMELINE.length} esemény van a helyén. Nézzétek meg újra a dátumokat!</span>`;
  };
}
function providerHTML() {
  return `<div class="provider"><h3>Szolgáltatói adatszolgáltatás – Instagram-fiók: nem.felejtek</h3><div class="meta">
    <span>Fiók létrehozása:</span><b>${PROVIDER.created}</b><span>Létrehozó eszköz:</span><b>${PROVIDER.device}</b>
    <span>IP-cím:</span><b>${PROVIDER.ip}</b><span>Kapcsolt e-mail:</span><b style="color:#ffd34d">${PROVIDER.email}</b>
    <span>Kapcsolt telefonszám:</span><b>${PROVIDER.phone}</b><span>Összefüggés:</span><b>${PROVIDER.linked}</b></div>
    <p class="muted" style="margin:10px 0 0">Az e-mail <b>„b” betűvel kezdődik</b> és 7-re végződik. Ugyanarról az iPhone 13-ról egy másik, „b…lf” fiókba is beléptek – ez a zsaroló saját fiókja.</p></div>`;
}

/* =========================================================
   KAPCSOLATI HÁLÓ – személykereső
   ========================================================= */
let RF = { party: '', dev: '', phone: '', email: '' };
function matchParty(p, v) { v = norm(v); if (!v) return true; if (['igen', 'i', ' igen', 'volt', 'yes', '1'].includes(v)) return p.party === true; if (['nem', 'n', 'no', '0'].includes(v)) return p.party === false; return true; }
function matchDev(p, v) { v = norm(v); if (!v) return true; return norm(p.dev) === v; }
function matchPhone(p, v) { const d = digits(v); if (!d) return true; return p.phone4.endsWith(d); }
function matchEmail(p, v) { v = deacc(v.trim()); if (!v) return true; return p.email1 === v[0]; }

function vRegistry() {
  app.className = 'v-rz';
  if (clueCount() < 4) { app.innerHTML = `<section class="rz-frame">${backBar('Kapcsolati háló 🔒')}<p class="muted">Még ${4 - clueCount()} adat hiányzik a zsarolóról.</p></section>`; return; }
  app.innerHTML = `<section class="rz-frame">${backBar('Kapcsolati háló – személykereső')}
    <p class="muted">Írjátok be a profillapra felírt adatokat, majd szűrjetek. A cél, hogy egyetlen személy maradjon.</p>
    <form id="rf"><div class="fgrid">
      <label>Ott volt Laura buliján? (igen/nem)<input data-f="party" value="${esc(RF.party)}" placeholder="igen vagy nem" autocomplete="off"></label>
      <label>Használt telefon<input data-f="dev" value="${esc(RF.dev)}" placeholder="pl. Xiaomi 13" autocomplete="off"></label>
      <label>Telefonszám vége<input data-f="phone" value="${esc(RF.phone)}" inputmode="numeric" placeholder="pl. 12" autocomplete="off"></label>
      <label>E-mail kezdőbetűje<input data-f="email" value="${esc(RF.email)}" placeholder="pl. k" autocomplete="off" maxlength="3"></label></div>
      <button class="rz-btn solid" style="margin-top:4px">SZŰRÉS</button>
      <button type="button" class="rz-btn" id="rfClear" style="width:100%;margin-top:8px">SZŰRŐK TÖRLÉSE</button></form>
    <div class="count" id="cnt"></div><div id="people"></div></section>`;
  $('#rf').onsubmit = e => { e.preventDefault(); $$('[data-f]').forEach(i => RF[i.dataset.f] = i.value); renderPeople(); $('#cnt').scrollIntoView({ behavior: 'smooth' }); };
  $('#rfClear').onclick = () => { RF = { party: '', dev: '', phone: '', email: '' }; vRegistry(); };
  renderPeople();
}
function renderPeople() {
  const res = REGISTRY.filter(p => matchParty(p, RF.party) && matchDev(p, RF.dev) && matchPhone(p, RF.phone) && matchEmail(p, RF.email));
  const active = Object.values(RF).some(v => v.trim());
  $('#cnt').innerHTML = `${active ? 'Találatok' : 'Nyilvántartott személyek'}: <b>${res.length}</b> / ${REGISTRY.length}`;
  const ini = n => n.split(' ').map(w => w[0]).join('');
  $('#people').innerHTML = res.map(p => `<button class="person" data-p="${p.id}"><div class="mug">${ini(p.name)}</div><div class="pd">
    <b>${esc(p.name)}</b><small>Szül.: ${p.born} · ${esc(p.dev)}<br>Buli: ${p.party ? 'ott volt' : 'nem volt ott'} · tel. …${p.phone4.slice(-2)} · e-mail „${p.email1}…”</small>
    <div class="desc">${p.target ? '⚖ gyanúsított' : (p.reka ? esc(p.reka) : 'ismerős')}</div></div></button>`).join('')
    || '<p class="muted">Nincs találat. Ellenőrizzétek a beírt adatokat!</p>';
  $$('[data-p]').forEach(b => b.onclick = () => showPerson(REGISTRY.find(p => p.id === b.dataset.p)));
}
function showPerson(p) {
  const base = `<span>Név:</span><b>${esc(p.name)}</b><span>Született:</span><b>${p.born}</b>
    <span>Ott volt Laura buliján:</span><b>${p.party ? 'igen' : 'nem'}</b><span>Használt telefon:</span><b>${esc(p.dev)}</b>
    <span>Telefonszám vége:</span><b>…${p.phone4.slice(-2)}</b><span>E-mail kezdőbetűje:</span><b>${p.email1}…</b>`;
  if (!p.target) {
    openModal(`<div class="inner"><h2 style="color:var(--rz-accent);margin-top:0">Személyi adatlap – ${p.id}</h2><div class="mug big">${p.name.split(' ').map(w => w[0]).join('')}</div>
      <div class="meta">${base}<span>Kapcsolat Rékával:</span><b>${p.reka ? esc(p.reka) : 'ismerős / iskolatárs'}</b></div></div>`);
    return;
  }
  const first = !S.solved; S.solved = true; save();
  openModal(`<div class="inner"><div class="found">✓ TALÁLAT – AZONOSÍTOTTÁTOK A ZSAROLÓT</div>
    <h2 style="color:var(--rz-accent);margin-top:0">Személyi adatlap – ${p.id}</h2><div class="mug big">FOTÓ</div>
    <div class="meta">${base}<span>Instagram:</span><b>${esc(p.ig)} + nem.felejtek (rejtett)</b><span>Kapcsolat:</span><b>${esc(p.reka)}</b></div>
    <div class="verdict"><h4>Kapcsolódó ügy: ${CASE_NO}</h4>
      <p><b>Elkövető:</b> ${esc(p.name)} (${p.born}), a sértett volt párja.</p>
      <p><b>Ami azonosítja:</b> ${esc(p.extra)}</p>
      <p><b>Bűncselekmények:</b> zsarolás bűntette; személyes adattal visszaélés; hozzájárulás nélkül készített, illetve továbbított szeméremsértő felvétellel való visszaélés. A tett attól, hogy elkövetője maga is kiskorú, bűncselekmény marad.</p>
      <p><b>Miért nem Zsófi:</b> Zsófi valóban írt bántó üzeneteket Rékának, de nem volt ott a bulin, nem róla származnak a képek, és a névtelen fiók az ő eszközéhez nem köthető. Ő legfeljebb figyelmetlen és sértő volt – nem ő a zsaroló.</p>
      <p><b>Jogkövetkezmény:</b> a fiatalkorúak ügyészsége eljárást indított; a bíróság próbára bocsátotta, pártfogó felügyelet és jóvátétel mellett. Az ügy jogerősen lezárult.</p>
      <p><b>Fontos:</b> a bizalmas kép megosztásáért soha nem a sértett a felelős. Segítség: Kék Vonal 116-111; a kép terjedésének megállításához a StopNCII / Take It Down eszköz nyújt támogatást.</p></div></div>`);
  if (first) toast('Gratulálunk, megoldottátok az ügyet!');
}

/* ---------- Indítás ---------- */
const setVh = () => document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
setVh(); window.addEventListener('resize', setVh); window.addEventListener('orientationchange', setVh);
preloadImages();
route();
