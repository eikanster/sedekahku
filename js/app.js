const MASJID=[
  {id:"sgmy001",name:"Masjid Negara",state:"WP Kuala Lumpur",mukim:"Kuala Lumpur",duitnow:"MASJIDNEGARA@PUBLIC",verified:true},
  {id:"sgmy002",name:"Masjid Sultan Salahuddin Abdul Aziz Shah",state:"Selangor",mukim:"Shah Alam",duitnow:"MASJIDSHAHALAM@PUBLIC",verified:true},
  {id:"sgmy003",name:"Masjid Putra",state:"WP Putrajaya",mukim:"Presint 1",duitnow:"MASJIDPUTRA@PUBLIC",verified:true},
  {id:"sgmy004",name:"Masjid Selat Melaka",state:"Melaka",mukim:"Pulau Melaka",duitnow:"MASJIDSELAT@PUBLIC",verified:true}
];

const KEMPEN=[{id:"kmp001",title:"Tabung Pembinaan Masjid Negara",masjidId:"sgmy001",targetAmount:500000,raisedAmount:125000,endDate:"2026-08-31",active:true}];

let lang=localStorage.getItem('sk_lang')||'bm';
let MD=JSON.parse(localStorage.getItem('sk_masjid')||'null')||MASJID;
let KD=JSON.parse(localStorage.getItem('sk_kempen')||'null')||KEMPEN;
let favs=JSON.parse(localStorage.getItem('sk_favs')||'[]');
let hist=JSON.parse(localStorage.getItem('sk_hist')||'[]');
let localMasjid=JSON.parse(localStorage.getItem('sk_local_masjid')||'[]'); // user-scanned collection
let cur=null;
let curK=null;
let scanPending=null; // holds parsed EMVCo data before user confirms

const T={
  bm:{
    hi:'Hari Ini',
    km:'Kempen',
    mi:'Rekod',
    'lbl-hariini':'Masjid Hari Ini',
    'lbl-kempen-title':'Kempen Aktif',
    'lbl-fav-title':'Masjid Disimpan',
    'lbl-hist-title':'Rekod Infaq',
    'lbl-simpan':'Simpan',
    'lbl-kongsi':'Kongsi',
    'lbl-lain':'Cari',
    'lbl-stat1':'Masjid Disimpan',
    'lbl-stat2':'Infaq Dicatat',
    'lbl-hist-infaq':'Infaq Masjid',
    'lbl-hist-kempen':'Infaq Kempen',
    'menu-lbl1':'Rekod',
    'menu-lbl2':'Tetapan',
    'menu-history':'Rekod Infaq',
    'menu-lang':'Tukar Bahasa',
    'menu-export':'Eksport Data',
    bi:'💚 Infaq Sekarang',
    db:'✅ Dah Bayar!',
    qs:'Imbas QR DuitNow untuk infaq',
    ts:'❤️ Disimpan!',
    ta:'Sudah disimpan!',
    tr:'🎉 Infaq dicatat! Semoga diberkati.',
    te:'📋 Data disalin!',
    ef:'Belum ada masjid disimpan',
    efd:'Tekan Simpan pada mana-mana masjid.',
    eh:'Belum ada rekod infaq',
    ehd:'Tekan Dah Bayar selepas infaq.',
    'search-ph':'Cari nama masjid atau lokasi...'
  },
  en:{
    hi:'Today',
    km:'Campaigns',
    mi:'History',
    'lbl-hariini':"Today's Masjid",
    'lbl-kempen-title':'Active Campaigns',
    'lbl-fav-title':'Saved Masjid',
    'lbl-hist-title':'Infaq History',
    'lbl-simpan':'Save',
    'lbl-kongsi':'Share',
    'lbl-lain':'Search',
    'lbl-stat1':'Saved Masjid',
    'lbl-stat2':'Infaq Recorded',
    'lbl-hist-infaq':'Masjid Infaq',
    'lbl-hist-kempen':'Campaign Infaq',
    'menu-lbl1':'Records',
    'menu-lbl2':'Settings',
    'menu-history':'Infaq History',
    'menu-lang':'Switch Language',
    'menu-export':'Export Data',
    bi:'💚 Donate Now',
    db:'✅ Done Paying!',
    qs:'Scan DuitNow QR to donate',
    ts:'❤️ Saved!',
    ta:'Already saved!',
    tr:'🎉 Infaq recorded! May it be blessed.',
    te:'📋 Data copied!',
    ef:'No saved masjid yet',
    efd:'Tap Save on any masjid.',
    eh:'No infaq records yet',
    ehd:'Tap Done Paying after each infaq.',
    'search-ph':'Search masjid name or location...'
  }
};

