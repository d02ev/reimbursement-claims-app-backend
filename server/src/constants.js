const FALLBACK_PORT = 3000
const FALLBACK_SALT_ROUND = 10
export const SALT_ROUND = parseInt(process.env.HASH_SALT_ROUNDS) || FALLBACK_SALT_ROUND
export const CONNECTION_PORT = parseInt(process.env.PORT) || FALLBACK_PORT
export const ROLES = {
	ADMIN: 'admin',
	SUPER_ADMIN: 'super_admin',
	APPROVER: 'approver',
	USER: 'user'
}
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
}