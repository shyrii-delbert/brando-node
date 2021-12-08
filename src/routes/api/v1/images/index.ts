import dayjs from 'dayjs';

import { GetImageAuthorizeRes, PatchImagesReq, PostImagesReq, PostImagesRes } from '$typings/images';
import { BrandoError } from '$typings/errors';
import { Router } from 'express';
import { ErrorType } from '$consts/errors';
import { supportImageExt } from './consts';
import { v4 } from 'uuid';
import { getStsRes, verifyImage } from './utils';
import { Image } from '$db/models/image';
import { wrapRes } from '$utils';
import { Response } from '$typings/response';

const imagesRouter = Router({ mergeParams: true });

imagesRouter.route('/')
  .post<{}, Response<PostImagesRes>, PostImagesReq>(async (req, res, next) => {
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
      const path = `images/${imageId}.${imageType}`;

      await Image.create({
        id: imageId,
        objectPath: path,
        uploaded: false,
      });

      res.send(wrapRes<PostImagesRes>({
        imageId,
        path,
        bucket: process.env.IMAGES_BUCKET_NAME,
        region: process.env.BUCKET_REGION,
      }));
    } catch (e) {
      next({
        type: ErrorType.DBError,
        extraInfo: JSON.stringify(e),
      } as BrandoError);
    }
  })
  .patch<{}, Response<{}>, PatchImagesReq>(async (req, res, next) => {
    const { imageId } = req.body || {};

    if (!imageId) {
      next({
        type: ErrorType.InvalidParams,
      } as BrandoError);
      return;
    }

    const image = await Image.findOne({
      where: {
        id: imageId,
      },
    });

    if (!imageId) {
      next({
        type: ErrorType.ImageNotFound,
        extraInfo: 'ImageId: ' + imageId,
      } as BrandoError);
      return;
    }

    const imageValue = image!.toJSON();
    if (imageValue.uploaded) {
      res.send(wrapRes({}));
      return;
    }

    try {
      const verifyRes = await verifyImage(imageValue.objectPath);
      if (verifyRes) {
        await image!.set('uploaded', true).save();
        res.send(wrapRes({}));
      } else {
        next({
          type: ErrorType.ImageNotUploaded,
          extraInfo: 'ImageId: ' + imageId,
        } as BrandoError);
      }
    } catch (e) {
      next({
        type: ErrorType.COSError,
        extraInfo: JSON.stringify(e),
      } as BrandoError)
    }
  });

imagesRouter.route('/authorize').get<{}, Response<GetImageAuthorizeRes>>(async (req, res, next) => {
  try {
    const data = await getStsRes();
    res.send(wrapRes<GetImageAuthorizeRes>({
      tmpSecretId: data.credentials.tmpSecretId,
      tmpSecretKey: data.credentials.tmpSecretKey,
      sessionToken: data.credentials.sessionToken,
      startTime: dayjs().unix(),
      expiredTime: dayjs().add(10, 'm').unix(),
    }));
  } catch (e) {
    next({
      type: ErrorType.STSError,
      extraInfo: JSON.stringify(e),
    } as BrandoError);
  }
});

export {
  imagesRouter,
};
