const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  otp: { 
    type: String, 
    required: true 
  },
  expiresAt: { 
    type: Date, 
    required: true 
  },
  resetToken: String,
  resetTokenExpires: Date,
}, { timestamps: true });

// Create TTL index for automatic expiry cleanup
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', OTPSchema);