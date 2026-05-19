// ============================================================
//  TIKETIRW PRO - COMPLETE PLATFORM
//  With 10 Events, Attractive Hero, Create Account Button
// ============================================================

let DB = {
    users: [
        { id: "u1", name: "Eric Niyomugabo", phone: "+250788123456", email: "eric@example.com", password: "pass123", role: "customer", avatar: "👨" },
        { id: "u2", name: "Admin User", phone: "+250788000001", email: "admin@tiketirw.com", password: "admin123", role: "admin", avatar: "👑" },
        { id: "u3", name: "John Muwanga", phone: "+250788000002", email: "john@gate.com", password: "worker123", role: "worker", avatar: "🛡️" },
        { id: "u4", name: "Michael Jackson", phone: "+250788000004", email: "michael@performer.com", password: "performer123", role: "performer", performerId: "p1", avatar: "🎤" },
        { id: "u5", name: "Burna Boy", phone: "+250788000005", email: "burna@performer.com", password: "performer123", role: "performer", performerId: "p2", avatar: "🎵" }
    ],
    locations: [
        { id: "loc1", name: "Kigali Convention Centre" },
        { id: "loc2", name: "Amahoro National Stadium" },
        { id: "loc3", name: "BK Arena" },
        { id: "loc4", name: "Kandt House Museum" },
        { id: "loc5", name: "Intare Conference Arena" }
    ],
    events: [],
    tickets: [],
    scans: []
};

const TIERS = {
    regular: { name: "Regular", multiplier: 1, benefits: "Standard entry" },
    vip: { name: "VIP", multiplier: 2.5, benefits: "VIP lounge, Fast entry" },
    vvip: { name: "VVIP", multiplier: 5, benefits: "Backstage access, Meet & Greet" }
};

