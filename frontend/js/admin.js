// ═══════════════════════════════════════
// admin.js — EduReach Admin Panel
// Pure Vanilla JS — No frameworks!
// ═══════════════════════════════════════

var API = (window.location.port === '5000' || window.location.protocol === 'https:')
  ? '/api'
  : 'http://localhost:5000/api';

// Stores admin password after login
// We send this with every admin API request
var adminPassword = '';

// Stores the ID of item being edited (null = adding new)
var editingCourseId  = null;
var editingTeacherId = null;


// ══════════════════════════════════════
// 1. LOGIN / LOGOUT
// ══════════════════════════════════════

async function doLogin() {
  var password = document.getElementById('loginPassword').value.trim();

  if (!password) return;

  try {
    // Send password to backend to verify
    var response = await fetch(API + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password })
    });

    var data = await response.json();

    if (response.ok) {
      // Save password for future admin requests
      adminPassword = password;

      // Save to sessionStorage so page refresh keeps login
      sessionStorage.setItem('adminPassword', password);

      // Hide login, show admin app
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('adminApp').classList.add('show');

      // Load dashboard data
      loadDashboard();

    } else {
      // Show error message
      document.getElementById('loginError').style.display = 'block';
    }

  } catch (error) {
    document.getElementById('loginError').style.display = 'block';
  }
}

function doLogout() {
  sessionStorage.removeItem('adminPassword');
  location.reload();
}

// Check if already logged in (page refresh)
var savedPassword = sessionStorage.getItem('adminPassword');
if (savedPassword) {
  adminPassword = savedPassword;
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminApp').classList.add('show');
  loadDashboard();
}


// ══════════════════════════════════════
// 2. NAVIGATION — switch between pages
// ══════════════════════════════════════

function showPage(pageName, clickedItem) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(function (page) {
    page.classList.remove('active');
  });

  // Remove active from all nav items
  document.querySelectorAll('.nav-item').forEach(function (item) {
    item.classList.remove('active');
  });

  // Show selected page
  document.getElementById('page-' + pageName).classList.add('active');

  // Mark nav item as active
  if (clickedItem) {
    clickedItem.classList.add('active');
  }

  // Load data for that page
  if (pageName === 'enquiries') loadEnquiries();
  if (pageName === 'courses')   loadCourses();
  if (pageName === 'teachers')  loadTeachers();
}


// ══════════════════════════════════════
// 3. TOAST NOTIFICATION
// ══════════════════════════════════════

function showToast(type, message) {
  var toast = document.getElementById('toast');
  toast.className    = 'toast ' + type;
  toast.textContent  = message;
  toast.style.display = 'block';

  // Hide after 3 seconds
  setTimeout(function () {
    toast.style.display = 'none';
  }, 3000);
}


// ══════════════════════════════════════
// 4. DASHBOARD
// ══════════════════════════════════════

async function loadDashboard() {
  try {
    // Load enquiries and courses at same time
    var enqResponse     = await fetch(API + '/enquiry',  { headers: { 'admin-password': adminPassword } });
    var courseResponse  = await fetch(API + '/courses');

    var enquiries = await enqResponse.json();
    var courses   = await courseResponse.json();

    // Count stats
    var newCount    = enquiries.filter(function(e) { return e.status === 'new'; }).length;
    var joinedCount = enquiries.filter(function(e) { return e.status === 'joined'; }).length;

    // Update stat cards
    document.getElementById('totalEnquiries').textContent = enquiries.length;
    document.getElementById('newEnquiries').textContent   = newCount;
    document.getElementById('joinedCount').textContent    = joinedCount;
    document.getElementById('totalCourses').textContent   = courses.length;

    // Update new enquiry badge in sidebar
    var badge = document.getElementById('newBadge');
    badge.textContent = newCount > 0 ? newCount : '';

    // Show recent 5 enquiries in table
    var recent = enquiries.slice(0, 5);
    var html   = '';
    if (recent.length === 0) {
      html = '<tr><td colspan="5" class="empty-row">No enquiries yet.</td></tr>';
    } else {
      recent.forEach(function (e) {
        html += '<tr>';
        html += '  <td><strong>' + e.name + '</strong></td>';
        html += '  <td>' + e.phone + '</td>';
        html += '  <td>' + (e.course || '—') + '</td>';
        html += '  <td><span class="badge badge-' + e.status + '">' + e.status + '</span></td>';
        html += '  <td>' + new Date(e.createdAt).toLocaleDateString('en-IN') + '</td>';
        html += '</tr>';
      });
    }
    document.getElementById('recentTable').innerHTML = html;

  } catch (error) {
    console.log('Dashboard load error:', error.message);
  }
}


