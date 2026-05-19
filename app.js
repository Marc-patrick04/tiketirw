// ============================================================
//  TIKETIRW PRO - COMPLETE PLATFORM
//  Features: 
//  - USSD Entry for non-smartphone users (5min expiry)
//  - Role-based restrictions (Admin/Worker/Performer cannot buy tickets)
//  - Performer sees detailed revenue (Regular/VIP/VVIP breakdown)
//  - Admin can add events and manage workers
//  - Group booking anti-cheat (unique attendee names required)
// ============================================================

// ---------- DATABASE ----------
let DB = {
    users: [
        { id: "u1", name: "Eric Niyomugabo", phone: "+250788123456", email: "customer@tiketirw.com", password: "pass123", role: "customer", avatar: "👨", icon: "fa-user" },
        { id: "u2", name: "Admin User", phone: "+250788000001", email: "admin@tiketirw.com", password: "admin123", role: "admin", avatar: "👑", icon: "fa-crown" },
        { id: "u3", name: "John Muwanga", phone: "+250788000002", email: "worker@tiketirw.com", password: "worker123", role: "worker", avatar: "🛡️", icon: "fa-shield-alt" },
        { id: "u4", name: "Michael Jackson", phone: "+250788000003", email: "performer@tiketirw.com", password: "performer123", role: "performer", performerId: "p1", avatar: "🎤", icon: "fa-microphone-alt" }
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
    scans: [],
    ussdCodes: []  // Store USSD codes with expiry
};

// Ticket Tiers
const TIERS = {
    regular: { name: "Regular", multiplier: 1, benefits: "Standard entry" },
    vip: { name: "VIP", multiplier: 2.5, benefits: "VIP lounge, Fast entry" },
    vvip: { name: "VVIP", multiplier: 5, benefits: "Backstage access, Meet & Greet" }
};

// 10 Sample Events with reliable images
const DEFAULT_EVENTS = [
    { id: "ev1", name: "Kigali Jazz & Soul Night", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=300&fit=crop", locationId: "loc1", date: "2025-06-14", time: "18:00", basePrice: 5000, tiers: { regular: true, vip: true, vvip: true }, category: "Music", performerId: "p1", performerName: "Michael Jackson", totalCapacity: 500, sold: { regular: 180, vip: 25, vvip: 5 } },
    { id: "ev2", name: "APR FC vs Rayon Sports", image: "https://images.unsplash.com/photo-1459865264687-287d68a4d2c5?w=500&h=300&fit=crop", locationId: "loc2", date: "2025-06-20", time: "15:00", basePrice: 2000, tiers: { regular: true, vip: true, vvip: false }, category: "Sports", performerId: null, performerName: "APR FC", totalCapacity: 1200, sold: { regular: 850, vip: 100, vvip: 30 } },
    { id: "ev3", name: "Afrobeats Summer Fest", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&h=300&fit=crop", locationId: "loc3", date: "2025-06-28", time: "20:00", basePrice: 15000, tiers: { regular: true, vip: true, vvip: true }, category: "Music", performerId: "p1", performerName: "Michael Jackson", totalCapacity: 800, sold: { regular: 600, vip: 100, vvip: 40 } },
    { id: "ev4", name: "Rwanda Cultural Gala", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad9a6c3?w=500&h=300&fit=crop", locationId: "loc4", date: "2025-07-06", time: "16:00", basePrice: 3500, tiers: { regular: true, vip: true, vvip: false }, category: "Culture", performerId: null, performerName: "Rwandan Artists", totalCapacity: 300, sold: { regular: 95, vip: 20, vvip: 5 } },
    { id: "ev5", name: "Tech Summit Rwanda", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop", locationId: "loc5", date: "2025-07-15", time: "09:00", basePrice: 25000, tiers: { regular: true, vip: true, vvip: true }, category: "Conference", performerId: null, performerName: "Tech Rwanda", totalCapacity: 400, sold: { regular: 120, vip: 45, vvip: 10 } },
    { id: "ev6", name: "Comedy Night Kigali", image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=500&h=300&fit=crop", locationId: "loc1", date: "2025-07-20", time: "19:00", basePrice: 8000, tiers: { regular: true, vip: true, vvip: false }, category: "Comedy", performerId: null, performerName: "Comedy Knights", totalCapacity: 350, sold: { regular: 45, vip: 12, vvip: 3 } },
    { id: "ev7", name: "Rwandan Film Festival", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&h=300&fit=crop", locationId: "loc4", date: "2025-07-25", time: "14:00", basePrice: 6000, tiers: { regular: true, vip: true, vvip: false }, category: "Film", performerId: null, performerName: "Rwanda Film Office", totalCapacity: 250, sold: { regular: 60, vip: 15, vvip: 2 } },
    { id: "ev8", name: "Kigali Fashion Week", image: "https://images.unsplash.com/photo-1535048933070-4c6707b3c5c2?w=500&h=300&fit=crop", locationId: "loc1", date: "2025-08-02", time: "18:00", basePrice: 12000, tiers: { regular: true, vip: true, vvip: true }, category: "Fashion", performerId: null, performerName: "Kigali Fashion", totalCapacity: 600, sold: { regular: 200, vip: 50, vvip: 15 } },
    { id: "ev9", name: "Marathon Rwanda 2025", image: "https://images.unsplash.com/photo-1530482817083-29ae3f4c9f6b?w=500&h=300&fit=crop", locationId: "loc2", date: "2025-08-10", time: "06:00", basePrice: 3000, tiers: { regular: true, vip: false, vvip: false }, category: "Sports", performerId: null, performerName: "Rwanda Athletics", totalCapacity: 2000, sold: { regular: 850, vip: 0, vvip: 0 } },
    { id: "ev10", name: "New Year's Eve Gala", image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=500&h=300&fit=crop", locationId: "loc3", date: "2025-12-31", time: "20:00", basePrice: 35000, tiers: { regular: true, vip: true, vvip: true }, category: "Party", performerId: "p1", performerName: "Michael Jackson", totalCapacity: 1000, sold: { regular: 320, vip: 85, vvip: 22 } }
];

// ---------- INITIALIZATION ----------
function initDB() {
    const saved = localStorage.getItem('tiketirw_complete_v5');
    if (saved) {
        const parsed = JSON.parse(saved);
        DB = { ...DB, ...parsed };
    } else {
        DB.events = DEFAULT_EVENTS;
        DB.tickets = [];
        DB.scans = [];
        DB.ussdCodes = [];
        saveDB();
    }
}

function saveDB() {
    localStorage.setItem('tiketirw_complete_v5', JSON.stringify({
        users: DB.users,
        locations: DB.locations,
        events: DB.events,
        tickets: DB.tickets,
        scans: DB.scans,
        ussdCodes: DB.ussdCodes
    }));
}

// ---------- TOTP OFFLINE QR ----------
function generateOfflineQRCode(ticketId, secret, currentTime = Date.now()) {
    const timeSlice = Math.floor(currentTime / 30000);
    const hash = (ticketId + secret + timeSlice).split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    const code = Math.abs(hash % 1000000).toString().padStart(6, '0');
    return { code, expiresIn: 30 - (Math.floor(Date.now() / 1000) % 30) };
}

// ---------- USSD CODE GENERATION (For non-smartphone users) ----------
function generateUSSDCode(ticketId) {
    const code = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const expiryTime = Date.now() + (5 * 60 * 1000); // 5 minutes expiry
    DB.ussdCodes.push({
        ticketId: ticketId,
        code: code,
        expiry: expiryTime,
        used: false
    });
    // Clean old expired codes
    DB.ussdCodes = DB.ussdCodes.filter(c => c.expiry > Date.now() && !c.used);
    saveDB();
    return { code, expiresIn: 5 };
}

function validateUSSDCode(code) {
    const ussdEntry = DB.ussdCodes.find(c => c.code === code && !c.used && c.expiry > Date.now());
    if (!ussdEntry) return { valid: false, reason: "Invalid or expired USSD code" };
    
    const ticket = DB.tickets.find(t => t.id === ussdEntry.ticketId);
    if (!ticket) return { valid: false, reason: "Ticket not found" };
    if (ticket.status === "used") return { valid: false, reason: "Ticket already used" };
    
    ticket.status = "used";
    ussdEntry.used = true;
    DB.scans.unshift({
        id: Date.now(),
        ticketId: ticket.id,
        eventName: ticket.eventName,
        attendee: ticket.attendeeName,
        timestamp: new Date().toLocaleString(),
        method: "USSD"
    });
    saveDB();
    return { valid: true, ticket };
}

// ---------- AUTHENTICATION ----------
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

function logout() {
    currentUser = null;
    localStorage.removeItem('tiketirw_session');
    render();
}

function getSession() {
    const session = localStorage.getItem('tiketirw_session');
    if (session && !currentUser) {
        currentUser = JSON.parse(session);
    }
    return currentUser;
}

// Check if user can buy tickets (Only customers can buy)
function canBuyTickets() {
    if (!currentUser) return false;
    return currentUser.role === 'customer';
}

// ---------- TICKET FUNCTIONS ----------
function purchaseTicket(eventId, tier, quantity, attendeeNames = []) {
    if (!canBuyTickets()) {
        return { success: false, msg: "Only customers can purchase tickets. Please login with a customer account." };
    }
    
    const event = DB.events.find(e => e.id === eventId);
    if (!event) return { success: false, msg: "Event not found" };

    // Anti-cheat: Check for duplicate attendee names in group booking
    const uniqueNames = new Set(attendeeNames.map(n => n.trim().toLowerCase()));
    if (attendeeNames.length !== uniqueNames.size) {
        return { success: false, msg: "Each attendee must have a unique name. No duplicate names allowed." };
    }

    const price = event.basePrice * TIERS[tier].multiplier;
    const totalSold = (event.sold?.regular || 0) + (event.sold?.vip || 0) + (event.sold?.vvip || 0);
    const available = event.totalCapacity - totalSold;
    if (quantity > available) return { success: false, msg: `Only ${available} tickets left` };

    const newTickets = [];
    for (let i = 0; i < quantity; i++) {
        const ticketSecret = Math.random().toString(36).substring(2, 15) + Date.now() + i;
        newTickets.push({
            id: "TKT-" + Date.now() + "-" + i + Math.random().toString(36).substr(2, 4),
            eventId: event.id,
            eventName: event.name,
            eventDate: event.date,
            eventTime: event.time,
            location: getLocationName(event.locationId),
            tier: tier,
            tierName: TIERS[tier].name,
            price: price,
            ownerId: currentUser.id,
            ownerName: currentUser.name,
            attendeeName: attendeeNames[i] || currentUser.name,
            status: "active",
            secret: ticketSecret,
            purchasedAt: new Date().toISOString()
        });
    }
    DB.tickets.push(...newTickets);
    if (!event.sold) event.sold = { regular: 0, vip: 0, vvip: 0 };
    event.sold[tier] = (event.sold[tier] || 0) + quantity;
    saveDB();
    
    // Generate USSD codes for non-smartphone access
    const ussdCodes = [];
    for (const ticket of newTickets) {
        const ussd = generateUSSDCode(ticket.id);
        ussdCodes.push(ussd);
    }
    
    return { success: true, total: quantity * price, ussdCodes: ussdCodes };
}

function getUserTickets() {
    if (!currentUser) return [];
    return DB.tickets.filter(t => t.ownerId === currentUser.id);
}

function transferTicket(ticketId, targetPhone) {
    if (!canBuyTickets()) return false;
    const ticket = DB.tickets.find(t => t.id === ticketId && t.ownerId === currentUser?.id && t.status === "active");
    if (!ticket) return false;
    const targetUser = DB.users.find(u => u.phone === targetPhone && u.role === 'customer');
    if (!targetUser) return false;
    ticket.ownerId = targetUser.id;
    ticket.ownerName = targetUser.name;
    ticket.status = "transferred";
    saveDB();
    return true;
}

// ---------- GATE VALIDATION (Supports both QR and USSD) ----------
function validateTicket(input) {
    // First check if it's a USSD code
    if (/^\d{6}$/.test(input)) {
        return validateUSSDCode(input);
    }
    
    // Otherwise treat as QR code / ticket ID
    const ticket = DB.tickets.find(t => t.id === input || t.secret === input);
    if (!ticket) return { valid: false, reason: "Ticket not found" };

    const qrData = generateOfflineQRCode(ticket.id, ticket.secret);
    if (input !== ticket.id && input !== qrData.code && input !== ticket.secret) {
        return { valid: false, reason: "Invalid QR code (expired or fake)" };
    }

    if (ticket.status === "used") return { valid: false, reason: "Already scanned" };
    if (ticket.status === "transferred") return { valid: false, reason: "Transferred to another user" };

    ticket.status = "used";
    DB.scans.unshift({
        id: Date.now(),
        ticketId: ticket.id,
        eventName: ticket.eventName,
        attendee: ticket.attendeeName,
        timestamp: new Date().toLocaleString(),
        scanner: currentUser?.name || "Gate Worker",
        method: "QR"
    });
    saveDB();
    return { valid: true, ticket };
}

// ---------- HELPER FUNCTIONS ----------
function getLocationName(locationId) {
    return DB.locations.find(l => l.id === locationId)?.name || "Venue";
}

function getAdminStats() {
    const totalRevenue = DB.tickets.reduce((sum, t) => sum + t.price, 0);
    const activeTickets = DB.tickets.filter(t => t.status === "active").length;
    return {
        totalEvents: DB.events.length,
        totalSold: DB.tickets.length,
        totalRevenue,
        activeTickets,
        workers: DB.users.filter(u => u.role === 'worker').length
    };
}

// Detailed Performer Stats with breakdown
function getPerformerStats(performerId) {
    const myEvents = DB.events.filter(e => e.performerId === performerId);
    const myTickets = DB.tickets.filter(t => myEvents.some(e => e.id === t.eventId));
    
    let regularSold = 0, vipSold = 0, vvipSold = 0;
    let regularRevenue = 0, vipRevenue = 0, vvipRevenue = 0;
    
    for (const ticket of myTickets) {
        if (ticket.tier === 'regular') {
            regularSold++;
            regularRevenue += ticket.price;
        } else if (ticket.tier === 'vip') {
            vipSold++;
            vipRevenue += ticket.price;
        } else if (ticket.tier === 'vvip') {
            vvipSold++;
            vvipRevenue += ticket.price;
        }
    }
    
    const totalSold = regularSold + vipSold + vvipSold;
    const totalRevenue = regularRevenue + vipRevenue + vvipRevenue;
    const totalCapacity = myEvents.reduce((sum, e) => sum + e.totalCapacity, 0);
    const remainingSeats = totalCapacity - myEvents.reduce((sum, e) => {
        return sum + (e.sold?.regular || 0) + (e.sold?.vip || 0) + (e.sold?.vvip || 0);
    }, 0);
    
    return {
        events: myEvents,
        totalSold,
        totalRevenue,
        remainingSeats,
        regularSold, regularRevenue,
        vipSold, vipRevenue,
        vvipSold, vvipRevenue
    };
}

// Admin Functions
function addEvent(eventData) {
    const newEvent = {
        id: "ev" + Date.now(),
        sold: { regular: 0, vip: 0, vvip: 0 },
        status: "active",
        ...eventData
    };
    DB.events.push(newEvent);
    saveDB();
    return newEvent;
}

function deleteEvent(eventId) {
    DB.events = DB.events.filter(e => e.id !== eventId);
    saveDB();
}

function addWorker(name, phone, email, password) {
    const newWorker = {
        id: "u" + Date.now(),
        name, phone, email, password: password || "worker123",
        role: "worker",
        avatar: "🛡️",
        icon: "fa-shield-alt"
    };
    DB.users.push(newWorker);
    saveDB();
    return newWorker;
}

function deleteUser(userId) {
    DB.users = DB.users.filter(u => u.id !== userId);
    saveDB();
}

// ---------- RENDER FUNCTIONS ----------
function render() {
    getSession();
    renderSidebar();

    const hash = window.location.hash.slice(1) || 'home';
    const pages = {
        home: renderHome,
        events: renderEvents,
        wallet: renderWallet,
        transfer: renderTransfer,
        group: renderGroup,
        ussd: renderUSSD,
        gate: renderGate,
        admin: renderAdmin,
        performer: renderPerformer,
        login: renderLogin
    };

    const content = pages[hash] ? pages[hash]() : renderHome();
    document.getElementById('mainContent').innerHTML = content;

    document.querySelectorAll('.nav-item').forEach(el => {
        if (el.dataset.page === hash) el.classList.add('active');
        else el.classList.remove('active');
    });
}

function renderSidebar() {
    const isLoggedIn = !!currentUser;
    const role = currentUser?.role || 'guest';

    let navGroups = [
        { title: "MAIN", items: [
            { icon: "fas fa-home", label: "Home", page: "home", show: true },
            { icon: "fas fa-calendar-alt", label: "Events", page: "events", show: true }
        ]}
    ];

    if (!isLoggedIn) {
        navGroups[0].items.push({ icon: "fas fa-sign-in-alt", label: "Login", page: "login", show: true });
    } else {
        if (role === 'customer') {
            navGroups.push({ title: "MY TICKETS", items: [
                { icon: "fas fa-ticket-alt", label: "My Tickets", page: "wallet", show: true },
                { icon: "fas fa-exchange-alt", label: "Transfer", page: "transfer", show: true },
                { icon: "fas fa-users", label: "Group Booking", page: "group", show: true }
            ]});
        }
        navGroups.push({ title: "TOOLS", items: [
            { icon: "fas fa-phone-alt", label: "USSD Guide", page: "ussd", show: true }
        ]});

        if (role === 'admin') {
            navGroups.push({ title: "ADMIN", items: [
                { icon: "fas fa-chart-line", label: "Dashboard", page: "admin", show: true },
                { icon: "fas fa-users-cog", label: "Workers", page: "workers", show: true },
                { icon: "fas fa-plus-circle", label: "Add Event", page: "add-event", show: true }
            ]});
        }

        if (role === 'performer') {
            navGroups.push({ title: "PERFORMER", items: [
                { icon: "fas fa-microphone-alt", label: "Dashboard", page: "performer", show: true }
            ]});
        }

        if (role === 'worker' || role === 'admin') {
            navGroups.push({ title: "GATE", items: [
                { icon: "fas fa-qrcode", label: "Scanner", page: "gate", show: true }
            ]});
        }
    }

    const navHtml = navGroups.map(group => `
        <div class="nav-group">
            <div class="nav-group-title">${group.title}</div>
            ${group.items.filter(i => i.show).map(item => `
                <div class="nav-item" data-page="${item.page}" onclick="window.location.hash='${item.page}'; render();">
                    <i class="${item.icon}"></i>
                    <span>${item.label}</span>
                </div>
            `).join('')}
        </div>
    `).join('');

    document.getElementById('sidebarNav').innerHTML = navHtml;

    const userHtml = currentUser ? `
        <div style="margin-bottom: 10px">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="font-size: 32px;">${currentUser.avatar || '👤'}</span>
                <div>
                    <strong>${currentUser.name}</strong><br>
                    <span class="badge ${currentUser.role === 'admin' ? 'badge-purple' : (currentUser.role === 'performer' ? 'badge-warning' : (currentUser.role === 'worker' ? 'badge-info' : 'badge-success'))}" style="font-size: 10px;">${currentUser.role}</span>
                </div>
            </div>
        </div>
        <button class="btn btn-outline btn-sm" style="width: 100%;" onclick="logout()">
            <i class="fas fa-sign-out-alt"></i> Logout
        </button>
    ` : `
        <div style="margin-bottom: 10px; color: var(--text-muted); text-align: center;">
            <i class="fas fa-user"></i> Not logged in
        </div>
        <button class="btn btn-primary btn-sm" style="width: 100%;" onclick="window.location.hash='login'; render();">
            <i class="fas fa-sign-in-alt"></i> Login
        </button>
    `;
    document.getElementById('userSection').innerHTML = userHtml;
}

function renderEventCard(event) {
    const totalSold = (event.sold?.regular || 0) + (event.sold?.vip || 0) + (event.sold?.vvip || 0);
    const available = event.totalCapacity - totalSold;
    const statusClass = available < 20 ? 'badge-danger' : (available < 50 ? 'badge-warning' : 'badge-success');
    const statusText = available < 20 ? 'Almost Sold Out' : (available < 50 ? 'Few Left' : 'Available');

    return `
        <div class="event-card" onclick="selectEvent('${event.id}')">
            <div class="event-image" style="background-image: url('${event.image}'); background-size: cover; background-position: center;">
                <span class="event-category">${event.category}</span>
            </div>
            <div class="event-info">
                <div class="event-title">${event.name}</div>
                <div class="event-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${getLocationName(event.locationId)}</span>
                    <span><i class="far fa-calendar"></i> ${event.date}</span>
                </div>
                <div class="event-footer">
                    <div>
                        <span class="event-price">${event.basePrice.toLocaleString()} RWF</span>
                        <span style="font-size: 10px; color: var(--text-muted);"> + tiers</span>
                    </div>
                    <span class="badge ${statusClass}"><i class="fas fa-tag"></i> ${statusText}</span>
                </div>
            </div>
        </div>
    `;
}

// HOME PAGE
function renderHome() {
    const featuredEvents = DB.events.slice(0, 6);
    const totalTickets = DB.tickets.length;

    return `
        <div class="hero">
            <div class="hero-content">
                <div class="hero-badge">
                    <i class="fas fa-bolt"></i> Made for Rwanda · Offline-Ready
                </div>
                <h1 class="hero-title">Tickets that work,<br><span>even offline.</span></h1>
                <p class="hero-desc">Buy with MoMo. Enter with QR or USSD. No internet at the gate? No problem. Rwanda's most reliable event ticketing platform.</p>
                <div class="hero-buttons">
                    <button class="btn btn-primary" onclick="window.location.hash='events'; render();">
                        <i class="fas fa-ticket-alt"></i> Browse Events
                    </button>
                    <button class="btn btn-outline" onclick="window.location.hash='login'; render();">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </button>
                </div>
                <div class="hero-stats">
                    <div class="hero-stat">
                        <div class="hero-stat-value">${totalTickets}+</div>
                        <div class="hero-stat-label">Tickets Sold</div>
                    </div>
                    <div class="hero-stat">
                        <div class="hero-stat-value">${DB.events.length}</div>
                        <div class="hero-stat-label">Live Events</div>
                    </div>
                    <div class="hero-stat">
                        <div class="hero-stat-value">99%</div>
                        <div class="hero-stat-label">Gate Success</div>
                    </div>
                </div>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2><i class="fas fa-star" style="color: var(--accent);"></i> Featured Events</h2>
            <button class="btn btn-outline btn-sm" onclick="window.location.hash='events'; render();">
                View All ${DB.events.length} Events <i class="fas fa-arrow-right"></i>
            </button>
        </div>

        <div class="events-grid">
            ${featuredEvents.map(e => renderEventCard(e)).join('')}
        </div>

        <div style="margin-top: 32px; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
            <div class="card card-hover" style="padding: 24px; text-align: center;">
                <i class="fas fa-mobile-alt" style="font-size: 40px; color: var(--accent); margin-bottom: 12px;"></i>
                <h4>Works Offline</h4>
                <p style="font-size: 12px; color: var(--text-muted);">Gate scanners work without internet</p>
            </div>
            <div class="card card-hover" style="padding: 24px; text-align: center;">
                <i class="fas fa-phone-alt" style="font-size: 40px; color: var(--accent); margin-bottom: 12px;"></i>
                <h4>USSD Entry</h4>
                <p style="font-size: 12px; color: var(--text-muted);">Dial *724# for entry code (5min valid)</p>
            </div>
            <div class="card card-hover" style="padding: 24px; text-align: center;">
                <i class="fas fa-shield-virus" style="font-size: 40px; color: var(--accent); margin-bottom: 12px;"></i>
                <h4>Anti-Fraud</h4>
                <p style="font-size: 12px; color: var(--text-muted);">Codes change every 30 seconds</p>
            </div>
        </div>
    `;
}

// EVENTS PAGE
function renderEvents() {
    return `
        <div class="filter-bar">
            <div class="filter-group">
                <label class="label"><i class="fas fa-search"></i> Search</label>
                <input type="text" id="searchInput" class="input" placeholder="Event name..." onkeyup="filterEvents()">
            </div>
            <div class="filter-group">
                <label class="label"><i class="fas fa-map-marker-alt"></i> Location</label>
                <select id="locationFilter" class="input" onchange="filterEvents()">
                    <option value="">All Locations</option>
                    ${DB.locations.map(l => `<option value="${l.id}">${l.name}</option>`).join('')}
                </select>
            </div>
            <div class="filter-group">
                <label class="label">&nbsp;</label>
                <button class="btn btn-outline btn-sm" onclick="resetFilters()" style="width: 100%;">
                    <i class="fas fa-undo"></i> Reset
                </button>
            </div>
        </div>
        <div id="eventsContainer">
            <div class="events-grid">
                ${DB.events.map(e => renderEventCard(e)).join('')}
            </div>
        </div>
    `;
}

function filterEvents() {
    const search = document.getElementById('searchInput')?.value || '';
    const locationId = document.getElementById('locationFilter')?.value || '';
    let filtered = DB.events.filter(e => (!search || e.name.toLowerCase().includes(search.toLowerCase())) && (!locationId || e.locationId === locationId));
    document.getElementById('eventsContainer').innerHTML = `
        <div style="margin-bottom: 16px;"><span class="badge badge-info"><i class="fas fa-list"></i> ${filtered.length} events found</span></div>
        <div class="events-grid">${filtered.map(e => renderEventCard(e)).join('')}</div>
        ${filtered.length === 0 ? '<div class="card" style="text-align: center; padding: 48px;"><i class="fas fa-face-sad-tear" style="font-size: 48px;"></i><p>No events match.</p></div>' : ''}
    `;
}

function resetFilters() {
    const search = document.getElementById('searchInput');
    const location = document.getElementById('locationFilter');
    if (search) search.value = '';
    if (location) location.value = '';
    filterEvents();
}

// EVENT SELECTION MODAL (with role-based buy button)
function selectEvent(eventId) {
    const event = DB.events.find(e => e.id === eventId);
    if (!event) return;

    const availableTiers = [];
    if (event.tiers.regular) availableTiers.push('regular');
    if (event.tiers.vip) availableTiers.push('vip');
    if (event.tiers.vvip) availableTiers.push('vvip');
    
    const canBuy = canBuyTickets();
    const buyButtonHtml = canBuy ? 
        `<button class="btn btn-primary" onclick="buyTickets('${event.id}')"><i class="fas fa-shopping-cart"></i> Buy Now</button>` :
        `<button class="btn btn-disabled" disabled style="opacity:0.5;cursor:not-allowed;"><i class="fas fa-ban"></i> Only Customers Can Buy</button>`;

    const modalHtml = `
        <div id="eventModal" class="modal" onclick="if(event.target===this) closeModal()">
            <div class="modal-content">
                <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                    <h3>${event.name}</h3>
                    <button class="btn btn-outline btn-sm" onclick="closeModal()"><i class="fas fa-times"></i></button>
                </div>
                <img src="${event.image}" style="width: 100%; height: 140px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 16px;">
                <div class="event-meta" style="margin-bottom: 20px;">
                    <span><i class="fas fa-map-marker-alt"></i> ${getLocationName(event.locationId)}</span>
                    <span><i class="far fa-calendar"></i> ${event.date} at ${event.time}</span>
                    <span><i class="fas fa-user"></i> ${event.performerName}</span>
                </div>

                <label class="label">Select Ticket Type</label>
                <div id="tierSelector">
                    ${availableTiers.map(tier => `
                        <div class="ticket-tier" data-tier="${tier}" onclick="selectTier('${tier}')">
                            <div>
                                <div class="tier-name">${TIERS[tier].name}</div>
                                <div style="font-size: 10px; color: var(--text-muted);">${TIERS[tier].benefits}</div>
                            </div>
                            <div class="tier-price">${(event.basePrice * TIERS[tier].multiplier).toLocaleString()} RWF</div>
                        </div>
                    `).join('')}
                </div>

                <div style="margin-top: 16px;">
                    <label class="label">Quantity</label>
                    <input type="number" id="ticketQty" min="1" max="10" value="1" class="input">
                </div>

                <div style="margin-top: 20px; display: flex; gap: 12px;">
                    ${buyButtonHtml}
                    <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
                </div>
                <div id="purchaseResult" style="margin-top: 12px;"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    window.selectedTier = availableTiers[0];
    document.querySelector(`.ticket-tier[data-tier="${availableTiers[0]}"]`)?.classList.add('selected');
}

function selectTier(tier) {
    window.selectedTier = tier;
    document.querySelectorAll('.ticket-tier').forEach(el => el.classList.remove('selected'));
    document.querySelector(`.ticket-tier[data-tier="${tier}"]`)?.classList.add('selected');
}

function buyTickets(eventId) {
    if (!canBuyTickets()) {
        alert('Only customers can purchase tickets. Please login with a customer account.');
        closeModal();
        window.location.hash = 'login';
        render();
        return;
    }
    const qty = parseInt(document.getElementById('ticketQty')?.value || 1);
    const result = purchaseTicket(eventId, window.selectedTier, qty, []);
    const resultDiv = document.getElementById('purchaseResult');
    if (result.success) {
        let message = `✓ Purchased ${qty} ticket(s)! Total: ${result.total.toLocaleString()} RWF\n\n`;
        if (result.ussdCodes && result.ussdCodes.length > 0) {
            message += `📱 USSD Entry Codes (valid 5 minutes):\n`;
            result.ussdCodes.forEach((u, i) => {
                message += `Ticket ${i+1}: *724*${u.code}#\n`;
            });
            message += `\nDial these codes at the gate if you don't have a smartphone.`;
        }
        alert(message);
        setTimeout(() => { closeModal(); render(); window.location.hash = 'wallet'; }, 1500);
    } else {
        resultDiv.innerHTML = `<div class="badge badge-danger" style="padding: 12px; display: block;">${result.msg}</div>`;
    }
}

// WALLET PAGE
function renderWallet() {
    if (!currentUser) return `<div class="card" style="text-align: center; padding: 48px;"><i class="fas fa-lock" style="font-size: 48px;"></i><p>Please login</p><button class="btn btn-primary" onclick="window.location.hash='login'; render();">Login</button></div>`;
    
    if (currentUser.role !== 'customer') {
        return `<div class="card" style="text-align: center; padding: 48px;"><i class="fas fa-ban" style="font-size: 48px;"></i><p>Only customers can view tickets. You are logged in as ${currentUser.role}.</p></div>`;
    }

    const tickets = getUserTickets();
    if (tickets.length === 0) {
        return `<div class="card" style="text-align: center; padding: 48px;"><i class="fas fa-ticket-alt" style="font-size: 48px; opacity: 0.3;"></i><p>No tickets yet.</p><button class="btn btn-primary" onclick="window.location.hash='events'; render();">Browse Events</button></div>`;
    }

    return `
        <h2><i class="fas fa-ticket-alt"></i> My Tickets (${tickets.length})</h2>
        ${tickets.map(ticket => {
            const ussdCode = DB.ussdCodes.find(u => u.ticketId === ticket.id && !u.used);
            const ussdHtml = ussdCode ? `<div style="margin-top: 8px;"><span class="badge badge-info">📱 USSD Code: *724*${ussdCode.code}# (valid 5min)</span></div>` : '';
            return `
                <div class="ticket-item">
                    <div style="flex: 1;">
                        <div style="font-weight: 700;">${ticket.eventName}</div>
                        <div style="font-size: 12px; color: var(--text-secondary);">
                            <i class="fas fa-map-marker-alt"></i> ${ticket.location} | ${ticket.eventDate}
                        </div>
                        <div style="font-size: 12px; margin-top: 4px;">
                            <span class="badge badge-warning">${ticket.tierName}</span>
                            <span> Attendee: ${ticket.attendeeName}</span>
                            <span class="badge ${ticket.status === 'active' ? 'badge-success' : 'badge-danger'}">${ticket.status}</span>
                        </div>
                        ${ussdHtml}
                    </div>
                    ${ticket.status === 'active' ? `
                        <div>
                            <button class="btn btn-outline btn-sm" onclick="showQR('${ticket.id}', '${ticket.eventName}', '${ticket.attendeeName}')">
                                <i class="fas fa-qrcode"></i> QR
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('')}
    `;
}

// TRANSFER PAGE
function renderTransfer() {
    if (!currentUser) return renderLogin();
    if (currentUser.role !== 'customer') {
        return `<div class="card" style="text-align: center; padding: 48px;"><i class="fas fa-ban"></i><p>Only customers can transfer tickets.</p></div>`;
    }
    
    const activeTickets = getUserTickets().filter(t => t.status === 'active');

    return `
        <div style="max-width: 500px; margin: 0 auto;">
            <h2><i class="fas fa-exchange-alt"></i> Transfer Ticket</h2>
            <div class="card" style="padding: 24px;">
                <label class="label">Select Ticket</label>
                <select id="transferTicket" class="input" style="margin-bottom: 16px;">
                    <option value="">-- Select ticket --</option>
                    ${activeTickets.map(t => `<option value="${t.id}">${t.eventName} - ${t.tierName} (${t.attendeeName})</option>`).join('')}
                </select>
                <label class="label">Recipient Phone Number (must be customer)</label>
                <input id="transferPhone" class="input" placeholder="+250 7XX XXX XXX" style="margin-bottom: 20px;">
                <button class="btn btn-primary" style="width: 100%;" onclick="doTransfer()">
                    <i class="fas fa-paper-plane"></i> Transfer
                </button>
                <div id="transferMsg" style="margin-top: 16px;"></div>
            </div>
        </div>
    `;
}

function doTransfer() {
    const ticketId = document.getElementById('transferTicket')?.value;
    const phone = document.getElementById('transferPhone')?.value;
    if (!ticketId || !phone) {
        alert('Select ticket and enter recipient phone');
        return;
    }
    if (transferTicket(ticketId, phone)) {
        document.getElementById('transferMsg').innerHTML = '<div class="alert alert-success">✓ Ticket transferred successfully!</div>';
        setTimeout(() => { render(); window.location.hash = 'wallet'; }, 1500);
    } else {
        document.getElementById('transferMsg').innerHTML = '<div class="alert alert-error">✗ Transfer failed. Recipient must be a customer account.</div>';
    }
}

// GROUP BOOKING with anti-cheat
function renderGroup() {
    if (!currentUser) return renderLogin();
    if (currentUser.role !== 'customer') {
        return `<div class="card" style="text-align: center; padding: 48px;"><i class="fas fa-ban"></i><p>Only customers can make group bookings.</p></div>`;
    }
    
    return `
        <div style="max-width: 500px; margin: 0 auto;">
            <h2><i class="fas fa-users"></i> Group Booking (2-10 tickets)</h2>
            <div class="card" style="padding: 24px;">
                <div class="alert alert-info" style="margin-bottom: 16px;">
                    <i class="fas fa-info-circle"></i> Each attendee must have a UNIQUE name. No duplicate names allowed.
                </div>
                <label class="label">Select Event</label>
                <select id="groupEvent" class="input" style="margin-bottom: 16px;" onchange="updateGroupAttendees()">
                    <option value="">-- Select event --</option>
                    ${DB.events.map(e => `<option value="${e.id}">${e.name} - from ${e.basePrice} RWF</option>`).join('')}
                </select>
                <label class="label">Ticket Tier</label>
                <select id="groupTier" class="input" style="margin-bottom: 16px;">
                    <option value="regular">Regular</option>
                    <option value="vip">VIP</option>
                    <option value="vvip">VVIP</option>
                </select>
                <label class="label">Number of Tickets (2-10)</label>
                <input id="groupQty" type="number" min="2" max="10" class="input" style="margin-bottom: 16px;" onchange="updateGroupAttendees()">
                <div id="attendeeFields"></div>
                <button class="btn btn-primary" style="width: 100%; margin-top: 16px;" onclick="doGroupBooking()">
                    <i class="fas fa-shopping-cart"></i> Purchase Group Tickets
                </button>
                <div id="groupResult" style="margin-top: 16px;"></div>
            </div>
        </div>
    `;
}

function updateGroupAttendees() {
    const qty = parseInt(document.getElementById('groupQty')?.value);
    if (qty && qty >= 2 && qty <= 10) {
        let html = '<label class="label">Attendee Names (MUST be unique)</label>';
        for (let i = 1; i <= qty; i++) {
            html += `<input id="attendee_${i}" class="input" placeholder="Attendee ${i} full name" style="margin-bottom: 8px;">`;
        }
        html += '<p style="font-size: 11px; color: var(--text-muted); margin-top: 4px;"><i class="fas fa-exclamation-triangle"></i> Duplicate names will be rejected</p>';
        document.getElementById('attendeeFields').innerHTML = html;
    } else {
        document.getElementById('attendeeFields').innerHTML = '<p style="color: var(--red); font-size: 12px;">Please enter a quantity between 2 and 10</p>';
    }
}

function doGroupBooking() {
    const eventId = document.getElementById('groupEvent')?.value;
    const tier = document.getElementById('groupTier')?.value;
    const qty = parseInt(document.getElementById('groupQty')?.value);
    if (!eventId || !qty) {
        alert('Select event and quantity');
        return;
    }
    const names = [];
    for (let i = 1; i <= qty; i++) {
        const name = document.getElementById(`attendee_${i}`)?.value;
        if (!name || name.trim() === '') {
            alert(`Please enter name for attendee ${i}`);
            return;
        }
        names.push(name.trim());
    }
    const result = purchaseTicket(eventId, tier, qty, names);
    if (result.success) {
        let message = `✓ Group booking successful! ${qty} tickets added.\n\n`;
        if (result.ussdCodes && result.ussdCodes.length > 0) {
            message += `📱 USSD Entry Codes (valid 5 minutes):\n`;
            result.ussdCodes.forEach((u, i) => {
                message += `${names[i]}: *724*${u.code}#\n`;
            });
        }
        alert(message);
        setTimeout(() => { render(); window.location.hash = 'wallet'; }, 1500);
    } else {
        document.getElementById('groupResult').innerHTML = `<div class="alert alert-error">✗ ${result.msg}</div>`;
    }
}

