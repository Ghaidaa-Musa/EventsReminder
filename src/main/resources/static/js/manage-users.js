document.addEventListener('DOMContentLoaded', () => {
    loadUsersFromAPI();
    loadEventsWithStudents();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', searchEvents);
    }
});

// جلب المستخدمين من قاعدة البيانات عبر API
let allUsers = [];

function loadUsersFromAPI() {
    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            allUsers = users;
            // تحديث الإحصائيات من localStorage
            updateStatsFromLocalStorage();
            // إعادة تحميل الأحداث عشان تظهر التخصصات
            loadEventsWithStudents();
        })
        .catch(error => {
            console.error('Error loading users:', error);
            updateStatsFromLocalStorage();
        });
}

// دالة الإحصائيات من localStorage
function updateStatsFromLocalStorage() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const totalUsersEl = document.getElementById('totalUsers');
    const totalStudentsEl = document.getElementById('totalStudents');
    const totalAdminsEl = document.getElementById('totalAdmins');
    const newUsersEl = document.getElementById('newUsers');

    if (totalUsersEl) {
        totalUsersEl.innerText = users.length;
        totalStudentsEl.innerText = users.filter(u => u.role === 'student').length;
        totalAdminsEl.innerText = users.filter(u => u.role === 'admin').length;

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const newUsers = users.filter(u => u.createdAt && new Date(u.createdAt) > oneWeekAgo).length;
        newUsersEl.innerText = newUsers;
    }
}