// ══════════════════════════════════════
// 5. ENQUIRIES
// ══════════════════════════════════════

async function loadEnquiries() {
  try {
    var response  = await fetch(API + '/enquiry', { headers: { 'admin-password': adminPassword } });
    var enquiries = await response.json();

    var html = '';
    if (enquiries.length === 0) {
      html = '<tr><td colspan="8" class="empty-row">No enquiries yet. Share the website to get leads!</td></tr>';
    } else {
      enquiries.forEach(function (e) {
        html += '<tr>';
        html += '  <td><strong>' + e.name + '</strong></td>';
        html += '  <td><a href="tel:' + e.phone + '" style="color:var(--blue)">' + e.phone + '</a></td>';
        html += '  <td>' + (e.studentClass || '—') + '</td>';
        html += '  <td>' + (e.course || '—') + '</td>';
        html += '  <td style="max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + (e.message || '—') + '</td>';
        html += '  <td>';
        html += '    <select class="status-select" onchange="updateStatus(\'' + e._id + '\', this.value)">';
        html += '      <option value="new"       ' + (e.status === 'new'       ? 'selected' : '') + '>New</option>';
        html += '      <option value="contacted" ' + (e.status === 'contacted' ? 'selected' : '') + '>Contacted</option>';
        html += '      <option value="joined"    ' + (e.status === 'joined'    ? 'selected' : '') + '>Joined</option>';
        html += '      <option value="closed"    ' + (e.status === 'closed'    ? 'selected' : '') + '>Closed</option>';
        html += '    </select>';
        html += '  </td>';
        html += '  <td>' + new Date(e.createdAt).toLocaleDateString('en-IN') + '</td>';
        html += '  <td>';
        html += '    <div class="action-btns">';
        html += '      <a href="https://wa.me/' + e.phone.replace(/\D/g, '') + '" target="_blank" class="btn-sm btn-wa">💬 WA</a>';
        html += '      <button class="btn-sm btn-delete" onclick="deleteEnquiry(\'' + e._id + '\')">🗑 Delete</button>';
        html += '    </div>';
        html += '  </td>';
        html += '</tr>';
      });
    }

    document.getElementById('enquiriesTable').innerHTML = html;

  } catch (error) {
    showToast('error', '❌ Failed to load enquiries');
  }
}

async function updateStatus(id, status) {
  try {
    await fetch(API + '/enquiry/' + id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'admin-password': adminPassword
      },
      body: JSON.stringify({ status: status })
    });
    showToast('success', '✅ Status updated to "' + status + '"');
    loadDashboard(); // refresh stats
  } catch (error) {
    showToast('error', '❌ Update failed');
  }
}

async function deleteEnquiry(id) {
  if (!confirm('Delete this enquiry?')) return;
  try {
    await fetch(API + '/enquiry/' + id, {
      method: 'DELETE',
      headers: { 'admin-password': adminPassword }
    });
    showToast('success', '🗑 Enquiry deleted');
    loadEnquiries();
    loadDashboard();
  } catch (error) {
    showToast('error', '❌ Delete failed');
  }
}


// ══════════════════════════════════════
// 6. COURSES
// ══════════════════════════════════════

