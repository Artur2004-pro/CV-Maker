const emailAPI = require("../lib/email-api");
const User = require("../models/user");
const Errors = require("../errors/");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/jwt");

class UserService {
  static verificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  async handleLogin(data) {
    try {
      const { email, password } = data;
      const found = await User.findOne({ email });
      if (!found) {
        throw new Errors.NotFoundException("User not found");
      }
      const itsOk = await bcrypt.compare(password, found.password);
      if (!itsOk) {
        throw new Errors.BadRequestException("Invalid credentials");
      }
      
      const token = generateToken({ id: found._id });
      
      // Return token and user data
      return {
        token,
        user: {
          id: found._id,
          email: found.email,
          isVerified: found.isVerified,
          createdAt: found.createdAt,
          updatedAt: found.updatedAt
        }
      };
    } catch (err) {
      throw Errors.handleServiceError(err);
    }
  }
  async handleSignup(data) {
    try {
      const { email, password } = data;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const error = new Error("Email already taken");
        error.statusCode = 409;
        throw error;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        email: email,
        password: hashedPassword,
      });
      const code = UserService.verificationCode();
      newUser.verificationCode = code;
      newUser.verificationCodeExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
      await newUser.save();
      await emailAPI.sendVerificationEmail(newUser.email, code);
      return true;
    } catch (err) {
      console.error("Error in handleSignup:", err);
      throw Errors.handleServiceError(err);
    }
  }
  async handleVerifyEmail(data) {
    try {
      const { email, code } = data;
      const user = await User.findOne({ email });
      if (!user) {
        throw new Errors.NotFoundException("User not found");
      }
      if (user.isVerified) {
        throw new Errors.BadRequestException("Email already verified");
      }
      const now = Date.now();
      if (user.verificationCodeExpiry < now) {
        throw new Errors.BadRequestException("Verification code has expired");
      }
      if (code !== user.verificationCode) {
        throw new Errors.BadRequestException("Invalid verification code");
      }
      user.isVerified = true;
      await user.save();
      return generateToken({ id: user._id });
    } catch (err) {
      throw Errors.handleServiceError(err);
    }
  }
  async handleForgotPassword(data) {
    try {
      const { email } = data;
      const user = await User.findOne({ email });
      if (!user) {
        throw new Errors.NotFoundException("User not found");
      }
      if (!user.isVerified) {
        throw new Errors.BadRequestException("Email not verified");
      }
      const code = UserService.verificationCode();
      user.passwordResetCode = code;
      user.passwordResetCodeExpiry = Date.now() + 15 * 60 * 1000;
      await user.save();
      await emailAPI.sendPasswordResetEmail(user.email, code);
      return true;
    } catch (err) {
      throw Errors.handleServiceError(err);
    }
  }
  async handleResetPassword(data) {
    try {
      const { email, code, newPassword } = data;
      const user = await User.findOne({ email });
      if (!user) {
        throw new Errors.NotFoundException("User not found");
      }
      const now = Date.now();
      if (user.passwordResetCodeExpiry < now) {
        throw new Errors.BadRequestException("Password reset code has expired");
      }
      if (code !== user.passwordResetCode) {
        throw new Errors.BadRequestException("Invalid password reset code");
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.passwordResetCode = null;
      user.passwordResetCodeExpiry = null;
      await user.save();
      return generateToken({ id: user._id });
    } catch (err) {
      throw Errors.handleServiceError(err);
    }
  }
  async handleResendVerificationCode(data) {
    try {
      const { email } = data;
      const user = await User.findOne({ email });
      if (!user) {
        throw new Errors.NotFoundException("User not found");
      }
      if (user.isVerified) {
        throw new Errors.BadRequestException("Email already verified");
      }
      const code = UserService.verificationCode();
      user.verificationCode = code;
      user.verificationCodeExpiry = Date.now() + 15 * 60 * 1000;
      await user.save();
      await emailAPI.sendVerificationEmail(user.email, code);
      return true;
    } catch (err) {
      throw Errors.handleServiceError(err);
    }
  }
}

module.exports = new UserService();
