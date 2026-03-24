const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const WATERMARK_FILENAME = 'watermark.png';

const getWatermarkAssetPath = () => {
  const candidates = [
    path.resolve(process.cwd(), 'src/assets', WATERMARK_FILENAME),
    path.resolve(process.cwd(), 'dist/assets', WATERMARK_FILENAME),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(`Watermark asset not found: ${candidates.join(', ')}`);
};

const composeWatermark = async (inputPath) => {
  const image = sharp(inputPath).rotate();
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Image can't parse height & width");
  }

  const shortSide = Math.min(metadata.width, metadata.height);
  const watermarkSize = Math.max(Math.round(shortSide * 0.1), 48);
  const margin = Math.max(Math.round(shortSide * 0.03), 16);
  const posX = Math.round((metadata.width - watermarkSize) / 2);
  const posY = metadata.height - watermarkSize - margin;

  const watermarkBuffer = await sharp(getWatermarkAssetPath())
    .resize(watermarkSize, watermarkSize, {
      fit: 'fill',
      kernel: sharp.kernel.lanczos3,
    })
    .ensureAlpha()
    .png()
    .toBuffer();

  return image
    .ensureAlpha()
    .composite([
      {
        input: watermarkBuffer,
        left: posX,
        top: posY,
      },
    ])
    .toBuffer();
};

const resizeIfNeeded = async (buffer, targetMaxLength) => {
  if (!targetMaxLength) {
    return sharp(buffer);
  }

  const image = sharp(buffer);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Image can't parse height & width");
  }

  const isHorizontal = metadata.width > metadata.height;
  const ratio = metadata.width / metadata.height;
  const targetWidth = Math.floor(
    isHorizontal ? targetMaxLength : targetMaxLength * ratio
  );
  const targetHeight = Math.floor(
    isHorizontal ? targetMaxLength / ratio : targetMaxLength
  );

  return image.resize(targetWidth, targetHeight);
};

const main = async () => {
  const [, , inputPath, outputPath, targetMaxLengthArg] = process.argv;

  if (!inputPath || !outputPath) {
    console.error(
      'Usage: node scripts/debug-watermark.js <input> <output> [targetMaxLength]'
    );
    process.exit(1);
  }

  const watermarkedBuffer = await composeWatermark(inputPath);
  const transformed = await resizeIfNeeded(
    watermarkedBuffer,
    targetMaxLengthArg ? Number(targetMaxLengthArg) : undefined
  );

  const outputExt = path.extname(outputPath).toLowerCase();

  if (outputExt === '.png') {
    await transformed.png().toFile(outputPath);
    return;
  }

  await transformed.jpeg({ mozjpeg: true }).toFile(outputPath);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
