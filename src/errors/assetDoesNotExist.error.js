import { ERROR_NAMES } from '../constants/app.constants';
import { SERVICE_ERROR_CODES } from '../constants/error.codes';

export default class AssetDoesNotExistError extends Error {
  constructor(
    message,
    errorCode = SERVICE_ERROR_CODES.ASSEST_DOES_NOT_EXIST,
    meta = null,
    stack = null,
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.meta = meta;
    this.name = ERROR_NAMES.ASSET_DOES_NOT_EXIST_ERROR;
    this.stack = stack || Error.captureStackTrace(this, this.constructor);
  }
}
