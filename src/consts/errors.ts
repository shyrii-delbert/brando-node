import { StatusCodes } from 'http-status-codes';

export enum ErrorType {
  'ServiceInternalError' = 'ServiceInternalError',
  'InvalidParams' = 'InvalidParams',
  'ImageNotSupport' = 'ImageNotSupport',
  'ImageNotFound' = 'ImageNotFound',
  'ImageNotUploaded' = 'ImageNotUploaded',
  'STSError' = 'STSError',
  'DBError' = 'DBError',
  'COSError' = 'COSError',
}

export const ErrorHttpCode = {
  [ErrorType.ServiceInternalError]: StatusCodes.INTERNAL_SERVER_ERROR,
  [ErrorType.ImageNotSupport]: StatusCodes.UNSUPPORTED_MEDIA_TYPE,
  [ErrorType.ImageNotFound]: StatusCodes.NOT_FOUND,
  [ErrorType.ImageNotUploaded]: StatusCodes.FORBIDDEN,
  [ErrorType.InvalidParams]: StatusCodes.BAD_REQUEST,
  [ErrorType.STSError]: StatusCodes.INTERNAL_SERVER_ERROR,
  [ErrorType.DBError]: StatusCodes.INTERNAL_SERVER_ERROR,
  [ErrorType.COSError]: StatusCodes.INTERNAL_SERVER_ERROR,
};

export const ErrorCode = {
  [ErrorType.ServiceInternalError]: -1,
  [ErrorType.ImageNotSupport]: 1001,
  [ErrorType.InvalidParams]: 1002,
  [ErrorType.ImageNotFound]: 1003,
  [ErrorType.ImageNotUploaded]: 1004,
  [ErrorType.STSError]: 2001,
  [ErrorType.DBError]: 3001,
  [ErrorType.COSError]: 4001,
};

const unexpectedErrorMsg = 'Unexpected error occurred, please contact delbertbeta@live.com for help';

export const ErrorMsg = {
  [ErrorType.ServiceInternalError]: unexpectedErrorMsg,
  [ErrorType.ImageNotSupport]: 'This imageType is not supported',
  [ErrorType.ImageNotFound]: 'Requested image is not found',
  [ErrorType.ImageNotUploaded]: 'Requested image is not uploaded',
  [ErrorType.InvalidParams]: 'Invalid params',
  [ErrorType.STSError]: unexpectedErrorMsg,
  [ErrorType.DBError]: unexpectedErrorMsg,
  [ErrorType.COSError]: unexpectedErrorMsg,
};
