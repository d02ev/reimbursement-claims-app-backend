import { SERVICE_ERROR_CODES } from './error.codes.js'
import { ERROR_NAMES } from '../constants.js'

export default class AssetExistsError extends Error {
	constructor(
		message,
		errorCode = SERVICE_ERROR_CODES.ASSET_EXISTS,
		meta = null,
		stack = null
	) {
		super(message)
		this.message = message
		this.errorCode = errorCode
		this.meta = meta
		this.name = ERROR_NAMES.ASSET_EXISTS_ERROR,
		this.stack = (stack) ? stack : Error.captureStackTrace(this, this.constructor)
	}
}