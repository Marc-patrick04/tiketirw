// ============================================================
//  QR CODE GENERATION (TOTP - Works Offline)
// ============================================================

function generateOfflineQRCode(ticketId, secret, currentTime = Date.now()) {
    const timeSlice = Math.floor(currentTime / 30000); // Changes every 30 seconds
    const hash = (ticketId + secret + timeSlice).split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    const code = Math.abs(hash % 1000000).toString().padStart(6, '0');
    return { 
        code, 
        timeSlice, 
        expiresIn: 30 - (Math.floor(Date.now() / 1000) % 30) 
    };
}

function generateUSSDCode(ticketId) {
    const code = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const expiryTime = Date.now() + (5 * 60 * 1000); // 5 minutes expiry
    
    if (!window.DB.ussdCodes) window.DB.ussdCodes = [];
    window.DB.ussdCodes.push({
        ticketId: ticketId,
        code: code,
        expiry: expiryTime,
        used: false
    });
    
    // Clean old expired codes
    window.DB.ussdCodes = window.DB.ussdCodes.filter(c => c.expiry > Date.now() && !c.used);
    if (typeof saveDB === 'function') saveDB();
    
    return { code, expiresIn: 5 };
}

function validateUSSDCode(code) {
    const ussdEntry = window.DB.ussdCodes?.find(c => c.code === code && !c.used && c.expiry > Date.now());
    if (!ussdEntry) return { valid: false, reason: "Invalid or expired USSD code" };
    
    const ticket = window.DB.tickets.find(t => t.id === ussdEntry.ticketId);
    if (!ticket) return { valid: false, reason: "Ticket not found" };
    if (ticket.status === "used") return { valid: false, reason: "Ticket already used" };
    
    ticket.status = "used";
    ussdEntry.used = true;
    
    if (!window.DB.scans) window.DB.scans = [];
    window.DB.scans.unshift({
        id: Date.now(),
        ticketId: ticket.id,
        eventName: ticket.eventName,
        attendee: ticket.attendeeName,
        timestamp: new Date().toLocaleString(),
        method: "USSD"
    });
    if (typeof saveDB === 'function') saveDB();
    
    return { valid: true, ticket };
}