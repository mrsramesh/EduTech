const Course = require("../models/Course");
const multer = require('multer');
const upload = multer();
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


exports.getEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('purchasedCourses');
    res.json(user.purchasedCourses);
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
    const { title, description } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    let videoUrl = '';
    if (req.file) {
      videoUrl = await uploadToGCS(req.file);
    }

    course.lectures.push({
      title,
      description,
      videoUrl,
    });

    await course.save();
    res.status(200).json({ message: 'Lecture added', videoUrl });

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

