const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('Purchase', {
  fabric_type: { type: DataTypes.ENUM('hosiery', 'shirting', 'suiting'), allowNull: false },
  fabric_color: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  total_cost: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  purchase_date: { type: DataTypes.DATEONLY, allowNull: false },
}, { tableName: 'purchases' });
