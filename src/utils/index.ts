import { Response } from '$typings/response';
import { ErrorRes } from '$typings/errors';

export const wrapRes = <T>(data: T): Response<T> => {
  return {
    code: 0,
    data,
  };
};

export const wrapErrorRes = (code: number, msg: string): Response<ErrorRes> => {
  return {
    code,
    data: {
      msg,
    },
  };
};

export const generateCDNUrl = (path: string) => {
  return `${process.env.CDN_PREFIX}${path}`;
};
