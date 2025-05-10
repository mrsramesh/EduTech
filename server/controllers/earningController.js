const Payment = require('../models/paymentModel');
const Course = require('../models/Course');
const mongoose = require('mongoose');
// @desc    Get teacher earnings
// @route   GET /api/courses/earnings/teacher
// @access  Private (Teacher only)
const getTeacherEarnings = async (req, res) => {
    try {
      if (req.user.role !== 'teacher') {
        return res.status(403).json({ 
          success: false,
          message: 'Only teachers can access earnings data' 
        });
      }
  
      const earnings = await Payment.aggregate([
        {
          $lookup: {
            from: "courses",
            localField: "course",
            foreignField: "_id",
            as: "courseDetails"
          }
        },
        { $unwind: "$courseDetails" },
        {
          $match: {
            "courseDetails.createdBy": new mongoose.Types.ObjectId(req.user._id),
            status: "success"
          }
        },
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: "$amount" },
            totalStudents: { $addToSet: "$user" },
            totalCourses: { $addToSet: "$course" }
          }
        },
        {
          $project: {
            _id: 0,
            totalEarnings: 1,
            totalStudents: { $size: "$totalStudents" },
            totalCourses: { $size: "$totalCourses" }
          }
        }
      ]);
  
      res.json({
        success: true,
        data: earnings[0] || {
          totalEarnings: 0,
          totalStudents: 0,
          totalCourses: 0
        }
      });
  
    } catch (error) {
      console.error('Error fetching earnings:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching earnings'
      });
    }
  };

module.exports = {
  getTeacherEarnings
};