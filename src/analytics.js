export const GA_MEASUREMENT_ID = 'G-7WBQ3V257N';

const googleTagScriptId = 'jczcare-google-tag';
const analyticsStateKey = '__jczcareGa4State';
const attributionStorageKey = 'jczcare-ga4-attribution';
const formStartStoragePrefix = 'jczcare-ga4-form-start:';
const productionHostnames = new Set(['jczcare.com', 'www.jczcare.com']);
const customEventNames = new Set([
  'form_start',
  'generate_lead',
  'form_submit_success',
  'form_error',
  'contact_whatsapp',
  'contact_email',
  'request_sample',
]);
const allowedEventParameters = new Set([
  'form_name',
  'page_path',
  'product_interest',
  'country',
  'traffic_source',
  'campaign',
  'content',
]);
const utmParameters = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_id',
];
const emailLikePattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const phoneLikePattern = /(?:\+?\d[\s().-]*){7,}/;

export const isAnalyticsEnabled = ({ hostname, isProductionBuild, debugMode = false }) => (
  debugMode || (isProductionBuild && productionHostnames.has(hostname.toLowerCase()))
);

const hasDebugParameter = (location) => (
  new URLSearchParams(location.search).get('ga_debug') === '1'
);

const getPagePath = (location) => location.pathname || '/';

const readSessionValue = (storage, key) => {
  try {
    return storage?.getItem(key) || '';
  } catch {
    return '';
  }
};

