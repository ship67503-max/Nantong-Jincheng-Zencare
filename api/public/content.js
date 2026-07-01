import fs from 'node:fs';
import path from 'node:path';

const allowedTypes = new Set(['product', 'news', 'banner', 'seo']);
const contentRoot = path.join(process.cwd(), 'data', 'jcz-business-center');

function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function readType(type) {
  if (!allowedTypes.has(type)) {
    return [];
  }

  const folder = path.join(contentRoot, type);
  if (!fs.existsSync(folder)) {
    return [];
  }

  return fs
    .readdirSync(folder)
    .filter((file) => file.endsWith('.json'))
    .map((file) => readJsonFile(path.join(folder, file)))
    .filter(Boolean)
    .filter((item) => item.status === 'published')
    .map((item) => ({
      type: item.type || type,
      title: item.title,
      slug: item.slug,
      status: item.status,
      data: item.data || {},
      updatedAt: item.updatedAt,
    }))
    .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const requestedType = String(req.query.type || '').trim();
  const types = allowedTypes.has(requestedType) ? [requestedType] : Array.from(allowedTypes);
  const items = types.flatMap(readType);

  res.status(200).json({ items });
}