const t=k=>(T[lang]||T.bm)[k]||k;

function dailyM(){
  const s=new Date().toISOString().slice(0,10).replace(/-/g,'');
  let h=0;
  for(const c of s) h=((h<<5)-h)+c.charCodeAt(0);
  return MD[Math.abs(h)%MD.length];
}

function updHero(){
  if(!cur) return;
  document.getElementById('masjidName').textContent=cur.name;
  document.getElementById('masjidLoc').textContent=cur.mukim+', '+cur.state;
}

function hijri(){
  try{
    return new Date().toLocaleDateString('ms-MY-u-ca-islamic',{day:'numeric',month:'long',year:'numeric'});
  }catch{
    return new Date().toLocaleDateString('ms-MY',{weekday:'long',day:'numeric',month:'long'});
  }
}

function updStats(){
  document.getElementById('sFav').textContent=favs.length;
  document.getElementById('sInfaq').textContent=hist.length;
}

function openQR(){
  if(!cur) return;
  document.getElementById('qrName').textContent=cur.name;
  document.getElementById('qrDN').textContent=cur.duitnow;
  document.getElementById('qrSub').textContent=t('qs');
  document.getElementById('btnDB').textContent=t('db');
  const c=document.getElementById('qrc');
  c.innerHTML='';
  try{
    new QRCode(c,{text:cur.duitnow,width:200,height:200,colorDark:'#093C5D',colorLight:'#fff',correctLevel:QRCode.CorrectLevel.M});
  }catch(e){
    c.innerHTML='<div style="width:200px;height:200px;display:flex;align-items:center;justify-content:center;color:#093C5D;font-size:11px;text-align:center;padding:10px">'+cur.duitnow+'</div>';
  }
  document.getElementById('qrModal').classList.add('open');
}

function closeQR(){
  document.getElementById('qrModal').classList.remove('open');
}

function confirmPay(){
  if(!cur) return;
  const r={
    id:cur.id,
    name:cur.name,
    kName: curK ? curK.title : null,
    type: curK ? 'kempen' : 'masjid',
    loc:cur.mukim+', '+cur.state,
    date:new Date().toISOString(),
    disp:new Date().toLocaleDateString('ms-MY',{day:'numeric',month:'short',year:'numeric'})
  };
  hist.unshift(r);
  localStorage.setItem('sk_hist',JSON.stringify(hist));
  closeQR();
  showToast(t('tr'));
  updStats();
  renderMI();
}

function renderK(){
  const el=document.getElementById('kempenList');
  const active=KD.filter(k=>k.active);
  if(!active.length){
    el.innerHTML='<div class="empty"><div class="eico">📋</div><div class="etit">'+(lang==='bm'?'Tiada kempen aktif':'No active campaigns')+'</div></div>';
    return;
  }
  el.innerHTML=active.map(k=>{
    const p=k.raisedAmount?Math.min(100,Math.round(k.raisedAmount/k.targetAmount*100)):0;
    const dl=Math.ceil((new Date(k.endDate)-new Date())/864e5);
    const m=MD.find(x=>x.id===k.masjidId);
    return `<div class="kcard" data-id="${k.id}">
      <div class="kbadge">AKTIF</div>
      <div class="ktitle">${k.title}</div>
      <div class="kmsj">🕌 ${m?m.name:k.masjidId}</div>
      <div class="pbar"><div class="pfill" style="width:${p}%"></div></div>
      <div class="plbls"><span>${p}% terkumpul</span><span>RM <strong>${(k.targetAmount/1000).toFixed(0)}k</strong></span></div>
      <div class="kdl">⏰ ${dl>0?dl+(lang==='bm'?' hari lagi':' days left'):(lang==='bm'?'Tamat':'Ended')}</div>
    </div>`;
  }).join('');
}

function renderMI(){
  const favList = document.getElementById('favList');
  const histList = document.getElementById('histList');
  const kHistList = document.getElementById('kHistList');
  
  favList.innerHTML = favs.length ? favs.map(f => `
    <div class="fcard" data-id="${f.id}">
      <div class="fico">🕌</div>
      <div class="finfo">
        <div class="fname">${f.name}</div>
        <div class="floc">${f.mukim}, ${f.state}</div>
      </div>
      <button class="btn-rm" onclick="event.stopPropagation(); delFav('${f.id}')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>`).join('') : `<div class="empty"><div class="eico">🕌</div><div class="etit">${t('ef')}</div><div class="edesc">${t('efd')}</div></div>`;
    
  const mHist = hist.filter(h => h.type !== 'kempen');
  const kHist = hist.filter(h => h.type === 'kempen');

  const mapHist = (list) => list.length ? list.map((h) => {
    // find original index for deletion
    const idx = hist.indexOf(h);
    return `
    <div class="hi">
      <div class="hdot"></div>
      <div class="hinfo">
        <div class="hname">${h.kName || h.name}</div>
        <div class="hdate2">${h.disp} ${h.kName ? '• ' + h.name : ''}</div>
      </div>
      <button class="btn-rm" onclick="delHist(${idx})">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>`}).join('') : `<div style="text-align:center;padding:20px 0;color:var(--muted);font-size:13px">${t('eh')}</div>`;

  histList.innerHTML = mapHist(mHist);
  kHistList.innerHTML = mapHist(kHist);
    
  bindCards();
}