const writeSessionValue = (storage, key, value) => {
  try {
    storage?.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const sanitizeDimension = (value, maxLength = 100) => {
  const normalized = String(value || '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);

  if (!normalized || emailLikePattern.test(normalized) || phoneLikePattern.test(normalized)) {
    return undefined;
  }

  return normalized;
};

const getReferrerSource = (documentObject) => {
  try {
    return documentObject.referrer ? new URL(documentObject.referrer).hostname : '(direct)';
  } catch {
    return '(direct)';
  }
};

export const captureTrafficAttribution = ({
  location,
  documentObject,
  sessionStorage,
}) => {
  const query = new URLSearchParams(location.search);
  const incoming = Object.fromEntries(
    utmParameters
      .map((key) => [key, sanitizeDimension(query.get(key))])
      .filter(([, value]) => value),
  );

  if (Object.keys(incoming).length > 0) {
    const attribution = {
      ...incoming,
      landing_page: getPagePath(location),
    };
    writeSessionValue(sessionStorage, attributionStorageKey, JSON.stringify(attribution));
    return attribution;
  }

  try {
    const stored = JSON.parse(readSessionValue(sessionStorage, attributionStorageKey) || '{}');
    if (stored && typeof stored === 'object' && Object.keys(stored).length > 0) {
      return stored;
    }
  } catch {
    // Ignore invalid session data and rebuild attribution below.
  }

  const attribution = {
    traffic_source: sanitizeDimension(getReferrerSource(documentObject)),
    landing_page: getPagePath(location),
  };
  writeSessionValue(sessionStorage, attributionStorageKey, JSON.stringify(attribution));
  return attribution;
};

const getAttributionEventParameters = (attribution = {}) => ({
  traffic_source: attribution.utm_source || attribution.traffic_source,
  campaign: attribution.utm_campaign,
  content: attribution.utm_content,
});

const sanitizeEventParameters = (parameters, attribution, location) => {
  const combined = {
    ...getAttributionEventParameters(attribution),
    ...parameters,
    page_path: getPagePath(location),
  };

  return Object.fromEntries(
    Object.entries(combined)
      .filter(([key]) => allowedEventParameters.has(key))
      .map(([key, value]) => [key, sanitizeDimension(value)])
      .filter(([, value]) => value !== undefined),
  );
};

export const initializeGoogleAnalytics = ({
  windowObject = window,
  documentObject = document,
  isProductionBuild = import.meta.env?.PROD === true,
} = {}) => {
  const debugMode = hasDebugParameter(windowObject.location);
  const enabled = isAnalyticsEnabled({
    hostname: windowObject.location.hostname,
    isProductionBuild,
    debugMode,
  });

  if (!enabled) {
    return null;
  }

  if (windowObject[analyticsStateKey]) {
    return windowObject[analyticsStateKey];
  }

  const state = {
    attribution: captureTrafficAttribution({
      location: windowObject.location,
      documentObject,
      sessionStorage: windowObject.sessionStorage,
    }),
    debugMode,
    formStartKeys: new Set(),
    lastPagePath: null,
    sentEventKeys: new Set(),
  };
  windowObject[analyticsStateKey] = state;
  windowObject.dataLayer = windowObject.dataLayer || [];
  windowObject.gtag = windowObject.gtag || function gtag() {
    windowObject.dataLayer.push(arguments);
  };

  if (!documentObject.getElementById(googleTagScriptId)) {
    const script = documentObject.createElement('script');
    script.id = googleTagScriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    documentObject.head.appendChild(script);
  }

  windowObject.gtag('js', new Date());
  windowObject.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
    ...(debugMode ? { debug_mode: true } : {}),
  });

  return state;
};

export const trackPageView = (options = {}) => {
  const windowObject = options.windowObject ?? window;
  const documentObject = options.documentObject ?? document;
  const state = initializeGoogleAnalytics({ ...options, windowObject, documentObject });

  if (!state) {
    return false;
  }

  const pagePath = getPagePath(windowObject.location);
  if (state.lastPagePath === pagePath) {
    return false;
  }

  state.lastPagePath = pagePath;
  windowObject.gtag('event', 'page_view', {
    page_title: documentObject.title,
    page_location: `${windowObject.location.origin}${pagePath}`,
    page_path: pagePath,
    ...getAttributionEventParameters(state.attribution),
    ...(state.debugMode ? { debug_mode: true } : {}),
  });

  return true;
};

export const trackB2BEvent = (eventName, parameters = {}, options = {}) => {
  if (!customEventNames.has(eventName)) {
    return false;
  }

  const windowObject = options.windowObject ?? window;
  const documentObject = options.documentObject ?? document;
  const state = initializeGoogleAnalytics({ ...options, windowObject, documentObject });

  if (!state) {
    return false;
  }

  const dedupeKey = options.dedupeKey ? `${eventName}:${options.dedupeKey}` : '';
  if (dedupeKey && state.sentEventKeys.has(dedupeKey)) {
    return false;
  }

  const safeParameters = sanitizeEventParameters(
    parameters,
    state.attribution,
    windowObject.location,
  );

  if (dedupeKey) {
    state.sentEventKeys.add(dedupeKey);
  }

  windowObject.gtag('event', eventName, {
    ...safeParameters,
    ...(state.debugMode ? { debug_mode: true } : {}),
  });

  if (state.debugMode) {
    windowObject.console?.debug?.('[GA4 debug]', eventName, safeParameters);
  }

  return true;
};

export const trackFormStart = (formName, parameters = {}, options = {}) => {
  const windowObject = options.windowObject ?? window;
  const documentObject = options.documentObject ?? document;
  const state = initializeGoogleAnalytics({ ...options, windowObject, documentObject });
  const safeFormName = sanitizeDimension(formName, 80);

  if (!state || !safeFormName) {
    return false;
  }

  const formKey = `${formStartStoragePrefix}${safeFormName}`;
  if (state.formStartKeys.has(formKey) || readSessionValue(windowObject.sessionStorage, formKey) === '1') {
    return false;
  }

  state.formStartKeys.add(formKey);
  writeSessionValue(windowObject.sessionStorage, formKey, '1');
  return trackB2BEvent('form_start', {
    ...parameters,
    form_name: safeFormName,
  }, { ...options, windowObject, documentObject });
};

export const getContactEventName = (href) => {
  const normalizedHref = String(href || '').trim().toLowerCase();

  if (normalizedHref.startsWith('mailto:')) {
    return 'contact_email';
  }

  if (normalizedHref.includes('wa.me/') || normalizedHref.includes('api.whatsapp.com/')) {
    return 'contact_whatsapp';
  }

  return null;
};

export const installContactClickTracking = (options = {}) => {
  const documentObject = options.documentObject ?? document;
  const handleClick = (event) => {
    const link = event.target?.closest?.('a[href]');
    const eventName = getContactEventName(link?.href);

    if (eventName) {
      trackB2BEvent(eventName, {}, options);
    }
  };

  documentObject.addEventListener('click', handleClick);
  return () => documentObject.removeEventListener('click', handleClick);
};
