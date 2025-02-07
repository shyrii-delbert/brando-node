import S3 from "aws-sdk/clients/s3";

export const s3 = new S3({
  region: process.env.BUCKET_REGION,
  endpoint: process.env.BUCKET_ENDPOINT,
  credentials: {
    accessKeyId: process.env.SECRET_ID,
    secretAccessKey: process.env.SECRET_KEY,
  },
  signatureVersion: 'v4',
});
