const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, thumbnail } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const course = new Course({ 
      title, 
      description, 
      category,
      thumbnail,
      createdBy: req.user.id 
    });
    
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('createdBy', 'name email');
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