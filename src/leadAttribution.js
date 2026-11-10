const attributionStorageKey = 'jczcare-lead-attribution-v1';
const attributionSessionKey = 'jczcare-lead-attribution-captured';
const campaignKeys = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
];
const emailLikePattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const phoneLikePattern = /(?:\+?\d[\s().-]*){7,}/;

const readStoredAttribution = (storage) => {
  try {
    const value = JSON.parse(storage?.getItem(attributionStorageKey) || '{}');
    return value && typeof value === 'object' ? value : {};
  } catch {
    return {};
  }
};

const writeStoredAttribution = (storage, value) => {
  try {
    storage?.setItem(attributionStorageKey, JSON.stringify(value));
  } catch {
    // Attribution must never block the inquiry workflow.
  }
};

const sanitizeValue = (value, maxLength = 200) => {
  const normalized = String(value || '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);

  if (!normalized || emailLikePattern.test(normalized) || phoneLikePattern.test(normalized)) {
    return '';
  }

  return normalized;
};

const getExternalReferrer = (documentObject, location) => {
  try {
    const referrer = new URL(documentObject.referrer);
    if (referrer.hostname.toLowerCase() === location.hostname.toLowerCase()) {
      return '';
    }

    // Store only the origin so query strings and paths cannot leak personal data.
    return referrer.origin;
  } catch {
    return '';
  }
};

const captureTouch = ({ location, documentObject }) => {
  const query = new URLSearchParams(location.search);
  const touch = Object.fromEntries(
    campaignKeys
      .map((key) => [key, sanitizeValue(query.get(key), key.endsWith('clid') ? 500 : 200)])
      .filter(([, value]) => value),
  );

  return {
    ...touch,
    landing_page: location.pathname || '/',
    referrer: getExternalReferrer(documentObject, location) || '(direct)',
  };
};

export const captureLeadAttribution = ({
  windowObject = window,
  documentObject = document,
  now = new Date(),
} = {}) => {
  const storage = windowObject.localStorage;
  const sessionStorage = windowObject.sessionStorage;
  const stored = readStoredAttribution(storage);
  let capturedThisSession = false;
  try {
    capturedThisSession = sessionStorage?.getItem(attributionSessionKey) === '1';
  } catch {
    // Continue without a session marker when storage is unavailable.
  }

  if (stored.first_touch && capturedThisSession) {
    return stored;
  }

  const touch = captureTouch({ location: windowObject.location, documentObject });
  const timestamp = now.toISOString();

  try {
    sessionStorage?.setItem(attributionSessionKey, '1');
  } catch {
    // Continue without a session marker when storage is unavailable.
  }

  if (!stored.first_touch) {
    const initial = {
      first_touch: touch,
      latest_touch: touch,
      first_visit_time: timestamp,
      latest_visit_time: timestamp,
    };
    writeStoredAttribution(storage, initial);
    return initial;
  }

  const updated = {
    ...stored,
    latest_touch: touch,
    latest_visit_time: timestamp,
  };
  writeStoredAttribution(storage, updated);
  return updated;
};

export const getLeadAttribution = ({ windowObject = window, ...options } = {}) => {
  const stored = readStoredAttribution(windowObject.localStorage);
  return stored.first_touch
    ? stored
    : captureLeadAttribution({ ...options, windowObject });
};
