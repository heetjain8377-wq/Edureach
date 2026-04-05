// ═══════════════════════════════════════
// models/Course.js
// Blueprint for a coaching course
// ═══════════════════════════════════════

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    icon:        { type: String, default: '📚' },
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    fee:         { type: Number, required: true },   // fee per month
    duration:    { type: String, default: '' },      // e.g. "1 Year"
    tag:         { type: String, default: '' },      // e.g. "Popular", "New Batch"
    order:       { type: Number, default: 0 },       // display order on website
    active:      { type: Boolean, default: true }    // hide/show on website
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
