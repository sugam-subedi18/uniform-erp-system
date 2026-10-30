const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('Supplier', {
  name: { type: DataTypes.STRING, allowNull: false },
  contact_person: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
}, { tableName: 'suppliers' });
