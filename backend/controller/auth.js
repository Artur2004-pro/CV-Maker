const statusCodes = require("../constants/status-codes");
const APIResponse = require("../helpers/api-response-format");

class AuthController {
  static service = require("../service/user");
  async login(req, res) {
    try {
      const token = await AuthController.service.handleLogin(req.body);
      return res
        .status(statusCodes.SUCCESS)
        .json(
          new APIResponse(statusCodes.SUCCESS, true, "Login successful", token),
        );
    } catch (err) {
      const statusCode = err.statusCode || statusCodes.UNAUTHORIZED;
      return res
        .status(statusCode)
        .json(new APIResponse(statusCode, false, err.message));
    }
  }
  async signup(req, res) {
    try {
      await AuthController.service.handleSignup(req.body);
      return res
        .status(statusCodes.CREATED)
        .json(new APIResponse(statusCodes.CREATED, true, "User created successfully", null));
    } catch (err) {
      const statusCode = err.statusCode || statusCodes.BAD_REQUEST;
      return res
        .status(statusCode)
        .json(new APIResponse(statusCode, false, err.message));
    }
  }
  async verifyEmail(req, res) {
    try {
      const token = await AuthController.service.handleVerifyEmail(req.body);
      return res
        .status(statusCodes.SUCCESS)
        .json(
          new APIResponse(statusCodes.SUCCESS, true, "Email verified", token),
        );
    } catch (err) {
      const statusCode = err.statusCode || statusCodes.BAD_REQUEST;
      return res
        .status(statusCode)
        .json(new APIResponse(statusCode, false, err.message));
    }
  }
  async resendVerificationCode(req, res) {
    try {
      await AuthController.service.handleResendVerificationCode(req.body);
      return res
        .status(statusCodes.SUCCESS)
        .json(
          new APIResponse(
            statusCodes.SUCCESS,
            true,
            "Verification code resent",
          ),
        );
    } catch (err) {
      const statusCode = err.statusCode || statusCodes.NOT_FOUND;
      return res
        .status(statusCode)
        .json(new APIResponse(statusCode, false, err.message));
    }
  }
  async forgotPassword(req, res) {
    try {
      await AuthController.service.handleForgotPassword(req.body);
      return res
        .status(statusCodes.SUCCESS)
        .json(
          new APIResponse(
            statusCodes.SUCCESS,
            true,
            "Password reset code sent",
          ),
        );
    } catch (err) {
      const statusCode = err.statusCode || statusCodes.NOT_FOUND;
      return res
        .status(statusCode)
        .json(new APIResponse(statusCode, false, err.message));
    }
  }
  async resetPassword(req, res) {
    try {
      const token = await AuthController.service.handleResetPassword(req.body);
      return res
        .status(statusCodes.SUCCESS)
        .json(
          new APIResponse(
            statusCodes.SUCCESS,
            true,
            "Password has been reset",
            token,
          ),
        );
    } catch (err) {
      const statusCode = err.statusCode || statusCodes.BAD_REQUEST;
      return res
        .status(statusCode)
        .json(new APIResponse(statusCode, false, err.message));
    }
  }
}

module.exports = new AuthController();
