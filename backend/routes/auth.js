const router = require("express").Router();
const AuthValidator = require("../validator/auth");
const authController = require("../controller/auth");

router.post("/signup", AuthValidator.validateSignup, authController.signup);
router.post("/login", AuthValidator.validateLogin, authController.login);
router.post(
  "/resend-verification",
  AuthValidator.validateResendVerification,
  authController.resendVerificationCode,
);
router.post(
  "/verify-email",
  AuthValidator.validateVerifyEmail,
  authController.verifyEmail,
);
router.post(
  "/forgot-password",
  AuthValidator.validateForgotPassword,
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  AuthValidator.validateResetPassword,
  authController.resetPassword,
);

module.exports = router;