function toggleColl(el){
  el.classList.toggle('open');
  el.nextElementSibling.classList.toggle('open');
}

function renderSearch(q=''){
  const el=document.getElementById('searchList');
  if(!el) return;

  // Merge official + user-scanned collection
  const allMasjid = [
    ...MD,
    ...localMasjid.filter(lm => !MD.find(m => m.id === lm.id))
  ];

  const filtered = allMasjid.filter(m => 
    m.name.toLowerCase().includes(q.toLowerCase()) || 
    (m.state||'').toLowerCase().includes(q.toLowerCase()) || 
    (m.mukim||'').toLowerCase().includes(q.toLowerCase())
  );
  
  if(!filtered.length){
    el.innerHTML='<div class="empty"><div class="eico">🔍</div><div class="etit">Tiada hasil</div></div>';
    return;
  }
  
  el.innerHTML = filtered.map(m => `
    <div class="fcard" data-id="${m.id}">
      <div class="fico">${m.verified ? '🕌' : '🔖'}</div>
      <div class="finfo">
        <div class="fname">${m.name}${!m.verified ? ' <span style="font-size:9px;color:#ffc800;font-weight:600;">● LOKAL</span>' : ''}</div>
        <div class="floc">${m.mukim||''}${m.state ? ', '+m.state : ''}</div>
      </div>
      <span style="color:var(--teal);opacity:.6;font-size:20px">›</span>
    </div>`).join('');
  bindCards();
}

function bindCards(){
  document.querySelectorAll('.fcard[data-id], .kcard[data-id]').forEach(el=>{
    el.onclick = () => {
      let m;
      curK = null;
      if(el.classList.contains('kcard')){
        curK = KD.find(x=>x.id===el.dataset.id);
        m = MD.find(x=>x.id===curK.masjidId);
      } else {
        m = MD.find(x=>x.id===el.dataset.id)
          || favs.find(f=>f.id===el.dataset.id)
          || localMasjid.find(l=>l.id===el.dataset.id);
      }
      if(m){ cur=m; openQR(); }
    };
  });
}

function shuffleM(){
  let next;
  do {
    next = MD[Math.floor(Math.random()*MD.length)];
  } while (next.id === cur.id && MD.length > 1);
  cur = next;
  updHero();
  showToast(cur.name);
}

function saveFav(){
  if(!cur) return;
  if(favs.find(f=>f.id===cur.id)){ showToast(t('ta')); return; }
  favs.push(cur);
  localStorage.setItem('sk_favs',JSON.stringify(favs));
  showToast(t('ts'));
  updStats();
  renderMI();
}

function delFav(id){
  favs = favs.filter(f => f.id !== id);
  localStorage.setItem('sk_favs',JSON.stringify(favs));
  updStats();
  renderMI();
}

function delHist(index){
  hist.splice(index, 1);
  localStorage.setItem('sk_hist',JSON.stringify(hist));
  updStats();
  renderMI();
}

function goTab(n){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.ni').forEach(x=>x.classList.remove('active'));
  const target = document.getElementById('screen-'+n);
  if(target) target.classList.add('active');
  const btn = document.getElementById('nav-btn-'+n);
  if(btn) btn.classList.add('active');
  if(n==='myinfaq') renderMI();
  if(n==='search') renderSearch();
}

function toggleMenu(){
  document.getElementById('smenu').classList.toggle('open');
}

function toggleLang(){
  lang=lang==='bm'?'en':'bm';
  localStorage.setItem('sk_lang',lang);
  applyLang();
}

