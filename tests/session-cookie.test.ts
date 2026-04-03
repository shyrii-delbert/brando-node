import test from 'node:test';
import assert from 'node:assert/strict';
import { getSessionCookieKey } from '../src/middlewares/session-cookie';

test('getSessionCookieKey prefers SESSION_COOKIE_KEY from environment', () => {
  const previous = process.env.SESSION_COOKIE_KEY;
  process.env.SESSION_COOKIE_KEY = 'custom-session-cookie';

  try {
    assert.equal(getSessionCookieKey(), 'custom-session-cookie');
  } finally {
    if (previous === undefined) {
      delete process.env.SESSION_COOKIE_KEY;
    } else {
      process.env.SESSION_COOKIE_KEY = previous;
    }
  }
});

test('getSessionCookieKey falls back to the default cookie name', () => {
  const previous = process.env.SESSION_COOKIE_KEY;
  delete process.env.SESSION_COOKIE_KEY;

  try {
    assert.equal(getSessionCookieKey(), 'delbertbeta-s-sso');
  } finally {
    if (previous === undefined) {
      delete process.env.SESSION_COOKIE_KEY;
    } else {
      process.env.SESSION_COOKIE_KEY = previous;
    }
  }
});
