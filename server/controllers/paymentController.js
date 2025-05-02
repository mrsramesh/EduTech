const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config(); 

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    const options = {
      amount: 49900, 
      currency: 'INR',
      receipt: 'receipt#_eduapp',
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
};

// Verify Payment Signature
// controllers/paymentController.js
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Payment successful - Implement your unlock logic here
    // Typically you would:
    // 1. Save payment details to database
    // 2. Activate user subscription
    // 3. Generate access token if needed

    return res.status(200).json({ 
      success: true, 
      message: "Payment verified",
      unlocked: true // Add this flag
    });
    
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};