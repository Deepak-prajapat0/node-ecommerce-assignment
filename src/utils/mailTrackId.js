const nodemailer = require("nodemailer");

const mailTrackId = async (id, name, email) => {
  console.log(process.env.EMAIL_HOST);
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
      html: `<h2>Hlo ${name} </h2>
                      <h3>Here is your tracking Id</h3>
                      <h3>${id}</h3>`,
    });
    if (success) {
      return success;
    }
  } catch (error) {
    return error;
  }
};

module.exports = mailTrackId;