// 10 SAMPLE EVENTS
const DEFAULT_EVENTS = [
    { id: "ev1", name: "Kigali Jazz & Soul Night", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop", locationId: "loc1", date: "2025-06-14", time: "18:00", basePrice: 5000, tiers: { regular: true, vip: true, vvip: true }, category: "Music", performerId: "p1", performerName: "Michael Jackson", totalCapacity: 500, sold: { regular: 180, vip: 25, vvip: 5 } },
    { id: "ev2", name: "APR FC vs Rayon Sports", image: "https://images.unsplash.com/photo-1459865264687-287d68a4d2c5?w=400&h=300&fit=crop", locationId: "loc2", date: "2025-06-20", time: "15:00", basePrice: 2000, tiers: { regular: true, vip: true, vvip: false }, category: "Sports", performerId: null, performerName: "APR FC", totalCapacity: 1200, sold: { regular: 850, vip: 100, vvip: 30 } },
    { id: "ev3", name: "Afrobeats Summer Fest", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop", locationId: "loc3", date: "2025-06-28", time: "20:00", basePrice: 15000, tiers: { regular: true, vip: true, vvip: true }, category: "Music", performerId: "p2", performerName: "Burna Boy", totalCapacity: 800, sold: { regular: 600, vip: 100, vvip: 40 } },
    { id: "ev4", name: "Rwanda Cultural Gala", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad9a6c3?w=400&h=300&fit=crop", locationId: "loc4", date: "2025-07-06", time: "16:00", basePrice: 3500, tiers: { regular: true, vip: true, vvip: false }, category: "Culture", performerId: null, performerName: "Rwandan Artists", totalCapacity: 300, sold: { regular: 95, vip: 20, vvip: 5 } },
    { id: "ev5", name: "Tech Summit Rwanda", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop", locationId: "loc5", date: "2025-07-15", time: "09:00", basePrice: 25000, tiers: { regular: true, vip: true, vvip: true }, category: "Conference", performerId: null, performerName: "Tech Rwanda", totalCapacity: 400, sold: { regular: 120, vip: 45, vvip: 10 } },
    { id: "ev6", name: "Comedy Night Kigali", image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400&h=300&fit=crop", locationId: "loc1", date: "2025-07-20", time: "19:00", basePrice: 8000, tiers: { regular: true, vip: true, vvip: false }, category: "Comedy", performerId: null, performerName: "Comedy Knights", totalCapacity: 350, sold: { regular: 45, vip: 12, vvip: 3 } },
    { id: "ev7", name: "Rwandan Film Festival", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop", locationId: "loc4", date: "2025-07-25", time: "14:00", basePrice: 6000, tiers: { regular: true, vip: true, vvip: false }, category: "Film", performerId: null, performerName: "Rwanda Film Office", totalCapacity: 250, sold: { regular: 60, vip: 15, vvip: 2 } },
    { id: "ev8", name: "Kigali Fashion Week", image: "https://images.unsplash.com/photo-1535048933070-4c6707b3c5c2?w=400&h=300&fit=crop", locationId: "loc1", date: "2025-08-02", time: "18:00", basePrice: 12000, tiers: { regular: true, vip: true, vvip: true }, category: "Fashion", performerId: null, performerName: "Kigali Fashion", totalCapacity: 600, sold: { regular: 200, vip: 50, vvip: 15 } },
    { id: "ev9", name: "Marathon Rwanda 2025", image: "https://images.unsplash.com/photo-1530482817083-29ae3f4c9f6b?w=400&h=300&fit=crop", locationId: "loc2", date: "2025-08-10", time: "06:00", basePrice: 3000, tiers: { regular: true, vip: false, vvip: false }, category: "Sports", performerId: null, performerName: "Rwanda Athletics", totalCapacity: 2000, sold: { regular: 850, vip: 0, vvip: 0 } },
    { id: "ev10", name: "New Year's Eve Gala", image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&h=300&fit=crop", locationId: "loc3", date: "2025-12-31", time: "20:00", basePrice: 35000, tiers: { regular: true, vip: true, vvip: true }, category: "Party", performerId: "p1", performerName: "Michael Jackson", totalCapacity: 1000, sold: { regular: 320, vip: 85, vvip: 22 } }
];

function initDB() {
    const saved = localStorage.getItem('tiketirw_final_v2');
    if (saved) {
        const parsed = JSON.parse(saved);
        DB = { ...DB, ...parsed };
    } else {
        DB.events = DEFAULT_EVENTS;
        DB.tickets = [];
        DB.scans = [];
        saveDB();
    }
}

function saveDB() {
    localStorage.setItem('tiketirw_final_v2', JSON.stringify({
        users: DB.users,
        locations: DB.locations,
        events: DB.events,
        tickets: DB.tickets,
        scans: DB.scans
    }));
}

let currentUser = null;

function login(identifier, password) {
    const user = DB.users.find(u => (u.phone === identifier || u.email === identifier) && u.password === password);
    if (user) {
        currentUser = { ...user };
        localStorage.setItem('tiketirw_session', JSON.stringify(currentUser));
        return true;
    }
    return false;
}

function register(name, phone, email, password) {
    if (DB.users.find(u => u.phone === phone || u.email === email)) return false;
    const newUser = {
        id: "u" + Date.now(),
        name, phone, email, password, role: "customer", avatar: "👤"
    };
    DB.users.push(newUser);
    saveDB();
    currentUser = { ...newUser };
    localStorage.setItem('tiketirw_session', JSON.stringify(currentUser));
    return true;
}

function logout() { currentUser = null; localStorage.removeItem('tiketirw_session'); render(); }
function getSession() {
    const session = localStorage.getItem('tiketirw_session');
    if (session && !currentUser) currentUser = JSON.parse(session);
    return currentUser;
}

function purchaseTicket(eventId, tier, quantity) {
    if (!currentUser) return { success: false, msg: "Please login first" };
    const event = DB.events.find(e => e.id === eventId);
    if (!event) return { success: false, msg: "Event not found" };
    const price = event.basePrice * TIERS[tier].multiplier;
    const totalSold = (event.sold?.regular || 0) + (event.sold?.vip || 0) + (event.sold?.vvip || 0);
    const available = event.totalCapacity - totalSold;
    if (quantity > available) return { success: false, msg: `Only ${available} tickets left` };
    const newTickets = [];
    for (let i = 0; i < quantity; i++) {
        newTickets.push({
            id: "TKT-" + Date.now() + "-" + i + Math.random().toString(36).substr(2, 4),
            eventId: event.id, eventName: event.name, eventDate: event.date, eventTime: event.time,
            location: DB.locations.find(l => l.id === event.locationId)?.name || "", tier: tier,
            tierName: TIERS[tier].name, price: price, ownerId: currentUser.id, ownerName: currentUser.name,
            attendeeName: currentUser.name, status: "active", purchasedAt: new Date().toISOString()
        });
    }
    DB.tickets.push(...newTickets);
    if (!event.sold) event.sold = { regular: 0, vip: 0, vvip: 0 };
    event.sold[tier] = (event.sold[tier] || 0) + quantity;
    saveDB();
    return { success: true, total: quantity * price };
}

function getUserTickets() { return currentUser ? DB.tickets.filter(t => t.ownerId === currentUser.id) : []; }
function getLocationName(locationId) { return DB.locations.find(l => l.id === locationId)?.name || "Venue"; }

function renderEventCard(event) {
    const totalSold = (event.sold?.regular || 0) + (event.sold?.vip || 0) + (event.sold?.vvip || 0);
    const available = event.totalCapacity - totalSold;
    const statusClass = available < 20 ? 'badge-danger' : (available < 50 ? 'badge-warning' : 'badge-success');
    const statusText = available < 20 ? 'Almost Sold Out' : (available < 50 ? 'Few Left' : 'Available');
    return `<div class="event-card" onclick="selectEvent('${event.id}')">
        <div class="event-image" style="background-image: url('${event.image}')"><span class="event-category">${event.category}</span></div>
        <div class="event-info">
            <div class="event-title">${event.name}</div>
            <div class="event-meta"><span><i class="fas fa-map-marker-alt"></i> ${getLocationName(event.locationId)}</span><span><i class="far fa-calendar"></i> ${event.date}</span></div>
            <div class="event-footer"><div><span class="event-price">${event.basePrice.toLocaleString()} RWF</span><span style="font-size: 10px; color: var(--text-muted);"> + tiers</span></div><span class="badge ${statusClass}"><i class="fas fa-tag"></i> ${statusText}</span></div>
        </div>
    </div>`;
}

function renderHome() {
    const featuredEvents = DB.events.slice(0, 6);
    const totalTickets = DB.tickets.length;
    return `<div class="hero">
        <div class="hero-content">
            <div class="hero-badge"><i class="fas fa-bolt"></i> Made for Rwanda · Offline-Ready</div>
            <h1 class="hero-title">Tickets that work,<br><span>even offline.</span></h1>
            <p class="hero-desc">Buy with MoMo. Enter with QR or USSD. No internet at the gate? No problem. Rwanda's most reliable event ticketing platform.</p>
            <div class="hero-buttons">
                <button class="btn btn-primary" onclick="window.location.hash='events'; render();"><i class="fas fa-ticket-alt"></i> Browse Events</button>
                <button class="btn btn-outline" onclick="window.location.hash='register'; render();"><i class="fas fa-user-plus"></i> Create Account</button>
            </div>
            <div class="hero-stats">
                <div class="hero-stat"><div class="hero-stat-value">${totalTickets}+</div><div class="hero-stat-label">Tickets Sold</div></div>
                <div class="hero-stat"><div class="hero-stat-value">${DB.events.length}</div><div class="hero-stat-label">Live Events</div></div>
                <div class="hero-stat"><div class="hero-stat-value">99%</div><div class="hero-stat-label">Gate Success</div></div>
            </div>
        </div>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;"><h2><i class="fas fa-star" style="color: var(--accent);"></i> Featured Events</h2><button class="btn btn-outline btn-sm" onclick="window.location.hash='events'; render();">View All 10 Events <i class="fas fa-arrow-right"></i></button></div>
    <div class="events-grid">${featuredEvents.map(e => renderEventCard(e)).join('')}</div>
    <div style="margin-top: 32px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div class="card card-hover" style="padding: 20px; text-align: center;"><i class="fas fa-mobile-alt" style="font-size: 32px; color: var(--accent); margin-bottom: 12px;"></i><h4>Works Offline</h4><p style="font-size: 12px; color: var(--text-muted);">Gate scanners work without internet</p></div>
        <div class="card card-hover" style="padding: 20px; text-align: center;"><i class="fas fa-phone-alt" style="font-size: 32px; color: var(--accent); margin-bottom: 12px;"></i><h4>USSD Support</h4><p style="font-size: 12px; color: var(--text-muted);">Dial *724# on any phone</p></div>
        <div class="card card-hover" style="padding: 20px; text-align: center;"><i class="fas fa-shield-virus" style="font-size: 32px; color: var(--accent); margin-bottom: 12px;"></i><h4>Anti-Fraud</h4><p style="font-size: 12px; color: var(--text-muted);">Codes change every 30 seconds</p></div>
    </div>`;
}

function renderEvents() {
    return `<div class="filter-bar"><div class="filter-group"><label class="label"><i class="fas fa-search"></i> Search</label><input type="text" id="searchInput" class="input" placeholder="Event name..." onkeyup="filterEvents()"></div><div class="filter-group"><label class="label"><i class="fas fa-map-marker-alt"></i> Location</label><select id="locationFilter" class="input" onchange="filterEvents()"><option value="">All Locations</option>${DB.locations.map(l => `<option value="${l.id}">${l.name}</option>`).join('')}</select></div><div class="filter-group"><label class="label">&nbsp;</label><button class="btn btn-outline btn-sm" onclick="resetFilters()" style="width:100%"><i class="fas fa-undo"></i> Reset</button></div></div>
    <div id="eventsContainer"><div class="events-grid">${DB.events.map(e => renderEventCard(e)).join('')}</div></div>`;
}

function filterEvents() {
    const search = document.getElementById('searchInput')?.value || '';
    const locationId = document.getElementById('locationFilter')?.value || '';
    let filtered = DB.events.filter(e => (!search || e.name.toLowerCase().includes(search.toLowerCase())) && (!locationId || e.locationId === locationId));
    document.getElementById('eventsContainer').innerHTML = `<div style="margin-bottom: 16px;"><span class="badge badge-info"><i class="fas fa-list"></i> ${filtered.length} events found</span></div><div class="events-grid">${filtered.map(e => renderEventCard(e)).join('')}</div>${filtered.length === 0 ? '<div class="card" style="text-align: center; padding: 48px;"><i class="fas fa-face-sad-tear" style="font-size: 48px;"></i><p>No events match.</p></div>' : ''}`;
}
function resetFilters() { document.getElementById('searchInput').value = ''; document.getElementById('locationFilter').value = ''; filterEvents(); }
function selectEvent(eventId) { const event = DB.events.find(e => e.id === eventId); if (!event) return; const tiers = []; if (event.tiers.regular) tiers.push('regular'); if (event.tiers.vip) tiers.push('vip'); if (event.tiers.vvip) tiers.push('vvip'); const modalHtml = `<div id="eventModal" class="modal" onclick="if(event.target===this) closeModal()"><div class="modal-content"><div style="display:flex;justify-content:space-between"><h3>${event.name}</h3><button class="btn btn-outline btn-sm" onclick="closeModal()"><i class="fas fa-times"></i></button></div><img src="${event.image}" style="width:100%;height:140px;object-fit:cover;border-radius:var(--radius-md);margin:16px 0"><div class="event-meta"><span><i class="fas fa-map-marker-alt"></i> ${getLocationName(event.locationId)}</span><span><i class="far fa-calendar"></i> ${event.date} at ${event.time}</span></div><label class="label">Select Ticket Type</label><div id="tierSelector">${tiers.map(t => `<div class="ticket-tier" data-tier="${t}" onclick="selectTier('${t}')"><div><div class="tier-name">${TIERS[t].name}</div><div style="font-size:10px;color:var(--text-muted)">${TIERS[t].benefits}</div></div><div class="tier-price">${(event.basePrice * TIERS[t].multiplier).toLocaleString()} RWF</div></div>`).join('')}</div><div style="margin-top:16px"><label class="label">Quantity</label><input type="number" id="ticketQty" min="1" max="10" value="1" class="input"></div><div style="margin-top:20px;display:flex;gap:12px"><button class="btn btn-primary" onclick="buyTickets('${event.id}')"><i class="fas fa-shopping-cart"></i> Buy Now</button><button class="btn btn-outline" onclick="closeModal()">Cancel</button></div><div id="purchaseResult"></div></div></div>`; document.body.insertAdjacentHTML('beforeend', modalHtml); window.selectedTier = tiers[0]; document.querySelector(`.ticket-tier[data-tier="${tiers[0]}"]`)?.classList.add('selected'); }
function selectTier(tier) { window.selectedTier = tier; document.querySelectorAll('.ticket-tier').forEach(el => el.classList.remove('selected')); document.querySelector(`.ticket-tier[data-tier="${tier}"]`)?.classList.add('selected'); }
function buyTickets(eventId) { if (!currentUser) { alert('Please login first'); closeModal(); window.location.hash = 'login'; render(); return; } const qty = parseInt(document.getElementById('ticketQty')?.value || 1); const result = purchaseTicket(eventId, window.selectedTier, qty); const resultDiv = document.getElementById('purchaseResult'); if (result.success) { resultDiv.innerHTML = `<div class="badge badge-success" style="padding:12px;display:block;text-align:center"><i class="fas fa-check-circle"></i> Purchased ${qty} ticket(s)! Total: ${result.total.toLocaleString()} RWF</div>`; setTimeout(() => { closeModal(); render(); window.location.hash = 'wallet'; }, 1500); } else { resultDiv.innerHTML = `<div class="badge badge-danger" style="padding:12px;display:block">${result.msg}</div>`; } }
function renderWallet() { if (!currentUser) return `<div class="card" style="text-align:center;padding:48px"><i class="fas fa-lock" style="font-size:48px"></i><p>Please login</p><button class="btn btn-primary" onclick="window.location.hash='login';render()">Login</button></div>`; const tickets = getUserTickets(); if (tickets.length === 0) return `<div class="card" style="text-align:center;padding:48px"><i class="fas fa-ticket-alt" style="font-size:48px;opacity:0.3"></i><p>No tickets yet.</p><button class="btn btn-primary" onclick="window.location.hash='events';render()">Browse Events</button></div>`; return `<h2><i class="fas fa-ticket-alt"></i> My Tickets (${tickets.length})</h2>${tickets.map(t => `<div class="ticket-item"><div style="flex:1"><div style="font-weight:700">${t.eventName}</div><div style="font-size:12px;color:var(--text-secondary)"><i class="fas fa-map-marker-alt"></i> ${t.location} | ${t.eventDate}</div><div style="font-size:12px;margin-top:4px"><span class="badge badge-warning">${t.tierName}</span><span> Attendee: ${t.attendeeName}</span></div></div><div><button class="btn btn-outline btn-sm" onclick="showQR('${t.id}')"><i class="fas fa-qrcode"></i> QR</button></div></div>`).join('')}`; }
function showQR() { const code = Math.floor(Math.random()*1000000).toString().padStart(6,'0'); alert(`🎫 Entry Code: ${code}\nShow this at the gate.\nValid for 30 seconds.`); }
function renderLogin() { return `<div class="register-container"><div class="card" style="padding:32px"><h2 style="text-align:center;margin-bottom:24px"><i class="fas fa-sign-in-alt"></i> Welcome Back</h2><label class="label">Phone or Email</label><input id="loginIdentifier" class="input" placeholder="+250788123456" style="margin-bottom:16px"><label class="label">Password</label><input id="loginPassword" type="password" class="input" placeholder="Password" style="margin-bottom:24px"><button class="btn btn-primary" style="width:100%" onclick="doLogin()"><i class="fas fa-arrow-right"></i> Login</button><div style="margin-top:20px;text-align:center"><span style="color:var(--text-muted)">New here?</span> <a onclick="window.location.hash='register';render()" style="color:var(--accent);cursor:pointer">Create Account</a></div><div style="margin-top:20px;text-align:center;font-size:11px;color:var(--text-muted)"><p>Demo: +250788123456 / pass123</p></div></div></div>`; }
function renderRegister() { return `<div class="register-container"><div class="card" style="padding:32px"><h2 style="text-align:center;margin-bottom:24px"><i class="fas fa-user-plus"></i> Create Account</h2><label class="label">Full Name</label><input id="regName" class="input" placeholder="Your name" style="margin-bottom:16px"><label class="label">Phone Number</label><input id="regPhone" class="input" placeholder="+250 7XX XXX XXX" style="margin-bottom:16px"><label class="label">Email</label><input id="regEmail" class="input" placeholder="you@example.com" style="margin-bottom:16px"><label class="label">Password</label><input id="regPassword" type="password" class="input" placeholder="Create password" style="margin-bottom:24px"><button class="btn btn-primary" style="width:100%" onclick="doRegister()"><i class="fas fa-check-circle"></i> Sign Up</button><div style="margin-top:20px;text-align:center"><span style="color:var(--text-muted)">Already have an account?</span> <a onclick="window.location.hash='login';render()" style="color:var(--accent);cursor:pointer">Login</a></div></div></div>`; }
function doLogin() { const identifier = document.getElementById('loginIdentifier')?.value; const password = document.getElementById('loginPassword')?.value; if (login(identifier, password)) { render(); window.location.hash = 'home'; } else { alert('Invalid credentials'); } }
function doRegister() { const name = document.getElementById('regName')?.value; const phone = document.getElementById('regPhone')?.value; const email = document.getElementById('regEmail')?.value; const password = document.getElementById('regPassword')?.value; if (!name || !phone || !password) { alert('Please fill all fields'); return; } if (register(name, phone, email, password)) { render(); window.location.hash = 'home'; } else { alert('Phone or email already exists'); } }
function closeModal() { document.querySelectorAll('.modal').forEach(m => m.remove()); }
function logoutAction() { logout(); }
function renderSidebar() { const isLoggedIn = !!currentUser; const role = currentUser?.role || 'guest'; let navGroups = [{ title: "MAIN", items: [{ icon: "fas fa-home", label: "Home", page: "home", show: true }, { icon: "fas fa-calendar-alt", label: "Events", page: "events", show: true }] }]; if (!isLoggedIn) { navGroups[0].items.push({ icon: "fas fa-sign-in-alt", label: "Login", page: "login", show: true }); } else { navGroups.push({ title: "MY TICKETS", items: [{ icon: "fas fa-ticket-alt", label: "My Tickets", page: "wallet", show: true }] }); if (role === 'admin') navGroups.push({ title: "ADMIN", items: [{ icon: "fas fa-chart-line", label: "Dashboard", page: "admin", show: true }] }); } const navHtml = navGroups.map(group => `<div class="nav-group"><div class="nav-group-title">${group.title}</div>${group.items.filter(i => i.show).map(item => `<div class="nav-item" data-page="${item.page}" onclick="window.location.hash='${item.page}'; render();"><i class="${item.icon}"></i><span>${item.label}</span></div>`).join('')}</div>`).join(''); document.getElementById('sidebarNav').innerHTML = navHtml; const userHtml = currentUser ? `<div style="margin-bottom:10px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span style="font-size:24px">${currentUser.avatar || '👤'}</span><div><strong>${currentUser.name}</strong><br><span style="font-size:11px;color:var(--text-muted);text-transform:capitalize">${currentUser.role}</span></div></div></div><button class="btn btn-outline btn-sm" style="width:100%" onclick="logoutAction()"><i class="fas fa-sign-out-alt"></i> Logout</button>` : `<div style="margin-bottom:10px;color:var(--text-muted);text-align:center"><i class="fas fa-user"></i> Not logged in</div><button class="btn btn-primary btn-sm" style="width:100%" onclick="window.location.hash='login';render()"><i class="fas fa-sign-in-alt"></i> Login</button>`; document.getElementById('userSection').innerHTML = userHtml; }
function renderAdmin() { if (!currentUser || currentUser.role !== 'admin') return `<div class="card"><i class="fas fa-lock"></i> Admin only</div>`; const stats = { events: DB.events.length, tickets: DB.tickets.length, revenue: DB.tickets.reduce((s,t)=>s+t.price,0) }; return `<h2>Admin</h2><div class="stats-row"><div class="stat-box"><div class="stat-box-value">${stats.events}</div><div class="stat-box-label">Events</div></div><div class="stat-box"><div class="stat-box-value">${stats.tickets}</div><div class="stat-box-label">Tickets</div></div><div class="stat-box"><div class="stat-box-value">${stats.revenue.toLocaleString()} RWF</div><div class="stat-box-label">Revenue</div></div></div><h3>All ${DB.events.length} Events</h3><div class="events-grid">${DB.events.map(e => `<div class="card" style="padding:16px"><img src="${e.image}" style="width:100%;height:100px;object-fit:cover;border-radius:var(--radius-md);margin-bottom:12px"><h4>${e.name}</h4><div style="font-size:12px;color:var(--text-muted)">${e.category} · ${e.date}</div><button class="btn btn-danger btn-sm" style="width:100%;margin-top:12px" onclick="if(confirm('Delete?')){DB.events=DB.events.filter(ev=>ev.id!='${e.id}');saveDB();render();}"><i class="fas fa-trash"></i> Delete</button></div>`).join('')}</div>`; }

function render() { getSession(); renderSidebar(); const hash = window.location.hash.slice(1) || 'home'; const pages = { home: renderHome, events: renderEvents, wallet: renderWallet, admin: renderAdmin, login: renderLogin, register: renderRegister }; const content = pages[hash] ? pages[hash]() : renderHome(); document.getElementById('mainContent').innerHTML = content; document.querySelectorAll('.nav-item').forEach(el => { if (el.dataset.page === hash) el.classList.add('active'); else el.classList.remove('active'); }); }

window.filterEvents = filterEvents; window.resetFilters = resetFilters; window.selectEvent = selectEvent; window.selectTier = selectTier; window.buyTickets = buyTickets; window.doLogin = doLogin; window.doRegister = doRegister; window.showQR = showQR; window.closeModal = closeModal; window.logoutAction = logoutAction;

initDB(); getSession(); render(); window.addEventListener('hashchange', () => render());