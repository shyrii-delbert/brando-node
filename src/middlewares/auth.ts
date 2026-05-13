import { ErrorType } from '$consts/errors';
import { BrandoError, ErrorRes } from '$typings/errors';
import { Response } from '$typings/response';
import { brandoLogger } from '$logger';
import { RequestHandler } from 'express';
import { promisedGetUserIdByCookie } from 'src/rpc';
import { getSessionCookieKey } from './session-cookie';

const getErrorInfo = (e: unknown) => {
  if (e instanceof Error) {
    return {
      name: e.name,
      message: e.message,
      stack: e.stack,
    };
  }

  return e;
};

export const auth: RequestHandler<{}, Response<ErrorRes>> = async (
  req,
  _res,
  next
) => {
  const sessionCookieKey = getSessionCookieKey();
  const loginCookie = req.cookies[sessionCookieKey];
  const authContext = {
    method: req.method,
    originalUrl: req.originalUrl,
    path: req.path,
    sessionCookieKey,
    cookieKeys: Object.keys(req.cookies || {}),
    hasLoginCookie: Boolean(loginCookie),
    loginCookieLength: loginCookie?.length || 0,
    origin: req.get('origin'),
    referer: req.get('referer'),
    userAgent: req.get('user-agent'),
    forwardedFor: req.get('x-forwarded-for'),
    ip: req.ip,
  };

  brandoLogger.info(`[auth] checking login state ${JSON.stringify(authContext)}`);

  let userId: number | null = null;
  try {
    if (loginCookie) {
      const startedAt = Date.now();
      const userIdRes = await promisedGetUserIdByCookie({
        cookie: loginCookie,
      });
      userId = userIdRes.userId;
      brandoLogger.info(
        `[auth] sso getUserIdByCookie finished ${JSON.stringify({
          method: req.method,
          originalUrl: req.originalUrl,
          userId,
          durationMs: Date.now() - startedAt,
        })}`
      );
    } else {
      brandoLogger.warn(
        `[auth] login cookie missing ${JSON.stringify({
          method: req.method,
          originalUrl: req.originalUrl,
          sessionCookieKey,
          cookieKeys: Object.keys(req.cookies || {}),
        })}`
      );
    }
  } catch (e) {
    brandoLogger.error(
      `[auth] sso getUserIdByCookie failed ${JSON.stringify({
        method: req.method,
        originalUrl: req.originalUrl,
        sessionCookieKey,
        hasLoginCookie: Boolean(loginCookie),
        loginCookieLength: loginCookie?.length || 0,
        error: getErrorInfo(e),
      })}`
    );
  }

  if (userId === null) {
    brandoLogger.warn(
      `[auth] rejecting request as not logged in ${JSON.stringify({
        method: req.method,
        originalUrl: req.originalUrl,
        sessionCookieKey,
        hasLoginCookie: Boolean(loginCookie),
      })}`
    );
    next({
      type: ErrorType.NotLogin,
    } as BrandoError);
    return;
  }

  req.userId = userId;

  brandoLogger.info(
    `[auth] login state accepted ${JSON.stringify({
      method: req.method,
      originalUrl: req.originalUrl,
      userId,
    })}`
  );

  next();
};
