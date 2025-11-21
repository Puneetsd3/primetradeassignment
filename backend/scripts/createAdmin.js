// run: node scripts/createAdmin.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User } = require('../src/models');

(async () => {
  try {
    await sequelize.authenticate();
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const existing = await User.findOne({ where: { email }});
    if (existing) {
      console.log('Admin already exists:', email);
      return process.exit(0);
    }
    const password = process.env.ADMIN_PASS || 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await User.create({ name: 'Admin', email, passwordHash, role: 'admin' });
    console.log('Admin created:', admin.email, 'password:', password);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
