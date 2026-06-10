function loadStats() {
    fetch('/api/current-user')
        .then(response => response.json())
        .then(user => {
            if (!user) {
                console.log('No user found');
                return;
            }

            console.log('User email:', user.email);

            const events = JSON.parse(localStorage.getItem('events')) || [];
            console.log('All events:', events);

        
            const myEvents = events.filter(event => {
                const registered = event.registeredStudents?.some(s => s.email === user.email);
                console.log('Event:', event.title, '| registered:', registered);
                return registered;
            });

            console.log('My events (registered):', myEvents);


            const totalRegistered = myEvents.length;
            const attended = myEvents.filter(e => e.attended === true).length;
            const upcoming = myEvents.filter(e => e.attended !== true && new Date(e.date) >= new Date()).length;
            const certificates = myEvents.filter(e => e.certificate === 'Yes' && e.attended === true).length;

            document.getElementById('totalEvents').innerText = totalRegistered;
            document.getElementById('attendedEvents').innerText = attended;
            document.getElementById('upcomingEvents').innerText = upcoming;
            document.getElementById('certificatesEarned').innerText = certificates;


            const attendedEvents = myEvents.filter(e => e.attended === true);
            const attendedContainer = document.getElementById('attendedEventsList');

            console.log('Attended events:', attendedEvents);

            if (attendedEvents.length === 0) {
                attendedContainer.innerHTML = '<div class="empty-state">📭 No attended events yet. Mark events as attended from "My Events" page.</div>';
                return;
            }

            attendedContainer.innerHTML = '';
            attendedEvents.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = 'attended-item';
                eventDiv.innerHTML = `
                    <div class="attended-info">
                        <div class="attended-college">${event.college}</div>
                        <div class="attended-title">${event.title}</div>
                        <div class="attended-meta">
                            <span><i class="fa-solid fa-calendar"></i> ${event.date}</span>
                            <span><i class="fa-solid fa-clock"></i> ${event.time}</span>
                            <span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>
                        </div>
                    </div>
                    <div class="attended-right">
                        <div class="attended-badge">
                            <i class="fa-solid fa-check-circle"></i> Attended
                        </div>
                        ${event.certificate === 'Yes' ?
                    `<div class="attended-date"><i class="fa-solid fa-certificate"></i> Certificate Available</div>` :
                    `<div class="attended-date"><i class="fa-solid fa-file"></i> No Certificate</div>`
                }
                    </div>
                `;
                eventDiv.onclick = () => window.location.href = `/my-events`;
                attendedContainer.appendChild(eventDiv);
            });
        })
        .catch(error => console.error('Error:', error));
}

function toggleSidebar() {
    document.getElementById('sidebarMenu').classList.toggle('active');
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
}

loadStats();