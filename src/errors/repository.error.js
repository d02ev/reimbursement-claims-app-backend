import { ERROR_NAMES } from '../constants/app.constants';
import AppError from './app.error';

export default class RepositoryError extends AppError {
  constructor(message, errorCode, logging = false, meta = null, stack = null) {
    super(message, errorCode, logging, meta, stack);
    this.message = message;
    this.errorCode = errorCode;
    this.meta = meta;
    this.name = ERROR_NAMES.FILE_UPLOAD_ERROR;
    this.stack = stack || AppError.captureStackTrace(this, this.constructor);
  }
}
