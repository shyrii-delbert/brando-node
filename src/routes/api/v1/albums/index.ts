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
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { auth } from '$middlewares/auth';

export const albumsRouter = Router({ mergeParams: true });

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

const hasWhereConditions = (where: WhereOptions) => Reflect.ownKeys(where).length > 0;

const parsePositiveInt = (value: unknown) => {
  if (!isString(value)) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
};

const buildAlbumListQueryOptions = (
  query: Record<string, unknown>,
  options?: {
    withDateRange?: boolean;
    withKeywordQuery?: boolean;
  }
): FindOptions => {
  const findOptions: FindOptions = {
    order: [['date', 'DESC']],
  };

  const where: WhereOptions = {};

  if (options?.withDateRange) {
    const startDate = isString(query.start_date) ? query.start_date : undefined;
    const endDate = isString(query.end_date) ? query.end_date : undefined;
    const dateWhere: WhereOptions = {};

    if (startDate) {
      dateWhere[Op.gte] = startDate;
    }
    if (endDate) {
      dateWhere[Op.lte] = endDate;
    }
    if (hasWhereConditions(dateWhere)) {
      where.date = dateWhere;
    }
  }

  if (options?.withKeywordQuery) {
    const keyword = isString(query.query) ? query.query.trim() : '';
    if (keyword) {
      where[Op.or] = [
        {
          mainArea: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          subArea: {
            [Op.like]: `%${keyword}%`,
          },
        },
      ];
    }
  }

  if (hasWhereConditions(where)) {
    findOptions.where = where;
  }

  const page = parsePositiveInt(query.page);
  const pageSize = parsePositiveInt(query.page_size);
  if (page || pageSize) {
    const normalizedPage = page || DEFAULT_PAGE;
    const normalizedPageSize = pageSize || DEFAULT_PAGE_SIZE;
    findOptions.limit = normalizedPageSize;
    findOptions.offset = (normalizedPage - 1) * normalizedPageSize;
  }

  return findOptions;
};

const buildAlbumListCountOptions = (
  query: Record<string, unknown>,
  options?: {
    withDateRange?: boolean;
    withKeywordQuery?: boolean;
  }
) => {
  const { where } = buildAlbumListQueryOptions(query, options);
  return where ? { where } : {};
};

const validateAlbumReq = async (
  body: PostAlbumsReq
): Promise<{ imageList: Image[]; errorType?: ErrorType }> => {
  const { photos, subArea, mainArea, date } = body || {};
  if (
    !isArray(photos) ||
    !isString(subArea) ||
    !isString(mainArea) ||
    !isString(date)
  ) {
    return { imageList: [], errorType: ErrorType.InvalidParams };
  }

  const imageList: Image[] = [];
  let hasPost = false;

  for (const photo of photos) {
    if (!isObject(photo)) {
      return { imageList: [], errorType: ErrorType.InvalidParams };
    }
    const { isPost, title, description, imageId } = photo;
    if (
      !isBoolean(isPost) ||
      !isString(title) ||
      !isString(description) ||
      !isString(imageId)
    ) {
      return { imageList: [], errorType: ErrorType.InvalidParams };
    }

    const image = await Image.findOne({ where: { id: imageId } });
    if (!image) {
      return { imageList: [], errorType: ErrorType.ImageNotFound };
    }

    if (isPost && hasPost) {
      return { imageList: [], errorType: ErrorType.InvalidParams };
    }
    if (isPost) {
      hasPost = true;
    }
    imageList.push(image);
  }

  return { imageList };
};

const serializePhoto = (photo: any) => ({
  id: photo.id,
  title: photo.title,
  description: photo.description,
  isPost: photo.isPost,
  image: processImageObj(photo.image.get()),
});

albumsRouter
  .route('/')
  .post<{}, Response<{}>, PostAlbumsReq>(auth, async (req, res, next) => {
    const { photos, subArea, mainArea, date } = req.body || {};
    const { imageList, errorType } = await validateAlbumReq(req.body);
    if (errorType) {
      next({
        type: errorType,
        extraInfo: JSON.stringify(req.body),
      } as BrandoError);
      return;
    }

    const album = await Album.create({ subArea, mainArea, date });

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const { isPost, title, description } = photo;
      const photoModel = await Photo.create({
        title,
        description,
        isPost,
        sort: i,
      });
      await (photoModel as any).setImage(imageList[i]);
      await (album as any).addPhoto(photoModel);
    }

    res.send(wrapRes({}));
  })
  .get(auth, async (req, res, next) => {
    const query = req.query as Record<string, unknown>;
    const albumModels = await Album.findAll({
      ...buildAlbumListQueryOptions(query, {
        withDateRange: true,
        withKeywordQuery: true,
      }),
      include: {
        model: Photo,
        as: 'photos',
        separate: true,
        order: [['sort', 'ASC']],
        include: [
          {
            model: Image,
            as: 'image',
          },
        ],
      },
    });
    const total = await Album.count(
      buildAlbumListCountOptions(query, {
        withDateRange: true,
        withKeywordQuery: true,
      })
    );

    const albums: GetAlbumsRes['albums'] = albumModels.map((albumModel) => {
      const album = albumModel.get() as any;
      return {
        ...album,
        photos: album.photos.map(serializePhoto),
      };
    });

    res.send(
      wrapRes<GetAlbumsRes>({
        albums,
        total,
      })
    );
  });

albumsRouter
  .route('/meta')
  .get<{}, Response<GetAlbumsMetaRes>>(async (req, res, next) => {
    const albumModels = await Album.findAll({
      ...buildAlbumListQueryOptions(req.query as Record<string, unknown>),
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
  .put<{ albumId: string }, Response<{}>, PostAlbumsReq>(
    auth,
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
          separate: true,
          order: [['sort', 'ASC']],
        },
      });

      if (!albumModel) {
        next({
          type: ErrorType.AlbumNotFound,
          extraInfo: `Can't find target album: ${req.params.albumId}`,
        } as BrandoError);
        return;
      }

      const { photos, subArea, mainArea, date } = req.body || {};
      const { imageList, errorType } = await validateAlbumReq(req.body);
      if (errorType) {
        next({
          type: errorType,
          extraInfo: JSON.stringify(req.body),
        } as BrandoError);
        return;
      }

      await albumModel.update({
        subArea,
        mainArea,
        date,
      });

      const currentPhotos = (albumModel.get() as any).photos || [];
      for (const photo of currentPhotos) {
        await photo.destroy();
      }

      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const { isPost, title, description } = photo;
        const photoModel = await Photo.create({
          title,
          description,
          isPost,
          sort: i,
        });
        await (photoModel as any).setImage(imageList[i]);
        await (albumModel as any).addPhoto(photoModel);
      }

      res.send(wrapRes({}));
    }
  )
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
          separate: true,
          order: [['sort', 'ASC']],
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
        photos: albumObj.photos.map(serializePhoto),
      } as AlbumRes;

      res.send(
        wrapRes<GetSingleAlbumRes>({
          album,
        })
      );
    }
  )
  .delete<{ albumId: string }, Response<{}>, {}>(auth, async (req, res, next) => {
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
    for (const photo of albumObj.photos || []) {
      await photo.destroy();
    }
    await albumModel.destroy();

    res.send(wrapRes({}));
  });
