import dayjs from 'dayjs';

import { PostImagesReq, PostImagesRes } from '$typings/images';
import { BrandoError } from '$typings/errors';
import { Router } from 'express';
import { ErrorType } from '$consts/errors';
import { supportImageExt } from './consts';
import { v4 } from 'uuid';
import { getStsRes } from './utils';
import { Image } from '$db/models/image';
import { Error as DbError } from 'sequelize';
import { wrapRes } from '$utils';
import { Response } from '$typings/response';

const imagesRouter = Router({ mergeParams: true });

imagesRouter.route('/').post<{}, Response<PostImagesRes>, PostImagesReq>(async (req, res, next) => {
  const { imageType } = req.body || {};
  if (!imageType) {
    next({
      type: ErrorType.InvalidParams,
    } as BrandoError);
    return;
  }
  if (!supportImageExt.has(req.body.imageType)) {
    next({
      type: ErrorType.ImageNotSupport,
      extraInfo: 'Uploaded ' + imageType,
    } as BrandoError);
    return;
  }

  const imageId = v4();
  try {
    await Image.create({
      id: imageId,
      objectPath: null,
    });

    const { data, path }  = await getStsRes(imageId, imageType);

    res.send(wrapRes<PostImagesRes>({
      imageId,
      path,
      cosParams: {
        tmpSecretId: data.credentials.tmpSecretId,
        tmpSecretKey: data.credentials.tmpSecretKey,
        sessionToken: data.credentials.sessionToken,
        bucket: process.env.IMAGES_BUCKET_NAME,
        region: process.env.BUCKET_REGION,
        startTime: dayjs().unix(),
        expiredTime: dayjs().add(10, 'm').unix(),
      },
    }));
  } catch (e) {
    let type = e instanceof DbError ? ErrorType.DBError : ErrorType.STSError;
    next({
      type,
      extraInfo: JSON.stringify(e),
    } as BrandoError);
  }
});

export {
  imagesRouter,
};
