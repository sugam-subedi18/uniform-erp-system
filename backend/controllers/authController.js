const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const ROLES = ['admin', 'store_manager', 'sales_staff', 'dispatch_staff'];
const safeUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, phone: u.phone });

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    const ok = user && (await bcrypt.compare(password, user.password));
    if (!ok) return res.status(401).json({ message: 'Wrong email or password' });

    const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: safeUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong on the server' });
  }
};

// Admin only: create a staff account
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ message: 'Name, email, password and role are required' });
    if (!ROLES.includes(role)) return res.status(400).json({ message: 'Role must be one of: ' + ROLES.join(', ') });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const cleanEmail = email.trim().toLowerCase();
    if (await User.findOne({ where: { email: cleanEmail } })) return res.status(409).json({ message: 'That email is already registered' });

    const user = await User.create({ name, email: cleanEmail, password: await bcrypt.hash(password, 10), role, phone });
    res.status(201).json(safeUser(user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong on the server' });
  }
};

exports.me = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(safeUser(user));
};

exports.listUsers = async (req, res) => {
  const users = await User.findAll({ order: [['id', 'ASC']] });
  res.json(users.map(safeUser));
};
