export interface ImageModel {
  id: string;
  objectPath: string;
  uploaded: boolean;
}

export interface PostImagesReq {
  imageType: string;
};

export interface PatchImagesReq {
  imageId: string;
};

export interface PostImagesRes {
  imageId: string;
  path: string;
};

export interface GetImageAuthorizeRes {
  tmpSecretId: string;
  tmpSecretKey: string;
  sessionToken: string;
  bucket: string;
  region: string;
  startTime: number;
  expiredTime: number;
}
