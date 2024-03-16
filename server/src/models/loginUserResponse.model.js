export default class LoginUserResponse {
	constructor(
		statusCode = 200,
		accessToken,
	) {
		this.statusCode = statusCode
		this.access_token = accessToken
	}
}