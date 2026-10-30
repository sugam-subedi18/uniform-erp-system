const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Hosiery is counted in kg, shirting and suiting in meters (see `unit`).
module.exports = sequelize.define('FabricStock', {
  fabric_type: { type: DataTypes.ENUM('hosiery', 'shirting', 'suiting'), allowNull: false },
  color: { type: DataTypes.STRING, allowNull: false },
  unit: { type: DataTypes.ENUM('kg', 'meter'), allowNull: false },
  quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  cost_per_unit: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  reorder_threshold: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
}, { tableName: 'fabric_stock' });
