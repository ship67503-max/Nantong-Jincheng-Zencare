import { google } from 'googleapis';

const defaultSheetName = '\u5de5\u4f5c\u88681';

export function getSheetRange() {
  const sheetName = process.env.GOOGLE_SHEET_NAME || defaultSheetName;

  return `'${sheetName.replace(/'/g, "''")}'!A:O`;
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
    inquiry.product || '',
    inquiry.quantity || '',
    inquiry.requiredSize || '',
    inquiry.packagingRequirement || '',
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
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: 'sheets.properties.title',
    });
    const sheetName = process.env.GOOGLE_SHEET_NAME || defaultSheetName;
    if (!metadata.data.sheets?.some(sheet => sheet.properties?.title === sheetName)) {
      throw new Error('Configured inquiry worksheet does not exist. Check GOOGLE_SHEET_NAME.');
    }
  } catch (error) {
    console.error('Spreadsheet GET failed status:', error.response?.status);
    console.error('Spreadsheet GET failed message:', error.message);

    throw error;
  }

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
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

export async function appendContactClickToGoogleSheets(click) {
  if (!hasGoogleSheetsConfig() || !process.env.GOOGLE_CLICK_SHEET_ID) {
    throw new Error('Missing Google click sheet environment variables.');
  }

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: getGooglePrivateKey(),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    projectId: process.env.GOOGLE_PROJECT_ID,
  });
  const sheets = google.sheets({ version: 'v4', auth });
  const sheetName = process.env.GOOGLE_CLICK_SHEET_NAME || '工作表1';
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_CLICK_SHEET_ID,
    range: `'${sheetName.replace(/'/g, "''")}'!A:J`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [[
        click.timestamp,
        click.channel,
        click.pageUrl,
        click.referrer,
        click.device,
        click.language,
        click.utmSource,
        click.utmMedium,
        click.utmCampaign,
        click.sessionId,
      ]],
    },
  });
  return { ok: true };
}
