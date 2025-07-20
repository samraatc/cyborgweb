const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  heading:  { type: String, required: true },
  subtext:  { type: String, required: true },
  content:  { type: String, required: true },
  type:     { type: String, enum: ['Normal', 'Featured'], default: 'Normal' },
  image:    { type: String, required: true }, // expecting Data URI Base64 string
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
