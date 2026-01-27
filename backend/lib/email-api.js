const nodemailer = require("nodemailer");
const env = require("../helpers/env.js");

class EmailAPI {
  static transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Use Gmail's SMTP server
    port: 587,
    secure: false,
    auth: {
      user: env.APP_EMAIL,
      pass: env.APP_PASSWORD,
    },
  });

  // Send verification email (registration)
  async sendVerificationEmail(email, code) {
    const mailOptions = {
      from: env.APP_EMAIL,
      to: email,
      subject: "CV Maker - Verify Your Email",
      text: `Your verification code is: ${code}`,
      html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 30px; background-color: #f9f9f9;">
        <h1 style="color: #4a90e2; margin-bottom: 10px;">CV Maker</h1>
        <p style="font-size: 16px; color: #333;">
          Thank you for registering! Your verification code is:
        </p>
        <div style="
          display: inline-block;
          padding: 12px 25px;
          font-size: 18px;
          font-weight: bold;
          color: white;
          background-color: #4a90e2;
          border-radius: 6px;
          margin: 20px 0;
        ">
          ${code}
        </div>
        <p style="font-size: 12px; color: #888;">
          This code will expire in 15 minutes.
        </p>
      </div>
      `,
    };

    return this.send(mailOptions);
  }

  // Send password reset email
  async sendPasswordResetEmail(email, code) {
    const mailOptions = {
      from: env.APP_EMAIL,
      to: email,
      subject: "CV Maker - Reset Password",
      text: `Your password reset code is: ${code}`,
      html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 30px; background-color: #f9f9f9;">
        <h1 style="color: #4a90e2; margin-bottom: 10px;">CV Maker</h1>
        <p style="font-size: 16px; color: #333;">
          You requested to reset your password. Use this code:
        </p>
        <div style="
          display: inline-block;
          padding: 15px 30px;
          font-size: 22px;
          font-weight: bold;
          background-color: #4a90e2;
          color: #fff;
          border-radius: 8px;
          margin: 20px 0;
        ">
          ${code}
        </div>
        <p style="font-size: 12px; color: #888;">
          This code is valid for 15 minutes only.
        </p>
      </div>
      `,
    };

    return this.send(mailOptions);
  }

  // Generic send method
  async send(mailOptions) {
    try {
      const info = await EmailAPI.transporter.sendMail(mailOptions);
      return info;
    } catch (err) {
      console.error("Email send error:", err);
      return null;
    }
  }
}

module.exports = new EmailAPI();
