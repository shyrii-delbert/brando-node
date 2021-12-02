import { ErrorCode, ErrorHttpCode, ErrorMsg, ErrorType } from '$consts/errors';
import { BrandoError, ErrorRes } from '$typings/errors';
import { Response } from '$typings/response';
import { wrapErrorRes } from '$utils';
import { ErrorRequestHandler } from 'express';
import { isError } from 'lodash-es';

export const errorHandler: ErrorRequestHandler<{}, Response<ErrorRes>> = (err: BrandoError | Error, req, res, next) => {
  if (isError(err)) {
    console.error('===== Unexpected error:', err.message, '\n', err.stack);
    res.status(ErrorHttpCode[ErrorType.ServiceInternalError]);
    res.send(wrapErrorRes(ErrorCode[ErrorType.ServiceInternalError], ErrorMsg[ErrorType.ServiceInternalError]));
    return;
  }

  const { type, extraInfo } = err;
  console.error('===== Error:', type, '\n', extraInfo);
  res.status(ErrorHttpCode[type]);
  res.send(wrapErrorRes(ErrorCode[type], ErrorMsg[type]));
};
