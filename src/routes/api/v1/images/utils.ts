import STS from 'qcloud-cos-sts';
import { cos } from '$utils/cos';

export const getStsRes = () => {
  return new Promise<STS.CredentialData>((resolve, reject) => {
    const path = `/images/*`;
    const policy = STS.getPolicy([{
      action: 'name/cos:PutObject',
      bucket: process.env.IMAGES_BUCKET_NAME,
      region: process.env.BUCKET_REGION,
      prefix: path,
    }]);

    STS.getCredential({
      secretId: process.env.SECRET_ID,
      secretKey: process.env.SECRET_KEY,
      durationSeconds: 600,
      policy,
    }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
};

export const verifyImage = (path: string) => {
  return new Promise<boolean>((resolve, reject) => {
    cos.headObject({
      Bucket: process.env.IMAGES_BUCKET_NAME, /* 填入您自己的存储桶，必须字段 */
      Region: process.env.BUCKET_REGION,  /* 存储桶所在地域，例如ap-beijing，必须字段 */
      Key: path,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
    }, function (err, data) {
      if (err) return reject(err);
      if (data.statusCode === 404) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};