function applyLang(){
  ['lbl-hariini','lbl-kempen-title','lbl-fav-title','lbl-hist-title','lbl-simpan','lbl-kongsi','lbl-lain','lbl-stat1','lbl-stat2','menu-lbl1','menu-lbl2','menu-history','menu-lang','menu-export','lbl-hist-infaq','lbl-hist-kempen'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.textContent=t(id);
  });
  const btnInfaq = document.getElementById('btnInfaq');
  if(btnInfaq && btnInfaq.childNodes[0]) btnInfaq.childNodes[0].textContent=t('bi');
  document.getElementById('langBtn').textContent=lang==='bm'?'EN':'BM';
  document.getElementById('nav-hariini').textContent=t('hi');
  document.getElementById('nav-kempen').textContent=t('km');
  document.getElementById('nav-myinfaq').textContent=t('mi');
  const sInput = document.getElementById('searchInput');
  if(sInput) sInput.placeholder = t('search-ph');
  renderK();
}

function shareM(){
  if(!cur) return;
  const tx='🕌 Jom infaq ke '+cur.name+'!\nDuitNow: '+cur.duitnow+'\n\nhttps://eikanster.github.io/sedekahku';
  if(navigator.share) navigator.share({title:'SedekahKu',text:tx});
  else navigator.clipboard.writeText(tx).then(()=>showToast('📋 Disalin!'));
}

function exportD(){
  navigator.clipboard.writeText(JSON.stringify({favs,hist,exported:new Date().toISOString()},null,2)).then(()=>showToast(t('te'))).catch(()=>showToast('Gagal'));
}

function showToast(msg){
  const el=document.getElementById('toast');
  el.textContent=msg;
  el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),2800);
}

async function refreshData(){
  try{
    const mf=await fetch('data/version.json?nc='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    if(!mf) return;
    const ver=JSON.parse(localStorage.getItem('sk_ver')||'{}');
    if(mf.files.masjid!==ver.masjid){
      const d=await fetch('data/masjid.json?v='+mf.files.masjid).then(r=>r.ok?r.json():null).catch(()=>null);
      if(d&&d.length){ MD=d; localStorage.setItem('sk_masjid',JSON.stringify(d)); cur=dailyM(); updHero(); }
    }
    if(mf.files.kempen!==ver.kempen){
      const d=await fetch('data/kempen.json?v='+mf.files.kempen).then(r=>r.ok?r.json():null).catch(()=>null);
      if(d&&d.length){ KD=d; localStorage.setItem('sk_kempen',JSON.stringify(d)); renderK(); }
    }
    localStorage.setItem('sk_ver',JSON.stringify(mf.files));
  }catch(e){}
}

// ── EMVCo QR Parser ─────────────────────────────────────────────
function parseEMVCo(raw) {
  const result = {};
  let i = 0;
  try {
    while (i < raw.length) {
      const tag = raw.substring(i, i+2);
      const len = parseInt(raw.substring(i+2, i+4), 10);
      const val = raw.substring(i+4, i+4+len);
      result[tag] = val;
      i += 4 + len;
    }
  } catch(e) {}
  return result;
}

function processScannedQR(rawString) {
  const parsed = parseEMVCo(rawString);
  const name = parsed['59'] || '';
  const city = parsed['60'] || '';
  const postal = parsed['61'] || '';
  const country = parsed['58'] || 'MY';

  if (!name) {
    showToast('QR tidak dikenali sebagai DuitNow');
    return;
  }

  scanPending = {
    id: 'local_' + Date.now(),
    name: name,
    state: city,
    mukim: city,
    postal: postal,
    country: country,
    duitnow: rawString, // store full EMVCo string for QR regeneration
    verified: false,
    verifiedSource: 'user-scan',
    scannedAt: new Date().toISOString()
  };

  closeScan();

  // Show confirm sheet
  document.getElementById('addName').textContent = name;
  document.getElementById('addCity').textContent = city + (postal ? ', ' + postal : '');
  document.getElementById('addProxy').textContent = rawString.length > 60 ? rawString.substring(0, 60) + '...' : rawString;
  document.getElementById('addMasjidModal').classList.add('open');
}

// ── Scanner Controls ─────────────────────────────────────────────
let html5Scanner = null;

function openScan() {
  document.getElementById('scanModal').classList.add('open');
  try {
    html5Scanner = new Html5Qrcode('qr-reader');
    html5Scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => { processScannedQR(decodedText); },
      () => {}
    ).catch(() => showToast('Kamera tidak dapat diakses'));
  } catch(e) {
    showToast('Scanner tidak tersedia');
  }
}

function closeScan() {
  document.getElementById('scanModal').classList.remove('open');
  if (html5Scanner) {
    html5Scanner.stop().catch(()=>{});
    html5Scanner = null;
  }
}

