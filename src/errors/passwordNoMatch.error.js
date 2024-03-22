import { SERVICE_ERROR_CODES } from '../constants/error.codes';
import { ERROR_NAMES } from '../constants/app.constants';
import AppError from './app.error';

export default class PasswordNoMatchError extends AppError {
  constructor(
    message,
    errorCode = SERVICE_ERROR_CODES.PASSWORD_NO_MATCH,
    logging = false,
    meta = null,
    stack = null,
  ) {
    super(message, errorCode, logging, meta, stack);
    this.message = message;
    this.errorCode = errorCode;
    this.meta = meta;
    this.name = ERROR_NAMES.PASS_NO_MATCH_ERROR;
    this.stack = stack || AppError.captureStackTrace(this, this.constructor);
  }
}
