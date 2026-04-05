// ═══════════════════════════════════════
// routes/courses.js
// Handles all course related API calls
// ═══════════════════════════════════════

const express = require('express');
const router  = express.Router();
const Course  = require('../models/Course');
const auth    = require('../middleware/auth');

// ── PUBLIC ────────────────────────────
// GET /api/courses — get all active courses
router.get('/', async (req, res) => {
  try {
    var courses = await Course.find({ active: true }).sort({ order: 1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── ADMIN ─────────────────────────────
// POST /api/courses — add new course
router.post('/', auth, async (req, res) => {
  try {
    var course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/courses/:id — update course
router.put('/:id', auth, async (req, res) => {
  try {
    var updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Course not found.' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/courses/:id — delete course
router.delete('/:id', auth, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: '🗑 Course deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
