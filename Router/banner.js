const express = require('express');
const router = express.Router();
const Banner = require('../Model/Banner');


// GET /api/banners — list all banners
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/banners — create banner (expects base64 image)
router.post('/', async (req, res) => {
  try {
    const { image, title, subtext } = req.body;
    if (!image || !title || !subtext) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newBanner = new Banner({ image, title, subtext });
    const saved = await newBanner.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/banners/:id — update banner
router.put('/:id', async (req, res) => {
  try {
    const { image, title, subtext } = req.body;
    const updated = await Banner.findByIdAndUpdate(
      req.params.id,
      { image, title, subtext },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Banner not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/banners/:id — delete banner
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Banner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Banner not found' });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