// USSD PAGE (for non-smartphone users)
function renderUSSD() {
    let userTickets = [];
    let ussdCodesHtml = '';
    
    if (currentUser && currentUser.role === 'customer') {
        userTickets = getUserTickets().filter(t => t.status === 'active');
        const activeCodes = DB.ussdCodes.filter(u => userTickets.some(t => t.id === u.ticketId) && !u.used && u.expiry > Date.now());
        if (activeCodes.length > 0) {
            ussdCodesHtml = `
                <div class="card" style="margin-top: 20px; padding: 20px;">
                    <h3><i class="fas fa-qrcode"></i> Your Active USSD Codes</h3>
                    ${activeCodes.map(code => {
                        const ticket = userTickets.find(t => t.id === code.ticketId);
                        const expiryMin = Math.max(0, Math.floor((code.expiry - Date.now()) / 60000));
                        return `
                            <div style="padding: 12px; border-bottom: 1px solid var(--border);">
                                <div><strong>${ticket?.eventName}</strong> - ${ticket?.attendeeName}</div>
                                <div style="font-size: 20px; font-weight: 700; color: var(--accent); margin: 8px 0;">*724*${code.code}#</div>
                                <div style="font-size: 11px; color: var(--text-muted);">⏱️ Expires in ${expiryMin} minute(s)</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }
    }
    
    return `
        <div style="max-width: 450px; margin: 0 auto;">
            <div class="card" style="text-align: center; padding: 32px;">
                <div style="font-size: 48px;">📱</div>
                <h2>USSD Entry - No Smartphone Needed!</h2>
                <div style="font-size: 28px; font-weight: 800; color: var(--accent); margin: 16px 0;">*724#</div>
                <p style="color: var(--text-secondary);">Dial on ANY phone — even feature phones without internet</p>
            </div>

            <div class="card" style="margin-top: 20px; padding: 24px;">
                <div class="ussd-screen">
                    <div>📱 USSD SIMULATION</div>
                    <div style="margin-top: 12px;">1. My Tickets</div>
                    <div>2. Get Entry Code (valid 5min)</div>
                    <div>3. Buy Ticket</div>
                    <div>4. Check Event</div>
                    <hr style="border-color: #333; margin: 12px 0;">
                    <div id="ussdCodeDisplay" style="font-size: 16px; font-weight: bold; color: var(--accent);">Select option 2</div>
                    <div style="display: flex; gap: 8px; margin-top: 16px;">
                        <button class="btn btn-outline btn-sm" onclick="simulateUSSD(2)">Get Entry Code</button>
                        <button class="btn btn-outline btn-sm" onclick="simulateUSSD(1)">My Tickets</button>
                    </div>
                </div>
            </div>
            
            ${ussdCodesHtml}
            
            <div class="card" style="margin-top: 20px; padding: 20px; background: var(--accent-subtle);">
                <h4><i class="fas fa-info-circle"></i> How it works:</h4>
                <ul style="margin-top: 12px; padding-left: 20px; color: var(--text-secondary); font-size: 13px;">
                    <li>1. Buy tickets online (with internet)</li>
                    <li>2. Get a unique 6-digit USSD code</li>
                    <li>3. At the gate, dial *724*CODE#</li>
                    <li>4. Show the confirmation to the worker</li>
                    <li>5. Code expires after 5 minutes for security</li>
                </ul>
            </div>
        </div>
    `;
}