// Show / hide the course form
function showForm(formId) {
  document.getElementById(formId).style.display = 'block';
  document.getElementById(formId).scrollIntoView({ behavior: 'smooth' });
}

function hideForm(formId) {
  document.getElementById(formId).style.display = 'none';
  // Reset editing ID
  editingCourseId  = null;
  editingTeacherId = null;
}

async function loadCourses() {
  try {
    var response = await fetch(API + '/courses');
    var courses  = await response.json();

    var html = '';
    if (courses.length === 0) {
      html = '<tr><td colspan="6" class="empty-row">No courses yet. Add one!</td></tr>';
    } else {
      courses.forEach(function (c) {
        html += '<tr>';
        html += '  <td style="font-size:1.4rem">' + c.icon + '</td>';
        html += '  <td><strong>' + c.title + '</strong></td>';
        html += '  <td>' + (c.tag ? '<span class="badge badge-new">' + c.tag + '</span>' : '—') + '</td>';
        html += '  <td style="color:var(--blue);font-weight:600">₹' + c.fee + '/mo</td>';
        html += '  <td>' + (c.duration || '—') + '</td>';
        html += '  <td>';
        html += '    <div class="action-btns">';
        // Pass course data as JSON string to edit function
        html += '      <button class="btn-sm btn-edit" onclick=\'editCourse(' + JSON.stringify(c) + ')\'>✏️ Edit</button>';
        html += '      <button class="btn-sm btn-delete" onclick="deleteCourse(\'' + c._id + '\')">🗑 Delete</button>';
        html += '    </div>';
        html += '  </td>';
        html += '</tr>';
      });
    }

    document.getElementById('coursesTable').innerHTML = html;

  } catch (error) {
    showToast('error', '❌ Failed to load courses');
  }
}

// Fill form with existing course data for editing
function editCourse(course) {
  editingCourseId = course._id;
  document.getElementById('courseFormTitle').textContent = 'Edit Course';
  document.getElementById('cIcon').value     = course.icon        || '';
  document.getElementById('cTag').value      = course.tag         || '';
  document.getElementById('cTitle').value    = course.title       || '';
  document.getElementById('cDesc').value     = course.description || '';
  document.getElementById('cFee').value      = course.fee         || '';
  document.getElementById('cDuration').value = course.duration    || '';
  document.getElementById('cOrder').value    = course.order       || '';
  showForm('courseForm');
}

async function saveCourse() {
  var body = {
    icon:        document.getElementById('cIcon').value     || '📚',
    tag:         document.getElementById('cTag').value      || '',
    title:       document.getElementById('cTitle').value.trim(),
    description: document.getElementById('cDesc').value.trim(),
    fee:         parseFloat(document.getElementById('cFee').value),
    duration:    document.getElementById('cDuration').value || '',
    order:       parseInt(document.getElementById('cOrder').value) || 0,
  };

  if (!body.title || !body.description || !body.fee) {
    showToast('error', '⚠️ Title, description and fee are required');
    return;
  }

  // If editing → PUT, if adding new → POST
  var url    = editingCourseId ? API + '/courses/' + editingCourseId : API + '/courses';
  var method = editingCourseId ? 'PUT' : 'POST';

  try {
    var response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'admin-password': adminPassword
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      showToast('success', '✅ Course ' + (editingCourseId ? 'updated' : 'added') + '!');
      hideForm('courseForm');
      loadCourses();
      // Reset form fields
      document.getElementById('cIcon').value = '';
      document.getElementById('cTag').value  = '';
      document.getElementById('cTitle').value = '';
      document.getElementById('cDesc').value  = '';
      document.getElementById('cFee').value   = '';
      document.getElementById('cDuration').value = '';
      document.getElementById('cOrder').value = '';
    } else {
      showToast('error', '❌ Save failed');
    }
  } catch (error) {
    showToast('error', '❌ Server error');
  }
}

