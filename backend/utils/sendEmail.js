const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Podcaster" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
    });
    //console.log("📧 Email sent to:", to);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};

module.exports = sendEmail;
