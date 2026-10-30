require('dotenv').config();
const nodemailer = require('nodemailer');
const t = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS } });
t.sendMail({ from: process.env.MAIL_USER, to: process.env.MAIL_TO || process.env.MAIL_USER, subject: 'Uniform ERP test', text: 'It works.' })
  .then(() => console.log('Test email sent'))
  .catch((e) => console.error('Email failed:', e.message));
  