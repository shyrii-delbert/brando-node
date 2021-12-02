import STS from 'qcloud-cos-sts';

export const getStsRes = (imageId: string, fileType: string) => {
  return new Promise<{ data: STS.CredentialData, path: string }>((resolve, reject) => {
    const path = `/images/${imageId}.${fileType}`;
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
      resolve({ data, path });
    });
  });
};
