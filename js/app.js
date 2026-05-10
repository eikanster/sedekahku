const MASJID=[
  {id:"sgmy001",name:"Masjid Negara",type:"masjid",address:null,daerah:"Kuala Lumpur",state:"WP Kuala Lumpur",postcode:null,lat:null,lng:null,google_maps_url:null,image_url:null,status:"verified",verified_by:"admin",verified_at:"2026-05-06T00:00:00Z",infaq_count:0,featured_dates:[],ramadan_priority:false,created_at:"2026-05-06T00:00:00Z",updated_at:"2026-05-06T00:00:00Z"},
  {id:"sgmy002",name:"Masjid Sultan Salahuddin Abdul Aziz Shah",type:"masjid",address:null,daerah:"Shah Alam",state:"Selangor",postcode:null,lat:null,lng:null,google_maps_url:null,image_url:null,status:"verified",verified_by:"admin",verified_at:"2026-05-06T00:00:00Z",infaq_count:0,featured_dates:[],ramadan_priority:false,created_at:"2026-05-06T00:00:00Z",updated_at:"2026-05-06T00:00:00Z"},
  {id:"sgmy003",name:"Masjid Putra",type:"masjid",address:null,daerah:"Presint 1",state:"WP Putrajaya",postcode:null,lat:null,lng:null,google_maps_url:null,image_url:null,status:"verified",verified_by:"admin",verified_at:"2026-05-06T00:00:00Z",infaq_count:0,featured_dates:[],ramadan_priority:false,created_at:"2026-05-06T00:00:00Z",updated_at:"2026-05-06T00:00:00Z"},
  {id:"sgmy004",name:"Masjid Selat Melaka",type:"masjid",address:null,daerah:"Pulau Melaka",state:"Melaka",postcode:null,lat:null,lng:null,google_maps_url:null,image_url:null,status:"verified",verified_by:"admin",verified_at:"2026-05-06T00:00:00Z",infaq_count:0,featured_dates:[],ramadan_priority:false,created_at:"2026-05-06T00:00:00Z",updated_at:"2026-05-06T00:00:00Z"}
];

const QR_DEFAULT=[
  {id:"qr-sgmy001",masjid_id:"sgmy001",duitnow_string:"MASJIDNEGARA@PUBLIC",merchant_id:null,account_name:"MASJID NEGARA",account_number:null,bank_name:null,qr_type:"static",qr_image_url:null,is_primary:true,type:"general",status:"active",submitted_by_email:null,submitted_by_phone:null,created_at:"2026-05-06T00:00:00Z"},
  {id:"qr-sgmy002",masjid_id:"sgmy002",duitnow_string:"MASJIDSHAHALAM@PUBLIC",merchant_id:null,account_name:"MASJID SULTAN SALAHUDDIN ABDUL AZIZ SHAH",account_number:null,bank_name:null,qr_type:"static",qr_image_url:null,is_primary:true,type:"general",status:"active",submitted_by_email:null,submitted_by_phone:null,created_at:"2026-05-06T00:00:00Z"},
  {id:"qr-sgmy003",masjid_id:"sgmy003",duitnow_string:"MASJIDPUTRA@PUBLIC",merchant_id:null,account_name:"MASJID PUTRA",account_number:null,bank_name:null,qr_type:"static",qr_image_url:null,is_primary:true,type:"general",status:"active",submitted_by_email:null,submitted_by_phone:null,created_at:"2026-05-06T00:00:00Z"},
  {id:"qr-sgmy004",masjid_id:"sgmy004",duitnow_string:"MASJIDSELAT@PUBLIC",merchant_id:null,account_name:"MASJID SELAT MELAKA",account_number:null,bank_name:null,qr_type:"static",qr_image_url:null,is_primary:true,type:"general",status:"active",submitted_by_email:null,submitted_by_phone:null,created_at:"2026-05-06T00:00:00Z"}
];

const KEMPEN=[{id:"kmp001",masjid_id:"sgmy001",title:"Tabung Pembinaan Masjid Negara",category:"renovation",description:"Kempen pengubahsuaian dan naik taraf Masjid Negara",target_amount:500000,collected_amount:125000,deadline:"2026-08-31",is_urgent:false,status:"active",qr_code_id:"qr-sgmy001",created_at:"2026-05-06T00:00:00Z",updated_at:"2026-05-06T00:00:00Z"}];
let HIKMAH = [];

let lang=localStorage.getItem('sk_lang')||'bm';
let MD=JSON.parse(localStorage.getItem('sk_masjid')||'null')||MASJID;
let QR=JSON.parse(localStorage.getItem('sk_qr')||'null')||QR_DEFAULT;
let KD=JSON.parse(localStorage.getItem('sk_kempen')||'null')||KEMPEN;
let favs=JSON.parse(localStorage.getItem('sk_favs')||'[]');
let hist=JSON.parse(localStorage.getItem('sk_hist')||'[]');
let localMasjid=JSON.parse(localStorage.getItem('sk_local_masjid')||'[]');
let localQr=JSON.parse(localStorage.getItem('sk_local_qr')||'[]');
let profile=JSON.parse(localStorage.getItem('sk_profile')||'{"name":"","phone":""}');
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installBtn = document.getElementById('menuInstall');
  if(installBtn) installBtn.style.display = 'flex';
});
let cur=null;
let curK=null;
let scanPending=null;
const SUBMIT_URL='https://script.google.com/macros/s/AKfycbzJzDkn8_tynoOG9La0RKApF9mWlkkO_Bp0f830xlkoXn0x7_qpC_Jzn2ISnNV-3FqA/exec';
const KOPI_URL='https://toyyibpay.com/Belanja-Kopi-QRSedakah';

