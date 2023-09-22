const nodemailer = require("nodemailer")

const otpSender =async(token,name, email)=> {
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
      subject: "Verify your email",
      html: `<h2>Hlo ${name} </h2>
                      <h3>Click this link to update your password</h3>
                      <h6>This link is valid for 5 minutes</h6>
                      <br/>
                      <h3>Link :  ${process.env.HOST_URL}/updatepassword/${token}</h3>`,
    });
    if(success){
      return success
    }
  } catch (error) {
    return error
  }
};

module.exports = otpSender