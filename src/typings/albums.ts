import { ImageModel } from './images';
import { PhotoModel } from './photos';

export interface AlbumModel {
  id?: string;
  date: string;
  mainArea: string;
  subArea: string;
}

interface PhotoParam extends Omit<PhotoModel, 'id'> {
  imageId: string;
}

export interface PostAlbumsReq extends Omit<AlbumModel, 'id'> {
  photos: PhotoParam[];
}

export type AlbumRes = AlbumModel & {
  photos: (PhotoModel & {
    image: ImageModel;
  })[];
};

export interface GetAlbumsRes {
  albums: AlbumRes[];
}

export interface GetSingleAlbumRes {
  album: AlbumRes;
}

export interface GetAlbumsMetaRes {
  albums: (AlbumModel & {
    poster: Pick<ImageModel, 'objectPath' | 'proxied'>;
  })[];
}
