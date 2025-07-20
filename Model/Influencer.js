const mongoose = require('mongoose');

const influencerSchema = new mongoose.Schema({
  // Registration Fields
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email']
  },
  password: { type: String, required: true, minlength: 6 },
  instagram: { type: String, required: true },
  screenshot: { type: String },
  transactionId: { type: String, required: true },
  influencerType: {
    type: String,
    enum: ['Featured Influencer', 'Normal'],
    default: 'Normal'
  },
  
  // Profile Fields
  influencerName: { type: String, trim: true },
  bio: { type: String, maxlength: 500 },
  influencerImage: { type: String },
  category: {
    type: String,
    enum: ['Food', 'Travel', 'Finance', 'Fitness', 'Fashion', 'Gaming', 'Tech', 'Education', 'Entertainment', 'Other'],
    default: 'Other'
  },
  instaSubs: { type: String },
  revenue: { type: String },
  clients: { type: [String], default: [] },
  awards: { type: [String], default: [] },
  price: { type: Number, default: 0 },                           // Added here
  engagementPercentage: { type: Number, default: 0 },            // Added here
  averageViews: { type: Number, default: 0 },                    // Added here
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  influencerId: { type: String }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate influencerId when status changes to approved
influencerSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'approved' && !this.influencerId) {
    this.influencerId = 'INF' + Math.floor(10000000 + Math.random() * 90000000);
  }
  next();
});

// Add text index for search
influencerSchema.index({
  name: 'text',
  email: 'text',
  instagram: 'text',
  bio: 'text'
});

const Influencer = mongoose.model('Influencer', influencerSchema);

module.exports = Influencer;