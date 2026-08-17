import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';
import { defineConfig } from 'vite';
import { resolvePublicRoutes } from './scripts/seo-routes.mjs';

const hostname = 'https://www.jczcare.com';
const dynamicRoutes = resolvePublicRoutes().filter((route) => route !== '/');
const contentDataModules = [
  'authorityData.js',
  'blogData.js',
  'blogExpansionData.js',
  'contentEcosystemAuthorityData.js',
  'contentEcosystemBlogData.js',
  'factoryData.js',
  'seoGrowthArticles.js',
  'topicClusters.js',
];

const createManualChunk = (id) => {
  const normalizedId = id.replace(/\\/g, '/');

  if (contentDataModules.some((fileName) => normalizedId.endsWith(`/src/${fileName}`))) {
    return 'content-data';
  }

  if (!normalizedId.includes('/node_modules/')) {
    return undefined;
  }

  if (normalizedId.includes('/node_modules/three/')) {
    return 'three-core';
  }

  if (
    normalizedId.includes('/node_modules/@react-three/fiber/')
    || normalizedId.includes('/node_modules/react-reconciler/')
    || normalizedId.includes('/node_modules/its-fine/')
    || normalizedId.includes('/node_modules/suspend-react/')
    || normalizedId.includes('/node_modules/zustand/')
  ) {
    return 'three-react';
  }

  if (normalizedId.includes('/node_modules/gsap/')) {
    return 'animation-vendor';
  }

  if (
    normalizedId.includes('/node_modules/react/')
    || normalizedId.includes('/node_modules/react-dom/')
    || normalizedId.includes('/node_modules/scheduler/')
  ) {
    return 'react-vendor';
  }

  if (normalizedId.includes('/node_modules/lucide-react/')) {
    return 'icons-vendor';
  }

  return 'vendor';
};

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
  build: {
    // Three.js is isolated behind the lazy Silk background (about 189 KB gzip).
    chunkSizeWarningLimit: 750,
    rollupOptions: {
      output: {
        manualChunks: createManualChunk,
      },
    },
  },
});
