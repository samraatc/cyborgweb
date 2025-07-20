const express = require('express');
const router = express.Router();
const Contact = require('../Model/Contact');

// POST /api/contact → save new contact submission
router.post('/', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Optional: GET all submissions
router.get('/', async (req, res) => {
  try {
    const submissions = await Contact.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// PATCH update a contact (partial update)
router.patch('/:id', async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact updated successfully', contact: updatedContact });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a contact
router.delete('/:id', async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully', contact: deletedContact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
