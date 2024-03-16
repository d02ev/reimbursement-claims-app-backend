import { ERROR_NAMES } from '../constants.js'

export default class MimeTypeMismatchError extends Error {
	constructor(
		message,
		errorCode,
		meta = null,
		stack = null,
	) {
		super(message)
		this.message = message
		this.errorCode = errorCode
		this.meta = meta
		this.name = ERROR_NAMES.MIMETYPE_MISMATCH_ERROR
		this.stack = (stack) ? stack : Error.captureStackTrace(this, this.constructor)
	}
}