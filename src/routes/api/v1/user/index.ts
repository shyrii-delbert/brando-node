import { Router } from 'express';
import { Response } from '$typings/response';
import { User } from '$rpc-gen/user';
import { promisedGetUserByIds } from '$rpc';
import { ErrorType } from '$consts/errors';
import { wrapRes } from '$utils';
import { brandoLogger } from '$logger';

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

export const userRouter = Router({ mergeParams: true });
userRouter
  .route('/')
  .get<{}, Response<{ user: User }>, {}>(async (req, res, next) => {
    try {
      brandoLogger.info(
        `[user] fetching current user ${JSON.stringify({
          method: req.method,
          originalUrl: req.originalUrl,
          userId: req.userId,
        })}`
      );

      const startedAt = Date.now();
      const userInfos = await promisedGetUserByIds({
        userId: [req.userId!],
      });
      brandoLogger.info(
        `[user] getUser rpc finished ${JSON.stringify({
          method: req.method,
          originalUrl: req.originalUrl,
          userId: req.userId,
          durationMs: Date.now() - startedAt,
          responseUserIds: Object.keys(userInfos.users || {}),
          foundCurrentUser: Boolean(userInfos.users[req.userId!]),
        })}`
      );
      if (!userInfos.users[req.userId!]) {
        throw new Error('User not found');
      }
      res.send(
        wrapRes({
          user: userInfos.users[req.userId!],
        })
      );
    } catch (e) {
      brandoLogger.error(
        `[user] get current user failed ${JSON.stringify({
          method: req.method,
          originalUrl: req.originalUrl,
          userId: req.userId,
          error: getErrorInfo(e),
        })}`
      );
      next({
        type: ErrorType.ServiceInternalError,
        extraInfo: `Get user info failed: ${JSON.stringify(e)}`,
      });
    }
  });
