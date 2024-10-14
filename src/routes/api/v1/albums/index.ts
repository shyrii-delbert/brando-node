import { Router } from 'express';
import { Response } from '$typings/response';
import {
  AlbumModel,
  AlbumRes,
  GetAlbumsMetaRes,
  GetAlbumsRes,
  GetSingleAlbumRes,
  PostAlbumsReq,
} from '$typings/albums';
import { BrandoError } from '$typings/errors';
import { ErrorType } from '$consts/errors';
import { isArray, isBoolean, isObject, isString, omit, pick } from 'lodash-es';
import { Image, processImageObj } from '$db/models/image';
import { Album, Photo } from '$db';
import { wrapRes } from '$utils';
import { Op } from 'sequelize';
import { auth } from '$middlewares/auth';

export const albumsRouter = Router({ mergeParams: true });

albumsRouter
  .route('/')
  .post<{}, Response<{}>, PostAlbumsReq>(auth, async (req, res, next) => {
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
  .get(auth, async (req, res, next) => {
    const albumModels = await Album.findAll({
      include: {
        model: Photo,
        as: 'photos',
        include: [
          {
            model: Image,
            as: 'image',
          },
        ],
      },
    });

    const albums: GetAlbumsRes['albums'] = albumModels.map((albumModel) => {
      const album = albumModel.get() as any;
      return {
        ...album,
        photos: album.photos.map((photo: any) => ({
          ...photo.get(),
          image: processImageObj(photo.image.get()),
        })),
      };
    });

    res.send(
      wrapRes<GetAlbumsRes>({
        albums,
      })
    );
  });

albumsRouter
  .route('/meta')
  .get<{}, Response<GetAlbumsMetaRes>>(async (req, res, next) => {
    const albumModels = await Album.findAll({
      include: {
        model: Photo,
        as: 'photos',
        where: {
          isPost: {
            [Op.eq]: true,
          },
        },
        include: [
          {
            model: Image,
            as: 'image',
          },
        ],
      },
    });

    const albums = albumModels.map((albumModel) => {
      const album = albumModel.get() as any;
      return {
        ...omit(album as AlbumModel, ['photos']),
        poster: pick(processImageObj(album.photos[0]?.image.get()), [
          'objectPath',
          'proxied',
        ]),
      };
    }) as GetAlbumsMetaRes['albums'];
    res.send(
      wrapRes<GetAlbumsMetaRes>({
        albums,
      })
    );
  });

albumsRouter
  .route('/:albumId')
  .get<{ albumId: string }, Response<GetSingleAlbumRes>, {}>(
    async (req, res, next) => {
      if (!req.params.albumId) {
        next({
          type: ErrorType.InvalidParams,
          extraInfo: "Can't find albumId in params",
        } as BrandoError);
        return;
      }
      const albumModel = await Album.findOne({
        where: {
          id: req.params.albumId,
        },
        include: {
          model: Photo,
          as: 'photos',
          where: {
            isPost: {
              [Op.eq]: true,
            },
          },
          include: [
            {
              model: Image,
              as: 'image',
            },
          ],
        },
      });

      if (!albumModel) {
        next({
          type: ErrorType.AlbumNotFound,
          extraInfo: `Can't find target album: ${req.params.albumId}`,
        } as BrandoError);
        return;
      }

      const albumObj = albumModel.get() as any;
      const album = {
        ...albumObj,
        photos: albumObj.photos.map((photo: any) => ({
          ...photo.get(),
          image: processImageObj(photo.image.get()),
        })),
      } as AlbumRes;

      res.send(
        wrapRes<GetSingleAlbumRes>({
          album,
        })
      );
    }
  );
