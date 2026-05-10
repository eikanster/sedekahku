// QRSedekah — Google Apps Script
// Deployed at: https://script.google.com/macros/s/AKfycbzJzDkn8_tynoOG9La0RKApF9mWlkkO_Bp0f830xlkoXn0x7_qpC_Jzn2ISnNV-3FqA/exec
// Sheet: Sumbangan
// Last updated: 2026-05-11
//
// Columns (1-based):
// A=Timestamp B=Nama C=Telefon D=Nama Masjid E=Daerah F=Negeri G=Poskod
// H=Lat I=Lng J=DuitNow String K=Sumber Imbasan L=Masa Imbasan M=Status N=Jenis

const SHEET_NAME = 'Sumbangan';
const COMMUNITY_THRESHOLD = 3;
const TOTAL_COLS = 14;

// ── Receive community submissions ────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp','Nama','Telefon','Nama Masjid',
        'Daerah','Negeri','Poskod','Lat','Lng',
        'DuitNow String','Sumber Imbasan','Masa Imbasan','Status','Jenis'
      ]);
    }

    const entries = Array.isArray(data) ? data : [data];
    entries.forEach(entry => {
      sheet.appendRow([
        new Date().toISOString(),    // A Timestamp
        entry.submitter_name || '',  // B Nama
        entry.submitter_phone || '', // C Telefon
        entry.name || '',            // D Nama Masjid
        entry.daerah || '',          // E Daerah
        entry.state || '',           // F Negeri
        entry.postcode || '',        // G Poskod
        entry.lat || '',             // H Lat
        entry.lng || '',             // I Lng
        entry.qr_string || '',       // J DuitNow String
        entry.source || 'unknown',   // K Sumber Imbasan
        entry.scanned_at || '',      // L Masa Imbasan
        'pending',                   // M Status
        entry.type || 'masjid'       // N Jenis
      ]);
      checkCommunityPromotion(sheet, entry.qr_string);
    });

    return jsonResponse({ result: 'success', count: entries.length });
  } catch(err) {
    return jsonResponse({ result: 'error', message: err.toString() });
  }
}

// ── Serve verified data to app (GET request) ─────────────────────
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {
      return jsonResponse({ version: todayDate(), count: 0, masjid: [], qr_code: [] });
    }

    const allData = sheet.getRange(2, 1, lastRow - 1, TOTAL_COLS).getValues();

    // Col index (0-based): D=3,E=4,F=5,G=6,H=7,I=8,J=9,K=10,L=11,M=12,N=13
    const approved = allData.filter(row =>
      row[12] === 'verified' || row[12] === 'community'
    );

    // Deduplicate by DuitNow string — prefer row with GPS
    const seen = {};
    approved.forEach(row => {
      const qr = row[9];
      if (!qr) return;
      if (!seen[qr]) {
        seen[qr] = row;
      } else if (!seen[qr][7] && row[7]) {
        seen[qr] = row;
      }
    });

    const uniqueRows = Object.values(seen);
    const now = new Date().toISOString();
    const masjid = [];
    const qr_code = [];

    uniqueRows.forEach(row => {
      const masjidId  = 'ms' + shortHash(row[9]);
      const qrId      = 'qr-' + masjidId;
      const lat       = row[7] !== '' ? parseFloat(row[7]) : null;
      const lng       = row[8] !== '' ? parseFloat(row[8]) : null;
      const status    = row[12];
      const jenis     = row[13] || 'masjid';
      const createdAt = (typeof row[11] === 'string' && row[11]) ? row[11]
                      : (row[11] instanceof Date)                ? row[11].toISOString()
                      : now;

      masjid.push({
        id: masjidId, name: row[3] || '', type: jenis,
        address: null, daerah: row[4] || '', state: row[5] || '',
        postcode: row[6] || null, lat: lat, lng: lng,
        google_maps_url: (lat && lng) ? `https://www.google.com/maps?q=${lat},${lng}` : null,
        image_url: null, status: status,
        verified_by: status === 'verified' ? 'admin' : 'community',
        verified_at: now, infaq_count: 0, featured_dates: [],
        ramadan_priority: false, created_at: createdAt, updated_at: now
      });

      qr_code.push({
        id: qrId, masjid_id: masjidId, duitnow_string: row[9],
        merchant_id: extractMerchantId(row[9]),
        account_name: (row[3] || '').toUpperCase(),
        account_number: null, bank_name: null, qr_type: 'static',
        qr_image_url: null, is_primary: true, type: 'general',
        status: 'active', submitted_by_email: null,
        submitted_by_phone: row[2] || null, created_at: createdAt
      });
    });

    return jsonResponse({ version: todayDate(), count: uniqueRows.length, masjid, qr_code });

  } catch(err) {
    return jsonResponse({ error: err.toString() });
  }
}