// ── Confirm Add Scanned Masjid ────────────────────────────────────
function confirmAddMasjid() {
  if (!scanPending) return;
  // Add to local collection
  const exists = localMasjid.find(m => m.name === scanPending.name);
  if (exists) {
    showToast('Sudah disimpan!');
  } else {
    localMasjid.push(scanPending);
    localStorage.setItem('sk_local_masjid', JSON.stringify(localMasjid));
    // Also add to favs so user can donate immediately
    if (!favs.find(f => f.id === scanPending.id)) {
      favs.push(scanPending);
      localStorage.setItem('sk_favs', JSON.stringify(favs));
    }
    updStats();
    renderMI();
    showToast('✅ ' + scanPending.name + ' disimpan!');
  }
  scanPending = null;
  document.getElementById('addMasjidModal').classList.remove('open');
}

function submitToAdmin() {
  if (!scanPending) return;
  const data = scanPending;
  const msg = encodeURIComponent(
    '🕌 *Cadangan Masjid Baru*\n\n' +
    '*Nama:* ' + data.name + '\n' +
    '*Lokasi:* ' + data.mukim + ', ' + data.postal + '\n' +
    '*QR String:* ' + data.duitnow + '\n' +
    '*Masa Imbas:* ' + new Date(data.scannedAt).toLocaleString('ms-MY') + '\n\n' +
    'Sila sahkan dan tambah ke dalam direktori SedekahKu.'
  );
  // Submit via WhatsApp to admin — update number as needed
  window.open('https://wa.me/60123456789?text=' + msg, '_blank');
  // Also save locally
  confirmAddMasjid();
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btnShuffle').onclick = shuffleM;
  document.getElementById('btnInfaq').onclick = openQR;
  document.getElementById('btnSimpan').onclick = saveFav;
  document.getElementById('btnKongsi').onclick = shareM;
  document.getElementById('btnLain').onclick = () => goTab('search');
  document.getElementById('btnDB').onclick = confirmPay;
  document.getElementById('langBtn').onclick = toggleLang;
  document.getElementById('menuBtn').onclick = toggleMenu;
  document.getElementById('menuOverlay').onclick = toggleMenu;
  document.getElementById('menuGoHistory').onclick = () => { goTab('myinfaq'); toggleMenu(); };
  document.getElementById('menuLang').onclick = () => { toggleLang(); toggleMenu(); };
  document.getElementById('menuExport').onclick = () => { exportD(); toggleMenu(); };
  document.getElementById('nav-btn-hariini').onclick = () => goTab('hariini');
  document.getElementById('nav-btn-kempen').onclick = () => goTab('kempen');
  document.getElementById('nav-btn-myinfaq').onclick = () => goTab('myinfaq');
  
  document.getElementById('btnScan').onclick = openScan;
  document.getElementById('btnCancelScan').onclick = closeScan;
  document.getElementById('btnConfirmAdd').onclick = confirmAddMasjid;
  document.getElementById('btnSubmitAdmin').onclick = submitToAdmin;
  document.getElementById('btnCancelAdd').onclick = () => {
    scanPending = null;
    document.getElementById('addMasjidModal').classList.remove('open');
  };

  const sInput = document.getElementById('searchInput');
  if(sInput) sInput.oninput = (e) => renderSearch(e.target.value);

  document.getElementById('qrModal').onclick = function(e){ if(e.target===this) closeQR(); };

  // Init
  document.getElementById('hijriDate').textContent = hijri();
  cur = dailyM();
  updHero();
  updStats();
  applyLang();
  renderMI();
  refreshData();
  
  if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});

  // ── Firefly Spawner ──
  (function spawnFireflies() {
    const count = 12;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      const size = Math.random() * 2 + 1;
      const duration = (Math.random() * 10 + 10).toFixed(1) + 's';
      const delay = (Math.random() * 15).toFixed(1) + 's';
      dot.style.cssText = `
        position: fixed;
        width: ${size}px; height: ${size}px;
        left: ${Math.random() * 100}vw; top: ${Math.random() * 100}vh;
        border-radius: 50%;
        background: rgba(93, 248, 216, 0.6);
        box-shadow: 0 0 ${size*3}px ${size}px rgba(93, 248, 216, 0.3);
        pointer-events: none; z-index: 1;
        animation: firefly-drift ${duration} ${delay} ease-in-out infinite;
        will-change: transform, opacity;
      `;
      document.body.appendChild(dot);
    }
  })();

  // ── Shooting Star Spawner ──
  function spawnShootingStar() {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.top = (Math.random() * 50) + 'vh';
    star.style.left = (Math.random() * 80 + 10) + 'vw';
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 1500);
    setTimeout(spawnShootingStar, Math.random() * 15000 + 8000);
  }
  setTimeout(spawnShootingStar, 5000);
});

