import { StatusCodes } from 'http-status-codes';

export enum ErrorType {
  'ServiceInternalError' = 'ServiceInternalError',
  'InvalidParams' = 'InvalidParams',
  'ImageNotSupport' = 'ImageNotSupport',
  'STSError' = 'STSError',
  'DBError' = 'DBError',
}

export const ErrorHttpCode = {
  [ErrorType.ServiceInternalError]: StatusCodes.INTERNAL_SERVER_ERROR,
  [ErrorType.ImageNotSupport]: StatusCodes.UNSUPPORTED_MEDIA_TYPE,
  [ErrorType.InvalidParams]: StatusCodes.BAD_REQUEST,
  [ErrorType.STSError]: StatusCodes.INTERNAL_SERVER_ERROR,
  [ErrorType.DBError]: StatusCodes.INTERNAL_SERVER_ERROR,
};

export const ErrorCode = {
  [ErrorType.ServiceInternalError]: -1,
  [ErrorType.ImageNotSupport]: 1001,
  [ErrorType.InvalidParams]: 1002,
  [ErrorType.STSError]: 2001,
  [ErrorType.DBError]: 3001,
};

const unexpectedErrorMsg = 'Unexpected error occurred, please contact delbertbeta@live.com for help';

export const ErrorMsg = {
  [ErrorType.ServiceInternalError]: unexpectedErrorMsg,
  [ErrorType.ImageNotSupport]: 'This imageType is not supported',
  [ErrorType.InvalidParams]: 'Invalid params',
  [ErrorType.STSError]: unexpectedErrorMsg,
  [ErrorType.DBError]: unexpectedErrorMsg,
};
