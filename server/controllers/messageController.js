const Query = require('../models/Message');

exports.queryMessage = async (req, res) => {
  try {
    const { courseId, message, studentId, teacherId } = req.body;
    console.log("Request body received:", req.body);
    const newQuery = new Query({
      course: courseId,
      message,
      student: studentId,
      teacher: teacherId,
      status: 'pending'
    });

    await newQuery.save();
    res.status(201).json(newQuery);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getQuery = async (req, res) => {
  try {
    console.log("[inside query . get]");
    
    const queries = await Query.find()
      .populate('course student teacher');

    const filteredData = queries.map((item) => ({
      studentId: item.student._id,
      studentName: `${item.student.fname} ${item.student.lname}`,
      message: item.message,
      courseId: item.course._id,
      courseTitle: item.course.title,
      studentEmail:item.student.email
    }));

    res.status(200).json(filteredData);
  } catch (error) {
    console.error("GET error:", error);
    res.status(500).json([{ error: 'Server error' }]);
  }
};

// for all response . 
// const queries =  await Query.find().populate('course student teacher');
// res.status(200).json(queries);