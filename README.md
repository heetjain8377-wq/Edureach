# 🎓 EduReach Coaching Classes — Full Stack Website
> Node.js + Express + MongoDB | Admin Panel | Deploy Ready

---

## 📁 Project Structure

```
edureach/
├── backend/
│   ├── models/
│   │   ├── Enquiry.js       ← student enquiry schema
│   │   ├── Course.js        ← course schema
│   │   └── Teacher.js       ← teacher schema
│   ├── routes/
│   │   ├── auth.js          ← admin login
│   │   ├── enquiry.js       ← enquiry CRUD
│   │   ├── courses.js       ← courses CRUD
│   │   └── teachers.js      ← teachers CRUD
│   ├── middleware/
│   │   └── auth.js          ← password check
│   ├── server.js            ← main server file
│   ├── seed.js              ← adds default data
│   ├── .env.example         ← env variables template
│   └── package.json
└── frontend/
    ├── index.html           ← main website
    ├── admin.html           ← admin panel
    ├── css/
    │   ├── style.css        ← website styles
    │   └── admin.css        ← admin styles
    └── js/
        ├── script.js        ← website JS
        └── admin.js         ← admin JS
```

---

## 🚀 LOCAL SETUP (Run on your computer)

### Step 1 — Install MongoDB
Download from: https://www.mongodb.com/try/download/community
Start MongoDB: run `mongod` in terminal

### Step 2 — Install dependencies
```bash
cd edureach/backend
npm install
```

### Step 3 — Create .env file
```bash
# Copy the example file
cp .env.example .env
```
Your .env file should have:
```
MONGO_URI=mongodb://localhost:27017/edureach
PORT=5000
ADMIN_PASSWORD=edureach@admin123
```

### Step 4 — Add default data
```bash
node seed.js
```
This adds 6 courses and 3 teachers to your database.

### Step 5 — Start the server
```bash
npm run dev
```

### Step 6 — Open in browser
- Website:     http://localhost:5000
- Admin Panel: http://localhost:5000/admin.html
- Password:    edureach@admin123

---

## 🌍 DEPLOY ON RENDER.COM (Free)

### Step 1 — Create MongoDB Atlas (Free Cloud Database)
1. Go to https://cloud.mongodb.com
2. Create free account
3. Create free cluster (M0 — Free tier)
4. Click "Connect" → "Drivers"
5. Copy connection string — looks like:
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/edureach
6. Save this — you need it for Step 4

### Step 2 — Push code to GitHub
```bash
# In your edureach folder
git init
git add .
git commit -m "Initial commit"
# Create repo on github.com then:
git remote add origin https://github.com/yourusername/edureach.git
git push -u origin main
```

### Step 3 — Create Render.com account
1. Go to https://render.com
2. Sign up with GitHub

### Step 4 — Deploy on Render
1. Click "New +" → "Web Service"
2. Connect your GitHub repo
3. Fill in settings:
   - Name: edureach-coaching
   - Root Directory: backend
   - Build Command: npm install
   - Start Command: npm start
4. Click "Advanced" → "Add Environment Variables"
   Add these one by one:
   ```
   MONGO_URI    = (paste your MongoDB Atlas connection string)
   PORT         = 5000
   ADMIN_PASSWORD = edureach@admin123
   ```
5. Click "Create Web Service"
6. Wait 2-3 minutes — Render will build and deploy!
7. You get a live URL like: https://edureach-coaching.onrender.com

### Step 5 — Seed database on production
After deployment, in Render dashboard:
- Go to your service → "Shell" tab
- Run: node seed.js

---

## 🔐 Admin Panel
- URL: https://your-render-url.onrender.com/admin.html
- Password: edureach@admin123 (change in .env!)

## 📡 API Endpoints

### Public
- GET  /api/courses    → get all courses
- GET  /api/teachers   → get all teachers
- POST /api/enquiry    → submit enquiry

### Admin (send 'admin-password' header)
- POST   /api/auth/login      → verify password
- GET    /api/enquiry         → all enquiries
- PATCH  /api/enquiry/:id     → update status
- DELETE /api/enquiry/:id     → delete
- POST   /api/courses         → add course
- PUT    /api/courses/:id     → update course
- DELETE /api/courses/:id     → delete course
- POST   /api/teachers        → add teacher
- PUT    /api/teachers/:id    → update teacher
- DELETE /api/teachers/:id    → delete teacher

---

## 💰 Client Pricing Suggestion
- Frontend only website: ₹5,000 – ₹8,000
- Full stack with admin panel: ₹15,000 – ₹25,000
- Monthly maintenance: ₹1,000 – ₹2,000/month
