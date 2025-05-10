const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment ,getPaymentReceipt } = require('../controllers/paymentController');
const protect = require('../middleware/authMiddleware');

router.post('/create-order',protect, createOrder);
router.post('/verify-payment',protect, verifyPayment);

router.get('/receipt' , getPaymentReceipt);
module.exports = router;