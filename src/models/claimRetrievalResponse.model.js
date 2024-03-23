export default class ClaimRetrievalResponse {
  constructor(data, statusCode = 200) {
    this.statusCode = statusCode;
    this.data = data;
  }
}
