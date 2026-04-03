const DEFAULT_SESSION_COOKIE_KEY = 'delbertbeta-s-sso';

export const getSessionCookieKey = (): string =>
  process.env.SESSION_COOKIE_KEY || DEFAULT_SESSION_COOKIE_KEY;

