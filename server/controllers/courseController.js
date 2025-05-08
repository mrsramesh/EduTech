const Course = require("../models/Course");
const User = require("../models/User")
const multer = require('multer');
const upload = multer();
const express = require('express');// your course model path
const router = express.Router();

const uploadToGCS = require("../utils/gcs");

exports.createCourse = async (req, res) => {
  try {

    const { title, description, category, thumbnail,createdBy,price } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const course = new Course({ 
      title, 
      description, 
      category,
      thumbnail,
      createdBy,
      price
    });
    
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// controllers/courseController.js
exports.getEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({ students: req.user.id })
      .populate('createdBy', 'name email')
      .select('title description category price thumbnail createdBy students');

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getAvailableCourses = async (req, res) => {
  try {
    // Get courses not purchased by user
    const courses = await Course.find({ 
      students: { $nin: [req.user.id] }
    })
    .populate('createdBy', 'name email')
    .select('title description category price createdBy thumbnail');

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('students', 'name email');
    
    // Check if user has purchased the course
    const hasPurchased = req.user.purchasedCourses.includes(course._id);
    if (!hasPurchased) {
      return res.status(403).json({ message: 'Course not purchased' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};






exports.uploadLecture = async (req,res) => {
  try {

    console.log("In upload Lecture");
    const { title, description } = req.body;
    const course = await Course.findById(req.params.id);
    if(course){ console.log("Course :" + course)}
    if (!course) return res.status(404).json({ message: 'Course not found' });

    let videoUrl = '';
    if (req.file) {
      console.log("In req file");
      videoUrl = await uploadToGCS(req.file);
      console.log("Video Url :" + videoUrl);
    }

    course.lectures.push({
      title,
      description,
      videoUrl,
    });

    await course.save();
    console.log("course is saved");
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({success: true, message: 'Lecture added', videoUrl });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload lecture', error: error.message });
  }
  
}


// getCourses controller
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('createdBy', 'name email')
      .select('title description category price createdBy'); 

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('students', 'name email');
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.students.includes(req.user.id)) {
      course.students.push(req.user.id);
      await course.save();
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({ students: req.user.id })
      .populate('createdBy', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.courseCount = async (req, res) => {
  const { email } = req.query;
  console.log('Received email query:', email); // 👈 Use descriptive logs

  try {
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const courses = await Course.find({ createdBy: user._id });

    res.status(200).json({
      email: user.email,
      courseCount: courses.length,
      courses,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
