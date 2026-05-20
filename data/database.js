// ============================================================
//  DATABASE MANAGEMENT with Sample Ticket Data
// ============================================================

window.DB = {
    users: [
        { id: "u1", name: "Eric Niyomugabo", phone: "+250788123456", email: "customer@tiketirw.com", password: "pass123", role: "customer", avatar: "👨", roleColor: "green" },
        { id: "u2", name: "Admin User", phone: "+250788000001", email: "admin@tiketirw.com", password: "admin123", role: "admin", avatar: "👑", roleColor: "purple" },
        { id: "u3", name: "John Muwanga", phone: "+250788000002", email: "worker@tiketirw.com", password: "worker123", role: "worker", avatar: "🛡️", roleColor: "blue" },
        { id: "u4", name: "Michael Jackson", phone: "+250788000003", email: "performer@tiketirw.com", password: "performer123", role: "performer", performerId: "p1", avatar: "🎤", roleColor: "orange" },
        { id: "u5", name: "Burna Boy", phone: "+250788000004", email: "burna@performer.com", password: "performer123", role: "performer", performerId: "p2", avatar: "🔥", roleColor: "orange" }
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
    ussdCodes: []
};

const TIERS = {
    regular: { name: "Regular", multiplier: 1, benefits: "Standard entry", color: "info" },
    vip: { name: "VIP", multiplier: 2.5, benefits: "VIP lounge, Fast entry", color: "warning" },
    vvip: { name: "VVIP", multiplier: 5, benefits: "Backstage access, Meet & Greet", color: "danger" }
};

// Sample events with realistic ticket sales
const DEFAULT_EVENTS = [
    { id: "ev1", name: "Kigali Jazz & Soul Night", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=300&fit=crop", locationId: "loc1", date: "2025-06-14", time: "18:00", basePrice: 5000, tiers: { regular: true, vip: true, vvip: true }, category: "Music", performerId: "p1", performerName: "Michael Jackson", totalCapacity: 500, sold: { regular: 245, vip: 68, vvip: 12 } },
    { id: "ev2", name: "APR FC vs Rayon Sports", image: "https://images.unsplash.com/photo-1459865264687-287d68a4d2c5?w=500&h=300&fit=crop", locationId: "loc2", date: "2025-06-20", time: "15:00", basePrice: 2000, tiers: { regular: true, vip: true, vvip: false }, category: "Sports", performerId: null, performerName: "APR FC", totalCapacity: 1200, sold: { regular: 890, vip: 145, vvip: 35 } },
    { id: "ev3", name: "Afrobeats Summer Fest", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&h=300&fit=crop", locationId: "loc3", date: "2025-06-28", time: "20:00", basePrice: 15000, tiers: { regular: true, vip: true, vvip: true }, category: "Music", performerId: "p2", performerName: "Burna Boy", totalCapacity: 800, sold: { regular: 520, vip: 156, vvip: 45 } },
    { id: "ev4", name: "Rwanda Cultural Gala", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad9a6c3?w=500&h=300&fit=crop", locationId: "loc4", date: "2025-07-06", time: "16:00", basePrice: 3500, tiers: { regular: true, vip: true, vvip: false }, category: "Culture", performerId: null, performerName: "Rwandan Artists", totalCapacity: 300, sold: { regular: 156, vip: 42, vvip: 8 } },
    { id: "ev5", name: "Tech Summit Rwanda", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop", locationId: "loc5", date: "2025-07-15", time: "09:00", basePrice: 25000, tiers: { regular: true, vip: true, vvip: true }, category: "Conference", performerId: null, performerName: "Tech Rwanda", totalCapacity: 400, sold: { regular: 210, vip: 78, vvip: 22 } },
    { id: "ev6", name: "Comedy Night Kigali", image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=500&h=300&fit=crop", locationId: "loc1", date: "2025-07-20", time: "19:00", basePrice: 8000, tiers: { regular: true, vip: true, vvip: false }, category: "Comedy", performerId: null, performerName: "Comedy Knights", totalCapacity: 350, sold: { regular: 178, vip: 45, vvip: 12 } },
    { id: "ev7", name: "Rwandan Film Festival", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&h=300&fit=crop", locationId: "loc4", date: "2025-07-25", time: "14:00", basePrice: 6000, tiers: { regular: true, vip: true, vvip: false }, category: "Film", performerId: null, performerName: "Rwanda Film Office", totalCapacity: 250, sold: { regular: 98, vip: 32, vvip: 5 } },
    { id: "ev8", name: "Kigali Fashion Week", image: "https://images.unsplash.com/photo-1535048933070-4c6707b3c5c2?w=500&h=300&fit=crop", locationId: "loc1", date: "2025-08-02", time: "18:00", basePrice: 12000, tiers: { regular: true, vip: true, vvip: true }, category: "Fashion", performerId: null, performerName: "Kigali Fashion", totalCapacity: 600, sold: { regular: 340, vip: 89, vvip: 23 } },
    { id: "ev9", name: "Marathon Rwanda 2025", image: "https://images.unsplash.com/photo-1530482817083-29ae3f4c9f6b?w=500&h=300&fit=crop", locationId: "loc2", date: "2025-08-10", time: "06:00", basePrice: 3000, tiers: { regular: true, vip: false, vvip: false }, category: "Sports", performerId: null, performerName: "Rwanda Athletics", totalCapacity: 2000, sold: { regular: 1250, vip: 0, vvip: 0 } },
    { id: "ev10", name: "New Year's Eve Gala", image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=500&h=300&fit=crop", locationId: "loc3", date: "2025-12-31", time: "20:00", basePrice: 35000, tiers: { regular: true, vip: true, vvip: true }, category: "Party", performerId: "p1", performerName: "Michael Jackson", totalCapacity: 1000, sold: { regular: 450, vip: 120, vvip: 35 } }
];

// Generate sample tickets for each event
function generateSampleTickets() {
    const sampleTickets = [];
    const customerId = "u1";
    const customerName = "Eric Niyomugabo";
    
    // For each event, generate some sample tickets
    DEFAULT_EVENTS.forEach(event => {
        // Generate regular tickets
        for (let i = 0; i < Math.min(event.sold.regular, 5); i++) {
            const ticketSecret = Math.random().toString(36).substring(2, 15) + Date.now() + i;
            sampleTickets.push({
                id: "TKT-" + event.id + "-REG-" + i + Math.random().toString(36).substr(2, 4),
                eventId: event.id,
                eventName: event.name,
                eventDate: event.date,
                eventTime: event.time,
                location: getLocationNameStatic(event.locationId),
                tier: "regular",
                tierName: "Regular",
                price: event.basePrice,
                ownerId: customerId,
                ownerName: customerName,
                attendeeName: `Fan ${i + 1}`,
                status: i < 3 ? "active" : "used",
                secret: ticketSecret,
                purchasedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
            });
        }
        
        // Generate VIP tickets if event has VIP tier
        if (event.tiers.vip && event.sold.vip > 0) {
            for (let i = 0; i < Math.min(event.sold.vip, 3); i++) {
                const ticketSecret = Math.random().toString(36).substring(2, 15) + Date.now() + i;
                sampleTickets.push({
                    id: "TKT-" + event.id + "-VIP-" + i + Math.random().toString(36).substr(2, 4),
                    eventId: event.id,
                    eventName: event.name,
                    eventDate: event.date,
                    eventTime: event.time,
                    location: getLocationNameStatic(event.locationId),
                    tier: "vip",
                    tierName: "VIP",
                    price: event.basePrice * 2.5,
                    ownerId: customerId,
                    ownerName: customerName,
                    attendeeName: `VIP Guest ${i + 1}`,
                    status: i < 2 ? "active" : "used",
                    secret: ticketSecret,
                    purchasedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
                });
            }
        }
        
        // Generate VVIP tickets if event has VVIP tier
        if (event.tiers.vvip && event.sold.vvip > 0) {
            for (let i = 0; i < Math.min(event.sold.vvip, 2); i++) {
                const ticketSecret = Math.random().toString(36).substring(2, 15) + Date.now() + i;
                sampleTickets.push({
                    id: "TKT-" + event.id + "-VVIP-" + i + Math.random().toString(36).substr(2, 4),
                    eventId: event.id,
                    eventName: event.name,
                    eventDate: event.date,
                    eventTime: event.time,
                    location: getLocationNameStatic(event.locationId),
                    tier: "vvip",
                    tierName: "VVIP",
                    price: event.basePrice * 5,
                    ownerId: customerId,
                    ownerName: customerName,
                    attendeeName: `VVIP Guest ${i + 1}`,
                    status: "active",
                    secret: ticketSecret,
                    purchasedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
                });
            }
        }
    });
    
    return sampleTickets;
}

function getLocationNameStatic(locationId) {
    const locations = {
        loc1: "Kigali Convention Centre",
        loc2: "Amahoro National Stadium",
        loc3: "BK Arena",
        loc4: "Kandt House Museum",
        loc5: "Intare Conference Arena"
    };
    return locations[locationId] || "Venue";
}

// Generate sample scans
function generateSampleScans() {
    const sampleScans = [];
    const events = DEFAULT_EVENTS;
    
    for (let i = 0; i < 20; i++) {
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const randomDay = Math.floor(Math.random() * 10);
        const randomHour = Math.floor(Math.random() * 12) + 10;
        sampleScans.push({
            id: Date.now() - i * 100000,
            ticketId: "SCAN-" + i,
            eventName: randomEvent.name,
            attendee: `Guest ${i + 1}`,
            timestamp: `${randomEvent.date} ${randomHour}:${Math.floor(Math.random() * 60)}`,
            scanner: "Gate Worker John",
            method: Math.random() > 0.5 ? "QR" : "USSD"
        });
    }
    
    return sampleScans;
}

function initDB() {
    const saved = localStorage.getItem('tiketirw_complete_v7');
    if (saved) {
        const parsed = JSON.parse(saved);
        window.DB = { ...window.DB, ...parsed };
    } else {
        window.DB.events = DEFAULT_EVENTS;
        window.DB.tickets = generateSampleTickets();
        window.DB.scans = generateSampleScans();
        window.DB.ussdCodes = [];
        saveDB();
    }
}

function saveDB() {
    localStorage.setItem('tiketirw_complete_v7', JSON.stringify({
        users: window.DB.users,
        locations: window.DB.locations,
        events: window.DB.events,
        tickets: window.DB.tickets,
        scans: window.DB.scans,
        ussdCodes: window.DB.ussdCodes
    }));
}

// Helper function to get location name (for use in other modules)
function getLocationName(locationId) {
    const location = window.DB.locations.find(l => l.id === locationId);
    return location?.name || "Venue";
}

// Ticket Purchase Function
function purchaseTicket(eventId, tier, quantity, attendeeNames = []) {
    if (!canBuyTickets()) {
        return { success: false, msg: "Only customers can purchase tickets. Please login with a customer account." };
    }
    
    const event = window.DB.events.find(e => e.id === eventId);
    if (!event) return { success: false, msg: "Event not found" };

    // Anti-cheat: Check for duplicate attendee names
    const uniqueNames = new Set(attendeeNames.map(n => n.trim().toLowerCase()));
    if (attendeeNames.length !== uniqueNames.size) {
        return { success: false, msg: "Each attendee must have a unique name. No duplicate names allowed." };
    }

    const price = event.basePrice * TIERS[tier].multiplier;
    const currentSold = (event.sold?.regular || 0) + (event.sold?.vip || 0) + (event.sold?.vvip || 0);
    const available = event.totalCapacity - currentSold;
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
    window.DB.tickets.push(...newTickets);
    if (!event.sold) event.sold = { regular: 0, vip: 0, vvip: 0 };
    event.sold[tier] = (event.sold[tier] || 0) + quantity;
    saveDB();
    
    // Generate USSD codes for non-smartphone access
    const ussdCodes = [];
    for (const ticket of newTickets) {
        const ussd = generateUSSDCode(ticket.id);
        ussdCodes.push(ussd);
    }
    
    return { success: true, total: quantity * price, tickets: newTickets, ussdCodes: ussdCodes };
}

function getUserTickets() {
    if (!currentUser) return [];
    return window.DB.tickets.filter(t => t.ownerId === currentUser.id);
}

function transferTicket(ticketId, targetPhone) {
    if (!canBuyTickets()) return false;
    const ticket = window.DB.tickets.find(t => t.id === ticketId && t.ownerId === currentUser?.id && t.status === "active");
    if (!ticket) return false;
    const targetUser = window.DB.users.find(u => u.phone === targetPhone && u.role === 'customer');
    if (!targetUser) return false;
    ticket.ownerId = targetUser.id;
    ticket.ownerName = targetUser.name;
    ticket.status = "transferred";
    saveDB();
    return true;
}

function validateTicket(input) {
    // Check if it's a USSD code (6 digits)
    if (/^\d{6}$/.test(input)) {
        return validateUSSDCode(input);
    }
    
    const ticket = window.DB.tickets.find(t => t.id === input || t.secret === input);
    if (!ticket) return { valid: false, reason: "Ticket not found" };

    const qrData = generateOfflineQRCode(ticket.id, ticket.secret);
    if (input !== ticket.id && input !== qrData.code && input !== ticket.secret) {
        return { valid: false, reason: "Invalid QR code (expired or fake)" };
    }

    if (ticket.status === "used") return { valid: false, reason: "Already scanned" };
    if (ticket.status === "transferred") return { valid: false, reason: "Transferred to another user" };

    ticket.status = "used";
    if (!window.DB.scans) window.DB.scans = [];
    window.DB.scans.unshift({
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

function getAdminStats() {
    const totalRevenue = window.DB.tickets.reduce((sum, t) => sum + t.price, 0);
    const activeTickets = window.DB.tickets.filter(t => t.status === "active").length;
    return {
        totalEvents: window.DB.events.length,
        totalSold: window.DB.tickets.length,
        totalRevenue,
        activeTickets,
        workers: window.DB.users.filter(u => u.role === 'worker').length
    };
}

function getPerformerStats(performerId) {
    const myEvents = window.DB.events.filter(e => e.performerId === performerId);
    const myTickets = window.DB.tickets.filter(t => myEvents.some(e => e.id === t.eventId));
    
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
    
    // Also count from event.sold for events without ticket records
    for (const event of myEvents) {
        if (event.sold) {
            if (regularSold === 0 && event.sold.regular) regularSold = event.sold.regular;
            if (vipSold === 0 && event.sold.vip) vipSold = event.sold.vip;
            if (vvipSold === 0 && event.sold.vvip) vvipSold = event.sold.vvip;
            
            if (regularRevenue === 0 && event.sold.regular) regularRevenue = event.sold.regular * event.basePrice;
            if (vipRevenue === 0 && event.sold.vip) vipRevenue = event.sold.vip * (event.basePrice * 2.5);
            if (vvipRevenue === 0 && event.sold.vvip) vvipRevenue = event.sold.vvip * (event.basePrice * 5);
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
    window.DB.events.push(newEvent);
    saveDB();
    return newEvent;
}

function deleteEvent(eventId) {
    window.DB.events = window.DB.events.filter(e => e.id !== eventId);
    saveDB();
}

function addWorker(name, phone, email, password) {
    const newWorker = {
        id: "u" + Date.now(),
        name, phone, email, password: password || "worker123",
        role: "worker",
        avatar: "🛡️"
    };
    window.DB.users.push(newWorker);
    saveDB();
    return newWorker;
}

function deleteUser(userId) {
    window.DB.users = window.DB.users.filter(u => u.id !== userId);
    saveDB();
}

// Make getLocationName globally available
window.getLocationName = getLocationName;