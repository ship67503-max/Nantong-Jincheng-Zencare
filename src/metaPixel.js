export const META_PIXEL_ID = '1532666838061135';

const metaPixelScriptId = 'jczcare-meta-pixel';
const metaPixelStateKey = '__jczcareMetaPixelState';
const metaLeadStoragePrefix = 'jczcare-meta-lead:';
const productionHostnames = new Set(['jczcare.com', 'www.jczcare.com']);
const pixelIdPattern = /^\d{5,25}$/;
const submissionIdPattern = /^[a-zA-Z0-9._:-]{8,100}$/;
const emailLikePattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const phoneLikePattern = /(?:\+?\d[\s().-]*){7,}/;
const allowedEventParameters = new Set([
  'content_name',
  'content_category',
  'form_name',
  'page_path',
]);

const hasDebugParameter = (location) => (
  new URLSearchParams(location.search).get('meta_debug') === '1'
);

export const isMetaPixelEnabled = ({
  hostname,
  isProductionBuild,
  debugMode = false,
  pixelId,
}) => Boolean(
  pixelIdPattern.test(String(pixelId || ''))
    && (debugMode || (isProductionBuild && productionHostnames.has(hostname.toLowerCase()))),
);

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

const sanitizeValue = (value, maxLength = 100) => {
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

const getPagePath = (location) => location.pathname || '/';

const sanitizeEventParameters = (parameters, location) => {
  const combined = {
    ...parameters,
    page_path: getPagePath(location),
  };

  return Object.fromEntries(
    Object.entries(combined)
      .filter(([key]) => allowedEventParameters.has(key))
      .map(([key, value]) => [key, sanitizeValue(value)])
      .filter(([, value]) => value !== undefined),
  );
};

export const initializeMetaPixel = ({
  windowObject = window,
  documentObject = document,
  isProductionBuild = import.meta.env?.PROD === true,
  pixelId = META_PIXEL_ID,
} = {}) => {
  const debugMode = hasDebugParameter(windowObject.location);
  if (!isMetaPixelEnabled({
    hostname: windowObject.location.hostname,
    isProductionBuild,
    debugMode,
    pixelId,
  })) {
    return null;
  }

  if (windowObject[metaPixelStateKey]) {
    return windowObject[metaPixelStateKey];
  }

  const state = {
    debugMode,
    lastPagePath: null,
    sentLeadIds: new Set(),
  };
  windowObject[metaPixelStateKey] = state;

  if (!windowObject.fbq) {
    const fbq = function metaPixelQueue() {
      if (fbq.callMethod) {
        fbq.callMethod.apply(fbq, arguments);
      } else {
        fbq.queue.push(arguments);
      }
    };
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    windowObject.fbq = fbq;
    windowObject._fbq = fbq;
  }

  if (!documentObject.getElementById(metaPixelScriptId)) {
    const script = documentObject.createElement('script');
    script.id = metaPixelScriptId;
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    documentObject.head.appendChild(script);
  }

  windowObject.fbq('init', pixelId);
  return state;
};

export const trackMetaPageView = (options = {}) => {
  const windowObject = options.windowObject ?? window;
  const documentObject = options.documentObject ?? document;
  const state = initializeMetaPixel({ ...options, windowObject, documentObject });
  if (!state) {
    return false;
  }

  const pagePath = getPagePath(windowObject.location);
  if (state.lastPagePath === pagePath) {
    return false;
  }

  state.lastPagePath = pagePath;
  windowObject.fbq('track', 'PageView');
  return true;
};

export const trackMetaLead = ({
  formName,
  productInterest,
  isSampleRequest = false,
  submissionId,
} = {}, options = {}) => {
  const normalizedSubmissionId = String(submissionId || '').trim();
  if (!submissionIdPattern.test(normalizedSubmissionId)) {
    return false;
  }

  const windowObject = options.windowObject ?? window;
  const documentObject = options.documentObject ?? document;
  const state = initializeMetaPixel({ ...options, windowObject, documentObject });
  if (!state) {
    return false;
  }

  const storageKey = `${metaLeadStoragePrefix}${normalizedSubmissionId}`;
  if (
    state.sentLeadIds.has(normalizedSubmissionId)
    || readSessionValue(windowObject.sessionStorage, storageKey) === '1'
  ) {
    return false;
  }

  const safeParameters = sanitizeEventParameters({
    content_name: isSampleRequest ? 'Sample Request' : 'B2B Inquiry',
    content_category: productInterest,
    form_name: formName,
  }, windowObject.location);

  state.sentLeadIds.add(normalizedSubmissionId);
  writeSessionValue(windowObject.sessionStorage, storageKey, '1');
  windowObject.fbq('track', 'Lead', safeParameters, { eventID: normalizedSubmissionId });

  if (state.debugMode) {
    windowObject.console?.debug?.('[Meta Pixel debug]', 'Lead', safeParameters);
  }

  return true;
};
