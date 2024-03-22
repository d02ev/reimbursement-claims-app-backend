import { ERROR_NAMES } from '../constants/app.constants';

export default class FileUploadError extends Error {
  constructor(message, errorCode, meta = null, stack = null) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.meta = meta;
    this.name = ERROR_NAMES.FILE_UPLOAD_ERROR;
    this.stack = stack || Error.captureStackTrace(this, this.constructor);
  }
}
