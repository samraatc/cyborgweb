const express = require('express');
const router = express.Router();
const Influencer = require('../Model/Influencer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// JWT Secret
const JWT_SECRET = 'your-secret-key-here';

// Middleware to verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const influencer = await Influencer.findOne({ _id: decoded._id });

    if (!influencer) {
      return res.status(401).json({ error: 'Influencer not found' });
    }

    req.influencer = influencer;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// GET all influencers with filtering
router.get('/', async (req, res) => {
  try {
    const { status, influencerType, search } = req.query;
    const query = {};
    
    if (status && status !== 'all') query.status = status;
    if (influencerType) query.influencerType = influencerType;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { instagram: { $regex: search, $options: 'i' } }
      ];
    }

    const influencers = await Influencer.find(query).select('-password');
    res.json(influencers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new influencer (plain text password)
router.post('/', upload.single('screenshot'), async (req, res) => {
  try {
    const { 
      name, phone, email, instagram, transactionId, 
      influencerType, password, confirmPassword 
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const influencerData = {
      name,
      phone,
      email,
      instagram,
      transactionId,
      influencerType: influencerType || 'Normal',
      password, // Storing plain text password
      status: 'pending'
    };

    if (req.file) {
      influencerData.screenshot = `/uploads/${req.file.filename}`;
    }

    const influencer = new Influencer(influencerData);
    await influencer.save();
    
    res.status(201).json(influencer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login route (plain text comparison)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const influencer = await Influencer.findOne({ email });
    if (!influencer) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Plain text comparison
    if (password !== influencer.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (influencer.status !== 'approved') {
      return res.status(403).json({ error: 'Your account is not yet approved' });
    }

    const token = jwt.sign({ _id: influencer._id.toString() }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ 
      token,
      influencer: {
        _id: influencer._id,
        name: influencer.name,
        email: influencer.email,
        status: influencer.status,
        influencerName: influencer.influencerName,
        influencerImage: influencer.influencerImage
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get profile (protected)
router.get('/profile', authenticate, async (req, res) => {
  try {
    res.json(req.influencer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update profile route with proper file handling and cache busting
router.patch('/profile', authenticate, upload.single('influencerImage'), async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      'influencerName',
      'bio',
      'category',
      'instaSubs',
      'revenue',
      'clients',
      'awards',
      'price',
      'engagementPercentage',
      'averageViews'
    ];
    
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates!' });
    }

    // Handle file upload with cache busting timestamp
    if (req.file) {
      req.influencer.influencerImage = `/uploads/${req.file.filename}?t=${Date.now()}`;
    }

    // Handle other updates
    updates.forEach(update => {
      if (update === 'clients' || update === 'awards') {
        req.influencer[update] = req.body[update].split(',').map(item => item.trim());
      } else {
        req.influencer[update] = req.body[update];
      }
    });

    await req.influencer.save();
    
    // Return the updated influencer data with fresh image URL
    const influencerData = req.influencer.toObject();
    delete influencerData.password;
    
    // Add cache busting to existing image if not updating
    if (!req.file && influencerData.influencerImage) {
      influencerData.influencerImage = `${influencerData.influencerImage}?t=${Date.now()}`;
    }
    
    res.json(influencerData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update influencer status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const influencer = await Influencer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!influencer) {
      return res.status(404).json({ error: 'Influencer not found' });
    }

    res.json(influencer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE influencer
router.delete('/:id', async (req, res) => {
  try {
    const influencer = await Influencer.findByIdAndDelete(req.params.id);
    if (!influencer) {
      return res.status(404).json({ error: 'Influencer not found' });
    }
    
    if (influencer.screenshot) {
      const filePath = path.join(__dirname, '..', influencer.screenshot);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.json({ message: 'Influencer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;