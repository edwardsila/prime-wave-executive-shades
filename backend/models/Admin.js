const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    // bcrypt.hash already generates salt internally
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function(passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
