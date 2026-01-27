const { verifyToken } = require("../helpers/jwt");
const User = require("../models/user");
const Errors = require("../errors");

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Errors.UnauthorizedException('Authorization token required');
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new Errors.UnauthorizedException('User not found');
    }

    if (!user.isVerified) {
      throw new Errors.UnauthorizedException('Email not verified');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { authenticate };
