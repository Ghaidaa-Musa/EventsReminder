let currentEventId = null;

document.addEventListener('DOMContentLoaded', () => {

    setupToastContainer();

    loadUserData();
    loadMyEvents();

    const unregisterBtn = document.getElementById('modalUnregisterBtn');
    if (unregisterBtn) {
        unregisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            unregisterFromModal();
        });
    }

    const modal = document.getElementById('detailsModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }

    document.addEventListener('click', function(event) {
        const sidebar = document.getElementById('sidebarMenu');
        const menuBtn = document.querySelector('.menu-toggle-btn');

        if (sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
});

function setupToastContainer() {
    if (document.getElementById('toastContainer')) return;
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;
    document.body.appendChild(container);
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? '#10B981' : '#EF4444';
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark';

    toast.style.cssText = `
        background: ${bgColor};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        min-width: 250px;
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.3s ease;
    `;

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 10);


    setTimeout(() => {
        toast.style.transform = 'translateY(-20px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function loadMyEvents() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const container = document.getElementById('myEventsContainer');
    if (!container) return;

    const myEvents = events.filter(event =>
        event.registeredStudents?.some(s => s.email === currentUser?.email)
    );

    const welcomeSub = document.querySelector('.welcome-container p');
    if (welcomeSub) {
        if (myEvents.length === 0) {
            welcomeSub.innerHTML = 'You haven\'t registered for any events yet.';
        } else {
            welcomeSub.innerHTML = ` You are currently registered for <b style="color: #D97706; font-size: 16px;">${myEvents.length}</b> upcoming event(s).`;
        }
    }

    if (myEvents.length === 0) {
        container.innerHTML = '<div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 40px; color: #6b7280; font-size: 16px;">📭 No events found.</div>';
        return;
    }

    container.innerHTML = '';
    myEvents.forEach(event => {
        const card = document.createElement('div');
        card.className = 'transparent-event-card';
        const isAttended = event.attended === true;
        card.innerHTML = `
            <div class="card-college">${event.college}</div>
            <h3 class="card-title">${event.title}</h3>
            <div class="card-meta">
                <span><i class="fa-solid fa-calendar"></i> ${event.date}</span>
                <span><i class="fa-solid fa-clock"></i> ${event.time}</span>
                <span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>
            </div>
            ${!isAttended ?
            `<button class="unregister-btn" onclick="event.stopPropagation(); unregisterFromEvent(${event.id})">
                ❌ Unregister
            </button>` :
            `<span class="attended-badge"><i class="fa-solid fa-check-circle"></i> Attended</span>`
        }
        `;
        card.onclick = () => openEventDetails(event);
        container.appendChild(card);
    });
}

function openEventDetails(event) {
    if (!event) return;

    currentEventId = event.id || event.EventId || event._id;

    fetch('/api/current-user')
        .then(response => response.json())
        .then(user => {
            if (user) {
                const studentNameEl = document.getElementById('modalStudentName');
                const studentMajorEl = document.getElementById('modalStudentMajor');
                if (studentNameEl) studentNameEl.innerText = user.fullName;
                if (studentMajorEl) studentMajorEl.innerText = user.department || 'Student';
            }
        })
        .catch(error => console.error('Error fetching user:', error));

    document.getElementById('modalCollege').innerText = event.college || '';
    document.getElementById('modalTitle').innerText = event.title || '';
    document.getElementById('modalDate').innerText = event.date || '';
    document.getElementById('modalTime').innerText = event.time || '';
    document.getElementById('modalLocation').innerText = event.location || '';
    document.getElementById('modalAudience').innerText = event.audience || '';
    document.getElementById('modalFees').innerText = event.fees || '';
    document.getElementById('modalSpeaker').innerText = event.speaker || '-';
    document.getElementById('modalCertificate').innerText = event.certificate || 'No';

    const modal = document.getElementById('detailsModal');
    if (modal) {
        modal.style.setProperty('display', 'flex', 'important');
        modal.classList.add('active');
    }
}

function closeModal() {
    const modal = document.getElementById('detailsModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.setProperty('display', 'none', 'important');
    }
}

function unregisterFromEvent(eventId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    if (!confirm('Are you sure you want to unregister from this event?')) return;

    let events = JSON.parse(localStorage.getItem('events')) || [];
    const eventIndex = events.findIndex(e => String(e.id || e.EventId || e._id).trim() === String(eventId).trim());

    if (eventIndex !== -1) {
        if (events[eventIndex].registeredStudents) {
            events[eventIndex].registeredStudents = events[eventIndex].registeredStudents.filter(
                s => s.email !== currentUser.email
            );
        }
        localStorage.setItem('events', JSON.stringify(events));

        showToast('You have been unregistered successfully', 'error');
        loadMyEvents();
    }
}

function markAsAttendedFromModal() {
    if (!currentEventId) return;

    let events = JSON.parse(localStorage.getItem('events')) || [];
    const eventIndex = events.findIndex(e => String(e.id || e.EventId || e._id).trim() === String(currentEventId).trim());

    if (eventIndex !== -1) {
        events[eventIndex].attended = true;
        localStorage.setItem('events', JSON.stringify(events));

        showToast('Event marked as attended successfully!', 'success');
        closeModal();
        loadMyEvents();
    }
}

function searchMyEvents() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const myEvents = events.filter(event =>
        event.registeredStudents?.some(s => s.email === currentUser?.email) &&
        (event.title.toLowerCase().includes(term) || event.college.toLowerCase().includes(term))
    );

    const container = document.getElementById('myEventsContainer');
    if (!container) return;

    if (myEvents.length === 0) {
        container.innerHTML = '<div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 40px; color: #6b7280; font-size: 16px;">📭 No events found.</div>';
        return;
    }

    container.innerHTML = '';
    myEvents.forEach(event => {
        const card = document.createElement('div');
        card.className = 'transparent-event-card';
        const isAttended = event.attended === true;
        card.innerHTML = `
            <div class="card-college">${event.college}</div>
            <h3 class="card-title">${event.title}</h3>
            <div class="card-meta">
                <span><i class="fa-solid fa-calendar"></i> ${event.date}</span>
                <span><i class="fa-solid fa-clock"></i> ${event.time}</span>
                <span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>
            </div>
            ${!isAttended ?
            `<button class="unregister-btn" onclick="event.stopPropagation(); unregisterFromEvent(${event.id})">
                ❌ Unregister
            </button>` :
            `<span class="attended-badge"><i class="fa-solid fa-check-circle"></i> Attended</span>`
        }
        `;
        card.onclick = () => openEventDetails(event);
        container.appendChild(card);
    });
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebarMenu');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

function loadUserData() {
    fetch('/api/current-user')
        .then(response => response.json())
        .then(user => {
            if (user) {
                document.getElementById('profileName').innerText = user.fullName;
                document.getElementById('profileRole').innerText = user.department || 'Student';
            }
        })
        .catch(error => console.error('Error fetching user:', error));
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
}

function unregisterFromModal() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const userEmail = currentUser ? currentUser.email : "student@univent.edu.sa";

    if (!confirm('Are you sure you want to unregister from this event?')) return;

    let events = JSON.parse(localStorage.getItem('events')) || [];
    let eventIndex = -1;

    if (currentEventId !== null && currentEventId !== undefined) {
        eventIndex = events.findIndex(e => String(e.id || e.EventId || e._id).trim() === String(currentEventId).trim());
    }

    if (eventIndex === -1) {
        const currentTitle = document.getElementById('modalTitle').innerText.trim();
        const currentCollege = document.getElementById('modalCollege').innerText.trim();
        eventIndex = events.findIndex(e => e.title.trim() === currentTitle && e.college.trim() === currentCollege);
    }

    if (eventIndex !== -1) {
        if (!events[eventIndex].registeredStudents) {
            events[eventIndex].registeredStudents = [];
        }

        events[eventIndex].registeredStudents = events[eventIndex].registeredStudents.filter(
            s => s.email.trim().toLowerCase() !== userEmail.trim().toLowerCase()
        );

        localStorage.setItem('events', JSON.stringify(events));

        closeModal();
        loadMyEvents();
        showToast('You have been unregistered successfully', 'error');
    } else {
        showToast('Error: Event not found in local database.', 'error');
    }
}