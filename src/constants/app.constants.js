import {
  ENV_PORT,
  ENV_DATABASE_URL,
  ENV_ACCESS_TOKEN_SECRET_KEY,
  ENV_REFRESH_TOKEN_SECRET_KEY,
  ENV_ACCESS_TOKEN_EXPIRY,
  ENV_REFRESH_TOKEN_EXPIRY,
  ENV_AWS_S3_BUCKET_NAME,
  ENV_AWS_S3_BUCKET_REGION,
  ENV_AWS_S3_ACCESS_KEY_ID,
  ENV_AWS_S3_SECRET_ACCESS_KEY,
  ENV_HASH_SALT_ROUNDS,
} from './env.constants';

const FALLBACK_CONNECTION_PORT = 3000;
const FALLBACK_HASH_SALT_ROUNDS = 10;

export const CONNECTION_PORT = parseInt(ENV_PORT, 10) || FALLBACK_CONNECTION_PORT;
export const DATABASE_URL = ENV_DATABASE_URL;
export const ACCESS_TOKEN_SECRET = ENV_ACCESS_TOKEN_SECRET_KEY;
export const REFRESH_TOKEN_SECRET = ENV_REFRESH_TOKEN_SECRET_KEY;
export const ACCESS_TOKEN_EXP = ENV_ACCESS_TOKEN_EXPIRY;
export const REFRESH_TOKEN_EXP = ENV_REFRESH_TOKEN_EXPIRY;
export const BUCKET_NAME = ENV_AWS_S3_BUCKET_NAME;
export const BUCKET_REGION = ENV_AWS_S3_BUCKET_REGION;
export const AWS_ACCESS_ID = ENV_AWS_S3_ACCESS_KEY_ID;
export const AWS_ACCESS_KEY = ENV_AWS_S3_SECRET_ACCESS_KEY;
export const HASH_SALT_ROUNDS = parseInt(ENV_HASH_SALT_ROUNDS, 10) || FALLBACK_HASH_SALT_ROUNDS;

export const ROLES = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  APPROVER: 'approver',
  USER: 'user',
};
export const ERROR_NAMES = {
  REPOSITORY_ERROR: 'RepositoryError',
  SERVICE_ERROR: 'ServiceError',
  CONTROLLER_ERROR: 'ControllerError',
  ASSET_EXISTS_ERROR: 'AssetExistsError',
  ASSET_DOES_NOT_EXIST_ERROR: 'AssetDoesNotExist',
  AWS_CLIENT_ERROR: 'AWSClientError',
  FILE_UPLOAD_ERROR: 'FileUploadError',
  MIMETYPE_MISMATCH_ERROR: 'MimeTypeMismatchError',
  PASS_NO_MATCH_ERROR: 'PasswordDoNotMatchError',
};