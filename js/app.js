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

let lang=localStorage.getItem('sk_lang')||'bm';
let MD=JSON.parse(localStorage.getItem('sk_masjid')||'null')||MASJID;
let QR=JSON.parse(localStorage.getItem('sk_qr')||'null')||QR_DEFAULT;
let KD=JSON.parse(localStorage.getItem('sk_kempen')||'null')||KEMPEN;
let favs=JSON.parse(localStorage.getItem('sk_favs')||'[]');
let hist=JSON.parse(localStorage.getItem('sk_hist')||'[]');
let localMasjid=JSON.parse(localStorage.getItem('sk_local_masjid')||'[]');
let localQr=JSON.parse(localStorage.getItem('sk_local_qr')||'[]');
let cur=null;
let curK=null;
let scanPending=null;
const SUBMIT_URL=''; // Paste your Google Web App URL here

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
    'menu-export':'Eksport Data',
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
    'menu-export':'Export Data',
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
    // Extract month number (1-12) from Hijri calendar
    const parts = new Date().toLocaleDateString('en-u-ca-islamic',{month:'numeric',year:'numeric',day:'numeric'}).split('/');
    // en-US format: M/D/YYYY, so month is parts[0]
    return parseInt(parts[0]);
  }catch{
    return 0;
  }
}

