let currentEventId = null;

function loadEvents() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const container = document.getElementById('eventsContainer');
    if (!container) return;

    container.innerHTML = '';
    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'transparent-event-card';
        card.innerHTML = `
            <div class="card-college">${event.college}</div>
            <h3 class="card-title">${event.title}</h3>
            <div class="card-meta">
                <span><i class="fa-solid fa-calendar"></i> ${event.date}</span>
                <span><i class="fa-solid fa-clock"></i> ${event.time}</span>
                <span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>
            </div>
        `;
        card.onclick = () => openEventDetails(event);
        container.appendChild(card);
    });
}

function openEventDetails(event) {
    currentEventId = event.id;
    document.getElementById('modalCollege').innerText = event.college;
    document.getElementById('modalTitle').innerText = event.title;
    document.getElementById('modalDate').innerText = event.date;
    document.getElementById('modalTime').innerText = event.time;
    document.getElementById('modalLocation').innerText = event.location;
    document.getElementById('modalAudience').innerText = event.audience;
    document.getElementById('modalFees').innerText = event.fees;
    document.getElementById('modalSpeaker').innerText = event.speaker;
    document.getElementById('modalCertificate').innerText = event.certificate || 'No';

    document.getElementById('detailsModal').classList.add('active');
}

function closeModal() {
    document.getElementById('detailsModal').classList.remove('active');
}

function registerForEvent() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login first!');
        return;
    }

    let events = JSON.parse(localStorage.getItem('events')) || [];
    const eventIndex = events.findIndex(e => e.id === currentEventId);

    if (eventIndex !== -1) {
        if (!events[eventIndex].registeredStudents) {
            events[eventIndex].registeredStudents = [];
        }

        const alreadyRegistered = events[eventIndex].registeredStudents.some(
            s => s.email === currentUser.email
        );

        if (!alreadyRegistered) {
            events[eventIndex].registeredStudents.push({
                name: currentUser.fullName,
                email: currentUser.email,
                registeredAt: new Date().toISOString()
            });

            localStorage.setItem('events', JSON.stringify(events));
            alert('✅ Successfully registered for this event!');
            loadEvents();
        } else {
            alert('⚠️ You are already registered for this event.');
        }
    }
    closeModal();
}

function searchEvents() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const container = document.getElementById('eventsContainer');

    const filtered = events.filter(e =>
        e.title.toLowerCase().includes(term) ||
        e.college.toLowerCase().includes(term)
    );

    container.innerHTML = '';
    filtered.forEach(event => {
        const card = document.createElement('div');
        card.className = 'transparent-event-card';
        card.innerHTML = `
            <div class="card-college">${event.college}</div>
            <h3 class="card-title">${event.title}</h3>
            <div class="card-meta">
                <span><i class="fa-solid fa-calendar"></i> ${event.date}</span>
                <span><i class="fa-solid fa-clock"></i> ${event.time}</span>
            </div>
        `;
        card.onclick = () => openEventDetails(event);
        container.appendChild(card);
    });
}

function loadUserData() {
    fetch('/api/current-user')
        .then(response => response.json())
        .then(user => {
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                document.getElementById('profileName').innerText = user.fullName;
                document.getElementById('profileRole').innerText = user.department || 'Computer Science Student';
                const firstName = user.fullName ? user.fullName.split(' ')[0] : 'User';
                document.getElementById('welcomeGreeting').innerText = `Welcome back, ${firstName}!`;
            }
        })
        .catch(error => console.error('Error fetching user:', error));
}

function toggleSidebar() {
    document.getElementById('sidebarMenu').classList.toggle('active');
}

function openProfileInfo() {
    const name = document.getElementById('profileName').innerText;
    alert(`✨ Profile\nName: ${name}\nAttended Events: Check your registered events.`);
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
}

document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebarMenu');
    const toggleBtn = document.querySelector('.menu-toggle-btn');
    if (sidebar && toggleBtn && !sidebar.contains(event.target) && !toggleBtn.contains(event.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

loadUserData();
loadEvents();
function showProfileStats() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const myEvents = events.filter(e => e.registeredStudents?.some(s => s.email === currentUser?.email));
    const attended = myEvents.filter(e => e.attended === true).length;
    const upcoming = myEvents.filter(e => !e.attended && new Date(e.date) >= new Date()).length;

    alert(`📊 Your Stats:
    🎟️ Total Registered: ${myEvents.length}
    ⏳ Upcoming: ${upcoming}
    ✅ Attended: ${attended}
    🏆 Certificate Earned: ${myEvents.filter(e => e.certificate === 'Yes' && e.attended).length}`);
}


