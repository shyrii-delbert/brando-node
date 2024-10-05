import STS from 'qcloud-cos-sts';
import { cos } from '$utils/cos';
import sharp from 'sharp';

export const getStsRes = () => {
  return new Promise<STS.CredentialData>((resolve, reject) => {
    const path = `images/*`;
    const policy = STS.getPolicy([
      {
        action: 'name/cos:PutObject',
        bucket: process.env.IMAGES_BUCKET_NAME,
        region: process.env.BUCKET_REGION,
        prefix: path,
      },
    ]);

    STS.getCredential(
      {
        secretId: process.env.SECRET_ID,
        secretKey: process.env.SECRET_KEY,
        durationSeconds: 600,
        policy,
      },
      (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      }
    );
  });
};

export const verifyImage = (path: string) => {
  return new Promise<boolean>((resolve, reject) => {
    cos.headObject(
      {
        Bucket:
          process.env.IMAGES_BUCKET_NAME /* 填入您自己的存储桶，必须字段 */,
        Region:
          process.env
            .BUCKET_REGION /* 存储桶所在地域，例如ap-beijing，必须字段 */,
        Key: path /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
      },
      function (err, data) {
        if (err) return reject(err);
        resolve(true);
      }
    );
  });
};

export const uploadImage = (path: string, key: string) => {
  return new Promise<boolean>((resolve, reject) => {
    cos.uploadFile(
      {
        Bucket:
          process.env.IMAGES_BUCKET_NAME /* 填入您自己的存储桶，必须字段 */,
        Region:
          process.env
            .BUCKET_REGION /* 存储桶所在地域，例如ap-beijing，必须字段 */,
        Key: key /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
        FilePath: path,
      },
      function (err, data) {
        if (err) return reject(err);
        if (data.statusCode === 404) {
          resolve(false);
        } else {
          resolve(true);
        }
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
    isHorizontal ? targetMaxLength : targetMaxLength / ratio
  );
  const targetHeight = Math.floor(
    isHorizontal ? targetMaxLength * ratio : targetMaxLength
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
