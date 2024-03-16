import UserRepository from '../repositories/user.repository.js'
import logger from '../utils/logger.js'
import { ROLES } from '../constants.js'
import ServiceError from '../errors/service.error.js'
import { DB_ERROR_CODES, SERVICE_ERROR_CODES } from '../errors/error.codes.js'
import { comparePassword, generateAccessToken, generateRefreshToken, hashPassword } from '../helpers/auth.js'
import RepositoryError from '../errors/repository.error.js'
import AssetExistsError from '../errors/assetExists.error.js'
import AssetDoesNotExist from '../errors/assetDoesNotExist.error.js'
import PasswordDetailRepository from '../repositories/passwordDetail.repository.js'
import PasswordNoMatchError from '../errors/passwordNoMatch.error.js'

export default class AuthService {
	constructor() {
		this.userRepository = new UserRepository()
		this.passwordDetailRepository = new PasswordDetailRepository()
	}

	registerUser = async (userRegistrationData) => {
		try {
			const { fullName, email, password, bankName, ifsc, bankAccNum, pan } = userRegistrationData

			// setting the role of the new user created
			let role = ROLES.USER
			if (email === 'app.superadmin@example.com') {
				role = ROLES.SUPER_ADMIN
			} else if (email === 'app.admin@example.com') {
				role = ROLES.ADMIN
			}

			// setting the password hash of the new user
			const passwordHash = await hashPassword(password)

			// creating a refresh token
			const refreshToken = generateRefreshToken(email)

			return await this.userRepository.create(fullName, email, passwordHash, refreshToken, role, false, bankName, ifsc, bankAccNum, pan)
		} catch (err) {
			if (err instanceof RepositoryError) {
				if (err.errorCode === DB_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION) {
					throw new AssetExistsError(err.message, SERVICE_ERROR_CODES.ASSET_EXISTS, err.meta.target)
				}

				logger.error(err.message, { errorMetadata: err.meta.target })
				throw new ServiceError(err.message, SERVICE_ERROR_CODES.INTERNAL_DB_ERROR, err.meta.target)
			} else {
				logger.error(err.message, { errorMetadata: err })
				throw new ServiceError(err.message, SERVICE_ERROR_CODES.UNKNOWN_ERROR, err)
			}
		}
	}

	loginUser = async (userLoginData) => {
		try {
			// fetch user details by email
			const user = await this.userRepository.fetchByEmail(userLoginData.email)
			const userPasswordHash = await this.passwordDetailRepository.fetchPasswordHashByUserId(user.id)

			// match the password
			if (!(await comparePassword(userLoginData.password, userPasswordHash.passwordHash))) {
				throw new PasswordNoMatchError('Invalid credentials', SERVICE_ERROR_CODES.PASSWORD_NO_MATCH)
			}

			// generate an access token for the user
			const payload = {
				sub: user.id,
				iat: Math.floor(Date.now() / 1000)
			}
			
			return generateAccessToken(payload)
		} catch (err) {
			if (err instanceof RepositoryError) {
				if (err.errorCode === DB_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION) {
					logger.error(err.message, { errorMetadata: err.meta.target })
					throw new AssetExistsError(err.message, SERVICE_ERROR_CODES.ASSET_EXISTS, err.meta.target, err.stack)
				} else if (err.errorCode === DB_ERROR_CODES.INVALID_VALUE) {
					logger.error(err.message, { errorMetadata: err.meta.target })
					throw new ServiceError(err.message, SERVICE_ERROR_CODES.INVALID_DB_RECORD_VALUE, err.meta.target, err.stack)
				} else if (err.errorCode === DB_ERROR_CODES.RECORD_DOES_NOT_EXIST) {
					throw new AssetDoesNotExist(err.message, SERVICE_ERROR_CODES.ASSEST_DOES_NOT_EXIST, err.meta.target)
				}

				logger.error(err.message, { errorMetadata: err.meta.target })
				throw new ServiceError(err.message, SERVICE_ERROR_CODES.INTERNAL_DB_ERROR, err.meta.target, err.stack)
			} else if (err instanceof PasswordNoMatchError) {
				throw new PasswordNoMatchError('Invalid credentials', SERVICE_ERROR_CODES.PASSWORD_NO_MATCH)
			} else {
				logger.error(err.message, { errorMetadata: err })
				throw new ServiceError(err.message, SERVICE_ERROR_CODES.UNKNOWN_ERROR, err, err.stack)
			}
		}
	}
}