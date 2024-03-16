export default class ClaimCreationResponse {
	constructor(
		statusCode = 201,
		message = 'Claim created successfully',
		data
	) {
		this.statusCode = statusCode
		this.message = message
		this.data = data
	}
}