const Course = require("../models/Course");

exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const course = new Course({ title, description, createdBy: req.user._id});
    await course.save();

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// routes/courses.js
router.post('/:id/lectures', upload.single('video'), async (req, res) => {
  const { title, description } = req.body;
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  course.lectures.push({
    title,
    description,
    videoUrl: req.file?.path, // or cloud URL if using Cloudinary/S3
  });

  await course.save();
  res.status(200).json({ message: 'Lecture added' });
});

