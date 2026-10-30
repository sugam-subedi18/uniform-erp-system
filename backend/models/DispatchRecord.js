const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('DispatchRecord', {
  dispatch_date: { type: DataTypes.DATEONLY, allowNull: false },
  delivery_status: { type: DataTypes.ENUM('pending', 'shipped', 'delivered'), allowNull: false, defaultValue: 'shipped' },
  notes: { type: DataTypes.TEXT },
}, { tableName: 'dispatch_records' });
