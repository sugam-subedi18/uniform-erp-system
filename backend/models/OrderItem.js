const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('OrderItem', {
  uniform_type: { type: DataTypes.STRING, allowNull: false },
  size: { type: DataTypes.STRING, allowNull: false },
  color: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  design_image: { type: DataTypes.STRING },   // saved file path, set when the order is confirmed
  printing_details: { type: DataTypes.TEXT }, // set when the order is confirmed
}, { tableName: 'order_items' });
