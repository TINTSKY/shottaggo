'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { CaptureError, captureErrorKey } = require('../src/capture.cjs');

test('capture errors map to distinct locale keys', () => {
  for (const [code, key] of Object.entries({ tooLarge: 'captureTooLarge', protected: 'captureProtected',
    decode: 'captureDecode', changed: 'captureChanged', guestUnavailable: 'captureGuestUnavailable',
    guest: 'captureGuestFailed', assets: 'captureAssets', invalid: 'captureInvalid' })) {
    assert.equal(captureErrorKey(new CaptureError(code)), 'error.' + key);
  }
  assert.equal(captureErrorKey(new DOMException('private URL', 'SecurityError')), 'error.captureProtected');
  assert.equal(captureErrorKey(new Error('anything else')), 'error.captureFailed');
  assert.equal(captureErrorKey(undefined), 'error.captureFailed');
});
