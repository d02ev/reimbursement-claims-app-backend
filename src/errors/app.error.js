import { ERROR_NAMES } from '../constants/app.constants';
import logger from '../utils/logger';

export default class AppError extends Error {
  constructor(
    message,
    errorCode,
    logging = false,
    meta = null,
    stack = null,
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.name = ERROR_NAMES.APP_ERROR;
    this.meta = meta;
    this.stack = stack || Error.captureStackTrace(this, this.constructor);
    if (logging && meta) {
      logger.error(message, { errorMetadata: { errorCode, meta } });
    } else if (logging && !meta) {
      logger.error(message, { errorMetadata: { errorCode } });
    }
  }
}
