function loadReminders() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const container = document.getElementById('remindersContainer');

    if (!container) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const myEvents = events.filter(event =>
        event.registeredStudents?.some(s => s.email === currentUser?.email)
    );

    const upcomingEvents = myEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today && eventDate <= nextWeek && !event.attended;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    if (upcomingEvents.length === 0) {
        container.innerHTML = '<div class="empty-state">🎉 No upcoming reminders! Enjoy your time.</div>';
        return;
    }

    container.innerHTML = '';
    upcomingEvents.forEach(event => {
        const eventDate = new Date(event.date);
        const daysDiff = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

        let alertClass = '';
        let alertText = `${daysDiff} days left`;

        if (daysDiff === 0) {
            alertClass = 'urgent';
            alertText = '🔥 TODAY!';
        } else if (daysDiff === 1) {
            alertClass = 'urgent';
            alertText = '⚠️ Tomorrow!';
        } else if (daysDiff <= 3) {
            alertClass = 'warning';
            alertText = `📅 ${daysDiff} days left`;
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-card ${alertClass}`;
        alertDiv.innerHTML = `
            <div class="alert-info">
                <div class="alert-college">${event.college}</div>
                <div class="alert-title">${event.title}</div>
                <div class="alert-meta">
                    <span><i class="fa-solid fa-calendar"></i> ${event.date}</span>
                    <span><i class="fa-solid fa-clock"></i> ${event.time}</span>
                    <span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>
                </div>
            </div>
            <div class="alert-badge ${alertClass}">${alertText}</div>
        `;
        alertDiv.onclick = () => window.location.href = '/my-events';
        container.appendChild(alertDiv);

    });
}

function toggleSidebar() {
    document.getElementById('sidebarMenu').classList.toggle('active');
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
}

// ✅ أضيفي هذا الكود هنا
document.addEventListener('click', function(event) {
    const modal = document.getElementById('detailsModal');
    const sidebar = document.getElementById('sidebarMenu');
    const toggleBtn = document.querySelector('.menu-toggle-btn');

    if (modal && modal.classList.contains('active')) {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    }

    if (sidebar && toggleBtn && !sidebar.contains(event.target) && !toggleBtn.contains(event.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

loadReminders();