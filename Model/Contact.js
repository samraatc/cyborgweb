const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  service: { type: String, required: true },
  status: { type: String, default: 'pending' }  // ⬅️ NEW FIELD
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
