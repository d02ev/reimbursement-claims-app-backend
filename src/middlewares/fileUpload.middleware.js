import { MulterError } from 'multer'
import logger from '../utils/logger.js'
import { upload } from '../utils/multer.js'
import { FileUploadError } from '../errors/fileUpload.error.js'
import { FILE_UPLOAD_ERROR_CODES } from '../errors/error.codes.js'

export const fileUpload = (req, res, next) => {
	upload.single('receipt') (req, res, (err) => {
		if (err) {
			if (err instanceof MulterError) {
				switch (err.code) {
				case 'LIMIT_FILE_SIZE':
					throw new FileUploadError(err.message, FILE_UPLOAD_ERROR_CODES.FILE_TOO_LARGE, err.name, err.stack)
				case 'LIMIT_FILE_COUNT':
					throw new FileUploadError(err.message, FILE_UPLOAD_ERROR_CODES.TOO_MANY_FILES, err.name, err.stack)
				}
			} else {
				logger.error(err.message, { errorMetadata: err })
				throw new FileUploadError(err.message, FILE_UPLOAD_ERROR_CODES.UNKNOWN_ERROR, null, err.stack)
			}
		}
		next()
	})
}