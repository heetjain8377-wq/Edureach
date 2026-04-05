// ═══════════════════════════════════════
// routes/enquiry.js
// Handles all enquiry related API calls
// ═══════════════════════════════════════

const express  = require('express');
const router   = express.Router();
const Enquiry  = require('../models/Enquiry');
const auth     = require('../middleware/auth');

// ── PUBLIC ROUTE ─────────────────────
// POST /api/enquiry
// Anyone can submit an enquiry from the website
router.post('/', async (req, res) => {
  try {
    var { name, phone, email, studentClass, course, message } = req.body;

    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required.' });
    }

    // Create new enquiry document in MongoDB
    var enquiry = new Enquiry({
      name,
      phone,
      email,
      studentClass,
      course,
      message
    });

    // Save to database
    await enquiry.save();

    res.status(201).json({
      message: '✅ Enquiry submitted! Our team will contact you within 2 hours.'
    });

  } catch (error) {
    console.log('Enquiry error:', error.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ── ADMIN ROUTES (password protected) ─
// GET /api/enquiry — get all enquiries
router.get('/', auth, async (req, res) => {
  try {
    // Find all enquiries, newest first
    var enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PATCH /api/enquiry/:id — update status
router.patch('/:id', auth, async (req, res) => {
  try {
    var updated = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true } // return updated document
    );
    if (!updated) {
      return res.status(404).json({ message: 'Enquiry not found.' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/enquiry/:id — delete enquiry
router.delete('/:id', auth, async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ message: '🗑 Enquiry deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
