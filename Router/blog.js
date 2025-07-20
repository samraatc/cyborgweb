const express = require('express');
const Blog = require('../Model/Blog');
const router = express.Router();

// GET all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new blog
router.post('/', async (req, res) => {
  try {
    const { heading, subtext, content, type, image } = req.body;
    if (!heading || !subtext || !content || !image) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const newBlog = new Blog({ heading, subtext, content, type, image });
    const saved = await newBlog.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update a blog
router.put('/:id', async (req, res) => {
  try {
    const { heading, subtext, content, type, image } = req.body;
    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      { heading, subtext, content, type, image },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Blog not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a blog
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Blog not found' });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
