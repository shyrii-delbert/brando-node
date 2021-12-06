import COS from 'cos-nodejs-sdk-v5';

export const cos = new COS({
  SecretId: process.env.SECRET_ID,
  SecretKey: process.env.SECRET_KEY,
});
