import test from 'node:test';
import assert from 'node:assert/strict';

process.env.CDN_PREFIX = 'https://cdn.example.com/';

import { serializeImagePaths } from '../src/routes/api/v1/images/serializers.ts';

test('processImageObj converts live photo video path to CDN URL', () => {
  const image = serializeImagePaths({
    id: 'image-id',
    objectPath: 'images/photo.webp',
    sha256: 'sha256',
    proxied: {
      '480p': 'images/photo_480p.webp',
    },
    livePhoto: {
      videoPath: 'live-photos/image-id.mp4',
      mime: 'video/mp4',
      presentationTimestampUs: 123,
    },
    exif: {},
  }, (path) => `https://cdn.example.com/${path}`);

  assert.equal(image.objectPath, 'https://cdn.example.com/images/photo.webp');
  assert.equal(
    image.livePhoto?.videoPath,
    'https://cdn.example.com/live-photos/image-id.mp4'
  );
});
