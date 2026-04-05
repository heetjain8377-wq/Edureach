// ═══════════════════════════════════════
// script.js — EduReach Main Website
// Pure Vanilla JS — No frameworks!
// ═══════════════════════════════════════

// API base URL
// If opened via server (localhost:5000) → '/api'
// If opened directly as a file → full URL
var API = (window.location.port === '5000' || window.location.protocol === 'https:')
  ? '/api'
  : 'http://localhost:5000/api';


// ── 1. NAVBAR ───────────────────────────
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

window.addEventListener('scroll', function () {
  var navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


// ── 2. SCROLL REVEAL ────────────────────
var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(function (el) {
  observer.observe(el);
});


// ── 3. LOAD COURSES FROM API ─────────────
async function loadCourses() {
  try {
    var response = await fetch(API + '/courses');
    var courses  = await response.json();
    var grid     = document.getElementById('coursesGrid');

    if (!courses.length) {
      grid.innerHTML = '<p class="loading-msg">No courses found.</p>';
      return;
    }

    var html = '';
    courses.forEach(function (course) {
      html += '<div class="course-card reveal">';
      html += '  <div class="course-icon">' + course.icon + '</div>';
      if (course.tag) {
        html += '  <span class="course-tag">' + course.tag + '</span>';
      }
      html += '  <h3>' + course.title + '</h3>';
      html += '  <p>' + course.description + '</p>';
      html += '  <div class="course-footer">';
      html += '    <span class="course-fee">₹' + course.fee + '<small>/month</small></span>';
      html += '    <a href="#enquiry" class="btn-enq">Enquire →</a>';
      html += '  </div>';
      html += '</div>';
    });

    grid.innerHTML = html;

    // Apply scroll reveal to newly added cards
    grid.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });

  } catch (error) {
    // If API fails just show a message
    document.getElementById('coursesGrid').innerHTML =
      '<p class="loading-msg">⚠️ Could not load courses. Is server running?</p>';
  }
}


// ── 4. LOAD TEACHERS FROM API ────────────
async function loadTeachers() {
  try {
    var response = await fetch(API + '/teachers');
    var teachers = await response.json();
    var grid     = document.getElementById('teachersGrid');

    if (!teachers.length) {
      grid.innerHTML = '<p class="loading-msg">No teachers found.</p>';
      return;
    }

    var html = '';
    teachers.forEach(function (teacher) {
      html += '<div class="teacher-card reveal">';
      html += '  <div class="teacher-avatar">' + teacher.emoji + '</div>';
      html += '  <div class="teacher-info">';
      html += '    <h3>' + teacher.name + '</h3>';
      html += '    <span class="teacher-subject">' + teacher.subject + '</span>';
      html += '    <span class="teacher-exp">🎓 ' + teacher.qualification + ' · ' + teacher.experience + '</span>';
      html += '    <p class="teacher-quote">"' + teacher.quote + '"</p>';
      html += '  </div>';
      html += '</div>';
    });

    grid.innerHTML = html;

    grid.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });

  } catch (error) {
    document.getElementById('teachersGrid').innerHTML =
      '<p class="loading-msg">⚠️ Could not load teachers. Is server running?</p>';
  }
}


// ── 5. SUBMIT ENQUIRY FORM ───────────────
async function submitEnquiry() {
  var name    = document.getElementById('enqName').value.trim();
  var phone   = document.getElementById('enqPhone').value.trim();
  var email   = document.getElementById('enqEmail').value.trim();
  var cls     = document.getElementById('enqClass').value;
  var course  = document.getElementById('enqCourse').value;
  var message = document.getElementById('enqMsg').value.trim();

  // Validate
  if (!name || !phone) {
    showMessage('error', '⚠️ Please enter your name and phone number!');
    return;
  }

  // Disable button
  var btn = document.getElementById('submitBtn');
  btn.disabled    = true;
  btn.textContent = '⏳ Sending...';

  try {
    // Send POST request to backend
    var response = await fetch(API + '/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:         name,
        phone:        phone,
        email:        email,
        studentClass: cls,
        course:       course,
        message:      message
      })
    });

    var data = await response.json();

    if (response.ok) {
      showMessage('success', '🎉 ' + data.message);
      // Clear form
      document.getElementById('enqName').value   = '';
      document.getElementById('enqPhone').value  = '';
      document.getElementById('enqEmail').value  = '';
      document.getElementById('enqClass').value  = '';
      document.getElementById('enqCourse').value = '';
      document.getElementById('enqMsg').value    = '';
    } else {
      showMessage('error', '❌ ' + data.message);
    }

  } catch (error) {
    showMessage('error', '❌ Server error. Please call us directly!');
  }

  // Re-enable button
  btn.disabled    = false;
  btn.textContent = '📩 Send Enquiry';
}


// ── 6. HELPER — Show form message ────────
function showMessage(type, text) {
  var el       = document.getElementById('formMsg');
  el.className = 'form-msg ' + type;
  el.textContent = text;
  el.style.display = 'block';
  setTimeout(function () {
    el.style.display = 'none';
  }, 5000);
}


// ── 7. RUN ON PAGE LOAD ──────────────────
window.addEventListener('load', function () {
  loadCourses();
  loadTeachers();
});
