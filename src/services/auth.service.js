import UserRepository from '../repositories/user.repository';
import { ROLES } from '../constants/app.constants';
import ServiceError from '../errors/service.error';
import { DB_ERROR_CODES, SERVICE_ERROR_CODES } from '../constants/error.codes';
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
} from '../helpers/auth';
import RepositoryError from '../errors/repository.error';
import AssetExistsError from '../errors/assetExists.error';
import AssetDoesNotExist from '../errors/assetDoesNotExist.error';
import PasswordDetailRepository from '../repositories/passwordDetail.repository';
import PasswordNoMatchError from '../errors/passwordNoMatch.error';

export default class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
    this.passwordDetailRepository = new PasswordDetailRepository();
  }

  registerUser = async (userRegistrationData) => {
    try {
      const {
        fullName, email, password, bankName, ifsc, bankAccNum, pan,
      } = userRegistrationData;

      // setting the role of the new user created
      let role = ROLES.USER;
      if (email === 'app.admin@example.com') {
        role = ROLES.SUPER_ADMIN;
      } else if (email === 'app.approver@example.com') {
        role = ROLES.APPROVER;
      }

      // setting the password hash of the new user
      const passwordHash = await hashPassword(password);

      return await this.userRepository.create(
        fullName,
        email,
        passwordHash,
        bankName,
        ifsc,
        bankAccNum,
        pan,
        role,
      );
    } catch (err) {
      if (err instanceof RepositoryError) {
        if (err.errorCode === DB_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION) {
          throw new AssetExistsError(
            err.message,
            SERVICE_ERROR_CODES.ASSET_EXISTS,
            false,
            err.meta,
          );
        }

        throw new ServiceError(
          err.message,
          SERVICE_ERROR_CODES.INTERNAL_DB_ERROR,
          true,
          err.meta,
        );
      } else {
        throw new ServiceError(
          err.message,
          SERVICE_ERROR_CODES.UNKNOWN_ERROR,
          false,
          err,
          err.stack,
        );
      }
    }
  };

  loginUser = async (userLoginData) => {
    try {
      // fetch user details by email
      const user = await this.userRepository.fetchByEmail(userLoginData.email);
      const userPasswordHash = await this.passwordDetailRepository.fetchPasswordHashByUserId(
        user.id,
      );

      // match the password
      if (!(await comparePassword(userLoginData.password, userPasswordHash.passwordHash))) {
        throw new PasswordNoMatchError('Invalid credentials');
      }

      // generate and store a refresh token for the user
      const refreshToken = generateRefreshToken(userLoginData.email);
      await this.passwordDetailRepository.updateRefreshToken(user.id, refreshToken);

      // generate an access token for the user
      const payload = {
        sub: user.id,
        iat: Math.floor(Date.now() / 1000),
      };

      return generateAccessToken(payload);
    } catch (err) {
      if (err instanceof RepositoryError) {
        if (err.errorCode === DB_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION) {
          throw new AssetExistsError(
            err.message,
            SERVICE_ERROR_CODES.ASSET_EXISTS,
            true,
            err.meta,
            err.stack,
          );
        } else if (err.errorCode === DB_ERROR_CODES.INVALID_VALUE) {
          throw new ServiceError(
            err.message,
            SERVICE_ERROR_CODES.INVALID_DB_RECORD_VALUE,
            true,
            err.meta,
            err.stack,
          );
        } else if (err.errorCode === DB_ERROR_CODES.RECORD_DOES_NOT_EXIST) {
          throw new AssetDoesNotExist(
            'User does not exist',
            SERVICE_ERROR_CODES.ASSEST_DOES_NOT_EXIST,
          );
        }

        throw new ServiceError(
          err.message,
          SERVICE_ERROR_CODES.INTERNAL_DB_ERROR,
          true,
          err.meta,
          err.stack,
        );
      } else if (err instanceof PasswordNoMatchError) {
        throw new PasswordNoMatchError(
          err.message,
          SERVICE_ERROR_CODES.PASSWORD_NO_MATCH,
        );
      } else {
        throw new ServiceError(
          err.message,
          SERVICE_ERROR_CODES.UNKNOWN_ERROR,
          true,
          err,
          err.stack,
        );
      }
    }
  };
}
