const Razorpay = require("razorpay");
const crypto = require("crypto");
const Course = require("../models/Course");
const User = require("../models/User");
const Payment = require("../models/paymentModel");
const mongoose = require("mongoose");

require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create payment order for a specific course
exports.createOrder = async (req, res) => {
  try {
    const { courseId,userId } = req.body;

    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check enrollment using both user and course data
    const [user, courseStudents] = await Promise.all([
      User.findById(userId),
      Course.findById(courseId).select('students')
    ]);

    if (
      user.purchasedCourses.includes(courseId) ||
      courseStudents.students.includes(userId)
    ) {
      return res.status(400).json({ error: "Course already purchased" });
    }

    // Create order
    const amount = Number(course.price) * 100;
    const options = {
      amount: amount, // Convert to paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        courseId,
        userId,
      },
    };

    const order = await razorpay.orders.create(options);

    // Save payment record
    const payment = new Payment({
      orderId: order.id,
      course: courseId,
      user: userId,
      amount: options.amount,
      status: "created",
    });
    await payment.save();

    res.status(200).json({ ...order, key: process.env.RAZORPAY_KEY_ID });

  } catch (error) {
    console.error("Error creating payment order:", error);
    res.status(500).json({ error: "Failed to create payment order" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
    const userId = req.user.id;

    // Add validation
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (expectedSign !== razorpay_signature) {
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: 'failed' }
      );
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Update payment record
    await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        status: 'paid',
        paymentId: razorpay_payment_id,
      }
    );

    // Add transaction to sync user and course data
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update user's purchasedCourses
      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { purchasedCourses: courseId } },
        { new: true, session }
      );

      // Update course's students
      const course = await Course.findByIdAndUpdate(
        courseId,
        { $addToSet: { students: userId } },
        { new: true, session }
      );

      if (!user || !course) {
        await session.abortTransaction();
        return res.status(404).json({ error: "User or Course not found" });
      }

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ success: true });

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }

  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};


// Get user's payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate("course", "title price thumbnail")
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ error: "Failed to fetch payment history" });
  }
};
