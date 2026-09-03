import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';
import { defineConfig } from 'vite';
import { resolvePublicRoutes } from './scripts/seo-routes.mjs';

const hostname = 'https://www.jczcare.com';
const dynamicRoutes = resolvePublicRoutes().filter((route) => route !== '/');

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname,
      dynamicRoutes,
      exclude: ['/404', '/admin', '/private', '/dev'],
      readable: true,
      changefreq: {
        '*': 'monthly',
        '/': 'weekly',
        '/blog': 'weekly',
        '/news': 'weekly',
        '/pages/news': 'weekly',
      },
      priority: {
        '*': 0.7,
        '/': 1,
        '/oem-pet-pee-pads': 0.95,
        '/private-label-pet-pads': 0.95,
        '/pet-pee-pad-manufacturer': 0.95,
        '/pet-pad-factory': 0.95,
        '/quality-control': 0.9,
        '/oem-process': 0.9,
        '/contact': 0.9,
        '/customization': 0.85,
        '/blog': 0.85,
        '/faq': 0.85,
      },
      generateRobotsTxt: true,
      robots: [{ userAgent: '*', allow: '/' }],
    }),
  ],
});
