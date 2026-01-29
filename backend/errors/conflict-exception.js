const statusCodes = require("../constants/status-codes");

class ConflictException extends Error {
  constructor(message = "Conflict occurred") {
    super(message);
    this.name = "ConflictException";
    this.statusCode = statusCodes.CONFLICT;
  }
}
module.exports = ConflictException;
