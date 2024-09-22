import { Router } from 'express';
import { Response } from '$typings/response';
import { User } from '$rpc-gen/user';
import { promisedGetUserByIds } from '$rpc';
import { ErrorType } from '$consts/errors';
import { wrapRes } from '$utils';

export const userRouter = Router({ mergeParams: true });
userRouter
  .route('/')
  .get<{}, Response<{ user: User }>, {}>(async (req, res, next) => {
    try {
      const userInfos = await promisedGetUserByIds({
        userId: [req.userId!],
      });
      if (!userInfos.users[req.userId!]) {
        throw new Error('User not found');
      }
      res.send(
        wrapRes({
          user: userInfos.users[req.userId!],
        })
      );
    } catch (e) {
      next({
        type: ErrorType.ServiceInternalError,
        extraInfo: `Get user info failed: ${JSON.stringify(e)}`,
      });
    }
  });
