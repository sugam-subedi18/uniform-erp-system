const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('Order', {
  order_date: { type: DataTypes.DATEONLY, allowNull: false },
  due_date: { type: DataTypes.DATEONLY, allowNull: false },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'in_production', 'ready', 'dispatched'),
    allowNull: false,
    defaultValue: 'pending',
  },
  confirmed_at: { type: DataTypes.DATE },
}, { tableName: 'orders' });
