const mongoose = require('mongoose');

const HireRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  influencerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Influencer',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('HireRequest', HireRequestSchema);
