// ═══════════════════════════════════════
// middleware/auth.js
// Simple password check for admin routes
// ═══════════════════════════════════════

// Middleware = a function that runs BEFORE our route handler
// It checks if the request is allowed to continue

module.exports = function (req, res, next) {
  // Get password from request header
  // Frontend sends it like: headers: { 'admin-password': 'abc123' }
  var password = req.headers['admin-password'];

  // Check if password matches our .env password
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: '❌ Unauthorized. Wrong password.' });
  }

  // Password is correct — allow the request to continue
  next();
};
