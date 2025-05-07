const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['created', 'success', 'failed'],
    default: 'created'
  },
  razorpayPaymentId: String,
  razorpaySignature: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);