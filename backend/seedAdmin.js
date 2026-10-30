// Run once:  node seedAdmin.js   -> creates the first admin account if none exists
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('./models');

(async () => {
  try {
    await sequelize.sync();
    if (await User.findOne({ where: { role: 'admin' } })) {
      console.log('An admin already exists. Nothing to do.');
    } else {
      await User.create({
        name: 'Admin User',
        email: 'admin@uniform.com',
        password: await bcrypt.hash('Admin@123', 10),
        role: 'admin',
      });
      console.log('Admin created: admin@uniform.com / Admin@123  (change this password later)');
    }
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await sequelize.close();
  }
})();
