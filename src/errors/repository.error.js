export default class RepositoryError extends Error {
	constructor(
		message,
		errorCode,
		meta = null,
		stack = null
	) {
		super(message)
		this.messag = message
		this.errorCode = errorCode
		this.meta = meta
		this.stack = (stack) ? stack : Error.captureStackTrace(this, this.constructor)
	}
}