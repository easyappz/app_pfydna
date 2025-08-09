'use strict';

function stripBase64Header(input) {
  if (typeof input !== 'string') return '';
  const commaIndex = input.indexOf(',');
  if (input.startsWith('data:') && commaIndex !== -1) {
    return input.slice(commaIndex + 1);
  }
  return input;
}

function estimateBase64SizeBytes(base64) {
  const clean = stripBase64Header(base64).replace(/\s/g, '');
  if (!clean) return 0;
  const padding = (clean.endsWith('==') ? 2 : (clean.endsWith('=') ? 1 : 0));
  return Math.floor((clean.length * 3) / 4) - padding;
}

function assertBase64Under1MB(base64, maxBytes = 1048576) {
  const size = estimateBase64SizeBytes(base64);
  if (size > maxBytes) {
    const err = new Error('Image exceeds 1MB limit');
    err.status = 400;
    throw err;
  }
  return { sizeBytes: size };
}

module.exports = {
  estimateBase64SizeBytes,
  assertBase64Under1MB,
};
