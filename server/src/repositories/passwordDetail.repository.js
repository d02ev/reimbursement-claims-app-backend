import { PrismaClient } from '@prisma/client'
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library'
import logger from '../utils/logger.js'
import RepositoryError from '../errors/repository.error.js'
import { DB_ERROR_CODES } from '../errors/error.codes.js'

export default class PasswordDetailRepository {
	constructor() {
		this.prismaClient = new PrismaClient()
	}

	async fetchPasswordHashByUserId(userId) {
		try {
			return await this.prismaClient.passwordDetail.findUniqueOrThrow({
				where: { userId },
				select: {
					passwordHash: true
				}
			})
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				switch (err.code) {
				case 'P2025':
					throw new RepositoryError(`User with ${err.meta.target}=${userId} does not exist`, DB_ERROR_CODES.RECORD_DOES_NOT_EXIST, err.meta)
				}
			} else if (err instanceof PrismaClientUnknownRequestError) {
				logger.error(err.message, { errorMetadata: err.meta })
				throw new RepositoryError(err.message, DB_ERROR_CODES.UNKNOWN_ORM_ERROR, err.meta, err.stack)
			}

			logger.error(err.message, { errorMetadata: err })
			throw new RepositoryError(err.message, DB_ERROR_CODES.UNKNOWN_ERROR, err, err.stack)
		} 
	}

	async updateRefreshToken (userId, newRefreshToken) {
		try {
			await this.prismaClient.passwordDetail.update({
				where: { userId },
				data: {
					refreshToken: newRefreshToken
				}
			})

			return true
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				switch (err.code) {
				case 'P2000':
					logger.error(err.message, { errorMetadata: err.meta.target })
					throw new RepositoryError(err.message, DB_ERROR_CODES.COLUMN_VALUE_DT_MISMATCH, err.meta, err.stack)
				case 'P2002':
					logger.error(err.message, { errorMetadata: err.meta.target })
					throw new RepositoryError(err.message, DB_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION, err.meta, err.stack)
				case 'P2003':
					logger.error(err.message, { errorMetadata: err.meta.target })
					throw new RepositoryError(err.message, DB_ERROR_CODES.FOREIGN_KEY_CONSTRAINT_FAILURE, err.meta, err.stack)
				case '2006':
					logger.error(err.message, { errorMetadata: err.meta.target })
					throw new RepositoryError(err.message, DB_ERROR_CODES.INVALID_VALUE, err.meta, err.stack)
				} 
			} else if (err instanceof PrismaClientUnknownRequestError) {
				logger.error(err.message, { errorMetadata: err.meta })
				throw new RepositoryError(err.message, DB_ERROR_CODES.UNKNOWN_ORM_ERROR, err.meta, err.stack)
			}

			logger.error(err.message, { errorMetadata: err })
			throw new RepositoryError(err.message, DB_ERROR_CODES.UNKNOWN_ERROR, err, err.stack)
		}
	}
}