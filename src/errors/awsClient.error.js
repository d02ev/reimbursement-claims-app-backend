import { ERROR_NAMES } from '../constants.js'

export default class AWSError extends Error {
	constructor(
		message,
		errorCode,
		meta = null,
		stack = null
	) {
		super(message)
		this.message = message
		this.errorCode = errorCode
		this.meta = meta
		this.name = ERROR_NAMES.AWS_CLIENT_ERROR
		this.stack = (stack) ? stack : Error.captureStackTrace(this, this.constructor)
	}
}