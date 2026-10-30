const sequelize = require('../config/db');
const User = require('./User');
const Customer = require('./Customer');
const Supplier = require('./Supplier');
const FabricStock = require('./FabricStock');
const Purchase = require('./Purchase');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const DispatchRecord = require('./DispatchRecord');

// Suppliers
Supplier.hasMany(FabricStock, { foreignKey: 'supplier_id' });
FabricStock.belongsTo(Supplier, { foreignKey: 'supplier_id' });
Supplier.hasMany(Purchase, { foreignKey: 'supplier_id' });
Purchase.belongsTo(Supplier, { foreignKey: 'supplier_id' });

// Users
User.hasMany(Purchase, { foreignKey: 'ordered_by' });
Purchase.belongsTo(User, { foreignKey: 'ordered_by', as: 'orderedBy' });
User.hasMany(Order, { foreignKey: 'created_by' });
Order.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.hasMany(DispatchRecord, { foreignKey: 'dispatched_by' });
DispatchRecord.belongsTo(User, { foreignKey: 'dispatched_by', as: 'dispatcher' });

// Orders
Customer.hasMany(Order, { foreignKey: 'customer_id' });
Order.belongsTo(Customer, { foreignKey: 'customer_id' });
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
FabricStock.hasMany(OrderItem, { foreignKey: 'fabric_id' });
OrderItem.belongsTo(FabricStock, { foreignKey: 'fabric_id', as: 'fabric' });
Order.hasOne(DispatchRecord, { foreignKey: 'order_id' });
DispatchRecord.belongsTo(Order, { foreignKey: 'order_id' });

module.exports = { sequelize, User, Customer, Supplier, FabricStock, Purchase, Order, OrderItem, DispatchRecord };
