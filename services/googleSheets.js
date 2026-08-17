import { google } from 'googleapis';

const defaultSheetName = '\u5de5\u4f5c\u88681';

function getSheetRange() {
  const sheetName = process.env.GOOGLE_SHEET_NAME || defaultSheetName;

  return `${sheetName}!A:Q`;
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
    inquiry.companyWebsite || '',
    inquiry.jobRole || '',
    inquiry.product || '',
    inquiry.quantity || '',
    inquiry.requiredSize || '',
    inquiry.packagingRequirement || '',
    inquiry.message || '',
    inquiry.pageUrl || '',
    inquiry.ip || '',
    inquiry.userAgent || '',
    JSON.stringify(inquiry.leadSource || {}),
  ];
}

function isNotFoundError(error) {
  return error?.code === 404 || error?.response?.status === 404;
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
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const range = getSheetRange();

  try {
    await sheets.spreadsheets.get(
      { spreadsheetId },
      { timeout: 5000 },
    );
  } catch (error) {
    console.error('Spreadsheet GET failed status:', error.response?.status);
    console.error('Spreadsheet GET failed data:', error.response?.data);
    console.error('Spreadsheet GET failed message:', error.message);

    throw error;
  }

  try {
    await sheets.spreadsheets.values.append(
      {
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [buildRow(inquiry)],
        },
      },
      { timeout: 5000 },
    );
  } catch (error) {
    if (isNotFoundError(error)) {
      console.error('Google Sheets append 404 response data:', error.response?.data);
    }

    throw error;
  }

  return { ok: true };
}
