export const convertEvString = (ev?: number) => {
  if (ev === undefined) {
    return ev;
  }

  return `${ev > 0 ? '+' : ''}${ev.toFixed(1)} ev`;
};

export const getProxyLevels = (originHeight: number, originWidth: number) => {
  const shortSide = Math.min(originHeight, originWidth);

  return ([480, 720, 1080] as const)
    .filter((resolution) => shortSide > resolution)
    .map((resolution) => `${resolution}p` as const);
};

export const getResizeDimensionsByShortSide = (
  targetShortSide: number,
  originHeight: number,
  originWidth: number
) => {
  if (originWidth > originHeight) {
    return {
      width: Math.floor((originWidth / originHeight) * targetShortSide),
      height: targetShortSide,
    };
  }

  return {
    width: targetShortSide,
    height: Math.floor((originHeight / originWidth) * targetShortSide),
  };
};
