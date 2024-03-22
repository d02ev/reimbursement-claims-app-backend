import { SERVICE_ERROR_CODES } from '../constants/error.codes';
import { ERROR_NAMES } from '../constants/app.constants';

export default class PasswordNoMatchError extends Error {
  constructor(
    message,
    errorCode = SERVICE_ERROR_CODES.PASSWORD_NO_MATCH,
    meta = null,
    stack = null,
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.meta = meta;
    this.name = ERROR_NAMES.PASS_NO_MATCH_ERROR;
    this.stack = stack || Error.captureStackTrace(this, this.constructor);
  }
}
