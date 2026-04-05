// ═══════════════════════════════════════
// models/Enquiry.js
// This defines what an enquiry looks like in database
// ═══════════════════════════════════════

const mongoose = require('mongoose');

// Schema = blueprint/template for data
const enquirySchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    phone:        { type: String, required: true, trim: true },
    email:        { type: String, trim: true, default: '' },
    studentClass: { type: String, default: '' },  // Class 9, Class 10 etc.
    course:       { type: String, default: '' },  // JEE, NEET etc.
    message:      { type: String, default: '' },

    // Status helps admin track each lead
    // new = just submitted, contacted = called, joined = admitted, closed = not interested
    status: {
      type: String,
      enum: ['new', 'contacted', 'joined', 'closed'],
      default: 'new'
    }
  },
  {
    timestamps: true // automatically adds createdAt and updatedAt fields
  }
);

// Export the model so routes can use it
module.exports = mongoose.model('Enquiry', enquirySchema);
