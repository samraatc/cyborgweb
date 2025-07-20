const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: String, required: true },
  img: { type: String, required: true },
  lessons: { type: String, required: true },
  duration: { type: String, required: true },
  level: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
