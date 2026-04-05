import test from 'node:test';
import assert from 'node:assert/strict';
import {
  convertEvString,
  getProcessedImageFilename,
  getProxyLevels,
  getResizeDimensionsByShortSide,
  PROCESSED_IMAGE_FORMAT,
} from '../src/routes/api/v1/images/formatters';

test('convertEvString formats positive exposure compensation to one decimal place', () => {
  assert.equal(convertEvString(0.33333333), '+0.3 ev');
});

test('convertEvString formats zero and negative exposure compensation to one decimal place', () => {
  assert.equal(convertEvString(0), '0.0 ev');
  assert.equal(convertEvString(-1), '-1.0 ev');
});

test('getProxyLevels uses the short side instead of the long side', () => {
  assert.deepEqual(getProxyLevels(4000, 900), ['480p', '720p']);
  assert.deepEqual(getProxyLevels(900, 4000), ['480p', '720p']);
  assert.deepEqual(getProxyLevels(4000, 3000), ['480p', '720p', '1080p']);
});

test('getResizeDimensionsByShortSide scales horizontal and vertical images by short side', () => {
  assert.deepEqual(getResizeDimensionsByShortSide(1080, 3000, 4000), {
    width: 1440,
    height: 1080,
  });
  assert.deepEqual(getResizeDimensionsByShortSide(1080, 4000, 3000), {
    width: 1080,
    height: 1440,
  });
});

test('processed images are always named as webp outputs', () => {
  assert.equal(PROCESSED_IMAGE_FORMAT, 'webp');
  assert.equal(getProcessedImageFilename('sample', 'origin'), 'sample_origin.webp');
  assert.equal(getProcessedImageFilename('sample', '720p'), 'sample_720p.webp');
});
