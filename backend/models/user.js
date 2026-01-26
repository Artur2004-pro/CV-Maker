const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verificationCode: { type: String },
    verificationCodeExpiry: { type: Date },
    passwordResetCode: { type: String },
    passwordResetCodeExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
