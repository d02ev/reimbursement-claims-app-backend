import { SERVICE_ERROR_CODES } from '../constants/error.codes';
import { ERROR_NAMES } from '../constants/app.constants';
import ServiceError from './service.error';

export default class AssetExistsError extends ServiceError {
  constructor(
    message,
    errorCode = SERVICE_ERROR_CODES.ASSET_EXISTS,
    logging = false,
    meta = null,
    stack = null,
  ) {
    super(message, errorCode, logging, meta, stack);
    this.message = message;
    this.errorCode = errorCode;
    this.meta = meta;
    this.name = ERROR_NAMES.ASSET_EXISTS_ERROR;
    this.stack = stack || ServiceError.captureStackTrace(this, this.constructor);
  }
}
