(function () {
  var apiBase = (window.JCZ_BUSINESS_API || window.location.origin).replace(/\/$/, '');

  if (!apiBase) {
    return;
  }

  function fetchContent(type) {
    return fetch(apiBase + '/api/public/content?type=' + encodeURIComponent(type), {
      credentials: 'omit',
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('JCZ content request failed: ' + response.status);
        }
        return response.json();
      })
      .then(function (payload) {
        return payload.items || [];
      })
      .catch(function () {
        return [];
      });
  }

  function text(value) {
    return value == null ? '' : String(value);
  }

  function slugify(value) {
    return text(value)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function specsFromKeywords(value) {
    return text(value)
      .split(',')
      .map(function (item) { return item.trim(); })
      .filter(Boolean)
      .slice(0, 3);
  }

  function normalizeProduct(item) {
    var data = item.data || {};
    var title = item.title || data.title;

    if (!title) {
      return null;
    }

    var specs = specsFromKeywords(data.keywords);

    return {
      slug: item.slug || slugify(title),
      title: title,
      category: data.category || data.metaTitle || 'JCZ Business Center',
      image: data.imageUrl || '/images/custom-disposable-pet-pads-premium.png',
      badge: data.price || 'Managed',
      specs: specs.length ? specs : ['OEM / ODM', 'Custom specs', 'Factory direct'],
    };
  }

  function updateMeta(name, value) {
    if (!value) {
      return;
    }

    var meta = document.querySelector('meta[name="' + name + '"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', text(value));
  }

  function applySeo(items) {
    var seo = items[0] && items[0].data;
    if (!seo) {
      return;
    }

    if (seo.metaTitle) {
      document.title = text(seo.metaTitle);
    }
    updateMeta('description', seo.metaDescription);
    updateMeta('keywords', seo.keywords);
  }

  function applyBanner(items) {
    var banner = items[0] && items[0].data;
    if (!banner) {
      return;
    }

    var focus = document.querySelector('.hero-title-focus');
    var source = document.querySelector('.hero-title-source');
    var copy = document.querySelector('.hero-copy span');

    if (focus && banner.metaTitle) {
      focus.textContent = text(banner.metaTitle);
    }
    if (source && banner.summary) {
      source.textContent = text(banner.summary);
    }
    if (copy && banner.metaDescription) {
      copy.textContent = text(banner.metaDescription);
    }
  }

  function productCard(product) {
    return [
      '<article class="custom-product-card">',
      '<div class="custom-product-media">',
      '<img src="' + text(product.image) + '" alt="' + text(product.title).replace(/"/g, '&quot;') + '" loading="lazy" />',
      '<span>' + text(product.badge) + '</span>',
      '</div>',
      '<div class="custom-product-body">',
      '<p>' + text(product.category) + '</p>',
      '<h3>' + text(product.title) + '</h3>',
      '<div class="custom-specs">' + product.specs.map(function (spec) { return '<span>' + text(spec) + '</span>'; }).join('') + '</div>',
      '<a href="/products/' + text(product.slug) + '">Know more...</a>',
      '</div>',
      '</article>',
    ].join('');
  }

  function applyProducts(items) {
    var products = items.map(normalizeProduct).filter(Boolean);
    var grid = document.querySelector('.custom-product-grid');

    if (!grid || !products.length) {
      return;
    }

    grid.innerHTML = products.map(productCard).join('');

    var toolbar = document.querySelector('.customization-toolbar > div:first-child span');
    if (toolbar && toolbar.textContent.indexOf('JCZ Business Center') === -1) {
      toolbar.textContent = toolbar.textContent.trim() + ' Managed by JCZ Business Center.';
    }
  }

  function waitForApp(callback) {
    var attempts = 0;
    var timer = window.setInterval(function () {
      attempts += 1;
      if (document.querySelector('.custom-product-grid') || attempts > 40) {
        window.clearInterval(timer);
        callback();
      }
    }, 250);
  }

  function boot() {
    waitForApp(function () {
      fetchContent('seo').then(applySeo);
      fetchContent('banner').then(applyBanner);
      fetchContent('product').then(applyProducts);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
