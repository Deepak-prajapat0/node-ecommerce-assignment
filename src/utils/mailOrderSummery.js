const nodemailer = require("nodemailer");
const fs = require("fs");
const htmlFile = fs.readFileSync('src/template.html', 'utf-8');


const mailTrackId = async (id, name, email,order) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: "gmail",
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let success = await transporter.sendMail({
      from: `'Deepak' <process.env.EMAIL_USER>`,
      to: email,
      subject: "Thank you for ordering.",
      html: htmlFile,
    });
    if (success) {
      return success;
    }
  } catch (error) {
    return error;
  }
};

module.exports = mailTrackId;
