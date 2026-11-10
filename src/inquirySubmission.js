export const INQUIRY_SUCCESS_MESSAGE = 'Thank you! Your inquiry has been sent successfully. Our team will contact you within 1 business day.';
export const INQUIRY_FAILURE_MESSAGE = 'We couldn\u2019t send your inquiry. Please try again or contact us directly at sales3@nthengtuo.com.';
export const INQUIRY_REQUEST_TIMEOUT_MS = 25000;

export function isInquiryResponseSuccessful(response, data) {
  return Boolean(
    response?.ok
      && data?.success === true
      && data?.deliveryConfirmed === true,
  );
}

export function createInquirySubmissionId(cryptoObject = globalThis.crypto) {
  if (typeof cryptoObject?.randomUUID === 'function') {
    return cryptoObject.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function submitInquiry(payload, {
  fetchFn = globalThis.fetch,
  timeoutMs = INQUIRY_REQUEST_TIMEOUT_MS,
} = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchFn('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Inquiry-Idempotency-Key': payload.submissionId,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));

    if (!isInquiryResponseSuccessful(response, data)) {
      const error = new Error(data.message || INQUIRY_FAILURE_MESSAGE);
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    if (error?.name === 'AbortError') {
      const timeoutError = new Error(INQUIRY_FAILURE_MESSAGE);
      timeoutError.code = 'INQUIRY_TIMEOUT';
      throw timeoutError;
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateInquiryFields(values) {
  const errors = {};
  const name = String(values?.name || '').trim();
  const email = String(values?.email || '').trim();
  const phone = String(values?.phone || '').trim();
  const product = String(values?.product || '').trim();

  if (!name) {
    errors.name = 'Please enter your name.';
  }

  if (!email) {
    errors.email = 'Please enter your work email.';
  } else if (!emailPattern.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!phone) {
    errors.phone = 'Please enter your phone or WhatsApp number.';
  }

  if (!product || product.toLowerCase() === 'select a product') {
    errors.product = 'Please select a product of interest.';
  }

  return errors;
}
