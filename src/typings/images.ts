export interface ImageModel {
  id: string;
  objectPath: string;
  uploaded: boolean;
}

export interface PostImagesReq {
  imageType: string;
};

export interface PostImagesRes {
  imageId: string;
  path: string;
  cosParams: {
    tmpSecretId: string;
    tmpSecretKey: string;
    sessionToken: string;
    bucket: string;
    region: string;
    startTime: number;
    expiredTime: number;
  }
};

export interface PatchImageReq {
  imageId: string;
  fullPath: string;
}
