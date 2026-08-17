import fs from 'node:fs';
import path from 'node:path';
import { blogArticles } from '../src/blogData.js';
import { authorityRoutes } from '../src/authorityData.js';
import { factoryRoutes } from '../src/factoryData.js';

const rootDir = process.cwd();
const mainSourcePath = path.join(rootDir, 'src', 'main.jsx');

const coreRoutes = [
  '/',
  '/products',
  '/products/pet-training-pads',
  '/products/pet-diapers',
  '/products/adult-underpads',
  '/products/disposable-cleaning-products',
  '/products/garbage-bags',
];

export const nonIndexableRoutes = [
  '/request-product-plan',
  '/sign-in',
];

const excludedRoutePatterns = [
  /^\/404\/?$/,
  /^\/admin(?:\/|$)/,
  /^\/private(?:\/|$)/,
  /^\/dev(?:\/|$)/,
  /^\/region(?:\/|$)/,
  /^\/(?:about|profile|projects|innovation|news|quality|advantages|customization)\/?$/,
  /^\/(?:request-product-plan|sign-in)\/?$/,
];

const normalizeRoute = (route) => {
  if (!route || route.startsWith('http') || route.includes('#')) {
    return null;
  }

  const cleanRoute = route.split('?')[0].replace(/\/+$/, '') || '/';
  return cleanRoute.startsWith('/') ? cleanRoute : `/${cleanRoute}`;
};

const addRoute = (routes, route) => {
  const normalizedRoute = normalizeRoute(route);

  if (!normalizedRoute) {
    return;
  }

  if (excludedRoutePatterns.some((pattern) => pattern.test(normalizedRoute))) {
    return;
  }

  routes.add(normalizedRoute);
};

const findDeclarationBlock = (source, declaration, openChar, closeChar) => {
  const declarationIndex = source.indexOf(declaration);

  if (declarationIndex === -1) {
    return '';
  }

  const blockStart = source.indexOf(openChar, declarationIndex);

  if (blockStart === -1) {
    return '';
  }

  let depth = 0;
  let quote = '';
  let escaped = false;

  for (let index = blockStart; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = '';
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }

    if (char === openChar) {
      depth += 1;
      continue;
    }

    if (char === closeChar) {
      depth -= 1;

      if (depth === 0) {
        return source.slice(blockStart, index + 1);
      }
    }
  }

  return '';
};

const evaluateSourceArray = (source, declaration, dependencies = {}) => {
  const block = findDeclarationBlock(source, declaration, '[', ']');

  if (!block) {
    return [];
  }

  const dependencyNames = Object.keys(dependencies);
  const dependencyValues = Object.values(dependencies);
  return Function(...dependencyNames, `"use strict"; return (${block});`)(...dependencyValues);
};

export const resolveMainSourceContent = () => {
  const source = fs.readFileSync(mainSourcePath, 'utf8');
  const b2bImage = (name) => `/images/generated-site/b2b-optimization/${name}.webp`;

  return {
    businessPages: evaluateSourceArray(source, 'const businessSeoPages', { b2bImage }),
    products: evaluateSourceArray(source, 'const customProducts'),
    newsArticles: evaluateSourceArray(source, 'const newsArticles'),
  };
};

const addMatches = (routes, text, pattern, routeBuilder = (match) => match[1]) => {
  for (const match of text.matchAll(pattern)) {
    addRoute(routes, routeBuilder(match));
  }
};

export const resolvePublicRoutes = () => {
  const source = fs.readFileSync(mainSourcePath, 'utf8');
  const routes = new Set();

  coreRoutes.forEach((route) => addRoute(routes, route));

  const customProductsBlock = findDeclarationBlock(source, 'const customProducts', '[', ']');
  const newsArticlesBlock = findDeclarationBlock(source, 'const newsArticles', '[', ']');
  const regionLinksBlock = findDeclarationBlock(source, 'const regionLinks', '[', ']');
  const footerLinksBlock = findDeclarationBlock(source, 'const footerLinks', '[', ']');
  const businessSeoPagesBlock = findDeclarationBlock(source, 'const businessSeoPages', '[', ']');
  const staticSeoPagesBlock = findDeclarationBlock(source, 'const staticSeoPages', '{', '}');

  addMatches(routes, customProductsBlock, /slug:\s*['"]([^'"]+)['"]/g, (match) => `/products/${match[1]}`);
  addMatches(routes, newsArticlesBlock, /slug:\s*['"]([^'"]+)['"]/g, (match) => `/pages/news/${match[1]}`);
  addMatches(routes, regionLinksBlock, /href:\s*['"]([^'"]+)['"]/g);
  addMatches(routes, footerLinksBlock, /href:\s*['"]([^'"]+)['"]/g);
  addMatches(routes, businessSeoPagesBlock, /path:\s*['"]([^'"]+)['"]/g);
  addMatches(routes, staticSeoPagesBlock, /['"]([^'"]+)['"]\s*:/g);

  addRoute(routes, '/pages/news');
  addRoute(routes, '/blog');
  blogArticles.forEach((article) => addRoute(routes, article.path));
  authorityRoutes.forEach((route) => addRoute(routes, route));
  factoryRoutes.forEach((route) => addRoute(routes, route));

  return Array.from(routes).sort((a, b) => a.localeCompare(b));
};

export const resolveStaticRoutes = () => Array.from(new Set([
  ...resolvePublicRoutes(),
  ...nonIndexableRoutes,
])).sort((a, b) => a.localeCompare(b));
