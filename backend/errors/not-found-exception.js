const statusCodes = require("../constants/status-codes");

class NotFoundException extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundException";
    this.statusCode = statusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundException;