const T={
  bm:{
    hi:'Hari Ini',
    km:'Kempen',
    mi:'Rekod',
    'lbl-hariini':'Masjid Hari Ini',
    'lbl-kempen-title':'Kempen Aktif',
    'lbl-fav-title':'❤️ Masjid Kegemaran',
    'lbl-hist-title':'Rekod Infaq',
    'lbl-simpan':'Simpan',
    'lbl-kongsi':'Kongsi',
    'lbl-lain':'Cari',
    'lbl-stat1':'Masjid Disimpan',
    'lbl-stat2':'Infaq Dicatat',
    'lbl-hist-infaq':'Sejarah Infaq Masjid',
    'lbl-hist-kempen':'Sejarah Infaq Kempen',
    'menu-lbl1':'Rekod',
    'menu-lbl2':'Tetapan',
    'menu-history':'Rekod Infaq',
    'menu-lang':'Tukar Bahasa',
    'menu-export':'Sumbang Data QR',
    'menu-install':'Muat Turun App',
    bi:'💚 Infaq Sekarang',
    db:'✨ Alhamdulillah dah Sedekah!',
    qs:'Imbas QR DuitNow untuk infaq',
    ts:'❤️ Disimpan!',
    ta:'Sudah disimpan!',
    tr:'🎉 Infaq dicatat! Semoga diberkati.',
    te:'📋 Data disalin!',
    ef:'Belum ada masjid disimpan',
    efd:'Tekan Simpan pada mana-mana masjid.',
    eh:'Belum ada rekod infaq',
    ehd:'Tekan Alhamdulillah dah Sedekah! selepas infaq.',
    'menu-refresh':'Kemaskini Data',
    'menu-kopi':'Belanja Kopi ☕',
    'lbl-scan':'Imbas QR Masjid / Surau',
    'lbl-sync-comm':'Kongsi Koleksi ke Komuniti',
    'search-ph':'Cari nama masjid atau lokasi...'
  },
  en:{
    hi:'Today',
    km:'Campaigns',
    mi:'History',
    'lbl-hariini':"Today's Masjid",
    'lbl-kempen-title':'Active Campaigns',
    'lbl-fav-title':'❤️ Fav Masjid',
    'lbl-hist-title':'Infaq History',
    'lbl-simpan':'Save',
    'lbl-kongsi':'Share',
    'lbl-lain':'Search',
    'lbl-stat1':'Saved Masjid',
    'lbl-stat2':'Infaq Recorded',
    'lbl-hist-infaq':'Masjid Infaq History',
    'lbl-hist-kempen':'Campaign Infaq History',
    'menu-lbl1':'Records',
    'menu-lbl2':'Settings',
    'menu-history':'Infaq History',
    'menu-lang':'Switch Language',
    'menu-export':'Submit QR Data',
    'menu-install':'Install App',
    bi:'💚 Donate Now',
    db:'✨ Alhamdulillah, I have Donated!',
    qs:'Scan DuitNow QR to donate',
    ts:'❤️ Saved!',
    ta:'Already saved!',
    tr:'🎉 Infaq recorded! May it be blessed.',
    te:'📋 Data copied!',
    ef:'No saved masjid yet',
    efd:'Tap Save on any masjid.',
    eh:'No infaq records yet',
    ehd:'Tap Alhamdulillah after each infaq.',
    'menu-refresh':'Refresh Data',
    'menu-kopi':'Buy Me a Coffee ☕',
    'lbl-scan':'Scan Masjid / Surau QR',
    'lbl-sync-comm':'Share My Collection',
    'search-ph':'Search masjid name or location...'
  }
};

const t=k=>(T[lang]||T.bm)[k]||k;

function getQR(masjidId){
  return [...QR,...localQr].find(q=>q.masjid_id===masjidId&&q.is_primary)||null;
}

function dailyM(){
  const s=new Date().toISOString().slice(0,10).replace(/-/g,'');
  let h=0;
  for(const c of s) h=((h<<5)-h)+c.charCodeAt(0);
  return MD[Math.abs(h)%MD.length];
}

function updHero(){
  if(!cur) return;
  document.getElementById('masjidName').textContent=cur.name;
  document.getElementById('masjidLoc').textContent=(cur.daerah||'')+', '+cur.state;
}

function hijri(){
  try{
    return new Date().toLocaleDateString('ms-MY-u-ca-islamic',{day:'numeric',month:'long',year:'numeric'});
  }catch{
    return new Date().toLocaleDateString('ms-MY',{weekday:'long',day:'numeric',month:'long'});
  }
}

function getHijriMonth(){
  try{
    return parseInt(new Intl.DateTimeFormat('en-u-ca-islamic', {month: 'numeric'}).format(new Date()));
  }catch{
    return 0;
  }
}

function renderSeasonBanner(){
  const el = document.getElementById('seasonBanner');
  if(!el) return;
  const month = getHijriMonth();
  const bm = lang === 'bm';
  
  // Internal fallback if HIKMAH not loaded yet
  if(!HIKMAH || !HIKMAH.length){
    el.innerHTML = `
      <div class="season-banner season-default">
        <div class="season-icon">🕌</div>
        <div>
          <div class="season-title" style="font-size:12px;opacity:0.8;margin-bottom:2px;">${bm?'Kata-kata Hikmah':'Daily Wisdom'}</div>
          <div class="season-msg" style="font-weight:600;margin-bottom:2px;">${bm ? 'Sedekah itu tidak mengurangkan harta.' : 'Charity does not decrease wealth.'}</div>
          <div class="season-msg" style="font-size:10px;opacity:0.6;">— HR Muslim</div>
        </div>
      </div>`;
    return;
  }
  
  // 1. Filter pool: specific month + generic (0)
  let pool = HIKMAH.filter(h => h.month === month);
  if(pool.length === 0) pool = HIKMAH.filter(h => h.month === 0);

  // 2. Daily rotation based on day of year
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const doy = Math.floor((now - start) / 864e5);
  const quote = pool[doy % pool.length];

  const monthThemes = {
    1: 'season-muharram', 3: 'season-maulid', 7: 'season-rejab', 
    8: 'season-syaaban', 9: 'season-ramadan', 10: 'season-syawal', 12: 'season-zulhijjah'
  };

  const theme = monthThemes[month] || 'season-default';
  const icon = quote.id.startsWith('ram') ? '🌙' : (quote.id.startsWith('zul') ? '🐄' : '🕌');

  el.innerHTML = `
    <div class="season-banner ${theme}">
      <div class="season-icon">${icon}</div>
      <div>
        <div class="season-title" style="font-size:12px;opacity:0.8;margin-bottom:2px;">${bm?'Kata-kata Hikmah':'Daily Wisdom'}</div>
        <div class="season-msg" style="font-family:'Amiri',serif;font-size:15px;margin-bottom:5px;font-style:italic;">"${quote.arabic}"</div>
        <div class="season-msg" style="font-weight:600;margin-bottom:2px;">${bm ? quote.bm : quote.en}</div>
        <div class="season-msg" style="font-size:10px;opacity:0.6;">— ${quote.source}</div>
      </div>
    </div>`;
}

