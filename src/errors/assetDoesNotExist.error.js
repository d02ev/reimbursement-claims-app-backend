import { ERROR_NAMES } from '../constants/app.constants';
import { SERVICE_ERROR_CODES } from '../constants/error.codes';
import ServiceError from './service.error';

export default class AssetDoesNotExistError extends ServiceError {
  constructor(
    message,
    errorCode = SERVICE_ERROR_CODES.ASSEST_DOES_NOT_EXIST,
    logging = false,
    meta = null,
    stack = null,
  ) {
    super(message, errorCode, logging, meta, stack);
    this.message = message;
    this.errorCode = errorCode;
    this.meta = meta;
    this.name = ERROR_NAMES.ASSET_DOES_NOT_EXIST_ERROR;
    this.stack = stack || ServiceError.captureStackTrace(this, this.constructor);
  }
}
