import { ERROR_NAMES } from '../constants/app.constants';

export default class ServiceError extends Error {
  constructor(message, errorCode, meta = null, stack = null) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.meta = meta;
    this.name = ERROR_NAMES.SERVICE_ERROR;
    this.stack = stack || Error.captureStackTrace(this, this.constructor);
  }
}
