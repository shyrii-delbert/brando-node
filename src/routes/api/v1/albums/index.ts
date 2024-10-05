import { Router } from 'express';
import { Response } from '$typings/response';
import { GetAlbumsRes, PostAlbumsReq } from '$typings/albums';
import { BrandoError } from '$typings/errors';
import { ErrorType } from '$consts/errors';
import { isArray, isBoolean, isObject, isString } from 'lodash-es';
import { Image, processImageObj } from '$db/models/image';
import { Album, Photo } from '$db';
import { wrapRes } from '$utils';
import {
  HasManyGetAssociationsMixin,
  HasOneGetAssociationMixin,
} from 'sequelize';

export const albumsRouter = Router({ mergeParams: true });

albumsRouter
  .route('/')
  .post<{}, Response<{}>, PostAlbumsReq>(async (req, res, next) => {
    const { photos, subArea, mainArea, date } = req.body || {};
    if (
      !isArray(photos) ||
      !isString(subArea) ||
      !isString(mainArea) ||
      !isString(date)
    ) {
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
      if (
        !isBoolean(isPost) ||
        !isString(title) ||
        !isString(description) ||
        !isString(imageId)
      ) {
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
    const albumModels = await Album.findAll();

    const albums: GetAlbumsRes['albums'] = await Promise.all(
      albumModels.map(
        (albumModel) =>
          new Promise<GetAlbumsRes['albums'][number]>(async (resolve) => {
            const photoModels = await (
              (albumModel as any)
                .getPhotos as HasManyGetAssociationsMixin<Photo>
            )();

            const images = await Promise.all(
              photoModels.map((photoModel) =>
                (
                  (photoModel as any)
                    .getImage as HasOneGetAssociationMixin<Image>
                )()
              )
            );

            const album: GetAlbumsRes['albums'][number] = {
              ...albumModel.get(),
              photos: photoModels.map((photoModel, index) => ({
                ...photoModel.get(),
                image: processImageObj(images[index].get()),
              })),
            };
            resolve(album);
          })
      )
    );

    res.send(
      wrapRes<GetAlbumsRes>({
        albums,
      })
    );
  });
