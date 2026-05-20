// ============================================================
//  ADMIN DASHBOARD
// ============================================================

function renderAdmin() {
    if (!currentUser || currentUser.role !== 'admin') {
        return `<div class="card" style="text-align: center; padding: 48px;"><i class="fas fa-lock"></i> Admin access only</div>`;
    }
    const stats = getAdminStats();

    return `
        <h2><i class="fas fa-chart-line"></i> Admin Dashboard</h2>
        <div class="stats-grid">
            <div class="stat-card"><div class="stat-value">${stats.totalEvents}</div><div class="stat-label">Total Events</div></div>
            <div class="stat-card"><div class="stat-value">${stats.totalSold}</div><div class="stat-label">Tickets Sold</div></div>
            <div class="stat-card"><div class="stat-value">${stats.totalRevenue.toLocaleString()} RWF</div><div class="stat-label">Revenue</div></div>
            <div class="stat-card"><div class="stat-value">${stats.workers}</div><div class="stat-label">Workers</div></div>
        </div>

        <div class="card" style="margin-bottom: 24px; padding: 20px;">
            <h3><i class="fas fa-plus-circle"></i> Add New Event</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin-top: 16px;">
                <input id="newEventName" class="input" placeholder="Event Name">
                <input id="newEventImage" class="input" placeholder="Image URL" value="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&h=300&fit=crop">
                <select id="newEventLocation" class="input">
                    <option value="">Select Location</option>
                    ${window.DB.locations.map(l => `<option value="${l.id}">${l.name}</option>`).join('')}
                </select>
                <input id="newEventDate" type="date" class="input">
                <input id="newEventTime" type="time" class="input" value="18:00">
                <input id="newEventPrice" type="number" class="input" placeholder="Base Price (RWF)">
                <input id="newEventCapacity" type="number" class="input" placeholder="Total Capacity">
                <select id="newEventCategory" class="input">
                    <option value="Music">Music</option>
                    <option value="Sports">Sports</option>
                    <option value="Culture">Culture</option>
                    <option value="Conference">Conference</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Party">Party</option>
                </select>
                <select id="newEventPerformer" class="input">
                    <option value="">No Performer</option>
                    ${window.DB.users.filter(u => u.role === 'performer').map(p => `<option value="${p.performerId}" data-name="${p.name}">${p.name}</option>`).join('')}
                </select>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <label><input type="checkbox" id="hasRegular" checked> Regular</label>
                    <label><input type="checkbox" id="hasVip" checked> VIP</label>
                    <label><input type="checkbox" id="hasVvip"> VVIP</label>
                </div>
                <button class="btn btn-primary" onclick="addNewEvent()"><i class="fas fa-save"></i> Create Event</button>
            </div>
        </div>

        <h3><i class="fas fa-calendar-alt"></i> All Events (${window.DB.events.length})</h3>
        <div class="events-grid">
            ${window.DB.events.map(event => {
                const totalSold = (event.sold?.regular || 0) + (event.sold?.vip || 0) + (event.sold?.vvip || 0);
                return `
                    <div class="card" style="padding: 16px;">
                        <img src="${event.image}" style="width: 100%; height: 100px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 12px;">
                        <h4>${event.name}</h4>
                        <div style="font-size: 12px; color: var(--text-muted);">${event.category} · ${event.date}</div>
                        <div style="margin: 12px 0;">
                            <div style="height: 4px; background: var(--bg-elevated); border-radius: 2px;">
                                <div style="width: ${(totalSold / event.totalCapacity) * 100}%; height: 4px; background: var(--accent); border-radius: 2px;"></div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 11px;">
                                <span>${totalSold}/${event.totalCapacity} sold</span>
                                <span>${event.basePrice.toLocaleString()} RWF</span>
                            </div>
                        </div>
                        <button class="btn btn-danger btn-sm" style="width: 100%;" onclick="if(confirm('Delete event?')) { deleteEvent('${event.id}'); render(); }">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function addNewEvent() {
    const performerSelect = document.getElementById('newEventPerformer');
    const performerId = performerSelect?.value;
    const performerName = performerSelect?.options[performerSelect.selectedIndex]?.getAttribute('data-name') || null;
    
    const newEvent = {
        name: document.getElementById('newEventName')?.value,
        image: document.getElementById('newEventImage')?.value,
        locationId: document.getElementById('newEventLocation')?.value,
        date: document.getElementById('newEventDate')?.value,
        time: document.getElementById('newEventTime')?.value,
        basePrice: parseInt(document.getElementById('newEventPrice')?.value),
        totalCapacity: parseInt(document.getElementById('newEventCapacity')?.value),
        category: document.getElementById('newEventCategory')?.value,
        performerId: performerId || null,
        performerName: performerName || "Unknown Artist",
        tiers: {
            regular: document.getElementById('hasRegular')?.checked,
            vip: document.getElementById('hasVip')?.checked,
            vvip: document.getElementById('hasVvip')?.checked
        }
    };
    
    if (!newEvent.name || !newEvent.locationId || !newEvent.date || !newEvent.basePrice || !newEvent.totalCapacity) {
        alert('Please fill all required fields');
        return;
    }
    addEvent(newEvent);
    render();
    window.location.hash = 'admin';
}

// Workers management page
function renderWorkers() {
    if (!currentUser || currentUser.role !== 'admin') return '<div class="card">Admin access only</div>';
    const workers = window.DB.users.filter(u => u.role === 'worker');
    
    return `
        <h2><i class="fas fa-users-cog"></i> Manage Workers</h2>
        <div class="card" style="padding: 24px; margin-bottom: 24px;">
            <h3>Add New Worker</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px;">
                <input id="workerName" class="input" placeholder="Full Name">
                <input id="workerPhone" class="input" placeholder="Phone (+250...)">
                <input id="workerEmail" class="input" placeholder="Email">
                <input id="workerPass" class="input" placeholder="Password" value="worker123">
                <button class="btn btn-primary" onclick="addWorkerAction()"><i class="fas fa-plus"></i> Add Worker</button>
            </div>
        </div>
        
        <h3>Current Workers (${workers.length})</h3>
        <table class="workers-table">
            <thead>
                <tr><th>Name</th><th>Phone</th><th>Email</th><th>Actions</th></tr>
            </thead>
            <tbody>
                ${workers.map(w => `
                    <tr>
                        <td><i class="fas fa-user-shield"></i> ${w.name}</td>
                        <td>${w.phone}</td>
                        <td>${w.email}</td>
                        <td><button class="btn btn-danger btn-sm" onclick="removeWorkerAction('${w.id}')"><i class="fas fa-trash"></i> Remove</button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        ${workers.length === 0 ? '<div class="card" style="text-align: center;">No workers yet.</div>' : ''}
    `;
}

function addWorkerAction() {
    const name = document.getElementById('workerName')?.value;
    const phone = document.getElementById('workerPhone')?.value;
    const email = document.getElementById('workerEmail')?.value;
    const password = document.getElementById('workerPass')?.value;
    if (!name || !phone) {
        alert('Name and phone required');
        return;
    }
    addWorker(name, phone, email, password);
    render();
}

function removeWorkerAction(userId) {
    if (confirm('Remove this worker?')) {
        deleteUser(userId);
        render();
    }
}