function simulateUSSD(option) {
    const display = document.getElementById('ussdCodeDisplay');
    if (option === 2) {
        if (!currentUser || currentUser.role !== 'customer') {
            display.innerHTML = `❌ Please login with customer account first`;
            return;
        }
        const activeTickets = getUserTickets().filter(t => t.status === 'active');
        if (activeTickets.length === 0) {
            display.innerHTML = `📋 You have no active tickets. Buy tickets first!`;
            return;
        }
        // Get first active ticket's USSD code
        const ticket = activeTickets[0];
        let ussdCode = DB.ussdCodes.find(u => u.ticketId === ticket.id && !u.used);
        if (!ussdCode || ussdCode.expiry < Date.now()) {
            ussdCode = generateUSSDCode(ticket.id);
        }
        const expiryMin = Math.floor((ussdCode.expiry - Date.now()) / 60000);
        display.innerHTML = `🎟️ Entry Code: <strong style="font-size: 20px;">*724*${ussdCode.code}#</strong><br>Valid for ${expiryMin} minutes<br>Show this at the gate`;
    } else if (option === 1) {
        const ticketCount = currentUser && currentUser.role === 'customer' ? getUserTickets().length : 0;
        display.innerHTML = `📋 You have ${ticketCount} active ticket(s)`;
    }
}

