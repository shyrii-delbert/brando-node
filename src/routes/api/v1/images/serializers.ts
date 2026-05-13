import type { ImageModel } from '$typings/images';

export const serializeImagePaths = (
  image: ImageModel,
  generateUrl: (path: string) => string
): ImageModel => ({
  ...image,
  objectPath: generateUrl(image.objectPath),
  proxied: Object.entries(image.proxied || {}).reduce<ImageModel['proxied']>(
    (pre, acc) => {
      pre[acc[0] as keyof ImageModel['proxied']] = generateUrl(acc[1]);
      return pre;
    },
    {}
  ),
  livePhoto: image.livePhoto
    ? {
      ...image.livePhoto,
      videoPath: generateUrl(image.livePhoto.videoPath),
    }
    : undefined,
});
