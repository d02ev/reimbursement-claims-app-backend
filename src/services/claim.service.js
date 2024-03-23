/* eslint-disable consistent-return */
import RepositoryError from '../errors/repository.error';
import ClaimRepository from '../repositories/claim.repository';
import ServiceError from '../errors/service.error';
import {
  SERVICE_ERROR_CODES,
  DB_ERROR_CODES,
  AWS_CLIENT_ERROR_CODES,
} from '../constants/error.codes';
import AWSClient from '../utils/aws';
import AWSError from '../errors/awsClient.error';

export default class ClaimService {
  constructor() {
    this.claimRepository = new ClaimRepository();
    this.awsClient = new AWSClient();
  }

  async createClaim(claimCreationData) {
    try {
      const {
        date, requestedAmt, fileName, fileBuffer, mimeType, currency, claimType, userId,
      } = claimCreationData;
      // use AWS client to store the file details and fetch a url for receipt
      // put the file on the S3 bucket
      await this.awsClient.sendFileToBucket(fileName, fileBuffer, mimeType);

      // fetch the uploaded file's url
      const receipt = await this.awsClient.fetchFileUrlFromBucket(fileName);

      // sanitize data
      const sanitizedRequestedAmt = parseFloat(requestedAmt);
      const sanitizedDate = new Date(date).toISOString();

      return await this.claimRepository.create(
        sanitizedDate,
        sanitizedRequestedAmt,
        receipt,
        currency,
        claimType,
        userId,
      );
    } catch (err) {
      if (err instanceof RepositoryError) {
        if (err.errorCode === DB_ERROR_CODES.FOREIGN_KEY_CONSTRAINT_FAILURE) {
          throw new ServiceError(
            err.message,
            SERVICE_ERROR_CODES.RELATED_RECORD_KEY_ERROR,
            true,
            err.meta,
            err.stack,
          );
        } else if (err.errorCode === DB_ERROR_CODES.COLUMN_VALUE_DT_MISMATCH) {
          throw new ServiceError(
            err.message,
            SERVICE_ERROR_CODES.INVALID_DB_RECORD_VALUE,
            true,
            err.meta,
            err.stack,
          );
        }

        throw new ServiceError(
          err.message,
          SERVICE_ERROR_CODES.INTERNAL_DB_ERROR,
          true,
          err.meta,
          err.stack,
        );
      } else if (err instanceof AWSError) {
        if (err.errorCode === AWS_CLIENT_ERROR_CODES.S3_CLIENT_GET_ERR) {
          throw new ServiceError(
            err.message,
            SERVICE_ERROR_CODES.FILE_UPLOAD_TO_CLOUD_FAILED,
            true,
            err.meta,
            err.stack,
          );
        } else if (err.errorCode === AWS_CLIENT_ERROR_CODES.S3_CLIENT_PUT_ERR) {
          throw new ServiceError(
            err.message,
            SERVICE_ERROR_CODES.FILE_FETCH_FROM_CLOUD_FAILED,
            true,
            err.meta,
            err.stack,
          );
        }
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
  }

  async getAllClaimsInProcess() {
    try {
      return await this.claimRepository.fetchAllInProcess();
    } catch (err) {
      if (err instanceof RepositoryError) {
        if (err.errorCode === DB_ERROR_CODES.NO_RELATED_RECORDS
          || err.errorCode === DB_ERROR_CODES.RELATIONS_NOT_CONNECTED
          || err.errorCode === DB_ERROR_CODES.CONNECTED_RECORDS_NOT_FOUND) {
          throw new ServiceError(
            err.message,
            SERVICE_ERROR_CODES.RELATED_RECORD_KEY_ERROR,
            true,
            err.meta,
            err.stack,
          );
        } else if (err.errorCode === DB_ERROR_CODES.UNKNOWN_ORM_ERROR
          || err.errorCode === DB_ERROR_CODES.UNKNOWN_DB_ERROR) {
          throw new ServiceError(
            err.message,
            SERVICE_ERROR_CODES.INTERNAL_DB_ERROR,
            true,
            err.meta,
            err.stack,
          );
        }
      }

      throw new ServiceError(
        err.message,
        SERVICE_ERROR_CODES.UNKNOWN_ERROR,
        false,
        err,
        err.stack,
      );
    }
  }

  async getAllApprovedClaims() {
    try {
      return await this.claimRepository.fetchAllApproved();
    } catch (err) {
      if (err instanceof RepositoryError) {
        if (err.errorCode === DB_ERROR_CODES.NO_RELATED_RECORDS
          || err.errorCode === DB_ERROR_CODES.RELATIONS_NOT_CONNECTED
          || err.errorCode === DB_ERROR_CODES.CONNECTED_RECORDS_NOT_FOUND) {
          throw new ServiceError(
            err.message,
            SERVICE_ERROR_CODES.RELATED_RECORD_KEY_ERROR,
            true,
            err.meta,
            err.stack,
          );
        } else if (err.errorCode === DB_ERROR_CODES.UNKNOWN_ORM_ERROR
          || err.errorCode === DB_ERROR_CODES.UNKNOWN_DB_ERROR) {
          throw new ServiceError(
            err.message,
            SERVICE_ERROR_CODES.INTERNAL_DB_ERROR,
            true,
            err.meta,
            err.stack,
          );
        }
      }

      throw new ServiceError(
        err.message,
        SERVICE_ERROR_CODES.UNKNOWN_ERROR,
        false,
        err,
        err.stack,
      );
    }
  }

  async getAllDeclinedClaims() {
    try {
      return await this.claimRepository.fetchAllDeclined();
    } catch (err) {
      if (err instanceof RepositoryError) {
        if (err.errorCode === DB_ERROR_CODES.NO_RELATED_RECORDS
          || err.errorCode === DB_ERROR_CODES.RELATIONS_NOT_CONNECTED
          || err.errorCode === DB_ERROR_CODES.CONNECTED_RECORDS_NOT_FOUND) {
          throw new ServiceError(
            err.message,
            SERVICE_ERROR_CODES.RELATED_RECORD_KEY_ERROR,
            true,
            err.meta,
            err.stack,
          );
        } else if (err.errorCode === DB_ERROR_CODES.UNKNOWN_ORM_ERROR
          || err.errorCode === DB_ERROR_CODES.UNKNOWN_DB_ERROR) {
          throw new ServiceError(
            err.message,
            SERVICE_ERROR_CODES.INTERNAL_DB_ERROR,
            true,
            err.meta,
            err.stack,
          );
        }
      }

      throw new ServiceError(
        err.message,
        SERVICE_ERROR_CODES.UNKNOWN_ERROR,
        false,
        err,
        err.stack,
      );
    }
  }
}
