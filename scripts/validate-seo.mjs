import fs from 'node:fs';
import path from 'node:path';
import { resolvePublicRoutes } from './seo-routes.mjs';
import { getSeoEntry, siteUrl } from './seo-page-data.mjs';

const rootDir = process.cwd();
const routes = resolvePublicRoutes();
const titles = new Map();
const descriptions = new Map();
const errors = [];

const assert = (condition, message) => {
  if (!condition) {
    errors.push(message);
  }
};

for (const route of routes) {
  const entry = getSeoEntry(route);
  assert(entry.title && entry.title.length <= 70, `${route}: missing or overlong title`);
  assert(entry.description && entry.description.length <= 180, `${route}: missing or overlong description`);
  assert(entry.path === route, `${route}: SEO entry path mismatch`);
  assert(`${siteUrl}${route === '/' ? '/' : route}`.startsWith('https://'), `${route}: canonical must use HTTPS`);

  const imagePath = path.join(rootDir, 'public', entry.image || '');
  assert(entry.image?.startsWith('/images/'), `${route}: image should be a public image path`);
  assert(fs.existsSync(imagePath), `${route}: image missing at ${entry.image}`);

  const titleOwner = titles.get(entry.title);
  assert(!titleOwner, `${route}: duplicate title also used by ${titleOwner}`);
  titles.set(entry.title, route);

  const descriptionOwner = descriptions.get(entry.description);
  assert(!descriptionOwner, `${route}: duplicate description also used by ${descriptionOwner}`);
  descriptions.set(entry.description, route);
}

if (errors.length > 0) {
  console.error(`SEO validation failed with ${errors.length} issue${errors.length === 1 ? '' : 's'}:`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`SEO validation passed for ${routes.length} public route${routes.length === 1 ? '' : 's'}.`);
