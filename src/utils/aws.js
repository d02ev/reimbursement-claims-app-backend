import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import logger from './logger';
import AWSError from '../errors/awsClient.error';
import { AWS_CLIENT_ERROR_CODES } from '../constants/error.codes';

const bucketName = process.env.AWS_S3_BUCKET_NAME;
const bucketRegion = process.env.AWS_S3_BUCKET_REGION;
const accessKeyId = process.env.AWS_S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY;

export default class AWSClient {
  constructor() {
    this.awsClient = new S3Client({
      region: bucketRegion,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async sendFileToBucket(fileName, fileBuffer, mimeType) {
    try {
      const putCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
      });

      await this.awsClient.send(putCommand);
    } catch (err) {
      if (err instanceof S3ServiceException) {
        throw new AWSError(
          err.message,
          AWS_CLIENT_ERROR_CODES.S3_CLIENT_PUT_ERR,
          true,
          { response: err.$response, fault: err.$fault },
          err.stack,
        );
      } else {
        throw new AWSError(err.message, AWS_CLIENT_ERROR_CODES.UNKNOWN_ERROR, true, err, err.stack);
      }
    }
  }

  async fetchFileUrlFromBucket(fileName) {
    try {
      const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });

      return await getSignedUrl(this.awsClient, getCommand, {
        expiresIn: 60 * 60 * 60,
      });
    } catch (err) {
      if (err instanceof S3ServiceException) {
        throw new AWSError(
          err.message,
          AWS_CLIENT_ERROR_CODES.S3_CLIENT_GET_ERR,
          true,
          { response: err.$response, fault: err.$fault },
          err.stack,
        );
      } else {
        logger.error(err.message, { errorMetadata: err });
        throw new AWSError(err.message, AWS_CLIENT_ERROR_CODES.UNKNOWN_ERROR, true, err, err.stack);
      }
    }
  }

  async removeFileFromBucket(fileName) {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });

      return await this.awsClient.send(deleteCommand);
    } catch (err) {
      if (err instanceof S3ServiceException) {
        throw new AWSError(
          err.message,
          AWS_CLIENT_ERROR_CODES.S3_CLIENT_DEL_ERR,
          true,
          { response: err.$response, fault: err.$fault },
          err.stack,
        );
      } else {
        throw new AWSError(err.message, AWS_CLIENT_ERROR_CODES.UNKNOWN_ERROR, true, err, err.stack);
      }
    }
  }
}
