require("dotenv").config();
const nodemailer = require("nodemailer");
// const transporter = nodemailer.createTransport({
//   host: process.env.hostname,
//   port: process.env.emailport,
//   secure: false,
//   tls: {
//     ciphers: "SSLv3",
//     rejectUnauthorized: false,
//   },
//   auth: {
//     user: process.env.user,
//     pass: process.env.pass,
//   },
//   debug: true,
//   logger: true,
// });

// For Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

module.exports = { transporter };