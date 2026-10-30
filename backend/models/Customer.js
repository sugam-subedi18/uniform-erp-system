const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('Customer', {
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('company', 'school', 'individual'), allowNull: false },
  contact_person: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
}, { tableName: 'customers' });
