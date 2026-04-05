// ═══════════════════════════════════════
// routes/auth.js
// Admin login — just checks password
// ═══════════════════════════════════════

const express = require('express');
const router  = express.Router();

// POST /api/auth/login
// Frontend sends password → we check it → return success or error
router.post('/login', (req, res) => {
  var password = req.body.password;

  if (!password) {
    return res.status(400).json({ message: 'Password is required.' });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: '❌ Wrong password.' });
  }

  // Password correct — send success
  res.json({ message: '✅ Login successful!', success: true });
});

module.exports = router;
