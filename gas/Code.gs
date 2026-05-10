// QRSedekah — Google Apps Script
// Deployed at: https://script.google.com/macros/s/AKfycbzJzDkn8_tynoOG9La0RKApF9mWlkkO_Bp0f830xlkoXn0x7_qpC_Jzn2ISnNV-3FqA/exec
// Sheet: Sumbangan
// Last updated: 2026-05-11

const SHEET_NAME = 'Sumbangan';
const COMMUNITY_THRESHOLD = 3;

// ── Receive community submissions ────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp','Nama','Telefon','Nama Masjid',
        'Daerah','Negeri','Poskod','Lat','Lng',
        'DuitNow String','Sumber Imbasan','Masa Imbasan','Status'
      ]);
    }

    const entries = Array.isArray(data) ? data : [data];
    entries.forEach(entry => {
      sheet.appendRow([
        new Date().toISOString(),
        entry.submitter_name || '',
        entry.submitter_phone || '',
        entry.name || '',
        entry.daerah || '',
        entry.state || '',
        entry.postcode || '',
        entry.lat || '',
        entry.lng || '',
        entry.qr_string || '',
        entry.source || '',
        entry.scanned_at || '',
        'pending'
      ]);
      checkCommunityPromotion(sheet, entry.qr_string);
    });

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', count: entries.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Auto-promote to community if 3+ unique phones submit same QR ─
function checkCommunityPromotion(sheet, qrString) {
  if (!qrString) return;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const allData = sheet.getRange(2, 1, lastRow - 1, 13).getValues();
  // Col index (0-based): J=DuitNow=9, C=Telefon=2, M=Status=12

  const matchingRows = [];
  const uniquePhones = new Set();

  allData.forEach((row, i) => {
    if (row[9] === qrString) {
      matchingRows.push(i + 2);
      if (row[2]) uniquePhones.add(row[2]);
    }
  });

  if (uniquePhones.size >= COMMUNITY_THRESHOLD) {
    matchingRows.forEach(rowNum => {
      const currentStatus = sheet.getRange(rowNum, 13).getValue();
      if (currentStatus !== 'verified') {
        sheet.getRange(rowNum, 13).setValue('community');
      }
    });
  }
}

// ── Generate masjid.json + qr_code.json from verified rows ───────
// Run manually: Extensions → Apps Script → Run → generateJSON
function generateJSON() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert('Tiada data dalam sheet.');
    return;
  }

  // Col (0-based): Timestamp=0,Nama=1,Telefon=2,Nama Masjid=3,Daerah=4,
  // Negeri=5,Poskod=6,Lat=7,Lng=8,DuitNow String=9,Sumber=10,Masa=11,Status=12
  const allData = sheet.getRange(2, 1, lastRow - 1, 13).getValues();

  // Keep only verified + community rows
  const approved = allData.filter(row =>
    row[12] === 'verified' || row[12] === 'community'
  );

  if (approved.length === 0) {
    SpreadsheetApp.getUi().alert('Tiada baris dengan status verified atau community.');
    return;
  }

  // Deduplicate by DuitNow string — same QR = same masjid
  // Prefer row with GPS coordinates if duplicate exists
  const seen = {};
  approved.forEach(row => {
    const qr = row[9];
    if (!qr) return;
    if (!seen[qr]) {
      seen[qr] = row;
    } else if (!seen[qr][7] && row[7]) {
      seen[qr] = row; // upgrade to row with lat/lng
    }
  });

  const uniqueRows = Object.values(seen);
  const now = new Date().toISOString();
  const masjidEntries = [];
  const qrEntries = [];

  uniqueRows.forEach(row => {
    const masjidId = 'ms' + shortHash(row[9]);
    const qrId    = 'qr-' + masjidId;
    const lat     = row[7] !== '' ? parseFloat(row[7]) : null;
    const lng     = row[8] !== '' ? parseFloat(row[8]) : null;
    const status  = row[12]; // 'verified' or 'community'
    const createdAt = (typeof row[0] === 'string' && row[0]) ? row[0]
                    : (row[0] instanceof Date)               ? row[0].toISOString()
                    : now;

    masjidEntries.push({
      id:             masjidId,
      name:           row[3] || '',
      type:           'masjid',
      address:        null,
      daerah:         row[4] || '',
      state:          row[5] || '',
      postcode:       row[6] || null,
      lat:            lat,
      lng:            lng,
      google_maps_url: (lat && lng) ? `https://www.google.com/maps?q=${lat},${lng}` : null,
      image_url:      null,
      status:         status,
      verified_by:    status === 'verified' ? 'admin' : 'community',
      verified_at:    now,
      infaq_count:    0,
      featured_dates: [],
      ramadan_priority: false,
      created_at:     createdAt,
      updated_at:     now
    });

    qrEntries.push({
      id:                 qrId,
      masjid_id:          masjidId,
      duitnow_string:     row[9],
      merchant_id:        null,
      account_name:       (row[3] || '').toUpperCase(),
      account_number:     null,
      bank_name:          null,
      qr_type:            'static',
      qr_image_url:       null,
      is_primary:         true,
      type:               'general',
      status:             'active',
      submitted_by_email: null,
      submitted_by_phone: row[2] || null,
      created_at:         createdAt
    });
  });

  // Write to JSON_Export tab
  let exportSheet = ss.getSheetByName('JSON_Export');
  if (!exportSheet) {
    exportSheet = ss.insertSheet('JSON_Export');
  } else {
    exportSheet.clear();
  }

  exportSheet.getRange('A1').setValue('=== APPEND these into data/masjid.json ===');
  exportSheet.getRange('A1').setFontWeight('bold');
  exportSheet.getRange('A2').setValue(JSON.stringify(masjidEntries, null, 2));

  exportSheet.getRange('A4').setValue('=== APPEND these into data/qr_code.json ===');
  exportSheet.getRange('A4').setFontWeight('bold');
  exportSheet.getRange('A5').setValue(JSON.stringify(qrEntries, null, 2));

  exportSheet.getRange('A7').setValue('=== BUMP data/version.json — update masjid + qr_code dates to today ===');
  exportSheet.getRange('A7').setFontWeight('bold');
  exportSheet.getRange('A8').setValue(JSON.stringify({
    dataVersion: now.slice(0, 10),
    files: {
      masjid:   now.slice(0, 10),
      qr_code:  now.slice(0, 10),
      kempen:   '(keep existing)',
      hikmah:   '(keep existing)'
    }
  }, null, 2));

  exportSheet.setColumnWidth(1, 700);
  exportSheet.getRange('A2').setWrap(false);
  exportSheet.getRange('A5').setWrap(false);
  exportSheet.getRange('A8').setWrap(false);

  ss.setActiveSheet(exportSheet);
  SpreadsheetApp.getUi().alert(
    `✅ Selesai! ${uniqueRows.length} masjid dijana.\n\n` +
    `Langkah seterusnya:\n` +
    `1. Salin isi A2 → tampal ke data/masjid.json (dalam array)\n` +
    `2. Salin isi A5 → tampal ke data/qr_code.json (dalam array)\n` +
    `3. Kemaskini data/version.json (tengok A8)\n` +
    `4. git push → selesai!`
  );
}

// ── Short deterministic ID from DuitNow string ───────────────────
function shortHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return Math.abs(h).toString(36).substring(0, 6);
}
