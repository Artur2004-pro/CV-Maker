class APIResponse {
  constructor(status, success, message, payload = null) {
    this.status = status;
    this.success = success;
    this.message = message;
    this.payload = payload;
  }
}

module.exports = APIResponse;
