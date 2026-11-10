import fs from 'node:fs/promises';
import path from 'node:path';
import { google } from 'googleapis';

const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || 'https://www.jczcare.com/';
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const startDate = process.argv[2] || '2026-07-25';
const endDate = process.argv[3] || '2026-10-26';
const outputPath = process.argv[4] || `output/search-console-${startDate}-to-${endDate}.json`;

if (!credentialsPath) {
  throw new Error('Set GOOGLE_APPLICATION_CREDENTIALS to the local service-account JSON path.');
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate) || startDate > endDate) {
  throw new Error('Dates must be valid YYYY-MM-DD values, with startDate before or equal to endDate.');
}

const auth = new google.auth.GoogleAuth({
  keyFile: path.resolve(credentialsPath),
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});
const searchConsole = google.searchconsole({ version: 'v1', auth });
const dimensions = async (keys) => {
  const response = await searchConsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: keys,
      rowLimit: 25000,
      dataState: 'final',
    },
  });
  return response.data.rows || [];
};

let pages;
let queries;
let pageQueries;
try {
  [pages, queries, pageQueries] = await Promise.all([
    dimensions(['page']),
    dimensions(['query']),
    dimensions(['page', 'query']),
  ]);
} catch (error) {
  const code = error?.code || error?.response?.data?.error?.status || 'UNKNOWN';
  const reason = error?.response?.data?.error?.message || error?.message || 'Unknown API error';
  console.error(`Search Console request failed (${code}): ${reason}`);
  if (code === 'ETIMEDOUT' || code === 'ECONNRESET' || code === 'ENOTFOUND') {
    console.error('Check network access to oauth2.googleapis.com and searchconsole.googleapis.com, then rerun.');
  }
  process.exitCode = 1;
  process.exit();
}
const result = {
  siteUrl,
  startDate,
  endDate,
  generatedAt: new Date().toISOString(),
  pages,
  queries,
  pageQueries,
};
const resolvedOutput = path.resolve(outputPath);
await fs.mkdir(path.dirname(resolvedOutput), { recursive: true });
await fs.writeFile(resolvedOutput, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
console.log(`Saved Search Console report to ${resolvedOutput}`);
console.log(`Rows: ${pages.length} pages, ${queries.length} queries, ${pageQueries.length} page-query pairs`);
