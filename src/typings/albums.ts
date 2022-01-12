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
