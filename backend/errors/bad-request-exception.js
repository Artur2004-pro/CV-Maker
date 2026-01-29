const statusCodes = require("../constants/status-codes");

class BadRequestException extends Error {
  constructor(message = "Bad request") {
    super(message);
    this.name = "BadRequestException";
    this.statusCode = statusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestException;
