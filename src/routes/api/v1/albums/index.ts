import { Router } from 'express';
import { Response } from '$typings/response';
import { PostAlbumsReq } from '$typings/albums';
import { BrandoError } from '$typings/errors';
import { ErrorType } from '$consts/errors';
import { isArray, isBoolean, isObject, isString } from 'lodash-es';
import { Image } from '$db/models/image';
import { Album, Photo } from '$db';
import { wrapRes } from '$utils';

export const albumsRouter = Router({ mergeParams: true });

albumsRouter.route('/')
  .post<{}, Response<{}>, PostAlbumsReq>(async (req, res, next) => {
    const { photos, subArea, mainArea, date } = req.body || {};
    if (!isArray(photos) || !isString(subArea) || !isString(mainArea) || !isString(date)) {
      next({
        type: ErrorType.InvalidParams,
        extraInfo: JSON.stringify(req.body),
      } as BrandoError);
      return;
    }

    const imageList = [];
    let hasPost = false;

    for (const photo of photos) {
      if (!isObject(photo)) {
        next({
          type: ErrorType.InvalidParams,
          extraInfo: JSON.stringify(req.body),
        } as BrandoError);
        return;
      }
      const { isPost, title, description, imageId } = photo;
      if (!isBoolean(isPost) || !isString(title) || !isString(description) || !isString(imageId)) {
        next({
          type: ErrorType.InvalidParams,
          extraInfo: JSON.stringify(req.body),
        } as BrandoError);
        return;
      }

      const image = await Image.findOne({ where: { id: imageId } });
      if (!image) {
        next({
          type: ErrorType.ImageNotFound,
          extraInfo: JSON.stringify(req.body),
        } as BrandoError);
        return;
      }
      const imageObj = image.toJSON();
      if (!imageObj.uploaded) {
        next({
          type: ErrorType.ImageNotUploaded,
          extraInfo: JSON.stringify(req.body),
        } as BrandoError);
        return;
      }
      if (isPost && hasPost) {
        next({
          type: ErrorType.InvalidParams,
          extraInfo: JSON.stringify(req.body),
        } as BrandoError);
        return;
      }
      if (isPost) {
        hasPost = true;
      }
      imageList.push(image);
    }

    const album = await Album.create({ subArea, mainArea, date });

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const { isPost, title, description } = photo;
      const photoModel = await Photo.create({ title, description, isPost });
      await (photoModel as any).setImage(imageList[i]);
      await (album as any).addPhoto(photoModel);
    }

    res.send(wrapRes({}));
  })
  .get(async (req, res, next) => {

  });
