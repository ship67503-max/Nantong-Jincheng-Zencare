import { randomUUID } from 'node:crypto';
// Retries reuse an opaque key across serverless instances; no customer data.
// Event deduplication does not alter database/email write semantics.
export function leadReceipt(key) {
  return { eventId: /^[a-f0-9-]{36}$/.test(key || '') ? key : randomUUID() };
}