function renderSeasonBanner(){
  const el = document.getElementById('seasonBanner');
  if(!el) return;
  const month = getHijriMonth();
  const bm = lang === 'bm';

  const seasons = {
    1: { // Muharram
      cls:'season-muharram', icon:'🌙',
      title: bm ? 'Maal Hijrah' : 'Islamic New Year',
      msg: bm ? 'Tahun baru Hijrah. Mulakan dengan niat bersedekah lebih banyak tahun ini. Setiap infaq adalah bekalan untuk akhirat.' : 'A new Hijri year begins. Start it with a renewed intention to give more this year.'
    },
    3: { // Rabiul Awal
      cls:'season-maulid', icon:'🌟',
      title: bm ? 'Maulidur Rasul ﷺ' : 'Maulidur Rasul ﷺ',
      msg: bm ? 'Bulan kelahiran Nabi Muhammad ﷺ. Hidupkan sunnah baginda dengan bersedekah kepada yang memerlukan.' : 'Month of the Prophet\'s ﷺ birth. Celebrate by following his Sunnah of generosity.'
    },
    7: { // Rejab
      cls:'season-rejab', icon:'✨',
      title: bm ? 'Bulan Rejab' : 'Month of Rejab',
      msg: bm ? 'Israk Mikraj bulan ini. Bulan mulia untuk memperbanyak ibadat dan sedekah. Satu sedekah kini, pahala berlipat ganda.' : 'Isra\' Mi\'raj this month. A blessed time — multiply your rewards through generous giving.'
    },
    8: { // Syaaban
      cls:'season-syaaban', icon:'🌙',
      title: bm ? 'Malam Nisfu Syaaban' : 'Mid Syaaban',
      msg: bm ? 'Pertengahan Syaaban tiba. Amal sedekah dibuka pintu luasnya. Bersihkan harta, bersihkan jiwa.' : 'Mid Syaaban is near. Open your heart — charity purifies the soul before Ramadan.'
    },
    9: { // Ramadan
      cls:'season-ramadan', icon:'🔥',
      title: bm ? 'Ramadan Kareem 🌙' : 'Ramadan Kareem 🌙',
      msg: bm ? 'Pahala berlipat ganda! Setiap infaq di bulan ini seperti infaq 70 bulan. Cari Lailatul Qadar dengan bersedekah setiap malam.' : 'Rewards are multiplied! Every donation in Ramadan is like giving 70 months of charity. Seek Laylatul Qadr.'
    },
    10: { // Syawal
      cls:'season-syawal', icon:'🎉',
      title: bm ? 'Selamat Hari Raya!' : 'Eid Mubarak!',
      msg: bm ? 'Aidilfitri yang penuh barakah. Jangan lupa bayar zakat fitrah dan sedekah kepada yang memerlukan.' : 'A blessed Eid. Remember Zakat Fitrah and extend your generosity to those in need.'
    },
    12: { // Zulhijjah
      cls:'season-zulhijjah', icon:'🐄',
      title: bm ? 'Zulhijjah & Aidiladha' : 'Zulhijjah & Eid Al-Adha',
      msg: bm ? 'Musim haji dan korban. 10 hari pertama Zulhijjah adalah antara hari terbaik. Sedekah, korban dan doa.' : 'Season of Hajj & Qurban. The first 10 days of Zulhijjah are the best days of the year for good deeds.'
    },
  };

  const data = seasons[month] || {
    cls: 'season-default', icon: '🕌',
    title: bm ? 'Bersedekah Setiap Hari' : 'Give Every Day',
    msg: bm ? 'Sedekah itu tidak mengurangkan harta — ia melipatgandakannya. Imbas QR masjid berhampiran dan mulakan infaq anda hari ini.' : 'Charity does not diminish wealth — it multiplies it. Scan a nearby masjid QR and start your infaq today.'
  };

  el.innerHTML = `
    <div class="season-banner ${data.cls}">
      <div class="season-icon">${data.icon}</div>
      <div>
        <div class="season-title">${data.title}</div>
        <div class="season-msg">${data.msg}</div>
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

  const favHTML = favs.length?favs.map(f=>`
    <div class="fcard" data-id="${f.id}">
      <div class="fico">🕌</div>
      <div class="finfo">
        <div class="fname">${f.name}</div>
        <div class="floc">${f.daerah||f.mukim||''}, ${f.state}</div>
      </div>
      <button class="btn-rm" onclick="event.stopPropagation(); delFav('${f.id}')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>`).join(''):`<div class="empty"><div class="eico">🕌</div><div class="etit">${t('ef')}</div><div class="edesc">${t('efd')}</div></div>`;

  if(pFavList) pFavList.innerHTML = favHTML;

  // Update profile stats with animation
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
      <div class="fico">${m.status==='verified'?'🕌':'🔖'}</div>
      <div class="finfo">
        <div class="fname">${m.name}${m.status==='pending'&&m.id.startsWith('local_')?' <span style="font-size:9px;color:#ffc800;font-weight:600;">● LOKAL</span>':''}</div>
        <div class="floc">${m.daerah||''}${m.state?', '+m.state:''}</div>
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

function delFav(id){
  favs=favs.filter(f=>f.id!==id);
  localStorage.setItem('sk_favs',JSON.stringify(favs));
  updStats();
  renderMI();
}

function delHist(index){
  hist.splice(index,1);
  localStorage.setItem('sk_hist',JSON.stringify(hist));
  updStats();
  renderMI();
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
  ['lbl-hariini','lbl-kempen-title','lbl-fav-title','lbl-simpan','lbl-kongsi','lbl-lain','lbl-stat1','lbl-stat2','menu-lbl1','menu-lbl2','menu-lang','menu-export'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.textContent=t(id);
  });
  const btnInfaq=document.getElementById('btnInfaq');
  if(btnInfaq&&btnInfaq.childNodes[0]) btnInfaq.childNodes[0].textContent=t('bi');
  document.getElementById('langBtn').textContent=lang==='bm'?'EN':'BM';
  const sInput=document.getElementById('searchInput');
  if(sInput) sInput.placeholder=t('search-ph');
  renderK();
  renderSeasonBanner();
}

function shareM(){
  if(!cur) return;
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
    localStorage.setItem('sk_ver',JSON.stringify(mf.files));
    renderK();
  }catch(e){}
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

