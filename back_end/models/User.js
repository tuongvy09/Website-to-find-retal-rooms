const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  profile: {
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    }
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;