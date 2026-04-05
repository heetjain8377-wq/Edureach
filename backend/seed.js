// ═══════════════════════════════════════
// seed.js — Populate default data
// Run once with: node seed.js
// ═══════════════════════════════════════

require('dotenv').config();
const mongoose = require('mongoose');
const Course   = require('./models/Course');
const Teacher  = require('./models/Teacher');

async function seed() {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Course.deleteMany();
  await Teacher.deleteMany();
  console.log('🗑  Cleared old data');

  // ── Add Courses ───────────────────────
  await Course.insertMany([
    {
      icon: '🔢', title: 'Foundation (Class 6–8)',
      description: 'Build a strong foundation in Maths and Science for junior students. Fun and interactive classes.',
      fee: 1500, duration: '1 Year', tag: '', order: 1
    },
    {
      icon: '📚', title: 'Class 9 & 10',
      description: 'Complete board preparation with focus on Science and Maths. Regular tests and doubt sessions.',
      fee: 2000, duration: '1 Year', tag: 'Popular', order: 2
    },
    {
      icon: '🎯', title: 'Class 11 & 12',
      description: 'PCM and PCB streams with board + competitive exam preparation by experienced faculty.',
      fee: 2500, duration: '2 Years', tag: 'New Batch', order: 3
    },
    {
      icon: '⚗️', title: 'JEE Preparation',
      description: '2-year and 1-year programs for IIT JEE Mains & Advanced. Past selections from our institute.',
      fee: 4000, duration: '2 Years', tag: 'Flagship', order: 4
    },
    {
      icon: '🧬', title: 'NEET Preparation',
      description: 'Biology, Physics & Chemistry for NEET aspirants. Topic-wise tests and full syllabus coverage.',
      fee: 3500, duration: '2 Years', tag: '', order: 5
    },
    {
      icon: '📝', title: 'Crash Course',
      description: 'Intensive short-term batch for board exam revision. Available before every major exam.',
      fee: 1200, duration: '3 Months', tag: 'Weekend', order: 6
    }
  ]);
  console.log('✅ Courses added');

  // ── Add Teachers ──────────────────────
  await Teacher.insertMany([
    {
      emoji: '👨‍🏫', name: 'Rajesh Kumar',
      subject: 'Mathematics & Physics',
      qualification: 'IIT Graduate',
      experience: '12 Years Exp.',
      quote: 'Every student can excel in Maths — they just need the right approach.',
      order: 1
    },
    {
      emoji: '👩‍🏫', name: 'Priya Sharma',
      subject: 'Biology & Chemistry',
      qualification: 'MBBS',
      experience: '8 Years Exp.',
      quote: 'Understanding concepts is more important than memorizing. I make Biology easy.',
      order: 2
    },
    {
      emoji: '👨‍💼', name: 'Amit Verma',
      subject: 'Chemistry & Science',
      qualification: 'M.Sc Chemistry',
      experience: '10 Years Exp.',
      quote: 'Chemistry becomes fun when you connect it to real life. That is my teaching style.',
      order: 3
    }
  ]);
  console.log('✅ Teachers added');

  console.log('\n🎉 Database seeded! Now run: npm run dev');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
