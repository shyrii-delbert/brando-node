export interface ImageModel {
  id: string;
  objectPath: string;
  sha256: string;
  proxied: {
    '480p'?: string;
    '720p'?: string;
    '1080p'?: string;
  };
  livePhoto?: {
    videoPath: string;
    mime: 'video/mp4' | 'video/quicktime';
    presentationTimestampUs?: number;
  };
  exif: {
    manufacturer?: string;
    model?: string;
    dateTime?: string;
    exposureTime?: string;
    fNumber?: string;
    focalLength?: string;
    iso?: string;
    lens?: string;
    ev?: string;
    gpsLatitude?: number;
    gpsLongitude?: number;
  };
}

export interface PostImagesRes {
  imageId: string;
}
