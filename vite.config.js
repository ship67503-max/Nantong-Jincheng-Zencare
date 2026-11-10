import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';
import { defineConfig } from 'vite';
import { resolvePublicRoutes } from './scripts/seo-routes.mjs';

const hostname = 'https://www.jczcare.com';
const dynamicRoutes = resolvePublicRoutes().filter((route) => route !== '/');

const storefrontDevRoot = () => ({
  name: 'storefront-dev-root',
  configureServer(server) {
    server.middlewares.use((request, _response, next) => {
      const pathname = request.url?.split('?')[0] || '/';
      const isPageRequest = request.method === 'GET'
        && !pathname.startsWith('/@')
        && !pathname.startsWith('/src/')
        && !pathname.startsWith('/node_modules/')
        && !pathname.startsWith('/images/')
        && !pathname.startsWith('/videos/')
        && !pathname.startsWith('/assets/')
        && !pathname.startsWith('/api/')
        && !/\.[a-z0-9]+$/i.test(pathname);
      if (isPageRequest) {
        request.url = '/storefront.html';
      }
      next();
    });
  },
});

export default defineConfig({
  build: {
    rollupOptions: { input: { legacy: 'index.html', storefront: 'storefront.html' } },
  },
  plugins: [
    react(),
    storefrontDevRoot(),
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
