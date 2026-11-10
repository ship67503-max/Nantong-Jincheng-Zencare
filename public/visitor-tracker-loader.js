(() => {
  const configuredOrigin = document.querySelector('meta[name="visitor-dashboard-origin"]')?.content?.trim();
  const localOrigin = ['localhost', '127.0.0.1'].includes(location.hostname) ? 'http://localhost:8787' : '';
  const dashboardOrigin = configuredOrigin || localOrigin;
  if (!dashboardOrigin) return;
  const script = document.createElement('script');
  script.defer = true;
  script.src = `${dashboardOrigin.replace(/\/$/, '')}/tracker.js`;
  script.dataset.siteId = 'demo-site';
  document.head.append(script);
})();
