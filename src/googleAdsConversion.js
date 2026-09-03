export const GOOGLE_ADS_SEND_TO = 'AW-18346194096/R6b4CJ6xyNUcELDpkqxE';

const conversionStateKey = '__jczcareGoogleAdsConversionState';

/**
 * Sends the confirmed inquiry conversion through the Google Tag already
 * initialized by analytics.js. No customer or form data is included.
 */
export const trackGoogleAdsConversion = ({
  submissionId,
  windowObject = globalThis.window,
} = {}) => {
  if (!submissionId || typeof windowObject?.gtag !== 'function') {
    return false;
  }

  const state = windowObject[conversionStateKey] || {
    sentSubmissionIds: new Set(),
  };
  windowObject[conversionStateKey] = state;

  if (state.sentSubmissionIds.has(submissionId)) {
    return false;
  }

  state.sentSubmissionIds.add(submissionId);
  windowObject.gtag('event', 'conversion', {
    send_to: GOOGLE_ADS_SEND_TO,
  });
  return true;
};