async function deleteCourse(id) {
  if (!confirm('Delete this course?')) return;
  try {
    await fetch(API + '/courses/' + id, {
      method: 'DELETE',
      headers: { 'admin-password': adminPassword }
    });
    showToast('success', '🗑 Course deleted');
    loadCourses();
    loadDashboard();
  } catch (error) {
    showToast('error', '❌ Delete failed');
  }
}


// ══════════════════════════════════════
// 7. TEACHERS
// ══════════════════════════════════════

async function loadTeachers() {
  try {
    var response = await fetch(API + '/teachers');
    var teachers = await response.json();

    var html = '';
    if (teachers.length === 0) {
      html = '<tr><td colspan="6" class="empty-row">No teachers yet. Add one!</td></tr>';
    } else {
      teachers.forEach(function (t) {
        html += '<tr>';
        html += '  <td style="font-size:1.5rem">' + t.emoji + '</td>';
        html += '  <td><strong>' + t.name + '</strong></td>';
        html += '  <td style="color:var(--blue)">' + t.subject + '</td>';
        html += '  <td>' + t.qualification + '</td>';
        html += '  <td>' + t.experience + '</td>';
        html += '  <td>';
        html += '    <div class="action-btns">';
        html += '      <button class="btn-sm btn-edit" onclick=\'editTeacher(' + JSON.stringify(t) + ')\'>✏️ Edit</button>';
        html += '      <button class="btn-sm btn-delete" onclick="deleteTeacher(\'' + t._id + '\')">🗑 Delete</button>';
        html += '    </div>';
        html += '  </td>';
        html += '</tr>';
      });
    }

    document.getElementById('teachersTable').innerHTML = html;

  } catch (error) {
    showToast('error', '❌ Failed to load teachers');
  }
}

function editTeacher(teacher) {
  editingTeacherId = teacher._id;
  document.getElementById('teacherFormTitle').textContent = 'Edit Teacher';
  document.getElementById('tEmoji').value         = teacher.emoji         || '';
  document.getElementById('tOrder').value         = teacher.order         || '';
  document.getElementById('tName').value          = teacher.name          || '';
  document.getElementById('tSubject').value       = teacher.subject       || '';
  document.getElementById('tQualification').value = teacher.qualification || '';
  document.getElementById('tExperience').value    = teacher.experience    || '';
  document.getElementById('tQuote').value         = teacher.quote         || '';
  showForm('teacherForm');
}

async function saveTeacher() {
  var body = {
    emoji:         document.getElementById('tEmoji').value         || '👨‍🏫',
    order:         parseInt(document.getElementById('tOrder').value) || 0,
    name:          document.getElementById('tName').value.trim(),
    subject:       document.getElementById('tSubject').value.trim(),
    qualification: document.getElementById('tQualification').value.trim(),
    experience:    document.getElementById('tExperience').value.trim(),
    quote:         document.getElementById('tQuote').value.trim(),
  };

  if (!body.name || !body.subject || !body.qualification || !body.quote) {
    showToast('error', '⚠️ Name, subject, qualification and quote are required');
    return;
  }

  var url    = editingTeacherId ? API + '/teachers/' + editingTeacherId : API + '/teachers';
  var method = editingTeacherId ? 'PUT' : 'POST';

  try {
    var response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'admin-password': adminPassword
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      showToast('success', '✅ Teacher ' + (editingTeacherId ? 'updated' : 'added') + '!');
      hideForm('teacherForm');
      loadTeachers();
    } else {
      showToast('error', '❌ Save failed');
    }
  } catch (error) {
    showToast('error', '❌ Server error');
  }
}

async function deleteTeacher(id) {
  if (!confirm('Delete this teacher?')) return;
  try {
    await fetch(API + '/teachers/' + id, {
      method: 'DELETE',
      headers: { 'admin-password': adminPassword }
    });
    showToast('success', '🗑 Teacher deleted');
    loadTeachers();
  } catch (error) {
    showToast('error', '❌ Delete failed');
  }
}
