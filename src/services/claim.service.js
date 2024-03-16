import RepositoryError from '../errors/repository.error.js'
import ClaimRepository from '../repositories/claim.repository.js'
import ServiceError from '../errors/service.error.js'
import { SERVICE_ERROR_CODES, DB_ERROR_CODES, AWS_CLIENT_ERROR_CODES } from '../errors/error.codes.js'
import AWSClient from '../utils/aws.js'
import logger from '../utils/logger.js'
import AWSError from '../errors/awsClient.error.js'

export default class ClaimService {
	constructor() {
		this.claimRepository = new ClaimRepository()
		this.awsClient = new AWSClient()
	}

	async createClaim (claimCreationData) {
		try {
			const { date, requestedAmt, fileName, fileBuffer, mimeType, currency, claimType, userId } = claimCreationData
			// use AWS client to store the file details and fetch a url for receipt
			// put the file on the S3 bucket
			await this.awsClient.sendFileToBucket(fileName, fileBuffer, mimeType)

			// fetch the uploaded file's url
			const receipt = await this.awsClient.fetchFileUrlFromBucket(fileName)

			// sanitize data
			const sanitizedRequestedAmt = parseFloat(requestedAmt)
			const sanitizedUserId = parseInt(userId)
			const sanitizedDate = new Date(date).toISOString()

			return await this.claimRepository.create(sanitizedDate, sanitizedRequestedAmt, receipt, currency, claimType, sanitizedUserId)
		} catch (err) {
			if (err instanceof RepositoryError) {
				if (err.errorCode === DB_ERROR_CODES.FOREIGN_KEY_CONSTRAINT_FAILURE) {
					logger.error(err.message, { errorMetadata: err.meta.target })
					throw new ServiceError(err.message, SERVICE_ERROR_CODES.RELATED_RECORD_KEY_ERROR, err.meta.target, err.stack)
				} else if (err.errorCode === DB_ERROR_CODES.COLUMN_VALUE_DT_MISMATCH) {
					logger.error(err.message, { errorMetadata: err.meta.target })
					throw new ServiceError(err.message, SERVICE_ERROR_CODES.INVALID_DB_RECORD_VALUE, err.meta.target, err.stack)
				}

				logger.error(err.message, { errorMetadata: err.meta.target })
				throw new ServiceError(err.message, SERVICE_ERROR_CODES.INTERNAL_DB_ERROR, err.meta.target, err.stack)
			} else if (err instanceof AWSError) {
				logger.error(err.message, { errorMetadata: err.meta, errorCode: err.errorCode })

				switch (err.errorCode) {
				case AWS_CLIENT_ERROR_CODES.S3_CLIENT_GET_ERR:
					throw new ServiceError(err.message, SERVICE_ERROR_CODES.FILE_UPLOAD_TO_CLOUD_FAILED, err.meta, err.stack)
				case AWS_CLIENT_ERROR_CODES.S3_CLIENT_PUT_ERR:
					throw new ServiceError(err.message, SERVICE_ERROR_CODES.FILE_FETCH_FROM_CLOUD_FAILED, err.meta, err.stack)
				}
			} else {
				logger.error(err.message, { errorMetadata: err })
				throw new ServiceError(err.message, SERVICE_ERROR_CODES.UNKNOWN_ERROR, err, err.stack)
			}
		}
	}
}