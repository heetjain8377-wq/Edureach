// ═══════════════════════════════════════
// routes/teachers.js
// Handles all teacher related API calls
// ═══════════════════════════════════════

const express = require('express');
const router  = express.Router();
const Teacher = require('../models/Teacher');
const auth    = require('../middleware/auth');

// ── PUBLIC ────────────────────────────
// GET /api/teachers
router.get('/', async (req, res) => {
  try {
    var teachers = await Teacher.find({ active: true }).sort({ order: 1 });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── ADMIN ─────────────────────────────
// POST /api/teachers — add teacher
router.post('/', auth, async (req, res) => {
  try {
    var teacher = new Teacher(req.body);
    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/teachers/:id — update teacher
router.put('/:id', auth, async (req, res) => {
  try {
    var updated = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Teacher not found.' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/teachers/:id — delete teacher
router.delete('/:id', auth, async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: '🗑 Teacher deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
