const statusCodes = require("../constants/status-codes");

module.exports = function handleServiceError(err) {
  if (err.isJoi) {
    return {
      statusCode: statusCodes.BAD_REQUEST,
      message: err.details.map((detail) => detail.message).join(", "),
    };
  }

  if (err.statusCode && err.message) {
    return {
      statusCode: err.statusCode,
      message: err.message,
    };
  }

  return {
    statusCode: statusCodes.INTERNAL_SERVER_ERROR,
    message: "Internal Server Error",
  };
};
