import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parseMotionPhotoFromBuffer,
} from '../src/routes/api/v1/images/motion-photo.ts';

const encoder = new TextEncoder();

const buildFile = (prefix: string, video: Buffer) => Buffer.concat([
  encoder.encode(prefix),
  video,
]);

test('returns null for a regular image without motion metadata', () => {
  const result = parseMotionPhotoFromBuffer(
    Buffer.from('plain jpeg bytes'),
    'jpg'
  );

  assert.equal(result, null);
});

test('extracts video bytes from modern motion photo container metadata', () => {
  const video = Buffer.from([0, 0, 0, 24, 102, 116, 121, 112, 109, 112, 52, 50]);
  const xmp = `
    <x:xmpmeta>
      <Container:Directory>
        <Container:Item Item:Semantic="Primary" Item:Mime="image/jpeg" Item:Length="0" />
        <Container:Item Item:Semantic="MotionPhoto" Item:Mime="video/mp4" Item:Length="${video.length}" Item:Padding="0" />
      </Container:Directory>
      <GCamera:MotionPhotoPresentationTimestampUs>123456</GCamera:MotionPhotoPresentationTimestampUs>
    </x:xmpmeta>`;
  const result = parseMotionPhotoFromBuffer(buildFile(xmp, video), 'jpg');

  assert.deepEqual(result?.videoBuffer, video);
  assert.equal(result?.mime, 'video/mp4');
  assert.equal(result?.extension, 'mp4');
  assert.equal(result?.presentationTimestampUs, 123456);
});

test('extracts video bytes from legacy MicroVideoOffset metadata', () => {
  const video = Buffer.from([0, 0, 0, 16, 102, 116, 121, 112, 113, 116]);
  const xmp = `
    <x:xmpmeta
      GCamera:MicroVideo="1"
      GCamera:MicroVideoOffset="${video.length}"
      GCamera:MicroVideoPresentationTimestampUs="42" />`;
  const result = parseMotionPhotoFromBuffer(buildFile(xmp, video), 'jpg');

  assert.deepEqual(result?.videoBuffer, video);
  assert.equal(result?.mime, 'video/mp4');
  assert.equal(result?.extension, 'mp4');
  assert.equal(result?.presentationTimestampUs, 42);
});

test('returns null when metadata points outside the file', () => {
  const xmp = '<x:xmpmeta GCamera:MicroVideo="1" GCamera:MicroVideoOffset="9999" />';
  const result = parseMotionPhotoFromBuffer(Buffer.from(xmp), 'jpg');

  assert.equal(result, null);
});
