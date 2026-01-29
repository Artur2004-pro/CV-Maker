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
    profile: {
      firstName: { type: String, default: '' },
      lastName: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      summary: { type: String, default: '' },
      skills: [{ type: String }],
      languages: [{
        name: { type: String },
        level: { type: String }
      }],
      experience: [{
        company: { type: String },
        position: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        description: { type: String }
      }],
      education: [{
        school: { type: String },
        degree: { type: String },
        startDate: { type: String },
        endDate: { type: String }
      }]
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