function submitToAdmin(){
  if(!scanPending) return;
  const {masjid,qr}=scanPending;
  const msg=encodeURIComponent(
    '🕌 *Cadangan Masjid Baru*\n\n'+
    '*Nama:* '+masjid.name+'\n'+
    '*Lokasi:* '+masjid.daerah+', '+masjid.postcode+'\n'+
    '*Koordinat:* '+(masjid.lat?masjid.lat+','+masjid.lng:'Tiada')+'\n'+
    '*QR String:* '+qr.duitnow_string+'\n'+
    '*Masa Imbas:* '+new Date(masjid.created_at).toLocaleString('ms-MY')+'\n\n'+
    'Sila sahkan dan tambah ke dalam direktori QRSedekah.'
  );
  window.open('https://t.me/kawantelegram?text='+msg,'_blank');
  confirmAddMasjid();
}

async function syncToCommunity(){
  if(!localMasjid.length) return;
  if(!SUBMIT_URL){
    showToast('SUBMIT_URL belum disetkan');
    return;
  }
  
  const btn = document.getElementById('btnSync');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span>⏳ Menghantar...</span>';
  btn.disabled = true;

  const payload = localMasjid.map(m => {
    const q = localQr.find(qr => qr.masjid_id === m.id) || {};
    return {
      id: m.id,
      name: m.name,
      daerah: m.daerah,
      state: m.state,
      postcode: m.postcode,
      lat: m.lat,
      lng: m.lng,
      qr_string: q.duitnow_string,
      scanned_at: m.created_at,
      source: m.scan_source || 'unknown'
    };
  });

  try {
    const response = await fetch(SUBMIT_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if(result.result === 'success'){
      showToast('✅ Berjaya dikongsi ke komuniti!');
    } else {
      showToast('❌ Gagal menghantar');
    }
  } catch (e) {
    showToast('❌ Ralat rangkaian');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('btnShuffle').onclick=shuffleM;
  document.getElementById('btnInfaq').onclick=()=>{ curK=null; openQR(); };
  document.getElementById('btnFavToggle').onclick=toggleFav;
  document.getElementById('btnSimpan').onclick=saveFav;
  document.getElementById('btnKongsi').onclick=shareM;
  document.getElementById('btnLain').onclick=()=>goTab('search');
  document.getElementById('btnDB').onclick=confirmPay;
  document.getElementById('langBtn').onclick=toggleLang;
  document.getElementById('menuBtn').onclick=toggleMenu;
  document.getElementById('menuOverlay').onclick=toggleMenu;
  document.getElementById('menuLang').onclick=()=>{toggleLang();toggleMenu();};
  document.getElementById('menuExport').onclick=()=>{exportD();toggleMenu();};
  document.getElementById('nav-btn-hariini').onclick=()=>goTab('hariini');
  document.getElementById('nav-btn-scan').onclick=()=>goTab('scan');
  document.getElementById('nav-btn-saya').onclick=()=>goTab('saya');

  document.getElementById('btnTabScan').onclick=openScan;
  document.getElementById('btnScan').onclick=openScan;
  document.getElementById('btnScanLive').onclick=startLiveScan;
  document.getElementById('scanFileInput').onchange=(e)=>scanFromFile(e.target.files[0]);
  document.getElementById('btnCancelScan').onclick=closeScan;
  document.getElementById('btnConfirmAdd').onclick=confirmAddMasjid;
  document.getElementById('btnSubmitAdmin').onclick=submitToAdmin;
  document.getElementById('btnSync').onclick=syncToCommunity;
  document.getElementById('btnCancelAdd').onclick=()=>{
    scanPending=null;
    document.getElementById('addMasjidModal').classList.remove('open');
  };

  const sInput=document.getElementById('searchInput');
  if(sInput) sInput.oninput=(e)=>renderSearch(e.target.value);

  document.getElementById('qrModal').onclick=function(e){if(e.target===this)closeQR();};

  document.getElementById('hijriDate').textContent = hijri();
  cur=dailyM();
  updHero();
  updStats();
  applyLang();
  renderSeasonBanner();
  renderMI();
  renderK();
  refreshData();

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
