document.addEventListener('DOMContentLoaded', () => {
    loadAdminData();
    loadEvents();


    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {

            if (e.target === this) {
                if (this.id === 'eventModal') {
                    closeModal();
                } else {
                    this.classList.remove('active');
                }
            }
        });
    });
});

let editingEventId = null;

function loadAdminData() {
    const adminWelcome = document.getElementById('adminWelcomeName');
    const adminSidebarName = document.getElementById('adminName');


}

function loadEvents() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const container = document.getElementById('adminEventsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (events.length === 0) {
        container.innerHTML = `
            <div class="event-card" style="grid-column: 1/-1; text-align: center; padding: 50px 20px; background: rgba(255, 255, 255, 0.25);">
                <i class="fa-solid fa-calendar-xmark" style="font-size: 3rem; color:#D97706; margin-bottom:15px; display:block;"></i>
                <h3 style="font-size: 1.2rem; font-weight:600; color:#18181B;">No events found in Database</h3>
                <p style="font-size:0.85rem; color:#52525B; margin-top:6px;">Click on 'Add New Event' to create your first activity.</p>
            </div>`;
        return;
    }

    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        const registered = event.registeredStudents || [];

        card.innerHTML = `
            <div class="event-college">${event.college || 'University Department'}</div>
            <h3 class="event-title">${event.title}</h3>
            
            <div class="event-meta" style="display:flex; flex-direction:column; gap:6px; font-size:0.85rem; color:#52525B; margin-bottom:12px;">
                <div><i class="fa-regular fa-calendar" style="color:#D97706; margin-right:5px;"></i> ${event.date || 'N/A'}</div>
                <div><i class="fa-regular fa-clock" style="color:#D97706; margin-right:5px;"></i> ${event.time || '10:00 AM'}</div>
                <div><i class="fa-solid fa-location-dot" style="color:#D97706; margin-right:5px;"></i> ${event.location || 'Main Campus'}</div>
            </div>

            <div style="font-size: 0.8rem; margin-bottom: 15px; color:#52525B;">
                <i class="fa-solid fa-user-graduate" style="color:#D97706;"></i> Registered Students: <strong>${registered.length}</strong>
            </div>

            <div class="event-actions" style="display:flex; gap:8px;">
                <button class="details-btn" onclick="openEventDetails(${event.id})" style="background:#3B82F6; color:white; border:none; padding:6px 12px; border-radius:12px; cursor:pointer;">
                    <i class="fa-solid fa-eye"></i> Details
                </button>
                <button class="edit-btn" onclick="editEvent(${event.id})" style="background:#FBBF24; color:#18181B; border:none; padding:6px 12px; border-radius:12px; cursor:pointer;">
                    <i class="fa-solid fa-pen"></i> Edit
                </button>
                <button class="delete-btn" onclick="deleteEvent(${event.id})" style="background:#EF4444; color:white; border:none; padding:6px 12px; border-radius:12px; cursor:pointer;">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function openAddModal() {
    editingEventId = null;
    const form = document.getElementById('eventForm');
    if (form) form.reset();
    document.getElementById('eventId').value = '';
    document.getElementById('modalTitle').innerText = 'Add New University Event';
    document.getElementById('eventModal').classList.add('active');
}

function closeModal() {
    document.getElementById('eventModal').classList.remove('active');
}

function toggleVenue(isInPerson) {
    const locInput = document.getElementById('location');
    if (!locInput) return;
    if (isInPerson) {
        locInput.value = '';
        locInput.disabled = false;
    } else {
        locInput.value = 'Online Webinar';
        locInput.disabled = true;
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebarMenu');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebarMenu');
    const toggleBtn = document.querySelector('.menu-toggle-btn');

    if (!sidebar || !toggleBtn) return;


    if (sidebar.classList.contains('active')) {

        if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    }
});

document.getElementById('sidebarMenu')?.addEventListener('click', function(event) {
    event.stopPropagation();
});

document.getElementById('eventForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    let events = JSON.parse(localStorage.getItem('events')) || [];

    const eventData = {
        id: editingEventId || Date.now(),
        college: document.getElementById('college').value,
        title: document.getElementById('title').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        location: document.getElementById('location').value,
        audience: document.getElementById('targetAudience').value,
        fees: document.getElementById('fees').value,
        speaker: document.getElementById('presentedBy').value,
        certificate: document.getElementById('certificate').value,
        attendanceType: document.querySelector('input[name="attendanceType"]:checked')?.value || 'In-Person',
        registeredStudents: editingEventId ? (events.find(ev => ev.id === editingEventId)?.registeredStudents || []) : []
    };

    if (editingEventId) {
        const index = events.findIndex(ev => ev.id === editingEventId);
        if (index !== -1) events[index] = eventData;
    } else {
        events.push(eventData);
    }

    localStorage.setItem('events', JSON.stringify(events));
    alert(editingEventId ? '✅ Event updated successfully!' : '✅ Event created successfully!');
    closeModal();
    loadEvents();
});

function editEvent(id) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const event = events.find(ev => ev.id === id);
    if (!event) return;

    editingEventId = id;
    document.getElementById('eventId').value = event.id;
    document.getElementById('college').value = event.college;
    document.getElementById('title').value = event.title;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventTime').value = event.time;
    document.getElementById('location').value = event.location;
    document.getElementById('targetAudience').value = event.audience || '';
    document.getElementById('fees').value = event.fees || '';
    document.getElementById('presentedBy').value = event.speaker || '';
    document.getElementById('certificate').value = event.certificate || 'Yes';

    if (event.attendanceType === 'Online') {
        document.querySelector('input[name="attendanceType"][value="Online"]').checked = true;
        toggleVenue(false);
    } else {
        document.querySelector('input[name="attendanceType"][value="In-Person"]').checked = true;
        toggleVenue(true);
    }

    document.getElementById('modalTitle').innerText = 'Modify Event Record';
    document.getElementById('eventModal').classList.add('active');
}


function openEventDetails(id) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const event = events.find(ev => ev.id === id);
    if (!event) return;

    document.getElementById('detailCollege').innerText = event.college;
    document.getElementById('detailTitle').innerText = event.title;
    document.getElementById('detailDate').innerText = event.date;
    document.getElementById('detailTime').innerText = event.time;
    document.getElementById('detailLocation').innerText = event.location;
    document.getElementById('detailAudience').innerText = event.audience || 'All Students';

    const students = event.registeredStudents || [];
    document.getElementById('studentCount').innerText = students.length;

    const listContainer = document.getElementById('registeredStudentsList');
    listContainer.innerHTML = '';

    if(students.length === 0) {
        listContainer.innerHTML = '<p style="font-size:0.8rem; color:#71717A;">No students registered yet.</p>';
    } else {
        students.forEach(st => {
            listContainer.innerHTML += `<div class="student-item" style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid rgba(0,0,0,0.05); font-size:0.85rem;"><span><i class="fas fa-user"></i> ${st.name || 'Student'}</span> <span>${st.id || ''}</span></div>`;
        });
    }

    document.getElementById('eventDetailsModal').classList.add('active');
}


function deleteEvent(id) {
    if (!confirm('Are you sure you want to permanently delete this event?')) return;
   let events = JSON.parse(localStorage.getItem('events')) || [];
    events = events.filter(ev => ev.id !== id);
    localStorage.setItem('events', JSON.stringify(events));
    loadEvents();
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
}

function closeModal() {
    const eventModal = document.getElementById('eventModal');
    if (eventModal) {
        eventModal.classList.remove('active');
    }

    const adminName = document.querySelector('[th\\:text="adminName"]')?.innerText || document.getElementById('adminName')?.innerText;
    console.log('Admin name from server:', adminName);
}