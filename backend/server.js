// ═══════════════════════════════════════
// server.js — Main Entry Point
// This is the heart of our backend
// ═══════════════════════════════════════

// Step 1 — Import all required packages
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');
require('dotenv').config(); // loads our .env file

// Step 2 — Create the Express app
const app = express();

// Step 3 — Middlewares
// These lines prepare our app to handle requests properly
app.use(cors());                              // allows frontend to talk to backend
app.use(express.json());                      // allows reading JSON data from requests
app.use(express.urlencoded({ extended: true })); // allows reading form data

// Step 4 — Serve frontend static files
// When someone visits our website, Express will serve the HTML/CSS/JS files
app.use(express.static(path.join(__dirname, '../frontend')));

// Step 5 — Connect all our API routes
app.use('/api/enquiry',  require('./routes/enquiry'));
app.use('/api/courses',  require('./routes/courses'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/auth',     require('./routes/auth'));

// Step 6 — For any other URL, send the main HTML file
// NOTE: express.static above already handles admin.html, style.css etc.
// This catch-all only runs if no static file was found
app.get('/{*path}', (req, res) => {
  // If request is for admin panel, serve admin.html
  if (req.path === '/admin' || req.path === '/admin.html') {
    return res.sendFile(path.join(__dirname, '../frontend/admin.html'));
  }
  // All other URLs → serve main website
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Step 7 — Connect to MongoDB, then start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🔐 Admin panel: http://localhost:${PORT}/admin.html`);
    });
  })
  .catch((error) => {
    console.log('❌ MongoDB connection failed!');
    console.log(error.message);
    process.exit(1);
  });
