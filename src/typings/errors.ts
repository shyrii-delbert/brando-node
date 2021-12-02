import { ErrorType } from '$consts/errors';

export interface BrandoError {
  type: ErrorType;
  extraInfo?: string;
}

export interface ErrorRes {
  msg: string;
}
