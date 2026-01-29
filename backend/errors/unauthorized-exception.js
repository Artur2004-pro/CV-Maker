const statusCodes = require("../constants/status-codes");

class UnAuthorizedException extends Error {
  constructor(message = "Unauthorized access") {
    super(message);
    this.name = "UnAuthorizedException";
    this.statusCode = statusCodes.UNAUTHORIZED;
  }
}

module.exports = UnAuthorizedException;
