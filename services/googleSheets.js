import { google } from 'googleapis';

const defaultSheetName = '工作表1';

function getSheetRange() {
  const sheetName = process.env.GOOGLE_SHEET_NAME || defaultSheetName;
  const escapedSheetName = sheetName.replace(/'/g, "''");

  return `'${escapedSheetName}'!A:L`;
}

function getGooglePrivateKey() {
  return process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
}

function hasGoogleSheetsConfig() {
  return Boolean(
    process.env.GOOGLE_PROJECT_ID
      && process.env.GOOGLE_CLIENT_EMAIL
      && getGooglePrivateKey()
      && process.env.GOOGLE_SHEET_ID,
  );
}

function buildRow(inquiry) {
  return [
    inquiry.submittedAt,
    inquiry.companyName || '',
    inquiry.name || '',
    inquiry.email || '',
    inquiry.phone || '',
    inquiry.country || '',
    inquiry.product || '',
    inquiry.quantity || '',
    inquiry.message || '',
    inquiry.pageUrl || '',
    inquiry.ip || '',
    inquiry.userAgent || '',
  ];
}

export async function appendInquiryToGoogleSheets(inquiry) {
  if (!hasGoogleSheetsConfig()) {
    throw new Error('Missing Google Sheets environment variables.');
  }

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: getGooglePrivateKey(),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    projectId: process.env.GOOGLE_PROJECT_ID,
  });

  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: getSheetRange(),
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [buildRow(inquiry)],
    },
  });

  console.log('Google Sheets append succeeded');

  return { ok: true };
}
