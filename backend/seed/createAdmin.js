require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const createAdmin = async () => {
  await connectDB();

  const name = 'Esraa Admin';
  const email = 'esraa@admin.com';
  const password = 'admin1234'; // plain text, let the model hash it
  const isAdmin = true;

  // Check if admin already exists
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists.');
    process.exit();
  }

  const admin = new User({
    name,
    email,
    password, // plain text
    isAdmin,
  });

  await admin.save();
  console.log('Admin user created!');
  process.exit();
};

createAdmin(); 