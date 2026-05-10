// QRSedekah — Google Apps Script
// Deployed at: https://script.google.com/macros/s/AKfycbzJzDkn8_tynoOG9La0RKApF9mWlkkO_Bp0f830xlkoXn0x7_qpC_Jzn2ISnNV-3FqA/exec
// Sheet: Sumbangan
// Last updated: 2026-05-11

const SHEET_NAME = 'Sumbangan';
const COMMUNITY_THRESHOLD = 3;

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
