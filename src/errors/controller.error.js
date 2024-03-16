import { ERROR_NAMES } from '../constants.js'

export default class ControllerError extends Error {
	constructor(
		message,
		statusCode,
		meta = null,
		stack = null,
	) {
		super(message)
		this.statusCode = statusCode
		this.message = message
		this.meta = meta
		this.name = ERROR_NAMES.CONTROLLER_ERROR
		this.stack = (stack) ? stack : Error.captureStackTrace(this, this.constructor)
	}
}