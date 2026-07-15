import { google } from 'googleapis';

const defaultSheetName = '\u5de5\u4f5c\u88681';

function getSheetRange() {
  const sheetName = process.env.GOOGLE_SHEET_NAME || defaultSheetName;

  return `${sheetName}!A:L`;
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

function isNotFoundError(error) {
  return error?.code === 404 || error?.response?.status === 404;
}

export async function appendInquiryToGoogleSheets(inquiry) {
  if (!hasGoogleSheetsConfig()) {
    throw new Error('Missing Google Sheets environment variables.');
  }

  console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID);
  console.log('GOOGLE_SHEET_NAME:', process.env.GOOGLE_SHEET_NAME);

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: getGooglePrivateKey(),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    projectId: process.env.GOOGLE_PROJECT_ID,
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const range = getSheetRange();

  try {
    await sheets.spreadsheets.get({
      spreadsheetId,
    });
    console.log('Spreadsheet GET success');
  } catch (error) {
    console.error('Spreadsheet GET failed', error);

    if (isNotFoundError(error)) {
      console.error('Spreadsheet GET 404 response data:', error.response?.data);
    }

    throw error;
  }

  console.log('Using spreadsheetId:', spreadsheetId);
  console.log('Using range:', range);

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [buildRow(inquiry)],
      },
    });
  } catch (error) {
    if (isNotFoundError(error)) {
      console.error('Google Sheets append 404 response data:', error.response?.data);
    }

    throw error;
  }

  console.log('Google Sheets append succeeded');

  return { ok: true };
}
