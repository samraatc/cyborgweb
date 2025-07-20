const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  image: { type: String, required: true }, // store base64 data URL
  title: { type: String, required: true },
  subtext: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
