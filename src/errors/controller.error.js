import { ERROR_NAMES } from '../constants/app.constants';

export default class ControllerError extends Error {
  constructor(message, statusCode, meta = null, stack = null) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.meta = meta;
    this.name = ERROR_NAMES.CONTROLLER_ERROR;
    this.stack = stack || Error.captureStackTrace(this, this.constructor);
  }
}
