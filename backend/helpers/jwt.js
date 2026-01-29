const env = require("./env");
const jwt = require("jsonwebtoken");

function generateToken(payload) {
  if (!payload) {
    throw new Error("Payload is required to generate JWT");
  }
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "7h",
  });
}

function verifyToken(token) {
  if (!token) {
    throw new Error("Token is required for verification");
  }
  return jwt.verify(token, env.JWT_SECRET);
}

module.exports = {
  generateToken,
  verifyToken,
};
