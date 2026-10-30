// Run once:  node seedSample.js
// Loads the sample suppliers and fabrics so the frontend's sample orders match real fabric rows.
// WARNING: this first deletes ALL rows in the suppliers and fabric_stock tables.
require('dotenv').config();
const { sequelize, Supplier, FabricStock } = require('./models');

(async () => {
  try {
    await sequelize.sync();
    await FabricStock.destroy({ where: {} });
    await Supplier.destroy({ where: {} });

    await Supplier.bulkCreate([
      { id: 1, name: 'Himalayan Textiles', contact_person: 'Ramesh Shrestha', phone: '9801234567', email: 'ramesh@himtex.example', address: 'Kathmandu' },
      { id: 2, name: 'Bhaktapur Knit House', contact_person: 'Sita Maharjan', phone: '9812345678', email: 'sita@knithouse.example', address: 'Bhaktapur' },
      { id: 3, name: 'Birgunj Suiting Mart', contact_person: 'Anil Gupta', phone: '9823456789', email: 'anil@suitingmart.example', address: 'Birgunj' },
    ]);
    await FabricStock.bulkCreate([
      { id: 1, fabric_type: 'hosiery', color: 'Navy Blue', unit: 'kg', quantity: 120, cost_per_unit: 650, reorder_threshold: 50, supplier_id: 2 },
      { id: 2, fabric_type: 'hosiery', color: 'White', unit: 'kg', quantity: 35, cost_per_unit: 620, reorder_threshold: 60, supplier_id: 2 },
      { id: 3, fabric_type: 'shirting', color: 'Sky Blue', unit: 'meter', quantity: 410, cost_per_unit: 280, reorder_threshold: 150, supplier_id: 1 },
      { id: 4, fabric_type: 'shirting', color: 'White', unit: 'meter', quantity: 90, cost_per_unit: 270, reorder_threshold: 150, supplier_id: 1 },
      { id: 5, fabric_type: 'suiting', color: 'Charcoal Grey', unit: 'meter', quantity: 260, cost_per_unit: 950, reorder_threshold: 100, supplier_id: 3 },
      { id: 6, fabric_type: 'suiting', color: 'Black', unit: 'meter', quantity: 180, cost_per_unit: 980, reorder_threshold: 100, supplier_id: 3 },
    ]);
    console.log('Sample suppliers (3) and fabrics (6) loaded.');
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    await sequelize.close();
  }
})();
