import { s3 } from '$utils/s3';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

export const uploadImage = (path: string, key: string) => {
  return new Promise(async (resolve, reject) => {
    s3.putObject(
      {
        Bucket: process.env.IMAGES_BUCKET_NAME,
        Key: key,
        Body: await readFile(path),
      },
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
        return;
      }
    );
  });
};

export const convertExposureTime = (time?: number) => {
  if (time === undefined) {
    return time;
  }

  let targetTime = time.toFixed(0);
  if (time < 1) {
    targetTime = `1/${(1 / time).toFixed(0)}`;
  }

  return `${targetTime}s`;
};

export const convertEvString = (ev?: number) => {
  if (ev === undefined) {
    return ev;
  }
  return `${ev > 0 ? '+' : ''}${ev} ev`;
};

export const convertFocalLength = (focalLength?: number) => {
  if (focalLength === undefined) {
    return focalLength;
  }

  return `${focalLength.toFixed(0)} mm`;
};

export const convertFNumber = (fNumber?: number) => {
  if (fNumber === undefined) {
    return fNumber;
  }
  return `ƒ ${fNumber}`;
};

export const convertISO = (iso?: number) => {
  if (iso === undefined) {
    return iso;
  }
  return `ISO ${iso}`;
};

export const resizeImage = (
  targetMaxLength: number,
  filePath: string,
  outputFilePath: string,
  originHeight: number,
  originWidth: number
) => {
  const isHorizontal = originWidth > originHeight;
  const ratio = originWidth / originHeight;
  const targetWidth = Math.floor(
    isHorizontal ? targetMaxLength : targetMaxLength * ratio
  );
  const targetHeight = Math.floor(
    isHorizontal ? targetMaxLength / ratio : targetMaxLength
  );

  return new Promise((resolve, reject) => {
    sharp(filePath)
      .resize(targetWidth, targetHeight)
      .jpeg({ mozjpeg: true })
      .toFile(outputFilePath, (err, info) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(info);
      });
  });
};
