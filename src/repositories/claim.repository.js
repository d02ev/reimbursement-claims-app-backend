import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library'
import { PrismaClient } from '@prisma/client'
import RepositoryError from '../errors/repository.error.js'
import logger from '../utils/logger.js'
import { DB_ERROR_CODES } from '../errors/error.codes.js'

export default class ClaimRepository {
	constructor() {
		this.prismaClient = new PrismaClient()
	}

	async create(date, requestedAmt, receipt, currency, claimType, userId) {
		try {
			const newClaim = await this.prismaClient.claim.create({
				data: {
					date,
					requestedAmt,
					userId,
					receipt: {
						create: {
							receipt
						}
					},
					currency: {
						connectOrCreate: {
							where: { currency },
							create: { currency }
						}
					},
					claimType: {
						connectOrCreate: {
							where: { type: claimType },
							create: { type: claimType }
						}
					}
				}
			})

			return newClaim.id
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				switch (err.code) {
				case 'P2000':
					logger.error(err.message, { errorMetadata: err.meta.target })
					throw new RepositoryError(err.message, DB_ERROR_CODES.COLUMN_VALUE_DT_MISMATCH, err.meta, err.stack)
				case 'P2001':
					logger.error(err.message, { errorMetadata: err.meta.target })
					throw new RepositoryError(err.message, DB_ERROR_CODES.WHERE_CONDITION_DOES_NOT_EXIST, err.meta, err.stack)
				case 'P2003':
					logger.error(err.message, { errorMetadata: err.meta.target })
					throw new RepositoryError(err.message, DB_ERROR_CODES.FOREIGN_KEY_CONSTRAINT_FAILURE, err.meta, err.stack)
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