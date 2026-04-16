/**
 * Admin Seeding Script
 * Run this to create a default admin user in the database
 * Usage: node backend/seed.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const Admin = require('./models/Admin');

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Delete existing admin to refresh with new hashing
    await Admin.deleteOne({ username: 'admin' });
    console.log('Cleared existing admin user');

    // Create admin - the pre-save hook will hash the password
    const newAdmin = new Admin({
      username: 'admin',
      email: 'admin@primewaveshades.com',
      password: 'admin123', // Plain password - model will hash it via pre-save hook
    });

    await newAdmin.save();
    console.log('✅ Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\nYou can now login at: /admin-login');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

// Run the seed
seedAdmin();
