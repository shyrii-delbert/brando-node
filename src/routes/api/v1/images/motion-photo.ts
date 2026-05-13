export type MotionPhotoInfo = {
  videoBuffer: Buffer;
  mime: 'video/mp4' | 'video/quicktime';
  extension: 'mp4' | 'mov';
  presentationTimestampUs?: number;
};

const getAttr = (source: string, attr: string) => {
  const pattern = new RegExp(`${attr}="([^"]+)"`);
  return source.match(pattern)?.[1];
};

const parsePositiveInt = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
};

const parseTimestamp = (xmp: string) => {
  const attrValue = getAttr(xmp, 'GCamera:MicroVideoPresentationTimestampUs');
  const attrTimestamp = parsePositiveInt(attrValue);
  if (attrTimestamp !== undefined) {
    return attrTimestamp;
  }

  const tagValue = xmp.match(
    /<GCamera:MotionPhotoPresentationTimestampUs>(\d+)<\/GCamera:MotionPhotoPresentationTimestampUs>/
  )?.[1];
  return parsePositiveInt(tagValue);
};

const parseMime = (value?: string): MotionPhotoInfo['mime'] => {
  if (value === 'video/quicktime') {
    return 'video/quicktime';
  }

  return 'video/mp4';
};

const parseContainerVideo = (xmp: string) => {
  const itemMatches = xmp.match(/<(?:Container|GContainer):Item\b[^>]*>/g);
  if (!itemMatches) {
    return undefined;
  }

  for (let i = itemMatches.length - 1; i >= 0; i--) {
    const item = itemMatches[i];
    const semantic = getAttr(item, '(?:Item|GContainerItem):Semantic');
    const mime = getAttr(item, '(?:Item|GContainerItem):Mime');
    const length = parsePositiveInt(
      getAttr(item, '(?:Item|GContainerItem):Length')
    );
    const padding = Number(
      getAttr(item, '(?:Item|GContainerItem):Padding') || '0'
    );

    if (
      length &&
      mime?.startsWith('video/') &&
      (!semantic || /MotionPhoto|MotionPhotoVideo|Video/i.test(semantic))
    ) {
      return {
        length,
        padding: Number.isFinite(padding) && padding > 0 ? padding : 0,
        mime: parseMime(mime),
      };
    }
  }

  return undefined;
};

const extractFromTail = (
  buffer: Buffer,
  length: number,
  padding: number,
  mime: MotionPhotoInfo['mime'],
  presentationTimestampUs?: number
): MotionPhotoInfo | null => {
  const end = buffer.length - padding;
  const start = end - length;

  if (start < 0 || end > buffer.length || start >= end) {
    return null;
  }

  return {
    videoBuffer: buffer.subarray(start, end),
    mime,
    extension: mime === 'video/quicktime' ? 'mov' : 'mp4',
    presentationTimestampUs,
  };
};

export const parseMotionPhotoFromBuffer = (
  buffer: Buffer,
  _fileExt: string
): MotionPhotoInfo | null => {
  const xmp = buffer.toString('utf8');
  const presentationTimestampUs = parseTimestamp(xmp);
  const containerVideo = parseContainerVideo(xmp);

  if (containerVideo) {
    return extractFromTail(
      buffer,
      containerVideo.length,
      containerVideo.padding,
      containerVideo.mime,
      presentationTimestampUs
    );
  }

  const legacyOffset = parsePositiveInt(getAttr(xmp, 'GCamera:MicroVideoOffset'));
  if (legacyOffset !== undefined) {
    return extractFromTail(
      buffer,
      legacyOffset,
      0,
      'video/mp4',
      presentationTimestampUs
    );
  }

  return null;
};
