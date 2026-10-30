const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false }, // bcrypt hash, never plain text
  role: { type: DataTypes.ENUM('admin', 'store_manager', 'sales_staff', 'dispatch_staff'), allowNull: false },
  phone: { type: DataTypes.STRING },
}, { tableName: 'users' });