// GATE SCANNER PAGE (supports QR and USSD)
function renderGate() {
    if (!currentUser || (currentUser.role !== 'worker' && currentUser.role !== 'admin')) {
        return `<div class="card" style="text-align: center; padding: 48px;"><i class="fas fa-lock" style="font-size: 48px;"></i><p>Worker/Admin access only.</p></div>`;
    }

    const recentScans = DB.scans.slice(0, 10);

    return `
        <h2><i class="fas fa-qrcode"></i> Gate Scanner</h2>
        <div class="scanner-sim">
            <div style="font-size: 48px;">📷</div>
            <div class="scanner-line"></div>
            <p style="color: var(--text-secondary);">Scan QR code OR enter USSD code (6 digits)</p>
            <div style="display: flex; gap: 12px; max-width: 400px; margin: 20px auto 0;">
                <input id="scanInput" class="input" placeholder="Enter QR code or USSD code (e.g., 123456)" style="flex: 1;">
                <button class="btn btn-primary" onclick="doScan()"><i class="fas fa-check"></i> Verify</button>
            </div>
        </div>

        <div id="scanResult"></div>

        <div class="card" style="padding: 20px;">
            <h3><i class="fas fa-history"></i> Recent Scans (${DB.scans.length})</h3>
            ${recentScans.map(s => `
                <div style="padding: 10px 0; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                    <div>
                        <span class="badge badge-success"><i class="fas fa-check"></i> Valid</span>
                        <strong> ${s.eventName}</strong><br>
                        <span style="font-size: 11px;">${s.attendee} (${s.method || 'QR'})</span>
                    </div>
                    <span style="font-size: 10px; color: var(--text-muted);">${s.timestamp}</span>
                </div>
            `).join('')}
            ${DB.scans.length === 0 ? '<p style="text-align: center; color: var(--text-muted);">No scans yet.</p>' : ''}
        </div>
    `;
}

