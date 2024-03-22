export default class LoginUserResponse {
  constructor(accessToken, statusCode = 200) {
    this.statusCode = statusCode;
    this.access_token = accessToken;
  }
}
