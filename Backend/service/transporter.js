require("dotenv").config();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user:process.env.emailuser,
    pass:process.env.emailpassword,
  }
});

// For Gmail
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   secure: true,
//   port: 465,
//   auth: {
//     user: process.env.user,
//     pass: process.env.pass,
//   },
// });

module.exports = { transporter };