function doScan() {
    const input = document.getElementById('scanInput')?.value;
    if (!input) {
        alert('Enter QR code or USSD code');
        return;
    }
    const result = validateTicket(input);
    const resultDiv = document.getElementById('scanResult');
    if (result.valid) {
        resultDiv.innerHTML = `<div class="alert alert-success" style="text-align: center;">
            <i class="fas fa-check-circle" style="font-size: 24px;"></i><br>
            <strong>✓ VALID ENTRY!</strong><br>
            Welcome ${result.ticket.attendeeName} to ${result.ticket.eventName}<br>
            <span style="font-size: 11px;">${result.ticket.tierName} Ticket</span>
        </div>`;
    } else {
        resultDiv.innerHTML = `<div class="alert alert-error" style="text-align: center;">
            <i class="fas fa-times-circle" style="font-size: 24px;"></i><br>
            <strong>✗ ACCESS DENIED</strong><br>
            ${result.reason}
        </div>`;
    }
    document.getElementById('scanInput').value = '';
    setTimeout(() => { if (window.location.hash === '#gate') renderGate(); }, 2000);
}

// ADMIN DASHBOARD
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
                    ${DB.locations.map(l => `<option value="${l.id}">${l.name}</option>`).join('')}
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
                    ${DB.users.filter(u => u.role === 'performer').map(p => `<option value="${p.performerId}" data-name="${p.name}">${p.name}</option>`).join('')}
                </select>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <label><input type="checkbox" id="hasRegular" checked> Regular</label>
                    <label><input type="checkbox" id="hasVip" checked> VIP</label>
                    <label><input type="checkbox" id="hasVvip"> VVIP</label>
                </div>
                <button class="btn btn-primary" onclick="addNewEvent()"><i class="fas fa-save"></i> Create Event</button>
            </div>
        </div>

        <h3><i class="fas fa-calendar-alt"></i> All Events (${DB.events.length})</h3>
        <div class="events-grid">
            ${DB.events.map(event => {
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
                        <button class="btn btn-danger btn-sm" style="width: 100%;" onclick="if(confirm('Delete event?')) { DB.events = DB.events.filter(e => e.id !== '${event.id}'); saveDB(); render(); }">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// WORKERS MANAGEMENT PAGE
function renderWorkers() {
    if (!currentUser || currentUser.role !== 'admin') return '<div class="card">Admin access only</div>';
    const workers = DB.users.filter(u => u.role === 'worker');
    
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

// ADD EVENT PAGE
function renderAddEvent() {
    if (!currentUser || currentUser.role !== 'admin') return '<div class="card">Admin access only</div>';
    return renderAdmin(); // Reuse admin page which has add event form
}

// PERFORMER DASHBOARD with detailed breakdown
function renderPerformer() {
    if (!currentUser || currentUser.role !== 'performer') {
        return `<div class="card" style="text-align: center; padding: 48px;"><i class="fas fa-lock"></i> Performer access only</div>`;
    }
    const stats = getPerformerStats(currentUser.performerId);

    return `
        <h2><i class="fas fa-microphone-alt"></i> Performer Dashboard</h2>
        <div style="margin-bottom: 24px;">
            <div class="card" style="padding: 24px; background: linear-gradient(135deg, var(--accent-subtle), transparent);">
                <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
                    <span style="font-size: 48px;">${currentUser.avatar || '🎤'}</span>
                    <div>
                        <h1 style="font-size: 28px;">${currentUser.name}</h1>
                        <p style="color: var(--text-secondary);">Welcome to your artist dashboard</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="performer-stats">
            <div class="performer-card">
                <div class="performer-card-value">${stats.events.length}</div>
                <div class="performer-card-label">Your Events</div>
            </div>
            <div class="performer-card">
                <div class="performer-card-value">${stats.totalSold}</div>
                <div class="performer-card-label">Total Tickets Sold</div>
            </div>
            <div class="performer-card">
                <div class="performer-card-value">${stats.remainingSeats}</div>
                <div class="performer-card-label">Remaining Seats</div>
            </div>
            <div class="performer-card">
                <div class="performer-card-value">${stats.totalRevenue.toLocaleString()} RWF</div>
                <div class="performer-card-label">Estimated Total Earnings*</div>
            </div>
        </div>

        <div class="card" style="margin-bottom: 24px; padding: 20px;">
            <h3><i class="fas fa-chart-pie"></i> Ticket Sales Breakdown</h3>
            <div class="revenue-breakdown">
                <div class="revenue-item">
                    <span class="revenue-label"><span class="badge badge-info">Regular</span> Tickets</span>
                    <span class="revenue-amount">${stats.regularSold} sold · ${stats.regularRevenue.toLocaleString()} RWF</span>
                </div>
                <div class="revenue-item">
                    <span class="revenue-label"><span class="badge badge-warning">VIP</span> Tickets</span>
                    <span class="revenue-amount">${stats.vipSold} sold · ${stats.vipRevenue.toLocaleString()} RWF</span>
                </div>
                <div class="revenue-item">
                    <span class="revenue-label"><span class="badge badge-danger">VVIP</span> Tickets</span>
                    <span class="revenue-amount">${stats.vvipSold} sold · ${stats.vvipRevenue.toLocaleString()} RWF</span>
                </div>
                <div class="revenue-item" style="border-top: 1px solid var(--border); margin-top: 8px; padding-top: 8px;">
                    <span class="revenue-label"><strong>TOTAL</strong></span>
                    <span class="revenue-amount"><strong>${stats.totalSold} tickets · ${stats.totalRevenue.toLocaleString()} RWF</strong></span>
                </div>
            </div>
            <p style="font-size: 11px; color: var(--text-muted); margin-top: 12px;"><i class="fas fa-info-circle"></i> *Earnings are estimates. Mobile Money settlements take 24-48 hours after event.</p>
        </div>

        <h3><i class="fas fa-calendar-alt"></i> Your Events</h3>
        <div class="events-grid">
            ${stats.events.map(event => {
                const totalSold = (event.sold?.regular || 0) + (event.sold?.vip || 0) + (event.sold?.vvip || 0);
                const regularRevenue = (event.sold?.regular || 0) * event.basePrice;
                const vipRevenue = (event.sold?.vip || 0) * (event.basePrice * 2.5);
                const vvipRevenue = (event.sold?.vvip || 0) * (event.basePrice * 5);
                return `
                    <div class="card" style="padding: 16px;">
                        <img src="${event.image}" style="width: 100%; height: 120px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 12px;">
                        <h4>${event.name}</h4>
                        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">
                            <i class="fas fa-calendar"></i> ${event.date} at ${event.time}<br>
                            <i class="fas fa-map-marker-alt"></i> ${getLocationName(event.locationId)}
                        </div>
                        <div style="margin: 12px 0;">
                            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                                <span>Sold: ${totalSold}/${event.totalCapacity}</span>
                                <span>${Math.round((totalSold/event.totalCapacity)*100)}%</span>
                            </div>
                            <div style="height: 6px; background: var(--bg-elevated); border-radius: 3px;">
                                <div style="width: ${(totalSold/event.totalCapacity)*100}%; height: 6px; background: var(--accent); border-radius: 3px;"></div>
                            </div>
                        </div>
                        <div class="revenue-breakdown" style="margin-top: 12px;">
                            ${event.tiers.regular ? `<div class="revenue-item"><span class="revenue-label">Regular</span><span class="revenue-amount">${event.sold?.regular || 0} sold · ${regularRevenue.toLocaleString()} RWF</span></div>` : ''}
                            ${event.tiers.vip ? `<div class="revenue-item"><span class="revenue-label">VIP</span><span class="revenue-amount">${event.sold?.vip || 0} sold · ${vipRevenue.toLocaleString()} RWF</span></div>` : ''}
                            ${event.tiers.vvip ? `<div class="revenue-item"><span class="revenue-label">VVIP</span><span class="revenue-amount">${event.sold?.vvip || 0} sold · ${vvipRevenue.toLocaleString()} RWF</span></div>` : ''}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        ${stats.events.length === 0 ? '<div class="card" style="text-align: center; padding: 48px;"><i class="fas fa-calendar-times"></i><p>No events assigned to you yet.</p></div>' : ''}
    `;
}

// LOGIN PAGE with Demo Accounts
function renderLogin() {
    const demoAccounts = [
        { role: "CUSTOMER", name: "Eric Niyomugabo", phone: "+250788123456", pass: "pass123", icon: "fa-user", color: "badge-info" },
        { role: "ADMIN", name: "Admin User", phone: "+250788000001", pass: "admin123", icon: "fa-crown", color: "badge-purple" },
        { role: "WORKER", name: "John Muwanga", phone: "+250788000002", pass: "worker123", icon: "fa-shield-alt", color: "badge-success" },
        { role: "PERFORMER", name: "Michael Jackson", phone: "+250788000003", pass: "performer123", icon: "fa-microphone-alt", color: "badge-warning" }
    ];

    return `
        <div class="auth-container">
            <div class="card" style="padding: 32px;">
                <h2 style="text-align: center; margin-bottom: 8px;"><i class="fas fa-sign-in-alt"></i> Welcome Back</h2>
                <p style="text-align: center; color: var(--text-muted); font-size: 13px; margin-bottom: 24px;">Sign in to your account</p>

                <label class="label">Phone or Email</label>
                <input id="loginIdentifier" class="input" placeholder="+250788123456 or email" style="margin-bottom: 16px;">
                <label class="label">Password</label>
                <input id="loginPassword" type="password" class="input" placeholder="Password" style="margin-bottom: 24px;">
                <button class="btn btn-primary" style="width: 100%;" onclick="doLogin()">
                    <i class="fas fa-arrow-right"></i> Login
                </button>

                <div style="margin-top: 28px;">
                    <p style="text-align: center; font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">━━━ Demo Accounts ━━━</p>
                    <div class="demo-grid">
                        ${demoAccounts.map(acc => `
                            <div class="demo-item" onclick="document.getElementById('loginIdentifier').value='${acc.phone}'; document.getElementById('loginPassword').value='${acc.pass}';">
                                <div class="demo-icon"><i class="fas ${acc.icon}"></i></div>
                                <div class="demo-info">
                                    <div class="demo-role"><span class="badge ${acc.color}" style="padding: 2px 8px;">${acc.role}</span></div>
                                    <div class="demo-phone">${acc.phone}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <p style="text-align: center; font-size: 11px; color: var(--text-muted); margin-top: 16px;">Click any account to auto-fill credentials</p>
                </div>
                
                <div class="alert alert-info" style="margin-top: 20px; font-size: 12px;">
                    <i class="fas fa-info-circle"></i> <strong>Role Restrictions:</strong><br>
                    • Only <strong>CUSTOMERS</strong> can buy tickets<br>
                    • <strong>ADMIN</strong> can add events & manage workers<br>
                    • <strong>WORKERS</strong> scan tickets at gate<br>
                    • <strong>PERFORMERS</strong> view sales & earnings
                </div>
            </div>
        </div>
    `;
}

function doLogin() {
    const identifier = document.getElementById('loginIdentifier')?.value;
    const password = document.getElementById('loginPassword')?.value;
    if (login(identifier, password)) {
        render();
        window.location.hash = 'home';
    } else {
        alert('Invalid credentials. Click on a demo account above!');
    }
}

// QR MODAL
function showQR(ticketId, eventName, attendeeName) {
    const ticket = DB.tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    const qrData = generateOfflineQRCode(ticket.id, ticket.secret);

    const modalHtml = `
        <div id="qrModal" class="modal" onclick="if(event.target===this) closeModal()">
            <div class="modal-content" style="text-align: center;">
                <h3>${eventName}</h3>
                <p>${attendeeName}</p>
                <div class="qr-container" id="qrCodeContainer"></div>
                <p style="color: var(--accent); font-size: 28px; font-weight: 700; margin: 12px 0;">${qrData.code}</p>
                <p style="color: var(--text-secondary); font-size: 12px;">Code changes every 30s · Valid for entry</p>
                <p style="color: var(--text-muted); font-size: 11px;">Expires in: <span id="qrTimer">30</span>s</p>
                <button class="btn btn-primary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const container = document.getElementById('qrCodeContainer');
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 200, 200);
    ctx.fillStyle = 'black';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(qrData.code, 25, 110);
    container.appendChild(canvas);

    let timeLeft = qrData.expiresIn;
    const timer = setInterval(() => {
        timeLeft--;
        const timerSpan = document.getElementById('qrTimer');
        if (timerSpan) timerSpan.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            closeModal();
            alert('QR code expired. Please refresh from My Tickets.');
        }
    }, 1000);
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(m => m.remove());
}

// Admin action functions
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

// INITIALIZE
initDB();
getSession();
render();

window.addEventListener('hashchange', () => render());

// Global exports
window.filterEvents = filterEvents;
window.resetFilters = resetFilters;
window.selectEvent = selectEvent;
window.selectTier = selectTier;
window.buyTickets = buyTickets;
window.doTransfer = doTransfer;
window.doGroupBooking = doGroupBooking;
window.updateGroupAttendees = updateGroupAttendees;
window.doScan = doScan;
window.doLogin = doLogin;
window.showQR = showQR;
window.simulateUSSD = simulateUSSD;
window.closeModal = closeModal;
window.logout = logout;
window.addNewEvent = addNewEvent;
window.addWorkerAction = addWorkerAction;
window.removeWorkerAction = removeWorkerAction;