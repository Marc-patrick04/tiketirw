// ============================================================
//  WALLET PAGE (Customer only)
// ============================================================

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
            const ussdCode = window.DB.ussdCodes?.find(u => u.ticketId === ticket.id && !u.used);
            const ussdHtml = ussdCode ? `<div style="margin-top: 8px;"><span class="badge badge-info">📱 USSD Code: *724*${ussdCode.code}# (valid 5min)</span></div>` : '';
            return `
                <div class="ticket-item">
                    <div style="flex: 1;">
                        <div style="font-weight: 700;">${ticket.eventName}</div>
                        <div style="font-size: 12px; color: var(--text-secondary);">
                            <i class="fas fa-map-marker-alt"></i> ${ticket.location} | ${ticket.eventDate}
                        </div>
                        <div style="font-size: 12px; margin-top: 4px;">
                            <span class="badge ${ticket.tier === 'regular' ? 'badge-info' : (ticket.tier === 'vip' ? 'badge-warning' : 'badge-danger')}">${ticket.tierName}</span>
                            <span> Attendee: ${ticket.attendeeName}</span>
                            <span class="badge ${ticket.status === 'active' ? 'badge-success' : 'badge-danger'}">${ticket.status}</span>
                        </div>
                        ${ussdHtml}
                    </div>
                    ${ticket.status === 'active' ? `
                        <div>
                            <button class="btn btn-outline btn-sm" onclick="showQR('${ticket.id}', '${ticket.eventName}', '${ticket.attendeeName}')">
                                <i class="fas fa-qrcode"></i> Show QR
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('')}
    `;
}