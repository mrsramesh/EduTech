// Example Node.js backend API
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'YOUR_KEY_ID',
  key_secret: 'YOUR_KEY_SECRET',
});

exports.rozerpay = async (req, res) => {
  const options = {
    amount: 50000, // amount in paise (₹500 = 50000 paise)
    currency: "INR",
    receipt: "order_rcptid_11",
  };
  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).send(err);
  }
};

