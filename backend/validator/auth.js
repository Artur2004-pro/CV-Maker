const statusCodes = require("../constants/status-codes");
const APIResponse = require("../helpers/api-response-format");

class AuthValidator {
  static isEmailValid(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  constructor() {
    throw new Error("This class` AuthValidator cannot be instantiated");
  }
  static validateLogin(req, res, next) {
    const data = req.body;
    const errors = [];

    if (!data.email || !AuthValidator.isEmailValid(data.email)) {
      errors.push("Invalid or missing email.");
    }
    if (!data.password) {
      errors.push("Invalid password.");
    }

    if (errors.length > 0) {
      return res.status(statusCodes.BAD_REQUEST).json(
        new APIResponse(statusCodes.BAD_REQUEST, false, "Validation errors", {
          errors,
        }),
      );
    }
    req.body = {
      email: data.email.trim(),
      password: data.password,
    };
    next();
  }
  static validateSignup(req, res, next) {
    const data = req.body;
    const errors = [];

    if (!data.email || !AuthValidator.isEmailValid(data.email)) {
      errors.push("Invalid or missing email.");
    }
    if (!data.password || data.password.length < 6) {
      errors.push("Invalid password.");
    }
    if (errors.length > 0) {
      return res.status(statusCodes.BAD_REQUEST).json(
        new APIResponse(statusCodes.BAD_REQUEST, false, "Validation errors", {
          errors,
        }),
      );
    }
    req.body = {
      email: data.email.trim(),
      password: data.password,
    };
    next();
  }
  static validateVerifyEmail(req, res, next) {
    const data = req.body;
    const errors = [];

    if (!data.email || !AuthValidator.isEmailValid(data.email)) {
      errors.push("Invalid or missing email.");
    }
    if (!data.code) {
      errors.push("Invalid or missing code.");
    }

    if (errors.length > 0) {
      return res.status(statusCodes.BAD_REQUEST).json(
        new APIResponse(statusCodes.BAD_REQUEST, false, "Validation errors", {
          errors,
        }),
      );
    }
    req.body = {
      email: data.email.trim(),
      code: data.code,
    };
    next();
  }
  static validateForgotPassword(req, res, next) {
    const data = req.body;
    const errors = [];

    if (!data.email || !AuthValidator.isEmailValid(data.email)) {
      errors.push("Invalid or missing email.");
    }

    if (errors.length > 0) {
      return res.status(statusCodes.BAD_REQUEST).json(
        new APIResponse(statusCodes.BAD_REQUEST, false, "Validation errors", {
          errors,
        }),
      );
    }
    req.body = {
      email: data.email.trim(),
    };
    next();
  }
  static validateResetPassword(req, res, next) {
    const data = req.body;
    const errors = [];

    if (!data.email || !AuthValidator.isEmailValid(data.email)) {
      errors.push("Invalid or missing email.");
    }
    if (!data.code) {
      errors.push("Invalid or missing code.");
    }
    if (!data.newPassword || data.newPassword.length < 6) {
      errors.push("Invalid new password.");
    }

    if (errors.length > 0) {
      return res.status(statusCodes.BAD_REQUEST).json(
        new APIResponse(statusCodes.BAD_REQUEST, false, "Validation errors", {
          errors,
        }),
      );
    }
    req.body = {
      email: data.email.trim(),
      code: data.code,
      newPassword: data.newPassword,
    };
    next();
  }
  static validateResendVerification(req, res, next) {
    const data = req.body;
    const errors = [];

    if (!data.email || !AuthValidator.isEmailValid(data.email)) {
      errors.push("Invalid or missing email.");
    }

    if (errors.length > 0) {
      return res.status(statusCodes.BAD_REQUEST).json(
        new APIResponse(statusCodes.BAD_REQUEST, false, "Validation errors", {
          errors,
        }),
      );
    }
    req.body = {
      email: data.email.trim(),
    };
    next();
  }
}

module.exports = AuthValidator;
