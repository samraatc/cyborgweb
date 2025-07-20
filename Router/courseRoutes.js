const express = require('express');
const router = express.Router();
const Course = require('../Model/course');

// POST a new course
router.post('/', async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// PATCH edit a course (partial update)
router.patch('/:id', async (req, res) => {
  try {
    const editedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!editedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course edited successfully', course: editedCourse });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a course
router.delete('/:id', async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully', course: deletedCourse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
