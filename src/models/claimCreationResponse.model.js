export default class ClaimCreationResponse {
  constructor(data, statusCode = 201, message = 'Claim created successfully') {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
