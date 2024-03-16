export default class RegisterUserResponse {
	constructor(
		statusCode = 201,
		data,
		message = 'User created successfully'
	) {
		this.statusCode = statusCode
		this.data = data
		this.message = message
	}
}