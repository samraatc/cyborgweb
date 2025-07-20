const express = require('express');
const router = express.Router();
const HireRequest = require('../Model/HireRequest');

// Create a hire request
router.post('/', async (req, res) => {
  try {
    const hire = new HireRequest(req.body);
    await hire.save();
    res.status(201).json(hire);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all hire requests
router.get('/', async (req, res) => {
  try {
    const hires = await HireRequest.find();
    res.json(hires);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single hire request by ID
router.get('/:id', async (req, res) => {
  try {
    const hire = await HireRequest.findById(req.params.id);
    if (!hire) return res.status(404).json({ error: 'Not found' });
    res.json(hire);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a hire request
router.put('/:id', async (req, res) => {
  try {
    const updatedHire = await HireRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedHire) return res.status(404).json({ error: 'Not found' });
    res.json(updatedHire);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a hire request
router.delete('/:id', async (req, res) => {
  try {
    const deletedHire = await HireRequest.findByIdAndDelete(req.params.id);
    if (!deletedHire) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// In hireRequestsRoute.js
router.get('/', async (req, res) => {
  const requests = await HireRequest.find()
    .sort({ createdAt: -1 })
    .populate('influencerId'); // <- populating full influencer object

  res.json(requests);
});





module.exports = router;
