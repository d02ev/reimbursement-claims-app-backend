export default class RegisterUserResponse {
  constructor(data, statusCode = 201, message = 'User created successfully') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}
