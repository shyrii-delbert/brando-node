import { s3 } from '$utils/s3';
import sharp from 'sharp';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { getResizeDimensionsByShortSide } from './formatters';

const WATERMARK_FILENAME = 'watermark.png';

const getWatermarkAssetPath = async () => {
  const candidates = [
    path.resolve(process.cwd(), 'src/assets', WATERMARK_FILENAME),
    path.resolve(process.cwd(), 'dist/assets', WATERMARK_FILENAME),
  ];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {}
  }

  throw new Error(`Watermark asset not found: ${candidates.join(', ')}`);
};

export const composeWatermark = async (filePath: string) => {
  const image = sharp(filePath).rotate();
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Image can't parse height & width");
  }

  const shortSide = Math.min(metadata.width, metadata.height);
  const watermarkSize = Math.max(Math.round(shortSide * 0.1), 48);
  const margin = Math.max(Math.round(shortSide * 0.03), 16);
  const posX = Math.round((metadata.width - watermarkSize) / 2);
  const posY = metadata.height - watermarkSize - margin;

  const watermarkBuffer = await sharp(await getWatermarkAssetPath())
    .resize(watermarkSize, watermarkSize, {
      fit: 'fill',
      kernel: sharp.kernel.lanczos3,
    })
    .ensureAlpha()
    .png()
    .toBuffer();

  return image
    .ensureAlpha()
    .composite([
      {
        input: watermarkBuffer,
        left: posX,
        top: posY,
      },
    ])
    .jpeg({ mozjpeg: true })
    .toBuffer();
};

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
  originWidth: number,
  sourceBuffer?: Buffer
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
    sharp(sourceBuffer ?? filePath)
      .rotate()
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

export const resizeImageByShortSide = (
  targetShortSide: number,
  filePath: string,
  outputFilePath: string,
  originHeight: number,
  originWidth: number,
  sourceBuffer?: Buffer
) => {
  const { width, height } = getResizeDimensionsByShortSide(
    targetShortSide,
    originHeight,
    originWidth
  );

  return new Promise((resolve, reject) => {
    sharp(sourceBuffer ?? filePath)
      .rotate()
      .resize(width, height)
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