function loadEventsWithStudents() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const container = document.getElementById('eventsContainer');

    if (!container) return;
    container.innerHTML = '';

    const eventsWithStudents = events.filter(e => e.registeredStudents && e.registeredStudents.length > 0);

    if (eventsWithStudents.length === 0) {
        container.innerHTML = '<div class="empty-state">📭 No students registered in any event yet.</div>';
        return;
    }

    eventsWithStudents.forEach(event => {
        const students = event.registeredStudents || [];

        let studentsHtml = '';
        students.forEach(student => {
            // البحث عن المستخدم في allUsers (من API)
            const fullUser = allUsers.find(u => u.email === student.email);

            const registeredCount = events.filter(e =>
                e.registeredStudents?.some(s => s.email === student.email)
            ).length;

            const attendedCount = events.filter(e =>
                e.registeredStudents?.some(s => s.email === student.email) && e.attended === true
            ).length;

            // التخصص من API إذا موجود، وإلا من localStorage
            const department = fullUser?.department || student.department || 'Not specified';
            const registrationDate = student.registeredAt ? new Date(student.registeredAt).toLocaleDateString() :
                (fullUser?.createdAt ? new Date(fullUser.createdAt).toLocaleDateString() : 'N/A');

            studentsHtml += `
                <div class="student-detail-card">
                    <div class="student-header">
                        <i class="fa-solid fa-user-graduate"></i>
                        <div class="student-header-info">
                            <div class="student-fullname">${student.name}</div>
                            <div class="student-email">${student.email}</div>
                        </div>
                        <span class="role-badge ${fullUser?.role === 'admin' ? 'admin' : 'student'}">
                            ${fullUser?.role || 'student'}
                        </span>
                    </div>
                    <div class="student-details-row">
                        <div class="student-detail-item">
                            <i class="fa-solid fa-building-columns"></i>
                            <span>${department}</span>
                        </div>
                        <div class="student-detail-item">
                            <i class="fa-solid fa-calendar-plus"></i>
                            <span>Registered: ${registrationDate}</span>
                        </div>
                    </div>
                    <div class="student-stats-row">
                        <div class="student-stat">
                            <div class="stat-number">${registeredCount}</div>
                            <div class="stat-label">Events Registered</div>
                        </div>
                        <div class="student-stat">
                            <div class="stat-number">${attendedCount}</div>
                            <div class="stat-label">Events Attended</div>
                        </div>
                    </div>
                </div>
            `;
        });

        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <div class="event-college">${event.college || 'University Event'}</div>
            <div class="event-title">${event.title}</div>
            <div class="event-meta">
                <span><i class="fa-solid fa-calendar"></i> ${event.date}</span>
                <span><i class="fa-solid fa-clock"></i> ${event.time}</span>
                <span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>
            </div>
            <div class="registered-students-section">
                <h4><i class="fa-solid fa-users"></i> Registered Students (${students.length})</h4>
                <div class="students-list">
                    ${studentsHtml}
                </div>
            </div>
            <div class="event-actions">
                <button class="details-btn" onclick="viewEventDetails(${event.id})"><i class="fa-solid fa-eye"></i> Details</button>
                <button class="edit-btn" onclick="editEvent(${event.id})"><i class="fa-solid fa-edit"></i> Edit</button>
                <button class="delete-btn" onclick="deleteEvent(${event.id})"><i class="fa-solid fa-trash"></i> Delete</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function searchEvents() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const container = document.getElementById('eventsContainer');

    if (!container) return;

    const filtered = events.filter(e => {
        const matchesEvent = e.title.toLowerCase().includes(term) || (e.college && e.college.toLowerCase().includes(term));
        const matchesStudent = e.registeredStudents?.some(s =>
            s.name.toLowerCase().includes(term) || s.email.toLowerCase().includes(term)
        );
        return matchesEvent || matchesStudent;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state">📭 No events found.</div>';
        return;
    }

    container.innerHTML = '';
    filtered.forEach(event => {
        const students = event.registeredStudents || [];

        let studentsHtml = '';
        students.forEach(student => {
            const fullUser = allUsers.find(u => u.email === student.email);

            const registeredCount = events.filter(e =>
                e.registeredStudents?.some(s => s.email === student.email)
            ).length;

            const attendedCount = events.filter(e =>
                e.registeredStudents?.some(s => s.email === student.email) && e.attended === true
            ).length;

            const department = fullUser?.department || student.department || 'Not specified';
            const registrationDate = student.registeredAt ? new Date(student.registeredAt).toLocaleDateString() :
                (fullUser?.createdAt ? new Date(fullUser.createdAt).toLocaleDateString() : 'N/A');

            studentsHtml += `
                <div class="student-detail-card">
                    <div class="student-header">
                        <i class="fa-solid fa-user-graduate"></i>
                        <div class="student-header-info">
                            <div class="student-fullname">${student.name}</div>
                            <div class="student-email">${student.email}</div>
                        </div>
                        <span class="role-badge ${fullUser?.role === 'admin' ? 'admin' : 'student'}">
                            ${fullUser?.role || 'student'}
                        </span>
                    </div>
                    <div class="student-details-row">
                        <div class="student-detail-item">
                            <i class="fa-solid fa-building-columns"></i>
                            <span>${department}</span>
                        </div>
                        <div class="student-detail-item">
                            <i class="fa-solid fa-calendar-plus"></i>
                            <span>Registered: ${registrationDate}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <div class="event-college">${event.college || 'University Event'}</div>
            <div class="event-title">${event.title}</div>
            <div class="event-meta">
                <span><i class="fa-solid fa-calendar"></i> ${event.date}</span>
                <span><i class="fa-solid fa-clock"></i> ${event.time}</span>
                <span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>
            </div>
            <div class="registered-students-section">
                <h4><i class="fa-solid fa-users"></i> Registered Students (${students.length})</h4>
                <div class="students-list">
                    ${studentsHtml}
                </div>
            </div>
            <div class="event-actions">
                <button class="details-btn" onclick="viewEventDetails(${event.id})">Details</button>
                <button class="edit-btn" onclick="editEvent(${event.id})">Edit</button>
                <button class="delete-btn" onclick="deleteEvent(${event.id})">Delete</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function viewEventDetails(eventId) {
    window.location.href = `/admin-dashboard?eventId=${eventId}`;
}

function editEvent(eventId) {
    window.location.href = `/admin-dashboard?edit=${eventId}`;
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        let events = JSON.parse(localStorage.getItem('events')) || [];
        events = events.filter(e => e.id !== eventId);
        localStorage.setItem('events', JSON.stringify(events));
        loadEventsWithStudents();
        alert('✅ Event deleted successfully!');
    }
}

function updateDateTime() {
    const now = new Date();
    const timeEl = document.getElementById('time');
    const dateEl = document.getElementById('date');
    if (timeEl) timeEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (dateEl) dateEl.innerText = now.toLocaleDateString();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebarMenu');
    if (sidebar) sidebar.classList.toggle('active');
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
}

setInterval(updateDateTime, 1000);
updateDateTime();
