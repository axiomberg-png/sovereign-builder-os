import { parentPort } from 'worker_threads';

const PII_PATTERNS = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  creditCard: /\b(?:\d[ -]*?){13,16}\b/g,
  ipAddress: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g
};

function sanitize(text) {
  if (typeof text !== 'string') return text;
  let sanitized = text;
  sanitized = sanitized.replace(PII_PATTERNS.email, '[REDACTED_EMAIL]');
  sanitized = sanitized.replace(PII_PATTERNS.phone, '[REDACTED_PHONE]');
  sanitized = sanitized.replace(PII_PATTERNS.ssn, '[REDACTED_SSN]');
  sanitized = sanitized.replace(PII_PATTERNS.creditCard, '[REDACTED_CARD]');
  sanitized = sanitized.replace(PII_PATTERNS.ipAddress, '[REDACTED_IP]');
  return sanitized;
}

parentPort.on('message', (data) => {
  const sanitizedData = JSON.parse(JSON.stringify(data), (key, value) => {
    if (typeof value === 'string') return sanitize(value);
    return value;
  });
  parentPort.postMessage(sanitizedData);
});
