const nodemailer = require('nodemailer');
const { User } = require('../models');

let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) return null;
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  });
  return transporter;
}

// Sends the low-stock email once, when a fabric drops below its reorder point.
// wasLow = whether it was already below the point before this change (so we do not repeat the email).
async function notifyIfLow(fabric, wasLow) {
  const isLow = Number(fabric.quantity) < Number(fabric.reorder_threshold);
  if (!isLow || wasLow) return;

  const staff = await User.findAll({ where: { role: ['admin', 'store_manager'] } });
  const recipients = new Set(staff.map((u) => u.email));
  if (process.env.MAIL_TO) process.env.MAIL_TO.split(',').map((e) => e.trim()).filter(Boolean).forEach((e) => recipients.add(e));

  const subject = `Low stock: ${fabric.color} ${fabric.fabric_type}`;
  const text =
    `${fabric.color} ${fabric.fabric_type} is running low.\n\n` +
    `In stock: ${Number(fabric.quantity)} ${fabric.unit}\n` +
    `Reorder point: ${Number(fabric.reorder_threshold)} ${fabric.unit}\n\n` +
    `Please place a purchase order soon to avoid stopping production.`;

  const t = getTransporter();
  if (!t) {
    console.log(`[low-stock] ${subject} (${Number(fabric.quantity)} ${fabric.unit} left). Email not configured, so nothing was sent.`);
    return;
  }
  try {
    await t.sendMail({ from: `"Uniform ERP" <${process.env.MAIL_USER}>`, to: [...recipients].join(','), subject, text });
    console.log(`[low-stock] Email sent for ${fabric.color} ${fabric.fabric_type}`);
  } catch (err) {
    console.error('[low-stock] Email failed:', err.message);
  }
}

module.exports = { notifyIfLow };
