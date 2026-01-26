const nodemailer = require("nodemailer");
const env = require("../helpers/env.js");

class EmailAPI {
  static transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com", // կամ SMTP պրովայդեր քո ընտրությամբ
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
      from: `artgrigoryan771@gmail.com`,
      to: email,
      subject: "Բարև Bardiner CV-Maker-ից 🚀 Վավերացրեք ձեր էլ․ հասցեն",
      text: `Շնորհակալություն, որ գրանցվել եք Bardiner CV-Maker-ում: Ձեր verification code-ը՝ ${code}`,
      html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 30px; background-color: #f9f9f9;">
        <h1 style="color: #4a90e2; margin-bottom: 10px;">Bardiner CV-Maker</h1>
        <p style="font-size: 16px; color: #333;">
          Շնորհակալություն, որ գրանցվել եք: Մուտքագրեք այս կոդը verification համար՝
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
          Եթե դուք չեք ստեղծել այս հաշիվը, պարզապես անտեսեք այս նամակը:
        </p>
      </div>
      `,
    };

    return this.send(mailOptions);
  }

  // Send password reset email
  async sendPasswordResetEmail(email, code) {
    const mailOptions = {
      from: `artgrigoryan771@gmail.com`,
      to: email,
      subject: "Bardiner CV-Maker — Reset Password",
      text: `Ձեր reset code-ը՝ ${code} (վավեր է 15 րոպե)`,
      html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 30px; background-color: #f9f9f9;">
        <h1 style="color: #4a90e2; margin-bottom: 10px;">Bardiner CV-Maker</h1>
        <p style="font-size: 16px; color: #333;">
          Ձեր գաղտնաբառը վերականգնելու համար օգտագործեք այս կոդը՝
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
          Կոդը վավեր է միայն 15 րոպե:
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