// ── Auto-promote to community if 3+ unique phones submit same QR ─
function checkCommunityPromotion(sheet, qrString) {
  if (!qrString) return;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const allData = sheet.getRange(2, 1, lastRow - 1, TOTAL_COLS).getValues();

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

// ── Generate JSON_Export tab for manual publish ───────────────────
function generateJSON() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert('Tiada data dalam sheet.');
    return;
  }

  const allData = sheet.getRange(2, 1, lastRow - 1, TOTAL_COLS).getValues();
  const approved = allData.filter(row =>
    row[12] === 'verified' || row[12] === 'community'
  );

  if (approved.length === 0) {
    SpreadsheetApp.getUi().alert('Tiada baris dengan status verified atau community.');
    return;
  }

  const seen = {};
  approved.forEach(row => {
    const qr = row[9];
    if (!qr) return;
    if (!seen[qr]) {
      seen[qr] = row;
    } else if (!seen[qr][7] && row[7]) {
      seen[qr] = row;
    }
  });

  const uniqueRows = Object.values(seen);
  const now = new Date().toISOString();
  const masjidEntries = [];
  const qrEntries = [];

  uniqueRows.forEach(row => {
    const masjidId  = 'ms' + shortHash(row[9]);
    const qrId      = 'qr-' + masjidId;
    const lat       = row[7] !== '' ? parseFloat(row[7]) : null;
    const lng       = row[8] !== '' ? parseFloat(row[8]) : null;
    const status    = row[12];
    const jenis     = row[13] || 'masjid';
    const createdAt = (typeof row[11] === 'string' && row[11]) ? row[11]
                    : (row[11] instanceof Date)                ? row[11].toISOString()
                    : now;

    masjidEntries.push({
      id: masjidId, name: row[3] || '', type: jenis,
      address: null, daerah: row[4] || '', state: row[5] || '',
      postcode: row[6] || null, lat: lat, lng: lng,
      google_maps_url: (lat && lng) ? `https://www.google.com/maps?q=${lat},${lng}` : null,
      image_url: null, status: status,
      verified_by: status === 'verified' ? 'admin' : 'community',
      verified_at: now, infaq_count: 0, featured_dates: [],
      ramadan_priority: false, created_at: createdAt, updated_at: now
    });

    qrEntries.push({
      id: qrId, masjid_id: masjidId, duitnow_string: row[9],
      merchant_id: extractMerchantId(row[9]),
      account_name: (row[3] || '').toUpperCase(),
      account_number: null, bank_name: null, qr_type: 'static',
      qr_image_url: null, is_primary: true, type: 'general',
      status: 'active', submitted_by_email: null,
      submitted_by_phone: row[2] || null, created_at: createdAt
    });
  });

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
  exportSheet.getRange('A7').setValue('=== BUMP data/version.json ===');
  exportSheet.getRange('A7').setFontWeight('bold');
  exportSheet.getRange('A8').setValue(JSON.stringify({
    dataVersion: todayDate(),
    files: { masjid: todayDate(), qr_code: todayDate(), kempen: '(keep)', hikmah: '(keep)' }
  }, null, 2));

  exportSheet.setColumnWidth(1, 700);
  ss.setActiveSheet(exportSheet);
  SpreadsheetApp.getUi().alert(
    `✅ Selesai! ${uniqueRows.length} masjid dijana.\n\n` +
    `1. Salin A2 → tampal ke data/masjid.json\n` +
    `2. Salin A5 → tampal ke data/qr_code.json\n` +
    `3. Kemaskini version.json (tengok A8)\n` +
    `4. git push`
  );
}

// ── Helpers ───────────────────────────────────────────────────────
function shortHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return Math.abs(h).toString(36).substring(0, 6);
}

// Extract QRMID merchant ID from DuitNow EMVCo string
function extractMerchantId(raw) {
  if (!raw || raw.length < 10) return null;
  try {
    let i = 0;
    while (i < raw.length) {
      const tag = raw.substring(i, i + 2);
      const len = parseInt(raw.substring(i + 2, i + 4), 10);
      const val = raw.substring(i + 4, i + 4 + len);
      if (tag === '26') {
        // Parse sub-tags inside tag 26
        let j = 0;
        while (j < val.length) {
          const stag = val.substring(j, j + 2);
          const slen = parseInt(val.substring(j + 2, j + 4), 10);
          const sval = val.substring(j + 4, j + 4 + slen);
          if (stag === '01') return sval; // QRMID
          j += 4 + slen;
        }
      }
      i += 4 + len;
    }
  } catch(e) {}
  return null;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}
