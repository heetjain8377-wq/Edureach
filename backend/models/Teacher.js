// ═══════════════════════════════════════
// models/Teacher.js
// Blueprint for a teacher profile
// ═══════════════════════════════════════

const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    emoji:         { type: String, default: '👨‍🏫' },
    name:          { type: String, required: true, trim: true },
    subject:       { type: String, required: true, trim: true },
    qualification: { type: String, required: true, trim: true },
    experience:    { type: String, required: true, trim: true },
    quote:         { type: String, required: true, trim: true },
    order:         { type: Number, default: 0 },
    active:        { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', teacherSchema);
