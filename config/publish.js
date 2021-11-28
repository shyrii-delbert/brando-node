require('dotenv').config();

const fs = require('fs');
const dayjs = require('dayjs');
const { v4 } = require('uuid');
const tencentcloud = require("tencentcloud-sdk-nodejs");

const ScfClient = tencentcloud.scf.v20180416.Client;
const scfClient = new ScfClient({
  credential: {
    secretId: process.env.SECRET_ID,
    secretKey: process.env.SECRET_KEY,
  },
  region: process.env.BUCKET_REGION,
  profile: {},
});

const COS = require('cos-nodejs-sdk-v5');
const cos = new COS({
  SecretId: process.env.SECRET_ID,
  SecretKey: process.env.SECRET_KEY,
});

const filename = `brando-${dayjs().format('YY-MM-DDTHH-mm-ss')}-${v4().slice(-8)}.zip`;

cos.putObject({
  Bucket: process.env.BUCKET_NAME,
  Region: process.env.BUCKET_REGION,
  Key: filename,
  StorageClass: 'STANDARD',
  Body: fs.createReadStream('./pub.zip'), // 上传文件对象
  onProgress: function (progressData) {
    console.log(JSON.stringify(progressData));
  }
}, function (err, data) {
  console.info('Upload to COS: ', err || data);
  if (!err) {
    const targetFunctionName = process.env.PUB_ENV === 'prd' ?
      process.env.FUNCTION_NAME :
      process.env.FUNCTION_NAME_STAGING;
    scfClient.UpdateFunctionCode({
      FunctionName: targetFunctionName,
      CosBucketName: process.env.BUCKET_NAME,
      CosBucketRegion: process.env.BUCKET_REGION,
      CosObjectName: filename,
      Publish: 'TRUE',
      CodeSource: 'Cos',
    }, (err, data) => {
      console.info('Update SCF: ', err || data);
    });
  }
});
