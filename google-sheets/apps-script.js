/**
 * RevLine → Google Sheets webhook
 * ------------------------------------------------------------
 * SETUP (one time, ~5 minutes):
 * 1. Create a Google Sheet named "RevLine Registrations".
 * 2. Extensions → Apps Script. Delete the sample code, paste this file.
 * 3. Click Deploy → New deployment → type: Web app.
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Click Deploy, authorise with your Google account, and copy the
 *    Web app URL (ends in /exec).
 * 5. Put that URL in the website's .env.local / Vercel env as:
 *      SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
 *
 * Each registration appends a row: one tab per event, created
 * automatically, plus an "All Registrations" master tab.
 */

var HEADERS = ["Timestamp", "Event", "Name", "Age", "Phone", "Email", "Status", "Answers"];

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var row = [
      new Date(body.date || Date.now()),
      body.event || "",
      body.name || "",
      body.age || "",
      "'" + (body.phone || ""), // leading quote keeps +91… as text
      body.email || "",
      body.status || "",
      body.answers || "",
    ];

    appendTo("All Registrations", row);
    appendTo(sheetNameFor(body.event), row);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function appendTo(name, row) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  sheet.appendRow(row);
}

function sheetNameFor(eventTitle) {
  var name = (eventTitle || "Unknown Event").substring(0, 90);
  // Sheet names can't contain some characters
  return name.replace(/[\[\]\*\/\\\?:]/g, "-");
}
