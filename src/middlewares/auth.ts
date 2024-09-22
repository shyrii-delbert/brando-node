import { ErrorType } from '$consts/errors';
import { BrandoError, ErrorRes } from '$typings/errors';
import { Response } from '$typings/response';
import { RequestHandler } from 'express';
import { promisedGetUserIdByCookie } from 'src/rpc';

export const auth: RequestHandler<{}, Response<ErrorRes>> = async (
  req,
  _res,
  next
) => {
  const loginCookie = req.cookies['delbertbeta-s-sso'];

  let userId: number | null = null;
  try {
    if (loginCookie) {
      userId = (
        await promisedGetUserIdByCookie({
          cookie: loginCookie,
        })
      ).userId;
    }
  } catch (e) {}

  if (userId === null) {
    next({
      type: ErrorType.NotLogin,
    } as BrandoError);
    return;
  }

  req.userId = userId;

  next();
};
