const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  try {
    const { title, description, createdBy } = req.body;

    if (!title || !description || !createdBy) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const course = new Course({ title, description, createdBy });
    await course.save();

    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