function animateCounter(el, target){
  if(!el) return;
  const duration = 600;
  const start = performance.now();
  const startVal = parseInt(el.textContent)||0;
  function step(now){
    const elapsed = now - start;
    const progress = Math.min(elapsed/duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(startVal + (target - startVal) * ease);
    if(progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function updateLevelRing(){
  const scans = localMasjid.length;
  const infaqs = hist.length;
  const total = scans + infaqs;
  const maxLevel = 20;
  const progress = Math.min(total / maxLevel, 1);
  const circumference = 2 * Math.PI * 34;
  const offset = circumference * (1 - progress);
  const ring = document.getElementById('levelRingFill');
  if(ring) setTimeout(()=>ring.style.strokeDashoffset = offset, 100);
  
  const levelEl = document.getElementById('profileLevel');
  const emoji = document.querySelector('.level-ring-emoji');
  if(total === 0){ if(levelEl) levelEl.textContent='Level: Pemula'; if(emoji) emoji.textContent='🌱'; }
  else if(total < 5){ if(levelEl) levelEl.textContent='Level: Penggerak'; if(emoji) emoji.textContent='🕌'; }
  else if(total < 10){ if(levelEl) levelEl.textContent='Level: Contributor'; if(emoji) emoji.textContent='⭐'; }
  else if(total < 20){ if(levelEl) levelEl.textContent='Level: Penggerak Komuniti'; if(emoji) emoji.textContent='🏆'; }
  else { if(levelEl) levelEl.textContent='Level: QR Master'; if(emoji) emoji.textContent='💎'; }
}

function addRipple(e, el){
  const r = document.createElement('span');
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  r.className = 'ripple';
  r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
  el.appendChild(r);
  setTimeout(()=>r.remove(), 700);
}

function updStats(){
  animateCounter(document.getElementById('sFav'), favs.length);
  animateCounter(document.getElementById('sInfaq'), hist.length);
  const syncBtn = document.getElementById('btnSync');
  if(syncBtn) syncBtn.style.display = localMasjid.length > 0 ? 'flex' : 'none';
}

function openQR(){
  if(!cur) return;
  let qr;
  if(curK && curK.qr_code_id){
    qr = [...QR, ...localQr].find(q => q.id === curK.qr_code_id);
  }
  if(!qr) qr = getQR(cur.id);

  const duitnowStr=qr?qr.duitnow_string:'';
  
  document.getElementById('qrName').textContent = curK ? curK.title : cur.name;
  document.getElementById('qrBadge').innerHTML = statusBadge(cur.status);
  document.getElementById('qrSub').textContent = curK ? '🕌 ' + cur.name : t('qs');
  document.getElementById('qrDN').textContent=duitnowStr;
  document.getElementById('btnDB').textContent=t('db');
  const c=document.getElementById('qrc');
  c.innerHTML='';
  if(duitnowStr){
    try{
      new QRCode(c,{text:duitnowStr,width:200,height:200,colorDark:'#093C5D',colorLight:'#fff',correctLevel:QRCode.CorrectLevel.M});
    }catch(e){
      c.innerHTML='<div style="width:200px;height:200px;display:flex;align-items:center;justify-content:center;color:#093C5D;font-size:11px;text-align:center;padding:10px">'+duitnowStr+'</div>';
    }
  }
  updFavBtn();
  const btnDel=document.getElementById('btnDeleteRecord');
  if(btnDel){
    const isLocal=cur.id.startsWith('local_');
    btnDel.style.display=isLocal?'block':'none';
    btnDel.textContent=lang==='bm'?'🗑️ Padam Rekod Ini':'🗑️ Delete This Record';
  }
  document.getElementById('qrModal').classList.add('open');
}

function clearLoc(){
  if(scanPending){
    scanPending.masjid.lat = null;
    scanPending.masjid.lng = null;
    const locBadge = document.getElementById('locBadge');
    if(locBadge){
      locBadge.textContent = '❌ Lokasi dipadam';
      locBadge.style.background = 'rgba(255,255,255,0.05)';
    }
  }
}

function closeQR(){
  document.getElementById('qrModal').classList.remove('open');
}

function updFavBtn(){
  const btn=document.getElementById('btnFavToggle');
  if(!btn||!cur) return;
  const isFav=!!favs.find(f=>f.id===cur.id);
  btn.textContent=isFav?'💔 Buang dari Kegemaran':'❤️ Simpan sebagai Kegemaran';
  btn.style.color=isFav?'#ff4d4d':'var(--teal)';
  btn.style.borderColor=isFav?'rgba(255,77,77,.3)':'var(--border)';
}

function toggleFav(){
  if(!cur) return;
  const idx=favs.findIndex(f=>f.id===cur.id);
  if(idx>=0){
    favs.splice(idx,1);
    showToast('Dibuang dari kegemaran');
  }else{
    favs.push(cur);
    showToast('❤️ Disimpan sebagai kegemaran!');
  }
  localStorage.setItem('sk_favs',JSON.stringify(favs));
  updStats();
  renderMI();
  updFavBtn();
}

function confirmPay(){
  if(!cur) return;
  const r={
    id:cur.id,
    name:cur.name,
    kName:curK?curK.title:null,
    type:curK?'kempen':'masjid',
    loc:(cur.daerah||'')+', '+cur.state,
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
  const titleEl=document.getElementById('lbl-kempen-title');
  if(!el || !cur) return;

  let active = KD.filter(k=>k.status==='active');
  let currentMasjidKempen = active.filter(k=>k.masjid_id === cur.id);
  
  let listToShow = currentMasjidKempen;
  let isOther = false;

  if(currentMasjidKempen.length > 0){
    if(titleEl) titleEl.textContent = lang==='bm'?'Kempen Masjid Ini':'Campaigns for this Masjid';
  } else {
    listToShow = active;
    isOther = true;
    if(titleEl) titleEl.textContent = lang==='bm'?'Kempen Pilihan':'Featured Campaigns';
  }

  if(!listToShow.length){
    el.innerHTML='<div class="empty"><div class="eico">📋</div><div class="etit">'+(lang==='bm'?'Tiada kempen aktif':'No active campaigns')+'</div></div>';
    return;
  }

  el.innerHTML=listToShow.map(k=>{
    const p=k.collected_amount?Math.min(100,Math.round(k.collected_amount/k.target_amount*100)):0;
    const dl=Math.ceil((new Date(k.deadline)-new Date())/864e5);
    const m=MD.find(x=>x.id===k.masjid_id);
    return `<div class="kcard" data-id="${k.id}">
      <div class="kbadge">${isOther && m ? m.name : 'AKTIF'}</div>
      <div class="ktitle">${k.title}</div>
      <div class="pbar"><div class="pfill" data-fill="${p}"></div></div>
      <div class="plbls"><span>${p}% terkumpul</span><span>RM <strong>${(k.target_amount/1000).toFixed(0)}k</strong></span></div>
      <div class="kdl">⏰ ${dl>0?dl+(lang==='bm'?' hari lagi':' days left'):(lang==='bm'?'Tamat':'Ended')}</div>
    </div>`;
  }).join('');
  bindCards();
  // Animate progress bars after render
  setTimeout(()=>{
    document.querySelectorAll('.pfill[data-fill]').forEach(bar=>{
      bar.style.width = bar.dataset.fill + '%';
    });
  }, 50);
}

function renderMI(){
  const histList=document.getElementById('histList');
  const kHistList=document.getElementById('kHistList');
  const pFavList=document.getElementById('profileFavList');
  const pLocalList=document.getElementById('profileLocalList');
  updStats();

  const favHTML = favs.length?favs.map(f=>`
    <div class="fcard" data-id="${f.id}">
      <div class="fico">${(f.status==='verified'||f.status==='community')?'🕌':'🔖'}</div>
      <div class="finfo">
        <div class="fname">${f.name}</div>
        <div class="floc">${f.daerah||f.mukim||''}, ${f.state}</div>
        <div style="margin-top:5px;">${statusBadge(f.status)}</div>
      </div>
      <button class="btn-rm" onclick="event.stopPropagation(); delFav('${f.id}')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>`).join(''):`<div class="empty"><div class="eico">🕌</div><div class="etit">${t('ef')}</div><div class="edesc">${t('efd')}</div></div>`;

  if(pFavList) pFavList.innerHTML = favHTML;

  // Update profile stats with animation
  renderProfileHeader();
  animateCounter(document.getElementById('profileScanCount'), localMasjid.length);
  animateCounter(document.getElementById('profileInfaqCount'), hist.length);
  animateCounter(document.getElementById('profileFavCount'), favs.length);
  updateLevelRing();

  const localHTML = localMasjid.length?localMasjid.map(m=>`
    <div class="fcard" data-id="${m.id}">
      <div class="fico">🔖</div>
      <div class="finfo">
        <div class="fname">${m.name} <span style="font-size:9px;color:#ffc800;font-weight:600;">● LOKAL</span></div>
        <div class="floc">${m.daerah||''}, ${m.state}</div>
      </div>
      <span style="color:var(--teal);opacity:.6;font-size:20px">›</span>
    </div>`).join(''):`<div style="text-align:center;padding:20px;color:var(--muted);font-size:13px;">Belum ada imbasan tempatan.</div>`;
  
  if(pLocalList) pLocalList.innerHTML = localHTML;

  const mHist=hist.filter(h=>h.type!=='kempen');
  const kHist=hist.filter(h=>h.type==='kempen');

  const mapHist=(list)=>list.map((h)=>{
    const idx=hist.indexOf(h);
    return `
    <div class="hi">
      <div class="hdot"></div>
      <div class="hinfo">
        <div class="hname">${h.kName||h.name}</div>
        <div class="hdate2">${h.disp} ${h.kName?'• '+h.name:''}</div>
      </div>
      <button class="btn-rm" onclick="event.stopPropagation(); delHist(${idx})">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>`}).join('');

  const mHTML = mapHist(mHist);
  const kHTML = mapHist(kHist);
  
  const fHist = document.getElementById('fullHistList');
  if(fHist){
    if(!mHist.length && !kHist.length){
      fHist.innerHTML = `<div style="text-align:center;padding:20px 0;color:var(--muted);font-size:13px">${t('eh')}</div>`;
    } else {
      fHist.innerHTML = `<div id="histList">${mHTML}</div><div id="kHistList">${kHTML}</div>`;
    }
  }

  bindCards();
}

function toggleColl(el){
  el.classList.toggle('open');
  el.nextElementSibling.classList.toggle('open');
}

function renderSearch(q=''){
  const el=document.getElementById('searchList');
  if(!el) return;

  const allMasjid=[
    ...MD,
    ...localMasjid.filter(lm=>!MD.find(m=>m.id===lm.id))
  ];

  const filtered=allMasjid.filter(m=>
    m.name.toLowerCase().includes(q.toLowerCase())||
    (m.state||'').toLowerCase().includes(q.toLowerCase())||
    (m.daerah||'').toLowerCase().includes(q.toLowerCase())
  );

  if(!filtered.length){
    el.innerHTML='<div class="empty"><div class="eico">🔍</div><div class="etit">Tiada hasil</div></div>';
    return;
  }

  el.innerHTML=filtered.map(m=>`
    <div class="fcard" data-id="${m.id}">
      <div class="fico">${(m.status==='verified'||m.status==='community')?'🕌':'🔖'}</div>
      <div class="finfo">
        <div class="fname">${m.name}</div>
        <div class="floc">${m.daerah||''}${m.state?', '+m.state:''}</div>
        <div style="margin-top:5px;">${statusBadge(m.status)}</div>
      </div>
      <span style="color:var(--teal);opacity:.6;font-size:20px">›</span>
    </div>`).join('');
  bindCards();
}

function bindCards(){
  document.querySelectorAll('.fcard[data-id], .kcard[data-id]').forEach(el=>{
    el.onclick=()=>{
      let m;
      curK=null;
      if(el.classList.contains('kcard')){
        curK=KD.find(x=>x.id===el.dataset.id);
        m=MD.find(x=>x.id===curK.masjid_id);
      }else{
        m=MD.find(x=>x.id===el.dataset.id)
          ||favs.find(f=>f.id===el.dataset.id)
          ||localMasjid.find(l=>l.id===el.dataset.id);
      }
      if(m){cur=m;openQR();}
    };
  });
}

function shuffleM(){
  let next;
  do{
    next=MD[Math.floor(Math.random()*MD.length)];
  }while(next.id===cur.id&&MD.length>1);
  cur=next;
  updHero();
  renderK();
}

function saveFav(){
  if(!cur) return;
  if(favs.find(f=>f.id===cur.id)){showToast(t('ta'));return;}
  favs.push(cur);
  localStorage.setItem('sk_favs',JSON.stringify(favs));
  showToast(t('ts'));
  updStats();
  renderMI();
}

let _confirmCb=null;
function showConfirm(msg,sub,onYes){
  _confirmCb=onYes;
  document.getElementById('confirmMsg').textContent=msg;
  document.getElementById('confirmSub').textContent=sub||'';
  document.getElementById('confirmModal').classList.add('open');
}
function closeConfirm(){
  document.getElementById('confirmModal').classList.remove('open');
  _confirmCb=null;
}

function delFav(id){
  const item=favs.find(f=>f.id===id);
  showConfirm(
    lang==='bm'?'Buang dari kegemaran?':'Remove from favourites?',
    item?.name||'',
    ()=>{
      favs=favs.filter(f=>f.id!==id);
      localStorage.setItem('sk_favs',JSON.stringify(favs));
      updStats();
      renderMI();
    }
  );
}

function delHist(index){
  const item=hist[index];
  showConfirm(
    lang==='bm'?'Padam rekod infaq ini?':'Delete this infaq record?',
    item?.kName||item?.name||'',
    ()=>{
      hist.splice(index,1);
      localStorage.setItem('sk_hist',JSON.stringify(hist));
      updStats();
      renderMI();
    }
  );
}

function delLocalMasjid(id){
  const item=localMasjid.find(m=>m.id===id);
  showConfirm(
    lang==='bm'?'Padam dari koleksi tempatan?':'Delete from local collection?',
    item?.name||'',
    ()=>{
      localMasjid=localMasjid.filter(m=>m.id!==id);
      localQr=localQr.filter(q=>q.masjid_id!==id);
      favs=favs.filter(f=>f.id!==id);
      localStorage.setItem('sk_local_masjid',JSON.stringify(localMasjid));
      localStorage.setItem('sk_local_qr',JSON.stringify(localQr));
      localStorage.setItem('sk_favs',JSON.stringify(favs));
      updStats();
      renderMI();
    }
  );
}

function goTab(n){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.ni').forEach(x=>x.classList.remove('active'));
  const target=document.getElementById('screen-'+n);
  if(target) target.classList.add('active');
  const btn=document.getElementById('nav-btn-'+n);
  if(btn) btn.classList.add('active');
  if(n==='hariini') renderK();
  if(n==='saya') renderMI();
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
  ['lbl-hariini','lbl-kempen-title','lbl-fav-title','lbl-simpan','lbl-kongsi','lbl-lain','lbl-stat1','lbl-stat2','lbl-hist-title','lbl-scan','lbl-sync-comm','menu-lbl1','menu-lbl2','menu-history','menu-lang','menu-refresh','menu-export','menu-install','menu-kopi'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.textContent=t(id);
  });
  const btnInfaq=document.getElementById('btnInfaq');
  if(btnInfaq&&btnInfaq.childNodes[0]) btnInfaq.childNodes[0].textContent=t('bi');
  const sInput=document.getElementById('searchInput');
  if(sInput) sInput.placeholder=t('search-ph');
  const _cs=JSON.parse(localStorage.getItem('sk_solat')||'null');
  if(_cs&&_cs.date===new Date().toISOString().slice(0,10)) renderWaktuSolat(_cs.timings);
  else renderWaktuSolatPrompt();
  renderK();
  renderSeasonBanner();
}

function shareM(){
  if(!cur) return;
  const qr=getQR(cur.id);
  const tx='🕌 Jom infaq ke '+cur.name+'!\nDuitNow: '+(qr?qr.duitnow_string:'')+'\n\nhttps://eikanster.github.io/sedekahku';
  if(navigator.share) navigator.share({title:'QRSedekah',text:tx});
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
      if(d&&d.length){MD=d;localStorage.setItem('sk_masjid',JSON.stringify(d));cur=dailyM();updHero();}
    }
    if(mf.files.qr_code!==ver.qr_code){
      const d=await fetch('data/qr_code.json?v='+mf.files.qr_code).then(r=>r.ok?r.json():null).catch(()=>null);
      if(d&&d.length){QR=d;localStorage.setItem('sk_qr',JSON.stringify(d));}
    }
    if(mf.files.kempen!==ver.kempen){
      const d=await fetch('data/kempen.json?v='+mf.files.kempen).then(r=>r.ok?r.json():null).catch(()=>null);
      if(d&&d.length){KD=d;localStorage.setItem('sk_kempen',JSON.stringify(d));renderK();}
    }
    if(mf.files.hikmah!==ver.hikmah){
      const d=await fetch('data/hikmah.json?v='+mf.files.hikmah).then(r=>r.ok?r.json():null).catch(()=>null);
      if(d&&d.length){HIKMAH=d; renderSeasonBanner();}
    }
    localStorage.setItem('sk_ver',JSON.stringify(mf.files));
    renderK();
  }catch(e){}
}

// ── Status Badge ─────────────────────────────────────────────────
function statusBadge(status){
  if(status==='verified')  return '<span class="status-badge badge-verified">✓ Disahkan</span>';
  if(status==='community') return '<span class="status-badge badge-community">👥 Komuniti</span>';
  if(status==='pending')   return '<span class="status-badge badge-pending">⏳ Semakan</span>';
  return '';
}

// ── Profile ──────────────────────────────────────────────────────
function renderProfileHeader(){
  const el=document.getElementById('profileName');
  if(el) el.textContent=profile.name||'Penyumbang QRSedekah';
}

function saveProfile(){
  localStorage.setItem('sk_profile',JSON.stringify(profile));
}

// ── Waktu Solat ───────────────────────────────────────────────────
const SOLAT_PRAYERS=[
  {key:'Fajr',   bm:'Subuh',   en:'Fajr'},
  {key:'Sunrise',bm:'Syuruk',  en:'Sunrise'},
  {key:'Dhuhr',  bm:'Zohor',   en:'Dhuhr'},
  {key:'Asr',    bm:'Asar',    en:'Asr'},
  {key:'Maghrib',bm:'Maghrib', en:'Maghrib'},
  {key:'Isha',   bm:'Isyak',   en:'Isha'}
];

function initWaktuSolat(){
  const today=new Date().toISOString().slice(0,10);
  const cached=JSON.parse(localStorage.getItem('sk_solat')||'null');
  if(cached&&cached.date===today) renderWaktuSolat(cached.timings);
  else renderWaktuSolatPrompt();
}

function renderWaktuSolatPrompt(){
  const el=document.getElementById('waktuSolat');
  if(!el) return;
  const bm=lang==='bm';
  el.innerHTML=`<div class="solat-wrap">
    <div class="solat-hdr"><span class="solat-ttl">🕐 ${bm?'Waktu Solat':'Prayer Times'}</span></div>
    <div class="solat-prompt">
      <div style="font-size:13px;color:var(--muted);margin-bottom:12px;">${bm?'Aktifkan lokasi untuk waktu solat tempatan':'Enable location for local prayer times'}</div>
      <button class="btn-loc" onclick="requestSolatLoc()">📍 ${bm?'Aktifkan Lokasi':'Enable Location'}</button>
    </div>
  </div>`;
}

function requestSolatLoc(){
  const btn=document.querySelector('#waktuSolat .btn-loc');
  if(btn) btn.textContent=lang==='bm'?'⏳ Memuatkan...':'⏳ Loading...';
  getLoc(loc=>{
    if(loc) fetchWaktuSolat(loc.lat,loc.lng);
    else{ renderWaktuSolatPrompt(); showToast(lang==='bm'?'Lokasi tidak dapat diakses':'Location unavailable'); }
  });
}

async function fetchWaktuSolat(lat,lng){
  const today=new Date().toISOString().slice(0,10);
  try{
    const r=await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=3`);
    const data=await r.json();
    if(data.code===200){
      const timings=data.data.timings;
      localStorage.setItem('sk_solat',JSON.stringify({date:today,timings,lat,lng}));
      renderWaktuSolat(timings);
    }
  }catch(e){}
}

function renderWaktuSolat(timings){
  const el=document.getElementById('waktuSolat');
  if(!el) return;
  const bm=lang==='bm';
  const nowMins=new Date().getHours()*60+new Date().getMinutes();
  const nextIdx=SOLAT_PRAYERS.findIndex(p=>{
    const t=timings[p.key];
    if(!t) return false;
    const[h,m]=t.split(':').map(Number);
    return(h*60+m)>nowMins;
  });
  el.innerHTML=`<div class="solat-wrap">
    <div class="solat-hdr">
      <span class="solat-ttl">🕐 ${bm?'Waktu Solat Hari Ini':'Prayer Times Today'}</span>
      <button onclick="requestSolatLoc()" style="background:none;border:none;color:var(--muted);font-size:16px;cursor:pointer;line-height:1;padding:4px;" title="Refresh">🔄</button>
    </div>
    <div class="solat-grid">
      ${SOLAT_PRAYERS.map((p,i)=>{
        const time=timings[p.key]||'--:--';
        const[h,m]=time.split(':').map(Number);
        const isPast=(h*60+(m||0))<nowMins;
        const isNext=i===nextIdx;
        return`<div class="solat-item${isNext?' next':isPast?' past':''}">
          <div class="solat-name">${bm?p.bm:p.en}</div>
          <div class="solat-time">${time}</div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

async function refreshFromSheet(force=false){
  const today=new Date().toISOString().slice(0,10);
  if(!force && localStorage.getItem('sk_sheet_date')===today) return;

  try{
    const r=await fetch(SUBMIT_URL,{cache:'no-store'});
    const data=await r.json();
    if(data.error||!data.masjid) return;

    let changed=false;

    if(data.masjid.length){
      const existing=new Set(MD.map(m=>m.id));
      const newM=data.masjid.filter(m=>!existing.has(m.id));
      if(newM.length){ MD=[...MD,...newM]; localStorage.setItem('sk_masjid',JSON.stringify(MD)); changed=true; }
    }

    if(data.qr_code&&data.qr_code.length){
      const existingQ=new Set(QR.map(q=>q.id));
      const newQ=data.qr_code.filter(q=>!existingQ.has(q.id));
      if(newQ.length){ QR=[...QR,...newQ]; localStorage.setItem('sk_qr',JSON.stringify(QR)); changed=true; }
    }

    localStorage.setItem('sk_sheet_date',today);
    if(changed){ cur=dailyM(); updHero(); renderK(); }
    return data.count||0;

  }catch(e){ return null; }
}

// ── EMVCo QR Parser ─────────────────────────────────────────────
function parseEMVCo(raw){
  const result={};
  let i=0;
  try{
    while(i<raw.length){
      const tag=raw.substring(i,i+2);
      const len=parseInt(raw.substring(i+2,i+4),10);
      const val=raw.substring(i+4,i+4+len);
      result[tag]=val;
      i+=4+len;
    }
  }catch(e){}
  return result;
}

function getLoc(cb){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      (p)=>cb({lat:p.coords.latitude,lng:p.coords.longitude}),
      ()=>cb(null),
      {enableHighAccuracy:true,timeout:5000}
    );
  }else cb(null);
}

function convertDMSToDecimal(dms, ref){
  if(!dms || dms.length < 3) return null;
  let dec = dms[0] + (dms[1]/60) + (dms[2]/3600);
  if(ref === 'S' || ref === 'W') dec = dec * -1;
  return dec;
}

function getExifLoc(file, cb){
  if(!window.EXIF) return cb(null);
  EXIF.getData(file, function(){
    const lat = EXIF.getTag(this, 'GPSLatitude');
    const latRef = EXIF.getTag(this, 'GPSLatitudeRef');
    const lng = EXIF.getTag(this, 'GPSLongitude');
    const lngRef = EXIF.getTag(this, 'GPSLongitudeRef');
    
    if(lat && lng){
      cb({
        lat: convertDMSToDecimal(lat, latRef),
        lng: convertDMSToDecimal(lng, lngRef)
      });
    } else cb(null);
  });
}

function processScannedQR(rawString, source='live', exifLoc=null){
  const parsed=parseEMVCo(rawString);
  const name=parsed['59']||'';
  const city=parsed['60']||'';
  const postal=parsed['61']||'';

  if(!name){
    showToast('QR tidak dikenali sebagai DuitNow');
    return;
  }

  const masjidId='local_'+Date.now();
  const qrId='qr_local_'+(Date.now()+1);

  scanPending={
    masjid:{
      id:masjidId,
      name:name,
      type:'masjid',
      address:null,
      daerah:city,
      state:city,
      postcode:postal,
      lat:null,
      lng:exifLoc?exifLoc.lng:null,
      google_maps_url:null,
      image_url:null,
      status:'pending',
      verified_by:null,
      verified_at:null,
      infaq_count:0,
      featured_dates:[],
      ramadan_priority:false,
      created_at:new Date().toISOString(),
      updated_at:new Date().toISOString(),
      scan_source: source
    },
    qr:{
      id:qrId,
      masjid_id:masjidId,
      duitnow_string:rawString,
      merchant_id:null,
      account_name:name,
      account_number:null,
      bank_name:null,
      qr_type:'static',
      qr_image_url:null,
      is_primary:true,
      type:'general',
      status:'pending',
      submitted_by_email:null,
      submitted_by_phone:null,
      created_at:new Date().toISOString()
    }
  };

  closeScan();

  document.getElementById('addName').textContent=name;
  document.getElementById('addCity').textContent=city+(postal?', '+postal:'');
  document.getElementById('addProxy').textContent=rawString.length>60?rawString.substring(0,60)+'...':rawString;
  const locBadge = document.getElementById('locBadge');
  
  if(exifLoc){
    scanPending.masjid.lat = exifLoc.lat;
    scanPending.masjid.lng = exifLoc.lng;
    if(locBadge){
      locBadge.innerHTML = '📂 Lokasi dari gambar dikesan <button onclick="clearLoc()" style="background:none;border:none;color:#ff4d4d;font-weight:bold;margin-left:5px;cursor:pointer;">[Padam]</button>';
      locBadge.style.background = 'rgba(93,248,216,0.1)';
      locBadge.style.display = 'inline-block';
    }
  } else if(source === 'live'){
    if(locBadge) {
      locBadge.textContent = '⏳ Mengesan lokasi...';
      locBadge.style.background = 'rgba(255,255,255,0.05)';
      locBadge.style.display = 'inline-block';
    }
    getLoc((loc)=>{
      if(loc && scanPending){
        scanPending.masjid.lat = loc.lat;
        scanPending.masjid.lng = loc.lng;
        if(locBadge){
          locBadge.innerHTML = '📍 Lokasi dikesan <button onclick="clearLoc()" style="background:none;border:none;color:#ff4d4d;font-weight:bold;margin-left:5px;cursor:pointer;">[Padam]</button>';
          locBadge.style.background = 'rgba(93,248,216,0.1)';
        }
        // Bonus: fetch solat times while we have location
        const _ss=JSON.parse(localStorage.getItem('sk_solat')||'null');
        if(!_ss||_ss.date!==new Date().toISOString().slice(0,10)) fetchWaktuSolat(loc.lat,loc.lng);
      } else if(locBadge) {
        locBadge.textContent = '❌ Lokasi tidak dikesan';
      }
    });
  } else {
    if(locBadge) {
      locBadge.textContent = '📂 Dari galeri (Tiada GPS)';
      locBadge.style.background = 'rgba(255,255,255,0.05)';
      locBadge.style.display = 'inline-block';
    }
  }

  document.getElementById('addMasjidModal').classList.add('open');
}

// ── Scanner Controls ─────────────────────────────────────────────
let html5Scanner=null;

function openScan(){
  const qrReader=document.getElementById('qr-reader');
  qrReader.style.display='none';
  qrReader.innerHTML='';
  document.getElementById('scanOptions').style.display='flex';
  document.getElementById('scanModal').classList.add('open');
}

function startLiveScan(){
  const qrReader=document.getElementById('qr-reader');
  document.getElementById('scanOptions').style.display='none';
  qrReader.style.display='block';
  qrReader.style.minHeight='220px';
  try{
    html5Scanner=new Html5Qrcode('qr-reader');
    html5Scanner.start(
      {facingMode:'environment'},
      {fps:10,qrbox:{width:230,height:230}},
      (decodedText)=>{processScannedQR(decodedText, 'live');},
      ()=>{}
    ).catch(()=>showToast('Kamera tidak dapat diakses'));
  }catch(e){
    showToast('Scanner tidak tersedia');
  }
}

function scanFromFile(file){
  if(!file) return;
  const tempScanner=new Html5Qrcode('qr-reader');
  document.getElementById('scanOptions').style.display='none';
  document.getElementById('qr-reader').style.display='block';
  showToast('Memproses gambar...');
  
  getExifLoc(file, (exifLoc)=>{
    tempScanner.scanFile(file,true)
      .then(decodedText=>{
        tempScanner.clear();
        processScannedQR(decodedText, 'file', exifLoc);
      })
      .catch(()=>{
        tempScanner.clear();
        showToast('QR tidak dapat dibaca. Cuba gambar lebih jelas.');
        document.getElementById('scanOptions').style.display='flex';
        document.getElementById('qr-reader').style.display='none';
      });
  });
}

function closeScan(){
  document.getElementById('scanModal').classList.remove('open');
  if(html5Scanner){
    html5Scanner.stop().catch(()=>{});
    html5Scanner=null;
  }
  document.getElementById('qr-reader').innerHTML='';
  document.getElementById('qr-reader').style.display='none';
  document.getElementById('scanOptions').style.display='flex';
}

// ── Confirm Add Scanned Masjid ────────────────────────────────────
function confirmAddMasjid(){
  if(!scanPending) return;
  const {masjid,qr}=scanPending;
  const exists=localMasjid.find(m=>m.name===masjid.name);
  if(exists){
    showToast('Sudah disimpan!');
  }else{
    localMasjid.push(masjid);
    localStorage.setItem('sk_local_masjid',JSON.stringify(localMasjid));
    localQr.push(qr);
    localStorage.setItem('sk_local_qr',JSON.stringify(localQr));
    if(!favs.find(f=>f.id===masjid.id)){
      favs.push(masjid);
      localStorage.setItem('sk_favs',JSON.stringify(favs));
    }
    updStats();
    renderMI();
    showToast('✅ '+masjid.name+' disimpan!');
  }
  scanPending=null;
  document.getElementById('addMasjidModal').classList.remove('open');
}


async function syncToCommunity(){
  if(!localMasjid.length){
    showToast(lang==='bm'?'Tiada data imbasan untuk dihantar':'No scan data to submit');
    return;
  }
  if(!profile.name){
    showToast(lang==='bm'?'Sila isi nama anda dalam Profil dahulu':'Please fill in your name in Profile first');
    return;
  }

  const btn=document.getElementById('btnSync');
  if(btn){ btn.innerHTML='<span>⏳ Menghantar...</span>'; btn.disabled=true; }

  const str=v=>(v!=null&&v!=='')?String(v):'';
  const payload=localMasjid.map(m=>{
    const q=localQr.find(qr=>qr.masjid_id===m.id)||{};
    return {
      submitter_name: str(profile.name),
      submitter_phone: str(profile.phone),
      name:            str(m.name),
      daerah:          str(m.daerah),
      state:           str(m.state),
      postcode:        str(m.postcode),
      lat:             str(m.lat),
      lng:             str(m.lng),
      qr_string:       str(q.duitnow_string),
      scanned_at:      str(m.created_at),
      source:          str(m.scan_source)||'unknown'
    };
  });

  try{
    const response=await fetch(SUBMIT_URL,{method:'POST',body:JSON.stringify(payload)});
    const result=await response.json();
    if(result.result==='success'){
      showToast(lang==='bm'?`✅ ${result.count} rekod berjaya dihantar!`:`✅ ${result.count} record(s) submitted!`);
    }else{
      showToast('❌ '+(result.message||'Gagal menghantar'));
    }
  }catch(e){
    showToast(lang==='bm'?'❌ Ralat rangkaian':'❌ Network error');
  }finally{
    if(btn){ btn.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg><span id="lbl-sync-comm">'+t('lbl-sync-comm')+'</span>'; btn.disabled=false; }
  }
}

document.addEventListener('DOMContentLoaded', async function(){
  // Load hikmah data
  HIKMAH = await fetch('data/hikmah.json').then(r=>r.ok?r.json():[]).catch(()=>[]);
  document.getElementById('btnShuffle').onclick=shuffleM;
  document.getElementById('btnInfaq').onclick=()=>{ curK=null; openQR(); };
  document.getElementById('btnFavToggle').onclick=toggleFav;
  document.getElementById('btnDeleteRecord').onclick=()=>{ closeQR(); delLocalMasjid(cur.id); };
  document.getElementById('btnSimpan').onclick=saveFav;
  document.getElementById('btnKongsi').onclick=shareM;
  document.getElementById('btnLain').onclick=()=>goTab('search');
  document.getElementById('btnDB').onclick=confirmPay;
  document.getElementById('menuBtn').onclick=toggleMenu;
  document.getElementById('menuOverlay').onclick=toggleMenu;
  document.getElementById('menuLang').onclick=()=>{toggleLang();toggleMenu();};
  document.getElementById('menuRefresh').onclick=async()=>{
    showToast(lang==='bm'?'⏳ Mengemaskini...':'⏳ Refreshing...');
    const count=await refreshFromSheet(true);
    toggleMenu();
    if(count!=null) showToast(lang==='bm'?`✅ ${count} masjid dimuatkan`:`✅ ${count} masjid loaded`);
    else showToast(lang==='bm'?'❌ Gagal sambung':'❌ Connection failed');
  };
  document.getElementById('menuExport').onclick=()=>{syncToCommunity();toggleMenu();};
  document.getElementById('menuInstall').onclick=async ()=>{
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      document.getElementById('menuInstall').style.display = 'none';
    }
    deferredPrompt = null;
    toggleMenu();
  };
  document.getElementById('nav-btn-hariini').onclick=()=>goTab('hariini');
  document.getElementById('nav-btn-scan').onclick=()=>goTab('scan');
  document.getElementById('nav-btn-saya').onclick=()=>goTab('saya');

  document.getElementById('btnTabScan').onclick=openScan;
  document.getElementById('btnScan').onclick=openScan;
  document.getElementById('btnScanLive').onclick=startLiveScan;
  document.getElementById('scanFileInput').onchange=(e)=>scanFromFile(e.target.files[0]);
  document.getElementById('btnCancelScan').onclick=closeScan;
  document.getElementById('btnConfirmAdd').onclick=confirmAddMasjid;
  document.getElementById('btnSync').onclick=syncToCommunity;
  document.getElementById('btnCancelAdd').onclick=()=>{
    scanPending=null;
    document.getElementById('addMasjidModal').classList.remove('open');
  };

  const sInput=document.getElementById('searchInput');
  if(sInput) sInput.oninput=(e)=>renderSearch(e.target.value);

  document.getElementById('qrModal').onclick=function(e){if(e.target===this)closeQR();};
  document.getElementById('confirmYes').onclick=()=>{ if(_confirmCb) _confirmCb(); closeConfirm(); };
  document.getElementById('confirmNo').onclick=closeConfirm;
  document.getElementById('confirmModal').onclick=function(e){if(e.target===this)closeConfirm();};

  // Profile fields
  const profNameInput=document.getElementById('profName');
  const profPhoneInput=document.getElementById('profPhone');
  if(profNameInput){
    profNameInput.value=profile.name||'';
    profNameInput.oninput=e=>{ profile.name=e.target.value; saveProfile(); renderProfileHeader(); };
  }
  if(profPhoneInput){
    profPhoneInput.value=profile.phone||'';
    profPhoneInput.oninput=e=>{ profile.phone=e.target.value; saveProfile(); };
  }

  // Belanja Kopi
  const menuKopi=document.getElementById('menuKopi');
  if(menuKopi) menuKopi.onclick=()=>{ if(KOPI_URL) window.open(KOPI_URL,'_blank'); else showToast('Link belum disetkan'); toggleMenu(); };

  document.getElementById('hijriDate').textContent = hijri();
  cur=dailyM();
  updHero();
  updStats();
  renderProfileHeader();
  applyLang(); // also calls initWaktuSolat via renderWaktuSolatPrompt
  renderSeasonBanner();
  renderMI();
  renderK();
  refreshData();
  refreshFromSheet();

  // ── Ripple Effect on all interactive buttons ──
  document.querySelectorAll('.btn-i, .btn-db, .btn-scan, .kcard').forEach(el=>{
    el.style.position='relative';
    el.style.overflow='hidden';
    el.addEventListener('click', e=>addRipple(e, el));
  });

  if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});

  // ── Firefly Spawner ──
  (function spawnFireflies(){
    const count=12;
    for(let i=0;i<count;i++){
      const dot=document.createElement('div');
      const size=Math.random()*2+1;
      const duration=(Math.random()*10+10).toFixed(1)+'s';
      const delay=(Math.random()*15).toFixed(1)+'s';
      dot.style.cssText=`
        position: fixed;
        width: ${size}px; height: ${size}px;
        left: ${Math.random()*100}vw; top: ${Math.random()*100}vh;
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
  function spawnShootingStar(){
    const star=document.createElement('div');
    star.className='shooting-star';
    star.style.top=(Math.random()*50)+'vh';
    star.style.left=(Math.random()*80+10)+'vw';
    document.body.appendChild(star);
    setTimeout(()=>star.remove(),1500);
    setTimeout(spawnShootingStar,Math.random()*15000+8000);
  }
  setTimeout(spawnShootingStar,5000);
});
