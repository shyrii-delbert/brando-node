import { ErrorCode, ErrorHttpCode, ErrorMsg, ErrorType } from '$consts/errors';
import { brandoLogger } from '$logger';
import { BrandoError, ErrorRes } from '$typings/errors';
import { Response } from '$typings/response';
import { wrapErrorRes } from '$utils';
import { ErrorRequestHandler } from 'express';
import { isError } from 'lodash-es';

export const errorHandler: ErrorRequestHandler<{}, Response<ErrorRes>> = (err: BrandoError | Error, req, res, next) => {
  if (isError(err)) {
    brandoLogger.error('Unexpected error:', err.message, '\n', err.stack);
    res.status(ErrorHttpCode[ErrorType.ServiceInternalError]);
    res.send(wrapErrorRes(ErrorCode[ErrorType.ServiceInternalError], ErrorMsg[ErrorType.ServiceInternalError]));
    return;
  }

  const { type, extraInfo } = err;
  brandoLogger.error('Error:', type, '\n', extraInfo);
  res.status(ErrorHttpCode[type]);
  res.send(wrapErrorRes(ErrorCode[type], ErrorMsg[type]));
};
