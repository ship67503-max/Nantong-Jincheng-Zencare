export function initInsights(root) {
  const search = root.querySelector('[data-insights-search]');
  if (!search) return;
  const select = root.querySelector('[data-insights-category]');
  const cards = [...root.querySelectorAll('[data-insight-card]')];
  function filter() {
    const query = search.value.trim().toLowerCase();
    let count = 0;
    cards.forEach(card => {
      const matches = (!select.value || card.dataset.category === select.value) && (!query || card.textContent.toLowerCase().includes(query));
      card.hidden = !matches;
      if (matches) count++;
    });
    root.querySelector('[data-insights-count]').textContent = `${count} articles`;
    root.querySelector('[data-insights-empty]').hidden = count !== 0;
  }
  search.value = new URLSearchParams(location.search).get('search') || '';
  search.addEventListener('input', filter);
  select.addEventListener('change', filter);
  filter();
}
