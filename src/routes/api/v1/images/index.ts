import { ImageModel, PostImagesRes } from '$typings/images';
import { BrandoError } from '$typings/errors';
import { Router } from 'express';
import { ErrorType } from '$consts/errors';
import { supportImageExt } from './consts';
import { v4 } from 'uuid';
import { Image } from '$db/models/image';
import { wrapRes } from '$utils';
import { Response } from '$typings/response';
import multer from 'multer';
import os from 'os';
import path from 'path';
import { fileTypeFromFile } from 'file-type';
import sha256File from 'sha256-file';
import { promisify } from 'util';
import { Op } from 'sequelize';
import exifr from 'exifr';
import fs from 'fs';
import {
  convertEvString,
  convertExposureTime,
  convertFNumber,
  convertFocalLength,
  convertISO,
  resizeImage,
  uploadImage,
} from './utils';
import _imageSize from 'image-size';

const promisedSha256File = promisify<string, string>(sha256File);
const unlink = promisify(fs.unlink);
const getImageSize = promisify(_imageSize);

const imagesRouter = Router({ mergeParams: true });

const uploader = multer({ dest: path.resolve(os.tmpdir(), 'brando') });

imagesRouter
  .route('/')
  .post<{}, Response<PostImagesRes>, {}>(
    uploader.single('image'),
    async (req, res, next) => {
      const file = req.file;
      if (!file) {
        next({
          type: ErrorType.InvalidParams,
        } as BrandoError);
        return;
      }

      const fileInfo = await fileTypeFromFile(file.path);

      if (!fileInfo) {
        next({
          type: ErrorType.InvalidParams,
        } as BrandoError);
        return;
      }

      if (!supportImageExt.has(fileInfo.ext)) {
        next({
          type: ErrorType.ImageNotSupport,
          extraInfo: 'Uploaded ' + fileInfo.ext,
        } as BrandoError);
        return;
      }

      const sha256 = await promisedSha256File(file.path);

      const existImage = await Image.findOne({
        where: {
          sha256: {
            [Op.eq]: sha256,
          },
        },
      });

      if (existImage) {
        res.send(
          wrapRes<PostImagesRes>({
            imageId: existImage.get().id,
          })
        );
        return;
      }

      const imageId = v4();
      try {
        const metaData = await exifr.parse(file.path);

        const exifObj: ImageModel['exif'] = {
          manufacturer: metaData?.Make,
          model: metaData?.Model,
          dateTime: metaData?.CreateDate?.toISOString(),
          exposureTime: convertExposureTime(metaData?.ExposureTime),
          ev: convertEvString(metaData?.ExposureCompensation),
          fNumber: convertFNumber(metaData?.FNumber),
          iso: convertISO(metaData?.ISO),
          focalLength: convertFocalLength(metaData?.FocalLength),
          lens: metaData?.LensModel,
          gpsLongitude: metaData?.longitude,
          gpsLatitude: metaData?.latitude,
        };

        // 转码
        const imageSize = await getImageSize(file.path);

        if (!imageSize || !imageSize.height || !imageSize.width) {
          next({
            type: ErrorType.ImageNotSupport,
            extraInfo: "Image can't parse height & width",
          } as BrandoError);
          return;
        }

        const maxLength = Math.max(imageSize.height, imageSize.width);
        const paths = [];
        const tasks = [];
        const levels: ('origin' | '480p' | '720p' | '1080p')[] = ['origin'];

        // 原图压缩
        let targetFilePath = path.resolve(
          file.path,
          `../${file.filename}_origin.jpg`
        );
        paths.push(targetFilePath);
        if (maxLength > 2560) {
          tasks.push(
            resizeImage(
              2560,
              file.path,
              targetFilePath,
              imageSize.height,
              imageSize.width
            )
          );
        } else {
          tasks.push(
            resizeImage(
              maxLength,
              file.path,
              targetFilePath,
              imageSize.height,
              imageSize.width
            )
          );
        }

        ([1080, 720, 480] as const).forEach((resolution) => {
          if (maxLength > resolution) {
            targetFilePath = path.resolve(
              file.path,
              `../${file.filename}_${resolution}p.jpg`
            );
            paths.push(targetFilePath);
            levels.push(`${resolution}p`);

            tasks.push(
              resizeImage(
                resolution,
                file.path,
                targetFilePath,
                imageSize.height!,
                imageSize.width!
              )
            );
          }
        });

        // 上传
        const objectPaths: { [key in (typeof levels)[number]]?: string } = {};
        await Promise.all(tasks);
        await Promise.all(
          paths.map((filePath, index) => {
            const objPath = `images/${path.basename(filePath)}`;
            objectPaths[levels[index]] = objPath;
            return uploadImage(filePath, objPath);
          })
        );

        // 清理 /tmp
        paths.forEach((path) => {
          unlink(path);
        });

        await Image.create({
          id: imageId,
          objectPath: objectPaths.origin!,
          sha256,
          exif: exifObj,
          proxied: {
            '480p': objectPaths['480p'],
            '720p': objectPaths['720p'],
            '1080p': objectPaths['1080p'],
          },
        });

        res.send(
          wrapRes<PostImagesRes>({
            imageId,
          })
        );
      } catch (e) {
        next({
          type: ErrorType.ServiceInternalError,
          extraInfo: JSON.stringify(e),
        } as BrandoError);
      }
    }
  );

export { imagesRouter };
