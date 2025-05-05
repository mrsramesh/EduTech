const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
    students: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Student',
      default: [],
    },
    lectures: {
      type: [Object], // optional structure can be refined later
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', courseSchema);